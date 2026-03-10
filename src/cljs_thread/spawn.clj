(ns cljs-thread.spawn
  (:require
   [cljs-thread.macro-impl :as i]
   [cljs-thread.go :as go]))

(defmacro spawn [& x]
  (let [[conveyer names opts body] (i/globals-locals-and-args &env x)
        yield? (i/yields? x)
        {:keys [body go?]} (if (seq body) (go/transform-body body) {:body body :go? false})
        ;; NOTE: do NOT wrap the body with (binding [*in-work* true] ...)
        ;; here. The function is stringified and eval'd on the worker — the
        ;; dynamic var's IIFE-local alias is not accessible in eval's global
        ;; scope in code-split builds. Instead, do-call sets *in-work* = true
        ;; before executing the eval'd function (see in.cljs do-call).
        yfn (cond
              ;; Yield with or without go — yield mechanism handles response.
              ;; Uses yield-result! which handles both direct SAB sync and legacy paths.
              ;; For go?, the CPS body returns a Promise; catch escaping errors.
              yield?
              (if go?
                `(fn [in-id# direct-sync# sync-signal-sab# sync-atom-id# sync-atom-idx#]
                   (fn ~names
                     (let [~'yield (fn [& res#]
                                     (cljs-thread.in/yield-result!
                                      in-id# direct-sync# sync-signal-sab# sync-atom-id# sync-atom-idx#
                                      (last res#))
                                     (when (not (:deamon? cljs-thread.env/data))
                                       (js/setTimeout #(cljs-thread.platform/close-self!) 100)))]
                       (-> (do ~@body)
                           (.catch (fn [e#]
                                     (cljs-thread.in/yield-result!
                                      in-id# direct-sync# sync-signal-sab# sync-atom-id# sync-atom-idx#
                                      {:error (pr-str e#)})))))))
                `(fn [in-id# direct-sync# sync-signal-sab# sync-atom-id# sync-atom-idx#]
                   (fn ~names
                     (let [~'yield (fn [& res#]
                                     (cljs-thread.in/yield-result!
                                      in-id# direct-sync# sync-signal-sab# sync-atom-id# sync-atom-idx#
                                      (last res#))
                                     (when (not (:deamon? cljs-thread.env/data))
                                       (js/setTimeout #(cljs-thread.platform/close-self!) 100)))]
                       ~@body))))

              ;; No yield — body result goes through do-call → send-response.
              ;; For go?, do-call already handles Promise results.
              :else
              `(fn ~names ~@body))]
    (if-not (seq body)
      `(cljs-thread.spawn/do-spawn [] ~opts nil)
      `(cljs-thread.spawn/do-spawn ~conveyer (assoc ~opts :yield? ~yield? :go? ~go?) (clojure.core/str ~yfn)))))
