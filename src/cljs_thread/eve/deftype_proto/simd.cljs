(ns cljs-thread.eve.deftype-proto.simd
  "SIMD-optimized utilities for SAB operations.

   Provides WebAssembly-accelerated implementations of:
   - popcount32: Count set bits in 32-bit integer
   - memcmp: Compare byte arrays
   - memcpy: Copy byte arrays

   Falls back to pure JS implementations when WASM/SIMD unavailable.")

;;-----------------------------------------------------------------------------
;; WASM Module (inline bytes)
;;-----------------------------------------------------------------------------

;; Minimal WASM module with popcount and memory operations
;; Built from WAT:
;; (module
;;   (memory (export "mem") 1)
;;
;;   (func (export "popcnt32") (param $x i32) (result i32)
;;     local.get $x
;;     i32.popcnt)
;;
;;   (func (export "memcmp") (param $p1 i32) (param $p2 i32) (param $len i32) (result i32)
;;     (local $i i32)
;;     (local.set $i (i32.const 0))
;;     (block $done
;;       (loop $loop
;;         (br_if $done (i32.ge_u (local.get $i) (local.get $len)))
;;         (if (i32.ne
;;               (i32.load8_u (i32.add (local.get $p1) (local.get $i)))
;;               (i32.load8_u (i32.add (local.get $p2) (local.get $i))))
;;           (then (return (i32.const 1))))
;;         (local.set $i (i32.add (local.get $i) (i32.const 1)))
;;         (br $loop)))
;;     (i32.const 0))
;;
;;   (func (export "memcpy") (param $dst i32) (param $src i32) (param $len i32)
;;     (local $i i32)
;;     (local.set $i (i32.const 0))
;;     (block $done
;;       (loop $loop
;;         (br_if $done (i32.ge_u (local.get $i) (local.get $len)))
;;         (i32.store8
;;           (i32.add (local.get $dst) (local.get $i))
;;           (i32.load8_u (i32.add (local.get $src) (local.get $i))))
;;         (local.set $i (i32.add (local.get $i) (i32.const 1)))
;;         (br $loop)))))

(def ^:private wasm-bytes
  (js/Uint8Array.
   #js [0x00 0x61 0x73 0x6d  ;; magic
        0x01 0x00 0x00 0x00  ;; version 1

        ;; Type section (1)
        0x01 0x0f            ;; section id=1, size=15
        0x03                 ;; 3 types
        0x60 0x01 0x7f 0x01 0x7f  ;; (i32) -> i32
        0x60 0x03 0x7f 0x7f 0x7f 0x01 0x7f  ;; (i32,i32,i32) -> i32
        0x60 0x03 0x7f 0x7f 0x7f 0x00       ;; (i32,i32,i32) -> ()

        ;; Function section (3)
        0x03 0x04            ;; section id=3, size=4
        0x03                 ;; 3 functions
        0x00 0x01 0x02       ;; types: 0, 1, 2

        ;; Memory section (5)
        0x05 0x03            ;; section id=5, size=3
        0x01                 ;; 1 memory
        0x00 0x01            ;; min=0, max=1 page

        ;; Export section (7)
        0x07 0x1d            ;; section id=7, size=29
        0x04                 ;; 4 exports
        0x03 0x6d 0x65 0x6d 0x02 0x00  ;; "mem" memory 0
        0x07 0x70 0x6f 0x70 0x63 0x6e 0x74 0x33 0x32 0x00 0x00  ;; "popcnt32" func 0
        0x06 0x6d 0x65 0x6d 0x63 0x6d 0x70 0x00 0x01  ;; "memcmp" func 1
        0x06 0x6d 0x65 0x6d 0x63 0x70 0x79 0x00 0x02  ;; "memcpy" func 2

        ;; Code section (10)
        0x0a 0x3b            ;; section id=10, size=59
        0x03                 ;; 3 functions

        ;; popcnt32
        0x04                 ;; body size=4
        0x00                 ;; 0 locals
        0x20 0x00            ;; local.get 0
        0x69                 ;; i32.popcnt
        0x0b                 ;; end

        ;; memcmp - compare p1[0..len] with p2[0..len]
        0x1c                 ;; body size=28
        0x01 0x01 0x7f       ;; 1 local of type i32
        0x41 0x00            ;; i32.const 0
        0x21 0x03            ;; local.set 3 (i=0)
        0x02 0x40            ;; block
        0x03 0x40            ;; loop
        0x20 0x03            ;; local.get 3 (i)
        0x20 0x02            ;; local.get 2 (len)
        0x4d                 ;; i32.ge_u
        0x0d 0x01            ;; br_if 1 (done)
        0x20 0x00            ;; local.get 0 (p1)
        0x20 0x03            ;; local.get 3 (i)
        0x6a                 ;; i32.add
        0x2d 0x00 0x00       ;; i32.load8_u
        0x20 0x01            ;; local.get 1 (p2)
        0x20 0x03            ;; local.get 3 (i)
        0x6a                 ;; i32.add
        0x2d 0x00 0x00       ;; i32.load8_u
        0x47                 ;; i32.ne
        0x04 0x40            ;; if
        0x41 0x01            ;; i32.const 1
        0x0f                 ;; return
        0x0b                 ;; end if
        0x20 0x03            ;; local.get 3
        0x41 0x01            ;; i32.const 1
        0x6a                 ;; i32.add
        0x21 0x03            ;; local.set 3
        0x0c 0x00            ;; br 0
        0x0b                 ;; end loop
        0x0b                 ;; end block
        0x41 0x00            ;; i32.const 0
        0x0b                 ;; end

        ;; memcpy - copy src[0..len] to dst[0..len]
        0x16                 ;; body size=22
        0x01 0x01 0x7f       ;; 1 local of type i32
        0x41 0x00            ;; i32.const 0
        0x21 0x03            ;; local.set 3 (i=0)
        0x02 0x40            ;; block
        0x03 0x40            ;; loop
        0x20 0x03            ;; local.get 3 (i)
        0x20 0x02            ;; local.get 2 (len)
        0x4d                 ;; i32.ge_u
        0x0d 0x01            ;; br_if 1 (done)
        0x20 0x00            ;; local.get 0 (dst)
        0x20 0x03            ;; local.get 3 (i)
        0x6a                 ;; i32.add
        0x20 0x01            ;; local.get 1 (src)
        0x20 0x03            ;; local.get 3 (i)
        0x6a                 ;; i32.add
        0x2d 0x00 0x00       ;; i32.load8_u
        0x3a 0x00 0x00       ;; i32.store8
        0x20 0x03            ;; local.get 3
        0x41 0x01            ;; i32.const 1
        0x6a                 ;; i32.add
        0x21 0x03            ;; local.set 3
        0x0c 0x00            ;; br 0
        0x0b                 ;; end loop
        0x0b                 ;; end block
        0x0b                 ;; end
        ]))

