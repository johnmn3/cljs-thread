(ns inmesh.on-when
  (:require
   [cljs.analyzer]))

(defmacro on-when
  [pred & body]
  (let [[opts body] (if (map? (first body))
                      [(first body) (rest body)]
                      [{} body])]
    `(inmesh.on-when/do-on-when (fn [] ~pred)
                                (assoc ~opts
                                       :timeout-data
                                       {:ns ~(name cljs.analyzer/*cljs-ns*)
                                        :line ~(:line (meta &form))})
                                (fn [] ~@body))))
