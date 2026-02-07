(ns cljs-thread.node-runner
  "Node.js integration test runner for cljs-thread.
   Runs on the main thread, initializes cljs-thread, spawns workers,
   and exercises the same features as the browser integration tests.
   Uses Promise-based (.then) pattern since the main thread is also
   the coordinator and cannot block synchronously."
  (:require-macros [cljs-thread.core :refer [spawn in on-when]])
  (:require
   [cljs-thread.core :as thread]
   [cljs-thread.env :as env]
   [cljs-thread.state :as s]
   [cljs-thread.platform :as p]))

(enable-console-print!)

(def results (atom {:passed 0 :failed 0 :tests []}))

(defn pass! [name]
  (swap! results update :passed inc)
  (swap! results update :tests conj {:name name :status :pass})
  (println "PASS:" name))

(defn fail! [name msg]
  (swap! results update :failed inc)
  (swap! results update :tests conj {:name name :status :fail :msg msg})
  (println "FAIL:" name "-" msg))

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

;; ---------------------------------------------------------------------------
;; Tests — mirrors the browser integration tests (Promise-based)
;; ---------------------------------------------------------------------------

(defn test-spawn-ephemeral []
  (-> @(spawn (+ 21 21))
      (.then (fn [result]
               (check "spawn-ephemeral-addition" 42 result)))
      (.catch (fn [e]
                (fail! "spawn-ephemeral-addition" (str "error: " e))))))

(defn test-spawn-nested []
  (-> @(spawn (+ 1 @(spawn (* 6 7))))
      (.then (fn [result]
               (check "spawn-nested" 43 result)))
      (.catch (fn [e]
                (fail! "spawn-nested" (str "error: " e))))))

(defn test-in-named-worker []
  (-> @(in :core (+ 10 20 12))
      (.then (fn [result]
               (check "in-named-worker" 42 result)))
      (.catch (fn [e]
                (fail! "in-named-worker" (str "error: " e))))))

(defn test-spawn-local-conveyance []
  (let [x 10
        y 32]
    (-> @(spawn (+ x y))
        (.then (fn [result]
                 (check "spawn-local-conveyance" 42 result)))
        (.catch (fn [e]
                  (fail! "spawn-local-conveyance" (str "error: " e)))))))

(defn run-tests! []
  (println "Starting Node.js integration tests...")
  (println "Platform:" (if p/node? "node" "browser"))
  (println "Thread ID:" (:id env/data))

  ;; Note: future and pmap tests are deferred — they require MessagePort
  ;; transfer between worker threads (mesh) which needs further Node.js work.
  (-> (test-spawn-ephemeral)
      (.then test-spawn-nested)
      (.then test-in-named-worker)
      (.then test-spawn-local-conveyance)
      (.then (fn []
               (println "All integration tests complete.")
               (finish!)))
      (.catch (fn [e]
                (println "FATAL ERROR:" (str e))
                (fail! "fatal" (str e))
                (finish!)))))

;; ---------------------------------------------------------------------------
;; Main entry point
;; ---------------------------------------------------------------------------

(defn main []
  (println "Initializing cljs-thread for Node.js integration tests...")
  (println "Node.js:" js/process.version)

  ;; Configure connection strings for Node.js
  ;; The worker entry point is the compiled worker.js in the same directory
  (let [path (js* "require('path')")
        worker-path (.resolve path (.dirname path js/__filename) "worker.js")]
    (thread/init!
     {:core-connect-string  worker-path
      :root-connect-string  worker-path
      :future-connect-string worker-path
      :injest-connect-string worker-path}))

  ;; Wait for workers to be ready, then run tests
  (on-when (and (contains? @s/peers :root)
                (contains? @s/peers :core))
    {:max-time 30000}
    (println "Workers ready. Peers:" (set (keys @s/peers)))
    ;; Delay slightly to ensure mesh is set up
    (js/setTimeout run-tests! 2000)))
