(ns cljs-thread.eve.typed-array-test
  "Tests for typed array round-trips through EVE atoms.
   Verifies that typed arrays stored in atoms come out as plain typed arrays,
   not eve-wrapped structures."
  (:require
   [cljs.test :refer-macros [deftest testing is]]
   [cljs-thread.eve :as e]))

(deftest typed-array-basic-test
  (testing "Uint8ClampedArray stored in atom comes out as Uint8ClampedArray"
    (let [a (e/atom ::typed-array-basic {})
          result (swap! a (fn [_]
                           (let [arr (js/Uint8ClampedArray. #js [220 235 255 255 100 150 200 255])
                                 stored {:pixels arr}]
                             (is (instance? js/Uint8ClampedArray (:pixels stored))
                                 "Before storage: should be Uint8ClampedArray")
                             stored)))]
      ;; Now read it back
      (let [retrieved (:pixels @a)]
        (is (instance? js/Uint8ClampedArray retrieved)
            "Retrieved value should be Uint8ClampedArray")
        (is (= 8 (.-length retrieved))
            "Length should be preserved")
        (is (= 220 (aget retrieved 0))
            "First byte should be 220")
        (is (= 255 (aget retrieved 3))
            "Alpha should be 255")))))

(deftest typed-array-int32-test
  (testing "Int32Array stored in atom comes out as Int32Array"
    (let [a (e/atom ::typed-array-int32 {})
          _ (swap! a (fn [_]
                       (let [arr (js/Int32Array. #js [-100 0 100 1000])]
                         {:data arr})))]
      (let [retrieved (:data @a)]
        (is (instance? js/Int32Array retrieved))
        (is (= 4 (.-length retrieved)))
        (is (= -100 (aget retrieved 0)))
        (is (= 1000 (aget retrieved 3)))))))

(deftest typed-array-float64-test
  (testing "Float64Array stored in atom comes out as Float64Array"
    (let [a (e/atom ::typed-array-float64 {})
          _ (swap! a (fn [_]
                       (let [arr (js/Float64Array. #js [1.5 2.5 3.14159])]
                         {:floats arr})))]
      (let [retrieved (:floats @a)]
        (is (instance? js/Float64Array retrieved))
        (is (= 3 (.-length retrieved)))
        (is (= 1.5 (aget retrieved 0)))))))

(deftest typed-array-multiple-test
  (testing "Multiple typed arrays in same atom"
    (let [a (e/atom ::typed-array-multiple {})
          _ (swap! a (fn [_]
                       (let [arr1 (js/Uint8Array. #js [1 2 3])
                             arr2 (js/Uint8Array. #js [4 5 6])]
                         {:tile0 arr1 :tile1 arr2})))]
      (let [state @a
            t0 (:tile0 state)
            t1 (:tile1 state)]
        (is (instance? js/Uint8Array t0))
        (is (instance? js/Uint8Array t1))
        (is (= 1 (aget t0 0)))
        (is (= 4 (aget t1 0)))))))

(deftest typed-array-swap-test
  (testing "swap! assoc-in with typed array"
    (let [a (e/atom ::typed-array-swap {})
          _ (swap! a (fn [_] {:tiles {}}))]
      (swap! a (fn [state]
                 (assoc-in state [:tiles 0] (js/Uint8ClampedArray. #js [10 20 30 40]))))
      (swap! a (fn [state]
                 (assoc-in state [:tiles 1] (js/Uint8ClampedArray. #js [50 60 70 80]))))
      (let [state @a
            tiles (:tiles state)]
        (is (= 2 (count tiles)))
        (let [t0 (get tiles 0)
              t1 (get tiles 1)]
          (is (instance? js/Uint8ClampedArray t0))
          (is (instance? js/Uint8ClampedArray t1))
          (is (= 10 (aget t0 0)))
          (is (= 50 (aget t1 0))))))))

(deftest typed-array-accumulate-test
  (testing "Multiple swaps accumulating tiles"
    (let [a (e/atom ::typed-array-accumulate {})
          _ (swap! a (fn [_] {:tiles {}}))]
      (dotimes [i 10]
        (swap! a (fn [state]
                   (assoc-in state [:tiles i]
                             (js/Uint8ClampedArray. #js [(* i 10) (+ (* i 10) 1) (+ (* i 10) 2) 255])))))
      (let [tiles (:tiles @a)]
        (is (= 10 (count tiles)))
        (doseq [i (range 10)]
          (let [tile (get tiles i)]
            (is (instance? js/Uint8ClampedArray tile)
                (str "Tile " i " should be Uint8ClampedArray"))
            (is (= (* i 10) (aget tile 0))
                (str "Tile " i " first byte should be " (* i 10)))))))))

(deftest typed-array-subarray-test
  (testing ".subarray works on retrieved typed array"
    (let [a (e/atom ::typed-array-subarray {})
          _ (swap! a (fn [_]
                       (let [arr (js/Uint8ClampedArray. #js [1 2 3 4 5 6 7 8])]
                         {:data arr})))]
      (let [retrieved (:data @a)
            sub (.subarray retrieved 2 6)]
        (is (instance? js/Uint8ClampedArray sub))
        (is (= 4 (.-length sub)))
        (is (= 3 (aget sub 0)))
        (is (= 6 (aget sub 3)))))))

(deftest typed-array-set-test
  (testing ".set works with retrieved typed array"
    (let [a (e/atom ::typed-array-set {})
          _ (swap! a (fn [_]
                       (let [src (js/Uint8ClampedArray. #js [100 101 102 103])]
                         {:src src})))]
      (let [retrieved (:src @a)
            dest (js/Uint8ClampedArray. 8)]
        (.set dest retrieved 2)
        (is (= 0 (aget dest 0)))
        (is (= 0 (aget dest 1)))
        (is (= 100 (aget dest 2)))
        (is (= 101 (aget dest 3)))
        (is (= 102 (aget dest 4)))
        (is (= 103 (aget dest 5)))))))

(deftest composite-workflow-test
  (testing "raytracer-like workflow: build tiles then composite"
    (let [tile-w 4
          tile-h 4
          img-w 8
          img-h 8
          a (e/atom ::composite-workflow {})
          _ (swap! a (fn [_] {:tiles {}}))]
      ;; Create 4 tiles (2x2 grid), each 4x4 pixels
      ;; Tile 0: red
      (swap! a (fn [state]
                 (let [arr (js/Uint8ClampedArray. (* tile-w tile-h 4))]
                   (dotimes [i (* tile-w tile-h)]
                     (aset arr (+ (* i 4) 0) 255)  ; R
                     (aset arr (+ (* i 4) 1) 0)    ; G
                     (aset arr (+ (* i 4) 2) 0)    ; B
                     (aset arr (+ (* i 4) 3) 255)) ; A
                   (assoc-in state [:tiles 0] arr))))
      ;; Tile 1: green
      (swap! a (fn [state]
                 (let [arr (js/Uint8ClampedArray. (* tile-w tile-h 4))]
                   (dotimes [i (* tile-w tile-h)]
                     (aset arr (+ (* i 4) 0) 0)
                     (aset arr (+ (* i 4) 1) 255)
                     (aset arr (+ (* i 4) 2) 0)
                     (aset arr (+ (* i 4) 3) 255))
                   (assoc-in state [:tiles 1] arr))))
      ;; Tile 2: blue
      (swap! a (fn [state]
                 (let [arr (js/Uint8ClampedArray. (* tile-w tile-h 4))]
                   (dotimes [i (* tile-w tile-h)]
                     (aset arr (+ (* i 4) 0) 0)
                     (aset arr (+ (* i 4) 1) 0)
                     (aset arr (+ (* i 4) 2) 255)
                     (aset arr (+ (* i 4) 3) 255))
                   (assoc-in state [:tiles 2] arr))))
      ;; Tile 3: white
      (swap! a (fn [state]
                 (let [arr (js/Uint8ClampedArray. (* tile-w tile-h 4))]
                   (dotimes [i (* tile-w tile-h)]
                     (aset arr (+ (* i 4) 0) 255)
                     (aset arr (+ (* i 4) 1) 255)
                     (aset arr (+ (* i 4) 2) 255)
                     (aset arr (+ (* i 4) 3) 255))
                   (assoc-in state [:tiles 3] arr))))

      ;; Composite
      (let [result (js/Uint8ClampedArray. (* img-w img-h 4))
            tiles-per-row 2
            tiles (:tiles @a)]
        ;; Verify tiles are valid before composite
        (doseq [i (range 4)]
          (let [tile (get tiles i)]
            (is (instance? js/Uint8ClampedArray tile)
                (str "Tile " i " must be Uint8ClampedArray"))
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

        ;; Top-right pixel (4,0) should be green
        (let [off (* 4 4)]
          (is (= 0 (aget result (+ off 0))) "R of top-right")
          (is (= 255 (aget result (+ off 1))) "G of top-right"))

        ;; Bottom-left pixel (0,4) should be blue
        (let [off (* (* 4 img-w) 4)]
          (is (= 0 (aget result (+ off 0))) "R of bottom-left")
          (is (= 255 (aget result (+ off 2))) "B of bottom-left"))

        ;; Bottom-right pixel (4,4) should be white
        (let [off (+ (* (* 4 img-w) 4) (* 4 4))]
          (is (= 255 (aget result (+ off 0))) "R of bottom-right")
          (is (= 255 (aget result (+ off 1))) "G of bottom-right")
          (is (= 255 (aget result (+ off 2))) "B of bottom-right"))))))
