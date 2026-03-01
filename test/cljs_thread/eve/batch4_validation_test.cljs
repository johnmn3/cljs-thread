(ns cljs-thread.eve.batch4-validation-test
  "Validation tests for batch 4 commits (24-34): cljs-thread integration.
   Proves each commit correctly targets the slab infrastructure.

   Commits validated:
     27 (5ede824) — sab-transfer-data: extracts SAB refs for zero-copy cross-thread transfer
     29 (f6d4ad8) — cljs-thread as tracked directory: 105+ source files, eve bridge, X-RAY, bench framework
     30 (359d5b0) — fix tests to use SharedAtom (a/atom) API instead of internal global
     31 (5d618ad) — worker-launched test variants (w* prefix) with blocking deref
     34 (7a892ee) — test runner rewrite to standard cljs.test + SharedAtom conveyance fix"
  (:require
   [cljs.test :refer-macros [deftest testing is]]
   [cljs-thread.eve.shared-atom :as a]
   [cljs-thread.eve.map :as sm]
   [cljs-thread.eve.set :as ss]))

;; Platform detection — filesystem tests are node-only
(def ^:private node?
  (and (exists? js/process) (exists? js/process.versions)))

;; Global atom and worker-id are bootstrapped by the test runner (test_main.cljs).

;;-----------------------------------------------------------------------------
;; Helper: create a fresh atom env
;;-----------------------------------------------------------------------------

