(ns cljs-thread.eve.atom
  "Cross-process persistent atom backed by mmap slab files.

   B2 architecture: HAMT nodes live in slab files (.slab0–.slab5).
   The root pointer in .root is a slab-qualified i32 [class:3|block:29].
   A swap! does O(log n) slab allocations then CASes the root pointer.

   No .main file. No block descriptor table. No flat serialization.

   Phase 7: universal root types (any Eve collection, scalar, or nil).
   Phase 6 extends: epoch GC, cross-process acceptance test."
  (:refer-clojure :exclude [atom])
  (:require
   [cljs-thread.eve.deftype-proto.coalesc :as coalesc]
   [cljs-thread.eve.deftype-proto.data :as d]
   [cljs-thread.eve.deftype-proto.alloc :as alloc]
   [cljs-thread.eve.deftype-proto.serialize :as ser]
   [cljs-thread.eve.mem :as mem]
   #?@(:cljs [[cljs-thread.eve.map :as eve-map]
              [cljs-thread.eve.vec]
              [cljs-thread.eve.set]
              [cljs-thread.eve.list]]
      :clj  [[cljs-thread.eve.map :as eve-map]
              [cljs-thread.eve.set :as eve-set]
              [cljs-thread.eve.vec :as eve-vec]
              [cljs-thread.eve.list :as eve-list]]))
  #?(:clj (:import [cljs_thread.eve.map EveHashMap])))

;; ---------------------------------------------------------------------------
;; B2 constants
;; Root pointer format: alloc/encode-slab-offset [class:3 | block:29]
;; NOT data/pack-slab-ptr [class:8 | block:24] — that encoding is wrong here.
;; ---------------------------------------------------------------------------

(def ^:const ROOT_BYTES d/ROOT_SAB_SIZE)   ;; 6208
(def ^:const READER_MAP_BYTES 262144)

;; OBJ-1: Time-throttled retire flush — skip the expensive 256-slot scan
;; when the last scan was recent enough. Correctness: we only delay freeing,
;; never free too early. Retire queue grows bounded by threshold.
(def ^:const FLUSH_INTERVAL_MS 50)
(def ^:const FLUSH_QUEUE_THRESHOLD 64)

;; OBJ-4: CAS retry backoff — jittered exponential backoff on CAS failure.
;; Reduces thundering herd under contention (8+ writers).
;; Zero overhead when CAS succeeds on the first attempt.
(def ^:const BACKOFF_CAP_MS 8)

;; ---------------------------------------------------------------------------
;; Worker slot helpers — operate on mmap root-r, NOT the SAB @root-region
;; ---------------------------------------------------------------------------

(defn- worker-slot-offset [slot-idx field-offset]
  (+ d/ROOT_WORKER_REGISTRY_START (* slot-idx d/WORKER_SLOT_SIZE) field-offset))

(defn- write-heartbeat!
  "Write the current time as a 64-bit timestamp split into two i32s."
  [root-r slot-idx]
  (let [now #?(:cljs (js/Date.now) :clj (System/currentTimeMillis))]
    (mem/-store-i32! root-r
      (worker-slot-offset slot-idx d/OFFSET_WS_HEARTBEAT_LO)
      #?(:cljs (bit-and now 0xFFFFFFFF)
         :clj  (unchecked-int (bit-and now 0xFFFFFFFF))))
    (mem/-store-i32! root-r
      (worker-slot-offset slot-idx d/OFFSET_WS_HEARTBEAT_HI)
      #?(:cljs (unsigned-bit-shift-right now 32)
         :clj  (unchecked-int (unsigned-bit-shift-right now 32))))))

(defn- heartbeat-stale?
  "True if the heartbeat timestamp for slot-idx is older than HEARTBEAT_TIMEOUT_MS."
  [root-r slot-idx]
  (let [lo  (mem/-load-i32 root-r (worker-slot-offset slot-idx d/OFFSET_WS_HEARTBEAT_LO))
        hi  (mem/-load-i32 root-r (worker-slot-offset slot-idx d/OFFSET_WS_HEARTBEAT_HI))
        ts  #?(:cljs (+ (* (unsigned-bit-shift-right hi 0) 0x100000000)
                        (unsigned-bit-shift-right lo 0))
               :clj  (bit-or (bit-shift-left (bit-and (long hi) 0xFFFFFFFF) 32)
                             (bit-and (long lo) 0xFFFFFFFF)))
        now #?(:cljs (js/Date.now) :clj (System/currentTimeMillis))]
    (> (- now ts) d/HEARTBEAT_TIMEOUT_MS)))

(defn- mmap-claim-slot!
  "CAS-scan the worker registry to claim the first INACTIVE slot.
   If all slots are occupied, does a second pass reclaiming stale ACTIVE slots.
   Stores ACTIVE and zeroes CURRENT_EPOCH. Returns slot-idx.
   Throws if all 256 slots are occupied and none are stale."
  [root-r]
  (or
   ;; First pass: look for INACTIVE slots
   (loop [i 0]
     (when (< i d/MAX_WORKERS)
       (let [status-off (worker-slot-offset i d/OFFSET_WS_STATUS)
             witness    (mem/-cas-i32! root-r status-off
                                      d/WORKER_STATUS_INACTIVE
                                      d/WORKER_STATUS_ACTIVE)]
         (if (== witness d/WORKER_STATUS_INACTIVE)
           (do (mem/-store-i32! root-r
                 (worker-slot-offset i d/OFFSET_WS_CURRENT_EPOCH) 0)
               i)
           (recur (inc i))))))
   ;; Second pass: reclaim stale ACTIVE slots
   (loop [i 0]
     (when (< i d/MAX_WORKERS)
       (let [status (mem/-load-i32 root-r (worker-slot-offset i d/OFFSET_WS_STATUS))]
         (if (and (== status d/WORKER_STATUS_ACTIVE)
                  (heartbeat-stale? root-r i))
           (let [witness (mem/-cas-i32! root-r (worker-slot-offset i d/OFFSET_WS_STATUS)
                                        d/WORKER_STATUS_ACTIVE d/WORKER_STATUS_ACTIVE)]
             (if (== witness d/WORKER_STATUS_ACTIVE)
               (do (mem/-store-i32! root-r
                     (worker-slot-offset i d/OFFSET_WS_CURRENT_EPOCH) 0)
                   i)
               (recur (inc i))))
           (recur (inc i))))))
   (throw (ex-info "mmap-atom: no free worker slot in .root" {}))))

