(ns cljs-thread.eve.deftype-proto.alloc
  "Slab-based allocator for EVE.

   ARCHITECTURE:
   ═══════════════════════════════════════════════════════════════

   Multiple SharedArrayBuffers — one per size class — each with:
   - Fixed-size blocks (no coalescing)
   - Bitmap free-tracking (SIMD-accelerated)
   - Independent growth via memory.grow

   ADDRESSING:
   ═══════════════════════════════════════════════════════════════

   All node offsets are 'slab-qualified': a 32-bit value encoding
   both the slab class AND the block index within that slab.

   Format: [class_idx:3 bits | block_idx:29 bits]
   - class_idx 0-5: slab classes (32B..1024B)
   - class_idx 6: overflow (old-style allocator)
   - class_idx 7: reserved
   - block_idx: up to 536M blocks per slab

   This encoding is transparent to callers: they pass around 'offsets'
   just like before, but the offset now encodes the slab routing.
   Read/write helpers decode the slab class and compute the actual
   byte offset within the target SAB.

   QUEUE ALLOC + GRAFTING COMPATIBILITY:
   ═══════════════════════════════════════════════════════════════

   The pool system (pool-64, pool-128, etc.) maps directly to slab classes.
   alloc-bytes! routes by size → slab class → bitmap scan → block index.
   Grafting works because node offsets are slab-qualified — when the graft
   reads a child pointer, it decodes to the right slab's DataView.

   Data access helpers (read-u8, write-u8, read-i32, etc.) transparently
   resolve slab-qualified offsets to the correct SAB + byte position."
  (:refer-clojure :exclude [atom])
  (:require
   [cljs-thread.eve.deftype-proto.data :as d]
   [cljs-thread.eve.deftype-proto.wasm :as wasm]
   [cljs-thread.eve.shared-atom :as legacy-atom]))

;;=============================================================================
;; Slab-Qualified Offset Encoding
;;=============================================================================
;; We use 3 high bits for class index (0-7) and 29 low bits for block index.
;; This gives us up to 512M blocks per slab (29 bits).
;; For a 1MB slab with 32B blocks = 32768 blocks — plenty of headroom.
;;
;; class_idx 0-5: slab classes
;; class_idx 6: overflow (uses legacy flat allocator for >1024B blocks)
;; class_idx 7: reserved/sentinel

(def ^:const CLASS_BITS 3)
(def ^:const BLOCK_IDX_BITS 29)
(def ^:const BLOCK_IDX_MASK (dec (bit-shift-left 1 BLOCK_IDX_BITS)))
(def ^:const OVERFLOW_CLASS_IDX 6)
(def ^:const SENTINEL_CLASS_IDX 7)

;; NIL sentinel: all bits set = class 7, block 0x1FFFFFFF
(def ^:const NIL_OFFSET -1)

;; Forward declaration for init-root-sab! (defined later, called from init!)
(declare init-root-sab!)

(defn encode-slab-offset
  "Encode a slab class index and block index into a slab-qualified offset."
  ^number [^number class-idx ^number block-idx]
  (bit-or (bit-shift-left class-idx BLOCK_IDX_BITS)
          (bit-and block-idx BLOCK_IDX_MASK)))

(defn decode-class-idx
  "Extract the slab class index from a slab-qualified offset."
  ^number [^number slab-offset]
  (unsigned-bit-shift-right slab-offset BLOCK_IDX_BITS))

(defn decode-block-idx
  "Extract the block index from a slab-qualified offset."
  ^number [^number slab-offset]
  (bit-and slab-offset BLOCK_IDX_MASK))

