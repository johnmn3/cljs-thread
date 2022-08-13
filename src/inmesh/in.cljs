(ns inmesh.in
  (:require-macros
   [inmesh.in])
  (:require [clojure.edn :as edn]
            [clojure.walk :refer [postwalk]]
            [inmesh.env :as e]
            [inmesh.id :refer [get-id IDable]]
            [inmesh.msg :as m]
            [inmesh.on-when :refer [on-when]]
            [inmesh.state :as s]
            [inmesh.sync :as sync]
            [inmesh.util :as u]))

(defn instr-body [transfer-atom pl]
  (let [body (postwalk
              #(cond (fn? %) (str "#inmesh/arg-fn " %)
                     (u/typed-array? %)
                     (let [c-tag (:count (swap! transfer-atom update :count inc))
                           t (type %)]
                       (swap! transfer-atom assoc-in [:transfers c-tag]
                              (merge
                               {:obj %}
                               (when-not (and (exists? js/SharedArrayBuffer) (= (type %) js/SharedArrayBuffer))
                                 {:transfer (.-buffer %)})))
                       (str "#inmesh/transferable " {:c-tag c-tag :transfer-type t}))
                     :else %)
              pl)]
    body))

(defn unstr-body [transfers pl]
  (postwalk
   #(if-not (and (string? %) (or (.startsWith % "#inmesh/transferable")
                                 (.startsWith % "#inmesh/arg-fn")))
      %
      (cond (.startsWith % "#inmesh/arg-fn")
            (js/eval (str "(function () {return (" (apply str (drop 15 %)) ");})();"))
            (.startsWith % "#inmesh/transferable")
            (let [transfer-map (edn/read-string (apply str (drop 21 %)))
                  {:keys [c-tag transfer-type]} transfer-map
                  transfers-clj (js->clj transfers :keywordize-keys true)
                  {:keys [obj]} (get transfers-clj c-tag)]
              obj)
            :else %))
   pl))

(defn do-call
  [{:keys [data] :as outer-data}]
  (let [{:keys [sfn sargs opts in-id local? transfers]} data
        res (try
              (if (or (nil? sfn) (= sfn "nil"))
                nil
                (if-not sargs
                  (if (and in-id (:yield? opts))
                    ((js/eval (str "(" sfn ")();")) in-id)
                    (js/eval (str "(" sfn ")();")))
                  (apply (if (and in-id (:yield? opts))
                           ((js/eval (str "(function () {return (" sfn ");})();")) in-id)
                           (js/eval (str "(function () {return (" sfn ");})();")))
                         (if (vector? sargs)
                           (->> sargs (mapv (partial unstr-body transfers)))
                           (js/eval (str "(" sargs ")();"))))))
              (catch :default e
                (println :error-in (:id e/data))
                (println :error-in-do-call e)
                (println :error (.-error e))
                (println :data data)
                (when-not (e/in-sw?)
                  (sync/send-response {:request-id (:request-id opts) :response {:error (pr-str e)}}))))]
    (when (:atom? opts)
      (reset! s/local-val res))
    (if local?
      res
      (when (and (not (:yield? opts)) (not (e/in-sw?)))
        (sync/send-response {:request-id (:request-id opts) :response res})))))


(defmethod m/dispatch :call
  [data]
  (do-call data))

(defn do-in [id & [args afn opts]]
  (let [[afn args] (if afn [afn args] [args nil])
        in-id (u/gen-id)
        transfer-atom (atom {:count 0 :transfers {}})
        sargs (->> args (mapv (partial instr-body transfer-atom)))
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
                                 (when-let [transfers (:transfers @transfer-atom)]
                                   {:transfers transfers})
                                 (when opts
                                   {:opts (assoc opts :request-id in-id)}))})]
    (if-not (e/in-screen?)
      (post-in)
      (if (contains? @s/peers id)
        (post-in)
        (on-when (contains? @s/peers id)
          (post-in))))
    (sync/wrap-derefable (merge opts {:id in-id}))))
