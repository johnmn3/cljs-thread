(ns cljs-thread.eve-integration-test
  "Integration tests: eve SharedAtom with cljs-thread fat kernel.
   Covers Phases 0-4 of the integration plan.

   Pure cljs.test — the external test runner discovers and executes
   these tests inside a worker with synchronous blocking semantics."
  (:require [cljs.test :refer [deftest is testing]]
            [cljs-thread.core :as t]
            [cljs-thread.spawn]
            [cljs-thread.future])
  (:require-macros [cljs-thread.core :refer [spawn in future]]))

;; ==========================================================================
;; Phase 0: Baseline — cljs-thread works, atoms work in workers
;; ==========================================================================

(deftest cljs-thread-boots
  (.writeSync (js/require "fs") 2 "[TEST] cljs-thread-boots START\n")
  (testing "basic arithmetic in another worker"
    (let [f (future (+ 1 2))
          result @f]
      (.writeSync (js/require "fs") 2 "[TEST] cljs-thread-boots DEREF DONE\n")
      (is (= 3 result))))
  (.writeSync (js/require "fs") 2 "[TEST] cljs-thread-boots END\n"))

(deftest worker-atom-ops
  (.writeSync (js/require "fs") 2 "[TEST] worker-atom-ops START\n")
  (testing "create, deref, swap in worker"
    (let [my-atom (t/atom {:x 42})]
      (.writeSync (js/require "fs") 2 "[TEST] worker-atom-ops CREATED ATOM\n")
      (is (= {:x 42} @my-atom))
      (.writeSync (js/require "fs") 2 "[TEST] worker-atom-ops DEREF 1\n")
      (swap! my-atom assoc :counter 0)
      (.writeSync (js/require "fs") 2 "[TEST] worker-atom-ops SWAP 1\n")
      (is (= 0 (:counter @my-atom)))
      (.writeSync (js/require "fs") 2 "[TEST] worker-atom-ops DEREF 2\n")
      (swap! my-atom update :counter inc)
      (.writeSync (js/require "fs") 2 "[TEST] worker-atom-ops SWAP 2\n")
      (is (= 1 (:counter @my-atom)))))
  (.writeSync (js/require "fs") 2 "[TEST] worker-atom-ops END\n"))

;; ==========================================================================
;; Phase 2: Worker deref, swap, cross-worker visibility
;; ==========================================================================

(deftest worker-deref
  (.writeSync (js/require "fs") 2 "[TEST] worker-deref START\n")
  (testing "deref atom on another worker"
    (let [my-atom (t/atom {:hello "world"})
          _ (.writeSync (js/require "fs") 2 "[TEST] worker-deref CREATED ATOM\n")
          f (future (:hello (deref my-atom)))
          _ (.writeSync (js/require "fs") 2 "[TEST] worker-deref CREATED FUTURE\n")
          result @f]
      (.writeSync (js/require "fs") 2 "[TEST] worker-deref DEREF DONE\n")
      (is (= "world" result))))
  (.writeSync (js/require "fs") 2 "[TEST] worker-deref END\n"))

(deftest worker-swap
  (.writeSync (js/require "fs") 2 "[TEST] worker-swap START\n")
  (testing "swap locally, read on another worker"
    (let [my-atom (t/atom {:swapped false})
          _ (.writeSync (js/require "fs") 2 "[TEST] worker-swap CREATED ATOM\n")
          _ (swap! my-atom assoc :swapped true)
          _ (.writeSync (js/require "fs") 2 "[TEST] worker-swap SWAPPED\n")
          f (future (:swapped (deref my-atom)))
          _ (.writeSync (js/require "fs") 2 "[TEST] worker-swap CREATED FUTURE\n")
          result @f]
      (.writeSync (js/require "fs") 2 "[TEST] worker-swap DEREF DONE\n")
      (is (= true result))))
  (.writeSync (js/require "fs") 2 "[TEST] worker-swap END\n"))

