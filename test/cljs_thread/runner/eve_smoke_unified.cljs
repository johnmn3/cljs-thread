(ns cljs-thread.runner.eve-smoke-unified
  "Unified entry point for eve smoke tests.

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
   [cljs-thread.eve-smoke-test :as smoke-test]))

;; Anti-DCE: Export a var to prevent Closure from eliminating test namespace
(goog/exportSymbol "cljs_thread.eve_smoke_test.sanity_check" smoke-test/sanity-check)

;; ---------------------------------------------------------------------------
;; Test execution (runs on worker via `in`)
;; ---------------------------------------------------------------------------

(defn run-tests-on-worker!
  "Entry point for worker test execution. Called from main thread via `in`."
  []
  (cljs-thread.runner.thread-test-runner/run-smoke!))

;; ---------------------------------------------------------------------------
;; Main thread logic
;; ---------------------------------------------------------------------------

(defn- init-main-thread! []
  (println "=== Eve + cljs-thread Smoke Tests (Unified Build) ===")
  (println "Node.js:" js/process.version)

  ;; init! is idempotent — auto-detects fat-kernel source from __filename.
  ;; Need 6 future workers to support 5-deep nested futures.
  (thread/init! {:future-count 6})

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
        (-> @(in :core [] (run-tests-on-worker!))
            (.then (fn [exit-code]
                     (js/setTimeout
                       #(js/process.exit (if (number? exit-code) exit-code 1))
                       500)))
            (.catch (fn [err]
                      (println "\nFATAL:" (str err))
                      (js/process.exit 1)))))
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
