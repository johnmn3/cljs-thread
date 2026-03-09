# P6 Slab Allocation — Implementation Pass 1

## OBJ-6: Bitmap Scan Start Optimization

### Status: FAILED — No measurable impact. Changes reverted.

**Future agents: Do not re-attempt this optimization.** The theoretical savings
(~1.6μs per allocation) are 3-4 orders of magnitude smaller than total swap cost
(14-77ms). Bitmap scanning is not a bottleneck in the current architecture.

### What Was Tried

#### 1. alloc.cljc — JVM cursor tracking (25 lines changed)

Added `^ints alloc-cursors` field to `JvmSlabCtx`. Changed `-sio-alloc!` bitmap
scan start from hardcoded `0` to cursor position. After successful allocation,
cursor advances to `(inc candidate)`. On free, cursor backtracks if the freed
block index is less than the current cursor.

**Result:** No measurable improvement. The O(n) → O(1) amortized scan start
saves ~16 bitmap word loads per allocation, but at ~100ns per load this is
~1.6μs — invisible against 14-77ms swap costs dominated by serialization,
HAMT traversal, and mmap I/O.

#### 2. mem.cljc — JVM bit-scan acceleration (11 lines changed)

Replaced 32-iteration bit-by-bit loop in `imr-bitmap-find-free` with
`Integer/numberOfTrailingZeros` on JVM (single CPU instruction via TZCNT/BSF).

**Result:** No measurable improvement. Saves ~15ns per bitmap word, but each
allocation only scans a few words. Total savings per alloc: ~50ns.

#### 3. CLJS cursor backtracking — prototyped and reverted

Attempted cursor backtracking on free in CLJS path. Caused
`typed-array-accumulate-test` to fail with DOUBLE-ALLOC errors. Root cause:
the pool system holds blocks with bitmap bit=1 that aren't in
`alloc-debug-set`. When cursor backtracks, `batch-alloc` re-discovers pooled
blocks at lower positions, triggering false DOUBLE-ALLOC detection.

**Result:** Fundamentally incompatible with the pool/debug-set architecture.

### Benchmark Results (all within noise)

Environment: Shared container, ~10-15% run-to-run variance.

| Benchmark | Keys | Baseline ms/swap | Post ms/swap | Note |
|-----------|------|-----------------|-------------|------|
| B2 | 100 | 13.80 | 15.67 | Within noise |
| B2 | 500 | 40.81 | 46.49 | Within noise |
| B2 | 1000 | 77.03 | 89.35 | Within noise |
| B4 | 100 | 6.44 | 6.79 | Within noise |
| B4 | 500 | 17.27 | 19.55 | Within noise |
| B4 | 1000 | 33.76 | 39.31 | Within noise |

Multiple A/B runs confirmed ~10-15% variance between identical configurations,
confirming no real signal from the optimization.

### Why This Failed

The allocation hot path cost breakdown (approximate, per swap):
- Serialization + HAMT traversal: 10-70ms (99%+ of cost)
- Bitmap scanning: ~5-50μs (<0.1% of cost)

Optimizing bitmap scan start from O(n) to O(1) saves microseconds in a
millisecond-scale operation. To meaningfully improve B2/B4, focus on
serialization (P5), HAMT node operations (P2), or epoch GC (P7) instead.

### Test Results (before revert)

All 327 CLJS tests passed (0 failures, 0 errors). The changes were correct
but ineffective.
