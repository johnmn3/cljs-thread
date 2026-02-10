(ns cljs-thread.spawn
  (:require-macros
   [cljs-thread.spawn])
  (:require
   [cljs-thread.util :as u]
   [cljs-thread.state :as s]
   [cljs-thread.env :as e]
   [cljs-thread.platform :as p]
   [cljs-thread.msg :as m]
   [cljs-thread.sync :as sync]))

;; Browser-only SW helpers — only called when not on Node

(defn on-sw-registration-reload []
  (when-not p/node?
    (-> (js/navigator.serviceWorker.getRegistration)
        (.then #(when-not (.-controller js/navigator.serviceWorker)
                  (.reload js/window.location))))))

(defn link [id]
  (when-not (-> @s/peers (get-in [id :port]))
    (if (e/in-screen?)
      (when-not (= id :sw)
        (m/add-port id (-> @s/peers (get-in [id :w]))))
      (let [[c1 c2] (m/mk-chan-pair)]
        (m/send-port id c1)
        (m/add-port id c2)))))

(defn get-connection-string [{:keys [id]}]
  (let [sw-override (:sw-connect-string @s/conf "/sw.js")
        core-override (:core-connect-string @s/conf "/core.js")
        root-override (:root-connect-string @s/conf core-override)
        future-override (:future-connect-string @s/conf root-override)
        future-override (:injest-connect-string @s/conf root-override)
        repl-override (:repl-connect-string @s/conf core-override)]
    (cond
      (= :sw id) sw-override
      (= :repl id) repl-override
      (= :root id) root-override
      (= :future id) future-override
      (= :injest id) future-override
      (= :core id) core-override
      :else root-override)))

(declare do-spawn)

(defn spawn-sw [init-callback]
  (if p/node?
    ;; Node: no Service Worker — coordinator is the main thread, always ready
    (init-callback)
    ;; Browser: register SW
    (p/register-coordinator @s/conf init-callback)))

(defn root-spawn [{:as data :keys [deamon?]}]
  (let [id (u/gen-id data)
        conn-str (get-connection-string data)
        worker-data (merge {:id id :conf @s/conf} data)
        w (p/create-worker conn-str worker-data m/message-handler)]
    (when deamon?
      (swap! s/peers assoc id {:w w :id id})
      (when-not (= id :sw)
        (link id)
        (m/post id
                {:dispatch :call
                 :data {:sfn (str (fn [])) :from (:id e/data) :to id}})))
    id))

(defn pair-ids [id1 id2]
  (let [[c1 c2] (m/mk-chan-pair)]
    (m/dist-port id1 id2 c1 c2)))

(defn meshify [id]
  (let [peer-ids (filter (complement #{id :parent}) (keys @s/peers))]
    (when (seq peer-ids)
      (->> peer-ids
           (mapv (partial pair-ids id))))))

(defn local-spawn [{:as data :keys [deamon?]}]
  (assert (or (and (e/in-root?) (not (u/in-safari?)) (not (= (:id data) :sw)))
              (e/in-screen?)))
  (let [id (root-spawn data)]
    (when-not (= id :sw)
      (when deamon? (meshify id)))
    id))

(defmethod m/dispatch :spawn
  [{:keys [data]}]
  (if-not (or (e/in-screen?) (and (not (u/in-safari?)) (e/in-root?)))
    (throw (js/Error. "Can't spawn locally if not on root or screen"))
    (local-spawn data)))

(defn send-spawn [id data]
  (m/post id
          {:dispatch :spawn
           :data data}))

(defn ^:export do-spawn [eargs {:as data :keys [caller id yield?]} efn]
  (let [{:as data :keys [id]}
        (merge data
               {:from (:id e/data) :to :root}
               (if (and (not id) efn)
                 (if yield?
                   (let [in-id (u/gen-id data)]
                     {:id in-id :in-id in-id})
                   {:id (u/gen-id data)})
                 {:deamon? true
                  :id (or id (u/gen-id data))})
               (when-not caller {:caller (:id e/data)})
               (when efn {:efn (str efn) :eargs eargs}))]
    (if (or (u/in-safari?) (= :sw id))
      (if (e/in-screen?)
        (local-spawn data)
        (send-spawn :screen data))
      (if (e/in-root?)
        (local-spawn data)
        (if (and (e/in-screen?) (or (= id :core) (= id :root)))
          (local-spawn data)
          (send-spawn :root data))))
    (sync/wrap-derefable data)))
