(ns cljs-thread.root
  (:require
   [cljs-thread.env :as e]
   [cljs-thread.state :as s]
   [cljs-thread.on-when :refer [on-watch]]
   [cljs-thread.future :as f]
   [cljs-thread.injest :as i]))

(defn ^:export init-root! [& [config-map]]
  (assert (e/in-root?))
  (when config-map
    (swap! s/conf merge config-map))
  (let [config @s/conf]
    (on-watch s/peers :db
      (f/start-futures config)
      (i/start-injests config))))
