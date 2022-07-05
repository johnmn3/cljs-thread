(require '[cljs.build.api :as api])

(api/build "src"
           {:target :webworker
            :main 'in-mesh.core
            :output-to "main.js"})