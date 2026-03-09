(ns cljs-thread.future
  (:require-macros [cljs-thread.future])
  (:require
   [cljs-thread.eve :as e]
   [cljs-thread.spawn :refer [spawn]]
   [cljs-thread.state :as s]
   [cljs-thread.util :as u]))

;; Top-level eve atom pool - shared across all workers via SAB
(defonce pool (e/atom ::future-pool {:waiting #{} :busy #{} :tasks []}))

(defn ^:export take-worker! []
  (let [claimed (atom nil)]
    (swap! pool
      (fn [{:keys [waiting busy tasks]}]
        (if-let [w (first waiting)]
          (do (reset! claimed w)
              {:waiting (disj waiting w) :busy (conj busy w) :tasks tasks})
          {:waiting waiting :busy busy :tasks tasks})))
    @claimed))

(defn ^:export put-back-worker! [worker]
  (swap! pool
    (fn [{:keys [waiting busy tasks]}]
      {:waiting (conj waiting worker)
       :busy (disj busy worker)
       :tasks tasks}))
  nil)

(defn ^:export queue-task! [task-fn]
  (swap! pool update :tasks conj task-fn))

(defn ^:export take-task!
  "Worker claims a task by removing it from queue. Returns task-fn or nil."
  [worker-id]
  (let [claimed (atom nil)]
    (swap! pool
      (fn [{:keys [waiting busy tasks]}]
        (if-let [task (first tasks)]
          (do (reset! claimed task)
              {:waiting waiting :busy busy :tasks (vec (rest tasks))})
          {:waiting waiting :busy busy :tasks tasks})))
    @claimed))

(defn mk-worker-ids [n]
  (let [ws (or n (inc (u/num-cores)))]
    (->> ws range (map #(keyword (str "fp-" %))))))

(defn ^:export init-pool! [worker-ids]
  (u/boot-log "pool" (str "init-pool! " (vec worker-ids)))
  (swap! pool assoc :waiting (set worker-ids)))

(defn spawn-future-workers-phase-1
  "Spawn :future coordinator and the first 2 fp-* workers.
   Pool should already be initialized via init-pool! before calling this."
  [worker-ids config]
  (let [future-conf (assoc config :future-ids worker-ids)
        phase-1-ids (take 2 worker-ids)]
    (spawn {:id :future :no-globals? true :screen-spawn true}
           (s/update-conf! future-conf))
    (doseq [wid phase-1-ids]
      (spawn {:id wid :no-globals? true :screen-spawn true}
             (s/update-conf! future-conf)))))

(defn spawn-future-workers-phase-2
  "Spawn remaining fp-* workers (all except the first 2)."
  [worker-ids config]
  (let [future-conf (assoc config :future-ids worker-ids)
        phase-2-ids (drop 2 worker-ids)]
    (doseq [wid phase-2-ids]
      (spawn {:id wid :no-globals? true :screen-spawn true}
             (s/update-conf! future-conf)))))

(defn start-futures
  "No-op - pool and workers now initialized from screen thread.
   Kept for backwards compatibility."
  [configs]
  (u/boot-log "root" "start-futures (no-op, pool initialized from screen)")
  (:future-ids configs))
