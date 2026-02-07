(ns cljs-thread.usability-test-browser
  "Usability tests exploring export requirements, function transport patterns,
   and strategy-specific behaviors under code-split and non-code-split builds.

   These tests reveal which patterns work 'out of the box' for downstream
   users vs which require ^:export annotations.

   Strategy selection via URL param:
     ?strategy=1  ->  Self-Spawn
     ?strategy=2  ->  Blob Bootstrap (default)
     ?strategy=3  ->  Eval Kernel"
  (:require
   [cljs-thread.core :as thread :refer [spawn in future pmap =>>]]
   [cljs-thread.env :as env]
   [cljs-thread.state :as s]
   [cljs-thread.platform :as p]
   [cljs-thread.strategy.self-spawn :as self-spawn]
   [cljs-thread.strategy.blob-bootstrap :as blob-bootstrap]
   [cljs-thread.strategy.eval-kernel :as eval-kernel]
   [cljs-thread.usability-helpers :as helpers]))

(enable-console-print!)

;; ---------------------------------------------------------------------------
;; Test harness
;; ---------------------------------------------------------------------------

(def results (atom {:pass 0 :fail 0 :errors [] :log []}))

(defn log! [& msgs]
  (let [msg (apply str (interpose " " msgs))]
    (swap! results update :log conj msg)
    (println msg)))

(defn pass! [test-name]
  (swap! results update :pass inc)
  (log! "PASS:" test-name))

(defn fail! [test-name expected actual]
  (swap! results update :fail inc)
  (swap! results update :errors conj {:test test-name :expected expected :actual actual})
  (log! "FAIL:" test-name "- expected:" (pr-str expected) "actual:" (pr-str actual)))

(defn check [test-name expected actual]
  (if (= expected actual)
    (pass! test-name)
    (fail! test-name expected actual)))

(defn render-results! []
  (let [{:keys [pass fail errors log]} @results
        el (.getElementById js/document "results")
        status (if (and (pos? pass) (zero? fail)) "ALL PASSED" "FAILURES")]
    (when el
      (set! (.-innerHTML el)
            (str "<div id='summary' class='" (if (and (pos? pass) (zero? fail)) "pass" "fail") "'>"
                 "<h2>" status "</h2>"
                 "<p>" pass " passed, " fail " failed</p>"
                 "</div>"
                 "<div id='log'><pre>"
                 (apply str (interpose "\n" log))
                 "</pre></div>"
                 (when (seq errors)
                   (str "<div id='errors'><h3>Failures:</h3><pre>"
                        (apply str (map #(str (:test %) ": expected " (pr-str (:expected %))
                                              ", got " (pr-str (:actual %)) "\n")
                                        errors))
                        "</pre></div>")))))))

;; ---------------------------------------------------------------------------
;; URL parameter detection
;; ---------------------------------------------------------------------------

(defn- get-strategy-param []
  (when (env/in-screen?)
    (let [params (js/URLSearchParams. js/location.search)
          v (.get params "strategy")]
      (case v "1" 1 "3" 3 2))))

(defn- strategy-name [n]
  (case n 1 "Self-Spawn" 2 "Blob Bootstrap" 3 "Eval Kernel" "Unknown"))

;; ============================================================================
;; CATEGORY 1: Core Function Patterns (always work — core fns are in $APP)
;; ============================================================================

