(ns cljs-thread.runner.mmap-worker-main
  "Standalone Node.js worker for mmap-atom cross-process tests.

   Usage:
     node target/thread-test/mmap-worker.js join-verify  <base> <count>
     node target/thread-test/mmap-worker.js join-swap    <base>
     node target/thread-test/mmap-worker.js join-concurrent-swap <base> <n>
     node target/thread-test/mmap-worker.js join-read    <base>
     node target/thread-test/mmap-worker.js join-reset   <base> <edn>
     node target/thread-test/mmap-worker.js join-swap-assoc <base> <key> <val>
     node target/thread-test/mmap-worker.js join-swap-conj  <base> <edn-elem>
     node target/thread-test/mmap-worker.js join-swap-fn    <base> <fn-name>
     node target/thread-test/mmap-worker.js bulk-assoc-range <base> <start> <count> <prefix>
     node target/thread-test/mmap-worker.js read-key-count   <base>

   Exits 0 on success, 1 on assertion failure, 2 on unknown action.
   join-read prints the atom value as EDN to stdout.
   read-key-count prints the number of keys in the atom map to stdout."
  (:require [cljs-thread.eve.atom :as atom]
            [cljs-thread.eve.mem :as mem]
            [cljs.reader :as reader]))

(defn main [& _args]
  (let [argv   (.-argv js/process)
        action (aget argv 2)
        base   (aget argv 3)]
    (when (nil? action)
      (js/console.error "Usage: mmap-worker.js <action> <base> [args...]")
      (js/process.exit 2))
    ;; Load native addon
    (let [addon-path (.resolve (js/require "path") "build/Release/mmap_cas.node")]
      (mem/load-native-addon! (js/require addon-path)))
    (case action
      "join-verify"
      (let [expected (js/parseInt (aget argv 4) 10)
            a        (atom/join-atom base)
            val      @a
            cnt      (:count val)]
        (atom/close! a)
        (if (== cnt expected)
          (js/process.exit 0)
          (do (js/console.error "join-verify FAIL: expected" expected "got" cnt)
              (js/process.exit 1))))

      "join-swap"
      (let [a (atom/join-atom base)]
        (swap! a update :count inc)
        (atom/close! a)
        (js/process.exit 0))

      "join-concurrent-swap"
      (let [n (js/parseInt (aget argv 4) 10)
            a (atom/join-atom base)]
        (dotimes [_ n]
          (swap! a update :count inc))
        (atom/close! a)
        (js/process.exit 0))

      ;; Read atom value and print as EDN to stdout
      "join-read"
      (let [a   (atom/join-atom base)
            val @a]
        (atom/close! a)
        (println (pr-str val))
        (js/process.exit 0))

      ;; Reset atom to an EDN value from argv
      "join-reset"
      (let [edn (aget argv 4)
            a   (atom/join-atom base)]
        (reset! a (reader/read-string edn))
        (atom/close! a)
        (js/process.exit 0))

      ;; Swap: assoc a key-value pair into the atom map
      "join-swap-assoc"
      (let [k (keyword (aget argv 4))
            v (reader/read-string (aget argv 5))
            a (atom/join-atom base)]
        (swap! a assoc k v)
        (atom/close! a)
        (js/process.exit 0))

      ;; Swap: conj an EDN element into the atom (set or vec)
      "join-swap-conj"
      (let [elem (reader/read-string (aget argv 4))
            a    (atom/join-atom base)]
        (swap! a conj elem)
        (atom/close! a)
        (js/process.exit 0))

      ;; Swap: apply a named transform function
      "join-swap-fn"
      (let [fn-name (aget argv 4)
            a       (atom/join-atom base)]
        (case fn-name
          ;; Append " world" to :greeting
          "append-greeting"
          (swap! a update :greeting #(str % " world"))

          ;; Add a nested map entry
          "add-nested"
          (swap! a assoc-in [:nested :from-node] true)

          ;; Transform: increment all numeric vals in a map
          "inc-vals"
          (swap! a #(into {} (map (fn [[k v]] [k (if (number? v) (inc v) v)])) %))

          ;; Merge a new sub-map
          "merge-meta"
          (swap! a merge {:source "node" :pid (.-pid js/process)})

          ;; Replace root with a vector
          "to-vec"
          (reset! a (vec (vals @a)))

          ;; Replace root with a scalar
          "to-scalar"
          (reset! a (str "node-" (.-pid js/process)))

          (do (js/console.error "Unknown fn-name:" fn-name)
              (js/process.exit 2)))
        (atom/close! a)
        (js/process.exit 0))

      ;; Bulk assoc: individually swap! each key (realistic contention)
      ;; Keys: :prefix-start .. :prefix-(start+count-1)
      ;; Values: "prefix-N-val"
      "bulk-assoc-range"
      (let [start  (js/parseInt (aget argv 4) 10)
            cnt    (js/parseInt (aget argv 5) 10)
            prefix (or (aget argv 6) "k")
            a      (atom/join-atom base)]
        (dotimes [i cnt]
          (let [idx (+ start i)
                k   (keyword (str prefix "-" idx))
                v   (str prefix "-" idx "-val")]
            (swap! a assoc k v)))
        (atom/close! a)
        (js/process.exit 0))

      ;; Bulk assoc with nested values: each key maps to a nested structure
      ;; {:id N :label "prefix-N" :profile {:source prefix :index N}
      ;;  :tags [:tag-a :tag-b :tag-c] :scores [N (* N 2) (* N 3)]}
      "bulk-assoc-nested"
      (let [start  (js/parseInt (aget argv 4) 10)
            cnt    (js/parseInt (aget argv 5) 10)
            prefix (or (aget argv 6) "k")
            a      (atom/join-atom base)]
        (dotimes [i cnt]
          (let [idx (+ start i)
                k   (keyword (str prefix "-" idx))
                v   {:id idx
                     :label (str prefix "-" idx)
                     :profile {:source prefix :index idx}
                     :tags [:tag-a :tag-b :tag-c]
                     :scores [idx (* idx 2) (* idx 3)]}]
            (swap! a assoc k v)))
        (atom/close! a)
        (js/process.exit 0))

      ;; Verify nested keys: check that keys prefix-start..prefix-(start+cnt-1)
      ;; have the expected nested structure. Prints "OK <count>" or error.
      "verify-nested-keys"
      (let [start  (js/parseInt (aget argv 4) 10)
            cnt    (js/parseInt (aget argv 5) 10)
            prefix (or (aget argv 6) "k")
            a      (atom/join-atom base)
            val    @a
            errors (volatile! 0)]
        (dotimes [i cnt]
          (let [idx (+ start i)
                k   (keyword (str prefix "-" idx))
                v   (get val k)]
            (when (or (nil? v)
                      (not= idx (:id v))
                      (not= (str prefix "-" idx) (:label v))
                      (not= prefix (get-in v [:profile :source]))
                      (not= idx (get-in v [:profile :index]))
                      (not= [:tag-a :tag-b :tag-c] (:tags v))
                      (not= [idx (* idx 2) (* idx 3)] (:scores v)))
              (vswap! errors inc)
              (js/console.error "FAIL key" (str k) "got" (pr-str v)))))
        (atom/close! a)
        (if (zero? @errors)
          (do (println (str "OK " cnt))
              (js/process.exit 0))
          (do (println (str "FAIL " @errors))
              (js/process.exit 1))))

      ;; Bulk rich-grow: compound swap that assocs a unique key with a rich
      ;; nested value AND increments :counter in a single swap! (key contention).
      ;; Value structure exercises deep nesting, large vecs, vec-of-vecs,
      ;; sets, lists, and large strings.
      "bulk-rich-grow"
      (let [start  (js/parseInt (aget argv 4) 10)
            cnt    (js/parseInt (aget argv 5) 10)
            prefix (or (aget argv 6) "k")
            a      (atom/join-atom base)]
        (dotimes [i cnt]
          (let [idx (+ start i)
                k   (keyword (str prefix "-" idx))
                v   {:id idx
                     :writer prefix
                     :deep {:a {:b {:c {:d (str prefix "-" idx "-deep")}}}}
                     :items (vec (range 40))
                     :matrix [[idx (* idx 2) (* idx 3)]
                              [(+ idx 10) (+ idx 20) (+ idx 30)]
                              [(+ idx 100) (+ idx 200) (+ idx 300)]]
                     :tags #{:alpha :beta :gamma :delta}
                     :history (list :created :validated :committed)
                     :payload (apply str (repeat 200 (str (char (+ 65 (mod idx 26))))))}]
            (swap! a (fn [m] (-> m (assoc k v) (update :counter (fnil inc 0)))))))
        (atom/close! a)
        (js/process.exit 0))

      ;; Verify rich nested structure for keys prefix-start..prefix-(start+cnt-1).
      ;; Checks deep nesting, vec count, matrix structure, set equality, list equality.
      "verify-rich"
      (let [start  (js/parseInt (aget argv 4) 10)
            cnt    (js/parseInt (aget argv 5) 10)
            prefix (or (aget argv 6) "k")
            a      (atom/join-atom base)
            val    @a
            errors (volatile! 0)]
        (dotimes [i cnt]
          (let [idx (+ start i)
                k   (keyword (str prefix "-" idx))
                v   (get val k)]
            (when (or (nil? v)
                      (not= idx (:id v))
                      (not= prefix (:writer v))
                      (not= (str prefix "-" idx "-deep")
                             (get-in v [:deep :a :b :c :d]))
                      (not= 40 (count (:items v)))
                      (not= [idx (* idx 2) (* idx 3)]
                             (into [] (first (:matrix v))))
                      (not= #{:alpha :beta :gamma :delta} (into #{} (:tags v)))
                      (not= '(:created :validated :committed) (into '() (reverse (:history v)))))
              (vswap! errors inc)
              (js/console.error "FAIL key" (str k) "got" (pr-str v)))))
        (atom/close! a)
        (if (zero? @errors)
          (do (println (str "OK " cnt))
              (js/process.exit 0))
          (do (println (str "FAIL " @errors))
              (js/process.exit 1))))

      ;; Read the number of keys in the atom map, print to stdout
      "read-key-count"
      (let [a   (atom/join-atom base)
            val @a
            n   (count val)]
        (atom/close! a)
        (println n)
        (js/process.exit 0))

      ;; Unknown action
      (do (js/console.error "Unknown action:" action)
          (js/process.exit 2)))))
