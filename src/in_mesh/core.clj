(ns in-mesh.core)
  ;; (:refer-clojure :exclude [future])
  ;; (:require [cljs.analyzer :as ana]))

(defn get-locals [env body]
  (let [locals (->> (filter (complement coll?)
                            (rest (tree-seq coll? seq body)))
                    (filter symbol?)
                    (map (:locals env))
                    (filter (comp not nil?))
                    (map #(when-let [form (or (:form (:init %)) ((comp :val :init) %) (:name %))]
                            {:val form
                             :name (:name %)}))
                    (filter (comp not nil?))
                    vec)]
    [(mapv :val locals)
     (mapv :name locals)]))

(defn parse-in [x]
  (let [f (first x)
        s (second x)]
    (cond (and (vector? f) (map? s)) [f s (rest (rest x))]
          (vector? f) [f {} (rest x)]
          (map? f) [[] f (rest x)]
          :else [[] {} (vec x)])))

(defmacro in [id & x]
  (let [[args opts body] (parse-in x)
        [conveyer names] (if (seq args)
                           [(mapv symbol args) args]
                           (get-locals &env body))
        afn (concat (list `fn names) body)
        out (list `in-mesh.core/do-in id conveyer afn opts)]
    out))
