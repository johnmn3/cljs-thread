# Testing

All tests are run through a unified Clojure test runner via `deps.edn`:

```bash
clj -M:thread-test [flags...] [suites...]
```

The runner auto-discovers `*_test.cljs` files, classifies each namespace into a **tier** based on its prerequisites, generates a tailored runner `.cljs` file, compiles it via shadow-cljs, and runs the result. Discovery is always on — there is no flag to enable it.

## Running Tests

```bash
clj -M:thread-test                                # discover and run all tests
clj -M:thread-test :tier slab                     # only :slab tier tests
clj -M:thread-test :tier pure :node               # :pure tier via Node.js
clj -M:thread-test :ns "map-test"                 # filter by namespace regex
clj -M:thread-test :exclude "batch|xray"          # exclude namespaces matching regex
clj -M:thread-test :dir "cljs_thread/eve"         # filter by subdirectory prefix
clj -M:thread-test :advanced :node                # :advanced optimizations
clj -M:thread-test :dry-run                       # show plan without compiling
clj -M:thread-test :retry                         # re-run only last-failed tests
clj -M:thread-test slab                           # run the "slab" suite by name
```

Named suites (`slab`, `core`, `dom-proxy`, etc.) still work — the runner resolves them through the same discovery pipeline.

### Tier System

Every test namespace is classified into one of three tiers based on what infrastructure it needs:

| Tier | Prerequisites | Default Timeout | Directory Convention |
|------|--------------|-----------------|---------------------|
| `:pure` | None — tests run directly | 10s | `test/unit/` |
| `:slab` | Slab allocator + atom domain | 30s | `test/eve/` |
| `:worker` | Fat kernel + thread mesh | 120s | `test/integration/`, `test/perf/` |

For files in the legacy flat layout (`test/cljs_thread/`), the tier is inferred from namespace patterns:
- `cljs-thread.eve.*` namespaces are `:slab`
- Namespaces matching integration/smoke/future/spawn patterns are `:worker`
- Everything else is `:pure`

Tier can also be set explicitly via namespace metadata:

```clojure
(ns ^{:tier :slab} my.custom-test
  (:require [cljs.test :refer [deftest is]]))
```

When running tests from mixed tiers, the runner uses the **dominant tier** (`:worker` > `:slab` > `:pure`) so all prerequisites are available. Use `:tier` to restrict to a specific tier.

### Namespace Filtering

```bash
# Regex match against fully-qualified namespace name
clj -M:thread-test :ns "map"              # matches cljs-thread.eve.map-test
clj -M:thread-test :ns "deftype"           # matches deftype-test, int-map-test, etc.
clj -M:thread-test :ns "^cljs-thread\.eve\.vec"  # anchored match

# Exclude by regex
clj -M:thread-test :exclude "batch|xray|alloc-race|large-scale"

# Filter by subdirectory prefix (relative to test/)
clj -M:thread-test :dir "cljs_thread/eve/deftype"

# Combine filters
clj -M:thread-test :tier slab :ns "map" :exclude "int-map"
```

### Dry Run

See what would be discovered and compiled without actually doing it:

```bash
clj -M:thread-test :dry-run
clj -M:thread-test :tier slab :ns "map" :dry-run
```

Output:

```
=== Test Plan (dry-run) ===

Tier: :slab
Optimization: :none
Environment: :playwright
Output: target/test-run/gen-test.js

Discovered 2 test namespaces:
  slab  cljs-thread.eve.deftype.int-map-test  (cljs_thread/eve/deftype/int_map_test.cljs)
  slab  cljs-thread.eve.map-test  (cljs_thread/eve/map_test.cljs)
```

### Failure Tracking and Retry

The runner persists failure data to `target/.test-state/last-failures.edn` after each run. Use `:retry` to re-run only the namespaces that failed last time:

```bash
clj -M:thread-test :tier slab :node        # run tests, some fail
clj -M:thread-test :retry :node            # re-run only failed namespaces
```

## Available Suites

