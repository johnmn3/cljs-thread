(ns cljs-thread.core
  (:refer-clojure :exclude [future]))

(defn yield [])

(defmacro in [_id & x]
  `(let [~'yield clojure.core/identity
         yield# clojure.core/identity]
     (yield# 1)
     (~'yield 1)
     ~@x))

(defmacro future [& _x])

(defmacro wait [& x]
  `(let [~'yield clojure.core/identity
         yield# clojure.core/identity]
     (yield# 1)
     (~'yield 1)
     ~@x))

(defmacro spawn [& x]
  `(let [~'yield clojure.core/identity
         yield# clojure.core/identity]
     (yield# 1)
     (~'yield 1)
     ~@x))

(defn get-symbols [body]
  (->> body
       (tree-seq coll? seq)
       (rest)
       (filter (complement coll?))
       (filter symbol?)
       vec))

(defmacro in? [& x]
  (let [[syms body] (if (and (second x) (vector? (first x)))
                      [(first x) `~(second x)]
                      [(get-symbols x) `(do ~@x)])]
    `(do '~syms (fn ~syms ~body))))
