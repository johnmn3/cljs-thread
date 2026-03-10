(ns cljs-thread.test
  "Macros for ergonomic test helpers built on cljs-thread.

   These macros leverage cljs-thread's blocking semantics to provide
   synchronous, sequential test primitives that eliminate the async
   ceremony required by standard cljs.test in CLJS.

   David Nolen's 2014 port of clojure.test to CLJS introduced:
   - async macro for CPS-based async tests
   - Split fixtures (:before/:after instead of wrapping)
   - One async block per deftest

   With cljs-thread/eve, workers can @(future ...), @(spawn ...),
   @(in ...) — synchronous blocking calls. We can wait for results
   in ways never possible before in CLJS.

   IMPORTANT: Do NOT use this namespace when testing cljs-thread itself.
   cljs-thread.test is for downstream app/lib authors building on
   cljs-thread, and for testing higher-level features above the
   cljs-thread abstraction.")

(defmacro deftest-worker
  "Like deftest, but the body runs on a :core worker with full blocking
   semantics. Handles dispatch and result collection automatically.

   Usage:
     (deftest-worker my-cross-thread-test
       (let [a (eve/atom {:x 0})]
         @(future (swap! a update :x inc))
         (is (= 1 (:x @a)))))

   The body executes on :core via `in`. Any cljs.test assertions
   (is, are, testing) inside the body report correctly because
   the cljs.test environment is thread-local to each worker."
  [name & body]
  `(cljs.test/deftest ~name
     (let [result# @(cljs-thread.core/in :core []
                      (try
                        (do ~@body)
                        :ok
                        (catch :default e#
                          {:error (str e#)})))]
       (when (and (map? result#) (:error result#))
         (cljs.test/is false (str "Worker test error: " (:error result#)))))))

(defmacro deftest-async
  "Like deftest but wraps body in an async block with automatic `done`.
   For tests that MUST use callback-style (e.g., testing yield patterns).

   Most tests should prefer deftest-worker. Use this only when you need
   explicit control over the async lifecycle.

   Usage:
     (deftest-async my-callback-test
       (js/setTimeout
         (fn []
           (is (= 42 42))
           (done))
         100))"
  [name & body]
  `(cljs.test/deftest ~name
     (cljs.test/async ~'done
       ~@body)))

(defmacro with-atom
  "Create a shared eve atom, execute body, return the last expression.
   The atom is available as the bound symbol within body.

   Usage:
     (with-atom [a {:counter 0}]
       (swap! a update :counter inc)
       (is (= 1 (:counter @a))))"
  [[sym init-val & {:as atom-opts}] & body]
  (let [opts (dissoc atom-opts :key)
        key-expr (or (:key atom-opts) (keyword (gensym "test-atom-")))]
    `(let [~sym (cljs-thread.eve/atom ~key-expr ~init-val ~@(apply concat opts))]
       ~@body)))

(defmacro with-workers
  "Execute body with N named worker handles bound.
   Workers are ephemeral spawn targets. Use `in` to dispatch work.

   Usage:
     (with-workers [w1 w2 w3]
       (is (= 3 @(in w1 (+ 1 2))))
       (is (= 7 @(in w2 (+ 3 4))))
       (is (= 11 @(in w3 (+ 5 6)))))"
  [worker-syms & body]
  (let [bindings (vec
                   (mapcat (fn [sym]
                             [sym `(keyword ~(str sym))])
                           worker-syms))]
    `(let ~bindings
       ~@body)))

(defmacro is-eventually
  "Assert that a predicate becomes true within a timeout.
   Polls at intervals using blocking sleep (Atomics.wait).

   Usage:
     (is-eventually (= 42 @my-atom))
     (is-eventually (= 42 @my-atom) :timeout 5000 :interval 100)
     (is-eventually (pos? (:count @state)) :message \"count should become positive\")"
  [pred & {:keys [timeout interval message]
           :or   {timeout 5000 interval 100}}]
  (let [msg (or message (str "Expected to become true within " timeout "ms: " (pr-str pred)))]
    `(let [deadline# (+ (.now js/Date) ~timeout)]
       (loop []
         (if ~pred
           (cljs.test/is true ~msg)
           (if (> (.now js/Date) deadline#)
             (cljs.test/is false ~msg)
             (do
               ;; Blocking sleep using Atomics.wait on a dummy SharedArrayBuffer
               (js/Atomics.wait (js/Int32Array. (js/SharedArrayBuffer. 4)) 0 0 ~interval)
               (recur))))))))

(defmacro is-within
  "Assert that a numeric value is within tolerance of expected.
   Useful for performance/timing tests.

   Usage:
     (is-within 100 @elapsed-ms :tolerance 20)"
  [expected actual & {:keys [tolerance message]
                      :or   {tolerance 0.001}}]
  (let [msg (or message (str "Expected " (pr-str actual) " to be within "
                             tolerance " of " expected))]
    `(let [e# ~expected
           a# ~actual
           t# ~tolerance]
       (cljs.test/is (<= (js/Math.abs (- e# a#)) t#) ~msg))))

(defmacro with-timeout
  "Execute body with a timeout guard. If the body doesn't complete
   within timeout-ms, the test fails.

   Usage:
     (with-timeout 5000
       ;; ... long-running test ...
       )"
  [timeout-ms & body]
  `(let [done?# (atom false)
         _guard# (js/setTimeout
                   (fn []
                     (when-not @done?#
                       (cljs.test/is false
                         (str "Test timed out after " ~timeout-ms "ms"))))
                   ~timeout-ms)
         result# (do ~@body)]
     (reset! done?# true)
     result#))

(defmacro testing-worker
  "Like cljs.test/testing, but the body runs on a named worker.

   Usage:
     (deftest my-test
       (testing-worker :core \"arithmetic on core\"
         (is (= 42 (+ 21 21)))))"
  [worker-id description & body]
  `(cljs.test/testing ~description
     @(cljs-thread.core/in ~worker-id []
        (do ~@body))))
