(ns cljs-thread.standard
  "Platform abstraction layer for cljs-thread.
   Provides protocols that abstract browser vs Node.js differences.

   This namespace handles ONLY platform differences:
   - Platform detection (browser vs Node)
   - Worker creation APIs
   - Low-level message send/receive primitives
   - Sleep primitives

   Sync protocol negotiation belongs in msg, not here."
  (:require
   [cljs-thread.util :as u]))

;; ---------------------------------------------------------------------------
;; Platform detection (evaluated once at load time)
;; ---------------------------------------------------------------------------

(def node?
  "True when running in Node.js (main thread or worker_thread)."
  (and (exists? js/process)
       (exists? js/process.versions)
       (some? js/process.versions.node)))

(def ^:private wt
  "The Node.js worker_threads module, or nil in browser."
  (when node?
    (try (js* "require('worker_threads')") (catch :default _ nil))))

(def sab-available?
  "True when SharedArrayBuffer is available."
  (exists? js/SharedArrayBuffer))

(def atomics-available?
  "True when Atomics API is available."
  (exists? js/Atomics))

;; ---------------------------------------------------------------------------
;; Protocols
;; ---------------------------------------------------------------------------

(defprotocol IEnv
  (-init-data [this])
  (-in-screen? [this])
  (-close-self! [this]))

(defprotocol IWorker
  (-create-worker [this url-or-path data on-message]))

(defprotocol IMsg
  (-listen [this target handler])
  (-post-message [this target msg transferables])
  (-mk-channel [this])
  (-self-ref [this]))

(defprotocol ISleep
  (-sleep [this ms]))

;; ---------------------------------------------------------------------------
;; Browser implementation
;; ---------------------------------------------------------------------------

(defn- browser-in-screen?
  "True on the browser main thread (window context), false in Web Workers."
  []
  (and (exists? js/self)
       (exists? js/Window)
       (instance? js/Window js/self)))

(defn- resolve-url
  "Resolve a relative URL path to absolute."
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
    (and (exists? js/globalThis)
         (exists? js/globalThis.__cljs_thread_init_data)
         (some? js/globalThis.__cljs_thread_init_data))
    js/globalThis.__cljs_thread_init_data

    (browser-in-screen?)
    {:id :screen}

    (seq js/location.search)
    (u/decode-qp js/location.search)

    :else {:id :worker}))

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

  IMsg
  (-listen [_ target handler]
    (.addEventListener target "message" handler))
  (-post-message [_ target msg transferables]
    (.postMessage target msg (if transferables (clj->js transferables) #js [])))
  (-mk-channel [_]
    (let [c (js/MessageChannel.)]
      [(.-port1 c) (.-port2 c)]))
  (-self-ref [_]
    js/self)

  ISleep
  (-sleep [_ ms]
    (if atomics-available?
      (let [sab (js/SharedArrayBuffer. 4)
            i32 (js/Int32Array. sab)]
        (js/Atomics.wait i32 0 0 ms)
        nil)
      ;; Fallback: XHR sleep via service worker
      (let [xhr (js/XMLHttpRequest.)]
        (.open xhr "GET" (resolve-url (str "/intercept/sleep/t.js?" ms)) false)
        (.setRequestHeader xhr "cache-control" "no-cache, no-store, max-age=0")
        (.send xhr "request")
        nil))))

;; ---------------------------------------------------------------------------
;; Node.js implementation
;; ---------------------------------------------------------------------------

(defn- node-in-screen? []
  (if wt (.-isMainThread wt) false))

(defn- node-init-data []
  (if (node-in-screen?)
    {:id :screen}
    (if-let [wd (and wt (.-workerData wt))]
      ;; Return raw workerData - let msg layer handle parsing
      wd
      {:id :worker})))

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
          w (WorkerCls. file-path #js {:workerData (clj->js data)})]
      (.on w "message" on-message)
      w))

  IMsg
  (-listen [_ target handler]
    (if (and target (.-on target))
      (.on target "message" handler)
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
      #js {:postMessage (fn [& _] nil)}
      (.-parentPort wt)))

  ISleep
  (-sleep [_ ms]
    (let [sab (js/SharedArrayBuffer. 4)
          i32 (js/Int32Array. sab)]
      (js/Atomics.wait i32 0 0 ms)
      nil)))

;; ---------------------------------------------------------------------------
;; Runtime state & initialization
;; ---------------------------------------------------------------------------

(def impl
  "Atom holding the current platform implementation."
  (atom nil))

(defn platform []
  (or @impl
      (throw (ex-info "Platform not initialized" {}))))

;; Convenience accessors
(defn init-data    [] (-init-data (platform)))
(defn in-screen?   [] (-in-screen? (platform)))
(defn close-self!  [] (-close-self! (platform)))

(defn create-worker [url data on-message]
  (-create-worker (platform) url data on-message))

(defn listen [target handler]
  (-listen (platform) target handler))

(defn post-message [target msg transferables]
  (-post-message (platform) target msg transferables))

(defn mk-channel []
  (-mk-channel (platform)))

(defn self-ref []
  (-self-ref (platform)))

(defn sleep [ms]
  (-sleep (platform) ms))

(defn init!
  "Manually set the platform implementation."
  [platform-impl]
  (reset! impl platform-impl))

;; Auto-detect and initialize at load time
(when-not @impl
  (if node?
    (init! (->NodePlatform (atom nil)))
    (init! (->BrowserPlatform (atom nil)))))
