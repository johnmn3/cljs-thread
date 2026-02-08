(ns cljs-thread.injest
  (:require-macros
   [cljs-thread.injest])
  (:require
   [cljs-thread.util :as u]
   [cljs-thread.state :as s]
   [cljs-thread.spawn :refer [spawn]]
   [cljs-thread.in :refer [in]]))

(defn mk-injest-ids [& [n]]
  (let [ws (-> n (or (inc (u/num-cores))) (/ 2) int)]
    (->> ws range (map #(keyword (str "injest-" %))))))

(defn start-injests [configs]
  (let [injests (-> configs :injest-count mk-injest-ids)]
    (->> injests
         (mapv (fn [wid]
                 (spawn {:id wid}
                        (s/update-conf! configs)))))))

;; Anchor common core predicates in the shared module so Closure doesn't
;; move them to screen.js via cross-module code motion.  Functions referenced
;; only from screen-side code get local names (e.g. lJ) that are unavailable
;; when eval'd on workers.  Exporting these refs forces $APP.xxx names.
(def ^:export core-preds
  {:odd? odd? :even? even? :zero? zero? :pos? pos? :neg? neg?
   :number? number? :string? string? :keyword? keyword?
   :int? int? :nil? nil?})

(defn ^:export compose-xf [xfs]
  (->> xfs
       (map #(if-not (coll? %)
               %
               (if (= 1 (count %))
                 (first %)
                 (apply (first %) (rest %)))))
       (apply comp)))

(def ^:dynamic *par* nil)
(def ^:dynamic *chunk* nil)
(defn ^:export fan [conveyer xf args & {:keys [par chunk]}]
  (let [injest-count (:injest-count @s/conf 4)
        n-pws (or *par* par (* injest-count 8))
        pws (take n-pws (cycle (mk-injest-ids (:injest-count @s/conf))))
        args-parts (partition-all n-pws (partition-all (or *chunk* chunk 512) args))]
    (->> args-parts
         (map (fn [ags]
                (->> ags
                     (mapv (fn [p a]
                             (in p
                                 (let [xf-fn (if (string? xf)
                                               (js/eval (str "(function(){return(" xf ");})();"))
                                               xf)]
                                   (sequence (apply xf-fn conveyer) a))))
                           pws))))
         (mapcat #(map deref %))
         (apply concat))))
