(ns cljs-thread.eve.deftype.int-map-test
  (:require
   [cljs.test :refer-macros [deftest testing is]]
   [cljs-thread.eve.deftype.int-map :as im]))

;;-----------------------------------------------------------------------------
;; Helpers
;;-----------------------------------------------------------------------------

(defn make-map
  "Create an empty int-map. Uses global atom automatically."
  []
  (im/int-map))

;;-----------------------------------------------------------------------------
;; Basic construction
;;-----------------------------------------------------------------------------

(deftest empty-map-test
  (testing "Empty int-map"
    (let [m (make-map)]
      (is (= 0 (count m)))
      (is (nil? (seq m)))
      (is (nil? (get m 0)))
      (is (= :nope (get m 42 :nope))))))

(deftest single-assoc-test
  (testing "Assoc one key-value pair"
    (let [m (assoc (make-map) 42 :hello)]
      (is (= 1 (count m)))
      (is (= :hello (get m 42)))
      (is (nil? (get m 0)))
      (is (= :hello (m 42))))))

(deftest multiple-assoc-test
  (testing "Assoc several keys"
    (let [m (-> (make-map)
                (assoc 1 :a)
                (assoc 2 :b)
                (assoc 3 :c))]
      (is (= 3 (count m)))
      (is (= :a (get m 1)))
      (is (= :b (get m 2)))
      (is (= :c (get m 3)))
      (is (nil? (get m 4))))))

;;-----------------------------------------------------------------------------
;; Overwrite
;;-----------------------------------------------------------------------------

(deftest overwrite-test
  (testing "Assoc overwrites existing key"
    (let [m (-> (make-map)
                (assoc 1 :old)
                (assoc 1 :new))]
      (is (= 1 (count m)))
      (is (= :new (get m 1))))))

;;-----------------------------------------------------------------------------
;; Dissoc
;;-----------------------------------------------------------------------------

(deftest dissoc-test
  (testing "Dissoc removes key"
    (let [m (-> (make-map)
                (assoc 1 :a)
                (assoc 2 :b)
                (assoc 3 :c)
                (dissoc 2))]
      (is (= 2 (count m)))
      (is (= :a (get m 1)))
      (is (nil? (get m 2)))
      (is (= :c (get m 3)))))

  (testing "Dissoc non-existent key is no-op"
    (let [m (assoc (make-map) 1 :a)]
      (is (= 1 (count (dissoc m 999)))))))

(deftest dissoc-to-empty-test
  (testing "Dissoc all keys leaves empty map"
    (let [m (-> (make-map)
                (assoc 1 :a)
                (dissoc 1))]
      (is (= 0 (count m)))
      (is (nil? (seq m))))))

;;-----------------------------------------------------------------------------
;; Seq / iteration
;;-----------------------------------------------------------------------------

(deftest seq-test
  (testing "Seq returns MapEntry pairs"
    (let [m (-> (make-map)
                (assoc 3 :c)
                (assoc 1 :a)
                (assoc 2 :b))
          s (seq m)]
      (is (= 3 (count s)))
      ;; PATRICIA trie orders by bit-pattern, check all entries present
      (let [entries (set (map (fn [e] [(key e) (val e)]) s))]
        (is (contains? entries [1 :a]))
        (is (contains? entries [2 :b]))
        (is (contains? entries [3 :c]))))))

;;-----------------------------------------------------------------------------
;; Negative keys
;;-----------------------------------------------------------------------------

(deftest negative-keys-test
  (testing "Negative integer keys"
    (let [m (-> (make-map)
                (assoc -1 :neg)
                (assoc 0 :zero)
                (assoc 1 :pos))]
      (is (= 3 (count m)))
      (is (= :neg (get m -1)))
      (is (= :zero (get m 0)))
      (is (= :pos (get m 1)))))

  (testing "Dissoc negative key"
    (let [m (-> (make-map)
                (assoc -5 :a)
                (assoc 5 :b)
                (dissoc -5))]
      (is (= 1 (count m)))
      (is (nil? (get m -5)))
      (is (= :b (get m 5))))))

;;-----------------------------------------------------------------------------
;; Larger maps
;;-----------------------------------------------------------------------------

(deftest bulk-insert-test
  (testing "Insert 100 keys"
    (let [m (reduce (fn [m i] (assoc m i (* i i)))
                    (make-map)
                    (range 100))]
      (is (= 100 (count m)))
      (doseq [i (range 100)]
        (is (= (* i i) (get m i)) (str "key " i))))))

(deftest bulk-insert-200-test
  (testing "Insert 200 keys including negatives"
    (let [m (reduce (fn [m i] (assoc m i (str "v" i)))
                    (make-map)
                    (range -100 100))]
      (is (= 200 (count m)))
      (doseq [i (range -100 100)]
        (is (= (str "v" i) (get m i)) (str "key " i))))))

;;-----------------------------------------------------------------------------
;; contains? / IAssociative
;;-----------------------------------------------------------------------------

