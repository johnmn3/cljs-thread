# Old SAB vs New Slab -- Contention Scaling Comparison

## Metadata

| Field | Value |
|-------|-------|
| Date | 2026-02-12T020215 |
| Commit | `69a6b0f` |
| Branch | `claude/explore-codebase-plan-wkho4` |
| Dirty | yes |
| Runtime | Node.js v22.22.0 |
| Platform | linux x64 |
| Map size | 200 entries |
| SAB size | 512 MB (legacy) |

## write-only

| Workers | Old SAB (ops/s) | Old vs Stock | Slab (ops/s) | Slab vs Stock | Slab vs Old |
|--------:|----------------:|-------------:|-------------:|--------------:|------------:|
| Stock 1T | 178.4K | 1.00x | 178.4K | 1.00x | -- |
| 1W | 34.6K | 0.19x | 31.2K | 0.17x | 0.90x |
| 2W | 54.6K | 0.31x | 34.6K | 0.19x | 0.63x |
| 4W | 19.5K | 0.11x | 36.9K | 0.21x | 1.90x |
| 8W | 12.5K | 0.07x | 31.1K | 0.17x | 2.49x |
| 16W | 1.2K | 0.01x | 22.2K | 0.12x | 18.86x |

## read-only

| Workers | Old SAB (ops/s) | Old vs Stock | Slab (ops/s) | Slab vs Stock | Slab vs Old |
|--------:|----------------:|-------------:|-------------:|--------------:|------------:|
| Stock 1T | 1.22M | 1.00x | 1.22M | 1.00x | -- |
| 1W | 159.7K | 0.13x | 149.7K | 0.12x | 0.94x |
| 2W | 256.8K | 0.21x | 173.7K | 0.14x | 0.68x |
| 4W | 360.2K | 0.30x | 250.4K | 0.21x | 0.70x |
| 8W | 350.7K | 0.29x | 195.9K | 0.16x | 0.56x |
| 16W | 213.6K | 0.18x | 182.3K | 0.15x | 0.85x |

## mixed-80/20

| Workers | Old SAB (ops/s) | Old vs Stock | Slab (ops/s) | Slab vs Stock | Slab vs Old |
|--------:|----------------:|-------------:|-------------:|--------------:|------------:|
| Stock 1T | 686.1K | 1.00x | 686.1K | 1.00x | -- |
| 1W | 83.3K | 0.12x | 75.5K | 0.11x | 0.91x |
| 2W | 38.6K | 0.06x | 115.4K | 0.17x | 2.99x |
| 4W | 34.5K | 0.05x | 98.7K | 0.14x | 2.86x |
| 8W | 4.3K | 0.01x | 101.4K | 0.15x | 23.47x |
| 16W | 5.2K | 0.01x | 63.7K | 0.09x | 12.26x |

## rcw-swap

| Workers | Old SAB (ops/s) | Old vs Stock | Slab (ops/s) | Slab vs Stock | Slab vs Old |
|--------:|----------------:|-------------:|-------------:|--------------:|------------:|
| Stock 1T | 6.3K | 1.00x | 6.3K | 1.00x | -- |
| 1W | 13.2K | 2.08x | 10.3K | 1.63x | 0.78x |
| 2W | 880.3 | 0.14x | 11.4K | 1.80x | 12.96x |
| 4W | 673.9 | 0.11x | 15.1K | 2.38x | 22.39x |
| 8W | 906.4 | 0.14x | 3.6K | 0.56x | 3.95x |
| 16W | 426.5 | 0.07x | 2.7K | 0.42x | 6.29x |

## Summary -- Slab / Old SAB Ratio

| Workload | 1W | 2W | 4W | 8W | 16W |
|----------|---:|---:|---:|---:|----:|
| write-only | 0.90x | 0.63x | 1.90x | 2.49x | 18.86x |
| read-only | 0.94x | 0.68x | 0.70x | 0.56x | 0.85x |
| mixed-80/20 | 0.91x | 2.99x | 2.86x | 23.47x | 12.26x |
| rcw-swap | 0.78x | 12.96x | 22.39x | 3.95x | 6.29x |

> Ratio > 1.0 means new slab allocator beats old single-SAB allocator
