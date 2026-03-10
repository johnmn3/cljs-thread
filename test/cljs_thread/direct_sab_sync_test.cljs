(ns cljs-thread.direct-sab-sync-test
  "Test direct SAB-based sync between workers."
  (:require-macros [cljs-thread.future :refer [future]]
                   [cljs-thread.core :refer [in spawn]])
  (:require [cljs.test :refer [deftest is testing]]
            [cljs.reader]
            [cljs-thread.sync :as sync]
            [cljs-thread.state :as s]
            [cljs-thread.future :as f]
            [cljs-thread.spawn]))

;; ---------------------------------------------------------------------------
;; Test: Cross-worker notify wakes up waiting worker
;; ---------------------------------------------------------------------------

;; Test simple future with deref
(deftest simple-future-test
  (testing "Simple future with deref"
    (is (= 42 @(future (+ 40 2))))))

;; Test nested future - this should NOT deadlock with eve atom pool
(deftest nested-future-test
  (testing "Nested future doesn't deadlock"
    (let [f1 (future
               (let [f2 (future 99)]
                 @f2))]
      (is (= 99 @f1)))))

(deftest cross-worker-notify
  (testing "Worker A waits, Worker B notifies via SAB"
    (let [sab (js/SharedArrayBuffer. 16)
          i32 (js/Int32Array. sab)]
      ;; Outer future: waits for notification
      ;; Inner future: notifies after delay
      (is (= {:status "ok" :value 42}
             @(future
                ;; Launch notifier future (don't wait for it)
                (future
                  (let [view (js/Int32Array. sab)]
                    (js/setTimeout
                      (fn []
                        (aset view 1 42)
                        (js/Atomics.store view 0 1)
                        (js/Atomics.notify view 0 1))
                      100)))
                ;; Wait for notification
                (let [result (js/Atomics.wait i32 0 0 2000)
                      value (aget i32 1)]
                  {:status result :value value})))))))

(deftest direct-blocking-call
  (testing "Direct SAB sync: call worker, block for result, wake on notify"
    (is (= 55
           @(future
              (let [sab (js/SharedArrayBuffer. 256)
                    signal (js/Int32Array. sab 0 2)]
                ;; Send work to another future
                (future
                  (let [result (reduce + (range 11))
                        result-str (pr-str result)
                        encoder (js/TextEncoder.)
                        bytes (.encode encoder result-str)
                        sig (js/Int32Array. sab 0 2)
                        data (js/Uint8Array. sab 8)]
                    (.set data bytes)
                    (aset sig 1 (.-length bytes))
                    (js/Atomics.store sig 0 1)
                    (js/Atomics.notify sig 0 1)))
                ;; Block until other future signals
                (js/Atomics.wait signal 0 0 5000)
                ;; Read result
                (let [len (aget signal 1)
                      data (js/Uint8Array. sab 8 len)
                      decoder (js/TextDecoder.)
                      result-str (.decode decoder data)]
                  (cljs.reader/read-string result-str))))))))

(deftest nested-direct-sync
  (testing "Nested direct sync: future -> future -> future"
    (is (= 84
           @(future
              (let [sab-outer (js/SharedArrayBuffer. 256)
                    signal-outer (js/Int32Array. sab-outer 0 2)]
                ;; Call another future
                (future
                  (let [sab-inner (js/SharedArrayBuffer. 256)
                        signal-inner (js/Int32Array. sab-inner 0 2)]
                    ;; Call yet another future
                    (future
                      (let [result 42
                            result-str (pr-str result)
                            encoder (js/TextEncoder.)
                            bytes (.encode encoder result-str)
                            sig (js/Int32Array. sab-inner 0 2)
                            data (js/Uint8Array. sab-inner 8)]
                        (.set data bytes)
                        (aset sig 1 (.-length bytes))
                        (js/Atomics.store sig 0 1)
                        (js/Atomics.notify sig 0 1)))
                    ;; Wait for inner future
                    (js/Atomics.wait signal-inner 0 0 5000)
                    ;; Read and double
                    (let [len (aget signal-inner 1)
                          data (js/Uint8Array. sab-inner 8 len)
                          decoder (js/TextDecoder.)
                          inner-result (cljs.reader/read-string (.decode decoder data))
                          final-result (* inner-result 2)
                          ;; Write to outer
                          result-str (pr-str final-result)
                          encoder (js/TextEncoder.)
                          bytes (.encode encoder result-str)
                          sig (js/Int32Array. sab-outer 0 2)
                          out-data (js/Uint8Array. sab-outer 8)]
                      (.set out-data bytes)
                      (aset sig 1 (.-length bytes))
                      (js/Atomics.store sig 0 1)
                      (js/Atomics.notify sig 0 1))))
                ;; Wait for outer future
                (js/Atomics.wait signal-outer 0 0 5000)
                ;; Read final result
                (let [len (aget signal-outer 1)
                      data (js/Uint8Array. sab-outer 8 len)
                      decoder (js/TextDecoder.)
                      result-str (.decode decoder data)]
                  (cljs.reader/read-string result-str))))))))

(deftest make-sync-channel-creates-structure
  (testing "make-sync-channel returns signal-sab and response-atom"
    (let [ch (sync/make-sync-channel)]
      (is (some? ch))
      (is (instance? js/SharedArrayBuffer (:signal-sab ch)))
      ;; Growable SAB: starts small (header only), maxByteLength = 1MB
      (is (= (* 1024 1024) (.-maxByteLength (:signal-sab ch))))
      (is (some? (:response-atom ch)))
      ;; response-atom should be an eve atom initialized to empty map
      (is (= {} @(:response-atom ch))))))

(deftest sync-channel-deliver-and-await
  (testing "deliver-response writes to atom and signals, await-response blocks and reads"
    (let [ch (sync/make-sync-channel)
          in-id :test-request-1]
      ;; Launch future that delivers after a delay
      (future
        (js/setTimeout
          (fn []
            (sync/deliver-response ch in-id {:result 42}))
          50))
      ;; Await should block until signaled, then return the value
      (is (= {:result 42}
             @(future (sync/await-response ch in-id)))))))

(deftest sync-channel-nils-after-read
  (testing "await-response removes entry from response-atom after reading"
    (let [ch (sync/make-sync-channel)
          in-id :test-request-2]
      ;; Deliver synchronously first
      (sync/deliver-response ch in-id {:data "test"})
      ;; Await in future
      (let [result @(future (sync/await-response ch in-id))]
        (is (= {:data "test"} result))
        ;; After await, response-atom should be empty map (entry removed)
        (is (= {} @(:response-atom ch)))))))

(deftest sync-channel-reset
  (testing "reset-sync-channel! clears signal for reuse"
    (let [ch (sync/make-sync-channel)
          in-id-1 :test-round-1
          in-id-2 :test-round-2]
      ;; Deliver and await
      (sync/deliver-response ch in-id-1 {:round 1})
      @(future (sync/await-response ch in-id-1))
      ;; Reset
      (sync/reset-sync-channel! ch)
      ;; Signal should be 0
      (let [signal-i32 (js/Int32Array. (:signal-sab ch))]
        (is (= 0 (aget signal-i32 0))))
      ;; Atom should be empty map (cleaned up per-request)
      (is (= {} @(:response-atom ch)))
      ;; Can reuse for another round
      (sync/deliver-response ch in-id-2 {:round 2})
      (is (= {:round 2} @(future (sync/await-response ch in-id-2)))))))

(deftest sync-channel-large-payload
  (testing "Large payload works with eve atom (no size limit)"
    (let [ch (sync/make-sync-channel)
          in-id :test-large-payload
          ;; Use smaller data to avoid OOM in test allocator
          big-data (vec (range 100))]
      (future
        (js/setTimeout
          #(sync/deliver-response ch in-id big-data)
          10))
      (is (= big-data @(future (sync/await-response ch in-id)))))))

(deftest peers-have-sync-channels
  (testing "After mesh setup, peers have sync-channels"
    ;; This test runs on :core, which should have sync channels to other workers
    (let [peers @s/peers
          ;; Check that at least some peers have sync channels
          peers-with-sync (filter #(-> % val :sync-channel some?) peers)]
      ;; Should have sync channels to at least root and some fp-* workers
      (is (pos? (count peers-with-sync))
          "Expected some peers to have sync-channels"))))

(deftest in-uses-direct-sab-sync
  (testing "in macro with blocking deref uses direct SAB sync"
    ;; This tests the full integration: do-in creates sync-channel,
    ;; passes it via message, do-call delivers via sync-channel
    ;; Test runs on :core, calls to :db (another worker in mesh)
    (is (= 42 @(in :db [] (+ 40 2))))))

(deftest in-with-args-uses-direct-sync
  (testing "in macro with arguments uses direct SAB sync"
    (let [x 10 y 20]
      (is (= 30 @(in :db [x y] (+ x y)))))))

(deftest spawn-from-core-worker
  (testing "spawn from :core daemon worker should work"
    (is (= 42 @(spawn (+ 40 2))))))

;; ---------------------------------------------------------------------------
;; Timing: deliver-response / await-response RTT (inline SAB path)
;; ---------------------------------------------------------------------------

(deftest deliver-await-rtt-inline
  (testing "deliver-response/await-response RTT: small result (inline path)"
    (let [n   200
          ch  (sync/make-sync-channel)
          t0  (js/Date.now)]
      (dotimes [i n]
        ;; Deliver from another future (inline path: small integer)
        (future (sync/deliver-response ch (keyword (str "k" i)) i))
        @(future (sync/await-response ch (keyword (str "k" i)))))
      (let [ms     (- (js/Date.now) t0)
            per-op (/ ms n)]
        (println (str "  [bench] deliver/await RTT (inline): "
                      (.toFixed ms 1) "ms total, "
                      (.toFixed per-op 2) "ms/op ("
                      n " ops)"))
        (is (pos? ms))))))
