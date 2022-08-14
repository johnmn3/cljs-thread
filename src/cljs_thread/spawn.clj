(ns cljs-thread.spawn
  (:require
   [cljs-thread.macro-impl :as i]))

(defmacro spawn [& x]
  (let [[conveyer names opts body] (i/globals-locals-and-args &env x)
        yield? (i/yields? x)
        yfn (if-not yield?
              `(fn ~names ~@body)
              `(fn [in-id#]
                 (fn ~names
                   (let [~'yield (fn [& res#]
                                   (cljs-thread.sync/send-response
                                    {:request-id in-id# :response (last res#)})
                                   (when (not (:deamon? cljs-thread.env/data))
                                     (js/setTimeout #(.close js/self) 100)))]
                     ~@body))))]
    (if-not (seq body)
      `(cljs-thread.spawn/do-spawn [] ~opts nil)
      `(cljs-thread.spawn/do-spawn ~conveyer (assoc ~opts :yield? ~yield?) (clojure.core/str ~yfn)))))
