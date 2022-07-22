(ns dashboard.views.home-panel
  (:require
   [inmesh.re-frame :as rf :refer [dispatch subscribe]]
   [dashboard.footer :refer [copyright]]
   [reagent.core :refer [adapt-react-class]]
   ["react-chartjs-2" :refer [Line]]
   [comp.el :as c]))

;; Components

(defn drawer-icon []
  [c/home])

(def data-6-hours
  (clj->js
   {:labels ["9:00" "10:00" "11:00" "12:00" "1:00" "2:00" "3:00"]
    :datasets
    [{:label "Events Last 6 Hours"
      :fill false
      :lineTension "0.1"
      :borderColor "#ef5350"
      :borderCapStyle "butt"
      :borderDash []
      :borderDashOffset "0.0"
      :borderJoinStyle "miter"
      :pointBorderColor "#ef5350"
      :pointBackgroundColor "#ef5350"
      :pointBorderWidth 1
      :pointHoverRadius 5
      :pointHoverBackgroundColor "rgba(75,192,192,1)"'
      :pointHoverBorderColor "rgba(220,220,220,1)"
      :pointHoverBorderWidth 2
      :pointRadius 1
      :pointHitRadius 10
      :data [65, 59, 80, 81, 56, 55, 40]}]}))

(def data-week
  (clj->js
   {:labels ["Monday" "Tuesday" "Wednesday" "Thursday" "Friday" "Saturday" "Sunday"]
    :options {:legend {:display false}}
    :datasets
    [{:label "Events Last Week"
      :fill false
      :lineTension "0.1"
      :borderColor "#ef5350"
      :borderCapStyle "butt"
      :borderDash []
      :borderDashOffset "0.0"
      :borderJoinStyle "miter"
      :pointBorderColor "#ef5350"
      :pointBackgroundColor "#ef5350"
      :pointBorderWidth 1
      :pointHoverRadius 5
      :pointHoverBackgroundColor "rgba(75,192,192,1)"'
      :pointHoverBorderColor "rgba(220,220,220,1)"
      :pointHoverBorderWidth 2
      :pointRadius 1
      :pointHitRadius 10
      :data [124, 144, 133, 277, 156, 188, 140]}]}))


(defn chart [{:keys [^js classes]}]
  (let [chart-data (rf/subscribe [:home-panel/chart-data])]
    [:<>
     [c/container {:justifyContent "space-between"}
      [c/item
       [c/text {:component "h2" :variant "h6" :color "primary" :gutter-bottom true}
        "Events"]]
      [c/item]]
     [c/container {:align-items "center" :spacing {:xs 2} :columns {:xs 6 :sm 6 :md 12}} ;{:style {:height 200 :width 800}}
      [c/item {:xs 6 :sm 6 :md 6 :style {:min-width 250}}
        [:> Line {:ref "chart" :data data-6-hours :options (clj->js {:plugins {:legend {:labels {:boxWidth 0}}}})}]]
      [c/item {:xs 6 :sm 6 :md 6 :style {:min-width 250}}
        [:> Line {:ref "chart" :data data-week :options (clj->js {:plugins {:legend {:labels {:boxWidth 0}}}})}]]]]))

(defn deposits [{:keys [^js classes]}]
  [:<>
   [c/text {:component "h2" :variant "h6" :color "primary" :gutter-bottom true}
    "Last 168 Hours"]
   [c/text {:component "p" :variant "h4"}
    "1,237"]
   [c/text {:color "textSecondary" :style {:flex 1}} ; :class (.-depositContext classes)
    "Total Events in the Last Week"]
   [:div
    [c/link {:color "primary" :href "#" :on-click #(.preventDefault %)}
     "View events"]]])

(defn table-row [{:keys [date name ship-to payment-method amount]}]
  [c/table-row
   [c/table-cell date]
   [c/table-cell name]
   [c/table-cell ship-to]
   [c/table-cell payment-method]
   [c/table-cell {:align "right"} (str (apply str (take 20 amount)) "...")]])


(defn orders [{:keys [^js classes]}]
  (let [orders (rf/subscribe [:home-panel/orders])]
    [:<>
     [c/text {:component "h2" :variant "h6" :color "primary" :gutter-bottom true}
      "Log"]
     [c/table {:size "small"}
      [c/table-head
       [c/table-row
        [c/table-cell "Date"]
        [c/table-cell "Message"]
        [c/table-cell "Customer"]
        [c/table-cell "GUID"]
        [c/table-cell {:align "right"} "Session ID"]]]
      [c/table-body
       (for [order @orders]
         ^{:key (:id order)} [table-row order])]]]))

(defn main [{:keys [^js classes]}]
  [c/grid-container {:max-width "lg" :class (:container classes)}
   [c/css-baseline]
   [c/container {:spacing 3}
    [c/item {:xs 12 :md 8 :lg 9}
     [c/paper {:class [(:paper classes) (:fixedHeight classes)]}
      [chart {:classes classes}]]]
    [c/item {:xs 12 :md 4 :lg 3}
     [c/paper {:class [(:paper classes) (:fixedHeight classes)]}
      [deposits {:classes classes}]]]
    [c/item {:xs 12}
     [c/paper {:class (:paper classes)}
      [orders {:classes classes}]]]]
   [c/container {:spacing 3}]

   [c/box {:pt 4}
    [copyright]]])
