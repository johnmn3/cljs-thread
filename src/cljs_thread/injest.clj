(ns cljs-thread.injest
  (:require
   [injest.impl]
   [injest.util :as util]
   [cljs-thread.macro-impl :as i]))

(defmacro tfan [conveyer names xf-group]
  ;; Simple approach: let `in` handle serialization.
  ;; - `chunk#` is a local that `in` will capture automatically
  ;; - `xf-group` is a compile-time literal embedded in the code
  `(fn [args#]
     (let [;; Get injest-ids from config, converting strings to keywords
           conf-val# @cljs-thread.state/conf
           raw-ids# (:injest-ids conf-val#)
           injest-ids# (or (clojure.core/seq (clojure.core/map clojure.core/keyword raw-ids#))
                           (cljs-thread.injest/mk-injest-ids (:injest-count conf-val#)))
           chunks# (clojure.core/partition-all 512 args#)
           worker-cycle# (clojure.core/cycle injest-ids#)]
       (->> (clojure.core/map
              (fn [w# chunk#]
                (cljs-thread.in/in w#
                  ;; Use vec to realize the sequence - eve atoms may not handle lazy seqs
                  (clojure.core/vec
                    (clojure.core/sequence
                      (cljs-thread.injest/compose-xf ~xf-group)
                      chunk#))))
              worker-cycle# chunks#)
            (clojure.core/mapcat clojure.core/deref)
            clojure.core/vec))))

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
    `(if (cljs-thread.env/in-screen?)
       (cljs-thread.in/in :core (injest.path/x>> ~x ~@(->> thread (pre-transducify-thread conveyer names &env 1 `cljs-thread.injest/tfan injest.impl/par-transducable?))))
       (injest.path/x>> ~x ~@(->> thread (pre-transducify-thread conveyer names &env 1 `cljs-thread.injest/tfan injest.impl/par-transducable?))))))
