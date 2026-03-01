(ns cljs-thread.eve.deftype.rb-tree
  "Okasaki-style persistent red-black tree backed by SharedArrayBuffer.
   Each RBNode lives in SAB memory — color is a primitive int32,
   left/right are eve-type self-references, value is serialized.
   All fields are immutable; insert produces new nodes (path-copying).

   User-facing API:
     (sorted-set)               ;; empty sorted set
     (sorted-set 3 1 4 1 5)    ;; from values (deduped, sorted)
     (conj my-set 42)           ;; insert
     (contains? my-set 42)      ;; membership
     (seq my-set)               ;; sorted traversal
     (count my-set)             ;; element count

   The SAB environment is obtained automatically from the global atom
   instance — users never need to pass env explicitly."
  (:require-macros [cljs-thread.eve.deftype])
  (:require
   [cljs-thread.eve.deftype]
   [cljs-thread.eve.deftype.runtime :as rt]
   [cljs-thread.eve.shared-atom :as atom]))

;;-----------------------------------------------------------------------------
;; Constants
;;-----------------------------------------------------------------------------

(def BLACK 0)
(def RED 1)

;;-----------------------------------------------------------------------------
;; RBNode — a single node in the red-black tree
;;
;;   Fields:
;;     color : int32 (0=BLACK, 1=RED)
;;     left  : RBNode (eve-type self-ref, nil when absent)
;;     right : RBNode (eve-type self-ref, nil when absent)
;;     value : any (serialized)
;;
;;   Layout in SAB:
;;     [type-id:1][pad:3][color:4][left-offset:4][right-offset:4][value-offset:4]
;;     total = 20 bytes
;;-----------------------------------------------------------------------------

(cljs-thread.eve.deftype/eve-deftype RBNode
  [^:int32 color ^:RBNode left ^:RBNode right value]

  ILookup
  (-lookup [this k]
    (case k :color color :left left :right right :value value nil))
  (-lookup [this k not-found]
    (case k :color color :left left :right right :value value not-found)))

;;-----------------------------------------------------------------------------
;; Core operations (no pattern matching — just cond chains)
;;-----------------------------------------------------------------------------

(defn- balance
  "Okasaki balance: given components of a node, check for the 4 red-red
   violation cases and restructure if needed. Always returns a new node."
  [env color left val right]
  (if (== color BLACK)
    (cond
      ;; Case 1: B(R(R(a,x,b),y,c),z,d)
      (and (some? left) (== RED (:color left))
           (some? (:left left)) (== RED (:color (:left left))))
      (let [ll (:left left)]
        (->RBNode env RED
                  (->RBNode env BLACK (:left ll) (:right ll) (:value ll))
                  (->RBNode env BLACK (:right left) right val)
                  (:value left)))

      ;; Case 2: B(R(a,x,R(b,y,c)),z,d)
      (and (some? left) (== RED (:color left))
           (some? (:right left)) (== RED (:color (:right left))))
      (let [lr (:right left)]
        (->RBNode env RED
                  (->RBNode env BLACK (:left left) (:left lr) (:value left))
                  (->RBNode env BLACK (:right lr) right val)
                  (:value lr)))

      ;; Case 3: B(a,x,R(R(b,y,c),z,d))
      (and (some? right) (== RED (:color right))
           (some? (:left right)) (== RED (:color (:left right))))
      (let [rl (:left right)]
        (->RBNode env RED
                  (->RBNode env BLACK left (:left rl) val)
                  (->RBNode env BLACK (:right rl) (:right right) (:value right))
                  (:value rl)))

      ;; Case 4: B(a,x,R(b,y,R(c,z,d)))
      (and (some? right) (== RED (:color right))
           (some? (:right right)) (== RED (:color (:right right))))
      (let [rr (:right right)]
        (->RBNode env RED
                  (->RBNode env BLACK left (:left right) val)
                  (->RBNode env BLACK (:left rr) (:right rr) (:value rr))
                  (:value right)))

      ;; No violation — pass through
      :else
      (->RBNode env color left right val))

    ;; Red node — no balancing
    (->RBNode env color left right val)))

(defn- ins
  "Insert helper. Recurses down the tree, creating new nodes on the path.
   Uses `compare` for ordering so any Comparable value works."
  [env tree x]
  (if (nil? tree)
    ;; New leaf is always red
    (->RBNode env RED nil nil x)
    (let [c (:color tree)
          l (:left tree)
          v (:value tree)
          r (:right tree)
          cmp (compare x v)]
      (cond
        (neg? cmp) (balance env c (ins env l x) v r)
        (pos? cmp) (balance env c l v (ins env r x))
        ;; Already present — return as-is
        :else tree))))

(defn rb-insert
  "Insert value x into red-black tree rooted at `tree`.
   Returns a new root node (always black). `tree` may be nil (empty)."
  [env tree x]
  (let [node (ins env tree x)]
    ;; Blacken the root (Okasaki invariant)
    (if (== BLACK (:color node))
      node
      (->RBNode env BLACK (:left node) (:right node) (:value node)))))