(defn- mmap-release-slot!
  "Clear CURRENT_EPOCH then set STATUS back to INACTIVE."
  [root-r slot-idx]
  (mem/-store-i32! root-r (worker-slot-offset slot-idx d/OFFSET_WS_CURRENT_EPOCH) 0)
  (mem/-store-i32! root-r (worker-slot-offset slot-idx d/OFFSET_WS_STATUS)
                          d/WORKER_STATUS_INACTIVE))

(defn- mmap-pin-epoch!
  "Announce this process is reading at epoch. Call BEFORE reading root ptr."
  [root-r slot-idx epoch]
  (mem/-store-i32! root-r (worker-slot-offset slot-idx d/OFFSET_WS_CURRENT_EPOCH) epoch))

(defn- mmap-unpin-epoch!
  "Clear the read-epoch announcement. Call AFTER deref completes (in finally)."
  [root-r slot-idx]
  (mem/-store-i32! root-r (worker-slot-offset slot-idx d/OFFSET_WS_CURRENT_EPOCH) 0))

(defn- mmap-min-safe-epoch
  "Scan the worker registry. Return the minimum CURRENT_EPOCH among all
   ACTIVE slots that are currently pinned (CURRENT_EPOCH != 0).
   Returns nil if no slot is pinned — meaning all retired entries are safe."
  [root-r]
  (loop [i 0 result nil]
    (if (>= i d/MAX_WORKERS)
      result
      (let [status (mem/-load-i32 root-r (worker-slot-offset i d/OFFSET_WS_STATUS))
            epoch  (mem/-load-i32 root-r (worker-slot-offset i d/OFFSET_WS_CURRENT_EPOCH))]
        (if (and (== status d/WORKER_STATUS_ACTIVE)
                 (not (zero? epoch))
                 (not (heartbeat-stale? root-r i)))
          (recur (inc i) (if (nil? result) epoch (min result epoch)))
          (recur (inc i) result))))))

;; ---------------------------------------------------------------------------
;; CLJS domain open/join
;; ---------------------------------------------------------------------------

