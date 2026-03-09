(ns cljs-thread.eve.deftype-proto.data
  "Slab allocator constants and layout definitions.

   ARCHITECTURE:
   ═══════════════════════════════════════════════════════════════

   Instead of one SAB with a flat descriptor table + coalescing,
   we use MULTIPLE SharedArrayBuffers — one per size class.
   Each slab SAB contains only fixed-size blocks, so:
   - No coalescing ever needed (all blocks same size)
   - Free tracking via a bitmap (1 bit per block)
   - SIMD scans 128 blocks per v128 load (vs 4 descriptors before)
   - Each slab can grow independently via memory.grow

   SIZE CLASSES (power-of-2 + HAMT-optimal):
   ═══════════════════════════════════════════════════════════════

   Slab  Block   Typical contents
   ────  ──────  ────────────────────────────────────
    0     32B    Tiny: 0-1 children, 1 small KV, list nodes
    1     64B    Common: 2-3 children, 1-2 KVs
    2    128B    Medium: 4-8 children, 2-4 KVs
    3    256B    Dense: 8-16 children, multiple KVs
    4    512B    Very dense or collision nodes
    5   1024B    Large collision nodes, big KV payloads

   Requests > 1024B go to an overflow slab that uses the old
   exact-fit allocator (fallback to eve.atom behavior).

   SLAB MEMORY LAYOUT (each slab SAB):
   ═══════════════════════════════════════════════════════════════

   ┌──────────────────────────────────────────────────────┐
   │ Slab Header (64 bytes, cache-line aligned)           │
   │   [0..3]   magic: 0x534C4142 ('SLAB')               │
   │   [4..7]   block_size: u32                           │
   │   [8..11]  total_blocks: u32                         │
   │   [12..15] free_count: u32 (atomic)                  │
   │   [16..19] alloc_cursor: u32 (per-worker hint)       │
   │   [20..23] slab_class_idx: u32                       │
   │   [24..27] bitmap_offset: u32                        │
   │   [28..31] data_offset: u32                          │
   │   [32..63] reserved                                  │
   ├──────────────────────────────────────────────────────┤
   │ Bitmap Region (1 bit per block, 16-byte aligned)     │
   │   bit=0 → free, bit=1 → allocated                   │
   │   Size: ceil(total_blocks / 8) bytes, padded to 16B  │
   ├──────────────────────────────────────────────────────┤
   │ Data Region (block_size × total_blocks bytes)        │
   │   All blocks are contiguous, uniformly sized.        │
   │   Block N starts at: data_offset + N * block_size    │
   └──────────────────────────────────────────────────────┘

   ROOT POINTER SAB (separate, shared by all workers):
   ═══════════════════════════════════════════════════════════════
   Stores the atom root pointer, epoch counter, worker registry.
   Root pointer value is now:  [slab_class_idx:u8 block_idx:u24]
   packed into a single i32 so the root CAS stays a single atomic.

   BITMAP SCANNING (WASM + SIMD):
   ═══════════════════════════════════════════════════════════════
   v128.load bitmap bytes → v128.not → find first non-zero byte
   via i8x16.bitmask + ctz. Scans 128 bits (128 blocks) per
   SIMD iteration. For a 1MB slab with 64B blocks (16384 blocks),
   the full bitmap is 2KB = 128 v128 loads worst case.")

;;=============================================================================
;; Size Classes
;;=============================================================================

(def ^:const NUM_SLAB_CLASSES 6)

;; Block sizes for each slab class (bytes)
(def ^:const SLAB_SIZE_0 32)
(def ^:const SLAB_SIZE_1 64)
(def ^:const SLAB_SIZE_2 128)
(def ^:const SLAB_SIZE_3 256)
(def ^:const SLAB_SIZE_4 512)
(def ^:const SLAB_SIZE_5 1024)

;; Lookup table: class index → block size
;; Index 6 = overflow (legacy SAB): block_size=1 so block_idx * 1 = byte_offset
(def SLAB_SIZES
  #?(:clj  [32 64 128 256 512 1024 1]
     :cljs #js [32 64 128 256 512 1024 1]))

;; Max block size handled by slab allocator
;; Anything larger goes to the overflow (old-style) allocator
(def ^:const SLAB_MAX_BLOCK_SIZE 1024)

;; Default max capacity per bitmap slab (bytes of data region).
;; Bitmap slabs use i32 header fields; the practical limit is the packed
;; slab pointer (block_idx:u24 = 16M blocks).  2 GB is the fallback for
;; out-of-range class indices.
(def ^:const DEFAULT_SLAB_CAPACITY (* 2 1024 1024 1024)) ;; 2GB

;; Per-class max capacities sized for production workloads.
;; Bitmap and data offsets are computed for max capacity at init time so the
;; data region never moves during growth.  On Linux/macOS, sparse files and
;; lazy mmap page commit mean untouched bitmap/data pages cost zero physical
;; memory or disk — only virtual address space.  Growth doubles lazily via
;; CAS on the header's total_blocks field.
;;
;; Class 0 (32B):    1GB =   32M blocks  (HAMT bitmap nodes — heaviest use)
;; Class 1 (64B):    1GB =   16M blocks  (HAMT nodes, small values)
;; Class 2 (128B):   1GB =    8M blocks  (vec trie nodes, larger HAMT nodes)
;; Class 3 (256B): 512MB =    2M blocks  (collision nodes, serialized values)
;; Class 4 (512B): 256MB =  512K blocks  (less common)
;; Class 5 (1024B):256MB =  256K blocks  (least common)
(def ^:private SLAB_CLASS_CAPACITIES
  #?(:clj  [(* 1024 1024 1024)        ;; Class 0: 1GB
             (* 1024 1024 1024)        ;; Class 1: 1GB
             (* 1024 1024 1024)        ;; Class 2: 1GB
             (* 512 1024 1024)         ;; Class 3: 512MB
             (* 256 1024 1024)         ;; Class 4: 256MB
             (* 256 1024 1024)]        ;; Class 5: 256MB
     :cljs #js [(* 1024 1024 1024)     ;; Class 0: 1GB
                (* 1024 1024 1024)     ;; Class 1: 1GB
                (* 1024 1024 1024)     ;; Class 2: 1GB
                (* 512 1024 1024)      ;; Class 3: 512MB
                (* 256 1024 1024)      ;; Class 4: 256MB
                (* 256 1024 1024)]))   ;; Class 5: 256MB

