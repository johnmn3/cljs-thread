(ns dashboard.core
  (:require
   [re-frame.core :as rf :refer [dispatch dispatch-sync]]
   [inmesh.re-frame :refer [dispatch]]
   [dashboard.regs.db]
   [dashboard.regs.home-panel]
   [dashboard.regs.shell]
   [dashboard.regs.sign-in]
   [inmesh.core :as mesh :refer [in]]))

(defn init! []
  (rf/dispatch-sync [:initialize-db])
  (rf/clear-subscription-cache!))
