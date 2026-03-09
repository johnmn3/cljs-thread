# P6 Slab Allocation — Research Pass 1

## OBJ-6: Bitmap Scan Start Optimization

### Status: FAILED — Do not re-attempt.

This optimization was implemented and benchmarked. No measurable improvement.
Bitmap scanning accounts for <0.1% of swap cost. See `impl-pass-1.md` for
full results and analysis of why this approach is a dead end.

### Problem Analysis

The slab allocator bitmap scan has two platform-specific inefficiencies:

**JVM (`JvmSlabCtx.-sio-alloc!`):**
- Always starts scanning from bit 0 — no cursor at all
- Every allocation re-scans from the beginning of the bitmap
- For a 1M-block slab after 500 sequential allocs, each alloc scans ~500 words
  before finding a free block (O(n) per alloc → O(n²) total)

**JVM (`imr-bitmap-find-free` in mem.cljc):**
- Uses a 32-iteration loop to find the trailing zero in a bitmap word
- `Integer.numberOfTrailingZeros` is a single CPU instruction (TZCNT/BSF)
  but the code uses a manual bit-by-bit scan

**CLJS (`alloc` in alloc.cljc CLJS section):**
- Has a cursor, but never backtracks on free — after epoch GC frees blocks
  at lower indices, the cursor is past them and must wrap around
- WASM SIMD bitmap scan is fast enough that the wrap-around cost is moderate
- Cursor backtracking was attempted but conflicts with the pool system's
  `alloc-debug-set` tracking (blocks pooled but not freed from bitmap cause
  false DOUBLE-ALLOC errors when cursor re-discovers them)

### Allocation Pattern Analysis (B2: 100-key map, 200 swaps)

Each swap! on a 100-key HAMT map:
- Path-copies ~3-4 HAMT nodes (O(log32 100) = 2 levels)
- Allocates 3-4 blocks per swap
- Epoch GC frees ~3-4 old blocks per swap
- Total: ~600-800 allocs + ~600-800 frees over 200 swaps

Without cursor (JVM baseline):
- Alloc 0: scans 0 words (finds block 0 immediately)
- Alloc 100: scans ~100 words (3 words = ~100 bits)
- Alloc 500: scans ~500 words (16 words)
- Average scan: ~250 words ≈ 8K blocks checked per alloc

With cursor:
- Each alloc starts from where the last one left off
- Average scan: 1-2 words (finds free block in first 64 bits)
- After GC frees blocks: cursor backtracks, finds them immediately

### Approach Chosen

1. **JVM cursor tracking** — Add `alloc-cursors` int array to `JvmSlabCtx`.
   Start scan from cursor position (not 0). Advance cursor after successful
   alloc. Backtrack cursor on free.

2. **JVM bit-scan acceleration** — Replace 32-iteration bit loop in
   `imr-bitmap-find-free` with `Integer/numberOfTrailingZeros` (single
   CPU instruction on x86/ARM).

3. **CLJS cursor backtrack NOT implemented** — The CLJS pool system's
   debug tracking (`alloc-debug-set`) conflicts with cursor backtracking.
   Pooled blocks have bitmap bit=1 but aren't tracked in the debug set;
   when cursor backtracks and batch-alloc re-discovers them, false
   DOUBLE-ALLOC errors occur. CLJS already uses WASM SIMD for fast bitmap
   scanning, making the wrap-around cost minimal.

### Expected Impact (proved wrong — see impl-pass-1.md)

- JVM B2/B4: Expected 5-15% improvement — actual: 0% (within noise)
- JVM `numberOfTrailingZeros`: Expected measurable gain — actual: ~50ns/alloc, invisible
- CLJS cursor backtrack: Incompatible with pool/debug-set architecture
- Root cause of failure: bitmap scan is <0.1% of swap cost
