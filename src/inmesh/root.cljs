(ns inmesh.root
  (:require
   [inmesh.env :as e]
   [inmesh.state :as s]
   [inmesh.spawn :refer [spawn]]
   [inmesh.spawn :as sp]
   [inmesh.on-when :refer [on-when]]
   [inmesh.future :as f]
   [inmesh.injest :as i]
   [inmesh.in :refer [in]]
   [inmesh.idb :as idb]))

(defn start-repl [configs]
  (when (and goog/DEBUG (:repl-connect-string configs))
    (spawn {:id :repl :opts {:no-res? true}}
           (s/update-conf! configs))))

(defn ^:export init-root! [& [config-map]]
  (assert (e/in-root?))
  (when config-map
    (swap! s/conf merge config-map))
  (let [config @s/conf]
    (on-when (contains? @s/peers :sw)
      (f/start-futures config)
      (i/start-injests config)
      (spawn {:id :db :opts {:no-res? true}}
             (idb/idb-open))
      (spawn {:id :core :opts {:no-res? true}}
             (s/update-conf! config))
      (start-repl config)
      (in :core (reset! s/ready? true)))))
