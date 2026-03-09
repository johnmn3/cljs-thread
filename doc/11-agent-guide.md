# Agent & Contributor Guide

This document is for AI agents and new contributors. It covers the things that will violate your expectations when working with `cljs-thread`.

Read this before making changes to the codebase.

## The 11 Things That Will Surprise You

### 1. `@` on the screen thread returns a Promise, not a value

This is the #1 gotcha. In a worker, `@(future (+ 1 2))` blocks and returns `3`. On the main/screen thread, it returns a `Promise` that resolves to `3`.

```clojure
;; Worker:
(println @(future (+ 1 2)))  ;; prints 3

;; Screen thread:
(-> @(future (+ 1 2))
    (.then #(println %)))    ;; prints 3
```

The `@` macro is rewritten by a CPS transform (`go.clj`) — on the screen thread, it yields to the event loop instead of blocking. **The screen thread must never block.**

### 2. Binding conveyance is compile-time magic

The `in`, `spawn`, `future`, `pmap`, and `=>>` macros analyze your code at compile time via the ClojureScript compiler's `&env`. They extract local bindings and namespace vars, serialize them, and transmit them to workers.

This means:
- Only values known at compile time can be conveyed
- Stateful objects (atoms, channels) cannot be serialized
- The compiler must be able to see the binding — dynamically constructed symbols won't work
- Foreign vars are wrapped to prevent Closure compiler inlining

See `macro_impl.clj` and `go.clj` for the implementation.

### 3. Fat kernel means ALL workers share the same compiled source

Every worker boots from the exact same JavaScript source — the "fat kernel." There is no per-worker customization of the runtime. The kernel module URL(s) are detected once from `manifest.edn` and every `spawn` creates a blob worker that loads the kernel via `importScripts` with absolute URLs (browser) or an eval worker via `worker_threads` (Node).

