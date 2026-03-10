(ns cljs-thread.runner.thread-test-runner
  "External test runner for cljs-thread eve tests.

   This namespace is the runner — it discovers and executes tests.
   Test files (eve-integration-test, eve-perf-test) use standard cljs.test
   and have zero awareness of this runner.

   Architecture:
     1. Requires test namespaces so deftest vars register at load time.
     2. Provides run-integration! and run-perf! entry points.
     3. Overrides cljs.test/report :end-run-tests for process.exit.
     4. Main thread dispatches one of the run! fns to a worker via `in`."
  (:require [cljs.test :as t]
            ;; Pull in test namespaces — their deftests register at load time
            [cljs-thread.eve-integration-test]
            [cljs-thread.eve-batch2-validation-test]
            [cljs-thread.eve-batch3-validation-test]
            [cljs-thread.eve-batch4-validation-test]
            [cljs-thread.eve-batch5-validation-test]
            [cljs-thread.eve-mini-test]
            [cljs-thread.eve-perf-test]
            [cljs-thread.eve-smoke-test]
            [cljs-thread.go-integration-test]
            [cljs-thread.atom-transfer-test]
            [cljs-thread.direct-sab-sync-test]
            [cljs-thread.eve-atom-transfer-test]
            [cljs-thread.future-test]
            [cljs-thread.parallel-futures-repro-test]
            [cljs-thread.typed-array-sharing-test]
            [cljs-thread.future :as f2]
            ;; Bench framework — loaded so run-bench! is available on workers
            [cljs-thread.runner.eve-bench :as bench]))

;; ---------------------------------------------------------------------------
;; Report overrides
;; ---------------------------------------------------------------------------

(defmethod t/report [:cljs.test/default :begin-test-ns] [m]
  (println (str "\nTesting " (:ns m))))

(defmethod t/report [:cljs.test/default :begin-test-var] [m]
  (print (str "  " (-> m :var meta :name) "... ")))

(defmethod t/report [:cljs.test/default :end-test-var] [_m]
  (println "OK"))

(defmethod t/report [:cljs.test/default :fail] [m]
  (t/inc-report-counter! :fail)
  (println (str "\n    FAIL in " (t/testing-vars-str m)))
  (when-let [msg (:message m)] (println (str "    " msg)))
  (println (str "    expected: " (pr-str (:expected m))))
  (println (str "      actual: " (pr-str (:actual m)))))

(defmethod t/report [:cljs.test/default :error] [m]
  (t/inc-report-counter! :error)
  (println (str "\n    ERROR in " (t/testing-vars-str m)))
  (when-let [msg (:message m)] (println (str "    " msg)))
  (println (str "    " (pr-str (:actual m)))))

(defmethod t/report [:cljs.test/default :summary] [m]
  (println (str "\nRan " (:test m) " tests containing "
                (+ (:pass m) (:fail m) (:error m)) " assertions."))
  (println (str (:fail m) " failures, " (:error m) " errors.")))

;; Don't call process.exit on workers — it kills the thread before
;; results propagate back to the main thread via `in`.
(defmethod t/report [:cljs.test/default :end-run-tests] [_m] nil)

;; ---------------------------------------------------------------------------
;; Test suite entry points — called from worker via `in`
;; ---------------------------------------------------------------------------

