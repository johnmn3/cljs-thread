(ns inmesh.macro-impl)


(defn get-symbols [body]
  (->> body
       (tree-seq coll? seq)
       (rest)
       (filter (complement coll?))
       (filter symbol?)
       vec))

(defn get-locals [env body]
  (->> (filter (complement coll?)
               (rest (tree-seq coll? seq body)))
       (filter symbol?)
       (map (:locals env))
       (map :name)
       (filter (comp not nil?))
       vec
       (#(do [% %]))))

(defn parse-in [x]
  (let [f (first x)
        s (second x)]
    (cond (and (vector? f) (map? s)) [f s (rest (rest x))]
          (vector? f) [f {} (rest x)]
          (map? f) [[] f (rest x)]
          :else [[] {} (vec x)])))

(defn yield-form? [form]
  (when (seq? form)
    (not
      (empty?
        (filter #(or (= % 'yield) (= % 'inmesh.core/yield)) form)))))

(defn yields? [expr]
  (when (coll? expr)
    (not
      (empty?
        (->> expr
             (tree-seq coll? seq)
             (filter yield-form?))))))

(defn locals-and-args [env body]
  (let [[args opts body*] (parse-in body)
        [conveyer names]
        (if (seq args)
          [(mapv symbol args) args]
          (get-locals env body*))]
    [conveyer names opts body*]))
