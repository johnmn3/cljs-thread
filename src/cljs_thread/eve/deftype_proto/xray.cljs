(ns cljs-thread.eve.deftype-proto.xray
  "X-RAY — Slab Allocator Invariant Checker with Memory Trace.

   Analogous to eve.atom/validate-storage-model! but for the slab bitmap allocator.
   Checks 14 invariant classes across all 6 slab classes + the root SAB.

   INVARIANTS:
   ═══════════════════════════════════════════════════════════════
    1. Magic consistency (header.magic == SLAB_MAGIC)
    2. Block size consistency (header.block_size == SLAB_SIZES[class])
    3. Class index consistency (header.class_idx == class)
    4. Free count vs bitmap (header.free_count == popcount of free bits)
    5. Cursor in bounds (0 <= cursor <= total_blocks)
    6. Layout: bitmap_offset == SLAB_HEADER_SIZE
    7. Data offset: data_offset == bitmap_offset + bitmap_byte_size
    8. SAB size: buffer.byteLength >= data_offset + total_blocks * block_size
    9. No bits set beyond total_blocks in bitmap
   10. Root magic (root_magic == ROOT_MAGIC)
   11. Root pointer valid (NIL or valid slab class 0-6)
   12. Epoch positive (epoch >= 1)
   13. Worker slot hygiene (active workers have valid epochs)
   14. Cross-slab: root pointer block is actually allocated in bitmap

   MEMORY TRACE:
   ═══════════════════════════════════════════════════════════════
   Rolling buffer of xray frames. Each frame captures bitmap state,
   allocation counts, and invariant results. On failure, replays
   the full trace so you can see the transitions that led to the break.

   Usage:
     (slab-xray-validate! \"PRE scene-build\")   ;; capture + check + throw
     (slab-xray-validate! \"POST scene-build\")  ;; capture + check + throw"
  (:require [cljs-thread.eve.deftype-proto.data :as d]
            [cljs-thread.eve.deftype-proto.wasm :as wasm]
            [cljs-thread.eve.deftype-proto.alloc :as eve-alloc]))

;;=============================================================================
;; Global diagnostics kill-switch
;; Set to false via :closure-defines to eliminate all invariant checking,
;; xray tracing, and debug logging. Closure compiler will DCE the dead
;; branches in :advanced mode.
;;=============================================================================

(goog-define DIAGNOSTICS false)

;;=============================================================================
;; Frame Buffer — rolling trace of slab xray snapshots
;;=============================================================================

(def ^:const MAX_TRACE_FRAMES 50)
(defonce ^:private trace-frames #js [])
(defonce ^:private trace-enabled (volatile! false))
(defonce ^:private trace-count (volatile! 0))

(defn enable-trace!
  "Enable slab xray memory trace. Clears previous frames.
   No-op when DIAGNOSTICS is false."
  []
  (when DIAGNOSTICS
    (vreset! trace-enabled true)
    (vreset! trace-count 0)
    (set! (.-length trace-frames) 0)
    (js/console.log "[SLAB X-RAY] Memory trace ENABLED")))

(defn disable-trace!
  "Disable slab xray memory trace."
  []
  (vreset! trace-enabled false)
  (js/console.log "[SLAB X-RAY] Memory trace DISABLED"))

(defn trace-enabled?
  "Returns true if slab xray tracing is active."
  []
  @trace-enabled)

;;=============================================================================
;; Bitmap Utilities
;;=============================================================================

(defn- popcount-word
  "Count set bits in a 32-bit integer (Kernighan's trick)."
  ^number [^number w]
  (loop [v w c 0]
    (if (zero? v) c
      (recur (bit-and v (dec v)) (inc c)))))

(defn- bitmap-count-allocated
  "Count allocated blocks by counting set bits in the bitmap.
   Returns [allocated free] pair."
  [^js i32-view ^number bm-int32-offset ^number total-blocks]
  (let [word-count (unsigned-bit-shift-right (+ total-blocks 31) 5)
        last-word-bits (let [r (bit-and total-blocks 31)]
                         (if (zero? r) 32 r))]
    (loop [i 0 allocated 0]
      (if (>= i word-count)
        #js [allocated (- total-blocks allocated)]
        (let [word (js/Atomics.load i32-view (+ bm-int32-offset i))
              pc (popcount-word word)]
          (recur (inc i) (+ allocated pc)))))))

(defn- bitmap-bits-beyond-total
  "Check if any bitmap bits are set beyond total_blocks (should all be 0).
   Returns count of invalid set bits."
  ^number [^js i32-view ^number bm-int32-offset ^number total-blocks]
  (let [last-word-idx (unsigned-bit-shift-right total-blocks 5)
        remainder (bit-and total-blocks 31)
        word-count (unsigned-bit-shift-right (+ total-blocks 31) 5)]
    (if (zero? remainder)
      ;; total_blocks is a multiple of 32, no partial word to check
      0
      ;; Check the last partial word: bits at positions remainder..31 should be 0
      (let [word (js/Atomics.load i32-view (+ bm-int32-offset last-word-idx))
            ;; Mask for bits that should be zero (above the valid range)
            overflow-mask (bit-shift-left -1 remainder)
            overflow-bits (bit-and word overflow-mask)]
        (popcount-word overflow-bits)))))

;;=============================================================================
;; Bitmap ASCII Visualization
;;=============================================================================

(defn- render-bitmap-bar
  "Render a slab bitmap as an ASCII bar of `width` chars.
   A=allocated F=free .=partially mixed"
  [^js i32-view ^number bm-int32-offset ^number total-blocks ^number width]
  (let [blocks-per-col (max 1 (js/Math.ceil (/ total-blocks width)))
        bar (make-array width)]
    (dotimes [c width]
      (let [start-block (* c blocks-per-col)
            end-block (min total-blocks (* (inc c) blocks-per-col))
            span (- end-block start-block)]
        (if (zero? span)
          (aset bar c " ")
          ;; Count allocated blocks in this column's range
          (let [alloc-count
                (loop [b start-block acc 0]
                  (if (>= b end-block)
                    acc
                    (let [word-idx (unsigned-bit-shift-right b 5)
                          bit-pos (bit-and b 31)
                          word (js/Atomics.load i32-view (+ bm-int32-offset word-idx))
                          set? (not (zero? (bit-and word (bit-shift-left 1 bit-pos))))]
                      (recur (inc b) (if set? (inc acc) acc)))))
                ratio (/ alloc-count span)]
            (aset bar c
                  (cond
                    (== alloc-count span) "A"
                    (zero? alloc-count) "F"
                    (> ratio 0.75) "a"
                    (< ratio 0.25) "f"
                    :else "."))))))
    (apply str (seq bar))))

;;=============================================================================
;; Invariant Scanner
;;=============================================================================

(defn- scan-slab-class
  "Scan a single slab class and check invariants 1-9.
   Returns {:valid? bool :errors [...] :stats {...} :bitmap-bar str}."
  [^number class-idx ^number bar-width]
  (let [inst (wasm/get-slab-instance class-idx)
        errors #js []]
    (if-not inst
      {:valid? false
       :errors [{:class class-idx :invariant 0 :msg "Slab instance not initialized"}]
       :stats nil :bitmap-bar nil}
      (let [i32-view (:i32 inst)
            u8-view (:u8 inst)
            buf-size (.-byteLength (.-buffer i32-view))
            ;; Read header fields atomically
            magic (js/Atomics.load i32-view (/ d/SLAB_HDR_MAGIC 4))
            block-size (js/Atomics.load i32-view (/ d/SLAB_HDR_BLOCK_SIZE 4))
            total-blocks (js/Atomics.load i32-view (/ d/SLAB_HDR_TOTAL_BLOCKS 4))
            free-count (js/Atomics.load i32-view (/ d/SLAB_HDR_FREE_COUNT 4))
            alloc-cursor (js/Atomics.load i32-view (/ d/SLAB_HDR_ALLOC_CURSOR 4))
            hdr-class-idx (js/Atomics.load i32-view (/ d/SLAB_HDR_CLASS_IDX 4))
            bitmap-offset (js/Atomics.load i32-view (/ d/SLAB_HDR_BITMAP_OFFSET 4))
            data-offset (js/Atomics.load i32-view (/ d/SLAB_HDR_DATA_OFFSET 4))
            expected-block-size (aget d/SLAB_SIZES class-idx)
            expected-bitmap-size (d/bitmap-byte-size total-blocks)
            bm-int32-offset (unsigned-bit-shift-right bitmap-offset 2)
            ;; Count actual allocated blocks from bitmap
            counts (bitmap-count-allocated i32-view bm-int32-offset total-blocks)
            actual-allocated (aget counts 0)
            actual-free (aget counts 1)
            ;; Check for bits beyond total_blocks
            overflow-bits (bitmap-bits-beyond-total i32-view bm-int32-offset total-blocks)]

        ;; Invariant 1: Magic
        (when (not= magic d/SLAB_MAGIC)
          (.push errors #js [class-idx 1 (str "Magic mismatch: got 0x"
                                              (.toString magic 16) " expected 0x534C4142")]))
        ;; Invariant 2: Block size
        (when (not= block-size expected-block-size)
          (.push errors #js [class-idx 2 (str "Block size: header=" block-size
                                              " expected=" expected-block-size)]))
        ;; Invariant 3: Class index
        (when (not= hdr-class-idx class-idx)
          (.push errors #js [class-idx 3 (str "Class idx: header=" hdr-class-idx
                                              " expected=" class-idx)]))
        ;; Invariant 4: Free count vs bitmap popcount
        (when (not= free-count actual-free)
          (.push errors #js [class-idx 4 (str "Free count mismatch: header=" free-count
                                              " bitmap=" actual-free
                                              " (diff=" (- free-count actual-free) ")")]))
        ;; Invariant 5: Cursor bounds
        (when (or (< alloc-cursor 0) (> alloc-cursor total-blocks))
          (.push errors #js [class-idx 5 (str "Cursor out of bounds: " alloc-cursor
                                              " total_blocks=" total-blocks)]))
        ;; Invariant 6: Bitmap offset
        (when (not= bitmap-offset d/SLAB_HEADER_SIZE)
          (.push errors #js [class-idx 6 (str "Bitmap offset: " bitmap-offset
                                              " expected " d/SLAB_HEADER_SIZE)]))
        ;; Invariant 7: Data offset
        (let [expected-data-offset (+ bitmap-offset expected-bitmap-size)]
          (when (not= data-offset expected-data-offset)
            (.push errors #js [class-idx 7 (str "Data offset: " data-offset
                                                " expected " expected-data-offset)])))
        ;; Invariant 8: SAB size
        (let [min-size (+ data-offset (* total-blocks block-size))]
          (when (< buf-size min-size)
            (.push errors #js [class-idx 8 (str "SAB too small: " buf-size
                                                " need " min-size)])))
        ;; Invariant 9: No bits beyond total_blocks
        (when (pos? overflow-bits)
          (.push errors #js [class-idx 9 (str overflow-bits " bits set beyond total_blocks="
                                              total-blocks)]))

        ;; Render bitmap bar
        (let [bitmap-bar (render-bitmap-bar i32-view bm-int32-offset total-blocks bar-width)]
          {:valid? (zero? (.-length errors))
           :errors (vec (map (fn [e] {:class (aget e 0) :invariant (aget e 1) :msg (aget e 2)})
                          (array-seq errors)))
           :stats {:class-idx class-idx
                   :block-size block-size
                   :total-blocks total-blocks
                   :header-free-count free-count
                   :bitmap-allocated actual-allocated
                   :bitmap-free actual-free
                   :alloc-cursor alloc-cursor
                   :data-offset data-offset
                   :sab-size buf-size}
           :bitmap-bar bitmap-bar})))))

