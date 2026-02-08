(ns cljs-thread.sync
  (:require
   [cljs.reader :refer [register-tag-parser!]]
   [cljs-thread.util :as u]
   [cljs-thread.env :as e]
   [cljs-thread.state :as s]
   [cljs-thread.platform :as p]
   [cljs-thread.id :refer [IDable get-id]]
   [clojure.edn :as edn]))

(defn no-blocking? []
  (cond
    ;; Node: blocking is always available (Atomics.wait)
    p/node? false
    ;; Browser SAB sync: blocking is available (Atomics.wait in workers)
    p/sab-sync? false
    ;; Browser legacy: need a service worker for blocking
    :else (not (contains? @s/conf :sw-connect-string))))

(defn throw-if-non-blocking []
  (when (no-blocking?)
    (throw (ex-info (str "Can't deref without a sync mechanism.\n"
                         "Either:\n"
                         "  1. Set COOP/COEP headers for SharedArrayBuffer support, or\n"
                         "  2. Add `:sw-connect-string \"sw.js\"` to your init! config\n"
                         "Something like:\n"
                         " `(cljs-thread.core/init! {:sw-connect-string \"sw.js\"\n"
                         "                      :connect-string \"/core.js\"})")
                    {:conf @s/conf
                     :env e/data}))))

(defn request [getter & {:as opts :keys [resolve reject no-park max-time duration]}]
  (throw-if-non-blocking)
  (if (or p/node? p/sab-sync?)
    ;; Node or SAB sync: dispatch through platform directly
    (p/request getter opts)
    ;; Browser legacy: check SW is ready, then dispatch through platform
    (when (or (not (= getter :sw)) (not (e/in-screen?)) (p/coordinator-ready?))
      (p/request getter opts))))

(defn send-response [payload & [db?]]
  (throw-if-non-blocking)
  (p/send-response payload))

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
  (p/sleep n))
