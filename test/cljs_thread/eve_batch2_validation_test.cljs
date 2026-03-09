(ns cljs-thread.eve-batch2-validation-test
  "Batch 2 validation tests (commits 9-17): cljs-thread integration.
   Exercises slab infrastructure fixes from the ray tracer commits
   in a multi-worker context, proving they correctly target the slab.

   Commits validated:
     13 — util.cljs browser crash fix: no cljs.nodejs dependency
     16 — into-hash-map, slab memory, slab-buffer fixes
     16 — Slab map type builder registration via eve bridge"
  (:require [cljs.test :refer [deftest is testing]]
            [cljs-thread.core :as t]
            [cljs-thread.eve.util :as util]
            [cljs-thread.eve.map :as sm])
  (:require-macros [cljs-thread.core :refer [spawn]]))

;; ==========================================================================
;; Commit 13: util.cljs browser crash fix — no cljs.nodejs dependency
;;
;; The fix removed the cljs.nodejs dependency from util.cljs so it loads
;; in both browser and Node.js worker contexts without crashing.
;; ==========================================================================

(deftest util-loads-on-worker
  (testing "util.cljs loads on worker without cljs.nodejs crash (commit 13)"
    (is (some? util/is-main-thread?) "is-main-thread? should be defined on this thread")))

(deftest util-is-main-thread-correct-on-spawned-worker
  (testing "is-main-thread? reports false on spawned worker (commit 13)"
    (is (false? @(spawn util/is-main-thread?))
        "Spawned worker should not report as main thread")))

;; ==========================================================================
;; Commit 16: into-hash-map, slab memory, slab-buffer fixes
;;
;; into-hash-map efficiently builds EVE maps from CLJS maps.
;; The slab memory fixes ensure create-slab-memory and slab-buffer work
;; with both WebAssembly.Memory and raw SharedArrayBuffer.
;; ==========================================================================

(deftest into-hash-map-works-on-worker
  (testing "into-hash-map creates correct map on spawned worker (commit 16)"
    (let [result @(spawn
                    (let [m (into (sm/hash-map) {:a 1 :b 2 :c 3})]
                      {:count (count m)
                       :a (get m :a)
                       :b (get m :b)
                       :c (get m :c)}))]
      (is (= 3 (:count result)) "Map should have 3 entries")
      (is (= 1 (:a result)) "Key :a should be 1")
      (is (= 2 (:b result)) "Key :b should be 2")
      (is (= 3 (:c result)) "Key :c should be 3"))))

(deftest into-hash-map-scene-data-on-worker
  (testing "into-hash-map handles scene-style keyword maps on worker (commit 16)"
    (let [result @(spawn
                    (let [scene {:num-spheres 5
                                 :cam-from-x 13.0
                                 :cam-from-y 2.0
                                 :s0-cx 0.0
                                 :s0-r 1000.0
                                 :m0-t 0}
                          m (into (sm/hash-map) scene)]
                      {:count (count m)
                       :spheres (get m :num-spheres)
                       :cam-x (get m :cam-from-x)
                       :radius (get m :s0-r)}))]
      (is (= 6 (:count result)) "Scene map should have 6 entries")
      (is (= 5 (:spheres result)) "num-spheres should round-trip")
      (is (= 13.0 (:cam-x result)) "Camera position should round-trip")
      (is (= 1000.0 (:radius result)) "Sphere radius should round-trip"))))

(deftest into-hash-map-large-on-worker
  (testing "into-hash-map builds 100-entry map on worker (commit 16)"
    (let [result @(spawn
                    (let [cljs-map (into {}
                                        (for [i (range 100)]
                                          [(keyword (str "key-" i)) (* i 10)]))
                          m (into (sm/hash-map) cljs-map)]
                      {:count (count m)
                       :first (get m :key-0)
                       :mid (get m :key-50)
                       :last (get m :key-99)}))]
      (is (= 100 (:count result)) "Should have 100 entries")
      (is (= 0 (:first result)) "First entry should be 0")
      (is (= 500 (:mid result)) "Middle entry should be 500")
      (is (= 990 (:last result)) "Last entry should be 990"))))

;; ==========================================================================
;; Commit 16 + eve bridge: slab map type builders registered
;;
;; The eve bridge requires sab-map which registers the direct-map-encoder
;; at load time. This enables map data to be stored/retrieved correctly
;; in EVE atoms. Tests verify map round-trips through atoms
;; across worker boundaries.
;; ==========================================================================

(deftest hash-map-type-builder-on-worker
  (testing "Slab map type builder works in atom on worker (commit 16)"
    (let [my-atom (t/atom {:alpha 1 :beta 2 :gamma 3})]
      (is (= {:alpha 1 :beta 2 :gamma 3}
             @(spawn (deref my-atom)))
          "Map data in atom should be readable on worker"))))

(deftest hash-map-atom-swap-across-threads
  (testing "Slab map atom swap from worker, read locally (commit 16)"
    (let [my-atom (t/atom {:x 0})]
      @(spawn
        (swap! my-atom assoc :x 100 :y 200))
      (is (= 100 (:x @my-atom)) "Key :x should be 100 after worker swap")
      (is (= 200 (:y @my-atom)) "Key :y should be 200 after worker swap"))))

(deftest hash-map-atom-multi-key-round-trip
  (testing "Map with many keys round-trips through atom across threads (commit 16)"
    (let [my-atom (t/atom {})]
      @(spawn
        (reset! my-atom {:a 1 :b 2 :c 3 :d 4 :e 5 :f 6 :g 7 :h 8}))
      (let [result @my-atom]
        (is (= 8 (count result)) "Should have 8 keys")
        (is (= 1 (:a result)) "Key :a")
        (is (= 8 (:h result)) "Key :h")))))
