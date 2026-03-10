(ns cljs-thread.go
  "Runtime support for implicit go blocks with parking deref.

   park-deref checks whether a value is a cljs-thread derefable (satisfies IDable).
   If so, it resolves it asynchronously via the existing request/resolve path
   instead of blocking with Atomics.wait. If not, it derefs synchronously.

   go-body wraps a CPS-transformed body, ensuring the result is always a Promise
   so that do-call/do-future can detect and chain on it."
  (:require
    [clojure.edn :as edn]
    [cljs-thread.id :refer [get-id]]
    [cljs-thread.sync :as sync]))

(def ^:private sab-header-bytes
  "Must match sync.cljs sab-header-bytes (8 bytes = two Int32 slots)."
  8)

(defn- poll-sync-channel
  "Poll a direct SAB sync channel until signaled, then resolve with the result.
   Uses setTimeout polling to avoid blocking the event loop.
   in-id is the request identifier used to look up the result in the response-atom map.

   Handles both delivery modes set by sync/deliver-response:
     status 1 — result encoded inline as pr-str UTF-8 bytes in the SAB
     status 2 — result stored in the response-atom map keyed by in-id"
  [sync-channel in-id resolve reject]
  (let [{:keys [signal-sab response-atom]} sync-channel
        signal-i32 (js/Int32Array. signal-sab)]
    (letfn [(poll []
              (let [status (js/Atomics.load signal-i32 0)]
                (cond
                  ;; Status 1: result encoded inline in SAB
                  (= status 1)
                  (let [byte-len   (js/Atomics.load signal-i32 1)
                        plain-buf  (js/ArrayBuffer. byte-len)
                        plain-view (js/Uint8Array. plain-buf)
                        _          (.set plain-view (js/Uint8Array. signal-sab sab-header-bytes byte-len))
                        result     (edn/read-string
                                     (.decode (js/TextDecoder.) plain-view))]
                    (sync/release-signal-sab! signal-sab)
                    (if (and (map? result) (:error result))
                      (reject (ex-info "Error in remote call" {:result result}))
                      (resolve result)))

                  ;; Status 2: result in response-atom
                  (= status 2)
                  (let [result (get @response-atom in-id)]
                    (swap! response-atom dissoc in-id)
                    (sync/release-signal-sab! signal-sab)
                    (if (and (map? result) (:error result))
                      (reject (ex-info "Error in remote call" {:result result}))
                      (resolve result)))

                  ;; Not yet signaled — poll again
                  :else
                  (js/setTimeout poll 0))))]
      (poll))))

(defn park-deref
  "If x carries the __cljs_thread_parkable__ tag (set by wrap-derefable),
   resolve it asynchronously by calling request with {:resolve callback}.
   Otherwise, deref x synchronously.
   Calls continuation with the resolved value. Returns a Promise.
   The explicit tag prevents any non-cljs-thread derefable from being
   mistakenly routed through the async parking path."
  [^js x continuation]
  (if (true? (.-__cljs_thread_parkable__ x))
    ;; Tagged cljs-thread derefable → async resolve
    (if (and (satisfies? IPending x) (-realized? x))
      ;; Already resolved — fast path, no async overhead
      (let [val (deref x)]
        (js/Promise.resolve (continuation val)))
      ;; Not yet resolved — check for direct SAB sync channel first
      (if-let [sync-ch (.-__cljs_thread_sync_channel__ x)]
        ;; Direct SAB sync: poll the sync channel until signaled
        ;; Pass in-id (the object is wrapping the id) to extract correct result from response-atom
        (let [in-id (get-id x)]
          (-> (js/Promise.
                (fn [resolve reject]
                  (poll-sync-channel sync-ch in-id resolve reject)))
              (.then continuation)))
        ;; Legacy path: use async request (SW fallback)
        (let [id (get-id x)]
          (-> (js/Promise.
                (fn [resolve reject]
                  (sync/request id {:resolve resolve :reject reject})))
              (.then (fn [result]
                       (if (and (map? result) (:error result))
                         (throw (ex-info "Error in remote call"
                                         {:result (pr-str result)}))
                         (continuation result))))))))
    ;; Not a tagged parkable → deref synchronously and continue
    (js/Promise.resolve (continuation (deref x)))))

(defn chain
  "Chain a continuation onto a value that may be a Promise.
   If v is a Promise, uses .then. Otherwise wraps in Promise.resolve."
  [v continuation]
  (if (instance? js/Promise v)
    (.then v continuation)
    (js/Promise.resolve (continuation v))))

(defn applier
  "Continuation combinator: (applier f a b) returns (fn [val] (f val a b)).
   Used by the CPS transform when the deref result appears as the first
   argument to a function call, avoiding an inline fn definition that would
   trigger the CLJS compiler's loop-capture IIFE wrapping."
  [f & trailing-args]
  (fn [val] (apply f val trailing-args)))

