(ns cljs-thread.dom
  "Macros for the DOM proxy system.

   batch! — execute multiple DOM mutations in a single round-trip.")

(defmacro batch!
  "Execute multiple DOM mutations in a single round-trip to the screen thread.
   All property writes within the body are queued and flushed together.
   Reads still execute synchronously (they are not batched)."
  [& body]
  `(cljs-thread.dom.proxy/with-batch (fn [] ~@body)))
