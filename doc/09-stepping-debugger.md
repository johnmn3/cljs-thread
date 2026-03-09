# Stepping Debugger

The blocking semantics that `cljs-thread` provides enable a runtime stepping debugger — something that wasn't previously possible in ClojureScript/JavaScript outside of the browser's built-in DevTools debugger.

## Quick Start

```clojure
(require '[cljs-thread.core :refer [dbg break in?]])

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

Execution pauses when `(break (= i y))` triggers — when `i` reaches `3`.

## `dbg`

`dbg` sends a form to a dedicated debug worker that continuously listens for forms to evaluate. It returns `:starting-dbg` immediately while the form executes asynchronously in the debug worker.

```clojure
(dbg <body>)
```

## `break`

`break` pauses execution at a specific point. It accepts an optional predicate:

```clojure
(break)              ;; always pause
(break (= i 3))     ;; pause when condition is true
```

When a `break` triggers, the debug worker enters a sub-loop, waiting for inspection commands via `in?`.

## `in?` — Inspect Break Context

Use `in?` to send forms to the paused break context:

### Simple inspection

```clojure
(in? z)
;=> 5
(in? i)
;=> 3
(in? [i x y z])
;=> [3 1 3 5]
(in? [z y x])
;=> [5 3 1]
(in? a)
;=> nil  ;; not bound
```

### Expressions with conveyance

For non-simple forms, you must declare an explicit conveyance vector. The `in?` macro cannot know ahead of time whether symbols in your expression are locally bound in the remote `dbg` context or refer to your own namespace:

```clojure
(in? [x i] (+ x i))
;=> 4
```

The conveyance vector `[x i]` tells `in?` to resolve `x` and `i` from the remote break context.

### Resume execution

Send `:in/exit` to continue:

```clojure
(in? :in/exit)
;:i 3
;:i 4
;:done
;=> 1
```

Execution proceeds to the next `break` or until the `dbg` form completes.

## Calva Integration

Keybindings for `dbg`, `break`, and `in?` are provided for Calva. Use `shift-cmd-p` to access them.

## Limitations

- The debugger requires a worker context with blocking semantics (it runs in a debug worker, not on the screen thread)
- It's a runtime debugger, not a source-level debugger — you inspect values by evaluating forms, not by clicking in an editor gutter
- Each `in?` call is a round-trip to the debug worker, so inspection adds latency

## Future Directions

A sub-REPL that wraps REPL evaluations in `in?` until exit would make this more ergonomic. An nREPL middleware could transparently bridge to CIDER's debugging workflows, enabling editor-integrated debugging in a ClojureScript context. See [cider#1416](https://github.com/clojure-emacs/cider/issues/1416). PRs welcome.
