(ns cljs-thread.eve.bench-test
  "Cross-process mmap-atom benchmark suite.
   Run: clojure -M:jvm-test -n cljs-thread.eve.bench-test
   Requires: shadow-compile bench-worker (for Node workers)
             shadow-compile mmap-worker  (for mmap-worker.js)"
  (:require [clojure.test :refer [deftest is testing]]
            [clojure.edn :as edn]
            [cljs-thread.eve.atom :as atom]
            [cljs-thread.eve.mem :as mem]
            [cljs-thread.eve.deftype-proto.data :as d])
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

(defn- tmp-base [suffix]
  (str "/tmp/eve-bench-" (System/currentTimeMillis) "-" suffix))

(defn- cleanup-atom-files! [base]
  (doseq [ext [".slab0" ".slab1" ".slab2" ".slab3" ".slab4" ".slab5"
               ".slab6" ".root" ".rmap"
               ".slab0.bm" ".slab1.bm" ".slab2.bm"
               ".slab3.bm" ".slab4.bm" ".slab5.bm"]]
    (let [f (File. (str base ext))]
      (when (.exists f) (.delete f)))))

(defn- file-size [path]
  (let [f (File. path)]
    (if (.exists f) (.length f) 0)))

(defn- total-disk-bytes [base]
  (reduce + (map #(file-size (str base %))
                 [".slab0" ".slab1" ".slab2" ".slab3" ".slab4" ".slab5"
                  ".slab6" ".root" ".rmap"
                  ".slab0.bm" ".slab1.bm" ".slab2.bm"
                  ".slab3.bm" ".slab4.bm" ".slab5.bm"])))

(defn- nanos->ms [nanos] (/ (double nanos) 1e6))

(defn- build-atom!
  "Build an atom with n keys. Returns the atom."
  [b n]
  (let [a (atom/persistent-atom b {})]
    (dotimes [i n]
      (swap! a assoc (keyword (str "k" i)) i))
    a))

(defn- print-result [benchmark params results]
  (let [r {:benchmark benchmark
            :params    params
            :results   results
            :timestamp (str (java.time.Instant/now))
            :platform  "jvm"}]
    (println)
    (println (pr-str r))
    (flush)))

;; ---------------------------------------------------------------------------
;; B1: Read throughput (deref/s)
;; ---------------------------------------------------------------------------

(deftest ^:bench b1-read-throughput
  (testing "Read throughput at various atom sizes"
    (doseq [n [1 10 100 500]]
      (let [b     (tmp-base (str "b1-" n))
            m     (into {} (map (fn [i] [(keyword (str "k" i)) i]) (range n)))
            a     (atom/persistent-atom b m)
            _     @a ;; warmup
            iters (if (<= n 100) 10000 1000)
            t0    (System/nanoTime)]
        (dotimes [_ iters] @a)
        (let [elapsed-ms (nanos->ms (- (System/nanoTime) t0))]
          (print-result "B1-read-throughput"
                        {:keys n :iters iters}
                        {:elapsed-ms elapsed-ms
                         :ops-per-s  (/ (* iters 1000.0) elapsed-ms)})
          (is (pos? elapsed-ms)))
        (atom/close! a)
        (cleanup-atom-files! b)))))

;; ---------------------------------------------------------------------------
;; B2: Write throughput (swap/s) — no contention
;; ---------------------------------------------------------------------------

(deftest ^:bench b2-write-throughput
  (testing "Write throughput (sequential swaps, no contention)"
    (doseq [n [100 500 1000]]
      (let [b     (tmp-base (str "b2-" n))
            a     (build-atom! b n)
            iters 200
            t0    (System/nanoTime)]
        (dotimes [i iters]
          (swap! a assoc (keyword (str "w" i)) i))
        (let [elapsed-ms (nanos->ms (- (System/nanoTime) t0))]
          (print-result "B2-write-throughput"
                        {:initial-keys n :write-ops iters}
                        {:elapsed-ms  elapsed-ms
                         :ops-per-s   (/ (* iters 1000.0) elapsed-ms)
                         :ms-per-swap (/ elapsed-ms iters)})
          (is (pos? elapsed-ms)))
        (atom/close! a)
        (cleanup-atom-files! b)))))

;; ---------------------------------------------------------------------------
;; B3: Value complexity scaling
;; ---------------------------------------------------------------------------

(deftest ^:bench b3-value-complexity
  (testing "Write throughput with varying value complexity"
    (let [n 100]
      (doseq [[label val-fn]
              [["flat"   (fn [i] (str "value-" i))]
               ["nested" (fn [i] {:a {:b {:c i}}})]
               ["rich"   (fn [i] {:id i
                                   :deep {:a {:b {:c {:d (str "deep-" i)}}}}
                                   :items (vec (range 40))
                                   :tags #{:alpha :beta :gamma}
                                   :payload (apply str (repeat 200 "X"))})]]]
        (let [b  (tmp-base (str "b3-" label))
              a  (atom/persistent-atom b {})
              t0 (System/nanoTime)]
          (dotimes [i n]
            (swap! a assoc (keyword (str "k" i)) (val-fn i)))
          (let [elapsed-ms (nanos->ms (- (System/nanoTime) t0))]
            (print-result "B3-value-complexity"
                          {:label label :keys n}
                          {:elapsed-ms  elapsed-ms
                           :ops-per-s   (/ (* n 1000.0) elapsed-ms)
                           :ms-per-swap (/ elapsed-ms n)
                           :disk-bytes  (total-disk-bytes b)})
            (is (pos? elapsed-ms)))
          (atom/close! a)
          (cleanup-atom-files! b))))))

;; ---------------------------------------------------------------------------
;; B4: Load-in time (build from empty to target size)
;; ---------------------------------------------------------------------------

(deftest ^:bench b4-load-in
  (testing "Time to populate atom to target size"
    (doseq [n [100 500 1000]]
      (let [b  (tmp-base (str "b4-" n))
            a  (atom/persistent-atom b {})
            t0 (System/nanoTime)]
        (dotimes [i n]
          (swap! a assoc (keyword (str "k" i)) (str "v" i)))
        (let [elapsed-ms (nanos->ms (- (System/nanoTime) t0))
              disk       (total-disk-bytes b)]
          (print-result "B4-load-in"
                        {:target-keys n}
                        {:elapsed-ms  elapsed-ms
                         :ms-per-swap (/ elapsed-ms n)
                         :disk-bytes  disk
                         :disk-mb     (/ (double disk) (* 1024 1024))})
          (is (pos? elapsed-ms)))
        (atom/close! a)
        (cleanup-atom-files! b)))))

;; ---------------------------------------------------------------------------
;; B5: Load-out time (deref + full traversal)
;; ---------------------------------------------------------------------------

(deftest ^:bench b5-load-out
  (testing "Time to deref + fully traverse atom"
    (doseq [n [100 500 1000]]
      (let [b  (tmp-base (str "b5-" n))
            a  (build-atom! b n)
            iters 10
            t0 (System/nanoTime)]
        (dotimes [_ iters]
          (let [v @a]
            (count (into {} v))))
        (let [elapsed-ms (nanos->ms (- (System/nanoTime) t0))]
          (print-result "B5-load-out"
                        {:keys n :iters iters}
                        {:elapsed-ms    elapsed-ms
                         :ms-per-deref  (/ elapsed-ms iters)})
          (is (pos? elapsed-ms)))
        (atom/close! a)
        (cleanup-atom-files! b)))))

;; ---------------------------------------------------------------------------
;; B6: Disk footprint scaling (up to ~1GB with large payloads)
;; ---------------------------------------------------------------------------

(deftest ^:bench b6-disk-footprint
  (testing "Disk size vs logical data at various scales"
    ;; Use large payload strings per key to reach high disk usage with fewer keys.
    ;; 500 keys x ~20KB payload ≈ 10MB logical → measures overhead ratio.
    ;; 1000 keys x ~100KB payload ≈ 100MB logical → approaches ~1GB on disk.
    (doseq [[n payload-chars] [[100 500] [500 5000] [1000 20000]]]
      (let [b  (tmp-base (str "b6-" n))
            a  (atom/persistent-atom b {})
            t0 (System/nanoTime)]
        (dotimes [i n]
          (swap! a assoc (keyword (str "k" i))
                 {:id i
                  :label (str "item-" i)
                  :payload (apply str (repeat payload-chars
                                        (str (char (+ 65 (mod i 26))))))
                  :tags #{:a :b :c :d}
                  :nested {:x i :y (* i 2)}}))
        (let [elapsed-ms (nanos->ms (- (System/nanoTime) t0))
              disk       (total-disk-bytes b)
              logical    (* n (+ 250 payload-chars))]
          (print-result "B6-disk-footprint"
                        {:keys n :payload-chars payload-chars}
                        {:elapsed-ms     elapsed-ms
                         :disk-bytes     disk
                         :disk-mb        (/ (double disk) (* 1024 1024))
                         :logical-est-mb (/ (double logical) (* 1024 1024))
                         :overhead-ratio (if (pos? logical) (double (/ disk logical)) 0)})
          (is (pos? disk)))
        (atom/close! a)
        (cleanup-atom-files! b)))))

;; ---------------------------------------------------------------------------
;; B7: Contention scaling curve (Node workers)
;; ---------------------------------------------------------------------------

(deftest ^:bench b7-contention-scaling
  (testing "Contention scaling: fixed work, variable writers"
    (doseq [writers [1 2 4 8 16]]
      (let [total-swaps 500
            per-worker  (quot total-swaps writers)
            b           (tmp-base (str "b7-" writers))
            a           (atom/persistent-atom b {:counter 0})]
        (atom/close! a)
        (let [t0      (System/nanoTime)
              futures (mapv (fn [_]
                              (future
                                (spawn-node-edn! bench-worker "bench-contend"
                                                 b (str per-worker))))
                            (range writers))
              results (mapv deref futures)
              wall-ms (nanos->ms (- (System/nanoTime) t0))
              a2      (atom/join-atom b)
              cnt     (:counter @a2)]
          (atom/close! a2)
          (print-result "B7-contention-scaling"
                        {:writers writers :total-swaps (* per-worker writers)
                         :per-worker per-worker}
                        {:wall-ms    wall-ms
                         :throughput (/ (* per-worker writers 1000.0) wall-ms)
                         :final-count cnt
                         :worker-results results})
          (is (= (* per-worker writers) cnt)
              (str "Expected " (* per-worker writers) " got " cnt)))
        (cleanup-atom-files! b)))))

;; ---------------------------------------------------------------------------
;; B9: JVM vs Node throughput comparison
;; ---------------------------------------------------------------------------

(deftest ^:bench b9-jvm-vs-node
  (testing "JVM vs Node sequential swap throughput"
    (let [n 500]
      ;; JVM side
      (let [b  (tmp-base "b9-jvm")
            a  (atom/persistent-atom b {})
            t0 (System/nanoTime)]
        (dotimes [i n]
          (swap! a assoc (keyword (str "k" i)) i))
        (let [elapsed-ms (nanos->ms (- (System/nanoTime) t0))]
          (print-result "B9-jvm-throughput"
                        {:ops n}
                        {:elapsed-ms  elapsed-ms
                         :ops-per-s   (/ (* n 1000.0) elapsed-ms)
                         :ms-per-swap (/ elapsed-ms n)}))
        (atom/close! a)
        (cleanup-atom-files! b))
      ;; Node side
      (let [b  (tmp-base "b9-node")
            a  (atom/persistent-atom b {})]
        (atom/close! a)
        (let [r (spawn-node-edn! bench-worker "bench-write" b (str n) "k")]
          (print-result "B9-node-throughput"
                        {:ops n}
                        r)
          (is (pos? (:elapsed-ms r))))
        (cleanup-atom-files! b)))))

;; ---------------------------------------------------------------------------
;; B10: Cold start time (create vs join)
;; ---------------------------------------------------------------------------

(deftest ^:bench b10-cold-start
  (testing "Cold start time: persistent-atom vs join-atom"
    (let [b  (tmp-base "b10-create")
          t0 (System/nanoTime)
          a  (atom/persistent-atom b {})
          elapsed-ms (nanos->ms (- (System/nanoTime) t0))]
      (print-result "B10-jvm-create" {} {:elapsed-ms elapsed-ms})
      (is (pos? elapsed-ms))
      (let [t1 (System/nanoTime)
            b2 (atom/join-atom b)
            join-ms (nanos->ms (- (System/nanoTime) t1))]
        (print-result "B10-jvm-join" {} {:elapsed-ms join-ms})
        (atom/close! b2))
      (let [r (spawn-node-edn! bench-worker "bench-cold-join" b)]
        (print-result "B10-node-join" {} r))
      (atom/close! a)
      (cleanup-atom-files! b))))

;; ---------------------------------------------------------------------------
;; B11: Cross-process read visibility latency
;; ---------------------------------------------------------------------------

(deftest ^:bench b11-cross-process-visibility
  (testing "Latency from JVM write to Node read"
    (let [n  20
          b  (tmp-base "b11")
          a  (atom/persistent-atom b {:seq 0})
          lats (java.util.ArrayList.)]
      (dotimes [i n]
        (let [t0 (System/nanoTime)]
          (swap! a assoc :seq (inc i))
          (let [r (spawn-node-edn! bench-worker "bench-traverse" b)]
            (.add lats (nanos->ms (- (System/nanoTime) t0))))))
      (let [sorted (sort (vec lats))
            cnt    (count sorted)]
        (print-result "B11-cross-process-visibility"
                      {:iters n}
                      {:min-ms  (first sorted)
                       :p50-ms  (nth sorted (quot cnt 2))
                       :p95-ms  (nth sorted (int (* cnt 0.95)))
                       :max-ms  (last sorted)})
        (is (pos? (first sorted))))
      (atom/close! a)
      (cleanup-atom-files! b))))

;; ---------------------------------------------------------------------------
;; B12: Epoch GC throughput
;; ---------------------------------------------------------------------------

(deftest ^:bench b12-epoch-gc
  (testing "Epoch GC: rapid swaps with retirement"
    (let [n  500
          b  (tmp-base "b12")
          a  (build-atom! b 100)
          disk-before (total-disk-bytes b)
          t0 (System/nanoTime)]
      (dotimes [i n]
        (swap! a assoc (keyword (str "k" (mod i 100))) (str "updated-" i)))
      (let [elapsed-ms  (nanos->ms (- (System/nanoTime) t0))
            disk-after  (total-disk-bytes b)]
        (print-result "B12-epoch-gc"
                      {:pre-keys 100 :swaps n}
                      {:elapsed-ms     elapsed-ms
                       :ms-per-swap    (/ elapsed-ms n)
                       :disk-before-mb (/ (double disk-before) (* 1024 1024))
                       :disk-after-mb  (/ (double disk-after) (* 1024 1024))
                       :disk-growth-mb (/ (double (- disk-after disk-before))
                                          (* 1024 1024))})
        (is (pos? elapsed-ms)))
      (atom/close! a)
      (cleanup-atom-files! b))))

;; ---------------------------------------------------------------------------
;; B13: Slab utilization / fragmentation
;; ---------------------------------------------------------------------------

(deftest ^:bench b13-slab-utilization
  (testing "Per-slab-class utilization after building atom"
    (let [n  500
          b  (tmp-base "b13")
          a  (atom/persistent-atom b {})
          _  (dotimes [i n]
               (swap! a assoc (keyword (str "k" i))
                      {:id i :label (str "item-" i)}))]
      (let [r (spawn-node-edn! bench-worker "bench-slab-stats" b)]
        (print-result "B13-slab-utilization"
                      {:keys n}
                      r)
        (is (pos? (:total-bytes r))))
      (atom/close! a)
      (cleanup-atom-files! b))))

;; ---------------------------------------------------------------------------
;; B14: Swap latency percentiles (JVM)
;; ---------------------------------------------------------------------------

(deftest ^:bench b14-swap-latency
  (testing "Swap latency distribution (JVM, no contention)"
    (let [n    500
          b    (tmp-base "b14")
          a    (build-atom! b 100)
          lats (long-array n)]
      (dotimes [i n]
        (let [t0 (System/nanoTime)]
          (swap! a assoc (keyword (str "w" i)) i)
          (aset lats i (- (System/nanoTime) t0))))
      (let [sorted (sort (vec (map #(/ (double %) 1e6) (seq lats))))
            cnt    (count sorted)]
        (print-result "B14-swap-latency-jvm"
                      {:swaps n :pre-keys 100}
                      {:min-ms (first sorted)
                       :p50-ms (nth sorted (quot cnt 2))
                       :p95-ms (nth sorted (int (* cnt 0.95)))
                       :p99-ms (nth sorted (int (* cnt 0.99)))
                       :max-ms (last sorted)})
        (is (pos? (first sorted))))
      (atom/close! a)
      (cleanup-atom-files! b)))

  (testing "Swap latency distribution (Node, no contention)"
    (let [b (tmp-base "b14-node")
          a (build-atom! b 100)]
      (atom/close! a)
      (let [r (spawn-node-edn! bench-worker "bench-swap-latencies"
                                b "500" "w")]
        (print-result "B14-swap-latency-node"
                      {:swaps 500 :pre-keys 100}
                      r)
        (is (pos? (:min-ms r))))
      (cleanup-atom-files! b)))

  (testing "Swap latency under contention (4 Node writers)"
    (let [b  (tmp-base "b14-contend")
          a  (build-atom! b 100)]
      (atom/close! a)
      (let [futures (mapv (fn [i]
                            (future
                              (spawn-node-edn! bench-worker "bench-swap-latencies"
                                               b "125" (str "w" i))))
                          (range 4))
            results (mapv deref futures)]
        (print-result "B14-swap-latency-contended"
                      {:writers 4 :swaps-each 125 :pre-keys 100}
                      {:workers results})
        (is (= 4 (count results))))
      (cleanup-atom-files! b))))
