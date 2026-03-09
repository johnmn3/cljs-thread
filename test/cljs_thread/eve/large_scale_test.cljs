(ns ^{:isolated true} cljs-thread.eve.large-scale-test
  "Large-scale stress tests for EVE data structures.
   Tests sizes > 1024, heterogeneous data, and many operations.
   Ported from com.seniorcaremarket.eve-sab-deftype.large-scale-stress-test."
  (:require
   [cljs.test :refer-macros [deftest testing is]]
   [cljs-thread.eve :as e]
   [cljs-thread.eve.vec :as sv]
   [cljs-thread.eve.list :as sl]
   [cljs-thread.eve.map :as sm]
   [cljs-thread.eve.set :as ss]))

;;-----------------------------------------------------------------------------
;; Test Data Generators
;;-----------------------------------------------------------------------------

(defn generate-heterogeneous-data
  "Generate a vector of heterogeneous data of size n."
  [n]
  (vec
   (for [i (range n)]
     (case (mod i 7)
       0 i                                      ; integers
       1 (/ i 3.14159)                          ; floats
       2 (str "string-" i)                      ; strings
       3 (keyword (str "key-" i))               ; keywords
       4 nil                                    ; nil
       5 (= (mod i 2) 0)                        ; booleans
       6 {:nested i :data (str "value-" i)}))))  ; maps

;;-----------------------------------------------------------------------------
;; VEC Large Scale Tests
;;-----------------------------------------------------------------------------

(deftest slab-vec-2000-elements-test
  (testing "slab-vec with 2000 elements"
    (let [a (e/atom ::slab-vec-2000 {})
          result (swap! a (fn [_]
                           (let [n 2000
                                 v (sv/sab-vec (range n))]
                             (is (= n (count v)) "Count should be 2000")
                             (is (= 0 (nth v 0)))
                             (is (= 1024 (nth v 1024)))
                             (is (= 1500 (nth v 1500)))
                             (is (= 1999 (nth v 1999)))
                             (is (= (reduce + (range n)) (reduce + 0 v)))
                             :done)))]
      (is (= :done result)))))

(deftest slab-vec-5000-elements-test
  (testing "slab-vec with 5000 elements"
    (let [a (e/atom ::slab-vec-5000 {})
          result (swap! a (fn [_]
                           (let [n 5000
                                 v (sv/sab-vec (range n))]
                             (is (= n (count v)))
                             (is (= 0 (nth v 0)))
                             (is (= 31 (nth v 31)))
                             (is (= 32 (nth v 32)))
                             (is (= 1000 (nth v 1000)))
                             (is (= 2500 (nth v 2500)))
                             (is (= 4000 (nth v 4000)))
                             (is (= 4999 (nth v 4999)))
                             :done)))]
      (is (= :done result)))))

(deftest slab-vec-10000-elements-test
  (testing "slab-vec with 10000 elements"
    (let [a (e/atom ::slab-vec-10000 {})
          result (swap! a (fn [_]
                           (let [n 10000
                                 v (sv/sab-vec (range n))]
                             (is (= n (count v)))
                             (is (= 0 (nth v 0)))
                             (is (= 9999 (nth v 9999)))
                             (is (= 5000 (nth v 5000)))
                             ;; Assoc deep in trie
                             (let [v2 (assoc v 7500 :replaced)]
                               (is (= :replaced (nth v2 7500)))
                               (is (= 7500 (nth v 7500))))
                             :done)))]
      (is (= :done result)))))

(deftest slab-vec-heterogeneous-data-test
  (testing "slab-vec with heterogeneous data (2000 elements)"
    (let [a (e/atom ::slab-vec-hetero {})
          result (swap! a (fn [_]
                           (let [n 2000
                                 data (generate-heterogeneous-data n)
                                 v (sv/sab-vec data)]
                             (is (= n (count v)))
                             (doseq [i (range n)]
                               (let [expected (nth data i)
                                     actual (nth v i)]
                                 (is (= expected actual)
                                     (str "Mismatch at index " i ": expected " expected ", got " actual))))
                             :done)))]
      (is (= :done result)))))

