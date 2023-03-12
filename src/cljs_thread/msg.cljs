(ns cljs-thread.msg
  (:require
   [cljs-thread.state :as s]
   [cljs-thread.env :as e]
   [cljs-thread.id :refer [IDable get-id]]
   [clojure.edn :as edn]
   [clojure.pprint :refer [pprint]]))

(def event-message "message")

(defmulti dispatch :dispatch)

(defn read-id [id]
  (if (.startsWith id ":")
    (edn/read-string id)
    (str id)))

(defn message-handler [^js e]
  (let [data (.-msg (.-data e))
        receive-port? (-> ^js data .-dispatch (= "receive-port"))
        data (if receive-port?
               (-> data (js->clj :keywordize-keys true)
                   (update :dispatch keyword)
                   (update-in [:data :id] read-id))
               (-> data edn/read-string))]
    (dispatch data)))

(if (not (e/in-screen?))
  (.addEventListener js/self event-message message-handler)
  (.addEventListener js/window event-message message-handler))

(defn do-pprint [s]
  (pprint s))

(defmethod dispatch :pprint
  [{:keys [data]}]
  (do-pprint data))

(defmethod dispatch :receive-port
  [{{:keys [id port]} :data}]
  (swap! s/peers assoc-in [id :port] port)
  (set! (.-onmessage port) message-handler))

(defn when-peer-ready [id afn & [watch-key]]
  (let [watch-key (or watch-key (str id "-" (hash afn) "-" (gensym)))]
    (if (get @s/peers id)
      (afn)
      (add-watch
       s/peers
       watch-key
       #(do (remove-watch s/peers watch-key)
            (when-peer-ready id afn watch-key))))))

(defn post [worker-id {:as data {:keys [transfers]} :data} & [transferables]]
  (let [transferables (->> transfers (mapv (fn [[_k {:keys [transfer]}]]
                                             transfer)))
        id (if (and (not (keyword? worker-id))
                    (instance? IDable worker-id))
             (get-id worker-id)
             worker-id)
        data (assoc data :from (:id e/data))]
    (if (= :here id)
      (dispatch data)
      (let [w (or (-> @s/peers (get-in [id :port]))
                  (-> @s/peers (get-in [id :w])))]
        (try
          (if (and (not (e/in-screen?)) (not w))
            (let [w (or (-> @s/peers (get-in [:parent :port]))
                        (-> @s/peers (get-in [:parent :w])))]
              (.postMessage w
                            #js {:transfers transfers
                                 :msg
                                 ((if (-> data :dispatch (= :receive-port)) clj->js pr-str)
                                  {:dispatch :proxy
                                   :data data})}
                            (if transferables
                              (clj->js transferables)
                              #js [])))
            (when-peer-ready id
                             #(let [w (or (-> @s/peers (get-in [id :port]))
                                          (-> @s/peers (get-in [id :w])))]
                                (.postMessage w
                                              (if (-> data :dispatch (= :receive-port))
                                                #js {:transfers transfers
                                                     :msg (clj->js data)}
                                                #js {:transfers transfers
                                                     :msg (str data)})
                                              (if transferables
                                                (clj->js transferables)
                                                #js [])))))
          (catch :default e
            (println :id (:id e/data))
            (println :e e)
            (println :w w)
            (println :worker-id worker-id)
            (println :data data)
            (when-peer-ready id
                             #(post worker-id data transferables))))))))

(defmethod dispatch :proxy
  [{data :data}]
  (let [id (-> data :data :to)]
    (if (= id (:id e/data))
      (post :here data)
      (post id data))))

(defn mk-chan-pair []
  (let [c (js/MessageChannel.)
        c1 (.-port1 c)
        c2 (.-port2 c)]
    [c1 c2]))

(defn send-port [id c1]
  (post id {:dispatch :receive-port
            :data {:port c1
                   :transfers {1 {:transfer c1}}
                   :id (str (:id e/data))}}))

(defn dist-port [id1 id2 c1 c2]
  (post id1 {:dispatch :receive-port
             :data {:port c1
                    :transfers {1 {:transfer c1}}
                    :id (str id2)}})
  (post id2 {:dispatch :receive-port
             :data {:port c2
                    :transfers {1 {:transfer c2}}
                    :id (str id1)}}))

(defn pair-ids [id1 id2]
  (let [[c1 c2] (mk-chan-pair)]
    (dist-port id1 id2 c1 c2)))

(defn add-port [id p]
  (swap! s/peers assoc-in [id :port] p)
  (set! (.-onmessage p) message-handler))
