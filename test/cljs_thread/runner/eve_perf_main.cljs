(ns cljs-thread.runner.eve-perf-main
  "Main-thread entry point for eve performance tests."
  (:require-macros [cljs-thread.core :refer [in on-when]])
  (:require
   [cljs-thread.core :as thread]
   [cljs-thread.state :as s]
   [cljs-thread.strategy.fat-kernel :as fat-kernel]
   [cljs-thread.runner.thread-test-runner]))

(defn main []
  (println "=== Eve + cljs-thread Performance Tests ===")
  (println "Node.js:" js/process.version)

  ;; Install fat kernel and init cljs-thread via public API
  (let [path (js* "require('path')")
        fs (js* "require('fs')")
        worker-path (.resolve path (.dirname path js/__filename) "worker.js")
        worker-source (.readFileSync fs worker-path "utf8")]
    (fat-kernel/install! {:kernel-source-str worker-source})
    (thread/init!
     {:core-connect-string   worker-path
      :future-connect-string worker-path
      :injest-connect-string worker-path
      ;; Match CS-THREAD-COUNTS max (6) for contention-scaling tests
      :future-count 6}))

  ;; Timeout guard (longer for perf tests)
  (js/setTimeout
    (fn []
      (println "\nTIMEOUT: Tests exceeded 240s time limit")
      (js/process.exit 1))
    240000)

  ;; Wait for workers, then dispatch tests to :core
  (on-when (and (contains? @s/peers :core)
                (contains? @s/peers :future)
                (some #(.startsWith (name %) "fp-") (keys @s/peers)))
    {:max-time 30000}
    (println "Workers ready. Peers:" (set (keys @s/peers)))
    (js/setTimeout
      (fn []
        ;; Run full perf tests including contention-scaling
        (println "Dispatching run-perf! to :core...")
        (let [result-promise (in :core [] (cljs-thread.runner.thread-test-runner/run-perf!))]
          (-> @result-promise
              (.then (fn [exit-code]
                       (println "Tests completed with exit code:" exit-code)
                       (js/process.exit (if (number? exit-code) exit-code 1))))
              (.catch (fn [err]
                        (println "\nFATAL:" (str err))
                        (when (.-stack err)
                          (println "Stack:" (.-stack err)))
                        (js/process.exit 1))))))
      3000)))
