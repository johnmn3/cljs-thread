(ns cljs-thread.eve-batch5-validation-test
  "Batch 5 validation tests (commits 35-38): Integration Hardening.
   Exercises the spawn conveyance fix and smoke test patterns that
   prove the full eve + cljs-thread stack targets slab infrastructure.

   Commits validated:
     35 — SharedAtom conveyance in spawn.cljs + fat_kernel.cljs
     36 — Comprehensive smoke test suite (526 lines, 6 chapters)
     37 — Drop :root usage, add yield chapter
     38 — Clarify future pool semantics"
  (:require [cljs.test :refer [deftest is testing]]
            [cljs-thread.core :as t])
  (:require-macros [cljs-thread.core :refer [spawn future]]))

;; ==========================================================================
;; Commit 35: SharedAtom conveyance in spawn
;;
;; Before commit 35, spawn.cljs didn't have eve-atom-domain? checks.
;; SharedAtoms would crash during the str→edn round-trip in
;; workerData. The fix adds duck-type checks in instrument-eargs and
;; fat_kernel.cljs create-worker, serializing them as tag markers that
;; workers reconstruct via eve/reconstruct-shared-atom.
;; ==========================================================================

(deftest spawn-conveys-shared-atom
  (testing "SharedAtom survives spawn conveyance (commit 35)"
    (let [my-atom (t/atom {:origin "main"})]
      @(spawn (swap! my-atom assoc :visited "spawned"))
      (is (= "spawned" (:visited @my-atom))
          "Atom mutated in spawn should be visible locally"))))

(deftest spawn-conveys-multiple-shared-atoms
  (testing "Multiple SharedAtoms in single spawn (commit 35)"
    (let [atom-a (t/atom {:label "a" :count 0})
          atom-b (t/atom {:label "b" :count 0})]
      @(spawn
        (swap! atom-a update :count inc)
        (swap! atom-b update :count + 10))
      (is (= 1 (:count @atom-a)) "First atom incremented")
      (is (= 10 (:count @atom-b)) "Second atom added 10"))))

(deftest spawn-atom-deref-returns-correct-value
  (testing "Deref of conveyed atom returns current value on worker (commit 35)"
    (let [my-atom (t/atom {:data "shared"})]
      (is (= "shared"
             @(spawn (:data @my-atom)))
          "Deref on spawned worker should see the atom value"))))

(deftest fat-kernel-conveys-shared-atom
  (testing "Fat kernel worker creation handles SharedAtom (commit 35)"
    (let [my-atom (t/atom {:step 0})]
      ;; Sequential spawns: each creates a new fat-kernel worker
      @(spawn (swap! my-atom update :step inc))
      @(spawn (swap! my-atom update :step inc))
      @(spawn (swap! my-atom update :step inc))
      (is (= 3 (:step @my-atom))
          "Three sequential spawns each increment once"))))

;; ==========================================================================
;; Commits 36-38: Smoke test patterns
;;
;; The smoke tests (eve_smoke_test.cljs) exercise the full API in a
;; walkthrough style. These tests verify the core patterns from each
;; chapter work correctly — providing a regression safety net for the
;; batch 5 smoke test deliverable.
;; ==========================================================================

;; Chapter 1 pattern: atom CRUD
(deftest smoke-atom-crud-pattern
  (testing "Atom create/read/update/delete pattern (smoke ch1)"
    (let [my-atom (t/atom {:a 1 :b 2 :c 3})]
      (swap! my-atom assoc :d 4)
      (is (= 4 (count @my-atom)) "assoc adds key")
      (swap! my-atom dissoc :b)
      (is (= {:a 1 :c 3 :d 4} @my-atom) "dissoc removes key")
      (reset! my-atom {:fresh true})
      (is (= {:fresh true} @my-atom) "reset! replaces entirely"))))

;; Chapter 2 pattern: spawn/future/in primitives
(deftest smoke-spawn-future-primitives
  (testing "spawn and future return values (smoke ch2)"
    (let [x 10 y 20]
      (is (= 30 @(spawn (+ x y))) "spawn with conveyance")
      (is (= 200 @(future (* x y))) "future with conveyance"))))

;; Chapter 3 pattern: cross-thread atom integration
(deftest smoke-cross-thread-atom-swap
  (testing "Cross-thread atom swap visible locally (smoke ch3)"
    (let [my-atom (t/atom {:status "pending"})]
      @(future (swap! my-atom assoc :status "done"))
      (is (= "done" (:status @my-atom))
          "Future swap visible on originating thread"))))

;; Chapter 4 pattern: yield
(deftest smoke-yield-basic
  (testing "yield returns value from spawn (smoke ch4)"
    (is (= 42 @(spawn (yield (+ 40 2))))
        "yield should return computed value")))

(deftest smoke-yield-with-timeout
  (testing "yield converts async callback to sync (smoke ch4)"
    (is (= 99 @(spawn (js/setTimeout #(yield 99) 50)))
        "yield in setTimeout callback should resolve")))

;; Chapter 5 pattern: persistent data structures through atoms
(deftest smoke-nested-update-in
  (testing "update-in on nested structure from future (smoke ch5)"
    (let [my-atom (t/atom {:app {:db {:count 0}}})]
      @(future (swap! my-atom update-in [:app :db :count] + 5))
      (is (= 5 (get-in @my-atom [:app :db :count]))
          "Deep nested update visible across threads"))))

;; Chapter 6 pattern: multi-worker concurrent increments
(deftest smoke-multi-worker-concurrent
  (testing "Multiple workers concurrently swap (smoke ch6)"
    (let [my-atom (t/atom {:counter 0})
          handles (mapv (fn [_]
                          (spawn
                            (dotimes [_ 3]
                              (swap! my-atom update :counter inc))))
                        (range 3))]
      (doseq [h handles] @h)
      (is (>= (:counter @my-atom) 5)
          "Concurrent increments should progress under CAS"))))

;; Chapter 6 pattern: cross-worker registry
(deftest smoke-cross-worker-registry
  (testing "Different worker types contribute to shared map (smoke ch6)"
    (let [registry (t/atom {})]
      @(future (swap! registry assoc :future "ok"))
      @(spawn (swap! registry assoc :spawn "ok"))
      (let [state @registry]
        (is (= "ok" (:future state)) "future worker contributed")
        (is (= "ok" (:spawn state)) "spawn worker contributed")))))
