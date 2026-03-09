(ns cljs-thread.eve.deftype-proto.coalesc
  "Coalescing allocator for variable-size blocks (slab class 6).

   This is the general-purpose allocator that handles blocks > 1024 bytes.
   It uses a descriptor table to track contiguous regions within a data area.
   On free, adjacent FREE blocks are coalesced to reduce fragmentation.

   File layout (.slab6):
   ┌──────────────────────────────────────────────────────┐
   │ Header (64 bytes, same field offsets as slab header)  │
   │   [0..3]   magic: 0x534C4142 ('SLAB')                │
   │   [4..7]   block_size: 1 (class 6 convention)        │
   │   [8..11]  max_descriptors: u32                       │
   │   [12..15] alloc_cursor: u32 (descriptor scan hint)   │
   │   [20..23] class_idx: 6                               │
   │   [24..27] desc_table_offset: u32                     │
   │   [28..31] data_offset: u32                           │
   ├──────────────────────────────────────────────────────┤
   │ Descriptor Table (max_desc × 28 bytes)                │
   │   Each descriptor: 7 × i32 fields                     │
   ├──────────────────────────────────────────────────────┤
   │ Data Region (remaining space)                         │
   └──────────────────────────────────────────────────────┘

   Descriptor layout (28 bytes = 7 × i32):
     [0]  STATUS:         FREE=0, ALLOCATED=1, ZEROED_UNUSED=-1
     [4]  DATA_OFFSET:    byte offset relative to data region start
     [8]  DATA_LENGTH:    used bytes (informational, set by caller)
     [12] BLOCK_CAPACITY: total capacity of this contiguous block
     [16] RESERVED:       -1
     [20] LOCK_OWNER:     0=unlocked, nonzero=locked
     [24] RESERVED2:      0

   Addressing: slab-qualified offset = encode(6, data_offset).
   Since SLAB_SIZES[6]=1, block_idx × 1 = byte offset in data region.

   All operations go through IMemRegion for cross-platform (JVM + Node mmap)."
  (:require
   [cljs-thread.eve.deftype-proto.data :as d]
   [cljs-thread.eve.mem :as mem]))

;;=============================================================================
;; Constants
;;=============================================================================

(def ^:const DESC_SIZE 28)          ;; 7 × i32 bytes per descriptor
(def ^:const MAX_DESCRIPTORS 16384) ;; default; can be overridden

;; Descriptor field offsets (within a single descriptor)
(def ^:const DESC_STATUS 0)
(def ^:const DESC_DATA_OFFSET 4)
(def ^:const DESC_DATA_LENGTH 8)
(def ^:const DESC_BLOCK_CAPACITY 12)
(def ^:const DESC_RESERVED 16)
(def ^:const DESC_LOCK_OWNER 20)
(def ^:const DESC_RESERVED2 24)

;; Status values
(def ^:const STATUS_FREE 0)
(def ^:const STATUS_ALLOCATED 1)
(def ^:const STATUS_ZEROED_UNUSED -1)

;; Lock
(def ^:const LOCK_UNLOCKED 0)
(def ^:const LOCK_SENTINEL 1)  ;; generic lock value when no worker-id

;; Default data region max capacity for growth (4 PiB).
;; COALESC_HDR_DATA_SIZE is stored as i64, so the theoretical ceiling is 8 EiB.
;; 4 PiB = 2^52 bytes, exactly representable as both JS Number and JVM long.
(def ^:const DEFAULT_DATA_SIZE (* 4 1024 1024 1024 1024 1024))

;; Initial data region size for lazy growth (64 KB)
(def ^:const INITIAL_DATA_SIZE (* 64 1024))

;; Header extension: current data-region size at offset 32 (reserved bytes).
;; Stored as i64 (8 bytes at offsets 32-39) for >2 GB capacity.
(def ^:const COALESC_HDR_DATA_SIZE 32)

;;=============================================================================
;; Header access (reuses standard slab header field offsets)
;;=============================================================================

(defn- desc-table-offset
  "Read the descriptor table byte offset from the .slab6 header."
  ^long [region]
  (mem/-load-i32 region d/SLAB_HDR_BITMAP_OFFSET))

(defn- max-descs
  "Read the max descriptor count from the .slab6 header."
  ^long [region]
  (mem/-load-i32 region d/SLAB_HDR_TOTAL_BLOCKS))

