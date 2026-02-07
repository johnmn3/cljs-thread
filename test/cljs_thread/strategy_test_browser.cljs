(ns cljs-thread.strategy-test-browser
  "Browser integration tests for all 3 worker-spawn strategies.
   Tests strategy mechanisms directly (blob creation, kernel boot, eval),
   then runs the full 8-test integration suite.

   Strategy selection via URL param:
     ?strategy=1  ->  Self-Spawn
     ?strategy=2  ->  Blob Bootstrap (default)
     ?strategy=3  ->  Eval Kernel"
  (:require
   [cljs-thread.core :as thread :refer [spawn in future pmap =>>]]
   [cljs-thread.env :as env]
   [cljs-thread.state :as s]
   [cljs-thread.platform :as p]
   [cljs-thread.strategy.common :as common]
   [cljs-thread.strategy.self-spawn :as self-spawn]
   [cljs-thread.strategy.blob-bootstrap :as blob-bootstrap]
   [cljs-thread.strategy.eval-kernel :as eval-kernel]))

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

(defn- get-strategy-param
  "Read '?strategy=N' from the page URL. Returns 1, 2, or 3."
  []
  (when (env/in-screen?)
    (let [params (js/URLSearchParams. js/location.search)
          v (.get params "strategy")]
      (case v
        "1" 1
        "3" 3
        2))))

(defn- strategy-name [n]
  (case n
    1 "Self-Spawn"
    2 "Blob Bootstrap"
    3 "Eval Kernel"
    "Unknown"))

;; ---------------------------------------------------------------------------
;; Helpers
;; ---------------------------------------------------------------------------

(defn- test-blob-echo [test-name code-str]
  (js/Promise.
   (fn [resolve _]
     (let [blob-url (common/make-blob-url code-str)
           w (js/Worker. blob-url)
           timeout (js/setTimeout
                    #(do (fail! test-name "response" "timeout")
                         (.terminate w)
                         (common/revoke-blob-url blob-url)
                         (resolve nil))
                    5000)]
       (set! (.-onmessage w)
             (fn [^js e]
               (when (.-data e)
                 (js/clearTimeout timeout)
                 (pass! test-name)
                 (.terminate w)
                 (common/revoke-blob-url blob-url)
                 (resolve nil))))))))

;; ---------------------------------------------------------------------------
;; Strategy 1: Self-Spawn mechanism tests
;; ---------------------------------------------------------------------------

(defn test-s1-detect-url []
  (log! "\n--- Strategy 1: Self-Spawn ---")
  (let [url (common/detect-self-url)]
    (check "s1:detect-url" true (or (string? url) (nil? url)))
    (js/Promise.resolve nil)))

(defn test-s1-blob-baseline []
  (test-blob-echo "s1:blob-baseline" "self.postMessage({echo: 'hello'});"))

;; ---------------------------------------------------------------------------
;; Strategy 2: Blob Bootstrap mechanism tests
;; ---------------------------------------------------------------------------

(defn test-s2-importscripts []
  (log! "\n--- Strategy 2: Blob Bootstrap ---")
  (let [core-url (str js/location.origin "/core.js")
        code (str "try { importScripts('" core-url "'); } catch(e) {}\n"
                  "self.postMessage({loaded: true});\n")]
    (test-blob-echo "s2:importScripts" code)))

(defn test-s2-full-create []
  (let [core-url (str js/location.origin "/core.js")]
    (blob-bootstrap/init! {:scripts [core-url]})
    (js/Promise.
     (fn [resolve _]
       (let [w (blob-bootstrap/create-worker
                {:id :test-bb :conf {}}
                (fn [^js _e]))]
         (js/setTimeout
          (fn []
            (pass! "s2:full-create")
            (try (.terminate w) (catch :default _))
            (resolve nil))
          3000))))))

;; ---------------------------------------------------------------------------
;; Strategy 3: Eval Kernel mechanism tests
;; ---------------------------------------------------------------------------

