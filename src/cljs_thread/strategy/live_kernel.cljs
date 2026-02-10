(ns cljs-thread.strategy.live-kernel
  "Strategy 4: Live Kernel (hybrid of strategies 2 + 3).

   Starts every worker with a minimal kernel (~20 lines JS) that boots
   instantly, then loads the full runtime via load-scripts. Non-exported
   functions are handled transparently via catch-and-load (IIFE unwrapping).

   This strategy eliminates the need for ^:export on user functions: when
   an eval'd function hits a ReferenceError because the referenced var is
   IIFE-scoped in another module (e.g. screen.js), the catch-and-load
   mechanism fetches the module source, strips the IIFE wrapper, and evals
   the inner content in global scope so vars become globally accessible.

   Two modes:
     - Pre-built kernel: serve the static kernel.js file and pass :kernel-url
     - Build-your-own:   omit :kernel-url and the strategy generates inline
                          kernel code (blob URL in browser, eval string in Node)

   Strategy propagation: config is stored in s/conf[:__spawn-strategy] and
   automatically re-installed on child workers at namespace load time.

   Browser: URL workers (for COOP/COEP + SW compatibility) with kernel boot
   Node: eval workers with inline kernel + require for runtime loading"
  (:require
   [cljs-thread.strategy.common :as common]
   [cljs-thread.platform :as p]
   [cljs-thread.state :as s]
   [cljs-thread.env :as e]
   [cljs-thread.util :as u]))

;; ---------------------------------------------------------------------------
;; State
;; ---------------------------------------------------------------------------

(defonce ^:private runtime-scripts (atom nil))
(defonce ^:private kernel-scripts-atom (atom nil))
(defonce ^:private loadable-modules-config (atom nil))
(defonce ^:private kernel-url-atom (atom nil))

;; ---------------------------------------------------------------------------
;; Kernel code generation
;; ---------------------------------------------------------------------------

(def browser-kernel-js
  "Minimal browser worker kernel. Handles eval, load-scripts, and ready
   handshake. Queues non-kernel messages (e.g. port transfers) during boot
   and replays them after importScripts loads the runtime.

   load-scripts supports two-phase loading via optional kernelUrls field:
     {cmd: 'load-scripts', kernelUrls: [...], urls: [...]}
   kernelUrls are loaded first (cljs-thread runtime), then urls (app code).
   Queue replay only happens after ALL scripts are loaded."
  "
  // cljs-thread live kernel
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
        (0, eval)(msg.code);
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
   kernelUrls are loaded first (cljs-thread runtime), then urls (app code).
   Queue replay only happens after ALL scripts are loaded."
  "
  // cljs-thread live kernel (Node)
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
        (0, eval)(msg.code);
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
  "Initialize the live-kernel strategy.
   Options:
     :scripts          - Vector of script URLs/paths for the runtime.
                          These are loaded via kernel's load-scripts command.
     :kernel-scripts   - Optional. Vector of script URLs for the minimal
                          cljs-thread runtime (kernel module). When provided,
                          these are loaded FIRST, then :scripts loads after.
                          Workers become functional for messaging after
                          kernel-scripts load, before app code loads.
     :loadable-modules - Vector of module URLs/paths for catch-and-load.
                          Modules are IIFE-unwrapped and eval'd in global scope
                          on workers, making non-exported vars accessible.
     :kernel-url       - Optional. URL to a pre-built kernel.js file.
                          If omitted, an inline kernel is generated.
     :base-url         - Optional. Base URL for resolving relative script paths."
  [{:keys [scripts kernel-scripts loadable-modules kernel-url base-url]}]
  (when-not (or (seq scripts) (seq kernel-scripts))
    (throw (ex-info "live-kernel: :scripts or :kernel-scripts is required" {})))
  (let [resolve-fn (fn [paths]
                     (if base-url
                       (if p/node?
                         (common/resolve-node-paths base-url paths)
                         (common/resolve-script-urls base-url paths))
                       paths))]
    (when (seq scripts)
      (reset! runtime-scripts (resolve-fn scripts)))
    (when (seq kernel-scripts)
      (reset! kernel-scripts-atom (resolve-fn kernel-scripts))))
  (when loadable-modules
    (reset! loadable-modules-config loadable-modules))
  (when kernel-url
    (reset! kernel-url-atom kernel-url)))

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
  "Asynchronously boot a kernel worker by sending load-scripts command.
   Runs in the background — worker handles cljs-thread messages once
   the runtime finishes loading.

   When kernel-scripts are configured, sends them as kernelUrls in the
   load-scripts command. The kernel loads kernelUrls first (cljs-thread
   runtime), then urls (app code). Queue replay happens after all load."
  [worker]
  (let [kscripts @kernel-scripts-atom
        scripts  @runtime-scripts]
    (-> (wait-for-ready worker)
        (.then
         (fn [ready?]
           (when-not ready?
             (println "live-kernel: WARNING - kernel did not send ready signal"))
           (when (or (seq kscripts) (seq scripts))
             (let [cmd (cond-> {:cmd "load-scripts"}
                         (seq kscripts) (assoc :kernelUrls kscripts)
                         (seq scripts)  (assoc :urls scripts))]
               (send-kernel-cmd! worker cmd)))))
        (.catch (fn [e]
                  (println "live-kernel: boot error:" (str e)))))))

