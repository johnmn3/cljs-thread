(ns cljs-thread.pmap
  (:refer-clojure :exclude [pmap pcalls pvalues])
  (:require
   [cljs-thread.macro-impl :as i]))

(defmacro pmap [afn & args]
  (let [[conveyer names opts body] (i/globals-locals-and-args &env afn)
        yfn `(clojure.core/fn ~names ~afn)]
    `(cljs-thread.pmap/do-pmap ~conveyer ~yfn ~@args)))

(defmacro pcalls [& fns]
  (let [[conveyer names opts body] (i/globals-locals-and-args &env fns)
        conveyer-fns (->> body
                          (mapv (fn [afn]
                                  `(clojure.core/fn ~names (~afn)))))]
    `(do (cljs-thread.pmap/pmap #(apply % ~conveyer) ~conveyer-fns))))

(defmacro pvalues
  [& exprs]
  (let [[conveyer names opts body] (i/globals-locals-and-args &env exprs)
        conveyer-exprs (->> body
                            (mapv (fn [expr]
                                    `(clojure.core/fn ~names ~expr))))]
    `(do (cljs-thread.pmap/pmap #(apply % ~conveyer) ~conveyer-exprs))))
