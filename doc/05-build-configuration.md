# Build Configuration

`cljs-thread` works with shadow-cljs out of the box and should work with any ClojureScript build tool that produces standard output. This guide covers the recommended build patterns.

## shadow-cljs

### Pattern 1: Single Module (simplest)

All code in one file. Good for small projects and getting started:

```clojure
;; shadow-cljs.edn
{:builds
 {:app
  {:target     :browser
   :output-dir "resources/public/js"
   :modules    {:app {:init-fn my-app.screen/init!}}}}}
```

`init!` auto-detects that the single module IS the runtime and uses it as the kernel.

### Pattern 2: Code-Split (recommended for apps)

Separates screen (main thread) code from worker code:

```clojure
;; shadow-cljs.edn
{:builds
 {:app
  {:target     :browser
   :output-dir "resources/public/js"
   :modules
   {:shared {:entries []}
    :screen {:init-fn    my-app.screen/init!
             :depends-on #{:shared}}
    :core   {:init-fn    my-app.core/init!
             :depends-on #{:shared}
             :web-worker true}}}}}
```

- `:shared` holds common dependencies
- `:screen` runs on the main thread (DOM, rendering)
- `:core` runs in a web worker (`:web-worker true`)

This pattern lets you separate concerns — render logic stays on the screen thread, heavy computation moves to workers.

### Pattern 3: Dedicated Kernel Module (recommended for larger apps)

Bundles the `cljs-thread` runtime into a standalone module. This is the most explicit and recommended pattern for production:

```clojure
;; shadow-cljs.edn
{:builds
 {:app
  {:target     :browser
   :output-dir "resources/public/js"
   :modules
   {:cljs-thread {:entries [cljs-thread.core]}
    :shared      {:entries []
                  :depends-on #{:cljs-thread}}
    :screen      {:init-fn    my-app.screen/init!
                  :depends-on #{:shared}}
    :core        {:init-fn    my-app.core/init!
                  :depends-on #{:shared :cljs-thread}
                  :web-worker true}}}}}
```

The library auto-detects the `:cljs-thread` module by name from `manifest.edn`. Benefits:

- The kernel is a stable, cacheable artifact
- Workers boot from the kernel source alone
- Clear dependency graph

### Module Detection Priority

When `init!` auto-detects the kernel, it checks in order:

1. **`:cljs-thread`** — dedicated kernel module (by name)
2. **`:core` + deps** — worker-safe module with full dependency chain
3. **Single module** — the only module IS the runtime
4. **`:shared`** — fallback for multi-module builds

### Dev Server with COOP/COEP Headers

For `SharedArrayBuffer` support during development, configure your dev server with cross-origin isolation headers. shadow-cljs's built-in server doesn't set these by default.

For example, in `shadow-cljs.edn`:

```clojure
;; shadow-cljs.edn
{:dev-http
 {8280 {:root "resources/public"
        :push-state/headers
        {"content-type"                  "text/html; charset=utf-8"
         "Cross-Origin-Opener-Policy"    "same-origin"
         "Cross-Origin-Embedder-Policy"  "require-corp"}}}}
```

> Note: Chromium-based browsers also accept `credentialless` as a less restrictive COEP value, but **Safari does not support `credentialless`**. Use `require-corp` for cross-browser compatibility. See [Deployment](06-deployment.md) for details.

### Compiler Options

For browser targets, ensure ES2020+ output for `SharedArrayBuffer` and `Atomics` support:

```clojure
{:builds
 {:app
  {:target     :browser
   :compiler-options {:output-feature-set :es2020}
   ;; ...
   }}}
```

### `:advanced` Compilation

`:advanced` mode works with `cljs-thread`. The fat kernel handles the key complexity:

- Shadow-cljs modules in `:advanced` mode start with `importScripts("dep.js")` calls
- Blob URL workers have `origin: null`, so `importScripts` with relative paths fails
- The fat kernel installs an origin shim that resolves relative URLs inside `importScripts()` calls to absolute URLs, so dependency loading works correctly from blob workers

No special configuration is needed — it just works.

## Node.js

### Node Script Target

```clojure
;; shadow-cljs.edn
{:builds
 {:app
  {:target    :node-script
   :output-to "target/app.js"
   :main      my-app.core/main}}}
```

```clojure
(ns my-app.core
  (:require [cljs-thread.core :as thread :refer [spawn in future pmap]]))

(defn main []
  (thread/init!)
  (println @(future (+ 1 2 3)))  ;=> 6
  )
```

Node.js uses `worker_threads` with eval workers. `SharedArrayBuffer` is available by default — no headers needed.

### Running

```bash
npx shadow-cljs compile app
node target/app.js
```

## Figwheel

Figwheel support is in progress. The key requirements for any build tool are:

1. Produce a single JS file or a set of modules with a manifest
2. Support `:web-worker true` for worker entry points (or use single-module builds)
3. Write a `manifest.edn` to the output directory (or provide explicit `:core-connect-string`)

If you get `cljs-thread` working with Figwheel, please submit a PR with your configuration.

## cljs.main (Vanilla ClojureScript)

Support for the default `cljs.main` build tools is forthcoming. The same requirements as Figwheel apply. PRs welcome.

## Service Worker Build (Optional)

If you need the Service Worker fallback (for environments without COOP/COEP headers), add a separate build:

```clojure
;; shadow-cljs.edn
{:builds
 {:sw {:target     :browser
       :output-dir "resources/public/js"
       :modules    {:sw {:entries [cljs-thread.sw]
                         :web-worker true}}}
  ;; ... your app build ...
  }}
```

Then pass `:sw-connect-string` to `init!`:

```clojure
(thread/init!
 {:sw-connect-string "/js/sw.js"
  :core-connect-string "/js/core.js"})
```

See [Deployment](06-deployment.md) for when and why you'd need this.

## Example Project

The `ex/raytracer` sub-project in the repo has a complete working example of a multi-worker build using cljs-thread.
