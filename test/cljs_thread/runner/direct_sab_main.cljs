(ns cljs-thread.runner.direct-sab-main
  "Main-thread entry point for direct SAB sync tests."
  (:require-macros [cljs-thread.core :refer [in on-when]])
  (:require
   [cljs-thread.core :as thread]
   [cljs-thread.eve :as eve]
   [cljs-thread.state :as s]
   [cljs-thread.strategy.fat-kernel :as fat-kernel]
   [cljs-thread.runner.thread-test-runner]))

(defn- run-tests! []
  ;; Wait for workers to be ready
  (on-when (and (contains? @s/peers :core)
                (contains? @s/peers :db)
                (some #(.startsWith (name %) "fp-") (keys @s/peers)))
    {:max-time 30000}
    (println "Workers ready. Peers:" (set (keys @s/peers)))
    (js/setTimeout
      (fn []
        ;; Run all test suites in a single in call
        ;; Worker writes exit code to eve atom, main thread reads and exits
        (let [exit-atom (eve/atom ::test-exit-code nil)]
          (in :core [exit-atom]
            (let [exit-code-1 (cljs-thread.runner.thread-test-runner/run-direct-sab-sync!)
                  exit-code-2 (cljs-thread.runner.thread-test-runner/run-eve-atom-transfer!)
                  exit-code-3 (cljs-thread.runner.thread-test-runner/run-future2!)
                  final-code (max exit-code-1 exit-code-2 exit-code-3)]
              (println "\nTests complete. Exit code:" final-code)
              (reset! exit-atom final-code)))
          ;; Poll for result on main thread
          (let [check-exit (fn check []
                             (let [code @exit-atom]
                               (if (some? code)
                                 (js/process.exit code)
                                 (js/setTimeout check 100))))]
            (check-exit))))
      2000)))

(defn main []
  (println "=== Direct SAB Sync Tests ===")
  (println "Node.js:" js/process.version)

  ;; Install fat kernel with worker source
  (let [path (js* "require('path')")
        fs (js* "require('fs')")
        worker-path (.resolve path (.dirname path js/__filename) "worker.js")
        worker-source (.readFileSync fs worker-path "utf8")]
    (fat-kernel/install! {:kernel-source-str worker-source})

    ;; Initialize cljs-thread via public API
    (thread/init!
      {:core-connect-string   worker-path
       :future-connect-string worker-path
       :injest-connect-string worker-path}))

  ;; Timeout guard
  (js/setTimeout
    (fn []
      (println "\nTIMEOUT: Tests exceeded 60s time limit")
      (js/process.exit 1))
    60000)

  ;; Run tests when ready
  (run-tests!))
