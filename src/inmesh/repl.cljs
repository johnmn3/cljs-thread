(ns inmesh.repl
  (:require-macros
   [inmesh.repl])
  (:require
   [inmesh.env :as e]
   [inmesh.state :as s]
   [inmesh.spawn :refer [spawn]]
   [inmesh.on-when :refer [on-when]]
   [inmesh.sync :as sync]
   [inmesh.in]
   [inmesh.util :as u]))

(def dbg-atom (atom {:running #{}}))

(defn dbg-repl []
  (when (= :repl-sync (:id e/data))
    (let [dbg-id (u/gen-id)]
      (loop []
        (let [{:keys [sfn sargs break]} (sync/request :dbg-req {:id "dbg-repl"})]
          (if break
            (do (sync/send-response {:request-id :dbg-res :response :no-break-running!})
                (recur))
            (let [result (inmesh.in/do-call
                          {:data {:sfn sfn
                                  :sargs sargs
                                  :local? true}})]
              (sync/send-response {:request-id :dbg-res :response result})
              (recur))))))))

(defn do-break [symvals ctx expr]
  (when (= :repl-sync (:id e/data))
    (let [when-res (inmesh.in/do-call
                    {:data {:sfn (str expr)
                            :sargs (vec (vals symvals))
                            :local? true}})]
      (if-not when-res
        expr
        (let [dbg-id (u/gen-id)]
          (swap! dbg-atom update :running conj dbg-id)
          (sync/send-response {:request-id :dbg-res :response :starting-dbg})
          (loop []
            (let [{:keys [sfn sargs break]} (sync/request :dbg-req {:park true :max-time (* 1000 60 60) :duration 500})]
              (if (not break)
                (sync/send-response {:request-id :dbg-res :response :dbg-already-running!})
                (let [conveyer (mapv symvals sargs)
                      result (inmesh.in/do-call
                              {:data {:sfn sfn
                                      :sargs conveyer
                                      :local? true}})]
                  (if (= :in/exit result)
                    (do (swap! dbg-atom update :running disj dbg-id)
                        expr)
                    (do (sync/send-response {:request-id :dbg-res :response result})
                        (recur))))))))))))
   
(defn do-dbg [afn]
  (let [sfn (str afn)]
    (sync/send-response {:request-id :dbg-req :response {:sfn sfn :sargs [] :request-id :dbg-res}})
    (let [res (sync/request :dbg-res)]
      res)))

(defn dbg-> [symbols afn]
  (let [sfn (str afn)]
    (sync/send-response {:request-id :dbg-req :response {:break true :sfn sfn :sargs symbols :request-id :dbg-res}})
    (sync/request :dbg-res)))

(defn start-repl [configs]
  (when (and goog/DEBUG (:repl-connect-string configs))
    (spawn {:id :repl :opts {:no-res? true}}
           (s/update-conf! configs))
    (spawn {:id :repl-sync :opts {:no-res? true}}
       (on-when (contains? @s/peers :core)
         (dbg-repl)))))