;; Initial (small) capacities for lazy slab growth.
;; Files start at these sizes and grow on demand up to max capacities.
;; Total initial data: ~224KB (grows lazily to GB/TB-scale max).
;; Note: bitmap region is sized for max capacity but sparse-file semantics
;; mean untouched bitmap pages cost zero physical memory/disk.
(def ^:private SLAB_CLASS_INITIAL_CAPACITIES
  #?(:clj  [(* 64 1024)    ;; Class 0 (32B):  64KB = 2K blocks
             (* 64 1024)    ;; Class 1 (64B):  64KB = 1K blocks
             (* 32 1024)    ;; Class 2 (128B): 32KB = 256 blocks
             (* 32 1024)    ;; Class 3 (256B): 32KB = 128 blocks
             (* 16 1024)    ;; Class 4 (512B): 16KB = 32 blocks
             (* 16 1024)]   ;; Class 5 (1024B):16KB = 16 blocks
     :cljs #js [(* 64 1024)    ;; Class 0 (32B):  64KB = 2K blocks
                (* 64 1024)    ;; Class 1 (64B):  64KB = 1K blocks
                (* 32 1024)    ;; Class 2 (128B): 32KB = 256 blocks
                (* 32 1024)    ;; Class 3 (256B): 32KB = 128 blocks
                (* 16 1024)    ;; Class 4 (512B): 16KB = 32 blocks
                (* 16 1024)])) ;; Class 5 (1024B):16KB = 16 blocks

(defn default-capacity-for-class
  "Get the default (max) capacity for a slab class index."
  [class-idx]
  (let [caps SLAB_CLASS_CAPACITIES
        len  #?(:clj (count caps) :cljs (.-length caps))]
    (if (and (>= class-idx 0) (< class-idx len))
      #?(:clj  (nth caps class-idx)
         :cljs (aget caps class-idx))
      DEFAULT_SLAB_CAPACITY)))

(defn initial-capacity-for-class
  "Get the initial (small) capacity for a slab class index.
   Files start at this size and grow on demand."
  [class-idx]
  (let [caps SLAB_CLASS_INITIAL_CAPACITIES
        len  #?(:clj (count caps) :cljs (.-length caps))]
    (if (and (>= class-idx 0) (< class-idx len))
      #?(:clj  (nth caps class-idx)
         :cljs (aget caps class-idx))
      (* 64 1024))))


