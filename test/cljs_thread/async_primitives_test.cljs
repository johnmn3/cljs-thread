(ns cljs-thread.async-primitives-test
  "Tests to validate primitives for direct async callbacks (no coordinator).

   Assumptions to validate:
   1. A worker knows its own id
   2. A worker can send its id to another worker
   3. The responder can use `in` to send back to the requester by id
   4. A worker can maintain a local callback registry
   5. Round-trip: requester -> responder -> requester works"
  (:require [cljs.test :refer [deftest is testing]]
            [cljs-thread.env :as env])
  (:require-macros [cljs-thread.core :refer [in future]]))

;; Local callback registry (per-worker)
(defonce ^:private callback-registry (atom {}))

(defn register-callback!
  "Store a callback locally, keyed by request-id."
  [request-id callback]
  (swap! callback-registry assoc request-id callback))

(defn invoke-callback!
  "Look up and invoke a callback, removing it from registry."
  [request-id result]
  (when-let [cb (get @callback-registry request-id)]
    (swap! callback-registry dissoc request-id)
    (cb result)))

;; ==========================================================================
;; Primitive tests
;; ==========================================================================

(deftest worker-knows-own-id
  (testing "A worker can determine its own id"
    (let [my-id (:id env/data)]
      (is (keyword? my-id) "Worker should have a keyword id")
      (is (some? my-id) "Worker id should not be nil"))))

(deftest worker-can-send-id-to-another
  (testing "Worker can send its id to another worker and get it back"
    (let [my-id (:id env/data)
          received-id @(in :db [my-id]
                         ;; :db receives my-id, returns it
                         my-id)]
      (is (= my-id received-id) "Should receive back our own id"))))

(deftest responder-can-send-to-requester-by-id
  (testing "Responder can use `in` to send back to requester by id"
    ;; We send our id to :db, :db uses `in` to send a value back to us
    (let [my-id (:id env/data)
          secret-value 12345
          ;; This is blocking - :db will use `in` to send back to us
          result @(in :db [my-id secret-value]
                   ;; :db sends the secret value back to requester
                   @(in my-id [secret-value]
                     ;; This runs on the original requester
                     (* secret-value 2)))]
      (is (= 24690 result) "Responder should be able to send back to requester"))))

(deftest local-callback-registry-works
  (testing "Local callback registry can store and invoke callbacks"
    (let [result-atom (atom nil)
          req-id "test-req-123"]
      ;; Register a callback
      (register-callback! req-id (fn [result] (reset! result-atom result)))
      ;; Invoke it
      (invoke-callback! req-id {:value 42})
      ;; Check result
      (is (= {:value 42} @result-atom) "Callback should have been invoked")
      ;; Callback should be removed
      (is (nil? (get @callback-registry req-id)) "Callback should be removed after invocation"))))

(deftest async-round-trip-simulation
  (testing "Simulate async round-trip: register callback, send request, receive response"
    (let [my-id (:id env/data)
          req-id (str (random-uuid))
          result-promise (js/Promise.
                          (fn [resolve reject]
                            ;; Step 1: Register callback locally
                            (register-callback! req-id resolve)))
          ;; Step 2: Send request to :db with our id and req-id
          _ @(in :db [my-id req-id]
              ;; Step 3: :db computes result and sends back to requester
              (let [result (* 6 7)]
                @(in my-id [req-id result]
                  ;; Step 4: This runs on requester, invokes the callback
                  (invoke-callback! req-id result))))
          ;; Step 5: Wait for promise to resolve
          final-result (atom nil)]
      ;; The callback should have been invoked by now (blocking `in` completed)
      (.then result-promise (fn [v] (reset! final-result v)))
      ;; Give it a moment
      (is (= 42 @final-result) "Async round-trip should work"))))

(deftest nested-async-round-trip
  (testing "Nested async: A -> B -> C -> B -> A"
    (let [my-id (:id env/data)
          result @(in :db [my-id]
                   ;; On :db, call :core, then send result back
                   (let [from-core @(in :core [] (+ 10 20 30))]
                     ;; Now send back to original requester
                     @(in my-id [from-core]
                       ;; Back on original requester
                       (* from-core 2))))]
      (is (= 120 result) "Nested async should work: (10+20+30)*2 = 120"))))

(deftest multiple-concurrent-async
  (testing "Multiple concurrent async requests don't interfere"
    (let [my-id (:id env/data)
          req-id-1 (str (random-uuid))
          req-id-2 (str (random-uuid))
          result-1 (atom nil)
          result-2 (atom nil)]
      ;; Register two callbacks
      (register-callback! req-id-1 (fn [r] (reset! result-1 r)))
      (register-callback! req-id-2 (fn [r] (reset! result-2 r)))
      ;; Send two concurrent requests
      (let [f1 (future
                @(in :db [my-id req-id-1]
                  @(in my-id [req-id-1]
                    (invoke-callback! req-id-1 :first))))
            f2 (future
                @(in :db [my-id req-id-2]
                  @(in my-id [req-id-2]
                    (invoke-callback! req-id-2 :second))))]
        @f1
        @f2)
      (is (= :first @result-1) "First callback should receive :first")
      (is (= :second @result-2) "Second callback should receive :second"))))
