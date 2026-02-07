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

(defn- browser-in-screen? []
  (and (exists? js/self)
       (not (undefined? (.-document js/self)))))

(defn- resolve-url
  "Resolve a relative URL path to absolute.
   In blob workers, js/location.origin is 'null', so we use the
   __cljs_thread_origin global set by spawn strategies."
  [path]
  (if (and (exists? js/globalThis.__cljs_thread_origin)
           (some? js/globalThis.__cljs_thread_origin))
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
    ;; EDN preserves original types — named workers have keyword IDs (:root),
    ;; ephemeral workers have string IDs. Do NOT convert to keyword here
    ;; (unlike Node's js->clj path) or sync request-id matching will break.
    (edn/read-string js/globalThis.__cljs_thread_init_data)
    ;; Screen (main thread with document) — always :screen
    (browser-in-screen?)
    {:id :screen}
    ;; Standard path: worker created with query params
    (seq js/location.search)
    (u/decode-qp js/location.search)
    ;; Fallback
    :else {:id :root}))

(defn- browser-request [getter opts env-data]
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

(defn- browser-send-response [payload env-data]
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

(defn- browser-sleep [ms]
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
    (let [full-url (str url (u/encode-qp data))
          w (js/Worker. full-url)]
      (set! (.-onmessage w) on-message)
      w))
  (-register-coordinator [_ config callback]
    (let [sw-url (str (:sw-connect-string config "/sw.js")
                      (u/encode-qp {:id :sw}))]
      (on-sw-registration
       callback
       #(-> (js/navigator.serviceWorker.register sw-url)
            (after-sw-registration (fn [_] (callback)))))))
  (-coordinator-ready? [_]
    (boolean (.-controller js/navigator.serviceWorker)))

  ISync
  (-request [this getter opts]
    (browser-request getter opts (-init-data this)))
  (-send-response [this payload]
    (browser-send-response payload (-init-data this)))
  (-sleep [_ ms]
    (browser-sleep ms))

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

;; Size of the SharedArrayBuffer used for passing response data.
;; 1MB should be sufficient for EDN payloads.
(def ^:private node-data-buffer-size (* 1024 1024))

(defn- node-in-screen? []
  (if wt (.-isMainThread wt) false))

(defn- node-init-data []
  (if (node-in-screen?)
    {:id :screen}
    (if-let [wd (and wt (.-workerData wt))]
      (let [d (js->clj wd :keywordize-keys true)]
        (update d :id keyword))
      {:id :root})))

(defn- normalize-req-id
  "Ensure request-id always starts with ':' to match keyword string format.
   Workers keyword-ize their IDs (node-init-data), so responses always have
   colon-prefixed request-ids. Main thread IDs from gen-id are plain strings."
  [s]
  (if (.startsWith s ":") s (str ":" s)))

(defn- node-request [getter opts env-data]
  (let [{:keys [resolve reject]} opts
        request-id (normalize-req-id (str getter))
        parent-port (and wt (.-parentPort wt))
        main-thread? (not parent-port)]
    (if resolve
      ;; Async path
      (if main-thread?
        ;; Main thread IS the coordinator — register directly in coordinator-pending
        ;; so that when a worker sends a response, the coordinator resolves the promise.
        (do
          (swap! coordinator-pending assoc request-id
                 {:async? true
                  :resolve-fn resolve})
          nil)
        ;; Worker thread: post request to coordinator via parentPort
        (do
          (let [handler (fn handler [^js msg]
                          (let [d (if (object? msg) (js->clj msg :keywordize-keys true) nil)]
                            (when (and d
                                       (= (:type d) "sync-response")
                                       (= (:requestId d) request-id))
                              (.removeListener parent-port "message" handler)
                              (resolve (edn/read-string (:payload d))))))]
            (.on parent-port "message" handler))
          (.postMessage parent-port
                        #js {:type "register-sync"
                             :requestId request-id
                             :requester (str (:id env-data))
                             :async true})
          nil))
      ;; Sync path: block until response arrives (worker threads only)
      (let [signal-sab (js/SharedArrayBuffer. 8)
            data-sab (js/SharedArrayBuffer. node-data-buffer-size)
            signal-i32 (js/Int32Array. signal-sab)]
        (when parent-port
          (.postMessage parent-port
                        #js {:type "register-sync"
                             :requestId request-id
                             :requester (str (:id env-data))
                             :signalSab signal-sab
                             :dataSab data-sab}))
        ;; Block until coordinator signals
        (js/Atomics.wait signal-i32 0 0)
        ;; Read response: length from signal-sab[1], bytes from data-sab
        (let [data-len (aget signal-i32 1)
              data-u8 (js/Uint8Array. data-sab 0 data-len)
              decoder (js/TextDecoder.)
              edn-str (.decode decoder data-u8)]
          (edn/read-string edn-str))))))

(defn- node-send-response [payload env-data]
  (let [parent-port (and wt (.-parentPort wt))]
    (when parent-port
      (.postMessage parent-port
                    #js {:type "send-sync-response"
                         :payload (pr-str payload)}))
    nil))

(defn- node-sleep [ms]
  ;; Use Atomics.wait with timeout as a portable thread sleep
  (let [sab (js/SharedArrayBuffer. 4)
        i32 (js/Int32Array. sab)]
    (js/Atomics.wait i32 0 0 ms)
    nil))

