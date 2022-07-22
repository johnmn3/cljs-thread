(ns dashboard.screen
  (:require
   [reagent.dom :as rdom]
   [comp.el :as comp]
   [inmesh.re-frame :as rf :refer [dispatch subscribe]]
   [day8.re-frame.tracing :refer-macros [fn-traced]]
   [dashboard.routes :as routes]
   [dashboard.shell :as shell]))

;;; Config

(def debug?
  ^boolean goog.DEBUG)

(defn dev-setup []
  (when debug?
    (println "dev mode")))

;; Styles
(defn custom-theme [dark-theme?]
  {:palette {:mode (if dark-theme? "dark" "light")
             :primary {:main "#ef5350"}
             :secondary {:main "#3f51b5"}}
   :status {:danger "red"}})

;; Views

(defn main-shell [{:keys [router]}]
  (let [dark-theme? @(rf/subscribe [:dark-theme?])]
    [:<>
     [comp/css-baseline]
     [comp/theme-provider (comp/create-theme (custom-theme dark-theme?))
      [shell/styled-dashboard]]]))

;;; Setup on screen

(defn ^{:after-load true, :dev/after-load true} mount-root []
  (routes/init-routes!)
  (rdom/render [main-shell]
               (.getElementById js/document "app")))

(defn init! []
  (dev-setup)
  (mount-root))
