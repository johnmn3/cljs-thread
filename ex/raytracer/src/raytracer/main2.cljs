(ns raytracer.main
  "cljs-thread ray tracer: main thread entry point.
   Architecture: pmap fans out tiles to workers, each worker swaps
   its result into the shared app-state atom."
  (:require-macros [cljs-thread.core :refer [pmap future in]])
  (:require
   [cljs-thread.core :as t]
   [cljs-thread.dom.install]
   [cljs-thread.env :as env]
   [cljs-thread.pmap :as ctp]
   [raytracer.scene :as scene]
   [raytracer.vec3 :as v]
   [raytracer.camera :as cam]
   [raytracer.render :as render]))


;; ============================================================================
;; State
;; ============================================================================

(defonce app-state
  (t/atom ::app-state
    {:rendering? false
     :img-w 800
     :img-h 450
     :spp 10
     :tile-w 64
     :tile-h 64
     :workers 4
     :framebuffer nil}))

;; ============================================================================
;; DOM Helpers
;; ============================================================================

(defn- $ [id] (js/document.getElementById id))

(defn- set-text! [id text]
  (when-let [el ($ id)]
    (set! (.-textContent el) text)))

(defn- set-disabled! [id disabled?]
  (when-let [el ($ id)]
    (set! (.-disabled el) disabled?)))

(defn- get-val [id]
  (when-let [el ($ id)]
    (.-value el)))

(defn- get-int-val [id]
  (js/parseInt (get-val id) 10))

(defn- set-progress-bar! [pct]
  (when-let [el ($ "progress-bar")]
    (set! (.-style.width el) (str pct "%"))))

;; ============================================================================
;; Canvas
;; ============================================================================

(defn- get-canvas-ctx []
  (when-let [canvas ($ "render-canvas")]
    (.getContext canvas "2d")))

(defn- setup-canvas! [w h]
  (when-let [canvas ($ "render-canvas")]
    (set! (.-width canvas) w)
    (set! (.-height canvas) h)
    (let [ctx (.getContext canvas "2d")]
      (set! (.-fillStyle ctx) "#1a1a2e")
      (.fillRect ctx 0 0 w h))))

;; ============================================================================
;; Scene Packing
;; ============================================================================

(defn- pack-scene-into-state!
  "Pack raw scene data into app-state atom."
  [raw-scene]
  (let [{:keys [spheres materials camera-opts]} raw-scene
        scene-map
        (into {:num-spheres (.-length spheres)
               :num-materials (.-length materials)
               :cam-from-x (v/vec3-x (:look-from camera-opts))
               :cam-from-y (v/vec3-y (:look-from camera-opts))
               :cam-from-z (v/vec3-z (:look-from camera-opts))
               :cam-at-x (v/vec3-x (:look-at camera-opts))
               :cam-at-y (v/vec3-y (:look-at camera-opts))
               :cam-at-z (v/vec3-z (:look-at camera-opts))
               :cam-up-x (v/vec3-x (:vup camera-opts))
               :cam-up-y (v/vec3-y (:vup camera-opts))
               :cam-up-z (v/vec3-z (:vup camera-opts))
               :cam-vfov (:vfov camera-opts)
               :cam-aspect (:aspect-ratio camera-opts)
               :cam-aperture (:aperture camera-opts)
               :cam-focus-dist (:focus-dist camera-opts)}
              cat  ;; Flatten nested vectors from for comprehensions
              (concat
                (for [i (range (.-length spheres))
                      :let [s (aget spheres i)
                            prefix (str "s" i "-")]]
                  [[(keyword (str prefix "cx")) (aget s 0)]
                   [(keyword (str prefix "cy")) (aget s 1)]
                   [(keyword (str prefix "cz")) (aget s 2)]
                   [(keyword (str prefix "r"))  (aget s 3)]
                   [(keyword (str prefix "m"))  (aget s 4)]])
                (for [i (range (.-length materials))
                      :let [mat (aget materials i)
                            prefix (str "m" i "-")]]
                  [[(keyword (str prefix "t")) (aget mat 0)]
                   [(keyword (str prefix "r")) (aget mat 1)]
                   [(keyword (str prefix "g")) (aget mat 2)]
                   [(keyword (str prefix "b")) (aget mat 3)]
                   [(keyword (str prefix "p")) (aget mat 4)]])))]
    (swap! app-state merge scene-map {:tiles {}})))

