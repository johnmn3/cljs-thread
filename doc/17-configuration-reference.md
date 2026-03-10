# Configuration Reference

This guide covers every configuration option accepted by `init!`, worker spawn options, and compiler flags.

## `init!` Options

`init!` accepts up to two arguments: an optional main function and an optional config map.

```clojure
(t/init!)                           ;; auto-detect everything
(t/init! my-app.core/main)          ;; DOM proxy app with main function
(t/init! {:future-count 4})         ;; explicit configuration
(t/init! my-app.core/main {:future-count 4})  ;; both
```

When a main function is provided, it runs in the `:core` worker after all pools are ready. This is the recommended entry point for DOM proxy applications — your `main` launches in a worker with full DOM access via the proxy layer.

### Worker Pool Sizes

| Key | Default | Description |
|-----|---------|-------------|
| `:future-count` | `(+ 1 js/navigator.hardwareConcurrency)` | Workers in the `future` thread pool |
| `:injest-count` | `(+ 1 js/navigator.hardwareConcurrency)` | Workers for `=>>` / `pmap` pipelines |

```clojure
(t/init! {:future-count 4
          :injest-count 4})
```

### Worker Entry Point URLs

These control which compiled JS file each worker type loads. The fat kernel strategy caches the runtime, so workers boot from a single cached source — these URLs only matter for the initial load.

| Key | Default | Description |
|-----|---------|-------------|
| `:sw-connect-string` | `"/sw.js"` | Service Worker script path |
| `:core-connect-string` | `"/core.js"` | Core worker module |
| `:root-connect-string` | same as `:core-connect-string` | Root coordinator module |
| `:future-connect-string` | `"/future.js"` | Future pool workers |
| `:injest-connect-string` | `"/injest.js"` | Injest workers |
| `:repl-connect-string` | `"/repl.js"` | REPL worker |

```clojure
(t/init! {:core-connect-string "/js/cljs-thread.js"
          :future-connect-string "/js/cljs-thread.js"
          :injest-connect-string "/js/cljs-thread.js"})
```

### Sync Mechanism

| Key | Default | Description |
|-----|---------|-------------|
| `:force-sw-sync` | `false` | Force Service Worker sync instead of SAB |

By default, `cljs-thread` uses `SharedArrayBuffer` + `Atomics.wait`/`Atomics.notify` for blocking. This requires COOP/COEP headers (see [Deployment](06-deployment.md)). Set `:force-sw-sync true` to fall back to Service Worker XHR-based blocking:

```clojure
(t/init! {:force-sw-sync true})
```

### Module Loading

| Key | Default | Description |
|-----|---------|-------------|
| `:loadable-modules` | `[]` | URLs to eagerly load on all workers |

```clojure
(t/init! {:loadable-modules ["/js/screen.js" "/js/vendor.js"]})
```

Workers normally load modules on-demand via catch-and-load (a `ReferenceError` triggers `importScripts`). `:loadable-modules` eagerly loads these at worker boot time instead.

## `spawn` Options

Options are passed as the first argument to `spawn`:

```clojure
(spawn {:id :my-worker}
  (println "I'm a persistent worker"))
```

| Key | Default | Description |
|-----|---------|-------------|
| `:id` | auto-generated | Worker ID (keyword or string) |
| `:no-globals?` | `false` | Skip global state setup |
| `:yield?` | auto-detected | Enabled automatically when `yield` appears in body |
| `:go?` | auto-detected | Enabled automatically when `@`/`deref` appears in body. Pass `{:go? false}` to force hard-blocking. |

All spawned workers are daemon by default. Named workers persist and join the worker mesh.

## `in` Options

Options are passed as a map after the worker ID and optional locals:

```clojure
@(in :my-worker
   (yield "partial result")
   "final result")
```

| Key | Default | Description |
|-----|---------|-------------|
| `:yield?` | auto-detected | Enabled automatically when `yield` appears in body |
| `:go?` | auto-detected | Enabled automatically when `@`/`deref` appears in body. Pass `{:go? false}` to force hard-blocking. |
| `:promise?` | `false` | Force Promise-based result delivery (instead of SAB blocking) |
| `:atom?` | `true` | Store result in local state atom |

### Go-Block (CPS Transform)

When the body contains `@`/`deref`, the CPS transform kicks in automatically. Every `@expr` becomes a parking point — instead of blocking the worker thread, it yields to the event loop and resumes when the result arrives. Only the outermost `@` hard-blocks:

```clojure
;; Automatic go — inner @ parks, outer @ hard-blocks for final result
@(in :worker
   (let [a @(future (compute-a))
         b @(future (compute-b))]
     (+ a b)))

;; Force hard-blocking — each @ blocks the worker thread
@(in :worker {:go? false}
   (let [a @(future (compute-a))
         b @(future (compute-b))]
     (+ a b)))
```

The CPS transform crosses `fn` boundaries for whitelisted HOFs (`map`, `filter`, `reduce`, `keep`, `some`, `run!`, etc.) via parking-aware variants (CSP defunctionalization). For other `fn` forms, `@` falls back to blocking deref.

### `:promise?` Mode

Forces the result to be delivered as a Promise regardless of the calling context. Useful for `Promise.all` patterns:

```clojure
(-> (js/Promise.all
      #js [(in :w1 {:promise? true} (compute-a))
           (in :w2 {:promise? true} (compute-b))])
    (.then (fn [results] (apply + (js->clj results)))))
```

## `future` Options

`future` accepts the same local-capture and options as `in`:

```clojure
(let [x 10]
  @(future
     (yield (* x 2))
     (* x 3)))
```

A `future` body always runs in a try/finally that returns the worker to the pool, even on exceptions.

## Compiler Flags

Set via `:closure-defines` in your `shadow-cljs.edn` or build config:

```clojure
{:builds
 {:app
  {:compiler-options
   {:closure-defines
    {cljs-thread.debug/DEBUG true
     cljs-thread.eve.deftype-proto.xray/DIAGNOSTICS true}}}}}
```

| Flag | Default | Description |
|------|---------|-------------|
| `cljs-thread.debug/DEBUG` | `false` | Enable `debug/log` output. When `false`, all `debug/log` calls are dead-code-eliminated in `:advanced` builds. |
| `cljs-thread.eve.deftype-proto.xray/DIAGNOSTICS` | `false` | Enable X-RAY slab allocator validation. Adds runtime invariant checks after every allocation. See [Testing](10-testing.md). |

### Debug Logging

```clojure
(require '[cljs-thread.debug :as debug])

(debug/log "connection established" {:peer :worker-1})
;; Only prints when DEBUG=true, DCE'd otherwise

(debug/log-error "operation failed" error {:context "fetch"})
;; Logs error with context (always enabled)

(debug/log-exception "unhandled" exception)
;; Logs exception with stack trace (always enabled)
```
