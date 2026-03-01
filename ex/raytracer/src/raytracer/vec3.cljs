(ns raytracer.vec3
  "Vec3 math for ray tracing.
   All vectors are #js [x y z] Float64 JS arrays — zero allocation overhead
   in the hot path. Pure functions, no side effects.")

(defn vec3 ^js [^number x ^number y ^number z]
  #js [x y z])

(defn vec3-x ^number [^js v] (aget v 0))
(defn vec3-y ^number [^js v] (aget v 1))
(defn vec3-z ^number [^js v] (aget v 2))

(defn add ^js [^js a ^js b]
  #js [(+ (aget a 0) (aget b 0))
       (+ (aget a 1) (aget b 1))
       (+ (aget a 2) (aget b 2))])

(defn sub ^js [^js a ^js b]
  #js [(- (aget a 0) (aget b 0))
       (- (aget a 1) (aget b 1))
       (- (aget a 2) (aget b 2))])

(defn mul ^js [^js a ^js b]
  #js [(* (aget a 0) (aget b 0))
       (* (aget a 1) (aget b 1))
       (* (aget a 2) (aget b 2))])

(defn scale ^js [^js v ^number t]
  #js [(* (aget v 0) t)
       (* (aget v 1) t)
       (* (aget v 2) t)])

(defn div ^js [^js v ^number t]
  (let [inv (/ 1.0 t)]
    #js [(* (aget v 0) inv)
         (* (aget v 1) inv)
         (* (aget v 2) inv)]))

(defn dot ^number [^js a ^js b]
  (+ (* (aget a 0) (aget b 0))
     (* (aget a 1) (aget b 1))
     (* (aget a 2) (aget b 2))))

(defn cross ^js [^js a ^js b]
  #js [(- (* (aget a 1) (aget b 2)) (* (aget a 2) (aget b 1)))
       (- (* (aget a 2) (aget b 0)) (* (aget a 0) (aget b 2)))
       (- (* (aget a 0) (aget b 1)) (* (aget a 1) (aget b 0)))])

(defn length-sq ^number [^js v]
  (+ (* (aget v 0) (aget v 0))
     (* (aget v 1) (aget v 1))
     (* (aget v 2) (aget v 2))))

(defn length ^number [^js v]
  (js/Math.sqrt (length-sq v)))

(defn normalize ^js [^js v]
  (div v (length v)))

(defn negate ^js [^js v]
  #js [(- (aget v 0)) (- (aget v 1)) (- (aget v 2))])

(defn reflect ^js [^js v ^js n]
  (sub v (scale n (* 2.0 (dot v n)))))

(defn refract ^js [^js uv ^js n ^number etai-over-etat]
  (let [cos-theta (min (- (dot uv n)) 1.0)
        r-out-perp (scale (add uv (scale n cos-theta)) etai-over-etat)
        r-out-parallel (scale n (- (js/Math.sqrt
                                     (js/Math.abs (- 1.0 (length-sq r-out-perp))))))]
    (add r-out-perp r-out-parallel)))

(defn near-zero? [^js v]
  (let [s 1e-8]
    (and (< (js/Math.abs (aget v 0)) s)
         (< (js/Math.abs (aget v 1)) s)
         (< (js/Math.abs (aget v 2)) s))))

(defn rand-vec3 ^js []
  #js [(js/Math.random) (js/Math.random) (js/Math.random)])

(defn rand-vec3-range ^js [^number mn ^number mx]
  (let [r (- mx mn)]
    #js [(+ mn (* (js/Math.random) r))
         (+ mn (* (js/Math.random) r))
         (+ mn (* (js/Math.random) r))]))

(defn rand-in-unit-sphere ^js []
  (loop []
    (let [p (rand-vec3-range -1.0 1.0)]
      (if (< (length-sq p) 1.0)
        p
        (recur)))))

(defn rand-unit-vector ^js []
  (normalize (rand-in-unit-sphere)))

(defn rand-in-unit-disk ^js []
  (loop []
    (let [p #js [(- (* 2.0 (js/Math.random)) 1.0)
                 (- (* 2.0 (js/Math.random)) 1.0)
                 0.0]]
      (if (< (length-sq p) 1.0)
        p
        (recur)))))