;; ============================================================================
;; Scene Unpacking
;; ============================================================================

(defn- unpack-scene
  "Reconstruct scene arrays from the atom state map."
  [state]
  (let [num-spheres (get state :num-spheres)
        num-materials (get state :num-materials)
        spheres (let [out #js []]
                  (dotimes [i num-spheres]
                    (let [prefix (str "s" i "-")]
                      (.push out #js [(get state (keyword (str prefix "cx")))
                                      (get state (keyword (str prefix "cy")))
                                      (get state (keyword (str prefix "cz")))
                                      (get state (keyword (str prefix "r")))
                                      (get state (keyword (str prefix "m")))])))
                  out)
        materials (let [out #js []]
                    (dotimes [i num-materials]
                      (let [prefix (str "m" i "-")]
                        (.push out #js [(get state (keyword (str prefix "t")))
                                        (get state (keyword (str prefix "r")))
                                        (get state (keyword (str prefix "g")))
                                        (get state (keyword (str prefix "b")))
                                        (get state (keyword (str prefix "p")))])))
                    out)
        look-from (v/vec3 (get state :cam-from-x)
                          (get state :cam-from-y)
                          (get state :cam-from-z))
        look-at (v/vec3 (get state :cam-at-x)
                        (get state :cam-at-y)
                        (get state :cam-at-z))
        vup (v/vec3 (get state :cam-up-x)
                    (get state :cam-up-y)
                    (get state :cam-up-z))]
    {:spheres spheres
     :materials materials
     :camera-opts {:look-from look-from
                   :look-at look-at
                   :vup vup
                   :vfov (get state :cam-vfov)
                   :aspect-ratio (get state :cam-aspect)
                   :aperture (get state :cam-aperture)
                   :focus-dist (get state :cam-focus-dist)}}))

;; ============================================================================
;; Compositing
;; ============================================================================

(defn- draw-tile!
  "Draw a single tile to the canvas at its position."
  [ctx tile-idx tile-buf tile-w tile-h img-w img-h]
  (let [tiles-per-row (js/Math.ceil (/ img-w tile-w))
        tile-col (mod tile-idx tiles-per-row)
        tile-row (js/Math.floor (/ tile-idx tiles-per-row))
        start-x (* tile-col tile-w)
        start-y (* tile-row tile-h)
        actual-w (min tile-w (- img-w start-x))
        actual-h (min tile-h (- img-h start-y))
        img-data (.createImageData ctx actual-w actual-h)]
    ;; Copy tile pixels into ImageData (handling edge tiles)
    (dotimes [ly actual-h]
      (let [src-off (* ly tile-w 4)
            dst-off (* ly actual-w 4)
            row-bytes (* actual-w 4)]
        (.set (.-data img-data) (.subarray tile-buf src-off (+ src-off row-bytes)) dst-off)))
    (.putImageData ctx img-data start-x start-y)))

;; ============================================================================
;; Render
;; ============================================================================

(defn- start-screen-draw-loop!
  "Start a drawing loop on the screen thread that continuously
   draws the framebuffer while rendering is in progress.
   The loop reads directly from the SAB-backed framebuffer."
  [img-w img-h total-tiles]
  ;; This runs on screen thread - it has direct DOM access
  (in :screen
    (let [canvas (js/document.getElementById "render-canvas")
          ctx (.getContext canvas "2d")
          progress-el (js/document.getElementById "progress-text")
          progress-bar (js/document.getElementById "progress-bar")]
      (letfn [(draw-loop []
                ;; Check if still rendering by reading the shared atom
                (let [state @raytracer.main/app-state]
                  (when (:rendering? state)
                    ;; Draw framebuffer
                    (when-let [fb (:framebuffer state)]
                      (let [img-data (.createImageData ctx img-w img-h)]
                        (.set (.-data img-data) fb)
                        (.putImageData ctx img-data 0 0)))
                    ;; Update progress (tiles-done is tracked in atom)
                    (when-let [done (:tiles-done state)]
                      (let [pct (* 100 (/ done total-tiles))]
                        (set! (.-textContent progress-el)
                          (str "Rendering: " done "/" total-tiles " tiles"))
                        (set! (.-style.width progress-bar) (str pct "%"))))
                    ;; Continue loop
                    (js/requestAnimationFrame draw-loop))))]
        (js/requestAnimationFrame draw-loop)))))