(defn- data-region-offset
  "Read the data region byte offset from the .slab6 header."
  ^long [region]
  (mem/-load-i32 region d/SLAB_HDR_DATA_OFFSET))

(defn current-data-size
  "Read the current data-region size from the .slab6 header."
  ^long [region]
  (mem/-load-i64 region COALESC_HDR_DATA_SIZE))

;;=============================================================================
;; Descriptor field access
;;=============================================================================

(defn- desc-byte-off
  "Absolute byte offset of field within descriptor idx."
  ^long [dt-off idx field]
  (+ dt-off (* idx DESC_SIZE) field))

(defn- desc-load
  "Load an i32 field from descriptor idx."
  [region dt-off idx field]
  (mem/-load-i32 region (desc-byte-off dt-off idx field)))

(defn- desc-store!
  "Store an i32 field to descriptor idx."
  [region dt-off idx field val]
  (mem/-store-i32! region (desc-byte-off dt-off idx field) val))

(defn- desc-cas!
  "CAS an i32 field in descriptor idx. Returns old value."
  [region dt-off idx field expected desired]
  (mem/-cas-i32! region (desc-byte-off dt-off idx field) expected desired))

;;=============================================================================
;; Lock helpers
;;=============================================================================

(defn- try-lock!
  "Attempt to CAS-lock a descriptor. Returns true on success."
  [region dt-off idx]
  (let [old (desc-cas! region dt-off idx DESC_LOCK_OWNER
                       LOCK_UNLOCKED LOCK_SENTINEL)]
    (== old LOCK_UNLOCKED)))

(defn- unlock!
  "Release the lock on a descriptor."
  [region dt-off idx]
  (desc-store! region dt-off idx DESC_LOCK_OWNER LOCK_UNLOCKED))

(defn- spin-lock!
  "Spin-lock a descriptor with bounded retries. Returns true on success."
  [region dt-off idx max-retries]
  (loop [i 0]
    (cond
      (try-lock! region dt-off idx) true
      (>= i max-retries) false
      :else (recur (inc i)))))

;;=============================================================================
;; Find ZEROED_UNUSED descriptor slot
;;=============================================================================

(defn- find-zeroed-slot
  "Scan for a ZEROED_UNUSED descriptor slot starting from hint.
   Returns slot index or -1 if none found."
  [region dt-off max-desc hint]
  (loop [i hint wrapped? false]
    (cond
      (and (>= i max-desc) (not wrapped?))
      (recur 0 true)

      (and (>= i max-desc) wrapped?)
      -1

      (and wrapped? (>= i hint))
      -1

      :else
      (let [status (desc-load region dt-off i DESC_STATUS)]
        (if (== status STATUS_ZEROED_UNUSED)
          i
          (recur (inc i) wrapped?))))))

;;=============================================================================
;; Init
;;=============================================================================

(defn coalesc-layout
  "Calculate .slab6 file layout.
   Returns {:total-bytes :desc-table-offset :data-offset :max-descriptors}."
  [data-size max-desc]
  (let [dt-off   d/SLAB_HEADER_SIZE
        dt-size  (* max-desc DESC_SIZE)
        ;; Align data region to 16 bytes
        data-off (let [raw (+ dt-off dt-size)]
                   (* (quot (+ raw 15) 16) 16))]
    {:total-bytes     (+ data-off data-size)
     :desc-table-offset dt-off
     :data-offset     data-off
     :max-descriptors max-desc}))

