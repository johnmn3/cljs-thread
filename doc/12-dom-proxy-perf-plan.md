# DOM Proxy Performance: Implementation Plan

## Strategies 1 + 2 — Write-Through Shadow Cache & Transactional Commit

**Motivation**: The worker-side DOM proxy currently makes one synchronous round-trip per
DOM *read* (e.g. `getAttribute`, `getBoundingClientRect`, `style.width`). On the
ServiceWorker sync path this costs ~21 ms each; on the SAB path ~0.1–1 ms. Even on SAB,
dozens of reads per animation frame from React's reconciler or d3's transition machinery
adds up to tens of ms of wall-clock stall.

`(in :screen ...)` is fast because the entire function body runs natively on the screen
thread with zero wire overhead. The goal of Strategies 1 + 2 is to approach that speed
*automatically* — without requiring callers to wrap code in `(in :screen ...)`.

---

## Executive Summary

**Strategy 1 — Write-Through Shadow Cache**
When the worker batches a write (`setAttribute`, `style.width = …`, `textContent = …`),
shadow the new value in a worker-local map. Subsequent reads of the same property on the
same element hit the shadow (0 ms, no round-trip) instead of crossing to the screen.
Handles the overwhelmingly common d3 pattern: *write a value, then read it back in the
same tween*.

**Strategy 2 — Transactional Commit**
Extend the batch queue with a `"read"` op sentinel. During a batch window, instead of
doing an immediate `in-sync` round-trip, getter methods *enqueue* their read request and
return a deferred thunk. At `with-batch` flush time, all writes **and** reads are
dispatched in a single `in-sync` call; results are stored in a `batch-read-results` atom
and the thunks resolve against it. Net cost per frame: **1 round-trip** regardless of how
many reads occur — compared to N round-trips today.

**Composability**: Strategy 1 eliminates zero-cost reads (values just written); Strategy 2
handles the remainder at 1x RTT instead of Nx. Together they cover virtually every
frontend library pattern.

**Target libraries**: d3, React 18 (concurrent, legacy), Reagent/Re-frame, Vue 3,
Svelte, Solid, Preact, Angular, lit-html, vanilla DOM, canvas 2D context.

---

## Background: Why the Proxy Is Slow

### Current GET trap

```
prop lookup →
  1. internals (__dom_handle etc.) — 0ms
  2. special handlers (addEventListener, rAF, observers) — 0ms
  3. native worker globals (Promise, setTimeout, …) — 0ms
  4. locally-cached values (keyword props, complex JS objects, method-fns) — 0ms
  5. everything else → in-sync round-trip to screen — ~21ms (SW) / ~0.5ms (SAB)
```

Tier 5 is hit for *every read* not previously seen. Method functions are cached after
first access (tier 4), but the *return values* of those methods (e.g. `getAttribute`
result, `getBoundingClientRect` result) are never cached.

### Why `(in :screen ...)` is fast

The entire ClojureScript form is serialised as a string and `eval`'d on the screen thread.
d3's internals call `getAttribute`, `style.getPropertyValue`, etc. on *real* DOM objects —
zero wire overhead. One postMessage per `(in :screen ...)` call, no matter how many DOM
ops it contains.

The proxy cannot do this automatically because it has no visibility into the *call graph*
of user code. Strategies 1 + 2 are the practical equivalent without requiring code changes
by library authors.

---

## Strategy 1: Write-Through DOM Property Shadow Cache

### Concept

A worker-side atom `dom-shadow` mirrors the most-recently-written primitive value for each
`{handle, property}` pair. On every batched (or immediate) write, update the shadow. On
every read, check the shadow before doing `in-sync`.

This is inspired by **WorkerDOM** (AMP project), which maintains a full shadow tree.
We take a lighter approach: only shadow values we *wrote*, not the full DOM state.

### Data Structure

```clojure
;; {handle (int) -> {prop (string) -> wire-val}}
(defonce ^:private dom-shadow (atom {}))
```

