(ns inmesh.pmap
  (:require-macros [inmesh.pmap])
  (:require
   [inmesh.util :as u]
   [inmesh.env :as e]
   [inmesh.in :refer [in]]
   [inmesh.future :refer [future]]
   [inmesh.injest :refer [mk-injest-ids]]))

(defn zipall [& colls]
  (->> colls
       ((fn [vs]
          (let [vc (mapv count vs)
                c (apply min vc)]
            (repeat c vs))))
       (map-indexed (fn [i v]
                      (map #(% i) v)))))

(defn do-pmap [conveyer afn & args]
  (let [pws (cycle (mk-injest-ids))
        zipargs (if (= 1 (count args)) 
                  (map #(do [%]) (first args))
                  (apply zipall args))
        pa (map (fn [p a] [p a]) pws zipargs)
        pas (partition-all (inc (u/num-cores)) pa)]
    (if (or (e/in-screen?) (e/in-root?))
      (future
        (->> pas
             (map (fn [pa]
                    (->> pa
                         (mapv (fn [[p a]]
                                 (in p (apply (apply afn conveyer) a)))))))
             (mapcat #(map deref %))))
      (->> pas
           (map (fn [pa]
                  (->> pa
                       (mapv (fn [[p a]]
                               (in p (apply (apply afn conveyer) a)))))))
           (mapcat #(map deref %))))))
