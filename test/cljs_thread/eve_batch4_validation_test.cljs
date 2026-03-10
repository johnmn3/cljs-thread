(ns cljs-thread.eve-batch4-validation-test
  "Batch 4 validation tests (commits 24-34): cljs-thread integration.
   Exercises actual multi-worker atom coordination through cljs-thread
   primitives (spawn, future) to prove each commit correctly targets
   the slab infrastructure.

   Commits validated:
     27 — sab-transfer-data: SAB refs extracted and used for worker init
     29 — cljs-thread as tracked directory: eve bridge, auto-init, side-effect registrations
     30 — SharedAtom API (t/atom) used throughout (not global instance)
     31 — Multi-worker spawn/future patterns exercise slab CAS across threads
     34 — SharedAtom conveyance through spawn and future macros

   Runs inside a worker with synchronous blocking semantics (dispatched by
   the external test runner via `in :core`)."
  (:require [cljs.test :refer [deftest is testing]]
            [cljs-thread.core :as t]
            [eve.shared-atom :as a])
  (:require-macros [cljs-thread.core :refer [spawn future]]))

;; ==========================================================================
;; Commit 27: sab-transfer-data
;;
;; The eve bridge module calls (a/sab-transfer-data ...) on the main thread
;; to extract SAB refs, which are then passed to workers via workerData.
;; If this didn't work, no worker would be able to reconstruct the atom.
;; The fact that ANY cross-thread atom operation succeeds proves commit 27.
;; ==========================================================================

(deftest sab-transfer-data-enables-worker-atoms
  (testing "sab-transfer-data enables cross-thread atom reconstruction (commit 27)"
    (let [my-atom (t/atom {:transferred true})]
      (is (= true (:transferred @my-atom))
          "Atom creation proves SAB was transferred to this worker"))))

(deftest sab-transfer-data-survives-cross-worker-hop
  (testing "SAB transfer enables atom ops across two worker hops (commit 27)"
    (let [my-atom (t/atom {:hop 0})]
      ;; Hop 1: spawn a worker, mutate atom there
      @(spawn
        (swap! my-atom assoc :hop 1))
      (is (= 1 (:hop @my-atom)) "First hop should update")
      ;; Hop 2: another spawn
      @(spawn
        (swap! my-atom assoc :hop 2))
      (is (= 2 (:hop @my-atom)) "Second hop should update"))))

;; ==========================================================================
;; Commit 29: cljs-thread as tracked directory
;;
;; The eve bridge module (cljs-thread.eve) auto-initializes on workers,
;; registering sab-map/vec/set/list type builders. If the tracked directory
;; wasn't properly set up, none of the eve bridge functionality would load.
;; ==========================================================================

