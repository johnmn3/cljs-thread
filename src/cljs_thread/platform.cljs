(ns cljs-thread.platform
  "Platform abstraction layer for cljs-thread.
   Provides protocols that abstract browser vs Node.js differences.
   Both browser and Node implementations are defined inline (guarded by
   runtime detection) so that a single codebase compiles for either target.
   The active platform is auto-detected at load time."
  (:require
   [cljs-thread.util :as u]
   [clojure.edn :as edn]))

;; ---------------------------------------------------------------------------
;; Platform detection (evaluated once at load time)
;; ---------------------------------------------------------------------------

(def node?
  "True when running in Node.js (main thread or worker_thread)."
  (and (exists? js/process)
       (exists? js/process.versions)
       (some? js/process.versions.node)))

;; Dynamic require of worker_threads for Node (uses js* to avoid
;; shadow-cljs static module resolution in browser builds).
(def ^:private wt
  "The Node.js worker_threads module, or nil in browser."
  (when node?
    (try (js* "require('worker_threads')") (catch :default _ nil))))

;; Cache isMainThread at load time BEFORE dom-proxy can interfere.
;; The DOM proxy installs window/document properties on globalThis which
;; can corrupt subsequent worker_threads reads on some configurations.
(def ^:private node-is-main-thread-cached?
  "Cached at module load time to be immune to dom-proxy interference.
   True on Node main thread, false on worker_threads."
  (if wt (.-isMainThread wt) false))

(def ^:dynamic sab-sync?
  "True when SAB-based sync is available in the browser.
   Requires cross-origin isolation (COOP/COEP headers).
   When true, browser workers block via Atomics.wait instead of XHR+SW.
   Can be overridden to false via `force-sw-sync!` before `init!`."
  (and (not node?)
       (exists? js/SharedArrayBuffer)
       (exists? js/Atomics)))

(def ^:private force-sw-sync-flag
  "Set to true by force-sw-sync! so that spawned workers can inherit the override."
  (atom false))

(defn force-sw-sync-requested?
  "Returns true if force-sw-sync! was called (or should be inherited)."
  []
  @force-sw-sync-flag)

(defn ^:export force-sw-sync!
  "Force the Service Worker sync path even when SharedArrayBuffer is available.
   Call BEFORE init!. Useful for testing the SW fallback with full SAB data
   structures still backed by SharedArrayBuffer.
   Propagates to spawned workers via s/conf :force-sw-sync."
  []
  (set! sab-sync? false)
  (reset! force-sw-sync-flag true))

;; ---------------------------------------------------------------------------
;; Protocols
;; ---------------------------------------------------------------------------

(defprotocol IEnv
  (-init-data [this])
  (-in-screen? [this])
  (-close-self! [this]))

(defprotocol IWorker
  (-create-worker [this url-or-path data on-message])
  (-register-coordinator [this config callback])
  (-coordinator-ready? [this]))

(defprotocol ISync
  "Sync primitives for Service Worker fallback path.
   Direct SAB sync (the primary path) doesn't use this protocol -
   it uses sync channels passed directly in messages."
  (-request [this getter opts])
  (-send-response [this payload])
  (-sleep [this ms]))

(defprotocol IMsg
  (-listen [this target handler])
  (-post-message [this target msg transferables])
  (-mk-channel [this])
  (-self-ref [this]))

;; ---------------------------------------------------------------------------
;; Browser implementation
;; ---------------------------------------------------------------------------

(defn- browser-in-screen?
  "True on the browser main thread (window context), false in Web Workers.
   Uses `(instance? js/Window js/self)` which is immune to dom-proxy —
   dom-proxy defines `window` and `document` properties on worker globalThis
   but cannot fake the prototype chain of `self`."
  []
  (and (exists? js/self)
       (exists? js/Window)
       (instance? js/Window js/self)))

(defn- resolve-url
  "Resolve a relative URL path to absolute.
   In blob workers, js/location.origin is 'null', so we use the
   __cljs_thread_origin global set by spawn strategies.
   Already-absolute URLs (http/https/blob) are returned as-is."
  [path]
  (if (and (exists? js/globalThis.__cljs_thread_origin)
           (some? js/globalThis.__cljs_thread_origin)
           (not (or (.startsWith path "http://")
                    (.startsWith path "https://")
                    (.startsWith path "blob:"))))
    (str js/globalThis.__cljs_thread_origin path)
    path))

