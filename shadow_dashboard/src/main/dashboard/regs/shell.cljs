(ns dashboard.regs.shell
  (:require
   [day8.re-frame.tracing :refer-macros [fn-traced]]
   [re-frame.core :as rf :refer [subscribe]]
   [inmesh.core :as mesh :refer [in]]
   [inmesh.re-frame :refer [reg-sub dispatch]]))

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
 (fn [db _]
   (assoc db :drawer/open? true)))

(rf/reg-event-db
 :drawer/close
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
