(ns cljs-thread.usability-helpers
  "Shared helper functions for usability tests.

   Demonstrates two key patterns for code-split builds:

   1. EXPORTED FUNCTIONS — Use ^:export on any function that will be
      referenced from spawn/in/future/pmap/=>> bodies. This ensures
      Closure gives them stable $APP.xxx names that survive code splitting.

   2. DATA-DRIVEN DISPATCH — Instead of passing function references across
      workers, pass keyword descriptors and resolve to functions on the
      worker. The dispatch table is compiled code, not stringified, so it
      works without exports.")

;; ---------------------------------------------------------------------------
;; Pattern 1: Exported utility functions
;;
;; These get $APP.xxx names under advanced compilation, so they can be
;; referenced from stringified function bodies that run on workers.
;; ---------------------------------------------------------------------------

(defn ^:export square [x] (* x x))

(defn ^:export double-it [x] (* 2 x))

(defn ^:export add [a b] (+ a b))

;; ---------------------------------------------------------------------------
;; Pattern 2: Data-driven dispatch
;;
;; The dispatch table is compiled as regular code on every worker (via
;; shared.js). Callers send a keyword + args; the worker resolves the
;; keyword to a function and applies it. No ^:export needed on the
;; individual functions in the table.
;;
;; This is the recommended pattern for large applications: define your
;; computation vocabulary as a keyword->fn map, and have workers look
;; up operations by keyword.
;; ---------------------------------------------------------------------------

(defn- my-square [x] (* x x))

(defn- my-double [x] (* 2 x))

(defn- my-inc [x] (inc x))

(defn- my-dec [x] (dec x))

(def ^:export ops
  {:square my-square
   :double my-double
   :inc    my-inc
   :dec    my-dec})

(defn ^:export compute
  "Data-driven computation: look up op by keyword, apply to val.
   The keyword and value are plain data, easily serialized."
  [op val]
  (if-let [f (get ops op)]
    (f val)
    (throw (js/Error. (str "Unknown op: " op)))))
