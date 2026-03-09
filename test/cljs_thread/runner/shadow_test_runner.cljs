(ns cljs-thread.runner.shadow-test-runner
  "Custom test runner for shadow-cljs :node-test target.

   Initializes the EVE slab allocator before running tests, then delegates
   to shadow.test for test execution. This allows :advanced compilation
   to work since shadow.test registers tests at compile-time.

   Used via :runner-ns in shadow-cljs.edn :node-test targets."
  (:require
   [cljs.test :as ct]
   [shadow.test :as st]
   [shadow.test.node :as st-node]
   [cljs-thread.eve.deftype-proto.alloc :as eve-alloc]
   [cljs-thread.eve.shared-atom :as a]
   [cljs-thread.eve.data :as d]))

(defn init
  "Called by shadow-cljs before tests run. Initializes slab allocator."
  []
  (println "Initializing slab allocator...")
  (-> (eve-alloc/init! :force true)
      (.then (fn [_]
               (println "Slab allocator initialized.")
               ;; Bootstrap global atom for tests
               (set! d/*worker-id* 1)
               (set! a/*global-atom-instance*
                     (a/atom-domain {}))
               (println)))
      (.catch (fn [e]
                (println (str "ERROR initializing slab: " (.-message e)))
                (js/process.exit 1)))))

(defn run-all-tests
  "Run all registered tests."
  []
  ;; shadow.test/run-all-tests takes (env, regex-filter)
  ;; Test completion is reported via cljs.test multimethod, not callback
  (st/run-all-tests (ct/empty-env) nil))

(defn ^:export start
  "Entry point called by shadow-cljs :node-test runner."
  []
  ;; Load test data generated at compile-time by shadow-cljs
  (st-node/reset-test-data!)
  (-> (init)
      (.then (fn [_]
               (run-all-tests)))))
