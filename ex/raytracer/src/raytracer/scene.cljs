(ns raytracer.scene
  "Scene definition — the classic 'Ray Tracing in One Weekend' cover scene.
   Returns pure data: sphere arrays + material arrays + camera config."
  (:require [raytracer.vec3 :as v]
            [raytracer.material :as mat]))

(defn random-scene
  "Generate the RTIOW cover scene.
   Returns {:spheres #js [...] :materials #js [...] :camera-opts {...}}."
  []
  (let [materials #js []
        spheres #js []
        _ (.push materials (mat/lambertian 0.5 0.5 0.5))
        _ (.push spheres #js [0 -1000 0 1000 0])
        _ (.push materials (mat/dielectric 1.5))
        _ (.push spheres #js [0 1 0 1.0 1])
        _ (.push materials (mat/lambertian 0.4 0.2 0.1))
        _ (.push spheres #js [-4 1 0 1.0 2])
        _ (.push materials (mat/metal 0.7 0.6 0.5 0.0))
        _ (.push spheres #js [4 1 0 1.0 3])]

    (doseq [a (range -5 5)
            b (range -5 5)]
      (let [choose-mat (js/Math.random)
            cx (+ a (* 0.9 (js/Math.random)))
            cz (+ b (* 0.9 (js/Math.random)))
            cy 0.2]
        (when (> (v/length (v/sub (v/vec3 cx cy cz) (v/vec3 4 0.2 0))) 0.9)
          (let [mat-idx (.-length materials)]
            (cond
              (< choose-mat 0.8)
              (let [r (* (js/Math.random) (js/Math.random))
                    g (* (js/Math.random) (js/Math.random))
                    b (* (js/Math.random) (js/Math.random))]
                (.push materials (mat/lambertian r g b))
                (.push spheres #js [cx cy cz 0.2 mat-idx]))

              (< choose-mat 0.95)
              (let [r (+ 0.5 (* 0.5 (js/Math.random)))
                    g (+ 0.5 (* 0.5 (js/Math.random)))
                    b (+ 0.5 (* 0.5 (js/Math.random)))
                    fuzz (* 0.5 (js/Math.random))]
                (.push materials (mat/metal r g b fuzz))
                (.push spheres #js [cx cy cz 0.2 mat-idx]))

              :else
              (do
                (.push materials (mat/dielectric 1.5))
                (.push spheres #js [cx cy cz 0.2 mat-idx])))))))

    {:spheres spheres
     :materials materials
     :camera-opts {:look-from (v/vec3 13 2 3)
                   :look-at (v/vec3 0 0 0)
                   :vup (v/vec3 0 1 0)
                   :vfov 20
                   :aspect-ratio (/ 16.0 9.0)
                   :aperture 0.1
                   :focus-dist 10.0}}))
