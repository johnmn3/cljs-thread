(ns cljs-thread.runner.sw-fallback-test-browser
  "Browser integration tests for the Service Worker fallback sync path.

   Two modes (selected via ?mode= query param):
   - 'pure'   (default): SAB genuinely unavailable (no COOP/COEP headers).
   - 'forced': SAB available but force-sw-sync! overrides to SW path.
     Served WITH COOP/COEP so SharedArrayBuffer works for data structures,
     but all inter-worker sync goes through the SW.

   The test verifies that sab-sync? is false (either because SAB is absent
   or because force-sw-sync! was called) and then exercises the full
   cljs-thread API: spawn, in, future, pmap, =>>, data types, nesting, etc."
  (:require-macros [cljs-thread.core :refer [spawn in future pmap =>>]])
  (:require
   [cljs-thread.core :as thread]
   [cljs-thread.env :as env]
   [cljs-thread.state :as s]
   [cljs-thread.platform :as p]
   [cljs-thread.sync :as sync]))

(enable-console-print!)

;; ---------------------------------------------------------------------------
;; Mode detection
;; ---------------------------------------------------------------------------

(defn- get-mode []
  (let [params (js/URLSearchParams. (.-search js/location))]
    (or (.get params "mode") "pure")))

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
;; Tests: Environment verification — MUST be in SW sync mode
;; ---------------------------------------------------------------------------

(defn test-environment []
  (log! "\n--- SW Fallback Environment ---")
  (check "env:sab-sync-disabled" false p/sab-sync?)
  (check "env:sw-configured" true (contains? @s/conf :sw-connect-string))
  (check "env:no-blocking" false (sync/no-blocking?))
  (check "env:in-screen" true (env/in-screen?)))

(defn test-sw-registered []
  (log! "\n--- SW Registration ---")
  (-> (js/navigator.serviceWorker.getRegistration)
      (.then (fn [reg]
               (check "sw:registered" true (some? reg))
               (check "sw:active" true (some? (when reg (.-active reg))))))
      (.catch (fn [e]
                (fail! "sw:registered" true (str "error: " e))))))

;; ---------------------------------------------------------------------------
;; Tests: Core operations via SW sync
;; ---------------------------------------------------------------------------

