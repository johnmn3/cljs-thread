(ns cljs-thread.serial-test
  "Wire transfer serialization/deserialization tests.
   Tests instr-body (encode) and unstr-body (decode) round-trips
   for all supported types: transferables, functions, eve atoms, js objects."
  (:require
   [clojure.test :refer [deftest is testing]]
   [clojure.edn :as edn]
   [cljs-thread.serial :as serial]))

;; ---------------------------------------------------------------------------
;; Test helpers
;; ---------------------------------------------------------------------------

(defn round-trip
  "Serialize with instr-body, pr-str for wire, edn/read-string, then unstr-body.
   Returns [result transfers] where transfers is the JS object of transferables."
  [form]
  (let [transfer-atom (atom {:count 0 :seen {} :transfers {}})
        instrumented (serial/instr-body transfer-atom form)
        wire-str (pr-str instrumented)
        parsed (edn/read-string wire-str)
        transfers (clj->js (:transfers @transfer-atom))
        result (serial/unstr-body transfers parsed)]
    [result transfers @transfer-atom]))

(defn round-trip-value
  "Like round-trip but returns just the deserialized value."
  [form]
  (first (round-trip form)))

;; ---------------------------------------------------------------------------
;; Transferable tests (typed arrays)
;; ---------------------------------------------------------------------------

