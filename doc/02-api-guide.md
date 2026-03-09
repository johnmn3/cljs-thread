# API Guide

This guide covers every major `cljs-thread` API. All examples are verified by automated tests (see `test/cljs_thread/runner/walkthrough_test_browser.cljs`).

The examples below assume you're in a worker context with blocking semantics. On the **main/screen thread**, every deref (`@`) returns a **promise** — chain with `.then` instead.

## Setup

```clojure
(ns my-app.screen
  (:require [cljs-thread.core :as thread
             :refer [spawn in future pmap pcalls pvalues =>>]]))

(thread/init!)
```

---

## `spawn` — Create Workers

### Ephemeral spawn with a return value

```clojure
@(spawn (+ 1 2 3))
;=> 6
```

Creates a temporary worker, evaluates the body, returns the result, then terminates the worker.

### Side-effecting ephemeral spawn

```clojure
(spawn (println :addition (+ 1 2 3)))
;:addition 6
```

Without deref, the spawn fires and forgets.

### Named persistent worker

```clojure
(def s1 (spawn))
(def s2 (spawn {:id :s2} (println :hi :from thread/id)))
;:hi :from :s2
```

Named workers persist and join the mesh. You can `in` to them later.

### Nested spawn

```clojure
@(spawn (+ 1 @(spawn (+ 2 3))))
;=> 6
```

The outer worker spawns an inner worker, blocks for its result via `SharedArrayBuffer`, then adds 1.

### Promise mode

In workers, `spawn` returns a derefable. On the screen thread, it returns a promise:

```clojure
;; Screen thread:
(-> @(spawn (+ 1 2 3))
    (.then #(println :result %)))
;:result 6
```

Force promise mode in a worker with `{:promise? true}`:

```clojure
(-> @(js/Promise.all #js [(spawn {:promise? true} 1) (spawn {:promise? true} 2)])
    (.then #(println :res (js->clj %))))
;:res [1 2]
```

> `spawn` has a startup cost (~200-500ms) from creating a new worker. Use it sparingly — prefer `in` or `future` for most work.

---

## `in` — Execute in a Specific Worker

### Basic dispatch

```clojure
@(in s1 (+ 10 20 12))
;=> 42
```

Sends code to worker `s1` and blocks for the result.

### Chaining across workers

```clojure
(in s1
    (println :now :we're :in :s1)
    (in s2
        (println :now :we're :in :s2 :through :s1)))
;:now :we're :in :s1
;:now :we're :in :s2 :through :s1
```

### Deref chain

```clojure
@(in s1 (+ 1 @(in s2 (+ 2 3))))
;=> 6
```

`s1` dispatches to `s2`, blocks for the result, then computes `(+ 1 5)`.

See [Binding Conveyance](03-binding-conveyance.md) for how local bindings are transmitted across workers.

---

## `future` — Thread Pool Execution

`future` dispatches work to a pre-existing thread pool — no worker startup cost.

### Basic future

```clojure
@(future (+ 100 200))
;=> 300
```

### Nested futures with conveyance

```clojure
(let [x 2]
  @(future (+ 1 @(future (+ x 3)))))
;=> 6
```

### Async fetch in a future

```clojure
(-> @(future (-> (js/fetch "http://api.open-notify.org/iss-now.json")
                 (.then #(.json %))
                 (.then #(yield (js->clj % :keywordize-keys true)))))
    (.then #(println "ISS Position:" (:iss_position %))))
;ISS Position: {:latitude 45.3612, :longitude -110.6497}
```

### Performance characteristics

| Operation | Approximate Time |
|-----------|-----------------|
| `@(in worker expr)` | 1-5 ms |
| `@(future expr)` | 5-15 ms |
| `@(spawn expr)` | 200-500 ms (includes worker creation) |

`in` and `future` reuse existing workers. `spawn` creates a new worker each time — use it for heavy, truly ephemeral work.

---

## `pmap` — Parallel Map

`pmap` maps a function across collections in parallel, using the worker mesh.

```clojure
(def z inc)
(let [i +]
  (->> [1 2 3 4]
       (pmap (fn [x y] (z (i x y))) [9 8 7 6])
       (take 2)))
;=> (11 11)
```

Multi-arity `pmap` with binding conveyance — `z` and `i` are automatically transmitted to workers.

### Timing comparison

```clojure
(defn long-running-job [n]
  (thread/sleep 1000)
  (+ n 10))

;; Sequential: ~4 seconds
(time (doall (map long-running-job (range 4))))
;"Elapsed time: 4012.500000 msecs"
;=> (10 11 12 13)

;; Parallel: ~1 second
(time (doall (pmap long-running-job (range 4))))
;"Elapsed time: 1021.500000 msecs"
;=> (10 11 12 13)
```

---

## `pcalls` — Parallel Function Calls

`pcalls` executes zero-argument functions in parallel and returns a lazy sequence of results.

```clojure
(pcalls #(long-running-job 1) #(long-running-job 2))
;=> (11 12)
```

Both calls run concurrently — total time is ~1 second, not ~2 seconds.

---

## `pvalues` — Parallel Value Evaluation

`pvalues` evaluates expressions in parallel.

```clojure
(pvalues
  (long-running-job 1)
  (long-running-job 2)
  (long-running-job 3)
  (long-running-job 4)
  (long-running-job 5))
;=> (11 12 13 14 15)
```

All 5 jobs run concurrently — total time is ~1 second.

---

## `=>>` — Parallel Transducers

`=>>` is the parallel version of `->>`. It auto-transducifies the thread-last pipeline and fans work across the injest worker pool.

### Basic pipeline

```clojure
(=>> (range 10)
     (map inc)
     (filter odd?)
     (apply +))
;=> 25
```

### With binding conveyance

```clojure
(def y dec)
(let [x inc]
  (=>> (range 10)
       (map (comp x y))
       (apply +)))
;=> 45
```

### Heavy computation benchmark

```clojure
(defn flip [n]
  (apply comp (take n (cycle [inc dec]))))

;; Single-threaded (16-20 seconds in Chrome):
(->> (range)
     (map (flip 100))
     (map (flip 100))
     (map (flip 100))
     (take 1000000)
     (apply +)
     time)

;; Parallel (8-10 seconds in Chrome — 2x faster):
(=>> (range)
     (map (flip 100))
     (map (flip 100))
     (map (flip 100))
     (take 1000000)
     (apply +)
     time)
```

By changing `->>` to `=>>`, you get parallel execution while keeping the main thread free at 60fps. `=>>` is lazy and defaults to a chunk size of 512 elements.

> On the main/screen thread, `=>>` returns a promise.

---

## Data Types

All Clojure data types transit correctly across workers:

```clojure
@(in s1 (str "hello " "world"))     ;=> "hello world"
@(in s1 (mapv inc [1 2 3]))         ;=> [2 3 4]
@(in s1 nil)                        ;=> nil
@(in s1 {:a 1 :b [2 3]})           ;=> {:a 1 :b [2 3]}
```

---

## Screen Thread Promises

On the **main/screen thread**, all blocking operations return **promises** instead of blocking. This keeps the UI responsive:

```clojure
;; In a worker (blocking):
@(spawn (+ 1 2 3))  ;=> 6

;; On the screen thread (promise):
(-> @(spawn (+ 1 2 3))
    (.then #(println :result %)))
;:result 6
```

This applies to `spawn`, `in`, `future`, `pmap`, and `=>>`. Design your screen-thread code with `.then` chains or use `core.async` for sequential-looking async code.
