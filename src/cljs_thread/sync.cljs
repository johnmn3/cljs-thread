(ns cljs-thread.sync
  (:require
   [cljs.reader :refer [register-tag-parser!]]
   [cljs-thread.util :as u]
   [cljs-thread.env :as e]
   [cljs-thread.state :as s]
   [cljs-thread.id :refer [IDable get-id]]
   [clojure.edn :as edn]))

(defn no-blocking? []
  (not (contains? @s/conf :sw-connect-string)))

(defn throw-if-non-blocking []
  (when (no-blocking?)
    (throw (ex-info (str "Can't deref without a service worker.\n"
                         "Try adding a `:sw-connect-string \"sw.js\"` to your `init! config\n"
                         "Something like:\n"
                         " `(cljs-thread.core/init! {:sw-connect-string \"sw.js\"\n"
                         "                      :connect-string \"/core.js\"})")
                    {:conf @s/conf
                     :env e/data}))))

(defn request [getter & {:as opts :keys [resolve reject no-park max-time duration]}]
  (throw-if-non-blocking)
  (let [req {:request-id getter :requester (:id e/data) :no-park no-park :max-time max-time :duration duration}
        do-request (fn []
                     (try
                       (let [xhr (js/XMLHttpRequest.)]
                         (.open xhr "GET"
                                (str "/intercept/request/key.js" (u/encode-qp req))
                                (if (or (e/in-screen?) resolve) true false))
                         (.setRequestHeader xhr "cache-control" "no-cache, no-store, max-age=0")
                         (when resolve
                           (set! (.-onload xhr) #(resolve (edn/read-string (.-response xhr)))))
                         (when reject
                           (set! (.-onerror xhr) #(reject (.-status xhr))))
                         (.send xhr)
                         (if resolve
                           xhr
                           (let [res (edn/read-string (.-responseText xhr))]
                             res)))
                       (catch :default e
                         (when-not (= :repl-sync (:id e/data))
                           (println :error :requesting-response :e e)))))]
    (when (or (not (= getter :sw)) (not (e/in-screen?)) (.-controller js/navigator.serviceWorker))
      (do-request))))

(defn send-response [payload & [db?]]
  (throw-if-non-blocking)
  (try
    (let [req (if db?
                {:responder (:id e/data) :db? db?}
                {:responder (:id e/data)})
          xhr (js/XMLHttpRequest.)]
      (.open xhr "POST" (str "/intercept/response/key.js" (u/encode-qp req)))
      (.setRequestHeader xhr "Content-Type" "text/plain;charset=UTF-8")
      (.setRequestHeader xhr "cache-control" "no-cache, no-store, max-age=0")
      (.send xhr (pr-str payload))
      (.-responseText xhr)
      nil)
    (catch :default e
      (println :error :sending-response :e e))))

(extend-type js/Promise
  ICloneable
  (-clone [p] (.then p)))

(extend-type string
  ICloneable
  (-clone [s] (js/String. s)))

(extend-type cljs.core/Keyword
  ICloneable
  (-clone [k] (keyword k)))

(defn wrap-derefable [{:keys [promise? id] :as data}]
  (let [id (if (instance? IDable id) (get-id id) id)
        resolved? (atom false)
        resolved-value (atom nil)
        promise? (if (or (e/in-root?) (e/in-screen?)) true promise?)
        do-promise (fn [no-delay?]
                     (-> (js/Promise. (if no-delay?
                                        #(request id {:resolve %1 :reject %2})
                                        #(do id)))
                         (.then (fn [result]
                                  (reset! resolved? true)
                                  (reset! resolved-value result)
                                  (if (:error result)
                                    (throw (ex-info "Error in remote call" {:result (pr-str result)}))
                                    result)))))
        p (if-not promise?
            id
            (do-promise false))]
    (specify p
             IDable
             (get-id [_] id)
             IPending
             (-realized? [_] @resolved?)
             IPrintWithWriter
             (-pr-writer [x writer opts]
                         (-write writer
                                 (str "#cljs-thread {:id "
                                      (if (keyword? id)
                                        id
                                        (pr-str id))
                                      "}")))
             IDeref
             (-deref [_]
                     (if-let [res @resolved-value]
                       res
                       (if promise?
                         (do-promise true)
                         (let [_ (throw-if-non-blocking)
                               res (request id)]
                           (reset! resolved? true)
                           (reset! resolved-value res)
                           (if (:error res)
                             (throw (ex-info "Error in remote call" {:results (pr-str res)}))
                             res))))))))

(register-tag-parser!
  'cljs-thread (fn [x]
            (wrap-derefable x)))

(defn sleep [n]
  (throw-if-non-blocking)
  (let [xhr (js/XMLHttpRequest.)]
    (.open xhr "GET" (str "/intercept/sleep/t.js?" n) false)
    (.setRequestHeader xhr "cache-control" "no-cache, no-store, max-age=0")
    (.send xhr "request")
    (.-responseText xhr))
  nil)
