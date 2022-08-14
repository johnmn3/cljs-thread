(ns dashboard.regs.shell
  (:require
   [dashboard.regs.db :as db]
   [re-frame.core :as rf]
   [cljs-thread.re-frame :refer [reg-sub]]))

;; subs
(reg-sub
 :drawer/open?
 (fn [db]
   (:drawer/open? db)))

(reg-sub
 :account-menu/open?
 (fn [db]
   (:account-menu/open? db false)))

;; events

(rf/reg-event-db
 :drawer/open
 db/app-state-interceptors
 (fn [db _]
   (assoc db :drawer/open? true)))

(rf/reg-event-db
 :drawer/close
 db/app-state-interceptors
 (fn [db _]
   (assoc db :drawer/open? false)))

(rf/reg-event-db
 :account-menu/open
 (fn [db _]
   (assoc db :account-menu/open? true)))

(rf/reg-event-db
 :account-menu/close
 (fn [db _]
   (assoc db :account-menu/open? false)))

(rf/reg-event-db
 :account-menu/toggle
 (fn [db _]
   (update db :account-menu/open? not)))
