(ns cljs-thread.eve.array
  "Typed arrays backed by SharedArrayBuffer for all numeric types.

   Create arrays with the unified constructor:
     (eve-array :int32 10)          ;; 10 zero-filled int32 elements
     (eve-array :float64 10 0.0)    ;; 10 float64 filled with 0.0
     (eve-array :uint8 [1 2 3])     ;; from collection

   Supported types: :int8 :uint8 :int16 :uint16 :int32 :uint32 :float32 :float64

   Integer types (:int8 through :uint32) support full Atomics API:
     aget, aset!, cas!, add!, sub!, band!, bor!, bxor!
   Float types (:float32 :float64) support non-atomic aget/aset! only.
   wait!/notify! are :int32 only.

   SIMD-accelerated bulk operations (afill-simd!, asum-simd, etc.) are
   available for :int32 arrays when atomicity is not required."
  (:refer-clojure :exclude [aget aset areduce amap])
  (:require
   [clojure.string :as str]
   [cljs-thread.eve.shared-atom :as atom]
   [cljs-thread.eve.deftype-proto.data :as d]
   [cljs-thread.eve.wasm-mem :as wasm]
   [cljs-thread.eve.deftype-proto.serialize :as ser]))

;; Forward declarations
(declare eve-array aget aset!)

;;-----------------------------------------------------------------------------
;; Constants
;;-----------------------------------------------------------------------------

(def ^:const HEADER_SIZE 8) ;; [subtype:u8][pad:3][count:u32LE]

;;-----------------------------------------------------------------------------
;; Type metadata lookup
;;-----------------------------------------------------------------------------

(defn- subtype->elem-shift
  "Subtype code → log2(bytes-per-element)."
  [code]
  (case code
    (0x01 0x02 0x03) 0   ;; u8, i8, u8-clamped: 1 byte
    (0x04 0x05) 1   ;; i16, u16: 2 bytes
    (0x06 0x07 0x08) 2 ;; i32, u32, f32: 4 bytes
    0x09 3))         ;; f64: 8 bytes

(defn- subtype->atomic?
  "True if the subtype supports Atomics (integer types only, not Uint8ClampedArray)."
  [code]
  (and (<= code 0x07) (not= code 0x03)))

(defn- type-kw->subtype
  "Type keyword → serializer subtype code."
  [kw]
  (case kw
    :uint8         ser/TYPED_ARRAY_UINT8
    :int8          ser/TYPED_ARRAY_INT8
    :uint8-clamped ser/TYPED_ARRAY_UINT8_CLAMPED
    :int16         ser/TYPED_ARRAY_INT16
    :uint16        ser/TYPED_ARRAY_UINT16
    :int32         ser/TYPED_ARRAY_INT32
    :uint32        ser/TYPED_ARRAY_UINT32
    :float32       ser/TYPED_ARRAY_FLOAT32
    :float64       ser/TYPED_ARRAY_FLOAT64
    (throw (js/Error. (str "Unknown eve-array type: " kw
                           ". Supported: :int8 :uint8 :uint8-clamped :int16 :uint16 :int32 :uint32 :float32 :float64")))))

(defn- subtype->type-kw
  "Subtype code → type keyword (for printing)."
  [code]
  (case code
    0x01 :uint8
    0x02 :int8
    0x03 :uint8-clamped
    0x04 :int16
    0x05 :uint16
    0x06 :int32
    0x07 :uint32
    0x08 :float32
    0x09 :float64))

(defn- make-typed-view
  "Create a JS typed array view over the entire SAB for a given subtype."
  [sab subtype-code]
  (case subtype-code
    0x01 (js/Uint8Array. sab)
    0x02 (js/Int8Array. sab)
    0x03 (js/Uint8ClampedArray. sab)
    0x04 (js/Int16Array. sab)
    0x05 (js/Uint16Array. sab)
    0x06 (js/Int32Array. sab)
    0x07 (js/Uint32Array. sab)
    0x08 (js/Float32Array. sab)
    0x09 (js/Float64Array. sab)))

;;-----------------------------------------------------------------------------
;; Precondition helpers
;;-----------------------------------------------------------------------------

(defn- require-atomic! [^js arr op]
  (when-not (.-atomic? arr)
    (throw (js/Error. (str op " requires an integer-typed array (not supported on :float32/:float64)")))))

