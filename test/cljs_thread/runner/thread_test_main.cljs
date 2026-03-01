(ns cljs-thread.runner.thread-test-main
  "Unified, platform-agnostic test entry point for all cljs-thread tests.

   Initializes the slab allocator, then runs selected test namespaces.
   Works in both Node.js and browser environments.

   Node.js (via :node-script shadow target):
     node target/thread-test/all.js slab

   Browser (via :browser shadow target):
     Open target/thread-test-browser/index.html?suite=slab

   Suite shortcuts expand to namespace lists. Raw namespace names also work."
  (:require
   [goog]
   [cljs.test :as t]
   [clojure.string :as str]
   [cljs-thread.eve.deftype-proto.alloc :as eve-alloc]
   [cljs-thread.eve.shared-atom :as a]
   [cljs-thread.eve.data :as d]

   ;; ---- Pool reset modules (for isolated test namespace support) ----
   [cljs-thread.eve.map :as eve-map]
   [cljs-thread.eve.vec :as eve-vec]
   [cljs-thread.eve.list :as eve-list]
   [cljs-thread.eve.set :as eve-set]

   ;; ---- All test namespaces (must be required so they compile) ----
   ;; Aliased explicitly to prevent DCE from removing deftest vars
   [cljs-thread.eve.deftype-test :as deftype-test]
   [cljs-thread.eve.array-test :as array-test]
   [cljs-thread.eve.map-test :as map-test]
   [cljs-thread.eve.vec-test :as vec-test]
   [cljs-thread.eve.list-test :as list-test]
   [cljs-thread.eve.set-test :as set-test]
   [cljs-thread.eve.large-scale-test :as large-scale-test]
   [cljs-thread.eve.epoch-gc-test :as epoch-gc-test]
   [cljs-thread.eve.obj-test :as obj-test]
   [cljs-thread.eve.batch2-validation-test :as batch2-test]
   [cljs-thread.eve.batch3-validation-test :as batch3-test]
   [cljs-thread.eve.batch4-validation-test :as batch4-test]
   [cljs-thread.eve.deftype.int-map-test :as int-map-test]
   [cljs-thread.eve.deftype.rb-tree-test :as rb-tree-test]
   [cljs-thread.eve.typed-array-test :as typed-array-test]
   [cljs-thread.typed-array-sharing-test :as typed-array-sharing-test]))

;; -----------------------------------------------------------------------------
;; Anti-DCE: Export symbols to prevent Closure from eliminating test vars.
;; The :load-tests compiler option SHOULD handle this, but as a fallback we
;; use goog.exportSymbol to ensure test namespaces survive DCE.
;; -----------------------------------------------------------------------------
(goog/exportSymbol "cljs_thread.eve.deftype_test" deftype-test)
(goog/exportSymbol "cljs_thread.eve.array_test" array-test)
(goog/exportSymbol "cljs_thread.eve.map_test" map-test)
(goog/exportSymbol "cljs_thread.eve.vec_test" vec-test)
(goog/exportSymbol "cljs_thread.eve.list_test" list-test)
(goog/exportSymbol "cljs_thread.eve.set_test" set-test)
(goog/exportSymbol "cljs_thread.eve.large_scale_test" large-scale-test)
(goog/exportSymbol "cljs_thread.eve.epoch_gc_test" epoch-gc-test)
(goog/exportSymbol "cljs_thread.eve.obj_test" obj-test)
(goog/exportSymbol "cljs_thread.eve.batch2_validation_test" batch2-test)
(goog/exportSymbol "cljs_thread.eve.batch3_validation_test" batch3-test)
(goog/exportSymbol "cljs_thread.eve.batch4_validation_test" batch4-test)
(goog/exportSymbol "cljs_thread.eve.deftype.int_map_test" int-map-test)
(goog/exportSymbol "cljs_thread.eve.deftype.rb_tree_test" rb-tree-test)
(goog/exportSymbol "cljs_thread.eve.typed_array_test" typed-array-test)
(goog/exportSymbol "cljs_thread.typed_array_sharing_test" typed-array-sharing-test)

;;-----------------------------------------------------------------------------
;; Isolated namespace support — reset slab pools before each isolated ns
;; to prevent overflow OOM from accumulated allocations across test suites.
;;-----------------------------------------------------------------------------

