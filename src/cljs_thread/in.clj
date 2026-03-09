(ns cljs-thread.in
  (:require
   [cljs-thread.macro-impl :as i]
   [cljs-thread.go :as go]))

(defmacro in [id & x]
  (let [[conveyer names opts body] (i/globals-locals-and-args &env x)
        yield? (i/yields? x)
        {:keys [body go?]} (if-not yield? (go/transform-body body opts) {:body body :go? false})
        ;; NOTE: do NOT wrap the body with (binding [*in-work* true] ...)
        ;; here. The function is stringified and eval'd on the worker — the
        ;; dynamic var's IIFE-local alias is not accessible in eval's global
        ;; scope in code-split builds. Instead, do-call sets *in-work* = true
        ;; before executing the eval'd function (see in.cljs do-call).
        yfn (if-not yield?
              `(fn ~names ~@body)
              ;; Yield mode: function takes in-id and sync-channel components
              ;; yield checks for direct-sync and uses deliver-response or send-response
              `(fn [in-id# direct-sync?# sync-signal-sab# sync-atom-id# sync-atom-idx#]
                 (fn ~names
                   (let [~'yield (fn [res#]
                                   (cljs-thread.in/yield-result!
                                    in-id# direct-sync?# sync-signal-sab#
                                    sync-atom-id# sync-atom-idx# res#))]
                     ~@body))))]
    `(cljs-thread.in/do-in ~id ~conveyer (clojure.core/str ~yfn) (assoc ~opts :yield? ~yield? :go? ~go?))))
