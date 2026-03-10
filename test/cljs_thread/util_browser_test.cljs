(ns ^{:platform :browser} cljs-thread.util-browser-test
  (:require
   [clojure.test :refer [deftest is testing]]
   [cljs-thread.util :as u]))

(deftest browser-type-test
  (testing "browser-type returns :chrome in Chromium"
    (is (= :chrome (u/browser-type)))))

(deftest in-chrome?-test
  (testing "in-chrome? returns true in Chromium"
    (is (true? (u/in-chrome?)))))

(deftest in-firefox?-test
  (testing "in-firefox? returns false in Chromium"
    (is (false? (u/in-firefox?)))))

(deftest in-safari?-test
  (testing "in-safari? returns false in Chromium"
    (is (false? (u/in-safari?)))))

(deftest in-opera?-test
  (testing "in-opera? returns false in Chromium"
    (is (false? (u/in-opera?)))))

(deftest num-cores-test
  (testing "num-cores returns a positive integer"
    (let [cores (u/num-cores)]
      (is (number? cores))
      (is (pos? cores)))))
