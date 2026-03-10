(ns raytracer.material
  "Materials: Lambertian, Metal, Dielectric.
   Material: #js [type albedo-r albedo-g albedo-b param]
     type 0 = Lambertian
     type 1 = Metal (param = fuzz)
     type 2 = Dielectric (param = refraction index)"
  (:require [raytracer.vec3 :as v]
            [raytracer.ray :as r]))

(def ^:const MAT_LAMBERTIAN 0)
(def ^:const MAT_METAL 1)
(def ^:const MAT_DIELECTRIC 2)

(defn lambertian ^js [^number r ^number g ^number b]
  #js [MAT_LAMBERTIAN r g b 0])

(defn metal ^js [^number r ^number g ^number b ^number fuzz]
  #js [MAT_METAL r g b (min fuzz 1.0)])

(defn dielectric ^js [^number refraction-index]
  #js [MAT_DIELECTRIC 1.0 1.0 1.0 refraction-index])

(defn- reflectance
  ^number [^number cosine ^number ref-idx]
  (let [r0 (/ (- 1.0 ref-idx) (+ 1.0 ref-idx))
        r0-sq (* r0 r0)]
    (+ r0-sq (* (- 1.0 r0-sq) (js/Math.pow (- 1.0 cosine) 5)))))

(defn scatter
  [^js material ^js ray-in ^js hit-record]
  (let [mat-type (aget material 0)
        ar (aget material 1)
        ag (aget material 2)
        ab (aget material 3)
        param (aget material 4)
        px (aget hit-record 1)
        py (aget hit-record 2)
        pz (aget hit-record 3)
        nx (aget hit-record 4)
        ny (aget hit-record 5)
        nz (aget hit-record 6)
        front-face? (== (aget hit-record 8) 1)
        hit-point (v/vec3 px py pz)
        normal (v/vec3 nx ny nz)]
    (case mat-type
      0 ;; Lambertian
      (let [scatter-dir (v/add normal (v/rand-unit-vector))
            scatter-dir (if (v/near-zero? scatter-dir) normal scatter-dir)
            scattered (r/make-ray hit-point scatter-dir)]
        #js [ar ag ab scattered])

      1 ;; Metal
      (let [ray-dir (r/ray-direction ray-in)
            reflected (v/reflect (v/normalize ray-dir) normal)
            scattered-dir (if (pos? param)
                            (v/add reflected (v/scale (v/rand-in-unit-sphere) param))
                            reflected)
            scattered (r/make-ray hit-point scattered-dir)]
        (when (pos? (v/dot scattered-dir normal))
          #js [ar ag ab scattered]))

      2 ;; Dielectric
      (let [refraction-ratio (if front-face? (/ 1.0 param) param)
            unit-dir (v/normalize (r/ray-direction ray-in))
            cos-theta (min (- (v/dot unit-dir normal)) 1.0)
            sin-theta (js/Math.sqrt (- 1.0 (* cos-theta cos-theta)))
            cannot-refract? (> (* refraction-ratio sin-theta) 1.0)
            direction (if (or cannot-refract?
                              (> (reflectance cos-theta refraction-ratio)
                                 (js/Math.random)))
                        (v/reflect unit-dir normal)
                        (v/refract unit-dir normal refraction-ratio))
            scattered (r/make-ray hit-point direction)]
        #js [1.0 1.0 1.0 scattered])

      nil)))
