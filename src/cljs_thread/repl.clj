(ns cljs-thread.repl
  (:require
   [cljs-thread.macro-impl :as i]))

(defmacro dbg [& x]
  (let [afn `(fn [] ~@x)]
    `(cljs-thread.repl/do-dbg ~afn)))

(defmacro break [& x]
  (let [names (vec (keys (:locals &env)))
        symvals (zipmap (map (fn [sym] `(quote ~sym)) (mapv symbol names)) names)
        opts (if (map? (first x)) (first x) {})]
    `(cljs-thread.repl/do-break ~symvals ~opts (fn ~names ~@x))))

(defmacro in? [& x]
  (let [[syms body] (if (and (second x) (vector? (first x)))
                      [(first x) `~(second x)]
                      [(i/get-symbols x) `(do ~@x)])]
    `(cljs-thread.repl/dbg-> '~syms (fn ~syms ~body))))
