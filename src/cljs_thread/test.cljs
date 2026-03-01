(ns cljs-thread.test
  "Ergonomic test helpers for code running on cljs-thread.

   These helpers leverage cljs-thread's blocking semantics to provide
   synchronous, sequential test primitives that eliminate the async
   ceremony of standard cljs.test.

   IMPORTANT: Do NOT require this namespace when testing cljs-thread itself.
   This is for downstream app/lib authors building on cljs-thread.

   Macros (from cljs-thread.test.clj):
     deftest-worker   — run test body on :core with blocking semantics
     deftest-async    — async test with automatic `done` binding
     with-atom        — create eve atom, execute body
     with-workers     — bind worker handles for dispatch
     is-eventually    — poll-assert with timeout
     is-within        — numeric tolerance assertion
     with-timeout     — timeout guard around test body
     testing-worker   — like cljs.test/testing but on a named worker

   Runtime helpers (this file):
     blocking-sleep   — sleep for N ms using Atomics.wait
     wait-for         — wait for atom to satisfy predicate"
  (:require [cljs.test :as t]
            [cljs-thread.eve :as eve])
  (:require-macros [cljs-thread.test]))

;; ---------------------------------------------------------------------------
;; Blocking primitives
;; ---------------------------------------------------------------------------

(defn blocking-sleep
  "Sleep for the given number of milliseconds using Atomics.wait.
   Only works in a worker thread (not the main thread).
   Returns nil."
  [ms]
  (js/Atomics.wait (js/Int32Array. (js/SharedArrayBuffer. 4)) 0 0 ms)
  nil)

(defn wait-for
  "Wait for an atom to satisfy a predicate, with timeout.
   Returns the atom's value when the predicate is satisfied,
   or throws if the timeout is exceeded.

   Usage:
     (wait-for my-atom #(pos? (:count %)) :timeout 5000)"
  [atm pred & {:keys [timeout interval]
               :or   {timeout 5000 interval 50}}]
  (let [deadline (+ (.now js/Date) timeout)]
    (loop []
      (let [v @atm]
        (if (pred v)
          v
          (if (> (.now js/Date) deadline)
            (throw (js/Error. (str "wait-for timed out after " timeout "ms")))
            (do
              (blocking-sleep interval)
              (recur))))))))

;; ---------------------------------------------------------------------------
;; Test lifecycle helpers
;; ---------------------------------------------------------------------------

(defn setup-test-env!
  "Initialize the test environment for cljs-thread.test.
   Call this once at the start of your test run (handled automatically
   by the generated runner).

   Currently a no-op placeholder for future test infrastructure
   (e.g., test-local atom domains, worker pool pre-warming)."
  []
  nil)

(defn teardown-test-env!
  "Clean up the test environment. Called after all tests complete."
  []
  nil)
