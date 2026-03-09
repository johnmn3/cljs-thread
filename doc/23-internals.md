# Internals Deep Dive

This document covers the internal subsystems that power `cljs-thread`. You don't need to understand these to use the library, but they're useful for contributors, debuggers, and anyone curious about the architecture.

## WASM Memory Backend

All EVE storage uses `WebAssembly.Memory` rather than raw `SharedArrayBuffer`. This provides two critical capabilities:

1. **`memory.grow`**: The data region can expand at runtime without replacing the underlying buffer reference. When a slab fills up, EVE grows the WASM Memory instead of allocating a new SAB.

2. **SIMD**: WASM SIMD instructions operate directly on the memory for vectorized operations (HAMT scanning, bitmap operations, bulk fills).

### Memory Layout

Each `WebAssembly.Memory` instance has three logical regions:

| Region | Purpose |
|--------|---------|
| **Index** | Descriptor tables, free lists, metadata |
| **Scratch** | Per-worker temporary storage (4KB per worker, 256 workers max = 1MB total) |
| **Data** | Actual data blocks (maps, vectors, atoms, deftypes) |

Default limits:

| Parameter | Value |
|-----------|-------|
| Initial size | Varies by slab class (16-64MB) |
| Growth ceiling | 4× initial (via `MAX_PAGES`) |
| Page size | 64KB (WASM standard) |

The growth ceiling is virtual address space — physical pages are only committed as written.

## Slab Allocator

The slab allocator handles small blocks (≤1024 bytes) across six size-stratified slabs. Each slab is its own `WebAssembly.Memory` instance.

| Class | Block Size | Initial Capacity | Max Blocks |
|-------|-----------|-------------------|------------|
| 0 | 32B | 32MB | 1,048,576 |
| 1 | 64B | 64MB | 1,048,576 |
| 2 | 128B | 64MB | 524,288 |
| 3 | 256B | 32MB | 131,072 |
| 4 | 512B | 16MB | 32,768 |
| 5 | 1024B | 16MB | 16,384 |

Typical contents: HAMT bitmap nodes (class 0), common HAMT nodes (1), vec trie nodes (2), collision/serialized values (3-5).

### Allocation Flow

1. Request arrives with byte size
2. Round up to nearest slab class
3. Check slab's free list (lock-free pop via CAS)
4. If free list empty, bump-allocate from slab's data region
5. If slab full, grow WASM Memory
6. Return descriptor index + data offset

### Hooks

```clojure
(require '[cljs-thread.eve.deftype-proto.alloc :as alloc])

;; Register allocation/recycling hooks (for debugging)
(alloc/register-alloc-hook! (fn [class-idx block-idx] ...))
(alloc/register-recycle-hook! (fn [class-idx block-idx] ...))
```

### Slab Statistics

```clojure
(alloc/slab-stats)
;=> [{:class 0 :block-size 32 :allocated 1234 :free 5678 :total 1048576}
;    {:class 1 :block-size 64 :allocated 890 :free 1048686 :total 1048576}
;    ...]
```

## X-RAY Diagnostics

X-RAY validates slab allocator invariants at runtime. Enable via compiler flag:

```clojure
{:closure-defines {cljs-thread.eve.deftype-proto.xray/DIAGNOSTICS true}}
```

### Functions

```clojure
(require '[cljs-thread.eve.deftype-proto.xray :as xray])

(xray/slab-xray-validate! "checkpoint-label")
;; Throws if any invariant is violated

(xray/enable-trace!)
;; Log every alloc/free operation

(xray/enable-pool-tracking!)
;; Track pool state transitions
```

See [Testing](10-testing.md) for the full X-RAY reference.

## CPS Transform (Go-Blocks)

The go-block system (`cljs-thread.go`) rewrites code at compile time to convert blocking `@` into Promise-based continuations.

### Compile-Time (`go.clj`)

The `transform-body` macro walks the AST and:

