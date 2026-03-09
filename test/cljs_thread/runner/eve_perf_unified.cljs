(ns cljs-thread.runner.eve-perf-unified
  "Unified entry point for eve performance tests.

   This file serves as BOTH main thread entry AND worker source.
   In :advanced mode, using a single compilation unit ensures that
   function symbols match between main thread and workers."
  (:require-macros [cljs-thread.core :refer [in on-when]])
  (:require
   [goog]
   [cljs-thread.core :as thread]
   [cljs-thread.state :as s]
   [cljs-thread.env :as e]
   ;; Pull in test runner
   [cljs-thread.runner.thread-test-runner]
   ;; Pull in test namespace with alias to prevent DCE
   #_{:clj-kondo/ignore [:unused-namespace]}
   [cljs-thread.eve-perf-test :as perf-test]))

;; Anti-DCE: Export symbol to prevent Closure from eliminating test vars
#_{:clj-kondo/ignore [:unresolved-symbol]}
(goog/exportSymbol "cljs_thread.eve_perf_test" perf-test)

;; ---------------------------------------------------------------------------
;; Test execution (runs on worker via `in`)
;; ---------------------------------------------------------------------------

(defn run-tests-on-worker!
  "Entry point for worker test execution. Called from main thread via `in`."
  []
  (cljs-thread.runner.thread-test-runner/run-perf!))

;; ---------------------------------------------------------------------------
;; Main thread logic
;; ---------------------------------------------------------------------------

(defn- init-main-thread! []
  (println "=== Eve + cljs-thread Performance Tests (Unified Build) ===")
  (println "Node.js:" js/process.version)

  ;; init! is idempotent — auto-detects fat-kernel source from __filename.
  ;; Match CS-THREAD-COUNTS max (6) for contention-scaling tests.
  (thread/init! {:future-count 6})

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
        (println "Dispatching run-perf! to :core...")
        (let [result-promise (in :core [] (run-tests-on-worker!))]
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

;; ---------------------------------------------------------------------------
;; Entry point
;; ---------------------------------------------------------------------------

(defn main []
  ;; Check if we're on the main thread (screen)
  (if (e/in-screen?)
    (init-main-thread!)
    ;; On worker: nothing to do. The code is just available for `in` calls.
    nil))
