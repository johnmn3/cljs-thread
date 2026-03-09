(ns cljs-thread.test.watch
  "Watch mode for incremental test re-runs.

   Uses shadow-cljs watch API for hot recompilation. On each rebuild,
   tests are re-executed automatically.

   Usage from the orchestrator:
     (watch/start! build-config run-fn)
     ;; ... shadow-cljs watches for file changes ...
     ;; On each rebuild, run-fn is called with the output JS path

   For now, this uses a polling-based approach as a fallback when
   shadow-cljs watch API is not available."
  (:require [clojure.java.io :as io]
            [cljs-thread.test.env :as env]))

;; ---------------------------------------------------------------------------
;; File watcher (polling-based fallback)
;; ---------------------------------------------------------------------------

(defn- file-timestamps
  "Get a map of file-path → last-modified for all .cljs files under dir."
  [dir]
  (let [root (io/file dir)]
    (when (.isDirectory root)
      (->> (file-seq root)
           (filter #(.isFile %))
           (filter #(re-find #"\.(cljs|clj|cljc)$" (.getName %)))
           (map (fn [f] [(str f) (.lastModified f)]))
           (into {})))))

(defn- detect-changes
  "Compare two timestamp maps. Returns a seq of changed file paths."
  [old-ts new-ts]
  (let [all-keys (into (set (keys old-ts)) (keys new-ts))]
    (for [k all-keys
          :when (not= (get old-ts k) (get new-ts k))]
      k)))

;; ---------------------------------------------------------------------------
;; Shadow-cljs watch integration
;; ---------------------------------------------------------------------------

(defn start-shadow-watch!
  "Start shadow-cljs in watch mode for the given build.
   Returns a function to stop the watch."
  [build-id]
  (try
    (require 'shadow.cljs.devtools.api)
    (require 'shadow.cljs.devtools.server)
    (let [start! (resolve 'shadow.cljs.devtools.server/start!)
          watch! (resolve 'shadow.cljs.devtools.api/watch)
          stop!  (resolve 'shadow.cljs.devtools.api/stop-worker)]
      (start!)
      (watch! build-id)
      (fn [] (stop! build-id)))
    (catch Exception e
      (println (str "Shadow watch not available: " (.getMessage e)))
      nil)))

;; ---------------------------------------------------------------------------
;; Polling watch loop
;; ---------------------------------------------------------------------------

(defn watch-and-run!
  "Watch for file changes and re-run tests.

   Options:
     :watch-dirs   - directories to watch (default [\"src\" \"test\"])
     :compile-fn   - function to compile (called on each change)
     :run-fn       - function to run tests (called after compile)
     :poll-ms      - polling interval in ms (default 1000)
     :debounce-ms  - debounce window in ms (default 500)"
  [{:keys [watch-dirs compile-fn run-fn poll-ms debounce-ms]
    :or   {watch-dirs  ["src" "test"]
           poll-ms     1000
           debounce-ms 500}}]
  (println "Watching for file changes... (Ctrl+C to stop)")
  (println (str "  Directories: " (pr-str watch-dirs)))
  (println (str "  Poll interval: " poll-ms "ms"))
  (println)

  (let [initial-ts (reduce merge (map file-timestamps watch-dirs))]
    (loop [prev-ts initial-ts
           run-count 0]
      (Thread/sleep poll-ms)
      (let [current-ts (reduce merge (map file-timestamps watch-dirs))
            changes (detect-changes prev-ts current-ts)]
        (if (seq changes)
          (do
            ;; Debounce: wait a bit for saves to settle
            (Thread/sleep debounce-ms)
            (println (str "\n--- Change detected (" (count changes) " file"
                          (when (> (count changes) 1) "s") ") ---"))
            (doseq [f changes]
              (println (str "  " f)))
            (println)

            ;; Recompile
            (when compile-fn
              (try
                (compile-fn)
                (catch Exception e
                  (println (str "Compilation error: " (.getMessage e))))))

            ;; Re-run
            (when run-fn
              (try
                (let [exit (run-fn)]
                  (println (str "\n--- Run #" (inc run-count) ": "
                                (if (zero? exit) "PASSED" "FAILED") " ---")))
                (catch Exception e
                  (println (str "Run error: " (.getMessage e))))))

            (recur (reduce merge (map file-timestamps watch-dirs))
                   (inc run-count)))
          (recur current-ts run-count))))))