This means:
- You cannot have different workers running different versions of the code
- The kernel includes the full `cljs-thread` runtime but NOT your app code (that's loaded on-demand via catch-and-load)
- In `:advanced` mode, an origin shim resolves relative `importScripts` calls to absolute URLs so dependency loading works from blob workers

See `strategy/fat_kernel.cljs`.

### 4. Catch-and-load is transparent but has first-call latency

When a worker executes code referencing a var from a module it hasn't loaded yet, it catches the `ReferenceError`, fetches the module via sync XHR, evaluates it, and retries. This is transparent to user code but:

- The first call to an unloaded function is slow (sync XHR + eval)
- Subsequent calls are fast (module is cached)
- This eliminates the need for `^:export` on user functions
- IIFE unwrapping handles Closure-compiled modules

### 5. Sync is direct peer-to-peer, no coordinator

Workers synchronize directly via **sync channels** — each channel pair carries a signal SAB (8 bytes for `Atomics.wait`/`Atomics.notify`) and an EVE atom for response data. When worker A calls `(in B expr)`, A blocks on its signal SAB while B evaluates the expression, writes the result to the EVE atom, and notifies A. The screen thread is never involved in synchronization.

This replaced an earlier coordinator-based architecture where the main thread relayed all sync messages between workers. The direct approach is simpler (~100 lines in `sync.cljs` vs ~400 lines of coordinator code) and eliminates the main thread as a bottleneck.

Key functions: `sync/make-sync-channel`, `sync/await-response`, `sync/deliver-response`.

### 6. SAB requires COOP/COEP headers or you get a fallback

`SharedArrayBuffer` requires cross-origin isolation headers:
```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

Without them:
- `SharedArrayBuffer` is undefined in the browser
- `cljs-thread` falls back to Service Worker sync (slower, ~4-10ms vs ~1-2ms per call)
- Node.js doesn't need headers — SAB is always available

All modern browsers support SAB with these headers — including **Safari 15.2+** (December 2021). The one Safari caveat: it does not support `credentialless` as a COEP value, so you must use `require-corp` and ensure cross-origin subresources have appropriate CORP/CORS headers.

### 7. Workers are NOT iframes

Web Workers have no DOM access. They have a different global scope (`self` instead of `window`). They communicate via `postMessage`. They cannot:
- Access `document`, `window`, or any DOM APIs
- Share JavaScript object references with other workers
- Use synchronous `XMLHttpRequest` on the main thread (only workers can block)

Data crosses worker boundaries via **`pr-str`/`cljs.reader` serialization** (handled by `serial.cljs`), not the browser's structured clone algorithm.

### 8. Eve atoms are NOT Clojure atoms

Eve's `SharedAtom` and `AtomDomain` live in `SharedArrayBuffer` — actual shared memory across workers. Unlike `cljs-thread`'s binding conveyance (which copies values), Eve atoms are true shared state:

- `swap!` is atomic across workers (uses SAB atomics)
- Changes are immediately visible to all workers
- The allocator uses descriptor tables, SIMD scanning, and epoch-based GC
- Memory layout is manual — no JavaScript GC involvement

See `eve/shared_atom.cljs` and `eve/data.cljs`.

### 9. The macro system has a CPS transform

`@expr` inside `spawn`, `in`, and `future` bodies is rewritten at compile time by `go.clj`. On workers, it becomes a blocking `Atomics.wait`. On the screen thread, it becomes an async continuation (CPS transform) that yields to the event loop.

This means:
- `@` is not just `deref` — it's a macro-expanded construct
- Nested `@` calls are rewritten into continuation chains
- The transform is why `(let [x @(future ...)] ...)` works — it's not blocking the screen thread

### 10. The worker mesh is fully connected

Every worker has a direct `MessageChannel` to every other worker. `spawn` establishes these connections. This means:
- Workers can message each other directly (not just through the screen thread)
- The `:root` worker coordinates mesh membership
- Worker count affects connection count quadratically (N workers = N*(N-1)/2 channels)
- Named workers (`:core`, `:db`, etc.) are accessible by keyword `:id` from anywhere

### 11. `pr-str`/`cljs.reader` serialization, not structured clone

Data crossing worker boundaries uses `pr-str`/`cljs.reader/read-string` serialization (via `serial.cljs`), not the browser's structured clone algorithm. This means:
- Clojure data types (keywords, vectors, maps, sets) serialize correctly
- Functions cannot be transmitted (they're serialized as their source form by the macros)
- Typed arrays and `ImageBitmap`s are handled as transferables by `serial.cljs`
- Eve data structures bypass serialization entirely — they're in shared memory

## Namespace Map

Start here when onboarding:

| Start With | To Understand |
|------------|--------------|
| `core.cljs` | Entry point, `init!`, what gets exported |
| `strategy/fat_kernel.cljs` | How workers boot, URL detection |
| `sync.cljs` | Direct SAB sync channels + SW fallback |
| `serial.cljs` | Wire serialization (typed arrays, EVE types, functions) |
| `macro_impl.clj` | Binding conveyance, foreign var wrapping |
| `go.clj` | CPS transform for `@` on screen thread |
| `msg.cljs` | Message routing and sync channel distribution |
| `spawn.cljs` | Worker lifecycle |
| `eve/shared_atom.cljs` | SharedArrayBuffer atom implementation |
| `eve/deftype_proto/xray.cljs` | X-RAY memory diagnostics |
| `debug.cljs` | Debug logging utilities with DCE support |

## Test Suite Overview

Tests are organized into three **tiers** by prerequisite:

| Tier | What It Needs | Examples |
|------|--------------|---------|
| `:pure` | Nothing — runs directly | `id-test`, `serial-test`, `util-test` |
| `:slab` | Slab allocator + atom domain | `map-test`, `vec-test`, `array-test`, `deftype-test`, `xray-stress-test`, `slab-double-free-test`, `alloc-race-test` |
| `:worker` | Fat kernel + thread mesh | `eve-integration-test`, `future-test`, `direct-sab-sync-test`, `parallel-futures-repro-test`, `typed-array-sharing-test` |

The runner auto-discovers `*_test.cljs` files and classifies them by tier:

```bash
clj -M:thread-test :node                        # all tests
clj -M:thread-test :tier slab :node             # slab tier only
clj -M:thread-test :ns "map" :node              # namespace regex filter
clj -M:thread-test :dry-run                     # show plan without running
clj -M:thread-test :list                        # list suites and discovered namespaces
```

Adding a test requires **no configuration changes** — just create `test/path/my_test.cljs` and the runner discovers it. See [Testing](10-testing.md) for the full reference.

## Common Pitfalls When Contributing

1. **Don't add `^:export`** — catch-and-load handles cross-module access
2. **Don't assume `@` blocks on screen** — it returns a promise; test on workers
3. **Don't serialize atoms across workers** — use Eve for shared state, or use `:no-globals?`
4. **Don't forget COOP/COEP headers** when testing in the browser — SAB won't work without them
5. **Don't modify `strategy/fat_kernel.cljs` casually** — it handles `:advanced` compilation, origin shim installation, and URL detection; changes here can break all worker boot
6. **Test on both Node.js and browser** — `platform.cljs` abstracts differences but edge cases exist
