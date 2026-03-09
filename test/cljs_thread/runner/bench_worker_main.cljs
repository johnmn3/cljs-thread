(ns cljs-thread.runner.bench-worker-main
  "Standalone Node.js benchmark worker for cross-process benchmarks.

   Usage:
     node target/thread-test/bench-worker.js bench-read      <base> <count>
     node target/thread-test/bench-worker.js bench-write     <base> <count> <prefix>
     node target/thread-test/bench-worker.js bench-contend   <base> <count>
     node target/thread-test/bench-worker.js bench-traverse  <base>
     node target/thread-test/bench-worker.js bench-cold-join <base>
     node target/thread-test/bench-worker.js bench-slab-stats <base>

   All actions print a single EDN map to stdout with timing results.
   Exits 0 on success, 1 on failure, 2 on unknown action."
  (:require [cljs-thread.eve.atom :as atom]
            [cljs-thread.eve.mem :as mem]
            [cljs-thread.eve.deftype-proto.data :as d]))

(defn- now-ms []
  (js/performance.now))

(defn- load-addon! []
  (let [addon-path (.resolve (js/require "path") "build/Release/mmap_cas.node")]
    (mem/load-native-addon! (js/require addon-path))))

(defn- slab-file-size [base i]
  (let [fs (js/require "fs")
        path (str base ".slab" i)]
    (try
      (.-size (.statSync fs path))
      (catch :default _ 0))))

(defn main [& _args]
  (let [argv   (.-argv js/process)
        action (aget argv 2)
        base   (aget argv 3)]
    (when (nil? action)
      (js/console.error "Usage: bench-worker.js <action> <base> [args...]")
      (js/process.exit 2))
    (load-addon!)
    (case action
      ;; Time N derefs, report throughput
      "bench-read"
      (let [n   (js/parseInt (aget argv 4) 10)
            a   (atom/join-atom base)
            _   @a ;; warmup
            t0  (now-ms)]
        (dotimes [_ n] @a)
        (let [elapsed (- (now-ms) t0)]
          (atom/close! a)
          (println (pr-str {:elapsed-ms elapsed :ops n
                            :ops-per-s (/ (* n 1000) elapsed)}))
          (js/process.exit 0)))

      ;; Time N assoc swaps with unique keys, report throughput + retries
      "bench-write"
      (let [n      (js/parseInt (aget argv 4) 10)
            prefix (or (aget argv 5) "bw")
            a      (atom/join-atom base)
            t0     (now-ms)]
        (dotimes [i n]
          (let [k (keyword (str prefix "-" i))]
            (swap! a assoc k i)))
        (let [elapsed (- (now-ms) t0)]
          (atom/close! a)
          (println (pr-str {:elapsed-ms elapsed :ops n
                            :ops-per-s (/ (* n 1000) elapsed)}))
          (js/process.exit 0)))

      ;; Time N counter increments (contention benchmark)
      "bench-contend"
      (let [n  (js/parseInt (aget argv 4) 10)
            a  (atom/join-atom base)
            t0 (now-ms)]
        (dotimes [_ n]
          (swap! a update :counter (fnil inc 0)))
        (let [elapsed (- (now-ms) t0)]
          (atom/close! a)
          (println (pr-str {:elapsed-ms elapsed :ops n
                            :ops-per-s (/ (* n 1000) elapsed)}))
          (js/process.exit 0)))

      ;; Time full traversal: deref + into {}
      "bench-traverse"
      (let [a   (atom/join-atom base)
            t0  (now-ms)
            val @a
            m   (into {} val)
            k   (count m)
            elapsed (- (now-ms) t0)]
        (atom/close! a)
        (println (pr-str {:elapsed-ms elapsed :keys k}))
        (js/process.exit 0))

      ;; Time cold join only
      "bench-cold-join"
      (let [t0 (now-ms)
            a  (atom/join-atom base)
            elapsed (- (now-ms) t0)]
        (atom/close! a)
        (println (pr-str {:elapsed-ms elapsed}))
        (js/process.exit 0))

      ;; Report per-slab-class stats
      "bench-slab-stats"
      (let [a (atom/join-atom base)
            stats (mapv (fn [i]
                          (let [file-bytes (slab-file-size base i)]
                            {:class i
                             :block-size (nth d/SLAB_SIZES i)
                             :file-bytes file-bytes}))
                        (range d/NUM_SLAB_CLASSES))
            total-bytes (reduce + (map :file-bytes stats))]
        (atom/close! a)
        (println (pr-str {:slab-stats stats :total-bytes total-bytes}))
        (js/process.exit 0))

      ;; Write rich nested values (like capstone) for benchmarking
      "bench-write-rich"
      (let [n      (js/parseInt (aget argv 4) 10)
            prefix (or (aget argv 5) "br")
            a      (atom/join-atom base)
            t0     (now-ms)]
        (dotimes [i n]
          (let [k (keyword (str prefix "-" i))
                v {:id i
                   :writer prefix
                   :deep {:a {:b {:c {:d (str prefix "-" i "-deep")}}}}
                   :items (vec (range 40))
                   :matrix [[i (* i 2) (* i 3)]
                            [(+ i 10) (+ i 20) (+ i 30)]
                            [(+ i 100) (+ i 200) (+ i 300)]]
                   :tags #{:alpha :beta :gamma :delta}
                   :history (list :created :validated :committed)
                   :payload (apply str (repeat 200 (str (char (+ 65 (mod i 26))))))}]
            (swap! a assoc k v)))
        (let [elapsed (- (now-ms) t0)]
          (atom/close! a)
          (println (pr-str {:elapsed-ms elapsed :ops n
                            :ops-per-s (/ (* n 1000) elapsed)}))
          (js/process.exit 0)))

      ;; Latency recording: N swaps, return each swap duration
      "bench-swap-latencies"
      (let [n      (js/parseInt (aget argv 4) 10)
            prefix (or (aget argv 5) "bl")
            a      (atom/join-atom base)
            lats   (array)]
        (dotimes [i n]
          (let [t0 (now-ms)
                k  (keyword (str prefix "-" i))]
            (swap! a assoc k i)
            (.push lats (- (now-ms) t0))))
        (let [sorted (.sort (js/Array.from lats) (fn [a b] (- a b)))
              cnt    (.-length sorted)
              p50    (aget sorted (js/Math.floor (* cnt 0.5)))
              p95    (aget sorted (js/Math.floor (* cnt 0.95)))
              p99    (aget sorted (js/Math.floor (* cnt 0.99)))
              mn     (aget sorted 0)
              mx     (aget sorted (dec cnt))]
          (atom/close! a)
          (println (pr-str {:ops n :min-ms mn :p50-ms p50
                            :p95-ms p95 :p99-ms p99 :max-ms mx}))
          (js/process.exit 0)))

      ;; Unknown action
      (do (js/console.error "Unknown action:" action)
          (js/process.exit 2)))))
