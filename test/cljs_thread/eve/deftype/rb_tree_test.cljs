(ns cljs-thread.eve.deftype.rb-tree-test
  (:require
   [cljs.test :refer-macros [deftest testing is]]
   [cljs-thread.eve.shared-atom :as atom]
   [cljs-thread.eve.deftype.rb-tree :as rb :refer [rb-insert rb-member?
                                                    rb-find rb-seq rb-count
                                                    rb-height rb-black-height
                                                    rb-valid? BLACK
                                                    sorted-set member?]]))

;;-----------------------------------------------------------------------------
;; Helpers
;;-----------------------------------------------------------------------------

(defn make-env
  "Get the SAB env from the global atom (bootstrapped by test runner)."
  []
  (atom/get-env atom/*global-atom-instance*))

(defn build-tree
  "Insert a sequence of values into an empty tree."
  [env vals]
  (reduce (fn [tree v] (rb-insert env tree v)) nil vals))

;;-----------------------------------------------------------------------------
;; Basic construction
;;-----------------------------------------------------------------------------

(deftest empty-tree-test
  (testing "Empty tree is nil"
    (is (nil? nil) "nil represents empty tree")
    (is (= 0 (rb-count nil)))
    (is (rb-valid? nil))
    (is (empty? (rb-seq nil)))))

(deftest single-insert-test
  (testing "Insert one element"
    (let [env (make-env)
          t (rb-insert env nil 42)]
      (is (some? t))
      (is (= BLACK (:color t)) "root must be black")
      (is (nil? (:left t)))
      (is (nil? (:right t)))
      (is (= 42 (:value t)))
      (is (= 1 (rb-count t)))
      (is (rb-valid? t)))))

(deftest two-insert-test
  (testing "Insert two elements"
    (let [env (make-env)
          t (-> nil
                (as-> t (rb-insert env t 10))
                (as-> t (rb-insert env t 20)))]
      (is (= 2 (rb-count t)))
      (is (rb-valid? t))
      (is (= [10 20] (vec (rb-seq t)))))))

(deftest three-insert-test
  (testing "Insert three elements — triggers first balance"
    (let [env (make-env)
          t (build-tree (make-env) [10 20 30])]
      (is (= 3 (rb-count t)))
      (is (rb-valid? t))
      (is (= [10 20 30] (vec (rb-seq t)))))))

;;-----------------------------------------------------------------------------
;; Membership & find
;;-----------------------------------------------------------------------------

(deftest member-test
  (testing "Membership queries"
    (let [env (make-env)
          t (build-tree env [5 3 8 1 4 7 9])]
      (is (rb-member? t 5))
      (is (rb-member? t 1))
      (is (rb-member? t 9))
      (is (not (rb-member? t 0)))
      (is (not (rb-member? t 6)))
      (is (not (rb-member? t 100))))))

(deftest find-test
  (testing "Find returns the value or nil"
    (let [env (make-env)
          t (build-tree env [10 20 30])]
      (is (= 10 (rb-find t 10)))
      (is (= 30 (rb-find t 30)))
      (is (nil? (rb-find t 15))))))

;;-----------------------------------------------------------------------------
;; Ordering & sequence
;;-----------------------------------------------------------------------------

(deftest sorted-seq-test
  (testing "In-order traversal is sorted regardless of insertion order"
    (let [env (make-env)
          vals [7 3 18 10 22 8 11 26 2 6 13]
          t (build-tree env vals)]
      (is (= (sort vals) (vec (rb-seq t)))))))

(deftest duplicate-insert-test
  (testing "Inserting duplicates doesn't change the tree"
    (let [env (make-env)
          t1 (build-tree env [1 2 3 4 5])
          t2 (rb-insert env t1 3)]
      (is (= 5 (rb-count t2)) "count unchanged after duplicate insert")
      (is (= [1 2 3 4 5] (vec (rb-seq t2)))))))

;;-----------------------------------------------------------------------------
;; Invariant checks
;;-----------------------------------------------------------------------------

(deftest invariants-small-test
  (testing "RB invariants hold for small trees"
    (doseq [n (range 1 8)]
      (let [env (make-env)
            t (build-tree env (range n))]
        (is (rb-valid? t) (str "valid for " n " elements"))
        (is (= n (rb-count t)))))))

(deftest invariants-medium-test
  (testing "RB invariants hold for 100 sequential inserts"
    (let [env (make-env)
          t (build-tree env (range 100))]
      (is (rb-valid? t))
      (is (= 100 (rb-count t)))
      (is (= (vec (range 100)) (vec (rb-seq t)))))))

(deftest invariants-reverse-test
  (testing "RB invariants hold for reverse-order inserts"
    (let [env (make-env)
          t (build-tree env (reverse (range 50)))]
      (is (rb-valid? t))
      (is (= 50 (rb-count t)))
      (is (= (vec (range 50)) (vec (rb-seq t)))))))

;;-----------------------------------------------------------------------------
;; Height bounds
;;-----------------------------------------------------------------------------

(deftest height-bound-test
  (testing "Height is bounded by 2*log2(n+1) for a valid RB tree"
    (let [env (make-env)
          n 100
          t (build-tree env (range n))
          h (rb-height t)
          max-h (* 2 (Math/ceil (/ (Math/log (inc n)) (Math/log 2))))]
      (is (<= h max-h)
          (str "height " h " should be <= " max-h " for " n " elements")))))

(deftest black-height-test
  (testing "Black-height is consistent across all paths"
    (let [env (make-env)
          t (build-tree env (range 50))
          bh (rb-black-height t)]
      (is (pos? bh) "black-height should be positive for non-empty tree")
      (is (not= -1 bh) "black-height should be uniform"))))

;;-----------------------------------------------------------------------------
;; Fressian field values (non-numeric)
;;-----------------------------------------------------------------------------

(deftest string-values-test
  (testing "RB tree with string values"
    (let [env (make-env)
          words ["fig" "date" "apple" "cherry" "banana" "elderberry"]
          t (build-tree env words)]
      (is (rb-valid? t))
      (is (= (sort words) (vec (rb-seq t))))
      (is (rb-member? t "cherry"))
      (is (not (rb-member? t "grape"))))))

(deftest keyword-values-test
  (testing "RB tree with keyword values"
    (let [env (make-env)
          ks [:z :a :m :f :b :q]
          t (build-tree env ks)]
      (is (rb-valid? t))
      (is (= (sort ks) (vec (rb-seq t))))
      (is (= 6 (rb-count t))))))

;;-----------------------------------------------------------------------------
;; Print representation
;;-----------------------------------------------------------------------------

(deftest print-test
  (testing "RBNode prints readable representation"
    (let [env (make-env)
          t (rb-insert env nil 42)]
      (is (string? (pr-str t))))))

;;-----------------------------------------------------------------------------
;; SortedSet (user-facing wrapper) tests
;;-----------------------------------------------------------------------------

(deftest sorted-set-empty-test
  (testing "Empty sorted set"
    (let [s (sorted-set)]
      (is (= 0 (count s)))
      (is (nil? (seq s))))))

(deftest sorted-set-construction-test
  (testing "Create sorted set from values"
    (let [s (sorted-set 3 1 4 1 5 9 2 6)]
      (is (= 7 (count s)) "duplicates are removed")
      (is (= [1 2 3 4 5 6 9] (vec (seq s))) "sorted order"))))

(deftest sorted-set-conj-test
  (testing "conj adds elements"
    (let [s (-> (sorted-set) (conj 10) (conj 5) (conj 15))]
      (is (= 3 (count s)))
      (is (= [5 10 15] (vec (seq s)))))))

(deftest sorted-set-lookup-test
  (testing "Lookup and membership"
    (let [s (sorted-set 10 20 30)]
      (is (= 10 (get s 10)))
      (is (= 20 (s 20)))
      (is (nil? (get s 99)))
      (is (= :nope (get s 99 :nope)))
      (is (member? s 10))
      (is (not (member? s 99))))))

(deftest sorted-set-strings-test
  (testing "Sorted set with string values"
    (let [s (sorted-set "fig" "date" "apple" "cherry" "banana")]
      (is (= ["apple" "banana" "cherry" "date" "fig"] (vec (seq s))))
      (is (member? s "cherry"))
      (is (not (member? s "grape"))))))

(deftest sorted-set-keywords-test
  (testing "Sorted set with keyword values"
    (let [s (sorted-set :z :a :m :f :b :q)]
      (is (= (sort [:z :a :m :f :b :q]) (vec (seq s))))
      (is (= 6 (count s))))))

(deftest sorted-set-meta-test
  (testing "with-meta / meta"
    (let [s (with-meta (sorted-set 1 2 3) {:doc "test"})]
      (is (= {:doc "test"} (meta s))))))

(deftest sorted-set-equality-test
  (testing "Two sorted sets with same values are equal"
    (let [s1 (sorted-set 3 1 2)
          s2 (sorted-set 1 2 3)]
      (is (= s1 s2)))))

(deftest sorted-set-print-test
  (testing "SortedSet prints readable representation"
    (let [s (sorted-set 3 1 2)]
      (is (string? (pr-str s))))))
