(ns cljs-thread.eve.mem
  "IMemRegion — platform-neutral abstraction over a fixed-size region of
   shared memory that supports atomic int32 operations.

   EVE requires only three things from a shared-memory backing:

     1. Atomic int32 read / write / CAS / add / sub (for lock fields,
        epoch counters, reader-map counters, block-descriptor fields)
     2. Futex-like wait / notify on int32 slots (for sleep and coordination)
     3. Bulk non-atomic byte I/O (for reading and writing serialized values
        in the data region)

   This protocol captures exactly that contract. Higher-level EVE code
   (shared_atom, util, alloc …) works against IMemRegion and need not care
   about what backs it.

   Implementations:

     JsSabRegion     — wraps js/SharedArrayBuffer + js/Atomics
                       (browser; Node worker_threads intra-process)          [CLJS]
     NodeMmapRegion  — wraps a file-backed MAP_SHARED mmap via the
                       native addon in native/mmap_cas.cc
                       (Node cross-process IPC, e.g. Node ↔ JVM)            [CLJS]
     JvmMmapRegion   — wraps java.lang.foreign.MemorySegment (Panama FFM)
                       with Unsafe atomics (Java 21+)                        [CLJ]

   All byte-off arguments are BYTE offsets. Atomic ops require 4-byte
   alignment (enforced by the caller — util.cljs already does this via
   the (* field-idx 4) convention)."
  #?(:clj
     (:import
      [java.io RandomAccessFile]
      [java.lang.foreign Arena MemorySegment]
      [java.nio ByteBuffer ByteOrder]
      [java.nio.channels FileChannel FileChannel$MapMode]
      [java.nio.file OpenOption Paths StandardOpenOption]
      [java.util Date UUID])))

;; ---------------------------------------------------------------------------
;; Protocol
;; ---------------------------------------------------------------------------