(defn go-body
  "Wraps a CPS-transformed body function. Calls body-fn which returns
   either a plain value or a Promise. Ensures the result is always a
   Promise so callers (do-call, do-future) can detect async go results."
  [body-fn]
  (try
    (let [result (body-fn)]
      (if (instance? js/Promise result)
        result
        (js/Promise.resolve result)))
    (catch :default e
      (js/Promise.reject e))))

(defn promise-catch
  "Attach a catch handler to a go-body result (which is always a Promise).
   Used by the CPS transform for try/catch forms."
  [promise-val catch-fn]
  (let [p (if (instance? js/Promise promise-val)
            promise-val
            (js/Promise.resolve promise-val))]
    (.catch p (fn [err]
                (let [result (catch-fn err)]
                  (if (instance? js/Promise result)
                    result
                    (js/Promise.resolve result)))))))

(defn promise-finally
  "Attach a finally handler to a go-body result.
   Used by the CPS transform for try/finally forms."
  [promise-val finally-fn]
  (let [p (if (instance? js/Promise promise-val)
            promise-val
            (js/Promise.resolve promise-val))]
    (.finally p finally-fn)))

;; ---------------------------------------------------------------------------
;; Parking HOF variants — cross fn boundaries for whitelisted higher-order fns
;; ---------------------------------------------------------------------------

(defn- ensure-promise
  "If v is a Promise, return it. Otherwise wrap in Promise.resolve."
  [v]
  (if (instance? js/Promise v)
    v
    (js/Promise.resolve v)))

(defn park-map
  "Parking variant of map/mapv. Applies f to each element of coll.
   f may return a Promise (from CPS-transformed body with park-deref).
   All applications run concurrently via Promise.all. Returns a Promise<vector>."
  [f coll]
  (let [promises (mapv (fn [item] (ensure-promise (f item))) coll)]
    (-> (js/Promise.all (clj->js promises))
        (.then (fn [arr] (vec (js->clj arr)))))))

(defn park-filter
  "Parking variant of filter/filterv. Applies pred to each element of coll.
   pred may return a Promise<bool>. Runs concurrently. Returns Promise<vector>."
  [pred coll]
  (let [promises (mapv (fn [item]
                         (-> (ensure-promise (pred item))
                             (.then (fn [keep?] #js [item keep?]))))
                       coll)]
    (-> (js/Promise.all (clj->js promises))
        (.then (fn [pairs]
                 (let [pairs (js->clj pairs)]
                   (vec (keep (fn [pair]
                                (let [item (nth pair 0)
                                      keep? (nth pair 1)]
                                  (when keep? item)))
                              pairs))))))))

(defn park-remove
  "Parking variant of remove. Inverse of park-filter."
  [pred coll]
  (park-filter (fn [item]
                 (-> (ensure-promise (pred item))
                     (.then not)))
               coll))

(defn park-keep
  "Parking variant of keep. Like park-map but drops nil results."
  [f coll]
  (let [promises (mapv (fn [item] (ensure-promise (f item))) coll)]
    (-> (js/Promise.all (clj->js promises))
        (.then (fn [arr]
                 (vec (cljs.core/keep identity (js->clj arr))))))))

(defn park-run!
  "Parking variant of run!. Applies f to each element for side effects.
   Runs concurrently. Returns Promise<nil>."
  [f coll]
  (let [promises (mapv (fn [item] (ensure-promise (f item))) coll)]
    (-> (js/Promise.all (clj->js promises))
        (.then (fn [_] nil)))))

(defn park-reduce
  "Parking variant of reduce. Applies f sequentially (not parallel)
   because each step depends on the accumulator from the prior step.
   f may return a Promise. Returns Promise<accumulated-value>."
  ([f coll]
   (if (empty? coll)
     (js/Promise.resolve (f))
     (park-reduce f (first coll) (rest coll))))
  ([f init coll]
   (reduce (fn [promise-acc item]
             (.then promise-acc
                    (fn [acc]
                      (ensure-promise (f acc item)))))
           (js/Promise.resolve init)
           coll)))

(defn park-some
  "Parking variant of some. Applies pred sequentially, short-circuits
   on first truthy result. Returns Promise<first-truthy-or-nil>."
  [pred coll]
  (if (empty? coll)
    (js/Promise.resolve nil)
    (reduce (fn [promise-acc item]
              (.then promise-acc
                     (fn [found]
                       (if found
                         found ;; short-circuit: already found truthy
                         (ensure-promise (pred item))))))
            (js/Promise.resolve nil)
            coll)))
