# Serialization & Wire Protocol

When values cross worker boundaries (via `in`, `spawn`, `future`, etc.), they go through `cljs-thread`'s serialization layer. Understanding what transfers and how helps debug "why didn't my value arrive?" issues.

## How It Works

The wire protocol has two phases:

1. **`instr-body`** (encode): Walks the payload, replacing special types with markers. Functions become stringified, typed arrays become transfer references, EVE types pass through unchanged.

2. **`pr-str` / `edn/read-string`**: The marked payload is serialized as EDN for safe transmission via `postMessage`.

3. **`unstr-body`** (decode): Reconstructs the original types from markers and transfer references. Functions are `eval`'d, typed arrays are reunited with their buffers.

## What Transfers

### CLJS Primitives — Just Work

All standard Clojure data types transit correctly:

```clojure
@(in worker "hello")             ;=> "hello"
@(in worker {:a 1 :b [2 3]})    ;=> {:a 1 :b [2 3]}
@(in worker #{:x :y})           ;=> #{:x :y}
@(in worker nil)                 ;=> nil
@(in worker 42)                  ;=> 42
@(in worker :keyword)            ;=> :keyword
```

Keywords, symbols, numbers, strings, booleans, nil, maps, vectors, sets, and lists all serialize via EDN round-trip.

### Functions — Stringified and Eval'd

Functions are converted to strings and reconstituted via `js/eval` on the receiving worker:

```clojure
;; The function is stringified at send time, eval'd at receive time
@(in worker (map inc [1 2 3]))   ;=> (2 3 4)
```

This works for any function that can be represented as source text. It does **not** work for closures over worker-local mutable state — only global references and conveyed bindings survive.

Internally, functions become `#cljs-thread/arg-fn <stringified-fn>` tags.

### Typed Arrays — Transferred via Structured Clone

JavaScript typed arrays (`Int32Array`, `Float64Array`, `Uint8Array`, etc.) and `ImageBitmap` objects are handled as **transferables**:

```clojure
(let [buf (js/Int32Array. #js [1 2 3])]
  @(in worker (aget buf 0)))
;=> 1
```

The serializer:
1. Detects typed arrays and assigns them a `ctag` (content tag)
2. Replaces them with `{:__ct-marker "transferable" :ctag N}` in the payload
3. The actual buffer is passed via `postMessage`'s transfer list
4. On the receiving side, `unstr-body` reconstructs the typed array from the transfer reference

**SharedArrayBuffer views** (typed arrays whose `.buffer` is a `SharedArrayBuffer`) are handled differently — they're shared via structured clone, not transferred. The buffer is automatically available on both sides.

### EVE Types — Zero-Copy

EVE types (`SharedAtom`, `AtomDomain`, eve maps/sets/vecs, `eve/deftype` instances) pass through the serializer unchanged. They already live in `SharedArrayBuffer` — both workers see the same memory:

```clojure
(def counter (t/atom {:n 0}))

;; The atom itself crosses the boundary — both workers see the same SAB
@(in worker (swap! counter update :n inc))
@counter  ;=> {:n 1}
```

`SharedAtom` uses the tagged reader `#cljs-thread/shared-atom {:id ... :idx ...}` for EDN serialization. The receiving worker reconstructs the atom from its identity fields, pointing at the same shared memory.

### JS Host Objects — Preserved via Structured Clone

Non-CLJS JavaScript objects (`ImageData`, `Error`, `Date`, etc.) are preserved using content tags:

```clojure
;; JS objects that survive structured clone
(let [date (js/Date.)]
  @(in worker (.getFullYear date)))
```

The serializer detects these via `typeof === "object"` with a non-CLJS constructor and wraps them as `{:__ct-marker "js-object" :ctag N}`.

## What Does NOT Transfer

### Closures Over Local Mutable State

Functions that close over worker-local mutable state will lose that state:

```clojure
;; This won't work as expected
(let [local-state (atom 0)]
  @(in worker
     ;; `local-state` is a new atom on the receiving worker
     (swap! local-state inc)))
```

Use `t/atom` (shared atoms) instead of `atom` for cross-worker state.

### DOM Nodes

DOM nodes cannot be serialized. Use the [DOM Proxy](14-dom-proxy.md) instead.

### Non-Serializable JS Objects

Objects that fail structured clone (e.g., objects with circular references, or WeakMaps) will cause errors. Keep cross-worker payloads simple.

## Binding Conveyance

The serialization layer works hand-in-hand with [binding conveyance](03-binding-conveyance.md). When you use a local variable inside `in` or `spawn`, the macro captures it at compile time and includes it in the serialized payload:

```clojure
(let [x 42
      f inc]
  @(in worker (f x)))
;=> 43
```

The macro extracts `x` and `f` from the enclosing scope, serializes them via `instr-body`, and reconstructs them on the receiving worker before executing the body.

## Debugging Transfer Issues

If a value doesn't arrive correctly:

1. **Check the type**: Is it a standard CLJS type, a typed array, an EVE type, or a JS host object?
2. **Check for closures**: Does your function close over worker-local state?
3. **Check for DOM references**: DOM nodes can't cross boundaries.
4. **Check EDN round-trip**: Can the value survive `(-> val pr-str cljs.reader/read-string)`?

For complex payloads, consider breaking them into simpler types or using a shared atom as an intermediary.
