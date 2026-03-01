(ns cljs-thread.eve-mini-test
  "Minimal test to bisect smoke test hang."
  (:require [cljs.test :refer [deftest is testing]]
            [cljs-thread.core :as t]
            [cljs-thread.spawn]
            [cljs-thread.future])
  (:require-macros [cljs-thread.core :refer [spawn in future]]))

(deftest atom-basic
  (testing "create and deref"
    (let [my-atom (t/atom {:name "eve"})]
      (is (= {:name "eve"} @my-atom)))))

(deftest spawn-basic
  (testing "spawn works"
    (is (= 6 @(spawn (+ 1 2 3))))))

(deftest in-to-root
  (testing "in to pre-existing :core worker"
    (is (= 6 @(in :core (+ 1 2 3))))))

(deftest future-basic
  (testing "future works"
    (is (= 300 @(future (+ 100 200))))))

;; Test with different variable name to rule out `w` shadowing
(deftest spawn-let-in-myworker
  (testing "spawn in let binding, in by different var name"
    (let [my-worker (spawn {:id :mini-mw})]
      (is (= 42 @(in my-worker (+ 10 32)))))))
