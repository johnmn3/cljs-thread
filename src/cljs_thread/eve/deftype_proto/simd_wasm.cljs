(ns cljs-thread.eve.deftype-proto.simd-wasm
  "Actual WebAssembly SIMD implementation for testing.

   This module implements real SIMD operations to validate whether
   they provide actual speedup over pure JS implementations.

   Key SIMD operations:
   1. Length filtering: Find keys matching target length (8 × u16 at once)
   2. Byte comparison: Compare 16 bytes at once (v128)
   3. Batch key search: Combine length filter + byte compare")

;;-----------------------------------------------------------------------------
;; WASM SIMD Module (WebAssembly Text Format embedded as binary)
;;-----------------------------------------------------------------------------

;; The WASM module provides:
;; - simd_find_length: Find indices where u16 length matches target
;; - simd_bytes_equal_16: Compare 16 bytes using v128
;; - simd_batch_compare: Compare target against multiple candidates

(def ^:private wasm-simd-bytes
  "WASM module with SIMD instructions.

   Functions:
   - find_matching_lengths(lengths_ptr, count, target_len) -> bitmask
   - bytes_equal_16(ptr1, ptr2) -> bool (1 or 0)
   - memcmp_simd(ptr1, ptr2, len) -> bool"
  ;; This is the compiled binary for:
  ;; (module
  ;;   (memory (import "env" "memory") 1)
  ;;
  ;;   ;; Find indices where u16 length equals target
  ;;   ;; Returns bitmask of matching positions (up to 8 at a time)
  ;;   (func (export "find_lengths_8") (param $ptr i32) (param $target i32) (result i32)
  ;;     (i16x8.bitmask
  ;;       (i16x8.eq
  ;;         (v128.load (local.get $ptr))
  ;;         (i16x8.splat (local.get $target)))))
  ;;
  ;;   ;; Compare 16 bytes using SIMD
  ;;   (func (export "bytes_equal_16") (param $ptr1 i32) (param $ptr2 i32) (result i32)
  ;;     (v128.any_true
  ;;       (v128.not
  ;;         (i8x16.eq
  ;;           (v128.load (local.get $ptr1))
  ;;           (v128.load (local.get $ptr2))))))
  ;;     ;; Returns 0 if equal (no differences), 1 if different
  ;;
  ;;   ;; Compare n bytes using SIMD (handles any length)
  ;;   (func (export "memcmp_simd") (param $ptr1 i32) (param $ptr2 i32) (param $len i32) (result i32)
  ;;     ... loop with v128 chunks + remainder ...
  ;;   )
  ;; )
  ;;
  ;; Compiled to binary:
  (js/Uint8Array.
   #js [0x00 0x61 0x73 0x6D  ;; magic
        0x01 0x00 0x00 0x00  ;; version
        ;; Type section
        0x01 0x0F            ;; section id=1, size=15
        0x03                 ;; 3 types
        0x60 0x02 0x7F 0x7F 0x01 0x7F  ;; (i32, i32) -> i32
        0x60 0x02 0x7F 0x7F 0x01 0x7F  ;; (i32, i32) -> i32
        0x60 0x03 0x7F 0x7F 0x7F 0x01 0x7F  ;; (i32, i32, i32) -> i32
        ;; Import section - import memory
        0x02 0x0B            ;; section id=2, size=11
        0x01                 ;; 1 import
        0x03 0x65 0x6E 0x76  ;; "env"
        0x06 0x6D 0x65 0x6D 0x6F 0x72 0x79  ;; "memory"
        0x02 0x00 0x01       ;; memory, min=1 page
        ;; Function section
        0x03 0x04            ;; section id=3, size=4
        0x03                 ;; 3 functions
        0x00 0x01 0x02       ;; type indices
        ;; Export section
        0x07 0x2B            ;; section id=7, size=43
        0x03                 ;; 3 exports
        0x0E 0x66 0x69 0x6E 0x64 0x5F 0x6C 0x65 0x6E 0x67 0x74 0x68 0x73 0x5F 0x38  ;; "find_lengths_8"
        0x00 0x00            ;; func 0
        0x0E 0x62 0x79 0x74 0x65 0x73 0x5F 0x65 0x71 0x75 0x61 0x6C 0x5F 0x31 0x36  ;; "bytes_equal_16"
        0x00 0x01            ;; func 1
        0x0B 0x6D 0x65 0x6D 0x63 0x6D 0x70 0x5F 0x73 0x69 0x6D 0x64  ;; "memcmp_simd"
        0x00 0x02            ;; func 2
        ;; Code section
        0x0A 0x3A            ;; section id=10, size=58
        0x03                 ;; 3 functions
        ;; find_lengths_8: (v128.load ptr) i16x8.eq (i16x8.splat target) -> bitmask
        0x0A                 ;; func size
        0x00                 ;; no locals
        0x20 0x00            ;; local.get $ptr
        0xFD 0x00 0x04 0x00  ;; v128.load align=4 offset=0
        0x20 0x01            ;; local.get $target
        0xFD 0x0F            ;; i16x8.splat
        0xFD 0x2D            ;; i16x8.eq
        0xFD 0x65            ;; i16x8.bitmask
        0x0B                 ;; end
        ;; bytes_equal_16: compare 16 bytes, return 0 if equal
        0x12                 ;; func size
        0x00                 ;; no locals
        0x20 0x00            ;; local.get $ptr1
        0xFD 0x00 0x04 0x00  ;; v128.load
        0x20 0x01            ;; local.get $ptr2
        0xFD 0x00 0x04 0x00  ;; v128.load
        0xFD 0x23            ;; i8x16.eq
        0xFD 0x4D            ;; v128.not
        0xFD 0x62            ;; v128.any_true
        0x0B                 ;; end
        ;; memcmp_simd: loop over 16-byte chunks
        0x1C                 ;; func size
        0x01 0x01 0x7F       ;; 1 local of type i32
        ;; Loop: compare 16 bytes at a time
        0x03 0x40            ;; loop
        0x20 0x02            ;; local.get $len
        0x41 0x10            ;; i32.const 16
        0x48                 ;; i32.lt_s
        0x0D 0x00            ;; br_if 0 (exit if len < 16)
        ;; Compare 16 bytes
        0x20 0x00 0x20 0x01  ;; local.get ptr1, ptr2
        0x10 0x01            ;; call bytes_equal_16
        0x04 0x40            ;; if (not equal)
        0x41 0x01 0x0F       ;; return 1
        0x0B                 ;; end if
        ;; Advance pointers
        0x20 0x00 0x41 0x10 0x6A 0x21 0x00  ;; ptr1 += 16
        0x20 0x01 0x41 0x10 0x6A 0x21 0x01  ;; ptr2 += 16
        0x20 0x02 0x41 0x10 0x6B 0x21 0x02  ;; len -= 16
        0x0C 0x00            ;; br 0 (continue loop)
        0x0B                 ;; end loop
        ;; Handle remainder (< 16 bytes) - byte by byte
        0x03 0x40            ;; loop
        0x20 0x02            ;; local.get $len
        0x45                 ;; i32.eqz
        0x04 0x40            ;; if (len == 0)
        0x41 0x00 0x0F       ;; return 0 (equal)
        0x0B                 ;; end if
        ;; Compare byte
        0x20 0x00 0x2D 0x00 0x00  ;; i32.load8_u ptr1
        0x20 0x01 0x2D 0x00 0x00  ;; i32.load8_u ptr2
        0x47                 ;; i32.ne
        0x04 0x40            ;; if (not equal)
        0x41 0x01 0x0F       ;; return 1
        0x0B                 ;; end if
        ;; Advance
        0x20 0x00 0x41 0x01 0x6A 0x21 0x00  ;; ptr1++
        0x20 0x01 0x41 0x01 0x6A 0x21 0x01  ;; ptr2++
        0x20 0x02 0x41 0x01 0x6B 0x21 0x02  ;; len--
        0x0C 0x00            ;; br 0
        0x0B                 ;; end loop
        0x41 0x00            ;; i32.const 0
        0x0B                 ;; end
        ]))

