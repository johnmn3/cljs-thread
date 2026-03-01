(ns cljs-thread.dom.serialize
  "DOM value serialization utilities.

   Provides wire-format conversion for DOM values crossing the
   worker ↔ screen boundary via `in`:
     result->wire  — screen-side: DOM result → wire-safe value
     from-wire     — screen-side: wire arg → real DOM object
     extract-event — screen-side: Event → wire-safe event map

   Delegates to cljs-thread.dom.registry for now."
  (:require [cljs-thread.dom.registry :as reg]))

(def result->wire reg/result->wire)
(def from-wire reg/from-wire)
(def extract-event reg/extract-event)
