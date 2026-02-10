(ns cljs-thread.strategy.fat-kernel
  "Strategy 5: Fat Kernel — Zero-Config Self-Extracting Worker Runtime.

   Instead of booting workers with a minimal bootstrap that must then
   load scripts, this strategy ships the ENTIRE cljs-thread runtime
   inline in the blob/eval worker. Workers wake up immediately functional
   — they can process `in`, `future`, `pmap`, sync, and mesh messaging
   without any `importScripts` or configuration.

   The kernel source is obtained by:
   - Browser: fetch()ing the already-loaded <script> tags (cache hit)
   - Node: fs.readFileSync(__filename)

   The source is cached in an atom. Every subsequent worker creation is
   pure in-memory (no I/O): prepend init-data + origin → Blob → Worker.

   User app code arrives on-demand via catch-and-load when a worker evals
   a function that references app-specific vars and hits a ReferenceError.

   Strategy propagation: child workers receive the kernel source as
   globalThis.__cljs_thread_kernel_source (browser) or via workerData
   (Node), so they can create their own blob/eval workers for sub-spawns.

   Browser: Blob URL workers (no SW dependency when SAB sync is available)
   Node: eval workers via worker_threads"
  (:require
   [cljs-thread.strategy.common :as common]
   [cljs-thread.platform :as p]
   [cljs-thread.state :as s]
   [cljs-thread.env :as e]
   [cljs-thread.util :as u]
   [clojure.edn :as edn]))

;; ---------------------------------------------------------------------------
;; State
;; ---------------------------------------------------------------------------

;; Cached kernel source — fetched/read once, reused for all workers
(defonce ^:private kernel-source (atom nil))

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
(defonce ^:private kernel-origin (atom nil))
(defonce ^:private loadable-modules-config (atom nil))
;; Whether to include kernel source in workers for child-spawning
(defonce ^:private propagate-source? (atom true))

;; ---------------------------------------------------------------------------
;; Kernel source detection — Browser
;; ---------------------------------------------------------------------------

(defn- fetch-text-sync
  "Fetch a URL as text synchronously. Uses sync XHR on the main thread.
   Relies on browser HTTP cache for speed (the scripts were already loaded
   as <script> tags). Returns nil on failure."
  [url]
  (try
    (let [xhr (js/XMLHttpRequest.)]
      (.open xhr "GET" url false)
      (.send xhr)
      (when (= 200 (.-status xhr))
        (.-responseText xhr)))
    (catch :default _ nil)))

