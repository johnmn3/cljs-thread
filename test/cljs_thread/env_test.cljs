(ns cljs-thread.env-test
  (:require
   [clojure.test :refer [deftest is testing]]
   [cljs-thread.env :as e]))

(deftest in-screen?-test
  (testing "returns true in browser main window"
    (is (true? (e/in-screen?)))))

(deftest data-test
  (testing "data contains :id :screen in browser without query params"
    (is (map? e/data))
    (is (= :screen (:id e/data)))))

(deftest environment-predicate-tests
  (testing "in-root? is false in screen context"
    (is (false? (e/in-root?))))
  (testing "in-sw? is false in screen context"
    (is (false? (e/in-sw?))))
  (testing "in-core? is false in screen context"
    (is (false? (e/in-core?))))
  (testing "in-future? is false in screen context"
    (is (false? (e/in-future?))))
  (testing "in-branch? is false in screen context"
    (is (false? (e/in-branch?)))))

(deftest current-browser-test
  (testing "current-browser returns :chrome in Chromium"
    (is (= :chrome e/current-browser))))
