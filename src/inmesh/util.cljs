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

(defn in-browser? [browser-string]
  (-> js/navigator.userAgent
      (.indexOf browser-string)
      (> -1)))

(defn in-chrome? []
  (in-browser? "Chrome"))

(defn in-ie? []
  (or (in-browser? "MSIE")
      (in-browser? "rv:")))

(defn in-firefox? []
  (in-browser? "Firefox"))

(defn in-safari? []
  (and (in-browser? "Safari")
       (not (in-chrome?))))

(defn in-opera? []
  (and (in-browser? "OP")
       (not (in-chrome?))))

(defn browser-type []
  (cond (in-chrome?) :chrome
        (in-ie?) :ie
        (in-firefox?) :firefox
        (in-safari?) :safari
        (in-opera?) :opera))

(defn typed-array?
  "Tests whether a given `value` is a typed array."
  [value]
  (let [value-type (type value)]
    (or (when (exists? js/SharedArrayBuffer)
          (= value-type js/SharedArrayBuffer)) ;; <- not yet tested
        (= value-type js/Int8Array)
        (= value-type js/Uint8Array)
        (= value-type js/Uint8ClampedArray)
        (= value-type js/Int16Array)
        (= value-type js/Uint16Array)
        (= value-type js/Int32Array)
        (= value-type js/Uint32Array)
        (= value-type js/Float32Array)
        (= value-type js/Float64Array))))

;; TODO: add transfer semantics for these types:
  ;;:Blob.readAsArrayBuffer
  ;;:File.readAsArrayBuffer
  ;;:Base64
  ;;:DataView
  ;;:ArrayBuffer
  ;;:MessagePort
  ;;:ReadableStream
  ;;:WritableStream
  ;;:TransformStream
  ;;:AudioData
  ;;:ImageBitmap
  ;;:VideoFrame
  ;;:OffscreenCanvas
  ;;:RTCDataChannel
