(ns inmesh.spawn
  (:require
   [inmesh.macro-impl :as i]))

(defmacro spawn [& x]
  (let [[conveyer names opts body] (i/locals-and-args &env x)
        afn `(fn ~names ~@body)]
    `(inmesh.spawn/do-spawn ~conveyer ~opts (clojure.core/str ~afn))))