(defn- detect-base-url-from-scripts
  "Detect the base URL by examining <script> tags on the page.
   Returns the directory URL of the first script."
  []
  (when (and (exists? js/document)
             (exists? js/document.querySelectorAll))
    (let [scripts (array-seq (.querySelectorAll js/document "script[src]"))
          srcs (keep #(.-src %) scripts)]
      (when-let [src (first srcs)]
        (common/detect-base-url src)))))

(defn- detect-kernel-from-manifest
  "Try to fetch and parse manifest.edn from the build output directory.
   Returns a map {:kernel-urls [...] :screen-name \"...\"} or nil.

   shadow-cljs writes manifest.edn to :output-dir with entries like:
     [{:module-id :kernel :output-name \"kernel.js\" ...}
      {:module-id :shared :output-name \"shared.js\" ...}
      {:module-id :screen :output-name \"screen.js\" ...}
      {:module-id :core   :output-name \"core.js\" ...}]

   IMPORTANT: In code-split builds, :shared and :screen modules use the
   browser bootstrap (requires document). The :core module uses the
   web-worker bootstrap (uses self, importScripts). For blob workers we
   MUST use :core as the kernel source — it is self-contained and
   worker-safe."
  [base-url]
  (when-let [manifest-text (fetch-text-sync (str base-url "manifest.edn"))]
    (try
      (let [modules (edn/read-string manifest-text)
            by-id (into {} (map (juxt :module-id identity)) modules)
            kernel-mod (:kernel by-id)
            shared-mod (:shared by-id)
            screen-mod (:screen by-id)
            core-mod (:core by-id)]
        (cond
          ;; Dedicated :kernel module exists — use kernel.js as the runtime.
          ;; In code-split builds with a kernel module, the kernel module
          ;; should also be compiled with :web-worker true for worker safety.
          kernel-mod
          {:kernel-urls [(str base-url (:output-name kernel-mod))]
           :screen-name (when screen-mod (:output-name screen-mod))}

          ;; Standard code-split: use :core module (has worker-safe bootstrap)
          ;; :core is self-contained in :none mode, and includes shared deps
          ;; in :advanced mode. :shared has browser bootstrap — unsafe for blobs.
          core-mod
          {:kernel-urls [(str base-url (:output-name core-mod))]
           :screen-name (when screen-mod (:output-name screen-mod))}

          ;; Single-module build — the only module IS the runtime
          shared-mod
          {:kernel-urls [(str base-url (:output-name shared-mod))]
           :screen-name nil}

          :else nil))
      (catch :default _ nil))))

(defn- detect-kernel-from-script-tags
  "Fallback: detect kernel scripts from <script> tags on the page.
   Without a manifest, we don't know which script has the worker-safe
   bootstrap. In a single-module build, the only script is the kernel.
   In a code-split build, we can't safely pick — return nil so the
   caller falls back to other detection methods or error."
  []
  (when (and (exists? js/document)
             (exists? js/document.querySelectorAll))
    (let [scripts (array-seq (.querySelectorAll js/document "script[src]"))
          srcs (vec (keep #(.-src %) scripts))]
      (cond
        ;; No scripts found
        (empty? srcs)
        nil

        ;; Single script — it IS the runtime (non-split build)
        ;; In a single-module build, the script has web-worker bootstrap
        (= 1 (count srcs))
        {:kernel-urls srcs
         :screen-name nil}

        ;; Multiple scripts — can't determine which is worker-safe
        ;; without manifest. Return nil to trigger explicit config error.
        :else
        nil))))

(defn- extract-kernel-source-browser!
  "Detect and fetch the kernel source in a browser environment.
   Tries manifest.edn first, falls back to script tag detection."
  []
  (let [base-url (detect-base-url-from-scripts)
        detected (or (when base-url (detect-kernel-from-manifest base-url))
                     (detect-kernel-from-script-tags))]
    (when detected
      (let [{:keys [kernel-urls screen-name]} detected
            sources (keep fetch-text-sync kernel-urls)
            combined (apply str sources)]
        (when (seq combined)
          (reset! kernel-source combined)
          (let [origin (or (common/extract-origin (first kernel-urls))
                           base-url)]
            (reset! kernel-origin origin)
            ;; Store loadable-modules with ABSOLUTE URLs so blob workers
            ;; (which have null origin) can fetch them directly via XHR.
            (when screen-name
              (let [abs-url (str origin
                                 (when-not (.endsWith origin "/") "/")
                                 screen-name)]
                (reset! loadable-modules-config [abs-url])
                ;; Also update s/conf immediately — auto-detect in
                ;; core.cljs may have set a relative name; override
                ;; with absolute URL for blob worker compatibility.
                (swap! s/conf assoc :loadable-modules [abs-url])))))))))

;; ---------------------------------------------------------------------------
;; Kernel source detection — Node.js
;; ---------------------------------------------------------------------------

(defn- extract-kernel-source-node!
  "Detect and read the kernel source in a Node.js environment.
   Reads __filename for the current script's source.
   Checks for manifest.edn to find a dedicated kernel module."
  []
  (let [fs (js* "require('fs')")
        path (js* "require('path')")
        self-path (try (js* "__filename") (catch :default _ nil))]
    (when self-path
      (let [base-dir (.dirname path self-path)]
        (reset! kernel-origin base-dir)
        ;; Check for manifest.edn to find dedicated kernel module
        (let [manifest-path (.resolve path base-dir "manifest.edn")
              has-manifest (try (.existsSync fs manifest-path) (catch :default _ false))]
          (if has-manifest
            (try
              (let [manifest-text (.readFileSync fs manifest-path "utf8")
                    modules (edn/read-string manifest-text)
                    by-id (into {} (map (juxt :module-id identity)) modules)
                    kernel-mod (:kernel by-id)
                    shared-mod (:shared by-id)]
                (if kernel-mod
                  ;; Dedicated kernel module
                  (let [kernel-path (.resolve path base-dir (:output-name kernel-mod))
                        shared-path (when shared-mod
                                      (.resolve path base-dir (:output-name shared-mod)))
                        ksource (.readFileSync fs kernel-path "utf8")
                        ssource (when shared-path
                                  (try (.readFileSync fs shared-path "utf8")
                                       (catch :default _ nil)))]
                    (reset! kernel-source (strip-shebang (str ksource (or ssource "")))))
                  ;; No kernel module — read the current file
                  (reset! kernel-source (strip-shebang (.readFileSync fs self-path "utf8")))))
              (catch :default _
                (reset! kernel-source (strip-shebang (.readFileSync fs self-path "utf8")))))
            ;; No manifest — read the current file
            (reset! kernel-source (strip-shebang (.readFileSync fs self-path "utf8")))))))))

;; ---------------------------------------------------------------------------
;; Unified kernel source extraction
;; ---------------------------------------------------------------------------

(defn- extract-kernel-source!
  "Detect and cache the kernel source. Called once at first spawn.
   Browser: fetches from script tags (cache hit). Node: reads file."
  []
  (when-not @kernel-source
    (if p/node?
      (extract-kernel-source-node!)
      (extract-kernel-source-browser!))))

(defn- self-extract-source!
  "On a worker, extract kernel source for creating child workers.
   Browser: read from globalThis.__cljs_thread_kernel_source
   Node: read __filename or workerData.__kernel_source."
  []
  (when-not @kernel-source
    (if p/node?
      ;; Node workers: try to read own source
      (try
        (let [fs (js* "require('fs')")
              self-path (js* "__filename")]
          (when self-path
            (reset! kernel-source (strip-shebang (.readFileSync fs self-path "utf8")))))
        (catch :default _
          ;; eval workers don't have __filename — check workerData
          (let [wt (js* "require('worker_threads')")]
            (when-let [wd (.-workerData wt)]
              (when-let [ks (aget wd "__kernel_source")]
                (reset! kernel-source ks))))))
      ;; Browser workers: parent set this global in the blob preamble
      (when (and (exists? js/globalThis.__cljs_thread_kernel_source)
                 (some? js/globalThis.__cljs_thread_kernel_source))
        (reset! kernel-source js/globalThis.__cljs_thread_kernel_source)))))

;; ---------------------------------------------------------------------------
;; Worker creation
;; ---------------------------------------------------------------------------

(defn create-worker
  "Create a worker with the full cljs-thread runtime inlined.
   The worker wakes up immediately functional — no importScripts,
   no two-phase boot, no message queueing.

   data       - cljs-thread worker data map (:id, :conf, etc.)
   on-message - message handler function"
  [data on-message]
  ;; Lazy init: extract kernel source on first call
  (extract-kernel-source!)
  (when-not @kernel-source
    (throw (ex-info
            (str "fat-kernel: Could not detect kernel source.\n"
                 "Provide :kernel-source in strategy config or ensure\n"
                 "the build output is detectable from <script> tags.")
            {})))
  (if p/node?
    ;; Node: eval worker with full runtime source
    (let [init-data-js (common/embed-init-data-js data)
          ;; Include kernel source for child-spawning (root worker only)
          source-export (when (and @propagate-source?
                                   (#{:root :screen} (:id data)))
                          "")  ; Node uses workerData, not global export
          full-source (str init-data-js @kernel-source)
          wt (js* "require('worker_threads')")
          WorkerCls (.-Worker wt)
          worker-data (cond-> data
                        ;; Pass kernel source to root so it can spawn children
                        (and @propagate-source? (= :root (:id data)))
                        (assoc :__kernel_source @kernel-source))
          w (WorkerCls. full-source
                        #js {:eval true
                             :workerData (clj->js worker-data)})]
      (p/install-coordinator-handler! w)
      (p/install-sync-relay! w)
      (.on w "message" on-message)
      w)
    ;; Browser: blob worker with full runtime source
    (let [init-data-js (common/embed-init-data-js data)
          origin-js (if-let [origin @kernel-origin]
                      (str "globalThis.__cljs_thread_origin = "
                           (js/JSON.stringify origin) ";\n")
                      "")
          ;; Include kernel source for child-spawning (root worker only)
          source-export (if (and @propagate-source?
                                 (#{:root} (:id data)))
                          (str "globalThis.__cljs_thread_kernel_source = "
                               (js/JSON.stringify @kernel-source) ";\n")
                          "")
          ;; importScripts resolver for catch-and-load's sync XHR
          resolver common/import-scripts-resolver-js
          full-source (str init-data-js origin-js source-export
                           resolver @kernel-source)
          blob-url (common/make-blob-url full-source)
          w (js/Worker. blob-url)]
      (set! (.-onmessage w) on-message)
      ;; Revoke blob URL after worker has parsed it
      (js/setTimeout #(common/revoke-blob-url blob-url) 5000)
      w)))

;; ---------------------------------------------------------------------------
;; Integration
;; ---------------------------------------------------------------------------

(defn- install-override!
  "Set the create-worker-override atom so all spawns use fat-kernel."
  []
  (reset! p/create-worker-override
          (fn [_url data on-message]
            (create-worker data on-message))))

(defn install!
  "Install the fat-kernel strategy as the default worker creation method.

   Options (all optional — zero-config is the goal):
     :kernel-source    - Pre-loaded kernel source string. Skips detection.
     :scripts          - Vector of script URLs/paths to fetch as kernel.
     :base-url         - Base URL for resolving relative script paths.
     :loadable-modules - Module URLs for catch-and-load.
     :propagate-source - Include kernel source in root workers for
                          child-spawning (default true)."
  [& [opts]]
  (let [{:keys [kernel-source-str scripts base-url
                loadable-modules propagate]} opts]
    ;; Direct kernel source provided — skip detection
    (when kernel-source-str
      (reset! kernel-source (strip-shebang kernel-source-str)))
    ;; Explicit scripts to fetch as kernel
    (when (and (not kernel-source-str) (seq scripts))
      (let [urls (if base-url
                   (if p/node?
                     (common/resolve-node-paths base-url scripts)
                     (common/resolve-script-urls base-url scripts))
                   scripts)
            sources (if p/node?
                      (let [fs (js* "require('fs')")]
                        (mapv #(.readFileSync fs % "utf8") urls))
                      (keep fetch-text-sync urls))
            combined (apply str sources)]
        (when (seq combined)
          (reset! kernel-source combined)
          (reset! kernel-origin
                  (or (when (seq urls) (common/extract-origin (first urls)))
                      base-url)))))
    ;; No explicit source — eagerly detect now so loadable-modules
    ;; are resolved to absolute URLs before any workers are spawned.
    (when (and (not kernel-source-str) (not (seq scripts)))
      (extract-kernel-source!))
    ;; Loadable modules
    (when loadable-modules
      (reset! loadable-modules-config loadable-modules))
    ;; Propagation
    (reset! propagate-source? (if (some? propagate) propagate true)))
  ;; Install the override
  (install-override!)
  ;; Store strategy config in s/conf for propagation to child workers
  (let [strategy-conf {:type :fat-kernel}]
    (swap! s/conf assoc :__spawn-strategy strategy-conf)
    (when @loadable-modules-config
      (swap! s/conf assoc :loadable-modules @loadable-modules-config))))

(defn uninstall!
  "Remove the fat-kernel override, restoring default create-worker."
  []
  (reset! p/create-worker-override nil)
  (reset! kernel-source nil)
  (reset! kernel-origin nil)
  (reset! loadable-modules-config nil)
  (reset! propagate-source? true)
  (swap! s/conf dissoc :__spawn-strategy :loadable-modules))

;; ---------------------------------------------------------------------------
;; Auto-install on worker threads
;; ---------------------------------------------------------------------------

(defn auto-install-from-conf!
  "Check conf for fat-kernel strategy settings and re-install if found.
   Called at namespace load time on workers."
  [conf]
  (when-let [strategy (:__spawn-strategy conf)]
    (when (= (:type strategy) :fat-kernel)
      ;; Extract kernel source from our environment (we ARE the kernel)
      (self-extract-source!)
      (when @kernel-source
        (install-override!)))))

;; Auto-install when loaded on a non-screen worker
(when-not (e/in-screen?)
  (auto-install-from-conf! @s/conf))
