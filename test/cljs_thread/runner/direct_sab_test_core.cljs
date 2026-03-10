(ns cljs-thread.runner.direct-sab-test-core
  "Worker-side entry point for direct SAB browser tests.

   Runs on :core worker. Test execution is triggered via `in` macro
   from the screen, calling thread-test-runner/run-direct-sab-browser-suite!.

   This module just needs to require the test namespaces to ensure
   they're loaded in the worker."
  (:require [cljs-thread.runner.thread-test-runner]
            [cljs-thread.direct-sab-sync-test]
            [cljs-thread.eve-atom-transfer-test]
            [cljs-thread.future-test]))

(defn init! []
  ;; Just ensure namespaces are loaded; tests run via `in` macro from screen
  nil)
