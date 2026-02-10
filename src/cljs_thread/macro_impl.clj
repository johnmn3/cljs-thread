(ns cljs-thread.macro-impl
  (:require [cljs.env :as env]))

;; ---------------------------------------------------------------------------
;; Foreign var wrapping
;;
;; Under Closure advanced compilation with code splitting, vars used in
;; value position (passed as args, not called) may get IIFE-local aliases
;; that don't exist on workers. This transformation wraps such references
;; in inline fns that force call-position compilation, which causes Closure
;; to emit cross-module $APP paths instead of IIFE-local aliases.
;;
;; Requires core-ops export in injest.cljs to anchor operators like +, -, etc.
;; in the shared module so Closure doesn't create screen-local wrappers.
;;
;; Disable via: (binding [*wrap-foreign-vars* false] ...)
;; ---------------------------------------------------------------------------

(def ^:dynamic *wrap-foreign-vars*
  "When true, value-position core function references in macro bodies
   are wrapped in inline fns that force call-position compilation.
   This prevents Closure from creating IIFE-local aliases that break
   on workers. Requires core-ops export in injest.cljs for operators.
   Default :auto detects advanced compilation automatically."
  :auto)

(defn- advanced-compilation?
  "Check if the current CLJS build uses :advanced optimization.
   Wrapping is only needed for release builds with code splitting."
  []
  (try
    (= :advanced (get-in @env/*compiler* [:options :optimizations]))
    (catch Exception _ false)))

(defn- wrapping-enabled?
  "Resolve whether wrapping should be active for the current build."
  []
  (cond
    (= *wrap-foreign-vars* :auto) (advanced-compilation?)
    :else (boolean *wrap-foreign-vars*)))

(defn- value-position-symbols
  "Collect symbols that appear in value position (not as the first
   element of a list/call form) anywhere in form."
  [form]
  (cond
    (symbol? form) #{form}
    (seq? form)    (if (= (first form) 'quote)
                     #{}
                     (reduce into #{} (map value-position-symbols (rest form))))
    (vector? form) (reduce into #{} (map value-position-symbols form))
    (map? form)    (reduce into #{}
                     (map (fn [e] (into (value-position-symbols (key e))
                                        (value-position-symbols (val e))))
                          form))
    (set? form)    (reduce into #{} (map value-position-symbols form))
    :else          #{}))

(defn- extract-binding-syms
  "Extract all bound symbols from a binding form, handling destructuring.
   Works for simple symbols, vector destructuring, and map destructuring."
  [form]
  (cond
    (symbol? form) (when-not (= form '&) [form])
    (vector? form) (mapcat extract-binding-syms form)
    (map? form)    (mapcat extract-binding-syms
                     (concat (vals form)
                             (when-let [as (:as form)] [as])
                             (when-let [ks (:keys form)] ks)
                             (when-let [ss (:strs form)] ss)
                             (when-let [sy (:syms form)] sy)))
    :else nil))

(defn- body-bound-symbols
  "Collect all symbols introduced by let/loop/fn/catch within forms.
   These are runtime bindings not visible in &env's :locals.
   Handles destructuring in bindings and fn params."
  [forms]
  (let [result (atom #{})
        binding-forms #{'let 'loop 'for 'doseq 'if-let 'when-let
                        'if-some 'when-some 'as-> 'with-open 'binding}]
    (doseq [form forms]
      (when (coll? form)
        (doseq [node (tree-seq coll? seq form)]
          (when (seq? node)
            (let [op (first node)]
              (cond
                (contains? binding-forms op)
                (let [bindings (second node)]
                  (when (vector? bindings)
                    (doseq [i (range 0 (count bindings) 2)]
                      (doseq [s (extract-binding-syms (nth bindings i nil))]
                        (swap! result conj s)))))
                (= op 'fn)
                (doseq [item (rest node)]
                  (when (vector? item)
                    (doseq [s (mapcat extract-binding-syms item)]
                      (swap! result conj s))))
                (= op 'catch)
                (let [e (nth node 2 nil)]
                  (when (symbol? e)
                    (swap! result conj e)))))))))
    @result))

(def ^:private never-wrap
  "Language constructs that aren't special-symbol? but shouldn't be wrapped."
  #{'fn 'fn* 'let 'loop 'if 'do 'when 'cond 'case 'defn 'def 'var
    'quote 'recur 'throw 'try 'catch 'finally 'new 'set! 'ns
    'require 'import 'use 'refer 'yield})

(defn- foreign-var?
  "True if sym is an unqualified, non-local, non-body-bound symbol that
   likely comes from cljs.core. Filters out gensyms, namespace-qualified
   symbols, special forms, language constructs, and interop."
  [sym env body-bounds]
  (let [n (name sym)
        s (str sym)]
    (and (not (contains? (:locals env) sym))
         (not (contains? (:defs (:ns env)) sym))
         (not (special-symbol? sym))
         (not (contains? never-wrap sym))
         (not (.startsWith n "."))
         (not= n "&")
         (not= n "_")
         ;; Skip gensyms (e.g. p1__27388#, auto__12345)
         (not (.endsWith s "#"))
         (nil? (re-find #"__\d+" s))
         ;; Skip namespace-qualified (e.g. s/peers, helpers/square)
         (nil? (namespace sym))
         ;; Skip symbols bound within the body itself
         (not (contains? body-bounds sym)))))

(defn- replace-value-positions
  "Replace value-position symbol occurrences with their mapped replacements.
   Call-position (first element of list) symbols are left untouched."
  [form replacements]
  (cond
    (and (symbol? form) (contains? replacements form))
    (get replacements form)

    (seq? form)
    (if (= (first form) 'quote)
      form
      (apply list (first form)
             (map #(replace-value-positions % replacements) (rest form))))

    (vector? form)
    (mapv #(replace-value-positions % replacements) form)

    (map? form)
    (into {} (map (fn [[k v]]
                    [(replace-value-positions k replacements)
                     (replace-value-positions v replacements)])
                  form))

    (set? form)
    (into #{} (map #(replace-value-positions % replacements) form))

    :else form))

(defn- make-wrapper-fn
  "Generate a wrapper fn that captures sym in a local and dispatches by arity.
   Using a local binding bypasses CLJS compile-time arity checks (the compiler
   can't check arities of local vars). The wrapper puts sym in call position
   for each arity, which may help Closure emit cross-module $APP paths."
  [sym]
  (let [f (gensym "f_")
        a (gensym "a") b (gensym "b") c (gensym "c")
        r (gensym "rest") acc (gensym "acc") x (gensym "x")]
    `(let [~f ~sym]
       (fn
         ([] (~f))
         ([~a] (~f ~a))
         ([~a ~b] (~f ~a ~b))
         ([~a ~b ~c] (~f ~a ~b ~c))
         ([~a ~b ~c ~'& ~r]
          (reduce (fn [~acc ~x] (~f ~acc ~x))
                  (~f ~a ~b ~c) ~r))))))

(defn wrap-foreign-vars
  "When *wrap-foreign-vars* is true, detect value-position foreign var
   references in body and wrap them in inline fns that force call-position
   compilation. Returns possibly-transformed body forms."
  [env body]
  (if-not (wrapping-enabled?)
    body
    (let [body-bounds (body-bound-symbols body)
          val-syms (->> body
                        (map value-position-symbols)
                        (reduce into #{})
                        (filterv symbol?))
          foreign  (vec (filter #(foreign-var? % env body-bounds) val-syms))]
      (if (empty? foreign)
        body
        (let [sym->gs   (into {} (map (fn [s] [s (gensym (str (name s) "_"))]) foreign))
              bindings  (vec (mapcat (fn [s] [(sym->gs s) (make-wrapper-fn s)]) foreign))
              new-body  (mapv #(replace-value-positions % sym->gs) body)]
          [`(let ~bindings ~@new-body)])))))

(defn get-symbols [body]
  (let [body (if (symbol? body)
               [body]
               body)]
    (->> body
         (tree-seq coll? seq)
         (rest)
         (filter (complement coll?))
         (filter symbol?)
         vec)))

(defn get-locals [env body]
  (let [body (if (symbol? body)
               [body]
               body)]
    (->> (filter (complement coll?)
                 (rest (tree-seq coll? seq body)))
         (filter symbol?)
         (map (:locals env))
         (map :name)
         (filter (comp not nil?))
         vec
         (#(do [% %])))))

(defn get-locals-and-globals [env body]
  (let [defs-and-locals (merge (:locals env)
                               (into {} (map (fn [[k v]] [k {:name k}]) (:defs (:ns env)))))
        body (if (symbol? body)
               [body]
               body)]
    (->> (filter (complement coll?)
                 (rest (tree-seq coll? seq body)))
         (filter symbol?)
         (map defs-and-locals)
         (map :name)
         (filter (comp not nil?))
         vec
         (#(do [% %])))))

(defn parse-in [x]
  (if-not (coll? x)
    [[] {} x]
    (let [f (first x)
          s (second x)]
      (cond (and (vector? f) (map? s)) [f s (rest (rest x))]
            (vector? f) [f {} (rest x)]
            (map? f) [[] f (rest x)]
            :else [[] {} (vec x)]))))

(defn yield-form? [form]
  (when (seq? form)
    (not
      (empty?
        (filter #(or (= % 'yield) (= % 'cljs-thread.core/yield)) form)))))

(defn yields? [expr]
  (when (coll? expr)
    (not
      (empty?
        (->> expr
             (tree-seq coll? seq)
             (filter yield-form?))))))

(defn globals-locals-and-args [env body]
  (let [[args opts body*] (parse-in body)
        ;; Normalize body* to always be a vector of forms so callers
        ;; can uniformly use ~@body for splicing.
        body* (if (coll? body*) (vec body*) [body*])
        no-globals? (:no-globals? opts)
        [conveyer names]
        (if (seq args)
          [(mapv symbol args) args]
          (if no-globals?
            (get-locals env body*)
            (get-locals-and-globals env body*)))
        body* (wrap-foreign-vars env body*)]
    [conveyer names opts body*]))
