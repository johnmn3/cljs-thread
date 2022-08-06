(ns inmesh.spawn
  (:require
   [inmesh.macro-impl :as i]))

(defmacro spawn [& x]
  (let [[conveyer names opts body] (i/globals-locals-and-args &env x)
        yield? (i/yields? x)
        yfn (if-not yield?
              `(fn ~names ~@body)
              `(fn [in-id#]
                 (fn ~names
                   (let [~'yield (fn [& res#]
                                   (inmesh.sync/send-response
                                    {:request-id in-id# :response (last res#)})
                                   (when (not (:deamon? inmesh.env/data))
                                     (js/setTimeout #(.close js/self) 100)))]
                     ~@body))))]
    (if-not (seq body)
      `(inmesh.spawn/do-spawn [] ~opts nil)
      `(inmesh.spawn/do-spawn ~conveyer (assoc ~opts :yield? ~yield?) (clojure.core/str ~yfn)))))