(defn rb-member?
  "Returns true if value x is in the tree."
  [tree x]
  (if (nil? tree)
    false
    (let [cmp (compare x (:value tree))]
      (cond
        (neg? cmp) (recur (:left tree) x)
        (pos? cmp) (recur (:right tree) x)
        :else true))))

(defn rb-find
  "Returns the stored value equal to x, or nil if not found."
  [tree x]
  (if (nil? tree)
    nil
    (let [cmp (compare x (:value tree))]
      (cond
        (neg? cmp) (recur (:left tree) x)
        (pos? cmp) (recur (:right tree) x)
        :else (:value tree)))))

(defn rb-seq
  "Returns a lazy in-order sequence of all values in the tree."
  [tree]
  (when (some? tree)
    (lazy-cat (rb-seq (:left tree))
              [(:value tree)]
              (rb-seq (:right tree)))))

(defn rb-count
  "Returns the number of elements in the tree."
  [tree]
  (if (nil? tree)
    0
    (+ 1 (rb-count (:left tree)) (rb-count (:right tree)))))

(defn rb-height
  "Returns the height of the tree (longest path from root to leaf)."
  [tree]
  (if (nil? tree)
    0
    (inc (max (rb-height (:left tree))
              (rb-height (:right tree))))))

(defn rb-black-height
  "Returns the black-height (number of black nodes on any path to a leaf).
   Returns -1 if the tree violates the black-height invariant."
  [tree]
  (if (nil? tree)
    1 ;; nil counts as black
    (let [lh (rb-black-height (:left tree))
          rh (rb-black-height (:right tree))]
      (if (or (== -1 lh) (== -1 rh) (not= lh rh))
        -1
        (+ lh (if (== BLACK (:color tree)) 1 0))))))

(defn rb-valid?
  "Checks all red-black tree invariants:
   1. Root is black
   2. Red nodes have only black children
   3. Every path has equal black-height
   Returns true if all invariants hold."
  [tree]
  (if (nil? tree)
    true
    (let [;; Invariant 1: root is black
          root-black? (== BLACK (:color tree))
          ;; Invariant 3: uniform black-height
          bh (rb-black-height tree)]
      (and root-black?
           (not= -1 bh)
           ;; Invariant 2: no red-red violations (checked recursively)
           (letfn [(no-red-red? [node]
                     (if (nil? node)
                       true
                       (let [c (:color node)
                             l (:left node)
                             r (:right node)]
                         (if (== RED c)
                           (and (or (nil? l) (== BLACK (:color l)))
                                (or (nil? r) (== BLACK (:color r)))
                                (no-red-red? l)
                                (no-red-red? r))
                           (and (no-red-red? l)
                                (no-red-red? r))))))]
             (no-red-red? tree))))))

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
;; SortedSet — user-facing wrapper implementing CLJS collection protocols
;;-----------------------------------------------------------------------------

(deftype SortedSet [env root mta]
  IWithMeta
  (-with-meta [_ m] (SortedSet. env root m))

  IMeta
  (-meta [_] mta)

  ICounted
  (-count [_] (rb-count root))

  IEmptyableCollection
  (-empty [_] (SortedSet. env nil nil))

  ICollection
  (-conj [_ v]
    (SortedSet. env (rb-insert env root v) mta))

  ISeqable
  (-seq [_] (rb-seq root))

  ILookup
  (-lookup [_ v]
    (rb-find root v))
  (-lookup [_ v not-found]
    (let [result (rb-find root v)]
      (if (some? result) result not-found)))

  IFn
  (-invoke [_ v]
    (rb-find root v))
  (-invoke [_ v not-found]
    (let [result (rb-find root v)]
      (if (some? result) result not-found)))

  ISet
  (-disjoin [_ _v]
    (throw (js/Error. "disj not yet implemented for eve SortedSet")))

  IEquiv
  (-equiv [this other]
    (and (satisfies? ISeqable other)
         (= (count this) (count other))
         (every? #(rb-member? root %) (seq other))))

  IHash
  (-hash [_]
    (reduce (fn [acc v] (+ acc (hash v))) 0 (rb-seq root)))

  IPrintWithWriter
  (-pr-writer [this writer _opts]
    (-write writer "#eve/SortedSet#{")
    (let [s (rb-seq root)]
      (loop [xs s first? true]
        (when (seq xs)
          (when-not first? (-write writer " "))
          (-write writer (pr-str (first xs)))
          (recur (rest xs) false))))
    (-write writer "}")))

;;-----------------------------------------------------------------------------
;; Public API
;;-----------------------------------------------------------------------------

(defn sorted-set
  "Create an EVE sorted set backed by a red-black tree in SharedArrayBuffer.
   The SAB environment is obtained automatically from the global atom instance."
  ([]
   (let [env (get-env)]
     (when-not env
       (throw (js/Error. "sorted-set: No global atom instance. Call t/atom or eve/atom-domain first.")))
     (SortedSet. env nil nil)))
  ([& vals]
   (reduce conj (sorted-set) vals)))

(defn member?
  "Returns true if value v is in the sorted set."
  [s v]
  (rb-member? (.-root s) v))
