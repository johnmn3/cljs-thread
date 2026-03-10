(ns cljs-thread.dom.test
  "DOM proxy integration tests — Phases 1-4.

   These tests run on the :core worker. The DOM proxy system is already
   installed (document, window, navigator are Proxy objects). Each test
   exercises a specific aspect of the proxy ↔ screen communication.

   Test execution is dispatched from the screen thread via `in :core`.
   Results are returned as a map {:pass N :fail N :errors [...]}.

   Tests follow the implementation plan sections 1.1-4.x.
   Uses cljs-thread.runner custom harness."
  (:require-macros [cljs-thread.dom :refer [batch!]])
  (:require [cljs-thread.dom :as dom]
            [cljs-thread.dom.proxy :as proxy]
            [cljs-thread.dom.registry :as reg]))

;; ---------------------------------------------------------------------------
;; Test harness (worker-side)
;; ---------------------------------------------------------------------------

(def ^:private test-results (atom {:pass 0 :fail 0 :errors []}))

(defn- pass! [name]
  (swap! test-results update :pass inc)
  (println (str "  PASS: " name)))

(defn- fail! [name expected actual]
  (swap! test-results update :fail inc)
  (swap! test-results update :errors conj {:test name :expected expected :actual actual})
  (println (str "  FAIL: " name " expected=" (pr-str expected) " actual=" (pr-str actual))))

(defn- check [name expected actual]
  (if (= expected actual)
    (pass! name)
    (fail! name expected actual)))

(defn- check-truthy [name actual]
  (if actual
    (pass! name)
    (fail! name "truthy" actual)))

(defn- check-falsy [name actual]
  (if (not actual)
    (pass! name)
    (fail! name "falsy" actual)))

;; ---------------------------------------------------------------------------
;; §1.1 Handle Registry Basics
;; ---------------------------------------------------------------------------

(defn test-handle-registry-basics []
  (println "\n--- 1.1 Handle Registry ---")

  ;; document handle is reserved (1)
  (check-truthy "document exists" (some? js/document))
  (check "document handle is 1" reg/DOCUMENT-HANDLE (proxy/handle-of js/document))

  ;; window handle is reserved (0)
  (check-truthy "window exists" (some? js/window))
  (check "window handle is 0" reg/WINDOW-HANDLE (proxy/handle-of js/window))

  ;; querying returns a proxy
  (let [el (.querySelector js/document "#app")]
    (check-truthy "querySelector #app returns proxy" (proxy/is-dom-proxy? el)))

  ;; same element returns same proxy (identity)
  (let [el1 (.querySelector js/document "#app")
        el2 (.querySelector js/document "#app")]
    (check "same element same proxy" true (identical? el1 el2)))

  ;; non-existent element returns nil
  (check-falsy "querySelector #nope returns nil" (.querySelector js/document "#nope")))

;; ---------------------------------------------------------------------------
;; §1.2 Transparent Property Access
;; ---------------------------------------------------------------------------

(defn test-transparent-property-access []
  (println "\n--- 1.2 Property Access ---")

  ;; textContent read
  (let [p (.querySelector js/document ".intro")]
    (check "textContent read" "Hello World" (.-textContent p)))

  ;; textContent write + readback
  (let [p (.querySelector js/document ".intro")]
    (set! (.-textContent p) "Modified")
    (check "textContent write" "Modified" (.-textContent p))
    (set! (.-textContent p) "Hello World"))

  ;; tagName
  (let [p (.querySelector js/document ".intro")]
    (check "tagName" "P" (.-tagName p)))

  ;; id get/set on newly created element
  (let [el (.createElement js/document "div")
        app (.querySelector js/document "#app")]
    (.appendChild app el)
    (set! (.-id el) "test-el")
    (check "id roundtrip" "test-el" (.-id el))
    (.remove el))

  ;; className
  (let [el (.querySelector js/document ".intro")]
    (check-truthy "className is string" (string? (.-className el))))

  ;; nodeType
  (let [el (.querySelector js/document "#app")]
    (check "nodeType is 1" 1 (.-nodeType el))))

;; ---------------------------------------------------------------------------
;; §1.3 Property Chains
;; ---------------------------------------------------------------------------

(defn test-property-chains []
  (println "\n--- 1.3 Property Chains ---")

  ;; document.body
  (check-truthy "document.body exists" (some? (.-body js/document)))
  (check "document.body.tagName" "BODY" (.-tagName (.-body js/document)))

  ;; document.body.style.color chain
  (set! (.. js/document -body -style -color) "red")
  (check "body.style.color" "red" (.. js/document -body -style -color))
  (set! (.. js/document -body -style -color) "")

  ;; el.parentElement.children.length
  (let [p (.querySelector js/document ".intro")
        parent (.-parentElement p)
        children (.-children parent)]
    (check-truthy "parent.children.length > 0" (pos? (.-length children)))))

;; ---------------------------------------------------------------------------
;; §1.4 instanceof / Type Checks
;; ---------------------------------------------------------------------------

(defn test-type-checks []
  (println "\n--- 1.4 Type Checks ---")

  (let [el (.querySelector js/document "#app")]
    (check-truthy "instanceof HTMLElement" (instance? js/HTMLElement el))
    (check-truthy "instanceof Node" (instance? js/Node el))
    (check-truthy "instanceof Element" (instance? js/Element el)))

  ;; nodeType is a number
  (let [el (.querySelector js/document "#app")]
    (check-truthy "nodeType is number" (number? (.-nodeType el))))

  ;; document instanceof Document
  (check-truthy "document instanceof Document" (instance? js/Document js/document)))

