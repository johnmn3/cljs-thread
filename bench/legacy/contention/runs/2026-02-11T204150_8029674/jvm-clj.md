# Stock JVM Clojure — Contention Scaling

## Metadata

| Field | Value |
|-------|-------|
| Date | 2026-02-11T204150 |
| Commit | `8029674` |
| Branch | `claude/explore-codebase-plan-wkho4` |
| Dirty | yes |
| JVM | OpenJDK 64-Bit Server VM 21.0.10+7-Ubuntu-124.04 |
| Clojure | 1.12.0 |
| CPUs | 16 |
| Map size | 200 entries |

## Workload Descriptions

| Workload | Description | Total ops |
|----------|-------------|-----------|
| write-only | All threads `swap!` assoc into shared Clojure atom | 2000 |
| read-only | All threads `deref` + `get` from shared atom (near zero-contention) | 8000 |
| mixed-80/20 | 80% deref+get, 20% swap! assoc | 4000 |
| rcw-swap | deref -> reduce-kv full scan -> swap! conditional update | 80 |

Total work is held constant across all thread counts.

## write-only

| Threads | Throughput (ops/s) | vs 1T | Wall time (ms) |
|--------:|-------------------:|------:|---------------:|
| 1T | 687.8K | 1.00x | 2.9 |
| 2T | 498.5K | 0.72x | 4.0 |
| 4T | 702.5K | 1.02x | 2.8 |
| 8T | 1.02M | 1.49x | 2.0 |
| 16T | 2.59M | 3.76x | 0.8 |

## read-only

| Threads | Throughput (ops/s) | vs 1T | Wall time (ms) |
|--------:|-------------------:|------:|---------------:|
| 1T | 2.08M | 1.00x | 3.8 |
| 2T | 3.43M | 1.65x | 2.3 |
| 4T | 5.82M | 2.80x | 1.4 |
| 8T | 9.07M | 4.36x | 0.9 |
| 16T | 3.83M | 1.84x | 2.1 |

## mixed-80/20

| Threads | Throughput (ops/s) | vs 1T | Wall time (ms) |
|--------:|-------------------:|------:|---------------:|
| 1T | 1.30M | 1.00x | 3.1 |
| 2T | 1.76M | 1.36x | 2.3 |
| 4T | 3.16M | 2.44x | 1.3 |
| 8T | 1.78M | 1.37x | 2.3 |
| 16T | 3.49M | 2.69x | 1.1 |

## rcw-swap

| Threads | Throughput (ops/s) | vs 1T | Wall time (ms) |
|--------:|-------------------:|------:|---------------:|
| 1T | 31.9K | 1.00x | 2.5 |
| 2T | 13.1K | 0.41x | 6.1 |
| 4T | 14.6K | 0.46x | 5.5 |
| 8T | 430.6K | 13.52x | 0.2 |
| 16T | 804.9K | 25.27x | 0.1 |

## Summary — Scaling Ratios (vs 1T baseline)

| Workload | 1T | 2T | 4T | 8T | 16T |
|----------|---:|---:|---:|---:|----:|
| write-only | 1.00x | 0.72x | 1.02x | 1.49x | 3.76x |
| read-only | 1.00x | 1.65x | 2.80x | 4.36x | 1.84x |
| mixed-80/20 | 1.00x | 1.36x | 2.44x | 1.37x | 2.69x |
| rcw-swap | 1.00x | 0.41x | 0.46x | 13.52x | 25.27x |

> Ratio > 1.0 means more threads improved throughput over single-threaded baseline

