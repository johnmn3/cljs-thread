(ns cljs-thread.runner.integration-runner
  (:require-macros [cljs-thread.core :refer [spawn in future pmap =>>]])
  (:require
   [cljs-thread.core :as thread]
   [cljs-thread.env :as env]
   [cljs-thread.state :as s]))

;; Simple test harness that writes results to the DOM
(def results (atom {:pass 0 :fail 0 :errors [] :log []}))

(defn log! [& msgs]
  (let [msg (apply str (interpose " " msgs))]
    (swap! results update :log conj msg)
    (println msg)))

(defn pass! [test-name]
  (swap! results update :pass inc)
  (log! "PASS:" test-name))

(defn fail! [test-name expected actual]
  (swap! results update :fail inc)
  (swap! results update :errors conj {:test test-name :expected expected :actual actual})
  (log! "FAIL:" test-name "- expected:" (pr-str expected) "actual:" (pr-str actual)))

(defn check [test-name expected actual]
  (if (= expected actual)
    (pass! test-name)
    (fail! test-name expected actual)))

(defn render-results! []
  (let [{:keys [pass fail errors log]} @results
        el (.getElementById js/document "results")
        status (if (zero? fail) "ALL PASSED" "FAILURES")]
    (set! (.-innerHTML el)
          (str "<div id='summary' class='" (if (zero? fail) "pass" "fail") "'>"
               "<h2>" status "</h2>"
               "<p>" pass " passed, " fail " failed</p>"
               "</div>"
               "<div id='log'><pre>"
               (apply str (interpose "\n" log))
               "</pre></div>"
               (when (seq errors)
                 (str "<div id='errors'><h3>Failures:</h3><pre>"
                      (apply str (map #(str (:test %) ": expected " (pr-str (:expected %))
                                            ", got " (pr-str (:actual %)) "\n")
                                      errors))
                      "</pre></div>"))))))

;; ---- Integration Tests ----

(defn test-spawn-ephemeral
  "spawn an ephemeral worker that returns a value"
  []
  (-> @(spawn (+ 1 2 3))
      (.then (fn [result]
               (check "spawn-ephemeral-addition" 6 result)))
      (.catch (fn [e]
                (fail! "spawn-ephemeral-addition" 6 (str "error: " e))))))

(defn test-spawn-deref-nested
  "spawn nested ephemeral workers"
  []
  (-> @(spawn (+ 1 @(spawn (+ 2 3))))
      (.then (fn [result]
               (check "spawn-nested" 6 result)))
      (.catch (fn [e]
                (fail! "spawn-nested" 6 (str "error: " e))))))

(defn test-spawn-named-and-in
  "spawn a named worker, send work to it with `in`"
  []
  (let [w (spawn {:id :test-w1})]
    (-> @(in :test-w1 (+ 10 20 30))
        (.then (fn [result]
                 (check "in-named-worker" 60 result)))
        (.catch (fn [e]
                  (fail! "in-named-worker" 60 (str "error: " e)))))))

(defn test-in-with-local-conveyance
  "variables from the local scope are conveyed to the worker"
  []
  (let [x 10
        y 20]
    (-> @(spawn (+ x y))
        (.then (fn [result]
                 (check "spawn-local-conveyance" 30 result)))
        (.catch (fn [e]
                  (fail! "spawn-local-conveyance" 30 (str "error: " e)))))))

(defn test-future-basic
  "future runs work on the thread pool and returns the result"
  []
  (-> @(future (+ 100 200))
      (.then (fn [result]
               (check "future-basic" 300 result)))
      (.catch (fn [e]
                (fail! "future-basic" 300 (str "error: " e))))))

(defn test-future-nested
  "nested futures both resolve"
  []
  (-> @(future (+ 1 @(future (+ 2 3))))
      (.then (fn [result]
               (check "future-nested" 6 result)))
      (.catch (fn [e]
                (fail! "future-nested" 6 (str "error: " e))))))

(defn test-pmap-basic
  "pmap applies a function in parallel across a collection"
  []
  (-> @(future
         (let [result (doall (pmap inc [1 2 3 4]))]
           result))
      (.then (fn [result]
               (check "pmap-basic" [2 3 4 5] (vec result))))
      (.catch (fn [e]
                (fail! "pmap-basic" [2 3 4 5] (str "error: " e))))))

(defn test-parallel-transducer
  "=>> fans transducer work across workers"
  []
  (-> @(=>> (range 10)
            (map inc)
            (filter odd?)
            (apply +))
      (.then (fn [result]
               (check "parallel-transducer" 25 result)))
      (.catch (fn [e]
                (fail! "parallel-transducer" 25 (str "error: " e))))))

(defn run-tests!
  "Run all integration tests sequentially, then render results"
  []
  (log! "Starting integration tests...")
  (-> (test-spawn-ephemeral)
      (.then test-spawn-deref-nested)
      (.then test-spawn-named-and-in)
      (.then test-in-with-local-conveyance)
      (.then test-future-basic)
      (.then test-future-nested)
      (.then test-pmap-basic)
      (.then test-parallel-transducer)
      (.then (fn []
               (log! "All integration tests complete.")
               (render-results!)))
      (.catch (fn [e]
                (log! "FATAL ERROR:" (str e))
                (swap! results update :fail inc)
                (swap! results update :errors conj {:test "fatal" :expected "no error" :actual (str e)})
                (render-results!)))))

;; ---- Entry Point ----

(defn init! []
  (when (env/in-screen?)
    (log! "Initializing cljs-thread for integration tests...")
    (thread/init!
     {:sw-connect-string  "/sw.js"
      :core-connect-string "/core.js"})
    ;; Wait for the service worker + workers to be ready before running tests.
    ;; The :core and :future workers need to appear in s/peers.
    (let [start (.getTime (js/Date.))
          check-ready
          (fn check-ready []
            (let [elapsed (- (.getTime (js/Date.)) start)
                  peers (set (keys @s/peers))]
              (cond
                (contains? peers :core)
                (do (log! "Workers ready in" elapsed "ms. Peers:" (pr-str peers))
                    ;; Give the future pool a moment to initialize
                    (js/setTimeout run-tests! 2000))

                (> elapsed 30000)
                (do (log! "TIMEOUT waiting for workers. Peers:" (pr-str peers))
                    (swap! results update :fail inc)
                    (swap! results update :errors conj {:test "init" :expected "workers ready" :actual (str "timeout, peers: " peers)})
                    (render-results!))

                :else
                (js/setTimeout check-ready 200))))]
      (js/setTimeout check-ready 500))))
