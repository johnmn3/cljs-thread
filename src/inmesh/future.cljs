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
  (let [ws (-> n (or (inc (u/num-cores))) (/ 2) int)]
    (->> ws range (map #(keyword (str "fp-" %))))))

(defn init-future! [& [{:as config-map :keys [future-ids]}]]
  (assert (e/in-future?))
  (when config-map
    (s/update-conf! config-map)
    (when future-ids
      (swap! s/future-pool update :available into future-ids))))

(defn start-futures [configs]
  (let [future-ids (mk-worker-ids (:future-count configs))
        future-conf (assoc configs :future-ids future-ids)]
    (spawn {:id :future :no-globals? true}
           (init-future! future-conf))
    (->> future-ids
         (mapv (fn [fid]
                 (spawn {:id fid :no-globals? true}
                        (s/update-conf! future-conf)))))))

(defn do-future [args afn opts]
  (let [fut-id (u/gen-id)]
    (in :future [args afn fut-id] ;; <- TODO: prevent implicit conveyer param duplication (dissallowed for arraybuffer transfers)
        (on-when (-> @s/future-pool :available seq) {:duration 5}
          (let [worker (take-worker!)]
            (in worker [args afn fut-id worker]
                (try
                  (if (seq args)
                    ((apply afn args)
                     #(sync/send-response {:request-id fut-id :response %}))
                    ((afn)
                     #(sync/send-response {:request-id fut-id :response %})))
                  (catch :default e
                    (sync/send-response {:request-id fut-id :response {:error (pr-str e)}})))
                (in :future
                    (put-back-worker! worker))))))
    (sync/wrap-derefable (merge opts {:id fut-id}))))
