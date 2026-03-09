(ns cljs-thread.eve.deftype
  (:require [cljs-thread.eve.deftype.registry :as reg]))

;;-----------------------------------------------------------------------------
;; Helpers
;;-----------------------------------------------------------------------------

(defn- read-fn-sym
  "Return the namespaced runtime read function symbol for a field spec."
  [{:keys [type-hint type-class mutability]}]
  (let [volatile? (= :volatile-mutable mutability)]
    (case type-class
      :primitive
      (case type-hint
        :int32   (if volatile? 'cljs-thread.eve.deftype.runtime/read-int32-volatile
                               'cljs-thread.eve.deftype.runtime/read-int32)
        :uint32  (if volatile? 'cljs-thread.eve.deftype.runtime/read-uint32-volatile
                               'cljs-thread.eve.deftype.runtime/read-uint32)
        :float32 'cljs-thread.eve.deftype.runtime/read-float32
        :float64 'cljs-thread.eve.deftype.runtime/read-float64)
      :eve-type
      (if volatile? 'cljs-thread.eve.deftype.runtime/read-eve-type-volatile
                    'cljs-thread.eve.deftype.runtime/read-eve-type)
      :serialized
      (if volatile? 'cljs-thread.eve.deftype.runtime/read-serialized-volatile
                    'cljs-thread.eve.deftype.runtime/read-serialized))))

(defn- write-fn-sym
  "Return the namespaced runtime write function symbol for a field spec."
  [{:keys [type-hint type-class mutability]}]
  (let [volatile? (= :volatile-mutable mutability)]
    (case type-class
      :primitive
      (case type-hint
        :int32   (if volatile? 'cljs-thread.eve.deftype.runtime/write-int32-volatile!
                               'cljs-thread.eve.deftype.runtime/write-int32!)
        :uint32  (if volatile? 'cljs-thread.eve.deftype.runtime/write-uint32-volatile!
                               'cljs-thread.eve.deftype.runtime/write-uint32!)
        :float32 'cljs-thread.eve.deftype.runtime/write-float32!
        :float64 'cljs-thread.eve.deftype.runtime/write-float64!)
      :eve-type
      (if volatile? 'cljs-thread.eve.deftype.runtime/write-eve-type-volatile!
                    'cljs-thread.eve.deftype.runtime/write-eve-type!)
      :serialized
      (if volatile? 'cljs-thread.eve.deftype.runtime/write-serialized-volatile!
                    'cljs-thread.eve.deftype.runtime/write-serialized!))))

(defn- emit-field-read
  "Emit a read expression for a field. For eve-types, includes constructor."
  [field-spec env-expr offset-expr]
  (let [rfn (read-fn-sym field-spec)]
    (if (= :eve-type (:type-class field-spec))
      ;; Eve-type reads need a constructor fn — we wrap in (fn [e o] (Type. e o))
      ;; because CLJS doesn't allow Type. as a bare symbol in argument position
      (let [type-name (name (:type-hint field-spec))
            ctor-sym (symbol (str type-name "."))
            e-sym (gensym "e__")
            o-sym (gensym "o__")]
        (list rfn env-expr offset-expr (:offset field-spec)
              (list 'fn [e-sym o-sym] (list ctor-sym e-sym o-sym))))
      (list rfn env-expr offset-expr (:offset field-spec)))))

(defn- emit-field-write
  "Emit a write expression for a field."
  [field-spec env-expr offset-expr val-expr]
  (when (= :immutable (:mutability field-spec))
    (throw (ex-info (str "Cannot set! immutable field: " (:name field-spec))
                    {:field (:name field-spec)})))
  (let [wfn (write-fn-sym field-spec)]
    (if (= :eve-type (:type-class field-spec))
      ;; Eve-type writes need expected-type-id
      (let [type-reg (reg/lookup-type (name (:type-hint field-spec)))]
        (list wfn env-expr offset-expr (:offset field-spec)
              (if type-reg (:type-id type-reg) -1)
              val-expr))
      (list wfn env-expr offset-expr (:offset field-spec) val-expr))))

(defn- field-bindings
  "Generate let-binding pairs for all declared fields.
   Returns a vector of [sym read-expr sym read-expr ...]"
  [fields env-expr offset-expr]
  (vec (mapcat (fn [f]
                 [(symbol (:name f))
                  (emit-field-read f env-expr offset-expr)])
               fields)))

(defn- rewrite-set!-forms
  "Walk a form, rewriting (set! field-sym expr) to runtime write calls.
   Only rewrites set! where the target matches a declared field name."
  [form field-map env-expr offset-expr]
  (cond
    ;; set! form
    (and (seq? form)
         (= 'set! (first form))
         (symbol? (second form))
         (contains? field-map (name (second form))))
    (let [field-name (name (second form))
          field-spec (get field-map field-name)
          val-expr (nth form 2)]
      (emit-field-write field-spec env-expr offset-expr
                        (rewrite-set!-forms val-expr field-map env-expr offset-expr)))

    ;; cas! form
    (and (seq? form)
         (= 'cas! (first form))
         (symbol? (second form))
         (contains? field-map (name (second form))))
    (let [field-name (name (second form))
          field-spec (get field-map field-name)
          expected-expr (nth form 2)
          new-expr (nth form 3)
          volatile? (= :volatile-mutable (:mutability field-spec))]
      (when-not volatile?
        (throw (ex-info "cas! requires ^:volatile-mutable field" {:field field-name})))
      (case (:type-class field-spec)
        :primitive
        (list 'cljs-thread.eve.deftype.runtime/cas-int32!
              env-expr offset-expr (:offset field-spec)
              (rewrite-set!-forms expected-expr field-map env-expr offset-expr)
              (rewrite-set!-forms new-expr field-map env-expr offset-expr))
        :eve-type
        (let [type-reg (reg/lookup-type (name (:type-hint field-spec)))]
          (list 'cljs-thread.eve.deftype.runtime/cas-eve-type!
                env-expr offset-expr (:offset field-spec)
                (if type-reg (:type-id type-reg) -1)
                (rewrite-set!-forms expected-expr field-map env-expr offset-expr)
                (rewrite-set!-forms new-expr field-map env-expr offset-expr)))))

    ;; Recurse into sequences
    (seq? form)
    (with-meta (apply list (map #(rewrite-set!-forms % field-map env-expr offset-expr) form))
               (meta form))

    (vector? form)
    (with-meta (mapv #(rewrite-set!-forms % field-map env-expr offset-expr) form)
               (meta form))

    (map? form)
    (with-meta (into {} (map (fn [[k v]]
                               [(rewrite-set!-forms k field-map env-expr offset-expr)
                                (rewrite-set!-forms v field-map env-expr offset-expr)])
                             form))
               (meta form))

    :else form))

(defn- transform-method-body
  "Transform a method body: wrap in let-bindings for field reads,
   rewrite set!/cas! forms."
  [body fields field-map env-expr offset-expr]
  (let [bindings (field-bindings fields env-expr offset-expr)
        rewritten-body (map #(rewrite-set!-forms % field-map env-expr offset-expr) body)]
    (if (empty? bindings)
      rewritten-body
      (list (concat (list 'let bindings) rewritten-body)))))

(defn- parse-protocol-impls
  "Parse the protocol implementations from the macro body.
   Returns a list of {:protocol sym :methods [{:name sym :args [...] :body [...]}]}"
  [body]
  (loop [remaining body
         current-proto nil
         result []]
    (if (empty? remaining)
      (if current-proto
        (conj result current-proto)
        result)
      (let [form (first remaining)]
        (if (and (symbol? form) (not (list? form)))
          ;; Protocol name
          (recur (rest remaining)
                 {:protocol form :methods []}
                 (if current-proto (conj result current-proto) result))
          ;; Method implementation
          (if (and (seq? form) current-proto)
            (let [method-name (first form)
                  method-args (second form)
                  method-body (rest (rest form))]
              (recur (rest remaining)
                     (update current-proto :methods conj
                             {:name method-name :args method-args :body method-body})
                     result))
            (recur (rest remaining) current-proto result)))))))

(defn- user-provides-protocol?
  "Check if the user provided an implementation for the given protocol symbol."
  [parsed-protos proto-sym]
  (some #(= proto-sym (:protocol %)) parsed-protos))

;;-----------------------------------------------------------------------------
;; eve-deftype macro
;;-----------------------------------------------------------------------------

(defmacro eve-deftype
  "Define a SAB-backed type. Fields support type hints for optimized storage.

   Field metadata:
     ^:int32, ^:uint32, ^:float32, ^:float64 — primitive SAB fields
     ^:MyEveType — reference to another eve-deftype (stored as offset)
     (no hint) — serialized, any Clojure value

   Mutability:
     (default) — immutable, set at construction
     ^:mutable — mutable via set! (single-worker)
     ^:volatile-mutable — atomic via set!/cas! (cross-worker)

   Example:
     (eve-deftype Counter [^:mutable ^:int32 count label]
       ICounted
       (-count [this] count))"
  [type-name fields & body]
  (let [;; Parse fields
        parsed-fields (mapv reg/parse-field fields)
        ;; Compute layout
        {:keys [fields total-size]} (reg/compute-layout parsed-fields)
        ;; Assign type-id
        type-id (reg/next-type-id!)
        type-tag (str "eve/" (name type-name))
        type-key (str (name (ns-name *ns*)) "/" (name type-name))
        ;; Register in compile-time registry
        _ (reg/register-type! (name type-name)
                              {:type-id type-id
                               :type-tag type-tag
                               :total-size total-size
                               :fields fields
                               :type-key type-key})
        ;; Build field-map for rewriting
        field-map (into {} (map (fn [f] [(:name f) f]) fields))
        field-names (set (map :name fields))
        ;; Parse user protocol impls
        parsed-protos (parse-protocol-impls body)
        ;; Env/offset symbols for emitted code
        env-sym 'eve-env
        off-sym 'eve-offset
        ;; Transform method bodies
        transformed-protos
        (mapcat (fn [{:keys [protocol methods]}]
                  (cons protocol
                        (map (fn [{:keys [name args body]}]
                               (let [this-sym (first args)
                                     tbody (transform-method-body body fields field-map
                                                                  (list '.-eve-env this-sym)
                                                                  (list '.-eve-offset this-sym))]
                                 (list name args (cons 'do tbody))))
                             methods)))
                parsed-protos)
        ;; Boilerplate protocols (only if user didn't provide them)
        boilerplate
        (concat
         ;; ISabpType — always generated
         ['cljs-thread.eve.data/ISabpType
          (list '-sabp-type-key ['_] type-key)]
         ;; IHash
         (when-not (user-provides-protocol? parsed-protos 'IHash)
           ['IHash
            (list '-hash ['_] (list 'hash off-sym))])
         ;; IEquiv
         (when-not (user-provides-protocol? parsed-protos 'IEquiv)
           ['IEquiv
            (list '-equiv ['_ 'other]
                  (list 'and
                        (list 'instance? type-name 'other)
                        (list 'identical? env-sym (list '.-eve-env 'other))
                        (list '== off-sym (list '.-eve-offset 'other))))])
         ;; IPrintWithWriter
         (when-not (user-provides-protocol? parsed-protos 'IPrintWithWriter)
           (let [print-body
                 (list 'let (field-bindings fields env-sym off-sym)
                       (list '-write 'writer (str "#eve/" (name type-name) "{"))
                       (list '-write 'writer
                             (cons 'str
                                   (interpose ", "
                                     (map (fn [f]
                                            (list 'str ":" (:name f) " " (list 'pr-str (symbol (:name f)))))
                                          fields))))
                       (list '-write 'writer "}"))]
             ['IPrintWithWriter
              (list '-pr-writer ['this 'writer 'opts] print-body)])))
        ;; Constructor function
        ctor-name (symbol (str "->" (name type-name)))
        ctor-args (mapv (fn [f] (symbol (:name f))) fields)
        ctor-body
        (let [offset-sym (gensym "offset_")]
          (list 'let [offset-sym (list 'cljs-thread.eve.deftype.runtime/alloc-instance
                                       env-sym type-id total-size)]
                ;; Write each field's initial value
                (cons 'do
                      (concat
                       (map (fn [f]
                              (emit-field-write
                               ;; For init: volatile fields keep volatile-mutable so
                               ;; Int32Array addressing matches volatile reads.
                               ;; Immutable fields use :mutable for initialization.
                               (assoc f :mutability
                                        (if (= :volatile-mutable (:mutability f))
                                          :volatile-mutable
                                          :mutable))
                               env-sym offset-sym (symbol (:name f))))
                            fields)
                       [(list (symbol (str (name type-name) ".")) env-sym offset-sym)]))))
        ]
    `(do
       ;; The real deftype (creates auto-generated ->TypeName)
       (~'cljs.core/deftype ~type-name [~env-sym ~off-sym]
         ~@boilerplate
         ~@transformed-protos)

       ;; Override the auto-generated constructor with our custom one
       ;; that takes field values instead of raw env/offset
       (~'set! ~ctor-name (~'fn [~env-sym ~@ctor-args] ~ctor-body))

       ;; Return the type name
       ~type-name)))

;;-----------------------------------------------------------------------------
;; eve-extend-type macro
;;-----------------------------------------------------------------------------

(defmacro eve-extend-type
  "Extend protocols to an existing eve-deftype. Field names from the type's
   declaration are available as local bindings in method bodies. set! and cas!
   on declared fields are rewritten to SAB operations.

   Example:
     (eve-extend-type Counter
       IIncable
       (-inc! [this]
         (set! count (inc count))
         this))"
  [type-name & body]
  (let [type-str (name type-name)
        type-reg (reg/lookup-type type-str)
        _ (when-not type-reg
            (throw (ex-info (str "eve-extend-type: unknown type " type-str
                                 ". Must be defined with eve-deftype first.")
                            {:type type-str})))
        fields (:fields type-reg)
        field-map (into {} (map (fn [f] [(:name f) f]) fields))
        parsed-protos (parse-protocol-impls body)
        transformed-protos
        (mapcat (fn [{:keys [protocol methods]}]
                  (cons protocol
                        (map (fn [{:keys [name args body]}]
                               (let [this-sym (first args)
                                     tbody (transform-method-body body fields field-map
                                                                  (list '.-eve-env this-sym)
                                                                  (list '.-eve-offset this-sym))]
                                 (list name args (cons 'do tbody))))
                             methods)))
                parsed-protos)]
    `(~'cljs.core/extend-type ~type-name
       ~@transformed-protos)))
