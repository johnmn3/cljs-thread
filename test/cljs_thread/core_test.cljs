;; Test file for cljs-thread.core
(ns cljs-thread.core-test
  (:require [cljs.test :refer-macros [deftest is testing]]
            [cljs-thread.core :as sut]))

(deftest id-test
  (testing "Test for sut/id"
    (is (some? sut/id) "sut/id should be defined")
    (is (or (keyword? sut/id) (string? sut/id)) "sut/id should be a keyword or a string")))

(deftest sleep-test
  (testing "Test for sut/sleep"
    (async done
      (let [duration 100 ;; ms
            start-time (js/Date.now)]
        (sut/sleep duration)
        (let [end-time (js/Date.now)
              elapsed (- end-time start-time)
              ;; Allow for a margin of error, e.g., 50ms + some upper bound factor for slow CIs
              margin (* duration 0.8) ;; 80% margin for variability in test environments
              lower-bound (- duration margin)
              upper-bound (+ duration (* margin 3))] ;; Generous upper bound for CI
          (is (>= elapsed lower-bound) (str "Elapsed time " elapsed "ms should be >= " lower-bound "ms"))
          (is (<= elapsed upper-bound) (str "Elapsed time " elapsed "ms should be <= " upper-bound "ms"))
          (done))))))