(deftest slab-vec-many-updates-test
  (testing "slab-vec with many assoc operations"
    (let [a (e/atom ::slab-vec-updates {})
          result (swap! a (fn [_]
                           (let [n 2000
                                 v (sv/sab-vec (range n))]
                             (let [v2 (reduce (fn [acc i]
                                                (assoc acc i (* i 100)))
                                              v
                                              (range 0 n 10))]
                               (is (= n (count v2)))
                               (doseq [i (range 0 n 10)]
                                 (is (= (* i 100) (nth v2 i))))
                               (is (= 5 (nth v2 5)))
                               (is (= 15 (nth v2 15))))
                             :done)))]
      (is (= :done result)))))

(deftest slab-vec-sequential-pop-test
  (testing "slab-vec popping from 2000 down to 0"
    (let [a (e/atom ::slab-vec-pop {})
          result (swap! a (fn [_]
                           (let [n 2000
                                 v (sv/sab-vec (range n))]
                             (loop [current v
                                    expected-count n]
                               (when (> expected-count 0)
                                 (is (= expected-count (count current)))
                                 (is (= (dec expected-count) (peek current)))
                                 (recur (pop current) (dec expected-count))))
                             :done)))]
      (is (= :done result)))))

;;-----------------------------------------------------------------------------
;; LIST Large Scale Tests
;;-----------------------------------------------------------------------------

(deftest slab-list-2000-elements-test
  (testing "slab-list with 2000 elements"
    (let [a (e/atom ::slab-list-2000 {})
          result (swap! a (fn [_]
                           (let [n 2000
                                 l (sl/sab-list (range n))]
                             (is (= n (count l)))
                             (is (= 0 (first l)))
                             (is (= (vec (range n)) (vec l)))
                             :done)))]
      (is (= :done result)))))

(deftest slab-list-5000-elements-test
  (testing "slab-list with 5000 elements"
    (let [a (e/atom ::slab-list-5000 {})
          result (swap! a (fn [_]
                           (let [n 5000
                                 l (sl/sab-list (range n))]
                             (is (= n (count l)))
                             (is (= 0 (first l)))
                             (is (= 2500 (nth l 2500)))
                             (is (= 4999 (nth l 4999)))
                             :done)))]
      (is (= :done result)))))

(deftest slab-list-heterogeneous-data-test
  (testing "slab-list with heterogeneous data (2000 elements)"
    (let [a (e/atom ::slab-list-hetero {})
          result (swap! a (fn [_]
                           (let [n 2000
                                 data (generate-heterogeneous-data n)
                                 l (sl/sab-list data)]
                             (is (= n (count l)))
                             (doseq [i (range n)]
                               (is (= (nth data i) (nth l i))
                                   (str "Mismatch at index " i)))
                             :done)))]
      (is (= :done result)))))

(deftest slab-list-many-conj-test
  (testing "slab-list with many conj operations (building 3000 elements)"
    (let [a (e/atom ::slab-list-conj {})
          result (swap! a (fn [_]
                           (let [n 3000
                                 l (reduce conj (sl/empty-sab-list) (range n))]
                             (is (= n (count l)))
                             ;; Lists conj at front, so last conj'd is first
                             (is (= (dec n) (first l)))
                             (is (= 0 (nth l (dec n))))
                             :done)))]
      (is (= :done result)))))

(deftest slab-list-sequential-pop-test
  (testing "slab-list popping from 2000 down to 0"
    (let [a (e/atom ::slab-list-pop {})
          result (swap! a (fn [_]
                           (let [n 2000
                                 l (sl/sab-list (range n))]
                             (loop [current l
                                    expected-count n
                                    expected-first 0]
                               (when (> expected-count 0)
                                 (is (= expected-count (count current)))
                                 (is (= expected-first (first current)))
                                 (recur (pop current) (dec expected-count) (inc expected-first))))
                             :done)))]
      (is (= :done result)))))

;;-----------------------------------------------------------------------------
;; MAP Large Scale Tests
;;-----------------------------------------------------------------------------

(deftest hash-map-2000-entries-test
  (testing "hash-map with 2000 integer key entries"
    (let [a (e/atom ::hash-map-2000 {})
          result (swap! a (fn [_]
                           (let [n 2000
                                 m (reduce (fn [m i] (assoc m i (* i 10)))
                                           (sm/empty-hash-map)
                                           (range n))]
                             (is (= n (count m)))
                             (is (= 0 (get m 0)))
                             (is (= 10000 (get m 1000)))
                             (is (= 15000 (get m 1500)))
                             (is (= 19990 (get m 1999)))
                             :done)))]
      (is (= :done result)))))

