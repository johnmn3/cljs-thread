(ns cljs-thread.test.reporter
  "Structured test reporters for cljs-thread test runner.

   Available reporters:
   - ::human  — colored terminal output with ANSI codes
   - ::tap    — Test Anything Protocol (TAP) format
   - ::junit  — JUnit XML (for CI integration)
   - ::edn    — machine-readable EDN output

   Each reporter derives from ::cljs.test/default and overrides
   the relevant multimethod dispatch values.

   Usage:
     (t/run-tests (assoc (t/empty-env) :reporter ::reporter/human)
                  'my.test-ns)"
  (:require [cljs.test :as t]
            [clojure.string :as str]))

;; ---------------------------------------------------------------------------
;; ANSI color codes
;; ---------------------------------------------------------------------------

(def ^:private BOLD   "\033[1m")
(def ^:private RED    "\033[31m")
(def ^:private GREEN  "\033[32m")
(def ^:private YELLOW "\033[33m")
(def ^:private CYAN   "\033[36m")
(def ^:private DIM    "\033[2m")
(def ^:private RESET  "\033[0m")

(def ^:private node?
  "True when running in Node.js (supports ANSI)."
  (and (exists? js/process) (exists? js/process.versions)))

(defn- c
  "Apply ANSI color if in a terminal that supports it."
  [color text]
  (if node?
    (str color text RESET)
    text))

;; ---------------------------------------------------------------------------
;; Failure accumulator (for persistence / retry)
;; ---------------------------------------------------------------------------

(def accumulated-failures
  "Atom collecting failure/error details for persistence."
  (atom []))

(defn clear-failures! []
  (reset! accumulated-failures []))

(defn get-failures []
  @accumulated-failures)

;; ---------------------------------------------------------------------------
;; Timing
;; ---------------------------------------------------------------------------

(def ^:private current-test-start (atom nil))
(def ^:private current-ns-start (atom nil))

;; ---------------------------------------------------------------------------
;; Human reporter
;; ---------------------------------------------------------------------------

(derive ::human ::t/default)

(defmethod t/report [::human :begin-run-tests] [_m]
  (clear-failures!))

(defmethod t/report [::human :begin-test-ns] [m]
  (reset! current-ns-start (.now js/Date))
  (println (str "\n" (c BOLD (str "Testing " (:ns m))))))

(defmethod t/report [::human :end-test-ns] [m]
  (let [elapsed (- (.now js/Date) @current-ns-start)]
    (println (str (c DIM (str "  (" elapsed "ms)"))))))

(defmethod t/report [::human :begin-test-var] [m]
  (reset! current-test-start (.now js/Date))
  (print (str "  " (-> m :var meta :name) " ")))

(defmethod t/report [::human :end-test-var] [m]
  (let [elapsed (- (.now js/Date) @current-test-start)]
    (println (str (c GREEN "OK") (c DIM (str " (" elapsed "ms)"))))))

(defmethod t/report [::human :pass] [m]
  (t/inc-report-counter! :pass))

(defmethod t/report [::human :fail] [m]
  (t/inc-report-counter! :fail)
  (println (c RED "FAIL"))
  (when-let [msg (:message m)] (println (str "    " msg)))
  (println (str "    " (c RED "expected:") " " (pr-str (:expected m))))
  (println (str "    " (c RED "  actual:") " " (pr-str (:actual m))))
  ;; Accumulate for persistence
  (swap! accumulated-failures conj
         {:ns   (str (t/testing-vars-str m))
          :message (str "expected: " (pr-str (:expected m))
                        " actual: " (pr-str (:actual m)))}))

(defmethod t/report [::human :error] [m]
  (t/inc-report-counter! :error)
  (println (c RED "ERROR"))
  (when-let [msg (:message m)] (println (str "    " msg)))
  (println (str "    " (c RED (pr-str (:actual m)))))
  (swap! accumulated-failures conj
         {:ns (str (t/testing-vars-str m))
          :message (str (:actual m))}))

(defmethod t/report [::human :summary] [{:keys [test pass fail error]}]
  (let [total (+ pass fail error)
        ok?   (and (zero? fail) (zero? error))
        color (if ok? GREEN RED)]
    (println)
    (println (c color (str (c BOLD
                             (str "Ran " test " tests, " total " assertions. "
                                  fail " failures, " error " errors.")))))))

;; ---------------------------------------------------------------------------
;; TAP reporter (Test Anything Protocol)
;; ---------------------------------------------------------------------------

(derive ::tap ::t/default)

(def ^:private tap-counter (atom 0))
(def ^:private tap-current-ok (atom true))

(defmethod t/report [::tap :begin-run-tests] [_m]
  (reset! tap-counter 0)
  (clear-failures!))

(defmethod t/report [::tap :begin-test-var] [_m]
  (reset! tap-current-ok true))

(defmethod t/report [::tap :pass] [m]
  (t/inc-report-counter! :pass))

(defmethod t/report [::tap :fail] [m]
  (t/inc-report-counter! :fail)
  (reset! tap-current-ok false)
  (swap! accumulated-failures conj
         {:ns (str (t/testing-vars-str m))
          :message (str "expected: " (pr-str (:expected m)))}))

(defmethod t/report [::tap :error] [m]
  (t/inc-report-counter! :error)
  (reset! tap-current-ok false)
  (swap! accumulated-failures conj
         {:ns (str (t/testing-vars-str m))
          :message (str (:actual m))}))

(defmethod t/report [::tap :end-test-var] [m]
  (let [n (swap! tap-counter inc)
        test-name (-> m :var meta :name)]
    (println (str (if @tap-current-ok "ok" "not ok") " " n " - " test-name))))

(defmethod t/report [::tap :summary] [{:keys [test pass fail error]}]
  (println (str "1.." @tap-counter))
  (println (str "# tests " test))
  (println (str "# pass " pass))
  (println (str "# fail " (+ fail error))))

;; ---------------------------------------------------------------------------
;; JUnit XML reporter
;; ---------------------------------------------------------------------------

(derive ::junit ::t/default)

(def ^:private junit-suites (atom []))
(def ^:private junit-current-suite (atom nil))
(def ^:private junit-current-tests (atom []))
(def ^:private junit-current-failures (atom []))

(defmethod t/report [::junit :begin-run-tests] [_m]
  (reset! junit-suites [])
  (clear-failures!))

(defmethod t/report [::junit :begin-test-ns] [m]
  (reset! junit-current-suite (str (:ns m)))
  (reset! junit-current-tests [])
  (reset! junit-current-failures []))

(defmethod t/report [::junit :begin-test-var] [m]
  (reset! current-test-start (.now js/Date)))

(defmethod t/report [::junit :pass] [m]
  (t/inc-report-counter! :pass))

(defmethod t/report [::junit :fail] [m]
  (t/inc-report-counter! :fail)
  (swap! junit-current-failures conj
         {:type "failure"
          :message (str "expected: " (pr-str (:expected m)))
          :actual (pr-str (:actual m))}))

(defmethod t/report [::junit :error] [m]
  (t/inc-report-counter! :error)
  (swap! junit-current-failures conj
         {:type "error"
          :message (str (:actual m))}))

(defmethod t/report [::junit :end-test-var] [m]
  (let [elapsed (/ (- (.now js/Date) @current-test-start) 1000.0)
        test-name (-> m :var meta :name)]
    (swap! junit-current-tests conj
           {:name      (str test-name)
            :classname @junit-current-suite
            :time      elapsed
            :failures  @junit-current-failures})
    (reset! junit-current-failures [])))

(defmethod t/report [::junit :end-test-ns] [_m]
  (swap! junit-suites conj
         {:name  @junit-current-suite
          :tests @junit-current-tests}))

(defn- xml-escape [s]
  (-> (str s)
      (str/replace "&" "&amp;")
      (str/replace "<" "&lt;")
      (str/replace ">" "&gt;")
      (str/replace "\"" "&quot;")))

(defmethod t/report [::junit :summary] [{:keys [test pass fail error]}]
  (println "<?xml version=\"1.0\" encoding=\"UTF-8\"?>")
  (println (str "<testsuites tests=\"" test "\" failures=\"" fail "\" errors=\"" error "\">"))
  (doseq [{:keys [name tests]} @junit-suites]
    (println (str "  <testsuite name=\"" (xml-escape name) "\" tests=\"" (count tests) "\">"))
    (doseq [{:keys [name classname time failures]} tests]
      (if (empty? failures)
        (println (str "    <testcase name=\"" (xml-escape name)
                      "\" classname=\"" (xml-escape classname)
                      "\" time=\"" time "\"/>"))
        (do
          (println (str "    <testcase name=\"" (xml-escape name)
                        "\" classname=\"" (xml-escape classname)
                        "\" time=\"" time "\">"))
          (doseq [{:keys [type message]} failures]
            (println (str "      <" type " message=\"" (xml-escape message) "\"/>")))
          (println "    </testcase>"))))
    (println "  </testsuite>"))
  (println "</testsuites>"))

;; ---------------------------------------------------------------------------
;; EDN reporter
;; ---------------------------------------------------------------------------

(derive ::edn ::t/default)

(def ^:private edn-results (atom []))

(defmethod t/report [::edn :begin-run-tests] [_m]
  (reset! edn-results [])
  (clear-failures!))

(defmethod t/report [::edn :begin-test-var] [m]
  (reset! current-test-start (.now js/Date)))

(defmethod t/report [::edn :pass] [m]
  (t/inc-report-counter! :pass))

(defmethod t/report [::edn :fail] [m]
  (t/inc-report-counter! :fail)
  (swap! edn-results conj
         {:type     :fail
          :ns       (str (some-> t/*testing-vars* first meta :ns))
          :var      (str (some-> t/*testing-vars* first meta :name))
          :expected (pr-str (:expected m))
          :actual   (pr-str (:actual m))
          :message  (:message m)}))

(defmethod t/report [::edn :error] [m]
  (t/inc-report-counter! :error)
  (swap! edn-results conj
         {:type    :error
          :ns      (str (some-> t/*testing-vars* first meta :ns))
          :var     (str (some-> t/*testing-vars* first meta :name))
          :actual  (pr-str (:actual m))
          :message (:message m)}))

(defmethod t/report [::edn :end-test-var] [m]
  (let [elapsed (- (.now js/Date) @current-test-start)]
    (swap! edn-results conj
           {:type :end-var
            :var  (str (-> m :var meta :name))
            :ms   elapsed})))

(defmethod t/report [::edn :summary] [{:keys [test pass fail error]}]
  (println (pr-str {:test    test
                    :pass    pass
                    :fail    fail
                    :error   error
                    :details @edn-results})))

;; ---------------------------------------------------------------------------
;; Reporter selection
;; ---------------------------------------------------------------------------

(defn select-reporter
  "Select a reporter by name string. Returns the reporter keyword."
  [output-mode]
  (case output-mode
    "human" ::human
    "tap"   ::tap
    "junit" ::junit
    "edn"   ::edn
    nil     ::human
    ::human))
