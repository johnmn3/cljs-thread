(ns cljs-thread.eve.deftype-proto.serialize
  "Shared serialization for EVE EVE data structures.

   Provides fast-path serialize/deserialize for primitives with:
   - Keyword cache: keywords are interned in CLJS, so we cache their
     serialized form to avoid repeated TextEncoder + allocation overhead
   - Reusable scratch buffers: for fixed-size types (int32, float64, etc.),
     writes to pre-allocated DataView and returns a subarray view,
     eliminating per-call ArrayBuffer + DataView allocations
   - Two scratch buffers (A/B) to support serializing key+value simultaneously

   All serialize functions return Uint8Array (API compatible with callers)."
  (:require
   [cljs-thread.eve.deftype-proto.data :as d]))

;;-----------------------------------------------------------------------------
;; Fast-path type tags (byte after magic prefix 0xEE 0xDB)
;;-----------------------------------------------------------------------------

(def ^:const FAST_TAG_FALSE 0x01)
(def ^:const FAST_TAG_TRUE 0x02)
(def ^:const FAST_TAG_INT32 0x03)
(def ^:const FAST_TAG_FLOAT64 0x04)
(def ^:const FAST_TAG_STRING_SHORT 0x05)
(def ^:const FAST_TAG_STRING_LONG 0x06)
(def ^:const FAST_TAG_KEYWORD_SHORT 0x07)
(def ^:const FAST_TAG_KEYWORD_LONG 0x08)
(def ^:const FAST_TAG_KEYWORD_NS_SHORT 0x09)
(def ^:const FAST_TAG_KEYWORD_NS_LONG 0x0A)
(def ^:const FAST_TAG_UUID 0x0B)
(def ^:const FAST_TAG_SYMBOL_SHORT 0x0C)
(def ^:const FAST_TAG_SYMBOL_NS_SHORT 0x0D)
(def ^:const FAST_TAG_DATE 0x0E)
(def ^:const FAST_TAG_INT64 0x0F)

;; SAB pointer tags — nested collections stored as SAB data structures.
;; Each encodes a reference to an existing SAB type instance in shared memory.
;; Format: [0xEE][0xDB][tag:u8][instance-offset:i32] = 7 bytes
(def ^:const FAST_TAG_SAB_MAP 0x10)
(def ^:const FAST_TAG_SAB_SET 0x11)
(def ^:const FAST_TAG_SAB_VEC 0x12)
(def ^:const FAST_TAG_SAB_LIST 0x13)

;; Record tag — stores a CLJS record as a SabMap with :eve/record-tag metadata.
;; Format: [0xEE][0xDB][0x1A][sab-map-offset:i32] = 7 bytes
;; The SabMap contains the record's fields + {:eve/record-tag "ctor-str"}
(def ^:const FAST_TAG_RECORD 0x1A)

;; Typed array tag — stores a JS typed array as a flat byte blob.
;; Format: [0xEE][0xDB][0x1B][subtype:u8][byte-length:u32][raw bytes...] = 8 + N bytes
;; Subtype codes identify the typed array constructor.
(def ^:const FAST_TAG_TYPED_ARRAY 0x1B)

;; EveArray tag — SAB pointer to a live eve-array (zero-copy wrapper).
;; Format: [0xEE][0xDB][0x1C][block-offset:i32] = 7 bytes.
;; Block layout: [subtype:u8][pad:3][elem-count:u32LE][data bytes...] = 8 + N bytes.
(def ^:const FAST_TAG_EVE_ARRAY 0x1C)

;; Typed array subtype codes
(def ^:const TYPED_ARRAY_UINT8         0x01)
(def ^:const TYPED_ARRAY_INT8          0x02)
(def ^:const TYPED_ARRAY_UINT8_CLAMPED 0x03)
(def ^:const TYPED_ARRAY_INT16         0x04)
(def ^:const TYPED_ARRAY_UINT16        0x05)
(def ^:const TYPED_ARRAY_INT32         0x06)
(def ^:const TYPED_ARRAY_UINT32        0x07)
(def ^:const TYPED_ARRAY_FLOAT32       0x08)
(def ^:const TYPED_ARRAY_FLOAT64       0x09)
(def ^:const TYPED_ARRAY_BIGINT64      0x0A)
(def ^:const TYPED_ARRAY_BIGUINT64     0x0B)

;;-----------------------------------------------------------------------------
;; SAB type registries (populated by sab_map, sab_set, sab_vec, sab_list at load)
;;-----------------------------------------------------------------------------

;; Constructor registry: tag → (fn [sab offset] → sab-type-instance)
;; Used by deserialize-element to reconstruct SAB type wrappers from pointers.
(defonce ^:private sab-type-constructors (js/Map.))

(defn register-sab-type-constructor!
  "Register a constructor for deserializing SAB pointer tags.
   tag: u8 tag byte (e.g., 0x10 for SabMap)
   ctor-fn: (fn [sab offset] -> instance) — wraps existing SAB memory"
  [tag ctor-fn]
  (.set sab-type-constructors tag ctor-fn))

