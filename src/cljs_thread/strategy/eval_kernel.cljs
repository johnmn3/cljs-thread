(ns cljs-thread.strategy.eval-kernel
  "Strategy 3: Eval Kernel + Dependency Streaming.

   Starts a worker with the absolute minimum viable kernel: just a message
   listener and an eval handler. Dependencies are then streamed on-demand
   from the parent thread via postMessage.

   The kernel (~20 lines of JS) provides:
   - 'eval' command: execute arbitrary JS code in the worker
   - 'load-scripts' command: load external scripts (importScripts / require)
   - 'ping' / 'ready' handshake

   Boot sequence:
   1. Parent creates kernel worker (blob/eval) — returned synchronously
   2. Kernel sends 'ready' message
   3. Parent sends load-scripts command to load the full runtime
   4. Once loaded, the cljs-thread runtime initializes from side effects
   5. Worker starts handling cljs-thread messages normally

   Browser: Blob URL kernel + importScripts for runtime loading
   Node: eval kernel + require for runtime loading"
  (:require
   [cljs-thread.strategy.common :as common]
   [cljs-thread.platform :as p]
   [cljs-thread.util :as u]))

;; ---------------------------------------------------------------------------
;; State
;; ---------------------------------------------------------------------------

(defonce ^:private runtime-scripts (atom nil))
(defonce ^:private kernel-scripts-atom (atom nil))
(defonce ^:private code-registry (atom {}))

;; ---------------------------------------------------------------------------
;; Kernel code generation
;; ---------------------------------------------------------------------------