(deftest contains-test
  (testing "contains? works"
    (let [m (-> (make-map) (assoc 1 :a) (assoc 2 :b))]
      (is (contains? m 1))
      (is (contains? m 2))
      (is (not (contains? m 3))))))

;;-----------------------------------------------------------------------------
;; IFn invocation
;;-----------------------------------------------------------------------------

(deftest ifn-test
  (testing "Map as function"
    (let [m (assoc (make-map) 42 :answer)]
      (is (= :answer (m 42)))
      (is (nil? (m 99)))
      (is (= :default (m 99 :default))))))

;;-----------------------------------------------------------------------------
;; reduce / kv-reduce
;;-----------------------------------------------------------------------------

(deftest reduce-test
  (testing "reduce over entries"
    (let [m (-> (make-map) (assoc 1 10) (assoc 2 20) (assoc 3 30))
          sum (reduce (fn [acc [k v]] (+ acc v)) 0 m)]
      (is (= 60 sum)))))

(deftest kv-reduce-test
  (testing "kv-reduce"
    (let [m (-> (make-map) (assoc 1 10) (assoc 2 20) (assoc 3 30))
          sum (reduce-kv (fn [acc k v] (+ acc k v)) 0 m)]
      (is (= 66 sum)))))

;;-----------------------------------------------------------------------------
;; conj
;;-----------------------------------------------------------------------------

(deftest conj-test
  (testing "conj with vector pair"
    (let [m (conj (make-map) [42 :val])]
      (is (= 1 (count m)))
      (is (= :val (get m 42)))))

  (testing "conj with map"
    (let [base (assoc (make-map) 1 :a)
          m (conj base {2 :b 3 :c})]
      (is (= 3 (count m))))))

;;-----------------------------------------------------------------------------
;; merge
;;-----------------------------------------------------------------------------

(deftest merge-test
  (testing "Merge two int-maps"
    (let [m1 (-> (im/int-map) (assoc 1 :a) (assoc 2 :b))
          m2 (-> (im/int-map) (assoc 2 :B) (assoc 3 :c))
          merged (im/merge m1 m2)]
      (is (= 3 (count merged)))
      (is (= :a (get merged 1)))
      (is (= :B (get merged 2))) ;; right wins
      (is (= :c (get merged 3))))))

;;-----------------------------------------------------------------------------
;; merge-with
;;-----------------------------------------------------------------------------

(deftest merge-with-test
  (testing "Merge-with uses conflict resolution fn"
    (let [m1 (-> (im/int-map) (assoc 1 10) (assoc 2 20))
          m2 (-> (im/int-map) (assoc 2 200) (assoc 3 300))
          merged (im/merge-with + m1 m2)]
      (is (= 3 (count merged)))
      (is (= 10 (get merged 1)))
      (is (= 220 (get merged 2))) ;; 20 + 200
      (is (= 300 (get merged 3))))))

;;-----------------------------------------------------------------------------
;; update
;;-----------------------------------------------------------------------------

(deftest update-test
  (testing "Update existing key"
    (let [m (-> (make-map) (assoc 1 10))]
      (is (= 11 (get (im/update m 1 inc) 1)))))

  (testing "Update missing key invokes f with nil"
    (let [m (im/update (make-map) 1 (fnil inc 0))]
      (is (= 1 (get m 1))))))

;;-----------------------------------------------------------------------------
;; range
;;-----------------------------------------------------------------------------

(deftest range-test
  (testing "Range filters to [min, max]"
    (let [m (reduce (fn [m i] (assoc m i i))
                    (make-map)
                    (range 10))
          r (im/range m 3 7)]
      (is (= 5 (count r)))
      (doseq [i (range 3 8)]
        (is (= i (get r i)) (str "key " i)))
      (is (nil? (get r 2)))
      (is (nil? (get r 8))))))

;;-----------------------------------------------------------------------------
;; Equality
;;-----------------------------------------------------------------------------

(deftest equality-test
  (testing "Two maps with same entries are equal"
    (let [m1 (-> (make-map) (assoc 1 :a) (assoc 2 :b))
          m2 (-> (make-map) (assoc 2 :b) (assoc 1 :a))]
      (is (= m1 m2)))))

;;-----------------------------------------------------------------------------
;; with-meta
;;-----------------------------------------------------------------------------

(deftest meta-test
  (testing "with-meta / meta"
    (let [m (with-meta (make-map) {:doc "test"})]
      (is (= {:doc "test"} (meta m))))))

;;-----------------------------------------------------------------------------
;; into
;;-----------------------------------------------------------------------------

(deftest into-test
  (testing "into regular map from int-map"
    (let [m (-> (make-map) (assoc 1 :a) (assoc 2 :b))
          h (into {} m)]
      (is (= {1 :a 2 :b} h))))

  (testing "into int-map from pairs"
    (let [m (reduce (fn [m [k v]] (assoc m k v))
                    (make-map)
                    [[1 :a] [2 :b] [3 :c]])]
      (is (= 3 (count m))))))
