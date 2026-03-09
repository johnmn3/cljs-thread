(ns cljs-thread.eve.mmap-atom-e2e-test
  "Cross-process end-to-end tests for the B2 mmap-backed persistent atom.

   Uses child_process.spawnSync to spawn mmap-worker.js as a separate OS process.
   Tests validate that values written by one process are visible in another.

   Prerequisite: native addon built (build/Release/mmap_cas.node exists).
   mmap-worker.js must be compiled (shadow-compile mmap-worker).
   Run via: node target/thread-test/all.js mmap-atom-e2e

   Known limitations (Phase 6):
   - Sequential process spawning only. True parallel concurrency is Phase 7+.
   - No JVM process. Cross-process tests are Node.js to Node.js only.
   - Stale slots from crashed processes are not reclaimed (Phase 7+)."
  (:require [cljs.test :refer [deftest testing is]]
            [cljs-thread.eve.atom :as atom]
            [cljs-thread.eve.mem :as mem]))

(def ^:private cp (js* "require('child_process')"))
(def ^:private ts (str "-" (js/Date.now)))
(def ^:private worker-script
  (.resolve (js/require "path") "target/thread-test/mmap-worker.js"))

(defn- base [tag] (str "/tmp/eve-p6-e2e" ts "-" tag))

(defn- spawn [action & args]
  (let [result (.spawnSync cp "node"
                  (apply array worker-script action args)
                  #js {:encoding "utf8" :timeout 15000})]
    {:exit   (.-status result)
     :stdout (.-stdout result)
     :stderr (.-stderr result)}))

(deftest test-cross-process-visibility
  (testing "value written by process A is visible in process B"
    (let [b (base "vis")
          a (atom/persistent-atom b {:count 0})]
      (swap! a update :count inc)
      (atom/close! a)
      (let [r (spawn "join-verify" b "1")]
        (is (zero? (:exit r))
            (str "Process B should see {:count 1}. stderr: " (:stderr r)))))))

(deftest test-cross-process-mutual-swap
  (testing "A writes {:count 1}, B swaps to {:count 2}, re-joining A sees {:count 2}"
    (let [b (base "mut")
          a (atom/persistent-atom b {:count 0})]
      (swap! a update :count inc)
      (atom/close! a)
      (let [r (spawn "join-swap" b)]
        (is (zero? (:exit r))
            (str "Process B swap should succeed. stderr: " (:stderr r))))
      (let [c (atom/join-atom b)]
        (is (= 2 (:count @c))
            "Re-joining process should see {:count 2}")
        (atom/close! c)))))

(deftest test-sequential-multi-process-convergence
  (testing "5 sequential worker processes each increment count once -> {:count 5}"
    (let [b (base "conv")
          a (atom/persistent-atom b {:count 0})]
      (atom/close! a)
      (dotimes [_ 5]
        (let [r (spawn "join-swap" b)]
          (is (zero? (:exit r))
              (str "Worker swap should succeed. stderr: " (:stderr r)))))
      (let [c (atom/join-atom b)]
        (is (= 5 (:count @c))
            "Final count should be 5 after 5 sequential swaps")
        (atom/close! c)))))

(deftest test-epoch-gc-no-oom
  (testing "20 swaps complete without running out of slab memory (epoch GC active)"
    ;; Without epoch GC every swap leaks a full EveHashMap in slab memory.
    ;; With epoch GC, old trees are reclaimed. This proves no OOM occurs.
    (let [b (base "gc")
          a (atom/persistent-atom b {:count 0})]
      (dotimes [_ 20]
        (swap! a update :count inc))
      (is (= 20 (:count @a))
          "Count should reach 20 after 20 swaps without OOM")
      (atom/close! a))))
