(ns inmesh.pmap
  (:refer-clojure :exclude [pmap])
  (:require
   [inmesh.macro-impl :as i]))

(defmacro pmap [afn & args]
  (let [[conveyer names opts body] (i/globals-locals-and-args &env afn)
        yfn `(clojure.core/fn ~names ~afn)]
    `(inmesh.pmap/do-pmap ~conveyer ~yfn ~@args)))
