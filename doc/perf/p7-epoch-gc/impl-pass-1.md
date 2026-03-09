# P7 Epoch GC — Pass 1 Implementation (OBJ-1)

## Change: Time-throttled retire flush batching

**File:** `src/cljs_thread/eve/atom.cljc`

### Problem

`mmap-min-safe-epoch` scans 256 worker slots (loading status + epoch + heartbeat
per slot via native addon calls) on **every swap**. In the common single-writer
scenario, most slots are INACTIVE, but the scan still performs 500+ N-API
boundary crossings per swap.

### Solution

Instead of caching the scan result (which has correctness risks — a stale nil
could cause freeing blocks a concurrent reader is still using), we **throttle
the entire flush call**. The scan + flush only runs when:

1. At least 50ms has elapsed since the last flush, OR
2. The retire queue has grown past 64 entries

Between flushes, retire entries accumulate in the queue. This is safe because
we only **delay** freeing — never free too early. The queue is bounded by
the threshold check.

### Implementation

- Added `FLUSH_INTERVAL_MS = 50` and `FLUSH_QUEUE_THRESHOLD = 64` constants
- Added `:flush-ts` to domain-state (JS array on CLJS, volatile on JVM)
- Modified `cljs-try-flush-retires!` and `jvm-try-flush-retires!` to check
  time/queue-size before scanning

### Results

| Benchmark | Before | After | Change |
|-----------|--------|-------|--------|
| B9 Node ops/s | 7,785 | 11,849 | **+52.2%** |
| B2 JVM 100-key ops/s | 100.7 | 111.6 | **+10.8%** |
| B2 JVM 500-key ops/s | 34.0 | 40.5 | **+19.1%** |
| B2 JVM 1000-key ops/s | 17.8 | 21.7 | **+21.9%** |
| B12 ms/swap | 5.15 | 4.05 | **-21.4%** |
| B14 Node p50 | 0.10ms | 0.047ms | **-53%** |

Disk growth remains 0 MB — epoch GC correctness maintained.
