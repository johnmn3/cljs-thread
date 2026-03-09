(ns cljs-thread.runner.eve-xray-main
  "X-RAY step debugger: exercises the SAB allocator one operation at a time,
   running validate-storage-model! after each step.

   Runs entirely on the main thread — no workers, no cljs-thread.
   Each step prints its name, runs the operation, then runs X-RAY.
   Stops at the first invariant violation and prints the exact step that broke it.

   Build & run:
     npx shadow-cljs compile eve-xray
     node target/thread-test/xray.js"
  (:require
   [cljs-thread.eve.shared-atom :as a]
   [cljs-thread.eve.data :as d]
   [cljs-thread.eve.deftype-proto.alloc :as alloc]
   ;; sab_map must be loaded so direct-map-encoder is registered
   [cljs-thread.eve.map]))

;; ---------------------------------------------------------------------------
;; Step infrastructure
;; ---------------------------------------------------------------------------

(def ^:private step-num (cljs.core/atom 0))
(def ^:private the-env (cljs.core/atom nil))

(defn- step!
  "Run one step: print label, execute thunk, X-RAY, check invariant.
   Returns the thunk's return value, or throws on invariant failure."
  [label thunk]
  (let [n (swap! step-num inc)]
    (println (str "\n------------------------------------------------"))
    (println (str "  STEP " n ": " label))
    (println (str "------------------------------------------------"))
    (let [result (thunk)
          env @the-env
          xray (a/validate-storage-model! env {:width 80 :label (str "S" n " " label)})]
      (if (:valid? xray)
        (do (println (str "  >> STEP " n " PASSED"))
            result)
        (do (println (str "  >> STEP " n " FAILED -- invariant broken!"))
            (println (str "    Gaps: " (count (:gaps xray))))
            (println (str "    Overlaps: " (count (:overlaps xray))))
            (println (str "    Mirror mismatches: " (count (:mirror-mismatches xray))))
            (println (str "    Lost bytes: " (- (:expected xray) (:tracked xray))))
            ;; Also run TELESCOPE + MICROSCOPE for full picture
            (a/dump-block-stats! env)
            (a/dump-block-detail! env {:limit 30})
            (throw (js/Error. (str "Invariant broken at step " n ": " label))))))))

;; ---------------------------------------------------------------------------
;; Main
;; ---------------------------------------------------------------------------

