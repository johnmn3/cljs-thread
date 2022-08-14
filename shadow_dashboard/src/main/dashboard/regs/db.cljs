(ns dashboard.regs.db
  (:require
   [re-frame.core :as rf]
   [cljs-thread.env :refer [in-core?]]
   [cljs-thread.re-frame :refer [reg-sub]]
   [cljs-thread.db :refer [db-get db-set!]]))
 
(def ls-key "local-store")

(defn app-state->local-store
  "Puts app-state into local forage"
  [app-state]
  (db-set! ls-key app-state))

(def ->local-store (rf/after app-state->local-store))

(def app-state-interceptors
  [->local-store
   rf/trim-v])

(when (in-core?)
    (rf/reg-cofx
     :local-store
     (fn [cofx second-param]
       (let [local-store (or (db-get ls-key) {})]
         (assoc cofx :app-state local-store)))))

(def default-db
  {:dark-theme? false
   :drawer/open? true
   :home-panel/orders [{:id 0
                        :date "16 July, 2022"
                        :name "Restarted"
                        :ship-to "Acme Global"
                        :payment-method "5bc114e6-15cf-4e99-8251-6c2e0c543337"
                        :amount "e59b5976-256a-4ecc-aeea-a926461c71cd"}
                       {:id 1
                        :date "16 July, 2022"
                        :name "Heartbeat failed"
                        :ship-to "Energy Enterprise"
                        :payment-method "b73ff5ab-9fe3-4395-8564-c01f77cb5dac"
                        :amount "d460d8df-132d-4712-a780-641114d9dcf5"}
                       {:id 2
                        :date "16 July, 2022"
                        :name "Authentication failed"
                        :ship-to "General Statistics"
                        :payment-method "f4a15ae0-59a5-478a-9958-1ff6a617c363"
                        :amount "d460d8df-132d-4712-a780-641114d9dcf5"}
                       {:id 3
                        :date "16 July, 2022"
                        :name "Reconnecting to DB"
                        :ship-to "Fusion Star Inc"
                        :payment-method "34c50198-c808-4841-b2e1-434be4f09534"
                        :amount "2425173b-4659-49f6-a4ce-8448dcae4475"}
                       {:id 4
                        :date "15 July, 2022"
                        :name "Purging logs"
                        :ship-to "Big Agri Corp"
                        :payment-method "a769f187-ee18-46f4-8d65-a2141b4634e2"
                        :amount "2425173b-4659-49f6-a4ce-8448dcae4475"}]
   :home-panel/chart-data [{:time "00:00" :amount 0}
                           {:time "03:00" :amount 300}
                           {:time "06:00" :amount 600}
                           {:time "09:00" :amount 800}
                           {:time "12:00" :amount 1500}
                           {:time "15:00" :amount 2000}
                           {:time "18:00" :amount 2400}
                           {:time "21:00" :amount 2400}
                           {:time "24:00" :amount nil}]
   :album/cards (range 1 10)
   :pricing/tiers [{:title "Free"
                    :price "0"
                    :description ["10 users included"
                                  "2 GB of storage"
                                  "Help center access"
                                  "Email support"]
                    :button-text "Sign up for free"
                    :button-variant "outlined"}
                   {:title "Pro"
                    :subheader "Most popular"
                    :price "15"
                    :description ["20 users included"
                                  "10 GB of storage"
                                  "Help center access"
                                  "Priority email support"]
                    :button-text "Get started"
                    :button-variant "contained"}
                   {:title "Enterprise"
                    :price "30"
                    :description ["50 users included"
                                  "30 GB of storage"
                                  "Help center access"
                                  "Phone & email support"]
                    :button-text "Contact us"
                    :button-variant "outlined"}]
   :pricing/footers [{:title "Company"
                      :description ["Team" "History" "Contact us" "Locations"]}
                     {:title "Features"
                      :description ["Cool stuff" "Random feature"
                                    "Team feature" "Developer stuff" "Another one"]}
                     {:title "Resources"
                      :description ["Resource" "Resource name" "Another resource" "Final resource"]}
                     {:title "Legal"
                      :description ["Privacy policy" "Terms of use"]}]})

;; subs

(reg-sub
 :db
 (fn [db]
   db))

(reg-sub
 :dark-theme?
 (fn [db]
   (:dark-theme? db)))

(reg-sub
 :errors
 (fn [db]
   (:errors db)))

;;; events

(rf/reg-event-fx
 :initialize-db
 [(rf/inject-cofx :local-store)]
 (fn [{:as cofx :keys [db app-state]} second-param]
   (let [new-db (merge default-db (or app-state {}))]
     {:db new-db})))

(rf/reg-event-db
 :toggle-dark-theme
 app-state-interceptors
 (fn [app-state [stuff s2]]
   (update app-state :dark-theme? not)))
