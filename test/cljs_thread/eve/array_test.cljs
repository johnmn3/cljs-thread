(ns cljs-thread.eve.array-test
  (:require
   [cljs.test :refer-macros [deftest testing is are use-fixtures]]
   [cljs-thread.eve :as eve]
   [cljs-thread.eve.array :as arr]
   [cljs-thread.eve.obj :as obj]
   [cljs-thread.eve.deftype-proto.serialize :as ser]
   [cljs-thread.eve.map :as sm]))

;;-----------------------------------------------------------------------------
;; Test setup — initialize global atom (requires sab-map for HAMT encoder)
;; Deferred via use-fixtures so slab allocator is initialized first by the runner.
;;-----------------------------------------------------------------------------

;; Global atom is bootstrapped by the test runner (test_main.cljs).
;; Create a test-local SharedAtom for round-trip tests.
(def ^:private ^:mutable _init-atom nil)

(use-fixtures :once
  {:before (fn []
             (when (nil? _init-atom)
               (set! _init-atom (eve/atom {}))))})

;;-----------------------------------------------------------------------------
;; Basic construction via eve-array
;;-----------------------------------------------------------------------------

(deftest eve-array-int32-basic-test
  (testing "eve-array :int32 basic construction"
    (let [a (arr/eve-array :int32 5)]
      (is (= 5 (count a)))
      (doseq [i (range 5)]
        (is (= 0 (arr/aget a i)) "zero-filled by default")))

    (let [a (arr/eve-array :int32 3 42)]
      (is (= 3 (count a)))
      (doseq [i (range 3)]
        (is (= 42 (arr/aget a i)))))

    (let [a (arr/eve-array :int32 [10 20 30])]
      (is (= 3 (count a)))
      (is (= 10 (arr/aget a 0)))
      (is (= 20 (arr/aget a 1)))
      (is (= 30 (arr/aget a 2))))))

(deftest eve-array-float64-test
  (testing "eve-array :float64 construction + access"
    (let [a (arr/eve-array :float64 3)]
      (is (= 3 (count a)))
      (doseq [i (range 3)]
        (is (= 0.0 (arr/aget a i)))))

    (let [a (arr/eve-array :float64 [1.5 2.5 3.5])]
      (is (= 3 (count a)))
      (is (= 1.5 (arr/aget a 0)))
      (is (= 2.5 (arr/aget a 1)))
      (is (= 3.5 (arr/aget a 2))))

    (let [a (arr/eve-array :float64 2 99.9)]
      (is (= 99.9 (arr/aget a 0)))
      (is (= 99.9 (arr/aget a 1))))))

(deftest eve-array-float32-test
  (testing "eve-array :float32 construction + access"
    (let [a (arr/eve-array :float32 [1.0 2.0 3.0])]
      (is (= 3 (count a)))
      ;; Float32 has limited precision
      (is (< (js/Math.abs (- 1.0 (arr/aget a 0))) 0.001))
      (is (< (js/Math.abs (- 2.0 (arr/aget a 1))) 0.001))
      (is (< (js/Math.abs (- 3.0 (arr/aget a 2))) 0.001)))))

(deftest eve-array-uint8-test
  (testing "eve-array :uint8 construction + access"
    (let [a (arr/eve-array :uint8 [0 128 255])]
      (is (= 3 (count a)))
      (is (= 0 (arr/aget a 0)))
      (is (= 128 (arr/aget a 1)))
      (is (= 255 (arr/aget a 2))))))

(deftest eve-array-int8-test
  (testing "eve-array :int8 construction + access"
    (let [a (arr/eve-array :int8 [-128 0 127])]
      (is (= 3 (count a)))
      (is (= -128 (arr/aget a 0)))
      (is (= 0 (arr/aget a 1)))
      (is (= 127 (arr/aget a 2))))))

(deftest eve-array-int16-test
  (testing "eve-array :int16 construction + access"
    (let [a (arr/eve-array :int16 [-32768 0 32767])]
      (is (= 3 (count a)))
      (is (= -32768 (arr/aget a 0)))
      (is (= 0 (arr/aget a 1)))
      (is (= 32767 (arr/aget a 2))))))

(deftest eve-array-uint16-test
  (testing "eve-array :uint16 construction + access"
    (let [a (arr/eve-array :uint16 [0 1000 65535])]
      (is (= 3 (count a)))
      (is (= 0 (arr/aget a 0)))
      (is (= 1000 (arr/aget a 1)))
      (is (= 65535 (arr/aget a 2))))))

(deftest eve-array-uint32-test
  (testing "eve-array :uint32 construction + access"
    (let [a (arr/eve-array :uint32 [0 1000000 4294967295])]
      (is (= 3 (count a)))
      (is (= 0 (arr/aget a 0)))
      (is (= 1000000 (arr/aget a 1)))
      (is (= 4294967295 (arr/aget a 2))))))

(deftest eve-array-type-keyword-test
  (testing "array-type returns the type keyword"
    (is (= :int32 (arr/array-type (arr/eve-array :int32 1))))
    (is (= :float64 (arr/array-type (arr/eve-array :float64 1))))
    (is (= :uint8 (arr/array-type (arr/eve-array :uint8 1))))
    (is (= :int16 (arr/array-type (arr/eve-array :int16 1))))))

;;-----------------------------------------------------------------------------
;; Backward-compat aliases
;;-----------------------------------------------------------------------------

(deftest empty-array-test
  (testing "Empty int32-array (length 0)"
    (let [a (arr/int32-array 0)]
      (is (= 0 (count a)))
      (is (nil? (seq a))))))

(deftest single-element-test
  (testing "Single element int32-array"
    (let [a (arr/int32-array 1)]
      (is (= 1 (count a)))
      (is (= 0 (arr/aget a 0)))
      ;; Write and read back
      (arr/aset! a 0 42)
      (is (= 42 (arr/aget a 0))))))

(deftest initialized-array-test
  (testing "Int32-array initialized with value"
    (let [a (arr/int32-array 5 99)]
      (is (= 5 (count a)))
      (doseq [i (range 5)]
        (is (= 99 (arr/aget a i)) (str "index " i))))))

(deftest array-from-test
  (testing "Int32-array from collection"
    (let [a (arr/int32-array-from [10 20 30 40 50])]
      (is (= 5 (count a)))
      (is (= 10 (arr/aget a 0)))
      (is (= 20 (arr/aget a 1)))
      (is (= 30 (arr/aget a 2)))
      (is (= 40 (arr/aget a 3)))
      (is (= 50 (arr/aget a 4))))))

;;-----------------------------------------------------------------------------
;; Index protocols
;;-----------------------------------------------------------------------------

(deftest indexed-access-test
  (testing "IIndexed protocol"
    (let [a (arr/int32-array-from [100 200 300])]
      (is (= 100 (nth a 0)))
      (is (= 200 (nth a 1)))
      (is (= 300 (nth a 2)))
      (is (= :not-found (nth a 99 :not-found))))))

(deftest ifn-test
  (testing "IFn protocol - array as function"
    (let [a (arr/int32-array-from [5 10 15])]
      (is (= 5 (a 0)))
      (is (= 10 (a 1)))
      (is (= 15 (a 2)))
      (is (= :default (a 99 :default))))))

(deftest ilookup-test
  (testing "ILookup protocol"
    (let [a (arr/int32-array-from [1 2 3])]
      (is (= 1 (get a 0)))
      (is (= 2 (get a 1)))
      (is (= 3 (get a 2)))
      (is (= :nope (get a 99 :nope))))))

;;-----------------------------------------------------------------------------
;; Atomic operations
;;-----------------------------------------------------------------------------

