# eve/obj — Typed Shared Objects

`eve/obj` provides schema-based typed objects backed by `SharedArrayBuffer`. Two representations are available, optimized for different access patterns:

- **`eve-obj`** (AoS — Array of Structures): A single object with named typed fields. Good for individual records, tree nodes, and whole-object operations.
- **`eve-obj-array`** (SoA — Structure of Arrays): A collection of objects stored column-wise. Good for batch processing, SIMD operations, and cache-efficient iteration.

Both provide full Atomics API for cross-worker access.

**Important:** Like all EVE types, typed objects must be used within atoms. They are allocated from the global `AtomDomain`'s shared memory and should be created and manipulated inside `swap!`, `reset!`, or atom construction.

## Setup

```clojure
(ns my-app.core
  (:require [cljs-thread.core :as t]
            [cljs-thread.eve.obj :as obj]))
```

## Schemas

A schema defines the shape of an object — like a V8 hidden class. Create once, reuse for many objects:

```clojure
(def node-schema
  (obj/create-schema {:key   :int32
                      :left  :int32
                      :right :int32
                      :value :float64}))
```

### Supported Field Types

| Type | Size | Atomic? | Description |
|------|------|---------|-------------|
| `:int8` | 1B | No | Signed 8-bit integer |
| `:uint8` | 1B | No | Unsigned 8-bit integer |
| `:int16` | 2B | No | Signed 16-bit integer |
| `:uint16` | 2B | No | Unsigned 16-bit integer |
| `:int32` | 4B | Yes | Signed 32-bit integer (Atomics.load/store) |
| `:uint32` | 4B | Yes | Unsigned 32-bit integer (Atomics.load/store) |
| `:float32` | 4B | No | 32-bit float |
| `:float64` | 8B | No | 64-bit float |
| `:obj` | 4B | Yes | Offset reference to another eve-obj |
| `:array` | 4B | Yes | Offset reference to an eve-array |

Fields are sorted by alignment (descending) for optimal memory packing.

## Single Objects (eve-obj)

Create and store typed objects inside atom transactions:

```clojure
(defonce state (t/atom {:tree nil}))

;; Create a node inside a swap!
(swap! state assoc :tree
  (obj/obj node-schema {:key 42 :left -1 :right -1 :value 3.14}))
```

### Field Access

Eve objects implement `ILookup`, `IFn`, and `ISeqable`. Inside a transaction:

```clojure
(swap! state
  (fn [s]
    (let [node (:tree s)]
      (println (:key node))      ;=> 42
      (println (:value node))    ;=> 3.14
      (println (node :key))      ;=> 42
      (println (count node))     ;=> 4
      (println (seq node)))      ;=> ([:key 42] [:value 3.14] [:left -1] [:right -1])
    s))
```

### Mutation

Mutation operations should be done within atom transactions or when you have exclusive access:

```clojure
(swap! state update :tree
  (fn [node]
    (obj/assoc! node :key 100)
    node))

;; Atomic operations on int32/uint32 fields:
;; obj/cas!       — compare-and-swap, returns true if swapped
;; obj/add!       — atomic add, returns old value
;; obj/sub!       — atomic subtract, returns old value
;; obj/exchange!  — atomic exchange, returns old value
```

### Inline Schema

If you don't need to reuse the schema, pass the field map directly:

```clojure
(swap! state assoc :point
  (obj/obj {:x :float64 :y :float64} {:x 1.5 :y 2.5}))
```

## Object Arrays (eve-obj-array)

For batch processing, `obj-array` stores N objects as separate column arrays — one typed array per field. This is cache-efficient and SIMD-friendly:

```clojure
(defonce particles (t/atom {:data nil}))

;; Create an array of 1000 nodes inside a swap!
(swap! particles assoc :data
  (obj/obj-array 1000 {:x :int32 :y :int32 :velocity :int32}))
```

### Element Access

```clojure
(swap! particles
  (fn [s]
    (let [data (:data s)]
      ;; Set field at [index, field-key]
      (obj/assoc-in! data [0 :x] 42)
      (obj/assoc-in! data [0 :y] 100)

      ;; Get field at [index, field-key]
      (println (obj/get-in data [0 :x]))    ;=> 42

      ;; Row view — object-like access to a single row
      (println (nth data 0))                 ;=> #eve/obj-array-row {:x 42, :y 100, :velocity 0}
      (println (:x (nth data 0))))           ;=> 42
    s))
```

### Column Access (for SIMD / Batch)

```clojure
(swap! particles
  (fn [s]
    (let [data (:data s)]
      ;; Get the raw Int32Array for a field — use for SIMD or bulk operations
      (let [x-col (obj/column data :x)]
        ;; use x-col for SIMD operations
        )

      ;; Reduce over a single column
      (obj/column-reduce data :x 0
        (fn [acc idx val] (+ acc val)))

      ;; Map in-place over a column
      (obj/column-map! data :x
        (fn [idx val] (* val 2))))
    s))
```

## When to Use eve/obj

Most application state should use regular Clojure maps — they're automatically stored as EVE hash-maps inside shared atoms. Use `eve/obj` when you need:

- **Typed numeric fields** with atomic operations (CAS, add, sub)
- **SoA layout** for SIMD-friendly batch processing
- **Fine-grained field-level atomics** across workers
- **Memory-efficient** storage for large numbers of uniform records
