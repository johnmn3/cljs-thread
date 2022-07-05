(ns in-mesh.figwheel.screen
  (:require
   [in-mesh.core :as mesh :refer [in]]))

(enable-console-print!)

(comment

  (def s1 (mesh/spawn {:x 1}))

  s1

  (in s1 (println :hi :from (:id mesh/init-data)))

  :end)
