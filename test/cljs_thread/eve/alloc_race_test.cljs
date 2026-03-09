(ns cljs-thread.eve.alloc-race-test
  "Test to isolate suspected allocator race condition.

   Hypothesis: Under high concurrent allocation pressure, the FREE block
   gets lost - its capacity is shrunk but the split remainder is never
   tracked by a new FREE descriptor.

   This test validates by:
   1. Creating a fresh atom domain with known initial state
   2. Running allocations (sequential first, then concurrent)
   3. Checking that FREE capacity + ALLOC capacity = total data region
   4. Detecting any 'lost' memory (gaps in coverage)"
  (:require [cljs-thread.eve.shared-atom :as a]
            [cljs-thread.eve.data :as d]
            [cljs-thread.eve.util :as u]))

(defn get-allocator-stats
  "Scan all descriptors and return allocation statistics."
  [s-atom-env]
  (let [index-view (:index-view s-atom-env)
        max-descriptors (a/safe-max-descriptors s-atom-env)
        data-region-start (js/Atomics.load index-view (/ d/OFFSET_DATA_REGION_START d/SIZE_OF_INT32))
        sab-total (js/Atomics.load index-view (/ d/OFFSET_SAB_TOTAL_SIZE d/SIZE_OF_INT32))
        data-region-size (- sab-total data-region-start)
        stats (volatile! {:free-count 0 :free-capacity 0
                          :alloc-count 0 :alloc-capacity 0
                          :retired-count 0 :retired-capacity 0
                          :zeroed-count 0
                          :locked-count 0
                          :data-region-size data-region-size
                          :data-region-start data-region-start})]
    (dotimes [i max-descriptors]
      (let [status (u/read-block-descriptor-field index-view i d/OFFSET_BD_STATUS)
            capacity (u/read-block-descriptor-field index-view i d/OFFSET_BD_BLOCK_CAPACITY)
            lock-owner (u/read-block-descriptor-field index-view i d/OFFSET_BD_LOCK_OWNER)]
        (cond
          (== status d/STATUS_FREE)
          (vswap! stats #(-> % (update :free-count inc) (update :free-capacity + capacity)))

          (== status d/STATUS_ALLOCATED)
          (vswap! stats #(-> % (update :alloc-count inc) (update :alloc-capacity + capacity)))

          (== status d/STATUS_RETIRED)
          (vswap! stats #(-> % (update :retired-count inc) (update :retired-capacity + capacity)))

          (== status d/STATUS_ZEROED_UNUSED)
          (vswap! stats update :zeroed-count inc))

        (when (pos? lock-owner)
          (vswap! stats update :locked-count inc))))
    @stats))

(defn check-memory-coverage
  "Check that tracked memory equals data region size.
   Returns {:covered :expected :lost :healthy?}"
  [stats]
  (let [covered (+ (:free-capacity stats)
                   (:alloc-capacity stats)
                   (:retired-capacity stats))
        expected (:data-region-size stats)
        lost (- expected covered)]
    {:covered covered
     :expected expected
     :lost lost
     :healthy? (zero? lost)}))

(defn print-stats [label stats coverage]
  (println (str "\n=== " label " ==="))
  (println (str "  FREE: " (:free-count stats) " blocks, " (:free-capacity stats) " bytes"))
  (println (str "  ALLOC: " (:alloc-count stats) " blocks, " (:alloc-capacity stats) " bytes"))
  (println (str "  RETIRED: " (:retired-count stats) " blocks, " (:retired-capacity stats) " bytes"))
  (println (str "  ZEROED: " (:zeroed-count stats) " blocks"))
  (println (str "  LOCKED: " (:locked-count stats) " descriptors"))
  (println (str "  Coverage: " (:covered coverage) "/" (:expected coverage)
                " (lost: " (:lost coverage) " bytes)"))
  (println (str "  Healthy: " (:healthy? coverage))))

;; =============================================================================
;; Test 1: Sequential allocations - baseline, should never lose memory
;; =============================================================================

(defn test-sequential-allocs
  "Test that sequential allocations don't lose memory."
  []
  (println "\n" (apply str (repeat 60 "=")) "\n")
  (println "TEST 1: Sequential Allocations (Baseline)")
  (println (apply str (repeat 60 "=")) "\n")

  (let [;; Create isolated atom domain
        test-domain (a/atom-domain {} :sab-size (* 2 1024 1024) :max-blocks 512)
        s-env (.-s-atom-env test-domain)

        ;; Check initial state
        initial-stats (get-allocator-stats s-env)
        initial-coverage (check-memory-coverage initial-stats)]

    (print-stats "Initial State" initial-stats initial-coverage)

    (when-not (:healthy? initial-coverage)
      (println "FAIL: Initial state already has lost memory!")
      (js/process.exit 1))

    (when (not= 1 (:free-count initial-stats))
      (println "FAIL: Should start with exactly 1 FREE block, got:" (:free-count initial-stats))
      (js/process.exit 1))

    ;; Perform 100 sequential allocations
    (println "\nPerforming 100 sequential 32-byte allocations...")
    (let [alloc-results (volatile! [])
          n-allocs 100]
      (dotimes [i n-allocs]
        (let [result (a/alloc s-env 32)]
          (if (:error result)
            (println "  Alloc failed at i=" i ":" (:error result))
            (vswap! alloc-results conj result))))

      (let [after-stats (get-allocator-stats s-env)
            after-coverage (check-memory-coverage after-stats)]
        (print-stats (str "After " (count @alloc-results) " Allocations") after-stats after-coverage)

        (if (:healthy? after-coverage)
          (println "\nPASS: Sequential allocations preserved all memory")
          (do
            (println "\nFAIL: Sequential allocations lost" (:lost after-coverage) "bytes!")
            (js/process.exit 1)))))))

;; =============================================================================
;; Test 2: Allocate until FREE block splits many times
;; =============================================================================

(defn test-many-splits
  "Test that many splits don't lose the remainder."
  []
  (println "\n" (apply str (repeat 60 "=")) "\n")
  (println "TEST 2: Many Split Operations")
  (println (apply str (repeat 60 "=")) "\n")

  (let [test-domain (a/atom-domain {} :sab-size (* 4 1024 1024) :max-blocks 256)
        s-env (.-s-atom-env test-domain)

        initial-stats (get-allocator-stats s-env)
        initial-coverage (check-memory-coverage initial-stats)
        _ (print-stats "Initial State" initial-stats initial-coverage)

        ;; Allocate small blocks to force many splits
        alloc-results (volatile! [])
        n-allocs 200]

    (println "\nPerforming" n-allocs "small allocations to stress split logic...")

    (dotimes [i n-allocs]
      (let [size (+ 8 (* 8 (mod i 4)))  ;; 8, 16, 24, 32 bytes alternating
            result (a/alloc s-env size)]
        (if (:error result)
          (when (zero? (mod i 50))
            (println "  Alloc" i "failed:" (:error result)))
          (vswap! alloc-results conj [size result]))))

    (let [after-stats (get-allocator-stats s-env)
          after-coverage (check-memory-coverage after-stats)]
      (print-stats (str "After " (count @alloc-results) " Allocations") after-stats after-coverage)

      (if (:healthy? after-coverage)
        (println "\nPASS: Many splits preserved all memory")
        (do
          (println "\nFAIL: Split operations lost" (:lost after-coverage) "bytes!")

          ;; Detailed diagnosis
          (println "\nDiagnosis:")
          (println "  Data region starts at:" (:data-region-start after-stats))
          (println "  Data region size:" (:data-region-size after-stats))
          (println "  Tracked capacity:" (:covered after-coverage))

          ;; Find the gap
          (let [index-view (:index-view s-env)
                max-desc (a/safe-max-descriptors s-env)
                blocks (volatile! [])]
            (dotimes [i max-desc]
              (let [status (u/read-block-descriptor-field index-view i d/OFFSET_BD_STATUS)
                    offset (u/read-block-descriptor-field index-view i d/OFFSET_BD_DATA_OFFSET)
                    cap (u/read-block-descriptor-field index-view i d/OFFSET_BD_BLOCK_CAPACITY)]
                (when (and (or (== status d/STATUS_FREE)
                               (== status d/STATUS_ALLOCATED)
                               (== status d/STATUS_RETIRED))
                           (pos? cap))
                  (vswap! blocks conj {:idx i :status status :offset offset :capacity cap}))))

            ;; Sort by offset and find gaps
            (let [sorted (sort-by :offset @blocks)]
              (println "\n  Allocated blocks (sorted by offset):")
              (doseq [b (take 10 sorted)]
                (println "    desc" (:idx b) ": offset=" (:offset b) " cap=" (:capacity b)
                         " status=" (a/status-name (:status b))))
              (when (> (count sorted) 10)
                (println "    ... and" (- (count sorted) 10) "more"))

              ;; Find where the gap starts
              (let [data-start (:data-region-start after-stats)
                    data-end (+ data-start (:data-region-size after-stats))]
                (loop [blocks sorted
                       expected-start data-start]
                  (if (empty? blocks)
                    (when (< expected-start data-end)
                      (println "\n  GAP FOUND: offset" expected-start "to" data-end
                               "(" (- data-end expected-start) "bytes untracked)"))
                    (let [b (first blocks)
                          actual-start (:offset b)]
                      (when (> actual-start expected-start)
                        (println "  GAP: offset" expected-start "to" actual-start
                                 "(" (- actual-start expected-start) "bytes)"))
                      (recur (rest blocks)
                             (+ (:offset b) (:capacity b)))))))))
          (js/process.exit 1))))))

;; =============================================================================
;; Test 3: Alloc then free, check coalescing
;; =============================================================================

(defn test-alloc-free-coalesce
  "Test that freeing blocks coalesces correctly."
  []
  (println "\n" (apply str (repeat 60 "=")) "\n")
  (println "TEST 3: Alloc/Free/Coalesce Cycle")
  (println (apply str (repeat 60 "=")) "\n")

  (let [test-domain (a/atom-domain {} :sab-size (* 4 1024 1024) :max-blocks 256)
        s-env (.-s-atom-env test-domain)

        initial-stats (get-allocator-stats s-env)
        initial-free-cap (:free-capacity initial-stats)
        _ (println "Initial FREE capacity:" initial-free-cap)]

    ;; Allocate 50 blocks
    (println "\nAllocating 50 blocks...")
    (let [allocs (mapv (fn [_] (a/alloc s-env 64)) (range 50))
          alloc-count (count (filter #(not (:error %)) allocs))]
      (println "Allocated" alloc-count "blocks")

      (let [mid-stats (get-allocator-stats s-env)
            mid-coverage (check-memory-coverage mid-stats)]
        (print-stats "After Allocations" mid-stats mid-coverage)

        (when-not (:healthy? mid-coverage)
          (println "FAIL: Lost memory during allocation phase")
          (js/process.exit 1)))

      ;; Free all blocks by retiring them
      (println "\nRetiring allocated blocks...")
      (doseq [alloc (filter #(not (:error %)) allocs)]
        (a/retire-block! s-env (:descriptor-idx alloc)))

      (let [retired-stats (get-allocator-stats s-env)
            retired-coverage (check-memory-coverage retired-stats)]
        (print-stats "After Retirement" retired-stats retired-coverage)

        (when-not (:healthy? retired-coverage)
          (println "FAIL: Lost memory during retirement")
          (js/process.exit 1)))

      ;; Sweep to free retired blocks
      (println "\nSweeping retired blocks...")
      (let [freed (a/sweep-retired-blocks! s-env)]
        (println "Freed" freed "blocks")

        (let [final-stats (get-allocator-stats s-env)
              final-coverage (check-memory-coverage final-stats)]
          (print-stats "After Sweep" final-stats final-coverage)

          (if (:healthy? final-coverage)
            (do
              (println "\nPASS: Alloc/Free/Coalesce cycle preserved all memory")
              ;; Check if we coalesced back to a single FREE block
              (if (== 1 (:free-count final-stats))
                (println "BONUS: Coalesced back to single FREE block!")
                (println "Note: Multiple FREE blocks remain (fragmented)")))
            (do
              (println "\nFAIL: Lost" (:lost final-coverage) "bytes during alloc/free cycle!")
              (js/process.exit 1))))))))

;; =============================================================================
;; Run all tests
;; =============================================================================

(defn run-all []
  (println "\n" (apply str (repeat 70 "=")) "\n")
  (println "         ALLOCATOR RACE CONDITION TESTS")
  (println "\n" (apply str (repeat 70 "=")) "\n")

  (test-sequential-allocs)
  (test-many-splits)
  (test-alloc-free-coalesce)

  (println "\n" (apply str (repeat 70 "=")) "\n")
  (println "         ALL TESTS PASSED")
  (println "\n" (apply str (repeat 70 "=")) "\n")

  0)  ;; Return 0 for success
