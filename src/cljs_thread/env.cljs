(ns cljs-thread.env
  (:require
   [cljs-thread.util :as u]))

(defn in-screen? [] (-> js/self .-document undefined? not))

(def data
  (let [loc-search js/location.search]
    (if-not (seq loc-search)
      (if (in-screen?)
        {:id :screen}
        {:id :root})
      (u/decode-qp loc-search))))

(defn in-root? []
  (-> data :id (= :root)))

(defn in-sw? []
  (-> data :id (= :sw)))

(defn in-core? []
  (-> data :id (= :core)))

(defn in-future? []
  (-> data :id (= :future)))

(defn in-branch? []
  (and (not (in-screen?)) (not (in-root?))))

(def current-browser
  (u/browser-type))
