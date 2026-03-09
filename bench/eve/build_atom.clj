(ns eve.build-atom
  "Build a persistent mmap-backed atom with rich heterogeneous Clojure data.

   Usage: clj -M:native-build-atom <base-path> <target-mb>
   Example: clj -M:native-build-atom /tmp/eve-10m 10"
  (:require [cljs-thread.eve.atom :as atom])
  (:import [java.io File]))

(defn- total-disk-bytes [base]
  (reduce + (map #(let [f (File. (str base %))]
                    (if (.exists f) (.length f) 0))
                 [".slab0" ".slab1" ".slab2" ".slab3" ".slab4" ".slab5"
                  ".slab6" ".root" ".rmap"
                  ".slab0.bm" ".slab1.bm" ".slab2.bm"
                  ".slab3.bm" ".slab4.bm" ".slab5.bm"])))

(defn- cleanup! [base]
  (doseq [ext [".slab0" ".slab1" ".slab2" ".slab3" ".slab4" ".slab5"
               ".slab6" ".root" ".rmap"
               ".slab0.bm" ".slab1.bm" ".slab2.bm"
               ".slab3.bm" ".slab4.bm" ".slab5.bm"]]
    (let [f (File. (str base ext))]
      (when (.exists f) (.delete f)))))

(defn- rich-value
  "Generate a rich heterogeneous Clojure value exercising maps, vectors,
   sets, lists, strings, keywords, integers, and booleans."
  [i]
  {:id i
   :name (str "user-" i)
   :email (str "user-" i "@example.com")
   :profile {:bio (str "Profile #" i " with rich metadata")
             :location {:city "San Francisco" :state "CA" :country "US"
                        :zip (str (+ 10000 (mod i 90000)))}
             :preferences {:theme (if (even? i) "dark" "light")
                           :lang "en" :notifications true
                           :font-size (+ 12 (mod i 8))}}
   :scores (vec (for [j (range 10)] (+ 60 (mod (* i (inc j)) 40))))
   :tags #{:premium :verified :active (keyword (str "tier-" (mod i 5)))}
   :history (list :signup :email-verified :first-purchase :reviewed)
   :matrix [[(mod i 100) (* i 2) (* i 3)]
            [(+ i 10) (+ i 20) (+ i 30)]
            [(+ i 100) (+ i 200) (+ i 300)]]
   :payload (apply str (repeat 500 (str (char (+ 65 (mod i 26))))))})

(defn -main [& args]
  (when (< (count args) 2)
    (println "Usage: clj -M:native-build-atom <base-path> <target-mb>")
    (println "Example: clj -M:native-build-atom /tmp/eve-10m 10")
    (System/exit 1))
  (let [base-path    (first args)
        target-mb    (parse-long (second args))
        target-bytes (* target-mb 1024 1024)
        batch-size   200]
    (cleanup! base-path)
    (println)
    (println "native-eve: Building Persistent Atom")
    (println "========================================")
    (printf  "  Path:   %s\n" base-path)
    (printf  "  Target: ~%d MB on disk\n" target-mb)
    (println "  Types:  maps, vectors, sets, lists, strings,")
    (println "          keywords, integers, booleans")
    (println "========================================")
    (println)
    ;; Pre-insert :counter key so the stress test can update it in-place
    ;; (JVM HAMT assoc on existing keys takes the fast O(log32 N) replace path)
    (let [a  (atom/persistent-atom base-path {:counter 0})
          t0 (System/nanoTime)]
      ;; Build in batches — stop when disk size reaches target
      (loop [offset 0]
        (let [disk (total-disk-bytes base-path)]
          (when (< disk target-bytes)
            (let [end   (+ offset batch-size)
                  batch (into {} (for [i (range offset end)]
                                   [(keyword (str "k" i)) (rich-value i)]))]
              (swap! a merge batch)
              (let [disk-mb   (/ (double (total-disk-bytes base-path)) (* 1024 1024))
                    elapsed-s (/ (- (System/nanoTime) t0) 1e9)]
                (printf "\r  %,6d keys | %6.1f MB on disk | %5.1fs elapsed"
                        end disk-mb elapsed-s)
                (flush))
              (recur end)))))
      (let [elapsed-s  (/ (- (System/nanoTime) t0) 1e9)
            disk-bytes (total-disk-bytes base-path)
            disk-mb    (/ (double disk-bytes) (* 1024 1024))
            key-count  (count @a)]
        (println)
        (println)
        (println "Build Complete")
        (println "========================================")
        (printf  "  Keys:        %,d\n" key-count)
        (printf  "  Disk:        %.1f MB (%,d bytes)\n" disk-mb disk-bytes)
        (printf  "  Elapsed:     %.1fs\n" elapsed-s)
        (printf  "  Throughput:  %,.0f keys/s\n" (/ key-count elapsed-s))
        (println "========================================")
        (println)
        (atom/close! a)))))
