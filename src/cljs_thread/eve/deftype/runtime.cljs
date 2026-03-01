(ns cljs-thread.eve.deftype.runtime
  (:require
   [cljs-thread.eve.shared-atom :as atom]
   [cljs-thread.eve.deftype-proto.serialize :as ser]))

;; Runtime helpers for eve-deftype instances.
;; The macro emits calls to these functions with compile-time-known
;; offsets and types baked in as arguments.

;;-----------------------------------------------------------------------------
;; Direct allocation with descriptor tracking for GC
;;-----------------------------------------------------------------------------

(defn- direct-alloc
  "Allocate `size` bytes directly from the allocator.
   Returns {:offset n :descriptor-idx m} or throws on error."
  [eve-env size]
  (let [alloc-result (atom/alloc eve-env size)]
    (if (:error alloc-result)
      (throw (js/Error. (str "eve-deftype alloc failed: " (:error alloc-result))))
      {:offset (:offset alloc-result)
       :descriptor-idx (:descriptor-idx alloc-result)})))

;;-----------------------------------------------------------------------------
;; Instance allocation
;;-----------------------------------------------------------------------------

(defn alloc-instance
  "Allocate a contiguous region in the SAB for a new eve-deftype instance.
   Writes the type-id byte at offset 0 and zero-fills the rest.
   Returns the numeric byte offset of the allocated instance.
   Offset is guaranteed 4-byte aligned for Atomics compatibility."
  [eve-env type-id total-size]
  (let [{:keys [offset]} (direct-alloc eve-env total-size)
        sab (:sab eve-env)
        dv (js/DataView. sab)]
    ;; write type-id byte at position 0
    (.setUint8 dv offset type-id)
    ;; zero-fill bytes 1..total-size-1
    (let [u8 (js/Uint8Array. sab)]
      (loop [i 1]
        (when (< i total-size)
          (aset u8 (+ offset i) 0)
          (recur (inc i)))))
    offset))

;;-----------------------------------------------------------------------------
;; Serialized field encode/decode (fast-path, no Fressian)
;;-----------------------------------------------------------------------------

(defn serialize-value
  "Encode a Clojure value to bytes using fast-path serialization."
  [obj]
  (ser/serialize-element obj))

(defn deserialize-value
  "Decode bytes to a Clojure value using fast-path deserialization."
  [eve-env byte-array]
  (when byte-array
    (ser/deserialize-element eve-env byte-array)))

;;-----------------------------------------------------------------------------
;; Primitive field reads
;;-----------------------------------------------------------------------------

(defn read-int32
  "Read an int32 field at (eve-offset + field-offset) via DataView."
  [eve-env eve-offset field-offset]
  (.getInt32 (js/DataView. (:sab eve-env)) (+ eve-offset field-offset) true))

(defn read-int32-volatile
  "Read a volatile int32 field via Atomics.load."
  [eve-env eve-offset field-offset]
  (js/Atomics.load (js/Int32Array. (:sab eve-env))
                   (unsigned-bit-shift-right (+ eve-offset field-offset) 2)))

(defn read-uint32
  "Read a uint32 field."
  [eve-env eve-offset field-offset]
  (.getUint32 (js/DataView. (:sab eve-env)) (+ eve-offset field-offset) true))

(defn read-uint32-volatile
  "Read a volatile uint32 field via Atomics.load (returns as signed, caller casts)."
  [eve-env eve-offset field-offset]
  (js/Atomics.load (js/Int32Array. (:sab eve-env))
                   (unsigned-bit-shift-right (+ eve-offset field-offset) 2)))

(defn read-float32
  "Read a float32 field."
  [eve-env eve-offset field-offset]
  (.getFloat32 (js/DataView. (:sab eve-env)) (+ eve-offset field-offset) true))

(defn read-float64
  "Read a float64 field."
  [eve-env eve-offset field-offset]
  (.getFloat64 (js/DataView. (:sab eve-env)) (+ eve-offset field-offset) true))

;;-----------------------------------------------------------------------------
;; Primitive field writes
;;-----------------------------------------------------------------------------

(defn write-int32!
  "Write an int32 field. Returns the written value."
  [eve-env eve-offset field-offset val]
  (.setInt32 (js/DataView. (:sab eve-env)) (+ eve-offset field-offset) val true)
  val)

