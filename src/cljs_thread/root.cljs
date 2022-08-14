(ns cljs-thread.root
  (:require
   [cljs-thread.env :as e]
   [cljs-thread.state :as s]
   [cljs-thread.spawn :refer [spawn]]
   [cljs-thread.on-when :refer [on-when]]
   [cljs-thread.future :as f]
   [cljs-thread.injest :as i]
   [cljs-thread.util :as u]
   [cljs-thread.repl :as repl]))

(defn after-db [config]
  (spawn {:id :core}
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
        (do (spawn {:id :db :no-globals? true})
            (after-db config))
        (spawn {:id :db :no-globals? true}
               (after-db config))))))
