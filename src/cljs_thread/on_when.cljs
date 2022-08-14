(ns cljs-thread.on-when
  (:require-macros
   [cljs-thread.on-when])
  (:require
   [cljs-thread.env :as env]))

(defn wait-until [condition {:keys [resolve duration max-time timeout-resolve timeout-data]}]
  (let [duration (or duration 2)
        max-time (or max-time 30000)
        start-time (.getTime (js/Date.))]
    (if-let [result (condition)]
      (if resolve
        (js/Promise.resolve (resolve result))
        (js/Promise.resolve result))
      (js/Promise.
       (fn [resolve* reject]
         (let [timer-id (atom nil)
               interval-fn
               #(let [time-passed (-> (js/Date.) .getTime (- start-time))]
                  (if-let [result (condition)]
                    (do (js/clearInterval @timer-id)
                        (if resolve
                          (resolve* (resolve result))
                          (resolve* result)))
                    (when (-> time-passed (> max-time))
                      (js/clearInterval @timer-id)
                      (if timeout-resolve
                        (resolve (timeout-resolve))
                        (reject (js/Error. (str "Timed out: \n"
                                                "in: " (:id env/data) "\n"
                                                "Condition:\n"
                                                condition
                                                "\nTimeout-data:\n"
                                                timeout-data))))
                      #_#_:else (println :RUNNING_INTERVAL :SECONDS_PASSED (/ time-passed 1000)))))]
           (reset! timer-id (js/setInterval interval-fn duration))))))))

(defn do-on-when [pred opts afn]
  (-> (wait-until pred opts)
      (.then afn)))
