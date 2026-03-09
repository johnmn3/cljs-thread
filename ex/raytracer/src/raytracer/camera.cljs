(ns raytracer.camera
  "Camera with defocus blur (depth of field)."
  (:require [raytracer.vec3 :as v]
            [raytracer.ray :as r]))

(defn make-camera
  [{:keys [look-from look-at vup vfov aspect-ratio aperture focus-dist]}]
  (let [theta (* vfov (/ js/Math.PI 180.0))
        h (js/Math.tan (/ theta 2.0))
        viewport-height (* 2.0 h)
        viewport-width (* aspect-ratio viewport-height)
        w (v/normalize (v/sub look-from look-at))
        u (v/normalize (v/cross vup w))
        vv (v/cross w u)
        horizontal (v/scale u (* focus-dist viewport-width))
        vertical (v/scale vv (* focus-dist viewport-height))
        lower-left (v/sub (v/sub (v/sub look-from (v/div horizontal 2.0))
                                  (v/div vertical 2.0))
                          (v/scale w focus-dist))
        lens-radius (/ aperture 2.0)]
    #js {:origin look-from
         :horizontal horizontal
         :vertical vertical
         :lowerLeft lower-left
         :u u
         :v vv
         :w w
         :lensRadius lens-radius}))

(defn get-ray
  ^js [^js camera ^number s ^number t]
  (let [origin (.-origin camera)
        lens-radius (.-lensRadius camera)]
    (if (> lens-radius 0)
      (let [rd (v/scale (v/rand-in-unit-disk) lens-radius)
            u-cam (.-u camera)
            v-cam (.-v camera)
            offset (v/add (v/scale u-cam (v/vec3-x rd))
                          (v/scale v-cam (v/vec3-y rd)))
            from (v/add origin offset)
            target (v/add (v/add (.-lowerLeft camera)
                                 (v/scale (.-horizontal camera) s))
                          (v/scale (.-vertical camera) t))
            direction (v/sub target from)]
        (r/make-ray from direction))
      (let [target (v/add (v/add (.-lowerLeft camera)
                                 (v/scale (.-horizontal camera) s))
                          (v/scale (.-vertical camera) t))
            direction (v/sub target origin)]
        (r/make-ray origin direction)))))