(deftest typed-array-round-trip-test
  (testing "Uint8Array round-trips correctly"
    (let [arr (js/Uint8Array. #js [1 2 3 4 5])
          result (round-trip-value arr)]
      (is (instance? js/Uint8Array result))
      (is (= 5 (.-length result)))
      (is (= 1 (aget result 0)))
      (is (= 5 (aget result 4)))))

  (testing "Int32Array round-trips correctly"
    (let [arr (js/Int32Array. #js [-100 0 100 1000])
          result (round-trip-value arr)]
      (is (instance? js/Int32Array result))
      (is (= 4 (.-length result)))
      (is (= -100 (aget result 0)))
      (is (= 1000 (aget result 3)))))

  (testing "Float64Array round-trips correctly"
    (let [arr (js/Float64Array. #js [1.5 2.5 3.14159])
          result (round-trip-value arr)]
      (is (instance? js/Float64Array result))
      (is (= 3 (.-length result)))
      (is (= 1.5 (aget result 0)))
      (is (< (js/Math.abs (- 3.14159 (aget result 2))) 0.0001)))))

(deftest typed-array-in-collection-test
  (testing "typed array in vector"
    (let [arr (js/Uint8Array. #js [10 20 30])
          form [:before arr :after]
          result (round-trip-value form)]
      (is (= :before (first result)))
      (is (instance? js/Uint8Array (second result)))
      (is (= :after (nth result 2)))))

  (testing "typed array in map"
    (let [arr (js/Int16Array. #js [1 2 3])
          form {:key arr :other "value"}
          result (round-trip-value form)]
      (is (instance? js/Int16Array (:key result)))
      (is (= "value" (:other result)))))

  (testing "nested typed arrays"
    (let [arr1 (js/Uint8Array. #js [1 2])
          arr2 (js/Uint8Array. #js [3 4])
          form {:outer {:inner [arr1 arr2]}}
          result (round-trip-value form)]
      (is (instance? js/Uint8Array (get-in result [:outer :inner 0])))
      (is (instance? js/Uint8Array (get-in result [:outer :inner 1])))
      (is (= 1 (aget (get-in result [:outer :inner 0]) 0)))
      (is (= 3 (aget (get-in result [:outer :inner 1]) 0))))))

;; ---------------------------------------------------------------------------
;; Transferable deduplication tests
;; ---------------------------------------------------------------------------

(deftest transferable-deduplication-test
  (testing "same typed array referenced multiple times uses single ctag"
    (let [arr (js/Uint8Array. #js [1 2 3])
          form [arr arr arr]
          [result _ state] (round-trip form)]
      ;; Should only have one transfer entry
      (is (= 1 (count (:transfers state))))
      ;; All three should resolve to the same object
      (is (instance? js/Uint8Array (nth result 0)))
      (is (instance? js/Uint8Array (nth result 1)))
      (is (instance? js/Uint8Array (nth result 2)))
      ;; And have the same values
      (is (= (aget (nth result 0) 0) (aget (nth result 1) 0) (aget (nth result 2) 0)))))

  (testing "different typed arrays get different ctags"
    (let [arr1 (js/Uint8Array. #js [1])
          arr2 (js/Uint8Array. #js [2])
          form [arr1 arr2]
          [result _ state] (round-trip form)]
      (is (= 2 (count (:transfers state))))
      (is (= 1 (aget (nth result 0) 0)))
      (is (= 2 (aget (nth result 1) 0))))))

;; ---------------------------------------------------------------------------
;; Function serialization tests
;; ---------------------------------------------------------------------------

(deftest function-serialization-test
  (testing "function becomes #cljs-thread/arg-fn tag"
    (let [transfer-atom (atom {:count 0 :seen {} :transfers {}})
          f (fn [x] (* x 2))
          instrumented (serial/instr-body transfer-atom f)]
      (is (string? instrumented))
      (is (.startsWith instrumented "#cljs-thread/arg-fn"))))

  (testing "function in collection"
    (let [transfer-atom (atom {:count 0 :seen {} :transfers {}})
          f (fn [x] (+ x 1))
          form {:callback f :value 42}
          instrumented (serial/instr-body transfer-atom form)]
      (is (map? instrumented))
      (is (= 42 (:value instrumented)))
      (is (string? (:callback instrumented)))
      (is (.startsWith (:callback instrumented) "#cljs-thread/arg-fn")))))

;; ---------------------------------------------------------------------------
;; JS object serialization tests
;; ---------------------------------------------------------------------------

(deftest js-object-serialization-test
  (testing "plain JS object gets marker"
    (let [obj #js {:foo "bar" :num 42}
          [result _ state] (round-trip obj)]
      (is (= 1 (count (:transfers state))))
      (is (object? result))
      (is (= "bar" (.-foo result)))
      (is (= 42 (.-num result)))))

  (testing "JS object in CLJS collection"
    (let [obj #js {:x 1 :y 2}
          form {:point obj :name "origin"}
          result (round-trip-value form)]
      (is (= "origin" (:name result)))
      (is (object? (:point result)))
      (is (= 1 (.-x (:point result)))))))

;; ---------------------------------------------------------------------------
;; Mixed types ordering test
;; ---------------------------------------------------------------------------

(deftest mixed-types-ordering-test
  (testing "ordering preserved with mixed transferables and js-objects"
    (let [arr1 (js/Uint8Array. #js [1 2 3])
          obj1 #js {:id "first"}
          arr2 (js/Int32Array. #js [100 200])
          obj2 #js {:id "second"}
          form [arr1 obj1 arr2 obj2]
          [result _ state] (round-trip form)]
      ;; Should have 4 separate entries
      (is (= 4 (count (:transfers state))))
      ;; Check ordering is preserved
      (is (instance? js/Uint8Array (nth result 0)))
      (is (= 1 (aget (nth result 0) 0)))
      (is (object? (nth result 1)))
      (is (= "first" (.-id (nth result 1))))
      (is (instance? js/Int32Array (nth result 2)))
      (is (= 100 (aget (nth result 2) 0)))
      (is (object? (nth result 3)))
      (is (= "second" (.-id (nth result 3))))))

  (testing "deeply nested mixed types"
    (let [arr (js/Uint8Array. #js [42])
          obj #js {:nested true}
          form {:level1 {:level2 {:arr arr :obj obj}} :other [1 2 3]}
          result (round-trip-value form)]
      (is (= [1 2 3] (:other result)))
      (is (instance? js/Uint8Array (get-in result [:level1 :level2 :arr])))
      (is (= 42 (aget (get-in result [:level1 :level2 :arr]) 0)))
      (is (object? (get-in result [:level1 :level2 :obj])))
      (is (= true (.-nested (get-in result [:level1 :level2 :obj])))))))

;; ---------------------------------------------------------------------------
;; Primitives pass-through test
;; ---------------------------------------------------------------------------

(deftest primitives-pass-through-test
  (testing "numbers pass through"
    (is (= 42 (round-trip-value 42)))
    (is (= 3.14 (round-trip-value 3.14))))

  (testing "strings pass through"
    (is (= "hello" (round-trip-value "hello"))))

  (testing "keywords pass through"
    (is (= :foo (round-trip-value :foo)))
    (is (= :ns/qualified (round-trip-value :ns/qualified))))

  (testing "nil passes through"
    (is (nil? (round-trip-value nil))))

  (testing "booleans pass through"
    (is (= true (round-trip-value true)))
    (is (= false (round-trip-value false))))

  (testing "CLJS collections pass through"
    (is (= [1 2 3] (round-trip-value [1 2 3])))
    (is (= {:a 1 :b 2} (round-trip-value {:a 1 :b 2})))
    (is (= #{:a :b :c} (round-trip-value #{:a :b :c})))))

;; ---------------------------------------------------------------------------
;; Edge cases
;; ---------------------------------------------------------------------------

(deftest edge-cases-test
  (testing "empty collections"
    (is (= [] (round-trip-value [])))
    (is (= {} (round-trip-value {})))
    (is (= #{} (round-trip-value #{}))))

  (testing "collection with nil values"
    (is (= [nil nil] (round-trip-value [nil nil])))
    (is (= {:key nil} (round-trip-value {:key nil}))))

  (testing "mixed collection with all types"
    (let [arr (js/Uint8Array. #js [1])
          obj #js {:a 1}
          form {:num 42
                :str "hello"
                :kw :keyword
                :vec [1 2 3]
                :arr arr
                :obj obj
                :nested {:deep true}}
          result (round-trip-value form)]
      (is (= 42 (:num result)))
      (is (= "hello" (:str result)))
      (is (= :keyword (:kw result)))
      (is (= [1 2 3] (:vec result)))
      (is (instance? js/Uint8Array (:arr result)))
      (is (object? (:obj result)))
      (is (= {:deep true} (:nested result))))))

;; ---------------------------------------------------------------------------
;; ctag alignment test (the original bug)
;; ---------------------------------------------------------------------------

(deftest ctag-alignment-test
  (testing "ctag in marker matches key in transfers map"
    (let [arr (js/Uint8Array. #js [1 2 3])
          transfer-atom (atom {:count 0 :seen {} :transfers {}})
          instrumented (serial/instr-body transfer-atom arr)
          wire-str (pr-str instrumented)
          parsed (edn/read-string wire-str)
          transfers-clj (:transfers @transfer-atom)]
      ;; Marker should have :ctag
      (is (contains? parsed :ctag))
      (let [ctag (:ctag parsed)]
        ;; The same ctag should be a key in transfers
        (is (contains? transfers-clj ctag))
        ;; And should have :obj with our array
        (is (= arr (get-in transfers-clj [ctag :obj]))))))

  (testing "multiple ctags align correctly"
    (let [arr1 (js/Uint8Array. #js [1])
          arr2 (js/Uint8Array. #js [2])
          arr3 (js/Uint8Array. #js [3])
          form [arr1 arr2 arr3]
          transfer-atom (atom {:count 0 :seen {} :transfers {}})
          instrumented (serial/instr-body transfer-atom form)
          transfers-clj (:transfers @transfer-atom)]
      ;; Should have 3 entries
      (is (= 3 (count transfers-clj)))
      ;; Each marker's ctag should match a transfers key
      (doseq [marker instrumented]
        (let [ctag (:ctag marker)]
          (is (contains? transfers-clj ctag))
          (is (some? (get-in transfers-clj [ctag :obj]))))))))
