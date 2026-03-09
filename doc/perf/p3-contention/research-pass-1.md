# P3 Contention: OBJ-4 Research — CAS Retry Backoff

## Problem

The cross-process atom's CAS retry loop immediately retries on failure.
Under high contention (8+ writers), all failed writers retry simultaneously,
creating a thundering herd that wastes CPU and increases failure rate.

## Analysis

### CAS loop structure (CLJS path, atom.cljc:292-352)

Each CAS iteration:
1. Pin epoch (~0.5μs native call)
2. Load root pointer (~0.5μs)
3. Deserialize old value (lazy — near zero for CLJS)
4. Apply user function (varies: ~0.05ms counter increment, ~0.5ms map assoc)
5. Resolve new pointer / serialize (most expensive for new allocations)
6. CAS on root pointer (~0.5μs)
7. On failure: free all new allocations, loop immediately

### Contention dynamics (from B7 benchmark data)

| Writers | Throughput (swaps/s) | Effective attempts/success |
|---------|---------------------|---------------------------|
| 1       | ~2,035              | 1.0                       |
| 4       | ~1,887              | ~1.1                      |
| 8       | ~979                | ~2.1                      |
| 16      | ~475                | ~4.3                      |

### Key findings

1. **Atomic.wait precision**: CLJS `Atomics.wait` has integer ms granularity,
   so the minimum meaningful sleep is 1ms. This is appropriate for larger
   swaps but oversized for micro-swaps (counter increment ~0.05ms).

2. **CPU-limited environments**: In containers with few cores, the OS already
   serializes writer execution. Backoff helps less here vs. many-core machines
   where all writers truly run simultaneously.

3. **Fast vs slow swaps**: Counter increment takes ~0.05ms per iteration,
   while a 100-key map assoc takes ~0.5ms. A 1ms backoff is 20x the swap
   time for counters but only 2x for maps. The backoff threshold must
   accommodate both.

4. **TDCAS considered but rejected**: Re-checking root before function
   application adds ~0.5μs overhead on every swap (even uncontended),
   violating the zero-overhead constraint.

## Chosen approach

Jittered exponential backoff with a **high attempt threshold** (> 3 failures):
- Attempts 0-3: immediate retry (zero overhead for low contention)
- Attempt 4: 1ms wait
- Attempt 5: 1-2ms wait
- Attempt 6: 1-4ms wait
- Attempt 7+: 1-8ms wait (capped)

CLJS: `Atomics.wait` on a dedicated 4-byte SharedArrayBuffer
JVM: `LockSupport/parkNanos` for sub-ms precision