(def ^:private isolated-nss
  "Test namespaces marked ^{:isolated true} that need a fresh slab environment."
  #{'cljs-thread.eve.map-test
    'cljs-thread.eve.vec-test
    'cljs-thread.eve.list-test
    'cljs-thread.eve.set-test
    'cljs-thread.eve.large-scale-test})

(defn- recycle-slab-env!
  "Fully recycle the slab test environment: reset data-structure pools,
   clear stale overflow allocator ref, and create a fresh atom-domain.
   See alloc/reset-legacy-env! for why the overflow ref must be cleared."
  []
  (eve-map/reset-pools!)
  (eve-vec/reset-pools!)
  (eve-list/reset-pools!)
  (eve-set/reset-pools!)
  (eve-alloc/reset-legacy-env!)
  (set! a/*global-atom-instance*
        (a/atom-domain {})))

(defmethod t/report [::t/default :begin-test-ns] [m]
  (when (contains? isolated-nss (:ns m))
    (println "  Resetting slab pools for isolated namespace...")
    (recycle-slab-env!))
  (println (str "\nTesting " (:ns m))))

;;-----------------------------------------------------------------------------
;; Platform detection
;;-----------------------------------------------------------------------------

(def ^:private node?
  "True when running in Node.js."
  (and (exists? js/process) (exists? js/process.versions)))

(defn- exit!
  "Signal test completion. Node: process.exit. Browser: set globals for
   Playwright to read, and update DOM."
  [code]
  (if node?
    (js/process.exit code)
    (do
      (set! js/window.__test_exit_code code)
      (set! js/window.__test_complete true))))

(defn- get-args
  "Get CLI args. Node: process.argv. Browser: URL search params."
  []
  (if node?
    (vec (.slice js/process.argv 2))
    (let [params (js/URLSearchParams. (.-search js/location))
          suite (.get params "suite")]
      (if (and suite (not (str/blank? suite)))
        [suite]
        []))))

;;-----------------------------------------------------------------------------
;; Suite runner functions
;; (cljs.test/run-tests is a macro — must be called at compile time,
;;  so each suite gets its own function with the namespaces baked in.)
;;-----------------------------------------------------------------------------

(defn- run-core! []
  (t/run-tests 'cljs-thread.eve.deftype-test))

(defn- run-array! []
  (t/run-tests 'cljs-thread.eve.array-test))

(defn- run-slab! []
  (t/run-tests
    'cljs-thread.eve.map-test
    'cljs-thread.eve.vec-test
    'cljs-thread.eve.list-test
    'cljs-thread.eve.set-test))

(defn- run-large-scale! []
  (t/run-tests 'cljs-thread.eve.large-scale-test))

(defn- run-epoch-gc! []
  (t/run-tests 'cljs-thread.eve.epoch-gc-test))

(defn- run-obj! []
  (t/run-tests 'cljs-thread.eve.obj-test))

(defn- run-batch2! []
  (t/run-tests 'cljs-thread.eve.batch2-validation-test))

(defn- run-batch3! []
  (t/run-tests 'cljs-thread.eve.batch3-validation-test))

(defn- run-batch4! []
  (t/run-tests 'cljs-thread.eve.batch4-validation-test))

(defn- run-int-map! []
  (t/run-tests 'cljs-thread.eve.deftype.int-map-test))

(defn- run-rb-tree! []
  (t/run-tests 'cljs-thread.eve.deftype.rb-tree-test))

(defn- run-deftype! []
  (t/run-tests
    'cljs-thread.eve.deftype-test
    'cljs-thread.eve.deftype.int-map-test
    'cljs-thread.eve.deftype.rb-tree-test))

(defn- run-validation! []
  (t/run-tests
    'cljs-thread.eve.batch2-validation-test
    'cljs-thread.eve.batch3-validation-test
    'cljs-thread.eve.batch4-validation-test))

(defn- run-typed-array! []
  (t/run-tests 'cljs-thread.eve.typed-array-test))

(defn- run-typed-array-sharing! []
  (t/run-tests 'cljs-thread.typed-array-sharing-test))

(defn- run-all! []
  ;; xray excluded — needs its own build (map/vec/list/set encoder
  ;; side-effects break xray's HAMT allocation). The JVM test runner
  ;; handles xray via a separate build target transparently.
  (t/run-tests
    'cljs-thread.eve.deftype-test
    'cljs-thread.eve.array-test
    'cljs-thread.eve.map-test
    'cljs-thread.eve.vec-test
    'cljs-thread.eve.list-test
    'cljs-thread.eve.set-test
    'cljs-thread.eve.large-scale-test
    'cljs-thread.eve.epoch-gc-test
    'cljs-thread.eve.obj-test
    'cljs-thread.eve.batch2-validation-test
    'cljs-thread.eve.batch3-validation-test
    'cljs-thread.eve.batch4-validation-test
    'cljs-thread.eve.deftype.int-map-test
    'cljs-thread.eve.deftype.rb-tree-test
    'cljs-thread.eve.typed-array-test))

;;-----------------------------------------------------------------------------
;; Suite registry
;;-----------------------------------------------------------------------------

(def ^:private suite-runners
  {"core"        run-core!
   "array"       run-array!
   "slab"        run-slab!
   "large-scale" run-large-scale!
   "epoch-gc"    run-epoch-gc!
   "obj"         run-obj!
   "batch2"      run-batch2!
   "batch3"      run-batch3!
   "batch4"      run-batch4!
   "int-map"     run-int-map!
   "rb-tree"     run-rb-tree!
   "deftype"     run-deftype!
   "validation"  run-validation!
   "typed-array" run-typed-array!
   "typed-array-sharing" run-typed-array-sharing!
   "all"         run-all!
   ;; Short-name aliases for individual test namespaces
   "map-test"        run-slab!
   "vec-test"        run-slab!
   "list-test"       run-slab!
   "set-test"        run-slab!
   "deftype-test"    run-core!
   "array-test"      run-array!
   "epoch-gc-test"   run-epoch-gc!})

(def ^:private suite-names
  "Suites shown in :list (excludes aliases)."
  ["all" "core" "array" "slab" "large-scale" "epoch-gc" "xray" "obj"
   "deftype" "int-map" "rb-tree" "batch2" "batch3" "batch4" "validation"
   "typed-array" "typed-array-sharing"])

;;-----------------------------------------------------------------------------
;; Summary reporter — platform-agnostic
;;-----------------------------------------------------------------------------

(defn- update-dom!
  "Update browser DOM with test results (no-op on Node)."
  [test pass fail error]
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

(defn- run-suite!
  "Resolve suite name, init slabs, run tests. Works on any platform."
  [suite-name]
  (if-let [run-fn (get suite-runners suite-name)]
    (do
      (println "=== Thread Test Runner ===")
      (println (str "Suite: " suite-name))
      (println)
      (println "Initializing slab allocator...")
      (-> (eve-alloc/init! :force true)
          (.then (fn [_]
                   (println "Slab allocator initialized.")
                   ;; Bootstrap global atom for all tests
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

(defn main
  "Node.js entry point (called by :node-script target)."
  []
  (let [args (get-args)]
    ;; :list / --list / --help
    (when (or (some #{":list" "--list" "--help" "-h"} args))
      (println "Available test suites:")
      (doseq [s suite-names]
        (println (str "  " s)))
      (println)
      (println "Usage:")
      (println "  clj -M:thread-test slab              # run slab tests (default: playwright)")
      (println "  clj -M:thread-test :node slab        # run via node")
      (println "  clj -M:thread-test :browser slab     # run in browser")
      (println "  clj -M:thread-test :playwright slab  # run headless (default)")
      (println "  clj -M:thread-test :list             # this help")
      (exit! 0))

    (run-suite! (or (first args) "all"))))

(defn init!
  "Browser entry point (called by :browser target init-fn).
   Suite comes from URL query param: ?suite=slab"
  []
  (let [args (get-args)
        suite (or (first args) "all")]
    ;; Update DOM to show loading state
    (when-let [el (.getElementById js/document "status")]
      (set! (.-textContent el) (str "Running: " suite "..."))
      (set! (.-className el) "running"))
    (run-suite! suite)))
