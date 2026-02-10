(ns cljs-thread.strategy.self-spawn
  "Strategy 1: Self-Spawning Single Bundle.

   The compiled JS bundle detects its own URL/path at load time and uses
   that same file as the worker script. Workers re-execute the same bundle
   but branch on init data (already handled by cljs-thread.core's
   in-screen? check) to run as workers.

   For code-split builds, a module manifest lists additional chunks that
   workers must load before the main entry point runs.

   Browser: new Worker(self-url + query-params)
   Node: new Worker(self-path, {workerData: data})

   Key limitation: The main bundle must be loadable as a worker (no DOM code
   at the top level). Code splits require an explicit manifest."
  (:require
   [cljs-thread.strategy.common :as common]
   [cljs-thread.platform :as p]
   [cljs-thread.state :as s]
   [cljs-thread.msg :as m]
   [cljs-thread.util :as u]))

;; ---------------------------------------------------------------------------
;; State
;; ---------------------------------------------------------------------------

(defonce ^:private self-url (atom nil))
(defonce ^:private module-manifest (atom nil))

;; ---------------------------------------------------------------------------
;; Initialization
;; ---------------------------------------------------------------------------

(defn init!
  "Initialize the self-spawn strategy.
   Options:
     :url       - Override the detected self URL (optional)
     :modules   - Vector of relative script paths for code-split chunks
                   that must be loaded before the main entry.
                   E.g. ['shared.js'] when the build splits into shared.js + screen.js
     :base-url  - Override the base URL for resolving module paths"
  [& [{:keys [url modules base-url]}]]
  (let [detected (or url (common/detect-self-url))]
    (when-not detected
      (throw (ex-info "self-spawn: Could not detect self URL. Provide :url option." {})))
    (reset! self-url detected)
    (when modules
      (let [base (or base-url (common/detect-base-url detected))]
        (reset! module-manifest
                (if p/node?
                  (common/resolve-node-paths base modules)
                  (common/resolve-script-urls base modules)))))))

;; ---------------------------------------------------------------------------
;; Worker creation
;; ---------------------------------------------------------------------------

(defn create-worker
  "Create a worker using the self-spawn strategy.
   The new worker loads the same JS bundle and branches on init data.

   data      - cljs-thread worker data map (will include :id, :conf, etc.)
   on-message - message handler function"
  [data on-message]
  (let [url @self-url]
    (when-not url
      (throw (ex-info "self-spawn: Not initialized. Call init! first." {})))
    (if p/node?
      ;; Node: spawn worker with same file, pass data via workerData
      ;; Include module manifest so worker can require additional chunks
      (let [worker-data (cond-> data
                          @module-manifest (assoc :__pre-require @module-manifest))
            wt (js* "require('worker_threads')")
            WorkerCls (.-Worker wt)
            w (WorkerCls. url #js {:workerData (clj->js worker-data)})]
        (.on w "message" on-message)
        (p/install-coordinator-handler! w)
        (p/install-sync-relay! w)
        w)
      ;; Browser: spawn worker with same URL + query params
      ;; If there are code-split modules, we create a blob that loads them first
      (if @module-manifest
        ;; Code-split: blob worker that imports chunks then imports the main script
        (let [all-scripts (conj (vec @module-manifest) url)
              scripts-json (js/JSON.stringify (clj->js all-scripts))
              init-data-line (common/embed-init-data-js data)
              spawn-scripts-line (str "globalThis.__cljs_thread_spawn_scripts = " scripts-json ";\n")
              origin (common/extract-origin (first all-scripts))
              origin-line (if origin
                            (str "globalThis.__cljs_thread_origin = "
                                 (js/JSON.stringify origin) ";\n")
                            "")
              imports (mapv #(str "'" % "'") all-scripts)
              import-line (str "importScripts(" (clojure.string/join ", " imports) ");\n")
              bootstrap (str init-data-line spawn-scripts-line origin-line
                             common/import-scripts-resolver-js import-line)
              blob-url (common/make-blob-url bootstrap)
              w (js/Worker. blob-url)]
          (set! (.-onmessage w) on-message)
          (js/setTimeout #(common/revoke-blob-url blob-url) 5000)
          w)
        ;; No code splitting: just use self URL directly with query params
        (let [full-url (str url (u/encode-qp data))
              w (js/Worker. full-url)]
          (set! (.-onmessage w) on-message)
          w)))))

;; ---------------------------------------------------------------------------
;; Integration with cljs-thread spawn system
;; ---------------------------------------------------------------------------

(defn install!
  "Replace the standard create-worker with self-spawn's version.
   After calling this, all new worker spawns use the self-spawn strategy.
   The _url argument from spawn is ignored — we always use self-url.

   Options are passed to init!:
     :url      - Override self URL
     :modules  - Code-split chunk list
     :base-url - Base URL for resolving modules"
  [& [opts]]
  (init! opts)
  (reset! p/create-worker-override
          (fn [_url data on-message]
            (create-worker data on-message))))

(defn uninstall!
  "Remove the self-spawn override, restoring default create-worker."
  []
  (reset! p/create-worker-override nil)
  (reset! self-url nil)
  (reset! module-manifest nil))
