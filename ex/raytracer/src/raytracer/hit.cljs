(ns raytracer.hit
  "Ray-sphere intersection.
   Spheres: #js [cx cy cz radius mat-idx]
   HitRecord: #js [t px py pz nx ny nz mat-idx front-face?]"
  (:require [raytracer.vec3 :as v]
            [raytracer.ray :as r]))

(defn hit-sphere
  [^js ray ^js sphere ^number t-min ^number t-max]
  (let [cx (aget sphere 0)
        cy (aget sphere 1)
        cz (aget sphere 2)
        radius (aget sphere 3)
        mat-idx (aget sphere 4)
        ocx (- (aget ray 0) cx)
        ocy (- (aget ray 1) cy)
        ocz (- (aget ray 2) cz)
        dx (aget ray 3)
        dy (aget ray 4)
        dz (aget ray 5)
        a (+ (* dx dx) (* dy dy) (* dz dz))
        half-b (+ (* ocx dx) (* ocy dy) (* ocz dz))
        c (- (+ (* ocx ocx) (* ocy ocy) (* ocz ocz)) (* radius radius))
        discriminant (- (* half-b half-b) (* a c))]
    (when (>= discriminant 0)
      (let [sqrtd (js/Math.sqrt discriminant)
            root (/ (- (- half-b) sqrtd) a)]
        (let [root (if (or (< root t-min) (> root t-max))
                     (let [r2 (/ (+ (- half-b) sqrtd) a)]
                       (when (and (>= r2 t-min) (<= r2 t-max)) r2))
                     root)]
          (when root
            (let [px (+ (aget ray 0) (* root dx))
                  py (+ (aget ray 1) (* root dy))
                  pz (+ (aget ray 2) (* root dz))
                  inv-r (/ 1.0 radius)
                  onx (* (- px cx) inv-r)
                  ony (* (- py cy) inv-r)
                  onz (* (- pz cz) inv-r)
                  front-face? (< (+ (* dx onx) (* dy ony) (* dz onz)) 0)
                  nx (if front-face? onx (- onx))
                  ny (if front-face? ony (- ony))
                  nz (if front-face? onz (- onz))]
              #js [root px py pz nx ny nz mat-idx (if front-face? 1 0)])))))))

(defn hit-world
  [^js ray ^js spheres ^number t-min ^number t-max]
  (let [n (.-length spheres)]
    (loop [i 0
           closest-t t-max
           closest-hit nil]
      (if (>= i n)
        closest-hit
        (let [hit (hit-sphere ray (aget spheres i) t-min closest-t)]
          (if hit
            (recur (inc i) (aget hit 0) hit)
            (recur (inc i) closest-t closest-hit)))))))
