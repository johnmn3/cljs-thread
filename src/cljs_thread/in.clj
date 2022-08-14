(ns cljs-thread.in
  (:require
   [cljs-thread.macro-impl :as i]))

(defmacro in [id & x]
  (let [[conveyer names opts body] (i/globals-locals-and-args &env x)
        yield? (i/yields? x)
        yfn (if-not yield?
              `(fn ~names ~@body)
              `(fn [in-id#]
                 (fn ~names
                   (let [~'yield (fn [res#]
                                   (cljs-thread.sync/send-response
                                    {:request-id in-id# :response res#}))]
                     ~@body))))]
    `(cljs-thread.in/do-in ~id ~conveyer (clojure.core/str ~yfn) (assoc ~opts :yield? ~yield?))))
