(ns cljs-thread.re-frame
  (:require
   [reagent.ratom :as ra]
   [re-frame.core :as re-frame]
   [reagent.core :as r]
   [cljs-thread.re-state :as state]
   [cljs-thread.core :refer [in]]
   [cljs-thread.env :as env]))

(def ^:export reg-sub
  (if-not (env/in-core?)
    identity
    (fn [& args]
      (apply re-frame/reg-sub args))))

(defn ^:export dispatch
  [event]
  (if (env/in-core?)
    (re-frame/dispatch event)
    (in :core (re-frame.core/dispatch event))))

(defonce ^:export trackers
  (atom {}))

(defn- ^:export reg-tracker
  [ts id sub-v]
  (if ts
    (update ts :subscribers conj id)
    (let [new-sub (re-frame/subscribe sub-v)]
      {:tracker (r/track!
                 #(let [sub @new-sub]
                    @(in :screen (swap! state/subscriptions assoc sub-v sub)))
                 [])
       :subscribers #{id}})))

(defn ^:export add-sub
  [[id sub-v]]
  (swap! trackers update sub-v reg-tracker id sub-v))

(defn- ^:export unreg-tracker
  [ts id sub-v]
  (if-let [t (get ts sub-v)]
    (let [{:keys [tracker subscribers]} t
          new-subscribers (disj subscribers id)]
      (if (< 0 (count new-subscribers))
        (assoc ts sub-v {:tracker tracker :subscribers new-subscribers})
        (do
          (r/dispose! tracker)
          @(in :screen (swap! state/subscriptions dissoc sub-v))
          (dissoc ts sub-v))))
    ts))

(defn ^:export dispose-sub
  [[id sub-v]]
  (swap! trackers unreg-tracker id sub-v))

(defn ^:export subscribe
  [sub-v & [alt]]
  (if (env/in-core?)
    (re-frame/subscribe sub-v)
    (let [id (str (random-uuid))]
      (in :core (add-sub [id sub-v]))
      (ra/make-reaction
       #(get @state/subscriptions sub-v alt)
       :on-dispose
       #(in :core (dispose-sub [id sub-v]))))))