(defn init-coalesc-region!
  "Initialize a .slab6 mmap region. Writes header, creates one FREE descriptor
   covering the entire data region, marks remaining descriptors ZEROED_UNUSED.
   Returns the IMemRegion."
  [region data-size max-desc]
  (let [{:keys [desc-table-offset data-offset]} (coalesc-layout data-size max-desc)]
    ;; Write header (reuse standard slab header field offsets)
    (mem/-store-i32! region d/SLAB_HDR_MAGIC d/SLAB_MAGIC)
    (mem/-store-i32! region d/SLAB_HDR_BLOCK_SIZE 1)       ;; class 6 convention
    (mem/-store-i32! region d/SLAB_HDR_TOTAL_BLOCKS max-desc)
    (mem/-store-i32! region d/SLAB_HDR_FREE_COUNT 1)       ;; 1 free descriptor
    (mem/-store-i32! region d/SLAB_HDR_ALLOC_CURSOR 0)
    (mem/-store-i32! region d/SLAB_HDR_CLASS_IDX 6)
    (mem/-store-i32! region d/SLAB_HDR_BITMAP_OFFSET desc-table-offset)
    (mem/-store-i32! region d/SLAB_HDR_DATA_OFFSET data-offset)
    ;; Extension: store current data-region size for lazy growth (i64)
    (mem/-store-i64! region COALESC_HDR_DATA_SIZE data-size)

    ;; Descriptor 0: one big FREE block covering entire data region
    (desc-store! region desc-table-offset 0 DESC_STATUS STATUS_FREE)
    (desc-store! region desc-table-offset 0 DESC_DATA_OFFSET 0)
    (desc-store! region desc-table-offset 0 DESC_DATA_LENGTH 0)
    (desc-store! region desc-table-offset 0 DESC_BLOCK_CAPACITY data-size)
    (desc-store! region desc-table-offset 0 DESC_RESERVED -1)
    (desc-store! region desc-table-offset 0 DESC_LOCK_OWNER LOCK_UNLOCKED)
    (desc-store! region desc-table-offset 0 DESC_RESERVED2 0)

    ;; Remaining descriptors: ZEROED_UNUSED
    (dotimes [i (dec max-desc)]
      (let [idx (inc i)]
        (desc-store! region desc-table-offset idx DESC_STATUS STATUS_ZEROED_UNUSED)
        (desc-store! region desc-table-offset idx DESC_LOCK_OWNER LOCK_UNLOCKED)))

    region))

;;=============================================================================
;; Growth
;;=============================================================================

(defn grow-coalesc-region!
  "Grow the coalescing data region by doubling, up to max-data-size.
   Uses CAS on COALESC_HDR_DATA_SIZE for leader election.
   The leader creates a new FREE descriptor covering the appended space.
   Returns the new data size on success, or nil if already at max."
  [region max-data-size]
  (let [cur-data-size (mem/-load-i64 region COALESC_HDR_DATA_SIZE)]
    (when (< cur-data-size max-data-size)
      (let [new-data-size (min (* cur-data-size 2) max-data-size)
            witness       (mem/-cas-i64! region COALESC_HDR_DATA_SIZE
                                         cur-data-size new-data-size)]
        (if (== witness cur-data-size)
          ;; We won — create a FREE descriptor for the new space
          (let [dt-off     (desc-table-offset region)
                max-desc   (max-descs region)
                added-size (- new-data-size cur-data-size)
                slot       (find-zeroed-slot region dt-off max-desc 0)]
            (when (not= slot -1)
              (when (try-lock! region dt-off slot)
                (let [ss (desc-load region dt-off slot DESC_STATUS)]
                  (if (== ss STATUS_ZEROED_UNUSED)
                    (do
                      (desc-store! region dt-off slot DESC_DATA_OFFSET cur-data-size)
                      (desc-store! region dt-off slot DESC_DATA_LENGTH 0)
                      (desc-store! region dt-off slot DESC_BLOCK_CAPACITY added-size)
                      (desc-store! region dt-off slot DESC_RESERVED -1)
                      (desc-store! region dt-off slot DESC_RESERVED2 0)
                      (desc-store! region dt-off slot DESC_STATUS STATUS_FREE)
                      (unlock! region dt-off slot))
                    (unlock! region dt-off slot)))))
            new-data-size)
          ;; Lost CAS — someone else grew, return their new size
          (let [actual (mem/-load-i64 region COALESC_HDR_DATA_SIZE)]
            actual))))))

;;=============================================================================
;; Alloc
;;=============================================================================

