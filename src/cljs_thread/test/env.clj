(ns cljs-thread.test.env
  "Environment launchers for running compiled test builds.

   Each environment type (:node, :playwright, :browser) is a multimethod
   that knows how to execute a compiled JS test bundle and collect results.

   Extensible: downstream users can add custom environments (e.g., :jsdom)."
  (:require [clojure.string :as str]))

;; ---------------------------------------------------------------------------
;; Process helpers
;; ---------------------------------------------------------------------------

(defn run-process!
  "Run a process, streaming stdout/stderr to this process's stdout/stderr.
   Returns the exit code."
  [& args]
  (let [pb (ProcessBuilder. ^java.util.List (vec args))]
    (.inheritIO pb)
    (.directory pb (java.io.File. (System/getProperty "user.dir")))
    (let [proc (.start pb)]
      (.waitFor proc))))

(defn start-process!
  "Start a background process. Returns the Process object."
  [& args]
  (let [pb (ProcessBuilder. ^java.util.List (vec args))]
    (.inheritIO pb)
    (.directory pb (java.io.File. (System/getProperty "user.dir")))
    (.start pb)))

(defn wait-for-port!
  "Poll until a TCP port is accepting connections (max ~10s).
   Returns true if port is ready, false on timeout."
  [port]
  (loop [n 0]
    (when (< n 50)
      (if (try
            (let [s (java.net.Socket.)]
              (.connect s (java.net.InetSocketAddress. "localhost" (int port)) 200)
              (.close s)
              true)
            (catch Exception _ false))
        true
        (do (Thread/sleep 200)
            (recur (inc n)))))))

;; ---------------------------------------------------------------------------
;; Environment launcher multimethod
;; ---------------------------------------------------------------------------

(defmulti launch-env
  "Launch a test environment. Returns the exit code.

   Dispatches on env-type keyword:
     :node       - run via Node.js
     :playwright - run headless via Playwright
     :browser    - serve and wait for manual browser testing"
  (fn [env-type _config] env-type))

(defmethod launch-env :node
  [_ {:keys [output-js args]}]
  (apply run-process! (into ["node" output-js] (or args []))))

(defmethod launch-env :playwright
  [_ {:keys [serve-mode port output-js suite]}]
  (let [server (start-process! "node" "test/e2e/serve.js" (or serve-mode "thread-test-browser"))]
    (try
      (wait-for-port! (or port 9110))
      (run-process! "node" "test/e2e/thread-test-run.js"
                    (or suite "all") (str (or port 9110)))
      (finally
        (.destroyForcibly server)))))

(defmethod launch-env :browser
  [_ {:keys [serve-mode port suite]}]
  (let [server (start-process! "node" "test/e2e/serve.js" (or serve-mode "thread-test-browser"))]
    (wait-for-port! (or port 9110))
    (println)
    (println "=== Browser tests ready ===")
    (println (str "Open: http://localhost:" (or port 9110) "?suite=" (or suite "all")))
    (println "Press Ctrl+C to stop the server.")
    (println)
    (.waitFor server)
    0))
