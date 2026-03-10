(ns cljs-thread.eve
  "Macro companions for the cljs-thread.eve public API.

   Exposes:
     deftype      — define a SAB-backed type  (delegates to eve-deftype)
     extend-type  — extend protocols on a SAB-backed type (delegates to eve-extend-type)"
  (:refer-clojure :exclude [deftype extend-type])
  (:require [eve.deftype]))

(defmacro deftype
  "Define a SAB-backed type. Fields support type hints for optimized storage.

   Field metadata:
     ^:int32, ^:uint32, ^:float32, ^:float64 — primitive SAB fields
     ^:MyEveType — reference to another eve/deftype (stored as offset)
     (no hint) — serialized, any Clojure value

   Mutability:
     (default) — immutable, set at construction
     ^:mutable — mutable via set! (single-worker)
     ^:volatile-mutable — atomic via set!/cas! (cross-worker)

   Example:
     (eve/deftype Counter [^:mutable ^:int32 count label]
       ICounted
       (-count [this] count))"
  [& args]
  `(eve.deftype/eve-deftype ~@args))

(defmacro extend-type
  "Extend protocols to an existing eve/deftype. Field names from the type's
   declaration are available as local bindings in method bodies. set! and cas!
   on declared fields are rewritten to SAB operations.

   Example:
     (eve/extend-type Counter
       IIncable
       (-inc! [this]
         (set! count (inc count))
         this))"
  [& args]
  `(eve.deftype/eve-extend-type ~@args))
