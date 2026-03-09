# Eve Data Structures

Eve provides `SharedArrayBuffer`-backed atoms and persistent data structures that are shared across workers with zero-copy semantics. Unlike serialized data that gets copied between workers, Eve data structures live in shared memory — all workers see the same data.

## Overview

| Type | Constructor | Backed By |
|------|------------|-----------|
| SharedAtom | `t/atom` | Slot within an AtomDomain's SAB |
| AtomDomain | `eve/atom-domain` | SharedArrayBuffer — a shared mutable map |
| HashMap | `eve/hash-map` | HAMT in SharedArrayBuffer |
| HashSet | `eve/hash-set` | HAMT in SharedArrayBuffer |
| Vector | `eve/vector` | Persistent vector in SharedArrayBuffer |
| List | `eve/list` | Persistent list in SharedArrayBuffer |
| Array | `eve/eve-array` | Typed array in SharedArrayBuffer |
| Custom types | `eve/deftype` | User-defined SAB-backed types |

Most user code only needs `cljs-thread.core` — shared atoms are available as `t/atom`. For advanced features (custom `AtomDomain`, `deftype`, `extend-type`), require `cljs-thread.eve`.

## Setup

```clojure
(ns my-app.core
  (:require [cljs-thread.core :as t]))

;; Create a shared atom — the allocator initializes automatically
(defonce state (t/atom {:counter 0}))
```

For advanced eve features (standalone atom domains, custom SAB-backed types):

```clojure
(ns my-app.advanced
  (:require [cljs-thread.eve :as eve :include-macros true]))
```

## AtomDomain

An `AtomDomain` is the primary shared state container — a `SharedArrayBuffer`-backed atom that holds a Clojure map. It implements `IDeref`, `IReset`, `ISwap`, and `IWatchable`.

```clojure
;; Create a standalone AtomDomain with its own SAB
(def my-domain
  (eve/atom-domain {:counter 0 :name "world"}
    :sab-size (* 4 1024 1024)   ;; 4MB (default: 256MB)
    :max-blocks 4096))           ;; max descriptor slots (default: 65536)
```

Standard atom operations work:

```clojure
@my-domain
;=> {:counter 0 :name "world"}

(swap! my-domain update :counter inc)
;=> {:counter 1 :name "world"}

(reset! my-domain {:counter 0})
;=> {:counter 0}

(add-watch my-domain :log (fn [k ref old new] (println :changed old :-> new)))
(remove-watch my-domain :log)
```

### Cross-Worker Sharing

To share an `AtomDomain` across workers, extract its SAB references and pass them:

```clojure
;; On the creating worker:
(def transfer (eve/sab-transfer-data my-domain))
;; => {:sab <SharedArrayBuffer> :reader-map-sab <SharedArrayBuffer>}

;; On a receiving worker:
(eve/init-eve-on-worker! transfer)
```

The fat kernel handles this automatically for the global atom instance.

## SharedAtom

A `SharedAtom` is an individual atom within a shared `AtomDomain`. Multiple `SharedAtom`s share the same underlying `SharedArrayBuffer`. `t/atom` (from `cljs-thread.core`) is the standard way to create one:

```clojure
;; Create a SharedAtom in the global AtomDomain
(def counter (t/atom {:count 0}))

@counter
;=> {:count 0}

(swap! counter update :count inc)
;=> {:count 1}
```

SharedAtoms support the same protocols as AtomDomain: `IDeref`, `IReset`, `ISwap`, `IWatchable`, `IMeta`, `IWithMeta`.

### Type Predicates

```clojure
(eve/atom-domain? my-domain)  ;=> true
(eve/shared-atom? counter)    ;=> true
```

## HashMap, HashSet, Vector, List — Transparent Storage

When you put a regular Clojure map, set, vector, or list into a shared atom, EVE automatically stores it as a `SharedArrayBuffer`-backed persistent data structure. When you deref the atom, it's deserialized back to heap memory. You use standard Clojure code — the EVE layer is transparent:

```clojure
(defonce state (t/atom {:users {:alice {:role :admin}
                                :bob   {:role :user}}
                        :tags  #{:active :verified}
                        :items [1 2 3]}))

;; All standard Clojure — EVE handles storage transparently
(swap! state assoc-in [:users :carol] {:role :user})
(swap! state update :tags conj :premium)
(swap! state update :items conj 4)

@state
;=> {:users {:alice {:role :admin} :bob {:role :user} :carol {:role :user}}
;    :tags #{:active :verified :premium}
;    :items [1 2 3 4]}
```

