(ns dashboard.shell
  (:require
   [clojure.pprint :as pp]
   [reagent.core :as reagent]
   [comp.el :as c]
   [re-frame.core]
   [inmesh.re-frame :as rf :refer [dispatch subscribe]]
   [reitit.frontend.easy :as rfe]
   [dashboard.routes :as routes]
   [reitit.core :as reitit]
   [inmesh.core :as mesh :refer [in]]))

;; styles

(def classes
  (let [prefix "rmui-dash"]
    {:root               (str prefix "-root")
     :toolbar            (str prefix "-toolbar")
     :toolbar-icon       (str prefix "-toolbar-icon")
     :app-bar            (str prefix "-app-bar")
     :app-bar-shift      (str prefix "-app-bar-shift")
     :menu-button        (str prefix "-menu-button")
     :menu-button-hidden (str prefix "-menu-button-hidden")
     :title              (str prefix "-title")
     :drawer-paper       (str prefix "-drawer-paper")
     :drawer-paper-close (str prefix "-drawer-paper-close")
     :app-bar-spacer     (str prefix "-app-bar-spacer")
     :content            (str prefix "-content")
     :container          (str prefix "-container")
     :paper              (str prefix "-paper")
     :fixed-height       (str prefix "-fixed-height")}))

(def drawer-width 240)

(defn custom-styles [{:as theme-m :keys [theme]}]
  (let [spacing            (:spacing theme)
        create-transitions (fn [& args]
                             (apply (-> theme :transitions :create)
                                    (apply clj->js args)))]
    {
     (str "&." (:root classes))          {:display "flex"}
     (str "&." (:toolbar classes))       {:padding-right 24}
     (str "&." (:toolbar-icon classes))  {:display        "flex"
                                          :align-items     "center"
                                          :justify-content "flex-end"
                                          :padding        "0 8px"}
     (str "& ." (:app-bar classes))       {:z-index     (+ (-> theme :z-index :drawer) 1)
                                           :transition (let [create (-> theme :transitions :create)]
                                                         (create #js ["width" "margin"]
                                                                 #js {:easing   (-> theme :transitions :easing :sharp)
                                                                      :duration (-> theme :transitions :duration :leaving-screen)}))}
     (str "& ." (:app-bar-shift classes)) {:margin-left drawer-width
                                           :width      (str "calc(100% - " drawer-width "px)")
                                           :transition (let [create (-> theme :transitions :create)]
                                                         (create #js ["width" "margin"]
                                                                 #js {:easing   (-> theme :transitions :easing :sharp)
                                                                      :duration (-> theme :transitions :duration :entering-screen)}))}
     (str "& ." (:menu-button classes)) {:margin-right 36}
     (str "& ." (:title classes)) {:flexGrow 1}
     (str "& ." (:drawer-paper classes)) {:position   "relative"
                                          :white-space "nowrap"
                                          ;; :left 20
                                          :top (-> theme :mixins :toolbar :min-height (+ 8))
                                          :width drawer-width
                                          :transition (let [create (-> theme :transitions :create)]
                                                        (create "width"
                                                                #js {:easing   (-> theme :transitions :easing :sharp)
                                                                     :duration (-> theme :transitions :duration :leaving-screen)}))}
     (str "& ." (:drawer-paper-close classes)) {:overflow-x                   "hidden"
                                                :transition                  (let [create (-> theme :transitions :create)]
                                                                               (create "width"
                                                                                       #js {:easing   (-> theme :transitions :easing :sharp)
                                                                                            :duration (-> theme :transitions :duration :entering-screen)}))
                                                :width                       (spacing 4)
                                                ((-> theme :breakpoints :up) "sm") {:width (spacing 6)}}
     (str "& ." (:app-bar-spacer classes)) (-> theme :mixins :toolbar)
     (str "& ." (:content classes)) {:flexGrow 1
                                     :margin 20
                                     :height   "100vh"
                                     :overflow "auto"}
     (str "& ." (:container classes)) {:padding-top    (spacing 4)
                                       :padding-bottom (spacing 4)}
     (str "& ." (:paper classes)) {:padding       (spacing 4)
                                   :display       "flex"
                                   :overflow      "auto"
                                   :flex-direction "column"}
     (str "& ." (:fixed-height classes)) {:height 240}}))

