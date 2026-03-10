(ns cljs-thread.strategy.fat-kernel
  "Strategy 5: Fat Kernel — URL-Forward Worker Runtime.

   Workers are booted via a two-phase blob bootstrap:
     Phase 1: tiny bootstrap blob waits for a postMessage containing
              SABs, init data, and the kernel entry URL.
     Phase 2: bootstrap stashes SABs + init data on globalThis, installs
              the importScripts origin shim, then calls importScripts(kernelUrl).
              importScripts is synchronous — kernel evaluates with all globals set.

   The kernel entry URL is detected by probing <script> tag base URLs for
   manifest.edn (order-independent — works regardless of non-kernel scripts
   appearing before the kernel scripts in the HTML).

   Workers load the kernel directly from the server (HTTP cache hit) —
   no source fetching, no concatenation, no Blob containing JS source text.
   The build system's own module loading (SHADOW_ENV in dev, importScripts
   prepend in :advanced) handles dependency loading inside the kernel.

   The importScripts origin shim installed by the bootstrap resolves any
   relative importScripts calls inside the kernel (e.g. the shadow-cljs
   generated importScripts('shared.js') prepend in :advanced mode) to
   absolute URLs using __cljs_thread_origin.

   Init data is passed via the boot postMessage and set as
   globalThis.__cljs_thread_init_data BEFORE the kernel loads — semantically
   equivalent to the previous source-embedding approach but without touching
   the kernel source text.

   Strategy propagation: child workers receive the kernel URL via s/conf
   under [:__spawn-strategy :kernel-url], so they can create their own
   blob-bootstrap workers for sub-spawns.

   Node.js: workers are still eval-based (source text), unchanged.
   URL-forward is browser-only in this implementation."
  (:require
   [clojure.edn :as edn]
   [clojure.walk :refer [postwalk]]
   [cljs-thread.strategy.common :as common]
   [cljs-thread.platform :as p]
   [cljs-thread.state :as s]
   [cljs-thread.env :as e]))

;; ---------------------------------------------------------------------------
;; State
;; ---------------------------------------------------------------------------

;; Browser: absolute URL of the kernel entry module.
;; Always an http(s):// URL — never a blob: URL or source text.
(defonce ^:private kernel-url (atom nil))

;; Node only: cached kernel source string read from __filename.
;; Not used in browser; kept for Node eval-worker path.
(defonce ^:private kernel-source (atom nil))

(defonce ^:private kernel-origin (atom nil))
(defonce ^:private loadable-modules-config (atom nil))

;; ---------------------------------------------------------------------------
;; Node-only helpers
;; ---------------------------------------------------------------------------

(defn- strip-shebang
  "Remove #!/... shebang line from source. Node :node-script builds
   prepend a shebang which is invalid JS in an eval context."
  [source]
  (if (and (string? source) (.startsWith source "#!"))
    (let [nl-idx (.indexOf source "\n")]
      (if (>= nl-idx 0)
        (subs source (inc nl-idx))
        source))
    source))

;; ---------------------------------------------------------------------------
;; Manifest detection — shared browser + Node
;; ---------------------------------------------------------------------------

(defn- fetch-text-sync
  "Fetch URL as text via sync XHR. Used only for manifest.edn probing.
   Returns nil on any failure (404, network error, etc.)."
  [url]
  (try
    (let [xhr (js/XMLHttpRequest.)]
      (.open xhr "GET" url false)
      (.send xhr)
      (when (= 200 (.-status xhr))
        (.-responseText xhr)))
    (catch :default _ nil)))

(defn- resolve-dependency-chain
  "Return module output names in dependency order (deps-first).
   Excludes :screen (page-only module)."
  [mod by-id]
  (let [deps (:depends-on mod)]
    (if (seq deps)
      (into [] (concat
                (mapcat #(when-let [dep-mod (get by-id %)]
                           (when (not= % :screen)
                             (resolve-dependency-chain dep-mod by-id)))
                        deps)
                [(:output-name mod)]))
      [(:output-name mod)])))

