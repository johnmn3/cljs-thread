(ns cljs-thread.runner.fat-kernel-test-impl
  "Worker-side implementation of tests that use nested @ (deref) operations.

   In code-split builds, stringified function bodies capture IIFE-local aliases
   from the module where the macro expansion occurs. For nested @(spawn ...),
   @(future ...), pmap, and =>> operations, the macro-expanded code references
   runtime functions (park-deref, acquire-worker, etc.) by their IIFE-local
   names. Workers can only resolve aliases from modules they've loaded.

   By defining these functions in a module that workers load (e.g. :cljs-thread
   or :core), the IIFE-local aliases are accessible from the eval scope."
  (:require-macros [cljs-thread.core :refer [spawn future pmap =>>]])
  (:require
   [cljs-thread.core :as t]))

(defn ^:export test-spawn-nested
  "Nested spawn — inner @(spawn ...) blocks via SAB sync on worker."
  []
  (+ 1 @(spawn (* 6 7))))

(defn ^:export test-future-nested
  "Nested future — inner @(future ...) blocks via SAB sync on worker."
  []
  (+ 1 @(future (+ 2 3))))

(defn ^:export test-pmap-basic
  "pmap distributes work across pool and collects results."
  []
  (vec (doall (pmap inc [1 2 3 4]))))

(defn ^:export test-transducer
  "=>> fans transducer work across workers."
  []
  @(=>> (range 10) (map inc) (filter odd?) (apply +)))
