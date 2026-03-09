(ns cljs-thread.eve.jvm-obj-test
  (:require [clojure.test :refer [deftest is testing]]
            [cljs-thread.eve.deftype-proto.alloc :as alloc]))

(deftest obj-int32-round-trip
  (testing "obj with int32 fields writes as 0x1E and reads back"
    (let [ctx (alloc/make-jvm-heap-slab-ctx {})
          schema {:x :int32 :y :int32}
          values {:x 100 :y 200}]
      (binding [alloc/*jvm-slab-ctx* ctx]
        (let [off (alloc/jvm-write-obj! ctx schema values)
              result (alloc/jvm-read-obj ctx off)]
          (is (= schema (:schema result)))
          (is (= 100 (get-in result [:values :x])))
          (is (= 200 (get-in result [:values :y]))))))))

(deftest obj-float64-round-trip
  (testing "obj with float64 fields"
    (let [ctx (alloc/make-jvm-heap-slab-ctx {})
          schema {:temp :float64 :pressure :float64}
          values {:temp 98.6 :pressure 1013.25}]
      (binding [alloc/*jvm-slab-ctx* ctx]
        (let [off (alloc/jvm-write-obj! ctx schema values)
              result (alloc/jvm-read-obj ctx off)]
          (is (= schema (:schema result)))
          (is (< (Math/abs (- 98.6 (get-in result [:values :temp]))) 0.001))
          (is (< (Math/abs (- 1013.25 (get-in result [:values :pressure]))) 0.001)))))))

(deftest obj-mixed-types
  (testing "obj with mixed int8, uint16, float32 fields"
    (let [ctx (alloc/make-jvm-heap-slab-ctx {})
          schema {:flag :uint8 :count :uint16 :ratio :float32}
          values {:flag 1 :count 1000 :ratio 3.14}]
      (binding [alloc/*jvm-slab-ctx* ctx]
        (let [off (alloc/jvm-write-obj! ctx schema values)
              result (alloc/jvm-read-obj ctx off)]
          (is (= schema (:schema result)))
          (is (= 1 (get-in result [:values :flag])))
          (is (= 1000 (get-in result [:values :count])))
          (is (< (Math/abs (- 3.14 (get-in result [:values :ratio]))) 0.01)))))))

(deftest obj-header-type-byte-is-0x1E
  (testing "the first byte of the block is 0x1E"
    (let [ctx (alloc/make-jvm-heap-slab-ctx {})
          schema {:a :int32}
          values {:a 42}]
      (binding [alloc/*jvm-slab-ctx* ctx]
        (let [off (alloc/jvm-write-obj! ctx schema values)]
          (is (= 0x1E (alloc/jvm-read-header-type-byte ctx off))))))))

(deftest obj-default-zero-for-missing-fields
  (testing "missing values default to 0"
    (let [ctx (alloc/make-jvm-heap-slab-ctx {})
          schema {:a :int32 :b :int32}
          values {:a 42}]
      (binding [alloc/*jvm-slab-ctx* ctx]
        (let [off (alloc/jvm-write-obj! ctx schema values)
              result (alloc/jvm-read-obj ctx off)]
          (is (= 42 (get-in result [:values :a])))
          (is (= 0 (get-in result [:values :b]))))))))

(deftest obj-signed-int8-round-trip
  (testing "int8 handles negative values"
    (let [ctx (alloc/make-jvm-heap-slab-ctx {})
          schema {:s :int8}
          values {:s -42}]
      (binding [alloc/*jvm-slab-ctx* ctx]
        (let [off (alloc/jvm-write-obj! ctx schema values)
              result (alloc/jvm-read-obj ctx off)]
          (is (= -42 (get-in result [:values :s]))))))))
