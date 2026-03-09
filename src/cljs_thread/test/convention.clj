(ns cljs-thread.test.convention
  "Directory scanning and tier inference for auto-discovering test namespaces.

   Convention:
     test/unit/        → :pure   (no prerequisites)
     test/eve/         → :slab   (slab allocator + atom-domain)
     test/integration/ → :worker (fat-kernel + thread mesh)
     test/perf/        → :worker (performance benchmarks)
     test/bench/       → :worker (structured benchmarks)

   Files in the flat test/cljs_thread/ layout are classified by
   namespace patterns until migration is complete.

   Test files must match *_test.cljs or *_test.clj."
  (:require [clojure.java.io :as io]
            [clojure.string :as str]))

;; ---------------------------------------------------------------------------
;; Tier mapping
;; ---------------------------------------------------------------------------

(def tier-dirs
  "Map from top-level directory name to tier keyword."
  {"unit"        :pure
   "eve"         :slab
   "integration" :worker
   "perf"        :worker
   "bench"       :worker})

(def ^:private legacy-worker-patterns
  "Namespace patterns that indicate :worker tier in the legacy flat layout."
  [#"eve-integration-test$"
   #"eve-smoke-test$"
   #"eve-mini-test$"
   #"eve-batch\d+-validation-test$"
   #"direct-sab-sync-test$"
   #"atom-transfer-test$"
   #"eve-atom-transfer-test$"
   #"future-test$"
   #"go-integration-test$"
   #"parallel-futures-repro-test$"
   #"async-primitives-test$"
   #"node-fat-kernel-test$"
   #"typed-array-sharing-test$"])

(def ^:private legacy-slab-patterns
  "Namespace patterns that indicate :slab tier in the legacy flat layout."
  [#"^cljs-thread\.eve\."
   #"typed-array-test$"])

(def ^:private legacy-perf-patterns
  "Namespace patterns that indicate :worker + :perf metadata."
  [#"eve-perf-test$"])

;; ---------------------------------------------------------------------------
;; Path utilities
;; ---------------------------------------------------------------------------

(defn path->tier
  "Given a path relative to test/, return the tier keyword.
   For the legacy flat layout (cljs_thread/*), infers tier from namespace patterns."
  [rel-path ns-str]
  (let [first-dir (first (str/split rel-path #"[/\\]"))]
    (or
     ;; New directory-based tier
     (get tier-dirs first-dir)
     ;; Legacy flat layout: infer from namespace patterns
     (cond
       (some #(re-find % ns-str) legacy-perf-patterns)   :worker
       (some #(re-find % ns-str) legacy-worker-patterns)  :worker
       (some #(re-find % ns-str) legacy-slab-patterns)    :slab
       :else :pure))))

(defn path->ns-symbol
  "Convert a file path like 'cljs_thread/eve/map_test.cljs'
   to a namespace symbol like 'cljs-thread.eve.map-test."
  [rel-path]
  (-> rel-path
      (str/replace #"\.(cljs|clj|cljc)$" "")
      (str/replace #"[/\\]" ".")
      (str/replace #"_" "-")
      symbol))

(defn ns->munged-str
  "Convert a namespace symbol to its Google Closure munged form.
   'cljs-thread.eve.map-test → \"cljs_thread.eve.map_test\""
  [ns-sym]
  (-> (str ns-sym)
      (str/replace "-" "_")))

;; ---------------------------------------------------------------------------
;; Metadata extraction
;; ---------------------------------------------------------------------------

(defn- read-ns-meta
  "Read the ns form from a file and extract metadata.
   Returns the metadata map, or {} if none found."
  [file]
  (try
    (let [content (slurp file)
          ;; Find the ns form — look for (ns ^{...} or (ns name
          ns-form (read-string content)]
      (if (and (list? ns-form) (= 'ns (first ns-form)))
        (let [name-form (second ns-form)]
          (meta name-form))
        {}))
    (catch Exception _ {})))

;; ---------------------------------------------------------------------------
;; Scanner
;; ---------------------------------------------------------------------------

(defn scan-test-dir
  "Scan a directory for *_test.cljs files. Returns a seq of maps:
   {:path \"cljs_thread/eve/map_test.cljs\"
    :ns   cljs-thread.eve.map-test
    :tier :slab
    :meta {}
    :platform nil
    :isolated? false}

   Options:
     :dir-filter      - subdirectory prefix filter (e.g. \"eve\")
     :ns-regexp       - regex string to filter namespace names
     :tier-filter     - tier keyword to filter by (:pure, :slab, :worker, or nil for all)
     :platform-filter - :node or :browser. When :node, excludes tests with
                        ^{:platform :browser} metadata and vice versa.
                        nil means no platform filtering.
     :exclude-ns      - set of namespace symbols to exclude
     :exclude-re      - regex string for namespaces to exclude"
  [test-root & {:keys [dir-filter ns-regexp tier-filter platform-filter exclude-ns exclude-re]}]
  (let [root (io/file test-root)]
    (when (.isDirectory root)
      (->> (file-seq root)
           (filter #(.isFile %))
           (filter #(re-find #"_test\.cljs$" (.getName %)))
           ;; Skip runner/ directory — those are runners, not tests
           (remove #(str/includes? (str (.toPath %)) "/runner/"))
           (map (fn [f]
                  (let [rel (str (.relativize (.toPath root) (.toPath f)))
                        ns-sym (path->ns-symbol rel)
                        ns-str (str ns-sym)
                        tier (path->tier rel ns-str)
                        file-meta (read-ns-meta f)
                        platform (:platform file-meta)]
                    {:path      rel
                     :ns        ns-sym
                     :tier      (or (:tier file-meta) tier)
                     :meta      (or file-meta {})
                     :platform  platform
                     :isolated? (boolean (:isolated file-meta))})))
           (filter (fn [{:keys [path ns tier platform]}]
                     (and (or (nil? dir-filter)
                              (str/starts-with? path dir-filter))
                          (or (nil? ns-regexp)
                              (re-find (re-pattern ns-regexp) (str ns)))
                          (or (nil? tier-filter)
                              (= tier-filter tier))
                          ;; Platform filtering: exclude tests that require a
                          ;; different platform than the one we're running on
                          (or (nil? platform-filter)
                              (nil? platform)
                              (= platform-filter platform))
                          (or (nil? exclude-ns)
                              (not (contains? exclude-ns ns)))
                          (or (nil? exclude-re)
                              (not (re-find (re-pattern exclude-re) (str ns)))))))
           (sort-by :ns)
           vec))))

(defn group-by-tier
  "Group discovered tests by tier. Returns {:pure [...] :slab [...] :worker [...]}."
  [tests]
  (group-by :tier tests))

(defn dominant-tier
  "Given a seq of tests, return the highest tier needed.
   :worker > :slab > :pure"
  [tests]
  (let [tiers (set (map :tier tests))]
    (cond
      (contains? tiers :worker) :worker
      (contains? tiers :slab)   :slab
      :else                     :pure)))

(defn tier-default-timeout
  "Default timeout in ms for a tier."
  [tier]
  (case tier
    :pure   10000
    :slab   30000
    :worker 120000
    60000))
