(ns cljs-thread.pmap
  (:require-macros [cljs-thread.pmap])
  (:require
   [cljs-thread.util :as u]
   [cljs-thread.env :as e]
   [cljs-thread.state :as s]
   [cljs-thread.injest :refer [mk-injest-ids]]))

(def ^:dynamic *par*
  "Dynamic var to control parallelism level for pmap.
   When bound to a number, pmap will use that many workers.
   When nil (default), uses all available injest workers."
  nil)

(defn zipall [& colls]
  (->> colls
       ((fn [vs]
          (let [vc (mapv count vs)
                c (apply min vc)]
            (repeat c vs))))
       (map-indexed (fn [i v]
                      (map #(% i) v)))))

(defn ^:export do-pmap-inline
  "Runtime implementation for pmap. Receives a dispatch function that
   already has the mapping function and `in` call embedded.

   dispatch-fn: (fn [worker-id elem] ...) - dispatches elem to worker-id
   args: collection(s) to map over"
  [dispatch-fn & args]
  (let [;; Get worker IDs from config or calculate
        injest-ids (or (seq (map keyword (:injest-ids @s/conf)))
                       (mk-injest-ids (:injest-count @s/conf)))
        injest-ids (vec injest-ids)
        par-val (or *par* (count injest-ids))
        ;; Limit to par-val workers
        active-workers (vec (take par-val injest-ids))
        ;; Combine args if multiple collections
        zipargs (if (= 1 (count args))
                  (vec (first args))
                  (vec (apply zipall args)))
        ;; Assign elements to workers in round-robin
        worker-cycle (cycle active-workers)
        ;; Partition work into batches of par-val for sequential execution
        ;; This allows par-val concurrent operations per batch
        work-items (map vector worker-cycle zipargs)
        batches (partition-all par-val work-items)]
    ;; Process batches: launch all items in batch, then deref before next batch
    (->> batches
         (map (fn [batch]
                ;; Launch all items in batch concurrently
                (mapv (fn [[worker-id elem]]
                        (dispatch-fn worker-id elem))
                      batch)))
         ;; Deref each batch before moving to next
         (mapcat #(map deref %))
         vec)))

(defn ^:export do-pcalls
  "Runtime implementation for pcalls/pvalues.
   Receives a vector of dispatch functions, each taking a worker-id
   and returning a derefable result.

   dispatch-fns: [(fn [worker-id] (in worker-id expr)) ...]"
  [dispatch-fns]
  (let [;; Get worker IDs from config or calculate
        injest-ids (or (seq (map keyword (:injest-ids @s/conf)))
                       (mk-injest-ids (:injest-count @s/conf)))
        injest-ids (vec injest-ids)
        par-val (or *par* (count injest-ids))
        ;; Limit to par-val workers
        active-workers (vec (take par-val injest-ids))
        n (count dispatch-fns)
        ;; Assign each dispatch-fn to a worker in round-robin
        worker-cycle (cycle active-workers)]
    ;; Launch all in parallel, then deref all
    (let [results (mapv (fn [dispatch-fn worker-id]
                          (dispatch-fn worker-id))
                        dispatch-fns
                        worker-cycle)]
      (mapv deref results))))