Under the hood, the map is stored as an EVE HAMT, the set as an EVE hash-set, and the vector as an EVE persistent vector — all in `SharedArrayBuffer`. Every worker that can reach this atom sees the same shared memory, with zero-copy semantics.

There is no need to call `eve/hash-map`, `eve/hash-set`, `eve/vector`, or `eve/list` directly. Regular Clojure constructors (`{}`, `#{}`, `[]`, `'()`) are serialized into the EVE equivalents automatically during `swap!` and `reset!`.

## Typed Arrays

Eve arrays provide typed array storage in `SharedArrayBuffer` with optional atomic operations. Atoms handle typed arrays automatically — when you store a typed array in an Eve atom, it is backed by shared memory transparently.

```clojure
(require '[cljs-thread.eve :as eve])
(require '[cljs-thread.eve.array :as arr])

;; Construction
(arr/eve-array :int32 10)            ;; 10 zero-filled int32 elements
(arr/eve-array :float64 10 0.0)      ;; 10 float64 filled with 0.0
(arr/eve-array :uint8 [1 2 3])       ;; from collection
```

Supported types: `:int8`, `:uint8`, `:uint8-clamped`, `:int16`, `:uint16`, `:int32`, `:uint32`, `:float32`, `:float64`

### Element Access

```clojure
(eve/aget my-array 0)        ;; read (atomic for integer types)
(eve/aset my-array 0 42)     ;; write (atomic for integer types)
```

### Atomic Operations (integer types only)

```clojure
(arr/cas! my-array idx expected new-val)   ;; compare-and-swap
(arr/add! my-array idx delta)              ;; atomic add
(arr/sub! my-array idx delta)              ;; atomic subtract
(arr/band! my-array idx mask)              ;; atomic bitwise AND
(arr/bor! my-array idx mask)               ;; atomic bitwise OR
(arr/bxor! my-array idx mask)              ;; atomic bitwise XOR
```

### Wait/Notify (int32 only)

```clojure
(arr/wait! my-array idx expected)          ;; block until value changes
(arr/wait! my-array idx expected timeout)  ;; with timeout
(arr/notify! my-array idx)                 ;; wake one waiting worker
(arr/notify! my-array idx count)           ;; wake N waiting workers
```

### Low-Level Access

```clojure
(arr/get-sab my-array)          ;; underlying SharedArrayBuffer
(arr/get-typed-view my-array)   ;; raw JS TypedArray view
(arr/array-type my-array)       ;; type keyword (:int32, etc.)
(arr/retire! my-array)          ;; mark for GC
```

### SIMD-Accelerated Operations (int32 only)

These use SIMD for 4x throughput but are **not atomic** — use only when exclusive access is guaranteed:

```clojure
(arr/afill-simd! my-array 42)                    ;; fill all elements
(arr/afill-simd! my-array 42 start end)           ;; fill range
(arr/acopy-simd! dest src)                        ;; copy array
(arr/asum-simd my-array)                          ;; sum all elements
(arr/areduce-simd my-array init-val f)            ;; SIMD reduce
(arr/amap-simd my-array f)                        ;; SIMD map
```

## `eve/deftype` — Custom SAB-Backed Types

Define types with fields stored directly in `SharedArrayBuffer`:

```clojure
(require '[cljs-thread.eve :as eve :include-macros true])

(eve/deftype Counter [^:mutable ^:int32 count label]
  ICounted
  (-count [this] count))
```

### Field Metadata

| Hint | Storage | Notes |
|------|---------|-------|
| `^:int32`, `^:uint32` | 4-byte SAB slot | Atomic read/write |
| `^:float32` | 4-byte SAB slot | Non-atomic |
| `^:float64` | 8-byte SAB slot | Non-atomic |
| `^:MyEveType` | Offset reference | Links to another `eve/deftype` |
| (no hint) | Serialized | Any Clojure value, stored via `pr-str`/`cljs.reader` |

### Mutability

| Modifier | Behavior |
|----------|----------|
| (default) | Immutable — set at construction |
| `^:mutable` | Mutable via `set!` (single-worker) |
| `^:volatile-mutable` | Atomic via `set!`/`cas!` (cross-worker safe) |

### Extending Types

```clojure
(eve/extend-type Counter
  IIncable
  (-inc! [this]
    (set! count (inc count))
    this))
```

