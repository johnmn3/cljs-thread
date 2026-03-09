# P5 Serialization — Research Pass 1

## OBJ-3: Keyword Serialization Cache Improvements — DEAD END

> **Outcome:** Implemented generational cache, A/B tested, no measurable
> improvement. The premise was wrong: HAMT structural sharing limits per-swap
> keyword re-serialization to ~5-10 keywords, making the cache eviction
> strategy irrelevant. See `impl-pass-1.md` for full benchmark data.

### Problem

Both keyword caches use full-eviction strategy (`.clear()` on the entire `js/Map`):

1. **Serialization cache** (`keyword-cache`): Max 2048 entries, keyed by keyword
   reference (O(1) via interning). On overflow, entire map cleared.
2. **Deserialization cache** (`kw-deser-cache`): Max 16384 entries, keyed by SAB
   data offset (integer). On overflow, entire map cleared.

When `.clear()` fires, the next operations see 100% cache misses, causing a
latency spike. For the ser cache with a 100-key map, eviction triggers every
~20 swaps when unique keywords accumulate beyond 2048.

### Approaches Evaluated

1. **True LRU (doubly-linked list + Map):** Complex in CLJS, per-lookup pointer
   maintenance overhead. JS has no built-in LRU. Rejected — overhead too high
   for a hot path.

2. **FIFO trim (delete oldest N entries):** Uses `js/Map` insertion order to
   delete oldest 50%. Problem: oldest entries in the ser cache are often the
   *hottest* (first-encountered common keywords like `:name`, `:id`). Would
   evict the most valuable entries. Rejected for ser cache; viable for deser
   cache but not as clean as generational.

3. **Generational two-map cache:** Two Maps (young + old). On overflow, old is
   discarded, young becomes old, fresh young created. Hot entries in old are
   promoted to young on access. Near-zero overhead on hits (single Map.get),
   and hot entries survive eviction naturally. **Selected.**

4. **Random eviction:** Hard to implement efficiently with `js/Map`. Rejected.

### Why Generational

- **Cache hit (young):** 1 `Map.get` — same cost as current implementation
- **Cache hit (old):** 2 `Map.get` + 1 `Map.set` — rare, only after rotation
- **Cache miss:** Same cost as current, plus O(1) rotation when full
- **No latency spike:** Hot keywords survive in old generation and get promoted
- **Memory:** At most 2x cache entries (young + old), bounded by MAX constants
- **Correctness:** Keyword interning guarantees reference equality for ser cache;
  integer offset keys are trivially correct for deser cache

### Key Insight: Deser Cache Staleness

The deser cache is keyed by SAB offsets. When HAMT nodes are retired and
reallocated, old offsets become stale. Full eviction handled this implicitly.
With generational eviction, stale entries persist slightly longer (up to 2
rotations) but are harmless — they just waste cache slots, and the cache is
bounded. Stale entries won't be accessed (the offsets won't appear in new HAMT
nodes) and will be discarded when their generation rotates out.
