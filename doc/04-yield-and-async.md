# Yield & Async Patterns

`cljs-thread` provides blocking semantics on workers while keeping the screen thread non-blocking. Understanding the async boundary is key to writing correct code.

## The Screen Thread Rule

On the **main/screen thread**, all deref operations (`@`) return **promises**, not values. The screen thread must never block — it's responsible for rendering.

```clojure
;; In a worker (blocks, returns value):
@(future (+ 1 2 3))
;=> 6

;; On the screen thread (returns promise):
(-> @(future (+ 1 2 3))
    (.then #(println :result %)))
;:result 6
```

This applies to `spawn`, `in`, `future`, `pmap`, and `=>>`.

## `yield` — Synchronize Async Results

JavaScript APIs are heavily callback/promise-based. `yield` bridges the gap, converting async operations into synchronous returns from the caller's perspective.

### Basic yield

```clojure
(let [x 6]
  @(spawn (yield (+ x 2)) (println :ephemeral)))
;:ephemeral
;=> 8
```

`yield` returns `8` to the caller immediately. The spawn body continues executing `(println ...)` before the ephemeral worker terminates.

### Async fetch made synchronous

```clojure
(->> @(in s1 (-> (js/fetch "http://api.example.com/data")
                 (.then #(.json %))
                 (.then #(yield (js->clj % :keywordize-keys true)))))
     :result
     (println "Result:"))
;Result: {...}
```

The `yield` inside the promise chain pauses the caller's blocking deref until the async value resolves. From the caller's perspective, the whole thing looks synchronous.

### Delayed yield

```clojure
@(spawn (js/setTimeout
         #(yield (println :finally!) (+ 1 2 3))
         5000))
;:finally!
;=> 6
```

The ephemeral worker stays alive for 5 seconds until the timeout fires `yield`. This is useful for async tasks in ephemeral workers.

## Patterns

### Fan-out with promises

Use `js/Promise.all` to wait for multiple concurrent operations:

```clojure
(-> @(js/Promise.all
      #js [(spawn {:promise? true} (expensive-computation-a))
           (spawn {:promise? true} (expensive-computation-b))])
    (.then #(println :results (js->clj %))))
```

### Worker-side blocking composition

Within a worker, you can compose blocking calls naturally:

```clojure
;; In a worker — this blocks and returns values directly
(let [a @(future (compute-a))
      b @(future (compute-b))
      c @(in s1 (combine a b))]
  (println :result c))
```

### Screen-side async composition

On the screen thread, chain with `.then`:

```clojure
;; On the screen thread — returns promises
(-> @(future (compute-a))
    (.then (fn [a]
      (-> @(future (compute-b))
          (.then (fn [b]
            (println :results a b)))))))
```

Or use `=>>` for data pipelines, which returns a single promise on the screen thread:

```clojure
(-> (=>> large-dataset
         (map transform)
         (filter valid?)
         (into []))
    (.then #(render-results %)))
```

### Error propagation

Errors thrown in workers propagate back to the caller. In workers, they re-throw. On the screen thread, they reject the promise:

```clojure
;; In a worker:
(try
  @(in s1 (throw (ex-info "boom" {})))
  (catch :default e
    (println :caught e)))

;; On the screen thread:
(-> @(future (throw (ex-info "boom" {})))
    (.catch #(println :caught %)))
```

## When to Block vs. Not

| Context | `@` behavior | Pattern |
|---------|-------------|---------|
| Worker thread | Blocks, returns value | Use `@` freely |
| Screen thread | Returns promise | Use `.then` chains |
| Hot loops in workers | Blocks (but slow for tight loops) | Batch work, use `=>>` |
| I/O in workers | Use `yield` to bridge | Wrap async in `yield` |

Blocking semantics are great for control flow but add ~1-5ms overhead per blocking call. Don't use them in tight inner loops — batch work into larger chunks with `pmap` or `=>>` instead.
