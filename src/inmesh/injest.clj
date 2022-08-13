(ns inmesh.injest
  (:require
   [injest.impl]
   [injest.util :as util]
   [inmesh.macro-impl :as i]))

(defmacro tfan [conveyer names xf-group]
  (let [yfn `(clojure.core/fn ~names (injest.impl/compose-transducer-group ~xf-group))]
    `(do (fn [args#]
           (inmesh.injest/fan ~conveyer ~yfn args#)))))

(defn pre-transducify-thread [conveyer names env minimum-group-size t-fn t-pred thread]
  (->> thread
       (util/qualify-thread env)
       (partition-by #(t-pred %))
       (mapv #(if-not (and (t-pred (first %))
                           (not (< (count %) minimum-group-size)))
                %
                (list (list `(~t-fn ~conveyer ~names ~(mapv vec %))))))
       (apply concat)))

(defmacro =>>
  "Just like x>> but first composes stateless transducers into a function that 
   `r/fold`s in parallel the values flowing through the thread. Remaining
   stateful transducers are composed just like x>>."
  [x & thread]
  (let [[conveyer names opts body] (i/globals-locals-and-args &env thread)]
    `(if (inmesh.env/in-screen?)
       (inmesh.in/in :core (injest.path/x>> ~x ~@(->> thread (pre-transducify-thread conveyer names &env 1 `inmesh.injest/tfan injest.impl/par-transducable?))))
       (injest.path/x>> ~x ~@(->> thread (pre-transducify-thread conveyer names &env 1 `inmesh.injest/tfan injest.impl/par-transducable?))))))
