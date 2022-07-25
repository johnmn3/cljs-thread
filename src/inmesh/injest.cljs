(ns inmesh.injest
  (:require-macros
   [inmesh.injest :refer [=>> tfan]]
   [inmesh.in :refer [in]]
   [inmesh.spawn :refer [spawn]])
  (:require
   [inmesh.util :as u]
   [inmesh.state :as s]
   [inmesh.spawn]
   [injest.impl]
   [injest.path :refer [x>>]]))

(defn mk-injest-ids [n] 
  (let [ws (-> n (or (u/num-cores) (/ 2)))]
    (->> ws range (map #(keyword (str "injest-" %))))))

(defn start-injests [configs]
  (when (or (:injest configs) (:injest-count configs) (:injest-connect-string configs))
    (let [injest-count (:injest-count configs 4)]
      (spawn {:id :injest :opts {:no-res? true}}
             (s/update-conf! configs))
      (->> (mk-injest-ids injest-count)
           (mapv (fn [wid]
                   (spawn {:id wid :opts {:no-res true}}
                          (s/update-conf! configs))))))))

(def ^:dynamic *par* nil)
(def ^:dynamic *chunk* nil)
(defn fan [xf args & {:keys [par chunk]}]
  (let [injest-count (:injest-count @s/conf 4)
        n-pws (or *par* par (* injest-count 8))
        pws (take n-pws (cycle (mk-injest-ids (:injest-count @s/conf 4))))
        args-parts (partition-all n-pws (partition-all (or *chunk* chunk 2048) args))]
    (->> args-parts
         (map (fn [ags]
                (->> ags
                     (mapv (fn [p a]
                             (in p 
                                 (sequence (xf) a)))
                           pws))))
         (mapcat #(map deref %))
         (apply concat))))

;; (defn fan-xfn [xf-group]
;;   (fn [args]
;;     (fan #(i/compose-transducer-group xf-group) (vec args))))

;; (defn flip [n]
;;   (apply comp (take n (cycle [inc dec]))))

;; ;; (defn flip [n]
;; ;;   (apply comp (take n (cycle [inc dec]))))

;; (comment
;;   (->> [1 2 3 4]
;;        (sequence (i/compose-transducer-group [[map inc] [map inc]])))
;;   (->> [1 2 3 4]
;;        ((fan-xfn [[map inc] [map inc]])))
;;   (fan #(i/compose-transducer-group [[map inc] [map inc]]) [1 2 3])
;;   ((tfan [[map inc] [map inc]]) [1 2 3])

;;   (=>> [1 2 3]
;;        (map inc)
;;        (map inc))

;;   (->> (range 1000000)
;;        (map inc)
;;        (filter odd?)
;;        (map (flip 100))
;;        (mapcat #(do [% (dec %)]))
;;        (partition-by #(= 0 (mod % 5)))
;;        (map (partial apply +))
;;        (map (partial + 10))
;;        (map (flip 100))
;;        (map (flip 1000))
;;        (map #(do {:temp-value %}))
;;        (map :temp-value)
;;        (filter even?)
;;        (apply +)
;;        println
;;        time)

;;   (x>> (range 1000000)
;;        (map inc)
;;        (filter odd?)
;;        (map (flip 100))
;;        (mapcat #(do [% (dec %)]))
;;        (partition-by #(= 0 (mod % 5)))
;;        (map (partial apply +))
;;        (map (partial + 10))
;;        (map (flip 100))
;;        (map (flip 1000))
;;        (map #(do {:temp-value %}))
;;        (map :temp-value)
;;        (filter even?)
;;        (apply +)
;;        println
;;        time)

;;   (binding [#_#_*par* 64 #_#_*chunk* 16384]
;;     (=>> (range 1000000)
;;          (map inc)
;;          (filter odd?)
;;          (map (flip 100))
;;          (mapcat #(do [% (dec %)]))
;;          (partition-by #(= 0 (mod % 5)))
;;          (map (partial apply +))
;;          (map (partial + 10))
;;          (map (flip 100))
;;          (map (flip 1000))
;;          (map #(do {:temp-value %}))
;;          (map :temp-value)
;;          (filter even?)
;;          (apply +)
;;          println
;;          time))

