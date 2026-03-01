(ns cljs-thread.eve.map
  "EVE persistent HAMT map backed by SharedArrayBuffer.

   All node data lives in slab-class-specific SharedArrayBuffers.
   Node offsets are slab-qualified: [class_idx:3 | block_idx:29].
   Read/write helpers transparently route to the correct slab."
  (:refer-clojure :exclude [hash-map])
  (:require
   [cljs-thread.eve.deftype-proto.alloc :as eve-alloc]
   [cljs-thread.eve.deftype-proto.data :as d]
   [cljs-thread.eve.deftype-proto.xray :as eve-xray]
   [cljs-thread.eve.deftype-proto.serialize :as ser]
   [cljs-thread.eve.shared-atom :as atom]))

;; Forward declarations
(declare ->EveHashMap ->TransientEveHashMap EveHashMap TransientEveHashMap)
(declare empty-hash-map)
(declare hamt-dissoc make-eve-hash-map)

;;=============================================================================
;; Constants
;;=============================================================================

(def ^:const SHIFT_STEP 5)
(def ^:const MASK 0x1f)

(def ^:const NODE_TYPE_BITMAP 1)
(def ^:const NODE_TYPE_COLLISION 3)

;; Node header: type:u8 + flags:u8 + kv_total_size:u16 + data_bitmap:u32 + node_bitmap:u32 = 12
(def ^:const NODE_HEADER_SIZE 12)
(def ^:const COLLISION_HEADER_SIZE 8)

;; EveHashMap header: type-id:u8 + pad:u8 + pad:u16 + count:i32 + root-off:i32 = 12
(def ^:const EveHashMap-type-id 0xED)
(def ^:const SABMAPROOT_CNT_OFFSET 4)
(def ^:const SABMAPROOT_ROOT_OFF_OFFSET 8)

;;=============================================================================
;; Pool System — simplified for slab allocator
;;=============================================================================
;; In the slab world, pools just hold slab-qualified offsets.
;; No descriptor-idx tracking needed — free! takes a slab-qualified offset.
;; Size classes map 1:1 to slab classes.

(def ^:private ^:const MAX_POOL_SIZE 512)
(def ^:private ^:const BATCH_ALLOC_SIZE 64)

(defn- size-class-for [n]
  (cond (<= n 64) 64 (<= n 128) 128 (<= n 256) 256 (<= n 512) 512 :else nil))

