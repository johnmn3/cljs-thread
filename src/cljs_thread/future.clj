(ns cljs-thread.future
  (:refer-clojure :exclude [future])
  (:require [cljs-thread.macro-impl :as i]))

(defn- user-local?
  "Filter out gensyms from macro expansions"
  [sym]
  (let [n (name sym)]
    (not (or (.endsWith n "#")
             (.contains n "__auto__")
             (.startsWith n "G__")))))

(defmacro future [& x]
  ;; Special case: single map argument should be treated as body, not options.
  ;; A future with only options and no body is useless, so if someone writes
  ;; (future {:foo 1}) they want to return that map, not pass it as options.
  (let [single-map? (and (= 1 (count x)) (map? (first x)))
        ;; For single-map case, prepend []{} so parse-in treats the map as body
        ;; This ensures locals in the map are properly extracted
        adjusted-x (if single-map?
                     (list* [] {} x)
                     x)
        [conveyer names opts body] (i/globals-locals-and-args &env adjusted-x)
        conveyer-syms (vec (filter user-local? (or names [])))]
    ;; Use try/finally to ensure worker is returned even if body throws.
    ;; Avoid let bindings with gensyms that would be namespace-qualified.
    `(if-let [w# (cljs-thread.future/take-worker!)]
       (cljs-thread.core/in w# [~@conveyer-syms w#] ~(or opts {})
         (try
           (do ~@body)
           (finally
             (cljs-thread.future/put-back-worker! w#))))
       ;; Fallback: no worker available, go through :future coordinator
       ;; Don't convey locals - :future runs in different context
       (cljs-thread.core/in :future
         (let [k# (keyword (cljs-thread.util/gen-id))]
           (add-watch cljs-thread.future/pool k#
             (fn [_# _# _# _#]
               (when-let [w# (cljs-thread.future/take-worker!)]
                 (remove-watch cljs-thread.future/pool k#)
                 (~'yield
                   @(cljs-thread.core/in w# [~@conveyer-syms w#] ~(or opts {})
                      (try
                        (do ~@body)
                        (finally
                          (cljs-thread.future/put-back-worker! w#)))))))))))))
