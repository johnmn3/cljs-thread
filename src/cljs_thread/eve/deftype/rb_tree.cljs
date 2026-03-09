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

;;-----------------------------------------------------------------------------
;; Deletion — Germane & Might's persistent red-black tree deletion.
;;
;; Uses "double-black" as a phantom color (never stored in SAB) to represent
;; a subtree whose black-height has decreased by one during path-copying.
;; Phantom double-black-null is represented by the keyword :BB-nil.
;;
;; All phantom nodes are eliminated before returning to the caller — the
;; result is always a valid RB tree with no phantom colors.
;;-----------------------------------------------------------------------------

;; Phantom colors (only exist transiently during deletion; never stored in SAB).
(def ^:private DB  2)   ; double-black (black-height deficit)
(def ^:private NB -1)   ; negative-black (used to absorb a double-black)

(defn- phantom-color? [c] (or (== c DB) (== c NB)))

(defn- is-bb?
  "True if node is a double-black node or double-black-nil sentinel."
  [node]
  (or (= node :BB-nil)
      (and (some? node) (== DB (:color node)))))

(defn- blacken-node
  "Increment the color of a node (R→B, B→BB) or :BB-nil → :BB-nil."
  [env node]
  (cond
    (nil? node)       :BB-nil
    (= node :BB-nil)  :BB-nil
    :else (->RBNode env (inc (:color node))
                    (:left node) (:right node) (:value node))))

(defn- redden-node
  "Decrement the color of a node (B→R, R→NB, BB→B) or :BB-nil → nil."
  [env node]
  (cond
    (= node :BB-nil) nil
    (nil? node)      nil
    :else (->RBNode env (dec (:color node))
                    (:left node) (:right node) (:value node))))

(declare del-balance)

(defn- rotate-left
  "Left rotation: used when right child absorbs a double-black from left sibling."
  [env color left val right]
  ;; right is RED, left is BB — standard left rotation then fix
  (let [rl (:left right)
        rr (:right right)
        rv (:value right)]
    (->RBNode env (:color right)
              (del-balance env color left val rl)
              rv
              rr)))

(defn- rotate-right
  "Right rotation: used when left child absorbs a double-black from right sibling."
  [env color left val right]
  (let [ll (:left left)
        lr (:right left)
        lv (:value left)]
    (->RBNode env (:color left)
              ll
              lv
              (del-balance env color lr val right))))

