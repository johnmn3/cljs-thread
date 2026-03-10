(ns raytracer.tile-renderer
  "Tile rendering for the cljs-thread ray tracer.
   Receives app-state atom, renders a tile directly to shared framebuffer."
  (:require
   [raytracer.vec3 :as v]
   [raytracer.camera :as cam]
   [raytracer.render :as render]))

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

(defn ^:export render-tile!
  "Render a single tile directly into shared framebuffer.
   Uses swap! to access the SAB-backed framebuffer for cross-worker visibility."
  [app-state tile-idx tile-w tile-h img-w img-h spp]
  (swap! app-state
    (fn [state]
      (let [{:keys [spheres materials camera-opts]} (unpack-scene state)
            camera (cam/make-camera camera-opts)
            framebuffer (:framebuffer state)]
        ;; Render directly into the SAB-backed framebuffer
        (render/render-tile-to-framebuffer! tile-idx tile-w tile-h img-w img-h spp
                                             framebuffer camera spheres materials))
      ;; Return state unchanged - we only mutated the framebuffer contents
      state))
  tile-idx)
