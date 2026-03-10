(ns cljs-thread.msg
  (:require
   [cljs-thread.state :as s]
   [cljs-thread.env :as e]
   [cljs-thread.platform :as p]
   [cljs-thread.id :refer [IDable get-id]]
   [cljs-thread.sync :as sync]
   [cljs-thread.eve :as eve]
   [clojure.edn :as edn]))

(declare debug-log!)

(def event-message "message")

(defmulti dispatch :dispatch)

(defn read-id [id]
  (if (.startsWith id ":")
    (edn/read-string id)
    (str id)))

(defn message-handler [^js e]
  (let [raw (if p/node? e (.-data e))]
    ;; Debug logging disabled
    #_(when (and p/node? (exists? js/process))
        (when-let [msg (.-msg raw)]
          (when (string? msg)
            (.writeSync (js/require "fs") 2
                        (str "[msg-handler] env:" (:id e/data)
                             " dispatch:" (re-find #":dispatch [^ ,}]+" msg)
                             "\n")))))
    ;; In Node, sync-protocol messages (register-sync, send-sync-response, etc.)
    ;; arrive on the same handler. Ignore anything without a .msg property.
    (when-let [data (.-msg raw)]
      (let [receive-port? (-> ^js data .-dispatch (= "receive-port"))
            ;; sargs passed separately - now a pr-str'd string (preserves CLJS types)
            raw-sargs (unchecked-get raw "sargs")
            ;; transfers passed separately for actual transferable objects
            raw-transfers (unchecked-get raw "transfers")
            ;; sync-signal-sab passed separately - SABs can't be stringified
            sync-signal-sab (unchecked-get raw "syncSignalSab")
            data (if receive-port?
                   (-> data (js->clj :keywordize-keys true)
                       (update :dispatch keyword)
                       (update-in [:data :id] read-id))
                   (-> data edn/read-string))
            ;; Merge sargs, transfers, and sync-signal-sab back into data
            ;; sargs is now a string (pr-str'd), pass through as-is
            data (cond-> data
                   raw-sargs (assoc-in [:data :sargs] raw-sargs)
                   raw-transfers (assoc-in [:data :transfers] raw-transfers)
                   sync-signal-sab (assoc-in [:data :sync-signal-sab] sync-signal-sab))]
        (dispatch data)))))

;; Register the message handler on the current thread's self-ref.
;; In browser: addEventListener on js/self or js/window.
;; In Node: .on('message') on parentPort (for workers) or no-op for main.
(let [target (if (e/in-screen?)
               (when-not p/node? (p/self-ref))
               (p/self-ref))]
  (when target
    (p/listen target message-handler)))

(defn do-pprint [s]
  (println (pr-str s)))

(defmethod dispatch :pprint
  [{:keys [data]}]
  (do-pprint data))

(defmethod dispatch :receive-port
  [{{:keys [id port sync-channel-sab sync-channel-atom-id sync-channel-atom-idx]} :data}]
  (swap! s/peers assoc-in [id :port] port)
  ;; Reconstruct sync-channel from SAB + atom identity if provided
  (when sync-channel-sab
    (let [response-atom (eve/reconstruct-shared-atom sync-channel-atom-id sync-channel-atom-idx)
          sync-channel {:signal-sab sync-channel-sab
                        :response-atom response-atom}]
      (swap! s/peers assoc-in [id :sync-channel] sync-channel)))
  (if p/node?
    (p/listen port message-handler)
    (set! (.-onmessage port) message-handler)))

(defn when-peer-ready [id afn & [watch-key]]
  (let [watch-key (or watch-key (str id "-" (hash afn) "-" (gensym)))]
    (debug-log! (str "[when-peer-ready] env:" (:id e/data) " id:" (pr-str id) " present:" (boolean (get @s/peers id))))
    (if (get @s/peers id)
      (do
        (debug-log! (str "[when-peer-ready] executing for " (pr-str id)))
        (afn))
      (add-watch
       s/peers
       watch-key
       #(do (remove-watch s/peers watch-key)
            (when-peer-ready id afn watch-key))))))