;; ---------------------------------------------------------------------------
;; §1.5 DOM Mutation
;; ---------------------------------------------------------------------------

(defn test-dom-mutation []
  (println "\n--- 1.5 DOM Mutation ---")

  ;; createElement + appendChild + verify via querySelector
  (let [div (.createElement js/document "div")
        app (.querySelector js/document "#app")]
    (set! (.-textContent div) "created")
    (.appendChild app div)
    (check "appendChild visible"
           "created"
           (.-textContent (.querySelector js/document "#app div:last-child")))
    (.remove div))

  ;; insertBefore
  (let [app (.querySelector js/document "#app")
        ref (.-firstElementChild app)
        new-el (.createElement js/document "span")]
    (set! (.-textContent new-el) "inserted")
    (.insertBefore app new-el ref)
    (check "insertBefore: first child identity"
           true (identical? new-el (.-firstElementChild app)))
    (.remove new-el))

  ;; cloneNode
  (let [el (.querySelector js/document ".intro")
        clone (.cloneNode el true)]
    (check-truthy "cloneNode returns proxy" (some? clone))
    (check "cloneNode text" (.-textContent el) (.-textContent clone)))

  ;; createTextNode
  (let [text (.createTextNode js/document "hello")
        app (.querySelector js/document "#app")]
    (check-truthy "createTextNode proxy" (proxy/is-dom-proxy? text))
    (check "textNode content" "hello" (.-textContent text))
    (.appendChild app text)
    (.remove text))

  ;; removeChild
  (let [parent (.createElement js/document "div")
        child (.createElement js/document "span")]
    (.appendChild parent child)
    (.removeChild parent child)
    (check-falsy "removeChild: firstChild nil" (.-firstChild parent)))

  ;; childNodes.length
  (let [parent (.createElement js/document "div")
        c1 (.createElement js/document "span")
        c2 (.createElement js/document "span")]
    (.appendChild parent c1)
    (.appendChild parent c2)
    (check "childNodes.length" 2 (.-length (.-childNodes parent)))))

;; ---------------------------------------------------------------------------
;; §1.6 Layout & Geometry
;; ---------------------------------------------------------------------------

(defn test-layout-geometry []
  (println "\n--- 1.6 Layout & Geometry ---")
  (let [el (.createElement js/document "div")]
    (set! (.-cssText (.-style el))
          "width:100px;height:50px;position:absolute;top:10px;left:20px;")
    (.appendChild (.querySelector js/document "#app") el)

    ;; getBoundingClientRect
    (let [rect (.getBoundingClientRect el)]
      (check-truthy "getBoundingClientRect exists" (some? rect))
      (check-truthy "rect.width >= 100" (>= (.-width rect) 100))
      (check-truthy "rect.height >= 50" (>= (.-height rect) 50)))

    ;; offsetWidth/Height
    (check-truthy "offsetWidth >= 100" (>= (.-offsetWidth el) 100))
    (check-truthy "offsetHeight >= 50" (>= (.-offsetHeight el) 50))

    ;; getComputedStyle (via window proxy)
    (let [cs (.getComputedStyle js/window el)
          width (.-width cs)]
      (check-truthy "computedStyle.width is string" (string? width)))

    (.remove el)))

;; ---------------------------------------------------------------------------
;; §1.7 Attributes
;; ---------------------------------------------------------------------------

(defn test-attributes []
  (println "\n--- 1.7 Attributes ---")
  (let [el (.createElement js/document "div")]
    (.appendChild (.querySelector js/document "#app") el)

    (.setAttribute el "data-x" "42")
    (check "getAttribute" "42" (.getAttribute el "data-x"))
    (check "hasAttribute true" true (.hasAttribute el "data-x"))

    (.removeAttribute el "data-x")
    (check "hasAttribute after remove" false (.hasAttribute el "data-x"))

    (.remove el)))

;; ---------------------------------------------------------------------------
;; §1.8 ClassList
;; ---------------------------------------------------------------------------

(defn test-classlist []
  (println "\n--- 1.8 ClassList ---")
  (let [el (.createElement js/document "div")]
    (.appendChild (.querySelector js/document "#app") el)

    ;; add + contains
    (.add (.-classList el) "foo" "bar")
    (check "contains foo" true (.contains (.-classList el) "foo"))

    ;; remove
    (.remove (.-classList el) "foo")
    (check "contains after remove" false (.contains (.-classList el) "foo"))

    ;; toggle
    (.toggle (.-classList el) "baz")
    (check "toggle on" true (.contains (.-classList el) "baz"))
    (.toggle (.-classList el) "baz")
    (check "toggle off" false (.contains (.-classList el) "baz"))

    (.remove el)))

;; ---------------------------------------------------------------------------
;; §1.9 querySelectorAll / NodeList
;; ---------------------------------------------------------------------------

(defn test-query-all []
  (println "\n--- 1.9 querySelectorAll ---")

  (let [items (.querySelectorAll js/document ".item")]
    (check "querySelectorAll length" 3 (.-length items))
    (check-truthy "first item exists" (some? (aget items 0)))
    (check "first item text" "Item 1" (.-textContent (aget items 0)))))

