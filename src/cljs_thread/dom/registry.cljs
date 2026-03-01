(ns cljs-thread.dom.registry
  "Screen-side handle <-> Element registry and wire-format utilities.

   Every real DOM object (Element, Document, Window, etc.) is assigned an
   integer handle. The registry maintains bidirectional mappings:

     handle -> Element  (for executing operations)
     Element -> handle  (for returning existing handles, not duplicates)

   Reserved handles (per implementation plan):
     0 → window
     1 → document
     2 → document.body
     3 → document.head
     4 → document.documentElement

   Also provides wire-format conversion utilities used by `in` bodies
   executing on the screen thread:
     result->wire  — convert DOM results to wire-safe values
     from-wire     — convert wire-format args back to real DOM objects
     extract-event — extract wire-safe properties from a browser Event

   Auto-initializes on the screen thread at namespace load time.
   Workers can safely require this namespace — init is a no-op."
  (:require [cljs-thread.env :as e]
            [cljs-thread.msg]))

;; Next handle counter (starts after pre-seeded handles)
(defonce ^:private next-handle (atom 10))

;; handle (int) -> DOM object
(defonce ^:private handle->obj (atom {}))

;; DOM object -> handle (int) — uses js/WeakMap for GC-friendliness
(defonce ^:private obj->handle (when (e/in-screen?) (js/WeakMap.)))

;; Well-known handle constants (per implementation plan)
(def WINDOW-HANDLE       0)
(def DOCUMENT-HANDLE     1)
(def BODY-HANDLE         2)
(def HEAD-HANDLE         3)
(def DOC-ELEMENT-HANDLE  4)

(defonce ^:private initialized? (atom false))

(defn init!
  "Pre-seed well-known DOM objects into the registry.
   Idempotent — safe to call multiple times.
   No-op on worker threads."
  []
  (when (and (e/in-screen?) (not @initialized?) (exists? js/document))
    (reset! initialized? true)
    (let [doc js/document
          win js/window]
      ;; Register well-known objects
      (swap! handle->obj assoc
             WINDOW-HANDLE win
             DOCUMENT-HANDLE doc)
      (.set obj->handle win WINDOW-HANDLE)
      (.set obj->handle doc DOCUMENT-HANDLE)
      ;; body, head, documentElement may not exist yet; register if available
      (when (.-body doc)
        (swap! handle->obj assoc BODY-HANDLE (.-body doc))
        (.set obj->handle (.-body doc) BODY-HANDLE))
      (when (.-head doc)
        (swap! handle->obj assoc HEAD-HANDLE (.-head doc))
        (.set obj->handle (.-head doc) HEAD-HANDLE))
      (when (.-documentElement doc)
        (swap! handle->obj assoc DOC-ELEMENT-HANDLE (.-documentElement doc))
        (.set obj->handle (.-documentElement doc) DOC-ELEMENT-HANDLE)))))

(defn register!
  "Register a DOM object, returning its integer handle.
   If the object is already registered, returns the existing handle."
  [obj]
  (if-let [existing (.get obj->handle obj)]
    existing
    (let [h (swap! next-handle inc)]
      (swap! handle->obj assoc h obj)
      (.set obj->handle obj h)
      h)))

(defn ^:export allocate-handle-range!
  "Reserve n handle IDs atomically. Returns the first ID of the range.
   Used by workers to pre-claim handles before creating elements so that
   batch createElement ops can be fire-and-forget (Item 3)."
  [n]
  (let [new-val (swap! next-handle + n)]
    (- new-val n)))

(defn ^:export register-at-handle!
  "Register a DOM object at a specific pre-allocated handle.
   Used by exec-write-ops! for create-el / create-text / create-el-ns ops."
  [handle obj]
  (swap! handle->obj assoc handle obj)
  (.set obj->handle obj handle)
  handle)

(defn ^:export lookup
  "Look up a DOM object by its integer handle. Returns nil if not found."
  [handle]
  (get @handle->obj handle))

(defn handle-for
  "Look up the handle for a DOM object. Returns nil if not registered."
  [obj]
  (when obj
    (.get obj->handle obj)))

(defn release!
  "Remove a handle from the registry (for GC). Returns nil."
  [handle]
  (when-let [obj (get @handle->obj handle)]
    (swap! handle->obj dissoc handle)
    ;; WeakMap entries auto-GC, but we can delete explicitly
    (.delete obj->handle obj))
  nil)

(defn registered-count
  "Return the number of handles currently registered. For testing."
  []
  (count @handle->obj))

;; ============ Wire-format conversion (screen-side) ============
;;
;; Used inside `(in :screen ...)` bodies from the worker proxy.

(defn- js-object?
  "Check if x is a JavaScript object (typeof === 'object' and not nil)."
  [x]
  (and (some? x) (identical? (js* "typeof ~{}" x) "object")))