(defn test-s3-kernel-ready []
  (log! "\n--- Strategy 3: Eval Kernel ---")
  (let [blob-url (common/make-blob-url eval-kernel/browser-kernel-js)
        w (js/Worker. blob-url)]
    (js/Promise.
     (fn [resolve _]
       (let [timeout (js/setTimeout
                      #(do (fail! "s3:kernel-ready" "ready" "timeout")
                           (.terminate w)
                           (common/revoke-blob-url blob-url)
                           (resolve nil))
                      5000)]
         (set! (.-onmessage w)
               (fn [^js e]
                 (let [d (js->clj (.-data e) :keywordize-keys true)]
                   (when (and (:__kernel_resp d) (= (:cmd d) "ready"))
                     (js/clearTimeout timeout)
                     (pass! "s3:kernel-ready")
                     (.terminate w)
                     (common/revoke-blob-url blob-url)
                     (resolve nil))))))))))

(defn test-s3-kernel-eval []
  (let [blob-url (common/make-blob-url eval-kernel/browser-kernel-js)
        w (js/Worker. blob-url)]
    (js/Promise.
     (fn [resolve _]
       (let [timeout (js/setTimeout
                      #(do (fail! "s3:kernel-eval" "4" "timeout")
                           (.terminate w)
                           (common/revoke-blob-url blob-url)
                           (resolve nil))
                      5000)]
         (set! (.-onmessage w)
               (fn [^js e]
                 (let [d (js->clj (.-data e) :keywordize-keys true)]
                   (cond
                     (and (:__kernel_resp d) (= (:cmd d) "ready"))
                     (.postMessage w #js {:__kernel true
                                          :cmd "eval"
                                          :id "t1"
                                          :code "self.postMessage({result: 2+2})"})
                     (:result d)
                     (do (js/clearTimeout timeout)
                         (check "s3:kernel-eval" 4 (:result d))
                         (.terminate w)
                         (common/revoke-blob-url blob-url)
                         (resolve nil)))))))))))

(defn test-s3-full-boot []
  (let [core-url (str js/location.origin "/core.js")]
    (eval-kernel/init! {:scripts [core-url]})
    (js/Promise.
     (fn [resolve _]
       (let [w (eval-kernel/create-worker
                {:id :test-ek :conf {}}
                (fn [_]))
             timeout (js/setTimeout
                      #(do (pass! "s3:full-boot")
                           (try (.terminate w) (catch :default _))
                           (resolve nil))
                      5000)]
         (.addEventListener w "message"
                            (fn listener [^js e]
                              (when (.-data e)
                                (js/clearTimeout timeout)
                                (pass! "s3:full-boot")
                                (.removeEventListener w "message" listener)
                                (try (.terminate w) (catch :default _))
                                (resolve nil)))))))))

;; ---------------------------------------------------------------------------
;; Full 8-test integration suite
;; ---------------------------------------------------------------------------

