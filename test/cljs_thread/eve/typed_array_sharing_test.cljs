(ns cljs-thread.eve.typed-array-sharing-test
  "Tests to validate theories about typed array sharing in eve atoms."
  (:require [cljs.test :refer [deftest testing is async]]
            [cljs-thread.eve :as e]))

;; Theory 1: Does deserialization return a copy or a SAB view?
;; If it returns a copy, mutations won't be visible across derefs.

(deftest test-typed-array-mutation-visibility
  (testing "Mutations to typed array should be visible across derefs"
    (let [arr (js/Uint8ClampedArray. 10)
          _ (aset arr 0 42)
          test-atom (e/atom ::test-mutation {:data arr})]

      ;; Get the array from atom
      (let [arr1 (:data @test-atom)]
        ;; Mutate it
        (aset arr1 1 99)

        ;; Get it again
        (let [arr2 (:data @test-atom)]
          ;; Check if mutation is visible
          (is (= 99 (aget arr2 1))
              "Mutation should be visible in subsequent deref - if not, deref returns copies")

          ;; Also check they're the same buffer
          (is (identical? (.-buffer arr1) (.-buffer arr2))
              "Both derefs should return views into same underlying buffer"))))))

;; Theory 2: Is typed-array-encoder registered?

(deftest test-typed-array-encoder-registered
  (testing "typed-array-encoder should be registered for SAB-backed storage"
    ;; We can check this by looking at the serialized size
    ;; SAB-backed: 7 bytes (pointer)
    ;; Inline: 8 + N bytes (header + data)
    (let [arr (js/Uint8ClampedArray. 1000)  ;; 1000 bytes
          test-atom (e/atom ::test-encoder {:data arr})
          ;; Force serialization by derefing
          _ @test-atom]

      ;; If using SAB pointer, the HAMT node should be small
      ;; If inline, the node contains all 1000+ bytes
      ;; We can't directly check this easily, but we can check the behavior

      ;; Get the array and check its buffer
      (let [arr-out (:data @test-atom)]
        (is (instance? js/SharedArrayBuffer (.-buffer arr-out))
            "Typed array buffer should be SharedArrayBuffer, not regular ArrayBuffer")))))

;; Theory 3: Are typed arrays stored as separate SAB blocks or inline?

(deftest test-typed-array-sab-backing
  (testing "Typed array should be backed by SharedArrayBuffer after atom storage"
    (let [;; Create a regular typed array (backed by ArrayBuffer)
          arr (js/Uint8ClampedArray. 100)
          _ (aset arr 0 123)

          ;; Store in atom
          test-atom (e/atom ::test-sab {:buffer arr})]

      ;; Get it back
      (let [arr-out (:buffer @test-atom)]
        ;; Check the buffer type
        (println "Original buffer type:" (type (.-buffer arr)))
        (println "After atom buffer type:" (type (.-buffer arr-out)))
        (println "Original buffer:" (.-buffer arr))
        (println "After atom buffer:" (.-buffer arr-out))

        ;; The key question: is it backed by SAB?
        (is (instance? js/SharedArrayBuffer (.-buffer arr-out))
            "After storing in atom, typed array should be SAB-backed")

        ;; Check the value survived
        (is (= 123 (aget arr-out 0))
            "Value should be preserved after round-trip")))))

;; Additional diagnostic test

(deftest test-cross-deref-identity
  (testing "Multiple derefs should return arrays pointing to same memory"
    (let [arr (js/Uint8ClampedArray. #js [1 2 3 4 5])
          test-atom (e/atom ::test-identity {:arr arr})]

      (let [a1 (:arr @test-atom)
            a2 (:arr @test-atom)
            a3 (:arr @test-atom)]

        (println "a1 buffer:" (.-buffer a1))
        (println "a2 buffer:" (.-buffer a2))
        (println "a3 buffer:" (.-buffer a3))
        (println "a1 === a2:" (identical? a1 a2))
        (println "a1.buffer === a2.buffer:" (identical? (.-buffer a1) (.-buffer a2)))

        ;; Mutate via a1
        (aset a1 0 100)

        ;; Check visibility in a2 and a3
        (println "After mutation - a1[0]:" (aget a1 0))
        (println "After mutation - a2[0]:" (aget a2 0))
        (println "After mutation - a3[0]:" (aget a3 0))

        (is (= 100 (aget a2 0))
            "Mutation via a1 should be visible in a2")
        (is (= 100 (aget a3 0))
            "Mutation via a1 should be visible in a3")))))
