(ns cljs-thread.eve.deftype-proto.alloc
  "Slab-based allocator for EVE — shared CLJ/CLJS implementation.

   ARCHITECTURE:
   ═══════════════════════════════════════════════════════════════

   Multiple SharedArrayBuffers (CLJS) or mmap files (JVM) — one per size
   class — each with:
   - Fixed-size blocks (no coalescing)
   - Bitmap free-tracking (SIMD-accelerated on CLJS, IMemRegion CAS on JVM)
   - Independent growth via memory.grow (CLJS) or file truncation (JVM)

   ADDRESSING:
   ═══════════════════════════════════════════════════════════════

   All node offsets are 'slab-qualified': a 32-bit value encoding both the
   slab class AND the block index within that slab.

   Format: [class_idx:3 bits | block_idx:29 bits]
   - class_idx 0-5: slab classes (32B..1024B)
   - class_idx 6: overflow (old-style allocator)
   - class_idx 7: reserved/sentinel
   - block_idx: up to 536M blocks per slab

   ISLABIO:
   ═══════════════════════════════════════════════════════════════

   ISlabIO is the new platform-neutral protocol for slab block I/O.
   - CLJS: CljsSlabIO delegates to DataView-based alloc fns (hot path)
   - JVM:  JvmSlabCtx holds one IMemRegion per slab file and accesses
           block data via direct byte reads"
  #?(:cljs (:refer-clojure :exclude [atom]))
  (:require
   [cljs-thread.eve.deftype-proto.coalesc :as coalesc]
   [cljs-thread.eve.deftype-proto.data :as d]
   [cljs-thread.eve.deftype-proto.serialize :as ser]
   [cljs-thread.eve.mem :as mem]
   #?@(:cljs [[cljs-thread.eve.deftype-proto.wasm :as wasm]
               [cljs-thread.eve.shared-atom :as legacy-atom]])))

;;=============================================================================
;; Slab-Qualified Offset Encoding  (shared)
;;=============================================================================

(def ^:const CLASS_BITS 3)
(def ^:const BLOCK_IDX_BITS 29)
(def ^:const BLOCK_IDX_MASK (dec (bit-shift-left 1 BLOCK_IDX_BITS)))
(def ^:const OVERFLOW_CLASS_IDX 6)
(def ^:const SENTINEL_CLASS_IDX 7)

;; NIL sentinel: all bits set = class 7, block 0x1FFFFFFF
(def ^:const NIL_OFFSET -1)

(defn encode-slab-offset
  "Encode a slab class index and block index into a slab-qualified offset."
  [class-idx block-idx]
  (bit-or (bit-shift-left class-idx BLOCK_IDX_BITS)
          (bit-and block-idx BLOCK_IDX_MASK)))

(defn decode-class-idx
  "Extract the slab class index from a slab-qualified offset.
   Treats the offset as an unsigned 32-bit integer (handles sign-extended i32 reads)."
  [slab-offset]
  (unsigned-bit-shift-right (bit-and (long slab-offset) 0xFFFFFFFF) BLOCK_IDX_BITS))

(defn decode-block-idx
  "Extract the block index from a slab-qualified offset.
   Treats the offset as an unsigned 32-bit integer (handles sign-extended i32 reads)."
  [slab-offset]
  (bit-and (bit-and (long slab-offset) 0xFFFFFFFF) BLOCK_IDX_MASK))

;;=============================================================================
;; ISlabIO Protocol  (shared)
;;=============================================================================
;; Platform-neutral interface for slab block I/O.
;; CLJS implementations use DataView; JVM uses IMemRegion byte reads.
;; HAMT algorithms (map.cljc, vec.cljc, etc.) receive an ISlabIO ctx
;; instead of reaching for module-level DataView state.

