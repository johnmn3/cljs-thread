(ns inmesh.in
  (:require
   [inmesh.macro-impl :as i]))

(defmacro in [id & x]
  (let [[conveyer names opts body] (i/locals-and-args &env x)
        afn `(fn ~names ~@body)]
    `(inmesh.in/do-in ~id ~conveyer (clojure.core/str ~afn) ~opts)))