(defn ^:export result->wire
  "Convert a DOM operation result into a wire-safe value.
   - nil/undefined -> nil
   - Primitives (string, number, boolean) -> returned as-is
   - Functions -> {:fn? true}
   - DOM objects -> registered as {:handle N, :type T}
   - Arrays/NodeLists -> vectors of wire results"
  [result]
  (cond
    (nil? result)
    nil

    (undefined? result)
    nil

    (fn? result)
    {:fn? true}

    (or (string? result) (number? result) (boolean? result))
    result

    ;; NodeList or HTMLCollection -> vec of wire results
    (or (instance? js/NodeList result)
        (instance? js/HTMLCollection result))
    (let [arr (array)]
      (dotimes [i (.-length result)]
        (.push arr (result->wire (.item result i))))
      (vec arr))

    ;; DOM Node or Element or Window-like object
    ;; Use constructor.name for the type hint so worker-side getPrototypeOf
    ;; can match against synthetic constructors (HTMLElement, Node, etc.)
    (or (instance? js/Node result)
        (instance? js/Window result)
        (and (js-object? result) (some? (.-nodeType result))))
    (let [h (register! result)]
      {:handle h
       :type (or (.. result -constructor -name)
                 (when (instance? js/Window result) "Window")
                 "Object")})

    ;; Other objects (e.g., DOMRect, CSSStyleDeclaration)
    (js-object? result)
    (let [h (register! result)]
      {:handle h
       :type (or (.. result -constructor -name) "Object")})

    :else
    result))

(defn ^:export from-wire
  "Resolve a single argument from wire format.
   Handle references {:handle N} become real DOM objects.
   Handles both CLJS maps and JS objects (sargs go through clj->js in msg.cljs)."
  [arg]
  (cond
    ;; CLJS map with :handle key
    (and (map? arg) (:handle arg))
    (lookup (:handle arg))

    ;; JS object with handle property (from clj->js conversion in msg.cljs)
    (and (object? arg) (some? (unchecked-get arg "handle")))
    (lookup (unchecked-get arg "handle"))

    :else arg))

(defn ^:export extract-event
  "Extract wire-safe event properties from a browser Event.
   Target and currentTarget are registered as handles."
  [event]
  (let [target (.-target event)
        current-target (.-currentTarget event)]
    (cond-> {:type (.-type event)}
      target
      (assoc :target {:handle (register! target)
                      :type (or (.-nodeName target) "EventTarget")})
      current-target
      (assoc :current-target {:handle (register! current-target)
                              :type (or (.-nodeName current-target) "EventTarget")}))))

;; ============ Screen-side listener storage ============
;;
;; Maps [handle event-type listener-id] -> real JS function on screen.
;; Used by worker's addEventListener/removeEventListener via `in`.

(defonce ^:private screen-listeners (atom {}))

(defn ^:export store-listener!
  "Store a screen-side real listener function. Key is [handle event-type lid]."
  [key real-fn]
  (swap! screen-listeners assoc key real-fn))

(defn ^:export remove-listener!
  "Remove and return a screen-side listener. Returns the real-fn or nil."
  [key]
  (let [real-fn (get @screen-listeners key)]
    (when real-fn
      (swap! screen-listeners dissoc key))
    real-fn))

;; ============ Exported helpers for cross-module `in` bodies ============
;;
;; Under :advanced Closure compilation, ClojureScript keywords get mangled
;; to module-local variable names. When `in` stringifies a function from the
;; worker and eval's it on the screen, keyword references break across
;; module boundaries. These helpers construct keyword maps on the screen
;; side (where the keywords live) so `in` bodies only need to call an
;; exported function name.

(defn ^:export post-dom-event
  "Post a :dom-event message from screen to a worker.
   Used inside `in :screen` bodies for event listener forwarding."
  [to listener-id event-data]
  (cljs-thread.msg/post to
    {:dispatch :dom-event
     :data {:listener-id listener-id
            :event-data event-data}}))

(defn ^:export post-dom-raf
  "Post a :dom-raf message from screen to a worker.
   Used inside `in :screen` bodies for rAF callback forwarding."
  [to callback-id timestamp]
  (cljs-thread.msg/post to
    {:dispatch :dom-raf
     :data {:callback-id callback-id
            :timestamp timestamp}}))

;; ============ Observer record serialisation (screen-side) ============
;;
;; These run inside `in :screen` bodies — they convert native observer record
;; arrays into wire-safe CLJS data that can be posted back to the worker.

(defn ^:export extract-mutation-records
  "Serialize a MutationObserver records array to wire format."
  [records]
  (vec
   (for [i (range (.-length records))
         :let [rec    (aget records i)
               target (.-target rec)
               added  (.-addedNodes rec)
               removed (.-removedNodes rec)]]
     (cond-> {:type (.-type rec)}
       target
       (assoc :target {:handle (register! target)
                       :type   (or (.. target -constructor -name) "Node")})
       (and added (pos? (.-length added)))
       (assoc :added-nodes
              (vec (for [j (range (.-length added))
                         :let [n (aget added j)]]
                     {:handle (register! n)
                      :type   (or (.. n -constructor -name) "Node")})))
       (and removed (pos? (.-length removed)))
       (assoc :removed-nodes
              (vec (for [j (range (.-length removed))
                         :let [n (aget removed j)]]
                     {:handle (register! n)
                      :type   (or (.. n -constructor -name) "Node")})))
       (.-attributeName rec)
       (assoc :attribute-name (.-attributeName rec))
       (.-oldValue rec)
       (assoc :old-value (.-oldValue rec))))))

