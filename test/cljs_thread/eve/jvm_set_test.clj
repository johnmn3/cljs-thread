(ns cljs-thread.eve.jvm-set-test
  (:require [clojure.test :refer [deftest is testing]]
            [cljs-thread.eve.deftype-proto.alloc :as alloc]
            [cljs-thread.eve.mem :as mem]
            [cljs-thread.eve.set :as eve-set]))

(defmacro with-heap-slab [& body]
  `(let [ctx# (alloc/make-jvm-heap-slab-ctx {})]
     (binding [alloc/*jvm-slab-ctx* ctx#]
       ~@body)))

(deftest empty-set-roundtrip
  (testing "empty set"
    (with-heap-slab
      (let [sio alloc/*jvm-slab-ctx*
            hdr (eve-set/jvm-write-set! sio (partial mem/value+sio->eve-bytes sio) #{})
            s   (eve-set/jvm-eve-hash-set-from-offset sio hdr)]
        (is (= #{} (set s)))
        (is (zero? (count s)))))))

(deftest primitive-set-roundtrip
  (testing "set with primitive elements"
    (with-heap-slab
      (let [sio alloc/*jvm-slab-ctx*
            src #{:a :b :c 1 "hello"}
            hdr (eve-set/jvm-write-set! sio (partial mem/value+sio->eve-bytes sio) src)
            s   (eve-set/jvm-eve-hash-set-from-offset sio hdr)]
        (is (= src (set s)))
        (is (= 5 (count s)))))))

(deftest set-contains
  (testing "contains? returns correct results"
    (with-heap-slab
      (let [sio alloc/*jvm-slab-ctx*
            src #{:x :y :z}
            hdr (eve-set/jvm-write-set! sio (partial mem/value+sio->eve-bytes sio) src)
            s   (eve-set/jvm-eve-hash-set-from-offset sio hdr)]
        (is (contains? s :x))
        (is (contains? s :y))
        (is (contains? s :z))
        (is (not (contains? s :missing)))))))

(deftest set-seq
  (testing "seq returns all elements"
    (with-heap-slab
      (let [sio alloc/*jvm-slab-ctx*
            src #{10 20 30}
            hdr (eve-set/jvm-write-set! sio (partial mem/value+sio->eve-bytes sio) src)
            s   (eve-set/jvm-eve-hash-set-from-offset sio hdr)]
        (is (= src (set (seq s))))))))

(deftest large-set-roundtrip
  (testing "set with 50 elements"
    (with-heap-slab
      (let [sio alloc/*jvm-slab-ctx*
            src (set (map #(keyword (str "e" %)) (range 50)))
            hdr (eve-set/jvm-write-set! sio (partial mem/value+sio->eve-bytes sio) src)
            s   (eve-set/jvm-eve-hash-set-from-offset sio hdr)]
        (is (= src (set s)))
        (is (= 50 (count s)))))))
