(ns cljs-thread.eve.shared-atom
  (:refer-clojure :exclude [atom])
  (:require
   [clojure.string :as string]
   [cljs-thread.eve.data :as d]
   [cljs-thread.eve.util :as u]
   [cljs-thread.eve.wasm-mem :as wasm]
   [cljs-thread.eve.deftype-proto.serialize :as ser]
   [cljs-thread.eve.deftype-proto.data :as sd]))

;; Forward declarations for functions defined later in this file
(declare sweep-retired-blocks! cached-atom-iv cached-atom-uv
         coalesce-adjacent-free-blocks! dv get-current-epoch
         get-min-active-epoch increment-epoch! update-heartbeat!)

(def ^:dynamic *global-atom-instance* nil)

;; Cached max-descriptors — set once during atom-domain/worker init.
;; Always use this instead of reading from SAB header, which can be corrupted
;; by WASM memory misalignment or concurrent write races on shared memory.
(defonce ^:private cached-max-descriptors (volatile! nil))

(defn- safe-max-descriptors
  "Return max-descriptors from cache, config, or SAB header (last resort).
   Prefers cached value to avoid reading from potentially-corrupted SAB header."
  [s-atom-env]
  (or @cached-max-descriptors
      (let [cfg (get-in s-atom-env [:config :max-block-descriptors])]
        (when cfg
          (vreset! cached-max-descriptors cfg)
          cfg))
      (let [raw (u/get-max-block-descriptors (:index-view s-atom-env))]
        (when (and (> raw 0) (< raw 10000000))
          (vreset! cached-max-descriptors raw)
          raw))
      (do (println "[BUG] safe-max-descriptors: no valid source!")
          256)))

;; Alloc cursor: tracks where the last successful allocation ended.
;; Next scan starts here instead of 0, giving O(1) amortized alloc.
(defonce ^:private alloc-cursor (volatile! 0))

;; Per-SAB worker slot cache. Each SAB has its own worker registry, so we
;; must track slot assignments per index-view (Int32Array). A global cache
;; would reuse a slot from SAB-1 on SAB-2 where it's INACTIVE, causing
;; get-min-active-epoch to ignore the worker → epoch protection fails.
(defonce ^:private worker-slot-map (js/Map.))

(defn reset-alloc-cursor!
  "Reset the allocation cursor to 0. Call when creating a new SAB environment."
  ([]
   (vreset! alloc-cursor 0)
   (.clear worker-slot-map)
   (vreset! cached-max-descriptors nil))
  ([position]
   (vreset! alloc-cursor position)
   (.clear worker-slot-map)
   (vreset! cached-max-descriptors nil)))

(defn get-env [^js obj]
  (if-let [parent (.-parent-atom-domain obj)]
    (.-s-atom-env ^js parent)
    (if-let [sab (.-s-atom-env obj)]
      sab
      (throw (js/Error. "Error: get-env requires a shared atom or shared private atom.")))))

;;;;====================================================================================================
;;;; SoA Mirror Helpers (Phase 1 — SIMD descriptor scanning)
;;;;====================================================================================================
;; Mirror arrays: contiguous status[N] and capacity[N] alongside the AoS descriptor table.
;; Layout: [desc_table][status_mirror][capacity_mirror][scratch][data]

(defn- mirror-offsets
  "Compute status/capacity mirror byte offsets from index-view header.
   Returns [status-mirror-byte-offset capacity-mirror-byte-offset]."
  [index-view]
  (let [max-blocks (aget index-view (/ d/OFFSET_MAX_BLOCK_DESCRIPTORS d/SIZE_OF_INT32))
        desc-end (+ d/OFFSET_BLOCK_DESCRIPTORS_ARRAY_START (* max-blocks d/SIZE_OF_BLOCK_DESCRIPTOR))
        cap-start (+ desc-end (* max-blocks d/SIZE_OF_INT32))]
    [desc-end cap-start]))

(defn- update-status-mirror!
  "Update the status mirror for a descriptor. status-mirror-start is byte offset."
  [index-view status-mirror-start desc-idx status]
  (aset index-view (+ (/ status-mirror-start 4) desc-idx) status))

(defn- update-capacity-mirror!
  "Update the capacity mirror for a descriptor. capacity-mirror-start is byte offset."
  [index-view capacity-mirror-start desc-idx capacity]
  (aset index-view (+ (/ capacity-mirror-start 4) desc-idx) capacity))

(defn- update-mirrors!
  "Update both status and capacity mirrors for a descriptor.
   Pass nil for capacity to skip capacity update."
  [index-view desc-idx status capacity]
  (let [[sm cm] (mirror-offsets index-view)]
    (update-status-mirror! index-view sm desc-idx status)
    (when (some? capacity)
      (update-capacity-mirror! index-view cm desc-idx capacity))))

;;;;====================================================================================================
;;;; Allocator Logic
;;;;====================================================================================================

(defn- clear-descriptor-fields!
  "Zero out descriptor fields. Does NOT release the lock - caller must do that
   after all writes are complete to prevent a race where another worker steals
   the descriptor while we're still writing to it."
  [index-view descriptor-idx]
  (u/write-block-descriptor-field! index-view descriptor-idx d/OFFSET_BD_STATUS d/STATUS_ZEROED_UNUSED)
  (u/write-block-descriptor-field! index-view descriptor-idx d/OFFSET_BD_DATA_OFFSET 0)
  (u/write-block-descriptor-field! index-view descriptor-idx d/OFFSET_BD_DATA_LENGTH 0)
  (u/write-block-descriptor-field! index-view descriptor-idx d/OFFSET_BD_BLOCK_CAPACITY 0)
  (u/write-block-descriptor-field! index-view descriptor-idx d/OFFSET_BD_VALUE_DATA_DESC_IDX d/ROOT_POINTER_NIL_SENTINEL)
  ;; NOTE: Do NOT clear lock_owner here - that would release the lock prematurely!
  ;; The caller must release the lock after completing all field writes.
  (u/write-block-descriptor-field! index-view descriptor-idx d/OFFSET_BD_RETIRED_EPOCH 0)
  (update-mirrors! index-view descriptor-idx d/STATUS_ZEROED_UNUSED 0)
  nil)

