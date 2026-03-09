(ns cljs-thread.eve.set
  "EVE persistent set backed by SharedArrayBuffer with fast-path serialization.

   Built on eve-slab-deftype with full feature parity:
   - Supports arbitrary CLJS values (via fast-path serialization)
   - Fast-path for primitives (nil, bool, int32, float64, string, keyword)
   - Slab-based allocation for efficient transients
   - Two-bitmap HAMT with inline values for performance

   Architecture:
   - EveHashSet: root handle with count and root-offset (slab-allocated header)
   - Bitmap nodes: two bitmaps (data_bitmap + node_bitmap) with inline values
   - Collision nodes: list of serialized values with same hash

   Node layout (two-bitmap HAMT):
   [type:u8][pad:u8][data_bitmap:u32][node_bitmap:u32][children...][values...]
   - data_bitmap: marks slots with inline values
   - node_bitmap: marks slots with child node pointers
   - children: 4 bytes each (popcount of node_bitmap entries)
   - values: [len:u32][bytes...] for each inline value

   All node offsets are slab-qualified: [class_idx:3 | block_idx:29].
   Read/write helpers transparently route to the correct slab."
  (:refer-clojure :exclude [hash-set])
  (:require
   [cljs-thread.eve.deftype-proto.alloc :as eve-alloc]
   [cljs-thread.eve.deftype-proto.data :as d]
   [cljs-thread.eve.deftype-proto.serialize :as ser]
   [cljs-thread.eve.deftype-proto.simd :as simd]))

;; Forward declarations
(declare ->EveHashSet ->TransientEveHashSet EveHashSet TransientEveHashSet)
(declare empty-hash-set)
(declare popcount32 retire-replaced-path! retire-tree-diff!)

;;-----------------------------------------------------------------------------
;; Constants
;;-----------------------------------------------------------------------------

(def ^:const SHIFT_STEP 5)
(def ^:const MASK 0x1f)      ;; 31

;; Node types encoded in first byte
(def ^:const NODE_TYPE_BITMAP 1)    ;; Two-bitmap node (inline values + child pointers)
(def ^:const NODE_TYPE_COLLISION 2) ;; Hash collision node

;; Node header: [type:u8][flags:u8][pad:u16][data_bitmap:u32][node_bitmap:u32] = 12
(def ^:const NODE_HEADER_SIZE 12)

;;-----------------------------------------------------------------------------
;; Allocation helpers - Pool with size-class normalization + batch pre-alloc
;; In the slab world, pools just hold slab-qualified offsets.
;; No descriptor-idx tracking needed — free! takes a slab-qualified offset.
;;-----------------------------------------------------------------------------

(def ^:private ^:const MAX_POOL_SIZE 512)
(def ^:private ^:const BATCH_ALLOC_SIZE 64)

(defn- size-class-for
  "Find the appropriate size class for a given allocation size."
  [n]
  (cond (<= n 64) 64 (<= n 128) 128 (<= n 256) 256 (<= n 512) 512 :else nil))