(defn test-spawn-basic []
  (log! "\n--- SW Fallback Core Tests ---")
  (-> @(spawn (+ 21 21))
      (.then #(check "sw:spawn-basic" 42 %))
      (.catch #(fail! "sw:spawn-basic" 42 (str "error: " %)))))

(defn test-spawn-nested []
  (-> @(spawn (+ 1 @(spawn (* 6 7))))
      (.then #(check "sw:spawn-nested" 43 %))
      (.catch #(fail! "sw:spawn-nested" 43 (str "error: " %)))))

(defn test-conveyance []
  (let [x 10 y 32]
    (-> @(spawn (+ x y))
        (.then #(check "sw:conveyance" 42 %))
        (.catch #(fail! "sw:conveyance" 42 (str "error: " %))))))

(defn test-in-named []
  (-> @(in :core (+ 10 20 12))
      (.then #(check "sw:in-named" 42 %))
      (.catch #(fail! "sw:in-named" 42 (str "error: " %)))))

(defn test-in-string-result []
  (-> @(in :core (str "hello " "world"))
      (.then #(check "sw:in-string" "hello world" %))
      (.catch #(fail! "sw:in-string" "hello world" (str "error: " %)))))

(defn test-in-collection-result []
  (-> @(in :core (mapv inc [1 2 3]))
      (.then #(check "sw:in-collection" [2 3 4] %))
      (.catch #(fail! "sw:in-collection" [2 3 4] (str "error: " %)))))

(defn test-in-nil-result []
  (-> @(in :core nil)
      (.then #(check "sw:in-nil" nil %))
      (.catch #(fail! "sw:in-nil" nil (str "error: " %)))))

(defn test-in-keyword-result []
  (-> @(in :core :some-keyword)
      (.then #(check "sw:in-keyword" :some-keyword %))
      (.catch #(fail! "sw:in-keyword" :some-keyword (str "error: " %)))))

(defn test-in-map-result []
  (-> @(in :core (assoc {} :a 1 :b [2 3] :c "hi"))
      (.then #(check "sw:in-map" {:a 1 :b [2 3] :c "hi"} %))
      (.catch #(fail! "sw:in-map" {:a 1 :b [2 3] :c "hi"} (str "error: " %)))))

(defn test-in-set-result []
  (-> @(in :core #{1 2 3})
      (.then #(check "sw:in-set" #{1 2 3} %))
      (.catch #(fail! "sw:in-set" #{1 2 3} (str "error: " %)))))

(defn test-in-boolean-result []
  (-> @(in :core true)
      (.then #(check "sw:in-true" true %))
      (.catch #(fail! "sw:in-true" true (str "error: " %)))))

(defn test-in-false-result []
  (-> @(in :core false)
      (.then #(check "sw:in-false" false %))
      (.catch #(fail! "sw:in-false" false (str "error: " %)))))

(defn test-future-basic []
  (-> @(future (+ 100 200))
      (.then #(check "sw:future-basic" 300 %))
      (.catch #(fail! "sw:future-basic" 300 (str "error: " %)))))

(defn test-future-nested []
  (-> @(future (+ 1 @(future (+ 2 3))))
      (.then #(check "sw:future-nested" 6 %))
      (.catch #(fail! "sw:future-nested" 6 (str "error: " %)))))

(defn test-future-with-data []
  (-> @(future (mapv #(* % %) (range 10)))
      (.then #(check "sw:future-data" [0 1 4 9 16 25 36 49 64 81] %))
      (.catch #(fail! "sw:future-data" [0 1 4 9 16 25 36 49 64 81] (str "error: " %)))))

(defn test-pmap-basic []
  (-> @(future (let [result (doall (pmap inc [1 2 3 4]))] result))
      (.then #(check "sw:pmap-basic" [2 3 4 5] (vec %)))
      (.catch #(fail! "sw:pmap-basic" [2 3 4 5] (str "error: " %)))))

(defn test-pmap-larger []
  (-> @(future (let [result (doall (pmap #(* % %) (range 8)))] result))
      (.then #(check "sw:pmap-larger" [0 1 4 9 16 25 36 49] (vec %)))
      (.catch #(fail! "sw:pmap-larger" [0 1 4 9 16 25 36 49] (str "error: " %)))))

(defn test-transducer []
  (-> @(=>> (range 10) (map inc) (filter odd?) (apply +))
      (.then #(check "sw:transducer" 25 %))
      (.catch #(fail! "sw:transducer" 25 (str "error: " %)))))

(defn test-transducer-with-comp []
  (-> @(=>> (range 10) (map (comp inc inc dec)) (apply +))
      (.then #(check "sw:transducer-comp" 55 %))
      (.catch #(fail! "sw:transducer-comp" 55 (str "error: " %)))))

;; ---------------------------------------------------------------------------
;; Tests: Stress — multiple sequential operations
;; ---------------------------------------------------------------------------

(defn test-sequential-spawns []
  (log! "\n--- SW Fallback Stress Tests ---")
  (let [n 10]
    (-> (reduce
         (fn [chain i]
           (.then chain
                  (fn [_]
                    (-> @(spawn (+ i 1))
                        (.then (fn [v]
                                 (check (str "sw:seq-spawn-" i) (+ i 1) v)))))))
         (js/Promise.resolve nil)
         (range n))
        (.catch #(fail! "sw:sequential-spawns" "10 spawns" (str "error: " %))))))

(defn test-sequential-ins []
  (let [n 10]
    (-> (reduce
         (fn [chain i]
           (.then chain
                  (fn [_]
                    (-> @(in :core (* i i))
                        (.then (fn [v]
                                 (check (str "sw:seq-in-" i) (* i i) v)))))))
         (js/Promise.resolve nil)
         (range n))
        (.catch #(fail! "sw:sequential-ins" "10 ins" (str "error: " %))))))

;; ---------------------------------------------------------------------------
;; Tests: Performance characteristics (SW is slower, ~4-10ms vs ~1-2ms)
;; ---------------------------------------------------------------------------

(defn test-spawn-roundtrip []
  (log! "\n--- SW Fallback Performance ---")
  (let [start (.now js/performance)]
    (-> @(spawn 42)
        (.then (fn [_]
                 (let [elapsed (- (.now js/performance) start)]
                   (log! (str "SW_SPAWN_RT: " (.toFixed elapsed 1) "ms"))
                   (check "perf:spawn-rt" true (< elapsed 10000)))))
        (.catch #(fail! "perf:spawn-rt" "< 10s" (str "error: " %))))))

(defn test-in-roundtrip []
  (let [start (.now js/performance)]
    (-> @(in :core 42)
        (.then (fn [_]
                 (let [elapsed (- (.now js/performance) start)]
                   (log! (str "SW_IN_RT: " (.toFixed elapsed 1) "ms"))
                   (check "perf:in-rt" true (< elapsed 10000)))))
        (.catch #(fail! "perf:in-rt" "< 10s" (str "error: " %))))))

(defn test-future-roundtrip []
  (let [start (.now js/performance)]
    (-> @(future 42)
        (.then (fn [_]
                 (let [elapsed (- (.now js/performance) start)]
                   (log! (str "SW_FUTURE_RT: " (.toFixed elapsed 1) "ms"))
                   (check "perf:future-rt" true (< elapsed 10000)))))
        (.catch #(fail! "perf:future-rt" "< 10s" (str "error: " %))))))

;; ---------------------------------------------------------------------------
;; Test runner
;; ---------------------------------------------------------------------------

(defn run-all-tests! []
  (log! "=== SW Fallback Browser Tests ===")
  (log! (str "Mode: " (get-mode)))
  (let [timeout (js/setTimeout
                 (fn []
                   (log! "TIMEOUT: tests took too long")
                   (fail! "timeout" "complete" "hung")
                   (render-results!))
                 120000)]
    (-> (js/Promise.resolve nil)
        (.then test-environment)
        (.then test-sw-registered)
        ;; Core operations
        (.then test-spawn-basic)
        (.then test-spawn-nested)
        (.then test-conveyance)
        (.then test-in-named)
        ;; Data type serialization
        (.then test-in-string-result)
        (.then test-in-collection-result)
        (.then test-in-nil-result)
        (.then test-in-keyword-result)
        (.then test-in-map-result)
        (.then test-in-set-result)
        (.then test-in-boolean-result)
        (.then test-in-false-result)
        ;; Futures
        (.then test-future-basic)
        (.then test-future-nested)
        (.then test-future-with-data)
        ;; Parallel primitives
        (.then test-pmap-basic)
        (.then test-pmap-larger)
        (.then test-transducer)
        (.then test-transducer-with-comp)
        ;; Stress
        (.then test-sequential-spawns)
        (.then test-sequential-ins)
        ;; Performance
        (.then test-spawn-roundtrip)
        (.then test-in-roundtrip)
        (.then test-future-roundtrip)
        ;; Done
        (.then (fn []
                 (js/clearTimeout timeout)
                 (log! "\nAll SW fallback tests complete.")
                 (render-results!)))
        (.catch (fn [e]
                  (js/clearTimeout timeout)
                  (log! "FATAL:" (str e))
                  (swap! results update :fail inc)
                  (render-results!))))))

;; ---------------------------------------------------------------------------
;; Init — SW fallback mode
;; ---------------------------------------------------------------------------

(defn init! []
  (when (env/in-screen?)
    (let [mode (get-mode)]
      (log! "Initializing SW fallback browser tests...")
      (log! (str "  mode: " mode))
      (log! (str "  SharedArrayBuffer available?: " (exists? js/SharedArrayBuffer)))

      ;; In "forced" mode, SAB is available but we force SW sync
      (when (= mode "forced")
        (log! "  Calling force-sw-sync! to override SAB sync...")
        (p/force-sw-sync!))

      (log! (str "  sab-sync?: " p/sab-sync?))

      ;; Init with SW fallback
      (thread/init!
       {:sw-connect-string  "/sw.js"
        :core-connect-string "/core.js"})

      (log! "  thread/init! called with SW fallback mode")
      (log! (str "  no-blocking?: " (sync/no-blocking?)))

      ;; Wait for SW registration + workers to be ready
      (let [start (.getTime (js/Date.))
            check-ready
            (fn check-ready []
              (let [elapsed (- (.getTime (js/Date.)) start)
                    peers (set (keys @s/peers))]
                (cond
                  (contains? peers :core)
                  (do (log! (str "Workers ready in " elapsed "ms. Peers: " (pr-str peers)))
                      ;; Give the future pool time to initialize
                      (js/setTimeout run-all-tests! 2000))

                  (> elapsed 30000)
                  (do (log! (str "TIMEOUT waiting for workers. Peers: " (pr-str peers)))
                      (fail! "init:timeout" "workers ready" (pr-str peers))
                      (render-results!))

                  :else
                  (js/setTimeout check-ready 200))))]
        (js/setTimeout check-ready 500)))))
