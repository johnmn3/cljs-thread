# Fat Kernel: Zero-Config Self-Extracting Worker Runtime

## Executive Summary

Replace the current "live kernel" (a ~20-line JS bootstrap that can only
`eval` and `importScripts`) with a **fat kernel** — a blob worker that
ships the entire cljs-thread runtime inline. Workers boot fully capable
of processing `in`, `future`, `pmap`, sync, and mesh messaging without
any `importScripts` or configuration. User app code arrives on-demand via
catch-and-load.

This eliminates the need for explicit `init!` configuration. The library
auto-detects its own compiled output from `<script>` tags (browser) or
`__filename` (Node), caches the source text, and creates blob workers
from it. Every spawn after the first is a pure in-memory blob creation
with zero network I/O.

---

## Part 1: Architecture

### 1.1 Current State (on `claude/fix-cljs-node-tests-XHBSX`)

The "live kernel" strategy boots workers in two phases:

```
Phase 1: Create blob worker from ~20-line bootstrap JS
         (can only eval, importScripts, queue messages)
Phase 2: Parent sends load-scripts command → worker runs importScripts
         (cljs-thread runtime + app code load via network)
         → worker becomes functional
```

Problems:
- Phase 2 requires knowing script URLs → requires `init!` config
- Each worker makes network requests for scripts (even if cached)
- Workers are non-functional until Phase 2 completes
- Message queueing adds latency and complexity

### 1.2 Target State

```
Create blob worker from cached kernel source (full cljs-thread runtime)
→ Worker wakes up with platform, msg, sync, in, spawn, state, env
→ Worker is immediately a mesh participant
→ User app code arrives via catch-and-load on first ReferenceError
```

The "kernel" is no longer a bootstrap — it IS the runtime.

### 1.3 How the Kernel Source Is Obtained

**Browser:**
1. At first spawn, scan `<script src="...">` tags on the page
2. Identify which script(s) contain the cljs-thread runtime:
   - If a `manifest.edn` is fetchable from the build output directory,
     parse it to find the `:kernel` module (if code-split) or the
     `:shared` module (which contains cljs-thread in a split build)
   - Fallback: fetch each `<script>` source and check for a sentinel
     string (e.g., `cljs_thread.platform` or a purpose-built marker)
   - Fallback: use naming convention (`kernel.js`, `shared.js`)
