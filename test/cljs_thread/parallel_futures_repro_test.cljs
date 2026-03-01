(ns cljs-thread.parallel-futures-repro-test
  "Minimal repros for parallel futures bug.

   Symptom: When multiple futures are created and deref'd, some return nil
   instead of their computed values.

   Example failure:
     expected: [30 12 50]
     actual:   [nil 12 nil]"
  (:require-macros [cljs-thread.core :refer [future]])
  (:require
   [cljs.test :refer [deftest testing is]]
   [cljs-thread.future :as f]))

;; Helper to log to stderr
(defn log [msg]
  (.writeSync (js/require "fs") 2 (str "[REPRO] " msg "\n")))

;; ==========================================================================
;; Single future baseline - should always work
;; ==========================================================================

(deftest single-future-works
  (log "single-future-works START")
  (testing "single future returns correct value"
    (let [result @(future (+ 1 2))]
      (is (= 3 result))))
  (log "single-future-works END"))

;; ==========================================================================
;; Two futures - minimal parallel case
;; ==========================================================================

(deftest two-futures-sequential-deref
  (log "two-futures-sequential-deref START")
  (testing "two futures, deref one at a time"
    (let [f1 (future (+ 10 20))
          f2 (future (* 3 4))]
      (log "created f1 and f2")
      (let [r1 @f1]
        (log (str "f1 result: " r1))
        (let [r2 @f2]
          (log (str "f2 result: " r2))
          (is (= 30 r1) "f1 should be 30")
          (is (= 12 r2) "f2 should be 12")))))
  (log "two-futures-sequential-deref END"))

(deftest two-futures-vector-deref
  (log "two-futures-vector-deref START")
  (testing "two futures, deref in vector literal"
    (let [f1 (future (+ 10 20))
          f2 (future (* 3 4))
          results [@f1 @f2]]
      (log (str "results: " results))
      (is (= [30 12] results))))
  (log "two-futures-vector-deref END"))

;; ==========================================================================
;; Three futures - matches failing test
;; ==========================================================================

(deftest three-futures-sequential-deref
  (log "three-futures-sequential-deref START")
  (log (str "pool state: " @f/pool))
  (testing "three futures, deref one at a time"
    (let [_ (log "creating f1...")
          f1 (future (do (log "f1 EXECUTING on worker") (+ 10 20)))
          _ (log (str "f1 created, pool: " @f/pool))
          _ (log "creating f2...")
          f2 (future (do (log "f2 EXECUTING on worker") (* 3 4)))
          _ (log (str "f2 created, pool: " @f/pool))
          _ (log "creating f3...")
          f3 (future (do (log "f3 EXECUTING on worker") (- 100 50)))
          _ (log (str "f3 created, pool: " @f/pool))]
      (log "all futures created, starting derefs")
      (let [r1 @f1
            _ (log (str "f1=" r1 ", pool: " @f/pool))
            r2 @f2
            _ (log (str "f2=" r2 ", pool: " @f/pool))
            r3 @f3
            _ (log (str "f3=" r3 ", pool: " @f/pool))]
        (is (= 30 r1) "f1 should be 30")
        (is (= 12 r2) "f2 should be 12")
        (is (= 50 r3) "f3 should be 50"))))
  (log "three-futures-sequential-deref END"))

(deftest three-futures-vector-deref
  (log "three-futures-vector-deref START")
  (testing "three futures, deref in vector (original failing pattern)"
    (let [f1 (future (+ 10 20))
          f2 (future (* 3 4))
          f3 (future (- 100 50))
          results [@f1 @f2 @f3]]
      (log (str "results: " results))
      (is (= [30 12 50] results))))
  (log "three-futures-vector-deref END"))

;; ==========================================================================
;; Delayed creation - stagger future creation
;; ==========================================================================

