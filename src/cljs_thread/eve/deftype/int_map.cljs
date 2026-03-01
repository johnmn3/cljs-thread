(ns cljs-thread.eve.deftype.int-map
  "An adaptation of Okasaki and Gill's \"Fast Mergeable Integer Maps\",
   ported from clojure.data.int-map to eve-deftype SAB-backed storage.

   This is a 16-way branching PATRICIA trie with 32-bit integer keys.
   All nodes live in SharedArrayBuffer memory. The user-facing API
   mirrors standard Clojure maps — assoc, dissoc, get, count, seq, etc.

   The SAB abstraction is completely hidden — users just call (int-map)
   with no arguments, and all operations work transparently."
  (:refer-clojure :exclude [merge merge-with update range])
  (:require-macros [cljs-thread.eve.deftype])
  (:require
   [cljs-thread.eve.deftype]
   [cljs-thread.eve.deftype.runtime :as rt]
   [cljs-thread.eve.shared-atom :as atom]))

;;-----------------------------------------------------------------------------
;; Forward declarations
;;-----------------------------------------------------------------------------

(declare load-node ->int-map EMPTY)

;; Sentinel for contains-key? — must be a singleton, not a keyword,
;; because CLJS compiles keywords as `new Keyword(...)` at each use site
;; and JS `===` checks reference identity on objects.
(def ^:private NOT-FOUND (js-obj))

;;-----------------------------------------------------------------------------
;; IIntMapNode protocol — the core polymorphic interface for trie nodes
;;-----------------------------------------------------------------------------

(defprotocol IIntMapNode
  (-im-count [node] "Return element count")
  (-im-assoc [node k epoch merge-fn v] "Insert or update k→v")
  (-im-dissoc [node k epoch] "Remove k, returns nil if empty")
  (-im-get [node k default-val] "Lookup k, return default-val if absent")
  (-im-update [node k epoch f] "Update value at k with (f old-val)")
  (-im-merge [node other epoch f] "Merge with another node")
  (-im-reduce [node f init] "Reduce over [k v] entries")
  (-im-kvreduce [node f init] "Reduce with (f acc k v)")
  (-im-seq [node] "Return a seq of MapEntry pairs")
  (-im-seq-reverse [node] "Return a reversed seq of MapEntry pairs")
  (-im-range [node min-k max-k] "Return node filtered to [min-k, max-k]"))

;;-----------------------------------------------------------------------------
;; Bitwise helpers (adapted for 32-bit keys)
;;-----------------------------------------------------------------------------

(defn- lowest-bit
  "Isolate the lowest set bit."
  [n]
  (bit-and n (- n)))

(defn- highest-bit
  "Find the highest set bit at or above estimate."
  [n estimate]
  (loop [x (bit-and n (bit-not (dec estimate)))]
    (let [m (lowest-bit x)]
      (if (== x m)
        m
        (recur (- x m))))))

(defn- bit-log2
  "Log base 2 of a power of 2 (32-bit). Uses de Bruijn sequence."
  [n]
  ;; de Bruijn table for 32-bit
  (let [table #js [0 1 28 2 29 14 24 3 30 22 20 15 25 17 4 8
                    31 27 13 23 21 19 16 7 26 12 18 6 11 5 10 9]]
    (aget table (bit-and (unsigned-bit-shift-right
                          (imul (bit-and n (- n)) 0x077CB531)
                          27)
                         0x1f))))

(defn- branching-offset
  "Compute the 4-bit-aligned offset where keys a and b diverge."
  [a b]
  (bit-and (bit-log2 (highest-bit (bit-xor a b) 1)) (bit-not 0x3)))

(defn- invert-fn
  "Return a function that swaps argument order: (f a b) -> (f b a)."
  [f]
  (fn [a b] (f b a)))

(defn default-merge
  "Default merge function — last value wins."
  [_ x] x)

;;-----------------------------------------------------------------------------
;; IntMapLeaf — stores a single key-value pair
;;
;;   Layout: [type-id:1][pad:3][key:4][value-offset:4] = 12 bytes
;;-----------------------------------------------------------------------------

(cljs-thread.eve.deftype/eve-deftype IntMapLeaf
  [^:int32 key value]

  ILookup
  (-lookup [this k]
    (case k :key key :value value nil))
  (-lookup [this k not-found]
    (case k :key key :value value not-found)))

