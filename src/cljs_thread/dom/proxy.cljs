(ns cljs-thread.dom.proxy
  "Worker-side ES6 Proxy factory for transparent DOM access.

   Creates Proxy objects that intercept property access, method calls,
   and property writes, forwarding them to the screen thread via `in`.

   Each Proxy wraps a handle (integer) that identifies a DOM object
   in the screen-side registry. The same handle always returns the
   same Proxy instance (identity cache) so `el1 === el2` works.

   All DOM operations use `in` to eval code on the screen thread.
   Function arguments (e.g. requestAnimationFrame callbacks) are
   serialized by `in`'s instr-body machinery and reconstituted on
   screen via eval.

   Event listeners are the exception: callbacks stay on the worker
   (to access worker-local state), and the screen forwards events
   back via message passing. Registration still uses `in`.

   Only runs on worker threads."
  (:require-macros [cljs-thread.in :refer [in]])
  (:require [cljs-thread.in]
            [cljs-thread.env :as e]
            [cljs-thread.msg :as m]
            [cljs-thread.perf :as perf]
            [cljs-thread.sync :as sync]
            [cljs-thread.id :refer [get-id]]
            [cljs-thread.dom.registry :as reg]))

;; Cache: handle (int) -> Proxy object for identity preservation.
(defonce ^:private proxy-cache (js/Map.))

;; Forward declaration for mutual recursion between wrap-proxy and unwrap-result
(declare wrap-proxy)

(defn- in-sync
  "Block for the result of an `in` call.
   `in` returns a derefable; dereffing it blocks via Atomics.wait
   when SAB sync is available, or falls back to SW sync otherwise."
  [derefable]
  @derefable)

(defn- getter-method?
  "True for DOM methods that return meaningful values and must never be
   fire-and-forget. Excludes these from write-batching.
   'create' prefix covers createElement/createTextNode/createElementNS so
   reagami render calls return real element handles even inside with-batch."
  [method-name]
  (or (.startsWith method-name "get")
      (.startsWith method-name "has")
      (.startsWith method-name "query")
      (.startsWith method-name "match")
      (.startsWith method-name "closest")
      (.startsWith method-name "create")))

(defn- primitive-wire?
  "True if v can safely pass through the batch queue (structured-clone safe)."
  [v]
  (or (nil? v) (string? v) (number? v) (boolean? v)))

(defn- wire-safe?
  "True if v can be safely queued in a batch op.
   Extends primitive-wire? to include proxy handle maps {:handle N} so that
   appendChild/insertBefore/replaceChildren with node args can be batched."
  [v]
  (or (primitive-wire? v)
      (and (map? v) (integer? (:handle v)))))