;; ---------------------------------------------------------------------------
;; Additional tests
;; ---------------------------------------------------------------------------

(defn test-proxy-installed []
  (println "\n--- Proxy Installation ---")
  (check-truthy "document is proxy" (proxy/is-dom-proxy? js/document))
  (check-truthy "window is proxy" (proxy/is-dom-proxy? js/window))
  (check-truthy "navigator is proxy" (proxy/is-dom-proxy? js/navigator)))

(defn test-document-title []
  (println "\n--- document.title ---")
  (let [title (.-title js/document)]
    (check-truthy "title is string" (string? title))
    (check "title value" "DOM Proxy Tests" title)))

(defn test-style-property []
  (println "\n--- element.style ---")
  (let [div (.createElement js/document "div")
        style (.-style div)]
    (check-truthy "style is proxy" (proxy/is-dom-proxy? style))
    (set! (.-color style) "red")
    (check "style.color" "red" (.-color style))))

(defn test-inner-html []
  (println "\n--- innerHTML ---")
  (let [div (.createElement js/document "div")]
    (set! (.-innerHTML div) "<b>bold</b>")
    (check "innerHTML roundtrip" "<b>bold</b>" (.-innerHTML div))))

(defn test-navigator-user-agent []
  (println "\n--- navigator.userAgent ---")
  (let [ua (.-userAgent js/navigator)]
    (check-truthy "userAgent is string" (string? ua))
    (check-truthy "userAgent not empty" (pos? (count ua)))))

(defn test-parent-child []
  (println "\n--- parent/child ---")
  (let [parent (.createElement js/document "div")
        child (.createElement js/document "span")]
    (.appendChild parent child)
    (let [p (.-parentNode child)]
      (check-truthy "parentNode is proxy" (proxy/is-dom-proxy? p))
      (check "parentNode handle" (proxy/handle-of parent) (proxy/handle-of p)))))

;; ---------------------------------------------------------------------------
;; §2.1 Event Registration (synchronous)
;; ---------------------------------------------------------------------------

(defn test-event-registration []
  (println "\n--- 2.1 Event Registration ---")
  (let [btn (.createElement js/document "button")
        _ (.appendChild (.querySelector js/document "#app") btn)
        cb (fn [_e])]

    ;; addEventListener doesn't throw
    (try
      (.addEventListener btn "click" cb)
      (pass! "addEventListener doesn't throw")
      (catch :default e
        (fail! "addEventListener doesn't throw" "no error" (str e))))

    ;; removeEventListener doesn't throw
    (try
      (.removeEventListener btn "click" cb)
      (pass! "removeEventListener doesn't throw")
      (catch :default e
        (fail! "removeEventListener doesn't throw" "no error" (str e))))

    (.remove btn)))

(defn test-onclick-handler []
  (println "\n--- 2.2 onclick handler ---")
  (let [btn (.createElement js/document "button")
        _ (.appendChild (.querySelector js/document "#app") btn)]

    ;; onclick assignment doesn't throw
    (try
      (set! (.-onclick btn) (fn [_e]))
      (pass! "onclick= doesn't throw")
      (catch :default e
        (fail! "onclick= doesn't throw" "no error" (str e))))

    ;; onclick = nil removes handler
    (try
      (set! (.-onclick btn) nil)
      (pass! "onclick=nil doesn't throw")
      (catch :default e
        (fail! "onclick=nil doesn't throw" "no error" (str e))))

    (.remove btn)))

;; ---------------------------------------------------------------------------
;; §3.1 Window Properties
;; ---------------------------------------------------------------------------

(defn test-window-properties []
  (println "\n--- 3.1 Window Properties ---")

  ;; innerWidth / innerHeight
  (check-truthy "window.innerWidth > 0" (pos? (.-innerWidth js/window)))
  (check-truthy "window.innerHeight > 0" (pos? (.-innerHeight js/window)))

  ;; outerWidth / outerHeight
  (check-truthy "window.outerWidth > 0" (pos? (.-outerWidth js/window)))
  (check-truthy "window.outerHeight > 0" (pos? (.-outerHeight js/window)))

  ;; devicePixelRatio
  (check-truthy "window.devicePixelRatio > 0" (pos? (.-devicePixelRatio js/window)))

  ;; scrollX / scrollY are numbers (may be 0)
  (check-truthy "window.scrollX is number" (number? (.-scrollX js/window)))
  (check-truthy "window.scrollY is number" (number? (.-scrollY js/window))))

(defn test-window-location []
  (println "\n--- 3.2 window.location ---")

  (let [loc (.-location js/window)]
    (check-truthy "location is proxy" (proxy/is-dom-proxy? loc))
    (check-truthy "location.href is string" (string? (.-href loc)))
    (check-truthy "location.protocol is string" (string? (.-protocol loc)))
    (check-truthy "location.hostname is string" (string? (.-hostname loc)))
    (check-truthy "location.pathname is string" (string? (.-pathname loc)))))

(defn test-window-history []
  (println "\n--- 3.3 window.history ---")

  (let [hist (.-history js/window)]
    (check-truthy "history is proxy" (proxy/is-dom-proxy? hist))
    (check-truthy "history.length > 0" (pos? (.-length hist)))))

