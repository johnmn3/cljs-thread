(ns inmesh.injest
  (:require-macros
   [inmesh.injest])
  (:require
   [inmesh.util :as u]
   [inmesh.state :as s]
   [inmesh.spawn :refer [spawn]]
   [inmesh.in :refer [in]]
   [injest.impl]
   [injest.path]))

(defn mk-injest-ids [n]
  (let [ws (-> n (or (u/num-cores) (/ 2)))]
    (->> ws range (map #(keyword (str "injest-" %))))))

(defn start-injests [configs]
  (when (or (:injest configs) (:injest-count configs) (:injest-connect-string configs))
    (let [injests (-> configs (:injest-count 8) mk-injest-ids)]
      (spawn {:id :injest :no-globals? true}
             (s/update-conf! configs))
      (->> injests
           (mapv (fn [wid]
                   (spawn {:id wid :no-globals? true}
                          (s/update-conf! configs))))))))

(def ^:dynamic *par* nil)
(def ^:dynamic *chunk* nil)
(defn fan [xf args & {:keys [par chunk]}]
  (let [injest-count (:injest-count @s/conf 4)
        n-pws (or *par* par (* injest-count 8))
        pws (take n-pws (cycle (mk-injest-ids (:injest-count @s/conf 8))))
        args-parts (partition-all n-pws (partition-all (or *chunk* chunk 512) args))]
    (->> args-parts
         (map (fn [ags]
                (->> ags
                     (mapv (fn [p a]
                             (in p 
                                 (sequence (xf) a)))
                           pws))))
         (mapcat #(map deref %))
         (apply concat))))
