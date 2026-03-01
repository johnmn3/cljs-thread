# DOM Proxy

Workers cannot access the DOM directly — it only exists on the screen thread. `cljs-thread` solves this with a transparent ES6 Proxy layer that makes DOM access from workers look and feel native.

## How It Works

Every real DOM object on the screen thread is assigned an integer **handle**. Workers receive Proxy objects that wrap these handles. When you access a property or call a method on a proxy, it forwards the operation to the screen thread via `in`, executes it against the real DOM object, and returns the result.

```
Worker                                Screen
──────                                ──────
(.querySelector document "#app")
  → in :screen                    →   registry/lookup(handle 1) → document
                                      .querySelector("#app")
                                      register!(element) → handle 11
  ← {:handle 11 :type "HTMLDivElement"}
  → wrap-proxy(11)
  ← Proxy object
```

The proxy cache ensures identity: the same handle always returns the same Proxy instance, so `(identical? el1 el2)` works correctly.

## Setup

The DOM proxy installs automatically when a worker connects to the screen peer. No configuration needed — just require `cljs-thread.dom`:

```clojure
(ns my-app.core
  (:require [cljs-thread.core :as t]
            [cljs-thread.dom :as dom]))
```

For transparent proxy access (npm libraries that assume `window`/`document` exist), the install module patches `globalThis` with proxy getters. This happens automatically.

## Transparent Proxy Access

Workers get proxy versions of `document`, `window`, `navigator`, `location`, `history`, `localStorage`, `sessionStorage`, and more. JavaScript and npm libraries that access these globals work unmodified:

```clojure
;; In a worker — looks identical to screen-thread code
(let [el (.querySelector js/document "#app")]
  (set! (.-textContent el) "Hello from a worker!"))

;; npm libraries work too
(-> (js/d3.select "#chart")
    (.append "svg")
    (.attr "width" 400))
```

### Installed Globals

These are installed as `Object.defineProperty` getters on `globalThis`:

| Global | Description |
|--------|-------------|
| `document`, `window` | Core DOM proxies |
| `navigator`, `location`, `history` | Navigation |
| `localStorage`, `sessionStorage` | Storage |
| `requestAnimationFrame`, `cancelAnimationFrame` | Animation |
| `screen`, `devicePixelRatio` | Display geometry |
| `innerWidth`, `innerHeight`, `outerWidth`, `outerHeight` | Viewport |
| `scrollX`, `scrollY`, `pageXOffset`, `pageYOffset` | Scroll position |
| `matchMedia`, `getComputedStyle` | CSS / media queries |
| `alert`, `confirm`, `prompt`, `open` | UI / window management |
| `scroll`, `scrollTo`, `scrollBy` | Scroll methods |
| `visualViewport` | Visual viewport |
| `MutationObserver`, `ResizeObserver`, `IntersectionObserver` | Observers |

### Native Worker Globals

Built-in JavaScript globals that exist natively in workers (`Promise`, `setTimeout`, `fetch`, `console`, `Map`, `Set`, typed arrays, `crypto`, etc.) are **not** proxied — they return the worker-local value directly. This prevents unnecessary screen round-trips and preserves closure semantics.

## Idiomatic CLJS API

`cljs-thread.dom` provides a functional wrapper over the proxy layer:

### Query & Traversal

```clojure
(dom/query "#app")               ;; querySelector
(dom/query ".item" container)    ;; querySelector on element
(dom/query-all ".items")         ;; querySelectorAll → CLJS vector
(dom/by-id "header")             ;; getElementById
```

### Element Properties

```clojure
(dom/text el)                    ;; get textContent
(dom/set-text! el "hello")       ;; set textContent
(dom/inner-html el)              ;; get innerHTML
(dom/set-inner-html! el "<b>hi</b>")
(dom/tag-name el)                ;; get tagName
```

### Attributes

```clojure
(dom/attr el "href")             ;; getAttribute
(dom/set-attr! el "href" "/new") ;; setAttribute
(dom/remove-attr! el "disabled") ;; removeAttribute
(dom/has-attr? el "hidden")      ;; hasAttribute
```

### CSS Classes

```clojure
(dom/add-class! el "active" "visible")
(dom/remove-class! el "hidden")
(dom/toggle-class! el "open")     ;; returns boolean
(dom/has-class? el "active")
```

### Style

