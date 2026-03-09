(ns cljs-thread.eve.mmap-test
  "Unit tests for NodeMmapRegion (file-backed MAP_SHARED mmap via mmap_cas addon).
   Requires native addon at build/Release/mmap_cas.node (npm run build:addon).
   NodeMmapRegion tests; JsSabRegion tests are in mem-test.
   NO namespace-level side effects — addon loading is done in run-mmap! (runner)."
  (:require [cljs.test :refer [deftest testing is async]]
            [cljs-thread.eve.mem :as mem]))

(def ^:private fs (js/require "fs"))

(deftest test-addon-loaded
  (testing "native-addon-loaded? returns true after load-native-addon!"
    (is (true? (mem/native-addon-loaded?)))))

(deftest test-open-creates-file
  (let [path (str "/tmp/eve-m2-create-" (js/Date.now) ".mem")]
    (try
      (mem/open-mmap-region path 4096)
      (is (true? (.existsSync fs path)))
      (finally (.unlinkSync fs path)))))

(deftest test-byte-length
  (let [p1 (str "/tmp/eve-m2-bl1-" (js/Date.now) ".mem")
        p2 (str "/tmp/eve-m2-bl2-" (js/Date.now) ".mem")]
    (try
      (is (= 4096  (mem/-byte-length (mem/open-mmap-region p1 4096))))
      (is (= 65536 (mem/-byte-length (mem/open-mmap-region p2 65536))))
      (finally (.unlinkSync fs p1) (.unlinkSync fs p2)))))

(deftest test-store-load-roundtrip
  (let [path (str "/tmp/eve-m2-sl-" (js/Date.now) ".mem")]
    (try
      (let [r (mem/open-mmap-region path 4096)]
        (mem/store-i32! r 0 42)
        (is (= 42  (mem/load-i32 r 0)))
        (mem/store-i32! r 0 -1)
        (is (= -1  (mem/load-i32 r 0)))
        (mem/store-i32! r 4 99)
        (is (= -1  (mem/load-i32 r 0)))
        (is (= 99  (mem/load-i32 r 4))))
      (finally (.unlinkSync fs path)))))

(deftest test-cas-success
  (let [path (str "/tmp/eve-m2-cs-" (js/Date.now) ".mem")]
    (try
      (let [r (mem/open-mmap-region path 4096)]
        (mem/store-i32! r 0 10)
        (let [old (mem/cas-i32! r 0 10 20)]
          (is (= 10 old))
          (is (= 20 (mem/load-i32 r 0)))))
      (finally (.unlinkSync fs path)))))

(deftest test-cas-failure
  (let [path (str "/tmp/eve-m2-cf-" (js/Date.now) ".mem")]
    (try
      (let [r (mem/open-mmap-region path 4096)]
        (mem/store-i32! r 0 10)
        (let [old (mem/cas-i32! r 0 99 20)]
          (is (= 10 old))
          (is (= 10 (mem/load-i32 r 0)))))
      (finally (.unlinkSync fs path)))))

(deftest test-add-sub
  (let [path (str "/tmp/eve-m2-as-" (js/Date.now) ".mem")]
    (try
      (let [r (mem/open-mmap-region path 4096)]
        (mem/store-i32! r 0 10)
        (is (= 10 (mem/add-i32! r 0 5)))
        (is (= 15 (mem/load-i32 r 0)))
        (is (= 15 (mem/sub-i32! r 0 3)))
        (is (= 12 (mem/load-i32 r 0))))
      (finally (.unlinkSync fs path)))))

(deftest test-exchange
  (let [path (str "/tmp/eve-m2-ex-" (js/Date.now) ".mem")]
    (try
      (let [r (mem/open-mmap-region path 4096)]
        (mem/store-i32! r 0 42)
        (is (= 42 (mem/exchange-i32! r 0 99)))
        (is (= 99 (mem/load-i32 r 0))))
      (finally (.unlinkSync fs path)))))

(deftest test-two-mappings-share-writes
  (let [path (str "/tmp/eve-m2-sh-" (js/Date.now) ".mem")]
    (try
      (let [r1 (mem/open-mmap-region path 4096)
            r2 (mem/open-mmap-region path 4096)]
        (mem/store-i32! r1 0 1111)
        (is (= 1111 (mem/load-i32 r2 0))))
      (finally (.unlinkSync fs path)))))

(deftest test-two-mappings-share-cas
  (let [path (str "/tmp/eve-m2-sc-" (js/Date.now) ".mem")]
    (try
      (let [r1 (mem/open-mmap-region path 4096)
            r2 (mem/open-mmap-region path 4096)]
        (mem/store-i32! r1 0 7)
        (let [old (mem/cas-i32! r2 0 7 42)]
          (is (= 7  old))
          (is (= 42 (mem/load-i32 r1 0)))))
      (finally (.unlinkSync fs path)))))

(deftest test-read-write-bytes
  (let [path (str "/tmp/eve-m2-rw-" (js/Date.now) ".mem")]
    (try
      (let [r   (mem/open-mmap-region path 4096)
            src (js/Uint8Array. (clj->js [1 2 3 4]))]
        (mem/write-bytes! r 16 src)
        (is (= [1 2 3 4] (vec (mem/read-bytes r 16 4)))))
      (finally (.unlinkSync fs path)))))

(deftest test-supports-watch-false
  (let [path (str "/tmp/eve-m2-sw-" (js/Date.now) ".mem")]
    (try
      (is (false? (mem/supports-watch? (mem/open-mmap-region path 4096))))
      (finally (.unlinkSync fs path)))))

(deftest test-wait-not-equal
  (let [path (str "/tmp/eve-m2-wne-" (js/Date.now) ".mem")]
    (try
      (let [r (mem/open-mmap-region path 4096)]
        (mem/store-i32! r 0 42)
        (is (= :not-equal (mem/wait-i32! r 0 0 1000))))
      (finally (.unlinkSync fs path)))))

(deftest test-wait-timed-out
  (let [path (str "/tmp/eve-m2-wto-" (js/Date.now) ".mem")]
    (try
      (let [r (mem/open-mmap-region path 4096)]
        (mem/store-i32! r 0 42)
        (is (= :timed-out (mem/wait-i32! r 0 42 1))))
      (finally (.unlinkSync fs path)))))
