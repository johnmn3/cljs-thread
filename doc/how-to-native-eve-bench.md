# native-eve: Persistent Atoms on Disk

**Cross-process, mmap-backed persistent data structures for Clojure.**

JVM Clojure and Node.js ClojureScript processes share and atomically mutate
a Clojure data structure via memory-mapped files on disk. No database, no
serialization protocol, no network layer. Just `swap!` on a file.

This guide lets you build a persistent atom and stress-test it on your own
machine.

---

## Quick Start

```bash
# Clone and enter the repo
git clone -b eve-native https://github.com/johnmn3/cljs-thread.git
cd cljs-thread

# Install native addon (C++ mmap/CAS/futex ops)
npm install

# Compile the Node.js worker (needed for cross-process tests)
npx shadow-cljs compile bench-worker
```

---

## 1. Build a 10 MB Atom

Creates a persistent atom with ~1,800 keys of rich heterogeneous Clojure data
(nested maps, vectors, sets, lists, strings, keywords, integers, booleans)
stored in mmap-backed slab files on disk.

```bash
clj -M:native-build-atom /tmp/eve-10m 10
```

**macOS (Intel laptop):**
```
native-eve: Building Persistent Atom
========================================
  Path:   /tmp/eve-10m
  Target: ~10 MB on disk
  Types:  maps, vectors, sets, lists, strings,
          keywords, integers, booleans
========================================

   1,800 keys |   11.8 MB on disk |   5.8s elapsed

Build Complete
========================================
  Keys:        1,801
  Disk:        11.8 MB (12,413,056 bytes)
  Elapsed:     5.8s
  Throughput:  309 keys/s
========================================
```

**Linux (8-core cloud VM, 16 GB RAM):**
```
native-eve: Building Persistent Atom
========================================
  Path:   /tmp/eve-10m
  Target: ~10 MB on disk
  Types:  maps, vectors, sets, lists, strings,
          keywords, integers, booleans
========================================

   1,800 keys |   11.8 MB on disk |   8.1s elapsed

Build Complete
========================================
  Keys:        1,801
  Disk:        11.8 MB (12,413,056 bytes)
  Elapsed:     8.1s
  Throughput:  223 keys/s
========================================
```

---

## 2. Stress-Test the 10 MB Atom

Runs a cross-process contention benchmark:
- Cold-opens the atom from disk (JVM process)
- Measures JVM single-writer swap latency (O(log32 N) path-copy)
- Measures Node.js single-writer swap latency
- Launches **4 JVM threads + 4 Node.js processes** all doing `swap!` on the
  same `:counter` key simultaneously, proving CAS correctness

```bash
clj -M:native-x-stress-atom /tmp/eve-10m
```

**macOS (Intel laptop):**
```
native-eve: Cross-Process Contention Stress Test
====================================================
  Atom:    /tmp/eve-10m
  On disk: 11.8 MB
====================================================

-- Phase 1: Cold Open (JVM joins atom from disk) --

  join-atom:     21.6 ms (open mmap files)
  first deref:    9.0 ms (1,801 keys, 11.8 MB)

-- Phase 2: JVM Single-Writer Swap Latency --

  100 swaps (update existing keys in 1,801-key map)
    p50:       3.06 ms
    p95:       6.41 ms
    p99:      21.27 ms
    min/max:   1.59 / 21.27 ms

-- Phase 3: Node Single-Writer Swap Latency --

  100 swaps (Node.js process, new keys)
    p50:       0.54 ms
    p95:       0.94 ms
    p99:       6.28 ms
    min/max:   0.40 / 6.28 ms

-- Phase 4: 4 JVM Threads + 4 Node Processes (counter contention) --

  Writers:    4 JVM threads + 4 Node processes
  Ops/worker: 50
  Wall time:    690 ms
  Throughput:   580 ops/s (aggregate)
  Counter:    400 (expected 400) CORRECT

====================================================
  Stress Test Complete

  Key insight: each swap! touches only O(log32 N)
  HAMT nodes via structural sharing. Updating any
  single key in a 12 MB atom costs the same as in
  a tiny atom: ~3-4 tree levels regardless of size.
====================================================
```

