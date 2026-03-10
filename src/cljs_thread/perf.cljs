(ns cljs-thread.perf
  "Performance logging infrastructure for cljs-thread benchmarking.

   Disabled by default — zero cost in production. Enable from test pages
   or Playwright specs via (cljs-thread.perf/enable!) or page.evaluate.

   All instrumented code guards on @perf-logging? before doing any work.
   bench-log emits [bench] JSON lines to the worker console so Playwright
   can collect them via page.on('worker', w => w.on('console', ...)).")

(defonce ^:private perf-logging? (atom false))

(defn enable!  [] (reset! perf-logging? true))
(defn disable! [] (reset! perf-logging? false))
(defn enabled? [] @perf-logging?)

(defn bench-log
  "Emit a [bench] JSON line to the console. No-op when perf logging is disabled.
   data should be a CLJS map; it is converted to JS and JSON-serialized.
   Listeners filter on the '[bench] ' prefix and parse the JSON suffix."
  [data]
  (when @perf-logging?
    (js/console.log (str "[bench] " (js/JSON.stringify (clj->js data))))))
