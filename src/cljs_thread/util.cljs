(ns cljs-thread.util
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
  (cond
    (and (exists? js/self) (exists? js/self.navigator))
    (.-hardwareConcurrency js/self.navigator)

    (and (exists? js/process) (exists? js/process.versions))
    (let [os (js* "require('os')")]
      ;; Use aget to prevent Closure Compiler from renaming .cpus
      (.-length ((aget os "cpus"))))

    :else 4))

;; Cache UA string at load time, before DOM proxy installs (which would block on Atomics.wait)
(defonce ^:private cached-user-agent
  (if (and (exists? js/navigator) (some? js/navigator))
    (.-userAgent js/navigator)
    nil))

(defn in-browser? [browser-string]
  (if cached-user-agent
    (> (.indexOf cached-user-agent browser-string) -1)
    false))

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

;; Boot sequence logging - writes to stderr for debugging initialization order
(defn boot-log
  "Log boot sequence events to stderr. Thread identifies the worker context."
  [thread msg]
  (when (and (exists? js/process) (exists? js/process.versions))
    (let [ts (- (.now js/Date) (or js/globalThis.__boot_start_time 0))
          fs (js/require "fs")]
      (when-not js/globalThis.__boot_start_time
        (set! js/globalThis.__boot_start_time (.now js/Date)))
      (.writeSync fs 2 (str "[BOOT +" ts "ms " thread "] " msg "\n")))))
