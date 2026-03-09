(ns cljs-thread.eve.deftype-proto.chunked-kv-seq
  "SIMD-friendly chunked sequences for map iteration.

   This module builds on the columnar layout patterns established in:
   - sab_list.cljs: columnar chunks with types/lengths/offsets arrays
   - sabp_map.cljs: columnar bitmap nodes (HAMT_BITMAP_NODE_COLUMNAR_TYPE 6)

   Instead of returning one MapEntry at a time, returns chunks of N entries
   with keys and values stored in columnar layout for efficient batch processing.

   Layout within a chunk:
   ┌─────────────────────────────────────────────────────────────┐
   │ Header (16 bytes aligned)                                   │
   │ [count:u8][flags:u8][chunk_size:u16][keys_off:u32][vals_off:u32]│
   ├─────────────────────────────────────────────────────────────┤
   │ Key Index (aligned)                                         │
   │ [k0_off:u16][k0_len:u16][k1_off:u16][k1_len:u16]...         │
   ├─────────────────────────────────────────────────────────────┤
   │ Key Data (contiguous, 16-byte aligned starts)               │
   │ [key0 bytes][pad][key1 bytes][pad]...                       │
   ├─────────────────────────────────────────────────────────────┤
   │ Value Index (aligned)                                       │
   │ [v0_off:u16][v0_len:u16][v1_off:u16][v1_len:u16]...         │
   ├─────────────────────────────────────────────────────────────┤
   │ Value Data (contiguous)                                     │
   │ [val0 bytes][val1 bytes]...                                 │
   └─────────────────────────────────────────────────────────────┘

   SIMD Alignment Benefits:
   - Keys are contiguous → SIMD batch comparison (v128 can compare 16 bytes)
   - Values are contiguous → SIMD batch processing
   - Aligned boundaries → efficient vector loads (no penalty for misalignment)
   - Configurable chunk sizes for benchmarking optimal SIMD utilization

   Chunk Size Considerations:
   - 8: Fits in L1 cache, minimal overhead, good for small maps
   - 16: Balanced, 2x v128 register loads for key lengths (u16 × 16 = 256 bits)
   - 32: Matches common SIMD width patterns, good for batch operations
   - 64: More amortized overhead, but may exceed L1 cache for large keys"
  (:require
   [cljs-thread.eve.deftype-proto.simd :as simd]))

;;-----------------------------------------------------------------------------
;; Constants
;;-----------------------------------------------------------------------------

;; Chunk sizes to benchmark - powers of 2 for alignment
(def ^:const CHUNK_SIZE_8 8)
(def ^:const CHUNK_SIZE_16 16)
(def ^:const CHUNK_SIZE_32 32)
(def ^:const CHUNK_SIZE_64 64)

;; Default chunk size - configurable for benchmarking
(def ^:dynamic *chunk-size* 32)

(def ^:const SIMD_ALIGN 16)      ;; Byte alignment for SIMD (v128 = 16 bytes)
(def ^:const HEADER_SIZE 16)     ;; Chunk header size
(def ^:const INDEX_ENTRY_SIZE 4) ;; u16 offset + u16 length per entry

;; SIMD register utilization notes:
;; - v128 (128-bit) = 16 bytes = 8 × u16 key lengths at once
;; - Chunk size 8:  1 × v128 load for all key lengths
;; - Chunk size 16: 2 × v128 loads for all key lengths
;; - Chunk size 32: 4 × v128 loads for all key lengths
;; - Chunk size 64: 8 × v128 loads for all key lengths

;;-----------------------------------------------------------------------------
;; Chunk Creation
;;-----------------------------------------------------------------------------

(defn- align-up [n]
  (bit-and (+ n (dec SIMD_ALIGN)) (bit-not (dec SIMD_ALIGN))))

