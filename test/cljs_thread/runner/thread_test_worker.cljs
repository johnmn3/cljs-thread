(ns cljs-thread.runner.thread-test-worker
  "Worker entry point for cljs-thread tests (integration + perf).

   Loads the cljs-thread runtime, eve subsystem, and the test runner
   which transitively pulls in all test namespaces. The fat kernel
   inlines this build into every worker, so all test code is available
   for execution via cljs.test/run-tests."
  (:require [cljs-thread.core]
            [cljs-thread.eve]
            ;; Runtime namespaces for macro-expanded future/in/spawn calls
            [cljs-thread.future]
            [cljs-thread.in]
            [cljs-thread.spawn]
            [cljs-thread.runner.thread-test-runner]))

(defn main []
  ;; All initialization happens via side effects at load time.
  ;; This function exists solely as the shadow-cljs :main entry point.
  nil)