| Suite | What it tests |
|-------|---------------|
| `core` | Core eve data structure operations |
| `array` | Array data structure |
| `slab` | SAB slab allocator |
| `slab-double-free` | Slab allocator double-free detection |
| `alloc-race` | Allocator race condition tests |
| `large-scale` | Large-scale stress tests |
| `epoch-gc` | Epoch garbage collection |
| `xray` | SAB allocator invariants (separate build) |
| `obj` | Object tests |
| `deftype` | Core deftype |
| `int-map` | Integer map |
| `rb-tree` | Red-black tree |
| `typed-array` | Typed array operations and sharing |
| `serial` | Wire serialization round-trip tests |
| `direct-sab` | Direct SAB sync channel tests |
| `async-primitives` | Async primitive validation |
| `future` | Future macro tests |
| `parallel-futures` | Parallel futures race condition reproduction |
| `batch2`, `batch3`, `batch4` | Validation batches |
| `validation` | Combined validation |
| `fat-kernel` | Fat kernel browser tests (browser-only) |
| `dom-proxy` | Worker-to-screen DOM proxy (browser-only, separate code-split build) |

> `xray`, `fat-kernel`, and `dom-proxy` require their own shadow-cljs build targets (the runner handles this automatically). `xray` needs a separate build because loading HAMT type encoders from map/vec/list/set changes allocation routing.

Use `:list` to see all suites and discovered namespaces:

```bash
clj -M:thread-test :list
```

## Platforms

Tests can run on three platforms:

```bash
clj -M:thread-test :playwright slab         # headless browser (default)
clj -M:thread-test :node slab               # Node.js
clj -M:thread-test :browser slab            # start server, print URL, test manually
clj -M:thread-test :tier slab :node         # tier filter + platform
clj -M:thread-test :tier pure :playwright   # works with any combination of flags
```

## Optimization Levels

Three Closure Compiler optimization levels are supported:

```bash
clj -M:thread-test slab                     # :none (dev build, default)
clj -M:thread-test :basic slab              # :simple optimizations
clj -M:thread-test :advanced slab           # :advanced optimizations
clj -M:thread-test :all-opts slab           # run at all three levels sequentially
clj -M:thread-test :tier slab :advanced :node   # works with tier filters too
```

The generated runner includes `goog/exportSymbol` anti-DCE annotations to prevent Closure Compiler from eliminating test namespaces under `:advanced`.

## Running Everything

```bash
clj -M:thread-test :all-platforms           # :node + :playwright in parallel
clj -M:thread-test :all                     # all platforms x all optimization levels
clj -M:thread-test :all :par 4             # full matrix, 4 suites concurrent per platform
```

## Other Flags

```bash
clj -M:thread-test :par 4                  # run up to 4 suites in parallel
clj -M:thread-test :skip-compile slab      # skip recompilation, reuse existing JS
clj -M:thread-test :compile-only           # compile without running
clj -M:thread-test :list                   # list available suites/namespaces and usage
```

## Output Reporters

The test framework includes four reporter implementations for different contexts:

| Reporter | Format | Use Case |
|----------|--------|----------|
| `human` | ANSI-colored terminal output | Local development (default) |
| `tap` | Test Anything Protocol | Unix pipe integration |
| `junit` | JUnit XML | CI systems (Jenkins, GitHub Actions) |
| `edn` | Machine-readable EDN | Programmatic consumption |

Reporters are selected via the `:output` flag:

```bash
clj -M:thread-test :tier slab :output tap :node
clj -M:thread-test :output junit :node
```

## Runtime Filtering

Beyond the JVM-side namespace/tier filtering described above, the CLJS runtime supports var-level filtering via environment variables:

| Variable | Effect | Example |
|----------|--------|---------|
| `EVE_TEST_NAME` | Regex filter on deftest var names | `EVE_TEST_NAME="assoc.*test"` |
| `EVE_TEST_INCLUDE` | Comma-separated metadata tags to include | `EVE_TEST_INCLUDE="smoke,fast"` |
| `EVE_TEST_EXCLUDE` | Comma-separated metadata tags to exclude | `EVE_TEST_EXCLUDE="slow,flaky"` |

Tag individual tests with metadata:

```clojure
(deftest ^:smoke ^:fast basic-assoc-test
  (is (= {:a 1} (assoc {} :a 1))))

(deftest ^:slow large-scale-test
  ;; ...
  )
```

## `cljs-thread.test` — Blocking Test Helpers

