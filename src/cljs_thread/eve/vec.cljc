(ns cljs-thread.eve.vec
  "Slab-backed persistent vector — shared CLJ/CLJS.

   JVM provides read-only access (nth, count, seq) via ISlabIO.
   Write support (conj, assoc, pop) is CLJS-only in this phase."
  #?(:cljs
     (:require
      [cljs-thread.eve.deftype-proto.alloc :as eve-alloc]
      [cljs-thread.eve.deftype-proto.data :as d]
      [cljs-thread.eve.deftype-proto.serialize :as ser])
     :clj
     (:require
      [cljs-thread.eve.deftype-proto.alloc :as eve-alloc
       :refer [ISlabIO -sio-read-i32 -sio-read-bytes -sio-read-u8
               -sio-write-i32! -sio-write-u8! -sio-write-bytes! -sio-alloc!
               NIL_OFFSET]]
      [cljs-thread.eve.deftype-proto.data :as d]
      [cljs-thread.eve.mem :as mem :refer [eve-bytes->value value+sio->eve-bytes
                                            register-jvm-collection-writer!]])))

;;=============================================================================
;; Shared Constants
;;=============================================================================

(def ^:const NODE_SIZE 32)
(def ^:const SHIFT_STEP 5)
(def ^:const MASK 0x1f)

(def ^:const SabVecRoot-type-id 0x12)
(def ^:const SabVecN-type-id 0x16)

(def ^:const SABVECROOT_CNT_OFFSET 4)
(def ^:const SABVECROOT_SHIFT_OFFSET 8)
(def ^:const SABVECROOT_ROOT_OFFSET 12)
(def ^:const SABVECROOT_TAIL_OFFSET 16)
(def ^:const SABVECROOT_TAIL_LEN_OFFSET 20)
(def ^:const SABVECROOT_HEADER_SIZE 24)

(def ^:const SABVECN_NODE_SIZE_OFFSET 24)
(def ^:const SABVECN_HEADER_SIZE 28)

;;=============================================================================
;; CLJS implementations
;;=============================================================================

