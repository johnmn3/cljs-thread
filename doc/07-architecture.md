# Architecture

This document covers the internals of `cljs-thread` for contributors and advanced users.

## Fat Kernel

Workers boot with the full `cljs-thread` runtime inlined — no two-phase loading, no `importScripts`, no message queueing.

### Browser Boot Sequence

1. `init!` detects build output via `manifest.edn` (probing each `<script>` tag's base URL)
2. The kernel module URL(s) are resolved and cached
3. Each `spawn` creates a Blob URL bootstrap that installs an origin shim, then loads the kernel via `importScripts` with absolute URLs
4. The worker wakes up immediately functional — platform, messaging, sync, and mesh are all available

### Node.js Boot Sequence

1. `init!` reads the current script via `__filename` (or a dedicated kernel from manifest)
2. Each `spawn` creates an eval worker via `worker_threads` with the cached source
3. Kernel source and EVE SAB configuration are propagated to child workers via `workerData`

### Advanced Compilation

In `:advanced` mode, shadow-cljs modules start with `importScripts("dep.js")`. Since blob workers have `origin: null`, `importScripts` with relative paths fails. The fat kernel installs an origin shim (setting `globalThis.__cljs_thread_origin`) that resolves relative URLs to absolute URLs before the kernel loads, so dependency loading works correctly from blob workers.

## Synchronization

### Direct SAB Sync (preferred)

Uses direct peer-to-peer `SharedArrayBuffer` sync — no main-thread coordinator needed:

Each channel pair between workers carries a **sync channel** consisting of:
1. **Signal SAB** (8 bytes) — an `Int32Array` for `Atomics.wait` / `Atomics.notify` coordination
2. **EVE atom** — a shared atom for response data (no size limits, no buffer overflow)

The calling worker blocks on `Atomics.wait()` on its signal SAB. The receiving worker writes the response to the EVE atom, then wakes the caller with `Atomics.notify()`. This is fully point-to-point — the screen thread is never involved in sync.

Key primitives in `sync.cljs`:
- `make-sync-channel` — creates a signal SAB + EVE response atom pair
- `await-response` — blocks on the signal SAB, then dereferences the response atom
- `deliver-response` — writes the result to the response atom and notifies the waiter

Async coordination on the main thread uses `Atomics.waitAsync()` (the screen thread must never block).

Requires cross-origin isolation headers (`Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Embedder-Policy: require-corp`).

### Service Worker Sync (fallback)

For environments without COOP/COEP headers (e.g., third-party embeds):
- Workers make synchronous XHR requests to the Service Worker
- The Service Worker holds the response until signaled
- Slower than direct SAB sync but works without special headers

## Module System

### Build Configurations

**Single-module:** One `.js` file serves as both the page entry and worker kernel.

**Code-split:** Separate modules for different concerns:
- `shared.js` — common dependencies
- `screen.js` — main thread (DOM, rendering)
- `core.js` — worker entry point (web-worker bootstrap)

**Dedicated kernel (`:cljs-thread` module):** A standalone module containing just the cljs-thread runtime. Auto-detected by name from `manifest.edn`. This is the recommended pattern for larger applications.

### Manifest Detection Priority

When `init!` auto-detects the kernel:
1. **`:cljs-thread`** — dedicated kernel module (user-provided, stable name)
2. **`:core` + deps** — worker-safe module with full dependency chain
3. **Single module** — the only module IS the runtime
4. **`:shared`** — fallback for multi-module builds

### Catch-and-Load

When a worker evaluates code that references vars from a module not yet loaded (e.g., functions defined only in `screen.js`), it hits a `ReferenceError`. The catch-and-load mechanism:
1. Catches the error
2. Fetches the missing module via sync XHR
3. Evaluates it (IIFE unwrapping for Closure-compiled modules)
4. Retries the original evaluation

This eliminates the need for `^:export` on user functions — any function in any module can be called from any worker.

## Platform Abstraction

`platform.cljs` provides a unified API across Browser and Node.js:
- Worker creation: `new Worker(blob-url)` vs `new worker_threads.Worker(code, {eval: true})`
- Message passing: `postMessage` / `onmessage` vs `parentPort`
- Sync primitives: SAB in both, SW fallback browser-only
- Self-detection: `document` existence vs `worker_threads.isMainThread`

The `create-worker-override` atom allows the fat kernel to intercept all worker creation without modifying the core spawn logic.

## Worker Mesh

Workers form a fully connected mesh — every worker has a direct message channel to every other worker:
- `spawn` creates a worker and establishes connections to all existing workers
- `in` routes execution to any worker by reference or `:id`
- The `:root` worker coordinates spawning and mesh membership
- Named workers (`:core`, `:db`, etc.) are accessible by `:id` from any worker

## Thread Pools

**Future pool:** Pre-spawned workers (`fp-0`, `fp-1`, ...) for `future` dispatch. Workers are checked out, used, and returned to the pool.

**Injest pool:** Dedicated workers (`injest-0`, `injest-1`, ...) for `=>>` parallel transducer fan-out.

## Macro System

The `in`, `spawn`, `future`, `pmap`, and `=>>` macros perform compile-time analysis:

1. **Binding capture:** Inspect `&env` for locals, scan body for namespace vars
2. **Foreign var wrapping:** Detect vars from other namespaces in value position and wrap them to prevent Closure inlining
3. **CPS transform:** Rewrite `@expr` inside bodies to async parking (on the screen thread, `@` yields to the event loop instead of blocking)
4. **Conveyance map generation:** Build the map of bindings to serialize and transmit

## Key Source Files

| File | Purpose |
|------|---------|
| `core.cljs` | `init!`, zero-config auto-detection |
| `strategy/fat_kernel.cljs` | URL detection, kernel resolution, worker creation |
| `strategy/common.cljs` | Blob URLs, init-data embedding, origin shim |
| `platform.cljs` | Browser/Node abstraction layer |
| `standard.cljs` | Platform abstraction protocol and implementations |
| `sync.cljs` | Direct SAB sync channels + SW fallback primitives |
| `serial.cljs` | Wire serialization (typed arrays, EVE types, functions) |
| `msg.cljs` | Inter-worker message routing and sync channel distribution |
| `spawn.cljs` | Worker lifecycle management |
| `in.cljs` | `in` macro implementation |
| `future.cljs` | Thread pool and `future` |
| `pmap.cljs` | Parallel map |
| `injest.cljs` | `=>>` parallel transducer macro |
| `macro_impl.clj` | Shared macro utilities (binding capture, foreign var wrapping) |
| `go.clj` | CPS rewriter for `@expr` to async parking |
| `debug.cljs` | Debug logging utilities with DCE support |
| `sw.cljs` | Service Worker entry point |
| `eve/shared_atom.cljs` | SharedArrayBuffer atom implementation |
| `eve/deftype_proto/xray.cljs` | X-RAY memory diagnostics for slab allocator |