(defn- scan-root-sab
  "Scan the root SAB for invariants 10-14.
   Returns {:valid? bool :errors [...] :stats {...}}."
  []
  (let [i32 @eve-alloc/root-i32
        errors #js []]
    (if-not i32
      {:valid? false
       :errors [{:invariant 10 :msg "Root SAB not initialized"}]
       :stats nil}
      (let [magic (js/Atomics.load i32 (/ d/ROOT_MAGIC_OFFSET 4))
            root-ptr (js/Atomics.load i32 (/ d/ROOT_ATOM_PTR_OFFSET 4))
            epoch (js/Atomics.load i32 (/ d/ROOT_EPOCH_OFFSET 4))
            ;; Invariant 10: Root magic
            _ (when (not= magic d/ROOT_MAGIC)
                (.push errors #js [10 (str "Root magic: 0x" (.toString magic 16)
                                          " expected 0x524F4F54")]))
            ;; Invariant 11: Root pointer valid
            _ (when (and (not= root-ptr eve-alloc/NIL_OFFSET)
                         (not= root-ptr -1))
                (let [class-idx (eve-alloc/decode-class-idx root-ptr)
                      block-idx (eve-alloc/decode-block-idx root-ptr)]
                  (when (and (> class-idx 6)
                             (not= class-idx eve-alloc/SENTINEL_CLASS_IDX))
                    (.push errors #js [11 (str "Root ptr class=" class-idx
                                               " block=" block-idx " invalid class")]))))
            ;; Invariant 12: Epoch positive
            _ (when (< epoch 1)
                (.push errors #js [12 (str "Epoch=" epoch " (should be >= 1)")]))
            ;; Invariant 13: Worker slot hygiene
            worker-info #js []]
        (dotimes [slot-idx d/MAX_WORKERS]
          (let [slot-byte-offset (+ d/ROOT_WORKER_REGISTRY_START
                                     (* slot-idx d/WORKER_SLOT_SIZE))
                w-status (js/Atomics.load i32 (/ slot-byte-offset 4))
                w-epoch (js/Atomics.load i32 (/ (+ slot-byte-offset d/OFFSET_WS_CURRENT_EPOCH) 4))
                w-id (js/Atomics.load i32 (/ (+ slot-byte-offset d/OFFSET_WS_WORKER_ID) 4))]
            (when (== w-status d/WORKER_STATUS_ACTIVE)
              (.push worker-info #js [slot-idx w-id w-epoch])
              ;; Active worker with epoch > global epoch is suspicious
              (when (and (pos? w-epoch) (> w-epoch epoch))
                (.push errors #js [13 (str "Worker slot " slot-idx
                                           " epoch=" w-epoch " > global=" epoch)])))))

        ;; Invariant 14: If root pointer references a slab block, verify it's allocated
        (when (and (not= root-ptr eve-alloc/NIL_OFFSET)
                   (not= root-ptr -1))
          (let [class-idx (eve-alloc/decode-class-idx root-ptr)
                block-idx (eve-alloc/decode-block-idx root-ptr)]
            (when (< class-idx d/NUM_SLAB_CLASSES)
              (let [inst (wasm/get-slab-instance class-idx)]
                (when inst
                  (let [bm-offset (js/Atomics.load (:i32 inst) (/ d/SLAB_HDR_BITMAP_OFFSET 4))
                        bm-int32-offset (unsigned-bit-shift-right bm-offset 2)
                        word-idx (unsigned-bit-shift-right block-idx 5)
                        bit-pos (bit-and block-idx 31)
                        word (js/Atomics.load (:i32 inst) (+ bm-int32-offset word-idx))
                        allocated? (not (zero? (bit-and word (bit-shift-left 1 bit-pos))))]
                    (when-not allocated?
                      (.push errors
                             #js [14 (str "Root ptr class=" class-idx " block=" block-idx
                                          " NOT allocated in bitmap")]))))))))

        {:valid? (zero? (.-length errors))
         :errors (vec (map (fn [e] {:invariant (aget e 0) :msg (aget e 1)})
                        (array-seq errors)))
         :stats {:root-ptr root-ptr
                 :epoch epoch
                 :active-workers (.-length worker-info)
                 :workers (vec (map (fn [w] {:slot (aget w 0) :id (aget w 1) :epoch (aget w 2)})
                                (array-seq worker-info)))}}))))

