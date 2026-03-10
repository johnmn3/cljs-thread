(ns cljs-thread.eve
  "Public API for EVE — SharedArrayBuffer-backed atoms and data structures.

   Consumers should require only this namespace for all eve functionality.
   Provides: atom creation, data structure constructors, typed arrays,
   and worker auto-initialization."
  (:refer-clojure :exclude [atom aget aset hash-map hash-set])
  (:require
   [cljs.reader :refer [register-tag-parser!]]
   [eve.shared-atom :as a]
   [eve.array :as arr]
   [eve.data :as d]
   [eve.util :as u]
   [eve.wasm-mem :as wasm]
   [eve.deftype-proto.alloc :as eve-alloc]
   [eve.deftype-proto.xray :as slab-xray]
   [eve.map :as eve-map]  ;; registers direct-map-encoder
   [eve.vec]              ;; registers vector builder
   [eve.set :as eve-set]  ;; registers set builder
   [eve.list]             ;; registers list builder
   [cljs-thread.env :as env]
   [cljs-thread.platform :as p]
   [cljs-thread.state :as s]))

;; ============================================================================
;; Initialization
;; ============================================================================

(def init!
  "Initialize the EVE allocator. Returns a Promise.
   Must be called before creating atoms that use EVE data structures."
  eve-alloc/init!)

;; ============================================================================
;; Atom API
;; ============================================================================

