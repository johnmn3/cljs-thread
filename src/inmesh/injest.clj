(ns inmesh.injest
  (:require
   [injest.impl]))

(defmacro tfan [xf-group]
  (let [tfn `(fn [] (injest.impl/compose-transducer-group ~xf-group))]
    `(fn [args#] (inmesh.injest/fan ~tfn args#))))

(defmacro =>>
  "Just like x>> but first composes stateless transducers into a function that 
   `r/fold`s in parallel the values flowing through the thread. Remaining
   stateful transducers are composed just like x>>."
  [x & thread]
  `(if (inmesh.env/in-screen?)
     (inmesh.in/in :core (injest.path/x>> ~x ~@(->> thread (injest.impl/pre-transducify-thread &env 1 `inmesh.injest/tfan injest.impl/par-transducable?))))
     (injest.path/x>> ~x ~@(->> thread (injest.impl/pre-transducify-thread &env 1 `inmesh.injest/tfan injest.impl/par-transducable?)))))
