(ns in-mesh.shadow.screen
  (:require
   [in-mesh.core :as mesh :refer [in]]))

(println ::hi-from-in-mesh-shadow)

(comment

  (println :hi)
  mesh/init-data
  (def s1 (mesh/spawn {:x 1}))

  s1

  (in s1 (println :hi :from (:id mesh/init-data)))

  :end)

(defn -main []
  (println ::screen))
