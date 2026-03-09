# History & Design Notes

## Origins: tau.alpha

`cljs-thread` is derived from [`tau.alpha`](https://github.com/johnmn3/tau.alpha), released around 2019. `tau.alpha` explored shared-memory concurrency in the browser using `SharedArrayBuffer` typed arrays, providing shared `atom`s and `agent`s with semantics similar to Clojure's.

A slightly updated version of `tau.alpha` is available at https://gitlab.com/johnmn3/tau, and a demo of SAB-based shared memory benefits is at https://simultaneous.netlify.app/.

## The SAB Detour

Early in `tau.alpha`'s development, blocking semantics were achieved via synchronous XHRs and hacking the response from a SharedWorker. This approach was abandoned when `SharedArrayBuffer` + `Atomics.wait` proved both simpler and faster.

Unfortunately, `SharedArrayBuffer` was disabled across all major browsers in January 2018 due to Spectre/Meltdown vulnerabilities. When browsers re-enabled SAB, they gated it behind cross-origin isolation headers (`Cross-Origin-Opener-Policy` + `Cross-Origin-Embedder-Policy`), making deployment significantly more restrictive.

## Why cljs-thread Exists

`tau.alpha`'s shared-memory `atom`s deliver the highest possible performance for cross-worker state, but the COOP/COEP requirement makes them impractical for some deployments. Many of `tau.alpha`'s other features — `spawn`, `in`, `future`, `pmap`, binding conveyance — don't strictly need shared memory. They just need blocking semantics, which can also be provided by a Service Worker fallback.

`cljs-thread` extracts these portable primitives into a standalone library that works with or without `SharedArrayBuffer`. The idea: build the threading foundation that works everywhere, then build `tau.beta` on top of it for those who want shared-memory atoms and agents.

## The Fat Kernel

Early versions of `cljs-thread` used a variety of worker boot strategies:

1. **Self-spawn** — workers loaded the same script URL as the page
2. **Blob bootstrap** — workers loaded from a blob URL with a minimal bootstrap
3. **Eval kernel** — workers received source via `postMessage` and eval'd it
4. **Live kernel** — workers received code incrementally

Each had tradeoffs around startup time, code splitting, and `:advanced` compilation compatibility. The **fat kernel** strategy consolidated all of these:

- Workers boot from a blob URL (browser) or eval string (Node) containing the full `cljs-thread` runtime
- The kernel module URL(s) are detected from `manifest.edn`, cached, and reused for every `spawn`
- In `:advanced` mode, an origin shim resolves relative `importScripts` calls to absolute URLs from blob workers
- Workers wake up immediately functional — no two-phase boot, no message queueing

This eliminated the complexity of multiple strategies and made `(thread/init!)` zero-config.

## Direct SAB Sync: Removing the Coordinator

The original `cljs-thread` sync layer used a **coordinator** on the main thread. Every blocking call (e.g., `@(in worker expr)`) went through the screen thread: Worker A sent a message up to the coordinator, the coordinator relayed it to Worker B, Worker B replied to the coordinator, and the coordinator wrote the response to a SAB and notified Worker A. This worked but was complex (~400 lines in `platform.cljs`) and made the main thread a bottleneck.

The **direct SAB sync** migration (February 2026) replaced the coordinator with peer-to-peer sync channels. Each channel pair between workers carries:
1. A **signal SAB** (8 bytes) for `Atomics.wait`/`Atomics.notify` coordination
2. An **EVE atom** for response data (no size limits, garbage collected)

Workers now synchronize directly — the calling worker blocks on its signal SAB while the receiving worker writes the response to the shared atom and notifies. The coordinator code was removed entirely from `platform.cljs`, and the new sync primitives (`make-sync-channel`, `await-response`, `deliver-response`) live in `sync.cljs`.

This was a major simplification: ~400 lines of coordinator code replaced by ~100 lines of direct sync, with better performance and no main-thread involvement.

## Eve: SharedArrayBuffer Data Structures

Eve represents the next evolution — bringing `tau.alpha`'s shared-memory vision into `cljs-thread` as an optional subsystem. Eve provides:

- `AtomDomain` and `SharedAtom` — cross-worker shared state backed by SAB
- Persistent data structures (hash-map, hash-set, vector, list) in shared memory
- Custom type definitions via `eve/deftype` with SAB-backed field storage
- A custom allocator with descriptor tables, SIMD scanning, and epoch-based GC

Eve is integrated into the core sync layer — direct SAB sync channels use EVE atoms for response data, and the future pool is managed via EVE atoms. Eve is also the foundation for `tau.beta`.

## Design Philosophy

1. **Zero config by default.** `(thread/init!)` should just work.
2. **Familiar APIs.** `future`, `pmap`, `spawn` should feel like Clojure.
3. **Blocking semantics matter.** Without them, you can't compose operations naturally.
4. **The screen thread must never block.** `@` returns a promise on the main thread.
5. **Transparent cross-worker execution.** Binding conveyance makes `in` feel like local code.
6. **Progressive disclosure.** Start with `future`, graduate to `spawn`/`in`, opt into Eve when you need shared memory.
