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
   [eve.deftype-proto.alloc :as eve-alloc]
   [eve.shared-atom :as a]
   [eve.data :as d]

   ;; ---- Pool reset modules (for isolated test namespace support) ----
   [eve.map :as eve-map]
   [eve.vec :as eve-vec]
   [eve.list :as eve-list]
   [eve.set :as eve-set]

   ;; ---- All test namespaces (must be required so they compile) ----
   ;; Aliased explicitly to prevent DCE from removing deftest vars
   [eve.deftype-test :as deftype-test]
   [eve.array-test :as array-test]
   [eve.map-test :as map-test]
   [eve.vec-test :as vec-test]
   [eve.list-test :as list-test]
   [eve.set-test :as set-test]
   [eve.large-scale-test :as large-scale-test]
   [eve.epoch-gc-test :as epoch-gc-test]
   [eve.obj-test :as obj-test]
   [eve.batch2-validation-test :as batch2-test]
   [eve.batch3-validation-test :as batch3-test]
   [eve.batch4-validation-test :as batch4-test]
   [eve.deftype.int-map-test :as int-map-test]
   [eve.deftype.rb-tree-test :as rb-tree-test]
   [eve.typed-array-test :as typed-array-test]
   [cljs-thread.typed-array-sharing-test :as typed-array-sharing-test]
   [eve.mem-test :as mem-test]
   [eve.mem :as mem]
   [eve.mmap-test :as mmap-test]
   [eve.mmap-worker-test :as mmap-worker-test]
   [eve.mmap-slab-test :as mmap-slab-test]
   [eve.mmap-atom-test :as mmap-atom-test]
   [eve.mmap-atom-e2e-test :as mmap-atom-e2e-test]
   [eve.mmap-domain-test :as mmap-domain-test]))

;; -----------------------------------------------------------------------------
;; Anti-DCE: Export symbols to prevent Closure from eliminating test vars.
;; The :load-tests compiler option SHOULD handle this, but as a fallback we
;; use goog.exportSymbol to ensure test namespaces survive DCE.
;; -----------------------------------------------------------------------------
(goog/exportSymbol "eve.deftype_test" deftype-test)
(goog/exportSymbol "eve.array_test" array-test)
(goog/exportSymbol "eve.map_test" map-test)
(goog/exportSymbol "eve.vec_test" vec-test)
(goog/exportSymbol "eve.list_test" list-test)
(goog/exportSymbol "eve.set_test" set-test)
(goog/exportSymbol "eve.large_scale_test" large-scale-test)
(goog/exportSymbol "eve.epoch_gc_test" epoch-gc-test)
(goog/exportSymbol "eve.obj_test" obj-test)
(goog/exportSymbol "eve.batch2_validation_test" batch2-test)
(goog/exportSymbol "eve.batch3_validation_test" batch3-test)
(goog/exportSymbol "eve.batch4_validation_test" batch4-test)
(goog/exportSymbol "eve.deftype.int_map_test" int-map-test)
(goog/exportSymbol "eve.deftype.rb_tree_test" rb-tree-test)
(goog/exportSymbol "eve.typed_array_test" typed-array-test)
(goog/exportSymbol "cljs_thread.typed_array_sharing_test" typed-array-sharing-test)
(goog/exportSymbol "eve.mem_test" mem-test)
(goog/exportSymbol "eve.mmap_test" mmap-test)
(goog/exportSymbol "eve.mmap_worker_test" mmap-worker-test)
(goog/exportSymbol "eve.mmap_slab_test" mmap-slab-test)
(goog/exportSymbol "eve.mmap_atom_test" mmap-atom-test)
(goog/exportSymbol "eve.mmap_atom_e2e_test" mmap-atom-e2e-test)
(goog/exportSymbol "eve.mmap_domain_test" mmap-domain-test)

;;-----------------------------------------------------------------------------
;; Isolated namespace support — reset slab pools before each isolated ns
;; to prevent overflow OOM from accumulated allocations across test suites.
;;-----------------------------------------------------------------------------

