(ns cljs-thread.test.tier-worker
  "Worker-tier setup for test execution.

   Separate namespace from cljs-thread.test.tier to avoid pulling in
   cljs-thread.core (and its macros) for non-worker tiers.

   Handles:
   - thread/init! with optional config overrides (auto-detects everything)
   - Peer readiness polling via on-when
   - Dispatch to :core worker via `in`"
  (:require-macros [cljs-thread.core :refer [in on-when]])
  (:require [cljs-thread.core :as thread]
            [cljs-thread.state :as s]
            [cljs-thread.env :as e]))

;; ---------------------------------------------------------------------------
;; Environment detection
;; ---------------------------------------------------------------------------

(defn in-screen?
  "True if running on the main thread (screen)."
  []
  (e/in-screen?))

;; ---------------------------------------------------------------------------
;; Worker mesh initialization
;; ---------------------------------------------------------------------------

(defn init-worker!
  "Initialize the cljs-thread worker mesh.

   init! is idempotent and auto-detects everything: fat-kernel source
   from __filename, connect strings, SAB configuration. Pass config
   overrides (e.g. :future-count) to tune pool sizes.

   Options:
     :future-count  - number of future pool workers (default: num-cores + 1)
     :timeout-ms    - max wait for peers to be ready (default 30000)
     :on-ready      - callback invoked when all peers are ready
     :settle-ms     - delay after peers ready before calling on-ready (default 2000)"
  [& {:keys [future-count timeout-ms on-ready settle-ms]
      :or   {future-count 6 timeout-ms 30000 settle-ms 2000}}]
  ;; init! is idempotent — auto-detects fat-kernel source from __filename,
  ;; installs strategy, and spawns workers. Config merges before spawn.
  (thread/init! {:future-count future-count})

  ;; Wait for all required peers to be ready
  (on-when (and (contains? @s/peers :core)
                (contains? @s/peers :future)
                (some #(.startsWith (name %) "fp-") (keys @s/peers)))
    {:max-time timeout-ms}
    (println (str "Workers ready. Peers: " (set (keys @s/peers))))
    (when on-ready
      ;; Small delay ensures mesh is fully settled before running tests
      (js/setTimeout #(on-ready) settle-ms))))

;; ---------------------------------------------------------------------------
;; Worker dispatch helpers
;; ---------------------------------------------------------------------------

(defn dispatch-to-core!
  "Dispatch a function to :core worker and handle exit.
   The function should return an exit code (0 = success).

   Options:
     :on-exit - callback with exit code (default: process.exit)"
  [run-fn & {:keys [on-exit]
             :or   {on-exit (fn [code] (js/setTimeout #(js/process.exit code) 500))}}]
  (-> @(in :core [] (run-fn))
      (.then (fn [exit-code]
               (on-exit (if (number? exit-code) exit-code 1))))
      (.catch (fn [err]
                (println (str "\nFATAL: " (str err)))
                (on-exit 1)))))