(defn ^:export extract-resize-entries
  "Serialize a ResizeObserver entries array to wire format."
  [entries]
  (vec
   (for [i (range (.-length entries))
         :let [entry  (aget entries i)
               target (.-target entry)
               rect   (.-contentRect entry)]]
     (cond-> {}
       target
       (assoc :target {:handle (register! target)
                       :type   (or (.. target -constructor -name) "Element")})
       rect
       (assoc :content-rect {:width  (.-width rect)
                              :height (.-height rect)
                              :top    (.-top rect)
                              :left   (.-left rect)
                              :right  (.-right rect)
                              :bottom (.-bottom rect)})))))

(defn ^:export extract-intersection-entries
  "Serialize an IntersectionObserver entries array to wire format."
  [entries]
  (vec
   (for [i (range (.-length entries))
         :let [entry (aget entries i)
               target (.-target entry)
               irect  (.-intersectionRect entry)]]
     (cond-> {:is-intersecting   (.-isIntersecting entry)
              :intersection-ratio (.-intersectionRatio entry)}
       target
       (assoc :target {:handle (register! target)
                       :type   (or (.. target -constructor -name) "Element")})
       irect
       (assoc :intersection-rect {:width  (.-width irect)
                                   :height (.-height irect)
                                   :top    (.-top irect)
                                   :left   (.-left irect)})))))

(defn ^:export post-dom-observer
  "Post a :dom-observer message from screen to a worker.
   observer-type is the constructor name string (e.g. \"MutationObserver\").
   records is the raw JS records/entries array from the browser callback.
   Serialization (extract-*) runs here on the screen so the `in :screen`
   body stays minimal."
  [to obs-id observer-type records]
  (let [record-type (case observer-type
                      "MutationObserver"     "mutation"
                      "ResizeObserver"       "resize"
                      "IntersectionObserver" "intersection"
                      "unknown")
        serialized  (case observer-type
                      "MutationObserver"     (extract-mutation-records records)
                      "ResizeObserver"       (extract-resize-entries records)
                      "IntersectionObserver" (extract-intersection-entries records)
                      [])]
    (cljs-thread.msg/post to
      {:dispatch :dom-observer
       :data {:observer-id obs-id
              :record-type record-type
              :records     serialized}})))

(defn ^:export exec-write-ops!
  "Execute a pre-serialised batch of DOM write ops on the screen.
   ops-json must be a JSON string produced by JSON.stringify on an ops array,
   or nil (no-op). Handles 'set', 'call', and 'warn' op types. Returns nil.
   Called from the worker's with-batch flush and flush-on-read paths."
  [ops-json]
  (when ops-json
    (let [parsed (js/JSON.parse ops-json)
          n      (.-length parsed)]
      (dotimes [i n]
        (let [op      (aget parsed i)
              op-type (aget op 0)]
          (if (identical? op-type "warn")
            (.warn js/console (aget op 2))
            (if (or (identical? op-type "create-el")
                    (identical? op-type "create-text")
                    (identical? op-type "create-el-ns"))
              (case op-type
                "create-el"    (register-at-handle! (aget op 2)
                                                    (.createElement js/document (aget op 1)))
                "create-text"  (register-at-handle! (aget op 2)
                                                    (.createTextNode js/document (aget op 1)))
                "create-el-ns" (register-at-handle! (aget op 3)
                                                    (.createElementNS js/document (aget op 1) (aget op 2))))
              (let [obj (lookup (aget op 1))]
                (when obj
                  (case op-type
                    "set"  (unchecked-set obj (aget op 2) (aget op 3))
                    "call" (let [m        (unchecked-get obj (aget op 2))
                               raw-args (aget op 3)
                               n-args   (.-length raw-args)
                               resolved (js/Array. n-args)]
                           (dotimes [j n-args]
                             (let [a (aget raw-args j)]
                               (aset resolved j
                                     ;; Resolve handle references {handle: N} back to
                                     ;; real DOM nodes (e.g. appendChild arg).
                                     (if (and (some? a)
                                              (identical? (js* "typeof ~{}" a) "object")
                                              (some? (unchecked-get a "handle")))
                                       (lookup (unchecked-get a "handle"))
                                       a))))
                           (when m
                             (.apply m obj resolved)))))))))))))

;; ---------------------------------------------------------------------------
;; Auto-initialize on the screen thread at namespace load time.
;; Workers can safely require this namespace — init! is a no-op on workers.
;; ---------------------------------------------------------------------------
(init!)
