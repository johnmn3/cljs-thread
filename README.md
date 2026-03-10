# `cljs-thread`: `spawn`, `in`, `future`, `pmap`, `pcalls`, `pvalues`, `=>>` and shared `atom`

## _"Two steps closer to threads on the web"_

`cljs-thread` brings familiar threading primitives to ClojureScript - both in the browser (Web Workers) and on Node.js (`worker_threads`). Zero configuration required. Zero copy persistent data structures managed by shared atoms backed by SharedArrayBuffers.

```html
<div id="app"></div>
<script src="cljs-thread.js"></script>
<script src="screen.js"></script>
<script>cljs_thread.main(reagami_counter.core.main)</script>
```

<img width="400" alt="reagami counter with D3 bar and confetti" src="docs/reagami-counter/reagami-counter-screenshot.png">

```clojure
(ns reagami-counter.core
  (:require-macros [cljs-thread.core :refer [future in spawn]])
  (:require
   [cljs-thread.core :as t]
   [reagami.core :as reagami]
   ["d3" :as d3]
   ["canvas-confetti" :as confetti]))

;; we're in a worker right now...

(defonce state (t/atom ::state {:counter 0}))

(defn update-bar! [n]
  (-> (d3/select "#bar")
      (.transition)
      (.duration 300)
      (.attr "width" (str (* n 10) "%"))))

(defn my-component []
  [:div
   [:svg {:width "100%" :height 40}
    [:rect#bar {:x 0 :y 5 :height 30 :fill "#4CAF50" :rx 4 :width 0}]]
   [:div "Counted: " @(future (* 100 (:counter @state)))]
   [:button
    {:on-click #(let [n (:counter (swap! state update :counter inc))]
                  (update-bar! n)
                  (when (= n 10)
                    (confetti #js {:particleCount 200 :spread 70})))}
    "Click me!"]])

(defn render []
  (reagami/render (.querySelector js/document "#app") [my-component]))

(def renderer
  (spawn ::renderer
    (add-watch state ::render (fn [_ _ _ _] (render)))))

(defn ^:export main []
  (in renderer (render)))
```

### True Shared Persistent Data Structures
`t/atom` creates an atom backed by **EVE** (Extensible Value Encoding) - a persistent data structure engine built directly on `SharedArrayBuffer`. Pass a namespace-qualified keyword as the first argument (e.g., `::state`) to register the atom globally - when other workers call `defonce` with the same ID, they get the existing atom instead of creating a new one. EVE maps, vectors, and sets live in shared memory, so every worker sees the same data without serialization or copying. `swap!`, `assoc`, `update`, and all standard Clojure operations work in-place on the shared buffer with zero-copy semantics across threads.

### Real Parallelism
`future` dispatches to the thread pool - the `swap!` and counter multiplication execute off the core thread.

**Blocking semantics** via direct `SharedArrayBuffer` sync - workers communicate peer-to-peer using sync channels (`Atomics.wait` / `Atomics.notify` + EVE atoms). A Service Worker fallback is available for environments without COOP/COEP headers.

See **[Architecture](doc/07-architecture.md)** for the full picture.
### DOM Proxy _("core is the new main")_
The DOM proxy transparently routes `document.querySelector` calls back to the screen thread, so libraries that assume DOM access work unmodified in workers. D3 and `canvas-confetti` both run entirely in the worker at smooth 60fps — no `(in :screen ...)` required. `renderer` is a named worker handle; `(in renderer ...)` executes any expression in that specific worker. Cross-thread watch notification (via `Atomics.waitAsync`) re-renders automatically when any worker mutates the atom.

### **The Mental Shift**
Move your headspace out of the "main" thread and into the `:core` worker - that becomes your new "main" thread. A DOM proxy lets all workers talk to the DOM, so the browser's UI thread becomes the "screen" thread and you never have to touch it again. Just add the `cljs_thread.main(...)` call to your HTML and your project's `main` launches natively in a worker instead of on screen. It feels like the main thread, but with Clojure/JVM-style parallelism.

## Quickstart

Add to `deps.edn`:

```clojure
net.clojars.john/cljs-thread {:mvn/version "0.1.0-alpha.5"}
```

Minimal `shadow-cljs.edn`:

```clojure
{:builds
 {:app
  {:target     :browser
   :output-dir "resources/public/js"
   :modules    {:cljs-thread {:entries    [cljs-thread.core my-app.core]
                              :web-worker true}
                :screen      {:entries    [cljs-thread.dom.app]
                              :depends-on #{:cljs-thread}}}}}}
```

Two modules: `:cljs-thread` runs in workers and `:screen` handles DOM rendering. See the **[Getting Started](doc/01-getting-started.md)** guide for more options.

## API at a Glance

