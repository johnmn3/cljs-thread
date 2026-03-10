(ns cljs-thread.env
  (:require
   [cljs-thread.platform :as p]
   [cljs-thread.util :as u]))

(defn in-screen? [] (p/in-screen?))

(def data (p/init-data))

(defn in-sw? []
  (-> data :id (= :sw)))

(defn in-core? []
  (-> data :id (= :core)))

(defn in-future? []
  (-> data :id (= :future)))

(def current-browser
  (u/browser-type))
