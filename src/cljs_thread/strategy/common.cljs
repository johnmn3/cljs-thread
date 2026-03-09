(ns cljs-thread.strategy.common
  "Shared utilities for all worker-spawn strategies.
   Provides cross-platform self-URL detection, blob/eval worker creation,
   and init-data embedding helpers."
  (:require
   [cljs.reader]
   [cljs-thread.platform :as p]))

;; ---------------------------------------------------------------------------
;; Self-URL detection
;; ---------------------------------------------------------------------------

(defn detect-self-url
  "Detect the URL or file path of the currently executing script.
   Browser: document.currentScript.src or Error stack-trace parsing.
   Node: __filename."
  []
  (if p/node?
    ;; Node: __filename is always available
    (try (js* "__filename") (catch :default _ nil))
    ;; Browser: try currentScript first, then error stack parse
    (or (when (and (exists? js/document)
                   (exists? js/document.currentScript)
                   (some? js/document.currentScript))
          (.-src js/document.currentScript))
        ;; Fallback: parse Error().stack for a URL
        (try
          (let [stack (.-stack (js/Error.))
                ;; Match http(s)://...filename.js(:line:col)
                match (re-find #"(https?://[^\s\)]+\.js)" stack)]
            (second match))
          (catch :default _ nil)))))

(defn detect-base-url
  "Get the base URL (directory) from a full URL or path.
   '/path/to/worker.js' -> '/path/to/'
   'http://example.com/js/app.js' -> 'http://example.com/js/'"
  [url]
  (when url
    (let [last-slash (.lastIndexOf url "/")]
      (when (>= last-slash 0)
        (subs url 0 (inc last-slash))))))

;; ---------------------------------------------------------------------------
;; Worker creation helpers
;; ---------------------------------------------------------------------------

(defn make-blob-url
  "Browser: create a Blob URL from a JavaScript code string."
  [code-str]
  (let [blob (js/Blob. #js [code-str] #js {:type "application/javascript"})]
    (js/URL.createObjectURL blob)))

(defn revoke-blob-url
  "Browser: revoke a previously created Blob URL."
  [url]
  (js/URL.revokeObjectURL url))

(defn create-blob-worker
  "Browser: create a Worker from an inline JavaScript string via Blob URL.
   Returns {:worker w :blob-url url} so caller can revoke the URL."
  [code-str on-message]
  (let [url (make-blob-url code-str)
        w (js/Worker. url)]
    (set! (.-onmessage w) on-message)
    {:worker w :blob-url url}))

(defn create-eval-worker
  "Node: create a worker_thread from an inline JavaScript string.
   Uses the {eval: true} option."
  [code-str worker-data on-message]
  (let [wt (js* "require('worker_threads')")
        WorkerCls (.-Worker wt)
        w (WorkerCls. code-str
                      #js {:eval true
                           :workerData (clj->js worker-data)})]
    (.on w "message" on-message)
    ;; Direct SAB sync: no coordinator handlers needed
    w))

;; ---------------------------------------------------------------------------
;; Init data embedding
;; ---------------------------------------------------------------------------

(defn embed-init-data-js
  "Generate a JS expression that sets globalThis.__cljs_thread_init_data
   to the given ClojureScript data map (serialized as EDN string).
   Uses JSON.stringify at generation time to safely escape the EDN for JS."
  [data]
  (let [edn-str (pr-str data)
        ;; Use JSON.stringify to properly escape for JS string context
        js-str (js/JSON.stringify edn-str)]
    (str "globalThis.__cljs_thread_init_data = " js-str ";\n")))

(defn read-embedded-init-data
  "Read init data from globalThis.__cljs_thread_init_data if present.
   Returns nil if not set."
  []
  (when (exists? js/globalThis.__cljs_thread_init_data)
    (try
      (cljs.reader/read-string js/globalThis.__cljs_thread_init_data)
      (catch :default _ nil))))

;; ---------------------------------------------------------------------------
;; URL helpers
;; ---------------------------------------------------------------------------

(defn extract-origin
  "Extract the origin (protocol + host + port) from a URL.
   E.g. 'http://localhost:9092/shared.js' -> 'http://localhost:9092'"
  [url]
  (try
    (let [u (js/URL. url)]
      (.-origin u))
    (catch :default _ nil)))

(def import-scripts-resolver-js
  "JS snippet that wraps self.importScripts to resolve relative URLs
   using globalThis.__cljs_thread_origin. Blob workers have null origin,
   so relative importScripts calls fail without this."
  "(function(){
  var _orig = self.importScripts;
  self.importScripts = function(){
    var origin = self.__cljs_thread_origin || '';
    var args = Array.from(arguments).map(function(url){
      if (!origin || /^(https?:|blob:)/.test(url)) return url;
      return url.charAt(0) === '/' ? origin + url : origin + '/' + url;
    });
    return _orig.apply(self, args);
  };
})();\n")

;; ---------------------------------------------------------------------------
;; Module URL resolution
;; ---------------------------------------------------------------------------

(defn resolve-script-urls
  "Given a base URL and a seq of relative script paths, return absolute URLs.
   E.g. (resolve-script-urls 'http://x.com/js/' ['shared.js' 'core.js'])
        => ['http://x.com/js/shared.js' 'http://x.com/js/core.js']"
  [base-url scripts]
  (mapv #(str base-url %) scripts))

(defn resolve-node-paths
  "Given a base directory and a seq of relative file paths, return absolute paths.
   Uses Node's path.resolve."
  [base-dir scripts]
  (let [path (js* "require('path')")]
    (mapv #(.resolve path base-dir %) scripts)))