### Write Side

In the `:set` trap and `make-method-fn` batch path, whenever we enqueue a write op,
*also* update the shadow:

**Proxy SET trap** (line 603 in current proxy.cljs):
```clojure
(if @batch-queue
  (do
    (swap! batch-queue conj #js ["set" handle prop wire-val])
    ;; NEW: shadow the written value
    (swap! dom-shadow assoc-in [handle prop] wire-val))
  ...)
```

For the immediate (non-batch) sync set path, shadow after write:
```clojure
(in-sync (in :screen ...))
;; NEW: shadow even on immediate write
(swap! dom-shadow assoc-in [handle prop] wire-val)
```

**make-method-fn batch path** — cover `setAttribute`, `setAttributeNS`,
`removeAttribute`, `setProperty` (CSS style), `insertAdjacentHTML`, `append`,
`appendChild`, `replaceWith`, `remove`, etc.:

```clojure
(when (and @batch-queue (not (getter-method? method-name)) ...)
  (swap! batch-queue conj #js ["call" handle method-name (into-array wire-args)])
  ;; NEW: shadow known attribute writes
  (case method-name
    "setAttribute"
    (swap! dom-shadow assoc-in [handle (aget wire-args 0)] (aget wire-args 1))
    "removeAttribute"
    (swap! dom-shadow update handle dissoc (aget wire-args 0))
    nil) ;; other methods — no shadow (unknown return effect)
  js/undefined)
```

### Read Side

In `make-method-fn` — before the `in-sync` fallback, check the shadow for known
attribute-read methods:

```clojure
;; NEW: shadow cache check for attribute readers
(case method-name
  "getAttribute"
  (let [attr-name (first wire-args)
        shadow-val (get-in @dom-shadow [handle attr-name] ::miss)]
    (if (not= shadow-val ::miss)
      shadow-val           ;; 0ms — no round-trip
      (in-sync ...)))      ;; miss — go to screen
  ;; All other getter methods fall through to in-sync
  (in-sync ...))
```

In the GET trap (tier 5 — string property read), check shadow before screen:

```clojure
;; NEW: check shadow before screen round-trip
(let [shadow-val (get-in @dom-shadow [handle prop] ::miss)]
  (if (not= shadow-val ::miss)
    shadow-val
    (let [result (in-sync (in :screen ...))]
      ;; Optionally populate shadow on read-through (read cache)
      ;; — see §Read-Through Cache below
      (when (and (not (map? result)) (not (vector? result)))
        (swap! dom-shadow assoc-in [handle prop] result))
      (cond
        (and (map? result) (:fn? result))
        (let [method (make-method-fn handle prop)]
          (unchecked-set target prop method)
          method)
        :else (unwrap-result result)))))
```

### Shadow Invalidation

The shadow is a *worker's view* of what it has written. It must be invalidated when:

1. **External DOM mutations** — another script, user interaction, or CSS changes a
   property we shadowed. Solution: **conservative TTL** (see §TTL below) OR
   **MutationObserver invalidation** (see §MutationObserver below).

2. **Handle reuse** — if the screen side removes an element and re-uses the handle for a
   new element (currently handles are never reused, but defensive cleanup is cheap):
   on element removal messages, clear `(swap! dom-shadow dissoc handle)`.

#### Option A: TTL (simple, safe default)

Shadow entries expire after N ms of no write access (default: 500ms, covering one rAF
chain). After TTL, next read falls through to screen and repopulates the shadow.

```clojure
;; {handle -> {prop -> {:val v :ts timestamp-ms}}}
(defonce ^:private dom-shadow (atom {}))
(def ^:private shadow-ttl-ms 500)

(defn- shadow-get [handle prop]
  (let [entry (get-in @dom-shadow [handle prop])]
    (when (and entry (< (- (.now js/Date) (:ts entry)) shadow-ttl-ms))
      (:val entry))))

(defn- shadow-set! [handle prop val]
  (swap! dom-shadow assoc-in [handle prop] {:val val :ts (.now js/Date)}))
```

