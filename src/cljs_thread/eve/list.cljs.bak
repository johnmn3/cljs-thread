(ns cljs-thread.eve.list
  "Slab-backed persistent list with fast-path serialization.

   Ported from eve-sab-deftype to the slab allocator.
   All node data lives in slab-class-specific SharedArrayBuffers.
   Node offsets are slab-qualified: [class_idx:3 | block_idx:29].

   Built on eve-slab-deftype with full feature parity:
   - Supports arbitrary CLJS values (via fast-path serialization)
   - Fast-path for primitives (nil, bool, int32, float64, string, keyword)
   - O(1) cons/first/rest operations

   Architecture:
   - SabList: count + head-offset (list handle)
   - Nodes: next-offset + serialized value"
  (:require
   [cljs-thread.eve.deftype-proto.alloc :as eve-alloc]
   [cljs-thread.eve.deftype-proto.data :as d]
   [cljs-thread.eve.deftype-proto.serialize :as ser]))

;; Forward declarations
(declare ->SabList SabList empty-sab-list)
(declare ->SabListN SabListN empty-sab-list-n)
(declare retire-replaced-chain! CHUNK_COUNT_OFFSET CHUNK_NEXT_OFFSET chunk-get-offset)

;;-----------------------------------------------------------------------------
;; Pool System — slab-qualified offsets only
;;-----------------------------------------------------------------------------
;; In the slab world, pools hold slab-qualified offsets directly.
;; No descriptor-idx tracking needed — free! takes a slab-qualified offset.

(def ^:private ^:const MAX_POOL_SIZE 256)
(def ^:private ^:const BATCH_ALLOC_SIZE 32)

(defn- size-class-for [n]
  (cond (<= n 32) 32 (<= n 64) 64 (<= n 128) 128
        (<= n 256) 256 (<= n 512) 512 :else nil))

