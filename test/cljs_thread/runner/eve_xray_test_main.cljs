(ns cljs-thread.runner.eve-xray-test-main
  "Browser entry point for xray stress test.

   Separate from the omnibus test_main because xray needs a clean namespace
   set — loading map/vec/list/set registers type encoders that change HAMT
   allocation routing, causing DataView bounds errors in xray's atom-domain."
  (:require
   [cljs.test :as t]
   [cljs-thread.eve.xray-stress-test]))

;;-----------------------------------------------------------------------------
;; Platform detection
;;-----------------------------------------------------------------------------

(def ^:private node?
  (and (exists? js/process) (exists? js/process.versions)))

(defn- exit! [code]
  (if node?
    (js/process.exit code)
    (do
      (set! js/window.__test_exit_code code)
      (set! js/window.__test_complete true))))

(defn- update-dom! [test pass fail error]
  (when-not node?
    (let [total (+ pass fail error)
          ok? (zero? (+ fail error))
          summary (str "Ran " test " tests containing " total " assertions.\n"
                       fail " failures, " error " errors.")]
      (when-let [el (.getElementById js/document "status")]
        (set! (.-textContent el) (if ok? "ALL TESTS PASSED" "TESTS FAILED"))
        (set! (.-className el) (if ok? "pass" "fail")))
      (when-let [el (.getElementById js/document "results")]
        (set! (.-textContent el) summary)))))

;;-----------------------------------------------------------------------------
;; Reporter
;;-----------------------------------------------------------------------------

(defmethod t/report [::t/default :summary] [{:keys [test pass fail error]}]
  (println)
  (println (str "Ran " test " tests containing "
                (+ pass fail error) " assertions."))
  (println (str fail " failures, " error " errors."))
  (update-dom! test pass fail error)
  (exit! (if (pos? (+ fail error)) 1 0)))

;;-----------------------------------------------------------------------------
;; Entry point
;;-----------------------------------------------------------------------------

(defn init!
  "Browser entry point (called by :browser target init-fn)."
  []
  (when-not node?
    (when-let [el (.getElementById js/document "status")]
      (set! (.-textContent el) "Running: xray...")
      (set! (.-className el) "running")))
  (println "=== Eve Test Runner ===")
  (println "Suite: xray")
  (println)
  (t/run-tests 'cljs-thread.eve.xray-stress-test))