(defn write-int32-volatile!
  "Write a volatile int32 field via Atomics.store. Returns the written value."
  [eve-env eve-offset field-offset val]
  (js/Atomics.store (js/Int32Array. (:sab eve-env))
                    (unsigned-bit-shift-right (+ eve-offset field-offset) 2)
                    val)
  val)

(defn write-uint32!
  "Write a uint32 field. Returns the written value."
  [eve-env eve-offset field-offset val]
  (.setUint32 (js/DataView. (:sab eve-env)) (+ eve-offset field-offset) val true)
  val)

(defn write-uint32-volatile!
  "Write a volatile uint32 field via Atomics.store."
  [eve-env eve-offset field-offset val]
  (js/Atomics.store (js/Int32Array. (:sab eve-env))
                    (unsigned-bit-shift-right (+ eve-offset field-offset) 2)
                    val)
  val)

(defn write-float32!
  "Write a float32 field."
  [eve-env eve-offset field-offset val]
  (.setFloat32 (js/DataView. (:sab eve-env)) (+ eve-offset field-offset) val true)
  val)

(defn write-float64!
  "Write a float64 field."
  [eve-env eve-offset field-offset val]
  (.setFloat64 (js/DataView. (:sab eve-env)) (+ eve-offset field-offset) val true)
  val)

;;-----------------------------------------------------------------------------
;; Primitive CAS
;;-----------------------------------------------------------------------------

(defn cas-int32!
  "CAS on a volatile int32 field. Returns true if successful."
  [eve-env eve-offset field-offset expected new-val]
  (let [idx (unsigned-bit-shift-right (+ eve-offset field-offset) 2)]
    (== expected
        (js/Atomics.compareExchange (js/Int32Array. (:sab eve-env))
                                    idx expected new-val))))

;;-----------------------------------------------------------------------------
;; Eve-type field reads/writes
;;-----------------------------------------------------------------------------

(defn read-eve-type
  "Read an eve-type field: load the int32 offset, wrap in constructor.
   Returns nil if offset is -1 (nil sentinel)."
  [eve-env eve-offset field-offset constructor]
  (let [target-offset (.getInt32 (js/DataView. (:sab eve-env))
                                 (+ eve-offset field-offset) true)]
    (when (not= target-offset -1)
      (constructor eve-env target-offset))))

(defn read-eve-type-volatile
  "Read a volatile eve-type field via Atomics.load."
  [eve-env eve-offset field-offset constructor]
  (let [target-offset (js/Atomics.load (js/Int32Array. (:sab eve-env))
                                       (unsigned-bit-shift-right (+ eve-offset field-offset) 2))]
    (when (not= target-offset -1)
      (constructor eve-env target-offset))))

(defn write-eve-type!
  "Write an eve-type field: type-tag check + store offset.
   Returns the written value."
  [eve-env eve-offset field-offset expected-type-id val]
  (let [sab (:sab eve-env)]
    (if (nil? val)
      (do (.setInt32 (js/DataView. sab) (+ eve-offset field-offset) -1 true)
          nil)
      (let [target-off (.-eve-offset val)
            actual-id (.getUint8 (js/DataView. sab) target-off)]
        (when (not= actual-id expected-type-id)
          (throw (js/Error. (str "eve set!: expected type-id " expected-type-id
                                 ", got " actual-id " at offset " target-off))))
        (.setInt32 (js/DataView. sab) (+ eve-offset field-offset) target-off true)
        val))))

(defn write-eve-type-volatile!
  "Write a volatile eve-type field via Atomics.store."
  [eve-env eve-offset field-offset expected-type-id val]
  (let [sab (:sab eve-env)]
    (if (nil? val)
      (do (js/Atomics.store (js/Int32Array. sab)
                            (unsigned-bit-shift-right (+ eve-offset field-offset) 2)
                            -1)
          nil)
      (let [target-off (.-eve-offset val)
            actual-id (.getUint8 (js/DataView. sab) target-off)]
        (when (not= actual-id expected-type-id)
          (throw (js/Error. (str "eve set!: expected type-id " expected-type-id
                                 ", got " actual-id " at offset " target-off))))
        (js/Atomics.store (js/Int32Array. sab)
                          (unsigned-bit-shift-right (+ eve-offset field-offset) 2)
                          target-off)
        val))))