(defn- detect-kernel-from-manifest
  "Try to fetch and parse manifest.edn from base-url.
   Returns {:kernel-urls [abs-url ...] :screen-name \"...\"} or nil.
   kernel-urls is the full dependency chain; last entry is the web-worker
   entry point."
  [base-url]
  (when-let [manifest-text (fetch-text-sync (str base-url "manifest.edn"))]
    (try
      (let [modules (edn/read-string manifest-text)
            by-id (into {} (map (juxt :module-id identity)) modules)
            ct-mod (:cljs-thread by-id)
            shared-mod (:shared by-id)
            screen-mod (:screen by-id)
            core-mod (:core by-id)
            ct-has-entries? (seq (:entries ct-mod))]
        (cond
          (and ct-mod ct-has-entries?)
          (let [chain (resolve-dependency-chain ct-mod by-id)
                urls (mapv #(str base-url %) chain)]
            ;; Workers load cljs-thread.js which contains the full runtime.
            ;; No loadable-modules needed — screen.js is not required on workers.
            {:kernel-urls urls
             :screen-name nil})

          core-mod
          (let [chain (resolve-dependency-chain core-mod by-id)
                urls (mapv #(str base-url %) chain)]
            {:kernel-urls urls
             :screen-name (when screen-mod (:output-name screen-mod))})

          shared-mod
          {:kernel-urls [(str base-url (:output-name shared-mod))]
           :screen-name (when screen-mod (:output-name screen-mod))}

          (= 1 (count modules))
          {:kernel-urls [(str base-url (:output-name (first modules)))]
           :screen-name nil}

          :else nil))
      (catch :default _ nil))))

(defn- detect-kernel-from-script-tags
  "Fallback without manifest. Single-script builds: the one script is the
   kernel. Multi-script builds: cannot pick safely — return nil."
  []
  (when (and (exists? js/document)
             (exists? js/document.querySelectorAll))
    (let [scripts (array-seq (.querySelectorAll js/document "script[src]"))
          srcs (vec (keep #(.-src %) scripts))]
      (cond
        (empty? srcs)      nil
        (= 1 (count srcs)) {:kernel-urls srcs :screen-name nil}
        :else              nil))))

;; ---------------------------------------------------------------------------
;; Browser: URL-forward kernel detection (probe approach)
;; ---------------------------------------------------------------------------

(defn- detect-kernel-url-browser!
  "Probe each <script src> base URL for manifest.edn. Stops at first hit.
   Order-independent: works regardless of which non-kernel scripts (e.g.
   confetti, CDN libraries, analytics) appear before the kernel in the HTML.

   On success populates @kernel-url, @kernel-origin, @loadable-modules-config,
   and s/conf :loadable-modules."
  []
  (when (and (exists? js/document)
             (exists? js/document.querySelectorAll))
    (let [scripts (array-seq (.querySelectorAll js/document "script[src]"))
          srcs (keep #(.-src %) scripts)]
      (or
       (some (fn [src]
               (when-let [base (common/detect-base-url src)]
                 (when-let [detected (detect-kernel-from-manifest base)]
                   (let [{:keys [kernel-urls screen-name]} detected
                         ;; Last URL = web-worker entry point.
                         ;; In :advanced mode it starts with importScripts("shared.js");
                         ;; the origin shim in the bootstrap resolves that relative call.
                         entry-url (last kernel-urls)
                         origin (or (common/detect-base-url entry-url) base)]
                     (reset! kernel-url entry-url)
                     (reset! kernel-origin origin)
                     (when screen-name
                       (let [abs-url (str origin
                                         (when-not (.endsWith origin "/") "/")
                                         screen-name)]
                         (reset! loadable-modules-config [abs-url])
                         (swap! s/conf assoc :loadable-modules [abs-url])))
                     detected))))
             srcs)
       ;; No manifest reachable from any script — try single-script fallback
       (when-let [detected (detect-kernel-from-script-tags)]
         (let [entry-url (last (:kernel-urls detected))
               origin (common/detect-base-url entry-url)]
           (reset! kernel-url entry-url)
           (reset! kernel-origin origin)
           detected))))))

;; ---------------------------------------------------------------------------
;; Node.js: kernel source extraction
;; ---------------------------------------------------------------------------

(defn- extract-kernel-source-node!
  "Detect and read the kernel source on Node.js."
  []
  (let [^js fs (js* "require('fs')")
        ^js path (js* "require('path')")
        self-path (try (js* "__filename") (catch :default _ nil))]
    (when self-path
      (let [base-dir (.dirname path self-path)]
        (reset! kernel-origin base-dir)
        (let [manifest-path (.resolve path base-dir "manifest.edn")
              has-manifest (try (.existsSync fs manifest-path) (catch :default _ false))]
          (if has-manifest
            (try
              (let [manifest-text (.readFileSync fs manifest-path "utf8")
                    modules (edn/read-string manifest-text)
                    by-id (into {} (map (juxt :module-id identity)) modules)
                    ct-mod (:cljs-thread by-id)
                    shared-mod (:shared by-id)]
                (if ct-mod
                  (let [kernel-path (.resolve path base-dir (:output-name ct-mod))
                        shared-path (when shared-mod
                                      (.resolve path base-dir (:output-name shared-mod)))
                        ksource (.readFileSync fs kernel-path "utf8")
                        ssource (when shared-path
                                  (try (.readFileSync fs shared-path "utf8")
                                       (catch :default _ nil)))]
                    (reset! kernel-source (strip-shebang (str ksource (or ssource "")))))
                  (reset! kernel-source (strip-shebang (.readFileSync fs self-path "utf8")))))
              (catch :default _
                (reset! kernel-source (strip-shebang (.readFileSync fs self-path "utf8")))))
            (reset! kernel-source (strip-shebang (.readFileSync fs self-path "utf8")))))))))

(defn- self-extract-source-node!
  "On a Node.js worker, extract kernel source for creating child workers.
   Tries __filename first, then workerData.__kernel_source as fallback."
  []
  (when-not @kernel-source
    (try
      (let [^js fs (js* "require('fs')")
            self-path (try (js* "__filename") (catch :default _ nil))]
        (when (and (string? self-path) (seq self-path))
          (reset! kernel-source (strip-shebang (.readFileSync fs self-path "utf8")))))
      (catch :default _ nil))
    (when-not @kernel-source
      (try
        (let [^js wt (js* "require('worker_threads')")]
          (when-let [wd (.-workerData wt)]
            (when-let [ks (aget wd "__kernel_source")]
              (reset! kernel-source ks))))
        (catch :default _ nil)))))

;; ---------------------------------------------------------------------------
;; Worker creation
;; ---------------------------------------------------------------------------

(defn create-worker
  "Create a worker with the cljs-thread runtime.

   Browser (URL-forward): two-phase blob bootstrap.
     Bootstrap receives SABs, init data, and kernel entry URL via postMessage.
     Stashes SABs + init data on globalThis, installs importScripts origin shim,
     calls importScripts(kernelEntryUrl). Kernel loads from server (cache hit).
     No source fetching, no kernel Blob.

   Node: eval worker with full runtime source inlined (unchanged).

   data       - cljs-thread worker data map (:id, :conf, etc.)
   on-message - message handler function"
  [data on-message]
  (if p/node?
    ;; ----- Node: eval worker with inlined source (unchanged) -----
    (do
      (when-not @kernel-source
        (extract-kernel-source-node!))
      (when-not @kernel-source
        (throw (ex-info
                (str "fat-kernel: Could not read kernel source on Node.\n"
                     "Provide :kernel-source-str or ensure __filename is set.")
                {})))
      (let [data (if-let [eargs (:eargs data)]
                   (assoc data :eargs
                          (mapv (fn [arg]
                                  (postwalk
                                   #(cond
                                      (and (some? %)
                                           (not (string? %))
                                           (not (number? %))
                                           (not (keyword? %))
                                           (not (boolean? %))
                                           (some? (unchecked-get % "shared-atom-id"))
                                           (some? (unchecked-get % "header-descriptor-idx")))
                                      (str "#cljs-thread/eve-shared-atom {:id "
                                           (unchecked-get % "shared-atom-id") " :idx "
                                           (unchecked-get % "header-descriptor-idx") "}")
                                      (and (some? %)
                                           (not (string? %))
                                           (not (number? %))
                                           (not (keyword? %))
                                           (not (boolean? %))
                                           (some? (unchecked-get % "s-atom-env")))
                                      "#cljs-thread/eve-atom {}"
                                      :else %)
                                   arg))
                                eargs))
                   data)
            init-data-js (common/embed-init-data-js data)
            full-source (str init-data-js @kernel-source)
            ^js wt (js* "require('worker_threads')")
            WorkerCls (.-Worker wt)
            ;; Pass kernel source to all workers so any can spawn children
            worker-data (cond-> data
                          @kernel-source
                          (assoc :__kernel_source @kernel-source))
            wd-js (clj->js worker-data)
            _ (when-let [eve-config @s/eve-sab-config]
                (let [sab-obj #js {"sab" (:sab eve-config)
                                   "reader-map-sab" (:reader-map-sab eve-config)
                                   "slab-sabs" (:slab-sabs eve-config)
                                   "root-sab" (:root-sab eve-config)}]
                  (unchecked-set wd-js "__eve_sab_config" sab-obj)))
            w (WorkerCls. full-source
                          #js {:eval true
                               :workerData wd-js})]
        (.on w "message" on-message)
        w))

    ;; ----- Browser: two-phase blob bootstrap, URL-forward -----
    ;;
    ;; Phase 1: bootstrap blob receives SABs + init data + kernel URL via postMessage.
    ;; Phase 2: bootstrap sets globals, installs origin shim, calls importScripts(url).
    ;;   importScripts is SYNCHRONOUS — kernel evaluates with SABs + init data already set.
    (do
      (when-not @kernel-url
        (detect-kernel-url-browser!))
      (when-not @kernel-url
        (throw (ex-info
                (str "fat-kernel: Could not detect kernel URL.\n"
                     "Provide :kernel-url in strategy config or ensure\n"
                     "manifest.edn is reachable from <script> tags.")
                {})))
      (let [origin (or @kernel-origin "")
            entry-url @kernel-url
            ;; Init data as EDN string — set on globalThis by bootstrap BEFORE
            ;; importScripts, so platform.cljs reads it correctly at kernel eval time.
            init-data-str (pr-str data)
            bootstrap-js
            (str
             "self.addEventListener('message',function __bh(e){"
             "var d=e.data;"
             "if(d&&d.__cljs_thread_boot){"
             "self.removeEventListener('message',__bh);"
             ;; 1. SABs before kernel — defonce atoms need them at eval time
             "if(d.__eve_sab_config){"
             "self.__eve_sab_config_sync=d.__eve_sab_config;}"
             ;; 2. Init data before kernel — platform.cljs reads at namespace eval
             "if(d.__init_data){"
             "globalThis.__cljs_thread_init_data=d.__init_data;}"
             ;; 3. Origin shim — blob workers have null origin; relative
             ;;    importScripts calls fail without this. Also handles
             ;;    shadow-cljs :advanced importScripts('shared.js') prepend.
             "var origin=d.__origin||'';"
             "self.__cljs_thread_origin=origin;"
             "var _orig=self.importScripts;"
             "self.importScripts=function(){"
             "var args=Array.from(arguments).map(function(u){"
             "if(!origin||/^(https?:|blob:)/.test(u))return u;"
             "return u.charAt(0)==='/'?origin+u:origin+u;"
             "});"
             "return _orig.apply(self,args);"
             "};"
             ;; 4. Stub document/window — shadow-cljs checks `if (!doc)` at load
             "if(typeof document==='undefined'){"
             "self.document={readyState:'complete',"
             "querySelector:function(){return null;},"
             "querySelectorAll:function(){return[];},"
             "createElement:function(){return{};},"
             "head:{appendChild:function(){}},"
             "body:{appendChild:function(){}}};"
             "self.window=self;"
             ;; Pre-stub globals that JS libraries may capture at module-init time,
             ;; before dom/install! runs. These will be replaced by proper proxies
             ;; once the worker is initialized (dom/install! uses Object.defineProperty).
             ;;
             ;; rAF/cAF — native worker rAF throws NotSupportedError; d3-timer
             ;; captures window.requestAnimationFrame at module scope (Phase 1).
             ;;
             ;; Use indirection via __rAF_delegate / __cAF_delegate so that
             ;; dom/install! (Phase 2) can swap in the real screen proxy without
             ;; d3 needing to re-read window.requestAnimationFrame.  Libraries
             ;; that did `.bind(window)` on the stub will still call
             ;; self.__rAF_delegate, which by then points to make-raf-fn.
             "self.__rAF_delegate=function(cb){return setTimeout(cb,17);};"
             "self.__cAF_delegate=clearTimeout;"
             "self.requestAnimationFrame=function(cb){return self.__rAF_delegate(cb);};"
             "self.cancelAnimationFrame=function(id){return self.__cAF_delegate(id);};"
             ;; matchMedia — checked by accessibility and responsive libs at init.
             ;; Returns a non-matching stub so feature-detection falls back safely.
             "if(typeof matchMedia==='undefined'){"
             "self.matchMedia=function(q){"
             "return{matches:false,media:q,onchange:null,"
             "addListener:function(){},removeListener:function(){},"
             "addEventListener:function(){},removeEventListener:function(){},"
             "dispatchEvent:function(){return false;}};};}"
             ;; screen — size/orientation; read by rendering/UI libs at init.
             "if(typeof screen==='undefined'){"
             "self.screen={width:1920,height:1080,availWidth:1920,availHeight:1080,"
             "colorDepth:24,pixelDepth:24,"
             "orientation:{type:'landscape-primary',angle:0}};}"
             ;; devicePixelRatio — 1 is a safe default for rendering math.
             "if(typeof devicePixelRatio==='undefined'){self.devicePixelRatio=1;}"
             ;; Viewport dimensions — 0 prevents NaN math; proxy provides real values.
             "if(typeof innerWidth==='undefined'){"
             "self.innerWidth=0;self.innerHeight=0;}"
             ;; Scroll position
             "if(typeof scrollX==='undefined'){"
             "self.scrollX=0;self.scrollY=0;"
             "self.pageXOffset=0;self.pageYOffset=0;}"
             ;; Observer constructors — no-op stubs so libs that construct observers
             ;; at init time don't crash.  Real proxy constructors replace these
             ;; once dom/install! runs.
             "if(typeof MutationObserver==='undefined'){"
             "self.MutationObserver=function(cb){"
             "this.observe=function(){};this.disconnect=function(){};"
             "this.takeRecords=function(){return[];};};}"
             "if(typeof ResizeObserver==='undefined'){"
             "self.ResizeObserver=function(cb){"
             "this.observe=function(){};this.unobserve=function(){};"
             "this.disconnect=function(){};};}"
             "if(typeof IntersectionObserver==='undefined'){"
             "self.IntersectionObserver=function(cb,opts){"
             "this.observe=function(){};this.unobserve=function(){};"
             "this.disconnect=function(){};this.takeRecords=function(){return[];};};}"
             "}"
             ;; 5. Load kernel from real server URL (absolute http:// URL).
             ;;    HTTP cache hit — script was already loaded as <script> tag.
             "importScripts(d.__kernel_url);"
             "}});")
            bootstrap-url (common/make-blob-url bootstrap-js)
            w (js/Worker. bootstrap-url)]
        (set! (.-onmessage w) on-message)
        (let [boot-msg #js {"__cljs_thread_boot" true
                            "__kernel_url"  entry-url
                            "__origin"      origin
                            "__init_data"   init-data-str}]
          (when-let [eve-config @s/eve-sab-config]
            (unchecked-set boot-msg "__eve_sab_config"
                           #js {"sab" (:sab eve-config)
                                "reader-map-sab" (:reader-map-sab eve-config)
                                "slab-sabs" (:slab-sabs eve-config)
                                "root-sab" (:root-sab eve-config)}))
          (.postMessage w boot-msg))
        ;; Only bootstrap is a Blob URL — revoke after boot.
        ;; Kernel URL is a real server URL, never revoked.
        (js/setTimeout #(common/revoke-blob-url bootstrap-url) 10000)
        w))))

;; ---------------------------------------------------------------------------
;; Integration
;; ---------------------------------------------------------------------------

(defn- install-override!
  "Set the create-worker-override so all spawns use fat-kernel."
  []
  (reset! p/create-worker-override
          (fn [_url data on-message]
            (create-worker data on-message))))

(defn install!
  "Install the fat-kernel strategy as the default worker creation method.

   Options (all optional — zero-config is the goal):
     :kernel-url        - Explicit kernel entry URL (browser). Skips detection.
     :kernel-source-str - Pre-loaded kernel source string (Node.js). Skips detection.
     :base-url          - Base URL/dir (currently unused; reserved for future use).
     :loadable-modules  - Module URLs for catch-and-load.
     :propagate         - Ignored; URLs propagate via s/conf automatically."
  [& [opts]]
  ;; Use get to avoid shadowing the kernel-url atom with a destructured local
  (let [kurl             (get opts :kernel-url)
        kernel-source-str (get opts :kernel-source-str)
        loadable-mods    (get opts :loadable-modules)]
    ;; Explicit kernel URL (browser)
    (when kurl
      (reset! kernel-url kurl)
      (reset! kernel-origin (common/detect-base-url kurl)))
    ;; Explicit source string (Node.js)
    (when kernel-source-str
      (reset! kernel-source (strip-shebang kernel-source-str)))
    ;; Zero-config: detect eagerly so loadable-modules resolve to absolute URLs
    (when (and (not kurl) (not kernel-source-str))
      (if p/node?
        (when-not @kernel-source (extract-kernel-source-node!))
        (when-not @kernel-url    (detect-kernel-url-browser!))))
    ;; Explicit loadable-modules override
    (when loadable-mods
      (reset! loadable-modules-config loadable-mods)))
  (install-override!)
  ;; Store strategy config in s/conf for propagation to child workers via init data
  (let [strategy-conf (cond-> {:type :fat-kernel}
                        @kernel-url (assoc :kernel-url @kernel-url))]
    (swap! s/conf assoc :__spawn-strategy strategy-conf)
    (when @loadable-modules-config
      (swap! s/conf assoc :loadable-modules @loadable-modules-config))))

(defn uninstall!
  "Remove the fat-kernel override, restoring default create-worker."
  []
  (reset! p/create-worker-override nil)
  (reset! kernel-url nil)
  (reset! kernel-source nil)
  (reset! kernel-origin nil)
  (reset! loadable-modules-config nil)
  (swap! s/conf dissoc :__spawn-strategy :loadable-modules))

;; ---------------------------------------------------------------------------
;; Auto-detection for zero-config init!
;; ---------------------------------------------------------------------------

(defn detect-core-connect-string
  "Auto-detect the core-connect-string.

   Browser: probes <script> tags for manifest.edn (via detect-kernel-url-browser!),
            returns the pathname of the detected kernel entry URL.
   Node: returns __filename."
  []
  (if p/node?
    (try (js* "__filename") (catch :default _ nil))
    (do
      (when-not @kernel-url (detect-kernel-url-browser!))
      (when-let [url @kernel-url]
        (try
          (.-pathname (js/URL. url))
          (catch :default _ url))))))

;; ---------------------------------------------------------------------------
;; Public API for testing / debugging
;; ---------------------------------------------------------------------------

(defn get-kernel-url
  "Return the detected kernel entry URL.
   Browser: an http(s):// URL string.
   Node: nil (Node uses source text, not URLs).
   Returns nil if detection has not run or failed."
  []
  @kernel-url)

;; ---------------------------------------------------------------------------
;; Auto-install on worker threads
;; ---------------------------------------------------------------------------

(defn auto-install-from-conf!
  "Check conf for fat-kernel strategy settings and re-install if found.
   Called at namespace load time on workers.

   Browser: reads :kernel-url from [:__spawn-strategy :kernel-url].
   Node:    extracts source from own file / workerData."
  [conf]
  (when-let [strategy (:__spawn-strategy conf)]
    (when (= (name (:type strategy)) "fat-kernel")
      (if p/node?
        (self-extract-source-node!)
        (when-let [url (:kernel-url strategy)]
          (reset! kernel-url url)
          (reset! kernel-origin (common/detect-base-url url))))
      (when (or @kernel-url @kernel-source)
        (install-override!)))))

;; Auto-install when loaded on a non-screen worker
(when-not (e/in-screen?)
  (auto-install-from-conf! @s/conf))
