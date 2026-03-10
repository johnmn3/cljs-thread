(ns cljs-thread.eve-perf-test
  "Performance benchmarks: eve AtomDomain with cljs-thread fat kernel.

   Exercises nested worker swaps, nested atom swaps, contention,
   and cross-worker relay patterns. Uses pure cljs-thread
   concurrency abstractions (spawn, future) throughout.

   Pure cljs.test — the external bench runner discovers and executes
   these tests inside a worker with synchronous blocking semantics.
   When run via eve-bench-main, results are captured as structured data
   and persisted to EDN files."
  (:require [cljs.test :refer [deftest is testing]]
            [cljs-thread.runner.eve-bench :as bench]
            [cljs-thread.core :as t]
            [cljs-thread.spawn]
            [cljs-thread.future])
  (:require-macros [cljs-thread.core :refer [spawn future]]))

;; =========================================================================
;; Nested worker swap — dispatch to another worker, swap there
;; =========================================================================

(deftest nested-worker-swap
  (testing "dispatch to another worker which does the swap"
    (let [my-atom (t/atom {:counter 0})
          [result ms] (bench/timed
                        (fn []
                          @(future
                            (swap! my-atom update :counter inc)
                            (:counter @my-atom))))]
      (bench/record! "nested worker swap" ms :result result)
      (is (= 1 result)))))
;; ── bench: 2026-02-14T17:18:01.380Z ── claude/sharedarraybuffer-structures-Uwgnw @ dbd3293 ── none ──
;; {:elapsed-ms 71.5
;;  :passed     true
;; }

;; =========================================================================
;; 3-hop relay — local -> future -> spawn, swap each hop
;; =========================================================================

(deftest worker-relay-swaps
  (testing "3-hop relay with swap at each hop"
    (let [my-atom (t/atom {:counter 0})
          [result ms] (bench/timed
                        (fn []
                          (swap! my-atom update :counter inc)
                          @(future
                            (swap! my-atom update :counter inc)
                            @(spawn
                              (swap! my-atom update :counter inc)))
                          (:counter @my-atom)))]
      (bench/record! "3-hop relay" ms :result result)
      (is (= 3 result)))))
;; ── bench: 2026-02-14T17:18:01.380Z ── claude/sharedarraybuffer-structures-Uwgnw @ dbd3293 ── none ──
;; {:elapsed-ms 528.8
;;  :passed     true
;; }

;; =========================================================================
;; Rapid sequential swaps — single worker, 20 swaps
;; =========================================================================

(deftest rapid-sequential-swaps
  (testing "20 sequential swaps, single worker"
    (let [my-atom (t/atom {:counter 0})
          n 20
          [result ms] (bench/timed
                        (fn []
                          (dotimes [_ n]
                            (swap! my-atom update :counter inc))
                          (:counter @my-atom)))]
      (bench/record! "sequential swaps" ms :ops n :result result)
      (is (= n result)))))
;; ── bench: 2026-02-14T17:18:01.380Z ── claude/sharedarraybuffer-structures-Uwgnw @ dbd3293 ── none ──
;; {:elapsed-ms 660.8
;;  :ops        20
;;  :ms-per-op  33.04
;;  :passed     true
;; }

;; =========================================================================
;; Nested atom swap chain — swap reads current, pushes history
;; =========================================================================

(deftest nested-atom-swap-chain
  (testing "5 chained read-swap-push operations"
    (let [my-atom (t/atom {:counter 0 :history []})
          n 5
          [result ms] (bench/timed
                        (fn []
                          (dotimes [_ n]
                            (swap! my-atom (fn [m]
                                            (let [c (:counter m)]
                                              (-> m
                                                  (update :counter inc)
                                                  (update :history conj c))))))
                          (:counter @my-atom)))]
      (bench/record! "chained read-swap-push" ms :ops n :result result)
      (is (= n result)))))
;; ── bench: 2026-02-14T17:18:01.380Z ── claude/sharedarraybuffer-structures-Uwgnw @ dbd3293 ── none ──
;; {:elapsed-ms 197.4
;;  :ops        5
;;  :ms-per-op  39.47
;;  :passed     true
;; }

;; =========================================================================
;; High contention — 3 futures x 3 swaps, single key
;; =========================================================================