#### Option B: MutationObserver Invalidation (precise)

Install a `MutationObserver` on the screen side (via `(in :screen ...)` at boot) that
monitors attribute changes on all observed elements and posts `{:type :dom-shadow-invalidate, :handle H, :prop P}` back to the worker. The worker clears only affected entries. This is accurate but adds message overhead on external mutations.

**Recommendation**: Implement Option A (TTL) first. Add Option B as an opt-in flag for
apps that need precision (React reconciler often re-reads attributes it just wrote, within
the same synchronous render — TTL window of 500ms covers this easily).

### Coverage for React

React's reconciler pattern:
```
commitUpdateEffects → setProperty (write) → ... → getCurrentFiber → getAttribute (read-back)
```

With shadow cache: the `getAttribute` after `setAttribute` hits the shadow — 0ms.

React 18 concurrent mode may interleave reads/writes across multiple microtask boundaries.
The shadow TTL of 500ms easily spans a render cycle (typically <16ms). For concurrent
features that schedule over longer periods, we can adjust TTL per-element or per-batch.

### React-specific properties to shadow

React writes these very frequently and often reads them back:
- `value`, `defaultValue` (inputs)
- `checked`, `defaultChecked` (checkboxes)
- `style.*` (inline styles via `element.style.setProperty`)
- `className`
- `textContent`, `innerHTML` (text updates)
- `disabled`, `readOnly`, `required` (form state)
- All ARIA attributes (`aria-*`)
- All data attributes (`data-*`)

The shadow covers all of these automatically since it's keyed by `{handle, prop}` with no
property whitelist.

---

## Strategy 2: Transactional Commit (Read-Write Bundling)

### Concept

Inspired by **Via.js** (Ashley Gullen / Scirra, 2018), extended to support reads in the
same transaction. During a `with-batch` window:

- **Writes** queue as before: `["set" H P V]`, `["call" H M args]`
- **Reads** also queue: `["read" H M args result-key]`
- Getter calls return a *deferred thunk* `#(get @batch-read-results result-key)`
- `with-batch` flush sends ONE `in-sync` call containing all writes + reads
- Screen executes all writes in order, then executes reads, returns `{result-key → value}`
- Results stored in `batch-read-results` atom; thunks resolve

Net cost: **1 in-sync call per batch window** regardless of read count.

### New Atoms

```clojure
;; When non-nil, we're in a batch window — reads queue instead of blocking.
;; Same atom as batch-queue, extended with "read" ops.
;; (already exists as batch-queue)

;; Stores read results after flush: {result-key -> unwrapped-value}
(defonce ^:private batch-read-results (atom nil))

;; Monotonically increasing key for read deduplication
(defonce ^:private next-read-key (atom 0))
```

### Read Op Format

```clojure
;; ["read" handle method-name wire-args result-key]
#js ["read" handle method-name (into-array wire-args) result-key]
```

For property reads (GET trap):
```clojure
;; ["read-prop" handle prop result-key]
#js ["read-prop" handle prop result-key]
```

### Modified make-method-fn

```clojure
(defn- make-method-fn [handle method-name]
  (js/Proxy.
   (js/Function.)
   #js {:apply
        (fn [_target _this-arg args]
          (let [wire-args (mapv to-wire (js/Array.from args))]
            (cond
              ;; WRITE batch path (unchanged)
              (and @batch-queue
                   (not (getter-method? method-name))
                   (every? primitive-wire? wire-args))
              (do (swap! batch-queue conj #js ["call" handle method-name (into-array wire-args)])
                  ;; Strategy 1: shadow known writes
                  (shadow-write! handle method-name wire-args)
                  js/undefined)

              ;; NEW: READ deferred path (Strategy 2)
              ;; During batch: queue read, return thunk instead of blocking
              (and @batch-queue
                   (getter-method? method-name)
                   (every? primitive-wire? wire-args))
              (let [rk (swap! next-read-key inc)]
                (swap! batch-queue conj
                       #js ["read" handle method-name (into-array wire-args) rk])
                ;; Return thunk — caller can deref after flush
                (fn [] (get @batch-read-results rk)))

              ;; FALLBACK: immediate sync (non-batch, complex args, etc.)
              :else
              (let [result (in-sync (in :screen ...))]
                (unwrap-result result)))))}))
```

