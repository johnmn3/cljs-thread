# Documentation Update Plan

## Overview

The README and surrounding docs are substantially outdated. They reflect the original Service Worker-only architecture and don't cover:

- **Zero-config `init!`** — the headline UX improvement
- **Fat Kernel strategy** — blob/eval workers with full runtime inlined
- **Node.js support** — worker_threads with eval workers
- **5 worker spawn strategies** — pluggable architecture
- **SAB sync** — SharedArrayBuffer blocking without Service Worker
- **COOP/COEP deployment headers** — required for SAB
- **`:cljs-thread` module naming** — dedicated kernel module convention
- **Catch-and-load** — transparent module loading for non-exported fns
- **Advanced compilation support** — dependency chain inlining

---

## Plan

### 1. README.md — Major Rewrite

The README is the primary entry point. It needs a structural overhaul while preserving the excellent API documentation (spawn, in, future, pmap, =>>).

#### 1a. New "Getting Started" section (replace existing)

**Current state:** Shows only shadow-cljs with Service Worker config, Figwheel/cljs.main stubs.

**New content:**
- **Zero-config quickstart** — the simplest path:
  ```clojure
  (ns my-app.core
    (:require [cljs-thread.core :as thread :refer [spawn in future pmap]]))

  (thread/init!)  ;; That's it — auto-detects everything
  ```
- **Minimal shadow-cljs.edn** — single-module build (simplest):
  ```clojure
  {:builds
   {:app {:target :browser
          :output-dir "resources/public/js"
          :modules {:app {:init-fn my-app.screen/init!}}}}}
  ```
- **Code-split build** — recommended for larger apps (screen + core modules):
  ```clojure
  {:builds
   {:app {:target :browser
          :output-dir "resources/public/js"
          :modules
          {:shared {:entries []}
           :screen {:init-fn my-app.screen/init!
                    :depends-on #{:shared}}
           :core   {:init-fn my-app.core/init!
                    :depends-on #{:shared}
                    :web-worker true}}}}}
  ```
- **Dedicated kernel module** — advanced, using `:cljs-thread` naming convention
- **Node.js setup** — `:node-script` target, `(thread/init!)` just works

#### 1b. New "How It Works" section (add after Getting Started)

Brief architecture overview:
- Fat kernel: workers boot with full runtime inlined (blob/eval)
- SAB sync: SharedArrayBuffer + Atomics for blocking semantics (no SW needed)
- Catch-and-load: app code loaded on-demand when workers hit ReferenceError
- Mesh: workers auto-connect to all other nodes
- Diagram: Screen thread → init! → Root → Core/DB → Future pool

#### 1c. Update `init!` documentation (replace existing section)

**Current state:** Only shows explicit SW/core/repl connect strings.

**New content:**
- Zero-config: `(init!)` — auto-detects from manifest.edn, auto-installs fat-kernel
- Explicit config: `(init! {:core-connect-string "/core.js"})` — manual worker script
- Legacy SW mode: `(init! {:sw-connect-string "/sw.js" :core-connect-string "/core.js"})`
- Full options table: `:core-connect-string`, `:sw-connect-string`, `:repl-connect-string`, `:loadable-modules`, etc.

#### 1d. Add "Deployment" section (new)

- **COOP/COEP headers** — required for SAB sync:
  ```
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: require-corp
  ```
- Explanation of why (SharedArrayBuffer requires cross-origin isolation)
- Fallback: SW mode still works without these headers
- Common server configs (Express, Nginx, Cloudflare)

#### 1e. Add "Node.js" section (new)

- Setup with shadow-cljs `:node-script` target
- `(thread/init!)` works identically — uses worker_threads + eval workers
- Example: parallel computation on Node

#### 1f. Update "Platforms & Browser Support"

- Chrome/Edge: full support (SAB + fat kernel)
- Firefox: full support (SAB + fat kernel)
- Safari: SW fallback (SAB restricted in workers)
- Node.js: full support (worker_threads)

#### 1g. Preserve existing API sections

Keep spawn, in, future, pmap, =>> sections largely as-is. They are well-written. Minor updates:
- Remove "20 milliseconds" timing claims (varies by strategy)
- Add Node.js notes where relevant (e.g., deref returns value directly, not promise)
- Update performance notes to reflect SAB vs SW differences

#### 1h. Update "Some history" section

- Add fat kernel evolution story: SW → live kernel → fat kernel
- Mention that SW is now optional (SAB sync replaces it)
- Update tau.alpha/tau.beta references if needed

#### 1i. Remove stale content

- Remove Figwheel/cljs.main "forthcoming" stubs
- Remove outdated timing claims
- Remove "eventually I'd like to minimize build tool configuration" — it's done now

### 2. New: ARCHITECTURE.md

Create a concise architecture document covering the internals:

- **Worker spawn strategies** — comparison table:
  | Strategy | Mechanism | SW Required | Config Required | Best For |
  |----------|-----------|-------------|-----------------|----------|
  | Self-Spawn | URL worker | Yes | Full | Legacy |
  | Blob Bootstrap | Blob + importScripts | Yes | Moderate | — |
  | Eval Kernel | Eval + load-scripts | No | Moderate | — |
  | Live Kernel | Eval + catch-and-load | No | Moderate | — |
  | Fat Kernel | Blob/eval with full runtime | No | Zero | Default |

- **Sync mechanisms**:
  - SAB sync: SharedArrayBuffer + Atomics.wait/waitAsync (preferred)
  - SW sync: Service Worker intercepts XHR, proxies to coordinator (legacy)

- **Module system**:
  - Code-split builds: shared.js + screen.js + core.js
  - Single-module builds: app.js
  - Catch-and-load: transparent IIFE unwrapping for non-exported fns
  - `:cljs-thread` module naming convention

- **Platform abstraction**: `platform.cljs` — unified API for Browser/Node

- **Message mesh**: fully connected worker mesh, `msg.cljs`

### 3. New: DEPLOYMENT.md

Focused guide on deploying cljs-thread apps:

- **Development** — `npx shadow-cljs watch app` with default server (no special headers needed for SW mode)
- **Production with SAB** — COOP/COEP headers, server configuration examples
- **Production without SAB** — Service Worker fallback, SW file serving
- **CDN considerations** — CORS headers for cross-origin scripts
- **Troubleshooting** — common issues:
  - "SharedArrayBuffer is not defined" → missing COOP/COEP headers
  - Workers fail to load → check Content-Security-Policy
  - Blob worker origin:null → library handles with absolute URLs

### 4. Update shadow_dashboard example

The demo app's build config is outdated. Update:
- `shadow-cljs.edn` to show modern `:cljs-thread` module pattern
- Screen init to use zero-config `(thread/init!)`
- Add comments explaining the build structure

### 5. Clean up internal plan docs

- `FAT_KERNEL_PLAN.md` — Mark as "COMPLETED" or move to `docs/design/` directory
- `LIVE_KERNEL_PLAN.md` — Same treatment
- These are valuable design documents but shouldn't be top-level in the repo

---

## Implementation Order

1. **README.md rewrite** — highest impact, first priority
2. **ARCHITECTURE.md** — helps contributors and advanced users
3. **DEPLOYMENT.md** — practical ops guide
4. **shadow_dashboard updates** — working example
5. **Plan doc cleanup** — housekeeping

---

## What NOT to change

- The API sections (spawn, in, future, pmap, =>>, dbg/break) — well-written, mostly accurate
- Test files — not user-facing documentation
- Source code comments — already good
