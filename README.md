# in.mesh

`in.mesh` makes it easy to spawn webworkers. It wants to make it easier to use one webworker codebase across different build tools.

It also tries to make it easier communicate between webworkers. This library is a very early alpha, released to help get feedback from tool builders and folks that want to help define the API.

More docs will be forthcoming, but there's a bit of a runthrough in the `/figwheel/src/in_mesh/figwheel/root.cljs` and I'll just copy it here for now:

```clojure
(ns in-mesh.figwheel.root
  (:require
  ;;  [figwheel.repl :as repl :refer [connect focus conns]]
   [in-mesh.core :as mesh :refer [in]]))

(enable-console-print!)

(comment
  
  ;; what node are we in?
  mesh/init-data ;=> {:id :root}

  ;; let's make a new one
  (def s1 (mesh/spawn {:x 1}))
  s1 ;=> "id/d37f262d-1566-45ad-9904-da671bb0cc9c"

  (in s1 (println :hi :from (:id mesh/init-data)))
  ; in console:=> :hi :from id/d37f262d-1566-45ad-9904-da671bb0cc9c

  ;; let's make a top level var
  (def my-name :bob)

  ;; s1 doesn't have access to it
  (in s1 (println :hi my-name :from (:id mesh/init-data)))
  ; in console:=> :hi nil :from id/d37f262d-1566-45ad-9904-da671bb0cc9c

  ;; convey the bindings with a conveyance vector
  (in s1 [my-name] (println :hi my-name :from (:id mesh/init-data)))
  ; in console:=> :hi bob :from id/d37f262d-1566-45ad-9904-da671bb0cc9c

  ;; `in` automatically conveys local bindings
  (let [my-name my-name]
   (in s1 (println :hi my-name :from (:id mesh/init-data))))
  ; in console:=> :hi bob :from id/d37f262d-1566-45ad-9904-da671bb0cc9c

  ;; what about chaining them?
  (def s2 (mesh/spawn {:x 2}))
  s2 ;=> ""id/c46b23d5-4170-4e2a-b255-0bcf6ee46585""


  (in s1
      [s2 my-name]
      (println :hi my-name :from (:id mesh/init-data))
      (in s2
          (println :hi my-name :from (:id mesh/init-data))))
  ; in console:=> :hi bob :from id/d37f262d-1566-45ad-9904-da671bb0cc9c
  ;               :hi bob :from id/c46b23d5-4170-4e2a-b255-0bcf6ee46585

  ;; same thing with locals
  (let [s2 s2 my-name my-name]
    (in s1
        (println :hi my-name :from (:id mesh/init-data))
        (in s2
            (println :hi my-name :from (:id mesh/init-data)))))
  ; in console:=> :hi bob :from id/d37f262d-1566-45ad-9904-da671bb0cc9c
  ;               :hi bob :from id/c46b23d5-4170-4e2a-b255-0bcf6ee46585

  :end)

;; if we define the var at the top level and save the file, causing the builds to releod
;;   then all environments will have access to `my-name` and we'll no longer have to convey it

;; uncomment `my-name` and save
(def my-name :bob) ; <- now save file and the name will will be accessible from all envs

(comment

  (let [s2 s2]
    (in s1
        (println :hi my-name :from (:id mesh/init-data))
        (in s2
            (println :hi my-name :from (:id mesh/init-data)))))
  ; in console:=> :hi bob :from id/d37f262d-1566-45ad-9904-da671bb0cc9c
  ;               :hi bob :from id/c46b23d5-4170-4e2a-b255-0bcf6ee46585
  ; WARNING: Use of undeclared Var in-mesh.figwheel.root/s2 at line 1 <cljs repl>
  ; WARNING: Use of undeclared Var in-mesh.figwheel.root/s1 at line 2 <cljs repl>

  ;; it worked, but on some level after reload, figwheel forgets that we still have
  ;;  access to the vars.

  ;; let's try function bindings
  (defn print-in [id some-name]
    (let [get-name #(name %)]
      (in id (println :hi (get-name some-name)))))
  
  (print-in s1 :bob)
  ;; console:=> :hi bob

  ;; we conveyed both some-name and the get-name function over to the worker

  :end)
```

`in.mesh` is derived from [`tau.alpha`](https://github.com/johnmn3/tau.alpha) which I released about four years ago. That project evolved towards working with SharedArrayBuffers (SABs).

This project extracts out the non-SAB parts of `tau.alpha`. When you spawn a node in `in.mesh`, it automatically creates connections to all other nodes, creating a fully connected mesh.

The `in` macro abstracts over the message passing infrastructure, allowing you to do work on threads in a manner similar to what you would experience with threads.

`tau.alpha` has blocking semantics, allowing you to code without callbacks. That depends on SABs to work though. At an early point during the development of `tau.alpha`, I got blocking semantics to work with synchronous XHRs and hacking the response from a sharedworker. I'm going to try to get that working again here, so you can get a similar feel without SABs.

Unfortunately, SABs require very constraining security settings, making their usage impractical for some deployment situations. You'll never get the same performance here, in terms of worker-to-worker communication - you're actually using shared memory - but there's no reason these other features shouldn't be available in non-SAB scenarios, so I think it makes sense to extract these bits out and build V2 of `tau.alpha` on top of it. Hopefully this will be useful for others as well.