(defn- do-post-message [w data transfers transferables]
  (let [;; Extract sargs - they may contain JS object markers that shouldn't be stringified
        sargs (get-in data [:data :sargs])
        ;; Extract sync-signal-sab - SABs can't be stringified
        ;; May be at [:data :sync-signal-sab] or at top level [:sync-signal-sab] (for proxy messages)
        sync-signal-sab (or (get-in data [:data :sync-signal-sab])
                            (:sync-signal-sab data))
        ;; Also extract sync-channel - eve atoms can't be stringified
        sync-channel (get-in data [:data :sync-channel])
        ;; Remove sargs, sync-signal-sab, and sync-channel from data before stringifying
        ;; Also remove from top level for proxy messages
        data-without-extras (cond-> data
                              sargs (update :data dissoc :sargs)
                              (get-in data [:data :sync-signal-sab]) (update :data dissoc :sync-signal-sab)
                              (:sync-signal-sab data) (dissoc :sync-signal-sab)
                              sync-channel (update :data dissoc :sync-channel))
        ;; Convert transfers to JS so they survive postMessage structured cloning
        ;; CLJS maps lose their prototype through postMessage and become non-ISeqable
        transfers-js (when transfers (clj->js transfers))
        msg (if (-> data :dispatch (= :receive-port))
              #js {:transfers transfers-js :msg (clj->js data)}
              #js {:transfers transfers-js
                   :msg (str data-without-extras)
                   ;; Pass sargs as JS array - survives structured cloning with JS markers intact
                   :sargs (when sargs (clj->js sargs))
                   ;; Pass sync-signal-sab directly - SAB transfers via structured cloning
                   :syncSignalSab sync-signal-sab})
        xfers (if transferables (clj->js transferables) #js [])]
    (p/post-message w msg xfers)))

(defn ^:export post [worker-id {:as data {:keys [transfers]} :data} & [transferables]]
  (debug-log! (str "[post] env:" (:id e/data) " worker-id:" (pr-str worker-id) " dispatch:" (:dispatch data)))
  (let [transfers (if (and transfers (object? transfers))
                    (js->clj transfers :keywordize-keys true)
                    transfers)
        transferables (->> transfers
                           (keep (fn [[_k {:keys [transfer]}]] transfer))
                           vec)
        id (if (and (not (keyword? worker-id))
                    (satisfies? IDable worker-id))
             (get-id worker-id)
             worker-id)
        data (assoc data :from (:id e/data))]
    (debug-log! (str "[post] id:" (pr-str id) " peers:" (pr-str (keys @s/peers))))
    (if (= :here id)
      (dispatch data)
      (let [w (or (-> @s/peers (get-in [id :port]))
                  (-> @s/peers (get-in [id :w])))]
        (debug-log! (str "[post] w:" (if w "found" "nil") " id:" (pr-str id)))
        (try
          (cond
            ;; No direct worker ref — proxy through screen or wait for peer.
            (not w)
            (if (and (not (e/in-screen?))      ;; screen can't proxy to itself
                     (not= id :screen)          ;; already have screen
                     (not= id :parent)          ;; already have parent
                     (get @s/peers :screen))    ;; screen peer must exist
              ;; Proxy through screen — it has direct Worker refs to all children.
              ;; The response comes back via SAB (shared memory), not through screen.
              (post :screen
                    (-> data
                        (assoc-in [:data :proxy-target] id)
                        (assoc-in [:data :original-dispatch] (:dispatch data))
                        (assoc :dispatch :proxy-call))
                    transferables)
              ;; Can't proxy — fall back to when-peer-ready
              (when-peer-ready id
                #(let [w (or (-> @s/peers (get-in [id :port]))
                             (-> @s/peers (get-in [id :w])))]
                   (do-post-message w data transfers transferables))))

            ;; Have direct worker ref, post directly
            :else
            (when-peer-ready id
                             #(let [w (or (-> @s/peers (get-in [id :port]))
                                          (-> @s/peers (get-in [id :w])))]
                                (do-post-message w data transfers transferables))))
          (catch :default e
            (println :id (:id e/data))
            (println :e e)
            (println :w w)
            (println :worker-id worker-id)
            ;; Don't print data - it may contain SABs that can't be serialized
            (println :data-dispatch (:dispatch data))
            (when-peer-ready id
                             #(post worker-id data transferables))))))))

(defn- debug-log! [_msg]
  ;; Debug logging disabled
  #_(when (exists? js/process)
      (.writeSync (js/require "fs") 2 (str _msg "\n"))))

(defn mk-chan-pair []
  (p/mk-channel))

(defn send-port [id c1]
  ;; Create sync channel for this peer connection
  (let [sync-ch (sync/make-sync-channel)
        response-atom (:response-atom sync-ch)]
    (post id {:dispatch :receive-port
              :data {:port c1
                     :transfers {1 {:transfer c1}}
                     :id (str (:id e/data))
                     ;; Sync channel components - SAB transfers via structured cloning,
                     ;; atom identity used to reconstruct on receiver
                     :sync-channel-sab (:signal-sab sync-ch)
                     :sync-channel-atom-id (.-shared-atom-id ^js response-atom)
                     :sync-channel-atom-idx (.-header-descriptor-idx ^js response-atom)}})))

(defn dist-port [id1 id2 c1 c2]
  ;; Create sync channels for each direction
  ;; sync-ch-1: for id1 to call id2 (id1 waits, id2 writes)
  ;; sync-ch-2: for id2 to call id1 (id2 waits, id1 writes)
  (let [sync-ch-1 (sync/make-sync-channel)
        sync-ch-2 (sync/make-sync-channel)
        atom-1 (:response-atom sync-ch-1)
        atom-2 (:response-atom sync-ch-2)]
    ;; Send to id1: port to talk to id2 + sync-ch-1 for blocking calls to id2
    (post id1 {:dispatch :receive-port
               :data {:port c1
                      :transfers {1 {:transfer c1}}
                      :id (str id2)
                      :sync-channel-sab (:signal-sab sync-ch-1)
                      :sync-channel-atom-id (.-shared-atom-id ^js atom-1)
                      :sync-channel-atom-idx (.-header-descriptor-idx ^js atom-1)}})
    ;; Send to id2: port to talk to id1 + sync-ch-2 for blocking calls to id1
    (post id2 {:dispatch :receive-port
               :data {:port c2
                      :transfers {1 {:transfer c2}}
                      :id (str id1)
                      :sync-channel-sab (:signal-sab sync-ch-2)
                      :sync-channel-atom-id (.-shared-atom-id ^js atom-2)
                      :sync-channel-atom-idx (.-header-descriptor-idx ^js atom-2)}})))

(defn ^:export pair-ids [id1 id2]
  (let [[c1 c2] (mk-chan-pair)]
    (dist-port id1 id2 c1 c2)))

(defn add-port [id p]
  (swap! s/peers assoc-in [id :port] p)
  (if p/node?
    (p/listen p message-handler)
    (set! (.-onmessage p) message-handler)))
