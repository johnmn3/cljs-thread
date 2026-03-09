(ns cljs-thread.dom.events
  "Event subscription forwarding between worker and screen threads.

   Handles addEventListener/removeEventListener through the proxy:
   - Callbacks stay on the worker (to access worker-local state)
   - Screen gets a stub listener that serializes events and forwards
     them back to the worker via m/post
   - Worker dispatches :dom-event to invoke the local callback

   Currently implemented inline in cljs-thread.dom.proxy.
   Will be extracted here as the event system grows (Phase 2).")
