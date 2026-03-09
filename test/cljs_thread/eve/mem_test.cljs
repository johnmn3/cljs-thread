(ns cljs-thread.eve.mem-test
  "Unit tests for IMemRegion implementations available in CLJS.
   Tests JsSabRegion (SAB + Atomics). NodeMmapRegion requires the native
   addon (Phase 2). JvmMmapRegion/JvmHeapRegion require JVM runner."
  (:require [cljs.test :refer [deftest testing is]]
            [cljs-thread.eve.mem :as mem]))

(deftest test-byte-length
  (testing "byte-length matches size passed to constructor"
    (is (= 1024 (mem/-byte-length (mem/make-js-sab-region 1024))))
    (is (= 4096 (mem/-byte-length (mem/make-js-sab-region 4096))))
    (is (= 0    (mem/-byte-length (mem/make-js-sab-region 0))))))

(deftest test-load-store-i32
  (testing "store and load round-trip"
    (let [r (mem/make-js-sab-region 64)]
      (mem/store-i32! r 0 42)
      (is (= 42 (mem/load-i32 r 0)))))
  (testing "offsets are independent"
    (let [r (mem/make-js-sab-region 64)]
      (mem/store-i32! r 0 1)
      (mem/store-i32! r 4 2)
      (is (= 1 (mem/load-i32 r 0)))
      (is (= 2 (mem/load-i32 r 4)))))
  (testing "max int32 value"
    (let [r (mem/make-js-sab-region 64)]
      (mem/store-i32! r 0 2147483647)
      (is (= 2147483647 (mem/load-i32 r 0)))))
  (testing "signed i32 wrapping: -1"
    (let [r (mem/make-js-sab-region 64)]
      (mem/store-i32! r 0 -1)
      (is (= -1 (mem/load-i32 r 0))))))

(deftest test-cas-i32
  (testing "CAS succeeds when expected matches — returns old value"
    (let [r (mem/make-js-sab-region 64)]
      (mem/store-i32! r 0 10)
      (let [old (mem/cas-i32! r 0 10 20)]
        (is (= 10 old))
        (is (= 20 (mem/load-i32 r 0))))))
  (testing "CAS fails when expected does not match — returns current value"
    (let [r (mem/make-js-sab-region 64)]
      (mem/store-i32! r 0 10)
      (let [old (mem/cas-i32! r 0 99 20)]
        (is (= 10 old))
        (is (= 10 (mem/load-i32 r 0))))))
  (testing "two sequential CAS loops converge"
    (let [r (mem/make-js-sab-region 64)]
      (mem/store-i32! r 0 0)
      ;; CAS loop: increment from 0 to 1
      (loop []
        (let [old (mem/load-i32 r 0)
              ret (mem/cas-i32! r 0 old (inc old))]
          (when (not= ret old) (recur))))
      (is (= 1 (mem/load-i32 r 0))))))

(deftest test-add-sub-i32
  (testing "add-i32! returns old value; memory holds new value"
    (let [r (mem/make-js-sab-region 64)]
      (mem/store-i32! r 0 0)
      (is (= 0 (mem/add-i32! r 0 1)))
      (is (= 1 (mem/load-i32 r 0)))))
  (testing "add negative delta"
    (let [r (mem/make-js-sab-region 64)]
      (mem/store-i32! r 0 1)
      (is (= 1 (mem/add-i32! r 0 -1)))
      (is (= 0 (mem/load-i32 r 0)))))
  (testing "sub-i32! returns old value; memory holds new value"
    (let [r (mem/make-js-sab-region 64)]
      (mem/store-i32! r 0 5)
      (is (= 5 (mem/sub-i32! r 0 1)))
      (is (= 4 (mem/load-i32 r 0))))))

(deftest test-exchange-i32
  (testing "exchange stores new value, returns old"
    (let [r (mem/make-js-sab-region 64)]
      (mem/store-i32! r 0 42)
      (is (= 42 (mem/exchange-i32! r 0 99)))
      (is (= 99 (mem/load-i32 r 0))))))

(deftest test-wait-i32
  (testing "wait returns :not-equal immediately when current != expected"
    (let [r (mem/make-js-sab-region 64)]
      (mem/store-i32! r 0 7)
      (is (= :not-equal (mem/wait-i32! r 0 99 1000)))))
  (testing "wait returns :timed-out on 0ms timeout when current == expected"
    (let [r (mem/make-js-sab-region 64)]
      (mem/store-i32! r 0 42)
      (is (= :timed-out (mem/wait-i32! r 0 42 0))))))

(deftest test-supports-watch
  (testing "JsSabRegion returns true for supports-watch?"
    (is (true? (mem/supports-watch? (mem/make-js-sab-region 64))))))

(deftest test-read-write-bytes
  (testing "byte round-trip at offset 8"
    (let [r   (mem/make-js-sab-region 64)
          src (js/Uint8Array. (clj->js [1 2 3 4]))]
      (mem/write-bytes! r 8 src)
      (let [out (mem/read-bytes r 8 4)]
        (is (= [1 2 3 4] (vec out))))))
  (testing "two non-overlapping writes are independent"
    (let [r    (mem/make-js-sab-region 64)
          src1 (js/Uint8Array. (clj->js [10 11]))
          src2 (js/Uint8Array. (clj->js [20 21]))]
      (mem/write-bytes! r 16 src1)
      (mem/write-bytes! r 20 src2)
      (is (= [10 11] (vec (mem/read-bytes r 16 2))))
      (is (= [20 21] (vec (mem/read-bytes r 20 2))))))
  (testing "i32-aligned writes at 0 and 4 do not corrupt each other"
    (let [r    (mem/make-js-sab-region 64)
          src0 (js/Uint8Array. (clj->js [1 0 0 0]))
          src4 (js/Uint8Array. (clj->js [2 0 0 0]))]
      (mem/write-bytes! r 0 src0)
      (mem/write-bytes! r 4 src4)
      (is (= [1 0 0 0] (vec (mem/read-bytes r 0 4))))
      (is (= [2 0 0 0] (vec (mem/read-bytes r 4 4)))))))

(deftest test-bitmap-ops
  (testing "find-free on fresh region returns 0"
    (let [r (mem/make-js-sab-region 64)]
      (is (= 0 (mem/imr-bitmap-find-free r 0 32 0)))))
  (testing "alloc-cas! marks bit; find-free then returns next bit"
    (let [r (mem/make-js-sab-region 64)]
      (is (true? (mem/imr-bitmap-alloc-cas! r 0 0)))
      (is (= 1 (mem/imr-bitmap-find-free r 0 32 0)))))
  (testing "free! clears bit; find-free returns it again"
    (let [r (mem/make-js-sab-region 64)]
      (mem/imr-bitmap-alloc-cas! r 0 0)
      (is (true? (mem/imr-bitmap-free! r 0 0)))
      (is (= 0 (mem/imr-bitmap-find-free r 0 32 0)))))
  (testing "find-free on full bitmap returns -1"
    (let [r (mem/make-js-sab-region 64)]
      ;; Fill all 4 bits (total-bits=4, one word)
      (doseq [i (range 4)]
        (mem/imr-bitmap-alloc-cas! r 0 i))
      (is (= -1 (mem/imr-bitmap-find-free r 0 4 0))))))
