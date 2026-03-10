(ns cljs-thread.test.failures
  "Failure tracking and re-run support.

   Persists test failure data to target/.test-state/last-failures.edn
   after each test run. The :retry flag reads this file and feeds
   failed namespaces back into the discovery pipeline.

   File format:
     {:timestamp \"2026-02-27T10:30:00Z\"
      :opt-level :none
      :failures [{:ns \"cljs-thread.eve.map-test\"
                  :var \"assoc-basic-test\"
                  :message \"expected (= {:a 1} @m), actual {:a 2}\"}]}

   The CLJS-side reporter (cljs-thread.test.reporter) accumulates failures
   and writes them to stdout as EDN. The JVM orchestrator captures
   this output and persists it."
  (:require [clojure.java.io :as io]
            [clojure.edn :as edn]
            [clojure.string :as str]))

(def ^:private state-dir "target/.test-state")
(def ^:private failures-file (str state-dir "/last-failures.edn"))

;; ---------------------------------------------------------------------------
;; Persistence
;; ---------------------------------------------------------------------------

(defn persist-failures!
  "Write failure data to the state file."
  [failures & {:keys [opt-level]}]
  (let [f (io/file failures-file)]
    (io/make-parents f)
    (spit f (pr-str {:timestamp  (str (java.time.Instant/now))
                     :opt-level  opt-level
                     :failures   failures}))))

(defn load-failures
  "Load the last failure data. Returns nil if no file exists."
  []
  (let [f (io/file failures-file)]
    (when (.exists f)
      (try
        (edn/read-string (slurp f))
        (catch Exception e
          (println (str "Warning: could not read " failures-file ": " (.getMessage e)))
          nil)))))

(defn clear-failures!
  "Remove the failure state file."
  []
  (let [f (io/file failures-file)]
    (when (.exists f)
      (.delete f))))

;; ---------------------------------------------------------------------------
;; Retry filtering
;; ---------------------------------------------------------------------------

(defn failed-ns-filter
  "Given loaded failure data, return a namespace regex string
   that matches only the failed namespaces."
  [failure-data]
  (when-let [failures (seq (:failures failure-data))]
    (let [ns-names (->> failures
                        (map :ns)
                        (filter some?)
                        distinct)]
      (when (seq ns-names)
        (str/join "|" (map #(str "^" (java.util.regex.Pattern/quote %) "$") ns-names))))))

(defn failed-var-names
  "Given loaded failure data, return a set of fully-qualified var name strings."
  [failure-data]
  (when-let [failures (seq (:failures failure-data))]
    (->> failures
         (map (fn [{:keys [ns var]}]
                (when (and ns var)
                  (str ns "/" var))))
         (filter some?)
         set)))

;; ---------------------------------------------------------------------------
;; Summary
;; ---------------------------------------------------------------------------

(defn print-failure-summary
  "Print a summary of last failures for the retry prompt."
  []
  (if-let [data (load-failures)]
    (let [{:keys [timestamp opt-level failures]} data]
      (println (str "Last failure: " timestamp " (" (name (or opt-level :unknown)) ")"))
      (println (str "Failed " (count failures) " test(s):"))
      (doseq [{:keys [ns var message]} failures]
        (println (str "  " ns (when var (str "/" var))))
        (when message
          (println (str "    " message))))
      (println))
    (println "No previous failures found.")))
