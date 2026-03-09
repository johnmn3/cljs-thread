(ns cljs-thread.runner.eve-smoke-main
  "Main-thread entry point for eve smoke tests."
  (:require-macros [cljs-thread.core :refer [in on-when]])
  (:require
   [cljs-thread.core :as thread]
   [cljs-thread.state :as s]
   [cljs-thread.strategy.fat-kernel :as fat-kernel]
   [cljs-thread.runner.thread-test-runner]))

(defn main []
  (println "=== Eve + cljs-thread Smoke Tests ===")
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
      ;; Need 6 future workers to support 5-deep nested futures
      :future-count 6}))

  ;; Timeout guard
  (js/setTimeout
    (fn []
      (println "\nTIMEOUT: Tests exceeded 120s time limit")
      (js/process.exit 1))
    120000)

  ;; Wait for workers, then dispatch smoke tests to :core
  (on-when (and (contains? @s/peers :core)
                (contains? @s/peers :future)
                (some #(.startsWith (name %) "fp-") (keys @s/peers)))
    {:max-time 30000}
    (println "Workers ready. Peers:" (set (keys @s/peers)))
    (js/setTimeout
      (fn []
        (-> @(in :core [] (cljs-thread.runner.thread-test-runner/run-smoke!))
            (.then (fn [exit-code]
                     (js/setTimeout
                       #(js/process.exit (if (number? exit-code) exit-code 1))
                       500)))
            (.catch (fn [err]
                      (println "\nFATAL:" (str err))
                      (js/process.exit 1)))))
      3000)))
