(ns cljs-thread.pmap
  (:refer-clojure :exclude [pmap pcalls pvalues])
  (:require
   [cljs-thread.macro-impl :as i]))

(defmacro pmap
  "Parallel map across worker threads.
   Like clojure.core/pmap but dispatches work to injest workers.

   Usage: (pmap f coll) or (pmap f coll1 coll2 ...)

   The function f is embedded at compile time and each element is
   captured by `in` at runtime - no js/eval needed."
  [afn & args]
  ;; Extract locals that afn references so they can be captured
  (let [[conveyer names opts body] (i/globals-locals-and-args &env [afn])]
    (if (= 1 (count args))
      ;; Single collection: pass element directly
      `(cljs-thread.pmap/do-pmap-inline
         (fn [worker-id# elem#]
           (cljs-thread.in/in worker-id#
             (~afn elem#)))
         ~@args)
      ;; Multiple collections: elem is a vector, apply it
      `(cljs-thread.pmap/do-pmap-inline
         (fn [worker-id# elem#]
           (cljs-thread.in/in worker-id#
             (clojure.core/apply ~afn elem#)))
         ~@args))))

(defmacro pcalls
  "Execute functions in parallel across worker threads.
   Returns a vector of results.

   Usage: (pcalls (fn [] expr1) (fn [] expr2) ...)

   Each function is embedded at compile time and dispatched to a worker."
  [& fns]
  (let [[conveyer names opts body] (i/globals-locals-and-args &env fns)
        n (count body)]
    ;; Generate code that dispatches each function to a worker
    ;; Use do-pcalls to handle runtime worker selection
    `(cljs-thread.pmap/do-pcalls
       ~(vec (for [fn-form body]
              `(fn [worker-id#]
                 (cljs-thread.in/in worker-id# (~fn-form))))))))

(defmacro pvalues
  "Evaluate expressions in parallel across worker threads.
   Returns a vector of results.

   Usage: (pvalues expr1 expr2 ...)

   Each expression is embedded at compile time and dispatched to a worker."
  [& exprs]
  (let [[conveyer names opts body] (i/globals-locals-and-args &env exprs)]
    ;; Generate code that dispatches each expression to a worker
    `(cljs-thread.pmap/do-pcalls
       ~(vec (for [expr body]
              `(fn [worker-id#]
                 (cljs-thread.in/in worker-id# ~expr)))))))
