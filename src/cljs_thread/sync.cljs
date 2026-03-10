(ns cljs-thread.sync
  (:require
   [cljs.reader :refer [register-tag-parser!]]
   [clojure.edn :as edn]
   [cljs-thread.env :as e]
   [cljs-thread.perf :as perf]
   [cljs-thread.state :as s]
   [cljs-thread.platform :as p]
   [cljs-thread.id :refer [IDable get-id]]
   [cljs-thread.eve :as eve]))

(defn no-blocking? []
  (cond
    ;; Node: blocking is always available (Atomics.wait)
    p/node? false
    ;; Browser SAB sync: blocking is available (Atomics.wait in workers)
    p/sab-sync? false
    ;; Browser legacy: need a service worker for blocking
    :else (not (contains? @s/conf :sw-connect-string))))

(defn throw-if-non-blocking []
  (when (no-blocking?)
    (throw (ex-info (str "Can't deref without a sync mechanism.\n"
                         "Either:\n"
                         "  1. Set COOP/COEP headers for SharedArrayBuffer support, or\n"
                         "  2. Add `:sw-connect-string \"sw.js\"` to your init! config\n"
                         "Something like:\n"
                         " `(cljs-thread.core/init! {:sw-connect-string \"sw.js\"\n"
                         "                      :connect-string \"/core.js\"})")
                    {:conf @s/conf
                     :env e/data}))))

;; ---------------------------------------------------------------------------
;; Direct SAB Sync Channel Primitives
;; ---------------------------------------------------------------------------

