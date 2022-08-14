(ns dashboard.views.sign-in
  (:require
   [reagent.core :as reagent]
   [comp.el :as c]
   [cljs-thread.re-frame :refer [dispatch subscribe]]
   [dashboard.footer :refer [copyright]]))

;;; Styles
(def classes
  (let [prefix "rmui-dash-sign-in"]
    {:avatar (str prefix "-avatar")
     :paper  (str prefix "-paper")
     :form   (str prefix "-form")
     :submit (str prefix "-submit")}))

(defn custom-sign-in-styles [{:keys [theme]}]
  (let [spacing            (:spacing theme)
        create-transitions (fn [& args]
                             (apply (-> theme :transitions :create)
                                    (apply clj->js args)))]
    {(str "& ." (:paper classes))   {:marginTop     (spacing 8)
                                     :display       "flex"
                                     :flexDirection "column"
                                     :alignItems    "center"}
     (str "& ." (:avatar classes)) {:margin          (spacing 1)
                                    :backgroundColor (-> theme :palette :secondary :main)}
     (str "& ." (:form classes))    {:width     "100%"  ; Fix IE 11 issue
                                     :marginTop (spacing 1)}
     (str "& ." (:submit classes)) {:margin (spacing 3 0 2)}}))

;; Components

(defn drawer-icon []
  [c/lock-icon])

(defn sign-in [{:keys [^js classes] :as props}]
  (let [form (reagent/atom {:userid "" :password "" :remember? false})
        errors (subscribe [:sign-in/errors])]
    (fn []
      [c/css-baseline]
      [:div {:class (:paper classes)
             :style {:marginTop     (str (* 8 8) "px")
                     :display       "flex"
                     :flexDirection "column"
                     :alignItems    "center"}}
       [c/avatar {:class (:avatar classes)}
        [c/lock-icon]]
       [c/text {:component "h1" :variant "h5"}
        "Sign in"]
       [c/list-items
        {:style {:padding 10}
         :padding 10}
        [:form {:class (:form classes)
                :on-submit (fn [e]
                             (js/console.log e)
                             (.preventDefault e)
                             (dispatch [:sign-in @form])
                             (reset! form {:userid "" :password "" :remember? (:remember? @form)}))
                :no-validate true}
         [c/input {:style        {:width "100%"}
                   :variant      "outlined"
                   :margin       "normal"
                   :required     true
                   :on-change    #(swap! form assoc :userid (-> % .-target .-value))
                   :value        (:userid @form)
                   :id           "email"
                   :label        "Email Address"
                   :name         "email"
                   :autoComplete "email"
                   :autoFocus    true}]
         [c/input {:style        {:width "100%"}
                   :variant      "outlined"
                   :margin       "normal"
                   :error        (:password @errors)
                   :helper-text   (:password @errors)
                   :required     true
                   :on-focus     #(dispatch [:sign-in/clear-errors :password])
                   :on-change    #(swap! form assoc :password (-> % .-target .-value))
                   :value        (:password @form)
                   :id           "password"
                   :label        "Password"
                   :name         "password"
                   :autoComplete "current-password"}]]]
       [c/list-item
        ;; {:align-items "flex-start"}
        [c/form-control-label
         {:control (reagent/as-element
                    [c/checkbox {:checked (:remember? @form)
                                 :on-change #(swap! form assoc :remember? (-> % .-target .-checked))
                                 :color "primary"}])
          :label "Remember me"}]]
       [c/button {:type "submit"
                  :style {:width "100%" :margin 20}
                  :variant "contained"
                  :color "primary"
                  :class (:submit classes)}
        "Sign In"]
       [c/container
        [c/item {:xs true}
         [c/link {:href "#" :variant "body2"}
          "Forgot password?"]]
        [c/item
         [c/link {:href "#" :variant "body2"}
          "Don't have an account? Sign Up"]]]])))

(defn main [{:keys [^js classes]}]
  [c/grid-container {:component "main" :max-width "xs"}
   [c/css-baseline]
   [(c/styled sign-in custom-sign-in-styles) classes]
   [c/box {:mt 8}
    [copyright]]])
