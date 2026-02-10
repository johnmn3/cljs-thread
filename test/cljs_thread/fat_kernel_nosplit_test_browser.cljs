(ns cljs-thread.fat-kernel-nosplit-test-browser
  "Non-code-split browser tests for fat-kernel strategy.
   A single app.js serves as both the page script and the blob kernel.
   No catch-and-load needed — everything is in one module."
  (:require
   [cljs-thread.core :as thread :refer [spawn in future pmap =>>]]
   [cljs-thread.env :as env]
   [cljs-thread.state :as s]
   [cljs-thread.platform :as p]
   [cljs-thread.sync :as sync]
   [cljs-thread.strategy.fat-kernel :as fat-kernel]))

(enable-console-print!)

;; ---------------------------------------------------------------------------
;; Test harness
;; ---------------------------------------------------------------------------

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
        status (if (and (pos? pass) (zero? fail)) "ALL PASSED" "FAILURES")]
    (when el
      (set! (.-innerHTML el)
            (str "<div id='summary' class='" (if (and (pos? pass) (zero? fail)) "pass" "fail") "'>"
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
                        "</pre></div>")))))))

;; ---------------------------------------------------------------------------
;; Tests
;; ---------------------------------------------------------------------------

(defn test-environment []
  (log! "\n--- Fat Kernel Nosplit Environment ---")
  (check "env:sab-available" true p/sab-sync?)
  (check "env:no-blocking" false (sync/no-blocking?))
  (check "env:in-screen" true (env/in-screen?)))

(defn test-in-basic []
  (log! "\n--- Fat Kernel Nosplit Tests ---")
  (-> @(in :core (+ 10 20 12))
      (.then #(check "nosplit:in-basic" 42 %))
      (.catch #(fail! "nosplit:in-basic" 42 (str "error: " %)))))

(defn test-spawn-basic []
  (-> @(spawn (+ 21 21))
      (.then #(check "nosplit:spawn-basic" 42 %))
      (.catch #(fail! "nosplit:spawn-basic" 42 (str "error: " %)))))

(defn test-spawn-nested []
  (-> @(spawn (+ 1 @(spawn (* 6 7))))
      (.then #(check "nosplit:spawn-nested" 43 %))
      (.catch #(fail! "nosplit:spawn-nested" 43 (str "error: " %)))))

(defn test-future-basic []
  (-> @(future (+ 100 200))
      (.then #(check "nosplit:future-basic" 300 %))
      (.catch #(fail! "nosplit:future-basic" 300 (str "error: " %)))))

(defn test-pmap-basic []
  (-> @(future (let [result (doall (pmap inc [1 2 3 4]))] result))
      (.then #(check "nosplit:pmap-basic" [2 3 4 5] (vec %)))
      (.catch #(fail! "nosplit:pmap-basic" [2 3 4 5] (str "error: " %)))))

(defn test-transducer []
  (-> @(=>> (range 10) (map inc) (filter odd?) (apply +))
      (.then #(check "nosplit:transducer" 25 %))
      (.catch #(fail! "nosplit:transducer" 25 (str "error: " %)))))

;; ---------------------------------------------------------------------------
;; Runner
;; ---------------------------------------------------------------------------

(defn run-all-tests! []
  (log! "=== Fat Kernel Nosplit Browser Tests ===")
  (let [timeout (js/setTimeout
                 (fn []
                   (log! "TIMEOUT: tests took too long")
                   (fail! "timeout" "complete" "hung")
                   (render-results!))
                 120000)]
    (-> (js/Promise.resolve nil)
        (.then test-environment)
        (.then test-in-basic)
        (.then test-spawn-basic)
        (.then test-spawn-nested)
        (.then test-future-basic)
        (.then test-pmap-basic)
        (.then test-transducer)
        (.then (fn []
                 (js/clearTimeout timeout)
                 (log! "\nAll fat-kernel nosplit tests complete.")
                 (render-results!)))
        (.catch (fn [e]
                  (js/clearTimeout timeout)
                  (log! "FATAL:" (str e))
                  (swap! results update :fail inc)
                  (render-results!))))))

;; ---------------------------------------------------------------------------
;; Init
;; ---------------------------------------------------------------------------

(defn init! []
  (when (env/in-screen?)
    (log! "Initializing fat-kernel nosplit browser tests...")
    (log! (str "  sab-sync?: " p/sab-sync?))

    ;; Install fat-kernel strategy — auto-detects single script
    (fat-kernel/install!)

    ;; Init thread — single module, same script is the worker
    (thread/init!
     {:core-connect-string "/app.js"})

    (log! "  thread/init! called with fat-kernel strategy (nosplit)")
    (log! (str "  no-blocking?: " (sync/no-blocking?)))

    ;; Wait for workers
    (let [start (.getTime (js/Date.))
          check-ready
          (fn check-ready []
            (let [elapsed (- (.getTime (js/Date.)) start)
                  peers (set (keys @s/peers))]
              (cond
                (and (contains? peers :root) (contains? peers :core)
                     (contains? peers :future) (contains? peers :fp-0))
                (do (log! (str "Workers ready in " elapsed "ms. Peers: " (pr-str peers)))
                    (js/setTimeout run-all-tests! 500))
                (> elapsed 30000)
                (do (log! (str "TIMEOUT waiting for workers. Peers: " (pr-str peers)))
                    (fail! "init:timeout" "workers ready" (pr-str peers))
                    (render-results!))
                :else
                (js/setTimeout check-ready 200))))]
      (js/setTimeout check-ready 500))))
