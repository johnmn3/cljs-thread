# Stock JVM Clojure — Contention Scaling

## Metadata

| Field | Value |
|-------|-------|
| Date | 2026-02-13T230811 |
| Commit | `a94c92e` |
| Branch | `claude/sharedarraybuffer-structures-Uwgnw` |
| Dirty | no |
| JVM | OpenJDK 64-Bit Server VM 21.0.10+7-Ubuntu-124.04 |
| Clojure | 1.12.4 |
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
| 1T | 873.9K | 1.00x | 2.3 |
| 2T | 791.7K | 0.91x | 2.5 |
| 4T | 709.5K | 0.81x | 2.8 |
| 8T | 1.06M | 1.21x | 1.9 |
| 16T | 1.98M | 2.27x | 1.0 |

## read-only

| Threads | Throughput (ops/s) | vs 1T | Wall time (ms) |
|--------:|-------------------:|------:|---------------:|
| 1T | 2.03M | 1.00x | 3.9 |
| 2T | 3.70M | 1.82x | 2.2 |
| 4T | 7.49M | 3.69x | 1.1 |
| 8T | 9.84M | 4.85x | 0.8 |
| 16T | 3.38M | 1.67x | 2.4 |

## mixed-80/20

| Threads | Throughput (ops/s) | vs 1T | Wall time (ms) |
|--------:|-------------------:|------:|---------------:|
| 1T | 1.65M | 1.00x | 2.4 |
| 2T | 2.13M | 1.29x | 1.9 |
| 4T | 2.17M | 1.31x | 1.8 |
| 8T | 1.39M | 0.84x | 2.9 |
| 16T | 8.89M | 5.38x | 0.4 |

## rcw-swap

| Threads | Throughput (ops/s) | vs 1T | Wall time (ms) |
|--------:|-------------------:|------:|---------------:|
| 1T | 34.1K | 1.00x | 2.3 |
| 2T | 10.3K | 0.30x | 7.7 |
| 4T | 11.5K | 0.34x | 7.0 |
| 8T | 442.6K | 12.99x | 0.2 |
| 16T | 783.9K | 23.02x | 0.1 |

## Summary — Scaling Ratios (vs 1T baseline)

| Workload | 1T | 2T | 4T | 8T | 16T |
|----------|---:|---:|---:|---:|----:|
| write-only | 1.00x | 0.91x | 0.81x | 1.21x | 2.27x |
| read-only | 1.00x | 1.82x | 3.69x | 4.85x | 1.67x |
| mixed-80/20 | 1.00x | 1.29x | 1.31x | 0.84x | 5.38x |
| rcw-swap | 1.00x | 0.30x | 0.34x | 12.99x | 23.02x |

> Ratio > 1.0 means more threads improved throughput over single-threaded baseline