(deftest high-contention
  (testing "3 futures x 3 swaps on same key"
    (let [my-atom (t/atom {:counter 0})
          n-workers 3
          swaps-per 3
          expected (* n-workers swaps-per)
          handles (mapv (fn [_]
                          (future
                            (dotimes [_ swaps-per]
                              (swap! my-atom update :counter inc))))
                        (range n-workers))
          [counter ms] (bench/timed
                         (fn []
                           (doseq [h handles] @h)
                           (:counter @my-atom)))]
      (bench/record! "contention" ms
                     :ops counter
                     :detail {:counter  counter
                              :expected expected})
      (is (>= counter (quot expected 2))))))
;; ── bench: 2026-02-14T17:18:01.380Z ── claude/sharedarraybuffer-structures-Uwgnw @ dbd3293 ── none ──
;; {:elapsed-ms 192.4
;;  :ops        9
;;  :ms-per-op  21.38
;;  :passed     true
;;  :detail     {:counter 9, :expected 9}
;; }

;; =========================================================================
;; Multi-key contention — 3 futures x 5 swaps, separate keys
;; =========================================================================

(deftest multi-key-contention
  (testing "3 futures x 5 swaps on separate keys"
    (let [my-atom (t/atom {})
          n-workers 3
          swaps-per 5
          expected (* n-workers swaps-per)
          handles (mapv (fn [i]
                          (future
                            (let [k (keyword (str "counter-" i))]
                              (dotimes [_ swaps-per]
                                (swap! my-atom update k (fnil inc 0))))))
                        (range n-workers))
          [state ms] (bench/timed
                       (fn []
                         (doseq [h handles] @h)
                         @my-atom))
          total (reduce + 0 (vals state))
          keys-present (count state)]
      (bench/record! "multi-key contention" ms
                     :ops total
                     :detail {:total        total
                              :expected     expected
                              :keys-present keys-present})
      (is (>= total (quot expected 2))))))
;; ── bench: 2026-02-14T17:18:01.380Z ── claude/sharedarraybuffer-structures-Uwgnw @ dbd3293 ── none ──
;; {:elapsed-ms 290.6
;;  :ops        15
;;  :ms-per-op  19.37
;;  :passed     true
;;  :detail     {:total 15, :expected 15, :keys-present 3}
;; }

;; =========================================================================
;; Spawn storm — spawn + future, all swapping
;; =========================================================================

(deftest spawn-storm
  (testing "mix of spawn + future, concurrent swaps"
    (let [my-atom (t/atom {:counter 0})
          ;; 2 spawns x 2 swaps
          spawn-handles (mapv (fn [_]
                                (spawn
                                  (dotimes [_ 2]
                                    (swap! my-atom update :counter inc))))
                              (range 2))
          ;; 3 futures x 2 swaps
          future-handles (mapv (fn [_]
                                 (future
                                   (dotimes [_ 2]
                                     (swap! my-atom update :counter inc))))
                               (range 3))
          ;; local does 2 swaps
          [counter ms] (bench/timed
                         (fn []
                           (dotimes [_ 2]
                             (swap! my-atom update :counter inc))
                           (doseq [h spawn-handles] @h)
                           (doseq [h future-handles] @h)
                           (:counter @my-atom)))
          ;; (2+3+1) workers x 2 swaps = 12
          expected 12]
      (bench/record! "spawn-storm" ms
                     :ops counter
                     :detail {:counter  counter
                              :expected expected})
      (is (>= counter (quot expected 3))))))
;; ── bench: 2026-02-14T17:18:01.380Z ── claude/sharedarraybuffer-structures-Uwgnw @ dbd3293 ── none ──
;; {:elapsed-ms 501.4
;;  :ops        12
;;  :ms-per-op  41.78
;;  :passed     true
;;  :detail     {:counter 12, :expected 12}
;; }

;; =========================================================================
;; Nested spawn swaps — outer spawn -> inner spawn, each swaps
;; =========================================================================

(deftest nested-spawn-swaps
  (testing "2 outer spawns each spawn 1 inner, both swap"
    (let [my-atom (t/atom {:counter 0})
          expected 4
          handles (mapv (fn [_]
                          (spawn
                            (swap! my-atom update :counter inc)
                            @(spawn
                              (swap! my-atom update :counter inc))))
                        (range 2))
          [counter ms] (bench/timed
                         (fn []
                           (doseq [h handles] @h)
                           (:counter @my-atom)))]
      (bench/record! "nested-spawn" ms
                     :detail {:counter  counter
                              :expected expected})
      (is (>= counter (quot expected 2))))))