;; Cached per-slab layout info (set during init-slab!)
;; Slots 0-5: slab classes. Slot 6: overflow (legacy SAB).
;; For overflow (class 6): data-offset=0, block-size=1, so
;; slab-offset->byte-offset yields: 0 + block_idx * 1 = block_idx (raw byte offset).
(def ^:private slab-data-offsets #js [0 0 0 0 0 0 0])     ;; byte offset of data region
(def ^:private slab-bitmap-offsets #js [0 0 0 0 0 0 0])    ;; byte offset of bitmap region
(def ^:private slab-total-blocks #js [0 0 0 0 0 0 0])      ;; total blocks per slab

(defn slab-offset->byte-offset
  "Convert a slab-qualified offset to the actual byte offset within the slab's SAB.
   Returns the byte offset in the slab's data region."
  ^number [^number slab-offset]
  (let [class-idx (decode-class-idx slab-offset)
        block-idx (decode-block-idx slab-offset)
        block-size (aget d/SLAB_SIZES class-idx)]
    ;; data_offset is stored in the slab header
    ;; For performance, we cache this per-slab instead of reading header every time
    (+ (aget slab-data-offsets class-idx) (* block-idx block-size))))

(defn get-slab-data-offset
  "Get the cached data offset for a slab class. For debugging."
  [class-idx]
  (aget slab-data-offsets class-idx))

;;=============================================================================
;; Overflow (class 6) — legacy eve.atom allocator
;;=============================================================================
;; Blocks >1024B are allocated from the original eve.atom SAB.
;; We track byte-offset → descriptor-idx so free! can route back.

(def ^:private ^:mutable legacy-env nil)
(def ^:private overflow-desc-map (js/Map.))  ;; byte-offset → descriptor-idx

;;=============================================================================
;; Diagnostic Hooks (for X-RAY pool tracking)
;;=============================================================================
;; When enabled, these hooks are called on every alloc/free to track
;; in-use offsets and detect double-alloc/double-free at runtime.

(def ^:private ^:mutable alloc-hook nil)     ;; fn [offset] called after alloc
(def ^:private ^:mutable recycle-hook nil)   ;; fn [offset] called before free

(defn register-alloc-hook!
  "Register a callback to be invoked after every successful allocation.
   Callback receives the allocated slab-qualified offset."
  [hook-fn]
  (set! alloc-hook hook-fn))

(defn register-recycle-hook!
  "Register a callback to be invoked before every free operation.
   Callback receives the slab-qualified offset being freed."
  [hook-fn]
  (set! recycle-hook hook-fn))

(defn clear-diagnostic-hooks!
  "Clear all diagnostic hooks."
  []
  (set! alloc-hook nil)
  (set! recycle-hook nil))

(defn register-legacy-env!
  "Store the legacy eve.atom s-atom-env for overflow allocation.
   Call once after both slab system and legacy atom are initialized."
  [s-atom-env]
  (set! legacy-env s-atom-env)
  ;; Register the legacy SAB as slab instance 6 for resolve-dv!/resolve-u8!
  (when-let [sab (some-> s-atom-env :sab)]
    (wasm/register-overflow-instance! sab)))

(defn reset-legacy-env!
  "Clear the cached legacy env and overflow descriptor map so the overflow
   allocator re-acquires from *global-atom-instance* on next allocation.
   Call after creating a new atom-domain to avoid overflow OOM on a stale SAB."
  []
  (set! legacy-env nil)
  (.clear overflow-desc-map))

(defn- ensure-legacy-env!
  "Lazily acquire legacy env from *global-atom-instance* if not set."
  []
  (when-not legacy-env
    (when-let [inst legacy-atom/*global-atom-instance*]
      (register-legacy-env! (legacy-atom/get-env inst))))
  legacy-env)

;;=============================================================================
;; Slab Lifecycle
;;=============================================================================

(defn init-slab!
  "Initialize a single slab for a given class index.
   Creates the WebAssembly.Memory, formats the bitmap, and registers with WASM.
   Returns a Promise that resolves when the slab is ready."
  [class-idx & {:keys [capacity]}]
  (let [capacity (or capacity (d/default-capacity-for-class class-idx))
        block-size (aget d/SLAB_SIZES class-idx)
        layout (d/slab-layout block-size capacity)
        {:keys [total-bytes bitmap-offset bitmap-size data-offset total-blocks]} layout
        ;; Create memory for slab (WebAssembly.Memory or plain SharedArrayBuffer)
        wasm-memory (wasm/create-slab-memory total-bytes)
        sab (if (instance? js/SharedArrayBuffer wasm-memory)
              wasm-memory
              (.-buffer wasm-memory))
        i32-view (js/Int32Array. sab)
        u8-view (js/Uint8Array. sab)]
    ;; Write slab header
    (js/Atomics.store i32-view (/ d/SLAB_HDR_MAGIC 4) d/SLAB_MAGIC)
    (js/Atomics.store i32-view (/ d/SLAB_HDR_BLOCK_SIZE 4) block-size)
    (js/Atomics.store i32-view (/ d/SLAB_HDR_TOTAL_BLOCKS 4) total-blocks)
    (js/Atomics.store i32-view (/ d/SLAB_HDR_FREE_COUNT 4) total-blocks)
    (js/Atomics.store i32-view (/ d/SLAB_HDR_ALLOC_CURSOR 4) 0)
    (js/Atomics.store i32-view (/ d/SLAB_HDR_CLASS_IDX 4) class-idx)
    (js/Atomics.store i32-view (/ d/SLAB_HDR_BITMAP_OFFSET 4) bitmap-offset)
    (js/Atomics.store i32-view (/ d/SLAB_HDR_DATA_OFFSET 4) data-offset)
    ;; Zero the bitmap (all blocks free = all bits 0)
    (.fill u8-view 0 bitmap-offset (+ bitmap-offset bitmap-size))
    ;; Cache layout info
    (aset slab-data-offsets class-idx data-offset)
    (aset slab-bitmap-offsets class-idx bitmap-offset)
    (aset slab-total-blocks class-idx total-blocks)
    ;; Initialize WASM instance for this slab
    (wasm/init-slab-instance! class-idx wasm-memory)))

(def ^:private ^:mutable initialized? false)

(defn init!
  "Initialize all 6 slab classes + root SAB.  Slab memory + typed-array views are
   created synchronously so the JS-fallback bitmap operations work
   immediately.  WASM compilation/instantiation happens in the background;
   a Promise is returned that resolves when all WASM upgrades are done
   (callers are free to ignore it).
   Options per class can be passed as a map: {0 {:capacity 2097152} ...}
   Pass :force true to reinitialize (e.g. test runners with custom capacities)."
  [& {:keys [capacities force] :or {capacities {}}}]
  (if (and initialized? (not force))
    (js/Promise.resolve nil)
    (do
      (set! initialized? true)
      ;; Create every slab synchronously — init-slab! formats the header,
      ;; caches layout info, and (via init-slab-instance!) registers typed
      ;; array views immediately.  The Promise each returns is only for the
      ;; optional WASM-export upgrade.
      (let [slab-promises
            (into-array
              (for [i (range d/NUM_SLAB_CLASSES)]
                (let [cap (get capacities i (d/default-capacity-for-class i))]
                  (init-slab! i :capacity cap))))]
        ;; Initialize root SAB for epoch-based GC coordination
        (init-root-sab!)
        (js/Promise.all slab-promises)))))

(defn reset-all-slabs!
  "Reset all slab bitmaps to free state, reset cursors and free counts.
   This reclaims ALL allocated blocks across all size classes — a nuclear
   reset suitable for test runners that need a clean slate between tests.
   The slab memories themselves are preserved (no re-allocation)."
  []
  (dotimes [class-idx d/NUM_SLAB_CLASSES]
    (when-let [inst (wasm/get-slab-instance class-idx)]
      (let [i32-view (:i32 inst)
            u8-view  (:u8 inst)
            bm-offset (aget slab-bitmap-offsets class-idx)
            total     (aget slab-total-blocks class-idx)
            bm-size   (js/Math.ceil (/ total 8))]
        ;; Zero bitmap — all blocks free
        (.fill u8-view 0 bm-offset (+ bm-offset bm-size))
        ;; Reset header counters
        (js/Atomics.store i32-view (/ d/SLAB_HDR_FREE_COUNT 4) total)
        (js/Atomics.store i32-view (/ d/SLAB_HDR_ALLOC_CURSOR 4) 0)))))

;;=============================================================================
;; Root SAB (control plane)
;;=============================================================================

(defonce ^:private root-sab (cljs.core/atom nil))
(defonce ^:private root-i32 (cljs.core/atom nil))

(defn init-root-sab!
  "Create the root/control SharedArrayBuffer.
   Stores atom root pointer, epoch, worker registry."
  []
  (let [sab (js/SharedArrayBuffer. d/ROOT_SAB_SIZE)
        i32 (js/Int32Array. sab)]
    ;; Write magic
    (js/Atomics.store i32 (/ d/ROOT_MAGIC_OFFSET 4) d/ROOT_MAGIC)
    ;; Atom root pointer: nil initially
    (js/Atomics.store i32 (/ d/ROOT_ATOM_PTR_OFFSET 4) NIL_OFFSET)
    ;; Epoch starts at 1 (0 = "not reading")
    (js/Atomics.store i32 (/ d/ROOT_EPOCH_OFFSET 4) 1)
    ;; Worker registry offset
    (js/Atomics.store i32 (/ d/ROOT_WORKER_REG_OFFSET 4) d/ROOT_WORKER_REGISTRY_START)
    ;; Initialize all worker slots as inactive
    (dotimes [slot-idx d/MAX_WORKERS]
      (let [slot-byte-offset (+ d/ROOT_WORKER_REGISTRY_START (* slot-idx d/WORKER_SLOT_SIZE))]
        (js/Atomics.store i32 (/ slot-byte-offset 4) d/WORKER_STATUS_INACTIVE)))
    (reset! root-sab sab)
    (reset! root-i32 i32)
    {:root-sab sab :root-i32 i32}))

(defn init-root-sab-from-existing!
  "Register an existing root SAB (created by main thread) on a worker.
   Reads the already-initialized control plane."
  [sab]
  (let [i32 (js/Int32Array. sab)]
    (reset! root-sab sab)
    (reset! root-i32 i32)
    {:root-sab sab :root-i32 i32}))

(defn get-root-sab
  "Get the root SAB for sharing with workers."
  []
  @root-sab)

;;=============================================================================
;; Worker-Side Slab Initialization (from existing SABs)
;;=============================================================================

(defn get-all-slab-sabs
  "Extract all 6 slab SharedArrayBuffers for passing to workers.
   Returns a JS array [sab0 sab1 sab2 sab3 sab4 sab5]."
  []
  (let [sabs #js []]
    (dotimes [i d/NUM_SLAB_CLASSES]
      (.push sabs (wasm/slab-buffer i)))
    sabs))

(defn populate-slab-caches-from-header!
  "Read a slab's header and populate the module-level caches.
   Used by workers to restore slab layout info from an existing SAB."
  [class-idx sab]
  (let [i32 (js/Int32Array. sab)
        data-offset (js/Atomics.load i32 (/ d/SLAB_HDR_DATA_OFFSET 4))
        bitmap-offset (js/Atomics.load i32 (/ d/SLAB_HDR_BITMAP_OFFSET 4))
        total-blocks (js/Atomics.load i32 (/ d/SLAB_HDR_TOTAL_BLOCKS 4))]
    (aset slab-data-offsets class-idx data-offset)
    (aset slab-bitmap-offsets class-idx bitmap-offset)
    (aset slab-total-blocks class-idx total-blocks)))

(defn init-worker-slabs!
  "Initialize the slab system on a worker from existing SABs.
   Registers each slab instance (with JS fallback bitmap ops),
   populates layout caches from headers, and registers the root SAB.
   slab-sabs can be a JS array or Clojure vector of SharedArrayBuffers.
   Call this from worker initialization when slab SABs are available."
  [slab-sabs root-sab-arg legacy-sab]
  ;; Mark initialized so that core.cljs's module-level (eve/init!) call
  ;; is a no-op on workers — workers never create their own slab memory.
  (set! initialized? true)
  ;; Register each slab class from its SAB
  (dotimes [i d/NUM_SLAB_CLASSES]
    (let [sab (if (array? slab-sabs) (aget slab-sabs i) (nth slab-sabs i))]
      (wasm/register-slab-instance-from-sab! i sab)
      (populate-slab-caches-from-header! i sab)))
  ;; Register legacy SAB as overflow (class 6)
  (when legacy-sab
    (wasm/register-overflow-instance! legacy-sab))
  ;; Register root SAB
  (init-root-sab-from-existing! root-sab-arg))

;;=============================================================================
;; Allocator: Slab-Routed Alloc / Free
;;=============================================================================

(defn alloc
  "Allocate a block of at least `size-bytes`.
   Routes to the appropriate slab class, scans bitmap for a free block,
   CAS-claims it, and returns a slab-qualified offset.
   Returns {:offset <slab-offset> :class-idx <n> :block-idx <n>} or {:error ...}."
  [size-bytes]
  (let [class-idx (d/size->class-idx size-bytes)]
    (if (== class-idx -1)
      ;; Overflow: too large for any slab — route to legacy eve.atom allocator
      (if-let [env (ensure-legacy-env!)]
        (let [result (legacy-atom/alloc env size-bytes)]
          (if (:error result)
            {:error :overflow-oom :size size-bytes}
            (let [byte-off (:offset result)
                  desc-idx (:descriptor-idx result)
                  slab-offset (encode-slab-offset OVERFLOW_CLASS_IDX byte-off)]
              (.set overflow-desc-map byte-off desc-idx)
              (when alloc-hook (alloc-hook slab-offset))
              {:offset slab-offset :class-idx OVERFLOW_CLASS_IDX :block-idx byte-off})))
        {:error :overflow-no-legacy-env :size size-bytes})
      ;; Slab allocation
      (let [bm-offset (aget slab-bitmap-offsets class-idx)
            total-bits (aget slab-total-blocks class-idx)
            ;; Read alloc cursor from slab header
            inst (wasm/get-slab-instance class-idx)
            i32-view (:i32 inst)
            cursor (js/Atomics.load i32-view (/ d/SLAB_HDR_ALLOC_CURSOR 4))]
        ;; Scan for free block starting from cursor
        (loop [start-bit cursor
               wrapped? false]
          (let [candidate (wasm/bitmap-find-free class-idx bm-offset total-bits start-bit)]
            (cond
              ;; Found a candidate — try to CAS-claim it
              (not= candidate -1)
              (if (wasm/bitmap-alloc-cas! class-idx bm-offset candidate)
                ;; Success!
                (let [slab-offset (encode-slab-offset class-idx candidate)]
                  ;; Update cursor hint (non-atomic, just a hint)
                  (js/Atomics.store i32-view (/ d/SLAB_HDR_ALLOC_CURSOR 4)
                                    (mod (inc candidate) total-bits))
                  ;; Decrement free count
                  (js/Atomics.sub i32-view (/ d/SLAB_HDR_FREE_COUNT 4) 1)
                  ;; Call diagnostic hook if registered
                  (when alloc-hook (alloc-hook slab-offset))
                  {:offset slab-offset :class-idx class-idx :block-idx candidate})
                ;; CAS failed (contention) — try next block
                (recur (inc candidate) wrapped?))

              ;; No free block found in this range
              (and (not wrapped?) (pos? cursor))
              ;; Wrap around: scan from 0 to cursor
              (recur 0 true)

              :else
              {:error :out-of-memory :class-idx class-idx})))))))

(defn alloc-offset
  "Like alloc but returns just the slab-qualified offset, or throws on error."
  ^number [^number size-bytes]
  (let [result (alloc size-bytes)]
    (if (:error result)
      (throw (js/Error. (str "Slab alloc failed: " (:error result)
                             " for " size-bytes " bytes")))
      (:offset result))))

(defn free!
  "Free a block identified by its slab-qualified offset.
   For slab classes 0-5: clears the bitmap bit, increments free count.
   For class 6 (overflow): routes to legacy eve.atom/free.
   Returns true if block was freed, false if already free (double-free detected)."
  [^number slab-offset]
  (if (== slab-offset NIL_OFFSET)
    false
    (do
      ;; Call diagnostic hook before freeing (may throw on double-free)
      (when recycle-hook (recycle-hook slab-offset))
      (let [class-idx (decode-class-idx slab-offset)]
        (if (== class-idx OVERFLOW_CLASS_IDX)
          ;; Overflow block — free via legacy allocator
          (let [byte-off (decode-block-idx slab-offset)
                desc-idx (.get overflow-desc-map byte-off)]
            (if (and legacy-env (some? desc-idx))
              (do
                (legacy-atom/free legacy-env desc-idx)
                (.delete overflow-desc-map byte-off)
                true)
              false))
          ;; Slab block — clear bitmap bit, only increment free-count if valid
          (let [block-idx (decode-block-idx slab-offset)
                bm-offset (aget slab-bitmap-offsets class-idx)
                inst (wasm/get-slab-instance class-idx)
                i32-view (:i32 inst)
                freed? (wasm/bitmap-free! class-idx bm-offset block-idx)]
            (when freed?
              (js/Atomics.add i32-view (/ d/SLAB_HDR_FREE_COUNT 4) 1))
            freed?))))))

(defn batch-alloc
  "Allocate up to `max-count` blocks of `size-bytes` each.
   Returns a JS array of slab-qualified offsets."
  [size-bytes max-count]
  (let [class-idx (d/size->class-idx size-bytes)]
    (when (not= class-idx -1)
      (let [bm-offset (aget slab-bitmap-offsets class-idx)
            total-bits (aget slab-total-blocks class-idx)
            inst (wasm/get-slab-instance class-idx)
            i32-view (:i32 inst)
            cursor (js/Atomics.load i32-view (/ d/SLAB_HDR_ALLOC_CURSOR 4))
            results #js []]
        ;; Scan from cursor
        (loop [start-bit cursor
               wrapped? false]
          (when (< (.-length results) max-count)
            (let [candidate (wasm/bitmap-find-free class-idx bm-offset total-bits start-bit)]
              (cond
                (not= candidate -1)
                (if (wasm/bitmap-alloc-cas! class-idx bm-offset candidate)
                  (do (.push results (encode-slab-offset class-idx candidate))
                      (recur (inc candidate) wrapped?))
                  (recur (inc candidate) wrapped?))

                (and (not wrapped?) (pos? cursor))
                (recur 0 true)

                :else nil))))
        ;; Update cursor and free count
        (when (pos? (.-length results))
          (let [last-offset (aget results (dec (.-length results)))
                last-block (decode-block-idx last-offset)]
            (js/Atomics.store i32-view (/ d/SLAB_HDR_ALLOC_CURSOR 4)
                              (mod (inc last-block) total-bits))
            (js/Atomics.sub i32-view (/ d/SLAB_HDR_FREE_COUNT 4) (.-length results))))
        results))))

;;=============================================================================
;; Data Access: Read/Write through slab-qualified offsets
;;=============================================================================
;; These functions decode the slab class + block index from a slab-qualified
;; offset and read/write from/to the correct slab's SAB.
;; This is the key abstraction that makes grafting work transparently:
;; when grafting reads a child pointer (which is a slab-qualified offset),
;; the data-view/u8-view calls resolve to the correct slab's memory.
;;
;; PERFORMANCE NOTE: For multiple reads within the same node, use
;; resolve-dv / resolve-u8 to get (DataView, base-byte-offset) once,
;; then do all reads against that pair. Avoids re-decoding the slab offset
;; on every field access.

;; Mutable scratch for resolve — avoids allocating a JS array per resolve.
;; NOT thread-safe, but we're single-threaded within each worker.
;; Public so macro-generated code in eve-slab-deftype can access them.
(def ^:mutable resolved-dv nil)
(def ^:mutable resolved-u8 nil)
(def ^:mutable resolved-base 0)

(defn resolve-dv!
  "Resolve a slab-qualified offset to a DataView and base byte offset.
   Sets module-level resolved-dv and resolved-base for subsequent reads.
   Returns the base byte offset. Use resolved-dv for the DataView.
   This avoids allocation and is the hot-path accessor for multi-field reads."
  ^number [^number slab-offset]
  (let [class-idx (decode-class-idx slab-offset)
        block-idx (decode-block-idx slab-offset)
        block-size (aget d/SLAB_SIZES class-idx)
        data-off (aget slab-data-offsets class-idx)
        base (+ data-off (* block-idx block-size))
        dv (wasm/slab-data-view class-idx)]
    ;; Debug: log resolution details when DataView is nil or offset seems wrong
    (when (or (nil? dv) (> base 10000000))
      (js/console.error "[resolve-dv! ERROR] slab-offset:" slab-offset
                        "class:" class-idx "block:" block-idx
                        "block-size:" block-size "data-off:" data-off
                        "base:" base "dv:" (if dv "OK" "NIL")))
    (set! resolved-dv dv)
    (set! resolved-base base)
    base))

(defn resolve-u8!
  "Like resolve-dv! but sets resolved-u8 (Uint8Array) for byte operations.
   Returns the base byte offset."
  ^number [^number slab-offset]
  (let [class-idx (decode-class-idx slab-offset)
        block-idx (decode-block-idx slab-offset)
        block-size (aget d/SLAB_SIZES class-idx)
        base (+ (aget slab-data-offsets class-idx) (* block-idx block-size))]
    (set! resolved-u8 (wasm/slab-u8-view class-idx))
    (set! resolved-dv (wasm/slab-data-view class-idx))
    (set! resolved-base base)
    base))

(defn read-u8
  "Read a byte from a slab-qualified offset + byte offset within block."
  ^number [^number slab-offset ^number byte-off]
  (let [class-idx (decode-class-idx slab-offset)
        u8 (wasm/slab-u8-view class-idx)
        base (slab-offset->byte-offset slab-offset)]
    (aget u8 (+ base byte-off))))

(defn write-u8!
  "Write a byte to a slab-qualified offset + byte offset within block."
  [^number slab-offset ^number byte-off ^number val]
  (let [class-idx (decode-class-idx slab-offset)
        u8 (wasm/slab-u8-view class-idx)
        base (slab-offset->byte-offset slab-offset)]
    (aset u8 (+ base byte-off) val)))

(defn read-i32
  "Read an i32 from a slab-qualified offset + byte offset within block.
   byte-off must be 4-byte aligned."
  ^number [^number slab-offset ^number byte-off]
  (let [class-idx (decode-class-idx slab-offset)
        dv (wasm/slab-data-view class-idx)
        base (slab-offset->byte-offset slab-offset)]
    (.getInt32 dv (+ base byte-off) true)))

(defn write-i32!
  "Write an i32 to a slab-qualified offset + byte offset within block."
  [^number slab-offset ^number byte-off ^number val]
  (let [class-idx (decode-class-idx slab-offset)
        dv (wasm/slab-data-view class-idx)
        base (slab-offset->byte-offset slab-offset)]
    (.setInt32 dv (+ base byte-off) val true)))

(defn read-u16
  "Read a u16 from a slab-qualified offset."
  ^number [^number slab-offset ^number byte-off]
  (let [class-idx (decode-class-idx slab-offset)
        dv (wasm/slab-data-view class-idx)
        base (slab-offset->byte-offset slab-offset)]
    (.getUint16 dv (+ base byte-off) true)))

(defn write-u16!
  "Write a u16 to a slab-qualified offset."
  [^number slab-offset ^number byte-off ^number val]
  (let [class-idx (decode-class-idx slab-offset)
        dv (wasm/slab-data-view class-idx)
        base (slab-offset->byte-offset slab-offset)]
    (.setUint16 dv (+ base byte-off) val true)))

(defn read-bytes
  "Read a Uint8Array slice from a slab-qualified offset.
   Returns a view (not a copy) into the slab's SAB."
  [^number slab-offset ^number byte-off ^number len]
  (let [class-idx (decode-class-idx slab-offset)
        u8 (wasm/slab-u8-view class-idx)
        base (slab-offset->byte-offset slab-offset)]
    (.subarray u8 (+ base byte-off) (+ base byte-off len))))

(defn write-bytes!
  "Write a Uint8Array to a slab-qualified offset."
  [^number slab-offset ^number byte-off ^js src-bytes]
  (let [class-idx (decode-class-idx slab-offset)
        u8 (wasm/slab-u8-view class-idx)
        base (slab-offset->byte-offset slab-offset)]
    (.set u8 src-bytes (+ base byte-off))))

(defn copy-within-slab!
  "Copy bytes within the same slab. Both offsets must be slab-qualified
   with the same class index."
  [^number dst-slab-offset ^number dst-byte-off
   ^number src-slab-offset ^number src-byte-off
   ^number len]
  (let [class-idx (decode-class-idx dst-slab-offset)
        u8 (wasm/slab-u8-view class-idx)
        dst-base (slab-offset->byte-offset dst-slab-offset)
        src-base (slab-offset->byte-offset src-slab-offset)]
    (.copyWithin u8 (+ dst-base dst-byte-off) (+ src-base src-byte-off)
                 (+ src-base src-byte-off len))))

(defn copy-block!
  "Copy an entire block from one slab-qualified offset to another.
   Source and destination may be in different slabs."
  [^number dst-slab-offset ^number src-slab-offset ^number len]
  (let [src-class (decode-class-idx src-slab-offset)
        dst-class (decode-class-idx dst-slab-offset)]
    (if (== src-class dst-class)
      ;; Same slab — use copyWithin (fastest)
      (copy-within-slab! dst-slab-offset 0 src-slab-offset 0 len)
      ;; Cross-slab — read from src, write to dst
      (let [src-bytes (read-bytes src-slab-offset 0 len)]
        (write-bytes! dst-slab-offset 0 src-bytes)))))

;;=============================================================================
;; Root Pointer Operations (CAS on the root SAB)
;;=============================================================================

(defn read-root-ptr
  "Read the atom root pointer (a slab-qualified offset)."
  ^number []
  (js/Atomics.load @root-i32 (/ d/ROOT_ATOM_PTR_OFFSET 4)))

(defn cas-root-ptr!
  "CAS the atom root pointer. Returns true on success."
  [^number expected ^number new-val]
  (== expected
      (js/Atomics.compareExchange @root-i32 (/ d/ROOT_ATOM_PTR_OFFSET 4)
                                  expected new-val)))

;;=============================================================================
;; Epoch Management (on root SAB)
;;=============================================================================

(defn get-current-epoch
  "Read the current global epoch."
  ^number []
  (js/Atomics.load @root-i32 (/ d/ROOT_EPOCH_OFFSET 4)))

(defn increment-epoch!
  "Atomically increment global epoch. Returns the new epoch."
  ^number []
  (inc (js/Atomics.add @root-i32 (/ d/ROOT_EPOCH_OFFSET 4) 1)))

;;=============================================================================
;; Worker Registry (on root SAB)
;;=============================================================================

(defn- worker-slot-int32-offset
  "Calculate Int32Array index for a worker slot."
  ^number [^number slot-idx]
  (/ (+ d/ROOT_WORKER_REGISTRY_START (* slot-idx d/WORKER_SLOT_SIZE)) 4))

(defn register-worker!
  "Claim a worker slot. Returns slot index or nil."
  [worker-id]
  (let [i32 @root-i32]
    (loop [slot-idx 0]
      (when (< slot-idx d/MAX_WORKERS)
        (let [status-idx (worker-slot-int32-offset slot-idx)]
          (if (== d/WORKER_STATUS_INACTIVE
                  (js/Atomics.compareExchange i32 status-idx
                                              d/WORKER_STATUS_INACTIVE
                                              d/WORKER_STATUS_ACTIVE))
            (let [slot-byte-offset (+ d/ROOT_WORKER_REGISTRY_START
                                      (* slot-idx d/WORKER_SLOT_SIZE))]
              (js/Atomics.store i32 (/ (+ slot-byte-offset d/OFFSET_WS_WORKER_ID) 4) worker-id)
              (js/Atomics.store i32 (/ (+ slot-byte-offset d/OFFSET_WS_CURRENT_EPOCH) 4) 0)
              slot-idx)
            (recur (inc slot-idx))))))))

(defn unregister-worker!
  "Release a worker slot."
  [slot-idx]
  (when (and (>= slot-idx 0) (< slot-idx d/MAX_WORKERS))
    (let [i32 @root-i32
          status-idx (worker-slot-int32-offset slot-idx)]
      (js/Atomics.store i32 (+ status-idx (/ d/OFFSET_WS_CURRENT_EPOCH 4)) 0)
      (js/Atomics.store i32 status-idx d/WORKER_STATUS_INACTIVE))))

;;=============================================================================
;; Diagnostic Helpers
;;=============================================================================

(defn slab-stats
  "Return stats for a slab class: {:block-size :total-blocks :free-count :used-count}."
  [class-idx]
  (let [inst (wasm/get-slab-instance class-idx)
        i32 (:i32 inst)
        total (aget slab-total-blocks class-idx)
        free (js/Atomics.load i32 (/ d/SLAB_HDR_FREE_COUNT 4))]
    {:block-size (aget d/SLAB_SIZES class-idx)
     :total-blocks total
     :free-count free
     :used-count (- total free)}))

(defn all-slab-stats
  "Return stats for all slab classes."
  []
  (into {} (for [i (range d/NUM_SLAB_CLASSES)]
             [i (slab-stats i)])))
