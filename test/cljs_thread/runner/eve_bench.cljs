(ns cljs-thread.runner.eve-bench
  "Benchmark framework for cljs-thread + eve.

   Provides structured result capture, high-precision timing, and a custom
   cljs.test reporter. Runs on workers — platform-agnostic (Node.js and
   browser). Results are returned as data maps to the main thread for
   persistence to EDN files and source annotation.

   Usage from perf tests:
     (bench/record! \"label\" elapsed-ms :ops n :result val :detail {...})

   The main-thread entry point (eve_bench_main) handles:
     - EDN file persistence (bench/<test-name>/<timestamp>.edn)
     - Source file annotation (comments under each deftest)"
  (:require [cljs.test :as t]))

;; ---------------------------------------------------------------------------
;; Custom reporter type — used by run-bench! to track per-test results
;; ---------------------------------------------------------------------------

(def reporter ::bench)

;; ---------------------------------------------------------------------------
;; State
;; ---------------------------------------------------------------------------

(defonce ^:private bench-state
  (atom {:current-test nil
         :results      {}}))

(defn clear!
  "Reset all accumulated bench results."
  []
  (reset! bench-state {:current-test nil :results {}}))

;; ---------------------------------------------------------------------------
;; High-precision timing
;; ---------------------------------------------------------------------------

(defn now-ms
  "High-precision monotonic timestamp in milliseconds.
   Uses performance.now() (sub-ms, monotonic) when available,
   falls back to Date.now() (ms, wall-clock)."
  []
  (if (and (exists? js/performance) (.-now js/performance))
    (.now js/performance)
    (js/Date.now)))

(defn timed
  "Execute f (zero-arg fn) and return [result elapsed-ms].
   Uses monotonic high-precision timer."
  [f]
  (let [t0 (now-ms)
        result (f)
        elapsed (- (now-ms) t0)]
    [result elapsed]))

;; ---------------------------------------------------------------------------
;; Result recording
;; ---------------------------------------------------------------------------

(defn record!
  "Record a benchmark measurement for the currently running test.

   Stores structured data in bench-state (keyed by test name from the
   ::bench reporter) and prints a console line for visibility.

   Args:
     label      - human-readable description
     elapsed-ms - wall-clock milliseconds

   Keyword opts:
     :ops    - operation count (enables ms/op calculation)
     :result - primary result value
     :detail - map of extra metrics (CAS loss %, key count, etc.)"
  [label elapsed-ms & {:keys [ops result detail]}]
  (let [test-name (:current-test @bench-state)
        entry (cond-> {:label      label
                       :elapsed-ms elapsed-ms}
                ops            (assoc :ops ops
                                      :ms-per-op (if (pos? ops)
                                                   (/ elapsed-ms ops)
                                                   0))
                (some? result) (assoc :result result)
                detail         (assoc :detail detail))]
    ;; Store if we're inside a bench-reported test
    (when test-name
      (swap! bench-state assoc-in [:results test-name] entry))
    ;; Always print for console visibility
    (if ops
      (println (str "  [bench] " label ": " (.toFixed elapsed-ms 1) "ms"
                    " (" (.toFixed (/ elapsed-ms (max 1 ops)) 2) "ms/op"
                    ", " ops " ops)"))
      (println (str "  [bench] " label ": " (.toFixed elapsed-ms 1) "ms")))))

(defn get-results
  "Return the accumulated results map: {test-name -> result-entry}."
  []
  (:results @bench-state))

;; ---------------------------------------------------------------------------
;; Custom cljs.test reporter — ::bench
;;
;; Tracks current test name so record! can key results automatically.
;; Used when run-bench! sets :reporter ::bench in the test env.
;; ---------------------------------------------------------------------------

(defmethod t/report [::bench :begin-test-ns] [m]
  (println (str "\nBenchmarking " (:ns m))))

(defmethod t/report [::bench :begin-test-var] [m]
  (let [test-name (str (-> m :var meta :name))]
    (swap! bench-state assoc :current-test test-name)
    (print (str "  " test-name " ... "))))

(defmethod t/report [::bench :end-test-var] [_m]
  (swap! bench-state assoc :current-test nil)
  (println "done"))

(defmethod t/report [::bench :pass] [_m]
  ;; Pass assertion — update the current test's :passed flag
  (when-let [test-name (:current-test @bench-state)]
    (swap! bench-state update-in [:results test-name]
           #(if % (assoc % :passed true) {:passed true}))))

(defmethod t/report [::bench :fail] [m]
  (when-let [test-name (:current-test @bench-state)]
    (swap! bench-state update-in [:results test-name]
           #(assoc (or % {}) :passed false
                   :error (str "expected: " (pr-str (:expected m))
                               " actual: " (pr-str (:actual m))))))
  (println (str "\n    FAIL in " (t/testing-vars-str m)
                " (" (-> m :file) ":" (-> m :line) ")")))

(defmethod t/report [::bench :error] [m]
  (when-let [test-name (:current-test @bench-state)]
    (swap! bench-state update-in [:results test-name]
           #(assoc (or % {}) :passed false
                   :error (pr-str (:actual m)))))
  (println (str "\n    ERROR in " (t/testing-vars-str m)
                " " (pr-str (:actual m))))
  (when-let [e (:actual m)]
    (when (instance? js/Error e)
      (println (str "    " (.-stack e))))))

(defmethod t/report [::bench :summary] [m]
  (println (str "\nBenchmarked " (:test m) " tests containing "
                (+ (:pass m) (:fail m) (:error m)) " assertions."))
  (when (pos? (:fail m))
    (println (str "  " (:fail m) " failures.")))
  (when (pos? (:error m))
    (println (str "  " (:error m) " errors."))))

;; Don't exit on workers — results must propagate back via `in`.
(defmethod t/report [::bench :end-run-tests] [_m] nil)

;; ---------------------------------------------------------------------------
;; Entry point
;;
;; run-bench! lives in thread-test-runner (which requires all test namespaces)
;; to avoid a circular dependency: eve-perf-test -> eve-bench -> eve-perf-test.
;; ---------------------------------------------------------------------------