(defn cas-eve-type!
  "CAS on a volatile eve-type field. expected and new-val are eve-type instances.
   Returns true if successful."
  [eve-env eve-offset field-offset expected-type-id expected-instance new-instance]
  (let [sab (:sab eve-env)
        idx (unsigned-bit-shift-right (+ eve-offset field-offset) 2)
        expected-off (if (nil? expected-instance) -1 (.-eve-offset expected-instance))
        new-off (if (nil? new-instance) -1 (.-eve-offset new-instance))]
    ;; type-check the new value
    (when (and (some? new-instance) (not= (.getUint8 (js/DataView. sab) new-off) expected-type-id))
      (throw (js/Error. (str "eve cas!: expected type-id " expected-type-id))))
    (== expected-off
        (js/Atomics.compareExchange (js/Int32Array. sab) idx expected-off new-off))))

;;-----------------------------------------------------------------------------
;; Serialized field reads/writes
;;-----------------------------------------------------------------------------

(defn read-serialized
  "Read a serialized field: load offset, read length-prefixed bytes, decode."
  [eve-env eve-offset field-offset]
  (let [sab (:sab eve-env)
        data-offset (.getInt32 (js/DataView. sab) (+ eve-offset field-offset) true)]
    (when (not= data-offset -1)
      (let [dv (js/DataView. sab)
            data-len (.getInt32 dv data-offset true)
            data-bytes (js/Uint8Array. (js/Uint8Array. sab (+ data-offset 4) data-len))]
        (deserialize-value eve-env data-bytes)))))

(defn read-serialized-volatile
  "Read a volatile serialized field via Atomics.load for the offset."
  [eve-env eve-offset field-offset]
  (let [sab (:sab eve-env)
        data-offset (js/Atomics.load (js/Int32Array. sab)
                                     (unsigned-bit-shift-right (+ eve-offset field-offset) 2))]
    (when (not= data-offset -1)
      (let [dv (js/DataView. sab)
            data-len (.getInt32 dv data-offset true)
            data-bytes (js/Uint8Array. (js/Uint8Array. sab (+ data-offset 4) data-len))]
        (deserialize-value eve-env data-bytes)))))

(defn write-serialized!
  "Write a serialized field: encode val, alloc block, store offset.
   Returns {:value val :descriptor-idx idx} for GC tracking, or nil."
  [eve-env eve-offset field-offset val]
  (let [sab (:sab eve-env)]
    (if (nil? val)
      (do (.setInt32 (js/DataView. sab) (+ eve-offset field-offset) -1 true)
          nil)
      (let [encoded-bytes (serialize-value val)
            byte-len (alength encoded-bytes)
            {:keys [offset descriptor-idx]} (direct-alloc eve-env (+ 4 byte-len))
            dv (js/DataView. sab)]
        (.setInt32 dv offset byte-len true)
        (.set (js/Uint8Array. sab offset (+ 4 byte-len))
              (js/Uint8Array. (.-buffer encoded-bytes) (.-byteOffset encoded-bytes) byte-len)
              4)
        (.setInt32 dv (+ eve-offset field-offset) offset true)
        {:value val :descriptor-idx descriptor-idx}))))

(defn write-serialized-volatile!
  "Write a volatile serialized field.
   Returns {:value val :descriptor-idx idx} for GC tracking, or nil."
  [eve-env eve-offset field-offset val]
  (let [sab (:sab eve-env)]
    (if (nil? val)
      (do (js/Atomics.store (js/Int32Array. sab)
                            (unsigned-bit-shift-right (+ eve-offset field-offset) 2)
                            -1)
          nil)
      (let [encoded-bytes (serialize-value val)
            byte-len (alength encoded-bytes)
            {:keys [offset descriptor-idx]} (direct-alloc eve-env (+ 4 byte-len))
            dv (js/DataView. sab)]
        (.setInt32 dv offset byte-len true)
        (.set (js/Uint8Array. sab offset (+ 4 byte-len))
              (js/Uint8Array. (.-buffer encoded-bytes) (.-byteOffset encoded-bytes) byte-len)
              4)
        (js/Atomics.store (js/Int32Array. sab)
                          (unsigned-bit-shift-right (+ eve-offset field-offset) 2)
                          offset)
        {:value val :descriptor-idx descriptor-idx}))))

;;-----------------------------------------------------------------------------
;; Type check
;;-----------------------------------------------------------------------------

(defn eve-type-id
  "Read the type-id byte at the given offset."
  [eve-env offset]
  (.getUint8 (js/DataView. (:sab eve-env)) offset))
