(ns cljs-thread.dom.executor
  "Formerly the screen-side DOM operation executor.

   All DOM operations now flow through `(in :screen ...)` from the worker
   proxy. Wire-format utilities (result->wire, from-wire, extract-event)
   and listener storage have moved to cljs-thread.dom.registry.

   This namespace is kept as a thin stub so existing requires don't break.
   It will be removed in a future cleanup.")
