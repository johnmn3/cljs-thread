(ns cljs-thread.eve.mmap-atom-test
  "Tests for the B2 mmap-backed persistent atom (CLJS Node.js only).
   Requires: native addon loaded, mmap slab path working (Phase 2 + 3).
   Run via: node target/thread-test/all.js mmap-atom"
  (:require [cljs.test :refer [deftest testing is]]
            [cljs-thread.eve.atom :as atom]))

(def ^:private test-base "/tmp/eve-p5-atom-test")

(deftest test-persistent-atom-nil
  (testing "fresh atom has nil value"
    (let [a (atom/persistent-atom test-base)]
      (is (nil? @a)))))

(deftest test-persistent-atom-initial-val
  (testing "persistent-atom with initial value"
    (let [a (atom/persistent-atom (str test-base "-iv") {:x 1})]
      (is (= 1 (:x @a))))))

(deftest test-swap-bang
  (testing "swap! applies f to current value"
    (let [a (atom/persistent-atom (str test-base "-sw") {:count 0})]
      (swap! a update :count inc)
      (is (= 1 (:count @a)))
      (swap! a assoc :y 99)
      (is (= 99 (:y @a))))))

(deftest test-reset-bang
  (testing "reset! sets value"
    (let [a (atom/persistent-atom (str test-base "-rs") {:n 0})]
      (reset! a {:n 42})
      (is (= 42 (:n @a))))))

(deftest test-nil-value
  (testing "swap! to nil is supported"
    (let [a (atom/persistent-atom (str test-base "-nl") {:x 1})]
      (reset! a nil)
      (is (nil? @a)))))

(deftest test-join-atom
  (testing "join-atom reads value written by persistent-atom"
    (let [base (str test-base "-join")
          a    (atom/persistent-atom base {:count 5})]
      (let [b (atom/join-atom base)]
        (is (= 5 (:count @b)))))))