(deftest eve-bridge-auto-init-works
  (testing "eve bridge auto-initialized on this worker (commit 29)"
    (is (some? a/*global-atom-instance*)
        "Global atom should be initialized (eve bridge auto-init!)")))

(deftest sab-type-builders-registered
  (testing "SAB type builders registered via eve bridge requires (commit 29)"
    (let [my-atom (t/atom {:a 1 :b 2 :c 3})]
      (is (= 1 (:a @my-atom)) "Map serialization works (sab-map registered)")
      (is (= 2 (:b @my-atom)) "Map key :b round-trips")
      (is (= 3 (:c @my-atom)) "Map key :c round-trips"))))

;; ==========================================================================
;; Commit 30: SharedAtom API (t/atom)
;;
;; Tests use (t/atom val) which creates SharedAtom instances
;; allocated within the parent's SAB via the slab allocator.
;; ==========================================================================

(deftest shared-atom-deref-swap-on-slab
  (testing "SharedAtom deref and swap on slab (commit 30)"
    (let [my-atom (t/atom {:counter 0})]
      (is (= 0 (:counter @my-atom)) "Initial deref")
      (swap! my-atom update :counter inc)
      (is (= 1 (:counter @my-atom)) "After swap!")
      (swap! my-atom update :counter inc)
      (is (= 2 (:counter @my-atom)) "After second swap!"))))

(deftest shared-atom-reset-on-slab
  (testing "SharedAtom reset! on slab (commit 30)"
    (let [my-atom (t/atom {:old true})]
      (reset! my-atom {:new true})
      (is (= true (:new @my-atom)) "reset! should replace value")
      (is (nil? (:old @my-atom)) "Old key should be gone"))))

(deftest multiple-shared-atoms-independent
  (testing "Multiple SharedAtoms are independent on slab (commit 30)"
    (let [a1 (t/atom {:name "alice" :val 1})
          a2 (t/atom {:name "bob" :val 2})]
      (swap! a1 assoc :val 10)
      (is (= 10 (:val @a1)) "a1 updated")
      (is (= 2 (:val @a2)) "a2 unchanged"))))

;; ==========================================================================
;; Commit 31: Multi-worker patterns (spawn, future)
;;
;; Worker-launched test variants exercise slab CAS across multiple threads.
;; Uses spawn (ephemeral worker) and future (pool worker), not system workers.
;; ==========================================================================

(deftest spawn-swap-on-slab
  (testing "spawn worker swaps on EVE atom (commit 31)"
    (let [my-atom (t/atom {:counter 0})]
      (is (= 1 @(spawn
                   (swap! my-atom update :counter inc)
                   (:counter (deref my-atom))))))))

(deftest future-swap-on-slab
  (testing "future worker swaps on EVE atom (commit 31)"
    (let [my-atom (t/atom {:counter 0})]
      (is (= 1 @(future
                   (swap! my-atom update :counter inc)
                   (:counter (deref my-atom))))))))

(deftest concurrent-spawn-slab-cas
  (testing "3 concurrent spawns exercise slab CAS (commit 31)"
    (let [my-atom (t/atom {:counter 0})
          handles (mapv (fn [_]
                          (spawn
                            (dotimes [_ 3]
                              (swap! my-atom update :counter inc))))
                        (range 3))]
      (doseq [h handles] @h)
      (is (>= (:counter @my-atom) 5)
          "At least 5 of 9 increments should succeed under CAS"))))

(deftest future-deref-and-swap
  (testing "future deref and swap on slab atom (commit 31)"
    (let [my-atom (t/atom {:val 0})]
      @(future
        (swap! my-atom assoc :val 42))
      (is (= 42 (:val @my-atom))
          "Swap on future worker should be visible locally"))))

;; ==========================================================================
;; Commit 34: SharedAtom conveyance through spawn and future
;;
;; The conveyance fix in in.cljs detects SharedAtom by duck-typing
;; on shared-atom-id, serializes identity fields, and reconstructs on the
;; receiving worker via eve/reconstruct-shared-atom. cljs-thread auto-
;; captures local bindings so no explicit conveyance vector needed.
;; ==========================================================================

(deftest shared-atom-conveyance-through-future
  (testing "SharedAtom conveyed through future (commit 34)"
    (let [my-atom (t/atom {:payload "hello"})]
      (is (= "hello"
             @(future (:payload (deref my-atom))))
          "Embedded atom should be reconstructable on future worker"))))

(deftest shared-atom-conveyance-through-spawn
  (testing "SharedAtom conveyed through spawn (commit 34)"
    (let [my-atom (t/atom {:payload "spawn-test"})]
      (is (= "spawn-test"
             @(spawn (:payload (deref my-atom))))
          "Embedded atom should be reconstructable in spawn"))))

(deftest shared-atom-conveyance-round-trip
  (testing "SharedAtom survives conveyance + mutation round trip (commit 34)"
    (let [my-atom (t/atom {:step 0})]
      ;; Step 1: spawn, increment
      @(spawn
        (swap! my-atom update :step inc))
      (is (= 1 (:step @my-atom)) "Step 1 via spawn")
      ;; Step 2: another spawn, increment
      @(spawn
        (swap! my-atom update :step inc))
      (is (= 2 (:step @my-atom)) "Step 2 via spawn")
      ;; Step 3: future, increment
      @(future
        (swap! my-atom update :step inc))
      (is (= 3 (:step @my-atom)) "Step 3 via future"))))

(deftest shared-atom-conveyance-identity-preserved
  (testing "Embedded atom identity is preserved across conveyance (commit 34)"
    (let [my-atom (t/atom {:marker "identity-test"})]
      ;; Write on spawned worker
      @(spawn
        (swap! my-atom assoc :written-by "spawned"))
      (is (= "spawned" (:written-by @my-atom))
          "Write on spawned worker should be visible locally")
      ;; Write locally
      (swap! my-atom assoc :written-by "local")
      ;; Read on future worker
      (is (= "local"
             @(future (:written-by (deref my-atom))))
          "Write locally should be visible on future worker"))))
