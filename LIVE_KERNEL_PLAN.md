# Live Kernel + SAB Sync Implementation Plan

## Overview

Two interconnected changes that together eliminate the Service Worker dependency
and the `^:export` annotation requirement for downstream users:

1. **Live Kernel Strategy** (hybrid of strategies 2+3) — minimal kernel boots
   instantly, loads runtime on demand, catch-and-load handles non-exported fns
2. **SAB Sync Migration** — replace browser's SW-based XHR sync with
   SharedArrayBuffer + Atomics (same pattern Node.js already uses)

When both are complete, the Service Worker is no longer needed for core
functionality. Workers block via `Atomics.wait`, the main thread coordinates via
`Atomics.waitAsync`, and the Live Kernel boots workers without requiring the SW's
`/cljs-thread-kernel.js` endpoint.

---

## Part 1: Live Kernel Strategy

### Design

The Live Kernel combines eval-kernel's instant-boot kernel with blob-bootstrap's
script-loading, plus the catch-and-load mechanism for transparent IIFE unwrapping.

**Boot sequence:**

```
1. Parent creates worker (URL worker or eval worker)
2. Kernel (~20 lines) starts, sends 'ready'
3. Parent sends 'load-scripts' → kernel does importScripts/require
   - Loads: shared.js, core.js (the mandatory runtime)
4. Runtime initializes (side effects), worker is live
5. When eval'd function hits a ReferenceError (non-exported fn from screen.js):
   - catch-and-load strips IIFE, evals module in global scope
   - Retry succeeds — no ^:export needed
```

**Two modes:**

| Mode | Description | Use Case |
|------|-------------|----------|
| **Pre-built kernel** | Library ships a tiny kernel.js (~1KB) that users serve as a static file. Workers load it as a URL worker. | Simple setup, works with any build tool |
| **Build-your-own** | shadow-cljs `:modules` config produces a kernel module. Users control what goes in the kernel vs what's lazy-loaded. | Maximum control, smallest possible kernel |

**Key design decisions:**

- **Browser**: Always use URL workers (not blob) so COOP/COEP headers flow
  through and SAB is available. The kernel JS is served as a static file or
  via SW's `/cljs-thread-kernel.js` endpoint (during transition period).
- **Node**: Use eval workers with inline kernel (same as eval-kernel today).
- **Strategy propagation**: Store strategy config in `s/conf[:__spawn-strategy]`
  with `:type :live-kernel`. Child workers call `auto-install-from-conf!` to
  re-install the override.
- **Catch-and-load integration**: Configure `:loadable-modules ["screen.js"]`
  automatically based on the build's module manifest. Workers eagerly load
  these at startup (proven approach from autoload tests).

### Implementation Steps

#### Step 1: Create `src/cljs_thread/strategy/live_kernel.cljs`

New strategy file combining eval-kernel's kernel protocol with blob-bootstrap's
script loading and catch-and-load's module unwrapping.

```clojure
(ns cljs-thread.strategy.live-kernel
  (:require [cljs-thread.platform :as p]
            [cljs-thread.state :as s]
            [cljs-thread.strategy.common :as c]))
```

**Public API:**

```clojure
(live-kernel/init! {:scripts ["/shared.js" "/core.js"]
                    :loadable-modules ["screen.js"]  ; optional, for catch-and-load
                    :kernel-url "/kernel.js"})        ; optional, for pre-built kernel

(live-kernel/install!)
```

**Core functions to implement:**

1. `browser-kernel-js` — The ~20 line kernel (reuse from eval-kernel, but add
   SAB-aware init data reading from query params)
2. `node-kernel-js` — Node variant (reuse from eval-kernel)
3. `create-worker [data on-message]` — Creates kernel worker, boots it, returns
   Worker handle. Uses promise-based boot sequence.
4. `boot-worker! [worker scripts]` — Sends `load-scripts` command after ready
5. `install!` — Sets `p/create-worker-override`, stores strategy in `s/conf`
6. `auto-install-from-conf! [conf]` — Re-installs on child workers

**Browser worker creation flow:**