(deftest hash-map-5000-entries-test
  (testing "hash-map with 5000 entries"
    (let [a (e/atom ::hash-map-5000 {})
          result (swap! a (fn [_]
                           (let [n 5000
                                 m (reduce (fn [m i] (assoc m i (str "value-" i)))
                                           (sm/empty-hash-map)
                                           (range n))]
                             (is (= n (count m)))
                             (is (= "value-0" (get m 0)))
                             (is (= "value-2500" (get m 2500)))
                             (is (= "value-4999" (get m 4999)))
                             :done)))]
      (is (= :done result)))))

(deftest hash-map-7500-entries-test
  (testing "hash-map with 7500 integer entries"
    (let [a (e/atom ::hash-map-7500 {})
          result (swap! a (fn [_]
                           (let [n 7500
                                 m (reduce (fn [m i] (assoc m i (* i 10)))
                                           (sm/empty-hash-map)
                                           (range n))]
                             (is (= n (count m)))
                             (is (= 0 (get m 0)))
                             (is (= 37500 (get m 3750)))
                             (is (= 74990 (get m 7499)))
                             :done)))]
      (is (= :done result)))))

(deftest hash-map-string-keys-test
  (testing "hash-map with 2000 string keys"
    (let [a (e/atom ::hash-map-strings {})
          result (swap! a (fn [_]
                           (let [n 2000
                                 m (reduce (fn [m i]
                                             (assoc m (str "key-" i) (* i 10)))
                                           (sm/empty-hash-map)
                                           (range n))]
                             (is (= n (count m)))
                             (is (= 0 (get m "key-0")))
                             (is (= 10000 (get m "key-1000")))
                             (is (= 19990 (get m "key-1999")))
                             :done)))]
      (is (= :done result)))))

(deftest hash-map-heterogeneous-values-test
  (testing "hash-map with heterogeneous values (2000 entries)"
    (let [a (e/atom ::hash-map-hetero {})
          result (swap! a (fn [_]
                           (let [n 2000
                                 values (generate-heterogeneous-data n)
                                 m (reduce (fn [m i]
                                             (assoc m i (nth values i)))
                                           (sm/empty-hash-map)
                                           (range n))]
                             (is (= n (count m)))
                             (doseq [i (range n)]
                               (is (= (nth values i) (get m i))
                                   (str "Mismatch at key " i)))
                             :done)))]
      (is (= :done result)))))

