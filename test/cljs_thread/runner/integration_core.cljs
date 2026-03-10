(ns cljs-thread.runner.integration-core
  (:require
   [cljs-thread.env :as env]
   ;; Workers need the full cljs-thread runtime (message dispatch, do-call,
   ;; state, etc.). Requiring cljs-thread.core here causes Closure to promote
   ;; the runtime into :shared — the common ancestor of :screen and :core —
   ;; so it's available on every worker that loads shared.js + core.js.
   [cljs-thread.core]))

(defn init! []
  (when (env/in-core?)
    (println :integration-core :ready)))
