(ns cljs-thread.eve.util
  (:require
   [cljs-thread.eve.data :as d]))

(def ^js wt-module
  (when (and (exists? js/process) (exists? js/require))
    (try (js/require "worker_threads")
         (catch :default _ nil))))
(def raw-worker-data (when wt-module (-> ^js wt-module .-workerData (js->clj :keywordize-keys true))))
(def raw-parent-port (when wt-module (.-parentPort ^js wt-module)))
(def is-main-thread?
  (cond
    wt-module (.-isMainThread ^js wt-module) ;; Node.js worker_threads
    ;; Browser: check Window constructor (immune to dom-proxy which defines
    ;; `window` property on worker globalThis but can't fake prototype chain)
    (and (exists? js/Window) (instance? js/Window js/self)) true
    :else false))

(defn yield-cpu
  "CPU-friendly yield/sleep.  On workers, uses Atomics.wait on a throwaway
   SharedArrayBuffer.  On the browser main thread Atomics.wait is forbidden
   by the spec, so this is a no-op (the waits are sub-ms yields anyway)."
  ([] (yield-cpu 0))
  ([ms]
   (when-not is-main-thread?
     (let [s (js/SharedArrayBuffer. 4)
           v (js/Int32Array. s)]
       (js/Atomics.store v 0 0)
       (js/Atomics.wait v 0 0 ms)))))

(def log? (atom false))
;; (reset! log? true) ; Uncomment for verbose logging

(defn log
  ([args]
   (when @log? (println :log args))
   args)
  ([msg & args]
   (when @log? (println :log msg (vec args)))
   (concat [msg] args)))

(defn typed-array? [x]
  (and (some? x) (js/ArrayBuffer.isView x) (not (instance? js/DataView x))))

;; --- Atomic Operations Helpers ---
(defn atomic-load-int ^number [^js ta-view ^number idx]
  ;; Debug logging for RangeError investigation
  (when (or (< idx 0) (>= idx (.-length ta-view)) (js/isNaN idx))
    (println "[DEBUG] atomic-load-int: INVALID INDEX!"
             "idx:" idx "array-length:" (.-length ta-view) "isNaN:" (js/isNaN idx))
    (println "[DEBUG] Stack trace:" (.-stack (js/Error. "Stack trace"))))
  (try
    (js/Atomics.load ta-view idx)
    (catch js/Error e
      (println "[DEBUG] atomic-load-int ERROR:" (.-message e)
               "idx:" idx "array-length:" (.-length ta-view))
      (throw e))))
(defn atomic-store-int [^js ta-view ^number idx ^number val] (js/Atomics.store ta-view idx val))
(defn atomic-add-int ^number [^js ta-view ^number idx ^number val] (js/Atomics.add ta-view idx val))
(defn atomic-sub-int ^number [^js ta-view ^number idx ^number val] (js/Atomics.sub ta-view idx val))
(defn atomic-compare-exchange-int ^number [^js ta-view ^number idx ^number expected ^number replacement]
  (js/Atomics.compareExchange ta-view idx expected replacement))

(defn atomic-compare-and-swap [^js ta-view ^number idx ^number expected ^number replacement]
  (loop [n 1000]
    (let [current-value (js/Atomics.compareExchange ta-view idx expected replacement)]
      (if (= current-value expected)
        true
        (if (= current-value replacement)
          false
          (if (zero? n)
            (do
              (println "CAS failed after 1000 attempts. Exiting.")
              false)
            (do
              (yield-cpu)
              (recur (dec n)))))))))

(defn cas [^js ta-view ^number idx afn]
  (let [expected (js/Atomics.load ta-view idx)
        replacement (afn expected)
        success (atomic-compare-and-swap ta-view idx expected replacement)]
    (if success
      replacement
      (do
        (println "CAS failed. looping.")
        (yield-cpu)
        (cas ta-view idx afn)))))

;; (def sab (js/SharedArrayBuffer. 4))
;; (def sab-view (js/Int32Array. sab))
;; sab-view
;; (atomic-compare-and-swap sab-view 0 2 3)

;; (println :hi)

(defn atomic-load-bigint ^js [^js ta-view ^number idx] (js/Atomics.load ta-view idx))
(defn atomic-store-bigint [^js ta-view ^number idx ^js val] (js/Atomics.store ta-view idx val))
(defn atomic-add-bigint ^js [^js ta-view ^number idx ^js val] (js/Atomics.add ta-view idx val))
(defn atomic-sub-bigint ^js [^js ta-view ^number idx ^js val] (js/Atomics.sub ta-view idx val))
(defn atomic-compare-exchange-bigint ^js [^js ta-view ^number idx ^js expected ^js replacement] (js/Atomics.compareExchange ta-view idx expected replacement))

(defn byte->hex [byte-val]
  (let [hex (.toString byte-val 16)]
    (if (= (count hex) 1)
      (str "0" hex)
      hex)))

(defn hex-window
  "Display a hex dump of a buffer or typed array view."
  [buffer-or-view & {:keys [offset length bytes-per-row title]
                     :or {offset 0 bytes-per-row 16}}]
  (when-not (or (instance? js/ArrayBuffer buffer-or-view)
                (instance? js/SharedArrayBuffer buffer-or-view)
                (and (some? buffer-or-view) (some? (.-buffer buffer-or-view))))
    (throw (js/Error. (str "hex-window: First argument must be an ArrayBuffer or a TypedArray view. Got: " (type buffer-or-view)))))
  (let [source-buffer (if (or (instance? js/SharedArrayBuffer buffer-or-view) (instance? js/ArrayBuffer buffer-or-view))
                        buffer-or-view
                        (.-buffer buffer-or-view))
        view-byte-offset (if (or (instance? js/SharedArrayBuffer buffer-or-view) (instance? js/ArrayBuffer buffer-or-view))
                           offset
                           (+ (or (.-byteOffset buffer-or-view) 0) offset))
        buffer-total-length (.-byteLength source-buffer)
        max-possible-length-from-offset (- buffer-total-length view-byte-offset)
        requested-display-length (if length (int length) max-possible-length-from-offset)
        view-intrinsic-length (if (or (instance? js/SharedArrayBuffer buffer-or-view) (instance? js/ArrayBuffer buffer-or-view))
                                requested-display-length
                                (.-byteLength buffer-or-view))
        effective-display-length (min requested-display-length max-possible-length-from-offset view-intrinsic-length)
        effective-display-length (max 0 effective-display-length)
        max_addr_to_display (+ view-byte-offset effective-display-length -1)]
    (when (some? title) (println (str "\n--- Hex Window: " title " ---")))
    (println (str "Buffer: " buffer-total-length " bytes, offset: " view-byte-offset
                  ", display: " effective-display-length " bytes."))
    (if (or (< view-byte-offset 0) (>= view-byte-offset buffer-total-length)
            (and (= buffer-total-length 0) (> view-byte-offset 0))
            (<= effective-display-length 0))
      (println "Invalid offset or length for buffer.")
      (let [u8-data-view (js/Uint8Array. source-buffer view-byte-offset effective-display-length)
            target_addr_hex_len (max 4 (count (.toString max_addr_to_display 16)))]
        (loop [current-idx-in-u8-view 0]
          (when (< current-idx-in-u8-view effective-display-length)
            (let [row-start-abs-offset (+ view-byte-offset current-idx-in-u8-view)
                  bytes-on-this-line (min bytes-per-row (- effective-display-length current-idx-in-u8-view))
                  hex-addr-raw (.toString row-start-abs-offset 16)
                  addr-padding-needed (max 0 (- target_addr_hex_len (count hex-addr-raw)))
                  address-str (str (apply str (repeat addr-padding-needed "0")) hex-addr-raw ": ")
                  hex-parts #js []]
              (dotimes [i bytes-per-row]
                (if (< i bytes-on-this-line)
                  (.push hex-parts (byte->hex (aget u8-data-view (+ current-idx-in-u8-view i))))
                  (.push hex-parts "  ")))
              (println (str address-str (.join hex-parts " "))))
            (recur (+ current-idx-in-u8-view bytes-per-row))))))))

(defn get-sab-total-size [index-view]
  (js/Atomics.load index-view (/ d/OFFSET_SAB_TOTAL_SIZE d/SIZE_OF_INT32)))
(defn get-index-region-size [index-view]
  (js/Atomics.load index-view (/ d/OFFSET_INDEX_REGION_SIZE d/SIZE_OF_INT32)))
(defn get-data-region-start-offset [index-view]
  (js/Atomics.load index-view (/ d/OFFSET_DATA_REGION_START d/SIZE_OF_INT32)))
(defn get-max-block-descriptors [index-view]
  (js/Atomics.load index-view (/ d/OFFSET_MAX_BLOCK_DESCRIPTORS d/SIZE_OF_INT32)))

;; Removed get-free-list-head-idx and set-free-list-head-idx! as they are not used by the scan-based allocator

(defn get-block-descriptor-base-int32-offset [descriptor-idx]
  (let [descriptors-array-start-int32-offset (/ d/OFFSET_BLOCK_DESCRIPTORS_ARRAY_START d/SIZE_OF_INT32)]
    (+ descriptors-array-start-int32-offset (* descriptor-idx (/ d/SIZE_OF_BLOCK_DESCRIPTOR d/SIZE_OF_INT32)))))

(defn read-block-descriptor-field [sab-int32-view descriptor-idx field-byte-offset-in-desc]
  (let [base-int32-offset (get-block-descriptor-base-int32-offset descriptor-idx)
        field-int32-offset (/ field-byte-offset-in-desc d/SIZE_OF_INT32)
        idx (+ base-int32-offset field-int32-offset)]
    (when (or (< idx 0) (>= idx (.-length sab-int32-view)) (js/isNaN idx))
      (println "[BUG] read-block-descriptor-field: INVALID idx=" idx
               "desc-idx=" descriptor-idx "field-off=" field-byte-offset-in-desc
               "view-len=" (.-length sab-int32-view))
      (println "[BUG] Stack:" (.-stack (js/Error. ""))))
    (js/Atomics.load sab-int32-view idx)))

(defn write-block-descriptor-field! [sab-int32-view descriptor-idx field-byte-offset-in-desc value]
  (let [base-int32-offset (get-block-descriptor-base-int32-offset descriptor-idx)
        field-int32-offset (/ field-byte-offset-in-desc d/SIZE_OF_INT32)]
    (js/Atomics.store sab-int32-view (+ base-int32-offset field-int32-offset) value)))

(defn cas-block-descriptor-field! [sab-int32-view descriptor-idx field-byte-offset-in-desc expected-old-value new-value]
  (let [base-int32-offset (get-block-descriptor-base-int32-offset descriptor-idx)
        field-int32-offset (/ field-byte-offset-in-desc d/SIZE_OF_INT32)]
    (js/Atomics.compareExchange sab-int32-view (+ base-int32-offset field-int32-offset) expected-old-value new-value)))

;; MODIFIED read-full-block-descriptor to align with current data.cljs
(defn read-full-block-descriptor [sab-int32-view descriptor-idx]
  {:idx descriptor-idx
   :status (read-block-descriptor-field sab-int32-view descriptor-idx d/OFFSET_BD_STATUS)
   :data-offset (read-block-descriptor-field sab-int32-view descriptor-idx d/OFFSET_BD_DATA_OFFSET)
   :data-length (read-block-descriptor-field sab-int32-view descriptor-idx d/OFFSET_BD_DATA_LENGTH)
   :block-capacity (read-block-descriptor-field sab-int32-view descriptor-idx d/OFFSET_BD_BLOCK_CAPACITY)
   ;; This field is now d/OFFSET_BD_VALUE_DATA_DESC_IDX in data.cljs
   ;; It stores the descriptor index of the data block for an atom header.
   ;; For regular data/free blocks, its meaning is "unused" or ROOT_POINTER_NIL_SENTINEL.
   :value_data_desc_idx (read-block-descriptor-field sab-int32-view descriptor-idx d/OFFSET_BD_VALUE_DATA_DESC_IDX)
   :lock-owner (read-block-descriptor-field sab-int32-view descriptor-idx d/OFFSET_BD_LOCK_OWNER)})

(defn find-descriptor-for-data-offset
  [s-atom-env target-data-offset]
  (let [index-view (:index-view s-atom-env)
        raw-max (get-max-block-descriptors index-view)
        ;; Guard against corrupted header: cap at configured max or 262144
        max-descriptors (let [cfg-max (get-in s-atom-env [:config :max-block-descriptors])]
                          (if (and (number? raw-max) (pos? raw-max)
                                   (<= raw-max (or cfg-max 262144)))
                            raw-max
                            (or cfg-max 262144)))]
    (log ">>> find-descriptor: ENTER. target-offset:" target-data-offset "Max Descriptors:" max-descriptors)
    (loop [check-idx 0]
      (if (>= check-idx max-descriptors)
        (do (log ">>> find-descriptor: NOT FOUND for target-offset:" target-data-offset)
            nil)
        (let [current-data-offset (read-block-descriptor-field index-view check-idx d/OFFSET_BD_DATA_OFFSET)
              status (read-block-descriptor-field index-view check-idx d/OFFSET_BD_STATUS)]
          (when (== current-data-offset target-data-offset)
            (log ">>> find-descriptor: Found matching offset" target-data-offset "at desc_idx" check-idx "WITH STATUS" status))
          (if (and (== current-data-offset target-data-offset)
                   (== status d/STATUS_ALLOCATED))
            (let [found-desc (assoc (read-full-block-descriptor index-view check-idx) :descriptor-idx check-idx)]
              (log ">>> find-descriptor: Found AND ALLOCATED for target" target-data-offset "desc:" (pr-str found-desc))
              found-desc)
            (recur (inc check-idx))))))))

;; default-reader-handlers removed — Fressian reader no longer used (Phase 5)

(defn format-bytes-as-hex [byte-array-view max-bytes-to-show]
  (let [str-parts #js [] len (if byte-array-view (.-length byte-array-view) 0) display-len (min len max-bytes-to-show)]
    (dotimes [i display-len] (let [byte-val (.at byte-array-view i) hex (.toString byte-val 16)] (when (= (.-length hex) 1) (.push str-parts "0")) (.push str-parts hex) (.push str-parts " ")))
    (when (> len max-bytes-to-show) (.push str-parts "...")) (.join str-parts "")))

(defn generate-model-char-map-str [index-view config max-chars-to-render]
  (let [{:keys [max-block-descriptors data-region-start-offset sab-total-size-bytes]} config data-region-size (- sab-total-size-bytes data-region-start-offset)
        effective-render-size (min max-chars-to-render data-region-size) char-js-array (js/Array. effective-render-size)]
    (dotimes [k effective-render-size] (aset char-js-array k \.))
    (doseq [descriptor-idx (range max-block-descriptors)]
      (let [desc (read-full-block-descriptor index-view descriptor-idx) status (:status desc) block-data-offset (:data-offset desc)
            block-len (if (= status d/STATUS_ALLOCATED) (:data-length desc) (:block-capacity desc)) char-to-use (cond (= status d/STATUS_ALLOCATED) \# (= status d/STATUS_FREE) \_ :else nil)]
        (when (and char-to-use (>= block-data-offset data-region-start-offset) (< block-data-offset (+ data-region-start-offset data-region-size))) ; Ensure block is within data region
          (let [start-in-char-map (- block-data-offset data-region-start-offset)
                end-in-char-map (min effective-render-size (+ start-in-char-map block-len))]
            (loop [char-idx start-in-char-map]
              (when (and (>= char-idx 0) (< char-idx end-in-char-map) (< char-idx effective-render-size)) ; Bounds check for char-js-array
                (aset char-js-array char-idx (if (and (= status d/STATUS_ALLOCATED) (> char-idx start-in-char-map)) \+ char-to-use))
                (recur (inc char-idx))))))))
    (.join char-js-array "")))

(defn format-char-data-line [address-str char-map-str offset-in-char-map chars-on-this-line chars-per-row]
  (let [str-parts #js []] (.push str-parts address-str)
       (dotimes [k chars-per-row] (if (< k chars-on-this-line) (let [char-idx (+ offset-in-char-map k)] (if (< char-idx (count char-map-str)) (do (.push str-parts (.charAt char-map-str char-idx)) (.push str-parts "  ")) (.push str-parts "   "))) (.push str-parts "   ")))
       (.join str-parts "")))

(defn format-descriptor-value [value col-width]
  (let [s (str value)]
    (if (> (count s) col-width)
      (.substring s 0 col-width)
      (.padStart s col-width " "))))

;; MODIFIED print-descriptor-table to use :value_data_desc_idx
(defn print-descriptor-table [index-view start-idx num-descriptors-in-table max-total-descriptors]
  (let [fields [{:label "Status" :key :status}
                {:label "Data Offset" :key :data-offset}
                {:label "Data Length" :key :data-length}
                {:label "Block Cap" :key :block-capacity}
                {:label "ValueDescIdx" :key :value_data_desc_idx} ; Changed from :atomic-value-pointer
                {:label "Lock Owner" :key :lock-owner}]
        val-print-width 10
        col-spacing "  "
        max-label-width (apply max (map #(count (:label %)) fields))
        end-idx (min (+ start-idx num-descriptors-in-table) max-total-descriptors)
        current-descriptors (mapv #(read-full-block-descriptor index-view %) (range start-idx end-idx))]

    (let [header-parts #js [(.padEnd "Desc Idx:" (+ max-label-width 2) " ")]]
      (doseq [desc current-descriptors]
        (.push header-parts (format-descriptor-value (:idx desc) val-print-width))
        (.push header-parts col-spacing))
      (println (.trim (.join header-parts ""))))

    (let [sep-parts #js [(.padEnd "" (+ max-label-width 2) "-")]]
      (doseq [_ current-descriptors]
        (.push sep-parts (.padEnd "" val-print-width "-"))
        (.push sep-parts (.padEnd "" (count col-spacing) "-")))
      (println (.trim (.join sep-parts ""))))

    (doseq [field-info fields]
      (let [row-parts #js [(.padEnd (str (:label field-info) ":") (+ max-label-width 2) " ")]]
        (doseq [desc current-descriptors]
          (.push row-parts (format-descriptor-value (get desc (:key field-info) "") val-print-width))
          (.push row-parts col-spacing))
        (println (.trim (.join row-parts "")))))
    (println "")))

(defn -equiv-sequential [coll other]
  (log ">>> -equiv-sequential CALLED for:" (pr-str coll) "AND" (pr-str other))
  (if (sequential? other)
    (do
      (log ">>> -equiv-sequential: other is sequential")
      (if (counted? other)
        (do
          (log ">>> -equiv-sequential: other is counted. coll count:" (count coll) "other count:" (count other))
          (if (not= (count coll) (count other))
            (do (log ">>> -equiv-sequential: COUNTS DIFFER, returning false") false)
            (loop [idx 0
                   s1 (seq coll)
                   s2 (seq other)]
              (log ">>> -equiv-sequential loop: idx" idx "s1 nil?" (nil? s1) "s2 nil?" (nil? s2))
              (cond
                (nil? s1) (if (nil? s2) (do (log ">>> -equiv-sequential: Both seqs nil, returning true") true)
                              (do (log ">>> -equiv-sequential: s1 nil, s2 not. Returning false") false))
                (nil? s2) (do (log ">>> -equiv-sequential: s2 nil, s1 not. Returning false") false)
                :else (let [first1 (first s1)
                            first2 (first s2)
                            elements-equal? (= first1 first2)]
                        (log ">>> -equiv-sequential loop: Comparing elements - first1:" (pr-str first1) "(type:" (type first1) ") vs first2:" (pr-str first2) "(type:" (type first2) ") EQUAL?:" elements-equal?)
                        (if elements-equal?
                          (recur (inc idx) (next s1) (next s2))
                          (do (log ">>> -equiv-sequential: ELEMENTS DIFFER at idx" idx ", returning false") false)))))))
        (do (log ">>> -equiv-sequential: other is not counted, returning false") false)))
    (do (log ">>> -equiv-sequential: other is not sequential, returning false") false)))

(defonce is-node? (exists? js/process))

(defn get-reader-map-idx ^number [descriptor-idx]
  (assert (number? descriptor-idx) "get-reader-map-idx expects a numerical descriptor-idx")
  (assert (>= descriptor-idx 0) "descriptor-idx must be non-negative")
  (let [num-counters d/READER_MAP_NUM_COUNTERS
        ;; Simple modulo is fine for descriptor indices as they are already integers.
        ;; Hashing can still be used if desired for better distribution if NUM_COUNTERS is much smaller than max descriptors.
        result (mod descriptor-idx num-counters)]
    ;; (u/log ">>> get-reader-map-idx: descriptor-idx:" descriptor-idx "num-counters:" num-counters "result-idx:" result)
    (when (>= result num-counters) ; Should not happen with modulo if num-counters > 0
      (js/console.error "!!! get-reader-map-idx: CRITICAL - result" result "is >= num-counters" num-counters
                        "for descriptor-idx" descriptor-idx))
    result))

;;
#_(defn get-reader-map-idx ^number [data-offset]
    (let [h (cljs.core/hash data-offset)
          abs-h (js/Math.abs h)
          num-counters d/READER_MAP_NUM_COUNTERS
          result (mod abs-h num-counters)]
      (log ">>> get-reader-map-idx: data-offset:" data-offset "raw-hash:" h "abs-h:" abs-h "num-counters:" num-counters "result-idx:" result)
      (when (>= result num-counters)
        (println "!!! get-reader-map-idx: CRITICAL - result" result "is >= num-counters" num-counters
                 "for abs-hash" abs-h "and data-offset" data-offset))
      result))

(def TE (js/TextEncoder.))
(def TD (js/TextDecoder. "utf-8"))

(defn string->uint8array ^js [s]
  (.encode TE s))

(defn uint8array->string ^string [^js arr]
  (.decode TD arr))
