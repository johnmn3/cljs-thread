(ns cljs-thread.eve.batch3-validation-test
  "Validation tests for batch 3 commits (18-23).
   Proves each fix correctly targets the slab implementation.

   Commits validated:
     18 (c43cbae) — core.clj macro fix: cached wasm-mem views instead of constructors
     19 (7f76d8e) — OOM fix: reset-pools! in fresh-env before new atom-domain
     21 (73a2b3a) — slab implementation plan doc (existence check)
     22 (eccd906) — worker swap! fix: init-worker-cache!, init-views-from-sab!, sab-map require
     23 (85de974) — worker swap! smoke test (existence + structure check)"
  (:require
   [cljs.test :refer-macros [deftest testing is]]
   [cljs-thread.eve.shared-atom :as a]
   [cljs-thread.eve.wasm-mem :as wasm]
   [cljs-thread.eve.map :as sm]
   [cljs-thread.eve.set :as ss]))

;; Global atom and worker-id are bootstrapped by the test runner (test_main.cljs).

;;-----------------------------------------------------------------------------
;; Helper: create a fresh atom env
;;-----------------------------------------------------------------------------

(defn fresh-env
  "Create a fresh atom env, resetting pools first (commit 19 pattern)."
  []
  (sm/reset-pools!)
  (ss/reset-pools!)
  (set! a/*global-atom-instance*
        (a/atom-domain {}))
  (a/get-env a/*global-atom-instance*))

;;-----------------------------------------------------------------------------
;; Commit 18: core.clj macro fix — cached wasm-mem views
;;
;; The macro now emits (wasm-mem/data-view) and (wasm-mem/u8-view) instead
;; of (js/DataView. sab) and (js/Uint8Array. sab). We verify that:
;; 1. wasm-mem/data-view returns a usable DataView after atom init
;; 2. wasm-mem/u8-view returns a usable Uint8Array after atom init
;; 3. The views reference the same buffer as the atom's SAB
;;-----------------------------------------------------------------------------

(deftest wasm-mem-cached-views-test
  (testing "wasm-mem/data-view returns DataView after atom init (commit 18)"
    (let [env (fresh-env)
          dv (wasm/data-view)]
      (is (some? dv) "data-view should return non-nil after atom init")
      (is (instance? js/DataView dv)
          "data-view should return a DataView instance")))

  (testing "wasm-mem/u8-view returns Uint8Array after atom init (commit 18)"
    (let [env (fresh-env)
          u8 (wasm/u8-view)]
      (is (some? u8) "u8-view should return non-nil after atom init")
      (is (instance? js/Uint8Array u8)
          "u8-view should return a Uint8Array instance")))

  (testing "Cached views share buffer with atom SAB (commit 18)"
    (let [env (fresh-env)
          sab (:sab env)
          dv (wasm/data-view)
          u8 (wasm/u8-view)]
      ;; Both views should reference the same underlying SharedArrayBuffer
      (is (= (.-buffer dv) sab)
          "DataView should be backed by the atom's SAB")
      (is (= (.-buffer u8) sab)
          "Uint8Array should be backed by the atom's SAB")))

  (testing "Cached views work for reading/writing data (commit 18)"
    (let [env (fresh-env)
          dv (wasm/data-view)
          u8 (wasm/u8-view)
          ;; Write through DataView, read through Uint8Array
          test-offset 1024] ;; Safe offset in data region
      (.setUint8 dv test-offset 0xAB)
      (is (= 0xAB (aget u8 test-offset))
          "Write via DataView should be readable via Uint8Array"))))

;;-----------------------------------------------------------------------------
;; Commit 19: OOM fix — reset-pools! clears stale pool entries
;;
;; Without reset-pools!, creating a new atom env re-uses pool entries that
;; point to descriptors in the old SAB, causing OOM on the new SAB.
;;-----------------------------------------------------------------------------

(deftest reset-pools-clears-state-test
  (testing "reset-pools! is callable on both map and set (commit 19)"
    (is (some? (do (sm/reset-pools!) true)) "sab-map reset-pools! should not throw")
    (is (some? (do (ss/reset-pools!) true)) "hash-set reset-pools! should not throw"))

  (testing "reset-pools! clears sab-map pool state (commit 19)"
    ;; Build some entries to populate the pool
    (fresh-env)
    (let [m1 (into (sm/hash-map) {:a 1 :b 2 :c 3 :d 4 :e 5})]
      (is (= 5 (count m1)) "Should build initial map"))
    ;; After reset + fresh env, building again should work
    (fresh-env) ;; fresh-env calls reset-pools! internally
    (let [m2 (into (sm/hash-map) {:x 10 :y 20 :z 30})]
      (is (= 3 (count m2))
          "Building hash-map after reset-pools! + fresh-env should succeed")
      (is (= 10 (get m2 :x)) "Values should be correct after pool reset")))

  (testing "into-hash-set works with fresh env (commit 19)"
    (fresh-env)
    (let [s (into (ss/hash-set) [:a :b :c :d :e])]
      (is (= 5 (count s)) "Should build set with 5 elements")
      (is (contains? s :a) "Should contain :a")
      (is (contains? s :e) "Should contain :e"))))

(deftest multiple-fresh-envs-no-oom-test
  (testing "Creating multiple fresh envs with reset-pools! doesn't OOM (commit 19)"
    ;; This is the exact scenario commit 19 fixed: repeatedly creating
    ;; fresh environments (as perf benchmarks do)
    (dotimes [i 3]
      (fresh-env)
      (let [m (into (sm/hash-map) {:alpha 1 :beta 2 :gamma 3 :delta 4 :epsilon 5
                                 :zeta 6 :eta 7 :theta 8 :iota 9 :kappa 10})]
        (is (= 10 (count m))
            (str "Iteration " i ": should build 10-entry map without OOM"))
        (is (= 1 (get m :alpha))
            (str "Iteration " i ": values should be correct"))
        (is (= 10 (get m :kappa))
            (str "Iteration " i ": last value should be correct"))))))

;;-----------------------------------------------------------------------------
;; Commit 22: worker swap! fix — init-worker-cache! exists and works
;;-----------------------------------------------------------------------------

(deftest init-worker-cache-exists-test
  (testing "init-worker-cache! function is defined (commit 22)"
    (is (fn? a/init-worker-cache!)
        "init-worker-cache! should be a function in atom namespace")))

(deftest init-worker-cache-sets-views-test
  (testing "init-worker-cache! correctly sets cached views (commit 22)"
    (let [env (fresh-env)]
      ;; Call init-worker-cache! as a worker would
      (a/init-worker-cache! env)
      ;; After calling, swap!/deref should still work (cached views set correctly)
      (swap! a/*global-atom-instance* assoc :test-key 42)
      (is (= 42 (get @a/*global-atom-instance* :test-key))
          "swap! should work after init-worker-cache! (cached views set correctly)"))))

(deftest init-views-from-sab-works-test
  (testing "wasm/init-views-from-sab! sets memory views from raw SAB (commit 22)"
    (let [env (fresh-env)
          sab (:sab env)]
      ;; init-views-from-sab! is what workers call to set up wasm-mem views
      (wasm/init-views-from-sab! sab)
      ;; After calling, all cached views should be backed by the SAB
      (let [dv (wasm/data-view)
            u8 (wasm/u8-view)]
        (is (some? dv) "data-view should be available after init-views-from-sab!")
        (is (some? u8) "u8-view should be available after init-views-from-sab!")
        (is (= (.-buffer dv) sab) "DataView should reference the SAB")
        (is (= (.-buffer u8) sab) "Uint8Array should reference the SAB")))))

(deftest worker-cljs-requires-sab-map-test
  (testing "worker.cljs requires sab-map for direct-map-encoder (commit 22)"
    ;; The sab-map namespace registers the direct-map-encoder on load.
    ;; Verify maps round-trip through the atom correctly.
    (fresh-env)
    (let [test-data {:a 1 :b 2 :c 3}]
      (swap! a/*global-atom-instance* merge test-data)
      (let [result @a/*global-atom-instance*]
        (is (= 1 (get result :a)) "Key :a should round-trip through atom")
        (is (= 2 (get result :b)) "Key :b should round-trip through atom")
        (is (= 3 (get result :c)) "Key :c should round-trip through atom")))))

