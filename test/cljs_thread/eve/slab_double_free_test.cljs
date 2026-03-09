(ns cljs-thread.eve.slab-double-free-test
  "Test to reproduce and catch slab allocator double-free bug.

   The bug (now fixed): bitmap_free didn't check if bit was already clear,
   but free! always incremented free-count. This caused free-count
   to exceed total-blocks when blocks were freed multiple times.

   The fix: bitmap_free now returns 1 if bit was set (valid free),
   0 if already clear (double-free). free! only increments free-count
   when the return is 1.

   Runtime detection: When xray pool tracking is enabled, double-free
   attempts throw immediately via the recycle-hook."
  (:require [cljs.test :refer [deftest testing is async use-fixtures]]
            [cljs-thread.eve.deftype-proto.alloc :as alloc]
            [cljs-thread.eve.deftype-proto.xray :as xray]
            [cljs-thread.eve.deftype-proto.data :as d]))

(defn get-slab-stats
  "Get stats for a specific slab class."
  [class-idx]
  (alloc/slab-stats class-idx))

(deftest test-free-count-invariant
  (testing "free-count should never exceed total-blocks"
    ;; Get initial stats for class 2 (128-byte blocks)
    (let [initial (get-slab-stats 2)
          total (:total-blocks initial)
          initial-free (:free-count initial)]

      (is (<= initial-free total)
          (str "Initial state: free-count " initial-free
               " should be <= total-blocks " total))

      ;; Allocate a block
      (let [offset (:offset (alloc/alloc 128))]
        (is (some? offset) "Should allocate successfully")

        (let [after-alloc (get-slab-stats 2)]
          (is (= (:free-count after-alloc) (dec initial-free))
              "Free count should decrease by 1 after allocation")

          ;; Free the block once - should work and return true
          (let [freed? (alloc/free! offset)]
            (is (true? freed?) "First free should return true")

            (let [after-free (get-slab-stats 2)]
              (is (= (:free-count after-free) initial-free)
                  "Free count should return to initial after free")

              ;; Free the SAME block again - should return false (no-op)
              (let [double-freed? (alloc/free! offset)]
                (is (false? double-freed?) "Second free should return false (double-free detected)")

                (let [after-double-free (get-slab-stats 2)]
                  ;; With the fix: free-count should NOT have increased
                  (is (<= (:free-count after-double-free) total)
                      (str "free-count " (:free-count after-double-free)
                           " should be <= total-blocks " total))

                  ;; The invariant that should hold
                  (is (= (:free-count after-double-free) initial-free)
                      (str "After double-free, free-count should still be " initial-free
                           " but is " (:free-count after-double-free))))))))))))

(deftest test-xray-validates-clean-state
  (testing "xray should pass after valid alloc/free cycles"
    ;; Allocate and free properly - xray should always pass
    (let [offset (:offset (alloc/alloc 128))]

      ;; Valid state - xray should pass
      (let [result (xray/slab-xray-scan "after-alloc")]
        (is (:valid? result) "xray should pass after valid allocation"))

      ;; Free once - still valid
      (alloc/free! offset)
      (let [result (xray/slab-xray-scan "after-first-free")]
        (is (:valid? result) "xray should pass after valid free"))

      ;; Double-free - with fix, bitmap state remains valid
      ;; free! returns false but doesn't corrupt state
      (alloc/free! offset)

      ;; xray should still pass because free-count wasn't corrupted
      (let [result (xray/slab-xray-scan "after-double-free-attempt")]
        (is (:valid? result)
            (str "xray should pass - free-count not corrupted. "
                 "Errors: " (pr-str (:all-errors result))))))))

(deftest test-xray-pool-tracking-catches-double-free
  (testing "xray pool tracking throws on double-free attempt"
    ;; Enable pool tracking (requires DIAGNOSTICS=true at compile time)
    (xray/enable-pool-tracking!)

    (try
      (let [offset (:offset (alloc/alloc 64))]
        (is (some? offset) "Should allocate successfully")

        ;; First free - should work
        (alloc/free! offset)

        ;; Second free - should throw because xray detects it's not in-use
        (let [threw? (atom false)]
          (try
            (alloc/free! offset)
            (catch :default e
              (reset! threw? true)
              (is (re-find #"Double recycle" (.-message e))
                  (str "Should throw double-recycle error, got: " (.-message e)))))

          ;; If pool tracking is enabled (DIAGNOSTICS=true), it should throw
          ;; If DIAGNOSTICS=false, threw? will be false (no-op)
          (when (xray/pool-tracking-enabled?)
            (is @threw? "Pool tracking should catch double-free"))))

      (finally
        (xray/disable-pool-tracking!)))))

(deftest test-repeated-alloc-free-dont-corrupt
  (testing "Many alloc/free cycles should not corrupt slab free-counts"
    ;; This simulates what happens in the raytracer with frequent swaps
    (let [initial-stats (alloc/all-slab-stats)]

      ;; Verify initial state is sane
      (doseq [[class-idx stats] initial-stats]
        (is (<= (:free-count stats) (:total-blocks stats))
            (str "Initial: class " class-idx " free-count " (:free-count stats)
                 " should be <= total " (:total-blocks stats))))

      ;; Do many allocations and frees (simulating map updates)
      (dotimes [_ 100]
        (let [result (alloc/alloc 64)
              offset (:offset result)]
          (when offset
            (alloc/free! offset))))

      ;; Check that free-counts are still valid
      (let [final-stats (alloc/all-slab-stats)]
        (doseq [[class-idx stats] final-stats]
          (is (<= (:free-count stats) (:total-blocks stats))
              (str "After ops: class " class-idx " free-count " (:free-count stats)
                   " should be <= total " (:total-blocks stats))))))))

(deftest test-alloc-free-return-values
  (testing "alloc returns offset, free! returns boolean"
    (let [result (alloc/alloc 32)
          offset (:offset result)]
      (is (number? offset) "alloc should return map with :offset")
      (is (not= offset -1) "offset should not be NIL")

      ;; First free returns true
      (let [freed1? (alloc/free! offset)]
        (is (true? freed1?) "First free should return true"))

      ;; Second free returns false (already freed)
      (let [freed2? (alloc/free! offset)]
        (is (false? freed2?) "Second free should return false")))))
