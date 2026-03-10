(ns cljs-thread.node-worker-entry
  "Entry point for Node.js worker_threads.
   Loading this namespace triggers all side-effect initialization
   (platform detection, env setup, message handlers, ephemeral spawn logic)
   via the require of cljs-thread.core.
   The cljs-thread.eve require triggers auto-init! which reconstructs the
   AtomDomain on this worker from SAB config passed via workerData."
  (:require [cljs-thread.core]
            [cljs-thread.eve]))

(defn main []
  ;; All initialization happens via side effects at load time.
  ;; This function exists solely as the shadow-cljs :main entry point.
  nil)
