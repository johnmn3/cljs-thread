(ns cljs-thread.eve.batch2-validation-test
  "Validation tests for batch 2 cherry-picks (commits 9-17).
   Proves each fix correctly targets the slab implementation."
  (:require
   [cljs.test :refer-macros [deftest testing is]]
   [cljs-thread.eve.deftype-proto.wasm :as wasm]
   [cljs-thread.eve.map :as sm]
   [cljs-thread.eve.util :as util]))

;;-----------------------------------------------------------------------------
;; Commit 13: util.cljs browser crash fix — no cljs.nodejs dependency
;;-----------------------------------------------------------------------------

(deftest util-no-cljs-nodejs-test
  (testing "util.cljs loads without cljs.nodejs (commit 13)"
    ;; If we got here, util loaded successfully — no ReferenceError from require
    (is (some? util/is-main-thread?) "is-main-thread? should be defined")
    (is (true? util/is-main-thread?) "Main Node.js process should be main thread")))

;;-----------------------------------------------------------------------------
;; Commit 16a: WebAssembly.Memory fallback in create-slab-memory
;;-----------------------------------------------------------------------------

(deftest create-slab-memory-returns-usable-buffer-test
  (testing "create-slab-memory returns usable memory (commit 16)"
    (let [total-bytes (* 64 1024)  ;; 64KB
          mem (wasm/create-slab-memory total-bytes)]
      ;; Should return either WebAssembly.Memory or SharedArrayBuffer
      (is (or (instance? js/SharedArrayBuffer mem)
              (some? (.-buffer mem)))
          "create-slab-memory should return Memory or SAB")
      ;; Extract the buffer
      (let [buf (if (instance? js/SharedArrayBuffer mem)
                  mem
                  (.-buffer mem))]
        (is (instance? js/SharedArrayBuffer buf)
            "Extracted buffer should be a SharedArrayBuffer")
        (is (>= (.-byteLength buf) total-bytes)
            "Buffer should be at least as large as requested")
        ;; Should be able to create typed views
        (let [i32 (js/Int32Array. buf)
              u8  (js/Uint8Array. buf)]
          (is (> (.-length i32) 0) "Int32Array view should be non-empty")
          (is (> (.-length u8) 0) "Uint8Array view should be non-empty")
          ;; Should support Atomics (proving it's a SharedArrayBuffer)
          (js/Atomics.store i32 0 42)
          (is (= 42 (js/Atomics.load i32 0))
              "Atomics should work on the buffer"))))))

;;-----------------------------------------------------------------------------
;; Commit 16b: Slab initialization handles both Memory and SAB
;;-----------------------------------------------------------------------------

(deftest slab-init-handles-memory-types-test
  (testing "Slab init works with create-slab-memory output (commit 16)"
    ;; After init!, each class should have a working instance
    (doseq [class-idx (range 6)]  ;; Classes 0-5
      (let [instance (wasm/get-slab-instance class-idx)]
        (is (some? instance)
            (str "Slab class " class-idx " should be initialized"))
        (when instance
          (is (some? (:region instance))
              (str "Slab class " class-idx " should have :region (IMemRegion)"))
          (is (nil? (:i32 instance))
              (str "Slab class " class-idx " should not have :i32 (removed in Phase 3)"))
          (is (some? (:u8 instance))
              (str "Slab class " class-idx " should have u8 view"))
          ;; Verify the buffer is a SharedArrayBuffer
          (let [mem (:memory instance)
                buf (if (instance? js/SharedArrayBuffer mem)
                      mem
                      (.-buffer mem))]
            (is (instance? js/SharedArrayBuffer buf)
                (str "Slab class " class-idx " buffer should be SAB"))))))))

;;-----------------------------------------------------------------------------
;; Commit 16c: slab-buffer handles both Memory and SAB
;;-----------------------------------------------------------------------------

(deftest slab-buffer-extraction-test
  (testing "slab-buffer correctly extracts SAB from any memory type (commit 16)"
    (doseq [class-idx (range 6)]
      (let [buf (wasm/slab-buffer class-idx)]
        (is (instance? js/SharedArrayBuffer buf)
            (str "slab-buffer for class " class-idx " should return SAB"))
        (is (> (.-byteLength buf) 0)
            (str "slab-buffer for class " class-idx " should have non-zero size"))))))

;;-----------------------------------------------------------------------------
;; Commit 16e: into-hash-map efficiency (used by slab_scene.cljs)
;;-----------------------------------------------------------------------------

(deftest into-hash-map-from-cljs-map-test
  (testing "into-hash-map builds efficiently from CLJS map (commit 16)"
    ;; Simulates what slab_scene.cljs does: build a large CLJS map, then
    ;; convert to slab map in one shot
    (let [cljs-map (into {}
                         (for [i (range 100)]
                           [(keyword (str "key-" i)) (* i 10)]))
          hash-map (into (sm/hash-map) cljs-map)]
      (is (= 100 (count hash-map))
          "Slab map should have 100 entries")
      ;; Verify random access works
      (is (= 0 (get hash-map :key-0))
          "First entry should be accessible")
      (is (= 500 (get hash-map :key-50))
          "Middle entry should be accessible")
      (is (= 990 (get hash-map :key-99))
          "Last entry should be accessible"))))

(deftest into-hash-map-scene-like-data-test
  (testing "into-hash-map handles scene-style keyword maps (commit 16)"
    ;; Scene data similar to what the ray tracer builds
    (let [scene-data {:num-spheres 5
                      :num-materials 3
                      :cam-from-x 13.0 :cam-from-y 2.0 :cam-from-z 3.0
                      :cam-at-x 0.0 :cam-at-y 0.0 :cam-at-z 0.0
                      :s0-cx 0.0 :s0-cy -1000.0 :s0-cz 0.0 :s0-r 1000.0 :s0-m 0
                      :s1-cx 0.0 :s1-cy 1.0 :s1-cz 0.0 :s1-r 1.0 :s1-m 1
                      :m0-t 0 :m0-r 0.5 :m0-g 0.5 :m0-b 0.5 :m0-p 0.0
                      :m1-t 1 :m1-r 0.7 :m1-g 0.3 :m1-b 0.3 :m1-p 0.0}
          hash-map (into (sm/hash-map) scene-data)]
      (is (= (count scene-data) (count hash-map))
          "All scene entries should be present")
      (is (= 5 (get hash-map :num-spheres))
          "num-spheres should be retrievable")
      (is (= 13.0 (get hash-map :cam-from-x))
          "Camera position should round-trip")
      (is (= 1000.0 (get hash-map :s0-r))
          "Sphere radius should round-trip")
      (is (= 1 (get hash-map :m1-t))
          "Material type should round-trip"))))