(defn test-window-match-media []
  (println "\n--- 3.4 window.matchMedia ---")

  (let [mql (.matchMedia js/window "(min-width: 1px)")]
    (check-truthy "matchMedia returns proxy" (proxy/is-dom-proxy? mql))
    (check "matchMedia matches" true (.-matches mql))
    (check-truthy "matchMedia media is string" (string? (.-media mql))))

  ;; Negative query
  (let [mql (.matchMedia js/window "(max-width: 0px)")]
    (check "matchMedia no-match" false (.-matches mql))))

(defn test-window-scroll-methods []
  (println "\n--- 3.5 window.scroll methods ---")

  ;; scrollTo shouldn't throw
  (try
    (.scrollTo js/window 0 0)
    (pass! "scrollTo doesn't throw")
    (catch :default e
      (fail! "scrollTo doesn't throw" "no error" (str e))))

  ;; scrollBy shouldn't throw
  (try
    (.scrollBy js/window 0 0)
    (pass! "scrollBy doesn't throw")
    (catch :default e
      (fail! "scrollBy doesn't throw" "no error" (str e)))))

;; ---------------------------------------------------------------------------
;; §3.6 localStorage
;; ---------------------------------------------------------------------------

(defn test-local-storage []
  (println "\n--- 3.6 localStorage ---")

  (let [storage js/localStorage]
    (check-truthy "localStorage is proxy" (proxy/is-dom-proxy? storage))

    ;; setItem / getItem
    (.setItem storage "__dom_proxy_test" "42")
    (check "getItem" "42" (.getItem storage "__dom_proxy_test"))

    ;; removeItem
    (.removeItem storage "__dom_proxy_test")
    (check-falsy "getItem after remove" (.getItem storage "__dom_proxy_test"))))

;; ---------------------------------------------------------------------------
;; §3.7 sessionStorage
;; ---------------------------------------------------------------------------

(defn test-session-storage []
  (println "\n--- 3.7 sessionStorage ---")

  (let [storage js/sessionStorage]
    (check-truthy "sessionStorage is proxy" (proxy/is-dom-proxy? storage))

    ;; setItem / getItem
    (.setItem storage "__dom_proxy_test" "99")
    (check "getItem" "99" (.getItem storage "__dom_proxy_test"))

    ;; removeItem
    (.removeItem storage "__dom_proxy_test")
    (check-falsy "getItem after remove" (.getItem storage "__dom_proxy_test"))))

;; ---------------------------------------------------------------------------
;; §3.8 document.cookie (basic)
;; ---------------------------------------------------------------------------

(defn test-document-cookie []
  (println "\n--- 3.8 document.cookie ---")

  ;; document.cookie should be a string (may be empty)
  (check-truthy "document.cookie is string" (string? (.-cookie js/document))))

;; ---------------------------------------------------------------------------
;; §3.9 window.getSelection
;; ---------------------------------------------------------------------------

(defn test-window-get-selection []
  (println "\n--- 3.9 window.getSelection ---")

  ;; getSelection returns an object (Selection)
  (let [sel (.getSelection js/window)]
    (check-truthy "getSelection returns something" (some? sel))))

;; ---------------------------------------------------------------------------
;; §4.1 batch! macro
;; ---------------------------------------------------------------------------

(defn test-batch-writes []
  (println "\n--- 4.1 batch! ---")

  (let [el (.createElement js/document "div")]
    (.appendChild (.querySelector js/document "#app") el)

    ;; batch! should execute all writes, then flush
    (batch!
      (set! (.-textContent el) "batched")
      (set! (.-className el) "batch-test")
      (set! (.-id el) "batch-el"))

    ;; Verify all writes took effect
    (check "batch textContent" "batched" (.-textContent el))
    (check "batch className" "batch-test" (.-className el))
    (check "batch id" "batch-el" (.-id el))

    (.remove el)))

(defn test-batch-style-writes []
  (println "\n--- 4.2 batch! style writes ---")

  (let [el (.createElement js/document "div")]
    (.appendChild (.querySelector js/document "#app") el)

    ;; Batch multiple style writes
    (batch!
      (set! (.-color (.-style el)) "red")
      (set! (.-margin (.-style el)) "10px")
      (set! (.-display (.-style el)) "flex"))

    (check "batch style.color" "red" (.-color (.-style el)))
    (check "batch style.display" "flex" (.-display (.-style el)))

    (.remove el)))

;; ---------------------------------------------------------------------------
;; §4.3 dom/set-styles! helper
;; ---------------------------------------------------------------------------

(defn test-set-styles []
  (println "\n--- 4.3 set-styles! ---")

  (let [el (.createElement js/document "div")]
    (.appendChild (.querySelector js/document "#app") el)

    (dom/set-styles! el {"color" "blue" "fontSize" "14px" "display" "block"})

    (check "set-styles! color" "blue" (.-color (.-style el)))
    (check "set-styles! fontSize" "14px" (.-fontSize (.-style el)))
    (check "set-styles! display" "block" (.-display (.-style el)))

    (.remove el)))

;; ---------------------------------------------------------------------------
;; §4.4 Function-based API
;; ---------------------------------------------------------------------------

(defn test-fn-api-query []
  (println "\n--- 4.4 Function API: query ---")

  (check-truthy "dom/query #app" (some? (dom/query "#app")))
  (check-truthy "dom/query result is proxy" (proxy/is-dom-proxy? (dom/query "#app")))
  (check-falsy "dom/query #nope" (dom/query "#nope"))
  (check "dom/query-all .item count" 3 (count (dom/query-all ".item"))))

