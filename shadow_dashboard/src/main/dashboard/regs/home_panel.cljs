(ns dashboard.regs.home-panel
  (:require
   [day8.re-frame.tracing :refer-macros [fn-traced]]
   [re-frame.core :as rf :refer [subscribe]]
   [inmesh.core :as mesh :refer [in]]
   [inmesh.re-frame :refer [reg-sub dispatch]]))

;;; Subs

(rf/reg-sub
 :home-panel/orders
 (fn [db]
   (:home-panel/orders db)))

(rf/reg-sub
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
