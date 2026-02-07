(ns cljs-thread.state
  (:require
   [cljs-thread.env :as e]
   [cljs-thread.platform :as p]))

(defn shake
  [atm & {:keys [seconds msg limit effect]
          :or {seconds 30}}]
  (let [time-ms (* seconds 1000)
        limit-atom (atom limit)
        inter-atom (atom nil)
        action #(do (when msg (println (if (fn? msg)
                                         (msg)
                                         msg)))
                    (swap! atm identity)
                    (when limit
                      (if (< 1 @limit-atom)
                        (swap! limit-atom dec)
                        (js/clearInterval @inter-atom))))
        inter-id (-> action (js/setInterval time-ms))]
    (swap! inter-atom (constantly inter-id))))

(def initial-conf (merge {} (:conf e/data)))

(def conf (atom initial-conf))

(defn ^:export update-conf! [conf-map]
  (swap! conf merge conf-map))

(def peers (atom {}))

(shake peers :seconds 1 :limit 30)

(shake peers :seconds 30)

(def local-val (atom nil))

(when-not (e/in-screen?)
  (let [self (p/self-ref)]
    (swap! peers assoc :parent {:id :parent :w self :port self})
    (if (e/in-root?)
      (swap! peers assoc :screen {:id :screen :w self :port self})
      (swap! peers assoc :root {:id :root :w self :port self}))))

(def responses
  (atom {}))

(def requests
  (atom {}))

(def future-pool (atom {:available #{} :in-use #{}}))

(def idb (atom nil))