(defn test-fn-api-create-and-mutate []
  (println "\n--- 4.5 Function API: create/mutate ---")

  (let [div (dom/create "div")
        app (dom/query "#app")]
    (check-truthy "dom/create returns proxy" (proxy/is-dom-proxy? div))

    (dom/set-text! div "fn-created")
    (check "dom/set-text!" "fn-created" (dom/text div))

    (dom/append! app div)
    (check "appended visible" "fn-created"
           (.-textContent (.querySelector js/document "#app div:last-child")))

    (dom/set-attr! div "data-x" "hello")
    (check "dom/set-attr!" "hello" (dom/attr div "data-x"))

    (dom/remove! div)))

(defn test-fn-api-classes []
  (println "\n--- 4.6 Function API: classes ---")

  (let [el (dom/create "div")]
    (dom/append! (dom/query "#app") el)

    (dom/add-class! el "foo" "bar")
    (check "dom/has-class? foo" true (dom/has-class? el "foo"))
    (check "dom/has-class? bar" true (dom/has-class? el "bar"))

    (dom/remove-class! el "foo")
    (check "dom/has-class? after remove" false (dom/has-class? el "foo"))

    (dom/toggle-class! el "baz")
    (check "dom/toggle-class! on" true (dom/has-class? el "baz"))
    (dom/toggle-class! el "baz")
    (check "dom/toggle-class! off" false (dom/has-class? el "baz"))

    (dom/remove! el)))

(defn test-fn-api-rect []
  (println "\n--- 4.7 Function API: rect ---")

  (let [el (dom/create "div")]
    (dom/set-styles! el {"width" "100px" "height" "50px" "position" "absolute"})
    (dom/append! (dom/query "#app") el)

    (let [r (dom/rect el)]
      (check-truthy "dom/rect returns map" (map? r))
      (check-truthy "rect :width >= 100" (>= (:width r) 100))
      (check-truthy "rect :height >= 50" (>= (:height r) 50)))

    (dom/remove! el)))

;; ---------------------------------------------------------------------------
;; §5.1 Canvas 2D
;; ---------------------------------------------------------------------------

(defn test-canvas-2d []
  (println "\n--- 5.1 Canvas 2D ---")

  (let [canvas (.createElement js/document "canvas")]
    (.appendChild (.querySelector js/document "#app") canvas)
    (set! (.-width canvas) 200)
    (set! (.-height canvas) 100)

    (let [ctx (.getContext canvas "2d")]
      (check-truthy "2d context exists" (some? ctx))
      (check-truthy "2d context is proxy" (proxy/is-dom-proxy? ctx))

      ;; fillStyle set/get
      (set! (.-fillStyle ctx) "#ff0000")
      (check "fillStyle roundtrip" "#ff0000" (.-fillStyle ctx))

      ;; fillRect doesn't throw
      (try
        (.fillRect ctx 0 0 100 50)
        (pass! "fillRect doesn't throw")
        (catch :default e
          (fail! "fillRect doesn't throw" "no error" (str e))))

      ;; strokeStyle
      (set! (.-strokeStyle ctx) "#00ff00")
      (check "strokeStyle roundtrip" "#00ff00" (.-strokeStyle ctx))

      ;; canvas dimensions readable
      (check "canvas.width" 200 (.-width canvas))
      (check "canvas.height" 100 (.-height canvas))

      ;; clearRect doesn't throw
      (try
        (.clearRect ctx 0 0 200 100)
        (pass! "clearRect doesn't throw")
        (catch :default e
          (fail! "clearRect doesn't throw" "no error" (str e))))

      ;; beginPath / moveTo / lineTo / stroke
      (try
        (.beginPath ctx)
        (.moveTo ctx 0 0)
        (.lineTo ctx 100 50)
        (.stroke ctx)
        (pass! "path drawing doesn't throw")
        (catch :default e
          (fail! "path drawing doesn't throw" "no error" (str e))))

      ;; font / fillText
      (try
        (set! (.-font ctx) "14px monospace")
        (.fillText ctx "hello" 10 20)
        (pass! "fillText doesn't throw")
        (catch :default e
          (fail! "fillText doesn't throw" "no error" (str e)))))

    (.remove canvas)))

;; ---------------------------------------------------------------------------
;; §5.2 WebGL
;; ---------------------------------------------------------------------------

