(ns inmesh.msg
  (:require
   [inmesh.state :as s]
   [inmesh.env :as e]
   [inmesh.id :refer [IDable get-id]]
   [clojure.edn :as edn]
   [clojure.pprint :refer [pprint]]))

(def event-message "message")

(defmulti dispatch :dispatch)

(defn message-handler [e]
  (let [data (.-data e)
        receive-port? (-> ^js data .-dispatch (= "receive-port"))
        data (if receive-port?
               (-> data (js->clj :keywordize-keys true) (update :dispatch keyword) (update-in [:data :id] keyword))
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

(defn- post [worker-id data & [transferables]]
  (let [id (if (or (not (keyword? worker-id))
                   (instance? IDable worker-id)
                   (get-id worker-id))
             (get-id worker-id)
             worker-id)]
    (if (= :here id)
      (dispatch data)
      (let [w (or (-> @s/peers (get-in [id :port]))
                  (-> @s/peers (get-in [id :w])))]
        (if (and (not (e/in-screen?)) (not w))
          (let [w (or (-> @s/peers (get-in [:parent :port]))
                      (-> @s/peers (get-in [:parent :w])))]
            (.postMessage w
                          ((if (-> data :dispatch (= :receive-port)) clj->js str)
                           {:dispatch :proxy
                            :data data})
                          (if transferables
                            (clj->js transferables)
                            #js [])))
          (.postMessage w
                        (if (-> data :dispatch (= :receive-port))
                          (clj->js data)
                          (str data))
                        (if transferables
                          (clj->js transferables)
                          #js [])))))))

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
                   :id (:id e/data)}}
        [c1]))

(defn dist-port [id1 id2 c1 c2]
  (post id1 {:dispatch :receive-port
             :data {:port c1
                    :id id2}}
        [c1])
  (post id2 {:dispatch :receive-port
             :data {:port c2
                    :id id1}}
        [c2]))

(defn add-port [id p]
  (swap! s/peers assoc-in [id :port] p)
  (set! (.-onmessage p) message-handler))
