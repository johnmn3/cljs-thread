(ns eve.stress-atom
  "Cross-process contention stress test for native-eve persistent atoms.
   Spawns JVM threads and Node.js processes for concurrent read/write
   contention on a cold-from-disk mmap-backed atom.

   Usage: clj -M:native-x-stress-atom <base-path>
   Example: clj -M:native-x-stress-atom /tmp/eve-10m"
  (:require [cljs-thread.eve.atom :as atom]
            [clojure.edn :as edn])
  (:import [java.io File]))

;; ---------------------------------------------------------------------------
;; Helpers
;; ---------------------------------------------------------------------------

(def ^:private bench-worker
  (str (System/getProperty "user.dir") "/target/thread-test/bench-worker.js"))

(defn- spawn-node! [& args]
  (let [pb   (doto (ProcessBuilder. ^java.util.List (into ["node"] args))
               (.redirectErrorStream false))
        proc (.start pb)
        out  (future (slurp (.getInputStream proc)))
        err  (future (slurp (.getErrorStream proc)))
        exit (.waitFor proc)]
    {:exit exit :out @out :err @err}))

(defn- spawn-node-edn! [& args]
  (let [r (apply spawn-node! args)]
    (when-not (zero? (:exit r))
      (throw (ex-info "Node worker failed" {:args args :err (:err r)})))
    (edn/read-string (.trim (:out r)))))

(defn- nanos->ms [n] (/ (double n) 1e6))

(defn- total-disk-bytes [base]
  (reduce + (map #(let [f (File. (str base %))]
                    (if (.exists f) (.length f) 0))
                 [".slab0" ".slab1" ".slab2" ".slab3" ".slab4" ".slab5"
                  ".slab6" ".root" ".rmap"
                  ".slab0.bm" ".slab1.bm" ".slab2.bm"
                  ".slab3.bm" ".slab4.bm" ".slab5.bm"])))

(defn- section [title]
  (println)
  (printf "-- %s --\n" title)
  (println))

;; ---------------------------------------------------------------------------
;; Main
;; ---------------------------------------------------------------------------

