(ns cljs-thread.eve.obj-test
  (:require
   [cljs.test :refer-macros [deftest testing is]]
   [cljs-thread.eve.array :as arr]
   [cljs-thread.eve.obj :as obj]))

;;=============================================================================
;; Schema Tests
;;=============================================================================

(deftest schema-creation-test
  (testing "Basic schema creation"
    (let [schema (obj/create-schema {:key :int32 :val :int32})]
      (is (= {:key :int32 :val :int32} (:field-map schema)))
      (is (contains? (:layout schema) :key))
      (is (contains? (:layout schema) :val))
      (is (pos? (:size schema)))))

  (testing "Schema with different types"
    (let [schema (obj/create-schema {:a :int8 :b :int16 :c :int32 :d :float64})]
      (is (= 4 (count (:field-keys schema))))
      ;; Total size should account for all fields + alignment
      (is (>= (:size schema) (+ 1 2 4 8))))))

(deftest schema-alignment-test
  (testing "Fields are properly aligned"
    (let [schema (obj/create-schema {:a :int8 :b :int32 :c :int8})
          layout (:layout schema)]
      ;; int32 should be 4-byte aligned
      (is (zero? (mod (get-in layout [:b :offset]) 4))))))

;;=============================================================================
;; Single Object Tests (AoS)
;;=============================================================================

(deftest obj-creation-test
  (testing "Create object with inline schema"
    (let [o (obj/obj {:key :int32 :val :int32} {:key 42 :val 100})]
      (is (= 42 (obj/get o :key)))
      (is (= 100 (obj/get o :val)))))

  (testing "Create object with predefined schema"
    (let [schema (obj/create-schema {:x :int32 :y :int32 :z :int32})
          o (obj/obj schema {:x 1 :y 2 :z 3})]
      (is (= 1 (obj/get o :x)))
      (is (= 2 (obj/get o :y)))
      (is (= 3 (obj/get o :z)))))

  (testing "Uninitialized int32 fields default to 0"
    (let [o (obj/obj {:a :int32 :b :int32} {:a 10})]
      (is (= 10 (obj/get o :a)))
      (is (= 0 (obj/get o :b))))))

(deftest obj-lookup-test
  (testing "ILookup protocol"
    (let [o (obj/obj {:key :int32} {:key 42})]
      (is (= 42 (get o :key)))
      (is (= 42 (:key o)))
      (is (nil? (get o :nonexistent)))
      (is (= :default (get o :nonexistent :default))))))

(deftest obj-ifn-test
  (testing "IFn protocol - object as function"
    (let [o (obj/obj {:key :int32 :val :int32} {:key 1 :val 2})]
      (is (= 1 (o :key)))
      (is (= 2 (o :val)))
      (is (= :nope (o :missing :nope))))))

(deftest obj-mutation-test
  (testing "assoc! mutation"
    (let [o (obj/obj {:key :int32} {:key 0})]
      (obj/assoc! o :key 42)
      (is (= 42 (obj/get o :key)))
      (obj/assoc! o :key -100)
      (is (= -100 (obj/get o :key))))))

(deftest obj-cas-test
  (testing "Compare-and-swap"
    (let [o (obj/obj {:key :int32} {:key 10})]
      ;; Successful CAS
      (is (true? (obj/cas! o :key 10 20)))
      (is (= 20 (obj/get o :key)))
      ;; Failed CAS
      (is (false? (obj/cas! o :key 10 30)))
      (is (= 20 (obj/get o :key))))))

(deftest obj-atomic-add-test
  (testing "Atomic add"
    (let [o (obj/obj {:counter :int32} {:counter 100})]
      (let [old (obj/add! o :counter 5)]
        (is (= 100 old))
        (is (= 105 (obj/get o :counter)))))))

(deftest obj-atomic-sub-test
  (testing "Atomic subtract"
    (let [o (obj/obj {:counter :int32} {:counter 100})]
      (let [old (obj/sub! o :counter 30)]
        (is (= 100 old))
        (is (= 70 (obj/get o :counter)))))))

(deftest obj-exchange-test
  (testing "Atomic exchange"
    (let [o (obj/obj {:val :int32} {:val 42})]
      (let [old (obj/exchange! o :val 99)]
        (is (= 42 old))
        (is (= 99 (obj/get o :val)))))))