### Modified with-batch Flush

The flush `in :screen` call needs to handle `"read"` ops and return a results map:

```clojure
(defn with-batch
  ([f] (with-batch f nil))
  ([f _label]
   (reset! batch-queue [])
   (reset! batch-read-results {})
   (try
     (f)
     (let [ops      @batch-queue
           ops-json (when (seq ops) (js/JSON.stringify (to-array ops)))]
       (reset! batch-queue nil)
       (when ops-json
         (let [results
               (in-sync
                (in :screen
                  (let [parsed (js/JSON.parse ops-json)
                        n      (.-length parsed)
                        read-results (js-obj)]
                    (dotimes [i n]
                      (let [op      (aget parsed i)
                            op-type (aget op 0)]
                        (case op-type
                          "set"
                          (let [obj (cljs-thread.dom.registry/lookup (aget op 1))]
                            (when obj (unchecked-set obj (aget op 2) (aget op 3))))
                          "call"
                          (let [obj (cljs-thread.dom.registry/lookup (aget op 1))
                                m   (when obj (unchecked-get obj (aget op 2)))]
                            (when m (.apply m obj (aget op 3))))
                          "read"
                          (let [obj (cljs-thread.dom.registry/lookup (aget op 1))
                                m   (when obj (unchecked-get obj (aget op 2)))
                                r   (when m
                                      (cljs-thread.dom.registry/result->wire
                                       (.apply m obj (aget op 3))))]
                            (unchecked-set read-results (aget op 4) r))
                          "read-prop"
                          (let [obj (cljs-thread.dom.registry/lookup (aget op 1))
                                r   (when obj
                                      (cljs-thread.dom.registry/result->wire
                                       (unchecked-get obj (aget op 2))))]
                            (unchecked-set read-results (aget op 3) r))
                          "warn"
                          (.warn js/console (aget op 2)))))
                    read-results)))]
           ;; Populate batch-read-results so thunks can resolve
           (reset! batch-read-results
                   (reduce (fn [m k] (assoc m k (unwrap-result (unchecked-get results k))))
                           {}
                           (js/Object.keys results))))))
     (catch :default e
       (reset! batch-queue nil)
       (reset! batch-read-results {})
       (throw e)))))
```

### Ordering Guarantee

Write ops are replayed in *queue order* before reads. This is correct because:

1. Writes committed first ensure reads see the latest values (not stale screen state).
2. The screen executes the whole batch atomically within a single `in :screen` call, so
   there's no interleaving with other worker-to-screen messages.

### Deferred Thunk Protocol

The thunk contract: **callable after `with-batch` returns**. Callers that need the value
*immediately within* the batch must use Strategy 1 (shadow cache). The thunk is intended
for code that reads a value in one callback and uses it in a *later* one — e.g. d3's
transition `attrTween` which reads the start value in frame N and writes the end value in
frame N+1.

For inline synchronous reads (like `const w = el.getAttribute("width"); el.style.width = w + "px"`)
Strategy 1 (shadow) covers the case where `width` was written this batch. For the case
where it was NOT previously written (first read), the thunk approach defers the value.
We detect this via a `::pending` sentinel: if the thunk is called *before* flush, we fall
back to immediate `in-sync`.

