# EVE SAB vs Stock CLJS — Contention Scaling

## Metadata

| Field | Value |
|-------|-------|
| Date | 2026-02-12T055241 |
| Commit | `eac80ed` |
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
| Stock 1T | 176.6K | 1.00x | — |
| 1W | 38.0K | 0.22x | 52.6 |
| 2W | 47.7K | 0.27x | 41.9 |
| 4W | 18.6K | 0.11x | 107.6 |
| 8W | 15.9K | 0.09x | 126.2 |
| 16W | 7.3K | 0.04x | 272.5 |

## read-only

| Workers | Throughput (ops/s) | vs Stock 1T | Wall time (ms) |
|--------:|-------------------:|------------:|---------------:|
| Stock 1T | 1.86M | 1.00x | — |
| 1W | 203.9K | 0.11x | 39.2 |
| 2W | 260.5K | 0.14x | 30.7 |
| 4W | 251.5K | 0.14x | 31.8 |
| 8W | 269.6K | 0.14x | 29.7 |
| 16W | 302.8K | 0.16x | 26.4 |

## mixed-80/20

| Workers | Throughput (ops/s) | vs Stock 1T | Wall time (ms) |
|--------:|-------------------:|------------:|---------------:|
| Stock 1T | 891.5K | 1.00x | — |
| 1W | 83.5K | 0.09x | 47.9 |
| 2W | 38.9K | 0.04x | 102.7 |
| 4W | 23.5K | 0.03x | 170.5 |
| 8W | 6.1K | 0.01x | 651.8 |
| 16W | 5.9K | 0.01x | 674.1 |

## rcw-swap

| Workers | Throughput (ops/s) | vs Stock 1T | Wall time (ms) |
|--------:|-------------------:|------------:|---------------:|
| Stock 1T | 5.0K | 1.00x | — |
| 1W | 16.6K | 3.29x | 4.8 |
| 2W | 863.3 | 0.17x | 92.7 |
| 4W | 2.6K | 0.51x | 30.8 |
| 8W | 590.7 | 0.12x | 135.4 |
| 16W | 456.6 | 0.09x | 175.2 |

## Summary — Scaling Ratios (SAB / Stock 1T)

| Workload | 1W | 2W | 4W | 8W | 16W |
|----------|---:|---:|---:|---:|----:|
| write-only | 0.22x | 0.27x | 0.11x | 0.09x | 0.04x |
| read-only | 0.11x | 0.14x | 0.14x | 0.14x | 0.16x |
| mixed-80/20 | 0.09x | 0.04x | 0.03x | 0.01x | 0.01x |
| rcw-swap | 3.29x | 0.17x | 0.51x | 0.12x | 0.09x |

> Ratio > 1.0 means EVE SAB multi-worker beats stock CLJS single-thread
