(ns inmesh.core
  (:require-macros [inmesh.core :refer [in wait future =>> tfan on-when spawn]])
  (:require
   [cljs.reader :as reader]
   [clojure.pprint :refer [pprint]]
   [clojure.edn :as edn]
   [goog.string :as string]
   [injest.impl :as i]
   [injest.path :as p :refer [x>>]]))

(set! reader/*default-data-reader-fn* (atom tagged-literal))

(defn wait-until [condition {:keys [resolve duration max-time timeout-resolve]}]
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
                          (resolve* result))
                        #_(resolve* true))
                    (when (-> time-passed (> max-time))
                      (js/clearInterval @timer-id)
                      (if timeout-resolve
                        (resolve (timeout-resolve))
                        (reject (js/Error. "Timed out")))
                      #_#_:else (println :RUNNING_INTERVAL :SECONDS_PASSED (/ time-passed 1000)))))]
           (reset! timer-id (js/setInterval interval-fn duration))))))))

(defn do-on-when [pred opts afn]
  (-> (wait-until pred opts)
      (.then afn)))

(defn encode-qp [m]
  ;; (println :encoding (pr-str m))
  (let [qp-s (str "?" (string/urlEncode (pr-str m)))]
    ;; (println :encoding-res (pr-str qp-s))
    qp-s))

(defn decode-qp [s]
  ;; (println :decoding (pr-str s))
  (some->> s
           str
           (#(if (.startsWith % "?") (rest %) (seq %)))
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

(defn in-sw? []
  (-> init-data :id (= :sw)))

(defn in-core? []
  (-> init-data :id (= :core)))

(defn in-future? []
  (-> init-data :id (= :future)))

(defn in-branch? []
  (and (not (in-screen?)) (not (in-root?))))

;; (defn in-shadow? []
;;   (exists? js/self.shadow.cljs))

;; (defn in-figwheel? []
;;   (exists? js/self.figwheel.core))

#_(println :in (cond (in-shadow?) :shadow
                     (in-figwheel?) :figwheel))

(def event-message "message")

(def conf (atom {:connect-string nil}))

(def peers (atom {}))

(def local-val (atom nil))

(when-not (in-screen?)
  (swap! peers assoc :parent {:id :parent :w js/self :port js/self})
  (when (in-root?)
    (swap! peers assoc :screen {:id :screen :w js/self :port js/self})))

(defmulti msg-dispatch :dispatch)

(defn message-handler [e]
  ;; (let [data (.-data e)]
  ;;   (when-not (-> data .-dispatch (= "receive-port"))))
      ;; (println :message-handler :data (.-data e))))
  (let [data (.-data e)
        receive-port? (-> ^js data .-dispatch (= "receive-port"))
        data (if receive-port?
               (-> data (js->clj :keywordize-keys true) (update :dispatch keyword) (update-in [:data :id] keyword))
               (-> data edn/read-string))]
    (msg-dispatch data)))

(if (not (in-screen?))
  (.addEventListener js/self event-message message-handler)
  (.addEventListener js/window event-message message-handler))

(defn do-pprint [s]
  (pprint s))

(defmethod msg-dispatch :pprint
  [{:keys [data]}]
  (do-pprint data))

(defmethod msg-dispatch :receive-port
  [{{:keys [id port]} :data}]
  (swap! peers assoc-in [id :port] port)
  ;; (println :msg-dispatch :receive-port )
  (set! (.-onmessage port) message-handler))

(defprotocol IDable
  "Protocol for types which have an ID"
  (-id [x]
    "Returns id if a value has an ID."))

(def get-id -id)

(defn- post [worker-id data & [transferables]]
  (let [id (if (instance? IDable worker-id) (get-id worker-id) worker-id)]
    ;; (println :id (:id init-data) :worker-id worker-id)
    (if (= :here id)
      (msg-dispatch data)
      (let [w (or (-> @peers (get-in [id :port]))
                  (-> @peers (get-in [id :w])))]
        (if (and (not (in-screen?)) (not w))
          (let [w (or (-> @peers (get-in [:parent :port]))
                      (-> @peers (get-in [:parent :w])))]
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


;; proxy
;; :proxy-data
;; {:dispatch :proxy,
;;  :data 
;;  {:dispatch :call,
;;   :data {:sfn "some-fn"}
;;   :from :core,
;;   :to :screen,
;;   :sargs [],
;;   :opts {:request-id "7479f645-7f23-4c9a-b87d-d306282509ae"}}}
;; :receive :data and forward to forward-id
(defmethod msg-dispatch :proxy
  [{data :data}]
  (let [id (-> data :data :to)]
    ;; (println :proxying :to id :from (-> data :data :from))
    (if (= id (:id init-data))
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

(defn add-port [id p]
  (swap! peers assoc-in [id :port] p)
  ;; (println :add-port :p p :keys (js-keys p))
  ;; (println :active? (.-active p))
  (set! (.-onmessage p) message-handler))

(defn after-sw-registration [p afn]
  (-> p
      (.then #(do #_(println :after-sw-registration
                             :active (.-active %)
                             :installing (.-installing %)
                             :keys (js-keys %))
               (if (or (.-active %) (.-installing %)) ; (= "activated" (.-state (.-active %)))
                 (afn %)
                 (.addEventListener
                  (.-installing %) "onstatechange"
                  (partial afn %)))))))

;; (defonce reloaded? (atom false))

(defn on-sw-registration-reload []
  (-> (js/navigator.serviceWorker.getRegistration #_"/intercept/")
      (.then #(do ;(println :on-sw-registration-reload (pr-str %))
                (when-not (.-controller js/navigator.serviceWorker) ; % ; @reloaded?
                  ;;  (reset! reloaded? true)
                  (.reload js/window.location))))))

(defn on-sw-ready [afn]
  (-> (js/navigator.serviceWorker.getRegistration #_"/intercept/")
      (.then #(do ;(println :on-sw-ready1 (pr-str %))
                  ;(println :keys (js-keys %))
                js/navigator.serviceWorker.ready
                #_(if-not (.-active %) ;(= "activated" (.-state (.-active %)))
                    (do (println :not-ready!!!!!!!)
                        ;(.addEventListener (.-installing %) "onstatechange" afn)
                        js/navigator.serviceWorker.ready)
                    (afn %))))
      (.then #(do ;(println :on-sw-ready2 %)
                (afn %)))))

(defn link [id]
  (when-not (-> @peers (get-in [id :port]))
    (if (in-screen?)
      (when-not (= id :sw) ; if (= id :sw)
        #_(on-sw-ready #(do (println :link :sw % :keys (js-keys %))
                            (add-port id %)))
        (if-not (= id :root)
          (do (println :can-only-spawn :root :or :service-worker :in-screen)
              (throw (ex-info "Can only spawn :root or the service worker (:sw) in screen" {})))
          (add-port id (-> @peers (get-in [id :w])))))
      (let [[c1 c2] (mk-chan-pair)]
        (send-port id c1)
        (add-port id c2)))))

(defn gen-id [& [data]]
  (or (:id data)
      (str (random-uuid))))

(declare do-in)

(defn scripts-src [src-str]
  ;; (println :calling-script-src :in (:id init-data) :with src-str)
  (identity src-str) #_(let [the-fn (fn []
                                      (let [origin js/location.origin
                                            scripts (.getElementsByTagName js/document "SCRIPT")
                                            srcs (->> (for [i (range (.-length scripts))] (aget scripts i))
                                                      (remove #(empty? (.-src %)))
                                                      (mapv #(->> % .-src (drop (count origin)) (apply str)))
                                                      set)]
                                        (println :srcs)
                                        (pprint srcs)
                                        (srcs src-str)))]
                         (if (in-screen?)
                           (the-fn)
                           @(in :screen (the-fn)))))

;; (scripts-src "/cljs-out/screen-main.js")
;; (in :screen [scripts-src]
;;     (println :scripts)
;;     (println :in-scripts? (scripts-src "/cljs-out/screen-main.js")))
    ;; (pprint (scripts-src)))

;; goog/basePath
;; js/location.host
;; (js-keys js/location)
;; js/location.origin
;; js/location.pathname
;; js/location.href

(defn get-location []
  (str js/location.origin js/location.pathname))

#_(in :screen [get-location] (println :location (get-location)))
#_(in :root (println :peers (keys @peers)))

(defn shadow-connection-strings [{:keys [id]}]
  (let [location (get-location)
        root-override (:root-connect-string @conf)
        future-override (:future-connect-string @conf)
        core-override (:core-connect-string @conf)
        sw-override (:sw-connect-string @conf)
        default-shadow "/core.js"]
    (cond
      (= :sw id) (or sw-override (scripts-src "/sw.js") "/sw.js")
      (= :repl id) (or sw-override (scripts-src "/repl.js") "/repl.js")
      ;; (= :root id) (or root-override (scripts-src "/js/root.js") default-shadow)
      ;; (= :future id) (or future-override (scripts-src "/js/future.js") default-shadow)
      ;; (= :core id) (or core-override (scripts-src "/js/core.js") default-shadow)
      :else default-shadow)))

(defn figwheel-connection-strings [{:keys [id]}]
  (let [root-override (:root-connect-string @conf)
        future-override (:future-connect-string @conf)
        core-override (:core-connect-string @conf)
        sw-override (:sw-connect-string @conf)
        default-figwheel "/cljs-out/root-main.js"
        simple? (if-not (:advanced? @conf)
                  true
                  false)]
    (cond simple? (cond (= :core id) "/core-main.js"
                        :else "/worker-main.js")
          (= :sw id) (or sw-override "/sw-main.js" (scripts-src "/cljs-out/sw-main.js") "/sw-main.js")
          (= :root id) (or root-override (scripts-src "/cljs-out/root-main.js") default-figwheel)
          (= :future id) (or future-override (scripts-src "/cljs-out/future-main.js") default-figwheel)
          (= :core id) (or core-override (scripts-src "/cljs-out/core-main.js") default-figwheel)
          :else default-figwheel)))

(defn get-connection-string [{:as data :keys [id]}]
  (let [simple-override (:simple-connect-string @conf)
        root-override (:root-connect-string @conf)
        future-override (:future-connect-string @conf)
        core-override (:core-connect-string @conf)
        sw-override (:sw-connect-string @conf)
        default-cljs "out/worker.js"]
    (cond simple-override simple-override
          ;; (-> data :id (= :sw)) (or sw-override "/sw-main.js")
          true #_(in-shadow?) (shadow-connection-strings data)
          true #_(in-figwheel?) (figwheel-connection-strings data)
          ;; (= :root id) (or root-override (scripts-src "/js/screen.js") default-cljs)
          ;; (= :future id) (or future-override (scripts-src "/js/future.js") default-cljs)
          ;; (= :core id) (or core-override (scripts-src "/js/core.js") default-cljs)
          :else default-cljs)))

(def ready? (atom false))
(declare do-spawn)

(defn root-spawn [{:as data :keys [deamon?]}]
  ;; (println :in-root-spawn data)
  (let [id (gen-id data)
        url (str (get-connection-string data)
                 (encode-qp (merge {:id id} data)))
        ;; _ (println :root-spawn :in (:id init-data) :url url)
        w (if (-> data :id (= :sw))
            ;; (on-sw-registration #_#(add-port id (.-active %)) #(spawn {:id :root}))
            (-> (js/navigator.serviceWorker.register url #_#js {:scope "/intercept/"})
                ;; #_
                (after-sw-registration #(do ;(println :finally-spawning-root)
                                          ;; (println :sw :install (.-installing %))
                                          ;; (println :sw :active (.-active %))
                                          (if (.-active %)
                                            (add-port id (.-active %))
                                            (do (add-port id (.-installing %))
                                                (.reload js/window.location)))
                                            ;; (link id)
                                          (spawn {:id :root}))))
            (js/Worker. url))]
    (set! (.-onmessage w) message-handler)
    (when deamon?
      (swap! peers assoc id {:w w :id id})
      (when-not (= id :sw)
        (link id)
        (in id (reset! ready? true))))
    ;; (println :setting-ready-on id)
    ;; (when deamon?
    ;;   (when-not (= id :sw)
    ;;     (in id (reset! ready? true))))
    id))

(defn meshify [id]
  ;; (println :meshify :from (:id init-data) :id id)
  ;; (println :peers (keys @peers))
  (let [peer-ids (filter (complement #{id}) (keys @peers))]
    (when (seq peer-ids)
      (->> peer-ids
           (mapv #(let [[c1 c2] (mk-chan-pair)]
                    (dist-port id % c1 c2)))))))

(defn local-spawn [{:as data :keys [deamon?]}]
  (assert (or (and (in-root?) (not (= (:id data) :sw)))
              (and (in-screen?) (or (= (:id data) :root) (= (:id data) :sw)))))
  (let [id (root-spawn data)]
    (when-not (= id :sw) ;if (= id :sw)
      (when deamon? (meshify id)))
    id))

(defmethod msg-dispatch :spawn
  [{:keys [data]}]
  (if-not (or (in-root?) (and (in-screen?) (or (= :sw (:id data)) (= :root (:id data)))))
    (throw (js/Error. "Can't spawn locally if not on root or screen"))
    (local-spawn data)))

(defn send-spawn [id data]
  (post id
        {:dispatch :spawn
         :data data}))

(defn request [getter & [resolve reject]]
  ;; (println :sending-request_getter getter :resolve resolve)
  (let [do-request (fn []
                     (try
                       (let [xhr (js/XMLHttpRequest.)]
                         (.open xhr "GET"
                                (str #_(if (in-figwheel?) "/cljs-out" "/js") "/intercept/request/key.js" (encode-qp getter))
                                (if (or (in-screen?) resolve) true false))
                         (.setRequestHeader xhr "cache-control" "no-cache, no-store, max-age=0")
                         (when resolve
                           (set! (.-onload xhr) #(resolve (edn/read-string (.-response xhr)))))
                         (when reject
                           (set! (.-onerror xhr) #(reject (.-status xhr))))
                         (.send xhr)
                         (if resolve
                           xhr
                           (let [res (edn/read-string (.-responseText xhr))]
                             res)))
                       (catch :default e
                         (println :error :requesting-response :e e))))]
    ;; (when (in-screen?) (println :peers (keys @peers)))
    ;; (println :getter getter)
    (when-not (= getter :sw)
      (if-not (in-screen?)
        (do-request)
        (when #_if (.-controller js/navigator.serviceWorker)
              (do-request) #_(do-on-when #(.-controller js/navigator.serviceWorker)
                                         do-request))))))

(defn send-response [getter]
  ;; (println :sending-response :getter getter)
  (try
    (let [xhr (js/XMLHttpRequest.)]
      (.open xhr "GET" (str #_(if (in-figwheel?) "/cljs-out" "/js") "/intercept/response/key.js" (encode-qp getter)) #_false)
      (.setRequestHeader xhr "cache-control" "no-cache, no-store, max-age=0")
      (.send xhr "request")
      (.-responseText xhr)
      nil)
    (catch :default e
      (println :error :sending-response :e e))))

(extend-type js/Promise
  ICloneable
  (-clone [s] (.then s)))

(extend-type string
  ICloneable
  (-clone [s] (js/String. s)))

(extend-type cljs.core/Keyword
  ICloneable
  (-clone [s] (keyword s)))

(defn wrap-derefable [{:keys [promise? id efn]}]
  (let [id (if (instance? IDable id) (get-id id) id)
        resolved? (atom false)
        resolved-value (atom nil)
        ;; _ (println :wrapping :request-id id)
        ;; _ (println :wrap-derefable :id id)
        p (if-not (or efn (in-root?) (in-screen?) promise?)
            id
            ;; (js/Promise.resolve
            ;;  (.then
            (-> (js/Promise. (if efn #(request id %1 %2) #(do id)))
                (.then (fn [result]
                         (reset! resolved? true)
                        ;;  (println :setting-resolved-value-to result)
                         (reset! resolved-value result)
                         (if (:error result)
                           (throw (ex-info "Error in remote call" {:result (pr-str result)}))
                           result)))))]
    (specify p
             IDable
             (-id [_] id)
             IPending
             (-realized? [_] @resolved?)
             IPrintWithWriter
             (-pr-writer [x writer opts]
                        ;;  (println :IPrintWithWriter id)
                         (-write writer (str "#object[inmesh.core " id #_(str id) #_(pr-str id) " "))
                         (pr-writer {:status (if @resolved? :ready :pending)
                                     :val @resolved-value}
                                    writer opts)
                         (-write writer "]"))
             IDeref
             (-deref [_]
                    ;;  (println :deref-called!)
                     (if-let [res @resolved-value]
                       res
                       (if (or (in-root?) (in-screen?) promise?)
                         p
                         (let [;_ (println :making-request!)
                               res (request id)]
                          ;;  (println :got-res! res)
                           (reset! resolved? true)
                           (reset! resolved-value res)
                           (if (:error res)
                             (throw (ex-info "Error in remote call" {:results (pr-str res)}))
                             res))))))))

(defn parse-args [[data afn]]
  (if (map? data) [data afn] [{} data]))

(defn parse-in [x]
  (let [f (first x)
        s (second x)
        t (first (rest (rest x)))]
    (cond (and (vector? f) (map? s)) [f s t]
          (vector? f) [f {} s]
          (map? f) [[] f s]
          :else [[] {} f])))

(defn do-spawn [eargs {:as data :keys [caller id]} efn] ;[& args]
  (let [;[eargs {:as data :keys [caller id]} efn] (parse-in args)
        {:as data :keys [id]}
        (merge data
               (if (and (not id) efn)
                 {:id (gen-id data)}
                 {:deamon? true
                  :id (or id (gen-id data))})
               (when-not caller {:caller (:id init-data)})
               (when efn {:efn (str efn) :eargs eargs}))]
    (if (= :sw id)
      (if (in-screen?)
        (local-spawn data)
        (send-spawn :screen data))
      (if (in-root?)
        (local-spawn data)
        (if (and (in-screen?) (= id :root))
          (local-spawn data)
          (send-spawn :root data))))
    ;; (println :efn? efn)
    ;; (println :spawn :wrapping :id id)
    (if-not true ; efn
      id
      (wrap-derefable data))))

(defn do-call
  [{:keys [data] :as outer-data}]
  (let [{:keys [sfn sargs opts]} data
        ;; _ (when (in-screen?)
        ;;     (println :trying-do-call-in-screen! data))
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
                (println :error-in (:id init-data))
                (println :error-in-do-call e)
                (println :error (.-error e))
                (println :data data)
                (when-not (in-sw?)
                  (send-response {:request-id (:request-id opts) :response {:error (pr-str e)}}))))]
    ;; (println :in-do-call :outer-data (dissoc outer-data :data))
    ;; (println :in-do-call :data (dissoc data :sfn :sargs))
    ;; (println :in-do-call :res res)

    (when (:atom? opts)
      (reset! local-val res))
    (when (and (not (:no-res? opts)) (not (in-sw?)))
      (send-response {:request-id (:request-id opts) :response res}))))


(defmethod msg-dispatch :call
  [data]
  (do-call data))

(defn do-in [id & [args afn opts]]
  (let [[afn args] (if afn [afn args] [args nil])
        in-id (gen-id)
        sargs (->> args (mapv #(if (fn? %) (str "#in/mesh " %) %)))
        post-in #(post id {:dispatch :call
                           :data (merge
                                  {:sfn afn :from (:id init-data) :to id}
                                  (when args
                                    {:sargs sargs})
                                  (when opts
                                    {:opts (assoc opts :request-id in-id)}))})]
    (if-not (in-screen?)
      (post-in)
      (if (contains? @peers id)
        (post-in)
        (on-when (contains? @peers id)
                 (post-in))))
    ;; (println :do-in :id id :in-id in-id)
    (when (not (:no-res? opts))
      (wrap-derefable (merge opts {:id in-id})))))

(defn sleep [n]
  (let [xhr (js/XMLHttpRequest.)]
    (.open xhr "GET" (str #_(if (in-figwheel?) "/cljs-out" "/js") "/intercept/sleep/t.js?" n) false)
    (.setRequestHeader xhr "cache-control" "no-cache, no-store, max-age=0")
    (.send xhr "request")
    (.-responseText xhr)))
  ;; nil)

(comment

  (time (sleep 100))

  :end)

(def responses
  (atom {}))

;; do screen setup tasks
(when (in-screen?)
  ;; (spawn {:id :future})
  ;; (spawn {:id :core})

  (def sw (spawn {:id :sw :opts {:no-res? true}}))
  ;; (-> js/navigator.serviceWorker.ready
  ;;     (.then #(do (println :ready!!!!!) (spawn {:id :root}))))
  (on-sw-registration-reload)
  ;; (on-sw-registration #(spawn {:id :root}))
  #_(-> (js/navigator.serviceWorker.getRegistration "/intercept/")
        (.then #(if (= "activated" (.-state (.-active %)))
                  (spawn {:id :root})
                  (.addEventListener (.-installing %) "onstatechange"
                                     (fn [] (spawn {:id :root}))))))

  :end)

(defn num-cores []
  (.-hardwareConcurrency js/self.navigator))

(def future-pool (atom {:available #{} :in-use #{}}))

(defn take-worker! []
  (when-let [p (some->> @future-pool :available first)]
    ;; (println :take-worker :p p)
    (swap! future-pool
           (fn [{:keys [available in-use]}]
             {:available (disj available p)
              :in-use (conj in-use p)}))
    p))

(defn put-back-worker! [p]
  ;; (println :put-back-worker! p)
  (swap! future-pool
         (fn [{:keys [available in-use]}]
           {:available (conj available p)
            :in-use (disj in-use p)}))
  nil)

;; do root setup tasks
(def future-pool-size (or (:future-pool-size @conf) (-> (num-cores) (/ 2))))
(defn mk-worker-id [n] (keyword (str "fp-" n)))
(def future-workers (->> future-pool-size range #_(take 4) (map mk-worker-id)))

(def injest-pool-size (or (:injest-pool-size @conf) (-> (num-cores) #_(/ 2))))
(defn mk-injest-worker-id [n] (keyword (str "injest-" n)))
(def injest-workers (->> injest-pool-size range (map mk-injest-worker-id)))

(when (in-future?)

  (swap! future-pool update :available into future-workers)

  :end)

(defn launch-injest-pool []
  (when (in-root?)
    (->> injest-workers (mapv (fn [wid] (spawn {:id wid}))))))

(when (in-root?)
  ;; (swap! future-pool update :available into future-workers)
  ;; (def last-future-worker (last future-workers))
  ;; (def last-injest-worker (last injest-workers))
  (spawn {:id :future})
  (spawn {:id :core})
  (when false ;true ;(in-shadow?)
    (spawn {:id :repl}))

  ;(on-when (contains? @peers :sw) {:duration 100})

  ;(->> injest-workers (mapv (fn [wid] (spawn {:id wid}))))

  ;(on-when (contains? @peers last-injest-worker) {:duration 100})
  (->> future-workers (mapv (fn [wid] (spawn {:id wid}))))
  ;; (on-when (contains? @peers last-future-worker) {:duration 100}
  ;;   (spawn {:id :future}))
  ;; (on-when (contains? @peers :future) {:duration 100}
  ;;   (spawn {:id :core}))
  ;; (-> (wait-until #(contains? @peers :sw) :duration 100)
  ;;     (.then #(->> injest-workers (mapv (fn [wid] (spawn {:id wid}))))))
  ;; (-> (wait-until #(contains? @peers last-injest-worker) :duration 100)
  ;;     (.then #(->> future-workers (mapv (fn [wid] (spawn {:id wid}))))))
  ;; (-> (wait-until #(contains? @peers last-future-worker) :duration 100)
  ;;     (.then #(spawn {:id :future})))
  ;; (-> (wait-until #(contains? @peers :future) :duration 100)
  ;;     (.then #(spawn {:id :core})))

  :end)

(defn do-future [args afn opts]
  (let [fut-id (gen-id)]
    (in :future ;:root
        {:no-res? true}
        (on-when (-> @future-pool :available seq) {:duration 5}
                 (let [worker (take-worker!)]
                   (in worker
                       {:no-res? true}
                       (try
                         (if (seq args)
                           ((apply afn args)
                            #(in :sw
                                 {:no-res? true}
                                 (swap! responses assoc fut-id %)))
                           ((afn)
                            #(in :sw
                                 {:no-res? true}
                                 (swap! responses assoc fut-id %))))
                         (catch :default e
                           (in :sw {:no-res? true} (swap! responses assoc fut-id {:error (pr-str e)}))))
                       (in :future
                           {:no-res? true}
                           (put-back-worker! worker))))))
    (wrap-derefable (merge opts {:id fut-id}))))

(defn do-wait [id args afn opts]
  (let [fut-id (gen-id)]
    (in id
        {:no-res? true}
        (if (seq args)
          ((apply afn args) #(in :sw (swap! responses assoc fut-id %)))
          ((afn) #(in :sw (swap! responses assoc fut-id %)))))
    (request fut-id)))

(defn do-swap! [id afn & args]
  (let [res @(in id (apply swap! local-val args))]
    res))


(comment

  (wait :p-1
        (println :hi)
        (yield 1))

  :end)

(when (in-core?)

  ;; (println :in-core)

  :end)

;; do sw setup tasks
(when (in-sw?)

  (defn sleep-time [t]
    (js/Promise.
     (fn [r] (js/setTimeout r t))))

  (defn response [result]
    (js/Response. result
                  #js {"headers"
                       #js {"content-type" "text/html; charset=utf-8"
                            "Cache-Control" "max-age=31556952,immutable"}}))

  (defn wake []
    (response "Wake up!"))

  (defn sleep [e]
    (let [u (js/URL. (.-url e.request))
          t (pr-str (->> u .-search str rest (apply str) edn/read-string))]
      (.respondWith e (-> (sleep-time t)
                          (.then wake)))))

  (defn handle-request [e]
    (let [u (js/URL. (.-url e.request))
          r (->> u .-search decode-qp)]
      ;; (println :handle-request (pr-str r))
      (.respondWith e (-> (on-when (contains? @responses r)
                                   (let [result (get @responses r)]
                                     (swap! responses dissoc r)
                                     (response result)))
                          (.then #(js/Promise.resolve %))
                          (.catch #(do (println :error %)
                                       (println :stack (.-stack %))
                                       (println :event (pr-str e))
                                       (println :url (pr-str u))
                                       (println :handle-request (pr-str r))
                                       (js/Promise.resolve (clj->js {:error %}))))))))

  (defn handle-respond [e]
    (let [u (js/URL. (.-url e.request))
          ;; _ (println :u u)
          r (->> u .-search decode-qp)]
      ;; (println :handle-response (pr-str r))
      (swap! responses assoc (:request-id r) (:response r))
      (.respondWith e (js/Promise.resolve (response "Success")))))

  (defn fetch-response [e]
    (let [url (js/URL. (.-url e.request))
          path (.-pathname url)]
      ;; (println :handle-fetch-response path)
      (cond (= path "/intercept/sleep/t.js")
            (sleep e)
            (= path "/intercept/request/key.js")
            (handle-request e)
            (= path "/intercept/response/key.js")
            (handle-respond e))))

  (.addEventListener js/self "install" #(js/self.skipWaiting))
                                       ;#(.waitUntil % (js/self.clients.claim)))
  (.addEventListener js/self "activate" #(js/self.clients.claim))
                                         ;#(js/self.skipWaiting))
                                         ;#(.waitUntil % (js/self.clients.claim)))
  (.addEventListener js/self "fetch" fetch-response)

  :end)

;; do setup and teardown tasks for ephemeral threads
(when (and (not (in-sw?)) (not (in-screen?))) ;(not (:deamon? init-data))
  ;; (println :starting-ephemeral-worker)
  ;; (println :init-data init-data)
  ;; (println :peers (keys @peers))
  ;; (def e-start (.getTime (js/Date.)))
  ;; (println :in :ephemeral init-data)
  (def e-fn (:efn init-data))
  (def e-args (:eargs init-data))
  (def sargs (->> e-args (mapv #(if (fn? %) (str "#in/mesh " %) %))))
  ;; (def caller (:caller init-data))
  (when e-fn (do-call {:data {:sfn e-fn
                              :sargs e-args
                              :opts {:request-id (:id init-data) :atom? true}}}))
  ;; (println :res res)
  ;; (println :ending-ephemeral-worker :after (-> (js/Date.) .getTime (- e-start)) :ms)
  (when (not (:deamon? init-data))
    (.close js/self))
  :end)
(* 2 2 2 4096)
;; fan, similar to r/fold
(def ^:dynamic *par* nil)
(def ^:dynamic *chunk* nil)
(defn fan [xf args & {:keys [par chunk]}]
  (let [n-pws (or *par* par (* injest-pool-size 8))
        pws (take n-pws (cycle injest-workers))
        args-parts (partition-all n-pws (partition-all (or *chunk* chunk #_32768 #_16384 2048) args))]
    (->> args-parts
         (map (fn [ags]
                (->> ags
                     (mapv (fn [p a] (in p (sequence (xf) a)))
                           pws))))
         (mapcat #(map deref %))
         (apply concat))))

(defn fan-xfn [xf-group]
  (fn [args]
    (fan #(i/compose-transducer-group xf-group) (vec args))))

(defn flip [n]
  (apply comp (take n (cycle [inc dec]))))

(comment
  (->> [1 2 3 4]
       (sequence (i/compose-transducer-group [[map inc] [map inc]])))
  (->> [1 2 3 4]
       ((fan-xfn [[map inc] [map inc]])))
  (fan #(i/compose-transducer-group [[map inc] [map inc]]) [1 2 3])
  ((tfan [[map inc] [map inc]]) [1 2 3])

  (=>> [1 2 3]
       (map inc)
       (map inc))

  (->> (range 1000000)
       (map inc)
       (filter odd?)
       (map (flip 100))
       (mapcat #(do [% (dec %)]))
       (partition-by #(= 0 (mod % 5)))
       (map (partial apply +))
       (map (partial + 10))
       (map (flip 100))
       (map (flip 1000))
       (map #(do {:temp-value %}))
       (map :temp-value)
       (filter even?)
       (apply +)
       println
       time)

  (x>> (range 1000000)
       (map inc)
       (filter odd?)
       (map (flip 100))
       (mapcat #(do [% (dec %)]))
       (partition-by #(= 0 (mod % 5)))
       (map (partial apply +))
       (map (partial + 10))
       (map (flip 100))
       (map (flip 1000))
       (map #(do {:temp-value %}))
       (map :temp-value)
       (filter even?)
       (apply +)
       println
       time)

  (binding [#_#_*par* 64 #_#_*chunk* 16384]
    (=>> (range 1000000)
         (map inc)
         (filter odd?)
         (map (flip 100))
         (mapcat #(do [% (dec %)]))
         (partition-by #(= 0 (mod % 5)))
         (map (partial apply +))
         (map (partial + 10))
         (map (flip 100))
         (map (flip 1000))
         (map #(do {:temp-value %}))
         (map :temp-value)
         (filter even?)
         (apply +)
         println
         time))

  (->> (range 1000000)
       (map (flip 100))
       (filter odd?)
       (map (flip 100))
       (map inc)
       (map (flip 100))
       (apply +)
       (println)
       time)

  (x>> (range 1000000)
       (map (flip 100))
       (filter odd?)
       (map (flip 100))
       (map inc)
       (map (flip 100))
       (apply +)
       (println)
       time)


  (=>> (range 1000000)
       (map (flip 100))
       (filter odd?)
       (map (flip 100))
       (map inc)
       (map (flip 100))
       (apply +)
       (println)
       time)

  (in :screen
      (-> (=>> (range 1000000)
               (map (flip 100))
               (filter odd?)
               (map (flip 100))
               (map inc)
               (map (flip 100))
               (apply +)
               time)
          (.then #(println :res %))))

  (binding [*par* 32 *chunk* 16384]
    (=>> (range 1000000)
         (map (flip 100))
         (filter odd?)
         (map (flip 100))
         (map inc)
         (map (flip 100))
         (apply +)
         (println)
         time))


  (->> (range 1000000)
       (map inc)
       (filter odd?)
       (mapcat #(do [% (dec %)]))
       (partition-by #(= 0 (mod % 5)))
       (map (partial apply +))
       (map (partial + 11))
       (map #(do {:temp-value %}))
       (map :temp-value)
       (map (flip 100))
       (filter even?)
       (map (partial + 12))
       (map #(do {:temp-value1 %}))
       (map :temp-value1)
       (map (flip 100))
       (filter even?)
       (map (partial + 13))
       (map #(do {:temp-value2 %}))
       (map :temp-value2)
       (map (flip 100))
       (filter odd?)
       (map (partial + 14))
       (map #(do {:temp-value3 %}))
       (map :temp-value3)
       (map (flip 100))
       (filter even?)
       (map (partial + 15))
       (map #(do {:temp-value4 %}))
       (map :temp-value4)
       (map (flip 100))
       (filter odd?)
       (apply +)
       time)

  (=>> (range 1000000)
       (map inc)
       (filter odd?)
       (mapcat #(do [% (dec %)]))
       (partition-by #(= 0 (mod % 5)))
       (map (partial apply +))
       (map (partial + 11))
       (map #(do {:temp-value %}))
       (map :temp-value)
       (map (flip 100))
       (filter even?)
       (map (partial + 12))
       (map #(do {:temp-value1 %}))
       (map :temp-value1)
       (map (flip 100))
       (filter even?)
       (map (partial + 13))
       (map #(do {:temp-value2 %}))
       (map :temp-value2)
       (map (flip 100))
       (filter odd?)
       (map (partial + 14))
       (map #(do {:temp-value3 %}))
       (map :temp-value3)
       (map (flip 100))
       (filter even?)
       (map (partial + 15))
       (map #(do {:temp-value4 %}))
       (map :temp-value4)
       (map (flip 100))
       (filter odd?)
       (apply +)
       time)

  (binding [*par* 64 *chunk* 1024 #_16384]
    (=>> (range 1000000)
         (map inc)
         (filter odd?)
         (mapcat #(do [% (dec %)]))
         (partition-by #(= 0 (mod % 5)))
         (map (partial apply +))
         (map (partial + 10))
         (map #(do {:temp-value %}))
         (map :temp-value)
         (filter even?)
         (apply +)
         time))

  (in :future #_(->> @future-pool
                     :in-use
                     (mapv put-back-worker!)) ;#_
      (println :pool @future-pool))

  (def tx (comp (map inc) (map inc)))
  (let [res (time (apply + (take 100000 (fan #(tx) (range) :chunk 4096))))]
    (println :got res :on :worker-pool))
  ;"Elapsed time: 1508.700000 msecs"
  ;:got 4999950000 :on :worker-pool
  ;=> nil
  (let [res (time (apply + (take 100000 (sequence (map (flip 1000)) (range)))))]
    (println :got res :on :main-thread))
  ;"Elapsed time: 5201.400000 msecs"
  ;:got 4999950000 :on :main-thread
  ;=> nil


  (time (println (apply + (take 100000 (sequence  (map (flip 1000)) (range))))))

  (time (println (apply + (take 10000 (fan #(map (flip 1000)) (range))))))
  (time (println (apply + (take 10000 (sequence  (map (flip 1000)) (range))))))

  (time (println (apply + (take 1000 (fan     #(map (flip 10000)) (range) :chunk 32)))))
  (time (println (apply + (take 1000 (sequence  (map (flip 10000)) (range))))))
  :end)
