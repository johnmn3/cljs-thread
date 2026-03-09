(ns cljs-thread.injest
  (:require-macros
   [cljs-thread.injest])
  (:require
   [cljs-thread.util :as u]
   [cljs-thread.state :as s]
   [cljs-thread.spawn :refer [spawn]]
   ;; The =>> macro expands to code that references injest.impl/xfn and
   ;; injest.path/x>>. These runtime requires ensure those namespaces are
   ;; loaded on all threads (including workers), not just at compile time.
   [injest.impl]
   [injest.path]))

(defn mk-injest-ids [& [n]]
  (let [ws (or n (inc (u/num-cores)))]
    (->> ws range (map #(keyword (str "injest-" %))))))

(defn spawn-injest-workers-phase-1
  "Spawn the first 2 injest-* workers."
  [injest-ids config]
  (doseq [wid (take 2 injest-ids)]
    (spawn {:id wid :screen-spawn true}
           (s/update-conf! config))))

(defn spawn-injest-workers-phase-2
  "Spawn remaining injest-* workers (all except the first 2)."
  [injest-ids config]
  (doseq [wid (drop 2 injest-ids)]
    (spawn {:id wid :screen-spawn true}
           (s/update-conf! config))))

(defn start-injests
  "Legacy entry point - now just logs deprecation. Injest workers spawned from screen."
  [configs]
  (u/boot-log "root" "start-injests called (no-op, workers spawned from screen)")
  (:injest-ids configs))

;; Anchor common core predicates in the shared module so Closure doesn't
;; move them to screen.js via cross-module code motion.  Functions referenced
;; only from screen-side code get local names (e.g. lJ) that are unavailable
;; when eval'd on workers.  Exporting these refs forces $APP.xxx names.
(def ^:export core-preds
  {:odd? odd? :even? even? :zero? zero? :pos? pos? :neg? neg?
   :number? number? :string? string? :keyword? keyword?
   :int? int? :nil? nil?})

;; Anchor arithmetic operators and other core fns commonly used in
;; higher-order position (e.g. (reduce + ...), (map inc ...)).
;; Without this, wrapping these as value-position refs causes Closure
;; to create screen-module-local wrapper fns that aren't available on workers.
(def ^:export core-ops
  {:+ + :- - :* * :/ /
   :inc inc :dec dec
   :identity identity :str str
   :comp comp :partial partial :juxt juxt :complement complement
   :first first :second second :last last
   :count count :not not
   :max max :min min
   :seq seq :vec vec :set set :vals vals :keys keys
   :name name :keyword keyword :symbol symbol
   :deref deref :pr-str pr-str})

(defn ^:export compose-xf [xfs]
  (->> xfs
       (map #(if-not (coll? %)
               %
               (if (= 1 (count %))
                 (first %)
                 (apply (first %) (rest %)))))
       (apply comp)))
