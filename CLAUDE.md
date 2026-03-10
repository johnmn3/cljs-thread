# CLAUDE.md — cljs-thread / eve

> Read this before touching any code. Then read `doc/perf-plan.md` for the
> performance optimization plan. If you're modifying an EVE collection,
> read the `.bak` file for that collection first.

---

## Project Identity

`cljs-thread` is a zero-configuration threading library for ClojureScript.
`eve` is its shared-memory subsystem: persistent data structures in SharedArrayBuffer.

The native-eve subsystem provides cross-process mmap-backed persistent atoms:
JVM Clojure and Node.js ClojureScript processes share and atomically mutate a
Clojure data structure via memory-mapped files on disk.

Architecture: `doc/native-eve.md`
API guide: `doc/11-agent-guide.md`

---

## Current Mission: Performance Optimization

**Phases 0–7 COMPLETE.** The system is fully functional. CAS correctness proven
under 16-writer contention. Epoch GC operational. JVM↔Node.js interop working.

**Current goal:** Systematically improve performance across all categories.

Master plan: `doc/perf-plan.md`
Baseline numbers: `bench-results.md`
Onboarding: `doc/onboarding.md`

### Performance Categories

| ID | Category | Key Benchmarks | Key Files |
|----|----------|---------------|-----------|
| P1 | Read throughput | B1, B5 | `atom.cljc`, `mem.cljc` |
| P2 | Write throughput | B2, B3, B4 | `atom.cljc`, `alloc.cljc`, `map.cljc` |
| P3 | Contention scaling | B7, B14 | `atom.cljc`, `mmap_cas.cc` |
| P4 | JVM performance | B9, B10, B11 | `atom.cljc`, `mem.cljc`, `map.cljc` |
| P5 | Serialization | B3, B4 | `serialize.cljc`, `mem.cljc` |
| P6 | Slab allocation | B2, B4, B12 | `alloc.cljc`, `mem.cljc` |
| P7 | Epoch GC | B12 | `atom.cljc`, `map.cljc` |
| P8 | Disk footprint | B6, B13 | `data.cljc`, `alloc.cljc` |

Work proceeds in **passes**. Each pass: research all → implement all → benchmark all.
See `doc/perf-plan.md` for the full process, rules, and current state.

---

## The Green Baseline

These must pass at the **start** of every session. Run them before any code change.

```bash
source scripts/ccweb-setup.sh
shadow-compile thread-test    # recompile if any .cljc/.cljs files changed

node target/thread-test/all.js epoch-gc
# → "Ran 16 tests containing 44 assertions. 0 failures, 0 errors."

node target/thread-test/all.js obj
# → "Ran 27 tests containing 2075 assertions. 0 failures, 0 errors."

node target/thread-test/all.js rb-tree
# → "Ran 25 tests containing 80 assertions. 0 failures, 0 errors."

node target/thread-test/all.js int-map
# → "Ran 22 tests containing 368 assertions. 0 failures, 0 errors."

node target/thread-test/all.js batch2
# → "Ran 6 tests containing 59 assertions. 0 failures, 0 errors."

node target/thread-test/all.js batch3
# → "Ran 7 tests containing 33 assertions. 0 failures, 0 errors."

node target/thread-test/all.js batch4
# → "Ran 22 tests containing 82 assertions. 0 failures, 0 errors."

node target/thread-test/all.js typed-array
# → "Ran 9 tests containing 70 assertions. 0 failures, 0 errors."

node target/thread-test/all.js mem
# → "Ran 9 tests containing 35 assertions. 0 failures, 0 errors."

node target/thread-test/all.js mmap
# → "Ran 15 tests containing 27 assertions. 0 failures, 0 errors."

node target/thread-test/all.js mmap-slab
# → "Ran 10 tests containing 26 assertions. 0 failures, 0 errors."

node target/thread-test/all.js mmap-atom
# → "Ran 6 tests containing 7 assertions. 0 failures, 0 errors."

node target/thread-test/all.js mmap-atom-e2e
# → "Ran 4 tests containing 10 assertions. 0 failures, 0 errors."
```

If ANY of these fail, stop and fix the regression before any other work.

```bash
# Also required:
node target/thread-test/all.js slab        # 40 tests, 464 assertions
node target/thread-test/all.js all         # 327 tests, 31114 assertions
node target/thread-test/all.js typed-array-sharing  # 5 tests, 11 assertions
```

---

## Forbidden Patterns (Never Introduce These)

### 1. The `.main` file does not exist

There is no `.main` file. There is no block descriptor table. There is no
status-mirror array, capacity-mirror array, WASM scratch region, or
`BD_ARRAY_START = 6168` constant. Any code that references `.main`, `open-eve-domain!`,
`join-eve-domain!`, `deref-domain-value`, `swap-domain!`, `BD_ARRAY_START`,
`BD_SIZE`, `STATUS_FREE`, `STATUS_ALLOCATED`, `STATUS_RETIRED`,
`OFFSET_ATOM_ROOT_DATA_DESC_IDX`, or any block-descriptor concept is **wrong**.

The cross-process atom files are: `.slab0`–`.slab5`, `.root`, `.rmap`.

