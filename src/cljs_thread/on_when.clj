(ns cljs-thread.on-when
  (:require
   [cljs.analyzer]))

(defmacro on-when
  [pred & body]
  (let [[opts body] (if (map? (first body))
                      [(first body) (rest body)]
                      [{} body])]
    `(cljs-thread.on-when/do-on-when
      (fn [] ~pred)
      (assoc ~opts
             :timeout-data
             {:ns ~(name cljs.analyzer/*cljs-ns*)
              :line ~(:line (meta &form))})
      (fn [] ~@body))))

(defmacro on-watch
  [atm pred & body]
  (let [[opts body] (if (map? (first body))
                      [(first body) (rest body)]
                      [{} body])]
    `(cljs-thread.on-when/do-on-watch
      ~atm
      ~pred
      (assoc ~opts
             :wkey (str ~(str atm "-" pred) "-" (gensym))
             :timeout-data
             {:ns ~(name cljs.analyzer/*cljs-ns*)
              :line ~(:line (meta &form))})
      (fn [] ~@body))))