```
If :kernel-url provided (pre-built):
  → new Worker(kernel-url + "?" + encode-qp(init-data))
  → Worker loads kernel.js, sends 'ready'
  → Parent sends 'load-scripts' with runtime URLs

If no :kernel-url (build-your-own / inline):
  → Use SW's /cljs-thread-kernel.js endpoint (during transition)
  → OR generate blob URL from browser-kernel-js (if SAB sync available)
  → Same boot sequence
```

**Node worker creation flow:**

```
→ new Worker(node-kernel-js, {eval: true, workerData: data})
→ Kernel sends 'ready'
→ Parent sends 'load-scripts' with require paths
```

#### Step 2: Create pre-built kernel file

`resources/cljs-thread/kernel.js` — A static file users can serve:

```javascript
// cljs-thread Live Kernel v1.0
// Serve this file and reference it in live-kernel/init!
(function() {
  'use strict';
  var post = typeof self !== 'undefined'
    ? function(m) { self.postMessage(m); }
    : function(m) { require('worker_threads').parentPort.postMessage(m); };

  var listen = typeof self !== 'undefined'
    ? function(h) { self.onmessage = function(e) { h(e.data); }; }
    : function(h) { require('worker_threads').parentPort.on('message', h); };

  listen(function(msg) {
    if (!msg || !msg.__kernel) return;
    try {
      if (msg.cmd === 'eval') {
        (0, eval)(msg.code);
      } else if (msg.cmd === 'load-scripts') {
        if (typeof importScripts === 'function') {
          importScripts.apply(self, msg.urls);
        } else {
          msg.urls.forEach(function(p) { require(p); });
        }
      } else if (msg.cmd === 'ping') {
        post({__kernel_resp: true, cmd: 'pong'});
        return;
      }
      post({__kernel_resp: true, id: msg.id, ok: true});
    } catch(e) {
      post({__kernel_resp: true, id: msg.id, error: e.message});
    }
  });
  post({__kernel_resp: true, cmd: 'ready'});
})();
```

This is a universal kernel that works in both browser workers and Node
worker_threads. Users serve it as a static file.

#### Step 3: Wire catch-and-load integration

In `live-kernel/init!`, automatically set `:loadable-modules` in `s/conf` if
provided. The existing catch-and-load mechanism in `in.cljs` handles the rest:

```clojure
(defn init! [{:keys [scripts loadable-modules kernel-url]}]
  (reset! runtime-scripts (vec scripts))
  (when loadable-modules
    (swap! s/conf assoc :loadable-modules loadable-modules))
  (when kernel-url
    (reset! kernel-url-atom kernel-url)))
```

#### Step 4: Add shadow-cljs build target for testing

```clojure
;; In shadow-cljs.edn:
:live-kernel-browser
{:target     :browser
 :output-dir "target/live-kernel-test"
 :modules    {:shared {:entries []}
              :screen {:init-fn    cljs-thread.live-kernel-test/init!
                       :depends-on #{:shared}}
              :core   {:init-fn    cljs-thread.integration-core/init!
                       :depends-on #{:shared}
                       :web-worker true}}}

:live-kernel-browser-sw
{:target     :browser
 :output-dir "target/live-kernel-test"
 :modules    {:sw {:entries [cljs-thread.sw]
                   :web-worker true}}}
```

#### Step 5: Create test suite

- `test/cljs_thread/live_kernel_test.cljs` — Browser test runner
- `e2e/live-kernel.spec.js` — Playwright spec
- Tests should exercise:
  - Basic `in` with exported functions
  - `in` with non-exported functions (catch-and-load)
  - `future` with non-exported functions
  - `pmap` with non-exported functions
  - `spawn` with child workers (strategy propagation)
  - Nested `in` (worker A → worker B → worker C)
  - Conveyance (passing values between workers)

### Testing Plan

```bash
# Compile
npx shadow-cljs compile live-kernel-browser-sw live-kernel-browser

# Run
npx playwright test e2e/live-kernel.spec.js

# Expected: 24+ tests pass (8 tests x 3 scenarios)
```

---

## Part 2: SAB Sync Migration

### Design

Replace the browser's Service Worker sync mechanism with SharedArrayBuffer +
Atomics, mirroring the existing Node.js implementation.