;;-----------------------------------------------------------------------------
;; WASM Instance
;;-----------------------------------------------------------------------------

(def ^:private wasm-instance
  (atom nil))

(def ^:private wasm-memory
  (atom nil))

(defn- init-wasm! []
  (when (nil? @wasm-instance)
    (try
      (let [module (js/WebAssembly.Module. wasm-bytes)
            instance (js/WebAssembly.Instance. module)]
        (reset! wasm-instance instance)
        (reset! wasm-memory (.-mem (.-exports instance)))
        true)
      (catch :default _
        false))))

;; Initialize on load
(init-wasm!)

;;-----------------------------------------------------------------------------
;; Pure JS Fallbacks
;;-----------------------------------------------------------------------------

(defn- js-popcount32 [n]
  (let [n (- n (bit-and (unsigned-bit-shift-right n 1) 0x55555555))
        n (+ (bit-and n 0x33333333) (bit-and (unsigned-bit-shift-right n 2) 0x33333333))
        n (bit-and (+ n (unsigned-bit-shift-right n 4)) 0x0f0f0f0f)
        n (+ n (unsigned-bit-shift-right n 8))
        n (+ n (unsigned-bit-shift-right n 16))]
    (bit-and n 0x3f)))

(defn- js-memcmp
  "Compare two Uint8Arrays. Returns 0 if equal, non-zero otherwise."
  [^js a ^js b]
  (let [len-a (.-length a)
        len-b (.-length b)]
    (if (not= len-a len-b)
      1
      (loop [i 0]
        (if (>= i len-a)
          0
          (if (not= (aget a i) (aget b i))
            1
            (recur (inc i))))))))

