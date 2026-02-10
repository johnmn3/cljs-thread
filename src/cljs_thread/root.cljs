(ns cljs-thread.root
  (:require
   [cljs-thread.env :as e]
   [cljs-thread.state :as s]
   [cljs-thread.on-when :refer [on-watch]]
   [cljs-thread.msg :as m]
   [cljs-thread.future :as f]
   [cljs-thread.injest :as i]))

(defn ^:export init-root! [& [config-map]]
  (assert (e/in-root?))
  (when config-map
    (swap! s/conf merge config-map))
  (let [config @s/conf]
    ;; Pair core<->db if both are already spawned.
    ;; This runs as compiled code on the root worker, ensuring all fn
    ;; references resolve from shared.js (not screen.js) under advanced
    ;; compilation with code splitting.
    (when (and (get @s/peers :core) (get @s/peers :db))
      (m/pair-ids :core :db))
    (on-watch s/peers :db
      (f/start-futures config)
      (i/start-injests config))))