For downstream projects building on cljs-thread, the `cljs-thread.test` namespace provides macros that leverage blocking worker semantics to eliminate the async ceremony of standard `cljs.test`.

> **Do NOT use this namespace when testing cljs-thread itself.** It is for app/lib authors building on top of cljs-thread.

### Macros

#### `deftest-worker`

Run a test body on a `:core` worker with full blocking semantics:

```clojure
(ns my-app.core-test
  (:require [cljs.test :refer [is]]
            [cljs-thread.core :as t])
  (:require-macros [cljs-thread.test :refer [deftest-worker]]
                   [cljs-thread.core :refer [future]]))

(deftest-worker cross-thread-swap-test
  (let [a (t/atom ::state {:x 0})]
    @(future (swap! a update :x inc))
    (is (= 1 (:x @a)))))
```

#### `testing-worker`

Like `cljs.test/testing`, but the body runs on a named worker:

```clojure
(deftest my-test
  (testing-worker :core "arithmetic on core"
    (is (= 42 (+ 21 21)))))
```

#### `deftest-async`

For tests that must use callback-style async (prefer `deftest-worker` in most cases):

```clojure
(deftest-async my-callback-test
  (js/setTimeout
    (fn []
      (is (= 42 42))
      (done))
    100))
```

#### `with-atom`

Create a shared eve atom scoped to the test body:

```clojure
(with-atom [a {:counter 0}]
  (swap! a update :counter inc)
  (is (= 1 (:counter @a))))
```

#### `with-workers`

Bind named worker handles for dispatch:

```clojure
(with-workers [w1 w2 w3]
  (is (= 3 @(in w1 (+ 1 2))))
  (is (= 7 @(in w2 (+ 3 4)))))
```

#### `is-eventually`

Assert that a predicate becomes true within a timeout (polls with `Atomics.wait`):

```clojure
(is-eventually (= 42 @my-atom))
(is-eventually (pos? (:count @state)) :timeout 5000 :interval 100)
```

#### `is-within`

Assert numeric value is within tolerance:

```clojure
(is-within 100 @elapsed-ms :tolerance 20)
```

#### `with-timeout`

Timeout guard — fails the test if body doesn't complete in time:

```clojure
(with-timeout 5000
  ;; ... long-running test ...
  )
```

### Runtime Helpers

```clojure
(require '[cljs-thread.test :as ct])

;; Sleep for N ms using Atomics.wait (workers only, not main thread)
(ct/blocking-sleep 500)

;; Wait for atom to satisfy predicate, with timeout
(ct/wait-for my-atom #(pos? (:count %)) :timeout 5000)
```

## Architecture

### How Discovery Works

1. **Scan** — `cljs-thread.test.convention/scan-test-dir` walks `test/` for `*_test.cljs` files
2. **Classify** — Each namespace is assigned a tier (`:pure`, `:slab`, `:worker`) by directory convention or namespace pattern
3. **Filter** — Apply `:tier`, `:ns`, `:exclude`, `:dir` filters
4. **Generate** — `cljs-thread.test.generate/write-runner!` writes a tailored runner `.cljs` to `target/generated-test/`
5. **Compile** — shadow-cljs compiles the `:gen-test` build target (defined in `shadow-cljs.edn`)
6. **Run** — `cljs-thread.test.env/launch-env` executes the compiled JS on the selected platform

The generated runner:
- Requires all discovered test namespaces
- Exports symbols via `goog/exportSymbol` (anti-DCE for `:advanced`)
- Initializes tier prerequisites (slab allocator, worker mesh)
- Overrides `cljs.test/report` for the `:summary` method to handle process exit
- Calls `cljs.test/run-tests` with the discovered namespace symbols

### Key Source Files