(deftest hash-map-many-dissocs-test
  (testing "hash-map with many dissoc operations"
    (let [a (e/atom ::hash-map-dissocs {})
          result (swap! a (fn [_]
                           (let [n 2000
                                 m (reduce (fn [m i] (assoc m i i))
                                           (sm/empty-hash-map)
                                           (range n))
                                 ;; Remove every 3rd entry
                                 m2 (reduce (fn [m i] (dissoc m i))
                                            m
                                            (filter #(= 0 (mod % 3)) (range n)))]
                             (is (< (count m2) n))
                             (is (> (count m2) 0))
                             (doseq [i (filter #(= 0 (mod % 3)) (range n))]
                               (is (nil? (get m2 i))))
                             (doseq [i (filter #(not= 0 (mod % 3)) (range n))]
                               (is (= i (get m2 i))))
                             :done)))]
      (is (= :done result)))))

(deftest hash-map-update-all-test
  (testing "hash-map updating all 2000 entries"
    (let [a (e/atom ::hash-map-update {})
          result (swap! a (fn [_]
                           (let [n 2000
                                 m1 (reduce (fn [m i] (assoc m i i))
                                            (sm/empty-hash-map)
                                            (range n))
                                 m2 (reduce (fn [m i] (assoc m i (* i 100)))
                                            m1
                                            (range n))]
                             (is (= n (count m2)))
                             (doseq [i (range n)]
                               (is (= (* i 100) (get m2 i))))
                             :done)))]
      (is (= :done result)))))

;;-----------------------------------------------------------------------------
;; SET Large Scale Tests
;;-----------------------------------------------------------------------------

(deftest slab-set-2000-elements-test
  (testing "slab-set with 2000 integer elements"
    (let [a (e/atom ::slab-set-2000 {})
          result (swap! a (fn [_]
                           (let [n 2000
                                 s (into (ss/hash-set) (range n))]
                             (is (= n (count s)))
                             (doseq [i (range n)]
                               (is (contains? s i)))
                             (is (not (contains? s n)))
                             (is (not (contains? s -1)))
                             :done)))]
      (is (= :done result)))))

(deftest slab-set-5000-elements-test
  (testing "slab-set with 5000 elements"
    (let [a (e/atom ::slab-set-5000 {})
          result (swap! a (fn [_]
                           (let [n 5000
                                 s (into (ss/hash-set) (range n))]
                             (is (= n (count s)))
                             (is (contains? s 0))
                             (is (contains? s 2500))
                             (is (contains? s 4999))
                             (is (not (contains? s 5000)))
                             :done)))]
      (is (= :done result)))))

(deftest slab-set-string-elements-test
  (testing "slab-set with 2000 string elements"
    (let [a (e/atom ::slab-set-strings {})
          result (swap! a (fn [_]
                           (let [n 2000
                                 data (mapv #(str "elem-" %) (range n))
                                 s (into (ss/hash-set) data)]
                             (is (= n (count s)))
                             (is (contains? s "elem-0"))
                             (is (contains? s "elem-1000"))
                             (is (contains? s "elem-1999"))
                             (is (not (contains? s "elem-2000")))
                             :done)))]
      (is (= :done result)))))

(deftest slab-set-many-disj-test
  (testing "slab-set with many disj operations"
    (let [a (e/atom ::slab-set-disj {})
          result (swap! a (fn [_]
                           (let [n 2000
                                 s (into (ss/hash-set) (range n))
                                 s2 (reduce disj s (filter even? (range n)))]
                             (is (= (/ n 2) (count s2)))
                             (doseq [i (filter even? (range n))]
                               (is (not (contains? s2 i))))
                             (doseq [i (filter odd? (range n))]
                               (is (contains? s2 i)))
                             :done)))]
      (is (= :done result)))))

(deftest slab-set-add-remove-cycles-test
  (testing "slab-set add/remove cycles (stress test)"
    (let [a (e/atom ::slab-set-cycles {})
          r (swap! a (fn [_]
                       (let [base-set (into (ss/hash-set) (range 1000))]
                         (let [result (-> base-set
                                          (as-> s (reduce conj s (range 1000 1500)))
                                          (as-> s (reduce disj s (range 0 500))))]
                           (is (= 1000 (count result)))
                           (doseq [i (range 500 1000)]
                             (is (contains? result i)))
                           (doseq [i (range 1000 1500)]
                             (is (contains? result i)))
                           (doseq [i (range 0 500)]
                             (is (not (contains? result i)))))
                         :done)))]
      (is (= :done r)))))

;;-----------------------------------------------------------------------------
;; Mixed Operations Stress Tests
;;-----------------------------------------------------------------------------

(deftest mixed-operations-vec-stress-test
  (testing "slab-vec mixed operations stress test"
    (let [a (e/atom ::mixed-vec-stress {})
          result (swap! a (fn [_]
                           (let [v1 (sv/sab-vec (range 1500))
                                 v2 (reduce (fn [v i] (assoc v i :updated))
                                            v1
                                            (range 0 1500 100))
                                 v3 (loop [v v2 n 500]
                                      (if (zero? n)
                                        v
                                        (recur (pop v) (dec n))))]
                             (is (= 1000 (count v3)))
                             (doseq [i (range 0 1000 100)]
                               (is (= :updated (nth v3 i))))
                             :done)))]
      (is (= :done result)))))

(deftest mixed-operations-map-stress-test
  (testing "hash-map mixed operations stress test"
    (let [a (e/atom ::mixed-map-stress {})
          result (swap! a (fn [_]
                           (let [m1 (reduce (fn [m i] (assoc m i {:v i}))
                                            (sm/empty-hash-map)
                                            (range 2000))
                                 m2 (reduce (fn [m i] (assoc m i {:v (* i 2)}))
                                            m1
                                            (range 2000))
                                 m3 (reduce dissoc m2 (range 0 2000 2))]
                             (is (= 1000 (count m3)))
                             (doseq [i (range 1 2000 2)]
                               (is (= {:v (* i 2)} (get m3 i))))
                             :done)))]
      (is (= :done result)))))

;;-----------------------------------------------------------------------------
;; Persistence Under Load Tests
;;-----------------------------------------------------------------------------

(deftest persistence-many-versions-vec-test
  (testing "slab-vec persistence with many versions"
    (let [a (e/atom ::persistence-vec {})
          result (swap! a (fn [_]
                           (let [base (sv/sab-vec (range 1000))
                                 versions (for [i (range 100)]
                                            (assoc base (* i 10) :modified))]
                             (doseq [i (range 1000)]
                               (is (= i (nth base i))))
                             (doseq [[i v] (map-indexed vector versions)]
                               (is (= :modified (nth v (* i 10)))))
                             :done)))]
      (is (= :done result)))))

(deftest persistence-many-versions-map-test
  (testing "hash-map persistence with many versions"
    (let [a (e/atom ::persistence-map {})
          result (swap! a (fn [_]
                           (let [base (reduce (fn [m i] (assoc m i i))
                                              (sm/empty-hash-map)
                                              (range 1000))
                                 v1 (assoc base 500 :v1)
                                 v2 (assoc base 500 :v2)
                                 v3 (dissoc base 500)]
                             (is (= 1000 (count base)))
                             (is (= 1000 (count v1)))
                             (is (= 1000 (count v2)))
                             (is (= 999 (count v3)))
                             (is (= 500 (get base 500)))
                             (is (= :v1 (get v1 500)))
                             (is (= :v2 (get v2 500)))
                             (is (nil? (get v3 500)))
                             :done)))]
      (is (= :done result)))))

;;-----------------------------------------------------------------------------
;; Reduce Performance on Large Collections
;;-----------------------------------------------------------------------------

(deftest reduce-large-vec-test
  (testing "reduce on 5000 element slab-vec"
    (let [a (e/atom ::reduce-large-vec {})
          result (swap! a (fn [_]
                           (let [v (sv/sab-vec (range 5000))]
                             (is (= (reduce + (range 5000)) (reduce + 0 v)))
                             (is (= (reduce + (map #(* % 2) (range 5000)))
                                    (reduce (fn [acc x] (+ acc (* x 2))) 0 v)))
                             :done)))]
      (is (= :done result)))))

(deftest reduce-large-map-test
  (testing "reduce on 5000 entry hash-map"
    (let [a (e/atom ::reduce-large-map {})
          result (swap! a (fn [_]
                           (let [m (reduce (fn [m i] (assoc m i (* i 2)))
                                           (sm/empty-hash-map)
                                           (range 5000))]
                             (is (= (reduce + (map #(* % 2) (range 5000)))
                                    (reduce (fn [acc [k v]] (+ acc v)) 0 m)))
                             (is (= (reduce + (range 5000))
                                    (reduce (fn [acc [k v]] (+ acc k)) 0 m)))
                             :done)))]
      (is (= :done result)))))

(deftest reduce-large-set-test
  (testing "reduce on 5000 element slab-set"
    (let [a (e/atom ::reduce-large-set {})
          result (swap! a (fn [_]
                           (let [s (into (ss/hash-set) (range 5000))]
                             (is (= (reduce + (range 5000)) (reduce + 0 s)))
                             :done)))]
      (is (= :done result)))))

;;-----------------------------------------------------------------------------
;; Edge Cases at Scale
;;-----------------------------------------------------------------------------

(deftest boundary-chunk-size-vec-test
  (testing "slab-vec at chunk boundaries (32, 64, 1024, 1025, 2048)"
    (let [a (e/atom ::boundary-vec {})
          result (swap! a (fn [_]
                           (doseq [n [32 64 1024 1025 2048]]
                             (let [v (sv/sab-vec (range n))]
                               (is (= n (count v)) (str "Count mismatch for n=" n))
                               (is (= 0 (nth v 0)))
                               (is (= (dec n) (nth v (dec n))))))
                           :done))]
      (is (= :done result)))))

(deftest boundary-operations-map-test
  (testing "hash-map operations at boundary sizes"
    (let [a (e/atom ::boundary-map {})
          result (swap! a (fn [_]
                           (doseq [n [31 32 33 63 64 65 1023 1024 1025]]
                             (let [m (reduce (fn [m i] (assoc m i i))
                                             (sm/empty-hash-map)
                                             (range n))]
                               (is (= n (count m)) (str "Count mismatch for n=" n))
                               (let [m2 (assoc m n n)]
                                 (is (= (inc n) (count m2))))))
                           :done))]
      (is (= :done result)))))