;; ---------------------------------------------------------------------------
;; Item 8: SAB signal pool — re-use SharedArrayBuffers instead of
;; allocating one per `in :screen` call.
;;
;; Each SAB is growable: starts at sab-header-bytes (8 B, header only) and
;; grows on demand up to sab-max-bytes (1 MB) via SharedArrayBuffer.grow().
;; This avoids pre-allocating large virtual address space; the SAB occupies
;; only as much physical memory as the result bytes actually written.
;;
;; Layout: [0..3] i32 status, [4..7] i32 inline-byte-length, [8..] result bytes
;;   status 0 = pending
;;   status 1 = result encoded inline as pr-str UTF-8 bytes at [8..]
;;   status 2 = result written to response-atom (too large or unencodable)
;;
;; Pool is per-worker (workers don't share atoms). Max 16 entries — enough
;; to cover any realistic concurrency without unbounded memory growth.
;; Pre-warmed at ns load time on SAB-capable worker threads.
;; ---------------------------------------------------------------------------

(def ^:private sab-max-bytes (* 1024 1024))
(def ^:private sab-header-bytes 8)

(defonce ^:private signal-sab-pool (atom []))
(def ^:private pool-max 16)

(defn- make-growable-sab []
  (js/SharedArrayBuffer. sab-header-bytes #js {:maxByteLength sab-max-bytes}))

(defn- acquire-signal-sab!
  "Get a signal SAB from the pool, or allocate a fresh growable one.
   Starts at sab-header-bytes (8 B header only); grows lazily in deliver-response."
  []
  (loop []
    (let [pool @signal-sab-pool]
      (if (empty? pool)
        (make-growable-sab)
        (if (compare-and-set! signal-sab-pool pool (subvec pool 1))
          (first pool)
          (recur))))))

(defn release-signal-sab!
  "Reset status word to 0 and return SAB to the pool (if pool not full).
   Only the status at i32[0] needs resetting; the length and data bytes
   are ignored until the next deliver-response overwrites them."
  [sab]
  (let [i32 (js/Int32Array. sab)]
    (js/Atomics.store i32 0 0))
  (swap! signal-sab-pool
         (fn [pool]
           (if (< (count pool) pool-max)
             (conj pool sab)
             pool))))

;; Pre-warm pool on worker threads where SAB sync is available.
;; Screen thread never calls acquire-signal-sab! (screen can't block).
;; Each SAB starts at 8 bytes (header only); grows on first use.
(when (and (not (e/in-screen?)) p/sab-sync?)
  (reset! signal-sab-pool (vec (repeatedly 8 make-growable-sab))))

(defn make-sync-channel
  "Create a sync channel for direct SAB sync.
   Returns {:signal-sab <growable SAB, 8B..1MB> :response-atom <eve atom>}.
   The signal-sab is acquired from the pool (Item 8) — a growable SAB that
   starts at 8 bytes (header only) and grows on first deliver-response.
   Caller must release it via release-signal-sab! after await-response returns.
   The response-atom holds the response data as a map {in-id -> result}
   and is only used when the result doesn't fit inline in the SAB."
  ([]
   {:signal-sab (acquire-signal-sab!)
    :response-atom (eve/atom {})})
  ([response-atom]
   ;; Create channel with pooled signal-sab but shared response-atom
   {:signal-sab (acquire-signal-sab!)
    :response-atom response-atom}))

(defn deliver-response
  "Write response to the sync channel and signal the waiter.
   Called by the worker that computed the result.
   Uses in-id as key in the response-atom map to support concurrent requests.

   Fast path (status 1): pr-str result, encode to UTF-8, write bytes into
   SAB at offset sab-header-bytes. Avoids response-atom for results that fit.

   Fallback (status 2): result too large or unencodable — write to response-atom
   as before.

   Sub-timing: when result is a perf envelope (map with :__t3), logs
   [bench] dr-timing with t-atom-write (encode or swap! cost) and t-signal-ops
   (Atomics.store + Atomics.notify cost). Uses js/console.log directly so
   it works on the screen thread regardless of per-thread perf-logging? state."
  [{:keys [signal-sab response-atom]} in-id result]
  (when (instance? js/SharedArrayBuffer signal-sab)
    (let [signal-i32   (js/Int32Array. signal-sab)
          perf?        (and (map? result) (contains? result :__t3))
          t-pre        (when perf? (js/Date.now))
          ;; Use maxByteLength for capacity on growable SABs, byteLength otherwise.
          max-cap      (- (or (.-maxByteLength signal-sab) (.-byteLength signal-sab))
                          sab-header-bytes)
          inline-bytes (try
                         (let [b (.encode (js/TextEncoder.) (pr-str result))]
                           (when (<= (.-byteLength b) max-cap) b))
                         (catch :default _ nil))]
      (if inline-bytes
        ;; Inline path: grow SAB if needed, then write pr-str UTF-8 bytes.
        (let [needed     (+ sab-header-bytes (.-byteLength inline-bytes))
              _          (when (< (.-byteLength signal-sab) needed)
                           (.grow signal-sab needed))
              _          (.set (js/Uint8Array. signal-sab sab-header-bytes) inline-bytes)
              t-post-write (when perf? (js/Date.now))]
          (js/Atomics.store signal-i32 1 (.-byteLength inline-bytes))
          (js/Atomics.store signal-i32 0 1)
          (js/Atomics.notify signal-i32 0 1)
          (when perf?
            (js/console.log
              (str "[bench] "
                   (js/JSON.stringify
                     #js {:type         "dr-timing"
                          :t-atom-write (- t-post-write t-pre)
                          :t-signal-ops (- (js/Date.now) t-post-write)})))))
        ;; Fallback: result in response-atom
        (do
          (swap! response-atom assoc in-id result)
          (let [t-post-swap (when perf? (js/Date.now))]
            (js/Atomics.store signal-i32 0 2)
            (js/Atomics.notify signal-i32 0 1)
            (when perf?
              (js/console.log
                (str "[bench] "
                     (js/JSON.stringify
                       #js {:type         "dr-timing"
                            :t-atom-write (- t-post-swap t-pre)
                            :t-signal-ops (- (js/Date.now) t-post-swap)}))))))))))

(defn await-response
  "Block until response arrives via sync channel, then return it.
   Reads status after waking:
     1 = result encoded inline in SAB — decode pr-str UTF-8 bytes
     2 = result in response-atom — read and dissoc as before
   Called by the worker that is waiting for a result.

   Sub-timing: when result is a perf envelope (map with :__t3), logs
   [bench] ar-timing with t-atom-read (decode/read cost after Atomics.wait)
   and t-atom-dissoc (swap! dissoc cost; 0 for inline path)."
  [sync-channel in-id]
  (let [{:keys [signal-sab response-atom]} sync-channel
        signal-i32 (js/Int32Array. signal-sab)]
    (when (zero? (js/Atomics.load signal-i32 0))
      (js/Atomics.wait signal-i32 0 0))
    (let [t-post-wait (js/Date.now)
          status      (js/Atomics.load signal-i32 0)]
      (if (= status 1)
        ;; Inline: decode pr-str bytes from SAB
        (let [byte-len    (js/Atomics.load signal-i32 1)
              ;; TextDecoder.decode() rejects SharedArrayBuffer-backed views.
              ;; SharedArrayBuffer.slice() also returns a SharedArrayBuffer.
              ;; Copy into a plain ArrayBuffer via Uint8Array.set.
              plain-buf   (js/ArrayBuffer. byte-len)
              plain-view  (js/Uint8Array. plain-buf)
              _           (.set plain-view (js/Uint8Array. signal-sab sab-header-bytes byte-len))
              result      (edn/read-string
                            (.decode (js/TextDecoder.) plain-view))
              t-post-read (js/Date.now)
              perf?       (and (map? result) (contains? result :__t3))]
          (when perf?
            (js/console.log
              (str "[bench] "
                   (js/JSON.stringify
                     #js {:type          "ar-timing"
                          :t-atom-read   (- t-post-read t-post-wait)
                          :t-atom-dissoc 0}))))
          result)
        ;; Response-atom fallback
        (let [result        (get @response-atom in-id)
              t-post-read   (js/Date.now)
              _             (swap! response-atom dissoc in-id)
              t-post-dissoc (js/Date.now)
              perf?         (and (map? result) (contains? result :__t3))]
          (when perf?
            (js/console.log
              (str "[bench] "
                   (js/JSON.stringify
                     #js {:type          "ar-timing"
                          :t-atom-read   (- t-post-read  t-post-wait)
                          :t-atom-dissoc (- t-post-dissoc t-post-read)}))))
          result)))))

