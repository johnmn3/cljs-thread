(ns cljs-thread.in
  (:require-macros
   [cljs-thread.in])
  (:require [clojure.edn :as edn]
            [clojure.walk :refer [postwalk]]
            [cljs-thread.env :as e]
            [cljs-thread.id :refer [get-id IDable]]
            [cljs-thread.msg :as m]
            [cljs-thread.platform :as p]
            [cljs-thread.state :as s]
            [cljs-thread.sync :as sync]
            [cljs-thread.util :as u]))

(defn instr-body [transfer-atom pl]
  (let [body (postwalk
              #(cond (fn? %) (str "#cljs-thread/arg-fn " %)
                     (u/typed-array? %)
                     (let [c-tag (:count (swap! transfer-atom update :count inc))
                           t (type %)]
                       (swap! transfer-atom assoc-in [:transfers c-tag]
                              (merge
                               {:obj %}
                               (when-not (and (exists? js/SharedArrayBuffer) (= (type %) js/SharedArrayBuffer))
                                 {:transfer (.-buffer %)})))
                       (str "#cljs-thread/transferable " {:c-tag c-tag :transfer-type t}))
                     :else %)
              pl)]
    body))

(defn unstr-body [transfers pl]
  (postwalk
   #(if-not (and (string? %) (or (.startsWith % "#cljs-thread/transferable")
                                 (.startsWith % "#cljs-thread/arg-fn")))
      %
      (cond (.startsWith % "#cljs-thread/arg-fn")
            (js/eval (str "(function () {return (" (apply str (drop 20 %)) ");})();"))
            (.startsWith % "#cljs-thread/transferable")
            (let [transfer-map (edn/read-string (apply str (drop 26 %)))
                  {:keys [c-tag transfer-type]} transfer-map
                  transfers-clj (js->clj transfers :keywordize-keys true)
                  {:keys [obj]} (get transfers-clj c-tag)]
              obj)
            :else %))
   pl))

;; ---------------------------------------------------------------------------
;; On-demand module loading (catch-and-load)
;;
;; Under Closure advanced compilation with code splitting, non-exported
;; functions may be placed in modules (e.g. screen.js) with IIFE-scoped
;; local names. When a worker eval's a stringified function referencing
;; such names, a ReferenceError occurs. The catch-and-load mechanism:
;; 1. Catches the ReferenceError
;; 2. Fetches the missing module's source
;; 3. Strips the IIFE wrapper so var declarations become global
;; 4. Eval's the unwrapped content in global scope via indirect eval
;; 5. Retries the original call — vars now resolve from global scope
;; ---------------------------------------------------------------------------

(defonce ^:private modules-loaded? (atom false))

(defn- strip-iife
  "Strip Closure compiler IIFE wrapper from module source.
   Transforms: (function(){'use strict'; ...}).call(this);
   Into: pre-IIFE declarations + raw inner content."
  [source]
  (let [iife-start (.indexOf source "(function(){")
        iife-end (.lastIndexOf source "}).call(this);")]
    (if (and (>= iife-start 0) (>= iife-end 0))
      (let [before (.substring source 0 iife-start)
            inner (.substring source
                              (+ iife-start (count "(function(){"))
                              iife-end)
            inner (.replace inner (js/RegExp. "^\\s*'use strict';\\s*") "")]
        (str before inner))
      source)))

(defn- resolve-module-url
  "Resolve module URL for browser workers. In blob/eval workers,
   self.origin is 'null', so we use __cljs_thread_origin set by strategies."
  [url]
  (if (or (.startsWith url "http://") (.startsWith url "https://"))
    url
    (if (and (exists? js/globalThis.__cljs_thread_origin)
             (some? js/globalThis.__cljs_thread_origin))
      (let [origin js/globalThis.__cljs_thread_origin]
        (if (.startsWith url "/")
          (str origin url)
          (str origin "/" url)))
      url)))

(defn- load-module-unwrapped!
  "Synchronously fetch a JS module, strip its IIFE wrapper, and eval
   the inner content in global scope. This makes IIFE-scoped vars
   globally accessible for subsequent eval'd function calls."
  [url]
  (let [source (if p/node?
                 (let [fs (js* "require('fs')")]
                   (.readFileSync fs url "utf8"))
                 (let [resolved (resolve-module-url url)
                       xhr (js/XMLHttpRequest.)]
                   (.open xhr "GET" resolved false)
                   (.send xhr)
                   (.-responseText xhr)))
        stripped (strip-iife source)]
    (js* "(0,eval)(~{})" stripped)))