(defn- run-tests! []
  ;; Use a modest SAB so problems surface faster
  (def the-atom (a/atom-domain {}
                                :sab-size (* 4 1024 1024)
                                :max-blocks 4096))
  (reset! the-env (.-s-atom-env the-atom))
  ;; Register legacy env for overflow allocations
  (alloc/register-legacy-env! @the-env)

  (try
    ;; ─── Phase 1: Basic AtomDomain operations ───────────────────────────

    (step! "Fresh empty atom"
      (fn []
        (let [v @the-atom]
          (println (str "    deref => " (pr-str v) " (type: " (type v) ")")))))

    (step! "swap! assoc :a 1"
      (fn []
        (let [result (swap! the-atom assoc :a 1)]
          (println (str "    swap! returned: " (pr-str result)))
          (let [v @the-atom]
            (println (str "    deref after => " (pr-str v) " keys=" (count v)))))))

    (step! "swap! assoc :b 2"
      (fn []
        (swap! the-atom assoc :b 2)
        (let [v @the-atom]
          (println (str "    deref => " (pr-str v) " keys=" (count v))))))

    (step! "swap! assoc :c 3"
      (fn []
        (swap! the-atom assoc :c 3)
        (let [v @the-atom]
          (println (str "    deref => " (pr-str v) " keys=" (count v))))))

    (step! "swap! dissoc :a"
      (fn [] (swap! the-atom dissoc :a)))

    (step! "swap! assoc 10 keys"
      (fn [] (swap! the-atom merge
                    (into {} (map (fn [i] [(keyword (str "k" i)) i]) (range 10))))))

    (step! "swap! dissoc 5 keys"
      (fn [] (swap! the-atom
                    (fn [m] (reduce dissoc m [:k0 :k1 :k2 :k3 :k4])))))

    (step! "swap! grow to 50 keys"
      (fn [] (swap! the-atom merge
                    (into {} (map (fn [i] [(keyword (str "g" i)) (* i i)]) (range 50))))))

    (step! "swap! replace all 50 keys (new values)"
      (fn [] (swap! the-atom
                    (fn [m] (reduce (fn [m i] (assoc m (keyword (str "g" i)) (- i)))
                                    m (range 50))))))

    ;; ─── Phase 2: Embedded atoms ────────────────────────────────────────

    (step! "Create embedded atom e1 = {:x 1}"
      (fn [] (def e1 (binding [d/*parent-atom* the-atom]
                       (a/atom {:x 1})))))

    (step! "swap! e1 assoc :y 2"
      (fn [] (swap! e1 assoc :y 2)))

    (step! "swap! e1 assoc :z 3"
      (fn [] (swap! e1 assoc :z 3)))

    (step! "Create embedded atom e2 = {:counter 0}"
      (fn [] (def e2 (binding [d/*parent-atom* the-atom]
                       (a/atom {:counter 0})))))

    (step! "swap! e2 update :counter inc (x10)"
      (fn []
        (dotimes [_ 10]
          (swap! e2 update :counter inc))))

    (step! "Create 5 more embedded atoms"
      (fn []
        (def extra-atoms
          (vec (for [i (range 5)]
                 (binding [d/*parent-atom* the-atom]
                   (a/atom {:id i :data (str "atom-" i)})))))))

    (step! "swap! each of 5 atoms once"
      (fn []
        (doseq [[i ea] (map-indexed vector extra-atoms)]
          (swap! ea assoc :updated true :idx i))))

    ;; ─── Phase 3: Rapid swap cycles (alloc + free churn) ────────────────

    (step! "Rapid 100 swaps on e1 (counter increment)"
      (fn []
        (swap! e1 assoc :counter 0)
        (dotimes [_ 100]
          (swap! e1 update :counter inc))))

    (step! "Rapid 100 swaps on parent atom (key rotation)"
      (fn []
        (dotimes [i 100]
          (swap! the-atom assoc (keyword (str "rot" (mod i 20))) i))))

    ;; ─── Phase 4: Large map growth ──────────────────────────────────────

    (step! "Grow e1 to 200-key map"
      (fn []
        (swap! e1 merge
               (into {} (map (fn [i] [(keyword (str "k" i)) {:val i}])
                             (range 200))))))

    (step! "Replace all 200 keys in e1"
      (fn []
        (swap! e1
               (fn [m] (reduce (fn [m i] (assoc m (keyword (str "k" i)) {:val (- i)}))
                                m (range 200))))))

    (step! "Shrink e1 back to 10 keys"
      (fn []
        (swap! e1
               (fn [m] (reduce dissoc m
                                (map (fn [i] (keyword (str "k" i)))
                                     (range 10 200)))))))

    ;; ─── Phase 5: Stress — many atoms, many swaps ───────────────────────

    (step! "Create 20 embedded atoms with 50-key maps"
      (fn []
        (def stress-atoms
          (vec (for [i (range 20)]
                 (binding [d/*parent-atom* the-atom]
                   (a/atom (into {} (map (fn [j] [(keyword (str "s" j)) (* i j)])
                                         (range 50))))))))))

    (step! "Swap each of 20 atoms 10 times"
      (fn []
        (doseq [[i sa] (map-indexed vector stress-atoms)]
          (dotimes [j 10]
            (swap! sa assoc (keyword (str "s" (mod j 50))) (* i j 100))))))

    (step! "Final state verification"
      (fn []
        ;; Deref everything to confirm it's readable
        (let [parent-val @the-atom
              e1-val @e1
              e2-val @e2]
          (println (str "    Parent keys: " (count parent-val)))
          (println (str "    e1 keys: " (count e1-val)))
          (println (str "    e2 counter: " (:counter e2-val))))))

    ;; ─── Summary ────────────────────────────────────────────────────────

    (println "\n══════════════════════════════════════════════════")
    (println (str "  ALL " @step-num " STEPS PASSED"))
    (println "══════════════════════════════════════════════════")
    (js/process.exit 0)

    (catch :default e
      (println (str "\n  STOPPED at step " @step-num ": " (.-message e)))
      (js/process.exit 1))))

(defn main []
  (println "=== X-RAY Step Debugger ===")
  (println "Exercises SAB allocator one operation at a time.")
  (println "Stops at the first invariant violation.\n")
  (println "Initializing slab allocator...")
  (-> (alloc/init!)
      (.then (fn [_]
               (println "Slabs ready.\n")
               (run-tests!)))
      (.catch (fn [err]
                (println "Slab init failed:" (.-message err))
                (js/process.exit 1)))))
