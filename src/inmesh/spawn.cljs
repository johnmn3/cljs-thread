(ns inmesh.spawn
  (:require-macros
   [inmesh.spawn :refer [spawn]])
  (:require
   [inmesh.util :as u]
   [inmesh.state :as s]
   [inmesh.env :as e]
   [inmesh.msg :as m]
   [inmesh.sync :as sync]))

(defn after-sw-registration [p afn]
  (-> p
      (.then #(if (or (.-active %) (.-installing %))
                (afn %)
                (.addEventListener
                 (.-installing %) "onstatechange"
                 (partial afn %))))))

(defn on-sw-registration-reload []
  (-> (js/navigator.serviceWorker.getRegistration)
      (.then #(when-not (.-controller js/navigator.serviceWorker)
                (.reload js/window.location)))))

(defn on-sw-ready [afn]
  (-> (js/navigator.serviceWorker.getRegistration)
      (.then js/navigator.serviceWorker.ready)
      (.then #(afn %))))

(defn link [id]
  (when-not (-> @s/peers (get-in [id :port]))
    (if (e/in-screen?)
      (when-not (= id :sw)
        (if-not (= id :root)
          (do (println :can-only-spawn :root :or :service-worker :in-screen)
              (throw (ex-info "Can only spawn :root or the service worker (:sw) in screen" {})))
          (m/add-port id (-> @s/peers (get-in [id :w])))))
      (let [[c1 c2] (m/mk-chan-pair)]
        (m/send-port id c1)
        (m/add-port id c2)))))

(defn get-connection-string [{:keys [id]}]
  (let [sw-override (:sw-connect-string @s/conf "sw.js")
        core-override (:core-connect-string @s/conf "/core.js")
        root-override (:root-connect-string @s/conf core-override)
        future-override (:future-connect-string @s/conf core-override)
        future-override (:injest-connect-string @s/conf core-override)
        repl-override (:repl-connect-string @s/conf core-override)]
    (cond
      (= :sw id) sw-override
      (= :repl id) repl-override
      (= :root id) root-override
      (= :future id) future-override
      (= :injest id) future-override
      (= :core id) core-override
      :else core-override)))

(def ready? (atom false))
(declare do-spawn)

(defn spawn-sw [init-callback]
  (let [url (str (get-connection-string {:id :sw})
                 (u/encode-qp {:id :sw}))]
    (-> (js/navigator.serviceWorker.register url)
        (after-sw-registration
         #(do (if (.-active %)
                (m/add-port :sw (.-active %))
                (do (m/add-port :sw (.-installing %))
                    (.reload js/window.location)))
              (init-callback))))))

(defn root-spawn [{:as data :keys [deamon?]}]
  (let [id (u/gen-id data)
        url (str (get-connection-string data)
                 (u/encode-qp (merge {:id id :conf @s/conf} data)))
        w (js/Worker. url)]
    (set! (.-onmessage w) m/message-handler)
    (when deamon?
      (swap! s/peers assoc id {:w w :id id})
      (when-not (= id :sw)
        (link id)
        (m/post id
                {:dispatch :call
                 :data (merge
                        {:sfn (str (fn [] #_(reset! ready? true))) :from (:id e/data) :to id}
                        {:opts {:no-res? true}})})))
    id))

(defn meshify [id]
  (let [peer-ids (filter (complement #{id}) (keys @s/peers))]
    (when (seq peer-ids)
      (->> peer-ids
           (mapv #(let [[c1 c2] (m/mk-chan-pair)]
                    (when-not (= % :parent)
                      (m/dist-port id % c1 c2))))))))

(defn local-spawn [{:as data :keys [deamon?]}]
  (assert (or (and (e/in-root?) (not (= (:id data) :sw)))
              (and (e/in-screen?) (or (= (:id data) :root) (= (:id data) :sw)))))
  (let [id (root-spawn data)]
    (when-not (= id :sw)
      (when deamon? (meshify id)))
    id))

(defmethod m/dispatch :spawn
  [{:keys [data]}]
  (if-not (or (e/in-root?) (and (e/in-screen?) (or (= :sw (:id data)) (= :root (:id data)))))
    (throw (js/Error. "Can't spawn locally if not on root or screen"))
    (local-spawn data)))

(defn send-spawn [id data]
  (m/post id
          {:dispatch :spawn
           :data data}))


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

(defn ^:export do-spawn [eargs {:as data :keys [caller id]} efn]
  (let [{:as data :keys [id]}
        (merge data
               {:from (:id e/data) :to :root}
               (if (and (not id) efn)
                 {:id (u/gen-id data)}
                 {:deamon? true
                  :id (or id (u/gen-id data))})
               (when-not caller {:caller (:id e/data)})
               (when efn {:efn (str efn) :eargs eargs}))]
    (if (= :sw id)
      (if (e/in-screen?)
        (local-spawn data)
        (send-spawn :screen data))
      (if (e/in-root?)
        (local-spawn data)
        (if (and (e/in-screen?) (= id :root))
          (local-spawn data)
          (send-spawn :root data))))
    (sync/wrap-derefable data)))
