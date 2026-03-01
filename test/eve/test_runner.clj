(ns eve.test-runner
  "Unified deps.edn test runner for eve.

   Auto-discovers *_test.cljs files, classifies them by tier, generates
   a tailored runner, compiles via shadow-cljs, and runs on the selected
   platform (:node, :browser, or :playwright). Discovery is always on.

   Usage:
     clj -M:thread-test                       ;; discover and run all tests
     clj -M:thread-test slab                  ;; run slab tests (suite → ns filter)
     clj -M:thread-test :tier slab :node      ;; slab tier via Node.js
     clj -M:thread-test :ns \"map\" :node       ;; filter by namespace regex
     clj -M:thread-test :exclude \"batch|xray\" ;; exclude by regex
     clj -M:thread-test :dry-run              ;; show test plan without compiling
     clj -M:thread-test :advanced slab        ;; :advanced optimizations
     clj -M:thread-test :all-opts slab        ;; all optimization levels
     clj -M:thread-test :all-platforms        ;; :node + :playwright in parallel
     clj -M:thread-test :all                  ;; all platforms × all opt levels
     clj -M:thread-test :par 4               ;; run up to 4 suites in parallel
     clj -M:thread-test :list                 ;; list discovered namespaces
     clj -M:thread-test :skip-compile slab    ;; skip recompilation
     clj -M:thread-test :compile-only         ;; compile without running
     clj -M:thread-test :watch                ;; watch mode with incremental rebuild
     clj -M:thread-test :output tap           ;; TAP output format
     clj -M:thread-test :retry                ;; re-run only last-failed tests

   Keyword args use : prefix (Clojure-style). Flags like --skip-compile
   also accepted for convenience."
  (:require [cljs-thread.test.convention :as conv]
            [cljs-thread.test.generate :as gen]
            [cljs-thread.test.env :as env]
            [cljs-thread.test.failures :as failures]
            [cljs-thread.test.watch :as watch]
            [clojure.java.io :as io]
            [clojure.edn :as edn]
            [clojure.string :as str])
  (:import [java.util.concurrent Executors Future]))

;;-----------------------------------------------------------------------------
;; Build targets
;;-----------------------------------------------------------------------------

(def ^:private shadow-target "thread-test")
(def ^:private browser-target "thread-test-browser")
(def ^:private output-js "target/thread-test/all.js")

;; xray needs its own build: loading map/vec/list/set namespaces registers
;; type encoders that change HAMT allocation routing in the omnibus build.
(def ^:private xray-target "xray-stress-test")
(def ^:private xray-js "target/thread-test/xray-stress-test.js")
(def ^:private xray-browser-target "xray-test-browser")

;; direct-sab needs the full cljs-thread worker mesh infrastructure
(def ^:private direct-sab-target "eve-direct-sab")
(def ^:private direct-sab-worker-target "thread-test-worker")
(def ^:private direct-sab-js "target/thread-test/direct-sab.js")

;; dom-proxy has its own browser build (screen + worker code-split)
(def ^:private dom-proxy-browser-target "dom-proxy-test-browser")

;; direct-sab browser build
(def ^:private direct-sab-browser-target "direct-sab-test-browser")

(def ^:private browser-port 9110)
(def ^:private xray-browser-port 9111)
(def ^:private dom-proxy-browser-port 9112)
(def ^:private direct-sab-browser-port 9116)

;;-----------------------------------------------------------------------------
;; Optimization levels
;;-----------------------------------------------------------------------------

(def ^:private opt-level-labels
  {:none     ":none"
   :basic    ":simple (basic)"
   :advanced ":advanced"})

;;-----------------------------------------------------------------------------
;; Process helpers
;;-----------------------------------------------------------------------------

(defn- run-process!
  "Run a process, streaming stdout/stderr to this process's stdout/stderr.
   Returns the exit code."
  [& args]
  (let [pb (ProcessBuilder. ^java.util.List (vec args))]
    (.inheritIO pb)
    (.directory pb (java.io.File. (System/getProperty "user.dir")))
    (let [proc (.start pb)]
      (.waitFor proc))))