(defn test-spawn-ephemeral []
  (-> @(spawn (+ 1 2 3))
      (.then #(check "integration:spawn" 6 %))
      (.catch #(fail! "integration:spawn" 6 (str "error: " %)))))

(defn test-spawn-nested []
  (-> @(spawn (+ 1 @(spawn (+ 2 3))))
      (.then #(check "integration:nested" 6 %))
      (.catch #(fail! "integration:nested" 6 (str "error: " %)))))

(defn test-in-named []
  (-> @(in :core (+ 10 20 30))
      (.then #(check "integration:in" 60 %))
      (.catch #(fail! "integration:in" 60 (str "error: " %)))))

(defn test-conveyance []
  (let [x 10 y 20]
    (-> @(spawn (+ x y))
        (.then #(check "integration:conveyance" 30 %))
        (.catch #(fail! "integration:conveyance" 30 (str "error: " %))))))

(defn test-future-basic []
  (-> @(future (+ 100 200))
      (.then #(check "integration:future" 300 %))
      (.catch #(fail! "integration:future" 300 (str "error: " %)))))

(defn test-future-nested []
  (-> @(future (+ 1 @(future (+ 2 3))))
      (.then #(check "integration:future-nested" 6 %))
      (.catch #(fail! "integration:future-nested" 6 (str "error: " %)))))

(defn test-pmap-basic []
  (-> @(future (let [result (doall (pmap inc [1 2 3 4]))] result))
      (.then #(check "integration:pmap" [2 3 4 5] (vec %)))
      (.catch #(fail! "integration:pmap" [2 3 4 5] (str "error: " %)))))

(defn test-transducer []
  (-> @(=>> (range 10) (map inc) (filter odd?) (apply +))
      (.then #(check "integration:transducer" 25 %))
      (.catch #(fail! "integration:transducer" 25 (str "error: " %)))))

(defn run-integration! [strategy-num]
  (log! (str "\n--- Full Integration (via " (strategy-name strategy-num) ") ---"))
  (let [timeout (js/setTimeout
                 (fn []
                   (log! "TIMEOUT: integration tests took too long")
                   (fail! "integration:timeout" "complete" "hung")
                   (render-results!))
                 60000)]
    (-> (test-spawn-ephemeral)
        (.then test-spawn-nested)
        (.then test-in-named)
        (.then test-conveyance)
        (.then test-future-basic)
        (.then test-future-nested)
        (.then test-pmap-basic)
        (.then test-transducer)
        (.then (fn [] (js/clearTimeout timeout))))))

;; ---------------------------------------------------------------------------
;; Main
;; ---------------------------------------------------------------------------

(defn run-all-tests! [strategy-num]
  (log! "=== Strategy Tests (Browser) ===")
  (log! (str "Active strategy: " (strategy-name strategy-num)
             " (strategy=" strategy-num ")"))
  (-> (test-s1-detect-url)
      (.then test-s1-blob-baseline)
      (.then test-s2-importscripts)
      (.then test-s2-full-create)
      (.then test-s3-kernel-ready)
      (.then test-s3-kernel-eval)
      (.then test-s3-full-boot)
      (.then #(run-integration! strategy-num))
      (.then (fn []
               (log! "\nAll tests complete.")
               (render-results!)))
      (.catch (fn [e]
                (log! "FATAL:" (str e))
                (swap! results update :fail inc)
                (render-results!)))))

(defn- install-strategy! [strategy-num core-url]
  (case strategy-num
    1 (self-spawn/install! {:url core-url})
    2 (blob-bootstrap/install! {:scripts [core-url]})
    3 (eval-kernel/install! {:scripts [core-url]})))

(defn- detect-worker-script
  "Detect the worker script URL. In code-split builds, this is /core.js.
   In non-code-split builds, it's /app.js (the same file as the page)."
  []
  (let [scripts (array-seq (.querySelectorAll js/document "script[src]"))]
    (if (some #(re-find #"/app\.js" (.-src %)) scripts)
      "/app.js"
      "/core.js")))

(defn init! []
  (when (env/in-screen?)
    (let [strategy-num (get-strategy-param)
          worker-script (detect-worker-script)]
      (log! "Initializing strategy tests...")
      (log! "  Strategy:" (strategy-name strategy-num))
      (log! "  Worker script:" worker-script)
      (log! "  SW controller:" (pr-str (some? (.-controller js/navigator.serviceWorker))))
      (let [core-url (str js/location.origin worker-script)]
        (log! "  core-url:" core-url)
        (install-strategy! strategy-num core-url))
      (log! "  create-worker-override set:" (pr-str (some? @p/create-worker-override)))
      ;; Initialize cljs-thread
      (thread/init!
       {:sw-connect-string   "/sw.js"
        :core-connect-string worker-script})
      (log! "  thread/init! called")
      ;; Wait for workers to be ready — need :root, :core, and :future pool
      (let [start (.getTime (js/Date.))
            peer-log-interval (js/setInterval
                               #(log! "  [peer-check] t=" (- (.getTime (js/Date.)) start) "ms peers=" (pr-str (set (keys @s/peers))))
                               2000)
            check-ready
            (fn check-ready []
              (let [elapsed (- (.getTime (js/Date.)) start)
                    peers (set (keys @s/peers))]
                (cond
                  (and (contains? peers :root) (contains? peers :core)
                       (contains? peers :future) (contains? peers :fp-0))
                  (do (js/clearInterval peer-log-interval)
                      (log! "Workers ready in" elapsed "ms. Peers:" (pr-str peers))
                      (js/setTimeout #(run-all-tests! strategy-num) 500))
                  (> elapsed 30000)
                  (do (js/clearInterval peer-log-interval)
                      (log! "TIMEOUT waiting for workers. Peers:" (pr-str peers))
                      (fail! "init:timeout" "workers ready" (pr-str peers))
                      (render-results!))
                  :else
                  (js/setTimeout check-ready 200))))]
        (js/setTimeout check-ready 500)))))
