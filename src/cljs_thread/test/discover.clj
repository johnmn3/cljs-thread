(ns cljs-thread.test.discover
  "Compile-time macros for auto-discovering and requiring test namespaces.

   These macros run on the JVM during ClojureScript compilation. They scan
   the filesystem, find all *-test namespaces, and generate:
   - require forms (so namespaces are compiled into the build)
   - goog/exportSymbol calls (anti-DCE for Closure :advanced)
   - run-tests calls (cljs.test/run-tests is a macro needing compile-time symbols)

   Usage in a generated runner:
     (ns my.runner
       (:require [cljs-thread.test.discover :as discover]))

     (discover/require-and-export-tests :test-root \"test\" :tier :slab)

     (defn run-all! []
       (let [env (discover/run-discovered-tests :test-root \"test\" :tier :slab
                                                :env (cljs.test/empty-env))]
         (if (cljs.test/successful? env) 0 1)))"
  (:require [cljs-thread.test.convention :as conv]
            [clojure.string :as str]))

;; ---------------------------------------------------------------------------
;; Discovery helpers (JVM-side, called at macro-expand time)
;; ---------------------------------------------------------------------------

(defn- discover-tests
  "Scan test directory and return discovered test descriptors.
   Applies all filter options."
  [{:keys [test-root tier dir ns-regexp exclude-ns exclude-re]
    :or   {test-root "test"}}]
  (conv/scan-test-dir test-root
                      :tier-filter (when (not= tier :all) tier)
                      :dir-filter dir
                      :ns-regexp ns-regexp
                      :exclude-ns exclude-ns
                      :exclude-re exclude-re))

;; ---------------------------------------------------------------------------
;; Macro: require-and-export-tests
;; ---------------------------------------------------------------------------

(defmacro require-and-export-tests
  "Emit goog/exportSymbol calls for all discovered test namespaces.
   This prevents Closure Compiler DCE from eliminating deftest vars.

   NOTE: This macro does NOT emit (:require ...) forms — those must be
   in the ns form itself. Instead, the JVM orchestrator generates the
   ns form with all requires. This macro handles only the anti-DCE exports.

   Emits:
   - A __discovered-tests def with metadata about discovered namespaces
   - goog/exportSymbol for each namespace (anti-DCE)

   Options:
     :test-root   - path to test directory (default \"test\")
     :tier        - :pure, :slab, :worker, or :all (default :all)
     :dir         - subdirectory filter
     :ns-regexp   - regex filter on namespace names
     :exclude-ns  - set of namespace symbols to exclude
     :exclude-re  - regex string for namespaces to exclude"
  [& {:keys [test-root tier dir ns-regexp exclude-ns exclude-re]
      :or   {test-root "test" tier :all}
      :as   opts}]
  (let [tests (discover-tests opts)
        test-data (mapv (fn [{:keys [ns tier isolated?]}]
                          {:ns (list 'quote ns) :tier tier :isolated? isolated?})
                        tests)]
    `(do
       ;; Metadata about discovered tests — available at runtime
       (def ~'__discovered-tests ~test-data)

       ;; Anti-DCE: export each namespace symbol to prevent Closure elimination
       ~@(for [{:keys [ns]} tests]
           (let [munged (conv/ns->munged-str ns)]
             `(goog/exportSymbol ~munged ~(symbol (str ns))))))))

;; ---------------------------------------------------------------------------
;; Macro: run-discovered-tests
;; ---------------------------------------------------------------------------

(defmacro run-discovered-tests
  "Emit (cljs.test/run-tests 'ns1 'ns2 ...) for all discovered tests.
   Must be called inside a function body.

   cljs.test/run-tests is a macro that needs namespace symbols at compile time.
   This macro generates those symbols from the filesystem scan.

   Options:
     :test-root   - path to test directory (default \"test\")
     :tier        - :pure, :slab, :worker, or :all (default :all)
     :dir         - subdirectory filter
     :ns-regexp   - regex filter on namespace names
     :exclude-ns  - set of namespace symbols to exclude
     :exclude-re  - regex string for namespaces to exclude
     :env         - if provided, thread through run-tests calls:
                    (-> env (t/run-tests 'ns1) (t/run-tests 'ns2) ...)"
  [& {:keys [test-root tier dir ns-regexp exclude-ns exclude-re env]
      :or   {test-root "test" tier :all}
      :as   opts}]
  (let [tests (discover-tests opts)
        ns-syms (mapv :ns tests)]
    (if env
      ;; Thread env through sequential run-tests calls
      `(-> ~env
           ~@(for [ns-sym ns-syms]
               `(cljs.test/run-tests (quote ~ns-sym))))
      ;; Direct run-tests call
      `(cljs.test/run-tests
         ~@(for [ns-sym ns-syms]
             (list 'quote ns-sym))))))

;; ---------------------------------------------------------------------------
;; Macro: test-ns-list
;; ---------------------------------------------------------------------------

(defmacro test-ns-list
  "Return a vector of namespace symbols for all discovered tests.
   Useful for runtime introspection of what's being tested."
  [& {:keys [test-root tier dir ns-regexp exclude-ns exclude-re]
      :or   {test-root "test" tier :all}
      :as   opts}]
  (let [tests (discover-tests opts)]
    `[~@(for [{:keys [ns]} tests]
          (list 'quote ns))]))
