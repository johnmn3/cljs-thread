(ns inmesh.core
  (:refer-clojure :exclude [future])
  (:require
   [injest.impl :as i]
   [injest.path :as p :refer [x>>]]))

(defn get-locals [env body]
  (->> (filter (complement coll?)
               (rest (tree-seq coll? seq body)))
       (filter symbol?)
       (map (:locals env))
       (map :name)
       (filter (comp not nil?))
       vec
       (#(do [% %]))))

(defn parse-in [x]
  (let [f (first x)
        s (second x)]
    (cond (and (vector? f) (map? s)) [f s (rest (rest x))]
          (vector? f) [f {} (rest x)]
          (map? f) [[] f (rest x)]
          :else [[] {} (vec x)])))

(defn yield-form? [form]
  (when (seq? form)
    (not
     (empty?
      (filter #(or (= % 'yield) (= % 'inmesh.core/yield)) form)))))

(defn yields? [expr]
  (when (coll? expr)
    (not
     (empty?
      (->> expr
           (tree-seq coll? seq)
           (filter yield-form?))))))

(defn locals-and-args [env body]
  (let [[args opts body*] (parse-in body)
        [conveyer _] (if (seq args)
                       [(mapv symbol args) args]
                       (get-locals env body*))]
    [conveyer opts body*]))

(defmacro in [id & x]
  (let [[conveyer opts body] (locals-and-args &env x)
        afn `(fn ~conveyer ~@body)]
    `(inmesh.core/do-in ~id ~conveyer (clojure.core/str ~afn) ~opts)))

(defmacro spawn [& x]
  (let [[conveyer opts body] (locals-and-args &env x)
        afn `(fn ~conveyer ~@body)]
    `(inmesh.core/do-spawn ~conveyer ~opts (clojure.core/str ~afn))))

(defmacro future [& x]
  (let [[conveyer opts body] (locals-and-args &env x)
        yield? (yields? x)
        afn (if-not yield?
              `(fn ~conveyer
                 (fn [yield*#]
                   (yield*# (do ~@body))))
              `(fn ~conveyer
                 (fn [yield*#]
                   (let [~'yield yield*#]
                     ~@body))))]
    `(inmesh.core/do-future ~conveyer ~afn ~opts)))

(defmacro wait [id & x]
  (let [[args opts body] (parse-in x)
        [conveyer names] (if (seq args)
                           [(mapv symbol args) args]
                           (get-locals &env body))
        yield? (yields? x)
        afn (if-not yield?
              `(fn ~names
                 (fn [yield*#]
                   (yield*# (do ~@body))))
              `(fn ~names
                 (fn [yield*#]
                   (let [~'yield yield*#]
                     ~@body))))]
    `(inmesh.core/do-wait ~id ~conveyer ~afn ~opts)))

(defmacro tfan [xf-group]
  (let [tfn `(fn [] (injest.impl/compose-transducer-group ~xf-group))]
    `(fn [args#] (inmesh.core/fan ~tfn args#))))

(defmacro =>>
  "Just like x>> but first composes stateless transducers into a function that 
   `r/fold`s in parallel the values flowing through the thread. Remaining
   stateful transducers are composed just like x>>."
  [x & thread]
  `(if (in-screen?)
     (in :core (x>> ~x ~@(->> thread (injest.impl/pre-transducify-thread &env 1 `inmesh.core/tfan injest.impl/par-transducable?))))
     (x>> ~x ~@(->> thread (injest.impl/pre-transducify-thread &env 1 `inmesh.core/tfan injest.impl/par-transducable?)))))

(defmacro on-when
  [pred & body]
  (let [[opts body] (if (map? (first body))
                      [(first body) (rest body)]
                      [{} body])]
    `(inmesh.core/do-on-when (fn [] ~pred) ~opts (fn [] ~@body))))
