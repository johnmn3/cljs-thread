(ns in-mesh.core
  (:require-macros [in-mesh.core #_#_:refer [in]])
  (:require
   [cljs.reader :as reader]
   [clojure.edn :as edn]
   [goog.string :as string]
   [clojure.pprint :refer [pprint]]))

(set! reader/*default-data-reader-fn* (atom tagged-literal))

(defn encode-qp [m]
  (str "?" (string/urlEncode m)))

(defn decode-qp [s]
  (some->> s
           rest
           (apply str)
           string/urlDecode
           edn/read-string))

(defn in-screen? [] (-> js/self .-document undefined? not))

(def init-data
  (let [loc-search js/location.search]
    (if-not (seq loc-search)
      (if (in-screen?)
        {:id :screen}
        {:id :root})
      (decode-qp loc-search))))

(defn in-root? []
  (-> init-data :id (= :root)))

(defn in-branch? []
  (and (not (in-screen?)) (not (in-root?))))

(defn in-shadow? []
  (exists? js/self.shadow.cljs))

(defn in-figwheel? []
  (exists? js/self.figwheel.core))

#_(println :in (cond (in-shadow?) :shadow
                     (in-figwheel?) :figwheel))

(def event-message "message")

(def conf (atom {:connect-string nil}))

(def peers (atom {}))

(defmulti msg-dispatch :dispatch) ; #(-> % :dispatch keyword))

(defn message-handler [e]
  (let [data (-> e .-data (js->clj :keywordize-keys true) (update :dispatch keyword))]
    (msg-dispatch data)))

(.addEventListener js/self event-message message-handler)

(defn do-pprint [s]
  (pprint s))

(defmethod msg-dispatch :pprint
  [{:keys [data]}]
  (do-pprint data))

(defmethod msg-dispatch :receive-port
  [{{:keys [id port]} :data}]
  (swap! peers assoc-in [id :port] port)
  (set! (.-onmessage port) message-handler))

(defn- post [worker-id data & [transferables]]
  (if (= :here worker-id)
    (msg-dispatch data)
    (let [w (or (-> @peers (get-in [worker-id :port]))
                (-> @peers (get-in [worker-id :w])))]
      (.postMessage w
                    (clj->js data)
                    (if transferables
                      (clj->js transferables)
                      #js [])))))

(defn mk-chan-pair []
  (let [c (js/MessageChannel.)
        c1 (.-port1 c)
        c2 (.-port2 c)]
    [c1 c2]))

(defn send-port [id c1]
  (post id {:dispatch :receive-port
            :data {:port c1
                   :id (:id init-data)}}
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

(defn link [id]
  (when-not (-> @peers (get-in [id :port]))
    (let [[c1 c2] (mk-chan-pair)]
      (send-port id c1)
      (set! (.-onmessage c2) message-handler)
      (swap! peers assoc-in [id :port] c2))))

(defn gen-id [& [data]]
  (or (:id data) (str "id/" (random-uuid))))

(defn get-connection-string []
  (let [connect-string-override (:connect-string @conf)]
    (cond connect-string-override connect-string-override
          (in-shadow?) "js/client.js"
          (in-figwheel?) "/cljs-out/branch-main.js")))

(defn root-spawn [data]
  (let [id (gen-id data)
        url (get-connection-string)
        w (js/Worker. (str url (encode-qp (merge {:id id} data))))]
    (swap! peers assoc id {:w w :id id})
    (link id)
    id))

(defn handle-spawn [{:as data}]
  (let [peer-ids (keys @peers)
        new-id (root-spawn data)]
    (->> peer-ids
         (mapv #(let [[c1 c2] (mk-chan-pair)]
                  (dist-port new-id % c1 c2))))
    new-id))

(defmethod msg-dispatch :spawn
  [{:keys [data]}]
  (if-not (in-root?)
    (throw (js/Error. "Cant spawn if not on root"))
    (handle-spawn data)))

(defn spawn [data]
  (if (in-root?)
    (handle-spawn data)
    (let [id (gen-id data)]
      (post :root
            {:dispatch :spawn
             :data (merge {:id id} data)})
      id)))

;; (comment

;;   (:id init-data)

;;   (in-screen?)
;;   ;; (conns)
;;   #_(focus "Elicia")
;;   init-data

;;   (in-root?)
;;   (def s1 (spawn {:x 1}))
;;   (def s2 (spawn {:x 2}))
;;   (def s3 (spawn {:x 3}))
;;   (def s4 (spawn {:x 4}))

;;   s1
;;   (keys @peers)
;;   (post s1 {:dispatch :pprint
;;             :data "hi"})
;;   (post s2 {:dispatch :pprint
;;             :data "hi2"})
;;   (post s3 {:dispatch :pprint
;;             :data "hi3"})
;;   (def ss "id/5ccda692-b999-4387-b68f-17d55f32901a")
;;   (post ss {:dispatch :pprint
;;             :data "hi-ss"})
;;   (post :here {:dispatch :pprint
;;                :data "hi from here"})

;;   (post js/self nil {:dispatch :pprint :data "hi"} [])
;;   @peers

;;   :end)

(defmethod msg-dispatch :call
  [{:keys [data]}]
  (let [{:keys [sfn sargs _opts]} data]
    (if-not sargs
      (js/eval (str "(" sfn ")();"))
      (apply (js/eval (str "(function () {return (" sfn ");})();"))
             (if (vector? sargs)
               (->> sargs (mapv #(if (and (string? %) (.startsWith % "#in/mesh"))
                                   (js/eval (str "(function () {return (" (apply str (drop 9 %)) ");})();"))
                                   %)))
               (js/eval (str "(" sargs ")();")))))))

(defn do-in [id & [args afn opts]]
  (let [[afn args] (if afn [afn args] [args nil])
        sfn  (str afn)
        sargs (->> args (mapv #(if (fn? %) (str "#in/mesh " %) %)))]
    (post id {:dispatch :call
              :data (merge
                     {:sfn sfn}
                     (when args
                       {:sargs sargs})
                     (when opts
                       {:opts opts}))})))

;; calling
;; (comment
;;   (def s1 (spawn {:x 1}))
;;   s1

;;   (defn print-in [id x]
;;     (do-in id [x] #(println :hi %)))

;;   (defn print-in [id x]
;;     (do-in id [x] (fn [x] (println :hi x))))

;;   (print-in s1 :dude)
;;   (print-in :here :dude)
;;   (str (fn [] :x))

;;   ;; (do-in :here (fn [] [1 2]) (fn [a1 a2] (println :hi a1 a2)))
;;   (do-in :here [1 2] (fn [a1 a2] (println :hi a1 a2)))
;;   ;; (do-in s1 (fn [] [1 2]) (fn [a1 a2] (println :hi a1 a2)))
;;   (do-in s1 [1 2] (fn [a1 a2] (println :hi a1 a2)))

;;   (in s1 (println :hi))
;;   (let [x 1]
;;     (in :here [x] (println :hi x)))
;;   (let [x 1]
;;     (in s1 [x] (println :hi x)))
;;   (let [x :bob
;;         get-name (fn [x] (name x))]
;;     (in :here (println :hi (get-name x))))

;;   (let [x :bob
;;         get-name (fn [x] (name x))]
;;     (do-in :here [x get-name] (fn [x get-name] (println :hi (get-name x)))))

;;   (let [x :bob
;;         get-name (fn [x] (name x))]
;;     (do-in s1 [x get-name] (fn [x get-name] (println :hi (get-name x)))))

;;   (let [x :bob
;;         get-name (fn [x] (name x))]
;;     (in s1 (println :hi (get-name x))))

;;   (let [x :bob
;;         get-name (fn [x] (name x))]
;;     (in :here [get-name x] (println :hi (get-name x))))

;;   (defn p-in [id s]
;;     (in id (println :hi s)))
;;   (p-in :here :there)

;;   (defn p-in2 [id s]
;;     (let [get-name (fn [x] (name x))]
;;       (in id [s get-name] (println :hi (get-name s)))))
;;   (p-in2 :here :there)

;;   (defn p-in3 [id s]
;;     (let [get-name (fn [x] (name x))]
;;       (in id (println :hi (get-name s)))))
;;   (p-in3 :here :there)

;;   (let [x :dude
;;         get-name (fn [x] (name x))]
;;     (in :here (println :hi (get-name x))))

;;   (let [x :dude
;;         get-name (fn [x] (name x))]
;;     (in :here [x get-name] (println :hi (get-name x))))

;;   (in s1 (println :hi))
;;   (let [x :dude
;;         get-name (fn [x] (name x))]
;;     (in s1 (println :hi (get-name x))))

;;   :end)