### 2. Flat serialization is forbidden in `atom.cljc`

`atom.cljc` must not use `serialize-flat-element`, `value->eve-bytes`,
`eve-bytes->value`, or any of the flat tags `0xED` / `0xEE` / `0xEF`
for cross-process atom values. The B2 architecture stores HAMT nodes in slab
files with structural sharing.

### 3. SAB pointer tags (0x10–0x13) are SAB-only

Tags `0x10`–`0x13` are intra-process SAB pointers. They must never appear in
cross-process atom serialization.

---

## Invariants (Never Change Without Human Approval)

These byte offsets are shared between CLJS and JVM. Any change corrupts
data in existing mmap files and breaks cross-process interop.

### Slab header (per-slab file, byte offsets)
| Offset | Field |
|---|---|
| 0 | magic `0x534C4142` |
| 4 | block size |
| 8 | total blocks |
| 12 | free count (atomic) |
| 16 | alloc cursor |
| 20 | class index |
| 24 | bitmap offset |
| 28 | data offset |

Slab class sizes: `[32, 64, 128, 256, 512, 1024]` bytes.

If ANY of these change, update `doc/native-eve.md` Section 3 in a standalone commit
with human approval BEFORE changing any code.

---

## Protected Files

**Must not be deleted. Must not be modified without reading first.**

```
src/cljs_thread/eve/shared_atom.cljs
  — Legacy SAB-backed atom. NOT part of native-eve/perf work. Do not touch.

src/cljs_thread/eve/deftype_proto/alloc.cljs.bak
src/cljs_thread/eve/deftype_proto/data.cljs.bak
src/cljs_thread/eve/deftype_proto/serialize.cljs.bak
src/cljs_thread/eve/map.cljs.bak
src/cljs_thread/eve/vec.cljs.bak
src/cljs_thread/eve/set.cljs.bak
src/cljs_thread/eve/list.cljs.bak
  — Prior working implementations. Read before modifying the .cljc equivalent.
```

---

## Performance Optimization Rules

1. **Never break correctness for speed.** CAS semantics and epoch GC invariants
   must hold perfectly. All baseline tests must pass after every change.

2. **Measure before and after.** Every optimization must have benchmark numbers.
   "It should be faster" is not evidence.

3. **One file per commit. 150-line max diff.** Revert on failure.

4. **Research sub-agents are fine. Code writing in main session only.**

5. **Revert on failure. Never patch on top of a broken step.**

6. **Document everything.** Research in `doc/perf/<category>/research-pass-N.md`,
   implementation notes in `doc/perf/<category>/impl-pass-N.md`.

7. **Update tracking.** After benchmarks: update `bench-results.md` and the
   "Current State" section of `doc/perf-plan.md`.

---

## Build Commands

```bash
# Source environment (must be done in each shell session)
source scripts/ccweb-setup.sh

# Compile test bundles
shadow-compile thread-test       # → target/thread-test/all.js
shadow-compile bench-worker      # → target/thread-test/bench-worker.js
shadow-compile mmap-worker       # → target/thread-test/mmap-worker.js

# Run test suites
node target/thread-test/all.js <suite>
# Suites: all, core, slab, epoch-gc, obj, int-map, rb-tree, batch2, batch3,
#          batch4, typed-array, typed-array-sharing, mem, mmap, mmap-slab,
#          mmap-atom, mmap-atom-e2e

# Run benchmarks
clojure -M:jvm-test -n cljs-thread.eve.bench-test

# Run JVM tests
clojure -M:jvm-test
# Expected: ≤1 failure (yields?-test, pre-existing), 0 errors

# Build native addon (already built — only if mmap_cas.cc changes)
npm run build:addon
```

---

## Namespace Map

| Namespace | File | Purpose |
|---|---|---|
| `cljs-thread.eve.atom` | `src/cljs_thread/eve/atom.cljc` | Cross-process mmap atom (B2) |
| `cljs-thread.eve.mem` | `src/cljs_thread/eve/mem.cljc` | IMemRegion protocol + JVM serialization |
| `cljs-thread.eve.deftype-proto.alloc` | `src/cljs_thread/eve/deftype_proto/alloc.cljc` | Slab allocator, ISlabIO |
| `cljs-thread.eve.deftype-proto.data` | `src/cljs_thread/eve/deftype_proto/data.cljc` | Slab constants, header layout |
| `cljs-thread.eve.deftype-proto.serialize` | `src/cljs_thread/eve/deftype_proto/serialize.cljc` | CLJS serializer |
| `cljs-thread.eve.map` | `src/cljs_thread/eve/map.cljc` | Eve HAMT map |
| `cljs-thread.eve.vec` | `src/cljs_thread/eve/vec.cljc` | Eve persistent vector |
| `cljs-thread.eve.set` | `src/cljs_thread/eve/set.cljc` | Eve persistent set |
| `cljs-thread.eve.list` | `src/cljs_thread/eve/list.cljc` | Eve persistent list |
| `cljs-thread.eve.shared-atom` | `src/cljs_thread/eve/shared_atom.cljs` | Legacy SAB atom (DO NOT TOUCH) |
| native | `native/mmap_cas.cc` | C++ addon: mmap, atomic ops, futex |
