(ns inmesh.core
  (:refer-clojure :exclude [future])
  (:require
   [injest.path]))

(defmacro in [& x]
  `(inmesh.in/in ~@x))

(defmacro future [& x]
  `(inmesh.future/future ~@x))

(defmacro spawn [& x]
  `(inmesh.spawn/spawn ~@x))

(defmacro wait [& x]
  `(inmesh.wait/wait ~@x))

(defmacro =>>
  "Just like x>> but first composes stateless transducers into a function that 
   transduces in parallel the values flowing through the thread. Remaining
   stateful transducers are composed just like x>>."
  [& x]
  `(inmesh.injest/=>> ~@x))

(defmacro on-when [& x]
  `(inmesh.on-when/on-when ~@x))

(defmacro dbg [& x]
  `(inmesh.repl/dbg ~@x))

(defmacro break [& x]
  `(inmesh.repl/break ~@x))

(defmacro in? [& x]
  `(inmesh.repl/in? ~@x))
