(ns ^{:isolated true} cljs-thread.eve.list-test
  "Unit tests for EVE persistent list.
   NOTE: Requires slab allocator to be initialized before running."
  (:require
   [cljs.test :refer-macros [deftest testing is]]
   [cljs-thread.eve.list :as sl]))

(deftest empty-list-test
  (testing "Empty list"
    (let [l (sl/empty-sab-list)]
      (is (= 0 (count l)))
      (is (nil? (seq l))))))

(deftest conj-test
  (testing "Conj single element"
    (let [l (conj (sl/empty-sab-list) 42)]
      (is (= 1 (count l)))
      (is (= 42 (first l)))))

  (testing "Conj multiple elements (stack order)"
    (let [l (-> (sl/empty-sab-list)
                (conj 1) (conj 2) (conj 3))]
      (is (= 3 (count l)))
      (is (= 3 (first l)))  ;; Last conj'd is first
      (is (= 2 (first (rest l)))))))

(deftest sab-list-constructor-test
  (testing "sab-list preserves order"
    (let [l (sl/sab-list [1 2 3])]
      (is (= 3 (count l)))
      (is (= 1 (first l)))
      (is (= 2 (first (rest l)))))))

(deftest pop-test
  (testing "Pop from list"
    (let [l (sl/sab-list [1 2 3])
          l2 (pop l)]
      (is (= 2 (count l2)))
      (is (= 2 (first l2))))))

(deftest peek-test
  (testing "Peek"
    (let [l (sl/sab-list [1 2 3])]
      (is (= 1 (peek l))))))

(deftest seq-test
  (testing "Seq over list"
    (let [l (sl/sab-list [10 20 30])
          result (vec (map identity l))]
      (is (= [10 20 30] result)))))

(deftest reduce-test
  (testing "Reduce list"
    (let [l (sl/sab-list [1 2 3 4 5])
          total (reduce + l)]
      (is (= 15 total))))

  (testing "Reduce with init"
    (let [l (sl/sab-list [1 2 3])
          total (reduce + 100 l)]
      (is (= 106 total)))))

(deftest type-tests
  (testing "String values"
    (let [l (sl/sab-list ["hello" "world"])]
      (is (= "hello" (first l)))
      (is (= "world" (first (rest l))))))

  (testing "Keyword values"
    (let [l (sl/sab-list [:a :b :c])]
      (is (= :a (first l)))))

  (testing "Mixed types"
    (let [l (sl/sab-list [42 "hello" :key true nil 3.14])]
      (is (= 42 (first l))))))

(deftest equality-test
  (testing "Equal lists"
    (let [l1 (sl/sab-list [1 2 3])
          l2 (sl/sab-list [1 2 3])]
      (is (= l1 l2))))

  (testing "Not-equal lists"
    (let [l1 (sl/sab-list [1 2 3])
          l2 (sl/sab-list [1 2 4])]
      (is (not= l1 l2)))))

(deftest scale-test
  (testing "100 elements"
    (let [l (sl/sab-list (range 100))]
      (is (= 100 (count l)))
      (is (= 0 (first l))))))
