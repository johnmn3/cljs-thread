(ns cljs-thread.idb
  (:require
   [clojure.edn :as edn]
   [cljs-thread.env :as e]
   [cljs-thread.state :as s]
   [cljs-thread.on-when :refer [on-watch]]))

(def idb-key "cljs-thread.db")

(def open? (atom false))

(defn ^:export idb-set! [k data & [yield]]
  (on-watch open? true?
    (let [adb @s/idb
          transaction (.transaction adb #js [idb-key] "readwrite")
          os (.objectStore transaction idb-key)
          req (.put os (pr-str data) (pr-str k))]
      (set! (.-onerror req) #(println :idb-set! :error)) 
      (set! (.-onsuccess req) #(let [res (some-> % .-target .-result)]
                                 (yield res)))
      (set! (.-oncomplete req) #(println :set :complete!)))))

(defn ^:export idb-get [k yield]
  (on-watch open? true?
    (let [adb @s/idb
          req (-> adb
                  (.transaction #js [idb-key])
                  (.objectStore idb-key)
                  (.get (pr-str k)))]
      (when req
        (set! (.-onerror req) #(do (yield nil)
                                   (throw (ex-info (str "idb-get failed getting " k)
                                                   {:k k :error %}))))
        (set! (.-onsuccess req) #(let [res (-> % .-target .-result edn/read-string)]
                                   (yield {:res res})))))))

(defn startup []
  (let [request (.open js/indexedDB idb-key 1)]
    (set! (.-onerror request) #(do (println :idb-open-error %)))
    (set! (.-onsuccess request)
          #(do (reset! s/idb (-> % .-target .-result))
               (reset! open? true)))
    (set! (.-onupgradeneeded request)
          #(let [db (-> % .-target .-result)
                 os (.createObjectStore db idb-key)]
             (reset! s/idb db)
             (set! (-> os .-transaction .-oncomplete)
                   (fn [e]
                      (let [init-os
                            (-> db
                                (.transaction idb-key "readwrite")
                                (.objectStore idb-key))]
                        (reset! open? true))))))))

(when (= :db (:id e/data))
  (swap! open? (constantly false))
  (on-watch open? false?
    (startup))
  (swap! open? identity))