;;=============================================================================
;; Full Validation with Frame Capture
;;=============================================================================

(defn slab-xray-scan
  "Full scan of all slab classes + root SAB.
   Returns {:valid? bool :slab-results [...] :root-result {...}
            :frame-lines [...] :all-errors [...]}.
   Returns {:valid? true} immediately when DIAGNOSTICS is false."
  [label]
  (if-not DIAGNOSTICS
    {:valid? true :slab-results [] :root-result {:valid? true} :all-errors []}
  (let [bar-width 40
        slab-results #js []
        all-errors #js []
        frame-lines #js []
        pr! (fn [s] (.push frame-lines s))
        n (vswap! trace-count inc)]
    ;; Header
    (pr! (str "\n[SLAB X-RAY #" n "] " (or label "?")))
    (pr! (str "  ═══════════════════════════════════════════════════════"))

    ;; Scan each slab class
    (dotimes [ci d/NUM_SLAB_CLASSES]
      (let [result (scan-slab-class ci bar-width)]
        (.push slab-results result)
        (when-not (:valid? result)
          (doseq [e (:errors result)]
            (.push all-errors e)))
        (when-let [stats (:stats result)]
          (let [{:keys [block-size total-blocks bitmap-allocated bitmap-free
                        header-free-count alloc-cursor]} stats
                pct (if (pos? total-blocks)
                      (js/Math.round (* 100 (/ bitmap-allocated total-blocks)))
                      0)]
            (pr! (str "  SLAB " ci " (" block-size "B)"
                      " | " total-blocks " blk"
                      " | alloc=" bitmap-allocated
                      " free=" bitmap-free
                      " (hdr=" header-free-count ")"
                      " | " pct "% | cur=" alloc-cursor))
            (when (:bitmap-bar result)
              (pr! (str "  |" (:bitmap-bar result) "|")))
            (when-not (:valid? result)
              (pr! (str "  !! SLAB " ci " ERRORS:")))
            (doseq [e (:errors result)]
              (pr! (str "    [INV" (:invariant e) "] " (:msg e))))))))

    ;; Scan root SAB
    (let [root-result (scan-root-sab)]
      (when-not (:valid? root-result)
        (doseq [e (:errors root-result)]
          (.push all-errors e)))
      (when-let [stats (:stats root-result)]
        (let [{:keys [root-ptr epoch active-workers workers]} stats]
          (pr! (str "  ROOT: ptr=" (if (or (== root-ptr -1) (== root-ptr eve-alloc/NIL_OFFSET))
                                     "NIL"
                                     (str "class=" (eve-alloc/decode-class-idx root-ptr)
                                          " blk=" (eve-alloc/decode-block-idx root-ptr)))
                    " epoch=" epoch
                    " workers=" active-workers))
          (doseq [w workers]
            (pr! (str "    worker[" (:slot w) "] id=" (:id w) " epoch=" (:epoch w))))))
      (when-not (:valid? root-result)
        (pr! "  !! ROOT ERRORS:")
        (doseq [e (:errors root-result)]
          (pr! (str "    [INV" (:invariant e) "] " (:msg e)))))

      (let [valid? (and (every? :valid? (array-seq slab-results))
                        (:valid? root-result))]
        (pr! (if valid?
               "  PASS"
               (str "  !! INVARIANT VIOLATION !! (" (.-length all-errors) " errors)")))
        ;; Build frame
        (let [frame {:label label
                     :valid? valid?
                     :lines (vec (array-seq frame-lines))
                     :slab-stats (vec (map :stats (array-seq slab-results)))
                     :root-stats (:stats root-result)
                     :errors (vec (array-seq all-errors))
                     :timestamp (js/Date.now)}]
          ;; Store in rolling buffer
          (.push trace-frames frame)
          (when (> (.-length trace-frames) MAX_TRACE_FRAMES)
            (.shift trace-frames))
          ;; Print current frame
          (doseq [line (array-seq frame-lines)]
            (js/console.log line))
          {:valid? valid?
           :slab-results (vec (array-seq slab-results))
           :root-result root-result
           :all-errors (vec (array-seq all-errors))
           :frame frame}))))))