;;=============================================================================
;; Slab Header Layout (64 bytes, cache-line aligned)
;;=============================================================================

(def ^:const SLAB_HEADER_SIZE 64)

;; Byte offsets within slab header
(def ^:const SLAB_HDR_MAGIC 0)           ;; u32: 0x534C4142
(def ^:const SLAB_HDR_BLOCK_SIZE 4)      ;; u32: block size in bytes
(def ^:const SLAB_HDR_TOTAL_BLOCKS 8)    ;; u32: number of blocks in this slab
(def ^:const SLAB_HDR_FREE_COUNT 12)     ;; u32: atomic free block counter
(def ^:const SLAB_HDR_ALLOC_CURSOR 16)   ;; u32: hint for next scan start
(def ^:const SLAB_HDR_CLASS_IDX 20)      ;; u32: which size class (0-5)
(def ^:const SLAB_HDR_BITMAP_OFFSET 24)  ;; u32: byte offset where bitmap starts
(def ^:const SLAB_HDR_DATA_OFFSET 28)    ;; u32: byte offset where data region starts
;; 32..63 reserved for future use (epoch, generation, etc.)

(def ^:const SLAB_MAGIC 0x534C4142)      ;; 'SLAB' in ASCII

;;=============================================================================
;; Bitmap Layout
;;=============================================================================

;; Bitmap is packed: 1 bit per block, 0=free, 1=allocated.
;; Aligned to 16 bytes for SIMD v128 loads.
(def ^:const BITMAP_ALIGNMENT 16)

(defn bitmap-byte-size
  "Calculate bitmap size in bytes for n blocks, padded to 16-byte alignment."
  [total-blocks]
  (let [raw-bytes (quot (+ total-blocks 7) 8)
        padded    (* (quot (+ raw-bytes (dec BITMAP_ALIGNMENT)) BITMAP_ALIGNMENT)
                     BITMAP_ALIGNMENT)]
    padded))

(defn slab-layout
  "Calculate layout for a slab with given block-size and capacity.
   Returns {:total-bytes :bitmap-offset :bitmap-size :data-offset :total-blocks}.
   Used for SAB/heap slabs where bitmap and data share one buffer."
  [block-size capacity-bytes]
  (let [total-blocks  (quot capacity-bytes block-size)
        bitmap-offset SLAB_HEADER_SIZE
        bm-size       (bitmap-byte-size total-blocks)
        data-offset   (+ bitmap-offset bm-size)
        total-bytes   (+ data-offset (* total-blocks block-size))]
    {:total-bytes   total-bytes
     :bitmap-offset bitmap-offset
     :bitmap-size   bm-size
     :data-offset   data-offset
     :total-blocks  total-blocks}))

(defn mmap-slab-layout
  "Calculate split-file layout for an mmap slab.
   Bitmap and data live in separate files so data_offset is always
   SLAB_HEADER_SIZE. Returns {:data-bytes :bitmap-bytes :total-blocks}."
  [block-size capacity-bytes]
  (let [total-blocks (quot capacity-bytes block-size)]
    {:data-bytes   (+ SLAB_HEADER_SIZE (* total-blocks block-size))
     :bitmap-bytes (bitmap-byte-size total-blocks)
     :total-blocks total-blocks}))

(defn slab-bitmap-path
  "Return the bitmap file path for a slab class, e.g. \"/tmp/eve.slab0.bm\"."
  [base-path class-idx]
  (str base-path ".slab" class-idx ".bm"))

(defn slab-data-path
  "Return the data file path for a slab class, e.g. \"/tmp/eve.slab0\"."
  [base-path class-idx]
  (str base-path ".slab" class-idx))

;;=============================================================================
;; Size-Class Routing
;;=============================================================================

(defn size->class-idx
  "Given a requested byte size, return the slab class index (0-5).
   Returns -1 if the size exceeds SLAB_MAX_BLOCK_SIZE (use overflow allocator)."
  [size-bytes]
  (cond
    (<= size-bytes SLAB_SIZE_0) 0
    (<= size-bytes SLAB_SIZE_1) 1
    (<= size-bytes SLAB_SIZE_2) 2
    (<= size-bytes SLAB_SIZE_3) 3
    (<= size-bytes SLAB_SIZE_4) 4
    (<= size-bytes SLAB_SIZE_5) 5
    :else -1))

