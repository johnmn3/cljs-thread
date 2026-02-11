(ns cljs-thread.walkthrough-test-browser
  "Exercises all the API walkthrough examples to verify they work.
   From screen thread, blocking ops return promises — we chain with .then.
   Operations are dispatched directly from screen to match the REPL pattern."
  (:require
   [cljs-thread.core :as thread :refer [spawn in future pmap pcalls pvalues =>>]]
   [cljs-thread.strategy.fat-kernel :as fat-kernel]
   [cljs-thread.platform :as p]
   [cljs-thread.env :as e]
   [cljs-thread.state :as s]))

(enable-console-print!)

(def results (atom {:pass 0 :fail 0}))

(defn pass! [label result]
  (swap! results update :pass inc)
  (println (str "PASS | " label " => " (pr-str result))))

(defn fail! [label expected actual]
  (swap! results update :fail inc)
  (println (str "FAIL | " label " => " (pr-str actual) " (expected " (pr-str expected) ")")))

(defn check [label expected actual]
  (if (= expected actual)
    (pass! label actual)
    (fail! label expected actual)))

(defn flip [n]
  (apply comp (take n (cycle [inc inc dec]))))

(defn run-tests []
  (println "--- run-tests starting ---")
  ;; Chain promises to run tests sequentially.
  ;; All operations dispatch from screen thread (like a REPL session).
  (-> (js/Promise.resolve)

      ;; --- spawn ---
      (.then (fn [_]
               (println "\n--- spawn ---")
               @(spawn (+ 1 2 3))))
      (.then (fn [v] (check "spawn deref" 6 v)))

      (.then (fn [_]
               @(spawn (+ 1 @(spawn (+ 2 3))))))
      (.then (fn [v] (check "nested spawn" 6 v)))

      ;; --- in ---
      (.then (fn [_]
               (println "\n--- in ---")
               @(in :core (+ 10 20 12))))
      (.then (fn [v] (check "in :core basic" 42 v)))

      ;; --- binding conveyance ---
      (.then (fn [_]
               (println "\n--- Binding Conveyance ---")
               (let [x 10 y 32]
                 @(spawn (+ x y)))))
      (.then (fn [v] (check "let conveyance" 42 v)))

      ;; --- future ---
      (.then (fn [_]
               (println "\n--- future ---")
               @(future (+ 100 200))))
      (.then (fn [v] (check "future basic" 300 v)))

      (.then (fn [_]
               @(future (+ 1 @(future (+ 2 3))))))
      (.then (fn [v] (check "future nested" 6 v)))

      ;; --- pmap ---
      (.then (fn [_]
               (println "\n--- pmap ---")
               @(future (let [result (doall (pmap inc [1 2 3 4]))] result))))
      (.then (fn [v] (check "pmap basic" [2 3 4 5] (vec v))))

      ;; --- =>> ---
      (.then (fn [_]
               (println "\n--- =>> ---")
               @(=>> (range 10)
                     (map inc)
                     (filter odd?)
                     (apply +))))
      (.then (fn [v] (check "=>> basic" 25 v)))

      (.then (fn [_]
               @(=>> (range 10)
                     (map (comp inc dec))
                     (apply +))))
      (.then (fn [v] (check "=>> with comp" 45 v)))

      ;; --- string/collection/nil results ---
      (.then (fn [_]
               (println "\n--- Data types ---")
               @(in :core (str "hello " "world"))))
      (.then (fn [v] (check "string result" "hello world" v)))

      (.then (fn [_]
               @(in :core (mapv inc [1 2 3]))))
      (.then (fn [v] (check "collection result" [2 3 4] v)))

      (.then (fn [_]
               @(in :core nil)))
      (.then (fn [v] (check "nil result" nil v)))

      ;; --- timing ---
      (.then (fn [_]
               (println "\n--- Timing ---")
               (let [start (js/Date.now)]
                 (-> @(in :core (+ 2 3))
                     (.then (fn [v]
                              (let [elapsed (- (js/Date.now) start)]
                                (check "in :core timing" 5 v)
                                (println (str "PASS | in :core elapsed => " elapsed "ms")))))))))

      (.then (fn [_]
               (let [start (js/Date.now)]
                 (-> @(future (+ 2 3))
                     (.then (fn [v]
                              (let [elapsed (- (js/Date.now) start)]
                                (check "future timing" 5 v)
                                (println (str "PASS | future elapsed => " elapsed "ms")))))))))

      ;; --- summary ---
      (.then (fn [_]
               (let [{:keys [pass fail]} @results]
                 (println (str "\n=== WALKTHROUGH COMPLETE: " pass " passed, " fail " failed ===")))))
      (.catch (fn [e]
                (println (str "ERROR: " e))
                (println "=== WALKTHROUGH COMPLETE ===")))))

(defn init! []
  (when (e/in-screen?)
    (fat-kernel/install!)
    (thread/init! {:core-connect-string "/core.js"})

    (println "--- Environment ---")
    (println (str "PASS | SAB available => " (exists? js/SharedArrayBuffer)))
    (println (str "PASS | Platform => " (if p/node? "Node.js" "Browser")))
    (println (str "PASS | Fat kernel installed => " (some? @p/create-worker-override)))

    ;; Wait for workers to be ready before running tests
    (let [start (.getTime (js/Date.))
          check-ready
          (fn check-ready []
            (let [elapsed (- (.getTime (js/Date.)) start)
                  peers (set (keys @s/peers))]
              (cond
                (and (contains? peers :root) (contains? peers :core))
                (do (println (str "PASS | Workers ready in " elapsed "ms. Peers: " (pr-str peers)))
                    (js/setTimeout run-tests 500))

                (> elapsed 30000)
                (do (println (str "FAIL | TIMEOUT waiting for workers. Peers: " (pr-str peers)))
                    (println "=== WALKTHROUGH COMPLETE: 0 passed, 1 failed ==="))

                :else
                (js/setTimeout check-ready 200))))]
      (js/setTimeout check-ready 500))))