(defn create-kv-chunk
  "Create a SIMD-friendly chunk from vectors of serialized keys and values.
   Returns {:sab SharedArrayBuffer :count n :chunk-size :keys-offset :vals-offset}

   Optional chunk-size parameter overrides the default *chunk-size*."
  ([keys vals] (create-kv-chunk keys vals *chunk-size*))
  ([keys vals chunk-size]
   (let [n (min (count keys) chunk-size)

        ;; Calculate sizes - key data needs alignment padding per key
        key-index-size (align-up (* n INDEX_ENTRY_SIZE))
        ;; Each key is aligned to SIMD_ALIGN, so calculate actual space needed
        key-data-size (reduce (fn [acc key-len]
                                (+ (align-up acc) key-len))
                              0
                              (map #(.-length %) (take n keys)))
        key-data-size (align-up key-data-size) ;; Final alignment
        val-index-size (align-up (* n INDEX_ENTRY_SIZE))
        val-data-size (reduce + (map #(.-length %) (take n vals)))

        ;; Offsets
        key-index-offset HEADER_SIZE
        key-data-offset (+ key-index-offset key-index-size)
        val-index-offset (+ key-data-offset key-data-size)
        val-data-offset (+ val-index-offset val-index-size)
        total-size (+ val-data-offset val-data-size)

        ;; Allocate
        sab (js/SharedArrayBuffer. (align-up total-size))
        dv (js/DataView. sab)
        u8 (js/Uint8Array. sab)]

    ;; Write header
    (.setUint8 dv 0 n)                              ;; count
    (.setUint8 dv 1 0)                              ;; flags
    (.setUint16 dv 2 chunk-size true)               ;; chunk size (for benchmarking)
    (.setUint32 dv 4 key-data-offset true)          ;; keys data start
    (.setUint32 dv 8 val-data-offset true)          ;; vals data start

    ;; Write key index and data
    (loop [i 0
           data-pos key-data-offset]
      (when (< i n)
        (let [key (nth keys i)
              key-len (.-length key)
              aligned-pos (align-up data-pos)]
          ;; Index entry: offset (relative to key-data-offset) and length
          (.setUint16 dv (+ key-index-offset (* i 4)) (- aligned-pos key-data-offset) true)
          (.setUint16 dv (+ key-index-offset (* i 4) 2) key-len true)
          ;; Copy key data
          (.set u8 key aligned-pos)
          (recur (inc i) (+ aligned-pos key-len)))))

    ;; Write value index and data
    (loop [i 0
           data-pos val-data-offset]
      (when (< i n)
        (let [val (nth vals i)
              val-len (.-length val)]
          ;; Index entry
          (.setUint16 dv (+ val-index-offset (* i 4)) (- data-pos val-data-offset) true)
          (.setUint16 dv (+ val-index-offset (* i 4) 2) val-len true)
          ;; Copy value data
          (.set u8 val data-pos)
          (recur (inc i) (+ data-pos val-len)))))

    {:sab sab
     :count n
     :chunk-size chunk-size
     :key-index-offset key-index-offset
     :key-data-offset key-data-offset
     :val-index-offset val-index-offset
     :val-data-offset val-data-offset})))

;;-----------------------------------------------------------------------------
;; Chunk Reading
;;-----------------------------------------------------------------------------

(defn chunk-count
  "Get number of entries in chunk."
  [^js dv]
  (.getUint8 dv 0))

(defn get-key-bytes
  "Get key bytes at index i from chunk."
  [^js sab ^js dv key-index-offset key-data-offset i]
  (let [idx-pos (+ key-index-offset (* i 4))
        rel-offset (.getUint16 dv idx-pos true)
        key-len (.getUint16 dv (+ idx-pos 2) true)]
    (js/Uint8Array. sab (+ key-data-offset rel-offset) key-len)))

(defn get-val-bytes
  "Get value bytes at index i from chunk."
  [^js sab ^js dv val-index-offset val-data-offset i]
  (let [idx-pos (+ val-index-offset (* i 4))
        rel-offset (.getUint16 dv idx-pos true)
        val-len (.getUint16 dv (+ idx-pos 2) true)]
    (js/Uint8Array. sab (+ val-data-offset rel-offset) val-len)))

;;-----------------------------------------------------------------------------
;; SIMD-Optimized Chunk Operations
;;-----------------------------------------------------------------------------

(defn chunk-find-key
  "Find key in chunk using batch comparison.
   Returns index or -1 if not found."
  [^js sab ^js dv target-key-bytes key-index-offset key-data-offset count]
  (let [target-len (.-length target-key-bytes)

        ;; Step 1: Collect all keys with matching length
        ;; (This could be SIMD-accelerated: compare 8 lengths at once)
        matching-indices
        (loop [i 0 acc []]
          (if (>= i count)
            acc
            (let [idx-pos (+ key-index-offset (* i 4))
                  key-len (.getUint16 dv (+ idx-pos 2) true)]
              (recur (inc i)
                     (if (== key-len target-len)
                       (conj acc i)
                       acc)))))]

    (if (empty? matching-indices)
      -1
      ;; Step 2: Batch compare matching keys
      (let [candidates (make-array (clojure.core/count matching-indices))]
        (dotimes [j (clojure.core/count matching-indices)]
          (let [i (nth matching-indices j)]
            (aset candidates j
                  (get-key-bytes sab dv key-index-offset key-data-offset i))))

        (let [match-idx (simd/batch-bytes-equal? target-key-bytes candidates)]
          (if (== match-idx -1)
            -1
            (nth matching-indices match-idx)))))))

(defn chunk-filter-by-key-prefix
  "Find all entries where key starts with prefix.
   Returns vector of indices. SIMD-friendly for batch prefix matching."
  [^js sab ^js dv prefix-bytes key-index-offset key-data-offset count]
  (let [prefix-len (.-length prefix-bytes)]
    (loop [i 0 acc []]
      (if (>= i count)
        acc
        (let [key-bytes (get-key-bytes sab dv key-index-offset key-data-offset i)]
          (recur (inc i)
                 (if (and (>= (.-length key-bytes) prefix-len)
                          ;; Compare prefix
                          (let [key-prefix (js/Uint8Array. (.-buffer key-bytes)
                                                          (.-byteOffset key-bytes)
                                                          prefix-len)]
                            (simd/bytes-equal? prefix-bytes key-prefix)))
                   (conj acc i)
                   acc)))))))

(defn chunk-transform-values
  "Apply transform function to all values in chunk.
   Returns new chunk with transformed values.

   transform-fn: (fn [value-bytes] new-value-bytes)

   This is where SIMD shines for numeric transforms:
   - Load 4 float64 values (32 bytes) into v128
   - Apply operation to all 4 at once
   - Store results"
  [chunk transform-fn]
  (let [{:keys [sab count key-index-offset key-data-offset
                val-index-offset val-data-offset]} chunk
        dv (js/DataView. sab)

        ;; Extract current keys (unchanged)
        keys (vec (for [i (range count)]
                    (get-key-bytes sab dv key-index-offset key-data-offset i)))

        ;; Transform values
        new-vals (vec (for [i (range count)]
                        (let [old-val (get-val-bytes sab dv val-index-offset val-data-offset i)]
                          (transform-fn old-val))))]

    ;; Create new chunk with transformed values
    (create-kv-chunk keys new-vals)))

(defn chunk-reduce
  "Reduce over chunk entries.

   rf: (fn [acc key-bytes val-bytes] new-acc)

   Iterates through chunk in order, calling rf for each entry."
  [chunk rf init]
  (let [{:keys [sab count key-index-offset key-data-offset
                val-index-offset val-data-offset]} chunk
        dv (js/DataView. sab)]
    (loop [i 0 acc init]
      (if (or (>= i count) (reduced? acc))
        (if (reduced? acc) @acc acc)
        (let [k (get-key-bytes sab dv key-index-offset key-data-offset i)
              v (get-val-bytes sab dv val-index-offset val-data-offset i)]
          (recur (inc i) (rf acc k v)))))))

;;-----------------------------------------------------------------------------
;; Integration with ClojureScript Protocols
;;-----------------------------------------------------------------------------

;; Placeholder for actual deftype - shows the interface
(comment
  (deftype ChunkedKVSeq [chunk rest-chunks deserialize-fn]
    ISeqable
    (-seq [this] this)

    ISeq
    (-first [_]
      (let [{:keys [sab key-index-offset key-data-offset
                    val-index-offset val-data-offset]} chunk
            dv (js/DataView. sab)
            k (get-key-bytes sab dv key-index-offset key-data-offset 0)
            v (get-val-bytes sab dv val-index-offset val-data-offset 0)]
        (MapEntry. (deserialize-fn k) (deserialize-fn v) nil)))

    (-rest [_]
      ;; Return rest of chunk, then rest-chunks
      ...)

    IChunkedSeq
    (-chunked-first [_]
      ;; Return ArrayChunk of first 32 entries
      (let [{:keys [sab count key-index-offset key-data-offset
                    val-index-offset val-data-offset]} chunk
            dv (js/DataView. sab)
            entries (object-array count)]
        (dotimes [i count]
          (let [k (get-key-bytes sab dv key-index-offset key-data-offset i)
                v (get-val-bytes sab dv val-index-offset val-data-offset i)]
            (aset entries i (MapEntry. (deserialize-fn k) (deserialize-fn v) nil))))
        (ArrayChunk. entries 0 count)))

    (-chunked-rest [_]
      ;; Return rest of chunks
      rest-chunks)

    IReduce
    (-reduce [_ f init]
      ;; Efficient reduce over chunks without creating MapEntry objects
      ;; until absolutely necessary
      ...)))