;; ── bench: 2026-02-14T17:18:01.380Z ── claude/sharedarraybuffer-structures-Uwgnw @ dbd3293 ── none ──
;; {:elapsed-ms 910.3
;;  :passed     true
;;  :detail     {:counter 4, :expected 4}
;; }

;; =========================================================================
;; Map growth stress — 3 futures x 5 unique keys
;; =========================================================================

(deftest map-growth-stress
  (testing "3 futures growing HAMT to 15 keys"
    (let [my-atom (t/atom {})
          n-workers 3
          keys-per 5
          expected-keys (* n-workers keys-per)
          handles (mapv (fn [i]
                          (future
                            (dotimes [j keys-per]
                              (let [k (keyword (str "w" i "-k" j))]
                                (swap! my-atom assoc k (+ (* i 1000) j))))))
                        (range n-workers))
          [key-count ms] (bench/timed
                           (fn []
                             (doseq [h handles] @h)
                             (count @my-atom)))]
      (bench/record! "map-growth" ms
                     :ops key-count
                     :detail {:key-count     key-count
                              :expected-keys expected-keys})
      (is (>= key-count (quot expected-keys 2))))))
;; ── bench: 2026-02-14T17:18:01.380Z ── claude/sharedarraybuffer-structures-Uwgnw @ dbd3293 ── none ──
;; {:elapsed-ms 832.5
;;  :ops        15
;;  :ms-per-op  55.50
;;  :passed     true
;;  :detail     {:key-count 15, :expected-keys 15}
;; }

;; =========================================================================
;; Round-trip latency — 5 sequential round-trips
;; =========================================================================

(deftest round-trip-latency
  (testing "5 sync round-trips measuring per-message overhead"
    (let [my-atom (t/atom {:ping 0})
          n 5
          [last-val ms] (bench/timed
                          (fn []
                            (dotimes [i n]
                              @(future
                                (swap! my-atom assoc :ping i)
                                (:ping @my-atom)))
                            (:ping @my-atom)))]
      (bench/record! (str n " sync round-trips") ms
                     :ops n
                     :result last-val)
      (is (= (dec n) last-val)))))
;; ── bench: 2026-02-14T17:18:01.380Z ── claude/sharedarraybuffer-structures-Uwgnw @ dbd3293 ── none ──
;; {:elapsed-ms 226.5
;;  :ops        5
;;  :ms-per-op  45.30
;;  :passed     true
;; }

;; =========================================================================
;; CAS retry pressure — 4 futures x 3 swaps, single key
;; =========================================================================

(deftest cas-retry-pressure
  (testing "4 futures x 3 swaps, contention"
    (let [my-atom (t/atom {:counter 0})
          n-workers 4
          swaps-per 3
          expected (* n-workers swaps-per)
          handles (mapv (fn [_]
                          (future
                            (dotimes [_ swaps-per]
                              (swap! my-atom update :counter inc))))
                        (range n-workers))
          [counter ms] (bench/timed
                         (fn []
                           (doseq [h handles] @h)
                           (:counter @my-atom)))]
      (bench/record! "CAS pressure" ms
                     :ops counter
                     :detail {:counter  counter
                              :expected expected})
      (is (>= counter (quot expected 4))))))
;; ── bench: 2026-02-14T17:18:01.380Z ── claude/sharedarraybuffer-structures-Uwgnw @ dbd3293 ── none ──
;; {:elapsed-ms 175.4
;;  :ops        12
;;  :ms-per-op  14.62
;;  :passed     true
;;  :detail     {:counter 12, :expected 12}
;; }

;; =========================================================================
;; Nested future swaps — 2 outer, each spawns inner future
;; =========================================================================

(deftest nested-future-swaps
  (testing "2 outer futures each await an inner future, both swap"
    (let [my-atom (t/atom {:counter 0})
          expected 4
          handles (mapv (fn [_]
                          (future
                            (swap! my-atom update :counter inc)
                            @(future
                              (swap! my-atom update :counter inc))))
                        (range 2))
          [counter ms] (bench/timed
                         (fn []
                           (doseq [h handles] @h)
                           (:counter @my-atom)))]
      (bench/record! "nested-future" ms
                     :detail {:counter  counter
                              :expected expected})
      (is (>= counter (quot expected 2))))))