;;=============================================================================
;; Packed Slab Pointer (for root pointer CAS)
;;=============================================================================
;; A slab pointer packs [class_idx:u8 | block_idx:u24] into one i32.
;; This lets the root pointer CAS remain a single atomic i32 operation.
;; Max block index: 2^24 - 1 = 16,777,215 (plenty for 1MB slabs)

(def ^:const SLAB_PTR_NIL -1)  ;; sentinel for "no value" / empty

(defn pack-slab-ptr
  "Pack a slab class index and block index into a single i32."
  [class-idx block-idx]
  (bit-or (bit-shift-left (bit-and class-idx 0xFF) 24)
          (bit-and block-idx 0xFFFFFF)))

(defn unpack-slab-class
  "Extract the slab class index (0-5) from a packed slab pointer."
  [slab-ptr]
  (bit-and (unsigned-bit-shift-right slab-ptr 24) 0xFF))

(defn unpack-slab-block-idx
  "Extract the block index from a packed slab pointer."
  [slab-ptr]
  (bit-and slab-ptr 0xFFFFFF))

;;=============================================================================
;; Root/Control SAB Layout
;;=============================================================================
;; The root SAB stores global state shared across workers:
;; - Atom root pointer (packed slab ptr)
;; - Global epoch counter
;; - Worker registry

(def ^:const SIZE_OF_INT32 4)

(def ^:const ROOT_SAB_HEADER_SIZE 64)   ;; cache-line aligned header

(def ^:const ROOT_MAGIC_OFFSET 0)         ;; u32: 0x524F4F54 ('ROOT')
(def ^:const ROOT_ATOM_PTR_OFFSET 4)      ;; i32: packed slab ptr (class|block)
(def ^:const ROOT_EPOCH_OFFSET 8)         ;; u32: global epoch counter
(def ^:const ROOT_WORKER_REG_OFFSET 12)   ;; u32: byte offset to worker registry start
;; Bytes 16..63 reserved

(def ^:const ROOT_MAGIC 0x524F4F54)       ;; 'ROOT' in ASCII

;; Worker registry begins at byte 64 (right after header)
(def ^:const ROOT_WORKER_REGISTRY_START ROOT_SAB_HEADER_SIZE)

;; Worker registry config (same as eve.data)
(def ^:const MAX_WORKERS 256)
(def ^:const WORKER_SLOT_SIZE 24)
(def ^:const WORKER_REGISTRY_SIZE (* MAX_WORKERS WORKER_SLOT_SIZE))

;; Total root SAB size
(def ^:const ROOT_SAB_SIZE (+ ROOT_SAB_HEADER_SIZE WORKER_REGISTRY_SIZE))

;; Worker status values
(def ^:const WORKER_STATUS_INACTIVE 0)
(def ^:const WORKER_STATUS_ACTIVE 1)
(def ^:const WORKER_STATUS_STALE 2)

;; Worker slot layout (24 bytes per worker)
(def ^:const OFFSET_WS_STATUS 0)
(def ^:const OFFSET_WS_CURRENT_EPOCH 4)
(def ^:const OFFSET_WS_HEARTBEAT_LO 8)
(def ^:const OFFSET_WS_HEARTBEAT_HI 12)
(def ^:const OFFSET_WS_WORKER_ID 16)
(def ^:const OFFSET_WS_RESERVED 20)

(def ^:const HEARTBEAT_TIMEOUT_MS 30000)

;; Block status (for epoch-GC on the bitmap: we only need 1-bit allocated,
;; but for retirement we track status per-block in a separate status byte array.
;; However, the slab design simplifies this: most blocks are either free or allocated.
;; Retired blocks get their bitmap bit set but are tracked in a retired-list.)
(def ^:const STATUS_FREE 0)
(def ^:const STATUS_ALLOCATED 1)
(def ^:const STATUS_RETIRED 2)

;;=============================================================================
;; Protocols (interface-compatible with eve.data)
;;=============================================================================

(defprotocol IEveRoot
  "Marks an Eve type that can live at the atom root.
   Implement (-root-header-off this) to return the slab-qualified offset of the
   type's header block. That one method is sufficient for atom swap! to work."
  (-root-header-off [this]))

