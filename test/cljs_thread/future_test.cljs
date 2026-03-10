(ns cljs-thread.future-test
  "Test future - eve atom pool without coordinator thread.
   NOTE: Tests are commented out with #_ pending full integration.")

;; ---------------------------------------------------------------------------
;; Basic future tests
;; ---------------------------------------------------------------------------

#_
(deftest simple-future
  (testing "Simple future returns result"
    (is (= 42 @(future (+ 40 2))))))

#_
(deftest future-with-binding
  (testing "Future with binding conveyance"
    (let [x 10]
      (is (= 20 @(future (* x 2)))))))

#_
(deftest nested-future
  (testing "Nested future doesn't deadlock"
    (is (= 99 @(future @(future 99))))))

#_
(deftest cross-worker-notify-future
  (testing "Worker A waits, Worker B notifies via SAB"
    (is (= {:status "ok" :value 42}
           @(future
              (let [sab (js/SharedArrayBuffer. 16)
                    i32 (js/Int32Array. sab)]
                ;; Tell another future to notify us after a delay
                @(future
                  (js/setTimeout
                    (fn []
                      (let [view (js/Int32Array. sab)]
                        (aset view 1 42)
                        (js/Atomics.store view 0 1)
                        (js/Atomics.notify view 0 1)))
                    100))
                ;; Wait for notification
                (let [result (js/Atomics.wait i32 0 0 2000)
                      value (aget i32 1)]
                  {:status result :value value})))))))
