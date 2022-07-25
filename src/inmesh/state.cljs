(ns inmesh.state
  (:require
   [inmesh.env :as e]
   [inmesh.util :as u]))

(def initial-conf (merge {} (:conf e/data)))

(def conf (atom initial-conf))

(defn ^:export update-conf! [conf-map]
  (swap! conf merge conf-map))

(def peers (atom {}))

(def local-val (atom nil))

(when-not (e/in-screen?)
  (swap! peers assoc :parent {:id :parent :w js/self :port js/self})
  (when (e/in-root?)
    (swap! peers assoc :screen {:id :screen :w js/self :port js/self})))

(def responses
  (atom {}))

(def future-pool (atom {:available #{} :in-use #{}}))

(def fallback-db (atom {}))

(def idb (atom nil))

(def ready? (atom false))
