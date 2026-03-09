(ns cljs-thread.typed-array-sharing-test
  "Tests to validate typed array behavior in eve atoms.

   Correct behavior:
   - Inside swap!/reset!: typed arrays ARE SAB-backed, mutations visible across threads
   - After deref: you get a thread-local COPY, mutations are NOT shared

   These tests validate that the above contract is maintained."
  (:require [cljs.test :refer [deftest is testing]]
            [cljs-thread.eve :as eve]))

;; ============================================================================
;; Test 1: Deref returns thread-local copies (correct behavior)
;;
;; When you deref an atom, you get a copy. Mutations to the copy
;; should NOT be visible in subsequent derefs.
;; ============================================================================

(deftest deref-returns-independent-copies
  (testing "Deref should return thread-local copies, not shared references.
            Mutations to a deref'd array should NOT affect subsequent derefs."
    (let [arr (js/Uint8ClampedArray. 10)
          _ (aset arr 0 42)
          test-atom (eve/atom ::test-copy {:data arr})]

      ;; Get a copy via deref
      (let [copy1 (:data @test-atom)]
        ;; Mutate the local copy
        (aset copy1 5 99)

        ;; Get another copy via fresh deref
        (let [copy2 (:data @test-atom)]
          ;; The mutation should NOT be visible - copy2 is independent
          (is (= 0 (aget copy2 5))
              "Mutation to copy1 should NOT be visible in copy2 - they're independent copies")
          ;; But copy1 should still have our mutation
          (is (= 99 (aget copy1 5))
              "copy1 should retain its local mutation"))))))

(deftest deref-copies-have-independent-buffers
  (testing "Each deref should return a typed array with its own buffer."
    (let [arr (js/Uint8ClampedArray. 100)
          test-atom (eve/atom ::test-buffers {:buffer arr})]

      (let [arr1 (:buffer @test-atom)
            arr2 (:buffer @test-atom)]

        (is (not (identical? (.-buffer arr1) (.-buffer arr2)))
            "Each deref should return an independent buffer (thread-local copy)")))))

;; ============================================================================
;; Test 2: Mutations inside swap! are visible
;;
;; The typed array INSIDE the atom (accessed via swap!) should be SAB-backed.
;; Mutations made there should be visible in subsequent derefs.
;; ============================================================================

(deftest swap-mutations-are-visible
  (testing "Mutations made inside swap! should be visible in subsequent derefs."
    (let [arr (js/Uint8ClampedArray. 10)
          test-atom (eve/atom ::test-swap {:data arr})]

      ;; Mutate inside swap!
      (swap! test-atom
        (fn [state]
          (let [arr (:data state)]
            (aset arr 3 77)
            (aset arr 7 88))
          state))

      ;; Deref and check - mutations should be visible
      (let [result (:data @test-atom)]
        (is (= 77 (aget result 3))
            "Mutation made inside swap! should be visible after deref")
        (is (= 88 (aget result 7))
            "Mutation made inside swap! should be visible after deref")))))

(deftest swap-array-is-sab-backed
  (testing "Inside swap!, the typed array should be backed by SharedArrayBuffer."
    (let [arr (js/Uint8ClampedArray. 100)
          test-atom (eve/atom ::test-sab {:buffer arr})
          sab-backed? (atom false)]

      ;; Check if SAB-backed inside swap!
      (swap! test-atom
        (fn [state]
          (let [arr (:buffer state)]
            (reset! sab-backed? (instance? js/SharedArrayBuffer (.-buffer arr))))
          state))

      (is @sab-backed?
          "Typed array inside swap! should be backed by SharedArrayBuffer"))))

;; ============================================================================
;; Test 3: Values survive round-trip
;;
;; Data stored in atom should be retrievable with correct values.
;; ============================================================================

(deftest values-survive-round-trip
  (testing "Typed array values should survive storage and retrieval."
    (let [arr (js/Uint8ClampedArray. #js [10 20 30 40 50])
          test-atom (eve/atom ::test-roundtrip {:arr arr})]

      (let [result (:arr @test-atom)]
        (is (= 10 (aget result 0)) "Value at index 0 should survive")
        (is (= 20 (aget result 1)) "Value at index 1 should survive")
        (is (= 30 (aget result 2)) "Value at index 2 should survive")
        (is (= 40 (aget result 3)) "Value at index 3 should survive")
        (is (= 50 (aget result 4)) "Value at index 4 should survive")))))
