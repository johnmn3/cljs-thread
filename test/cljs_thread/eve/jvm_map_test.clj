(ns cljs-thread.eve.jvm-map-test
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

(deftest empty-map-roundtrip
  (testing "empty map"
    (with-heap-slab
      (let [sio alloc/*jvm-slab-ctx*
            hdr (eve-map/jvm-write-map! sio (partial mem/value+sio->eve-bytes sio) {})
            m   (eve-map/jvm-eve-hash-map-from-offset sio hdr)]
        (is (= {} (into {} m)))
        (is (zero? (count m)))))))

(deftest primitive-kv-roundtrip
  (testing "map with primitive keys and values"
    (with-heap-slab
      (let [sio alloc/*jvm-slab-ctx*
            src {:a 1 :b "hello" :c true :d nil}
            hdr (eve-map/jvm-write-map! sio (partial mem/value+sio->eve-bytes sio) src)
            m   (eve-map/jvm-eve-hash-map-from-offset sio hdr)]
        (is (= src (into {} m)))
        (is (= 4 (count m)))
        (is (= 1 (get m :a)))
        (is (= "hello" (get m :b)))))))

(deftest keyword-lookup
  (testing "get returns correct value or default"
    (with-heap-slab
      (let [sio alloc/*jvm-slab-ctx*
            hdr (eve-map/jvm-write-map! sio (partial mem/value+sio->eve-bytes sio) {:x 42})
            m   (eve-map/jvm-eve-hash-map-from-offset sio hdr)]
        (is (= 42 (get m :x)))
        (is (nil? (get m :missing)))
        (is (= :default (get m :missing :default)))))))

(deftest map-reduce
  (testing "kvreduce visits all entries"
    (with-heap-slab
      (let [sio alloc/*jvm-slab-ctx*
            src {:a 1 :b 2 :c 3}
            hdr (eve-map/jvm-write-map! sio (partial mem/value+sio->eve-bytes sio) src)
            m   (eve-map/jvm-eve-hash-map-from-offset sio hdr)
            result (reduce-kv (fn [acc k v] (assoc acc k v)) {} m)]
        (is (= src result))))))

(deftest large-map-roundtrip
  (testing "map with 100 entries"
    (with-heap-slab
      (let [sio alloc/*jvm-slab-ctx*
            src (into {} (map (fn [i] [(keyword (str "k" i)) i]) (range 100)))
            hdr (eve-map/jvm-write-map! sio (partial mem/value+sio->eve-bytes sio) src)
            m   (eve-map/jvm-eve-hash-map-from-offset sio hdr)]
        (is (= src (into {} m)))))))

(deftest map-seq
  (testing "seq returns all key-value pairs"
    (with-heap-slab
      (let [sio alloc/*jvm-slab-ctx*
            src {:p 10 :q 20}
            hdr (eve-map/jvm-write-map! sio (partial mem/value+sio->eve-bytes sio) src)
            m   (eve-map/jvm-eve-hash-map-from-offset sio hdr)]
        (is (= (set src) (set (seq m))))))))

(deftest nested-map-with-vec-value
  (testing "map value is a vector — exercises value+sio->eve-bytes nested path"
    (with-heap-slab
      (let [sio alloc/*jvm-slab-ctx*
            src {:nums [1 2 3] :tags [:a :b]}
            hdr (eve-map/jvm-write-map! sio (partial mem/value+sio->eve-bytes sio) src)
            m   (eve-map/jvm-eve-hash-map-from-offset sio hdr coll-factory)]
        (is (= src (into {} m)))))))

(deftest nested-map-with-map-value
  (testing "map value is itself a map — exercises recursive slab allocation"
    (with-heap-slab
      (let [sio alloc/*jvm-slab-ctx*
            src {:outer {:inner 42}}
            hdr (eve-map/jvm-write-map! sio (partial mem/value+sio->eve-bytes sio) src)
            m   (eve-map/jvm-eve-hash-map-from-offset sio hdr coll-factory)]
        (is (= src (into {} m)))))))