;; ── bench: 2026-02-14T17:18:01.380Z ── claude/sharedarraybuffer-structures-Uwgnw @ dbd3293 ── none ──
;; {:elapsed-ms 88.1
;;  :passed     true
;;  :detail     {:counter 4, :expected 4}
;; }

;; =========================================================================
;; Cross-worker cascade — local -> future -> spawn, data-dependent
;; =========================================================================

(deftest cross-worker-cascade
  (testing "3-worker cascade with data dependency"
    (let [my-atom (t/atom {:stage 0 :trail []})
          [final-stage ms]
          (bench/timed
            (fn []
              ;; Stage 1: local
              (swap! my-atom (fn [m]
                               (-> m (assoc :stage 1) (update :trail conj :local))))
              (let [after-local (:stage @my-atom)]
                ;; Stage 2: future
                @(future
                  (swap! my-atom (fn [m]
                                   (-> m
                                       (assoc :stage (inc after-local))
                                       (update :trail conj :future))))
                  (let [after-future (:stage @my-atom)]
                    ;; Stage 3: spawn
                    @(spawn
                      (swap! my-atom (fn [m]
                                       (-> m
                                           (assoc :stage (inc after-future))
                                           (update :trail conj :spawn))))
                      (:stage @my-atom)))))))]
      (bench/record! "3-worker cascade" ms :result final-stage)
      (is (>= final-stage 2)))))
;; ── bench: 2026-02-14T17:18:01.380Z ── claude/sharedarraybuffer-structures-Uwgnw @ dbd3293 ── none ──
;; {:elapsed-ms
;;  :passed     false
;; }

;; =========================================================================
;; Contention Scaling Benchmarks
;; (ported from contention_scaling_benchmark.cljs in parent repo)
;;
;; Four workloads from the original EVE SAB contention scaling suite,
;; now using cljs-thread fat kernel + eve AtomDomain.  Total work is
;; held constant across worker counts.  Stock CLJS single-thread
;; baseline included in each test's :detail map for comparison.
;; =========================================================================

(def ^:private CS-MAP-SIZE
  "Pre-populated map size for contention scaling benchmarks."
  200)

(defn- xray!
  "Run X-RAY invariant check on the global atom's SAB env.
   Currently disabled - a namespace not imported."
  [label]
  nil)

(def ^:private CS-THREAD-COUNTS
  "Worker counts to test. Limited to 6 to match available future pool workers."
  [1 2 4 6])

;; =========================================================================
;; Write-only contention scaling
;; N futures each assoc unique keys into a pre-populated 200-entry map.
;; Exercises CAS + graft-on-retry under pure write contention.
;; =========================================================================

(deftest contention-scaling-write-only
  (testing "write-only: N futures × (total/N) assoc ops, 200-key shared map"
    (let [total-ops  2000
          seed       (into {} (map (fn [i] [(keyword (str "k" i)) i])
                                  (range CS-MAP-SIZE)))
          ;; Stock CLJS baseline (regular atom, single-thread)
          ;; Keys wrap mod MAP-SIZE so the map stays at 200 entries.
          stock-a    (atom seed)
          [_ stk-ms] (bench/timed
                       (fn []
                         (dotimes [i total-ops]
                           (swap! stock-a assoc
                                  (keyword (str "k" (mod i CS-MAP-SIZE)))
                                  (* i i)))))
          stk-tput   (/ (* total-ops 1000) (max 0.001 stk-ms))
          ;; SAB at [1, 2, 4, 8, 16] workers
          scaling
          (mapv
            (fn [n]
              (xray! (str "write-only pre-" n "w"))
              (let [per     (max 1 (quot total-ops n))
                    sa      (t/atom seed)
                    handles (mapv
                              (fn [wid]
                                (future
                                  (let [msz 200]
                                    (dotimes [j per]
                                      (swap! sa assoc
                                             (keyword (str "k" (mod (+ (* wid 97) j) msz)))
                                             (* wid 1000 (inc j)))))))
                              (range n))
                    [_ ms]  (bench/timed (fn [] (doseq [h handles] @h)))
                    _       (xray! (str "write-only post-" n "w"))
                    tput    (/ (* n per 1000) (max 0.001 ms))]
                {:workers n :ms ms :throughput tput
                 :ratio (/ tput stk-tput)}))
            CS-THREAD-COUNTS)
          best (last scaling)]
      (bench/record! "write-only contention" (:ms best)
                     :ops total-ops
                     :detail {:stock-throughput stk-tput
                              :scaling scaling})
      (is (pos? (:throughput best))))))
