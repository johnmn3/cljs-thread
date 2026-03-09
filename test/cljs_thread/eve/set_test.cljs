(ns ^{:isolated true} cljs-thread.eve.set-test
  "Unit tests for EVE persistent set.
   NOTE: Requires slab allocator to be initialized before running."
  (:require
   [cljs.test :refer-macros [deftest testing is]]
   [cljs-thread.eve.set :as ss]))

(deftest empty-set-test
  (testing "Empty set"
    (let [s (ss/empty-hash-set)]
      (is (= 0 (count s)))
      (is (nil? (seq s))))))

(deftest conj-test
  (testing "Conj single element"
    (let [s (conj (ss/empty-hash-set) 42)]
      (is (= 1 (count s)))
      (is (contains? s 42))))

  (testing "Conj multiple elements"
    (let [s (-> (ss/empty-hash-set)
                (conj 1) (conj 2) (conj 3))]
      (is (= 3 (count s)))
      (is (contains? s 1))
      (is (contains? s 2))
      (is (contains? s 3))))

  (testing "Conj duplicate"
    (let [s (-> (ss/empty-hash-set) (conj 1) (conj 1))]
      (is (= 1 (count s))))))

(deftest disj-test
  (testing "Disj existing element"
    (let [s (-> (ss/empty-hash-set) (conj 1) (conj 2) (conj 3))
          s2 (disj s 2)]
      (is (= 2 (count s2)))
      (is (contains? s2 1))
      (is (not (contains? s2 2)))
      (is (contains? s2 3))))

  (testing "Disj non-existing element"
    (let [s (-> (ss/empty-hash-set) (conj 1))
          s2 (disj s 99)]
      (is (= 1 (count s2))))))

(deftest hash-set-constructor-test
  (testing "hash-set from values"
    (let [s (into (ss/hash-set) [1 2 3 4 5])]
      (is (= 5 (count s)))
      (doseq [i (range 1 6)]
        (is (contains? s i))))))

(deftest seq-test
  (testing "Seq over set"
    (let [s (into (ss/hash-set) [1 2 3])
          elems (set (seq s))]
      (is (= #{1 2 3} elems)))))

(deftest reduce-test
  (testing "Reduce set"
    (let [s (into (ss/hash-set) [1 2 3 4 5])
          total (reduce + s)]
      (is (= 15 total)))))

(deftest type-tests
  (testing "String values"
    (let [s (into (ss/hash-set) ["hello" "world"])]
      (is (= 2 (count s)))
      (is (contains? s "hello"))
      (is (contains? s "world"))))

  (testing "Keyword values"
    (let [s (into (ss/hash-set) [:a :b :c])]
      (is (= 3 (count s)))
      (is (contains? s :a))))

  (testing "Mixed types"
    (let [s (into (ss/hash-set) [42 "hello" :key])]
      (is (= 3 (count s)))
      (is (contains? s 42))
      (is (contains? s "hello"))
      (is (contains? s :key)))))

(deftest equality-test
  (testing "Equal sets"
    (let [s1 (into (ss/hash-set) [1 2 3])
          s2 (into (ss/hash-set) [3 2 1])]
      (is (= s1 s2))))

  (testing "Not-equal sets"
    (let [s1 (into (ss/hash-set) [1 2])
          s2 (into (ss/hash-set) [1 3])]
      (is (not= s1 s2)))))

(deftest scale-test
  (testing "100 elements"
    (let [s (into (ss/hash-set) (range 100))]
      (is (= 100 (count s)))
      (doseq [i (range 100)]
        (is (contains? s i))))))