(deftest futures-with-delay-between-creation
  (log "futures-with-delay-between-creation START")
  (testing "create futures with small delays between"
    (let [f1 (future (+ 10 20))
          _ (log "created f1, waiting 10ms")
          _ (js/Atomics.wait (js/Int32Array. (js/SharedArrayBuffer. 4)) 0 0 10)
          f2 (future (* 3 4))
          _ (log "created f2, waiting 10ms")
          _ (js/Atomics.wait (js/Int32Array. (js/SharedArrayBuffer. 4)) 0 0 10)
          f3 (future (- 100 50))
          _ (log "created f3")
          results [@f1 @f2 @f3]]
      (log (str "results: " results))
      (is (= [30 12 50] results))))
  (log "futures-with-delay-between-creation END"))

;; ==========================================================================
;; Pool state inspection
;; ==========================================================================

(deftest check-pool-state-during-futures
  (log "check-pool-state-during-futures START")
  (testing "inspect pool state before/during/after futures"
    (let [pool-before @f/pool
          _ (log (str "pool before: " pool-before))
          f1 (future (+ 1 1))
          pool-after-create @f/pool
          _ (log (str "pool after create: " pool-after-create))
          r1 @f1
          pool-after-deref @f/pool
          _ (log (str "pool after deref: " pool-after-deref))]
      (is (= 2 r1))
      (is (seq (:waiting pool-before)) "pool should have waiting workers initially")))
  (log "check-pool-state-during-futures END"))

;; ==========================================================================
;; Rapid fire - many futures quickly
;; ==========================================================================

(deftest five-futures-rapid
  (log "five-futures-rapid START")
  (testing "five futures created rapidly"
    (let [f1 (future 1)
          f2 (future 2)
          f3 (future 3)
          f4 (future 4)
          f5 (future 5)
          results [@f1 @f2 @f3 @f4 @f5]]
      (log (str "results: " results))
      (is (= [1 2 3 4 5] results))))
  (log "five-futures-rapid END"))

;; ==========================================================================
;; Same worker reuse - sequential single futures
;; ==========================================================================

(deftest sequential-single-futures
  (log "sequential-single-futures START")
  (testing "single futures one after another (worker reuse)"
    (let [r1 @(future (+ 1 1))
          _ (log (str "r1=" r1))
          r2 @(future (+ 2 2))
          _ (log (str "r2=" r2))
          r3 @(future (+ 3 3))
          _ (log (str "r3=" r3))]
      (is (= 2 r1))
      (is (= 4 r2))
      (is (= 6 r3))))
  (log "sequential-single-futures END"))

;; ==========================================================================
;; Heavy computation - longer running futures
;; ==========================================================================

(deftest futures-with-computation
  (log "futures-with-computation START")
  (testing "futures that do real work"
    (let [f1 (future (reduce + (range 100)))
          f2 (future (reduce * (range 1 10)))
          f3 (future (count (filter odd? (range 1000))))
          results [@f1 @f2 @f3]]
      (log (str "results: " results))
      (is (= [4950 362880 500] results))))
  (log "futures-with-computation END"))

;; ==========================================================================
;; Repeated runs - catch intermittent failures
;; ==========================================================================

(deftest three-futures-repeated-10x
  (log "three-futures-repeated-10x START")
  (testing "repeat the failing pattern 10 times"
    (doseq [i (range 10)]
      (log (str "iteration " i))
      (let [f1 (future (+ 10 20))
            f2 (future (* 3 4))
            f3 (future (- 100 50))
            results [@f1 @f2 @f3]]
        (log (str "  results: " results))
        (is (= [30 12 50] results) (str "failed on iteration " i)))))
  (log "three-futures-repeated-10x END"))

;; ==========================================================================
;; Unique markers - track which result came from which future
;; ==========================================================================

