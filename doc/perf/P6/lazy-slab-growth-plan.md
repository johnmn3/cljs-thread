# Lazy Slab Growth: Separate Bitmap and Data Files

## Problem

The current slab layout puts bitmap and data in one file:

```
.slab0: [hdr:64B] [bitmap: sized for MAX capacity] [data: grows lazily]
```

`data_offset` is computed from max capacity and baked into the header at init.
At 1 GB max, the bitmap region is ~4 MB per class (~7 MB total). Raising to
16 GB would make it ~64 MB per class (~126 MB total). Even though the bitmap
pages are sparse on Linux/macOS, they count against vm.overcommit budget and
inflate the mmap region size.

## Solution

Separate bitmap and data into independent files per slab class:

```
.slab0:     [hdr:64B] [data blocks...]    ← block N = SLAB_HEADER_SIZE + N * block_size
.slab0.bm:  [bitmap bits...]             ← bit N = N / 8
```

Both start small and grow independently via ftruncate. No max-capacity
reservation needed. `data_offset` becomes a constant (`SLAB_HEADER_SIZE = 64`).

## Files to Change

### Step 1: `data.cljc` — Layout constants and helpers

- Add `SLAB_DATA_FILE_SUFFIX` (`.slab`) and `SLAB_BITMAP_FILE_SUFFIX` (`.slab.bm`)
  path helper functions: `slab-data-path`, `slab-bitmap-path`
- Modify `slab-layout` to return a split layout:
  - `{:data-offset SLAB_HEADER_SIZE, :data-bytes (+ SLAB_HEADER_SIZE (* total-blocks block-size)), :bitmap-bytes (bitmap-byte-size total-blocks), :total-blocks total-blocks}`
- Remove `MMAP_SLAB_CLASS_CAPACITIES` and `mmap-capacity-for-class` (no longer
  needed — growth is unbounded up to u29 max)
- Keep `SLAB_HDR_BITMAP_OFFSET` and `SLAB_HDR_DATA_OFFSET` in the header for
  backward compat / SAB slabs, but mmap slabs will write constant values
  (bitmap-offset=0, data-offset=64)

**~30 lines changed.**

### Step 2: `wasm.cljs` — Dual-region slab instances

- Add `:bitmap-region` field to mmap slab instances
- `register-mmap-slab-instance!` takes two args: `data-region`, `bitmap-region`
- Bitmap ops (`bitmap-find-free`, `bitmap-alloc-cas!`, `bitmap-free!`,
  `bitmap-count-free`) use `(:bitmap-region inst)` when present,
  fall back to `(:region inst)` for SAB slabs
- Data views (`:u8`, `:dv`) still come from `data-region`

**~25 lines changed.**

### Step 3: `alloc.cljc` — CLJS mmap slab lifecycle

Module-level state:
- Add `slab-bitmap-regions` array (7 slots, parallel to existing arrays)
- `slab-bitmap-offsets` becomes constant 0 for mmap slabs
- `slab-data-offsets` becomes constant `SLAB_HEADER_SIZE` for mmap slabs
- Add `slab-bitmap-paths` array for bitmap file paths

Functions:

**`init-mmap-slab!`** — Create two files instead of one:
- Data file: `{base}.slab{i}` — header + initial data blocks
  - Header writes `data-offset = SLAB_HEADER_SIZE`, `bitmap-offset = 0`
- Bitmap file: `{base}.slab{i}.bm` — just the bitmap, sized for initial blocks
- Register both regions via updated `register-mmap-slab-instance!`

**`open-mmap-slab!`** — Open two files:
- Peek data file header for total-blocks, block-size
- Open data file at `SLAB_HEADER_SIZE + total-blocks * block-size`
- Open bitmap file at `bitmap-byte-size(total-blocks)`
- Cache both regions

**`grow-mmap-slab!`** — Grow both files:
- CAS on total_blocks in data file header (leader election, unchanged)
- Leader: ftruncate data file to new size, ftruncate bitmap file to new bitmap size
- All: re-mmap both files at new sizes
- Register updated regions