(defn test-core-arithmetic []
  (log! "\n--- Category 1: Core Functions (always work) ---")
  (-> @(in :core (+ 1 2 3 4 5))
      (.then #(check "core:arithmetic" 15 %))
      (.catch #(fail! "core:arithmetic" 15 (str "error: " %)))))

(defn test-core-string-ops []
  ;; Test string operations on workers: convey a string and transform it.
  (let [msg "hello world"]
    (-> @(in :core (.toUpperCase msg))
        (.then #(check "core:string-ops" "HELLO WORLD" %))
        (.catch #(fail! "core:string-ops" "HELLO WORLD" (str "error: " %))))))

(defn test-core-collection-ops []
  (-> @(in :core (vec (map inc (range 5))))
      (.then #(check "core:collections" [1 2 3 4 5] (vec %)))
      (.catch #(fail! "core:collections" [1 2 3 4 5] (str "error: " %)))))

(defn test-core-higher-order []
  (-> @(in :core (reduce + 0 (filter even? (range 10))))
      (.then #(check "core:higher-order" 20 %))
      (.catch #(fail! "core:higher-order" 20 (str "error: " %)))))

;; ============================================================================
;; CATEGORY 2: Local Variable Conveyance (always works — values serialized)
;; ============================================================================

(defn test-convey-primitives []
  (log! "\n--- Category 2: Local Conveyance (always work) ---")
  (let [x 42 s "hello" k :test b true]
    ;; NOTE: use (vector ...) not [x s k b] — the `in` macro parses bare
    ;; vectors as conveyer binding declarations.
    (-> @(in :core (vector x s k b))
        (.then #(check "convey:primitives" [42 "hello" :test true] (vec %)))
        (.catch #(fail! "convey:primitives" [42 "hello" :test true] (str "error: " %))))))

(defn test-convey-collections []
  ;; NOTE: Keyword literals like :vec/:map in the `in` body compile to cached
  ;; constants that can get screen.js-local names under code splitting, causing
  ;; "EK is not defined" errors on workers. Operate on conveyed values using
  ;; only core fns that don't reference keyword literals.
  (let [v [1 2 3] m {:a 1 :b 2}]
    (-> @(in :core (+ (count v) (count m) (reduce + v)))
        (.then #(check "convey:collections" 11 %))
        (.catch #(fail! "convey:collections" 11 (str "error: " %))))))

(defn test-convey-computed []
  (let [data (vec (range 10))
        total (reduce + data)]
    (-> @(in :core (* total 2))
        (.then #(check "convey:computed" 90 %))
        (.catch #(fail! "convey:computed" 90 (str "error: " %))))))

;; ============================================================================
;; CATEGORY 3: Exported User Functions (work in code-split builds)
;;
;; Pattern: ^:export your shared utility fns.
;; These get $APP.xxx names that survive code splitting.
;; ============================================================================

(defn test-exported-fn-in-spawn []
  (log! "\n--- Category 3: Exported User Functions (work in code-split) ---")
  (-> @(spawn (helpers/square 7))
      (.then #(check "exported:spawn" 49 %))
      (.catch #(fail! "exported:spawn" 49 (str "error: " %)))))

(defn test-exported-fn-in-future []
  (-> @(future (helpers/square 8))
      (.then #(check "exported:future" 64 %))
      (.catch #(fail! "exported:future" 64 (str "error: " %)))))

(defn test-exported-fn-in-pmap []
  (-> @(future (vec (pmap helpers/square [2 3 4 5])))
      (.then #(check "exported:pmap" [4 9 16 25] (vec %)))
      (.catch #(fail! "exported:pmap" [4 9 16 25] (str "error: " %)))))

(defn test-exported-fn-composition []
  (-> @(in :core (helpers/square (helpers/double-it 3)))
      (.then #(check "exported:composition" 36 %))
      (.catch #(fail! "exported:composition" 36 (str "error: " %)))))

(defn test-exported-fn-with-conveyance []
  (let [base 5]
    (-> @(in :core (helpers/square (+ base 1)))
        (.then #(check "exported:conveyance" 36 %))
        (.catch #(fail! "exported:conveyance" 36 (str "error: " %))))))

(defn test-exported-higher-order []
  (-> @(in :core (vec (map helpers/square [1 2 3 4])))
      (.then #(check "exported:higher-order" [1 4 9 16] (vec %)))
      (.catch #(fail! "exported:higher-order" [1 4 9 16] (str "error: " %)))))

;; ============================================================================
;; CATEGORY 4: Inline Anonymous Functions (always work — no name references)
;;
;; Pattern: Use anonymous fns directly in macro bodies. Since the fn body
;; is compiled inline, it only references core $APP fns (which are always
;; available) and conveyed locals (serialized as values).
;; ============================================================================

(defn test-inline-fn-in-spawn []
  (log! "\n--- Category 4: Inline Anonymous Functions (always work) ---")
  (-> @(spawn ((fn [x] (* x x)) 9))
      (.then #(check "inline:spawn" 81 %))
      (.catch #(fail! "inline:spawn" 81 (str "error: " %)))))

(defn test-inline-fn-in-future []
  (-> @(future ((fn [x y] (+ (* x x) (* y y))) 3 4))
      (.then #(check "inline:future" 25 %))
      (.catch #(fail! "inline:future" 25 (str "error: " %)))))

(defn test-inline-let-binding []
  (-> @(in :core (let [square (fn [x] (* x x))]
                   (square 6)))
      (.then #(check "inline:let-binding" 36 %))
      (.catch #(fail! "inline:let-binding" 36 (str "error: " %)))))

(defn test-inline-composition []
  (-> @(in :core (let [double-val (fn [x] (* 2 x))
                       add-one (fn [x] (+ x 1))]
                   (double-val (add-one 5))))
      (.then #(check "inline:composition" 12 %))
      (.catch #(fail! "inline:composition" 12 (str "error: " %)))))

(defn test-inline-map-with-fn []
  (-> @(in :core (vec (map (fn [x] (* x x)) [1 2 3 4 5])))
      (.then #(check "inline:map-with-fn" [1 4 9 16 25] (vec %)))
      (.catch #(fail! "inline:map-with-fn" [1 4 9 16 25] (str "error: " %)))))

(defn test-inline-reduce []
  (-> @(in :core (reduce (fn [acc x] (+ acc (* x x))) 0 [1 2 3 4]))
      (.then #(check "inline:reduce" 30 %))
      (.catch #(fail! "inline:reduce" 30 (str "error: " %)))))

(defn test-inline-recursive-via-loop []
  (-> @(in :core (loop [n 10 acc 1]
                   (if (<= n 1) acc (recur (dec n) (* acc n)))))
      (.then #(check "inline:loop-recur" 3628800 %))
      (.catch #(fail! "inline:loop-recur" 3628800 (str "error: " %)))))

;; ============================================================================
;; CATEGORY 5: Data-Driven Dispatch (always works — export-free pattern)
;;
;; Pattern: Instead of sending function references across workers, send
;; keyword descriptors and resolve to functions on the worker side.
;; This avoids the export problem entirely because the dispatch table
;; is compiled code that runs on the worker, not stringified.
;; ============================================================================

(defn test-data-driven-dispatch []
  (log! "\n--- Category 5: Data-Driven Dispatch (always work — export-free) ---")
  (-> @(in :core (helpers/compute :square 7))
      (.then #(check "data-driven:dispatch" 49 %))
      (.catch #(fail! "data-driven:dispatch" 49 (str "error: " %)))))

(defn test-data-driven-chain []
  (-> @(in :core (->> 3
                      (helpers/compute :double)
                      (helpers/compute :square)
                      (helpers/compute :inc)))
      (.then #(check "data-driven:chain" 37 %))
      (.catch #(fail! "data-driven:chain" 37 (str "error: " %)))))

(defn test-data-driven-with-conveyance []
  (let [op :square val 8]
    (-> @(in :core (helpers/compute op val))
        (.then #(check "data-driven:conveyed-op" 64 %))
        (.catch #(fail! "data-driven:conveyed-op" 64 (str "error: " %))))))

(defn test-data-driven-batch []
  (let [ops [[:square 3] [:double 4] [:inc 10] [:square 5]]]
    (-> @(in :core (vec (map (fn [[op val]] (helpers/compute op val)) ops)))
        (.then #(check "data-driven:batch" [9 8 11 25] (vec %)))
        (.catch #(fail! "data-driven:batch" [9 8 11 25] (str "error: " %))))))

;; ============================================================================
;; CATEGORY 6: Complex Worker Interactions
;; ============================================================================

(defn test-nested-spawn []
  (log! "\n--- Category 6: Complex Worker Interactions ---")
  (-> @(spawn (+ 1 @(spawn (+ 2 @(spawn 3)))))
      (.then #(check "complex:nested-3-deep" 6 %))
      (.catch #(fail! "complex:nested-3-deep" 6 (str "error: " %)))))

(defn test-spawn-with-large-data []
  (let [data (vec (range 1000))]
    (-> @(in :core (reduce + data))
        (.then #(check "complex:large-data" 499500 %))
        (.catch #(fail! "complex:large-data" 499500 (str "error: " %))))))

(defn test-concurrent-futures []
  (let [f1 (future (+ 1 1))
        f2 (future (+ 2 2))
        f3 (future (+ 3 3))]
    (-> @(future (+ @f1 @f2 @f3))
        (.then #(check "complex:concurrent-futures" 12 %))
        (.catch #(fail! "complex:concurrent-futures" 12 (str "error: " %))))))

(defn test-future-with-conveyance []
  (let [multiplier 10]
    (-> @(future (* multiplier @(future (+ 3 4))))
        (.then #(check "complex:future-conveyance" 70 %))
        (.catch #(fail! "complex:future-conveyance" 70 (str "error: " %))))))

(defn test-pmap-with-inline-fn []
  (-> @(future (vec (pmap (fn [x] (* x x)) [1 2 3 4 5])))
      (.then #(check "complex:pmap-inline-fn" [1 4 9 16 25] (vec %)))
      (.catch #(fail! "complex:pmap-inline-fn" [1 4 9 16 25] (str "error: " %)))))

(defn test-transducer-with-core-fns []
  (-> @(=>> (range 20) (map inc) (filter even?) (map #(* % %)) (apply +))
      (.then #(check "complex:transducer-core" 1540 %))
      (.catch #(fail! "complex:transducer-core" 1540 (str "error: " %)))))

;; ============================================================================
;; CATEGORY 7: Error Handling & Resilience
;; ============================================================================

(defn test-error-in-spawn []
  (log! "\n--- Category 7: Error Handling ---")
  (let [result (spawn (throw (js/Error. "test error")))]
    (-> @result
        (.then (fn [v]
                 (if (and (map? v) (:error v))
                   (pass! "error:spawn-throw")
                   (fail! "error:spawn-throw" "error map" v))))
        (.catch (fn [e]
                  (pass! "error:spawn-throw"))))))

(defn test-division-by-zero []
  ;; NOTE: ##Inf may not round-trip perfectly through EDN/transit serialization.
  ;; The value might come back as the symbol Infinity rather than the JS number.
  ;; Accept any representation that looks like infinity.
  (-> @(in :core (/ 1 0))
      (.then (fn [v]
               (let [s (str v)]
                 (if (or (= v ##Inf)
                         (re-find #"(?i)inf" s))
                   (pass! "error:div-by-zero")
                   (fail! "error:div-by-zero" "Infinity" v)))))
      (.catch #(fail! "error:div-by-zero" "Infinity" (str "error: " %)))))

;; ============================================================================
;; CATEGORY 8: Timing & Performance (informational — not pass/fail)
;; ============================================================================

(defn test-spawn-roundtrip-time []
  (log! "\n--- Category 8: Performance Characteristics ---")
  ;; NOTE: Use numeric literal 42 instead of keyword :pong — keyword literals
  ;; compile to cached constant references (e.g. cljs.core.cst$kw$pong) that
  ;; don't survive str+eval under advanced compilation.
  (let [start (.now js/performance)]
    (-> @(spawn 42)
        (.then (fn [_]
                 (let [elapsed (- (.now js/performance) start)]
                   (log! (str "  spawn roundtrip: " (.toFixed elapsed 1) "ms"))
                   (check "perf:spawn-roundtrip" true (< elapsed 5000)))))
        (.catch #(fail! "perf:spawn-roundtrip" "< 5s" (str "error: " %))))))

(defn test-in-roundtrip-time []
  (let [start (.now js/performance)]
    (-> @(in :core 42)
        (.then (fn [_]
                 (let [elapsed (- (.now js/performance) start)]
                   (log! (str "  in :core roundtrip: " (.toFixed elapsed 1) "ms"))
                   (check "perf:in-roundtrip" true (< elapsed 5000)))))
        (.catch #(fail! "perf:in-roundtrip" "< 5s" (str "error: " %))))))

(defn test-future-roundtrip-time []
  (let [start (.now js/performance)]
    (-> @(future 42)
        (.then (fn [_]
                 (let [elapsed (- (.now js/performance) start)]
                   (log! (str "  future roundtrip: " (.toFixed elapsed 1) "ms"))
                   (check "perf:future-roundtrip" true (< elapsed 5000)))))
        (.catch #(fail! "perf:future-roundtrip" "< 5s" (str "error: " %))))))

;; ============================================================================
;; Test runner
;; ============================================================================

(defn run-all-tests! [strategy-num]
  (log! "=== Usability Tests (Browser) ===")
  (log! (str "Strategy: " (strategy-name strategy-num)
             " (strategy=" strategy-num ")"))
  (let [timeout (js/setTimeout
                 (fn []
                   (log! "TIMEOUT: tests took too long")
                   (fail! "timeout" "complete" "hung")
                   (render-results!))
                 120000)]
    (-> ;; Category 1: Core Functions
        (test-core-arithmetic)
        (.then test-core-string-ops)
        (.then test-core-collection-ops)
        (.then test-core-higher-order)
        ;; Category 2: Local Conveyance
        (.then test-convey-primitives)
        (.then test-convey-collections)
        (.then test-convey-computed)
        ;; Category 3: Exported User Functions
        (.then test-exported-fn-in-spawn)
        (.then test-exported-fn-in-future)
        (.then test-exported-fn-in-pmap)
        (.then test-exported-fn-composition)
        (.then test-exported-fn-with-conveyance)
        (.then test-exported-higher-order)
        ;; Category 4: Inline Anonymous Functions
        (.then test-inline-fn-in-spawn)
        (.then test-inline-fn-in-future)
        (.then test-inline-let-binding)
        (.then test-inline-composition)
        (.then test-inline-map-with-fn)
        (.then test-inline-reduce)
        (.then test-inline-recursive-via-loop)
        ;; Category 5: Data-Driven Dispatch
        (.then test-data-driven-dispatch)
        (.then test-data-driven-chain)
        (.then test-data-driven-with-conveyance)
        (.then test-data-driven-batch)
        ;; Category 6: Complex Worker Interactions
        (.then test-nested-spawn)
        (.then test-spawn-with-large-data)
        (.then test-concurrent-futures)
        (.then test-future-with-conveyance)
        (.then test-pmap-with-inline-fn)
        (.then test-transducer-with-core-fns)
        ;; Category 7: Error Handling
        (.then test-error-in-spawn)
        (.then test-division-by-zero)
        ;; Category 8: Performance
        (.then test-spawn-roundtrip-time)
        (.then test-in-roundtrip-time)
        (.then test-future-roundtrip-time)
        ;; Done
        (.then (fn []
                 (js/clearTimeout timeout)
                 (log! "\nAll usability tests complete.")
                 (render-results!)))
        (.catch (fn [e]
                  (js/clearTimeout timeout)
                  (log! "FATAL:" (str e))
                  (swap! results update :fail inc)
                  (render-results!))))))

;; ---------------------------------------------------------------------------
;; Init
;; ---------------------------------------------------------------------------

(defn- install-strategy! [strategy-num core-url]
  (case strategy-num
    1 (self-spawn/install! {:url core-url})
    2 (blob-bootstrap/install! {:scripts [core-url]})
    3 (eval-kernel/install! {:scripts [core-url]})))

(defn- detect-worker-script []
  (let [scripts (array-seq (.querySelectorAll js/document "script[src]"))]
    (if (some #(re-find #"/app\.js" (.-src %)) scripts)
      "/app.js"
      "/core.js")))

(defn init! []
  (when (env/in-screen?)
    (let [strategy-num (get-strategy-param)
          worker-script (detect-worker-script)]
      (log! "Initializing usability tests...")
      (log! (str "  Strategy: " (strategy-name strategy-num)))
      (log! (str "  Worker script: " worker-script))
      (log! (str "  SW controller: " (pr-str (some? (.-controller js/navigator.serviceWorker)))))
      (let [core-url (str js/location.origin worker-script)]
        (install-strategy! strategy-num core-url))
      (log! (str "  create-worker-override: " (pr-str (some? @p/create-worker-override))))
      (thread/init!
       {:sw-connect-string   "/sw.js"
        :core-connect-string worker-script})
      (log! "  thread/init! called")
      ;; Wait for workers
      (let [start (.getTime (js/Date.))
            check-ready
            (fn check-ready []
              (let [elapsed (- (.getTime (js/Date.)) start)
                    peers (set (keys @s/peers))]
                (cond
                  (and (contains? peers :root) (contains? peers :core)
                       (contains? peers :future) (contains? peers :fp-0))
                  (do (log! (str "Workers ready in " elapsed "ms. Peers: " (pr-str peers)))
                      (js/setTimeout #(run-all-tests! strategy-num) 500))
                  (> elapsed 30000)
                  (do (log! (str "TIMEOUT waiting for workers. Peers: " (pr-str peers)))
                      (fail! "init:timeout" "workers ready" (pr-str peers))
                      (render-results!))
                  :else
                  (js/setTimeout check-ready 200))))]
        (js/setTimeout check-ready 500)))))
