# Getting Started

`cljs-thread` brings familiar threading primitives to ClojureScript — `spawn`, `in`, `future`, `pmap`, `pcalls`, `pvalues`, and `=>>` — in both the browser (Web Workers) and Node.js (`worker_threads`).

## Installation

Add to your `deps.edn`:

```clojure
net.clojars.john/cljs-thread {:mvn/version "0.1.0-alpha.5"}
```

Or to `project.clj`:

```clojure
[net.clojars.john/cljs-thread "0.1.0-alpha.5"]
```

## Minimal Example

Write your app code in a namespace that requires `cljs-thread.core`. Your `main` function runs on the `:core` worker — DOM operations are automatically proxied to the screen thread.

```clojure
(ns my-app.core
  (:require-macros [cljs-thread.core :refer [future spawn]])
  (:require [cljs-thread.core :as t]))

(defonce state (t/atom ::state {:counter 0}))

(defn ^:export main []
  (println "Counter:" (:counter @state))
  (spawn ::worker
    (println "Future result:" @(future (+ 1 2 3)))))
```

In your HTML, load the cljs-thread module and screen module, then call `cljs_thread.main` with your main function:

```html
<script>if(typeof importScripts==="undefined")importScripts=function(){}</script>
<script src="cljs-thread.js"></script>
<script src="screen.js"></script>
<script>cljs_thread.main(my_app.core.main)</script>
```

That's it. `cljs_thread.main` handles all setup — it detects your build output from `manifest.edn`, installs the fat kernel strategy, configures worker boot, and initializes the EVE allocator. No manual `init!` call, no worker paths, no Service Worker registration.

To pass configuration, provide a JS object as the second argument:

```html
<!-- Pass config options via the script tag -->
<script>cljs_thread.main(my_app.core.main, {"injest-count": 8})</script>
```

## What `cljs_thread.main` Does

Under the hood, `cljs_thread.main(fn)` (which maps to `cljs-thread.core/init!`):

1. Detects your worker script from `manifest.edn` (shadow-cljs writes this to your `:output-dir`)
2. Installs the **fat kernel strategy** — workers boot with the full `cljs-thread` runtime available
3. Auto-detects loadable modules for on-demand code loading
4. Propagates EVE `SharedArrayBuffer` configuration to all spawned workers
5. Spawns the worker mesh (root, core, future pool, injest pool)
6. When `:core` is ready, dispatches your `main` function to it

### Configuration Options

Pass these as keys in the JS config object (second arg to `cljs_thread.main`):

| Key | Description |
|-----|-------------|
| `core-connect-string` | Path to worker script (auto-detected from `manifest.edn`) |
| `sw-connect-string` | Path to Service Worker script (enables SW sync mode) |
| `repl-connect-string` | Path to REPL worker script |
| `future-count` | Number of future pool workers |
| `injest-count` | Number of injest (parallel transducer) workers |

## Build Setup

cljs-thread uses a two-module browser build: a `:cljs-thread` worker module (your code + the runtime) and a `:screen` module (the DOM proxy):

```clojure
;; shadow-cljs.edn
{:deps true
 :builds
 {:app
  {:target     :browser
   :output-dir "resources/public/js"
   :asset-path "."
   :modules    {:cljs-thread {:entries    [cljs-thread.core my-app.core]
                               :web-worker true}
                :screen      {:entries    [cljs-thread.dom.app]
                               :depends-on #{:cljs-thread}}}
   :compiler-options {:output-feature-set :es2020}
   :js-options {:resolve {"worker_threads" {:target :browser :global "null"}
                          "wabt"           {:target :browser :global "null"}}}}}}
```

The `:cljs-thread` module bundles your application code alongside the cljs-thread runtime. The `:web-worker true` flag tells shadow-cljs to emit it as a worker-compatible script. The `:screen` module loads `cljs-thread.dom.app` which manages the DOM proxy on the main thread.

For production builds, add a `:shared` module to split common code:

```clojure
;; Release build: three modules
:modules {:shared      {:entries [cljs-thread.dom.registry]}
          :cljs-thread {:entries    [cljs-thread.core my-app.core]
                        :depends-on #{:shared}
                        :web-worker true}
          :screen      {:entries    [cljs-thread.dom.app]
                        :depends-on #{:cljs-thread}}}
```

Then in your HTML, load all scripts in order:

```html
<script>if(typeof importScripts==="undefined")importScripts=function(){}</script>
<script src="shared.js"></script>
<script src="cljs-thread.js"></script>
<script src="screen.js"></script>
<script>cljs_thread.main(my_app.core.main)</script>
```

For more patterns, see the [Build Configuration](05-build-configuration.md) guide.

## Node.js

`cljs-thread` works on Node.js using `worker_threads`. Use a **unified build** — a single `:node-script` target where the same JS file serves as both main thread and worker entry:

```clojure
;; shadow-cljs.edn — unified build (one file, main + workers)
{:builds
 {:app
  {:target    :node-script
   :output-to "target/app.js"
   :main      my-app.core/main}}}
```

```clojure
(ns my-app.core
  (:require-macros [cljs-thread.core :refer [spawn in future on-when]])
  (:require
   [cljs-thread.core :as thread]
   [cljs-thread.state :as s]
   [cljs-thread.env :as e]))

(defn main []
  (when (e/in-screen?)
    (println "=== My App ===")

    ;; Wait for workers to be ready, then run
    (on-when (contains? @s/peers :core) {:max-time 10000}
      (println @(future (+ 1 2 3))))))
```

That's it — no manual `init!` call needed. `cljs-thread.core` auto-initializes via `setTimeout(0)` after your `main` returns: it detects `__filename` as the worker source, installs the fat kernel, and spawns the worker mesh. The `(when (e/in-screen?) ...)` guard ensures your app logic only runs on the main thread (workers load the same file but skip to worker mode).

To customize pool sizes, call `init!` explicitly in your `main` — it pre-empts the deferred auto-init:

```clojure
(defn main []
  (when (e/in-screen?)
    ;; Override defaults before workers spawn
    (thread/init! {:future-count 8})
    (on-when (contains? @s/peers :core) {:max-time 10000}
      (println "ready!"))))
```

## Shared-Memory Atoms

`cljs-thread.core/atom` creates a shared atom backed by `SharedArrayBuffer` — visible from all workers with zero-copy semantics. Always give atoms a name — anonymous atoms are not garbage collected if discarded.

```clojure
(ns my-app.core
  (:require [cljs-thread.core :as t]))

;; Create a named shared atom — visible from all workers
(defonce state (t/atom ::state {:counter 0}))
```

The allocator initializes automatically when `cljs-thread.core` is loaded. The global `AtomDomain` is created on the screen thread and its `SharedArrayBuffer` references are propagated to workers via the fat kernel's init data.

See [Eve Data Structures](08-eve-data-structures.md) for the full API.

## Next Steps

- [API Guide](02-api-guide.md) — `spawn`, `in`, `future`, `pmap`, `=>>` with examples
- [Build Configuration](05-build-configuration.md) — shadow-cljs patterns, Figwheel, Node.js
- [Deployment](06-deployment.md) — COOP/COEP headers, server configs
- [Architecture](07-architecture.md) — fat kernel, sync layer, worker mesh