(defn- js-bytes-equal?
  "Check if two byte arrays are equal.
   Benchmark-optimized: simple loop for <128 bytes, 32-bit for larger.
   DataView creation overhead makes 32-bit slower for small arrays."
  [^js a ^js b]
  (let [len-a (.-length a)
        len-b (.-length b)]
    (if (not= len-a len-b)
      false
      (if (< len-a 128)
        ;; Small-medium arrays: simple byte comparison is fastest
        ;; (DataView creation overhead hurts 32-bit approach)
        (loop [i 0]
          (if (>= i len-a)
            true
            (if (not= (aget a i) (aget b i))
              false
              (recur (inc i)))))
        ;; Large arrays (128+ bytes): 32-bit words amortize DataView cost
        (let [dv-a (js/DataView. (.-buffer a) (.-byteOffset a) len-a)
              dv-b (js/DataView. (.-buffer b) (.-byteOffset b) len-b)
              full-words (unsigned-bit-shift-right len-a 2)]
          (loop [i 0]
            (if (>= i full-words)
              ;; Check remaining bytes
              (loop [j (* full-words 4)]
                (if (>= j len-a)
                  true
                  (if (== (aget a j) (aget b j))
                    (recur (inc j))
                    false)))
              ;; Compare 4 bytes at a time
              (let [off (* i 4)]
                (if (== (.getUint32 dv-a off true) (.getUint32 dv-b off true))
                  (recur (inc i))
                  false)))))))))

;;-----------------------------------------------------------------------------
;; WASM-accelerated implementations
;; NOTE: These are kept for future SIMD optimization. Currently the pure JS
;; implementations are faster due to WASM call/copy overhead for small inputs.
;;-----------------------------------------------------------------------------

(defn- _wasm-popcount32 [n]
  (if-let [^js inst @wasm-instance]
    (.popcnt32 (.-exports inst) n)
    (js-popcount32 n)))

(defn- wasm-memcmp
  "Compare two Uint8Arrays using WASM memory."
  [^js a ^js b]
  (if-let [^js inst @wasm-instance]
    (let [len-a (.-length a)
          len-b (.-length b)]
      (if (not= len-a len-b)
        1
        (if (zero? len-a)
          0
          (let [mem @wasm-memory
                mem-buffer (.-buffer mem)
                u8 (js/Uint8Array. mem-buffer)]
            ;; Copy a to offset 0, b to offset len-a
            (.set u8 a 0)
            (.set u8 b len-a)
            (.memcmp (.-exports inst) 0 len-a len-a)))))
    (js-memcmp a b)))

(defn- _wasm-bytes-equal?
  "Check if two byte arrays are equal using WASM."
  [^js a ^js b]
  (zero? (wasm-memcmp a b)))

;;-----------------------------------------------------------------------------
;; Public API
;;-----------------------------------------------------------------------------

(def wasm-available?
  "True if WASM acceleration is available."
  (some? @wasm-instance))

(defn popcount32
  "Count set bits in a 32-bit integer.
   Uses optimized pure JS implementation (WASM overhead not worth it for single i32)."
  [n]
  ;; Pure JS is faster than WASM for single i32 due to call overhead
  (js-popcount32 n))

(defn memcmp
  "Compare two Uint8Arrays. Returns 0 if equal, non-zero otherwise.
   Uses WASM memory operations when available."
  [^js a ^js b]
  (if @wasm-instance
    (wasm-memcmp a b)
    (js-memcmp a b)))

(defn bytes-equal?
  "Fast binary comparison of two byte arrays.
   Uses optimized pure JS (WASM copy overhead negates benefits)."
  [^js a ^js b]
  ;; Pure JS with 32-bit word comparison is faster than copying to WASM memory
  (js-bytes-equal? a b))