(defn coalesc-alloc!
  "Allocate a contiguous block of at least size-bytes from the coalescing region.
   Returns the byte offset relative to data region start (= block_idx for class 6),
   or throws on OOM.

   Algorithm:
   1. Round size to 4-byte alignment
   2. Scan descriptors from cursor for FREE with capacity >= size
   3. CAS-lock candidate
   4. If capacity > size + 32: split remainder into new ZEROED slot
   5. Mark ALLOCATED, return data_offset"
  ^long [region size-bytes]
  (let [size     (let [raw (long size-bytes)]
                   (* (quot (+ raw 3) 4) 4))  ;; 4-byte align
        dt-off   (desc-table-offset region)
        max-desc (max-descs region)
        cursor   (mem/-load-i32 region d/SLAB_HDR_ALLOC_CURSOR)]
    (loop [i cursor wrapped? false]
      (cond
        ;; Wrapped past cursor — OOM
        (and wrapped? (>= i cursor))
        (throw (ex-info "coalesc-alloc!: out of memory" {:size size-bytes}))

        ;; Past end — wrap around
        (>= i max-desc)
        (if wrapped?
          (throw (ex-info "coalesc-alloc!: out of memory" {:size size-bytes}))
          (recur 0 true))

        :else
        (let [status   (desc-load region dt-off i DESC_STATUS)
              capacity (when (== status STATUS_FREE)
                         (desc-load region dt-off i DESC_BLOCK_CAPACITY))]
          (if (and (== status STATUS_FREE)
                   (>= capacity size))
            ;; Candidate found — try to lock
            (if (try-lock! region dt-off i)
              ;; Got the lock — verify still FREE with sufficient capacity (TOCTOU)
              (let [status2   (desc-load region dt-off i DESC_STATUS)
                    capacity2 (desc-load region dt-off i DESC_BLOCK_CAPACITY)]
                (if (and (== status2 STATUS_FREE)
                         (>= capacity2 size))
                  ;; Good — allocate
                  (let [data-off (desc-load region dt-off i DESC_DATA_OFFSET)
                        remainder (- capacity2 size)]
                    ;; Try split if remainder is worth it (>= 32 bytes)
                    (when (>= remainder 32)
                      (let [split-slot (find-zeroed-slot region dt-off max-desc
                                         (mod (inc i) max-desc))]
                        (when (not= split-slot -1)
                          (when (try-lock! region dt-off split-slot)
                            ;; Verify still ZEROED (TOCTOU)
                            (let [ss (desc-load region dt-off split-slot DESC_STATUS)]
                              (if (== ss STATUS_ZEROED_UNUSED)
                                (do
                                  ;; Write split descriptor
                                  (desc-store! region dt-off split-slot DESC_DATA_OFFSET
                                               (+ data-off size))
                                  (desc-store! region dt-off split-slot DESC_DATA_LENGTH 0)
                                  (desc-store! region dt-off split-slot DESC_BLOCK_CAPACITY
                                               remainder)
                                  (desc-store! region dt-off split-slot DESC_RESERVED -1)
                                  (desc-store! region dt-off split-slot DESC_RESERVED2 0)
                                  (desc-store! region dt-off split-slot DESC_STATUS STATUS_FREE)
                                  (unlock! region dt-off split-slot)
                                  ;; Shrink our capacity
                                  (desc-store! region dt-off i DESC_BLOCK_CAPACITY size))
                                ;; Split slot taken — skip split, keep full capacity
                                (unlock! region dt-off split-slot)))))))
                    ;; Mark as allocated
                    (desc-store! region dt-off i DESC_DATA_LENGTH 0)
                    (desc-store! region dt-off i DESC_RESERVED -1)
                    (desc-store! region dt-off i DESC_RESERVED2 0)
                    (desc-store! region dt-off i DESC_STATUS STATUS_ALLOCATED)
                    ;; Update cursor
                    (mem/-store-i32! region d/SLAB_HDR_ALLOC_CURSOR
                                     (mod (inc i) max-desc))
                    ;; Release lock and return
                    (unlock! region dt-off i)
                    data-off)
                  ;; TOCTOU: lost the race — release lock, continue scan
                  (do (unlock! region dt-off i)
                      (recur (inc i) wrapped?))))
              ;; Lock contention — skip, continue
              (recur (inc i) wrapped?))
            ;; Not a suitable candidate — continue
            (recur (inc i) wrapped?)))))))

;;=============================================================================
;; Free
;;=============================================================================

(defn- find-desc-by-data-offset
  "Find the descriptor index whose DATA_OFFSET == target-data-off.
   Returns index or -1."
  [region dt-off max-desc target-data-off]
  (loop [i 0]
    (if (>= i max-desc)
      -1
      (let [status (desc-load region dt-off i DESC_STATUS)]
        (if (and (not= status STATUS_ZEROED_UNUSED)
                 (== (desc-load region dt-off i DESC_DATA_OFFSET) target-data-off))
          i
          (recur (inc i)))))))