```clojure
(dom/set-styles! el {"color" "red"
                     "font-size" "16px"
                     "display" "flex"})
```

`set-styles!` batches all writes into a single `in :screen` call.

### DOM Mutation

```clojure
(def el (dom/create "div"))
(def txt (dom/create-text "hello"))
(dom/append! parent el)
(dom/insert-before! parent new-el ref-el)
(dom/remove! el)
(dom/remove-child! parent child)
(dom/clone-node el true)          ;; deep clone
```

### Geometry

```clojure
(dom/rect el)
;=> {:x 0 :y 100 :width 300 :height 50
;    :top 100 :right 300 :bottom 150 :left 0}
```

## Event Listeners

Event callbacks stay on the worker — the screen registers a forwarding stub that posts serialized event data back via message passing:

```clojure
;; addEventListener — callback runs on the worker
(.addEventListener el "click"
  (fn [event]
    (println "Clicked!" (.-type event))
    (let [target (.-target event)]
      (set! (.-textContent target) "Clicked!"))))

;; removeEventListener works by identity
(.removeEventListener el "click" my-handler)

;; on* property handlers
(set! (.-onclick el) (fn [e] (println "click")))
(set! (.-onclick el) nil)  ;; remove
```

Event objects are synthetic — they contain `:type`, `:target` (proxy), and `:currentTarget` (proxy). `preventDefault` and `stopPropagation` are no-ops (the real event has already fired on screen).

## requestAnimationFrame

rAF callbacks stay on the worker. The screen registers a real `requestAnimationFrame` that posts the timestamp back:

```clojure
(defn animate [timestamp]
  ;; Update state, compute positions, etc.
  (dom/set-styles! canvas-el {"transform" (str "rotate(" (* timestamp 0.1) "deg)")})
  (.requestAnimationFrame js/window animate))

(.requestAnimationFrame js/window animate)
```

rAF callbacks are automatically wrapped in a **batch** — all DOM writes within the callback are coalesced into a single `in :screen` round-trip per frame.

## Observers

`MutationObserver`, `ResizeObserver`, and `IntersectionObserver` follow the same pattern — the callback stays on the worker, the real observer lives on screen:

```clojure
;; MutationObserver
(let [observer (js/MutationObserver.
                 (fn [records]
                   (doseq [rec records]
                     (println "Mutation:" (.-type rec)))))]
  (.observe observer target-el #js {:childList true :subtree true}))

;; ResizeObserver
(let [observer (js/ResizeObserver.
                 (fn [entries]
                   (doseq [entry entries]
                     (println "Resized:" (.. entry -contentRect -width)))))]
  (.observe observer el))

;; IntersectionObserver
(let [observer (js/IntersectionObserver.
                 (fn [entries]
                   (doseq [entry entries]
                     (println "Visible?" (.-isIntersecting entry)))))]
  (.observe observer el))
```

Observer records are serialized by the screen and reconstructed as synthetic JS objects on the worker, with target elements converted to proxies.

## Write Batching

For performance-critical code (animation loops, canvas drawing), use `proxy/with-batch` to coalesce writes:

```clojure
(require '[cljs-thread.dom.proxy :as proxy])

(proxy/with-batch
  (fn []
    ;; All these writes queue up and flush in one screen round-trip
    (dom/set-text! el1 "hello")
    (dom/set-text! el2 "world")
    (dom/set-styles! el3 {"opacity" "1"})))
```

Only fire-and-forget operations with primitive arguments are batched. Reads and calls with non-primitive arguments fall through to synchronous execution.

## `instanceof` Checks

Workers install synthetic DOM constructors (`Node`, `Element`, `HTMLElement`, `Document`) on `globalThis` so that `(instance? js/HTMLElement proxy)` returns `true`. The prototype chain maps concrete types (e.g., `HTMLDivElement`) to the synthetic hierarchy.

## Performance

Each property read or method call costs one `in :screen` round-trip (~1-5ms). For performance-sensitive code:

- Use `in :screen` directly for complex DOM operations — one round-trip for many operations
- Use `proxy/with-batch` in animation callbacks
- Use `dom/set-styles!` for bulk style updates
- Keep hot rendering paths on the screen thread with `(in :screen ...)`

The DOM proxy is designed for convenience over raw speed. When you need maximum DOM throughput (e.g., rendering a large table), do the work directly `(in :screen ...)` instead of through individual proxy calls.