(deftest obj-seq-test
  (testing "Object as sequence"
    (let [o (obj/obj {:a :int32 :b :int32} {:a 1 :b 2})
          s (seq o)]
      (is (= 2 (count s)))
      (is (every? #(instance? MapEntry %) s)))))

(deftest obj-count-test
  (testing "Object count"
    (let [o1 (obj/obj {:a :int32} {:a 1})
          o2 (obj/obj {:a :int32 :b :int32 :c :int32} {:a 1 :b 2 :c 3})]
      (is (= 1 (count o1)))
      (is (= 3 (count o2))))))

(deftest obj-negative-values-test
  (testing "Negative int32 values"
    (let [o (obj/obj {:val :int32} {:val -42})]
      (is (= -42 (obj/get o :val)))
      (obj/assoc! o :val -1000)
      (is (= -1000 (obj/get o :val))))))

;;=============================================================================
;; Object Array Tests (SoA)
;;=============================================================================

(deftest obj-array-creation-test
  (testing "Create object array"
    (let [arr (obj/obj-array 10 {:key :int32 :val :int32})]
      (is (= 10 (count arr)))))

  (testing "Create with initial value"
    (let [arr (obj/obj-array 5 {:key :int32} 42)]
      (is (= 42 (obj/get-in arr [0 :key])))
      (is (= 42 (obj/get-in arr [4 :key]))))))

(deftest obj-array-access-test
  (testing "get-in and assoc-in!"
    (let [arr (obj/obj-array 10 {:x :int32 :y :int32})]
      (obj/assoc-in! arr [0 :x] 100)
      (obj/assoc-in! arr [0 :y] 200)
      (obj/assoc-in! arr [5 :x] 500)
      (is (= 100 (obj/get-in arr [0 :x])))
      (is (= 200 (obj/get-in arr [0 :y])))
      (is (= 500 (obj/get-in arr [5 :x])))
      (is (= 0 (obj/get-in arr [5 :y]))))))

(deftest obj-array-row-view-test
  (testing "Row view via nth"
    (let [arr (obj/obj-array 10 {:key :int32 :val :int32})]
      (obj/assoc-in! arr [3 :key] 42)
      (obj/assoc-in! arr [3 :val] 99)
      (let [row (nth arr 3)]
        (is (= 42 (row :key)))
        (is (= 99 (row :val)))
        (is (= 42 (get row :key)))))))

(deftest obj-array-cas-test
  (testing "CAS on object array"
    (let [arr (obj/obj-array 10 {:key :int32})]
      (obj/assoc-in! arr [0 :key] 10)
      ;; Successful
      (is (true? (obj/cas-in! arr [0 :key] 10 20)))
      (is (= 20 (obj/get-in arr [0 :key])))
      ;; Failed
      (is (false? (obj/cas-in! arr [0 :key] 10 30)))
      (is (= 20 (obj/get-in arr [0 :key]))))))

(deftest obj-array-add-test
  (testing "Atomic add on object array"
    (let [arr (obj/obj-array 10 {:counter :int32})]
      (obj/assoc-in! arr [0 :counter] 100)
      (let [old (obj/add-in! arr [0 :counter] 50)]
        (is (= 100 old))
        (is (= 150 (obj/get-in arr [0 :counter])))))))

(deftest obj-array-sub-test
  (testing "Atomic subtract on object array"
    (let [arr (obj/obj-array 10 {:counter :int32})]
      (obj/assoc-in! arr [0 :counter] 100)
      (let [old (obj/sub-in! arr [0 :counter] 25)]
        (is (= 100 old))
        (is (= 75 (obj/get-in arr [0 :counter])))))))

(deftest obj-array-exchange-test
  (testing "Atomic exchange on object array"
    (let [arr (obj/obj-array 10 {:val :int32})]
      (obj/assoc-in! arr [0 :val] 42)
      (let [old (obj/exchange-in! arr [0 :val] 999)]
        (is (= 42 old))
        (is (= 999 (obj/get-in arr [0 :val])))))))

;;=============================================================================
;; Column Access Tests (SIMD-friendly)
;;=============================================================================

(deftest column-access-test
  (testing "Get raw column array"
    (let [arr (obj/obj-array 100 {:key :int32 :val :int32})]
      (let [key-col (obj/column arr :key)
            val-col (obj/column arr :val)]
        (is (= 100 (count key-col)))
        (is (= 100 (count val-col)))
        ;; Direct array access
        (arr/aset! key-col 0 42)
        (is (= 42 (obj/get-in arr [0 :key])))))))

(deftest column-reduce-test
  (testing "Reduce over column"
    (let [arr (obj/obj-array 5 {:val :int32})]
      ;; Set values: 10, 20, 30, 40, 50
      (dotimes [i 5]
        (obj/assoc-in! arr [i :val] (* (inc i) 10)))
      ;; Sum via column reduce
      (let [sum (obj/column-reduce arr :val 0 (fn [acc _idx v] (+ acc v)))]
        (is (= 150 sum))))))

(deftest column-map-test
  (testing "Map over column in place"
    (let [arr (obj/obj-array 5 {:val :int32})]
      ;; Set values: 1, 2, 3, 4, 5
      (dotimes [i 5]
        (obj/assoc-in! arr [i :val] (inc i)))
      ;; Double all values
      (obj/column-map! arr :val (fn [_idx v] (* v 2)))
      ;; Check: 2, 4, 6, 8, 10
      (is (= 2 (obj/get-in arr [0 :val])))
      (is (= 4 (obj/get-in arr [1 :val])))
      (is (= 6 (obj/get-in arr [2 :val])))
      (is (= 8 (obj/get-in arr [3 :val])))
      (is (= 10 (obj/get-in arr [4 :val]))))))

;;=============================================================================
;; Schema Reuse Tests
;;=============================================================================

(deftest schema-reuse-test
  (testing "Same schema for multiple objects"
    (let [schema (obj/create-schema {:x :int32 :y :int32})
          o1 (obj/obj schema {:x 1 :y 2})
          o2 (obj/obj schema {:x 10 :y 20})]
      (is (= 1 (obj/get o1 :x)))
      (is (= 10 (obj/get o2 :x)))
      ;; Mutating one doesn't affect other
      (obj/assoc! o1 :x 100)
      (is (= 100 (obj/get o1 :x)))
      (is (= 10 (obj/get o2 :x)))))

  (testing "Same schema for single obj and obj-array"
    (let [schema (obj/create-schema {:key :int32 :val :int32})
          single (obj/obj schema {:key 1 :val 2})
          arr (obj/obj-array 10 schema)]
      (is (identical? (obj/get-schema single) (obj/get-schema arr))))))

;;=============================================================================
;; Large Scale Tests
;;=============================================================================

(deftest large-obj-array-test
  (testing "1000 element object array"
    (let [arr (obj/obj-array 1000 {:key :int32 :val :int32})]
      ;; Write
      (dotimes [i 1000]
        (obj/assoc-in! arr [i :key] i)
        (obj/assoc-in! arr [i :val] (* i 2)))
      ;; Read back
      (dotimes [i 1000]
        (is (= i (obj/get-in arr [i :key])) (str "key at " i))
        (is (= (* i 2) (obj/get-in arr [i :val])) (str "val at " i))))))

;;=============================================================================
;; Composition Tests
;;=============================================================================

(deftest obj-with-obj-offset-test
  (testing "Object containing offset to another object"
    (let [schema (obj/create-schema {:val :int32 :child :obj})
          parent (obj/obj schema {:val 1 :child 0})
          child (obj/obj schema {:val 2 :child 0})
          child-offset (obj/get-offset child)]
      ;; Store child's offset in parent
      (obj/assoc! parent :child child-offset)
      (is (= child-offset (obj/get parent :child))))))

(deftest obj-array-with-array-column-test
  (testing "Object array alongside regular array"
    (let [objs (obj/obj-array 10 {:key :int32})
          indices (arr/int32-array 10)]
      ;; Set up parallel structures
      (dotimes [i 10]
        (obj/assoc-in! objs [i :key] (* i 10))
        (arr/aset! indices i i))
      ;; Access via indices
      (is (= 50 (obj/get-in objs [(arr/aget indices 5) :key]))))))
