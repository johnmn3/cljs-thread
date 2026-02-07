(ns cljs-thread.autoload-fns
  "Helper functions that are intentionally NOT exported.
   Under code splitting, these end up in screen.js with IIFE-local names.
   The catch-and-load mechanism in do-call should handle this transparently
   by stripping the IIFE wrapper and eval'ing module content in global scope.")

;; Internal atom prevents Closure from inlining these functions
;; (atom mutations are side effects that inhibit inlining).
(def ^:private state (atom {:counter 0 :log []}))

(defn process-value
  "Add x to counter, log it, return current counter."
  [x]
  (swap! state update :counter + x)
  (swap! state update :log conj x)
  (:counter @state))

(defn reset-state!
  "Reset internal state to initial values."
  []
  (reset! state {:counter 0 :log []})
  nil)

(defn accumulate
  "Process each value in coll through state, return final counter."
  [coll]
  (reset-state!)
  (last (mapv process-value coll)))
;; accumulate([1 2 3]) → reset, process(1)=1, process(2)=3, process(3)=6 → 6

(defn compute-chain
  "Reset, then process x and 2x, return counter (= 3x)."
  [x]
  (reset-state!)
  (process-value x)
  (process-value (* x 2))
  (:counter @state))
;; compute-chain(5) → reset, process(5)=5, process(10)=15 → 15

(defn get-log
  "Return the current log vector."
  []
  (:log @state))
