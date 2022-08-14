(ns cljs-thread.repl
  (:require-macros
   [cljs-thread.repl])
  (:require
   [cljs-thread.env :as e]
   [cljs-thread.state :as s]
   [cljs-thread.spawn :refer [spawn]]
   [cljs-thread.on-when :refer [on-when]]
   [cljs-thread.sync :as sync]
   [cljs-thread.in]
   [cljs-thread.util :as u]))

(def dbg-atom (atom {:running #{}}))

(def local-dbg-id (atom nil))

(defn dbg-repl []
  (when (= :repl-sync (:id e/data))
    (let [dbg-id (u/gen-id)]
      (swap! dbg-atom update :running conj dbg-id)
      (loop []
        (let [{:keys [sfn sargs break dbg-id]} (sync/request :dbg-req {:id "dbg-repl"})]
          (if break
            (do (sync/send-response {:request-id :dbg-res :response :no-break-running!})
                (recur))
            (let [_ (reset! local-dbg-id dbg-id)
                  result (cljs-thread.in/do-call
                          {:data {:sfn sfn
                                  :sargs sargs
                                  :local? true}})]
              (sync/send-response {:request-id :dbg-res :response {:end-session? true :res result}})
              (recur))))))))

(defn do-break [symvals ctx expr]
  (when (= :repl-sync (:id e/data))
    (let [when-res (cljs-thread.in/do-call
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
                      result (cljs-thread.in/do-call
                              {:data {:sfn sfn
                                      :sargs conveyer
                                      :local? true}})]
                  (if (= :in/exit result)
                    (do (swap! dbg-atom update :running disj dbg-id)
                        expr)
                    (do (sync/send-response {:request-id :dbg-res :response result})
                        (recur))))))))))))

(def remote-break (atom nil))

(defn break-running? []
  (not (nil? @remote-break)))

(defn do-dbg [afn]
  (let [sfn (str afn)
        break-id (u/gen-id)]
    (if (break-running?)
      (println :break-running!)
      (do (reset! remote-break break-id)
          (sync/send-response {:request-id :dbg-req :dbg-id break-id :response {:sfn sfn :sargs [] :request-id :dbg-res}})
          (let [result (sync/request :dbg-res)]
            result)))))

(defn dbg-> [symbols afn]
  (if-not (break-running?)
    (afn)
    (let [sfn (str afn)]
      (sync/send-response {:request-id :dbg-req :response {:break true :sfn sfn :sargs symbols :request-id :dbg-res}})
      (let [{:keys [end-session? res] :as result} (sync/request :dbg-res)]
        (if end-session?
          (do (reset! remote-break nil)
              res)
          result)))))

(defn start-repl [configs]
  (when (and goog/DEBUG (:repl-connect-string configs))
    (spawn {:id :repl}
           (s/update-conf! configs))
    (spawn {:id :repl-sync :no-globals? true}
      (on-when (contains? @s/peers :core)
        (dbg-repl)))))