;;-----------------------------------------------------------------------------
;; IntMapBranch — 16-way branching internal node
;;
;;   Layout: [type-id:1][pad:3][prefix:4][bit-offset:4][epoch:4]
;;           [c0:4]...[c15:4] = 84 bytes
;;
;;   Children are stored as raw int32 offsets (-1 = nil).
;;   We use load-node to reconstruct polymorphic child types.
;;-----------------------------------------------------------------------------

(cljs-thread.eve.deftype/eve-deftype IntMapBranch
  [^:int32 prefix
   ^:int32 bit-offset
   ^:int32 epoch
   ^:int32 c0  ^:int32 c1  ^:int32 c2  ^:int32 c3
   ^:int32 c4  ^:int32 c5  ^:int32 c6  ^:int32 c7
   ^:int32 c8  ^:int32 c9  ^:int32 c10 ^:int32 c11
   ^:int32 c12 ^:int32 c13 ^:int32 c14 ^:int32 c15]

  ILookup
  (-lookup [this k]
    (case k
      :prefix prefix :bit-offset bit-offset :epoch epoch
      :c0 c0 :c1 c1 :c2 c2 :c3 c3 :c4 c4 :c5 c5 :c6 c6 :c7 c7
      :c8 c8 :c9 c9 :c10 c10 :c11 c11 :c12 c12 :c13 c13 :c14 c14 :c15 c15
      nil))
  (-lookup [this k not-found]
    (case k
      :prefix prefix :bit-offset bit-offset :epoch epoch
      :c0 c0 :c1 c1 :c2 c2 :c3 c3 :c4 c4 :c5 c5 :c6 c6 :c7 c7
      :c8 c8 :c9 c9 :c10 c10 :c11 c11 :c12 c12 :c13 c13 :c14 c14 :c15 c15
      not-found)))

;;-----------------------------------------------------------------------------
;; IntMapBinaryBranch — top-level split for negative/positive keys
;;
;;   Layout: [type-id:1][pad:3][neg-off:4][pos-off:4] = 12 bytes
;;   neg-off = child for negative keys, pos-off = child for non-negative keys
;;-----------------------------------------------------------------------------

(cljs-thread.eve.deftype/eve-deftype IntMapBinaryBranch
  [^:int32 neg-off ^:int32 pos-off]

  ILookup
  (-lookup [this k]
    (case k :neg-off neg-off :pos-off pos-off nil))
  (-lookup [this k not-found]
    (case k :neg-off neg-off :pos-off pos-off not-found)))

;;-----------------------------------------------------------------------------
;; Environment access — automatically gets env from global atom
;;-----------------------------------------------------------------------------

