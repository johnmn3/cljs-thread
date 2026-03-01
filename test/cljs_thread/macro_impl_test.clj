(ns cljs-thread.macro-impl-test
  (:require
   [clojure.test :refer [deftest is testing]]
   [cljs-thread.macro-impl :as mi]))

(deftest get-symbols-test
  (testing "extracts symbols from a form"
    (let [result (mi/get-symbols '(+ a b))]
      (is (vector? result))
      (is (some #{'+} result))
      (is (some #{'a} result))
      (is (some #{'b} result))))
  (testing "handles a single symbol"
    (is (= ['x] (mi/get-symbols 'x))))
  (testing "handles nested forms"
    (let [result (mi/get-symbols '(+ (- a b) c))]
      (is (some #{'a} result))
      (is (some #{'b} result))
      (is (some #{'c} result))))
  (testing "filters out non-symbols"
    (let [result (mi/get-symbols '(+ 1 2 a))]
      (is (some #{'a} result))
      (is (not (some #{1} result))))))

(deftest parse-in-test
  (testing "non-collection input returns empty bindings and opts"
    (let [[args opts body] (mi/parse-in 'x)]
      (is (= [] args))
      (is (= {} opts))
      (is (= 'x body))))
  (testing "vector-first with map-second"
    (let [[args opts body] (mi/parse-in '([a b] {:no-globals? true} (+ a b)))]
      (is (= '[a b] args))
      (is (= {:no-globals? true} opts))
      (is (= '((+ a b)) body))))
  (testing "vector-first without map"
    (let [[args opts body] (mi/parse-in '([a b] (+ a b)))]
      (is (= '[a b] args))
      (is (= {} opts))
      (is (= '((+ a b)) body))))
  (testing "map-first without vector"
    (let [[args opts body] (mi/parse-in '({:no-globals? true} (+ a b)))]
      (is (= [] args))
      (is (= {:no-globals? true} opts))
      (is (= '((+ a b)) body))))
  (testing "no vector or map prefix"
    (let [[args opts body] (mi/parse-in '((+ a b) (- c d)))]
      (is (= [] args))
      (is (= {} opts))
      (is (= '[(+ a b) (- c d)] body)))))

(deftest yield-form?-test
  (testing "detects yield in a form"
    (is (mi/yield-form? '(yield x)))
    (is (mi/yield-form? '(cljs-thread.core/yield x))))
  (testing "returns falsy for non-yield forms"
    (is (not (mi/yield-form? '(+ 1 2)))))
  (testing "returns nil for non-seq input"
    (is (nil? (mi/yield-form? 'x)))
    (is (nil? (mi/yield-form? 42)))))

(deftest yields?-test
  (testing "detects yield in nested expressions"
    (is (mi/yields? '(do (println "hi") (yield x)))))
  (testing "returns falsy when no yield present"
    (is (not (mi/yields? '(do (println "hi") (+ 1 2))))))
  (testing "returns nil for non-collection input"
    (is (nil? (mi/yields? 42)))))
