(ns cljs-thread.integration-core
  (:require
   [cljs-thread.env :as env]
   [cljs-thread.core :as thread]))

(defn init! []
  (when (env/in-core?)
    (println :integration-core :ready)))
