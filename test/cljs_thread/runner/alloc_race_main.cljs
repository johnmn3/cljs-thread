(ns cljs-thread.runner.alloc-race-main
  "Main entry point for allocator race condition tests.
   Runs single-threaded to isolate allocator behavior."
  (:require [cljs-thread.eve.alloc-race-test :as race-test]))

(defn main []
  (println "=== Allocator Race Condition Tests ===")
  (println "Node.js:" js/process.version)
  (println "Running SINGLE-THREADED to isolate allocator behavior\n")

  ;; Run tests synchronously - no worker dispatch needed
  (let [exit-code (race-test/run-all)]
    (js/process.exit exit-code)))
