(ns cljs-thread.runner.thread-test-main
  "Unified, platform-agnostic test entry point for cljs-thread slab-tier tests.

   Initializes the slab allocator, then runs selected test namespaces.
   Works in both Node.js and browser environments.

   Node.js (via :node-script shadow target):
     node target/thread-test/all.js typed-array-sharing

   Browser (via :browser shadow target):
     Open target/thread-test-browser/index.html?suite=typed-array-sharing

   Note: Eve-internal tests (eve.map-test, eve.deftype-test, etc.) live in
   the eve repo and are run from there. Worker-tier tests (eve-smoke-test,
   eve-integration-test, etc.) require the fat kernel and run via the
   discovery-based test runner (clj -M:thread-test)."
  (:require
   [goog]
   [cljs.test :as t]
   [clojure.string :as str]
   [eve.deftype-proto.alloc :as eve-alloc]
   [eve.shared-atom :as a]
   [eve.data :as d]

   ;; ---- Pool reset modules (for isolated test namespace support) ----
   [eve.map :as eve-map]
   [eve.vec :as eve-vec]
   [eve.list :as eve-list]
   [eve.set :as eve-set]

   ;; ---- cljs-thread slab-tier test namespaces ----
   ;; (Only tests that do NOT require cljs-thread.core / fat kernel)
   [cljs-thread.typed-array-sharing-test :as typed-array-sharing-test]))

;; -----------------------------------------------------------------------------
;; Anti-DCE: Export symbols to prevent Closure from eliminating test vars.
;; -----------------------------------------------------------------------------
(goog/exportSymbol "cljs_thread.typed_array_sharing_test" typed-array-sharing-test)

;;-----------------------------------------------------------------------------
;; Isolated namespace support — reset slab pools before each isolated ns
;;-----------------------------------------------------------------------------

(defn- recycle-slab-env!
  "Fully recycle the slab test environment."
  []
  (eve-map/reset-pools!)
  (eve-vec/reset-pools!)
  (eve-list/reset-pools!)
  (eve-set/reset-pools!)
  (eve-alloc/reset-overflow-fns!)
  (set! a/*global-atom-instance*
        (a/atom-domain {})))

(def ^:private isolated-nss #{})

(defmethod t/report [::t/default :begin-test-ns] [m]
  (when (contains? isolated-nss (:ns m))
    (println "  Resetting slab pools for isolated namespace...")
    (recycle-slab-env!))
  (println (str "\nTesting " (:ns m))))

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

(defn- get-args []
  (if node?
    (vec (.slice js/process.argv 2))
    (let [params (js/URLSearchParams. (.-search js/location))
          suite (.get params "suite")]
      (if (and suite (not (str/blank? suite)))
        [suite]
        []))))

;;-----------------------------------------------------------------------------
;; Suite runner functions
;;-----------------------------------------------------------------------------

(defn- run-typed-array-sharing! []
  (t/run-tests 'cljs-thread.typed-array-sharing-test))

(defn- run-all! []
  (t/run-tests
    'cljs-thread.typed-array-sharing-test))

;;-----------------------------------------------------------------------------
;; Suite registry
;;-----------------------------------------------------------------------------

(def ^:private suite-runners
  {"typed-array-sharing" run-typed-array-sharing!
   "all"                 run-all!})

(def ^:private suite-names
  ["all" "typed-array-sharing"])

;;-----------------------------------------------------------------------------
;; Summary reporter
;;-----------------------------------------------------------------------------

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

(defmethod t/report [::t/default :summary] [{:keys [test pass fail error]}]
  (println)
  (println (str "Ran " test " tests containing "
                (+ pass fail error) " assertions."))
  (println (str fail " failures, " error " errors."))
  (update-dom! test pass fail error)
  (exit! (if (pos? (+ fail error)) 1 0)))

;;-----------------------------------------------------------------------------
;; Shared run logic
;;-----------------------------------------------------------------------------

(defn- run-suite! [suite-name]
  (if-let [run-fn (get suite-runners suite-name)]
    (do
      (println "=== Thread Test Runner ===")
      (println (str "Suite: " suite-name))
      (println)
      (println "Initializing slab allocator...")
      (-> (eve-alloc/init! :force true)
          (.then (fn [_]
                   (println "Slab allocator initialized.")
                   (set! d/*worker-id* 1)
                   (set! a/*global-atom-instance*
                         (a/atom-domain {}))
                   (println)
                   (run-fn)))
          (.catch (fn [e]
                    (println (str "ERROR: " (.-message e)))
                    (exit! 1)))))
    (do
      (println (str "Unknown suite: " suite-name))
      (println (str "Available: " (str/join ", " suite-names)))
      (exit! 1))))

;;-----------------------------------------------------------------------------
;; Entry points
;;-----------------------------------------------------------------------------

(defn main []
  (let [args (get-args)]
    (when (some #{":list" "--list" "--help" "-h"} args)
      (println "Available test suites:")
      (doseq [s suite-names]
        (println (str "  " s)))
      (println)
      (println "Usage:")
      (println "  node target/thread-test/all.js <suite>")
      (println "  node target/thread-test/all.js :list    # this help")
      (exit! 0))
    (run-suite! (or (first args) "all"))))

(defn init! []
  (let [args (get-args)
        suite (or (first args) "all")]
    (when-let [el (.getElementById js/document "status")]
      (set! (.-textContent el) (str "Running: " suite "..."))
      (set! (.-className el) "running"))
    (run-suite! suite)))
