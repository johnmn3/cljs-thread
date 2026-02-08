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

(defn- auto-detect-loadable-modules
  "Detect the screen module by scanning <script> tags on the page.
   In a shadow-cljs code-split build, the last <script> is always the screen
   entry module. Workers already load shared.js via importScripts, so only
   the screen module needs IIFE-unwrapping for non-exported vars."
  [config]
  (when (and (not p/node?) (exists? js/document))
    (let [core-script (or (:core-connect-string config) "")
          sw-script   (or (:sw-connect-string config) "")
          ;; Extract just the filename from a URL or path
          basename    (fn [s] (let [s (str s)] (subs s (inc (.lastIndexOf s "/")))))
          core-name   (basename core-script)
          sw-name     (basename sw-script)
          page-scripts (->> (array-seq (.querySelectorAll js/document "script[src]"))
                            (map #(basename (.-src %)))
                            (filterv #(and (not= % core-name)
                                           (not= % sw-name)
                                           (not= % ""))))
          ;; The last script on the page is the screen module — the only one
          ;; workers don't load. Earlier scripts (shared.js, kernel.js) are
          ;; already loaded by workers via importScripts.
          screen-module (last page-scripts)]
      (when screen-module
        [screen-module]))))

(defn init! [& [config-map]]
  (assert (e/in-screen?))
  (when config-map
    (swap! s/conf merge config-map))
  ;; Auto-detect loadable modules if not explicitly configured
  (when-not (:loadable-modules @s/conf)
    (when-let [modules (auto-detect-loadable-modules @s/conf)]
      (swap! s/conf assoc :loadable-modules modules)))
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
      (if-not (or (:sw-connect-string config) p/sab-sync?)
        ;; No sync mechanism — basic spawn only (no blocking support)
        (spawn {:id :root :no-globals? true}
               (r/init-root! config))
        ;; Full spawn with coordinator (SW or SAB)
        (do (sp/spawn-sw
             #(spawn {:id :root :no-globals? true}
                     (spawn {:id :core :no-globals? true})
                     (spawn {:id :db :no-globals? true})
                     (r/init-root! config)))
            (when (and (not p/sab-sync?) (not (u/in-safari?)))
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