(defn- browser-init-data []
  (cond
    ;; Init data embedded via strategy — blob/eval/kernel workers set
    ;; globalThis.__cljs_thread_init_data before loading the runtime.
    ;; Check this FIRST because kernel-URL workers have non-standard
    ;; query params (d=, s=, o=) that shouldn't be parsed as worker data.
    (and (exists? js/globalThis)
         (exists? js/globalThis.__cljs_thread_init_data)
         (some? js/globalThis.__cljs_thread_init_data))
    ;; EDN preserves original types — named workers have keyword IDs (:core),
    ;; ephemeral workers have string IDs. Do NOT convert to keyword here
    ;; (unlike Node's js->clj path) or sync request-id matching will break.
    (edn/read-string js/globalThis.__cljs_thread_init_data)
    ;; Screen (main thread with document) — always :screen
    (browser-in-screen?)
    {:id :screen}
    ;; Standard path: worker created with query params
    (seq js/location.search)
    (u/decode-qp js/location.search)
    ;; Fallback — unknown worker (no init data in query params or globalThis)
    :else {:id :worker}))

;; ---------------------------------------------------------------------------
;; Service Worker Fallback (for browsers without SAB)
;;
;; When SharedArrayBuffer is not available (no COOP/COEP headers),
;; we fall back to sync XHR requests to a Service Worker.
;; The SW acts as coordinator, matching request-ids with responses.
;; ---------------------------------------------------------------------------

(defn- browser-sw-request
  "SW-based sync request. Uses sync XHR to /intercept/request/key.js.
   The SW holds the request open until a matching response arrives."
  [getter opts env-data]
  (let [{:keys [resolve reject no-park max-time duration]} opts
        req {:request-id getter :requester (:id env-data)
             :no-park no-park :max-time max-time :duration duration}]
    (try
      (let [xhr (js/XMLHttpRequest.)]
        (.open xhr "GET"
               (resolve-url (str "/intercept/request/key.js" (u/encode-qp req)))
               (if (or (browser-in-screen?) resolve) true false))
        (.setRequestHeader xhr "cache-control" "no-cache, no-store, max-age=0")
        (when resolve
          (set! (.-onload xhr) #(resolve (edn/read-string (.-response xhr)))))
        (when reject
          (set! (.-onerror xhr) #(reject (.-status xhr))))
        (.send xhr)
        (if resolve
          xhr
          (edn/read-string (.-responseText xhr))))
      (catch :default e
        (when-not (= :repl-sync (:id env-data))
          (println :error :requesting-response :e e))))))

(defn- browser-sw-send-response
  "SW-based send-response. POSTs to /intercept/response/key.js."
  [payload env-data]
  (try
    (let [req {:responder (:id env-data)}
          xhr (js/XMLHttpRequest.)]
      (.open xhr "POST" (resolve-url (str "/intercept/response/key.js" (u/encode-qp req))))
      (.setRequestHeader xhr "Content-Type" "text/plain;charset=UTF-8")
      (.setRequestHeader xhr "cache-control" "no-cache, no-store, max-age=0")
      (.send xhr (pr-str payload))
      nil)
    (catch :default e
      (println :error :sending-response :e e))))

(defn- browser-sw-sleep
  "SW-based sleep. Uses sync XHR to /intercept/sleep/t.js."
  [ms]
  (let [xhr (js/XMLHttpRequest.)]
    (.open xhr "GET" (resolve-url (str "/intercept/sleep/t.js?" ms)) false)
    (.setRequestHeader xhr "cache-control" "no-cache, no-store, max-age=0")
    (.send xhr "request")
    nil))

;; SW registration helpers
(defn- after-sw-registration [p afn]
  (-> p
      (.then #(if (or (.-active %) (.-installing %))
                (afn %)
                (when (.-installing %)
                  (.addEventListener
                   (.-installing %) "onstatechange"
                   (partial afn %)))))))

(defn- on-sw-registration [cb else-cb]
  (-> (js/navigator.serviceWorker.getRegistration)
      (.then #(if (.-controller js/navigator.serviceWorker)
                (cb)
                (else-cb)))))

;; ---------------------------------------------------------------------------
;; Atomics-based sleep (works in both Node and Browser with SAB)
;; ---------------------------------------------------------------------------

(defn- atomics-sleep
  "Thread sleep using Atomics.wait with timeout.
   Works in both browser workers and Node worker_threads."
  [ms]
  (let [sab (js/SharedArrayBuffer. 4)
        i32 (js/Int32Array. sab)]
    (js/Atomics.wait i32 0 0 ms)
    nil))

;; ---------------------------------------------------------------------------
;; BrowserPlatform
;; ---------------------------------------------------------------------------

(defrecord BrowserPlatform [env-data-cache]
  IEnv
  (-init-data [_]
    (if-let [cached @env-data-cache]
      cached
      (let [d (browser-init-data)]
        (reset! env-data-cache d)
        d)))
  (-in-screen? [_]
    (browser-in-screen?))
  (-close-self! [_]
    (.close js/self))

  IWorker
  (-create-worker [_ url data on-message]
    (let [full-url (str (resolve-url url) (u/encode-qp data))
          w (js/Worker. full-url)]
      (set! (.-onmessage w) on-message)
      w))
  (-register-coordinator [_ config callback]
    (if sab-sync?
      ;; SAB mode: direct SAB sync doesn't need coordinator registration
      (callback)
      ;; Legacy SW mode: register service worker
      (let [sw-url (str (:sw-connect-string config "/sw.js")
                        (u/encode-qp {:id :sw}))]
        (on-sw-registration
         callback
         #(-> (js/navigator.serviceWorker.register sw-url)
              (after-sw-registration (fn [_] (callback))))))))
  (-coordinator-ready? [_]
    (if sab-sync?
      true  ;; Direct SAB sync: always ready (no coordinator needed)
      (boolean (.-controller js/navigator.serviceWorker))))

  ISync
  (-request [this getter opts]
    (if sab-sync?
      ;; Direct SAB sync doesn't use this path - handled by sync channels
      (throw (ex-info "Direct SAB sync should use sync channels, not platform request" {}))
      (browser-sw-request getter opts (-init-data this))))
  (-send-response [this payload]
    (if sab-sync?
      ;; Direct SAB sync doesn't use this path
      (throw (ex-info "Direct SAB sync should use sync channels, not platform send-response" {}))
      (browser-sw-send-response payload (-init-data this))))
  (-sleep [_ ms]
    (if sab-sync?
      (atomics-sleep ms)
      (browser-sw-sleep ms)))

  IMsg
  (-listen [_ target handler]
    (.addEventListener target "message" handler))
  (-post-message [_ target msg transferables]
    (.postMessage target msg (if transferables (clj->js transferables) #js [])))
  (-mk-channel [_]
    (let [c (js/MessageChannel.)]
      [(.-port1 c) (.-port2 c)]))
  (-self-ref [_]
    js/self))

;; ---------------------------------------------------------------------------
;; Node.js implementation
;; ---------------------------------------------------------------------------

(defn- node-in-screen?
  "Returns cached isMainThread value. Cached at load time to be
   immune to dom-proxy interference."
  []
  node-is-main-thread-cached?)

(defn- node-init-data []
  (if (node-in-screen?)
    {:id :screen}
    (if-let [wd (and wt (.-workerData wt))]
      (let [;; Save SAB config to globalThis before stripping, so
            ;; cljs-thread.eve/auto-init! can retrieve it later.
            ;; Must happen BEFORE js->clj which chokes on SAB objects
            ;; (they are (object? x) = true but lack IEmptyableCollection).
            _ (when-let [eve-cfg (aget wd "__eve_sab_config")]
                (set! js/globalThis.__eve_sab_config eve-cfg))
            ;; Strip __eve_sab_config (contains SABs that crash js->clj).
            ;; Do NOT strip __kernel_source — fat kernel needs it for child spawns.
            _ (js-delete wd "__eve_sab_config")
            d (js->clj wd :keywordize-keys true)]
        (cond-> (update d :id keyword)
          (:caller d) (update :caller keyword)))
      {:id :worker})))

(defn- node-sleep
  "Thread sleep using Atomics.wait with timeout."
  [ms]
  (let [sab (js/SharedArrayBuffer. 4)
        i32 (js/Int32Array. sab)]
    (js/Atomics.wait i32 0 0 ms)
    nil))

(defrecord NodePlatform [env-data-cache]
  IEnv
  (-init-data [_]
    (if-let [cached @env-data-cache]
      cached
      (let [d (node-init-data)]
        (reset! env-data-cache d)
        d)))
  (-in-screen? [_]
    (node-in-screen?))
  (-close-self! [_]
    (when-not (node-in-screen?)
      (js/process.exit 0)))

  IWorker
  (-create-worker [_ file-path data on-message]
    (let [WorkerCls (.-Worker wt)
          ;; Convert data to JS, then add eve-sab-config separately
          ;; (SABs can't go through clj->js - they crash js->clj on the other side)
          wd-js (clj->js (dissoc data :__eve_sab_config))
          _ (when-let [eve-cfg (:__eve_sab_config data)]
              (unchecked-set wd-js "__eve_sab_config"
                             #js {"sab" (:sab eve-cfg)
                                  "reader-map-sab" (:reader-map-sab eve-cfg)
                                  "slab-sabs" (:slab-sabs eve-cfg)
                                  "root-sab" (:root-sab eve-cfg)}))
          w (WorkerCls. file-path #js {:workerData wd-js})]
      (.on w "message" on-message)
      ;; Direct SAB sync: no coordinator handlers needed
      w))
  (-register-coordinator [_ _config callback]
    ;; Direct SAB sync: no coordinator registration needed
    (callback))
  (-coordinator-ready? [_]
    true)  ;; Direct SAB sync: always ready

  ISync
  (-request [_ _getter _opts]
    ;; Node uses direct SAB sync exclusively - this path shouldn't be called
    (throw (ex-info "Node uses direct SAB sync - platform request not supported" {})))
  (-send-response [_ _payload]
    ;; Node uses direct SAB sync exclusively
    (throw (ex-info "Node uses direct SAB sync - platform send-response not supported" {})))
  (-sleep [_ ms]
    (node-sleep ms))

  IMsg
  (-listen [_ target handler]
    (if (and target (.-on ^js target))
      (.on ^js target "message" handler)
      nil))
  (-post-message [_ target msg transferables]
    (when (and target (.-postMessage target))
      (.postMessage target msg (when transferables (clj->js transferables)))))
  (-mk-channel [_]
    (let [MC (.-MessageChannel wt)
          c (MC.)]
      [(.-port1 c) (.-port2 c)]))
  (-self-ref [_]
    (if (node-in-screen?)
      ;; Main thread: no parentPort, return a sentinel with postMessage no-op
      #js {:postMessage (fn [& _] nil)}
      (.-parentPort wt))))

;; ---------------------------------------------------------------------------
;; Runtime state & auto-initialization
;; ---------------------------------------------------------------------------

(def impl
  "Atom holding the current platform implementation."
  (atom nil))

(defn platform []
  (or @impl
      (throw (ex-info "Platform not initialized" {}))))

;; Convenience accessors
(defn init-data    []       (-init-data (platform)))
(defn in-screen?   []       (-in-screen? (platform)))
(defn close-self!  []       (-close-self! (platform)))

;; Optional override for create-worker — used by spawn strategies.
;; Holds a fn [url data on-message] -> Worker, or nil for default behavior.
;; Strategies set this atom AND store config in s/conf :__spawn-strategy
;; so child workers can re-install the override from their conf.
(defonce create-worker-override (atom nil))

(defn create-worker [url data on-message]
  (if-let [f @create-worker-override]
    (f url data on-message)
    (-create-worker (platform) url data on-message)))

(defn register-coordinator [config cb]
  (-register-coordinator (platform) config cb))

(defn coordinator-ready? []
  (-coordinator-ready? (platform)))

(defn request [getter opts]
  (-request (platform) getter opts))

(defn send-response [payload]
  (-send-response (platform) payload))

(defn sleep [ms]
  (-sleep (platform) ms))

(defn listen [target handler]
  (-listen (platform) target handler))

(defn post-message [target msg transferables]
  (-post-message (platform) target msg transferables))

(defn mk-channel []
  (-mk-channel (platform)))

(defn self-ref []
  (-self-ref (platform)))

(defn init!
  "Manually set the platform implementation."
  [platform-impl]
  (reset! impl platform-impl))

;; Auto-detect and initialize at load time
(when-not @impl
  (if node?
    (init! (->NodePlatform (atom nil)))
    (init! (->BrowserPlatform (atom nil)))))
