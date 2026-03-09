(ns cljs-thread.eve.xray-stress-test
  "X-RAY stress test: exercises the allocator and HAMT under heavy churn
   with storage model invariant checking after every operation.

   Ported from com.seniorcaremarket.eve-sab-deftype.xray-stress-test.

   Test phases:
   1. Rapid key rotation (alloc churn with retirement)
   2. Tree growth/shrink cycles (many nodes allocated then freed)
   3. Large value churn (different block sizes stress the allocator)
   4. Dissoc-heavy workloads (retirement paths)
   5. Reset! interleaved with swap! (tests both update paths)
   6. High key-count maps (deep HAMT trees)"
  (:require
   [cljs.test :refer-macros [deftest testing is]]
   [cljs-thread.eve.shared-atom :as a]))

;;-----------------------------------------------------------------------------
;; Test infrastructure
;;-----------------------------------------------------------------------------

(def ^:private step-num (atom 0))
(def ^:private the-env (atom nil))
(def ^:private pass-count (atom 0))
(def ^:private fail-count (atom 0))

(defn- check!
  "Run storage model validation. Returns true if valid."
  [label]
  (let [env @the-env
        result (a/validate-storage-model! env {:width 80 :label label})
        valid? (:valid? result)]
    (if valid?
      (swap! pass-count inc)
      (do
        (swap! fail-count inc)
        (println (str "  [XRAY FAIL] " label))
        (println (str "    gaps=" (count (:gaps result))
                      " overlaps=" (count (:overlaps result))
                      " mirror=" (count (:mirror-mismatches result))
                      " desc-err=" (count (:descriptor-errors result))
                      " adj-free=" (count (:adjacent-free result))
                      " lost=" (- (:expected result) (:tracked result)) "B"))))
    valid?))

(defn- step!
  "Run one test step: execute thunk, then run storage model invariant check."
  [label thunk]
  (let [n (swap! step-num inc)]
    (thunk)
    (let [tag (str "S" n " " label)]
      (when-not (check! tag)
        (println (str "  >> STEP " n " FAILED: " label))
        (a/dump-block-stats! @the-env)
        (a/dump-block-detail! @the-env {:limit 40})
        (throw (js/Error. (str "Invariant broken at step " n ": " label)))))))

;;-----------------------------------------------------------------------------
;; Test phases
;;-----------------------------------------------------------------------------

(defn- run-rapid-key-rotation [the-atom]
  (dotimes [i 200]
    (step! (str "rot-assoc-" i)
      (fn [] (swap! the-atom assoc (keyword (str "rot" (mod i 20))) i)))))

(defn- run-growth-shrink-cycles [the-atom]
  (dotimes [round 5]
    (step! (str "grow-" round)
      (fn [] (swap! the-atom merge
                    (into {} (map (fn [i] [(keyword (str "gs" round "-" i)) (* round i)])
                                  (range 40))))))
    (step! (str "shrink-" round)
      (fn [] (swap! the-atom
                    (fn [m] (reduce dissoc m
                                    (map (fn [i] (keyword (str "gs" round "-" i)))
                                         (range 40)))))))))

(defn- run-large-value-churn [the-atom]
  ;; Small values
  (dotimes [i 50]
    (step! (str "small-" i)
      (fn [] (swap! the-atom assoc (keyword (str "sm" i)) i))))
  ;; Medium values (strings)
  (dotimes [i 30]
    (step! (str "medium-" i)
      (fn [] (swap! the-atom assoc (keyword (str "med" i))
                    (apply str (repeat 50 (str "val-" i)))))))
  ;; Large values (nested maps)
  (dotimes [i 10]
    (step! (str "large-" i)
      (fn [] (swap! the-atom assoc (keyword (str "lg" i))
                    (into {} (map (fn [j] [(keyword (str "n" j)) (* i j)]) (range 20)))))))
  ;; Clean up all
  (step! "large-cleanup"
    (fn [] (swap! the-atom
                  (fn [m]
                    (reduce dissoc m
                            (concat
                              (map #(keyword (str "sm" %)) (range 50))
                              (map #(keyword (str "med" %)) (range 30))
                              (map #(keyword (str "lg" %)) (range 10)))))))))

(defn- run-dissoc-heavy [the-atom]
  (dotimes [round 3]
    (step! (str "dissoc-add-" round)
      (fn [] (swap! the-atom merge
                    (into {} (map (fn [i] [(keyword (str "dh" round "-" i)) i])
                                  (range 100))))))
    (dotimes [i 100]
      (swap! the-atom dissoc (keyword (str "dh" round "-" i)))
      (when (zero? (mod i 10))
        (check! (str "dissoc-" round "-" i))))))

(defn- run-reset-interleaved [the-atom]
  (dotimes [i 50]
    (if (even? i)
      (step! (str "reset-" i)
        (fn [] (reset! the-atom {:cycle i :type :reset})))
      (step! (str "swap-after-reset-" i)
        (fn [] (swap! the-atom assoc :cycle i :type :swap))))))

(defn- run-deep-tree [the-atom]
  ;; Build up many keys one at a time, validating after each batch
  (dotimes [i 100]
    (step! (str "deep-assoc-" i)
      (fn [] (swap! the-atom assoc (keyword (str "deep" i)) {:v i :s (str "val-" i)}))))
  ;; Remove them one at a time
  (dotimes [i 100]
    (step! (str "deep-dissoc-" i)
      (fn [] (swap! the-atom dissoc (keyword (str "deep" i)))))))

;;-----------------------------------------------------------------------------
;; Main test
;;-----------------------------------------------------------------------------

(deftest xray-stress-test
  (testing "Full allocator stress test with invariant checking"
    (println "")
    (println "=== X-RAY Stress Test - Storage Model Invariant Checking ===")
    ;; Reset counters
    (reset! step-num 0)
    (reset! pass-count 0)
    (reset! fail-count 0)
    ;; xray needs its own atom-domain: loading map/vec/list/set namespaces
    ;; registers type encoders that change HAMT allocation routing, causing
    ;; DataView bounds errors. Separate build avoids this.
    (let [the-atom (a/atom-domain {}
                                    :sab-size (* 8 1024 1024)
                                    :max-blocks 8192)]
      (reset! the-env (.-s-atom-env the-atom))
      ;; Initial check on empty atom
      (is (check! "INIT-empty") "Initial state should be valid")

      ;; Phase 1: Rapid key rotation (200 cycles)
      (println "  Phase 1: Rapid key rotation...")
      (run-rapid-key-rotation the-atom)

      ;; Phase 2: Growth/shrink cycles
      (println "  Phase 2: Growth/shrink cycles...")
      (run-growth-shrink-cycles the-atom)

      ;; Phase 3: Large value churn
      (println "  Phase 3: Large value churn...")
      (run-large-value-churn the-atom)

      ;; Phase 4: Dissoc-heavy
      (println "  Phase 4: Dissoc-heavy workload...")
      (run-dissoc-heavy the-atom)

      ;; Phase 5: Reset! interleaved
      (println "  Phase 5: Reset!/swap! interleaved...")
      (run-reset-interleaved the-atom)

      ;; Phase 6: Deep tree
      (println "  Phase 6: High key-count maps...")
      (run-deep-tree the-atom)

      ;; Final check
      (is (check! "FINAL") "Final state should be valid")

      (println (str "  DONE: " @step-num " steps, " @pass-count " checks passed, "
                    @fail-count " failures"))
      (is (zero? @fail-count) "All invariant checks should pass"))))
