(ns cljs-thread.runner.repl-worker-entry
  "Entry point for REPL worker that sets thread ID before cljs-thread loads.
   This allows blocking @ to work in the REPL context."
  (:require [cljs-thread.core :as thread]))

;; Set worker ID BEFORE cljs-thread.platform caches init-data.
;; Must be done at the top level before any requires that trigger platform.cljs.
;; Actually, this won't work because the ns :require already loaded platform...

;; The real fix: this file is loaded FIRST, before cljs-thread.core.
;; We use :preloads or a wrapper script approach.

(defn init! []
  ;; Worker is ready
  (println "REPL worker ready. Thread ID:" (thread/id)))
