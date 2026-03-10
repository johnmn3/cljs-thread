(ns cljs-thread.dom.types
  "Synthetic DOM constructors for instanceof support on worker threads.

   Workers don't have real DOM constructors (HTMLElement, Node, etc.).
   This namespace installs synthetic constructor functions with proper
   prototype chains on the worker's globalThis so that
   `(instance? js/HTMLElement proxy)` works correctly.

   The getPrototypeOf proxy trap returns the matching synthetic prototype
   for the proxy's type-hint, completing the instanceof chain.

   Delegates to cljs-thread.dom.constructors for now.
   Will be expanded with the full synthetic-chain (~25 types) per plan."
  (:require [cljs-thread.dom.constructors :as ctors]))

(def install! ctors/install!)
