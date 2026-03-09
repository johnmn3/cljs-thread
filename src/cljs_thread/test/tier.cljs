(ns cljs-thread.test.tier
  "Runtime tier setup for test execution.

   Each tier initializes the prerequisites needed for its test namespaces:
   - :pure  → nothing (tests run directly)
   - :slab  → slab allocator + atom-domain
   - :worker → see cljs-thread.test.tier-worker (separate ns to avoid pulling in cljs-thread.core)"
  (:require [cljs-thread.eve.deftype-proto.alloc :as eve-alloc]
            [cljs-thread.eve.shared-atom :as a]
            [cljs-thread.eve.data :as d]
            [cljs-thread.eve.map :as eve-map]
            [cljs-thread.eve.vec :as eve-vec]
            [cljs-thread.eve.list :as eve-list]
            [cljs-thread.eve.set :as eve-set]))

;; ---------------------------------------------------------------------------
;; Platform detection
;; ---------------------------------------------------------------------------

(def ^:private node?
  "True when running in Node.js."
  (and (exists? js/process) (exists? js/process.versions)))

(defn exit!
  "Signal test completion. Node: process.exit. Browser: set globals."
  [code]
  (if node?
    (js/process.exit code)
    (do
      (set! js/window.__test_exit_code code)
      (set! js/window.__test_complete true))))

(defn get-args
  "Get CLI args. Node: process.argv. Browser: URL search params."
  []
  (if node?
    (vec (.slice js/process.argv 2))
    (let [params (js/URLSearchParams. (.-search js/location))
          suite (.get params "suite")]
      (if (and suite (seq suite))
        [suite]
        []))))

;; ---------------------------------------------------------------------------
;; Slab tier initialization
;; ---------------------------------------------------------------------------

(defn init-slab!
  "Initialize slab allocator and atom domain for :slab tier tests.
   Returns a Promise that resolves when ready.

   Options:
     :slab-capacities - map of slab index → byte capacity (uses data.cljs defaults)
     :sab-size        - SharedArrayBuffer size for atom domain (default 256MB)
     :max-blocks      - max blocks in atom domain (default 65536)"
  [& {:keys [slab-capacities sab-size max-blocks]}]
  (-> (eve-alloc/init! :force true
                       :capacities (or slab-capacities {}))
      (.then (fn [_]
               (set! d/*worker-id* 1)
               (set! a/*global-atom-instance*
                     (a/atom-domain {} :sab-size (or sab-size (* 256 1024 1024))
                                       :max-blocks (or max-blocks 65536)))
               :slab-ready))))

(defn recycle-default-atom-domain!
  "Fully recycle the slab test environment between test namespaces.
   Resets all slab bitmaps (reclaiming every allocated block), clears the
   data-structure node pools and overflow allocator, then creates a fresh
   atom-domain with a clean SAB."
  []
  ;; 1. Reset all slab bitmaps — reclaims every allocated block
  (eve-alloc/reset-all-slabs!)
  ;; 2. Clear data-structure node pools (now stale — all offsets freed above)
  (eve-map/reset-pools!)
  (eve-vec/reset-pools!)
  (eve-list/reset-pools!)
  (eve-set/reset-pools!)
  ;; 3. Clear the stale overflow allocator ref so it re-acquires from
  ;;    the new atom-domain on next >1024 byte allocation
  (eve-alloc/reset-legacy-env!)
  ;; 4. Create fresh atom-domain with a clean SAB
  (set! a/*global-atom-instance*
        (a/atom-domain {})))

;; ---------------------------------------------------------------------------
;; DOM helpers (browser environment)
;; ---------------------------------------------------------------------------

(defn update-dom-status!
  "Update browser DOM with status message (no-op on Node)."
  [text css-class]
  (when-not node?
    (when-let [el (.getElementById js/document "status")]
      (set! (.-textContent el) text)
      (set! (.-className el) css-class))))

(defn update-dom-results!
  "Update browser DOM with test results (no-op on Node)."
  [test pass fail error]
  (when-not node?
    (let [total (+ pass fail error)
          summary (str "Ran " test " tests containing " total " assertions.\n"
                       fail " failures, " error " errors.")]
      (when-let [el (.getElementById js/document "results")]
        (set! (.-textContent el) summary)))))