(defprotocol IMemRegion
  "A fixed-size region of shared memory with atomic int32 primitives.
   All offsets are byte offsets; atomic ops require 4-byte alignment."

  ;; --- metadata ---
  (-byte-length [r]
    "Total size of the region in bytes.")

  ;; --- atomic int32 ops ---
  (-load-i32 [r byte-off]
    "Atomically load the i32 at byte-off (acquire semantics).
     Equivalent to Atomics.load on an Int32Array at (byte-off / 4).")

  (-store-i32! [r byte-off val]
    "Atomically store val at byte-off (release semantics).
     Equivalent to Atomics.store on an Int32Array at (byte-off / 4).")

  (-cas-i32! [r byte-off expected desired]
    "Atomic compare-and-exchange on the i32 at byte-off.
     Returns the *old* value — success iff (= returned expected).
     Equivalent to Atomics.compareExchange.")

  (-add-i32! [r byte-off delta]
    "Atomically add delta to the i32 at byte-off. Returns old value.")

  (-sub-i32! [r byte-off delta]
    "Atomically subtract delta from the i32 at byte-off. Returns old value.")

  (-exchange-i32! [r byte-off val]
    "Atomically store val at byte-off and return the old value.
     Equivalent to Atomics.exchange on an Int32Array at (byte-off / 4).")

  ;; --- atomic int64 ops ---
  ;; Required only for mmap regions (slab headers).  SAB regions may throw.
  ;; Values are JS Number (double), lossless up to 2^53 (9 PB).
  ;; On JVM, values are native longs (full 64-bit range).

  (-load-i64 [r byte-off]
    "Atomically load the i64 at byte-off (acquire semantics).
     Requires 8-byte alignment.")

  (-store-i64! [r byte-off val]
    "Atomically store val at byte-off (release semantics).
     Requires 8-byte alignment.")

  (-cas-i64! [r byte-off expected desired]
    "Atomic compare-and-exchange on the i64 at byte-off.
     Returns the *old* value — success iff (= returned expected).")

  (-add-i64! [r byte-off delta]
    "Atomically add delta to the i64 at byte-off. Returns old value.")

  (-sub-i64! [r byte-off delta]
    "Atomically subtract delta from the i64 at byte-off. Returns old value.")

  ;; --- futex-like wait / notify ---
  (-wait-i32! [r byte-off expected timeout-ms]
    "Block the calling thread until the i32 at byte-off differs from
     expected, or until timeout-ms milliseconds elapse.
     Returns :ok | :not-equal | :timed-out.
     May throw on the browser main thread (Atomics.wait is forbidden there).")

  (-notify-i32! [r byte-off n]
    "Wake up to n threads blocked in -wait-i32! on byte-off.
     Returns the number of threads actually woken.")

  (-supports-watch? [r]
    "Returns true if this region can back an Atomics.waitAsync watch loop.
     JsSabRegion returns true (SAB is a valid Atomics target).
     File-backed mmap regions (NodeMmapRegion, JvmMmapRegion) return false.")

  ;; --- non-atomic bulk byte I/O (data region reads / writes) ---
  (-read-bytes [r byte-off len]
    "Copy len bytes starting at byte-off into a new byte array.
     Non-atomic — callers are responsible for any needed synchronisation.")

  (-write-bytes! [r byte-off src]
    "Copy all bytes from src into the region at byte-off.
     Non-atomic — callers are responsible for any needed synchronisation."))

;; ---------------------------------------------------------------------------
;; CLJS implementations
;; ---------------------------------------------------------------------------

#?(:cljs
   (do
     ;; --- Helpers ---

     (defn- byte-off->i32-idx
       "Convert a 4-byte-aligned byte offset to the Int32Array element index."
       [byte-off]
       (unsigned-bit-shift-right byte-off 2))

     (defn- wait-result->kw
       "Coerce the string returned by Atomics.wait to a keyword."
       [s]
       (case s
         "ok"         :ok
         "not-equal"  :not-equal
         "timed-out"  :timed-out
         :timed-out))

     ;; --- JsSabRegion — SharedArrayBuffer + Atomics ---
     ;; This is the existing EVE backing for both browser and Node worker_threads.
     ;; worker_threads workers share SABs via postMessage / workerData; the Atomics
     ;; API provides the necessary synchronisation.

     (deftype JsSabRegion [^js sab
                           ^js -i32   ; cached Int32Array view — atomic ops
                           ^js -u8]   ; cached Uint8Array view  — byte I/O
       IMemRegion
       (-byte-length [_]
         (.-byteLength sab))

       (-load-i32 [_ byte-off]
         (js/Atomics.load -i32 (byte-off->i32-idx byte-off)))

       (-store-i32! [_ byte-off val]
         (js/Atomics.store -i32 (byte-off->i32-idx byte-off) val)
         nil)

       (-cas-i32! [_ byte-off expected desired]
         (js/Atomics.compareExchange -i32 (byte-off->i32-idx byte-off) expected desired))

       (-add-i32! [_ byte-off delta]
         (js/Atomics.add -i32 (byte-off->i32-idx byte-off) delta))

       (-sub-i32! [_ byte-off delta]
         (js/Atomics.sub -i32 (byte-off->i32-idx byte-off) delta))

       (-exchange-i32! [_ byte-off val]
         (js/Atomics.exchange -i32 (byte-off->i32-idx byte-off) val))

       (-load-i64 [_ _byte-off]
         (throw (ex-info "JsSabRegion does not support i64 ops" {})))
       (-store-i64! [_ _byte-off _val]
         (throw (ex-info "JsSabRegion does not support i64 ops" {})))
       (-cas-i64! [_ _byte-off _expected _desired]
         (throw (ex-info "JsSabRegion does not support i64 ops" {})))
       (-add-i64! [_ _byte-off _delta]
         (throw (ex-info "JsSabRegion does not support i64 ops" {})))
       (-sub-i64! [_ _byte-off _delta]
         (throw (ex-info "JsSabRegion does not support i64 ops" {})))

       (-wait-i32! [_ byte-off expected timeout-ms]
         (wait-result->kw
          (js/Atomics.wait -i32 (byte-off->i32-idx byte-off) expected timeout-ms)))

       (-notify-i32! [_ byte-off n]
         (js/Atomics.notify -i32 (byte-off->i32-idx byte-off) n))

       (-supports-watch? [_] true)

       (-read-bytes [_ byte-off len]
         (.slice -u8 byte-off (+ byte-off len)))

       (-write-bytes! [_ byte-off src]
         (.set -u8 src byte-off)
         nil))

     (defn js-sab-region
       "Wrap an existing js/SharedArrayBuffer in a JsSabRegion."
       [^js sab]
       (JsSabRegion. sab (js/Int32Array. sab) (js/Uint8Array. sab)))

     (defn make-js-sab-region
       "Allocate a fresh js/SharedArrayBuffer of byte-length bytes and wrap it."
       [byte-length]
       (js-sab-region (js/SharedArrayBuffer. byte-length)))

     ;; --- NodeMmapRegion — file-backed MAP_SHARED mmap (cross-process) ---
     ;; Used when EVE needs to share memory with a process that cannot receive a
     ;; SharedArrayBuffer via postMessage — e.g. a JVM process, or a separate
     ;; Node process not related by worker_threads.
     ;;
     ;; The backing is a native Node addon (native/mmap_cas.cc) that:
     ;;   • opens / creates a file, ftruncates to size, and calls mmap(MAP_SHARED)
     ;;   • returns the mapping as a Node.js Buffer (zero-copy, same virtual page)
     ;;   • provides atomic int32 ops via std::atomic_ref<int32_t> (C++20 stdlib)
     ;;   • provides futex wait/notify via Linux futex(2) syscall directly
     ;;
     ;; The Buffer's underlying memory IS the mmap'd page — reads and writes to the
     ;; Buffer are immediately visible to any other process (or JVM thread) that has
     ;; the same file mapped.

     ;; Lazy reference to the native addon — set by load-native-addon!
     (defonce ^:private native-addon (atom nil))

     (defn load-native-addon!
       "Load the mmap_cas native addon from addon-path (a .node file built by
        node-gyp from native/mmap_cas.cc).  Must be called once before any
        NodeMmapRegion is constructed.

        Example:
          (mem/load-native-addon! (js/require \"./build/Release/mmap_cas.node\"))"
       [addon-js-obj]
       (reset! native-addon addon-js-obj))

     (defn native-addon-loaded?
       "Returns true if the mmap_cas native addon has been loaded."
       []
       (some? @native-addon))

     (defn- native
       "Return the loaded native addon, throwing if not yet loaded."
       []
       (or @native-addon
           (throw (ex-info "mmap_cas native addon not loaded — call load-native-addon! first" {}))))

     (deftype NodeMmapRegion [^js buf   ; Node.js Buffer from addon open()
                              size]     ; byte length
       IMemRegion
       (-byte-length [_]
         size)

       (-load-i32 [_ byte-off]
         (.load32 (native) buf byte-off))

       (-store-i32! [_ byte-off val]
         (.store32 (native) buf byte-off val)
         nil)

       (-cas-i32! [_ byte-off expected desired]
         ;; Native cas32 returns the *old* value — same contract as Atomics.compareExchange
         (.cas32 (native) buf byte-off expected desired))

       (-add-i32! [_ byte-off delta]
         (.add32 (native) buf byte-off delta))

       (-sub-i32! [_ byte-off delta]
         (.sub32 (native) buf byte-off delta))

       (-exchange-i32! [_ byte-off val]
         ;; Simulate exchange via CAS loop (native addon may not expose exchange32).
         (loop []
           (let [old (.load32 (native) buf byte-off)]
             (if (== old (.cas32 (native) buf byte-off old val))
               old
               (recur)))))

       (-load-i64 [_ byte-off]
         (.load64 (native) buf byte-off))

       (-store-i64! [_ byte-off val]
         (.store64 (native) buf byte-off val)
         nil)

       (-cas-i64! [_ byte-off expected desired]
         (.cas64 (native) buf byte-off expected desired))

       (-add-i64! [_ byte-off delta]
         (.add64 (native) buf byte-off delta))

       (-sub-i64! [_ byte-off delta]
         (.sub64 (native) buf byte-off delta))

       (-wait-i32! [_ byte-off expected timeout-ms]
         ;; Native wait32 returns "ok" | "not-equal" | "timed-out"
         (wait-result->kw (.wait32 (native) buf byte-off expected timeout-ms)))

       (-notify-i32! [_ byte-off n]
         (.notify32 (native) buf byte-off n))

       (-supports-watch? [_] false)

       (-read-bytes [_ byte-off len]
         ;; Buffer.slice returns a view sharing the same ArrayBuffer.
         ;; Preserve byteOffset so deserialize-element reads from the correct position.
         (let [sliced (.slice buf byte-off (+ byte-off len))]
           (js/Uint8Array. (.-buffer sliced) (.-byteOffset sliced) (.-byteLength sliced))))

       (-write-bytes! [_ byte-off src]
         ;; src is a Uint8Array; copy into the Buffer via Node's Buffer.from +
         ;; Buffer.copy for zero-extra-copy semantics
         (let [src-buf (js/Buffer.from (.-buffer src) (.-byteOffset src) (.-byteLength src))]
           (.copy src-buf buf byte-off))
         nil))

     (defn open-mmap-region
       "Open (or create) a file-backed shared memory region at path.
        If the file is new it is truncated to size-bytes.
        Returns a NodeMmapRegion whose backing is the mmap'd page.

        Example:
          (mem/open-mmap-region \"/tmp/eve-shard-0.mem\" (* 64 1024 1024))"
       [path size-bytes]
       (let [buf (.open (native) path size-bytes)]
         (NodeMmapRegion. buf size-bytes)))))

;; ---------------------------------------------------------------------------
;; JVM implementations
;; ---------------------------------------------------------------------------

#?(:clj
   (do
     ;; sun.misc.Unsafe for atomic int32 ops over native memory.
     ;; Works on Java 21 (preview FFM) and Java 22+ (final FFM).
     ;; VarHandle.getVolatile/setVolatile are @PolymorphicSignature and cannot be
     ;; called via Clojure reflection; Unsafe provides the same atomics portably.
     (def ^:private ^sun.misc.Unsafe UNSAFE
       (let [f (.getDeclaredField sun.misc.Unsafe "theUnsafe")]
         (.setAccessible f true)
         (.get f nil)))

     ;; JvmMmapRegion stores the MemorySegment (for bulk copy) and its base native
     ;; address (for Unsafe ops, avoiding a .address() call on every atomic op).
     (deftype JvmMmapRegion [^MemorySegment seg ^long base-addr ^long size]
       IMemRegion

       (-byte-length [_] size)

       (-load-i32 [_ byte-off]
         ;; getIntVolatile provides acquire semantics
         (.getIntVolatile UNSAFE nil (+ base-addr (long byte-off))))

       (-store-i32! [_ byte-off val]
         ;; putIntVolatile provides release semantics
         (.putIntVolatile UNSAFE nil (+ base-addr (long byte-off)) (unchecked-int val))
         nil)

       (-cas-i32! [_ byte-off expected desired]
         ;; Simulate compareAndExchange (returns witness/old value).
         ;; sun.misc.Unsafe only has compareAndSwapInt (returns bool), so:
         ;; success → return expected; failure → read current value as witness.
         (let [addr (+ base-addr (long byte-off))
               exp  (unchecked-int expected)]
           (if (.compareAndSwapInt UNSAFE nil addr exp (unchecked-int desired))
             exp
             (.getIntVolatile UNSAFE nil addr))))

       (-add-i32! [_ byte-off delta]
         ;; getAndAddInt returns the value BEFORE the add
         (.getAndAddInt UNSAFE nil (+ base-addr (long byte-off)) (unchecked-int delta)))

       (-sub-i32! [_ byte-off delta]
         (.getAndAddInt UNSAFE nil (+ base-addr (long byte-off)) (unchecked-int (- delta))))

       (-exchange-i32! [_ byte-off val]
         ;; getAndSetInt provides atomic exchange semantics
         (.getAndSetInt UNSAFE nil (+ base-addr (long byte-off)) (unchecked-int val)))

       (-load-i64 [_ byte-off]
         (.getLongVolatile UNSAFE nil (+ base-addr (long byte-off))))

       (-store-i64! [_ byte-off val]
         (.putLongVolatile UNSAFE nil (+ base-addr (long byte-off)) (long val))
         nil)

       (-cas-i64! [_ byte-off expected desired]
         (let [addr (+ base-addr (long byte-off))
               exp  (long expected)]
           (if (.compareAndSwapLong UNSAFE nil addr exp (long desired))
             exp
             (.getLongVolatile UNSAFE nil addr))))

       (-add-i64! [_ byte-off delta]
         (.getAndAddLong UNSAFE nil (+ base-addr (long byte-off)) (long delta)))

       (-sub-i64! [_ byte-off delta]
         (.getAndAddLong UNSAFE nil (+ base-addr (long byte-off)) (long (- delta))))

       (-wait-i32! [_ byte-off expected timeout-ms]
         ;; Polling fallback — no JNI futex yet.
         (let [addr     (+ base-addr (long byte-off))
               deadline (+ (System/currentTimeMillis) (long timeout-ms))]
           (loop []
             (let [cur (.getIntVolatile UNSAFE nil addr)]
               (cond
                 (not= cur (int expected))                  :not-equal
                 (>= (System/currentTimeMillis) deadline)   :timed-out
                 :else (do (Thread/sleep 0 100000)           ; 100 µs park
                           (recur)))))))

       (-notify-i32! [_ _byte-off _n]
         ;; No-op on JVM polling path — threads self-wake via the loop above.
         0)

       (-supports-watch? [_]
         ;; JVM regions cannot be passed to Atomics.waitAsync.
         false)

       (-read-bytes [_ byte-off len]
         ;; Zero-copy slice of the mapped segment into a fresh byte[].
         (let [dst (byte-array len)]
           (MemorySegment/copy seg (long byte-off) (MemorySegment/ofArray dst) 0 (long len))
           dst))

       (-write-bytes! [_ byte-off src]
         ;; Write directly into the mapped page — immediately visible to other
         ;; processes sharing the same MAP_SHARED file.
         (MemorySegment/copy (MemorySegment/ofArray src) 0 seg (long byte-off) (long (alength src)))
         nil))

     (defn open-mmap-region
       "Open (or create) a file-backed shared memory region at path-str.
        If the file does not exist it is created.  If the file is smaller than
        size-bytes it is grown via RandomAccessFile.setLength.
        Returns a JvmMmapRegion backed by a MAP_SHARED mapping.

        Works on Java 21+ (Panama FFM). Uses FileChannel.map (Java 21) rather than
        MemorySegment.map (Java 22 only). Atomic ops via sun.misc.Unsafe.

        Example:
          (mem/open-mmap-region \"/tmp/eve.main\" (* 256 1024 1024))"
       [path-str size-bytes]
       (let [size  (long size-bytes)
             ;; Ensure the file exists and is at least size-bytes long.
             ;; Only grow the file — never truncate an existing larger file
             ;; (e.g. a 1 MB domain file peeked at 4096 bytes must not be truncated).
             _     (let [^RandomAccessFile raf (RandomAccessFile. ^String path-str "rw")]
                     (try (when (< (.length raf) size) (.setLength raf size))
                          (finally (.close raf))))
             ;; Map the file using FileChannel.map (available Java 21+).
             ;; MemorySegment.map was added in Java 22 and is NOT available in Java 21.
             path  (Paths/get ^String path-str (into-array String []))
             arena (Arena/ofShared)
             seg   (with-open [^FileChannel fc
                               (FileChannel/open path
                                 (into-array OpenOption
                                   [StandardOpenOption/READ
                                    StandardOpenOption/WRITE]))]
                     (.map fc FileChannel$MapMode/READ_WRITE 0 size arena))]
         (JvmMmapRegion. seg (.address seg) size)))

     ;; -----------------------------------------------------------------------
     ;; JvmHeapRegion — heap byte[] backed by Unsafe atomics
     ;; -----------------------------------------------------------------------
     ;; Same atomic guarantees as JvmMmapRegion but backed by a Java byte array
     ;; rather than a file-backed mmap.  Used for non-persistent (in-process)
     ;; EVE atom domains where cross-process visibility is not required.
     ;;
     ;; Unsafe.arrayBaseOffset(byte[]) gives the JVM heap base address of the
     ;; array; getIntVolatile/putIntVolatile/compareAndSwapInt then work on-heap
     ;; with full acquire/release/sequentially-consistent semantics.

     ;; Unsafe requires the array object as `Object` for heap atomics.
     ;; We store it untyped in the deftype field so Clojure does not try to
     ;; find a non-existent Unsafe.getIntVolatile(byte[], long) overload.
     (def ^:private BYTE_ARRAY_BASE_OFFSET
       ;; arrayBaseOffset returns int; widen to long for arithmetic
       (long (.arrayBaseOffset UNSAFE (Class/forName "[B"))))

     (deftype JvmHeapRegion [backing ^long size]
       ;; backing is a byte[] but untyped here — Clojure must see it as Object
       ;; so it resolves Unsafe methods against the (Object, long) signatures.
       IMemRegion

       (-byte-length [_] size)

       (-load-i32 [_ byte-off]
         (.getIntVolatile UNSAFE backing
           (+ BYTE_ARRAY_BASE_OFFSET (long byte-off))))

       (-store-i32! [_ byte-off val]
         (.putIntVolatile UNSAFE backing
           (+ BYTE_ARRAY_BASE_OFFSET (long byte-off)) (unchecked-int val))
         nil)

       (-cas-i32! [_ byte-off expected desired]
         (let [addr (+ BYTE_ARRAY_BASE_OFFSET (long byte-off))
               exp  (unchecked-int expected)]
           (if (.compareAndSwapInt UNSAFE backing addr exp (unchecked-int desired))
             exp
             (.getIntVolatile UNSAFE backing addr))))

       (-add-i32! [_ byte-off delta]
         (.getAndAddInt UNSAFE backing
           (+ BYTE_ARRAY_BASE_OFFSET (long byte-off)) (unchecked-int delta)))

       (-sub-i32! [_ byte-off delta]
         (.getAndAddInt UNSAFE backing
           (+ BYTE_ARRAY_BASE_OFFSET (long byte-off)) (unchecked-int (- delta))))

       (-exchange-i32! [_ byte-off val]
         (.getAndSetInt UNSAFE backing
           (+ BYTE_ARRAY_BASE_OFFSET (long byte-off)) (unchecked-int val)))

       (-load-i64 [_ byte-off]
         (.getLongVolatile UNSAFE backing
           (+ BYTE_ARRAY_BASE_OFFSET (long byte-off))))

       (-store-i64! [_ byte-off val]
         (.putLongVolatile UNSAFE backing
           (+ BYTE_ARRAY_BASE_OFFSET (long byte-off)) (long val))
         nil)

       (-cas-i64! [_ byte-off expected desired]
         (let [addr (+ BYTE_ARRAY_BASE_OFFSET (long byte-off))
               exp  (long expected)]
           (if (.compareAndSwapLong UNSAFE backing addr exp (long desired))
             exp
             (.getLongVolatile UNSAFE backing addr))))

       (-add-i64! [_ byte-off delta]
         (.getAndAddLong UNSAFE backing
           (+ BYTE_ARRAY_BASE_OFFSET (long byte-off)) (long delta)))

       (-sub-i64! [_ byte-off delta]
         (.getAndAddLong UNSAFE backing
           (+ BYTE_ARRAY_BASE_OFFSET (long byte-off)) (long (- delta))))

       (-wait-i32! [_ byte-off expected timeout-ms]
         (let [addr     (+ BYTE_ARRAY_BASE_OFFSET (long byte-off))
               deadline (+ (System/currentTimeMillis) (long timeout-ms))]
           (loop []
             (let [cur (.getIntVolatile UNSAFE backing addr)]
               (cond
                 (not= cur (int expected))                  :not-equal
                 (>= (System/currentTimeMillis) deadline)   :timed-out
                 :else (do (Thread/sleep 0 100000)
                           (recur)))))))

       (-notify-i32! [_ _byte-off _n] 0)

       (-supports-watch? [_] false)

       (-read-bytes [_ byte-off len]
         ;; Cast back to byte[] for Arrays.copyOfRange
         (let [ba ^bytes backing]
           (java.util.Arrays/copyOfRange ba (int byte-off) (int (+ byte-off len)))))

       (-write-bytes! [_ byte-off src]
         ;; Cast back to byte[] for System.arraycopy destination
         (let [ba ^bytes backing]
           (System/arraycopy src 0 ba (int byte-off) (alength ^bytes src)))
         nil))

     (defn make-heap-region
       "Create an IMemRegion backed by a zero-initialized heap byte array.
        Thread-safe: all i32 ops use sun.misc.Unsafe with volatile/atomic
        semantics.  Unlike JvmMmapRegion, this is not file-backed — data lives
        only in the JVM heap and is not visible to other processes."
       [size-bytes]
       (JvmHeapRegion. (byte-array (int size-bytes)) (long size-bytes)))))

;; ---------------------------------------------------------------------------
;; Dispatch wrappers — work against IMemRegion on both platforms
;; ---------------------------------------------------------------------------

(defn load-i32       [r byte-off]           (-load-i32       r byte-off))
(defn store-i32!     [r byte-off val]       (-store-i32!     r byte-off val))
(defn cas-i32!       [r byte-off exp des]   (-cas-i32!       r byte-off exp des))
(defn add-i32!       [r byte-off delta]     (-add-i32!       r byte-off delta))
(defn sub-i32!       [r byte-off delta]     (-sub-i32!       r byte-off delta))
(defn exchange-i32!  [r byte-off val]       (-exchange-i32!  r byte-off val))
(defn load-i64       [r byte-off]           (-load-i64       r byte-off))
(defn store-i64!     [r byte-off val]       (-store-i64!     r byte-off val))
(defn cas-i64!       [r byte-off exp des]   (-cas-i64!       r byte-off exp des))
(defn add-i64!       [r byte-off delta]     (-add-i64!       r byte-off delta))
(defn sub-i64!       [r byte-off delta]     (-sub-i64!       r byte-off delta))
(defn wait-i32!      [r byte-off exp t]     (-wait-i32!      r byte-off exp t))
(defn notify-i32!    [r byte-off n]         (-notify-i32!    r byte-off n))
(defn supports-watch? [r]                   (-supports-watch? r))
(defn read-bytes     [r byte-off len]       (-read-bytes     r byte-off len))
(defn write-bytes!   [r byte-off src]       (-write-bytes!   r byte-off src))

;; ---------------------------------------------------------------------------
;; Portable IMemRegion Bitmap Operations — shared CLJ + CLJS
;; ---------------------------------------------------------------------------
;; These work with any IMemRegion (SAB-backed, mmap, JVM mmap).
;; They use only atomic int32 load/CAS which every IMemRegion must implement.
;; CLJS uses these as the JS fallback when WASM is not available.
;; JVM uses these for all slab bitmap management.

(defn imr-bitmap-find-free
  "Scan bitmap for the first free bit (0-bit) starting from start-bit.
   bm-byte-offset is the byte offset of the bitmap within the IMemRegion.
   Returns the block index (absolute bit position), or -1 if bitmap is full."
  [region bm-byte-offset total-bits start-bit]
  (let [word-count (unsigned-bit-shift-right (+ total-bits 31) 5)]
    (loop [word-idx    (unsigned-bit-shift-right start-bit 5)
           bit-in-word (bit-and start-bit 31)]
      (if (>= word-idx word-count)
        -1
        (let [word     (-load-i32 region (+ bm-byte-offset (* word-idx 4)))
              inverted (bit-xor word -1)
              masked   (if (pos? bit-in-word)
                         (bit-and inverted (bit-shift-left -1 bit-in-word))
                         inverted)]
          (if (not (zero? masked))
            (let [bit-pos (loop [b 0]
                            (if (>= b 32) 32
                              (if (not (zero? (bit-and masked (bit-shift-left 1 b))))
                                b
                                (recur (inc b)))))
                  abs-bit (+ (bit-shift-left word-idx 5) bit-pos)]
              (if (< abs-bit total-bits)
                abs-bit
                -1))
            (recur (inc word-idx) 0)))))))

(defn imr-bitmap-alloc-cas!
  "Atomically set bit-idx in the bitmap from 0→1 (mark block allocated).
   Returns true on success, false if bit was already set (lost CAS race)."
  [region bm-byte-offset bit-idx]
  (let [word-byte-off (+ bm-byte-offset (* (unsigned-bit-shift-right bit-idx 5) 4))
        bit-mask      (bit-shift-left 1 (bit-and bit-idx 31))]
    (loop []
      (let [old-word (-load-i32 region word-byte-off)]
        (if (not (zero? (bit-and old-word bit-mask)))
          false
          (let [new-word (bit-or old-word bit-mask)]
            (if (== old-word (-cas-i32! region word-byte-off old-word new-word))
              true
              (recur))))))))

(defn imr-bitmap-free!
  "Atomically clear bit-idx in the bitmap from 1→0 (mark block free).
   Returns true if bit was set (valid free), false if already clear (double-free)."
  [region bm-byte-offset bit-idx]
  (let [word-byte-off (+ bm-byte-offset (* (unsigned-bit-shift-right bit-idx 5) 4))
        bit-pos       (bit-and bit-idx 31)
        clear-mask    (bit-xor (bit-shift-left 1 bit-pos) -1)
        old-word      (loop []
                        (let [cur     (-load-i32 region word-byte-off)
                              new-val (bit-and cur clear-mask)]
                          (if (== cur (-cas-i32! region word-byte-off cur new-val))
                            cur
                            (recur))))]
    (not (zero? (bit-and (unsigned-bit-shift-right old-word bit-pos) 1)))))

;; ---------------------------------------------------------------------------
;; JVM domain API (CLJ only) — see also Step 11 for slab extension
;; ---------------------------------------------------------------------------

#?(:clj
   (do

     ;; EVE binary format — magic prefix bytes written into serialized byte arrays.
     (def ^:private ^:const MAGIC-0 (unchecked-byte 0xEE))
     (def ^:private ^:const MAGIC-1 (unchecked-byte 0xDB))
     ;; Byte-typed write-side constants for value->eve-bytes
     (def ^:private ^:const TAG-FALSE          (unchecked-byte 0x01))
     (def ^:private ^:const TAG-TRUE           (unchecked-byte 0x02))
     (def ^:private ^:const TAG-INT32          (unchecked-byte 0x03))
     (def ^:private ^:const TAG-FLOAT64        (unchecked-byte 0x04))
     (def ^:private ^:const TAG-STRING-SHORT   (unchecked-byte 0x05))
     (def ^:private ^:const TAG-STRING-LONG    (unchecked-byte 0x06))
     (def ^:private ^:const TAG-KEYWORD-SHORT  (unchecked-byte 0x07))
     (def ^:private ^:const TAG-KEYWORD-LONG   (unchecked-byte 0x08))
     (def ^:private ^:const TAG-KW-NS-SHORT    (unchecked-byte 0x09))
     (def ^:private ^:const TAG-KW-NS-LONG     (unchecked-byte 0x0A))
     (def ^:private ^:const TAG-UUID           (unchecked-byte 0x0B))
     (def ^:private ^:const TAG-SYMBOL-SHORT   (unchecked-byte 0x0C))
     (def ^:private ^:const TAG-SYM-NS-SHORT   (unchecked-byte 0x0D))
     (def ^:private ^:const TAG-DATE           (unchecked-byte 0x0E))
     (def ^:private ^:const TAG-INT64          (unchecked-byte 0x0F))
     ;; Flat collection tags — cross-process binary encoding (no SAB pointers)
     (def ^:private ^:const TAG-FLAT-MAP       (unchecked-byte 0xED))
     (def ^:private ^:const TAG-FLAT-SET       (unchecked-byte 0xEE))
     (def ^:private ^:const TAG-FLAT-VEC       (unchecked-byte 0xEF))


     ;; --- OBJ-7: Keyword serialization caches ---
     ;; ConcurrentHashMap caches for keyword↔bytes, mirroring CLJS kw-ser-cache.
     ;; Evicts when size exceeds 4096 to bound memory.

     (def ^:private ^java.util.concurrent.ConcurrentHashMap kw-encode-cache
       (java.util.concurrent.ConcurrentHashMap. 256))

     (def ^:private ^java.util.concurrent.ConcurrentHashMap kw-decode-cache
       (java.util.concurrent.ConcurrentHashMap. 256))

     (def ^:private ^:const KW_CACHE_MAX 4096)

     ;; --- EVE binary format — ByteBuffer helpers ---

     (defn- le-bb
       "Wrap a byte[] in a little-endian ByteBuffer."
       ^ByteBuffer [^bytes b]
       (-> (ByteBuffer/wrap b) (.order ByteOrder/LITTLE_ENDIAN)))

     (defn- read-u8 ^long [^bytes b ^long i]
       (bit-and (aget b i) 0xFF))

     (defn- read-u32-le ^long [^bytes b ^long i]
       (Integer/toUnsignedLong (.getInt (le-bb b) (int i))))

     (defn- read-i32-le ^long [^bytes b ^long i]
       (.getInt (le-bb b) (int i)))

     (defn- read-i64-le ^long [^bytes b ^long i]
       (.getLong (le-bb b) (int i)))

     (defn- read-f64-le ^double [^bytes b ^long i]
       (.getDouble (le-bb b) (int i)))

     (defn- read-utf8 ^String [^bytes b ^long off ^long len]
       (String. b (int off) (int len) "UTF-8"))

     ;; --- EVE binary format — deserializer ---

     (defn eve-bytes->value
       "Decode an EVE-format byte array into a Clojure value.

        1-arity [b]: primitives only.
          Handles: nil (0-byte array), boolean, long (int32/int64), double (float64),
          String, Keyword, Symbol, java.util.Date, java.util.UUID.
          Throws UnsupportedOperationException for SAB pointer tags (0x10–0x13).

        3-arity [b sio coll-factory]: also handles collection types.
          sio          — ISlabIO context (e.g. JvmSlabCtx from alloc/make-jvm-slab-ctx)
          coll-factory — (fn [tag sio slab-offset] → collection)
                          tag 0x10 → EveHashMap, 0x11 → EveHashSet,
                          0x12 → SabVec,        0x13 → SabList"
       ([^bytes b] (eve-bytes->value b nil nil))
       ([^bytes b sio coll-factory]
        (let [len (alength b)]
          (cond
            (zero? len)
            nil

            (< len 3)
            (throw (ex-info "EVE bytes truncated" {:len len}))

            :else
            (let [tag (bit-and (aget b 2) 0xFF)]
              (condp = tag
               0x01 false   ; TAG-FALSE
               0x02 true    ; TAG-TRUE
               0x03 (read-i32-le b 3)   ; TAG-INT32
               0x0F (read-i64-le b 3)   ; TAG-INT64
               0x04 (read-f64-le b 3)   ; TAG-FLOAT64
               0x0E (Date. (long (read-f64-le b 3)))  ; TAG-DATE

               0x05  ; TAG-STRING-SHORT
               (read-utf8 b 4 (read-u8 b 3))

               0x06  ; TAG-STRING-LONG
               (read-utf8 b 7 (read-u32-le b 3))

               0x07  ; TAG-KEYWORD-SHORT
               (keyword (read-utf8 b 4 (read-u8 b 3)))

               0x08  ; TAG-KEYWORD-LONG
               (keyword (read-utf8 b 7 (read-u32-le b 3)))

               0x09  ; TAG-KW-NS-SHORT
               (let [ns-len  (read-u8 b 3)
                     ns-str  (read-utf8 b 4 ns-len)
                     name-off (+ 4 ns-len)
                     name-len (read-u8 b name-off)
                     name-str (read-utf8 b (+ name-off 1) name-len)]
                 (keyword ns-str name-str))

               0x0A  ; TAG-KW-NS-LONG
               (let [ns-len  (read-u32-le b 3)
                     ns-str  (read-utf8 b 7 ns-len)
                     name-off (+ 7 ns-len)
                     name-len (read-u32-le b name-off)
                     name-str (read-utf8 b (+ name-off 4) name-len)]
                 (keyword ns-str name-str))

               0x0C  ; TAG-SYMBOL-SHORT
               (symbol (read-utf8 b 4 (read-u8 b 3)))

               0x0D  ; TAG-SYM-NS-SHORT
               (let [ns-len  (read-u8 b 3)
                     ns-str  (read-utf8 b 4 ns-len)
                     name-off (+ 4 ns-len)
                     name-len (read-u8 b name-off)
                     name-str (read-utf8 b (+ name-off 1) name-len)]
                 (symbol ns-str name-str))

               0x0B  ; TAG-UUID — 16 raw bytes in big-endian order
               (let [bb (ByteBuffer/wrap b 3 16)
                     msb (.getLong bb)
                     lsb (.getLong bb)]
                 (UUID. msb lsb))

               ;; SAB pointer types — collection values in slab memory
               0x10 (if (and sio coll-factory)
                      (coll-factory 0x10 sio (read-i32-le b 3))
                      (throw (UnsupportedOperationException. "EVE SAB_MAP: pass sio+coll-factory to eve-bytes->value.")))
               0x11 (if (and sio coll-factory)
                      (coll-factory 0x11 sio (read-i32-le b 3))
                      (throw (UnsupportedOperationException. "EVE SAB_SET: pass sio+coll-factory to eve-bytes->value.")))
               0x12 (if (and sio coll-factory)
                      (coll-factory 0x12 sio (read-i32-le b 3))
                      (throw (UnsupportedOperationException. "EVE SAB_VEC: pass sio+coll-factory to eve-bytes->value.")))
               0x13 (if (and sio coll-factory)
                      (coll-factory 0x13 sio (read-i32-le b 3))
                      (throw (UnsupportedOperationException. "EVE SAB_LIST: pass sio+coll-factory to eve-bytes->value.")))
               0x1D (if (and sio coll-factory)
                      (coll-factory 0x1D sio (read-i32-le b 3))
                      (throw (UnsupportedOperationException. "EVE ARRAY: pass sio+coll-factory to eve-bytes->value.")))
               0x1E (if (and sio coll-factory)
                      (coll-factory 0x1E sio (read-i32-le b 3))
                      (throw (UnsupportedOperationException. "EVE OBJ: pass sio+coll-factory to eve-bytes->value.")))

               ;; Flat map — cross-process binary map encoding
               0xED
               (let [cnt (read-i32-le b 3)]
                 (loop [pos 7 i 0 m (transient {})]
                   (if (>= i cnt)
                     (persistent! m)
                     (let [klen (read-i32-le b pos)
                           k    (eve-bytes->value (java.util.Arrays/copyOfRange b (int (+ pos 4)) (int (+ pos 4 klen))))
                           voff (+ pos 4 klen)
                           vlen (read-i32-le b voff)
                           v    (eve-bytes->value (java.util.Arrays/copyOfRange b (int (+ voff 4)) (int (+ voff 4 vlen))))]
                       (recur (+ voff 4 vlen) (inc i) (assoc! m k v))))))

               ;; Flat set — cross-process binary set encoding
               0xEE
               (let [cnt (read-i32-le b 3)]
                 (loop [pos 7 i 0 s (transient #{})]
                   (if (>= i cnt)
                     (persistent! s)
                     (let [elen (read-i32-le b pos)
                           elem (eve-bytes->value (java.util.Arrays/copyOfRange b (int (+ pos 4)) (int (+ pos 4 elen))))]
                       (recur (+ pos 4 elen) (inc i) (conj! s elem))))))

               ;; Flat vec — cross-process binary vector encoding
               0xEF
               (let [cnt (read-i32-le b 3)]
                 (loop [pos 7 i 0 v (transient [])]
                   (if (>= i cnt)
                     (persistent! v)
                     (let [elen (read-i32-le b pos)
                           elem (eve-bytes->value (java.util.Arrays/copyOfRange b (int (+ pos 4)) (int (+ pos 4 elen))))]
                       (recur (+ pos 4 elen) (inc i) (conj! v elem))))))

               (throw (ex-info "Unknown EVE type tag" {:tag tag}))))))))

     ;; --- EVE binary format — serializer (primitive types only) ---

     (defn- bytes-header-tag
       "Create a 3-byte prefix [0xEE 0xDB tag]."
       ^bytes [tag]
       (doto (byte-array 3) (aset 0 MAGIC-0) (aset 1 MAGIC-1) (aset 2 (unchecked-byte tag))))

     (declare value->eve-bytes)

     (defn- flat-set->eve-bytes
       "Encode a Clojure set as a FLAT_SET byte[].
        Format: [0xEE][0xDB][0xEE][count:i32LE]([e-len:i32LE][e-bytes])*"
       ^bytes [s]
       (let [items   (seq s)
             cnt     (count s)
             encoded (mapv value->eve-bytes items)
             body    (reduce + (map #(+ 4 (alength ^bytes %)) encoded))
             b       (byte-array (+ 7 body))
             bb      (doto (ByteBuffer/wrap b) (.order ByteOrder/LITTLE_ENDIAN))]
         (aset b 0 MAGIC-0) (aset b 1 MAGIC-1) (aset b 2 TAG-FLAT-SET)
         (.position bb 3)
         (.putInt bb (int cnt))
         (doseq [^bytes eb encoded]
           (.putInt bb (int (alength eb)))
           (.put bb eb))
         b))

     (defn- flat-vec->eve-bytes
       "Encode a Clojure sequential as a FLAT_VEC byte[].
        Format: [0xEE][0xDB][0xEF][count:i32LE]([e-len:i32LE][e-bytes])*"
       ^bytes [coll]
       (let [items   (seq coll)
             count   (count coll)
             encoded (mapv value->eve-bytes items)
             body    (reduce + (map #(+ 4 (alength ^bytes %)) encoded))
             b       (byte-array (+ 7 body))
             bb      (doto (ByteBuffer/wrap b) (.order ByteOrder/LITTLE_ENDIAN))]
         (aset b 0 MAGIC-0) (aset b 1 MAGIC-1) (aset b 2 TAG-FLAT-VEC)
         (.position bb 3)
         (.putInt bb (int count))
         (doseq [^bytes eb encoded]
           (.putInt bb (int (alength eb)))
           (.put bb eb))
         b))

     (defn- flat-map->eve-bytes
       "Encode a Clojure map as a FLAT_MAP byte[].
        Format: [0xEE][0xDB][0xED][count:i32LE]([k-len:i32LE][k-bytes][v-len:i32LE][v-bytes])*"
       ^bytes [m]
       (let [count   (count m)
             encoded (mapv (fn [[k v]] [(value->eve-bytes k) (value->eve-bytes v)]) m)
             body    (reduce (fn [acc [kb vb]] (+ acc 4 (alength ^bytes kb) 4 (alength ^bytes vb)))
                             0 encoded)
             b       (byte-array (+ 7 body))
             bb      (doto (ByteBuffer/wrap b) (.order ByteOrder/LITTLE_ENDIAN))]
         (aset b 0 MAGIC-0) (aset b 1 MAGIC-1) (aset b 2 TAG-FLAT-MAP)
         (.position bb 3)
         (.putInt bb (int count))
         (doseq [[^bytes kb ^bytes vb] encoded]
           (.putInt bb (int (alength kb)))
           (.put bb kb)
           (.putInt bb (int (alength vb)))
           (.put bb vb))
         b))

     (defn value->eve-bytes
       "Encode a Clojure value to EVE binary format byte[].

        Supports: nil (→ 0 bytes), Boolean, Long/Integer/Short/Byte (→ INT32 or INT64),
        Double/Float (→ FLOAT64), String, Keyword, Symbol, java.util.Date, java.util.UUID.

        Maps are flat-encoded as FLAT_MAP (tag 0xED); sequential collections and sets
        are flat-encoded as FLAT_VEC (tag 0xEF).  Use value+sio->eve-bytes when HAMT
        allocation in a slab context is required."
       ^bytes [v]
       (cond
         (nil? v)
         (byte-array 0)

         (instance? Boolean v)
         (bytes-header-tag (if v 0x02 0x01))

         (or (instance? Long v)
             (instance? Integer v)
             (instance? Short v)
             (instance? Byte v))
         (let [n (long v)]
           (if (and (>= n Integer/MIN_VALUE) (<= n Integer/MAX_VALUE))
             ;; INT32: [0xEE][0xDB][0x03][i32LE:4]
             (let [b (byte-array 7)]
               (aset b 0 MAGIC-0) (aset b 1 MAGIC-1) (aset b 2 TAG-INT32)
               (.putInt (le-bb b) 3 (int n))
               b)
             ;; INT64: [0xEE][0xDB][0x0F][i64LE:8]
             (let [b (byte-array 11)]
               (aset b 0 MAGIC-0) (aset b 1 MAGIC-1) (aset b 2 TAG-INT64)
               (.putLong (le-bb b) 3 n)
               b)))

         (or (instance? Double v) (instance? Float v))
         ;; FLOAT64: [0xEE][0xDB][0x04][f64LE:8]
         (let [b (byte-array 11)]
           (aset b 0 MAGIC-0) (aset b 1 MAGIC-1) (aset b 2 TAG-FLOAT64)
           (.putDouble (le-bb b) 3 (double v))
           b)

         (instance? Date v)
         ;; DATE: [0xEE][0xDB][0x0E][f64LE:8]  (milliseconds since epoch)
         (let [b (byte-array 11)]
           (aset b 0 MAGIC-0) (aset b 1 MAGIC-1) (aset b 2 TAG-DATE)
           (.putDouble (le-bb b) 3 (double (.getTime ^Date v)))
           b)

         (instance? String v)
         (let [^bytes utf8 (.getBytes ^String v "UTF-8")
               slen (alength utf8)]
           (if (<= slen 255)
             ;; STRING_SHORT: [0xEE][0xDB][0x05][len:u8][utf8]
             (let [b (byte-array (+ 4 slen))]
               (aset b 0 MAGIC-0) (aset b 1 MAGIC-1) (aset b 2 TAG-STRING-SHORT)
               (aset b 3 (unchecked-byte slen))
               (System/arraycopy utf8 0 b 4 slen) b)
             ;; STRING_LONG: [0xEE][0xDB][0x06][len:u32LE][utf8]
             (let [b (byte-array (+ 7 slen))]
               (aset b 0 MAGIC-0) (aset b 1 MAGIC-1) (aset b 2 TAG-STRING-LONG)
               (.putInt (le-bb b) 3 (int slen))
               (System/arraycopy utf8 0 b 7 slen) b)))

         (keyword? v)
         (or (.get kw-encode-cache v)
             (let [ns-str  (namespace v)
                   nm-str  (name v)
                   result
                   (if (nil? ns-str)
                     (let [^bytes utf8 (.getBytes ^String nm-str "UTF-8")
                           slen (alength utf8)]
                       (if (<= slen 255)
                         (let [b (byte-array (+ 4 slen))]
                           (aset b 0 MAGIC-0) (aset b 1 MAGIC-1) (aset b 2 TAG-KEYWORD-SHORT)
                           (aset b 3 (unchecked-byte slen))
                           (System/arraycopy utf8 0 b 4 slen) b)
                         (let [b (byte-array (+ 7 slen))]
                           (aset b 0 MAGIC-0) (aset b 1 MAGIC-1) (aset b 2 TAG-KEYWORD-LONG)
                           (.putInt (le-bb b) 3 (int slen))
                           (System/arraycopy utf8 0 b 7 slen) b)))
                     (let [^bytes ns-utf8 (.getBytes ^String ns-str "UTF-8")
                           ^bytes nm-utf8 (.getBytes ^String nm-str "UTF-8")
                           ns-len (alength ns-utf8)
                           nm-len (alength nm-utf8)]
                       (if (and (<= ns-len 255) (<= nm-len 255))
                         (let [b (byte-array (+ 5 ns-len nm-len))]
                           (aset b 0 MAGIC-0) (aset b 1 MAGIC-1) (aset b 2 TAG-KW-NS-SHORT)
                           (aset b 3 (unchecked-byte ns-len))
                           (System/arraycopy ns-utf8 0 b 4 ns-len)
                           (aset b (+ 4 ns-len) (unchecked-byte nm-len))
                           (System/arraycopy nm-utf8 0 b (+ 5 ns-len) nm-len) b)
                         (let [b (byte-array (+ 11 ns-len nm-len))]
                           (aset b 0 MAGIC-0) (aset b 1 MAGIC-1) (aset b 2 TAG-KW-NS-LONG)
                           (.putInt (le-bb b) 3 (int ns-len))
                           (System/arraycopy ns-utf8 0 b 7 ns-len)
                           (.putInt (le-bb b) (+ 7 ns-len) (int nm-len))
                           (System/arraycopy nm-utf8 0 b (+ 11 ns-len) nm-len) b))))]
               (when (> (.size kw-encode-cache) KW_CACHE_MAX) (.clear kw-encode-cache))
               (.put kw-encode-cache v result)
               result))

         (symbol? v)
         (let [ns-str (namespace v)
               nm-str (name v)]
           (if (nil? ns-str)
             ;; Simple symbol
             (let [^bytes utf8 (.getBytes ^String nm-str "UTF-8")
                   slen (alength utf8)
                   b    (byte-array (+ 4 slen))]
               (aset b 0 MAGIC-0) (aset b 1 MAGIC-1) (aset b 2 TAG-SYMBOL-SHORT)
               (aset b 3 (unchecked-byte slen))
               (System/arraycopy utf8 0 b 4 slen) b)
             ;; Namespaced symbol
             (let [^bytes ns-utf8 (.getBytes ^String ns-str "UTF-8")
                   ^bytes nm-utf8 (.getBytes ^String nm-str "UTF-8")
                   ns-len (alength ns-utf8)
                   nm-len (alength nm-utf8)
                   b (byte-array (+ 5 ns-len nm-len))]
               (aset b 0 MAGIC-0) (aset b 1 MAGIC-1) (aset b 2 TAG-SYM-NS-SHORT)
               (aset b 3 (unchecked-byte ns-len))
               (System/arraycopy ns-utf8 0 b 4 ns-len)
               (aset b (+ 4 ns-len) (unchecked-byte nm-len))
               (System/arraycopy nm-utf8 0 b (+ 5 ns-len) nm-len) b)))

         (instance? UUID v)
         ;; UUID: [0xEE][0xDB][0x0B][msb:8 bytes BE][lsb:8 bytes BE]
         (let [^UUID u v
               b (byte-array 19)]
           (aset b 0 MAGIC-0) (aset b 1 MAGIC-1) (aset b 2 TAG-UUID)
           (doto (ByteBuffer/wrap b 3 16)
             (.putLong (.getMostSignificantBits u))
             (.putLong (.getLeastSignificantBits u)))
           b)

         (map? v)
         (flat-map->eve-bytes v)

         (set? v)
         (flat-set->eve-bytes v)

         (or (vector? v) (sequential? v) (seq? v))
         (flat-vec->eve-bytes v)

         :else
         (throw (ex-info "value->eve-bytes: unsupported type" {:type (type v) :value v}))))

     ;; --- JVM slab collection serialization ---

     (defn jvm-sab-pointer-bytes
       "Build the 7-byte EVE SAB pointer: [0xEE 0xDB tag off0 off1 off2 off3]."
       ^bytes [tag slab-off]
       (let [b (byte-array 7)]
         (aset b 0 (unchecked-byte 0xEE))
         (aset b 1 (unchecked-byte 0xDB))
         (aset b 2 (unchecked-byte tag))
         (aset b 3 (unchecked-byte (bit-and slab-off 0xFF)))
         (aset b 4 (unchecked-byte (bit-and (unsigned-bit-shift-right slab-off 8) 0xFF)))
         (aset b 5 (unchecked-byte (bit-and (unsigned-bit-shift-right slab-off 16) 0xFF)))
         (aset b 6 (unchecked-byte (bit-and (unsigned-bit-shift-right slab-off 24) 0xFF)))
         b))

     ;; Late-bound collection writers registered by map/vec/set/list namespaces at
     ;; load time. Using a defonce atom avoids circular compile-time dependencies.
     (defonce ^:private jvm-coll-writers (clojure.core/atom {}))

     (defn register-jvm-collection-writer!
       "Register a JVM slab writer for a collection type.
        tag    — one of :map, :set, :vec, :list
        writer — (fn [sio serialize-elem coll] → slab-off)
        Called from collection namespaces after their jvm-write-*! fns are defined."
       [tag writer]
       (swap! jvm-coll-writers assoc tag writer))

     (defn value+sio->eve-bytes
       "Serialize v to EVE bytes, allocating collection structures into sio.
        Maps → SAB_MAP pointer (0x10), sets → SAB_SET (0x11),
        vectors → SAB_VEC (0x12), lists → SAB_LIST (0x13).
        Primitives are encoded inline via value->eve-bytes.
        Collection writers must be registered via register-jvm-collection-writer!
        before calling this function with collection values."
       ^bytes [sio v]
       (let [writers @jvm-coll-writers]
         (cond
           (or (nil? v) (boolean? v) (integer? v) (float? v) (string? v)
               (keyword? v) (symbol? v)
               (instance? java.util.UUID v) (instance? java.util.Date v))
           (value->eve-bytes v)

           (map? v)
           (if-let [write-map! (get writers :map)]
             (jvm-sab-pointer-bytes 0x10 (write-map! sio (partial value+sio->eve-bytes sio) v))
             (throw (ex-info "value+sio->eve-bytes: :map writer not registered" {:value v})))

           (set? v)
           (if-let [write-set! (get writers :set)]
             (jvm-sab-pointer-bytes 0x11 (write-set! sio (partial value+sio->eve-bytes sio) v))
             (throw (ex-info "value+sio->eve-bytes: :set writer not registered" {:value v})))

           (list? v)
           (if-let [write-list! (get writers :list)]
             (jvm-sab-pointer-bytes 0x13 (write-list! sio (partial value+sio->eve-bytes sio) v))
             (throw (ex-info "value+sio->eve-bytes: :list writer not registered" {:value v})))

           (or (vector? v) (sequential? v))
           (if-let [write-vec! (get writers :vec)]
             (jvm-sab-pointer-bytes 0x12 (write-vec! sio (partial value+sio->eve-bytes sio) v))
             (throw (ex-info "value+sio->eve-bytes: :vec writer not registered" {:value v})))

           (.isArray (class v))
           (if-let [write-arr! (get writers :array)]
             (jvm-sab-pointer-bytes 0x1D (write-arr! sio nil v))
             (throw (ex-info "value+sio->eve-bytes: :array writer not registered" {:value v})))

           :else
           (throw (ex-info "value+sio->eve-bytes: unsupported type"
                           {:type (type v) :value v})))))))