(defprotocol IDirectSerialize
  (-direct-serialize [this]))

(defprotocol ISabStorable
  (-sab-tag [this])
  (-sab-encode [this slab-env])
  (-sab-dispose [this slab-env]))

(defprotocol ISabRetirable
  (-sab-retire-diff! [old-value new-value slab-env mode]))

(defprotocol ISabpType
  (-sabp-type-key [this]))

(defprotocol IsEve
  "Marker protocol for EVE types. Used by serialization to detect
   EVE objects without walking into their internals."
  (-eve? [this]))

;;=============================================================================
;; Dynamic Vars
;;=============================================================================

(def ^:dynamic *persistent?* true)
(def ^:dynamic *parent-atom* nil)
(def ^:dynamic *worker-id* nil)
(def ^:dynamic *worker-slot-idx* nil)
(def ^:dynamic *read-epoch* nil)

;;=============================================================================
;; HAMT Node Constants (same as eve.data)
;;=============================================================================

(def ^:const HAMT_BITMAP_NODE_TYPE 3)
(def ^:const HAMT_COLLISION_NODE_TYPE 4)
(def ^:const HAMT_BITMAP_NODE_COLUMNAR_TYPE 6)
(def ^:const HAMT_BITMAP_NODE_HEADER_SIZE 10)
(def ^:const HAMT_COLLISION_NODE_HEADER_SIZE 8)

;;=============================================================================
;; Serialization Tags (same as eve.data)
;;=============================================================================

(def ^:const TAG_JS_ARRAY "js/Array")
(def ^:const TAG_UINT8_ARRAY "js/Uint8Array")
(def ^:const TAG_INT8_ARRAY "js/Int8Array")
(def ^:const TAG_UINT8_CLAMPED_ARRAY "js/Uint8ClampedArray")
(def ^:const TAG_INT16_ARRAY "js/Int16Array")
(def ^:const TAG_UINT16_ARRAY "js/Uint16Array")
(def ^:const TAG_INT32_ARRAY "js/Int32Array")
(def ^:const TAG_UINT32_ARRAY "js/Uint32Array")
(def ^:const TAG_FLOAT32_ARRAY "js/Float32Array")
(def ^:const TAG_FLOAT64_ARRAY "js/Float64Array")
(def ^:const TAG_BIGINT64_ARRAY "js/BigInt64Array")
(def ^:const TAG_BIGUINT64_ARRAY "js/BigUint64Array")
(def ^:const TAG_REGEX "regex")
(def ^:const TAG_URI "uri")
(def ^:const TAG_CHAR "char")
(def ^:const TAG_BIGINT "bigint")
(def ^:const TAG_RECORD "record")

(def ^:const TAG_SABP_LINKED_LIST_STATE "eve/SabpListStateV1")
(def ^:const TAG_SABP_CHUNKED_LIST_STATE "eve/SabpChunkedListV1")
(def ^:const TAG_SABP_CHUNKED_VEC_STATE "eve/SabpChunkedVecV1")
(def ^:const TAG_SABP_MAP_STATE "eve/SabpMapStateV1")
(def ^:const TAG_SABP_SET_STATE "eve/SabpSetStateV1")

(def ^:const DIRECT_MAGIC_0 0xEE)
(def ^:const DIRECT_MAGIC_1 0xDB)
(def ^:const DIRECT_MARKER_MAP 0xED)
(def ^:const DIRECT_MARKER_SET 0xEC)

;; Linked list constants
(def ^:const OFFSET_LL_NODE_VALUE 0)
(def ^:const LL_NODE_NEXT_OFFSET_SIZE_BYTES SIZE_OF_INT32)

;; Chunked list
(def ^:const CHUNKED_LIST_CHUNK_SIZE 32)

;; Max swap retries for CAS loops
(def ^:const MAX_SWAP_RETRIES 1000)

;; Legacy sabp-cleanup registry
(defonce ^:private sabp-cleanup-fns (atom {}))
(defn register-sabp-cleanup! [type-key-str cleanup-fn]
  (swap! sabp-cleanup-fns assoc type-key-str cleanup-fn))
(defn get-sabp-cleanup-fn [type-key-str]
  (get @sabp-cleanup-fns type-key-str))
