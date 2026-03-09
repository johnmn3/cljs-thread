(ns cljs-thread.eve.jvm-atom-test
  (:require [clojure.test :refer [deftest is testing]]
            [cljs-thread.eve.atom :as atom]))

(def ^:private base (str "/tmp/eve-p7-jvm-atom-" (System/currentTimeMillis)))

(deftest test-fresh-atom-nil
  (let [a (atom/persistent-atom (str base "-nil"))]
    (is (nil? @a))
    (atom/close! a)))

(deftest test-initial-val
  (let [a (atom/persistent-atom (str base "-iv") {:x 1})]
    (is (= 1 (:x @a)))
    (atom/close! a)))

(deftest test-swap-bang
  (let [a (atom/persistent-atom (str base "-sw") {:count 0})]
    (swap! a update :count inc)
    (is (= 1 (:count @a)))
    (atom/close! a)))

(deftest test-reset-bang
  (let [a (atom/persistent-atom (str base "-rs") {:n 0})]
    (reset! a {:n 42})
    (is (= 42 (:n @a)))
    (atom/close! a)))

(deftest test-nil-value
  (let [a (atom/persistent-atom (str base "-nl") {:x 1})]
    (reset! a nil)
    (is (nil? @a))
    (atom/close! a)))

(deftest test-join-atom
  (let [base2 (str base "-join")
        a     (atom/persistent-atom base2 {:count 5})]
    (atom/close! a)
    (let [b (atom/join-atom base2)]
      (is (= 5 (:count @b)))
      (atom/close! b))))

(deftest test-multiple-swaps
  (let [a (atom/persistent-atom (str base "-multi") {:count 0})]
    (dotimes [_ 10] (swap! a update :count inc))
    (is (= 10 (:count @a)))
    (atom/close! a)))