(deftest cas-test
  (testing "Compare-and-swap"
    (let [a (arr/int32-array 1)]
      (arr/aset! a 0 10)
      ;; Successful CAS
      (is (true? (arr/cas! a 0 10 20)))
      (is (= 20 (arr/aget a 0)))
      ;; Failed CAS (expected doesn't match)
      (is (false? (arr/cas! a 0 10 30)))
      (is (= 20 (arr/aget a 0))))))

(deftest exchange-test
  (testing "Atomic exchange"
    (let [a (arr/int32-array 1)]
      (arr/aset! a 0 100)
      (let [old-val (arr/exchange! a 0 200)]
        (is (= 100 old-val))
        (is (= 200 (arr/aget a 0)))))))

(deftest add-test
  (testing "Atomic add"
    (let [a (arr/int32-array 1)]
      (arr/aset! a 0 10)
      (let [old-val (arr/add! a 0 5)]
        (is (= 10 old-val))
        (is (= 15 (arr/aget a 0)))))))

(deftest sub-test
  (testing "Atomic sub"
    (let [a (arr/int32-array 1)]
      (arr/aset! a 0 20)
      (let [old-val (arr/sub! a 0 7)]
        (is (= 20 old-val))
        (is (= 13 (arr/aget a 0)))))))

(deftest bitwise-and-test
  (testing "Atomic bitwise AND"
    (let [a (arr/int32-array 1)]
      (arr/aset! a 0 0xFF)  ;; 11111111
      (let [old-val (arr/band! a 0 0x0F)]  ;; AND with 00001111
        (is (= 0xFF old-val))
        (is (= 0x0F (arr/aget a 0)))))))

(deftest bitwise-or-test
  (testing "Atomic bitwise OR"
    (let [a (arr/int32-array 1)]
      (arr/aset! a 0 0xF0)  ;; 11110000
      (let [old-val (arr/bor! a 0 0x0F)]  ;; OR with 00001111
        (is (= 0xF0 old-val))
        (is (= 0xFF (arr/aget a 0)))))))

(deftest bitwise-xor-test
  (testing "Atomic bitwise XOR"
    (let [a (arr/int32-array 1)]
      (arr/aset! a 0 0xFF)
      (let [old-val (arr/bxor! a 0 0x0F)]
        (is (= 0xFF old-val))
        (is (= 0xF0 (arr/aget a 0)))))))

(deftest atomic-ops-on-uint8-test
  (testing "Atomic ops work on :uint8 arrays"
    (let [a (arr/eve-array :uint8 [10])]
      (is (true? (arr/cas! a 0 10 20)))
      (is (= 20 (arr/aget a 0)))
      (arr/add! a 0 5)
      (is (= 25 (arr/aget a 0))))))

(deftest atomic-ops-reject-float-test
  (testing "Atomic ops throw on float arrays"
    (let [a (arr/eve-array :float64 [1.0])]
      (is (thrown? js/Error (arr/cas! a 0 1.0 2.0)))
      (is (thrown? js/Error (arr/add! a 0 1.0)))
      (is (thrown? js/Error (arr/exchange! a 0 2.0))))))

;;-----------------------------------------------------------------------------
;; Functional operations
;;-----------------------------------------------------------------------------

(deftest reduce-test
  (testing "IReduce - reduce without init"
    (let [a (arr/int32-array-from [1 2 3 4 5])
          sum (reduce + a)]
      (is (= 15 sum))))

  (testing "IReduce - reduce with init"
    (let [a (arr/int32-array-from [1 2 3 4 5])
          sum (reduce + 100 a)]
      (is (= 115 sum)))))

(deftest areduce-test
  (testing "areduce with index"
    (let [a (arr/int32-array-from [10 20 30])
          ;; Sum of (idx * val)
          result (arr/areduce a 0
                              (fn [acc idx val]
                                (+ acc (* idx val))))]
      ;; 0*10 + 1*20 + 2*30 = 0 + 20 + 60 = 80
      (is (= 80 result)))))

(deftest amap-test
  (testing "amap creates new array"
    (let [a (arr/int32-array-from [1 2 3 4 5])
          b (arr/amap a (fn [idx val] (* val val)))]
      ;; Original unchanged
      (is (= 1 (arr/aget a 0)))
      (is (= 2 (arr/aget a 1)))
      ;; New array has squared values
      (is (= 1 (arr/aget b 0)))
      (is (= 4 (arr/aget b 1)))
      (is (= 9 (arr/aget b 2)))
      (is (= 16 (arr/aget b 3)))
      (is (= 25 (arr/aget b 4))))))

(deftest amap-preserves-type-test
  (testing "amap preserves array type"
    (let [a (arr/eve-array :float64 [1.0 2.0 3.0])
          b (arr/amap a (fn [idx val] (* val 2.0)))]
      (is (= :float64 (arr/array-type b)))
      (is (= 2.0 (arr/aget b 0)))
      (is (= 4.0 (arr/aget b 1)))
      (is (= 6.0 (arr/aget b 2))))))

(deftest amap!-test
  (testing "amap! modifies in place"
    (let [a (arr/int32-array-from [1 2 3 4 5])]
      (arr/amap! a (fn [idx val] (* val 10)))
      (is (= 10 (arr/aget a 0)))
      (is (= 20 (arr/aget a 1)))
      (is (= 30 (arr/aget a 2)))
      (is (= 40 (arr/aget a 3)))
      (is (= 50 (arr/aget a 4))))))

(deftest afill-test
  (testing "afill! fills entire array"
    (let [a (arr/int32-array 5)]
      (arr/afill! a 42)
      (doseq [i (range 5)]
        (is (= 42 (arr/aget a i))))))

  (testing "afill! with range"
    (let [a (arr/int32-array-from [0 0 0 0 0])]
      (arr/afill! a 99 1 4)
      (is (= 0 (arr/aget a 0)))
      (is (= 99 (arr/aget a 1)))
      (is (= 99 (arr/aget a 2)))
      (is (= 99 (arr/aget a 3)))
      (is (= 0 (arr/aget a 4))))))

(deftest acopy-test
  (testing "acopy! copies elements"
    (let [src (arr/int32-array-from [1 2 3 4 5])
          dest (arr/int32-array 5)]
      (arr/acopy! dest src)
      (is (= 1 (arr/aget dest 0)))
      (is (= 2 (arr/aget dest 1)))
      (is (= 3 (arr/aget dest 2)))
      (is (= 4 (arr/aget dest 3)))
      (is (= 5 (arr/aget dest 4)))))

  (testing "acopy! with offsets"
    (let [src (arr/int32-array-from [10 20 30 40 50])
          dest (arr/int32-array-from [0 0 0 0 0])]
      (arr/acopy! dest 1 src 2 2)  ;; copy 2 elements from src[2] to dest[1]
      (is (= 0 (arr/aget dest 0)))
      (is (= 30 (arr/aget dest 1)))
      (is (= 40 (arr/aget dest 2)))
      (is (= 0 (arr/aget dest 3)))
      (is (= 0 (arr/aget dest 4))))))

;;-----------------------------------------------------------------------------
;; Seq
;;-----------------------------------------------------------------------------

(deftest seq-test
  (testing "seq over array"
    (let [a (arr/int32-array-from [5 10 15 20])
          s (seq a)]
      (is (= [5 10 15 20] (vec s))))))

(deftest seq-float64-test
  (testing "seq over float64 array"
    (let [a (arr/eve-array :float64 [1.5 2.5 3.5])
          s (seq a)]
      (is (= [1.5 2.5 3.5] (vec s))))))

;;-----------------------------------------------------------------------------
;; Equality and hashing
;;-----------------------------------------------------------------------------

(deftest equality-test
  (testing "Equal arrays"
    (let [a (arr/int32-array-from [1 2 3])
          b (arr/int32-array-from [1 2 3])]
      (is (= a b))))

  (testing "Unequal arrays - different values"
    (let [a (arr/int32-array-from [1 2 3])
          b (arr/int32-array-from [1 2 4])]
      (is (not= a b))))

  (testing "Unequal arrays - different lengths"
    (let [a (arr/int32-array-from [1 2 3])
          b (arr/int32-array-from [1 2])]
      (is (not= a b))))

  (testing "Different types are not equal even with same values"
    (let [a (arr/eve-array :int32 [1 2 3])
          b (arr/eve-array :uint32 [1 2 3])]
      (is (not= a b)))))

(deftest hash-test
  (testing "Equal arrays have equal hashes"
    (let [a (arr/int32-array-from [1 2 3])
          b (arr/int32-array-from [1 2 3])]
      (is (= (hash a) (hash b))))))

;;-----------------------------------------------------------------------------
;; Meta
;;-----------------------------------------------------------------------------

(deftest meta-test
  (testing "with-meta / meta"
    (let [a (arr/int32-array-from [1 2 3])
          a-meta (with-meta a {:doc "test array"})]
      (is (= {:doc "test array"} (meta a-meta)))
      (is (nil? (meta a)))
      ;; Values preserved
      (is (= 1 (arr/aget a-meta 0)))
      (is (= 2 (arr/aget a-meta 1)))
      (is (= 3 (arr/aget a-meta 2))))))

;;-----------------------------------------------------------------------------
;; Negative numbers
;;-----------------------------------------------------------------------------

(deftest negative-numbers-test
  (testing "Negative int32 values"
    (let [a (arr/int32-array-from [-100 -50 0 50 100])]
      (is (= -100 (arr/aget a 0)))
      (is (= -50 (arr/aget a 1)))
      (is (= 0 (arr/aget a 2)))
      (is (= 50 (arr/aget a 3)))
      (is (= 100 (arr/aget a 4)))))

  (testing "Negative numbers via atomic ops"
    (let [a (arr/int32-array 1)]
      (arr/aset! a 0 -42)
      (is (= -42 (arr/aget a 0)))
      (arr/add! a 0 -8)
      (is (= -50 (arr/aget a 0))))))

;;-----------------------------------------------------------------------------
;; Bounds checking
;;-----------------------------------------------------------------------------

(deftest bounds-check-test
  (testing "aget throws on out-of-bounds"
    (let [a (arr/int32-array 3)]
      (is (thrown? js/Error (arr/aget a -1)))
      (is (thrown? js/Error (arr/aget a 3)))
      (is (thrown? js/Error (arr/aget a 100)))))

  (testing "aset! throws on out-of-bounds"
    (let [a (arr/int32-array 3)]
      (is (thrown? js/Error (arr/aset! a -1 0)))
      (is (thrown? js/Error (arr/aset! a 3 0))))))

;;-----------------------------------------------------------------------------
;; Large arrays
;;-----------------------------------------------------------------------------

(deftest large-array-test
  (testing "1000 element array"
    (let [a (arr/int32-array 1000)]
      (is (= 1000 (count a)))
      ;; Write and verify
      (dotimes [i 1000]
        (arr/aset! a i (* i 2)))
      (dotimes [i 1000]
        (is (= (* i 2) (arr/aget a i)) (str "index " i))))))

;;-----------------------------------------------------------------------------
;; ISabStorable — HAMT round-trip
;;-----------------------------------------------------------------------------

(deftest sab-storable-int32-roundtrip-test
  (testing "int32 array survives serialize → deserialize via HAMT atom swap"
    ;; Use swap! on the existing atom — array is allocated in the same SAB
    (swap! _init-atom assoc :arr (arr/eve-array :int32 [10 20 30 40 50]))
    (let [m @_init-atom
          out (:arr m)]
      (is (some? out))
      (is (= 5 (count out)))
      (is (= 10 (arr/aget out 0)))
      (is (= 20 (arr/aget out 1)))
      (is (= 30 (arr/aget out 2)))
      (is (= 40 (arr/aget out 3)))
      (is (= 50 (arr/aget out 4)))
      ;; Clean up
      (swap! _init-atom dissoc :arr))))

(deftest sab-storable-float64-roundtrip-test
  (testing "float64 array survives serialize → deserialize via HAMT atom swap"
    (swap! _init-atom assoc :arr (arr/eve-array :float64 [1.5 2.5 3.5]))
    (let [m @_init-atom
          out (:arr m)]
      (is (some? out))
      (is (= 3 (count out)))
      (is (= 1.5 (arr/aget out 0)))
      (is (= 2.5 (arr/aget out 1)))
      (is (= 3.5 (arr/aget out 2)))
      (swap! _init-atom dissoc :arr))))

(deftest sab-storable-uint8-roundtrip-test
  (testing "uint8 array survives serialize → deserialize via HAMT atom swap"
    (swap! _init-atom assoc :arr (arr/eve-array :uint8 [0 128 255]))
    (let [m @_init-atom
          out (:arr m)]
      (is (some? out))
      (is (= 3 (count out)))
      (is (= 0 (arr/aget out 0)))
      (is (= 128 (arr/aget out 1)))
      (is (= 255 (arr/aget out 2)))
      (swap! _init-atom dissoc :arr))))

(deftest sab-storable-swap-test
  (testing "eve-array values can be swapped in a shared atom"
    (swap! _init-atom assoc :counters (arr/eve-array :int32 [0 0 0]))
    ;; Replace the array with a new one
    (swap! _init-atom assoc :counters (arr/eve-array :int32 [1 2 3]))
    (let [out (:counters @_init-atom)]
      (is (= 3 (count out)))
      (is (= 1 (arr/aget out 0)))
      (is (= 2 (arr/aget out 1)))
      (is (= 3 (arr/aget out 2)))
      (swap! _init-atom dissoc :counters))))

(deftest sab-storable-multiple-types-test
  (testing "Multiple array types in one atom"
    (swap! _init-atom assoc
           :ints (arr/eve-array :int32 [1 2 3])
           :floats (arr/eve-array :float64 [1.1 2.2])
           :bytes (arr/eve-array :uint8 [255 0 128]))
    (let [m @_init-atom]
      (is (= 1 (arr/aget (:ints m) 0)))
      (is (= 2 (arr/aget (:ints m) 1)))
      (is (= 1.1 (arr/aget (:floats m) 0)))
      (is (= 2.2 (arr/aget (:floats m) 1)))
      (is (= 255 (arr/aget (:bytes m) 0)))
      (is (= 0 (arr/aget (:bytes m) 1)))
      (is (= 128 (arr/aget (:bytes m) 2)))
      (swap! _init-atom dissoc :ints :floats :bytes))))

;;-----------------------------------------------------------------------------
;; Comprehensive EveArray Round-Trip Tests
;; Ordered from simple to complex to help isolate corruption bugs.
;;-----------------------------------------------------------------------------

;; ---------- Level 1: Basic deref after single swap ----------

(deftest roundtrip-L1-empty-array-test
  (testing "L1: Empty array survives atom round-trip"
    (let [a (eve/atom {})]
      (swap! a assoc :arr (arr/eve-array :int32 0))
      (let [out (:arr @a)]
        (is (some? out) "array should exist after deref")
        (is (= 0 (count out)) "empty array has length 0")))))

(deftest roundtrip-L1-single-element-test
  (testing "L1: Single-element array survives atom round-trip"
    (let [a (eve/atom {})]
      (swap! a assoc :arr (arr/eve-array :int32 [42]))
      (let [out (:arr @a)]
        (is (some? out))
        (is (= 1 (count out)))
        (is (= 42 (arr/aget out 0)))))))

(deftest roundtrip-L1-small-array-test
  (testing "L1: Small array (3 elements) survives atom round-trip"
    (let [a (eve/atom {})]
      (swap! a assoc :arr (arr/eve-array :int32 [10 20 30]))
      (let [out (:arr @a)]
        (is (some? out))
        (is (= 3 (count out)))
        (is (= 10 (arr/aget out 0)))
        (is (= 20 (arr/aget out 1)))
        (is (= 30 (arr/aget out 2)))))))

;; ---------- Level 2: Multiple derefs of same value ----------

(deftest roundtrip-L2-multiple-deref-test
  (testing "L2: Array is consistent across multiple derefs"
    (let [a (eve/atom {})]
      (swap! a assoc :arr (arr/eve-array :int32 [100 200 300]))
      ;; Deref multiple times
      (let [out1 (:arr @a)
            out2 (:arr @a)
            out3 (:arr @a)]
        (is (= 3 (count out1)))
        (is (= 3 (count out2)))
        (is (= 3 (count out3)))
        (is (= 100 (arr/aget out1 0)))
        (is (= 200 (arr/aget out2 1)))
        (is (= 300 (arr/aget out3 2)))))))

;; ---------- Level 3: Sequential swaps replacing array ----------

(deftest roundtrip-L3-replace-array-test
  (testing "L3: Replacing array in atom works correctly"
    (let [a (eve/atom {})]
      ;; First array
      (swap! a assoc :arr (arr/eve-array :int32 [1 2 3]))
      (is (= 1 (arr/aget (:arr @a) 0)))
      ;; Replace with second array
      (swap! a assoc :arr (arr/eve-array :int32 [4 5 6]))
      (is (= 4 (arr/aget (:arr @a) 0)))
      (is (= 5 (arr/aget (:arr @a) 1)))
      (is (= 6 (arr/aget (:arr @a) 2)))
      ;; Replace with third array (different size)
      (swap! a assoc :arr (arr/eve-array :int32 [7 8]))
      (is (= 2 (count (:arr @a))))
      (is (= 7 (arr/aget (:arr @a) 0)))
      (is (= 8 (arr/aget (:arr @a) 1))))))

(deftest roundtrip-L3-add-remove-array-test
  (testing "L3: Adding and removing array from atom"
    (let [a (eve/atom {:other 123})]
      ;; Add array
      (swap! a assoc :arr (arr/eve-array :int32 [1 2 3]))
      (is (= 123 (:other @a)))
      (is (= 1 (arr/aget (:arr @a) 0)))
      ;; Remove array
      (swap! a dissoc :arr)
      (is (= 123 (:other @a)))
      (is (nil? (:arr @a)))
      ;; Add back
      (swap! a assoc :arr (arr/eve-array :int32 [9 8 7]))
      (is (= 9 (arr/aget (:arr @a) 0))))))

;; ---------- Level 4: Multiple arrays in same map ----------

(deftest roundtrip-L4-two-arrays-test
  (testing "L4: Two arrays in same atom"
    (let [a (eve/atom {})]
      (swap! a assoc
             :arr1 (arr/eve-array :int32 [1 2 3])
             :arr2 (arr/eve-array :int32 [4 5 6]))
      (let [m @a]
        (is (= 1 (arr/aget (:arr1 m) 0)))
        (is (= 2 (arr/aget (:arr1 m) 1)))
        (is (= 3 (arr/aget (:arr1 m) 2)))
        (is (= 4 (arr/aget (:arr2 m) 0)))
        (is (= 5 (arr/aget (:arr2 m) 1)))
        (is (= 6 (arr/aget (:arr2 m) 2)))))))

(deftest roundtrip-L4-three-arrays-test
  (testing "L4: Three arrays of different types"
    (let [a (eve/atom {})]
      (swap! a assoc
             :ints (arr/eve-array :int32 [10 20])
             :floats (arr/eve-array :float64 [1.5 2.5])
             :bytes (arr/eve-array :uint8 [255 128]))
      (let [m @a]
        (is (= :int32 (arr/array-type (:ints m))))
        (is (= :float64 (arr/array-type (:floats m))))
        (is (= :uint8 (arr/array-type (:bytes m))))
        (is (= 10 (arr/aget (:ints m) 0)))
        (is (= 1.5 (arr/aget (:floats m) 0)))
        (is (= 255 (arr/aget (:bytes m) 0)))))))

;; ---------- Level 5: Nested maps containing arrays ----------

(deftest roundtrip-L5-nested-map-single-array-test
  (testing "L5: Array nested one level deep"
    (let [a (eve/atom {})]
      (swap! a assoc :nested {:arr (arr/eve-array :int32 [1 2 3])})
      (let [m @a
            nested (:nested m)
            arr (:arr nested)]
        (is (some? nested))
        (is (some? arr))
        (is (= 3 (count arr)))
        (is (= 1 (arr/aget arr 0)))
        (is (= 2 (arr/aget arr 1)))
        (is (= 3 (arr/aget arr 2)))))))

(deftest roundtrip-L5-nested-two-levels-test
  (testing "L5: Array nested two levels deep"
    (let [a (eve/atom {})]
      (swap! a assoc :level1 {:level2 {:arr (arr/eve-array :int32 [99 88 77])}})
      (let [arr (get-in @a [:level1 :level2 :arr])]
        (is (some? arr))
        (is (= 3 (count arr)))
        (is (= 99 (arr/aget arr 0)))
        (is (= 88 (arr/aget arr 1)))
        (is (= 77 (arr/aget arr 2)))))))

(deftest roundtrip-L5-multiple-nested-arrays-test
  (testing "L5: Multiple arrays at different nesting levels"
    (let [a (eve/atom {})]
      (swap! a assoc
             :top-arr (arr/eve-array :int32 [1])
             :nested {:arr (arr/eve-array :int32 [2])
                      :deeper {:arr (arr/eve-array :int32 [3])}})
      (let [m @a]
        (is (= 1 (arr/aget (:top-arr m) 0)))
        (is (= 2 (arr/aget (get-in m [:nested :arr]) 0)))
        (is (= 3 (arr/aget (get-in m [:nested :deeper :arr]) 0)))))))

;; ---------- Level 6: All typed array types through atoms ----------

(deftest roundtrip-L6-int8-test
  (testing "L6: int8 array round-trip"
    (let [a (eve/atom {})]
      (swap! a assoc :arr (arr/eve-array :int8 [-128 0 127]))
      (let [arr (:arr @a)]
        (is (= :int8 (arr/array-type arr)))
        (is (= -128 (arr/aget arr 0)))
        (is (= 0 (arr/aget arr 1)))
        (is (= 127 (arr/aget arr 2)))))))

(deftest roundtrip-L6-int16-test
  (testing "L6: int16 array round-trip"
    (let [a (eve/atom {})]
      (swap! a assoc :arr (arr/eve-array :int16 [-32768 0 32767]))
      (let [arr (:arr @a)]
        (is (= :int16 (arr/array-type arr)))
        (is (= -32768 (arr/aget arr 0)))
        (is (= 0 (arr/aget arr 1)))
        (is (= 32767 (arr/aget arr 2)))))))

(deftest roundtrip-L6-uint16-test
  (testing "L6: uint16 array round-trip"
    (let [a (eve/atom {})]
      (swap! a assoc :arr (arr/eve-array :uint16 [0 1000 65535]))
      (let [arr (:arr @a)]
        (is (= :uint16 (arr/array-type arr)))
        (is (= 0 (arr/aget arr 0)))
        (is (= 1000 (arr/aget arr 1)))
        (is (= 65535 (arr/aget arr 2)))))))

(deftest roundtrip-L6-uint32-test
  (testing "L6: uint32 array round-trip"
    (let [a (eve/atom {})]
      (swap! a assoc :arr (arr/eve-array :uint32 [0 1000000 4294967295]))
      (let [arr (:arr @a)]
        (is (= :uint32 (arr/array-type arr)))
        (is (= 0 (arr/aget arr 0)))
        (is (= 1000000 (arr/aget arr 1)))
        (is (= 4294967295 (arr/aget arr 2)))))))

(deftest roundtrip-L6-float32-test
  (testing "L6: float32 array round-trip"
    (let [a (eve/atom {})]
      (swap! a assoc :arr (arr/eve-array :float32 [1.0 2.5 3.75]))
      (let [arr (:arr @a)]
        (is (= :float32 (arr/array-type arr)))
        ;; Float32 has limited precision
        (is (< (js/Math.abs (- 1.0 (arr/aget arr 0))) 0.001))
        (is (< (js/Math.abs (- 2.5 (arr/aget arr 1))) 0.001))
        (is (< (js/Math.abs (- 3.75 (arr/aget arr 2))) 0.001))))))

;; ---------- Level 7: Larger arrays ----------

(deftest roundtrip-L7-100-element-test
  (testing "L7: 100 element array round-trip"
    (let [a (eve/atom {})
          data (vec (range 100))]
      (swap! a assoc :arr (arr/eve-array :int32 data))
      (let [arr (:arr @a)]
        (is (= 100 (count arr)))
        (doseq [i (range 100)]
          (is (= i (arr/aget arr i)) (str "index " i)))))))

(deftest roundtrip-L7-1000-element-test
  (testing "L7: 1000 element array round-trip"
    (let [a (eve/atom {})
          data (vec (range 1000))]
      (swap! a assoc :arr (arr/eve-array :int32 data))
      (let [arr (:arr @a)]
        (is (= 1000 (count arr)))
        ;; Spot check
        (is (= 0 (arr/aget arr 0)))
        (is (= 500 (arr/aget arr 500)))
        (is (= 999 (arr/aget arr 999)))))))

;; ---------- Level 8: Stress tests - repeated swaps ----------

(deftest roundtrip-L8-10-swaps-test
  (testing "L8: 10 sequential swaps"
    (let [a (eve/atom {})]
      (dotimes [i 10]
        (swap! a assoc :arr (arr/eve-array :int32 [i (* i 2) (* i 3)]))
        (let [arr (:arr @a)]
          (is (= i (arr/aget arr 0)) (str "iteration " i))
          (is (= (* i 2) (arr/aget arr 1))))))))

(deftest roundtrip-L8-accumulate-arrays-test
  (testing "L8: Accumulate multiple arrays"
    (let [a (eve/atom {})]
      (dotimes [i 5]
        (swap! a assoc (keyword (str "arr" i)) (arr/eve-array :int32 [i])))
      (let [m @a]
        (dotimes [i 5]
          (is (= i (arr/aget (get m (keyword (str "arr" i))) 0))))))))

;; ---------- Level 9: Mixed scalars and arrays ----------

(deftest roundtrip-L9-mixed-values-test
  (testing "L9: Arrays mixed with scalar values"
    (let [a (eve/atom {})]
      (swap! a assoc
             :number 42
             :string "hello"
             :keyword :test
             :arr (arr/eve-array :int32 [1 2 3])
             :nested {:a 1 :b 2 :arr (arr/eve-array :float64 [1.5])})
      (let [m @a]
        (is (= 42 (:number m)))
        (is (= "hello" (:string m)))
        (is (= :test (:keyword m)))
        (is (= 1 (arr/aget (:arr m) 0)))
        (is (= 1 (get-in m [:nested :a])))
        (is (= 1.5 (arr/aget (get-in m [:nested :arr]) 0)))))))

;; ---------- Level 10: Edge cases ----------

(deftest roundtrip-L10-update-in-with-array-test
  (testing "L10: update-in replacing array"
    (let [a (eve/atom {:nested {:arr (arr/eve-array :int32 [1 2 3])}})]
      ;; Replace the nested array
      (swap! a update-in [:nested] assoc :arr (arr/eve-array :int32 [4 5 6]))
      (let [arr (get-in @a [:nested :arr])]
        (is (= 4 (arr/aget arr 0)))
        (is (= 5 (arr/aget arr 1)))
        (is (= 6 (arr/aget arr 2)))))))

(deftest roundtrip-L10-assoc-in-new-array-test
  (testing "L10: assoc-in adding array to existing nested map"
    (let [a (eve/atom {:nested {:other 123}})]
      (swap! a assoc-in [:nested :arr] (arr/eve-array :int32 [7 8 9]))
      (let [m @a]
        (is (= 123 (get-in m [:nested :other])))
        (is (= 7 (arr/aget (get-in m [:nested :arr]) 0)))))))

(deftest roundtrip-L10-fresh-atom-per-swap-test
  (testing "L10: Fresh atom for each test iteration"
    ;; This tests that atom creation + swap + deref works reliably
    (dotimes [i 5]
      (let [a (eve/atom {})
            _ (swap! a assoc :arr (arr/eve-array :int32 [(* i 10)]))
            arr (:arr @a)]
        (is (= (* i 10) (arr/aget arr 0)) (str "iteration " i))))))

;;-----------------------------------------------------------------------------
;; Typed Array Round-Trip Tests
;; Raw JS typed arrays should round-trip through atoms as typed arrays.
;;-----------------------------------------------------------------------------

(deftest typed-array-int32-roundtrip-test
  (testing "Raw Int32Array round-trips through atom"
    (let [a (eve/atom {})
          original (js/Int32Array. #js [10 20 30 40 50])]
      (swap! a assoc :arr original)
      (let [out (:arr @a)]
        (is (some? out))
        (is (instance? js/Int32Array out))
        (is (= 5 (.-length out)))
        (is (= 10 (aget out 0)))
        (is (= 20 (aget out 1)))
        (is (= 30 (aget out 2)))
        (is (= 40 (aget out 3)))
        (is (= 50 (aget out 4)))))))

(deftest typed-array-float64-roundtrip-test
  (testing "Raw Float64Array round-trips through atom"
    (let [a (eve/atom {})
          original (js/Float64Array. #js [1.5 2.5 3.5])]
      (swap! a assoc :arr original)
      (let [out (:arr @a)]
        (is (some? out))
        (is (instance? js/Float64Array out))
        (is (= 3 (.-length out)))
        (is (= 1.5 (aget out 0)))
        (is (= 2.5 (aget out 1)))
        (is (= 3.5 (aget out 2)))))))

(deftest typed-array-uint8-roundtrip-test
  (testing "Raw Uint8Array round-trips through atom"
    (let [a (eve/atom {})
          original (js/Uint8Array. #js [0 128 255])]
      (swap! a assoc :arr original)
      (let [out (:arr @a)]
        (is (some? out))
        (is (instance? js/Uint8Array out))
        (is (= 3 (.-length out)))
        (is (= 0 (aget out 0)))
        (is (= 128 (aget out 1)))
        (is (= 255 (aget out 2)))))))

(deftest typed-array-float32-roundtrip-test
  (testing "Raw Float32Array round-trips through atom"
    (let [a (eve/atom {})
          original (js/Float32Array. #js [1.0 2.5 3.75])]
      (swap! a assoc :arr original)
      (let [out (:arr @a)]
        (is (some? out))
        (is (instance? js/Float32Array out))
        (is (= 3 (.-length out)))
        ;; Float32 has limited precision
        (is (< (js/Math.abs (- 1.0 (aget out 0))) 0.001))
        (is (< (js/Math.abs (- 2.5 (aget out 1))) 0.001))
        (is (< (js/Math.abs (- 3.75 (aget out 2))) 0.001))))))

(deftest typed-array-int8-roundtrip-test
  (testing "Raw Int8Array round-trips through atom"
    (let [a (eve/atom {})
          original (js/Int8Array. #js [-128 0 127])]
      (swap! a assoc :arr original)
      (let [out (:arr @a)]
        (is (some? out))
        (is (instance? js/Int8Array out))
        (is (= -128 (aget out 0)))
        (is (= 0 (aget out 1)))
        (is (= 127 (aget out 2)))))))

(deftest typed-array-int16-roundtrip-test
  (testing "Raw Int16Array round-trips through atom"
    (let [a (eve/atom {})
          original (js/Int16Array. #js [-32768 0 32767])]
      (swap! a assoc :arr original)
      (let [out (:arr @a)]
        (is (some? out))
        (is (instance? js/Int16Array out))
        (is (= -32768 (aget out 0)))
        (is (= 0 (aget out 1)))
        (is (= 32767 (aget out 2)))))))

(deftest typed-array-uint16-roundtrip-test
  (testing "Raw Uint16Array round-trips through atom"
    (let [a (eve/atom {})
          original (js/Uint16Array. #js [0 1000 65535])]
      (swap! a assoc :arr original)
      (let [out (:arr @a)]
        (is (some? out))
        (is (instance? js/Uint16Array out))
        (is (= 0 (aget out 0)))
        (is (= 1000 (aget out 1)))
        (is (= 65535 (aget out 2)))))))

(deftest typed-array-uint32-roundtrip-test
  (testing "Raw Uint32Array round-trips through atom"
    (let [a (eve/atom {})
          original (js/Uint32Array. #js [0 1000000 4294967295])]
      (swap! a assoc :arr original)
      (let [out (:arr @a)]
        (is (some? out))
        (is (instance? js/Uint32Array out))
        (is (= 0 (aget out 0)))
        (is (= 1000000 (aget out 1)))
        (is (= 4294967295 (aget out 2)))))))

(deftest typed-array-mixed-with-eve-array-test
  (testing "Typed arrays and EveArrays in same map"
    (let [a (eve/atom {})]
      (swap! a assoc
             :eve-arr (arr/eve-array :int32 [1 2 3])
             :typed-arr (js/Int32Array. #js [4 5 6]))
      (let [m @a]
        ;; EveArray comes back as EveArray
        (is (= :int32 (arr/array-type (:eve-arr m))))
        (is (= 1 (arr/aget (:eve-arr m) 0)))
        ;; Typed array comes back as typed array
        (is (instance? js/Int32Array (:typed-arr m)))
        (is (= 4 (aget (:typed-arr m) 0)))))))

(deftest typed-array-nested-in-map-test
  (testing "Typed array nested in map structure"
    (let [a (eve/atom {})]
      (swap! a assoc :nested {:arr (js/Int32Array. #js [1 2 3])})
      (let [out (get-in @a [:nested :arr])]
        (is (some? out))
        (is (instance? js/Int32Array out))
        (is (= 1 (aget out 0)))
        (is (= 2 (aget out 1)))
        (is (= 3 (aget out 2)))))))

;;-----------------------------------------------------------------------------
;; EveObj Round-Trip Tests
;; TODO: EveObj serialization not yet implemented. These tests are placeholders
;; for when FAST_TAG_EVE_OBJ serialization is added. The challenge is that
;; EveObj contains a schema (CLJS data structure) that must also be persisted.
;;-----------------------------------------------------------------------------

;; For now, test that EveObj works standalone (without atom round-trip)
(deftest eve-obj-standalone-test
  (testing "EveObj works correctly without atom serialization"
    (let [o (obj/obj {:key :int32 :val :int32} {:key 42 :val 100})]
      (is (= 42 (obj/get o :key)))
      (is (= 100 (obj/get o :val)))
      ;; Mutation works
      (obj/assoc! o :key 999)
      (is (= 999 (obj/get o :key))))))

(deftest eve-obj-with-eve-array-standalone-test
  (testing "EveObj and EveArray work together (no atom round-trip)"
    (let [o (obj/obj {:x :int32 :y :int32} {:x 10 :y 20})
          arr (arr/eve-array :int32 [1 2 3 4 5])]
      ;; Both work independently
      (is (= 10 (obj/get o :x)))
      (is (= 1 (arr/aget arr 0)))
      (is (= 5 (arr/aget arr 4))))))

(deftest eve-obj-array-standalone-test
  (testing "EveObjArray (SoA) works correctly"
    (let [arr (obj/obj-array 10 {:key :int32 :val :int32})]
      (obj/assoc-in! arr [0 :key] 100)
      (obj/assoc-in! arr [0 :val] 200)
      (obj/assoc-in! arr [5 :key] 500)
      (is (= 10 (count arr)))
      (is (= 100 (obj/get-in arr [0 :key])))
      (is (= 200 (obj/get-in arr [0 :val])))
      (is (= 500 (obj/get-in arr [5 :key]))))))

;; This test confirms EveArray round-trips while EveObj is in a separate context
;;-----------------------------------------------------------------------------
;; Raytracer-style stress test: multiple Uint8ClampedArray tiles
;;-----------------------------------------------------------------------------

(deftest typed-array-uint8clamped-roundtrip-test
  (testing "Uint8ClampedArray round-trips through atom"
    (let [a (eve/atom {})
          original (js/Uint8ClampedArray. #js [0 128 255 64])]
      (swap! a assoc :arr original)
      (let [out (:arr @a)]
        (is (some? out))
        (is (instance? js/Uint8ClampedArray out))
        (is (= 4 (.-length out)))
        (is (= 0 (aget out 0)))
        (is (= 128 (aget out 1)))
        (is (= 255 (aget out 2)))
        (is (= 64 (aget out 3)))))))

;; HAMT collision tests - :t0 and :t6 collide at level 0 (both have bottom 5 hash bits = 7)
(deftest hamt-collision-minimal-test
  (testing "HAMT handles level-0 collision correctly - incremental"
    (let [a (eve/atom {})]
      ;; Add keys in order 0-9, checking after each
      (doseq [i (range 10)]
        (let [tile-key (keyword (str "t" i))]
          (swap! a assoc tile-key i)
          (let [expected-keys (set (map #(keyword (str "t" %)) (range (inc i))))
                actual-keys (set (keys @a))]
            (is (= expected-keys actual-keys) (str "after adding " tile-key)))))))

  (testing "Direct HAMT build with 9 entries"
    (let [input-map {:t0 0 :t1 1 :t2 2 :t3 3 :t4 4 :t5 5 :t6 6 :t7 7 :t8 8}
          hamt (sm/into-hash-map input-map)]
      (is (= 9 (count hamt)) "direct HAMT should have 9 entries")
      (doseq [i (range 9)]
        (let [k (keyword (str "t" i))]
          (is (= i (get hamt k)) (str "direct HAMT key " k))))))

  (testing "Atom round-trip: merge then add"
    (let [a (eve/atom {})]
      (swap! a merge {:t0 0 :t1 1 :t2 2 :t3 3 :t4 4 :t5 5 :t6 6 :t7 7})
      (is (= 8 (count @a)) "should have 8 keys after merge")
      (swap! a assoc :t8 8)
      (is (= 9 (count @a)) "should have 9 keys after adding :t8")))

  (testing "Sequential swaps with pool reset between each"
    (let [a (eve/atom {})]
      (doseq [i (range 10)]
        (sm/reset-pools!)
        (swap! a assoc (keyword (str "t" i)) i)
        (is (= (set (map #(keyword (str "t" %)) (range (inc i))))
               (set (keys @a)))
            (str "with reset, after adding :t" i)))))

  (testing "Sequential swaps with pool drain between each"
    (let [a (eve/atom {})]
      (doseq [i (range 10)]
        (sm/drain-pools!)
        (swap! a assoc (keyword (str "t" i)) i)
        (is (= (set (map #(keyword (str "t" %)) (range (inc i))))
               (set (keys @a)))
            (str "with drain, after adding :t" i)))))

  (testing "Direct HAMT build preserves all keys"
    (let [input {:t0 0 :t1 1 :t2 2 :t3 3 :t4 4 :t5 5 :t6 6 :t7 7 :t8 8}
          hamt (sm/into-hash-map input)]
      (is (= (set (keys input)) (set (keys hamt))))))

  (testing "Individual key lookups after sequential swaps"
    (let [a (eve/atom {})]
      (doseq [i (range 10)]
        (swap! a assoc (keyword (str "t" i)) i))
      (let [m @a]
        (doseq [i (range 10)]
          (is (= i (get m (keyword (str "t" i)))) (str "get :t" i)))))))

;; Test with pool tracking to catch invariant violations
(deftest hamt-pool-tracking-test
  (testing "Pool tracking catches invariant violations"
    ;; Enable pool and tracking (debug disabled to reduce output)
    (sm/reset-pools!)
    (sm/enable-pool-track!)
    (try
      (let [input {:t0 0 :t1 1 :t2 2 :t3 3 :t4 4 :t5 5 :t6 6 :t7 7 :t8 8}]
        (let [hamt (sm/into-hash-map input)]
          (is (= 9 (count hamt)) "should have 9 keys")))
      (finally
        (sm/disable-pool-track!)))))

;; Test sequential atom swaps with pool enabled
(deftest hamt-pool-atom-swaps-test
  (testing "Sequential atom swaps with pool enabled"
    (sm/reset-pools!)
    (let [a (eve/atom {})]
      (doseq [i (range 10)]
        (let [tile-key (keyword (str "t" i))]
          (swap! a assoc tile-key i)
          (let [expected-keys (set (map #(keyword (str "t" %)) (range (inc i))))
                actual-keys (set (keys @a))]
            (is (= expected-keys actual-keys) (str "after adding " tile-key))))))))

;; Full test: verify HAMT doesn't lose keys with scalar values
(deftest hamt-multiple-keys-scalar-test
  (testing "HAMT doesn't lose keys with scalar values"
    (let [a (eve/atom {})]
      (dotimes [i 10]
        (let [tile-key (keyword (str "t" i))]
          (swap! a assoc tile-key i)
          (let [current-keys (set (keys @a))]
            ;; Verify no keys lost after each swap
            (dotimes [j (inc i)]
              (is (contains? current-keys (keyword (str "t" j)))
                  (str "after swap " i ", should still have :t" j))))))
      (let [m @a]
        (is (= 10 (count (keys m))) "should have all 10 keys")
        (dotimes [i 10]
          (let [tile-key (keyword (str "t" i))]
            (is (= i (get m tile-key)) (str "scalar key " tile-key))))))))

(deftest typed-array-multiple-tiles-test
  (testing "Multiple Uint8ClampedArray tiles (raytracer pattern)"
    (let [a (eve/atom {})
          tile-size (* 8 8 4)  ;; 8x8 tile, 4 bytes per pixel (RGBA)
          make-tile (fn [fill-val]
                      (let [buf (js/Uint8ClampedArray. tile-size)]
                        (dotimes [i tile-size]
                          (aset buf i (mod (+ fill-val i) 256)))
                        buf))]
      ;; Store multiple tiles sequentially (like raytracer does)
      (dotimes [i 10]
        (let [tile-key (keyword (str "t" i))
              tile-buf (make-tile (* i 25))]
          (swap! a assoc tile-key tile-buf)))
      ;; Verify all tiles round-tripped correctly
      (let [m @a]
        (dotimes [i 10]
          (let [tile-key (keyword (str "t" i))
                out (get m tile-key)]
            (is (some? out) (str "tile " i " should exist"))
            (is (instance? js/Uint8ClampedArray out) (str "tile " i " should be Uint8ClampedArray"))
            (when out
              (is (= tile-size (.-length out)) (str "tile " i " should have correct length"))
              (is (= (mod (* i 25) 256) (aget out 0)) (str "tile " i " first byte")))))))))

(deftest typed-array-large-buffer-test
  (testing "Large Uint8ClampedArray (like pixel buffer)"
    (let [a (eve/atom {})
          ;; 64x64 tile = 16384 bytes
          size (* 64 64 4)
          buf (js/Uint8ClampedArray. size)]
      ;; Fill with pattern
      (dotimes [i size]
        (aset buf i (mod i 256)))
      (swap! a assoc :pixels buf)
      (let [out (:pixels @a)]
        (is (some? out))
        (is (instance? js/Uint8ClampedArray out))
        (is (= size (.-length out)))
        ;; Spot check values
        (is (= 0 (aget out 0)))
        (is (= 255 (aget out 255)))
        (is (= 0 (aget out 256)))
        (is (= 100 (aget out 100)))))))

(deftest eve-array-roundtrip-with-obj-context-test
  (testing "EveArray round-trips correctly (EveObj serialization pending)"
    (let [a (eve/atom {})
          ;; EveObj is created but NOT put in atom (serialization not implemented)
          o (obj/obj {:x :int32} {:x 42})
          ;; EveArray IS put in atom and round-trips
          eve-arr (arr/eve-array :int32 [1 2 3])
          typed-arr (js/Float64Array. #js [4.5 5.5])]
      ;; Verify obj works locally
      (is (= 42 (obj/get o :x)))
      ;; Put arrays in atom
      (swap! a assoc :eve-arr eve-arr :typed-arr typed-arr)
      (let [m @a]
        ;; EveArray round-trips
        (is (= :int32 (arr/array-type (:eve-arr m))))
        (is (= 1 (arr/aget (:eve-arr m) 0)))
        ;; TypedArray round-trips
        (is (instance? js/Float64Array (:typed-arr m)))
        (is (= 4.5 (aget (:typed-arr m) 0)))))))

;;-----------------------------------------------------------------------------
;; Scalar Round-Trip Tests
;; Comprehensive tests for all scalar/primitive types through atoms
;;-----------------------------------------------------------------------------

;; ---------- Level S1: Primitive scalars ----------

(deftest scalar-S1-integers-test
  (testing "S1: Integer values round-trip through atom"
    (let [a (eve/atom {})]
      (swap! a assoc
             :zero 0
             :one 1
             :neg -1
             :small 42
             :big 999999
             :max-safe js/Number.MAX_SAFE_INTEGER
             :min-safe js/Number.MIN_SAFE_INTEGER)
      (let [m @a]
        (is (= 0 (:zero m)))
        (is (= 1 (:one m)))
        (is (= -1 (:neg m)))
        (is (= 42 (:small m)))
        (is (= 999999 (:big m)))
        (is (= js/Number.MAX_SAFE_INTEGER (:max-safe m)))
        (is (= js/Number.MIN_SAFE_INTEGER (:min-safe m)))))))

(deftest scalar-S1-floats-test
  (testing "S1: Float values round-trip through atom"
    (let [a (eve/atom {})]
      (swap! a assoc
             :zero 0.0
             :pi 3.14159
             :neg -2.5
             :tiny 0.000001
             :huge 1.0e100
             :neg-inf js/Number.NEGATIVE_INFINITY
             :pos-inf js/Number.POSITIVE_INFINITY)
      (let [m @a]
        (is (= 0.0 (:zero m)))
        (is (< (js/Math.abs (- 3.14159 (:pi m))) 0.00001))
        (is (= -2.5 (:neg m)))
        (is (< (js/Math.abs (- 0.000001 (:tiny m))) 0.0000001))
        (is (= 1.0e100 (:huge m)))
        (is (= js/Number.NEGATIVE_INFINITY (:neg-inf m)))
        (is (= js/Number.POSITIVE_INFINITY (:pos-inf m)))))))

(deftest scalar-S1-nan-test
  (testing "S1: NaN round-trips through atom"
    (let [a (eve/atom {})]
      (swap! a assoc :nan js/NaN)
      (let [m @a]
        (is (js/Number.isNaN (:nan m)))))))

(deftest scalar-S1-strings-test
  (testing "S1: String values round-trip through atom"
    (let [a (eve/atom {})]
      (swap! a assoc
             :empty ""
             :short "hi"
             :medium "hello world"
             :with-spaces "a b c d e"
             :unicode "日本語 🎉 emoji"
             :newlines "line1\nline2\nline3"
             :long (apply str (repeat 1000 "x")))
      (let [m @a]
        (is (= "" (:empty m)))
        (is (= "hi" (:short m)))
        (is (= "hello world" (:medium m)))
        (is (= "a b c d e" (:with-spaces m)))
        (is (= "日本語 🎉 emoji" (:unicode m)))
        (is (= "line1\nline2\nline3" (:newlines m)))
        (is (= (apply str (repeat 1000 "x")) (:long m)))))))

(deftest scalar-S1-keywords-test
  (testing "S1: Keyword values round-trip through atom"
    (let [a (eve/atom {})]
      (swap! a assoc
             :kw1 :simple
             :kw2 :longer-keyword
             :kw3 :with-dash-and-numbers-123
             :kw4 :ns/qualified
             :kw5 :deeply.nested/keyword)
      (let [m @a]
        (is (= :simple (:kw1 m)))
        (is (= :longer-keyword (:kw2 m)))
        (is (= :with-dash-and-numbers-123 (:kw3 m)))
        (is (= :ns/qualified (:kw4 m)))
        (is (= :deeply.nested/keyword (:kw5 m)))))))

(deftest scalar-S1-symbols-test
  (testing "S1: Symbol values round-trip through atom"
    (let [a (eve/atom {})]
      (swap! a assoc
             :sym1 'foo
             :sym2 'bar
             :sym3 'ns/qualified)
      (let [m @a]
        (is (= 'foo (:sym1 m)))
        (is (= 'bar (:sym2 m)))
        (is (= 'ns/qualified (:sym3 m)))))))

(deftest scalar-S1-booleans-test
  (testing "S1: Boolean values round-trip through atom"
    (let [a (eve/atom {})]
      (swap! a assoc :t true :f false)
      (let [m @a]
        (is (true? (:t m)))
        (is (false? (:f m)))))))

(deftest scalar-S1-nil-test
  (testing "S1: nil value round-trips through atom"
    (let [a (eve/atom {})]
      (swap! a assoc :n nil)
      (let [m @a]
        (is (nil? (:n m)))
        (is (contains? m :n))))))

;; ---------- Level S2: Collection scalars ----------

(deftest scalar-S2-vectors-test
  (testing "S2: Vector values round-trip through atom"
    (let [a (eve/atom {})]
      (swap! a assoc
             :empty []
             :ints [1 2 3]
             :mixed [1 "two" :three]
             :nested [[1 2] [3 4]]
             :deep [[[1]]])
      (let [m @a]
        (is (= [] (:empty m)))
        (is (= [1 2 3] (:ints m)))
        (is (= [1 "two" :three] (:mixed m)))
        (is (= [[1 2] [3 4]] (:nested m)))
        (is (= [[[1]]] (:deep m)))))))

(deftest scalar-S2-maps-test
  (testing "S2: Map values round-trip through atom"
    (let [a (eve/atom {})]
      (swap! a assoc
             :empty {}
             :simple {:a 1}
             :multiple {:a 1 :b 2 :c 3}
             :nested {:outer {:inner 42}}
             :mixed {:int 1 :str "two" :kw :three})
      (let [m @a]
        (is (= {} (:empty m)))
        (is (= {:a 1} (:simple m)))
        (is (= {:a 1 :b 2 :c 3} (:multiple m)))
        (is (= {:outer {:inner 42}} (:nested m)))
        (is (= {:int 1 :str "two" :kw :three} (:mixed m)))))))

(deftest scalar-S2-sets-test
  (testing "S2: Set values round-trip through atom"
    (let [a (eve/atom {})]
      (swap! a assoc
             :empty #{}
             :ints #{1 2 3}
             :keywords #{:a :b :c}
             :mixed #{1 "two" :three})
      (let [m @a]
        (is (= #{} (:empty m)))
        (is (= #{1 2 3} (:ints m)))
        (is (= #{:a :b :c} (:keywords m)))
        (is (= #{1 "two" :three} (:mixed m)))))))

(deftest scalar-S2-lists-test
  (testing "S2: List values round-trip through atom"
    (let [a (eve/atom {})]
      (swap! a assoc
             :empty '()
             :ints '(1 2 3)
             :nested '((1 2) (3 4)))
      (let [m @a]
        ;; Empty list may serialize as nil or empty seq
        (is (empty? (:empty m)) "empty list should be empty")
        (is (= '(1 2 3) (seq (:ints m))))
        (is (= '((1 2) (3 4)) (seq (:nested m))))))))

;; ---------- Level S3: Sequential scalar swaps ----------

(deftest scalar-S3-sequential-integer-swaps-test
  (testing "S3: Sequential integer swaps don't lose keys"
    (let [a (eve/atom {})]
      (dotimes [i 20]
        (swap! a assoc (keyword (str "k" i)) i)
        (let [m @a
              expected-keys (set (map #(keyword (str "k" %)) (range (inc i))))
              actual-keys (set (keys m))]
          (is (= expected-keys actual-keys) (str "after swap " i)))))))

(deftest scalar-S3-sequential-string-swaps-test
  (testing "S3: Sequential string swaps don't lose keys"
    (let [a (eve/atom {})]
      (dotimes [i 20]
        (swap! a assoc (keyword (str "s" i)) (str "value-" i))
        (let [m @a
              expected-keys (set (map #(keyword (str "s" %)) (range (inc i))))
              actual-keys (set (keys m))]
          (is (= expected-keys actual-keys) (str "after swap " i)))))))

(deftest scalar-S3-sequential-keyword-swaps-test
  (testing "S3: Sequential keyword swaps don't lose keys"
    (let [a (eve/atom {})]
      (dotimes [i 20]
        (swap! a assoc (keyword (str "kw" i)) (keyword (str "val" i)))
        (let [m @a
              expected-keys (set (map #(keyword (str "kw" %)) (range (inc i))))
              actual-keys (set (keys m))]
          (is (= expected-keys actual-keys) (str "after swap " i)))))))

(deftest scalar-S3-sequential-mixed-swaps-test
  (testing "S3: Sequential mixed-type swaps don't lose keys"
    (let [a (eve/atom {})
          values [42 "hello" :keyword 3.14 true nil [1 2] {:a 1}]]
      (dotimes [i (count values)]
        (swap! a assoc (keyword (str "m" i)) (nth values i))
        (let [m @a
              expected-keys (set (map #(keyword (str "m" %)) (range (inc i))))
              actual-keys (set (keys m))]
          (is (= expected-keys actual-keys) (str "after swap " i)))))))

;; ---------- Level S4: Replacement swaps ----------

(deftest scalar-S4-replace-values-test
  (testing "S4: Replacing values doesn't corrupt other keys"
    (let [a (eve/atom {:a 1 :b 2 :c 3})]
      ;; Replace values multiple times
      (dotimes [i 10]
        (swap! a assoc :a (* i 10))
        (let [m @a]
          (is (= (* i 10) (:a m)) (str "iteration " i " :a"))
          (is (= 2 (:b m)) (str "iteration " i " :b"))
          (is (= 3 (:c m)) (str "iteration " i " :c")))))))

(deftest scalar-S4-add-replace-remove-test
  (testing "S4: Add/replace/remove cycle"
    (let [a (eve/atom {})]
      ;; Add
      (swap! a assoc :x 1 :y 2)
      (is (= {:x 1 :y 2} @a))
      ;; Replace
      (swap! a assoc :x 10)
      (is (= {:x 10 :y 2} @a))
      ;; Remove
      (swap! a dissoc :x)
      (is (= {:y 2} @a))
      ;; Add back
      (swap! a assoc :x 100 :z 3)
      (is (= {:x 100 :y 2 :z 3} @a)))))

;; ---------- Level S5: Stress tests ----------

(deftest scalar-S5-many-keys-test
  (testing "S5: 50 keys with mixed values"
    (let [a (eve/atom {})]
      (dotimes [i 50]
        (swap! a assoc (keyword (str "k" i))
               (case (mod i 5)
                 0 i
                 1 (str "s" i)
                 2 (keyword (str "kw" i))
                 3 (double i)
                 4 [i (inc i)])))
      (let [m @a]
        (is (= 50 (count m)) "should have 50 keys")
        ;; Spot check values
        (is (= 0 (get m :k0)))
        (is (= "s11" (get m :k11)))
        (is (= :kw22 (get m :k22)))
        (is (= 33.0 (get m :k33)))
        (is (= [44 45] (get m :k44)))))))

(deftest scalar-S5-deep-nesting-test
  (testing "S5: Deeply nested scalar values"
    (let [a (eve/atom {})]
      (swap! a assoc :level1
             {:level2
              {:level3
               {:level4
                {:level5
                 {:value 42
                  :vec [1 2 3]
                  :str "deep"}}}}})
      (let [m @a]
        (is (= 42 (get-in m [:level1 :level2 :level3 :level4 :level5 :value])))
        (is (= [1 2 3] (get-in m [:level1 :level2 :level3 :level4 :level5 :vec])))
        (is (= "deep" (get-in m [:level1 :level2 :level3 :level4 :level5 :str])))))))

(deftest scalar-S5-fresh-atoms-test
  (testing "S5: Fresh atoms per test don't interfere"
    (dotimes [i 10]
      (let [a (eve/atom {})
            _ (swap! a assoc :val i)
            m @a]
        (is (= i (:val m)) (str "iteration " i))))))
