(ns inmesh.future
  (:require-macros
   [inmesh.future])
  (:require
   [inmesh.util :as u]
   [inmesh.env :as e]
   [inmesh.spawn :refer [spawn]]
   [inmesh.on-when :refer [on-when]]
   [inmesh.in :refer [in]]
   [inmesh.state :as s]
   [inmesh.sync :as sync]))

(defn take-worker! []
  (when-let [p (some->> @s/future-pool :available first)]
    (swap! s/future-pool
           (fn [{:keys [available in-use]}]
             {:available (disj available p)
              :in-use (conj in-use p)}))
    p))

(defn put-back-worker! [p]
  (swap! s/future-pool
         (fn [{:keys [available in-use]}]
           {:available (conj available p)
            :in-use (disj in-use p)}))
  nil)

(defn mk-worker-ids [n]
  (let [ws (-> n (or (u/num-cores) (/ 2)))]
    (->> ws range (map #(keyword (str "fp-" %))))))

(defn init-future! [& [{:as config-map :keys [future-ids]}]]
  (assert (e/in-future?))
  (when config-map
    (s/update-conf! config-map)
    (when future-ids
      (swap! s/future-pool update :available into future-ids))))

(defn start-futures [configs]
  (when (or (:future configs) (:future-count configs) (:future-connect-string configs))
    (let [future-ids (mk-worker-ids (:future-count configs 4))
          future-conf (assoc configs :future-ids future-ids)]
      (spawn {:id :future :opts {:no-res? true}}
             (init-future! future-conf))
      (->> future-ids
           (mapv (fn [fid]
                   (spawn {:id fid :opts {:no-res? true}}
                          (s/update-conf! future-conf))))))))

(defn do-future [args afn opts]
  (let [fut-id (u/gen-id)]
    (in :future
        {:no-res? true}
        (on-when (-> @s/future-pool :available seq) {:duration 5}
          (let [worker (take-worker!)]
            (in worker
                {:no-res? true}
                (try
                  (if (seq args)
                    ((apply afn args)
                     #(sync/send-response {:request-id fut-id :response %}))
                    ((afn)
                     #(sync/send-response {:request-id fut-id :response %})))
                  (catch :default e
                    (sync/send-response {:request-id fut-id :response {:error (pr-str e)}})))
                (in :future
                    {:no-res? true}
                    (put-back-worker! worker))))))
    (sync/wrap-derefable (merge opts {:id fut-id}))))
