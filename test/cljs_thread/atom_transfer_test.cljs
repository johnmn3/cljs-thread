(ns cljs-thread.atom-transfer-test
  "Tests for typed array round-trips through EVE atoms.
   Verifies that typed arrays stored in atoms come out as plain typed arrays,
   not eve-wrapped structures.

   Pure cljs.test — the external test runner discovers and executes
   these tests inside a worker with synchronous blocking semantics."
  (:require
   [cljs.test :refer [deftest is testing]]
   [cljs-thread.core :as t])
  (:require-macros [cljs-thread.core :refer [future]]))

;; ---------------------------------------------------------------------------
;; Single-thread typed array tests
;; ---------------------------------------------------------------------------

(deftest typed-array-in-atom-single-thread
  (testing "Uint8ClampedArray stored in atom comes out as Uint8ClampedArray"
    (let [arr (js/Uint8ClampedArray. #js [220 235 255 255 100 150 200 255])
          a (t/atom {:pixels arr})]
      (let [retrieved (get @a :pixels)]
        (is (instance? js/Uint8ClampedArray retrieved)
            "Retrieved value should be Uint8ClampedArray")
        (is (= 8 (.-length retrieved))
            "Length should be preserved")
        (is (= 220 (aget retrieved 0))
            "First byte should be 220")
        (is (= 255 (aget retrieved 3))
            "Alpha should be 255"))))

  (testing "Int32Array stored in atom comes out as Int32Array"
    (let [arr (js/Int32Array. #js [-100 0 100 1000])
          a (t/atom {:data arr})]
      (let [retrieved (get @a :data)]
        (is (instance? js/Int32Array retrieved))
        (is (= 4 (.-length retrieved)))
        (is (= -100 (aget retrieved 0)))
        (is (= 1000 (aget retrieved 3))))))

  (testing "Float64Array stored in atom comes out as Float64Array"
    (let [arr (js/Float64Array. #js [1.5 2.5 3.14159])
          a (t/atom {:floats arr})]
      (let [retrieved (get @a :floats)]
        (is (instance? js/Float64Array retrieved))
        (is (= 3 (.-length retrieved)))
        (is (= 1.5 (aget retrieved 0))))))

  (testing "Multiple typed arrays in same atom"
    (let [arr1 (js/Uint8Array. #js [1 2 3])
          arr2 (js/Uint8Array. #js [4 5 6])
          a (t/atom {:tile0 arr1 :tile1 arr2})]
      (let [state @a
            t0 (get state :tile0)
            t1 (get state :tile1)]
        (is (instance? js/Uint8Array t0))
        (is (instance? js/Uint8Array t1))
        (is (= 1 (aget t0 0)))
        (is (= 4 (aget t1 0)))))))

;; ---------------------------------------------------------------------------
;; Swap! with typed arrays
;; ---------------------------------------------------------------------------

(deftest typed-array-swap-test
  (testing "swap! assoc-in with typed array"
    (let [a (t/atom {:tiles {}})]
      (swap! a assoc-in [:tiles 0] (js/Uint8ClampedArray. #js [10 20 30 40]))
      (swap! a assoc-in [:tiles 1] (js/Uint8ClampedArray. #js [50 60 70 80]))
      (let [state @a
            tiles (:tiles state)]
        (is (= 2 (count tiles)))
        (let [t0 (get tiles 0)
              t1 (get tiles 1)]
          (is (instance? js/Uint8ClampedArray t0))
          (is (instance? js/Uint8ClampedArray t1))
          (is (= 10 (aget t0 0)))
          (is (= 50 (aget t1 0)))))))

  (testing "Multiple swaps accumulating tiles"
    (let [a (t/atom {:tiles {}})]
      (dotimes [i 10]
        (swap! a assoc-in [:tiles i]
               (js/Uint8ClampedArray. #js [(* i 10) (+ (* i 10) 1) (+ (* i 10) 2) 255])))
      (let [tiles (:tiles @a)]
        (is (= 10 (count tiles)))
        (doseq [i (range 10)]
          (let [tile (get tiles i)]
            (is (instance? js/Uint8ClampedArray tile)
                (str "Tile " i " should be Uint8ClampedArray"))
            (is (= (* i 10) (aget tile 0))
                (str "Tile " i " first byte should be " (* i 10)))))))))

;; ---------------------------------------------------------------------------
;; Typed array operations after retrieval
;; ---------------------------------------------------------------------------

(deftest typed-array-operations-test
  (testing ".subarray works on retrieved typed array"
    (let [arr (js/Uint8ClampedArray. #js [1 2 3 4 5 6 7 8])
          a (t/atom {:data arr})]
      (let [retrieved (get @a :data)
            sub (.subarray retrieved 2 6)]
        (is (instance? js/Uint8ClampedArray sub))
        (is (= 4 (.-length sub)))
        (is (= 3 (aget sub 0)))
        (is (= 6 (aget sub 3))))))

  (testing ".set works with retrieved typed array"
    (let [src (js/Uint8ClampedArray. #js [100 101 102 103])
          a (t/atom {:src src})]
      (let [retrieved (get @a :src)
            dest (js/Uint8ClampedArray. 8)]
        (.set dest retrieved 2)
        (is (= 0 (aget dest 0)))
        (is (= 0 (aget dest 1)))
        (is (= 100 (aget dest 2)))
        (is (= 101 (aget dest 3)))
        (is (= 102 (aget dest 4)))
        (is (= 103 (aget dest 5)))))))

;; ---------------------------------------------------------------------------
;; Multi-thread tests (run in worker context with cljs-thread initialized)
;; ---------------------------------------------------------------------------

(deftest typed-array-cross-thread-test
  (testing "typed array survives cross-thread atom access"
    (let [arr (js/Uint8ClampedArray. #js [200 201 202 203])
          a (t/atom {:shared-pixels arr})]
      ;; Send atom to another worker, read it there, return the values
      (let [result @(future
                      (let [state @a
                            pixels (get state :shared-pixels)]
                        {:is-typed-array (instance? js/Uint8ClampedArray pixels)
                         :length (when pixels (.-length pixels))
                         :first-byte (when pixels (aget pixels 0))
                         :has-subarray (when pixels (fn? (.-subarray pixels)))}))]
        (is (:is-typed-array result)
            "Should be Uint8ClampedArray on worker")
        (is (= 4 (:length result))
            "Length should be 4")
        (is (= 200 (:first-byte result))
            "First byte should be 200")
        (is (:has-subarray result)
            "Should have subarray method")))))

(deftest typed-array-worker-write-test
  (testing "worker can write typed array to shared atom"
    (let [a (t/atom {:tiles {}})]
      ;; Worker writes a typed array into the atom
      @(future
         (let [arr (js/Uint8ClampedArray. #js [50 100 150 255])]
           (swap! a assoc-in [:tiles 0] arr)
           :done))
      ;; Read it back on this worker
      (let [tiles (:tiles @a)
            tile0 (get tiles 0)]
        (is (instance? js/Uint8ClampedArray tile0)
            "Tile written by worker should be Uint8ClampedArray")
        (is (= 50 (aget tile0 0))
            "First byte should be 50")))))

(deftest multiple-workers-write-tiles-test
  (testing "multiple workers writing tiles to shared atom"
    (let [a (t/atom {:tiles {} :count 0})]
      ;; Launch 4 futures, each writing a tile
      (let [handles [(future
                       (let [arr (js/Uint8ClampedArray. #js [10 11 12 255])]
                         (swap! a assoc-in [:tiles 0] arr)
                         (swap! a update :count inc)
                         0))
                     (future
                       (let [arr (js/Uint8ClampedArray. #js [20 21 22 255])]
                         (swap! a assoc-in [:tiles 1] arr)
                         (swap! a update :count inc)
                         1))
                     (future
                       (let [arr (js/Uint8ClampedArray. #js [30 31 32 255])]
                         (swap! a assoc-in [:tiles 2] arr)
                         (swap! a update :count inc)
                         2))
                     (future
                       (let [arr (js/Uint8ClampedArray. #js [40 41 42 255])]
                         (swap! a assoc-in [:tiles 3] arr)
                         (swap! a update :count inc)
                         3))]]
        ;; Wait for all to complete
        (doseq [h handles] @h)
        (let [state @a
              tiles (:tiles state)]
          ;; Verify all 4 tiles exist and are typed arrays
          (is (= 4 (count tiles))
              "Should have 4 tiles")
          (doseq [i (range 4)]
            (let [tile (get tiles i)]
              (is (instance? js/Uint8ClampedArray tile)
                  (str "Tile " i " should be Uint8ClampedArray"))
              (is (= (+ (* (inc i) 10) 0) (aget tile 0))
                  (str "Tile " i " R should be " (* (inc i) 10)))
              (is (= 255 (aget tile 3))
                  (str "Tile " i " A should be 255")))))))))

;; ---------------------------------------------------------------------------
;; Composite operation test (like raytracer does)
;; ---------------------------------------------------------------------------

(deftest composite-workflow-test
  (testing "raytracer-like workflow: workers write tiles, main composites"
    (let [tile-w 4
          tile-h 4
          img-w 8
          img-h 8
          a (t/atom {:tiles {}})]
      ;; 4 tiles (2x2 grid), each 4x4 pixels
      (let [handles [(future
                       ;; Tile 0: top-left, red
                       (let [arr (js/Uint8ClampedArray. (* tile-w tile-h 4))]
                         (dotimes [i (* tile-w tile-h)]
                           (aset arr (+ (* i 4) 0) 255)  ; R
                           (aset arr (+ (* i 4) 1) 0)    ; G
                           (aset arr (+ (* i 4) 2) 0)    ; B
                           (aset arr (+ (* i 4) 3) 255)) ; A
                         (swap! a assoc-in [:tiles 0] arr)
                         0))
                     (future
                       ;; Tile 1: top-right, green
                       (let [arr (js/Uint8ClampedArray. (* tile-w tile-h 4))]
                         (dotimes [i (* tile-w tile-h)]
                           (aset arr (+ (* i 4) 0) 0)
                           (aset arr (+ (* i 4) 1) 255)
                           (aset arr (+ (* i 4) 2) 0)
                           (aset arr (+ (* i 4) 3) 255))
                         (swap! a assoc-in [:tiles 1] arr)
                         1))
                     (future
                       ;; Tile 2: bottom-left, blue
                       (let [arr (js/Uint8ClampedArray. (* tile-w tile-h 4))]
                         (dotimes [i (* tile-w tile-h)]
                           (aset arr (+ (* i 4) 0) 0)
                           (aset arr (+ (* i 4) 1) 0)
                           (aset arr (+ (* i 4) 2) 255)
                           (aset arr (+ (* i 4) 3) 255))
                         (swap! a assoc-in [:tiles 2] arr)
                         2))
                     (future
                       ;; Tile 3: bottom-right, white
                       (let [arr (js/Uint8ClampedArray. (* tile-w tile-h 4))]
                         (dotimes [i (* tile-w tile-h)]
                           (aset arr (+ (* i 4) 0) 255)
                           (aset arr (+ (* i 4) 1) 255)
                           (aset arr (+ (* i 4) 2) 255)
                           (aset arr (+ (* i 4) 3) 255))
                         (swap! a assoc-in [:tiles 3] arr)
                         3))]]
        ;; Wait for all futures
        (doseq [h handles] @h)

        ;; Composite like raytracer does
        (let [result (js/Uint8ClampedArray. (* img-w img-h 4))
              tiles-per-row 2
              tiles (:tiles @a)]
          ;; Verify tiles are valid before composite
          (doseq [i (range 4)]
            (let [tile (get tiles i)]
              (is (instance? js/Uint8ClampedArray tile)
                  (str "Tile " i " must be Uint8ClampedArray before composite"))
              (is (fn? (.-subarray tile))
                  (str "Tile " i " must have .subarray"))))

          ;; Do the composite
          (dotimes [tile-idx 4]
            (when-let [tile-buf (get tiles tile-idx)]
              (let [tile-col (mod tile-idx tiles-per-row)
                    tile-row (js/Math.floor (/ tile-idx tiles-per-row))
                    start-x (* tile-col tile-w)
                    start-y (* tile-row tile-h)
                    row-bytes (* tile-w 4)]
                (dotimes [ly tile-h]
                  (let [src-off (* ly tile-w 4)
                        dst-off (* (+ (* (+ start-y ly) img-w) start-x) 4)]
                    (.set result (.subarray tile-buf src-off (+ src-off row-bytes)) dst-off))))))

          ;; Verify composite result
          ;; Top-left pixel (0,0) should be red
          (is (= 255 (aget result 0)) "R of top-left")
          (is (= 0 (aget result 1)) "G of top-left")
          (is (= 0 (aget result 2)) "B of top-left")
          (is (= 255 (aget result 3)) "A of top-left")

          ;; Top-right pixel (4,0) should be green
          (let [off (* 4 4)] ; x=4, y=0
            (is (= 0 (aget result (+ off 0))) "R of top-right")
            (is (= 255 (aget result (+ off 1))) "G of top-right"))

          ;; Bottom-left pixel (0,4) should be blue
          (let [off (* (* 4 img-w) 4)] ; x=0, y=4
            (is (= 0 (aget result (+ off 0))) "R of bottom-left")
            (is (= 0 (aget result (+ off 1))) "G of bottom-left")
            (is (= 255 (aget result (+ off 2))) "B of bottom-left"))

          ;; Bottom-right pixel (4,4) should be white
          (let [off (+ (* (* 4 img-w) 4) (* 4 4))] ; x=4, y=4
            (is (= 255 (aget result (+ off 0))) "R of bottom-right")
            (is (= 255 (aget result (+ off 1))) "G of bottom-right")
            (is (= 255 (aget result (+ off 2))) "B of bottom-right")))))))
