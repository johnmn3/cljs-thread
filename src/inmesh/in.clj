(ns inmesh.in
  (:require
   [inmesh.macro-impl :as i]))

(defmacro in [id & x]
  (let [[conveyer names opts body] (i/globals-locals-and-args &env x)
        yield? (i/yields? x)
        yfn (if-not yield?
              `(fn ~names ~@body)
              `(fn [in-id#]
                 (fn ~names
                   (let [~'yield (fn [res#]
                                   (inmesh.sync/send-response
                                    {:request-id in-id# :response res#}))]
                     ~@body))))]
    `(inmesh.in/do-in ~id ~conveyer (clojure.core/str ~yfn) (assoc ~opts :yield? ~yield?))))