**Current browser sync flow (SW-based):**
```
Worker A: @(in :b expr)
  → sync XHR GET /intercept/request/key.js?request-id=X
  → SW intercepts, holds connection open (unfulfilled Promise)
  → Worker B computes, POST /intercept/response/key.js
  → SW matches, resolves Promise → XHR returns to Worker A
```

**Proposed browser sync flow (SAB-based):**
```
Worker A: @(in :b expr)
  → Creates per-request signal-sab (8 bytes) + data-sab (1MB)
  → Posts {type: "register-sync", signalSab, dataSab} to parent (→ main thread)
  → Atomics.wait(signal-i32, 0, 0) — BLOCKS
  → Worker B computes, posts {type: "send-sync-response"} to parent (→ main thread)
  → Main thread coordinator matches request-id:
    → Writes response bytes to data-sab
    → Atomics.store(signal-i32, 0, 1) + Atomics.notify(signal-i32, 0, 1)
  → Worker A wakes, reads response from data-sab
```

This is **identical** to the Node.js implementation in `platform.cljs:224-369`.

**Main thread (screen) requests:**
- Can't use `Atomics.wait` (would freeze UI)
- Use the same async path: register in `coordinator-pending` with `:resolve-fn`
- When response arrives, call `resolve-fn` directly
- This is how Node main thread already works

