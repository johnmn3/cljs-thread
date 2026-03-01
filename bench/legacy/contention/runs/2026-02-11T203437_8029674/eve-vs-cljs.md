# EVE SAB vs Stock CLJS — Contention Scaling

## Metadata

| Field | Value |
|-------|-------|
| Date | 2026-02-11T203437 |
| Commit | `8029674` |
| Branch | `claude/explore-codebase-plan-wkho4` |
| Dirty | no |
| Runtime | Node.js v22.22.0 |
| Platform | linux x64 |
| Map size | 200 entries |
| SAB size | 512 MB |

## Workload Descriptions

| Workload | Description | Total ops |
|----------|-------------|-----------|
| write-only | All workers `assoc` into shared SAB map via CAS + graft-on-retry | 2000 |
| read-only | All workers `get` from pre-populated shared SAB map (lock-free) | 8000 |
| mixed-80/20 | 80% reads (lock-free), 20% writes (ticket lock + graft) | 4000 |
| rcw-swap | Read-compute-write: deref -> scan -> swap! (ticket lock) | 80 |

Stock CLJS runs single-threaded as the baseline for each workload.
Total work is held constant across all worker counts.

## write-only

| Workers | Throughput (ops/s) | vs Stock 1T | Wall time (ms) |
|--------:|-------------------:|------------:|---------------:|
| Stock 1T | 183.3K | 1.00x | — |
| 1W | 32.3K | 0.18x | 61.8 |
| 2W | 40.0K | 0.22x | 49.9 |
| 4W | 17.3K | 0.09x | 115.9 |
| 8W | 3.9K | 0.02x | 512.5 |
| 16W | 1.4K | 0.01x | 1437.3 |

## read-only

| Workers | Throughput (ops/s) | vs Stock 1T | Wall time (ms) |
|--------:|-------------------:|------------:|---------------:|
| Stock 1T | 1.72M | 1.00x | — |
| 1W | 148.5K | 0.09x | 53.9 |
| 2W | 215.0K | 0.13x | 37.2 |
| 4W | 308.2K | 0.18x | 26.0 |
| 8W | 294.9K | 0.17x | 27.1 |
| 16W | 348.5K | 0.20x | 23.0 |

## mixed-80/20

| Workers | Throughput (ops/s) | vs Stock 1T | Wall time (ms) |
|--------:|-------------------:|------------:|---------------:|
| Stock 1T | 361.7K | 1.00x | — |
| 1W | 77.0K | 0.21x | 51.9 |
| 2W | 33.7K | 0.09x | 118.6 |
| 4W | 16.7K | 0.05x | 239.6 |
| 8W | 20.7K | 0.06x | 192.9 |
| 16W | 3.1K | 0.01x | 1274.8 |

## rcw-swap

| Workers | Throughput (ops/s) | vs Stock 1T | Wall time (ms) |
|--------:|-------------------:|------------:|---------------:|
| Stock 1T | 7.3K | 1.00x | — |
| 1W | 8.6K | 1.18x | 9.3 |
| 2W | 718.8 | 0.10x | 111.3 |
| 4W | 486.3 | 0.07x | 164.5 |
| 8W | 608.5 | 0.08x | 131.5 |
| 16W | 486.8 | 0.07x | 164.3 |

## Summary — Scaling Ratios (SAB / Stock 1T)

| Workload | 1W | 2W | 4W | 8W | 16W |
|----------|---:|---:|---:|---:|----:|
| write-only | 0.18x | 0.22x | 0.09x | 0.02x | 0.01x |
| read-only | 0.09x | 0.13x | 0.18x | 0.17x | 0.20x |
| mixed-80/20 | 0.21x | 0.09x | 0.05x | 0.06x | 0.01x |
| rcw-swap | 1.18x | 0.10x | 0.07x | 0.08x | 0.07x |

> Ratio > 1.0 means EVE SAB multi-worker beats stock CLJS single-thread
