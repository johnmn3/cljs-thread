(ns cljs-thread.core
  (:refer-clojure :exclude [atom])
  (:require-macros [cljs-thread.core :refer [spawn in on-when]])
  (:require
   [cljs-thread.util :as u]
   [cljs-thread.env :as e]
   [cljs-thread.state :as s]
   [cljs-thread.platform :as p]
   [cljs-thread.spawn :as sp]
   [cljs-thread.on-when]
   [cljs-thread.in]
   [cljs-thread.db]
   [cljs-thread.msg :as m]
   [cljs-thread.sync]
   [cljs-thread.repl]
   ;; eve must load before future - auto-init! binds AtomDomain needed for pool atom
   [cljs-thread.eve :as eve]
   [eve.shared-atom :as a]
   [cljs-thread.future :as f]
   [cljs-thread.injest :as i]
   [cljs-thread.pmap]
   [cljs-thread.strategy.fat-kernel :as fat-kernel]
   ;; DOM proxy — always included so workers get transparent DOM access
   [cljs-thread.dom.install]))

(enable-console-print!)

;; Ensure eve slab allocator is initialized on this thread.
;; Idempotent — safe to call even though eve.cljs auto-inits at load time.
(eve/init!)

(def sleep cljs-thread.sync/sleep)

(def atom
  "Create a shared atom backed by SharedArrayBuffer. Works across all workers.
   Usage: (t/atom {:key \"value\"})
   The returned atom supports @, swap!, reset!, add-watch, remove-watch."
  eve/atom)

(def ^:export id (:id e/data))


;; Idempotency guard — prevents double-init when auto-init and
;; cljs_thread.main() race (the synchronous call always wins).
(defonce ^:private initialized? (cljs.core/atom false))

;; Set true once :core is in s/peers. Used to dispatch a main-fn
;; that arrives after workers are already up (late cljs_thread.main call).
(defonce ^:private core-ready? (cljs.core/atom false))

;; Screen-side storage for main-fn (can't serialize functions to workers)
(defonce ^:private pending-main-fn (cljs.core/atom nil))

(defn- spawn-workers!
  "Spawn all workers from screen.
   :core and :db launch first so they start booting immediately.
   Phase 1: spawn 2 future + 2 injest workers.
   Phase 2: spawn remaining pool workers."
  [config-with-ids]
  (let [future-ids (:future-ids config-with-ids)
        injest-ids (:injest-ids config-with-ids)]

    ;; 1. Initialize future pool with ALL ids (pool needs the full set).
    (f/init-pool! future-ids)

    ;; 2. Spawn :core immediately — pool workers will arrive while it boots.
    (spawn {:id :core :no-globals? true :screen-spawn true}
           (s/update-conf! config-with-ids))

    ;; 3. Dispatch main-fn to :core.
    ;;    when-peer-ready in msg/post queues until :core registers.
    (when-let [mf @pending-main-fn]
      (reset! pending-main-fn nil)
      (in :core (mf)))

    ;; 4. Spawn :db and pair with :core when both ready.
    (spawn {:id :db :no-globals? true :screen-spawn true}
           (s/update-conf! config-with-ids))
    (on-when (and (contains? @s/peers :core) (contains? @s/peers :db))
      {:max-time 30000}
      (m/pair-ids :core :db)
      (reset! core-ready? true))

    ;; 5. Phase 1 — spawn first 2 of each pool.
    (f/spawn-future-workers-phase-1 future-ids config-with-ids)
    (i/spawn-injest-workers-phase-1 injest-ids config-with-ids)

    ;; 6. Phase 2 — spawn remaining pool workers.
    (f/spawn-future-workers-phase-2 future-ids config-with-ids)
    (i/spawn-injest-workers-phase-2 injest-ids config-with-ids)))

(defn- do-init!
  "Internal init logic. Idempotent — skips if already initialized."
  [config-map]
  (if @initialized?
    (u/boot-log "screen" "do-init! skipped (already initialized)")
    (do
      (reset! initialized? true)
      (u/boot-log "screen" "do-init! ENTER")
      (assert (e/in-screen?))
      (when config-map
        (swap! s/conf merge config-map))
      ;; Propagate force-sw-sync! to workers via conf so they also use SW sync
      (when (p/force-sw-sync-requested?)
        (swap! s/conf assoc :force-sw-sync true))
      ;; Auto-detect core-connect-string if not provided
      (when-not (:core-connect-string @s/conf)
        (when-let [detected (fat-kernel/detect-core-connect-string)]
          (swap! s/conf assoc :core-connect-string detected)))
      ;; Auto-install fat-kernel when SAB is available, no SW configured,
      ;; and no strategy has been manually installed.
      (when (and p/sab-sync?
                 (not (:sw-connect-string @s/conf))
                 (not @p/create-worker-override))
        (fat-kernel/install!))
      ;; Auto-propagate global atom SABs to workers.
      ;; If user code has loaded cljs-thread.eve.shared-atom (which auto-creates
      ;; *global-atom-instance* on the main thread), extract its SABs so the fat
      ;; kernel can propagate them to all spawned workers automatically.
      (when (and (nil? (:sab @s/eve-sab-config)) a/*global-atom-instance*)
        (swap! s/eve-sab-config merge (a/sab-transfer-data a/*global-atom-instance*)))
      (let [config @s/conf
            ;; Generate worker IDs for pools
            future-ids (f/mk-worker-ids (:future-count config))
            injest-ids (i/mk-injest-ids (:injest-count config))
            ;; Augment config with worker IDs
            config-with-ids (assoc config
                                   :future-ids future-ids
                                   :injest-ids injest-ids)]
        (u/boot-log "screen" (str "spawning workers, node?=" p/node? " sab-sync?=" p/sab-sync?))
        (u/boot-log "screen" (str "future-ids: " (vec future-ids) " injest-ids: " (vec injest-ids)))

        ;; Screen spawns everything directly — no root middleman.
        (if p/node?
          ;; Node.js: main thread is both screen and coordinator.
          (sp/spawn-sw #(spawn-workers! config-with-ids))
          ;; Browser
          (if-not (or (:sw-connect-string config) p/sab-sync?)
            ;; No sync mechanism — basic spawn only (no blocking support)
            (spawn-workers! config-with-ids)
            ;; Full spawn with coordinator (SW or SAB)
            (do
              (sp/spawn-sw #(spawn-workers! config-with-ids))
              (when (and (not p/sab-sync?) (not (u/in-safari?)))
                (sp/on-sw-registration-reload)))))
        (u/boot-log "screen" "do-init! EXIT")))))

(defn- dispatch-main-fn!
  "If a main-fn is pending, dispatch it to :core now.
   Uses when-peer-ready to queue until :core is available.
   Handles the case where cljs_thread.main(fn) is called after
   auto-init has already spawned workers."
  []
  (when @pending-main-fn
    (let [mf @pending-main-fn]
      (reset! pending-main-fn nil)
      (in :core (mf)))))

(defn ^:export init!
  "Initialize cljs-thread. Idempotent — safe to call multiple times.

   (init!)                                      ;; Auto-detect everything
   (init! main-fn)                              ;; DOM proxy app: dispatch main to :core worker
   (init! {:core-connect-string \"/core.js\"})   ;; Explicit config
   (init! main-fn {:future-count 4})            ;; Main fn + config

   When a main function is provided, it's stored on screen and dispatched
   to :core via when-peer-ready (queued until :core registers).
   If workers are already up (auto-init ran first), dispatches immediately."
  ([]
   (when (e/in-screen?)
     (do-init! nil)))
  ([main-or-config]
   (if (fn? main-or-config)
     ;; Function arg → main fn, store on screen
     (do (reset! pending-main-fn main-or-config)
         (if @initialized?
           ;; Auto-init already ran — dispatch immediately (queues via when-peer-ready)
           (dispatch-main-fn!)
           (do-init! {:has-main-fn? true})))
     ;; Map arg → config only, no main
     (when (e/in-screen?)
       (do-init! main-or-config))))
  ([main-fn config-map]
   (reset! pending-main-fn main-fn)
   (let [config (if (map? config-map)
                  config-map
                  (js->clj config-map :keywordize-keys true))]
     (if @initialized?
       (dispatch-main-fn!)
       (do-init! (assoc config :has-main-fn? true))))))

;; Handler for :in-result from workers (Node.js screen Promise resolution)
;; Workers post results back to screen when caller is :screen on Node.js.
(defmethod m/dispatch :in-result
  [{:keys [data]}]
  (let [{:keys [in-id result]} data]
    (when-let [{:keys [resolve]} (get @s/requests in-id)]
      (swap! s/requests dissoc in-id)
      (resolve result))))

;; Export init! as cljs_thread.main so HTML can call:
;;   <script>cljs_thread.main(my_app.core.main)</script>
(goog/exportSymbol "cljs_thread.main" init!)

;; ephemeral spawns
(when (and (not (e/in-sw?)) (not (e/in-screen?)))
  (def e-fn (:efn e/data))
  (def e-args (:eargs e/data))
  (def sargs (->> e-args (mapv #(if (fn? %) (str "#cljs-thread/arg-fn " %) %))))
  (let [call-result
        (when e-fn (cljs-thread.in/do-call
                    {:data {:sfn e-fn
                            :sargs sargs
                            :in-id (:in-id e/data)
                            :opts {:request-id (:id e/data) :atom? true
                                   :yield? (:yield? e/data) :go? (:go? e/data)}}}))]
    (cond
      ;; go? spawn — close after the Promise chain resolves
      (and (:go? e/data) (instance? js/Promise call-result)
           (not (:deamon? e/data)))
      (.then call-result (fn [_] (p/close-self!)))

      ;; Non-go, non-yield, non-daemon — close immediately
      (and (not (:yield? e/data)) (not (:go? e/data)) (not (:deamon? e/data)))
      (p/close-self!)))
  :end)

;; ---------------------------------------------------------------------------
;; Cross-thread watch notification (message-based fallback)
;;
;; When Atomics.waitAsync is unavailable (older browsers), SharedAtom
;; swap! broadcasts a lightweight :watch-signal message to all connected
;; peers. Each peer checks its local watches and fires callbacks if the
;; SAB value has changed.
;; ---------------------------------------------------------------------------

(defmethod m/dispatch :watch-signal
  [_data]
  (eve/check-remote-watches!))

;; Register the broadcast function as a fallback for environments without
;; Atomics.waitAsync. The primary Atomics.notify path is always active;
;; this message path only fires when waitAsync is unavailable.
;; Only register on the screen thread — workers receive the messages, not send.
(when (e/in-screen?)
  (eve/set-broadcast-swap-fn!
    (fn [_header-descriptor-idx]
      (doseq [[id _peer] @s/peers]
        (when (and (keyword? id)
                   (not= id :parent)
                   (not= id :screen))
          (try
            (in id (eve/check-remote-watches!))
            (catch :default _e nil)))))))

;; ---------------------------------------------------------------------------
;; Auto-initialize on screen thread.
;;
;; Uses setTimeout(0) so that a synchronous cljs_thread.main(fn, config)
;; call from an HTML <script> tag (or Node.js main()) can run first.
;; The synchronous call pre-empts this by setting initialized? = true;
;; the deferred callback sees that and becomes a no-op.
;;
;; If nobody calls cljs_thread.main() or init! explicitly, the deferred
;; auto-init spawns workers with auto-detected defaults (manifest.edn
;; in browser, __filename in Node.js).
;; ---------------------------------------------------------------------------
(when (e/in-screen?)
  (js/setTimeout #(init!) 0))
