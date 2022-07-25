(ns dashboard.core
  (:require
   [re-frame.core :as rf :refer [dispatch dispatch-sync]]
   [inmesh.re-frame :refer [dispatch]]
   [dashboard.regs.db]
   [dashboard.regs.home-panel]
   [dashboard.regs.shell]
   [dashboard.regs.sign-in]
   [inmesh.state :as state]
   [inmesh.env :as env]
   [inmesh.state :as s]
   [inmesh.msg :as msg]
   [inmesh.id :refer [IDable get-id]]
   [inmesh.core :as mesh :refer [future spawn in wait =>> on-when]]))

(enable-console-print!)

(defn init! []
  (when (env/in-core?)
    (rf/dispatch-sync [:initialize-db]))
  (rf/clear-subscription-cache!))

(defn flip [n]
  (apply comp (take n (cycle [inc dec]))))

(when (env/in-core?)
 ;(on-when @s/ready?
  (future 

    (->> @s/peers
         keys
         (filter (complement #{:sw}))
         (mapv #(in % (println mesh/id :here))))

    (->> @s/peers
         keys
         (filter (complement #{:sw}))
         (mapv #(in % (str mesh/id :here)))
         (map deref)
         (println :rollcall))

    (print '(=>> (range) (map (flip 10)) (map (flip 10)) (map (flip 10)) (take 10)) \newline
           (=>> (range)
                (map (flip 10))
                (map (flip 10))
                (map (flip 10))
                (take 10)))

    (print '-> 'large-computation \newline
           (->> (range)
                (map (flip 100))
                (map (flip 100))
                (map (flip 100))
                (take 1000000)
                (apply +)
                time))

    (print '=>> 'large-computation \newline 
           (=>> (range)
                (map (flip 100))
                (map (flip 100))
                (map (flip 100))
                (take 1000000)
                (apply +)
                time))))

(comment

  (println :future '(+ 1 2)
           @(future (+ 1 2)))

  (println :future '(let [x 1] (+ x 2))
           @(future (let [x 1] (+ x 2))))

  (let [x @(future (+ 1 2))
        y @(future (+ x 3))
        z @(future (+ x y))]
    (println :let-local-futures (+ x y z)))

  (pr (deref (in :core (+ 1 2 3))))
  (println :res @(in :injest (println :hi) 1))

  (println :res @(in :db (println :hi) 2))
  (println :res (wait :db (println :hi) (yield 2)))
  (println :res (wait :core (println :hi) (yield 2)))
  (println :peers (keys @s/peers))
  (println :peers (select-keys @s/peers [:sw]))
  (println :res (in :sw (println :responses @s/responses)))
  (in :db (println :peers (keys @s/peers)))
  (in :sw (println :peers (keys @s/peers)))
  (in :sw (println :hi))
  (in :root (in :sw (println :hi)))
  (in :core (println :hi))
  (in :root (println :peers (keys @s/peers)))
  (in :screen (println :peers (keys @s/peers)))
  (in :core (println :peers (keys @s/peers)))

  (in :here (println :afn (pr-str (str "(" (str (fn [] :hi)) ")"))))

  :end)
  


;; (println :in mesh/id :conf @inmesh.state/conf)

;; (println :hi if)

;; (comment

  
;;   (def db (spawn {:id :db1}))
;;   (println :db db)
;;   (println :in mesh/id :peers (keys @state/peers))
;;   (in db (println :in mesh/id :peers (keys @state/peers)))
;;   (println :res @(future (println :in-future) 2))
;;   (println :=>> (=>> [1 2 3]
;;                      (map inc)
;;                      (map dec)
;;                      (map inc)))
;;   (in :core (println :in :core))
;;   (in :core
;;       (println :=>> (=>> [1 2 3]
;;                          (map inc)
;;                          (map dec)
;;                          (map inc))))
;;   (println :res (wait :core (println :in-core) (+ 1 2)))


;;   :end)
  
