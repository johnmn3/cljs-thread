(ns inmesh.re-frame
  (:require
   [reagent.ratom :as ra]
   [re-frame.core :as re-frame]
   [reagent.core :as r]
  ;;  [inmesh.on-when :refer [on-when]]
  ;;  [inmesh.idb :as idb]
   [inmesh.core :as mesh :refer [in]]
   [inmesh.env :as env]))

;; (def open? (atom nil))
#_
(defn db-open? []
  (if @open?
    true
    (reset! open? @(in :db @idb/open?))))

(def ^:export reg-sub
  (if-not (env/in-core?)
    identity
    (fn [& args]
      (apply re-frame/reg-sub args))))

(defonce ^:export subscriptions
  (r/atom {}))

(defn ^:export dispatch
  [event]
  (if (env/in-core?)
    (re-frame/dispatch event)
    (in :core {:no-res? true}
        ;(on-when (db-open?))
        ;; (println :dispatch (:id env/data) :in-core event)
        (re-frame.core/dispatch event))))

(defonce ^:export trackers
  (atom {}))

(defn- ^:export reg-tracker
  [ts id sub-v]
  (if ts
    (update ts :subscribers conj id)
    (let [new-sub (re-frame/subscribe sub-v)]
      ;; (println :new-sub (:id env/data) sub-v new-sub)
      {:tracker (r/track!
                 #(let [sub @new-sub]
                    ;; (println :new-sub-in-fn (:id env/data) sub-v sub)
                    ;(on-when (db-open?))
                    ;; (println :reg-tracker (:id env/data) :adding-sub sub-v :in-screen-finally)
                    @(in :screen #_{:no-res? true} (swap! subscriptions assoc sub-v sub)))
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
          @(in :screen #_{:no-res? true} (swap! subscriptions dissoc sub-v))
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
      (in :core {:no-res? true}
          ;(on-when @(in :db @idb/open?))
          ;; (println :subscribe (:id env/data) :sub-v sub-v)
          (add-sub [id sub-v]))
      (ra/make-reaction
       #(get @subscriptions sub-v alt)
       :on-dispose
       #(in :core {:no-res? true} (dispose-sub [id sub-v]))))))
