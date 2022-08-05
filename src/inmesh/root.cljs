(ns inmesh.root
  (:require
   [inmesh.env :as e]
   [inmesh.state :as s]
   [inmesh.spawn :refer [spawn]]
   [inmesh.on-when :refer [on-when]]
   [inmesh.future :as f]
   [inmesh.injest :as i]
   [inmesh.util :as u]
   [inmesh.repl :as repl]))

(defn after-db [config]
  (spawn {:id :core :opts {:no-res? true}}
         (s/update-conf! config)
         (on-when (contains? @s/peers :db)
                  (reset! s/ready? true)))
  (repl/start-repl config))

(defn ^:export init-root! [& [config-map]]
  (assert (e/in-root?))
  (when config-map
    (swap! s/conf merge config-map))
  (let [config @s/conf]
    (on-when (contains? @s/peers :sw)
      (f/start-futures config)
      (i/start-injests config)
      (if (u/in-safari?)
        (do (spawn {:id :db :opts {:no-res? true}}
                   (println :in-db :spawn-effect))
            (after-db config))
        (spawn {:id :db :opts {:no-res? true}}
               (after-db config))))))