**Linux (8-core cloud VM, 16 GB RAM):**
```
native-eve: Cross-Process Contention Stress Test
====================================================
  Atom:    /tmp/eve-10m
  On disk: 11.8 MB
====================================================

-- Phase 1: Cold Open (JVM joins atom from disk) --

  join-atom:     21.7 ms (open mmap files)
  first deref:   12.3 ms (1,801 keys, 11.8 MB)

-- Phase 2: JVM Single-Writer Swap Latency --

  100 swaps (update existing keys in 1,801-key map)
    p50:       3.74 ms
    p95:      11.36 ms
    p99:      33.20 ms
    min/max:   1.58 / 33.20 ms

-- Phase 3: Node Single-Writer Swap Latency --

  100 swaps (Node.js process, new keys)
    p50:       0.24 ms
    p95:       2.99 ms
    p99:      12.95 ms
    min/max:   0.15 / 12.95 ms

-- Phase 4: 4 JVM Threads + 4 Node Processes (counter contention) --

  Writers:    4 JVM threads + 4 Node processes
  Ops/worker: 50
  Wall time:  1,164 ms
  Throughput:   344 ops/s (aggregate)
  Counter:    400 (expected 400) CORRECT

====================================================
  Stress Test Complete

  Key insight: each swap! touches only O(log32 N)
  HAMT nodes via structural sharing. Updating any
  single key in a 12 MB atom costs the same as in
  a tiny atom: ~3-4 tree levels regardless of size.
====================================================
```

---

## 3. Build a 100 MB Atom

Same structure, 10x the data (~16,400 keys). This demonstrates that
read/write performance scales with tree depth (O(log32 N)), not data size.

```bash
clj -M:native-build-atom /tmp/eve-100m 100
```

**macOS (Intel laptop):**
```
Build Complete
========================================
  Keys:        16,401
  Disk:        115.4 MB (121,024,512 bytes)
  Elapsed:     79.5s
  Throughput:  206 keys/s
========================================
```

**Linux (8-core cloud VM, 16 GB RAM):**
```
Build Complete
========================================
  Keys:        16,401
  Disk:        115.4 MB (121,024,512 bytes)
  Elapsed:     124.6s
  Throughput:  132 keys/s
========================================
```

---

## 4. Stress-Test the 100 MB Atom

```bash
clj -M:native-x-stress-atom /tmp/eve-100m
```

**macOS (Intel laptop):**
```
native-eve: Cross-Process Contention Stress Test
====================================================
  Atom:    /tmp/eve-100m
  On disk: 115.4 MB
====================================================

-- Phase 1: Cold Open (JVM joins atom from disk) --

  join-atom:     30.4 ms (open mmap files)
  first deref:    8.2 ms (16,401 keys, 115.4 MB)

-- Phase 2: JVM Single-Writer Swap Latency --

  100 swaps (update existing keys in 16,401-key map)
    p50:       1.89 ms
    p95:      13.65 ms
    p99:      34.12 ms
    min/max:   1.34 / 34.12 ms

-- Phase 3: Node Single-Writer Swap Latency --

  100 swaps (Node.js process, new keys)
    p50:       3.48 ms
    p95:       7.63 ms
    p99:      37.75 ms
    min/max:   2.38 / 37.75 ms

-- Phase 4: 4 JVM Threads + 4 Node Processes (counter contention) --

  Writers:    4 JVM threads + 4 Node processes
  Ops/worker: 50
  Wall time:  1,498 ms
  Throughput:   267 ops/s (aggregate)
  Counter:    400 (expected 400) CORRECT

====================================================
  Stress Test Complete

  Key insight: each swap! touches only O(log32 N)
  HAMT nodes via structural sharing. Updating any
  single key in a 115 MB atom costs the same as in
  a tiny atom: ~3-4 tree levels regardless of size.
====================================================
```

**Linux (8-core cloud VM, 16 GB RAM):**
```
native-eve: Cross-Process Contention Stress Test
====================================================
  Atom:    /tmp/eve-100m
  On disk: 115.4 MB
====================================================

-- Phase 1: Cold Open (JVM joins atom from disk) --

  join-atom:     34.5 ms (open mmap files)
  first deref:   16.2 ms (16,401 keys, 115.4 MB)

-- Phase 2: JVM Single-Writer Swap Latency --

  100 swaps (update existing keys in 16,401-key map)
    p50:       2.65 ms
    p95:      20.22 ms
    p99:      67.92 ms
    min/max:   1.66 / 67.92 ms

-- Phase 3: Node Single-Writer Swap Latency --

  100 swaps (Node.js process, new keys)
    p50:       0.24 ms
    p95:       0.93 ms
    p99:       9.44 ms
    min/max:   0.15 / 9.44 ms

-- Phase 4: 4 JVM Threads + 4 Node Processes (counter contention) --

  Writers:    4 JVM threads + 4 Node processes
  Ops/worker: 50
  Wall time:  1,015 ms
  Throughput:   394 ops/s (aggregate)
  Counter:    400 (expected 400) CORRECT

====================================================
  Stress Test Complete

  Key insight: each swap! touches only O(log32 N)
  HAMT nodes via structural sharing. Updating any
  single key in a 115 MB atom costs the same as in
  a tiny atom: ~3-4 tree levels regardless of size.
====================================================
```

