(ns raytracer.render
  "Tile-based ray tracing core."
  (:require [raytracer.vec3 :as v]
            [raytracer.ray :as r]
            [raytracer.hit :as hit]
            [raytracer.material :as mat]
            [raytracer.camera :as cam]))

(def ^:const MAX_DEPTH 50)
(def ^:const T_MIN 0.001)
(def ^:const T_MAX 999999999.0)

(defn trace-ray
  [^js ray ^js spheres ^js materials ^number depth]
  (if (<= depth 0)
    #js [0.0 0.0 0.0]
    (let [hit-rec (hit/hit-world ray spheres T_MIN T_MAX)]
      (if hit-rec
        (let [mat-idx (aget hit-rec 7)
              material (aget materials mat-idx)]
          (if-not material
            #js [0.0 0.0 0.0]
            (let [scatter-result (mat/scatter material ray hit-rec)]
              (if scatter-result
                (let [ar (aget scatter-result 0)
                      ag (aget scatter-result 1)
                      ab (aget scatter-result 2)
                      scattered (aget scatter-result 3)
                      child-color (trace-ray scattered spheres materials (dec depth))]
                  #js [(* ar (aget child-color 0))
                       (* ag (aget child-color 1))
                       (* ab (aget child-color 2))])
                #js [0.0 0.0 0.0]))))
        (let [dir (v/normalize (r/ray-direction ray))
              t (* 0.5 (+ (v/vec3-y dir) 1.0))]
          #js [(+ (* (- 1.0 t) 1.0) (* t 0.5))
               (+ (* (- 1.0 t) 1.0) (* t 0.7))
               (+ (* (- 1.0 t) 1.0) (* t 1.0))])))))

(defn- clamp ^number [^number x ^number lo ^number hi]
  (if (< x lo) lo (if (> x hi) hi x)))

(defn render-tile!
  "Render a single tile into pixel-buf at tile-local coordinates.
   pixel-buf is the tile's own Uint8ClampedArray (tile-w * tile-h * 4 bytes).
   Stride is tile-w; edge tiles simply don't fill the full buffer."
  [^number tile-idx ^number tile-w ^number tile-h
   ^number img-w ^number img-h ^number spp
   ^js pixel-buf ^js camera ^js spheres ^js materials]
  (let [tiles-per-row (js/Math.ceil (/ img-w tile-w))
        tile-col (mod tile-idx tiles-per-row)
        tile-row (js/Math.floor (/ tile-idx tiles-per-row))
        start-x (* tile-col tile-w)
        start-y (* tile-row tile-h)
        end-x (min (+ start-x tile-w) img-w)
        end-y (min (+ start-y tile-h) img-h)
        inv-spp (/ 1.0 spp)
        img-w-1 (dec img-w)
        img-h-1 (dec img-h)]
    (loop [y start-y]
      (when (< y end-y)
        (loop [x start-x]
          (when (< x end-x)
            (let [cr (loop [s 0 acc-r 0.0 acc-g 0.0 acc-b 0.0]
                       (if (>= s spp)
                         #js [acc-r acc-g acc-b]
                         (let [u (/ (+ x (js/Math.random)) img-w-1)
                               vv (/ (+ y (js/Math.random)) img-h-1)
                               vv (- 1.0 vv)
                               ray (cam/get-ray camera u vv)
                               color (trace-ray ray spheres materials MAX_DEPTH)]
                           (recur (inc s)
                                  (+ acc-r (aget color 0))
                                  (+ acc-g (aget color 1))
                                  (+ acc-b (aget color 2))))))
                  rr (js/Math.sqrt (* (aget cr 0) inv-spp))
                  gg (js/Math.sqrt (* (aget cr 1) inv-spp))
                  bb (js/Math.sqrt (* (aget cr 2) inv-spp))
                  ;; Tile-local coordinates, stride = tile-w
                  local-x (- x start-x)
                  local-y (- y start-y)
                  idx (* (+ (* local-y tile-w) local-x) 4)]
              (aset pixel-buf idx       (js/Math.floor (* 256 (clamp rr 0.0 0.999))))
              (aset pixel-buf (+ idx 1) (js/Math.floor (* 256 (clamp gg 0.0 0.999))))
              (aset pixel-buf (+ idx 2) (js/Math.floor (* 256 (clamp bb 0.0 0.999))))
              (aset pixel-buf (+ idx 3) 255))
            (recur (inc x))))
        (recur (inc y))))))

(defn render-tile-to-framebuffer!
  "Render a single tile directly into framebuffer at image coordinates.
   framebuffer is the full image Uint8ClampedArray (img-w * img-h * 4 bytes).
   Stride is img-w; writes directly to final pixel locations."
  [^number tile-idx ^number tile-w ^number tile-h
   ^number img-w ^number img-h ^number spp
   ^js framebuffer ^js camera ^js spheres ^js materials]
  (let [tiles-per-row (js/Math.ceil (/ img-w tile-w))
        tile-col (mod tile-idx tiles-per-row)
        tile-row (js/Math.floor (/ tile-idx tiles-per-row))
        start-x (* tile-col tile-w)
        start-y (* tile-row tile-h)
        end-x (min (+ start-x tile-w) img-w)
        end-y (min (+ start-y tile-h) img-h)
        inv-spp (/ 1.0 spp)
        img-w-1 (dec img-w)
        img-h-1 (dec img-h)]
    (loop [y start-y]
      (when (< y end-y)
        (loop [x start-x]
          (when (< x end-x)
            (let [cr (loop [s 0 acc-r 0.0 acc-g 0.0 acc-b 0.0]
                       (if (>= s spp)
                         #js [acc-r acc-g acc-b]
                         (let [u (/ (+ x (js/Math.random)) img-w-1)
                               vv (/ (+ y (js/Math.random)) img-h-1)
                               vv (- 1.0 vv)
                               ray (cam/get-ray camera u vv)
                               color (trace-ray ray spheres materials MAX_DEPTH)]
                           (recur (inc s)
                                  (+ acc-r (aget color 0))
                                  (+ acc-g (aget color 1))
                                  (+ acc-b (aget color 2))))))
                  rr (js/Math.sqrt (* (aget cr 0) inv-spp))
                  gg (js/Math.sqrt (* (aget cr 1) inv-spp))
                  bb (js/Math.sqrt (* (aget cr 2) inv-spp))
                  ;; Image coordinates, stride = img-w
                  idx (* (+ (* y img-w) x) 4)]
              (aset framebuffer idx       (js/Math.floor (* 256 (clamp rr 0.0 0.999))))
              (aset framebuffer (+ idx 1) (js/Math.floor (* 256 (clamp gg 0.0 0.999))))
              (aset framebuffer (+ idx 2) (js/Math.floor (* 256 (clamp bb 0.0 0.999))))
              (aset framebuffer (+ idx 3) 255))
            (recur (inc x))))
        (recur (inc y))))))
