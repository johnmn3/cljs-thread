(ns inmesh.core
  (:require-macros [inmesh.core :refer [on-when spawn in]])
  (:require
   [inmesh.util :as u]
   [inmesh.env :as e]
   [inmesh.state :as s]
   [inmesh.spawn :as sp]
   [inmesh.on-when]
   [inmesh.in]
   [inmesh.wait]
   [inmesh.root :as r]
   [inmesh.db]
   [inmesh.repl]
   [inmesh.future]
   [inmesh.injest]))

(enable-console-print!)

(def ^:export id (:id e/data))

(when-not (e/in-core?)
  (on-when (contains? @s/peers :core)
    (reset! s/ready? true)))

(when-not (or (e/in-screen?) (e/in-sw?) (= :repl id))
  (set-print-fn! #(in :repl {:no-res? true}
                      (print %)))
  (set-print-err-fn! #(in :repl {:no-res? true}
                          (print %))))

(defn init! [& [config-map]]
  (assert (e/in-screen?))
  (when config-map
    (swap! s/conf merge config-map))
  (let [config @s/conf]
    (if-not (:sw-connect-string config)
      (spawn {:id :root :opts {:no-res? true}}
             (r/init-root! config))
      (do (sp/spawn-sw #(spawn {:id :root :opts {:no-res? true}}
                               (r/init-root! config)))
          (when-not (u/in-safari?)
            (sp/on-sw-registration-reload))))))

;; ephemeral spawns
(when (and (not (e/in-sw?)) (not (e/in-screen?)))
  (def e-fn (:efn e/data))
  (def e-args (:eargs e/data))
  (def sargs (->> e-args (mapv #(if (fn? %) (str "#in/mesh " %) %))))
  (when e-fn (inmesh.in/do-call
              {:data {:sfn e-fn
                      :sargs sargs
                      :in-id (:in-id e/data)
                      :opts {:request-id (:id e/data) :atom? true :yield? (:yield? e/data)}}}))
  (when (and (not (:yield? e/data)) (not (:deamon? e/data)))
    (.close js/self))
  :end)
