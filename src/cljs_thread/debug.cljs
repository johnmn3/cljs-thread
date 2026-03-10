(ns cljs-thread.debug
  "Debug logging utilities with compile-time elimination.

   Uses goog-define for DCE in :advanced builds. Set DEBUG to true
   in shadow-cljs.edn for development:

   :closure-defines {cljs-thread.debug/DEBUG true}")

(goog-define DEBUG false)

(defn log
  "Log debug message. No-op when DEBUG is false (DCE'd in :advanced)."
  [& args]
  (when DEBUG
    (apply println args)))

(defn log-error
  "Log error with context. No-op when DEBUG is false (DCE'd in :advanced)."
  [label error & {:as context}]
  (when DEBUG
    (println label error)
    (doseq [[k v] context]
      (println k v))))

(defn log-exception
  "Log exception with stack trace. Always logs to console.error."
  [label ^js e]
  (js/console.error label e)
  (when (.-stack e)
    (js/console.error (.-stack e))))
