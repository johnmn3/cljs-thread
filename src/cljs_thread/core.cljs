(ns cljs-thread.core
  (:require-macros [cljs-thread.core :refer [spawn]])
  (:require
   [cljs-thread.util :as u]
   [cljs-thread.env :as e]
   [cljs-thread.state :as s]
   [cljs-thread.platform :as p]
   [cljs-thread.spawn :as sp]
   [cljs-thread.on-when]
   [cljs-thread.in]
   [cljs-thread.root :as r]
   [cljs-thread.db]
   [cljs-thread.msg :as m]
   [cljs-thread.sync]
   [cljs-thread.repl]
   [cljs-thread.future]
   [cljs-thread.injest]
   [cljs-thread.pmap]))

(enable-console-print!)

(def sleep cljs-thread.sync/sleep)

(def ^:export id (:id e/data))

(defn init! [& [config-map]]
  (assert (e/in-screen?))
  (when config-map
    (swap! s/conf merge config-map))
  (let [config @s/conf]
    (if p/node?
      ;; Node.js: main thread is both screen and root.
      ;; No SW needed — coordinator is the main thread itself.
      ;; Spawn root, core, db workers directly.
      ;; NOTE: pair-ids is called inside init-root! (not here) because
      ;; under advanced compilation with code splitting, non-exported fns
      ;; referenced in spawn bodies may be placed in screen.js by Closure,
      ;; making them unavailable when eval'd on workers.
      (sp/spawn-sw
       #(spawn {:id :root :no-globals? true}
               (spawn {:id :core :no-globals? true})
               (spawn {:id :db :no-globals? true})
               (r/init-root! config)))
      ;; Browser: existing flow
      (if-not (:sw-connect-string config)
        (spawn {:id :root :no-globals? true}
               (r/init-root! config))
        (do (sp/spawn-sw
             #(spawn {:id :root :no-globals? true}
                     (spawn {:id :core :no-globals? true})
                     (spawn {:id :db :no-globals? true})
                     (r/init-root! config)))
            (when-not (u/in-safari?)
              (sp/on-sw-registration-reload)))))))

;; ephemeral spawns
(when (and (not (e/in-sw?)) (not (e/in-screen?)))
  (def e-fn (:efn e/data))
  (def e-args (:eargs e/data))
  (def sargs (->> e-args (mapv #(if (fn? %) (str "#cljs-thread/arg-fn " %) %))))
  (when e-fn (cljs-thread.in/do-call
              {:data {:sfn e-fn
                      :sargs sargs
                      :in-id (:in-id e/data)
                      :opts {:request-id (:id e/data) :atom? true :yield? (:yield? e/data)}}}))
  (when (and (not (:yield? e/data)) (not (:deamon? e/data)))
    (p/close-self!))
  :end)
