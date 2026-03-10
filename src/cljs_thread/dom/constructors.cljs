(ns cljs-thread.dom.constructors
  "Worker-side synthetic DOM constructors for instanceof support.

   Installs constructor functions (Node, Element, HTMLElement, Document,
   Window, etc.) on the worker's globalThis so that:
     (instance? js/HTMLElement proxy)
   works as expected. Proxy objects have their prototype chain set up
   to pass these checks.

   Only runs on worker threads."
  (:require [cljs-thread.env :as e]))

(defonce ^:private installed? (atom false))

(defn install!
  "Install synthetic DOM constructors on globalThis.
   Idempotent — safe to call multiple times."
  []
  (when-not @installed?
    (reset! installed? true)
    ;; Only install on workers (screen thread has the real constructors)
    (when-not (e/in-screen?)
      ;; Create constructor hierarchy: Node < Element < HTMLElement
      (let [NodeProto     (js/Object.create nil)
            ElementProto  (js/Object.create NodeProto)
            HTMLElementProto (js/Object.create ElementProto)
            DocumentProto (js/Object.create NodeProto)

            make-ctor (fn [name proto]
                        (let [ctor (js/Function. "")]
                          (set! (.-prototype ctor) proto)
                          (unchecked-set proto "constructor" ctor)
                          (unchecked-set ctor "__dom_constructor_name" name)
                          ctor))

            NodeCtor        (make-ctor "Node" NodeProto)
            ElementCtor     (make-ctor "Element" ElementProto)
            HTMLElementCtor (make-ctor "HTMLElement" HTMLElementProto)
            DocumentCtor    (make-ctor "Document" DocumentProto)]

        ;; Install on globalThis
        (unchecked-set js/globalThis "Node" NodeCtor)
        (unchecked-set js/globalThis "Element" ElementCtor)
        (unchecked-set js/globalThis "HTMLElement" HTMLElementCtor)
        (unchecked-set js/globalThis "Document" DocumentCtor)

        ;; Return the prototype chain for proxy setup
        {:node NodeProto
         :element ElementProto
         :html-element HTMLElementProto
         :document DocumentProto}))))
