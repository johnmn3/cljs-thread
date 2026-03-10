(module
  ;; Import shared memory
  (import "env" "memory" (memory 1 16384 shared))

  ;;==========================================================================
  ;; BIT OPERATIONS
  ;;==========================================================================

  (func $popcount32 (export "popcount32") (param $x i32) (result i32)
    (local.get $x)
    (i32.popcnt))

  (func $clz32 (export "clz32") (param $x i32) (result i32)
    (local.get $x)
    (i32.clz))

  (func $ctz32 (export "ctz32") (param $x i32) (result i32)
    (local.get $x)
    (i32.ctz))

  ;; Get child index from bitmap: popcount of bits below target bit
  (func $bitmap_index (export "bitmap_index") (param $bitmap i32) (param $bit i32) (result i32)
    (i32.popcnt
      (i32.and
        (local.get $bitmap)
        (i32.sub (local.get $bit) (i32.const 1)))))

  ;;==========================================================================
  ;; MEMORY OPERATIONS
  ;;==========================================================================

  ;; Compare two byte ranges, return 1 if equal, 0 if not
  (func $bytes_equal (export "bytes_equal") (param $p1 i32) (param $p2 i32) (param $len i32) (result i32)
    (local $i i32)
    (local.set $i (i32.const 0))
    (block $done
      (loop $next
        (br_if $done (i32.ge_u (local.get $i) (local.get $len)))
        (if (i32.ne
              (i32.load8_u (i32.add (local.get $p1) (local.get $i)))
              (i32.load8_u (i32.add (local.get $p2) (local.get $i))))
          (then (return (i32.const 0))))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $next)))
    (i32.const 1))

  ;; Copy bytes from src to dst (non-overlapping), SIMD-accelerated.
  ;; Main loop copies 16 bytes per iteration via v128.load/v128.store.
  ;; Scalar tail handles remaining bytes (len % 16).
  (func $memcpy (export "memcpy") (param $dst i32) (param $src i32) (param $len i32)
    (local $i i32)
    (local $simd_end i32)
    ;; SIMD loop: 16 bytes per iteration
    (local.set $simd_end (i32.and (local.get $len) (i32.const 0xfffffff0)))  ;; len & ~15
    (local.set $i (i32.const 0))
    (block $simd_done
      (loop $simd_next
        (br_if $simd_done (i32.ge_u (local.get $i) (local.get $simd_end)))
        (v128.store
          (i32.add (local.get $dst) (local.get $i))
          (v128.load (i32.add (local.get $src) (local.get $i))))
        (local.set $i (i32.add (local.get $i) (i32.const 16)))
        (br $simd_next)))
    ;; Scalar tail: byte-by-byte for remainder
    (block $tail_done
      (loop $tail_next
        (br_if $tail_done (i32.ge_u (local.get $i) (local.get $len)))
        (i32.store8
          (i32.add (local.get $dst) (local.get $i))
          (i32.load8_u (i32.add (local.get $src) (local.get $i))))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $tail_next))))

  ;; Fill memory with a byte value
  (func $memset (export "memset") (param $dst i32) (param $val i32) (param $len i32)
    (local $i i32)
    (local.set $i (i32.const 0))
    (block $done
      (loop $next
        (br_if $done (i32.ge_u (local.get $i) (local.get $len)))
        (i32.store8
          (i32.add (local.get $dst) (local.get $i))
          (local.get $val))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $next))))

  ;;==========================================================================
  ;; HASH OPERATIONS
  ;;==========================================================================

  ;; FNV-1a 32-bit hash
  (func $fnv1a_hash (export "fnv1a_hash") (param $ptr i32) (param $len i32) (result i32)
    (local $hash i32)
    (local $i i32)
    (local.set $hash (i32.const 0x811c9dc5))
    (local.set $i (i32.const 0))
    (block $done
      (loop $next
        (br_if $done (i32.ge_u (local.get $i) (local.get $len)))
        (local.set $hash
          (i32.mul
            (i32.xor
              (local.get $hash)
              (i32.load8_u (i32.add (local.get $ptr) (local.get $i))))
            (i32.const 0x01000193)))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $next)))
    (local.get $hash))

  ;;==========================================================================
  ;; SIMD OPERATIONS (v128)
  ;;==========================================================================

  ;; Compare 16 bytes at once using SIMD, return 1 if all equal
  (func $v128_bytes_eq_16 (export "v128_bytes_eq_16") (param $p1 i32) (param $p2 i32) (result i32)
    (local $v1 v128)
    (local $v2 v128)
    (local.set $v1 (v128.load (local.get $p1)))
    (local.set $v2 (v128.load (local.get $p2)))
    ;; Compare all bytes, then check if all lanes are -1 (0xFF)
    (if (result i32)
      (i32.eq
        (i8x16.bitmask (i8x16.eq (local.get $v1) (local.get $v2)))
        (i32.const 0xFFFF))
      (then (i32.const 1))
      (else (i32.const 0))))

  ;; Compare 4 i32 values with a target, return bitmask of matches
  (func $v128_i32x4_eq_mask (export "v128_i32x4_eq_mask") (param $ptr i32) (param $target i32) (result i32)
    (local $values v128)
    (local $targets v128)
    (local.set $values (v128.load (local.get $ptr)))
    (local.set $targets (i32x4.splat (local.get $target)))
    (i32x4.bitmask (i32x4.eq (local.get $values) (local.get $targets))))

  ;; Search for a u32 in an array of u32s, return index or -1
  (func $v128_find_u32 (export "v128_find_u32") (param $ptr i32) (param $len i32) (param $target i32) (result i32)
    (local $i i32)
    (local $mask i32)
    (local $values v128)
    (local $targets v128)
    (local.set $targets (i32x4.splat (local.get $target)))
    (local.set $i (i32.const 0))

    ;; Process 4 elements at a time
    (block $done
      (loop $next
        (br_if $done (i32.ge_u (local.get $i) (local.get $len)))

        ;; Load 4 values
        (if (i32.le_u (i32.add (local.get $i) (i32.const 4)) (local.get $len))
          (then
            (local.set $values (v128.load (i32.add (local.get $ptr) (i32.shl (local.get $i) (i32.const 2)))))
            (local.set $mask (i32x4.bitmask (i32x4.eq (local.get $values) (local.get $targets))))

            (if (i32.ne (local.get $mask) (i32.const 0))
              (then
                ;; Found a match - return the index
                (if (i32.and (local.get $mask) (i32.const 1))
                  (then (return (local.get $i))))
                (if (i32.and (local.get $mask) (i32.const 2))
                  (then (return (i32.add (local.get $i) (i32.const 1)))))
                (if (i32.and (local.get $mask) (i32.const 4))
                  (then (return (i32.add (local.get $i) (i32.const 2)))))
                (if (i32.and (local.get $mask) (i32.const 8))
                  (then (return (i32.add (local.get $i) (i32.const 3)))))))))

        (local.set $i (i32.add (local.get $i) (i32.const 4)))
        (br $next)))

    ;; Handle remaining elements (scalar)
    (block $scalar_done
      (loop $scalar_next
        (br_if $scalar_done (i32.ge_u (local.get $i) (local.get $len)))
        (if (i32.eq
              (i32.load (i32.add (local.get $ptr) (i32.shl (local.get $i) (i32.const 2))))
              (local.get $target))
          (then (return (local.get $i))))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $scalar_next)))

    (i32.const -1))

  ;;==========================================================================
  ;; HAMT HELPER FUNCTIONS (defined before hamt_find which uses them)
  ;;==========================================================================

  ;; Get bit position from hash at given shift level
  (func $bitpos (param $hash i32) (param $shift i32) (result i32)
    (i32.shl
      (i32.const 1)
      (i32.and
        (i32.shr_u (local.get $hash) (local.get $shift))
        (i32.const 31))))

  ;; Check if bitmap has bit set
  (func $has_bit (param $bitmap i32) (param $bit i32) (result i32)
    (i32.ne
      (i32.and (local.get $bitmap) (local.get $bit))
      (i32.const 0)))

  ;; Calculate where the per-entry hash array starts (after children)
  (func $hashes_start (param $node_off i32) (param $node_bm i32) (result i32)
    (i32.add
      (i32.add (local.get $node_off) (i32.const 12))  ;; header size
      (i32.shl (i32.popcnt (local.get $node_bm)) (i32.const 2))))  ;; 4 bytes per child

  ;; Calculate KV data start offset in a bitmap node (after children + hash array)
  (func $kv_start (param $node_off i32) (param $data_bm i32) (param $node_bm i32) (result i32)
    (i32.add
      (i32.add
        (i32.add (local.get $node_off) (i32.const 12))  ;; header size
        (i32.shl (i32.popcnt (local.get $node_bm)) (i32.const 2)))  ;; 4 bytes per child
      (i32.shl (i32.popcnt (local.get $data_bm)) (i32.const 2))))  ;; 4 bytes per hash

  ;; Skip a KV entry, return offset after it
  ;; KV layout: [key_len:u32][key_bytes...][val_len:u32][val_bytes...]
  (func $skip_kv (param $ptr i32) (result i32)
    (local $key_len i32)
    (local $val_len i32)
    (local.set $key_len (i32.load (local.get $ptr)))
    (local.set $val_len (i32.load (i32.add (local.get $ptr) (i32.add (i32.const 4) (local.get $key_len)))))
    (i32.add (local.get $ptr)
      (i32.add (i32.const 8)
        (i32.add (local.get $key_len) (local.get $val_len)))))

  ;;==========================================================================
  ;; HAMT OPERATIONS
  ;;==========================================================================

  ;; Full HAMT lookup
  ;; Returns: (val_offset << 1) | 1 if found, 0 if not found
  (func $hamt_find (export "hamt_find")
    (param $root i32)           ;; Root node offset (-1 = empty)
    (param $target_ptr i32)     ;; Pointer to serialized key bytes
    (param $target_len i32)     ;; Length of key bytes
    (param $key_hash i32)       ;; FNV-1a hash of key (for SIMD pre-filter)
    (param $cljs_hash i32)      ;; ClojureScript hash (for HAMT navigation)
    (param $shift i32)          ;; Current shift level
    (result i32)

    (local $node_type i32)
    (local $data_bm i32)
    (local $node_bm i32)
    (local $bit i32)
    (local $idx i32)
    (local $child_off i32)
    (local $kv_pos i32)
    (local $key_len i32)
    (local $key_ptr i32)
    (local $val_off i32)
    (local $cnt i32)
    (local $i i32)

    ;; Empty tree check
    (if (i32.eq (local.get $root) (i32.const -1))
      (then (return (i32.const 0))))

    ;; Read node type
    (local.set $node_type (i32.load8_u (local.get $root)))

    ;; Bitmap node (type 1)
    (if (i32.eq (local.get $node_type) (i32.const 1))
      (then
        (local.set $data_bm (i32.load (i32.add (local.get $root) (i32.const 4))))
        (local.set $node_bm (i32.load (i32.add (local.get $root) (i32.const 8))))
        (local.set $bit (call $bitpos (local.get $cljs_hash) (local.get $shift)))

        ;; Check node_bitmap first (child nodes)
        (if (call $has_bit (local.get $node_bm) (local.get $bit))
          (then
            (local.set $idx (call $bitmap_index (local.get $node_bm) (local.get $bit)))
            (local.set $child_off (i32.load (i32.add
              (i32.add (local.get $root) (i32.const 12))
              (i32.shl (local.get $idx) (i32.const 2)))))
            (return (call $hamt_find
              (local.get $child_off)
              (local.get $target_ptr)
              (local.get $target_len)
              (local.get $key_hash)
              (local.get $cljs_hash)
              (i32.add (local.get $shift) (i32.const 5))))))

        ;; Check data_bitmap (inline KV)
        (if (call $has_bit (local.get $data_bm) (local.get $bit))
          (then
            (local.set $idx (call $bitmap_index (local.get $data_bm) (local.get $bit)))

            ;; Hash pre-filter: compare stored CLJS hash with target hash.
            ;; hashes_start + idx*4 gives the stored hash for this entry.
            ;; If different, this key definitely doesn't match — skip the
            ;; expensive skip_kv walk + key byte comparison entirely.
            (if (i32.ne
                  (i32.load (i32.add
                    (call $hashes_start (local.get $root) (local.get $node_bm))
                    (i32.shl (local.get $idx) (i32.const 2))))
                  (local.get $cljs_hash))
              (then (return (i32.const 0))))

            (local.set $kv_pos (call $kv_start (local.get $root) (local.get $data_bm) (local.get $node_bm)))

            ;; Skip to target entry
            (local.set $i (i32.const 0))
            (block $skip_done
              (loop $skip_next
                (br_if $skip_done (i32.ge_u (local.get $i) (local.get $idx)))
                (local.set $kv_pos (call $skip_kv (local.get $kv_pos)))
                (local.set $i (i32.add (local.get $i) (i32.const 1)))
                (br $skip_next)))

            ;; Compare key (key_len at kv_pos+0, key_ptr at kv_pos+4)
            (local.set $key_len (i32.load (local.get $kv_pos)))
            (local.set $key_ptr (i32.add (local.get $kv_pos) (i32.const 4)))

            (if (i32.and
                  (i32.eq (local.get $key_len) (local.get $target_len))
                  (call $bytes_equal (local.get $key_ptr) (local.get $target_ptr) (local.get $key_len)))
              (then
                ;; Key matches - return value offset
                (local.set $val_off (i32.add (local.get $key_ptr) (local.get $key_len)))
                (return (i32.or
                  (i32.shl (local.get $val_off) (i32.const 1))
                  (i32.const 1)))))))

        ;; Not found in bitmap node
        (return (i32.const 0))))

    ;; Collision node (type 3)
    (if (i32.eq (local.get $node_type) (i32.const 3))
      (then
        ;; Collision hash pre-filter: all entries in a collision node share
        ;; the same CLJS hash (stored at node+4). If it doesn't match the
        ;; target, none of the entries can match — skip the linear scan.
        (if (i32.ne
              (i32.load (i32.add (local.get $root) (i32.const 4)))
              (local.get $cljs_hash))
          (then (return (i32.const 0))))

        (local.set $cnt (i32.load8_u (i32.add (local.get $root) (i32.const 1))))
        (local.set $kv_pos (i32.add (local.get $root) (i32.const 8)))  ;; collision header size

        (local.set $i (i32.const 0))
        (block $coll_done
          (loop $coll_next
            (br_if $coll_done (i32.ge_u (local.get $i) (local.get $cnt)))

            ;; key_len at kv_pos+0, key_ptr at kv_pos+4
            (local.set $key_len (i32.load (local.get $kv_pos)))
            (local.set $key_ptr (i32.add (local.get $kv_pos) (i32.const 4)))

            (if (i32.and
                  (i32.eq (local.get $key_len) (local.get $target_len))
                  (call $bytes_equal (local.get $key_ptr) (local.get $target_ptr) (local.get $key_len)))
              (then
                ;; Key matches
                (local.set $val_off (i32.add (local.get $key_ptr) (local.get $key_len)))
                (return (i32.or
                  (i32.shl (local.get $val_off) (i32.const 1))
                  (i32.const 1)))))

            ;; Skip to next entry
            (local.set $kv_pos (call $skip_kv (local.get $kv_pos)))
            (local.set $i (i32.add (local.get $i) (i32.const 1)))
            (br $coll_next)))))

    ;; Not found or unknown node type
    (i32.const 0))

  ;;==========================================================================
  ;; GATHER/SCATTER (for batch operations)
  ;;==========================================================================

  ;; Gather N u32 values from offsets array to output array
  (func $gather_u32 (export "gather_u32")
    (param $offsets_ptr i32)    ;; Array of byte offsets
    (param $output_ptr i32)     ;; Output array
    (param $count i32)          ;; Number of elements
    (local $i i32)
    (local $offset i32)
    (local.set $i (i32.const 0))
    (block $done
      (loop $next
        (br_if $done (i32.ge_u (local.get $i) (local.get $count)))
        (local.set $offset (i32.load (i32.add (local.get $offsets_ptr) (i32.shl (local.get $i) (i32.const 2)))))
        (i32.store
          (i32.add (local.get $output_ptr) (i32.shl (local.get $i) (i32.const 2)))
          (i32.load (local.get $offset)))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $next))))

  ;; Scatter N u32 values from input array to offsets
  (func $scatter_u32 (export "scatter_u32")
    (param $offsets_ptr i32)
    (param $input_ptr i32)
    (param $count i32)
    (local $i i32)
    (local $offset i32)
    (local.set $i (i32.const 0))
    (block $done
      (loop $next
        (br_if $done (i32.ge_u (local.get $i) (local.get $count)))
        (local.set $offset (i32.load (i32.add (local.get $offsets_ptr) (i32.shl (local.get $i) (i32.const 2)))))
        (i32.store
          (local.get $offset)
          (i32.load (i32.add (local.get $input_ptr) (i32.shl (local.get $i) (i32.const 2)))))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $next))))

  ;;==========================================================================
  ;; PREFIX SUM (for computing offsets from lengths)
  ;;==========================================================================

  ;; Compute exclusive prefix sum of u32 array
  ;; Output[i] = sum of Input[0..i-1]
  (func $prefix_sum_u32 (export "prefix_sum_u32")
    (param $input_ptr i32)
    (param $output_ptr i32)
    (param $count i32)
    (param $initial i32)        ;; Starting offset
    (local $i i32)
    (local $sum i32)
    (local.set $sum (local.get $initial))
    (local.set $i (i32.const 0))
    (block $done
      (loop $next
        (br_if $done (i32.ge_u (local.get $i) (local.get $count)))
        ;; Store current sum
        (i32.store
          (i32.add (local.get $output_ptr) (i32.shl (local.get $i) (i32.const 2)))
          (local.get $sum))
        ;; Add current input to sum
        (local.set $sum
          (i32.add
            (local.get $sum)
            (i32.load (i32.add (local.get $input_ptr) (i32.shl (local.get $i) (i32.const 2))))))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $next))))

  ;;==========================================================================
  ;; SIMD BATCH ARRAY OPERATIONS
  ;;==========================================================================

  ;; Fill i32 array with a value using SIMD (4 elements at a time)
  ;; ptr must be 16-byte aligned for SIMD stores
  (func $simd_fill_i32 (export "simd_fill_i32")
    (param $ptr i32)            ;; Pointer to i32 array
    (param $count i32)          ;; Number of elements
    (param $value i32)          ;; Value to fill
    (local $i i32)
    (local $vec v128)
    (local.set $vec (i32x4.splat (local.get $value)))
    (local.set $i (i32.const 0))

    ;; SIMD loop: 4 elements at a time
    (block $done
      (loop $next
        (br_if $done (i32.gt_u (i32.add (local.get $i) (i32.const 4)) (local.get $count)))
        (v128.store
          (i32.add (local.get $ptr) (i32.shl (local.get $i) (i32.const 2)))
          (local.get $vec))
        (local.set $i (i32.add (local.get $i) (i32.const 4)))
        (br $next)))

    ;; Scalar tail
    (block $scalar_done
      (loop $scalar_next
        (br_if $scalar_done (i32.ge_u (local.get $i) (local.get $count)))
        (i32.store
          (i32.add (local.get $ptr) (i32.shl (local.get $i) (i32.const 2)))
          (local.get $value))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $scalar_next))))

  ;; Copy i32 array using SIMD (4 elements at a time)
  (func $simd_copy_i32 (export "simd_copy_i32")
    (param $dst i32)            ;; Destination pointer
    (param $src i32)            ;; Source pointer
    (param $count i32)          ;; Number of i32 elements
    (local $i i32)
    (local $vec v128)
    (local.set $i (i32.const 0))

    ;; SIMD loop: 4 elements at a time
    (block $done
      (loop $next
        (br_if $done (i32.gt_u (i32.add (local.get $i) (i32.const 4)) (local.get $count)))
        (local.set $vec (v128.load (i32.add (local.get $src) (i32.shl (local.get $i) (i32.const 2)))))
        (v128.store
          (i32.add (local.get $dst) (i32.shl (local.get $i) (i32.const 2)))
          (local.get $vec))
        (local.set $i (i32.add (local.get $i) (i32.const 4)))
        (br $next)))

    ;; Scalar tail
    (block $scalar_done
      (loop $scalar_next
        (br_if $scalar_done (i32.ge_u (local.get $i) (local.get $count)))
        (i32.store
          (i32.add (local.get $dst) (i32.shl (local.get $i) (i32.const 2)))
          (i32.load (i32.add (local.get $src) (i32.shl (local.get $i) (i32.const 2)))))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $scalar_next))))

  ;; Sum i32 array using SIMD (4 elements at a time)
  ;; Returns the sum of all elements
  (func $simd_sum_i32 (export "simd_sum_i32")
    (param $ptr i32)            ;; Pointer to i32 array
    (param $count i32)          ;; Number of elements
    (result i32)
    (local $i i32)
    (local $sum_vec v128)
    (local $sum i32)
    (local $vec v128)
    (local.set $sum_vec (i32x4.splat (i32.const 0)))
    (local.set $sum (i32.const 0))
    (local.set $i (i32.const 0))

    ;; SIMD loop: 4 elements at a time
    (block $done
      (loop $next
        (br_if $done (i32.gt_u (i32.add (local.get $i) (i32.const 4)) (local.get $count)))
        (local.set $vec (v128.load (i32.add (local.get $ptr) (i32.shl (local.get $i) (i32.const 2)))))
        (local.set $sum_vec (i32x4.add (local.get $sum_vec) (local.get $vec)))
        (local.set $i (i32.add (local.get $i) (i32.const 4)))
        (br $next)))

    ;; Reduce the 4 lanes of sum_vec to scalar
    (local.set $sum
      (i32.add
        (i32.add
          (i32x4.extract_lane 0 (local.get $sum_vec))
          (i32x4.extract_lane 1 (local.get $sum_vec)))
        (i32.add
          (i32x4.extract_lane 2 (local.get $sum_vec))
          (i32x4.extract_lane 3 (local.get $sum_vec)))))

    ;; Scalar tail
    (block $scalar_done
      (loop $scalar_next
        (br_if $scalar_done (i32.ge_u (local.get $i) (local.get $count)))
        (local.set $sum
          (i32.add (local.get $sum)
                   (i32.load (i32.add (local.get $ptr) (i32.shl (local.get $i) (i32.const 2))))))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $scalar_next)))

    (local.get $sum))

  ;; Find min value in i32 array using SIMD
  (func $simd_min_i32 (export "simd_min_i32")
    (param $ptr i32)
    (param $count i32)
    (result i32)
    (local $i i32)
    (local $min_vec v128)
    (local $min i32)
    (local $vec v128)

    ;; Handle empty array
    (if (i32.eq (local.get $count) (i32.const 0))
      (then (return (i32.const 2147483647))))

    ;; Initialize with max int32
    (local.set $min_vec (i32x4.splat (i32.const 2147483647)))
    (local.set $min (i32.const 2147483647))
    (local.set $i (i32.const 0))

    ;; SIMD loop
    (block $done
      (loop $next
        (br_if $done (i32.gt_u (i32.add (local.get $i) (i32.const 4)) (local.get $count)))
        (local.set $vec (v128.load (i32.add (local.get $ptr) (i32.shl (local.get $i) (i32.const 2)))))
        (local.set $min_vec (i32x4.min_s (local.get $min_vec) (local.get $vec)))
        (local.set $i (i32.add (local.get $i) (i32.const 4)))
        (br $next)))

    ;; Reduce min_vec to scalar
    (local.set $min (i32x4.extract_lane 0 (local.get $min_vec)))
    (if (i32.lt_s (i32x4.extract_lane 1 (local.get $min_vec)) (local.get $min))
      (then (local.set $min (i32x4.extract_lane 1 (local.get $min_vec)))))
    (if (i32.lt_s (i32x4.extract_lane 2 (local.get $min_vec)) (local.get $min))
      (then (local.set $min (i32x4.extract_lane 2 (local.get $min_vec)))))
    (if (i32.lt_s (i32x4.extract_lane 3 (local.get $min_vec)) (local.get $min))
      (then (local.set $min (i32x4.extract_lane 3 (local.get $min_vec)))))

    ;; Scalar tail
    (block $scalar_done
      (loop $scalar_next
        (br_if $scalar_done (i32.ge_u (local.get $i) (local.get $count)))
        (if (i32.lt_s (i32.load (i32.add (local.get $ptr) (i32.shl (local.get $i) (i32.const 2)))) (local.get $min))
          (then (local.set $min (i32.load (i32.add (local.get $ptr) (i32.shl (local.get $i) (i32.const 2)))))))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $scalar_next)))

    (local.get $min))

  ;; Find max value in i32 array using SIMD
  (func $simd_max_i32 (export "simd_max_i32")
    (param $ptr i32)
    (param $count i32)
    (result i32)
    (local $i i32)
    (local $max_vec v128)
    (local $max i32)
    (local $vec v128)

    ;; Handle empty array
    (if (i32.eq (local.get $count) (i32.const 0))
      (then (return (i32.const -2147483648))))

    ;; Initialize with min int32
    (local.set $max_vec (i32x4.splat (i32.const -2147483648)))
    (local.set $max (i32.const -2147483648))
    (local.set $i (i32.const 0))

    ;; SIMD loop
    (block $done
      (loop $next
        (br_if $done (i32.gt_u (i32.add (local.get $i) (i32.const 4)) (local.get $count)))
        (local.set $vec (v128.load (i32.add (local.get $ptr) (i32.shl (local.get $i) (i32.const 2)))))
        (local.set $max_vec (i32x4.max_s (local.get $max_vec) (local.get $vec)))
        (local.set $i (i32.add (local.get $i) (i32.const 4)))
        (br $next)))

    ;; Reduce max_vec to scalar
    (local.set $max (i32x4.extract_lane 0 (local.get $max_vec)))
    (if (i32.gt_s (i32x4.extract_lane 1 (local.get $max_vec)) (local.get $max))
      (then (local.set $max (i32x4.extract_lane 1 (local.get $max_vec)))))
    (if (i32.gt_s (i32x4.extract_lane 2 (local.get $max_vec)) (local.get $max))
      (then (local.set $max (i32x4.extract_lane 2 (local.get $max_vec)))))
    (if (i32.gt_s (i32x4.extract_lane 3 (local.get $max_vec)) (local.get $max))
      (then (local.set $max (i32x4.extract_lane 3 (local.get $max_vec)))))

    ;; Scalar tail
    (block $scalar_done
      (loop $scalar_next
        (br_if $scalar_done (i32.ge_u (local.get $i) (local.get $count)))
        (if (i32.gt_s (i32.load (i32.add (local.get $ptr) (i32.shl (local.get $i) (i32.const 2)))) (local.get $max))
          (then (local.set $max (i32.load (i32.add (local.get $ptr) (i32.shl (local.get $i) (i32.const 2)))))))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $scalar_next)))

    (local.get $max))

  ;; Compare two i32 arrays for equality using SIMD
  ;; Returns 1 if equal, 0 if not
  (func $simd_eq_i32 (export "simd_eq_i32")
    (param $ptr1 i32)
    (param $ptr2 i32)
    (param $count i32)
    (result i32)
    (local $i i32)
    (local $vec1 v128)
    (local $vec2 v128)
    (local.set $i (i32.const 0))

    ;; SIMD loop
    (block $done
      (loop $next
        (br_if $done (i32.gt_u (i32.add (local.get $i) (i32.const 4)) (local.get $count)))
        (local.set $vec1 (v128.load (i32.add (local.get $ptr1) (i32.shl (local.get $i) (i32.const 2)))))
        (local.set $vec2 (v128.load (i32.add (local.get $ptr2) (i32.shl (local.get $i) (i32.const 2)))))
        ;; Check if all 4 lanes are equal
        (if (i32.ne (i32x4.bitmask (i32x4.eq (local.get $vec1) (local.get $vec2))) (i32.const 15))
          (then (return (i32.const 0))))
        (local.set $i (i32.add (local.get $i) (i32.const 4)))
        (br $next)))

    ;; Scalar tail
    (block $scalar_done
      (loop $scalar_next
        (br_if $scalar_done (i32.ge_u (local.get $i) (local.get $count)))
        (if (i32.ne
              (i32.load (i32.add (local.get $ptr1) (i32.shl (local.get $i) (i32.const 2))))
              (i32.load (i32.add (local.get $ptr2) (i32.shl (local.get $i) (i32.const 2)))))
          (then (return (i32.const 0))))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $scalar_next)))

    (i32.const 1))

  ;;==========================================================================
  ;; DESCRIPTOR TABLE SCAN
  ;;==========================================================================

  ;; Scan descriptor table for a free block with sufficient capacity.
  ;; Descriptors are 28 bytes (7 i32s) each, packed contiguously.
  ;; STATUS is at offset 0, CAPACITY at offset 12 within each descriptor.
  ;; STATUS_FREE = 0, STATUS_ZEROED_UNUSED = -1
  ;; Returns descriptor index, or -1 if not found.
  (func $find_free_descriptor (export "find_free_descriptor")
    (param $base_byte i32)     ;; byte offset of descriptor array start
    (param $max_count i32)     ;; number of descriptors to scan
    (param $min_capacity i32)  ;; minimum block capacity needed
    (param $start_idx i32)     ;; starting descriptor index
    (result i32)
    (local $i i32)
    (local $desc_byte i32)
    (local $status i32)
    (local $capacity i32)
    (local.set $i (local.get $start_idx))

    (block $not_found
      (loop $next
        (br_if $not_found (i32.ge_u (local.get $i) (local.get $max_count)))

        ;; Calculate byte offset: base + i * 28
        (local.set $desc_byte
          (i32.add (local.get $base_byte)
                   (i32.mul (local.get $i) (i32.const 28))))

        ;; Read status (atomic for shared memory correctness)
        (local.set $status (i32.load (local.get $desc_byte)))

        ;; Check if FREE (0) or ZEROED_UNUSED (-1)
        (if (i32.or
              (i32.eqz (local.get $status))
              (i32.eq (local.get $status) (i32.const -1)))
          (then
            ;; Check capacity at offset +12
            (local.set $capacity
              (i32.load (i32.add (local.get $desc_byte) (i32.const 12))))
            (if (i32.ge_s (local.get $capacity) (local.get $min_capacity))
              (then (return (local.get $i))))))

        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $next)))

    (i32.const -1))

  ;; Batch scan: find up to N free descriptors with sufficient capacity.
  ;; Writes matching indices to output buffer. Returns count found.
  (func $find_free_descriptors_batch (export "find_free_descriptors_batch")
    (param $base_byte i32)     ;; byte offset of descriptor array start
    (param $max_count i32)     ;; number of descriptors to scan
    (param $min_capacity i32)  ;; minimum block capacity needed
    (param $start_idx i32)     ;; starting descriptor index
    (param $max_results i32)   ;; max results to collect
    (param $out_ptr i32)       ;; output buffer (i32 array) for descriptor indices
    (result i32)               ;; number found
    (local $i i32)
    (local $found i32)
    (local $desc_byte i32)
    (local $status i32)
    (local $capacity i32)
    (local.set $i (local.get $start_idx))
    (local.set $found (i32.const 0))

    (block $done
      (loop $next
        (br_if $done (i32.ge_u (local.get $i) (local.get $max_count)))
        (br_if $done (i32.ge_u (local.get $found) (local.get $max_results)))

        (local.set $desc_byte
          (i32.add (local.get $base_byte)
                   (i32.mul (local.get $i) (i32.const 28))))

        (local.set $status (i32.load (local.get $desc_byte)))

        (if (i32.or
              (i32.eqz (local.get $status))
              (i32.eq (local.get $status) (i32.const -1)))
          (then
            (local.set $capacity
              (i32.load (i32.add (local.get $desc_byte) (i32.const 12))))
            (if (i32.ge_s (local.get $capacity) (local.get $min_capacity))
              (then
                ;; Store found index in output buffer
                (i32.store
                  (i32.add (local.get $out_ptr)
                           (i32.shl (local.get $found) (i32.const 2)))
                  (local.get $i))
                (local.set $found (i32.add (local.get $found) (i32.const 1)))))))

        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $next)))

    (local.get $found))

  ;;==========================================================================
  ;; HAMT NODE BUILDER OPERATIONS
  ;;==========================================================================

  ;; Calculate total KV data size in bytes for a bitmap node.
  ;; Walks all KV entries to find total byte span.
  (func $calc_kv_total_size (export "calc_kv_total_size")
    (param $node_off i32)     ;; node offset in memory
    (param $data_bm i32)      ;; data bitmap
    (param $node_bm i32)      ;; node bitmap
    (result i32)
    (local $count i32)
    (local $pos i32)
    (local $start i32)
    (local $i i32)

    (local.set $count (i32.popcnt (local.get $data_bm)))
    (if (i32.eqz (local.get $count))
      (then (return (i32.const 0))))

    (local.set $start (call $kv_start (local.get $node_off) (local.get $data_bm) (local.get $node_bm)))
    (local.set $pos (local.get $start))
    (local.set $i (i32.const 0))
    (block $done
      (loop $next
        (br_if $done (i32.ge_u (local.get $i) (local.get $count)))
        (local.set $pos (call $skip_kv (local.get $pos)))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $next)))

    (i32.sub (local.get $pos) (local.get $start)))

  ;; Write a KV entry: [key_len:u32][key_bytes...][val_len:u32][val_bytes...]
  ;; Hash is stored separately in the node's hash array.
  ;; kb_ptr/vb_ptr are offsets in shared memory (scratch area).
  ;; Returns offset after written data.
  (func $write_kv_entry (param $dst i32)
                         (param $kb_ptr i32) (param $kb_len i32)
                         (param $vb_ptr i32) (param $vb_len i32)
                         (result i32)
    (local $val_off i32)
    ;; Write key_len at dst+0
    (i32.store (local.get $dst) (local.get $kb_len))
    ;; Copy key bytes at dst+4
    (if (i32.gt_u (local.get $kb_len) (i32.const 0))
      (then (call $memcpy (i32.add (local.get $dst) (i32.const 4))
                           (local.get $kb_ptr) (local.get $kb_len))))
    ;; val_off = dst + 4 + kb_len
    (local.set $val_off (i32.add (local.get $dst)
                                  (i32.add (i32.const 4) (local.get $kb_len))))
    ;; Write val_len
    (i32.store (local.get $val_off) (local.get $vb_len))
    ;; Copy val bytes
    (if (i32.gt_u (local.get $vb_len) (i32.const 0))
      (then (call $memcpy (i32.add (local.get $val_off) (i32.const 4))
                           (local.get $vb_ptr) (local.get $vb_len))))
    ;; Return: val_off + 4 + vb_len
    (i32.add (local.get $val_off)
             (i32.add (i32.const 4) (local.get $vb_len))))

  ;; Build bitmap node with one child pointer replaced.
  ;; Copies header, children (with one replaced), and all KV data (single bulk copy).
  ;; CLJS pre-allocates dst with correct size.
  (func $build_node_replace_child (export "build_node_replace_child")
    (param $dst i32)           ;; pre-allocated destination offset
    (param $src i32)           ;; source node offset
    (param $data_bm i32)       ;; data bitmap
    (param $node_bm i32)       ;; node bitmap
    (param $update_idx i32)    ;; child index to replace
    (param $new_child i32)     ;; new child offset

    (local $child_count i32)
    (local $i i32)
    (local $kv_total i32)
    (local $src_kv_start i32)
    (local $dst_kv_start i32)

    (local.set $child_count (i32.popcnt (local.get $node_bm)))

    ;; Write header: type=1, flags=0, kv_total_size=0 (set below), data_bm, node_bm (12 bytes)
    (i32.store8 (local.get $dst) (i32.const 1))
    (i32.store8 (i32.add (local.get $dst) (i32.const 1)) (i32.const 0))
    (i32.store16 (i32.add (local.get $dst) (i32.const 2)) (i32.const 0))
    (i32.store (i32.add (local.get $dst) (i32.const 4)) (local.get $data_bm))
    (i32.store (i32.add (local.get $dst) (i32.const 8)) (local.get $node_bm))

    ;; Copy child pointers, replacing at update_idx
    (local.set $i (i32.const 0))
    (block $cdone
      (loop $cnext
        (br_if $cdone (i32.ge_u (local.get $i) (local.get $child_count)))
        (i32.store
          (i32.add (i32.add (local.get $dst) (i32.const 12))
                   (i32.shl (local.get $i) (i32.const 2)))
          (if (result i32) (i32.eq (local.get $i) (local.get $update_idx))
            (then (local.get $new_child))
            (else (i32.load (i32.add (i32.add (local.get $src) (i32.const 12))
                                      (i32.shl (local.get $i) (i32.const 2)))))))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $cnext)))

    ;; Copy hash array (data entries unchanged — same data_bm)
    (if (i32.gt_u (i32.popcnt (local.get $data_bm)) (i32.const 0))
      (then
        (call $memcpy
          (call $hashes_start (local.get $dst) (local.get $node_bm))
          (call $hashes_start (local.get $src) (local.get $node_bm))
          (i32.shl (i32.popcnt (local.get $data_bm)) (i32.const 2)))))

    ;; Bulk copy all KV data (one memcpy for the whole contiguous region)
    (local.set $kv_total (call $calc_kv_total_size
                            (local.get $src) (local.get $data_bm) (local.get $node_bm)))
    (if (i32.gt_u (local.get $kv_total) (i32.const 0))
      (then
        (local.set $src_kv_start (call $kv_start (local.get $src) (local.get $data_bm) (local.get $node_bm)))
        (local.set $dst_kv_start (call $kv_start (local.get $dst) (local.get $data_bm) (local.get $node_bm)))
        (call $memcpy (local.get $dst_kv_start) (local.get $src_kv_start) (local.get $kv_total))))

    ;; Cache kv_total_size in header bytes 2-3 for fast allocation sizing
    (i32.store16 (i32.add (local.get $dst) (i32.const 2)) (local.get $kv_total)))

  ;; Build bitmap node with one KV entry replaced.
  ;; kb_ptr/vb_ptr must be offsets in shared memory (scratch area).
  (func $build_node_replace_kv (export "build_node_replace_kv")
    (param $dst i32)
    (param $src i32)
    (param $data_bm i32)
    (param $node_bm i32)
    (param $replace_idx i32)
    (param $kh i32)
    (param $kb_ptr i32) (param $kb_len i32)
    (param $vb_ptr i32) (param $vb_len i32)

    (local $child_count i32)
    (local $data_count i32)
    (local $i i32)
    (local $src_pos i32)
    (local $dst_pos i32)
    (local $next_src i32)
    (local $kv_len i32)
    (local $dst_kv_start i32)

    (local.set $child_count (i32.popcnt (local.get $node_bm)))
    (local.set $data_count (i32.popcnt (local.get $data_bm)))

    ;; Write header: type=1, flags=0, kv_total_size=0 (set below), data_bm, node_bm (12 bytes)
    (i32.store8 (local.get $dst) (i32.const 1))
    (i32.store8 (i32.add (local.get $dst) (i32.const 1)) (i32.const 0))
    (i32.store16 (i32.add (local.get $dst) (i32.const 2)) (i32.const 0))
    (i32.store (i32.add (local.get $dst) (i32.const 4)) (local.get $data_bm))
    (i32.store (i32.add (local.get $dst) (i32.const 8)) (local.get $node_bm))

    ;; Copy all child pointers from src
    (local.set $i (i32.const 0))
    (block $cdone
      (loop $cnext
        (br_if $cdone (i32.ge_u (local.get $i) (local.get $child_count)))
        (i32.store
          (i32.add (i32.add (local.get $dst) (i32.const 12))
                   (i32.shl (local.get $i) (i32.const 2)))
          (i32.load (i32.add (i32.add (local.get $src) (i32.const 12))
                              (i32.shl (local.get $i) (i32.const 2)))))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $cnext)))

    ;; Copy hash array, replacing hash at replace_idx
    (local.set $i (i32.const 0))
    (block $hdone
      (loop $hnext
        (br_if $hdone (i32.ge_u (local.get $i) (local.get $data_count)))
        (i32.store
          (i32.add (call $hashes_start (local.get $dst) (local.get $node_bm))
                   (i32.shl (local.get $i) (i32.const 2)))
          (if (result i32) (i32.eq (local.get $i) (local.get $replace_idx))
            (then (local.get $kh))
            (else (i32.load (i32.add (call $hashes_start (local.get $src) (local.get $node_bm))
                                      (i32.shl (local.get $i) (i32.const 2)))))))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $hnext)))

    ;; Copy KV entries, replacing at replace_idx
    (local.set $src_pos (call $kv_start (local.get $src) (local.get $data_bm) (local.get $node_bm)))
    (local.set $dst_kv_start (call $kv_start (local.get $dst) (local.get $data_bm) (local.get $node_bm)))
    (local.set $dst_pos (local.get $dst_kv_start))
    (local.set $i (i32.const 0))

    (block $kvdone
      (loop $kvnext
        (br_if $kvdone (i32.ge_u (local.get $i) (local.get $data_count)))

        (if (i32.eq (local.get $i) (local.get $replace_idx))
          (then
            ;; Write new KV entry (hash is in hash array)
            (local.set $dst_pos (call $write_kv_entry
              (local.get $dst_pos)
              (local.get $kb_ptr) (local.get $kb_len)
              (local.get $vb_ptr) (local.get $vb_len)))
            ;; Skip source entry
            (local.set $src_pos (call $skip_kv (local.get $src_pos))))
          (else
            ;; Copy existing entry
            (local.set $next_src (call $skip_kv (local.get $src_pos)))
            (local.set $kv_len (i32.sub (local.get $next_src) (local.get $src_pos)))
            (call $memcpy (local.get $dst_pos) (local.get $src_pos) (local.get $kv_len))
            (local.set $dst_pos (i32.add (local.get $dst_pos) (local.get $kv_len)))
            (local.set $src_pos (local.get $next_src))))

        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $kvnext)))

    ;; Cache kv_total_size in header bytes 2-3
    (i32.store16 (i32.add (local.get $dst) (i32.const 2))
                 (i32.sub (local.get $dst_pos) (local.get $dst_kv_start))))

  ;; Build bitmap node with one KV entry added at insert_idx.
  ;; kb_ptr/vb_ptr must be offsets in shared memory (scratch area).
  (func $build_node_add_kv (export "build_node_add_kv")
    (param $dst i32)
    (param $src i32)
    (param $src_data_bm i32)
    (param $src_node_bm i32)
    (param $new_data_bm i32)
    (param $insert_idx i32)
    (param $kh i32)
    (param $kb_ptr i32) (param $kb_len i32)
    (param $vb_ptr i32) (param $vb_len i32)

    (local $child_count i32)
    (local $data_count i32)
    (local $src_i i32)
    (local $src_pos i32)
    (local $dst_pos i32)
    (local $next_src i32)
    (local $kv_len i32)
    (local $inserted i32)
    (local $i i32)
    (local $dst_kv_start i32)

    (local.set $child_count (i32.popcnt (local.get $src_node_bm)))
    (local.set $data_count (i32.popcnt (local.get $src_data_bm)))

    ;; Write header: type=1, flags=0, kv_total_size=0 (set below), new_data_bm, node_bm (12 bytes)
    (i32.store8 (local.get $dst) (i32.const 1))
    (i32.store8 (i32.add (local.get $dst) (i32.const 1)) (i32.const 0))
    (i32.store16 (i32.add (local.get $dst) (i32.const 2)) (i32.const 0))
    (i32.store (i32.add (local.get $dst) (i32.const 4)) (local.get $new_data_bm))
    (i32.store (i32.add (local.get $dst) (i32.const 8)) (local.get $src_node_bm))

    ;; Copy child pointers from src
    (local.set $i (i32.const 0))
    (block $cdone
      (loop $cnext
        (br_if $cdone (i32.ge_u (local.get $i) (local.get $child_count)))
        (i32.store
          (i32.add (i32.add (local.get $dst) (i32.const 12))
                   (i32.shl (local.get $i) (i32.const 2)))
          (i32.load (i32.add (i32.add (local.get $src) (i32.const 12))
                              (i32.shl (local.get $i) (i32.const 2)))))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $cnext)))

    ;; Write hash array with insertion at insert_idx
    (local.set $src_i (i32.const 0))
    (local.set $i (i32.const 0))  ;; dst index
    (local.set $inserted (i32.const 0))
    (block $hdone
      (loop $hnext
        ;; Insert new hash at insert_idx
        (if (i32.and
              (i32.eq (local.get $i) (local.get $insert_idx))
              (i32.eqz (local.get $inserted)))
          (then
            (i32.store
              (i32.add (call $hashes_start (local.get $dst) (local.get $src_node_bm))
                       (i32.shl (local.get $i) (i32.const 2)))
              (local.get $kh))
            (local.set $i (i32.add (local.get $i) (i32.const 1)))
            (local.set $inserted (i32.const 1))
            (br $hnext)))
        (br_if $hdone (i32.ge_u (local.get $src_i) (local.get $data_count)))
        ;; Copy existing hash
        (i32.store
          (i32.add (call $hashes_start (local.get $dst) (local.get $src_node_bm))
                   (i32.shl (local.get $i) (i32.const 2)))
          (i32.load (i32.add (call $hashes_start (local.get $src) (local.get $src_node_bm))
                              (i32.shl (local.get $src_i) (i32.const 2)))))
        (local.set $src_i (i32.add (local.get $src_i) (i32.const 1)))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $hnext)))
    ;; If insert_idx was past all entries, insert hash at end
    (if (i32.eqz (local.get $inserted))
      (then
        (i32.store
          (i32.add (call $hashes_start (local.get $dst) (local.get $src_node_bm))
                   (i32.shl (local.get $i) (i32.const 2)))
          (local.get $kh))))

    ;; Copy KV entries with insertion at insert_idx
    (local.set $src_pos (call $kv_start (local.get $src) (local.get $src_data_bm) (local.get $src_node_bm)))
    (local.set $dst_kv_start (call $kv_start (local.get $dst) (local.get $new_data_bm) (local.get $src_node_bm)))
    (local.set $dst_pos (local.get $dst_kv_start))
    (local.set $src_i (i32.const 0))
    (local.set $inserted (i32.const 0))

    (block $kvdone
      (loop $kvnext
        ;; Check if it's time to insert (before copying src entry at this index)
        (if (i32.and
              (i32.eq (local.get $src_i) (local.get $insert_idx))
              (i32.eqz (local.get $inserted)))
          (then
            ;; Write new KV entry at dst_pos (hash is in hash array)
            (local.set $dst_pos (call $write_kv_entry
              (local.get $dst_pos)
              (local.get $kb_ptr) (local.get $kb_len)
              (local.get $vb_ptr) (local.get $vb_len)))
            (local.set $inserted (i32.const 1))
            ;; Don't advance src_i — continue to copy remaining entries
            (br $kvnext)))

        ;; Check if done with source entries
        (br_if $kvdone (i32.ge_u (local.get $src_i) (local.get $data_count)))

        ;; Copy existing entry
        (local.set $next_src (call $skip_kv (local.get $src_pos)))
        (local.set $kv_len (i32.sub (local.get $next_src) (local.get $src_pos)))
        (call $memcpy (local.get $dst_pos) (local.get $src_pos) (local.get $kv_len))
        (local.set $dst_pos (i32.add (local.get $dst_pos) (local.get $kv_len)))
        (local.set $src_pos (local.get $next_src))

        (local.set $src_i (i32.add (local.get $src_i) (i32.const 1)))
        (br $kvnext)))

    ;; If insert_idx was past all entries, insert at end
    (if (i32.eqz (local.get $inserted))
      (then
        (local.set $dst_pos (call $write_kv_entry
          (local.get $dst_pos)
          (local.get $kb_ptr) (local.get $kb_len)
          (local.get $vb_ptr) (local.get $vb_len)))))

    ;; Cache kv_total_size in header bytes 2-3
    (i32.store16 (i32.add (local.get $dst) (i32.const 2))
                 (i32.sub (local.get $dst_pos) (local.get $dst_kv_start))))

  ;; Build bitmap node removing one KV entry and optionally inserting a child.
  (func $build_node_remove_kv_add_child (export "build_node_remove_kv_add_child")
    (param $dst i32)
    (param $src i32)
    (param $src_data_bm i32)
    (param $src_node_bm i32)
    (param $new_data_bm i32)
    (param $new_node_bm i32)
    (param $remove_kv_idx i32)
    (param $insert_child_idx i32)   ;; -1 = no insert
    (param $new_child i32)

    (local $old_child_count i32)
    (local $new_child_count i32)
    (local $data_count i32)
    (local $i i32)
    (local $src_i i32)
    (local $dst_i i32)
    (local $src_pos i32)
    (local $dst_pos i32)
    (local $next_src i32)
    (local $kv_len i32)
    (local $dst_kv_start i32)

    (local.set $old_child_count (i32.popcnt (local.get $src_node_bm)))
    (local.set $new_child_count (i32.popcnt (local.get $new_node_bm)))
    (local.set $data_count (i32.popcnt (local.get $src_data_bm)))

    ;; Write header: type=1, flags=0, kv_total_size=0 (set below), new bitmaps (12 bytes)
    (i32.store8 (local.get $dst) (i32.const 1))
    (i32.store8 (i32.add (local.get $dst) (i32.const 1)) (i32.const 0))
    (i32.store16 (i32.add (local.get $dst) (i32.const 2)) (i32.const 0))
    (i32.store (i32.add (local.get $dst) (i32.const 4)) (local.get $new_data_bm))
    (i32.store (i32.add (local.get $dst) (i32.const 8)) (local.get $new_node_bm))

    ;; Write child pointers (handle insert if needed)
    (if (i32.ge_s (local.get $insert_child_idx) (i32.const 0))
      (then
        ;; Inserting a new child — interleave old children with new one
        (local.set $src_i (i32.const 0))
        (local.set $dst_i (i32.const 0))
        (block $cdone
          (loop $cnext
            (br_if $cdone (i32.ge_u (local.get $dst_i) (local.get $new_child_count)))
            (if (i32.eq (local.get $dst_i) (local.get $insert_child_idx))
              (then
                (i32.store
                  (i32.add (i32.add (local.get $dst) (i32.const 12))
                           (i32.shl (local.get $dst_i) (i32.const 2)))
                  (local.get $new_child))
                (local.set $dst_i (i32.add (local.get $dst_i) (i32.const 1))))
              (else
                (i32.store
                  (i32.add (i32.add (local.get $dst) (i32.const 12))
                           (i32.shl (local.get $dst_i) (i32.const 2)))
                  (i32.load (i32.add (i32.add (local.get $src) (i32.const 12))
                                      (i32.shl (local.get $src_i) (i32.const 2)))))
                (local.set $src_i (i32.add (local.get $src_i) (i32.const 1)))
                (local.set $dst_i (i32.add (local.get $dst_i) (i32.const 1)))))
            (br $cnext))))
      (else
        ;; Just copy existing children
        (local.set $i (i32.const 0))
        (block $cdone2
          (loop $cnext2
            (br_if $cdone2 (i32.ge_u (local.get $i) (local.get $old_child_count)))
            (i32.store
              (i32.add (i32.add (local.get $dst) (i32.const 12))
                       (i32.shl (local.get $i) (i32.const 2)))
              (i32.load (i32.add (i32.add (local.get $src) (i32.const 12))
                                  (i32.shl (local.get $i) (i32.const 2)))))
            (local.set $i (i32.add (local.get $i) (i32.const 1)))
            (br $cnext2)))))

    ;; Copy hash array, skipping removed entry
    (local.set $src_i (i32.const 0))
    (local.set $dst_i (i32.const 0))
    (block $hdone
      (loop $hnext
        (br_if $hdone (i32.ge_u (local.get $src_i) (local.get $data_count)))
        (if (i32.ne (local.get $src_i) (local.get $remove_kv_idx))
          (then
            (i32.store
              (i32.add (call $hashes_start (local.get $dst) (local.get $new_node_bm))
                       (i32.shl (local.get $dst_i) (i32.const 2)))
              (i32.load (i32.add (call $hashes_start (local.get $src) (local.get $src_node_bm))
                                  (i32.shl (local.get $src_i) (i32.const 2)))))
            (local.set $dst_i (i32.add (local.get $dst_i) (i32.const 1)))))
        (local.set $src_i (i32.add (local.get $src_i) (i32.const 1)))
        (br $hnext)))

    ;; Copy KV entries except remove_kv_idx
    (local.set $src_pos (call $kv_start (local.get $src) (local.get $src_data_bm) (local.get $src_node_bm)))
    (local.set $dst_kv_start (call $kv_start (local.get $dst) (local.get $new_data_bm) (local.get $new_node_bm)))
    (local.set $dst_pos (local.get $dst_kv_start))
    (local.set $i (i32.const 0))

    (block $kvdone
      (loop $kvnext
        (br_if $kvdone (i32.ge_u (local.get $i) (local.get $data_count)))

        (local.set $next_src (call $skip_kv (local.get $src_pos)))
        (local.set $kv_len (i32.sub (local.get $next_src) (local.get $src_pos)))

        (if (i32.ne (local.get $i) (local.get $remove_kv_idx))
          (then
            ;; Copy this entry
            (call $memcpy (local.get $dst_pos) (local.get $src_pos) (local.get $kv_len))
            (local.set $dst_pos (i32.add (local.get $dst_pos) (local.get $kv_len)))))

        (local.set $src_pos (local.get $next_src))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $kvnext)))

    ;; Cache kv_total_size in header bytes 2-3
    (i32.store16 (i32.add (local.get $dst) (i32.const 2))
                 (i32.sub (local.get $dst_pos) (local.get $dst_kv_start))))

  ;;==========================================================================
  ;; SIMD DESCRIPTOR SCANNING (Phase 1)
  ;;==========================================================================
  ;; Scan contiguous SoA status[] and capacity[] mirror arrays using v128.
  ;; 4 descriptors per SIMD iteration vs 1 per scalar iteration.

  ;; Find first free descriptor with sufficient capacity using SIMD.
  ;; status_arr: byte offset of status mirror (contiguous i32[N])
  ;; capacity_arr: byte offset of capacity mirror (contiguous i32[N])
  ;; Returns descriptor index or -1.
  (func $find_free_descriptor_simd (export "find_free_descriptor_simd")
    (param $status_arr i32)
    (param $capacity_arr i32)
    (param $count i32)
    (param $min_capacity i32)
    (param $start_idx i32)
    (result i32)
    (local $i i32)
    (local $simd_end i32)
    (local $statuses v128)
    (local $capacities v128)
    (local $free_mask v128)
    (local $unused_mask v128)
    (local $combined v128)
    (local $cap_ok v128)
    (local $final_mask v128)
    (local $lane i32)
    (local $byte_off i32)

    ;; Align start_idx up to multiple of 4 for SIMD, handle prefix scalarly
    (local.set $i (local.get $start_idx))

    ;; Scalar prefix: handle start_idx to next 4-aligned index
    (block $prefix_done
      (loop $prefix
        ;; Stop if aligned or past end
        (br_if $prefix_done (i32.eqz (i32.and (local.get $i) (i32.const 3))))
        (br_if $prefix_done (i32.ge_u (local.get $i) (local.get $count)))
        ;; Scalar check: status FREE(0) or ZEROED_UNUSED(-1), capacity >= min
        (if (i32.or
              (i32.eqz (i32.load (i32.add (local.get $status_arr)
                                           (i32.shl (local.get $i) (i32.const 2)))))
              (i32.eq (i32.load (i32.add (local.get $status_arr)
                                          (i32.shl (local.get $i) (i32.const 2))))
                      (i32.const -1)))
          (then
            (if (i32.ge_s (i32.load (i32.add (local.get $capacity_arr)
                                              (i32.shl (local.get $i) (i32.const 2))))
                          (local.get $min_capacity))
              (then (return (local.get $i))))))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $prefix)))

    ;; SIMD main loop: 4 descriptors per iteration
    ;; simd_end = count aligned down to multiple of 4
    (local.set $simd_end (i32.and (local.get $count) (i32.const -4)))

    (block $simd_done
      (loop $simd_loop
        (br_if $simd_done (i32.ge_u (local.get $i) (local.get $simd_end)))

        (local.set $byte_off (i32.shl (local.get $i) (i32.const 2)))

        ;; Load 4 statuses
        (local.set $statuses
          (v128.load (i32.add (local.get $status_arr) (local.get $byte_off))))

        ;; free_mask = i32x4.eq(statuses, splat(0))  — STATUS_FREE
        (local.set $free_mask
          (i32x4.eq (local.get $statuses) (i32x4.splat (i32.const 0))))

        ;; unused_mask = i32x4.eq(statuses, splat(-1)) — STATUS_ZEROED_UNUSED
        (local.set $unused_mask
          (i32x4.eq (local.get $statuses) (i32x4.splat (i32.const -1))))

        ;; combined = free | unused
        (local.set $combined
          (v128.or (local.get $free_mask) (local.get $unused_mask)))

        ;; Quick skip if no free/unused in this batch
        (if (v128.any_true (local.get $combined))
          (then
            ;; Load 4 capacities
            (local.set $capacities
              (v128.load (i32.add (local.get $capacity_arr) (local.get $byte_off))))

            ;; cap_ok = i32x4.ge_s(capacities, splat(min_capacity))
            ;; Note: WASM SIMD has no i32x4.ge_s. Use: NOT(i32x4.lt_s(cap, min))
            (local.set $cap_ok
              (v128.not (i32x4.lt_s (local.get $capacities)
                                     (i32x4.splat (local.get $min_capacity)))))

            ;; final = combined AND cap_ok
            (local.set $final_mask
              (v128.and (local.get $combined) (local.get $cap_ok)))

            ;; Check each lane for first match
            (if (i32x4.extract_lane 0 (local.get $final_mask))
              (then (return (local.get $i))))
            (if (i32x4.extract_lane 1 (local.get $final_mask))
              (then (return (i32.add (local.get $i) (i32.const 1)))))
            (if (i32x4.extract_lane 2 (local.get $final_mask))
              (then (return (i32.add (local.get $i) (i32.const 2)))))
            (if (i32x4.extract_lane 3 (local.get $final_mask))
              (then (return (i32.add (local.get $i) (i32.const 3)))))))

        (local.set $i (i32.add (local.get $i) (i32.const 4)))
        (br $simd_loop)))

    ;; Scalar tail: handle remaining (count % 4) descriptors
    (block $tail_done
      (loop $tail
        (br_if $tail_done (i32.ge_u (local.get $i) (local.get $count)))
        (if (i32.or
              (i32.eqz (i32.load (i32.add (local.get $status_arr)
                                           (i32.shl (local.get $i) (i32.const 2)))))
              (i32.eq (i32.load (i32.add (local.get $status_arr)
                                          (i32.shl (local.get $i) (i32.const 2))))
                      (i32.const -1)))
          (then
            (if (i32.ge_s (i32.load (i32.add (local.get $capacity_arr)
                                              (i32.shl (local.get $i) (i32.const 2))))
                          (local.get $min_capacity))
              (then (return (local.get $i))))))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $tail)))

    (i32.const -1))

  ;; Batch scan: find up to N free descriptors using SIMD.
  ;; Writes matching indices to output buffer. Returns count found.
  (func $find_free_descriptors_batch_simd (export "find_free_descriptors_batch_simd")
    (param $status_arr i32)
    (param $capacity_arr i32)
    (param $count i32)
    (param $min_capacity i32)
    (param $start_idx i32)
    (param $max_results i32)
    (param $out_ptr i32)
    (result i32)
    (local $i i32)
    (local $found i32)
    (local $simd_end i32)
    (local $statuses v128)
    (local $capacities v128)
    (local $free_mask v128)
    (local $unused_mask v128)
    (local $combined v128)
    (local $cap_ok v128)
    (local $final_mask v128)
    (local $byte_off i32)

    (local.set $i (local.get $start_idx))
    (local.set $found (i32.const 0))

    ;; Scalar prefix to align
    (block $prefix_done
      (loop $prefix
        (br_if $prefix_done (i32.eqz (i32.and (local.get $i) (i32.const 3))))
        (br_if $prefix_done (i32.ge_u (local.get $i) (local.get $count)))
        (br_if $prefix_done (i32.ge_u (local.get $found) (local.get $max_results)))
        (if (i32.or
              (i32.eqz (i32.load (i32.add (local.get $status_arr)
                                           (i32.shl (local.get $i) (i32.const 2)))))
              (i32.eq (i32.load (i32.add (local.get $status_arr)
                                          (i32.shl (local.get $i) (i32.const 2))))
                      (i32.const -1)))
          (then
            (if (i32.ge_s (i32.load (i32.add (local.get $capacity_arr)
                                              (i32.shl (local.get $i) (i32.const 2))))
                          (local.get $min_capacity))
              (then
                (i32.store
                  (i32.add (local.get $out_ptr)
                           (i32.shl (local.get $found) (i32.const 2)))
                  (local.get $i))
                (local.set $found (i32.add (local.get $found) (i32.const 1)))))))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $prefix)))

    ;; SIMD main loop
    (local.set $simd_end (i32.and (local.get $count) (i32.const -4)))

    (block $simd_done
      (loop $simd_loop
        (br_if $simd_done (i32.ge_u (local.get $i) (local.get $simd_end)))
        (br_if $simd_done (i32.ge_u (local.get $found) (local.get $max_results)))

        (local.set $byte_off (i32.shl (local.get $i) (i32.const 2)))
        (local.set $statuses
          (v128.load (i32.add (local.get $status_arr) (local.get $byte_off))))
        (local.set $free_mask
          (i32x4.eq (local.get $statuses) (i32x4.splat (i32.const 0))))
        (local.set $unused_mask
          (i32x4.eq (local.get $statuses) (i32x4.splat (i32.const -1))))
        (local.set $combined
          (v128.or (local.get $free_mask) (local.get $unused_mask)))

        (if (v128.any_true (local.get $combined))
          (then
            (local.set $capacities
              (v128.load (i32.add (local.get $capacity_arr) (local.get $byte_off))))
            (local.set $cap_ok
              (v128.not (i32x4.lt_s (local.get $capacities)
                                     (i32x4.splat (local.get $min_capacity)))))
            (local.set $final_mask
              (v128.and (local.get $combined) (local.get $cap_ok)))

            ;; Collect matching lanes
            (if (i32.and (i32x4.extract_lane 0 (local.get $final_mask))
                         (i32.lt_u (local.get $found) (local.get $max_results)))
              (then
                (i32.store (i32.add (local.get $out_ptr) (i32.shl (local.get $found) (i32.const 2)))
                           (local.get $i))
                (local.set $found (i32.add (local.get $found) (i32.const 1)))))
            (if (i32.and (i32x4.extract_lane 1 (local.get $final_mask))
                         (i32.lt_u (local.get $found) (local.get $max_results)))
              (then
                (i32.store (i32.add (local.get $out_ptr) (i32.shl (local.get $found) (i32.const 2)))
                           (i32.add (local.get $i) (i32.const 1)))
                (local.set $found (i32.add (local.get $found) (i32.const 1)))))
            (if (i32.and (i32x4.extract_lane 2 (local.get $final_mask))
                         (i32.lt_u (local.get $found) (local.get $max_results)))
              (then
                (i32.store (i32.add (local.get $out_ptr) (i32.shl (local.get $found) (i32.const 2)))
                           (i32.add (local.get $i) (i32.const 2)))
                (local.set $found (i32.add (local.get $found) (i32.const 1)))))
            (if (i32.and (i32x4.extract_lane 3 (local.get $final_mask))
                         (i32.lt_u (local.get $found) (local.get $max_results)))
              (then
                (i32.store (i32.add (local.get $out_ptr) (i32.shl (local.get $found) (i32.const 2)))
                           (i32.add (local.get $i) (i32.const 3)))
                (local.set $found (i32.add (local.get $found) (i32.const 1)))))))

        (local.set $i (i32.add (local.get $i) (i32.const 4)))
        (br $simd_loop)))

    ;; Scalar tail
    (block $tail_done
      (loop $tail
        (br_if $tail_done (i32.ge_u (local.get $i) (local.get $count)))
        (br_if $tail_done (i32.ge_u (local.get $found) (local.get $max_results)))
        (if (i32.or
              (i32.eqz (i32.load (i32.add (local.get $status_arr)
                                           (i32.shl (local.get $i) (i32.const 2)))))
              (i32.eq (i32.load (i32.add (local.get $status_arr)
                                          (i32.shl (local.get $i) (i32.const 2))))
                      (i32.const -1)))
          (then
            (if (i32.ge_s (i32.load (i32.add (local.get $capacity_arr)
                                              (i32.shl (local.get $i) (i32.const 2))))
                          (local.get $min_capacity))
              (then
                (i32.store
                  (i32.add (local.get $out_ptr)
                           (i32.shl (local.get $found) (i32.const 2)))
                  (local.get $i))
                (local.set $found (i32.add (local.get $found) (i32.const 1)))))))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $tail)))

    (local.get $found))

  ;;==========================================================================
  ;; SIMD RETIRED DESCRIPTOR SCAN
  ;;==========================================================================

  ;; Scan status mirror for STATUS_RETIRED (5) using SIMD, collect indices.
  ;; Returns count of retired descriptors found, writes indices to out_ptr.
  (func $find_retired_descriptors_simd (export "find_retired_descriptors_simd")
    (param $status_arr i32)     ;; byte offset of status mirror in shared memory
    (param $count i32)          ;; number of descriptors
    (param $out_ptr i32)        ;; output buffer for retired descriptor indices
    (param $max_results i32)    ;; max number of results to collect
    (result i32)                ;; count found

    (local $i i32)
    (local $found i32)
    (local $byte_off i32)
    (local $statuses v128)
    (local $retired_mask v128)
    (local $count_aligned i32)

    (local.set $i (i32.const 0))
    (local.set $found (i32.const 0))

    ;; Scalar prefix: align to 4-boundary
    (block $prefix_done
      (loop $prefix
        (br_if $prefix_done (i32.eqz (i32.and (local.get $i) (i32.const 3))))
        (br_if $prefix_done (i32.ge_u (local.get $i) (local.get $count)))
        (br_if $prefix_done (i32.ge_u (local.get $found) (local.get $max_results)))
        (if (i32.eq (i32.load (i32.add (local.get $status_arr)
                                        (i32.shl (local.get $i) (i32.const 2))))
                    (i32.const 5))
          (then
            (i32.store
              (i32.add (local.get $out_ptr)
                       (i32.shl (local.get $found) (i32.const 2)))
              (local.get $i))
            (local.set $found (i32.add (local.get $found) (i32.const 1)))))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $prefix)))

    ;; SIMD main loop: 4 descriptors per iteration
    (local.set $count_aligned (i32.and (local.get $count) (i32.const -4)))
    (block $simd_done
      (loop $simd_loop
        (br_if $simd_done (i32.ge_u (local.get $i) (local.get $count_aligned)))
        (br_if $simd_done (i32.ge_u (local.get $found) (local.get $max_results)))

        ;; Load 4 statuses
        (local.set $byte_off (i32.add (local.get $status_arr)
                                       (i32.shl (local.get $i) (i32.const 2))))
        (local.set $statuses (v128.load (local.get $byte_off)))

        ;; retired_mask = i32x4.eq(statuses, splat(5))  ;; STATUS_RETIRED = 5
        (local.set $retired_mask (i32x4.eq (local.get $statuses)
                                            (i32x4.splat (i32.const 5))))

        ;; Quick skip if no retired in this group
        (if (v128.any_true (local.get $retired_mask))
          (then
            ;; Check each lane
            (if (i32x4.extract_lane 0 (local.get $retired_mask))
              (then
                (if (i32.lt_u (local.get $found) (local.get $max_results))
                  (then
                    (i32.store
                      (i32.add (local.get $out_ptr)
                               (i32.shl (local.get $found) (i32.const 2)))
                      (local.get $i))
                    (local.set $found (i32.add (local.get $found) (i32.const 1)))))))
            (if (i32x4.extract_lane 1 (local.get $retired_mask))
              (then
                (if (i32.lt_u (local.get $found) (local.get $max_results))
                  (then
                    (i32.store
                      (i32.add (local.get $out_ptr)
                               (i32.shl (local.get $found) (i32.const 2)))
                      (i32.add (local.get $i) (i32.const 1)))
                    (local.set $found (i32.add (local.get $found) (i32.const 1)))))))
            (if (i32x4.extract_lane 2 (local.get $retired_mask))
              (then
                (if (i32.lt_u (local.get $found) (local.get $max_results))
                  (then
                    (i32.store
                      (i32.add (local.get $out_ptr)
                               (i32.shl (local.get $found) (i32.const 2)))
                      (i32.add (local.get $i) (i32.const 2)))
                    (local.set $found (i32.add (local.get $found) (i32.const 1)))))))
            (if (i32x4.extract_lane 3 (local.get $retired_mask))
              (then
                (if (i32.lt_u (local.get $found) (local.get $max_results))
                  (then
                    (i32.store
                      (i32.add (local.get $out_ptr)
                               (i32.shl (local.get $found) (i32.const 2)))
                      (i32.add (local.get $i) (i32.const 3)))
                    (local.set $found (i32.add (local.get $found) (i32.const 1)))))))))

        (local.set $i (i32.add (local.get $i) (i32.const 4)))
        (br $simd_loop)))

    ;; Scalar tail
    (block $tail_done
      (loop $tail
        (br_if $tail_done (i32.ge_u (local.get $i) (local.get $count)))
        (br_if $tail_done (i32.ge_u (local.get $found) (local.get $max_results)))
        (if (i32.eq (i32.load (i32.add (local.get $status_arr)
                                        (i32.shl (local.get $i) (i32.const 2))))
                    (i32.const 5))
          (then
            (i32.store
              (i32.add (local.get $out_ptr)
                       (i32.shl (local.get $found) (i32.const 2)))
              (local.get $i))
            (local.set $found (i32.add (local.get $found) (i32.const 1)))))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $tail)))

    (local.get $found))

  ;;==========================================================================
  ;; HAMT BATCH COLLECT (for iteration acceleration)
  ;;==========================================================================

  ;; Collect all KV entry offsets from an entire HAMT tree into a flat buffer.
  ;; Output per entry: [key_data_off:i32, key_len:i32, val_data_off:i32, val_len:i32]
  ;; = 16 bytes per entry.
  ;; Uses an explicit stack (after output area) to avoid WASM call stack limits.
  ;; Returns the number of entries written.
  (func $hamt_collect_kv (export "hamt_collect_kv")
    (param $root i32)          ;; Root node offset (-1 = empty)
    (param $out_buf i32)       ;; Output buffer offset in SAB
    (param $max_entries i32)   ;; Max entries to collect
    (result i32)               ;; Number of entries written

    (local $stack_base i32)    ;; Base of explicit stack (after output)
    (local $sp i32)            ;; Stack pointer (grows upward)
    (local $out_idx i32)       ;; Current output index
    (local $node_off i32)
    (local $node_type i32)
    (local $data_bm i32)
    (local $node_bm i32)
    (local $data_count i32)
    (local $child_count i32)
    (local $kv_pos i32)
    (local $i i32)
    (local $key_len i32)
    (local $val_off i32)
    (local $val_len i32)
    (local $out_ptr i32)

    ;; Empty tree
    (if (i32.eq (local.get $root) (i32.const -1))
      (then (return (i32.const 0))))

    ;; Stack lives after output: out_buf + max_entries * 16
    (local.set $stack_base
      (i32.add (local.get $out_buf)
        (i32.shl (local.get $max_entries) (i32.const 4))))
    (local.set $sp (local.get $stack_base))
    (local.set $out_idx (i32.const 0))

    ;; Push root
    (i32.store (local.get $sp) (local.get $root))
    (local.set $sp (i32.add (local.get $sp) (i32.const 4)))

    ;; Main loop
    (block $done
      (loop $main
        ;; Done if stack empty
        (br_if $done (i32.eq (local.get $sp) (local.get $stack_base)))
        ;; Done if output full
        (br_if $done (i32.ge_u (local.get $out_idx) (local.get $max_entries)))

        ;; Pop node
        (local.set $sp (i32.sub (local.get $sp) (i32.const 4)))
        (local.set $node_off (i32.load (local.get $sp)))

        ;; Read node type
        (local.set $node_type (i32.load8_u (local.get $node_off)))

        ;; Bitmap node (type 1)
        (if (i32.eq (local.get $node_type) (i32.const 1))
          (then
            (local.set $data_bm (i32.load (i32.add (local.get $node_off) (i32.const 4))))
            (local.set $node_bm (i32.load (i32.add (local.get $node_off) (i32.const 8))))
            (local.set $data_count (i32.popcnt (local.get $data_bm)))
            (local.set $child_count (i32.popcnt (local.get $node_bm)))

            ;; Process inline data entries
            (local.set $kv_pos
              (call $kv_start (local.get $node_off) (local.get $data_bm) (local.get $node_bm)))
            (local.set $i (i32.const 0))
            (block $data_done
              (loop $data_next
                (br_if $data_done (i32.ge_u (local.get $i) (local.get $data_count)))
                (br_if $data_done (i32.ge_u (local.get $out_idx) (local.get $max_entries)))

                ;; Read key_len, compute offsets
                (local.set $key_len (i32.load (local.get $kv_pos)))
                (local.set $val_off
                  (i32.add (local.get $kv_pos)
                    (i32.add (i32.const 4) (local.get $key_len))))
                (local.set $val_len (i32.load (local.get $val_off)))

                ;; Write 4-tuple to output
                (local.set $out_ptr
                  (i32.add (local.get $out_buf)
                    (i32.shl (local.get $out_idx) (i32.const 4))))
                (i32.store (local.get $out_ptr)
                  (i32.add (local.get $kv_pos) (i32.const 4)))
                (i32.store (i32.add (local.get $out_ptr) (i32.const 4))
                  (local.get $key_len))
                (i32.store (i32.add (local.get $out_ptr) (i32.const 8))
                  (i32.add (local.get $val_off) (i32.const 4)))
                (i32.store (i32.add (local.get $out_ptr) (i32.const 12))
                  (local.get $val_len))

                (local.set $out_idx (i32.add (local.get $out_idx) (i32.const 1)))

                ;; Advance past this KV entry
                (local.set $kv_pos
                  (i32.add (local.get $val_off)
                    (i32.add (i32.const 4) (local.get $val_len))))
                (local.set $i (i32.add (local.get $i) (i32.const 1)))
                (br $data_next)))

            ;; Push children in REVERSE order (so leftmost child is popped first)
            (if (i32.gt_u (local.get $child_count) (i32.const 0))
              (then
                (local.set $i (i32.sub (local.get $child_count) (i32.const 1)))
                (block $push_done
                  (loop $push_next
                    (i32.store (local.get $sp)
                      (i32.load (i32.add
                        (i32.add (local.get $node_off) (i32.const 12))
                        (i32.shl (local.get $i) (i32.const 2)))))
                    (local.set $sp (i32.add (local.get $sp) (i32.const 4)))
                    (br_if $push_done (i32.eqz (local.get $i)))
                    (local.set $i (i32.sub (local.get $i) (i32.const 1)))
                    (br $push_next)))))))

        ;; Collision node (type 3)
        (if (i32.eq (local.get $node_type) (i32.const 3))
          (then
            (local.set $data_count (i32.load8_u (i32.add (local.get $node_off) (i32.const 1))))
            (local.set $kv_pos (i32.add (local.get $node_off) (i32.const 8)))
            (local.set $i (i32.const 0))
            (block $coll_done
              (loop $coll_next
                (br_if $coll_done (i32.ge_u (local.get $i) (local.get $data_count)))
                (br_if $coll_done (i32.ge_u (local.get $out_idx) (local.get $max_entries)))

                (local.set $key_len (i32.load (local.get $kv_pos)))
                (local.set $val_off
                  (i32.add (local.get $kv_pos)
                    (i32.add (i32.const 4) (local.get $key_len))))
                (local.set $val_len (i32.load (local.get $val_off)))

                (local.set $out_ptr
                  (i32.add (local.get $out_buf)
                    (i32.shl (local.get $out_idx) (i32.const 4))))
                (i32.store (local.get $out_ptr)
                  (i32.add (local.get $kv_pos) (i32.const 4)))
                (i32.store (i32.add (local.get $out_ptr) (i32.const 4))
                  (local.get $key_len))
                (i32.store (i32.add (local.get $out_ptr) (i32.const 8))
                  (i32.add (local.get $val_off) (i32.const 4)))
                (i32.store (i32.add (local.get $out_ptr) (i32.const 12))
                  (local.get $val_len))

                (local.set $out_idx (i32.add (local.get $out_idx) (i32.const 1)))
                (local.set $kv_pos
                  (i32.add (local.get $val_off)
                    (i32.add (i32.const 4) (local.get $val_len))))
                (local.set $i (i32.add (local.get $i) (i32.const 1)))
                (br $coll_next)))))

        (br $main)))

    (local.get $out_idx))

  ;;==========================================================================
  ;; HAMT NUMERIC REDUCE (sum all values as f64)
  ;;==========================================================================

  ;; Walk entire HAMT tree, sum all values as f64.
  ;; Values must be INT32 (tag 0x03) or FLOAT64 (tag 0x04).
  ;; Returns NaN if any non-numeric value is encountered (signal JS fallback).
  ;; Uses stack_buf for explicit iteration stack.
  (func $hamt_reduce_sum (export "hamt_reduce_sum")
    (param $root i32)       ;; Root node offset (-1 = empty)
    (param $stack_buf i32)  ;; Buffer for explicit stack (≥1KB in scratch)
    (result f64)            ;; Sum, or NaN if non-numeric

    (local $stack_base i32)
    (local $sp i32)
    (local $acc f64)
    (local $node_off i32)
    (local $node_type i32)
    (local $data_bm i32)
    (local $node_bm i32)
    (local $data_count i32)
    (local $child_count i32)
    (local $kv_pos i32)
    (local $i i32)
    (local $key_len i32)
    (local $val_off i32)
    (local $val_data i32)
    (local $val_tag i32)

    ;; Empty tree → 0.0
    (if (i32.eq (local.get $root) (i32.const -1))
      (then (return (f64.const 0.0))))

    (local.set $stack_base (local.get $stack_buf))
    (local.set $sp (local.get $stack_base))
    (local.set $acc (f64.const 0.0))

    ;; Push root
    (i32.store (local.get $sp) (local.get $root))
    (local.set $sp (i32.add (local.get $sp) (i32.const 4)))

    (block $done
      (loop $main
        (br_if $done (i32.eq (local.get $sp) (local.get $stack_base)))

        ;; Pop
        (local.set $sp (i32.sub (local.get $sp) (i32.const 4)))
        (local.set $node_off (i32.load (local.get $sp)))
        (local.set $node_type (i32.load8_u (local.get $node_off)))

        ;; Bitmap node (type 1)
        (if (i32.eq (local.get $node_type) (i32.const 1))
          (then
            (local.set $data_bm (i32.load (i32.add (local.get $node_off) (i32.const 4))))
            (local.set $node_bm (i32.load (i32.add (local.get $node_off) (i32.const 8))))
            (local.set $data_count (i32.popcnt (local.get $data_bm)))
            (local.set $child_count (i32.popcnt (local.get $node_bm)))

            ;; Sum data entries
            (local.set $kv_pos
              (call $kv_start (local.get $node_off) (local.get $data_bm) (local.get $node_bm)))
            (local.set $i (i32.const 0))
            (block $data_done
              (loop $data_next
                (br_if $data_done (i32.ge_u (local.get $i) (local.get $data_count)))

                ;; Skip key, get value data start
                (local.set $key_len (i32.load (local.get $kv_pos)))
                (local.set $val_off
                  (i32.add (local.get $kv_pos)
                    (i32.add (i32.const 4) (local.get $key_len))))
                ;; val_data = val_off + 4 (skip val_len field)
                (local.set $val_data (i32.add (local.get $val_off) (i32.const 4)))
                ;; Tag at val_data + 2
                (local.set $val_tag (i32.load8_u (i32.add (local.get $val_data) (i32.const 2))))

                (if (i32.eq (local.get $val_tag) (i32.const 0x03))
                  (then
                    ;; INT32: 4 bytes at val_data + 3
                    (local.set $acc (f64.add (local.get $acc)
                      (f64.convert_i32_s (i32.load (i32.add (local.get $val_data) (i32.const 3)))))))
                  (else (if (i32.eq (local.get $val_tag) (i32.const 0x04))
                    (then
                      ;; FLOAT64: 8 bytes at val_data + 3 (possibly unaligned)
                      (local.set $acc (f64.add (local.get $acc)
                        (f64.load align=1 (i32.add (local.get $val_data) (i32.const 3))))))
                    (else
                      ;; Non-numeric → return NaN
                      (return (f64.const nan))))))

                ;; Advance past entry
                (local.set $kv_pos (call $skip_kv (local.get $kv_pos)))
                (local.set $i (i32.add (local.get $i) (i32.const 1)))
                (br $data_next)))

            ;; Push children in reverse order
            (if (i32.gt_u (local.get $child_count) (i32.const 0))
              (then
                (local.set $i (i32.sub (local.get $child_count) (i32.const 1)))
                (block $push_done
                  (loop $push_next
                    (i32.store (local.get $sp)
                      (i32.load (i32.add
                        (i32.add (local.get $node_off) (i32.const 12))
                        (i32.shl (local.get $i) (i32.const 2)))))
                    (local.set $sp (i32.add (local.get $sp) (i32.const 4)))
                    (br_if $push_done (i32.eqz (local.get $i)))
                    (local.set $i (i32.sub (local.get $i) (i32.const 1)))
                    (br $push_next)))))))

        ;; Collision node (type 3)
        (if (i32.eq (local.get $node_type) (i32.const 3))
          (then
            (local.set $data_count (i32.load8_u (i32.add (local.get $node_off) (i32.const 1))))
            (local.set $kv_pos (i32.add (local.get $node_off) (i32.const 8)))
            (local.set $i (i32.const 0))
            (block $coll_done
              (loop $coll_next
                (br_if $coll_done (i32.ge_u (local.get $i) (local.get $data_count)))

                (local.set $key_len (i32.load (local.get $kv_pos)))
                (local.set $val_off
                  (i32.add (local.get $kv_pos)
                    (i32.add (i32.const 4) (local.get $key_len))))
                (local.set $val_data (i32.add (local.get $val_off) (i32.const 4)))
                (local.set $val_tag (i32.load8_u (i32.add (local.get $val_data) (i32.const 2))))

                (if (i32.eq (local.get $val_tag) (i32.const 0x03))
                  (then
                    (local.set $acc (f64.add (local.get $acc)
                      (f64.convert_i32_s (i32.load (i32.add (local.get $val_data) (i32.const 3)))))))
                  (else (if (i32.eq (local.get $val_tag) (i32.const 0x04))
                    (then
                      (local.set $acc (f64.add (local.get $acc)
                        (f64.load align=1 (i32.add (local.get $val_data) (i32.const 3))))))
                    (else
                      (return (f64.const nan))))))

                (local.set $kv_pos (call $skip_kv (local.get $kv_pos)))
                (local.set $i (i32.add (local.get $i) (i32.const 1)))
                (br $coll_next)))))

        (br $main)))

    (local.get $acc))

  ;;==========================================================================
  ;; DESERIALIZATION TAG DISPATCH
  ;;==========================================================================

  ;; Extract tag + payload info from a serialized value in one WASM call.
  ;; Validates magic prefix (0xEE 0xDB), reads tag, computes payload location.
  ;; Returns tag byte (0 = nil, -1 = bad magic/fallback).
  ;; Writes to out buffer: [payload_start:i32, payload_val:i32]
  ;;   payload_start: byte offset where payload data begins
  ;;   payload_val: for INT32: actual i32 value; for BOOL: 0/1;
  ;;     for strings/keywords: byte length; for SAB ptrs: instance offset
  (func $deser_tag_info (export "deser_tag_info")
    (param $off i32)     ;; Data offset in SAB
    (param $len i32)     ;; Data length
    (param $out i32)     ;; Output buffer for 2 × i32
    (result i32)         ;; tag byte, 0 for nil, -1 for bad magic

    (local $tag i32)
    (local $str_len i32)

    ;; nil: length == 0
    (if (i32.eqz (local.get $len))
      (then (return (i32.const 0))))

    ;; Validate magic prefix: need >= 3 bytes, first two = 0xEE 0xDB
    (if (i32.or
          (i32.lt_u (local.get $len) (i32.const 3))
          (i32.or
            (i32.ne (i32.load8_u (local.get $off)) (i32.const 0xEE))
            (i32.ne (i32.load8_u (i32.add (local.get $off) (i32.const 1))) (i32.const 0xDB))))
      (then (return (i32.const -1))))

    ;; Read tag
    (local.set $tag (i32.load8_u (i32.add (local.get $off) (i32.const 2))))

    ;; Dispatch on tag using br_table for O(1) jump
    ;; Tags: 0x00=unused, 0x01=FALSE, 0x02=TRUE, 0x03=INT32, 0x04=FLOAT64,
    ;; 0x05=STRING_SHORT, 0x06=STRING_LONG, 0x07=KW_SHORT, 0x08=KW_LONG,
    ;; 0x09=KW_NS_SHORT, 0x0A=KW_NS_LONG, 0x0B=UUID, 0x0C=SYM_SHORT,
    ;; 0x0D=SYM_NS_SHORT, 0x0E=DATE, 0x0F=INT64
    (block $default
    (block $int64     ;; 0x0F
    (block $date      ;; 0x0E
    (block $sym_ns    ;; 0x0D
    (block $sym       ;; 0x0C
    (block $uuid      ;; 0x0B
    (block $kw_ns_l   ;; 0x0A
    (block $kw_ns_s   ;; 0x09
    (block $kw_long   ;; 0x08
    (block $kw_short  ;; 0x07
    (block $str_long  ;; 0x06
    (block $str_short ;; 0x05
    (block $float64   ;; 0x04
    (block $int32     ;; 0x03
    (block $true_     ;; 0x02
    (block $false_    ;; 0x01
    (block $unused    ;; 0x00
      (br_table $unused $false_ $true_ $int32 $float64
                $str_short $str_long $kw_short $kw_long
                $kw_ns_s $kw_ns_l $uuid $sym $sym_ns $date $int64
                $default
                (local.get $tag))

    ;; 0x00 unused
    ) ;; $unused
    (return (i32.const -1))

    ;; 0x01 FALSE: payload_val = 0
    ) ;; $false_
    (i32.store (local.get $out) (i32.const 0))
    (i32.store (i32.add (local.get $out) (i32.const 4)) (i32.const 0))
    (return (i32.const 0x01))

    ;; 0x02 TRUE: payload_val = 1
    ) ;; $true_
    (i32.store (local.get $out) (i32.const 0))
    (i32.store (i32.add (local.get $out) (i32.const 4)) (i32.const 1))
    (return (i32.const 0x02))

    ;; 0x03 INT32: payload_start = off+3, payload_val = actual i32 value
    ) ;; $int32
    (i32.store (local.get $out) (i32.add (local.get $off) (i32.const 3)))
    (i32.store (i32.add (local.get $out) (i32.const 4))
      (i32.load (i32.add (local.get $off) (i32.const 3))))
    (return (i32.const 0x03))

    ;; 0x04 FLOAT64: payload_start = off+3, payload_val = 8 (byte length)
    ) ;; $float64
    (i32.store (local.get $out) (i32.add (local.get $off) (i32.const 3)))
    (i32.store (i32.add (local.get $out) (i32.const 4)) (i32.const 8))
    (return (i32.const 0x04))

    ;; 0x05 STRING_SHORT: payload_start = off+4, payload_val = str_len (u8)
    ) ;; $str_short
    (local.set $str_len (i32.load8_u (i32.add (local.get $off) (i32.const 3))))
    (i32.store (local.get $out) (i32.add (local.get $off) (i32.const 4)))
    (i32.store (i32.add (local.get $out) (i32.const 4)) (local.get $str_len))
    (return (i32.const 0x05))

    ;; 0x06 STRING_LONG: payload_start = off+7, payload_val = str_len (u32)
    ) ;; $str_long
    (local.set $str_len (i32.load (i32.add (local.get $off) (i32.const 3))))
    (i32.store (local.get $out) (i32.add (local.get $off) (i32.const 7)))
    (i32.store (i32.add (local.get $out) (i32.const 4)) (local.get $str_len))
    (return (i32.const 0x06))

    ;; 0x07 KEYWORD_SHORT: payload_start = off+4, payload_val = str_len (u8)
    ) ;; $kw_short
    (local.set $str_len (i32.load8_u (i32.add (local.get $off) (i32.const 3))))
    (i32.store (local.get $out) (i32.add (local.get $off) (i32.const 4)))
    (i32.store (i32.add (local.get $out) (i32.const 4)) (local.get $str_len))
    (return (i32.const 0x07))

    ;; 0x08 KEYWORD_LONG: payload_start = off+7, payload_val = str_len (u32)
    ) ;; $kw_long
    (local.set $str_len (i32.load (i32.add (local.get $off) (i32.const 3))))
    (i32.store (local.get $out) (i32.add (local.get $off) (i32.const 7)))
    (i32.store (i32.add (local.get $out) (i32.const 4)) (local.get $str_len))
    (return (i32.const 0x08))

    ;; 0x09 KW_NS_SHORT: payload_start = off+3, payload_val = ns_len (u8)
    ;; JS handles the complex two-part decoding
    ) ;; $kw_ns_s
    (i32.store (local.get $out) (i32.add (local.get $off) (i32.const 3)))
    (i32.store (i32.add (local.get $out) (i32.const 4))
      (i32.load8_u (i32.add (local.get $off) (i32.const 3))))
    (return (i32.const 0x09))

    ;; 0x0A KW_NS_LONG: payload_start = off+3, payload_val = ns_len (u32)
    ) ;; $kw_ns_l
    (i32.store (local.get $out) (i32.add (local.get $off) (i32.const 3)))
    (i32.store (i32.add (local.get $out) (i32.const 4))
      (i32.load (i32.add (local.get $off) (i32.const 3))))
    (return (i32.const 0x0A))

    ;; 0x0B UUID: payload_start = off+3, payload_val = 16
    ) ;; $uuid
    (i32.store (local.get $out) (i32.add (local.get $off) (i32.const 3)))
    (i32.store (i32.add (local.get $out) (i32.const 4)) (i32.const 16))
    (return (i32.const 0x0B))

    ;; 0x0C SYMBOL_SHORT: payload_start = off+4, payload_val = str_len (u8)
    ) ;; $sym
    (local.set $str_len (i32.load8_u (i32.add (local.get $off) (i32.const 3))))
    (i32.store (local.get $out) (i32.add (local.get $off) (i32.const 4)))
    (i32.store (i32.add (local.get $out) (i32.const 4)) (local.get $str_len))
    (return (i32.const 0x0C))

    ;; 0x0D SYMBOL_NS_SHORT: payload_start = off+3, payload_val = ns_len (u8)
    ) ;; $sym_ns
    (i32.store (local.get $out) (i32.add (local.get $off) (i32.const 3)))
    (i32.store (i32.add (local.get $out) (i32.const 4))
      (i32.load8_u (i32.add (local.get $off) (i32.const 3))))
    (return (i32.const 0x0D))

    ;; 0x0E DATE: payload_start = off+3, payload_val = 8
    ) ;; $date
    (i32.store (local.get $out) (i32.add (local.get $off) (i32.const 3)))
    (i32.store (i32.add (local.get $out) (i32.const 4)) (i32.const 8))
    (return (i32.const 0x0E))

    ;; 0x0F INT64: payload_start = off+3, payload_val = 8
    ) ;; $int64
    (i32.store (local.get $out) (i32.add (local.get $off) (i32.const 3)))
    (i32.store (i32.add (local.get $out) (i32.const 4)) (i32.const 8))
    (return (i32.const 0x0F))

    ) ;; $default
    ;; Tags >= 0x10: SAB pointers and records
    ;; payload_start = 0, payload_val = instance offset (i32 at off+3)
    (if (i32.and (i32.ge_u (local.get $tag) (i32.const 0x10))
                 (i32.le_u (local.get $tag) (i32.const 0x1A)))
      (then
        (i32.store (local.get $out) (i32.const 0))
        (i32.store (i32.add (local.get $out) (i32.const 4))
          (i32.load (i32.add (local.get $off) (i32.const 3))))
        (return (local.get $tag))))

    ;; Unknown tag — fallback
    (i32.const -1))

  ;;==========================================================================
  ;; VEC BATCH OPERATIONS
  ;;==========================================================================

  ;; Collect [val_data_off, val_data_len] for all elements in a SabVec trie + tail.
  ;; Uses explicit stack for DFS of the 32-way trie.
  ;; Output: [val_data_off:i32, val_data_len:i32] × N at out_buf.
  ;; Stack placed after output buffer: out_buf + max_entries * 8.
  ;; Returns: number of entries collected.
  (func $vec_collect_values (export "vec_collect_values")
    (param $root i32)        ;; Root node offset (-1 = empty trie)
    (param $tail i32)        ;; Tail node offset (-1 = no tail)
    (param $cnt i32)         ;; Total element count
    (param $shift i32)       ;; Trie shift (5 = leaf, 10 = 1 internal, etc.)
    (param $tail_len i32)    ;; Number of elements in tail
    (param $out_buf i32)     ;; Output buffer
    (param $max_entries i32) ;; Max entries to collect
    (result i32)             ;; Count of entries written

    (local $out_count i32)
    (local $stack_base i32)
    (local $sp i32)
    (local $node_off i32)
    (local $level i32)
    (local $i i32)
    (local $slot_val i32)
    (local $val_len i32)
    (local $trie_cnt i32)

    ;; Empty vec → 0
    (if (i32.eqz (local.get $cnt))
      (then (return (i32.const 0))))

    (local.set $out_count (i32.const 0))
    ;; trie_cnt = cnt - tail_len
    (local.set $trie_cnt (i32.sub (local.get $cnt) (local.get $tail_len)))
    ;; Stack starts after output buffer
    (local.set $stack_base (i32.add (local.get $out_buf)
      (i32.shl (local.get $max_entries) (i32.const 3))))
    (local.set $sp (local.get $stack_base))

    ;; Process trie if non-empty
    (if (i32.and
          (i32.ne (local.get $root) (i32.const -1))
          (i32.gt_u (local.get $trie_cnt) (i32.const 0)))
      (then
        ;; Push (root, shift) onto stack as two i32s
        ;; nth-impl starts at sh=shift: level>0 is internal, level==0 is leaf
        (i32.store (local.get $sp) (local.get $root))
        (i32.store (i32.add (local.get $sp) (i32.const 4))
          (local.get $shift))
        (local.set $sp (i32.add (local.get $sp) (i32.const 8)))

        (block $done
          (loop $main
            (br_if $done (i32.eq (local.get $sp) (local.get $stack_base)))
            (br_if $done (i32.ge_u (local.get $out_count) (local.get $max_entries)))

            ;; Pop (node_off, level)
            (local.set $sp (i32.sub (local.get $sp) (i32.const 8)))
            (local.set $node_off (i32.load (local.get $sp)))
            (local.set $level (i32.load (i32.add (local.get $sp) (i32.const 4))))

            (if (i32.eqz (local.get $level))
              (then
                ;; Leaf node: collect value block offsets
                (local.set $i (i32.const 0))
                (block $leaf_done
                  (loop $leaf_next
                    (br_if $leaf_done (i32.ge_u (local.get $i) (i32.const 32)))
                    (br_if $leaf_done (i32.ge_u (local.get $out_count) (local.get $trie_cnt)))
                    (br_if $leaf_done (i32.ge_u (local.get $out_count) (local.get $max_entries)))

                    (local.set $slot_val (i32.load
                      (i32.add (local.get $node_off)
                        (i32.shl (local.get $i) (i32.const 2)))))

                    (if (i32.ne (local.get $slot_val) (i32.const -1))
                      (then
                        ;; Value block: [len:u32][bytes...]
                        ;; val_data_off = slot_val + 4, val_data_len = load(slot_val)
                        (local.set $val_len (i32.load (local.get $slot_val)))
                        (i32.store
                          (i32.add (local.get $out_buf)
                            (i32.shl (local.get $out_count) (i32.const 3)))
                          (i32.add (local.get $slot_val) (i32.const 4)))
                        (i32.store
                          (i32.add
                            (i32.add (local.get $out_buf)
                              (i32.shl (local.get $out_count) (i32.const 3)))
                            (i32.const 4))
                          (local.get $val_len))
                        (local.set $out_count
                          (i32.add (local.get $out_count) (i32.const 1)))))

                    (local.set $i (i32.add (local.get $i) (i32.const 1)))
                    (br $leaf_next))))
              (else
                ;; Internal node: push children in reverse order (so slot 0 is processed first)
                (local.set $i (i32.const 31))
                (block $push_done
                  (loop $push_next
                    (local.set $slot_val (i32.load
                      (i32.add (local.get $node_off)
                        (i32.shl (local.get $i) (i32.const 2)))))
                    (if (i32.ne (local.get $slot_val) (i32.const -1))
                      (then
                        (i32.store (local.get $sp) (local.get $slot_val))
                        (i32.store (i32.add (local.get $sp) (i32.const 4))
                          (i32.sub (local.get $level) (i32.const 5)))
                        (local.set $sp (i32.add (local.get $sp) (i32.const 8)))))
                    (br_if $push_done (i32.eqz (local.get $i)))
                    (local.set $i (i32.sub (local.get $i) (i32.const 1)))
                    (br $push_next)))))

            (br $main)))))

    ;; Process tail
    (if (i32.and
          (i32.ne (local.get $tail) (i32.const -1))
          (i32.gt_u (local.get $tail_len) (i32.const 0)))
      (then
        (local.set $i (i32.const 0))
        (block $tail_done
          (loop $tail_next
            (br_if $tail_done (i32.ge_u (local.get $i) (local.get $tail_len)))
            (br_if $tail_done (i32.ge_u (local.get $out_count) (local.get $max_entries)))

            (local.set $slot_val (i32.load
              (i32.add (local.get $tail)
                (i32.shl (local.get $i) (i32.const 2)))))

            (if (i32.ne (local.get $slot_val) (i32.const -1))
              (then
                (local.set $val_len (i32.load (local.get $slot_val)))
                (i32.store
                  (i32.add (local.get $out_buf)
                    (i32.shl (local.get $out_count) (i32.const 3)))
                  (i32.add (local.get $slot_val) (i32.const 4)))
                (i32.store
                  (i32.add
                    (i32.add (local.get $out_buf)
                      (i32.shl (local.get $out_count) (i32.const 3)))
                    (i32.const 4))
                  (local.get $val_len))
                (local.set $out_count
                  (i32.add (local.get $out_count) (i32.const 1)))))

            (local.set $i (i32.add (local.get $i) (i32.const 1)))
            (br $tail_next)))))

    (local.get $out_count))

)
