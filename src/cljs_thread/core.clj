(ns cljs-thread.core
  (:refer-clojure :exclude [future pmap pcalls pvalues])
  (:require
   [injest.path]))

(defmacro in [& x]
  `(cljs-thread.in/in ~@x))

(defmacro future [& x]
  `(cljs-thread.future/future ~@x))

(defmacro spawn [& x]
  `(cljs-thread.spawn/spawn ~@x))

(defmacro =>>
  "Just like x>> but first composes stateless transducers into a function that 
   transduces in parallel the values flowing through the thread. Remaining
   stateful transducers are composed just like x>>."
  [& x]
  `(cljs-thread.injest/=>> ~@x))

(defmacro on-when [& x]
  `(cljs-thread.on-when/on-when ~@x))

(defmacro on-watch [& x]
  `(cljs-thread.on-when/on-watch ~@x))

(defmacro dbg [& x]
  `(cljs-thread.repl/dbg ~@x))

(defmacro break [& x]
  `(cljs-thread.repl/break ~@x))

(defmacro in? [& x]
  `(cljs-thread.repl/in? ~@x))

(defmacro pmap [& x]
  `(cljs-thread.pmap/pmap ~@x))

(defmacro pcalls [& x]
  `(cljs-thread.pmap/pcalls ~@x))

(defmacro pvalues [& x]
  `(cljs-thread.pmap/pvalues ~@x))
