(ns cljs-thread.runner.fat-kernel-test-browser
  "Browser integration tests for the fat-kernel strategy (Strategy 5).

   Proves that workers boot with the full cljs-thread runtime inlined
   in a blob — no importScripts, no two-phase boot, no Service Worker.
   The kernel source is auto-detected from <script> tags and fetched
   from browser cache.

   COOP/COEP headers required for SharedArrayBuffer support."
  (:require-macros [cljs-thread.core :refer [spawn in future pmap =>>]])
  (:require
   [cljs-thread.core :as thread]
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
;; Tests: Environment verification
;; ---------------------------------------------------------------------------

(defn test-environment []
  (log! "\n--- Fat Kernel Environment ---")
  (check "env:sab-available" true p/sab-sync?)
  (check "env:no-blocking" false (sync/no-blocking?))
  (check "env:in-screen" true (env/in-screen?)))

;; ---------------------------------------------------------------------------
;; Tests: Core operations via fat-kernel blob workers
;; ---------------------------------------------------------------------------

(defn test-in-basic []
  (log! "\n--- Fat Kernel Core Tests ---")
  (-> @(in :core (+ 10 20 12))
      (.then #(check "fk:in-basic" 42 %))
      (.catch #(fail! "fk:in-basic" 42 (str "error: " %)))))

(defn test-spawn-basic []
  (-> @(spawn (+ 21 21))
      (.then #(check "fk:spawn-basic" 42 %))
      (.catch #(fail! "fk:spawn-basic" 42 (str "error: " %)))))

(defn test-spawn-nested []
  ;; Nested @(spawn ...) dispatched to :core worker where IIFE-local aliases
  ;; from the worker-loaded module are accessible to eval'd stringified code.
  (-> @(in :core (cljs-thread.runner.fat-kernel-test-impl/test-spawn-nested))
      (.then #(check "fk:spawn-nested" 43 %))
      (.catch #(fail! "fk:spawn-nested" 43 (str "error: " %)))))

(defn test-conveyance []
  (let [x 10 y 32]
    (-> @(spawn (+ x y))
        (.then #(check "fk:conveyance" 42 %))
        (.catch #(fail! "fk:conveyance" 42 (str "error: " %))))))

(defn test-future-basic []
  (-> @(future (+ 100 200))
      (.then #(check "fk:future-basic" 300 %))
      (.catch #(fail! "fk:future-basic" 300 (str "error: " %)))))

(defn test-future-nested []
  (-> @(in :core (cljs-thread.runner.fat-kernel-test-impl/test-future-nested))
      (.then #(check "fk:future-nested" 6 %))
      (.catch #(fail! "fk:future-nested" 6 (str "error: " %)))))

(defn test-pmap-basic []
  (-> @(in :core (cljs-thread.runner.fat-kernel-test-impl/test-pmap-basic))
      (.then #(check "fk:pmap-basic" [2 3 4 5] %))
      (.catch #(fail! "fk:pmap-basic" [2 3 4 5] (str "error: " %)))))

(defn test-transducer []
  (-> @(in :core (cljs-thread.runner.fat-kernel-test-impl/test-transducer))
      (.then #(check "fk:transducer" 25 %))
      (.catch #(fail! "fk:transducer" 25 (str "error: " %)))))

(defn test-string-result []
  (-> @(in :core (str "hello " "world"))
      (.then #(check "fk:string-result" "hello world" %))
      (.catch #(fail! "fk:string-result" "hello world" (str "error: " %)))))

(defn test-collection-result []
  (-> @(in :core (mapv inc [1 2 3]))
      (.then #(check "fk:collection-result" [2 3 4] %))
      (.catch #(fail! "fk:collection-result" [2 3 4] (str "error: " %)))))

(defn test-nil-result []
  (-> @(in :core nil)
      (.then #(check "fk:nil-result" nil %))
      (.catch #(fail! "fk:nil-result" nil (str "error: " %)))))

;; ---------------------------------------------------------------------------
;; Tests: Performance characteristics
;; ---------------------------------------------------------------------------

(defn test-spawn-roundtrip-time []
  (log! "\n--- Performance ---")
  (let [start (.now js/performance)]
    (-> @(spawn 42)
        (.then (fn [_]
                 (let [elapsed (- (.now js/performance) start)]
                   (log! (str "FAT_KERNEL_SPAWN_RT: " (.toFixed elapsed 1) "ms"))
                   (check "perf:spawn-rt" true (< elapsed 5000)))))
        (.catch #(fail! "perf:spawn-rt" "< 5s" (str "error: " %))))))

(defn test-in-roundtrip-time []
  (let [start (.now js/performance)]
    (-> @(in :core 42)
        (.then (fn [_]
                 (let [elapsed (- (.now js/performance) start)]
                   (log! (str "FAT_KERNEL_IN_RT: " (.toFixed elapsed 1) "ms"))
                   (check "perf:in-rt" true (< elapsed 5000)))))
        (.catch #(fail! "perf:in-rt" "< 5s" (str "error: " %))))))

(defn test-future-roundtrip-time []
  (let [start (.now js/performance)]
    (-> @(future 42)
        (.then (fn [_]
                 (let [elapsed (- (.now js/performance) start)]
                   (log! (str "FAT_KERNEL_FUTURE_RT: " (.toFixed elapsed 1) "ms"))
                   (check "perf:future-rt" true (< elapsed 5000)))))
        (.catch #(fail! "perf:future-rt" "< 5s" (str "error: " %))))))

;; ---------------------------------------------------------------------------
;; Tests: URL-forward verification (Strategy 1 requirements)
;;
;; These tests verify the core Strategy 1 invariants:
;; 1. The kernel URL is a real server URL (http://), not a blob: URL.
;;    A blob: kernel URL would indicate source-text inlining is still active.
;; 2. The kernel URL is non-nil — detection succeeded.
;; 3. The kernel URL does not start with "blob:" — no source embedding.
;;
;; Together these prove: fat-kernel is using URL-forward, not source fetching.
;; ---------------------------------------------------------------------------

(defn test-url-forward []
  (log! "\n--- URL-Forward Verification ---")
  (let [url (fat-kernel/get-kernel-url)]
    (log! (str "  kernel-url: " (or url "nil")))
    ;; Requirement 1: detection succeeded — kernel URL must be non-nil
    (check "url:kernel-detected"
           true
           (some? url))
    ;; Requirement 2: must be a real server URL (http:// or https://)
    (check "url:kernel-is-http"
           true
           (boolean (and (string? url)
                         (or (.startsWith url "http://")
                             (.startsWith url "https://")))))
    ;; Requirement 3: must NOT be a blob: URL (which would mean source inlining)
    (check "url:kernel-not-blob"
           false
           (boolean (and (string? url) (.startsWith url "blob:"))))))

;; ---------------------------------------------------------------------------
;; Test runner
;; ---------------------------------------------------------------------------

(defn run-all-tests! []
  (log! "=== Fat Kernel Browser Tests ===")
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
        (.then test-conveyance)
        (.then test-future-basic)
        (.then test-future-nested)
        (.then test-pmap-basic)
        (.then test-transducer)
        (.then test-string-result)
        (.then test-collection-result)
        (.then test-nil-result)
        (.then test-spawn-roundtrip-time)
        (.then test-in-roundtrip-time)
        (.then test-future-roundtrip-time)
        (.then test-url-forward)
        ;; Done
        (.then (fn []
                 (js/clearTimeout timeout)
                 (log! "\nAll fat-kernel tests complete.")
                 (render-results!)))
        (.catch (fn [e]
                  (js/clearTimeout timeout)
                  (log! "FATAL:" (str e))
                  (swap! results update :fail inc)
                  (render-results!))))))

;; ---------------------------------------------------------------------------
;; Init — Fat Kernel strategy, NO Service Worker
;; ---------------------------------------------------------------------------

(defn init! []
  (when (env/in-screen?)
    (log! "Initializing fat-kernel browser tests...")
    (log! (str "  sab-sync?: " p/sab-sync?))

    ;; Install fat-kernel strategy — auto-detects kernel from <script> tags
    (fat-kernel/install!)

    ;; Init thread with NO sw-connect-string (SAB sync mode)
    (thread/init!
     {:core-connect-string "/core.js"})

    (log! "  thread/init! called with fat-kernel strategy")
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