(def browser-kernel-js
  "Minimal browser worker kernel. Handles eval, load-scripts, and ready handshake.
   Queues non-kernel messages (e.g. port transfers) during boot and replays
   them after importScripts loads the runtime.

   load-scripts supports two-phase loading via optional kernelUrls field:
     {cmd: 'load-scripts', kernelUrls: [...], urls: [...]}
   kernelUrls are loaded first (cljs-thread runtime), then urls (app code)."
  "
  // cljs-thread eval kernel
  self.__kernel_queue = [];
  self.onmessage = function(e) {
    var msg = e.data;
    if (!msg || !msg.__kernel) {
      if (self.__kernel_queue) self.__kernel_queue.push(e);
      return;
    }
    var cmd = msg.cmd;
    if (cmd === 'eval') {
      try {
        eval(msg.code);
        if (msg.id) self.postMessage({__kernel_resp: true, id: msg.id, ok: true});
      } catch(err) {
        if (msg.id) self.postMessage({__kernel_resp: true, id: msg.id, error: err.toString()});
      }
    } else if (cmd === 'load-scripts') {
      try {
        if (msg.kernelUrls && msg.kernelUrls.length > 0) {
          importScripts.apply(self, msg.kernelUrls);
        }
        if (msg.urls && msg.urls.length > 0) {
          importScripts.apply(self, msg.urls);
        }
        var q = self.__kernel_queue;
        self.__kernel_queue = null;
        if (q && q.length > 0) {
          q.forEach(function(savedE) {
            self.dispatchEvent(new MessageEvent('message', {
              data: savedE.data,
              ports: savedE.ports ? Array.from(savedE.ports) : []
            }));
          });
        }
        if (msg.id) self.postMessage({__kernel_resp: true, id: msg.id, ok: true});
      } catch(err) {
        if (msg.id) self.postMessage({__kernel_resp: true, id: msg.id, error: err.toString()});
      }
    } else if (cmd === 'ping') {
      self.postMessage({__kernel_resp: true, cmd: 'pong'});
    }
  };
  self.postMessage({__kernel_resp: true, cmd: 'ready'});
  ")

(def node-kernel-js
  "Minimal Node worker kernel. Handles eval, require, and ready handshake.
   Queues non-kernel messages during boot and replays them after require.

   load-scripts supports two-phase loading via optional kernelUrls field:
     {cmd: 'load-scripts', kernelUrls: [...], urls: [...]}
   kernelUrls are loaded first (cljs-thread runtime), then urls (app code)."
  "
  // cljs-thread eval kernel (Node)
  var {parentPort, workerData} = require('worker_threads');
  var __kernel_queue = [];
  parentPort.on('message', function(msg) {
    if (!msg || !msg.__kernel) {
      if (__kernel_queue) __kernel_queue.push(msg);
      return;
    }
    var cmd = msg.cmd;
    if (cmd === 'eval') {
      try {
        eval(msg.code);
        if (msg.id) parentPort.postMessage({__kernel_resp: true, id: msg.id, ok: true});
      } catch(err) {
        if (msg.id) parentPort.postMessage({__kernel_resp: true, id: msg.id, error: err.toString()});
      }
    } else if (cmd === 'load-scripts') {
      try {
        if (msg.kernelUrls && msg.kernelUrls.length > 0) {
          msg.kernelUrls.forEach(function(p) { require(p); });
        }
        if (msg.urls && msg.urls.length > 0) {
          msg.urls.forEach(function(p) { require(p); });
        }
        var q = __kernel_queue;
        __kernel_queue = null;
        if (q && q.length > 0) {
          q.forEach(function(savedMsg) {
            parentPort.emit('message', savedMsg);
          });
        }
        if (msg.id) parentPort.postMessage({__kernel_resp: true, id: msg.id, ok: true});
      } catch(err) {
        if (msg.id) parentPort.postMessage({__kernel_resp: true, id: msg.id, error: err.toString()});
      }
    } else if (cmd === 'ping') {
      parentPort.postMessage({__kernel_resp: true, cmd: 'pong'});
    }
  });
  parentPort.postMessage({__kernel_resp: true, cmd: 'ready'});
  ")

;; ---------------------------------------------------------------------------
;; Initialization
;; ---------------------------------------------------------------------------

(defn init!
  "Initialize the eval-kernel strategy.
   Options:
     :scripts        - Vector of script URLs/paths for the runtime/app code.
     :kernel-scripts - Optional. Vector of script URLs for the minimal
                        cljs-thread runtime (kernel module). Loaded FIRST.
     :base-url       - Base URL for resolving relative script paths."
  [& [{:keys [scripts kernel-scripts base-url]}]]
  (let [resolve-fn (fn [paths]
                     (if base-url
                       (if p/node?
                         (common/resolve-node-paths base-url paths)
                         (common/resolve-script-urls base-url paths))
                       paths))]
    (when (seq scripts)
      (reset! runtime-scripts (resolve-fn scripts)))
    (when (seq kernel-scripts)
      (reset! kernel-scripts-atom (resolve-fn kernel-scripts)))))

(defn register-code!
  "Register a code string under a namespace key.
   Used for the pure-eval path where no external scripts are loaded."
  [ns-key code-str]
  (swap! code-registry assoc ns-key code-str))

;; ---------------------------------------------------------------------------
;; Internal helpers
;; ---------------------------------------------------------------------------

(defn- send-kernel-cmd!
  "Send a kernel command to a worker. Returns a Promise that resolves
   when the kernel acknowledges."
  [worker cmd-map]
  (js/Promise.
   (fn [resolve reject]
     (let [id (str (random-uuid))
           cmd (assoc cmd-map :__kernel true :id id)
           handler (fn handler [^js e]
                     (let [d (if p/node? e (.-data e))]
                       (when (and d (.-__kernel_resp d) (= (.-id d) id))
                         (if p/node?
                           (.removeListener worker "message" handler)
                           (.removeEventListener worker "message" handler))
                         (if (.-error d)
                           (reject (js/Error. (.-error d)))
                           (resolve true)))))]
       (if p/node?
         (do (.on worker "message" handler)
             (.postMessage worker (clj->js cmd)))
         (do (.addEventListener worker "message" handler)
             (.postMessage worker (clj->js cmd))))))))

(defn- wait-for-ready
  "Wait for the kernel to send its 'ready' message. Returns a Promise."
  [worker]
  (js/Promise.
   (fn [resolve _reject]
     (let [timeout-id (atom nil)
           handler (fn handler [^js e]
                     (let [d (if p/node? e (.-data e))]
                       (when (and d (.-__kernel_resp d) (= (.-cmd d) "ready"))
                         (when @timeout-id (js/clearTimeout @timeout-id))
                         (if p/node?
                           (.removeListener worker "message" handler)
                           (.removeEventListener worker "message" handler))
                         (resolve true))))]
       ;; Timeout after 10s
       (reset! timeout-id
               (js/setTimeout
                #(do (if p/node?
                       (.removeListener worker "message" handler)
                       (.removeEventListener worker "message" handler))
                     (resolve false))
                10000))
       (if p/node?
         (.on worker "message" handler)
         (.addEventListener worker "message" handler))))))

