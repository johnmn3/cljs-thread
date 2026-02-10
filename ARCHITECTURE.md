# Architecture

This document covers the internals of `cljs-thread` for contributors and advanced users.

## Fat Kernel

Workers boot with the full cljs-thread runtime inlined — no two-phase loading, no `importScripts`, no message queueing.

**Browser boot sequence:**
1. `init!` detects build output via `manifest.edn` (or `<script>` tags as fallback)
2. The kernel source is fetched once (sync XHR, hits browser cache) and cached in an atom
3. Each `spawn` creates a Blob URL from the cached source + init data preamble
4. The worker wakes up immediately functional — platform, messaging, sync, and mesh are all available

**Node.js boot sequence:**
1. `init!` reads the current script via `__filename` (or a dedicated kernel from manifest)
2. Each `spawn` creates an eval worker via `worker_threads` with the cached source
3. Kernel source is propagated to child workers via `workerData`

**Advanced compilation:** In `:advanced` mode, shadow-cljs modules start with `importScripts("dep.js")`. Since blob workers have `origin: null`, these calls fail. The fat kernel detects this (`needs-deps-inlined?`) and inlines the full dependency chain (e.g., `shared.js` + `core.js`), stripping the `importScripts` calls.

## Synchronization

### SAB Sync (preferred)

Uses `SharedArrayBuffer` + `Atomics.wait` / `Atomics.waitAsync` for blocking semantics:
- Workers block with `Atomics.wait()` on an `Int32Array` backed by a SharedArrayBuffer
- The coordinator (screen thread) wakes workers with `Atomics.notify()`
- Async coordination on the main thread uses `Atomics.waitAsync()`
- Requires cross-origin isolation headers (`Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Embedder-Policy: require-corp`)

### Service Worker Sync (fallback)

For environments without COOP/COEP headers (e.g., Safari workers, third-party embeds):
- Workers make synchronous XHR requests to the Service Worker
- The Service Worker holds the response until the coordinator signals completion
- Slower than SAB but works without special headers

## Module System

### Build configurations

**Single-module:** One `.js` file serves as both the page entry and worker kernel.

**Code-split:** Separate modules for different concerns:
- `shared.js` — common dependencies
- `screen.js` — main thread (DOM, rendering)
- `core.js` — worker entry point (web-worker bootstrap)

**Dedicated kernel (`:cljs-thread` module):** A standalone module containing just the cljs-thread runtime. Auto-detected by name from `manifest.edn`. This is the recommended pattern for larger applications.

### Manifest detection priority

When `init!` auto-detects the kernel:
1. **`:cljs-thread`** — dedicated kernel module (user-provided, stable name)
2. **`:core` + deps** — worker-safe module with full dependency chain
3. **Single module** — the only module IS the runtime
4. **`:shared`** — fallback for multi-module builds

### Catch-and-load

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

## Key Source Files

| File | Purpose |
|------|---------|
| `core.cljs` | `init!`, zero-config auto-detection |
| `strategy/fat_kernel.cljs` | Fat kernel: source detection, extraction, worker creation |
| `strategy/common.cljs` | Shared utilities: blob URLs, init-data embedding, URL resolution |
| `platform.cljs` | Browser/Node abstraction layer |
| `sync.cljs` | SAB + SW synchronization primitives |
| `msg.cljs` | Inter-worker message routing |
| `spawn.cljs` | Worker lifecycle management |
| `in.cljs` | `in` macro implementation |
| `future.cljs` | Thread pool and `future` |
| `pmap.cljs` | Parallel map |
| `injest.cljs` | `=>>` parallel transducer macro |
| `sw.cljs` | Service Worker entry point |