| Primitive | What it does | Example |
|-----------|-------------|---------|
[ `atom` | Create a shared worker | `(t/atom ::app-state {:counter 0})` |
| `spawn` | Create a worker, run code in it | `@(spawn (+ 1 2 3))` |
| `in` | Execute in a specific worker | `(def w (spawn)) @(in w (+ 10 20))` |
| `future` | Dispatch to thread pool (no startup cost) | `@(future (expensive-work))` |
| `pmap` | Parallel map across collections | `(pmap inc (range 1000))` |
| `pcalls` | Run functions in parallel | `(pcalls fn-a fn-b fn-c)` |
| `pvalues` | Evaluate expressions in parallel | `(pvalues (expr-a) (expr-b))` |
| `=>>` | Parallel transducer pipeline | `(=>> data (map f) (filter g) (apply +))` |

Binding conveyance is automatic - local bindings and namespace vars are transmitted across worker boundaries transparently:

```clojure
(let [x 3
      a (t/atom {:a 1})
      c (spawn)]
  @(in c (+ (:a @a) @(future (+ 2 x)))))
;=> 6
```

See the full **[API Guide](doc/02-api-guide.md)** for comprehensive examples.

## Documentation

### Basic — Get Up and Running

| Guide | Description |
|-------|-------------|
| **[Getting Started](doc/01-getting-started.md)** | Installation, `init!`, first example |
| **[API Guide](doc/02-api-guide.md)** | `spawn`, `in`, `future`, `pmap`, `pcalls`, `pvalues`, `=>>` |
| [Binding Conveyance](doc/03-binding-conveyance.md) | Implicit/explicit conveyance, what doesn't convey |
| [Yield & Async](doc/04-yield-and-async.md) | `yield`, screen-thread promises, async patterns |
| **[Build Configuration](doc/05-build-configuration.md)** | Shadow-cljs, Figwheel, Node.js build patterns |
| **[Deployment](doc/06-deployment.md)** | COOP/COEP headers, server configs, troubleshooting |
| [Platform Support](doc/12-platform-support.md) | Browser matrix, Node.js, SAB vs SW fallback |

### Intermediate — Features and Data Structures

| Guide | Description |
|-------|-------------|
| [DOM Proxy](doc/14-dom-proxy.md) | Transparent DOM access from workers — events, rAF, observers, batching |
| [Eve Data Structures](doc/08-eve-data-structures.md) | SharedArrayBuffer atoms, hash maps, hash sets, typed arrays, `deftype` |
| [eve/obj — Typed Shared Objects](doc/15-eve-obj.md) | Schema-based AoS and SoA objects with full Atomics API |
| [Specialized EVE Collections](doc/18-eve-collections.md) | Integer maps, red-black trees, vectors, lists |
| [Worker Environment](doc/21-worker-environment.md) | Thread identity, environment predicates, worker topology |
| [Advanced Threading](doc/22-advanced-threading.md) | `yield`, go-blocks, `:promise?`, daemon workers |
| [Async Utilities](doc/16-async-utilities.md) | `on-when`, `on-watch`, `sleep` — bootstrapping helpers |
| [Persistence](doc/20-persistence.md) | `db-set!` / `db-get` — IndexedDB from any worker |
| [Persistent Atoms](doc/24-persistent-atoms.md) | Cross-process mmap-backed atoms — JVM + Node.js |
| [Configuration Reference](doc/17-configuration-reference.md) | All `init!` options, spawn/in/future options, compiler flags |
| [Serialization](doc/19-serialization.md) | Wire protocol — what transfers, what doesn't, debugging tips |

### Advanced — Architecture and Internals

| Guide | Description |
|-------|-------------|
| [Architecture](doc/07-architecture.md) | Fat kernel, sync layer, worker mesh, catch-and-load |
| [Stepping Debugger](doc/09-stepping-debugger.md) | `dbg`, `break`, `in?` |
| [Testing](doc/10-testing.md) | Test runner, tier system, reporters, X-RAY diagnostics |
| [Internals Deep Dive](doc/23-internals.md) | WASM memory, slab allocator, CPS transform, Service Worker protocol |
| [Agent & Contributor Guide](doc/11-agent-guide.md) | Architecture invariants, gotchas, onboarding |
| [History & Design Notes](doc/13-history.md) | `tau.alpha` lineage, fat kernel evolution |

## Platform Support

| Platform | Sync Mechanism | Notes |
|----------|---------------|-------|
| Chrome/Edge | SharedArrayBuffer + Atomics | Full support with COOP/COEP headers |
| Firefox | SharedArrayBuffer + Atomics | Full support with COOP/COEP headers |
| Safari 15.2+ | SharedArrayBuffer + Atomics | Not yet tested; requires `require-corp` COEP (not `credentialless`) |
| Node.js | SharedArrayBuffer + Atomics | Full support, no headers needed |

## License

Copyright 2022-2026 John Newman. Distributed under the MIT License.
