# X-RAY: SAB Storage Model Invariant Checker

X-RAY is a diagnostic tool for the SharedArrayBuffer (SAB) allocator used by Eve's AtomDomain system. It provides real-time ASCII art visualization of memory layout, invariant checking, and a video trace that replays the last N frames when a violation is detected.

## Quick Start

### From a test or REPL

```clojure
(require '[com.seniorcaremarket.eve.atom :as a])

;; Create an atom with a SAB backing store
(def my-atom (a/atom-domain {} :sab-size (* 4 1024 1024) :max-blocks 4096))

;; Run X-RAY on its environment
(a/validate-storage-model! (.-s-atom-env my-atom) {:width 80 :label "after-init"})
```

### From inside a worker (using the global atom)

```clojure
(when-let [g a/*global-atom-instance*]
  (a/validate-storage-model! (.-s-atom-env g) {:width 80 :label "my-checkpoint"}))
```

### Standalone step debugger

Build and run the dedicated X-RAY harness that exercises the allocator one operation at a time:

```bash
npx shadow-cljs compile eve-xray
node target/thread-test/xray.js
```

## What it shows

Each X-RAY frame renders two views side-by-side:

```
  after-swap | 42 blk | 258729960/258729960 (100%)
  TELESCOPE (1col=7186944B)               MICROSCOPE (1col=126B)
  |....................................|  |################################....|
  |------------------------------------|  |------------------------------------|
  F=1 A=40 R=0 E=1 O=0                   F=1 A=40 R=0 E=1 O=0
  PASS
```

**TELESCOPE** (left) shows the entire data region zoomed out. One column represents many bytes — good for spotting large-scale fragmentation patterns.

**MICROSCOPE** (right) zooms into the active allocation region where blocks are being used. One column represents fewer bytes — good for seeing individual block boundaries.

### Character legend

| Char | Status | Meaning |
|------|--------|---------|
| `.`  | FREE | Available for allocation |
| `#`  | ALLOCATED | In-use data block or HAMT node |
| `R`  | RETIRED | Marked for GC, waiting for epoch sweep |
| `E`  | EMBEDDED | Embedded atom header block |
| `O`  | ORPHANED | Failed free, needs cleanup |
| `L`  | LOCKED | Locked for update (transient) |
| `?`  | Gap | Untracked bytes (invariant violation) |
| `X`  | Overlap | Two blocks claim the same bytes (invariant violation) |

### Status line

```
F=1 A=40 R=0 E=1 O=0
```

Block counts by status: **F**ree, **A**llocated, **R**etired, **E**mbedded, **O**rphaned. The left counts are for the full region (telescope), the right counts are for the zoomed region (microscope).

## API Reference

### `validate-storage-model!`

```clojure
(a/validate-storage-model! s-atom-env)
(a/validate-storage-model! s-atom-env {:width 80 :label "my-label"})
```

The main entry point. Scans all block descriptors, checks invariants, renders the side-by-side ASCII art, and captures the frame into the video buffer.

**Options:**
- `:width` — total output width in characters (default 80). Each bar gets `(width - 8) / 2` columns.
- `:label` — string label printed in the header and stored in the video frame.

**Returns** a map:
```clojure
{:valid?            true/false
 :gaps              [{:offset N :size N} ...]   ;; untracked byte ranges
 :overlaps          [{:offset N :size N} ...]   ;; double-claimed byte ranges
 :mirror-mismatches [{:desc-idx N :field "status" :descriptor-val N :mirror-val N} ...]
 :tracked           N   ;; total bytes accounted for
 :expected          N}  ;; total data region size
```

**Invariants checked:**
1. All data region bytes are accounted for (no gaps)
2. No two blocks overlap
3. SoA mirror arrays (status + capacity) match the AoS descriptor table
4. `tracked == expected` (total capacity of all blocks = data region size)

### `xray-replay!`

```clojure
(a/xray-replay!)
```

Manually replay the video buffer. Prints all captured frames (up to 20) with their full ASCII art and descriptor tables. Useful for post-mortem analysis without needing a failure trigger.

### `dump-block-stats!`

```clojure
(a/dump-block-stats! s-atom-env)
```

**TELESCOPE** view — high-level memory overview:
- Descriptor status distribution (FREE/ALLOC/RETIRED/ORPHAN/EMBED/ZEROED counts)
- Capacity totals per status
- Utilization percentage
- Fragmentation index (adjacent uncoalesced free pairs)
- Free block size histogram (top 5 largest, 5 smallest)

### `dump-block-detail!`

```clojure
(a/dump-block-detail! s-atom-env)
(a/dump-block-detail! s-atom-env {:limit 30})
```

**MICROSCOPE** view — low-level physical memory layout. Shows every block sorted by physical byte offset with status, capacity, data length, and descriptor index. Use `:limit` to cap the number of blocks printed.

## Video Trace

X-RAY keeps a rolling buffer of the last 20 frames. Each call to `validate-storage-model!` captures:
- The ASCII art bars (telescope + microscope)
- Full descriptor table snapshot (idx, status, offset, capacity, data_len, val_desc, lock, epoch)

**On invariant violation**, the video automatically replays, showing every captured frame leading up to the failure. This lets you see exactly which operation caused the corruption — the "before" and "after" are right there in the trace.

### Example: wiring X-RAY into a benchmark loop

```clojure
(defn- xray! [label]
  (when-let [g a/*global-atom-instance*]
    (a/validate-storage-model! (.-s-atom-env g) {:width 80 :label label})))

;; Inside a scaling test:
(doseq [n-workers [1 2 4 8 16]]
  (xray! (str "pre-" n-workers "w"))
  ;; ... run concurrent work with n-workers ...
  (xray! (str "post-" n-workers "w")))
```

If the test fails at 8 workers, the video trace shows the clean state at `pre-8w` and the corrupted state at `post-8w`, plus all prior frames — giving you the full history of the allocator state.

## Step Debugger

The `eve_xray_main.cljs` harness runs 24 steps, each exercising a different allocator operation:

| Phase | Steps | What it tests |
|-------|-------|---------------|
| 1. Basic AtomDomain | 1-9 | assoc, dissoc, merge, key rotation |
| 2. Embedded atoms | 10-16 | create, swap, multi-atom |
| 3. Rapid swap cycles | 17-18 | 100-swap churn (alloc+free pressure) |
| 4. Large map growth | 19-21 | grow to 200 keys, replace all, shrink back |
| 5. Stress | 22-24 | 20 embedded atoms x 50 keys x 10 swaps each |

X-RAY runs after every step. On the first invariant violation, execution stops, the video replays, and the exact breaking step is reported.

```bash
npx shadow-cljs compile eve-xray
node target/thread-test/xray.js
```

```
  STEP 17: Rapid 100 swaps on e1 (counter increment)
  ...
  |############################............|  |################################....|
  |-----------------------------------------|  |------------------------------------|
  F=1 A=65 R=0 E=0 O=0                       F=1 A=65 R=0 E=0 O=0
  PASS
  >> STEP 17 PASSED
```

## Tips

- **Width**: Set `:width` to match your terminal. The default 80 works for most terminals. For wider displays, 120 or 160 gives more detail in the microscope view.
- **Labels**: Use descriptive labels like `"pre-8w"` or `"after-merge-50keys"` — they appear in the video trace headers and make it easy to correlate frames with operations.
- **Conditional xray**: Wrap in `when` to only run X-RAY during development:
  ```clojure
  (when js/goog.DEBUG (xray! "checkpoint"))
  ```
- **Post-mortem**: If you suspect corruption but the test passed, call `(a/xray-replay!)` at the end to dump the full frame history.