;; ---------------------------------------------------------------------------
;; Worker creation
;; ---------------------------------------------------------------------------

(defn create-worker
  "Create a worker using the live-kernel strategy.
   Returns the Worker synchronously. The runtime is loaded asynchronously
   in the background.

   data       - cljs-thread worker data map (:id, :conf, etc.)
   on-message - message handler function"
  [data on-message]
  (if p/node?
    ;; Node: eval kernel + require for runtime loading
    (let [wt (js* "require('worker_threads')")
          WorkerCls (.-Worker wt)
          w (WorkerCls. node-kernel-js
                        #js {:eval true
                             :workerData (clj->js data)})]
      ;; Install coordinator/relay for sync protocol
      (p/install-coordinator-handler! w)
      (p/install-sync-relay! w)
      ;; Install on-message handler
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
            kurl @kernel-url-atom]
        (if kurl
          ;; Pre-built kernel: load as URL worker with init data in query params
          (let [full-url (str kurl (u/encode-qp data))
                w (js/Worker. full-url)]
            (set! (.-onmessage w) on-message)
            (boot-worker! w)
            w)
          ;; Inline kernel: use the first runtime script as URL worker
          (let [script-url (first scripts)
                full-url (str script-url (u/encode-qp data))
                w (js/Worker. full-url)]
            (set! (.-onmessage w) on-message)
            w))))))

;; ---------------------------------------------------------------------------
;; Integration
;; ---------------------------------------------------------------------------

(defn- install-override!
  "Set the create-worker-override atom."
  []
  (reset! p/create-worker-override
          (fn [_url data on-message]
            (create-worker data on-message))))

(defn install!
  "Replace the standard create-worker with live-kernel's version.
   After calling this, all new worker spawns use the live-kernel strategy.

   Also stores strategy config in s/conf[:__spawn-strategy] so child workers
   can auto-install the strategy at namespace load time.

   Options:
     :scripts          - Vector of script URLs/paths for app code
     :kernel-scripts   - Vector of script URLs for cljs-thread runtime (loaded first)
     :loadable-modules - Vector of module URLs/paths for catch-and-load
     :kernel-url       - URL to pre-built kernel.js (optional)
     :base-url         - Base URL for resolving relative paths"
  [opts]
  (init! opts)
  (install-override!)
  ;; Store strategy config in s/conf for propagation to child workers.
  ;; Also store :loadable-modules at top level for catch-and-load in in.cljs.
  (let [strategy-conf (cond-> {:type :live-kernel}
                        @runtime-scripts (assoc :scripts @runtime-scripts)
                        @kernel-scripts-atom (assoc :kernel-scripts @kernel-scripts-atom)
                        @kernel-url-atom (assoc :kernel-url @kernel-url-atom))]
    (swap! s/conf assoc :__spawn-strategy strategy-conf)
    (when @loadable-modules-config
      (swap! s/conf assoc :loadable-modules @loadable-modules-config))))

(defn uninstall!
  "Remove the live-kernel override, restoring default create-worker."
  []
  (reset! p/create-worker-override nil)
  (reset! runtime-scripts nil)
  (reset! kernel-scripts-atom nil)
  (reset! loadable-modules-config nil)
  (reset! kernel-url-atom nil)
  (swap! s/conf dissoc :__spawn-strategy :loadable-modules))

;; ---------------------------------------------------------------------------
;; Auto-install on worker threads
;; ---------------------------------------------------------------------------
;; When a worker loads this namespace and s/conf has :__spawn-strategy
;; with :type :live-kernel, automatically re-install the override so that
;; sub-spawns (e.g. root spawning core/db/future workers) also use
;; live-kernel. This runs at namespace load time.

(defn auto-install-from-conf!
  "Check conf for live-kernel strategy settings and re-install if found.
   Called automatically at namespace load time on workers."
  [conf]
  (when-let [strategy (:__spawn-strategy conf)]
    (when (= (:type strategy) :live-kernel)
      (let [{:keys [scripts kernel-scripts kernel-url]} strategy]
        (when (or (seq scripts) (seq kernel-scripts))
          (when (seq scripts)
            (reset! runtime-scripts scripts))
          (when (seq kernel-scripts)
            (reset! kernel-scripts-atom kernel-scripts))
          (when kernel-url
            (reset! kernel-url-atom kernel-url))
          (install-override!))))))

;; Auto-install when loaded on a non-screen worker
(when-not (e/in-screen?)
  (auto-install-from-conf! @s/conf))
