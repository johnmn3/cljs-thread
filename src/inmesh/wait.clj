(ns inmesh.wait
  (:require
   [inmesh.macro-impl :as i]))

(defmacro wait [id & x]
  (let [[conveyer names opts body] (i/locals-and-args &env x)
        yield? (i/yields? x)
        afn (if-not yield?
              `(fn ~names
                 (fn [yield*#]
                   (yield*# (do ~@body))))
              `(fn ~names
                 (fn [yield*#]
                   (let [~'yield yield*#]
                     ~@body))))]
    `(inmesh.wait/do-wait ~id ~conveyer ~afn ~opts)))