```clojure
(let [rk (swap! next-read-key inc)
      ;; Track: has this read resolved?
      resolved? (atom false)]
  (swap! batch-queue conj #js ["read" handle method-name (into-array wire-args) rk])
  ;; Return smart thunk
  (fn []
    (if @resolved?
      (get @batch-read-results rk)
      ;; Called before flush — do immediate sync and store result
      (let [result (in-sync (in :screen ...))]
        (reset! batch-read-results (assoc @batch-read-results rk result))
        (reset! resolved? true)
        (unwrap-result result)))))
```

This makes the API safe for *any* caller pattern: the thunk is always callable and always
returns the correct value, regardless of when it is called relative to the flush.

---

## Composability: How 1 + 2 Work Together

| Scenario | Covered By | Cost |
|---|---|---|
| Write then read same prop (d3 tween) | Strategy 1 | 0 ms |
| Read prop written earlier this frame | Strategy 1 | 0 ms |
| Read prop never written (first frame) | Strategy 2 | 1 RTT total for the frame |
| Multiple reads, all new (React reconciler) | Strategy 2 | 1 RTT total for the frame |
| Read inside `with-batch` before flush | Smart thunk fallback | 1 RTT (that read only) |
| Non-batch context (outside rAF) | Existing in-sync | 1 RTT per call |

With both strategies enabled, the typical d3 animation frame goes from:
- **Before**: 10 reads × 21ms = 210ms stall + 1 write flush = **~212ms per frame** (SW path)
- **After**: 0 shadow misses + 1 RTT for any novel reads = **~21ms max per frame** (SW path), **<1ms** (SAB path)

---

## React 18 Compatibility

React's reconciler issues reads and writes in well-defined phases. With both strategies:

### Render Phase (reads)
React reads `element.value`, `element.checked`, `element.tagName`, `className`, etc. to
diff the fiber tree. These happen *outside* rAF (in a microtask scheduler). No batch
context is active.

**Implication**: Strategy 2's deferred thunks are NOT active here. React gets immediate
`in-sync` reads. This is correct — React needs real values to diff against.

**However**: If we populate the shadow on *any* read (read-through caching), React's reads
fill the shadow so subsequent writes that "undo" a change hit the cache. TTL ensures
staleness doesn't accumulate.

### Commit Phase (writes + reads)
React writes properties and immediately reads them back to verify (controlled inputs,
focus management, scroll restoration). This runs in a tight synchronous loop, often inside
a `requestAnimationFrame` or `flushSync`.

**Implication**: If React's commit is inside a `with-batch` window (rAF dispatch), writes
are queued AND shadowed, reads hit shadow — 0ms. If not inside `with-batch`, individual
`in-sync` calls occur as today.

**Action item**: Consider wrapping React's `flushSync` analog in `with-batch`. Since React
doesn't use `requestAnimationFrame` directly (it uses a custom scheduler), we may need to
intercept the scheduler or provide a `useEffect`/`useLayoutEffect` wrapper.

### React Scheduler Integration (Phase 3 extension)

React 18 uses `MessageChannel` to schedule work:
```js
const channel = new MessageChannel();
channel.port1.onmessage = performWorkUntilDeadline;
channel.port2.postMessage(null);
```

