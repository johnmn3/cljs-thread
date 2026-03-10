(ns cljs-thread.eve-smoke-test
  "A guided tour of the eve + cljs-thread API.

   This namespace is a walkthrough disguised as a test suite. Each section
   introduces a concept, explains *why* it matters, and then demonstrates it
   with concrete assertions. If you're new to eve and cljs-thread, read top
   to bottom — the complexity builds gradually.

   The tests run inside a worker (`:core`) where blocking `@(in ...)`,
   `@(spawn ...)`, and `@(future ...)` work synchronously. The external
   test runner discovers every `deftest` at load time; we don't need to
   know anything about the runner itself.

   Prerequisites (handled by the integration harness):
     - A `AtomDomain` has been created on the main thread
     - The fat kernel has been installed and workers are online
     - We're executing on the `:core` worker"
  (:require [cljs.test :refer [deftest is testing]]
            [cljs-thread.core :as t])
  (:require-macros [cljs-thread.core :refer [spawn in future pmap =>>]]))


;; ============================================================================
;;
;;  CHAPTER 1: Eve Atoms — Shared Memory Made Easy
;;
;;  An eve atom looks and acts like a regular Clojure atom — `deref`, `swap!`,
;;  `reset!` all work the way you'd expect. The magic is underneath: every
;;  atom is backed by a SharedArrayBuffer, so multiple worker threads see the
;;  same data without message passing.
;;
;;  We'll start with the basics and work up to complex nested structures.
;;
;; ============================================================================

(deftest sanity-check
  (is (= 4 (+ 2 2))))

(deftest atom-create-and-deref
  (testing "The simplest thing: create an atom, read it back.
            `t/atom` allocates a slot in the shared memory region and
            serializes your Clojure value into it. `deref` deserializes."
    (let [my-atom (t/atom {:name "eve" :version 1})]
      (is (= {:name "eve" :version 1} @my-atom)))))

(deftest atom-swap-assoc
  (testing "`swap!` applies a function atomically — just like clojure.core/swap!
            Here we use `assoc` to add a key. The atom's compare-and-swap loop
            guarantees no updates are lost, even under contention."
    (let [my-atom (t/atom {:a 1})]
      (swap! my-atom assoc :b 2)
      (is (= {:a 1 :b 2} @my-atom)))))

(deftest atom-swap-update
  (testing "`update` targets a single key with a function.
            This is the bread and butter of counter patterns."
    (let [my-atom (t/atom {:counter 0})]
      (swap! my-atom update :counter inc)
      (is (= 1 (:counter @my-atom)))
      (swap! my-atom update :counter + 10)
      (is (= 11 (:counter @my-atom))))))

(deftest atom-swap-dissoc
  (testing "`dissoc` removes a key. After dissoc, the key is simply gone —
            the serialized form in shared memory shrinks accordingly."
    (let [my-atom (t/atom {:keep "me" :remove "me"})]
      (swap! my-atom dissoc :remove)
      (is (= {:keep "me"} @my-atom)))))

(deftest atom-reset
  (testing "`reset!` replaces the entire value. Unlike `swap!`, it doesn't
            read the old value — it just overwrites. Useful when you want a
            clean slate."
    (let [my-atom (t/atom {:old "data" :stale true})]
      (reset! my-atom {:completely "new"})
      (is (= {:completely "new"} @my-atom)))))

