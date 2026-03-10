(ns cljs-thread.runner.repl-preload
  "Preload that sets worker ID BEFORE cljs-thread.platform caches init-data.
   This file must be loaded via :preloads, not :require, so it runs first.")

;; Set the init data that platform.cljs will read.
;; Using :core so this worker behaves like a normal blocking worker.
(set! js/globalThis.__cljs_thread_init_data "{:id :core}")