(defn- del-balance
  "Extended balance function for deletion.
   Handles original 4 insertion cases plus 6 cases where one child is
   double-black, eliminating the BB by redistribution or propagation."
  [env color left val right]
  (let [lc (when (and (some? left) (not= left :BB-nil))  (:color left))
        rc (when (and (some? right) (not= right :BB-nil)) (:color right))]
    (cond
      ;; ===== Original 4 insertion cases (BLACK parent) =====
      (and (== color BLACK)
           (some? left) (== RED lc)
           (some? (:left left)) (== RED (:color (:left left))))
      (let [ll (:left left)]
        (->RBNode env RED
                  (->RBNode env BLACK (:left ll) (:right ll) (:value ll))
                  (:value left)
                  (->RBNode env BLACK (:right left) right val)))

      (and (== color BLACK)
           (some? left) (== RED lc)
           (some? (:right left)) (== RED (:color (:right left))))
      (let [lr (:right left)]
        (->RBNode env RED
                  (->RBNode env BLACK (:left left) (:left lr) (:value left))
                  (:value lr)
                  (->RBNode env BLACK (:right lr) right val)))

      (and (== color BLACK)
           (some? right) (== RED rc)
           (some? (:left right)) (== RED (:color (:left right))))
      (let [rl (:left right)]
        (->RBNode env RED
                  (->RBNode env BLACK left (:left rl) val)
                  (:value rl)
                  (->RBNode env BLACK (:right rl) (:right right) (:value right))))

      (and (== color BLACK)
           (some? right) (== RED rc)
           (some? (:right right)) (== RED (:color (:right right))))
      (let [rr (:right right)]
        (->RBNode env RED
                  (->RBNode env BLACK left (:left right) val)
                  (:value right)
                  (->RBNode env BLACK (:left rr) (:right rr) (:value rr))))

      ;; ===== Deletion cases: left child is double-black =====

      ;; Case D1: BB-left, BLACK parent, RED right sibling
      ;; Rotate left to bring right's black child as new right sibling
      (and (is-bb? left) (some? right) (== RED rc))
      (let [rl (:left right)  rr (:right right)  rv (:value right)]
        (->RBNode env BLACK
                  (del-balance env color left val rl)
                  rv
                  rr))

      ;; Case D2: BB-left, BLACK parent, BLACK right sibling with RED right nephew
      (and (is-bb? left)
           (some? right) (== BLACK rc)
           (some? (:right right)) (== RED (:color (:right right))))
      (->RBNode env color
                (->RBNode env BLACK (redden-node env left) val (:left right))
                (:value right)
                (->RBNode env BLACK (:left (:right right)) (:right (:right right)) (:value (:right right))))

      ;; Case D3: BB-left, BLACK parent, BLACK right sibling with RED left nephew only
      (and (is-bb? left)
           (some? right) (== BLACK rc)
           (some? (:left right)) (== RED (:color (:left right)))
           (or (nil? (:right right)) (not= RED (:color (:right right)))))
      (let [rl (:left right)]
        (->RBNode env color
                  (->RBNode env BLACK (redden-node env left) val (:left rl))
                  (:value rl)
                  (->RBNode env BLACK (:right rl) (:right right) (:value right))))

      ;; Case D4: BB-left, any parent, BLACK right sibling with no red nephews
      ;; Push blackness up: right becomes RED, parent absorbs one black
      (and (is-bb? left)
           (some? right) (== BLACK rc)
           (or (nil? (:left right))  (not= RED (:color (:left right))))
           (or (nil? (:right right)) (not= RED (:color (:right right)))))
      (->RBNode env (inc color)
                (redden-node env left)
                val
                (->RBNode env RED (:left right) (:right right) (:value right)))

      ;; ===== Deletion cases: right child is double-black =====

      ;; Case D5: BB-right, BLACK parent, RED left sibling
      (and (is-bb? right) (some? left) (== RED lc))
      (let [ll (:left left)  lr (:right left)  lv (:value left)]
        (->RBNode env BLACK
                  ll
                  lv
                  (del-balance env color lr val right)))

      ;; Case D6: BB-right, BLACK parent, BLACK left sibling with RED left nephew
      (and (is-bb? right)
           (some? left) (== BLACK lc)
           (some? (:left left)) (== RED (:color (:left left))))
      (->RBNode env color
                (->RBNode env BLACK (:left (:left left)) (:right (:left left)) (:value (:left left)))
                (:value left)
                (->RBNode env BLACK (:right left) val (redden-node env right)))

      ;; Case D7: BB-right, BLACK parent, BLACK left sibling with RED right nephew only
      (and (is-bb? right)
           (some? left) (== BLACK lc)
           (some? (:right left)) (== RED (:color (:right left)))
           (or (nil? (:left left)) (not= RED (:color (:left left)))))
      (let [lr (:right left)]
        (->RBNode env color
                  (->RBNode env BLACK (:left left) (:left lr) (:value left))
                  (:value lr)
                  (->RBNode env BLACK (:right lr) val (redden-node env right))))

      ;; Case D8: BB-right, any parent, BLACK left sibling with no red nephews
      (and (is-bb? right)
           (some? left) (== BLACK lc)
           (or (nil? (:left left))  (not= RED (:color (:left left))))
           (or (nil? (:right left)) (not= RED (:color (:right left)))))
      (->RBNode env (inc color)
                (->RBNode env RED (:left left) (:right left) (:value left))
                val
                (redden-node env right))

      ;; No rebalancing needed — construct node as-is
      :else
      (if (= left :BB-nil)
        (->RBNode env color nil val right)
        (if (= right :BB-nil)
          (->RBNode env color left val nil)
          (->RBNode env color left val right))))))