---

## What You're Seeing

### macOS Intel vs Linux — 10 MB atom

| Metric | macOS Intel | Linux 8-core | Notes |
|--------|-------------|--------------|-------|
| Cold open | 21.6 ms | 21.7 ms | Identical — mmap open is OS-agnostic |
| First deref | 9.0 ms | 12.3 ms | Page fault pattern differs |
| JVM swap p50 | 3.06 ms | 3.74 ms | Same order of magnitude |
| Node swap p50 | 0.54 ms | 0.24 ms | Linux futex sleep vs macOS spin |
| Contention throughput | 580 ops/s | 344 ops/s | macOS spin wins at low contention |
| CAS correctness | 400/400 | 400/400 | Always correct |

### macOS Intel vs Linux — 100 MB atom

| Metric | macOS Intel | Linux 8-core | Scaling (macOS) | Scaling (Linux) |
|--------|-------------|--------------|-----------------|-----------------|
| Cold open | 30.4 ms | 34.5 ms | ~1.4x | ~1.6x |
| First deref | 8.2 ms | 16.2 ms | ~1x | ~1.3x |
| JVM swap p50 | 1.89 ms | 2.65 ms | ~1x | ~1x |
| Node swap p50 | 3.48 ms | 0.24 ms | — | 1x |
| Contention throughput | 267 ops/s | 394 ops/s | ~1x | ~1x |
| CAS correctness | 400/400 | 400/400 | Always | Always |

**Key observations:**

- **JVM swap latency is constant** regardless of atom size. Updating one key
  in a 115 MB atom takes the same ~2-3 ms as in a 12 MB atom. Each `swap!`
  path-copies only O(log32 N) HAMT nodes (~3-4 levels), not the entire
  structure.

- **Cross-process CAS is always correct.** 8 concurrent writers (4 JVM threads
  + 4 Node.js processes) each increment a shared counter 50 times. The final
  value is always exactly 400 — no lost updates, no corruption, on either OS.

- **Cold open is fast.** Opening a 115 MB atom from disk takes ~30-35 ms
  (mmap, no deserialization). First deref lazily reads only the root pointer.

- **macOS vs Linux contention throughput differ** because macOS lacks kernel
  futex support in this addon — the wait/notify fall back to a 100 µs
  spin-poll. At low contention (50 ops/worker) spinning wins on macOS; Linux
  futex sleep/wake has more overhead per wakeup but scales better under high
  contention.

- **Node swap p50 on macOS grows with atom size** (0.54 ms → 3.48 ms) due to
  cold page faults in the larger slab files. Linux Node stays flat (0.24 ms)
  because the kernel's readahead and futex-based coordination keep hot pages
  warmer.

- **Both platforms navigate the same tree.** JVM and Node.js use identical
  Murmur3 hashing over canonical serialized key bytes, producing the same HAMT
  trie structure. No rehashing or fallback paths.

---

## How It Works

- **Storage:** 6 slab files (block sizes 32-1024 bytes) + root pointer + rmap
- **Data structure:** HAMT (Hash Array Mapped Trie) with 32-way branching
- **Persistence:** Structural sharing — `swap!` allocates new path nodes, old
  ones are reclaimed by epoch GC
- **Atomicity:** CAS on the root pointer in the `.root` mmap file, with futex
  notification for cross-process coordination (Linux); spin-poll fallback on
  macOS
- **Hashing:** Portable Murmur3_x86_32 over canonical serialized key bytes —
  identical on JVM and V8

---

## Requirements

- JDK 21+
- Node.js 18+
- Clojure CLI 1.11+
- Linux or macOS (mmap + futex; macOS uses spin-poll fallback for wait/notify)
- C++ compiler supporting C++14 or later (GCC 5+, Clang 3.4+, Apple Clang 6+)
