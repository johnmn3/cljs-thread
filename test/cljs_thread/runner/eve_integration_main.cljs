(ns cljs-thread.runner.eve-integration-main
  "Main-thread entry point for eve integration tests.

   Mirrors production usage: call thread/init! with a main function.
   The library handles all internal initialization and ensures
   pools are ready before main runs on :core."
  (:require
   [cljs-thread.core :as thread]
   [cljs-thread.strategy.fat-kernel :as fat-kernel]
   [cljs-thread.runner.thread-test-runner]
   [cljs-thread.parallel-futures-repro-test]))

(defn main []
  (println "=== Eve + cljs-thread Integration Tests ===")
  (println "Node.js:" js/process.version)

  ;; Timeout guard
  (js/setTimeout
    (fn []
      (println "\nTIMEOUT: Tests exceeded 120s time limit")
      (js/process.exit 1))
    120000)

  ;; Install fat kernel (provides worker source for Node.js)
  (let [path (js/require "path")
        fs (js/require "fs")
        worker-path (.resolve path (.dirname path js/__filename) "worker.js")
        worker-source (.readFileSync fs worker-path "utf8")]
    (fat-kernel/install! {:kernel-source-str worker-source})

    ;; Just call init! with test runner as main - like production code
    (thread/init!
     cljs-thread.runner.thread-test-runner/run-parallel-repro!
     {:core-connect-string   worker-path
      :future-connect-string worker-path
      :injest-connect-string worker-path})))
