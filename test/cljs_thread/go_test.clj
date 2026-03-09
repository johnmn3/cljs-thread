(ns cljs-thread.go-test
  (:require
   [clojure.test :refer [deftest is testing]]
   [cljs-thread.go :as go]))

;; Helper: transform a single-form body and return the pr-str'd CPS output
(defn- xform [form]
  (let [{:keys [body go?]} (go/transform-body [form])]
    {:go? go? :s (pr-str body)}))

;; Helper: check that no inline fn forms appear in the CPS output
(defn- fn-free? [s]
  (not (re-find #"\((?:clojure.core/)?fn \[" s)))

;; =========================================================================
;; Detection tests
;; =========================================================================

(deftest has-deref?-test
  (testing "detects deref of whitelisted producer"
    (is (go/has-deref? '(deref (in :root x))))
    (is (go/has-deref? '(deref (future expr))))
    (is (go/has-deref? '(deref (spawn expr))))
    (is (go/has-deref? '(clojure.core/deref (in :root x))))
    (is (go/has-deref? '(cljs.core/deref (in :root x)))))
  (testing "detects nested deref of whitelisted producer"
    (is (go/has-deref? '(+ 1 (deref (in :root x)))))
    (is (go/has-deref? '(let [a (deref (in :root x))] a))))
  (testing "returns falsy for no deref"
    (is (not (go/has-deref? '(+ 1 2))))
    (is (not (go/has-deref? 'x)))
    (is (not (go/has-deref? 42))))
  (testing "returns falsy for deref of plain symbol (not a producer call)"
    (is (not (go/has-deref? '(deref x))))
    (is (not (go/has-deref? '(deref my-atom))))
    (is (not (go/has-deref? '(deref s/future-pool)))))
  (testing "returns falsy for deref of non-whitelisted call"
    (is (not (go/has-deref? '(deref (atom 42)))))
    (is (not (go/has-deref? '(deref (get-value x)))))
    (is (not (go/has-deref? '(deref (my-remote-fn y))))))
  (testing "^:park metadata overrides whitelist"
    (is (go/has-deref? '(deref ^:park (my-custom-producer x)))))
  (testing "stops at fn boundaries"
    (is (not (go/has-deref? '(fn [] (deref (in :root x))))))
    (is (not (go/has-deref? '(fn* [] (deref (in :root x))))))
    (is (not (go/has-deref? '(letfn [(f [] (deref (in :root x)))] (f)))))
    (is (not (go/has-deref? '(reify IDeref (-deref [_] (deref (in :root x)))))))))

(deftest body-has-deref?-test
  (testing "checks body seq"
    (is (go/body-has-deref? ['(deref (in :root x))]))
    (is (go/body-has-deref? ['(+ 1 2) '(deref (in :root x))]))
    (is (not (go/body-has-deref? ['(+ 1 2) '(+ 3 4)]))))
  (testing "body with non-whitelisted deref is not detected"
    (is (not (go/body-has-deref? ['(deref (atom 42))])))))

;; =========================================================================
;; Whitelist strictness tests — verify non-producers are rejected
;; =========================================================================

(deftest deref-form-rejects-non-producers-test
  (testing "deref of plain symbol never triggers CPS"
    (let [{:keys [go?]} (go/transform-body ['(deref my-atom)])]
      (is (not go?))))
  (testing "deref of non-whitelisted call never triggers CPS"
    (let [{:keys [go?]} (go/transform-body ['(deref (atom 42))])]
      (is (not go?)))
    (let [{:keys [go?]} (go/transform-body ['(deref (get-value x))])]
      (is (not go?)))
    (let [{:keys [go?]} (go/transform-body ['(deref (create-promise args))])]
      (is (not go?))))
  (testing "^:park metadata allows custom producers"
    (let [{:keys [body go?]} (go/transform-body ['(deref ^:park (my-custom-call x))])]
      (is go?)
      (is (.contains (pr-str body) "park-deref")))))

(deftest all-whitelisted-producers-test
  (testing "each parking-producer symbol is recognized"
    (doseq [producer '[in future spawn do-in do-future do-spawn
                       cljs-thread.in/in cljs-thread.future/future
                       cljs-thread.spawn/spawn cljs-thread.in/do-in
                       cljs-thread.future/do-future cljs-thread.spawn/do-spawn]]
      (is (go/has-deref? (list 'deref (list producer :root 'x)))
          (str "parking-producer " producer " should be detected")))))

;; =========================================================================
;; Transform tests — verify the CPS structure
;; =========================================================================

(deftest transform-body-no-deref-test
  (testing "body without deref is returned unchanged"
    (let [{:keys [body go?]} (go/transform-body ['(+ 1 2)])]
      (is (not go?))
      (is (= ['(+ 1 2)] body)))))

(deftest transform-body-bare-deref-test
  (testing "bare (deref (in :root x)) gets wrapped in park-deref"
    (let [{:keys [body go?]} (go/transform-body ['(deref (in :root x))])]
      (is go?)
      (is (= 1 (count body)))
      ;; Body is inlined as a try/catch/Promise wrapper (not go-body thunk)
      ;; to avoid IIFE wrapping inside loops
      (let [outer (first body)]
        (is (= 'try (first outer))))
      ;; The CPS should use identity combinator instead of (fn [v] v)
      (let [form-str (pr-str body)]
        (is (.contains form-str "park-deref"))
        (is (.contains form-str "identity"))))))

(deftest transform-let-with-deref-test
  (testing "let binding with deref in init splits correctly"
    (let [{:keys [body go?]} (go/transform-body ['(let [x (deref (in :root d))] (+ x 1))])]
      (is go?)
      ;; The transformed body should contain park-deref for 'd'
      ;; Continuation (+ x 1) is defunctionalized to (applier + 1)
      ;; since val-sym x is the first arg
      (let [form-str (pr-str body)]
        (is (.contains form-str "park-deref"))
        (is (.contains form-str "applier"))))))

(deftest transform-let-mixed-bindings-test
  (testing "let with mixed deref and non-deref bindings"
    (let [{:keys [body go?]} (go/transform-body
                               ['(let [a 1
                                       x (deref (in :root d))
                                       b (+ a 2)]
                                   (+ a x b))])]
      (is go?)
      (let [form-str (pr-str body)]
        ;; 'a' should be in a plain let before park-deref
        (is (.contains form-str "park-deref"))
        ;; 'b' should be in a let after the continuation binds 'x'
        (is (.contains form-str "+ a x b"))))))

(deftest transform-do-with-deref-test
  (testing "do form with deref in a statement"
    (let [{:keys [body go?]} (go/transform-body
                               ['(do (println "before")
                                     (deref (in :root d))
                                     (println "after"))])]
      (is go?)
      (let [form-str (pr-str body)]
        (is (.contains form-str "park-deref"))
        (is (.contains form-str "println"))))))

(deftest transform-if-with-deref-test
  (testing "if with deref in test"
    (let [{:keys [body go?]} (go/transform-body
                               ['(if (deref (in :root d)) "yes" "no")])]
      (is go?)
      (let [form-str (pr-str body)]
        (is (.contains form-str "park-deref")))))
  (testing "if with deref in branch"
    (let [{:keys [body go?]} (go/transform-body
                               ['(if true (deref (in :root d)) "no")])]
      (is go?)
      (let [form-str (pr-str body)]
        (is (.contains form-str "park-deref"))))))

(deftest transform-fn-boundary-test
  (testing "deref inside fn passed to whitelisted HOF IS transformed (HOF crossing)"
    ;; map/mapv are whitelisted — fn boundary is crossed
    (let [{:keys [body go?]} (go/transform-body
                               ['(map (fn [x] (deref (in :root x))) items)])]
      (is go?)
      (is (.contains (pr-str body) "park-map"))))
  (testing "deref inside fn passed to NON-whitelisted fn is NOT transformed"
    (let [{:keys [body go?]} (go/transform-body
                               ['(my-custom-fn (fn [x] (deref (in :root x))) items)])]
      (is (not go?))))
  (testing "deref outside fn boundary IS transformed"
    (let [{:keys [body go?]} (go/transform-body
                               ['(let [x (deref (in :root d))]
                                   (map (fn [i] (+ i x)) items))])]
      (is go?))))

(deftest transform-call-with-deref-arg-test
  (testing "function call with deref as an argument"
    (let [{:keys [body go?]} (go/transform-body
                               ['(+ 1 (deref (in :root d)))])]
      (is go?)
      (let [form-str (pr-str body)]
        (is (.contains form-str "park-deref"))))))

(deftest transform-sequential-derefs-test
  (testing "multiple sequential derefs in let"
    (let [{:keys [body go?]} (go/transform-body
                               ['(let [x (deref (in :root d1))
                                       y (deref (in :root d2))]
                                   (+ x y))])]
      (is go?)
      (let [form-str (pr-str body)]
        ;; Should have two nested park-deref calls
        (is (= 2 (count (re-seq #"park-deref" form-str))))))))

(deftest transform-nested-let-deref-test
  (testing "deref deeper in let init expression"
    (let [{:keys [body go?]} (go/transform-body
                               ['(let [x (+ 1 (deref (in :root d)))]
                                   (* x 2))])]
      (is go?)
      (let [form-str (pr-str body)]
        (is (.contains form-str "park-deref"))))))

(deftest transform-try-catch-test
  (testing "try/catch with deref in try body"
    (let [{:keys [body go?]} (go/transform-body
                               ['(try (deref (in :root d))
                                      (catch Exception e :error))])]
      (is go?)
      (let [form-str (pr-str body)]
        (is (.contains form-str "park-deref"))
        (is (.contains form-str "promise-catch"))))))

(deftest transform-cond-test
  (testing "cond with deref in a clause"
    (let [{:keys [body go?]} (go/transform-body
                               ['(cond
                                   true (deref (in :root d))
                                   :else "default")])]
      (is go?)
      (let [form-str (pr-str body)]
        (is (.contains form-str "park-deref"))))))

(deftest transform-when-test
  (testing "when with deref in body"
    (let [{:keys [body go?]} (go/transform-body
                               ['(when true (deref (in :root d)))])]
      (is go?)
      (let [form-str (pr-str body)]
        (is (.contains form-str "park-deref"))))))

(deftest transform-when-let-test
  (testing "when-let with deref in init"
    (let [{:keys [body go?]} (go/transform-body
                               ['(when-let [x (deref (in :root d))] (+ x 1))])]
      (is go?)
      (let [form-str (pr-str body)]
        (is (.contains form-str "park-deref"))))))

;; =========================================================================
;; HOF fn-boundary crossing tests
;; =========================================================================

(deftest hof-map-with-deref-detected-test
  (testing "mapv with fn containing deref is detected as parkable"
    (is (go/has-deref? '(mapv (fn [x] (deref (in :root x))) items)))
    (is (go/has-deref? '(map (fn [x] (deref (in :root x))) items)))))

(deftest hof-filter-with-deref-detected-test
  (testing "filter with fn containing deref is detected"
    (is (go/has-deref? '(filter (fn [x] (deref (in :root x))) items)))))

(deftest hof-reduce-with-deref-detected-test
  (testing "reduce with fn containing deref is detected"
    (is (go/has-deref? '(reduce (fn [acc x] (+ acc (deref (in :root x)))) 0 items)))))

(deftest hof-without-deref-not-detected-test
  (testing "HOF without deref in fn is NOT detected"
    (is (not (go/has-deref? '(mapv (fn [x] (inc x)) items))))
    (is (not (go/has-deref? '(filter (fn [x] (odd? x)) items))))))

(deftest non-hof-fn-boundary-still-stops-test
  (testing "fn with deref passed to non-whitelisted fn still stops at boundary"
    (is (not (go/has-deref? '(my-custom-fn (fn [x] (deref (in :root x))) items))))))

(deftest transform-hof-map-test
  (testing "mapv with fn containing deref transforms to park-map"
    (let [{:keys [body go?]} (go/transform-body
                               ['(mapv (fn [x] (deref (in :root x))) items)])]
      (is go?)
      (let [form-str (pr-str body)]
        (is (.contains form-str "park-map"))
        (is (.contains form-str "park-deref"))))))

(deftest transform-hof-filter-test
  (testing "filter with fn containing deref transforms to park-filter"
    (let [{:keys [body go?]} (go/transform-body
                               ['(filter (fn [x] (deref (in :root x))) items)])]
      (is go?)
      (let [form-str (pr-str body)]
        (is (.contains form-str "park-filter"))
        (is (.contains form-str "park-deref"))))))

(deftest transform-hof-reduce-test
  (testing "reduce with fn containing deref transforms to park-reduce"
    (let [{:keys [body go?]} (go/transform-body
                               ['(reduce (fn [acc x] (+ acc (deref (in :root x)))) 0 items)])]
      (is go?)
      (let [form-str (pr-str body)]
        (is (.contains form-str "park-reduce"))
        (is (.contains form-str "park-deref"))))))

(deftest transform-hof-nested-deref-test
  (testing "mapv with deeper deref in fn body transforms correctly"
    (let [{:keys [body go?]} (go/transform-body
                               ['(mapv (fn [x] (+ 1 (deref (in :root x)))) items)])]
      (is go?)
      (let [form-str (pr-str body)]
        (is (.contains form-str "park-map"))))))

(deftest transform-hof-in-let-test
  (testing "HOF inside let with other parking derefs"
    (let [{:keys [body go?]} (go/transform-body
                               ['(let [result (mapv (fn [i] (deref (in :root i))) items)]
                                   result)])]
      (is go?)
      (let [form-str (pr-str body)]
        (is (.contains form-str "park-map"))))))

;; =========================================================================
;; Continuation combinator tests — targeted defunctionalization
;;
;; These test the emit-continuation pattern matcher which replaces
;; (fn [v] body) with combinator CALLS (identity, :kw, partial, applier)
;; to avoid the CLJS compiler IIFE-wrapping fn definitions inside loops.
;; =========================================================================

;; ---- Identity pattern: (fn [v] v) → cljs.core/identity ----

(deftest combinator-identity-bare-deref
  (testing "bare @(in :root expr) emits identity — no fn in output"
    (let [{:keys [go? s]} (xform '(deref (in :root x)))]
      (is go?)
      (is (.contains s "identity"))
      (is (fn-free? s)))))

(deftest combinator-identity-do-single-deref
  (testing "(do @(in ..)) single-form do emits identity"
    (let [{:keys [go? s]} (xform '(do (deref (in :root x))))]
      (is go?)
      (is (.contains s "identity"))
      (is (fn-free? s)))))

(deftest combinator-identity-let-bare
  (testing "(let [x @(in ..)] x) identity through let"
    (let [{:keys [go? s]} (xform '(let [x (deref (in :root d))] x))]
      (is go?)
      ;; The let desugars: park-deref d with continuation for x → body is just x
      ;; Since rest-form = x = sym, emit-continuation should produce identity
      (is (.contains s "identity"))
      (is (fn-free? s)))))

;; ---- Keyword getter: (fn [v] (:k v)) → :k ----

(deftest combinator-keyword-simple
  (testing "(:ping @(in ..)) emits :ping as continuation"
    (let [{:keys [go? s]} (xform '(:ping (deref (in :root x))))]
      (is go?)
      (is (.contains s "park-deref"))
      (is (fn-free? s)))))

(deftest combinator-keyword-in-let
  (testing "(let [v @(in ..)] (:hello v)) emits :hello"
    (let [{:keys [go? s]} (xform '(let [v (deref (in :root my-atom))] (:hello v)))]
      (is go?)
      (is (fn-free? s)))))

(deftest combinator-keyword-namespaced
  (testing "namespaced keyword (:app/name @(in ..)) emits :app/name"
    (let [{:keys [go? s]} (xform '(:app/name (deref (in :root config))))]
      (is go?)
      (is (fn-free? s)))))

;; ---- Single-arg fn call: (fn [v] (f v)) → f ----

(deftest combinator-single-arg-inc
  (testing "(inc @(in ..)) emits inc"
    (let [{:keys [go? s]} (xform '(inc (deref (in :root x))))]
      (is go?)
      (is (fn-free? s)))))

(deftest combinator-single-arg-str
  (testing "(str @(in ..)) emits str"
    (let [{:keys [go? s]} (xform '(str (deref (in :root x))))]
      (is go?)
      (is (fn-free? s)))))

(deftest combinator-single-arg-not
  (testing "(not @(in ..)) emits not"
    (let [{:keys [go? s]} (xform '(not (deref (in :root x))))]
      (is go?)
      (is (fn-free? s)))))

(deftest combinator-single-arg-in-let
  (testing "(let [v @(in ..)] (process v)) emits process"
    (let [{:keys [go? s]} (xform '(let [v (deref (in :root d))] (process v)))]
      (is go?)
      (is (fn-free? s)))))

(deftest combinator-single-arg-qualified
  (testing "(clojure.core/inc @(in ..)) qualified symbol still matches"
    (let [{:keys [go? s]} (xform '(clojure.core/inc (deref (in :root x))))]
      (is go?)
      (is (fn-free? s)))))

;; ---- Partial (val as last arg): (fn [v] (f a b v)) → (partial f a b) ----

(deftest combinator-partial-plus
  (testing "(+ 1 @(in ..)) emits (partial + 1)"
    (let [{:keys [go? s]} (xform '(+ 1 (deref (in :root x))))]
      (is go?)
      (is (.contains s "partial"))
      (is (fn-free? s)))))

(deftest combinator-partial-conj
  (testing "(conj [1 2] @(in ..)) emits (partial conj [1 2])"
    (let [{:keys [go? s]} (xform '(conj [1 2] (deref (in :root x))))]
      (is go?)
      (is (.contains s "partial"))
      (is (fn-free? s)))))

(deftest combinator-partial-swap-atom
  (testing "swap! with @(in ..) as last arg — (swap! my-atom assoc :k @(in ..))"
    (let [{:keys [go? s]} (xform '(swap! my-atom assoc :key (deref (in :root x))))]
      (is go?)
      (is (.contains s "partial"))
      (is (fn-free? s)))))

(deftest combinator-partial-assoc
  (testing "(assoc {} :key @(in ..)) emits partial"
    (let [{:keys [go? s]} (xform '(assoc {} :key (deref (in :root x))))]
      (is go?)
      (is (.contains s "partial"))
      (is (fn-free? s)))))

(deftest combinator-partial-three-args
  (testing "(assoc m :a 1 :b @(in ..)) val as last of many"
    (let [{:keys [go? s]} (xform '(assoc m :a 1 :b (deref (in :root x))))]
      (is go?)
      (is (.contains s "partial"))
      (is (fn-free? s)))))

;; ---- Applier (val as first arg): (fn [v] (f v a b)) → (applier f a b) ----

(deftest combinator-applier-assoc
  (testing "(let [v @(in ..)] (assoc v :key 1)) emits applier"
    (let [{:keys [go? s]} (xform '(let [v (deref (in :root x))] (assoc v :key 1)))]
      (is go?)
      (is (.contains s "applier"))
      (is (fn-free? s)))))

(deftest combinator-applier-get
  (testing "(let [v @(in ..)] (get v :key)) emits applier"
    (let [{:keys [go? s]} (xform '(let [v (deref (in :root x))] (get v :key)))]
      (is go?)
      (is (.contains s "applier"))
      (is (fn-free? s)))))

(deftest combinator-applier-update-in
  (testing "(let [v @(in ..)] (update-in v [:a :b] inc)) emits applier"
    (let [{:keys [go? s]} (xform '(let [v (deref (in :root x))] (update-in v [:a :b] inc)))]
      (is go?)
      (is (.contains s "applier"))
      (is (fn-free? s)))))

(deftest combinator-applier-conj
  (testing "(let [coll @(in ..)] (conj coll :new-item)) emits applier"
    (let [{:keys [go? s]} (xform '(let [coll (deref (in :root x))] (conj coll :new-item)))]
      (is go?)
      (is (.contains s "applier"))
      (is (fn-free? s)))))

;; ---- Fallback: complex body → (fn [v] body) ----

(deftest combinator-fallback-if-body
  (testing "if in body falls back to inline fn"
    (let [{:keys [go? s]} (xform '(let [a (deref (in :root d))] (if (pos? a) a (- a))))]
      (is go?)
      (is (.contains s "park-deref"))
      ;; Must have an inline fn for the if
      (is (re-find #"\((?:clojure.core/)?fn \[" s)))))

(deftest combinator-fallback-multiple-val-uses
  (testing "val-sym used twice falls back — (+ v v)"
    (let [{:keys [go? s]} (xform '(let [x (deref (in :root d))] (+ x x)))]
      (is go?)
      (is (re-find #"\((?:clojure.core/)?fn \[" s)))))

(deftest combinator-fallback-interop
  (testing ".method call falls back — cannot pass interop as first-class fn"
    (let [{:keys [go? s]} (xform '(.toString (deref (in :root x))))]
      (is go?)
      (is (re-find #"\((?:clojure.core/)?fn \[" s)))))

(deftest combinator-fallback-val-in-fn-position
  (testing "val used as function falls back — (let [f @(in ..)] (f 1 2))"
    (let [{:keys [go? s]} (xform '(let [f (deref (in :root x))] (f 1 2)))]
      (is go?)
      (is (re-find #"\((?:clojure.core/)?fn \[" s)))))

(deftest combinator-fallback-zero-arg-call
  (testing "val called with no args falls back — (let [f @(in ..)] (f))"
    (let [{:keys [go? s]} (xform '(let [f (deref (in :root x))] (f)))]
      (is go?)
      (is (re-find #"\((?:clojure.core/)?fn \[" s)))))

(deftest combinator-fallback-new-form
  (testing "new is a special form — (new Foo @(in ..)) falls back"
    (let [{:keys [go? s]} (xform '(new Foo (deref (in :root x))))]
      (is go?)
      (is (re-find #"\((?:clojure.core/)?fn \[" s)))))

(deftest combinator-fallback-val-in-middle
  (testing "val in middle arg position falls back — (f a @(in ..) b)"
    ;; (f a @(in ..) b) — @(in ..) is the second argument
    ;; After transform-call: rest-call = (f a val-sym b)
    ;; val-sym is neither last nor second-element → fallback
    (let [{:keys [go? s]} (xform '(replace-at items (deref (in :root idx)) :new-val))]
      (is go?)
      ;; This can't match partial (val not last) or applier (val not second)
      (is (re-find #"\((?:clojure.core/)?fn \[" s)))))

;; =========================================================================
;; Real-world pattern tests — simulating what in/future/spawn macros see
;;
;; These test the actual body forms that go/transform-body receives after
;; macro argument parsing. Each test documents which macro/entry-point
;; the pattern corresponds to.
;; =========================================================================

;; ---- Pattern: @(in :root [my-atom] (:hello @(in :worker my-atom))) ----
;; The `in` macro parses this into body = [(:hello (deref (in :worker my-atom)))]

(deftest real-world-atom-field-access
  (testing "deref producer → keyword access (most common eve pattern)"
    (let [{:keys [go? s]} (xform '(:hello (deref (in :worker my-atom))))]
      (is go?)
      (is (.contains s "park-deref"))
      ;; :hello used directly as continuation
      (is (fn-free? s)))))

;; ---- Pattern: @(in :root [source target] (swap! target assoc :data @(in :worker source))) ----

(deftest real-world-swap-with-derefed-value
  (testing "swap! with derefed value as last arg → partial"
    (let [{:keys [go? s]} (xform '(swap! target assoc :data (deref (in :worker source))))]
      (is go?)
      (is (.contains s "partial"))
      (is (fn-free? s)))))

;; ---- Pattern: @(in :root (let [v @(in :worker expr)] (swap! other assoc :x v))) ----

(deftest real-world-let-deref-then-swap
  (testing "let-deref then swap with val as last arg"
    (let [{:keys [go? s]} (xform '(let [v (deref (in :worker my-atom))]
                                     (swap! other assoc :x v)))]
      (is go?)
      (is (.contains s "park-deref"))
      ;; continuation body is (swap! other assoc :x v), v is last → partial
      (is (.contains s "partial"))
      (is (fn-free? s)))))

;; ---- Pattern: @(in :root (let [c @(in :worker config)] (assoc c :updated true))) ----

(deftest real-world-let-deref-then-assoc-first-arg
  (testing "let-deref then assoc with val as first arg → applier"
    (let [{:keys [go? s]} (xform '(let [c (deref (in :worker config))]
                                     (assoc c :updated true)))]
      (is go?)
      (is (.contains s "park-deref"))
      (is (.contains s "applier"))
      (is (fn-free? s)))))

;; ---- Pattern: @(in :root (let [v @(in :worker my-atom)] (get v :name))) ----

(deftest real-world-let-deref-then-get
  (testing "let-deref then get → applier"
    (let [{:keys [go? s]} (xform '(let [v (deref (in :worker my-atom))]
                                     (get v :name)))]
      (is go?)
      (is (.contains s "applier"))
      (is (fn-free? s)))))

;; ---- Pattern: @(future (+ 1 @(future (+ 2 3)))) ----
;; Body for outer future: [(+ 1 (deref (future (+ 2 3))))]

(deftest real-world-nested-future-add
  (testing "nested future: (+ 1 @(future ..)) → partial"
    (let [{:keys [go? s]} (xform '(+ 1 (deref (future (+ 2 3)))))]
      (is go?)
      (is (.contains s "partial"))
      (is (fn-free? s)))))

;; ---- Pattern: deeply chained derefs ----

(deftest real-world-deeply-nested-futures
  (testing "4 chained derefs: each deref nests, inner partial, outer fns"
    (let [{:keys [go? s]} (xform '(let [a (deref (in :root d1))
                                         b (deref (in :root d2))
                                         c (deref (in :root d3))
                                         d (deref (in :root d4))]
                                     (+ a b c d)))]
      (is go?)
      ;; 4 park-deref calls in chain
      (is (= 4 (count (re-seq #"park-deref" s)))))))

;; ---- Pattern: @(in :root [atoms] (let [a @(in :w x) b @(in :w y)] (+ a b))) ----

(deftest real-world-two-atom-combine
  (testing "let with two derefs then combine — inner partial, outer fn"
    (let [{:keys [go? s]} (xform '(let [a (deref (in :worker atom-x))
                                         b (deref (in :worker atom-y))]
                                     (+ a b)))]
      (is go?)
      (is (= 2 (count (re-seq #"park-deref" s))))
      ;; Inner continuation (+ a b): val-sym=b, last arg → (partial + a)
      (is (.contains s "partial")))))

;; ---- Pattern: @(in worker (let [v @(in :root my-atom)] (update-in v [:app :db :users :count] + 5))) ----

(deftest real-world-update-in-derefed-atom
  (testing "update-in on derefed atom value — applier"
    (let [{:keys [go? s]} (xform '(let [v (deref (in :root my-atom))]
                                     (update-in v [:app :db :users :count] + 5)))]
      (is go?)
      (is (.contains s "applier"))
      (is (fn-free? s)))))

;; ---- Pattern: bodies WITHOUT deref (dotimes, doseq, plain swap!) ----
;; These should NOT trigger CPS at all

(deftest real-world-no-deref-dotimes
  (testing "dotimes without deref → no CPS transform"
    (let [{:keys [go?]} (xform '(dotimes [_ 3] (swap! my-atom update :counter inc)))]
      (is (not go?)))))

(deftest real-world-no-deref-doseq
  (testing "doseq without deref → no CPS transform"
    (let [{:keys [go?]} (xform '(doseq [x items] (println x)))]
      (is (not go?)))))

(deftest real-world-no-deref-swap
  (testing "swap! without deref → no CPS transform"
    (let [{:keys [go?]} (xform '(swap! my-atom update :counter inc))]
      (is (not go?)))))

(deftest real-world-no-deref-reset
  (testing "reset! without deref → no CPS transform"
    (let [{:keys [go?]} (xform '(reset! my-atom {:new "data"}))]
      (is (not go?)))))

(deftest real-world-no-deref-fn-boundary
  (testing "deref inside fn boundary → no CPS (stops at fn)"
    (let [{:keys [go?]} (xform '(fn [x] (deref (in :root x))))]
      (is (not go?)))))

;; ---- Pattern: deref then loop (deref BEFORE the loop, not inside) ----

(deftest real-world-deref-before-loop
  (testing "deref in let then dotimes in body — CPS splits at deref"
    (let [{:keys [go? s]} (xform '(let [config (deref (in :root config-atom))]
                                     (dotimes [_ 3]
                                       (swap! my-atom assoc :config config))))]
      (is go?)
      (is (.contains s "park-deref"))
      ;; The dotimes is in the rest body, not transformed by CPS
      (is (.contains s "dotimes")))))

;; ---- Pattern: multiple derefs in do sequence ----

(deftest real-world-sequential-do-derefs
  (testing "three sequential bare derefs in do"
    (let [{:keys [go? s]} (xform '(do (deref (in :root x))
                                       (deref (in :root y))
                                       (deref (in :root z))))]
      (is go?)
      ;; Should chain all three
      (is (= 3 (count (re-seq #"park-deref" s)))))))

;; ---- Pattern: deref + side effects + return ----

(deftest real-world-deref-side-effect-return
  (testing "deref → side effect → return value"
    (let [{:keys [go? s]} (xform '(let [v (deref (in :root my-atom))]
                                     (println "got" v)
                                     (:result v)))]
      (is go?)
      (is (.contains s "park-deref"))
      (is (.contains s "println")))))

;; ---- Pattern: cond dispatching on derefed value ----

(deftest real-world-cond-on-deref
  (testing "cond on derefed value — complex body falls back"
    (let [{:keys [go? s]} (xform '(let [v (deref (in :root flag-atom))]
                                     (cond
                                       (= v :ready) "go"
                                       (= v :error) "fail"
                                       :else "wait")))]
      (is go?)
      (is (.contains s "park-deref")))))

;; ---- Pattern: when-let with deref init ----

(deftest real-world-when-let-deref-access
  (testing "when-let with deref then keyword access"
    (let [{:keys [go? s]} (xform '(when-let [data (deref (in :root maybe-atom))]
                                     (:result data)))]
      (is go?)
      (is (.contains s "park-deref")))))

;; ---- Pattern: if-let with deref init ----

(deftest real-world-if-let-deref
  (testing "if-let with deref"
    (let [{:keys [go? s]} (xform '(if-let [v (deref (in :root maybe-atom))]
                                     (:value v)
                                     :default))]
      (is go?)
      (is (.contains s "park-deref")))))

;; ---- Pattern: try/catch around deref ----

(deftest real-world-try-catch-deref
  (testing "try/catch wrapping a deref"
    (let [{:keys [go? s]} (xform '(try
                                     (let [v (deref (in :root risky))] (:data v))
                                     (catch :default e {:error (str e)})))]
      (is go?)
      (is (.contains s "park-deref"))
      (is (.contains s "promise-catch")))))

;; ---- Pattern: HOF crossing with deref in map ----

(deftest real-world-mapv-deref-identity
  (testing "mapv with bare deref — identity inside park-map"
    (let [{:keys [go? s]} (xform '(mapv (fn [x] (deref (in :root x))) items))]
      (is go?)
      (is (.contains s "park-map"))
      (is (.contains s "identity")))))

(deftest real-world-map-deref-plus
  (testing "map with deref then add — partial inside park-map"
    (let [{:keys [go? s]} (xform '(mapv (fn [x] (+ 10 (deref (in :root x)))) items))]
      (is go?)
      (is (.contains s "park-map"))
      (is (.contains s "partial")))))

;; ---- Pattern: reduce with deref (sequential HOF) ----

(deftest real-world-reduce-deref
  (testing "reduce with deref in accumulation"
    (let [{:keys [go? s]} (xform '(reduce (fn [acc x] (+ acc (deref (in :root x)))) 0 items))]
      (is go?)
      (is (.contains s "park-reduce"))
      (is (.contains s "park-deref")))))

;; ---- Pattern: filter with deref in predicate ----

(deftest real-world-filter-deref
  (testing "filter with deref in predicate"
    (let [{:keys [go? s]} (xform '(filter (fn [x] (deref (in :root x))) items))]
      (is go?)
      (is (.contains s "park-filter"))
      (is (.contains s "identity")))))

;; ---- Pattern: run! with deref side effects ----

(deftest real-world-run-deref
  (testing "run! with deref in fn body"
    (let [{:keys [go? s]} (xform '(run! (fn [x] (deref (in :root x))) items))]
      (is go?)
      (is (.contains s "park-run!"))
      (is (.contains s "identity")))))

;; ---- Pattern: some with deref ----

(deftest real-world-some-deref
  (testing "some with deref in predicate"
    (let [{:keys [go? s]} (xform '(some (fn [x] (deref (in :root x))) items))]
      (is go?)
      (is (.contains s "park-some"))
      (is (.contains s "identity")))))

;; ---- Pattern: vector with deref elements ----

(deftest real-world-vector-with-derefs
  (testing "vector literal with deref elements"
    (let [{:keys [go? s]} (xform '[(deref (in :root x)) (deref (in :root y))])]
      (is go?)
      (is (= 2 (count (re-seq #"park-deref" s)))))))

;; =========================================================================
;; Edge case tests — tricky patterns, nesting, boundary conditions
;; =========================================================================

;; ---- Chained combinator interaction ----

(deftest edge-chained-derefs-inner-partial
  (testing "two derefs: inner gets partial, outer must use fn"
    (let [{:keys [go? s]} (xform '(let [a (deref (in :root x))
                                         b (deref (in :root y))]
                                     (+ a b)))]
      (is go?)
      ;; Inner (+ a b) with val-sym=b → (partial + a) ← combinator
      (is (.contains s "partial"))
      ;; Outer continuation wraps a park-deref → can't be simple combinator
      (is (= 2 (count (re-seq #"park-deref" s)))))))

(deftest edge-chained-derefs-inner-keyword
  (testing "two derefs: inner gets keyword combinator"
    (let [{:keys [go? s]} (xform '(let [a (deref (in :root x))
                                         b (deref (in :root y))]
                                     (:result b)))]
      (is go?)
      (is (= 2 (count (re-seq #"park-deref" s)))))))

;; ---- Deref in let init that's an expression (not bare deref) ----

(deftest edge-deep-deref-in-let-init
  (testing "(let [x (+ 1 @(in ..))] (* x 2)) uses chain + combinator"
    (let [{:keys [go? s]} (xform '(let [x (+ 1 (deref (in :root d)))] (* x 2)))]
      (is go?)
      ;; (+ 1 @(in ..)) → park-deref (in :root d) (partial + 1) via transform-call
      (is (.contains s "park-deref"))
      ;; Then chain the rest (* x 2)
      (is (.contains s "chain")))))

;; ---- Nested deref in function call (double deref) ----

(deftest edge-nested-deref-in-call
  (testing "(+ @(in ..) @(in ..)) two derefs as call args → chained park-deref"
    (let [{:keys [go? s]} (xform '(+ (deref (in :root a)) (deref (in :root b))))]
      (is go?)
      (is (= 2 (count (re-seq #"park-deref" s)))))))

;; ---- Deref as only element in vector ----

(deftest edge-single-element-vector
  (testing "[@(in ..)] single deref in vector"
    (let [{:keys [go? s]} (xform '[(deref (in :root x))])]
      (is go?)
      (is (.contains s "park-deref")))))

;; ---- Keyword as first arg to call with deref ----

(deftest edge-keyword-lookup-call-form
  (testing "(:key @(in ..)) treated as call with keyword op"
    (let [{:keys [go? s]} (xform '(:key (deref (in :root x))))]
      (is go?)
      ;; Should use keyword directly as continuation
      (is (fn-free? s)))))

;; ---- Deref with clojure.core/deref and cljs.core/deref variants ----

(deftest edge-qualified-deref-forms
  (testing "clojure.core/deref is detected and transformed"
    (let [{:keys [go? s]} (xform '(clojure.core/deref (in :root x)))]
      (is go?)
      (is (.contains s "park-deref"))
      (is (.contains s "identity"))))
  (testing "cljs.core/deref is detected and transformed"
    (let [{:keys [go? s]} (xform '(cljs.core/deref (in :root x)))]
      (is go?)
      (is (.contains s "park-deref"))
      (is (.contains s "identity")))))

;; ---- Deref inside complex special forms ----

(deftest edge-deref-in-when-not
  (testing "when-not with deref"
    (let [{:keys [go? s]} (xform '(when-not (deref (in :root flag)) "disabled"))]
      (is go?)
      (is (.contains s "park-deref")))))

(deftest edge-deref-in-cond-test
  (testing "cond with deref in test position"
    (let [{:keys [go? s]} (xform '(cond (deref (in :root x)) :a
                                         (deref (in :root y)) :b
                                         :else :c))]
      (is go?)
      (is (>= (count (re-seq #"park-deref" s)) 1)))))

;; ---- Multi-body do with deref in middle ----

(deftest edge-do-deref-middle
  (testing "deref in middle of do — pre-forms emitted, rest chained"
    (let [{:keys [go? s]} (xform '(do
                                     (println "setup")
                                     (let [v (deref (in :root resource))] v)
                                     (println "done")))]
      (is go?)
      (is (.contains s "park-deref"))
      (is (.contains s "println")))))

;; ---- HOF crossing: map with deeper deref in fn body ----

(deftest edge-hof-map-partial-inside
  (testing "mapv with (+ 10 @(in ..)) in fn body → park-map with partial inside"
    (let [{:keys [go? s]} (xform '(mapv (fn [item] (+ 10 (deref (in :root item)))) coll))]
      (is go?)
      (is (.contains s "park-map"))
      ;; Inside the HOF fn body, (+ 10 @(in ..)) → park-deref (in ..) (partial + 10)
      (is (.contains s "partial")))))

;; ---- HOF crossing: reduce with accumulator ----

(deftest edge-hof-reduce-with-acc
  (testing "reduce with deref and accumulator"
    (let [{:keys [go? s]} (xform '(reduce (fn [acc item] (+ acc (deref (in :root item)))) 0 items))]
      (is go?)
      (is (.contains s "park-reduce"))
      (is (.contains s "park-deref")))))

;; ---- let with many bindings, one deref ----

(deftest edge-many-let-bindings-one-deref
  (testing "let with 4 bindings, only third has deref"
    (let [{:keys [go? s]} (xform '(let [a 1
                                         b 2
                                         c (deref (in :root d))
                                         e (+ a b)]
                                     (+ a b c e)))]
      (is go?)
      (is (.contains s "park-deref"))
      ;; a and b should be in a plain let before park-deref
      ;; e should be in a let after c is bound
      (is (.contains s "+ a b c e")))))

;; ---- try/catch/finally ----

(deftest edge-try-catch-finally-deref
  (testing "try with deref, catch, and finally"
    (let [{:keys [go? s]} (xform '(try
                                     (deref (in :root x))
                                     (catch :default e (println e))
                                     (finally (cleanup!))))]
      (is go?)
      (is (.contains s "park-deref"))
      (is (.contains s "promise-catch"))
      (is (.contains s "promise-finally")))))

;; ---- Ensure multi-form body works ----

(deftest edge-multi-form-body
  (testing "transform-body with multiple top-level forms"
    (let [{:keys [body go?]} (go/transform-body
                               ['(println "start")
                                '(let [v (deref (in :root d))] v)
                                '(println "end")])]
      (is go?)
      (let [form-str (pr-str body)]
        (is (.contains form-str "park-deref"))
        (is (.contains form-str "println"))))))

;; ---- Ensure deref-free multi-form body is untouched ----

(deftest edge-multi-form-no-deref
  (testing "multi-form body without deref → unchanged"
    (let [{:keys [body go?]} (go/transform-body
                               ['(println "a")
                                '(+ 1 2)
                                '(println "b")])]
      (is (not go?))
      (is (= 3 (count body))))))

;; ---- if with deref in both branches ----

(deftest edge-if-deref-both-branches
  (testing "if with deref in both then and else"
    (let [{:keys [go? s]} (xform '(if flag (deref (in :root a)) (deref (in :root b))))]
      (is go?)
      (is (= 2 (count (re-seq #"park-deref" s)))))))

;; ---- Combinator patterns inside HOF fn body ----

(deftest edge-combinator-inside-hof
  (testing "HOF fn body with keyword continuation"
    (let [{:keys [go? s]} (xform '(mapv (fn [item] (:name (deref (in :root item)))) coll))]
      (is go?)
      (is (.contains s "park-map"))
      ;; Inside the fn body: (:name @(in ..)) → park-deref (in ..) :name
      ;; No inline fn needed for the inner continuation
      )))

;; ---- let binding where rest-form is another park-deref (chained combinator) ----

(deftest edge-three-chained-derefs
  (testing "three chained let derefs"
    (let [{:keys [go? s]} (xform '(let [a (deref (in :root x))
                                         b (deref (in :root y))
                                         c (deref (in :root z))]
                                     (+ a b c)))]
      (is go?)
      (is (= 3 (count (re-seq #"park-deref" s)))))))

;; ---- Deref inside nested let ----

(deftest edge-nested-let-inner-deref
  (testing "nested let with deref in inner let"
    (let [{:keys [go? s]} (xform '(let [a 1]
                                     (let [b (deref (in :root d))]
                                       (+ a b))))]
      (is go?)
      (is (.contains s "park-deref")))))

;; ---- Verify no-op for empty body ----

(deftest edge-empty-body
  (testing "empty body returns nil, not go"
    (let [{:keys [go?]} (go/transform-body [])]
      (is (not go?)))))

;; ---- or / and with deref (not explicitly handled, falls to transform-call) ----

(deftest edge-or-with-deref
  (testing "or with deref — handled as call"
    ;; Note: 'or' is a macro that expands, but at CPS-time we see it as a call
    (let [{:keys [go? s]} (xform '(or (deref (in :root x)) :default))]
      (is go?)
      (is (.contains s "park-deref")))))