(defn- do-render! []
  (when-not (:rendering? @app-state)
    (swap! app-state assoc :rendering? true :tiles-done 0)
    (set-disabled! "render-btn" true)
    (set-progress-bar! 0)
    (set-text! "progress-text" "Building scene...")

    (let [{:keys [img-w img-h spp tile-w tile-h workers]} @app-state
          raw-scene (scene/random-scene)
          _ (pack-scene-into-state! raw-scene)
          tiles-per-row (js/Math.ceil (/ img-w tile-w))
          tiles-per-col (js/Math.ceil (/ img-h tile-h))
          total-tiles (* tiles-per-row tiles-per-col)
          tile-indices (vec (range total-tiles))
          framebuffer-size (* img-w img-h 4)]

      (setup-canvas! img-w img-h)

      ;; Allocate framebuffer - atom automatically stores in SAB
      (set-text! "progress-text" "Allocating framebuffer...")
      (let [fb (js/Uint8ClampedArray. framebuffer-size)]
        (swap! app-state assoc :framebuffer fb))

      (set-text! "progress-text"
        (str "Rendering " total-tiles " tiles..."))

      ;; Start the screen-side drawing loop BEFORE blocking on pmap
      (start-screen-draw-loop! img-w img-h total-tiles)

      (try
        (let [start-time (js/performance.now)
              ctx (get-canvas-ctx)]
          (when ctx
            ;; Render all tiles via pmap (blocks until done)
            ;; Each worker uses swap! to access the SAB-backed framebuffer
            (js/console.log "[core] Starting pmap with *par*=" workers)
            (binding [ctp/*par* workers]
              (let [completed-indices (doall (pmap (fn [tile-idx]
                                                     (swap! app-state
                                                       (fn [state]
                                                         (let [{:keys [spheres materials camera-opts]} (unpack-scene state)
                                                               camera (cam/make-camera camera-opts)
                                                               framebuffer (:framebuffer state)]
                                                           (render/render-tile-to-framebuffer!
                                                             tile-idx tile-w tile-h img-w img-h spp
                                                             framebuffer camera spheres materials))
                                                         (update state :tiles-done inc)))
                                                     tile-idx)
                                                   tile-indices))]
                (js/console.log "[core] pmap done," (count completed-indices) "tiles with *par*=" workers)))

            ;; Done - stop the drawing loop by clearing :rendering?
            (swap! app-state assoc :rendering? false)
            (let [elapsed (/ (- (js/performance.now) start-time) 1000.0)
                  ms-per-tile (/ (* elapsed 1000) total-tiles)]
              ;; Update UI on screen thread directly for reliable final status
              (in :screen
                (let [progress-el (js/document.getElementById "progress-text")
                      progress-bar (js/document.getElementById "progress-bar")
                      render-btn (js/document.getElementById "render-btn")]
                  (set! (.-style.width progress-bar) "100%")
                  (set! (.-textContent progress-el)
                    (str "Done! " total-tiles " tiles in " (.toFixed elapsed 1) "s "
                         "(" (.toFixed ms-per-tile 1) " ms/tile)"))
                  (set! (.-disabled render-btn) false))))))
        (catch :default e
          (js/console.error "[Render] ERROR:" e)
          (swap! app-state assoc :rendering? false)
          (in :screen
            (let [progress-el (js/document.getElementById "progress-text")
                  render-btn (js/document.getElementById "render-btn")]
              (set! (.-textContent progress-el) (str "Error: " (.-message e)))
              (set! (.-disabled render-btn) false))))))))

;; ============================================================================
;; UI Controls
;; ============================================================================

(defn- read-controls! []
  (let [res (get-val "resolution")
        [w h] (case res
                "400x225"   [400 225]
                "800x450"   [800 450]
                "1200x675"  [1200 675]
                "1600x900"  [1600 900]
                [800 450])]
    (swap! app-state assoc
      :img-w w
      :img-h h
      :spp (get-int-val "spp")
      :workers (get-int-val "workers"))))

(defn- populate-workers-dropdown! []
  ;; Populate workers dropdown based on hardware concurrency
  (when-let [el ($ "workers")]
    ;; Clear existing options
    (set! (.-innerHTML el) "")
    ;; Add options: powers of 2, plus the actual core count if not a power of 2
    (let [max-workers (or js/navigator.hardwareConcurrency 4)
          base-options (filter #(<= % max-workers) [2 4 8 16])
          ;; Add the actual max if it's not already in the list
          options (if (some #(= % max-workers) base-options)
                    base-options
                    (sort (conj base-options max-workers)))]
      (doseq [n options]
        (let [opt (js/document.createElement "option")]
          (set! (.-value opt) (str n))
          (set! (.-textContent opt) (str n))
          ;; Select the max by default
          (when (= n max-workers)
            (set! (.-selected opt) true))
          (.appendChild el opt))))))

(defn- setup-controls! []
  (populate-workers-dropdown!)
  (when-let [el ($ "resolution")]
    (.addEventListener el "change" (fn [_] (read-controls!))))
  (when-let [el ($ "spp")]
    (.addEventListener el "change" (fn [_] (read-controls!))))
  (when-let [el ($ "workers")]
    (.addEventListener el "change" (fn [_] (read-controls!))))
  (when-let [btn ($ "render-btn")]
    (.addEventListener btn "click"
      (fn [_]
        (read-controls!)
        (do-render!)))))

;; ============================================================================
;; Diagnostics
;; ============================================================================

(defn ^:export test-typed-array-sharing []
  "Test if typed arrays are properly shared via the atom."
  (js/console.log "=== Testing typed array sharing ===")

  ;; Create a small test array
  (let [arr (js/Uint8ClampedArray. 10)
        _ (aset arr 0 42)
        test-atom (t/atom ::diag-test {:data arr})]

    ;; Theory 1: Check if deref returns copies or shared views
    (let [arr1 (:data @test-atom)
          arr2 (:data @test-atom)]

      (js/console.log "Original array buffer type:" (type (.-buffer arr)))
      (js/console.log "arr1 buffer type:" (type (.-buffer arr1)))
      (js/console.log "arr1 buffer:" (.-buffer arr1))
      (js/console.log "arr2 buffer:" (.-buffer arr2))
      (js/console.log "arr1 === arr2:" (identical? arr1 arr2))
      (js/console.log "arr1.buffer === arr2.buffer:" (identical? (.-buffer arr1) (.-buffer arr2)))

      ;; Theory 2: Check if mutations are visible
      (js/console.log "Before mutation - arr1[5]:" (aget arr1 5))
      (aset arr1 5 99)
      (js/console.log "After arr1[5]=99 - arr1[5]:" (aget arr1 5))
      (js/console.log "After arr1[5]=99 - arr2[5]:" (aget arr2 5))

      ;; Get fresh deref
      (let [arr3 (:data @test-atom)]
        (js/console.log "Fresh deref arr3[5]:" (aget arr3 5)))

      ;; Summary
      (js/console.log "=== Summary ===")
      (js/console.log "SAB-backed:" (instance? js/SharedArrayBuffer (.-buffer arr1)))
      (js/console.log "Same buffer across derefs:" (identical? (.-buffer arr1) (.-buffer arr2)))
      (js/console.log "Mutations visible:" (= 99 (aget arr2 5))))))

;; ============================================================================
;; Entry Point
;; ============================================================================

(defn ^:export main []
  ;; Runs on :core via cljs_thread.main() — DOM ops are proxied to screen
  (if-not (exists? js/SharedArrayBuffer)
    (set-text! "progress-text"
      "SharedArrayBuffer not available. Ensure COOP/COEP headers are set.")
    (do
      (setup-controls!)
      (set-text! "progress-text" "Ready. Click Render to start."))))