(defn -main [& args]
  (when (< (count args) 1)
    (println "Usage: clj -M:native-x-stress-atom <base-path>")
    (System/exit 1))
  (let [base-path (first args)]
    ;; Preflight checks
    (when-not (.exists (File. (str base-path ".root")))
      (println (str "Error: No atom found at " base-path))
      (println "Run native-build-atom first to create the atom.")
      (System/exit 1))
    (when-not (.exists (File. bench-worker))
      (println (str "Error: " bench-worker " not found."))
      (println "Run: shadow-compile bench-worker")
      (System/exit 1))

    (let [disk-bytes (total-disk-bytes base-path)
          disk-mb    (/ (double disk-bytes) (* 1024 1024))]
      (println)
      (println "native-eve: Cross-Process Contention Stress Test")
      (println "====================================================")
      (printf  "  Atom:    %s\n" base-path)
      (printf  "  On disk: %.1f MB\n" disk-mb)
      (println "====================================================")

      ;; ── Phase 1: Cold Open ──
      (section "Phase 1: Cold Open (JVM joins atom from disk)")
      (let [t0        (System/nanoTime)
            a         (atom/join-atom base-path)
            open-ms   (nanos->ms (- (System/nanoTime) t0))
            t1        (System/nanoTime)
            val       @a
            deref-ms  (nanos->ms (- (System/nanoTime) t1))
            key-count (count val)]
        (printf "  join-atom:   %6.1f ms (open mmap files)\n" open-ms)
        (printf "  first deref: %6.1f ms (%,d keys, %.1f MB)\n"
                deref-ms key-count disk-mb)

        ;; ── Phase 2: JVM Single-Writer Swap Latency ──
        ;; Updates EXISTING keys — takes the O(log32 N) replace path in the HAMT.
        (section "Phase 2: JVM Single-Writer Swap Latency")
        (let [n    100
              lats (long-array n)]
          (dotimes [i n]
            (let [k (keyword (str "k" (mod i key-count)))
                  t (System/nanoTime)]
              (swap! a assoc k {:updated true :iter i})
              (aset lats i (- (System/nanoTime) t))))
          (let [sorted (sort (mapv #(/ (double %) 1e6) (seq lats)))
                cnt    (count sorted)]
            (printf "  %d swaps (update existing keys in %,d-key map)\n" n key-count)
            (printf "    p50:     %6.2f ms\n" (nth sorted (quot cnt 2)))
            (printf "    p95:     %6.2f ms\n" (nth sorted (int (* cnt 0.95))))
            (printf "    p99:     %6.2f ms\n" (nth sorted (int (* cnt 0.99))))
            (printf "    min/max: %6.2f / %.2f ms\n" (first sorted) (last sorted))))

        ;; ── Phase 3: Node Single-Writer Swap Latency ──
        (section "Phase 3: Node Single-Writer Swap Latency")
        (let [r (spawn-node-edn! bench-worker "bench-swap-latencies"
                                 base-path "100" "stress-node")]
          (printf "  100 swaps (Node.js process, new keys)\n")
          (printf "    p50:     %6.2f ms\n" (:p50-ms r))
          (printf "    p95:     %6.2f ms\n" (:p95-ms r))
          (printf "    p99:     %6.2f ms\n" (:p99-ms r))
          (printf "    min/max: %6.2f / %.2f ms\n" (:min-ms r) (:max-ms r)))

        ;; ── Phase 4: Cross-Process Contention ──
        ;; Both JVM threads and Node processes increment :counter (pre-inserted
        ;; during build), proving CAS correctness under full cross-process contention.
        (section "Phase 4: 4 JVM Threads + 4 Node Processes (counter contention)")
        ;; Reset counter to 0 (update, not insert — :counter was pre-inserted by build)
        (swap! a assoc :counter 0)
        (let [ops-per-worker 50
              n-jvm  4
              n-node 4
              t0     (System/nanoTime)
              ;; Launch JVM threads — update existing :counter key
              jvm-futures
              (mapv (fn [_]
                      (future
                        (dotimes [_ ops-per-worker]
                          (swap! a update :counter inc))))
                    (range n-jvm))
              ;; Launch Node processes
              node-futures
              (mapv (fn [_]
                      (future
                        (spawn-node-edn! bench-worker "bench-contend"
                                         base-path (str ops-per-worker))))
                    (range n-node))
              ;; Wait for all
              _            (run! deref jvm-futures)
              node-results (mapv deref node-futures)
              wall-ms      (nanos->ms (- (System/nanoTime) t0))
              final-count  (:counter @a)
              expected     (* ops-per-worker (+ n-jvm n-node))
              correct?     (= final-count expected)]
          (printf "  Writers:    %d JVM threads + %d Node processes\n" n-jvm n-node)
          (printf "  Ops/worker: %d\n" ops-per-worker)
          (printf "  Wall time:  %,.0f ms\n" wall-ms)
          (printf "  Throughput: %,.0f ops/s (aggregate)\n"
                  (/ (* expected 1000.0) wall-ms))
          (printf "  Counter:    %d (expected %d) %s\n"
                  final-count expected
                  (if correct? "CORRECT" "MISMATCH"))
          (when-not correct?
            (println "  *** CONTENTION BUG DETECTED ***")))

        ;; ── Summary ──
        (println)
        (println "====================================================")
        (println "  Stress Test Complete")
        (println)
        (printf  "  Key insight: each swap! touches only O(log32 N)\n")
        (printf  "  HAMT nodes via structural sharing. Updating any\n")
        (printf  "  single key in a %.0f MB atom costs the same as in\n" disk-mb)
        (printf  "  a tiny atom: ~3-4 tree levels regardless of size.\n")
        (println "====================================================")
        (println)
        (atom/close! a)))))
