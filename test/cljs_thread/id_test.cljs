(ns cljs-thread.id-test
  (:require
   [clojure.test :refer [deftest is testing]]
   [cljs-thread.id :refer [IDable get-id]]))

(deftest idable-protocol-test
  (testing "can extend a type with IDable and retrieve its id"
    (let [obj (reify IDable (get-id [_] "test-id-123"))]
      (is (= "test-id-123" (get-id obj)))))
  (testing "can extend different objects with different ids"
    (let [obj1 (reify IDable (get-id [_] :worker-1))
          obj2 (reify IDable (get-id [_] :worker-2))]
      (is (= :worker-1 (get-id obj1)))
      (is (= :worker-2 (get-id obj2)))
      (is (not= (get-id obj1) (get-id obj2)))))
  (testing "satisfies? returns true for IDable implementors"
    (let [obj (reify IDable (get-id [_] :test))]
      (is (satisfies? IDable obj)))))
