(ns cljs-thread.runner.direct-sab-test-browser
  "Screen-side entry point for direct SAB browser tests.

   Tests SharedArrayBuffer synchronization, eve atoms, and futures
   in a browser environment with web workers."
  (:require-macros [cljs-thread.core :refer [in]])
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

(defn render-results! []
  (let [{:keys [pass fail errors log]} @results
        status-el (.getElementById js/document "status")
        results-el (.getElementById js/document "results")
        all-pass? (and (pos? pass) (zero? fail))]
    (when status-el
      (set! (.-textContent status-el) (if all-pass? "ALL TESTS PASSED" "TESTS FAILED"))
      (set! (.-className status-el) (if all-pass? "pass" "fail")))
    (when results-el
      (set! (.-textContent results-el)
            (str pass " passed, " fail " failed\n"
                 (when (seq errors)
                   (apply str (map #(str "\nFAIL: " (:test %) " - " (:msg %))
                                   errors))))))
    ;; Signal to Playwright
    (set! js/window.__test_exit_code (if all-pass? 0 1))
    (set! js/window.__test_complete true)))

;; ---------------------------------------------------------------------------
;; Init
;; ---------------------------------------------------------------------------

(defn init! []
  (when (env/in-screen?)
    (log! "=== Direct SAB Browser Tests ===")
    (log! (str "  sab-sync?: " p/sab-sync?))

    ;; thread/init! auto-installs fat-kernel when SAB is available.
    (thread/init! {:core-connect-string "/core.js"})

    (log! "  thread/init! called")
    (log! (str "  no-blocking?: " (sync/no-blocking?)))

    ;; Wait for workers to be ready
    (let [start (.getTime (js/Date.))
          check-ready
          (fn check-ready []
            (let [elapsed (- (.getTime (js/Date.)) start)
                  peers (set (keys @s/peers))]
              (cond
                ;; Workers ready — dispatch tests to core
                (contains? peers :core)
                (do (log! (str "  Workers ready in " elapsed "ms. Peers: " (pr-str peers)))
                    ;; Dispatch test execution to :core worker
                    ;; Use thread-test-runner namespace (NOT the core init-fn namespace)
                    ;; to avoid module entry being moved to :shared
                    (js/setTimeout
                     (fn []
                       (log! "  Dispatching tests to :core worker...")
                       (try
                         (let [derefable (in :core (cljs-thread.runner.thread-test-runner/run-direct-sab-browser-suite!))
                               promise @derefable]
                           (-> promise
                               (.then (fn [result]
                                        (log! (str "  [screen] Got result: " (pr-str result)))
                                        (let [pass (or (:pass result) 0)
                                              fail (or (:fail result) 0)
                                              errors (or (:errors result) [])]
                                          (reset! results (merge @results
                                                                 {:pass pass :fail fail :errors errors}))
                                          (log! (str "\n=== " pass " passed, " fail " failed ==="))
                                          (render-results!))))
                               (.catch (fn [e]
                                         (log! (str "  [screen] Promise error: " e))
                                         (swap! results update :fail inc)
                                         (swap! results update :errors conj
                                                {:test "dispatch" :msg (str e)})
                                         (render-results!)))))
                         (catch :default e
                           (log! (str "  [screen] Dispatch error: " e))
                           (swap! results update :fail inc)
                           (render-results!))))
                     500))

                ;; Timeout
                (> elapsed 30000)
                (do (log! (str "  TIMEOUT waiting for workers. Peers: " (pr-str peers)))
                    (swap! results update :fail inc)
                    (swap! results update :errors conj
                           {:test "init:timeout" :msg (pr-str peers)})
                    (render-results!))

                ;; Still waiting
                :else
                (js/setTimeout check-ready 200))))]
      (js/setTimeout check-ready 500))))