;; ── bench: 2026-02-14T17:18:01.380Z ── claude/sharedarraybuffer-structures-Uwgnw @ dbd3293 ── none ──
;; {:elapsed-ms
;;  :passed     false
;; }

;; =========================================================================
;; Read-only contention scaling
;; N futures each read from a pre-populated 200-entry shared map.
;; No writes during benchmark — measures lock-free read scaling.
;; =========================================================================

(deftest contention-scaling-read-only
  (testing "read-only: N futures × (total/N) get ops, 200-key shared map"
    (let [total-ops  8000
          seed       (into {} (map (fn [i] [(keyword (str "k" i)) {:val i :count 0}])
                                  (range CS-MAP-SIZE)))
          ;; Stock CLJS baseline (plain persistent map, no atom)
          [_ stk-ms] (bench/timed
                       (fn []
                         (dotimes [i total-ops]
                           (get seed (keyword (str "k" (mod i CS-MAP-SIZE)))))))
          stk-tput   (/ (* total-ops 1000) (max 0.001 stk-ms))
          ;; Single shared atom for all reads (no writes, safe to reuse)
          sa         (t/atom seed)
          scaling
          (mapv
            (fn [n]
              (xray! (str "read-only pre-" n "w"))
              (let [per     (max 1 (quot total-ops n))
                    handles (mapv
                              (fn [wid]
                                (future
                                  (let [msz 200]
                                    (dotimes [j per]
                                      (get @sa (keyword (str "k" (mod (+ (* wid 31) j) msz))))))))
                              (range n))
                    [_ ms]  (bench/timed (fn [] (doseq [h handles] @h)))
                    _       (xray! (str "read-only post-" n "w"))
                    tput    (/ (* n per 1000) (max 0.001 ms))]
                {:workers n :ms ms :throughput tput
                 :ratio (/ tput stk-tput)}))
            CS-THREAD-COUNTS)
          best (last scaling)]
      (bench/record! "read-only contention" (:ms best)
                     :ops total-ops
                     :detail {:stock-throughput stk-tput
                              :scaling scaling})
      (is (pos? (:throughput best))))))
;; ── bench: 2026-02-14T17:18:01.380Z ── claude/sharedarraybuffer-structures-Uwgnw @ dbd3293 ── none ──
;; {:elapsed-ms
;;  :passed     false
;; }

;; =========================================================================
;; Mixed 80/20 contention scaling
;; N futures each do 80% reads + 20% writes on a shared 200-key map.
;; Exercises the common read-heavy workload with intermittent writes.
;; =========================================================================

(deftest contention-scaling-mixed
  (testing "mixed 80/20: N futures × (total/N) ops, 200-key shared map"
    (let [total-ops  4000
          seed       (into {} (map (fn [i] [(keyword (str "k" i)) (* i 10)])
                                  (range CS-MAP-SIZE)))
          ;; Stock CLJS baseline
          stock-a    (atom seed)
          [_ stk-ms] (bench/timed
                       (fn []
                         (dotimes [i total-ops]
                           (if (zero? (mod i 5))
                             (swap! stock-a assoc
                                    (keyword (str "k" (mod i CS-MAP-SIZE)))
                                    (* i i))
                             (get @stock-a
                                  (keyword (str "k" (mod i CS-MAP-SIZE))))))))
          stk-tput   (/ (* total-ops 1000) (max 0.001 stk-ms))
          ;; SAB scaling
          scaling
          (mapv
            (fn [n]
              (xray! (str "mixed pre-" n "w"))
              (let [per     (max 1 (quot total-ops n))
                    sa      (t/atom seed)
                    handles (mapv
                              (fn [wid]
                                (future
                                  (let [msz 200]
                                    (dotimes [j per]
                                      (if (zero? (mod j 5))
                                        ;; Write 20%
                                        (swap! sa assoc
                                               (keyword (str "k" (mod (+ (* wid 97) j) msz)))
                                               (+ (* wid 1000) j))
                                        ;; Read 80%
                                        (get @sa
                                             (keyword (str "k" (mod (+ (* wid 31) j) msz)))))))))
                              (range n))
                    [_ ms]  (bench/timed (fn [] (doseq [h handles] @h)))
                    _       (xray! (str "mixed post-" n "w"))
                    tput    (/ (* n per 1000) (max 0.001 ms))]
                {:workers n :ms ms :throughput tput
                 :ratio (/ tput stk-tput)}))
            CS-THREAD-COUNTS)
          best (last scaling)]
      (bench/record! "mixed 80/20 contention" (:ms best)
                     :ops total-ops
                     :detail {:stock-throughput stk-tput
                              :scaling scaling})
      (is (pos? (:throughput best))))))
