(ns inmesh.idb
  (:require
   [clojure.edn :as edn]
   [inmesh.state :as s]))

(def idb-key "inmesh.db")

(defn ^:export idb-open [& [yield]]
  (let [yield (or yield identity)
        req (.open js/indexedDB idb-key 1)
        use-fallback #(reset! s/idb :use-fallback-db)
        get-result #(-> % .-target .-result)]
    (set! (.-onerror req) #(do (use-fallback) (yield false)))
    (set! (.-onsuccess req) #(do (reset! s/idb (get-result %)) (yield true)))
    (set! (.-onupgradeneeded req) #(let [adb (get-result %)]
                                     (reset! s/idb adb)
                                     (set! (.. % -target -transaction -onerror) use-fallback)
                                     (.createObjectStore adb idb-key)
                                     (yield true)))))

(defn ^:export idb-set! [k data & [yield]]
  (let [adb @s/idb]
    (if (= adb :use-fallback-db)
      (do (swap! s/fallback-db assoc k data)
          (when yield (yield true)))
      (let [req (some-> adb
                        (.transaction #js [idb-key] "readwrite")
                        (.objectStore idb-key)
                        (.put (pr-str data) (pr-str k)))]
        (when req
          (set! (.-onerror req) #(do (when yield (yield false))
                                     (throw (ex-info (str "idb-set! failed setting " k " to " data)
                                                     {:k k :data data :error %}))))
          (set! (.-oncomplete req) #(when yield (yield true))))))))

(defn ^:export idb-get [k yield]
  (let [adb @s/idb]
    (if (= adb :use-fallback-db)
      (yield (get @s/fallback-db k))
      (let [req (some-> adb
                        (.transaction #js [idb-key])
                        (.objectStore idb-key)
                        (.get (pr-str k)))]
        (when req
          (set! (.-onerror req) #(do (yield nil)
                                     (throw (ex-info (str "idb-get failed getting " k)
                                                     {:k k :error %}))))
          (set! (.-onsuccess req) #(let [res (-> % .-target .-result edn/read-string)]
                                     (yield res))))))))
