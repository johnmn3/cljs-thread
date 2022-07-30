(ns dashboard.regs.home-panel
  (:require
   [re-frame.core :as rf]
   [inmesh.re-frame :refer [reg-sub]]))

;;; Subs

(reg-sub
 :home-panel/orders
 (fn [db]
   (:home-panel/orders db)))

(reg-sub
 :home-panel/chart-data
 (fn [db]
   (:home-panel/chart-data db)))

;;; Events

(rf/reg-event-db
 :home-panel/randomize-chart
 (fn [db _]
   (update db :home-panel/chart-data
           (fn [data]
             (for [d data
                   :let [time (:time d)
                         amount (rand-int 3000)]]
               {:time time :amount amount})))))