;;=============================================================================
;; Trace Replay
;;=============================================================================

(defn replay-trace!
  "Print the full memory trace — all captured frames."
  []
  (js/console.log "\n╔══════════════════════════════════════════════════════════╗")
  (js/console.log   "║            [SLAB X-RAY MEMORY TRACE REPLAY]             ║")
  (js/console.log   "╚══════════════════════════════════════════════════════════╝")
  (dotimes [fi (.-length trace-frames)]
    (let [f (aget trace-frames fi)]
      (js/console.log (str "\n━━━ Frame " (inc fi) "/" (.-length trace-frames)
                    " [" (:label f) "]"
                    (if (:valid? f) " PASS" " !! FAIL !!")
                    " ━━━"))
      (doseq [line (:lines f)]
        (js/console.log line))
      (when (seq (:errors f))
        (js/console.log "  ERRORS:")
        (doseq [e (:errors f)]
          (js/console.log (str "    " e))))))
  (js/console.log "\n═══ [/SLAB X-RAY MEMORY TRACE REPLAY] ═══"))

;;=============================================================================
;; Guard: validate-and-throw
;;=============================================================================

(defn slab-xray-validate!
  "Run full slab xray scan. Throws on invariant violation.
   On failure, replays the entire memory trace before throwing.
   Call before/after transactions to build the diagnostic movie.

   Usage:
     (slab-xray-validate! \"PRE scene-build\")
     (slab-xray-validate! \"POST scene-build\")"
  [label]
  (let [result (slab-xray-scan label)]
    (when-not (:valid? result)
      ;; Replay full trace so you can see the transitions leading to failure
      (replay-trace!)
      (throw (js/Error.
               (str "[SLAB X-RAY] Invariant violation at '" label "': "
                    (count (:all-errors result)) " errors. "
                    "First: " (first (:all-errors result))))))))

;;=============================================================================
;; Quick Stats (no invariant checking, low overhead)
;;=============================================================================

(defn quick-stats
  "Fast snapshot of slab allocation state. No invariant checking.
   Returns a JS object for minimal overhead."
  []
  (let [stats #js []]
    (dotimes [ci d/NUM_SLAB_CLASSES]
      (let [inst (wasm/get-slab-instance ci)]
        (when inst
          (let [i32 (:i32 inst)
                total (js/Atomics.load i32 (/ d/SLAB_HDR_TOTAL_BLOCKS 4))
                free (js/Atomics.load i32 (/ d/SLAB_HDR_FREE_COUNT 4))]
            (.push stats #js [ci (aget d/SLAB_SIZES ci) total (- total free) free])))))
    stats))

(defn print-quick-stats
  "Print one-line slab allocation summary."
  [label]
  (let [stats (quick-stats)
        parts #js []]
    (dotimes [i (.-length stats)]
      (let [s (aget stats i)]
        (.push parts (str "S" (aget s 0) ":" (aget s 3) "/" (aget s 2)))))
    (js/console.log (str "[SLAB] " (or label "") " | " (.join parts " | ")))))

;;=============================================================================
;; Pool Tracking — Single Source of Truth for Allocation Invariants
;;
;; Tracks which slab offsets are currently "in use" (allocated but not freed).
;; Detects:
;;   - Double allocation: allocating an offset that's already in use
;;   - Double free: freeing an offset that's not in use
;;   - Pool corruption: pool returning an offset that's still in use
;;
;; Integration:
;;   Call track-allocate! after every allocation
;;   Call track-recycle! before every free/pool-return
;;   Call pool-tracking-validate! to check invariants
;;=============================================================================

(def ^:private ^:mutable pool-track-enabled? false)
(def ^:private ^:mutable pool-track-debug? false)
(defonce ^:private in-use-offsets (js/Set.))

;; Track allocations per slab class for diagnostics
(defonce ^:private alloc-counts (js/Int32Array. 8))
(defonce ^:private recycle-counts (js/Int32Array. 8))

(defn enable-pool-tracking!
  "Enable pool offset tracking. Clears previous state.
   Registers hooks with alloc module to catch double-free at allocation time."
  []
  (when DIAGNOSTICS
    (.clear in-use-offsets)
    (.fill alloc-counts 0)
    (.fill recycle-counts 0)
    (set! pool-track-enabled? true)
    ;; Register hooks with alloc module for runtime detection
    (eve-alloc/register-alloc-hook! track-allocate!)
    (eve-alloc/register-recycle-hook! track-recycle!)
    (js/console.log "[X-RAY] Pool tracking ENABLED (hooks registered)")))

(defn disable-pool-tracking!
  "Disable pool offset tracking and clear alloc hooks."
  []
  (set! pool-track-enabled? false)
  (.clear in-use-offsets)
  (eve-alloc/clear-diagnostic-hooks!)
  (js/console.log "[X-RAY] Pool tracking DISABLED (hooks cleared)"))

(defn pool-tracking-enabled?
  "Returns true if pool tracking is active."
  []
  pool-track-enabled?)

(defn enable-pool-track-debug!
  "Enable verbose logging for pool operations."
  []
  (set! pool-track-debug? true))

(defn disable-pool-track-debug!
  "Disable verbose logging for pool operations."
  []
  (set! pool-track-debug? false))

(defn clear-pool-tracking!
  "Clear pool tracking state without disabling."
  []
  (.clear in-use-offsets)
  (.fill alloc-counts 0)
  (.fill recycle-counts 0))

(defn track-allocate!
  "Mark offset as in-use. Throws if already in use (double-alloc).
   Call this after every successful allocation."
  [^number offset]
  (when pool-track-enabled?
    (when (.has in-use-offsets offset)
      (let [class-idx (eve-alloc/decode-class-idx offset)
            block-idx (eve-alloc/decode-block-idx offset)]
        (throw (js/Error. (str "[X-RAY POOL] Double allocation! offset=" offset
                               " (class=" class-idx " block=" block-idx ")"
                               " is already in-use!")))))
    (.add in-use-offsets offset)
    (let [class-idx (eve-alloc/decode-class-idx offset)]
      (when (< class-idx 8)
        (aset alloc-counts class-idx (inc (aget alloc-counts class-idx)))))
    (when pool-track-debug?
      (js/console.log "[X-RAY POOL] ALLOC:" offset "in-use-count=" (.-size in-use-offsets)))))

(defn track-recycle!
  "Mark offset as recycled. Throws if not in use (double-free).
   Call this before freeing or returning to pool."
  [^number offset]
  (when pool-track-enabled?
    (when-not (.has in-use-offsets offset)
      (let [class-idx (eve-alloc/decode-class-idx offset)
            block-idx (eve-alloc/decode-block-idx offset)]
        (throw (js/Error. (str "[X-RAY POOL] Double recycle! offset=" offset
                               " (class=" class-idx " block=" block-idx ")"
                               " was NOT in-use!")))))
    (.delete in-use-offsets offset)
    (let [class-idx (eve-alloc/decode-class-idx offset)]
      (when (< class-idx 8)
        (aset recycle-counts class-idx (inc (aget recycle-counts class-idx)))))
    (when pool-track-debug?
      (js/console.log "[X-RAY POOL] RECYCLE:" offset "in-use-count=" (.-size in-use-offsets)))))

(defn track-check-pool-get!
  "Verify an offset about to be returned from pool is not in-use.
   Call this before returning a pooled offset."
  [^number offset]
  (when pool-track-enabled?
    (when (.has in-use-offsets offset)
      (let [class-idx (eve-alloc/decode-class-idx offset)
            block-idx (eve-alloc/decode-block-idx offset)]
        (throw (js/Error. (str "[X-RAY POOL] Pool corruption! offset=" offset
                               " (class=" class-idx " block=" block-idx ")"
                               " is still IN-USE but being returned from pool!")))))))

(defn pool-tracking-stats
  "Returns current pool tracking statistics."
  []
  (when pool-track-enabled?
    {:enabled? true
     :in-use-count (.-size in-use-offsets)
     :alloc-counts (vec (array-seq alloc-counts))
     :recycle-counts (vec (array-seq recycle-counts))}))

(defn pool-tracking-validate!
  "Validate pool tracking invariants. Returns nil if valid, throws on violation.
   Invariant 15: No offsets in pool tracking that shouldn't be there."
  [label]
  (when pool-track-enabled?
    (let [in-use-count (.-size in-use-offsets)
          total-allocs (reduce + 0 (array-seq alloc-counts))
          total-recycles (reduce + 0 (array-seq recycle-counts))
          expected-in-use (- total-allocs total-recycles)]
      ;; Check count consistency
      (when (not= in-use-count expected-in-use)
        (throw (js/Error. (str "[X-RAY POOL INV15] In-use count mismatch at '" label "': "
                               "set-size=" in-use-count
                               " expected=" expected-in-use
                               " (allocs=" total-allocs " recycles=" total-recycles ")"))))
      ;; If trace enabled, record pool stats in frame
      (when pool-track-debug?
        (js/console.log (str "[X-RAY POOL] " label ": in-use=" in-use-count
                             " allocs=" total-allocs " recycles=" total-recycles))))))

;;=============================================================================
;; Enhanced slab-xray-validate! with Pool Tracking
;;=============================================================================

(defn slab-xray-validate-with-pools!
  "Full slab validation PLUS pool tracking invariants.
   Call before/after transactions for complete diagnostics."
  [label]
  (slab-xray-validate! label)
  (pool-tracking-validate! label))
