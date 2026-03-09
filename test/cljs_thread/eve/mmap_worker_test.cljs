(ns cljs-thread.eve.mmap-worker-test
  "Async wait/notify test for NodeMmapRegion using an inline worker_thread.
   Requires native addon at build/Release/mmap_cas.node (npm run build:addon).
   Split from mmap_test to keep file sizes below 150 lines.
   NO namespace-level side effects — addon loading done in run-mmap! (runner)."
  (:require [cljs.test :refer [deftest is async]]
            [cljs-thread.eve.mem :as mem]))

(def ^:private fs (js/require "fs"))

(deftest test-wait-notify-worker
  (async done
    (let [path   (str "/tmp/eve-m2-wn-" (js/Date.now) ".mem")
          region (mem/open-mmap-region path 4096)
          _      (mem/-store-i32! region 0 42)
          wcode  (str "const {workerData,parentPort}=require('worker_threads');"
                      "const a=require(workerData.p);"
                      "const b=a.open(workerData.f,4096);"
                      "const r=a.wait32(b,0,42,5000);"
                      "parentPort.postMessage({r,v:a.load32(b,0)});")
          addon-path (.resolve (js/require "path") "build/Release/mmap_cas.node")
          Worker (.-Worker (js/require "worker_threads"))
          w      (Worker. wcode #js{:eval true
                                    :workerData #js{:p addon-path
                                                    :f path}})]
      (.on w "message"
           (fn [msg]
             (is (= "ok" (.-r msg)) "wait32 returned ok")
             (is (= 999  (.-v msg)) "new value 999 visible in worker")
             (.unlinkSync fs path)
             (done)))
      (js/setTimeout
        (fn []
          (mem/-store-i32! region 0 999)
          (mem/-notify-i32! region 0 1))
        500))))
