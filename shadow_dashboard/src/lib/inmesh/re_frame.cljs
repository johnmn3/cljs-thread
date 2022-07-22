(ns inmesh.re-frame
  (:require
   [reagent.ratom :as ra]
   [re-frame.core :as re-frame]
   [reagent.core :as r]
   [inmesh.core :as mesh :refer [in]]))

(def reg-sub
  (if-not (mesh/in-core?)
    identity
    (fn [& args]
      (apply re-frame/reg-sub args))))

(defonce subscriptions
  (r/atom {}))

(defn dispatch
  [event]
  (if (mesh/in-core?)
    (re-frame/dispatch event)
    (in :core {:no-res? true} (re-frame.core/dispatch event))))

(defonce trackers
  (atom {}))

(defn- reg-tracker
  [ts id sub-v]
  (if ts
    (update ts :subscribers conj id)
    (let [new-sub (re-frame/subscribe sub-v)]
      {:tracker (r/track!
                 #(let [sub @new-sub]
                    (in :screen {:no-res? true} (swap! subscriptions assoc sub-v sub)))
                 [])
       :subscribers #{id}})))

(defn add-sub
  [[id sub-v]]
  (swap! trackers update sub-v reg-tracker id sub-v))

(defn- unreg-tracker
  [ts id sub-v]
  (if-let [t (get ts sub-v)]
    (let [{:keys [tracker subscribers]} t
          new-subscribers (disj subscribers id)]
      (if (< 0 (count new-subscribers))
        (assoc ts sub-v {:tracker tracker :subscribers new-subscribers})
        (do
          (r/dispose! tracker)
          (in :screen {:no-res? true} (swap! subscriptions dissoc sub-v))
          (dissoc ts sub-v))))
    ts))

(defn dispose-sub
  [[id sub-v]]
  (swap! trackers unreg-tracker id sub-v))

(defn subscribe
  [sub-v & [alt]]
  (if (mesh/in-core?)
    (re-frame/subscribe sub-v)
    (let [id (str (random-uuid))]
      (in :core {:no-res? true} (add-sub [id sub-v]))
      (ra/make-reaction
       #(get @subscriptions sub-v alt)
       :on-dispose
       #(in :core {:no-res? true} (dispose-sub [id sub-v]))))))
