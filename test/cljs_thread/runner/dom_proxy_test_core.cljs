(ns cljs-thread.runner.dom-proxy-test-core
  "Worker-side entry point for DOM proxy tests.

   When this module loads on a worker thread, it installs the DOM proxy
   system (document, window, navigator on globalThis) and loads the
   test namespace so tests are available for execution via `in`."
  (:require [cljs-thread.core]
            [cljs-thread.env :as env]
            [cljs-thread.in]
            [cljs-thread.future]
            [cljs-thread.spawn]
            [cljs-thread.dom.install :as dom-install]
            [cljs-thread.dom.test]))

(defn init! []
  (when (env/in-core?)
    (println :dom-proxy-test-core :initializing)
    ;; Install DOM proxies on this worker's globalThis
    (dom-install/install!)
    (println :dom-proxy-test-core :dom-proxies-installed)
    (println :dom-proxy-test-core :ready)))