(defn test-webgl []
  (println "\n--- 5.2 WebGL ---")

  (let [canvas (.createElement js/document "canvas")]
    (.appendChild (.querySelector js/document "#app") canvas)
    (set! (.-width canvas) 200)
    (set! (.-height canvas) 100)

    ;; Try webgl (or webgl2)
    (let [gl (or (.getContext canvas "webgl2")
                 (.getContext canvas "webgl"))]
      (if (some? gl)
        (do
          (check-truthy "WebGL context is proxy" (proxy/is-dom-proxy? gl))

          ;; Read GL constants
          (let [color-buffer-bit (.-COLOR_BUFFER_BIT gl)]
            (check-truthy "COLOR_BUFFER_BIT is number" (number? color-buffer-bit)))

          ;; clearColor + clear
          (try
            (.clearColor gl 1.0 0.0 0.0 1.0)
            (.clear gl (.-COLOR_BUFFER_BIT gl))
            (pass! "clearColor+clear doesn't throw")
            (catch :default e
              (fail! "clearColor+clear doesn't throw" "no error" (str e))))

          ;; viewport
          (try
            (.viewport gl 0 0 200 100)
            (pass! "viewport doesn't throw")
            (catch :default e
              (fail! "viewport doesn't throw" "no error" (str e))))

          ;; createBuffer / bindBuffer
          (try
            (let [buf (.createBuffer gl)]
              (check-truthy "createBuffer returns something" (some? buf))
              (.bindBuffer gl (.-ARRAY_BUFFER gl) buf)
              (pass! "bindBuffer doesn't throw")
              (.deleteBuffer gl buf))
            (catch :default e
              (fail! "bindBuffer doesn't throw" "no error" (str e))))

          ;; createShader / shaderSource / compileShader
          (try
            (let [shader (.createShader gl (.-VERTEX_SHADER gl))]
              (check-truthy "createShader returns something" (some? shader))
              (.shaderSource gl shader "void main() { gl_Position = vec4(0,0,0,1); }")
              (.compileShader gl shader)
              (let [status (.getShaderParameter gl shader (.-COMPILE_STATUS gl))]
                (check-truthy "shader compiled" status))
              (.deleteShader gl shader))
            (catch :default e
              (fail! "shader compile" "no error" (str e))))

          ;; createProgram / attachShader / linkProgram
          (try
            (let [vs (.createShader gl (.-VERTEX_SHADER gl))
                  fs (.createShader gl (.-FRAGMENT_SHADER gl))
                  prog (.createProgram gl)]
              (.shaderSource gl vs "void main() { gl_Position = vec4(0,0,0,1); }")
              (.compileShader gl vs)
              (.shaderSource gl fs "void main() { gl_FragColor = vec4(1,0,0,1); }")
              (.compileShader gl fs)
              (.attachShader gl prog vs)
              (.attachShader gl prog fs)
              (.linkProgram gl prog)
              (let [status (.getProgramParameter gl prog (.-LINK_STATUS gl))]
                (check-truthy "program linked" status))
              (.deleteProgram gl prog)
              (.deleteShader gl vs)
              (.deleteShader gl fs))
            (catch :default e
              (fail! "program link" "no error" (str e))))

          ;; drawArrays
          (try
            (.drawArrays gl (.-TRIANGLES gl) 0 0)
            (pass! "drawArrays doesn't throw")
            (catch :default e
              (fail! "drawArrays doesn't throw" "no error" (str e)))))

        ;; WebGL not available (some CI environments)
        (pass! "WebGL not available (skip)")))

    (.remove canvas)))

;; ---------------------------------------------------------------------------
;; §5.3 requestAnimationFrame (sync checks)
;; ---------------------------------------------------------------------------

(defn test-raf-sync []
  (println "\n--- 5.3 requestAnimationFrame (sync) ---")

  ;; rAF returns a number (the request id)
  (let [id (.requestAnimationFrame js/window (fn [_]))]
    (check-truthy "rAF returns number" (number? id))
    (check-truthy "rAF id > 0" (pos? id))

    ;; cancelAnimationFrame doesn't throw
    (try
      (.cancelAnimationFrame js/window id)
      (pass! "cancelAnimationFrame doesn't throw")
      (catch :default e
        (fail! "cancelAnimationFrame doesn't throw" "no error" (str e))))))

;; ---------------------------------------------------------------------------
;; §5.4 requestAnimationFrame (async callback)
;; ---------------------------------------------------------------------------

(defn test-raf-async
  "Test that rAF callback fires with a timestamp. Returns a Promise."
  []
  (println "\n--- 5.4 requestAnimationFrame (async) ---")
  (js/Promise.
    (fn [resolve _]
      (let [called (atom false)]
        (.requestAnimationFrame js/window
          (fn [timestamp]
            (reset! called true)
            (check-truthy "rAF callback received" true)
            (check-truthy "rAF timestamp is number" (number? timestamp))
            (check-truthy "rAF timestamp > 0" (pos? timestamp))
            (resolve @test-results)))
        ;; Timeout
        (js/setTimeout
          (fn []
            (when-not @called
              (fail! "rAF callback timeout" "callback" "not called")
              (resolve @test-results)))
          5000)))))

;; ---------------------------------------------------------------------------
;; §5.5 requestAnimationFrame as bare global (D3 / library path)
;; ---------------------------------------------------------------------------

(defn test-raf-bare-global-sync []
  (println "\n--- 5.5 requestAnimationFrame bare global (sync) ---")

  ;; Bare `requestAnimationFrame` must not be the native worker RAF (which
  ;; throws NotSupportedError). It should be the proxy-forwarding version.
  (let [raf-fn js/requestAnimationFrame
        caf-fn js/cancelAnimationFrame]
    (check-truthy "bare requestAnimationFrame is a function" (fn? raf-fn))
    (check-truthy "bare cancelAnimationFrame is a function" (fn? caf-fn))

    ;; Calling it should return a numeric id without throwing
    (try
      (let [id (raf-fn (fn [_]))]
        (check-truthy "bare rAF returns number" (number? id))
        (check-truthy "bare rAF id > 0" (pos? id))
        (caf-fn id))
      (catch :default e
        (fail! "bare rAF does not throw" "no error" (str e))))))

