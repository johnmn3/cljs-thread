(ns inmesh.db
  (:require
   [inmesh.wait :refer [wait]]
   [inmesh.in :refer [in]]
   [inmesh.state :as s]
   [inmesh.idb :refer [idb-open idb-set! idb-get]]))

(defn open []
  (in :db {:no-res? true} (idb-open println)))

(defn db-set! [k data]
  (in :db {:no-res? true} (idb-set! k data identity)))

(defn db-get [k]
  (wait :db (idb-get k yield)))
