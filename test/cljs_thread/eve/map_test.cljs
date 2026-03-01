(ns ^{:isolated true} cljs-thread.eve.map-test
  "Unit tests for EVE persistent HAMT map.
   NOTE: Requires slab allocator to be initialized before running.
   Use slab-test-runner to run these tests."
  (:require
   [cljs.test :refer-macros [deftest testing is]]
   [cljs-thread.eve.map :as sm]))

;;-----------------------------------------------------------------------------
;; Basic Operations
;;-----------------------------------------------------------------------------

(deftest empty-map-test
  (testing "Empty map"
    (let [m (sm/empty-hash-map)]
      (is (= 0 (count m)))
      (is (nil? (get m 1)))
      (is (nil? (seq m))))))

(deftest assoc-test
  (testing "Assoc single entry"
    (let [m (assoc (sm/empty-hash-map) 1 100)]
      (is (= 1 (count m)))
      (is (= 100 (get m 1)))
      (is (nil? (get m 2)))))

  (testing "Assoc multiple entries"
    (let [m (-> (sm/empty-hash-map)
                (assoc 1 100)
                (assoc 2 200)
                (assoc 3 300))]
      (is (= 3 (count m)))
      (is (= 100 (get m 1)))
      (is (= 200 (get m 2)))
      (is (= 300 (get m 3)))))

  (testing "Assoc update existing key"
    (let [m1 (assoc (sm/empty-hash-map) 1 100)
          m2 (assoc m1 1 999)]
      (is (= 1 (count m2)))
      (is (= 999 (get m2 1))))))

(deftest hash-map-constructor-test
  (testing "hash-map from kvs"
    (let [m (sm/hash-map 1 10 2 20 3 30)]
      (is (= 3 (count m)))
      (is (= 10 (get m 1)))
      (is (= 20 (get m 2)))
      (is (= 30 (get m 3)))))

  (testing "into-hash-map"
    (let [m (into (sm/hash-map) [[1 10] [2 20]])]
      (is (= 2 (count m)))
      (is (= 10 (get m 1)))
      (is (= 20 (get m 2))))))

(deftest dissoc-test
  (testing "Dissoc existing key"
    (let [m (-> (sm/empty-hash-map)
                (assoc 1 100)
                (assoc 2 200)
                (dissoc 1))]
      (is (= 1 (count m)))
      (is (nil? (get m 1)))
      (is (= 200 (get m 2)))))

  (testing "Dissoc non-existing key"
    (let [m (assoc (sm/empty-hash-map) 1 100)
          m2 (dissoc m 99)]
      (is (= 1 (count m2)))
      (is (= 100 (get m2 1))))))

;;-----------------------------------------------------------------------------
;; Type tests
;;-----------------------------------------------------------------------------

(deftest type-tests
  (testing "Integer keys and values"
    (let [m (sm/hash-map 42 99)]
      (is (= 99 (get m 42)))))

  (testing "Float values"
    (let [m (sm/hash-map 1 3.14)]
      (is (== 3.14 (get m 1)))))

  (testing "String keys and values"
    (let [m (sm/hash-map "hello" "world")]
      (is (= "world" (get m "hello")))))

  (testing "Keyword keys and values"
    (let [m (sm/hash-map :a 1 :b 2)]
      (is (= 1 (get m :a)))
      (is (= 2 (get m :b)))))

  (testing "Boolean values"
    (let [m (sm/hash-map :t true :f false)]
      (is (true? (get m :t)))
      (is (false? (get m :f)))))

  (testing "Nil values"
    (let [m (sm/hash-map :n nil)]
      (is (nil? (get m :n)))
      (is (contains? m :n)))))

;;-----------------------------------------------------------------------------
;; Sequence tests
;;-----------------------------------------------------------------------------

(deftest seq-test
  (testing "seq of small map"
    (let [m (sm/hash-map 1 10 2 20 3 30)
          entries (into {} (seq m))]
      (is (= 3 (count entries)))
      (is (= 10 (get entries 1)))
      (is (= 20 (get entries 2)))
      (is (= 30 (get entries 3))))))

(deftest reduce-test
  (testing "Reduce values"
    (let [m (sm/hash-map 1 10 2 20 3 30)
          total (reduce (fn [acc [k v]] (+ acc v)) 0 m)]
      (is (= 60 total)))))

;;-----------------------------------------------------------------------------
;; Scale tests
;;-----------------------------------------------------------------------------

(deftest scale-test-100
  (testing "100 entries"
    (let [m (reduce (fn [m i] (assoc m i (* i 10)))
                    (sm/empty-hash-map)
                    (range 100))]
      (is (= 100 (count m)))
      (doseq [i (range 100)]
        (is (= (* i 10) (get m i))
            (str "Key " i " should map to " (* i 10)))))))

(deftest scale-test-1000
  (testing "1000 entries"
    (let [m (reduce (fn [m i] (assoc m i (* i 10)))
                    (sm/empty-hash-map)
                    (range 1000))]
      (is (= 1000 (count m)))
      ;; Spot check
      (is (= 0 (get m 0)))
      (is (= 5000 (get m 500)))
      (is (= 9990 (get m 999))))))

;;-----------------------------------------------------------------------------
;; Equality tests
;;-----------------------------------------------------------------------------

(deftest equality-test
  (testing "Equal maps"
    (let [m1 (sm/hash-map 1 10 2 20)
          m2 (sm/hash-map 1 10 2 20)]
      (is (= m1 m2))))

  (testing "Not-equal maps"
    (let [m1 (sm/hash-map 1 10)
          m2 (sm/hash-map 1 20)]
      (is (not= m1 m2)))))