(defn test-raf-bare-global-async
  "Test that a bare-global rAF callback fires. Returns a Promise."
  []
  (println "\n--- 5.6 requestAnimationFrame bare global (async callback) ---")
  (js/Promise.
    (fn [resolve _]
      (let [called (atom false)]
        ;; Call as a plain function (not window.rAF) — this is what D3 does
        (js/requestAnimationFrame
          (fn [timestamp]
            (reset! called true)
            (check-truthy "bare rAF callback fires" true)
            (check-truthy "bare rAF timestamp is number" (number? timestamp))
            (check-truthy "bare rAF timestamp > 0" (pos? timestamp))
            (resolve @test-results)))
        (js/setTimeout
          (fn []
            (when-not @called
              (fail! "bare rAF callback timeout" "callback" "not called")
              (resolve @test-results)))
          5000)))))

;; ---------------------------------------------------------------------------
;; §6.1 Bare global scalars (devicePixelRatio, matchMedia, getComputedStyle)
;; ---------------------------------------------------------------------------

(defn test-bare-globals []
  (println "\n--- 6.1 Bare global scalars ---")

  ;; devicePixelRatio — bare access (not window.devicePixelRatio)
  (let [dpr js/devicePixelRatio]
    (check-truthy "bare devicePixelRatio is number" (number? dpr))
    (check-truthy "bare devicePixelRatio >= 1" (>= dpr 1)))

  ;; matchMedia — bare access
  (let [mql (js/matchMedia "(min-width: 1px)")]
    (check-truthy "bare matchMedia returns something" (some? mql))
    (check "bare matchMedia matches" true (.-matches mql)))

  ;; getComputedStyle — bare access
  (let [el (.createElement js/document "div")]
    (.appendChild (.querySelector js/document "#app") el)
    (let [cs (js/getComputedStyle el)]
      (check-truthy "bare getComputedStyle returns something" (some? cs)))
    (.remove el))

  ;; screen — bare access
  (let [s js/screen]
    (check-truthy "bare screen exists" (some? s))
    (check-truthy "screen.width > 0" (pos? (.-width s))))

  ;; innerWidth / innerHeight — bare access
  (check-truthy "bare innerWidth >= 0" (>= js/innerWidth 0))
  (check-truthy "bare innerHeight >= 0" (>= js/innerHeight 0)))

;; ---------------------------------------------------------------------------
;; §6.2 MutationObserver — constructor + sync usage
;; ---------------------------------------------------------------------------