**Message routing (browser equivalent of Node's parentPort):**
- Worker → main thread: `self.postMessage(msg)` (received by `worker.onmessage`)
- Main thread → worker: `worker.postMessage(msg)` (received by `self.onmessage`)
- Grandchild → parent → main: relay pattern (same as `install-sync-relay!`)

### Requirements

1. **COOP/COEP headers** — Required for SharedArrayBuffer in browsers:
   ```
   Cross-Origin-Opener-Policy: same-origin
   Cross-Origin-Embedder-Policy: credentialless
   ```
   Already set in `e2e/serve.js`. Users must set these on their servers.

2. **`Atomics.waitAsync`** — For main thread coordination:
   - Chrome 87+, Safari 16.4+, Firefox 145+ (Nov 2025)
   - Broad support in 2026

3. **SharedArrayBuffer available in workers** — Requires cross-origin isolation
   (the COOP/COEP headers above)

### Implementation Steps

#### Step 1: Add SAB sync to BrowserPlatform in `platform.cljs`

Add a new `browser-sab-request` function parallel to `browser-request`:

```clojure
(defn- browser-sab-request [getter opts env-data]
  (let [{:keys [resolve reject]} opts
        request-id (normalize-req-id (str getter))]
    (if resolve
      ;; Async path (main thread or explicit async)
      (if (browser-in-screen?)
        ;; Main thread IS the coordinator — register directly
        (do
          (swap! browser-coordinator-pending assoc request-id
                 {:async? true :resolve-fn resolve})
          nil)
        ;; Worker thread: post request to main thread via self.postMessage
        (let [handler (fn handler [^js e]
                        (let [msg (.-data e)
                              d (when (object? msg)
                                  (js->clj msg :keywordize-keys true))]
                          (when (and d
                                     (= (:type d) "sync-response")
                                     (= (:requestId d) request-id))
                            (.removeEventListener js/self "message" handler)
                            (resolve (edn/read-string (:payload d))))))]
          (.addEventListener js/self "message" handler)
          (js/self.postMessage
           #js {:type "register-sync"
                :requestId request-id
                :requester (str (:id env-data))
                :async true})
          nil))
      ;; Sync path: block until response (worker threads only)
      (let [signal-sab (js/SharedArrayBuffer. 8)
            data-sab (js/SharedArrayBuffer. node-data-buffer-size)
            signal-i32 (js/Int32Array. signal-sab)]
        (js/self.postMessage
         #js {:type "register-sync"
              :requestId request-id
              :requester (str (:id env-data))
              :signalSab signal-sab
              :dataSab data-sab})
        ;; Block until coordinator signals
        (js/Atomics.wait signal-i32 0 0)
        ;; Read response
        (let [data-len (aget signal-i32 1)
              data-u8 (js/Uint8Array. data-sab 0 data-len)
              decoder (js/TextDecoder.)
              edn-str (.decode decoder data-u8)]
          (edn/read-string edn-str))))))
```

#### Step 2: Add browser coordinator on main thread

Add `browser-coordinator-pending` atom and message handler, mirroring
`node-coordinator-handle-message`:

```clojure
(defonce ^:private browser-coordinator-pending (atom {}))

(defn- browser-coordinator-handle-message
  "Message handler on the main thread for SAB sync coordination.
   Mirrors node-coordinator-handle-message."
  [worker-ref ^js e]
  (let [msg (.-data e)
        d (when (object? msg) (js->clj msg :keywordize-keys true))
        msg-type (:type d)]
    (cond
      (= msg-type "register-sync")
      ;; ... same logic as node-coordinator-handle-message ...
      ;; but using browser-coordinator-pending atom

      (= msg-type "send-sync-response")
      ;; ... same logic ...

      (= msg-type "relay-sync")
      ;; ... relay from grandchild ...
      )))
```

#### Step 3: Install coordinator handler on worker creation

Modify `BrowserPlatform/-create-worker` to install the coordinator handler:

```clojure
(-create-worker [_ url data on-message]
  (let [full-url (str url (u/encode-qp data))
        w (js/Worker. full-url)]
    (set! (.-onmessage w)
          (fn [e]
            ;; Route sync protocol messages to coordinator
            (let [msg (.-data e)
                  t (and (object? msg) (aget msg "type"))]
              (if (or (= t "register-sync")
                      (= t "send-sync-response")
                      (= t "relay-sync"))
                (browser-coordinator-handle-message w e)
                (on-message e)))))
    w))
```

#### Step 4: Add browser sync relay for child workers

Mirror `install-sync-relay!` for browser:

```clojure
(defn install-browser-sync-relay!
  "On non-screen browser workers, relay sync protocol messages from
   child workers up to parent (self.postMessage → creator's onmessage)."
  [child-worker]
  (when (and (not node?) (not (browser-in-screen?)))
    (let [orig-handler (.-onmessage child-worker)]
      (set! (.-onmessage child-worker)
            (fn [e]
              (let [msg (.-data e)
                    t (and (object? msg) (aget msg "type"))]
                (if (or (= t "register-sync")
                        (= t "send-sync-response")
                        (= t "relay-sync"))
                  ;; Relay to parent
                  (js/self.postMessage (.-data e))
                  ;; Normal message
                  (when orig-handler (orig-handler e)))))))))
```

#### Step 5: Add browser-send-response via SAB path

Workers send responses back via postMessage instead of XHR POST:

```clojure
(defn- browser-sab-send-response [payload env-data]
  (js/self.postMessage
   #js {:type "send-sync-response"
        :payload (pr-str payload)}))
```

#### Step 6: Update BrowserPlatform to select sync mode

Add a `sab-sync?` flag that determines which sync path to use:

```clojure
(def ^:private sab-sync?
  "True when SAB-based sync is available and preferred."
  (and (not node?)
       (exists? js/SharedArrayBuffer)
       (exists? js/Atomics)))

;; In BrowserPlatform:
ISync
(-request [this getter opts]
  (if sab-sync?
    (browser-sab-request getter opts (-init-data this))
    (browser-request getter opts (-init-data this))))
(-send-response [this payload]
  (if sab-sync?
    (browser-sab-send-response payload (-init-data this))
    (browser-send-response payload (-init-data this))))
(-sleep [_ ms]
  (if sab-sync?
    (node-sleep ms)  ;; Reuse: Atomics.wait with timeout
    (browser-sleep ms)))
```

#### Step 7: Update `register-coordinator` for SAB mode

When SAB sync is active, the main thread IS the coordinator (no SW needed):

```clojure
(-register-coordinator [_ config callback]
  (if sab-sync?
    ;; SAB mode: main thread is coordinator, ready immediately
    (callback)
    ;; Legacy SW mode
    (let [sw-url ...]
      (on-sw-registration callback ...))))
(-coordinator-ready? [_]
  (if sab-sync?
    true
    (boolean (.-controller js/navigator.serviceWorker))))
```

#### Step 8: Update `no-blocking?` in `sync.cljs`

```clojure
(defn no-blocking? []
  (if p/node?
    false
    (if p/sab-sync?
      false  ;; SAB sync available — blocking works
      (not (contains? @s/conf :sw-connect-string)))))
```

### Migration Path

The implementation supports **both modes simultaneously**:

1. **If COOP/COEP headers present** → `SharedArrayBuffer` available →
   `sab-sync?` is true → use SAB path (no SW needed)
2. **If headers absent** → `SharedArrayBuffer` unavailable →
   `sab-sync?` is false → fall back to SW path (legacy)

This means:
- Existing apps with SW continue to work unchanged
- New apps can skip the SW entirely by setting COOP/COEP headers
- No breaking changes — pure additive

### Testing Plan

```bash
# Create new test targets without SW:
# :sab-sync-browser (no SW module — proves SW is not needed)

# Compile and run:
npx shadow-cljs compile sab-sync-browser
npx playwright test e2e/sab-sync.spec.js

# Also run ALL existing tests to verify no regressions
```

Tests should exercise:
- `@(in :worker expr)` from screen (async path via waitAsync/resolve-fn)
- `@(in :worker expr)` from another worker (sync path via Atomics.wait)
- Nested blocking: worker A → `@(in :b (do @(in :c expr)))` (relay chain)
- `sleep` via Atomics.wait timeout
- Error handling (worker dies while request pending)
- Fallback to SW when SAB unavailable

---

## Part 3: Integration — Live Kernel + SAB Sync

When both features are complete, the full stack looks like:

```
User's init!:
  (thread/init!
   {:core-connect-string "/core.js"
    ;; No :sw-connect-string needed!
    :strategy {:type :live-kernel
               :kernel-url "/kernel.js"     ; or inline
               :scripts ["/shared.js" "/core.js"]
               :loadable-modules ["screen.js"]}})
```

**What happens:**
1. Main thread detects SAB support → `sab-sync? = true`
2. No SW registration needed → coordinator callback fires immediately
3. Live Kernel strategy installed → workers boot via kernel protocol
4. Workers load shared.js + core.js → runtime active
5. First `in` call with non-exported fn → catch-and-load unwraps screen.js
6. All blocking uses `Atomics.wait` (workers) / `Atomics.waitAsync` (screen)

**SW is completely out of the picture.**

### Elimination Checklist

| SW Responsibility | Replacement |
|-------------------|-------------|
| Sync request hold-open | Atomics.wait on SAB |
| Response matching | Main-thread coordinator-pending atom |
| Sleep | Atomics.wait with timeout |
| `/cljs-thread-kernel.js` endpoint | Static kernel.js file or blob URL |
| Worker URL routing | Direct URL workers (no SW intercept) |

---

## Implementation Order

Recommended sequence (each step is independently shippable):

### Phase 1: Live Kernel Strategy (no SAB dependency)
1. Create `live_kernel.cljs` strategy
2. Create `resources/cljs-thread/kernel.js` pre-built kernel
3. Wire catch-and-load integration
4. Add test targets + test suite
5. Verify all existing tests still pass

### Phase 2: SAB Sync for Browser
1. Add `browser-sab-request` + `browser-sab-send-response` to platform.cljs
2. Add `browser-coordinator-handle-message` + coordinator-pending atom
3. Add browser sync relay for child workers
4. Update BrowserPlatform to select sync mode based on SAB availability
5. Update `sync.cljs` no-blocking? check
6. Add test targets + test suite (without SW)
7. Verify all existing tests still pass

### Phase 3: Full Integration
1. Update `thread/init!` to accept unified strategy config
2. Remove SW as a requirement from docs/examples
3. Add migration guide
4. Optional: deprecation warnings when SW mode is used

---

## Open Questions

1. **SAB size limit per request**: Currently using 1MB (`node-data-buffer-size`).
   Is this sufficient for all browser use cases? Consider making configurable.

2. **Worker limit**: Each sync request creates 2 SABs (signal + data).
   With many concurrent requests, memory usage grows. Consider SAB pooling.

3. **Timeout handling**: `Atomics.wait` supports a timeout parameter.
   Should we expose this? Current SW mode has `:max-time` and `:duration` opts.

4. **Cross-origin isolation fallback**: Some deployments can't set COOP/COEP
   (e.g., embedding in iframes). Should we auto-detect and fall back to SW?
   Current plan: yes, via `sab-sync?` flag.

5. **Pre-built kernel versioning**: How to handle kernel.js version mismatches
   when the library updates? Consider embedding a version check in the kernel
   protocol.
