(ns cljs-thread.id)

(defprotocol IDable
  "Protocol for types which have an ID"
  (get-id [x]
    "Returns id if a value has an ID."))
