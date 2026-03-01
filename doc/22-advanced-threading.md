# Advanced Threading Options

This guide covers the advanced options available on `spawn`, `in`, and `future`: yield mode for streaming results, go-blocks for parking deref, promise mode for non-blocking composition, and daemon workers.

## Yield Mode

`yield` lets a worker send a result back to the caller **before** the body finishes executing. The caller unblocks immediately, while the worker continues.

### Basic Yield

```clojure
(let [x 6]
  @(spawn (yield (+ x 2)) (println :continuing)))
;:continuing
;=> 8
```

The caller receives `8` immediately. The spawn body keeps running and prints `:continuing` before the ephemeral worker terminates.

### Yield in `in`

```clojure
@(in :my-worker
   (yield "first result")
   ;; worker continues executing
   (do-background-work!))
```

The `in` macro auto-detects `yield` in the body — no options needed.

### Async Fetch Made Synchronous

```clojure
@(in :worker
   (-> (js/fetch "/api/data")
       (.then #(.json %))
       (.then #(yield (js->clj % :keywordize-keys true)))))
```

From the caller's perspective, the entire async chain looks synchronous — `@` blocks until `yield` fires. See [Yield & Async](04-yield-and-async.md) for more patterns.

## Go-Blocks (Parking Deref)

When the body of `in`, `spawn`, or `future` contains `@`/`deref`, the CPS (Continuation-Passing Style) transform kicks in **automatically**. Each `@` becomes a non-blocking **parking** point — instead of blocking with `Atomics.wait`, it yields to the event loop and resumes via Promise when the result arrives.

Only the outermost `@` performs a hard block (returning the final value to the caller). Internal `@` forms park.

To force hard-blocking semantics on inner derefs (no CPS transform), pass `{:go? false}`:

```clojure
;; Automatic go — each inner @ parks, outer @ hard-blocks for the final result
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

### Transform Scope

The CPS transform applies to:
- `@` / `deref` expressions → `park-deref` continuation points
- `do`, `let`, `if`, `when`, `when-let`, `if-let`, `cond`, `and`, `or`
- `try`/`catch`/`finally`

The transform **stops** at `fn` / `letfn` / `reify` / `deftype` boundaries for raw `fn` forms, but **crosses fn boundaries** for whitelisted higher-order functions via CSP defunctionalization. The whitelisted HOFs (`map`, `mapv`, `filter`, `filterv`, `reduce`, `keep`, `some`, `run!`, `remove`, `into`) are replaced with parking-aware variants that know how to handle Promise-returning function bodies.

### Parking-Aware HOFs

Inside go-blocks, standard HOFs are replaced with parking variants:

```clojure
(in :worker {:go? true}
  ;; park-map: each @(future ...) parks instead of blocking
  (map (fn [x] @(future (inc x))) [1 2 3]))
;=> (2 3 4) — via Promise chain
```

Available: `park-map`, `park-filter`, `park-remove`, `park-keep`, `park-some`, `park-run!`, `park-reduce`.

## Promise Mode

`:promise?` forces the return to be a Promise regardless of calling context:

```clojure
;; Fan-out with Promise.all
(-> (js/Promise.all
      #js [(spawn {:promise? true} (compute-a))
           (spawn {:promise? true} (compute-b))])
    (.then (fn [results]
             (println :results (js->clj results)))))
```

This is useful when you need to compose multiple concurrent operations with standard JavaScript Promise APIs.

Without `:promise?`, the behavior depends on context:
- **In a worker**: `@` blocks and returns the value directly
- **On the screen thread**: `@` always returns a Promise (screen never blocks)

## Daemon Workers

All spawned workers are daemon by default — they persist after their body completes. Named workers stay alive so you can `in` to them later:

```clojure
(spawn {:id :logger}
  (println "Logger started"))

;; The :logger worker stays alive — you can `in` to it later
@(in :logger (println "Logging something"))
```

Ephemeral workers (no `:id`, no body continuation) are cleaned up after their body returns.

## `:no-globals?`

Skip global state setup on a worker:

```clojure
(spawn {:id :minimal :no-globals? true}
  ;; Worker boots without the standard peer mesh setup
  ;; Useful for lightweight, isolated workers
  (compute-something))
```
