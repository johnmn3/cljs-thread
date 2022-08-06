(ns inmesh.db
  (:require
   [inmesh.in :refer [in]]
   [inmesh.sync]
   [inmesh.idb :refer [idb-set! idb-get]]))

(defn db-set! [k data]
  (in :db (idb-set! k data identity))
  data)

(defn db-get [k]
  (let [res @(in :db (idb-get k yield))]
    (if-not (contains? res :res)
      nil
      (:res res))))
