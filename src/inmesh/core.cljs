(ns inmesh.core
  (:require-macros [inmesh.core :refer [future spawn in wait future =>> on-when]])
  (:require
   [inmesh.util :as u]
   [inmesh.env :as e]
   [inmesh.state :as s]
   [inmesh.spawn :as sp]
   [inmesh.future :as f]
   [inmesh.on-when]
   [inmesh.in]
   [inmesh.wait]
   [inmesh.root :as r]
   [inmesh.injest :as i]
   [inmesh.db]))

(enable-console-print!)

(def ^:export id (:id e/data))

(defn start-repl [configs]
  (when (and goog/DEBUG (:repl-connect-string configs))
    (spawn {:id :repl :opts {:no-res? true}}
           (s/update-conf! configs))))

(defn init! [& [config-map]]
  (assert (e/in-screen?))
  (when config-map
    (swap! s/conf merge config-map))
  (let [config @s/conf]
    (if-not (:sw-connect-string config)
      (spawn {:id :root :opts {:no-res? true}}
             (r/init-root! config))
      (do
        (sp/spawn-sw #(spawn {:id :root :opts {:no-res? true}}
                             (r/init-root! config)))
        (sp/on-sw-registration-reload)))))

;; ephemeral spawns
(when (and (not (e/in-sw?)) (not (e/in-screen?)))
  (def e-fn (:efn e/data))
  (def e-args (:eargs e/data))
  (def sargs (->> e-args (mapv #(if (fn? %) (str "#in/mesh " %) %))))
  (when e-fn (inmesh.in/do-call
              {:data {:sfn e-fn
                      :sargs e-args
                      :opts {:request-id (:id e/data) :atom? true}}}))
  (when (not (:deamon? e/data))
    (.close js/self))
  :end)

(when (e/in-core?)
  :end)

