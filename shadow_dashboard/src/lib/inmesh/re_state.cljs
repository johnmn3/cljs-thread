(ns inmesh.re-state
  (:require
   [reagent.core :as r]))

(defonce ^:export subscriptions
  (r/atom {}))