(defn- get-env
  "Get the SAB environment from the global atom instance.
   This is the key abstraction that hides SAB from users."
  []
  (when-let [global-atom atom/*global-atom-instance*]
    (.-s-atom-env global-atom)))

;;-----------------------------------------------------------------------------
;; Polymorphic node loading — read type-id byte to pick constructor
;;-----------------------------------------------------------------------------

(def ^:private leaf-type-id (volatile! -1))
(def ^:private branch-type-id (volatile! -1))
(def ^:private binary-branch-type-id (volatile! -1))
(def ^:private initialized? (volatile! false))

(defn- ensure-initialized!
  "Lazily initialize type-ids on first use. Called automatically."
  [env]
  (when-not @initialized?
    (let [dv (js/DataView. (:sab env))
          ;; Create sentinel instances to discover type-ids
          leaf (->IntMapLeaf env 0 nil)
          branch (->IntMapBranch env 0 0 0
                                 -1 -1 -1 -1 -1 -1 -1 -1
                                 -1 -1 -1 -1 -1 -1 -1 -1)
          bb (->IntMapBinaryBranch env -1 -1)]
      (vreset! leaf-type-id (.getUint8 dv (.-eve-offset leaf)))
      (vreset! branch-type-id (.getUint8 dv (.-eve-offset branch)))
      (vreset! binary-branch-type-id (.getUint8 dv (.-eve-offset bb)))
      (vreset! initialized? true))))

(defn init-int-map!
  "Initialize int-map type-ids for the given env. This is called automatically
   on first use, but can be called explicitly in worker threads to ensure
   type-ids are discovered before concurrent operations begin."
  [env]
  (ensure-initialized! env))

(defn load-node
  "Given env and a raw int32 offset, reconstruct the appropriate node type.
   Returns nil if offset is -1."
  [env offset]
  (when (not= -1 offset)
    (let [type-id (.getUint8 (js/DataView. (:sab env)) offset)]
      (condp == type-id
        @leaf-type-id          (IntMapLeaf. env offset)
        @branch-type-id        (IntMapBranch. env offset)
        @binary-branch-type-id (IntMapBinaryBranch. env offset)
        (throw (js/Error. (str "Unknown int-map node type-id: " type-id
                               " at offset " offset)))))))

;;-----------------------------------------------------------------------------
;; Branch child access helpers
;;-----------------------------------------------------------------------------

(defn- branch-index-of
  "Compute the child index (0-15) for key k within a branch."
  [branch k]
  (let [boff (:bit-offset branch)
        mask (bit-shift-left 0xf boff)]
    (unsigned-bit-shift-right (bit-and k mask) boff)))

(defn- branch-child
  "Load the child node at index i from a branch. Returns nil if empty."
  [env branch i]
  (load-node env
    (case (int i)
      0  (:c0 branch)  1  (:c1 branch)  2  (:c2 branch)  3  (:c3 branch)
      4  (:c4 branch)  5  (:c5 branch)  6  (:c6 branch)  7  (:c7 branch)
      8  (:c8 branch)  9  (:c9 branch)  10 (:c10 branch) 11 (:c11 branch)
      12 (:c12 branch) 13 (:c13 branch) 14 (:c14 branch) 15 (:c15 branch))))

(defn- branch-child-offset
  "Get the raw offset of child at index i."
  [branch i]
  (case (int i)
    0  (:c0 branch)  1  (:c1 branch)  2  (:c2 branch)  3  (:c3 branch)
    4  (:c4 branch)  5  (:c5 branch)  6  (:c6 branch)  7  (:c7 branch)
    8  (:c8 branch)  9  (:c9 branch)  10 (:c10 branch) 11 (:c11 branch)
    12 (:c12 branch) 13 (:c13 branch) 14 (:c14 branch) 15 (:c15 branch)))

(defn- make-branch-with-children
  "Create a new Branch with 16 child offsets given as a JS array."
  [env prefix bit-offset epoch children]
  (->IntMapBranch env prefix bit-offset epoch
                  (aget children 0)  (aget children 1)
                  (aget children 2)  (aget children 3)
                  (aget children 4)  (aget children 5)
                  (aget children 6)  (aget children 7)
                  (aget children 8)  (aget children 9)
                  (aget children 10) (aget children 11)
                  (aget children 12) (aget children 13)
                  (aget children 14) (aget children 15)))

(defn- copy-children
  "Copy all 16 child offsets from a branch into a new JS Int32Array."
  [branch]
  (let [a (js/Int32Array. 16)]
    (aset a 0  (:c0 branch))  (aset a 1  (:c1 branch))
    (aset a 2  (:c2 branch))  (aset a 3  (:c3 branch))
    (aset a 4  (:c4 branch))  (aset a 5  (:c5 branch))
    (aset a 6  (:c6 branch))  (aset a 7  (:c7 branch))
    (aset a 8  (:c8 branch))  (aset a 9  (:c9 branch))
    (aset a 10 (:c10 branch)) (aset a 11 (:c11 branch))
    (aset a 12 (:c12 branch)) (aset a 13 (:c13 branch))
    (aset a 14 (:c14 branch)) (aset a 15 (:c15 branch))
    a))

(defn- empty-children
  "Create a new JS Int32Array of 16 slots, all -1 (nil)."
  []
  (let [a (js/Int32Array. 16)]
    (dotimes [i 16] (aset a i -1))
    a))

(defn- node-offset
  "Get the SAB offset from a node, or -1 if nil."
  [node]
  (if (nil? node) -1 (.-eve-offset node)))

;;-----------------------------------------------------------------------------
;; IIntMapNode implementations
;;-----------------------------------------------------------------------------

;; --- IntMapLeaf ---

(extend-type IntMapLeaf
  IIntMapNode
  (-im-count [_] 1)

  (-im-get [node k default-val]
    (if (== k (:key node))
      (:value node)
      default-val))

  (-im-assoc [node k epoch merge-fn v]
    (let [node-key (:key node)]
      (cond
        (== k node-key)
        (let [v' (if (nil? merge-fn) v (merge-fn (:value node) v))]
          (->IntMapLeaf (.-eve-env node) k v'))

        ;; Different sign — need BinaryBranch
        (and (neg? node-key) (>= k 0))
        (->IntMapBinaryBranch (.-eve-env node)
                              (.-eve-offset node)
                              (.-eve-offset (->IntMapLeaf (.-eve-env node) k v)))

        (and (neg? k) (>= node-key 0))
        (->IntMapBinaryBranch (.-eve-env node)
                              (.-eve-offset (->IntMapLeaf (.-eve-env node) k v))
                              (.-eve-offset node))

        :else
        (let [env (.-eve-env node)
              boff (branching-offset k node-key)
              children (empty-children)
              branch (make-branch-with-children env k boff epoch children)]
          (-> branch
              (-im-assoc node-key epoch merge-fn (:value node))
              (-im-assoc k epoch merge-fn v))))))

  (-im-dissoc [node k _epoch]
    (if (== k (:key node))
      nil
      node))

  (-im-update [node k epoch f]
    (let [node-key (:key node)]
      (if (== k node-key)
        (->IntMapLeaf (.-eve-env node) k (f (:value node)))
        (-im-assoc node k epoch nil (f nil)))))

  (-im-merge [node other epoch f]
    (-im-assoc other (:key node) epoch (invert-fn f) (:value node)))

  (-im-reduce [node f init]
    (f init (cljs.core/MapEntry. (:key node) (:value node) nil)))

  (-im-kvreduce [node f init]
    (f init (:key node) (:value node)))

  (-im-seq [node]
    (list (cljs.core/MapEntry. (:key node) (:value node) nil)))

  (-im-seq-reverse [node]
    (list (cljs.core/MapEntry. (:key node) (:value node) nil)))

  (-im-range [node min-k max-k]
    (if (and (<= min-k (:key node)) (<= (:key node) max-k))
      node
      nil)))

;; --- IntMapBranch ---

(extend-type IntMapBranch
  IIntMapNode
  (-im-count [branch]
    (loop [i 0 cnt 0]
      (if (== i 16)
        cnt
        (let [child (branch-child (.-eve-env branch) branch i)]
          (recur (inc i) (if child (+ cnt (-im-count child)) cnt))))))

  (-im-get [branch k default-val]
    (let [child (branch-child (.-eve-env branch) branch (branch-index-of branch k))]
      (if (nil? child)
        default-val
        (-im-get child k default-val))))

  (-im-assoc [branch k epoch merge-fn v]
    (let [env (.-eve-env branch)
          prefix (:prefix branch)
          boff (:bit-offset branch)
          offset-prime (branching-offset k prefix)]
      (cond
        ;; Different signs — need BinaryBranch
        (and (neg? prefix) (>= k 0))
        (->IntMapBinaryBranch env
                              (.-eve-offset branch)
                              (.-eve-offset (->IntMapLeaf env k v)))

        (and (neg? k) (>= prefix 0))
        (->IntMapBinaryBranch env
                              (.-eve-offset (->IntMapLeaf env k v))
                              (.-eve-offset branch))

        ;; Need a new branch above this one
        (> offset-prime boff)
        (let [children (empty-children)
              new-branch (make-branch-with-children env k offset-prime epoch children)]
          (-> new-branch
              (-im-merge branch epoch nil)
              (-im-assoc k epoch merge-fn v)))

        ;; At or below our level
        :else
        (let [idx (branch-index-of branch k)
              child (branch-child env branch idx)]
          (if (nil? child)
            ;; Empty slot — insert leaf
            (let [children (copy-children branch)]
              (aset children idx (.-eve-offset (->IntMapLeaf env k v)))
              (make-branch-with-children env prefix boff epoch children))
            ;; Recurse into child
            (let [child-prime (-im-assoc child k epoch merge-fn v)]
              (if (identical? child child-prime)
                branch
                (let [children (copy-children branch)]
                  (aset children idx (node-offset child-prime))
                  (make-branch-with-children env prefix boff epoch children)))))))))

  (-im-dissoc [branch k epoch]
    (let [env (.-eve-env branch)
          idx (branch-index-of branch k)
          child (branch-child env branch idx)]
      (if (nil? child)
        branch
        (let [child-prime (-im-dissoc child k epoch)]
          (if (identical? child child-prime)
            branch
            (let [children (copy-children branch)]
              (aset children idx (node-offset child-prime))
              ;; Check if any children remain
              (loop [i 0 remaining 0 only-child nil]
                (if (== i 16)
                  (cond
                    (zero? remaining) nil
                    (== remaining 1) only-child ;; collapse singleton
                    :else (make-branch-with-children env (:prefix branch)
                                                     (:bit-offset branch)
                                                     epoch children))
                  (let [off (aget children i)]
                    (if (not= off -1)
                      (recur (inc i) (inc remaining) (load-node env off))
                      (recur (inc i) remaining only-child)))))))))))

  (-im-update [branch k epoch f]
    (let [env (.-eve-env branch)
          prefix (:prefix branch)
          boff (:bit-offset branch)
          offset-prime (branching-offset k prefix)]
      (cond
        (and (neg? prefix) (>= k 0))
        (->IntMapBinaryBranch env
                              (.-eve-offset branch)
                              (.-eve-offset (->IntMapLeaf env k (f nil))))

        (and (neg? k) (>= prefix 0))
        (->IntMapBinaryBranch env
                              (.-eve-offset (->IntMapLeaf env k (f nil)))
                              (.-eve-offset branch))

        (> offset-prime boff)
        (let [children (empty-children)
              new-branch (make-branch-with-children env k offset-prime epoch children)]
          (-> new-branch
              (-im-merge branch epoch nil)
              (-im-update k epoch f)))

        :else
        (let [idx (branch-index-of branch k)
              child (branch-child env branch idx)]
          (if (nil? child)
            (let [children (copy-children branch)]
              (aset children idx (.-eve-offset (->IntMapLeaf env k (f nil))))
              (make-branch-with-children env prefix boff epoch children))
            (let [child-prime (-im-update child k epoch f)]
              (if (identical? child child-prime)
                branch
                (let [children (copy-children branch)]
                  (aset children idx (node-offset child-prime))
                  (make-branch-with-children env prefix boff epoch children)))))))))

  (-im-merge [branch other epoch f]
    (let [env (.-eve-env branch)]
      (cond
        (instance? IntMapBranch other)
        (let [other-prefix (:prefix other)
              other-boff (:bit-offset other)
              boff (:bit-offset branch)
              prefix (:prefix branch)
              offset-prime (branching-offset prefix other-prefix)]
          (cond
            ;; Sign mismatch
            (and (neg? other-prefix) (>= prefix 0))
            (->IntMapBinaryBranch env (.-eve-offset other) (.-eve-offset branch))

            (and (neg? prefix) (>= other-prefix 0))
            (->IntMapBinaryBranch env (.-eve-offset branch) (.-eve-offset other))

            ;; Need higher branch
            (and (> offset-prime boff) (> offset-prime other-boff))
            (let [children (empty-children)
                  new-branch (make-branch-with-children env prefix offset-prime epoch children)]
              (-> new-branch
                  (-im-merge branch epoch (or f default-merge))
                  (-im-merge other epoch (or f default-merge))))

            ;; We contain the other
            (> boff other-boff)
            (let [idx (branch-index-of branch other-prefix)
                  children (copy-children branch)
                  child (branch-child env branch idx)]
              (aset children idx
                    (node-offset (if child (-im-merge child other epoch f) other)))
              (make-branch-with-children env prefix boff epoch children))

            ;; Other contains us
            (< boff other-boff)
            (-im-merge other branch epoch (invert-fn (or f default-merge)))

            ;; Same level — merge children pairwise
            :else
            (let [children (js/Int32Array. 16)]
              (dotimes [i 16]
                (let [n (branch-child env branch i)
                      n-prime (branch-child env other i)]
                  (aset children i
                        (cond
                          (nil? n)       (node-offset n-prime)
                          (nil? n-prime) (node-offset n)
                          :else          (node-offset (-im-merge n n-prime epoch f))))))
              (make-branch-with-children env prefix boff epoch children))))

        ;; Other is a Leaf or BinaryBranch — flip and merge
        :else
        (-im-merge other branch epoch (invert-fn (or f default-merge))))))

  (-im-reduce [branch f init]
    (loop [i 0 acc init]
      (if (or (== i 16) (reduced? acc))
        acc
        (let [child (branch-child (.-eve-env branch) branch i)]
          (recur (inc i) (if child (-im-reduce child f acc) acc))))))

  (-im-kvreduce [branch f init]
    (loop [i 0 acc init]
      (if (or (== i 16) (reduced? acc))
        acc
        (let [child (branch-child (.-eve-env branch) branch i)]
          (recur (inc i) (if child (-im-kvreduce child f acc) acc))))))

  (-im-seq [branch]
    (let [env (.-eve-env branch)]
      (mapcat (fn [i]
                (when-let [child (branch-child env branch i)]
                  (-im-seq child)))
              (cljs.core/range 0 16))))

  (-im-seq-reverse [branch]
    (let [env (.-eve-env branch)]
      (mapcat (fn [i]
                (when-let [child (branch-child env branch i)]
                  (-im-seq-reverse child)))
              (cljs.core/range 15 -1 -1))))

  (-im-range [branch min-k max-k]
    (let [env (.-eve-env branch)
          prefix (:prefix branch)
          boff (:bit-offset branch)
          ;; Compute the range of this node's keyspace
          node-mask (if (< boff 28)
                      (dec (bit-shift-left 1 (+ boff 4)))
                      0x7fffffff)
          node-min (bit-and prefix (bit-not node-mask))
          node-max (bit-or prefix node-mask)]
      (cond
        ;; Fully contained
        (and (<= min-k node-min) (<= node-max max-k))
        branch

        ;; No overlap
        (or (> min-k node-max) (< max-k node-min))
        nil

        ;; Partial overlap — filter children
        :else
        (let [children (js/Int32Array. 16)
              min-i (if (<= min-k node-min) -1 (branch-index-of branch (max node-min min-k)))
              max-i (if (>= max-k node-max) 16 (branch-index-of branch (min node-max max-k)))]
          (loop [i 0 num-children 0 only-child-off -1]
            (if (== i 16)
              (cond
                (zero? num-children) nil
                (== num-children 1) (load-node env only-child-off)
                :else (make-branch-with-children env prefix boff (:epoch branch) children))
              (let [child-off (branch-child-offset branch i)]
                (if (== child-off -1)
                  (do (aset children i -1)
                      (recur (inc i) num-children only-child-off))
                  (let [child (if (or (< i min-i) (> i max-i))
                                nil ;; outside range
                                (if (and (< min-i i) (< i max-i))
                                  (load-node env child-off) ;; fully inside
                                  (-im-range (load-node env child-off) min-k max-k)))
                        c-off (node-offset child)]
                    (aset children i c-off)
                    (if (not= c-off -1)
                      (recur (inc i) (inc num-children) c-off)
                      (recur (inc i) num-children only-child-off))))))))))))

;; --- IntMapBinaryBranch ---

(extend-type IntMapBinaryBranch
  IIntMapNode
  (-im-count [bb]
    (let [env (.-eve-env bb)
          a (load-node env (:neg-off bb))
          b (load-node env (:pos-off bb))]
      (+ (if a (-im-count a) 0)
         (if b (-im-count b) 0))))

  (-im-get [bb k default-val]
    (let [env (.-eve-env bb)
          child (load-node env (if (neg? k) (:neg-off bb) (:pos-off bb)))]
      (if child (-im-get child k default-val) default-val)))

  (-im-assoc [bb k epoch merge-fn v]
    (let [env (.-eve-env bb)]
      (if (neg? k)
        (let [a (load-node env (:neg-off bb))
              a-prime (if a (-im-assoc a k epoch merge-fn v) (->IntMapLeaf env k v))]
          (if (and a (identical? a a-prime))
            bb
            (->IntMapBinaryBranch env (node-offset a-prime) (:pos-off bb))))
        (let [b (load-node env (:pos-off bb))
              b-prime (if b (-im-assoc b k epoch merge-fn v) (->IntMapLeaf env k v))]
          (if (and b (identical? b b-prime))
            bb
            (->IntMapBinaryBranch env (:neg-off bb) (node-offset b-prime)))))))

  (-im-dissoc [bb k epoch]
    (let [env (.-eve-env bb)]
      (if (neg? k)
        (let [a (load-node env (:neg-off bb))
              a-prime (when a (-im-dissoc a k epoch))]
          (cond
            (nil? a-prime) (load-node env (:pos-off bb))
            (identical? a a-prime) bb
            :else (->IntMapBinaryBranch env (node-offset a-prime) (:pos-off bb))))
        (let [b (load-node env (:pos-off bb))
              b-prime (when b (-im-dissoc b k epoch))]
          (cond
            (nil? b-prime) (load-node env (:neg-off bb))
            (identical? b b-prime) bb
            :else (->IntMapBinaryBranch env (:neg-off bb) (node-offset b-prime)))))))

  (-im-update [bb k epoch f]
    (let [env (.-eve-env bb)]
      (if (neg? k)
        (let [a (load-node env (:neg-off bb))
              a-prime (if a (-im-update a k epoch f) (->IntMapLeaf env k (f nil)))]
          (if (and a (identical? a a-prime))
            bb
            (->IntMapBinaryBranch env (node-offset a-prime) (:pos-off bb))))
        (let [b (load-node env (:pos-off bb))
              b-prime (if b (-im-update b k epoch f) (->IntMapLeaf env k (f nil)))]
          (if (and b (identical? b b-prime))
            bb
            (->IntMapBinaryBranch env (:neg-off bb) (node-offset b-prime)))))))

  (-im-merge [bb other epoch f]
    (let [env (.-eve-env bb)]
      (cond
        (instance? IntMapBinaryBranch other)
        (let [a (load-node env (:neg-off bb))
              a2 (load-node env (:neg-off other))
              b (load-node env (:pos-off bb))
              b2 (load-node env (:pos-off other))]
          (->IntMapBinaryBranch env
            (node-offset (cond
                           (nil? a) a2
                           (nil? a2) a
                           :else (-im-merge a a2 epoch f)))
            (node-offset (cond
                           (nil? b) b2
                           (nil? b2) b
                           :else (-im-merge b b2 epoch f)))))

        (instance? IntMapBranch other)
        (let [other-prefix (:prefix other)]
          (if (neg? other-prefix)
            (let [a (load-node env (:neg-off bb))
                  a-prime (if a (-im-merge a other epoch f) other)]
              (->IntMapBinaryBranch env (node-offset a-prime) (:pos-off bb)))
            (let [b (load-node env (:pos-off bb))
                  b-prime (if b (-im-merge b other epoch f) other)]
              (->IntMapBinaryBranch env (:neg-off bb) (node-offset b-prime)))))

        ;; Leaf — delegate
        :else
        (-im-merge other bb epoch (invert-fn (or f default-merge))))))

  (-im-reduce [bb f init]
    (let [env (.-eve-env bb)
          a (load-node env (:neg-off bb))
          acc (if a (-im-reduce a f init) init)]
      (if (reduced? acc)
        acc
        (let [b (load-node env (:pos-off bb))]
          (if b (-im-reduce b f acc) acc)))))

  (-im-kvreduce [bb f init]
    (let [env (.-eve-env bb)
          a (load-node env (:neg-off bb))
          acc (if a (-im-kvreduce a f init) init)]
      (if (reduced? acc)
        acc
        (let [b (load-node env (:pos-off bb))]
          (if b (-im-kvreduce b f acc) acc)))))

  (-im-seq [bb]
    (let [env (.-eve-env bb)
          a (load-node env (:neg-off bb))
          b (load-node env (:pos-off bb))]
      (concat (when a (-im-seq a))
              (when b (-im-seq b)))))

  (-im-seq-reverse [bb]
    (let [env (.-eve-env bb)
          a (load-node env (:neg-off bb))
          b (load-node env (:pos-off bb))]
      (concat (when b (-im-seq-reverse b))
              (when a (-im-seq-reverse a)))))

  (-im-range [bb min-k max-k]
    (let [env (.-eve-env bb)]
      (if (> max-k 0) ;; was: max < 0 for negative-only
        (if (>= min-k 0)
          ;; Positive only
          (let [b (load-node env (:pos-off bb))]
            (when b (-im-range b min-k max-k)))
          ;; Spans both
          (let [a (load-node env (:neg-off bb))
                b (load-node env (:pos-off bb))
                a-prime (when a (-im-range a min-k max-k))
                b-prime (when b (-im-range b min-k max-k))]
            (cond
              (and (nil? a-prime) (nil? b-prime)) nil
              (nil? a-prime) b-prime
              (nil? b-prime) a-prime
              :else (->IntMapBinaryBranch env
                                          (node-offset a-prime)
                                          (node-offset b-prime)))))
        ;; Negative only
        (let [a (load-node env (:neg-off bb))]
          (when a (-im-range a min-k max-k)))))))

;;-----------------------------------------------------------------------------
;; PersistentIntMap — user-facing wrapper implementing CLJS collection protocols
;;-----------------------------------------------------------------------------

(deftype PersistentIntMap [env root-offset ^:mutable epoch mta]
  IWithMeta
  (-with-meta [_ m] (PersistentIntMap. env root-offset epoch m))

  IMeta
  (-meta [_] mta)

  ICounted
  (-count [_]
    (let [root (load-node env root-offset)]
      (if root (-im-count root) 0)))

  IEmptyableCollection
  (-empty [_] (PersistentIntMap. env -1 0 nil))

  ICollection
  (-conj [this o]
    (if (map? o)
      (reduce #(apply assoc %1 %2) this o)
      (-assoc this (nth o 0) (nth o 1))))

  IEquiv
  (-equiv [this other]
    (cond
      (not (or (map? other) (satisfies? IAssociative other)))
      false

      (not= (-count this) (count other))
      false

      :else
      (every? (fn [[k v]]
                (= v (get other k ::not-found)))
              (seq this))))

  IHash
  (-hash [this]
    (reduce (fn [acc [k v]]
              (+ acc (bit-xor (hash k) (hash v))))
            0
            (seq this)))

  ISeqable
  (-seq [_]
    (let [root (load-node env root-offset)]
      (when root (seq (-im-seq root)))))

  IReversible
  (-rseq [_]
    (let [root (load-node env root-offset)]
      (when root (seq (-im-seq-reverse root)))))

  ILookup
  (-lookup [this k]
    (-lookup this k nil))
  (-lookup [_ k not-found]
    (let [root (load-node env root-offset)]
      (if root (-im-get root (int k) not-found) not-found)))

  IAssociative
  (-contains-key? [this k]
    (not (identical? NOT-FOUND (-lookup this k NOT-FOUND))))

  (-assoc [this k v]
    (let [k (int k)
          epoch' (inc epoch)
          root (load-node env root-offset)
          root' (if root
                  (-im-assoc root k epoch' default-merge v)
                  (->IntMapLeaf env k v))]
      (PersistentIntMap. env (node-offset root') epoch' mta)))

  IMap
  (-dissoc [this k]
    (let [k (int k)
          epoch' (inc epoch)
          root (load-node env root-offset)
          root' (when root (-im-dissoc root k epoch'))]
      (PersistentIntMap. env (node-offset root') epoch' mta)))

  IFn
  (-invoke [this k]
    (-lookup this k))
  (-invoke [this k not-found]
    (-lookup this k not-found))

  IKVReduce
  (-kv-reduce [_ f init]
    (let [root (load-node env root-offset)
          result (if root (-im-kvreduce root f init) init)]
      (if (reduced? result) @result result)))

  IReduce
  (-reduce [this f]
    (let [root (load-node env root-offset)]
      (if root
        (let [result (-im-reduce root f (f))]
          (if (reduced? result) @result result))
        (f))))
  (-reduce [this f init]
    (let [root (load-node env root-offset)
          result (if root (-im-reduce root f init) init)]
      (if (reduced? result) @result result)))

  IPrintWithWriter
  (-pr-writer [this writer opts]
    (-write writer "#eve/IntMap{")
    (-write writer (pr-str (into {} (seq this))))
    (-write writer "}")))

;;-----------------------------------------------------------------------------
;; Public API
;;-----------------------------------------------------------------------------

(defn int-map
  "Create an integer map. Call with no arguments or with alternating keys/values.
   The SAB environment is obtained automatically from the global atom instance."
  ([]
   (let [env (get-env)]
     (when-not env
       (throw (js/Error. "int-map: No global atom instance. Call eve.atom/init! first.")))
     (ensure-initialized! env)
     (PersistentIntMap. env -1 0 nil)))
  ([k v]
   (assoc (int-map) k v))
  ([k v & kvs]
   (apply assoc (int-map) k v kvs)))

(defn merge-with
  "Merge two int-maps using f to resolve value conflicts."
  ([f a b]
   (let [root-a (load-node (.-env a) (.-root-offset a))
         root-b (load-node (.-env b) (.-root-offset b))
         epoch' (inc (max (.-epoch a) (.-epoch b)))]
     (cond
       (nil? root-a) b
       (nil? root-b) a
       :else
       (let [merged (-im-merge root-a root-b epoch' f)]
         (PersistentIntMap. (.-env a) (node-offset merged) epoch' nil)))))
  ([f a b & rest]
   (reduce #(merge-with f %1 %2) (list* a b rest))))

(defn merge
  "Merge two int-maps. Last value wins on conflict."
  ([a b] (merge-with default-merge a b))
  ([a b & rest] (apply merge-with default-merge a b rest)))

(defn update
  "Update the value at key k by applying f."
  ([m k f]
   (let [env (.-env m)
         epoch' (inc (.-epoch m))
         root (load-node env (.-root-offset m))
         root' (if root
                 (-im-update root (int k) epoch' f)
                 (->IntMapLeaf env (int k) (f nil)))]
     (PersistentIntMap. env (node-offset root') epoch' (.-mta m))))
  ([m k f & args]
   (update m k #(apply f % args))))

(defn range
  "Return an int-map with only entries in [min-k, max-k] inclusive."
  [m min-k max-k]
  (let [env (.-env m)
        root (load-node env (.-root-offset m))
        root' (when root (-im-range root (int min-k) (int max-k)))]
    (PersistentIntMap. env (node-offset root') (.-epoch m) (.-mta m))))
