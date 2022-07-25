(ns inmesh.in
  (:require-macros
   [inmesh.in :refer [in]])
  (:require
   [inmesh.util :as u]
   [inmesh.on-when :refer [on-when]]
   [inmesh.env :as e]
   [inmesh.state :as s]
   [inmesh.msg :as m]
   [inmesh.sync :as sync]))

(defn do-call
  [{:keys [data] :as outer-data}]
  ;; (println :do-call data)
  (let [{:keys [sfn sargs opts]} data
        res (try
              (if-not sargs
                (js/eval (str "(" sfn ")();"))
                (apply (js/eval (str "(function () {return (" sfn ");})();"))
                       (if (vector? sargs)
                         (->> sargs (mapv #(if (and (string? %) (.startsWith % "#in/mesh"))
                                             (js/eval (str "(function () {return (" (apply str (drop 9 %)) ");})();"))
                                             %)))
                         (js/eval (str "(" sargs ")();")))))
              (catch :default e
                (println :error-in (:id e/data))
                (println :error-in-do-call e)
                (println :error (.-error e))
                (println :data data)
                (when-not (e/in-sw?)
                  (sync/send-response {:request-id (:request-id opts) :response {:error (pr-str e)}}))))]
    (when (:atom? opts)
      (reset! s/local-val res))
    (when (and (not (:no-res? opts)) (not (e/in-sw?)))
      (sync/send-response {:request-id (:request-id opts) :response res}))))


(defmethod m/dispatch :call
  [data]
  (do-call data))

(defn do-in [id & [args afn opts]]
  (let [[afn args] (if afn [afn args] [args nil])
        in-id (u/gen-id)
        sargs (->> args (mapv #(if (fn? %) (str "#in/mesh " %) %)))
        post-in #(m/post id
                         {:dispatch :call
                          :data (merge
                                 {:sfn afn :from (:id e/data) :to id}
                                 (when args
                                   {:sargs sargs})
                                 (when opts
                                   {:opts (assoc opts :request-id in-id)}))})]
    (if-not (e/in-screen?)
      (post-in)
      (if (contains? @s/peers id)
        (post-in)
        (on-when (contains? @s/peers id)
          (post-in))))
    (when (not (:no-res? opts))
      (sync/wrap-derefable (merge opts {:id in-id})))))
