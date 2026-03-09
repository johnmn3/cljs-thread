(ns cljs-thread.eve.jvm-vec-test
  (:require [clojure.test :refer [deftest is testing]]
            [cljs-thread.eve.deftype-proto.alloc :as alloc]
            [cljs-thread.eve.mem :as mem]
            [cljs-thread.eve.map  :as eve-map]
            [cljs-thread.eve.vec  :as eve-vec]
            [cljs-thread.eve.set  :as eve-set]
            [cljs-thread.eve.list :as eve-list]))

(defmacro with-heap-slab [& body]
  `(let [ctx# (alloc/make-jvm-heap-slab-ctx {})]
     (binding [alloc/*jvm-slab-ctx* ctx#]
       ~@body)))

;;; Recursive collection factory — dispatches on SAB tag to the correct constructor.
;;; Passed as coll-factory when reading back nested collections.
(defn coll-factory [tag sio off]
  (case (int tag)
    0x10 (eve-map/jvm-eve-hash-map-from-offset sio off coll-factory)
    0x11 (eve-set/jvm-eve-hash-set-from-offset sio off coll-factory)
    0x12 (eve-vec/jvm-sabvec-from-offset       sio off coll-factory)
    0x13 (eve-list/jvm-sab-list-from-offset    sio off coll-factory)))

(deftest empty-vec-roundtrip
  (testing "empty vector"
    (with-heap-slab
      (let [sio alloc/*jvm-slab-ctx*
            hdr (eve-vec/jvm-write-vec! sio (partial mem/value+sio->eve-bytes sio) [])
            v   (eve-vec/jvm-sabvec-from-offset sio hdr)]
        (is (= [] (vec v)))
        (is (zero? (count v)))))))

(deftest single-element-vec
  (testing "vector with one element"
    (with-heap-slab
      (let [sio alloc/*jvm-slab-ctx*
            hdr (eve-vec/jvm-write-vec! sio (partial mem/value+sio->eve-bytes sio) [42])
            v   (eve-vec/jvm-sabvec-from-offset sio hdr)]
        (is (= [42] (vec v)))
        (is (= 1 (count v)))
        (is (= 42 (nth v 0)))))))

(deftest primitive-vec-roundtrip
  (testing "vector with mixed primitives"
    (with-heap-slab
      (let [sio alloc/*jvm-slab-ctx*
            src [1 "hello" :kw true nil]
            hdr (eve-vec/jvm-write-vec! sio (partial mem/value+sio->eve-bytes sio) src)
            v   (eve-vec/jvm-sabvec-from-offset sio hdr)]
        (is (= src (vec v)))
        (is (= 5 (count v)))
        (is (= 1     (nth v 0)))
        (is (= "hello" (nth v 1)))
        (is (= :kw   (nth v 2)))))))

(deftest vec-nth
  (testing "nth access by index"
    (with-heap-slab
      (let [sio alloc/*jvm-slab-ctx*
            src [:a :b :c :d :e]
            hdr (eve-vec/jvm-write-vec! sio (partial mem/value+sio->eve-bytes sio) src)
            v   (eve-vec/jvm-sabvec-from-offset sio hdr)]
        (doseq [i (range (count src))]
          (is (= (nth src i) (nth v i))))))))

(deftest vec-reduce
  (testing "reduce visits all elements in order"
    (with-heap-slab
      (let [sio alloc/*jvm-slab-ctx*
            src [10 20 30 40 50]
            hdr (eve-vec/jvm-write-vec! sio (partial mem/value+sio->eve-bytes sio) src)
            v   (eve-vec/jvm-sabvec-from-offset sio hdr)
            result (reduce conj [] v)]
        (is (= src result))))))

(deftest large-vec-roundtrip
  (testing "vector with 50 elements"
    (with-heap-slab
      (let [sio alloc/*jvm-slab-ctx*
            src (vec (range 50))
            hdr (eve-vec/jvm-write-vec! sio (partial mem/value+sio->eve-bytes sio) src)
            v   (eve-vec/jvm-sabvec-from-offset sio hdr)]
        (is (= src (vec v)))
        (is (= 50 (count v)))))))

(deftest nested-vec-with-map-elements
  (testing "vector containing maps — exercises value+sio->eve-bytes nested path"
    (with-heap-slab
      (let [sio alloc/*jvm-slab-ctx*
            src [{:a 1} {:b 2} {:c 3}]
            hdr (eve-vec/jvm-write-vec! sio (partial mem/value+sio->eve-bytes sio) src)
            v   (eve-vec/jvm-sabvec-from-offset sio hdr coll-factory)]
        (is (= src (vec v)))))))