;; For direct SAB comparison without copying
(defn sab-bytes-equal?
  "Compare bytes directly from SharedArrayBuffer.
   Benchmark: faster for <64 bytes (avoids Uint8Array allocation),
   but for larger sizes, extract+compare is faster."
  [^js sab offset1 len1 offset2 len2]
  (if (not= len1 len2)
    false
    (if (zero? len1)
      true
      (if (< len1 64)
        ;; Small sizes: direct comparison avoids allocation overhead
        (let [u8 (js/Uint8Array. sab)]
          (loop [i 0]
            (if (>= i len1)
              true
              (if (not= (aget u8 (+ offset1 i)) (aget u8 (+ offset2 i)))
                false
                (recur (inc i))))))
        ;; Larger sizes: extract to views (typed array methods are optimized)
        (let [a (js/Uint8Array. sab offset1 len1)
              b (js/Uint8Array. sab offset2 len2)]
          (js-bytes-equal? a b))))))

(defn sab-memcmp
  "Compare bytes from two SAB regions.
   Returns 0 if equal, non-zero otherwise."
  [^js sab offset1 len1 offset2 len2]
  (if (not= len1 len2)
    1
    (if (zero? len1)
      0
      (let [u8 (js/Uint8Array. sab)]
        (loop [i 0]
          (if (>= i len1)
            0
            (let [b1 (aget u8 (+ offset1 i))
                  b2 (aget u8 (+ offset2 i))]
              (if (not= b1 b2)
                (if (< b1 b2) -1 1)
                (recur (inc i))))))))))

;;-----------------------------------------------------------------------------
;; Batch Operations (SIMD-friendly patterns)
;;-----------------------------------------------------------------------------
;; These operations are designed to amortize call overhead by processing
;; multiple items at once. True SIMD acceleration requires either:
;; 1. WebAssembly SIMD with direct SAB access (future)
;; 2. Enough data per call to justify copy overhead

(defn batch-popcount32
  "Count set bits in multiple 32-bit integers.
   Returns array of counts. More efficient than individual calls for n >= 8."
  [^js int32-array]
  (let [n (.-length int32-array)
        result (js/Uint8Array. n)]
    (dotimes [i n]
      (aset result i (js-popcount32 (aget int32-array i))))
    result))

(defn batch-bytes-equal?
  "Compare target against multiple candidates.
   Returns index of first match, or -1 if none.

   candidates: array of Uint8Arrays to compare against target

   This batched approach enables future SIMD optimization:
   - Load 16 bytes of target once
   - Compare against 16 bytes of each candidate in parallel
   - Use SIMD mask to find matches"
  [^js target ^js candidates]
  (let [target-len (.-length target)
        n (.-length candidates)]
    (loop [i 0]
      (if (>= i n)
        -1
        (let [candidate (aget candidates i)]
          (if (and (== (.-length candidate) target-len)
                   (js-bytes-equal? target candidate))
            i
            (recur (inc i))))))))

(defn batch-hash-lookup
  "Find which hash matches target in a batch.
   Returns index of match or -1.

   Optimized for collision node search where we have
   multiple entries with the same prefix hash."
  [target-hash ^js hash-array]
  (let [n (.-length hash-array)]
    ;; For small arrays, linear scan is fine
    ;; For larger arrays (8+), binary search or SIMD would help
    (loop [i 0]
      (if (>= i n)
        -1
        (if (== target-hash (aget hash-array i))
          i
          (recur (inc i)))))))

;;-----------------------------------------------------------------------------
;; SIMD-Ready Data Layout Helpers
;;-----------------------------------------------------------------------------
;; These helpers support future SIMD optimization by ensuring proper alignment

(def ^:const SIMD_ALIGN 16)  ;; 128-bit SIMD vector alignment

(defn align-up
  "Round up to next SIMD-friendly alignment boundary."
  [n]
  (bit-and (+ n (dec SIMD_ALIGN)) (bit-not (dec SIMD_ALIGN))))

(defn is-aligned?
  "Check if offset is SIMD-aligned."
  [offset]
  (zero? (bit-and offset (dec SIMD_ALIGN))))
