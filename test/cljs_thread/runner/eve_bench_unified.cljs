(ns cljs-thread.runner.eve-bench-unified
  "Unified entry point for the benchmark framework.

   This file serves as BOTH main thread entry AND worker source.
   In :advanced mode, using a single compilation unit ensures that
   function symbols match between main thread and workers.

   Build & run:
     npx shadow-cljs release eve-bench-unified
     node target/eve-bench/unified-bench.js"
  (:require-macros [cljs-thread.core :refer [in on-when]])
  (:require
   [goog]
   [cljs-thread.core :as thread]
   [cljs-thread.eve :as eve]
   [cljs-thread.state :as s]
   [cljs-thread.env :as e]
   [cljs-thread.future]
   [cljs-thread.injest]
   [cljs-thread.runner.thread-test-runner]
   [cljs-thread.eve.shared-atom :as a]
   [clojure.string :as str]
   ;; Pull in test namespace with alias to prevent DCE
   #_{:clj-kondo/ignore [:unused-namespace]}
   [cljs-thread.eve-perf-test :as perf-test]))

;; Anti-DCE: Export symbol to prevent Closure from eliminating test vars
#_{:clj-kondo/ignore [:unresolved-symbol]}
(goog/exportSymbol "cljs_thread.eve_perf_test" perf-test)

;; ---------------------------------------------------------------------------
;; Node.js interop (only used on main thread)
;; ---------------------------------------------------------------------------

(def ^:private fs     (when (e/in-screen?) (js* "require('fs')")))
(def ^:private path   (when (e/in-screen?) (js* "require('path')")))
(def ^:private cp     (when (e/in-screen?) (js* "require('child_process')")))

(defn- exec-sync [cmd]
  (try
    (str/trim (.toString (.execSync cp cmd #js {:encoding "utf8"})))
    (catch :default _ "")))

(defn- mkdir-p [dir]
  (.mkdirSync fs dir #js {:recursive true}))

(defn- write-file [filepath content]
  (.writeFileSync fs filepath content "utf8"))

;; ---------------------------------------------------------------------------
;; Git metadata
;; ---------------------------------------------------------------------------

(defn- git-info []
  {:branch     (exec-sync "git rev-parse --abbrev-ref HEAD")
   :commit     (exec-sync "git rev-parse --short HEAD")
   :commit-msg (exec-sync "git log -1 --pretty=%s")})

;; ---------------------------------------------------------------------------
;; Build mode detection
;; ---------------------------------------------------------------------------

(defn- optimizations []
  (if goog.DEBUG "none" "advanced"))

;; ---------------------------------------------------------------------------
;; EDN persistence (simplified)
;; ---------------------------------------------------------------------------

(defn- iso-timestamp []
  (.toISOString (js/Date.)))

(defn- fs-safe-timestamp [ts]
  (-> ts (str/replace ":" "-") (str/replace "." "-")))

(defn- persist-result! [bench-dir test-name result timestamp git-meta mode]
  (let [test-dir (.resolve path bench-dir (name test-name))
        filename (str (fs-safe-timestamp timestamp) "-" mode ".edn")
        filepath (.resolve path test-dir filename)
        full-result (merge {:benchmark     test-name
                            :timestamp     timestamp
                            :optimizations mode
                            :node-version  js/process.version}
                           git-meta
                           result)]
    (mkdir-p test-dir)
    (write-file filepath (pr-str full-result))
    (println (str "  -> " filepath))))

(defn- persist-all-results! [bench-dir results timestamp git-meta mode]
  (println "\n-- Persisting results --")
  (doseq [[test-name result] results]
    (persist-result! bench-dir test-name result timestamp git-meta mode)))

;; ---------------------------------------------------------------------------
;; Test execution (runs on worker via `in`)
;; ---------------------------------------------------------------------------

(defn run-tests-on-worker!
  "Entry point for worker test execution. Called from main thread via `in`."
  []
  (cljs-thread.runner.thread-test-runner/run-bench!))

;; ---------------------------------------------------------------------------
;; Main thread logic
;; ---------------------------------------------------------------------------

(defn- init-main-thread! []
  (let [mode (optimizations)]
    (println "=== Eve + cljs-thread Benchmarks (Unified Build) ===")
    (println (str "Node.js: " js/process.version " | Optimizations: " mode))

    ;; 1. Create AtomDomain on main thread (use defaults — benchmark what we ship)
    (let [my-atom (a/atom-domain {:x 42})]
      (a/validate-storage-model! (.-s-atom-env my-atom))
      (reset! s/eve-sab-config (eve/sab-transfer-data my-atom)))

    ;; 2. init! is idempotent — auto-detects fat-kernel source from __filename.
    (thread/init! {:future-count 16})

    ;; 3. Timeout guard
    (js/setTimeout
      (fn []
        (println "\nTIMEOUT: Benchmarks exceeded 600s time limit")
        (js/process.exit 1))
      600000)

    ;; 4. Wait for workers, then dispatch benchmarks to :core
    (on-when (and (contains? @s/peers :core)
                  (contains? @s/peers :future)
                  (some #(.startsWith (name %) "fp-") (keys @s/peers)))
      {:max-time 30000}
      (println (str "Workers ready. Peers: " (set (keys @s/peers))))
      (js/setTimeout
        (fn []
          (println (str "All peers: " (set (keys @s/peers))))
          (let [git-meta  (git-info)
                timestamp (iso-timestamp)
                bench-dir (.resolve path (.dirname path (js* "__filename"))
                                    ".." ".." "bench")]
            (println (str "Git: " (:branch git-meta) " @ " (:commit git-meta)))
            (-> @(in :core [] (run-tests-on-worker!))
                (.then (fn [results]
                         (println (str "\n-- " (count results) " benchmark results --"))
                         (persist-all-results! bench-dir results timestamp git-meta mode)
                         (println "\n-- Benchmarks complete --")
                         (js/setTimeout #(js/process.exit 0) 500)))
                (.catch (fn [err]
                          (println (str "\nFATAL: " (str err)))
                          (js/process.exit 1))))))
        8000))))

;; ---------------------------------------------------------------------------
;; Entry point
;; ---------------------------------------------------------------------------

(defn main []
  ;; Check if we're on the main thread (screen)
  (if (e/in-screen?)
    (init-main-thread!)
    ;; On worker: nothing to do. The code is just available for `in` calls.
    nil))