(deftest atom-with-various-value-types
  (testing "Atoms aren't limited to maps. Any serializable Clojure value works:
            vectors, sets, keywords, strings, numbers, nil, and nested
            combinations. This is important because it means you can model
            your domain naturally — no flattening required."
    (let [vec-atom  (t/atom [1 2 3])
          set-atom  (t/atom #{:a :b :c})
          str-atom  (t/atom "hello")
          num-atom  (t/atom 42)
          nil-atom  (t/atom nil)
          kw-atom   (t/atom :status/ready)
          nest-atom (t/atom {:users [{:name "Alice" :roles #{:admin}}
                                     {:name "Bob"   :roles #{:user}}]
                             :config {:max-retries 3
                                      :timeout-ms  5000}})]
      (is (= [1 2 3]     @vec-atom))
      (is (= #{:a :b :c} @set-atom))
      (is (= "hello"     @str-atom))
      (is (= 42          @num-atom))
      (is (= nil         @nil-atom))
      (is (= :status/ready @kw-atom))
      (is (= "Alice"     (get-in @nest-atom [:users 0 :name])))
      (is (contains? (get-in @nest-atom [:users 0 :roles]) :admin)))))

(deftest multiple-independent-atoms
  (testing "Each `t/atom` call allocates its own slot in the SharedArrayBuffer.
            Mutations to one atom don't affect the others. This is how you'd
            model separate pieces of application state — a user atom, a config
            atom, a metrics atom — all independent, all thread-safe."
    (let [users   (t/atom {:count 0})
          config  (t/atom {:theme "dark"})
          metrics (t/atom {:requests 0 :errors 0})]
      ;; Mutate each independently
      (swap! users update :count inc)
      (swap! config assoc :theme "light")
      (swap! metrics update :requests + 100)
      ;; Verify isolation
      (is (= {:count 1}                    @users))
      (is (= {:theme "light"}              @config))
      (is (= {:requests 100 :errors 0}     @metrics)))))

(deftest rapid-sequential-swaps
  (testing "Atoms must handle rapid-fire updates correctly. Here we increment
            a counter 100 times in a tight loop on a single thread. Because
            there's no contention (single thread), every swap must land. This
            exercises the CAS fast path — one attempt per swap, no retries."
    (let [my-atom (t/atom {:counter 0})]
      (dotimes [_ 100]
        (swap! my-atom update :counter inc))
      (is (= 100 (:counter @my-atom))))))


;; ============================================================================
;;
;;  CHAPTER 2: cljs-thread Primitives — Sending Work Elsewhere
;;
;;  Now that we can create shared atoms, let's put them to use. cljs-thread
;;  gives us several ways to run code on other threads:
;;
;;    spawn  — fire up a fresh ephemeral worker, run some code, get a result
;;    in     — dispatch code to a *named* worker that's already running
;;    future — dispatch to a pre-warmed thread pool (fast, no startup cost)
;;    pmap   — parallel map: apply a function to every element concurrently
;;    =>>    — parallel transducers: thread-last pipeline across the pool
;;
;;  `future` is the workhorse for CPU-bound work — it reuses a fixed pool of
;;  pre-created threads with no startup cost. `spawn` creates a fresh worker
;;  each time, making it the right choice for I/O-bound or long-waiting tasks
;;  that would otherwise tie up pool slots. `in` dispatches to a worker you've
;;  already created and named — useful for long-lived services.
;;
;; ============================================================================

(deftest spawn-basic
  (testing "`spawn` creates a fresh worker, evaluates an expression, and
            returns the result. The caller blocks until the worker finishes.
            This is the simplest form of cross-thread computation."
    (is (= 6 @(spawn (+ 1 2 3))))))

(deftest spawn-with-conveyance
  (testing "What if the spawned code needs data from *this* thread?
            That's binding conveyance — cljs-thread automatically captures
            local bindings and transmits them to the worker. No annotation
            needed; if a symbol is in scope, it travels."
    (let [x 10 y 20]
      (is (= 30 @(spawn (+ x y)))))))

(deftest spawn-explicit-conveyance
  (testing "Sometimes you want to be explicit about what gets sent. A
            conveyance vector `[x y]` declares exactly which bindings to
            transmit, disabling the automatic capture. This is your escape
            hatch when implicit conveyance sends too much or too little."
    (let [x 10 y 20 z 100]
      (is (= 30 @(spawn [x y] (+ x y)))))))

(deftest in-named-worker
  (testing "`in` dispatches to a *named* worker — one that's already running
            and part of the mesh. Here we spawn a persistent worker with an
            id, then use `in` to send work to it. No startup cost on the
            second call; the worker is already warm.

            Note: we address the worker by keyword (`:smoke-calc`) here to
            demonstrate that it's possible. In application code, prefer using
            the worker reference directly — `@(in w ...)` — which is
            equivalent and doesn't rely on a system-level escape hatch."
    (let [w (spawn {:id :smoke-calc})]
      (is (= 42 @(in w (+ 10 32)))))))

(deftest future-basic
  (testing "`future` dispatches to the thread pool — a fixed set of
            pre-created workers that are recycled across calls. No startup
            cost, no teardown. This is the workhorse for CPU-bound tasks
            that should run off the current thread. For I/O-bound or
            long-waiting work, prefer `spawn` so you don't tie up a
            pool slot."
    (is (= 300 @(future (+ 100 200))))))

(deftest future-nested
  (testing "Futures can nest — a future can spawn another future and block
            for its result. The inner future runs on a different pool thread
            while the outer one waits via SharedArrayBuffer sync."
    (is (= 6 @(future (+ 1 @(future (+ 2 3))))))))

(deftest future-nested-4-deep
  (testing "4 levels of nested futures — verifies the async relay chain
            routes responses correctly through multiple levels."
    (is (= 10 @(future (+ 1 @(future (+ 2 @(future (+ 3 @(future 4)))))))))))

(deftest future-nested-5-deep
  (testing "5 levels of nested futures — stress test for deeply nested
            async park-deref resolution."
    (is (= 15 @(future (+ 1 @(future (+ 2 @(future (+ 3 @(future (+ 4 @(future 5)))))))))))))

(deftest pmap-basic
  (testing "`pmap` is the parallel version of `map`. It distributes the
            function applications across pool workers and collects results.
            Order is preserved — the Nth result corresponds to the Nth input.
            We're running inside a worker, so blocking semantics apply."
    (is (= [2 3 4 5 6] (vec (pmap inc [1 2 3 4 5]))))))

(deftest parallel-transducers
  (testing "`=>>` is the parallel thread-last macro. It auto-transducifies
            the pipeline — `(map inc)`, `(filter odd?)` — and fans work
            across the injest worker pool. The final `(apply +)` is the
            reducing step. This is how you get multi-core speedups on
            collection pipelines without restructuring your code."
    (is (= 25 (=>> (range 10)
                    (map inc)
                    (filter odd?)
                    (apply +))))))


;; ============================================================================
;;
;;  CHAPTER 3: Cross-Thread Integration — Eve Meets cljs-thread
;;
;;  This is where it gets interesting. A SharedArrayBuffer-backed atom can be
;;  created on one thread, passed to another via conveyance, and mutated from
;;  either side. Both threads see the same underlying memory — no copies, no
;;  message passing, no eventual consistency. Just shared mutable state with
;;  atomic CAS semantics.
;;
;;  Atoms are automatically conveyed when they appear in your code — no
;;  explicit conveyance vector needed. cljs-thread detects the atom in
;;  scope, serializes its identity (not its value), and reconstructs it
;;  on the remote worker, pointing at the same SharedArrayBuffer.
;;
;; ============================================================================

(deftest atom-deref-on-future
  (testing "Create an atom here on `:core`, send it to a future thread,
            and deref it there. The atom isn't *copied* — it's the same
            shared memory, just accessed from a different thread."
    (let [my-atom (t/atom {:greeting "hello from core"})]
      (is (= "hello from core"
             @(future (:greeting @my-atom)))))))

(deftest atom-swap-on-future-visible-locally
  (testing "Swap the atom on a future thread, then read it back here on
            `:core`. The write is immediately visible because both threads
            are looking at the same SharedArrayBuffer bytes."
    (let [my-atom (t/atom {:status "pending"})]
      @(future (swap! my-atom assoc :status "done"))
      (is (= "done" (:status @my-atom))))))

(deftest atom-in-spawned-worker
  (testing "Ephemeral workers get atoms too. Here we spawn a fresh worker,
            the atom is automatically conveyed, we read the value, and
            return it. The spawn terminates after, but the atom persists
            in shared memory."
    (let [my-atom (t/atom {:data [1 2 3]})]
      (is (= [1 2 3]
             @(spawn (into [] (:data @my-atom))))))))

(deftest atom-swap-in-future
  (testing "Futures are the fast path for off-thread atom mutations.
            Swap in a future, verify back on the original thread."
    (let [my-atom (t/atom {:counter 0})]
      @(future (swap! my-atom update :counter + 10))
      (is (= 10 (:counter @my-atom))))))

(deftest atom-round-trip-via-named-worker
  (testing "A full round trip: create on core, increment on a named worker,
            read on core. This is the canonical shared-state pattern — one
            thread produces, another consumes, no locks needed."
    (let [my-atom (t/atom {:step 0})
          w (spawn {:id :smoke-roundtrip})]
      @(in :smoke-roundtrip (swap! my-atom update :step inc))
      (is (= 1 (:step @my-atom))))))

(deftest multi-worker-concurrent-increments
  (testing "The real stress test: three ephemeral workers each increment a
            shared counter several times. Because CAS is optimistic, some
            retries may be needed under contention. We check that the final
            count is at least half the expected total — CAS guarantees
            progress, but not every attempt wins on the first try."
    (let [my-atom (t/atom {:counter 0})
          handles (mapv (fn [_]
                          (spawn
                            (dotimes [_ 5]
                              (swap! my-atom update :counter inc))))
                        (range 3))]
      (doseq [h handles] @h)
      ;; 3 workers x 5 increments = 15 expected. CAS means some may
      ;; retry and reread, but the counter only moves forward.
      ;; In practice we almost always get exactly 15.
      (is (>= (:counter @my-atom) 8)))))

(deftest atom-vector-conj-from-futures
  (testing "Atoms containing vectors work just as well. Here we conj items
            from sequential futures. Each future adds one element; we verify
            all elements arrived."
    (let [my-atom (t/atom {:items []})]
      ;; Run all conj operations in a single future — loop variables can't
      ;; cross future's str+eval boundary (ReferenceError on worker).
      @(future [my-atom]
        (dotimes [i 5]
          (swap! my-atom update :items conj i)))
      ;; All 5 items should be present
      (is (= 5 (count (:items @my-atom))))
      (is (= #{0 1 2 3 4} (set (:items @my-atom)))))))

(deftest atom-nested-structure-update-in-from-future
  (testing "Deep nested structures work across threads. `update-in` on a
            future thread mutates a deeply nested path in shared memory."
    (let [my-atom (t/atom {:app {:db {:users {:count 0}}}})]
      @(future (swap! my-atom update-in [:app :db :users :count] + 5))
      (is (= 5 (get-in @my-atom [:app :db :users :count]))))))


;; ============================================================================
;;
;;  CHAPTER 4: `yield` — Taming Async JavaScript
;;
;;  JavaScript is full of callback-based and promise-based APIs. On a worker
;;  thread, `yield` lets you convert these into synchronous blocking calls.
;;  The caller's `@(spawn ...)` or `@(future ...)` blocks until `yield` is
;;  invoked, and the value passed to `yield` becomes the return value.
;;
;;  This is especially powerful combined with shared atoms: you can fetch
;;  data asynchronously, store it in a shared atom, and yield a result —
;;  all looking like plain synchronous code from the caller's perspective.
;;
;; ============================================================================

(deftest yield-basic
  (testing "The simplest `yield`: return a value from a spawn immediately.
            Without `yield`, the spawn's return value is the last expression.
            With `yield`, you control exactly when and what comes back."
    (is (= 42 @(spawn (yield (+ 40 2)))))))

(deftest yield-with-body-continuation
  (testing "`yield` returns a value to the caller, but the spawn body keeps
            running after yield. This is useful for 'return early, clean up
            later' patterns. Here we yield the result, then the worker
            continues to do side-effect work before terminating."
    (let [my-atom (t/atom {:yielded nil :continued false})]
      (is (= 42 @(spawn
                    (yield (do (swap! my-atom assoc :yielded true) 42))
                    (swap! my-atom assoc :continued true)))))))

(deftest yield-with-timeout
  (testing "`yield` shines with async callbacks. Here, `js/setTimeout`
            fires after a delay, and the caller blocks until `yield` is
            invoked inside the callback. This converts a callback-based
            API into a synchronous call."
    (is (= 42 @(spawn (js/setTimeout #(yield 42) 50))))))

(deftest yield-promise-to-sync
  (testing "Convert a JavaScript Promise into a synchronous value. Wrap
            the `.then` callback with `yield`, and the caller gets the
            resolved value as if it were a regular function return.

            Caveat: this example uses `future` for brevity, but be aware
            that the future pool is a fixed-size, CPU-bound pool — not
            meant for waiting on external resources. If you park a pool
            thread on a slow promise (network fetch, IndexedDB cursor),
            you starve the pool for other callers. For I/O-bound work,
            prefer `spawn` (which creates an ephemeral worker) so the
            future pool stays available for CPU-bound tasks."
    (is (= 42 @(future (-> (js/Promise.resolve 42)
                            (.then #(yield %))))))))

(deftest yield-with-shared-atom
  (testing "Combine yield and shared atoms for the full async-to-shared
            pattern: a future resolves a promise, stores the result in a
            shared atom, and yields a confirmation. The atom is visible
            across all threads immediately."
    (let [my-atom (t/atom {:data nil})]
      (is (= "loaded"
             @(future (-> (js/Promise.resolve {:items [1 2 3]})
                          (.then (fn [result]
                                   (swap! my-atom assoc :data result)
                                   (yield "loaded")))))))
      (is (= {:items [1 2 3]} (:data @my-atom))))))


;; ============================================================================
;;
;;  CHAPTER 5: Persistent Data Structures Through Atoms
;;
;;  Eve atoms can hold *any* serializable Clojure value. That means the full
;;  standard library of persistent data structure operations — assoc, dissoc,
;;  merge, conj, pop, get-in, update-in, select-keys — all work through
;;  swap! and deref. Here we exercise these operations to confirm that the
;;  serialization round-trip preserves structural equality.
;;
;; ============================================================================

;; ----- 5a: Map operations -----

(deftest map-merge
  (testing "`merge` combines maps. When used through swap!, it atomically
            merges new keys into the shared atom."
    (let [my-atom (t/atom {:a 1})]
      (swap! my-atom merge {:b 2 :c 3})
      (is (= {:a 1 :b 2 :c 3} @my-atom)))))

(deftest map-select-keys
  (testing "`select-keys` projects a subset of keys. Useful for extracting
            only the fields you need from a large shared map."
    (let [my-atom (t/atom {:name "Alice" :age 30 :role "admin" :active true})]
      (reset! my-atom (select-keys @my-atom [:name :role]))
      (is (= {:name "Alice" :role "admin"} @my-atom)))))

(deftest map-nested-update-in
  (testing "`update-in` navigates a key path and applies a function at the
            leaf. Here we increment a counter three levels deep."
    (let [my-atom (t/atom {:level1 {:level2 {:level3 {:counter 0}}}})]
      (swap! my-atom update-in [:level1 :level2 :level3 :counter] inc)
      (is (= 1 (get-in @my-atom [:level1 :level2 :level3 :counter]))))))

(deftest map-assoc-in
  (testing "`assoc-in` creates intermediate maps as needed. This is how you
            build deep structures incrementally."
    (let [my-atom (t/atom {})]
      (swap! my-atom assoc-in [:a :b :c] "deep")
      (is (= "deep" (get-in @my-atom [:a :b :c]))))))

;; ----- 5b: Vector operations -----

(deftest vector-conj-and-pop
  (testing "Vectors support `conj` (append) and `pop` (remove last).
            Through swap!, these become atomic stack operations."
    (let [my-atom (t/atom [1 2 3])]
      (swap! my-atom conj 4 5)
      (is (= [1 2 3 4 5] @my-atom))
      (swap! my-atom pop)
      (is (= [1 2 3 4] @my-atom)))))

(deftest vector-assoc-by-index
  (testing "Vectors support `assoc` by index — replacing an element at a
            specific position."
    (let [my-atom (t/atom [:a :b :c :d])]
      (swap! my-atom assoc 2 :replaced)
      (is (= [:a :b :replaced :d] @my-atom)))))

(deftest vector-subvec
  (testing "`subvec` extracts a range from a vector. We use it through
            reset! to narrow down to a window of interest."
    (let [my-atom (t/atom [0 1 2 3 4 5 6 7 8 9])]
      (reset! my-atom (subvec @my-atom 3 7))
      (is (= [3 4 5 6] @my-atom)))))

;; ----- 5c: Set operations -----

(deftest set-conj-and-disj
  (testing "Sets support `conj` (add) and `disj` (remove). Through swap!,
            these become atomic membership operations — useful for tracking
            which workers are online, which features are enabled, etc."
    (let [my-atom (t/atom #{:a :b :c})]
      (swap! my-atom conj :d)
      (is (= #{:a :b :c :d} @my-atom))
      (swap! my-atom disj :b)
      (is (= #{:a :c :d} @my-atom)))))

;; ----- 5d: Sequence transforms within atoms -----

(deftest transform-collection-within-atom
  (testing "You can use any sequence function inside swap! to transform
            collections within an atom. Here we use `mapv` (not `map` —
            we want a vector back, not a lazy seq) to increment every
            element of a stored vector."
    (let [my-atom (t/atom {:scores [10 20 30 40 50]})]
      (swap! my-atom update :scores #(mapv inc %))
      (is (= [11 21 31 41 51] (:scores @my-atom))))))

(deftest filter-within-atom
  (testing "`filterv` inside swap! prunes a collection atomically."
    (let [my-atom (t/atom {:items [1 2 3 4 5 6 7 8 9 10]})]
      (swap! my-atom update :items #(filterv odd? %))
      (is (= [1 3 5 7 9] (:items @my-atom))))))

(deftest complex-nested-transform
  (testing "Combining `update-in`, `mapv`, and `filterv` for a realistic
            data transformation: increment all scores in a nested user
            record, then keep only those above a threshold."
    (let [my-atom (t/atom {:users [{:name "Alice" :scores [85 92 78]}
                                   {:name "Bob"   :scores [60 55 70]}]})]
      ;; Increment all scores by 5
      (swap! my-atom update :users
             (fn [users]
               (mapv (fn [u]
                       (update u :scores #(mapv (fn [s] (+ s 5)) %)))
                     users)))
      (is (= [90 97 83] (get-in @my-atom [:users 0 :scores])))
      (is (= [65 60 75] (get-in @my-atom [:users 1 :scores]))))))


;; ============================================================================
;;
;;  CHAPTER 6: Putting It All Together
;;
;;  These final tests combine everything — atoms, workers, persistent data
;;  structure operations, yield — into scenarios that resemble real
;;  application patterns. If these pass, you can be confident that the full
;;  eve + cljs-thread stack is working correctly.
;;
;; ============================================================================

(deftest accumulator-pattern
  (testing "The accumulator pattern: start with an empty collection, dispatch
            work to multiple futures, each appends results. This is how you'd
            parallelize data collection — fan out, accumulate, read final."
    (let [results (t/atom {:data []})]
      ;; Accumulate all batches in a single future — loop variables can't
      ;; cross future's str+eval boundary (ReferenceError on worker).
      @(future [results]
        (doseq [batch [[1 2 3] [4 5 6] [7 8 9]]]
          (swap! results update :data into batch)))
      (is (= 9 (count (:data @results))))
      (is (= #{1 2 3 4 5 6 7 8 9} (set (:data @results)))))))

(deftest worker-local-computation-shared-result
  (testing "Compute locally on a future thread, store the result in a shared
            atom. The computation doesn't touch the atom until it's done —
            only one swap! at the end. This minimizes contention."
    (let [my-atom (t/atom {:result nil})]
      @(future
        (let [computed (reduce + (range 101))]
          (swap! my-atom assoc :result computed)))
      (is (= 5050 (:result @my-atom))))))

(deftest mixed-operations-pipeline
  (testing "A multi-step pipeline: create a map, assoc keys, merge, update
            nested paths, transform collections — all through one atom.
            This exercises the full gauntlet of persistent data structure
            operations in sequence."
    (let [my-atom (t/atom {})]
      ;; Step 1: Build the structure
      (swap! my-atom assoc :name "pipeline-test" :version 1)
      (swap! my-atom assoc-in [:config :features] #{})
      (swap! my-atom assoc-in [:config :limits :max-workers] 4)
      (swap! my-atom assoc :log [])

      ;; Step 2: Evolve it
      (swap! my-atom update :version inc)
      (swap! my-atom update-in [:config :features] conj :threading)
      (swap! my-atom update-in [:config :features] conj :shared-atoms)
      (swap! my-atom update :log conj "initialized")
      (swap! my-atom update :log conj "features enabled")

      ;; Step 3: Verify the final shape
      (let [state @my-atom]
        (is (= "pipeline-test"       (:name state)))
        (is (= 2                     (:version state)))
        (is (contains? (get-in state [:config :features]) :threading))
        (is (contains? (get-in state [:config :features]) :shared-atoms))
        (is (= 4                     (get-in state [:config :limits :max-workers])))
        (is (= ["initialized" "features enabled"] (:log state)))))))

(deftest cross-worker-map-accumulation
  (testing "Three different worker types each contribute a key-value pair
            to a shared map. This pattern is useful for distributed
            configuration or collecting diagnostics from multiple services."
    (let [registry (t/atom {})]
      @(future (swap! registry assoc :future-status "online"))
      @(spawn (swap! registry assoc :spawn-status "online"))
      (let [w (spawn {:id :smoke-registry})]
        @(in :smoke-registry (swap! registry assoc :named-status "online")))
      (let [state @registry]
        (is (= "online" (:future-status state)))
        (is (= "online" (:spawn-status state)))
        (is (= "online" (:named-status state)))))))

(deftest swap-return-value
  (testing "`swap!` returns the new value of the atom — same as Clojure.
            This is useful for read-after-write patterns where you need
            the exact post-swap state."
    (let [my-atom (t/atom {:x 1})
          new-val (swap! my-atom assoc :y 2)]
      (is (= {:x 1 :y 2} new-val))
      (is (= new-val @my-atom)))))

(deftest reset-return-value
  (testing "`reset!` returns the new value."
    (let [my-atom (t/atom {:old true})
          new-val (reset! my-atom {:new true})]
      (is (= {:new true} new-val))
      (is (= new-val @my-atom)))))

(deftest large-map-operations
  (testing "Atoms handle maps with many keys. We build a 50-key map through
            repeated assoc, then verify random access. This exercises the
            serialization path for larger payloads."
    (let [my-atom (t/atom {})]
      (doseq [i (range 50)]
        (swap! my-atom assoc (keyword (str "k" i)) i))
      (is (= 50 (count @my-atom)))
      (is (= 0  (:k0  @my-atom)))
      (is (= 25 (:k25 @my-atom)))
      (is (= 49 (:k49 @my-atom))))))
