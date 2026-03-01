(ns cljs-thread.serial
  "Wire serialization for cljs-thread messages.
   Handles typed arrays, functions, and eve atoms symmetrically
   for both requests and responses."
  (:require
   [clojure.walk :refer [postwalk]]
   [cljs-thread.util :as u]
   [cljs-thread.eve.deftype-proto.data :as eve-data]))

;; ---------------------------------------------------------------------------
;; Transferable detection
;; ---------------------------------------------------------------------------

(defn- image-bitmap?
  "Check if x is an ImageBitmap (transferable canvas image)."
  [x]
  (and (exists? js/ImageBitmap)
       (instance? js/ImageBitmap x)))

(defn- transferable?
  "Check if x is a transferable object (typed array or ImageBitmap)."
  [x]
  (or (u/typed-array? x)
      (image-bitmap? x)))

;; ---------------------------------------------------------------------------
;; EVE type detection (duck-typing to avoid circular requires)
;; ---------------------------------------------------------------------------

(defn- eve-shared-atom?
  "Duck-type check for eve SharedAtom by field presence."
  [x]
  (and (some? x) (not (string? x)) (not (number? x))
       (not (keyword? x)) (not (boolean? x))
       (exists? js/SharedArrayBuffer)
       (some? (unchecked-get x "shared-atom-id"))
       (some? (unchecked-get x "header-descriptor-idx"))))

(defn- eve-atom-domain?
  "Duck-type check for eve AtomDomain by field presence."
  [x]
  (and (some? x) (not (string? x)) (not (number? x))
       (not (keyword? x)) (not (boolean? x))
       (exists? js/SharedArrayBuffer)
       (some? (unchecked-get x "s-atom-env"))))

;; ---------------------------------------------------------------------------
;; Serialization (encode)
;; ---------------------------------------------------------------------------

(defn- get-or-assign-ctag!
  "Get existing c-tag for an object, or assign a new one.
   Deduplicates transferables by identity."
  [transfer-atom obj]
  (if-let [existing (get-in @transfer-atom [:seen obj])]
    existing
    (let [c-tag (:count (swap! transfer-atom update :count inc))]
      (swap! transfer-atom assoc-in [:seen obj] c-tag)
      c-tag)))