#?(:cljs
   (do
     ;; OBJ-4: Tiny SAB used by Atomics.wait for sub-ms CAS backoff sleep.
     (def ^:private backoff-i32
       (js/Int32Array. (js/SharedArrayBuffer. 4)))

     (defn- cas-backoff!
       "Jittered exponential backoff after CAS failure.
        First 3 failures retry immediately (handles low contention without penalty).
        Failures 4+ use 1..min(2^(n-3),8) ms Atomics.wait to break thundering herd."
       [attempt]
       (when (> attempt 3)
         (let [max-ms (min (bit-shift-left 1 (min (- attempt 3) 3)) BACKOFF_CAP_MS)
               ms     (inc (rand-int max-ms))]
           (js/Atomics.wait backoff-i32 0 0 ms))))

     (defn- cljs-open-mmap-domain!
       "Create and initialise mmap-backed atom domain files.
        Opens/creates: {base}.slab0–.slab5, {base}.root, {base}.rmap.
        Writes .root header. Returns domain-state map.
        NOTE: Replaces the module-level slab instances.
              A process using the mmap atom cannot simultaneously use
              the intra-process SAB atom."
       [base-path & {:keys [capacities] :or {capacities {}}}]
       ;; Disable alloc-debug-set for mmap atoms (cross-process bitmap CAS is the guard)
       (set! eve-map/mmap-mode? true)
       ;; 1. Create/init 6 bitmap slab files (data + bitmap) + 1 coalescing slab
       ;;    Uses initial (small) capacities by default for lazy growth.
       (dotimes [i d/NUM_SLAB_CLASSES]
         (let [cap (get capacities i (d/initial-capacity-for-class i))]
           (alloc/init-mmap-slab! i (str base-path ".slab" i)
                                  :capacity cap)))
       (alloc/init-mmap-coalesc! (str base-path ".slab6"))
       ;; 2. Open .root and .rmap
       (let [root-r (mem/open-mmap-region (str base-path ".root") ROOT_BYTES)
             rmap-r (mem/open-mmap-region (str base-path ".rmap") READER_MAP_BYTES)]
         ;; 3. Write .root header
         (mem/store-i32! root-r d/ROOT_MAGIC_OFFSET d/ROOT_MAGIC)
         (mem/store-i32! root-r d/ROOT_ATOM_PTR_OFFSET alloc/NIL_OFFSET)
         (mem/store-i32! root-r d/ROOT_EPOCH_OFFSET 1)
         (mem/store-i32! root-r d/ROOT_WORKER_REG_OFFSET d/ROOT_WORKER_REGISTRY_START)
         ;; 4. Init worker slots
         (dotimes [slot d/MAX_WORKERS]
           (mem/store-i32! root-r
             (+ d/ROOT_WORKER_REGISTRY_START (* slot d/WORKER_SLOT_SIZE))
             d/WORKER_STATUS_INACTIVE))
         ;; 5. Claim a slot for this process
         (let [slot-idx (mmap-claim-slot! root-r)]
           (write-heartbeat! root-r slot-idx)
           (let [timer-id (js/setInterval #(write-heartbeat! root-r slot-idx) 10000)]
             (.on js/process "exit"
               (fn [_] (mmap-release-slot! root-r slot-idx)))
             {:root-r root-r :rmap-r rmap-r :base-path base-path
              :slot-idx slot-idx :timer-id timer-id
              :retire-q (cljs.core/atom [])
              :flush-ts (doto (make-array 1) (aset 0 0))}))))

     (defn- cljs-join-mmap-domain!
       "Open existing mmap-backed atom domain files.
        Opens: {base}.slab0–.slab5, {base}.root, {base}.rmap.
        NOTE: Replaces the module-level slab instances."
       [base-path]
       ;; Disable alloc-debug-set for mmap atoms (cross-process bitmap CAS is the guard)
       (set! eve-map/mmap-mode? true)
       (dotimes [i d/NUM_SLAB_CLASSES]
         (alloc/open-mmap-slab! i (str base-path ".slab" i)))
       (alloc/open-mmap-coalesc! (str base-path ".slab6"))
       (let [root-r   (mem/open-mmap-region (str base-path ".root") ROOT_BYTES)
             rmap-r   (mem/open-mmap-region (str base-path ".rmap") READER_MAP_BYTES)
             slot-idx (mmap-claim-slot! root-r)]
         (write-heartbeat! root-r slot-idx)
         (let [timer-id (js/setInterval #(write-heartbeat! root-r slot-idx) 10000)]
           (.on js/process "exit"
             (fn [_] (mmap-release-slot! root-r slot-idx)))
           {:root-r root-r :rmap-r rmap-r :base-path base-path
            :slot-idx slot-idx :timer-id timer-id
            :retire-q (cljs.core/atom [])
            :flush-ts (doto (make-array 1) (aset 0 0))})))

     (defn- cljs-mmap-deref
       "Read the current atom value from the .root file.
        Pins epoch before reading root ptr to protect against epoch GC.
        Returns an Eve type instance (or nil) based on the header type-id byte."
       [{:keys [root-r slot-idx]}]
       ;; Refresh slab regions in case another process grew them
       (alloc/refresh-mmap-slabs!)
       (let [epoch (mem/-load-i32 root-r d/ROOT_EPOCH_OFFSET)]
         (mmap-pin-epoch! root-r slot-idx epoch)
         (try
           (let [ptr (mem/-load-i32 root-r d/ROOT_ATOM_PTR_OFFSET)]
             (when (not= ptr alloc/NIL_OFFSET)
               (let [type-id (alloc/read-header-type-byte ptr)]
                 (if (== type-id ser/SCALAR_BLOCK_TYPE_ID)
                   (alloc/read-scalar-block ptr)
                   (let [ctor (ser/get-header-constructor type-id)]
                     (if ctor
                       (ctor nil ptr)
                       (throw (ex-info "mmap-atom: unknown root value type-id"
                                       {:type-id type-id :ptr ptr}))))))))
           (finally
             (mmap-unpin-epoch! root-r slot-idx)))))

     (defn- cljs-try-flush-retires!
       "Flush retired slab offsets whose epoch is safe to reclaim.
        OBJ-1: Skip the 256-slot scan when the last scan was recent (< FLUSH_INTERVAL_MS)
        and the queue is small (< FLUSH_QUEUE_THRESHOLD). This eliminates up to 768
        N-API crossings per swap in the common case."
       [root-r retire-q flush-ts]
       (let [now    (js/Date.now)
             last-t (aget flush-ts 0)
             q      @retire-q
             q-len  (count q)]
         (when (or (> (- now last-t) FLUSH_INTERVAL_MS)
                   (> q-len FLUSH_QUEUE_THRESHOLD))
           (aset flush-ts 0 now)
           (let [safe-epoch (mmap-min-safe-epoch root-r)
                 grouped    (group-by (fn [{:keys [epoch]}]
                                        (or (nil? safe-epoch) (< epoch safe-epoch)))
                                      q)
                 to-free    (get grouped true)
                 still-live (get grouped false)]
             (doseq [{:keys [offsets]} to-free]
               (doseq [off offsets]
                 (when (not= off alloc/NIL_OFFSET)
                   (eve-map/untrack-debug-offset! off)
                   (alloc/free! off))))
             (reset! retire-q (or still-live []))))))

     (defn- cljs-resolve-new-ptr
       "Resolve the slab-qualified offset for a new atom root value.
        Returns alloc/NIL_OFFSET for nil, header-off for IEveRoot types,
        converts CLJS native types via builders, or allocates a scalar block."
       [new-val]
       (cond
         (nil? new-val)
         alloc/NIL_OFFSET

         ;; Already an Eve type in the slab — use its header-off directly
         (satisfies? d/IEveRoot new-val)
         (d/-root-header-off new-val)

         ;; CLJS native type (PersistentHashMap, PersistentVector, etc.)
         ;; — convert via the existing cljs-to-sab-builders registry
         :else
         (let [eve-val (ser/convert-to-sab new-val)]
           (if eve-val
             (d/-root-header-off eve-val)
             ;; Not a collection — treat as scalar primitive
             (alloc/alloc-scalar-block! new-val)))))

     (defn- cljs-mmap-swap!
       "B2 CAS-loop swap. Accepts any Eve type, CLJS native type, scalar, or nil.
        On CAS failure, frees the newly-allocated value (safe: not yet published).
        On CAS success, retires old ptr via epoch GC retire queue.
        Binds *parent-atom* so nested collection allocation (vec/set/list alloc-node!)
        passes the atomic-context guard.

        IMPORTANT: epoch is pinned for the ENTIRE swap iteration (read + apply f +
        CAS) to prevent the JVM from freeing slab blocks that the lazy Eve value
        still references.  cljs-mmap-deref is NOT used here because it unpins in
        its finally block, which is too early — applying f to the lazy old-val would
        access slab data with the epoch unpinned."
       [{:keys [root-r slot-idx retire-q flush-ts] :as domain-state} f args]
       (loop [attempt 0]
         (when (>= attempt d/MAX_SWAP_RETRIES)
           (throw (ex-info "mmap-atom swap!: max retries exceeded" {:attempts attempt})))
         ;; Refresh slab regions in case another process grew them
         (alloc/refresh-mmap-slabs!)
         ;; Pin epoch for the entire iteration — protects lazy old-val reads
         (let [epoch (mem/-load-i32 root-r d/ROOT_EPOCH_OFFSET)]
           (mmap-pin-epoch! root-r slot-idx epoch)
           (let [old-ptr (mem/-load-i32 root-r d/ROOT_ATOM_PTR_OFFSET)
                 old-val (when (not= old-ptr alloc/NIL_OFFSET)
                           (let [type-id (alloc/read-header-type-byte old-ptr)]
                             (if (== type-id ser/SCALAR_BLOCK_TYPE_ID)
                               (alloc/read-scalar-block old-ptr)
                               (let [ctor (ser/get-header-constructor type-id)]
                                 (if ctor
                                   (ctor nil old-ptr)
                                   (throw (ex-info "mmap-atom swap!: unknown root type-id"
                                                   {:type-id type-id :ptr old-ptr})))))))
                 ;; Bind *parent-atom* so nested collection builders (vec/set/list)
                 ;; can allocate HAMT nodes in slabs during the user function.
                 [new-val new-ptr]
                 (binding [d/*parent-atom* domain-state]
                   (let [nv (apply f old-val args)]
                     [nv (cljs-resolve-new-ptr nv)]))
                 w (mem/-cas-i32! root-r d/ROOT_ATOM_PTR_OFFSET old-ptr new-ptr)]
             ;; Unpin epoch — CAS is done, old tree traversal is complete
             (mmap-unpin-epoch! root-r slot-idx)
             (if (== w old-ptr)
               (let [new-epoch (mem/-add-i32! root-r d/ROOT_EPOCH_OFFSET 1)]
                 (when (not= old-ptr alloc/NIL_OFFSET)
                   ;; Collect offsets to free NOW (both trees are live),
                   ;; but defer the actual freeing until the epoch is safe.
                   (let [offsets (if (instance? eve-map/EveHashMap old-val)
                                  (eve-map/collect-retire-diff-offsets old-val new-val)
                                  [old-ptr])]
                     ;; Untrack from debug-set immediately so subsequent allocs
                     ;; don't false-positive when these offsets are re-used
                     (doseq [off offsets]
                       (eve-map/untrack-debug-offset! off))
                     (swap! retire-q conj {:offsets offsets
                                           :epoch (inc new-epoch)})))
                 (cljs-try-flush-retires! root-r retire-q flush-ts)
                 new-val)
               (do (when (and (not= new-ptr alloc/NIL_OFFSET)
                              (not= new-ptr old-ptr))
                     ;; CAS failed — free the abandoned new value immediately.
                     ;; The new nodes were never published, so no reader can see them.
                     (if (instance? eve-map/EveHashMap new-val)
                       (d/-sab-retire-diff! new-val
                         (when (instance? eve-map/EveHashMap old-val) old-val)
                         nil :free)
                       ;; Non-Eve type was converted to fresh tree — just free header
                       (alloc/free! new-ptr)))
                   (cas-backoff! attempt)
                   (recur (inc attempt))))))))))

;; ---------------------------------------------------------------------------
;; JVM domain open/join
;; ---------------------------------------------------------------------------

#?(:clj
   (do
     (defn- cas-backoff!
       "Jittered exponential backoff after CAS failure (JVM).
        First 3 failures retry immediately. Failures 4+ use LockSupport/parkNanos
        with 100μs..min(2^(n-3),8)ms jitter to break thundering herd."
       [attempt]
       (when (> attempt 3)
         (let [max-ms (min (bit-shift-left 1 (min (- attempt 3) 3)) BACKOFF_CAP_MS)
               nanos  (* (inc (rand-int (* max-ms 1000))) 1000)]
           (java.util.concurrent.locks.LockSupport/parkNanos nanos))))

     (defn- jvm-open-mmap-domain!
       "Create and initialise mmap-backed atom domain on JVM.
        Opens/creates .slab0–.slab5 as JvmMmapRegion, wraps in JvmSlabCtx.
        Opens .root and .rmap. Writes .root header. Returns domain-state map.
        Uses initial (small) capacities by default for lazy growth."
       [base-path & {:keys [capacities] :or {capacities {}}}]
       (let [slab-paths (mapv #(str base-path ".slab" %) (range d/NUM_SLAB_CLASSES))
             bm-paths   (mapv #(str base-path ".slab" % ".bm") (range d/NUM_SLAB_CLASSES))
             init-result
             (mapv (fn [i]
                     (let [block-size  (nth d/SLAB_SIZES i)
                           init-cap    (get capacities i (d/initial-capacity-for-class i))
                           layout      (d/mmap-slab-layout block-size init-cap)
                           init-blocks (:total-blocks layout)
                           data-bytes  (:data-bytes layout)
                           bm-bytes    (:bitmap-bytes layout)
                           region      (mem/open-mmap-region (nth slab-paths i) data-bytes)
                           bm-region   (mem/open-mmap-region (nth bm-paths i) bm-bytes)]
                       (mem/-store-i32! region d/SLAB_HDR_MAGIC d/SLAB_MAGIC)
                       (mem/-store-i32! region d/SLAB_HDR_BLOCK_SIZE block-size)
                       (mem/-store-i32! region d/SLAB_HDR_TOTAL_BLOCKS init-blocks)
                       (mem/-store-i32! region d/SLAB_HDR_FREE_COUNT init-blocks)
                       (mem/-store-i32! region d/SLAB_HDR_ALLOC_CURSOR 0)
                       (mem/-store-i32! region d/SLAB_HDR_CLASS_IDX i)
                       (mem/-store-i32! region d/SLAB_HDR_BITMAP_OFFSET 0)
                       (mem/-store-i32! region d/SLAB_HDR_DATA_OFFSET d/SLAB_HEADER_SIZE)
                       {:region region :bm-region bm-region}))
                   (range d/NUM_SLAB_CLASSES))
             regions    (mapv :region init-result)
             bm-regions (mapv :bm-region init-result)
             ;; Class 6: coalescing overflow allocator — lazy growth
             coalesc-init-sz coalesc/INITIAL_DATA_SIZE
             coalesc-layout (coalesc/coalesc-layout coalesc-init-sz
                                                     coalesc/MAX_DESCRIPTORS)
             coalesc-r      (mem/open-mmap-region
                              (str base-path ".slab6") (:total-bytes coalesc-layout))
             _              (coalesc/init-coalesc-region! coalesc-r
                                                          coalesc-init-sz
                                                          coalesc/MAX_DESCRIPTORS)
             regions-7      (conj regions coalesc-r)
             bm-regions-7   (conj bm-regions nil)
             paths-7        (conj slab-paths (str base-path ".slab6"))
             bm-paths-7     (conj bm-paths nil)
             sio    (alloc/make-jvm-slab-ctx regions-7 bm-regions-7
                                              paths-7 bm-paths-7 nil)
             root-r (mem/open-mmap-region (str base-path ".root") ROOT_BYTES)
             rmap-r (mem/open-mmap-region (str base-path ".rmap") READER_MAP_BYTES)]
         (mem/-store-i32! root-r d/ROOT_MAGIC_OFFSET d/ROOT_MAGIC)
         (mem/-store-i32! root-r d/ROOT_ATOM_PTR_OFFSET alloc/NIL_OFFSET)
         (mem/-store-i32! root-r d/ROOT_EPOCH_OFFSET 1)
         ;; Init all worker slots to INACTIVE
         (dotimes [slot d/MAX_WORKERS]
           (mem/-store-i32! root-r
             (+ d/ROOT_WORKER_REGISTRY_START (* slot d/WORKER_SLOT_SIZE))
             d/WORKER_STATUS_INACTIVE))
         (let [slot-idx (mmap-claim-slot! root-r)]
           (write-heartbeat! root-r slot-idx)
           (let [sched (doto (java.util.concurrent.Executors/newSingleThreadScheduledExecutor
                               (reify java.util.concurrent.ThreadFactory
                                 (newThread [_ r]
                                   (doto (Thread. r)
                                     (.setDaemon true)
                                     (.setName "eve-heartbeat")))))
                          (.scheduleAtFixedRate
                            #(write-heartbeat! root-r slot-idx)
                            10 10 java.util.concurrent.TimeUnit/SECONDS))]
             {:root-r root-r :rmap-r rmap-r :sio sio :base-path base-path
              :slot-idx slot-idx :heartbeat-sched sched
              :retire-q (java.util.concurrent.ConcurrentLinkedQueue.)
              :tree-logs (java.util.concurrent.ConcurrentHashMap.)
              :flush-ts (volatile! 0)
              :thread-epochs (java.util.concurrent.ConcurrentHashMap.)
              :pin-lock (Object.)}))))

     (defn- jvm-join-mmap-domain!
       "Open existing mmap-backed atom domain on JVM."
       [base-path]
       (let [slab-paths (mapv #(str base-path ".slab" %) (range d/NUM_SLAB_CLASSES))
             bm-paths   (mapv #(str base-path ".slab" % ".bm") (range d/NUM_SLAB_CLASSES))
             open-result
             (mapv (fn [i]
                     (let [peek-r     (mem/open-mmap-region (nth slab-paths i) 64)
                           total      (mem/-load-i32 peek-r d/SLAB_HDR_TOTAL_BLOCKS)
                           bs         (nth d/SLAB_SIZES i)
                           data-bytes (+ d/SLAB_HEADER_SIZE (* total bs))
                           bm-bytes   (d/bitmap-byte-size total)]
                       {:region    (mem/open-mmap-region (nth slab-paths i) data-bytes)
                        :bm-region (mem/open-mmap-region (nth bm-paths i) bm-bytes)}))
                   (range d/NUM_SLAB_CLASSES))
             regions    (mapv :region open-result)
             bm-regions (mapv :bm-region open-result)
             ;; Class 6: coalescing overflow — peek header, open at current size
             coalesc-peek (mem/open-mmap-region (str base-path ".slab6") 64)
             coalesc-data-off (mem/-load-i32 coalesc-peek d/SLAB_HDR_DATA_OFFSET)
             coalesc-cur-sz   (mem/-load-i64 coalesc-peek coalesc/COALESC_HDR_DATA_SIZE)
             coalesc-r    (mem/open-mmap-region (str base-path ".slab6")
                            (+ coalesc-data-off coalesc-cur-sz))
             regions-7    (conj regions coalesc-r)
             bm-regions-7 (conj bm-regions nil)
             paths-7      (conj slab-paths (str base-path ".slab6"))
             bm-paths-7   (conj bm-paths nil)
             sio      (alloc/make-jvm-slab-ctx regions-7 bm-regions-7
                                                paths-7 bm-paths-7 nil)
             root-r   (mem/open-mmap-region (str base-path ".root") ROOT_BYTES)
             rmap-r   (mem/open-mmap-region (str base-path ".rmap") READER_MAP_BYTES)
             slot-idx (mmap-claim-slot! root-r)]
         (write-heartbeat! root-r slot-idx)
         (let [sched (doto (java.util.concurrent.Executors/newSingleThreadScheduledExecutor
                             (reify java.util.concurrent.ThreadFactory
                               (newThread [_ r]
                                 (doto (Thread. r)
                                   (.setDaemon true)
                                   (.setName "eve-heartbeat")))))
                        (.scheduleAtFixedRate
                          #(write-heartbeat! root-r slot-idx)
                          10 10 java.util.concurrent.TimeUnit/SECONDS))]
           {:root-r root-r :rmap-r rmap-r :sio sio :base-path base-path
            :slot-idx slot-idx :heartbeat-sched sched
            :retire-q (java.util.concurrent.ConcurrentLinkedQueue.)
            :tree-logs (java.util.concurrent.ConcurrentHashMap.)
            :flush-ts (volatile! 0)
            :thread-epochs (java.util.concurrent.ConcurrentHashMap.)
            :pin-lock (Object.)})))

     (defn- jvm-pin-thread-epoch!
       "Pin epoch for the current JVM thread. Multiple threads share one worker
        slot, so we track per-thread epochs and write the MIN to the shared slot.
        This prevents a later thread's pin from masking an earlier thread's epoch."
       [{:keys [root-r slot-idx
                ^java.util.concurrent.ConcurrentHashMap thread-epochs
                ^Object pin-lock]} epoch]
       (locking pin-lock
         (.put thread-epochs (.getId (Thread/currentThread)) (Long/valueOf (long epoch)))
         (let [min-e (reduce min epoch (.values thread-epochs))]
           (mmap-pin-epoch! root-r slot-idx (int min-e)))))

     (defn- jvm-unpin-thread-epoch!
       "Unpin epoch for the current JVM thread. Updates the shared slot to the
        MIN of remaining pinned threads, or clears it if no threads are pinned."
       [{:keys [root-r slot-idx
                ^java.util.concurrent.ConcurrentHashMap thread-epochs
                ^Object pin-lock]}]
       (locking pin-lock
         (.remove thread-epochs (.getId (Thread/currentThread)))
         (if (.isEmpty thread-epochs)
           (mmap-unpin-epoch! root-r slot-idx)
           (let [min-e (reduce min (.values thread-epochs))]
             (mmap-pin-epoch! root-r slot-idx (int min-e))))))

     (defn- jvm-coll-factory
       "Collection factory for deserializing nested collection values from slabs.
        Called by eve-bytes->value when it encounters SAB pointer tags (0x10–0x13).
        Maps return slab-backed EveHashMap; others materialize to plain types."
       [tag sio slab-offset]
       (case (int tag)
         0x10 (eve-map/jvm-eve-hash-map-from-offset sio slab-offset jvm-coll-factory)
         0x11 (into #{} (eve-set/jvm-eve-hash-set-from-offset sio slab-offset jvm-coll-factory))
         0x12 (into [] (eve-vec/jvm-sabvec-from-offset sio slab-offset jvm-coll-factory))
         0x13 (into '() (reverse (eve-list/jvm-sab-list-from-offset sio slab-offset)))
         (throw (ex-info "jvm-coll-factory: unknown tag" {:tag tag}))))

     (defn- jvm-read-root-value
       "Read the atom value from a root pointer. Caller must ensure epoch is pinned."
       [sio ptr]
       (when (not= ptr alloc/NIL_OFFSET)
         (let [type-id (alloc/jvm-read-header-type-byte sio ptr)
               cf      jvm-coll-factory]
           (case (int type-id)
             0xED (eve-map/jvm-eve-hash-map-from-offset sio ptr cf)
             0xEE (into #{} (eve-set/jvm-eve-hash-set-from-offset sio ptr cf))
             0x12 (into [] (eve-vec/jvm-sabvec-from-offset sio ptr cf))
             0x13 (into '() (reverse (eve-list/jvm-sab-list-from-offset sio ptr)))
             0x1D (alloc/jvm-read-eve-array sio ptr)
             0x1E (alloc/jvm-read-obj sio ptr)
             0x01 (alloc/jvm-read-scalar-block sio ptr)
             (throw (ex-info "jvm-mmap-deref: unknown root type-id"
                             {:type-id type-id :ptr ptr}))))))

     (defn- jvm-mmap-deref
       [{:keys [root-r sio] :as domain-state}]
       ;; Refresh slab regions in case another process grew them
       (alloc/refresh-jvm-slab-regions! sio)
       (let [epoch (mem/-load-i32 root-r d/ROOT_EPOCH_OFFSET)]
         (jvm-pin-thread-epoch! domain-state epoch)
         (try
           (jvm-read-root-value sio (mem/-load-i32 root-r d/ROOT_ATOM_PTR_OFFSET))
           (finally
             (jvm-unpin-thread-epoch! domain-state)))))

     (defn- jvm-try-flush-retires!
       "Free retired HAMT trees whose epoch is safe to reclaim.
        OBJ-1: Skip the 256-slot scan when the last scan was recent enough."
       [root-r ^java.util.Queue retire-q sio flush-ts]
       (let [now    (System/currentTimeMillis)
             last-t @flush-ts
             q-len  (.size retire-q)]
         (when (or (> (- now last-t) FLUSH_INTERVAL_MS)
                   (> q-len FLUSH_QUEUE_THRESHOLD))
           (vreset! flush-ts now)
           (let [safe-epoch (mmap-min-safe-epoch root-r)
                 entries    (java.util.ArrayList.)]
             (loop []
               (when-let [e (.poll retire-q)]
                 (.add entries e)
                 (recur)))
             (doseq [entry entries]
               (let [{:keys [offsets epoch]} entry]
                 (if (or (nil? safe-epoch) (< epoch safe-epoch))
                   (doseq [off offsets]
                     (when (not= off alloc/NIL_OFFSET)
                       (alloc/-sio-free! sio off)))
                   (.add retire-q entry))))))))

     (defn- jvm-resolve-new-ptr
       "Resolve the slab-qualified offset for a new atom root value (JVM).
        If new-val is already a slab-backed EveHashMap, returns its header-off
        directly (no re-serialization). Otherwise serializes to slab."
       [sio new-val]
       (let [encode (partial mem/value+sio->eve-bytes sio)]
         (cond
           (nil? new-val)     alloc/NIL_OFFSET
           (instance? EveHashMap new-val)
           (.-header-off ^EveHashMap new-val)
           (map? new-val)
           (if (and (contains? new-val :schema) (contains? new-val :values))
             (alloc/jvm-write-obj! sio (:schema new-val) (:values new-val))
             (eve-map/jvm-write-map! sio encode new-val))
           (set? new-val)     (eve-set/jvm-write-set! sio encode new-val)
           (vector? new-val)  (eve-vec/jvm-write-vec! sio encode new-val)
           (or (list? new-val)
               (seq? new-val)) (eve-list/jvm-write-list! sio encode new-val)
           (.isArray (class new-val))
           (alloc/jvm-write-eve-array! sio new-val)
           :else              (alloc/jvm-alloc-scalar-block! sio new-val))))

     (defn- jvm-collect-replaced-nodes
       "Walk old and new HAMT trees, collecting old node offsets that differ.
        Skips shared subtrees (same offset). For structural sharing after a
        single assoc, only O(log32 n) nodes differ."
       [sio old-off new-off]
       (let [nil-off (long alloc/NIL_OFFSET)
             result  (java.util.ArrayList.)]
         (letfn [(walk [^long o ^long n]
                   (when (and (not= o nil-off) (not= o n))
                     (.add result o)
                     (when (== (long (alloc/-sio-read-u8 sio o 0)) 1)
                       (let [o-nbm (unchecked-int (alloc/-sio-read-i32 sio o 8))
                             n-tp  (when (not= n nil-off)
                                     (long (alloc/-sio-read-u8 sio n 0)))
                             n-nbm (when (and n-tp (== (long n-tp) 1))
                                     (unchecked-int (alloc/-sio-read-i32 sio n 8)))]
                         (loop [rem o-nbm oi 0]
                           (when-not (zero? rem)
                             (let [bit (bit-and rem (- rem))
                                   oc  (long (alloc/-sio-read-i32 sio o (+ 12 (* oi 4))))
                                   nc  (if (and n-nbm
                                                (not (zero? (bit-and n-nbm bit))))
                                         (let [ni (Integer/bitCount
                                                    (unchecked-int
                                                      (bit-and (unchecked-int n-nbm)
                                                               (unchecked-int (dec bit)))))]
                                           (long (alloc/-sio-read-i32 sio n (+ 12 (* ni 4)))))
                                         nil-off)]
                               (walk oc nc)
                               (recur (bit-and rem (unchecked-int (dec rem)))
                                      (inc oi)))))))))]
           (walk old-off new-off))
         (vec result)))

     (defn- jvm-mmap-swap!
       "B2 CAS-loop swap (JVM). Epoch pinned for the ENTIRE iteration to
        protect lazy EveHashMap reads and jvm-collect-replaced-nodes."
       [{:keys [root-r sio retire-q tree-logs flush-ts] :as domain-state} f args]
       (loop [attempt 0]
         (when (>= attempt d/MAX_SWAP_RETRIES)
           (throw (ex-info "mmap-atom swap!: max retries exceeded" {:attempts attempt})))
         ;; Refresh slab regions in case another process grew them
         (alloc/refresh-jvm-slab-regions! sio)
         (jvm-pin-thread-epoch! domain-state (mem/-load-i32 root-r d/ROOT_EPOCH_OFFSET))
         (let [[tag result]
               (try
                 (let [old-ptr (mem/-load-i32 root-r d/ROOT_ATOM_PTR_OFFSET)
                       old-val (jvm-read-root-value sio old-ptr)
                       _       (alloc/start-jvm-alloc-log!)
                       new-val (apply f old-val args)
                       new-ptr (jvm-resolve-new-ptr sio new-val)
                       cur-log (alloc/drain-jvm-alloc-log!)
                       eve-passthru? (instance? EveHashMap new-val)
                       w       (mem/-cas-i32! root-r d/ROOT_ATOM_PTR_OFFSET old-ptr new-ptr)]
                   (if (== w old-ptr)
                     (let [new-epoch (mem/-add-i32! root-r d/ROOT_EPOCH_OFFSET 1)]
                       (when (not= old-ptr alloc/NIL_OFFSET)
                         (if (and eve-passthru? (instance? EveHashMap old-val))
                           (let [^EveHashMap old-em old-val
                                 ^EveHashMap new-em new-val
                                 replaced (jvm-collect-replaced-nodes
                                            sio (.-root-off old-em) (.-root-off new-em))
                                 offs (conj replaced old-ptr)]
                             (.add retire-q {:offsets offs :epoch (inc new-epoch)}))
                           (let [old-log (.remove ^java.util.concurrent.ConcurrentHashMap tree-logs
                                                  (Integer/valueOf (int old-ptr)))]
                             (.add retire-q {:offsets (or old-log [old-ptr])
                                             :epoch (inc new-epoch)}))))
                       (when (and (not eve-passthru?) cur-log (not= new-ptr alloc/NIL_OFFSET))
                         (.put ^java.util.concurrent.ConcurrentHashMap tree-logs
                               (Integer/valueOf (int new-ptr)) cur-log))
                       [:ok new-val])
                     ;; CAS failed — free ALL blocks allocated for the new tree
                     (do (when cur-log
                           (doseq [off cur-log]
                             (alloc/-sio-free! sio off)))
                         [:retry nil])))
                 (finally
                   (jvm-unpin-thread-epoch! domain-state)))]
           (case tag
             :ok    (do (jvm-try-flush-retires! root-r retire-q sio flush-ts) result)
             :retry (do (cas-backoff! attempt) (recur (inc attempt)))))))))

;; ---------------------------------------------------------------------------
;; MmapAtom — CLJS
;; ---------------------------------------------------------------------------

#?(:cljs
   (deftype MmapAtom [domain-state]
     IDeref
     (-deref [_] (cljs-mmap-deref domain-state))
     IAtom
     ISwap
     (-swap! [_ f]        (cljs-mmap-swap! domain-state f []))
     (-swap! [_ f a]      (cljs-mmap-swap! domain-state f [a]))
     (-swap! [_ f a b]    (cljs-mmap-swap! domain-state f [a b]))
     (-swap! [_ f a b xs] (cljs-mmap-swap! domain-state f (concat [a b] xs)))
     IReset
     (-reset! [this v] (-swap! this (constantly v)))))

;; ---------------------------------------------------------------------------
;; MmapAtom — JVM
;; ---------------------------------------------------------------------------

#?(:clj
   (deftype MmapAtom [domain-state]
     clojure.lang.IDeref
     (deref [_] (jvm-mmap-deref domain-state))
     clojure.lang.IAtom
     (swap [_ f]        (jvm-mmap-swap! domain-state f []))
     (swap [_ f a]      (jvm-mmap-swap! domain-state f [a]))
     (swap [_ f a b]    (jvm-mmap-swap! domain-state f [a b]))
     (swap [_ f a b xs] (jvm-mmap-swap! domain-state f (concat [a b] xs)))
     (reset [_ v]       (jvm-mmap-swap! domain-state (constantly v) []))))

;; ---------------------------------------------------------------------------
;; Public API
;; ---------------------------------------------------------------------------

(defn close!
  "Release the worker slot acquired when this atom was opened or joined.
   Cancels the heartbeat timer. Call when the process is done using the atom.
   Safe to call multiple times (idempotent via slot INACTIVE check)."
  [a]
  (let [{:keys [root-r slot-idx] :as ds} (.-domain-state a)]
    (when (and root-r slot-idx)
      #?(:cljs (when-let [tid (:timer-id ds)] (js/clearInterval tid))
         :clj  (when-let [sched (:heartbeat-sched ds)] (.shutdown sched)))
      (mmap-release-slot! root-r slot-idx))))

(defn persistent-atom
  "Create a new persistent atom at base-path backed by mmap slab files.
   Opens {base}.slab0–.slab5, {base}.root, {base}.rmap.
   Replaces module-level slab instances on CLJS (intra-process SAB atom
   is NOT simultaneously supported).
   Value must be a Clojure map or nil (Phase 5 limitation)."
  ([base-path] (persistent-atom base-path nil))
  ([base-path initial-val & {:keys [capacities]}]
   #?(:cljs
      (let [domain (cljs-open-mmap-domain! base-path :capacities (or capacities {}))
            a      (MmapAtom. domain)]
        (when (some? initial-val) (-swap! a (constantly initial-val)))
        a)
      :clj
      (let [domain (jvm-open-mmap-domain! base-path :capacities (or capacities {}))
            a      (MmapAtom. domain)]
        (when (some? initial-val) (jvm-mmap-swap! domain (constantly initial-val) []))
        a))))

(defn join-atom
  "Join an existing persistent atom at base-path.
   {base}.slab0–.slab5, {base}.root, {base}.rmap must already exist."
  [base-path]
  #?(:cljs (MmapAtom. (cljs-join-mmap-domain! base-path))
     :clj  (MmapAtom. (jvm-join-mmap-domain!  base-path))))