;; Per-class pools — each entry is just a slab-qualified offset (i32).
(def ^:private pool-64 #js [])
(def ^:private pool-128 #js [])
(def ^:private pool-256 #js [])
(def ^:private pool-512 #js [])

(defn reset-pools!
  "Reset global node pools.
   Must be called when switching to a new slab environment."
  []
  (set! pool-64 #js [])
  (set! pool-128 #js [])
  (set! pool-256 #js [])
  (set! pool-512 #js []))

(defn drain-pools!
  "Free all pooled blocks and reset pools."
  []
  (doseq [pool [pool-64 pool-128 pool-256 pool-512]]
    (dotimes [i (.-length pool)]
      (eve-alloc/free! (aget pool i))))
  (set! pool-64 #js [])
  (set! pool-128 #js [])
  (set! pool-256 #js [])
  (set! pool-512 #js []))

(defn- pool-get!
  "Try to get a slab-qualified offset from the pool. Returns offset or nil."
  [size-class]
  (let [stack (case size-class
                64 pool-64  128 pool-128
                256 pool-256  512 pool-512
                nil)]
    (when (and stack (pos? (.-length stack)))
      (.pop stack))))

(defn- pool-put!
  "Add a slab-qualified offset to the pool. Returns true if added, false if pool is full."
  [size-class slab-offset]
  (let [stack (case size-class
                64 pool-64  128 pool-128
                256 pool-256  512 pool-512
                nil)]
    (when stack
      (if (< (.-length stack) MAX_POOL_SIZE)
        (do (.push stack slab-offset) true)
        false))))

(defn- alloc-bytes!
  "Allocate n bytes, rounded up to nearest size class.
   Returns a slab-qualified offset."
  [n]
  (let [size-class (size-class-for n)]
    (if size-class
      ;; Try pool first
      (if-let [pooled (pool-get! size-class)]
        pooled
        ;; Pool miss — batch alloc
        (let [results (eve-alloc/batch-alloc size-class BATCH_ALLOC_SIZE)
              results (if (and results (pos? (.-length results)))
                        results
                        (do (drain-pools!)
                            (eve-alloc/batch-alloc size-class BATCH_ALLOC_SIZE)))
              len (if results (.-length results) 0)]
          (when (== len 0)
            (throw (js/Error. (str "Set allocation failed: out of memory for " size-class " bytes"))))
          ;; Put extras into pool
          (loop [i 1]
            (when (< i len)
              (pool-put! size-class (aget results i))
              (recur (inc i))))
          ;; Return first
          (aget results 0)))
      ;; Too large for pooling — direct alloc
      (eve-alloc/alloc-offset n))))

;; Forward declare for recursive freeing
(declare free-hamt-node!)

(defn- maybe-pool-or-free!
  "Try to add a freed block to the pool. If pool is full, actually free it."
  [slab-offset size]
  (let [size-class (size-class-for size)]
    (if (and size-class (pool-put! size-class slab-offset))
      true
      (do (eve-alloc/free! slab-offset) nil))))

(defn- node-size-for-free
  "Get the block size for a slab-qualified offset, for pool/free routing."
  ^number [^number slab-off]
  (let [class-idx (eve-alloc/decode-class-idx slab-off)]
    (if (< class-idx d/NUM_SLAB_CLASSES)
      (aget d/SLAB_SIZES class-idx)
      0)))

(defn- free-hamt-node!
  "Recursively free a HAMT node and all its children."
  [slab-off]
  (when (not= slab-off eve-alloc/NIL_OFFSET)
    (let [node-type (let [base (eve-alloc/resolve-dv! slab-off)]
                      (.getUint8 eve-alloc/resolved-dv base))]
      (case node-type
        ;; Bitmap node — free children first
        1 (let [base (eve-alloc/resolve-dv! slab-off)
                node-bm (.getUint32 eve-alloc/resolved-dv (+ base 8) true)
                child-count (popcount32 node-bm)]
            (dotimes [i child-count]
              (let [child-off (.getInt32 eve-alloc/resolved-dv
                                        (+ base NODE_HEADER_SIZE (* i 4)) true)]
                ;; Re-resolve needed after recursive calls
                (free-hamt-node! child-off)))
            (let [size (node-size-for-free slab-off)]
              (if (pos? size)
                (maybe-pool-or-free! slab-off size)
                (eve-alloc/free! slab-off))))

        ;; Collision node — no children
        2 (let [size (node-size-for-free slab-off)]
            (if (pos? size)
              (maybe-pool-or-free! slab-off size)
              (eve-alloc/free! slab-off)))

        ;; Unknown
        (eve-alloc/free! slab-off)))))

(defn- copy-from-sab
  "Copy bytes from a slab-qualified offset + byte-within-block into a new Uint8Array."
  [^number slab-off ^number byte-off ^number len]
  (let [src (eve-alloc/read-bytes slab-off byte-off len)
        dst (js/Uint8Array. len)]
    (.set dst src)
    dst))

;;-----------------------------------------------------------------------------
;; Resolved-node access helpers
;;-----------------------------------------------------------------------------
;; After calling resolve-dv!/resolve-u8!, use these to read fields at
;; (resolved-dv, resolved-base + field-offset) without re-resolving.
;; Callers MUST call resolve-dv! or resolve-u8! before using these.

(defn- r-get-u8 ^number [^number off]
  (.getUint8 eve-alloc/resolved-dv (+ eve-alloc/resolved-base off)))

(defn- r-get-u32 ^number [^number off]
  (.getUint32 eve-alloc/resolved-dv (+ eve-alloc/resolved-base off) true))

(defn- r-get-i32 ^number [^number off]
  (.getInt32 eve-alloc/resolved-dv (+ eve-alloc/resolved-base off) true))

(defn- r-set-u8 [^number off ^number val]
  (.setUint8 eve-alloc/resolved-dv (+ eve-alloc/resolved-base off) val))

(defn- r-set-u16 [^number off ^number val]
  (.setUint16 eve-alloc/resolved-dv (+ eve-alloc/resolved-base off) val true))

(defn- r-set-u32 [^number off ^number val]
  (.setUint32 eve-alloc/resolved-dv (+ eve-alloc/resolved-base off) val true))

(defn- r-set-i32 [^number off ^number val]
  (.setInt32 eve-alloc/resolved-dv (+ eve-alloc/resolved-base off) val true))

;;-----------------------------------------------------------------------------
;; Low-level two-bitmap HAMT operations
;;
;; Node layout for bitmap nodes:
;; [type:u8][pad:u8][data_bitmap:u32][node_bitmap:u32][children...][values...]
;; - data_bitmap: which slots have inline values (popcount = # of inline values)
;; - node_bitmap: which slots have child node pointers (popcount = # of children)
;; - children: 4 bytes each, i32 slab-qualified offsets
;; - values: [len:u32][bytes...] for each inline value
;;
;; Collision node layout:
;; [type:u8][count:u8][hash:u32][unused:u32]
;; then count entries: [val_len:u32][val_bytes...]
;;-----------------------------------------------------------------------------

;; Use SIMD-accelerated popcount when available
(def ^:private popcount32 simd/popcount32)

(defn- read-node-type
  "Read node type byte from a slab-qualified offset."
  ^number [^number slab-off]
  (let [base (eve-alloc/resolve-dv! slab-off)]
    (.getUint8 eve-alloc/resolved-dv base)))

(defn- read-node-bitmap
  "Read node bitmap (u32 at offset+8)."
  ^number [^number slab-off]
  (let [base (eve-alloc/resolve-dv! slab-off)]
    (.getUint32 eve-alloc/resolved-dv (+ base 8) true)))

(defn- read-child-offset
  "Read child pointer (i32) at child-idx within a node.
   The child pointer is itself a slab-qualified offset."
  ^number [^number slab-off ^number child-idx]
  (let [base (eve-alloc/resolve-dv! slab-off)]
    (.getInt32 eve-alloc/resolved-dv (+ base NODE_HEADER_SIZE (* child-idx 4)) true)))

(defn- val-data-start
  "Calculate offset-within-node where value data starts for given node_bitmap."
  ^number [^number node-bm]
  (+ NODE_HEADER_SIZE (* 4 (popcount32 node-bm))))

(defn- has-data? [data-bm bit-pos]
  (not (zero? (bit-and data-bm (bit-shift-left 1 bit-pos)))))

(defn- has-node? [node-bm bit-pos]
  (not (zero? (bit-and node-bm (bit-shift-left 1 bit-pos)))))

(defn- get-data-idx [data-bm bit-pos]
  (popcount32 (bit-and data-bm (dec (bit-shift-left 1 bit-pos)))))

(defn- get-child-idx [node-bm bit-pos]
  (popcount32 (bit-and node-bm (dec (bit-shift-left 1 bit-pos)))))

;;-----------------------------------------------------------------------------
;; Value reading/writing helpers
;;-----------------------------------------------------------------------------

(defn- skip-val-at
  "Skip over a value entry at pos-in-node. Returns next pos-in-node."
  ^number [^number pos]
  (let [len (r-get-u32 pos)]
    (+ pos 4 len)))

(defn- read-val-at
  "Read a value from the given offset within a resolved node. Returns [value next-offset-in-node].
   Uses zero-copy deserialization — reads directly from the resolved DataView."
  [^number slab-off ^number val-off-in-node]
  (eve-alloc/resolve-u8! slab-off)
  (let [val-len (r-get-u32 val-off-in-node)
        val-start (+ val-off-in-node 4)
        val-bytes (copy-from-sab slab-off val-start val-len)
        val-val (ser/deserialize-element {} val-bytes)
        next-off (+ val-start val-len)]
    [val-val next-off]))

(defn- write-val!
  "Write a value at pos-in-node within a resolved node. Returns next pos-in-node after written data."
  ^number [^number pos ^js val-bytes]
  (let [val-len (.-length val-bytes)]
    (r-set-u32 pos val-len)
    (when (pos? val-len)
      (.set eve-alloc/resolved-u8 val-bytes (+ eve-alloc/resolved-base pos 4)))
    (+ pos 4 val-len)))

(defn- get-val-at-idx
  "Read value at data index within a bitmap node."
  [^number slab-off ^number data-bm ^number node-bm ^number idx]
  (let [vs (val-data-start node-bm)]
    (eve-alloc/resolve-u8! slab-off)
    (loop [i 0 pos vs]
      (if (== i idx)
        (let [[v _] (read-val-at slab-off pos)]
          v)
        (recur (inc i) (skip-val-at pos))))))

;;-----------------------------------------------------------------------------
;; Raw byte copying helpers for value data (no vector creation)
;;-----------------------------------------------------------------------------

(defn- calc-node-val-total-size
  "Calculate total bytes used by all values in a bitmap node."
  ^number [^number slab-off ^number data-bm ^number node-bm]
  (let [vs (val-data-start node-bm)
        val-count (popcount32 data-bm)]
    (eve-alloc/resolve-u8! slab-off)
    (loop [i 0 pos vs]
      (if (>= i val-count)
        (- pos vs)
        (recur (inc i) (skip-val-at pos))))))

;;-----------------------------------------------------------------------------
;; Optimized node creation with raw byte copying
;;-----------------------------------------------------------------------------

(defn- make-bitmap-node-with-raw-val!
  "Create bitmap node, copying value data directly from source node.
   If update-child-idx >= 0, replaces that child with new-child-off.
   Source and destination may be in different slabs."
  ([data-bm node-bm src-slab-off src-data-bm src-node-bm]
   (make-bitmap-node-with-raw-val! data-bm node-bm src-slab-off src-data-bm src-node-bm -1 eve-alloc/NIL_OFFSET))
  ([data-bm node-bm src-slab-off src-data-bm src-node-bm update-child-idx new-child-off]
   (let [child-count (popcount32 node-bm)
         existing-val-size (calc-node-val-total-size src-slab-off src-data-bm src-node-bm)
         node-size (+ NODE_HEADER_SIZE (* 4 child-count) existing-val-size)
         dst-slab-off (alloc-bytes! node-size)]
     ;; Write header
     (eve-alloc/resolve-u8! dst-slab-off)
     (r-set-u8 0 NODE_TYPE_BITMAP)
     (r-set-u8 1 0)
     (r-set-u16 2 0)
     (r-set-u32 4 data-bm)
     (r-set-u32 8 node-bm)
     ;; Write child offsets
     (dotimes [i child-count]
       (let [child-off (if (== i update-child-idx)
                         new-child-off
                         (eve-alloc/read-i32 src-slab-off (+ NODE_HEADER_SIZE (* i 4))))]
         (r-set-i32 (+ NODE_HEADER_SIZE (* i 4)) child-off)))
     ;; Copy value data from source
     (let [src-vs (val-data-start src-node-bm)
           dst-vs (val-data-start node-bm)]
       (when (pos? existing-val-size)
         (let [src-bytes (eve-alloc/read-bytes src-slab-off src-vs existing-val-size)]
           (eve-alloc/resolve-u8! dst-slab-off)
           (.set eve-alloc/resolved-u8 src-bytes (+ eve-alloc/resolved-base dst-vs)))))
     dst-slab-off)))

(defn- make-bitmap-node-with-added-val!
  "Create bitmap node adding a new inline value at insert-idx.
   Copies existing values from source and inserts new value."
  [new-data-bm new-node-bm src-slab-off src-data-bm src-node-bm insert-idx ^js vb]
  (let [src-child-count (popcount32 src-node-bm)
        dst-child-count (popcount32 new-node-bm)
        data-count (popcount32 src-data-bm)
        src-val-size (calc-node-val-total-size src-slab-off src-data-bm src-node-bm)
        new-val-size (+ 4 (.-length vb))
        node-size (+ NODE_HEADER_SIZE (* 4 dst-child-count) src-val-size new-val-size)
        dst-slab-off (alloc-bytes! node-size)]
    ;; Write header
    (eve-alloc/resolve-u8! dst-slab-off)
    (r-set-u8 0 NODE_TYPE_BITMAP)
    (r-set-u8 1 0)
    (r-set-u16 2 0)
    (r-set-u32 4 new-data-bm)
    (r-set-u32 8 new-node-bm)
    ;; Copy children (same as source)
    (dotimes [i src-child-count]
      (r-set-i32 (+ NODE_HEADER_SIZE (* i 4))
                 (eve-alloc/read-i32 src-slab-off (+ NODE_HEADER_SIZE (* i 4)))))
    ;; Read source value positions first
    (eve-alloc/resolve-u8! src-slab-off)
    (let [src-vs (val-data-start src-node-bm)
          positions (loop [i 0 pos src-vs acc #js []]
                      (if (>= i data-count)
                        acc
                        (let [next (skip-val-at pos)]
                          (.push acc #js [pos (- next pos)])
                          (recur (inc i) next acc))))]
      ;; Write values with insertion
      (eve-alloc/resolve-u8! dst-slab-off)
      (let [dst-vs (val-data-start new-node-bm)]
        (loop [src-i 0 dst-pos dst-vs inserted? false]
          (let [dst-i (+ src-i (if inserted? 1 0))]
            (cond
              (and (== src-i insert-idx) (not inserted?))
              ;; Insert new value here
              (let [next-dst (write-val! dst-pos vb)]
                (recur src-i next-dst true))

              (>= src-i data-count)
              ;; Done with source, insert at end if not yet inserted
              (when-not inserted?
                (write-val! dst-pos vb))

              :else
              ;; Copy existing value
              (let [entry (aget positions src-i)
                    src-pos (aget entry 0)
                    val-len (aget entry 1)
                    src-bytes (eve-alloc/read-bytes src-slab-off src-pos val-len)]
                (eve-alloc/resolve-u8! dst-slab-off)
                (.set eve-alloc/resolved-u8 src-bytes (+ eve-alloc/resolved-base dst-pos))
                (recur (inc src-i) (+ dst-pos val-len) inserted?)))))))
    dst-slab-off))

(defn- make-bitmap-node-removing-val!
  "Create bitmap node with value at remove-idx removed, optionally inserting a new child."
  ([new-data-bm new-node-bm src-slab-off src-data-bm src-node-bm remove-idx]
   (make-bitmap-node-removing-val! new-data-bm new-node-bm src-slab-off src-data-bm src-node-bm remove-idx -1 eve-alloc/NIL_OFFSET))
  ([new-data-bm new-node-bm src-slab-off src-data-bm src-node-bm remove-idx insert-child-idx new-child-off]
   (let [src-child-count (popcount32 src-node-bm)
         dst-child-count (popcount32 new-node-bm)
         data-count (popcount32 src-data-bm)
         ;; Calculate size - one fewer value, possibly one more child
         src-val-size (calc-node-val-total-size src-slab-off src-data-bm src-node-bm)
         ;; Find size of removed value
         _ (eve-alloc/resolve-u8! src-slab-off)
         removed-val-size (let [vs (val-data-start src-node-bm)]
                            (loop [i 0 pos vs]
                              (if (== i remove-idx)
                                (- (skip-val-at pos) pos)
                                (recur (inc i) (skip-val-at pos)))))
         new-val-size (- src-val-size removed-val-size)
         node-size (+ NODE_HEADER_SIZE (* 4 dst-child-count) new-val-size)
         dst-slab-off (alloc-bytes! node-size)]
     ;; Write header
     (eve-alloc/resolve-u8! dst-slab-off)
     (r-set-u8 0 NODE_TYPE_BITMAP)
     (r-set-u8 1 0)
     (r-set-u16 2 0)
     (r-set-u32 4 new-data-bm)
     (r-set-u32 8 new-node-bm)
     ;; Copy children with optional insertion
     (if (>= insert-child-idx 0)
       ;; Insert new child
       (loop [src-i 0 dst-i 0]
         (cond
           (>= dst-i dst-child-count) nil  ;; done
           (== dst-i insert-child-idx)
           (do (r-set-i32 (+ NODE_HEADER_SIZE (* dst-i 4)) new-child-off)
               (recur src-i (inc dst-i)))
           :else
           (do (r-set-i32 (+ NODE_HEADER_SIZE (* dst-i 4))
                          (eve-alloc/read-i32 src-slab-off (+ NODE_HEADER_SIZE (* src-i 4))))
               (recur (inc src-i) (inc dst-i)))))
       ;; Copy children unchanged
       (dotimes [i src-child-count]
         (r-set-i32 (+ NODE_HEADER_SIZE (* i 4))
                    (eve-alloc/read-i32 src-slab-off (+ NODE_HEADER_SIZE (* i 4))))))
     ;; Copy values, skipping removed one
     (eve-alloc/resolve-u8! src-slab-off)
     (let [src-vs (val-data-start src-node-bm)
           positions (loop [i 0 pos src-vs acc #js []]
                       (if (>= i data-count)
                         acc
                         (let [next (skip-val-at pos)]
                           (.push acc #js [pos (- next pos)])
                           (recur (inc i) next acc))))]
       (eve-alloc/resolve-u8! dst-slab-off)
       (let [dst-vs (val-data-start new-node-bm)]
         (loop [i 0 dst-pos dst-vs]
           (when (< i data-count)
             (let [entry (aget positions i)
                   src-pos (aget entry 0)
                   val-len (aget entry 1)]
               (if (== i remove-idx)
                 ;; Skip this value
                 (recur (inc i) dst-pos)
                 ;; Copy this value
                 (let [src-bytes (eve-alloc/read-bytes src-slab-off src-pos val-len)]
                   (eve-alloc/resolve-u8! dst-slab-off)
                   (.set eve-alloc/resolved-u8 src-bytes (+ eve-alloc/resolved-base dst-pos))
                   (recur (inc i) (+ dst-pos val-len)))))))))
     dst-slab-off)))

(defn- make-bitmap-node-removing-child!
  "Create bitmap node with a child removed (for disj)."
  [data-bm new-node-bm src-slab-off src-data-bm src-node-bm remove-child-idx]
  (let [src-child-count (popcount32 src-node-bm)
        dst-child-count (popcount32 new-node-bm)
        val-size (calc-node-val-total-size src-slab-off src-data-bm src-node-bm)
        node-size (+ NODE_HEADER_SIZE (* 4 dst-child-count) val-size)
        dst-slab-off (alloc-bytes! node-size)]
    ;; Write header
    (eve-alloc/resolve-u8! dst-slab-off)
    (r-set-u8 0 NODE_TYPE_BITMAP)
    (r-set-u8 1 0)
    (r-set-u16 2 0)
    (r-set-u32 4 data-bm)
    (r-set-u32 8 new-node-bm)
    ;; Copy children, skipping removed one
    (loop [src-i 0 dst-i 0]
      (when (< src-i src-child-count)
        (if (== src-i remove-child-idx)
          (recur (inc src-i) dst-i)
          (do (r-set-i32 (+ NODE_HEADER_SIZE (* dst-i 4))
                         (eve-alloc/read-i32 src-slab-off (+ NODE_HEADER_SIZE (* src-i 4))))
              (recur (inc src-i) (inc dst-i))))))
    ;; Copy all value data
    (let [src-vs (val-data-start src-node-bm)
          dst-vs (val-data-start new-node-bm)]
      (when (pos? val-size)
        (let [src-bytes (eve-alloc/read-bytes src-slab-off src-vs val-size)]
          (eve-alloc/resolve-u8! dst-slab-off)
          (.set eve-alloc/resolved-u8 src-bytes (+ eve-alloc/resolved-base dst-vs)))))
    dst-slab-off))

(defn- make-single-val-bitmap-node!
  "Create a bitmap node with single inline value."
  [bit-pos ^js vb]
  (let [data-bm (bit-shift-left 1 bit-pos)
        val-len (.-length vb)
        node-size (+ NODE_HEADER_SIZE 4 val-len)  ;; header + val len + val bytes
        slab-off (alloc-bytes! node-size)]
    (eve-alloc/resolve-u8! slab-off)
    (r-set-u8 0 NODE_TYPE_BITMAP)
    (r-set-u8 1 0)
    (r-set-u16 2 0)
    (r-set-u32 4 data-bm)  ;; data_bitmap
    (r-set-u32 8 0)        ;; node_bitmap = 0
    ;; Write value (no children)
    (r-set-u32 NODE_HEADER_SIZE val-len)
    (when (pos? val-len)
      (.set eve-alloc/resolved-u8 vb (+ eve-alloc/resolved-base NODE_HEADER_SIZE 4)))
    slab-off))

(defn- make-two-val-bitmap-node!
  "Create a bitmap node with two inline values at different bit positions."
  [bit-pos1 ^js vb1 bit-pos2 ^js vb2]
  (let [;; Order by bit position
        [first-bpos first-vb second-bpos second-vb]
        (if (< bit-pos1 bit-pos2)
          [bit-pos1 vb1 bit-pos2 vb2]
          [bit-pos2 vb2 bit-pos1 vb1])
        data-bm (bit-or (bit-shift-left 1 first-bpos) (bit-shift-left 1 second-bpos))
        val1-len (.-length first-vb)
        val2-len (.-length second-vb)
        node-size (+ NODE_HEADER_SIZE 4 val1-len 4 val2-len)
        slab-off (alloc-bytes! node-size)]
    (eve-alloc/resolve-u8! slab-off)
    (r-set-u8 0 NODE_TYPE_BITMAP)
    (r-set-u8 1 0)
    (r-set-u16 2 0)
    (r-set-u32 4 data-bm)
    (r-set-u32 8 0)  ;; node_bitmap = 0
    ;; Write first value
    (let [pos1 NODE_HEADER_SIZE]
      (r-set-u32 pos1 val1-len)
      (when (pos? val1-len)
        (.set eve-alloc/resolved-u8 first-vb (+ eve-alloc/resolved-base pos1 4)))
      ;; Write second value
      (let [pos2 (+ pos1 4 val1-len)]
        (r-set-u32 pos2 val2-len)
        (when (pos? val2-len)
          (.set eve-alloc/resolved-u8 second-vb (+ eve-alloc/resolved-base pos2 4)))))
    slab-off))

(defn- make-collision-node!
  "Create a collision node for values with same hash."
  [hash-val val-bytes-seq]
  (let [cnt (count val-bytes-seq)
        ;; Calculate total size
        entries-size (reduce (fn [acc vb] (+ acc 4 (.-length vb))) 0 val-bytes-seq)
        node-size (+ NODE_HEADER_SIZE entries-size)
        slab-off (alloc-bytes! node-size)]
    (eve-alloc/resolve-u8! slab-off)
    (r-set-u8 0 NODE_TYPE_COLLISION)
    (r-set-u8 1 cnt)
    (r-set-u32 2 hash-val)
    (r-set-u32 8 0)  ;; unused
    ;; Write entries
    (loop [vs (seq val-bytes-seq) pos NODE_HEADER_SIZE]
      (when vs
        (let [vb (first vs)
              vlen (.-length vb)]
          (r-set-u32 pos vlen)
          (when (pos? vlen)
            (.set eve-alloc/resolved-u8 vb (+ eve-alloc/resolved-base pos 4)))
          (recur (next vs) (+ pos 4 vlen)))))
    slab-off))

;;-----------------------------------------------------------------------------
;; HAMT lookup
;;-----------------------------------------------------------------------------

(defn- hamt-find
  "Look up value in HAMT. Returns found?."
  [root-off v vh shift]
  (if (== root-off eve-alloc/NIL_OFFSET)
    false
    (let [node-type (read-node-type root-off)]
      (case node-type
        ;; Bitmap node
        1 (let [base (eve-alloc/resolve-dv! root-off)
                data-bm (.getUint32 eve-alloc/resolved-dv (+ base 4) true)
                node-bm (.getUint32 eve-alloc/resolved-dv (+ base 8) true)
                bit-pos (bit-and (unsigned-bit-shift-right vh shift) MASK)]
            (cond
              ;; Check inline value first
              (has-data? data-bm bit-pos)
              (let [idx (get-data-idx data-bm bit-pos)
                    found-v (get-val-at-idx root-off data-bm node-bm idx)]
                (= v found-v))

              ;; Check child node
              (has-node? node-bm bit-pos)
              (let [idx (get-child-idx node-bm bit-pos)
                    child-off (read-child-offset root-off idx)]
                (recur child-off v vh (+ shift SHIFT_STEP)))

              ;; Not found
              :else false))

        ;; Collision node
        2 (let [base (eve-alloc/resolve-u8! root-off)
                cnt (r-get-u8 1)]
            (loop [i 0 pos NODE_HEADER_SIZE]
              (if (>= i cnt)
                false
                (let [[entry-v next-pos] (read-val-at root-off pos)]
                  (if (= v entry-v)
                    true
                    (recur (inc i) next-pos))))))

        ;; Unknown
        false))))

;;-----------------------------------------------------------------------------
;; HAMT conj (persistent)
;;-----------------------------------------------------------------------------

;; Module-level mutable flags to eliminate CLJS vector allocation per hamt-conj/disj call.
(def ^:private ^:mutable hamt-conj-added? false)
(def ^:private ^:mutable hamt-disj-removed? false)

(defn- hamt-conj
  "Add value to HAMT. Returns new-root-off (slab-qualified offset).
   Sets hamt-conj-added? to true if new value, false otherwise."
  [root-off v vh vb shift]
  (if (== root-off eve-alloc/NIL_OFFSET)
    ;; Empty -> create single-value bitmap node
    (let [bit-pos (bit-and (unsigned-bit-shift-right vh shift) MASK)]
      (set! hamt-conj-added? true)
      (make-single-val-bitmap-node! bit-pos vb))
    (let [node-type (read-node-type root-off)]
      (case node-type
        ;; Bitmap node
        1 (let [base (eve-alloc/resolve-dv! root-off)
                data-bm (.getUint32 eve-alloc/resolved-dv (+ base 4) true)
                node-bm (.getUint32 eve-alloc/resolved-dv (+ base 8) true)
                bit-pos (bit-and (unsigned-bit-shift-right vh shift) MASK)]
            (cond
              ;; Slot has inline value
              (has-data? data-bm bit-pos)
              (let [idx (get-data-idx data-bm bit-pos)
                    existing-v (get-val-at-idx root-off data-bm node-bm idx)]
                (if (= v existing-v)
                  ;; Already in set
                  (do (set! hamt-conj-added? false) root-off)
                  ;; Need to split: remove inline, add child node
                  (let [existing-vb (ser/serialize-val existing-v)
                        existing-vh (hash existing-v)]
                    (if (== existing-vh vh)
                      ;; Hash collision -> create collision node as child
                      (let [collision-off (make-collision-node! vh [existing-vb vb])
                            new-data-bm (bit-xor data-bm (bit-shift-left 1 bit-pos))
                            new-node-bm (bit-or node-bm (bit-shift-left 1 bit-pos))
                            child-idx (get-child-idx new-node-bm bit-pos)]
                        (set! hamt-conj-added? true)
                        (make-bitmap-node-removing-val! new-data-bm new-node-bm
                                                         root-off data-bm node-bm idx
                                                         child-idx collision-off))
                      ;; Different hashes -> recurse to split
                      (let [new-child-off (let [bp1 (bit-and (unsigned-bit-shift-right existing-vh (+ shift SHIFT_STEP)) MASK)
                                                bp2 (bit-and (unsigned-bit-shift-right vh (+ shift SHIFT_STEP)) MASK)]
                                            (if (== bp1 bp2)
                                              ;; Same position at next level, need deeper split
                                              (let [sub (hamt-conj
                                                          (make-single-val-bitmap-node! bp1 existing-vb)
                                                          v vh vb (+ shift SHIFT_STEP SHIFT_STEP))]
                                                sub)
                                              ;; Different positions -> two-value node
                                              (make-two-val-bitmap-node! bp1 existing-vb bp2 vb)))
                            new-data-bm (bit-xor data-bm (bit-shift-left 1 bit-pos))
                            new-node-bm (bit-or node-bm (bit-shift-left 1 bit-pos))
                            child-idx (get-child-idx new-node-bm bit-pos)]
                        (set! hamt-conj-added? true)
                        (make-bitmap-node-removing-val! new-data-bm new-node-bm
                                                         root-off data-bm node-bm idx
                                                         child-idx new-child-off))))))

              ;; Slot has child node
              (has-node? node-bm bit-pos)
              (let [child-idx (get-child-idx node-bm bit-pos)
                    child-off (read-child-offset root-off child-idx)
                    new-child-off (hamt-conj child-off v vh vb (+ shift SHIFT_STEP))]
                ;; hamt-conj-added? set by recursive call
                (if-not hamt-conj-added?
                  root-off
                  ;; Child was modified
                  (make-bitmap-node-with-raw-val! data-bm node-bm
                                                   root-off data-bm node-bm
                                                   child-idx new-child-off)))

              ;; Empty slot -> add inline value
              :else
              (let [new-data-bm (bit-or data-bm (bit-shift-left 1 bit-pos))
                    insert-idx (get-data-idx new-data-bm bit-pos)]
                (set! hamt-conj-added? true)
                (make-bitmap-node-with-added-val! new-data-bm node-bm
                                                   root-off data-bm node-bm
                                                   insert-idx vb))))

        ;; Collision node
        2 (let [base (eve-alloc/resolve-u8! root-off)
                node-hash (r-get-u32 2)
                cnt (r-get-u8 1)]
            (if (== vh node-hash)
              ;; Same hash -> check if already present or add
              (loop [i 0 pos NODE_HEADER_SIZE val-bytes-list []]
                (if (>= i cnt)
                  ;; Value not found -> add new entry
                  (let [all-vals (conj val-bytes-list vb)]
                    (set! hamt-conj-added? true)
                    (make-collision-node! vh all-vals))
                  (let [_ (eve-alloc/resolve-u8! root-off)
                        val-len (r-get-u32 pos)
                        val-bytes (copy-from-sab root-off (+ pos 4) val-len)
                        entry-v (ser/deserialize-element {} val-bytes)
                        next-pos (+ pos 4 val-len)]
                    (if (= v entry-v)
                      ;; Already in set
                      (do (set! hamt-conj-added? false) root-off)
                      ;; Continue searching
                      (recur (inc i) next-pos (conj val-bytes-list val-bytes))))))
              ;; Different hash -> split into internal node
              (let [bit-pos1 (bit-and (unsigned-bit-shift-right node-hash shift) MASK)
                    bit-pos2 (bit-and (unsigned-bit-shift-right vh shift) MASK)]
                (if (== bit-pos1 bit-pos2)
                  ;; Same bit position -> recurse
                  (let [sub-node (hamt-conj root-off v vh vb (+ shift SHIFT_STEP))
                        ;; hamt-conj-added? set by recursive call
                        node-bm (bit-shift-left 1 bit-pos1)
                        slab-off (alloc-bytes! (+ NODE_HEADER_SIZE 4))]
                    (eve-alloc/resolve-u8! slab-off)
                    (r-set-u8 0 NODE_TYPE_BITMAP)
                    (r-set-u8 1 0)
                    (r-set-u16 2 0)        ;; pad
                    (r-set-u32 4 0)        ;; data_bitmap = 0
                    (r-set-u32 8 node-bm)  ;; node_bitmap
                    (r-set-i32 NODE_HEADER_SIZE sub-node)
                    slab-off)
                  ;; Different positions -> collision + new value
                  (let [new-val-off (make-single-val-bitmap-node! bit-pos2 vb)
                        node-bm (bit-or (bit-shift-left 1 bit-pos1) (bit-shift-left 1 bit-pos2))
                        slab-off (alloc-bytes! (+ NODE_HEADER_SIZE 8))]
                    (eve-alloc/resolve-u8! slab-off)
                    (r-set-u8 0 NODE_TYPE_BITMAP)
                    (r-set-u8 1 0)
                    (r-set-u16 2 0)        ;; pad
                    (r-set-u32 4 0)        ;; data_bitmap = 0
                    (r-set-u32 8 node-bm)  ;; node_bitmap
                    ;; Order children by bit position
                    (if (< bit-pos1 bit-pos2)
                      (do (r-set-i32 NODE_HEADER_SIZE root-off)
                          (r-set-i32 (+ NODE_HEADER_SIZE 4) new-val-off))
                      (do (r-set-i32 NODE_HEADER_SIZE new-val-off)
                          (r-set-i32 (+ NODE_HEADER_SIZE 4) root-off)))
                    (set! hamt-conj-added? true)
                    slab-off)))))

        ;; Unknown
        (do (set! hamt-conj-added? false) root-off)))))

;;-----------------------------------------------------------------------------
;; HAMT disj (persistent)
;;-----------------------------------------------------------------------------

(defn- hamt-disj
  "Remove value from HAMT. Returns new-root-off (slab-qualified offset).
   Sets hamt-disj-removed? to true if value was removed, false otherwise."
  [root-off v vh shift]
  (if (== root-off eve-alloc/NIL_OFFSET)
    (do (set! hamt-disj-removed? false) eve-alloc/NIL_OFFSET)
    (let [node-type (read-node-type root-off)]
      (case node-type
        ;; Bitmap node
        1 (let [base (eve-alloc/resolve-dv! root-off)
                data-bm (.getUint32 eve-alloc/resolved-dv (+ base 4) true)
                node-bm (.getUint32 eve-alloc/resolved-dv (+ base 8) true)
                bit-pos (bit-and (unsigned-bit-shift-right vh shift) MASK)]
            (cond
              ;; Check inline value
              (has-data? data-bm bit-pos)
              (let [idx (get-data-idx data-bm bit-pos)
                    found-v (get-val-at-idx root-off data-bm node-bm idx)]
                (if-not (= v found-v)
                  (do (set! hamt-disj-removed? false) root-off)
                  ;; Remove this inline value
                  (let [new-data-bm (bit-xor data-bm (bit-shift-left 1 bit-pos))
                        total-entries (+ (popcount32 new-data-bm) (popcount32 node-bm))]
                    (set! hamt-disj-removed? true)
                    (if (zero? total-entries)
                      ;; Node becomes empty
                      eve-alloc/NIL_OFFSET
                      ;; Remove value from node
                      (make-bitmap-node-removing-val! new-data-bm node-bm
                                                       root-off data-bm node-bm idx)))))

              ;; Check child node
              (has-node? node-bm bit-pos)
              (let [child-idx (get-child-idx node-bm bit-pos)
                    child-off (read-child-offset root-off child-idx)
                    new-child (hamt-disj child-off v vh (+ shift SHIFT_STEP))]
                ;; hamt-disj-removed? set by recursive call
                (if-not hamt-disj-removed?
                  root-off
                  (if (== new-child eve-alloc/NIL_OFFSET)
                    ;; Child was removed entirely
                    (let [new-node-bm (bit-xor node-bm (bit-shift-left 1 bit-pos))
                          total-entries (+ (popcount32 data-bm) (popcount32 new-node-bm))]
                      (if (zero? total-entries)
                        eve-alloc/NIL_OFFSET
                        (make-bitmap-node-removing-child! data-bm new-node-bm
                                                           root-off data-bm node-bm child-idx)))
                    ;; Child was modified
                    (make-bitmap-node-with-raw-val! data-bm node-bm
                                                     root-off data-bm node-bm
                                                     child-idx new-child))))

              ;; Not found
              :else (do (set! hamt-disj-removed? false) root-off)))

        ;; Collision node
        2 (let [base (eve-alloc/resolve-u8! root-off)
                cnt (r-get-u8 1)
                node-hash (r-get-u32 2)]
            (loop [i 0 pos NODE_HEADER_SIZE val-bytes-list []]
              (if (>= i cnt)
                ;; Value not found
                (do (set! hamt-disj-removed? false) root-off)
                (let [_ (eve-alloc/resolve-u8! root-off)
                      val-len (r-get-u32 pos)
                      val-bytes (copy-from-sab root-off (+ pos 4) val-len)
                      entry-v (ser/deserialize-element {} val-bytes)
                      next-pos (+ pos 4 val-len)]
                  (if (= v entry-v)
                    ;; Found - remove it
                    (let [rest-vals (loop [j (inc i) p next-pos acc []]
                                      (if (>= j cnt)
                                        acc
                                        (let [_ (eve-alloc/resolve-u8! root-off)
                                              vl (r-get-u32 p)
                                              vbytes (copy-from-sab root-off (+ p 4) vl)]
                                          (recur (inc j) (+ p 4 vl) (conj acc vbytes)))))
                          all-remaining (into val-bytes-list rest-vals)]
                      (set! hamt-disj-removed? true)
                      (cond
                        (empty? all-remaining) eve-alloc/NIL_OFFSET
                        (== 1 (count all-remaining))
                        ;; Convert to single-value bitmap node
                        (let [vb (first all-remaining)
                              bp (bit-and (unsigned-bit-shift-right node-hash shift) MASK)]
                          (make-single-val-bitmap-node! bp vb))
                        :else
                        (make-collision-node! node-hash all-remaining)))
                    ;; Continue searching
                    (recur (inc i) next-pos (conj val-bytes-list val-bytes)))))))

        ;; Unknown
        (do (set! hamt-disj-removed? false) root-off)))))

;;-----------------------------------------------------------------------------
;; Streaming reduce (direct tree walk, no materialization)
;;-----------------------------------------------------------------------------

(defn- hamt-val-reduce
  "Walk HAMT tree directly, calling (f acc v) at each value.
   Supports reduced? for early termination."
  [^number offset f init]
  (if (== offset eve-alloc/NIL_OFFSET)
    init
    (let [node-type (read-node-type offset)]
      (case node-type
        ;; Bitmap node
        1 (let [base (eve-alloc/resolve-dv! offset)
                data-bm (.getUint32 eve-alloc/resolved-dv (+ base 4) true)
                node-bm (.getUint32 eve-alloc/resolved-dv (+ base 8) true)
                data-count (popcount32 data-bm)
                vs (val-data-start node-bm)
                ;; Reduce over inline values
                acc-after-data
                (loop [i 0 pos vs acc init]
                  (if (or (>= i data-count) (reduced? acc))
                    acc
                    (let [[v next-pos] (read-val-at offset pos)]
                      (recur (inc i) next-pos (f acc v)))))
                child-count (popcount32 node-bm)]
            (if (reduced? acc-after-data)
              acc-after-data
              ;; Reduce over children
              (loop [i 0 acc acc-after-data]
                (if (or (>= i child-count) (reduced? acc))
                  acc
                  (let [child-off (read-child-offset offset i)]
                    (recur (inc i) (hamt-val-reduce child-off f acc)))))))

        ;; Collision node
        2 (let [base (eve-alloc/resolve-u8! offset)
                cnt (r-get-u8 1)]
            (loop [i 0 pos NODE_HEADER_SIZE acc init]
              (if (or (>= i cnt) (reduced? acc))
                acc
                (let [[v next-pos] (read-val-at offset pos)]
                  (recur (inc i) next-pos (f acc v))))))

        init))))

;;-----------------------------------------------------------------------------
;; HAMT seq
;;-----------------------------------------------------------------------------

(defn- hamt-seq
  "Return lazy seq of values from HAMT."
  [root-off]
  (when (not= root-off eve-alloc/NIL_OFFSET)
    ((fn walk [off]
       (lazy-seq
        (when (not= off eve-alloc/NIL_OFFSET)
          (let [node-type (read-node-type off)]
            (case node-type
              ;; Bitmap node
              1 (let [base (eve-alloc/resolve-dv! off)
                      data-bm (.getUint32 eve-alloc/resolved-dv (+ base 4) true)
                      node-bm (.getUint32 eve-alloc/resolved-dv (+ base 8) true)
                      data-count (popcount32 data-bm)
                      child-count (popcount32 node-bm)
                      ;; Inline values first
                      inline-vals (when (pos? data-count)
                                    (loop [i 0 pos (val-data-start node-bm) result []]
                                      (if (>= i data-count)
                                        result
                                        (let [[v next-pos] (read-val-at off pos)]
                                          (recur (inc i) next-pos (conj result v))))))
                      ;; Then children
                      child-vals (when (pos? child-count)
                                   (mapcat (fn [i]
                                             (walk (read-child-offset off i)))
                                           (range child-count)))]
                  (concat inline-vals child-vals))

              ;; Collision node
              2 (let [base (eve-alloc/resolve-u8! off)
                      cnt (r-get-u8 1)]
                  (loop [i 0 pos NODE_HEADER_SIZE result []]
                    (if (>= i cnt)
                      result
                      (let [[v next-pos] (read-val-at off pos)]
                        (recur (inc i) next-pos (conj result v))))))

              ;; Unknown
              nil)))))
     root-off)))

;;-----------------------------------------------------------------------------
;; EveHashSet header — slab-allocated 12-byte block
;;-----------------------------------------------------------------------------
;; In the slab version, EveHashSet stores cnt and root-off as JS properties
;; plus a header-off slab-qualified offset to a 12-byte header block for
;; serialization (encode-sab-pointer).
;;
;; Header layout: [type-id:u8 | pad:3 | cnt:i32 | root-off:i32]

(def ^:const SABSETROOT_CNT_OFFSET 4)
(def ^:const SABSETROOT_ROOT_OFF_OFFSET 8)
(def ^:const EveHashSet-type-id 0xEE)

(defn- make-eve-hash-set
  "Create a EveHashSet, allocating a 12-byte header block in the slab.
   The header stores: [type-id:u8 | pad:3 | cnt:i32 | root-off:i32]."
  [cnt root-off]
  (let [header-off (alloc-bytes! 12)]
    (eve-alloc/resolve-u8! header-off)
    (r-set-u8 0 EveHashSet-type-id)
    (r-set-u8 1 0) (r-set-u8 2 0) (r-set-u8 3 0)
    (r-set-i32 SABSETROOT_CNT_OFFSET cnt)
    (r-set-i32 SABSETROOT_ROOT_OFF_OFFSET root-off)
    (EveHashSet. cnt root-off header-off nil nil)))

(defn- make-eve-hash-set-from-header
  "Reconstruct a EveHashSet from an existing header slab-qualified offset.
   Reads cnt and root-off from the header block."
  [header-off]
  (eve-alloc/resolve-u8! header-off)
  (let [cnt (r-get-i32 SABSETROOT_CNT_OFFSET)
        root-off (r-get-i32 SABSETROOT_ROOT_OFF_OFFSET)]
    (EveHashSet. cnt root-off header-off nil nil)))

;;-----------------------------------------------------------------------------
;; EveHashSet - persistent set handle
;;-----------------------------------------------------------------------------

(deftype EveHashSet [cnt root-off header-off
                     ^:mutable _modified_khs
                     ^:mutable __hash]

  IMeta
  (-meta [_] nil)

  IWithMeta
  (-with-meta [this _new-meta] this)

  ICounted
  (-count [_] cnt)

  ILookup
  (-lookup [this v] (-lookup this v nil))
  (-lookup [_ v not-found]
    (let [vh (hash v)]
      (if (hamt-find root-off v vh 0)
        v
        not-found)))

  ICollection
  (-conj [this v]
    (let [vb (ser/serialize-key v)
          vh (hash v)
          new-root (hamt-conj root-off v vh vb 0)]
      (if hamt-conj-added?
        (let [new-set (make-eve-hash-set (inc cnt) new-root)
              parent-khs (.-_modified_khs this)
              parent-len (if parent-khs (.-length parent-khs) 0)]
          (when (<= parent-len 8)
            (let [khs (if (and parent-khs (pos? parent-len)) (.slice parent-khs 0) #js [])]
              (.push khs vh)
              (set! (.-_modified_khs new-set) khs)))
          new-set)
        this)))

  IEmptyableCollection
  (-empty [_] (empty-hash-set))

  ISet
  (-disjoin [this v]
    (let [vh (hash v)
          new-root (hamt-disj root-off v vh 0)]
      (if hamt-disj-removed?
        (if (== new-root eve-alloc/NIL_OFFSET)
          (empty-hash-set)
          (let [new-set (make-eve-hash-set (dec cnt) new-root)
                parent-khs (.-_modified_khs this)
                parent-len (if parent-khs (.-length parent-khs) 0)]
            (when (<= parent-len 8)
              (let [khs (if (and parent-khs (pos? parent-len)) (.slice parent-khs 0) #js [])]
                (.push khs vh)
                (set! (.-_modified_khs new-set) khs)))
            new-set))
        this)))

  ISeqable
  (-seq [_]
    (when (pos? cnt)
      (hamt-seq root-off)))

  IEquiv
  (-equiv [this other]
    (and (set? other)
         (== cnt (count other))
         (every? (fn [v]
                   (hamt-find root-off v (hash v) 0))
                 other)))

  IFn
  (-invoke [this v] (-lookup this v nil))
  (-invoke [this v not-found] (-lookup this v not-found))

  IHash
  (-hash [this]
    (if __hash
      __hash
      (let [h (hash-unordered-coll (seq this))]
        (set! __hash h) h)))

  IReduce
  (-reduce [this f]
    (if (zero? cnt)
      (f)
      (let [;; Get first value and reduce from there
            first-val (first (seq this))
            result (hamt-val-reduce root-off
                                    (fn [acc v]
                                      (if (identical? v first-val)
                                        acc  ;; Skip first value
                                        (f acc v)))
                                    first-val)]
        (if (reduced? result) @result result))))
  (-reduce [this f init]
    (let [result (hamt-val-reduce root-off f init)]
      (if (reduced? result) @result result)))

  IPrintWithWriter
  (-pr-writer [this writer opts]
    (let [values (take 10 (seq this))]
      (-write writer "#{")
      (doseq [[i v] (map-indexed vector values)]
        (when (pos? i) (-write writer " "))
        (-write writer (pr-str v)))
      (when (> cnt 10)
        (-write writer " ..."))
      (-write writer "}")))

  IEditableCollection
  (-as-transient [this]
    (->TransientEveHashSet root-off this root-off cnt (js/Object.)))

  d/IDirectSerialize
  (-direct-serialize [this]
    (ser/encode-sab-pointer ser/FAST_TAG_SAB_SET header-off))

  d/ISabStorable
  (-sab-tag [_] :hash-set)
  (-sab-encode [this _slab-env]
    (d/-direct-serialize this))
  (-sab-dispose [this _slab-env]
    (when (not= root-off eve-alloc/NIL_OFFSET)
      (free-hamt-node! root-off))
    ;; Free the header block
    (when (not= header-off eve-alloc/NIL_OFFSET)
      (eve-alloc/free! header-off)))

  d/IsEve
  (-eve? [_] true)

  d/ISabRetirable
  (-sab-retire-diff! [this new-value _slab-env mode]
    (let [old-root root-off]
      (if (instance? EveHashSet new-value)
        (let [new-root-off (.-root-off new-value)
              modified-khs (.-_modified_khs new-value)]
          (if (and modified-khs (pos? (.-length modified-khs)) (<= (.-length modified-khs) 8))
            ;; Fast path: retire via hash-directed path walk for each modified key
            (dotimes [i (.-length modified-khs)]
              (retire-replaced-path! old-root new-root-off (aget modified-khs i)))
            ;; Fallback: full tree diff for bulk operations
            (retire-tree-diff! old-root new-root-off)))
        (when (not= old-root eve-alloc/NIL_OFFSET)
          (free-hamt-node! old-root)))
      ;; Free the header block
      (when (not= header-off eve-alloc/NIL_OFFSET)
        (eve-alloc/free! header-off)))))

;;-----------------------------------------------------------------------------
;; TransientEveHashSet - mutable set for batch operations
;;-----------------------------------------------------------------------------

(deftype TransientEveHashSet [initial-root-off
                           original-persistent
                           ^:mutable root-offset
                           ^:mutable cnt
                           ^:mutable edit]
  ICounted
  (-count [_] cnt)

  ILookup
  (-lookup [this v] (-lookup this v nil))
  (-lookup [_ v not-found]
    (when-not edit (throw (js/Error. "Transient used after persistent!")))
    (let [vh (hash v)]
      (if (hamt-find root-offset v vh 0)
        v
        not-found)))

  ITransientCollection
  (-conj! [this v]
    (when-not edit (throw (js/Error. "Transient used after persistent!")))
    (let [vb (ser/serialize-key v)
          vh (hash v)
          new-root (hamt-conj root-offset v vh vb 0)]
      (set! root-offset new-root)
      (when hamt-conj-added? (set! cnt (inc cnt)))
      this))
  (-persistent! [_]
    (when-not edit (throw (js/Error. "Transient used after persistent!")))
    (set! edit nil)
    (if (== root-offset initial-root-off)
      ;; No-op transient round-trip: return original persistent set
      original-persistent
      (make-eve-hash-set cnt root-offset)))

  ITransientSet
  (-disjoin! [this v]
    (when-not edit (throw (js/Error. "Transient used after persistent!")))
    (let [vh (hash v)
          new-root (hamt-disj root-offset v vh 0)]
      (set! root-offset new-root)
      (when hamt-disj-removed? (set! cnt (dec cnt)))
      this)))

;;-----------------------------------------------------------------------------
;; Disposal - explicit cleanup for reclaiming slab memory
;;-----------------------------------------------------------------------------

(defn dispose!
  "Dispose a EveHashSet, freeing its entire HAMT tree and header block.
   Call this when the set is no longer needed to reclaim slab memory.

   WARNING: After disposal, the set must not be used. Any access will
   result in undefined behavior or errors."
  [^js hash-set]
  (let [root-off (.-root-off hash-set)
        header-off (.-header-off hash-set)]
    (when (not= root-off eve-alloc/NIL_OFFSET)
      (free-hamt-node! root-off))
    (when (not= header-off eve-alloc/NIL_OFFSET)
      (let [size (node-size-for-free header-off)]
        (if (pos? size)
          (maybe-pool-or-free! header-off size)
          (eve-alloc/free! header-off))))))

(defn retire-replaced-path!
  "After an atom swap that replaced old-root with new-root, free the old
   path nodes that are no longer referenced by the new tree.

   Walks both trees following the hash bits for value hash vh. At each level
   where old-node != new-node, the old node is freed or pooled.

   Only retires individual path nodes -- shared subtrees are untouched.

   vh: the hash of the value that was modified"
  [old-root new-root vh]
  (when (and (not= old-root eve-alloc/NIL_OFFSET) (not= old-root new-root))
    (loop [old-off old-root
           new-off new-root
           sh 0]
      (when (and (not= old-off eve-alloc/NIL_OFFSET) (not= old-off new-off))
        ;; Free/pool this old node
        (let [size (node-size-for-free old-off)]
          (if (pos? size)
            (maybe-pool-or-free! old-off size)
            (eve-alloc/free! old-off)))
        ;; Continue down the hash path via node_bitmap children
        (let [old-type (read-node-type old-off)]
          (when (== old-type NODE_TYPE_BITMAP)
            (let [bit-pos (bit-and (unsigned-bit-shift-right vh sh) MASK)
                  old-node-bm (read-node-bitmap old-off)
                  new-type (when (not= new-off eve-alloc/NIL_OFFSET) (read-node-type new-off))
                  new-node-bm (when (and new-type (== new-type NODE_TYPE_BITMAP))
                                (read-node-bitmap new-off))]
              (when (and (has-node? old-node-bm bit-pos)
                         new-node-bm
                         (has-node? new-node-bm bit-pos))
                (let [old-child-idx (get-child-idx old-node-bm bit-pos)
                      new-child-idx (get-child-idx new-node-bm bit-pos)
                      old-child (read-child-offset old-off old-child-idx)
                      new-child (read-child-offset new-off new-child-idx)]
                  (recur old-child new-child (+ sh SHIFT_STEP)))))))))))

(defn retire-tree-diff!
  "Full tree diff: walk old and new HAMT trees in parallel, freeing all
   old nodes that differ from the new tree.

   At each node pair:
   - If old-off == new-off -> shared subtree, skip entirely
   - If old-off != new-off -> free old node, recurse into children

   Cost: O(changed nodes). Shared subtrees are skipped via integer compare."
  [old-root new-root]
  (when (and (not= old-root eve-alloc/NIL_OFFSET) (not= old-root new-root))
    (letfn [(walk [old-off new-off]
              (when (and (not= old-off eve-alloc/NIL_OFFSET) (not= old-off new-off))
                ;; Free this old node
                (let [size (node-size-for-free old-off)]
                  (if (pos? size)
                    (maybe-pool-or-free! old-off size)
                    (eve-alloc/free! old-off)))
                ;; Recurse into children if bitmap node
                (let [old-type (read-node-type old-off)]
                  (when (== old-type NODE_TYPE_BITMAP)
                    (let [old-node-bm (read-node-bitmap old-off)
                          new-type (when (not= new-off eve-alloc/NIL_OFFSET) (read-node-type new-off))
                          new-node-bm (when (and new-type (== new-type NODE_TYPE_BITMAP))
                                        (read-node-bitmap new-off))]
                      ;; Walk only set bits in old-node-bm (bit-walking)
                      (loop [remaining old-node-bm
                             old-idx 0]
                        (when (not (zero? remaining))
                          (let [bit (bit-and remaining (- remaining))  ;; lowest set bit
                                old-child (read-child-offset old-off old-idx)
                                new-child (if (and new-node-bm (not (zero? (bit-and new-node-bm bit))))
                                            (let [new-idx (popcount32 (bit-and new-node-bm (dec bit)))]
                                              (read-child-offset new-off new-idx))
                                            eve-alloc/NIL_OFFSET)]
                            (walk old-child new-child)
                            (recur (bit-and remaining (dec remaining)) (inc old-idx))))))))))]
      (walk old-root new-root))))

;;-----------------------------------------------------------------------------
;; Constructors
;;-----------------------------------------------------------------------------

(defn empty-hash-set
  "Return an empty EVE set."
  []
  (make-eve-hash-set 0 eve-alloc/NIL_OFFSET))

(defn hash-set
  "Create a EVE set from values."
  [& vs]
  (reduce conj (empty-hash-set) vs))

(defn into-hash-set
  "Create a EVE set from a collection."
  [coll]
  (reduce conj (empty-hash-set) coll))

;;-----------------------------------------------------------------------------
;; SAB Pointer Registration
;;-----------------------------------------------------------------------------

(ser/register-sab-type-constructor!
  ser/FAST_TAG_SAB_SET
  (fn [_sab header-off] (make-eve-hash-set-from-header header-off)))

(ser/register-cljs-to-sab-builder!
  set?
  (fn [s] (into-hash-set s)))