(defn- start-process!
  "Start a background process. Returns the Process object."
  [& args]
  (let [pb (ProcessBuilder. ^java.util.List (vec args))]
    (.inheritIO pb)
    (.directory pb (java.io.File. (System/getProperty "user.dir")))
    (.start pb)))

(defn- wait-for-port!
  "Poll until a TCP port is accepting connections (max ~10s)."
  [port]
  (loop [n 0]
    (when (< n 50)
      (if (try
            (let [s (java.net.Socket.)]
              (.connect s (java.net.InetSocketAddress. "localhost" (int port)) 200)
              (.close s)
              true)
            (catch Exception _ false))
        true
        (do (Thread/sleep 200)
            (recur (inc n)))))))

;;-----------------------------------------------------------------------------
;; Shadow-cljs compilation
;;-----------------------------------------------------------------------------

(defn- compile-target!
  "Compile a shadow-cljs target at the given optimization level.
     :none     → shadow-cljs compile (development build, no optimizations)
     :basic    → shadow-cljs release with :simple optimizations
     :advanced → shadow-cljs release with :advanced optimizations (default)"
  [target opt-level]
  (let [release? (not= opt-level :none)
        label    (get opt-level-labels opt-level)]
    (println (str "  " (if release? "[release]" "[compile]")
                  " " target " (" label ")"))
    (try
      (require 'shadow.cljs.devtools.api)
      (require 'shadow.cljs.devtools.server)
      (let [start-fn (resolve 'shadow.cljs.devtools.server/start!)]
        (start-fn)
        (if release?
          (let [release-fn (resolve 'shadow.cljs.devtools.api/release)
                config     (if (= opt-level :basic)
                             {:compiler-options {:optimizations :simple
                                                 :load-tests true}}
                             {:compiler-options {:load-tests true}})]
            (release-fn (keyword target) config))
          (let [compile-fn (resolve 'shadow.cljs.devtools.api/compile)]
            (compile-fn (keyword target))))
        true)
      (catch Exception e
        (println (str "  Shadow API failed: " (.getMessage e)))
        (println "  Falling back to CLI...")
        (let [cmd (cond
                    (= opt-level :basic)
                    ["npx" "shadow-cljs" "release" target
                     "--config-merge"
                     "{:compiler-options {:optimizations :simple :load-tests true}}"]

                    (= opt-level :advanced)
                    ["npx" "shadow-cljs" "release" target
                     "--config-merge"
                     "{:compiler-options {:load-tests true}}"]

                    :else
                    ["npx" "shadow-cljs" "compile" target])
              exit (apply run-process! cmd)]
          (when-not (zero? exit)
            (println "ERROR: shadow-cljs compilation failed")
            (System/exit exit))
          true)))))

(defn- compile-for-platforms!
  "Compile all targets needed for the given platforms at the given opt level.
   Deduplicates targets: node and playwright need different builds."
  [platforms opt-level]
  (let [need-node?    (some #{:node} platforms)
        need-browser? (some #{:browser :playwright} platforms)]
    (println (str "Compiling tests (" (get opt-level-labels opt-level)
                  ") via shadow-cljs..."))
    (println)
    (when need-node?
      (compile-target! shadow-target opt-level)
      (compile-target! xray-target opt-level)
      (compile-target! direct-sab-target opt-level)
      (compile-target! direct-sab-worker-target opt-level))
    (when need-browser?
      (compile-target! browser-target opt-level)
      (compile-target! xray-browser-target opt-level)
      (compile-target! dom-proxy-browser-target opt-level)
      (compile-target! direct-sab-browser-target opt-level))
    (println)
    (println "Compilation complete.")))

;;-----------------------------------------------------------------------------
;; Suite registry (mirrors CLJS side, for :list and :node subprocess dispatch)
;;-----------------------------------------------------------------------------

(def ^:private suite-names
  ["all" "core" "array" "slab" "large-scale" "epoch-gc" "xray" "direct-sab"
   "obj" "deftype" "int-map" "rb-tree" "batch2" "batch3" "batch4" "validation"
   "dom-proxy"])

(def ^:private all-suites
  "Individual suites run when 'all' is requested via :node.
   Each runs in its own node process for clean allocator state."
  ["core" "array" "slab" "large-scale" "epoch-gc" "xray" "direct-sab" "obj"
   "int-map" "rb-tree" "batch2" "batch3" "batch4"])

;;-----------------------------------------------------------------------------
;; Sequential multi-suite runner
;;-----------------------------------------------------------------------------

(defn- run-all-suites!
  "Run each suite via run-one-fn, stopping on first failure.
   Returns 0 on success, non-zero on failure."
  [platform-label suites run-one-fn]
  (println (str "=== Running all test suites via :" platform-label " ==="))
  (println)
  (loop [[suite & more] suites
         total 0]
    (if-not suite
      (do (println)
          (println (str "=== All " total " suites passed ==="))
          0)
      (do (println (str "--- Suite: " suite " ---"))
          (let [exit (run-one-fn suite)]
            (if-not (zero? exit)
              (do (println)
                  (println (str "=== FAILED: suite '" suite "' exited " exit " ==="))
                  exit)
              (do (println)
                  (recur more (inc total)))))))))

;;-----------------------------------------------------------------------------
;; Parallel multi-suite runner
;;-----------------------------------------------------------------------------

(defn- run-all-suites-parallel!
  "Run suites in parallel with up to par-count threads.
   Returns 0 on success, non-zero on first failure."
  [platform-label suites run-one-fn par-count]
  (println (str "=== Running all test suites via :" platform-label
                " (:par " par-count ") ==="))
  (println)
  (let [pool (Executors/newFixedThreadPool par-count)
        futures (mapv (fn [suite]
                        [suite (.submit pool ^Callable
                                 (fn []
                                   (println (str "  [" suite "] starting..."))
                                   (let [exit (run-one-fn suite)]
                                     (println (str "  [" suite "] "
                                                   (if (zero? exit) "passed" (str "FAILED (exit " exit ")"))))
                                     exit)))])
                      suites)]
    (try
      (let [results (mapv (fn [[suite ^Future fut]]
                            {:suite suite :exit (.get fut)})
                          futures)
            failures (filterv #(not (zero? (:exit %))) results)]
        (println)
        (if (empty? failures)
          (do (println (str "=== All " (count suites) " suites passed ==="))
              0)
          (do (println (str "=== FAILED: " (count failures) " suite(s) failed ==="))
              (doseq [{:keys [suite exit]} failures]
                (println (str "  " suite " (exit " exit ")")))
              (:exit (first failures)))))
      (finally
        (.shutdown pool)))))

;;-----------------------------------------------------------------------------
;; Node execution
;;-----------------------------------------------------------------------------

(defn- run-node-suite!
  "Run one suite via node. Returns the exit code."
  [suite-name]
  (cond
    (= suite-name "xray")       (run-process! "node" xray-js)
    (= suite-name "direct-sab") (run-process! "node" direct-sab-js)
    :else                       (run-process! "node" output-js suite-name)))

(defn- run-node!
  "Run tests via Node.js. Returns exit code."
  [suite-args par]
  (if (or (empty? suite-args) (= suite-args ["all"]))
    (if par
      (run-all-suites-parallel! "node" all-suites run-node-suite! par)
      (run-all-suites! "node" all-suites run-node-suite!))
    (cond
      (= suite-args ["xray"])       (run-process! "node" xray-js)
      (= suite-args ["direct-sab"]) (run-process! "node" direct-sab-js)
      :else                         (apply run-process! (into ["node" output-js] suite-args)))))

;;-----------------------------------------------------------------------------
;; Browser execution (manual — serves and waits)
;;-----------------------------------------------------------------------------

(defn- run-browser!
  "Compile, serve, and print URL for manual browser testing.
   Returns 0 (interactive, always succeeds)."
  [suite-args]
  (let [suite (or (first suite-args) "all")
        xray? (= suite "xray")
        server (start-process! "node" "test/e2e/serve.js" "thread-test-browser")
        ;; Also start xray server when needed
        xray-server (when (or xray? (= suite "all"))
                      (start-process! "node" "test/e2e/serve.js" "xray-test-browser"))]
    (wait-for-port! browser-port)
    (when xray-server (wait-for-port! xray-browser-port))
    (println)
    (println (str "=== Browser tests ready ==="))
    (if xray?
      (println (str "Open: http://localhost:" xray-browser-port "?suite=xray"))
      (println (str "Open: http://localhost:" browser-port "?suite=" suite)))
    (when (and (= suite "all") xray-server)
      (println (str "xray: http://localhost:" xray-browser-port "?suite=xray")))
    (println "Press Ctrl+C to stop the server.")
    (println)
    (.waitFor server)
    (when xray-server (.destroyForcibly xray-server))
    0))

;;-----------------------------------------------------------------------------
;; Playwright execution (headless — default)
;;-----------------------------------------------------------------------------

(defn- run-playwright-suite!
  "Run one suite via Playwright. Returns exit code.
   xray, dom-proxy, and direct-sab use their own browser builds + ports."
  [suite]
  (let [xray?       (= suite "xray")
        dom-proxy?  (= suite "dom-proxy")
        direct-sab? (= suite "direct-sab")
        target (cond xray?       "xray-test-browser"
                     dom-proxy?  "dom-proxy-test"
                     direct-sab? "direct-sab-test"
                     :else       "thread-test-browser")
        port   (cond xray?       xray-browser-port
                     dom-proxy?  dom-proxy-browser-port
                     direct-sab? direct-sab-browser-port
                     :else       browser-port)
        server (start-process! "node" "test/e2e/serve.js" target)]
    (try
      (wait-for-port! port)
      (let [exit (run-process! "node" "test/e2e/thread-test-run.js"
                               suite (str port))]
        exit)
      (finally
        (.destroyForcibly server)))))

(defn- run-playwright!
  "Run tests via headless Playwright. Returns exit code."
  [suite-args par]
  (if (or (empty? suite-args) (= suite-args ["all"]))
    (if par
      (run-all-suites-parallel! "playwright" all-suites run-playwright-suite! par)
      (run-all-suites! "playwright" all-suites run-playwright-suite!))
    (run-playwright-suite! (first suite-args))))

;;-----------------------------------------------------------------------------
;; Arg parsing
;;-----------------------------------------------------------------------------

(defn- keyword-arg?
  "True if arg looks like a keyword (:foo) or flag (--foo)."
  [s]
  (or (.startsWith s ":") (.startsWith s "--")))

(defn- normalize-arg
  "Normalize :foo and --foo to canonical keyword form."
  [s]
  (cond
    (.startsWith s ":") (subs s 1)
    (.startsWith s "--") (subs s 2)
    :else s))

(defn- parse-args
  "Parse args into {:platform :playwright, :opt-level :none, :flags #{}, :suites [], :par nil,
                    :tier nil, :ns-filter nil, :output nil, :timeout nil}."
  [args]
  (let [platforms  #{"node" "browser" "playwright"}
        flags      #{"skip-compile" "compile-only" "list" "all-opts" "all-platforms" "all"
                      "discover" "dry-run" "watch" "retry"}
        opt-levels #{"none" "basic" "advanced"}
        ;; Args that consume the next value
        value-args #{"par" "tier" "ns" "output" "timeout" "exclude" "dir" "test"}]
    (loop [[arg & more] args
           acc {:platform :playwright :opt-level :none :flags #{} :suites [] :par nil
                :tier nil :ns-filter nil :output nil :timeout nil :exclude nil
                :dir nil :test-filter nil}]
      (if-not arg
        acc
        (if (keyword-arg? arg)
          (let [k (normalize-arg arg)]
            (cond
              ;; Value-consuming args
              (value-args k)
              (let [v (first more)]
                (case k
                  "par"     (let [n (when v (try (Integer/parseInt v)
                                                  (catch NumberFormatException _ nil)))]
                              (if n
                                (recur (rest more) (assoc acc :par n))
                                (recur more (assoc acc :par 2))))
                  "tier"    (recur (rest more) (assoc acc :tier (keyword (or v "all"))))
                  "ns"      (recur (rest more) (assoc acc :ns-filter v))
                  "output"  (recur (rest more) (assoc acc :output v))
                  "timeout" (recur (rest more) (assoc acc :timeout
                                                 (when v (try (Integer/parseInt v)
                                                              (catch NumberFormatException _ nil)))))
                  "exclude" (recur (rest more) (assoc acc :exclude v))
                  "dir"     (recur (rest more) (assoc acc :dir v))
                  "test"    (recur (rest more) (assoc acc :test-filter v))))

              (platforms k)  (recur more (assoc acc :platform (keyword k)))
              (opt-levels k) (recur more (assoc acc :opt-level (keyword k)))
              (flags k)      (recur more (update acc :flags conj k))
              :else          (recur more (update acc :suites conj arg))))
          (recur more (update acc :suites conj arg)))))))

;;-----------------------------------------------------------------------------
;; Auto-discovery mode (new)
;;-----------------------------------------------------------------------------

(def ^:private gen-test-target "gen-test")
(def ^:private gen-test-output "target/test-run/gen-test.js")

(defn- discover-and-plan!
  "Discover test namespaces and return a test plan.
   Returns {:tests [...] :tier :slab}"
  [{:keys [tier ns-filter dir exclude platform]}]
  (let [;; Map runtime platform to platform-filter for convention scanner.
        ;; :playwright runs in a browser, so treat it as :browser.
        platform-kw (case platform
                      :node       :node
                      :browser    :browser
                      :playwright :browser
                      nil)
        tests (conv/scan-test-dir "test"
                :tier-filter tier
                :ns-regexp ns-filter
                :dir-filter dir
                :exclude-re exclude
                :platform-filter platform-kw)
        dominant (conv/dominant-tier tests)]
    {:tests tests
     :tier  (or tier dominant)}))

(defn- print-test-plan!
  "Print the test plan for --dry-run."
  [{:keys [tests tier]} {:keys [platform opt-level]}]
  (println)
  (println "=== Test Plan (dry-run) ===")
  (println)
  (println (str "Tier: " tier))
  (println (str "Optimization: " (get opt-level-labels opt-level)))
  (println (str "Environment: " platform))
  (println (str "Output: " gen-test-output))
  (println)
  (println (str "Discovered " (count tests) " test namespaces:"))
  (let [by-tier (group-by :tier tests)]
    (doseq [[t ns-list] (sort-by key by-tier)]
      (doseq [{:keys [ns path isolated?]} ns-list]
        (println (str "  " (name t)
                      (when isolated? " [isolated]")
                      "  " ns
                      "  (" path ")")))))
  (println))

(defn- compile-generated!
  "Compile the generated test runner using the fixed :gen-test target
   defined in shadow-cljs.edn. The runner .cljs file must already be
   written to target/generated-test/ before calling this."
  [opt-level]
  (compile-target! gen-test-target opt-level))

(defn- generate-and-compile!
  "Generate a runner, compile it, return the output JS path."
  [{:keys [tests tier]} {:keys [opt-level timeout]}]
  (println "Generating test runner...")
  (let [runner-ns 'cljs-thread.test.generated-runner
        runner-path (gen/write-runner! tests
                      {:runner-ns   runner-ns
                       :tier        tier
                       :timeout-ms  (or timeout (conv/tier-default-timeout tier))})]
    (println (str "  Generated runner: " runner-path))
    (println (str "  Output: " gen-test-output))
    (println)

    ;; Compile via :gen-test target in shadow-cljs.edn
    (println (str "Compiling (" (get opt-level-labels opt-level) ")..."))
    (compile-generated! opt-level)
    (println "Compilation complete.")
    gen-test-output))

(defn- run-discovered!
  "Run tests via the discovery pipeline. Returns exit code (does NOT call System/exit).
   Callers are responsible for exiting."
  [{:keys [platform opt-level flags tier ns-filter dir exclude output timeout par]
    :as parsed}]
  (let [dry-run? (contains? flags "dry-run")
        watch?   (contains? flags "watch")
        retry?   (contains? flags "retry")
        skip?    (contains? flags "skip-compile")

        ;; Load last failures if :retry
        retry-data (when retry?
                     (let [data (failures/load-failures)]
                       (when data
                         (failures/print-failure-summary)
                         data)))

        ;; Discover tests
        plan (discover-and-plan!
               {:tier      tier
                :ns-filter (or (when retry?
                                 (failures/failed-ns-filter retry-data))
                               ns-filter)
                :dir       dir
                :exclude   exclude
                :platform  platform})]

    (cond
      ;; No tests found
      (empty? (:tests plan))
      (do (println "No test namespaces found matching the given filters.")
          (when retry?
            (println "Hint: no previous failures to retry. Run tests first."))
          1)

      ;; Dry-run: show plan and exit
      dry-run?
      (do (print-test-plan! plan parsed)
          0)

      ;; Watch mode
      watch?
      (do (println "Watch mode: compile once, then watch for changes...")
          (let [output-js (generate-and-compile! plan parsed)]
            ;; Run once
            (let [exit (env/launch-env platform {:output-js output-js :suite "all"})]
              (println (str "\n--- Initial run: " (if (zero? exit) "PASSED" "FAILED") " ---")))
            ;; Enter watch loop
            (watch/watch-and-run!
              {:compile-fn (fn [] (generate-and-compile! plan parsed))
               :run-fn     (fn [] (env/launch-env platform {:output-js output-js :suite "all"}))}))
          0)

      ;; Normal run
      :else
      (let [output-js (if skip?
                        gen-test-output
                        (generate-and-compile! plan parsed))
            exit (env/launch-env platform {:output-js output-js :suite "all"})]
        ;; Persist failures for :retry support
        (when-not (zero? exit)
          (failures/persist-failures! [] :opt-level opt-level))
        (when (zero? exit)
          (failures/clear-failures!))
        exit))))

;;-----------------------------------------------------------------------------
;; Entry point
;;-----------------------------------------------------------------------------

(def ^:private platform-labels
  {:node       ":node"
   :playwright ":playwright"
   :browser    ":browser"})

(defn- run-platform!
  "Run tests on a single platform. Returns exit code."
  [plat suites par]
  (case plat
    :node       (run-node! suites par)
    :browser    (run-browser! suites)
    :playwright (run-playwright! suites par)))

(defn- run-platforms-parallel!
  "Run node and playwright in parallel (always).
   Each platform runs its suites with the given :par count.
   Returns the first non-zero exit code, or 0 if all pass."
  [platforms suites par opt-label]
  (println (str "  Running " (count platforms) " platforms in parallel"
                (when par (str ", :par " par " suites each"))
                " (" opt-label ")"))
  (let [pool (Executors/newFixedThreadPool (count platforms))
        futures (mapv (fn [plat]
                        [plat (.submit pool ^Callable
                                (fn []
                                  (let [exit (run-platform! plat suites par)]
                                    (println (str "  [" (get platform-labels plat)
                                                  "] Finished — exit " exit))
                                    exit)))])
                      platforms)]
    (try
      (let [results (mapv (fn [[plat ^Future fut]]
                            {:platform plat :exit (.get fut)})
                          futures)]
        (doseq [{:keys [platform exit]} results]
          (when-not (zero? exit)
            (println (str "  [" (get platform-labels platform) "] FAILED (exit " exit ")"))))
        (let [first-failure (first (filter #(not (zero? (:exit %))) results))]
          (if first-failure (:exit first-failure) 0)))
      (finally
        (.shutdown pool)))))

(defn -main
  "Main entry point. Discovery is always implicit.

   Arguments:
     :node             Run via Node.js
     :browser          Open in browser (manual)
     :playwright       Run headless via Playwright (default)
     :none             Compile with :none optimizations (default)
     :basic            Compile with :simple optimizations
     :advanced         Compile with :advanced optimizations
     :tier <tier>      Filter by tier (:pure, :slab, :worker)
     :ns <regex>       Filter by namespace regex
     :exclude <regex>  Exclude namespaces matching regex
     :dir <path>       Filter by subdirectory prefix
     :dry-run          Show test plan without compiling
     :retry            Re-run only last-failed tests
     :watch            Watch mode with incremental rebuild
     :output <fmt>     Output format (human, tap, junit, edn)
     :par N            Run up to N test suites in parallel (default 2)
     :list             List available test suites and namespaces
     :skip-compile     Skip shadow-cljs compilation
     :compile-only     Compile without running
     :all-opts         Run tests at all three optimization levels
     :all-platforms    Run on :node and :playwright (in parallel)
     :all              All platforms × all optimization levels
     <suite> ...       Suite names (resolved as namespace filters)"
  [& args]
  (let [{:keys [platform opt-level flags suites par] :as parsed} (parse-args (vec args))
        skip-compile? (contains? flags "skip-compile")
        compile-only? (contains? flags "compile-only")
        list?         (contains? flags "list")
        all?          (contains? flags "all")
        all-opts?     (or all? (contains? flags "all-opts"))
        all-platforms? (or all? (contains? flags "all-platforms"))

        ;; Convert suite names to namespace filter for the discovery pipeline.
        ;; "all" is not a real filter — drop it.
        effective-suites (remove #(= "all" %) suites)
        parsed (if (and (seq effective-suites) (nil? (:ns-filter parsed)))
                 (assoc parsed :ns-filter (str/join "|" effective-suites))
                 parsed)]

    ;; :list — print discovered namespaces and exit
    (when list?
      (println "Discovered test namespaces:")
      (let [tests (conv/scan-test-dir "test")]
        (doseq [[tier ns-list] (sort-by key (group-by :tier tests))]
          (println (str "  [" (name tier) "]"))
          (doseq [{:keys [ns]} ns-list]
            (println (str "    " ns)))))
      (println)
      (println "Usage:")
      (println "  clj -M:thread-test                       # run all tests")
      (println "  clj -M:thread-test slab                  # run slab tests")
      (println "  clj -M:thread-test :tier slab :node      # slab tier via Node.js")
      (println "  clj -M:thread-test :ns \"map\" :node       # filter by namespace regex")
      (println "  clj -M:thread-test :exclude \"batch|xray\" # exclude by regex")
      (println "  clj -M:thread-test :dry-run              # show test plan")
      (println "  clj -M:thread-test :advanced slab        # :advanced optimizations")
      (println "  clj -M:thread-test :all-opts slab        # all optimization levels")
      (println "  clj -M:thread-test :all-platforms        # :node + :playwright")
      (println "  clj -M:thread-test :all                  # all platforms × all opts")
      (println "  clj -M:thread-test :par 4                # parallel execution")
      (println "  clj -M:thread-test :watch                # watch mode")
      (println "  clj -M:thread-test :retry                # re-run last failures")
      (println "  clj -M:thread-test :output tap           # TAP output format")
      (println "  clj -M:thread-test :list                 # this help")
      (System/exit 0))

    ;; Multi-opt / multi-platform orchestration: loop over opt levels and platforms,
    ;; running the discovery pipeline for each combination.
    (when (or all-opts? all-platforms? compile-only?)
      (let [opt-levels (if all-opts? [:none :basic :advanced] [opt-level])
            platforms  (if all-platforms? [:node :playwright] [platform])]

        (when par
          (println (str "Parallel mode: up to " par " suites concurrently per platform")))

        (let [multi-opts?      (> (count opt-levels) 1)
              multi-platforms? (> (count platforms) 1)
              multi?           (or multi-opts? multi-platforms?)]
          (doseq [opt opt-levels]
            (when multi-opts?
              (println)
              (println "========================================")
              (println (str "  Optimization level: " (get opt-level-labels opt)))
              (println "========================================"))

            ;; Compile — always sequential (shadow-cljs server is shared).
            ;; When multi-platform, compile ALL platform targets before running.
            (when-not skip-compile?
              (compile-for-platforms! platforms opt))

            ;; Run
            (when-not compile-only?
              (let [exit (if multi-platforms?
                           ;; Multi-platform: always run node + playwright in parallel
                           (run-platforms-parallel! platforms effective-suites par
                                                   (get opt-level-labels opt))
                           ;; Single platform
                           (run-platform! (first platforms) effective-suites par))]
                (when-not (zero? exit)
                  (when multi?
                    (println)
                    (println (str "FAILED at " (get opt-level-labels opt))))
                  (System/exit exit)))))

          ;; All passed
          (when multi?
            (println)
            (println "████████████████████████████████████████████████")
            (println (str "  All passed! ("
                          (count platforms) " platform"
                          (when (> (count platforms) 1) "s")
                          " × " (count opt-levels) " opt level"
                          (when (> (count opt-levels) 1) "s")
                          (when par (str ", :par " par))
                          ")"))
            (println "████████████████████████████████████████████████"))
          (System/exit 0))))

    ;; Default: discovery mode (always implicit)
    (System/exit (run-discovered! parsed))))