(deftest futures-with-unique-markers
  (log "futures-with-unique-markers START")
  (testing "each future returns a unique tagged value"
    (let [f1 (future {:id :f1 :val (+ 10 20)})
          f2 (future {:id :f2 :val (* 3 4)})
          f3 (future {:id :f3 :val (- 100 50)})
          r1 @f1
          r2 @f2
          r3 @f3]
      (log (str "r1=" r1 " r2=" r2 " r3=" r3))
      (is (= :f1 (:id r1)) "r1 should have id :f1")
      (is (= :f2 (:id r2)) "r2 should have id :f2")
      (is (= :f3 (:id r3)) "r3 should have id :f3")
      (is (= 30 (:val r1)))
      (is (= 12 (:val r2)))
      (is (= 50 (:val r3)))))
  (log "futures-with-unique-markers END"))

;; ==========================================================================
;; Deref order variations - does order matter?
;; ==========================================================================

(deftest three-futures-reverse-deref
  (log "three-futures-reverse-deref START")
  (testing "deref in reverse order of creation"
    (let [f1 (future (+ 10 20))
          f2 (future (* 3 4))
          f3 (future (- 100 50))
          ;; deref in reverse: f3, f2, f1
          r3 @f3
          r2 @f2
          r1 @f1]
      (log (str "r1=" r1 " r2=" r2 " r3=" r3))
      (is (= 30 r1))
      (is (= 12 r2))
      (is (= 50 r3))))
  (log "three-futures-reverse-deref END"))

(deftest three-futures-middle-first
  (log "three-futures-middle-first START")
  (testing "deref middle future first"
    (let [f1 (future (+ 10 20))
          f2 (future (* 3 4))
          f3 (future (- 100 50))
          ;; deref middle first: f2, f1, f3
          r2 @f2
          r1 @f1
          r3 @f3]
      (log (str "r1=" r1 " r2=" r2 " r3=" r3))
      (is (= 30 r1))
      (is (= 12 r2))
      (is (= 50 r3))))
  (log "three-futures-middle-first END"))

;; ==========================================================================
;; Creation timing - all at once vs staggered
;; ==========================================================================

(deftest futures-created-in-separate-lets
  (log "futures-created-in-separate-lets START")
  (testing "create and immediately deref, one at a time"
    (let [r1 (let [f (future (+ 10 20))] @f)
          _ (log (str "r1=" r1))
          r2 (let [f (future (* 3 4))] @f)
          _ (log (str "r2=" r2))
          r3 (let [f (future (- 100 50))] @f)
          _ (log (str "r3=" r3))]
      (is (= 30 r1))
      (is (= 12 r2))
      (is (= 50 r3))))
  (log "futures-created-in-separate-lets END"))

;; ==========================================================================
;; Pool size boundary tests
;; ==========================================================================

(deftest futures-equal-to-pool-size
  (log "futures-equal-to-pool-size START")
  (testing "create exactly as many futures as pool workers"
    (let [pool-size (count (:waiting @f/pool))
          _ (log (str "pool size: " pool-size))
          futures (vec (for [i (range pool-size)]
                         (future {:idx i :val (* i 10)})))
          results (mapv deref futures)]
      (log (str "results: " results))
      (is (= pool-size (count results)))
      (doseq [i (range pool-size)]
        (is (= {:idx i :val (* i 10)} (nth results i))
            (str "mismatch at index " i)))))
  (log "futures-equal-to-pool-size END"))

(deftest futures-exceed-pool-size
  (log "futures-exceed-pool-size START")
  (testing "create more futures than pool workers"
    (let [pool-size (count (:waiting @f/pool))
          n (+ pool-size 2)
          _ (log (str "pool size: " pool-size ", creating " n " futures"))
          futures (vec (for [i (range n)]
                         (future {:idx i :val (* i 10)})))
          results (mapv deref futures)]
      (log (str "results: " results))
      (is (= n (count results)))
      (doseq [i (range n)]
        (is (= {:idx i :val (* i 10)} (nth results i))
            (str "mismatch at index " i)))))
  (log "futures-exceed-pool-size END"))
