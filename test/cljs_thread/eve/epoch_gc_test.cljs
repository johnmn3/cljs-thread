(ns cljs-thread.eve.epoch-gc-test
  "Tests for the epoch-based cooperative GC infrastructure."
  (:require
   [cljs.test :refer-macros [deftest testing is]]
   [cljs-thread.eve.shared-atom :as atom]
   [cljs-thread.eve.data :as d]))

;;-----------------------------------------------------------------------------
;; Test setup — initialize global atom once
;;-----------------------------------------------------------------------------

(defn get-test-env []
  (atom/get-env atom/*global-atom-instance*))

;;-----------------------------------------------------------------------------
;; Worker Registry Tests
;;-----------------------------------------------------------------------------

(deftest register-worker-test
  (testing "Register a worker and get a slot"
    (let [s-atom-env (get-test-env)
          worker-id 12345
          slot-idx (atom/register-worker! s-atom-env worker-id)]
      (is (some? slot-idx) "Should get a slot index")
      (is (>= slot-idx 0) "Slot index should be non-negative")
      (is (< slot-idx d/MAX_WORKERS) "Slot index should be within bounds")
      ;; Clean up
      (atom/unregister-worker! s-atom-env slot-idx))))

(deftest unregister-worker-test
  (testing "Unregister a worker releases the slot"
    (let [s-atom-env (get-test-env)
          worker-id 54321
          slot-idx (atom/register-worker! s-atom-env worker-id)]
      (is (some? slot-idx))
      ;; Unregister
      (atom/unregister-worker! s-atom-env slot-idx)
      ;; Should be able to re-register in the same slot
      (let [new-slot (atom/register-worker! s-atom-env (inc worker-id))]
        (is (some? new-slot) "Should be able to register after unregister")
        (atom/unregister-worker! s-atom-env new-slot)))))

(deftest heartbeat-update-test
  (testing "Heartbeat updates liveness check"
    (let [s-atom-env (get-test-env)
          worker-id 99999
          slot-idx (atom/register-worker! s-atom-env worker-id)]
      (is (some? slot-idx))
      ;; Worker should be alive after registration (heartbeat was updated)
      (is (atom/check-worker-liveness s-atom-env slot-idx)
          "Worker should be alive immediately after registration")
      ;; Update heartbeat
      (atom/update-heartbeat! s-atom-env slot-idx)
      (is (atom/check-worker-liveness s-atom-env slot-idx)
          "Worker should still be alive after heartbeat update")
      ;; Clean up
      (atom/unregister-worker! s-atom-env slot-idx))))

(deftest multiple-workers-test
  (testing "Multiple workers can register concurrently"
    (let [s-atom-env (get-test-env)
          worker-ids [1001 1002 1003 1004 1005]
          slots (mapv #(atom/register-worker! s-atom-env %) worker-ids)]
      ;; All should get unique slots
      (is (every? some? slots) "All workers should get slots")
      (is (= (count (distinct slots)) (count slots)) "All slots should be unique")
      ;; Clean up
      (doseq [slot slots]
        (atom/unregister-worker! s-atom-env slot)))))

;;-----------------------------------------------------------------------------
;; Epoch Management Tests
;;-----------------------------------------------------------------------------

(deftest get-current-epoch-test
  (testing "Can read current epoch"
    (let [s-atom-env (get-test-env)
          epoch (atom/get-current-epoch s-atom-env)]
      (is (integer? epoch) "Epoch should be an integer")
      (is (>= epoch 1) "Epoch should be at least 1 (initialized in atom-domain)"))))

(deftest increment-epoch-test
  (testing "Incrementing epoch increases value"
    (let [s-atom-env (get-test-env)
          epoch-before (atom/get-current-epoch s-atom-env)
          epoch-after (atom/increment-epoch! s-atom-env)]
      (is (= epoch-after (inc epoch-before))
          "New epoch should be previous + 1")
      (is (= epoch-after (atom/get-current-epoch s-atom-env))
          "Current epoch should match returned value"))))

(deftest begin-end-read-epoch-test
  (testing "Begin/end read epoch lifecycle"
    (let [s-atom-env (get-test-env)
          worker-id 77777
          slot-idx (atom/register-worker! s-atom-env worker-id)]
      (is (some? slot-idx))
      (let [read-epoch (atom/begin-read! s-atom-env slot-idx)]
        (is (pos? read-epoch) "Read epoch should be positive")
        (is (= read-epoch (atom/get-current-epoch s-atom-env))
            "Read epoch should match current epoch")
        ;; End the read
        (atom/end-read-epoch! s-atom-env slot-idx)
        ;; The worker's epoch should be cleared (0)
        )
      (atom/unregister-worker! s-atom-env slot-idx))))

(deftest with-read-epoch-test
  (testing "with-read-epoch executes function and cleans up"
    (let [s-atom-env (get-test-env)
          worker-id 88888
          slot-idx (atom/register-worker! s-atom-env worker-id)
          execution-result (atom nil)]
      (is (some? slot-idx))
      ;; Use with-read-epoch
      (let [result (atom/with-read-epoch s-atom-env slot-idx
                     (fn [epoch]
                       (reset! execution-result epoch)
                       (* epoch 2)))]
        (is (pos? @execution-result) "Function should have been called with epoch")
        (is (= result (* @execution-result 2)) "Should return function result"))
      (atom/unregister-worker! s-atom-env slot-idx))))

(deftest get-min-active-epoch-test
  (testing "Min active epoch reflects reading workers"
    (let [s-atom-env (get-test-env)
          worker1-id 111
          worker2-id 222
          slot1 (atom/register-worker! s-atom-env worker1-id)
          slot2 (atom/register-worker! s-atom-env worker2-id)]
      ;; Initially, no one is reading
      (let [min-before (atom/get-min-active-epoch s-atom-env)]
        ;; min-before could be nil if no workers reading

        ;; Worker 1 starts reading
        (let [epoch1 (atom/begin-read! s-atom-env slot1)]
          ;; Now min should be epoch1
          (let [min-during-read1 (atom/get-min-active-epoch s-atom-env)]
            (is (= min-during-read1 epoch1)
                "Min epoch should be worker1's epoch"))

          ;; Increment global epoch
          (atom/increment-epoch! s-atom-env)

          ;; Worker 2 starts reading (at new epoch)
          (let [epoch2 (atom/begin-read! s-atom-env slot2)]
            (is (> epoch2 epoch1) "Worker2's epoch should be newer")
            ;; Min should still be epoch1 (older reader)
            (let [min-both-reading (atom/get-min-active-epoch s-atom-env)]
              (is (= min-both-reading epoch1)
                  "Min epoch should still be worker1's older epoch"))

            ;; Worker 1 ends reading
            (atom/end-read-epoch! s-atom-env slot1)
            ;; Now min should be epoch2
            (let [min-after-w1-done (atom/get-min-active-epoch s-atom-env)]
              (is (= min-after-w1-done epoch2)
                  "Min epoch should now be worker2's epoch"))

            (atom/end-read-epoch! s-atom-env slot2))))

      (atom/unregister-worker! s-atom-env slot1)
      (atom/unregister-worker! s-atom-env slot2))))

;;-----------------------------------------------------------------------------
;; Block Retirement & Cleanup Tests
;;-----------------------------------------------------------------------------

(deftest retire-block-test
  (testing "Retiring a block marks it with current epoch"
    (let [s-atom-env (get-test-env)
          ;; Allocate a block
          alloc-result (atom/alloc s-atom-env 64)]
      (is (not (:error alloc-result)) "Allocation should succeed")
      (let [desc-idx (:descriptor-idx alloc-result)
            epoch-before (atom/get-current-epoch s-atom-env)]
        ;; Retire the block
        (let [retired? (atom/retire-block! s-atom-env desc-idx)]
          (is retired? "Should successfully retire the block"))
        ;; Block should now be in RETIRED status
        ;; (Testing internal state - optional)
        ))))

(deftest try-free-retired-no-readers-test
  (testing "Free retired block when no readers"
    (let [s-atom-env (get-test-env)
          ;; Allocate and retire a block
          alloc-result (atom/alloc s-atom-env 64)]
      (is (not (:error alloc-result)))
      (let [desc-idx (:descriptor-idx alloc-result)]
        (atom/retire-block! s-atom-env desc-idx)
        ;; Increment epoch to move past the retired epoch
        (atom/increment-epoch! s-atom-env)
        ;; Try to free - should succeed since no readers
        (let [result (atom/try-free-retired! s-atom-env desc-idx)]
          (is (= result :freed) "Should free block with no readers"))))))

(deftest try-free-retired-with-reader-test
  (testing "Cannot free retired block while reader active"
    (let [s-atom-env (get-test-env)
          worker-id 333
          slot-idx (atom/register-worker! s-atom-env worker-id)]
      ;; Allocate a block
      (let [alloc-result (atom/alloc s-atom-env 64)]
        (is (not (:error alloc-result)))
        (let [desc-idx (:descriptor-idx alloc-result)]
          ;; Start a read at current epoch
          (let [read-epoch (atom/begin-read! s-atom-env slot-idx)]
            ;; Retire the block at this epoch
            (atom/retire-block! s-atom-env desc-idx)
            ;; Try to free - should fail because reader is still active
            (let [result (atom/try-free-retired! s-atom-env desc-idx)]
              (is (= result :has-readers)
                  "Should not free block while reader at same epoch"))
            ;; End the read
            (atom/end-read-epoch! s-atom-env slot-idx)
            ;; Advance epoch past the retirement epoch — the GC won't free
            ;; blocks retired at the current epoch (a new reader could start
            ;; at any moment and expect to see them).
            (atom/increment-epoch! s-atom-env)
            ;; Now it should be freeable
            (let [result2 (atom/try-free-retired! s-atom-env desc-idx)]
              (is (= result2 :freed) "Should free after reader ends")))))
      (atom/unregister-worker! s-atom-env slot-idx))))

(deftest sweep-retired-blocks-test
  (testing "Sweep finds and frees retired blocks"
    (let [s-atom-env (get-test-env)
          ;; Allocate several blocks
          allocs (mapv (fn [_] (atom/alloc s-atom-env 32)) (range 5))]
      (is (every? #(not (:error %)) allocs) "All allocations should succeed")
      ;; Retire some blocks
      (doseq [alloc (take 3 allocs)]
        (atom/retire-block! s-atom-env (:descriptor-idx alloc)))
      ;; Increment epoch to make them freeable
      (atom/increment-epoch! s-atom-env)
      (atom/increment-epoch! s-atom-env)
      ;; Sweep
      (let [freed-count (atom/sweep-retired-blocks! s-atom-env)]
        (is (>= freed-count 3) "Should free at least the 3 retired blocks")))))

;;-----------------------------------------------------------------------------
;; Stale Worker Handling Tests
;;-----------------------------------------------------------------------------

(deftest mark-stale-workers-test
  (testing "Stale workers are detected"
    (let [s-atom-env (get-test-env)]
      ;; This test is tricky because we can't easily make a worker stale
      ;; (would require waiting 30s). Just verify the function runs.
      (let [stale-count (atom/mark-stale-workers! s-atom-env)]
        (is (integer? stale-count) "Should return a count")
        (is (>= stale-count 0) "Count should be non-negative")))))

;;-----------------------------------------------------------------------------
;; Integration Tests
;;-----------------------------------------------------------------------------

(deftest gc-lifecycle-integration-test
  (testing "Full GC lifecycle: alloc -> use -> retire -> sweep"
    (let [s-atom-env (get-test-env)
          worker-id 999
          slot-idx (atom/register-worker! s-atom-env worker-id)]
      ;; Allocate a block
      (let [alloc1 (atom/alloc s-atom-env 128)]
        (is (not (:error alloc1)))
        (let [desc-idx (:descriptor-idx alloc1)]
          ;; Use it in a read context
          (atom/with-read-epoch s-atom-env slot-idx
            (fn [_epoch]
              ;; Would read from the block here
              :used))
          ;; Now allocate a replacement (simulating update)
          (let [alloc2 (atom/alloc s-atom-env 128)]
            (is (not (:error alloc2)))
            ;; Retire the old block
            (atom/retire-block! s-atom-env desc-idx)
            ;; Increment epoch
            (atom/increment-epoch! s-atom-env)
            ;; Sweep should clean it up
            (let [freed (atom/sweep-retired-blocks! s-atom-env)]
              (is (>= freed 1) "Should free at least the retired block")))))
      (atom/unregister-worker! s-atom-env slot-idx))))

(deftest concurrent-readers-protection-test
  (testing "Blocks are protected while any reader is active"
    (let [s-atom-env (get-test-env)
          workers (mapv (fn [i]
                          {:id (+ 5000 i)
                           :slot (atom/register-worker! s-atom-env (+ 5000 i))})
                        (range 3))]
      ;; All workers should have slots
      (is (every? #(some? (:slot %)) workers))

      ;; Allocate a block
      (let [alloc (atom/alloc s-atom-env 64)]
        (is (not (:error alloc)))
        (let [desc-idx (:descriptor-idx alloc)]
          ;; All workers start reading
          (doseq [w workers]
            (atom/begin-read! s-atom-env (:slot w)))
          ;; Retire the block
          (atom/retire-block! s-atom-env desc-idx)
          ;; Should not be freeable while any reader active
          (let [result (atom/try-free-retired! s-atom-env desc-idx)]
            (is (= result :has-readers)))
          ;; End reads one by one
          (atom/end-read-epoch! s-atom-env (:slot (first workers)))
          (is (= :has-readers (atom/try-free-retired! s-atom-env desc-idx)))
          (atom/end-read-epoch! s-atom-env (:slot (second workers)))
          (is (= :has-readers (atom/try-free-retired! s-atom-env desc-idx)))
          (atom/end-read-epoch! s-atom-env (:slot (last workers)))
          ;; Advance epoch past the retirement epoch
          (atom/increment-epoch! s-atom-env)
          ;; Now it should be freeable
          (is (= :freed (atom/try-free-retired! s-atom-env desc-idx)))))

      ;; Clean up workers
      (doseq [w workers]
        (atom/unregister-worker! s-atom-env (:slot w))))))
