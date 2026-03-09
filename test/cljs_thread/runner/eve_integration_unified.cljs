(ns cljs-thread.runner.eve-integration-unified
  "Unified entry point for eve integration tests.

   This file serves as BOTH main thread entry AND worker source.
   In :advanced mode, using a single compilation unit ensures that
   function symbols match between main thread and workers.

   Mirrors production usage: init! auto-detects everything,
   then dispatches main function to :core when pools are ready."
  (:require
   [goog]
   [cljs-thread.core :as thread]
   [cljs-thread.env :as e]
   ;; Pull in test runner
   [cljs-thread.runner.thread-test-runner]
   ;; Pull in ALL test namespaces with aliases to prevent DCE
   [cljs-thread.eve-integration-test :as integration-test]
   [cljs-thread.eve-batch2-validation-test :as batch2-test]
   [cljs-thread.eve-batch3-validation-test :as batch3-test]
   [cljs-thread.eve-batch4-validation-test :as batch4-test]
   [cljs-thread.eve-batch5-validation-test :as batch5-test]
   [cljs-thread.eve-smoke-test :as smoke-test]
   [cljs-thread.go-integration-test :as go-test]
   [cljs-thread.atom-transfer-test :as atom-test]
   [cljs-thread.parallel-futures-repro-test :as parallel-test]))

;; Anti-DCE: Export specific test vars to prevent Closure from eliminating them
(goog/exportSymbol "cljs_thread.eve_integration_test.cljs_thread_boots" integration-test/cljs-thread-boots)
(goog/exportSymbol "cljs_thread.eve_batch2_validation_test.util_loads_on_worker" batch2-test/util-loads-on-worker)
(goog/exportSymbol "cljs_thread.eve_batch3_validation_test.wasm_data_view" batch3-test/wasm-data-view-available-on-worker)
(goog/exportSymbol "cljs_thread.eve_batch4_validation_test.sab_transfer" batch4-test/sab-transfer-data-enables-worker-atoms)
(goog/exportSymbol "cljs_thread.eve_batch5_validation_test.spawn_conveys" batch5-test/spawn-conveys-shared-atom)
(goog/exportSymbol "cljs_thread.eve_smoke_test.sanity_check" smoke-test/sanity-check)
(goog/exportSymbol "cljs_thread.go_integration_test.park_basic" go-test/park-basic-future)
(goog/exportSymbol "cljs_thread.atom_transfer_test.typed_array" atom-test/typed-array-in-atom-single-thread)
(goog/exportSymbol "cljs_thread.parallel_futures_repro_test.single_future" parallel-test/single-future-works)

;; ---------------------------------------------------------------------------
;; Test execution (runs on :core via thread/init! main function)
;; ---------------------------------------------------------------------------

(defn run-tests-on-core!
  "Entry point for test execution. Called by thread/init! on :core worker."
  []
  (cljs-thread.runner.thread-test-runner/run-integration!))

;; ---------------------------------------------------------------------------
;; Main thread logic
;; ---------------------------------------------------------------------------

(defn- init-main-thread! []
  (println "=== Eve + cljs-thread Integration Tests (Unified Build) ===")
  (println "Node.js:" js/process.version)

  ;; Timeout guard
  (js/setTimeout
    (fn []
      (println "\nTIMEOUT: Tests exceeded 180s time limit")
      (js/process.exit 1))
    180000)

  ;; init! is idempotent — auto-detects fat-kernel source from __filename.
  ;; Pass main function to be dispatched to :core when pools are ready.
  (thread/init! run-tests-on-core!))

;; ---------------------------------------------------------------------------
;; Entry point
;; ---------------------------------------------------------------------------

(defn main []
  ;; Check if we're on the main thread (screen)
  (if (e/in-screen?)
    (init-main-thread!)
    ;; On worker: nothing to do. The code is just available for `in` calls.
    nil))
