(ns inmesh.wait
  (:require-macros
   [inmesh.wait]
   [inmesh.in :refer [in]])
  (:require
   [inmesh.util :as u]
   [inmesh.in]
   [inmesh.sync :as sync]))

;; this is no longer needed - `in` can now yield and do the smae things - to be removed
(defn do-wait [id args afn opts]
  (let [fut-id (u/gen-id)]
    (in id
        {:no-res? true}
        (if (seq args)
          ((apply afn args) #(sync/send-response {:request-id fut-id :response %}))
          ((afn) #(sync/send-response {:request-id fut-id :response %}))))
    (sync/request fut-id)))