(defn reset-sync-channel!
  "Reset a sync channel's signal for reuse.
   Only resets the signal SAB - response atom uses KV and cleans up per-request."
  [{:keys [signal-sab]}]
  (let [signal-i32 (js/Int32Array. signal-sab)]
    (js/Atomics.store signal-i32 0 0)))

;; ---------------------------------------------------------------------------

(defn request
  "Request a response via the Service Worker fallback path.
   For direct SAB sync (Node or browser with SAB), use wrap-derefable-direct instead."
  [getter & {:as opts :keys [resolve reject no-park max-time duration]}]
  (throw-if-non-blocking)
  (when-not (or p/node? p/sab-sync?)
    ;; Browser SW fallback: check SW is ready, then dispatch through platform
    (when (or (not (= getter :sw)) (not (e/in-screen?)) (p/coordinator-ready?))
      (p/request getter opts))))

(defn send-response
  "Send a response via the Service Worker fallback path.
   For direct SAB sync (Node or browser with SAB), use deliver-response instead."
  [payload & [_db?]]
  (throw-if-non-blocking)
  (when-not (or p/node? p/sab-sync?)
    (p/send-response payload)))

(extend-type js/Promise
  ICloneable
  (-clone [p] (.then p)))

(extend-type string
  ICloneable
  (-clone [s] (js/String. s)))

(extend-type cljs.core/Keyword
  ICloneable
  (-clone [k] (keyword k)))

