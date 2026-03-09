(ns cljs-thread.eve.jvm-list-test
  (:require [clojure.test :refer [deftest is testing]]
            [cljs-thread.eve.deftype-proto.alloc :as alloc]
            [cljs-thread.eve.mem :as mem]
            [cljs-thread.eve.list :as eve-list]))

(defmacro with-heap-slab [& body]
  `(let [ctx# (alloc/make-jvm-heap-slab-ctx {})]
     (binding [alloc/*jvm-slab-ctx* ctx#]
       ~@body)))

(deftest empty-list-roundtrip
  (testing "empty list"
    (with-heap-slab
      (let [sio alloc/*jvm-slab-ctx*
            hdr (eve-list/jvm-write-list! sio (partial mem/value+sio->eve-bytes sio) '())
            l   (eve-list/jvm-sab-list-from-offset sio hdr)]
        (is (zero? (count l)))
        (is (nil? (seq l)))))))

(deftest single-element-list
  (testing "list with one element"
    (with-heap-slab
      (let [sio alloc/*jvm-slab-ctx*
            hdr (eve-list/jvm-write-list! sio (partial mem/value+sio->eve-bytes sio) '(42))
            l   (eve-list/jvm-sab-list-from-offset sio hdr)]
        (is (= 1 (count l)))
        (is (= 42 (first l)))))))

(deftest primitive-list-roundtrip
  (testing "list with mixed primitives"
    (with-heap-slab
      (let [sio alloc/*jvm-slab-ctx*
            src '(1 "hello" :kw true nil)
            hdr (eve-list/jvm-write-list! sio (partial mem/value+sio->eve-bytes sio) src)
            l   (eve-list/jvm-sab-list-from-offset sio hdr)]
        (is (= src (seq l)))
        (is (= 5 (count l)))))))

(deftest list-peek
  (testing "peek returns first element"
    (with-heap-slab
      (let [sio alloc/*jvm-slab-ctx*
            src '(:a :b :c)
            hdr (eve-list/jvm-write-list! sio (partial mem/value+sio->eve-bytes sio) src)
            l   (eve-list/jvm-sab-list-from-offset sio hdr)]
        (is (= :a (peek l)))))))

(deftest list-seq-order
  (testing "seq preserves insertion order"
    (with-heap-slab
      (let [sio alloc/*jvm-slab-ctx*
            src '(10 20 30 40 50)
            hdr (eve-list/jvm-write-list! sio (partial mem/value+sio->eve-bytes sio) src)
            l   (eve-list/jvm-sab-list-from-offset sio hdr)]
        (is (= src (seq l)))))))

(deftest large-list-roundtrip
  (testing "list with 50 elements"
    (with-heap-slab
      (let [sio alloc/*jvm-slab-ctx*
            src (apply list (range 50))
            hdr (eve-list/jvm-write-list! sio (partial mem/value+sio->eve-bytes sio) src)
            l   (eve-list/jvm-sab-list-from-offset sio hdr)]
        (is (= src (seq l)))
        (is (= 50 (count l)))))))
