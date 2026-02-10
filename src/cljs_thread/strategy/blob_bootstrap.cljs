(ns cljs-thread.strategy.blob-bootstrap
  "Strategy 2: Blob Bootstrap + Dynamic Back-Loading.

   Creates a tiny inline worker (Blob URL in browser, eval string in Node)
   that contains only a bootstrap loader. This bootstrap then dynamically
   loads the real application code from the original build output files.

   The bootstrap:
   1. Sets up globalThis.__cljs_thread_init_data with worker init data
   2. Loads the application scripts (importScripts in browser, require in Node)
   3. The loaded cljs-thread.core then initializes as a worker

   This works with any existing build output and handles code-split builds
   naturally by loading chunks in the correct dependency order.

   Browser: Blob URL worker with importScripts back-loading
   Node: eval worker with require back-loading"
  (:require
   [cljs-thread.strategy.common :as common]
   [cljs-thread.platform :as p]
   [cljs-thread.util :as u]))

;; ---------------------------------------------------------------------------
;; State
;; ---------------------------------------------------------------------------

(defonce ^:private script-urls (atom nil))

;; ---------------------------------------------------------------------------
;; Initialization
;; ---------------------------------------------------------------------------

(defn init!
  "Initialize the blob-bootstrap strategy.
   Options:
     :scripts  - REQUIRED. Vector of script URLs/paths to load in order.
                 Browser: absolute URLs like ['http://localhost:8080/shared.js'
                                               'http://localhost:8080/core.js']
                 Node: absolute file paths like ['/abs/path/to/worker.js']
     :base-url - Optional. If provided, scripts are treated as relative to this."
  [{:keys [scripts base-url]}]
  (when-not (seq scripts)
    (throw (ex-info "blob-bootstrap: :scripts is required" {})))
  (let [resolved (if base-url
                   (if p/node?
                     (common/resolve-node-paths base-url scripts)
                     (common/resolve-script-urls base-url scripts))
                   scripts)]
    (reset! script-urls resolved)))

;; ---------------------------------------------------------------------------
;; Bootstrap code generation
;; ---------------------------------------------------------------------------

(defn- browser-bootstrap-code
  "Generate browser bootstrap JS that:
   1. Sets __cljs_thread_init_data on globalThis
   2. Sets __cljs_thread_spawn_scripts so child workers also use blob spawning
   3. Sets __cljs_thread_origin so XHR requests use absolute URLs
   4. Calls importScripts to load the app"
  [data scripts]
  (let [init-data-line (common/embed-init-data-js data)
        scripts-json (js/JSON.stringify (clj->js scripts))
        spawn-scripts-line (str "globalThis.__cljs_thread_spawn_scripts = " scripts-json ";\n")
        ;; Extract origin from first script URL for XHR base
        origin (common/extract-origin (first scripts))
        origin-line (if origin
                      (str "globalThis.__cljs_thread_origin = " (js/JSON.stringify origin) ";\n")
                      "")
        import-args (->> scripts
                         (map #(str "'" % "'"))
                         (clojure.string/join ", "))
        import-line (str "importScripts(" import-args ");\n")]
    (str init-data-line spawn-scripts-line origin-line
         common/import-scripts-resolver-js import-line)))

(defn- node-bootstrap-code
  "Generate Node.js bootstrap JS that:
   1. Reads workerData for init data
   2. Requires the app scripts in order"
  [scripts]
  (let [require-lines (->> scripts
                            (map #(str "require('" % "');"))
                            (clojure.string/join "\n"))]
    (str require-lines "\n")))

;; ---------------------------------------------------------------------------
;; Worker creation
;; ---------------------------------------------------------------------------

(defn create-worker
  "Create a worker using the blob-bootstrap strategy.

   data       - cljs-thread worker data map (:id, :conf, etc.)
   on-message - message handler function"
  [data on-message]
  (let [scripts @script-urls]
    (when-not (seq scripts)
      (throw (ex-info "blob-bootstrap: Not initialized. Call init! first." {})))
    (if p/node?
      ;; Node: eval worker that requires the app scripts
      (let [code (node-bootstrap-code scripts)]
        (common/create-eval-worker code data on-message))
      (if p/sab-sync?
        ;; SAB sync: use actual blob workers (no SW needed for sync)
        (let [code (browser-bootstrap-code data scripts)
              blob-url (common/make-blob-url code)
              w (js/Worker. blob-url)]
          (set! (.-onmessage w) on-message)
          (js/setTimeout #(common/revoke-blob-url blob-url) 5000)
          w)
        ;; Legacy SW sync: URL workers (blob workers are NOT SW clients)
        (let [script-url (first scripts)
              full-url (str script-url (u/encode-qp data))
              w (js/Worker. full-url)]
          (set! (.-onmessage w) on-message)
          w)))))

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
  "Replace the standard create-worker with blob-bootstrap's version.
   After calling this, all new worker spawns use blob-bootstrap.
   The _url argument from spawn is ignored — bootstrap loads scripts itself.

   Strategy config is NOT stored in s/conf by install! — instead, use
   the :__spawn-strategy key when calling thread/init! to propagate
   to child workers. Or call auto-install-from-conf! on workers.

   Options:
     :scripts  - Vector of script URLs/paths to load (required)
     :base-url - Base URL for resolving relative script paths"
  [opts]
  (init! opts)
  (install-override!))

(defn uninstall!
  "Remove the blob-bootstrap override, restoring default create-worker."
  []
  (reset! p/create-worker-override nil)
  (reset! script-urls nil))

;; ---------------------------------------------------------------------------
;; Auto-install on worker threads
;; ---------------------------------------------------------------------------
;; When a worker loads this namespace (via the blob bootstrap importScripts
;; or require), it needs to re-install the override so that sub-spawns also
;; use blob-bootstrap. We detect this by checking if script-urls is already
;; set (which it isn't on fresh workers) and if the conf has our config.
;; Since conf isn't available here (loaded later via state.cljs), we check
;; the init data directly.

(defn auto-install-from-conf!
  "Check conf for strategy settings and re-install if found.
   Call this after s/conf is loaded on a worker thread."
  [conf]
  (when-let [strategy (:__spawn-strategy conf)]
    (when (= (:type strategy) :blob-bootstrap)
      (let [scripts (:scripts strategy)]
        (when (seq scripts)
          (reset! script-urls scripts)
          (install-override!))))))
