(ns cljs-thread.dom
  "Worker-side public API for DOM operations.

   Provides idiomatic CLJS functions for DOM manipulation:
     (dom/query \"#app\")
     (dom/set-text! h \"hello\")
     (dom/create \"div\")

   The JS Proxy layer (dom.proxy) is built on top of this layer —
   they compose. Users can choose transparent proxy access OR
   explicit function calls.

   All functions operate on DOM proxy objects. They use the proxy's
   transparent forwarding — no special wire protocol needed."
  (:require-macros [cljs-thread.dom])
  (:require [cljs-thread.dom.proxy :as proxy]
            [cljs-thread.dom.install]))

;; ============ Query & Traversal ============

(defn query
  "querySelector on document (or on el if provided). Returns proxy or nil."
  ([selector]
   (.querySelector js/document selector))
  ([selector el]
   (.querySelector el selector)))

(defn query-all
  "querySelectorAll on document (or on el if provided).
   Returns a CLJS vector of proxy objects."
  ([selector]
   (let [node-list (.querySelectorAll js/document selector)]
     (vec (array-seq node-list))))
  ([selector el]
   (let [node-list (.querySelectorAll el selector)]
     (vec (array-seq node-list)))))

(defn by-id
  "getElementById. Returns proxy or nil."
  [id]
  (.getElementById js/document id))

;; ============ Element Properties ============

(defn text
  "Get textContent of a proxy element."
  [el]
  (.-textContent el))

(defn set-text!
  "Set textContent of a proxy element."
  [el s]
  (set! (.-textContent el) s))

(defn inner-html
  "Get innerHTML of a proxy element."
  [el]
  (.-innerHTML el))

(defn set-inner-html!
  "Set innerHTML of a proxy element."
  [el s]
  (set! (.-innerHTML el) s))

(defn tag-name
  "Get tagName of a proxy element."
  [el]
  (.-tagName el))

;; ============ Attributes ============

(defn attr
  "Get attribute value. Returns string or nil."
  [el name]
  (.getAttribute el name))

(defn set-attr!
  "Set attribute value."
  [el name val]
  (.setAttribute el name val))

(defn remove-attr!
  "Remove an attribute."
  [el name]
  (.removeAttribute el name))

(defn has-attr?
  "Check if element has an attribute."
  [el name]
  (.hasAttribute el name))

;; ============ ClassList ============

(defn add-class!
  "Add one or more CSS classes."
  [el & classes]
  (let [cl (.-classList el)]
    (doseq [c classes]
      (.add cl c))))

(defn remove-class!
  "Remove one or more CSS classes."
  [el & classes]
  (let [cl (.-classList el)]
    (doseq [c classes]
      (.remove cl c))))

(defn toggle-class!
  "Toggle a CSS class. Returns boolean."
  [el cls]
  (.toggle (.-classList el) cls))

(defn has-class?
  "Check if element has a CSS class."
  [el cls]
  (.contains (.-classList el) cls))

;; ============ Style ============

(defn set-styles!
  "Set multiple style properties at once via a map.
   Keys are property names (strings), values are strings.
   Executes all writes through a single batch."
  [el style-map]
  (let [style (.-style el)]
    (proxy/with-batch
      (fn []
        (doseq [[prop val] style-map]
          (unchecked-set style prop val))))))

;; ============ DOM Mutation ============

(defn create
  "Create a new element. Returns proxy."
  [tag]
  (.createElement js/document tag))

(defn create-text
  "Create a text node. Returns proxy."
  [text]
  (.createTextNode js/document text))

(defn append!
  "Append child to parent. Returns child."
  [parent child]
  (.appendChild parent child)
  child)

(defn remove!
  "Remove element from its parent."
  [el]
  (.remove el))

(defn remove-child!
  "Remove child from parent. Returns child."
  [parent child]
  (.removeChild parent child)
  child)

(defn insert-before!
  "Insert new-el before ref-el in parent."
  [parent new-el ref-el]
  (.insertBefore parent new-el ref-el)
  new-el)

(defn clone-node
  "Clone an element. deep? defaults to false."
  ([el] (.cloneNode el false))
  ([el deep?] (.cloneNode el deep?)))

;; ============ Layout & Geometry ============

(defn rect
  "Get bounding client rect as a CLJS map with :x :y :width :height :top :right :bottom :left."
  [el]
  (let [r (.getBoundingClientRect el)]
    {:x (.-x r)
     :y (.-y r)
     :width (.-width r)
     :height (.-height r)
     :top (.-top r)
     :right (.-right r)
     :bottom (.-bottom r)
     :left (.-left r)}))