;; Coordinator state — only used on the Node main thread
(defonce ^:private coordinator-pending (atom {}))

(defn- node-coordinator-handle-message
  "Message handler running on the main thread to coordinate sync requests.
   Matches register-sync requests with send-sync-response messages."
  [worker-ref msg]
  (let [d (if (object? msg) (js->clj msg :keywordize-keys true) nil)
        msg-type (:type d)]
    (cond
      (= msg-type "register-sync")
      (let [req-id (normalize-req-id (str (:requestId d)))
            signal-sab (:signalSab d)
            data-sab (:dataSab d)
            async? (:async d)]
        ;; Check if a response already arrived
        (if-let [early-response (get-in @coordinator-pending [req-id :early-response])]
          ;; Response arrived before request was registered — deliver immediately
          (do
            (swap! coordinator-pending dissoc req-id)
            (if async?
              ;; Send response back via message to worker
              (.postMessage worker-ref
                            #js {:type "sync-response"
                                 :requestId req-id
                                 :payload early-response})
              ;; Write to SAB and notify
              (let [encoder (js/TextEncoder.)
                    bytes (.encode encoder early-response)
                    signal-i32 (js/Int32Array. signal-sab)
                    data-u8 (js/Uint8Array. data-sab)]
                (.set data-u8 bytes)
                (aset signal-i32 1 (.-length bytes))
                (js/Atomics.store signal-i32 0 1)
                (js/Atomics.notify signal-i32 0 1))))
          ;; Store pending request
          (swap! coordinator-pending assoc req-id
                 {:signal-sab signal-sab
                  :data-sab data-sab
                  :worker worker-ref
                  :async? async?})))

      (= msg-type "send-sync-response")
      (let [payload-str (:payload d)
            ;; Parse the payload to get request-id
            payload-edn (edn/read-string payload-str)
            raw-req-id (str (:request-id payload-edn))
            response-str (pr-str (:response payload-edn))]
        ;; Skip responses with empty/nil request-ids (daemon init calls)
        (when (and (seq raw-req-id) (not= raw-req-id "") (not= raw-req-id "nil"))
          (let [req-id (normalize-req-id raw-req-id)]
            (if-let [pending (get @coordinator-pending req-id)]
              (do
                (swap! coordinator-pending dissoc req-id)
                (if-let [resolve-fn (:resolve-fn pending)]
                  ;; Main-thread request — resolve the Promise directly
                  (resolve-fn (edn/read-string response-str))
                  (if (:async? pending)
                    ;; Worker async request — send response back via message
                    (.postMessage (:worker pending)
                                  #js {:type "sync-response"
                                       :requestId req-id
                                       :payload response-str})
                    ;; Worker sync request — write to SAB and notify
                    (let [encoder (js/TextEncoder.)
                          bytes (.encode encoder response-str)
                          signal-i32 (js/Int32Array. (:signal-sab pending))
                          data-u8 (js/Uint8Array. (:data-sab pending))]
                      (.set data-u8 bytes)
                      (aset signal-i32 1 (.-length bytes))
                      (js/Atomics.store signal-i32 0 1)
                      (js/Atomics.notify signal-i32 0 1)))))
              ;; Response arrived before request was registered — store it
              (swap! coordinator-pending assoc req-id {:early-response response-str})))))

      ;; Relay: if this message isn't a sync message, it might be a sync
      ;; message from a grandchild worker being relayed up.  Just re-dispatch.
      (= msg-type "relay-sync")
      (let [inner (.-inner msg)]
        (node-coordinator-handle-message worker-ref inner)))))

(defn install-coordinator-handler!
  "Call on the main thread to install the sync coordinator message handler
   on a given worker."
  [worker]
  (when (and node? wt (.-isMainThread wt))
    (.on worker "message"
         (fn [msg]
           ;; Only handle sync-protocol messages; let others pass through
           (let [t (and (object? msg) (aget msg "type"))]
             (when (or (= t "register-sync")
                       (= t "send-sync-response")
                       (= t "relay-sync"))
               (node-coordinator-handle-message worker msg)))))))

(defn install-sync-relay!
  "Call on non-main worker threads to relay sync-protocol messages
   from child workers up to parentPort (toward the main thread coordinator)."
  [child-worker]
  (when (and node? wt (not (.-isMainThread wt)))
    (let [^js parent-port (.-parentPort wt)]
      (when parent-port
        (.on child-worker "message"
             (fn [msg]
               (let [t (and (object? msg) (aget msg "type"))]
                 (when (or (= t "register-sync")
                           (= t "send-sync-response")
                           (= t "relay-sync"))
                   ;; Relay to parent — message bubbles up to coordinator
                   (.postMessage parent-port msg)))))))))

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
      ;; Main thread: install coordinator to handle sync requests/responses
      (install-coordinator-handler! w)
      ;; Non-main threads: relay sync messages from children up to parent
      (install-sync-relay! w)
      w))
  (-register-coordinator [_ _config callback]
    ;; In Node, main thread IS the coordinator — no registration needed
    (callback))
  (-coordinator-ready? [_]
    true)

  ISync
  (-request [this getter opts]
    (node-request getter opts (-init-data this)))
  (-send-response [this payload]
    (node-send-response payload (-init-data this)))
  (-sleep [_ ms]
    (node-sleep ms))

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
