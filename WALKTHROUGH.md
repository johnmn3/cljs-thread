# cljs-thread API Walkthrough

This walkthrough exercises every major `cljs-thread` API, starting from zero-config setup through advanced parallel transducers. All examples are verified by automated tests (see `test/cljs_thread/walkthrough_test_browser.cljs` and `test/cljs_thread/strategy/node_fat_kernel_test.cljs`).

The examples below assume you're in a REPL connected to a `:core` worker (or any worker context with blocking semantics). On the **main/screen thread**, every deref (`@`) returns a **promise** — chain with `.then` instead.

---

## Setup

```clojure
(ns my-app.screen
  (:require [cljs-thread.core :as thread :refer [spawn in future pmap pcalls pvalues =>>]]))

;; Zero-config: auto-detects worker scripts, installs fat kernel,
;; configures loadable modules — all from manifest.edn.
(thread/init!)
```

That's it. `init!` detects your build output, caches the compiled source, and boots workers from blob URLs (browser) or eval strings (Node.js) with the full runtime inlined.

---

## `spawn` — Create Workers

### Ephemeral spawn with a return value

```clojure
@(spawn (+ 1 2 3))
;=> 6
```

Creates a temporary worker, evaluates `(+ 1 2 3)`, returns the result, then terminates the worker. On the screen thread, `@(spawn ...)` returns a promise.

### Side-effecting ephemeral spawn

```clojure
(spawn (println :addition (+ 1 2 3)))
;:addition 6
```

Without deref, the spawn fires and forgets — useful for logging or background work.

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

The outer worker spawns an inner worker, blocks for its result via `SharedArrayBuffer`, then adds 1. This demonstrates the blocking deref working across worker boundaries.

---

## `in` — Execute in a Specific Worker

### Basic dispatch

```clojure
@(in :core (+ 10 20 12))
;=> 42
```

Sends code to the `:core` worker and blocks for the result.

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

---

## Binding Conveyance

`cljs-thread` automatically conveys local bindings and namespace vars across workers.

### Implicit conveyance via `let`

```clojure
(let [x 3]
  @(in s1 (+ 1 @(in s2 (+ 2 x)))))
;=> 6
```

The value of `x` is captured and transmitted to both `s1` and `s2`.

### Implicit conveyance via `def`

```clojure
(def x 3)
@(in s1 (+ 1 @(in s2 (+ 2 x))))
;=> 6
```

Namespace-level vars are conveyed just like locals.

### Explicit conveyance vector

```clojure
@(in s1 [x s2] (+ 1 @(in s2 (+ 2 x))))
;=> 6
```

The `[x s2]` vector explicitly declares which bindings to transmit. Using an explicit vector disables implicit conveyance — only declared symbols are sent.

### By keyword ID (no conveyance needed)

```clojure
@(in s1 [x] (+ 1 @(in :s2 (+ 2 x))))
;=> 6
```

Reference workers by `:id` keyword to avoid needing to convey the worker reference.

### What doesn't convey

Atoms, channels, and other stateful/identity objects cannot be serialized:

```clojure
(def y (atom 3))
@(in s1 (+ 1 @(in s2 (+ 2 @y))))
;; Won't work — atoms can't be transmitted
```

Use `:no-globals?` or explicit conveyance vectors to control what gets sent.

---

## `yield` — Synchronize Async Results

`yield` converts asynchronous JavaScript operations into blocking synchronous calls.

### Basic yield with spawn

```clojure
(let [x 6]
  @(spawn (yield (+ x 2)) (println :i'm :ephemeral)))
;:i'm :ephemeral
;=> 8
```

`yield` returns 8 to the caller immediately, then the spawn body continues executing `(println ...)` before the ephemeral worker terminates.

### Async fetch made synchronous

```clojure
(->> @(in s1 (-> (js/fetch "http://api.open-notify.org/iss-now.json")
                 (.then #(.json %))
                 (.then #(yield (js->clj % :keywordize-keys true)))))
     :iss_position
     (println "ISS Position:"))
;ISS Position: {:latitude 44.4403, :longitude 177.0011}
```

The `yield` inside the promise chain pauses the caller's blocking deref until the async value resolves. This makes fetch look synchronous from the caller's perspective.

### Delayed yield

```clojure
@(spawn (js/setTimeout
         #(yield (println :finally!) (+ 1 2 3))
         5000))
;:finally!
;=> 6
```

The ephemeral worker stays alive for 5 seconds until the timeout fires `yield`.

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

`=>>` is the parallel version of `->>`. It auto-transducifies the thread-last pipeline and fans the work across the injest worker pool.

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

Both `y` (namespace var) and `x` (local binding) are conveyed to worker threads.

### Heavy computation benchmark

```clojure
(defn flip [n]
  (apply comp (take n (cycle [inc inc dec]))))

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

By changing `->>` to `=>>`, you get parallel execution while keeping the main thread free for rendering. `=>>` defaults to a chunk size of 512 elements.

---

## Stepping Debugger

`cljs-thread`'s blocking semantics enable a runtime stepping debugger.

```clojure
(dbg
 (let [x 1 y 3 z 5]
   (println :starting)
   (dotimes [i z]
     (break (= i y))
     (println :i i))
   (println :done)
   x))
;:starting
;:i 0
;:i 1
;:i 2
;=> :starting-dbg
```

Execution pauses at `(break (= i y))` — when `i` reaches 3. Use `in?` to inspect:

```clojure
(in? z)    ;=> 5
(in? i)    ;=> 3
(in? [i x y z])  ;=> [3 1 3 5]
(in? [x i] (+ x i))  ;=> 4
```

Resume with:

```clojure
(in? :in/exit)
;:i 3
;:i 4
;:done
;=> 1
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

---

## Data Types

All Clojure data types transit correctly across workers:

```clojure
@(in :core (str "hello " "world"))     ;=> "hello world"
@(in :core (mapv inc [1 2 3]))         ;=> [2 3 4]
@(in :core nil)                        ;=> nil
@(in :core {:a 1 :b [2 3]})           ;=> {:a 1 :b [2 3]}
```

---

## Performance Characteristics

Typical round-trip times with SAB sync:

| Operation | Approximate Time |
|-----------|-----------------|
| `@(in :core expr)` | 1-5 ms |
| `@(future expr)` | 5-15 ms |
| `@(spawn expr)` | 200-500 ms (includes worker creation) |

`in` and `future` reuse existing workers and are fast. `spawn` creates a new worker each time — use it for heavy, truly ephemeral work.
