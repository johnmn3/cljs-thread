(ns cljs-thread.runner.dom-proxy-test-browser
  "Screen-side entry point for DOM proxy browser tests.

   Calls `thread/init!` (which auto-installs fat-kernel when SAB is available)
   and requires `dom.registry` (which auto-initializes the handle registry
   at namespace load time on the screen thread).

   The :core worker has dom.proxy installed and runs the actual tests
   by making DOM operations through the proxy. The proxy uses
   `(in :screen ...)` to execute real DOM operations on this thread.

   Results are collected and rendered to the page + Playwright globals."
  (:require-macros [cljs-thread.core :refer [in]])
  (:require
   [cljs-thread.core :as thread]
   [cljs-thread.env :as env]
   [cljs-thread.state :as s]
   [cljs-thread.platform :as p]
   [cljs-thread.sync :as sync]
   [cljs-thread.dom.registry :as dom-reg]  ;; auto-inits on screen
   [cljs-thread.dom.executor]))

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
                   (apply str (map #(str "\nFAIL: " (:test %) " expected=" (pr-str (:expected %))
                                         " actual=" (pr-str (:actual %)))
                                   errors))))))
    ;; Signal to Playwright
    (set! js/window.__test_exit_code (if all-pass? 0 1))
    (set! js/window.__test_complete true)))

;; ---------------------------------------------------------------------------
;; Init
;; ---------------------------------------------------------------------------

(defn init! []
  (when (env/in-screen?)
    (log! "=== DOM Proxy Browser Tests ===")
    (log! (str "  sab-sync?: " p/sab-sync?))
    (log! (str "  DOM registry initialized, " (dom-reg/registered-count) " handles"))

    ;; thread/init! auto-installs fat-kernel when SAB is available.
    ;; dom.registry auto-initializes at namespace load time.
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
                ;; Workers ready — run tests
                (contains? peers :core)
                (do (log! (str "  Workers ready in " elapsed "ms. Peers: " (pr-str peers)))
                    ;; Dispatch test execution to :core worker
                    (js/setTimeout
                     (fn []
                       (log! "  Dispatching tests to :core worker...")
                       (try
                         (let [derefable (in :core (cljs-thread.dom.test/run-all!))
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
                                                {:test "dispatch" :expected "success" :actual (str e)})
                                         (render-results!)))))
                         (catch :default e
                           (log! (str "  [screen] Dispatch error: " e))
                           (swap! results update :fail inc)
                           (render-results!)))
                       ;; Fallback: poll for test completion via window property
                       ;; The core worker sets window.__dom_proxy_test_done = "pass:fail"
                       ;; via the DOM proxy after tests complete
                       (let [check-done
                             (fn check-done []
                               (when-not js/window.__test_complete
                                 (let [done-val js/window.__dom_proxy_test_done]
                                   (if (and done-val (string? done-val))
                                     (let [parts (.split done-val ":")
                                           pass (js/parseInt (aget parts 0) 10)
                                           fail (js/parseInt (aget parts 1) 10)]
                                       (log! (str "  [screen] Detected via proxy: " pass " passed, " fail " failed"))
                                       (reset! results {:pass pass :fail fail :errors [] :log (:log @results)})
                                       (render-results!))
                                     (js/setTimeout check-done 500)))))]
                         (js/setTimeout check-done 2000)))
                     500))

                ;; Timeout
                (> elapsed 30000)
                (do (log! (str "  TIMEOUT waiting for workers. Peers: " (pr-str peers)))
                    (swap! results update :fail inc)
                    (swap! results update :errors conj
                           {:test "init:timeout" :expected "workers ready" :actual (pr-str peers)})
                    (render-results!))

                ;; Still waiting
                :else
                (js/setTimeout check-ready 200))))]
      (js/setTimeout check-ready 500))))