(defn- ensure-modules-loaded!
  "Load all configured :loadable-modules by stripping IIFE wrappers
   and eval'ing in global scope. Only runs once per worker lifetime."
  []
  (when-not @modules-loaded?
    (when-let [modules (:loadable-modules @s/conf)]
      (doseq [url modules]
        (try
          (load-module-unwrapped! url)
          (catch :default e
            (println :warn :failed-to-load-module url e)))))
    (reset! modules-loaded? true)))

(defn- execute-call
  "Execute a stringified function call with optional arguments."
  [sfn sargs opts in-id transfers]
  (if (or (nil? sfn) (= sfn "nil"))
    nil
    (if-not sargs
      (if (and in-id (:yield? opts))
        ((js/eval (str "(" sfn ")();")) in-id)
        (js/eval (str "(" sfn ")();")))
      (apply (if (and in-id (:yield? opts))
               ((js/eval (str "(function () {return (" sfn ");})();")) in-id)
               (js/eval (str "(function () {return (" sfn ");})();")))
             (if (vector? sargs)
               (->> sargs (mapv (partial unstr-body transfers)))
               (js/eval (str "(" sargs ")();")))))))

(defn do-call
  [{:keys [data] :as outer-data}]
  (let [{:keys [sfn sargs opts in-id local? transfers]} data
        res (try
              (execute-call sfn sargs opts in-id transfers)
              (catch :default e
                (if (and (instance? js/ReferenceError e)
                         (not @modules-loaded?)
                         (seq (:loadable-modules @s/conf)))
                  ;; ReferenceError + unloaded modules: load them and retry once
                  (do
                    (ensure-modules-loaded!)
                    (try
                      (execute-call sfn sargs opts in-id transfers)
                      (catch :default e2
                        (println :error-in (:id e/data))
                        (println :error-after-module-load e2)
                        (println :data data)
                        (when-not (e/in-sw?)
                          (sync/send-response {:request-id (:request-id opts) :response {:error (pr-str e2)}})))))
                  ;; Non-ReferenceError or modules already loaded
                  (do
                    (println :error-in (:id e/data))
                    (println :error-in-do-call e)
                    (println :error (.-error e))
                    (println :data data)
                    (when-not (e/in-sw?)
                      (sync/send-response {:request-id (:request-id opts) :response {:error (pr-str e)}}))))))]
    (when (:atom? opts)
      (reset! s/local-val res))
    (if local?
      res
      (when (and (not (:yield? opts)) (not (e/in-sw?)))
        (sync/send-response {:request-id (:request-id opts) :response res})))))


(defmethod m/dispatch :call
  [data]
  (do-call data))

(defn ^:export do-in [id & [args afn opts]]
  (let [[afn args] (if afn [afn args] [args nil])
        in-id (u/gen-id)
        transfer-atom (atom {:count 0 :transfers {}})
        sargs (->> args (mapv (partial instr-body transfer-atom)))
        id (if (satisfies? IDable id)
             (get-id id)
             id)
        id (if (keyword id)
             id
             (pr-str id))
        post-in #(m/post id
                         {:dispatch :call
                          :data (merge
                                 {:sfn afn :to id :in-id in-id}
                                 (when args
                                   {:sargs sargs})
                                 (when-let [transfers (:transfers @transfer-atom)]
                                   {:transfers transfers})
                                 (when opts
                                   {:opts (assoc opts :request-id in-id)}))})]
    (post-in)
    (sync/wrap-derefable (merge opts {:id in-id}))))

;; ---------------------------------------------------------------------------
;; Eager module loading for workers
;;
;; When :loadable-modules is configured, eagerly load modules at worker
;; startup. This ensures all IIFE-scoped vars are globally accessible
;; before any do-call or do-future execution, covering all code paths.
;; The catch-and-load in do-call serves as a safety net.
;; ---------------------------------------------------------------------------

(when (and (not (e/in-screen?)) (not (e/in-sw?)))
  (ensure-modules-loaded!))
