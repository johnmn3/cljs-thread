(module
  ;; ═══════════════════════════════════════════════════════════════════════════
  ;; SLAB BITMAP ALLOCATOR — WASM + SIMD
  ;; ═══════════════════════════════════════════════════════════════════════════
  ;;
  ;; This module operates on a single slab's SharedArrayBuffer.
  ;; Each slab is a separate WebAssembly.Memory instance, imported here.
  ;; The bitmap region is a packed bit array: 0=free, 1=allocated.
  ;;
  ;; The caller instantiates one WASM module per slab SAB and passes
  ;; the slab's memory as the import. This way each slab gets its own
  ;; WASM instance with direct access to its memory.
  ;;
  ;; KEY FUNCTIONS:
  ;;   bitmap_find_free_simd  — SIMD scan: 128 blocks per v128 iteration
  ;;   bitmap_find_free       — scalar fallback: 32 blocks per i32 iteration
  ;;   bitmap_alloc_cas       — atomic CAS to claim a free bit
  ;;   bitmap_free            — atomic clear a bit (free a block)
  ;;   bitmap_count_free_simd — SIMD popcount: count free blocks in range
  ;; ═══════════════════════════════════════════════════════════════════════════

  (import "env" "memory" (memory 1 16384 shared))

  ;; =========================================================================
  ;; bitmap_find_free — Scalar scan for first free bit (0-bit)
  ;; =========================================================================
  ;; Scans bitmap starting at bit `start_bit` for up to `total_blocks` bits.
  ;; Returns the bit index of the first free block, or -1 if none found.
  ;;
  ;; Algorithm: Load 32 bits at a time, invert (~word), ctz to find first 0.
  ;; When start_bit is not word-aligned, mask out bits below start_bit.
  ;;
  ;; Params:
  ;;   $bm_offset  — byte offset of bitmap region in memory
  ;;   $total_bits — total number of blocks (bits) in this slab
  ;;   $start_bit  — bit index to start scanning from
  ;; Returns: bit index of first free block, or -1
  (func $bitmap_find_free (export "bitmap_find_free")
        (param $bm_offset i32) (param $total_bits i32) (param $start_bit i32)
        (result i32)
    (local $word_idx i32)      ;; current 32-bit word index
    (local $bit_in_word i32)   ;; starting bit within first word
    (local $word_count i32)    ;; total words in bitmap
    (local $word i32)          ;; loaded word value
    (local $inverted i32)      ;; ~word (free bits become 1)
    (local $bit_pos i32)       ;; ctz result
    (local $abs_bit i32)       ;; absolute bit index

    ;; word_idx = start_bit / 32
    (local.set $word_idx (i32.shr_u (local.get $start_bit) (i32.const 5)))
    ;; bit_in_word = start_bit % 32
    (local.set $bit_in_word (i32.and (local.get $start_bit) (i32.const 31)))
    ;; word_count = ceil(total_bits / 32)
    (local.set $word_count
      (i32.shr_u (i32.add (local.get $total_bits) (i32.const 31)) (i32.const 5)))

    (block $not_found
      (loop $next_word
        ;; if word_idx >= word_count, not found
        (br_if $not_found
          (i32.ge_u (local.get $word_idx) (local.get $word_count)))

        ;; Load the word atomically (i32.atomic.load)
        (local.set $word
          (i32.atomic.load
            (i32.add (local.get $bm_offset)
                     (i32.shl (local.get $word_idx) (i32.const 2)))))

        ;; Invert: free bits (0) become 1
        (local.set $inverted (i32.xor (local.get $word) (i32.const -1)))

        ;; If starting mid-word, mask out bits below start position
        (if (local.get $bit_in_word)
          (then
            (local.set $inverted
              (i32.and (local.get $inverted)
                       ;; mask: bits >= bit_in_word are 1
                       (i32.shl (i32.const -1) (local.get $bit_in_word))))
            ;; Only apply mask on the first word
            (local.set $bit_in_word (i32.const 0))))

        ;; If inverted is non-zero, there's a free bit
        (if (local.get $inverted)
          (then
            (local.set $bit_pos (i32.ctz (local.get $inverted)))
            (local.set $abs_bit
              (i32.add (i32.shl (local.get $word_idx) (i32.const 5))
                       (local.get $bit_pos)))
            ;; Bounds check
            (if (i32.lt_u (local.get $abs_bit) (local.get $total_bits))
              (then (return (local.get $abs_bit))))))

        ;; Next word
        (local.set $word_idx (i32.add (local.get $word_idx) (i32.const 1)))
        (br $next_word)))

    ;; Not found
    (i32.const -1))

  ;; =========================================================================
  ;; bitmap_find_free_simd — SIMD scan for first free bit
  ;; =========================================================================
  ;; Scans 128 bits (16 bytes = 4 i32 words) per v128 iteration.
  ;; Falls back to scalar for the tail (< 16 bytes).
  ;;
  ;; Algorithm:
  ;;   v128.load → v128.not → check if any byte non-zero via i8x16.bitmask
  ;;   If non-zero, find which lane has a free bit via i32x4 extraction + ctz.
  ;;
  ;; Params:
  ;;   $bm_offset  — byte offset of bitmap in memory
  ;;   $total_bits — total blocks in slab
  ;;   $start_bit  — bit to start scanning from (should be 128-aligned for perf)
  ;; Returns: bit index of first free block, or -1
  (func $bitmap_find_free_simd (export "bitmap_find_free_simd")
        (param $bm_offset i32) (param $total_bits i32) (param $start_bit i32)
        (result i32)
    (local $byte_offset i32)    ;; current byte offset in bitmap
    (local $bm_byte_size i32)   ;; total bitmap bytes
    (local $vec v128)           ;; loaded 16 bytes
    (local $inv v128)           ;; inverted (free=1)
    (local $mask i32)           ;; i8x16 bitmask of non-zero bytes
    (local $lane_idx i32)       ;; which byte has first free bit
    (local $lane_word i32)      ;; the i32 word containing the free bit
    (local $bit_in_lane i32)    ;; ctz within the lane word
    (local $abs_bit i32)        ;; absolute bit index
    (local $all_ones v128)      ;; constant: all 0xFF

    ;; Align start_bit down to 128-bit boundary for SIMD
    ;; byte_offset = (start_bit / 8) & ~15  (align to 16 bytes)
    (local.set $byte_offset
      (i32.and (i32.shr_u (local.get $start_bit) (i32.const 3))
               (i32.const -16)))

    ;; bm_byte_size = ceil(total_bits / 8)
    (local.set $bm_byte_size
      (i32.shr_u (i32.add (local.get $total_bits) (i32.const 7)) (i32.const 3)))

    ;; all_ones = splat(0xFF)
    (local.set $all_ones (i8x16.splat (i32.const -1)))

    ;; SIMD main loop: 16 bytes (128 bits) per iteration
    (block $simd_done
      (loop $simd_loop
        ;; Stop if byte_offset + 16 > bm_byte_size
        (br_if $simd_done
          (i32.gt_u (i32.add (local.get $byte_offset) (i32.const 16))
                    (local.get $bm_byte_size)))

        ;; Load 16 bytes of bitmap
        (local.set $vec
          (v128.load (i32.add (local.get $bm_offset) (local.get $byte_offset))))

        ;; Invert: free bits become 1
        (local.set $inv (v128.xor (local.get $vec) (local.get $all_ones)))

        ;; Check if ANY byte is non-zero (has at least one free bit)
        (if (v128.any_true (local.get $inv))
          (then
            ;; Find which byte has the first non-zero value
            ;; i8x16.bitmask gives a 16-bit mask: bit i = 1 if lane i's MSB is set.
            ;; But we need to find any non-zero byte, not just MSB-set bytes.
            ;; Strategy: check each i32 lane for non-zero via extraction.
            ;; Lane 0 = bits 0..31, Lane 1 = bits 32..63, etc.

            ;; Check lane 0 (bits 0..31)
            (local.set $lane_word (i32x4.extract_lane 0 (local.get $inv)))
            (if (local.get $lane_word)
              (then
                (local.set $bit_in_lane (i32.ctz (local.get $lane_word)))
                (local.set $abs_bit
                  (i32.add (i32.shl (local.get $byte_offset) (i32.const 3))
                           (local.get $bit_in_lane)))
                (if (i32.lt_u (local.get $abs_bit) (local.get $total_bits))
                  (then (return (local.get $abs_bit))))))

            ;; Check lane 1 (bits 32..63)
            (local.set $lane_word (i32x4.extract_lane 1 (local.get $inv)))
            (if (local.get $lane_word)
              (then
                (local.set $bit_in_lane (i32.ctz (local.get $lane_word)))
                (local.set $abs_bit
                  (i32.add (i32.shl (local.get $byte_offset) (i32.const 3))
                           (i32.add (i32.const 32) (local.get $bit_in_lane))))
                (if (i32.lt_u (local.get $abs_bit) (local.get $total_bits))
                  (then (return (local.get $abs_bit))))))

            ;; Check lane 2 (bits 64..95)
            (local.set $lane_word (i32x4.extract_lane 2 (local.get $inv)))
            (if (local.get $lane_word)
              (then
                (local.set $bit_in_lane (i32.ctz (local.get $lane_word)))
                (local.set $abs_bit
                  (i32.add (i32.shl (local.get $byte_offset) (i32.const 3))
                           (i32.add (i32.const 64) (local.get $bit_in_lane))))
                (if (i32.lt_u (local.get $abs_bit) (local.get $total_bits))
                  (then (return (local.get $abs_bit))))))

            ;; Check lane 3 (bits 96..127)
            (local.set $lane_word (i32x4.extract_lane 3 (local.get $inv)))
            (if (local.get $lane_word)
              (then
                (local.set $bit_in_lane (i32.ctz (local.get $lane_word)))
                (local.set $abs_bit
                  (i32.add (i32.shl (local.get $byte_offset) (i32.const 3))
                           (i32.add (i32.const 96) (local.get $bit_in_lane))))
                (if (i32.lt_u (local.get $abs_bit) (local.get $total_bits))
                  (then (return (local.get $abs_bit))))))))

        ;; Next 16 bytes
        (local.set $byte_offset (i32.add (local.get $byte_offset) (i32.const 16)))
        (br $simd_loop)))

    ;; Scalar tail: handle remaining bytes that don't fill a v128
    (call $bitmap_find_free
      (local.get $bm_offset)
      (local.get $total_bits)
      ;; Start from where SIMD left off
      (i32.shl (local.get $byte_offset) (i32.const 3))))

  ;; =========================================================================
  ;; bitmap_alloc_cas — Atomically claim a free bit (set 0→1)
  ;; =========================================================================
  ;; Attempts to set bit `bit_idx` from 0 to 1 atomically.
  ;; Returns 1 on success (bit was free, now allocated), 0 on failure (already taken).
  ;;
  ;; Uses i32.atomic.rmw.cmpxchg on the containing word.
  (func $bitmap_alloc_cas (export "bitmap_alloc_cas")
        (param $bm_offset i32) (param $bit_idx i32)
        (result i32)
    (local $word_offset i32)   ;; byte offset of the containing word
    (local $bit_mask i32)      ;; mask with only our bit set
    (local $old_word i32)      ;; value before CAS
    (local $new_word i32)

    ;; word_offset = bm_offset + (bit_idx / 32) * 4
    (local.set $word_offset
      (i32.add (local.get $bm_offset)
               (i32.shl (i32.shr_u (local.get $bit_idx) (i32.const 5))
                        (i32.const 2))))

    ;; bit_mask = 1 << (bit_idx % 32)
    (local.set $bit_mask
      (i32.shl (i32.const 1)
               (i32.and (local.get $bit_idx) (i32.const 31))))

    ;; CAS loop: try to set our bit from 0 to 1
    (loop $retry
      ;; Load current word atomically
      (local.set $old_word (i32.atomic.load (local.get $word_offset)))

      ;; If our bit is already set, someone else got it
      (if (i32.and (local.get $old_word) (local.get $bit_mask))
        (then (return (i32.const 0))))

      ;; Try to set the bit
      (local.set $new_word
        (i32.or (local.get $old_word) (local.get $bit_mask)))

      ;; CAS: if word hasn't changed, we win
      (if (i32.eq
            (i32.atomic.rmw.cmpxchg (local.get $word_offset)
                                     (local.get $old_word)
                                     (local.get $new_word))
            (local.get $old_word))
        (then (return (i32.const 1))))

      ;; CAS failed (contention), retry
      (br $retry))

    ;; Unreachable (loop always returns)
    (unreachable))

  ;; =========================================================================
  ;; bitmap_free — Atomically clear a bit (set 1→0)
  ;; =========================================================================
  ;; Clears bit `bit_idx` (marks block as free). Always succeeds.
  ;; Uses atomic RMW AND to clear the bit.
  (func $bitmap_free (export "bitmap_free")
        (param $bm_offset i32) (param $bit_idx i32)
    (local $word_offset i32)
    (local $bit_mask i32)

    ;; word_offset = bm_offset + (bit_idx / 32) * 4
    (local.set $word_offset
      (i32.add (local.get $bm_offset)
               (i32.shl (i32.shr_u (local.get $bit_idx) (i32.const 5))
                        (i32.const 2))))

    ;; bit_mask = ~(1 << (bit_idx % 32))  — all bits set except ours
    (local.set $bit_mask
      (i32.xor
        (i32.shl (i32.const 1)
                 (i32.and (local.get $bit_idx) (i32.const 31)))
        (i32.const -1)))

    ;; Atomic AND: clear our bit
    (drop (i32.atomic.rmw.and (local.get $word_offset) (local.get $bit_mask))))

  ;; =========================================================================
  ;; bitmap_count_free_simd — Count free bits in a range using SIMD popcount
  ;; =========================================================================
  ;; Counts the number of 0-bits (free blocks) in the bitmap.
  ;; Uses SIMD to process 128 bits at a time.
  ;; The popcount of set bits is subtracted from total to get free count.
  ;;
  ;; Params:
  ;;   $bm_offset  — byte offset of bitmap
  ;;   $total_bits — total blocks
  ;; Returns: number of free blocks
  (func $bitmap_count_free_simd (export "bitmap_count_free_simd")
        (param $bm_offset i32) (param $total_bits i32)
        (result i32)
    (local $byte_offset i32)
    (local $bm_byte_size i32)
    (local $allocated_count i32)
    (local $vec v128)
    (local $word i32)
    (local $end_byte i32)

    (local.set $byte_offset (i32.const 0))
    (local.set $allocated_count (i32.const 0))
    (local.set $bm_byte_size
      (i32.shr_u (i32.add (local.get $total_bits) (i32.const 7)) (i32.const 3)))

    ;; SIMD loop: 16 bytes per iteration
    ;; We sum popcount of each i32 lane
    (block $simd_done
      (loop $simd_loop
        (br_if $simd_done
          (i32.gt_u (i32.add (local.get $byte_offset) (i32.const 16))
                    (local.get $bm_byte_size)))

        (local.set $vec
          (v128.load (i32.add (local.get $bm_offset) (local.get $byte_offset))))

        ;; Sum popcount of each i32 lane
        (local.set $allocated_count
          (i32.add (local.get $allocated_count)
            (i32.add
              (i32.add
                (i32.popcnt (i32x4.extract_lane 0 (local.get $vec)))
                (i32.popcnt (i32x4.extract_lane 1 (local.get $vec))))
              (i32.add
                (i32.popcnt (i32x4.extract_lane 2 (local.get $vec)))
                (i32.popcnt (i32x4.extract_lane 3 (local.get $vec)))))))

        (local.set $byte_offset (i32.add (local.get $byte_offset) (i32.const 16)))
        (br $simd_loop)))

    ;; Scalar tail
    (local.set $end_byte (local.get $bm_byte_size))
    ;; Process remaining words (4 bytes at a time)
    (block $scalar_done
      (loop $scalar_loop
        (br_if $scalar_done
          (i32.gt_u (i32.add (local.get $byte_offset) (i32.const 4))
                    (local.get $end_byte)))
        (local.set $word
          (i32.load (i32.add (local.get $bm_offset) (local.get $byte_offset))))
        (local.set $allocated_count
          (i32.add (local.get $allocated_count) (i32.popcnt (local.get $word))))
        (local.set $byte_offset (i32.add (local.get $byte_offset) (i32.const 4)))
        (br $scalar_loop)))

    ;; free = total - allocated
    (i32.sub (local.get $total_bits) (local.get $allocated_count)))

  ;; =========================================================================
  ;; bitmap_find_free_batch_simd — Find up to N free bits starting from cursor
  ;; =========================================================================
  ;; Scans the bitmap for free bits and writes their indices to an output buffer.
  ;; Returns the count of free bits found (up to max_count).
  ;;
  ;; Params:
  ;;   $bm_offset   — byte offset of bitmap
  ;;   $total_bits  — total blocks
  ;;   $start_bit   — starting bit index
  ;;   $max_count   — maximum number of results to return
  ;;   $out_offset  — byte offset to write results (array of i32 bit indices)
  ;; Returns: count of free bits found
  (func $bitmap_find_free_batch_simd (export "bitmap_find_free_batch_simd")
        (param $bm_offset i32) (param $total_bits i32) (param $start_bit i32)
        (param $max_count i32) (param $out_offset i32)
        (result i32)
    (local $found i32)
    (local $current_bit i32)
    (local $idx i32)

    (local.set $found (i32.const 0))
    (local.set $current_bit (local.get $start_bit))

    (block $done
      (loop $next
        ;; Stop if we have enough or scanned all bits
        (br_if $done (i32.ge_u (local.get $found) (local.get $max_count)))
        (br_if $done (i32.ge_u (local.get $current_bit) (local.get $total_bits)))

        ;; Find next free bit using SIMD scanner
        (local.set $idx
          (call $bitmap_find_free_simd
            (local.get $bm_offset) (local.get $total_bits) (local.get $current_bit)))

        ;; -1 means no more free bits
        (br_if $done (i32.eq (local.get $idx) (i32.const -1)))

        ;; Write result
        (i32.store
          (i32.add (local.get $out_offset)
                   (i32.shl (local.get $found) (i32.const 2)))
          (local.get $idx))

        (local.set $found (i32.add (local.get $found) (i32.const 1)))
        ;; Continue from next bit
        (local.set $current_bit (i32.add (local.get $idx) (i32.const 1)))
        (br $next)))

    (local.get $found))

  ;; =========================================================================
  ;; Utility: popcount32
  ;; =========================================================================
  (func $popcount32 (export "popcount32") (param $x i32) (result i32)
    (i32.popcnt (local.get $x)))

  ;; =========================================================================
  ;; Utility: ctz32 (count trailing zeros)
  ;; =========================================================================
  (func $ctz32 (export "ctz32") (param $x i32) (result i32)
    (i32.ctz (local.get $x)))

  ;; =========================================================================
  ;; memcpy — SIMD-accelerated copy
  ;; =========================================================================
  (func $memcpy (export "memcpy") (param $dst i32) (param $src i32) (param $len i32)
    (local $i i32)
    (local.set $i (i32.const 0))
    ;; SIMD: 16 bytes per iteration
    (block $simd_done
      (loop $simd_loop
        (br_if $simd_done
          (i32.gt_u (i32.add (local.get $i) (i32.const 16)) (local.get $len)))
        (v128.store
          (i32.add (local.get $dst) (local.get $i))
          (v128.load (i32.add (local.get $src) (local.get $i))))
        (local.set $i (i32.add (local.get $i) (i32.const 16)))
        (br $simd_loop)))
    ;; Scalar tail
    (block $scalar_done
      (loop $scalar_loop
        (br_if $scalar_done (i32.ge_u (local.get $i) (local.get $len)))
        (i32.store8
          (i32.add (local.get $dst) (local.get $i))
          (i32.load8_u (i32.add (local.get $src) (local.get $i))))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $scalar_loop))))

  ;; =========================================================================
  ;; memset — Fill memory with a byte value
  ;; =========================================================================
  (func $memset (export "memset") (param $dst i32) (param $val i32) (param $len i32)
    (local $i i32)
    (local $fill v128)
    (local.set $i (i32.const 0))
    ;; Splat the byte value across all 16 lanes
    (local.set $fill (i8x16.splat (local.get $val)))
    ;; SIMD: 16 bytes per iteration
    (block $simd_done
      (loop $simd_loop
        (br_if $simd_done
          (i32.gt_u (i32.add (local.get $i) (i32.const 16)) (local.get $len)))
        (v128.store
          (i32.add (local.get $dst) (local.get $i))
          (local.get $fill))
        (local.set $i (i32.add (local.get $i) (i32.const 16)))
        (br $simd_loop)))
    ;; Scalar tail
    (block $scalar_done
      (loop $scalar_loop
        (br_if $scalar_done (i32.ge_u (local.get $i) (local.get $len)))
        (i32.store8
          (i32.add (local.get $dst) (local.get $i))
          (local.get $val))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $scalar_loop))))

  ;; =========================================================================
  ;; bytes_equal — Compare two byte ranges
  ;; =========================================================================
  (func $bytes_equal (export "bytes_equal")
        (param $p1 i32) (param $p2 i32) (param $len i32) (result i32)
    (local $i i32)
    (local.set $i (i32.const 0))
    ;; SIMD: 16 bytes per iteration
    (block $simd_done
      (loop $simd_loop
        (br_if $simd_done
          (i32.gt_u (i32.add (local.get $i) (i32.const 16)) (local.get $len)))
        (if (i32.ne
              (i32.const 65535)
              (i8x16.bitmask
                (i8x16.eq
                  (v128.load (i32.add (local.get $p1) (local.get $i)))
                  (v128.load (i32.add (local.get $p2) (local.get $i))))))
          (then (return (i32.const 0))))
        (local.set $i (i32.add (local.get $i) (i32.const 16)))
        (br $simd_loop)))
    ;; Scalar tail
    (block $scalar_done
      (loop $scalar_loop
        (br_if $scalar_done (i32.ge_u (local.get $i) (local.get $len)))
        (if (i32.ne
              (i32.load8_u (i32.add (local.get $p1) (local.get $i)))
              (i32.load8_u (i32.add (local.get $p2) (local.get $i))))
          (then (return (i32.const 0))))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $scalar_loop)))
    (i32.const 1))
)