(defprotocol ISlabIO
  "Abstraction over slab block I/O.
   slab-offset is always a slab-qualified offset [class:3 | block:29].
   field-off   is a byte offset within the block (relative to block start)."

  (-sio-read-u8   [ctx slab-offset field-off]
    "Read one unsigned byte from slab-offset+field-off.")

  (-sio-write-u8!  [ctx slab-offset field-off val]
    "Write one byte to slab-offset+field-off.")

  (-sio-read-u16  [ctx slab-offset field-off]
    "Read a little-endian u16 from slab-offset+field-off.")

  (-sio-write-u16! [ctx slab-offset field-off val]
    "Write a little-endian u16 to slab-offset+field-off.")

  (-sio-read-i32  [ctx slab-offset field-off]
    "Read a little-endian i32 from slab-offset+field-off.")

  (-sio-write-i32! [ctx slab-offset field-off val]
    "Write a little-endian i32 to slab-offset+field-off.")

  (-sio-read-bytes [ctx slab-offset field-off len]
    "Read len bytes starting at slab-offset+field-off.
     Returns a platform byte array (Uint8Array on CLJS, byte[] on JVM).")

  (-sio-write-bytes! [ctx slab-offset field-off src]
    "Write src bytes to slab-offset+field-off.")

  (-sio-alloc!    [ctx size-bytes]
    "Allocate a block of at least size-bytes. Returns slab-qualified offset.
     Throws on OOM.")

  (-sio-free!     [ctx slab-offset]
    "Free a block. Returns true if freed, false on double-free."))

;;=============================================================================
;; JVM: JvmSlabCtx  (CLJ only)
;;=============================================================================

#?(:clj
   (do
     ;; Thread-local alloc log for tracking blocks allocated during a swap.
     ;; Used by jvm-mmap-swap! to free ALL blocks on CAS failure.
     (def ^:private ^ThreadLocal jvm-alloc-log-tl (ThreadLocal.))

     (defn start-jvm-alloc-log!
       "Begin logging allocations on this thread. Call before jvm-resolve-new-ptr."
       []
       (.set jvm-alloc-log-tl (java.util.ArrayList.)))

     (defn drain-jvm-alloc-log!
       "Stop logging and return the logged slab offsets as a vector. Clears the log."
       []
       (let [^java.util.List log (.get jvm-alloc-log-tl)]
         (.set jvm-alloc-log-tl nil)
         (when log (vec log))))

     (deftype JvmSlabCtx
       [^objects regions         ;; IMemRegion[6+] — one per slab class (data files)
        ^objects bitmap-regions  ;; IMemRegion[6+] — one per slab class (bitmap files)
        ^ints    data-offsets    ;; byte offset of data region per class
        ^ints    bitmap-offsets  ;; byte offset of bitmap per class (0 for split files)
        ^ints    total-blocks    ;; total blocks per class
        ^ints    block-sizes     ;; block size per class [32 64 128 256 512 1024]
        ^objects file-paths      ;; String[6+] — data file paths for lazy growth
        ^objects bitmap-paths    ;; String[6+] — bitmap file paths for lazy growth
        ^ints    max-blocks]     ;; max blocks per class (growth cap)

       ISlabIO

       (-sio-read-u8 [_ slab-offset field-off]
         (let [class-idx (decode-class-idx slab-offset)
               block-idx (decode-block-idx slab-offset)
               base      (+ (aget data-offsets class-idx)
                            (* block-idx (aget block-sizes class-idx)))
               region    (aget regions class-idx)
               b         (mem/-read-bytes region (+ base field-off) 1)]
           (bit-and (aget ^bytes b 0) 0xFF)))

       (-sio-write-u8! [_ slab-offset field-off val]
         (let [class-idx (decode-class-idx slab-offset)
               block-idx (decode-block-idx slab-offset)
               base      (+ (aget data-offsets class-idx)
                            (* block-idx (aget block-sizes class-idx)))
               region    (aget regions class-idx)
               b         (byte-array 1)]
           (aset b 0 (unchecked-byte val))
           (mem/-write-bytes! region (+ base field-off) b)))

       (-sio-read-u16 [_ slab-offset field-off]
         (let [class-idx (decode-class-idx slab-offset)
               block-idx (decode-block-idx slab-offset)
               base      (+ (aget data-offsets class-idx)
                            (* block-idx (aget block-sizes class-idx)))
               region    (aget regions class-idx)
               b         (mem/-read-bytes region (+ base field-off) 2)]
           ;; Little-endian u16
           (bit-or (bit-and (aget ^bytes b 0) 0xFF)
                   (bit-shift-left (bit-and (aget ^bytes b 1) 0xFF) 8))))

       (-sio-write-u16! [_ slab-offset field-off val]
         (let [class-idx (decode-class-idx slab-offset)
               block-idx (decode-block-idx slab-offset)
               base      (+ (aget data-offsets class-idx)
                            (* block-idx (aget block-sizes class-idx)))
               region    (aget regions class-idx)
               b         (byte-array 2)]
           (aset b 0 (unchecked-byte (bit-and val 0xFF)))
           (aset b 1 (unchecked-byte (bit-and (unsigned-bit-shift-right val 8) 0xFF)))
           (mem/-write-bytes! region (+ base field-off) b)))

       (-sio-read-i32 [_ slab-offset field-off]
         (let [class-idx (decode-class-idx slab-offset)
               block-idx (decode-block-idx slab-offset)
               base      (+ (aget data-offsets class-idx)
                            (* block-idx (aget block-sizes class-idx)))
               region    (aget regions class-idx)]
           ;; -load-i32 is atomic acquire — fine for reading HAMT nodes
           (mem/-load-i32 region (+ base field-off))))

       (-sio-write-i32! [_ slab-offset field-off val]
         (let [class-idx (decode-class-idx slab-offset)
               block-idx (decode-block-idx slab-offset)
               base      (+ (aget data-offsets class-idx)
                            (* block-idx (aget block-sizes class-idx)))
               region    (aget regions class-idx)]
           (mem/-store-i32! region (+ base field-off) val)))

       (-sio-read-bytes [_ slab-offset field-off len]
         (let [class-idx (decode-class-idx slab-offset)
               block-idx (decode-block-idx slab-offset)
               base      (+ (aget data-offsets class-idx)
                            (* block-idx (aget block-sizes class-idx)))
               region    (aget regions class-idx)]
           (mem/-read-bytes region (+ base field-off) len)))

       (-sio-write-bytes! [_ slab-offset field-off src]
         (let [class-idx (decode-class-idx slab-offset)
               block-idx (decode-block-idx slab-offset)
               base      (+ (aget data-offsets class-idx)
                            (* block-idx (aget block-sizes class-idx)))
               region    (aget regions class-idx)]
           (mem/-write-bytes! region (+ base field-off) src)))

       (-sio-alloc! [ctx size-bytes]
         (let [class-idx (d/size->class-idx size-bytes)]
           (if (== class-idx -1)
             ;; Coalescing allocator (class 6) with lazy growth
             (let [region (aget regions OVERFLOW_CLASS_IDX)]
               (if region
                 (let [byte-off (try
                                  (coalesc/coalesc-alloc! region size-bytes)
                                  (catch Exception _
                                    ;; OOM — grow in a loop until alloc succeeds or at max
                                    (loop [attempts 0]
                                      (let [grew? (locking regions
                                                    (let [result (coalesc/grow-coalesc-region!
                                                                   (aget regions OVERFLOW_CLASS_IDX)
                                                                   coalesc/DEFAULT_DATA_SIZE)]
                                                      (when result
                                                        (let [data-off (long (aget data-offsets OVERFLOW_CLASS_IDX))
                                                              fpath    (aget file-paths OVERFLOW_CLASS_IDX)
                                                              new-r    (mem/open-mmap-region
                                                                         fpath (+ data-off result))]
                                                          (aset regions OVERFLOW_CLASS_IDX new-r))
                                                        true)))]
                                        (if-let [result (try
                                                          (coalesc/coalesc-alloc!
                                                            (aget regions OVERFLOW_CLASS_IDX) size-bytes)
                                                          (catch Exception _ nil))]
                                          result
                                          (if (and grew? (< attempts 20))
                                            (recur (inc attempts))
                                            (throw (ex-info "coalesc-alloc!: out of memory after growth"
                                                            {:size size-bytes}))))))))
                       slab-off  (encode-slab-offset OVERFLOW_CLASS_IDX byte-off)]
                   (when-let [^java.util.List log (.get jvm-alloc-log-tl)]
                     (.add log slab-off))
                   slab-off)
                 (throw (ex-info "JvmSlabCtx: no .slab6 region for overflow alloc"
                                 {:size-bytes size-bytes}))))
             ;; Bitmap slab allocator (class 0-5) with lazy growth
             (letfn [(try-alloc [ci]
                       (let [bm-rgn (aget bitmap-regions ci)
                             bm-off (aget bitmap-offsets ci)
                             total  (aget total-blocks ci)]
                         (loop [start-bit 0 wrapped? false]
                           (let [candidate (mem/imr-bitmap-find-free bm-rgn bm-off total start-bit)]
                             (cond
                               (not= candidate -1)
                               (if (mem/imr-bitmap-alloc-cas! bm-rgn bm-off candidate)
                                 (let [slab-off (encode-slab-offset ci candidate)]
                                   (mem/-sub-i32! (aget regions ci) d/SLAB_HDR_FREE_COUNT 1)
                                   (when-let [^java.util.List log (.get jvm-alloc-log-tl)]
                                     (.add log slab-off))
                                   slab-off)
                                 (recur (inc candidate) wrapped?))

                               (and (not wrapped?) (pos? start-bit))
                               (recur 0 true)

                               :else nil)))))
                     (remap-jvm! [ci n-blocks]
                       (let [blk-size   (long (aget block-sizes ci))
                             path       (aget file-paths ci)
                             bm-path    (aget bitmap-paths ci)
                             data-bytes (+ (long d/SLAB_HEADER_SIZE) (* n-blocks blk-size))
                             bm-bytes   (d/bitmap-byte-size n-blocks)
                             new-region (mem/open-mmap-region path data-bytes)
                             new-bm     (mem/open-mmap-region bm-path bm-bytes)]
                         (aset regions ci new-region)
                         (aset bitmap-regions ci new-bm)
                         (aset total-blocks ci (int n-blocks))))
                     (grow! [ci]
                       (locking regions ;; serialize growth across JVM threads
                         (when-let [path (aget file-paths ci)]
                           (let [cached    (long (aget total-blocks ci))
                                 ;; Peek header to detect external growth
                                 peek-r    (mem/open-mmap-region path 64)
                                 hdr-total (long (mem/-load-i32 peek-r d/SLAB_HDR_TOTAL_BLOCKS))]
                             (if (> hdr-total cached)
                               ;; Another process/thread grew — re-map at header size
                               (do (remap-jvm! ci hdr-total) true)
                               ;; Try to be growth leader via CAS on total_blocks
                               (let [new-total (* 2 hdr-total)
                                     added     (- new-total hdr-total)
                                     witness   (int (mem/-cas-i32! peek-r d/SLAB_HDR_TOTAL_BLOCKS
                                                      (int hdr-total) (int new-total)))]
                                 (if (== witness (int hdr-total))
                                   ;; Won CAS — extend both files
                                   (do (remap-jvm! ci new-total)
                                       (mem/-add-i32! (aget regions ci) d/SLAB_HDR_FREE_COUNT (int added))
                                       true)
                                   ;; Lost CAS — re-map at winner's size
                                   (do (remap-jvm! ci (long witness))
                                       true))))))))]
               (loop [ci class-idx, attempts 0]
                 (or (try-alloc ci)
                     (if (and (< attempts 20) (grow! ci))
                       (recur ci (inc attempts))
                       ;; Growth exhausted — spill to next larger class
                       (if (< ci 5)
                         (recur (inc ci) 0)
                         ;; All bitmap classes full — spill to coalesc
                         (let [region (aget regions OVERFLOW_CLASS_IDX)]
                           (if region
                             (let [byte-off (coalesc/coalesc-alloc!
                                             region size-bytes)
                                   slab-off (encode-slab-offset
                                              OVERFLOW_CLASS_IDX byte-off)]
                               (when-let [^java.util.List log
                                          (.get jvm-alloc-log-tl)]
                                 (.add log slab-off))
                               slab-off)
                             (throw
                               (ex-info "JvmSlabCtx: all slab classes full"
                                        {:class-idx ci}))))))))))))

       (-sio-free! [ctx slab-offset]
         (let [class-idx (decode-class-idx slab-offset)]
           (if (== class-idx OVERFLOW_CLASS_IDX)
             ;; Coalescing free (class 6)
             (let [byte-off (decode-block-idx slab-offset)
                   region   (aget regions OVERFLOW_CLASS_IDX)]
               (if region
                 (coalesc/coalesc-free! region byte-off)
                 false))
             ;; Bitmap free (class 0-5)
             (let [block-idx (decode-block-idx slab-offset)
                   bm-rgn    (aget bitmap-regions class-idx)
                   bm-off    (aget bitmap-offsets class-idx)
                   freed?    (mem/imr-bitmap-free! bm-rgn bm-off block-idx)]
               (when freed?
                 (mem/-add-i32! (aget regions class-idx) d/SLAB_HDR_FREE_COUNT 1))
               freed?)))))

     (defn make-jvm-slab-ctx
       "Build a JvmSlabCtx from vectors of data regions and bitmap regions.
        Indices 0-5: bitmap slab classes. Index 6 (optional): coalescing overflow.
        Reads slab headers to populate data-offset, bitmap-offset, total-blocks caches.
        Optional paths-vec, bm-paths-vec, and max-caps-vec enable lazy slab growth."
       ([regions-vec bm-regions-vec]
        (make-jvm-slab-ctx regions-vec bm-regions-vec nil nil nil))
       ([regions-vec bm-regions-vec paths-vec bm-paths-vec max-caps-vec]
        (let [n           (count regions-vec)
              data-offs   (int-array n)
              bm-offs     (int-array n)
              tot-blocks  (int-array n)
              blk-sizes   (int-array n)
              fpaths      (object-array n)
              bm-fpaths   (object-array n)
              max-blks    (int-array n)]
          (dotimes [i n]
            (let [region (nth regions-vec i)]
              (when region
                (aset data-offs  i (int (mem/-load-i32 region d/SLAB_HDR_DATA_OFFSET)))
                (aset bm-offs    i (int (mem/-load-i32 region d/SLAB_HDR_BITMAP_OFFSET)))
                (aset tot-blocks i (int (mem/-load-i32 region d/SLAB_HDR_TOTAL_BLOCKS)))
                (aset blk-sizes  i (int (mem/-load-i32 region d/SLAB_HDR_BLOCK_SIZE)))))
            (when paths-vec
              (aset fpaths i (nth paths-vec i nil)))
            (when bm-paths-vec
              (aset bm-fpaths i (nth bm-paths-vec i nil)))
            (when max-caps-vec
              (aset max-blks i (int (nth max-caps-vec i 0)))))
          (JvmSlabCtx.
            (into-array regions-vec)
            (into-array bm-regions-vec)
            data-offs bm-offs tot-blocks blk-sizes fpaths bm-fpaths max-blks))))

     (defn refresh-jvm-slab-regions!
       "Re-map any JVM slab regions whose header total_blocks exceeds the
        cached value (i.e. another process grew them). Thread-safe."
       [^JvmSlabCtx sio]
       (let [regions        (.-regions sio)
             bitmap-regions (.-bitmap-regions sio)
             data-offsets   (.-data-offsets sio)
             total-blocks   (.-total-blocks sio)
             block-sizes    (.-block-sizes sio)
             file-paths     (.-file-paths sio)
             bitmap-paths   (.-bitmap-paths sio)]
         (locking regions
           (dotimes [ci d/NUM_SLAB_CLASSES]
             (when-let [path (aget file-paths ci)]
               (let [cached    (long (aget total-blocks ci))
                     ;; Read total_blocks from existing region's header (always
                     ;; mapped). Avoids opening a throwaway peek mmap that leaks.
                     cur-r     (aget regions ci)
                     hdr-total (long (mem/-load-i32 cur-r d/SLAB_HDR_TOTAL_BLOCKS))]
                 (when (> hdr-total cached)
                   (let [blk-size   (long (aget block-sizes ci))
                         data-bytes (+ (long d/SLAB_HEADER_SIZE) (* hdr-total blk-size))
                         bm-bytes   (d/bitmap-byte-size hdr-total)
                         new-region (mem/open-mmap-region path data-bytes)
                         new-bm     (mem/open-mmap-region (aget bitmap-paths ci) bm-bytes)]
                     (aset regions ci new-region)
                     (aset bitmap-regions ci new-bm)
                     (aset total-blocks ci (int hdr-total)))))))
           ;; Also refresh coalesc region (class 6)
           (when-let [path (aget file-paths OVERFLOW_CLASS_IDX)]
             (let [cur-region  (aget regions OVERFLOW_CLASS_IDX)
                   data-off    (long (aget data-offsets OVERFLOW_CLASS_IDX))]
               (if (nil? cur-region)
                 ;; First open — must peek the file to learn data-size
                 (let [peek-r      (mem/open-mmap-region path 64)
                       hdr-data-sz (long (mem/-load-i64 peek-r coalesc/COALESC_HDR_DATA_SIZE))]
                   (when (pos? hdr-data-sz)
                     (let [new-r (mem/open-mmap-region path (+ data-off hdr-data-sz))]
                       (aset regions OVERFLOW_CLASS_IDX new-r))))
                 ;; Subsequent — read header from existing region (no leak)
                 (let [hdr-data-sz (long (mem/-load-i64 cur-region coalesc/COALESC_HDR_DATA_SIZE))
                       cur-size    (- (long (mem/-byte-length cur-region)) data-off)]
                   (when (> hdr-data-sz cur-size)
                     (let [new-r (mem/open-mmap-region path (+ data-off hdr-data-sz))]
                       (aset regions OVERFLOW_CLASS_IDX new-r))))))))))

     ;; -----------------------------------------------------------------------
     ;; Heap-Backed Slab Lifecycle  (JVM only)
     ;; -----------------------------------------------------------------------
     ;; init-jvm-heap-slab! creates one in-memory (non-file) slab backed by a
     ;; JvmHeapRegion.  make-jvm-heap-slab-ctx wraps all 6 size classes into a
     ;; JvmSlabCtx, giving non-persistent JVM atom domains the same slab API as
     ;; the Node.js CLJS implementation.
     ;;
     ;; Default per-slab capacity is 1 MB (vs. 32–64 MB on Node.js) because JVM
     ;; heap memory is committed immediately, not lazily via virtual pages.  Pass
     ;; :capacities {class-idx capacity-bytes} to override.

     (defn init-jvm-heap-slab!
       "Create a single in-memory slab for class-idx using JvmHeapRegion.
        Writes the slab header and returns the initialized JvmHeapRegion."
       [class-idx & {:keys [capacity]}]
       (let [capacity   (long (or capacity (* 1 1024 1024)))   ; default 1 MB
             block-size (nth d/SLAB_SIZES class-idx)
             layout     (d/slab-layout block-size capacity)
             {:keys [total-bytes bitmap-offset bitmap-size data-offset total-blocks]} layout
             region     (mem/make-heap-region total-bytes)]
         (mem/-store-i32! region d/SLAB_HDR_MAGIC d/SLAB_MAGIC)
         (mem/-store-i32! region d/SLAB_HDR_BLOCK_SIZE block-size)
         (mem/-store-i32! region d/SLAB_HDR_TOTAL_BLOCKS total-blocks)
         (mem/-store-i32! region d/SLAB_HDR_FREE_COUNT total-blocks)
         (mem/-store-i32! region d/SLAB_HDR_ALLOC_CURSOR 0)
         (mem/-store-i32! region d/SLAB_HDR_CLASS_IDX class-idx)
         (mem/-store-i32! region d/SLAB_HDR_BITMAP_OFFSET bitmap-offset)
         (mem/-store-i32! region d/SLAB_HDR_DATA_OFFSET data-offset)
         ;; byte-array is zero-initialized by the JVM, so the bitmap (0 = free)
         ;; is already correct — no explicit zeroing needed.
         region))

     (defn make-jvm-heap-slab-ctx
       "Create a JvmSlabCtx from fresh in-memory heap slabs (no mmap files).
        Used for non-persistent JVM atom domains.

        Options map (optional):
          :capacities — {class-idx capacity-bytes}, defaults to 1 MB each"
       ([] (make-jvm-heap-slab-ctx {}))
       ([{:keys [capacities] :or {capacities {}}}]
        (let [regions (mapv (fn [i]
                              (let [cap (get capacities i (* 1 1024 1024))]
                                (init-jvm-heap-slab! i :capacity cap)))
                            (range d/NUM_SLAB_CLASSES))]
          ;; Heap slabs: bitmap is embedded in same region (no separate file)
          (make-jvm-slab-ctx regions regions))))

     (def ^:dynamic *jvm-slab-ctx*
       "The current JVM slab I/O context (JvmSlabCtx).
        Bind this (via clojure.core/binding) before calling collection
        constructors that don't take an explicit sio argument, e.g.:
          (binding [alloc/*jvm-slab-ctx* (alloc/make-jvm-heap-slab-ctx)]
            (eve-map/empty-hash-map))"
       nil)

     (defn jvm-read-header-type-byte
       "Read the type-id byte at offset 0 of the slab block at slab-qualified offset."
       [sio slab-off]
       (-sio-read-u8 sio slab-off 0))

     (defn jvm-alloc-scalar-block!
       "Allocate a slab block for a primitive scalar atom root value (JVM).
        Returns slab-qualified offset."
       [sio v]
       (let [ev-bytes (mem/value->eve-bytes v)
             n        (inc (alength ^bytes ev-bytes))
             blk-off  (-sio-alloc! sio n)]
         (-sio-write-u8! sio blk-off 0 ser/SCALAR_BLOCK_TYPE_ID)
         (-sio-write-bytes! sio blk-off 1 ev-bytes)
         blk-off))

     (defn jvm-read-scalar-block
       "Read the primitive value from a scalar value block (JVM)."
       [sio slab-off]
       (let [class-idx (decode-class-idx slab-off)
             blk-size  (long (nth d/SLAB_SIZES class-idx))
             ev-bytes  (-sio-read-bytes sio slab-off 1 (dec blk-size))]
         (mem/eve-bytes->value ev-bytes)))

     ;;-----------------------------------------------------------------------
     ;; JVM EveArray slab block read/write  (type-id 0x1D)
     ;; Layout: [0x1D:u8][subtype:u8][pad:u16][count:u32][element-bytes...]
     ;;-----------------------------------------------------------------------

     (defn- jvm-subtype-elem-size
       "Subtype code → bytes per element."
       ^long [^long code]
       (case code
         (0x01 0x02 0x03) 1
         (0x04 0x05)      2
         (0x06 0x07 0x08) 4
         0x09             8
         (throw (ex-info "unknown subtype" {:code code}))))

     (defn- jvm-array->subtype+bytes
       "Convert a Java typed array to [subtype-code raw-LE-bytes]."
       [arr]
       (cond
         (instance? (type (int-array 0)) arr)
         (let [ia ^ints arr
               n  (alength ia)
               bb (doto (java.nio.ByteBuffer/allocate (* 4 n))
                    (.order java.nio.ByteOrder/LITTLE_ENDIAN))]
           (dotimes [i n] (.putInt bb (aget ia i)))
           [0x06 (.array bb)])

         (instance? (type (double-array 0)) arr)
         (let [da ^doubles arr
               n  (alength da)
               bb (doto (java.nio.ByteBuffer/allocate (* 8 n))
                    (.order java.nio.ByteOrder/LITTLE_ENDIAN))]
           (dotimes [i n] (.putDouble bb (aget da i)))
           [0x09 (.array bb)])

         (instance? (type (float-array 0)) arr)
         (let [fa ^floats arr
               n  (alength fa)
               bb (doto (java.nio.ByteBuffer/allocate (* 4 n))
                    (.order java.nio.ByteOrder/LITTLE_ENDIAN))]
           (dotimes [i n] (.putFloat bb (aget fa i)))
           [0x08 (.array bb)])

         (instance? (type (short-array 0)) arr)
         (let [sa ^shorts arr
               n  (alength sa)
               bb (doto (java.nio.ByteBuffer/allocate (* 2 n))
                    (.order java.nio.ByteOrder/LITTLE_ENDIAN))]
           (dotimes [i n] (.putShort bb (aget sa i)))
           [0x04 (.array bb)])

         (instance? (type (byte-array 0)) arr)
         [0x02 arr]

         :else
         (throw (ex-info "jvm-write-eve-array!: unsupported array type"
                         {:type (type arr)}))))

     (defn jvm-write-eve-array!
       "Write a Java primitive array as a 0x1D slab block.
        Returns slab-qualified offset."
       [sio arr]
       (let [[subtype ^bytes raw-bytes] (jvm-array->subtype+bytes arr)
             cnt     (java.lang.reflect.Array/getLength arr)
             blk-off (-sio-alloc! sio (+ 8 (alength raw-bytes)))]
         (-sio-write-u8!    sio blk-off 0 ser/EVE_ARRAY_SLAB_TYPE_ID)
         (-sio-write-u8!    sio blk-off 1 subtype)
         (-sio-write-u16!   sio blk-off 2 0)
         (-sio-write-i32!   sio blk-off 4 cnt)
         (-sio-write-bytes! sio blk-off 8 raw-bytes)
         blk-off))

     (defn jvm-read-eve-array
       "Read a 0x1D slab block, return a Clojure vector of numbers."
       [sio slab-off]
       (let [subtype  (long (-sio-read-u8 sio slab-off 1))
             cnt      (-sio-read-i32 sio slab-off 4)
             elem-sz  (jvm-subtype-elem-size subtype)
             raw      (-sio-read-bytes sio slab-off 8 (* cnt elem-sz))
             bb       (doto (java.nio.ByteBuffer/wrap raw)
                        (.order java.nio.ByteOrder/LITTLE_ENDIAN))]
         (case subtype
           (0x01 0x03)
           (mapv (fn [i] (bit-and (long (aget ^bytes raw i)) 0xFF)) (range cnt))
           0x02
           (mapv (fn [i] (long (aget ^bytes raw i))) (range cnt))
           0x04
           (mapv (fn [_] (long (.getShort bb))) (range cnt))
           0x05
           (mapv (fn [_] (bit-and (long (.getShort bb)) 0xFFFF)) (range cnt))
           0x06
           (mapv (fn [_] (long (.getInt bb))) (range cnt))
           0x07
           (mapv (fn [_] (bit-and (long (.getInt bb)) 0xFFFFFFFF)) (range cnt))
           0x08
           (mapv (fn [_] (double (.getFloat bb))) (range cnt))
           0x09
           (mapv (fn [_] (.getDouble bb)) (range cnt))
           (throw (ex-info "jvm-read-eve-array: unknown subtype"
                           {:subtype subtype})))))

     ;;-----------------------------------------------------------------------
     ;; JVM Obj slab block read/write  (type-id 0x1E)
     ;; Layout: [0x1E:u8][pad:u8][schema-len:u16 LE][schema-bytes...][fields...]
     ;; Schema per field: [name-len:u8][name-bytes...][type-code:u8]
     ;;-----------------------------------------------------------------------

     (def ^:private obj-code->type-kw
       {0 :int8, 1 :uint8, 2 :int16, 3 :uint16, 4 :int32, 5 :uint32,
        6 :float32, 7 :float64, 8 :obj, 9 :array})

     (def ^:private obj-type-kw->code
       (zipmap (vals obj-code->type-kw) (keys obj-code->type-kw)))

     (def ^:private obj-type-sizes
       {:int8 1 :uint8 1 :int16 2 :uint16 2 :int32 4 :uint32 4
        :float32 4 :float64 8 :obj 4 :array 4})

     (def ^:private obj-type-alignments
       {:int8 1 :uint8 1 :int16 2 :uint16 2 :int32 4 :uint32 4
        :float32 4 :float64 8 :obj 4 :array 4})

     (defn- jvm-align ^long [^long offset ^long alignment]
       (let [rem (mod offset alignment)]
         (if (zero? rem) offset (+ offset (- alignment rem)))))

     (defn- jvm-obj-layout
       "Returns {:fields {kw {:type t :offset o}} :total-size n}."
       [schema]
       (let [sorted (sort-by (fn [e] (- (get obj-type-alignments (val e) 4)))
                             schema)]
         (loop [fs (seq sorted) off 0 layout {}]
           (if-let [e (first fs)]
             (let [ft   (val e)
                   sz   (get obj-type-sizes ft 4)
                   algn (get obj-type-alignments ft 4)
                   aoff (jvm-align off algn)]
               (recur (next fs) (+ aoff sz)
                      (assoc layout (key e) {:type ft :offset aoff})))
             {:fields layout :total-size off}))))

     (defn- jvm-encode-obj-schema ^bytes [schema]
       (let [fields (seq schema)
             parts  (mapv (fn [e]
                            (let [nm (.getBytes (name (key e)) "UTF-8")]
                              {:nm nm :tc (get obj-type-kw->code (val e))}))
                          fields)
             total  (+ 1 (reduce + 0 (map #(+ 2 (count (:nm %))) parts)))
             buf    (byte-array total)]
         (aset buf 0 (unchecked-byte (count fields)))
         (loop [pos 1 ps (seq parts)]
           (when ps
             (let [{:keys [^bytes nm tc]} (first ps)
                   nlen (alength nm)]
               (aset buf pos (unchecked-byte nlen))
               (System/arraycopy nm 0 buf (inc pos) nlen)
               (aset buf (+ pos 1 nlen) (unchecked-byte tc))
               (recur (+ pos 2 nlen) (next ps)))))
         buf))

     (defn- jvm-decode-obj-schema [^bytes raw ^long start]
       (let [n (bit-and (long (aget raw start)) 0xFF)]
         (loop [i 0 pos (inc start) fm (array-map)]
           (if (< i n)
             (let [nlen (bit-and (long (aget raw pos)) 0xFF)
                   nm   (String. raw (int (inc pos)) (int nlen) "UTF-8")
                   tc   (bit-and (long (aget raw (+ pos 1 nlen))) 0xFF)]
               (recur (inc i) (+ pos 2 nlen)
                      (assoc fm (keyword nm) (get obj-code->type-kw tc))))
             fm))))

     (defn jvm-write-obj!
       "Write a field-value map as a 0x1E slab block. Returns slab-qualified offset.
        schema is {kw → type-kw}, values is {kw → number}."
       [sio schema values]
       (let [sbytes   (jvm-encode-obj-schema schema)
             slen     (alength sbytes)
             layout   (jvm-obj-layout schema)
             data-sz  (:total-size layout)
             blk-off  (-sio-alloc! sio (+ 4 slen data-sz))]
         (-sio-write-u8!    sio blk-off 0 ser/EVE_OBJ_SLAB_TYPE_ID)
         (-sio-write-u8!    sio blk-off 1 0)
         (-sio-write-u16!   sio blk-off 2 slen)
         (-sio-write-bytes! sio blk-off 4 sbytes)
         (doseq [[fk {:keys [type offset]}] (:fields layout)]
           (let [v       (get values fk 0)
                 fld-off (+ 4 slen offset)]
             (case type
               (:int8 :uint8)
               (-sio-write-u8! sio blk-off fld-off (int v))
               (:int16 :uint16)
               (-sio-write-u16! sio blk-off fld-off (int v))
               (:int32 :uint32 :obj :array)
               (-sio-write-i32! sio blk-off fld-off (int v))
               :float32
               (-sio-write-i32! sio blk-off fld-off
                 (Float/floatToRawIntBits (float v)))
               :float64
               (let [bits (Double/doubleToRawLongBits (double v))
                     lo   (unchecked-int (bit-and bits 0xFFFFFFFF))
                     hi   (unchecked-int (unsigned-bit-shift-right bits 32))]
                 (-sio-write-i32! sio blk-off fld-off lo)
                 (-sio-write-i32! sio blk-off (+ fld-off 4) hi)))))
         blk-off))

     (defn jvm-read-obj
       "Read a 0x1E slab block. Returns {:schema {kw→type-kw} :values {kw→val}}."
       [sio slab-off]
       (let [slen   (-sio-read-u16 sio slab-off 2)
             s-raw  (-sio-read-bytes sio slab-off 4 slen)
             schema (jvm-decode-obj-schema s-raw 0)
             layout (jvm-obj-layout schema)]
         {:schema schema
          :values
          (into {}
            (map (fn [e]
                   (let [fk      (key e)
                         ft      (:type (val e))
                         fld-off (+ 4 slen (:offset (val e)))]
                     [fk (case ft
                           :int8    (let [b (-sio-read-u8 sio slab-off fld-off)]
                                      (if (> b 127) (- b 256) b))
                           :uint8   (-sio-read-u8 sio slab-off fld-off)
                           :int16   (let [v (-sio-read-u16 sio slab-off fld-off)]
                                      (if (> v 32767) (- v 65536) v))
                           :uint16  (-sio-read-u16 sio slab-off fld-off)
                           :int32   (-sio-read-i32 sio slab-off fld-off)
                           :uint32  (bit-and (long (-sio-read-i32 sio slab-off fld-off))
                                             0xFFFFFFFF)
                           (:obj :array)
                           (-sio-read-i32 sio slab-off fld-off)
                           :float32
                           (Float/intBitsToFloat (-sio-read-i32 sio slab-off fld-off))
                           :float64
                           (let [lo (bit-and (long (-sio-read-i32 sio slab-off fld-off))
                                             0xFFFFFFFF)
                                 hi (bit-and (long (-sio-read-i32 sio slab-off (+ fld-off 4)))
                                             0xFFFFFFFF)]
                             (Double/longBitsToDouble
                               (bit-or (bit-shift-left hi 32) lo))))]))
                 (:fields layout)))}))

     ;; Register array writer so value+sio->eve-bytes can serialize Java arrays
     (mem/register-jvm-collection-writer! :array
       (fn [sio _serialize-elem arr]
         (jvm-write-eve-array! sio arr)))))


;;=============================================================================
;; CLJS: Module-Level State, DataView Access, and CljsSlabIO  (CLJS only)
;;=============================================================================

#?(:cljs
   (do
     ;; Forward declaration for init-root-sab!
     (declare init-root-sab!)

     ;; Cached per-slab layout info (set during init-slab!)
     ;; Slots 0-5: slab classes. Slot 6: overflow (legacy SAB).
     (def ^:private slab-data-offsets   #js [0 0 0 0 0 0 0])
     (def ^:private slab-bitmap-offsets #js [0 0 0 0 0 0 0])
     (def ^:private slab-total-blocks   #js [0 0 0 0 0 0 0])
     ;; File paths for mmap-backed slabs (needed for lazy growth)
     (def ^:private slab-file-paths     #js [nil nil nil nil nil nil nil])
     ;; Bitmap file paths for mmap split-file slabs
     (def ^:private slab-bitmap-paths   #js [nil nil nil nil nil nil nil])

     (defn slab-offset->byte-offset
       "Convert a slab-qualified offset to the actual byte offset within the slab's SAB."
       ^number [^number slab-offset]
       (let [class-idx  (decode-class-idx slab-offset)
             block-idx  (decode-block-idx slab-offset)
             block-size (aget d/SLAB_SIZES class-idx)]
         (+ (aget slab-data-offsets class-idx) (* block-idx block-size))))

     (defn get-slab-data-offset
       "Get the cached data offset for a slab class. For debugging."
       [class-idx]
       (aget slab-data-offsets class-idx))

     ;; Overflow (class 6) — legacy eve.atom allocator
     (def ^:private ^:mutable legacy-env nil)
     (def ^:private overflow-desc-map (js/Map.))

     ;; Diagnostic hooks
     (def ^:private ^:mutable alloc-hook nil)
     (def ^:private ^:mutable recycle-hook nil)

     (defn register-alloc-hook!
       "Register a callback invoked after every successful allocation."
       [hook-fn]
       (set! alloc-hook hook-fn))

     (defn register-recycle-hook!
       "Register a callback invoked before every free operation."
       [hook-fn]
       (set! recycle-hook hook-fn))

     (defn clear-diagnostic-hooks!
       "Clear all diagnostic hooks."
       []
       (set! alloc-hook nil)
       (set! recycle-hook nil))

     (defn register-legacy-env!
       "Store the legacy eve.atom s-atom-env for overflow allocation."
       [s-atom-env]
       (set! legacy-env s-atom-env)
       (when-let [sab (some-> s-atom-env :sab)]
         (wasm/register-overflow-instance! sab)))

     (defn reset-legacy-env!
       "Clear cached legacy env and overflow descriptor map."
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

     ;; -----------------------------------------------------------------------
     ;; Slab Lifecycle
     ;; -----------------------------------------------------------------------

     (defn init-slab!
       "Initialize a single slab for a given class index.
        Returns a Promise that resolves when the slab (+ optional WASM) is ready."
       [class-idx & {:keys [capacity]}]
       (let [capacity   (or capacity (d/default-capacity-for-class class-idx))
             block-size (aget d/SLAB_SIZES class-idx)
             layout     (d/slab-layout block-size capacity)
             {:keys [total-bytes bitmap-offset bitmap-size data-offset total-blocks]} layout
             wasm-memory (wasm/create-slab-memory total-bytes)
             sab         (if (instance? js/SharedArrayBuffer wasm-memory)
                           wasm-memory
                           (.-buffer wasm-memory))
             slab-region (mem/js-sab-region sab)
             u8-view     (js/Uint8Array. sab)]
         ;; Write slab header via IMemRegion
         (mem/store-i32! slab-region d/SLAB_HDR_MAGIC d/SLAB_MAGIC)
         (mem/store-i32! slab-region d/SLAB_HDR_BLOCK_SIZE block-size)
         (mem/store-i32! slab-region d/SLAB_HDR_TOTAL_BLOCKS total-blocks)
         (mem/store-i32! slab-region d/SLAB_HDR_FREE_COUNT total-blocks)
         (mem/store-i32! slab-region d/SLAB_HDR_ALLOC_CURSOR 0)
         (mem/store-i32! slab-region d/SLAB_HDR_CLASS_IDX class-idx)
         (mem/store-i32! slab-region d/SLAB_HDR_BITMAP_OFFSET bitmap-offset)
         (mem/store-i32! slab-region d/SLAB_HDR_DATA_OFFSET data-offset)
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
       "Initialize all 6 slab classes + root SAB.
        Returns a Promise that resolves when all WASM upgrades are done."
       [& {:keys [capacities force] :or {capacities {}}}]
       (if (and initialized? (not force))
         (js/Promise.resolve nil)
         (do
           (set! initialized? true)
           (let [slab-promises
                 (into-array
                   (for [i (range d/NUM_SLAB_CLASSES)]
                     (let [cap (get capacities i (d/default-capacity-for-class i))]
                       (init-slab! i :capacity cap))))]
             (init-root-sab!)
             (js/Promise.all slab-promises)))))

     (defn reset-all-slabs!
       "Reset all slab bitmaps to free state. Nuclear reset for test runners."
       []
       (dotimes [class-idx d/NUM_SLAB_CLASSES]
         (when-let [inst (wasm/get-slab-instance class-idx)]
           (let [region   (:region inst)
                 u8-view  (:u8 inst)
                 bm-offset (aget slab-bitmap-offsets class-idx)
                 total     (aget slab-total-blocks class-idx)
                 bm-size   (quot (+ total 7) 8)]
             (.fill u8-view 0 bm-offset (+ bm-offset bm-size))
             (mem/store-i32! region d/SLAB_HDR_FREE_COUNT total)
             (mem/store-i32! region d/SLAB_HDR_ALLOC_CURSOR 0)))))

     ;; -----------------------------------------------------------------------
     ;; Root SAB (control plane)
     ;; -----------------------------------------------------------------------

     (defonce ^:private root-sab    (cljs.core/atom nil))
     (defonce ^:private root-i32    (cljs.core/atom nil))
     (defonce ^:private root-region (cljs.core/atom nil))

     (defn init-root-sab!
       "Create the root/control SharedArrayBuffer."
       []
       (let [sab (js/SharedArrayBuffer. d/ROOT_SAB_SIZE)
             i32 (js/Int32Array. sab)
             rgn (mem/js-sab-region sab)]
         (mem/store-i32! rgn d/ROOT_MAGIC_OFFSET d/ROOT_MAGIC)
         (mem/store-i32! rgn d/ROOT_ATOM_PTR_OFFSET NIL_OFFSET)
         (mem/store-i32! rgn d/ROOT_EPOCH_OFFSET 1)
         (mem/store-i32! rgn d/ROOT_WORKER_REG_OFFSET d/ROOT_WORKER_REGISTRY_START)
         (dotimes [slot-idx d/MAX_WORKERS]
           (let [slot-byte-offset (+ d/ROOT_WORKER_REGISTRY_START (* slot-idx d/WORKER_SLOT_SIZE))]
             (mem/store-i32! rgn slot-byte-offset d/WORKER_STATUS_INACTIVE)))
         (reset! root-sab sab)
         (reset! root-i32 i32)
         (reset! root-region rgn)
         {:root-sab sab :root-i32 i32}))

     (defn init-root-sab-from-existing!
       "Register an existing root SAB (created by main thread) on a worker."
       [sab]
       (let [i32 (js/Int32Array. sab)
             rgn (mem/js-sab-region sab)]
         (reset! root-sab sab)
         (reset! root-i32 i32)
         (reset! root-region rgn)
         {:root-sab sab :root-i32 i32}))

     (defn get-root-sab
       "Get the root SAB for sharing with workers."
       []
       @root-sab)

     ;; -----------------------------------------------------------------------
     ;; Worker-Side Slab Initialization
     ;; -----------------------------------------------------------------------

     (defn get-all-slab-sabs
       "Extract all 6 slab SharedArrayBuffers for passing to workers."
       []
       (let [sabs #js []]
         (dotimes [i d/NUM_SLAB_CLASSES]
           (.push sabs (wasm/slab-buffer i)))
         sabs))

     (defn populate-slab-caches-from-header!
       "Read a slab's header and populate module-level caches."
       [class-idx sab]
       (let [sab-region    (mem/js-sab-region sab)
             data-offset   (mem/load-i32 sab-region d/SLAB_HDR_DATA_OFFSET)
             bitmap-offset (mem/load-i32 sab-region d/SLAB_HDR_BITMAP_OFFSET)
             total-blocks  (mem/load-i32 sab-region d/SLAB_HDR_TOTAL_BLOCKS)]
         (aset slab-data-offsets class-idx data-offset)
         (aset slab-bitmap-offsets class-idx bitmap-offset)
         (aset slab-total-blocks class-idx total-blocks)))

     (defn init-worker-slabs!
       "Initialize the slab system on a worker from existing SABs."
       [slab-sabs root-sab-arg legacy-sab]
       (set! initialized? true)
       (dotimes [i d/NUM_SLAB_CLASSES]
         (let [sab (if (array? slab-sabs) (aget slab-sabs i) (nth slab-sabs i))]
           (wasm/register-slab-instance-from-sab! i sab)
           (populate-slab-caches-from-header! i sab)))
       (when legacy-sab
         (wasm/register-overflow-instance! legacy-sab))
       (init-root-sab-from-existing! root-sab-arg))

     ;; -----------------------------------------------------------------------
     ;; Allocator: Slab-Routed Alloc / Free
     ;; -----------------------------------------------------------------------

     (defn- alloc-from-slab
       "Try to allocate a block from a specific slab class.
        Returns {:offset :class-idx :block-idx} or {:error :out-of-memory}."
       [class-idx]
       (let [bm-offset  (aget slab-bitmap-offsets class-idx)
             total-bits (aget slab-total-blocks class-idx)
             inst       (wasm/get-slab-instance class-idx)
             region     (:region inst)
             cursor     (mem/load-i32 region d/SLAB_HDR_ALLOC_CURSOR)]
         (loop [start-bit cursor
                wrapped?  false]
           (let [candidate (wasm/bitmap-find-free class-idx bm-offset total-bits start-bit)]
             (cond
               (not= candidate -1)
               (if (wasm/bitmap-alloc-cas! class-idx bm-offset candidate)
                 (let [slab-offset (encode-slab-offset class-idx candidate)]
                   (mem/store-i32! region d/SLAB_HDR_ALLOC_CURSOR
                                   (mod (inc candidate) total-bits))
                   (mem/sub-i32! region d/SLAB_HDR_FREE_COUNT 1)
                   (when alloc-hook (alloc-hook slab-offset))
                   {:offset slab-offset :class-idx class-idx :block-idx candidate})
                 (recur (inc candidate) wrapped?))

               (and (not wrapped?) (pos? cursor))
               (recur 0 true)

               :else
               {:error :out-of-memory :class-idx class-idx})))))

     (defn alloc
       "Allocate a block of at least size-bytes.
        Returns {:offset :class-idx :block-idx} or {:error ...}.
        For mmap-backed slabs, grows the file on OOM and retries."
       [size-bytes]
       (let [class-idx (d/size->class-idx size-bytes)]
         (if (== class-idx -1)
           ;; Overflow path — prefer mmap coalesc if registered, else legacy
           (if mmap-coalesc-region
             (let [byte-off (try
                              (coalesc/coalesc-alloc! mmap-coalesc-region size-bytes)
                              (catch :default _
                                ;; OOM — grow in a loop until alloc succeeds or at max
                                (loop [attempts 0]
                                  (let [grew? (grow-mmap-coalesc!)]
                                    (if-let [result (try
                                                      (coalesc/coalesc-alloc! mmap-coalesc-region size-bytes)
                                                      (catch :default _ nil))]
                                      result
                                      (if (and grew? (< attempts 20))
                                        (recur (inc attempts))
                                        (throw (ex-info "coalesc-alloc!: out of memory after growth"
                                                        {:size size-bytes}))))))))
                   slab-offset (encode-slab-offset OVERFLOW_CLASS_IDX byte-off)]
               (when alloc-hook (alloc-hook slab-offset))
               {:offset slab-offset :class-idx OVERFLOW_CLASS_IDX :block-idx byte-off})
             (if-let [env (ensure-legacy-env!)]
               (let [result (legacy-atom/alloc env size-bytes)]
                 (if (:error result)
                   {:error :overflow-oom :size size-bytes}
                   (let [byte-off    (:offset result)
                         desc-idx    (:descriptor-idx result)
                         slab-offset (encode-slab-offset OVERFLOW_CLASS_IDX byte-off)]
                     (.set overflow-desc-map byte-off desc-idx)
                     (when alloc-hook (alloc-hook slab-offset))
                     {:offset slab-offset :class-idx OVERFLOW_CLASS_IDX :block-idx byte-off})))
               {:error :overflow-no-legacy-env :size size-bytes}))
           ;; Slab path — try alloc, grow on OOM, spill to next class
           (loop [ci class-idx]
             (let [result (alloc-from-slab ci)]
               (if-not (:error result)
                 result
                 ;; OOM — try to grow if mmap-backed
                 (if (and (aget slab-file-paths ci)
                          (grow-mmap-slab! ci))
                   (let [retry (alloc-from-slab ci)]
                     (if-not (:error retry)
                       retry
                       ;; Still full — spill to next class
                       (if (< ci 5)
                         (recur (inc ci))
                         {:error :all-slab-classes-full
                          :size size-bytes})))
                   ;; Can't grow — spill to next class
                   (if (< ci 5)
                     (recur (inc ci))
                     {:error :all-slab-classes-full
                      :size size-bytes}))))))))

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
        Returns true if freed, false if already free (double-free detected)."
       [^number slab-offset]
       (if (== slab-offset NIL_OFFSET)
         false
         (do
           (when recycle-hook (recycle-hook slab-offset))
           (let [class-idx (decode-class-idx slab-offset)]
             (if (== class-idx OVERFLOW_CLASS_IDX)
               (if mmap-coalesc-region
                 ;; mmap coalescing path
                 (let [byte-off (decode-block-idx slab-offset)]
                   (coalesc/coalesc-free! mmap-coalesc-region byte-off))
                 ;; legacy SAB path
                 (let [byte-off (decode-block-idx slab-offset)
                       desc-idx (.get overflow-desc-map byte-off)]
                   (if (and legacy-env (some? desc-idx))
                     (do
                       (legacy-atom/free legacy-env desc-idx)
                       (.delete overflow-desc-map byte-off)
                       true)
                     false)))
               (let [block-idx (decode-block-idx slab-offset)
                     bm-offset (aget slab-bitmap-offsets class-idx)
                     inst      (wasm/get-slab-instance class-idx)
                     region    (:region inst)
                     freed?    (wasm/bitmap-free! class-idx bm-offset block-idx)]
                 (when freed?
                   (mem/add-i32! region d/SLAB_HDR_FREE_COUNT 1))
                 freed?))))))

     (defn- batch-alloc-once
       "Single-pass batch allocation without growth. Returns a JS array."
       [class-idx max-count]
       (let [bm-offset  (aget slab-bitmap-offsets class-idx)
             total-bits (aget slab-total-blocks class-idx)
             inst       (wasm/get-slab-instance class-idx)
             region     (:region inst)
             cursor     (mem/load-i32 region d/SLAB_HDR_ALLOC_CURSOR)
             results    #js []]
         (loop [start-bit cursor wrapped? false]
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
         (when (pos? (.-length results))
           (let [last-offset (aget results (dec (.-length results)))
                 last-block  (decode-block-idx last-offset)]
             (mem/store-i32! region d/SLAB_HDR_ALLOC_CURSOR
                             (mod (inc last-block) total-bits))
             (mem/sub-i32! region d/SLAB_HDR_FREE_COUNT (.-length results))))
         results))

     (defn batch-alloc
       "Allocate up to max-count blocks of size-bytes each.
        Returns a JS array of slab-qualified offsets.
        For mmap-backed slabs, grows the file on OOM and retries."
       [size-bytes max-count]
       (let [class-idx (d/size->class-idx size-bytes)]
         (when (not= class-idx -1)
           (loop [attempts 0]
             (let [results (batch-alloc-once class-idx max-count)]
               (if (pos? (.-length results))
                 results
                 ;; OOM — try growth if mmap-backed (up to 20 doublings)
                 (when (and (< attempts 20)
                            (aget slab-file-paths class-idx)
                            (grow-mmap-slab! class-idx))
                   (recur (inc attempts)))))))))

     ;; -----------------------------------------------------------------------
     ;; DataView-based Data Access  (CLJS hot path)
     ;; -----------------------------------------------------------------------
     ;; These use module-level mutable DataView state for maximum throughput.
     ;; Used by existing CLJS HAMT code (map.cljs etc.) until those files are
     ;; migrated to .cljc with ISlabIO in Steps 5-8.

     ;; Mutable scratch for resolve — avoids allocating a JS array per resolve.
     ;; Public so macro-generated code in eve-slab-deftype can access them.
     (def ^:mutable resolved-dv nil)
     (def ^:mutable resolved-u8 nil)
     (def ^:mutable resolved-base 0)

     (defn resolve-dv!
       "Resolve a slab-qualified offset to a DataView and base byte offset.
        Sets module-level resolved-dv and resolved-base for subsequent reads.
        Returns the base byte offset."
       ^number [^number slab-offset]
       (let [class-idx  (decode-class-idx slab-offset)
             block-idx  (decode-block-idx slab-offset)
             block-size (aget d/SLAB_SIZES class-idx)
             data-off   (aget slab-data-offsets class-idx)
             base       (+ data-off (* block-idx block-size))
             dv         (wasm/slab-data-view class-idx)]
         (when (nil? dv)
           (js/console.error "[resolve-dv! ERROR] nil DataView slab-offset:" slab-offset
                             "class:" class-idx "block:" block-idx
                             "block-size:" block-size "data-off:" data-off
                             "base:" base))
         (set! resolved-dv dv)
         (set! resolved-base base)
         base))

     (defn resolve-u8!
       "Like resolve-dv! but also sets resolved-u8 (Uint8Array) for byte ops."
       ^number [^number slab-offset]
       (let [class-idx  (decode-class-idx slab-offset)
             block-idx  (decode-block-idx slab-offset)
             block-size (aget d/SLAB_SIZES class-idx)
             base       (+ (aget slab-data-offsets class-idx) (* block-idx block-size))]
         (set! resolved-u8   (wasm/slab-u8-view class-idx))
         (set! resolved-dv   (wasm/slab-data-view class-idx))
         (set! resolved-base base)
         base))

     (defn read-u8
       "Read a byte from a slab-qualified offset + byte offset within block."
       ^number [^number slab-offset ^number byte-off]
       (let [class-idx (decode-class-idx slab-offset)
             u8        (wasm/slab-u8-view class-idx)
             base      (slab-offset->byte-offset slab-offset)]
         (aget u8 (+ base byte-off))))

     (defn read-header-type-byte
       "Read the type-id byte at offset 0 of the slab block at slab-qualified offset."
       ^number [^number slab-off]
       (resolve-u8! slab-off)
       (.getUint8 resolved-dv resolved-base))

     (defn write-u8!
       "Write a byte to a slab-qualified offset + byte offset within block."
       [^number slab-offset ^number byte-off ^number val]
       (let [class-idx (decode-class-idx slab-offset)
             u8        (wasm/slab-u8-view class-idx)
             base      (slab-offset->byte-offset slab-offset)]
         (aset u8 (+ base byte-off) val)))

     (defn read-i32
       "Read an i32 from a slab-qualified offset + byte offset within block."
       ^number [^number slab-offset ^number byte-off]
       (let [class-idx (decode-class-idx slab-offset)
             dv        (wasm/slab-data-view class-idx)
             base      (slab-offset->byte-offset slab-offset)]
         (.getInt32 dv (+ base byte-off) true)))

     (defn write-i32!
       "Write an i32 to a slab-qualified offset + byte offset within block."
       [^number slab-offset ^number byte-off ^number val]
       (let [class-idx (decode-class-idx slab-offset)
             dv        (wasm/slab-data-view class-idx)
             base      (slab-offset->byte-offset slab-offset)]
         (.setInt32 dv (+ base byte-off) val true)))

     (defn read-u16
       "Read a u16 from a slab-qualified offset."
       ^number [^number slab-offset ^number byte-off]
       (let [class-idx (decode-class-idx slab-offset)
             dv        (wasm/slab-data-view class-idx)
             base      (slab-offset->byte-offset slab-offset)]
         (.getUint16 dv (+ base byte-off) true)))

     (defn write-u16!
       "Write a u16 to a slab-qualified offset."
       [^number slab-offset ^number byte-off ^number val]
       (let [class-idx (decode-class-idx slab-offset)
             dv        (wasm/slab-data-view class-idx)
             base      (slab-offset->byte-offset slab-offset)]
         (.setUint16 dv (+ base byte-off) val true)))

     (defn read-bytes
       "Read a Uint8Array slice from a slab-qualified offset."
       [^number slab-offset ^number byte-off ^number len]
       (let [class-idx (decode-class-idx slab-offset)
             u8        (wasm/slab-u8-view class-idx)
             base      (slab-offset->byte-offset slab-offset)]
         (.subarray u8 (+ base byte-off) (+ base byte-off len))))

     (defn write-bytes!
       "Write a Uint8Array to a slab-qualified offset."
       [^number slab-offset ^number byte-off ^js src-bytes]
       (let [class-idx (decode-class-idx slab-offset)
             u8        (wasm/slab-u8-view class-idx)
             base      (slab-offset->byte-offset slab-offset)]
         (.set u8 src-bytes (+ base byte-off))))

     (defn copy-within-slab!
       "Copy bytes within the same slab."
       [^number dst-slab-offset ^number dst-byte-off
        ^number src-slab-offset ^number src-byte-off
        ^number len]
       (let [class-idx (decode-class-idx dst-slab-offset)
             u8        (wasm/slab-u8-view class-idx)
             dst-base  (slab-offset->byte-offset dst-slab-offset)
             src-base  (slab-offset->byte-offset src-slab-offset)]
         (.copyWithin u8 (+ dst-base dst-byte-off) (+ src-base src-byte-off)
                      (+ src-base src-byte-off len))))

     (defn copy-block!
       "Copy an entire block from one slab-qualified offset to another."
       [^number dst-slab-offset ^number src-slab-offset ^number len]
       (let [src-class (decode-class-idx src-slab-offset)
             dst-class (decode-class-idx dst-slab-offset)]
         (if (== src-class dst-class)
           (copy-within-slab! dst-slab-offset 0 src-slab-offset 0 len)
           (let [src-bytes (read-bytes src-slab-offset 0 len)]
             (write-bytes! dst-slab-offset 0 src-bytes)))))

     (defn alloc-scalar-block!
       "Allocate a slab block for a primitive scalar atom root value.
        Returns slab-qualified offset."
       [v]
       (let [ev-bytes (ser/serialize-element v)
             n        (inc (.-length ev-bytes))   ;; 1 type-id byte + EVE bytes
             blk-off  (alloc-offset n)]
         (resolve-dv! blk-off)
         (.setUint8 resolved-dv resolved-base ser/SCALAR_BLOCK_TYPE_ID)
         (dotimes [i (.-length ev-bytes)]
           (.setUint8 resolved-dv (+ resolved-base 1 i) (aget ev-bytes i)))
         blk-off))

     (defn read-scalar-block
       "Read the primitive value from a scalar value block.
        Returns the deserialized value."
       [slab-off]
       (let [blk-size (aget d/SLAB_SIZES (decode-class-idx slab-off))
             ev-bytes (read-bytes slab-off 1 (dec blk-size))]
         (ser/deserialize-element ev-bytes)))

     ;; -----------------------------------------------------------------------
     ;; CljsSlabIO — ISlabIO backed by DataView  (CLJS only)
     ;; -----------------------------------------------------------------------

     (deftype CljsSlabIO []
       ISlabIO
       (-sio-read-u8   [_ slab-offset field-off]  (read-u8  slab-offset field-off))
       (-sio-write-u8!  [_ slab-offset field-off val] (write-u8!  slab-offset field-off val))
       (-sio-read-u16  [_ slab-offset field-off]  (read-u16 slab-offset field-off))
       (-sio-write-u16! [_ slab-offset field-off val] (write-u16! slab-offset field-off val))
       (-sio-read-i32  [_ slab-offset field-off]  (read-i32 slab-offset field-off))
       (-sio-write-i32! [_ slab-offset field-off val] (write-i32! slab-offset field-off val))
       (-sio-read-bytes [_ slab-offset field-off len] (read-bytes slab-offset field-off len))
       (-sio-write-bytes! [_ slab-offset field-off src] (write-bytes! slab-offset field-off src))
       (-sio-alloc!    [_ size-bytes] (alloc-offset size-bytes))
       (-sio-free!     [_ slab-offset] (free! slab-offset)))

     ;; -----------------------------------------------------------------------
     ;; Root Pointer Operations
     ;; -----------------------------------------------------------------------

     (defn read-root-ptr
       "Read the atom root pointer (a slab-qualified offset)."
       ^number []
       (mem/load-i32 @root-region d/ROOT_ATOM_PTR_OFFSET))

     (defn cas-root-ptr!
       "CAS the atom root pointer. Returns true on success."
       [^number expected ^number new-val]
       (== expected
           (mem/cas-i32! @root-region d/ROOT_ATOM_PTR_OFFSET expected new-val)))

     ;; -----------------------------------------------------------------------
     ;; Epoch Management
     ;; -----------------------------------------------------------------------

     (defn get-current-epoch
       "Read the current global epoch."
       ^number []
       (mem/load-i32 @root-region d/ROOT_EPOCH_OFFSET))

     (defn increment-epoch!
       "Atomically increment global epoch. Returns the new epoch."
       ^number []
       (inc (mem/add-i32! @root-region d/ROOT_EPOCH_OFFSET 1)))

     ;; -----------------------------------------------------------------------
     ;; Worker Registry
     ;; -----------------------------------------------------------------------

     (defn- worker-slot-byte-offset
       ^number [^number slot-idx]
       (+ d/ROOT_WORKER_REGISTRY_START (* slot-idx d/WORKER_SLOT_SIZE)))

     (defn register-worker!
       "Claim a worker slot. Returns slot index or nil."
       [worker-id]
       (let [rgn @root-region]
         (loop [slot-idx 0]
           (when (< slot-idx d/MAX_WORKERS)
             (let [slot-byte-off (worker-slot-byte-offset slot-idx)]
               (if (== d/WORKER_STATUS_INACTIVE
                       (mem/cas-i32! rgn slot-byte-off
                                     d/WORKER_STATUS_INACTIVE
                                     d/WORKER_STATUS_ACTIVE))
                 (do
                   (mem/store-i32! rgn (+ slot-byte-off d/OFFSET_WS_WORKER_ID) worker-id)
                   (mem/store-i32! rgn (+ slot-byte-off d/OFFSET_WS_CURRENT_EPOCH) 0)
                   slot-idx)
                 (recur (inc slot-idx))))))))

     (defn unregister-worker!
       "Release a worker slot."
       [slot-idx]
       (when (and (>= slot-idx 0) (< slot-idx d/MAX_WORKERS))
         (let [rgn          @root-region
               slot-byte-off (worker-slot-byte-offset slot-idx)]
           (mem/store-i32! rgn (+ slot-byte-off d/OFFSET_WS_CURRENT_EPOCH) 0)
           (mem/store-i32! rgn slot-byte-off d/WORKER_STATUS_INACTIVE))))

     ;; -----------------------------------------------------------------------
     ;; Diagnostic Helpers
     ;; -----------------------------------------------------------------------

     (defn slab-stats
       "Return stats for a slab class."
       [class-idx]
       (let [inst   (wasm/get-slab-instance class-idx)
             region (:region inst)
             total  (aget slab-total-blocks class-idx)
             free   (mem/load-i32 region d/SLAB_HDR_FREE_COUNT)]
         {:block-size   (aget d/SLAB_SIZES class-idx)
          :total-blocks total
          :free-count   free
          :used-count   (- total free)}))

     (defn all-slab-stats
       "Return stats for all slab classes."
       []
       (into {} (for [i (range d/NUM_SLAB_CLASSES)]
                  [i (slab-stats i)])))

     ;; -----------------------------------------------------------------------
     ;; mmap-Backed Slab Initialization (Node.js cross-process)
     ;; -----------------------------------------------------------------------

     (defn init-mmap-slab!
       "Initialize a slab class backed by two mmap files on Node.js:
        data file (header + blocks) and bitmap file.
        bitmap-offset is 0 within the bitmap file, data-offset is SLAB_HEADER_SIZE."
       [class-idx path & {:keys [capacity]}]
       (let [capacity    (or capacity (d/initial-capacity-for-class class-idx))
             block-size  (aget d/SLAB_SIZES class-idx)
             layout      (d/mmap-slab-layout block-size capacity)
             total-blocks (:total-blocks layout)
             data-bytes   (:data-bytes layout)
             bitmap-bytes (:bitmap-bytes layout)
             bm-path      (str path ".bm")
             region       (mem/open-mmap-region path data-bytes)
             bm-region    (mem/open-mmap-region bm-path bitmap-bytes)]
         ;; Write slab header
         (mem/store-i32! region d/SLAB_HDR_MAGIC d/SLAB_MAGIC)
         (mem/store-i32! region d/SLAB_HDR_BLOCK_SIZE block-size)
         (mem/store-i32! region d/SLAB_HDR_TOTAL_BLOCKS total-blocks)
         (mem/store-i32! region d/SLAB_HDR_FREE_COUNT total-blocks)
         (mem/store-i32! region d/SLAB_HDR_ALLOC_CURSOR 0)
         (mem/store-i32! region d/SLAB_HDR_CLASS_IDX class-idx)
         (mem/store-i32! region d/SLAB_HDR_BITMAP_OFFSET 0)
         (mem/store-i32! region d/SLAB_HDR_DATA_OFFSET d/SLAB_HEADER_SIZE)
         ;; Bitmap is already zeroed by ftruncate (all blocks free)
         ;; Cache layout info + paths for lazy growth
         (aset slab-data-offsets class-idx d/SLAB_HEADER_SIZE)
         (aset slab-bitmap-offsets class-idx 0)
         (aset slab-total-blocks class-idx total-blocks)
         (aset slab-file-paths class-idx path)
         (aset slab-bitmap-paths class-idx bm-path)
         ;; Register instance with separate bitmap region
         (wasm/register-mmap-slab-instance! class-idx region bm-region)))

     (defn open-mmap-slab!
       "Open (join) existing mmap-backed slab data + bitmap files on Node.js.
        Reads the slab header to determine block count, opens both files,
        and populates the module-level layout caches."
       [class-idx path]
       (let [peek-region  (mem/open-mmap-region path 64)
             total-blocks (mem/load-i32 peek-region d/SLAB_HDR_TOTAL_BLOCKS)
             block-size   (aget d/SLAB_SIZES class-idx)
             data-bytes   (+ d/SLAB_HEADER_SIZE (* total-blocks block-size))
             bm-path      (str path ".bm")
             bm-bytes     (d/bitmap-byte-size total-blocks)
             region       (mem/open-mmap-region path data-bytes)
             bm-region    (mem/open-mmap-region bm-path bm-bytes)]
         ;; Cache layout info + paths for lazy growth
         (aset slab-data-offsets class-idx d/SLAB_HEADER_SIZE)
         (aset slab-bitmap-offsets class-idx 0)
         (aset slab-total-blocks class-idx total-blocks)
         (aset slab-file-paths class-idx path)
         (aset slab-bitmap-paths class-idx bm-path)
         ;; Register instance with separate bitmap region
         (wasm/register-mmap-slab-instance! class-idx region bm-region)))

     (defn- remap-mmap-slab!
       "Re-mmap both data + bitmap files for class-idx at the given total blocks."
       [class-idx total-blocks]
       (let [path       (aget slab-file-paths class-idx)
             bm-path    (aget slab-bitmap-paths class-idx)
             block-size (aget d/SLAB_SIZES class-idx)
             data-bytes (+ d/SLAB_HEADER_SIZE (* total-blocks block-size))
             bm-bytes   (d/bitmap-byte-size total-blocks)
             region     (mem/open-mmap-region path data-bytes)
             bm-region  (mem/open-mmap-region bm-path bm-bytes)]
         (aset slab-total-blocks class-idx total-blocks)
         (wasm/register-mmap-slab-instance! class-idx region bm-region)))

     (defn grow-mmap-slab!
       "Grow an mmap-backed slab using CAS on total_blocks for leader election.
        Only one process wins the CAS and does the ftruncate; losers re-map.
        Both data and bitmap files are grown independently.
        Returns true if grown/refreshed, false if already at max."
       [class-idx]
       (let [path         (aget slab-file-paths class-idx)
             cached-total (aget slab-total-blocks class-idx)
             ;; Peek header — use small region to read current state
             peek-r       (mem/open-mmap-region path 64)
             hdr-total    (mem/load-i32 peek-r d/SLAB_HDR_TOTAL_BLOCKS)]
         (if (> hdr-total cached-total)
           ;; Another process grew — just re-map at the header's size
           (do (remap-mmap-slab! class-idx hdr-total)
               true)
           ;; Try to be the growth leader via CAS on total_blocks
           (let [new-blocks (* 2 hdr-total)
                 added      (- new-blocks hdr-total)
                 witness    (mem/-cas-i32! peek-r d/SLAB_HDR_TOTAL_BLOCKS
                              hdr-total new-blocks)]
             (if (== witness hdr-total)
               ;; We won — extend both files and re-map
               (do (remap-mmap-slab! class-idx new-blocks)
                   (let [inst   (wasm/get-slab-instance class-idx)
                         region (:region inst)]
                     (mem/add-i32! region d/SLAB_HDR_FREE_COUNT added))
                   true)
               ;; Lost CAS — someone else grew, re-map at their size
               (do (remap-mmap-slab! class-idx witness)
                   true))))))

     (defn refresh-mmap-slabs!
       "Re-map any mmap-backed slabs whose header total_blocks exceeds our
        cached value (i.e. another process grew them). Called before deref
        in cross-process swap! to ensure we can read all blocks."
       []
       (dotimes [ci d/NUM_SLAB_CLASSES]
         (when-let [path (aget slab-file-paths ci)]
           (let [cached (aget slab-total-blocks ci)
                 peek-r (mem/open-mmap-region path 64)
                 hdr-total (mem/load-i32 peek-r d/SLAB_HDR_TOTAL_BLOCKS)]
             (when (> hdr-total cached)
               (remap-mmap-slab! ci hdr-total)))))
       ;; Also refresh coalesc region
       (refresh-mmap-coalesc!))

     ;; -----------------------------------------------------------------------
     ;; mmap-Backed Coalescing Allocator (class 6, Node.js cross-process)
     ;; -----------------------------------------------------------------------

     (def ^:private ^:mutable mmap-coalesc-region nil)
     (def ^:private ^:mutable mmap-coalesc-path nil)
     (def ^:private ^:mutable mmap-coalesc-max-data-size 0)
     (def ^:private ^:mutable mmap-coalesc-cached-data-size 0)

     (defn init-mmap-coalesc!
       "Initialize a .slab6 file with the coalescing allocator.
        Creates the file, writes header + initial descriptor table.
        Registers the region for mmap overflow allocation.
        Uses initial-data-size for the file and max-data-size for growth cap."
       [path & {:keys [initial-data-size max-data-size max-desc]
                :or   {initial-data-size coalesc/INITIAL_DATA_SIZE
                       max-data-size     coalesc/DEFAULT_DATA_SIZE
                       max-desc          coalesc/MAX_DESCRIPTORS}}]
       ;; Descriptor table is sized for max-desc; data region starts after it.
       ;; Use max-desc layout to compute fixed offsets (desc table + data-offset).
       (let [layout      (coalesc/coalesc-layout initial-data-size max-desc)
             total-bytes (:total-bytes layout)
             data-offset (:data-offset layout)
             region      (mem/open-mmap-region path total-bytes)]
         (coalesc/init-coalesc-region! region initial-data-size max-desc)
         ;; Cache layout info so slab-offset->byte-offset works for class 6
         (aset slab-data-offsets OVERFLOW_CLASS_IDX data-offset)
         (aset slab-bitmap-offsets OVERFLOW_CLASS_IDX (:desc-table-offset layout))
         (aset slab-total-blocks OVERFLOW_CLASS_IDX max-desc)
         ;; Store path and growth caps for lazy growth
         (set! mmap-coalesc-path path)
         (set! mmap-coalesc-max-data-size max-data-size)
         (set! mmap-coalesc-cached-data-size initial-data-size)
         ;; Register for read/write access
         (wasm/register-mmap-slab-instance! OVERFLOW_CLASS_IDX region)
         (set! mmap-coalesc-region region)))

     (defn open-mmap-coalesc!
       "Open an existing .slab6 file for the coalescing allocator."
       [path]
       (let [peek-region  (mem/open-mmap-region path 64)
             data-offset  (mem/load-i32 peek-region d/SLAB_HDR_DATA_OFFSET)
             dt-offset    (mem/load-i32 peek-region d/SLAB_HDR_BITMAP_OFFSET)
             max-desc     (mem/load-i32 peek-region d/SLAB_HDR_TOTAL_BLOCKS)
             cur-data-sz  (mem/load-i64 peek-region coalesc/COALESC_HDR_DATA_SIZE)
             ;; Map the file at current data size (will grow via grow-mmap-coalesc!)
             total-bytes  (+ data-offset cur-data-sz)
             region       (mem/open-mmap-region path total-bytes)]
         (aset slab-data-offsets OVERFLOW_CLASS_IDX data-offset)
         (aset slab-bitmap-offsets OVERFLOW_CLASS_IDX dt-offset)
         (aset slab-total-blocks OVERFLOW_CLASS_IDX max-desc)
         (set! mmap-coalesc-path path)
         (set! mmap-coalesc-max-data-size coalesc/DEFAULT_DATA_SIZE)
         (set! mmap-coalesc-cached-data-size cur-data-sz)
         (wasm/register-mmap-slab-instance! OVERFLOW_CLASS_IDX region)
         (set! mmap-coalesc-region region)))

     (defn- grow-mmap-coalesc!
       "Grow the .slab6 coalescing region. Uses CAS leader election in header.
        Returns true if grown/refreshed, false if at max."
       []
       (when (and mmap-coalesc-region mmap-coalesc-path)
         (let [result (coalesc/grow-coalesc-region!
                        mmap-coalesc-region mmap-coalesc-max-data-size)]
           (when result
             (let [data-offset (aset slab-data-offsets OVERFLOW_CLASS_IDX
                                     (aget slab-data-offsets OVERFLOW_CLASS_IDX))
                   total-bytes (+ (aget slab-data-offsets OVERFLOW_CLASS_IDX) result)
                   region      (mem/open-mmap-region mmap-coalesc-path total-bytes)]
               (set! mmap-coalesc-cached-data-size result)
               (wasm/register-mmap-slab-instance! OVERFLOW_CLASS_IDX region)
               (set! mmap-coalesc-region region)
               true)))))

     (defn- refresh-mmap-coalesc!
       "Re-map .slab6 if another process grew it."
       []
       (when (and mmap-coalesc-region mmap-coalesc-path)
         (let [hdr-data-sz (coalesc/current-data-size mmap-coalesc-region)]
           (when (> hdr-data-sz mmap-coalesc-cached-data-size)
             (let [total-bytes (+ (aget slab-data-offsets OVERFLOW_CLASS_IDX)
                                  hdr-data-sz)
                   region      (mem/open-mmap-region mmap-coalesc-path total-bytes)]
               (set! mmap-coalesc-cached-data-size hdr-data-sz)
               (wasm/register-mmap-slab-instance! OVERFLOW_CLASS_IDX region)
               (set! mmap-coalesc-region region))))))

     (defn reset-mmap-coalesc!
       "Clear the mmap coalescing region reference."
       []
       (set! mmap-coalesc-region nil)
       (set! mmap-coalesc-path nil)
       (set! mmap-coalesc-max-data-size 0)
       (set! mmap-coalesc-cached-data-size 0))))

