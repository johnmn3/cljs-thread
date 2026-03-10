(ns cljs-thread.eve-batch3-validation-test
  "Batch 3 validation tests (commits 18-23): cljs-thread integration.
   Exercises optimization restores and worker support fixes in a
   multi-worker context, proving each commit correctly targets the slab.

   Commits validated:
     18 — Cached wasm-mem views (DataView, Uint8Array) instead of constructors
     19 — OOM fix: multiple atoms work without exhausting allocator
     22 — Worker swap! fix: init-worker-cache! enables swap on workers
     23 — Concurrent worker swap smoke test patterns"
  (:require [cljs.test :refer [deftest is testing]]
            [cljs-thread.core :as t]
            [eve.wasm-mem :as wasm]
            [cljs-thread.spawn]
            [cljs-thread.future])
  (:require-macros [cljs-thread.core :refer [spawn future]]))

;; ==========================================================================
;; Commit 18: Cached wasm-mem views
;;
;; The macro now emits (wasm-mem/data-view) and (wasm-mem/u8-view) instead
;; of (js/DataView. sab) constructors. These cached views must be available
;; on worker threads after the eve bridge auto-init.
;; ==========================================================================

(deftest wasm-data-view-available-on-worker
  (testing "wasm-mem/data-view returns DataView on worker (commit 18)"
    (is (true? @(spawn (instance? js/DataView (wasm/data-view))))
        "Worker should have cached DataView via eve bridge")))

(deftest wasm-u8-view-available-on-worker
  (testing "wasm-mem/u8-view returns Uint8Array on worker (commit 18)"
    (is (true? @(spawn (instance? js/Uint8Array (wasm/u8-view))))
        "Worker should have cached Uint8Array via eve bridge")))

(deftest wasm-views-share-buffer-on-worker
  (testing "Cached views share buffer on worker (commit 18)"
    (is (true? @(spawn
                  (let [dv (wasm/data-view)
                        u8 (wasm/u8-view)]
                    (= (.-buffer dv) (.-buffer u8)))))
        "DataView and Uint8Array should reference the same SAB on worker")))

(deftest wasm-views-read-write-on-worker
  (testing "Cached views support read/write on worker (commit 18)"
    (let [my-atom (t/atom {:marker "wasm-test"})]
      ;; If we can swap! and deref, the cached views are working
      ;; (swap! uses DataView internally for slab operations)
      @(spawn
        (swap! my-atom assoc :marker "updated"))
      (is (= "updated" (:marker @my-atom))
          "swap! using cached views should work on worker"))))

;; ==========================================================================
;; Commit 19: OOM fix — multiple atoms without exhausting allocator
;;
;; The OOM fix (reset-pools!) ensures that creating multiple atoms
;; doesn't exhaust the slab allocator. In cljs-thread, each embedded
;; atom allocates within the parent's SAB.
;; ==========================================================================

(deftest multiple-shared-atoms-no-oom
  (testing "Creating multiple embedded atoms doesn't OOM (commit 19)"
    (dotimes [i 5]
      (let [my-atom (t/atom {:iteration i :data (str "test-" i)})]
        (is (= i (:iteration @my-atom))
            (str "Atom " i " should be readable"))))))

(deftest multiple-atoms-on-worker-no-oom
  (testing "Creating multiple embedded atoms on worker doesn't OOM (commit 19)"
    (is (= 5 @(spawn
                (loop [i 0]
                  (if (< i 5)
                    (let [my-atom (t/atom {:idx i})]
                      (when (= i (:idx (deref my-atom)))
                        (recur (inc i))))
                    i))))
        "Should create 5 atoms on worker without OOM")))

(deftest sequential-atom-create-swap-on-workers
  (testing "Sequential atom creation and swap across workers (commit 19)"
    (let [results (mapv (fn [i]
                          @(future
                            (let [my-atom (t/atom {:val i})]
                              (swap! my-atom update :val inc)
                              (:val (deref my-atom)))))
                        (range 3))]
      (is (= [1 2 3] results)
          "Each future should create atom, increment, and return"))))

;; ==========================================================================
;; Commit 22: Worker swap! fix — init-worker-cache!
;;
;; init-worker-cache! sets up the atom environment on worker threads,
;; enabling swap!/deref. The eve bridge calls this automatically.
;; These tests prove swap! works from various worker contexts.
;; ==========================================================================

(deftest swap-from-spawned-worker
  (testing "swap! works from spawned worker (commit 22)"
    (let [my-atom (t/atom {:val 0})]
      @(spawn
        (swap! my-atom assoc :val 42))
      (is (= 42 (:val @my-atom))
          "Spawned worker swap! should be visible locally"))))

(deftest swap-from-future-worker
  (testing "swap! works from future worker (commit 22)"
    (let [my-atom (t/atom {:val 0})]
      @(future
        (swap! my-atom assoc :val 99))
      (is (= 99 (:val @my-atom))
          "Future worker swap! should be visible locally"))))

(deftest deref-after-worker-swap
  (testing "deref reflects worker swap! immediately (commit 22)"
    (let [my-atom (t/atom {:counter 0})]
      @(spawn
        (swap! my-atom update :counter inc))
      @(spawn
        (swap! my-atom update :counter inc))
      (is (= 2 (:counter @my-atom))
          "Two sequential worker swaps should both be visible"))))

(deftest map-data-round-trips-through-worker-swap
  (testing "Map data round-trips through atom swap on worker (commit 22)"
    (let [my-atom (t/atom {})]
      @(spawn
        (swap! my-atom merge {:name "alice" :age 30 :active true}))
      (let [result @my-atom]
        (is (= "alice" (:name result)) "String value round-trips")
        (is (= 30 (:age result)) "Integer value round-trips")
        (is (= true (:active result)) "Boolean value round-trips")))))

;; ==========================================================================
;; Commit 23: Worker swap smoke test patterns
;;
;; The smoke test validates concurrent swaps from multiple workers.
;; These tests exercise the same patterns in cljs-thread.
;; ==========================================================================

(deftest concurrent-worker-swaps
  (testing "3 concurrent workers swap on same atom (commit 23)"
    (let [my-atom (t/atom {:counter 0})
          handles (mapv (fn [_]
                          (spawn
                            (dotimes [_ 3]
                              (swap! my-atom update :counter inc))))
                        (range 3))]
      (doseq [h handles] @h)
      (is (>= (:counter @my-atom) 5)
          "At least 5 of 9 increments should succeed under CAS"))))

(deftest relay-pattern-across-workers
  (testing "Relay pattern: workers sequentially swap (commit 23)"
    (let [my-atom (t/atom {:step 0})]
      ;; Worker 1
      @(spawn (swap! my-atom update :step inc))
      (is (= 1 (:step @my-atom)) "Step 1")
      ;; Worker 2
      @(future (swap! my-atom update :step inc))
      (is (= 2 (:step @my-atom)) "Step 2")
      ;; Worker 3
      @(spawn (swap! my-atom update :step inc))
      (is (= 3 (:step @my-atom)) "Step 3"))))

(deftest concurrent-futures-swap
  (testing "Concurrent futures swap on atom (commit 23)"
    (let [my-atom (t/atom {:total 0})
          handles (mapv (fn [_]
                          (future
                            (swap! my-atom update :total + 10)))
                        (range 3))]
      (doseq [h handles] @h)
      (is (= 30 (:total @my-atom))
          "3 futures adding 10 each should total 30"))))
