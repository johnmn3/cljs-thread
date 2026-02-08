(ns cljs-thread.sab-sync-test-browser
  "Browser integration tests for SAB-based sync (no Service Worker).

   Proves that blocking @(in ...) and @(future ...) work correctly when
   COOP/COEP headers are set and SharedArrayBuffer is available, without
   needing a Service Worker for sync coordination.

   The main thread acts as coordinator (same role as Node.js main thread).
   Workers block with Atomics.wait, coordinator responds via SAB + Atomics.notify."
  (:require
   [cljs-thread.core :as thread :refer [spawn in future pmap =>>]]
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
;; Tests: Standard operations via SAB sync (no SW)
;; ---------------------------------------------------------------------------

(defn test-sab-available []
  (log! "\n--- SAB Sync Environment ---")
  (check "sab:available" true p/sab-sync?)
  (check "sab:no-blocking" false (sync/no-blocking?)))

(defn test-in-basic []
  (log! "\n--- SAB Sync Tests ---")
  (-> @(in :core (+ 10 20 12))
      (.then #(check "sab:in-basic" 42 %))
      (.catch #(fail! "sab:in-basic" 42 (str "error: " %)))))

(defn test-spawn-basic []
  (-> @(spawn (+ 21 21))
      (.then #(check "sab:spawn-basic" 42 %))
      (.catch #(fail! "sab:spawn-basic" 42 (str "error: " %)))))

(defn test-conveyance []
  (let [x 10 y 32]
    (-> @(spawn (+ x y))
        (.then #(check "sab:conveyance" 42 %))
        (.catch #(fail! "sab:conveyance" 42 (str "error: " %))))))

(defn test-future-basic []
  (-> @(future (+ 100 200))
      (.then #(check "sab:future-basic" 300 %))
      (.catch #(fail! "sab:future-basic" 300 (str "error: " %)))))

(defn test-pmap-basic []
  (-> @(future (let [result (doall (pmap inc [1 2 3 4]))] result))
      (.then #(check "sab:pmap-basic" [2 3 4 5] (vec %)))
      (.catch #(fail! "sab:pmap-basic" [2 3 4 5] (str "error: " %)))))

(defn test-transducer []
  (-> @(=>> (range 10) (map inc) (filter odd?) (apply +))
      (.then #(check "sab:transducer" 25 %))
      (.catch #(fail! "sab:transducer" 25 (str "error: " %)))))

(defn test-nested-spawn []
  (-> @(spawn (+ 1 @(spawn (* 6 7))))
      (.then #(check "sab:nested-spawn" 43 %))
      (.catch #(fail! "sab:nested-spawn" 43 (str "error: " %)))))

(defn test-string-result []
  (-> @(in :core (str "hello " "world"))
      (.then #(check "sab:string-result" "hello world" %))
      (.catch #(fail! "sab:string-result" "hello world" (str "error: " %)))))

(defn test-collection-result []
  (-> @(in :core (mapv inc [1 2 3]))
      (.then #(check "sab:collection-result" [2 3 4] %))
      (.catch #(fail! "sab:collection-result" [2 3 4] (str "error: " %)))))

(defn test-nil-result []
  (-> @(in :core nil)
      (.then #(check "sab:nil-result" nil %))
      (.catch #(fail! "sab:nil-result" nil (str "error: " %)))))

;; ---------------------------------------------------------------------------
;; Tests: Performance characteristics
;; ---------------------------------------------------------------------------

(defn test-spawn-roundtrip-time []
  (log! "\n--- Performance Characteristics ---")
  (let [start (.now js/performance)]
    (-> @(spawn 42)
        (.then (fn [_]
                 (let [elapsed (- (.now js/performance) start)]
                   (log! (str "  spawn roundtrip: " (.toFixed elapsed 1) "ms"))
                   (check "perf:spawn-roundtrip" true (< elapsed 5000)))))
        (.catch #(fail! "perf:spawn-roundtrip" "< 5s" (str "error: " %))))))

(defn test-in-roundtrip-time []
  (let [start (.now js/performance)]
    (-> @(in :core 42)
        (.then (fn [_]
                 (let [elapsed (- (.now js/performance) start)]
                   (log! (str "  in :core roundtrip: " (.toFixed elapsed 1) "ms"))
                   (check "perf:in-roundtrip" true (< elapsed 5000)))))
        (.catch #(fail! "perf:in-roundtrip" "< 5s" (str "error: " %))))))

(defn test-future-roundtrip-time []
  (let [start (.now js/performance)]
    (-> @(future 42)
        (.then (fn [_]
                 (let [elapsed (- (.now js/performance) start)]
                   (log! (str "  future roundtrip: " (.toFixed elapsed 1) "ms"))
                   (check "perf:future-roundtrip" true (< elapsed 5000)))))
        (.catch #(fail! "perf:future-roundtrip" "< 5s" (str "error: " %))))))

;; ---------------------------------------------------------------------------
;; Test runner
;; ---------------------------------------------------------------------------

(defn run-all-tests! []
  (log! "=== SAB Sync Browser Tests (No Service Worker) ===")
  (let [timeout (js/setTimeout
                 (fn []
                   (log! "TIMEOUT: tests took too long")
                   (fail! "timeout" "complete" "hung")
                   (render-results!))
                 120000)]
    (-> (js/Promise.resolve nil)
        (.then test-sab-available)
        (.then test-in-basic)
        (.then test-spawn-basic)
        (.then test-conveyance)
        (.then test-future-basic)
        (.then test-pmap-basic)
        (.then test-transducer)
        (.then test-nested-spawn)
        (.then test-string-result)
        (.then test-collection-result)
        (.then test-nil-result)
        (.then test-spawn-roundtrip-time)
        (.then test-in-roundtrip-time)
        (.then test-future-roundtrip-time)
        ;; Done
        (.then (fn []
                 (js/clearTimeout timeout)
                 (log! "\nAll SAB sync tests complete.")
                 (render-results!)))
        (.catch (fn [e]
                  (js/clearTimeout timeout)
                  (log! "FATAL:" (str e))
                  (swap! results update :fail inc)
                  (render-results!))))))

;; ---------------------------------------------------------------------------
;; Init — NO Service Worker!
;; ---------------------------------------------------------------------------

(defn init! []
  (when (env/in-screen?)
    (log! "Initializing SAB sync tests (NO Service Worker)...")
    (log! (str "  sab-sync?: " p/sab-sync?))
    (log! (str "  SharedArrayBuffer: " (exists? js/SharedArrayBuffer)))
    (log! (str "  Atomics: " (exists? js/Atomics)))

    ;; NO :sw-connect-string! SAB sync takes over.
    (thread/init!
     {:core-connect-string "/core.js"})

    (log! "  thread/init! called (no SW)")
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