(defn- require-int32! [^js arr op]
  (when (not= (.-subtype-code arr) ser/TYPED_ARRAY_INT32)
    (throw (js/Error. (str op " only supported on :int32 arrays")))))

;;-----------------------------------------------------------------------------
;; EveArray deftype
;;-----------------------------------------------------------------------------

(deftype EveArray [^js/SharedArrayBuffer sab
                   ^number block-start    ;; byte offset of header (for SAB pointer encoding)
                   ^number offset         ;; byte offset of DATA (aligned, after header + padding)
                   ^number length         ;; element count
                   ^number descriptor-idx ;; block descriptor for GC tracking
                   ^number subtype-code   ;; TYPED_ARRAY_INT32, etc.
                   ^number elem-shift     ;; log2(bytes-per-element)
                   ^boolean atomic?       ;; true if type supports Atomics
                   ^js typed-view         ;; cached JS typed array view over entire SAB
                   ^:mutable __hash
                   ^IPersistentMap _meta]

  Object
  (toString [this]
    (str "#eve/array " (subtype->type-kw subtype-code) " ["
         (str/join " " (take 10 (map #(nth this %) (range (min 10 length)))))
         (when (> length 10) " ...")
         "]"))

  IMeta
  (-meta [_] _meta)

  IWithMeta
  (-with-meta [_ new-meta]
    (EveArray. sab block-start offset length descriptor-idx subtype-code elem-shift atomic? typed-view __hash new-meta))

  ICounted
  (-count [_] length)

  IIndexed
  (-nth [this n]
    (if (and (>= n 0) (< n length))
      (let [idx (+ (unsigned-bit-shift-right offset elem-shift) n)]
        (if atomic?
          (js/Atomics.load typed-view idx)
          (clojure.core/aget typed-view idx)))
      (throw (js/Error. (str "Index out of bounds: " n " for length " length)))))
  (-nth [this n not-found]
    (if (and (>= n 0) (< n length))
      (let [idx (+ (unsigned-bit-shift-right offset elem-shift) n)]
        (if atomic?
          (js/Atomics.load typed-view idx)
          (clojure.core/aget typed-view idx)))
      not-found))

  ILookup
  (-lookup [this k]
    (-nth this k nil))
  (-lookup [this k not-found]
    (-nth this k not-found))

  IFn
  (-invoke [this k]
    (-nth this k))
  (-invoke [this k not-found]
    (-nth this k not-found))

  ISeqable
  (-seq [this]
    (when (pos? length)
      (map #(-nth this %) (range length))))

  IReduce
  (-reduce [this f]
    (if (zero? length)
      (f)
      (loop [i 1
             acc (-nth this 0)]
        (if (< i length)
          (let [result (f acc (-nth this i))]
            (if (reduced? result)
              @result
              (recur (inc i) result)))
          acc))))
  (-reduce [this f start]
    (loop [i 0
           acc start]
      (if (< i length)
        (let [result (f acc (-nth this i))]
          (if (reduced? result)
            @result
            (recur (inc i) result)))
        acc)))

  IHash
  (-hash [this]
    (if __hash
      __hash
      (let [h (loop [i 0 h (+ 1 (* 31 subtype-code))]
                (if (< i length)
                  (recur (inc i) (+ (* 31 h) (hash (-nth this i))))
                  h))]
        (set! __hash h)
        h)))

  IEquiv
  (-equiv [this other]
    (cond
      (identical? this other) true
      (not (instance? EveArray other)) false
      (not= subtype-code (.-subtype-code ^js other)) false
      (not= length (count other)) false
      :else (loop [i 0]
              (if (< i length)
                (if (= (-nth this i) (nth other i))
                  (recur (inc i))
                  false)
                true))))

  IPrintWithWriter
  (-pr-writer [this writer opts]
    (-write writer (str "#eve/array " (subtype->type-kw subtype-code) " ["))
    (loop [i 0]
      (when (< i (min 20 length))
        (when (pos? i) (-write writer " "))
        (-write writer (str (-nth this i)))
        (recur (inc i))))
    (when (> length 20)
      (-write writer " ..."))
    (-write writer "]"))

  d/ISabStorable
  (-sab-tag [_] :eve/array)
  (-sab-encode [_this _s-atom-env]
    (ser/encode-sab-pointer ser/FAST_TAG_EVE_ARRAY block-start))
  (-sab-dispose [this s-atom-env]
    ;; Free the array's SAB block (header + data).
    (when (and (some? descriptor-idx) (>= descriptor-idx 0))
      (atom/retire-block! s-atom-env descriptor-idx)))

  d/IsEve
  (-eve? [_] true))

;;-----------------------------------------------------------------------------
;; Allocation
;;-----------------------------------------------------------------------------

(defn- alloc-eve-region
  "Allocate a SAB region for n elements of the given subtype.
   Writes the 8-byte header and aligns data to element size boundary.
   Returns {:sab sab :offset data-offset :descriptor-idx idx}."
  [subtype-code n]
  (let [elem-shift (subtype->elem-shift subtype-code)
        elem-size (bit-shift-left 1 elem-shift)
        data-byte-size (* n elem-size)
        ;; Over-allocate by (elem-size - 1) for worst-case alignment padding
        max-padding (dec elem-size)
        total-size (+ HEADER_SIZE max-padding data-byte-size)
        eve-env (if atom/*global-atom-instance*
                  (atom/get-env atom/*global-atom-instance*)
                  (throw (js/Error. "No global atom instance. Call (eve.atom/atom-domain {}) first.")))
        alloc-result (atom/alloc eve-env total-size)]
    (if (:error alloc-result)
      (throw (js/Error. (str "Failed to allocate eve-array: " (:error alloc-result))))
      (let [block-start (:offset alloc-result)
            ;; Align data-offset to element size boundary
            raw-data-start (+ block-start HEADER_SIZE)
            data-offset (bit-and (+ raw-data-start (dec elem-size))
                                 (bit-not (dec elem-size)))
            sab (:sab eve-env)
            dv (js/DataView. sab)]
        ;; Write header: [subtype:u8][pad:3][count:u32LE]
        (.setUint8 dv block-start subtype-code)
        (.setUint8 dv (+ block-start 1) 0)
        (.setUint16 dv (+ block-start 2) 0 true)
        (.setUint32 dv (+ block-start 4) n true)
        {:sab sab
         :block-start block-start
         :offset data-offset
         :descriptor-idx (:descriptor-idx alloc-result)}))))

;;-----------------------------------------------------------------------------
;; Internal constructors
;;-----------------------------------------------------------------------------

(defn- make-eve-array [type-kw n init-val]
  (let [subtype (type-kw->subtype type-kw)
        {:keys [sab block-start offset descriptor-idx]} (alloc-eve-region subtype n)
        elem-shift (subtype->elem-shift subtype)
        atomic (subtype->atomic? subtype)
        view (make-typed-view sab subtype)
        arr (EveArray. sab block-start offset n descriptor-idx subtype elem-shift atomic view nil nil)
        base-idx (unsigned-bit-shift-right offset elem-shift)
        fill-val (or init-val 0)]
    (if atomic
      (dotimes [i n]
        (js/Atomics.store view (+ base-idx i) fill-val))
      (dotimes [i n]
        (clojure.core/aset view (+ base-idx i) fill-val)))
    arr))

(defn- make-eve-array-from [type-kw coll]
  (let [v (vec coll)
        n (count v)]
    (if (zero? n)
      (make-eve-array type-kw 0 nil)
      (let [subtype (type-kw->subtype type-kw)
            {:keys [sab block-start offset descriptor-idx]} (alloc-eve-region subtype n)
            elem-shift (subtype->elem-shift subtype)
            atomic (subtype->atomic? subtype)
            view (make-typed-view sab subtype)
            arr (EveArray. sab block-start offset n descriptor-idx subtype elem-shift atomic view nil nil)
            base-idx (unsigned-bit-shift-right offset elem-shift)]
        (if atomic
          (dotimes [i n]
            (js/Atomics.store view (+ base-idx i) (nth v i)))
          (dotimes [i n]
            (clojure.core/aset view (+ base-idx i) (nth v i))))
        arr))))

;;-----------------------------------------------------------------------------
;; Unified constructor
;;-----------------------------------------------------------------------------

(defn eve-array
  "Create a typed array backed by SharedArrayBuffer.

     (eve-array :int32 10)          ;; 10 zero-filled int32 elements
     (eve-array :float64 10 0.0)    ;; 10 float64 filled with 0.0
     (eve-array :uint8 [1 2 3])     ;; from collection

   Supported types: :int8 :uint8 :int16 :uint16 :int32 :uint32 :float32 :float64"
  ([type-kw size-or-coll]
   (if (number? size-or-coll)
     (make-eve-array type-kw (int size-or-coll) nil)
     (make-eve-array-from type-kw size-or-coll)))
  ([type-kw n init-val]
   (make-eve-array type-kw (int n) init-val)))

;;-----------------------------------------------------------------------------
;; Backward-compatible aliases for Int32Array
;;-----------------------------------------------------------------------------

(defn int32-array
  "Create an int32 array. Alias for (eve-array :int32 ...)."
  ([n] (eve-array :int32 n))
  ([n init-val] (eve-array :int32 n init-val)))

(defn int32-array-from
  "Create an int32 array from a collection. Alias for (eve-array :int32 coll)."
  [coll]
  (eve-array :int32 coll))

;;-----------------------------------------------------------------------------
;; Element access
;;-----------------------------------------------------------------------------

(defn aget
  "Read element at index. Uses Atomics.load for integer types,
   plain indexing for float types."
  [^EveArray arr idx]
  (let [length (.-length arr)]
    (when (or (< idx 0) (>= idx length))
      (throw (js/Error. (str "Index out of bounds: " idx))))
    (let [view (.-typed-view arr)
          base (unsigned-bit-shift-right (.-offset arr) (.-elem-shift arr))]
      (if (.-atomic? arr)
        (js/Atomics.load view (+ base idx))
        (clojure.core/aget view (+ base idx))))))

(defn aset!
  "Write element at index. Uses Atomics.store for integer types,
   plain assignment for float types. Returns the value written."
  [^EveArray arr idx val]
  (let [length (.-length arr)]
    (when (or (< idx 0) (>= idx length))
      (throw (js/Error. (str "Index out of bounds: " idx))))
    (let [view (.-typed-view arr)
          base (unsigned-bit-shift-right (.-offset arr) (.-elem-shift arr))]
      (if (.-atomic? arr)
        (js/Atomics.store view (+ base idx) val)
        (clojure.core/aset view (+ base idx) val)))
    val))

;;-----------------------------------------------------------------------------
;; Atomic operations (integer types only)
;;-----------------------------------------------------------------------------

(defn cas!
  "Compare-and-swap at index. Returns true if successful.
   Integer types only."
  [^EveArray arr idx expected new-val]
  (require-atomic! arr "cas!")
  (let [length (.-length arr)]
    (when (or (< idx 0) (>= idx length))
      (throw (js/Error. (str "Index out of bounds: " idx))))
    (let [view (.-typed-view arr)
          base (unsigned-bit-shift-right (.-offset arr) (.-elem-shift arr))]
      (== expected
          (js/Atomics.compareExchange view (+ base idx) expected new-val)))))

(defn exchange!
  "Atomically replace value at index, returning the old value.
   Integer types only."
  [^EveArray arr idx new-val]
  (require-atomic! arr "exchange!")
  (let [length (.-length arr)]
    (when (or (< idx 0) (>= idx length))
      (throw (js/Error. (str "Index out of bounds: " idx))))
    (let [view (.-typed-view arr)
          base (unsigned-bit-shift-right (.-offset arr) (.-elem-shift arr))]
      (js/Atomics.exchange view (+ base idx) new-val))))

(defn add!
  "Atomically add to value at index, returning the old value.
   Integer types only."
  [^EveArray arr idx delta]
  (require-atomic! arr "add!")
  (let [length (.-length arr)]
    (when (or (< idx 0) (>= idx length))
      (throw (js/Error. (str "Index out of bounds: " idx))))
    (let [view (.-typed-view arr)
          base (unsigned-bit-shift-right (.-offset arr) (.-elem-shift arr))]
      (js/Atomics.add view (+ base idx) delta))))

(defn sub!
  "Atomically subtract from value at index, returning the old value.
   Integer types only."
  [^EveArray arr idx delta]
  (require-atomic! arr "sub!")
  (let [length (.-length arr)]
    (when (or (< idx 0) (>= idx length))
      (throw (js/Error. (str "Index out of bounds: " idx))))
    (let [view (.-typed-view arr)
          base (unsigned-bit-shift-right (.-offset arr) (.-elem-shift arr))]
      (js/Atomics.sub view (+ base idx) delta))))

(defn band!
  "Atomically bitwise-AND value at index, returning the old value.
   Integer types only."
  [^EveArray arr idx mask]
  (require-atomic! arr "band!")
  (let [length (.-length arr)]
    (when (or (< idx 0) (>= idx length))
      (throw (js/Error. (str "Index out of bounds: " idx))))
    (let [view (.-typed-view arr)
          base (unsigned-bit-shift-right (.-offset arr) (.-elem-shift arr))]
      (js/Atomics.and view (+ base idx) mask))))

(defn bor!
  "Atomically bitwise-OR value at index, returning the old value.
   Integer types only."
  [^EveArray arr idx mask]
  (require-atomic! arr "bor!")
  (let [length (.-length arr)]
    (when (or (< idx 0) (>= idx length))
      (throw (js/Error. (str "Index out of bounds: " idx))))
    (let [view (.-typed-view arr)
          base (unsigned-bit-shift-right (.-offset arr) (.-elem-shift arr))]
      (js/Atomics.or view (+ base idx) mask))))

(defn bxor!
  "Atomically bitwise-XOR value at index, returning the old value.
   Integer types only."
  [^EveArray arr idx mask]
  (require-atomic! arr "bxor!")
  (let [length (.-length arr)]
    (when (or (< idx 0) (>= idx length))
      (throw (js/Error. (str "Index out of bounds: " idx))))
    (let [view (.-typed-view arr)
          base (unsigned-bit-shift-right (.-offset arr) (.-elem-shift arr))]
      (js/Atomics.xor view (+ base idx) mask))))

;;-----------------------------------------------------------------------------
;; Wait/Notify (:int32 only)
;;-----------------------------------------------------------------------------

(defn wait!
  "Block until the value at index is not equal to `expected`, or until timeout.
   Returns :ok, :not-equal, or :timed-out.
   :int32 arrays only."
  ([^EveArray arr idx expected]
   (wait! arr idx expected ##Inf))
  ([^EveArray arr idx expected timeout-ms]
   (require-int32! arr "wait!")
   (let [length (.-length arr)]
     (when (or (< idx 0) (>= idx length))
       (throw (js/Error. (str "Index out of bounds: " idx))))
     (let [view (.-typed-view arr)
           base (unsigned-bit-shift-right (.-offset arr) (.-elem-shift arr))
           result (js/Atomics.wait view (+ base idx) expected timeout-ms)]
       (case result
         "ok" :ok
         "not-equal" :not-equal
         "timed-out" :timed-out
         result)))))

(defn wait-async
  "Async version of wait!. Returns a promise that resolves to :ok, :not-equal, or :timed-out.
   :int32 arrays only."
  ([^EveArray arr idx expected]
   (wait-async arr idx expected ##Inf))
  ([^EveArray arr idx expected timeout-ms]
   (require-int32! arr "wait-async")
   (let [length (.-length arr)]
     (when (or (< idx 0) (>= idx length))
       (throw (js/Error. (str "Index out of bounds: " idx))))
     (let [view (.-typed-view arr)
           base (unsigned-bit-shift-right (.-offset arr) (.-elem-shift arr))
           result (js/Atomics.waitAsync view (+ base idx) expected timeout-ms)]
       (if (.-async result)
         (-> (.-value result)
             (.then (fn [r]
                      (case r
                        "ok" :ok
                        "not-equal" :not-equal
                        "timed-out" :timed-out
                        r))))
         (let [v (.-value result)]
           (js/Promise.resolve
            (case v
              "ok" :ok
              "not-equal" :not-equal
              "timed-out" :timed-out
              v))))))))

(defn notify!
  "Wake up waiting agents on the value at index.
   count defaults to ##Inf (wake all waiters).
   Returns the number of agents woken.
   :int32 arrays only."
  ([^EveArray arr idx]
   (notify! arr idx ##Inf))
  ([^EveArray arr idx cnt]
   (require-int32! arr "notify!")
   (let [length (.-length arr)]
     (when (or (< idx 0) (>= idx length))
       (throw (js/Error. (str "Index out of bounds: " idx))))
     (let [view (.-typed-view arr)
           base (unsigned-bit-shift-right (.-offset arr) (.-elem-shift arr))]
       (js/Atomics.notify view (+ base idx) cnt)))))

;;-----------------------------------------------------------------------------
;; Functional operations
;;-----------------------------------------------------------------------------

(defn areduce
  "Reduce over array elements with index.
   f is (fn [acc idx val] ...).
   Returns the final accumulated value."
  [^EveArray arr init f]
  (let [len (.-length arr)]
    (loop [i 0
           acc init]
      (if (< i len)
        (let [result (f acc i (aget arr i))]
          (if (reduced? result)
            @result
            (recur (inc i) result)))
        acc))))

(defn amap
  "Map f over array indices, returning a new array of the same type.
   f is (fn [idx current-val] ...) and must return a value of the right type."
  [^EveArray arr f]
  (let [len (.-length arr)
        type-kw (subtype->type-kw (.-subtype-code arr))
        result (eve-array type-kw len)]
    (dotimes [i len]
      (aset! result i (f i (aget arr i))))
    result))

(defn amap!
  "Map f over array indices in-place, mutating the array.
   f is (fn [idx current-val] ...).
   Returns the array."
  [^EveArray arr f]
  (let [len (.-length arr)]
    (dotimes [i len]
      (aset! arr i (f i (aget arr i))))
    arr))

(defn afill!
  "Fill array with value, optionally in range [start, end).
   Returns the array."
  ([^EveArray arr val]
   (afill! arr val 0 (.-length arr)))
  ([^EveArray arr val start]
   (afill! arr val start (.-length arr)))
  ([^EveArray arr val start end]
   (let [len (.-length arr)
         end (min end len)]
     (loop [i start]
       (when (< i end)
         (aset! arr i val)
         (recur (inc i))))
     arr)))

(defn acopy!
  "Copy elements from src to dest array.
   Both arrays must be the same type.
   src-start, dest-start default to 0.
   length defaults to min of remaining space.
   Returns dest array."
  ([dest src]
   (acopy! dest 0 src 0 (min (count dest) (count src))))
  ([dest dest-start src src-start len]
   (dotimes [i len]
     (aset! dest (+ dest-start i) (aget src (+ src-start i))))
   dest))

;;-----------------------------------------------------------------------------
;; Low-level access
;;-----------------------------------------------------------------------------

(defn get-sab
  "Get the underlying SharedArrayBuffer."
  [^EveArray arr]
  (.-sab arr))

(defn get-offset
  "Get the byte offset of the data region into the SAB."
  [^EveArray arr]
  (.-offset arr))

(defn get-typed-view
  "Get a raw JS typed array view of this array's SAB region.
   Useful for bulk operations. Handle with care."
  [^EveArray arr]
  (let [view (.-typed-view arr)
        base (unsigned-bit-shift-right (.-offset arr) (.-elem-shift arr))]
    (.subarray view base (+ base (.-length arr)))))

(defn get-int32-view
  "Get a raw Int32Array view of the underlying SAB region.
   Only valid for :int32 arrays."
  [^EveArray arr]
  (js/Int32Array. (.-sab arr) (.-offset arr) (.-length arr)))

(defn get-descriptor-idx
  "Get the block descriptor index for this array."
  [^EveArray arr]
  (.-descriptor-idx arr))

(defn array-type
  "Get the type keyword for this array (:int32, :float64, etc.)."
  [^EveArray arr]
  (subtype->type-kw (.-subtype-code arr)))

;;-----------------------------------------------------------------------------
;; GC / Lifecycle
;;-----------------------------------------------------------------------------

(defn retire!
  "Mark this array's block as retired for GC.
   Call when replacing this array with a new version.
   Returns true if successfully retired, false if already being processed."
  [^EveArray arr]
  (when-let [desc-idx (.-descriptor-idx arr)]
    (when (>= desc-idx 0)
      (let [eve-env (when atom/*global-atom-instance*
                      (atom/get-env atom/*global-atom-instance*))]
        (when eve-env
          (atom/retire-block! eve-env desc-idx))))))

;;-----------------------------------------------------------------------------
;; SIMD-Accelerated Operations (:int32 only)
;;
;; These operations use WASM SIMD for bulk processing (4 elements at a time).
;; They do NOT use Atomics and should only be used when:
;; - The array is not yet shared with other threads
;; - The array is read-only in the current context
;; - You have other synchronization in place
;;-----------------------------------------------------------------------------

(defn afill-simd!
  "Fill :int32 array with value using SIMD (4 elements at a time).
   WARNING: Does not use Atomics. Only use before sharing with other threads."
  ([^EveArray arr val]
   (afill-simd! arr val 0 (.-length arr)))
  ([^EveArray arr val start end]
   (require-int32! arr "afill-simd!")
   (let [offset (.-offset arr)
         byte-start (+ offset (* start 4))
         count (- end start)]
     (when (and (wasm/ready?) (pos? count))
       (wasm/simd-fill-i32! byte-start count val))
     arr)))

(defn acopy-simd!
  "Copy elements between :int32 arrays using SIMD (4 elements at a time).
   WARNING: Does not use Atomics. Only use before sharing with other threads."
  ([dest src]
   (acopy-simd! dest 0 src 0 (min (count dest) (count src))))
  ([dest dest-start src src-start len]
   (require-int32! dest "acopy-simd!")
   (require-int32! src "acopy-simd!")
   (when (and (wasm/ready?) (pos? len))
     (let [dest-byte-offset (+ (.-offset dest) (* dest-start 4))
           src-byte-offset (+ (.-offset src) (* src-start 4))]
       (wasm/simd-copy-i32! dest-byte-offset src-byte-offset len)))
   dest))

(defn asum-simd
  "Sum all elements in :int32 array using SIMD.
   Safe to use on shared arrays (read-only)."
  ([^EveArray arr]
   (asum-simd arr 0 (.-length arr)))
  ([^EveArray arr start end]
   (require-int32! arr "asum-simd")
   (let [offset (.-offset arr)
         byte-start (+ offset (* start 4))
         count (- end start)]
     (if (and (wasm/ready?) (pos? count))
       (wasm/simd-sum-i32 byte-start count)
       0))))

(defn amin-simd
  "Find minimum value in :int32 array using SIMD.
   Safe to use on shared arrays (read-only).
   Returns INT32_MAX for empty arrays."
  ([^EveArray arr]
   (amin-simd arr 0 (.-length arr)))
  ([^EveArray arr start end]
   (require-int32! arr "amin-simd")
   (let [offset (.-offset arr)
         byte-start (+ offset (* start 4))
         count (- end start)]
     (if (and (wasm/ready?) (pos? count))
       (wasm/simd-min-i32 byte-start count)
       2147483647))))

(defn amax-simd
  "Find maximum value in :int32 array using SIMD.
   Safe to use on shared arrays (read-only).
   Returns INT32_MIN for empty arrays."
  ([^EveArray arr]
   (amax-simd arr 0 (.-length arr)))
  ([^EveArray arr start end]
   (require-int32! arr "amax-simd")
   (let [offset (.-offset arr)
         byte-start (+ offset (* start 4))
         count (- end start)]
     (if (and (wasm/ready?) (pos? count))
       (wasm/simd-max-i32 byte-start count)
       -2147483648))))

(defn aequal-simd?
  "Compare two :int32 arrays for equality using SIMD.
   Safe to use on shared arrays (read-only)."
  [^EveArray arr1 ^EveArray arr2]
  (require-int32! arr1 "aequal-simd?")
  (require-int32! arr2 "aequal-simd?")
  (let [len1 (.-length arr1)
        len2 (.-length arr2)]
    (if (not= len1 len2)
      false
      (if (and (wasm/ready?) (pos? len1))
        (wasm/simd-eq-i32? (.-offset arr1) (.-offset arr2) len1)
        (zero? len1)))))

;;-----------------------------------------------------------------------------
;; Native typed array → EveArray conversion
;;-----------------------------------------------------------------------------

(defn from-typed-array
  "Create an EveArray from a native JS typed array.
   Copies the data into the SharedArrayBuffer.
   Supports all standard typed array types including Uint8ClampedArray."
  [elem]
  (let [subtype (ser/typed-array-subtype elem)
        n (.-length elem)
        {:keys [sab block-start offset descriptor-idx]} (alloc-eve-region subtype n)
        elem-shift (subtype->elem-shift subtype)
        atomic (subtype->atomic? subtype)
        view (make-typed-view sab subtype)
        base-idx (unsigned-bit-shift-right offset elem-shift)
        dest (.subarray view base-idx (+ base-idx n))]
    ;; Bulk copy via TypedArray.set — fast memcpy-like operation
    (.set dest elem)
    (EveArray. sab block-start offset n descriptor-idx subtype elem-shift atomic view nil nil)))

;;-----------------------------------------------------------------------------
;; Typed array encoder registration (called by serializer for native typed arrays)
;;-----------------------------------------------------------------------------

(ser/set-typed-array-encoder!
  (fn [elem]
    (let [subtype (ser/typed-array-subtype elem)]
      (if (and subtype (<= subtype 0x0B))
        ;; All typed arrays → allocate SAB block, return TYPED_ARRAY pointer.
        ;; This preserves the typed array identity on deref (vs converting to EveArray).
        ;;
        ;; Block format (16-byte header for SIMD alignment):
        ;;   [subtype:u8][reserved:7 bytes][byte-len:u32LE][reserved:4 bytes][data at +16]
        ;; Data starts at offset+16 for 16-byte alignment (enables SIMD).
        ;; We over-allocate by up to 15 bytes to ensure the header starts at
        ;; a 16-byte aligned position within the allocated block.
        (let [byte-view (js/Uint8Array. (.-buffer elem) (.-byteOffset elem) (.-byteLength elem))
              byte-len (.-byteLength elem)
              header-size 16
              ;; Over-allocate by 15 to guarantee 16-byte alignment headroom:
              ;; worst case raw_offset % 16 == 1 → shift 15 bytes to align.
              alloc-size (+ header-size byte-len 15)
              ;; Get parent atom from dynamic binding or global
              parent-atom (or d/*parent-atom* atom/*global-atom-instance*)
              eve-env (when parent-atom (atom/get-env parent-atom))
              alloc-result (when eve-env (atom/alloc eve-env alloc-size))]
          (if (and alloc-result (not (:error alloc-result)))
            ;; SAB-backed: write block at aligned position, return 7-byte pointer
            (let [raw-offset (:offset alloc-result)
                  ;; Align header to 16-byte boundary
                  aligned-offset (bit-and (+ raw-offset 15) (bit-not 15))
                  sab (:sab eve-env)
                  dv (js/DataView. sab)
                  u8 (js/Uint8Array. sab)]
              ;; Write header: [subtype:u8][reserved:7][byte-len:u32LE][reserved:4]
              (.setUint8 dv aligned-offset subtype)
              ;; reserved bytes 1-7 are implicitly zero from allocation
              (.setUint32 dv (+ aligned-offset 8) byte-len true)
              ;; reserved bytes 12-15 are implicitly zero
              ;; Write data at offset+16
              (.set u8 byte-view (+ aligned-offset 16))
              ;; Return 7-byte pointer with aligned offset
              (ser/encode-sab-pointer ser/FAST_TAG_TYPED_ARRAY aligned-offset))
            ;; Fallback for pre-init: inline blob (old 8-byte format for compatibility)
            (let [buf (js/Uint8Array. (+ 8 byte-len))
                  dv (js/DataView. (.-buffer buf))]
              (cljs.core/aset buf 0 d/DIRECT_MAGIC_0)
              (cljs.core/aset buf 1 d/DIRECT_MAGIC_1)
              (cljs.core/aset buf 2 ser/FAST_TAG_TYPED_ARRAY)
              (cljs.core/aset buf 3 subtype)
              (.setUint32 dv 4 byte-len true)
              (.set buf byte-view 8)
              buf)))
        ;; Unsupported type
        (js/Uint8Array. 0)))))

;;-----------------------------------------------------------------------------
;; Constructor registration for deserialization
;;-----------------------------------------------------------------------------

(ser/register-sab-type-constructor!
  ser/FAST_TAG_EVE_ARRAY
  (fn [sab block-offset]
    ;; sab may be nil when deserializing from HAMT context (s-atom-env is {}).
    ;; Use *parent-atom* (bound during deref/swap!) or fall back to global.
    (let [sab (or sab (when-let [parent (or d/*parent-atom* atom/*global-atom-instance*)]
                        (:sab (atom/get-env parent))))
          dv (js/DataView. sab)
          subtype (.getUint8 dv block-offset)
          elem-count (.getUint32 dv (+ block-offset 4) true)
          elem-shift (subtype->elem-shift subtype)
          ;; Align data-offset to element size boundary (must match alloc-eve-region)
          align (bit-shift-left 1 elem-shift)
          raw-data-start (+ block-offset HEADER_SIZE)
          data-offset (bit-and (+ raw-data-start (dec align))
                               (bit-not (dec align)))
          atomic (subtype->atomic? subtype)
          view (make-typed-view sab subtype)]
      (EveArray. sab block-offset data-offset elem-count -1 subtype elem-shift atomic view nil nil))))