(defn- boot-worker!
  "Asynchronously boot a kernel worker by sending load-scripts/eval commands.
   This runs in the background — the worker will start handling cljs-thread
   messages once the runtime is loaded.

   When kernel-scripts are configured, sends them as kernelUrls in the
   load-scripts command. The kernel loads kernelUrls first (cljs-thread
   runtime), then urls (app code)."
  [worker]
  (let [kscripts @kernel-scripts-atom
        scripts  @runtime-scripts]
    (-> (wait-for-ready worker)
        (.then
         (fn [ready?]
           (when-not ready?
             (println "eval-kernel: WARNING - kernel did not send ready signal"))
           (cond
             ;; Load runtime via importScripts / require (with optional kernel-scripts)
             (or (seq kscripts) (seq scripts))
             (let [cmd (cond-> {:cmd "load-scripts"}
                         (seq kscripts) (assoc :kernelUrls kscripts)
                         (seq scripts)  (assoc :urls scripts))]
               (send-kernel-cmd! worker cmd))

             ;; Eval registered code
             (seq @code-registry)
             (let [entries (seq @code-registry)]
               (.reduce
                (.from js/Array (clj->js (map second entries)))
                (fn [p code]
                  (.then p #(send-kernel-cmd! worker {:cmd "eval" :code code})))
                (js/Promise.resolve true)))

             :else
             (do (println "eval-kernel: WARNING - no scripts or code registered")
                 (js/Promise.resolve false)))))
        (.catch (fn [e]
                  (println "eval-kernel: boot error:" (str e)))))))

;; ---------------------------------------------------------------------------
;; Worker creation
;; ---------------------------------------------------------------------------

(defn create-worker
  "Create a worker using the eval-kernel strategy.
   Returns the Worker synchronously. The runtime is loaded asynchronously
   in the background — the worker will start responding to cljs-thread
   messages once the runtime finishes loading.

   data       - cljs-thread worker data map (:id, :conf, etc.)
   on-message - message handler function"
  [data on-message]
  (if p/node?
    ;; Node: eval kernel
    (let [wt (js* "require('worker_threads')")
          WorkerCls (.-Worker wt)
          w (WorkerCls. node-kernel-js
                        #js {:eval true
                             :workerData (clj->js data)})]
      ;; Install coordinator/relay for sync protocol
      (p/install-coordinator-handler! w)
      (p/install-sync-relay! w)
      ;; Install on-message handler (will receive cljs-thread msgs after boot)
      (.on w "message" on-message)
      ;; Boot asynchronously
      (boot-worker! w)
      w)
    (if p/sab-sync?
      ;; SAB sync: blob kernel workers (no SW needed for sync)
      (let [scripts @runtime-scripts
            init-data-js (common/embed-init-data-js data)
            origin (when-let [s (first scripts)] (common/extract-origin s))
            origin-line (if origin
                          (str "globalThis.__cljs_thread_origin = "
                               (js/JSON.stringify origin) ";\n")
                          "")
            full-kernel (str init-data-js origin-line
                             common/import-scripts-resolver-js
                             browser-kernel-js)
            blob-url (common/make-blob-url full-kernel)
            w (js/Worker. blob-url)]
        (set! (.-onmessage w) on-message)
        (boot-worker! w)
        (js/setTimeout #(common/revoke-blob-url blob-url) 5000)
        w)
      ;; Legacy SW sync: URL workers (blob workers are NOT SW clients)
      (let [scripts @runtime-scripts
            script-url (first scripts)]
        (if script-url
          (let [full-url (str script-url (u/encode-qp data))
                w (js/Worker. full-url)]
            (set! (.-onmessage w) on-message)
            w)
          ;; Fallback: eval-only path (no scripts) — use blob kernel
          (let [blob-url (common/make-blob-url browser-kernel-js)
                w (js/Worker. blob-url)]
            (set! (.-onmessage w) on-message)
            (-> (wait-for-ready w)
                (.then
                 (fn [_]
                   (when (seq @code-registry)
                     (let [entries (seq @code-registry)]
                       (.reduce
                        (.from js/Array (clj->js (map second entries)))
                        (fn [p code]
                          (.then p #(send-kernel-cmd! w {:cmd "eval" :code code})))
                        (js/Promise.resolve true))))))
                (.then (fn [_] (common/revoke-blob-url blob-url)))
                (.catch (fn [e] (println "eval-kernel: boot error:" (str e)))))
            w))))))

;; ---------------------------------------------------------------------------
;; Integration
;; ---------------------------------------------------------------------------

(defn install!
  "Replace the standard create-worker with eval-kernel's version.
   After calling this, all new worker spawns use the eval-kernel strategy.
   The _url argument from spawn is ignored — kernel loads scripts itself.

   Options:
     :scripts        - Vector of script URLs/paths for app code
     :kernel-scripts - Vector of script URLs for cljs-thread runtime (loaded first)
     :base-url       - Base URL for resolving relative paths"
  [& [opts]]
  (init! opts)
  (reset! p/create-worker-override
          (fn [_url data on-message]
            (create-worker data on-message))))

(defn uninstall!
  "Remove the eval-kernel override, restoring default create-worker."
  []
  (reset! p/create-worker-override nil)
  (reset! runtime-scripts nil)
  (reset! kernel-scripts-atom nil)
  (reset! code-registry {}))