(defn- wire-safe-to-js
  "Convert a wire-safe value to a JSON-serializable JS form.
   CLJS handle maps {:handle N} become plain JS objects so JSON.stringify
   serializes them as {\"handle\": N} instead of {}.
   All other values pass through unchanged."
  [v]
  (if (and (map? v) (integer? (:handle v)))
    #js {:handle (:handle v)}
    v))

(defn- unwrap-result
  "Convert a wire-format result back into a Proxy or primitive.
   Handle maps {:handle N, :type T} become Proxy objects.
   Vectors of handle maps become JS arrays of Proxies.
   Primitives pass through."
  [result]
  (cond
    (nil? result)
    nil

    (and (map? result) (:handle result))
    (wrap-proxy (:handle result) (:type result))

    (vector? result)
    (let [arr (array)]
      (doseq [item result]
        (.push arr (unwrap-result item)))
      arr)

    :else result))

(defn- to-wire
  "Convert a single argument to wire format for transmission to screen.
   Proxy objects become {:handle N}. Everything else passes through
   (including functions, which `in`'s instr-body will serialize)."
  [a]
  (if (and a
           (let [t (js* "typeof ~{}" a)]
             (or (identical? t "object") (identical? t "function")))
           (true? (try (unchecked-get a "__is_dom_proxy")
                       (catch :default _ false))))
    {:handle (unchecked-get a "__dom_handle")}
    a))

;; ============ Batch Queue ============
;;
;; When batch-queue is non-nil, proxy `set` and fire-and-forget method call
;; operations are queued instead of executing immediately. `with-batch` flushes
;; all queued operations in a single `in :screen` call.
;;
;; Op format (JS arrays, structured-clone-safe for transfer via in :screen):
;;   set:  #js ["set"  handle prop wire-val]
;;   call: #js ["call" handle method-name args-js-array]
;;
;; Item 6 (simplified): batch-queue holds a mutable JS array (#js []) instead
;; of a CLJS persistent vector.  This eliminates ~915 PersistentVector node
;; allocations per rAF frame (one per conj) and the to-array copy at flush
;; time.  nil still means "not batching"; a JS array (possibly empty) means
;; "batching active".  Ops are appended via .push (O(1) amortised, no alloc).

(defonce ^:private batch-queue (atom nil))

;; Item 2: rAF registrations deferred inside with-batch. Declared here (before
;; with-batch and make-raf-fn) so both can reference it without forward-decl warnings.
(defonce ^:private pending-raf-registrations (atom []))

;; ============ DOM Shadow Cache (Strategy 1: Write-Through) ============
;;
;; When the proxy batches a write (setAttribute, property set, etc.), it also
;; records the new value here. Subsequent reads check the shadow first and
;; return immediately with zero round-trips on a hit.
;;
;; Covers only values written *through this proxy*. External mutations (CSS,
;; browser autofill, other scripts) are not tracked and cause a shadow miss,
;; falling through to the screen. Clear per-handle via clear-shadow-handle!
;; when handles are retired.
;;
;; {handle (int) -> {prop-or-attr-name (string) -> wire-val}}
(defonce ^:private dom-shadow (atom {}))

(defn- shadow-set!
  "Record a wire-format value in the shadow for {handle, prop}."
  [handle prop v]
  (swap! dom-shadow assoc-in [handle prop] v))

(defn- shadow-del!
  "Remove {handle, prop} from shadow (e.g. after removeAttribute)."
  [handle prop]
  (swap! dom-shadow update handle dissoc prop))

(defn- shadow-get
  "Return the shadowed value for {handle, prop}, or ::miss sentinel if absent."
  [handle prop]
  (get-in @dom-shadow [handle prop] ::miss))

(defn clear-shadow-handle!
  "Remove all shadow entries for handle. Call when a handle is retired."
  [handle]
  (swap! dom-shadow dissoc handle))

;; ============ Selector → Handle Cache (Strategy: stable-element cache) ============
;;
;; `querySelector` and `getElementById` are getter-methods (never batched) and
;; return DOM handles. For stable elements (app roots, known containers, etc.),
;; the same query returns the same handle on every call. Caching eliminates
;; the screen RTT after the first miss.
;;
;; Key: [parent-handle selector-string] → resolved proxy (the result element).
;; Null results (element not found) are NOT cached — element may appear later.
;;
;; Eviction: call evict-selector-cache-handle! when an element is removed.
;; The MutationObserver-based auto-eviction is wired in separately.
;; {[parent-handle selector] -> proxy}

(defonce ^:private selector-cache (atom {}))

(defn evict-selector-cache-handle!
  "Remove selector cache entries whose result has the given handle.
   Call when an element is retired from the registry (removed from DOM)."
  [handle]
  (swap! selector-cache
         (fn [cache]
           (reduce-kv (fn [acc k v]
                        (if (= handle (unchecked-get v "__dom_handle"))
                          acc
                          (assoc acc k v)))
                      {} cache))))

(defn- cached-query
  "Look up a selector/id query from cache; go to screen on miss.
   Handles flush-on-read when inside a batch context (queues existing ops
   together with the query in a single RTT).
   Does NOT cache nil results — element may appear later."
  [parent-handle method-name selector]
  (let [key [parent-handle selector]]
    (if-let [cached (get @selector-cache key)]
      cached
      ;; Cache miss: query screen, with flush-on-read if batching
      (let [result (if @batch-queue
                     (let [pending     @batch-queue
                           pending-json (when (pos? (.-length pending)) (js/JSON.stringify pending))]
                       (unchecked-set bc "for" (inc (unchecked-get bc "for")))
                       (reset! batch-queue #js [])
                       (in-sync
                        (in :screen
                          (let [_ (cljs-thread.dom.registry/exec-write-ops! pending-json)
                                obj (cljs-thread.dom.registry/lookup parent-handle)]
                            (cljs-thread.dom.registry/result->wire
                             (.call (unchecked-get obj method-name) obj selector))))))
                     (in-sync
                      (in :screen
                        (let [obj (cljs-thread.dom.registry/lookup parent-handle)]
                          (cljs-thread.dom.registry/result->wire
                           (.call (unchecked-get obj method-name) obj selector))))))]
        (let [resolved (unwrap-result result)]
          (when resolved
            (swap! selector-cache assoc key resolved))
          resolved)))))

;; ============ Handle Pre-hoist (Item 1) ============
;;
;; hoist-handles! resolves multiple selectors in one round-trip and stores
;; the resulting proxies in hoisted-handles. As a side-effect it also
;; populates selector-cache so subsequent querySelector calls are free.
;; get-hoisted retrieves a pre-hoisted proxy by keyword key (zero RTT).

(defonce ^:private hoisted-handles (atom {}))

(defn hoist-handles!
  "Pre-register stable element handles in one round-trip.
   selector-map: {keyword -> selector-string}
   Returns a map of {keyword -> proxy} for found elements.
   Also populates selector-cache so subsequent querySelector calls are free."
  [selector-map]
  (let [wire-map (in-sync
                  (in :screen
                    (reduce-kv (fn [acc k sel]
                                 (let [el (.querySelector js/document sel)]
                                   (if el
                                     (assoc acc k
                                            (cljs-thread.dom.registry/result->wire el))
                                     acc)))
                               {}
                               selector-map)))
        proxy-map (reduce-kv (fn [acc k wire-val]
                               (let [proxy (unwrap-result wire-val)]
                                 (when proxy
                                   (swap! selector-cache assoc
                                          [reg/DOCUMENT-HANDLE (get selector-map k)] proxy))
                                 (assoc acc k proxy)))
                             {}
                             wire-map)]
    (swap! hoisted-handles merge proxy-map)
    proxy-map))

(defn get-hoisted
  "Return a pre-hoisted element proxy by key (zero RTT)."
  [k]
  (get @hoisted-handles k))

;; ============ Worker-side Handle Allocator (Item 3) ============
;;
;; Workers pre-allocate ranges of screen-side handles via
;; allocate-handle-range! (one RTT). Inside with-batch, createElement /
;; createTextNode / createElementNS consume pre-allocated handles without
;; any screen round-trip; the actual DOM creation is queued as a batch op.
;;
;; When the range is exhausted, ensure-handle-range! fetches a new one.
;; If called inside an active batch, the refill RTT completes correctly.

(defonce ^:private worker-handle-base  (atom 0))
(defonce ^:private worker-handle-limit (atom 0))

(defn- ensure-handle-range!
  "Refill the local handle range if exhausted (1 RTT to screen)."
  []
  (when (>= @worker-handle-base @worker-handle-limit)
    (let [base (in-sync
                (in :screen
                  (cljs-thread.dom.registry/allocate-handle-range! 64)))]
      (reset! worker-handle-base base)
      (reset! worker-handle-limit (+ base 64)))))

(defn- claim-worker-handle!
  "Return the next pre-allocated handle, refilling the range if needed."
  []
  (ensure-handle-range!)
  (let [h @worker-handle-base]
    (swap! worker-handle-base inc)
    h))

;; ============ Per-batch Performance Counters ============
;;
;; Mutable JS object — plain field increments, no atom overhead.
;; Reset at the start of each with-batch; logged at flush time.
;; Only emits a log line when at least one interesting event occurred.
(def ^:private bc #js {:hits 0 :misses 0 :for 0 :writes 0})

(defn with-batch
  "Execute f with write batching enabled. All proxy set operations and
   fire-and-forget method calls within f are queued and flushed in a single
   `in :screen` call. Reads still go through as normal sync calls.

   Ops are JSON-serialized (a primitive string) so instr-walk passes them
   through with zero ctag overhead regardless of batch size.

   Item 2: requestAnimationFrame calls inside f are deferred and folded into
   the same flush RTT as the write ops, saving one RTT per rAF inside a batch.

   Item 3: createElement/createTextNode/createElementNS inside f return
   pre-allocated proxy handles immediately (zero RTT); actual DOM creation
   is queued as batch ops and executed at flush time.

   When perf logging is enabled (cljs-thread.perf/enable!), emits a [bench]
   batch JSON line with wall-time breakdown (Item 13)."
  ([f] (with-batch f nil))
  ([f label]
   ;; Nesting guard: if already batching (e.g. set-styles! called from inside
   ;; an event-handler with-batch), just run f in the existing batch context
   ;; without resetting the queue or emitting a second flush.
   (if @batch-queue
     (f)
     (do
       (reset! batch-queue #js [])
       (unchecked-set bc "hits"   0)
       (unchecked-set bc "misses" 0)
       (unchecked-set bc "for"    0)
       (unchecked-set bc "writes" 0)
       (let [perf?   (perf/enabled?)
             t-enter (when perf? (js/performance.now))]
         (try
           (f)
           (let [t-flush      (when perf? (js/performance.now))
                 ops          @batch-queue
                 ops-json     (when (pos? (.-length ops)) (js/JSON.stringify ops))
                 ;; Item 2: collect and reset deferred rAF registrations
                 pending-rafs (let [rafs @pending-raf-registrations]
                                (reset! pending-raf-registrations [])
                                rafs)]
             (reset! batch-queue nil)
             (let [h         (unchecked-get bc "hits")
                   m         (unchecked-get bc "misses")
                   for-count (unchecked-get bc "for")
                   w         (unchecked-get bc "writes")]
               ;; Item 2: fold deferred rAF registrations into the write-ops RTT.
               ;; Bind rAF vars outside `in :screen` (via if-let on first pending rAF)
               ;; so each conveyer arg appears exactly once — avoids duplicate parameter
               ;; names in the compiled function string. Additional rAFs (rare) get
               ;; separate RTTs. exec-write-ops! handles nil ops-json internally.
               (if-let [{:keys [cb-id handle from]} (first pending-rafs)]
                 (do
                   (in-sync
                    (in :screen
                      (do
                        (cljs-thread.dom.registry/exec-write-ops! ops-json)
                        (let [obj (cljs-thread.dom.registry/lookup handle)]
                          (.requestAnimationFrame obj
                            (fn [ts]
                              (cljs-thread.dom.registry/post-dom-raf from cb-id ts)))))))
                   ;; Additional rAFs (rare) — one RTT each.
                   ;; Use run! + fn to give each rAF a fresh closure scope,
                   ;; avoiding any variable-shadowing issue with the outer
                   ;; if-let bindings when the in macro captures free vars.
                   (run! (fn [{cb-id2 :cb-id handle2 :handle from2 :from}]
                           (in-sync
                            (in :screen
                              (let [obj (cljs-thread.dom.registry/lookup handle2)]
                                (.requestAnimationFrame obj
                                  (fn [ts]
                                    (cljs-thread.dom.registry/post-dom-raf from2 cb-id2 ts)))))))
                         (rest pending-rafs)))
                 (when ops-json
                   (in-sync
                    (in :screen
                      (cljs-thread.dom.registry/exec-write-ops! ops-json)))))
               (when perf?
                 (let [t-exit (js/performance.now)]
                   (perf/bench-log {:type        "batch"
                                    :writes      w
                                    :hits        h
                                    :misses      m
                                    :for         for-count
                                    :t-user-fn   (- t-flush t-enter)
                                    :t-flush-rtt (- t-exit t-flush)
                                    :t-total     (- t-exit t-enter)
                                    :label       (or label "?")})))))
           (catch :default e
             (reset! batch-queue nil)
             (reset! pending-raf-registrations [])  ;; Item 2: clean up deferred rAFs
             (throw e))))))))


;; ============ Method wrappers ============

(defn- make-method-fn
  "Create a callable+constructible proxy for a method on the screen thread.
   Regular calls use .apply (method invocation).
   `new` calls use Reflect.construct (constructor invocation).
   Function arguments (RAF callbacks, etc.) are serialized by `in`.

   In batch mode (during rAF callbacks), fire-and-forget calls with primitive
   args are queued and flushed as a single `in :screen` call for performance."
  [handle method-name]
  (js/Proxy.
   (js/Function.)
   #js {:apply
        (fn [_target _this-arg args]
          (let [wire-args (mapv to-wire (js/Array.from args))]
            (cond
              ;; ── Batch CREATE (Item 3) ─────────────────────────────────────────────
              ;; createElement/createTextNode/createElementNS inside a batch window:
              ;; claim a pre-allocated handle, queue a create op, return a proxy
              ;; immediately — zero RTT. The actual DOM creation runs at flush time.
              (and @batch-queue
                   (or (= method-name "createElement")
                       (= method-name "createElementNS")
                       (= method-name "createTextNode"))
                   (every? string? wire-args))
              (let [h (claim-worker-handle!)]
                (unchecked-set bc "writes" (inc (unchecked-get bc "writes")))
                (case method-name
                  "createElement"
                  (do (.push @batch-queue #js ["create-el" (first wire-args) h])
                      (wrap-proxy h "HTMLElement"))
                  "createTextNode"
                  (do (.push @batch-queue #js ["create-text" (first wire-args) h])
                      (wrap-proxy h "Text"))
                  "createElementNS"
                  (do (.push @batch-queue #js ["create-el-ns" (first wire-args) (second wire-args) h])
                      (wrap-proxy h "Element"))))

              ;; ── Batch WRITE ───────────────────────────────────────────────────────
              ;; Fire-and-forget calls with wire-safe args: queue, shadow, return nil.
              ;; wire-safe? covers primitives + handle maps, so appendChild(proxy),
              ;; insertBefore, replaceChildren, etc. can all be batched.
              ;; wire-safe-to-js converts CLJS {:handle N} to #js {:handle N} for
              ;; JSON.stringify compatibility before storing in the batch array.
              (and @batch-queue
                   (not (getter-method? method-name))
                   (every? wire-safe? wire-args))
              (do
                ;; Strategy 1: shadow known write methods so reads can skip screen.
                (case method-name
                  "setAttribute"
                  (when (= 2 (count wire-args))
                    (shadow-set! handle (first wire-args) (second wire-args)))
                  "removeAttribute"
                  (when (= 1 (count wire-args))
                    (shadow-del! handle (first wire-args)))
                  nil)
                (unchecked-set bc "writes" (inc (unchecked-get bc "writes")))
                (.push @batch-queue #js ["call" handle method-name
                                         (into-array (map wire-safe-to-js wire-args))])
                js/undefined)

              ;; ── Selector cache — querySelector / getElementById ─────────────────
              ;; These are getter-methods (never batched) that return stable handles.
              ;; Cache hit = 0 RTT. Miss goes to screen and populates the cache.
              ;; Null results are not cached (element may appear later).
              (and (or (= method-name "querySelector")
                       (= method-name "getElementById"))
                   (= 1 (count wire-args))
                   (string? (first wire-args)))
              (cached-query handle method-name (first wire-args))

              ;; ── All other calls (getter, complex args, or no batch context) ──────
              :else
              (let [;; Strategy 1: getAttribute checks shadow before going to screen.
                    shadow-val (if (and (= method-name "getAttribute")
                                       (= 1 (count wire-args)))
                                 (shadow-get handle (first wire-args))
                                 ::miss)]
                (if (not= shadow-val ::miss)
                  (do
                    (unchecked-set bc "hits" (inc (unchecked-get bc "hits")))
                    shadow-val)  ;; Shadow hit — zero round-trip
                  ;; Shadow miss: must reach the screen.
                  (do
                    (unchecked-set bc "misses" (inc (unchecked-get bc "misses")))
                    (if @batch-queue
                      ;; Strategy 2 (flush-on-read): flush any pending writes together
                      ;; with this read in a SINGLE round-trip. Resets queue to [] (not
                      ;; nil) so batching continues for ops that come after this read.
                      (let [pending     @batch-queue
                            pending-json (when (pos? (.-length pending))
                                           (js/JSON.stringify pending))]
                        (unchecked-set bc "for" (inc (unchecked-get bc "for")))
                        (reset! batch-queue #js [])
                      (let [result (in-sync
                                    (in :screen
                                      (let [_ (cljs-thread.dom.registry/exec-write-ops! pending-json)
                                            obj (cljs-thread.dom.registry/lookup handle)
                                            resolved (mapv cljs-thread.dom.registry/from-wire wire-args)
                                            method-fn (unchecked-get obj method-name)]
                                        (cljs-thread.dom.registry/result->wire
                                         (.apply method-fn obj (to-array resolved))))))]
                        (unwrap-result result)))
                    ;; No batch context — normal sync path.
                    (let [result (in-sync
                                  (in :screen
                                    (let [obj (cljs-thread.dom.registry/lookup handle)
                                          resolved (mapv cljs-thread.dom.registry/from-wire wire-args)
                                          method-fn (unchecked-get obj method-name)]
                                      (cljs-thread.dom.registry/result->wire
                                       (.apply method-fn obj (to-array resolved))))))]
                      (unwrap-result result)))))))))
        :construct
        (fn [_target args _new-target]
          (let [wire-args (mapv to-wire (js/Array.from args))
                result (in-sync
                        (in :screen
                          (let [obj (cljs-thread.dom.registry/lookup handle)
                                resolved (mapv cljs-thread.dom.registry/from-wire wire-args)
                                ctor (unchecked-get obj method-name)]
                            (cljs-thread.dom.registry/result->wire
                             (js/Reflect.construct ctor (to-array resolved))))))]
            (unwrap-result result)))}))

;; ============ Event Listener Support ============
;;
;; Callbacks stay on the worker. The screen gets a stub listener
;; (registered via `in`) that forwards events back via m/post.

;; listener-id (string) -> callback fn
(defonce ^:private listener-callbacks (js/Map.))
(defonce ^:private next-listener-id (atom 0))

;; For removeEventListener: {handle -> {event-type -> [[listener-id callback] ...]}}
(defonce ^:private listener-index (atom {}))

(defn- register-listener!
  "Store a callback locally and return a unique listener-id."
  [handle event-type callback]
  (let [lid (str "l" (swap! next-listener-id inc))]
    (.set listener-callbacks lid callback)
    (swap! listener-index update-in [handle event-type]
           (fnil conj []) [lid callback])
    lid))

(defn- unregister-listener!
  "Remove a callback by identity and return its listener-id, or nil."
  [handle event-type callback]
  (let [entries (get-in @listener-index [handle event-type])
        match (some (fn [[lid cb]] (when (identical? cb callback) lid)) entries)]
    (when match
      (.delete listener-callbacks match)
      (swap! listener-index update-in [handle event-type]
             (fn [v] (vec (remove (fn [[lid _]] (= lid match)) v))))
      match)))

(defn- make-add-listener
  "Create the addEventListener handler for a given handle.
   Stores callback on worker, registers a forwarding stub on screen via `in`."
  [handle]
  (fn [event-type callback & _]
    (let [lid (register-listener! handle event-type callback)
          from (:id e/data)]
      (in-sync
       (in :screen
         (let [obj (cljs-thread.dom.registry/lookup handle)
               real-fn (fn [event]
                         (cljs-thread.dom.registry/post-dom-event
                          from lid (cljs-thread.dom.registry/extract-event event)))]
           (cljs-thread.dom.registry/store-listener! [handle event-type lid] real-fn)
           (.addEventListener obj event-type real-fn)))))
    js/undefined))

(defn- make-remove-listener
  "Create the removeEventListener handler for a given handle."
  [handle]
  (fn [event-type callback & _]
    (when-let [lid (unregister-listener! handle event-type callback)]
      (in-sync
       (in :screen
         (let [obj (cljs-thread.dom.registry/lookup handle)
               real-fn (cljs-thread.dom.registry/remove-listener! [handle event-type lid])]
           (when real-fn
             (.removeEventListener obj event-type real-fn))))))
    js/undefined))

;; Async dispatch handler: screen sends :dom-event when a real listener fires.
;; Wraps the callback in with-batch so all DOM writes and fire-and-forget
;; method calls (setAttribute, appendChild, style sets, etc.) within the
;; event handler are coalesced into a single `in :screen` round-trip.
;; createElement/createTextNode trigger flush-on-read (getter-method?) so
;; reagami render returns real element handles without leaving batch mode.
(defmethod m/dispatch :dom-event
  [{:keys [data]}]
  (let [{:keys [listener-id event-data]} data]
    (when-let [cb (.get listener-callbacks listener-id)]
      (let [evt #js {}]
        (unchecked-set evt "type" (:type event-data))
        (when-let [{:keys [handle type]} (:target event-data)]
          (unchecked-set evt "target" (wrap-proxy handle type)))
        (when-let [{:keys [handle type]} (:current-target event-data)]
          (unchecked-set evt "currentTarget" (wrap-proxy handle type)))
        (unchecked-set evt "preventDefault" (fn []))
        (unchecked-set evt "stopPropagation" (fn []))
        (with-batch #(cb evt))))))

;; ============ requestAnimationFrame / cancelAnimationFrame ============
;;
;; rAF callbacks stay on the worker. Screen registers a real rAF that
;; posts the timestamp back to the worker via :dom-raf message.

(defn- make-raf-fn
  "Create the requestAnimationFrame handler for a given handle (window).
   Stores callback on worker, registers forwarding rAF on screen."
  [handle]
  (fn [callback]
    (let [cb-id (str "raf" (swap! next-listener-id inc))
          from (:id e/data)]
      (.set listener-callbacks cb-id callback)
      (if @batch-queue
        ;; Defer: fold registration into the batch flush RTT
        (do (swap! pending-raf-registrations conj {:cb-id cb-id :handle handle :from from})
            0)
        ;; No batch context: register on screen immediately
        (in-sync
         (in :screen
           (let [obj (cljs-thread.dom.registry/lookup handle)]
             (.requestAnimationFrame obj
               (fn [timestamp]
                 (cljs-thread.dom.registry/post-dom-raf from cb-id timestamp))))))))))

(defn- make-caf-fn
  "Create the cancelAnimationFrame handler for a given handle (window)."
  [handle]
  (fn [raf-id]
    (in-sync
     (in :screen
       (let [obj (cljs-thread.dom.registry/lookup handle)]
         (.cancelAnimationFrame obj raf-id))))))

;; Dispatch handler: screen sends :dom-raf when a real rAF fires.
;; Wraps the callback in with-batch so all DOM writes and fire-and-forget
;; method calls (canvas draw ops, SVG setAttribute, etc.) within the rAF
;; callback are coalesced into a single `in :screen` round-trip per frame.
(defonce ^:private raf-frame-count (atom 0))

(defmethod m/dispatch :dom-raf
  [{:keys [data]}]
  (let [{:keys [callback-id]} data
        cb (.get listener-callbacks callback-id)]
    (when cb
      (.delete listener-callbacks callback-id)  ;; rAF is one-shot
      (let [frame (swap! raf-frame-count inc)]
        ;; Use Date.now() from the worker rather than the screen's
        ;; DOMHighResTimeStamp — d3-timer schedules timers via performance.now()
        ;; relative to the worker's origin; the screen rAF timestamp is
        ;; DOMHighResTimeStamp relative to the page's origin and may differ.
        (with-batch #(cb (js/Date.now))
                    (str "rAF#" frame))))))

;; ============ Observer Constructors ============
;;
;; MutationObserver, ResizeObserver, IntersectionObserver all take a callback
;; in their constructor.  We cannot pass worker callbacks to the screen thread,
;; so we use the same pattern as addEventListener and rAF:
;;   1. Store callback on worker under a unique obs-id.
;;   2. Create the real observer on screen with an inline forwarding stub that
;;      calls post-dom-observer(from, obs-id, serialized-records).
;;   3. Worker receives :dom-observer and calls the stored callback.
;;
;; The returned value is a proxy to the screen-side observer object.
;; .observe(), .unobserve(), .disconnect(), .takeRecords() go through the
;; regular method-proxy machinery (no callback serialization needed there).

(def ^:private observer-types
  #{"MutationObserver" "ResizeObserver" "IntersectionObserver"})

(defn- make-observer-constructor
  "Create a constructible proxy for a callback-based DOM observer type.
   Only valid for the window handle (handle 0).
   The user callback stays on the worker; the screen gets a forwarding stub."
  [win-handle observer-type]
  (js/Proxy.
   (js/Function.)
   #js {:construct
        (fn [_target args _new-target]
          (let [callback  (aget args 0)
                obs-id    (str "obs" (swap! next-listener-id inc))
                from      (:id e/data)]
            (.set listener-callbacks obs-id callback)
            (let [result
                  (in-sync
                   (in :screen
                     (let [win     (cljs-thread.dom.registry/lookup win-handle)
                           ObsCtor (unchecked-get win observer-type)]
                       (cljs-thread.dom.registry/result->wire
                        (js/Reflect.construct
                         ObsCtor
                         (array
                          (fn [records]
                            (cljs-thread.dom.registry/post-dom-observer
                             from obs-id observer-type records))))))))]
              (unwrap-result result))))
        :apply
        (fn [_target _this _args]
          ;; Called as a plain function rather than a constructor — return nil.
          nil)}))

(defn- convert-mutation-record
  "Reconstruct a worker-side mutation record object from serialized wire data."
  [rec]
  (let [obj #js {}]
    (unchecked-set obj "type" (:type rec))
    (when-let [{:keys [handle type]} (:target rec)]
      (unchecked-set obj "target" (wrap-proxy handle type)))
    (let [added (to-array (mapv #(wrap-proxy (:handle %) (:type %))
                                (:added-nodes rec)))]
      (unchecked-set obj "addedNodes" added))
    (let [removed (to-array (mapv #(wrap-proxy (:handle %) (:type %))
                                  (:removed-nodes rec)))]
      (unchecked-set obj "removedNodes" removed))
    (when-let [attr (:attribute-name rec)]
      (unchecked-set obj "attributeName" attr))
    (when-let [old (:old-value rec)]
      (unchecked-set obj "oldValue" old))
    obj))

(defn- convert-resize-entry
  "Reconstruct a worker-side resize entry from serialized wire data."
  [entry]
  (let [obj #js {}]
    (when-let [{:keys [handle type]} (:target entry)]
      (unchecked-set obj "target" (wrap-proxy handle type)))
    (when-let [{:keys [width height top left right bottom]} (:content-rect entry)]
      (let [r #js {}]
        (unchecked-set r "width"  width)
        (unchecked-set r "height" height)
        (unchecked-set r "top"    top)
        (unchecked-set r "left"   left)
        (unchecked-set r "right"  right)
        (unchecked-set r "bottom" bottom)
        (unchecked-set obj "contentRect" r)))
    obj))

(defn- convert-intersection-entry
  "Reconstruct a worker-side intersection entry from serialized wire data."
  [entry]
  (let [obj #js {}]
    (when-let [{:keys [handle type]} (:target entry)]
      (unchecked-set obj "target" (wrap-proxy handle type)))
    (unchecked-set obj "isIntersecting"   (:is-intersecting entry))
    (unchecked-set obj "intersectionRatio" (:intersection-ratio entry))
    (when-let [{:keys [width height top left]} (:intersection-rect entry)]
      (let [r #js {}]
        (unchecked-set r "width"  width) (unchecked-set r "height" height)
        (unchecked-set r "top"    top)   (unchecked-set r "left"   left)
        (unchecked-set obj "intersectionRect" r)))
    obj))

;; Dispatch handler: screen sends :dom-observer when a real observer fires.
(defmethod m/dispatch :dom-observer
  [{:keys [data]}]
  (let [{:keys [observer-id record-type records]} data]
    (when-let [cb (.get listener-callbacks observer-id)]
      (let [converted (case record-type
                        "mutation"
                        (to-array (mapv convert-mutation-record records))
                        "resize"
                        (to-array (mapv convert-resize-entry records))
                        "intersection"
                        (to-array (mapv convert-intersection-entry records))
                        (array))]
        (cb converted nil)))))

;; ============ Native Worker Globals ============
;;
;; JavaScript built-ins that exist natively in workers and should NOT be
;; proxied to the screen thread. When an npm library captures
;; `global = window` and then does `global.Promise`, `global.setTimeout`,
;; etc., we return the native worker value directly — no screen roundtrip,
;; no function serialization, full closure preservation.

(def ^:private native-worker-globals
  #{"Promise" "Array" "Object" "Map" "Set" "WeakMap" "WeakSet" "WeakRef"
    "Date" "RegExp" "Error" "TypeError" "RangeError" "ReferenceError"
    "SyntaxError" "URIError" "EvalError" "AggregateError"
    "Symbol" "JSON" "Math" "Reflect" "Proxy"
    "Number" "String" "Boolean" "Function" "BigInt"
    "parseInt" "parseFloat" "isNaN" "isFinite" "NaN" "Infinity" "undefined"
    "encodeURI" "encodeURIComponent" "decodeURI" "decodeURIComponent"
    "setTimeout" "clearTimeout" "setInterval" "clearInterval"
    "queueMicrotask" "structuredClone"
    "console" "fetch" "crypto" "performance"
    "TextEncoder" "TextDecoder" "TextDecoderStream" "TextEncoderStream"
    "URL" "URLSearchParams" "URLPattern"
    "Headers" "Request" "Response"
    "Blob" "File" "FileReader" "FormData"
    "ArrayBuffer" "SharedArrayBuffer" "DataView"
    "Uint8Array" "Uint16Array" "Uint32Array"
    "Int8Array" "Int16Array" "Int32Array"
    "Float32Array" "Float64Array" "BigInt64Array" "BigUint64Array"
    "Uint8ClampedArray"
    "atob" "btoa"
    "AbortController" "AbortSignal"
    "MessageChannel" "MessagePort"
    "EventTarget" "Event" "CustomEvent"
    "ReadableStream" "WritableStream" "TransformStream"
    "CompressionStream" "DecompressionStream"
    "WebSocket" "XMLHttpRequest"
    "Worker" "SharedWorker"
    "Intl" "Atomics"
    "FinalizationRegistry"
    "Iterator" "AsyncIterator"
    "OffscreenCanvas" "OffscreenCanvasRenderingContext2D"
    "ImageBitmap" "ImageData"
    "Path2D" "DOMMatrix" "DOMPoint" "DOMRect"
    "Cache" "CacheStorage"
    "IndexedDB" "IDBFactory" "IDBDatabase" "IDBTransaction"
    "IDBObjectStore" "IDBIndex" "IDBCursor" "IDBKeyRange"
    "BroadcastChannel" "Crypto" "CryptoKey" "SubtleCrypto"})

;; ============ Proxy Factory ============

(defn wrap-proxy
  "Create or retrieve a Proxy for the given handle.
   Uses a cache to ensure identity: same handle = same Proxy object."
  [handle node-type]
  ;; Check cache first
  (if-let [cached (.get proxy-cache handle)]
    cached
    ;; Create new proxy
    (let [target (js-obj)
          _ (unchecked-set target "__dom_handle" handle)
          _ (unchecked-set target "__dom_type" (or node-type "Node"))

          handler
          #js {:get
               (fn [_target prop _receiver]
                 (cond
                   ;; Internal metadata — fast path, no screen call
                   (= prop "__dom_handle") handle
                   (= prop "__dom_type") (unchecked-get target "__dom_type")
                   (= prop "__is_dom_proxy") true

                   ;; "then" — must return undefined so Promises don't treat proxy as thenable
                   (= prop "then") js/undefined

                   ;; Event listener methods — local + in pattern
                   (= prop "addEventListener")
                   (make-add-listener handle)

                   (= prop "removeEventListener")
                   (make-remove-listener handle)

                   ;; requestAnimationFrame / cancelAnimationFrame
                   ;; Callbacks stay on worker, screen forwards timestamps
                   (= prop "requestAnimationFrame")
                   (make-raf-fn handle)

                   (= prop "cancelAnimationFrame")
                   (make-caf-fn handle)

                   ;; Observer constructors (MutationObserver, ResizeObserver,
                   ;; IntersectionObserver) — callbacks stay on worker.
                   ;; Only applies to the window handle; element proxies never
                   ;; own a MutationObserver property.
                   (and (= handle reg/WINDOW-HANDLE)
                        (contains? observer-types prop))
                   (make-observer-constructor handle prop)

                   ;; Native JS globals — return worker-local value, skip proxy.
                   ;; Only for the window proxy (handle 0). Prevents npm libs
                   ;; that capture `global = window` from routing Promise,
                   ;; setTimeout, etc. through the screen thread.
                   (and (= handle reg/WINDOW-HANDLE)
                        (contains? native-worker-globals prop)
                        (some? (unchecked-get js/self prop)))
                   (unchecked-get js/self prop)

                   ;; Keyword-derived properties — stored locally on proxy target
                   (and (string? prop) (.startsWith prop ":"))
                   (unchecked-get target prop)

                   ;; Strategy 1: shadow cache — values written through this proxy.
                   ;; Returns the last-written primitive without a screen round-trip.
                   ;; Checked before the local-target cache so a later primitive write
                   ;; is visible even if the local cache holds an older complex value.
                   ;; Item 9: covers all primitive property sets (textContent, className,
                   ;; value, etc.), not just setAttribute — the SET trap shadows all of them.
                   (and (string? prop) (not= (shadow-get handle prop) ::miss))
                   (do (unchecked-set bc "hits" (inc (unchecked-get bc "hits")))
                       (shadow-get handle prop))

                   ;; Locally cached non-DOM value — return from target without screen roundtrip.
                   ;; Complex JS objects (e.g. d3 __transition, framework internals) that
                   ;; can't be structured-cloned are stored locally by the set trap.
                   (and (string? prop)
                        (.call js/Object.prototype.hasOwnProperty target prop))
                   (unchecked-get target prop)

                   ;; String properties — query screen via `in`.
                   ;; Strategy 2 (flush-on-read): if inside a batch window, flush any
                   ;; pending writes together with this read in a single round-trip.
                   ;; Reaching here = shadow miss on a property read (not a method call).
                   (string? prop)
                   (let [_ (unchecked-set bc "misses" (inc (unchecked-get bc "misses")))
                         result (if @batch-queue
                                  (let [pending     @batch-queue
                                        pending-json (when (pos? (.-length pending))
                                                       (js/JSON.stringify pending))]
                                    (reset! batch-queue #js [])
                                    (in-sync
                                     (in :screen
                                       (let [_ (cljs-thread.dom.registry/exec-write-ops! pending-json)
                                             obj (cljs-thread.dom.registry/lookup handle)
                                             raw (when obj (unchecked-get obj prop))]
                                         (cljs-thread.dom.registry/result->wire raw)))))
                                  (in-sync
                                   (in :screen
                                     (let [obj (cljs-thread.dom.registry/lookup handle)
                                           raw (when obj (unchecked-get obj prop))]
                                       (cljs-thread.dom.registry/result->wire raw)))))]
                     (cond
                       ;; Function property — return a method wrapper and cache it locally.
                       ;; DOM methods are stable (never reassigned), so caching eliminates
                       ;; the in-sync round-trip on every subsequent access of the same method.
                       ;; This is critical for canvas 2D context where clearRect, beginPath,
                       ;; moveTo, etc. are called hundreds of times per animation frame.
                       (and (map? result) (:fn? result))
                       (let [method (make-method-fn handle prop)]
                         (unchecked-set target prop method)
                         method)

                       ;; Everything else (handles, arrays, primitives, nil)
                       :else
                       (unwrap-result result)))

                   ;; Non-string props (symbols, etc.) — return undefined
                   :else js/undefined))

               :set
               (fn [_target prop value _receiver]
                 (when (string? prop)
                   (cond
                     ;; Keyword-derived property — store locally
                     (.startsWith prop ":")
                     (unchecked-set target prop value)

                     ;; Event handler property (onclick, oninput, etc.)
                     (and (.startsWith prop "on")
                          (or (fn? value) (nil? value)))
                     (let [event-type (subs prop 2)
                           old-fn (unchecked-get target prop)]
                       ;; Remove previous listener if any
                       (when old-fn
                         (when-let [lid (unregister-listener! handle event-type old-fn)]
                           (in-sync
                            (in :screen
                              (let [obj (cljs-thread.dom.registry/lookup handle)
                                    real-fn (cljs-thread.dom.registry/remove-listener!
                                             [handle event-type lid])]
                                (when real-fn
                                  (.removeEventListener obj event-type real-fn)))))))
                       ;; Store new handler locally
                       (unchecked-set target prop value)
                       ;; Register new listener if non-nil
                       (when value
                         (let [lid (register-listener! handle event-type value)
                               from (:id e/data)]
                           (in-sync
                            (in :screen
                              (let [obj (cljs-thread.dom.registry/lookup handle)
                                    real-fn (fn [event]
                                              (cljs-thread.dom.registry/post-dom-event
                                               from lid
                                               (cljs-thread.dom.registry/extract-event event)))]
                                (cljs-thread.dom.registry/store-listener!
                                 [handle event-type lid] real-fn)
                                (.addEventListener obj event-type real-fn)))))))

                     ;; Real DOM property — send to screen (or queue if batching)
                     :else
                     (let [wire-val (to-wire value)]
                       ;; Complex JS object (to-wire returned it unchanged, typeof "object"):
                       ;; store locally on proxy target to avoid DataCloneError in postMessage.
                       ;; Covers d3 __transition objects, React/Vue fiber refs, etc.
                       (if (and (identical? wire-val value)
                                (some? wire-val)
                                (identical? (js* "typeof ~{}" wire-val) "object"))
                         (unchecked-set target prop wire-val)
                         ;; Primitive, null, or handle map — safe to forward to screen.
                         (do
                           ;; Strategy 1: shadow primitive writes so reads can skip screen.
                           (when (primitive-wire? wire-val)
                             (shadow-set! handle prop wire-val))
                           (if @batch-queue
                             ;; Batch mode: queue the write
                             (.push @batch-queue #js ["set" handle prop wire-val])
                             ;; Normal mode: sync write
                             (in-sync
                              (in :screen
                                (let [obj (cljs-thread.dom.registry/lookup handle)
                                      resolved (cljs-thread.dom.registry/from-wire wire-val)]
                                  (when obj
                                    (unchecked-set obj prop resolved)))))))))))
                 true)

               :has
               (fn [_target prop]
                 (if (string? prop)
                   (let [result (in-sync
                                 (in :screen
                                   (let [obj (cljs-thread.dom.registry/lookup handle)]
                                     (when obj
                                       (some? (unchecked-get obj prop))))))]
                     (boolean result))
                   false))

               :deleteProperty
               (fn [_target prop]
                 (when (string? prop)
                   (in-sync
                    (in :screen
                      (let [obj (cljs-thread.dom.registry/lookup handle)]
                        (when obj
                          (js-delete obj prop))))))
                 true)

               :getPrototypeOf
               (fn [_target]
                 ;; Return synthetic DOM prototype for instanceof checks.
                 ;; Constructors are installed on globalThis by dom/constructors.
                 ;; Map concrete type names (HTMLDivElement, etc.) to our
                 ;; synthetic hierarchy: Node < Element < HTMLElement.
                 (let [type-hint (unchecked-get target "__dom_type")
                       ctor-name (cond
                                   (nil? type-hint) nil
                                   ;; Exact matches for Document
                                   (or (= type-hint "Document")
                                       (= type-hint "HTMLDocument"))
                                   "Document"
                                   ;; Window — no synthetic constructor yet
                                   (= type-hint "Window") nil
                                   ;; Any HTML*Element → HTMLElement
                                   (and (string? type-hint)
                                        (.startsWith type-hint "HTML"))
                                   "HTMLElement"
                                   ;; SVG, MathML, etc → Element
                                   :else "Element")]
                   (when-let [ctor (and ctor-name
                                        (unchecked-get js/globalThis ctor-name))]
                     (.-prototype ctor))))}

          proxy (js/Proxy. target handler)]
      (.set proxy-cache handle proxy)
      proxy)))

(defn document-proxy
  "Create a Proxy for the document object (handle 1)."
  []
  (wrap-proxy reg/DOCUMENT-HANDLE "Document"))

(defn window-proxy
  "Create a Proxy for the window object (handle 0)."
  []
  (wrap-proxy reg/WINDOW-HANDLE "Window"))

(defn is-dom-proxy?
  "Check if an object is a DOM proxy."
  [obj]
  (and (some? obj)
       (true? (try (unchecked-get obj "__is_dom_proxy") (catch :default _ false)))))

(defn handle-of
  "Get the handle of a DOM proxy, or nil if not a proxy."
  [obj]
  (when (is-dom-proxy? obj)
    (unchecked-get obj "__dom_handle")))
