(ns cljs-thread.node-worker-entry
  "Entry point for Node.js worker_threads.
   Loading this namespace triggers all side-effect initialization
   (platform detection, env setup, message handlers, ephemeral spawn logic)
   via the require of cljs-thread.core."
  (:require [cljs-thread.core]))

(defn main []
  ;; All initialization happens via side effects at load time.
  ;; This function exists solely as the shadow-cljs :main entry point.
  nil)
