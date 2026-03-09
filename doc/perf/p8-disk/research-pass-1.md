# P8 Disk Footprint — Research Pass 1

## Problem

All 6 slab files (.slab0–.slab5) are pre-allocated at full capacity:

| Class | Block Size | Default Capacity | File Size |
|-------|-----------|-----------------|-----------|
| 0     | 32B       | 32 MB           | ~32 MB    |
| 1     | 64B       | 64 MB           | ~64 MB    |
| 2     | 128B      | 64 MB           | ~64 MB    |
| 3     | 256B      | 32 MB           | ~32 MB    |
| 4     | 512B      | 16 MB           | ~16 MB    |
| 5     | 1024B     | 16 MB           | ~16 MB    |
| **Total** |       |                 | **~224 MB** |

A 100-key atom with 500-char values needs ~70KB logical → 3,365x overhead.

## Architecture Analysis

### File creation flow (CLJS)
1. `persistent-atom` → `cljs-open-mmap-domain!` → `init-mmap-slab!` per class
2. `init-mmap-slab!` calls `d/default-capacity-for-class` → full capacity
3. `d/slab-layout(block-size, capacity)` → computes total-bytes
4. `mem/open-mmap-region(path, total-bytes)` → native addon `open()`
5. Native `Open()`: `ftruncate(fd, size)` + `mmap(MAP_SHARED)` → full-size file

### File creation flow (JVM)
1. `persistent-atom` → `jvm-open-mmap-domain!`
2. Computes layout per class using `d/default-capacity-for-class`
3. `mem/open-mmap-region` → `RandomAccessFile.setLength` + `FileChannel.map`

### Joiner flow
- CLJS: `open-mmap-slab!` peeks 64-byte header → reads total_blocks → maps full
- JVM: `jvm-join-mmap-domain!` peeks 64-byte header → reads total_blocks → maps full
- Both already handle arbitrary file sizes by reading the header first

### Allocation failure
- CLJS `alloc()`: returns `{:error :out-of-memory}` when bitmap scan wraps fully
- JVM `JvmSlabCtx/-sio-alloc!`: throws `"JvmSlabCtx: out of memory"`

## Implementation Plan

### Approach: Start Small + Grow via Re-open

No mremap needed. Simply:
1. Start with small initial capacities (224KB total vs 224MB)
2. When allocation fails, double the file and re-map
3. `open-mmap-region(path, new_size)` already handles ftruncate-to-grow
4. Re-register slab instance with new region

### Why this works without mremap
- `open()` in mmap_cas.cc already does ftruncate only if file is smaller
- Creating a new mapping of the same file sees all existing data
- Old mapping is cleaned up by GC (MmapDeleter calls munmap)
- Single-threaded Node.js means no concurrent growth issues within process
- Header total_blocks tells joiners the actual size

### Changes needed

1. **data.cljc**: Add `SLAB_CLASS_INITIAL_CAPACITIES`, `initial-capacity-for-class`
2. **alloc.cljc**: Store paths, add `grow-mmap-slab!`, retry alloc after grow
3. **atom.cljc**: Default to initial capacities in domain open functions
4. **JVM side**: Growth in JvmSlabCtx by replacing region in arrays

### Growth policy
- Double capacity on each growth, capped at max (current defaults)
- Growth granularity: always double (simple, predictable)
- New bitmap bits are 0 (free) from ftruncate zeroing

### Cross-process coordination
- Creator grows file + updates header total_blocks
- Joiner sees stale total_blocks → re-opens at header's total_blocks
- No lock needed: only creator grows, joiner detects via header read
