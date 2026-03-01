# Specialized EVE Collections

## How EVE Data Works

When you put a regular Clojure value into a shared atom, EVE serializes it into `SharedArrayBuffer`-backed persistent data structures automatically. When you deref a shared atom, the EVE data is deserialized back to heap memory. You don't need to construct EVE types directly — just use normal Clojure code:

```clojure
(defonce state (t/atom {:users {} :items []}))

;; All standard Clojure operations — EVE handles the storage transparently
(swap! state assoc-in [:users 42] {:name "Alice"})
(swap! state update :items conj "new item")

@state  ;=> {:users {42 {:name "Alice"}} :items ["new item"]}
```

Under the hood, `{:users {} :items []}` is stored as an EVE hash-map containing an EVE hash-map and an EVE vector, all in shared memory. But from your perspective, it's just Clojure data.

## When You Need Specialized Collections

The standard EVE hash-map/set/vec/list cover most use cases. But EVE also provides specialized collections for when you need specific capabilities that standard maps and sets don't offer:

- **Integer Map**: O(log32 n) lookups by integer key, efficient merge-with, range queries
- **Sorted Set**: O(log n) sorted traversal, membership testing, ordered iteration

These live in shared memory like all EVE types and must be used within atoms.

## Integer Map (PATRICIA Trie)

An adaptation of Okasaki and Gill's "Fast Mergeable Integer Maps" — a 16-way branching PATRICIA trie with 32-bit integer keys. Useful for integer-keyed lookup tables, sparse arrays, and scenarios requiring efficient range queries or merge operations.

```clojure
(require '[cljs-thread.core :as t])
(require '[cljs-thread.eve.deftype.int-map :as im])
```

### Basic Usage

```clojure
;; Create an atom with an int-map inside
(defonce index (t/atom {:data (im/int-map)}))

;; Use standard map operations inside swap!
(swap! index update :data assoc 1 :a)
(swap! index update :data assoc 2 :b)
(swap! index update :data assoc 3 :c)

;; On deref, eve types are materialized to plain CLJS types
;; so standard Clojure operations work as expected
(get (:data @index) 2)          ;=> :b
(count (:data @index))          ;=> 3
(contains? (:data @index) 2)    ;=> true
```

### Building Inside Transactions

Since all EVE types must live in atoms, build your int-maps inside `swap!` or atom creation:

```clojure
;; Build during atom creation
(defonce scores (t/atom {:board (-> (im/int-map)
                                    (assoc 1 100)
                                    (assoc 2 85)
                                    (assoc 3 92))}))

;; Or build via successive swaps
(swap! scores update :board assoc 4 78)
(swap! scores update :board dissoc 2)
```

### Negative Keys

Integer maps support the full 32-bit key range, including negative integers:

```clojure
(defonce state (t/atom {:temps (-> (im/int-map)
                                    (assoc -10 "cold")
                                    (assoc 0 "freezing")
                                    (assoc 25 "warm"))}))

(get (:temps @state) -10)   ;=> "cold"
```

### Merge

```clojure
(swap! state update :index
  (fn [current]
    (let [other (-> (im/int-map) (assoc 2 :B) (assoc 3 :c))]
      (im/merge current other))))          ;; right wins on conflict

;; Or with custom conflict resolution
(swap! state update :counts
  (fn [current]
    (let [new-counts (-> (im/int-map) (assoc 2 200) (assoc 3 300))]
      (im/merge-with + current new-counts))))  ;; sum on conflict
```

### Update & Range

```clojure
;; Update a value by key — standard Clojure update works
(swap! state update-in [:board 1] inc)

;; Range query — inside a transaction (im/range operates on the int-map type)
(swap! state update :board-subset
  (fn [_] (im/range (:board state) 3 7)))
```

### Iteration

On deref, int-map values are materialized to plain CLJS maps. All standard sequence operations work:

```clojure
(let [m (:board @scores)]
  (seq m)                ;=> ([1 100] [3 92] [4 78])
  (reduce-kv + 0 m)     ;=> sum of keys + values
  (into {} m))           ;=> regular Clojure map
```

## Sorted Set (Red-Black Tree)

An Okasaki-style persistent red-black tree. Each node lives in SAB memory. Inserts produce new nodes via path-copying (persistent/immutable). Useful when you need sorted iteration or ordered membership testing.

```clojure
(require '[cljs-thread.core :as t])
(require '[cljs-thread.eve.deftype.rb-tree :as rb])
```

### Basic Usage

```clojure
;; Create an atom with a sorted set inside
(defonce state (t/atom {:tags (rb/sorted-set)}))

;; Add elements via conj inside swap!
(swap! state update :tags conj "clojure")
(swap! state update :tags conj "javascript")
(swap! state update :tags conj "python")
(swap! state update :tags conj "clojure")  ;; duplicate — no-op

;; On deref, the sorted set is materialized to a plain CLJS value
@state  ;=> {:tags ("clojure" "javascript" "python")}
```

### Building During Atom Creation

```clojure
;; Build the sorted set in the atom constructor
(defonce priorities (t/atom {:queue (rb/sorted-set 5 3 8 1 4 7 9 2 6)}))

@priorities  ;=> {:queue (1 2 3 4 5 6 7 8 9)}
```

### Operations Inside Transactions

The sorted set's specialized operations (`conj`, `member?`, `get`) work inside `swap!` where the value is the live SAB-backed type:

```clojure
(swap! state
  (fn [s]
    (let [tags (:tags s)]
      (println (count tags))              ;=> 3
      (println (rb/member? tags "python")) ;=> true
      (println (tags "python"))            ;=> "python"
      (println (seq tags)))               ;=> ("clojure" "javascript" "python")
    s))
```

### Works With Any Comparable Type

Sorted sets use `compare` for ordering, so keywords, strings, and numbers all work:

```clojure
(defonce kw-state (t/atom {:kw-set (rb/sorted-set :z :a :m :f :b :q)}))

(swap! kw-state
  (fn [s]
    (println (seq (:kw-set s)))  ;=> (:a :b :f :m :q :z)
    s))
```

## Transparency — Standard Data Structures

For most code, you don't need `im/int-map` or `rb/sorted-set` at all. Regular Clojure maps, vectors, sets, and lists are automatically stored as EVE data structures when placed in a shared atom:

```clojure
(defonce app-state (t/atom {:counter 0
                            :users {}
                            :items []
                            :flags #{:active}}))

;; All standard Clojure — EVE serializes/deserializes transparently
(swap! app-state update :counter inc)
(swap! app-state assoc-in [:users :alice] {:role :admin})
(swap! app-state update :items conj "new")
(swap! app-state update :flags conj :verified)
```

The specialized collections are only needed when you want capabilities beyond what standard maps and sets provide (integer-keyed range queries, sorted iteration, efficient merge-with, etc.).