Field names from the type's declaration are available as local bindings in method bodies. `set!` and `cas!` on declared fields are rewritten to SAB operations.

## Memory Model

Eve uses a custom allocator within `SharedArrayBuffer`:

- **Descriptor table:** Fixed-size array of block descriptors (status, offset, capacity, data length)
- **Data region:** Variable-size region where actual data is stored
- **SoA mirrors:** Structure-of-arrays mirrors of descriptor fields for SIMD scanning
- **Epoch-based GC:** Concurrent readers are protected by epoch tracking — blocks are only freed when no reader holds a reference

### Default Memory Budget

When `t/atom` creates the first SharedAtom, it bootstraps a global `AtomDomain` with the defaults below. These cover the **overflow allocator** (blocks >1024B) and the **slab allocator** (blocks ≤1024B). WASM Memory reserves virtual address space but only commits physical pages as written, so the defaults are essentially free until used.

#### AtomDomain (overflow allocator — blocks >1024B)

| Parameter | Default | Source |
|-----------|---------|--------|
| `:sab-size` | 256 MB | `shared_atom.cljs` `atom-domain` |
| `:max-blocks` | 65,536 descriptors | `shared_atom.cljs` `atom-domain` |
| Block descriptor size | 28 bytes (7 × i32) | `data.cljs` `SIZE_OF_BLOCK_DESCRIPTOR` |
| WASM growth ceiling | 1 GB (16,384 pages × 64 KB) | `wasm_mem.cljs` `MAX_PAGES` |
| Reader-map SAB | 256 KB (65,536 × i32) | `data.cljs` `READER_MAP_SAB_SIZE_BYTES` |

#### Slab allocator (blocks ≤1024B)

Six size-stratified slabs, each in its own `SharedArrayBuffer`. Growth factor is 4× via `WebAssembly.Memory` maximum.

| Class | Block Size | Initial Capacity | Max Blocks | Growth Max |
|-------|-----------|-------------------|-----------|-----------|
| 0 | 32 B | 32 MB | 1,048,576 | 128 MB |
| 1 | 64 B | 64 MB | 1,048,576 | 256 MB |
| 2 | 128 B | 64 MB | 524,288 | 256 MB |
| 3 | 256 B | 32 MB | 131,072 | 128 MB |
| 4 | 512 B | 16 MB | 32,768 | 64 MB |
| 5 | 1024 B | 16 MB | 16,384 | 64 MB |

**Total initial slab capacity: 224 MB** (32+64+64+32+16+16). Typical contents per class: tiny HAMT bitmap nodes (class 0), common HAMT nodes (1), vec trie nodes (2), collision/serialized values (3–5).

#### Worker registry & scratch

| Parameter | Default | Source |
|-----------|---------|--------|
| Max workers | 256 | `data.cljs` `MAX_WORKERS` |
| Worker slot size | 24 bytes | `data.cljs` `WORKER_SLOT_SIZE` |
| Worker registry total | 6,144 bytes | `data.cljs` `WORKER_REGISTRY_SIZE` |
| Per-worker WASM scratch | 4 KB | `wasm_mem.cljs` `SCRATCH_SIZE` |
| Scratch pool total | 1 MB (256 × 4 KB) | — |
| Heartbeat timeout | 30,000 ms | `data.cljs` `HEARTBEAT_TIMEOUT_MS` |

#### Overriding defaults

Pass `:sab-size` and `:max-blocks` to `eve/atom-domain` to size a standalone domain:

```clojure
(eve/atom-domain {:counter 0}
  :sab-size   (* 4 1024 1024)   ;; 4MB overflow region
  :max-blocks 4096)              ;; 4K descriptors
```

Slab class capacities are currently compile-time constants in `deftype_proto/data.cljs` (`SLAB_CLASS_CAPACITIES`).

### Block States

| State | Meaning |
|-------|---------|
| FREE | Available for allocation |
| ALLOCATED | In-use data block |
| RETIRED | Marked for GC, waiting for epoch sweep |
| EMBEDDED | Embedded atom header block |
| ORPHANED | Failed free, needs cleanup |

### Diagnostics

Use X-RAY for storage model validation:

```clojure
;; Internal namespace — diagnostic use only
(require '[cljs-thread.eve.shared-atom :as a])

(a/validate-storage-model! (.-s-atom-env my-atom) {:width 80 :label "checkpoint"})
(a/xray-replay!)
```

See [Testing](10-testing.md) for the full X-RAY reference.