(def atom
  "Create a SharedAtom within the global AtomDomain's SharedArrayBuffer.
   Usage: (eve/atom {:key \"value\"})
   The returned atom supports @, swap!, reset!, add-watch, remove-watch."
  a/atom)

(def atom-domain
  "Create a standalone AtomDomain with its own SharedArrayBuffer.
   Defaults: 256MB SAB (growable to 1GB), 65536 block descriptors.
   Usage: (eve/atom-domain {:counter 0})
   Useful for testing or isolated atoms that don't share memory."
  a/atom-domain)

(defn atom-domain?
  "Returns true if x is an eve AtomDomain."
  [x]
  (instance? a/AtomDomain x))

(defn shared-atom?
  "Returns true if x is an eve SharedAtom."
  [x]
  (instance? a/SharedAtom x))

(def ^:export sab-transfer-data
  "Extract SAB references from an AtomDomain for zero-copy cross-worker transfer.
   Returns {:sab <SharedArrayBuffer> :reader-map-sab <SharedArrayBuffer>}."
  a/sab-transfer-data)

(def ^:export check-remote-watches!
  "Check all watched atoms on this thread for changes and fire local watches.
   Called by the message-based fallback when a remote worker signals a change."
  a/check-remote-watches!)

(def set-broadcast-swap-fn!
  "Register a function to broadcast watch notifications to remote workers.
   Called with (f header-descriptor-idx) after a successful swap!.
   Used as fallback when Atomics.waitAsync is unavailable."
  a/set-broadcast-swap-fn!)

;; ============================================================================
;; Data Structure API — canonical Clojure names with eve/ prefix
;; ============================================================================

(def hash-map
  "Create a new EVE hash-map from key-value pairs.
   Usage: (eve/hash-map :a 1 :b 2) or (eve/hash-map) for empty."
  eve-map/hash-map)

(def empty-hash-map
  "Return an empty EVE hash-map."
  eve-map/empty-hash-map)

(def hash-set
  "Create a new EVE hash-set from values.
   Usage: (eve/hash-set :a :b :c) or (eve/hash-set) for empty."
  eve-set/hash-set)

(def empty-hash-set
  "Return an empty EVE hash-set."
  eve-set/empty-hash-set)

;; ============================================================================
;; Typed Array API
;; ============================================================================

(def aget
  "Access an element of an EveArray by index. Reads atomically from the SAB."
  arr/aget)

(def aset!
  "Set an element of an EveArray by index. Writes atomically to the SAB."
  arr/aset!)

(def get-typed-view
  "Get a typed array view of array data stored in an atom.
   Usage: (eve/get-typed-view @my-atom :my-array-key :uint8)"
  arr/get-typed-view)

;; ============================================================================
;; Worker Initialization (internal, used by cljs-thread runtime)
;; ============================================================================

;; Registry: SAB identity -> reconstructed AtomDomain
;; Supports multiple atoms per thread.
(defonce atom-registry (cljs.core/atom {}))

(defn ^:export reconstruct-s-atom-env
  "Reconstruct s-atom-env from raw SABs. Returns the env map."
  [sab reader-map-sab]
  (let [index-view (js/Int32Array. sab)
        data-view  (js/Uint8Array. sab)
        reader-map-view (when reader-map-sab (js/Int32Array. reader-map-sab))]
    {:sab             sab
     :index-view      index-view
     :data-view       data-view
     :reader-map-sab  reader-map-sab
     :reader-map-view reader-map-view
     :config          {:sab-total-size-bytes     (.-byteLength sab)
                       :max-block-descriptors    (u/atomic-load-int index-view (/ d/OFFSET_MAX_BLOCK_DESCRIPTORS d/SIZE_OF_INT32))
                       :index-region-size        (u/atomic-load-int index-view (/ d/OFFSET_INDEX_REGION_SIZE d/SIZE_OF_INT32))
                       :data-region-start-offset (u/atomic-load-int index-view (/ d/OFFSET_DATA_REGION_START d/SIZE_OF_INT32))}}))

(defn ^:export init-eve-on-worker!
  "Initialize eve's AtomDomain on a worker thread from SAB config.
   sab-config is a JS object with .sab and .reader_map_sab properties,
   or a CLJS map with :sab and :reader-map-sab keys.
   Also initializes the slab allocator if slab SABs are present."
  [sab-config]
  (let [;; Handle both JS objects (from workerData) and CLJS maps.
        ;; CRITICAL: use aget with string keys for JS property access.
        ;; Closure :advanced renames (.-sab x) to x.XX but postMessage
        ;; structured-clone preserves the ORIGINAL property names from the
        ;; sender. Since the sender uses #js {"sab" v}, the message has
        ;; {sab: v} — aget "sab" matches; (.-sab x) → x.XX does NOT.
        sab            (or (cljs.core/aget sab-config "sab")
                           (:sab sab-config))
        reader-map-sab (or (cljs.core/aget sab-config "reader-map-sab")
                           (:reader-map-sab sab-config))
        slab-sabs      (or (cljs.core/aget sab-config "slab-sabs")
                           (:slab-sabs sab-config))
        root-sab-val   (or (cljs.core/aget sab-config "root-sab")
                           (:root-sab sab-config))]
    (when sab
      (let [s-atom-env    (reconstruct-s-atom-env sab reader-map-sab)
            atom-instance (a/->AtomDomain s-atom-env nil {} (cljs.core/atom {}))]
        ;; Assign a unique non-zero worker-id for CAS lock ownership.
        ;; Must happen before any SAB operations (alloc, swap!, etc.).
        (when-not d/*worker-id*
          (set! d/*worker-id* (inc (js/Math.floor (* (js/Math.random) 2147483646)))))
        (set! a/*global-atom-instance* atom-instance)
        (a/init-worker-cache! s-atom-env)
        (wasm/init-views-from-sab! sab)
        ;; Initialize slab allocator from shared SABs (if provided)
        (when slab-sabs
          (eve-alloc/init-worker-slabs! slab-sabs root-sab-val sab)
          ;; SLAB X-RAY: validate slab invariants after worker initialization
          (when slab-xray/DIAGNOSTICS
            (slab-xray/enable-trace!)
            (slab-xray/enable-pool-tracking!)
            (slab-xray/slab-xray-validate! (str "WORKER-INIT id:" d/*worker-id*))))
        ;; Register in atom-registry keyed by SAB identity
        (swap! atom-registry assoc sab atom-instance)
        ;; Also set eve-sab-config so fat kernel propagates SAB config
        ;; to child workers spawned by this thread (e.g., root spawns core/db)
        (reset! s/eve-sab-config {:sab sab :reader-map-sab reader-map-sab
                                  :slab-sabs slab-sabs :root-sab root-sab-val})
        atom-instance))))

(defn ^:export get-or-reconstruct-atom
  "Get existing atom for this SAB, or reconstruct one.
   Uses SAB identity check to avoid redundant reconstruction."
  [sab reader-map-sab]
  (if-let [existing (get @atom-registry sab)]
    existing
    (init-eve-on-worker! {:sab sab :reader-map-sab reader-map-sab})))

(defn ^:export get-global-atom
  "Return the global AtomDomain instance on this thread.
   Used by conveyance (unstr-body) — workers already have the atom
   initialized via auto-init! at namespace load time."
  []
  a/*global-atom-instance*)

(defn ^:export reconstruct-shared-atom
  "Reconstruct a SharedAtom on this thread from its identity fields.
   Used by tag reader when a shared atom is parsed from EDN."
  [shared-atom-id header-descriptor-idx]
  (when-let [parent a/*global-atom-instance*]
    (a/->SharedAtom parent shared-atom-id header-descriptor-idx
                    nil {} (cljs.core/atom {}))))

;; Register tag reader for SharedAtom serialization
(register-tag-parser!
  'eve/shared-atom
  (fn [{:keys [id idx]}]
    (reconstruct-shared-atom id idx)))

(defn- read-eve-config-from-worker-data
  "Read __eve_sab_config from globalThis where platform.cljs saved it.
   platform/node-init-data extracts __eve_sab_config from workerData and
   saves it to globalThis BEFORE calling js->clj (which would mangle SABs)."
  []
  (when p/node?
    (try
      (when (and (exists? js/globalThis.__eve_sab_config)
                 (some? js/globalThis.__eve_sab_config))
        js/globalThis.__eve_sab_config)
      (catch :default _ nil))))

(defn- read-eve-config-from-bootstrap
  "Read __eve_sab_config_sync from self where the bootstrap blob stored it.
   Browser two-phase boot: bootstrap blob receives SABs via postMessage,
   stores on self.__eve_sab_config_sync, then importScripts the kernel.
   By the time auto-init! runs, the SABs are already available."
  []
  (when (not p/node?)
    (try
      (when (and (exists? js/self.__eve_sab_config_sync)
                 (some? js/self.__eve_sab_config_sync))
        (let [config js/self.__eve_sab_config_sync]
          (js-delete js/self "__eve_sab_config_sync")
          config))
      (catch :default _ nil))))

(defn ^:export auto-init!
  "Auto-detect and initialize eve on this thread.
   Checks workerData (Node.js) or bootstrap sync config (browser) for SABs.
   Called at namespace load time on worker threads."
  []
  (when-not (env/in-screen?)
    (when-not a/*global-atom-instance*
      ;; Try Node.js workerData path first, then browser bootstrap path
      (when-let [config (or (read-eve-config-from-worker-data)
                            (read-eve-config-from-bootstrap))]
        (init-eve-on-worker! config)))))

;; Auto-initialize on worker threads at namespace load time.
;; On the main thread this is a no-op.
(auto-init!)

;; On the main thread, initialize the slab allocator synchronously so that
;; e/atom can be called immediately at namespace load time.  Typed-array
;; views are registered in-line (JS-fallback bitmap ops); WASM is compiled
;; in the background and upgrades the instances when ready.
(when (env/in-screen?)
  (eve-alloc/init!)
  ;; Pre-populate slab SABs + root SAB in eve-sab-config so they're
  ;; available when fat_kernel spawns workers.  core.cljs/start! will
  ;; merge in the atom SABs (:sab, :reader-map-sab) later.
  (swap! s/eve-sab-config merge
         {:slab-sabs (eve-alloc/get-all-slab-sabs)
          :root-sab  (eve-alloc/get-root-sab)}))

;; ---------------------------------------------------------------------------
;; Browser worker EVE conveyance via postMessage
;; ---------------------------------------------------------------------------
;; Browser blob workers can't receive SABs via the blob source (strings can't
;; hold structured-clone objects). The fat kernel postMessages SABs immediately
;; after creating the blob worker. This listener catches the message and
;; initializes EVE before any cljs-thread `in` messages arrive.

(defonce ^:private browser-eve-ready-promise (cljs.core/atom nil))

(defn- setup-eve-ready-promise!
  "Set up the browser worker __eve_sab_config listener.
   Called at module load time on browser worker threads.
   state.cljs loads before eve.cljs, so p/sab-sync? already reflects
   any force-sw-sync! propagation by this point.
   If auto-init! already initialized EVE from bootstrap sync config,
   resolves immediately."
  []
  (let [p (cond
            ;; Already initialized (bootstrap blob delivered SABs synchronously)
            a/*global-atom-instance*
            (js/Promise.resolve true)

            ;; No SAB, or SW sync forced → EVE shared memory won't arrive
            ;; via postMessage.  Resolve immediately so downstream waiters
            ;; (e.g. start-futures in root.cljs) aren't blocked.
            (or (not (exists? js/SharedArrayBuffer))
                (not p/sab-sync?))
            (js/Promise.resolve nil)

            ;; SAB available & SAB sync active → wait for __eve_sab_config
            ;; This is a fallback for non-bootstrap spawn paths (e.g. URL workers).
            :else
            (js/Promise.
              (fn [resolve _reject]
                (let [handler (fn handler [^js event]
                                (let [data (.-data event)]
                                  (when (and (some? data)
                                             (not (string? data))
                                             (some? (cljs.core/aget data "__eve_sab_config")))
                                    (js/self.removeEventListener "message" handler)
                                    (init-eve-on-worker! (cljs.core/aget data "__eve_sab_config"))
                                    (resolve true))))]
                  (js/self.addEventListener "message" handler)))))]
    (reset! browser-eve-ready-promise p)
    p))

;; Eagerly set up the __eve_sab_config listener on browser worker threads.
;; The postMessage from fat_kernel arrives after synchronous module loading
;; completes, so the listener is guaranteed to be ready.
(when (and (not p/node?) (not (env/in-screen?)))
  (setup-eve-ready-promise!))

(defn ^:export eve-ready
  "Returns a Promise that resolves when EVE is initialized on this thread.
   Main thread and Node.js workers: resolves immediately.
   Browser blob workers: returns the promise set up at module load time."
  []
  (if a/*global-atom-instance*
    (js/Promise.resolve true)
    (or @browser-eve-ready-promise
        (js/Promise.resolve nil))))

;; ============================================================================
;; Slab X-RAY Integration
;; ============================================================================

;; Register slab x-ray validator with shared-atom to avoid circular dependency.
;; Only registers when DIAGNOSTICS is true (compile-time flag).
(when slab-xray/DIAGNOSTICS
  (a/register-slab-xray-validator! slab-xray/slab-xray-validate!))