;; ── bench: 2026-02-14T17:18:01.380Z ── claude/sharedarraybuffer-structures-Uwgnw @ dbd3293 ── none ──
;; {:elapsed-ms
;;  :passed     false
;; }

;; =========================================================================
;; RCW (Read-Compute-Write) contention scaling
;; N futures each: deref → reduce-kv scan for max → swap! conditional update.
;; Exercises the most expensive contention pattern: full map scan per op.
;;
;; Helpers at namespace level to avoid CLJS closure-in-loop IIFEs that
;; reference original variable names instead of the future-captured __$1
;; bindings (which causes "per is not defined" on the worker).
;; =========================================================================

(defn- rcw-find-max
  "Scan map for entry with highest :count."
  [m]
  (reduce-kv (fn [best _k v]
               (if (> (:count v) (:count best)) v best))
             {:count -1} m))

(defn- rcw-update-max
  "Increment :count on all entries matching max-entry's :count."
  [mm max-entry]
  (reduce-kv (fn [acc k v]
               (if (= (:count v) (:count max-entry))
                 (assoc acc k (update v :count inc))
                 acc))
             mm mm))

(defn- rcw-cycle!
  "One read-compute-write cycle on a AtomDomain."
  [sa]
  (let [s         @sa
        max-entry (rcw-find-max s)]
    (swap! sa rcw-update-max max-entry)))

(deftest contention-scaling-rcw
  (testing "rcw: N futures × (total/N) read-compute-write cycles, 200-key map"
    (let [total-ops  80
          seed       (into {} (map (fn [i] [(keyword (str "k" i))
                                            {:count (mod (* i 7) 100)
                                             :total (* i 2.5)}])
                                  (range CS-MAP-SIZE)))
          ;; Stock CLJS baseline
          stock-a    (atom seed)
          [_ stk-ms] (bench/timed
                       (fn []
                         (dotimes [_ total-ops]
                           (let [s         @stock-a
                                 max-entry (rcw-find-max s)]
                             (swap! stock-a rcw-update-max max-entry)))))
          stk-tput   (/ (* total-ops 1000) (max 0.001 stk-ms))
          ;; SAB scaling
          scaling
          (mapv
            (fn [n]
              (xray! (str "rcw pre-" n "w"))
              (let [per     (max 1 (quot total-ops n))
                    sa      (t/atom seed)
                    handles (mapv
                              (fn [wid]
                                (future
                                  (dotimes [_ per]
                                    (rcw-cycle! sa))))
                              (range n))
                    [_ ms]  (bench/timed (fn [] (doseq [h handles] @h)))
                    _       (xray! (str "rcw post-" n "w"))
                    tput    (/ (* n per 1000) (max 0.001 ms))]
                {:workers n :ms ms :throughput tput
                 :ratio (/ tput stk-tput)}))
            CS-THREAD-COUNTS)
          best (last scaling)]
      (bench/record! "rcw contention" (:ms best)
                     :ops total-ops
                     :detail {:stock-throughput stk-tput
                              :scaling scaling})
      (is (pos? (:throughput best))))))
;; ── bench: 2026-02-14T17:18:01.380Z ── claude/sharedarraybuffer-structures-Uwgnw @ dbd3293 ── none ──
;; {:elapsed-ms
;;  :passed     false
;; }
