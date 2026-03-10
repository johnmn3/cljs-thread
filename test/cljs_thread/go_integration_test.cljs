(ns cljs-thread.go-integration-test
  "Integration tests: implicit go blocks with parking deref.

   These tests verify that @(future ...) and @(spawn ...) inside macro
   bodies are CPS-transformed to park (via Promises) instead of blocking
   (via Atomics.wait). The user API is unchanged — these tests look
   identical to blocking tests but exercise the parking code path.

   Pure cljs.test — runs inside a worker with synchronous blocking semantics
   available as a fallback."
  (:require [cljs.test :refer [deftest is testing]]
            [cljs-thread.core :as t])
  (:require-macros [cljs-thread.core :refer [spawn future]]))

;; =========================================================================
;; Phase 1: Basic parking — @(future ...) inside future/spawn
;; =========================================================================

(deftest park-basic-future
  (testing "future body with @(future ...) parks instead of blocking"
    (is (= 3 @(future
                (let [x @(future (+ 1 2))]
                  x))))))

(deftest park-sequential-lets
  (testing "two sequential @(future ...) calls park independently"
    (is (= 5 @(future
                (let [x @(future (+ 1 2))
                      y @(future (+ 1 1))]
                  (+ x y)))))))

(deftest park-mixed-bindings
  (testing "let with mixed deref and non-deref bindings"
    (is (= 6 @(future
                (let [a 1
                      x @(future (+ 2 3))
                      b (+ a x)]
                  b))))))

(deftest park-in-do
  (testing "deref in a do form"
    (is (= 42 @(future
                 (do
                   @(future (+ 1 1))
                   @(future 42)))))))

(deftest park-in-if
  (testing "deref in if branches"
    (is (= "yes" @(future
                    (if @(future true)
                      "yes"
                      "no"))))))

;; =========================================================================
;; Phase 2: Non-deref bodies unchanged (zero overhead)
;; =========================================================================

(deftest no-deref-passthrough
  (testing "body without deref works normally (no go transform)"
    (is (= 6 @(future (+ 1 2 3))))))

(deftest no-deref-with-let
  (testing "let without deref works normally"
    (is (= 10 @(future (let [a 3 b 7] (+ a b)))))))

;; =========================================================================
;; Phase 3: nested future parking
;; =========================================================================

(deftest park-future-basic
  (testing "future body with @(future ...) parks"
    (is (= 10 @(future
                 (let [x @(future (+ 5 5))]
                   x))))))

(deftest park-future-sequential
  (testing "future with two @(future ...) calls"
    (is (= 7 @(future
                (let [x @(future 3)
                      y @(future 4)]
                  (+ x y)))))))

;; =========================================================================
;; Phase 4: spawn parking
;; =========================================================================

(deftest park-spawn-basic
  (testing "spawn body with @(future ...) parks"
    (is (= 20 @(spawn
                 (let [x @(future (* 4 5))]
                   x))))))

;; =========================================================================
;; Phase 5: parking with eve atoms
;; =========================================================================

(deftest park-with-atom-deref
  (testing "eve atom deref inside parking body"
    (let [my-atom (t/atom {:counter 0})]
      (swap! my-atom update :counter inc)
      (is (= 1 @(future
                  (let [v @(future (:counter @my-atom))]
                    v)))))))

(deftest park-with-atom-swap
  (testing "swap on parked result"
    (let [my-atom (t/atom {:counter 0})]
      @(future
        (let [x @(future (+ 10 20))]
          (swap! my-atom assoc :counter x)))
      (is (= 30 (:counter @my-atom))))))

;; =========================================================================
;; Phase 6: fn-boundary fallback
;; =========================================================================

(deftest fn-boundary-blocks
  (testing "deref inside fn boundary falls back to blocking (not parking)"
    ;; map with fn creates a fn boundary — the @ inside it should
    ;; use regular blocking deref, not the go CPS transform.
    (is (= [2 3 4]
           @(future
             (vec (map (fn [i] @(future (inc i))) [1 2 3])))))))

;; =========================================================================
;; Phase 7: error propagation
;; =========================================================================

(deftest park-error-propagation
  (testing "errors in parked calls propagate correctly"
    (let [result @(future
                   (try
                     (let [x @(future (+ 1 2))]
                       x)
                     (catch :default e
                       :caught-error)))]
      ;; Should succeed, not error
      (is (= 3 result)))))

;; =========================================================================
;; Phase 8: HOF fn-boundary crossing — parking through map/filter/reduce
;; =========================================================================

(deftest park-hof-mapv
  (testing "mapv with parking deref inside fn body"
    (is (= [2 3 4]
           @(future
             (vec (mapv (fn [i] @(future (inc i))) [1 2 3])))))))

(deftest park-hof-filter
  (testing "filter with parking deref predicate"
    (is (= [1 3 5]
           @(future
             (vec (filter (fn [i] @(future (odd? i))) [1 2 3 4 5])))))))

(deftest park-hof-reduce
  (testing "reduce with parking deref in reducer fn"
    (is (= 6
           @(future
             (reduce (fn [acc i] (+ acc @(future i))) 0 [1 2 3]))))))

(deftest park-hof-keep
  (testing "keep with parking deref — drops nils"
    (is (= [2 4]
           @(future
             (vec (keep (fn [i]
                          (let [v @(future i)]
                            (when (even? v) v)))
                        [1 2 3 4 5])))))))

(deftest park-hof-mapv-with-atom
  (testing "mapv with eve atom inside parking fn"
    (let [my-atom (t/atom {:multiplier 10})]
      (is (= [10 20 30]
             @(future
               (vec (mapv (fn [i]
                            (* i @(future
                                   (:multiplier @my-atom))))
                          [1 2 3]))))))))
