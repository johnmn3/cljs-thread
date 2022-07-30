(ns inmesh.in
  (:require-macros
   [inmesh.in])
  (:require
   [inmesh.util :as u]
   [inmesh.on-when :refer [on-when]]
   [inmesh.env :as e]
   [inmesh.state :as s]
   [inmesh.id :refer [IDable get-id]]
   [inmesh.msg :as m]
   [inmesh.sync :as sync]))

(defn do-call
  [{:keys [data] :as outer-data}]
  (let [{:keys [sfn sargs opts in-id]} data
        res (try
              (if-not sargs
                (if (and in-id (:yield? opts))
                  ((js/eval (str "(" sfn ")();")) in-id)
                  (js/eval (str "(" sfn ")();")))
                (apply (if (and in-id (:yield? opts))
                         ((js/eval (str "(function () {return (" sfn ");})();")) in-id)
                         (js/eval (str "(function () {return (" sfn ");})();")))
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
    (when (and (not (:yield? opts)) (not (:no-res? opts)) (not (e/in-sw?)))
      (sync/send-response {:request-id (:request-id opts) :response res}))))


(defmethod m/dispatch :call
  [data]
  (do-call data))

(defn do-in [id & [args afn opts]]
  (let [[afn args] (if afn [afn args] [args nil])
        in-id (u/gen-id)
        sargs (->> args (mapv #(if (fn? %) (str "#in/mesh " %) %)))
        id (if (satisfies? IDable id)
             (get-id id)
             id)
        id (if (keyword id)
             id
             (pr-str id))
        post-in #(m/post id
                         {:dispatch :call
                          :data (merge
                                 {:sfn afn :to id :in-id in-id}
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
