(ns cljs-thread.state-test
  (:require
   [clojure.test :refer [deftest is testing]]
   [cljs-thread.state :as s]))

(deftest conf-test
  (testing "conf is an atom"
    (is (instance? Atom s/conf)))
  (testing "initial conf is a map"
    (is (map? @s/conf))))

(deftest update-conf!-test
  (testing "merges new keys into conf"
    (let [before @s/conf]
      (s/update-conf! {:test-key "test-value"})
      (is (= "test-value" (:test-key @s/conf)))
      ;; clean up
      (reset! s/conf (dissoc before :test-key)))))

(deftest peers-test
  (testing "peers is an atom"
    (is (instance? Atom s/peers)))
  (testing "peers does not have :parent in screen context"
    ;; in-screen? is true, so the when-not block should not have executed
    (is (not (contains? @s/peers :parent)))))

(deftest state-atoms-test
  (testing "responses is an atom initialized to empty map"
    (is (instance? Atom s/responses))
    (is (= {} @s/responses)))
  (testing "requests is an atom initialized to empty map"
    (is (instance? Atom s/requests))
    (is (= {} @s/requests)))
  (testing "future-pool is an atom with :available and :in-use sets"
    (is (instance? Atom s/future-pool))
    (is (set? (:available @s/future-pool)))
    (is (set? (:in-use @s/future-pool))))
  (testing "idb is an atom initialized to nil"
    (is (instance? Atom s/idb))
    (is (nil? @s/idb))))