3. `fetch()` the identified URL(s) with `{cache: "force-cache"}` —
   browser serves from HTTP cache (the scripts were already loaded as
   `<script>` tags, so they're guaranteed to be cached)
4. Concatenate the source texts and store in an atom — this is the
   kernel source string
5. For each worker: prepend `globalThis.__cljs_thread_init_data = ...`
   and `globalThis.__cljs_thread_origin = ...` to the cached kernel
   source, create a Blob, create a Worker from the Blob URL

**Node.js:**
1. At first spawn, detect `__filename` for the current script
2. `fs.readFileSync(__filename)` to get the source text
3. For code-split builds, also read sibling scripts identified by
   the shadow-cljs manifest or by convention
4. Cache the source string
5. For each worker: create via `new Worker(kernelSource, {eval: true,
   workerData: {...}})` — Node's `worker_threads` natively supports
   eval'd source strings

**Key property:** The first spawn pays a one-time cost to fetch/read
the kernel source. Every subsequent spawn is pure in-memory — no I/O.

### 1.4 Why Blob Workers

| Property | URL Worker | Blob Worker |
|----------|-----------|-------------|
| Network request | Yes (even if cached, revalidation) | No — source in memory |
| SW client | Yes — registers with Service Worker | No — invisible to SW |
| Init data | Query params or postMessage (async) | Prepended to source (sync) |
| Customizable | No — fixed script | Yes — can inject/prepend |
| CSP requirement | `worker-src 'self'` | `worker-src blob:` |
| `location.origin` | Correct | `"null"` — needs origin shim |
| Debugging | Full DevTools support | Limited source maps |

With SAB sync, the "not a SW client" property is no longer a downside —
it's a feature. We don't need the SW at all.

**CSP note:** Sites using strict CSP need `worker-src blob:` or
`worker-src 'self' blob:`. This is a well-understood pattern
([MDN worker-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/worker-src)).
The library should document this requirement and detect CSP failures
with a clear error message.

### 1.5 Browser Compatibility (as of 2026)

| Feature | Chrome | Firefox | Safari | Node.js |
|---------|--------|---------|--------|---------|
| Blob URL Workers | 8+ | 4+ | 6+ | N/A (use eval) |
| SharedArrayBuffer | 68+ | 79+ | 15.2+ | 8.10+ |
| Atomics.wait (workers) | 68+ | 79+ | 15.2+ | 8.10+ |
| Atomics.waitAsync (main) | 87+ | 145+ | 16.4+ | 16+ |
| COOP/COEP headers | 83+ | 79+ | 15.2+ | N/A |
| fetch() + cache | All modern | All modern | All modern | N/A |

**Firefox 145** (Nov 2025) was the final piece for `Atomics.waitAsync`.
As of 2026, the full stack is Baseline across all major browsers.

---

## Part 2: Detailed Design

### 2.1 New Strategy: `fat_kernel.cljs`

File: `src/cljs_thread/strategy/fat_kernel.cljs`

This strategy replaces `live_kernel.cljs` as the default. It:

1. **Auto-detects** the kernel source at first use (lazy init)
2. **Caches** the kernel source string in an atom
3. **Creates** blob workers with the full runtime inline
4. **Propagates** strategy config to child workers via `s/conf`

```clojure
(ns cljs-thread.strategy.fat-kernel
  (:require
   [cljs-thread.strategy.common :as common]
   [cljs-thread.platform :as p]
   [cljs-thread.state :as s]
   [cljs-thread.env :as e]
   [cljs-thread.util :as u]
   [clojure.edn :as edn]))

;; Cached kernel source — fetched once, reused for all workers
(defonce ^:private kernel-source (atom nil))
(defonce ^:private kernel-origin (atom nil))
(defonce ^:private loadable-modules-config (atom nil))
```

#### 2.1.1 Kernel Source Detection (Browser)

```clojure
(defn- fetch-text-cached
  "Fetch a URL as text, using force-cache to serve from browser cache.
   Returns the response text synchronously via sync XHR (called from
   main thread during init, not in hot path)."
  [url]
  (let [xhr (js/XMLHttpRequest.)]
    (.open xhr "GET" url false)  ;; synchronous
    (.setRequestHeader xhr "Cache-Control" "max-age=31536000")
    (.send xhr)
    (when (= 200 (.-status xhr))
      (.-responseText xhr))))

(defn- detect-kernel-scripts-from-manifest
  "Try to fetch and parse manifest.edn from the build output directory.
   Returns {:kernel-urls [...] :app-urls [...]} or nil."
  [base-url]
  (when-let [manifest-text (fetch-text-cached (str base-url "manifest.edn"))]
    (try
      (let [modules (edn/read-string manifest-text)
            by-id (into {} (map (juxt :module-id identity)) modules)
            kernel-mod (:kernel by-id)
            shared-mod (:shared by-id)]
        (cond
          ;; Dedicated kernel module exists — use it as the runtime
          kernel-mod
          {:kernel-urls [(str base-url (:output-name kernel-mod))]
           :app-urls (cond-> []
                       shared-mod (conj (str base-url (:output-name shared-mod))))}

          ;; No kernel module — shared.js contains the runtime
          shared-mod
          {:kernel-urls [(str base-url (:output-name shared-mod))]
           :app-urls []}

          :else nil))
      (catch :default _ nil))))

(defn- detect-base-url-from-scripts
  "Detect the base URL by examining <script> tags on the page.
   Returns the directory URL of the first script that looks like
   a shadow-cljs build output."
  []
  (when (exists? js/document)
    (let [scripts (array-seq (.querySelectorAll js/document "script[src]"))
          srcs (map #(.-src %) scripts)]
      (when-let [src (first srcs)]
        (let [last-slash (.lastIndexOf src "/")]
          (when (>= last-slash 0)
            (subs src 0 (inc last-slash))))))))

(defn- detect-kernel-scripts-from-tags
  "Fallback: detect kernel scripts from <script> tags.
   In a code-split build, the page loads shared.js + screen.js.
   In a non-split build, the page loads a single app.js.
   The kernel is everything EXCEPT the screen-specific module."
  [base-url]
  (when (exists? js/document)
    (let [scripts (array-seq (.querySelectorAll js/document "script[src]"))
          srcs (mapv #(.-src %) scripts)]
      (when (seq srcs)
        ;; In a code-split build: first script is shared.js (the runtime)
        ;; In a single-module build: only script is app.js (runtime + app)
        {:kernel-urls [(first srcs)]
         :app-urls []}))))

(defn- extract-kernel-source!
  "Detect and fetch the kernel source. Called once at first spawn.
   Stores result in kernel-source atom."
  []
  (when-not @kernel-source
    (if p/node?
      ;; Node: read own source file
      (let [fs (js* "require('fs')")
            path (js* "require('path')")
            self-path (try (js* "__filename") (catch :default _ nil))]
        (when self-path
          (let [source (.readFileSync fs self-path "utf8")
                base-dir (.dirname path self-path)]
            (reset! kernel-source source)
            (reset! kernel-origin base-dir)
            ;; Also check for manifest.edn to find additional kernel modules
            (let [manifest-path (.resolve path base-dir "manifest.edn")]
              (when (.existsSync fs manifest-path)
                (try
                  (let [manifest-text (.readFileSync fs manifest-path "utf8")
                        modules (edn/read-string manifest-text)
                        by-id (into {} (map (juxt :module-id identity)) modules)]
                    (when-let [kernel-mod (:kernel by-id)]
                      (let [kernel-path (.resolve path base-dir
                                                  (:output-name kernel-mod))
                            ksource (.readFileSync fs kernel-path "utf8")]
                        (reset! kernel-source ksource))))
                  (catch :default _ nil)))))))
      ;; Browser: detect from script tags and/or manifest
      (let [base-url (detect-base-url-from-scripts)
            detected (or (when base-url
                           (detect-kernel-scripts-from-manifest base-url))
                         (detect-kernel-scripts-from-tags base-url))]
        (when detected
          (let [{:keys [kernel-urls app-urls]} detected
                sources (mapv fetch-text-cached kernel-urls)
                combined (apply str (filter some? sources))]
            (when (seq combined)
              (reset! kernel-source combined)
              (reset! kernel-origin
                      (common/extract-origin (first kernel-urls))))))))))
```

#### 2.1.2 Worker Creation (Browser)

```clojure
(defn create-worker
  "Create a worker with the full cljs-thread runtime inlined.
   The worker wakes up immediately functional."
  [data on-message]
  ;; Lazy init: extract kernel source on first call
  (extract-kernel-source!)
  (when-not @kernel-source
    (throw (ex-info
            "fat-kernel: Could not detect kernel source. Provide :kernel-source or :scripts to init!"
            {})))
  (if p/node?
    ;; Node: eval worker with full source
    (let [init-data-js (common/embed-init-data-js data)
          full-source (str init-data-js @kernel-source)
          wt (js* "require('worker_threads')")
          WorkerCls (.-Worker wt)
          w (WorkerCls. full-source
                        #js {:eval true
                             :workerData (clj->js data)})]
      (p/install-coordinator-handler! w)
      (p/install-sync-relay! w)
      (.on w "message" on-message)
      w)
    ;; Browser: blob worker with full source
    (let [init-data-js (common/embed-init-data-js data)
          origin-js (if-let [origin @kernel-origin]
                      (str "globalThis.__cljs_thread_origin = "
                           (js/JSON.stringify origin) ";\n")
                      "")
          full-source (str init-data-js origin-js @kernel-source)
          blob-url (common/make-blob-url full-source)
          w (js/Worker. blob-url)]
      (set! (.-onmessage w) on-message)
      ;; Revoke blob URL after worker has loaded (5s grace)
      (js/setTimeout #(common/revoke-blob-url blob-url) 5000)
      w)))
```

#### 2.1.3 No Message Queue Needed

Unlike the current live kernel, there is no two-phase boot. The worker
executes the kernel source synchronously during construction. By the time
the parent's next microtask runs, the worker's cljs-thread runtime has
already:

- Initialized `platform.cljs` (auto-detected browser/node)
- Read `__cljs_thread_init_data` (set before kernel source in blob)
- Registered `message-handler` on `self`/`parentPort`
- Registered the `:call` dispatch multimethod
- Set up `state.cljs` atoms (peers, conf, etc.)

No message queueing. No replay. No `ready` handshake.

### 2.2 Zero-Config `init!`

```clojure
;; In core.cljs — the new init! signature
(defn init! [& [config-map]]
  (assert (e/in-screen?))
  (when config-map
    (swap! s/conf merge config-map))

  ;; Auto-detect loadable modules (screen.js for catch-and-load)
  (when-not (:loadable-modules @s/conf)
    (when-let [modules (auto-detect-loadable-modules @s/conf)]
      (swap! s/conf assoc :loadable-modules modules)))

  ;; Install fat-kernel strategy (unless user provided explicit strategy)
  (when-not (:strategy @s/conf)
    (fat-kernel/install!
     (select-keys @s/conf [:kernel-source :scripts :base-url])))

  ;; Rest of init proceeds as before...
  (let [config @s/conf]
    (if p/node?
      (sp/spawn-sw ...)
      (if (or (:sw-connect-string config) p/sab-sync?)
        (sp/spawn-sw ...)
        (spawn {:id :root ...} ...)))))
```

The override cascade:

```
1. (thread/init!)
   → fat-kernel auto-detects everything
   → SAB sync if available, SW fallback if not
   → loadable-modules auto-detected from <script> tags

2. (thread/init! {:strategy {:type :fat-kernel
                              :kernel-source "..."}})
   → fat-kernel with user-provided source string
   → skip auto-detection

3. (thread/init! {:core-connect-string "/core.js"
                   :sw-connect-string "/sw.js"})
   → legacy path, fat-kernel NOT installed
   → URL workers, SW sync
```

### 2.3 Strategy Propagation

When the fat-kernel strategy is active, child workers (spawned by root)
need to also use fat-kernel. The kernel source is already in the blob,
so child workers inherit it naturally — they just need to re-install
the `create-worker-override`.

```clojure
;; In fat_kernel.cljs — auto-install on worker load
(when-not (e/in-screen?)
  (when (= :fat-kernel (get-in @s/conf [:__spawn-strategy :type]))
    ;; The kernel source is already in our memory (we ARE the kernel)
    ;; Just re-install the create-worker-override
    (install-override!)))
```

But there's a subtlety: child workers need to be able to create their
OWN blob workers. They need the kernel source string. Since they ARE
running the kernel source, they can self-extract:

```clojure
(defn- self-extract-source!
  "On a worker, extract our own source to create child workers.
   Browser: read from globalThis.__cljs_thread_kernel_source
   (set by parent in the blob preamble).
   Node: read __filename."
  []
  (when-not @kernel-source
    (if p/node?
      (let [fs (js* "require('fs')")
            self-path (try (js* "__filename") (catch :default _ nil))]
        (when self-path
          (reset! kernel-source (.readFileSync fs self-path "utf8"))))
      ;; Browser: parent set this global with the kernel source
      (when (exists? js/globalThis.__cljs_thread_kernel_source)
        (reset! kernel-source js/globalThis.__cljs_thread_kernel_source)))))
```

For browser blob workers, we include the kernel source as a global:

```clojure
;; In create-worker, the blob preamble becomes:
(let [;; Include the kernel source for child-spawning
      kernel-export (str "globalThis.__cljs_thread_kernel_source = "
                         (js/JSON.stringify @kernel-source) ";\n")
      full-source (str init-data-js origin-js kernel-export @kernel-source)
      ...)
```

**Memory consideration:** This doubles the per-worker memory for the
kernel source string (~100-200KB per worker). For the typical case of
5-10 workers, this is ~1-2MB total — negligible. For worker counts in
the hundreds, we could optimize by sharing via SAB or only embedding
the source in workers that need to spawn children (root worker).

### 2.4 Catch-and-Load Integration

The fat kernel contains the full cljs-thread runtime but NOT the user's
app code. When a worker evals a stringified function that references
app-specific vars (e.g., `$APP.my_app.core.my_fn`), it hits a
`ReferenceError`.

The existing catch-and-load mechanism in `in.cljs` handles this:

1. `do-call` catches `ReferenceError`
2. Checks `:loadable-modules` in conf
3. Fetches the module source (sync XHR or `fs.readFileSync`)
4. Evals in global scope — app exports become available
5. Retries the original call

No changes needed to catch-and-load. The `:loadable-modules` config
is auto-detected from `<script>` tags by `auto-detect-loadable-modules`
(already implemented in `core.cljs`).

### 2.5 Fallback Chain

```
1. SAB available + kernel detectable
   → fat-kernel blob workers + Atomics.wait sync
   → BEST PATH: zero config, zero network, no SW

2. SAB available + kernel NOT detectable
   → fall back to live-kernel with explicit scripts
   → user must provide :scripts in init!

3. SAB NOT available + SW configured
   → URL workers (not blob, because SW sync needs SW clients)
   → legacy path, fully backwards compatible

4. SAB NOT available + no SW
   → basic spawn only, no blocking support
   → warning logged
```

---

## Part 3: Test Plan

### 3.1 Test Philosophy

- Every feature has Node + browser coverage
- Tests run under `:none`, `:simple`, and `:advanced` optimization
- Contention tests verify correctness under concurrent load
- Performance benchmarks detect regressions
- All existing tests must continue to pass (no regressions)

### 3.2 New Test Targets

#### 3.2.1 Node.js Tests

**Build: `:node-fat-kernel`**
```clojure
{:target     :node-script
 :output-to  "target/node-integration/fat-kernel.js"
 :main       cljs-thread.strategy.node-fat-kernel-test/main}
```

Tests (`test/cljs_thread/strategy/node_fat_kernel_test.cljs`):

1. **Auto-detection**: `init!` with zero args detects own source
2. **spawn-ephemeral**: `@(spawn (+ 21 21))` → 42
3. **spawn-nested**: `@(spawn (+ 1 @(spawn (* 6 7))))` → 43
4. **in-named-worker**: `@(in :core (+ 10 20 12))` → 42
5. **conveyance**: `(let [x 10 y 32] @(spawn (+ x y)))` → 42
6. **future-basic**: `@(future (+ 100 200))` → 300
7. **future-nested**: `@(future (+ 1 @(future (+ 2 3))))` → 6
8. **pmap-basic**: `(doall (pmap inc [1 2 3 4]))` → [2 3 4 5]
9. **=>>**: `(=>> (range 10) (map inc) (filter odd?) (apply +))` → 25
10. **child-spawn**: worker spawns sub-worker (strategy propagation)
11. **no-init-required**: `init!` called with no arguments succeeds

#### 3.2.2 Browser Tests

**Build: `:fat-kernel-browser`**
```clojure
{:target     :browser
 :output-dir "target/fat-kernel-test"
 :modules    {:kernel {:entries [cljs-thread.core]}
              :shared {:entries []}
              :screen {:init-fn    cljs-thread.fat-kernel-test-browser/init!
                       :depends-on #{:shared :kernel}}
              :core   {:init-fn    cljs-thread.integration-core/init!
                       :depends-on #{:shared :kernel}
                       :web-worker true}}}
```

Tests (`test/cljs_thread/fat_kernel_test_browser.cljs`):

**Functional tests** (same 11 as Node):
1-11. Same as Node tests above, using Promise-based `.then` pattern

**Auto-detection tests:**
12. **manifest-detection**: With manifest.edn present, correctly
    identifies kernel module
13. **script-tag-detection**: Without manifest.edn, correctly
    identifies runtime from `<script>` tags
14. **origin-detection**: Blob workers have correct `__cljs_thread_origin`

**Catch-and-load integration tests:**
15. **non-exported-fn-in-spawn**: Call a non-exported fn in spawn —
    catch-and-load unwraps screen.js
16. **non-exported-fn-in-future**: Same for future
17. **non-exported-fn-in-in**: Same for `in`

**SAB sync verification tests:**
18. **no-sw-registered**: Verify no Service Worker is registered
19. **blocking-in-worker**: `@(in :worker ...)` blocks correctly
20. **nested-blocking**: Worker A → `@(in :b (+ 1 @(in :c 2)))` → 3

#### 3.2.3 Browser Tests (Non-code-split)

**Build: `:fat-kernel-nosplit`**
```clojure
{:target     :browser
 :output-dir "target/fat-kernel-nosplit-test"
 :modules    {:app {:init-fn    cljs-thread.fat-kernel-test-browser/init!
                    :web-worker true}}}
```

Tests: Same functional tests 1-11 + auto-detection for single-module builds.

### 3.3 Contention Tests

**Build: `:fat-kernel-contention`**

Tests (`test/cljs_thread/fat_kernel_contention_test.cljs`):

1. **concurrent-futures**: Spawn 20 concurrent futures, all return correct results
   ```clojure
   (let [results (mapv #(future (+ % 1)) (range 20))]
     (= (mapv deref results) (range 1 21)))
   ```

2. **concurrent-in**: 10 concurrent `in` calls to same worker
   ```clojure
   (let [results (mapv #(in :core (+ % 100)) (range 10))]
     (= (mapv deref results) (range 100 110)))
   ```

3. **cross-worker-cascade**: Chain of `in` calls across 3 workers
   ```clojure
   @(in :w1 (+ 1 @(in :w2 (+ 2 @(in :w3 3)))))
   ;; → 6
   ```

4. **pmap-large**: `(pmap inc (range 1000))` returns correct results

5. **mixed-operations**: Interleave spawn, in, future, pmap calls

6. **rapid-spawn-terminate**: Spawn and deref 50 ephemeral workers in quick succession

7. **starvation-test**: All futures complete even under high load
   (verifies future pool doesn't deadlock)

### 3.4 Performance Benchmarks

Tests (`test/cljs_thread/fat_kernel_perf_test.cljs`):

1. **worker-boot-time**: Measure time from `spawn` to first response
   - Current baseline: ~40ms per worker
   - Target: ≤ current baseline (no regression)
   - Report: `FAT_KERNEL_BOOT_TIME: Xms`

2. **in-round-trip**: Measure `@(in :core (+ 1 2))` latency
   - Current baseline: 4-5ms per round trip
   - Target: ≤ current baseline
   - Report: `FAT_KERNEL_IN_RT: Xms`

3. **future-round-trip**: Measure `@(future (+ 1 2))` latency
   - Current baseline: 8-10ms per round trip
   - Target: ≤ current baseline
   - Report: `FAT_KERNEL_FUTURE_RT: Xms`

4. **spawn-throughput**: Time to spawn 10 ephemeral workers sequentially
   - Report: `FAT_KERNEL_SPAWN_10: Xms`

5. **kernel-extraction-time**: Time for `extract-kernel-source!`
   - First call (fetch): report `FAT_KERNEL_EXTRACT_FIRST: Xms`
   - Second call (cached): report `FAT_KERNEL_EXTRACT_CACHED: Xms`

6. **blob-creation-time**: Time for `new Blob([source])` + `URL.createObjectURL`
   - Report: `FAT_KERNEL_BLOB_CREATE: Xms`

7. **comparison-vs-live-kernel**: Same operations under live-kernel
   strategy for direct comparison
   - Report: `LIVE_KERNEL_BOOT_TIME: Xms` etc.

### 3.5 Optimization-Level Test Matrix

Each test suite runs under all three shadow-cljs optimization levels:

| Build | :none | :simple | :advanced |
|-------|-------|---------|-----------|
| Node fat-kernel | `:node-fat-kernel` | `:node-fat-kernel-simple` | `:node-fat-kernel-adv` |
| Browser fat-kernel | `:fat-kernel-browser` | `:fat-kernel-browser-simple` | `:fat-kernel-browser-adv` |
| Browser no-split | `:fat-kernel-nosplit` | `:fat-kernel-nosplit-simple` | `:fat-kernel-nosplit-adv` |

At minimum, `:none` and `:advanced` MUST pass. `:simple` is a bonus.
The critical case is `:advanced` with code splitting, where Closure
renames vars and catch-and-load must function correctly.

### 3.6 Playwright E2E Specs

| Spec File | Port | What It Tests |
|-----------|------|---------------|
| `e2e/fat-kernel.spec.js` | 9100 | Standard fat-kernel (code-split) |
| `e2e/fat-kernel-nosplit.spec.js` | 9101 | Fat-kernel (single module) |
| `e2e/fat-kernel-contention.spec.js` | 9102 | Contention and concurrency |
| `e2e/fat-kernel-perf.spec.js` | 9103 | Performance benchmarks |

Each spec:
- Starts the test server with COOP/COEP headers
- Navigates to the test page
- Waits for the test harness to report results in the DOM
- Asserts all tests passed
- Extracts and logs performance numbers

### 3.7 Regression Test Requirements

ALL existing tests from `claude/fix-cljs-node-tests-XHBSX` MUST continue
to pass without modification:

- Node unit tests (util, id, macro-impl, env, state)
- Node integration tests (all 4 strategies)
- Browser integration tests
- Browser strategy tests (code-split + non-split)
- Browser usability tests
- Browser autoload tests
- Live kernel tests
- SAB sync tests
- Kernel split tests

The fat-kernel strategy is ADDITIVE — it does not remove or modify any
existing strategy. It becomes the new DEFAULT but existing strategies
remain available for explicit use.

---

## Part 4: Implementation Order

### Phase 1: Core Fat Kernel (Node.js first)

**Why Node first:** No blob URLs, no CSP, no manifest detection, no
fetch caching. Just `fs.readFileSync` + `new Worker(source, {eval: true})`.
Simplest path to validate the core architecture.

Steps:
1. Create `src/cljs_thread/strategy/fat_kernel.cljs`
2. Implement Node.js `extract-kernel-source!` (read `__filename`)
3. Implement Node.js `create-worker` (eval with full source)
4. Implement `install!` / `uninstall!` / `auto-install-from-conf!`
5. Create `test/cljs_thread/strategy/node_fat_kernel_test.cljs`
6. Add `:node-fat-kernel` build target to `shadow-cljs.edn`
7. Run tests: `npx shadow-cljs compile node-fat-kernel && node target/node-integration/fat-kernel.js`
8. All 11 functional tests pass

### Phase 2: Browser Fat Kernel (code-split)

Steps:
1. Implement browser `extract-kernel-source!`:
   a. `detect-base-url-from-scripts`
   b. `detect-kernel-scripts-from-manifest`
   c. `detect-kernel-scripts-from-tags` (fallback)
   d. `fetch-text-cached`
2. Implement browser `create-worker` (blob with full source)
3. Add `__cljs_thread_kernel_source` export for child-spawning
4. Create `test/cljs_thread/fat_kernel_test_browser.cljs`
5. Add `:fat-kernel-browser` build target to `shadow-cljs.edn`
6. Create `e2e/fat-kernel.spec.js` and test HTML page
7. Run: `npx shadow-cljs compile fat-kernel-browser && npx playwright test e2e/fat-kernel.spec.js`
8. All 20 tests pass

### Phase 3: Browser Fat Kernel (non-code-split)

Steps:
1. Add `:fat-kernel-nosplit` build target
2. Create test HTML page for non-split
3. Add `e2e/fat-kernel-nosplit.spec.js`
4. Run tests
5. All functional tests pass

### Phase 4: Zero-Config init!

Steps:
1. Modify `core.cljs` `init!` to auto-install fat-kernel when no
   strategy is explicitly configured
2. Ensure `init!` with zero args works on both Node and browser
3. Ensure `init!` with explicit config still overrides
4. Test the three-tier cascade:
   - `(thread/init!)` → fat-kernel
   - `(thread/init! {:strategy {:type :fat-kernel ...}})` → explicit fat-kernel
   - `(thread/init! {:core-connect-string "/core.js"})` → legacy

### Phase 5: Contention + Performance Tests

Steps:
1. Create contention test files
2. Create performance benchmark test files
3. Add build targets and Playwright specs
4. Run benchmarks, record baselines
5. Compare against live-kernel strategy baselines
6. No performance regressions

### Phase 6: Regression Verification

Steps:
1. Run ALL existing test suites
2. Fix any failures (should be none if fat-kernel is additive)
3. Document any necessary changes

### Phase 7: Advanced Compilation Verification

Steps:
1. Add `:advanced` build variants for fat-kernel targets
2. Run all fat-kernel tests under `:advanced`
3. Verify catch-and-load works correctly
4. Verify foreign var wrapping (macro_impl.clj) works correctly

---

## Part 5: Open Questions & Risks

### 5.1 Kernel Source Size

The kernel (cljs-thread runtime + cljs.core subset) is ~100-200KB
gzipped-to-text. Each blob worker gets a copy of this source string
in memory. For the `__cljs_thread_kernel_source` export, the string
is JSON-escaped inside the blob, roughly doubling the per-worker memory
for the source.

**Mitigation:** Only export `__cljs_thread_kernel_source` to the root
worker (which spawns core, db, future workers). Leaf workers (core, db,
fp-*) don't need to spawn children, so they don't need the export.

### 5.2 CSP Restrictions

Sites with strict Content-Security-Policy that don't include
`worker-src blob:` will fail to create blob workers. This is a known
browser security constraint.

**Mitigation:**
- Detect CSP failure and log a clear error message
- Fall back to URL workers + SW sync as the legacy path
- Document the CSP requirement

### 5.3 Sync XHR for Kernel Extraction

The `fetch-text-cached` function uses synchronous XHR on the main
thread. This blocks the main thread briefly during `init!` / first spawn.

**Mitigation:**
- The fetch hits browser cache (the scripts were just loaded) so it's
  fast (~1-5ms per script)
- Only happens once per page load
- Could be made async with a Promise-based init path, but that
  complicates the API. Sync is acceptable for a one-time init cost.

**Alternative:** Use `async` fetch in a lazy `init!` that returns a
Promise, with the first `spawn` awaiting it. But this changes the API
semantics. Punt to future work if sync XHR proves problematic.

### 5.4 Source Map Debugging

Blob workers have limited source map support in browser DevTools.
Chrome can show blob worker sources but mapping back to .cljs files
is harder than with URL workers.

**Mitigation:**
- In dev mode (`:none` optimization), fall back to URL workers for
  better debugging experience
- In release mode, blob workers are fine (users don't debug production)
- This matches the existing blob-bootstrap strategy's behavior

### 5.5 Node.js eval Worker Limitations

Node's `new Worker(code, {eval: true})` has some limitations:
- `__filename` and `__dirname` are not set (they're synthetic)
- `require.resolve` may behave differently
- Module caching doesn't apply to eval'd code

**Mitigation:**
- The cljs-thread runtime doesn't depend on `__filename` inside workers
  (only the main thread uses it for detection)
- Node workers use `workerData` for init data, not query params
- These limitations are already handled by the existing eval-kernel
  and blob-bootstrap strategies

### 5.6 Circular Self-Extraction in Browser

In a code-split build, the main thread loads `kernel.js` + `shared.js` +
`screen.js`. The fat kernel source for workers should be `kernel.js` +
`shared.js` (NOT `screen.js`). The auto-detection logic must correctly
exclude the screen module.

**Mitigation:**
- `manifest.edn` parsing correctly identifies modules
- `auto-detect-loadable-modules` already identifies the screen module
- The screen module is added to `:loadable-modules` (catch-and-load),
  not to the kernel source

---

## Part 6: File Inventory

### New Files

| File | Purpose |
|------|---------|
| `src/cljs_thread/strategy/fat_kernel.cljs` | Fat kernel strategy implementation |
| `test/cljs_thread/strategy/node_fat_kernel_test.cljs` | Node.js integration tests |
| `test/cljs_thread/fat_kernel_test_browser.cljs` | Browser integration tests |
| `test/cljs_thread/fat_kernel_nosplit_test_browser.cljs` | Browser non-split tests |
| `test/cljs_thread/fat_kernel_contention_test.cljs` | Contention tests |
| `test/cljs_thread/fat_kernel_perf_test.cljs` | Performance benchmarks |
| `e2e/fat-kernel.spec.js` | Playwright E2E: code-split |
| `e2e/fat-kernel-nosplit.spec.js` | Playwright E2E: non-split |
| `e2e/fat-kernel-contention.spec.js` | Playwright E2E: contention |
| `e2e/fat-kernel-perf.spec.js` | Playwright E2E: performance |

### Modified Files

| File | Change |
|------|--------|
| `src/cljs_thread/core.cljs` | Auto-install fat-kernel in `init!` |
| `shadow-cljs.edn` | Add new build targets |
| `FAT_KERNEL_PLAN.md` | This document |

### Unchanged Files

All existing strategy files (`self_spawn.cljs`, `blob_bootstrap.cljs`,
`eval_kernel.cljs`, `live_kernel.cljs`) remain unchanged. All existing
test files remain unchanged. The fat kernel is purely additive.
