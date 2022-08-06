(ns inmesh.future
  (:refer-clojure :exclude [future])
  (:require
   [inmesh.macro-impl :as i]))

(defmacro future [& x]
  (let [[conveyer names opts body] (i/globals-locals-and-args &env x)
        yield? (i/yields? x)
        afn (if-not yield?
              `(fn ~names
                 (fn [yield*#]
                   (yield*# (do ~@body))))
              `(fn ~names
                 (fn [yield*#]
                   (let [~'yield yield*#]
                     ~@body))))]
    `(inmesh.future/do-future ~conveyer ~afn ~opts)))
