(ns cljs-thread.runner.direct-sab-unified
  "Unified entry point for direct SAB sync tests.

   This file serves as BOTH main thread entry AND worker source.
   In :advanced mode, using a single compilation unit ensures that
   function symbols match between main thread and workers.

   When run directly (node unified-direct-sab.js):
     - isMainThread = true → runs test initialization
   When eval'd by fat-kernel:
     - isMainThread = false → code available for worker calls"
  (:require-macros [cljs-thread.core :refer [in on-when]])
  (:require
   [goog]
   [cljs-thread.core :as thread]
   [cljs-thread.eve :as eve]
   [cljs-thread.state :as s]
   [cljs-thread.env :as e]
   ;; Pull in test runner
   [cljs-thread.runner.thread-test-runner]
   ;; Pull in test namespaces with aliases to prevent DCE
   [cljs-thread.direct-sab-sync-test :as direct-sab-test]
   [cljs-thread.eve-atom-transfer-test :as atom-transfer-test]
   ;; future-test has tests commented out but needs to be loaded
   #_{:clj-kondo/ignore [:unused-namespace :unused-referred-var]}
   [cljs-thread.future-test]))

;; Anti-DCE: Export specific test vars to prevent Closure from eliminating them
(goog/exportSymbol "cljs_thread.direct_sab_sync_test.simple_future_test" direct-sab-test/simple-future-test)
(goog/exportSymbol "cljs_thread.eve_atom_transfer_test.sanity_check" atom-transfer-test/sanity-check)
;; Note: future-test has all tests commented out, so no var to export

;; ---------------------------------------------------------------------------
;; Test execution (runs on worker via `in`)
;; ---------------------------------------------------------------------------

(defn run-tests-on-worker!
  "Entry point for worker test execution. Called from main thread via `in`."
  [exit-atom]
  (let [exit-code-1 (cljs-thread.runner.thread-test-runner/run-direct-sab-sync!)
        exit-code-2 (cljs-thread.runner.thread-test-runner/run-eve-atom-transfer!)
        exit-code-3 (cljs-thread.runner.thread-test-runner/run-future2!)
        final-code (max exit-code-1 exit-code-2 exit-code-3)]
    (println "\nTests complete. Exit code:" final-code)
    (reset! exit-atom final-code)))

;; ---------------------------------------------------------------------------
;; Main thread logic
;; ---------------------------------------------------------------------------

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
          ;; Use the in-compilation function reference - symbol will match!
          (in :core [exit-atom]
            (run-tests-on-worker! exit-atom))
          ;; Poll for result on main thread
          (let [check-exit (fn check []
                             (let [code @exit-atom]
                               (if (some? code)
                                 (js/process.exit code)
                                 (js/setTimeout check 100))))]
            (check-exit))))
      2000)))

(defn- init-main-thread! []
  (println "=== Direct SAB Sync Tests (Unified Build) ===")
  (println "Node.js:" js/process.version)

  ;; init! is idempotent — auto-detects fat-kernel source from __filename.
  (thread/init!)

  ;; Timeout guard
  (js/setTimeout
    (fn []
      (println "\nTIMEOUT: Tests exceeded 60s time limit")
      (js/process.exit 1))
    60000)

  ;; Run tests when ready
  (run-tests!))

;; ---------------------------------------------------------------------------
;; Entry point
;; ---------------------------------------------------------------------------

(defn main []
  ;; Check if we're on the main thread (screen)
  (if (e/in-screen?)
    (init-main-thread!)
    ;; On worker: nothing to do. The code is just available for `in` calls.
    nil))
