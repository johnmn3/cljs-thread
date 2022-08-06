(ns dashboard.core
  (:require
   [re-frame.core :as rf]
   [dashboard.regs.db]
   [dashboard.regs.home-panel]
   [dashboard.regs.shell]
   [dashboard.regs.sign-in]
   [inmesh.env :as env]
   [inmesh.state :as s]
   [inmesh.core :as mesh :refer [future spawn in =>> dbg break in?]]))

(enable-console-print!)

(defn init! []
  (when (env/in-core?)
    (rf/dispatch-sync [:initialize-db])
    (rf/clear-subscription-cache!)))

(defn flip [n]
  (apply comp (take n (cycle [inc inc dec]))))

;; uncomment for advanced compile tests
#_
(when (env/in-core?)
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

    #_
    (print '->> 'large-computation \newline
           (->> (range)
                (map (flip 100))
                (map (flip 100))
                (map (flip 100))
                (take 1000000)
                (apply +)
                time))

    #_
    (print '=>> 'large-computation \newline 
           (=>> (range)
                (map (flip 100))
                (map (flip 100))
                (map (flip 100))
                (take 1000000)
                (apply +)
                time))))

(comment
  (println :hi)

  (dbg
   (let [x 1 y 3 z 5]
     (println :starting)
     (dotimes [i z]
       (break (= i y))
       (println :i i))
     (println :done)
     4))
  ;:starting
  ;:i 0
  ;:i 1
  ;:i 2
  ;=> :starting-dbg

  (in? [x i] (+ x i))
  ;=> 4
  (in? z)
  ;=> 5
  (in? i)
  ;=> 3
  (in? [i x y z])
  ;=> [3 1 3 5]
  (in? [z y x])
  ;=> [5 3 1]
  (in? a)
  ;=> nil
  (in? :in/exit)
  ;:i 3
  ;:i 4
  ;:done
  ;=> 4

  (def s1 (spawn))

  (spawn (println :addition (+ 1 2 3)))

  (def s2 (spawn {:id :s2} (println :hi :from mesh/id)))

  (println :ephemeral :result @(spawn (+ 1 2 3)))

  (in :screen
      (-> @(spawn (println :working) (+ 1 2 3))
          (.then #(println :ephemeral :result %))))

  (-> (js/Promise.all #js [(spawn {:promise? true} 1)
                           (spawn {:promise? true} 2)])
      (.then #(println :res (js->clj %))))

  (in s1 (println :hi :from :s1))

  (in s1
      (println ":now :we're :in :s1")
      (in s2
          (println ":now :we're :in :s2 :through :s1")))

  @(in s1 (+ 1 @(in s2 (+ 2 3))))

  (let [x 3]
    @(in s1 (+ 1 @(in s2 (+ 2 x)))))

  (def x 3)
  @(in s1 (+ 1 @(in s2 (+ 2 x))))

  (def x 3)
  @(in s1 (+ 1 @(in s2 (+ 2 x))))

  @(in s1 [x s2] (+ 1 @(in s2 (+ 2 x))))

  (let [y 3]
    @(in s1 (+ 1 @(in s2 (+ x y)))))

  (let [y 3]
    @(in s1 [x y s2] (+ 1 @(in s2 (+ x y)))))

  (let [x 6]
    @(spawn (yield (+ x 2)) (println :i'm :ephemeral :in mesh/id)))

  @(spawn (+ 1 @(spawn (+ 2 3))))

  (->> @(in s1 (-> (js/fetch "http://api.open-notify.org/iss-now.json")
                   (.then #(.json %))
                   (.then #(yield (js->clj % :keywordize-keys true)))))
       :iss_position
       (println "ISS Position:"))

  @(spawn (js/setTimeout
           #(yield (println :finally!) (+ 1 2 3))
           5000))

  @(in :screen
       (-> @(spawn (js/setTimeout
                    #(yield (println :finally!) (+ 1 2 3))
                    5000))
           (.then #(yield %))))

  @(future (+ 1 @(future (+ 2 3))))

  (in :screen
      (-> @(future (-> (js/fetch "http://api.open-notify.org/iss-now.json")
                       (.then #(.json %))
                       (.then #(yield (js->clj % :keywordize-keys true)))))
          (.then #(println "ISS Position:" (:iss_position %)))))

  (=>> (range 10000)
       (map inc)
       (filter odd?)
       (map (flip 1000))
       (mapcat #(do [% (dec %)]))
       (partition-by #(= 0 (mod % 5)))
       (map (partial apply +))
       (map (partial + 10))
       (map (flip 1000))
       (map #(do {:temp-value %}))
       (map :temp-value)
       (map (flip 1000))
       (filter even?)
       (apply +)
       time)

  (->> (range 10000)
       (map (flip 10000))
       (apply +)
       time)

  (=>> (range 10000)
       (map (flip 10000))
       (apply +)
       time)

  (=>> (range 1000)
       (map inc)
       (filter odd?)
       (map (flip 100000))
       (mapcat #(do [% (dec %)]))
       (partition-by #(= 0 (mod % 5)))
       (map (partial apply +))
       (map (partial + 10))
       (map (flip 100000))
       (map #(do {:temp-value %}))
       (map :temp-value)
       (map (flip 100000))
       (filter even?)
       (apply +)
       time)

  (time @(spawn (+ 1 @(spawn (+ 2 3)))))

  (let [x 2]
    @(future (+ 1 @(future (+ x 3)))))

  (time @(future (+ 1 @(future (+ 2 3)))))

  (time @(future (+ 2 3)))

  (time @(in :core (+ 2 3)))

  :end)