Since `MessageChannel` on the worker proxy routes through the native worker `MessageChannel`
(it's in `native-worker-globals`), the scheduler runs correctly on the worker. The
`onmessage` callbacks fire on the worker's event loop. Each such callback is a natural
`with-batch` boundary.

**Extension**: Intercept `MessageChannel.port1.onmessage` assignment in the proxy SET trap
to wrap the assigned handler in `with-batch` automatically. This is similar to how `:dom-raf`
dispatch already wraps rAF callbacks.

---

## Library Compatibility Matrix

| Library | Key Read Pattern | Covered By | Notes |
|---|---|---|---|
| **d3** (transitions) | `getAttribute` after `setAttribute` | S1 | Primary motivator |
| **d3** (first frame) | `getAttribute` on virgin element | S2 | 1 RTT per frame |
| **React 18** (concurrent) | `value`, `checked` read-back | S1 + S2 | Commit phase |
| **React 18** (legacy) | `getBoundingClientRect` | S2 | Layout effects |
| **Reagent / Re-frame** | Hiccup diffing | S1 | Minimal direct reads |
| **Vue 3** | `vnode.el.*` property reads | S1 + S2 | Patch algorithm |
| **Svelte** | `element.value` (two-way bind) | S1 | Direct prop read |
| **Solid.js** | Fine-grained updates, no VDOM diff | S1 | Reads in effects |
| **Preact** | Same as React | S1 + S2 | |
| **Angular** | `zone.js` + change detection | S2 | Zone.js wraps all ops |
| **lit-html** | Template parts, minimal reads | S1 | |
| **Canvas 2D** | `getImageData`, `measureText` | S2 | Already fast (method cached) |
| **vanilla DOM** | All patterns | S1 + S2 | |

---

## Implementation Phases

### Phase 0: Shared Infrastructure (prerequisites)

1. Extract `getter-method?` predicate:
   ```clojure
   (defn- getter-method? [method-name]
     (or (.startsWith method-name "get")
         (.startsWith method-name "has")
         (.startsWith method-name "query")
         (.startsWith method-name "matches")
         (.startsWith method-name "closest")))
   ```

2. Extract `primitive-wire?` predicate:
   ```clojure
   (defn- primitive-wire? [v]
     (or (nil? v) (string? v) (number? v) (boolean? v)))
   ```

3. Add `dom-shadow` atom (TTL variant).

### Phase 1: Strategy 1 — Write-Through Shadow Cache

**Files changed**: `src/cljs_thread/dom/proxy.cljs` only.

**Changes**:
1. Add `dom-shadow` atom and `shadow-get`/`shadow-set!`/`shadow-invalidate!` helpers.
2. In `:set` trap batch path — call `shadow-set!`.
3. In `:set` trap immediate path — call `shadow-set!` after `in-sync`.
4. In `make-method-fn` batch path — call `shadow-set!` for `setAttribute`,
   `removeAttribute`, `setAttributeNS`, `setProperty` (CSS).
5. In `make-method-fn` sync path (getter methods) — check `shadow-get` FIRST,
   return cached value if hit.
6. In GET trap tier 5 — check `shadow-get` before `in-sync`.
7. (Optional) Read-through: populate shadow on `in-sync` reads of primitives.

**Test**: Run `shadow-build-run core-test` suite + confetti E2E. d3 `getAttribute` calls
should hit shadow after first `setAttribute` in same batch.

### Phase 2: Strategy 2 — Transactional Commit

**Files changed**: `src/cljs_thread/dom/proxy.cljs` only.

**Changes**:
1. Add `batch-read-results` atom and `next-read-key` atom.
2. Modify `with-batch` to reset `batch-read-results` on entry, collect results map on flush,
   call `reset! batch-read-results` with parsed results.
3. Modify the flush `in :screen` body to handle `"read"` and `"read-prop"` ops and return
   a results JS object.
4. In `make-method-fn` — add the READ deferred path (smart thunk with `::pending` fallback).
5. In GET trap tier 5 — add `"read-prop"` queueing path (also with smart thunk).

**Test**: Write a unit test that reads a property that was NOT previously written in the
same batch and verifies only 1 round-trip occurs.

### Phase 3: React Integration

**Files changed**: `src/cljs_thread/dom/proxy.cljs`, possibly new
`src/cljs_thread/dom/scheduler.cljs`.

**Changes**:
1. In proxy SET trap — detect `port1.onmessage` assignment (React scheduler hook).
   Wrap the assigned handler in `with-batch`.
2. Add `flushSync` interception: when `ReactDOM.flushSync` is called through the proxy,
   wrap its callback in `with-batch`.
3. Add `useLayoutEffect` / `useEffect` interception — these run synchronously after
   commit; wrap their callbacks in `with-batch`.

**Note**: Phase 3 requires the React example app to be built first. The integration
pattern may evolve once we observe React's actual call patterns through the proxy.

### Phase 4: MutationObserver Shadow Invalidation (optional precision)

1. At boot (in `window-proxy` init), install a `MutationObserver` on `document.body`
   on the screen side that posts `{:type :shadow-invalidate :handle H :prop P}` for
   attribute mutations.
2. Add `m/dispatch :shadow-invalidate` handler that calls `shadow-invalidate!`.
3. Add a per-handle `observe!` call when a handle is first registered.

This upgrades the shadow from TTL-based to event-driven precision. Not required for
correctness (TTL is safe), but eliminates the class of "stale shadow" bugs for apps
with complex external DOM manipulation.

---

## Risks and Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Shadow serves stale value (external mutation) | Low (most writes are by the worker) | TTL eviction; MutationObserver invalidation (Phase 4) |
| Thunk called before flush returns wrong value | Low (smart thunk falls back to in-sync) | Smart thunk with `::pending` sentinel |
| Read-op ordering: read before its dependent write | Very low (ops queue in code order) | Flush processes writes then reads |
| Non-serializable read result (DOM node) | Medium | `result->wire` already handles this; results unwrapped via `unwrap-result` |
| Framework reads shadow during re-render, gets stale value | Medium for long-running SPAs | TTL of 500ms; option to configure per-app |
| Increased complexity in `with-batch` | N/A (risk to maintainability) | Keep read/write op handling in named helpers |

---

## Success Metrics

1. **d3 bar animation**: 60 fps with proxy path (no `(in :screen ...)` wrapper required).
2. **React counter app**: React re-renders trigger <2 round-trips per commit phase.
3. **Shadow hit rate**: >90% of `getAttribute` calls hit shadow during a d3 transition.
4. **Regression**: All existing `core-test` and E2E tests continue to pass.
5. **Perf test**: Frame time with 10 d3 transitions active: <16ms on SAB, <100ms on SW.

---

## File Map

All changes are isolated to **`src/cljs_thread/dom/proxy.cljs`** for Phases 1 and 2.

```
src/cljs_thread/dom/
  proxy.cljs          ← Phases 1, 2, 3 (primary file)
  registry.cljs       ← No changes needed
  scheduler.cljs      ← Phase 3 (new, optional)
test/
  e2e/confetti-capture.spec.js  ← Existing, already passes
  unit/dom_shadow_test.cljs     ← New: shadow cache unit tests
  unit/transactional_test.cljs  ← New: round-trip count assertion tests
```

---

## Open Questions

1. **Shadow scope**: Should the shadow cover *all* handles or only handles created within
   a `with-batch` window? (Recommendation: all handles — React's reads happen outside
   batch but writes happen inside; a global shadow lets them interleave correctly.)

2. **Read-through caching**: Should a cache miss that does an `in-sync` read also
   populate the shadow? (Recommendation: yes, with TTL — makes React's render-phase reads
   cheaper on repeated renders of the same component.)

3. **TTL value**: 500ms is conservative. For apps that never mutate the DOM externally
   (all writes go through the worker proxy), TTL can be `Infinity`. Consider a
   `set-shadow-ttl!` API or a configuration option in `shadow-cljs.edn`.

4. **`getBoundingClientRect` and layout reads**: These return live geometry — shadowing
   them is dangerous (layout changes after a write). Strategy 2 (transactional read) is
   the right tool here, NOT Strategy 1 (shadow). Add `getBoundingClientRect`,
   `getClientRects`, `getBBox` (SVG), `getComputedStyle` to a `no-shadow` exclusion set.

5. **Strategy 2 + non-primitive results**: Read ops that return DOM nodes (e.g.
   `querySelector`) return handle maps via `result->wire`. These need `unwrap-result`
   applied to the batch result map entries. Already accounted for in the flush design above.
