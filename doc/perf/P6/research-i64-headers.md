# Research: i64 Slab Headers + Class Spillover

## 1. i64 Header Migration

### Problem
Slab header fields (`SLAB_HDR_TOTAL_BLOCKS`, `SLAB_HDR_DATA_OFFSET`,
`COALESC_HDR_DATA_SIZE`) are i32, capping each slab at ~2 GB. With i64
the theoretical ceiling is **8 EiB** (2^63 - 1 bytes).

### Fields to Migrate

**Bitmap slab header** (data.cljc invariants table):
| Offset | Field | Current | Proposed |
|--------|-------|---------|----------|
| 0 | magic | i32 | i32 (unchanged) |
| 4 | block size | i32 | i32 (unchanged) |
| 8 | total blocks | i32 → **i64** | enables >2G blocks |
| 16 | free count (atomic) | i32 → **i64** | must match total blocks width |
| 24 | alloc cursor | i32 → **i64** | scan position |
| 32 | class index | i32 | i32 (unchanged, values 0-6) |
| 36 | bitmap offset | i32 → **i64** | byte offset into file |
| 44 | data offset | i32 → **i64** | byte offset into file |
| 52 | (new) version | i32 | migration marker |
| 56 | padding | — | align to 64 bytes |

New header size: **64 bytes** (up from 32).

**Coalesc header** (coalesc.cljc):
| Offset | Field | Current | Proposed |
|--------|-------|---------|----------|
| 32 | data-region size | i32 → **i64** | enables >2G data region |

With the new bitmap slab header at 64 bytes, coalesc inherits it.
`COALESC_HDR_DATA_SIZE` moves to offset 56 (last 8 bytes of the 64-byte header)
or we add it at offset 64 and bump the header to 72 bytes.

### Packed Slab Pointer Impact

Current: `[class_idx:u8 | block_idx:u24]` in one i32.
Max block index: 16,777,215 (16M blocks).

With i64 we could use `[class_idx:u8 | block_idx:u56]` — but the **root pointer**
is stored as an atomic i32 in `.root`. Migrating root to i64 means:
- `mem/-cas-i32!` on root → `mem/-cas-i64!`
- The native addon `mmap_cas.cc` already supports 64-bit CAS (check needed)
- JVM `Unsafe.compareAndSwapLong` works natively

**Alternative**: Keep slab pointer as i32, keep block_idx:u24 (16M block limit),
but allow each block to be arbitrarily large via i64 total_blocks and data_offset.
16M × 1024B (class 5) = 16 GB per class. 16M × 32B (class 0) = 512 MB.
This may be sufficient if paired with class spillover (see §2).

### Migration Strategy

1. Add `VERSION` field at byte 52 of the new header layout.
2. Current files have `0x00000000` at offset 52 → version 0 (legacy i32).
3. New files write `0x00000002` at offset 52 → version 2 (i64).
4. On open: read offset 52. If 0 → legacy path (read i32 fields at old offsets).
   If 2 → new path (read i64 fields at new offsets).
5. Optional migration: open legacy file, read old header, rewrite at new offsets,
   set version to 2. Data region doesn't move (just header rewrite).

### Files Affected

| File | Changes |
|------|---------|
| `data.cljc` | Header constants, `slab-layout`, `size->class-idx` |
| `coalesc.cljc` | `COALESC_HDR_DATA_SIZE` offset, all `load-i32`→`load-i64` |
| `alloc.cljc` | All header reads/writes, growth CAS, `encode-slab-offset`/`decode-*` |
| `atom.cljc` | Root pointer width (if migrated), `jvm-open-mmap-domain!` |
| `mem.cljc` | Verify `cas-i64!`, `load-i64`, `store-i64!` exist for both platforms |
| `mmap_cas.cc` | Verify 64-bit atomic CAS support |
| `serialize.cljc` | Slab pointer encoding if changed |

### Risk Assessment

