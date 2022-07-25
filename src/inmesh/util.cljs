(ns inmesh.util
  (:require
   [clojure.edn :as edn]
   [goog.string :as string]
   [cljs.reader :as reader]))

(set! reader/*default-data-reader-fn* (atom tagged-literal))

(defn encode-qp [m]
  (let [qp-s (str "?" (string/urlEncode (pr-str m)))]
    qp-s))

(defn decode-qp [s]
  (some->> s
           str
           (#(if (.startsWith % "?") (rest %) (seq %)))
           (apply str)
           string/urlDecode
           edn/read-string))

(defn gen-id [& [data]]
  (or (:id data)
      (str (random-uuid))))

(defn num-cores []
  (.-hardwareConcurrency js/self.navigator))