;; Per-class pools — each entry is just a slab-qualified offset (i32).
(def ^:private pool-32 #js [])
(def ^:private pool-64 #js [])
(def ^:private pool-128 #js [])
(def ^:private pool-256 #js [])
(def ^:private pool-512 #js [])

(defn reset-pools! []
  (set! pool-32 #js [])
  (set! pool-64 #js [])
  (set! pool-128 #js [])
  (set! pool-256 #js [])
  (set! pool-512 #js []))

(defn drain-pools! []
  (doseq [pool [pool-32 pool-64 pool-128 pool-256 pool-512]]
    (dotimes [i (.-length pool)]
      (eve-alloc/free! (aget pool i))))
  (set! pool-32 #js [])
  (set! pool-64 #js [])
  (set! pool-128 #js [])
  (set! pool-256 #js [])
  (set! pool-512 #js []))

(defn- pool-get! [size-class]
  (let [stack (case size-class
                32 pool-32  64 pool-64  128 pool-128
                256 pool-256  512 pool-512
                nil)]
    (when (and stack (pos? (.-length stack)))
      (.pop stack))))

(defn- pool-put! [size-class slab-offset]
  (let [stack (case size-class
                32 pool-32  64 pool-64  128 pool-128
                256 pool-256  512 pool-512
                nil)]
    (when stack
      (if (< (.-length stack) MAX_POOL_SIZE)
        (do (.push stack slab-offset) true)
        false))))

;;-----------------------------------------------------------------------------
;; Allocation helpers
;;-----------------------------------------------------------------------------

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
            (throw (js/Error. (str "List allocation failed: out of memory for " size-class " bytes"))))
          ;; Put extras into pool
          (loop [i 1]
            (when (< i len)
              (pool-put! size-class (aget results i))
              (recur (inc i))))
          ;; Return first
          (aget results 0)))
      ;; Too large for pooling — direct alloc
      (eve-alloc/alloc-offset n))))

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

(defn- r-get-i32 ^number [^number off]
  (.getInt32 eve-alloc/resolved-dv (+ eve-alloc/resolved-base off) true))

(defn- r-get-u32 ^number [^number off]
  (.getUint32 eve-alloc/resolved-dv (+ eve-alloc/resolved-base off) true))

(defn- r-set-i32 [^number off ^number val]
  (.setInt32 eve-alloc/resolved-dv (+ eve-alloc/resolved-base off) val true))

(defn- r-set-u32 [^number off ^number val]
  (.setUint32 eve-alloc/resolved-dv (+ eve-alloc/resolved-base off) val true))

(defn- r-get-u16 ^number [^number off]
  (.getUint16 eve-alloc/resolved-dv (+ eve-alloc/resolved-base off) true))

(defn- r-set-u16 [^number off ^number val]
  (.setUint16 eve-alloc/resolved-dv (+ eve-alloc/resolved-base off) val true))

(defn- r-get-u8 ^number [^number off]
  (.getUint8 eve-alloc/resolved-dv (+ eve-alloc/resolved-base off)))

(defn- r-set-u8 [^number off ^number val]
  (.setUint8 eve-alloc/resolved-dv (+ eve-alloc/resolved-base off) val))

;;-----------------------------------------------------------------------------
;; Node operations
;; Node layout: [next-off:i32][val-len:u32][val-bytes...]
;;-----------------------------------------------------------------------------

(defn- make-list-node!
  "Create a list node with serialized value and next pointer.
   Returns a slab-qualified offset."
  [^js val-bytes next-off]
  (let [val-len (.-length val-bytes)
        node-size (+ 4 4 val-len)  ;; next + val-len + val
        slab-off (alloc-bytes! node-size)]
    (eve-alloc/resolve-u8! slab-off)
    (r-set-i32 0 next-off)
    (r-set-u32 4 val-len)
    (when (pos? val-len)
      (.set eve-alloc/resolved-u8 val-bytes (+ eve-alloc/resolved-base 8)))
    slab-off))

(defn- read-node-next
  "Read the next pointer from a list node (slab-qualified offset)."
  ^number [^number node-off]
  (let [base (eve-alloc/resolve-dv! node-off)]
    (.getInt32 eve-alloc/resolved-dv base true)))

(defn- read-node-value
  "Read the value from a node. Returns [value val-len]."
  [^number node-off]
  (eve-alloc/resolve-u8! node-off)
  (let [val-len (r-get-u32 4)
        val-bytes (copy-from-sab node-off 8 val-len)
        value (ser/deserialize-element nil val-bytes)]
    [value val-len]))

;;-----------------------------------------------------------------------------
;; List type - the persistent list handle
;;-----------------------------------------------------------------------------
;; In the slab version, SabList is a lightweight JS deftype.
;; Fields cnt and head-off are JS properties (not SAB-backed).
;; header-off stores a slab-qualified offset to a header block for serialization.

(declare dispose!)

(def ^:private ^:const SABLIST_HEADER_SIZE 12)  ;; type-id:u8 + pad:3 + cnt:i32 + head-off:i32

(defn- make-sab-list-header!
  "Allocate a 12-byte header block for SabList serialization.
   Stores: [type-id:u8 | pad:3 | cnt:i32 | head-off:i32]."
  [cnt head-off]
  (let [header-off (alloc-bytes! SABLIST_HEADER_SIZE)]
    (eve-alloc/resolve-u8! header-off)
    (r-set-u8 0 0x13)  ;; type-id for SabList
    (r-set-u8 1 0) (r-set-u8 2 0) (r-set-u8 3 0)
    (r-set-i32 4 cnt)
    (r-set-i32 8 head-off)
    header-off))

(deftype SabList [cnt head-off header-off]
  ISequential

  ICounted
  (-count [_] cnt)

  IStack
  (-peek [_]
    (when (pos? cnt)
      (let [[value _] (read-node-value head-off)]
        value)))

  (-pop [_]
    (cond
      (zero? cnt)
      (throw (js/Error. "Can't pop empty list"))

      (== cnt 1)
      (empty-sab-list)

      :else
      (let [new-head (read-node-next head-off)]
        (->SabList (dec cnt) new-head (make-sab-list-header! (dec cnt) new-head)))))

  ICollection
  (-conj [_ val]
    (let [val-bytes (ser/serialize-element val)
          new-off (make-list-node! val-bytes head-off)
          new-cnt (inc cnt)]
      (->SabList new-cnt new-off (make-sab-list-header! new-cnt new-off))))

  IEmptyableCollection
  (-empty [_]
    (empty-sab-list))

  ISeq
  (-first [_]
    (when (pos? cnt)
      (let [[value _] (read-node-value head-off)]
        value)))

  (-rest [_]
    (if (zero? cnt)
      (empty-sab-list)
      (let [new-head (read-node-next head-off)
            new-cnt (dec cnt)]
        (if (== new-head eve-alloc/NIL_OFFSET)
          (empty-sab-list)
          (->SabList new-cnt new-head (make-sab-list-header! new-cnt new-head))))))

  INext
  (-next [_]
    (when (> cnt 1)
      (let [new-head (read-node-next head-off)]
        (when (not= new-head eve-alloc/NIL_OFFSET)
          (->SabList (dec cnt) new-head (make-sab-list-header! (dec cnt) new-head))))))

  ISeqable
  (-seq [this]
    (when (pos? cnt)
      this))

  IReduce
  (-reduce [_ f]
    (if (zero? cnt)
      (f)
      (loop [node-off head-off
             acc nil
             first? true]
        (if (== node-off eve-alloc/NIL_OFFSET)
          acc
          (let [[val _] (read-node-value node-off)
                next-off (read-node-next node-off)]
            (if first?
              (recur next-off val false)
              (let [acc' (f acc val)]
                (if (reduced? acc')
                  @acc'
                  (recur next-off acc' false)))))))))

  (-reduce [_ f init]
    (loop [node-off head-off
           acc init]
      (if (or (== node-off eve-alloc/NIL_OFFSET) (reduced? acc))
        (if (reduced? acc) @acc acc)
        (let [[val _] (read-node-value node-off)
              next-off (read-node-next node-off)]
          (recur next-off (f acc val))))))

  IEquiv
  (-equiv [this other]
    (cond
      (identical? this other) true
      (not (sequential? other)) false
      :else
      (loop [node-off head-off
             other-seq (seq other)]
        (cond
          (and (== node-off eve-alloc/NIL_OFFSET) (nil? other-seq)) true
          (or (== node-off eve-alloc/NIL_OFFSET) (nil? other-seq)) false
          :else
          (let [[val _] (read-node-value node-off)]
            (if (= val (first other-seq))
              (recur (read-node-next node-off) (next other-seq))
              false))))))

  IHash
  (-hash [this]
    (hash-ordered-coll this))

  IFn
  (-invoke [this n]
    (nth this n))
  (-invoke [this n not-found]
    (nth this n not-found))

  IIndexed
  (-nth [_ n]
    (if (or (neg? n) (>= n cnt))
      (throw (js/Error. (str "Index out of bounds: " n)))
      (loop [node-off head-off
             i 0]
        (if (== i n)
          (let [[val _] (read-node-value node-off)]
            val)
          (recur (read-node-next node-off) (inc i))))))

  (-nth [this n not-found]
    (if (or (neg? n) (>= n cnt))
      not-found
      (-nth this n)))

  IPrintWithWriter
  (-pr-writer [_ writer opts]
    (-write writer "(")
    (loop [node-off head-off
           i 0]
      (when (and (not= node-off eve-alloc/NIL_OFFSET) (< i 10))
        (when (pos? i) (-write writer " "))
        (let [[val _] (read-node-value node-off)]
          (-write writer (pr-str val))
          (recur (read-node-next node-off) (inc i)))))
    (when (> cnt 10)
      (-write writer " ..."))
    (-write writer ")"))

  d/IDirectSerialize
  (-direct-serialize [this]
    (ser/encode-sab-pointer ser/FAST_TAG_SAB_LIST header-off))

  d/ISabStorable
  (-sab-tag [_] :eve-list)
  (-sab-encode [this _slab-env]
    (d/-direct-serialize this))
  (-sab-dispose [this _slab-env]
    (dispose! this))

  d/IsEve
  (-eve? [_] true)

  d/ISabRetirable
  (-sab-retire-diff! [this new-value _slab-env mode]
    (let [old-head head-off
          new-head (when (instance? SabList new-value)
                     (.-head-off new-value))]
      (if new-head
        ;; Both are SabList — retire replaced chain nodes
        (retire-replaced-chain! old-head new-head mode)
        ;; Different type — dispose entire old chain
        (dispose! this)))))

;;-----------------------------------------------------------------------------
;; Disposal - explicit cleanup for reclaiming slab memory
;;-----------------------------------------------------------------------------

(defn- free-block!
  "Free a single slab-qualified offset."
  [slab-offset]
  (when (not= slab-offset eve-alloc/NIL_OFFSET)
    (eve-alloc/free! slab-offset)))

(defn- free-list-chain!
  "Free all nodes in a SabList linked list chain."
  [head-off]
  (loop [node-off head-off]
    (when (not= node-off eve-alloc/NIL_OFFSET)
      (let [next-off (read-node-next node-off)]
        (free-block! node-off)
        (recur next-off)))))

(defn- free-chunk-chain!
  "Free all chunks and their value blocks in a SabListN chain."
  [head-off head-idx chunk-size]
  (loop [chunk-off head-off
         idx head-idx]
    (when (not= chunk-off eve-alloc/NIL_OFFSET)
      (let [_ (eve-alloc/resolve-dv! chunk-off)
            chunk-cnt (r-get-u16 CHUNK_COUNT_OFFSET)
            next-chunk (r-get-i32 CHUNK_NEXT_OFFSET)]
        ;; Free value blocks in this chunk
        (loop [i idx]
          (when (< i chunk-size)
            (let [val-off (chunk-get-offset chunk-off chunk-size i)]
              (when (not= val-off eve-alloc/NIL_OFFSET)
                (free-block! val-off)))
            (recur (inc i))))
        ;; Free the chunk itself
        (free-block! chunk-off)
        ;; Continue to next chunk (always starts at idx 0)
        (recur next-chunk 0)))))

(defn dispose!
  "Dispose a SabList or SabListN, freeing all nodes/chunks and header.
   Call this when the list is no longer needed to reclaim slab memory.

   WARNING: After disposal, the list must not be used. Any access will
   result in undefined behavior or errors."
  [sab-list]
  (cond
    ;; SabList (linked list)
    (instance? SabList sab-list)
    (let [head-off (.-head-off sab-list)
          hdr-off (.-header-off sab-list)]
      (when (not= head-off eve-alloc/NIL_OFFSET)
        (free-list-chain! head-off))
      ;; Free the header block
      (when (not= hdr-off eve-alloc/NIL_OFFSET)
        (eve-alloc/free! hdr-off)))

    ;; SabListN (chunked list)
    (instance? SabListN sab-list)
    (let [head-off (.-head-off sab-list)
          head-idx (.-head-idx sab-list)
          cs (.-chunk-size sab-list)
          hdr-off (.-header-off sab-list)]
      (when (not= head-off eve-alloc/NIL_OFFSET)
        (free-chunk-chain! head-off head-idx cs))
      ;; Free the header block
      (when (not= hdr-off eve-alloc/NIL_OFFSET)
        (eve-alloc/free! hdr-off)))))

(defn retire-replaced-chain!
  "After an atom swap that replaced a list, retire old nodes not shared
   by the new list.

   For cons: old-head == new-head.next, so nothing to retire.
   For pop/rest: new-head == old-head.next, so retire old-head only.
   For general changes: walk old chain, retire nodes not in new chain.

   mode: :retire (epoch-based, for multi-worker) or :free (immediate)"
  ([old-head new-head]
   (retire-replaced-chain! old-head new-head :free))
  ([old-head new-head mode]
   (when (and (not= old-head eve-alloc/NIL_OFFSET) (not= old-head new-head))
     ;; Walk old chain, freeing nodes until we hit a shared node
     (loop [node-off old-head]
       (when (and (not= node-off eve-alloc/NIL_OFFSET) (not= node-off new-head))
         (let [next-off (read-node-next node-off)]
           (eve-alloc/free! node-off)
           (recur next-off)))))))

;;-----------------------------------------------------------------------------
;; Constructors
;;-----------------------------------------------------------------------------

(defn empty-sab-list
  "Create an empty SabList."
  []
  (->SabList 0 eve-alloc/NIL_OFFSET
             (make-sab-list-header! 0 eve-alloc/NIL_OFFSET)))

(defn sab-list
  "Create a SabList from a sequence of values.
   Note: Elements are added in reverse order (like Clojure's list)."
  [coll]
  (reduce conj (empty-sab-list) (reverse (vec coll))))

(defn into-eve-list
  "Conj all elements onto a list (faster, but reverses order)."
  [coll]
  (reduce conj (empty-sab-list) coll))

;;-----------------------------------------------------------------------------
;; Chunked List - Configurable Chunk Size with Columnar Layout
;;
;; SabListN groups elements into chunks for better cache locality.
;; Uses columnar layout for SIMD-friendly scanning.
;;
;; COLUMNAR CHUNK LAYOUT (optimized for SIMD):
;;   Header (16 bytes, aligned):
;;     [next-chunk-off:i32]     - offset to next chunk, -1 for end
;;     [chunk-count:u16]        - number of elements in this chunk
;;     [padding:u16]            - alignment padding
;;     [flags:u32]              - reserved for future SIMD hints
;;     [data-region-off:i32]    - offset to data region start
;;
;;   Columnar Arrays (each is SIMD-scannable):
;;     [types: capacity * u8]   - type tags (SIMD: find all ints, all strings, etc.)
;;     [padding to 4-byte align]
;;     [lengths: capacity * u32] - serialized lengths (SIMD: prefix sum for offsets)
;;     [offsets: capacity * i32] - offsets into data region (SIMD: gather)
;;
;;   Data Region:
;;     [data: variable bytes]   - packed serialized elements
;;
;; The columnar layout enables:
;;   1. SIMD type filtering: Find all elements of a specific type
;;   2. SIMD prefix sum: Calculate data offsets from lengths
;;   3. SIMD gather: Load multiple elements at once
;;
;; Note: Elements are stored front-to-back within chunks, newest chunk first.
;;-----------------------------------------------------------------------------

;; Columnar chunk layout constants
(def ^:private ^:const CHUNK_HEADER_SIZE 16)      ;; next + count + pad + flags + data-region-off
(def ^:private ^:const CHUNK_NEXT_OFFSET 0)
(def ^:private ^:const CHUNK_COUNT_OFFSET 4)
(def ^:private ^:const CHUNK_FLAGS_OFFSET 8)
(def ^:private ^:const CHUNK_DATA_REGION_OFFSET 12)

(defn- types-array-size
  "Size of types array (padded to 4-byte alignment)."
  [capacity]
  (let [raw-size capacity
        remainder (mod raw-size 4)]
    (if (zero? remainder)
      raw-size
      (+ raw-size (- 4 remainder)))))

(defn- lengths-array-rel-offset
  "Relative offset to lengths array within chunk."
  [capacity]
  (+ CHUNK_HEADER_SIZE (types-array-size capacity)))

(defn- offsets-array-rel-offset
  "Relative offset to offsets array within chunk."
  [capacity]
  (+ (lengths-array-rel-offset capacity) (* capacity 4)))

(defn- alloc-columnar-chunk!
  "Allocate a columnar chunk with capacity.
   Layout: header | types[capacity] | pad | lengths[capacity] | offsets[capacity]
   Returns a slab-qualified offset."
  [capacity]
  (let [types-size (types-array-size capacity)
        lengths-size (* capacity 4)
        offsets-size (* capacity 4)
        total-size (+ CHUNK_HEADER_SIZE types-size lengths-size offsets-size)
        slab-off (alloc-bytes! total-size)]
    ;; Initialize header
    (eve-alloc/resolve-u8! slab-off)
    (r-set-i32 CHUNK_NEXT_OFFSET eve-alloc/NIL_OFFSET)       ;; next = NIL
    (r-set-u16 CHUNK_COUNT_OFFSET 0)                          ;; count = 0
    (r-set-u16 (+ CHUNK_COUNT_OFFSET 2) 0)                    ;; padding
    (r-set-u32 CHUNK_FLAGS_OFFSET 0)                           ;; flags = 0
    (r-set-i32 CHUNK_DATA_REGION_OFFSET eve-alloc/NIL_OFFSET) ;; data-region = NIL
    ;; Initialize arrays
    (let [types-off CHUNK_HEADER_SIZE
          lengths-off (lengths-array-rel-offset capacity)
          offsets-off (offsets-array-rel-offset capacity)]
      ;; Zero out types
      (dotimes [i (types-array-size capacity)]
        (r-set-u8 (+ types-off i) 0))
      ;; Zero out lengths
      (dotimes [i capacity]
        (r-set-u32 (+ lengths-off (* i 4)) 0))
      ;; Initialize offsets to NIL_OFFSET
      (dotimes [i capacity]
        (r-set-i32 (+ offsets-off (* i 4)) eve-alloc/NIL_OFFSET)))
    slab-off))

(defn- chunk-get-next
  "Read next-chunk pointer from a chunk."
  ^number [^number chunk-off]
  (let [base (eve-alloc/resolve-dv! chunk-off)]
    (.getInt32 eve-alloc/resolved-dv (+ base CHUNK_NEXT_OFFSET) true)))

(defn- chunk-get-count
  "Read element count from a chunk."
  ^number [^number chunk-off]
  (let [base (eve-alloc/resolve-dv! chunk-off)]
    (.getUint16 eve-alloc/resolved-dv (+ base CHUNK_COUNT_OFFSET) true)))

(defn- chunk-set-next!
  "Write next-chunk pointer to a chunk."
  [^number chunk-off ^number next-off]
  (eve-alloc/resolve-dv! chunk-off)
  (r-set-i32 CHUNK_NEXT_OFFSET next-off))

(defn- chunk-set-count!
  "Write element count to a chunk."
  [^number chunk-off ^number cnt]
  (eve-alloc/resolve-dv! chunk-off)
  (r-set-u16 CHUNK_COUNT_OFFSET cnt))

(defn- chunk-set-type!
  "Write type tag for element at idx."
  [^number chunk-off ^number capacity ^number idx ^number type-tag]
  (eve-alloc/resolve-dv! chunk-off)
  (r-set-u8 (+ CHUNK_HEADER_SIZE idx) type-tag))

(defn- chunk-set-length!
  "Write serialized length for element at idx."
  [^number chunk-off ^number capacity ^number idx ^number len]
  (eve-alloc/resolve-dv! chunk-off)
  (r-set-u32 (+ (lengths-array-rel-offset capacity) (* idx 4)) len))

(defn- chunk-get-offset
  "Read data offset for element at idx."
  ^number [^number chunk-off ^number capacity ^number idx]
  (eve-alloc/resolve-dv! chunk-off)
  (r-get-i32 (+ (offsets-array-rel-offset capacity) (* idx 4))))

(defn- chunk-set-offset!
  "Write data offset for element at idx."
  [^number chunk-off ^number capacity ^number idx ^number data-off]
  (eve-alloc/resolve-dv! chunk-off)
  (r-set-i32 (+ (offsets-array-rel-offset capacity) (* idx 4)) data-off))

;; Type tags for fast SIMD filtering
(def ^:private ^:const TYPE_NIL 0)
(def ^:private ^:const TYPE_BOOL 1)
(def ^:private ^:const TYPE_INT32 2)
(def ^:private ^:const TYPE_FLOAT64 3)
(def ^:private ^:const TYPE_STRING 4)
(def ^:private ^:const TYPE_KEYWORD 5)
(def ^:private ^:const TYPE_OTHER 255)

(defn- get-type-tag
  "Get type tag for a serialized value."
  [^js val-bytes]
  (cond
    (or (nil? val-bytes) (zero? (.-length val-bytes)))
    TYPE_NIL

    (and (>= (.-length val-bytes) 3)
         (== (aget val-bytes 0) d/DIRECT_MAGIC_0)
         (== (aget val-bytes 1) d/DIRECT_MAGIC_1))
    (let [tag (aget val-bytes 2)]
      (case tag
        (1 2) TYPE_BOOL
        3     TYPE_INT32
        4     TYPE_FLOAT64
        (5 6) TYPE_STRING
        (7 8) TYPE_KEYWORD
        TYPE_OTHER))

    :else TYPE_OTHER))

(defn- make-value-block!
  "Allocate and write a serialized value. Returns slab-qualified offset."
  [^js val-bytes]
  (let [val-len (.-length val-bytes)
        slab-off (alloc-bytes! (+ 4 val-len))]
    (eve-alloc/resolve-u8! slab-off)
    (r-set-u32 0 val-len)
    (when (pos? val-len)
      (.set eve-alloc/resolved-u8 val-bytes (+ eve-alloc/resolved-base 4)))
    slab-off))

(defn- read-value-block
  "Read value from a value block slab-qualified offset."
  [^number val-off]
  (eve-alloc/resolve-u8! val-off)
  (let [val-len (r-get-u32 0)
        val-bytes (copy-from-sab val-off 4 val-len)]
    (ser/deserialize-element nil val-bytes)))

(defn- clone-columnar-chunk!
  "Clone a columnar chunk, copying all arrays.
   Returns slab-qualified offset of the new chunk."
  [^number src-off ^number capacity]
  (let [new-off (alloc-columnar-chunk! capacity)]
    ;; Read source chunk data
    (eve-alloc/resolve-dv! src-off)
    (let [src-next (r-get-i32 CHUNK_NEXT_OFFSET)
          src-cnt (r-get-u16 CHUNK_COUNT_OFFSET)]
      ;; Write to new chunk
      (eve-alloc/resolve-dv! new-off)
      (r-set-i32 CHUNK_NEXT_OFFSET src-next)
      (r-set-u16 CHUNK_COUNT_OFFSET src-cnt)
      ;; Copy columnar data for each element
      (dotimes [i capacity]
        ;; Read from source
        (eve-alloc/resolve-dv! src-off)
        (let [type-val (r-get-u8 (+ CHUNK_HEADER_SIZE i))
              len-val (r-get-u32 (+ (lengths-array-rel-offset capacity) (* i 4)))
              off-val (r-get-i32 (+ (offsets-array-rel-offset capacity) (* i 4)))]
          ;; Write to destination
          (eve-alloc/resolve-dv! new-off)
          (r-set-u8 (+ CHUNK_HEADER_SIZE i) type-val)
          (r-set-u32 (+ (lengths-array-rel-offset capacity) (* i 4)) len-val)
          (r-set-i32 (+ (offsets-array-rel-offset capacity) (* i 4)) off-val))))
    new-off))

;;-----------------------------------------------------------------------------
;; SabListN header
;;-----------------------------------------------------------------------------

(def ^:private ^:const SABLISTN_HEADER_SIZE 20)
;; [type-id:u8 | pad:3 | cnt:i32 | head-off:i32 | head-idx:i32 | chunk-size:i32]

(defn- make-sab-list-n-header!
  "Allocate a header block for SabListN serialization."
  [cnt head-off head-idx chunk-size]
  (let [header-off (alloc-bytes! SABLISTN_HEADER_SIZE)]
    (eve-alloc/resolve-u8! header-off)
    (r-set-u8 0 0x14)  ;; type-id for SabListN
    (r-set-u8 1 0) (r-set-u8 2 0) (r-set-u8 3 0)
    (r-set-i32 4 cnt)
    (r-set-i32 8 head-off)
    (r-set-i32 12 head-idx)
    (r-set-i32 16 chunk-size)
    header-off))

;;-----------------------------------------------------------------------------
;; SabListN type — chunked list
;;-----------------------------------------------------------------------------

(deftype SabListN [cnt head-off head-idx chunk-size header-off]
  ISequential

  ICounted
  (-count [_] cnt)

  IStack
  (-peek [_]
    (when (pos? cnt)
      (let [val-off (chunk-get-offset head-off chunk-size head-idx)]
        (read-value-block val-off))))

  (-pop [_]
    (cond
      (zero? cnt)
      (throw (js/Error. "Can't pop empty list"))

      (== cnt 1)
      (empty-sab-list-n chunk-size)

      :else
      (let [chunk-cnt (chunk-get-count head-off)
            ;; Elements in this chunk from head-idx to end
            elems-in-chunk (- chunk-cnt head-idx)]
        (if (> elems-in-chunk 1)
          ;; More elements in this chunk
          (let [new-cnt (dec cnt)
                new-idx (inc head-idx)]
            (->SabListN new-cnt head-off new-idx chunk-size
                        (make-sab-list-n-header! new-cnt head-off new-idx chunk-size)))
          ;; Move to next chunk
          (let [next-chunk (chunk-get-next head-off)
                new-cnt (dec cnt)]
            (->SabListN new-cnt next-chunk 0 chunk-size
                        (make-sab-list-n-header! new-cnt next-chunk 0 chunk-size)))))))

  ICollection
  (-conj [_ val]
    (let [val-bytes (ser/serialize-element val)
          type-tag (get-type-tag val-bytes)
          val-off (make-value-block! val-bytes)]
      (if (or (== head-off eve-alloc/NIL_OFFSET) (zero? head-idx))
        ;; Need new chunk (empty list or current chunk's front is full)
        (let [new-chunk (alloc-columnar-chunk! chunk-size)
              new-idx (dec chunk-size)]
          (chunk-set-type! new-chunk chunk-size new-idx type-tag)
          (chunk-set-length! new-chunk chunk-size new-idx (.-length val-bytes))
          (chunk-set-offset! new-chunk chunk-size new-idx val-off)
          (chunk-set-count! new-chunk 1)
          (chunk-set-next! new-chunk head-off)
          (let [new-cnt (inc cnt)]
            (->SabListN new-cnt new-chunk new-idx chunk-size
                        (make-sab-list-n-header! new-cnt new-chunk new-idx chunk-size))))
        ;; Room in current chunk - create new chunk with shifted data
        (let [new-chunk (clone-columnar-chunk! head-off chunk-size)
              new-idx (dec head-idx)]
          (chunk-set-type! new-chunk chunk-size new-idx type-tag)
          (chunk-set-length! new-chunk chunk-size new-idx (.-length val-bytes))
          (chunk-set-offset! new-chunk chunk-size new-idx val-off)
          (chunk-set-count! new-chunk (inc (chunk-get-count head-off)))
          (let [new-cnt (inc cnt)]
            (->SabListN new-cnt new-chunk new-idx chunk-size
                        (make-sab-list-n-header! new-cnt new-chunk new-idx chunk-size)))))))

  IEmptyableCollection
  (-empty [_]
    (empty-sab-list-n chunk-size))

  ISeq
  (-first [_]
    (when (pos? cnt)
      (let [val-off (chunk-get-offset head-off chunk-size head-idx)]
        (read-value-block val-off))))

  (-rest [_]
    (if (zero? cnt)
      (empty-sab-list-n chunk-size)
      (let [chunk-cnt (chunk-get-count head-off)
            elems-in-chunk (- chunk-cnt head-idx)]
        (if (> elems-in-chunk 1)
          (let [new-cnt (dec cnt)
                new-idx (inc head-idx)]
            (->SabListN new-cnt head-off new-idx chunk-size
                        (make-sab-list-n-header! new-cnt head-off new-idx chunk-size)))
          (let [next-chunk (chunk-get-next head-off)]
            (if (== next-chunk eve-alloc/NIL_OFFSET)
              (empty-sab-list-n chunk-size)
              (let [new-cnt (dec cnt)]
                (->SabListN new-cnt next-chunk 0 chunk-size
                            (make-sab-list-n-header! new-cnt next-chunk 0 chunk-size)))))))))

  INext
  (-next [_]
    (when (> cnt 1)
      (let [chunk-cnt (chunk-get-count head-off)
            elems-in-chunk (- chunk-cnt head-idx)]
        (if (> elems-in-chunk 1)
          (let [new-cnt (dec cnt)
                new-idx (inc head-idx)]
            (->SabListN new-cnt head-off new-idx chunk-size
                        (make-sab-list-n-header! new-cnt head-off new-idx chunk-size)))
          (let [next-chunk (chunk-get-next head-off)]
            (when (not= next-chunk eve-alloc/NIL_OFFSET)
              (let [new-cnt (dec cnt)]
                (->SabListN new-cnt next-chunk 0 chunk-size
                            (make-sab-list-n-header! new-cnt next-chunk 0 chunk-size)))))))))

  ISeqable
  (-seq [this]
    (when (pos? cnt)
      this))

  IReduce
  (-reduce [_ f]
    (if (zero? cnt)
      (f)
      (loop [chunk-off head-off
             idx head-idx
             acc nil
             first? true
             remaining cnt]
        (if (zero? remaining)
          acc
          (let [val-off (chunk-get-offset chunk-off chunk-size idx)
                val (read-value-block val-off)
                elems-left (- chunk-size idx)]
            (if first?
              (if (> elems-left 1)
                (recur chunk-off (inc idx) val false (dec remaining))
                (recur (chunk-get-next chunk-off) 0 val false (dec remaining)))
              (let [acc' (f acc val)]
                (if (reduced? acc')
                  @acc'
                  (if (> elems-left 1)
                    (recur chunk-off (inc idx) acc' false (dec remaining))
                    (recur (chunk-get-next chunk-off) 0 acc' false (dec remaining)))))))))))

  (-reduce [_ f init]
    (loop [chunk-off head-off
           idx head-idx
           acc init
           remaining cnt]
      (if (or (zero? remaining) (reduced? acc))
        (if (reduced? acc) @acc acc)
        (let [val-off (chunk-get-offset chunk-off chunk-size idx)
              val (read-value-block val-off)
              elems-left (- chunk-size idx)
              acc' (f acc val)]
          (if (> elems-left 1)
            (recur chunk-off (inc idx) acc' (dec remaining))
            (recur (chunk-get-next chunk-off) 0 acc' (dec remaining)))))))

  IEquiv
  (-equiv [this other]
    (cond
      (identical? this other) true
      (not (sequential? other)) false
      :else
      (loop [chunk-off head-off
             idx head-idx
             other-seq (seq other)
             remaining cnt]
        (cond
          (and (zero? remaining) (nil? other-seq)) true
          (or (zero? remaining) (nil? other-seq)) false
          :else
          (let [val-off (chunk-get-offset chunk-off chunk-size idx)
                val (read-value-block val-off)
                elems-left (- chunk-size idx)]
            (if (= val (first other-seq))
              (if (> elems-left 1)
                (recur chunk-off (inc idx) (next other-seq) (dec remaining))
                (recur (chunk-get-next chunk-off) 0 (next other-seq) (dec remaining)))
              false))))))

  IHash
  (-hash [this]
    (hash-ordered-coll this))

  IFn
  (-invoke [this n]
    (nth this n))
  (-invoke [this n not-found]
    (nth this n not-found))

  IIndexed
  (-nth [_ n]
    (if (or (neg? n) (>= n cnt))
      (throw (js/Error. (str "Index out of bounds: " n)))
      ;; Navigate through chunks to find element at index n
      (loop [chunk-off head-off
             chunk-idx head-idx
             remaining-in-chunk (- (chunk-get-count head-off) head-idx)
             target n]
        (if (< target remaining-in-chunk)
          ;; Element is in this chunk
          (let [val-off (chunk-get-offset chunk-off chunk-size (+ chunk-idx target))]
            (read-value-block val-off))
          ;; Element is in a later chunk
          (let [next-chunk (chunk-get-next chunk-off)]
            (recur next-chunk 0 (chunk-get-count next-chunk) (- target remaining-in-chunk)))))))

  (-nth [this n not-found]
    (if (or (neg? n) (>= n cnt))
      not-found
      (-nth this n)))

  IPrintWithWriter
  (-pr-writer [_ writer opts]
    (-write writer (str "(#sab/list-" chunk-size " "))
    (loop [chunk-off head-off
           idx head-idx
           i 0
           remaining cnt]
      (when (and (pos? remaining) (< i 10))
        (when (pos? i) (-write writer " "))
        (let [val-off (chunk-get-offset chunk-off chunk-size idx)
              val (read-value-block val-off)
              elems-left (- chunk-size idx)]
          (-write writer (pr-str val))
          (if (> elems-left 1)
            (recur chunk-off (inc idx) (inc i) (dec remaining))
            (recur (chunk-get-next chunk-off) 0 (inc i) (dec remaining))))))
    (when (> cnt 10)
      (-write writer " ..."))
    (-write writer ")")))

;;-----------------------------------------------------------------------------
;; Chunked List Constructors
;;-----------------------------------------------------------------------------

(defn empty-sab-list-n
  "Create an empty chunked SabListN with specified chunk size.
   Valid sizes: 32, 64, 128, 256, 512, 1024"
  [chunk-size]
  (->SabListN 0 eve-alloc/NIL_OFFSET 0 chunk-size
              (make-sab-list-n-header! 0 eve-alloc/NIL_OFFSET 0 chunk-size)))

(defn sab-list-n
  "Create a SabListN from a sequence with specified chunk size.
   Valid sizes: 32, 64, 128, 256, 512, 1024"
  [chunk-size coll]
  (reduce conj (empty-sab-list-n chunk-size) (reverse coll)))

(defn into-eve-list-n
  "Conj all elements onto a chunked list (faster, but reverses order)."
  [chunk-size coll]
  (reduce conj (empty-sab-list-n chunk-size) coll))

;;-----------------------------------------------------------------------------
;; SAB Pointer Registration
;;-----------------------------------------------------------------------------

(ser/register-sab-type-constructor!
  ser/FAST_TAG_SAB_LIST
  (fn [_sab slab-offset]
    ;; Reconstruct SabList from a slab-qualified header offset.
    ;; Read cnt and head-off from the header block.
    (eve-alloc/resolve-dv! slab-offset)
    (let [cnt (.getInt32 eve-alloc/resolved-dv (+ eve-alloc/resolved-base 4) true)
          head-off (.getInt32 eve-alloc/resolved-dv (+ eve-alloc/resolved-base 8) true)]
      (SabList. cnt head-off slab-offset))))

(ser/register-cljs-to-sab-builder!
  list?
  (fn [l] (sab-list l)))
