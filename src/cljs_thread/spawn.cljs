(ns cljs-thread.spawn
  (:require-macros
   [cljs-thread.spawn])
  (:require
   [cljs-thread.util :as u]
   [cljs-thread.state :as s]
   [cljs-thread.env :as e]
   [cljs-thread.platform :as p]
   [cljs-thread.msg :as m]
   [cljs-thread.sync :as sync]
   [cljs-thread.in :as in]))

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
        worker-override (:worker-connect-string @s/conf core-override)
        future-override (:future-connect-string @s/conf worker-override)
        injest-override (:injest-connect-string @s/conf worker-override)
        repl-override (:repl-connect-string @s/conf core-override)]
    (cond
      (= :sw id) sw-override
      (= :repl id) repl-override
      (= :future id) future-override
      (= :injest id) injest-override
      (= :core id) core-override
      :else worker-override)))

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
        worker-data (merge {:id id :conf @s/conf}
                           ;; Include eve SAB config for Node.js workers
                           (when (and p/node? @s/eve-sab-config)
                             {:__eve_sab_config @s/eve-sab-config})
                           data)
        w (p/create-worker conn-str worker-data m/message-handler)]
    (when deamon?
      (u/boot-log "spawn" (str "registering peer " id))
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
  (let [id (root-spawn data)]
    (when-not (= id :sw)
      (when deamon?
        (if (or (e/in-screen?) (get @s/peers :screen))
          ;; Screen thread OR :screen already in peer table — meshify now.
          (meshify id)
          ;; :screen not yet in peer table — defer meshify until :screen arrives.
          (let [watch-key [::deferred-mesh id]]
            (add-watch s/peers watch-key
              (fn [k _ _ new-peers]
                (when (get new-peers :screen)
                  (remove-watch s/peers k)
                  (meshify id))))))))
    id))

;; Dedup set — avoid redundant pair-ids on rapid successive proxy calls
(defonce ^:private proxied-pairs (atom #{}))

(defmethod m/dispatch :proxy-call
  [{:keys [data] :as msg}]
  ;; Screen received a proxy request — forward to the actual target.
  ;; Response goes back via SAB (shared memory), not through screen.
  (let [target         (:proxy-target data)
        from           (:from data)
        orig-dispatch  (or (:original-dispatch data) :call)
        forwarded      (-> msg
                           (assoc :dispatch orig-dispatch)
                           (update :data dissoc :proxy-target :original-dispatch))]
    (m/post target forwarded)
    ;; Auto-meshify so future calls go direct.
    ;; pair-ids creates MessageChannel + sync-channels (signal-sab + response-atom)
    (when (and from target
               (not= from :screen) (not= target :screen))
      (let [pair #{from target}]
        (when-not (contains? @proxied-pairs pair)
          (swap! proxied-pairs conj pair)
          (pair-ids from target))))))

(defmethod m/dispatch :spawn
  [{:keys [data]}]
  ;; Any worker can handle spawn requests - no longer restricted
  (local-spawn data))

(defn send-spawn [id data]
  (m/post id
          {:dispatch :spawn
           :data data}))

(defn ^:export do-spawn [eargs {:as data :keys [caller id yield? go?]} efn]
  (let [worker-id (or id (u/gen-id data))
        spawn-data (merge data
                          {:from (:id e/data) :to :screen}
                          {:deamon? true :id worker-id}
                          (when-not caller {:caller (:id e/data)}))]
    (cond
      ;; Already exists locally (self-spawn or previously spawned) — routing ref.
      (or (= worker-id (:id e/data))
          (contains? @s/peers worker-id))
      (sync/wrap-derefable spawn-data)

      ;; On screen, only system spawns (flagged with :screen-spawn) can proceed.
      ;; App-level spawns like (def renderer (spawn ::renderer ...)) execute at
      ;; module load time before init! installs the fat kernel — they must be
      ;; deferred to a routing ref. System spawns from do-init! pass :screen-spawn.
      (and (e/in-screen?)
           (keyword? id)
           (not (:screen-spawn data)))
      (sync/wrap-derefable spawn-data)

      ;; Named keyword worker during top-level module load on a non-authority.
      ;; s/*in-work* is false (not inside in/future/spawn body), and this isn't
      ;; :core/Node — return a routing ref, don't actually spawn.
      (and (keyword? id)
           (not s/*in-work*)
           (not (e/in-screen?))
           (not (e/in-core?))
           (not p/node?))
      (sync/wrap-derefable spawn-data)

      ;; Authorized spawn — actually create the worker.
      :else
      (do
        (if (or (u/in-safari?) (= :sw worker-id))
          (if (e/in-screen?)
            (local-spawn spawn-data)
            (send-spawn :screen spawn-data))
          (local-spawn spawn-data))
        (if efn
          ;; Return do-in's derefable — it connects to s/requests and resolves
          ;; via :in-result. wrap-derefable's request path is a no-op when SAB
          ;; sync is active, so returning it would produce a never-resolving deref.
          (in/do-in worker-id eargs efn {:yield? yield? :go? go?})
          (sync/wrap-derefable spawn-data))))))
