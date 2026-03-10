(ns cljs-thread.eve-atom-transfer-test
  "Test if eve atoms can be transferred through the message system.
   This validates whether we can include eve atoms in channel pair distribution."
  (:require [cljs.test :refer [deftest is testing]]
            [cljs-thread.core :as t])
  (:require-macros [cljs-thread.core :refer [future in]]))

;; ---------------------------------------------------------------------------
;; Basic sanity checks
;; ---------------------------------------------------------------------------

(deftest sanity-check
  (testing "Basic arithmetic"
    (is (= 4 (+ 2 2)))))

(deftest basic-future
  (testing "Future without eve atom"
    (is (= 42 @(future (+ 40 2))))))

;; ---------------------------------------------------------------------------
;; Eve atom transfer via future
;; ---------------------------------------------------------------------------

(deftest eve-atom-read-via-future
  (testing "Eve atom can be passed to future and read there"
    (let [my-atom (t/atom {:test-value 42})]
      (is (= 42 @(future (:test-value @my-atom)))))))

(deftest eve-atom-write-via-future
  (testing "Eve atom can be written to from another worker"
    (let [my-atom (t/atom {:n 0})]
      @(future (swap! my-atom assoc :n 99))
      (is (= 99 (:n @my-atom))))))

;; ---------------------------------------------------------------------------
;; Eve atom transfer via `in` (named workers)
;; ---------------------------------------------------------------------------

(deftest eve-atom-via-in
  (testing "Eve atom conveyed via in macro"
    (let [my-atom (t/atom {:value "hello"})]
      (is (= "hello" @(in :core [my-atom] (:value @my-atom)))))))

;; ---------------------------------------------------------------------------
;; Multiple eve atoms
;; ---------------------------------------------------------------------------

(deftest multiple-eve-atoms
  (testing "Multiple eve atoms in single message"
    (let [atom-a (t/atom {:a 1})
          atom-b (t/atom {:b 2})]
      (is (= 3 @(future (+ (:a @atom-a) (:b @atom-b))))))))

;; ---------------------------------------------------------------------------
;; Eve atom + SAB in same message (simulating sync channel)
;; ---------------------------------------------------------------------------

(deftest eve-atom-with-sab
  (testing "Eve atom and raw SAB can be passed together"
    (let [response-atom (t/atom nil)
          signal-sab (js/SharedArrayBuffer. 8)]
      ;; Pass both to a future
      @(future [response-atom signal-sab]
         (reset! response-atom {:response "from-worker"})
         (let [i32 (js/Int32Array. signal-sab)]
           (js/Atomics.store i32 0 1)
           (js/Atomics.notify i32 0 1))
         :done)
      ;; Verify atom was written
      (is (= {:response "from-worker"} @response-atom)))))

;; ---------------------------------------------------------------------------
;; Full sync pattern: atom + SAB for blocking response
;; ---------------------------------------------------------------------------

(deftest sync-pattern-with-eve-atom
  (testing "Use eve atom + SAB for sync response delivery"
    (let [response-atom (t/atom nil)
          signal-sab (js/SharedArrayBuffer. 8)
          signal-i32 (js/Int32Array. signal-sab)]
      ;; Spawn future that writes to atom and signals
      (future [response-atom signal-sab]
        (let [result (* 6 7)]
          (reset! response-atom result)
          (let [i32 (js/Int32Array. signal-sab)]
            (js/Atomics.store i32 0 1)
            (js/Atomics.notify i32 0 1))))
      ;; Block waiting for signal
      (js/Atomics.wait signal-i32 0 0 5000)
      ;; Read result from atom
      (is (= 42 @response-atom)))))
