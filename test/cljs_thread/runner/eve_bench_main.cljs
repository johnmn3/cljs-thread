(ns cljs-thread.runner.eve-bench-main
  "Main-thread entry point for the benchmark framework.

   Bootstrap sequence:
     1. Create AtomDomain on main thread
     2. Install fat kernel, init cljs-thread
     3. Capture git metadata (branch, commit, message)
     4. Dispatch run-bench! to :core worker
     5. Persist results:
        a. EDN files → bench/<test-name>/<timestamp>-<mode>.edn
        b. Source annotation → comments under each deftest

   Build & run:
     ;; Dev mode (:none optimizations)
     npx shadow-cljs compile eve-bench-worker eve-bench
     node target/eve-bench/bench.js

     ;; Release mode (:advanced optimizations)
     npx shadow-cljs release eve-bench-worker eve-bench
     node target/eve-bench/bench.js"
  (:require-macros [cljs-thread.core :refer [in on-when]])
  (:require
   [cljs-thread.core :as thread]
   [cljs-thread.eve :as eve]
   [cljs-thread.state :as s]
   [cljs-thread.strategy.fat-kernel :as fat-kernel]
   [cljs-thread.future]
   [cljs-thread.injest]
   [cljs-thread.runner.thread-test-runner]
   [cljs-thread.eve.shared-atom :as a]
   [clojure.string :as str]))

;; ---------------------------------------------------------------------------
;; Node.js interop
;; ---------------------------------------------------------------------------

(def ^:private fs     (js* "require('fs')"))
(def ^:private path   (js* "require('path')"))
(def ^:private cp     (js* "require('child_process')"))