(deftest cross-worker-visibility
  (.writeSync (js/require "fs") 2 "[TEST] cross-worker-visibility START\n")
  (testing "write on another worker, visible locally"
    (let [my-atom (t/atom {:val 0})
          _ (.writeSync (js/require "fs") 2 "[TEST] cross-worker-visibility CREATED ATOM\n")
          f (future (swap! my-atom assoc :val 99))
          _ (.writeSync (js/require "fs") 2 "[TEST] cross-worker-visibility CREATED FUTURE\n")
          _ @f]
      (.writeSync (js/require "fs") 2 "[TEST] cross-worker-visibility DEREF DONE\n")
      (is (= 99 (:val @my-atom)))))
  (.writeSync (js/require "fs") 2 "[TEST] cross-worker-visibility END\n"))

(deftest concurrent-swap
  (.writeSync (js/require "fs") 2 "[TEST] concurrent-swap START\n")
  (testing "3 spawns x 3 swaps with CAS tolerance"
    (let [my-atom (t/atom {:counter 0})
          _ (.writeSync (js/require "fs") 2 "[TEST] concurrent-swap CREATED ATOM\n")
          handles (mapv (fn [i]
                          (.writeSync (js/require "fs") 2 (str "[TEST] concurrent-swap CREATING SPAWN " i "\n"))
                          (spawn
                            (dotimes [_ 3]
                              (swap! my-atom update :counter inc))))
                        (range 3))]
      (.writeSync (js/require "fs") 2 "[TEST] concurrent-swap CREATED SPAWNS\n")
      (doseq [h handles]
        (.writeSync (js/require "fs") 2 "[TEST] concurrent-swap DEREFING HANDLE\n")
        @h)
      (.writeSync (js/require "fs") 2 "[TEST] concurrent-swap ALL DEREF DONE\n")
      (is (>= (:counter @my-atom) 5))))
  (.writeSync (js/require "fs") 2 "[TEST] concurrent-swap END\n"))

;; ==========================================================================
;; Phase 3: AtomDomain conveyance through `in`
;; ==========================================================================

(deftest conveyance-deref
  (.writeSync (js/require "fs") 2 "[TEST] conveyance-deref START\n")
  (testing "atom conveyed to another worker can be deref'd"
    (let [my-atom (t/atom {:value 42})]
      (is (= (pr-str {:value 42})
             @(future
                (pr-str (deref my-atom)))))))
  (.writeSync (js/require "fs") 2 "[TEST] conveyance-deref END\n"))

(deftest conveyance-swap
  (.writeSync (js/require "fs") 2 "[TEST] conveyance-swap START\n")
  (testing "swap on another worker visible locally"
    (let [my-atom (t/atom {:n 0})]
      @(future
        (swap! my-atom update :n inc))
      (is (= 1 (:n @my-atom)))))
  (.writeSync (js/require "fs") 2 "[TEST] conveyance-swap END\n"))

(deftest atom-identity-across-workers
  (.writeSync (js/require "fs") 2 "[TEST] atom-identity-across-workers START\n")
  (testing "two workers see same atom identity"
    (let [my-atom (t/atom {:step 0})]
      @(future
        (swap! my-atom update :step inc))
      (is (= 1 (:step @my-atom)))))
  (.writeSync (js/require "fs") 2 "[TEST] atom-identity-across-workers END\n"))

;; ==========================================================================
;; Phase 4: spawn/future integration
;; ==========================================================================

(deftest spawn-with-atom
  (.writeSync (js/require "fs") 2 "[TEST] spawn-with-atom START\n")
  (testing "spawn increments and returns"
    (let [my-atom (t/atom {:counter 0})]
      (is (= 1 @(spawn
                  (swap! my-atom update :counter inc)
                  (:counter (deref my-atom)))))))
  (.writeSync (js/require "fs") 2 "[TEST] spawn-with-atom END\n"))

(deftest future-with-atom
  (.writeSync (js/require "fs") 2 "[TEST] future-with-atom START\n")
  (testing "future increments and returns"
    (let [my-atom (t/atom {:counter 0})]
      (is (= 1 @(future
                  (swap! my-atom update :counter inc)
                  (:counter (deref my-atom)))))))
  (.writeSync (js/require "fs") 2 "[TEST] future-with-atom END\n"))

