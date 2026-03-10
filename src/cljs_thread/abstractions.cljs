(ns cljs-thread.abstractions
  "Higher-level worker abstractions built on standard.cljs.

   This namespace provides:
   - Re-exports of all standard.cljs primitives
   - Worker creation with override mechanism for spawn strategies

   Sync protocol (request/response coordination) belongs in msg.cljs,
   not here. This layer is purely about platform abstraction and
   worker lifecycle."
  (:require
   [cljs-thread.standard :as std]))

;; ---------------------------------------------------------------------------
;; Re-export platform detection from standard
;; ---------------------------------------------------------------------------

(def node? std/node?)
(def sab-available? std/sab-available?)
(def atomics-available? std/atomics-available?)

;; ---------------------------------------------------------------------------
;; Re-export IEnv functions from standard
;; ---------------------------------------------------------------------------

(def init-data std/init-data)
(def in-screen? std/in-screen?)
(def close-self! std/close-self!)

;; ---------------------------------------------------------------------------
;; Re-export IMsg functions from standard
;; ---------------------------------------------------------------------------

(def listen std/listen)
(def post-message std/post-message)
(def mk-channel std/mk-channel)
(def self-ref std/self-ref)

;; ---------------------------------------------------------------------------
;; Re-export ISleep from standard
;; ---------------------------------------------------------------------------

(def sleep std/sleep)

;; ---------------------------------------------------------------------------
;; Re-export init! from standard
;; ---------------------------------------------------------------------------

(def init! std/init!)

;; ---------------------------------------------------------------------------
;; Worker creation with override mechanism
;;
;; Spawn strategies (fat-kernel, blob, etc.) can set create-worker-override
;; to customize how workers are created. This allows strategies to inject
;; custom worker data, use different Worker constructors, etc.
;; ---------------------------------------------------------------------------

;; Atom holding an optional override fn [url data on-message] -> Worker.
;; When set, create-worker uses this instead of std/create-worker.
;; Used by spawn strategies to customize worker creation.
(defonce create-worker-override (atom nil))

(defn create-worker
  "Create a worker using the current platform.
   If create-worker-override is set, uses that function instead.
   Returns the created Worker instance."
  [url data on-message]
  (if-let [f @create-worker-override]
    (f url data on-message)
    (std/create-worker url data on-message)))
