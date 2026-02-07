(ns cljs-thread.autoload-test-browser
  "Proof-of-concept test for the catch-and-load mechanism.

   These tests call NON-exported functions from a worker via (in :core ...).
   Under code splitting, these functions end up in screen.js with IIFE-local
   names. Without catch-and-load, this would cause ReferenceError. With
   catch-and-load enabled (via :loadable-modules config), the worker
   transparently loads screen.js, strips the IIFE wrapper, makes vars global,
   and retries the call.

   Strategy selection via URL param:
     ?strategy=1  ->  Self-Spawn (default for this test)
     ?strategy=2  ->  Blob Bootstrap
     ?strategy=3  ->  Eval Kernel"
  (:require
   [cljs-thread.core :as thread :refer [spawn in future pmap =>>]]
   [cljs-thread.env :as env]
   [cljs-thread.state :as s]
   [cljs-thread.platform :as p]
   [cljs-thread.strategy.self-spawn :as self-spawn]
   [cljs-thread.strategy.blob-bootstrap :as blob-bootstrap]
   [cljs-thread.strategy.eval-kernel :as eval-kernel]
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
;; URL parameter detection
;; ---------------------------------------------------------------------------

(defn- get-strategy-param []
  (when (env/in-screen?)
    (let [params (js/URLSearchParams. js/location.search)
          v (.get params "strategy")]
      (case v "1" 1 "3" 3 "2" 2 1))))

(defn- strategy-name [n]
  (case n 1 "Self-Spawn" 2 "Blob Bootstrap" 3 "Eval Kernel" "Unknown"))

;; ============================================================================
;; AUTOLOAD TESTS: Non-exported functions called via (in :core ...)
;;
;; These functions are in the autoload-fns namespace which is NOT in :shared.
;; Under code splitting, they end up in screen.js with IIFE-local names.
;; The catch-and-load mechanism should handle the ReferenceError transparently.
;; ============================================================================

(defn test-compute-chain []
  (log! "\n--- Autoload Tests: Non-exported functions via catch-and-load ---")
  ;; noex/compute-chain calls noex/reset-state! and noex/process-value,
  ;; all of which are IIFE-local in screen.js. The first call triggers
  ;; ReferenceError → catch-and-load → IIFE unwrap → retry succeeds.
  (-> @(in :core (noex/compute-chain 5))
      (.then #(check "autoload:compute-chain" 15 %))
      (.catch #(fail! "autoload:compute-chain" 15 (str "error: " %)))))

(defn test-accumulate []
  ;; After the first catch-and-load, modules are already loaded.
  ;; This test verifies subsequent calls work without re-loading.
  (-> @(in :core (noex/accumulate [1 2 3 4 5]))
      (.then #(check "autoload:accumulate" 15 %))
      (.catch #(fail! "autoload:accumulate" 15 (str "error: " %)))))

(defn test-process-value []
  ;; Single function call, also non-exported.
  (-> @(in :core (do (noex/reset-state!) (noex/process-value 42)))
      (.then #(check "autoload:process-value" 42 %))
      (.catch #(fail! "autoload:process-value" 42 (str "error: " %)))))

(defn test-non-exported-in-spawn []
  ;; Use spawn (ephemeral worker) with non-exported function.
  (-> @(spawn (noex/compute-chain 10))
      (.then #(check "autoload:spawn" 30 %))
      (.catch #(fail! "autoload:spawn" 30 (str "error: " %)))))

(defn test-non-exported-in-future []
  ;; Use future with non-exported function.
  (-> @(future (noex/compute-chain 7))
      (.then #(check "autoload:future" 21 %))
      (.catch #(fail! "autoload:future" 21 (str "error: " %)))))

(defn test-non-exported-with-conveyance []
  ;; Convey a local value and use non-exported function.
  (let [n 8]
    (-> @(in :core (noex/compute-chain n))
        (.then #(check "autoload:conveyance" 24 %))
        (.catch #(fail! "autoload:conveyance" 24 (str "error: " %))))))

(defn test-non-exported-chained []
  ;; Chain multiple non-exported calls.
  (-> @(in :core (+ (noex/compute-chain 3) (noex/compute-chain 4)))
      (.then #(check "autoload:chained" 21 %))
      (.catch #(fail! "autoload:chained" 21 (str "error: " %)))))

(defn test-core-fns-still-work []
  ;; Verify that core functions still work (not broken by module loading).
  (-> @(in :core (reduce + (map inc (range 5))))
      (.then #(check "autoload:core-fns" 15 %))
      (.catch #(fail! "autoload:core-fns" 15 (str "error: " %)))))

;; ============================================================================
;; Test runner
;; ============================================================================

(defn run-all-tests! [strategy-num]
  (log! "=== Autoload Tests (Catch-and-Load Proof of Concept) ===")
  (log! (str "Strategy: " (strategy-name strategy-num)
             " (strategy=" strategy-num ")"))
  (let [timeout (js/setTimeout
                 (fn []
                   (log! "TIMEOUT: tests took too long")
                   (fail! "timeout" "complete" "hung")
                   (render-results!))
                 120000)]
    (-> (test-compute-chain)
        (.then test-accumulate)
        (.then test-process-value)
        (.then test-non-exported-in-spawn)
        (.then test-non-exported-in-future)
        (.then test-non-exported-with-conveyance)
        (.then test-non-exported-chained)
        (.then test-core-fns-still-work)
        ;; Done
        (.then (fn []
                 (js/clearTimeout timeout)
                 (log! "\nAll autoload tests complete.")
                 (render-results!)))
        (.catch (fn [e]
                  (js/clearTimeout timeout)
                  (log! "FATAL:" (str e))
                  (swap! results update :fail inc)
                  (render-results!))))))

;; ---------------------------------------------------------------------------
;; Init
;; ---------------------------------------------------------------------------

(defn- install-strategy! [strategy-num core-url]
  (case strategy-num
    1 (self-spawn/install! {:url core-url})
    2 (blob-bootstrap/install! {:scripts [core-url]})
    3 (eval-kernel/install! {:scripts [core-url]})))

(defn- detect-worker-script []
  (let [scripts (array-seq (.querySelectorAll js/document "script[src]"))]
    (if (some #(re-find #"/app\.js" (.-src %)) scripts)
      "/app.js"
      "/core.js")))

(defn init! []
  (when (env/in-screen?)
    (let [strategy-num (get-strategy-param)
          worker-script (detect-worker-script)]
      (log! "Initializing autoload tests...")
      (log! (str "  Strategy: " (strategy-name strategy-num)))
      (log! (str "  Worker script: " worker-script))
      (log! (str "  SW controller: " (pr-str (some? (.-controller js/navigator.serviceWorker)))))
      (let [core-url (str js/location.origin worker-script)]
        (install-strategy! strategy-num core-url))
      (log! (str "  create-worker-override: " (pr-str (some? @p/create-worker-override))))
      ;; KEY: :loadable-modules tells workers which modules to load on demand
      ;; when a ReferenceError occurs from IIFE-scoped vars.
      (thread/init!
       {:sw-connect-string   "/sw.js"
        :core-connect-string worker-script
        :loadable-modules    ["screen.js"]})
      (log! "  thread/init! called with :loadable-modules [\"screen.js\"]")
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
                      (js/setTimeout #(run-all-tests! strategy-num) 500))
                  (> elapsed 30000)
                  (do (log! (str "TIMEOUT waiting for workers. Peers: " (pr-str peers)))
                      (fail! "init:timeout" "workers ready" (pr-str peers))
                      (render-results!))
                  :else
                  (js/setTimeout check-ready 200))))]
        (js/setTimeout check-ready 500)))))
