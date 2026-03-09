(ns ^{:isolated true} cljs-thread.eve.vec-test
  "Unit tests for EVE persistent vector.
   NOTE: Requires slab allocator to be initialized before running."
  (:require
   [cljs.test :refer-macros [deftest testing is]]
   [cljs-thread.eve :as e]
   [cljs-thread.eve.vec :as sv]))

(deftest empty-vec-test
  (testing "Empty vector"
    (let [a (e/atom ::empty-vec-test {})
          result (swap! a (fn [_]
                           (let [v (sv/empty-sab-vec)]
                             (is (= 0 (count v)))
                             (is (nil? (seq v)))
                             :done)))]
      (is (= :done result)))))

(deftest conj-test
  (testing "Conj single element"
    (let [a (e/atom ::conj-test-single {})
          result (swap! a (fn [_]
                           (let [v (conj (sv/empty-sab-vec) 42)]
                             (is (= 1 (count v)))
                             (is (= 42 (nth v 0)))
                             :done)))]
      (is (= :done result))))

  (testing "Conj multiple elements"
    (let [a (e/atom ::conj-test-multi {})
          result (swap! a (fn [_]
                           (let [v (reduce conj (sv/empty-sab-vec) (range 10))]
                             (is (= 10 (count v)))
                             (doseq [i (range 10)]
                               (is (= i (nth v i))))
                             :done)))]
      (is (= :done result)))))

(deftest nth-test
  (testing "Nth access"
    (let [a (e/atom ::nth-test-access {})
          result (swap! a (fn [_]
                           (let [v (sv/sab-vec [10 20 30 40 50])]
                             (is (= 10 (nth v 0)))
                             (is (= 30 (nth v 2)))
                             (is (= 50 (nth v 4)))
                             :done)))]
      (is (= :done result))))

  (testing "Nth out of bounds"
    (let [a (e/atom ::nth-test-bounds {})
          result (swap! a (fn [_]
                           (let [v (sv/sab-vec [1 2 3])]
                             (is (thrown? js/Error (nth v -1)))
                             (is (thrown? js/Error (nth v 3)))
                             :done)))]
      (is (= :done result)))))

(deftest assoc-test
  (testing "Assoc update"
    (let [a (e/atom ::assoc-test {})
          result (swap! a (fn [_]
                           (let [v (sv/sab-vec [10 20 30])
                                 v2 (assoc v 1 99)]
                             (is (= 99 (nth v2 1)))
                             ;; Original unchanged
                             (is (= 20 (nth v 1)))
                             :done)))]
      (is (= :done result)))))

(deftest pop-test
  (testing "Pop from vector"
    (let [a (e/atom ::pop-test {})
          result (swap! a (fn [_]
                           (let [v (sv/sab-vec [10 20 30])
                                 v2 (pop v)]
                             (is (= 2 (count v2)))
                             (is (= 10 (nth v2 0)))
                             (is (= 20 (nth v2 1)))
                             :done)))]
      (is (= :done result)))))

(deftest peek-test
  (testing "Peek"
    (let [a (e/atom ::peek-test {})
          result (swap! a (fn [_]
                           (let [v (sv/sab-vec [10 20 30])]
                             (is (= 30 (peek v)))
                             :done)))]
      (is (= :done result)))))

(deftest seq-test
  (testing "Seq over vector"
    (let [a (e/atom ::seq-test {})
          result (swap! a (fn [_]
                           (let [v (sv/sab-vec [10 20 30])]
                             (is (= [10 20 30] (vec (seq v))))
                             :done)))]
      (is (= :done result)))))

(deftest reduce-test
  (testing "Reduce vector"
    (let [a (e/atom ::reduce-test {})
          result (swap! a (fn [_]
                           (let [v (sv/sab-vec [1 2 3 4 5])
                                 total (reduce + v)]
                             (is (= 15 total))
                             :done)))]
      (is (= :done result))))

  (testing "Reduce with init"
    (let [a (e/atom ::reduce-test-init {})
          result (swap! a (fn [_]
                           (let [v (sv/sab-vec [1 2 3])
                                 total (reduce + 100 v)]
                             (is (= 106 total))
                             :done)))]
      (is (= :done result)))))

(deftest type-tests
  (testing "Integer values"
    (let [a (e/atom ::type-test-int {})
          result (swap! a (fn [_]
                           (let [v (sv/sab-vec [1 2 3])]
                             (is (= [1 2 3] (vec (seq v))))
                             :done)))]
      (is (= :done result))))

  (testing "String values"
    (let [a (e/atom ::type-test-str {})
          result (swap! a (fn [_]
                           (let [v (sv/sab-vec ["hello" "world"])]
                             (is (= "hello" (nth v 0)))
                             (is (= "world" (nth v 1)))
                             :done)))]
      (is (= :done result))))

  (testing "Keyword values"
    (let [a (e/atom ::type-test-kw {})
          result (swap! a (fn [_]
                           (let [v (sv/sab-vec [:a :b :c])]
                             (is (= :a (nth v 0)))
                             (is (= :c (nth v 2)))
                             :done)))]
      (is (= :done result))))

  (testing "Mixed types"
    (let [a (e/atom ::type-test-mixed {})
          result (swap! a (fn [_]
                           (let [v (sv/sab-vec [42 "hello" :key true nil 3.14])]
                             (is (= 42 (nth v 0)))
                             (is (= "hello" (nth v 1)))
                             (is (= :key (nth v 2)))
                             (is (true? (nth v 3)))
                             (is (nil? (nth v 4)))
                             (is (== 3.14 (nth v 5)))
                             :done)))]
      (is (= :done result)))))

(deftest equality-test
  (testing "Equal vectors"
    (let [a (e/atom ::equality-test-eq {})
          result (swap! a (fn [_]
                           (let [v1 (sv/sab-vec [1 2 3])
                                 v2 (sv/sab-vec [1 2 3])]
                             (is (= v1 v2))
                             :done)))]
      (is (= :done result))))

  (testing "Not-equal vectors"
    (let [a (e/atom ::equality-test-neq {})
          result (swap! a (fn [_]
                           (let [v1 (sv/sab-vec [1 2 3])
                                 v2 (sv/sab-vec [1 2 4])]
                             (is (not= v1 v2))
                             :done)))]
      (is (= :done result)))))

(deftest scale-test
  (testing "100 elements"
    (let [a (e/atom ::scale-test {})
          result (swap! a (fn [_]
                           (let [v (sv/sab-vec (range 100))]
                             (is (= 100 (count v)))
                             (doseq [i (range 100)]
                               (is (= i (nth v i))))
                             :done)))]
      (is (= :done result)))))