(defn test-mutation-observer-sync []
  (println "\n--- 6.2 MutationObserver (sync) ---")

  (let [div (.createElement js/document "div")
        _ (.appendChild (.querySelector js/document "#app") div)]

    ;; Constructor doesn't throw
    (try
      (let [obs (js/MutationObserver. (fn [_records _observer]))]
        (check-truthy "MutationObserver constructed" (some? obs))

        ;; .observe doesn't throw
        (try
          (.observe obs div #js {:childList true})
          (pass! "MutationObserver.observe doesn't throw")
          (catch :default e
            (fail! "MutationObserver.observe doesn't throw" "no error" (str e))))

        ;; .disconnect doesn't throw
        (try
          (.disconnect obs)
          (pass! "MutationObserver.disconnect doesn't throw")
          (catch :default e
            (fail! "MutationObserver.disconnect doesn't throw" "no error" (str e)))))
      (catch :default e
        (fail! "MutationObserver constructed" "no error" (str e))))

    (.remove div)))

;; ---------------------------------------------------------------------------
;; §6.3 MutationObserver — async callback
;; ---------------------------------------------------------------------------

(defn test-mutation-observer-async
  "Returns a Promise that resolves when the mutation callback fires."
  []
  (println "\n--- 6.3 MutationObserver async callback ---")
  (js/Promise.
    (fn [resolve _]
      (let [div (.createElement js/document "div")
            _ (.appendChild (.querySelector js/document "#app") div)
            called (atom false)]
        (let [obs (js/MutationObserver.
                    (fn [records observer]
                      (reset! called true)
                      (check-truthy "mutation records received" (pos? (count records)))
                      (let [rec (aget records 0)]
                        (check "mutation type" "childList" (.-type rec)))
                      (.disconnect observer)
                      (.remove div)
                      (resolve @test-results)))]
          (.observe obs div #js {:childList true})
          ;; Trigger a DOM mutation via the proxy
          (let [child (.createElement js/document "span")]
            (.appendChild div child)))
        (js/setTimeout
          (fn []
            (when-not @called
              (fail! "MutationObserver callback timeout" "callback" "not called")
              (.remove div)
              (resolve @test-results)))
          5000)))))

;; ---------------------------------------------------------------------------
;; §6.4 ResizeObserver — constructor + sync usage
;; ---------------------------------------------------------------------------

(defn test-resize-observer-sync []
  (println "\n--- 6.4 ResizeObserver (sync) ---")

  (let [div (.createElement js/document "div")
        _ (.appendChild (.querySelector js/document "#app") div)]

    (try
      (let [obs (js/ResizeObserver. (fn [_entries _observer]))]
        (check-truthy "ResizeObserver constructed" (some? obs))

        (try
          (.observe obs div)
          (pass! "ResizeObserver.observe doesn't throw")
          (catch :default e
            (fail! "ResizeObserver.observe doesn't throw" "no error" (str e))))

        (try
          (.disconnect obs)
          (pass! "ResizeObserver.disconnect doesn't throw")
          (catch :default e
            (fail! "ResizeObserver.disconnect doesn't throw" "no error" (str e)))))
      (catch :default e
        (fail! "ResizeObserver constructed" "no error" (str e))))

    (.remove div)))

;; ---------------------------------------------------------------------------
;; §6.5 IntersectionObserver — constructor + sync usage
;; ---------------------------------------------------------------------------

(defn test-intersection-observer-sync []
  (println "\n--- 6.5 IntersectionObserver (sync) ---")

  (let [div (.createElement js/document "div")
        _ (.appendChild (.querySelector js/document "#app") div)]

    (try
      (let [obs (js/IntersectionObserver. (fn [_entries _observer]))]
        (check-truthy "IntersectionObserver constructed" (some? obs))

        (try
          (.observe obs div)
          (pass! "IntersectionObserver.observe doesn't throw")
          (catch :default e
            (fail! "IntersectionObserver.observe doesn't throw" "no error" (str e))))

        (try
          (.disconnect obs)
          (pass! "IntersectionObserver.disconnect doesn't throw")
          (catch :default e
            (fail! "IntersectionObserver.disconnect doesn't throw" "no error" (str e)))))
      (catch :default e
        (fail! "IntersectionObserver constructed" "no error" (str e))))

    (.remove div)))

;; ---------------------------------------------------------------------------
;; §2.3 Event Callback (async — requires Promise)
;; ---------------------------------------------------------------------------

(defn test-event-callback-async
  "Test that click events are forwarded from screen to worker callback.
   Returns a Promise that resolves when the callback fires (or times out)."
  []
  (println "\n--- 2.3 Event Callback (async) ---")
  (js/Promise.
    (fn [resolve _reject]
      (let [btn (.createElement js/document "button")
            _ (.appendChild (.querySelector js/document "#app") btn)
            called (atom false)]
        (.addEventListener btn "click"
          (fn [e]
            (reset! called true)
            (check-truthy "click callback received" (some? e))
            (check "event.type" "click" (.-type e))
            (.remove btn)
            (resolve @test-results)))
        ;; Trigger click through the proxy → screen dispatches event
        (.click btn)
        ;; Timeout: if callback doesn't fire in 5s, fail and continue
        (js/setTimeout
          (fn []
            (when-not @called
              (fail! "click callback timeout" "callback" "not called")
              (.remove btn)
              (resolve @test-results)))
          5000)))))

;; ---------------------------------------------------------------------------
;; Runner
;; ---------------------------------------------------------------------------

(defn ^:export run-all!
  "Run all Phase 1-5 tests. Returns results map.
   Sync tests run immediately. Async tests (events, rAF) are chained
   and signal completion via window.__dom_proxy_test_done."
  []
  (println "\n=== DOM Proxy Tests: Phase 1-5 ===")
  (reset! test-results {:pass 0 :fail 0 :errors []})

  ;; Phase 1: synchronous tests (§1.1-1.9)
  (test-proxy-installed)
  (test-handle-registry-basics)
  (test-document-title)
  (test-transparent-property-access)
  (test-property-chains)
  (test-type-checks)
  (test-dom-mutation)
  (test-layout-geometry)
  (test-attributes)
  (test-classlist)
  (test-query-all)
  (test-style-property)
  (test-inner-html)
  (test-navigator-user-agent)
  (test-parent-child)

  ;; Phase 2: event registration (synchronous)
  (test-event-registration)
  (test-onclick-handler)

  ;; Phase 3: window, storage, navigation (synchronous)
  (test-window-properties)
  (test-window-location)
  (test-window-history)
  (test-window-match-media)
  (test-window-scroll-methods)
  (test-local-storage)
  (test-session-storage)
  (test-document-cookie)
  (test-window-get-selection)

  ;; Phase 4: batch operations & function-based API
  (test-batch-writes)
  (test-batch-style-writes)
  (test-set-styles)
  (test-fn-api-query)
  (test-fn-api-create-and-mutate)
  (test-fn-api-classes)
  (test-fn-api-rect)

  ;; Phase 5: Canvas, WebGL, rAF (synchronous parts)
  (test-canvas-2d)
  (test-webgl)
  (test-raf-sync)
  (test-raf-bare-global-sync)

  ;; Phase 6: Bare globals + observers (synchronous parts)
  (test-bare-globals)
  (test-mutation-observer-sync)
  (test-resize-observer-sync)
  (test-intersection-observer-sync)

  ;; Async tests — chained: rAF callback, event callback, mutation observer
  (let [{:keys [pass fail]} @test-results]
    (println (str "\n--- Sync tests: " pass " passed, " fail " failed ---"))
    (println "--- Starting async tests... ---"))

  (-> (test-raf-async)
      (.then (fn [_] (test-raf-bare-global-async)))
      (.then (fn [_] (test-event-callback-async)))
      (.then (fn [_] (test-mutation-observer-async)))
      (.then (fn [_]
               (let [{:keys [pass fail]} @test-results]
                 (println (str "\n=== All Tests Complete: " pass " passed, " fail " failed ==="))
                 (try
                   (set! (.-__dom_proxy_test_done js/window) (str pass ":" fail))
                   (catch :default _))))))

  ;; Return sync results for `in :core` return value
  @test-results)