;;; Components

(defn list-item [{:keys [selected route-name text icon]}]
  [c/list-item {:style {:padding 10}
                :button true
                :selected selected
                :on-click #(rfe/push-state route-name)}
   [c/list-item-icon [icon]]
   [c/list-item-text {:primary text}]])

(defn account-menu []
  (let [anchor-el (reagent/atom nil)]
    (fn []
      (let [a-open? @(rf/subscribe [:account-menu/open?])
            a-close #(rf/dispatch [:account-menu/toggle])]
        [:div
         [c/icon-button {:on-click #(do (rf/dispatch [:account-menu/toggle])
                                        (reset! anchor-el (.-currentTarget %)))}
          [c/avatar]]
         [c/menu {:anchor-el @anchor-el
                  :open (boolean a-open?)
                  :on-close a-close
                  :on-click a-close
                  :keepMounted true
                  :transformOrigin {:horizontal "right" :vertical "top"}
                  :anchorOrigin {:horizontal "right" :vertical "bottom"}}
          [c/menu-item
            [c/list-item-icon
             [c/account-circle]]
            "Sign In"]
          [c/divider]
          [c/menu-item
            [c/list-item-icon
             [c/exit-to-app {:fontSize "small"}]]
            "Logout"]]]))))

(defn dashboard [{:as stuff :keys [class-name]}]
    (let [open? @(rf/subscribe [:drawer/open?])
          dark-theme? @(rf/subscribe [:dark-theme?])
          router routes/router
          current-route @(re-frame.core/subscribe [:current-route])]
      [c/box {:class [class-name (:root classes)]}
       [c/app-bar {:position "absolute"
                   :class [(:app-bar classes)]}
        [c/toolbar {:class (:toolbar classes)}
         [c/icon-button {:edge "start"
                         :color "inherit"
                         :aria-label "open drawer"
                         :on-click #(if open?
                                      (rf/dispatch [:drawer/close])
                                      (rf/dispatch [:drawer/open]))
                         :class [(:menu-button classes)]}
          [c/menu-icon]]
         [c/text {:component "h1"
                  :variant "h6"
                  :color "inherit"
                  :no-wrap true
                  :class (:title classes)}
          "Acme Analytics"]
         [c/icon-button {:color "inherit"}
          [c/badge {:badgeContent 4 :color "secondary"}]
          [c/notifications]]
         [account-menu {}]]]

       [c/drawer {:variant "permanent"
                  :classes {:paper (str (:drawer-paper classes) " "
                                        (if open? "" (:drawer-paper-close classes)))}
                  :open open?}
        [:div {:class (:toolbar-icon classes)}]
        [c/divider]
        [c/list-items
         (for [route-name (reitit/route-names router)
               :let [route (reitit/match-by-name router route-name)
                     text (-> route :data :link-text)
                     icon (-> route :data :icon)
                     selected? (= route-name (-> current-route :data :name))]]
           ^{:key route-name} [list-item {:text text
                                          :icon icon
                                          :route-name route-name
                                          :selected selected?}])]
        [c/divider]
        [c/list-items
         [c/list-item {:button true
                       :style {:left 5 :top 10}
                       :on-click #(rf/dispatch [:toggle-dark-theme])}
          [c/list-item-icon [c/switch {:size "small" :checked (or dark-theme? false)}]]
          [c/list-item-text {:primary "Toggle Theme"}]]]]
       [:main {:class (:content classes)}
        [:div {:class (:app-bar-spacer classes)}]
        (when current-route
          [(-> current-route :data :view) {:classes classes}])]]))

(def styled-dashboard (c/styled dashboard custom-styles))
