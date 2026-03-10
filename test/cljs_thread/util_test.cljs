(ns cljs-thread.util-test
  (:require
   [clojure.test :refer [deftest is testing]]
   [cljs-thread.util :as u]))

(deftest gen-id-test
  (testing "generates a UUID string when no data provided"
    (let [id (u/gen-id)]
      (is (string? id))
      (is (re-matches #"[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}" id))))
  (testing "generates unique IDs on successive calls"
    (let [id1 (u/gen-id)
          id2 (u/gen-id)]
      (is (not= id1 id2))))
  (testing "returns :id from data map when present"
    (is (= "my-id" (u/gen-id {:id "my-id"}))))
  (testing "generates UUID when data map has no :id"
    (let [id (u/gen-id {:name "foo"})]
      (is (string? id))
      (is (re-matches #"[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}" id)))))

(deftest encode-decode-qp-test
  (testing "round-trips a simple map"
    (let [m {:id :root :name "test"}
          encoded (u/encode-qp m)
          decoded (u/decode-qp encoded)]
      (is (string? encoded))
      (is (.startsWith encoded "?"))
      (is (= m decoded))))
  (testing "round-trips an empty map"
    (let [m {}
          encoded (u/encode-qp m)
          decoded (u/decode-qp encoded)]
      (is (= m decoded))))
  (testing "round-trips nested data"
    (let [m {:a [1 2 3] :b {:c "hello"}}
          encoded (u/encode-qp m)
          decoded (u/decode-qp encoded)]
      (is (= m decoded))))
  (testing "decode-qp returns nil for nil input"
    (is (nil? (u/decode-qp nil)))))

(deftest typed-array?-test
  (testing "detects Int8Array"
    (is (u/typed-array? (js/Int8Array. 4))))
  (testing "detects Uint8Array"
    (is (u/typed-array? (js/Uint8Array. 4))))
  (testing "detects Float64Array"
    (is (u/typed-array? (js/Float64Array. 4))))
  (testing "returns falsy for plain array"
    (is (not (u/typed-array? (array 1 2 3)))))
  (testing "returns falsy for non-array types"
    (is (not (u/typed-array? "hello")))
    (is (not (u/typed-array? 42)))
    (is (not (u/typed-array? {:a 1})))))