(def ^:private isolated-nss
  "Test namespaces marked ^{:isolated true} that need a fresh slab environment."
  #{'eve.map-test
    'eve.vec-test
    'eve.list-test
    'eve.set-test
    'eve.large-scale-test})

(defn- recycle-slab-env!
  "Fully recycle the slab test environment: reset data-structure pools,
   clear stale overflow allocator ref, and create a fresh atom-domain.
   See alloc/reset-overflow-fns! for why the overflow ref must be cleared."
  []
  (eve-map/reset-pools!)
  (eve-vec/reset-pools!)
  (eve-list/reset-pools!)
  (eve-set/reset-pools!)
  (eve-alloc/reset-overflow-fns!)
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
  (t/run-tests 'eve.deftype-test))

(defn- run-array! []
  (t/run-tests 'eve.array-test))

(defn- run-slab! []
  (t/run-tests
    'eve.map-test
    'eve.vec-test
    'eve.list-test
    'eve.set-test))

(defn- run-large-scale! []
  (t/run-tests 'eve.large-scale-test))

(defn- run-epoch-gc! []
  (t/run-tests 'eve.epoch-gc-test))

(defn- run-obj! []
  (t/run-tests 'eve.obj-test))

(defn- run-batch2! []
  (t/run-tests 'eve.batch2-validation-test))

(defn- run-batch3! []
  (t/run-tests 'eve.batch3-validation-test))

(defn- run-batch4! []
  (t/run-tests 'eve.batch4-validation-test))

(defn- run-int-map! []
  (t/run-tests 'eve.deftype.int-map-test))

(defn- run-rb-tree! []
  (t/run-tests 'eve.deftype.rb-tree-test))

(defn- run-deftype! []
  (t/run-tests
    'eve.deftype-test
    'eve.deftype.int-map-test
    'eve.deftype.rb-tree-test))

(defn- run-validation! []
  (t/run-tests
    'eve.batch2-validation-test
    'eve.batch3-validation-test
    'eve.batch4-validation-test))

(defn- run-typed-array! []
  (t/run-tests 'eve.typed-array-test))

(defn- run-typed-array-sharing! []
  (t/run-tests 'cljs-thread.typed-array-sharing-test))

(defn- run-mem! []
  (t/run-tests 'eve.mem-test))

(defn- run-mmap! []
  (let [path (.resolve (js/require "path") "build/Release/mmap_cas.node")]
    (mem/load-native-addon! (js/require path)))
  (t/run-tests 'eve.mmap-test
               'eve.mmap-worker-test))

(defn- run-mmap-slab! []
  (let [path (.resolve (js/require "path") "build/Release/mmap_cas.node")]
    (mem/load-native-addon! (js/require path)))
  (eve-alloc/init-mmap-slab! 5 "/tmp/eve-p3-cls5.mem")
  (t/run-tests 'eve.mmap-slab-test))

(defn- run-mmap-atom! []
  (let [path (.resolve (js/require "path") "build/Release/mmap_cas.node")]
    (mem/load-native-addon! (js/require path)))
  (t/run-tests 'eve.mmap-atom-test))

(defn- run-mmap-atom-e2e! []
  (let [path (.resolve (js/require "path") "build/Release/mmap_cas.node")]
    (mem/load-native-addon! (js/require path)))
  ;; Note: NOT added to run-all! — mmap init conflicts with SAB-backed tests
  (t/run-tests 'eve.mmap-atom-e2e-test))

(defn- run-mmap-domain! []
  (let [path (.resolve (js/require "path") "build/Release/mmap_cas.node")]
    (mem/load-native-addon! (js/require path)))
  (t/run-tests 'eve.mmap-domain-test))

(defn- run-all! []
  ;; xray excluded — needs its own build (map/vec/list/set encoder
  ;; side-effects break xray's HAMT allocation). The JVM test runner
  ;; handles xray via a separate build target transparently.
  (t/run-tests
    'eve.deftype-test
    'eve.array-test
    'eve.map-test
    'eve.vec-test
    'eve.list-test
    'eve.set-test
    'eve.large-scale-test
    'eve.epoch-gc-test
    'eve.obj-test
    'eve.batch2-validation-test
    'eve.batch3-validation-test
    'eve.batch4-validation-test
    'eve.deftype.int-map-test
    'eve.deftype.rb-tree-test
    'eve.typed-array-test))

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
   "mem"         run-mem!
   "mmap"        run-mmap!
   "mmap-slab"   run-mmap-slab!
   "mmap-atom"     run-mmap-atom!
   "mmap-atom-e2e" run-mmap-atom-e2e!
   "mmap-domain"   run-mmap-domain!
   "all"           run-all!
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
   "typed-array" "typed-array-sharing" "mem" "mmap" "mmap-atom" "mmap-atom-e2e"
   "mmap-domain"])

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
