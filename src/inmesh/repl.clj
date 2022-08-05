(ns inmesh.repl
  (:require
   [inmesh.macro-impl :as i]))

(defmacro dbg [& x]
  (let [afn `(fn [] ~@x)]
    `(inmesh.repl/do-dbg ~afn)))

(defmacro break [& x]
  (let [names (vec (keys (:locals &env)))
        symvals (zipmap (map (fn [sym] `(quote ~sym)) (mapv symbol names)) names)
        opts (if (map? (first x)) (first x) {})]
    `(inmesh.repl/do-break ~symvals ~opts (fn ~names ~@x))))

(defmacro in? [& x]
  (let [[syms body] (if (and (second x) (vector? (first x)))
                      [(first x) `~(second x)]
                      [(i/get-symbols x) `(do ~@x)])]
    `(inmesh.repl/dbg-> '~syms (fn ~syms ~body))))