(defn wrap-derefable [{:keys [promise? id] :as data}]
  ;; Debug logging disabled for now
  #_(println "[wrap-derefable ENTER PRINTLN] id:" (str id) "env-id:" (str (:id e/data)))
  #_(js/console.error "[wrap-derefable ENTER] id:" (str id) "env-id:" (str (:id e/data)))
  (let [id (if (satisfies? IDable id) (get-id id) id)
        resolved? (atom false)
        resolved-value (atom nil)
        promise? (if (e/in-screen?) true promise?)
        do-promise (fn [no-delay?]
                     (-> (js/Promise. (if no-delay?
                                        #(request id {:resolve %1 :reject %2})
                                        #(do id)))
                         (.then (fn [result]
                                  (reset! resolved? true)
                                  (reset! resolved-value result)
                                  (if (:error result)
                                    (throw (ex-info "Error in remote call" {:result (pr-str result)}))
                                    result)))))
        p (if-not promise?
            id
            (do-promise false))]
    (let [obj (specify p
                       IDable
                       (get-id [_] id)
                       IPending
                       (-realized? [_] @resolved?)
                       IPrintWithWriter
                       (-pr-writer [x writer opts]
                                   (-write writer
                                           (str "#cljs-thread {:id "
                                                (if (keyword? id)
                                                  id
                                                  (pr-str id))
                                                "}")))
                       IDeref
                       (-deref [_]
                               (if-let [res @resolved-value]
                                 res
                                 (if promise?
                                   (do-promise true)
                                   (let [_ (throw-if-non-blocking)
                                         res (request id)]
                                     (reset! resolved? true)
                                     (reset! resolved-value res)
                                     (if (:error res)
                                       (throw (ex-info "Error in remote call" {:results (pr-str res)}))
                                       res))))))]
      (set! (.-__cljs_thread_parkable__ obj) true)
      obj)))

(register-tag-parser!
  'cljs-thread (fn [x]
            (wrap-derefable x)))

(defn wrap-derefable-direct
  "Create a derefable that blocks on a sync-channel (direct SAB sync).
   Used for in/future calls when SAB sync is available.
   Supports both blocking deref (@) and async resolution via .__park_resolve__.

   perf-t0 / perf-t1: optional worker-side timestamps from do-in (Item 12).
   When present and the result carries :__t2/:__t3 screen timestamps, logs
   a [bench] rtt JSON line with the 5-point breakdown."
  [{:keys [id sync-channel perf-t0 perf-t1]}]
  (let [resolved? (atom false)
        resolved-value (atom nil)
        do-block (fn []
                   (let [raw (await-response sync-channel id)
                         ;; Item 8: return signal-sab to pool immediately after Atomics.wait
                         ;; returns — we've read the value, SAB is no longer needed.
                         _ (release-signal-sab! (:signal-sab sync-channel))
                         t4  (when perf-t0 (js/Date.now))
                         ;; Detect perf envelope: {:__result ... :__t2 ... :__t3 ...}
                         ;; Only present when perf was enabled at call time (__perf flag in msg)
                         has-perf-env? (and perf-t0 (map? raw) (contains? raw :__result))
                         res (if has-perf-env? (:__result raw) raw)]
                     (when has-perf-env?
                       (perf/bench-log {:type      "rtt"
                                        :t-serialize (- perf-t1 perf-t0)
                                        :t-postmsg   (- (:__t2 raw) perf-t1)
                                        :t-eval      (- (:__t3 raw) (:__t2 raw))
                                        :t-deliver   (- t4 (:__t3 raw))
                                        :t-total     (- t4 perf-t0)}))
                     (reset! resolved? true)
                     (reset! resolved-value res)
                     (if (and (map? res) (:error res))
                       (throw (ex-info "Error in remote call" {:result res}))
                       res)))]
    (let [obj (specify id
                       IDable
                       (get-id [_] id)
                       IPending
                       (-realized? [_] @resolved?)
                       IPrintWithWriter
                       (-pr-writer [x writer opts]
                                   (-write writer
                                           (str "#cljs-thread {:id "
                                                (if (keyword? id)
                                                  id
                                                  (pr-str id))
                                                "}")))
                       IDeref
                       (-deref [_]
                         (if @resolved?
                           @resolved-value
                           (do-block))))]
      (set! (.-__cljs_thread_parkable__ obj) true)
      ;; Store sync-channel for async resolution via park-deref
      (set! (.-__cljs_thread_sync_channel__ obj) sync-channel)
      obj)))

(defn sleep [n]
  (throw-if-non-blocking)
  (p/sleep n))
