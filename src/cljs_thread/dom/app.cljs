(ns cljs-thread.dom.app
  "DOM proxy support for cljs-thread.

   Including this namespace in a build enables DOM proxy:
   - Screen: dom.registry auto-initializes the handle registry
   - Workers: dom.install auto-installs proxy objects on globalThis

   Add to :cljs-thread module entries in shadow-cljs.edn:
     {:entries [cljs-thread.dom.app my-app.core]}"
  (:require
   [cljs-thread.core]
   [cljs-thread.dom.registry]
   [cljs-thread.dom.install]))