- **Breaking change**: All existing `.slab*` files incompatible without migration.
- **Migration path**: Version field at offset 52 enables dual-read.
- **Performance**: i64 atomics are native on x86_64 and ARM64. No regression expected.
- **Complexity**: ~200 lines changed across 6 files. Medium effort.

---

## 2. Class Spillover on Full Bitmap

### Problem
When a bitmap slab (class 0-5) is at max capacity, allocations that *fit*
that class throw OOM instead of spilling to the next larger class. A 30-byte
allocation targeting class 0 (32B) will fail even though class 1 (64B) has
free blocks — wasting 32 bytes per allocation but avoiding OOM entirely.

### Current Flow (JVM, alloc.cljc:322-328)
```
(loop [attempts 0]
  (or (try-alloc class-idx)
      (if (and (< attempts 20) (grow! class-idx))
        (recur (inc attempts))
        (throw "out of memory"))))
```

### Proposed Flow
```
(loop [ci class-idx, attempts 0]
  (or (try-alloc ci)
      (if (grow! ci)
        (recur ci (inc attempts))
        ;; Class full at max cap — spill to next larger class
        (if (< ci 5)
          (recur (inc ci) 0)
          ;; Class 5 full — spill to coalesc (class 6)
          (coalesc-alloc-for-size! size-bytes)))))
```

### Design Considerations

1. **Wasted space**: A 30-byte value in a 64B block wastes 34 bytes (52% overhead).
   Acceptable as a pressure-relief valve — normal operation stays in the right class.

2. **Pointer encoding**: `encode-slab-offset` packs `[class_idx | block_idx]`.
   The class stored in the pointer must be the *actual* class allocated (e.g., 1),
   not the *requested* class (0). Free and read operations use the pointer's class.
   This already works correctly — no change needed.

3. **Both platforms**: CLJS alloc path (alloc.cljc:978+) needs the same spillover.

4. **Coalesc as ultimate fallback**: If all bitmap classes are full, the coalesc
   allocator handles arbitrary sizes. It already exists as class 6.

### Files Affected

| File | Changes |
|------|---------|
| `alloc.cljc` | JVM `-sio-alloc!` loop, CLJS `mmap-slab-alloc!` loop |

### Risk Assessment

- **Low risk**: Spillover only triggers when a class is genuinely full at max cap.
  Normal operation is unchanged.
- **Correctness**: Pointer encodes actual class → free works correctly.
- **Performance**: No impact on normal path. Spillover path is strictly better
  than OOM.

---

## 3. Implementation Order

1. **Class spillover first** (small, safe, immediate value)
   - ~30 lines in `alloc.cljc`
   - Eliminates OOM for any workload that fits within total slab capacity
   - No header changes, no migration, no breaking changes

2. **i64 header migration second** (larger, breaking, needs version gate)
   - ~200 lines across 6 files
   - Requires version field and migration logic
   - Unlocks exbibyte-scale storage

3. **Root pointer i64 migration third** (optional, only if >16M blocks needed)
   - Depends on native addon verification
   - Can be deferred if spillover + i64 headers are sufficient

---

## 4. Open Questions (Answered)

- **Does `mmap_cas.cc` support 64-bit CAS?** No. Only i32 atomics today.
  Need to add `CompareExchange64`, `Load64`, `Store64`, `Add64` methods.
  Straightforward: `__atomic_compare_exchange_n` on `int64_t*`.
- **Are `mem/-load-i64` etc. implemented?** No. JVM side uses `Unsafe.getIntVolatile`
  (i32 only). Need `getLongVolatile`/`putLongVolatile`/`compareAndSwapLong`.
  CLJS side needs `BigInt64Array` views or `DataView.getBigInt64`.
- **Version field format?** Simple integer (0 = legacy, 2 = i64) is sufficient.
  Magic bytes are overkill for an internal format.
- **Packed slab pointer width?** Keep i32 for now. 16M blocks per class is
  sufficient when paired with class spillover. Revisit only if a single class
  needs >16M blocks (512 MB for class 0 at 32B blocks).
