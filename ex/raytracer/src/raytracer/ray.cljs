(ns raytracer.ray
  "Ray representation.
   A ray is #js [ox oy oz dx dy dz] — origin + direction packed flat."
  (:require [raytracer.vec3 :as v]))

(defn make-ray ^js [^js origin ^js direction]
  #js [(v/vec3-x origin) (v/vec3-y origin) (v/vec3-z origin)
       (v/vec3-x direction) (v/vec3-y direction) (v/vec3-z direction)])

(defn ray-origin ^js [^js ray]
  #js [(aget ray 0) (aget ray 1) (aget ray 2)])

(defn ray-direction ^js [^js ray]
  #js [(aget ray 3) (aget ray 4) (aget ray 5)])

(defn ray-at ^js [^js ray ^number t]
  #js [(+ (aget ray 0) (* t (aget ray 3)))
       (+ (aget ray 1) (* t (aget ray 4)))
       (+ (aget ray 2) (* t (aget ray 5)))])