**`slab-offset->byte-offset`** — Simplifies:
- `SLAB_HEADER_SIZE + block-idx * block-size` (no per-class data-offset lookup)

**`alloc-from-slab`** — bitmap ops use bitmap region:
- `wasm/bitmap-find-free` and `wasm/bitmap-alloc-cas!` already get `bm-byte-offset`
  which becomes 0. The wasm module needs to reference the bitmap region.
  Actually, since mmap slabs don't use WASM (`:exports` is nil), they go through
  the `mem/imr-bitmap-*` fallback which takes an explicit region arg. So the
  change is: pass `(:bitmap-region inst)` instead of `(:region inst)`.

**`free!`** — Same pattern: bitmap ops use bitmap region.

**~80 lines changed.**

### Step 4: `alloc.cljc` — JVM `JvmSlabCtx`

- Add `^objects bitmap-regions` field to `JvmSlabCtx` deftype
- `make-jvm-slab-ctx` takes `bitmap-regions-vec` in addition to `regions-vec`
- All ISlabIO read/write methods: unchanged! They use `(aget regions class-idx)`
  which is now the data-only region. The `data-offsets` array entries become
  `SLAB_HEADER_SIZE` (constant 64).
- `-sio-alloc!` bitmap ops: use `(aget bitmap-regions ci)` with `bm-off = 0`
- `-sio-free!` bitmap ops: use `(aget bitmap-regions ci)` with `bm-off = 0`
- `grow!`: grow both files, re-mmap both, update both region arrays
- `refresh-jvm-slab-regions!`: refresh both

**~50 lines changed.**

### Step 5: `atom.cljc` — Domain open/join

**CLJS `cljs-open-mmap-domain!`:**
- `init-mmap-slab!` already handles two-file creation (from step 3)
- No path construction changes needed (init-mmap-slab! handles `.bm` suffix)

**CLJS `cljs-join-mmap-domain!`:**
- `open-mmap-slab!` already handles two-file opening (from step 3)

**JVM `jvm-open-mmap-domain!`:**
- Create data region + bitmap region per class
- Write headers with `data-offset = SLAB_HEADER_SIZE`, `bitmap-offset = 0`
- Pass both region vectors to `make-jvm-slab-ctx`

**JVM `jvm-join-mmap-domain!`:**
- Open data file + bitmap file per class
- Pass both region vectors to `make-jvm-slab-ctx`

**~40 lines changed.**

### Step 6: `mem.cljc` — No changes needed

The `imr-bitmap-*` functions take an explicit `region` and `bm-byte-offset`.
They'll now receive the bitmap region with offset 0. No code changes.

## What Doesn't Change

- Slab-qualified offset encoding (u29: class_idx + block_idx) — identical
- SAB (in-process) slabs — keep combined layout, no files involved
- Coalesc slab (`.slab6`) — different allocator, not bitmap-based
- `.root` and `.rmap` files — control plane, unrelated
- Native addon (`mmap_cas.cc`) — operates on byte offsets, agnostic to files
- WASM SIMD bitmap scan — SAB-only path, unchanged

## Migration / Backward Compatibility

This is a breaking change to the on-disk format. Existing `.slab0`–`.slab5`
files with embedded bitmaps won't work with the new code. This is acceptable
because:

1. The mmap atom system is pre-release (no production data to migrate)
2. Old files are trivially detected (data-offset > 64 in header)
3. A migration tool could be written if needed (read old layout, write new)

## Execution Order

1. `data.cljc` — path helpers, updated `slab-layout` (foundation)
2. `wasm.cljs` — dual-region instance support (CLJS bitmap plumbing)
3. `alloc.cljc` CLJS section — init/open/grow with two files
4. `alloc.cljc` JVM section — JvmSlabCtx with bitmap-regions
5. `atom.cljc` — domain open/join passes two region sets
6. Test: full green baseline

Each step is one commit. Revert on failure.

## Total Estimated Diff

~225 lines across 4 files. No new files (except the `.bm` files created at runtime).