1. Identifies `@`/`deref` forms
2. Wraps each in a `park-deref` continuation
3. Chains continuations via Promises
4. Crosses `fn` boundaries for whitelisted HOFs (`map`, `filter`, `reduce`, `keep`, `some`, `run!`, `mapv`, `filterv`, `into`) via CSP defunctionalization — these are replaced with parking-aware variants (`park-map`, `park-filter`, `park-reduce`, etc.)
5. Stops at `fn`/`letfn`/`reify`/`deftype` boundaries for non-HOF forms (deref falls back to blocking)
6. Applies optimizations (identity continuations, partial application, applier patterns)

Supported forms: `do`, `let`/`let*`, `if`, `when`, `when-let`, `if-let`, `cond`, `try`/`catch`/`finally`, `and`, `or`.

### Runtime (`go.cljs`)

```clojure
(require '[cljs-thread.go :as go])

;; park-deref: the core parking primitive
;; Checks for __cljs_thread_parkable__ tag
;; If parkable: resolve via Promise chain
;; If sync channel: poll direct SAB sync
;; Otherwise: sync deref
(go/park-deref x continuation)

;; chain: attach continuation to Promise-wrapped value
(go/chain value continuation)
```

### Parking-Aware HOFs

These replace standard HOFs inside go-blocks to support parking across `fn` boundaries:

| Standard | Parking Variant |
|----------|----------------|
| `map` | `go/park-map` |
| `filter` | `go/park-filter` |
| `remove` | `go/park-remove` |
| `keep` | `go/park-keep` |
| `some` | `go/park-some` |
| `run!` | `go/park-run!` |
| `reduce` | `go/park-reduce` |

## Service Worker Internals

The Service Worker provides blocking semantics as a fallback when `SharedArrayBuffer` is unavailable (no COOP/COEP headers). It intercepts HTTP requests to implement a request/response protocol.

### Endpoints

| Path | Method | Purpose |
|------|--------|---------|
| `/intercept/request/<id>` | GET | Worker parks here waiting for response |
| `/intercept/response/<id>` | POST | Another worker delivers a response |
| `/intercept/sleep/<ms>` | GET | Sleep for N milliseconds |

### Protocol Flow

1. Worker A needs result from Worker B
2. A sends XHR GET to `/intercept/request/<id>`
3. SW holds the request open (pending Promise)
4. B computes result, sends POST to `/intercept/response/<id>`
5. SW resolves the held request with the response body
6. A's XHR completes with the result

### Headers

The SW sets COOP/COEP headers on all intercepted responses:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: credentialless
Cache-Control: max-age=31556952,immutable
```

### Kernel Serving

The SW also serves the fat kernel blob. When a new worker boots, the SW intercepts the fetch for the kernel URL and returns the cached source with init-data injected via query parameters.

### Cleanup

Stale responses are cleaned up periodically via `shake` — responses older than the configured timeout are removed.

## `eve/extend-type` Details

`eve/extend-type` adds protocol implementations to existing `eve/deftype` types:

```clojure
(eve/extend-type Counter
  IIncable
  (-inc! [this]
    (set! count (inc count))
    this))
```

### How It Works

1. Field names from the original `eve/deftype` declaration are available as local bindings in method bodies
2. `set!` on declared fields is rewritten to SAB atomic operations:
   - For `^:mutable` fields: non-atomic store
   - For `^:volatile-mutable` fields: `Atomics.store`
3. `cas!` on fields is rewritten to `Atomics.compareExchange`
4. The method implementations are added to the type's prototype

### Cross-Worker Protocol Dispatch

Protocol methods on eve types dispatch correctly across workers because the type's SAB-backed data is shared. When Worker A calls a protocol method on an eve object created by Worker B, the method reads/writes the same shared memory.

### Extending from Other Namespaces

```clojure
(ns my-app.extensions
  (:require [cljs-thread.eve :as eve :include-macros true]
            [my-app.types :refer [Counter]]))

(eve/extend-type Counter
  my-app.protocols/ISerializable
  (-serialize [this]
    {:count count :label label}))
```

Field bindings (`count`, `label`) are resolved from the type's original field declaration, not from the current namespace.
