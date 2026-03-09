(ns cljs-thread.eve.jvm-array-test
  (:require [clojure.test :refer [deftest is testing]]
            [cljs-thread.eve.deftype-proto.alloc :as alloc]))

(deftest int-array-round-trip
  (testing "int-array writes as 0x1D and reads back as vector"
    (let [ctx (alloc/make-jvm-heap-slab-ctx {})
          arr (int-array [10 20 30 40])]
      (binding [alloc/*jvm-slab-ctx* ctx]
        (let [off (alloc/jvm-write-eve-array! ctx arr)
              result (alloc/jvm-read-eve-array ctx off)]
          (is (= [10 20 30 40] result)))))))

(deftest double-array-round-trip
  (testing "double-array writes and reads back"
    (let [ctx (alloc/make-jvm-heap-slab-ctx {})
          arr (double-array [1.5 2.5 3.5])]
      (binding [alloc/*jvm-slab-ctx* ctx]
        (let [off (alloc/jvm-write-eve-array! ctx arr)
              result (alloc/jvm-read-eve-array ctx off)]
          (is (= [1.5 2.5 3.5] result)))))))

(deftest float-array-round-trip
  (testing "float-array writes and reads back"
    (let [ctx (alloc/make-jvm-heap-slab-ctx {})
          arr (float-array [1.0 2.0 3.0])]
      (binding [alloc/*jvm-slab-ctx* ctx]
        (let [off (alloc/jvm-write-eve-array! ctx arr)
              result (alloc/jvm-read-eve-array ctx off)]
          (is (every? true? (map #(< (Math/abs (- %1 %2)) 0.001) [1.0 2.0 3.0] result))))))))

(deftest short-array-round-trip
  (testing "short-array writes and reads back"
    (let [ctx (alloc/make-jvm-heap-slab-ctx {})
          arr (short-array [100 200 300])]
      (binding [alloc/*jvm-slab-ctx* ctx]
        (let [off (alloc/jvm-write-eve-array! ctx arr)
              result (alloc/jvm-read-eve-array ctx off)]
          (is (= [100 200 300] result)))))))

(deftest byte-array-round-trip
  (testing "byte-array writes and reads back"
    (let [ctx (alloc/make-jvm-heap-slab-ctx {})
          arr (byte-array [1 2 3 -1 -128 127])]
      (binding [alloc/*jvm-slab-ctx* ctx]
        (let [off (alloc/jvm-write-eve-array! ctx arr)
              result (alloc/jvm-read-eve-array ctx off)]
          (is (= [1 2 3 -1 -128 127] result)))))))

(deftest empty-array-round-trip
  (testing "empty int-array round-trips"
    (let [ctx (alloc/make-jvm-heap-slab-ctx {})
          arr (int-array [])]
      (binding [alloc/*jvm-slab-ctx* ctx]
        (let [off (alloc/jvm-write-eve-array! ctx arr)
              result (alloc/jvm-read-eve-array ctx off)]
          (is (= [] result)))))))

(deftest header-type-byte-is-0x1D
  (testing "the first byte of the block is 0x1D"
    (let [ctx (alloc/make-jvm-heap-slab-ctx {})
          arr (int-array [42])]
      (binding [alloc/*jvm-slab-ctx* ctx]
        (let [off (alloc/jvm-write-eve-array! ctx arr)]
          (is (= 0x1D (alloc/jvm-read-header-type-byte ctx off))))))))
