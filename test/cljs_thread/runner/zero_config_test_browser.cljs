(ns cljs-thread.runner.zero-config-test-browser
  "Zero-config browser tests — init! called with NO arguments.
   Verifies that fat-kernel strategy is auto-installed and the worker
   script is auto-detected from manifest.edn / <script> tags."
  (:require-macros [cljs-thread.core :refer [spawn in future pmap =>>]])
  (:require
   [cljs-thread.core :as thread]
   [cljs-thread.env :as env]
   [cljs-thread.state :as s]
   [cljs-thread.platform :as p]
   [cljs-thread.sync :as sync]))

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
  (log! "\n--- Zero Config Environment ---")
  (check "env:sab-available" true p/sab-sync?)
  (check "env:no-blocking" false (sync/no-blocking?))
  (check "env:in-screen" true (env/in-screen?))
  ;; Verify fat-kernel was auto-installed
  (check "env:strategy-installed" true (some? @p/create-worker-override))
  (check "env:strategy-type" :fat-kernel (get-in @s/conf [:__spawn-strategy :type])))

(defn test-in-basic []
  (log! "\n--- Zero Config Core Tests ---")
  (-> @(in :core (+ 10 20 12))
      (.then #(check "zc:in-basic" 42 %))
      (.catch #(fail! "zc:in-basic" 42 (str "error: " %)))))

(defn test-spawn-basic []
  (-> @(spawn (+ 21 21))
      (.then #(check "zc:spawn-basic" 42 %))
      (.catch #(fail! "zc:spawn-basic" 42 (str "error: " %)))))

(defn test-future-basic []
  (-> @(future (+ 100 200))
      (.then #(check "zc:future-basic" 300 %))
      (.catch #(fail! "zc:future-basic" 300 (str "error: " %)))))

(defn test-pmap-basic []
  (-> @(future (let [result (doall (pmap inc [1 2 3 4]))] result))
      (.then #(check "zc:pmap-basic" [2 3 4 5] (vec %)))
      (.catch #(fail! "zc:pmap-basic" [2 3 4 5] (str "error: " %)))))

(defn test-transducer []
  (-> @(=>> (range 10) (map inc) (filter odd?) (apply +))
      (.then #(check "zc:transducer" 25 %))
      (.catch #(fail! "zc:transducer" 25 (str "error: " %)))))

;; ---------------------------------------------------------------------------
;; Runner
;; ---------------------------------------------------------------------------

(defn run-all-tests! []
  (log! "=== Zero Config Browser Tests ===")
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
        (.then test-future-basic)
        (.then test-pmap-basic)
        (.then test-transducer)
        (.then (fn []
                 (js/clearTimeout timeout)
                 (log! "\nAll zero config tests complete.")
                 (render-results!)))
        (.catch (fn [e]
                  (js/clearTimeout timeout)
                  (log! "FATAL:" (str e))
                  (swap! results update :fail inc)
                  (render-results!))))))

;; ---------------------------------------------------------------------------
;; Init — ZERO CONFIG! No arguments to init!
;; ---------------------------------------------------------------------------

(defn init! []
  (when (env/in-screen?)
    (log! "Initializing zero-config browser tests...")
    (log! (str "  sab-sync?: " p/sab-sync?))

    ;; THE KEY: init! with NO arguments
    (thread/init!)

    (log! (str "  strategy: " (pr-str (get-in @s/conf [:__spawn-strategy :type]))))
    (log! (str "  core-connect-string: " (pr-str (:core-connect-string @s/conf))))
    (log! (str "  no-blocking?: " (sync/no-blocking?)))

    ;; Wait for workers
    (let [start (.getTime (js/Date.))
          check-ready
          (fn check-ready []
            (let [elapsed (- (.getTime (js/Date.)) start)
                  peers (set (keys @s/peers))]
              (cond
                (and (contains? peers :core)
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