;; Per-class pools — each entry is just a slab-qualified offset (i32).
(def ^:private pool-64 #js [])
(def ^:private pool-128 #js [])
(def ^:private pool-256 #js [])
(def ^:private pool-512 #js [])

(defn reset-pools! []
  (set! pool-64 #js [])
  (set! pool-128 #js [])
  (set! pool-256 #js [])
  (set! pool-512 #js [])
  (when alloc-debug-set
    (.clear alloc-debug-set)))

(defn drain-pools! []
  (doseq [pool [pool-64 pool-128 pool-256 pool-512]]
    (dotimes [i (.-length pool)]
      (eve-alloc/free! (aget pool i))))
  (set! pool-64 #js [])
  (set! pool-128 #js [])
  (set! pool-256 #js [])
  (set! pool-512 #js []))

(def ^:private ^:mutable pool-debug? false)
(def ^:private ^:mutable pool-disabled? false)  ;; Pool enabled - fixed retirement corruption

;; Pool tracking now centralized in xray.cljs - use eve-xray/track-allocate! etc.

(defn- pool-get! [size-class]
  (when-not pool-disabled?
    (let [stack (case size-class
                  64 pool-64  128 pool-128
                  256 pool-256  512 pool-512
                  nil)]
      (when (and stack (pos? (.-length stack)))
        (let [offset (.pop stack)]
          (when pool-debug?
            (println "POOL-GET:" size-class "→" offset))
          ;; Verify this offset is not in-use (via xray)
          (eve-xray/track-check-pool-get! offset)
          offset)))))

(defn enable-pool-debug! [] (set! pool-debug? true))
(defn disable-pool-debug! [] (set! pool-debug? false))
(defn enable-pool! [] (set! pool-disabled? false))
(defn disable-pool! [] (set! pool-disabled? true))

;; Deprecated - use eve-xray/enable-pool-tracking! and eve-xray/disable-pool-tracking!
(defn enable-pool-track! []
  (eve-xray/enable-pool-tracking!))
(defn disable-pool-track! []
  (eve-xray/disable-pool-tracking!))

(defn- pool-put! [size-class slab-offset]
  (let [stack (case size-class
                64 pool-64  128 pool-128
                256 pool-256  512 pool-512
                nil)]
    (when (and stack (< (.-length stack) MAX_POOL_SIZE))
      (when pool-debug?
        (println "POOL-PUT:" size-class "←" slab-offset))
      (.push stack slab-offset)
      true)))

(def ^:private ^:mutable alloc-debug-set nil)

(defn- alloc-bytes!
  "Allocate n bytes, rounded up to nearest size class.
   Returns a slab-qualified offset."
  [n]
  (when (nil? alloc-debug-set)
    (set! alloc-debug-set (js/Set.)))
  (let [size-class (size-class-for n)]
    (if size-class
      ;; Try pool first
      (if-let [pooled (pool-get! size-class)]
        (do (when (.has alloc-debug-set pooled)
              (throw (js/Error. (str "[alloc-bytes! POOL] DOUBLE-ALLOC! offset=" pooled " size=" n))))
            (.add alloc-debug-set pooled)
            (eve-xray/track-allocate! pooled)
            pooled)
        ;; Pool miss — batch alloc
        (let [results (eve-alloc/batch-alloc size-class BATCH_ALLOC_SIZE)
              results (if (and results (pos? (.-length results)))
                        results
                        (do (drain-pools!)
                            (eve-alloc/batch-alloc size-class BATCH_ALLOC_SIZE)))
              len (if results (.-length results) 0)]
          (when (== len 0)
            (throw (js/Error. (str "Slab map alloc failed: out of memory for " size-class " bytes"))))
          ;; Put extras into pool
          (loop [i 1]
            (when (< i len)
              (pool-put! size-class (aget results i))
              (recur (inc i))))
          ;; Return first - track as allocated
          (let [first-off (aget results 0)]
            (when (.has alloc-debug-set first-off)
              (throw (js/Error. (str "[alloc-bytes! BATCH] DOUBLE-ALLOC! offset=" first-off " size=" n))))
            (.add alloc-debug-set first-off)
            (eve-xray/track-allocate! first-off)
            first-off)))
      ;; Too large for pooling — direct alloc
      (let [off (eve-alloc/alloc-offset n)]
        (eve-xray/track-allocate! off)
        off))))

(defn- maybe-pool-or-free!
  "Try to add a freed block to the pool. If pool is full, actually free it."
  [slab-offset size]
  (eve-xray/track-recycle! slab-offset)
  ;; Remove from debug tracking when freed
  (when alloc-debug-set
    (.delete alloc-debug-set slab-offset))
  (let [size-class (size-class-for size)]
    (if (and size-class (pool-put! size-class slab-offset))
      true
      (do (eve-alloc/free! slab-offset) nil))))

;;=============================================================================
;; Bit operations (pure JS, avoids WASM boundary crossing)
;;=============================================================================

(defn- popcount32 [n]
  (let [n (- (bit-and n 0xFFFFFFFF) (bit-and (unsigned-bit-shift-right n 1) 0x55555555))
        n (+ (bit-and n 0x33333333) (bit-and (unsigned-bit-shift-right n 2) 0x33333333))
        n (bit-and (+ n (unsigned-bit-shift-right n 4)) 0x0f0f0f0f)]
    (unsigned-bit-shift-right (js* "(~{} * 0x01010101)" n) 24)))

(defn- mask-hash [kh shift]
  (bit-and (unsigned-bit-shift-right kh shift) MASK))

(defn- bitpos [kh shift]
  (bit-shift-left 1 (mask-hash kh shift)))

(defn- has-bit? [bitmap bit]
  (not (zero? (bit-and bitmap bit))))

(defn- get-index [bitmap bit]
  (popcount32 (bit-and bitmap (dec bit))))

;;=============================================================================
;; Node read helpers — resolve slab-qualified offset, then read fields
;;=============================================================================
;; Each function resolves the slab offset once via eve-alloc/resolve-dv!,
;; then reads fields from the resolved (DataView, base-byte-offset) pair.
;; This avoids re-decoding the slab class for each field access within a node.

(defn- read-node-type
  "Read node type byte from a slab-qualified offset."
  ^number [^number slab-off]
  (let [base (eve-alloc/resolve-dv! slab-off)]
    (.getUint8 eve-alloc/resolved-dv base)))

(defn- read-data-bitmap
  "Read data bitmap (u32 at offset+4)."
  ^number [^number slab-off]
  (let [base (eve-alloc/resolve-dv! slab-off)]
    (.getUint32 eve-alloc/resolved-dv (+ base 4) true)))

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

(defn- read-kv-total-size
  "Read cached kv-total-size from header bytes 2-3."
  ^number [^number slab-off]
  (let [base (eve-alloc/resolve-dv! slab-off)]
    (.getUint16 eve-alloc/resolved-dv (+ base 2) true)))

(defn- hashes-start-off
  "Byte offset within node where hash array starts (after children)."
  ^number [^number node-bm]
  (+ NODE_HEADER_SIZE (* 4 (popcount32 node-bm))))

(defn- kv-data-start-off
  "Byte offset within node where KV data starts."
  ^number [^number data-bm ^number node-bm]
  (+ NODE_HEADER_SIZE (* 4 (popcount32 node-bm)) (* 4 (popcount32 data-bm))))

;;=============================================================================
;; Resolved-node access helpers
;;=============================================================================
;; After calling resolve-dv!/resolve-u8!, use these to read fields at
;; (resolved-dv, resolved-base + field-offset) without re-resolving.
;; Callers MUST call resolve-dv! or resolve-u8! before using these.

(defn- r-get-u8 ^number [^number off]
  (.getUint8 eve-alloc/resolved-dv (+ eve-alloc/resolved-base off)))

(defn- r-get-u16 ^number [^number off]
  (.getUint16 eve-alloc/resolved-dv (+ eve-alloc/resolved-base off) true))

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

;;=============================================================================
;; KV read/write helpers (work with resolved node)
;;=============================================================================

(defn- skip-kv-at
  "Skip a KV pair at resolved position, returning offset-within-node after it."
  ^number [^number pos-in-node]
  (let [key-len (r-get-u32 pos-in-node)
        val-off (+ pos-in-node 4 key-len)
        val-len (r-get-u32 val-off)]
    (+ val-off 4 val-len)))

(defn- calc-kv-size [^js key-bytes ^js val-bytes]
  (+ 4 (.-length key-bytes) 4 (.-length val-bytes)))

(defn- key-bytes-match?
  "Compare serialized key bytes at a resolved position with kb.
   Must call resolve-u8! for the target node before calling this."
  [^number pos-in-node ^js kb]
  (let [stored-len (r-get-u32 pos-in-node)]
    (when (== stored-len (.-length kb))
      (let [start (+ eve-alloc/resolved-base pos-in-node 4)
            u8 eve-alloc/resolved-u8]
        (loop [i 0]
          (if (>= i stored-len)
            true
            (if (not= (aget u8 (+ start i)) (aget kb i))
              false
              (recur (inc i)))))))))

(defn- write-kv!
  "Write a KV pair at pos-in-node within a resolved node.
   Returns offset-within-node after written data."
  ^number [^number pos-in-node ^js key-bytes ^js val-bytes]
  (r-set-u32 pos-in-node (.-length key-bytes))
  (when (pos? (.-length key-bytes))
    (let [dst-start (+ eve-alloc/resolved-base pos-in-node 4)]
      (.set eve-alloc/resolved-u8 key-bytes dst-start)))
  (let [val-off (+ pos-in-node 4 (.-length key-bytes))]
    (r-set-u32 val-off (.-length val-bytes))
    (when (pos? (.-length val-bytes))
      (let [dst-start (+ eve-alloc/resolved-base val-off 4)]
        (.set eve-alloc/resolved-u8 val-bytes dst-start)))
    (+ val-off 4 (.-length val-bytes))))

(defn- copy-from-sab
  "Copy bytes from a slab-qualified offset + byte-within-block into a new Uint8Array."
  [^number slab-off ^number byte-off ^number len]
  (let [src (eve-alloc/read-bytes slab-off byte-off len)
        dst (js/Uint8Array. len)]
    (.set dst src)
    dst))

;;=============================================================================
;; Node construction
;;=============================================================================
;; All constructors allocate via alloc-bytes!, then resolve the new offset
;; and write the node structure. Child pointers stored in nodes are
;; slab-qualified offsets, transparently routing reads to the right slab.

(defn- make-single-entry-node!
  "Create bitmap node with exactly 1 data entry and 0 children."
  [data-bm kh kb vb]
  (let [kv-size (calc-kv-size kb vb)
        node-size (+ NODE_HEADER_SIZE 4 kv-size)
        slab-off (alloc-bytes! node-size)]
    (eve-alloc/resolve-u8! slab-off)
    (r-set-u8 0 NODE_TYPE_BITMAP)
    (r-set-u8 1 0)
    (r-set-u16 2 kv-size)
    (r-set-u32 4 data-bm)
    (r-set-u32 8 0)  ;; node-bm = 0
    (r-set-i32 NODE_HEADER_SIZE kh)
    (write-kv! (+ NODE_HEADER_SIZE 4) kb vb)
    slab-off))

(defn- make-two-entry-node!
  "Create bitmap node with exactly 2 data entries and 0 children."
  [data-bm kh1 kb1 vb1 kh2 kb2 vb2]
  (let [kv-size (+ (calc-kv-size kb1 vb1) (calc-kv-size kb2 vb2))
        node-size (+ NODE_HEADER_SIZE 8 kv-size)
        slab-off (alloc-bytes! node-size)]
    (eve-alloc/resolve-u8! slab-off)
    (r-set-u8 0 NODE_TYPE_BITMAP)
    (r-set-u8 1 0)
    (r-set-u16 2 kv-size)
    (r-set-u32 4 data-bm)
    (r-set-u32 8 0)
    (r-set-i32 NODE_HEADER_SIZE kh1)
    (r-set-i32 (+ NODE_HEADER_SIZE 4) kh2)
    (let [next-pos (write-kv! (+ NODE_HEADER_SIZE 8) kb1 vb1)]
      (write-kv! next-pos kb2 vb2))
    slab-off))

(defn- make-single-child-node!
  "Create bitmap node with 0 data entries and 1 child."
  [node-bm child-off]
  (let [node-size (+ NODE_HEADER_SIZE 4)
        slab-off (alloc-bytes! node-size)]
    ;; Sanity check: child should not equal self
    (when (== slab-off child-off)
      (throw (js/Error. (str "[make-single-child-node!] SELF-REF! slab-off=" slab-off " child-off=" child-off))))
    (eve-alloc/resolve-u8! slab-off)
    (r-set-u8 0 NODE_TYPE_BITMAP)
    (r-set-u8 1 0)
    (r-set-u16 2 0)
    (r-set-u32 4 0)
    (r-set-u32 8 node-bm)
    (r-set-i32 NODE_HEADER_SIZE child-off)
    slab-off))

(defn- make-child-and-entry-node!
  "Create bitmap node with 1 data entry and 1 child."
  [data-bm node-bm child-off kh kb vb]
  (let [kv-size (calc-kv-size kb vb)
        node-size (+ NODE_HEADER_SIZE 4 4 kv-size)
        slab-off (alloc-bytes! node-size)]
    ;; Sanity check: child should not equal self
    (when (== slab-off child-off)
      (throw (js/Error. (str "[make-child-and-entry-node!] SELF-REF! slab-off=" slab-off " child-off=" child-off))))
    (eve-alloc/resolve-u8! slab-off)
    (r-set-u8 0 NODE_TYPE_BITMAP)
    (r-set-u8 1 0)
    (r-set-u16 2 kv-size)
    (r-set-u32 4 data-bm)
    (r-set-u32 8 node-bm)
    (r-set-i32 NODE_HEADER_SIZE child-off)
    (r-set-i32 (+ NODE_HEADER_SIZE 4) kh)
    (write-kv! (+ NODE_HEADER_SIZE 8) kb vb)
    slab-off))

(defn- make-bitmap-node-with-raw-kv!
  "Create bitmap node, copying data from src node.
   If update-child-idx >= 0, replaces that child with new-child-off.
   src-slab-off and the new node may be in different slabs."
  ([data-bm node-bm src-slab-off src-data-bm src-node-bm]
   (make-bitmap-node-with-raw-kv! data-bm node-bm src-slab-off src-data-bm src-node-bm -1 -1))
  ([data-bm node-bm src-slab-off src-data-bm src-node-bm update-child-idx new-child-off]
   (let [child-count (popcount32 node-bm)
         data-count (popcount32 data-bm)
         ;; Read kv-total-size from source node header
         existing-kv-size (let [base (eve-alloc/resolve-dv! src-slab-off)]
                            (.getUint16 eve-alloc/resolved-dv (+ base 2) true))
         ;; If cached size is 0, compute it
         existing-kv-size (if (pos? existing-kv-size)
                            existing-kv-size
                            (let [base eve-alloc/resolved-base
                                  kv-start-off (kv-data-start-off src-data-bm src-node-bm)
                                  dc (popcount32 src-data-bm)]
                              (loop [i 0 pos kv-start-off]
                                (if (>= i dc)
                                  (- pos kv-start-off)
                                  (recur (inc i) (skip-kv-at pos))))))
         node-size (+ NODE_HEADER_SIZE (* 4 child-count) (* 4 data-count) existing-kv-size)
         dst-slab-off (alloc-bytes! node-size)]
     ;; Copy entire source node to destination
     (eve-alloc/copy-block! dst-slab-off src-slab-off node-size)
     ;; Patch child pointer if requested
     (when (>= update-child-idx 0)
       ;; Sanity check: new child should not equal self
       (when (== dst-slab-off new-child-off)
         (throw (js/Error. (str "[make-bitmap-node-with-raw-kv!] SELF-REF! dst=" dst-slab-off " child=" new-child-off))))
       (eve-alloc/write-i32! dst-slab-off (+ NODE_HEADER_SIZE (* update-child-idx 4)) new-child-off))
     dst-slab-off)))

(defn- make-bitmap-node-with-added-kv!
  "Add a new KV entry to a bitmap node. Returns new slab-qualified offset."
  [new-data-bm node-bm src-slab-off src-data-bm src-node-bm data-idx kh kb vb]
  (let [kv-size (calc-kv-size kb vb)
        child-count (popcount32 node-bm)
        new-data-count (popcount32 new-data-bm)
        ;; Read existing kv size from source
        src-base (eve-alloc/resolve-u8! src-slab-off)
        existing-kv-size (let [cached (r-get-u16 2)]
                           (if (pos? cached) cached
                             (let [dc (popcount32 src-data-bm)
                                   kv-s (kv-data-start-off src-data-bm src-node-bm)]
                               (loop [i 0 pos kv-s]
                                 (if (>= i dc) (- pos kv-s) (recur (inc i) (skip-kv-at pos)))))))
        total-kv-size (+ existing-kv-size kv-size)
        node-size (+ NODE_HEADER_SIZE (* 4 child-count) (* 4 new-data-count) total-kv-size)
        dst-slab-off (alloc-bytes! node-size)]
    ;; Write header
    (eve-alloc/resolve-u8! dst-slab-off)
    (r-set-u8 0 NODE_TYPE_BITMAP)
    (r-set-u8 1 0)
    (r-set-u16 2 total-kv-size)
    (r-set-u32 4 new-data-bm)
    (r-set-u32 8 node-bm)
    ;; Copy children from source
    (dotimes [i child-count]
      (let [child (eve-alloc/read-i32 src-slab-off (+ NODE_HEADER_SIZE (* i 4)))]
        (r-set-i32 (+ NODE_HEADER_SIZE (* i 4)) child)))
    ;; Build hash array: insert kh at data-idx, copy rest from source
    (let [src-h-off (hashes-start-off src-node-bm)
          dst-h-off (hashes-start-off node-bm)
          old-data-count (popcount32 src-data-bm)]
      (loop [src-i 0 dst-i 0]
        (when (< dst-i new-data-count)
          (if (== dst-i data-idx)
            (do (r-set-i32 (+ dst-h-off (* dst-i 4)) kh)
                (recur src-i (inc dst-i)))
            (do (r-set-i32 (+ dst-h-off (* dst-i 4))
                           (eve-alloc/read-i32 src-slab-off (+ src-h-off (* src-i 4))))
                (recur (inc src-i) (inc dst-i)))))))
    ;; Build KV data: insert new KV at data-idx, copy rest from source
    (let [src-kv-off (kv-data-start-off src-data-bm src-node-bm)
          dst-kv-off (kv-data-start-off new-data-bm node-bm)
          old-data-count (popcount32 src-data-bm)]
      ;; Resolve source for reading
      (eve-alloc/resolve-u8! src-slab-off)
      (let [src-positions (loop [i 0 pos src-kv-off acc #js []]
                            (if (>= i old-data-count)
                              acc
                              (let [next (skip-kv-at pos)]
                                (.push acc #js [pos (- next pos)])
                                (recur (inc i) next acc))))]
        ;; Resolve dst for writing
        (eve-alloc/resolve-u8! dst-slab-off)
        (loop [src-i 0 dst-i 0 dst-pos dst-kv-off]
          (when (< dst-i (inc old-data-count))
            (if (== dst-i data-idx)
              (let [next-pos (write-kv! dst-pos kb vb)]
                (recur src-i (inc dst-i) next-pos))
              (let [entry (aget src-positions src-i)
                    src-pos (aget entry 0)
                    kv-len (aget entry 1)
                    ;; Copy KV bytes from source to dest
                    src-bytes (eve-alloc/read-bytes src-slab-off src-pos kv-len)]
                (.set eve-alloc/resolved-u8 src-bytes (+ eve-alloc/resolved-base dst-pos))
                (recur (inc src-i) (inc dst-i) (+ dst-pos kv-len))))))))
    dst-slab-off))

(defn- make-bitmap-node-with-replaced-kv!
  "Replace a KV entry in a bitmap node. Returns new slab-qualified offset."
  [data-bm node-bm src-slab-off src-node-bm data-idx kh kb vb src-pos-in-node]
  (let [new-kv-size (calc-kv-size kb vb)
        ;; Read old kv size at the replace position from source
        src-base (eve-alloc/resolve-u8! src-slab-off)
        old-key-len (r-get-u32 src-pos-in-node)
        old-val-off (+ src-pos-in-node 4 old-key-len)
        old-val-len (r-get-u32 old-val-off)
        old-kv-size (+ 4 old-key-len 4 old-val-len)
        size-diff (- new-kv-size old-kv-size)
        ;; Total KV size
        existing-kv-size (let [cached (r-get-u16 2)]
                           (if (pos? cached) cached
                             (let [dc (popcount32 data-bm)
                                   kv-s (kv-data-start-off data-bm src-node-bm)]
                               (loop [i 0 pos kv-s]
                                 (if (>= i dc) (- pos kv-s) (recur (inc i) (skip-kv-at pos)))))))
        child-count (popcount32 node-bm)
        data-count (popcount32 data-bm)
        node-size (+ NODE_HEADER_SIZE (* 4 child-count) (* 4 data-count) existing-kv-size size-diff)]
    (if (zero? size-diff)
      ;; Same size — copy entire node, then overwrite the value bytes
      (let [dst-slab-off (alloc-bytes! node-size)]
        (eve-alloc/copy-block! dst-slab-off src-slab-off node-size)
        ;; Overwrite value in the copy
        (let [val-off (+ src-pos-in-node 4 old-key-len)]
          (eve-alloc/write-i32! dst-slab-off val-off (.-length vb))
          (eve-alloc/write-bytes! dst-slab-off (+ val-off 4) vb))
        ;; Update hash if changed
        (let [h-off (+ (hashes-start-off node-bm) (* data-idx 4))]
          (eve-alloc/write-i32! dst-slab-off h-off kh))
        dst-slab-off)
      ;; Different size — rebuild node
      (let [dst-slab-off (alloc-bytes! node-size)]
        (eve-alloc/resolve-u8! dst-slab-off)
        (r-set-u8 0 NODE_TYPE_BITMAP)
        (r-set-u8 1 0)
        (r-set-u16 2 (+ existing-kv-size size-diff))
        (r-set-u32 4 data-bm)
        (r-set-u32 8 node-bm)
        ;; Copy children
        (dotimes [i child-count]
          (r-set-i32 (+ NODE_HEADER_SIZE (* i 4))
                     (eve-alloc/read-i32 src-slab-off (+ NODE_HEADER_SIZE (* i 4)))))
        ;; Copy/update hash array
        (let [h-off (hashes-start-off node-bm)]
          (dotimes [i data-count]
            (r-set-i32 (+ h-off (* i 4))
                       (if (== i data-idx)
                         kh
                         (eve-alloc/read-i32 src-slab-off (+ h-off (* i 4)))))))
        ;; Copy KV data with replaced entry
        (let [src-kv-off (kv-data-start-off data-bm node-bm)
              dst-kv-off (kv-data-start-off data-bm node-bm)]
          ;; Read source positions
          (eve-alloc/resolve-u8! src-slab-off)
          (let [positions (loop [i 0 pos src-kv-off acc #js []]
                            (if (>= i data-count)
                              acc
                              (let [next (skip-kv-at pos)]
                                (.push acc #js [pos (- next pos)])
                                (recur (inc i) next acc))))]
            ;; Write to destination
            (eve-alloc/resolve-u8! dst-slab-off)
            (loop [i 0 dst-pos dst-kv-off]
              (when (< i data-count)
                (if (== i data-idx)
                  (let [next-pos (write-kv! dst-pos kb vb)]
                    (recur (inc i) next-pos))
                  (let [entry (aget positions i)
                        src-pos (aget entry 0)
                        kv-len (aget entry 1)
                        src-bytes (eve-alloc/read-bytes src-slab-off src-pos kv-len)]
                    (.set eve-alloc/resolved-u8 src-bytes (+ eve-alloc/resolved-base dst-pos))
                    (recur (inc i) (+ dst-pos kv-len))))))))
        dst-slab-off))))

(defn- make-bitmap-node-removing-kv!
  "Remove a KV entry from src, optionally add a child. Returns new slab-qualified offset."
  [new-data-bm new-node-bm src-slab-off src-data-bm src-node-bm remove-idx new-child-idx new-child-off]
  (let [src-base (eve-alloc/resolve-u8! src-slab-off)
        existing-kv-size (let [cached (r-get-u16 2)]
                           (if (pos? cached) cached
                             (let [dc (popcount32 src-data-bm)
                                   kv-s (kv-data-start-off src-data-bm src-node-bm)]
                               (loop [i 0 pos kv-s]
                                 (if (>= i dc) (- pos kv-s) (recur (inc i) (skip-kv-at pos)))))))
        ;; Calculate size of removed KV
        removed-kv-size (let [kv-start (kv-data-start-off src-data-bm src-node-bm)]
                          (loop [i 0 pos kv-start]
                            (if (== i remove-idx)
                              (- (skip-kv-at pos) pos)
                              (recur (inc i) (skip-kv-at pos)))))
        final-kv-size (- existing-kv-size removed-kv-size)
        new-child-count (popcount32 new-node-bm)
        new-data-count (popcount32 new-data-bm)
        node-size (+ NODE_HEADER_SIZE (* 4 new-child-count) (* 4 new-data-count) final-kv-size)
        dst-slab-off (alloc-bytes! node-size)]
    (eve-alloc/resolve-u8! dst-slab-off)
    (r-set-u8 0 NODE_TYPE_BITMAP)
    (r-set-u8 1 0)
    (r-set-u16 2 final-kv-size)
    (r-set-u32 4 new-data-bm)
    (r-set-u32 8 new-node-bm)
    ;; Build children: copy from src, insert new child at new-child-idx
    (let [src-child-count (popcount32 src-node-bm)]
      (loop [src-i 0 dst-i 0]
        (when (< dst-i new-child-count)
          (if (== dst-i new-child-idx)
            (do (r-set-i32 (+ NODE_HEADER_SIZE (* dst-i 4)) new-child-off)
                (recur src-i (inc dst-i)))
            (do (r-set-i32 (+ NODE_HEADER_SIZE (* dst-i 4))
                           (eve-alloc/read-i32 src-slab-off (+ NODE_HEADER_SIZE (* src-i 4))))
                (recur (inc src-i) (inc dst-i)))))))
    ;; Build hash array: skip removed index
    (let [src-h-off (hashes-start-off src-node-bm)
          dst-h-off (hashes-start-off new-node-bm)]
      (loop [src-i 0 dst-i 0]
        (when (< dst-i new-data-count)
          (if (== src-i remove-idx)
            (recur (inc src-i) dst-i)
            (do (r-set-i32 (+ dst-h-off (* dst-i 4))
                           (eve-alloc/read-i32 src-slab-off (+ src-h-off (* src-i 4))))
                (recur (inc src-i) (inc dst-i)))))))
    ;; Build KV data: skip removed entry
    (eve-alloc/resolve-u8! src-slab-off)
    (let [src-kv-off (kv-data-start-off src-data-bm src-node-bm)
          old-dc (popcount32 src-data-bm)
          positions (loop [i 0 pos src-kv-off acc #js []]
                      (if (>= i old-dc)
                        acc
                        (let [next (skip-kv-at pos)]
                          (.push acc #js [pos (- next pos)])
                          (recur (inc i) next acc))))]
      (eve-alloc/resolve-u8! dst-slab-off)
      (let [dst-kv-off (kv-data-start-off new-data-bm new-node-bm)]
        (loop [src-i 0 dst-pos dst-kv-off]
          (when (< src-i old-dc)
            (if (== src-i remove-idx)
              (recur (inc src-i) dst-pos)
              (let [entry (aget positions src-i)
                    src-pos (aget entry 0)
                    kv-len (aget entry 1)
                    src-bytes (eve-alloc/read-bytes src-slab-off src-pos kv-len)]
                (.set eve-alloc/resolved-u8 src-bytes (+ eve-alloc/resolved-base dst-pos))
                (recur (inc src-i) (+ dst-pos kv-len))))))))
    dst-slab-off))

(defn- make-collision-node!
  "Create a collision node. entries is seq of [kh kb vb] triples."
  [kh entries]
  (let [cnt (count entries)
        kv-size (reduce (fn [acc [_kh kb vb]] (+ acc (calc-kv-size kb vb))) 0 entries)
        node-size (+ COLLISION_HEADER_SIZE kv-size)
        slab-off (alloc-bytes! node-size)]
    (eve-alloc/resolve-u8! slab-off)
    (r-set-u8 0 NODE_TYPE_COLLISION)
    (r-set-u8 1 cnt)
    (r-set-u16 2 0)
    (r-set-i32 4 kh)
    (loop [es (seq entries) pos COLLISION_HEADER_SIZE]
      (when es
        (let [[_kh kb vb] (first es)
              next-pos (write-kv! pos kb vb)]
          (recur (next es) next-pos))))
    slab-off))

;;=============================================================================
;; Free / Retire
;;=============================================================================

(defn- free-hamt-node!
  "Recursively free a HAMT node and all its children.
   NOTE: This does NOT use the pool because the retirement implementation
   does not do proper tree-diffing. It frees the entire old tree, which may
   include nodes shared with the new tree. Pooling such nodes would corrupt
   the current tree when the pooled offsets are reused."
  [slab-off]
  (when (not= slab-off eve-alloc/NIL_OFFSET)
    (let [node-type (read-node-type slab-off)]
      (case node-type
        ;; Bitmap node — free children first
        1 (let [node-bm (read-node-bitmap slab-off)
                child-count (popcount32 node-bm)]
            (dotimes [i child-count]
              (let [child-off (read-child-offset slab-off i)]
                (free-hamt-node! child-off)))
            ;; Don't pool - directly free to avoid corruption from shared nodes
            (eve-alloc/free! slab-off))
        ;; Collision node — no children
        3 (eve-alloc/free! slab-off)
        ;; Unknown
        (eve-alloc/free! slab-off)))))

;;=============================================================================
;; Retire / Dispose / CAS-abandon
;;=============================================================================

(defn- node-size-for-free
  "Get the block size for a slab-qualified offset, for pool/free routing."
  ^number [^number slab-off]
  (let [class-idx (eve-alloc/decode-class-idx slab-off)]
    (if (< class-idx d/NUM_SLAB_CLASSES)
      (aget d/SLAB_SIZES class-idx)
      0)))

(defn retire-replaced-path!
  "After an atom swap that replaced old-root with new-root, free the old
   path nodes that are no longer referenced by the new tree.

   Walks both trees following the hash bits for key kh. At each level where
   old-node != new-node, the old node is freed or pooled.

   Only retires individual path nodes — shared subtrees are untouched.

   NOTE: Only use for SINGLE-key modifications. For multiple keys, use
   retire-tree-diff! to avoid double-freeing shared path nodes.

   kh: the hash of the key that was modified"
  [old-root new-root kh]
  (when (and (not= old-root eve-alloc/NIL_OFFSET) (not= old-root new-root))
    (loop [old-off old-root
           new-off new-root
           sh 0]
      (when (and (not= old-off eve-alloc/NIL_OFFSET) (not= old-off new-off))
        ;; Read node data BEFORE freeing (to avoid use-after-free!)
        (let [size (node-size-for-free old-off)
              old-type (read-node-type old-off)
              ;; Pre-read bitmap and child info before freeing
              [old-child new-child next-sh]
              (when (== old-type NODE_TYPE_BITMAP)
                (let [bit (bitpos kh sh)
                      old-node-bm (read-node-bitmap old-off)
                      new-type (when (not= new-off eve-alloc/NIL_OFFSET) (read-node-type new-off))
                      new-node-bm (when (and new-type (== new-type NODE_TYPE_BITMAP))
                                    (read-node-bitmap new-off))]
                  (when (and (has-bit? old-node-bm bit)
                             new-node-bm
                             (has-bit? new-node-bm bit))
                    (let [old-child-idx (get-index old-node-bm bit)
                          new-child-idx (get-index new-node-bm bit)]
                      [(read-child-offset old-off old-child-idx)
                       (read-child-offset new-off new-child-idx)
                       (+ sh SHIFT_STEP)]))))]
          ;; Now free/pool this old node
          (if (pos? size)
            (maybe-pool-or-free! old-off size)
            (eve-alloc/free! old-off))
          ;; Continue down the hash path (with pre-read data)
          (when old-child
            (recur old-child new-child next-sh)))))))

(defn retire-tree-diff!
  "Full tree diff: walk old and new HAMT trees in parallel, freeing all
   old nodes that differ from the new tree.

   At each node pair:
   - If old-off == new-off → shared subtree, skip entirely
   - If old-off != new-off → free old node, recurse into children

   Cost: O(changed nodes). Shared subtrees are skipped via integer compare."
  [old-root new-root]
  (when (and (not= old-root eve-alloc/NIL_OFFSET) (not= old-root new-root))
    (letfn [(walk [old-off new-off]
              (when (and (not= old-off eve-alloc/NIL_OFFSET) (not= old-off new-off))
                ;; Read all data BEFORE freeing (to avoid use-after-free!)
                (let [size (node-size-for-free old-off)
                      old-type (read-node-type old-off)
                      ;; Pre-read all children info before freeing
                      children-to-walk
                      (when (== old-type NODE_TYPE_BITMAP)
                        (let [old-node-bm (read-node-bitmap old-off)
                              new-type (when (not= new-off eve-alloc/NIL_OFFSET) (read-node-type new-off))
                              new-node-bm (when (and new-type (== new-type NODE_TYPE_BITMAP))
                                            (read-node-bitmap new-off))]
                          ;; Collect all children pairs before freeing
                          (loop [remaining old-node-bm
                                 old-idx 0
                                 result (transient [])]
                            (if (zero? remaining)
                              (persistent! result)
                              (let [bit (bit-and remaining (- remaining)) ;; lowest set bit
                                    old-child (read-child-offset old-off old-idx)
                                    new-child (if (and new-node-bm (has-bit? new-node-bm bit))
                                                (let [new-idx (get-index new-node-bm bit)]
                                                  (read-child-offset new-off new-idx))
                                                eve-alloc/NIL_OFFSET)]
                                (recur (bit-and remaining (dec remaining))
                                       (inc old-idx)
                                       (conj! result [old-child new-child])))))))]
                  ;; Now free this old node
                  (if (pos? size)
                    (maybe-pool-or-free! old-off size)
                    (eve-alloc/free! old-off))
                  ;; Walk children (with pre-read data)
                  (doseq [[old-child new-child] children-to-walk]
                    (walk old-child new-child)))))]
      (walk old-root new-root))))

(defn dispose!
  "Dispose a EveHashMap, freeing its entire HAMT tree and header block."
  [^js sab-map]
  (let [root-off (.-root-off sab-map)
        header-off (.-header-off sab-map)]
    (when (not= root-off eve-alloc/NIL_OFFSET)
      (free-hamt-node! root-off))
    (when (not= header-off eve-alloc/NIL_OFFSET)
      (let [size (node-size-for-free header-off)]
        (if (pos? size)
          (maybe-pool-or-free! header-off size)
          (eve-alloc/free! header-off))))))

(defn free-cas-abandoned!
  "Free a CAS-failed map's new nodes without touching shared subtrees.
   Call when a CAS attempt fails and the newly-created map is abandoned.
   Swaps old/new args to retire-replaced-path! so it frees the NEW path
   nodes (the ones that differ from the original tree), then frees the header."
  [^js new-map old-root-off kh]
  (let [new-root-off (.-root-off new-map)
        header-off (.-header-off new-map)]
    ;; Free new path nodes by walking new→old (swap args so "old" = new nodes)
    (when (and (not= new-root-off eve-alloc/NIL_OFFSET)
               (not= new-root-off old-root-off))
      (retire-replaced-path! new-root-off old-root-off kh))
    ;; Free the abandoned header block
    (when (not= header-off eve-alloc/NIL_OFFSET)
      (let [size (node-size-for-free header-off)]
        (if (pos? size)
          (maybe-pool-or-free! header-off size)
          (eve-alloc/free! header-off))))))

;;=============================================================================
;; Module-level mutable state (same as original)
;;=============================================================================

(def ^:private ^:mutable hamt-result-added? false)
(def ^:private ^:mutable hamt-result-removed? false)
(def ^:private ^:mutable find-result-found? false)
(def ^:private ^:mutable find-result-val nil)
(def ^:private ^:mutable recycle-replaced-nodes? false)

(defn- recycle-node!
  "Pool a replaced node for reuse. Only called when recycle-replaced-nodes? is true."
  [slab-off]
  (let [class-idx (eve-alloc/decode-class-idx slab-off)]
    (if (< class-idx d/NUM_SLAB_CLASSES)
      (maybe-pool-or-free! slab-off (aget d/SLAB_SIZES class-idx))
      (eve-alloc/free! slab-off))))

;;=============================================================================
;; HAMT Find
;;=============================================================================

(defn- hamt-find-fast
  "Look up key in HAMT. Sets find-result-found? and find-result-val."
  [root-off kb kh shift]
  (if (== root-off eve-alloc/NIL_OFFSET)
    (do (set! find-result-found? false) (set! find-result-val nil) nil)
    (let [node-type (read-node-type root-off)]
      (case node-type
        ;; Bitmap node
        1 (let [base (eve-alloc/resolve-u8! root-off)
                data-bm (r-get-u32 4)
                node-bm (r-get-u32 8)
                bit (bitpos kh shift)]
            (cond
              ;; Child node
              (has-bit? node-bm bit)
              (let [idx (get-index node-bm bit)
                    child-off (r-get-i32 (+ NODE_HEADER_SIZE (* idx 4)))]
                (recur child-off kb kh (+ shift SHIFT_STEP)))

              ;; Inline data
              (has-bit? data-bm bit)
              (let [data-idx (get-index data-bm bit)
                    stored-hash (r-get-i32 (+ (hashes-start-off node-bm) (* data-idx 4)))]
                (if (not= stored-hash kh)
                  (do (set! find-result-found? false) (set! find-result-val nil) nil)
                  (let [kv-s (kv-data-start-off data-bm node-bm)
                        pos (loop [i 0 p kv-s]
                              (if (== i data-idx) p
                                (let [kl (r-get-u32 p) vo (+ p 4 kl) vl (r-get-u32 vo)]
                                  (recur (inc i) (+ vo 4 vl)))))
                        key-len (r-get-u32 pos)]
                    (if (key-bytes-match? pos kb)
                      (let [val-off (+ pos 4 key-len)
                            val-len (r-get-u32 val-off)
                            val-bytes (eve-alloc/read-bytes root-off (+ val-off 4) val-len)
                            ;; Deserialize value from the bytes
                            entry-v (ser/deserialize-element {} val-bytes)]
                        (set! find-result-found? true)
                        (set! find-result-val entry-v)
                        nil)
                      (do (set! find-result-found? false) (set! find-result-val nil) nil)))))

              :else (do (set! find-result-found? false) (set! find-result-val nil) nil)))

        ;; Collision node
        3 (let [base (eve-alloc/resolve-u8! root-off)
                coll-hash (r-get-i32 4)]
            (if (not= coll-hash kh)
              (do (set! find-result-found? false) (set! find-result-val nil) nil)
              (let [cnt (r-get-u8 1)]
                (loop [i 0 pos COLLISION_HEADER_SIZE]
                  (if (>= i cnt)
                    (do (set! find-result-found? false) (set! find-result-val nil) nil)
                    (let [key-len (r-get-u32 pos)]
                      (if (key-bytes-match? pos kb)
                        (let [val-off (+ pos 4 key-len)
                              val-len (r-get-u32 val-off)
                              val-bytes (eve-alloc/read-bytes root-off (+ val-off 4) val-len)
                              entry-v (ser/deserialize-element {} val-bytes)]
                          (set! find-result-found? true)
                          (set! find-result-val entry-v)
                          nil)
                        (let [val-off (+ pos 4 key-len)
                              val-len (r-get-u32 val-off)]
                          (recur (inc i) (+ val-off 4 val-len))))))))))

        ;; Unknown
        (do (set! find-result-found? false) (set! find-result-val nil) nil)))))

(defn- hamt-find
  "Look up key in HAMT. Sets find-result-found? and find-result-val."
  [root-off k kh shift]
  (let [kb (ser/serialize-key k)]
    (hamt-find-fast root-off kb kh shift)
    nil))

;;=============================================================================
;; HAMT Assoc
;;=============================================================================

(defn- hamt-assoc
  "Assoc key/value into HAMT. Returns new root slab-qualified offset."
  [root-off kh kb vb shift]
  (when (> shift 50)
    (throw (js/Error. (str "hamt-assoc: shift overflow! shift=" shift))))
  (if (== root-off eve-alloc/NIL_OFFSET)
    (let [bit (bitpos kh shift)]
      (set! hamt-result-added? true)
      (make-single-entry-node! bit kh kb vb))

    (let [node-type (read-node-type root-off)
          result
          (case node-type
            ;; Bitmap node
            1 (let [base (eve-alloc/resolve-u8! root-off)
                    data-bm (r-get-u32 4)
                    node-bm (r-get-u32 8)
                    bit (bitpos kh shift)]
                (cond
                  ;; Child node — descend
                  (has-bit? node-bm bit)
                  (let [child-idx (get-index node-bm bit)
                        child-off (r-get-i32 (+ NODE_HEADER_SIZE (* child-idx 4)))
                        new-child (hamt-assoc child-off kh kb vb (+ shift SHIFT_STEP))]
                    (if (== new-child child-off)
                      root-off
                      (make-bitmap-node-with-raw-kv! data-bm node-bm
                                                      root-off data-bm node-bm
                                                      child-idx new-child)))

                  ;; Inline data at this position
                  (has-bit? data-bm bit)
                  (let [data-idx (get-index data-bm bit)
                        kv-s (kv-data-start-off data-bm node-bm)
                        ;; Re-resolve since recursive calls may have changed resolved state
                        _ (eve-alloc/resolve-u8! root-off)
                        pos (loop [i 0 p kv-s]
                              (if (== i data-idx) p
                                (let [kl (r-get-u32 p) vo (+ p 4 kl) vl (r-get-u32 vo)]
                                  (recur (inc i) (+ vo 4 vl)))))
                        existing-kh (r-get-i32 (+ (hashes-start-off node-bm) (* data-idx 4)))
                        existing-kb-len (r-get-u32 pos)]
                    (if (key-bytes-match? pos kb)
                      ;; Same key — check if value unchanged
                      (let [val-off (+ pos 4 existing-kb-len)]
                        (if (key-bytes-match? val-off vb)
                          (do (set! hamt-result-added? false) root-off)
                          (do (set! hamt-result-added? false)
                              (make-bitmap-node-with-replaced-kv!
                                data-bm node-bm root-off node-bm data-idx kh kb vb pos))))
                      ;; Different key — push down
                      (let [existing-kb (copy-from-sab root-off (+ pos 4) existing-kb-len)
                            existing-vb-off (+ pos 4 existing-kb-len)
                            _ (eve-alloc/resolve-u8! root-off)
                            existing-vb-len (r-get-u32 existing-vb-off)
                            existing-vb (copy-from-sab root-off (+ existing-vb-off 4) existing-vb-len)]
                        (if (or (== existing-kh kh) (>= shift 30))
                          ;; Collision
                          (let [coll (make-collision-node! kh [[existing-kh existing-kb existing-vb] [kh kb vb]])
                                new-data-bm (bit-xor data-bm bit)
                                new-node-bm (bit-or node-bm bit)
                                new-child-idx (get-index new-node-bm bit)]
                            (set! hamt-result-added? true)
                            (make-bitmap-node-removing-kv!
                              new-data-bm new-node-bm root-off data-bm node-bm
                              data-idx new-child-idx coll))
                          ;; Push down to sub-node
                          (let [sub-shift (+ shift SHIFT_STEP)
                                existing-bit (bitpos existing-kh sub-shift)
                                new-bit (bitpos kh sub-shift)]
                            (if (== existing-bit new-bit)
                              (let [sub (hamt-assoc eve-alloc/NIL_OFFSET existing-kh existing-kb existing-vb sub-shift)
                                    final-sub (hamt-assoc sub kh kb vb sub-shift)
                                    new-data-bm (bit-xor data-bm bit)
                                    new-node-bm (bit-or node-bm bit)
                                    new-child-idx (get-index new-node-bm bit)]
                                (set! hamt-result-added? true)
                                (make-bitmap-node-removing-kv!
                                  new-data-bm new-node-bm root-off data-bm node-bm
                                  data-idx new-child-idx final-sub))
                              (let [sub-data-bm (bit-or existing-bit new-bit)
                                    sub (if (< existing-bit new-bit)
                                          (make-two-entry-node! sub-data-bm
                                            existing-kh existing-kb existing-vb kh kb vb)
                                          (make-two-entry-node! sub-data-bm
                                            kh kb vb existing-kh existing-kb existing-vb))
                                    new-data-bm (bit-xor data-bm bit)
                                    new-node-bm (bit-or node-bm bit)
                                    new-child-idx (get-index new-node-bm bit)]
                                (set! hamt-result-added? true)
                                (make-bitmap-node-removing-kv!
                                  new-data-bm new-node-bm root-off data-bm node-bm
                                  data-idx new-child-idx sub))))))))

                  ;; Empty position — add to data_bitmap
                  :else
                  (let [data-idx (get-index data-bm bit)
                        new-data-bm (bit-or data-bm bit)]
                    (set! hamt-result-added? true)
                    (make-bitmap-node-with-added-kv!
                      new-data-bm node-bm root-off data-bm node-bm data-idx kh kb vb))))

            ;; Collision node
            3 (let [base (eve-alloc/resolve-u8! root-off)
                    node-hash (r-get-i32 4)
                    cnt (r-get-u8 1)]
                (if (== kh node-hash)
                  ;; Same hash — add/replace in collision
                  (loop [i 0 pos COLLISION_HEADER_SIZE entries []]
                    (if (>= i cnt)
                      (do (set! hamt-result-added? true)
                          (make-collision-node! kh (conj entries [kh kb vb])))
                      (let [_ (eve-alloc/resolve-u8! root-off) ;; re-resolve
                            klen (r-get-u32 pos)
                            entry-kb (copy-from-sab root-off (+ pos 4) klen)
                            val-off (+ pos 4 klen)
                            _ (eve-alloc/resolve-u8! root-off)
                            vlen (r-get-u32 val-off)
                            entry-vb (copy-from-sab root-off (+ val-off 4) vlen)
                            next-pos (+ val-off 4 vlen)]
                        (if (key-bytes-match? pos kb)
                          ;; Key matches — check value
                          (if (let [a entry-vb b vb]
                                (and (== (.-length a) (.-length b))
                                     (loop [j 0]
                                       (if (>= j (.-length a)) true
                                         (if (not= (aget a j) (aget b j)) false (recur (inc j)))))))
                            (do (set! hamt-result-added? false) root-off)
                            ;; Replace value
                            (let [remaining (loop [j (inc i) p next-pos acc []]
                                              (if (>= j cnt)
                                                acc
                                                (let [_ (eve-alloc/resolve-u8! root-off)
                                                      kl (r-get-u32 p)
                                                      kb2 (copy-from-sab root-off (+ p 4) kl)
                                                      vo (+ p 4 kl)
                                                      _ (eve-alloc/resolve-u8! root-off)
                                                      vl (r-get-u32 vo)
                                                      vb2 (copy-from-sab root-off (+ vo 4) vl)]
                                                  (recur (inc j) (+ vo 4 vl) (conj acc [node-hash kb2 vb2])))))]
                              (set! hamt-result-added? false)
                              (make-collision-node! kh (into (conj entries [kh kb vb]) remaining))))
                          ;; Continue
                          (recur (inc i) next-pos (conj entries [node-hash entry-kb entry-vb]))))))
                  ;; Different hash — split
                  (if (>= shift 30)
                    (let [entries (loop [i 0 pos COLLISION_HEADER_SIZE acc []]
                                   (if (>= i cnt)
                                     acc
                                     (let [_ (eve-alloc/resolve-u8! root-off)
                                           kl (r-get-u32 pos)
                                           ek (copy-from-sab root-off (+ pos 4) kl)
                                           vo (+ pos 4 kl)
                                           _ (eve-alloc/resolve-u8! root-off)
                                           vl (r-get-u32 vo)
                                           ev (copy-from-sab root-off (+ vo 4) vl)]
                                       (recur (inc i) (+ vo 4 vl) (conj acc [node-hash ek ev])))))]
                      (set! hamt-result-added? true)
                      (make-collision-node! node-hash (conj entries [kh kb vb])))
                    (let [bit1 (bitpos node-hash shift)
                          bit2 (bitpos kh shift)]
                      (if (== bit1 bit2)
                        (let [new-child (hamt-assoc root-off kh kb vb (+ shift SHIFT_STEP))]
                          (make-single-child-node! bit1 new-child))
                        (do (set! hamt-result-added? true)
                            (make-child-and-entry-node! bit2 bit1 root-off kh kb vb)))))))

            ;; Unknown
            (do (set! hamt-result-added? false) root-off))]
      ;; Recycle replaced node
      (when (and recycle-replaced-nodes? (not= result root-off))
        (recycle-node! root-off))
      result)))

;;=============================================================================
;; HAMT Graft
;;=============================================================================

(defn hamt-graft
  "Graft a worker's speculative HAMT change onto a different root.
   All offsets are slab-qualified — transparently routes to correct slabs."
  [current-root base-root new-root kh kb vb worker-added shift]
  (cond
    (== current-root base-root)
    (do (set! hamt-result-added? worker-added) new-root)

    (== base-root new-root)
    (do (set! hamt-result-added? false) current-root)

    :else
    (let [cur-type (read-node-type current-root)
          base-type (read-node-type base-root)
          new-type (read-node-type new-root)]
      (if (and (== cur-type NODE_TYPE_BITMAP)
               (== base-type NODE_TYPE_BITMAP)
               (== new-type NODE_TYPE_BITMAP))
        (let [bit (bitpos kh shift)
              cur-node-bm (read-node-bitmap current-root)
              base-node-bm (read-node-bitmap base-root)
              new-node-bm (read-node-bitmap new-root)]
          (if (and (has-bit? cur-node-bm bit)
                   (has-bit? base-node-bm bit)
                   (has-bit? new-node-bm bit)
                   (== base-node-bm new-node-bm))
            (let [cur-child-idx (get-index cur-node-bm bit)
                  base-child-idx (get-index base-node-bm bit)
                  new-child-idx (get-index new-node-bm bit)
                  cur-child (read-child-offset current-root cur-child-idx)
                  base-child (read-child-offset base-root base-child-idx)
                  new-child (read-child-offset new-root new-child-idx)]
              (cond
                (== base-child new-child)
                (hamt-assoc current-root kh kb vb shift)

                (== cur-child base-child)
                (let [cur-data-bm (read-data-bitmap current-root)]
                  (set! hamt-result-added? worker-added)
                  (make-bitmap-node-with-raw-kv!
                    cur-data-bm cur-node-bm
                    current-root cur-data-bm cur-node-bm
                    cur-child-idx new-child))

                :else
                (let [grafted (hamt-graft cur-child base-child new-child
                                          kh kb vb worker-added (+ shift SHIFT_STEP))]
                  (if (== grafted cur-child)
                    current-root
                    (let [cur-data-bm (read-data-bitmap current-root)]
                      (make-bitmap-node-with-raw-kv!
                        cur-data-bm cur-node-bm
                        current-root cur-data-bm cur-node-bm
                        cur-child-idx grafted))))))
            ;; Structural change — fall back
            (hamt-assoc current-root kh kb vb shift)))
        ;; Mixed node types — fall back
        (hamt-assoc current-root kh kb vb shift)))))

(defn hamt-graft-added? [] hamt-result-added?)

;;=============================================================================
;; Public API
;;=============================================================================

(defn hamt-assoc-pub
  "Public wrapper for hamt-assoc."
  [root-off kh kb vb shift]
  (hamt-assoc root-off kh kb vb shift))

(defn alloc-bytes-pub
  "Public wrapper for alloc-bytes!."
  [n]
  (alloc-bytes! n))

(defn hamt-dissoc-pub
  "Public wrapper for hamt-dissoc."
  [root-off kh kb shift]
  (hamt-dissoc root-off kh kb shift))

(defn direct-assoc-pub
  "Bypass protocol dispatch — calls the internal assoc path directly.
   Returns #js [new-header-off new-cnt]."
  [root-off cnt k v]
  (let [kb (ser/serialize-key k)
        vb (ser/serialize-val v)
        kh (hash k)
        new-root (hamt-assoc root-off kh kb vb 0)]
    (if (== new-root root-off)
      #js [root-off cnt]
      (let [new-cnt (if hamt-result-added? (inc cnt) cnt)
            ^js new-map (make-eve-hash-map new-cnt new-root)]
        #js [(.-header-off new-map) new-cnt]))))

(defn direct-assoc-with-khs-pub
  "Like direct-assoc-pub but returns a EveHashMap with _modified_khs tracking."
  [root-off cnt k v parent-map]
  (let [kb (ser/serialize-key k)
        vb (ser/serialize-val v)
        kh (hash k)
        new-root (hamt-assoc root-off kh kb vb 0)]
    (if (== new-root root-off)
      parent-map
      (let [new-cnt (if hamt-result-added? (inc cnt) cnt)
            ^js new-map (make-eve-hash-map new-cnt new-root)
            parent-khs (.-_modified_khs ^js parent-map)
            parent-len (if parent-khs (.-length parent-khs) 0)]
        (when (<= parent-len 8)
          (set! (.-_modified_khs new-map)
                (if (or (nil? parent-khs) (zero? parent-len))
                  #js [kh]
                  (let [khs (.slice parent-khs 0)] (.push khs kh) khs))))
        new-map))))

;;=============================================================================
;; Node helper: make-bitmap-node-removing-child! (for dissoc)
;;=============================================================================

(defn- make-bitmap-node-removing-child!
  "Create bitmap node with a child removed. Raw byte copy for data entries."
  [data-bm new-node-bm src-slab-off src-data-bm src-node-bm remove-child-idx]
  (let [new-child-count (popcount32 new-node-bm)
        data-count (popcount32 data-bm)
        existing-kv-size (read-kv-total-size src-slab-off)
        ;; If cached 0, compute
        existing-kv-size (if (pos? existing-kv-size)
                           existing-kv-size
                           (let [_ (eve-alloc/resolve-u8! src-slab-off)
                                 kv-s (kv-data-start-off src-data-bm src-node-bm)
                                 dc (popcount32 src-data-bm)]
                             (loop [i 0 pos kv-s]
                               (if (>= i dc) (- pos kv-s) (recur (inc i) (skip-kv-at pos))))))
        node-size (+ NODE_HEADER_SIZE (* 4 new-child-count) (* 4 data-count) existing-kv-size)
        dst-slab-off (alloc-bytes! node-size)]
    ;; Write header
    (eve-alloc/resolve-u8! dst-slab-off)
    (r-set-u8 0 NODE_TYPE_BITMAP)
    (r-set-u8 1 0)
    (r-set-u16 2 existing-kv-size)
    (r-set-u32 4 data-bm)
    (r-set-u32 8 new-node-bm)
    ;; Copy child offsets, skipping removed one
    (let [old-child-count (popcount32 src-node-bm)]
      (loop [src-i 0 dst-i 0]
        (when (< dst-i new-child-count)
          (if (== src-i remove-child-idx)
            (recur (inc src-i) dst-i)
            (do (r-set-i32 (+ NODE_HEADER_SIZE (* dst-i 4))
                           (eve-alloc/read-i32 src-slab-off (+ NODE_HEADER_SIZE (* src-i 4))))
                (recur (inc src-i) (inc dst-i)))))))
    ;; Copy hash array (data entries unchanged)
    (let [src-h-off (hashes-start-off src-node-bm)
          dst-h-off (hashes-start-off new-node-bm)]
      (dotimes [i data-count]
        (r-set-i32 (+ dst-h-off (* i 4))
                   (eve-alloc/read-i32 src-slab-off (+ src-h-off (* i 4))))))
    ;; Copy KV data
    (let [src-kv-off (kv-data-start-off src-data-bm src-node-bm)
          dst-kv-off (kv-data-start-off data-bm new-node-bm)]
      (eve-alloc/resolve-u8! src-slab-off)
      (let [positions (loop [i 0 pos src-kv-off acc #js []]
                        (if (>= i data-count)
                          acc
                          (let [next (skip-kv-at pos)]
                            (.push acc #js [pos (- next pos)])
                            (recur (inc i) next acc))))]
        (eve-alloc/resolve-u8! dst-slab-off)
        (loop [i 0 dst-pos dst-kv-off]
          (when (< i data-count)
            (let [entry (aget positions i)
                  src-pos (aget entry 0)
                  kv-len (aget entry 1)
                  src-bytes (eve-alloc/read-bytes src-slab-off src-pos kv-len)]
              (.set eve-alloc/resolved-u8 src-bytes (+ eve-alloc/resolved-base dst-pos))
              (recur (inc i) (+ dst-pos kv-len)))))))
    dst-slab-off))

;;=============================================================================
;; HAMT Dissoc
;;=============================================================================

(defn- hamt-dissoc
  "Dissoc key from HAMT. Returns new-root-off.
   Sets hamt-result-removed? to true if key was removed."
  [root-off kh kb shift]
  (if (== root-off eve-alloc/NIL_OFFSET)
    (do (set! hamt-result-removed? false) eve-alloc/NIL_OFFSET)
    (let [node-type (read-node-type root-off)]
      (case node-type
        ;; Bitmap node
        1 (let [base (eve-alloc/resolve-u8! root-off)
                data-bm (r-get-u32 4)
                node-bm (r-get-u32 8)
                bit (bitpos kh shift)]
            (cond
              ;; Position has child node
              (has-bit? node-bm bit)
              (let [child-idx (get-index node-bm bit)
                    child-off (r-get-i32 (+ NODE_HEADER_SIZE (* child-idx 4)))
                    new-child (hamt-dissoc child-off kh kb (+ shift SHIFT_STEP))]
                (if-not hamt-result-removed?
                  root-off
                  (let [child-count (popcount32 node-bm)
                        data-count (popcount32 data-bm)]
                    (if (== new-child eve-alloc/NIL_OFFSET)
                      ;; Child was removed entirely
                      (if (and (== child-count 1) (zero? data-count))
                        eve-alloc/NIL_OFFSET
                        (let [new-node-bm (bit-xor node-bm bit)]
                          (make-bitmap-node-removing-child!
                            data-bm new-node-bm root-off data-bm node-bm child-idx)))
                      ;; Child was modified
                      (make-bitmap-node-with-raw-kv!
                        data-bm node-bm root-off data-bm node-bm child-idx new-child)))))

              ;; Position has inline data
              (has-bit? data-bm bit)
              (let [data-idx (get-index data-bm bit)
                    kv-s (kv-data-start-off data-bm node-bm)
                    _ (eve-alloc/resolve-u8! root-off)
                    pos (loop [i 0 p kv-s]
                          (if (== i data-idx) p
                            (let [kl (r-get-u32 p) vo (+ p 4 kl) vl (r-get-u32 vo)]
                              (recur (inc i) (+ vo 4 vl)))))]
                (if (key-bytes-match? pos kb)
                  ;; Found — remove it
                  (let [child-count (popcount32 node-bm)
                        data-count (popcount32 data-bm)]
                    (set! hamt-result-removed? true)
                    (if (and (== data-count 1) (zero? child-count))
                      eve-alloc/NIL_OFFSET
                      (let [new-data-bm (bit-xor data-bm bit)]
                        (make-bitmap-node-removing-kv!
                          new-data-bm node-bm root-off data-bm node-bm data-idx -1 -1))))
                  ;; Key not found
                  (do (set! hamt-result-removed? false) root-off)))

              :else (do (set! hamt-result-removed? false) root-off)))

        ;; Collision node
        3 (let [base (eve-alloc/resolve-u8! root-off)
                cnt (r-get-u8 1)
                node-hash (r-get-i32 4)]
            (loop [i 0 pos COLLISION_HEADER_SIZE entries []]
              (if (>= i cnt)
                ;; Key not found
                (do (set! hamt-result-removed? false) root-off)
                (let [_ (eve-alloc/resolve-u8! root-off)
                      klen (r-get-u32 pos)
                      entry-kb (copy-from-sab root-off (+ pos 4) klen)
                      val-off (+ pos 4 klen)
                      _ (eve-alloc/resolve-u8! root-off)
                      vlen (r-get-u32 val-off)
                      entry-vb (copy-from-sab root-off (+ val-off 4) vlen)
                      next-pos (+ val-off 4 vlen)
                      _ (eve-alloc/resolve-u8! root-off)]
                  (if (key-bytes-match? pos kb)
                    ;; Found — remove it
                    (let [remaining (loop [j (inc i) p next-pos acc []]
                                     (if (>= j cnt)
                                       acc
                                       (let [_ (eve-alloc/resolve-u8! root-off)
                                             kl (r-get-u32 p)
                                             ekb (copy-from-sab root-off (+ p 4) kl)
                                             vo (+ p 4 kl)
                                             _ (eve-alloc/resolve-u8! root-off)
                                             vl (r-get-u32 vo)
                                             evb (copy-from-sab root-off (+ vo 4) vl)]
                                         (recur (inc j) (+ vo 4 vl) (conj acc [node-hash ekb evb])))))
                          all-remaining (into entries remaining)]
                      (set! hamt-result-removed? true)
                      (cond
                        (empty? all-remaining) eve-alloc/NIL_OFFSET
                        (== 1 (count all-remaining))
                        (let [[ekh ekb evb] (first all-remaining)
                              bit (bitpos node-hash shift)]
                          (make-single-entry-node! bit ekh ekb evb))
                        :else
                        (make-collision-node! node-hash all-remaining)))
                    ;; Continue
                    (recur (inc i) next-pos (conj entries [node-hash entry-kb entry-vb])))))))

        ;; Unknown
        (do (set! hamt-result-removed? false) root-off)))))

;;=============================================================================
;; KV Deserialization helper (for seq/reduce)
;;=============================================================================

(defn- read-kv-at
  "Read and deserialize a KV pair at a resolved position.
   Returns [key value next-pos-in-node]."
  [slab-off pos-in-node]
  (eve-alloc/resolve-u8! slab-off)
  (let [key-len (r-get-u32 pos-in-node)
        key-bytes (copy-from-sab slab-off (+ pos-in-node 4) key-len)
        val-off (+ pos-in-node 4 key-len)
        _ (eve-alloc/resolve-u8! slab-off)
        val-len (r-get-u32 val-off)
        val-bytes (copy-from-sab slab-off (+ val-off 4) val-len)
        next-pos (+ val-off 4 val-len)
        k (ser/deserialize-element {} key-bytes)
        v (ser/deserialize-element {} val-bytes)]
    [k v next-pos]))

;;=============================================================================
;; HAMT Seq (lazy)
;;=============================================================================

(defn- hamt-seq
  "Return lazy seq of MapEntry pairs from HAMT."
  [root-off]
  (when (not= root-off eve-alloc/NIL_OFFSET)
    ((fn walk [off]
       (lazy-seq
         (when (not= off eve-alloc/NIL_OFFSET)
           (let [node-type (read-node-type off)]
             (case node-type
               ;; Bitmap node
               1 (let [base (eve-alloc/resolve-u8! off)
                       data-bm (r-get-u32 4)
                       node-bm (r-get-u32 8)
                       data-count (popcount32 data-bm)
                       child-count (popcount32 node-bm)
                       kv-start (kv-data-start-off data-bm node-bm)
                       ;; Materialize inline entries
                       inline-entries (loop [i 0 pos kv-start acc []]
                                        (if (>= i data-count)
                                          acc
                                          (let [[k v next-pos] (read-kv-at off pos)]
                                            (recur (inc i) next-pos (conj acc (MapEntry. k v nil))))))
                       ;; Lazy child traversal
                       child-seqs (fn step [ci]
                                    (lazy-seq
                                      (when (< ci child-count)
                                        (let [child-off (read-child-offset off ci)]
                                          (concat (walk child-off)
                                                  (step (inc ci)))))))]
                   (concat inline-entries (child-seqs 0)))

               ;; Collision node
               3 (let [base (eve-alloc/resolve-u8! off)
                       cnt (r-get-u8 1)]
                   (loop [i 0 pos COLLISION_HEADER_SIZE result []]
                     (if (>= i cnt)
                       result
                       (let [[k v next-pos] (read-kv-at off pos)]
                         (recur (inc i) next-pos (conj result (MapEntry. k v nil)))))))

               ;; Unknown
               nil)))))
     root-off)))

;;=============================================================================
;; HAMT KV Reduce (streaming tree walk)
;;=============================================================================

(def ^:private ^:mutable hamt-reduce-depth 0)

(defn- hamt-kv-reduce
  "Walk HAMT tree calling (f acc k v) at each entry.
   Supports reduced? for early termination."
  [root-off f init]
  (set! hamt-reduce-depth (inc hamt-reduce-depth))
  (try
    (when (> hamt-reduce-depth 8)
      ;; HAMT with 5-bit chunks and 32-bit hash can have at most 7 levels.
      ;; Depth 8+ indicates corruption or an infinite loop.
      (throw (js/Error. (str "[hamt-kv-reduce] DEPTH " hamt-reduce-depth " (max 7) root-off=" root-off))))
    (if (== root-off eve-alloc/NIL_OFFSET)
      init
      (let [node-type (read-node-type root-off)]
        (case node-type
          ;; Bitmap node
          1 (let [base (eve-alloc/resolve-u8! root-off)
                  data-bm (r-get-u32 4)
                  node-bm (r-get-u32 8)
                  data-count (popcount32 data-bm)
                  kv-start (kv-data-start-off data-bm node-bm)
                  ;; Reduce over inline KV entries
                  acc-after-data
                  (loop [i 0 pos kv-start acc init]
                    (if (or (>= i data-count) (reduced? acc))
                      acc
                      (let [[k v next-pos] (read-kv-at root-off pos)]
                        (recur (inc i) next-pos (f acc k v)))))
                  child-count (popcount32 node-bm)]
              (if (reduced? acc-after-data)
                acc-after-data
                ;; Reduce over children
                (loop [i 0 acc acc-after-data]
                  (if (or (>= i child-count) (reduced? acc))
                    acc
                    (let [child-off (read-child-offset root-off i)]
                      (recur (inc i) (hamt-kv-reduce child-off f acc)))))))

          ;; Collision node
          3 (let [base (eve-alloc/resolve-u8! root-off)
                  cnt (r-get-u8 1)]
              (loop [i 0 pos COLLISION_HEADER_SIZE acc init]
                (if (or (>= i cnt) (reduced? acc))
                  acc
                  (let [[k v next-pos] (read-kv-at root-off pos)]
                    (recur (inc i) next-pos (f acc k v))))))

          init)))
    (finally
      (set! hamt-reduce-depth (dec hamt-reduce-depth)))))

;;=============================================================================
;; LRU Cache
;;=============================================================================

(def ^:private ^:const CACHE_MAX_SIZE 128)

(defn- ensure-cache!
  "Lazily initialize cache on a EveHashMap instance. Returns the cache (js/Map)."
  [^js sab-map]
  (or (.-_cache sab-map)
      (let [c (js/Map.)]
        (set! (.-_cache sab-map) c)
        c)))

(defn- cache-get
  "Get value from cache. Returns [found? value] or nil."
  [^js sab-map k]
  (when-let [cache (.-_cache sab-map)]
    (when (.has cache k)
      [true (.get cache k)])))

(defn- cache-put!
  "Store value in cache with LRU eviction."
  [sab-map k v]
  (let [cache (ensure-cache! sab-map)]
    (when (>= (.-size cache) CACHE_MAX_SIZE)
      (let [keys-iter (.keys cache)
            to-delete (unsigned-bit-shift-right CACHE_MAX_SIZE 2)]
        (dotimes [_ to-delete]
          (let [oldest (.next keys-iter)]
            (when-not (.-done oldest)
              (.delete cache (.-value oldest)))))))
    (.set cache k v)))

;;=============================================================================
;; EveHashMap — EVE persistent map handle
;;=============================================================================
;; In the slab version, EveHashMap is a lightweight JS deftype.
;; Fields cnt and root-off are JS properties (not SAB-backed).
;; The header-off field stores a slab-qualified offset to a 12-byte header
;; block in the slab, used for serialization (encode-sab-pointer).

(defn make-eve-hash-map
  "Create a EveHashMap, allocating a 12-byte header block in the slab.
   The header stores: [type-id:u8 | pad:3 | cnt:i32 | root-off:i32]."
  [cnt root-off]
  (let [header-off (alloc-bytes! 12)]
    (eve-alloc/resolve-u8! header-off)
    (r-set-u8 0 EveHashMap-type-id)
    (r-set-u8 1 0) (r-set-u8 2 0) (r-set-u8 3 0)
    (r-set-i32 SABMAPROOT_CNT_OFFSET cnt)
    (r-set-i32 SABMAPROOT_ROOT_OFF_OFFSET root-off)
    (EveHashMap. cnt root-off header-off nil nil nil)))

(defn make-eve-hash-map-from-header
  "Reconstruct a EveHashMap from an existing header slab-qualified offset.
   Reads cnt and root-off from the header block."
  [header-off]
  (eve-alloc/resolve-u8! header-off)
  (let [cnt (r-get-i32 SABMAPROOT_CNT_OFFSET)
        root-off (r-get-i32 SABMAPROOT_ROOT_OFF_OFFSET)]
    (EveHashMap. cnt root-off header-off nil nil nil)))

(deftype EveHashMap [cnt root-off header-off
                     ^:mutable _modified_khs
                     ^:mutable __hash
                     ^:mutable _cache]
  IMeta
  (-meta [_] nil)

  IWithMeta
  (-with-meta [this _new-meta] this)

  ICounted
  (-count [_] cnt)

  ILookup
  (-lookup [this k] (-lookup this k nil))
  (-lookup [this k not-found]
    ;; Check LRU cache first
    (if-let [cached (cache-get this k)]
      (second cached)
      (let [kh (hash k)]
        (hamt-find root-off k kh 0)
        (if find-result-found?
          (let [v find-result-val]
            (set! find-result-val nil)
            (cache-put! this k v)
            v)
          not-found))))

  IAssociative
  (-contains-key? [this k]
    (let [kh (hash k)]
      (hamt-find root-off k kh 0)
      (let [found? find-result-found?]
        (set! find-result-val nil)
        found?)))
  (-assoc [this k v]
    (let [kb (ser/serialize-key k)
          vb (ser/serialize-val v)
          kh (hash k)
          new-root (hamt-assoc root-off kh kb vb 0)]
      (if (== new-root root-off)
        this
        (let [new-cnt (if hamt-result-added? (inc cnt) cnt)
              new-map (make-eve-hash-map new-cnt new-root)
              parent-khs _modified_khs
              parent-len (if parent-khs (.-length parent-khs) 0)]
          (when (<= parent-len 8)
            (set! (.-_modified_khs new-map)
                  (if (or (nil? parent-khs) (zero? parent-len))
                    #js [kh]
                    (let [khs (.slice parent-khs 0)] (.push khs kh) khs))))
          new-map))))

  IMap
  (-dissoc [this k]
    (let [kh (hash k)
          kb (ser/serialize-key k)
          new-root (hamt-dissoc root-off kh kb 0)]
      (if-not hamt-result-removed?
        this
        (if (== new-root eve-alloc/NIL_OFFSET)
          (make-eve-hash-map 0 eve-alloc/NIL_OFFSET)
          (let [new-map (make-eve-hash-map (dec cnt) new-root)
                parent-khs _modified_khs
                parent-len (if parent-khs (.-length parent-khs) 0)]
            (when (<= parent-len 8)
              (set! (.-_modified_khs new-map)
                    (if (or (nil? parent-khs) (zero? parent-len))
                      #js [kh]
                      (let [khs (.slice parent-khs 0)] (.push khs kh) khs))))
            new-map)))))

  ICollection
  (-conj [this entry]
    (if (vector? entry)
      (-assoc this (nth entry 0) (nth entry 1))
      (if (satisfies? IMapEntry entry)
        (-assoc this (key entry) (val entry))
        (reduce -conj this entry))))

  IEmptyableCollection
  (-empty [_] (make-eve-hash-map 0 eve-alloc/NIL_OFFSET))

  ISeqable
  (-seq [_]
    (when (pos? cnt)
      (hamt-seq root-off)))

  IReduce
  (-reduce [this f]
    (if (zero? cnt)
      (f)
      (let [result (hamt-kv-reduce root-off
                                    (fn [acc k v]
                                      (if (nil? acc)
                                        (MapEntry. k v nil)
                                        (f acc (MapEntry. k v nil))))
                                    nil)]
        (if (reduced? result) @result result))))
  (-reduce [_ f init]
    (let [result (hamt-kv-reduce root-off
                                  (fn [acc k v] (f acc (MapEntry. k v nil)))
                                  init)]
      (if (reduced? result) @result result)))

  IKVReduce
  (-kv-reduce [_ f init]
    (let [result (hamt-kv-reduce root-off f init)]
      (if (reduced? result) @result result)))

  IEquiv
  (-equiv [this other]
    (and (map? other)
         (== cnt (count other))
         (every? (fn [[k v]]
                   (hamt-find root-off k (hash k) 0)
                   (and find-result-found? (= v find-result-val)))
                 other)))

  IHash
  (-hash [this]
    (if __hash
      __hash
      (let [h (hash-unordered-coll this)]
        (set! __hash h) h)))

  IFn
  (-invoke [this k] (-lookup this k nil))
  (-invoke [this k not-found] (-lookup this k not-found))

  IEditableCollection
  (-as-transient [this]
    (->TransientEveHashMap root-off this root-off cnt (js/Object.) false))

  IPrintWithWriter
  (-pr-writer [this writer opts]
    (-write writer "{")
    (let [s (seq this)]
      (when s
        (loop [[[k v] & more] s first? true]
          (when-not first? (-write writer ", "))
          (-write writer (pr-str k))
          (-write writer " ")
          (-write writer (pr-str v))
          (when more (recur more false)))))
    (-write writer "}"))

  d/IDirectSerialize
  (-direct-serialize [this]
    (ser/encode-sab-pointer ser/FAST_TAG_SAB_MAP header-off))

  d/ISabStorable
  (-sab-tag [_] :eve-hash-map)
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
    ;; Proper tree-diffing retirement: only free nodes that differ.
    ;; This prevents use-after-free of shared subtrees.
    ;;
    ;; Mode semantics:
    ;;   :retire - CAS succeeded, `this` is OLD map, `new-value` is NEW map
    ;;             → free OLD nodes not in NEW
    ;;   :free   - CAS failed, `this` is NEW map (abandoned), `new-value` is OLD map
    ;;             → free NEW nodes not in OLD (swap the diff direction)
    (if (instance? EveHashMap new-value)
      (let [this-root root-off
            other-root (.-root-off new-value)]
        (when (not= this-root other-root)
          (case mode
            :retire
            ;; Free OLD (this) nodes not in NEW (new-value)
            ;; Use _modified_khs from NEW map for single-key fast path only
            ;; Multiple keys must use tree-diff to avoid double-freeing shared nodes
            (let [modified-khs (.-_modified_khs new-value)]
              (if (and modified-khs (== (.-length modified-khs) 1))
                ;; Single key - use fast path
                (retire-replaced-path! this-root other-root (aget modified-khs 0))
                ;; Multiple keys or no tracking - use tree diff
                (retire-tree-diff! this-root other-root)))

            :free
            ;; Free NEW (this) nodes not in OLD (new-value)
            ;; Use _modified_khs from THIS map (the abandoned new map) for single-key fast path
            (let [modified-khs _modified_khs]
              (if (and modified-khs (== (.-length modified-khs) 1))
                ;; Single key - use fast path
                (retire-replaced-path! this-root other-root (aget modified-khs 0))
                ;; Multiple keys or no tracking - use tree diff
                (retire-tree-diff! this-root other-root)))

            ;; Unknown mode - fallback to full diff
            (retire-tree-diff! this-root other-root))))
      ;; Not an EveHashMap - must free entire tree (shouldn't happen in normal swap)
      (when (not= root-off eve-alloc/NIL_OFFSET)
        (free-hamt-node! root-off)))
    ;; Free the header block
    (when (not= header-off eve-alloc/NIL_OFFSET)
      (eve-alloc/free! header-off))))

;;=============================================================================
;; TransientEveHashMap — mutable map for batch operations
;;=============================================================================

(deftype TransientEveHashMap [initial-root-off
                          original-persistent
                          ^:mutable root-offset
                          ^:mutable cnt
                          ^:mutable edit
                          ^:mutable use-ht?]
  ICounted
  (-count [_] cnt)

  ILookup
  (-lookup [this k] (-lookup this k nil))
  (-lookup [_ k not-found]
    (when-not edit (throw (js/Error. "Transient used after persistent!")))
    (let [kh (hash k)]
      (hamt-find root-offset k kh 0)
      (if find-result-found?
        (let [v find-result-val] (set! find-result-val nil) v)
        not-found)))

  ITransientCollection
  (-conj! [this entry]
    (when-not edit (throw (js/Error. "Transient used after persistent!")))
    (if (vector? entry)
      (-assoc! this (nth entry 0) (nth entry 1))
      (if (satisfies? IMapEntry entry)
        (-assoc! this (key entry) (val entry))
        (reduce -conj! this entry))))
  (-persistent! [this]
    (when-not edit (throw (js/Error. "Transient used after persistent!")))
    (set! edit nil)
    (if (== root-offset initial-root-off)
      original-persistent
      (make-eve-hash-map cnt root-offset)))

  ITransientAssociative
  (-assoc! [this k v]
    (when-not edit (throw (js/Error. "Transient used after persistent!")))
    (let [kb (ser/serialize-key k)
          vb (ser/serialize-val v)
          kh (hash k)
          new-root (hamt-assoc root-offset kh kb vb 0)]
      (set! root-offset new-root)
      (when hamt-result-added? (set! cnt (inc cnt)))
      this))

  ITransientMap
  (-dissoc! [this k]
    (when-not edit (throw (js/Error. "Transient used after persistent!")))
    (let [kh (hash k)
          kb (ser/serialize-key k)
          new-root (hamt-dissoc root-offset kh kb 0)]
      (set! root-offset new-root)
      (when hamt-result-removed? (set! cnt (dec cnt)))
      this)))

;;=============================================================================
;; Constructors
;;=============================================================================

(defn empty-hash-map
  "Return an empty EVE map."
  []
  (make-eve-hash-map 0 eve-alloc/NIL_OFFSET))

(defn- build-hamt-from-cljs
  "Build HAMT from CLJS map entries. Returns EveHashMap."
  [m]
  ;; X-RAY: pre-transaction snapshot
  (when (eve-xray/trace-enabled?)
    (eve-xray/slab-xray-validate! (str "PRE build-hamt (" (count m) " entries)")))
  ;; POOL-TRACK: clear tracking for this build
  (when (eve-xray/pool-tracking-enabled?)
    (eve-xray/clear-pool-tracking!))
  (let [state #js [eve-alloc/NIL_OFFSET 0]]  ;; [root-off cnt]
    (set! recycle-replaced-nodes? true)
    (reduce-kv
      (fn [_ k v]
        (let [kb (ser/serialize-key k)
              vb (ser/serialize-val v)
              kh (hash k)
              new-root (hamt-assoc (aget state 0) kh kb vb 0)]
          (aset state 0 new-root)
          (when hamt-result-added? (aset state 1 (inc (aget state 1))))
          nil))
      nil
      m)
    (set! recycle-replaced-nodes? false)
    (let [result (make-eve-hash-map (aget state 1) (aget state 0))]
      ;; X-RAY: post-transaction snapshot with pool validation
      (when (eve-xray/trace-enabled?)
        (eve-xray/slab-xray-validate-with-pools! (str "POST build-hamt (" (aget state 1) " entries)")))
      result)))

(defn hash-map
  "Create a new EVE hash-map from key-value pairs."
  [& kvs]
  (if (empty? kvs)
    (empty-hash-map)
    (build-hamt-from-cljs (apply cljs.core/hash-map kvs))))

(defn into-hash-map
  "Create a EVE map from a collection of [key value] entries."
  [entries]
  (let [m (if (map? entries) entries (into {} entries))]
    (if (empty? m)
      (empty-hash-map)
      (build-hamt-from-cljs m))))

;;=============================================================================
;; Parallel Reduce (preduce)
;;=============================================================================

(def ^:private ^:const MIN_PARALLEL_ENTRIES 1000)

(defn- get-top-level-subtrees
  "Extract top-level child offsets and inline KVs from the root node.
   Returns {:children [offsets...] :inline-kvs [[k v]...]}."
  [root-off]
  (if (== root-off eve-alloc/NIL_OFFSET)
    {:children [] :inline-kvs []}
    (let [node-type (read-node-type root-off)
          _ (eve-alloc/resolve-u8! root-off)
          dv eve-alloc/resolved-dv
          u8 eve-alloc/resolved-u8
          base eve-alloc/resolved-base]
      (if (== node-type NODE_TYPE_BITMAP)
        (let [data-bm (.getUint32 dv (+ base 4) true)
              node-bm (.getUint32 dv (+ base 8) true)
              child-count (popcount32 node-bm)
              data-count (popcount32 data-bm)
              children (loop [i 0 acc #js []]
                         (if (>= i child-count)
                           acc
                           (let [child-off (.getInt32 dv (+ base NODE_HEADER_SIZE (* i 4)) true)]
                             (.push acc child-off)
                             (recur (inc i) acc))))
              ;; Read inline KVs
              kv-start (+ base (kv-data-start-off data-bm node-bm))
              inline-kvs (loop [i 0 pos kv-start acc []]
                           (if (>= i data-count)
                             acc
                             (let [key-len (.getUint32 dv pos true)
                                   key-off (+ pos 4)
                                   val-off (+ key-off key-len)
                                   val-len (.getUint32 dv val-off true)
                                   k (ser/deserialize-from-dv {:data-view u8} dv key-off key-len)
                                   v (ser/deserialize-from-dv {:data-view u8} dv (+ val-off 4) val-len)]
                               (recur (inc i)
                                      (+ val-off 4 val-len)
                                      (conj acc [k v])))))]
          {:children (vec children) :inline-kvs inline-kvs})
        ;; Non-bitmap root (rare) — treat as single child
        {:children [root-off] :inline-kvs []}))))

(defn- partition-offsets
  "Split offsets vector into n roughly-equal partitions."
  [offsets n]
  (let [total (count offsets)
        per-partition (max 1 (quot total n))]
    (loop [remaining offsets
           acc []]
      (if (empty? remaining)
        acc
        (let [chunk (vec (take per-partition remaining))]
          (recur (drop per-partition remaining)
                 (conj acc chunk)))))))

(defn preduce
  "Parallel reduce over a EveHashMap. Splits the HAMT tree at the top level
   and reduces each subtree independently, then merges results.

   Falls back to sequential reduce for small maps.

   init-fn:  (fn [] init-val) - called per partition
   rfn:      (fn [acc k v] acc') - per-entry reduction
   merge-fn: (fn [acc1 acc2] merged) - combines partition results"
  [^js sab-map init-fn rfn merge-fn]
  (let [cnt (.-cnt sab-map)
        root-off (.-root-off sab-map)]
    (if (< cnt MIN_PARALLEL_ENTRIES)
      ;; Sequential fallback
      (let [result (hamt-kv-reduce root-off rfn (init-fn))]
        (if (reduced? result) @result result))
      ;; Parallel path
      (let [{:keys [children inline-kvs]} (get-top-level-subtrees root-off)]
        (if (<= (count children) 1)
          (let [result (hamt-kv-reduce root-off rfn (init-fn))]
            (if (reduced? result) @result result))
          (let [num-partitions (min (count children) 4)
                partitions (partition-offsets children num-partitions)
                inline-acc (reduce (fn [acc [k v]] (rfn acc k v))
                                   (init-fn)
                                   inline-kvs)
                partition-results
                (mapv (fn [offsets]
                        (let [init (init-fn)]
                          (reduce (fn [acc child-off]
                                    (let [r (hamt-kv-reduce child-off rfn acc)]
                                      (if (reduced? r) @r r)))
                                  init
                                  offsets)))
                      partitions)]
            (reduce merge-fn inline-acc partition-results)))))))

;;=============================================================================
;; SAB Pointer Registration
;; Enables serialize.cljs to encode/decode EveHashMap as SAB pointers
;;=============================================================================

;; Register constructor for deserializing SAB pointer tags.
;; In slab version, constructor takes just the slab-qualified header offset.
(ser/register-sab-type-constructor!
  ser/FAST_TAG_SAB_MAP
  (fn [_sab header-off] (make-eve-hash-map-from-header header-off)))

;; Register CLJS map → SabMap auto-conversion
(ser/register-cljs-to-sab-builder!
  map?
  (fn [m] (build-hamt-from-cljs m)))

;; Direct map encoder: builds HAMT, creates root metadata, returns pointer bytes
(ser/set-direct-map-encoder!
  (fn [m]
    (let [root (build-hamt-from-cljs m)]
      (ser/encode-sab-pointer ser/FAST_TAG_SAB_MAP (.-header-off root)))))

;;=============================================================================
;; HAMT Tree Validator — for X-RAY diagnostics
;;=============================================================================
;; Walks the HAMT tree and validates:
;;   1. All offsets are valid slab-qualified offsets (class 0-5)
;;   2. All node types are valid (1=BITMAP, 3=COLLISION)
;;   3. No cycles (same offset visited twice)
;;   4. Depth limit not exceeded
;;   5. Child count matches bitmap popcount

(def ^:const ^:private HAMT_MAX_DEPTH 32)
(def ^:const ^:private HAMT_MAX_NODES 1000000)

(defn- validate-slab-offset
  "Check if a slab-qualified offset looks valid.
   Returns nil if valid, error string if invalid."
  [slab-off]
  (when (not= slab-off eve-alloc/NIL_OFFSET)
    (let [class-idx (eve-alloc/decode-class-idx slab-off)
          block-idx (eve-alloc/decode-block-idx slab-off)]
      (cond
        ;; Class must be 0-5 (HAMT nodes use slab classes, not legacy class 6)
        (or (< class-idx 0) (> class-idx 5))
        (str "invalid class-idx=" class-idx " (expected 0-5)")

        ;; Block index must be non-negative
        (< block-idx 0)
        (str "negative block-idx=" block-idx)

        ;; Suspiciously large block index (likely corruption)
        (> block-idx 10000000)
        (str "suspiciously large block-idx=" block-idx)

        :else nil))))

(defn- validate-hamt-node
  "Validate a single HAMT node. Returns {:valid? bool :errors [...] :children [...]}."
  [slab-off depth visited errors-acc]
  (cond
    ;; NIL is always valid (empty subtree)
    (== slab-off eve-alloc/NIL_OFFSET)
    {:valid? true :children [] :visited visited}

    ;; Depth check
    (> depth HAMT_MAX_DEPTH)
    {:valid? false
     :children []
     :visited visited
     :errors (conj errors-acc (str "depth " depth " exceeds max " HAMT_MAX_DEPTH
                                   " at offset " slab-off
                                   " (0x" (.toString slab-off 16) ")"))}

    ;; Cycle detection
    (.has visited slab-off)
    {:valid? false
     :children []
     :visited visited
     :errors (conj errors-acc (str "cycle detected: offset " slab-off
                                   " (0x" (.toString slab-off 16) ") already visited"))}

    :else
    (let [;; Validate offset format
          offset-err (validate-slab-offset slab-off)]
      (if offset-err
        {:valid? false
         :children []
         :visited visited
         :errors (conj errors-acc (str "invalid offset " slab-off
                                       " (0x" (.toString slab-off 16) "): " offset-err))}
        ;; Try to read the node
        (try
          (let [_ (.add visited slab-off)
                node-type (read-node-type slab-off)]
            (case node-type
              ;; Bitmap node
              1 (let [base (eve-alloc/resolve-u8! slab-off)
                      node-bm (r-get-u32 8)
                      child-count (popcount32 node-bm)
                      children (loop [i 0 acc #js []]
                                 (if (>= i child-count)
                                   acc
                                   (let [child-off (read-child-offset slab-off i)]
                                     (.push acc child-off)
                                     (recur (inc i) acc))))]
                  {:valid? true
                   :children (vec children)
                   :visited visited})

              ;; Collision node (no children, just KV pairs)
              3 {:valid? true :children [] :visited visited}

              ;; Invalid node type
              {:valid? false
               :children []
               :visited visited
               :errors (conj errors-acc (str "invalid node type " node-type
                                             " at offset " slab-off
                                             " (0x" (.toString slab-off 16) ")"
                                             " (expected 1 or 3)"))}))
          (catch :default e
            {:valid? false
             :children []
             :visited visited
             :errors (conj errors-acc (str "exception reading offset " slab-off
                                           " (0x" (.toString slab-off 16) "): "
                                           (.-message e)))}))))))

(defn validate-hamt-tree
  "Walk the HAMT tree from root-off and validate all nodes.
   Returns {:valid? bool :errors [...] :node-count int :max-depth int}."
  [root-off]
  (let [visited (js/Set.)
        errors #js []
        node-count (volatile! 0)
        max-depth (volatile! 0)]
    (loop [queue [[root-off 0]]]  ;; [offset, depth] pairs
      (if (empty? queue)
        {:valid? (zero? (.-length errors))
         :errors (vec (array-seq errors))
         :node-count @node-count
         :max-depth @max-depth}
        (let [[off depth] (first queue)
              rest-queue (rest queue)]
          (vswap! max-depth max depth)
          (if (> @node-count HAMT_MAX_NODES)
            {:valid? false
             :errors [(str "exceeded max nodes " HAMT_MAX_NODES " - likely corruption")]
             :node-count @node-count
             :max-depth @max-depth}
            (let [result (validate-hamt-node off depth visited errors)]
              (when-not (:valid? result)
                (doseq [e (:errors result)]
                  (.push errors e)))
              (when (not= off eve-alloc/NIL_OFFSET)
                (vswap! node-count inc))
              ;; Add children to queue with incremented depth
              (let [children (:children result)
                    new-queue (reduce (fn [q child-off]
                                        (conj q [child-off (inc depth)]))
                                      (vec rest-queue)
                                      children)]
                (recur new-queue)))))))))

(defn validate-eve-hash-map
  "Validate an EveHashMap's HAMT tree structure.
   Returns {:valid? bool :errors [...] :node-count int :max-depth int}."
  [^js eve-map]
  (let [header-off (.-header-off eve-map)
        ;; Read root offset from header
        base (eve-alloc/resolve-dv! header-off)
        root-off (.getInt32 eve-alloc/resolved-dv (+ base SABMAPROOT_ROOT_OFF_OFFSET) true)]
    (validate-hamt-tree root-off)))

;;=============================================================================
;; Register HAMT validator with X-RAY guard
;;=============================================================================
;; This allows the X-RAY guard to validate HAMT tree structure on every
;; transaction when enabled, catching corruption before it causes crashes.

(defn validate-from-header-offset
  "Validate HAMT tree given an EveHashMap header slab-qualified offset.
   Resolves the header, reads root-off, and validates the tree.
   Returns {:valid? bool :errors [...] :node-count int :max-depth int :root-off int}."
  [header-off]
  (let [;; Resolve header and read root-off
        base (eve-alloc/resolve-dv! header-off)
        root-off (.getInt32 eve-alloc/resolved-dv (+ base SABMAPROOT_ROOT_OFF_OFFSET) true)
        result (validate-hamt-tree root-off)]
    (assoc result :root-off root-off)))

(atom/register-xray-hamt-validator! validate-from-header-offset)
