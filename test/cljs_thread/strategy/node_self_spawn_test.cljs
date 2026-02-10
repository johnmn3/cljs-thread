(ns cljs-thread.strategy.node-self-spawn-test
  "Full integration test for Strategy 1 (Self-Spawn) on Node.js.
   Installs self-spawn, then runs all 8 parallel tests."
  (:require-macros [cljs-thread.core :refer [spawn in on-when future pmap =>>]])
  (:require
   [cljs-thread.core :as thread]
   [cljs-thread.env :as env]
   [cljs-thread.state :as s]
   [cljs-thread.platform :as p]
   [cljs-thread.strategy.self-spawn :as self-spawn]
   [cljs-thread.future]
   [cljs-thread.pmap]
   [cljs-thread.injest]))

(enable-console-print!)

(def results (atom {:passed 0 :failed 0 :tests []}))

(defn pass! [name]
  (swap! results update :passed inc)
  (swap! results update :tests conj {:name name :status :pass})
  (println "  PASS:" name))

(defn fail! [name msg]
  (swap! results update :failed inc)
  (swap! results update :tests conj {:name name :status :fail :msg msg})
  (println "  FAIL:" name "-" msg))

(defn check [name expected actual]
  (if (= expected actual)
    (pass! name)
    (fail! name (str "Expected " (pr-str expected) ", got " (pr-str actual)))))

(defn finish! []
  (let [{:keys [passed failed]} @results]
    (println)
    (if (zero? failed)
      (do (println (str "ALL PASSED: " passed " tests"))
          (js/process.exit 0))
      (do (println (str "FAILED: " failed " of " (+ passed failed) " tests"))
          (js/process.exit 1)))))

;; --- Tests (identical to node_runner) ---

(defn test-spawn-ephemeral []
  (-> @(spawn (+ 21 21))
      (.then #(check "spawn-ephemeral" 42 %))
      (.catch #(fail! "spawn-ephemeral" (str "error: " %)))))

(defn test-spawn-nested []
  (-> @(spawn (+ 1 @(spawn (* 6 7))))
      (.then #(check "spawn-nested" 43 %))
      (.catch #(fail! "spawn-nested" (str "error: " %)))))

(defn test-in-named []
  (-> @(in :core (+ 10 20 12))
      (.then #(check "in-named" 42 %))
      (.catch #(fail! "in-named" (str "error: " %)))))

(defn test-conveyance []
  (let [x 10 y 32]
    (-> @(spawn (+ x y))
        (.then #(check "conveyance" 42 %))
        (.catch #(fail! "conveyance" (str "error: " %))))))

(defn test-future []
  (-> @(future (+ 100 200))
      (.then #(check "future" 300 %))
      (.catch #(fail! "future" (str "error: " %)))))

(defn test-future-nested []
  (-> @(future (+ 1 @(future (+ 2 3))))
      (.then #(check "future-nested" 6 %))
      (.catch #(fail! "future-nested" (str "error: " %)))))

(defn test-pmap []
  (-> @(future (let [result (doall (pmap inc [1 2 3 4]))] result))
      (.then #(check "pmap" [2 3 4 5] (vec %)))
      (.catch #(fail! "pmap" (str "error: " %)))))

(defn test-transducer []
  (-> @(=>> (range 10) (map inc) (filter odd?) (apply +))
      (.then #(check "transducer" 25 %))
      (.catch #(fail! "transducer" (str "error: " %)))))

(defn run-tests! []
  (println "Running all 8 integration tests...")
  (js/setTimeout #(do (println "\nTIMEOUT") (finish!)) 45000)
  (-> (test-spawn-ephemeral)
      (.then test-spawn-nested)
      (.then test-in-named)
      (.then test-conveyance)
      (.then test-future)
      (.then test-future-nested)
      (.then test-pmap)
      (.then test-transducer)
      (.then #(do (println "All tests complete.") (finish!)))
      (.catch #(do (fail! "fatal" (str %)) (finish!)))))

(defn main []
  (println "=== Strategy 1: Self-Spawn (Node.js) ===")
  (println "Node.js:" js/process.version)

  ;; The worker file is the same compiled worker.js
  (let [path (js* "require('path')")
        worker-path (.resolve path (.dirname path js/__filename) "worker.js")]

    ;; Install self-spawn strategy — all workers will be spawned from worker.js
    (self-spawn/install! {:url worker-path})

    ;; Init cljs-thread (connection strings still needed for the spawn system
    ;; to call create-worker, but the URL arg is ignored by the override)
    (thread/init!
     {:core-connect-string   worker-path
      :root-connect-string   worker-path
      :future-connect-string worker-path
      :injest-connect-string worker-path})

    ;; Wait for workers to be ready
    (on-when (and (contains? @s/peers :root)
                  (contains? @s/peers :core)
                  (contains? @s/peers :future)
                  (some #(.startsWith (name %) "fp-") (keys @s/peers)))
      {:max-time 30000}
      (println "Workers ready. Peers:" (set (keys @s/peers)))
      (js/setTimeout run-tests! 3000))))
