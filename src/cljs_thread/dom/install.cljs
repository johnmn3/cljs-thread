(ns cljs-thread.dom.install
  "Worker-side installation of DOM proxies on globalThis.

   Two-phase approach:
     Phase 1 (bootstrap, fat_kernel.cljs): Minimal stubs for globals that JS
       libraries capture at MODULE-INIT TIME (before importScripts completes).
       These stubs prevent crashes but are not full proxies.

     Phase 2 (this namespace): Replaces all stubs with Object.defineProperty
       getters that forward to the window/document proxies.  Runs once the
       worker is connected to the :screen peer.

   Coverage:
     - document, window — core DOM proxies
     - navigator, location, history — navigation globals
     - localStorage, sessionStorage — storage globals
     - requestAnimationFrame, cancelAnimationFrame — animation
     - screen, devicePixelRatio — display geometry
     - innerWidth/Height, outerWidth/Height — viewport geometry
     - scrollX/Y, pageXOffset/Y — scroll position
     - matchMedia, getComputedStyle — CSS / media queries
     - alert, confirm, prompt, open — UI / window management
     - scroll, scrollTo, scrollBy — scroll methods
     - visualViewport — visual viewport
     - MutationObserver, ResizeObserver, IntersectionObserver — observers
       (proxy.cljs returns a special constructor-proxy for these)

   Call `install!` once during worker initialization.
   Only runs on worker threads."
  (:require [cljs-thread.env :as e]
            [cljs-thread.msg :as m]
            [cljs-thread.dom.proxy :as proxy]
            [cljs-thread.dom.constructors :as ctors]))

(defonce ^:private installed? (atom false))

(defn install!
  "Install DOM proxy objects on the worker's globalThis.
   Idempotent — safe to call multiple times.
   No-op on the screen thread."
  []
  (when (and (not (e/in-screen?))
             (not @installed?))
    (reset! installed? true)

    ;; Install synthetic constructors first
    (ctors/install!)

    ;; Install proxy objects for well-known DOM globals
    (let [doc-proxy (proxy/document-proxy)
          win-proxy (proxy/window-proxy)]

      ;; Use Object.defineProperty with getters for properties that may be
      ;; read-only. Don't overwrite js/self (used by cljs-thread messaging).
      (js/Object.defineProperty js/globalThis "document"
        #js {:get (fn [] doc-proxy) :configurable true})
      (js/Object.defineProperty js/globalThis "window"
        #js {:get (fn [] win-proxy) :configurable true})

      ;; Update the Phase-1 rAF/cAF delegates to the real screen-proxy
      ;; implementations.  Libraries (e.g. d3-timer) that captured
      ;; window.requestAnimationFrame.bind(window) at module-init time hold a
      ;; reference to the indirection wrapper, so updating the delegate here
      ;; is enough to make them use the real rAF proxy without re-reading the
      ;; property.
      ;; Guard: js/self exists in browser workers but not in Node.js worker_threads.
      (when (exists? js/self)
        (set! js/self.__rAF_delegate (.-requestAnimationFrame win-proxy))
        (set! js/self.__cAF_delegate (.-cancelAnimationFrame win-proxy)))

      ;; All window-forwarded bare globals.
      ;;
      ;; When a library accesses e.g. `matchMedia(...)` or `devicePixelRatio`
      ;; directly (without the `window.` prefix), these getters ensure the call
      ;; routes through the window proxy to the screen thread.
      ;;
      ;; Note: MutationObserver/ResizeObserver/IntersectionObserver are routed
      ;; through the window proxy too; proxy.cljs intercepts those property names
      ;; in its get trap and returns a special observer constructor (not a generic
      ;; make-method-fn) so that the callback stays on the worker.
      (doseq [prop ["navigator"
                    "location"
                    "history"
                    "localStorage"
                    "sessionStorage"
                    ;; Animation
                    "requestAnimationFrame"
                    "cancelAnimationFrame"
                    ;; Display geometry
                    "screen"
                    "devicePixelRatio"
                    ;; Viewport geometry
                    "innerWidth"
                    "innerHeight"
                    "outerWidth"
                    "outerHeight"
                    ;; Scroll position
                    "scrollX"
                    "scrollY"
                    "pageXOffset"
                    "pageYOffset"
                    ;; CSS / media
                    "matchMedia"
                    "getComputedStyle"
                    ;; UI / window management
                    "alert"
                    "confirm"
                    "prompt"
                    "open"
                    ;; Scroll methods
                    "scroll"
                    "scrollTo"
                    "scrollBy"
                    ;; Viewport / orientation
                    "visualViewport"
                    ;; Observers — proxy.cljs returns a special constructor-proxy
                    "MutationObserver"
                    "ResizeObserver"
                    "IntersectionObserver"]]
        (js/Object.defineProperty js/globalThis prop
          #js {:get (fn [] (unchecked-get win-proxy prop)) :configurable true})))))

(defn installed?*
  "Check if DOM proxies have been installed. For testing."
  []
  @installed?)

;; Auto-install on workers, but only once the :screen peer is connected.
;; Workers spawned with a direct screen connection (root, screen-caller) have
;; :screen in peers immediately, so this fires synchronously during namespace load.
;; Workers without a direct screen connection yet (e.g. :core, :db spawned by root)
;; defer until meshify delivers the :screen receive-port — this prevents the
;; importScripts deadlock where DOM proxy fires before :screen is reachable.
;; Screen thread and Node.js workers are no-ops (no DOM to proxy).
(def ^:private node?
  "True when running in Node.js (main or worker_threads)."
  (and (exists? js/process) (exists? js/process.versions)))

(if (or (e/in-screen?) node?)
  nil
  (m/when-peer-ready :screen install!))
