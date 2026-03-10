(ns cljs-thread.go
  "Compile-time partial CPS transform for implicit go blocks.

   Rewrites (deref expr) forms — i.e. @expr — into (cljs-thread.go/park-deref expr (fn [val] ...))
   continuations so that cljs-thread derefables park (via Promises) instead of blocking
   (via Atomics.wait). Synchronous code between deref points is left untouched.

   Stops rewriting at fn/fn*/letfn/reify/deftype boundaries — @expr inside those
   falls back to blocking deref, same constraint as core.async's go macro.")

;; ---------------------------------------------------------------------------
;; Detection: does the body contain (deref ...) outside fn boundaries?
;; ---------------------------------------------------------------------------

(def ^:private fn-boundary-ops
  "Forms that create new execution contexts — the CPS transform stops here."
  #{'fn 'fn* 'letfn 'letfn* 'reify 'deftype 'defrecord})

;; ---------------------------------------------------------------------------
;; HOF fn-boundary crossing
;;
;; Normally the CPS transform stops at fn boundaries. For a whitelist of known
;; higher-order functions (map, mapv, filter, reduce, etc.), we can cross the
;; boundary because we know their calling convention and can wrap them in
;; Promise-aware variants.
;; ---------------------------------------------------------------------------

(def ^:private parallel-hofs
  "HOFs where all applications are independent — can use Promise.all."
  #{'map 'mapv 'clojure.core/map 'clojure.core/mapv
    'cljs.core/map 'cljs.core/mapv
    'filter 'filterv 'clojure.core/filter 'clojure.core/filterv
    'cljs.core/filter 'cljs.core/filterv
    'remove 'clojure.core/remove 'cljs.core/remove
    'keep 'clojure.core/keep 'cljs.core/keep
    'run! 'clojure.core/run! 'cljs.core/run!})

(def ^:private sequential-hofs
  "HOFs where each step depends on the prior — must chain sequentially."
  #{'reduce 'clojure.core/reduce 'cljs.core/reduce
    'some 'clojure.core/some 'cljs.core/some})

(def ^:private all-hofs
  "Union of all whitelisted HOFs."
  (into parallel-hofs sequential-hofs))

(def ^:private parking-producers
  "Operator symbols whose call forms produce cljs-thread derefables.
   Only (deref (one-of-these ...)) triggers the CPS parking transform.
   For custom producers, annotate the target with ^:park metadata."
  #{'in          'cljs-thread.in/in
    'do-in       'cljs-thread.in/do-in
    'future      'cljs-thread.future/future
    'do-future   'cljs-thread.future/do-future
    'spawn       'cljs-thread.spawn/spawn
    'do-spawn    'cljs-thread.spawn/do-spawn})

(defn- deref-form?
  "True if form is (deref expr) where expr is a known cljs-thread
   derefable producer.  Only matches when the deref'd expression is
   a call whose operator is in `parking-producers`, OR when the target
   carries ^:park metadata.

   Matches:
     (deref (in :root x))              → in is a parking-producer   ✓
     (deref (future expr))             → future is a parking-producer ✓
     (deref ^:park (my-remote x))      → ^:park metadata             ✓
   Does NOT match:
     (deref my-atom)                   → symbol, not a call          ✗
     (deref (atom 42))                 → atom not in whitelist       ✗
     (deref (get-something x))         → not in whitelist            ✗"
  [form]
  (and (seq? form)
       (let [op (first form)]
         (or (= op 'deref)
             (= op 'clojure.core/deref)
             (= op 'cljs.core/deref)))
       (let [target (second form)]
         (and (seq? target)
              (or (contains? parking-producers (first target))
                  (:park (meta target)))))))

(defn- fn-boundary?
  "True if form is a fn-boundary — we don't rewrite inside these."
  [form]
  (and (seq? form)
       (contains? fn-boundary-ops (first form))))

(defn- has-deref-deep?
  "Walk form looking for (deref ...) even inside fn boundaries.
   Used by hof-with-deref-fn? to check if a fn body contains deref."
  [form]
  (cond
    (deref-form? form) true
    (coll? form) (some has-deref-deep? form)
    :else false))

(defn- hof-with-deref-fn?
  "True if form is (hof-name (fn [...] ...deref...) coll ...).
   The fn arg must contain a deref for this to matter."
  [form]
  (and (seq? form)
       (contains? all-hofs (first form))
       (let [fn-arg (second form)]
         (and (seq? fn-arg)
              (contains? #{'fn 'fn*} (first fn-arg))
              ;; Look inside the fn body for deref — ignore the fn boundary
              (let [fn-body (if (vector? (second fn-arg))
                              ;; (fn [args] body...)
                              (nthrest fn-arg 2)
                              ;; (fn name [args] body...) or (fn ([args] body...))
                              (if (symbol? (second fn-arg))
                                (nthrest fn-arg 3)
                                ;; multi-arity — check all bodies
                                (mapcat rest (rest fn-arg))))]
                (some has-deref-deep? fn-body))))))

(defn has-deref?
  "Walk form looking for (deref ...) outside fn boundaries.
   Also returns true for whitelisted HOFs with deref inside their fn arg
   (those can cross the fn boundary via parking HOF variants)."
  [form]
  (cond
    (deref-form? form) true
    (hof-with-deref-fn? form) true
    (fn-boundary? form) false
    (coll? form) (some has-deref? form)
    :else false))

(defn body-has-deref?
  "True if any form in the body seq contains a parkable deref."
  [body]
  (some has-deref? body))

;; ---------------------------------------------------------------------------
;; CPS Transform
;;
;; The transform walks the body and, at each (deref expr) point, splits the
;; remaining computation into a continuation function. The result is nested
;; (cljs-thread.go/park-deref expr (fn [val] ...rest...)) calls.
;;
;; Supported forms: do, let/let*, if, when, when-not, when-let, if-let,
;;                  cond, try/catch/finally, and/or.
;; ---------------------------------------------------------------------------

(declare transform-expr)
(declare transform-call)
(declare transform-collection-vec)
(declare transform-hof)

;; ---------------------------------------------------------------------------
;; Continuation combinators — targeted defunctionalization
;;
;; Instead of always emitting (fn [val] body) for CPS continuations, we
;; pattern-match on the continuation shape and emit combinator *calls*
;; (e.g. identity, :keyword, partial, applier) when possible.
;;
;; Inside a loop (dotimes, etc.) the CLJS compiler wraps fn *definitions*
;; in IIFEs to capture mutable loop variables.  Combinator calls are just
;; function *calls* — no fn literal in the source ⇒ no IIFE wrapping.
;; ---------------------------------------------------------------------------

(defn- contains-symbol?
  "True if form contains sym anywhere (deep walk)."
  [form sym]
  (cond
    (= form sym) true
    (coll? form) (some #(contains-symbol? % sym) form)
    :else false))

(def ^:private special-ops
  "Forms that are NOT first-class callable values."
  #{'if 'do 'let 'let* 'loop 'loop* 'recur 'throw 'new 'try 'catch
    'finally 'var 'set! 'quote 'fn 'fn* 'def 'defn 'ns 'deftype 'defrecord
    'deftype* 'defrecord* 'js*})

(defn- callable-sym?
  "True if sym can be used as a first-class function value —
   i.e. it is a symbol that is not a special form or interop call."
  [sym]
  (and (symbol? sym)
       (not (contains? special-ops sym))
       (not (.startsWith (name sym) "."))))

(defn- emit-continuation
  "Try to emit a combinator call instead of (fn [val-sym] body).
   Returns either a combinator form (no fn definition in source) or
   an inline (fn [val-sym] body) as fallback.

   Patterns (in priority order):
     (fn [v] v)              → cljs.core/identity
     (fn [v] (:k v))         → :k              (keywords are fns)
     (fn [v] (f v))          → f               (single-arg call)
     (fn [v] (f a b v))      → (partial f a b) (val as last arg)
     (fn [v] (f v a b))      → (applier f a b) (val as first arg)
     otherwise               → (fn [v] body)   (fallback)"
  [val-sym body]
  (cond
    ;; Identity: (fn [v] v)
    (= body val-sym)
    'cljs.core/identity

    ;; Keyword getter: (fn [v] (:k v)) → :k
    (and (seq? body)
         (= 2 (count body))
         (keyword? (first body))
         (= val-sym (second body)))
    (first body)

    ;; Single-arg fn call: (fn [v] (f v)) → f
    (and (seq? body)
         (= 2 (count body))
         (callable-sym? (first body))
         (= val-sym (second body))
         (not= val-sym (first body)))
    (first body)

    ;; Val as last arg: (fn [v] (f a ... v)) → (partial f a ...)
    (and (seq? body)
         (> (count body) 2)
         (callable-sym? (first body))
         (not= val-sym (first body))
         (= val-sym (last body))
         (not-any? #(contains-symbol? % val-sym) (butlast (rest body))))
    `(clojure.core/partial ~@(butlast body))

    ;; Val as first arg: (fn [v] (f v a ...)) → (applier f a ...)
    (and (seq? body)
         (> (count body) 2)
         (callable-sym? (first body))
         (not= val-sym (first body))
         (= val-sym (second body))
         (not-any? #(contains-symbol? % val-sym) (nthrest body 2)))
    `(cljs-thread.go/applier ~(first body) ~@(nthrest body 2))

    ;; Fallback: inline fn
    :else
    `(fn [~val-sym] ~body)))

(defn- transform-do
  "Transform a (do ...) form. Splits at the first statement containing a deref."
  [forms]
  (if (empty? forms)
    nil
    (if (= 1 (count forms))
      (transform-expr (first forms))
      (let [[pre [deref-stmt & post]] (split-with (complement has-deref?) forms)]
        (if-not deref-stmt
          ;; No deref in any statement — return as-is
          `(do ~@forms)
          (if (empty? pre)
            ;; First statement has a deref
            (if (deref-form? deref-stmt)
              ;; Statement IS a bare (deref expr) — transform and chain rest
              (let [val-sym (gensym "v_")
                    rest-expr (if (seq post)
                                (transform-do post)
                                nil)]
                `(cljs-thread.go/park-deref
                   ~(second deref-stmt)
                   ~(emit-continuation val-sym
                      (if rest-expr
                        rest-expr
                        val-sym))))
              ;; Statement contains deref deeper inside — transform the statement
              (let [transformed (transform-expr deref-stmt)]
                (if (seq post)
                  (if (has-deref? (cons 'do post))
                    ;; More derefs in post — need to chain
                    (let [val-sym (gensym "v_")]
                      `(cljs-thread.go/chain
                         ~transformed
                         ~(emit-continuation val-sym (transform-do post))))
                    ;; No more derefs in post — just chain synchronously
                    (let [val-sym (gensym "v_")]
                      `(cljs-thread.go/chain
                         ~transformed
                         ~(emit-continuation val-sym `(do ~@post)))))
                  transformed)))
            ;; Pre statements are deref-free; emit them, then handle deref-stmt
            (let [rest-transformed (transform-do (cons deref-stmt post))]
              `(do ~@pre ~rest-transformed))))))))

(defn- transform-let-bindings
  "Transform let bindings. Splits at the first binding whose init has a deref.
   Returns a form that chains park-deref calls with the body."
  [bindings body-forms]
  (let [pairs (partition 2 bindings)]
    (loop [done-pairs []
           remaining (seq pairs)]
      (if-not remaining
        ;; All bindings are deref-free — emit plain let with transformed body
        (let [body-transformed (transform-do body-forms)]
          (if (seq done-pairs)
            `(let ~(vec (mapcat identity done-pairs))
               ~body-transformed)
            body-transformed))
        (let [[sym init] (first remaining)
              rest-pairs (rest remaining)]
          (if-not (has-deref? init)
            ;; This binding is clean — accumulate and continue
            (recur (conj done-pairs [sym init]) (seq rest-pairs))
            ;; This binding has a deref — split here
            (let [;; Wrap the clean bindings done so far
                  inner (if (deref-form? init)
                          ;; init IS (deref expr) — park-deref directly into sym
                          (let [rest-form (transform-let-bindings
                                            (vec (mapcat identity rest-pairs))
                                            body-forms)]
                            `(cljs-thread.go/park-deref
                               ~(second init)
                               ~(emit-continuation sym rest-form)))
                          ;; init contains deref deeper — transform the init expr
                          ;; and chain the rest
                          (let [val-sym (gensym "init_")
                                rest-form (transform-let-bindings
                                            (vec (mapcat identity rest-pairs))
                                            body-forms)]
                            `(cljs-thread.go/chain
                               ~(transform-expr init)
                               ~(emit-continuation val-sym
                                  `(let [~sym ~val-sym]
                                     ~rest-form)))))]
              (if (seq done-pairs)
                `(let ~(vec (mapcat identity done-pairs))
                   ~inner)
                inner))))))))

(defn- transform-if
  "Transform (if test then else). Handles deref in test, then, or else."
  [test then else]
  (if (has-deref? test)
    ;; Deref in test — transform test, chain the if
    (if (deref-form? test)
      (let [val-sym (gensym "test_")]
        `(cljs-thread.go/park-deref
           ~(second test)
           ~(emit-continuation val-sym (transform-if val-sym then else))))
      (let [val-sym (gensym "test_")]
        `(cljs-thread.go/chain
           ~(transform-expr test)
           ~(emit-continuation val-sym (transform-if val-sym then else)))))
    ;; Test is clean — transform branches if needed
    (let [then* (if (has-deref? then) (transform-expr then) then)
          else* (if (has-deref? else) (transform-expr else) else)]
      `(if ~test ~then* ~else*))))

(defn- transform-when
  "Transform (when test & body)."
  [test body-forms]
  (transform-if test `(do ~@body-forms) nil))

(defn- transform-when-not
  "Transform (when-not test & body)."
  [test body-forms]
  (transform-if test nil `(do ~@body-forms)))

(defn- transform-when-let
  "Transform (when-let [sym init] & body)."
  [bindings body-forms]
  (let [[sym init] bindings]
    (if (has-deref? init)
      (if (deref-form? init)
        (let [val-sym (gensym "wl_")]
          `(cljs-thread.go/park-deref
             ~(second init)
             ~(emit-continuation val-sym
                `(when ~val-sym
                   (let [~sym ~val-sym]
                     ~(transform-do body-forms))))))
        (let [val-sym (gensym "wl_")]
          `(cljs-thread.go/chain
             ~(transform-expr init)
             ~(emit-continuation val-sym
                `(when ~val-sym
                   (let [~sym ~val-sym]
                     ~(transform-do body-forms)))))))
      `(when-let ~bindings
         ~(transform-do body-forms)))))

(defn- transform-if-let
  "Transform (if-let [sym init] then else)."
  [bindings then else]
  (let [[sym init] bindings]
    (if (has-deref? init)
      (if (deref-form? init)
        (let [val-sym (gensym "il_")]
          `(cljs-thread.go/park-deref
             ~(second init)
             ~(emit-continuation val-sym
                `(if ~val-sym
                   (let [~sym ~val-sym]
                     ~(if (has-deref? then) (transform-expr then) then))
                   ~(if (has-deref? else) (transform-expr else) else)))))
        (let [val-sym (gensym "il_")]
          `(cljs-thread.go/chain
             ~(transform-expr init)
             ~(emit-continuation val-sym
                `(if ~val-sym
                   (let [~sym ~val-sym]
                     ~(if (has-deref? then) (transform-expr then) then))
                   ~(if (has-deref? else) (transform-expr else) else))))))
      `(if-let ~bindings
         ~(if (has-deref? then) (transform-expr then) then)
         ~(if (has-deref? else) (transform-expr else) else)))))

(defn- transform-cond
  "Transform (cond & clauses). Rewrites as nested if/else."
  [clauses]
  (let [pairs (partition 2 clauses)]
    (reduce (fn [else-form [test expr]]
              (if (= test :else)
                (if (has-deref? expr) (transform-expr expr) expr)
                (transform-if test expr else-form)))
            nil
            (reverse pairs))))

(defn- transform-try
  "Transform (try & body+catch+finally).
   Wraps the go body in a Promise .catch for catch clauses."
  [forms]
  (let [body-forms (take-while #(not (and (seq? %) (contains? #{'catch 'finally} (first %)))) forms)
        catch-forms (filter #(and (seq? %) (= 'catch (first %))) forms)
        finally-forms (filter #(and (seq? %) (= 'finally (first %))) forms)]
    (if (and (empty? catch-forms) (empty? finally-forms))
      (transform-do (vec body-forms))
      (let [body-transformed (transform-do (vec body-forms))
            ;; Wrap in promise-try which uses .catch
            with-catch (if (seq catch-forms)
                         (let [;; Take the first catch clause
                               [_ exc-type exc-sym & catch-body] (first catch-forms)
                               catch-transformed (if (some has-deref? catch-body)
                                                   (transform-do (vec catch-body))
                                                   `(do ~@catch-body))]
                           `(cljs-thread.go/promise-catch
                              ~body-transformed
                              ~(emit-continuation exc-sym catch-transformed)))
                         body-transformed)
            with-finally (if (seq finally-forms)
                           (let [[_ & fin-body] (first finally-forms)]
                             `(cljs-thread.go/promise-finally
                                ~with-catch
                                (fn [] ~@fin-body)))
                           with-catch)]
        with-finally))))

;; ---------------------------------------------------------------------------
;; HOF transform — crosses fn boundaries for whitelisted higher-order fns
;; ---------------------------------------------------------------------------

(defn- parse-fn-form
  "Parse a (fn [args] body...) or (fn name [args] body...) form.
   Returns {:params [...] :body [...]}."
  [fn-form]
  (let [parts (rest fn-form) ;; drop 'fn
        [_name parts] (if (symbol? (first parts))
                        [(first parts) (rest parts)]
                        [nil parts])
        params (first parts)
        body (rest parts)]
    {:params params :body (vec body)}))

(defn- transform-hof-fn-body
  "CPS-transform the body of a fn inside a HOF call. The fn now returns
   a Promise (from the CPS chain). The parking HOF variant handles this."
  [fn-form]
  (let [{:keys [params body]} (parse-fn-form fn-form)
        transformed (transform-do body)]
    `(fn ~params ~transformed)))

(defn- hof-runtime-name
  "Map a HOF symbol to its parking runtime variant in cljs-thread.go."
  [op]
  (let [base (name op)]
    (case base
      ("map" "mapv")     'cljs-thread.go/park-map
      ("filter" "filterv") 'cljs-thread.go/park-filter
      "remove"           'cljs-thread.go/park-remove
      "keep"             'cljs-thread.go/park-keep
      "run!"             'cljs-thread.go/park-run!
      "reduce"           'cljs-thread.go/park-reduce
      "some"             'cljs-thread.go/park-some
      ;; Fallback — shouldn't happen given whitelist
      nil)))

(defn- transform-hof
  "Transform a whitelisted HOF call with a fn arg containing deref.
   Rewrites (mapv (fn [x] @(in :w x)) coll) to
   (cljs-thread.go/park-map (fn [x] ...CPS-body...) coll)."
  [form]
  (let [op (first form)
        fn-arg (second form)
        rest-args (nthrest form 2)
        runtime-fn (hof-runtime-name op)
        transformed-fn (transform-hof-fn-body fn-arg)]
    (if runtime-fn
      ;; Emit parking HOF variant
      (if (contains? sequential-hofs op)
        ;; Sequential HOFs (reduce, some) take (f init coll) or (f coll)
        `(~runtime-fn ~transformed-fn ~@rest-args)
        ;; Parallel HOFs (map, filter, etc.) take (f coll)
        `(~runtime-fn ~transformed-fn ~@rest-args))
      ;; No runtime fn — fall back to untransformed
      form)))

(defn transform-expr
  "Transform a single expression. Dispatches on the form type."
  [form]
  (cond
    ;; Not a collection or has no deref — return as-is
    (not (has-deref? form))
    form

    ;; Bare (deref expr) — park-deref with identity continuation
    (deref-form? form)
    `(cljs-thread.go/park-deref
       ~(second form)
       cljs.core/identity)

    ;; Whitelisted HOF with deref inside fn arg — cross the fn boundary
    (hof-with-deref-fn? form)
    (transform-hof form)

    ;; Fn boundary — don't transform inside
    (fn-boundary? form)
    form

    ;; Seq form — dispatch on operator
    (seq? form)
    (let [op (first form)]
      (case op
        do         (transform-do (vec (rest form)))
        let        (transform-let-bindings (second form) (nthrest form 2))
        let*       (transform-let-bindings (second form) (nthrest form 2))
        if         (transform-if (nth form 1) (nth form 2 nil) (nth form 3 nil))
        when       (transform-when (nth form 1) (nthrest form 2))
        when-not   (transform-when-not (nth form 1) (nthrest form 2))
        when-let   (transform-when-let (nth form 1) (nthrest form 2))
        if-let     (transform-if-let (nth form 1) (nth form 2 nil) (nth form 3 nil))
        cond       (transform-cond (rest form))
        try        (transform-try (rest form))
        ;; For any other form containing a deref deeper inside,
        ;; we need to extract the deref. Handle the common case:
        ;; (f ... (deref x) ...) → park-deref x, then (f ... val ...)
        (transform-call form)))

    ;; Vector, map, set containing deref
    (vector? form)
    (transform-collection-vec form)

    ;; Default — return as-is
    :else form))

(defn- transform-call
  "Transform a function call where one or more args contains a deref.
   Extracts deref args left-to-right into park-deref chains."
  [form]
  (let [op (first form)
        args (rest form)]
    (loop [done-args []
           remaining (seq args)]
      (if-not remaining
        ;; All args processed — nothing needed (shouldn't reach here)
        form
        (let [arg (first remaining)
              rest-args (rest remaining)]
          (if-not (has-deref? arg)
            (recur (conj done-args arg) rest-args)
            ;; This arg has a deref
            (if (deref-form? arg)
              ;; Arg IS (deref expr) — park-deref, bind val, reconstruct call
              (let [val-sym (gensym "a_")
                    rest-call (apply list op
                                (concat done-args [val-sym] rest-args))]
                `(cljs-thread.go/park-deref
                   ~(second arg)
                   ~(emit-continuation val-sym
                      (if (has-deref? rest-call)
                        (transform-expr rest-call)
                        rest-call))))
              ;; Arg contains deref deeper — transform arg, bind result
              (let [val-sym (gensym "a_")
                    rest-call (apply list op
                                (concat done-args [val-sym] rest-args))]
                `(cljs-thread.go/chain
                   ~(transform-expr arg)
                   ~(emit-continuation val-sym
                      (if (has-deref? rest-call)
                        (transform-expr rest-call)
                        rest-call)))))))))))

(defn- transform-collection-vec
  "Transform a vector literal containing deref forms.
   Extracts deref elements left-to-right."
  [v]
  (loop [done []
         remaining (seq v)]
    (if-not remaining
      v
      (let [elem (first remaining)
            rest-elems (rest remaining)]
        (if-not (has-deref? elem)
          (recur (conj done elem) rest-elems)
          (if (deref-form? elem)
            (let [val-sym (gensym "ve_")
                  rest-vec (vec (concat done [val-sym] rest-elems))]
              `(cljs-thread.go/park-deref
                 ~(second elem)
                 ~(emit-continuation val-sym
                    (if (has-deref? rest-vec)
                      (transform-collection-vec rest-vec)
                      rest-vec))))
            (let [val-sym (gensym "ve_")
                  rest-vec (vec (concat done [val-sym] rest-elems))]
              `(cljs-thread.go/chain
                 ~(transform-expr elem)
                 ~(emit-continuation val-sym
                    (if (has-deref? rest-vec)
                      (transform-collection-vec rest-vec)
                      rest-vec))))))))))

;; ---------------------------------------------------------------------------
;; Public API (used by in.clj, future.clj, spawn.clj)
;; ---------------------------------------------------------------------------

(defn transform-body
  "Apply the CPS transform to a body of forms.
   Returns the body unchanged if no parkable deref is found.
   When deref is found, inlines a try/catch/Promise wrapper around the
   CPS-transformed code.  This avoids creating a (fn [] ...) thunk that
   would trigger the ClojureScript compiler's loop-fn IIFE optimisation
   when the body appears inside dotimes or similar loop constructs.

   If opts contains {:go? false}, skips the CPS transform and forces
   blocking deref semantics (Atomics.wait) instead of parking (Promise)."
  ([body] (transform-body body nil))
  ([body opts]
   (if (false? (:go? opts))
     ;; User explicitly requested blocking - skip CPS transform
     {:body body :go? false}
     (if-not (body-has-deref? body)
       {:body body :go? false}
       (let [cps (transform-do (vec body))
             r   (gensym "go_r__")
             e   (gensym "go_e__")]
         {:body [(list 'try
                       (list 'let [r cps]
                             (list 'if (list 'instance? 'js/Promise r)
                                   r
                                   (list '.resolve 'js/Promise r)))
                       (list 'catch :default e
                             (list '.reject 'js/Promise e)))]
          :go? true})))))