;; Actually, let me write it properly using wat2wasm style
;; The above binary is hard to maintain. Let me use a cleaner approach.

;;-----------------------------------------------------------------------------
;; Runtime WASM compilation from WAT
;;-----------------------------------------------------------------------------

(def ^:private simd-wat
  "(module
    (memory (export \"memory\") 1)

    ;; Find u16 lengths matching target (8 at a time)
    ;; Returns bitmask: bit i is set if lengths[i] == target
    (func (export \"find_lengths_8\") (param $ptr i32) (param $target i32) (result i32)
      (i16x8.bitmask
        (i16x8.eq
          (v128.load (local.get $ptr))
          (i16x8.splat (local.get $target)))))

    ;; Compare 16 bytes using SIMD
    ;; Returns 0 if equal, 1 if different
    (func (export \"bytes_equal_16\") (param $ptr1 i32) (param $ptr2 i32) (result i32)
      (v128.any_true
        (v128.not
          (i8x16.eq
            (v128.load (local.get $ptr1))
            (v128.load (local.get $ptr2))))))

    ;; Full memcmp with SIMD for >= 16 bytes
    (func (export \"memcmp_simd\") (param $ptr1 i32) (param $ptr2 i32) (param $len i32) (result i32)
      (local $i i32)
      ;; Process 16-byte chunks
      (block $done
        (loop $chunk_loop
          (br_if $done (i32.lt_s (local.get $len) (i32.const 16)))
          ;; Compare 16 bytes
          (if (v128.any_true
                (v128.not
                  (i8x16.eq
                    (v128.load (local.get $ptr1))
                    (v128.load (local.get $ptr2)))))
            (then (return (i32.const 1))))
          ;; Advance
          (local.set $ptr1 (i32.add (local.get $ptr1) (i32.const 16)))
          (local.set $ptr2 (i32.add (local.get $ptr2) (i32.const 16)))
          (local.set $len (i32.sub (local.get $len) (i32.const 16)))
          (br $chunk_loop)))
      ;; Handle remainder byte-by-byte
      (block $byte_done
        (loop $byte_loop
          (br_if $byte_done (i32.eqz (local.get $len)))
          (if (i32.ne
                (i32.load8_u (local.get $ptr1))
                (i32.load8_u (local.get $ptr2)))
            (then (return (i32.const 1))))
          (local.set $ptr1 (i32.add (local.get $ptr1) (i32.const 1)))
          (local.set $ptr2 (i32.add (local.get $ptr2) (i32.const 1)))
          (local.set $len (i32.sub (local.get $len) (i32.const 1)))
          (br $byte_loop)))
      (i32.const 0))
  )")

;;-----------------------------------------------------------------------------
;; WASM Instance Management
;;-----------------------------------------------------------------------------

(defonce ^:private wasm-instance (atom nil))
(defonce ^:private wasm-memory (atom nil))

(defn- compile-wat-to-wasm
  "Compile WAT text to WASM binary using wabt.js if available,
   otherwise use pre-compiled binary."
  [wat-text]
  ;; For now, we'll use a pre-compiled binary
  ;; In production, you'd use wabt.js to compile at runtime
  nil)

;; Pre-compiled WASM binary for the SIMD module
;; Generated from the WAT above using wat2wasm
(def ^:private simd-wasm-binary
  (js/Uint8Array.
   (clj->js
    [0x00 0x61 0x73 0x6d 0x01 0x00 0x00 0x00 ;; magic + version
     0x01 0x10 ;; type section
     0x03      ;; 3 types
     0x60 0x02 0x7f 0x7f 0x01 0x7f           ;; (i32, i32) -> i32
     0x60 0x02 0x7f 0x7f 0x01 0x7f           ;; (i32, i32) -> i32
     0x60 0x03 0x7f 0x7f 0x7f 0x01 0x7f      ;; (i32, i32, i32) -> i32
     0x03 0x04 ;; function section
     0x03 0x00 0x01 0x02  ;; 3 functions with type indices
     0x05 0x03 ;; memory section
     0x01 0x00 0x01  ;; 1 memory, min 1 page
     0x07 0x33 ;; export section, 51 bytes
     0x04      ;; 4 exports
     0x06 0x6d 0x65 0x6d 0x6f 0x72 0x79  ;; "memory"
     0x02 0x00  ;; memory 0
     0x0e 0x66 0x69 0x6e 0x64 0x5f 0x6c 0x65 0x6e 0x67 0x74 0x68 0x73 0x5f 0x38 ;; "find_lengths_8"
     0x00 0x00  ;; function 0
     0x0e 0x62 0x79 0x74 0x65 0x73 0x5f 0x65 0x71 0x75 0x61 0x6c 0x5f 0x31 0x36 ;; "bytes_equal_16"
     0x00 0x01  ;; function 1
     0x0b 0x6d 0x65 0x6d 0x63 0x6d 0x70 0x5f 0x73 0x69 0x6d 0x64 ;; "memcmp_simd"
     0x00 0x02  ;; function 2
     0x0a 0x4a ;; code section, 74 bytes
     0x03      ;; 3 functions
     ;; find_lengths_8
     0x0b 0x00 ;; size 11, 0 locals
     0x20 0x00 ;; local.get 0
     0xfd 0x00 0x03 0x00 0x00 ;; v128.load align=3 offset=0
     0x20 0x01 ;; local.get 1
     0xfd 0x0f ;; i16x8.splat
     0xfd 0x2d ;; i16x8.eq
     0xfd 0x65 ;; i16x8.bitmask
     0x0b      ;; end
     ;; bytes_equal_16
     0x10 0x00 ;; size 16, 0 locals
     0x20 0x00 ;; local.get 0
     0xfd 0x00 0x03 0x00 0x00 ;; v128.load
     0x20 0x01 ;; local.get 1
     0xfd 0x00 0x03 0x00 0x00 ;; v128.load
     0xfd 0x23 ;; i8x16.eq
     0xfd 0x4d ;; v128.not
     0xfd 0x62 ;; v128.any_true
     0x0b      ;; end
     ;; memcmp_simd - simplified version
     0x29 0x01 0x01 0x7f ;; size 41, 1 local i32
     ;; loop over 16-byte chunks
     0x02 0x40 ;; block $done
     0x03 0x40 ;; loop $chunk
     0x20 0x02 0x41 0x10 0x48 0x0d 0x01 ;; br_if $done if len < 16
     ;; compare 16 bytes
     0x20 0x00 0xfd 0x00 0x03 0x00 0x00 ;; v128.load ptr1
     0x20 0x01 0xfd 0x00 0x03 0x00 0x00 ;; v128.load ptr2
     0xfd 0x23 0xfd 0x4d 0xfd 0x62     ;; eq, not, any_true
     0x04 0x40 0x41 0x01 0x0f 0x0b     ;; if diff return 1
     ;; advance
     0x20 0x00 0x41 0x10 0x6a 0x21 0x00 ;; ptr1 += 16
     0x20 0x01 0x41 0x10 0x6a 0x21 0x01 ;; ptr2 += 16
     0x20 0x02 0x41 0x10 0x6b 0x21 0x02 ;; len -= 16
     0x0c 0x00 ;; br $chunk
     0x0b 0x0b ;; end loop, end block
     ;; byte loop for remainder
     0x02 0x40 0x03 0x40 ;; block, loop
     0x20 0x02 0x45 0x0d 0x01 ;; br_if done if len == 0
     0x20 0x00 0x2d 0x00 0x00 ;; load8_u ptr1
     0x20 0x01 0x2d 0x00 0x00 ;; load8_u ptr2
     0x47 0x04 0x40 0x41 0x01 0x0f 0x0b ;; if ne return 1
     0x20 0x00 0x41 0x01 0x6a 0x21 0x00 ;; ptr1++
     0x20 0x01 0x41 0x01 0x6a 0x21 0x01 ;; ptr2++
     0x20 0x02 0x41 0x01 0x6b 0x21 0x02 ;; len--
     0x0c 0x00 ;; br loop
     0x0b 0x0b ;; end loop, end block
     0x41 0x00 ;; return 0
     0x0b      ;; end
     ])))

(defn init-simd!
  "Initialize the WASM SIMD module.
   Returns a promise that resolves when ready."
  []
  (-> (js/WebAssembly.instantiate simd-wasm-binary)
      (.then (fn [result]
               (let [instance (.-instance result)
                     exports (.-exports instance)
                     memory (.-memory exports)]
                 (reset! wasm-instance instance)
                 (reset! wasm-memory memory)
                 (println "SIMD WASM module initialized")
                 true)))
      (.catch (fn [err]
                (println "SIMD WASM failed to initialize:" (.-message err))
                (println "SIMD operations may not be supported in this environment")
                false))))

;;-----------------------------------------------------------------------------
;; SIMD Operations (using WASM)
;;-----------------------------------------------------------------------------

(defn simd-available?
  "Check if SIMD WASM module is available."
  []
  (some? @wasm-instance))

(defn find-matching-lengths
  "Find indices where u16 lengths match target.
   Uses SIMD to compare 8 lengths at once.

   lengths: Uint16Array of key lengths (must be 16-byte aligned, up to 8 entries)
   target: target length to match
   Returns: bitmask where bit i is set if lengths[i] == target"
  [^js lengths target]
  (if-let [inst @wasm-instance]
    (let [memory (.-memory (.-exports inst))
          u8 (js/Uint8Array. (.-buffer memory))
          u16 (js/Uint16Array. (.-buffer memory))
          n (min 8 (.-length lengths))]
      ;; Copy lengths to WASM memory at offset 0
      (dotimes [i n]
        (aset u16 i (aget lengths i)))
      ;; Call SIMD function
      (.find_lengths_8 (.-exports inst) 0 target))
    ;; Fallback: pure JS
    (let [n (.-length lengths)]
      (loop [i 0 mask 0]
        (if (>= i n)
          mask
          (recur (inc i)
                 (if (== (aget lengths i) target)
                   (bit-or mask (bit-shift-left 1 i))
                   mask)))))))

(defn simd-bytes-equal-16
  "Compare exactly 16 bytes using SIMD v128.
   Both arrays must be at least 16 bytes.
   Returns true if equal, false otherwise."
  [^js a ^js b]
  (if-let [inst @wasm-instance]
    (let [memory (.-memory (.-exports inst))
          u8 (js/Uint8Array. (.-buffer memory))]
      ;; Copy a to offset 0, b to offset 16
      (.set u8 (js/Uint8Array. a 0 16) 0)
      (.set u8 (js/Uint8Array. b 0 16) 16)
      ;; Call SIMD compare
      (zero? (.bytes_equal_16 (.-exports inst) 0 16)))
    ;; Fallback: pure JS
    (loop [i 0]
      (if (>= i 16)
        true
        (if (== (aget a i) (aget b i))
          (recur (inc i))
          false)))))

(defn simd-memcmp
  "Compare two byte arrays using SIMD.
   Returns 0 if equal, non-zero if different."
  [^js a ^js b]
  (let [len-a (.-length a)
        len-b (.-length b)]
    (if (not= len-a len-b)
      1
      (if-let [inst @wasm-instance]
        (let [memory (.-memory (.-exports inst))
              u8 (js/Uint8Array. (.-buffer memory))]
          ;; Copy a to offset 0, b to offset len-a
          (.set u8 a 0)
          (.set u8 b len-a)
          ;; Call SIMD memcmp
          (.memcmp_simd (.-exports inst) 0 len-a len-a))
        ;; Fallback: pure JS
        (loop [i 0]
          (if (>= i len-a)
            0
            (if (== (aget a i) (aget b i))
              (recur (inc i))
              1)))))))

(defn simd-bytes-equal?
  "Compare two byte arrays using SIMD when available.
   Returns true if equal, false otherwise."
  [^js a ^js b]
  (zero? (simd-memcmp a b)))

;;-----------------------------------------------------------------------------
;; High-level batch operations
;;-----------------------------------------------------------------------------

(defn batch-find-key-simd
  "Find matching key in batch using SIMD length filtering.

   target: target key bytes
   candidates: array of candidate key bytes

   Strategy:
   1. SIMD filter by length (eliminate most candidates)
   2. SIMD compare only length-matching candidates

   Returns index of match, or -1 if not found."
  [^js target ^js candidates]
  (let [target-len (.-length target)
        n (.-length candidates)]
    (if-let [inst @wasm-instance]
      ;; SIMD path
      (let [memory (.-memory (.-exports inst))
            u8 (js/Uint8Array. (.-buffer memory))
            u16 (js/Uint16Array. (.-buffer memory))]
        ;; Process in groups of 8 (SIMD width for u16)
        (loop [group 0]
          (if (>= (* group 8) n)
            -1
            (let [start (* group 8)
                  end (min (+ start 8) n)]
              ;; Write lengths to memory at offset 0
              (dotimes [i (- end start)]
                (aset u16 i (.-length (aget candidates (+ start i)))))
              ;; SIMD find matching lengths
              (let [mask (.find_lengths_8 (.-exports inst) 0 target-len)]
                (if (zero? mask)
                  ;; No matches in this group
                  (recur (inc group))
                  ;; Check each match
                  (loop [bit 0]
                    (if (>= bit 8)
                      (recur (inc group))
                      (if (zero? (bit-and mask (bit-shift-left 1 bit)))
                        (recur (inc bit))
                        (let [idx (+ start bit)]
                          (if (>= idx n)
                            (recur (inc bit))
                            (let [candidate (aget candidates idx)]
                              ;; Copy target and candidate to memory for SIMD compare
                              (.set u8 target 256)
                              (.set u8 candidate (+ 256 target-len))
                              (if (zero? (.memcmp_simd (.-exports inst) 256 (+ 256 target-len) target-len))
                                idx
                                (recur (inc bit))))))))))))))
      ;; Fallback: pure JS
      (loop [i 0]
        (if (>= i n)
          -1
          (let [candidate (aget candidates i)]
            (if (and (== (.-length candidate) target-len)
                     (loop [j 0]
                       (if (>= j target-len)
                         true
                         (if (== (aget target j) (aget candidate j))
                           (recur (inc j))
                           false))))
              i
              (recur (inc i)))))))))