(defn- try-claim-descriptor!
  "Try to CAS-lock a candidate descriptor and allocate it.
   Returns {:offset :descriptor-idx} on success, nil on failure."
  [index-view max-descriptors candidate requested-size-bytes]
  (let [desc-base (u/get-block-descriptor-base-int32-offset candidate)
        lock-field (+ desc-base (/ d/OFFSET_BD_LOCK_OWNER d/SIZE_OF_INT32))]
    (when (== 0 (u/atomic-compare-exchange-int index-view lock-field 0 d/*worker-id*))
      (let [status (u/read-block-descriptor-field index-view candidate d/OFFSET_BD_STATUS)
            capacity (u/read-block-descriptor-field index-view candidate d/OFFSET_BD_BLOCK_CAPACITY)]
        (if (and (or (== status d/STATUS_FREE)
                     (== status d/STATUS_ZEROED_UNUSED))
                 (>= capacity requested-size-bytes))
          (let [data-offset (u/read-block-descriptor-field index-view candidate d/OFFSET_BD_DATA_OFFSET)
                data-region-start (js/Atomics.load index-view (/ d/OFFSET_DATA_REGION_START d/SIZE_OF_INT32))
                remainder-size (- capacity requested-size-bytes)]
            (if (< data-offset data-region-start)
              ;; Safety: reject blocks with data-offset in header/descriptor region.
              ;; This can happen when a ZEROED_UNUSED descriptor retains stale capacity.
              (do
                (println "[BUG] alloc: data-offset" data-offset "< data-region-start" data-region-start
                         "for desc" candidate "status" status "cap" capacity ". Skipping.")
                ;; Mark this broken descriptor as truly zeroed so we don't keep hitting it
                (u/write-block-descriptor-field! index-view candidate d/OFFSET_BD_STATUS d/STATUS_ZEROED_UNUSED)
                (u/write-block-descriptor-field! index-view candidate d/OFFSET_BD_DATA_OFFSET 0)
                (u/write-block-descriptor-field! index-view candidate d/OFFSET_BD_BLOCK_CAPACITY 0)
                (update-mirrors! index-view candidate d/STATUS_ZEROED_UNUSED 0)
                (u/atomic-store-int index-view lock-field 0)
                nil) ;; Return nil → allocator tries next descriptor
              (do
                (u/write-block-descriptor-field! index-view candidate d/OFFSET_BD_BLOCK_CAPACITY requested-size-bytes)
                (u/write-block-descriptor-field! index-view candidate d/OFFSET_BD_DATA_LENGTH 0)
                (u/write-block-descriptor-field! index-view candidate d/OFFSET_BD_VALUE_DATA_DESC_IDX d/ROOT_POINTER_NIL_SENTINEL)
                (u/write-block-descriptor-field! index-view candidate d/OFFSET_BD_STATUS d/STATUS_ALLOCATED)
                (update-mirrors! index-view candidate d/STATUS_ALLOCATED requested-size-bytes)
                ;; Split remainder into a new free descriptor
                (when (and (== status d/STATUS_FREE)
                           (>= remainder-size d/MINIMUM_USABLE_BLOCK_SIZE))
                  (let [cursor-start (mod @alloc-cursor max-descriptors)
                        split-ok
                    (loop [rem-scan cursor-start wrapped? false]
                      (let [rem-scan (if (>= rem-scan max-descriptors) 0 rem-scan)]
                        (if (and wrapped? (>= rem-scan cursor-start))
                          false
                          (let [next-wrapped? (or wrapped? (>= (inc rem-scan) max-descriptors))]
                            (if (== rem-scan candidate)
                              (recur (inc rem-scan) next-wrapped?)
                              (let [rem-status (u/read-block-descriptor-field index-view rem-scan d/OFFSET_BD_STATUS)]
                                (if (== rem-status d/STATUS_ZEROED_UNUSED)
                                  (let [rem-desc-base (u/get-block-descriptor-base-int32-offset rem-scan)
                                        rem-lock-field (+ rem-desc-base (/ d/OFFSET_BD_LOCK_OWNER d/SIZE_OF_INT32))]
                                    (if (== 0 (u/atomic-compare-exchange-int index-view rem-lock-field 0 d/*worker-id*))
                                      (do
                                        (clear-descriptor-fields! index-view rem-scan)
                                        (u/write-block-descriptor-field! index-view rem-scan d/OFFSET_BD_DATA_OFFSET (+ data-offset requested-size-bytes))
                                        (u/write-block-descriptor-field! index-view rem-scan d/OFFSET_BD_BLOCK_CAPACITY remainder-size)
                                        (u/write-block-descriptor-field! index-view rem-scan d/OFFSET_BD_STATUS d/STATUS_FREE)
                                        (update-mirrors! index-view rem-scan d/STATUS_FREE remainder-size)
                                        (u/atomic-store-int index-view rem-lock-field 0)
                                        (vreset! alloc-cursor (inc rem-scan))
                                        true)
                                      (recur (inc rem-scan) next-wrapped?)))
                                  (recur (inc rem-scan) next-wrapped?))))))))]
                    (when-not split-ok
                      ;; Restore original capacity so the remainder stays tracked.
                      ;; Over-allocating is better than leaking: the full block
                      ;; returns to the free pool when freed, preventing X-RAY gaps.
                      (u/write-block-descriptor-field! index-view candidate d/OFFSET_BD_BLOCK_CAPACITY capacity)
                      (update-mirrors! index-view candidate d/STATUS_ALLOCATED capacity))))
                (u/atomic-store-int index-view lock-field 0)
                #js [data-offset candidate])))
          ;; Stale — release lock
          (do (u/atomic-store-int index-view lock-field 0)
              nil))))))

(defn- batch-alloc-js
  "JS fallback for batch-alloc when WASM isn't ready.
   Uses alloc-cursor to avoid rescanning from 0."
  [index-view max-descriptors requested-size-bytes max-count]
  (let [results #js []
        cursor-start (mod @alloc-cursor max-descriptors)]
    (loop [scan-idx cursor-start wrapped? false]
      (let [scan-idx (if (>= scan-idx max-descriptors) 0 scan-idx)]
        (if (or (>= (.-length results) max-count)
                (and wrapped? (>= scan-idx cursor-start)))
          (do (when (pos? (.-length results))
                (vreset! alloc-cursor scan-idx))
              results)
          ;; Compute next-wrapped? once — all recur paths must use it
          ;; to prevent infinite loop when a claim attempt sits at the
          ;; wrap boundary (index max-descriptors-1).
          (let [next-wrapped? (or wrapped? (>= (inc scan-idx) max-descriptors))
                status (u/read-block-descriptor-field index-view scan-idx d/OFFSET_BD_STATUS)]
            (if (and (or (== status d/STATUS_FREE) (== status d/STATUS_ZEROED_UNUSED))
                     (>= (u/read-block-descriptor-field index-view scan-idx d/OFFSET_BD_BLOCK_CAPACITY) requested-size-bytes))
              (if-let [result (try-claim-descriptor! index-view max-descriptors scan-idx requested-size-bytes)]
                (do (.push results result)
                    (recur (inc scan-idx) next-wrapped?))
                (recur (inc scan-idx) next-wrapped?))
              (recur (inc scan-idx) next-wrapped?))))))))

(defn- batch-alloc-wasm
  "WASM-accelerated batch-alloc using find_free_descriptor (scalar AoS scan).
   Uses alloc-cursor to avoid rescanning from 0."
  [index-view max-descriptors requested-size-bytes max-count]
  (let [results #js []
        cursor-start (mod @alloc-cursor max-descriptors)]
    ;; Scan from cursor to end
    (loop [start-idx cursor-start]
      (when (and (< start-idx max-descriptors)
                 (< (.-length results) max-count))
        (let [candidate (wasm/find-free-descriptor
                          d/OFFSET_BLOCK_DESCRIPTORS_ARRAY_START
                          max-descriptors requested-size-bytes start-idx)]
          (when-not (== candidate -1)
            (if-let [result (try-claim-descriptor! index-view max-descriptors
                                                    candidate requested-size-bytes)]
              (do (.push results result)
                  (recur (inc candidate)))
              (recur (inc candidate)))))))
    ;; If not enough found, wrap around and scan from 0 to cursor-start
    (when (and (< (.-length results) max-count) (pos? cursor-start))
      (loop [start-idx 0]
        (when (and (< start-idx cursor-start)
                   (< (.-length results) max-count))
          (let [candidate (wasm/find-free-descriptor
                            d/OFFSET_BLOCK_DESCRIPTORS_ARRAY_START
                            cursor-start requested-size-bytes start-idx)]
            (when-not (== candidate -1)
              (if-let [result (try-claim-descriptor! index-view max-descriptors
                                                      candidate requested-size-bytes)]
                (do (.push results result)
                    (recur (inc candidate)))
                (recur (inc candidate))))))))
    (when (pos? (.-length results))
      (let [last-result (aget results (dec (.-length results)))]
        (vreset! alloc-cursor (inc (aget last-result 1)))))
    results))

(defn- batch-alloc-simd
  "SIMD-accelerated batch-alloc using v128 scan over SoA mirror arrays.
   4 descriptors per SIMD iteration vs 1 per scalar.
   Uses alloc-cursor to avoid rescanning from 0."
  [index-view max-descriptors requested-size-bytes max-count
   status-mirror-start capacity-mirror-start]
  (let [results #js []
        cursor-start (mod @alloc-cursor max-descriptors)]
    ;; Scan from cursor to end
    (loop [start-idx cursor-start]
      (when (and (< start-idx max-descriptors)
                 (< (.-length results) max-count))
        (let [candidate (wasm/find-free-descriptor-simd
                          status-mirror-start capacity-mirror-start
                          max-descriptors requested-size-bytes start-idx)]
          (when-not (== candidate -1)
            (if-let [result (try-claim-descriptor! index-view max-descriptors
                                                    candidate requested-size-bytes)]
              (do (.push results result)
                  (recur (inc candidate)))
              (recur (inc candidate)))))))
    ;; Wrap around if needed
    (when (and (< (.-length results) max-count) (pos? cursor-start))
      (loop [start-idx 0]
        (when (and (< start-idx cursor-start)
                   (< (.-length results) max-count))
          (let [candidate (wasm/find-free-descriptor-simd
                            status-mirror-start capacity-mirror-start
                            cursor-start requested-size-bytes start-idx)]
            (when-not (== candidate -1)
              (if-let [result (try-claim-descriptor! index-view max-descriptors
                                                      candidate requested-size-bytes)]
                (do (.push results result)
                    (recur (inc candidate)))
                (recur (inc candidate))))))))
    (when (pos? (.-length results))
      (let [last-result (aget results (dec (.-length results)))]
        (vreset! alloc-cursor (inc (aget last-result 1)))))
    results))

(defn batch-alloc
  "Allocate up to `max-count` blocks of `requested-size-bytes` each.
   Uses SIMD scan over SoA mirrors when available, falls back to scalar WASM,
   then JS scan.
   Returns a JS array of #js [offset descriptor-idx] pairs."
  [s-atom-env requested-size-bytes max-count]
  (let [index-view (:index-view s-atom-env)
        max-descriptors (safe-max-descriptors s-atom-env)]
    (if @wasm/wasm-ready
      (if-let [sm (:status-mirror-start s-atom-env)]
        (batch-alloc-simd index-view max-descriptors requested-size-bytes max-count
                          sm (:capacity-mirror-start s-atom-env))
        (batch-alloc-wasm index-view max-descriptors requested-size-bytes max-count))
      (batch-alloc-js index-view max-descriptors requested-size-bytes max-count))))

(defn- alloc-wasm
  "WASM-accelerated single allocation. Uses find_free_descriptor for fast scan.
   Returns #js [offset descriptor-idx] on success, nil on failure."
  [index-view max-descriptors requested-size-bytes s-atom-env]
  (let [cursor-start (mod @alloc-cursor max-descriptors)]
    ;; Phase 1: Scan from cursor to end
    (loop [start-idx cursor-start
           phase :forward
           sweep-polls 0]
      (let [limit (if (= phase :forward) max-descriptors cursor-start)
            candidate (wasm/find-free-descriptor
                        d/OFFSET_BLOCK_DESCRIPTORS_ARRAY_START
                        limit requested-size-bytes start-idx)]
        (if (not= candidate -1)
          ;; Found candidate — try to claim it
          (if-let [result (try-claim-descriptor! index-view max-descriptors candidate requested-size-bytes)]
            (do (vreset! alloc-cursor (inc candidate))
                result)
            ;; CAS contention — skip and keep scanning
            (recur (inc candidate) phase sweep-polls))
          ;; No free descriptor in this range
          (case phase
            :forward (if (pos? cursor-start)
                       ;; Wrap around: scan from 0 to cursor
                       (recur 0 :backward sweep-polls)
                       ;; cursor was 0, full scan done — sweep + poll for reader drain
                       (if (< sweep-polls 4)
                         (let [freed (sweep-retired-blocks! s-atom-env)]
                           (if (pos? freed)
                             (recur 0 :forward (inc sweep-polls))
                             ;; Wait briefly for readers to drain, retry
                             (do (u/yield-cpu (* 2 (inc sweep-polls)))
                                 (recur 0 :forward (inc sweep-polls)))))
                         nil))
            :backward (if (< sweep-polls 4)
                        (let [freed (sweep-retired-blocks! s-atom-env)]
                          (if (pos? freed)
                            (recur 0 :forward (inc sweep-polls))
                            ;; Wait briefly for readers to drain, retry
                            (do (u/yield-cpu (* 2 (inc sweep-polls)))
                                (recur 0 :forward (inc sweep-polls)))))
                        nil)))))))

(defn- alloc-js
  "JS fallback allocation using linear descriptor scan.
   Returns #js [offset descriptor-idx] on success, nil on failure."
  [index-view max-descriptors requested-size-bytes s-atom-env]
  (let [cursor-start (mod @alloc-cursor max-descriptors)]
    (loop [scan-idx cursor-start
           wrapped? false
           sweep-polls 0]
      (let [scan-idx (if (>= scan-idx max-descriptors) 0 scan-idx)]
        (if (and wrapped? (>= scan-idx cursor-start))
          ;; Full scan found nothing — try sweep + poll for reader drain
          (if (< sweep-polls 4)
            (let [freed (sweep-retired-blocks! s-atom-env)]
              (if (pos? freed)
                (recur 0 false (inc sweep-polls))
                ;; No blocks freed — wait briefly for readers to drain, retry
                (do (u/yield-cpu (* 2 (inc sweep-polls)))
                    (recur 0 false (inc sweep-polls)))))
            nil)
          (let [next-wrapped? (or wrapped? (>= (inc scan-idx) max-descriptors))
                current-status-nolock (u/read-block-descriptor-field index-view scan-idx d/OFFSET_BD_STATUS)]
            (if (and (or (== current-status-nolock d/STATUS_FREE)
                         (== current-status-nolock d/STATUS_ZEROED_UNUSED))
                     (>= (u/read-block-descriptor-field index-view scan-idx d/OFFSET_BD_BLOCK_CAPACITY) requested-size-bytes))
              (if-let [result (try-claim-descriptor! index-view max-descriptors scan-idx requested-size-bytes)]
                (do (vreset! alloc-cursor (inc scan-idx))
                    result)
                (recur (inc scan-idx) next-wrapped? sweep-polls))
              (recur (inc scan-idx) next-wrapped? sweep-polls))))))))

(defn- status-name [s]
  (condp == s
    d/STATUS_FREE "FREE"
    d/STATUS_ALLOCATED "ALLOC"
    d/STATUS_EMBEDDED_ATOM_HEADER "EMBED"
    d/STATUS_ORPHANED "ORPHAN"
    d/STATUS_RETIRED "RETIRE"
    d/STATUS_ZEROED_UNUSED "ZEROED"
    (str "?" s)))

(defn dump-block-stats!
  "TELESCOPE: High-level SAB memory overview.
   Shows status distribution, capacity per status, fragmentation index,
   free block size histogram, and utilization."
  [s-atom-env]
  (let [index-view (:index-view s-atom-env)
        max-descriptors (safe-max-descriptors s-atom-env)
        ;; Status counts
        counts #js [0 0 0 0 0 0 0 0]  ;; indexed by status (negative maps to 7)
        ;; Capacity per status
        cap-by-status #js [0 0 0 0 0 0 0 0]
        ;; Free block size tracking
        free-sizes #js []
        retired-sizes #js []
        alloc-sizes #js []
        ;; Adjacent free blocks not coalesced (fragmentation indicator)
        free-blocks-sorted #js []  ;; [offset, capacity, desc-idx]
        total-data-region (volatile! 0)]
    ;; Single scan: collect all block info
    (dotimes [i max-descriptors]
      (let [status (u/read-block-descriptor-field index-view i d/OFFSET_BD_STATUS)
            cap (u/read-block-descriptor-field index-view i d/OFFSET_BD_BLOCK_CAPACITY)
            off (u/read-block-descriptor-field index-view i d/OFFSET_BD_DATA_OFFSET)
            sidx (cond (== status d/STATUS_ZEROED_UNUSED) 7
                       (and (>= status 0) (< status 7)) status
                       :else 6)]
        (aset counts sidx (inc (aget counts sidx)))
        (aset cap-by-status sidx (+ (aget cap-by-status sidx) cap))
        (when (pos? cap) (vswap! total-data-region + cap))
        (when (== status d/STATUS_FREE)
          (.push free-sizes cap)
          (.push free-blocks-sorted #js [off cap i]))
        (when (== status d/STATUS_RETIRED) (.push retired-sizes cap))
        (when (== status d/STATUS_ALLOCATED) (.push alloc-sizes cap))))
    ;; Sort free blocks by offset for adjacency analysis
    (.sort free-blocks-sorted (fn [a b] (- (aget a 0) (aget b 0))))
    (.sort free-sizes (fn [a b] (- b a)))  ;; descending
    (.sort retired-sizes (fn [a b] (- b a)))
    (.sort alloc-sizes (fn [a b] (- b a)))
    ;; Count adjacent-but-not-coalesced free pairs
    (let [flen (.-length free-blocks-sorted)
          adj-pairs (loop [i 0, pairs 0]
                      (if (>= (inc i) flen)
                        pairs
                        (let [a (aget free-blocks-sorted i)
                              b (aget free-blocks-sorted (inc i))]
                          (recur (inc i)
                                 (if (== (+ (aget a 0) (aget a 1)) (aget b 0))
                                   (inc pairs) pairs)))))
          free-count (aget counts 0)
          alloc-count (aget counts d/STATUS_ALLOCATED)
          retired-count (aget counts d/STATUS_RETIRED)
          orphan-count (aget counts d/STATUS_ORPHANED)
          zeroed-count (aget counts 7)
          embed-count (aget counts d/STATUS_EMBEDDED_ATOM_HEADER)
          total-free-cap (aget cap-by-status 0)
          total-alloc-cap (aget cap-by-status d/STATUS_ALLOCATED)
          total-retired-cap (aget cap-by-status d/STATUS_RETIRED)]
      ;; === TELESCOPE OUTPUT ===
      (println "\n=== [TELESCOPE] SAB Memory Overview ===")
      (println (str "  Descriptors: " max-descriptors " total"))
      (println (str "  | FREE=" free-count " ALLOC=" alloc-count " RETIRED=" retired-count
                    " ORPHAN=" orphan-count " EMBED=" embed-count " ZEROED=" zeroed-count))
      (println (str "  Capacity (bytes):"))
      (println (str "  | free=" total-free-cap " alloc=" total-alloc-cap
                    " retired=" total-retired-cap))
      (println (str "  Utilization: " (if (pos? @total-data-region)
                                        (str (Math/round (* 100 (/ total-alloc-cap @total-data-region))) "%")
                                        "N/A")
                    " (alloc / total tracked)"))
      (println (str "  Fragmentation: " free-count " free regions"
                    (when (pos? adj-pairs) (str ", " adj-pairs " ADJACENT UNCOALESCED PAIRS!"))
                    (when (pos? free-count) (str ", avg=" (Math/round (/ total-free-cap free-count)) "B"))))
      ;; Free block size histogram (top 5 + bottom 5)
      (when (pos? (.-length free-sizes))
        (println "  Free blocks (top 5 largest):")
        (dotimes [i (min 5 (.-length free-sizes))]
          (println (str "    #" (inc i) ": " (aget free-sizes i) " bytes")))
        (when (> (.-length free-sizes) 5)
          (println "  Free blocks (5 smallest):")
          (dotimes [i (min 5 (.-length free-sizes))]
            (let [j (- (.-length free-sizes) 1 i)]
              (println (str "    #" (- (.-length free-sizes) i) ": " (aget free-sizes j) " bytes"))))))
      ;; Retired block sizes
      (when (pos? (.-length retired-sizes))
        (println (str "  Retired blocks (top 3): "
                      (clojure.string/join ", " (map #(str % "B") (take 3 retired-sizes)))))))))

(defn dump-block-detail!
  "MICROSCOPE: Low-level physical memory layout.
   Shows the data region sorted by physical offset with status of each block,
   contiguous runs, gaps, and per-block detail."
  ([s-atom-env] (dump-block-detail! s-atom-env nil))
  ([s-atom-env {:keys [limit offset-range]}]
   (let [index-view (:index-view s-atom-env)
         max-descriptors (safe-max-descriptors s-atom-env)
         ;; Collect all blocks with their physical offset
         blocks #js []]
     (dotimes [i max-descriptors]
       (let [status (u/read-block-descriptor-field index-view i d/OFFSET_BD_STATUS)]
         (when-not (== status d/STATUS_ZEROED_UNUSED)
           (let [off (u/read-block-descriptor-field index-view i d/OFFSET_BD_DATA_OFFSET)
                 cap (u/read-block-descriptor-field index-view i d/OFFSET_BD_BLOCK_CAPACITY)
                 len (u/read-block-descriptor-field index-view i d/OFFSET_BD_DATA_LENGTH)
                 epoch (u/read-block-descriptor-field index-view i d/OFFSET_BD_RETIRED_EPOCH)]
             (when (and (pos? cap)
                        (or (nil? offset-range)
                            (and (>= off (first offset-range))
                                 (< off (second offset-range)))))
               (.push blocks #js [off cap status i len epoch]))))))
     ;; Sort by physical offset
     (.sort blocks (fn [a b] (- (aget a 0) (aget b 0))))
     (let [blen (.-length blocks)
           show-count (if limit (min limit blen) blen)]
       (println (str "\n=== [MICROSCOPE] Physical Memory Layout (" blen " blocks) ==="))
       (println "  offset      | capacity  | status  | desc-idx | data-len | epoch | notes")
       (println "  ------------|-----------|---------|----------|----------|-------|------")
       (loop [i 0, prev-end -1, run-status -99, run-start 0, run-count 0]
         (if (>= i show-count)
           ;; Print final run summary if we have one
           (when (> run-count 1)
             (println (str "    ^ run of " run-count " " (status-name run-status) " blocks")))
           (let [b (aget blocks i)
                 off (aget b 0)
                 cap (aget b 1)
                 status (aget b 2)
                 desc-idx (aget b 3)
                 data-len (aget b 4)
                 epoch (aget b 5)
                 gap (when (pos? prev-end) (- off prev-end))
                 adjacent? (and gap (zero? gap))
                 has-gap? (and gap (pos? gap))
                 overlap? (and gap (neg? gap))
                 same-run? (== status run-status)]
             ;; Print run summary when status changes
             (when (and (not same-run?) (> run-count 1))
               (println (str "    ^ run of " run-count " " (status-name run-status) " blocks")))
             ;; Print gap/overlap
             (when has-gap?
               (println (str "  *** GAP: " gap " bytes untracked ***")))
             (when overlap?
               (println (str "  *** OVERLAP: " (- gap) " bytes ***")))
             ;; Print block
             (println (str "  "
                           (let [s (str off)] (str s (apply str (repeat (max 0 (- 12 (count s))) " "))))
                           "| "
                           (let [s (str cap)] (str s (apply str (repeat (max 0 (- 9 (count s))) " "))))
                           "| "
                           (let [s (status-name status)] (str s (apply str (repeat (max 0 (- 7 (count s))) " "))))
                           "| "
                           (let [s (str desc-idx)] (str s (apply str (repeat (max 0 (- 8 (count s))) " "))))
                           "| "
                           (let [s (str data-len)] (str s (apply str (repeat (max 0 (- 8 (count s))) " "))))
                           "| "
                           (let [s (str epoch)] (str s (apply str (repeat (max 0 (- 5 (count s))) " "))))
                           "| "
                           (when adjacent? (str (if same-run? "adj" "adj-DIFF!")))))
             (recur (inc i)
                    (+ off cap)
                    (if same-run? run-status status)
                    (if same-run? run-start i)
                    (if same-run? (inc run-count) 1)))))
       (println "=== [/MICROSCOPE] ===\n")))))

;;;;====================================================================================================
;;;; X-RAY — Storage Model Invariant Checker with Video Trace
;;;;====================================================================================================

;; Video frame buffer: stores recent frames for replay on failure
(defonce ^:private xray-frames #js [])
(def ^:const ^:private XRAY_MAX_FRAMES 20)

(defn- xray-status-char [s]
  (condp == s
    d/STATUS_FREE "."
    d/STATUS_ALLOCATED "#"
    d/STATUS_RETIRED "R"
    d/STATUS_EMBEDDED_ATOM_HEADER "E"
    d/STATUS_ORPHANED "O"
    d/STATUS_LOCKED_FOR_UPDATE "L"
    "?"))

(defn- xray-render-row
  "Render a row of ASCII art for a byte range [region-start, region-start+region-size).
   blocks is sorted JS array of #js [off cap status desc-idx].
   Returns a string of `width` chars."
  [blocks region-start region-size width char-fn]
  (let [bytes-per-col (max 1 (js/Math.ceil (/ region-size width)))
        row (make-array width)]
    (dotimes [c width] (aset row c " "))
    (dotimes [bi (.-length blocks)]
      (let [b (aget blocks bi)
            off (aget b 0) cap (aget b 1) status (aget b 2)
            end (+ off cap)
            ;; Only render the part that overlaps [region-start, region-start+region-size)
            vis-start (max off region-start)
            vis-end   (min end (+ region-start region-size))]
        (when (< vis-start vis-end)
          (let [col-start (js/Math.floor (/ (- vis-start region-start) bytes-per-col))
                col-end   (js/Math.ceil  (/ (- vis-end   region-start) bytes-per-col))
                ch (char-fn status)]
            (loop [c (max 0 col-start)]
              (when (< c (min width col-end))
                (aset row c ch)
                (recur (inc c))))))))
    (apply str (seq row))))

(defn- xray-scan
  "Scan all descriptors. Checks 12 categories of invariants:
   1. Tiling completeness (sum capacities == data region size)
   2. No gaps (no unaccounted byte ranges)
   3. No overlaps (no two descriptors claim same bytes)
   4. Mirror consistency (AoS descriptor table == SoA mirror arrays)
   5. Content-capacity bound (data_length <= block_capacity for all descriptors)
   6. Block region bounds (offset + capacity within data region)
   7. Free coalescence (no two adjacent FREE blocks — should have been merged)
   8. ZEROED means empty (ZEROED descriptors have cap=0 and off=0)
   9. Lock hygiene (FREE blocks have lock_owner=0)
  10. Epoch validity (RETIRED blocks have 0 < retired_epoch <= global_epoch)
  11. Global epoch >= all worker epochs
  12. Worker slot hygiene (no stale workers holding epoch protection)

   Returns {:blocks sorted-js-arr :mirror-blocks sorted-js-arr
            :gaps js-arr :overlaps js-arr
            :mirror-mismatches js-arr :descriptor-errors js-arr
            :total-tracked int :data-start int :data-size int
            :desc-table js-arr-of-detail-maps}.

   blocks = descriptor table view (SAB truth)
   mirror-blocks = mirror array view (redundant copy, should match)"
  [s-atom-env]
  (let [index-view (:index-view s-atom-env)
        max-descriptors (safe-max-descriptors s-atom-env)
        sab-total (u/get-sab-total-size index-view)
        data-start (u/get-data-region-start-offset index-view)
        data-size (- sab-total data-start)
        data-end (+ data-start data-size)
        global-epoch (js/Atomics.load index-view (/ d/OFFSET_GLOBAL_EPOCH d/SIZE_OF_INT32))
        [sm-start cm-start] (mirror-offsets index-view)
        blocks #js []         ;; descriptor table view (SAB truth)
        mirror-blocks #js []  ;; mirror array view (should match blocks)
        desc-table #js []     ;; full descriptor detail for frame capture
        mirror-mismatches #js []
        descriptor-errors #js []  ;; per-descriptor invariant violations
        total-tracked (volatile! 0)]
    (dotimes [i max-descriptors]
      (let [status (u/read-block-descriptor-field index-view i d/OFFSET_BD_STATUS)
            off    (u/read-block-descriptor-field index-view i d/OFFSET_BD_DATA_OFFSET)
            cap    (u/read-block-descriptor-field index-view i d/OFFSET_BD_BLOCK_CAPACITY)
            data-len (u/read-block-descriptor-field index-view i d/OFFSET_BD_DATA_LENGTH)
            val-desc (u/read-block-descriptor-field index-view i d/OFFSET_BD_VALUE_DATA_DESC_IDX)
            lock    (u/read-block-descriptor-field index-view i d/OFFSET_BD_LOCK_OWNER)
            epoch   (u/read-block-descriptor-field index-view i d/OFFSET_BD_RETIRED_EPOCH)
            mirror-status (aget index-view (+ (/ sm-start 4) i))
            mirror-cap    (aget index-view (+ (/ cm-start 4) i))]
        ;; Invariant 4: Mirror consistency
        (when (not= status mirror-status)
          (.push mirror-mismatches #js [i "status" status mirror-status]))
        (when (and (not= status d/STATUS_ZEROED_UNUSED) (not= cap mirror-cap))
          (.push mirror-mismatches #js [i "capacity" cap mirror-cap]))
        ;; Invariant 8: ZEROED means empty
        (when (== status d/STATUS_ZEROED_UNUSED)
          (when (or (not (zero? cap)) (not (zero? off)) (not (zero? data-len)))
            (.push descriptor-errors
                   #js [i "ZEROED_NOT_EMPTY" (str "cap=" cap " off=" off " len=" data-len)])))
        (when (not= status d/STATUS_ZEROED_UNUSED)
          ;; Capture full descriptor detail
          (.push desc-table #js [i status off cap data-len val-desc lock epoch
                                  mirror-status mirror-cap])
          ;; Invariant 5: Content-capacity bound
          (when (and (== status d/STATUS_ALLOCATED) (> data-len cap))
            (.push descriptor-errors
                   #js [i "DATA_EXCEEDS_CAP" (str "data_len=" data-len " > cap=" cap)]))
          ;; Invariant 6: Block region bounds
          (when (and (pos? cap)
                     (or (< off data-start) (> (+ off cap) data-end)))
            (.push descriptor-errors
                   #js [i "OUT_OF_BOUNDS" (str "off=" off " cap=" cap " range=[" off ","
                                               (+ off cap) ") data=[" data-start "," data-end ")")]))
          ;; Invariant 9: Lock hygiene — FREE blocks should have lock_owner=0
          (when (and (== status d/STATUS_FREE) (not (zero? lock)))
            (.push descriptor-errors
                   #js [i "FREE_WITH_LOCK" (str "lock_owner=" lock " on FREE block")]))
          ;; Invariant 10: Epoch validity — RETIRED blocks need valid epoch
          (when (== status d/STATUS_RETIRED)
            (when (or (<= epoch 0) (> epoch global-epoch))
              (.push descriptor-errors
                     #js [i "BAD_RETIRED_EPOCH" (str "retired_epoch=" epoch
                                                     " global_epoch=" global-epoch)])))
          ;; Invariant 10 (cont): Non-retired blocks should have retired_epoch=0
          ;; Exception: EMBED descriptors reuse RETIRED_EPOCH as a watch notification counter
          (when (and (not= status d/STATUS_RETIRED)
                     (not= status d/STATUS_EMBEDDED_ATOM_HEADER)
                     (not (zero? epoch)))
            (.push descriptor-errors
                   #js [i "STALE_EPOCH" (str "status=" status " but retired_epoch=" epoch)]))
          (when (pos? cap)
            (vswap! total-tracked + cap)
            (.push blocks #js [off cap status i]))
          ;; Also build mirror-blocks from mirror arrays for comparison
          (when (pos? mirror-cap)
            (.push mirror-blocks #js [off mirror-cap mirror-status i])))))
    (.sort blocks (fn [a b] (- (aget a 0) (aget b 0))))
    (.sort mirror-blocks (fn [a b] (- (aget a 0) (aget b 0))))
    ;; Detect gaps, overlaps, and adjacent FREE blocks
    ;; Interior gaps = gaps between allocated blocks (real memory loss)
    ;; Trailing unallocated = space after last block to end of SAB (just unused)
    (let [interior-gaps #js []
          overlaps #js []
          adjacent-free #js []  ;; Invariant 7: adjacent FREE pairs
          blen (.-length blocks)
          prev-end (volatile! data-start)
          prev-status (volatile! -99)
          prev-idx (volatile! -1)
          trailing-unallocated (volatile! nil)]
      (when (and (pos? blen) (> (aget (aget blocks 0) 0) data-start))
        (.push interior-gaps #js [data-start (- (aget (aget blocks 0) 0) data-start)]))
      (dotimes [bi blen]
        (let [b (aget blocks bi)
              off (aget b 0) cap (aget b 1) status (aget b 2) idx (aget b 3)
              end (+ off cap)]
          (when (> off @prev-end) (.push interior-gaps #js [@prev-end (- off @prev-end)]))
          (when (< off @prev-end) (.push overlaps #js [off (- @prev-end off)]))
          ;; Invariant 7: Free coalescence — adjacent FREE blocks should be merged
          (when (and (== status d/STATUS_FREE) (== @prev-status d/STATUS_FREE)
                     (== off @prev-end))
            (.push adjacent-free #js [@prev-idx idx off]))
          (vreset! prev-end (max @prev-end end))
          (vreset! prev-status status)
          (vreset! prev-idx idx)))
      ;; Trailing unallocated is NOT an error - it's just unused SAB space
      ;; Only track it for informational purposes
      (when (< @prev-end data-end)
        (vreset! trailing-unallocated #js [@prev-end (- data-end @prev-end)]))
      ;; Invariant 11: Global epoch >= all worker epochs
      (let [worker-epoch-errors #js []]
        (dotimes [slot-idx d/MAX_WORKERS]
          (let [slot-byte-offset (+ d/OFFSET_WORKER_REGISTRY_START (* slot-idx d/WORKER_SLOT_SIZE))
                slot-i32 (/ slot-byte-offset d/SIZE_OF_INT32)
                w-status (aget index-view slot-i32)
                w-epoch (aget index-view (+ slot-i32 1))]
            (when (and (== w-status d/WORKER_STATUS_ACTIVE) (pos? w-epoch)
                       (> w-epoch global-epoch))
              (.push worker-epoch-errors
                     #js [slot-idx w-epoch global-epoch]))))
        {:blocks blocks :mirror-blocks mirror-blocks
         :gaps interior-gaps :overlaps overlaps
         :trailing-unallocated @trailing-unallocated
         :mirror-mismatches mirror-mismatches
         :descriptor-errors descriptor-errors
         :adjacent-free adjacent-free
         :worker-epoch-errors worker-epoch-errors
         :total-tracked @total-tracked
         :data-start data-start :data-size data-size
         :desc-table desc-table}))))

(defn- _xray-find-active-region
  "Find the byte range where most of the action is (non-FREE blocks).
   Returns [zoom-start zoom-size] covering allocations with some padding.
   NOTE: Kept for debugging/visualization - prefix indicates intentional non-use."
  [blocks data-start data-size]
  (let [blen (.-length blocks)]
    (if (zero? blen)
      [data-start data-size]
      (let [;; Find min/max offset of non-FREE blocks
            min-off (volatile! (+ data-start data-size))
            max-end (volatile! data-start)]
        (dotimes [bi blen]
          (let [b (aget blocks bi)
                off (aget b 0) cap (aget b 1) status (aget b 2)]
            (when (not= status d/STATUS_FREE)
              (vswap! min-off min off)
              (vswap! max-end max (+ off cap)))))
        (if (>= @min-off @max-end)
          ;; All blocks are FREE — show the start region
          [data-start (min data-size 4096)]
          ;; Add 10% padding on each side
          (let [range-size (- @max-end @min-off)
                pad (max 64 (js/Math.ceil (* range-size 0.1)))
                zoom-start (max data-start (- @min-off pad))
                zoom-end   (min (+ data-start data-size) (+ @max-end pad))]
            [zoom-start (- zoom-end zoom-start)]))))))

(defn validate-storage-model!
  "X-RAY: ASCII art invariant checker with SAB vs MIRROR views side-by-side.

   TELESCOPE (SAB): Descriptor table view - the allocator's truth
   MICROSCOPE (MIRROR): Mirror array view - redundant copy for fast scan
   If these differ, memory is corrupted. Rendered side-by-side for comparison.

   Captures each frame in a rolling buffer. On failure, replays the last
   N frames so you can see the transitions that led to the break.

   Returns {:valid? bool :gaps [...] :overlaps [...] :mirror-mismatches [...]
            :frame-history [...]}."
  ([s-atom-env] (validate-storage-model! s-atom-env nil))
  ([s-atom-env {:keys [width label] :or {width 80}}]
   (let [{:keys [blocks mirror-blocks gaps overlaps trailing-unallocated
                 mirror-mismatches descriptor-errors
                 adjacent-free worker-epoch-errors
                 total-tracked data-start data-size desc-table]} (xray-scan s-atom-env)
         blen (.-length blocks)
         ;; Side-by-side: each bar gets half the width minus gap
         ;; Layout: "  |<bar>|  |<bar>|" => 2 + 1 + bar + 1 + 2 + 1 + bar + 1 = bar*2 + 8
         bar-w (max 16 (quot (- width 8) 2))
         pad-str (fn [s n] (let [len (count s)]
                             (if (>= len n) (subs s 0 n)
                                 (str s (apply str (repeat (- n len) " "))))))
         col-w (+ bar-w 2) ;; |<bar>| width
         ;; TELESCOPE (SAB): Descriptor table view - allocator's truth
         telescope-model  (xray-render-row blocks data-start data-size bar-w xray-status-char)
         ;; MICROSCOPE (MIRROR): Mirror array view - should match telescope
         ;; Render at SAME region as telescope so differences are visible
         micro-model (xray-render-row mirror-blocks data-start data-size bar-w xray-status-char)
         ;; Compute diff row: show X where telescope and microscope differ
         diff-row (let [t-arr (to-array telescope-model)
                        m-arr (to-array micro-model)
                        d-arr (make-array bar-w)]
                    (dotimes [i bar-w]
                      (aset d-arr i (if (= (aget t-arr i) (aget m-arr i)) "-" "X")))
                    (apply str (seq d-arr)))
         ;; Check if any position has an X (string contains check)
         has-view-diff (>= (.indexOf diff-row "X") 0)
         ;; Calculate interior gaps (real memory loss) vs trailing unallocated (just unused)
         interior-gap-bytes (reduce + 0 (map #(aget % 1) (array-seq gaps)))
         trailing-bytes (if trailing-unallocated (aget trailing-unallocated 1) 0)
         ;; Valid if no INTERIOR gaps, overlaps, or other violations
         ;; Trailing unallocated space is NOT an error - it's just unused SAB
         valid? (and (zero? (.-length gaps))  ;; interior gaps only
                     (zero? (.-length overlaps))
                     (zero? (.-length mirror-mismatches))
                     (zero? (.-length descriptor-errors))
                     (zero? (.-length adjacent-free))
                     (zero? (.-length worker-epoch-errors))
                     (not has-view-diff))
         ;; Paint gaps/overlaps on separate tiling row
         telescope-tiling (xray-render-row blocks data-start data-size bar-w (fn [_] "-"))
         tiling-arr (to-array telescope-tiling)
         _ (dotimes [gi (.-length gaps)]
             (let [g (aget gaps gi)
                   g-off (aget g 0) g-size (aget g 1)
                   bpc (max 1 (js/Math.ceil (/ data-size bar-w)))
                   c0 (js/Math.floor (/ (- g-off data-start) bpc))
                   c1 (js/Math.ceil (/ (- (+ g-off g-size) data-start) bpc))]
               (loop [c (max 0 c0)] (when (< c (min bar-w c1)) (aset tiling-arr c "?") (recur (inc c))))))
         _ (dotimes [oi (.-length overlaps)]
             (let [o (aget overlaps oi)
                   o-off (aget o 0) o-size (aget o 1)
                   bpc (max 1 (js/Math.ceil (/ data-size bar-w)))
                   c0 (js/Math.floor (/ (- o-off data-start) bpc))
                   c1 (js/Math.ceil (/ (- (+ o-off o-size) data-start) bpc))]
               (loop [c (max 0 c0)] (when (< c (min bar-w c1)) (aset tiling-arr c "X") (recur (inc c))))))
         telescope-tiling-final (apply str (seq tiling-arr))
         ;; Count blocks by type for descriptor table
         desc-counts (let [c #js {:free 0 :alloc 0 :retired 0 :embed 0 :orphan 0}]
                       (dotimes [bi blen]
                         (let [b (aget blocks bi)
                               status (aget b 2)]
                           (condp == status
                             d/STATUS_FREE (set! (.-free c) (inc (.-free c)))
                             d/STATUS_ALLOCATED (set! (.-alloc c) (inc (.-alloc c)))
                             d/STATUS_RETIRED (set! (.-retired c) (inc (.-retired c)))
                             d/STATUS_EMBEDDED_ATOM_HEADER (set! (.-embed c) (inc (.-embed c)))
                             d/STATUS_ORPHANED (set! (.-orphan c) (inc (.-orphan c)))
                             nil)))
                       c)
         ;; Count blocks by type for mirror arrays
         mirror-len (.-length mirror-blocks)
         mirror-counts (let [c #js {:free 0 :alloc 0 :retired 0 :embed 0 :orphan 0}]
                         (dotimes [bi mirror-len]
                           (let [b (aget mirror-blocks bi)
                                 status (aget b 2)]
                             (condp == status
                               d/STATUS_FREE (set! (.-free c) (inc (.-free c)))
                               d/STATUS_ALLOCATED (set! (.-alloc c) (inc (.-alloc c)))
                               d/STATUS_RETIRED (set! (.-retired c) (inc (.-retired c)))
                               d/STATUS_EMBEDDED_ATOM_HEADER (set! (.-embed c) (inc (.-embed c)))
                               d/STATUS_ORPHANED (set! (.-orphan c) (inc (.-orphan c)))
                               nil)))
                         c)
         ;; Build frame string for video buffer
         frame-lines #js []
         pr! (fn [s] (.push frame-lines s))
         scale (max 1 (js/Math.ceil (/ data-size bar-w)))
         ;; Status count summary string
         count-str (fn [^js c] (str "F=" (.-free c) " A=" (.-alloc c) " R=" (.-retired c)
                                    " E=" (.-embed c) " O=" (.-orphan c)))]
     ;; Build the frame — side-by-side layout
     (pr! (str "  " (or label "") " | desc:" blen " mirror:" mirror-len " blk | " total-tracked
               "/" data-size " (" (js/Math.round (* 100 (/ total-tracked data-size))) "%)"))
     ;; Headers - SAB vs MIRROR for clarity
     (pr! (str "  "
               (pad-str (str "SAB/DESC (1col=" scale "B)") col-w)
               "  "
               (str "MIRROR (1col=" scale "B)")))
     ;; Model bars side-by-side
     (pr! (str "  |" telescope-model "|  |" micro-model "|"))
     ;; Diff row - shows X where views disagree
     (pr! (str "  |" diff-row "|  " (if has-view-diff "!! SAB≠MIRROR !!" "SAB=MIRROR OK")))
     ;; Tiling row (shows gaps/overlaps)
     (pr! (str "  |" telescope-tiling-final "| gaps/overlaps  (?=gap X=overlap)"))
     ;; Counts side-by-side
     (pr! (str "  "
               (pad-str (count-str desc-counts) col-w)
               "  "
               (count-str mirror-counts)))
     (when-not valid?
       (pr! (str "  !! FAIL: interior-gaps=" (.-length gaps)
                 " (" interior-gap-bytes "B)"
                 " overlaps=" (.-length overlaps)
                 " mirror-mismatch=" (.-length mirror-mismatches)
                 " desc-err=" (.-length descriptor-errors)
                 " adj-free=" (.-length adjacent-free)
                 " worker-epoch=" (.-length worker-epoch-errors)
                 (when has-view-diff " VIEW-DIFF=YES"))))
     ;; Always show trailing unallocated info (not an error, just informational)
     (when (and trailing-unallocated (pos? trailing-bytes))
       (pr! (str "  (trailing-unallocated=" trailing-bytes "B - not an error, just unused SAB)")))
     ;; Build descriptor table lines for the frame
     ;; Format: idx | status | offset | capacity | data_len | val_desc | lock | epoch
     (let [desc-lines #js []]
       (.push desc-lines "  DESCRIPTORS (non-ZEROED):")
       (.push desc-lines "    idx  | status | offset     | capacity  | data_len  | val_desc | lock | epoch")
       (.push desc-lines "    -----|--------|------------|-----------|-----------|----------|------|------")
       (dotimes [di (.-length desc-table)]
         (let [d (aget desc-table di)
               idx (aget d 0) st (aget d 1) off (aget d 2) cap (aget d 3)
               dlen (aget d 4) vd (aget d 5) lk (aget d 6) ep (aget d 7)
               sn (status-name st)
               ;; Only show first 30 + last 5 to keep frame size manageable
               show? (or (< di 30) (>= di (- (.-length desc-table) 5)))]
           (when show?
             (.push desc-lines
                    (str "    " (let [s (str idx)] (str s (apply str (repeat (max 0 (- 5 (count s))) " "))))
                         "| " (let [s sn] (str s (apply str (repeat (max 0 (- 7 (count s))) " "))))
                         "| " (let [s (str off)] (str s (apply str (repeat (max 0 (- 11 (count s))) " "))))
                         "| " (let [s (str cap)] (str s (apply str (repeat (max 0 (- 10 (count s))) " "))))
                         "| " (let [s (str dlen)] (str s (apply str (repeat (max 0 (- 10 (count s))) " "))))
                         "| " (let [s (str vd)] (str s (apply str (repeat (max 0 (- 9 (count s))) " "))))
                         "| " (let [s (str lk)] (str s (apply str (repeat (max 0 (- 5 (count s))) " "))))
                         "| " ep)))
           (when (and (== di 30) (> (.-length desc-table) 35))
             (.push desc-lines (str "    ... (" (- (.-length desc-table) 35) " more) ...")))))
       ;; Store frame with full detail
       (let [frame {:label label :valid? valid?
                    :lines (vec (array-seq frame-lines))
                    :desc-lines (vec (array-seq desc-lines))}]
         (.push xray-frames frame)
         (when (> (.-length xray-frames) XRAY_MAX_FRAMES)
           (.shift xray-frames))))
     ;; Print current frame (compact: just ASCII art + summary)
     (println)
     (doseq [line (array-seq frame-lines)]
       (println line))
     (if valid?
       (println (str "  PASS"))
       (println (str "  !! INVARIANT VIOLATION !!")))
     ;; On failure: replay ALL frames with full descriptor tables
     (when-not valid?
       (println "\n=== [X-RAY VIDEO] Last frames before failure ===")
       (dotimes [fi (.-length xray-frames)]
         (let [f (aget xray-frames fi)]
           (println (str "\n--- Frame " (inc fi) "/" (.-length xray-frames)
                         (when (:label f) (str " [" (:label f) "]"))
                         (if (:valid? f) " PASS" " FAIL") " ---"))
           ;; ASCII art lines
           (doseq [line (:lines f)]
             (println line))
           ;; Descriptor table
           (doseq [line (:desc-lines f)]
             (println line))))
       (println "\n=== [/X-RAY VIDEO] ===")
       ;; Detailed violations
       (when (pos? (.-length gaps))
         (println (str "\n  INTERIOR GAPS (" (.-length gaps) ") - memory between allocations not tracked:"))
         (dotimes [gi (min 10 (.-length gaps))]
           (let [g (aget gaps gi)]
             (println (str "    offset=" (aget g 0) " size=" (aget g 1) "B")))))
       (when trailing-unallocated
         (println (str "\n  TRAILING UNALLOCATED (not an error - just unused SAB space):"))
         (println (str "    offset=" (aget trailing-unallocated 0)
                       " size=" (aget trailing-unallocated 1) "B")))
       (when (pos? (.-length overlaps))
         (println (str "\n  OVERLAPS (" (.-length overlaps) "):"))
         (dotimes [oi (min 10 (.-length overlaps))]
           (let [o (aget overlaps oi)]
             (println (str "    offset=" (aget o 0) " size=" (aget o 1) "B")))))
       (when (pos? (.-length mirror-mismatches))
         (println (str "\n  MIRROR MISMATCHES (" (.-length mirror-mismatches) "):"))
         (dotimes [mi (min 10 (.-length mirror-mismatches))]
           (let [m (aget mirror-mismatches mi)]
             (println (str "    desc[" (aget m 0) "] " (aget m 1)
                           ": descriptor=" (aget m 2) " mirror=" (aget m 3))))))
       (when (pos? (.-length descriptor-errors))
         (println (str "\n  DESCRIPTOR ERRORS (" (.-length descriptor-errors) "):"))
         (dotimes [di (min 20 (.-length descriptor-errors))]
           (let [e (aget descriptor-errors di)]
             (println (str "    desc[" (aget e 0) "] " (aget e 1) ": " (aget e 2))))))
       (when (pos? (.-length adjacent-free))
         (println (str "\n  UNCOALESCED ADJACENT FREE BLOCKS (" (.-length adjacent-free) "):"))
         (dotimes [ai (min 10 (.-length adjacent-free))]
           (let [a (aget adjacent-free ai)]
             (println (str "    desc[" (aget a 0) "] + desc[" (aget a 1)
                           "] meet at offset " (aget a 2))))))
       (when (pos? (.-length worker-epoch-errors))
         (println (str "\n  WORKER EPOCH VIOLATIONS (" (.-length worker-epoch-errors) "):"))
         (dotimes [wi (min 10 (.-length worker-epoch-errors))]
           (let [w (aget worker-epoch-errors wi)]
             (println (str "    worker slot " (aget w 0) " epoch=" (aget w 1)
                           " > global_epoch=" (aget w 2)))))))
     {:valid? valid?
      :view-diff has-view-diff
      :gaps (vec (map (fn [g] {:offset (aget g 0) :size (aget g 1)}) (array-seq gaps)))
      :overlaps (vec (map (fn [o] {:offset (aget o 0) :size (aget o 1)}) (array-seq overlaps)))
      :mirror-mismatches (vec (map (fn [m] {:desc-idx (aget m 0) :field (aget m 1)
                                             :descriptor-val (aget m 2) :mirror-val (aget m 3)})
                                    (array-seq mirror-mismatches)))
      :descriptor-errors (vec (map (fn [e] {:desc-idx (aget e 0) :kind (aget e 1) :detail (aget e 2)})
                                    (array-seq descriptor-errors)))
      :adjacent-free (vec (map (fn [a] {:desc-a (aget a 0) :desc-b (aget a 1) :boundary (aget a 2)})
                                (array-seq adjacent-free)))
      :worker-epoch-errors (vec (map (fn [w] {:slot (aget w 0) :epoch (aget w 1) :global (aget w 2)})
                                      (array-seq worker-epoch-errors)))
      :tracked total-tracked :expected data-size
      ;; Include frame history for error reporting
      :frame-history (vec (map (fn [f] {:label (:label f) :valid? (:valid? f)
                                         :lines (:lines f) :desc-lines (:desc-lines f)})
                               (array-seq xray-frames)))})))

(defn xray-replay!
  "Replay the X-RAY video buffer — print all captured frames with descriptor tables."
  []
  (println "\n=== [X-RAY VIDEO REPLAY] ===")
  (dotimes [fi (.-length xray-frames)]
    (let [f (aget xray-frames fi)]
      (println (str "\n--- Frame " (inc fi) "/" (.-length xray-frames)
                    (when (:label f) (str " [" (:label f) "]"))
                    (if (:valid? f) " PASS" " FAIL") " ---"))
      (doseq [line (:lines f)]
        (println line))
      (doseq [line (:desc-lines f)]
        (println line))))
  (println "=== [/X-RAY VIDEO REPLAY] ==="))

;;;;====================================================================================================
;;;; X-RAY Transaction Guard — before/after swap! invariant checking
;;;;====================================================================================================
;; When enabled, every swap!/reset! runs validate-storage-model! before and after
;; the transaction. On failure, prints the violation and throws.
;; Enable with (set-xray-guard! true). Disable with (set-xray-guard! false).
;; A registered HAMT validator callback (set by sab_map.cljs) adds tree-level checks.

(defonce ^:private xray-guard-enabled (volatile! false))
(defonce ^:private xray-guard-count (volatile! 0))
(defonce ^:private xray-hamt-validator-fn (volatile! nil))
;; Slab x-ray callback — registered by eve.cljs to avoid circular dep
(defonce ^:private slab-xray-validate-fn (volatile! nil))

(defn set-xray-guard!
  "Enable or disable X-RAY transaction guard. When enabled, every swap!/reset!
   runs invariant checks before and after the transaction. Throws on violation.
   Use for debugging intermittent corruption. Disable for production."
  [enabled?]
  (vreset! xray-guard-enabled enabled?)
  (when enabled?
    (vreset! xray-guard-count 0)
    ;; Clear frame buffer for fresh trace
    (set! (.-length xray-frames) 0))
  (println (str "[X-RAY GUARD] " (if enabled? "ENABLED" "DISABLED"))))

(defn xray-guard-enabled?
  "Returns true if the X-RAY transaction guard is currently enabled."
  []
  @xray-guard-enabled)

(defn register-xray-hamt-validator!
  "Register a HAMT tree validator function.
   Called with (validator-fn root-offset) where root-offset is the slab-qualified
   HAMT root offset. Should return {:valid? bool :errors [...]} map.
   Set by map.cljs at load time."
  [f]
  (vreset! xray-hamt-validator-fn f))

(defn register-slab-xray-validator!
  "Register the slab allocator x-ray validator function.
   Called with (validator-fn label) to run slab-xray-validate!.
   Set by eve.cljs to avoid circular dependency."
  [f]
  (vreset! slab-xray-validate-fn f))

(defn- build-xray-error-msg
  "Build detailed error message with frame history."
  [tag result]
  (let [sb (js/Array.)
        push! (fn [s] (.push sb s))]
    (push! (str "[X-RAY GUARD] Storage model invariant violated at " tag))
    (push! (str "  gaps=" (count (:gaps result))
                " overlaps=" (count (:overlaps result))
                " mirror-mismatch=" (count (:mirror-mismatches result))
                " view-diff=" (:view-diff result)
                " lost=" (- (:expected result) (:tracked result)) "B"))
    ;; Include frame history
    (push! "\n=== FRAME HISTORY (last frames before failure) ===")
    (doseq [{:keys [label valid? lines desc-lines]} (:frame-history result)]
      (push! (str "\n--- " (or label "Frame") (if valid? " PASS" " FAIL") " ---"))
      (doseq [line lines]
        (push! line))
      ;; Include first 10 descriptor lines only (avoid huge error messages)
      (when desc-lines
        (doseq [line (take 10 desc-lines)]
          (push! line))
        (when (> (count desc-lines) 10)
          (push! (str "  ... (" (- (count desc-lines) 10) " more lines) ...")))))
    (push! "\n=== /FRAME HISTORY ===")
    (.join sb "\n")))

(defn- xray-guard-check!
  "Run X-RAY storage model check. Returns true if valid, throws on violation
   with full frame history included in the error message."
  [s-atom-env phase label]
  (let [n (vswap! xray-guard-count inc)
        tag (str "TX" n " " phase (when label (str " " label)))
        result (validate-storage-model! s-atom-env {:width 80 :label tag})]
    (when-not (:valid? result)
      (throw (js/Error. (build-xray-error-msg tag result))))
    true))

;; NIL_OFFSET constant (same as eve-alloc/NIL_OFFSET, defined here to avoid circular dep)
(def ^:const ^:private HAMT_NIL_OFFSET -1)

(defn get-eve-map-header-offset
  "Extract the EveHashMap header slab-qualified offset from s-atom-env.
   Returns the header offset, or -1 if empty/invalid.
   The HAMT validator in map.cljs can then resolve this and read the root-off."
  [s-atom-env]
  (let [index-view (:index-view s-atom-env)
        dv (wasm/data-view)
        u8 (wasm/u8-view)
        root-desc-idx (js/Atomics.load index-view (/ d/OFFSET_ATOM_ROOT_DATA_DESC_IDX d/SIZE_OF_INT32))]
    (if (== root-desc-idx d/ROOT_POINTER_NIL_SENTINEL)
      HAMT_NIL_OFFSET
      (let [root-data-off (u/read-block-descriptor-field index-view root-desc-idx d/OFFSET_BD_DATA_OFFSET)
            root-data-len (u/read-block-descriptor-field index-view root-desc-idx d/OFFSET_BD_DATA_LENGTH)]
        (if (or (< root-data-len 7)
                (not= (aget u8 root-data-off) d/DIRECT_MAGIC_0)
                (not= (aget u8 (inc root-data-off)) d/DIRECT_MAGIC_1))
          HAMT_NIL_OFFSET
          ;; Return the slab-qualified header offset (don't try to read from it here)
          (.getInt32 dv (+ root-data-off 3) true))))))

(defn- xray-guard-hamt-check!
  "Run registered HAMT validator if available.
   Extracts the EveHashMap header offset from s-atom-env and passes it to the validator.
   The validator (in map.cljs) resolves the header and reads the HAMT root-off."
  [s-atom-env phase]
  (if-let [hamt-fn @xray-hamt-validator-fn]
    (let [header-off (get-eve-map-header-offset s-atom-env)]
      (println (str "[HAMT-CHECK] " phase " header-off=" header-off))
      (if (> header-off 0)
        (let [result (hamt-fn header-off)]
          (println (str "[HAMT-CHECK] " phase " root-off=" (:root-off result)
                        " nodes=" (:node-count result) " valid?=" (:valid? result)))
          (when-not (:valid? result)
            (println (str "[X-RAY GUARD] HAMT tree invalid at " phase ":"))
            (println (str "  header-off=" header-off " (0x" (.toString header-off 16) ")"))
            (println (str "  root-off=" (:root-off result) " (0x" (.toString (or (:root-off result) 0) 16) ")"))
            (println (str "  nodes=" (:node-count result) " max-depth=" (:max-depth result)))
            (doseq [err (:errors result)]
              (println (str "  ERROR: " err)))
            (throw (js/Error. (str "[X-RAY GUARD] HAMT tree invalid at " phase
                                   ": " (count (:errors result)) " errors"
                                   " (header-off=0x" (.toString header-off 16) ")")))))
        (println (str "[HAMT-CHECK] " phase " skipped (header-off <= 0)"))))
    (println (str "[HAMT-CHECK] " phase " skipped (no validator registered)"))))

(defn alloc
  "Allocate a block of requested-size-bytes.
   Uses WASM-accelerated descriptor scan when available, JS fallback otherwise.
   Uses alloc-cursor for O(1) amortized allocation.
   On OOM, sweeps retired blocks and retries before failing.
   Returns {:offset :descriptor-idx} on success, {:error ...} on failure.
   NOTE: requested-size-bytes is rounded up to 4-byte alignment so that
   block splits always produce 4-byte-aligned data offsets.  This is
   required for correct Int32Array / Atomics access on the returned offset."
  [s-atom-env requested-size-bytes]
  (let [requested-size-bytes (bit-and (+ requested-size-bytes 3) (bit-not 3))
        index-view (:index-view s-atom-env)
        max-descriptors (safe-max-descriptors s-atom-env)
        try-alloc (fn []
                    (if @wasm/wasm-ready
                      (alloc-wasm index-view max-descriptors requested-size-bytes s-atom-env)
                      (alloc-js index-view max-descriptors requested-size-bytes s-atom-env)))
        result (try-alloc)]
    (if result
      {:offset (aget result 0) :descriptor-idx (aget result 1)}
      ;; OOM — sweep retired blocks and retry up to 5 times with spin-wait.
      ;; The spin-wait lets other workers complete their swaps and clear their
      ;; read-epoch slots, advancing min-active-epoch so more retired blocks
      ;; become freeable on the next sweep pass.
      (loop [attempt 0]
        (if (< attempt 5)
          (do
            ;; Advance epoch to help move min-active forward
            (increment-epoch! s-atom-env)
            (let [freed (sweep-retired-blocks! s-atom-env)]
              (if-let [r (try-alloc)]
                {:offset (aget r 0) :descriptor-idx (aget r 1)}
                (do
                  ;; Spin-wait: yield CPU so other workers can finish + advance epochs
                  (u/yield-cpu (min (* (inc attempt) 2) 10))
                  (recur (inc attempt))))))
          ;; Final fallback: recover any trailing unallocated space.
          ;; Scan all descriptors to find the high-water mark (max offset+capacity),
          ;; then claim the trailing SAB tail as a new FREE block if large enough.
          (let [sab-total (js/Atomics.load index-view (/ d/OFFSET_SAB_TOTAL_SIZE d/SIZE_OF_INT32))
                data-region-start (js/Atomics.load index-view (/ d/OFFSET_DATA_REGION_START d/SIZE_OF_INT32))
                hwm (loop [i 0 hwm data-region-start]
                      (if (>= i max-descriptors)
                        hwm
                        (let [status (u/read-block-descriptor-field index-view i d/OFFSET_BD_STATUS)]
                          (if (== status d/STATUS_ZEROED_UNUSED)
                            (recur (inc i) hwm)
                            (let [off (u/read-block-descriptor-field index-view i d/OFFSET_BD_DATA_OFFSET)
                                  cap (u/read-block-descriptor-field index-view i d/OFFSET_BD_BLOCK_CAPACITY)
                                  end (+ off cap)]
                              (recur (inc i) (max hwm end)))))))
                trailing (- sab-total hwm)]
            (if (>= trailing requested-size-bytes)
              ;; Find a ZEROED_UNUSED descriptor to hold the tail as a FREE block
              (let [wid (or d/*worker-id* -1)
                    tail-desc
                    (loop [i 0]
                      (when (< i max-descriptors)
                        (let [status (u/read-block-descriptor-field index-view i d/OFFSET_BD_STATUS)]
                          (if (== status d/STATUS_ZEROED_UNUSED)
                            (let [lf (+ (u/get-block-descriptor-base-int32-offset i)
                                        (/ d/OFFSET_BD_LOCK_OWNER d/SIZE_OF_INT32))]
                              (if (== 0 (u/atomic-compare-exchange-int index-view lf 0 wid))
                                (do
                                  (u/write-block-descriptor-field! index-view i d/OFFSET_BD_DATA_OFFSET hwm)
                                  (u/write-block-descriptor-field! index-view i d/OFFSET_BD_BLOCK_CAPACITY trailing)
                                  (u/write-block-descriptor-field! index-view i d/OFFSET_BD_DATA_LENGTH 0)
                                  (u/write-block-descriptor-field! index-view i d/OFFSET_BD_VALUE_DATA_DESC_IDX d/ROOT_POINTER_NIL_SENTINEL)
                                  (u/write-block-descriptor-field! index-view i d/OFFSET_BD_RETIRED_EPOCH 0)
                                  (u/write-block-descriptor-field! index-view i d/OFFSET_BD_STATUS d/STATUS_FREE)
                                  (update-mirrors! index-view i d/STATUS_FREE trailing)
                                  (u/atomic-store-int index-view lf 0)
                                  i)
                                (recur (inc i))))
                            (recur (inc i))))))]
                (if tail-desc
                  (if-let [r (try-alloc)]
                    {:offset (aget r 0) :descriptor-idx (aget r 1)}
                    (do (dump-block-stats! s-atom-env)
                        (dump-block-detail! s-atom-env {:limit 40})
                        {:error :out-of-memory}))
                  (do (dump-block-stats! s-atom-env)
                      (dump-block-detail! s-atom-env {:limit 40})
                      {:error :out-of-memory})))
              (do (dump-block-stats! s-atom-env)
                  (dump-block-detail! s-atom-env {:limit 40})
                  (validate-storage-model! s-atom-env)
                  {:error :out-of-memory}))))))))

;; Root-pointer block pool — avoids expensive free/alloc cycle for atom root blocks.
;; Root pointer serialization is always 7 bytes (SAB pointer encoding).
;; After a successful CAS, the old root block can be pooled instead of freed,
;; and reused on the next swap!/reset! — skipping lock acquisition + reader check + descriptor scan.
;;
;; EPOCH SAFETY: Pool entries include the epoch at which the block was pooled.
;; A pooled block is only safe to reuse when get-min-active-epoch > pooled-epoch,
;; meaning no concurrent reader is still deserializing from the block's data offset.
;; This prevents the data race where Worker A reuses a pooled block and overwrites
;; its data while Worker B is mid-deserialization of the same bytes.
(defonce ^:private root-block-pool #js [])
(def ^:const ^:private ROOT_POOL_MAX 16)

(defn- pool-root-block!
  "Pool an old root pointer block for epoch-safe reuse.
   Records the current epoch so take-safe-pool-root-block! can check safety.
   Returns true if pooled, false if pool full."
  [s-atom-env offset desc-idx]
  (let [epoch (get-current-epoch s-atom-env)]
    (if (< (.-length root-block-pool) ROOT_POOL_MAX)
      (do (.push root-block-pool #js [offset desc-idx epoch]) true)
      false)))

(defn- take-safe-pool-root-block!
  "Take the oldest pooled root block if epoch-safe (no concurrent readers).
   Returns #js [offset desc-idx] on success, nil if pool empty or not yet safe."
  [s-atom-env]
  (when (pos? (.-length root-block-pool))
    (let [oldest (aget root-block-pool 0)
          pooled-epoch (aget oldest 2)
          min-active (get-min-active-epoch s-atom-env)]
      (when (or (nil? min-active) (> min-active pooled-epoch))
        (.shift root-block-pool)
        #js [(aget oldest 0) (aget oldest 1)]))))

(defn- alloc-root-block
  "Allocate a block for root pointer storage.
   Returns #js [offset descriptor-idx] on success, nil on failure.
   Uses JS array instead of CLJS map to avoid PersistentArrayMap allocation per swap.
   Tries epoch-safe pool first (O(1)), falls back to full alloc (descriptor scan)."
  [s-atom-env size]
  (let [result (or (take-safe-pool-root-block! s-atom-env)
                   (let [result (alloc s-atom-env size)]
                     (when-not (:error result)
                       #js [(:offset result) (:descriptor-idx result)])))]
    result))

(defn reset-root-pool!
  "Clear the root block pool. Called when SAB environment changes."
  []
  (set! (.-length root-block-pool) 0))

(defn start-read! [s-atom-env descriptor-idx]
  (let [log-prefix (str "[W:" d/*worker-id* " StartRead desc:" descriptor-idx "] ")
        rm-view (:reader-map-view s-atom-env)]
    (if (and rm-view (.-buffer rm-view) (> (.-length rm-view) 0))
      (let [map-idx (u/get-reader-map-idx descriptor-idx)]
        (if (or (< map-idx 0) (>= map-idx (.-length rm-view)))
          (do
            (println log-prefix "CRITICAL_SR - Reader map IDX OUT OF BOUNDS:" map-idx)
            {:status :error :reason :sr-map-idx-bounds})
          (let [old-val-before-add (u/atomic-add-int rm-view map-idx 1)
                new-val-after-add (inc old-val-before-add)]
            ;; Verbose SR logging disabled for perf
            #_(println (str "SR;" d/*worker-id* ";" descriptor-idx ";" map-idx ";" (js/performance.now) ";" new-val-after-add))
            {:status :ok :map-idx map-idx :new-count new-val-after-add})))
      (do (println log-prefix "CRITICAL_SR - Invalid reader-map-view:" (pr-str rm-view))
          {:status :error :reason :sr-invalid-rm-view}))))

(defn- check-readers [s-atom-env descriptor-idx]
  (if-let [rm-view (:reader-map-view s-atom-env)]
    (if (and rm-view (.-buffer rm-view) (> (.-length rm-view) 0))
      (let [map_idx (u/get-reader-map-idx descriptor-idx)]
        (if (or (< map_idx 0) (>= map_idx (.-length rm-view)))
          (do (println (str "[W:" d/*worker-id* " CheckReaders] CRITICAL - IDX OUT OF BOUNDS:" map_idx " for desc:" descriptor-idx))
              {:error :cr-map-idx-bounds})
          (loop [retries 400]
            (let [current-readers (u/atomic-load-int rm-view map_idx)]
              (cond
                (zero? current-readers) :ok
                (< current-readers 0)
                (do (println (str "[W:" d/*worker-id* " CheckReaders] CRITICAL_ERROR - Negative reader count " current-readers " for desc_idx:" descriptor-idx " (map_idx:" map_idx ")"))
                    {:error :cr-negative-count :count current-readers})
                (pos? retries)
                (do
                  (when (= 0 (mod retries 100))
                    (println (str "[W:" d/*worker-id* " CheckReaders] Waiting on desc_idx:" descriptor-idx "(map_idx:" map_idx "), count:" current-readers ", retries left:" retries)))
                  (u/yield-cpu 0.01)
                  (recur (dec retries)))
                :else
                (do
                  (println (str "[W:" d/*worker-id* " CheckReaders] Timeout waiting for readers on desc_idx:" descriptor-idx "(map_idx:" map_idx "), count:" current-readers))
                  {:error :cr-timeout :count current-readers}))))))
      (do (println (str "[W:" d/*worker-id* " CheckReaders] Invalid rm-view for desc_idx:" descriptor-idx)) :ok))
    (do (println (str "[W:" d/*worker-id* " CheckReaders] :reader-map-view is nil for desc_idx:" descriptor-idx)) :ok)))

(defn end-read! [s-atom-env target-descriptor-idx worker-id-for-log]
  (let [log-prefix (str "[W:" worker-id-for-log " EndRead desc:" target-descriptor-idx "] ")
        index-view (:index-view s-atom-env)
        rm-view (:reader-map-view s-atom-env)]
    (if (and rm-view (.-buffer rm-view) (> (.-length rm-view) 0))
      (let [map-idx (u/get-reader-map-idx target-descriptor-idx)]
        (if (or (< map-idx 0) (>= map-idx (.-length rm-view)))
          (println log-prefix "CRITICAL_ER - Reader map IDX OUT OF BOUNDS:" map-idx)
          (let [current-val-before-sub (u/atomic-load-int rm-view map-idx)]
            (if (<= current-val-before-sub 0)
              (println log-prefix "CRITICAL_ER_PRE_SUB - Count for map_idx:" map-idx " is ALREADY " current-val-before-sub ". NOT decrementing.")
              (let [old-val-returned-by-sub (u/atomic-sub-int rm-view map-idx 1)
                    new-val-after-sub (dec old-val-returned-by-sub)]
                ;; Verbose ER logging disabled for perf
                #_(println (str "ER;" worker-id-for-log ";" target-descriptor-idx ";" map-idx ";" (js/performance.now) ";" new-val-after-sub
                              ";(was " old-val-returned-by-sub ")"))
                (when (< new-val-after-sub 0)
                  (println log-prefix "CRITICAL_ER_POST_SUB - Reader count for map_idx:" map-idx " WENT NEGATIVE:" new-val-after-sub)))))))
      (println log-prefix "CRITICAL_ER - Invalid reader-map-view:" (pr-str rm-view)))

   ;; Orphaned block cleanup logic
    (when (and index-view (.-buffer index-view)) ; Ensure index-view is valid
      (let [current_block_status (u/read-block-descriptor-field index-view target-descriptor-idx d/OFFSET_BD_STATUS)]
        (when (= current_block_status d/STATUS_ORPHANED)
          (let [log-prefix-cleanup (str "[W:" worker-id-for-log " EndReadCleanup desc:" target-descriptor-idx "] ")
                lock_owner_field_idx (+ (u/get-block-descriptor-base-int32-offset target-descriptor-idx) (/ d/OFFSET_BD_LOCK_OWNER d/SIZE_OF_INT32))]
           ;; (println log-prefix-cleanup "Block is ORPHANED. Attempting cleanup.")
           ;; Try to acquire lock with a few retries for orphan cleanup
            (loop [lock-cleanup-retries 5]
              (if (== 0 (u/atomic-compare-exchange-int index-view lock_owner_field_idx 0 worker-id-for-log))
                (try
                 ;; (println log-prefix-cleanup "Lock ACQUIRED.")
                 ;; CRITICAL: Re-verify status AND reader count while holding the lock
                  (let [status_now (u/read-block-descriptor-field index-view target-descriptor-idx d/OFFSET_BD_STATUS)
                        reader-check-result-final (check-readers s-atom-env target-descriptor-idx)]
                    (if (and (= status_now d/STATUS_ORPHANED) (= :ok reader-check-result-final))
                      (do
                        (println log-prefix-cleanup "Confirmed ORPHANED and LAST READER. Performing final free.")
                        (u/write-block-descriptor-field! index-view target-descriptor-idx d/OFFSET_BD_DATA_LENGTH 0)
                        (u/write-block-descriptor-field! index-view target-descriptor-idx d/OFFSET_BD_VALUE_DATA_DESC_IDX d/ROOT_POINTER_NIL_SENTINEL)
                        (u/write-block-descriptor-field! index-view target-descriptor-idx d/OFFSET_BD_STATUS d/STATUS_FREE)
                        (update-mirrors! index-view target-descriptor-idx d/STATUS_FREE nil)
                        (let [max-descriptors (safe-max-descriptors s-atom-env)]
                          (coalesce-adjacent-free-blocks! index-view max-descriptors target-descriptor-idx)))
                      (when (not= status_now d/STATUS_ORPHANED) (println log-prefix-cleanup "Status changed from ORPHANED to " status_now " during cleanup."))))
                  (finally (u/atomic-store-int index-view lock_owner_field_idx 0)))
                (when (pos? lock-cleanup-retries)
                  #_(println log-prefix-cleanup "Could not acquire lock for ORPHANED cleanup. Retrying lock.")
                  (u/yield-cpu 0.01)
                  (recur (dec lock-cleanup-retries)))))))))))

#_(defn end-read! [s-atom-env target-descriptor-idx worker-id-for-log]
    (let [log-prefix (str "[W:" worker-id-for-log " EndRead desc:" target-descriptor-idx "] ")
          index-view (:index-view s-atom-env)
          rm-view (:reader-map-view s-atom-env)]
      (if (and rm-view (.-buffer rm-view) (> (.-length rm-view) 0))
        (let [map-idx (u/get-reader-map-idx target-descriptor-idx)]
          (if (or (< map-idx 0) (>= map-idx (.-length rm-view)))
            (println log-prefix "CRITICAL_ER - Reader map IDX OUT OF BOUNDS:" map-idx)
            (let [current-val-before-sub (u/atomic-load-int rm-view map-idx)]
              (if (<= current-val-before-sub 0)
                (println log-prefix "CRITICAL_ER_PRE_SUB - Count for map_idx:" map-idx " is ALREADY " current-val-before-sub ". NOT decrementing.")
                (let [old-val-returned-by-sub (u/atomic-sub-int rm-view map-idx 1)
                      new-val-after-sub (dec old-val-returned-by-sub)]
                  (println (str "ER;" worker-id-for-log ";" target-descriptor-idx ";" map-idx ";" (js/performance.now) ";" new-val-after-sub
                                ";(was " old-val-returned-by-sub ")"))
                  (when (< new-val-after-sub 0)
                    (println log-prefix "CRITICAL_ER_POST_SUB - Reader count for map_idx:" map-idx " WENT NEGATIVE:" new-val-after-sub)))))))
        (println log-prefix "CRITICAL_ER - Invalid reader-map-view:" (pr-str rm-view)))

      (when (and index-view (.-buffer index-view))
        (let [current_block_status (u/read-block-descriptor-field index-view target-descriptor-idx d/OFFSET_BD_STATUS)]
          (when (= current_block_status d/STATUS_ORPHANED)
            (let [lock_owner_field_idx (+ (u/get-block-descriptor-base-int32-offset target-descriptor-idx) (/ d/OFFSET_BD_LOCK_OWNER d/SIZE_OF_INT32))]
              (if (== 0 (u/atomic-compare-exchange-int index-view lock_owner_field_idx 0 worker-id-for-log))
                (try
                  (let [status_now (u/read-block-descriptor-field index-view target-descriptor-idx d/OFFSET_BD_STATUS)
                        reader-check-result-final (check-readers s-atom-env target-descriptor-idx)]
                    (if (and (= status_now d/STATUS_ORPHANED) (= :ok reader-check-result-final))
                      (do
                        (println log-prefix "ORPHANED_CLEANUP: desc " target-descriptor-idx " - Confirmed last reader, performing final free.")
                        (u/write-block-descriptor-field! index-view target-descriptor-idx d/OFFSET_BD_DATA_LENGTH 0)
                        (u/write-block-descriptor-field! index-view target-descriptor-idx d/OFFSET_BD_VALUE_DATA_DESC_IDX d/ROOT_POINTER_NIL_SENTINEL)
                        (u/write-block-descriptor-field! index-view target-descriptor-idx d/OFFSET_BD_STATUS d/STATUS_FREE))
                      (when (not= status_now d/STATUS_ORPHANED) (println log-prefix "ORPHANED_CLEANUP: desc " target-descriptor-idx " - Status changed from ORPHANED to " status_now " during cleanup attempt."))))
                  (finally (u/atomic-store-int index-view lock_owner_field_idx 0)))
                #_(println log-prefix "ORPHANED_CLEANUP: desc " target-descriptor-idx " - Could not acquire lock.")))))) ; Minimal logging for this case
      :ok))

;;;;====================================================================================================
;;;; Block Coalescing — merge adjacent free blocks to prevent fragmentation
;;;;====================================================================================================

(defn- find-physically-adjacent-left-free-neighbor
  "Find a FREE descriptor whose block ends exactly where `current-desc-idx`'s block starts.
   i.e. neighbor.data_offset + neighbor.block_capacity == current.data_offset.
   Returns the neighbor's desc-idx, or -1 if not found.
   Caller must already hold the lock on current-desc-idx."
  [index-view max-descriptors current-desc-idx current-data-offset]
  (loop [i 0]
    (if (>= i max-descriptors)
      -1
      (if (== i current-desc-idx)
        (recur (inc i))
        (let [status (u/read-block-descriptor-field index-view i d/OFFSET_BD_STATUS)]
          (if (== status d/STATUS_FREE)
            (let [n-offset (u/read-block-descriptor-field index-view i d/OFFSET_BD_DATA_OFFSET)
                  n-capacity (u/read-block-descriptor-field index-view i d/OFFSET_BD_BLOCK_CAPACITY)]
              (if (== (+ n-offset n-capacity) current-data-offset)
                i
                (recur (inc i))))
            (recur (inc i))))))))

(defn- find-physically-adjacent-right-free-neighbor
  "Find a FREE descriptor whose block starts exactly where `current-desc-idx`'s block ends.
   i.e. neighbor.data_offset == current.data_offset + current.block_capacity.
   Returns the neighbor's desc-idx, or -1 if not found.
   Caller must already hold the lock on current-desc-idx."
  [index-view max-descriptors current-desc-idx current-block-end-offset]
  (loop [i 0]
    (if (>= i max-descriptors)
      -1
      (if (== i current-desc-idx)
        (recur (inc i))
        (let [status (u/read-block-descriptor-field index-view i d/OFFSET_BD_STATUS)]
          (if (== status d/STATUS_FREE)
            (let [n-offset (u/read-block-descriptor-field index-view i d/OFFSET_BD_DATA_OFFSET)]
              (if (== n-offset current-block-end-offset)
                i
                (recur (inc i))))
            (recur (inc i))))))))

(defn- coalesce-adjacent-free-blocks!
  "After freeing a block, merge with physically adjacent free blocks.
   Caller must already hold the lock on desc-idx. The current block must be STATUS_FREE.

   Left coalesce:  expand left neighbor to include our block, then mark us as ZEROED_UNUSED.
   Right coalesce: expand the survivor (us or the left absorber) to include right neighbor.

   CRITICAL: The left neighbor's lock is held continuously through both left and right
   merges to prevent TOCTOU races where another worker could allocate the survivor
   between left-lock-release and right-merge.

   Acquires locks on neighbor descriptors via CAS before modifying.
   If a neighbor lock fails (contention), skip that side — partial coalescing is safe."
  [index-view max-descriptors desc-idx]
  (let [our-offset (u/read-block-descriptor-field index-view desc-idx d/OFFSET_BD_DATA_OFFSET)
        our-capacity (u/read-block-descriptor-field index-view desc-idx d/OFFSET_BD_BLOCK_CAPACITY)
        ;; --- Left coalesce ---
        ;; Find a FREE block whose end abuts our start.
        ;; Use volatile to track left lock field so it stays held through right merge.
        left-lock-field-v (volatile! nil)
        left-idx (find-physically-adjacent-left-free-neighbor
                   index-view max-descriptors desc-idx our-offset)
        survivor-idx
        (if (== left-idx -1)
          desc-idx ;; No left neighbor — we are the survivor
          (let [llf (+ (u/get-block-descriptor-base-int32-offset left-idx)
                       (/ d/OFFSET_BD_LOCK_OWNER d/SIZE_OF_INT32))]
            (if (== 0 (u/atomic-compare-exchange-int index-view llf 0 d/*worker-id*))
              (let [left-status (u/read-block-descriptor-field index-view left-idx d/OFFSET_BD_STATUS)]
                (if (== left-status d/STATUS_FREE)
                  (let [left-capacity (u/read-block-descriptor-field index-view left-idx d/OFFSET_BD_BLOCK_CAPACITY)
                        merged-capacity (+ left-capacity our-capacity)]
                    ;; Expand left to include us
                    (u/write-block-descriptor-field! index-view left-idx d/OFFSET_BD_BLOCK_CAPACITY merged-capacity)
                    (update-mirrors! index-view left-idx d/STATUS_FREE merged-capacity)
                    ;; Mark ourselves as unused (reclaim descriptor slot)
                    (u/write-block-descriptor-field! index-view desc-idx d/OFFSET_BD_STATUS d/STATUS_ZEROED_UNUSED)
                    (u/write-block-descriptor-field! index-view desc-idx d/OFFSET_BD_DATA_OFFSET 0)
                    (u/write-block-descriptor-field! index-view desc-idx d/OFFSET_BD_BLOCK_CAPACITY 0)
                    (update-mirrors! index-view desc-idx d/STATUS_ZEROED_UNUSED 0)
                    ;; Left is survivor — KEEP lock held for right merge
                    (vreset! left-lock-field-v llf)
                    left-idx)
                  (do (u/atomic-store-int index-view llf 0) ;; Left status changed — release
                      desc-idx)))
              desc-idx)))] ;; Couldn't lock left — we are the survivor
    ;; --- Right coalesce ---
    ;; survivor-idx is the FREE block owning our merged range.
    ;; If left merge succeeded, we still hold left's lock (left-lock-field-v is non-nil),
    ;; so no other worker can allocate the survivor — no TOCTOU race.
    (let [survivor-end (+ (u/read-block-descriptor-field index-view survivor-idx d/OFFSET_BD_DATA_OFFSET)
                          (u/read-block-descriptor-field index-view survivor-idx d/OFFSET_BD_BLOCK_CAPACITY))
          right-idx (find-physically-adjacent-right-free-neighbor
                      index-view max-descriptors survivor-idx survivor-end)]
      (when (not= right-idx -1)
        (let [right-lock-field (+ (u/get-block-descriptor-base-int32-offset right-idx)
                                  (/ d/OFFSET_BD_LOCK_OWNER d/SIZE_OF_INT32))]
          (when (== 0 (u/atomic-compare-exchange-int index-view right-lock-field 0 d/*worker-id*))
            (let [right-status (u/read-block-descriptor-field index-view right-idx d/OFFSET_BD_STATUS)]
              (when (== right-status d/STATUS_FREE)
                (let [surv-capacity (u/read-block-descriptor-field index-view survivor-idx d/OFFSET_BD_BLOCK_CAPACITY)
                      right-capacity (u/read-block-descriptor-field index-view right-idx d/OFFSET_BD_BLOCK_CAPACITY)
                      merged-capacity (+ surv-capacity right-capacity)]
                  ;; Expand survivor to include right
                  (u/write-block-descriptor-field! index-view survivor-idx d/OFFSET_BD_BLOCK_CAPACITY merged-capacity)
                  (update-mirrors! index-view survivor-idx d/STATUS_FREE merged-capacity)
                  ;; Mark right as unused
                  (u/write-block-descriptor-field! index-view right-idx d/OFFSET_BD_STATUS d/STATUS_ZEROED_UNUSED)
                  (u/write-block-descriptor-field! index-view right-idx d/OFFSET_BD_DATA_OFFSET 0)
                  (u/write-block-descriptor-field! index-view right-idx d/OFFSET_BD_BLOCK_CAPACITY 0)
                  (update-mirrors! index-view right-idx d/STATUS_ZEROED_UNUSED 0))))
            (u/atomic-store-int index-view right-lock-field 0)))))
    ;; Release left lock if still held (left merge succeeded)
    (when-let [llf @left-lock-field-v]
      (u/atomic-store-int index-view llf 0))))

;;;;====================================================================================================
;;;; Free with Retry Bounce
;;;;====================================================================================================

(def ^:const FREE_RETRY_BOUNCES 8)
(def ^:const FREE_RETRY_BASE_DELAY_MS 2)

(defn- free-once
  "Single attempt to free a descriptor. Returns outcome map.
   When readers are active, returns {:error :active-readers} WITHOUT marking ORPHANED
   (the caller decides whether to retry or give up and mark ORPHANED)."
  [s-atom-env desc-idx-to-free]
  (let [index-view (:index-view s-atom-env)
        max-descriptors (safe-max-descriptors s-atom-env)
        lock-owner-field-idx (+ (u/get-block-descriptor-base-int32-offset desc-idx-to-free) (/ d/OFFSET_BD_LOCK_OWNER d/SIZE_OF_INT32))
        log-prefix (str "[W:" d/*worker-id* " Free desc:" desc-idx-to-free "] ")]
    (loop [lock-retries 400]
      (if (zero? lock-retries)
        (do (println log-prefix "!!! FAILED to lock descriptor for freeing after retries.")
            {:error :free-lock-timeout})
        (if (== 0 (u/atomic-compare-exchange-int index-view lock-owner-field-idx 0 d/*worker-id*))
          (let [status-initially (u/read-block-descriptor-field index-view desc-idx-to-free d/OFFSET_BD_STATUS)
                lock-cleared-by-clear-descriptor? (volatile! false)
                processing-outcome
                (try
                  (cond
                    (== status-initially d/STATUS_ALLOCATED)
                    (let [reader-check-outcome (check-readers s-atom-env desc-idx-to-free)]
                      (if (= :ok reader-check-outcome)
                        (do
                          (u/write-block-descriptor-field! index-view desc-idx-to-free d/OFFSET_BD_DATA_LENGTH 0)
                          (u/write-block-descriptor-field! index-view desc-idx-to-free d/OFFSET_BD_VALUE_DATA_DESC_IDX d/ROOT_POINTER_NIL_SENTINEL)
                          (u/write-block-descriptor-field! index-view desc-idx-to-free d/OFFSET_BD_STATUS d/STATUS_FREE)
                          (update-mirrors! index-view desc-idx-to-free d/STATUS_FREE nil)
                          (coalesce-adjacent-free-blocks! index-view max-descriptors desc-idx-to-free)
                          {:success true :type :data-block-freed})
                        ;; Return :active-readers — caller (free) decides to retry or mark ORPHANED
                        {:error :active-readers :details reader-check-outcome}))

                    (== status-initially d/STATUS_EMBEDDED_ATOM_HEADER)
                    (do
                      (clear-descriptor-fields! index-view desc-idx-to-free)
                      ;; Lock is released by finally block, not by clear-descriptor-fields!
                      (u/write-block-descriptor-field! index-view desc-idx-to-free d/OFFSET_BD_STATUS d/STATUS_ZEROED_UNUSED)
                      {:success true :type :atom-header-freed})

                    (== status-initially d/STATUS_ORPHANED)
                    (let [reader-check-outcome (check-readers s-atom-env desc-idx-to-free)]
                      (if (= :ok reader-check-outcome)
                        (do
                          (u/write-block-descriptor-field! index-view desc-idx-to-free d/OFFSET_BD_DATA_LENGTH 0)
                          (u/write-block-descriptor-field! index-view desc-idx-to-free d/OFFSET_BD_VALUE_DATA_DESC_IDX d/ROOT_POINTER_NIL_SENTINEL)
                          (u/write-block-descriptor-field! index-view desc-idx-to-free d/OFFSET_BD_STATUS d/STATUS_FREE)
                          (update-mirrors! index-view desc-idx-to-free d/STATUS_FREE nil)
                          (coalesce-adjacent-free-blocks! index-view max-descriptors desc-idx-to-free)
                          {:success true :type :orphaned-block-cleaned-by-free})
                        {:error :active-readers :details reader-check-outcome}))

                    (or (== status-initially d/STATUS_FREE) (== status-initially d/STATUS_ZEROED_UNUSED))
                    {:success true :type :already-handled}

                    :else {:error :unknown-state-during-free, :status status-initially})
                  (finally
                    (when-not @lock-cleared-by-clear-descriptor?
                      (u/atomic-store-int index-view lock-owner-field-idx 0))))]
            processing-outcome)
          (recur (dec lock-retries)))))))

(defn free
  "Free a descriptor with retry bounce on active readers.
   Tries up to FREE_RETRY_BOUNCES times with exponential backoff (2ms, 4ms, 8ms, 16ms)
   before giving up and marking as ORPHANED. Uses yield-cpu for CPU-friendly sleeping."
  [s-atom-env desc-idx-to-free]
  (loop [bounce 0]
    (let [outcome (free-once s-atom-env desc-idx-to-free)]
      (cond
        ;; Success or non-reader error — return immediately
        (or (:success outcome)
            (and (:error outcome) (not= :active-readers (:error outcome))))
        outcome

        ;; Active readers and bounces remaining — wait and retry
        (and (= :active-readers (:error outcome))
             (< bounce FREE_RETRY_BOUNCES))
        (do
          ;; Exponential backoff: 2ms, 4ms, 8ms, 16ms
          (let [delay-ms (* FREE_RETRY_BASE_DELAY_MS (bit-shift-left 1 bounce))]
            (u/yield-cpu delay-ms))
          (recur (inc bounce)))

        ;; Out of bounces — mark as ORPHANED and return
        :else
        (let [index-view (:index-view s-atom-env)
              lock-owner-field-idx (+ (u/get-block-descriptor-base-int32-offset desc-idx-to-free)
                                      (/ d/OFFSET_BD_LOCK_OWNER d/SIZE_OF_INT32))]
          ;; Try to acquire lock to mark ORPHANED
          (loop [retries 50]
            (when (pos? retries)
              (if (== 0 (u/atomic-compare-exchange-int index-view lock-owner-field-idx 0 d/*worker-id*))
                (do
                  (let [status (u/read-block-descriptor-field index-view desc-idx-to-free d/OFFSET_BD_STATUS)]
                    (when (== status d/STATUS_ALLOCATED)
                      (u/write-block-descriptor-field! index-view desc-idx-to-free d/OFFSET_BD_STATUS d/STATUS_ORPHANED)
                      (update-mirrors! index-view desc-idx-to-free d/STATUS_ORPHANED nil)))
                  (u/atomic-store-int index-view lock-owner-field-idx 0))
                (recur (dec retries)))))
          {:error :active-readers-became-orphaned :details (:details outcome)})))))

;;;;====================================================================================================
;;;; Epoch-Based GC: Worker Registry
;;;;====================================================================================================

(defn- get-worker-slot-byte-offset
  "Calculate byte offset for a worker slot in the registry."
  [slot-idx]
  (+ d/OFFSET_WORKER_REGISTRY_START (* slot-idx d/WORKER_SLOT_SIZE)))

(defn- get-worker-slot-int32-offset
  "Calculate Int32Array index for start of a worker slot."
  [slot-idx]
  (/ (get-worker-slot-byte-offset slot-idx) d/SIZE_OF_INT32))

(defn register-worker!
  "Claim a slot in the worker registry. Returns slot index or nil if registry full.
   Should be called once per worker at startup."
  [s-atom-env worker-id]
  (let [index-view (:index-view s-atom-env)]
    (loop [slot-idx 0]
      (when (< slot-idx d/MAX_WORKERS)
        (let [slot-int32-offset (get-worker-slot-int32-offset slot-idx)
              status-idx slot-int32-offset]
          (if (== d/WORKER_STATUS_INACTIVE
                  (js/Atomics.compareExchange index-view status-idx
                                              d/WORKER_STATUS_INACTIVE
                                              d/WORKER_STATUS_ACTIVE))
            ;; Successfully claimed this slot
            (let [slot-byte-offset (get-worker-slot-byte-offset slot-idx)]
              ;; Write worker ID
              (js/Atomics.store index-view
                                (/ (+ slot-byte-offset d/OFFSET_WS_WORKER_ID) d/SIZE_OF_INT32)
                                worker-id)
              ;; Clear current epoch (not reading)
              (js/Atomics.store index-view
                                (/ (+ slot-byte-offset d/OFFSET_WS_CURRENT_EPOCH) d/SIZE_OF_INT32)
                                0)
              ;; Update heartbeat
              (update-heartbeat! s-atom-env slot-idx)
              slot-idx)
            ;; Slot taken, try next
            (recur (inc slot-idx))))))))

(defn unregister-worker!
  "Release a worker slot. Should be called when worker shuts down."
  [s-atom-env slot-idx]
  (when (and (>= slot-idx 0) (< slot-idx d/MAX_WORKERS))
    (let [index-view (:index-view s-atom-env)
          slot-int32-offset (get-worker-slot-int32-offset slot-idx)]
      ;; Clear epoch first
      (js/Atomics.store index-view
                        (+ slot-int32-offset (/ d/OFFSET_WS_CURRENT_EPOCH d/SIZE_OF_INT32))
                        0)
      ;; Mark as inactive
      (js/Atomics.store index-view slot-int32-offset d/WORKER_STATUS_INACTIVE))))

(defn- ensure-worker-registered!
  "Lazily register this worker in the SAB worker registry for epoch-based GC.
   Returns the slot index. Idempotent per SAB — each SAB gets its own slot.
   Uses index-view as the cache key since each SAB has a unique Int32Array."
  [s-atom-env]
  (let [iv (:index-view s-atom-env)]
    (or (.get worker-slot-map iv)
        (let [wid (or d/*worker-id*
                      ;; Generate a non-zero ID and persist it for CAS locks
                      (let [id (inc (js/Math.floor (* (js/Math.random) 2147483646)))]
                        (set! d/*worker-id* id)
                        id))
              slot (register-worker! s-atom-env wid)]
          (when slot (.set worker-slot-map iv slot))
          slot))))

(defn update-heartbeat!
  "Update worker's heartbeat timestamp. Should be called periodically."
  [s-atom-env slot-idx]
  (when (and (>= slot-idx 0) (< slot-idx d/MAX_WORKERS))
    (let [index-view (:index-view s-atom-env)
          slot-byte-offset (get-worker-slot-byte-offset slot-idx)
          now (js/Date.now)
          lo (bit-and now 0xFFFFFFFF)
          hi (unsigned-bit-shift-right now 32)]
      (js/Atomics.store index-view
                        (/ (+ slot-byte-offset d/OFFSET_WS_HEARTBEAT_LO) d/SIZE_OF_INT32)
                        lo)
      (js/Atomics.store index-view
                        (/ (+ slot-byte-offset d/OFFSET_WS_HEARTBEAT_HI) d/SIZE_OF_INT32)
                        hi))))

(defn- read-heartbeat
  "Read a worker's heartbeat timestamp."
  [index-view slot-idx]
  (let [slot-byte-offset (get-worker-slot-byte-offset slot-idx)
        lo (js/Atomics.load index-view
                            (/ (+ slot-byte-offset d/OFFSET_WS_HEARTBEAT_LO) d/SIZE_OF_INT32))
        hi (js/Atomics.load index-view
                            (/ (+ slot-byte-offset d/OFFSET_WS_HEARTBEAT_HI) d/SIZE_OF_INT32))]
    ;; Reconstruct 64-bit timestamp (JS numbers can handle up to 2^53)
    ;; Use >>> 0 (bit-shift-right-zero-fill) to coerce signed int32 to unsigned
    (+ (bit-shift-right-zero-fill lo 0) (* (bit-shift-right-zero-fill hi 0) 0x100000000))))

(defn check-worker-liveness
  "Check if a worker is still alive based on heartbeat. Returns true if alive."
  [s-atom-env slot-idx]
  (let [index-view (:index-view s-atom-env)
        heartbeat (read-heartbeat index-view slot-idx)
        now (js/Date.now)]
    (< (- now heartbeat) d/HEARTBEAT_TIMEOUT_MS)))

(defn mark-stale-workers!
  "Scan registry and mark workers with stale heartbeats.
   Returns count of workers marked stale."
  [s-atom-env]
  (let [index-view (:index-view s-atom-env)]
    (loop [slot-idx 0
           stale-count 0]
      (if (< slot-idx d/MAX_WORKERS)
        (let [slot-int32-offset (get-worker-slot-int32-offset slot-idx)
              status (js/Atomics.load index-view slot-int32-offset)]
          (if (== status d/WORKER_STATUS_ACTIVE)
            (if (check-worker-liveness s-atom-env slot-idx)
              (recur (inc slot-idx) stale-count)
              ;; Worker is stale - try to mark it
              (do
                (js/Atomics.compareExchange index-view slot-int32-offset
                                            d/WORKER_STATUS_ACTIVE
                                            d/WORKER_STATUS_STALE)
                (recur (inc slot-idx) (inc stale-count))))
            (recur (inc slot-idx) stale-count)))
        stale-count))))

;;;;====================================================================================================
;;;; Epoch-Based GC: Epoch Management
;;;;====================================================================================================

(defn get-current-epoch
  "Read the current global epoch."
  [s-atom-env]
  (js/Atomics.load (:index-view s-atom-env) (/ d/OFFSET_GLOBAL_EPOCH d/SIZE_OF_INT32)))

(defn increment-epoch!
  "Atomically increment global epoch. Returns the NEW epoch value."
  [s-atom-env]
  (inc (js/Atomics.add (:index-view s-atom-env) (/ d/OFFSET_GLOBAL_EPOCH d/SIZE_OF_INT32) 1)))

(defn begin-read!
  "Begin a read operation - record current epoch in worker slot.
   Returns the epoch being read. Must be paired with end-read-epoch!."
  [s-atom-env slot-idx]
  (let [index-view (:index-view s-atom-env)
        epoch (get-current-epoch s-atom-env)
        slot-byte-offset (get-worker-slot-byte-offset slot-idx)]
    ;; Record that this worker is reading at this epoch
    (js/Atomics.store index-view
                      (/ (+ slot-byte-offset d/OFFSET_WS_CURRENT_EPOCH) d/SIZE_OF_INT32)
                      epoch)
    epoch))

(defn end-read-epoch!
  "End a read operation - clear epoch from worker slot."
  [s-atom-env slot-idx]
  (let [index-view (:index-view s-atom-env)
        slot-byte-offset (get-worker-slot-byte-offset slot-idx)]
    (js/Atomics.store index-view
                      (/ (+ slot-byte-offset d/OFFSET_WS_CURRENT_EPOCH) d/SIZE_OF_INT32)
                      0)))

(defn get-min-active-epoch
  "Find the minimum epoch still being read by any active (non-stale) worker.
   When no worker is actively reading (all epochs=0), returns the current global
   epoch as a safe fallback. This prevents try-free-retired! from freeing ALL
   retired blocks when workers are between operations — a worker could start
   reading the next microsecond and walk into a freed node. By returning the
   current epoch, only blocks retired at earlier epochs are freed."
  [s-atom-env]
  (let [index-view (:index-view s-atom-env)]
    (loop [slot-idx 0
           min-epoch nil]
      (if (< slot-idx d/MAX_WORKERS)
        (let [slot-int32-offset (get-worker-slot-int32-offset slot-idx)
              status (js/Atomics.load index-view slot-int32-offset)]
          ;; Only consider ACTIVE workers (ignore INACTIVE and STALE)
          (if (== status d/WORKER_STATUS_ACTIVE)
            (let [slot-byte-offset (get-worker-slot-byte-offset slot-idx)
                  epoch (js/Atomics.load index-view
                                         (/ (+ slot-byte-offset d/OFFSET_WS_CURRENT_EPOCH) d/SIZE_OF_INT32))]
              ;; Only count if actually reading (epoch > 0)
              (if (and (pos? epoch)
                       (or (nil? min-epoch) (< epoch min-epoch)))
                (recur (inc slot-idx) epoch)
                (recur (inc slot-idx) min-epoch)))
            (recur (inc slot-idx) min-epoch)))
        ;; Fallback: if no active reader found, use current epoch to protect
        ;; blocks retired at the current epoch (a worker could begin reading
        ;; immediately and see the current root, which references these blocks).
        (or min-epoch (get-current-epoch s-atom-env))))))

;;;;====================================================================================================
;;;; Epoch-Based GC: Cooperative Block Retirement & Cleanup
;;;;====================================================================================================

(defn retire-block!
  "Mark a block as retired at the current epoch.
   Called by writer after successful update to mark old blocks for cleanup.
   Returns true if successfully retired, false if already being processed."
  [s-atom-env descriptor-idx]
  (let [index-view (:index-view s-atom-env)
        current-epoch (get-current-epoch s-atom-env)
        desc-base (u/get-block-descriptor-base-int32-offset descriptor-idx)
        status-idx (+ desc-base (/ d/OFFSET_BD_STATUS d/SIZE_OF_INT32))]
    ;; CAS status from ALLOCATED to RETIRED
    (when (== d/STATUS_ALLOCATED
              (js/Atomics.compareExchange index-view status-idx
                                          d/STATUS_ALLOCATED
                                          d/STATUS_RETIRED))
      ;; Record the epoch when retired
      (u/write-block-descriptor-field! index-view descriptor-idx
                                       d/OFFSET_BD_RETIRED_EPOCH current-epoch)
      (update-mirrors! index-view descriptor-idx d/STATUS_RETIRED nil)
      true)))

(defn try-free-retired!
  "Try to free a retired block if safe (no readers in its epoch or earlier,
   AND no active start-read! reader count).
   Returns :freed, :has-readers, or :not-retired.
   This is the cooperative cleanup - call opportunistically."
  [s-atom-env descriptor-idx]
  (let [index-view (:index-view s-atom-env)
        status (u/read-block-descriptor-field index-view descriptor-idx d/OFFSET_BD_STATUS)]
    (if (== status d/STATUS_RETIRED)
      (let [retired-epoch (u/read-block-descriptor-field index-view descriptor-idx
                                                         d/OFFSET_BD_RETIRED_EPOCH)
            min-active (get-min-active-epoch s-atom-env)]
        (if (or (nil? min-active) (> min-active retired-epoch))
          ;; Epoch-safe — also check start-read!/end-read! reader count.
          ;; Deref readers don't register epochs but DO call start-read!,
          ;; so we must ensure no active deref readers before freeing.
          (let [rm-view (:reader-map-view s-atom-env)
                readers-ok? (if rm-view
                              (let [map-idx (u/get-reader-map-idx descriptor-idx)]
                                (or (< map-idx 0) (>= map-idx (.-length rm-view))
                                    (zero? (u/atomic-load-int rm-view map-idx))))
                              true)]
            (if-not readers-ok?
              :has-readers
              (let [lock-owner-idx (+ (u/get-block-descriptor-base-int32-offset descriptor-idx)
                                      (/ d/OFFSET_BD_LOCK_OWNER d/SIZE_OF_INT32))]
                ;; Try to acquire lock for cleanup
                (if (== 0 (js/Atomics.compareExchange index-view lock-owner-idx 0 (or d/*worker-id* -1)))
                  (try
                    ;; Re-check status under lock
                    (let [status-now (u/read-block-descriptor-field index-view descriptor-idx d/OFFSET_BD_STATUS)]
                      (if (== status-now d/STATUS_RETIRED)
                        (do
                          (u/write-block-descriptor-field! index-view descriptor-idx d/OFFSET_BD_DATA_LENGTH 0)
                          (u/write-block-descriptor-field! index-view descriptor-idx d/OFFSET_BD_VALUE_DATA_DESC_IDX d/ROOT_POINTER_NIL_SENTINEL)
                          (u/write-block-descriptor-field! index-view descriptor-idx d/OFFSET_BD_RETIRED_EPOCH 0)
                          (u/write-block-descriptor-field! index-view descriptor-idx d/OFFSET_BD_STATUS d/STATUS_FREE)
                          (update-mirrors! index-view descriptor-idx d/STATUS_FREE nil)
                          ;; Coalesce with adjacent free blocks to prevent fragmentation
                          (coalesce-adjacent-free-blocks! index-view (safe-max-descriptors s-atom-env) descriptor-idx)
                          :freed)
                        ;; Status changed while we were getting lock
                        :not-retired))
                    (finally
                      (js/Atomics.store index-view lock-owner-idx 0)))
                  ;; Couldn't get lock - someone else is handling it
                  :has-readers))))
          ;; Still has readers in that epoch / grace period not met
          :has-readers))
      :not-retired)))

(defn- sweep-retired-blocks-simd!
  "SIMD-accelerated sweep: use v128 scan over status mirror to find retired
   descriptors, then only try-free-retired! on those. O(N/4) scan + O(R) frees."
  [s-atom-env index-view max-descriptors]
  (let [sm (:status-mirror-start s-atom-env)
        scratch (:scratch-region-start s-atom-env)
        count-found (wasm/find-retired-descriptors-simd
                      sm max-descriptors scratch max-descriptors)]
    (if (zero? count-found)
      0
      (loop [i 0
             freed-count 0]
        (if (< i count-found)
          (let [desc-idx (aget index-view (+ (/ scratch 4) i))
                result (try-free-retired! s-atom-env desc-idx)]
            (recur (inc i)
                   (if (= result :freed) (inc freed-count) freed-count)))
          freed-count)))))

(defn- try-free-orphaned!
  "Try to free an orphaned block via free-once (which includes coalescing).
   Returns :freed if successfully freed, :has-readers if still referenced."
  [s-atom-env descriptor-idx]
  (let [index-view (:index-view s-atom-env)
        status (u/read-block-descriptor-field index-view descriptor-idx d/OFFSET_BD_STATUS)]
    (if (== status d/STATUS_ORPHANED)
      (let [result (free-once s-atom-env descriptor-idx)]
        ;; free-once already coalesces on success
        (if (:success result) :freed :has-readers))
      :not-orphaned)))

(defn- batch-coalesce-free-blocks!
  "Single-pass coalesce: collect all FREE blocks, sort by physical offset,
   merge adjacent pairs. O(N + F*log(F)) where F = free blocks.
   Runs AFTER sweep so no per-block O(N) neighbor scans during freeing.
   Uses ordered lock acquisition (lower desc-idx first) to prevent deadlock."
  [index-view max-descriptors]
  (let [free-blocks #js []]
    ;; Collect all FREE blocks: [offset, capacity, desc-idx]
    (dotimes [i max-descriptors]
      (let [status (u/read-block-descriptor-field index-view i d/OFFSET_BD_STATUS)]
        (when (== status d/STATUS_FREE)
          (.push free-blocks #js [(u/read-block-descriptor-field index-view i d/OFFSET_BD_DATA_OFFSET)
                                  (u/read-block-descriptor-field index-view i d/OFFSET_BD_BLOCK_CAPACITY)
                                  i]))))
    (.sort free-blocks (fn [a b] (- (aget a 0) (aget b 0))))
    (let [len (.-length free-blocks)]
      (when (> len 1)
        (loop [i 1, merged 0, surv-i 0]
          (if (>= i len)
            merged
            (let [s (aget free-blocks surv-i)
                  c (aget free-blocks i)
                  s-end (+ (aget s 0) (aget s 1))]
              (if (== s-end (aget c 0))
                ;; Adjacent — try to absorb c into survivor
                (let [c-idx (aget c 2)
                      s-idx (aget s 2)
                      wid (or d/*worker-id* -1)
                      ;; Lock BOTH survivor and consumed before merging.
                      ;; Without locking the survivor, the allocator can claim it
                      ;; between our scan and the capacity write → overlap corruption.
                      s-lock (+ (u/get-block-descriptor-base-int32-offset s-idx)
                                (/ d/OFFSET_BD_LOCK_OWNER d/SIZE_OF_INT32))
                      c-lock (+ (u/get-block-descriptor-base-int32-offset c-idx)
                                (/ d/OFFSET_BD_LOCK_OWNER d/SIZE_OF_INT32))]
                  (if (== 0 (u/atomic-compare-exchange-int index-view s-lock 0 wid))
                    ;; Got survivor lock — verify still FREE
                    (let [s-status (u/read-block-descriptor-field index-view s-idx d/OFFSET_BD_STATUS)]
                      (if (== s-status d/STATUS_FREE)
                        (if (== 0 (u/atomic-compare-exchange-int index-view c-lock 0 wid))
                          ;; Got consumed lock — verify still FREE
                          (let [c-status (u/read-block-descriptor-field index-view c-idx d/OFFSET_BD_STATUS)]
                            (if (== c-status d/STATUS_FREE)
                              (let [new-cap (+ (aget s 1) (aget c 1))]
                                ;; Expand survivor
                                (u/write-block-descriptor-field! index-view s-idx d/OFFSET_BD_BLOCK_CAPACITY new-cap)
                                (update-mirrors! index-view s-idx d/STATUS_FREE new-cap)
                                ;; Zero out consumed
                                (u/write-block-descriptor-field! index-view c-idx d/OFFSET_BD_STATUS d/STATUS_ZEROED_UNUSED)
                                (u/write-block-descriptor-field! index-view c-idx d/OFFSET_BD_DATA_OFFSET 0)
                                (u/write-block-descriptor-field! index-view c-idx d/OFFSET_BD_BLOCK_CAPACITY 0)
                                (update-mirrors! index-view c-idx d/STATUS_ZEROED_UNUSED 0)
                                ;; Release both locks
                                (u/atomic-store-int index-view c-lock 0)
                                (u/atomic-store-int index-view s-lock 0)
                                ;; Update survivor's capacity in array for chained merges
                                (aset s 1 new-cap)
                                (recur (inc i) (inc merged) surv-i))
                              ;; Consumed not FREE — release both, skip
                              (do (u/atomic-store-int index-view c-lock 0)
                                  (u/atomic-store-int index-view s-lock 0)
                                  (recur (inc i) merged i))))
                          ;; Couldn't lock consumed — release survivor, skip
                          (do (u/atomic-store-int index-view s-lock 0)
                              (recur (inc i) merged i)))
                        ;; Survivor not FREE — release, new survivor
                        (do (u/atomic-store-int index-view s-lock 0)
                            (recur (inc i) merged i))))
                    ;; Couldn't lock survivor — skip to new survivor
                    (recur (inc i) merged i)))
                ;; Not adjacent — new survivor
                (recur (inc i) merged i)))))))))

(defn sweep-retired-blocks!
  "GC sweep: scan for retired and orphaned blocks, free those safe to free,
   then batch-coalesce all free blocks to prevent fragmentation.
   Returns count of blocks freed. Call this periodically or opportunistically.
   Uses SIMD-accelerated status mirror scan when available for retired blocks,
   then does a scalar pass for orphaned blocks."
  [s-atom-env]
  (let [index-view (:index-view s-atom-env)
        max-descriptors (safe-max-descriptors s-atom-env)]
    ;; First, mark stale workers to release their epochs
    (mark-stale-workers! s-atom-env)
    ;; Sweep retired blocks — SIMD path when available
    (let [retired-freed
          (if (and @wasm/wasm-ready (:status-mirror-start s-atom-env))
            (sweep-retired-blocks-simd! s-atom-env index-view max-descriptors)
            ;; Scalar fallback for retired
            (loop [desc-idx 0
                   freed-count 0]
              (if (< desc-idx max-descriptors)
                (let [result (try-free-retired! s-atom-env desc-idx)]
                  (recur (inc desc-idx)
                         (if (= result :freed) (inc freed-count) freed-count)))
                freed-count)))
          ;; Also sweep orphaned blocks (from prior :free mode failures)
          orphaned-freed
          (loop [desc-idx 0
                 freed-count 0]
            (if (< desc-idx max-descriptors)
              (let [status (u/read-block-descriptor-field index-view desc-idx d/OFFSET_BD_STATUS)]
                (if (== status d/STATUS_ORPHANED)
                  (let [result (try-free-orphaned! s-atom-env desc-idx)]
                    (recur (inc desc-idx)
                           (if (= result :freed) (inc freed-count) freed-count)))
                  (recur (inc desc-idx) freed-count)))
              freed-count))
          total-freed (+ retired-freed orphaned-freed)]
      ;; Batch coalesce after freeing to prevent fragmentation
      ;; without the per-block O(N) neighbor scans that made sweep O(N²)
      (when (pos? total-freed)
        (batch-coalesce-free-blocks! index-view max-descriptors))
      total-freed)))

;;;;====================================================================================================
;;;; Proactive Left-Compaction
;;;;====================================================================================================
;; After each transaction (post-CAS), workers probabilistically sweep + compact
;; ONE block: scan left-to-right, find an ALLOC block that fits into a FREE block
;; to its left, move data, retire old location. Over time this packs live data
;; leftward and consolidates free space rightward.
;;
;; Invariant: "scan from left, free blocks to the left" — new allocs naturally
;; fill the left side first, creating a compaction gradient.

;; Compaction temperature: probability 0.0–1.0 that a given transaction triggers
;; a sweep+compact pass. 1.0 = always sweep (required for high concurrency to
;; prevent descriptor exhaustion from retired blocks accumulating faster than swept).
(defonce compaction-temperature (volatile! 1.0))

(defn set-compaction-temperature!
  "Set compaction probability (0.0 = never, 1.0 = always)."
  [t]
  (vreset! compaction-temperature (max 0.0 (min 1.0 t))))

;; Callback: called when a block is physically moved [old-off new-off old-desc new-desc].
;; sab_map.cljs hooks this to keep its offset→desc map in sync.
(defonce ^:private on-block-moved-fn (volatile! nil))

(defn set-on-block-moved-fn!
  "Register callback for block move events. fn [old-off new-off old-desc-idx new-desc-idx]."
  [f]
  (vreset! on-block-moved-fn f))

;; HAMT bitmap node constants (inline to avoid circular dep with sab_map)
(def ^:const ^:private COMPACT_BITMAP_TYPE 1)  ;; sab_map/NODE_TYPE_BITMAP
(def ^:const ^:private COMPACT_HEADER_SIZE 12) ;; sab_map/NODE_HEADER_SIZE

(defn- compact-popcount32
  "Popcount for a 32-bit integer (inline, no dependency on sab_map)."
  [n]
  (let [n (- n (bit-and (unsigned-bit-shift-right n 1) 0x55555555))
        n (+ (bit-and n 0x33333333) (bit-and (unsigned-bit-shift-right n 2) 0x33333333))
        n (bit-and (+ n (unsigned-bit-shift-right n 4)) 0x0f0f0f0f)
        n (+ n (unsigned-bit-shift-right n 8))
        n (+ n (unsigned-bit-shift-right n 16))]
    (bit-and n 0x3f)))

(defn- find-and-update-hamt-parent!
  "After moving a block from old-offset to new-offset, scan all ALLOC blocks
   to find the HAMT parent whose child pointer matches old-offset and update it.
   Also checks the atom root chain for the root HAMT node case.
   Returns true if a parent was found and updated, false otherwise."
  [s-atom-env index-view max-descriptors old-offset new-offset]
  (let [dv (wasm/data-view)]
    (or
     ;; Phase 1: Scan ALLOC blocks for HAMT bitmap parents with matching child offset
     (loop [i 0]
       (when (< i max-descriptors)
         (let [status (u/read-block-descriptor-field index-view i d/OFFSET_BD_STATUS)]
           (if (== status d/STATUS_ALLOCATED)
             (let [data-off (u/read-block-descriptor-field index-view i d/OFFSET_BD_DATA_OFFSET)
                   data-len (u/read-block-descriptor-field index-view i d/OFFSET_BD_DATA_LENGTH)]
               ;; Bitmap node: type byte == 1 AND data_len > 12 (excludes EveHashMap headers)
               (if (and (>= data-len 16) (== (.getUint8 dv data-off) COMPACT_BITMAP_TYPE))
                 (let [node-bm (.getUint32 dv (+ data-off 8) true)
                       child-count (compact-popcount32 node-bm)]
                   (if (and (pos? child-count)
                            (<= child-count 32)
                            (>= data-len (+ COMPACT_HEADER_SIZE (* 4 child-count))))
                     ;; Check each child offset for a match
                     (let [found-idx
                           (loop [c 0]
                             (when (< c child-count)
                               (let [ptr-off (+ data-off COMPACT_HEADER_SIZE (* c 4))
                                     child-off (.getInt32 dv ptr-off true)]
                                 (if (== child-off old-offset)
                                   c
                                   (recur (inc c))))))]
                       (if found-idx
                         ;; Found parent! Update child pointer with Atomics.store for memory ordering
                         (let [ptr-byte-off (+ data-off COMPACT_HEADER_SIZE (* found-idx 4))
                               ptr-i32-idx (unsigned-bit-shift-right ptr-byte-off 2)]
                           (js/Atomics.store index-view ptr-i32-idx new-offset)
                           true)
                         (recur (inc i))))
                     (recur (inc i))))
                 (recur (inc i))))
             (recur (inc i))))))

     ;; Phase 2: Check if this is the root HAMT node via atom root chain
     ;; atom root desc → serialized pointer [0xEE, 0xDB, tag, i32_offset] → EveHashMap header → root-off
     (let [root-desc-idx (js/Atomics.load index-view (/ d/OFFSET_ATOM_ROOT_DATA_DESC_IDX d/SIZE_OF_INT32))]
       (when (not= root-desc-idx d/ROOT_POINTER_NIL_SENTINEL)
         (let [root-data-off (u/read-block-descriptor-field index-view root-desc-idx d/OFFSET_BD_DATA_OFFSET)
               root-data-len (u/read-block-descriptor-field index-view root-desc-idx d/OFFSET_BD_DATA_LENGTH)
               u8 (wasm/u8-view)]
           ;; Check serialized SAB pointer format: [MAGIC_0, MAGIC_1, tag, offset:i32]
           (when (and (>= root-data-len 7)
                      (== (aget u8 root-data-off) d/DIRECT_MAGIC_0)
                      (== (aget u8 (inc root-data-off)) d/DIRECT_MAGIC_1))
             (let [sab-header-off (.getInt32 dv (+ root-data-off 3) true)]
               ;; sab-header-off points to the EveHashMap header
               ;; Header layout: [type-id:u8 pad:3 cnt:i32 root-off:i32]
               (when (> sab-header-off -1)
                 (let [hamt-root-off (.getInt32 dv (+ sab-header-off 8) true)]
                   (when (== hamt-root-off old-offset)
                     ;; This IS the root HAMT node — update the EveHashMap header
                     (let [ptr-i32-idx (unsigned-bit-shift-right (+ sab-header-off 8) 2)]
                       (js/Atomics.store index-view ptr-i32-idx new-offset)
                       true)))))))))

     ;; Not found — block might be standalone data, not HAMT
     false)))

(defn- find-zeroed-descriptor-for-remainder!
  "Find a ZEROED_UNUSED descriptor and set it up as a FREE block for the
   remainder space after a compaction split. Returns true if successful."
  [index-view max-descriptors rem-off rem-cap exclude-a exclude-b]
  (loop [ri 0]
    (when (< ri max-descriptors)
      (if (and (not= ri exclude-a) (not= ri exclude-b)
               (== (u/read-block-descriptor-field index-view ri d/OFFSET_BD_STATUS) d/STATUS_ZEROED_UNUSED))
        (let [r-lk (+ (u/get-block-descriptor-base-int32-offset ri)
                       (/ d/OFFSET_BD_LOCK_OWNER d/SIZE_OF_INT32))]
          (if (== 0 (u/atomic-compare-exchange-int index-view r-lk 0 d/*worker-id*))
            (do
              (u/write-block-descriptor-field! index-view ri d/OFFSET_BD_DATA_OFFSET rem-off)
              (u/write-block-descriptor-field! index-view ri d/OFFSET_BD_BLOCK_CAPACITY rem-cap)
              (u/write-block-descriptor-field! index-view ri d/OFFSET_BD_DATA_LENGTH 0)
              (u/write-block-descriptor-field! index-view ri d/OFFSET_BD_STATUS d/STATUS_FREE)
              (u/write-block-descriptor-field! index-view ri d/OFFSET_BD_VALUE_DATA_DESC_IDX d/ROOT_POINTER_NIL_SENTINEL)
              (update-mirrors! index-view ri d/STATUS_FREE rem-cap)
              (u/atomic-store-int index-view r-lk 0)
              true)
            ;; CAS failed — try next
            (recur (inc ri))))
        (recur (inc ri))))))

(defn compact-one-block!
  "Proactive left-compaction: scan descriptors left-to-right. Accumulate free blocks.
   When an ALLOC block is found that fits in a previously-seen free block (to its left),
   move the data leftward, retire the old location. One compaction per call.

   The key invariant: by always moving filled blocks LEFT into earlier free space,
   we naturally consolidate free space rightward, and new allocs (which scan from
   alloc-cursor=0) fill the dense left side first.

   Returns true if a block was compacted, false otherwise."
  [s-atom-env]
  (let [index-view (:index-view s-atom-env)
        max-descriptors (safe-max-descriptors s-atom-env)
        free-blocks #js []] ;; accumulated free blocks: [off, cap, desc-idx]
    (loop [i 0]
      (if (>= i max-descriptors)
        false
        (let [status (u/read-block-descriptor-field index-view i d/OFFSET_BD_STATUS)
              off (u/read-block-descriptor-field index-view i d/OFFSET_BD_DATA_OFFSET)
              cap (u/read-block-descriptor-field index-view i d/OFFSET_BD_BLOCK_CAPACITY)]
          (cond
            ;; FREE — remember for later matching
            (and (== status d/STATUS_FREE) (pos? cap))
            (do (.push free-blocks #js [off cap i])
                (recur (inc i)))

            ;; ALLOC HAMT bitmap node — only compact HAMT nodes.
            ;; Non-HAMT blocks (data containers, EveHashMap headers, embedded atom data)
            ;; are NOT safe to compact because their descriptor indices are referenced
            ;; by atom headers (VALUE_DATA_DESC_IDX) and root pointers that would go stale.
            (and (== status d/STATUS_ALLOCATED) (pos? cap)
                 (let [data-len-c (u/read-block-descriptor-field index-view i d/OFFSET_BD_DATA_LENGTH)]
                   (and (>= data-len-c 16) (== (.getUint8 dv off) COMPACT_BITMAP_TYPE))))
            (let [a-off off
                  a-cap cap
                  a-idx i
                  a-len (u/read-block-descriptor-field index-view i d/OFFSET_BD_DATA_LENGTH)
                  ;; Find a free block at lower offset with capacity >= a-cap
                  fb (loop [fi 0]
                       (when (< fi (.-length free-blocks))
                         (let [f (aget free-blocks fi)]
                           (if (and (< (aget f 0) a-off) (>= (aget f 1) a-cap))
                             f
                             (recur (inc fi))))))]
              (if-not fb
                (recur (inc i))
                ;; Match found — attempt compaction
                (let [f-off (aget fb 0)
                      f-cap (aget fb 1)
                      f-idx (aget fb 2)
                      ;; Lock both descriptors (ordered by index to prevent deadlock)
                      [lo hi] (if (< f-idx a-idx) [f-idx a-idx] [a-idx f-idx])
                      lo-lk (+ (u/get-block-descriptor-base-int32-offset lo) (/ d/OFFSET_BD_LOCK_OWNER d/SIZE_OF_INT32))
                      hi-lk (+ (u/get-block-descriptor-base-int32-offset hi) (/ d/OFFSET_BD_LOCK_OWNER d/SIZE_OF_INT32))]
                  (if (== 0 (u/atomic-compare-exchange-int index-view lo-lk 0 d/*worker-id*))
                    (if (== 0 (u/atomic-compare-exchange-int index-view hi-lk 0 d/*worker-id*))
                      ;; Both locked — re-verify statuses under lock
                      (let [f-st (u/read-block-descriptor-field index-view f-idx d/OFFSET_BD_STATUS)
                            a-st (u/read-block-descriptor-field index-view a-idx d/OFFSET_BD_STATUS)]
                        (if (and (== f-st d/STATUS_FREE) (== a-st d/STATUS_ALLOCATED))
                          (do
                            ;; ==================== COMPACT ====================
                            ;; 1. Copy data from old location to new (leftward) location
                            (when (pos? a-len) (wasm/memcpy! f-off a-off a-len))

                            ;; 2. F descriptor → ALLOCATED (new home for moved data)
                            (u/write-block-descriptor-field! index-view f-idx d/OFFSET_BD_STATUS d/STATUS_ALLOCATED)
                            (u/write-block-descriptor-field! index-view f-idx d/OFFSET_BD_BLOCK_CAPACITY a-cap)
                            (u/write-block-descriptor-field! index-view f-idx d/OFFSET_BD_DATA_LENGTH a-len)
                            (u/write-block-descriptor-field! index-view f-idx d/OFFSET_BD_VALUE_DATA_DESC_IDX d/ROOT_POINTER_NIL_SENTINEL)
                            (update-mirrors! index-view f-idx d/STATUS_ALLOCATED a-cap)

                            ;; 3. Split remainder if free block was larger
                            (let [rem (- f-cap a-cap)]
                              (when (>= rem d/MINIMUM_USABLE_BLOCK_SIZE)
                                (find-zeroed-descriptor-for-remainder!
                                  index-view max-descriptors (+ f-off a-cap) rem f-idx a-idx)))

                            ;; 4. A descriptor → RETIRED (old location, epoch-based GC)
                            ;;    Data at old offset stays valid for concurrent readers
                            (u/write-block-descriptor-field! index-view a-idx d/OFFSET_BD_STATUS d/STATUS_RETIRED)
                            (u/write-block-descriptor-field! index-view a-idx d/OFFSET_BD_RETIRED_EPOCH
                              (get-current-epoch s-atom-env))
                            (update-mirrors! index-view a-idx d/STATUS_RETIRED a-cap)

                            ;; 5. Find and update HAMT parent pointer (old → new offset)
                            (find-and-update-hamt-parent! s-atom-env index-view max-descriptors a-off f-off)

                            ;; 6. Notify offset→desc map callback
                            (when-let [cb @on-block-moved-fn]
                              (cb a-off f-off a-idx f-idx))

                            ;; 7. Release locks
                            (u/atomic-store-int index-view hi-lk 0)
                            (u/atomic-store-int index-view lo-lk 0)

                            ;; 8. Reset alloc cursor to encourage left-packing
                            (vreset! alloc-cursor 0)

                            true)
                          ;; Status changed under lock — abort this pair
                          (do (u/atomic-store-int index-view hi-lk 0)
                              (u/atomic-store-int index-view lo-lk 0)
                              (recur (inc i)))))
                      ;; Couldn't get hi lock
                      (do (u/atomic-store-int index-view lo-lk 0)
                          (recur (inc i))))
                    ;; Couldn't get lo lock
                    (recur (inc i))))))

            :else (recur (inc i))))))))

(defn maybe-compact!
  "Probabilistic post-transaction sweep + compaction.
   Rolls dice against compaction-temperature. If selected, sweeps retired blocks
   and attempts one left-compaction. Call after each successful CAS."
  [s-atom-env]
  (when (< (js/Math.random) @compaction-temperature)
    (sweep-retired-blocks! s-atom-env)
    ;; Compaction disabled during concurrent writes: find-and-update-hamt-parent!
    ;; modifies child pointers in shared memory which races with concurrent readers.
    #_(compact-one-block! s-atom-env)))

(defn with-read-epoch
  "Execute f within a read epoch context. Ensures proper begin/end-read-epoch! calls.
   Returns the result of f."
  [s-atom-env slot-idx f]
  (let [epoch (begin-read! s-atom-env slot-idx)]
    (try
      (f epoch)
      (finally
        (end-read-epoch! s-atom-env slot-idx)))))

;;;;====================================================================================================
;;;; Serialization
;;;;====================================================================================================

(defn atom-serialize
  "Serialize a value for storage in SAB.
   Uses fast-path encoding for primitives and SAB pointer encoding for collections."
  [value]
  (ser/serialize-element value))

(defn atom-deserialize
  "Deserialize bytes from SAB back to a CLJS/SAB value.
   Returns SAB-backed types directly (zero-copy for collections)."
  ([byte-array-view] (atom-deserialize byte-array-view {}))
  ([byte-array-view read-handler-context]
   (when byte-array-view
     (try
       (let [s-atom-env (or (:s-atom-env read-handler-context) {})
             bytes (if (and (some? byte-array-view) (instance? js/Uint8Array byte-array-view)
                            (or (not (zero? (.-byteOffset byte-array-view)))
                                (not= (.-byteLength byte-array-view) (.-byteLength (.-buffer byte-array-view)))))
                     (js/Uint8Array. byte-array-view)
                     byte-array-view)]
         (ser/deserialize-element s-atom-env bytes))
       (catch :default e
         (println "!!! ERROR during atom/atom-deserialize:" e (.-stack e))
         (when byte-array-view (println "    Input bytes (hex, first 64):" (u/format-bytes-as-hex byte-array-view 64)))
         nil)))))

;; Backward compatibility aliases
(def default-serializer atom-serialize)
(def default-deserializer atom-deserialize)

;;-----------------------------------------------------------------------------
;; SAB→CLJS materialization
;;
;; Restores the transactional dereference semantic that was removed in
;; Fressian Phase 5: inside a swap!, user fns operate on SAB types for
;; efficiency; on deref (outside a transaction), values are materialized
;; into plain CLJS persistent types so SAB types never leak to user code.
;;-----------------------------------------------------------------------------

(defn- typed-array?
  "Check if v is a JavaScript typed array (Uint8Array, Int32Array, etc.)."
  [v]
  (or (instance? js/Uint8Array v)
      (instance? js/Int8Array v)
      (instance? js/Uint8ClampedArray v)
      (instance? js/Int16Array v)
      (instance? js/Uint16Array v)
      (instance? js/Int32Array v)
      (instance? js/Uint32Array v)
      (instance? js/Float32Array v)
      (instance? js/Float64Array v)
      (and (exists? js/BigInt64Array) (instance? js/BigInt64Array v))
      (and (exists? js/BigUint64Array) (instance? js/BigUint64Array v))))

(defn- sab-backed-typed-array?
  "Check if v is a typed array backed by SharedArrayBuffer."
  [v]
  (and (typed-array? v)
       (instance? js/SharedArrayBuffer (.-buffer v))))

(defn- copy-typed-array
  "Copy a SAB-backed typed array to a fresh ArrayBuffer-backed copy.
   Returns the appropriate typed array type."
  [^js arr]
  (let [byte-len (.-byteLength arr)
        dst (js/Uint8Array. byte-len)
        src (js/Uint8Array. (.-buffer arr) (.-byteOffset arr) byte-len)]
    (.set dst src)
    (let [ab (.-buffer dst)
          ctor (.-constructor arr)]
      ;; Create new typed array of same type backed by fresh ArrayBuffer
      (new ctor ab))))

(defn eve->cljs
  "Recursively materialize SAB-backed types into plain CLJS types.
   EveHashMap → PersistentHashMap, SabVecRoot → PersistentVector,
   EveHashSet → PersistentHashSet, SabListRoot → PersistentVector.
   SAB-backed typed arrays → ArrayBuffer-backed copies.
   Primitives and already-CLJS values pass through unchanged."
  [v]
  (cond
    ;; Check for SAB-backed typed arrays first
    (sab-backed-typed-array? v)
    (copy-typed-array v)

    (satisfies? sd/ISabStorable v)
    (case (sd/-sab-tag v)
      :eve-hash-map (persistent!
                (reduce-kv (fn [m k val] (assoc! m k (eve->cljs val)))
                           (transient {}) v))
      :eve-vec (let [n (count v)]
                 (loop [i 0 out (transient [])]
                   (if (< i n)
                     (recur (inc i) (conj! out (eve->cljs (nth v i))))
                     (persistent! out))))
      :hash-set (persistent!
                (reduce (fn [s elem] (conj! s (eve->cljs elem)))
                        (transient #{}) v))
      :eve-list (mapv eve->cljs v)
      ;; EveArray → EveArray (stays as SAB-backed type)
      ;; User code should use eve-array APIs (arr/aget, arr/aset!, etc.)
      :eve/array v
      ;; Unknown tag — return as-is
      v)

    :else v))

(defn- notify-watches [watchers-atom-ref old-val new-val]
  (doseq [[key f] @watchers-atom-ref]
    (try (f key watchers-atom-ref old-val new-val)
         (catch :default e (println "Error in watcher" key ":" e)))))

;;; Cross-thread watch notification via Atomics.waitAsync / Atomics.notify.
;;;
;;; Uses the RETIRED_EPOCH field (offset 24) of the SharedAtom's header
;;; descriptor as a version counter. On swap!, the counter is atomically
;;; incremented and Atomics.notify wakes all workers waiting on it.
;;; Workers with add-watch install an Atomics.waitAsync loop that re-fires
;;; local watches when the remote counter changes.

(defn- watch-notify-int32-idx
  "Compute the Int32Array index for the watch notification slot
   (RETIRED_EPOCH field) of a SharedAtom's header descriptor."
  [s-atom-env header-descriptor-idx]
  (let [index-view (:index-view s-atom-env)]
    (+ (u/get-block-descriptor-base-int32-offset header-descriptor-idx)
       (/ d/OFFSET_BD_RETIRED_EPOCH d/SIZE_OF_INT32))))

(defn- signal-remote-watches!
  "Atomically bump the watch version counter and notify waiting workers."
  [s-atom-env header-descriptor-idx]
  (let [index-view (:index-view s-atom-env)
        idx (watch-notify-int32-idx s-atom-env header-descriptor-idx)]
    (js/Atomics.add index-view idx 1)
    (js/Atomics.notify index-view idx)))

(defn- check-and-fire-watches!
  "Check a watched atom's value vs cached, fire watches if different."
  [atom-ref watchers-atom-ref cached-val-atom]
  (when (seq @watchers-atom-ref)
    (try
      (let [old-cached @cached-val-atom
            new-val (cljs.core/deref atom-ref)]
        (when (not= old-cached new-val)
          (reset! cached-val-atom new-val)
          (notify-watches watchers-atom-ref old-cached new-val)))
      (catch :default e
        (println "Error in cross-thread watch check:" e)))))

(defn- start-watch-async-loop!
  "Install an Atomics.waitAsync loop on this SharedAtom's watch slot.
   When a remote worker bumps the version counter, deref the atom,
   compare with cached value, and fire local watches if changed."
  [atom-ref s-atom-env header-descriptor-idx watchers-atom-ref cached-val-atom]
  (when (exists? js/Atomics.waitAsync)
    (let [index-view (:index-view s-atom-env)
          idx (watch-notify-int32-idx s-atom-env header-descriptor-idx)
          current-version (js/Atomics.load index-view idx)
          result (js/Atomics.waitAsync index-view idx current-version)]
      (if (.-async result)
        ;; Normal async wait — promise resolves when notified
        (.then (.-value result)
               (fn [status]
                 (when (and (= status "ok") (seq @watchers-atom-ref))
                   (check-and-fire-watches! atom-ref watchers-atom-ref cached-val-atom)
                   (start-watch-async-loop! atom-ref s-atom-env header-descriptor-idx
                                            watchers-atom-ref cached-val-atom))))
        ;; Sync: value already changed between load and waitAsync
        (when (and (= (.-value result) "not-equal") (seq @watchers-atom-ref))
          (js/queueMicrotask
            #(do (check-and-fire-watches! atom-ref watchers-atom-ref cached-val-atom)
                 (when (seq @watchers-atom-ref)
                   (start-watch-async-loop! atom-ref s-atom-env header-descriptor-idx
                                            watchers-atom-ref cached-val-atom)))))))))

;;; Per-worker registry of atoms with active watches (for cross-thread notification).
;;; Key: header-descriptor-idx, Value: #js {:atom-ref :watchers-atom :cached}
(defonce ^:private watched-atoms (js/Map.))

;;; Callback for message-based broadcast (fallback for browsers without Atomics.waitAsync)
(defonce ^:private broadcast-swap-fn (volatile! nil))

(defn set-broadcast-swap-fn!
  "Register a function to broadcast watch notifications to remote workers.
   Called with (f header-descriptor-idx) after a successful swap!.
   Used as fallback when Atomics.waitAsync is unavailable."
  [f]
  (vreset! broadcast-swap-fn f))

(defn- notify-remote-watches!
  "Signal remote workers that this atom changed.
   Primary: Atomics.notify wakes workers with waitAsync loops.
   Fallback: message broadcast for browsers without Atomics.waitAsync."
  [s-atom-env header-descriptor-idx]
  (signal-remote-watches! s-atom-env header-descriptor-idx)
  ;; Only use message fallback when Atomics.waitAsync is unavailable
  (when (and (not (exists? js/Atomics.waitAsync)) @broadcast-swap-fn)
    (@broadcast-swap-fn header-descriptor-idx)))

(defn- ensure-watch-loop!
  "Start the cross-thread watch notification loop for this atom if not already running."
  [atom-ref header-descriptor-idx watchers-atom-ref]
  (when-not (.has watched-atoms header-descriptor-idx)
    (let [s-atom-env (get-env atom-ref)
          cached-val (cljs.core/atom (cljs.core/deref atom-ref))]
      (.set watched-atoms header-descriptor-idx
            #js {:atom-ref atom-ref :watchers-atom watchers-atom-ref :cached cached-val})
      (start-watch-async-loop! atom-ref s-atom-env header-descriptor-idx
                                watchers-atom-ref cached-val))))

(defn- stop-watch-loop!
  "Unregister a watched atom when all watches are removed."
  [header-descriptor-idx]
  (.delete watched-atoms header-descriptor-idx))

(defn check-remote-watches!
  "Check all watched atoms for changes and fire local watches.
   Called by the message-based fallback when a remote worker signals a change."
  []
  (.forEach watched-atoms
    (fn [^js entry _hdr-idx]
      (let [atom-ref (.-atom-ref entry)
            watchers-atom-ref (.-watchers-atom entry)
            cached (.-cached entry)]
        (check-and-fire-watches! atom-ref watchers-atom-ref cached)))))

(declare ->AtomDomain ->SharedAtom)

(defn atom-domain
  "Create a private atom backed by WebAssembly.Memory.

   All EVE atoms use WASM memory for storage, enabling SIMD-accelerated
   operations on data structures.

   Options:
   - :sab-size - Total memory size in bytes (default 256MB, rounded to 64KB page)
   - :max-blocks - Maximum block descriptors (default 65536)
   - :metamap - Metadata map
   - :validator - Validator function"
  [initial-cljs-map-value & {:keys [metamap validator sab-size max-blocks]
                             :as _opts
                             ;; Default 256MB with 65K descriptors (~1% overhead).
                             ;; Backs the overflow/class-6 coalescing allocator for blocks >1024B.
                             ;; WASM Memory maximum = min(MAX_PAGES, initial*4) = 1GB ceiling.
                             :or {sab-size (* 256 1024 1024) max-blocks 65536}}]
  (let [block-descriptors-array-total-size (* max-blocks d/SIZE_OF_BLOCK_DESCRIPTOR)
        index-region-fixed-metadata-size d/OFFSET_BLOCK_DESCRIPTORS_ARRAY_START
        ;; SoA mirror arrays for SIMD descriptor scanning (Phase 1)
        ;; status_mirror[max_blocks]:  i32 per descriptor — contiguous for v128 scan
        ;; capacity_mirror[max_blocks]: i32 per descriptor — contiguous for v128 scan
        mirror-arrays-size (* max-blocks 2 d/SIZE_OF_INT32) ;; status + capacity
        status-mirror-start (+ index-region-fixed-metadata-size block-descriptors-array-total-size)
        capacity-mirror-start (+ status-mirror-start (* max-blocks d/SIZE_OF_INT32))
        index-region-size (+ index-region-fixed-metadata-size block-descriptors-array-total-size mirror-arrays-size)
        ;; Add scratch region for WASM operations (per-worker scratch space)
        scratch-region-size (* wasm/MAX_WORKERS wasm/SCRATCH_SIZE)
        data-region-start-offset (+ index-region-size scratch-region-size)
        data-region-size (- sab-size data-region-start-offset)]
    (when (< data-region-size d/MINIMUM_USABLE_BLOCK_SIZE)
      (throw (js/Error. (str "SAB total size " sab-size " is too small. Index:" index-region-size
                             " Scratch:" scratch-region-size " Data:" data-region-size))))
    ;; Create memory — use WebAssembly.Memory when WASM module is available,
    ;; plain SharedArrayBuffer otherwise (avoids 1GB virtual address reservation)
    (let [wasm-pages (js/Math.ceil (/ sab-size wasm/PAGE_SIZE))
          actual-sab-size (* wasm-pages wasm/PAGE_SIZE)
          wasm-memory (try
                        (js/WebAssembly.Memory.
                          #js {:initial wasm-pages
                               :maximum (min wasm/MAX_PAGES (* wasm-pages 4))
                               :shared true})
                        (catch :default _
                          (js/SharedArrayBuffer. actual-sab-size)))
          sab (if (instance? js/SharedArrayBuffer wasm-memory)
                wasm-memory
                (.-buffer wasm-memory))
          index-view (js/Int32Array. sab)
          data-view (js/Uint8Array. sab)
          reader-map-sab (js/SharedArrayBuffer. d/READER_MAP_SAB_SIZE_BYTES)
          reader-map-view (js/Int32Array. reader-map-sab)
          _ (.fill reader-map-view 0)
          ;; Recalculate data region size with actual (page-aligned) SAB size
          actual-data-region-size (- actual-sab-size data-region-start-offset)
          scratch-region-start index-region-size
          _ (js/Atomics.store index-view (/ d/OFFSET_SAB_TOTAL_SIZE d/SIZE_OF_INT32) actual-sab-size)
          _ (js/Atomics.store index-view (/ d/OFFSET_INDEX_REGION_SIZE d/SIZE_OF_INT32) index-region-size)
          _ (js/Atomics.store index-view (/ d/OFFSET_DATA_REGION_START d/SIZE_OF_INT32) data-region-start-offset)
          _ (js/Atomics.store index-view (/ d/OFFSET_MAX_BLOCK_DESCRIPTORS d/SIZE_OF_INT32) max-blocks)
          _ (js/Atomics.store index-view (/ d/OFFSET_ATOM_ROOT_DATA_DESC_IDX d/SIZE_OF_INT32) d/ROOT_POINTER_NIL_SENTINEL)
          ;; Initialize global epoch to 1 (0 is reserved for "not reading")
          _ (js/Atomics.store index-view (/ d/OFFSET_GLOBAL_EPOCH d/SIZE_OF_INT32) 1)
          ;; Initialize worker registry - all slots inactive
          _ (dotimes [slot-idx d/MAX_WORKERS]
              (let [slot-byte-offset (+ d/OFFSET_WORKER_REGISTRY_START (* slot-idx d/WORKER_SLOT_SIZE))]
                (js/Atomics.store index-view (/ slot-byte-offset d/SIZE_OF_INT32) d/WORKER_STATUS_INACTIVE)))
          ;; Initialize first block descriptor
          _ (u/write-block-descriptor-field! index-view 0 d/OFFSET_BD_STATUS d/STATUS_FREE)
          _ (u/write-block-descriptor-field! index-view 0 d/OFFSET_BD_DATA_OFFSET data-region-start-offset)
          _ (u/write-block-descriptor-field! index-view 0 d/OFFSET_BD_DATA_LENGTH 0)
          _ (u/write-block-descriptor-field! index-view 0 d/OFFSET_BD_BLOCK_CAPACITY actual-data-region-size)
          _ (u/write-block-descriptor-field! index-view 0 d/OFFSET_BD_VALUE_DATA_DESC_IDX d/ROOT_POINTER_NIL_SENTINEL)
          _ (u/write-block-descriptor-field! index-view 0 d/OFFSET_BD_LOCK_OWNER 0)
          _ (u/write-block-descriptor-field! index-view 0 d/OFFSET_BD_RETIRED_EPOCH 0)
          _ (doseq [i (range 1 max-blocks)]
              (clear-descriptor-fields! index-view i)
              ;; Explicitly clear lock_owner during init (clear-descriptor-fields! doesn't)
              (u/write-block-descriptor-field! index-view i d/OFFSET_BD_LOCK_OWNER 0))
          ;; Initialize SoA mirror arrays for SIMD descriptor scanning
          ;; status_mirror[0] = STATUS_FREE, capacity_mirror[0] = data-region-size
          ;; status_mirror[1..N] = STATUS_ZEROED_UNUSED (-1), capacity_mirror[1..N] = 0
          _ (aset index-view (/ status-mirror-start 4) d/STATUS_FREE)
          _ (aset index-view (/ capacity-mirror-start 4) actual-data-region-size)
          _ (dotimes [i (dec max-blocks)]
              (let [idx (inc i)]
                (aset index-view (+ (/ status-mirror-start 4) idx) d/STATUS_ZEROED_UNUSED)
                (aset index-view (+ (/ capacity-mirror-start 4) idx) 0)))
          _ (reset-alloc-cursor!)
          s-atom-env {:sab sab :index-view index-view :data-view data-view
                      :reader-map-sab reader-map-sab :reader-map-view reader-map-view
                      :wasm-memory wasm-memory
                      :scratch-region-start scratch-region-start
                      :status-mirror-start status-mirror-start
                      :capacity-mirror-start capacity-mirror-start
                      :config {:sab-total-size-bytes actual-sab-size :max-block-descriptors max-blocks
                               :index-region-size index-region-size
                               :scratch-region-start scratch-region-start
                               :status-mirror-start status-mirror-start
                               :capacity-mirror-start capacity-mirror-start
                               :data-region-start-offset data-region-start-offset}}
          the-atom-domain-instance (->AtomDomain s-atom-env validator (or metamap {}) (cljs.core/atom {}))
          ;; Set global atom instance so serialize-element can build SAB types
          _ (set! *global-atom-instance* the-atom-domain-instance)
          ;; Cache views at module level for hot-path access (avoids PersistentHashMap lookup)
          _ (set! cached-atom-iv index-view)
          _ (set! cached-atom-uv data-view)
          ;; Update WASM views to point to new atom's memory BEFORE serializing,
          ;; so that try-build-sab / HAMT operations use the correct DataView.
          _ (wasm/update-views! wasm-memory)
          initial-map (if (map? initial-cljs-map-value) initial-cljs-map-value {})
          ;; Empty maps use NIL sentinel directly — avoids serializer building SabMap
          ;; structures that consume descriptors unnecessarily during atom init.
          initial-root-data-block-desc-idx
          (if (empty? initial-map)
            d/ROOT_POINTER_NIL_SENTINEL
            (let [serialized-initial-map (binding [d/*parent-atom* the-atom-domain-instance
                                                             sd/*parent-atom* the-atom-domain-instance] (default-serializer initial-map))]
              (if (or (nil? serialized-initial-map) (zero? (.-length serialized-initial-map)))
                d/ROOT_POINTER_NIL_SENTINEL
                (let [alloc-info (alloc s-atom-env (.-length serialized-initial-map))]
                  (if (:error alloc-info)
                    (throw (js/Error. (str "atom-domain init alloc for map: " (:error alloc-info))))
                    (do
                      (.set (:data-view s-atom-env) serialized-initial-map (:offset alloc-info))
                      (u/write-block-descriptor-field! (:index-view s-atom-env) (:descriptor-idx alloc-info) d/OFFSET_BD_DATA_LENGTH (.-length serialized-initial-map))
                      (:descriptor-idx alloc-info)))))))]
      (js/Atomics.store index-view (/ d/OFFSET_ATOM_ROOT_DATA_DESC_IDX d/SIZE_OF_INT32) initial-root-data-block-desc-idx)
      the-atom-domain-instance)))

(defn- read-atom-domain-root-data-block-desc-idx [_s-atom-env-map]
  (js/Atomics.load cached-atom-iv (/ d/OFFSET_ATOM_ROOT_DATA_DESC_IDX d/SIZE_OF_INT32)))

(defn- cas-atom-domain-root-data-block-desc-idx! [_s-atom-env-map expected-old-desc-idx new-desc-idx]
  (js/Atomics.compareExchange cached-atom-iv
                              (/ d/OFFSET_ATOM_ROOT_DATA_DESC_IDX d/SIZE_OF_INT32)
                              expected-old-desc-idx new-desc-idx))

;; Cached atom views: avoids PersistentHashMap keyword lookup on s-atom-env per operation.
;; Set once in atom-domain, used in hot-path functions (swap!, deref, CAS).
(def ^:private ^:mutable cached-atom-iv nil)  ;; Int32Array (index view)
(def ^:private ^:mutable cached-atom-uv nil)  ;; Uint8Array (data view)

(defn init-worker-cache!
  "Initialize module-level cached views for worker threads.
   Must be called after reconstructing s-atom-env on worker side
   so that swap!, deref, and CAS use the correct SAB views."
  [s-atom-env]
  (set! cached-atom-iv (:index-view s-atom-env))
  (set! cached-atom-uv (:data-view s-atom-env)))

(defn sab-transfer-data
  "Returns the SAB references needed to reconstruct this atom on another thread.
   The SABs are SharedArrayBuffer instances — they transfer zero-copy."
  [^js atom-domain]
  (let [env (.-s-atom-env atom-domain)]
    {:sab (:sab env)
     :reader-map-sab (:reader-map-sab env)}))

;; Deref cache: avoids re-deserializing SAB data when descriptor index hasn't changed.
(def ^:private ^:mutable cached-deref-env nil)
(def ^:private ^:mutable cached-deref-desc-idx -1)
(def ^:private ^:mutable cached-deref-val nil)

(defn- -update-fn-for-atom-domain-swap!
  [s-env current-root-data-block-desc-idx validator-fn user-f user-args-arr]
  (let [index-view cached-atom-iv
        data-view cached-atom-uv
        old-map-cljs-value
        (if (= current-root-data-block-desc-idx d/ROOT_POINTER_NIL_SENTINEL)
          {}
          (let [status (u/read-block-descriptor-field index-view current-root-data-block-desc-idx d/OFFSET_BD_STATUS)
                data-offset (u/read-block-descriptor-field index-view current-root-data-block-desc-idx d/OFFSET_BD_DATA_OFFSET)
                data-len (u/read-block-descriptor-field index-view current-root-data-block-desc-idx d/OFFSET_BD_DATA_LENGTH)]
            (if (and (== status d/STATUS_ALLOCATED) (>= data-len 0))
              (ser/deserialize-from-dv s-env (wasm/data-view) data-offset data-len)
              (throw (js/Error. (str "StaleReadOrInvalidStateUpdateFn AtomDomainRoot: desc_idx " current-root-data-block-desc-idx))))))]
    (when-not (map? old-map-cljs-value) (throw (js/Error. (str "AtomDomain integrity error: expected map, got " (type old-map-cljs-value)))))
    (let [new-map-cljs-value (if user-args-arr
                                (case (.-length user-args-arr)
                                  1 (user-f old-map-cljs-value (aget user-args-arr 0))
                                  2 (user-f old-map-cljs-value (aget user-args-arr 0) (aget user-args-arr 1))
                                  (apply user-f old-map-cljs-value (array-seq user-args-arr)))
                                (user-f old-map-cljs-value))]
      (when-not (map? new-map-cljs-value) (throw (js/Error. (str "AtomDomain swap fn must return map. Got: " (type new-map-cljs-value)))))
      (when (and validator-fn (not (validator-fn new-map-cljs-value))) (throw (js/Error. "Swap (AtomDomain) validator failed.")))
      (if (identical? new-map-cljs-value old-map-cljs-value)
        ;; Use JS object instead of CLJS map for CAS outcome — avoids HAMT allocation
        #js {:cas_idx current-root-data-block-desc-idx :free_idx nil
             :alloc_idx nil :final_val old-map-cljs-value
             :old_val old-map-cljs-value :changed false}
        ;; Fast path: SAB-backed types are already in shared memory, just encode pointer
        (let [new_map_bytes (if (satisfies? sd/ISabStorable new-map-cljs-value)
                              (sd/-sab-encode new-map-cljs-value nil)
                              (default-serializer new-map-cljs-value))]
          (if (or (nil? new_map_bytes) (zero? (.-length new_map_bytes)))
            #js {:cas_idx d/ROOT_POINTER_NIL_SENTINEL :free_idx current-root-data-block-desc-idx
                 :alloc_idx nil :final_val new-map-cljs-value
                 :old_val old-map-cljs-value :changed true}
            (let [alloc-info (alloc-root-block s-env (.-length new_map_bytes))]
              (if-not alloc-info
                (do
                  ;; Clean up HAMT tree built by user function before retrying.
                  ;; Without this, each retry leaks HAMT nodes → death spiral.
                  (when (satisfies? sd/ISabRetirable new-map-cljs-value)
                    (sd/-sab-retire-diff! new-map-cljs-value old-map-cljs-value s-env :free))
                  (throw (js/Error. "AllocFailedInUpdate AtomDomainRoot: out-of-memory")))
                  (let [new-data-offset (aget alloc-info 0) new-data-desc-idx (aget alloc-info 1)]
                    (.set data-view new_map_bytes new-data-offset)
                    (u/write-block-descriptor-field! index-view new-data-desc-idx d/OFFSET_BD_DATA_LENGTH (.-length new_map_bytes))
                    (u/write-block-descriptor-field! index-view new-data-desc-idx d/OFFSET_BD_DATA_OFFSET new-data-offset)
                    #js {:cas_idx new-data-desc-idx :free_idx current-root-data-block-desc-idx
                         :alloc_idx new-data-desc-idx :final_val new-map-cljs-value
                         :old_val old-map-cljs-value :changed true})))))))))

(defn- -update-fn-for-atom-domain-reset!
  [s-env current-root-data-block-desc-idx validator-fn new-map-cljs-value _user-args-arr]
  (assert (map? new-map-cljs-value) "AtomDomain -reset! new value must be a map.")
  (when (and validator-fn (not (validator-fn new-map-cljs-value))) (throw (js/Error. "Reset (AtomDomain) validator failed.")))
  ;; Fast path: SAB-backed types are already in shared memory, just encode pointer
  (let [new_map_bytes (if (satisfies? sd/ISabStorable new-map-cljs-value)
                        (sd/-sab-encode new-map-cljs-value nil)
                        (default-serializer new-map-cljs-value))
        index-view cached-atom-iv
        data-view cached-atom-uv]
    (if (or (nil? new_map_bytes) (zero? (.-length new_map_bytes)))
      ;; Empty value path
      (let [old-map-cljs-value
            (if (= current-root-data-block-desc-idx d/ROOT_POINTER_NIL_SENTINEL)
              {}
              (let [status (u/read-block-descriptor-field index-view current-root-data-block-desc-idx d/OFFSET_BD_STATUS)
                    data-offset (u/read-block-descriptor-field index-view current-root-data-block-desc-idx d/OFFSET_BD_DATA_OFFSET)
                    data-len (u/read-block-descriptor-field index-view current-root-data-block-desc-idx d/OFFSET_BD_DATA_LENGTH)]
                (if (and (== status d/STATUS_ALLOCATED) (>= data-len 0))
                  (ser/deserialize-from-dv s-env (wasm/data-view) data-offset data-len)
                  {})))]
        #js {:cas_idx d/ROOT_POINTER_NIL_SENTINEL :free_idx current-root-data-block-desc-idx
             :alloc_idx nil :final_val new-map-cljs-value
             :old_val old-map-cljs-value :changed true})
      ;; Non-empty value: check if bytes match existing data (same-value reset fast path).
      ;; When build-hamt-from-cljs returns a cached result, the encoded pointer bytes
      ;; are identical to what's already stored. Skip alloc/write/retirement entirely.
      (if (and (not= current-root-data-block-desc-idx d/ROOT_POINTER_NIL_SENTINEL)
               (let [old-len (u/read-block-descriptor-field index-view current-root-data-block-desc-idx d/OFFSET_BD_DATA_LENGTH)]
                 (and (== old-len (.-length new_map_bytes))
                      (let [old-off (u/read-block-descriptor-field index-view current-root-data-block-desc-idx d/OFFSET_BD_DATA_OFFSET)
                            new-len (.-length new_map_bytes)]
                        ;; Compare bytes directly (typically 7 bytes for SAB pointer)
                        (loop [i 0]
                          (if (>= i new-len)
                            true
                            (if (== (aget data-view (+ old-off i)) (aget new_map_bytes i))
                              (recur (inc i))
                              false)))))))
        ;; Bytes match — same value, skip everything (no alloc, no write, no retirement)
        #js {:cas_idx current-root-data-block-desc-idx :free_idx nil
             :alloc_idx nil :final_val new-map-cljs-value
             :old_val new-map-cljs-value :changed false}
        ;; Bytes differ — normal path
        (let [old-map-cljs-value
              (if (= current-root-data-block-desc-idx d/ROOT_POINTER_NIL_SENTINEL)
                {}
                (let [status (u/read-block-descriptor-field index-view current-root-data-block-desc-idx d/OFFSET_BD_STATUS)
                      data-offset (u/read-block-descriptor-field index-view current-root-data-block-desc-idx d/OFFSET_BD_DATA_OFFSET)
                      data-len (u/read-block-descriptor-field index-view current-root-data-block-desc-idx d/OFFSET_BD_DATA_LENGTH)]
                  (if (and (== status d/STATUS_ALLOCATED) (>= data-len 0))
                    (ser/deserialize-from-dv s-env (wasm/data-view) data-offset data-len)
                    {})))
              alloc-info (alloc-root-block s-env (.-length new_map_bytes))]
          (if-not alloc-info
            (do
              ;; Clean up HAMT tree built during serialization before retrying
              (when (satisfies? sd/ISabRetirable new-map-cljs-value)
                (sd/-sab-retire-diff! new-map-cljs-value old-map-cljs-value s-env :free))
              (throw (js/Error. "AllocFailedInUpdate AtomDomainRoot (reset): out-of-memory")))
              (let [new-data-offset (aget alloc-info 0) new-data-desc-idx (aget alloc-info 1)]
                (.set data-view new_map_bytes new-data-offset)
                (u/write-block-descriptor-field! index-view new-data-desc-idx d/OFFSET_BD_DATA_LENGTH (.-length new_map_bytes))
                (u/write-block-descriptor-field! index-view new-data-desc-idx d/OFFSET_BD_DATA_OFFSET new-data-offset)
                #js {:cas_idx new-data-desc-idx :free_idx current-root-data-block-desc-idx
                     :alloc_idx new-data-desc-idx :final_val new-map-cljs-value
                     :old_val old-map-cljs-value :changed true})))))))

(defn- do-atom-domain-swap!
  "Core swap! implementation. user-args-arr is nil or a JS array of extra args
   (avoids CLJS seq creation from variadic & rest args on every swap! call)."
  [^js atom-domain-instance update-logic-fn user-fn-or-new-value user-args-arr]
  (binding [sd/*parent-atom* atom-domain-instance]
  (let [s-atom-env (.-s-atom-env atom-domain-instance)
        validator-fn (.-validator-fn atom-domain-instance)
        guard? @xray-guard-enabled
        ;; Epoch-based GC: register this worker so sweep sees our read epoch.
        slot-idx (ensure-worker-registered! s-atom-env)]
    ;; X-RAY GUARD: pre-transaction check (storage model + HAMT)
    (when guard?
      (xray-guard-check! s-atom-env "PRE" nil)
      (xray-guard-hamt-check! s-atom-env "PRE"))
    (loop [retries d/MAX_SWAP_RETRIES]
      (when (zero? retries) (throw (js/Error. "do-atom-domain-swap! failed after max retries.")))
      ;; Record epoch BEFORE reading HAMT tree — prevents sweep from freeing
      ;; retired nodes that we're about to walk.
      (when slot-idx (begin-read! s-atom-env slot-idx))
      (let [current-root-desc-idx (read-atom-domain-root-data-block-desc-idx s-atom-env)
            _ (when (or (js/isNaN current-root-desc-idx)
                        (and (not= current-root-desc-idx d/ROOT_POINTER_NIL_SENTINEL)
                             (or (< current-root-desc-idx 0)
                                 (> current-root-desc-idx 262144))))
                (println "[BUG] do-atom-domain-swap!: root-desc-idx out of range:"
                         current-root-desc-idx "retries-left:" retries
                         "worker:" d/*worker-id*))
            update-outcome (try
                             (update-logic-fn s-atom-env current-root-desc-idx validator-fn user-fn-or-new-value user-args-arr)
                             (catch js/Error e
                               (let [error-msg (.-message e)]
                                 (if (or (string/includes? error-msg "StaleReadOrInvalidState")
                                         (string/includes? error-msg "AllocFailedInUpdate"))
                                   ::retry-needed-for-cas-loop
                                   (do (println "!!! Unrecoverable error in update-logic-fn of do-atom-domain-swap!:" e (.-stack e))
                                       (throw e))))))]
        (if (= ::retry-needed-for-cas-loop update-outcome)
          (do (when slot-idx (end-read-epoch! s-atom-env slot-idx))
              (recur (dec retries)))
          ;; JS object outcome: cas-idx, free-idx, alloc-idx, final-val, old-val, changed
          ;; ^js hints on #js outcome properties: prevents Closure from renaming
          ;; dot-notation accesses differently than #js quoted-string literal keys.
          (if-not (.-changed ^js update-outcome)
            ;; Fast path: value unchanged — skip CAS, free, and retirement entirely.
            (do (when slot-idx (end-read-epoch! s-atom-env slot-idx))
                (let [fv (.-final-val ^js update-outcome)]
                  (when (satisfies? sd/ISabRetirable fv)
                    (set! cached-deref-env s-atom-env)
                    (set! cached-deref-desc-idx current-root-desc-idx)
                    (set! cached-deref-val (eve->cljs fv))))
                update-outcome)
            (let [new-desc-idx-for-cas (let [v (.-cas-idx ^js update-outcome)] (if (nil? v) d/ROOT_POINTER_NIL_SENTINEL v))
                  ;; SLAB X-RAY: validate slab allocator invariants before CAS (via callback)
                  _ (when (and guard? @slab-xray-validate-fn)
                      (@slab-xray-validate-fn (str "PRE-CAS worker:" d/*worker-id*)))
                  actual-old-root-desc-idx (cas-atom-domain-root-data-block-desc-idx! s-atom-env current-root-desc-idx new-desc-idx-for-cas)
                  ;; SLAB X-RAY: validate slab allocator invariants after CAS (via callback)
                  _ (when (and guard? @slab-xray-validate-fn)
                      (@slab-xray-validate-fn (str "POST-CAS worker:" d/*worker-id* " success?:" (== actual-old-root-desc-idx current-root-desc-idx))))]
              ;; NOTE: Do NOT clear read epoch here! retire-diff! below walks the
              ;; old HAMT tree. If we clear our epoch first, another worker's sweep
              ;; can free those nodes mid-walk → DataView corruption.
              ;; end-read-epoch! is deferred to after retire-diff! in each branch.
              (if (== actual-old-root-desc-idx current-root-desc-idx)
                (do
                  (let [old_desc_to_free (.-free-idx ^js update-outcome)]
                    (when (and old_desc_to_free
                               (not= old_desc_to_free d/ROOT_POINTER_NIL_SENTINEL)
                               (not= old_desc_to_free new-desc-idx-for-cas))
                      ;; Epoch-safe pool: record current epoch so pool dequeue checks
                      ;; that no concurrent readers are deserializing from this offset.
                      (let [old-offset (u/read-block-descriptor-field
                                         (:index-view s-atom-env) old_desc_to_free
                                         d/OFFSET_BD_DATA_OFFSET)]
                        (when-not (pool-root-block! s-atom-env old-offset old_desc_to_free)
                          ;; Pool full — fall back to epoch-based retirement
                          (retire-block! s-atom-env old_desc_to_free)))))
                  ;; Retire replaced tree nodes. Uses :retire mode (epoch-based)
                  ;; to avoid freeing HAMT nodes while concurrent readers
                  ;; traverse the tree. Sweep cleans up retired blocks later.
                  (let [old-val (.-old-val ^js update-outcome)
                        new-val (.-final-val ^js update-outcome)]
                    (when (satisfies? sd/ISabRetirable old-val)
                      (sd/-sab-retire-diff! old-val new-val s-atom-env :retire)
                      (increment-epoch! s-atom-env)))
                  ;; Clear read epoch AFTER retire-diff! finishes walking the old tree.
                  (when slot-idx (end-read-epoch! s-atom-env slot-idx))
                  ;; Sweep retired blocks after releasing our epoch.
                  (maybe-compact! s-atom-env)
                  ;; X-RAY GUARD: post-transaction check (storage model + HAMT)
                  (when guard?
                    (xray-guard-check! s-atom-env "POST" nil)
                    (xray-guard-hamt-check! s-atom-env "POST"))
                  ;; Update deref cache if final value is ISabRetirable (EveHashMap).
                  ;; Plain CLJS maps from reset! must NOT be cached — they break
                  ;; retirement when used as old-val in swap!.
                  ;; Cache stores materialized CLJS values so deref never returns SAB types.
                  (let [fv (.-final-val ^js update-outcome)]
                    (if (satisfies? sd/ISabRetirable fv)
                      (do (set! cached-deref-env s-atom-env)
                          (set! cached-deref-desc-idx new-desc-idx-for-cas)
                          (set! cached-deref-val (eve->cljs fv)))
                      (set! cached-deref-desc-idx -1)))
                  update-outcome)
                (do
                  ;; CAS failed: clean up the new HAMT tree nodes.
                  ;; Diff against old-val to free only unique new nodes
                  ;; (shared subtrees remain intact for the live value).
                  (let [new-val (.-final-val ^js update-outcome)
                        old-val (.-old-val ^js update-outcome)]
                    (when (satisfies? sd/ISabRetirable new-val)
                      (sd/-sab-retire-diff! new-val old-val s-atom-env :free)))
                  ;; Clear read epoch AFTER retire-diff! finishes walking the old
                  ;; tree. Without this, another worker's sweep can free old nodes
                  ;; mid-walk causing DataView out-of-bounds crashes.
                  (when slot-idx (end-read-epoch! s-atom-env slot-idx))
                  (let [newly-alloc-desc-idx (.-alloc-idx ^js update-outcome)]
                    (when (and newly-alloc-desc-idx
                               (not= newly-alloc-desc-idx d/ROOT_POINTER_NIL_SENTINEL))
                      (free s-atom-env newly-alloc-desc-idx)))
                  (recur (dec retries))))))))))))

(deftype AtomDomain [s-atom-env validator-fn meta-map watchers-atom]
  IMeta (-meta [_this] meta-map)
  IWithMeta (-with-meta [_ new-meta] (->AtomDomain s-atom-env validator-fn new-meta watchers-atom))
  IDeref (-deref [_this]
           ;; Bind *parent-atom* so slab type constructors have context during deserialization.
           (binding [sd/*parent-atom* _this]
           ;; Epoch-protect deref: prevents retired blocks from being freed
           ;; while we're reading the root descriptor and deserializing the HAMT tree.
           ;; Without this, try-free-retired! sees no active epoch and frees nodes mid-walk.
           (let [slot-idx (ensure-worker-registered! s-atom-env)]
             (begin-read! s-atom-env slot-idx)
             (try
               (let [index-view cached-atom-iv
                     root-data-block-desc-idx (read-atom-domain-root-data-block-desc-idx s-atom-env)]
                 (if (and (identical? s-atom-env cached-deref-env)
                          (== root-data-block-desc-idx cached-deref-desc-idx))
                   cached-deref-val
                   (if (= root-data-block-desc-idx d/ROOT_POINTER_NIL_SENTINEL) {}
                       (let [status (u/read-block-descriptor-field index-view root-data-block-desc-idx d/OFFSET_BD_STATUS)
                             data-offset (u/read-block-descriptor-field index-view root-data-block-desc-idx d/OFFSET_BD_DATA_OFFSET)
                             data-len (u/read-block-descriptor-field index-view root-data-block-desc-idx d/OFFSET_BD_DATA_LENGTH)]
                         (if (and (== status d/STATUS_ALLOCATED) (>= data-len 0))
                           ;; Materialize SAB types to CLJS on deref — SAB types
                           ;; never escape to user code outside a swap! transaction.
                           (let [sab-val (ser/deserialize-from-dv s-atom-env (wasm/data-view) data-offset data-len)
                                 val (eve->cljs sab-val)]
                             (set! cached-deref-env s-atom-env)
                             (set! cached-deref-desc-idx root-data-block-desc-idx)
                             (set! cached-deref-val val)
                             val)
                           {})))))
               (finally
                 (when slot-idx (end-read-epoch! s-atom-env slot-idx)))))))  IReset (-reset! [this new-map-cljs-value]
           (when-not (map? new-map-cljs-value) (throw (js/Error. "AtomDomain can only be reset to a map.")))
           (let [^js outcome (do-atom-domain-swap! this -update-fn-for-atom-domain-reset! new-map-cljs-value nil)
                 final-cljs (eve->cljs (.-final-val outcome))]
             (when (.-changed outcome) (notify-watches watchers-atom (eve->cljs (.-old-val outcome)) final-cljs))
             final-cljs))
  ISwap
  (-swap! [this f] ; arity 1 (fn only)
    (let [^js outcome (do-atom-domain-swap! this -update-fn-for-atom-domain-swap! f nil)
          final-cljs (eve->cljs (.-final-val outcome))]
      (when (.-changed outcome) (notify-watches watchers-atom (eve->cljs (.-old-val outcome)) final-cljs))
      final-cljs))
  (-swap! [this f x] ; arity 2 (fn + 1 arg)
    (let [^js outcome (do-atom-domain-swap! this -update-fn-for-atom-domain-swap! f #js [x])
          final-cljs (eve->cljs (.-final-val outcome))]
      (when (.-changed outcome) (notify-watches watchers-atom (eve->cljs (.-old-val outcome)) final-cljs))
      final-cljs))
  (-swap! [this f x y] ; arity 3 (fn + 2 args)
    (let [^js outcome (do-atom-domain-swap! this -update-fn-for-atom-domain-swap! f #js [x y])
          final-cljs (eve->cljs (.-final-val outcome))]
      (when (.-changed outcome) (notify-watches watchers-atom (eve->cljs (.-old-val outcome)) final-cljs))
      final-cljs))
  (-swap! [this f x y r] ; arity 4+ (fn + 2 args + rest seq)
    (let [^js outcome (do-atom-domain-swap! this -update-fn-for-atom-domain-swap! f (to-array (cons x (cons y r))))
          final-cljs (eve->cljs (.-final-val outcome))]
      (when (.-changed outcome) (notify-watches watchers-atom (eve->cljs (.-old-val outcome)) final-cljs))
      final-cljs))
  IWatchable
  (-notify-watches [_this oldval newval] (notify-watches watchers-atom oldval newval))
  (-add-watch [this k cb-fn] (swap! watchers-atom assoc k cb-fn) this)
  (-remove-watch [this k] (swap! watchers-atom dissoc k) this)
  sd/IsEve
  (-eve? [_] true))

;;;;====================================================================================================
;;;; SharedAtom
;;;;====================================================================================================

(defn -update-fn-for-shared-atom-reset! ;; <<< NEWLY ADDED COMPLETE FUNCTION >>>
  [^js shared-atom-instance parent-s-env
   current-value-data-block-desc-idx
   validator-fn new-user-value _ignored-user-args-seq]
  (let [index-view (:index-view parent-s-env)
        data-view (:data-view parent-s-env)
        atom-id (.-shared-atom-id shared-atom-instance)
        hdr-idx (.-header-descriptor-idx shared-atom-instance)
        log-prefix (str "[W:" d/*worker-id* " A:" atom-id " H:" hdr-idx " UpdateFnReset InPtr:" current-value-data-block-desc-idx "] ")]
    #_(println log-prefix "ENTER_UPDATE_FN_RESET")
    (when (and validator-fn (not (validator-fn new-user-value)))
      (let [err-msg (str "ValidatorFailed on Reset: AtomID " atom-id)]
        (println log-prefix "THROWING " err-msg) ; Keep critical error logs
        (throw (js/Error. err-msg))))

    (let [old-sabp-representative-value
          (if (= current-value-data-block-desc-idx d/ROOT_POINTER_NIL_SENTINEL)
            nil
            (let [start-read-outcome (start-read! parent-s-env current-value-data-block-desc-idx)]
              (if-not (= (:status start-read-outcome) :ok)
                (do (println log-prefix "ReadingOldForReset: Failed start-read!: " (pr-str start-read-outcome) ". THROWING StaleRead.")
                    (throw (js/Error. (str "StaleReadOrInvalidStateUpdateFn (Reset) FailedStartReadDetails: " (pr-str start-read-outcome)))))
                (try
                  (let [initial-data-block-status (u/read-block-descriptor-field index-view current-value-data-block-desc-idx d/OFFSET_BD_STATUS)
                        initial-data-block-offset (u/read-block-descriptor-field index-view current-value-data-block-desc-idx d/OFFSET_BD_DATA_OFFSET)
                        initial-data-block-length (u/read-block-descriptor-field index-view current-value-data-block-desc-idx d/OFFSET_BD_DATA_LENGTH)]
                    (if (and (== initial-data-block-status d/STATUS_ALLOCATED) (>= initial-data-block-length 0))
                      (let [status-after-read (u/read-block-descriptor-field index-view current-value-data-block-desc-idx d/OFFSET_BD_STATUS)
                            length-after-read (u/read-block-descriptor-field index-view current-value-data-block-desc-idx d/OFFSET_BD_DATA_LENGTH)]
                        (if (or (not= status-after-read d/STATUS_ALLOCATED) (not= length-after-read initial-data-block-length))
                          (let [err-msg-detail (str "DataStateChangedDuringRead (Reset): AtomID " atom-id ", desc_idx: " current-value-data-block-desc-idx)]
                            (println log-prefix "THROWING StaleReadOrInvalidStateUpdateFn - " err-msg-detail)
                            (throw (js/Error. (str "StaleReadOrInvalidStateUpdateFn " err-msg-detail))))
                          ;; Zero-copy: read directly from SAB DataView
                          (ser/deserialize-from-dv parent-s-env (wasm/data-view) initial-data-block-offset initial-data-block-length)))
                      (let [err-msg-detail (str "InitialDescriptorCheckFailed_AfterStartRead (Reset): AtomID " atom-id ", desc_idx: " current-value-data-block-desc-idx " StatusWas_" initial-data-block-status)]
                        (println log-prefix "THROWING StaleReadOrInvalidStateUpdateFn - " err-msg-detail)
                        (throw (js/Error. (str "StaleReadOrInvalidStateUpdateFn " err-msg-detail))))))
                  (finally
                    (end-read! parent-s-env current-value-data-block-desc-idx d/*worker-id*))))))
          old-value-for-user-fn old-sabp-representative-value
          new_serialized_sab_state_bytes (binding [d/*parent-atom* shared-atom-instance
                                                   sd/*parent-atom* shared-atom-instance] (atom-serialize new-user-value))
          alloc-info (if (and new_serialized_sab_state_bytes (> (.-length new_serialized_sab_state_bytes) 0)) (alloc parent-s-env (.-length new_serialized_sab_state_bytes)) nil)]
      (cond
          (nil? alloc-info) (do (when (and new_serialized_sab_state_bytes (> (.-length new_serialized_sab_state_bytes) 0))
                                  (let [err-msg (str "AllocFailedInUpdate (Reset): AtomID " atom-id ". Allocation returned nil for non-empty bytes.")]
                                    (println log-prefix "THROWING " err-msg)
                                    (throw (js/Error. err-msg))))
                                {:new-value-data-block-desc-idx-for-header d/ROOT_POINTER_NIL_SENTINEL :old-data-desc-idx-to-free-on-success current-value-data-block-desc-idx :old-sabp-representative-value old-sabp-representative-value :newly-allocated-data-desc-idx-to-free-on-cas-fail nil :newly-serialized-sab-state-bytes new_serialized_sab_state_bytes :final-cljs-value new-user-value :value-read-for-this-attempt old-value-for-user-fn :changed? true})
          (:error alloc-info) (let [err-msg (str "AllocFailedInUpdate (Reset): AtomID " atom-id ". Alloc failed: " (:error alloc-info))]
                                (println log-prefix "THROWING " err-msg) (throw (js/Error. err-msg)))
          :else (let [new-data-offset (:offset alloc-info) new-data-desc-idx (:descriptor-idx alloc-info)]
                  (.set data-view new_serialized_sab_state_bytes new-data-offset)
                  (u/write-block-descriptor-field! index-view new-data-desc-idx d/OFFSET_BD_DATA_LENGTH (.-length new_serialized_sab_state_bytes))
                  (u/write-block-descriptor-field! index-view new-data-desc-idx d/OFFSET_BD_DATA_OFFSET new-data-offset)
                  {:new-value-data-block-desc-idx-for-header new-data-desc-idx :old-data-desc-idx-to-free-on-success current-value-data-block-desc-idx :old-sabp-representative-value old-sabp-representative-value :newly-allocated-data-desc-idx-to-free-on-cas-fail new-data-desc-idx :newly-serialized-sab-state-bytes new_serialized_sab_state_bytes :final-cljs-value new-user-value :value-read-for-this-attempt old-value-for-user-fn :changed? true})))))

(defn- -try-cas-header-field! [^js index-view ^number field-idx ^number expected-ptr ^number new-ptr num-inner-retries atom-id]
  (loop [n num-inner-retries]
    (let [actual-old-ptr-from-cas (js/Atomics.compareExchange index-view field-idx expected-ptr new-ptr)]
      (if (== actual-old-ptr-from-cas expected-ptr)
        {:success true}
        (if (zero? n)
          {:success false :actual-ptr-at-failure actual-old-ptr-from-cas}
          (recur (dec n)))))))

(defn- do-embedded-swap!
  [^js atom-instance update-logic-fn user-fn-or-new-value & user-args-seq]
  (binding [sd/*parent-atom* atom-instance]
  (let [parent-s-atom-env (get-env atom-instance)
        index-view (:index-view parent-s-atom-env)
        header-desc-idx (.-header-descriptor-idx atom-instance)
        atom-id (.-shared-atom-id atom-instance)
        target-value-desc-idx-in-header-field (+ (u/get-block-descriptor-base-int32-offset header-desc-idx)
                                                 (/ d/OFFSET_BD_VALUE_DATA_DESC_IDX d/SIZE_OF_INT32))
        INNER_CAS_RETRIES 10
        ;; Epoch-based GC: register this worker so sweep sees our read epoch.
        ;; Without this, try-free-retired! sees nil min-active-epoch and frees
        ;; HAMT nodes that other workers are still walking → DataView corruption.
        slot-idx (ensure-worker-registered! parent-s-atom-env)]

    (loop [outer-retries d/MAX_SWAP_RETRIES]
      (when (zero? outer-retries)
        (let [err-msg (str "do-embedded-swap! [AtomID: " atom-id ", HdrIdx: " header-desc-idx "] failed OUTER_LOOP after " d/MAX_SWAP_RETRIES " retries.")]
          (println err-msg)
          (throw (js/Error. err-msg))))

      ;; Record current epoch BEFORE reading the HAMT tree.
      ;; This prevents sweep from freeing retired nodes that we're about to walk.
      (when slot-idx (begin-read! parent-s-atom-env slot-idx))

      (let [current_data_block_desc_idx (js/Atomics.load index-view target-value-desc-idx-in-header-field)
            update-outcome (try
                             (update-logic-fn
                              atom-instance
                              parent-s-atom-env
                              current_data_block_desc_idx
                              (.-validator-fn atom-instance)
                              user-fn-or-new-value
                              user-args-seq)
                             (catch js/Error e
                               (let [error-msg (.-message e)]
                                 (if (or (string/includes? error-msg "StaleReadOrInvalidState")
                                         (string/includes? error-msg "AllocFailedInUpdate"))
                                   ::retry-outer-swap-loop
                                   (do (println (str "!!! Unrecoverable error in update-logic-fn for AtomID " atom-id " Error: " error-msg) e)
                                       (throw e))))))]
        (if (= update-outcome ::retry-outer-swap-loop)
          (do
            ;; Clear epoch before retry — we'll re-register with a fresh epoch
            (when slot-idx (end-read-epoch! parent-s-atom-env slot-idx))
            (recur (dec outer-retries)))
          (let [new_ptr_for_cas (get update-outcome :new-value-data-block-desc-idx-for-header d/ROOT_POINTER_NIL_SENTINEL)
                cas-attempt-result (-try-cas-header-field! index-view
                                                           target-value-desc-idx-in-header-field
                                                           current_data_block_desc_idx
                                                           new_ptr_for_cas
                                                           INNER_CAS_RETRIES
                                                           atom-id)]
            ;; NOTE: Do NOT clear read epoch here! retire-diff! below walks the
            ;; old HAMT tree. Clearing epoch allows sweep to free those nodes
            ;; mid-walk → DataView corruption. Deferred to after retire-diff!.
            (if (:success cas-attempt-result)
              (do
                (when-let [old_desc_to_free (:old-data-desc-idx-to-free-on-success update-outcome)]
                  (when (and (not= old_desc_to_free d/ROOT_POINTER_NIL_SENTINEL)
                             (not= old_desc_to_free new_ptr_for_cas))
                    ;; Epoch-based retirement instead of direct free.
                    ;; Direct free races with concurrent readers: a reader can read
                    ;; the header desc-idx, then between that and start-read!, the
                    ;; descriptor gets freed, reused, and retired → reader sees RETIRED.
                    ;; Retirement delays reclamation until all readers finish their epoch.
                    (retire-block! parent-s-atom-env old_desc_to_free)))
                ;; Retire old HAMT tree nodes (diff-based).
                ;; This is critical for memory reclamation — without this,
                ;; old HAMT nodes leak on every embedded atom swap.
                (let [old-sabp-val (:old-sabp-representative-value update-outcome)
                      new-sabp-val (:final-cljs-value update-outcome)]
                  (when (satisfies? sd/ISabRetirable old-sabp-val)
                    (sd/-sab-retire-diff! old-sabp-val new-sabp-val parent-s-atom-env :retire)
                    (increment-epoch! parent-s-atom-env)))
                ;; Clear read epoch AFTER retire-diff! walks the old tree.
                (when slot-idx (end-read-epoch! parent-s-atom-env slot-idx))
                ;; Sweep retired blocks after releasing our epoch.
                (maybe-compact! parent-s-atom-env)
                update-outcome)
              (do
                #_(println (str "[WORKER " d/*worker-id* "] CAS_FAILED_INNER_LOOP: AtomID " atom-id ...)) ; Keep this commented for now
                (when-let [newly-alloc-desc-idx (:newly-allocated-data-desc-idx-to-free-on-cas-fail update-outcome)]
                  (when (not= newly-alloc-desc-idx d/ROOT_POINTER_NIL_SENTINEL)
                    (free parent-s-atom-env newly-alloc-desc-idx)))
                ;; CAS failed: free the newly created HAMT tree nodes.
                ;; Diff against old value to free only unique new nodes
                ;; (shared subtrees remain intact for the live value).
                (let [new-sabp-val (:final-cljs-value update-outcome)
                      old-sabp-val (:old-sabp-representative-value update-outcome)]
                  (when (satisfies? sd/ISabRetirable new-sabp-val)
                    (sd/-sab-retire-diff! new-sabp-val old-sabp-val parent-s-atom-env :free)))
                ;; Clear read epoch AFTER retire-diff! finishes walking old tree.
                (when slot-idx (end-read-epoch! parent-s-atom-env slot-idx))
                (recur (dec outer-retries)))))))))))

(defn- -try-read-shared-atom-value [_this value-data-block-idx parent-s-env log-prefix-outer _read-context]
  (let [parent-idx-view (:index-view parent-s-env)
        log-prefix (str log-prefix-outer " TryRead desc:" value-data-block-idx "] ")]

    (if (= value-data-block-idx d/ROOT_POINTER_NIL_SENTINEL)
      {:value nil}
      (let [start-read-status (start-read! parent-s-env value-data-block-idx)]
        (if (:error start-read-status)
          (do (println log-prefix "Failed start-read!: " (pr-str start-read-status) ". Signaling retry.")
              {:retry true})
          (try
            (let [data-block-status (u/read-block-descriptor-field parent-idx-view value-data-block-idx d/OFFSET_BD_STATUS)
                  data-block-offset (u/read-block-descriptor-field parent-idx-view value-data-block-idx d/OFFSET_BD_DATA_OFFSET)
                  data-block-length (u/read-block-descriptor-field parent-idx-view value-data-block-idx d/OFFSET_BD_DATA_LENGTH)]
              (if (and (== data-block-status d/STATUS_ALLOCATED) (>= data-block-length 0))
                ;; Zero-copy: read directly from SAB DataView
                {:value (ser/deserialize-from-dv parent-s-env (wasm/data-view) data-block-offset data-block-length)}
                (do (println log-prefix "Path: STALE_BLOCK_DESC (Status was " data-block-status ") after start-read. Signaling retry.")
                    {:retry true})))
            (finally
              (end-read! parent-s-env value-data-block-idx d/*worker-id*))))))))

(defn -update-fn-for-shared-atom-swap!
  [^js shared-atom-instance parent-s-env
   current-value-data-block-desc-idx
   validator-fn user-f user-args-seq]
  (let [index-view (:index-view parent-s-env)
        data-view (:data-view parent-s-env)
        atom-id (.-shared-atom-id shared-atom-instance)
        hdr-idx (.-header-descriptor-idx shared-atom-instance)
        log-prefix (str "[W:" d/*worker-id* " A:" atom-id " H:" hdr-idx " UpdateFn InPtr:" current-value-data-block-desc-idx "] ")
        old-sabp-representative-value
          (if (= current-value-data-block-desc-idx d/ROOT_POINTER_NIL_SENTINEL)
            nil
            (let [start-read-status (start-read! parent-s-env current-value-data-block-desc-idx)]
              (if (:error start-read-status)
                (do (println log-prefix "ReadingOld: Failed start-read!: " (pr-str start-read-status) ". THROWING StaleRead.")
                    (throw (js/Error. (str "StaleReadOrInvalidStateUpdateFn FailedStartRead: " (pr-str start-read-status)))))
                (try
                  (let [initial-data-block-status (u/read-block-descriptor-field index-view current-value-data-block-desc-idx d/OFFSET_BD_STATUS)
                        initial-data-block-offset (u/read-block-descriptor-field index-view current-value-data-block-desc-idx d/OFFSET_BD_DATA_OFFSET)
                        initial-data-block-length (u/read-block-descriptor-field index-view current-value-data-block-desc-idx d/OFFSET_BD_DATA_LENGTH)]
                    (if (and (== initial-data-block-status d/STATUS_ALLOCATED) (>= initial-data-block-length 0))
                      (let [status-after-read (u/read-block-descriptor-field index-view current-value-data-block-desc-idx d/OFFSET_BD_STATUS)
                            length-after-read (u/read-block-descriptor-field index-view current-value-data-block-desc-idx d/OFFSET_BD_DATA_LENGTH)]
                        (if (or (not= status-after-read d/STATUS_ALLOCATED) (not= length-after-read initial-data-block-length))
                          (let [err-msg-detail (str "DataStateChangedDuringRead: AtomID " atom-id)]
                            (println log-prefix "THROWING StaleReadOrInvalidStateUpdateFn - " err-msg-detail)
                            (throw (js/Error. (str "StaleReadOrInvalidStateUpdateFn " err-msg-detail))))
                          ;; Zero-copy: read directly from SAB DataView
                          (try
                            (ser/deserialize-from-dv parent-s-env (wasm/data-view) initial-data-block-offset initial-data-block-length)
                            (catch js/RangeError e
                              (println log-prefix "!!! DESERIALIZE CRASH at desc:" current-value-data-block-desc-idx
                                       "offset:" initial-data-block-offset "len:" initial-data-block-length
                                       "sab-size:" (.-byteLength (.-buffer index-view)))
                              (println log-prefix "  desc-status:" (u/read-block-descriptor-field index-view current-value-data-block-desc-idx d/OFFSET_BD_STATUS)
                                       "desc-cap:" (u/read-block-descriptor-field index-view current-value-data-block-desc-idx d/OFFSET_BD_BLOCK_CAPACITY)
                                       "desc-epoch:" (u/read-block-descriptor-field index-view current-value-data-block-desc-idx d/OFFSET_BD_RETIRED_EPOCH))
                              ;; Dump first 64 bytes of the data block for analysis
                              (println log-prefix "  first-32-bytes:"
                                       (let [dv (wasm/data-view)
                                             end (min (+ initial-data-block-offset 32) (.-byteLength (.-buffer dv)))]
                                         (loop [i initial-data-block-offset acc []]
                                           (if (>= i end) acc
                                               (recur (inc i) (conj acc (.getUint8 dv i)))))))
                              (throw e)))))
                      (let [err-msg-detail (str "InitialDescriptorCheckFailed_AfterStartRead: AtomID " atom-id " StatusWas_" initial-data-block-status)]
                        (println log-prefix "THROWING StaleReadOrInvalidStateUpdateFn - " err-msg-detail)
                        (throw (js/Error. (str "StaleReadOrInvalidStateUpdateFn " err-msg-detail))))))
                  (finally
                    (end-read! parent-s-env current-value-data-block-desc-idx d/*worker-id*))))))
        ;; Pass deserialized value directly to user function (zero-copy: SAB-backed types returned as-is)
        old-value-for-user-fn old-sabp-representative-value
        new-ab-native-value-from-user-fn
        (try
          (apply user-f old-value-for-user-fn user-args-seq)
          (catch js/RangeError e
            (println log-prefix "!!! USER-FN CRASH (HAMT walk/assoc):"
                     (.-message e))
            (println log-prefix "  old-value type:" (type old-value-for-user-fn)
                     "data-desc:" current-value-data-block-desc-idx)
            (validate-storage-model! parent-s-env {:label "USER-FN-CRASH"})
            (throw e)))]
    (when (and validator-fn (not (validator-fn new-ab-native-value-from-user-fn)))
          (throw (js/Error. (str "ValidatorFailed: AtomID " atom-id))))
        (if (= new-ab-native-value-from-user-fn old-value-for-user-fn)
          {:new-value-data-block-desc-idx-for-header current-value-data-block-desc-idx
           :old-data-desc-idx-to-free-on-success nil
           :old-sabp-representative-value old-sabp-representative-value
           :newly-allocated-data-desc-idx-to-free-on-cas-fail nil
           :newly-serialized-sab-state-bytes nil
           :final-cljs-value old-value-for-user-fn
           :value-read-for-this-attempt old-value-for-user-fn
           :changed? false}
          (let [new_serialized_sab_state_bytes
                (try
                  (binding [d/*parent-atom* shared-atom-instance
                                    sd/*parent-atom* shared-atom-instance] (default-serializer new-ab-native-value-from-user-fn))
                  (catch js/RangeError e
                    (println log-prefix "!!! SERIALIZE CRASH:" (.-message e))
                    (validate-storage-model! parent-s-env {:label "SERIALIZE-CRASH"})
                    (throw e)))
                alloc-info (if (and new_serialized_sab_state_bytes (> (.-length new_serialized_sab_state_bytes) 0)) (alloc parent-s-env (.-length new_serialized_sab_state_bytes)) nil)]
            (cond
              (nil? alloc-info) (do (when (and new_serialized_sab_state_bytes (> (.-length new_serialized_sab_state_bytes) 0))
                                      ;; Clean up HAMT tree built by user function before retrying
                                      (when (satisfies? sd/ISabRetirable new-ab-native-value-from-user-fn)
                                        (sd/-sab-retire-diff! new-ab-native-value-from-user-fn old-sabp-representative-value parent-s-env :free))
                                      (throw (js/Error. (str "AllocFailedInUpdate AtomID " atom-id ": Alloc returned nil for non-empty bytes."))))
                                    {:new-value-data-block-desc-idx-for-header d/ROOT_POINTER_NIL_SENTINEL :old-data-desc-idx-to-free-on-success current-value-data-block-desc-idx :old-sabp-representative-value old-sabp-representative-value :newly-allocated-data-desc-idx-to-free-on-cas-fail nil :newly-serialized-sab-state-bytes new_serialized_sab_state_bytes :final-cljs-value new-ab-native-value-from-user-fn :value-read-for-this-attempt old-value-for-user-fn :changed? true})
              (:error alloc-info) (do (when (satisfies? sd/ISabRetirable new-ab-native-value-from-user-fn)
                                        (sd/-sab-retire-diff! new-ab-native-value-from-user-fn old-sabp-representative-value parent-s-env :free))
                                      (throw (js/Error. (str "AllocFailedInUpdate AtomID " atom-id ": " (:error alloc-info)))))
              :else (let [new-data-offset (:offset alloc-info) new-data-desc-idx (:descriptor-idx alloc-info)]
                      (when (or (< new-data-offset 0)
                                (>= (+ new-data-offset (.-length new_serialized_sab_state_bytes))
                                    (.-byteLength (.-buffer data-view))))
                        (println log-prefix "!!! WRITE BOUNDS ERROR: offset=" new-data-offset
                                 "len=" (.-length new_serialized_sab_state_bytes)
                                 "sab-size=" (.-byteLength (.-buffer data-view))
                                 "desc-idx=" new-data-desc-idx)
                        (validate-storage-model! parent-s-env {:label "WRITE-BOUNDS"})
                        (throw (js/RangeError. "Prevented OOB write to SAB")))
                      (.set data-view new_serialized_sab_state_bytes new-data-offset)
                      (u/write-block-descriptor-field! index-view new-data-desc-idx d/OFFSET_BD_DATA_LENGTH (.-length new_serialized_sab_state_bytes))
                      (u/write-block-descriptor-field! index-view new-data-desc-idx d/OFFSET_BD_DATA_OFFSET new-data-offset)
                      {:new-value-data-block-desc-idx-for-header new-data-desc-idx :old-data-desc-idx-to-free-on-success current-value-data-block-desc-idx :old-sabp-representative-value old-sabp-representative-value :newly-allocated-data-desc-idx-to-free-on-cas-fail new-data-desc-idx :newly-serialized-sab-state-bytes new_serialized_sab_state_bytes :final-cljs-value new-ab-native-value-from-user-fn :value-read-for-this-attempt old-value-for-user-fn :changed? true}))))))

(defprotocol ISharedAtom)
(deftype SharedAtom [^AtomDomain parent-atom-domain
                             ^number shared-atom-id
                             ^number header-descriptor-idx
                             validator-fn meta-map watchers-atom]
  ISharedAtom
  IMeta (-meta [_this] meta-map)
  IWithMeta (-with-meta [_ new-meta] (->SharedAtom parent-atom-domain shared-atom-id header-descriptor-idx validator-fn new-meta watchers-atom))
  IDeref
  (-deref [_this]
    ;; Bind *parent-atom* so slab type constructors have context during deserialization.
    (binding [sd/*parent-atom* _this]
    (let [parent-s-env (.-s-atom-env parent-atom-domain)
          parent-idx-view (:index-view parent-s-env)
          atom-id (.-shared-atom-id _this)
          hdr-idx (.-header-descriptor-idx _this)
          atom-header-base-int32 (u/get-block-descriptor-base-int32-offset header-descriptor-idx)
          value-data-desc-idx-field-in-header (+ atom-header-base-int32 (/ d/OFFSET_BD_VALUE_DATA_DESC_IDX d/SIZE_OF_INT32))
          read-context {:s-atom-env parent-s-env}
          log-prefix (str "[W:" d/*worker-id* " A:" atom-id " H:" hdr-idx " DerefLoop] ")
          ;; Epoch-protect deref: prevents retired blocks from being freed
          ;; while we're reading the descriptor pointed to by the header.
          slot-idx (ensure-worker-registered! parent-s-env)]
      (begin-read! parent-s-env slot-idx)
      (try
        (let [sab-val (loop [deref-retries 10]
                        (when (zero? deref-retries)
                          (let [err-msg (str "SharedAtom -deref ID " atom-id ", HdrIdx: " hdr-idx " failed after " 10 " retries.")]
                            (println log-prefix "!!! MAX_DEREF_RETRIES " err-msg)
                            (throw (js/Error. err-msg))))
                        (let [value-data-block-idx (js/Atomics.load parent-idx-view value-data-desc-idx-field-in-header)
                              read-attempt-result (-try-read-shared-atom-value _this value-data-block-idx parent-s-env log-prefix read-context)]
                          (if (:retry read-attempt-result)
                            (recur (dec deref-retries))
                            (:value read-attempt-result))))]
          ;; Materialize SAB types to CLJS on deref
          (eve->cljs sab-val))
        (finally
          (when slot-idx (end-read-epoch! parent-s-env slot-idx)))))))
  IReset
  (-reset! [this new-user-value]
    (let [old-user-value-for-watchers @this
          _ (when (and validator-fn (not (validator-fn new-user-value)))
              (throw (js/Error. (str "SharedAtom -reset! for ID " (.-shared-atom-id this) ": Validator function returned false."))))
          outcome (apply do-embedded-swap! this -update-fn-for-shared-atom-reset! new-user-value [])
          final-cljs (eve->cljs (:final-cljs-value outcome))]
      (when (:changed? outcome)
        (notify-watches watchers-atom old-user-value-for-watchers final-cljs)
        (notify-remote-watches! (.-s-atom-env parent-atom-domain) header-descriptor-idx))
      final-cljs))
  ISwap
  (-swap! [this f]
    (let [old @this
          outcome (apply do-embedded-swap! this -update-fn-for-shared-atom-swap! f [])
          final-cljs (eve->cljs (:final-cljs-value outcome))]
      (when (:changed? outcome)
        (notify-watches watchers-atom old final-cljs)
        (notify-remote-watches! (.-s-atom-env parent-atom-domain) header-descriptor-idx))
      final-cljs))
  (-swap! [this f x]
    (let [old @this
          outcome (apply do-embedded-swap! this -update-fn-for-shared-atom-swap! f [x])
          final-cljs (eve->cljs (:final-cljs-value outcome))]
      (when (:changed? outcome)
        (notify-watches watchers-atom old final-cljs)
        (notify-remote-watches! (.-s-atom-env parent-atom-domain) header-descriptor-idx))
      final-cljs))
  (-swap! [this f x y]
    (let [old @this
          outcome (apply do-embedded-swap! this -update-fn-for-shared-atom-swap! f [x y])
          final-cljs (eve->cljs (:final-cljs-value outcome))]
      (when (:changed? outcome)
        (notify-watches watchers-atom old final-cljs)
        (notify-remote-watches! (.-s-atom-env parent-atom-domain) header-descriptor-idx))
      final-cljs))
  (-swap! [this f x y r]
    (let [old @this
          user-args (into [x y] r)
          outcome (apply do-embedded-swap! this -update-fn-for-shared-atom-swap! f user-args)
          final-cljs (eve->cljs (:final-cljs-value outcome))]
      (when (:changed? outcome)
        (notify-watches watchers-atom old final-cljs)
        (notify-remote-watches! (.-s-atom-env parent-atom-domain) header-descriptor-idx))
      final-cljs))
  IWatchable
  (-notify-watches [_this oldval newval] (notify-watches watchers-atom oldval newval))
  (-add-watch [this k cb-fn]
    (swap! watchers-atom assoc k cb-fn)
    (ensure-watch-loop! this header-descriptor-idx watchers-atom)
    this)
  (-remove-watch [this k]
    (swap! watchers-atom dissoc k)
    (when (empty? @watchers-atom)
      (stop-watch-loop! header-descriptor-idx))
    this)
  IPrintWithWriter
  (-pr-writer [_ writer _opts]
    (write-all writer "#cljs-thread/shared-atom {:id " shared-atom-id " :idx " header-descriptor-idx "}"))
  sd/IsEve
  (-eve? [_] true))

(def atom-id-counter (cljs.core/atom 0))
(defn next-atom-id [] (swap! atom-id-counter inc))

(defn- parse-atom-args
  "Parse atom arguments:
   (atom value)                - 1 arg: anonymous atom
   (atom ::id value)           - qualified kw: named atom (shorthand)
   (atom {:id ::id} value)     - config map: named atom
   (atom nil value)            - nil first: anonymous (escape hatch)"
  [args]
  (if (= 1 (count args))
    {:value (first args) :opts {}}
    (let [fst (first args)
          snd (second args)]
      (cond
        (and (keyword? fst) (namespace fst))
        {:value snd :opts {:id fst}}

        (map? fst)
        {:value snd :opts fst}

        (nil? fst)
        {:value snd :opts {}}

        :else
        {:value fst :opts {}}))))

(defn- create-atom!
  "Internal: allocate and register a new SharedAtom."
  [target-atom-domain initial-value atom-id validator metamap]
  (let [parent-s-env (.-s-atom-env ^AtomDomain target-atom-domain)
        parent-idx-view (:index-view parent-s-env)
        serialized-initial-bytes (binding [d/*parent-atom* target-atom-domain
                                           sd/*parent-atom* target-atom-domain]
                                   (default-serializer initial-value))
        alloc-result-value (if (and serialized-initial-bytes (> (.-length serialized-initial-bytes) 0))
                             (alloc parent-s-env (.-length serialized-initial-bytes))
                             nil)
        value_data_block_desc_idx (if alloc-result-value
                                    (:descriptor-idx alloc-result-value)
                                    d/ROOT_POINTER_NIL_SENTINEL)]
    (when (and serialized-initial-bytes alloc-result-value (:error alloc-result-value))
      (throw (js/Error. (str "atom constructor: Failed to alloc state block: " (:error alloc-result-value)))))
    (when (and alloc-result-value (not (:error alloc-result-value)) serialized-initial-bytes)
      (.set (:data-view parent-s-env) serialized-initial-bytes (:offset alloc-result-value))
      (u/write-block-descriptor-field! parent-idx-view value_data_block_desc_idx d/OFFSET_BD_DATA_LENGTH (.-length serialized-initial-bytes)))
    (loop [candidate-header-idx 0 scan-retries 2]
      (if (>= candidate-header-idx (safe-max-descriptors parent-s-env))
        (if (> scan-retries 0) (recur 0 (dec scan-retries))
            (do (when (not= value_data_block_desc_idx d/ROOT_POINTER_NIL_SENTINEL)
                  (free parent-s-env value_data_block_desc_idx))
                (throw (js/Error. "atom constructor: No suitable ZEROED_UNUSED descriptor slot for embedded atom header."))))
        (let [header-status (u/read-block-descriptor-field parent-idx-view candidate-header-idx d/OFFSET_BD_STATUS)
              header-lock-field-idx (+ (u/get-block-descriptor-base-int32-offset candidate-header-idx) (/ d/OFFSET_BD_LOCK_OWNER d/SIZE_OF_INT32))]
          (if (and (== header-status d/STATUS_ZEROED_UNUSED)
                   (== 0 (u/atomic-compare-exchange-int parent-idx-view header-lock-field-idx 0 d/*worker-id*)))
            (let [final-atom-instance (->SharedAtom target-atom-domain atom-id candidate-header-idx validator metamap (cljs.core/atom {}))]
              (try
                (clear-descriptor-fields! parent-idx-view candidate-header-idx)
                (u/write-block-descriptor-field! parent-idx-view candidate-header-idx d/OFFSET_BD_VALUE_DATA_DESC_IDX value_data_block_desc_idx)
                (u/write-block-descriptor-field! parent-idx-view candidate-header-idx d/OFFSET_BD_STATUS d/STATUS_EMBEDDED_ATOM_HEADER)
                (update-mirrors! parent-idx-view candidate-header-idx d/STATUS_EMBEDDED_ATOM_HEADER nil)
                (swap! target-atom-domain assoc atom-id {:header-descriptor-idx candidate-header-idx})
                final-atom-instance
                (finally
                  (u/atomic-store-int parent-idx-view header-lock-field-idx 0))))
            (recur (inc candidate-header-idx) scan-retries)))))))

(defn atom
  "Create or retrieve a SharedAtom.
   (atom {:counter 0})              - anonymous atom
   (atom ::state {:counter 0})      - named atom (qualified kw shorthand)
   (atom {:id ::state} {:counter 0}) - named atom (config map)

   Named atoms are registered globally - if one with that :id exists,
   returns the existing atom (enables cross-worker sharing via defonce)."
  [& args]
  (let [{:keys [value opts]} (parse-atom-args args)
        {:keys [id metamap validator] :or {metamap {}}} opts
        target-atom-domain (or d/*parent-atom* *global-atom-instance*)]
    (when-not target-atom-domain
      (throw (js/Error. "Target AtomDomain not bound for new atom.")))
    (if id
      ;; Named atom - check registry
      (if-let [existing (get @target-atom-domain id)]
        (->SharedAtom target-atom-domain id (:header-descriptor-idx existing) validator metamap (cljs.core/atom {}))
        (create-atom! target-atom-domain value id validator metamap))
      ;; Anonymous atom
      (create-atom! target-atom-domain value (next-atom-id) validator metamap))))

(when u/is-main-thread?
  ;; Main thread gets worker-id 1 for CAS lock ownership
  (when-not d/*worker-id*
    (set! d/*worker-id* 1))
  (set! *global-atom-instance*
        (atom-domain {}))  ;; Uses default 100MB size with 65K block descriptors
  ;; Initialize WASM module in background with the atom's memory
  (let [^js gai *global-atom-instance*]
    (when-let [wasm-memory (:wasm-memory (.-s-atom-env gai))]
      (-> (wasm/init! wasm-memory)
          (.then (fn [_] (js/console.log "EVE WASM module initialized")))
          (.catch (fn [err] (js/console.warn "EVE WASM init failed (using JS fallback):" err)))))))

(defn shared-atom? [obj] (instance? SharedAtom obj))

(defn conveyable-> [t]
  (cond
    (shared-atom? t)
    #js {:type "shared-atom"
         :parent-atom-domain-id "global"
         :shared-atom-id (.-shared-atom-id ^js t)
         :header-descriptor-idx (.-header-descriptor-idx ^js t)
         :meta-map (clj->js (.-meta-map ^js t))}

    (instance? AtomDomain t)
    #js {:type "atom-domain"
         :meta-map (clj->js (.-meta-map ^js t))
         :validator-fn nil} ; Can't serialize functions, will use global atom's validator

    :else t))

(defn <-conveyable [m]
  (cond
    (and (map? m) (= "shared-atom" (:type m)))
    (let [parent-atom-domain-id (:parent-atom-domain-id m)
          parent-atom-domain (cond
                               (= parent-atom-domain-id "global") *global-atom-instance*
                               :else (do (println "!!! <-conveyable: Unknown parent-atom-domain-id:" parent-atom-domain-id) nil))
          received-id (:shared-atom-id m)
          header-idx (:header-descriptor-idx m)
          meta-from-conveyed (:meta-map m {})]
      (if (or (nil? parent-atom-domain) (nil? received-id) (nil? header-idx))
        (do (println "!!! atom/<-conveyable: CRITICAL - Cannot reconstruct SharedAtom." (pr-str m)) nil)
        (->SharedAtom parent-atom-domain received-id header-idx nil meta-from-conveyed (cljs.core/atom {}))))

    (and (map? m) (= "atom-domain" (:type m)))
    (if *global-atom-instance*
      (let [meta-from-conveyed (:meta-map m {})]
        ;; Return the global atom instance, optionally with updated metadata
        (if (empty? meta-from-conveyed)
          *global-atom-instance*
          (-with-meta *global-atom-instance* meta-from-conveyed)))
      (do (println "!!! atom/<-conveyable: CRITICAL - No global atom instance for AtomDomain reconstruction") nil))

    :else m))

(defn mem-window
  ([atom-domain-deftype-instance] (mem-window atom-domain-deftype-instance {}))
  ([atom-domain-deftype-instance opts]
   (let [s-atom-env-map (get-env atom-domain-deftype-instance)
         {:keys [sab index-view data-view config]} s-atom-env-map]
     (when (or (nil? sab) (nil? index-view) (nil? data-view) (nil? config))
       (throw (js/Error. "mem-window: s-atom-env components are nil.")))
     (let [{:keys [sab-total-size-bytes max-block-descriptors index-region-size data-region-start-offset]} config
           {:keys [max-descriptors-to-show max-view-lines chars-per-line show-legend? descriptors-per-table-row focus-offset]
            :or {max-descriptors-to-show 32 max-view-lines 12 chars-per-line 32 show-legend? false descriptors-per-table-row 16 focus-offset nil}} opts]
       (println (str "--- Atom Memory Window (SAB Size: " sab-total-size-bytes ", MaxDesc: " max-block-descriptors ") ---"))
       (println (str "IndexRegionSz: " index-region-size ", DataRegionStart: " data-region-start-offset))
       (when (instance? AtomDomain atom-domain-deftype-instance)
         (println (str "AtomDomain Root Ptr (data block desc_idx): "
                       (js/Atomics.load index-view (/ d/OFFSET_ATOM_ROOT_DATA_DESC_IDX d/SIZE_OF_INT32)))))
       (println "--- Block Descriptors ---")
       (if (pos? max-descriptors-to-show)
         (loop [current-idx (or (:start-descriptor opts) 0)]
           (when (< current-idx (min (+ (or (:start-descriptor opts) 0) max-descriptors-to-show) max-block-descriptors))
             (u/print-descriptor-table index-view current-idx descriptors-per-table-row (min (+ (or (:start-descriptor opts) 0) max-descriptors-to-show) max-block-descriptors))
             (recur (+ current-idx descriptors-per-table-row))))
         (println "  (No descriptors requested to be shown)"))
       (let [data-region-actual-size (max 0 (- sab-total-size-bytes data-region-start-offset))
             max_display_bytes (* max-view-lines chars-per-line)
             max_addr_to_display (+ data-region-start-offset (min data-region-actual-size max_display_bytes) -1)
             target_addr_hex_len (max 6 (count (.toString max_addr_to_display 16)))
             model-char-map-full-str (u/generate-model-char-map-str index-view config data-region-actual-size)]
         (println (str "Model Char View (Data Region, " chars-per-line " chars/line): #=alloc +=cont _=free .=unused/zeroed"))
         (if (pos? data-region-actual-size)
           (loop [line-idx 0 current-char-map-offset 0]
             (when (and (< line-idx max-view-lines) (< current-char-map-offset (count model-char-map-full-str)))
               (let [chars-on-this-line (min chars-per-line (- (count model-char-map-full-str) current-char-map-offset))
                     line-abs-sab-offset (+ data-region-start-offset current-char-map-offset)
                     hex-addr-raw (.toString line-abs-sab-offset 16)
                     addr-padding-needed (max 0 (- target_addr_hex_len (count hex-addr-raw)))
                     address-str (str (apply str (repeat addr-padding-needed "0")) hex-addr-raw ": ")
                     is-focused-line? (and focus-offset (>= focus-offset line-abs-sab-offset) (< focus-offset (+ line-abs-sab-offset chars-per-line)))]
                 (println (str (if is-focused-line? ">> " "   ")
                               (u/format-char-data-line address-str model-char-map-full-str current-char-map-offset chars-on-this-line chars-per-line))))
               (recur (inc line-idx) (+ current-char-map-offset chars-per-line))))
           (println "Data Region is empty or invalid for Model Char View."))
         (println (str "Raw Data (Enhanced Char View, " chars-per-line " bytes/line):"))
         (if (pos? data-region-actual-size)
           (u/hex-window sab {:offset data-region-start-offset :length (min data-region-actual-size (* max-view-lines chars-per-line)) :bytes-per-row chars-per-line :show-legend? show-legend?})
           (println "Data Region is empty or invalid for Raw Data View.")))
       (let [value-data-block-desc-idx-to-decode
             (cond
               (instance? AtomDomain atom-domain-deftype-instance)
               (js/Atomics.load index-view (/ d/OFFSET_ATOM_ROOT_DATA_DESC_IDX d/SIZE_OF_INT32))
               (instance? SharedAtom atom-domain-deftype-instance)
               (let [hdr-desc-idx (.-header-descriptor-idx ^SharedAtom atom-domain-deftype-instance)
                     ptr-field-offset (+ (u/get-block-descriptor-base-int32-offset hdr-desc-idx) (/ d/OFFSET_BD_VALUE_DATA_DESC_IDX d/SIZE_OF_INT32))]
                 (js/Atomics.load index-view ptr-field-offset))
               :else d/ROOT_POINTER_NIL_SENTINEL)]
         (when (not= value-data-block-desc-idx-to-decode d/ROOT_POINTER_NIL_SENTINEL)
           (println (str "Decode of Atom's Value (from data_block_desc_idx: " value-data-block-desc-idx-to-decode ")"))
           (let [data-block-status (u/read-block-descriptor-field index-view value-data-block-desc-idx-to-decode d/OFFSET_BD_STATUS)
                 data-offset (u/read-block-descriptor-field index-view value-data-block-desc-idx-to-decode d/OFFSET_BD_DATA_OFFSET)
                 data-length (u/read-block-descriptor-field index-view value-data-block-desc-idx-to-decode d/OFFSET_BD_DATA_LENGTH)]
             (if (and (or (== data-block-status d/STATUS_ALLOCATED) (== data-block-status d/STATUS_EMBEDDED_ATOM_HEADER))
                      (>= data-length 0)
                      (<= (+ data-offset data-length) sab-total-size-bytes))
               (let [block-data-segment (if (> data-length 0) (js/Uint8Array. sab data-offset data-length) (js/Uint8Array. 0))]
                 (println (str "  Raw Hex (first 32 bytes): " (u/format-bytes-as-hex block-data-segment 32)))
                 (println "  Decoded:" (try (pr-str (default-deserializer block-data-segment {:s-atom-env s-atom-env-map})) (catch :default e (str "ERROR Deserializing: " e))))
                 (when (= data-block-status d/STATUS_EMBEDDED_ATOM_HEADER) (println "  (Note: Decoded an EMBEDDED_ATOM_HEADER's value pointer field)")))
               (println (str "Atom's value data block (desc_idx: " value-data-block-desc-idx-to-decode ") invalid/empty. Status: " data-block-status ", Length: " data-length)))))
         (when (= value-data-block-desc-idx-to-decode d/ROOT_POINTER_NIL_SENTINEL)
           (println "Atom's value is nil (pointer is NIL_SENTINEL).")))
       (println "--- End Atom Memory Window ---")))))