(defn- instr-walk
  "Custom walk that checks for special types BEFORE recursing.
   This prevents postwalk from calling (empty coll) on EVE types."
  [transfer-atom form]
  (cond
    ;; Functions → string tags
    (fn? form)
    (str "#cljs-thread/arg-fn " form)

    ;; EVE types → pass through unchanged (their native tag readers/writers handle serialization)
    ;; SharedAtoms, AtomDomains, and other EVE types have their own pr-str/read-string support.
    ;; We just prevent the walk from recursing into them.
    (eve-shared-atom? form)
    form

    (eve-atom-domain? form)
    form

    (satisfies? eve-data/IsEve form)
    form

    ;; Transferables: typed arrays and ImageBitmap
    (transferable? form)
    (let [c-tag (get-or-assign-ctag! transfer-atom form)
          t (type form)
          ;; SABs don't need transfer - they're automatically shared via structured cloning
          is-sab? (and (exists? js/SharedArrayBuffer)
                       (= t js/SharedArrayBuffer))
          ;; Typed array views on SABs also don't need transfer
          buffer (when (u/typed-array? form) (.-buffer form))
          buffer-is-sab? (and buffer
                              (exists? js/SharedArrayBuffer)
                              (instance? js/SharedArrayBuffer buffer))]
      (when-not (get-in @transfer-atom [:transfers c-tag])
        (swap! transfer-atom assoc-in [:transfers c-tag]
               (if (or is-sab? buffer-is-sab?)
                 {:obj form}  ;; no :transfer key for SABs or views on SABs
                 {:obj form
                  :transfer (cond
                              (image-bitmap? form) form
                              :else buffer)})))
      {:__ct-marker "transferable" :ctag c-tag})

    ;; Any JS host object (not CLJS types, not typed arrays): preserve via structured clone.
    ;; `object?` only matches plain `{}` objects (constructor === Object); this broader check
    ;; also catches host objects like ImageData, Error, Date, etc. which have typeof === "object"
    ;; but a non-Object constructor.
    ;; Exclude CLJS types: CLJS deftypes/defrecords have cljs$lang$type = true on the CONSTRUCTOR
    ;; function (not on instances). So check (.-constructor form) for cljs$lang$type.
    ;; Native host constructors (ImageData, ArrayBuffer, etc.) never have cljs$lang$type.
    ;; NOTE: Under :advanced Closure compilation, cljs$lang$type is renamed, so it cannot be
    ;; relied upon to distinguish CLJS types from native host objects. We must explicitly guard
    ;; against CLJS primitive types that have typeof === "object" (keywords, symbols) before
    ;; falling through to the cljs$lang$type check.
    (and (some? form)
         (identical? (js* "typeof ~{}" form) "object")
         (not (u/typed-array? form))
         (not (keyword? form))
         (not (symbol? form))
         (not (map? form))
         (not (vector? form))
         (not (set? form))
         (not (list? form))
         (not (seq? form))
         (let [ctor (.-constructor form)]
           (or (nil? ctor)
               (nil? (unchecked-get ctor "cljs$lang$type")))))
    (let [c-tag (get-or-assign-ctag! transfer-atom form)]
      (swap! transfer-atom assoc-in [:transfers c-tag] {:obj form})
      {:__ct-marker "js-object" :ctag c-tag})

    ;; Collections: recurse manually (avoiding postwalk's empty call)
    (map? form)
    (persistent!
     (reduce-kv (fn [m k v]
                  (assoc! m (instr-walk transfer-atom k) (instr-walk transfer-atom v)))
                (transient {}) form))

    (vector? form)
    (mapv (partial instr-walk transfer-atom) form)

    (set? form)
    (into #{} (map (partial instr-walk transfer-atom)) form)

    (seq? form)
    (doall (map (partial instr-walk transfer-atom) form))

    (list? form)
    (apply list (map (partial instr-walk transfer-atom) form))

    ;; Primitives pass through
    :else form))

(defn instr-body
  "Serialize a payload for wire transfer.
   Transferables → CLJS map markers (actual objects stored in transfer-atom)
   Functions → #cljs-thread/arg-fn tags
   EVE types → CLJS map markers (prevents postwalk from walking into them)
   JS objects → CLJS map markers (actual objects stored in transfer-atom)

   After this pass, the result should be pr-str'd to preserve CLJS types.
   Markers use CLJS maps {:__ct-marker type :ctag N} so they survive EDN."
  [transfer-atom pl]
  (instr-walk transfer-atom pl))

;; ---------------------------------------------------------------------------
;; Deserialization (decode)
;; ---------------------------------------------------------------------------

(defn- ct-marker?
  "Check if x is a cljs-thread marker map (transferable or js-object)."
  [x]
  (and (map? x) (:__ct-marker x)))

(defn unstr-body
  "Deserialize a payload from wire transfer.
   Reconstructs transferables, JS objects, and functions from their tags.
   SharedAtom is handled by EDN tag reader automatically.

   Input should already have been edn/read-string'd to restore CLJS types."
  [transfers pl]
  (let [get-transfer (fn [c-tag]
                       ;; transfers is a JS object with numeric string keys like "1", "2"
                       ;; Access directly via aget to avoid js->clj key conversion issues
                       (let [entry (aget transfers (str c-tag))
                             obj (when entry (aget entry "obj"))]
                         obj))]
    (postwalk
     #(cond
        ;; CLJS map marker for transferable or js-object
        (ct-marker? %)
        (get-transfer (:ctag %))

        ;; Function string tag
        (and (string? %) (.startsWith % "#cljs-thread/arg-fn"))
        (js/eval (str "(function () {return (" (subs % 20) ");})();"))

        :else %)
     pl)))