#?(:cljs
   (do
;; NODE_SIZE determines how many elements per node/chunk.
;; Valid values: 32, 64, 128, 256, 512, 1024
;; Each size requires a corresponding SHIFT_STEP = log2(NODE_SIZE)
;;-----------------------------------------------------------------------------

;; Default chunk size - can be overridden at construction time
(def ^:dynamic *chunk-size* 32)

(defn- size->shift
  "Convert node size to shift step (log2)."
  [size]
  (case size
    32   5
    64   6
    128  7
    256  8
    512  9
    1024 10
    ;; Default for unsupported sizes - compute log2
    (loop [s size, shift 0]
      (if (<= s 1)
        shift
        (recur (unsigned-bit-shift-right s 1) (inc shift))))))

(defn- size->mask
  "Convert node size to bit mask (size - 1)."
  [size]
  (dec size))

;;-----------------------------------------------------------------------------
;; Pool System — simplified for slab allocator
;;-----------------------------------------------------------------------------
;; In the slab world, pools just hold slab-qualified offsets.
;; No descriptor-idx tracking needed — free! takes a slab-qualified offset.

(def ^:private ^:const MAX_POOL_SIZE 256)
(def ^:private ^:const BATCH_ALLOC_SIZE 32)

(defn- size-class-for [n]
  (cond (<= n 128) 128 (<= n 256) 256 (<= n 512) 512 (<= n 1024) 1024 :else nil))

;; Per-class pools — each entry is just a slab-qualified offset (i32).
(def ^:private pool-128 #js [])
(def ^:private pool-256 #js [])
(def ^:private pool-512 #js [])
(def ^:private pool-1024 #js [])

(defn reset-pools! []
  (set! pool-128 #js [])
  (set! pool-256 #js [])
  (set! pool-512 #js [])
  (set! pool-1024 #js []))

(defn drain-pools! []
  (doseq [pool [pool-128 pool-256 pool-512 pool-1024]]
    (dotimes [i (.-length pool)]
      (eve-alloc/free! (aget pool i))))
  (set! pool-128 #js [])
  (set! pool-256 #js [])
  (set! pool-512 #js [])
  (set! pool-1024 #js []))

(defn- pool-get! [size-class]
  (let [stack (case size-class
                128 pool-128  256 pool-256
                512 pool-512  1024 pool-1024
                nil)]
    (when (and stack (pos? (.-length stack)))
      (.pop stack))))

(defn- pool-put! [size-class slab-offset]
  (let [stack (case size-class
                128 pool-128  256 pool-256
                512 pool-512  1024 pool-1024
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
            (throw (js/Error. (str "Vec allocation failed: out of memory for " size-class " bytes"))))
          ;; Put extras into pool
          (loop [i 1]
            (when (< i len)
              (pool-put! size-class (aget results i))
              (recur (inc i))))
          ;; Return first
          (aget results 0)))
      ;; Too large for pooling — direct alloc
      (eve-alloc/alloc-offset n))))

;;-----------------------------------------------------------------------------
;; Resolved-node access helpers
;;-----------------------------------------------------------------------------
;; After calling resolve-dv!/resolve-u8!, use these to read fields at
;; (resolved-dv, resolved-base + field-offset) without re-resolving.

(defn- r-get-i32 ^number [^number off]
  (.getInt32 eve-alloc/resolved-dv (+ eve-alloc/resolved-base off) true))

(defn- r-set-i32 [^number off ^number val]
  (.setInt32 eve-alloc/resolved-dv (+ eve-alloc/resolved-base off) val true))

;;-----------------------------------------------------------------------------
;; Node operations
;;-----------------------------------------------------------------------------

(defn- alloc-node!
  "Allocate a node-size element int32 array initialized to NIL_OFFSET (nil sentinel).
   Returns the slab-qualified offset."
  ([] (alloc-node! NODE_SIZE))
  ([node-size]
   (when-not d/*parent-atom*
     (throw (js/Error. (str "alloc-node! called outside atomic context — *parent-atom* not bound. "
                            "Stack: " (.-stack (js/Error.))))))
   (let [byte-size (* node-size 4)
         slab-off (alloc-bytes! byte-size)
         base (eve-alloc/resolve-dv! slab-off)
         dv eve-alloc/resolved-dv]
     ;; Initialize all slots to NIL_OFFSET (nil sentinel)
     (dotimes [i node-size]
       (.setInt32 dv (+ base (* i 4)) eve-alloc/NIL_OFFSET true))
     slab-off)))

(defn- node-get
  "Get the i-th slot from a node at the given slab-qualified offset."
  [^number slab-off ^number i]
  (let [base (eve-alloc/resolve-dv! slab-off)]
    (.getInt32 eve-alloc/resolved-dv (+ base (* i 4)) true)))

(defn- node-set!
  "Set the i-th slot in a node. Returns the slab-qualified offset."
  [^number slab-off ^number i ^number val]
  (let [base (eve-alloc/resolve-dv! slab-off)]
    (.setInt32 eve-alloc/resolved-dv (+ base (* i 4)) val true))
  slab-off)

(defn- clone-node!
  "Allocate a new node and copy contents from source."
  ([^number src-slab-off] (clone-node! src-slab-off NODE_SIZE))
  ([^number src-slab-off ^number node-size]
   (let [byte-size (* node-size 4)
         new-slab-off (alloc-bytes! byte-size)]
     ;; Copy all slots from source to destination
     (dotimes [i node-size]
       (let [v (node-get src-slab-off i)]
         (node-set! new-slab-off i v)))
     new-slab-off)))

;;-----------------------------------------------------------------------------
;; Value block operations
;; Value block layout: [len:u32][bytes...]
;;-----------------------------------------------------------------------------

(defn- make-value-block!
  "Allocate and write a serialized value. Returns slab-qualified offset."
  [^js val-bytes]
  (let [val-len (.-length val-bytes)
        total-size (+ 4 val-len)
        slab-off (alloc-bytes! total-size)
        base (eve-alloc/resolve-u8! slab-off)]
    (.setUint32 eve-alloc/resolved-dv (+ base 0) val-len true)
    (when (pos? val-len)
      (.set eve-alloc/resolved-u8 val-bytes (+ base 4)))
    slab-off))

(defn- read-value-block
  "Read value from a value block slab-qualified offset. Returns deserialized value.
   Uses zero-copy deserialization — reads directly from DataView, no byte copies."
  [^number val-slab-off]
  (let [base (eve-alloc/resolve-u8! val-slab-off)
        dv eve-alloc/resolved-dv
        u8 eve-alloc/resolved-u8
        val-len (.getUint32 dv base true)]
    (ser/deserialize-from-dv {:data-view u8} dv (+ base 4) val-len)))

;;-----------------------------------------------------------------------------
;; Disposal helpers - recursive freeing for vector trees
;;-----------------------------------------------------------------------------

(defn- free-block!
  "Free a single allocation block by its slab-qualified offset."
  [^number slab-off]
  (when (not= slab-off eve-alloc/NIL_OFFSET)
    (eve-alloc/free! slab-off)))

(defn- free-leaf-node!
  "Free a leaf node and all its value blocks."
  [^number node-slab-off ^number node-size]
  (when (not= node-slab-off eve-alloc/NIL_OFFSET)
    ;; Free each value block pointed to by this leaf
    (dotimes [i node-size]
      (let [val-off (node-get node-slab-off i)]
        (when (not= val-off eve-alloc/NIL_OFFSET)
          (free-block! val-off))))
    ;; Free the leaf node itself
    (free-block! node-slab-off)))

(defn- free-trie-node!
  "Recursively free a trie node and all its descendants."
  [^number node-slab-off ^number shift ^number node-size ^number shift-step]
  (when (not= node-slab-off eve-alloc/NIL_OFFSET)
    (if (zero? shift)
      ;; Leaf level — free value blocks
      (free-leaf-node! node-slab-off node-size)
      ;; Internal node — recurse into children
      (do
        (dotimes [i node-size]
          (let [child-off (node-get node-slab-off i)]
            (when (not= child-off eve-alloc/NIL_OFFSET)
              (free-trie-node! child-off (- shift shift-step) node-size shift-step))))
        ;; Free this internal node
        (free-block! node-slab-off)))))

;;-----------------------------------------------------------------------------
;; Internal implementation helpers (configurable chunk size)
;;-----------------------------------------------------------------------------

(defn- tail-offset-calc
  "Calculate the index where the tail starts."
  ([cnt] (tail-offset-calc cnt NODE_SIZE SHIFT_STEP))
  ([cnt node-size shift-step]
   (if (< cnt node-size)
     0
     (bit-shift-left (unsigned-bit-shift-right (dec cnt) shift-step) shift-step))))

(defn- nth-impl
  "Get element at index. Takes field values."
  ([cnt shift root tail n]
   (nth-impl cnt shift root tail n NODE_SIZE SHIFT_STEP MASK))
  ([cnt shift root tail n node-size shift-step mask]
   (let [toff (tail-offset-calc cnt node-size shift-step)]
     (if (>= n toff)
       ;; Element is in tail
       (let [val-off (node-get tail (- n toff))]
         (read-value-block val-off))
       ;; Element is in trie
       (let [val-off (loop [node-off root
                            sh shift]
                       (let [idx (bit-and (unsigned-bit-shift-right n sh) mask)]
                         (if (zero? sh)
                           (node-get node-off idx)
                           (recur (node-get node-off idx) (- sh shift-step)))))]
         (read-value-block val-off))))))

(defn- new-path
  "Create a new path from root to leaf at given shift level."
  ([shift leaf-offset]
   (new-path shift leaf-offset NODE_SIZE SHIFT_STEP))
  ([shift leaf-offset node-size shift-step]
   (if (zero? shift)
     leaf-offset
     (let [node-off (alloc-node! node-size)]
       (node-set! node-off 0 (new-path (- shift shift-step) leaf-offset node-size shift-step))
       node-off))))

(defn- push-tail
  "Push a full tail into the trie, returning new root offset."
  ([shift parent-off tail-off cnt]
   (push-tail shift parent-off tail-off cnt NODE_SIZE SHIFT_STEP MASK))
  ([shift parent-off tail-off cnt node-size shift-step mask]
   (let [idx (bit-and (unsigned-bit-shift-right (dec cnt) shift) mask)
         new-parent-off (if (== parent-off eve-alloc/NIL_OFFSET)
                          (alloc-node! node-size)
                          (clone-node! parent-off node-size))]
     (if (== shift shift-step)
       ;; At the bottom level, insert tail directly
       (do
         (node-set! new-parent-off idx tail-off)
         new-parent-off)
       ;; Recurse into child
       (let [child-off (node-get new-parent-off idx)
             new-child-off (if (== child-off eve-alloc/NIL_OFFSET)
                             (new-path (- shift shift-step) tail-off node-size shift-step)
                             (push-tail (- shift shift-step) child-off tail-off cnt node-size shift-step mask))]
         (node-set! new-parent-off idx new-child-off)
         new-parent-off)))))

(defn- do-assoc
  "Recursively update trie at index n with value offset."
  ([shift node-off n val-off]
   (do-assoc shift node-off n val-off NODE_SIZE SHIFT_STEP MASK))
  ([shift node-off n val-off node-size shift-step mask]
   (let [new-node-off (clone-node! node-off node-size)
         idx (bit-and (unsigned-bit-shift-right n shift) mask)]
     (if (zero? shift)
       (do
         (node-set! new-node-off idx val-off)
         new-node-off)
       (let [child-off (node-get node-off idx)
             new-child-off (do-assoc (- shift shift-step) child-off n val-off node-size shift-step mask)]
         (node-set! new-node-off idx new-child-off)
         new-node-off)))))

(defn- pop-tail
  "Remove the rightmost leaf from the trie."
  ([shift node-off cnt]
   (pop-tail shift node-off cnt NODE_SIZE SHIFT_STEP MASK))
  ([shift node-off cnt node-size shift-step mask]
   (let [idx (bit-and (unsigned-bit-shift-right (dec cnt) shift) mask)]
     (cond
       (> shift shift-step)
       (let [child-off (node-get node-off idx)
             new-child (pop-tail (- shift shift-step) child-off cnt node-size shift-step mask)]
         (if (and (== new-child eve-alloc/NIL_OFFSET) (zero? idx))
           eve-alloc/NIL_OFFSET
           (let [new-node-off (clone-node! node-off node-size)]
             (node-set! new-node-off idx new-child)
             new-node-off)))

       (zero? idx)
       eve-alloc/NIL_OFFSET

       :else
       (let [new-node-off (clone-node! node-off node-size)]
         (node-set! new-node-off idx eve-alloc/NIL_OFFSET)
         new-node-off)))))

;;-----------------------------------------------------------------------------
;; SabVecRoot header helpers
;;-----------------------------------------------------------------------------

(defn- write-vec-header!
  "Write SabVecRoot fields to the header block."
  [^number header-off ^number cnt ^number shift ^number root ^number tail ^number tail-len]
  (eve-alloc/resolve-dv! header-off)
  (.setUint8 eve-alloc/resolved-dv (+ eve-alloc/resolved-base 0) SabVecRoot-type-id)
  (r-set-i32 SABVECROOT_CNT_OFFSET cnt)
  (r-set-i32 SABVECROOT_SHIFT_OFFSET shift)
  (r-set-i32 SABVECROOT_ROOT_OFFSET root)
  (r-set-i32 SABVECROOT_TAIL_OFFSET tail)
  (r-set-i32 SABVECROOT_TAIL_LEN_OFFSET tail-len))

(defn- read-vec-header
  "Read SabVecRoot fields from a header block.
   Returns [cnt shift root tail tail-len]."
  [^number header-off]
  (eve-alloc/resolve-dv! header-off)
  [(r-get-i32 SABVECROOT_CNT_OFFSET)
   (r-get-i32 SABVECROOT_SHIFT_OFFSET)
   (r-get-i32 SABVECROOT_ROOT_OFFSET)
   (r-get-i32 SABVECROOT_TAIL_OFFSET)
   (r-get-i32 SABVECROOT_TAIL_LEN_OFFSET)])

;;-----------------------------------------------------------------------------
;; SabVecRoot - the persistent vector handle
;;-----------------------------------------------------------------------------

(declare dispose!)

(defn- make-sab-vec-root
  "Create a SabVecRoot, allocating a header block in the slab.
   The header stores: [cnt:i32 | shift:i32 | root:i32 | tail:i32 | tail-len:i32]."
  [cnt shift root tail tail-len]
  (let [header-off (alloc-bytes! SABVECROOT_HEADER_SIZE)]
    (write-vec-header! header-off cnt shift root tail tail-len)
    (SabVecRoot. cnt shift root tail tail-len header-off)))

(defn- make-sab-vec-root-from-header
  "Reconstruct a SabVecRoot from an existing header slab-qualified offset.
   Reads all fields from the header block."
  [header-off]
  (let [[cnt shift root tail tail-len] (read-vec-header header-off)]
    (SabVecRoot. cnt shift root tail tail-len header-off)))

(deftype SabVecRoot [cnt shift root tail tail-len header-off]

  ;; Marker protocol for sequential collections
  ISequential

  ICounted
  (-count [_] cnt)

  ILookup
  (-lookup [_ k]
    (if (and (integer? k) (>= k 0) (< k cnt))
      (nth-impl cnt shift root tail k)
      nil))
  (-lookup [_ k not-found]
    (if (and (integer? k) (>= k 0) (< k cnt))
      (nth-impl cnt shift root tail k)
      not-found))

  IIndexed
  (-nth [_ n]
    (if (or (neg? n) (>= n cnt))
      (throw (js/Error. (str "Index out of bounds: " n)))
      (nth-impl cnt shift root tail n)))
  (-nth [this n not-found]
    (if (or (neg? n) (>= n cnt))
      not-found
      (-nth this n)))

  ICollection
  (-conj [_ val]
    (let [val-bytes (ser/serialize-element val)
          val-off (make-value-block! val-bytes)]
      (if (< tail-len NODE_SIZE)
        ;; Room in tail
        (let [new-tail (clone-node! tail)]
          (node-set! new-tail tail-len val-off)
          (make-sab-vec-root (inc cnt) shift root new-tail (inc tail-len)))
        ;; Tail is full, push into trie
        (let [old-tail tail
              new-tail (alloc-node!)
              _ (node-set! new-tail 0 val-off)]
          (if (>= (bit-shift-left 1 shift) (unsigned-bit-shift-right cnt SHIFT_STEP))
            ;; Room in trie
            (let [new-root (push-tail shift root old-tail cnt)]
              (make-sab-vec-root (inc cnt) shift new-root new-tail 1))
            ;; Trie needs to grow
            (let [new-root-off (alloc-node!)
                  _ (node-set! new-root-off 0 root)
                  new-shift (+ shift SHIFT_STEP)
                  _ (node-set! new-root-off 1 (new-path shift old-tail))]
              (make-sab-vec-root (inc cnt) new-shift new-root-off new-tail 1)))))))

  IEmptyableCollection
  (-empty [_]
    (empty-sab-vec))

  IStack
  (-peek [_]
    (when (pos? cnt)
      (nth-impl cnt shift root tail (dec cnt))))

  (-pop [_]
    (cond
      (zero? cnt)
      (throw (js/Error. "Can't pop empty vector"))

      (== cnt 1)
      (empty-sab-vec)

      :else
      (if (> tail-len 1)
        ;; Just shrink tail
        (let [new-tail (clone-node! tail)]
          (node-set! new-tail (dec tail-len) eve-alloc/NIL_OFFSET)
          (make-sab-vec-root (dec cnt) shift root new-tail (dec tail-len)))
        ;; Need to get new tail from trie
        (let [new-cnt (dec cnt)
              ;; Find the leaf that will become the new tail
              new-tail-off (loop [node-off root
                                  sh shift]
                             (let [idx (bit-and (unsigned-bit-shift-right (dec new-cnt) sh) MASK)]
                               (if (zero? sh)
                                 node-off
                                 (recur (node-get node-off idx) (- sh SHIFT_STEP)))))
              new-root (pop-tail shift root cnt)]
          (cond
            ;; Root became nil
            (== new-root eve-alloc/NIL_OFFSET)
            (make-sab-vec-root new-cnt SHIFT_STEP eve-alloc/NIL_OFFSET new-tail-off NODE_SIZE)

            ;; Root has only one child and we can collapse
            (and (> shift SHIFT_STEP)
                 (== (node-get new-root 1) eve-alloc/NIL_OFFSET))
            (make-sab-vec-root new-cnt (- shift SHIFT_STEP)
                               (node-get new-root 0) new-tail-off NODE_SIZE)

            :else
            (make-sab-vec-root new-cnt shift new-root new-tail-off NODE_SIZE))))))

  IVector
  (-assoc-n [this n val]
    (cond
      (== n cnt)
      (-conj this val)

      (or (neg? n) (> n cnt))
      (throw (js/Error. (str "Index " n " out of bounds [0," cnt "]")))

      :else
      (let [val-bytes (ser/serialize-element val)
            val-off (make-value-block! val-bytes)
            toff (tail-offset-calc cnt)]
        (if (>= n toff)
          ;; Update in tail
          (let [new-tail (clone-node! tail)]
            (node-set! new-tail (- n toff) val-off)
            (make-sab-vec-root cnt shift root new-tail tail-len))
          ;; Update in trie
          (let [new-root (do-assoc shift root n val-off)]
            (make-sab-vec-root cnt shift new-root tail tail-len))))))

  IAssociative
  (-assoc [this k v]
    (if (integer? k)
      (-assoc-n this k v)
      (throw (js/Error. "Vector's key for assoc must be a number."))))
  (-contains-key? [_ k]
    (and (integer? k) (>= k 0) (< k cnt)))

  IFn
  (-invoke [this k]
    (-lookup this k nil))
  (-invoke [this k not-found]
    (-lookup this k not-found))

  ISeqable
  (-seq [_]
    (when (pos? cnt)
      ((fn iter [i]
         (lazy-seq
          (when (< i cnt)
            (cons (nth-impl cnt shift root tail i) (iter (inc i))))))
       0)))

  IReduce
  (-reduce [_ f]
    (case cnt
      0 (f)
      1 (nth-impl cnt shift root tail 0)
      (loop [i 1 acc (nth-impl cnt shift root tail 0)]
        (if (>= i cnt)
          acc
          (let [acc' (f acc (nth-impl cnt shift root tail i))]
            (if (reduced? acc') @acc' (recur (inc i) acc')))))))
  (-reduce [_ f init]
    (loop [i 0 acc init]
      (if (or (>= i cnt) (reduced? acc))
        (if (reduced? acc) @acc acc)
        (recur (inc i) (f acc (nth-impl cnt shift root tail i))))))

  IEquiv
  (-equiv [_ other]
    (cond
      (not (sequential? other)) false
      (not= cnt (count other)) false
      :else
      (loop [i 0]
        (if (>= i cnt)
          true
          (if (= (nth-impl cnt shift root tail i) (nth other i))
            (recur (inc i))
            false)))))

  IHash
  (-hash [this]
    (hash-ordered-coll this))

  IPrintWithWriter
  (-pr-writer [_ writer opts]
    (-write writer "#sab/vec [")
    (dotimes [i (min cnt 10)]
      (when (pos? i) (-write writer " "))
      (-write writer (pr-str (nth-impl cnt shift root tail i))))
    (when (> cnt 10)
      (-write writer " ..."))
    (-write writer "]"))

  d/IDirectSerialize
  (-direct-serialize [this]
    (ser/encode-sab-pointer ser/FAST_TAG_SAB_VEC header-off))

  d/ISabStorable
  (-sab-tag [_] :eve-vec)
  (-sab-encode [this _slab-env]
    (d/-direct-serialize this))
  (-sab-dispose [this _slab-env]
    (dispose! this))

  d/IsEve
  (-eve? [_] true)

  d/IEveRoot
  (-root-header-off [_] header-off)

  d/ISabRetirable
  (-sab-retire-diff! [this new-value _slab-env mode]
    (let [old-root root
          old-shift shift]
      (if (instance? SabVecRoot new-value)
        ;; Both are SabVecRoot — diff trie paths
        (let [new-root-off (.-root new-value)]
          (retire-replaced-trie-path! old-root new-root-off old-shift -1 mode))
        ;; Different type — dispose entire old trie
        (dispose! this)))))

;;-----------------------------------------------------------------------------
;; Disposal - explicit cleanup for reclaiming slab memory
;;-----------------------------------------------------------------------------

(defn dispose!
  "Dispose a SabVecRoot or SabVecN, freeing its entire trie tree and tail.
   Call this when the vector is no longer needed to reclaim slab memory.

   WARNING: After disposal, the vector must not be used. Any access will
   result in undefined behavior or errors."
  [^js sab-vec]
  (let [root-off (.-root sab-vec)
        tail-off (.-tail sab-vec)
        shift-val (.-shift sab-vec)
        header-off (.-header-off sab-vec)
        ;; Detect SabVecN vs SabVecRoot — SabVecN has node-size field
        ns (if (instance? SabVecN sab-vec)
             (.-node-size sab-vec)
             NODE_SIZE)
        ss (size->shift ns)]
    ;; Free the trie
    (when (not= root-off eve-alloc/NIL_OFFSET)
      (free-trie-node! root-off shift-val ns ss))
    ;; Free the tail (leaf node with value blocks)
    (when (not= tail-off eve-alloc/NIL_OFFSET)
      (free-leaf-node! tail-off ns))
    ;; Free the header block
    (when (not= header-off eve-alloc/NIL_OFFSET)
      (eve-alloc/free! header-off))))

(defn retire-replaced-trie-path!
  "After an atom swap that replaced old-root with new-root, retire the old
   path nodes that are no longer referenced by the new trie.

   Walks both tries following the index bits for the modified index. At each
   level where old-node != new-node, the old node is freed.

   Only retires trie internal/leaf nodes — shared subtrees and value blocks
   are untouched.

   mode: :retire (epoch-based, for multi-worker) or :free (immediate)
   idx: the index that was modified (for assoc) or -1 for structural changes"
  ([old-root new-root shift-val idx]
   (retire-replaced-trie-path! old-root new-root shift-val idx :free))
  ([old-root new-root shift-val idx mode]
   (retire-replaced-trie-path! old-root new-root shift-val idx mode NODE_SIZE SHIFT_STEP MASK))
  ([old-root new-root shift-val idx mode node-size shift-step mask]
   (when (and (not= old-root eve-alloc/NIL_OFFSET) (not= old-root new-root))
     (loop [old-off old-root
            new-off new-root
            sh shift-val]
       (when (and (not= old-off eve-alloc/NIL_OFFSET) (not= old-off new-off))
         ;; Free this old trie node
         (eve-alloc/free! old-off)
         ;; Continue down the trie path
         (when (and (pos? sh) (>= idx 0))
           (let [child-idx (bit-and (unsigned-bit-shift-right idx sh) mask)
                 old-child (node-get old-off child-idx)
                 new-child (node-get new-off child-idx)]
             (recur old-child new-child (- sh shift-step)))))))))

;;-----------------------------------------------------------------------------
;; Constructors
;;-----------------------------------------------------------------------------

(defn empty-sab-vec
  "Create an empty SabVec."
  []
  (let [tail-off (alloc-node!)]
    (make-sab-vec-root 0 SHIFT_STEP eve-alloc/NIL_OFFSET tail-off 0)))

(defn sab-vec
  "Create a SabVec from a sequence of values."
  [coll]
  (reduce conj (empty-sab-vec) coll))

;;-----------------------------------------------------------------------------
;; Configurable Chunk Size Vector
;;
;; SabVecN stores node-size in the root for variable chunk sizes.
;; This enables benchmarking different chunk sizes: 32, 64, 128, 256, 512, 1024
;;-----------------------------------------------------------------------------

;; SabVecN header helpers

(defn- write-vec-n-header!
  "Write SabVecN fields to the header block."
  [^number header-off ^number cnt ^number shift ^number root ^number tail ^number tail-len ^number node-size]
  (eve-alloc/resolve-dv! header-off)
  (.setUint8 eve-alloc/resolved-dv (+ eve-alloc/resolved-base 0) SabVecN-type-id)
  (r-set-i32 SABVECROOT_CNT_OFFSET cnt)
  (r-set-i32 SABVECROOT_SHIFT_OFFSET shift)
  (r-set-i32 SABVECROOT_ROOT_OFFSET root)
  (r-set-i32 SABVECROOT_TAIL_OFFSET tail)
  (r-set-i32 SABVECROOT_TAIL_LEN_OFFSET tail-len)
  (r-set-i32 SABVECN_NODE_SIZE_OFFSET node-size))

(defn- make-sab-vec-n
  "Create a SabVecN, allocating a header block in the slab."
  [cnt shift root tail tail-len node-size]
  (let [header-off (alloc-bytes! SABVECN_HEADER_SIZE)]
    (write-vec-n-header! header-off cnt shift root tail tail-len node-size)
    (SabVecN. cnt shift root tail tail-len node-size header-off)))

(deftype SabVecN [cnt shift root tail tail-len node-size header-off]

  ISequential

  ICounted
  (-count [_] cnt)

  ILookup
  (-lookup [_ k]
    (if (and (integer? k) (>= k 0) (< k cnt))
      (let [shift-step (size->shift node-size)
            mask (size->mask node-size)]
        (nth-impl cnt shift root tail k node-size shift-step mask))
      nil))
  (-lookup [_ k not-found]
    (if (and (integer? k) (>= k 0) (< k cnt))
      (let [shift-step (size->shift node-size)
            mask (size->mask node-size)]
        (nth-impl cnt shift root tail k node-size shift-step mask))
      not-found))

  IIndexed
  (-nth [_ n]
    (if (or (neg? n) (>= n cnt))
      (throw (js/Error. (str "Index out of bounds: " n)))
      (let [shift-step (size->shift node-size)
            mask (size->mask node-size)]
        (nth-impl cnt shift root tail n node-size shift-step mask))))
  (-nth [this n not-found]
    (if (or (neg? n) (>= n cnt))
      not-found
      (-nth this n)))

  ICollection
  (-conj [_ val]
    (let [shift-step (size->shift node-size)
          mask (size->mask node-size)
          val-bytes (ser/serialize-element val)
          val-off (make-value-block! val-bytes)]
      (if (< tail-len node-size)
        ;; Room in tail
        (let [new-tail (clone-node! tail node-size)]
          (node-set! new-tail tail-len val-off)
          (make-sab-vec-n (inc cnt) shift root new-tail (inc tail-len) node-size))
        ;; Tail is full, push into trie
        (let [old-tail tail
              new-tail (alloc-node! node-size)
              _ (node-set! new-tail 0 val-off)]
          (if (>= (bit-shift-left 1 shift) (unsigned-bit-shift-right cnt shift-step))
            ;; Room in trie
            (let [new-root (push-tail shift root old-tail cnt node-size shift-step mask)]
              (make-sab-vec-n (inc cnt) shift new-root new-tail 1 node-size))
            ;; Trie needs to grow
            (let [new-root-off (alloc-node! node-size)
                  _ (node-set! new-root-off 0 root)
                  new-shift (+ shift shift-step)
                  _ (node-set! new-root-off 1 (new-path shift old-tail node-size shift-step))]
              (make-sab-vec-n (inc cnt) new-shift new-root-off new-tail 1 node-size)))))))

  IEmptyableCollection
  (-empty [_]
    (empty-sab-vec-n node-size))

  IStack
  (-peek [_]
    (when (pos? cnt)
      (let [shift-step (size->shift node-size)
            mask (size->mask node-size)]
        (nth-impl cnt shift root tail (dec cnt) node-size shift-step mask))))

  (-pop [_]
    (let [shift-step (size->shift node-size)
          mask (size->mask node-size)]
      (cond
        (zero? cnt)
        (throw (js/Error. "Can't pop empty vector"))

        (== cnt 1)
        (empty-sab-vec-n node-size)

        :else
        (if (> tail-len 1)
          ;; Just shrink tail
          (let [new-tail (clone-node! tail node-size)]
            (node-set! new-tail (dec tail-len) eve-alloc/NIL_OFFSET)
            (make-sab-vec-n (dec cnt) shift root new-tail (dec tail-len) node-size))
          ;; Need to get new tail from trie
          (let [new-cnt (dec cnt)
                ;; Find the leaf that will become the new tail
                new-tail-off (loop [node-off root
                                    sh shift]
                               (let [idx (bit-and (unsigned-bit-shift-right (dec new-cnt) sh) mask)]
                                 (if (zero? sh)
                                   node-off
                                   (recur (node-get node-off idx) (- sh shift-step)))))
                new-root (pop-tail shift root cnt node-size shift-step mask)]
            (cond
              ;; Root became nil
              (== new-root eve-alloc/NIL_OFFSET)
              (make-sab-vec-n new-cnt shift-step eve-alloc/NIL_OFFSET new-tail-off node-size node-size)

              ;; Root has only one child and we can collapse
              (and (> shift shift-step)
                   (== (node-get new-root 1) eve-alloc/NIL_OFFSET))
              (make-sab-vec-n new-cnt (- shift shift-step)
                              (node-get new-root 0) new-tail-off node-size node-size)

              :else
              (make-sab-vec-n new-cnt shift new-root new-tail-off node-size node-size)))))))

  IVector
  (-assoc-n [this n val]
    (let [shift-step (size->shift node-size)
          mask (size->mask node-size)]
      (cond
        (== n cnt)
        (-conj this val)

        (or (neg? n) (> n cnt))
        (throw (js/Error. (str "Index " n " out of bounds [0," cnt "]")))

        :else
        (let [val-bytes (ser/serialize-element val)
              val-off (make-value-block! val-bytes)
              toff (tail-offset-calc cnt node-size shift-step)]
          (if (>= n toff)
            ;; Update in tail
            (let [new-tail (clone-node! tail node-size)]
              (node-set! new-tail (- n toff) val-off)
              (make-sab-vec-n cnt shift root new-tail tail-len node-size))
            ;; Update in trie
            (let [new-root (do-assoc shift root n val-off node-size shift-step mask)]
              (make-sab-vec-n cnt shift new-root tail tail-len node-size)))))))

  IAssociative
  (-assoc [this k v]
    (if (integer? k)
      (-assoc-n this k v)
      (throw (js/Error. "Vector's key for assoc must be a number."))))
  (-contains-key? [_ k]
    (and (integer? k) (>= k 0) (< k cnt)))

  IFn
  (-invoke [this k]
    (-lookup this k nil))
  (-invoke [this k not-found]
    (-lookup this k not-found))

  ISeqable
  (-seq [_]
    (when (pos? cnt)
      (let [shift-step (size->shift node-size)
            mask (size->mask node-size)]
        ((fn iter [i]
           (lazy-seq
            (when (< i cnt)
              (cons (nth-impl cnt shift root tail i node-size shift-step mask) (iter (inc i))))))
         0))))

  IReduce
  (-reduce [_ f]
    (let [shift-step (size->shift node-size)
          mask (size->mask node-size)]
      (case cnt
        0 (f)
        1 (nth-impl cnt shift root tail 0 node-size shift-step mask)
        (loop [i 1 acc (nth-impl cnt shift root tail 0 node-size shift-step mask)]
          (if (>= i cnt)
            acc
            (let [acc' (f acc (nth-impl cnt shift root tail i node-size shift-step mask))]
              (if (reduced? acc')
                @acc'
                (recur (inc i) acc'))))))))
  (-reduce [_ f init]
    (let [shift-step (size->shift node-size)
          mask (size->mask node-size)]
      (loop [i 0 acc init]
        (if (or (>= i cnt) (reduced? acc))
          (if (reduced? acc) @acc acc)
          (recur (inc i) (f acc (nth-impl cnt shift root tail i node-size shift-step mask)))))))

  IEquiv
  (-equiv [_ other]
    (let [shift-step (size->shift node-size)
          mask (size->mask node-size)]
      (cond
        (not (sequential? other)) false
        (not= cnt (count other)) false
        :else
        (loop [i 0]
          (if (>= i cnt)
            true
            (if (= (nth-impl cnt shift root tail i node-size shift-step mask) (nth other i))
              (recur (inc i))
              false))))))

  IHash
  (-hash [this]
    (hash-ordered-coll this))

  IPrintWithWriter
  (-pr-writer [_ writer opts]
    (let [shift-step (size->shift node-size)
          mask (size->mask node-size)]
      (-write writer (str "#sab/vec-" node-size " ["))
      (dotimes [i (min cnt 10)]
        (when (pos? i) (-write writer " "))
        (-write writer (pr-str (nth-impl cnt shift root tail i node-size shift-step mask))))
      (when (> cnt 10)
        (-write writer " ..."))
      (-write writer "]")))

  d/IEveRoot
  (-root-header-off [_] header-off))

;;-----------------------------------------------------------------------------
;; Configurable constructors
;;-----------------------------------------------------------------------------

(defn empty-sab-vec-n
  "Create an empty SabVecN with specified chunk size.
   Valid sizes: 32, 64, 128, 256, 512, 1024"
  [node-size]
  (let [shift-step (size->shift node-size)
        tail-off (alloc-node! node-size)]
    (make-sab-vec-n 0 shift-step eve-alloc/NIL_OFFSET tail-off 0 node-size)))

(defn sab-vec-n
  "Create a SabVecN from a sequence of values with specified chunk size.
   Valid sizes: 32, 64, 128, 256, 512, 1024"
  [node-size coll]
  (reduce conj (empty-sab-vec-n node-size) coll))

;;-----------------------------------------------------------------------------
;; SAB Pointer Registration
;;-----------------------------------------------------------------------------

(ser/register-sab-type-constructor!
  ser/FAST_TAG_SAB_VEC
  SabVecRoot-type-id
  (fn [_sab slab-offset] (make-sab-vec-root-from-header slab-offset)))

;; Register SabVecN header constructor (0x16) — header-only, no FAST_TAG override
(ser/register-header-constructor! SabVecN-type-id
  (fn [_sab slab-offset]
    (eve-alloc/resolve-dv! slab-offset)
    (let [cnt      (r-get-i32 SABVECROOT_CNT_OFFSET)
          shift    (r-get-i32 SABVECROOT_SHIFT_OFFSET)
          root     (r-get-i32 SABVECROOT_ROOT_OFFSET)
          tail     (r-get-i32 SABVECROOT_TAIL_OFFSET)
          tail-len (r-get-i32 SABVECROOT_TAIL_LEN_OFFSET)
          node-sz  (r-get-i32 SABVECN_NODE_SIZE_OFFSET)]
      (SabVecN. cnt shift root tail tail-len node-sz slab-offset))))

;; Register disposers for vec root values
(ser/register-header-disposer! SabVecRoot-type-id
  (fn [slab-off] (dispose! (make-sab-vec-root-from-header slab-off))))
(ser/register-header-disposer! SabVecN-type-id
  (fn [slab-off]
    (eve-alloc/resolve-dv! slab-off)
    (let [cnt      (r-get-i32 SABVECROOT_CNT_OFFSET)
          shift    (r-get-i32 SABVECROOT_SHIFT_OFFSET)
          root     (r-get-i32 SABVECROOT_ROOT_OFFSET)
          tail     (r-get-i32 SABVECROOT_TAIL_OFFSET)
          tail-len (r-get-i32 SABVECROOT_TAIL_LEN_OFFSET)
          node-sz  (r-get-i32 SABVECN_NODE_SIZE_OFFSET)]
      (dispose! (SabVecN. cnt shift root tail tail-len node-sz slab-off)))))

(ser/register-cljs-to-sab-builder!
  vector?
  (fn [v] (sab-vec v)))
)) ;; end #?(:cljs ...)

;;=============================================================================
;; JVM: read-only SabVec via ISlabIO
;;=============================================================================

#?(:clj
   (do
     (defn- jvm-node-get
       "Read the i32 at slot idx within a trie node at slab-offset."
       [sio node-off idx]
       (-sio-read-i32 sio node-off (* idx 4)))

     (defn- jvm-read-value-block
       "Read and deserialize a value block at slab-offset.
        Pass coll-factory to support nested collection values."
       ([sio val-off] (jvm-read-value-block sio val-off nil))
       ([sio val-off coll-factory]
        (when (not= val-off NIL_OFFSET)
          (let [val-len (-sio-read-i32 sio val-off 0)
                val-bs  (-sio-read-bytes sio val-off 4 val-len)]
            (eve-bytes->value val-bs sio coll-factory)))))

     (defn- jvm-tail-offset-calc
       "Index of first element in the tail."
       [cnt node-size shift-step]
       (if (< cnt node-size)
         0
         (bit-shift-left (unsigned-bit-shift-right (dec cnt) shift-step) shift-step)))

     (defn jvm-sabvec-nth
       "Get element at index n from a JVM SabVec."
       ([sio cnt shift root tail n] (jvm-sabvec-nth sio cnt shift root tail n nil))
       ([sio cnt shift root tail n coll-factory]
        (let [toff (jvm-tail-offset-calc cnt NODE_SIZE SHIFT_STEP)]
          (if (>= n toff)
            (jvm-read-value-block sio (jvm-node-get sio tail (- n toff)) coll-factory)
            (let [val-off (loop [node-off root sh shift]
                            (let [idx (bit-and (unsigned-bit-shift-right n sh) MASK)]
                              (if (zero? sh)
                                (jvm-node-get sio node-off idx)
                                (recur (jvm-node-get sio node-off idx) (- sh SHIFT_STEP)))))]
              (jvm-read-value-block sio val-off coll-factory))))))

     (defn jvm-sabvec-reduce
       "Reduce over all elements of a JVM SabVec."
       ([sio cnt shift root tail f init] (jvm-sabvec-reduce sio cnt shift root tail f init nil))
       ([sio cnt shift root tail f init coll-factory]
        (loop [i   0
               acc init]
          (if (or (>= i cnt) (reduced? acc))
            (unreduced acc)
            (let [v   (jvm-sabvec-nth sio cnt shift root tail i coll-factory)
                  acc (f acc v)]
              (recur (inc i) acc))))))

     ;; -----------------------------------------------------------------------
     ;; JVM SabVec write support
     ;; -----------------------------------------------------------------------

     (defn- jvm-vec-alloc-node!
       "Allocate a NODE_SIZE-slot trie node, initializing all slots to NIL_OFFSET."
       [sio]
       (let [node-off (-sio-alloc! sio (* NODE_SIZE 4))]
         (dotimes [i NODE_SIZE]
           (-sio-write-i32! sio node-off (* i 4) NIL_OFFSET))
         node-off))

     (defn- jvm-vec-alloc-value-block!
       "Allocate and write a serialized value block. Returns slab-off."
       [sio ^bytes val-bytes]
       (let [val-len  (alength val-bytes)
             slab-off (-sio-alloc! sio (+ 4 val-len))]
         (-sio-write-i32! sio slab-off 0 val-len)
         (when (pos? val-len)
           (-sio-write-bytes! sio slab-off 4 val-bytes))
         slab-off))

     (defn- jvm-build-trie!
       "Build a SabVec trie from a seq of value-block slab-offs (in element order).
        Returns [root-slab-off shift]."
       [sio trie-val-offs]
       ;; Build leaf nodes: each chunk of NODE_SIZE val-offs → one leaf node
       (let [leaf-nodes
             (mapv (fn [chunk]
                     (let [node-off (jvm-vec-alloc-node! sio)]
                       (dorun (map-indexed
                                (fn [i v-off]
                                  (-sio-write-i32! sio node-off (* i 4) v-off))
                                chunk))
                       node-off))
                   (partition-all NODE_SIZE trie-val-offs))]
         ;; Build internal levels until one root node remains
         (loop [nodes leaf-nodes shift SHIFT_STEP]
           (if (<= (count nodes) NODE_SIZE)
             (let [root-off (jvm-vec-alloc-node! sio)]
               (dorun (map-indexed
                        (fn [i child-off]
                          (-sio-write-i32! sio root-off (* i 4) child-off))
                        nodes))
               [root-off shift])
             (let [parent-nodes
                   (mapv (fn [chunk]
                           (let [node-off (jvm-vec-alloc-node! sio)]
                             (dorun (map-indexed
                                      (fn [i child-off]
                                        (-sio-write-i32! sio node-off (* i 4) child-off))
                                      chunk))
                             node-off))
                         (partition-all NODE_SIZE nodes))]
               (recur parent-nodes (+ shift SHIFT_STEP)))))))

     (defn jvm-write-vec!
       "Serialize a Clojure sequential collection to a SabVec in the slab.
        Returns the slab-qualified offset of the SabVecRoot header block.
        serialize-val: (fn [v] ^bytes) — serializes one element to EVE bytes."
       [sio serialize-val coll]
       (let [elems (vec coll)
             cnt   (count elems)]
         (if (zero? cnt)
           ;; Empty vector
           (let [header-off (-sio-alloc! sio SABVECROOT_HEADER_SIZE)]
             (eve-alloc/-sio-write-u8! sio header-off 0 SabVecRoot-type-id)
             (-sio-write-i32! sio header-off SABVECROOT_CNT_OFFSET      0)
             (-sio-write-i32! sio header-off SABVECROOT_SHIFT_OFFSET    SHIFT_STEP)
             (-sio-write-i32! sio header-off SABVECROOT_ROOT_OFFSET     NIL_OFFSET)
             (-sio-write-i32! sio header-off SABVECROOT_TAIL_OFFSET     NIL_OFFSET)
             (-sio-write-i32! sio header-off SABVECROOT_TAIL_LEN_OFFSET 0)
             header-off)
           ;; Non-empty vector
           (let [val-offs       (mapv (fn [elem]
                                        (jvm-vec-alloc-value-block! sio ^bytes (serialize-val elem)))
                                      elems)
                 toff           (jvm-tail-offset-calc cnt NODE_SIZE SHIFT_STEP)
                 tail-len       (- cnt toff)
                 tail-val-offs  (subvec val-offs toff cnt)
                 trie-val-offs  (subvec val-offs 0 toff)
                 ;; Build tail node (always present)
                 tail-off       (let [t-off (jvm-vec-alloc-node! sio)]
                                  (dorun (map-indexed
                                           (fn [i v-off]
                                             (-sio-write-i32! sio t-off (* i 4) v-off))
                                           tail-val-offs))
                                  t-off)
                 ;; Build trie (only if elements exceed NODE_SIZE)
                 [root shift]   (if (empty? trie-val-offs)
                                  [NIL_OFFSET SHIFT_STEP]
                                  (jvm-build-trie! sio trie-val-offs))
                 header-off     (-sio-alloc! sio SABVECROOT_HEADER_SIZE)]
             (eve-alloc/-sio-write-u8! sio header-off 0 SabVecRoot-type-id)
             (-sio-write-i32! sio header-off SABVECROOT_CNT_OFFSET      cnt)
             (-sio-write-i32! sio header-off SABVECROOT_SHIFT_OFFSET    shift)
             (-sio-write-i32! sio header-off SABVECROOT_ROOT_OFFSET     root)
             (-sio-write-i32! sio header-off SABVECROOT_TAIL_OFFSET     tail-off)
             (-sio-write-i32! sio header-off SABVECROOT_TAIL_LEN_OFFSET tail-len)
             header-off))))

     (declare jvm-sabvec-from-offset)

     (deftype SabVecRoot
       [^long cnt ^long shift ^long root ^long tail ^long tail-len ^long header-off sio coll-factory _meta]

       clojure.lang.IMeta
       (meta [_] _meta)

       clojure.lang.IObj
       (withMeta [_ new-meta]
         (SabVecRoot. cnt shift root tail tail-len header-off sio coll-factory new-meta))

       clojure.lang.Counted
       (count [_] (int cnt))

       clojure.lang.Indexed
       (nth [_ n]
         (when (or (< n 0) (>= n cnt))
           (throw (IndexOutOfBoundsException. (str "SabVec index " n " out of bounds, cnt=" cnt))))
         (jvm-sabvec-nth sio cnt shift root tail n coll-factory))
       (nth [_ n not-found]
         (if (or (< n 0) (>= n cnt))
           not-found
           (jvm-sabvec-nth sio cnt shift root tail n coll-factory)))

       clojure.lang.Sequential

       clojure.lang.Seqable
       (seq [_]
         (when (pos? cnt)
           (let [items (java.util.ArrayList. (int cnt))]
             (dotimes [i cnt]
               (.add items (jvm-sabvec-nth sio cnt shift root tail i coll-factory)))
             (seq items))))

       clojure.lang.Associative
       (assoc [this k v]
         (if (clojure.lang.Util/isInteger k)
           (.assocN this (int k) v)
           (throw (IllegalArgumentException. "Key must be integer"))))

       clojure.lang.IPersistentVector
       (assocN [this i v]
         (assoc (into [] this) i v))
       (cons [this v]
         (conj (into [] this) v))
       (length [_] (int cnt))
       (empty [_]
         (let [hdr-off (jvm-write-vec! sio (partial value+sio->eve-bytes sio) [])]
           (jvm-sabvec-from-offset sio hdr-off)))
       (equiv [this other]
        (cond
          (identical? this other) true
          (instance? clojure.lang.IPersistentVector other)
          (let [ov ^clojure.lang.IPersistentVector other]
            (and (== cnt (.count ov))
                 (loop [i 0]
                   (if (== i cnt) true
                     (if (clojure.lang.Util/equiv (.nth this i) (.nth ov i))
                       (recur (inc i)) false)))))
          (instance? java.util.List other)
          (let [lst ^java.util.List other]
            (and (== cnt (.size lst))
                 (loop [i 0]
                   (if (== i cnt) true
                     (if (clojure.lang.Util/equiv (.nth this i) (.get lst i))
                       (recur (inc i)) false)))))
          :else false))
       (containsKey [_ i] (and (>= i 0) (< i cnt)))
       (entryAt [this i] (when (.containsKey this i) (clojure.lang.MapEntry/create i (.nth this i))))
       (valAt [this i] (.nth this (int i)))
       (valAt [this i not-found] (.nth this (int i) not-found))
       (peek [this] (when (pos? cnt) (.nth this (dec cnt))))
       (pop [this] (pop (into [] this)))

       java.util.RandomAccess
       java.lang.Iterable
       (iterator [this] (clojure.lang.SeqIterator. (.seq this)))

       java.lang.Object
       (toString [this] (str (vec (seq this))))
       (equals [this other]
         (cond
           (identical? this other) true
           (not (instance? clojure.lang.IPersistentVector other)) false
           :else
           (let [ov ^clojure.lang.IPersistentVector other]
             (and (== cnt (.count ov))
                  (loop [i 0]
                    (if (== i cnt) true
                      (if (.equals ^Object (.nth this i) (.nth ov i))
                        (recur (inc i)) false)))))))
       (hashCode [this] (clojure.lang.Murmur3/hashOrdered this)))

     (defn jvm-sabvec-from-offset
       "Construct a JVM SabVecRoot from a slab-qualified header-off and ISlabIO context."
       ([sio header-off] (jvm-sabvec-from-offset sio header-off nil))
       ([sio header-off coll-factory]
        (let [cnt      (-sio-read-i32 sio header-off SABVECROOT_CNT_OFFSET)
              shift    (-sio-read-i32 sio header-off SABVECROOT_SHIFT_OFFSET)
              root     (-sio-read-i32 sio header-off SABVECROOT_ROOT_OFFSET)
              tail     (-sio-read-i32 sio header-off SABVECROOT_TAIL_OFFSET)
              tail-len (-sio-read-i32 sio header-off SABVECROOT_TAIL_LEN_OFFSET)]
          (SabVecRoot. cnt shift root tail tail-len header-off sio coll-factory nil))))

     ;; -----------------------------------------------------------------------
     ;; JVM user-facing constructors (use eve-alloc/*jvm-slab-ctx*)
     ;; -----------------------------------------------------------------------

     (defn empty-sab-vec
       "Create an empty EVE vector in the current JVM slab context.
        Requires eve-alloc/*jvm-slab-ctx* to be bound."
       []
       (let [sio     eve-alloc/*jvm-slab-ctx*
             hdr-off (jvm-write-vec! sio (partial value+sio->eve-bytes sio) [])]
         (jvm-sabvec-from-offset sio hdr-off)))

     (defn sab-vec
       "Create an EVE vector from a collection in the current JVM slab context.
        Requires eve-alloc/*jvm-slab-ctx* to be bound."
       [coll]
       (let [sio     eve-alloc/*jvm-slab-ctx*
             hdr-off (jvm-write-vec! sio (partial value+sio->eve-bytes sio) coll)]
         (jvm-sabvec-from-offset sio hdr-off)))

     ;; Register the JVM vec writer so mem/value+sio->eve-bytes can route to it
     (register-jvm-collection-writer! :vec jvm-write-vec!)))
