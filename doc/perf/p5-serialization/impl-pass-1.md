# P5 Serialization — Implementation Pass 1

## OBJ-3: Generational Keyword Cache Eviction — FAILED, REVERTED

> **Status:** Code reverted. This optimization produced no measurable improvement.
> Future agents: do not re-attempt keyword cache eviction improvements. The
> keyword serialization cache is not a performance bottleneck. See "Why No
> Measurable Improvement" below for the analysis.

### Changes (serialize.cljc only, 47 insertions / 27 deletions)

1. **Serialization cache:** Replaced single `keyword-cache` (js/Map) with two
   mutable vars `kw-ser-young` + `kw-ser-old`. On overflow of young (>= 2048),
   old is replaced by young and a fresh young is created. Lookup checks young
   first, then promotes from old on hit.

2. **Deserialization cache:** Replaced single `kw-deser-cache` (js/Map) with
   `kw-deser-young` + `kw-deser-old`. Same generational pattern. Extracted
   helper functions `kw-deser-cache-get` and `kw-deser-cache-put!` to reduce
   code duplication across the 4 keyword tag handlers.

3. **`clear-deser-caches!`:** Updated to reset both generations.

### Behavioral Change

- **Before:** Cache eviction is all-or-nothing. Every 2048 ser entries or
  16384 deser entries, the entire cache is cleared. Next N operations (where
  N = number of unique keywords in working set) are all cold misses.

- **After:** On overflow, only the old generation is discarded. Frequently-used
  keywords that were in old get promoted to young on next access. Only keywords
  that haven't been accessed since the *previous* rotation are lost.

### Expected Impact

- **Steady-state (< 2048 unique keywords):** Zero change — young cache holds
  everything, old is never consulted.
- **Overflow workloads (> 2048 unique keywords):** Hot keyword set survives
  eviction via promotion. Eliminates the latency spike where 100% of the
  working set was cache-cold after eviction.
- **Tail latency (B14):** Reduced p95/p99 spikes during sustained writes with
  large keyword vocabularies.

### Test Results

All green baseline tests pass:
- `all`: 327 tests, 31114 assertions, 0 failures, 0 errors
- Individual suites: epoch-gc, obj, rb-tree, int-map, batch2-4, typed-array,
  mem, slab, typed-array-sharing, mmap, mmap-slab, mmap-atom, mmap-atom-e2e — all pass

### Benchmark Results (2 runs averaged)

Standard benchmarks (B3/B4/B14) use 100-1000 unique keywords, which is below
the 2048 serialization cache threshold. The cache never fills, so eviction
never triggers and the generational cache has **zero measurable impact** on
these workloads — as expected.

| Benchmark | Before (ms/swap) | After (ms/swap) | Change |
|-----------|-----------------|-----------------|--------|
| B3 flat   | 2.78            | 2.79            | ~0%    |
| B3 nested | 19.97           | 19.93           | ~0%    |
| B3 rich   | 82.92           | 80.69           | ~0%    |
| B4 100    | 5.48            | 5.37            | ~0%    |
| B4 500    | 13.74           | 13.34           | ~0%    |
| B4 1000   | 27.46           | 26.46           | ~0%    |

All within JVM/system noise. No regression.

### B15: Targeted Cache Eviction Benchmark (2 runs averaged)

Custom benchmark `B15-kw-cache-eviction` (added to bench_test.clj):
- Pre-fills atom with N unique keywords (2500 or 4000, exceeding the 2048 cache limit)
- Then measures 500 swaps that mix 70% hot-key reuse with 30% new-key churn
- Runs via Node.js bench-worker to exercise the CLJS serialization path

| Pre-fill | Strategy     | p50 (ms) | p95 (ms) | p99 (ms) | max (ms) |
|----------|-------------|----------|----------|----------|----------|
| 2500     | Full evict  | 0.063    | 0.106    | 0.162    | 0.62     |
| 2500     | Generational| 0.062    | 0.107    | 0.160    | 0.81     |
| 4000     | Full evict  | 0.062    | 0.110    | 0.184    | 0.70     |
| 4000     | Generational| 0.061    | 0.107    | 0.174    | 0.91     |

**Result:** No measurable difference. All within system noise.

### Why No Measurable Improvement

HAMT structural sharing means a single `swap!` only re-serializes the changed
path (~5-10 keywords out of thousands). The keyword serialization cache saves a
`TextEncoder.encode()` call per cached keyword — roughly 0.1-0.5μs per hit.
Even during a full eviction event, the extra cost is ~5μs, which is <10% of
the total swap time (~60μs for CAS + HAMT allocation + SAB writes). This
signal is completely drowned out by variance from other sources.

The generational cache is algorithmically superior (no full working-set loss
on eviction) with zero overhead in the common case. It is a strictly better
eviction policy, but the keyword serialization cache is not a performance
bottleneck at the swap level, so the improvement is unmeasurable.