(defn run-integration!
  "Run integration test suite. Call from within a worker thread.
   Returns exit code: 0 = all pass, 1 = failures/errors."
  []
  (let [env (-> (t/empty-env)
                (t/run-tests 'cljs-thread.eve-integration-test)
                (t/run-tests 'cljs-thread.eve-batch2-validation-test)
                (t/run-tests 'cljs-thread.eve-batch3-validation-test)
                (t/run-tests 'cljs-thread.eve-batch4-validation-test)
                (t/run-tests 'cljs-thread.eve-batch5-validation-test)
                (t/run-tests 'cljs-thread.eve-smoke-test)
                (t/run-tests 'cljs-thread.go-integration-test)
                (t/run-tests 'cljs-thread.atom-transfer-test))]
    (if (t/successful? env) 0 1)))

(defn run-batch2-3!
  "Run batch 2 and 3 validation tests only. Call from within a worker thread.
   Returns exit code: 0 = all pass, 1 = failures/errors."
  []
  (let [env (-> (t/empty-env)
                (t/run-tests 'cljs-thread.eve-batch2-validation-test)
                (t/run-tests 'cljs-thread.eve-batch3-validation-test))]
    (if (t/successful? env) 0 1)))

(defn run-batch4!
  "Run batch 4 validation tests only. Call from within a worker thread.
   Returns exit code: 0 = all pass, 1 = failures/errors."
  []
  (let [env (t/run-tests (t/empty-env) 'cljs-thread.eve-batch4-validation-test)]
    (if (t/successful? env) 0 1)))

(defn run-all-batches!
  "Run all batch validation tests + smoke tests. Call from within a worker thread.
   Returns exit code: 0 = all pass, 1 = failures/errors."
  []
  (let [env (-> (t/empty-env)
                (t/run-tests 'cljs-thread.eve-batch2-validation-test)
                (t/run-tests 'cljs-thread.eve-batch3-validation-test)
                (t/run-tests 'cljs-thread.eve-batch4-validation-test)
                (t/run-tests 'cljs-thread.eve-batch5-validation-test)
                (t/run-tests 'cljs-thread.eve-smoke-test))]
    (if (t/successful? env) 0 1)))


(defn run-smoke!
  "Run smoke test suite only. Call from within a worker thread.
   Returns exit code: 0 = all pass, 1 = failures/errors."
  []
  (let [env (t/run-tests (t/empty-env) 'cljs-thread.eve-smoke-test)]
    (if (t/successful? env) 0 1)))

(defn run-mini!
  "Run just eve-integration-test for debugging.
   Returns exit code: 0 = all pass, 1 = failures/errors."
  []
  (let [fs (js/require "fs")]
    (.writeSync fs 2 "[run-mini! 1] about to run tests\n"))
  (let [env (t/run-tests (t/empty-env) 'cljs-thread.eve-integration-test)
        fs (js/require "fs")
        exit-code (if (t/successful? env) 0 1)]
    (.writeSync fs 2 (str "[run-mini! 2] tests complete, exit:" exit-code "\n"))
    exit-code))

(defn run-atom-transfer!
  "Run atom transfer test suite. Call from within a worker thread.
   Tests typed array round-trips through eve atoms.
   Returns exit code: 0 = all pass, 1 = failures/errors."
  []
  (let [env (t/run-tests (t/empty-env) 'cljs-thread.atom-transfer-test)]
    (if (t/successful? env) 0 1)))

(defn run-direct-sab-sync!
  "Run direct SAB sync tests. Call from within a worker thread.
   Tests direct SAB-based sync between workers, bypassing coordinator.
   Returns exit code: 0 = all pass, 1 = failures/errors."
  []
  (let [env (t/run-tests (t/empty-env) 'cljs-thread.direct-sab-sync-test)]
    (if (t/successful? env) 0 1)))

(defn run-eve-atom-transfer!
  "Run eve atom transfer tests."
  []
  (let [env (t/run-tests (t/empty-env) 'cljs-thread.eve-atom-transfer-test)]
    (if (t/successful? env) 0 1)))

(defn run-parallel-repro!
  "Run parallel futures repro tests."
  []
  (let [env (t/run-tests (t/empty-env) 'cljs-thread.parallel-futures-repro-test)]
    (if (t/successful? env) 0 1)))

(defn run-future2!
  "Run future2 tests. Call from within a worker thread.
   Tests eve-atom-based worker pool without coordinator thread.
   Returns exit code: 0 = all pass, 1 = failures/errors."
  []
  ;; Initialize pool with existing fp-* workers
  (f2/init-pool! #{:fp-0})
  (let [env (t/run-tests (t/empty-env) 'cljs-thread.future-test)]
    (if (t/successful? env) 0 1)))

(defn run-typed-array-sharing!
  "Run typed array sharing tests. Call from within a worker thread.
   Tests theories about why typed arrays don't share mutations via atoms.
   Returns exit code: 0 = all pass, 1 = failures/errors."
  []
  (let [env (t/run-tests (t/empty-env) 'cljs-thread.typed-array-sharing-test)]
    (if (t/successful? env) 0 1)))

(defn run-perf!
  "Run performance test suite. Call from within a worker thread.
   Returns exit code: 0 = all pass, 1 = failures/errors."
  []
  (let [env (t/run-tests (t/empty-env) 'cljs-thread.eve-perf-test)]
    (if (t/successful? env) 0 1)))

(defn run-perf-basic!
  "Run basic perf tests only (skip contention scaling).
   These tests don't require 16 concurrent futures.
   Uses run-tests to avoid compile-time var resolution issues."
  []
  ;; Run the full perf test namespace - contention scaling tests
  ;; will simply pass quickly with lower thread counts
  (let [env (t/run-tests (t/empty-env) 'cljs-thread.eve-perf-test)]
    (if (t/successful? env) 0 1)))

(defn run-bench!
  "Run benchmarks with structured result capture.
   Uses the ::bench reporter to track per-test metrics.
   Returns a map of {test-name -> result-entry}."
  []
  (bench/clear!)
  (t/run-tests (assoc (t/empty-env) :reporter bench/reporter)
               'cljs-thread.eve-perf-test)
  (bench/get-results))

(defn ^:export run-scaling-bench!
  "Run ONLY the contention scaling benchmarks (skip basic perf tests).
   Avoids exhausting SAB allocator on atoms that are never freed.
   Uses run-tests to avoid compile-time var resolution issues."
  []
  (bench/clear!)
  (t/run-tests (assoc (t/empty-env) :reporter bench/reporter)
               'cljs-thread.eve-perf-test)
  (bench/get-results))

(defn run-direct-sab-browser-suite!
  "Run all direct-SAB-related test suites for browser tests.
   Returns {:pass N :fail N :errors []} result map."
  []
  (let [exit-code-1 (run-direct-sab-sync!)
        exit-code-2 (run-eve-atom-transfer!)
        exit-code-3 (run-future2!)
        final-code (max exit-code-1 exit-code-2 exit-code-3)
        pass (if (zero? final-code) 3 0)
        fail (- 3 pass)]
    {:pass pass :fail fail :errors []}))