(defn- exec-sync
  "Run a shell command synchronously, return trimmed stdout."
  [cmd]
  (try
    (str/trim (.toString (.execSync cp cmd #js {:encoding "utf8"})))
    (catch :default _ "")))

(defn- mkdir-p [dir]
  (.mkdirSync fs dir #js {:recursive true}))

(defn- write-file [filepath content]
  (.writeFileSync fs filepath content "utf8"))

(defn- read-file [filepath]
  (try
    (.readFileSync fs filepath "utf8")
    (catch :default _ nil)))

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
;; EDN pretty-printing (simple, no dependencies)
;; ---------------------------------------------------------------------------

(defn- pad-key
  "Right-pad a keyword string to `width` characters."
  [k width]
  (let [s (pr-str k)
        padding (- width (count s))]
    (str s (apply str (repeat (max 0 padding) " ")))))

(defn- pretty-edn
  "Pretty-print a map as an aligned EDN string.
   Keys are left-aligned, values are right-aligned to the longest key."
  [m]
  (let [entries (seq m)
        max-key-len (reduce max 0 (map #(count (pr-str (key %))) entries))
        lines (map (fn [[k v]]
                     (str (pad-key k max-key-len) " " (pr-str v)))
                   entries)]
    (str "{" (first lines) "\n"
         (str/join "\n" (map #(str " " %) (rest lines)))
         "}")))

;; ---------------------------------------------------------------------------
;; EDN file persistence
;;
;; bench/<test-name>/<timestamp>-<mode>.edn
;; ---------------------------------------------------------------------------

(defn- iso-timestamp []
  (.toISOString (js/Date.)))

(defn- fs-safe-timestamp
  "ISO timestamp with colons replaced for filesystem safety."
  [ts]
  (-> ts (str/replace ":" "-") (str/replace "." "-")))

(defn- persist-result!
  "Write a single benchmark result to an EDN file."
  [bench-dir test-name result timestamp git-meta mode]
  (let [test-dir (.resolve path bench-dir test-name)
        filename (str (fs-safe-timestamp timestamp) "-" mode ".edn")
        filepath (.resolve path test-dir filename)
        full-result (merge {:benchmark     test-name
                            :timestamp     timestamp
                            :optimizations mode
                            :node-version  js/process.version}
                           git-meta
                           result)]
    (mkdir-p test-dir)
    (write-file filepath (pretty-edn full-result))
    (println (str "  → " filepath))))

(defn- persist-all-results!
  "Write EDN files for all benchmark results."
  [bench-dir results timestamp git-meta mode]
  (println "\n── Persisting results ──")
  (doseq [[test-name result] results]
    (persist-result! bench-dir test-name result timestamp git-meta mode)))

;; ---------------------------------------------------------------------------
;; Source file annotation
;;
;; After each (deftest name ...) in the perf test file, insert/update a
;; comment block showing the last run's results.
;; ---------------------------------------------------------------------------

(defn- bench-annotation
  "Build the comment block for a benchmark result."
  [test-name result timestamp git-meta mode]
  (let [branch (:branch git-meta)
        commit (:commit git-meta)
        ms (:elapsed-ms result)
        ops (:ops result)
        ms-op (:ms-per-op result)
        passed (:passed result)
        detail (:detail result)]
    (str
     ";; ── bench: " timestamp " ── " branch " @ " commit " ── " mode " ──\n"
     ";; {:elapsed-ms " (when ms (.toFixed ms 1)) "\n"
     (when ops (str ";;  :ops        " ops "\n"))
     (when ms-op (str ";;  :ms-per-op  " (.toFixed ms-op 2) "\n"))
     (when (some? passed) (str ";;  :passed     " passed "\n"))
     (when detail
       (str ";;  :detail     " (pr-str detail) "\n"))
     ";; }")))

(defn- strip-existing-annotations
  "Remove all existing bench annotation blocks from source lines."
  [source]
  (let [lines (str/split-lines source)
        ;; An annotation block starts with `;; ── bench:` and continues
        ;; through lines starting with `;;` until a non-`;;` line or
        ;; a line that starts `;; }` (the closing brace).
        filtered
        (loop [remaining lines
               out []
               skip? false]
          (if (empty? remaining)
            out
            (let [line (first remaining)
                  trimmed (str/trim line)]
              (cond
                ;; Start of annotation block
                (str/starts-with? trimmed ";; ── bench:")
                (recur (rest remaining) out true)

                ;; Inside annotation block — skip until `;;  }` or `;; }`
                (and skip? (or (= trimmed ";; }")
                               (= trimmed ";;  }")))
                (recur (rest remaining) out false)

                ;; Inside annotation block — keep skipping `;;` lines
                (and skip? (str/starts-with? trimmed ";;"))
                (recur (rest remaining) out true)

                ;; Not in annotation — done skipping
                :else
                (recur (rest remaining) (conj out line) false)))))]
    (str/join "\n" filtered)))

(defn- find-deftest-end
  "Find the line index where a (deftest ...) form closes.
   Uses paren depth counting, skipping strings and comments."
  [lines start-idx]
  (loop [i start-idx
         depth 0
         in-string? false]
    (if (>= i (count lines))
      i
      (let [line (nth lines i)
            ;; Process character by character
            [new-depth new-in-string?]
            (loop [j 0
                   d depth
                   s? in-string?]
              (if (>= j (count line))
                [d s?]
                (let [ch (.charAt line j)]
                  (cond
                    ;; Toggle string state on unescaped "
                    (and (= ch "\"") (or (zero? j)
                                         (not= (.charAt line (dec j)) "\\")))
                    (recur (inc j) d (not s?))

                    ;; Inside string — skip
                    s?
                    (recur (inc j) d s?)

                    ;; Line comment — skip rest of line
                    (= ch ";")
                    [d s?]

                    ;; Parens
                    (= ch "(") (recur (inc j) (inc d) s?)
                    (= ch ")") (recur (inc j) (dec d) s?)

                    :else (recur (inc j) d s?)))))]
        (if (and (> i start-idx) (pos? depth) (<= new-depth 0))
          (inc i) ;; This line closes the form
          (recur (inc i) new-depth new-in-string?))))))

(defn- annotate-source!
  "Update the perf test source file with benchmark result comments."
  [source-path results timestamp git-meta mode]
  (when-let [source (read-file source-path)]
    (let [cleaned (strip-existing-annotations source)
          lines (vec (str/split-lines cleaned))
          ;; Find all deftest positions
          deftest-indices
          (keep-indexed
           (fn [i line]
             (when-let [m (re-find #"^\(deftest\s+(\S+)" (str/trim line))]
               {:idx i :name (second m)}))
           lines)
          ;; Build insertions: [{:after-idx N :text "..."}]
          ;; Process in reverse order so indices don't shift
          insertions
          (->> deftest-indices
               (filter #(get results (:name %)))
               (map (fn [{:keys [idx name]}]
                      (let [end-idx (find-deftest-end lines idx)
                            result (get results name)
                            annotation (bench-annotation name result timestamp git-meta mode)]
                        {:after-idx end-idx :text annotation})))
               (sort-by :after-idx >)) ;; reverse order
          ;; Apply insertions from bottom to top
          final-lines
          (reduce
           (fn [ls {:keys [after-idx text]}]
             (let [before (subvec ls 0 after-idx)
                   after  (subvec ls after-idx)]
               (into (conj before text) after)))
           lines
           insertions)
          final-source (str (str/join "\n" final-lines) "\n")]
      (write-file source-path final-source)
      (println (str "  → Annotated " source-path
                    " (" (count insertions) " benchmarks)")))))

;; ---------------------------------------------------------------------------
;; Main
;; ---------------------------------------------------------------------------

(defn main []
  (let [mode (optimizations)]
    (println "=== Eve + cljs-thread Benchmarks ===")
    (println (str "Node.js: " js/process.version
                  " | Optimizations: " mode))

    ;; 1. Create AtomDomain on main thread (use defaults — benchmark what we ship)
    (let [my-atom (a/atom-domain {:x 42})]
      ;; X-RAY: verify fresh SAB passes invariants
      (a/validate-storage-model! (.-s-atom-env my-atom))
      (reset! s/eve-sab-config (eve/sab-transfer-data my-atom)))

    ;; 2. Install fat kernel and init cljs-thread
    (let [worker-path (.resolve path (.dirname path js/__filename) "worker.js")
          worker-source (.readFileSync fs worker-path "utf8")]
      (fat-kernel/install! {:kernel-source-str worker-source})
      (thread/init!
       {:core-connect-string   worker-path
        :future-connect-string worker-path
        :injest-connect-string worker-path
        :future-count          16}))

    ;; 3. Timeout guard (generous for benchmarks with 16 workers)
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
      ;; Give all 16 fp workers time to register before starting bench
      (js/setTimeout
       (fn []
         (println (str "All peers: " (set (keys @s/peers))))
         (let [git-meta  (git-info)
               timestamp (iso-timestamp)
               ;; Resolve paths relative to the project root
               bench-dir (.resolve path (.dirname path js/__filename)
                                   ".." ".." "bench")
               source-path (.resolve path (.dirname path js/__filename)
                                     ".." ".." "test" "cljs_thread"
                                     "eve_perf_test.cljs")]
           (println (str "Git: " (:branch git-meta)
                         " @ " (:commit git-meta)))
           (-> @(in :core [] (cljs-thread.runner.thread-test-runner/run-bench!))
               (.then (fn [results]
                        (println (str "\n── " (count results) " benchmark results ──"))
                        ;; 5. Persist EDN files
                        (persist-all-results! bench-dir results
                                              timestamp git-meta mode)
                        ;; 6. Annotate source file
                        (println "\n── Annotating source ──")
                        (annotate-source! source-path results
                                          timestamp git-meta mode)
                        ;; 7. Done
                        (println "\n── Benchmarks complete ──")
                        (js/setTimeout #(js/process.exit 0) 500)))
               (.catch (fn [err]
                         (println (str "\nFATAL: " (str err)))
                         (js/process.exit 1))))))
       8000))))
