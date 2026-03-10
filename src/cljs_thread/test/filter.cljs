(ns cljs-thread.test.filter
  "Runtime test filtering by metadata and var name.

   Compile-time filtering (by namespace, directory, tier) is handled by
   cljs-thread.test.convention and cljs-thread.test.discover on the JVM side.

   This namespace handles runtime filtering — selecting which individual
   deftest vars to execute from already-compiled namespaces.

   Two approaches:
   1. cljs.test/test-vars — takes a seq of var objects, runs them
   2. Metadata-based filtering via a custom test runner

   Since CLJS lacks runtime namespace reflection, the compile-time
   discovery macro generates a var manifest that this namespace can use."
  (:require [cljs.test :as t]))

;; ---------------------------------------------------------------------------
;; Var-level filtering
;; ---------------------------------------------------------------------------

(defn matches-metadata?
  "Check if a var's metadata matches the filter criteria.

   Options:
     :include - set of keyword tags (var must have ALL)
     :exclude - set of keyword tags (var must have NONE)"
  [var-meta {:keys [include exclude]}]
  (let [include-ok? (or (empty? include)
                        (every? #(get var-meta %) include))
        exclude-ok? (or (empty? exclude)
                        (not-any? #(get var-meta %) exclude))]
    (and include-ok? exclude-ok?)))

(defn matches-name?
  "Check if a var name matches a name filter (regex or exact)."
  [var-name filter-str]
  (if filter-str
    (boolean (re-find (js/RegExp. filter-str) (str var-name)))
    true))

;; ---------------------------------------------------------------------------
;; Filtered test execution
;; ---------------------------------------------------------------------------

(defn run-filtered-tests
  "Run tests from the given namespaces, filtering by var name and metadata.
   Uses cljs.test/test-vars for var-level control.

   Parameters:
     ns-test-var-map - map of {ns-sym -> [var1 var2 ...]} (from discovery macro)
     filters         - {:name-filter \"regex\" :include #{:smoke} :exclude #{:slow}}"
  [ns-test-var-map {:keys [name-filter include exclude]}]
  (let [env (t/empty-env)]
    (doseq [[_ns-sym test-vars] ns-test-var-map]
      (let [filtered (cond->> test-vars
                       name-filter (filter #(matches-name? (.-name (meta %)) name-filter))
                       (seq include) (filter #(matches-metadata? (meta %) {:include include}))
                       (seq exclude) (filter #(matches-metadata? (meta %) {:exclude exclude})))]
        (when (seq filtered)
          (t/test-vars filtered))))
    env))

;; ---------------------------------------------------------------------------
;; Filter parsing (from CLI args / env vars)
;; ---------------------------------------------------------------------------

(defn parse-filters
  "Parse filter arguments from CLI args or environment variables.
   Returns {:name-filter \"...\" :include #{...} :exclude #{...}}

   Reads from:
     EVE_TEST_NAME    - var name regex
     EVE_TEST_INCLUDE - comma-separated metadata tags to include
     EVE_TEST_EXCLUDE - comma-separated metadata tags to exclude"
  []
  (let [node? (and (exists? js/process) (exists? js/process.env))
        get-env (fn [k] (when node? (aget js/process.env k)))]
    {:name-filter (get-env "EVE_TEST_NAME")
     :include     (when-let [s (get-env "EVE_TEST_INCLUDE")]
                    (set (map keyword (.split s ","))))
     :exclude     (when-let [s (get-env "EVE_TEST_EXCLUDE")]
                    (set (map keyword (.split s ","))))}))
