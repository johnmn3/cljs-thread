(ns cljs-thread.sw
  (:require
   [clojure.edn :as edn]
   [cljs-thread.env :as e]
   [cljs-thread.on-when :refer [on-watch]]
   [cljs-thread.state :as s]
   [cljs-thread.util :as u]))

(defn ^:export respond [id res]
  (swap! s/responses assoc id res))

(defn sleep-time [t]
  (js/Promise.
   (fn [r] (js/setTimeout r t))))

(defn response [result]
  (js/Response. result
                #js {"headers"
                     #js {"content-type" "text/html; charset=utf-8"
                          "Cache-Control" "max-age=31556952,immutable"
                          "Cross-Origin-Opener-Policy" "same-origin"
                          "Cross-Origin-Embedder-Policy" "credentialless"}}))

(defn wake []
  (response "Wake up!"))

(defn sleep [e]
  (let [u (js/URL. (.-url e.request))
        t (pr-str (->> u .-search str rest (apply str) edn/read-string))]
    (.respondWith e (-> (sleep-time t)
                        (.then wake)))))

(defn handle-request [e]
  (let [u (js/URL. (.-url e.request))
        r (->> u .-search u/decode-qp)
        {:keys [request-id requester duration max-time no-park]} r]
    (if-not no-park
      (if-let [res (get @s/responses request-id)]
        (do (swap! s/responses dissoc request-id)
            (swap! s/requests dissoc request-id)
            (.respondWith e (js/Promise.resolve (response (pr-str res)))))
        (let [p (js/Promise. (fn [resolve _reject]
                               (swap! s/requests assoc request-id resolve)))]
          (.respondWith e p)))
      (.respondWith e (-> (on-watch s/responses
                                    #(contains? % request-id)
                                    {:max-time max-time}
                                   (let [result (get @s/responses request-id)]
                                     (swap! s/responses dissoc request-id)
                                     (response (pr-str result))))
                          (.then #(js/Promise.resolve %))
                          (.catch #(do (println :error %)
                                       (println :request-id request-id)
                                       (println :requester requester)
                                       (println :stack (.-stack %))
                                       (println :event (pr-str e))
                                       (println :url (pr-str u))
                                       (println :handle-request (pr-str r))
                                       (js/Promise.resolve (response (pr-str {:error %}))))))))))

(defn handle-respond [e]
  (-> (-> e .-request .clone .text)
      (.then (fn [data]
               (let [{:keys [request-id] res :response} (edn/read-string data)]
                 (if-let [resolve (get @s/requests request-id)]
                   (do (swap! s/requests dissoc request-id)
                       (resolve (response (pr-str res))))
                   (swap! s/responses assoc request-id res))))))
  (.respondWith e (js/Promise.resolve (response "done"))))

(defn handle-kernel [e]
  (let [url (js/URL. (.-url e.request))
        params (.-searchParams url)
        init-data (.get params "d")
        scripts-json (.get params "s")
        origin (.get params "o")
        code (str (when init-data
                    (str "globalThis.__cljs_thread_init_data = "
                         (js/JSON.stringify init-data) ";\n"))
                  (when scripts-json
                    (str "globalThis.__cljs_thread_spawn_scripts = "
                         scripts-json ";\n"))
                  (when origin
                    (str "globalThis.__cljs_thread_origin = "
                         (js/JSON.stringify origin) ";\n"))
                  (when scripts-json
                    (str "importScripts.apply(self, " scripts-json ");\n")))]
    (.respondWith e
      (js/Promise.resolve
        (js/Response. code
                      #js {"headers"
                           #js {"content-type" "application/javascript"
                                "Cache-Control" "no-cache, no-store"}})))))

(defn fetch-response [e]
  (let [url (js/URL. (.-url e.request))
        path (.-pathname url)]
    (cond (= path "/intercept/sleep/t.js")
          (sleep e)
          (= path "/intercept/request/key.js")
          (handle-request e)
          (= path "/intercept/response/key.js")
          (handle-respond e)
          (= path "/cljs-thread-kernel.js")
          (handle-kernel e))))

(when (e/in-sw?)

  (s/shake s/responses :seconds 1 :limit 120)
  (s/shake s/responses :seconds 30)
  (.addEventListener js/self "install" #(js/self.skipWaiting))
  ;; (.addEventListener js/self "activate" #(.waitUntil % (js/self.clients.claim)))
  (.addEventListener js/self "activate" #(js/self.clients.claim))
  (.addEventListener js/self "fetch" fetch-response)

  :end)

(defn init! []
  #_
  (println :starting :sw))
