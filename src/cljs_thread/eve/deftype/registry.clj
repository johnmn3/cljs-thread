(ns cljs-thread.eve.deftype.registry)

;; Compile-time type registry. Populated by eve-deftype macro during
;; macro expansion. Read by subsequent macros to resolve type references.
;;
;; NOT available at runtime. The macro bakes all needed info into
;; the generated code.

(defonce registry (atom {}))
(defonce next-id (atom 64)) ;; 0-63 reserved for system types

(defn next-type-id! []
  ;; Atomic: swap! returns the new value, dec gives the old value
  (dec (swap! next-id inc)))

(defn register-type!
  "Register an eve-deftype in the compile-time registry.
   Called by the eve-deftype macro during expansion."
  [type-name spec]
  (swap! registry assoc type-name spec))

(defn lookup-type
  "Look up a type by name in the registry. Returns nil if not found."
  [type-name]
  (get @registry type-name))

;; Primitive types recognized by the macro
(def primitive-types
  #{:int8 :uint8 :int16 :uint16 :int32 :uint32 :float32 :float64})

(defn primitive-type? [t]
  (contains? primitive-types t))

(defn field-size
  "Returns the byte size for a field type."
  [type-kw]
  (case type-kw
    (:int8 :uint8) 4      ;; padded to 4 for alignment
    (:int16 :uint16) 4    ;; padded to 4 for alignment
    (:int32 :uint32) 4
    :float32 4
    :float64 8
    :serialized 4          ;; offset to serialized block
    ;; eve-type reference: 4 bytes (offset)
    4))

(defn parse-field
  "Parse a field symbol with metadata into a field spec map.
   Returns {:name sym :mutability :immutable|:mutable|:volatile-mutable
            :type-hint kw-or-nil :type-class :primitive|:eve-type|:serialized}"
  [field-sym]
  (let [m (meta field-sym)
        mutability (cond
                     (:volatile-mutable m) :volatile-mutable
                     (:mutable m)          :mutable
                     :else                 :immutable)
        ;; Find the type hint: any metadata key that's not mutable/volatile-mutable,
        ;; :tag, or reader-added metadata (:file, :line, :column, :end-line, :end-column, :source)
        hint-keys (disj (set (keys m)) :mutable :volatile-mutable :tag
                        :file :line :column :end-line :end-column :source)
        type-hint (first hint-keys)  ;; there should be 0 or 1
        type-class (cond
                     (nil? type-hint)           :serialized
                     (primitive-type? type-hint) :primitive
                     ;; Otherwise assume it's an eve-type reference
                     ;; (will be validated at macro expansion time)
                     :else                       :eve-type)]
    {:name       (name field-sym)
     :sym        field-sym
     :mutability mutability
     :type-hint  type-hint
     :type-class type-class}))

(defn compute-layout
  "Given parsed field specs, compute byte offsets and total size.
   Layout: [type-id:u8 + 3 pad][field0][field1]...
   Returns {:fields [updated-field-specs] :total-size n}"
  [parsed-fields]
  (loop [fields parsed-fields
         offset 4  ;; start after 4-byte header (type-id + padding)
         result []]
    (if (empty? fields)
      {:fields result
       :total-size offset}
      (let [f (first fields)
            sz (if (= :eve-type (:type-class f))
                 4
                 (field-size (:type-hint f)))
            ;; Align float64 to 8-byte boundary
            aligned-offset (if (= :float64 (:type-hint f))
                             (let [r (mod offset 8)]
                               (if (zero? r) offset (+ offset (- 8 r))))
                             offset)]
        (recur (rest fields)
               (+ aligned-offset sz)
               (conj result (assoc f :offset aligned-offset :size sz)))))))