(defn- rb-min-val
  "Return the minimum value in subtree rooted at tree."
  [tree]
  (if (nil? (:left tree))
    (:value tree)
    (recur (:left tree))))

(defn- del-leftmost
  "Remove the leftmost (minimum) node from tree.
   Returns [min-value new-tree] where new-tree may contain a double-black node."
  [env tree]
  (let [l (:left tree)
        v (:value tree)
        r (:right tree)
        c (:color tree)]
    (if (nil? l)
      ;; This is the leftmost node
      (cond
        ;; Red leaf — just remove
        (== RED c)  [v nil]
        ;; Black leaf — remove and mark double-black-nil
        (and (== BLACK c) (nil? r))  [v :BB-nil]
        ;; Black node with a red right child — replace with blackened child
        (and (== BLACK c) (some? r) (== RED (:color r)))
        [v (->RBNode env BLACK (:left r) (:right r) (:value r))]
        ;; Shouldn't happen in a valid RB tree, but be safe
        :else [v r])
      ;; Recurse left
      (let [[min-v new-l] (del-leftmost env l)]
        [min-v (del-balance env c new-l v r)]))))

(defn- del
  "Internal delete helper. Returns a tree that may contain a phantom
   double-black node if a black node was removed."
  [env tree x]
  (if (nil? tree)
    nil
    (let [l  (:left tree)
          v  (:value tree)
          r  (:right tree)
          c  (:color tree)
          cmp (compare x v)]
      (cond
        ;; x < v — delete from left subtree
        (neg? cmp)
        (del-balance env c (del env l x) v r)

        ;; x > v — delete from right subtree
        (pos? cmp)
        (del-balance env c l v (del env r x))

        ;; x == v — remove this node
        :else
        (cond
          ;; Red leaf — just remove
          (and (== RED c) (nil? l) (nil? r))  nil

          ;; Red node with only right child (left nil) — replace with right
          (and (== RED c) (nil? l))
          (->RBNode env BLACK (:left r) (:right r) (:value r))

          ;; Red node with only left child (right nil) — replace with left
          (and (== RED c) (nil? r))
          (->RBNode env BLACK (:left l) (:right l) (:value l))

          ;; Black leaf — produce double-black-nil
          (and (== BLACK c) (nil? l) (nil? r))  :BB-nil

          ;; Black node, one red child on right
          (and (== BLACK c) (nil? l) (some? r) (== RED (:color r)))
          (->RBNode env BLACK (:left r) (:right r) (:value r))

          ;; Black node, one red child on left
          (and (== BLACK c) (some? l) (nil? r) (== RED (:color l)))
          (->RBNode env BLACK (:left l) (:right l) (:value l))

          ;; Both children present — replace with in-order successor
          (and (some? l) (some? r))
          (let [[succ-val new-r] (del-leftmost env r)]
            (del-balance env c l succ-val new-r))

          :else nil)))))

(defn rb-delete
  "Remove value x from red-black tree rooted at `tree`.
   Returns a new tree with x removed (or the same tree if x not present).

   Uses Germane & Might's persistent deletion algorithm: O(log n) path-copying
   with 'double-black' phantom nodes to maintain red-black invariants."
  [env tree x]
  (let [result (del env tree x)]
    (cond
      ;; Double-black-nil at root: tree is now empty
      (= result :BB-nil) nil
      ;; Normal node: ensure root is black
      (nil? result) nil
      ;; Blacken root (eliminates any phantom double-black at root)
      (== DB (:color result))
      (->RBNode env BLACK (:left result) (:right result) (:value result))
      ;; Red root (from NB absorption) — blacken it
      (== RED (:color result))
      (->RBNode env BLACK (:left result) (:right result) (:value result))
      :else result)))

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
  (-disjoin [_ v]
    (SortedSet. env (rb-delete env root v) mta))

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