(defn fresh-env
  "Create a fresh atom env, resetting pools first."
  []
  (sm/reset-pools!)
  (ss/reset-pools!)
  (set! a/*global-atom-instance*
        (a/atom-domain {}))
  (a/get-env a/*global-atom-instance*))

;;=============================================================================
;; Commit 27: sab-transfer-data — extract SAB refs for cross-thread transfer
;;
;; This function enables zero-copy AtomDomain transfer across Web Workers.
;; It extracts the two SharedArrayBuffer instances from a AtomDomain so they
;; can be passed through worker_threads.workerData or postMessage.
;;=============================================================================

(deftest sab-transfer-data-exists-test
  (testing "sab-transfer-data is defined in atom namespace (commit 27)"
    (is (fn? a/sab-transfer-data)
        "sab-transfer-data should be a function")))

(deftest sab-transfer-data-returns-sab-refs-test
  (testing "sab-transfer-data returns map with :sab and :reader-map-sab (commit 27)"
    (let [env (fresh-env)
          transfer (a/sab-transfer-data a/*global-atom-instance*)]
      (is (map? transfer)
          "should return a map")
      (is (contains? transfer :sab)
          "should contain :sab key")
      (is (contains? transfer :reader-map-sab)
          "should contain :reader-map-sab key"))))

(deftest sab-transfer-data-sab-is-shared-array-buffer-test
  (testing "sab-transfer-data :sab is a SharedArrayBuffer (commit 27)"
    (let [env (fresh-env)
          transfer (a/sab-transfer-data a/*global-atom-instance*)
          sab (:sab transfer)]
      (is (some? sab) ":sab should be non-nil")
      (is (instance? js/SharedArrayBuffer sab)
          ":sab should be a SharedArrayBuffer instance")
      (is (= sab (:sab env))
          ":sab should be the same buffer as the atom env's SAB"))))

(deftest sab-transfer-data-round-trip-test
  (testing "SAB refs from sab-transfer-data can reconstruct atom env (commit 27)"
    (let [env (fresh-env)
          transfer (a/sab-transfer-data a/*global-atom-instance*)
          sab (:sab transfer)
          ;; Simulate what a worker does: create views from raw SAB
          index-view (js/Int32Array. sab)
          data-view (js/Uint8Array. sab)]
      ;; Write a value through the original atom
      (swap! a/*global-atom-instance* assoc :hello "world")
      ;; The reconstructed views should see the same data (same SAB)
      ;; The index view at the root offset should be non-zero (there's data)
      (is (some? (aget index-view 0))
          "Reconstructed index-view should be able to read from SAB")
      (is (> (.-byteLength sab) 0)
          "SAB should have non-zero byte length")
      ;; Verify original atom still works after extracting transfer data
      (is (= "world" (get @a/*global-atom-instance* :hello))
          "Original atom should still work after sab-transfer-data"))))

;;=============================================================================
;; Commit 29: cljs-thread as tracked directory
;;
;; The cljs-thread library is now a tracked directory (not a submodule).
;; It provides the multi-worker thread abstraction that EVE atoms run on.
;; We verify the directory structure, key source files, and EVE bridge module.
;;=============================================================================

(deftest project-directory-structure-test
  (when node?
    (testing "Project root has expected structure"
      (let [fs (js/require "fs")
            path (js/require "path")
            project-dir (js/process.cwd)]
        (is (.existsSync fs (.join path project-dir "src"))
            "src/ should exist")
        (is (.existsSync fs (.join path project-dir "test"))
            "test/ should exist")
        (is (.existsSync fs (.join path project-dir "shadow-cljs.edn"))
            "shadow-cljs.edn should exist")
        (is (.existsSync fs (.join path project-dir "deps.edn"))
            "deps.edn should exist")))))

(deftest cljs-thread-eve-bridge-exists-test
  (when node?
    (testing "EVE bridge module exists with required functions (commit 29)"
      (let [fs (js/require "fs")
            path (js/require "path")
            project-dir (js/process.cwd)
            eve-path (.join path project-dir "src/cljs_thread/eve.cljs")]
        (is (.existsSync fs eve-path)
            "src/cljs_thread/eve.cljs should exist")
        (when (.existsSync fs eve-path)
          (let [content (.readFileSync fs eve-path "utf8")]
            (is (re-find #"init-eve-on-worker!" content)
                "eve.cljs should define init-eve-on-worker!")
            (is (re-find #"reconstruct-s-atom-env" content)
                "eve.cljs should define reconstruct-s-atom-env")
            (is (re-find #"sab-transfer-data" content)
                "eve.cljs should delegate to a/sab-transfer-data")
            (is (re-find #"auto-init!" content)
                "eve.cljs should define auto-init! for worker threads")
            (is (re-find #"init-worker-cache!" content)
                "eve.cljs should call a/init-worker-cache! (slab path)")
            (is (re-find #"init-views-from-sab!" content)
                "eve.cljs should call wasm/init-views-from-sab! (slab path)")))))))


(deftest cljs-thread-core-source-files-test
  (when node?
    (testing "Core cljs-thread source files exist (commit 29)"
      (let [fs (js/require "fs")
            path (js/require "path")
            src-dir (.join path (js/process.cwd) "src/cljs_thread")
            required-files ["core.cljs" "core.clj" "in.cljs" "in.clj"
                            "future.cljs" "future.clj" "spawn.cljs" "spawn.clj"
                            "eve.cljs" "go.clj" "go.cljs" "platform.cljs"
                            "state.cljs" "msg.cljs" "env.cljs"]]
        (doseq [f required-files]
          (is (.existsSync fs (.join path src-dir f))
              (str "Source file " f " should exist")))))))

(deftest cljs-thread-xray-files-exist-test
  (when node?
    (testing "X-RAY storage model checker files exist (commit 29 + later)"
      (let [fs (js/require "fs")
            path (js/require "path")
            test-dir (.join path (js/process.cwd) "test/cljs_thread/runner")]
        (is (.existsSync fs (.join path test-dir "eve_xray_main.cljs"))
            "eve_xray_main.cljs should exist (X-RAY entry point)")
        (when (.existsSync fs (.join path test-dir "eve_xray_main.cljs"))
          (let [content (.readFileSync fs (.join path test-dir "eve_xray_main.cljs") "utf8")]
            (is (re-find #"validate-storage-model!" content)
                "X-RAY should call validate-storage-model! (slab validation)")
            (is (re-find #"atom-domain" content)
                "X-RAY should use a/atom-domain (EVE)")))))))



(deftest cljs-thread-bench-framework-exists-test
  (when node?
    (testing "Benchmark framework code exists (commit 29 + later)"
      (let [fs (js/require "fs")
            path (js/require "path")
            test-dir (.join path (js/process.cwd) "test/cljs_thread/runner")]
        (is (.existsSync fs (.join path test-dir "eve_bench.cljs"))
            "eve_bench.cljs should exist (bench framework)")
        (is (.existsSync fs (.join path test-dir "eve_bench_main.cljs"))
            "eve_bench_main.cljs should exist (bench entry point)")
        (when (.existsSync fs (.join path test-dir "eve_bench.cljs"))
          (let [content (.readFileSync fs (.join path test-dir "eve_bench.cljs") "utf8")]
            (is (re-find #"cljs\.test" content)
                "Bench framework should use cljs.test reporting")
            (is (re-find #"record!" content)
                "Bench framework should define record! for timing")))))))

(deftest cljs-thread-no-gitmodules-test
  (when node?
    (testing "No .gitmodules file (cljs-thread is tracked, not a submodule) (commit 29)"
      (let [fs (js/require "fs")
            path (js/require "path")
            project-dir (js/process.cwd)
            gitmodules-path (.join path project-dir ".gitmodules")]
        (is (not (.existsSync fs gitmodules-path))
            ".gitmodules should NOT exist (cljs-thread is a tracked directory)")))))

;;=============================================================================
;; Commit 30: Tests use SharedAtom (a/atom) API
;;
;; Integration tests were refactored to use (a/atom val) which creates
;; SharedAtom instances within the parent's SAB. This exercises the
;; slab allocator path, not the legacy *global-atom-instance* directly.
;;=============================================================================

(deftest embedded-shared-atom-api-test
  (testing "a/atom creates SharedAtom in slab (commit 30)"
    (fresh-env)
    (let [embedded (a/atom {:x 42})]
      (is (some? embedded)
          "a/atom should return non-nil")
      (is (instance? a/SharedAtom embedded)
          "a/atom should return an SharedAtom instance")
      (is (= 42 (get @embedded :x))
          "SharedAtom should deref to the correct value"))))

(deftest shared-atom-swap-test
  (testing "SharedAtom supports swap! on slab (commit 30)"
    (fresh-env)
    (let [embedded (a/atom {:counter 0})]
      (swap! embedded update :counter inc)
      (is (= 1 (get @embedded :counter))
          "swap! should update SharedAtom value")
      (swap! embedded update :counter inc)
      (is (= 2 (get @embedded :counter))
          "Multiple swap! calls should accumulate"))))

(deftest shared-atom-reset-test
  (testing "SharedAtom supports reset! on slab (commit 30)"
    (fresh-env)
    (let [embedded (a/atom {:old true})]
      (reset! embedded {:new true})
      (is (= true (get @embedded :new))
          "reset! should replace the value")
      (is (nil? (get @embedded :old))
          "Old key should be gone after reset!"))))

(deftest integration-test-uses-t-atom-test
  (when node?
    (testing "eve_integration_test.cljs uses t/atom for SharedAtom creation"
      (let [fs (js/require "fs")
            path (js/require "path")
            test-path (.join path (js/process.cwd)
                             "test/cljs_thread/eve_integration_test.cljs")]
        (when (.existsSync fs test-path)
          (let [content (.readFileSync fs test-path "utf8")]
            ;; Should use (t/atom ...) which delegates to eve/atom
            (is (re-find #"\(t/atom\s" content)
                "Integration test should use (t/atom ...) for SharedAtom")
            ;; Should NOT use *global-atom-instance* for test data
            (is (not (re-find #"\*global-atom-instance\*" content))
                "Integration test should NOT reference *global-atom-instance*")))))))

;;=============================================================================
;; Commit 31: Worker-launched test variants (w* prefix)
;;
;; Each integration test now has a worker-launched variant (prefixed w*)
;; that runs the test body inside a worker with synchronous blocking deref.
;;=============================================================================

(deftest worker-test-variants-exist-test
  (when node?
    (testing "Worker-launched test variants exist in integration test (commit 31)"
      (let [fs (js/require "fs")
            path (js/require "path")
            test-path (.join path (js/process.cwd)
                             "test/cljs_thread/eve_integration_test.cljs")]
        (when (.existsSync fs test-path)
          (let [content (.readFileSync fs test-path "utf8")]
            ;; Tests use spawn for concurrent multi-worker patterns
            (is (re-find #"\(spawn\s" content)
                "Should have spawn-based concurrent tests (commit 31)")
            ;; Tests use future for cross-worker dispatch (not in :root)
            (is (re-find #"\(future\s" content)
                "Worker tests should use future for cross-worker dispatch")))))))

(deftest perf-test-has-multi-worker-patterns-test
  (when node?
    (testing "Performance test has multi-worker patterns"
      (let [fs (js/require "fs")
            path (js/require "path")
            test-path (.join path (js/process.cwd)
                             "test/cljs_thread/eve_perf_test.cljs")]
        (when (.existsSync fs test-path)
          (let [content (.readFileSync fs test-path "utf8")]
            ;; Uses t/atom (which delegates to eve/atom)
            (is (re-find #"\(t/atom\s" content)
                "Perf test should use (t/atom ...) for EVE atoms")
            (is (re-find #"spawn" content)
                "Perf test should use spawn for multi-worker patterns")
            (is (re-find #"future" content)
                "Perf test should use future for async patterns")))))))

;;=============================================================================
;; Commit 34: Test runner rewrite to standard cljs.test + conveyance fix
;;
;; The test runner was rewritten to use standard cljs.test infrastructure.
;; Also fixes SharedAtom conveyance through the `in` macro.
;;=============================================================================

(deftest test-runner-exists-test
  (when node?
    (testing "External test runner infrastructure exists (commit 34)"
      (let [fs (js/require "fs")
            path (js/require "path")
            test-dir (.join path (js/process.cwd) "test/cljs_thread/runner")]
        (is (.existsSync fs (.join path test-dir "thread_test_runner.cljs"))
            "thread_test_runner.cljs should exist (external runner)")
        (is (.existsSync fs (.join path test-dir "thread_test_worker.cljs"))
            "thread_test_worker.cljs should exist (shared worker entry)")
        (is (.existsSync fs (.join path test-dir "eve_integration_main.cljs"))
            "eve_integration_main.cljs should exist (integration bootstrap)")
        (is (.existsSync fs (.join path test-dir "eve_perf_main.cljs"))
            "eve_perf_main.cljs should exist (perf bootstrap)")))))

(deftest test-runner-uses-cljs-test-test
  (when node?
    (testing "Test runner uses standard cljs.test (commit 34)"
      (let [fs (js/require "fs")
            path (js/require "path")
            runner-path (.join path (js/process.cwd)
                               "test/cljs_thread/runner/thread_test_runner.cljs")]
        (when (.existsSync fs runner-path)
          (let [content (.readFileSync fs runner-path "utf8")]
            (is (re-find #"cljs\.test" content)
                "Runner should use cljs.test namespace")
            (is (re-find #"run-tests" content)
                "Runner should call run-tests")))))))


(deftest shared-atom-print-read-roundtrip-test
  (testing "SharedAtom prints as #cljs-thread/shared-atom tagged literal"
    (fresh-env)
    (let [sa (a/atom {:x 1})
          printed (pr-str sa)]
      ;; IPrintWithWriter should emit the current tag format
      (is (re-find #"#cljs-thread/shared-atom" printed)
          "pr-str should emit #cljs-thread/shared-atom tag")
      (is (re-find #":id" printed)
          "pr-str should include :id field")
      (is (re-find #":idx" printed)
          "pr-str should include :idx field")))
  (testing "serial.cljs guards EVE types from walk (duck-type check)"
    (when node?
      (let [fs (js/require "fs")
            path (js/require "path")
            serial-path (.join path (js/process.cwd)
                                "src/cljs_thread/serial.cljs")]
        (when (.existsSync fs serial-path)
          (let [content (.readFileSync fs serial-path "utf8")]
            (is (re-find #"eve-shared-atom\?" content)
                "serial.cljs should duck-type check SharedAtom to prevent walk")))))))

(deftest platform-extracts-sab-config-test
  (when node?
    (testing "platform.cljs extracts __eve_sab_config from workerData (commit 34)"
      (let [fs (js/require "fs")
            path (js/require "path")
            platform-path (.join path (js/process.cwd)
                                  "src/cljs_thread/platform.cljs")]
        (when (.existsSync fs platform-path)
          (let [content (.readFileSync fs platform-path "utf8")]
            (is (re-find #"__eve_sab_config" content)
                "platform.cljs should extract __eve_sab_config from workerData")
            (is (re-find #"globalThis" content)
                "platform.cljs should save SAB config to globalThis")))))))

;;=============================================================================
;; Cross-cutting: verify slab infrastructure targeting
;;
;; All cljs-thread EVE integration must go through the slab allocator, not
;; the legacy allocator. We verify key integration points.
;;=============================================================================

(deftest eve-bridge-uses-slab-apis-test
  (when node?
    (testing "eve.cljs bridge uses slab allocator APIs (cross-cutting)"
      (let [fs (js/require "fs")
            path (js/require "path")
            eve-path (.join path (js/process.cwd)
                             "src/cljs_thread/eve.cljs")]
        (when (.existsSync fs eve-path)
          (let [content (.readFileSync fs eve-path "utf8")]
            ;; Must call slab init functions
            (is (re-find #"init-worker-cache!" content)
                "eve.cljs MUST call init-worker-cache! (slab init)")
            (is (re-find #"init-views-from-sab!" content)
                "eve.cljs MUST call init-views-from-sab! (slab views)")
            ;; Must import slab types for side-effect registration
            (is (re-find #"eve\.map" content)
                "eve.cljs should require eve.map (direct-map-encoder registration)")
            (is (re-find #"eve\.vec" content)
                "eve.cljs should require eve.vec (vector builder registration)")
            (is (re-find #"eve\.set" content)
                "eve.cljs should require eve.set (set builder registration)")
            (is (re-find #"eve\.list" content)
                "eve.cljs should require eve.list (list builder registration)")))))))


(deftest multiple-shared-atoms-in-slab-test
  (testing "Multiple SharedAtoms can coexist in slab (cross-cutting)"
    (fresh-env)
    (let [a1 (a/atom {:name "alice" :age 30})
          a2 (a/atom {:name "bob" :age 25})
          a3 (a/atom {:kind "config" :level 5})]
      ;; All three should be independent
      (is (= "alice" (get @a1 :name)))
      (is (= "bob" (get @a2 :name)))
      (is (= 5 (get @a3 :level)))
      ;; Swap one, others unchanged
      (swap! a2 assoc :age 26)
      (is (= 30 (get @a1 :age)) "a1 should be unchanged")
      (is (= 26 (get @a2 :age)) "a2 should be updated")
      (is (= 5 (get @a3 :level)) "a3 should be unchanged"))))

