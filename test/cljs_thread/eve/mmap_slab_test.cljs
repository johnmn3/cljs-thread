(ns cljs-thread.eve.mmap-slab-test
  "Tests for mmap-backed slab instances (Phase 3).
   Exercises register-mmap-slab-instance!, init-mmap-slab!, open-mmap-slab!.
   NO namespace-level side effects — init-mmap-slab! is called in run-mmap-slab!
   (runner), not here, to avoid clobbering the class-5 instance for other tests."
  (:require [cljs.test :refer [deftest testing is]]
            [cljs-thread.eve.mem :as mem]
            [cljs-thread.eve.deftype-proto.wasm :as wasm]
            [cljs-thread.eve.deftype-proto.data :as d]
            [cljs-thread.eve.deftype-proto.alloc :as alloc]))

(def ^:private test-path "/tmp/eve-p3-cls5.mem")

;;=============================================================================
;; Step 3.3: register-mmap-slab-instance!
;;=============================================================================

(deftest test-register-mmap-slab-instance
  (testing "class-5 instance has :region, :u8, :dv; no :i32"
    (let [inst (wasm/get-slab-instance 5)]
      (is (some? inst) "instance exists")
      (is (some? (:region inst)) ":region present")
      (is (some? (:u8 inst)) ":u8 present")
      (is (some? (:dv inst)) ":dv present")
      (is (nil? (:i32 inst)) ":i32 absent")
      (is (nil? (:exports inst)) ":exports nil (no WASM)"))))

;;=============================================================================
;; Header validation
;;=============================================================================

(deftest test-mmap-slab-header
  (testing "slab header fields are correct for class 5"
    (let [inst   (wasm/get-slab-instance 5)
          region (:region inst)]
      (is (== d/SLAB_MAGIC   (mem/load-i32 region d/SLAB_HDR_MAGIC))      "magic")
      (is (== 1024           (mem/load-i32 region d/SLAB_HDR_BLOCK_SIZE)) "block-size")
      (is (== 5              (mem/load-i32 region d/SLAB_HDR_CLASS_IDX))  "class-idx"))))

;;=============================================================================
;; Alloc / free mechanics
;;=============================================================================

(deftest test-mmap-slab-alloc-returns-class5-offset
  (testing "alloc-offset returns a class-5 slab-qualified offset"
    (let [slot (alloc/alloc-offset 1024)]
      (is (== 5 (alloc/decode-class-idx slot)) "class-idx == 5")
      (alloc/free! slot))))

(deftest test-mmap-slab-alloc-distinct
  (testing "two consecutive allocs return different block indices"
    (let [s1 (alloc/alloc-offset 1024)
          s2 (alloc/alloc-offset 1024)]
      (is (not (== s1 s2)) "distinct offsets")
      (alloc/free! s1)
      (alloc/free! s2))))

(deftest test-mmap-slab-free-count
  (testing "free count decrements on alloc, restores on free"
    (let [inst    (wasm/get-slab-instance 5)
          region  (:region inst)
          before  (mem/load-i32 region d/SLAB_HDR_FREE_COUNT)
          slot    (alloc/alloc-offset 1024)
          after   (mem/load-i32 region d/SLAB_HDR_FREE_COUNT)]
      (is (== (dec before) after) "decremented by 1 after alloc")
      (alloc/free! slot)
      (is (== before (mem/load-i32 region d/SLAB_HDR_FREE_COUNT)) "restored after free"))))

(deftest test-mmap-slab-double-free
  (testing "double-free returns false"
    (let [slot (alloc/alloc-offset 1024)]
      (is (true?  (alloc/free! slot)) "first free succeeds")
      (is (false? (alloc/free! slot)) "double-free returns false"))))

;;=============================================================================
;; Data read / write
;;=============================================================================

(deftest test-mmap-slab-data-write-read
  (testing "write-bytes! / read-bytes roundtrip"
    (let [slot (alloc/alloc-offset 1024)
          src  (js/Uint8Array.from #js [1 2 3 4])]
      (alloc/write-bytes! slot 0 src)
      (let [result (alloc/read-bytes slot 0 4)]
        (is (== 1 (aget result 0)))
        (is (== 2 (aget result 1)))
        (is (== 3 (aget result 2)))
        (is (== 4 (aget result 3))))
      (alloc/free! slot))))

(deftest test-mmap-slab-read-write-i32
  (testing "write-i32! / read-i32 roundtrip"
    (let [slot (alloc/alloc-offset 1024)
          val  0x12345678]
      (alloc/write-i32! slot 0 val)
      (is (== val (alloc/read-i32 slot 0)))
      (alloc/free! slot))))

;;=============================================================================
;; open-mmap-slab!
;;=============================================================================

(deftest test-mmap-slab-open
  (testing "open-mmap-slab! reopens file and produces valid instance"
    (let [inst (alloc/open-mmap-slab! 5 test-path)]
      (is (some? inst) "instance non-nil")
      (is (some? (:region inst)) ":region present")
      (let [region (:region inst)]
        (is (== d/SLAB_MAGIC (mem/load-i32 region d/SLAB_HDR_MAGIC)) "magic valid")
        (is (== 1024         (mem/load-i32 region d/SLAB_HDR_BLOCK_SIZE)) "block-size 1024")
        (is (== 5            (mem/load-i32 region d/SLAB_HDR_CLASS_IDX)) "class-idx 5")))))

(deftest test-mmap-slab-persistence
  (testing "allocation is visible after reopening the slab file"
    (let [slot      (alloc/alloc-offset 1024)
          block-idx (alloc/decode-block-idx slot)
          inst2     (alloc/open-mmap-slab! 5 test-path)
          region2   (:region inst2)
          bm-off    (mem/load-i32 region2 d/SLAB_HDR_BITMAP_OFFSET)
          total     (mem/load-i32 region2 d/SLAB_HDR_TOTAL_BLOCKS)
          ;; Find the first free slot in the reopened region — should be after our alloc
          next-free (mem/imr-bitmap-find-free region2 bm-off total (inc block-idx))]
      (is (> next-free block-idx) "next free block is after our allocated block")
      (alloc/free! slot))))
