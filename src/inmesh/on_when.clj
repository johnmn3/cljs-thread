(ns inmesh.on-when)

(defmacro on-when
  [pred & body]
  (let [[opts body] (if (map? (first body))
                      [(first body) (rest body)]
                      [{} body])]
    `(inmesh.on-when/do-on-when (fn [] ~pred) ~opts (fn [] ~@body))))