;; Builder registry: [[pred builder] ...] for auto-converting CLJS collections
;; to SAB types during serialization.
(defonce ^:private cljs-to-sab-builders #js [])

(defn register-cljs-to-sab-builder!
  "Register a builder for auto-converting CLJS collections to SAB types.
   pred: (fn [elem] -> boolean) — type check predicate
   builder: (fn [elem] -> sab-instance) — builds SAB type from CLJS collection"
  [pred builder]
  (.push cljs-to-sab-builders #js [pred builder]))

;; Direct map encoder: builds SAB map and returns pointer bytes directly,
;; skipping EveHashMap allocation + protocol dispatch.
;; Set by sab_map.cljs at load time.
(def ^:private ^:mutable direct-map-encoder nil)

(defn set-direct-map-encoder!
  "Set the direct map encoder function. Called by sab_map.cljs at load.
   encoder: (fn [cljs-map] -> Uint8Array) — builds SAB map and returns pointer bytes"
  [encoder]
  (set! direct-map-encoder encoder))

;; Typed array encoder: allocates SAB block, copies bytes, returns 7-byte pointer.
;; Set by sab_map.cljs at load time (needs access to alloc-bytes!).
(def ^:private ^:mutable typed-array-encoder nil)

(defn set-typed-array-encoder!
  "Set the typed array encoder function. Called by sab_map.cljs at load.
   encoder: (fn [typed-array] -> Uint8Array) — allocates SAB and returns pointer bytes"
  [encoder]
  (set! typed-array-encoder encoder))

;; Record registries (two-part for encode/decode):
;;   record-tag-by-ctor: constructor-fn → tag-str  (for encoding: look up tag by type)
;;   record-ctor-by-tag: tag-str → map->fn         (for decoding: reconstruct from tag)
(defonce ^:private record-tag-by-ctor (js/Map.))
(defonce ^:private record-ctor-by-tag (js/Map.))

(defn register-record-type!
  "Register a record type for SAB serialization roundtrip.
   record-ctor: the record constructor (e.g., MyRecord)
   tag-str: unique string tag (e.g., \"my.ns/MyRecord\")
   map-fn: (fn [field-map] -> record) — typically map->MyRecord"
  [record-ctor tag-str map-fn]
  (.set record-tag-by-ctor record-ctor tag-str)
  (.set record-ctor-by-tag tag-str map-fn))

(defn- try-build-sab
  "Try to convert a CLJS collection to a SAB type using registered builders.
   Returns the SAB instance or nil if no builder matches."
  [elem]
  (let [len (.-length cljs-to-sab-builders)]
    (loop [i 0]
      (when (< i len)
        (let [entry (aget cljs-to-sab-builders i)
              pred (aget entry 0)]
          (if (pred elem)
            ((aget entry 1) elem)
            (recur (inc i))))))))

(defn- encode-record
  "Encode a CLJS record as a FAST_TAG_RECORD pointer.
   Stores the record's fields + :eve/record-tag in a SabMap.
   Returns nil if the record type is not registered."
  [elem]
  (let [tag-str (.get record-tag-by-ctor (type elem))]
    (when tag-str
      (let [tagged-map (assoc (reduce-kv assoc {} elem) :eve/record-tag tag-str)
            sab-m (try-build-sab tagged-map)]
        (when sab-m
          ;; Get the SAB_MAP encoding, then change the tag byte to RECORD
          (let [bytes (if (satisfies? d/ISabStorable sab-m)
                        (d/-sab-encode sab-m nil)
                        (d/-direct-serialize sab-m))]
            (aset bytes 2 FAST_TAG_RECORD)
            bytes))))))

;;-----------------------------------------------------------------------------
;; Shared resources
;;-----------------------------------------------------------------------------

(def ^:private fast-encoder (js/TextEncoder.))
(def ^:private fast-decoder (js/TextDecoder.))

(defn- decode-text
  "Decode UTF-8 bytes to string. Copies SAB-backed views first since
   TextDecoder.decode rejects SharedArrayBuffer views."
  [u8-view]
  (.decode fast-decoder
    (if (instance? js/SharedArrayBuffer (.-buffer u8-view))
      (js/Uint8Array. u8-view)
      u8-view)))

;; Keyword serialization cache: keywords are interned in CLJS (identical? :foo :foo),
;; so JS Map lookup by reference is O(1). Avoids TextEncoder + allocation per call.
(def ^:private keyword-cache (js/Map.))
(def ^:const ^:private KEYWORD_CACHE_MAX 2048)

;; Keyword deserialization cache: avoids repeated TextDecoder + keyword() during
;; iteration. Keyed by SAB data offset (stable for immutable HAMT nodes).
;; On cache hit, returns the keyword directly — no TextDecoder, no allocation.
(def ^:private kw-deser-cache (js/Map.))
(def ^:const ^:private KW_DESER_CACHE_MAX 16384)

(defn clear-deser-caches!
  "Clear deserialization caches. Call when SAB environment is replaced."
  []
  (.clear kw-deser-cache))

;; Reusable scratch buffers for fixed-size numeric types.
;; Two buffers allow key and value to be serialized simultaneously.
;; Max fixed-size is 19 bytes (UUID), so 32 bytes is generous.
(def ^:private scratch-a-buf (js/ArrayBuffer. 32))
(def ^:private scratch-a-dv (js/DataView. scratch-a-buf))
(def ^:private scratch-a-u8 (js/Uint8Array. scratch-a-buf))
;; Pre-allocated subarray views — eliminates Uint8Array view allocation per call
(def ^:private scratch-a-3 (.subarray scratch-a-u8 0 3))   ;; boolean
(def ^:private scratch-a-7 (.subarray scratch-a-u8 0 7))   ;; int32
(def ^:private scratch-a-11 (.subarray scratch-a-u8 0 11))  ;; int64/float64/date

(def ^:private scratch-b-buf (js/ArrayBuffer. 32))
(def ^:private scratch-b-dv (js/DataView. scratch-b-buf))
(def ^:private scratch-b-u8 (js/Uint8Array. scratch-b-buf))
(def ^:private scratch-b-3 (.subarray scratch-b-u8 0 3))
(def ^:private scratch-b-7 (.subarray scratch-b-u8 0 7))
(def ^:private scratch-b-11 (.subarray scratch-b-u8 0 11))

;; Reusable 7-byte scratch buffer for SAB type pointer encoding.
;; Eliminates Uint8Array + DataView allocation in -direct-serialize.
;; Safe because the returned view is consumed (copied into HAMT node)
;; before the next encode-sab-pointer call.
(def ^:private sab-ptr-buf (js/Uint8Array. 7))
(def ^:private sab-ptr-dv (js/DataView. (.-buffer sab-ptr-buf)))

(defn encode-sab-pointer
  "Encode a SAB type pointer to a reusable 7-byte buffer.
   Valid until the next encode-sab-pointer call."
  [tag offset]
  (aset sab-ptr-buf 0 d/DIRECT_MAGIC_0)
  (aset sab-ptr-buf 1 d/DIRECT_MAGIC_1)
  (aset sab-ptr-buf 2 tag)
  (.setInt32 sab-ptr-dv 3 offset true)
  sab-ptr-buf)

;;-----------------------------------------------------------------------------
;; Internal: serialize typed array
;;-----------------------------------------------------------------------------

(defn typed-array-subtype
  "Return the subtype code for a JS typed array, or nil if not a typed array."
  [elem]
  (cond
    ;; Uint8ClampedArray must be checked before Uint8Array (it's a subclass)
    (instance? js/Uint8ClampedArray elem)  TYPED_ARRAY_UINT8_CLAMPED
    (instance? js/Uint8Array elem)        TYPED_ARRAY_UINT8
    (instance? js/Int8Array elem)          TYPED_ARRAY_INT8
    (instance? js/Int16Array elem)         TYPED_ARRAY_INT16
    (instance? js/Uint16Array elem)        TYPED_ARRAY_UINT16
    (instance? js/Int32Array elem)         TYPED_ARRAY_INT32
    (instance? js/Uint32Array elem)        TYPED_ARRAY_UINT32
    (instance? js/Float32Array elem)       TYPED_ARRAY_FLOAT32
    (instance? js/Float64Array elem)       TYPED_ARRAY_FLOAT64
    ;; BigInt typed arrays may not be available in all environments
    (and (exists? js/BigInt64Array)  (instance? js/BigInt64Array elem))  TYPED_ARRAY_BIGINT64
    (and (exists? js/BigUint64Array) (instance? js/BigUint64Array elem)) TYPED_ARRAY_BIGUINT64
    :else nil))

(defn- serialize-typed-array
  "Serialize a JS typed array. Uses the SAB-backed encoder (node-backed, 7-byte
   pointer) when available, falling back to inline blob for small arrays.
   Node-backed storage keeps HAMT nodes small — same pattern as maps/vecs/sets."
  [elem]
  (when (some? (typed-array-subtype elem))
    (if typed-array-encoder
      ;; SAB-backed: allocate block, copy bytes, return 7-byte pointer
      (typed-array-encoder elem)
      ;; Fallback for pre-init: inline blob (only used during bootstrap)
      (let [subtype  (typed-array-subtype elem)
            byte-view (js/Uint8Array. (.-buffer elem) (.-byteOffset elem) (.-byteLength elem))
            byte-len  (.-byteLength elem)
            buf       (js/Uint8Array. (+ 8 byte-len))
            dv        (js/DataView. (.-buffer buf))]
        (aset buf 0 d/DIRECT_MAGIC_0)
        (aset buf 1 d/DIRECT_MAGIC_1)
        (aset buf 2 FAST_TAG_TYPED_ARRAY)
        (aset buf 3 subtype)
        (.setUint32 dv 4 byte-len true)
        (.set buf byte-view 8)
        buf))))

;;-----------------------------------------------------------------------------
;; Internal: serialize keyword (cached)
;;-----------------------------------------------------------------------------

(defn- serialize-keyword-impl [elem]
  ;; Check cache first
  (or (.get keyword-cache elem)
  ;; Cache miss — serialize and cache
  (let [result
        (if (namespace elem)
          ;; Namespaced keyword
          (let [ns-str (namespace elem)
                name-str (name elem)
                ns-enc (.encode fast-encoder ns-str)
                name-enc (.encode fast-encoder name-str)
                ns-len (.-length ns-enc)
                name-len (.-length name-enc)]
            (if (and (<= ns-len 255) (<= name-len 255))
              (let [buf (js/Uint8Array. (+ 5 ns-len name-len))]
                (aset buf 0 d/DIRECT_MAGIC_0)
                (aset buf 1 d/DIRECT_MAGIC_1)
                (aset buf 2 FAST_TAG_KEYWORD_NS_SHORT)
                (aset buf 3 ns-len)
                (.set buf ns-enc 4)
                (aset buf (+ 4 ns-len) name-len)
                (.set buf name-enc (+ 5 ns-len))
                buf)
              (let [buf (js/Uint8Array. (+ 11 ns-len name-len))
                    dv (js/DataView. (.-buffer buf))]
                (aset buf 0 d/DIRECT_MAGIC_0)
                (aset buf 1 d/DIRECT_MAGIC_1)
                (aset buf 2 FAST_TAG_KEYWORD_NS_LONG)
                (.setUint32 dv 3 ns-len true)
                (.set buf ns-enc 7)
                (.setUint32 dv (+ 7 ns-len) name-len true)
                (.set buf name-enc (+ 11 ns-len))
                buf)))
          ;; Simple keyword
          (let [s (name elem)
                encoded (.encode fast-encoder s)
                len (.-length encoded)]
            (if (<= len 255)
              (let [buf (js/Uint8Array. (+ 4 len))]
                (aset buf 0 d/DIRECT_MAGIC_0)
                (aset buf 1 d/DIRECT_MAGIC_1)
                (aset buf 2 FAST_TAG_KEYWORD_SHORT)
                (aset buf 3 len)
                (.set buf encoded 4)
                buf)
              (let [buf (js/Uint8Array. (+ 7 len))
                    dv (js/DataView. (.-buffer buf))]
                (aset buf 0 d/DIRECT_MAGIC_0)
                (aset buf 1 d/DIRECT_MAGIC_1)
                (aset buf 2 FAST_TAG_KEYWORD_LONG)
                (.setUint32 dv 3 len true)
                (.set buf encoded 7)
                buf))))]
    ;; Cache the result (evict if cache is too large)
    (when (>= (.-size keyword-cache) KEYWORD_CACHE_MAX)
      (.clear keyword-cache))
    (.set keyword-cache elem result)
    result)))

;;-----------------------------------------------------------------------------
;; Internal: serialize to scratch buffer (fixed-size primitives)
;;-----------------------------------------------------------------------------

(defn- serialize-numeric-a
  "Serialize fixed-size primitive to scratch buffer A using pre-allocated views."
  [elem]
  (cond
    (nil? elem)
    (js/Uint8Array. 0)

    (boolean? elem)
    (do (aset scratch-a-u8 0 d/DIRECT_MAGIC_0)
        (aset scratch-a-u8 1 d/DIRECT_MAGIC_1)
        (aset scratch-a-u8 2 (if elem FAST_TAG_TRUE FAST_TAG_FALSE))
        scratch-a-3)

    (and (number? elem) (js/Number.isInteger elem)
         (>= elem -2147483648) (<= elem 2147483647))
    (do (aset scratch-a-u8 0 d/DIRECT_MAGIC_0)
        (aset scratch-a-u8 1 d/DIRECT_MAGIC_1)
        (aset scratch-a-u8 2 FAST_TAG_INT32)
        (.setInt32 scratch-a-dv 3 elem true)
        scratch-a-7)

    (and (number? elem) (js/Number.isInteger elem) (js/Number.isSafeInteger elem))
    (do (aset scratch-a-u8 0 d/DIRECT_MAGIC_0)
        (aset scratch-a-u8 1 d/DIRECT_MAGIC_1)
        (aset scratch-a-u8 2 FAST_TAG_INT64)
        (.setBigInt64 scratch-a-dv 3 (js/BigInt elem) true)
        scratch-a-11)

    (number? elem)
    (do (aset scratch-a-u8 0 d/DIRECT_MAGIC_0)
        (aset scratch-a-u8 1 d/DIRECT_MAGIC_1)
        (aset scratch-a-u8 2 FAST_TAG_FLOAT64)
        (.setFloat64 scratch-a-dv 3 elem true)
        scratch-a-11)

    (inst? elem)
    (do (aset scratch-a-u8 0 d/DIRECT_MAGIC_0)
        (aset scratch-a-u8 1 d/DIRECT_MAGIC_1)
        (aset scratch-a-u8 2 FAST_TAG_DATE)
        (.setFloat64 scratch-a-dv 3 (.getTime elem) true)
        scratch-a-11)

    :else nil))

(defn- serialize-numeric-b
  "Serialize fixed-size primitive to scratch buffer B using pre-allocated views."
  [elem]
  (cond
    (nil? elem)
    (js/Uint8Array. 0)

    (boolean? elem)
    (do (aset scratch-b-u8 0 d/DIRECT_MAGIC_0)
        (aset scratch-b-u8 1 d/DIRECT_MAGIC_1)
        (aset scratch-b-u8 2 (if elem FAST_TAG_TRUE FAST_TAG_FALSE))
        scratch-b-3)

    (and (number? elem) (js/Number.isInteger elem)
         (>= elem -2147483648) (<= elem 2147483647))
    (do (aset scratch-b-u8 0 d/DIRECT_MAGIC_0)
        (aset scratch-b-u8 1 d/DIRECT_MAGIC_1)
        (aset scratch-b-u8 2 FAST_TAG_INT32)
        (.setInt32 scratch-b-dv 3 elem true)
        scratch-b-7)

    (and (number? elem) (js/Number.isInteger elem) (js/Number.isSafeInteger elem))
    (do (aset scratch-b-u8 0 d/DIRECT_MAGIC_0)
        (aset scratch-b-u8 1 d/DIRECT_MAGIC_1)
        (aset scratch-b-u8 2 FAST_TAG_INT64)
        (.setBigInt64 scratch-b-dv 3 (js/BigInt elem) true)
        scratch-b-11)

    (number? elem)
    (do (aset scratch-b-u8 0 d/DIRECT_MAGIC_0)
        (aset scratch-b-u8 1 d/DIRECT_MAGIC_1)
        (aset scratch-b-u8 2 FAST_TAG_FLOAT64)
        (.setFloat64 scratch-b-dv 3 elem true)
        scratch-b-11)

    (inst? elem)
    (do (aset scratch-b-u8 0 d/DIRECT_MAGIC_0)
        (aset scratch-b-u8 1 d/DIRECT_MAGIC_1)
        (aset scratch-b-u8 2 FAST_TAG_DATE)
        (.setFloat64 scratch-b-dv 3 (.getTime elem) true)
        scratch-b-11)

    :else nil))

;;-----------------------------------------------------------------------------
;; Public: serialize-element with two scratch buffers
;;-----------------------------------------------------------------------------

(defn serialize-key
  "Serialize element using scratch buffer A.
   Use for keys when serializing key+value pairs simultaneously."
  [elem]
  ;; Keywords: use cache (most common key type)
  (if (keyword? elem)
    (serialize-keyword-impl elem)
    ;; Fixed-size primitives: use scratch A (pre-allocated views)
    (or (serialize-numeric-a elem)
        ;; Variable-size types
        (cond
          ;; SAB types — already in shared memory, encode as pointer
          (satisfies? d/ISabStorable elem)
          (d/-sab-encode elem nil)

          ;; Records — must check before map? (records satisfy map?)
          (satisfies? IRecord elem)
          (or (encode-record elem)
              (js/Uint8Array. 0))

          ;; CLJS maps — direct encode (skip builder registry + EveHashMap allocation)
          (and direct-map-encoder (map? elem))
          (direct-map-encoder elem)

          ;; UUID
          (uuid? elem)
          (let [buf (js/Uint8Array. 19)
                uuid-str (.toLowerCase (str elem))]
            (aset buf 0 d/DIRECT_MAGIC_0)
            (aset buf 1 d/DIRECT_MAGIC_1)
            (aset buf 2 FAST_TAG_UUID)
            (let [hex-positions [0 2 4 6 9 11 14 16 19 21 24 26 28 30 32 34]]
              (dotimes [i 16]
                (let [hex-idx (aget (into-array hex-positions) i)
                      byte-val (js/parseInt (.substring uuid-str hex-idx (+ hex-idx 2)) 16)]
                  (aset buf (+ 3 i) byte-val))))
            buf)

          ;; Symbol (namespaced)
          (and (symbol? elem) (namespace elem))
          (let [ns-str (namespace elem)
                name-str (name elem)
                ns-enc (.encode fast-encoder ns-str)
                name-enc (.encode fast-encoder name-str)
                ns-len (.-length ns-enc)
                name-len (.-length name-enc)
                buf (js/Uint8Array. (+ 5 ns-len name-len))]
            (aset buf 0 d/DIRECT_MAGIC_0)
            (aset buf 1 d/DIRECT_MAGIC_1)
            (aset buf 2 FAST_TAG_SYMBOL_NS_SHORT)
            (aset buf 3 ns-len)
            (.set buf ns-enc 4)
            (aset buf (+ 4 ns-len) name-len)
            (.set buf name-enc (+ 5 ns-len))
            buf)

          ;; Symbol (simple)
          (symbol? elem)
          (let [s (name elem)
                encoded (.encode fast-encoder s)
                len (.-length encoded)
                buf (js/Uint8Array. (+ 4 len))]
            (aset buf 0 d/DIRECT_MAGIC_0)
            (aset buf 1 d/DIRECT_MAGIC_1)
            (aset buf 2 FAST_TAG_SYMBOL_SHORT)
            (aset buf 3 len)
            (.set buf encoded 4)
            buf)

          ;; String
          (string? elem)
          (let [encoded (.encode fast-encoder elem)
                len (.-length encoded)]
            (if (<= len 255)
              (let [buf (js/Uint8Array. (+ 4 len))]
                (aset buf 0 d/DIRECT_MAGIC_0)
                (aset buf 1 d/DIRECT_MAGIC_1)
                (aset buf 2 FAST_TAG_STRING_SHORT)
                (aset buf 3 len)
                (.set buf encoded 4)
                buf)
              (let [buf (js/Uint8Array. (+ 7 len))
                    dv (js/DataView. (.-buffer buf))]
                (aset buf 0 d/DIRECT_MAGIC_0)
                (aset buf 1 d/DIRECT_MAGIC_1)
                (aset buf 2 FAST_TAG_STRING_LONG)
                (.setUint32 dv 3 len true)
                (.set buf encoded 7)
                buf)))

          ;; JS typed arrays — serialize as flat byte blob
          (some? (typed-array-subtype elem))
          (serialize-typed-array elem)

          ;; IDirectSerialize (legacy SAB types)
          (satisfies? d/IDirectSerialize elem)
          (d/-direct-serialize elem)

          ;; Other CLJS collections (sets, vecs, lists) — auto-convert via builder
          :else
          (if-let [sab-inst (try-build-sab elem)]
            (if (satisfies? d/ISabStorable sab-inst)
              (d/-sab-encode sab-inst nil)
              (d/-direct-serialize sab-inst))
            ;; Unsupported type — encode as empty bytes
            (js/Uint8Array. 0))))))

(defn serialize-val
  "Serialize element using scratch buffer B.
   Use for values when serializing key+value pairs simultaneously."
  [elem]
  ;; Keywords can also be values (e.g., enum values)
  (if (keyword? elem)
    (serialize-keyword-impl elem)
    ;; Fixed-size primitives: use scratch B (pre-allocated views)
    (or (serialize-numeric-b elem)
        ;; Variable-size types - same as serialize-key but uses scratch B
        (cond
          ;; SAB types — already in shared memory, encode as pointer
          ;; Must check before map? since EveHashMap satisfies map?
          (satisfies? d/ISabStorable elem)
          (d/-sab-encode elem nil)

          ;; Records — must check before map? (records satisfy map?)
          (satisfies? IRecord elem)
          (or (encode-record elem)
              (js/Uint8Array. 0))

          ;; CLJS maps — direct encode (skip builder registry + EveHashMap allocation)
          (and direct-map-encoder (map? elem))
          (direct-map-encoder elem)

          (uuid? elem)
          (let [buf (js/Uint8Array. 19)
                uuid-str (.toLowerCase (str elem))]
            (aset buf 0 d/DIRECT_MAGIC_0)
            (aset buf 1 d/DIRECT_MAGIC_1)
            (aset buf 2 FAST_TAG_UUID)
            (let [hex-positions [0 2 4 6 9 11 14 16 19 21 24 26 28 30 32 34]]
              (dotimes [i 16]
                (let [hex-idx (aget (into-array hex-positions) i)
                      byte-val (js/parseInt (.substring uuid-str hex-idx (+ hex-idx 2)) 16)]
                  (aset buf (+ 3 i) byte-val))))
            buf)

          (and (symbol? elem) (namespace elem))
          (let [ns-str (namespace elem)
                name-str (name elem)
                ns-enc (.encode fast-encoder ns-str)
                name-enc (.encode fast-encoder name-str)
                ns-len (.-length ns-enc)
                name-len (.-length name-enc)
                buf (js/Uint8Array. (+ 5 ns-len name-len))]
            (aset buf 0 d/DIRECT_MAGIC_0)
            (aset buf 1 d/DIRECT_MAGIC_1)
            (aset buf 2 FAST_TAG_SYMBOL_NS_SHORT)
            (aset buf 3 ns-len)
            (.set buf ns-enc 4)
            (aset buf (+ 4 ns-len) name-len)
            (.set buf name-enc (+ 5 ns-len))
            buf)

          (symbol? elem)
          (let [s (name elem)
                encoded (.encode fast-encoder s)
                len (.-length encoded)
                buf (js/Uint8Array. (+ 4 len))]
            (aset buf 0 d/DIRECT_MAGIC_0)
            (aset buf 1 d/DIRECT_MAGIC_1)
            (aset buf 2 FAST_TAG_SYMBOL_SHORT)
            (aset buf 3 len)
            (.set buf encoded 4)
            buf)

          (string? elem)
          (let [encoded (.encode fast-encoder elem)
                len (.-length encoded)]
            (if (<= len 255)
              (let [buf (js/Uint8Array. (+ 4 len))]
                (aset buf 0 d/DIRECT_MAGIC_0)
                (aset buf 1 d/DIRECT_MAGIC_1)
                (aset buf 2 FAST_TAG_STRING_SHORT)
                (aset buf 3 len)
                (.set buf encoded 4)
                buf)
              (let [buf (js/Uint8Array. (+ 7 len))
                    dv (js/DataView. (.-buffer buf))]
                (aset buf 0 d/DIRECT_MAGIC_0)
                (aset buf 1 d/DIRECT_MAGIC_1)
                (aset buf 2 FAST_TAG_STRING_LONG)
                (.setUint32 dv 3 len true)
                (.set buf encoded 7)
                buf)))

          ;; JS typed arrays — serialize as flat byte blob
          (some? (typed-array-subtype elem))
          (serialize-typed-array elem)

          ;; IDirectSerialize (legacy SAB types)
          (satisfies? d/IDirectSerialize elem)
          (d/-direct-serialize elem)

          ;; Other CLJS collections (sets, vecs, lists) — auto-convert via builder
          :else
          (if-let [sab-inst (try-build-sab elem)]
            (if (satisfies? d/ISabStorable sab-inst)
              (d/-sab-encode sab-inst nil)
              (d/-direct-serialize sab-inst))
            ;; Unsupported type — encode as empty bytes
            (js/Uint8Array. 0))))))

(defn serialize-element
  "Serialize element (single-use, when only one serialize is alive at a time).
   Uses scratch buffer A. For key+value pairs, use serialize-key/serialize-val."
  [elem]
  (serialize-key elem))

;;-----------------------------------------------------------------------------
;; Deserialization
;;-----------------------------------------------------------------------------

(defn deserialize-element
  "Deserialize bytes back to a CLJS value.
   Uses fast-path for primitive types, protocol dispatch for everything else."
  [s-atom-env ^js bytes]
  (let [len (.-length bytes)]
    (if (zero? len)
      nil
      ;; Check for fast-path magic prefix
      (if (and (>= len 3)
               (== (aget bytes 0) d/DIRECT_MAGIC_0)
               (== (aget bytes 1) d/DIRECT_MAGIC_1))
        (let [tag (aget bytes 2)]
          (cond
            (== tag FAST_TAG_FALSE) false
            (== tag FAST_TAG_TRUE) true

            (== tag FAST_TAG_INT32)
            (let [dv (js/DataView. (.-buffer bytes) (.-byteOffset bytes) (.-byteLength bytes))]
              (.getInt32 dv 3 true))

            (== tag FAST_TAG_INT64)
            (let [dv (js/DataView. (.-buffer bytes) (.-byteOffset bytes) (.-byteLength bytes))]
              (js/Number (.getBigInt64 dv 3 true)))

            (== tag FAST_TAG_FLOAT64)
            (let [dv (js/DataView. (.-buffer bytes) (.-byteOffset bytes) (.-byteLength bytes))]
              (.getFloat64 dv 3 true))

            (== tag FAST_TAG_STRING_SHORT)
            (let [str-len (aget bytes 3)]
              (decode-text (.subarray bytes 4 (+ 4 str-len))))

            (== tag FAST_TAG_STRING_LONG)
            (let [dv (js/DataView. (.-buffer bytes) (.-byteOffset bytes) (.-byteLength bytes))
                  str-len (.getUint32 dv 3 true)]
              (decode-text (.subarray bytes 7 (+ 7 str-len))))

            (== tag FAST_TAG_KEYWORD_SHORT)
            (let [str-len (aget bytes 3)]
              (keyword (decode-text (.subarray bytes 4 (+ 4 str-len)))))

            (== tag FAST_TAG_KEYWORD_LONG)
            (let [dv (js/DataView. (.-buffer bytes) (.-byteOffset bytes) (.-byteLength bytes))
                  str-len (.getUint32 dv 3 true)]
              (keyword (decode-text (.subarray bytes 7 (+ 7 str-len)))))

            (== tag FAST_TAG_KEYWORD_NS_SHORT)
            (let [ns-len (aget bytes 3)
                  ns-str (decode-text (.subarray bytes 4 (+ 4 ns-len)))
                  name-len (aget bytes (+ 4 ns-len))
                  name-str (decode-text (.subarray bytes (+ 5 ns-len) (+ 5 ns-len name-len)))]
              (keyword ns-str name-str))

            (== tag FAST_TAG_KEYWORD_NS_LONG)
            (let [dv (js/DataView. (.-buffer bytes) (.-byteOffset bytes) (.-byteLength bytes))
                  ns-len (.getUint32 dv 3 true)
                  ns-str (decode-text (.subarray bytes 7 (+ 7 ns-len)))
                  name-len (.getUint32 dv (+ 7 ns-len) true)
                  name-str (decode-text (.subarray bytes (+ 11 ns-len) (+ 11 ns-len name-len)))]
              (keyword ns-str name-str))

            (== tag FAST_TAG_UUID)
            (let [hex-chars (array)]
              (dotimes [i 16]
                (let [b (aget bytes (+ 3 i))
                      hi (unsigned-bit-shift-right b 4)
                      lo (bit-and b 0xf)]
                  (.push hex-chars (.toString hi 16))
                  (.push hex-chars (.toString lo 16))
                  (when (or (== i 3) (== i 5) (== i 7) (== i 9))
                    (.push hex-chars "-"))))
              (uuid (.join hex-chars "")))

            (== tag FAST_TAG_SYMBOL_SHORT)
            (let [str-len (aget bytes 3)]
              (symbol (decode-text (.subarray bytes 4 (+ 4 str-len)))))

            (== tag FAST_TAG_SYMBOL_NS_SHORT)
            (let [ns-len (aget bytes 3)
                  ns-str (decode-text (.subarray bytes 4 (+ 4 ns-len)))
                  name-len (aget bytes (+ 4 ns-len))
                  name-str (decode-text (.subarray bytes (+ 5 ns-len) (+ 5 ns-len name-len)))]
              (symbol ns-str name-str))

            (== tag FAST_TAG_DATE)
            (let [dv (js/DataView. (.-buffer bytes) (.-byteOffset bytes) (.-byteLength bytes))]
              (js/Date. (.getFloat64 dv 3 true)))

            ;; SAB pointer tags — reconstruct type wrapper from offset
            (and (>= tag FAST_TAG_SAB_MAP) (<= tag FAST_TAG_SAB_LIST))
            (let [ctor (.get sab-type-constructors tag)]
              (when ctor
                (let [dv (js/DataView. (.-buffer bytes) (.-byteOffset bytes) (.-byteLength bytes))
                      offset (.getInt32 dv 3 true)]
                  (ctor (:sab s-atom-env) offset))))

            ;; Record tag — reconstruct record from SabMap + :eve/record-tag
            (== tag FAST_TAG_RECORD)
            (let [sab-map-ctor (.get sab-type-constructors FAST_TAG_SAB_MAP)]
              (when sab-map-ctor
                (let [dv (js/DataView. (.-buffer bytes) (.-byteOffset bytes) (.-byteLength bytes))
                      offset (.getInt32 dv 3 true)
                      sab-m (sab-map-ctor (:sab s-atom-env) offset)
                      tag-str (get sab-m :eve/record-tag)]
                  (if-let [map-fn (and tag-str (.get record-ctor-by-tag tag-str))]
                    (let [field-map (dissoc (reduce-kv assoc {} sab-m) :eve/record-tag)]
                      (map-fn field-map))
                    sab-m))))

            ;; EveArray pointer — reconstruct via registered constructor
            (== tag FAST_TAG_EVE_ARRAY)
            (let [ctor (.get sab-type-constructors tag)]
              (when ctor
                (let [dv (js/DataView. (.-buffer bytes) (.-byteOffset bytes) (.-byteLength bytes))
                      block-offset (.getInt32 dv 3 true)]
                  (ctor (:sab s-atom-env) block-offset))))

            ;; Typed array — SAB pointer format (7 bytes): reconstruct from SAB
            ;; 16-byte header: [subtype:u8][reserved:7][byte-len:u32LE][reserved:4][data at +16]
            ;; Transaction-aware deserialization:
            ;; - In transaction (*parent-atom* bound): return mutable view into SAB
            ;; - Outside transaction: copy bytes to fresh ArrayBuffer (immutable)
            ;; Data is always 16-byte aligned (SIMD-ready), so no alignment check needed.
            (== tag FAST_TAG_TYPED_ARRAY)
            (let [data-len (.-byteLength bytes)]
              (if (== data-len 7)
                ;; SAB pointer format (16-byte header)
                (let [dv (js/DataView. (.-buffer bytes) (.-byteOffset bytes) (.-byteLength bytes))
                      sab-offset (.getInt32 dv 3 true)
                      ;; Get SAB from s-atom-env or fall back to *parent-atom*
                      sab-u8 (or (:data-view s-atom-env)
                                 (when-let [^js parent d/*parent-atom*]
                                   (let [env (.-s-atom-env ^js (or (.-parent-atom-domain parent) parent))]
                                     (:data-view env))))]
                  (when sab-u8
                    (let [sab (.-buffer sab-u8)
                          sab-dv (js/DataView. sab)
                          subtype (.getUint8 sab-dv sab-offset)
                          byte-len (.getUint32 sab-dv (+ sab-offset 8) true)  ;; byte-len at offset+8
                          data-start (+ sab-offset 16)  ;; data at offset+16
                          in-transaction? (some? d/*parent-atom*)]
                      (if in-transaction?
                        ;; In transaction: return mutable view directly into SAB (always aligned)
                        (case subtype
                          0x01 (js/Uint8Array. sab data-start byte-len)
                          0x02 (js/Int8Array. sab data-start byte-len)
                          0x03 (js/Uint8ClampedArray. sab data-start byte-len)
                          0x04 (js/Int16Array. sab data-start (/ byte-len 2))
                          0x05 (js/Uint16Array. sab data-start (/ byte-len 2))
                          0x06 (js/Int32Array. sab data-start (/ byte-len 4))
                          0x07 (js/Uint32Array. sab data-start (/ byte-len 4))
                          0x08 (js/Float32Array. sab data-start (/ byte-len 4))
                          0x09 (js/Float64Array. sab data-start (/ byte-len 8))
                          0x0A (when (exists? js/BigInt64Array) (js/BigInt64Array. sab data-start (/ byte-len 8)))
                          0x0B (when (exists? js/BigUint64Array) (js/BigUint64Array. sab data-start (/ byte-len 8)))
                          nil)
                        ;; Outside transaction: copy bytes to fresh ArrayBuffer
                        (let [src (.subarray sab-u8 data-start (+ data-start byte-len))
                              dst (js/Uint8Array. byte-len)]
                          (.set dst src)
                          (let [ab (.-buffer dst)]
                            (case subtype
                              0x01 (js/Uint8Array. ab)
                              0x02 (js/Int8Array. ab)
                              0x03 (js/Uint8ClampedArray. ab)
                              0x04 (js/Int16Array. ab)
                              0x05 (js/Uint16Array. ab)
                              0x06 (js/Int32Array. ab)
                              0x07 (js/Uint32Array. ab)
                              0x08 (js/Float32Array. ab)
                              0x09 (js/Float64Array. ab)
                              0x0A (when (exists? js/BigInt64Array) (js/BigInt64Array. ab))
                              0x0B (when (exists? js/BigUint64Array) (js/BigUint64Array. ab))
                              nil)))))))
                ;; Inline format (8+N bytes) — not currently used in deserialize-element path
                nil))

            :else
            ;; Unknown tag — unsupported
            nil))
        ;; No magic prefix — unsupported legacy format
        nil))))

;;-----------------------------------------------------------------------------
;; Zero-copy deserialization from SAB DataView (Phase 6 atom optimization)
;;-----------------------------------------------------------------------------

(defn deserialize-from-dv
  "Zero-copy deserialization: reads directly from a js/DataView at the given
   offset+length without creating intermediate Uint8Array copies.
   Handles all fast-path types inline — no allocation for numeric types,
   subarray views (not copies) for string/keyword types.
   For SAB pointer types (map/set/vec/list), constructs the wrapper directly
   from the DataView bytes — true O(1) deref."
  [s-atom-env ^js dv data-offset data-len]
  (if (zero? data-len)
    nil
    (if (and (>= data-len 3)
             (== (.getUint8 dv data-offset) d/DIRECT_MAGIC_0)
             (== (.getUint8 dv (+ data-offset 1)) d/DIRECT_MAGIC_1))
      (let [tag (.getUint8 dv (+ data-offset 2))
            off data-offset]
        (cond
          ;; Boolean — no read needed
          (== tag FAST_TAG_FALSE) false
          (== tag FAST_TAG_TRUE) true

          ;; Numeric — single DataView read, zero allocation
          (== tag FAST_TAG_INT32)
          (.getInt32 dv (+ off 3) true)

          (== tag FAST_TAG_INT64)
          (js/Number (.getBigInt64 dv (+ off 3) true))

          (== tag FAST_TAG_FLOAT64)
          (.getFloat64 dv (+ off 3) true)

          ;; String — subarray view (no copy), TextDecoder
          (== tag FAST_TAG_STRING_SHORT)
          (let [str-len (.getUint8 dv (+ off 3))
                u8 (:data-view s-atom-env)]
            (decode-text (.subarray u8 (+ off 4) (+ off 4 str-len))))

          (== tag FAST_TAG_STRING_LONG)
          (let [str-len (.getUint32 dv (+ off 3) true)
                u8 (:data-view s-atom-env)]
            (decode-text (.subarray u8 (+ off 7) (+ off 7 str-len))))

          ;; Keyword — cached by SAB offset (immutable HAMT nodes never change)
          (== tag FAST_TAG_KEYWORD_SHORT)
          (or (.get kw-deser-cache off)
              (let [str-len (.getUint8 dv (+ off 3))
                    u8 (:data-view s-atom-env)
                    kw (keyword (decode-text (.subarray u8 (+ off 4) (+ off 4 str-len))))]
                (when (>= (.-size kw-deser-cache) KW_DESER_CACHE_MAX) (.clear kw-deser-cache))
                (.set kw-deser-cache off kw)
                kw))

          (== tag FAST_TAG_KEYWORD_LONG)
          (or (.get kw-deser-cache off)
              (let [str-len (.getUint32 dv (+ off 3) true)
                    u8 (:data-view s-atom-env)
                    kw (keyword (decode-text (.subarray u8 (+ off 7) (+ off 7 str-len))))]
                (when (>= (.-size kw-deser-cache) KW_DESER_CACHE_MAX) (.clear kw-deser-cache))
                (.set kw-deser-cache off kw)
                kw))

          (== tag FAST_TAG_KEYWORD_NS_SHORT)
          (or (.get kw-deser-cache off)
              (let [ns-len (.getUint8 dv (+ off 3))
                    u8 (:data-view s-atom-env)
                    ns-str (decode-text (.subarray u8 (+ off 4) (+ off 4 ns-len)))
                    name-len (.getUint8 dv (+ off 4 ns-len))
                    name-str (decode-text (.subarray u8 (+ off 5 ns-len) (+ off 5 ns-len name-len)))
                    kw (keyword ns-str name-str)]
                (when (>= (.-size kw-deser-cache) KW_DESER_CACHE_MAX) (.clear kw-deser-cache))
                (.set kw-deser-cache off kw)
                kw))

          (== tag FAST_TAG_KEYWORD_NS_LONG)
          (or (.get kw-deser-cache off)
              (let [ns-len (.getUint32 dv (+ off 3) true)
                    u8 (:data-view s-atom-env)
                    ns-str (decode-text (.subarray u8 (+ off 7) (+ off 7 ns-len)))
                    name-len (.getUint32 dv (+ off 7 ns-len) true)
                    name-str (decode-text (.subarray u8 (+ off 11 ns-len) (+ off 11 ns-len name-len)))
                    kw (keyword ns-str name-str)]
                (when (>= (.-size kw-deser-cache) KW_DESER_CACHE_MAX) (.clear kw-deser-cache))
                (.set kw-deser-cache off kw)
                kw))

          ;; Symbol
          (== tag FAST_TAG_SYMBOL_SHORT)
          (let [str-len (.getUint8 dv (+ off 3))
                u8 (:data-view s-atom-env)]
            (symbol (decode-text (.subarray u8 (+ off 4) (+ off 4 str-len)))))

          (== tag FAST_TAG_SYMBOL_NS_SHORT)
          (let [ns-len (.getUint8 dv (+ off 3))
                u8 (:data-view s-atom-env)
                ns-str (decode-text (.subarray u8 (+ off 4) (+ off 4 ns-len)))
                name-len (.getUint8 dv (+ off 4 ns-len))
                name-str (decode-text (.subarray u8 (+ off 5 ns-len) (+ off 5 ns-len name-len)))]
            (symbol ns-str name-str))

          ;; UUID — read bytes directly from u8 view
          (== tag FAST_TAG_UUID)
          (let [u8 (:data-view s-atom-env)
                hex-chars (array)]
            (dotimes [i 16]
              (let [b (aget u8 (+ off 3 i))
                    hi (unsigned-bit-shift-right b 4)
                    lo (bit-and b 0xf)]
                (.push hex-chars (.toString hi 16))
                (.push hex-chars (.toString lo 16))
                (when (or (== i 3) (== i 5) (== i 7) (== i 9))
                  (.push hex-chars "-"))))
            (uuid (.join hex-chars "")))

          ;; Date
          (== tag FAST_TAG_DATE)
          (js/Date. (.getFloat64 dv (+ off 3) true))

          ;; SAB pointer tags — direct constructor
          (and (>= tag FAST_TAG_SAB_MAP) (<= tag FAST_TAG_SAB_LIST))
          (let [ctor (.get sab-type-constructors tag)]
            (when ctor
              (let [instance-offset (.getInt32 dv (+ off 3) true)]
                (ctor (:sab s-atom-env) instance-offset))))

          ;; Record tag
          (== tag FAST_TAG_RECORD)
          (let [sab-map-ctor (.get sab-type-constructors FAST_TAG_SAB_MAP)]
            (when sab-map-ctor
              (let [instance-offset (.getInt32 dv (+ off 3) true)
                    sab-m (sab-map-ctor (:sab s-atom-env) instance-offset)
                    tag-str (get sab-m :eve/record-tag)]
                (if-let [map-fn (and tag-str (.get record-ctor-by-tag tag-str))]
                  (let [field-map (dissoc (reduce-kv assoc {} sab-m) :eve/record-tag)]
                    (map-fn field-map))
                  sab-m))))

          ;; Typed array — SAB pointer or inline blob.
          ;; Format 1 (SAB pointer, 7 bytes): [magic][magic][tag][sab-offset:i32]
          ;;   At sab-offset (16-byte header): [subtype:u8][reserved:7][byte-len:u32LE][reserved:4][data at +16]
          ;; Format 2 (inline, 8+N bytes): [magic][magic][tag][subtype:u8][byte-len:u32LE][bytes...]
          ;;
          ;; Transaction-aware deserialization:
          ;; - In transaction (*parent-atom* bound): return mutable view into SAB
          ;; - Outside transaction: copy bytes to fresh ArrayBuffer (immutable)
          ;; Data is always 16-byte aligned (SIMD-ready), so no alignment check needed.
          (== tag FAST_TAG_TYPED_ARRAY)
          (if (== data-len 7)
            ;; SAB pointer format (16-byte header)
            (let [sab-offset (.getInt32 dv (+ off 3) true)
                  u8 (:data-view s-atom-env)
                  sab (.-buffer u8)
                  subtype (.getUint8 dv sab-offset)
                  byte-len (.getUint32 dv (+ sab-offset 8) true)  ;; byte-len at offset+8
                  data-start (+ sab-offset 16)  ;; data at offset+16
                  in-transaction? (some? d/*parent-atom*)]
              (if in-transaction?
                ;; In transaction: return mutable view directly into SAB (always aligned)
                (case subtype
                  0x01 (js/Uint8Array. sab data-start byte-len)
                  0x02 (js/Int8Array. sab data-start byte-len)
                  0x03 (js/Uint8ClampedArray. sab data-start byte-len)
                  0x04 (js/Int16Array. sab data-start (/ byte-len 2))
                  0x05 (js/Uint16Array. sab data-start (/ byte-len 2))
                  0x06 (js/Int32Array. sab data-start (/ byte-len 4))
                  0x07 (js/Uint32Array. sab data-start (/ byte-len 4))
                  0x08 (js/Float32Array. sab data-start (/ byte-len 4))
                  0x09 (js/Float64Array. sab data-start (/ byte-len 8))
                  0x0A (when (exists? js/BigInt64Array) (js/BigInt64Array. sab data-start (/ byte-len 8)))
                  0x0B (when (exists? js/BigUint64Array) (js/BigUint64Array. sab data-start (/ byte-len 8)))
                  nil)
                ;; Outside transaction: copy bytes to fresh ArrayBuffer
                (let [src (.subarray u8 data-start (+ data-start byte-len))
                      dst (js/Uint8Array. byte-len)]
                  (.set dst src)
                  (let [ab (.-buffer dst)]
                    (case subtype
                      0x01 (js/Uint8Array. ab)
                      0x02 (js/Int8Array. ab)
                      0x03 (js/Uint8ClampedArray. ab)
                      0x04 (js/Int16Array. ab)
                      0x05 (js/Uint16Array. ab)
                      0x06 (js/Int32Array. ab)
                      0x07 (js/Uint32Array. ab)
                      0x08 (js/Float32Array. ab)
                      0x09 (js/Float64Array. ab)
                      0x0A (when (exists? js/BigInt64Array) (js/BigInt64Array. ab))
                      0x0B (when (exists? js/BigUint64Array) (js/BigUint64Array. ab))
                      dst)))))
            ;; Inline format: [magic][magic][tag][subtype:u8][byte-len:u32LE][bytes...]
            ;; Inline format is always copied (no SAB backing, legacy/bootstrap only)
            (let [subtype (.getUint8 dv (+ off 3))
                  byte-len (.getUint32 dv (+ off 4) true)
                  u8 (:data-view s-atom-env)
                  src (.subarray u8 (+ off 8) (+ off 8 byte-len))
                  dst (js/Uint8Array. byte-len)]
              (.set dst src)
              (let [ab (.-buffer dst)]
                (case subtype
                  0x01 (js/Uint8Array. ab)
                  0x02 (js/Int8Array. ab)
                  0x03 (js/Uint8ClampedArray. ab)
                  0x04 (js/Int16Array. ab)
                  0x05 (js/Uint16Array. ab)
                  0x06 (js/Int32Array. ab)
                  0x07 (js/Uint32Array. ab)
                  0x08 (js/Float32Array. ab)
                  0x09 (js/Float64Array. ab)
                  0x0A (when (exists? js/BigInt64Array) (js/BigInt64Array. ab))
                  0x0B (when (exists? js/BigUint64Array) (js/BigUint64Array. ab))
                  dst))))

          ;; EveArray pointer — live SAB-backed array (zero-copy reconstruct)
          (== tag FAST_TAG_EVE_ARRAY)
          (let [ctor (.get sab-type-constructors tag)]
            (when ctor
              (let [block-offset (.getInt32 dv (+ off 3) true)]
                (ctor (:sab s-atom-env) block-offset))))

          :else nil))
      ;; No magic prefix — unsupported legacy format
      nil)))

;;-----------------------------------------------------------------------------
;; Disposal helper for memory management
;;-----------------------------------------------------------------------------

(defn dispose-sab-value!
  "Dispose a deserialized SAB value, freeing its SAB memory.
   No-op for primitives and non-SAB values.
   Used by atom swap to clean up old state after CAS."
  [value s-atom-env]
  (when (satisfies? d/ISabStorable value)
    (d/-sab-dispose value s-atom-env)))