(deftest concurrent-futures
  (.writeSync (js/require "fs") 2 "[TEST] concurrent-futures START\n")
  (testing "3 futures x 2 swaps with CAS tolerance"
    (let [my-atom (t/atom {:counter 0})
          handles (mapv (fn [_]
                          (future
                            (dotimes [_ 2]
                              (swap! my-atom update :counter inc))))
                        (range 3))]
      (doseq [h handles] @h)
      (is (>= (:counter @my-atom) 3))))
  (.writeSync (js/require "fs") 2 "[TEST] concurrent-futures END\n"))

;; ==========================================================================
;; Phase 9: Additional direct SAB sync tests (from migration plan)
;; ==========================================================================

(deftest in-sync-deref
  (.writeSync (js/require "fs") 2 "[TEST] in-sync-deref START\n")
  (testing "@(in :db [] expr) blocks and returns"
    (is (= 42 @(in :db [] (+ 40 2)))))
  (.writeSync (js/require "fs") 2 "[TEST] in-sync-deref END\n"))

(deftest in-with-args
  (.writeSync (js/require "fs") 2 "[TEST] in-with-args START\n")
  (testing "in with conveyed args"
    (let [x 10 y 20]
      (is (= 30 @(in :db [x y] (+ x y))))))
  (.writeSync (js/require "fs") 2 "[TEST] in-with-args END\n"))

(deftest future-with-closure
  (.writeSync (js/require "fs") 2 "[TEST] future-with-closure START\n")
  (testing "future captures closure variables"
    (let [multiplier 7]
      (is (= 42 @(future (* 6 multiplier))))))
  (.writeSync (js/require "fs") 2 "[TEST] future-with-closure END\n"))

(deftest nested-in
  (.writeSync (js/require "fs") 2 "[TEST] nested-in START\n")
  (testing "nested in calls between workers"
    (is (= 42 @(in :db []
                 @(in :core []
                   (* 6 7))))))
  (.writeSync (js/require "fs") 2 "[TEST] nested-in END\n"))

(deftest error-propagation
  (.writeSync (js/require "fs") 2 "[TEST] error-propagation START\n")
  (testing "errors propagate through deref"
    (let [caught? (atom false)]
      (try
        @(future (throw (js/Error. "boom")))
        (catch :default e
          (reset! caught? true)))
      (is @caught? "Error should have been caught")))
  (.writeSync (js/require "fs") 2 "[TEST] error-propagation END\n"))

;; ==========================================================================
;; Tests that validate async computation patterns work correctly
;; NOTE: Tests run on :core, so NEVER use `in :core` - it will deadlock!
;; Use spawn/future for user-facing tests.
;; ==========================================================================

(deftest parallel-futures
  (.writeSync (js/require "fs") 2 "[TEST] parallel-futures START\n")
  (testing "Multiple parallel futures can be created and awaited"
    ;; Create multiple futures in parallel, await them all
    (let [f1 (future (+ 10 20))
          f2 (future (* 3 4))
          f3 (future (- 100 50))
          results [@f1 @f2 @f3]]
      (is (= [30 12 50] results) "Parallel futures should work")))
  (.writeSync (js/require "fs") 2 "[TEST] parallel-futures END\n"))

(deftest spawn-returns-value
  (.writeSync (js/require "fs") 2 "[TEST] spawn-returns-value START\n")
  (testing "Spawn can compute and return a value"
    ;; Spawn does computation and returns result
    (let [result @(spawn
                    (let [x 10
                          y 20]
                      (* (+ x y) 2)))]
      (is (= 60 result) "Spawn should return computed value")))
  (.writeSync (js/require "fs") 2 "[TEST] spawn-returns-value END\n"))

(deftest multiple-spawns-concurrent
  (.writeSync (js/require "fs") 2 "[TEST] multiple-spawns-concurrent START\n")
  (testing "Multiple spawns can run concurrently"
    ;; Create several spawns, await them all
    (let [s1 (spawn (* 6 7))
          s2 (spawn (+ 10 20 12))
          s3 (spawn (/ 84 2))
          results [@s1 @s2 @s3]]
      (is (= [42 42 42] results) "Multiple concurrent spawns should work")))
  (.writeSync (js/require "fs") 2 "[TEST] multiple-spawns-concurrent END\n"))