| File | Role |
|------|------|
| `test/eve/test_runner.clj` | JVM-side orchestrator — arg parsing, discovery, compilation, execution |
| `src/cljs_thread/test/convention.clj` | Directory scanning, tier inference, namespace classification |
| `src/cljs_thread/test/generate.clj` | Runner `.cljs` generation and shadow-cljs config generation |
| `src/cljs_thread/test/tier.cljs` | Runtime `:slab` tier setup (allocator init, platform detection) |
| `src/cljs_thread/test/tier_worker.cljs` | Runtime `:worker` tier setup (fat kernel, thread mesh) |
| `src/cljs_thread/test/env.clj` | Environment launchers (`:node`, `:playwright`, `:browser`) |
| `src/cljs_thread/test/reporter.cljs` | Structured reporters (human, TAP, JUnit, EDN) |
| `src/cljs_thread/test/filter.cljs` | Runtime var-level filtering by metadata and name |
| `src/cljs_thread/test/failures.clj` | Failure persistence and retry support |
| `src/cljs_thread/test/watch.clj` | Watch mode with polling-based file change detection |
| `src/cljs_thread/test.clj` | Blocking test macros for downstream users |
| `src/cljs_thread/test.cljs` | Runtime helpers (`blocking-sleep`, `wait-for`) |

### Adding a New Test

Adding a test requires **zero configuration changes**. Just create a file matching `*_test.cljs` under `test/`:

```clojure
;; test/cljs_thread/eve/my_new_test.cljs
(ns cljs-thread.eve.my-new-test
  (:require [cljs.test :refer [deftest is testing]]))

(deftest my-new-feature-test
  (testing "it works"
    (is (= 1 1))))
```

The tier is inferred automatically from the path (`cljs_thread/eve/` → `:slab`). Run it:

```bash
clj -M:thread-test :ns "my-new"    # just this test
clj -M:thread-test :tier slab      # all slab tests including yours
```

No runner files, no shadow-cljs config, no suite registry updates.

## X-RAY: SAB Storage Model Diagnostics

X-RAY is an invariant checker and visual debugger for the SharedArrayBuffer allocator. It renders side-by-side TELESCOPE (full region overview) and MICROSCOPE (zoomed active region) ASCII art bars showing block status, and maintains a rolling video buffer of the last 20 frames. On invariant violation, the video replays automatically so you can see exactly which operation caused corruption.

### Quick Start

```clojure
;; Internal namespace — diagnostic use only
(require '[cljs-thread.eve.shared-atom :as a])

;; Run X-RAY on any atom's SAB environment
(a/validate-storage-model! (.-s-atom-env my-atom) {:width 80 :label "checkpoint"})

;; Replay the video buffer manually
(a/xray-replay!)
```

### Output

```
  checkpoint | 66 blk | 258729960/258729960 (100%)
  TELESCOPE (1col=7186944B)               MICROSCOPE (1col=126B)
  |....................................|  |################################....|
  |------------------------------------|  |------------------------------------|
  F=1 A=65 R=0 E=0 O=0                   F=1 A=65 R=0 E=0 O=0
  PASS
```

### Character Legend

| Char | Status | Meaning |
|------|--------|---------|
| `.`  | FREE | Available for allocation |
| `#`  | ALLOCATED | In-use data block or HAMT node |
| `R`  | RETIRED | Marked for GC, waiting for epoch sweep |
| `E`  | EMBEDDED | Embedded atom header block |
| `O`  | ORPHANED | Failed free, needs cleanup |
| `L`  | LOCKED | Locked for update (transient) |
| `?`  | Gap | Untracked bytes (invariant violation) |
| `X`  | Overlap | Two blocks claim same bytes (invariant violation) |

### Invariants Checked

1. All data region bytes are accounted for (no gaps)
2. No two blocks overlap
3. SoA mirror arrays (status + capacity) match the AoS descriptor table
4. `tracked == expected` (total capacity of all blocks = data region size)

### Video Trace

X-RAY keeps a rolling buffer of the last 20 frames. On invariant violation, the video automatically replays, showing every captured frame leading up to the failure. Wire it into benchmarks:

```clojure
(doseq [n-workers [1 2 4 8 16]]
  (a/validate-storage-model! env {:width 80 :label (str "pre-" n-workers "w")})
  ;; ... run concurrent work ...
  (a/validate-storage-model! env {:width 80 :label (str "post-" n-workers "w")}))
```

### Step Debugger

The `eve_xray_main.cljs` harness runs 24 steps exercising the allocator:

```bash
npx shadow-cljs compile eve-xray
node target/thread-test/xray.js
```

See [X-RAY Documentation](../test/cljs_thread/XRAY.md) for the full API reference.
