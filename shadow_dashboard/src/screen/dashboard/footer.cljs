(ns dashboard.footer
  (:require
   [comp.el :as c]))

(defn copyright []
  [c/text {:variant "body2" :color "textSecondary" :align "center" :padding 5}
   [c/link {:color "inherit" :href "https://github.com/johnmn3/in.mesh"}
    "in.mesh dashboard "]
   (.getFullYear (js/Date.))])
