(ns dashboard.screen
  (:require
   [reagent.dom :as rdom]
   [comp.el :as c]
   [inmesh.core :as mesh]
   [inmesh.state :as state]
   [inmesh.re-frame :as rf :refer [dispatch subscribe]]
   [dashboard.routes :as routes]
   [dashboard.shell :as shell]))

;;; Config
(enable-console-print!)


(mesh/init!
 {:sw-connect-string "/sw.js"
  :repl-connect-string "/repl.js"
  :core-connect-string "/core.js"
  :future true
  :injest true})

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
     [c/css-baseline]
     [c/theme-provider (c/create-theme (custom-theme dark-theme?))
      [shell/styled-dashboard]]]))

;;; Setup on screen

(defn ^{:after-load true, :dev/after-load true} mount-root []
  (routes/init-routes!)
  (rdom/render [main-shell]
               (.getElementById js/document "app")))

(defn init! []
  (dev-setup)
  (mount-root))
