(ns cljs-thread.state
  (:require
   [cljs-thread.env :as e]
   [cljs-thread.platform :as p]))

(defn shake
  [atm & {:keys [seconds msg limit effect]
          :or {seconds 30}}]
  (let [time-ms (* seconds 1000)
        limit-atom (atom limit)
        inter-atom (atom nil)
        action #(do (when msg (println (if (fn? msg)
                                         (msg)
                                         msg)))
                    (swap! atm identity)
                    (when limit
                      (if (< 1 @limit-atom)
                        (swap! limit-atom dec)
                        (js/clearInterval @inter-atom))))
        inter-id (-> action (js/setInterval time-ms))]
    (swap! inter-atom (constantly inter-id))))

(def initial-conf (merge {} (:conf e/data)))

;; If the screen thread called force-sw-sync!, propagate to this worker
;; so both sides agree on the sync mechanism (SW XHR, not Atomics).
(when (:force-sw-sync initial-conf)
  (set! p/sab-sync? false))

(def conf (atom initial-conf))

(defn ^:export update-conf! [conf-map]
  (let [conf-map (if (object? conf-map)
                   (js->clj conf-map :keywordize-keys true)
                   conf-map)]
    (swap! conf merge conf-map)))

(def peers (atom {}))

(shake peers :seconds 1 :limit 30)

(shake peers :seconds 30)

(def local-val (atom nil))

(when-not (e/in-screen?)
  (let [self (p/self-ref)]
    ;; All workers are spawned by screen — parent IS screen.
    (swap! peers assoc :parent {:id :parent :w self :port self})
    (swap! peers assoc :screen {:id :screen :w self :port self})))

(def responses
  (atom {}))

(def requests
  (atom {}))

(def future-pool (atom {:available #{} :in-use #{}}))

(def idb (atom nil))

;; Eve AtomDomain SAB config: {:sab SharedArrayBuffer, :reader-map-sab SharedArrayBuffer}
;; Set on main thread, propagated to workers via workerData.
(defonce eve-sab-config (atom nil))

;; True when executing inside an explicit work context (in, future, spawn body,
;; pmap, etc.). False during top-level module load. Used by do-spawn to prevent
;; spawn storms — non-authoritative workers only spawn named keyword workers
;; from explicit work contexts, not from top-level defs at module load time.
(def ^:dynamic *in-work* false)
