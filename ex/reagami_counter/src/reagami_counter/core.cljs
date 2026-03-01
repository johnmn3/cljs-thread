(ns reagami-counter.core
  (:require-macros [cljs-thread.core :refer [future in spawn]])
  (:require
   [cljs-thread.core :as t]
   [reagami.core :as reagami]
   ["d3" :as d3]
   ["canvas-confetti" :as confetti]))

;; we're in a worker right now...

(defonce state (t/atom ::state {:counter 0}))

(defn update-bar! [n]
  (-> (d3/select "#bar")
      (.transition)
      (.duration 300)
      (.attr "width" (str (* n 10) "%"))))

(defn my-component []
  [:div
   [:svg {:width "100%" :height 40}
    [:rect#bar {:x 0 :y 5 :height 30 :fill "#4CAF50" :rx 4 :width 0}]]
   [:div "Counted: " @(future (* 100 (:counter @state)))]
   [:button
    {:on-click #(let [n (:counter (swap! state update :counter inc))]
                  (update-bar! n)
                  (when (= n 10)
                    (confetti #js {:particleCount 200 :spread 70})))}
    "Click me!"]])

(defn render []
  (reagami/render (.querySelector js/document "#app") [my-component]))

(def renderer
  (spawn ::renderer
    (add-watch state ::render (fn [_ _ _ _] (render)))))

(defn ^:export main []
  (in renderer (render)))
