(ns cljs-thread.kernel-split-test-browser
  "Browser integration tests for kernel module split.

   Verifies that the two-phase boot works correctly:
   1. kernel.js loads first (cljs-thread runtime only)
   2. shared.js + core.js load after (app code)
   3. All thread operations work normally

   The build uses a :kernel module with cljs-thread.core entries, separate
   from the :shared module. Workers boot with kernel.js first for fast
   cljs-thread initialization, then load shared.js + core.js for app code."
  (:require
   [cljs-thread.core :as thread :refer [spawn in future pmap =>>]]
   [cljs-thread.env :as env]
   [cljs-thread.state :as s]
   [cljs-thread.platform :as p]
   [cljs-thread.strategy.live-kernel :as live-kernel]))

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
;; Tests: Standard operations via kernel-split two-phase boot
;; ---------------------------------------------------------------------------

(defn test-in-basic []
  (log! "\n--- Kernel-Split Two-Phase Boot Tests ---")
  (-> @(in :core (+ 10 20 12))
      (.then #(check "in-basic" 42 %))
      (.catch #(fail! "in-basic" 42 (str "error: " %)))))

(defn test-spawn-basic []
  (-> @(spawn (+ 21 21))
      (.then #(check "spawn-basic" 42 %))
      (.catch #(fail! "spawn-basic" 42 (str "error: " %)))))

(defn test-conveyance []
  (let [x 10 y 32]
    (-> @(spawn (+ x y))
        (.then #(check "conveyance" 42 %))
        (.catch #(fail! "conveyance" 42 (str "error: " %))))))

(defn test-future-basic []
  (-> @(future (+ 100 200))
      (.then #(check "future-basic" 300 %))
      (.catch #(fail! "future-basic" 300 (str "error: " %)))))

(defn test-pmap-basic []
  (-> @(future (let [result (doall (pmap inc [1 2 3 4]))] result))
      (.then #(check "pmap-basic" [2 3 4 5] (vec %)))
      (.catch #(fail! "pmap-basic" [2 3 4 5] (str "error: " %)))))

(defn test-transducer []
  (-> @(=>> (range 10) (map inc) (filter odd?) (apply +))
      (.then #(check "transducer" 25 %))
      (.catch #(fail! "transducer" 25 (str "error: " %)))))

(defn test-nested-spawn []
  (-> @(spawn (+ 1 @(spawn (* 6 7))))
      (.then #(check "nested-spawn" 43 %))
      (.catch #(fail! "nested-spawn" 43 (str "error: " %)))))

(defn test-string-result []
  (-> @(in :core (str "hello " "world"))
      (.then #(check "string-result" "hello world" %))
      (.catch #(fail! "string-result" "hello world" (str "error: " %)))))

(defn test-collection-result []
  (-> @(in :core (mapv inc [1 2 3]))
      (.then #(check "collection-result" [2 3 4] %))
      (.catch #(fail! "collection-result" [2 3 4] (str "error: " %)))))

;; ---------------------------------------------------------------------------
;; Tests: Performance — compare with and without kernel split
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
  (log! "=== Kernel-Split Browser Tests (Two-Phase Boot) ===")
  (let [timeout (js/setTimeout
                 (fn []
                   (log! "TIMEOUT: tests took too long")
                   (fail! "timeout" "complete" "hung")
                   (render-results!))
                 120000)]
    (-> (test-in-basic)
        (.then test-spawn-basic)
        (.then test-conveyance)
        (.then test-future-basic)
        (.then test-pmap-basic)
        (.then test-transducer)
        (.then test-nested-spawn)
        (.then test-string-result)
        (.then test-collection-result)
        (.then test-spawn-roundtrip-time)
        (.then test-in-roundtrip-time)
        (.then test-future-roundtrip-time)
        ;; Done
        (.then (fn []
                 (js/clearTimeout timeout)
                 (log! "\nAll kernel-split tests complete.")
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
    (let [origin js/location.origin
          kernel-url (str origin "/kernel.js")
          shared-url (str origin "/shared.js")
          core-url   (str origin "/core.js")]
      (log! "Initializing kernel-split tests...")
      (log! (str "  sab-sync?: " p/sab-sync?))
      (log! (str "  kernel-scripts: [" kernel-url "]"))
      (log! (str "  app-scripts: [" shared-url " " core-url "]"))

      ;; Install live-kernel with TWO-PHASE boot:
      ;; Phase 1: kernel.js (cljs-thread runtime only — small)
      ;; Phase 2: shared.js + core.js (app code — larger)
      (live-kernel/install! {:kernel-scripts [kernel-url]
                             :scripts        [shared-url core-url]})

      (log! (str "  create-worker-override: " (pr-str (some? @p/create-worker-override))))

      ;; No SW needed — SAB sync handles everything
      (thread/init!
       {:core-connect-string "/core.js"})

      (log! "  thread/init! called")

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
        (js/setTimeout check-ready 500)))))
