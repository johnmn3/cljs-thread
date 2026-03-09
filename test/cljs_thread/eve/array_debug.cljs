(ns cljs-thread.eve.array-debug
  (:require
   [cljs-thread.eve.shared-atom :as atom]
   [cljs-thread.eve.array :as arr]
   [cljs-thread.eve.deftype-proto.serialize :as ser]))

(defn run-debug []
  (println "=== EveArray debug (swap! path) ===")

  ;; 1. Create one atom (with sab-map loaded for HAMT encoder)
  (let [sa (atom/atom-domain {} :sab-size (* 4 1024 1024) :max-blocks 16384)]
    (println "Atom created.")

    ;; 2. Create array + swap
    (let [a (arr/eve-array :int32 [10 20 30])]
      (println "Array:" (str a) "offset:" (.-offset a))

      (println "\n--- Testing with plain int first ---")
      (let [result1 (swap! sa assoc :x 42)]
        (println "swap! :x result:" (pr-str result1))
        (println "@sa after:" (pr-str @sa)))

      (println "\n--- Now testing with EveArray ---")
      (let [result2 (swap! sa assoc :arr a)]
        (println "swap! :arr result:" (pr-str result2))
        (println "@sa after:" (pr-str @sa))
        (println "keys:" (keys @sa)))

      ;; Also test: does the serializer produce correct bytes?
      (println "\n--- Manual serialize/deserialize ---")
      (let [serialized (ser/serialize-element {:arr a})
            len (.-length serialized)]
        (println "serialized len:" len)
        (doseq [i (range (min len 20))]
          (print (str "0x" (.toString (clojure.core/aget serialized i) 16) " ")))
        (println)
        ;; Deserialize
        (let [env (atom/get-env sa)
              deser (ser/deserialize-element env serialized)]
          (println "deserialized:" (pr-str deser))
          (println "type:" (type deser)))))))
