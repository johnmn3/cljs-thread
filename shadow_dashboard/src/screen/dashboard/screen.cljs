(ns dashboard.screen
  (:require
   [reagent.dom :as rdom]
   [comp.el :as c]
   [cljs-thread.core :as thread]
   [cljs-thread.env :as env]
   [cljs-thread.re-frame :refer [subscribe]]
   [dashboard.routes :as routes]
   [dashboard.shell :as shell]))

;;; Config
(enable-console-print!)

;; Zero-config: auto-detects worker scripts from manifest.edn,
;; auto-installs fat-kernel strategy when SAB is available.
;; Guard needed: workers load screen.js via catch-and-load.
(when (env/in-screen?)
  (thread/init!))

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
  (let [dark-theme? @(subscribe [:dark-theme?])]
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
  (when (env/in-screen?)
    (dev-setup)
    (mount-root)))
