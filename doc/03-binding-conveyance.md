# Binding Conveyance

`cljs-thread` automatically transmits local bindings and namespace vars across worker boundaries. This is one of the most distinctive features of the library — and the one most likely to surprise you.

## How It Works

When you write:

```clojure
(let [x 3]
  @(in s1 (+ 1 x)))
;=> 4
```

The `in` macro captures the value of `x` at compile time, serializes it via `pr-str`/`cljs.reader`, and transmits it to `s1` where the body executes with `x` bound to `3`. This happens transparently — you write code as if it were local.

## Implicit Conveyance

### Local bindings (`let`)

```clojure
(let [x 3]
  @(in s1 (+ 1 @(in s2 (+ 2 x)))))
;=> 6
```

The value of `x` is captured and transmitted to both `s1` and `s2`.

### Namespace vars (`def`)

```clojure
(def x 3)
@(in s1 (+ 1 @(in s2 (+ 2 x))))
;=> 6
```

Top-level `def`s from the invoking namespace are conveyed the same way as locals.

### Both together

If a symbol exists as both a local binding and a namespace var, the local binding wins (standard Clojure shadowing).

## Explicit Conveyance Vectors

You can explicitly declare which bindings to transmit:

```clojure
@(in s1 [x s2] (+ 1 @(in s2 (+ 2 x))))
;=> 6
```

The `[x s2]` vector declares what to send. **Using an explicit vector disables implicit conveyance entirely** — only declared symbols are sent.

### Referencing workers by `:id`

You can avoid conveying worker references by using keyword IDs:

```clojure
@(in s1 [x] (+ 1 @(in :s2 (+ 2 x))))
;=> 6
```

### No mixing

You cannot mix implicit and explicit conveyance:

```clojure
;; This does NOT work:
(let [z 3]
  @(in s1 [x] (+ 1 @(in :s2 (+ x z)))))
;=> nil  ;; z was not conveyed

;; This works:
(let [z 3]
  @(in s1 [x z] (+ 1 @(in :s2 (+ x z)))))
;=> 7
```

Once you provide an explicit conveyance vector, you must declare everything.

## What Doesn't Convey

Stateful/identity objects cannot be serialized:

```clojure
(def y (atom 3))
@(in s1 (+ 1 @(in s2 (+ 2 @y))))
;; Won't work — atoms can't be transmitted
```

This is intentional. Serializing an atom would break its identity semantics — the remote worker would get a snapshot, not a reference.

### Workarounds

**Define in a separate namespace.** If both sides load the namespace, each gets their own atom instance:

```clojure
;; state.cljs
(ns my-app.state)
(def y (atom 3))
```

**Use `:no-globals?`** to suppress namespace var conveyance:

```clojure
@(in s1 {:no-globals? true} (+ 1 @(in s2 (+ 2 @y))))
```

This way, `y` on the remote side refers to the worker's own instance, not a conveyed copy.

**Use an explicit conveyance vector** that omits the problematic symbol:

```clojure
@(in s1 [s2] (+ 1 @(in s2 (+ 2 @y))))
```

## How It Works Internally

Binding conveyance is a compile-time mechanism:

1. The `in`/`spawn`/`future` macros inspect the ClojureScript compiler's `&env` to find all local bindings
2. They scan the body form for symbols that match locals or namespace vars
3. Matched values are captured into a map, serialized via `pr-str`, and embedded in the message
4. On the remote worker, the map is deserialized via `cljs.reader/read-string` and bindings are restored before evaluating the body

### Foreign var wrapping

The macros detect vars from foreign namespaces (not the invoking namespace) that appear in value position. These are wrapped to prevent the Closure compiler from inlining them at the call site, which would break conveyance.

## Conveyance with `spawn` and `future`

Binding conveyance works identically with `spawn` and `future`:

```clojure
(let [x 6]
  @(spawn (yield (+ x 2)) (println :ephemeral)))
;:ephemeral
;=> 8
```

```clojure
(let [x 2]
  @(future (+ 1 @(future (+ x 3)))))
;=> 6
```

## Summary

| Scenario | Behavior |
|----------|----------|
| `let` binding in scope | Auto-conveyed |
| `def` in invoking namespace | Auto-conveyed |
| `def` in foreign namespace | Wrapped and conveyed |
| Atom, channel, stateful object | NOT conveyed (intentional) |
| Explicit conveyance vector `[a b c]` | Only listed symbols conveyed |
| `:no-globals? true` | Namespace vars suppressed |