(defn- coalesce-adjacent!
  "Merge physically adjacent FREE blocks around descriptor idx.
   Must be called with idx already locked and marked FREE.
   Releases idx lock when done."
  [region dt-off max-desc idx]
  (let [our-off (desc-load region dt-off idx DESC_DATA_OFFSET)
        our-cap (desc-load region dt-off idx DESC_BLOCK_CAPACITY)
        our-end (+ our-off our-cap)]

    ;; Phase 1: Left coalesce — find FREE block ending at our-off
    (let [left-idx
          (loop [j 0]
            (if (>= j max-desc)
              -1
              (let [status (desc-load region dt-off j DESC_STATUS)]
                (if (and (== status STATUS_FREE)
                         (not= j idx)
                         (let [loff (desc-load region dt-off j DESC_DATA_OFFSET)
                               lcap (desc-load region dt-off j DESC_BLOCK_CAPACITY)]
                           (== (+ loff lcap) our-off)))
                  j
                  (recur (inc j))))))

          ;; If left found, try to lock and merge
          [survivor surv-off surv-cap left-locked?]
          (if (and (not= left-idx -1) (spin-lock! region dt-off left-idx 200))
            ;; Verify still FREE (TOCTOU)
            (let [ls (desc-load region dt-off left-idx DESC_STATUS)]
              (if (== ls STATUS_FREE)
                (let [loff (desc-load region dt-off left-idx DESC_DATA_OFFSET)
                      lcap (desc-load region dt-off left-idx DESC_BLOCK_CAPACITY)]
                  (if (== (+ loff lcap) our-off)
                    ;; Merge: left absorbs us
                    (let [new-cap (+ lcap our-cap)]
                      (desc-store! region dt-off left-idx DESC_BLOCK_CAPACITY new-cap)
                      ;; Mark ourselves as ZEROED_UNUSED (reclaim descriptor)
                      (desc-store! region dt-off idx DESC_STATUS STATUS_ZEROED_UNUSED)
                      (desc-store! region dt-off idx DESC_LOCK_OWNER LOCK_UNLOCKED)
                      ;; Survivor is left (keep left locked for right merge)
                      [left-idx loff new-cap true])
                    ;; Offsets don't match anymore — release left
                    (do (unlock! region dt-off left-idx)
                        [idx our-off our-cap false])))
                ;; Left no longer FREE — release
                (do (unlock! region dt-off left-idx)
                    [idx our-off our-cap false])))
            ;; Left not found or lock failed
            [idx our-off our-cap false])]

      ;; Phase 2: Right coalesce — find FREE block starting at survivor end
      (let [surv-end (+ surv-off surv-cap)
            right-idx
            (loop [j 0]
              (if (>= j max-desc)
                -1
                (let [status (desc-load region dt-off j DESC_STATUS)]
                  (if (and (== status STATUS_FREE)
                           (not= j survivor)
                           (== (desc-load region dt-off j DESC_DATA_OFFSET) surv-end))
                    j
                    (recur (inc j))))))]
        (when (and (not= right-idx -1) (spin-lock! region dt-off right-idx 200))
          (let [rs (desc-load region dt-off right-idx DESC_STATUS)]
            (if (and (== rs STATUS_FREE)
                     (== (desc-load region dt-off right-idx DESC_DATA_OFFSET) surv-end))
              (let [rcap (desc-load region dt-off right-idx DESC_BLOCK_CAPACITY)]
                ;; Merge: survivor absorbs right
                (desc-store! region dt-off survivor DESC_BLOCK_CAPACITY
                             (+ surv-cap rcap))
                ;; Mark right as ZEROED_UNUSED
                (desc-store! region dt-off right-idx DESC_STATUS STATUS_ZEROED_UNUSED)
                (unlock! region dt-off right-idx))
              ;; Right not valid anymore
              (unlock! region dt-off right-idx))))

        ;; Release survivor lock
        (unlock! region dt-off survivor)))))

(defn coalesc-free!
  "Free a block identified by its data-region-relative byte offset.
   Returns true if freed, false if not found."
  [region data-off-in-region]
  (let [dt-off   (desc-table-offset region)
        max-desc (max-descs region)
        idx      (find-desc-by-data-offset region dt-off max-desc data-off-in-region)]
    (if (== idx -1)
      false
      (if (spin-lock! region dt-off idx 400)
        (let [status (desc-load region dt-off idx DESC_STATUS)]
          (if (== status STATUS_ALLOCATED)
            (do
              ;; Mark FREE
              (desc-store! region dt-off idx DESC_DATA_LENGTH 0)
              (desc-store! region dt-off idx DESC_STATUS STATUS_FREE)
              ;; Coalesce (releases lock)
              (coalesce-adjacent! region dt-off max-desc idx)
              true)
            ;; Already free or zeroed — release lock
            (do (unlock! region dt-off idx)
                false)))
        ;; Lock contention — give up
        false))))
