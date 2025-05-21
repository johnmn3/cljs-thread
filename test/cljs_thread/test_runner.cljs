(ns cljs-thread.test-runner
  (:require [cljs.test :refer-macros [run-tests]]
            [cljs-thread.core-test])) ; Ensure tests from core-test are loaded

(defn -main [& args]
  (let [summary (run-tests 'cljs-thread.core-test)
        failures (:fail summary)
        errors (:error summary)]
    (println "\nTest Summary:")
    (println "  Ran:" (:test summary) "tests")
    (println "  Assertions:" (:pass summary) "passed," (:fail summary) "failed.")
    (println "  Errors:" (:error summary))
    (if (and (zero? failures) (zero? errors))
      (do
        (println "\nAll tests passed.")
        (js/process.exit 0))
      (do
        (println "\nSome tests failed or an error occurred.")
        (js/process.exit 1)))))
