(ns cljs-thread.live-kernel-test-browser
  "Browser integration tests for the Live Kernel strategy.

   Tests cover:
   - Basic in/spawn/future/pmap/=>> operations
   - Non-exported functions via catch-and-load (IIFE unwrapping)
   - Conveyance of local values
   - Nested worker calls

   The live-kernel strategy boots workers with a minimal kernel, then loads
   the full runtime via load-scripts. Non-exported functions are handled
   transparently via :loadable-modules config."
  (:require
   [cljs-thread.core :as thread :refer [spawn in future pmap =>>]]
   [cljs-thread.env :as env]
   [cljs-thread.state :as s]
   [cljs-thread.platform :as p]
   [cljs-thread.strategy.live-kernel :as live-kernel]
   [cljs-thread.autoload-fns :as noex]))

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
;; Tests: Standard operations
;; ---------------------------------------------------------------------------

(defn test-in-basic []
  (log! "\n--- Standard Operation Tests ---")
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

;; ---------------------------------------------------------------------------
;; Tests: Non-exported functions via catch-and-load
;; ---------------------------------------------------------------------------

(defn test-autoload-compute []
  (log! "\n--- Catch-and-Load Tests (non-exported functions) ---")
  (-> @(in :core (noex/compute-chain 5))
      (.then #(check "autoload:compute-chain" 15 %))
      (.catch #(fail! "autoload:compute-chain" 15 (str "error: " %)))))

(defn test-autoload-accumulate []
  (-> @(in :core (noex/accumulate [1 2 3 4 5]))
      (.then #(check "autoload:accumulate" 15 %))
      (.catch #(fail! "autoload:accumulate" 15 (str "error: " %)))))

(defn test-autoload-spawn []
  (-> @(spawn (noex/compute-chain 10))
      (.then #(check "autoload:spawn" 30 %))
      (.catch #(fail! "autoload:spawn" 30 (str "error: " %)))))

(defn test-autoload-future []
  (-> @(future (noex/compute-chain 7))
      (.then #(check "autoload:future" 21 %))
      (.catch #(fail! "autoload:future" 21 (str "error: " %)))))

(defn test-autoload-conveyance []
  (let [n 8]
    (-> @(in :core (noex/compute-chain n))
        (.then #(check "autoload:conveyance" 24 %))
        (.catch #(fail! "autoload:conveyance" 24 (str "error: " %))))))

(defn test-core-fns-still-work []
  (-> @(in :core (reduce + (map inc (range 5))))
      (.then #(check "core-fns" 15 %))
      (.catch #(fail! "core-fns" 15 (str "error: " %)))))

;; ---------------------------------------------------------------------------
;; Test runner
;; ---------------------------------------------------------------------------

(defn run-all-tests! []
  (log! "=== Live Kernel Browser Tests ===")
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
        (.then test-autoload-compute)
        (.then test-autoload-accumulate)
        (.then test-autoload-spawn)
        (.then test-autoload-future)
        (.then test-autoload-conveyance)
        (.then test-core-fns-still-work)
        ;; Done
        (.then (fn []
                 (js/clearTimeout timeout)
                 (log! "\nAll live kernel tests complete.")
                 (render-results!)))
        (.catch (fn [e]
                  (js/clearTimeout timeout)
                  (log! "FATAL:" (str e))
                  (swap! results update :fail inc)
                  (render-results!))))))

;; ---------------------------------------------------------------------------
;; Init
;; ---------------------------------------------------------------------------

(defn- detect-worker-script []
  (let [scripts (array-seq (.querySelectorAll js/document "script[src]"))]
    (if (some #(re-find #"/app\.js" (.-src %)) scripts)
      "/app.js"
      "/core.js")))

(defn init! []
  (when (env/in-screen?)
    (let [worker-script (detect-worker-script)
          core-url (str js/location.origin worker-script)]
      (log! "Initializing live kernel tests...")
      (log! (str "  Worker script: " worker-script))

      ;; Install live-kernel strategy with catch-and-load for non-exported fns
      (live-kernel/install! {:scripts         [core-url]
                             :loadable-modules ["screen.js"]})

      (log! (str "  create-worker-override: " (pr-str (some? @p/create-worker-override))))
      (log! (str "  loadable-modules: " (pr-str (:loadable-modules @s/conf))))

      (thread/init!
       {:sw-connect-string   "/sw.js"
        :core-connect-string worker-script})

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
