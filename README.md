# `cljs-thread`: `spawn`, `in`, `future`, `pmap`, `pcalls`, `pvalues` and `=>>`

## _"One step closer to threads on the web"_

`cljs-thread` brings familiar threading primitives to ClojureScript — both in the browser (Web Workers) and on Node.js (worker_threads). Zero configuration required.

```clojure
(ns my-app.screen
  (:require [cljs-thread.core :as thread :refer [spawn in future pmap =>>]]))

(thread/init!)  ;; auto-detects everything

@(future (+ 1 2 3))
;=> 6
```

When you `spawn` a node, it automatically creates connections to all the other nodes, forming a fully connected mesh. The `in` macro abstracts over message passing with implicit binding conveyance and blocking semantics, allowing you to work with threads in a manner similar to Clojure on the JVM. `cljs-thread` provides `future`, `pmap`, `pcalls`, `pvalues`, and the parallel transducer macro `=>>`.

## Getting Started

### deps.edn
Place the following in the `:deps` map of your `deps.edn` file:
```
...
net.clojars.john/cljs-thread {:mvn/version "0.1.0-alpha.4"}
...
```

### Build Tools

#### Shadow-cljs

The simplest setup is a single-module build:
```clojure
{:builds
 {:app
  {:target     :browser
   :output-dir "resources/public/js"
   :modules    {:app {:init-fn my-app.screen/init!}}}}}
```

For larger applications, a code-split build separates the screen (main thread) from worker code:
```clojure
{:builds
 {:app
  {:target     :browser
   :output-dir "resources/public/js"
   :modules
   {:shared {:entries []}
    :screen {:init-fn    my-app.screen/init!
             :depends-on #{:shared}}
    :core   {:init-fn    my-app.core/init!
             :depends-on #{:shared}
             :web-worker true}}}}}
```

For the best separation, you can provide a dedicated `:cljs-thread` kernel module. This bundles the cljs-thread runtime into a standalone artifact that the library auto-detects:
```clojure
{:builds
 {:app
  {:target     :browser
   :output-dir "resources/public/js"
   :modules
   {:cljs-thread {:entries [cljs-thread.core]}
    :shared      {:entries []
                  :depends-on #{:cljs-thread}}
    :screen      {:init-fn    my-app.screen/init!
                  :depends-on #{:shared}}
    :core        {:init-fn    my-app.core/init!
                  :depends-on #{:shared :cljs-thread}
                  :web-worker true}}}}}
```

By having a `:screen` module, you can more easily separate your "main thread" code from your web worker code. Having a separate service worker artifact (`:sw`) is optional — it's only needed if you can't use COOP/COEP headers (see [Deployment](#deployment)).

The sub-project in this repo — `shadow_dashboard` — has an example project with a working build config that you can use as a reference.

To launch the project in Calva, type `shift-cmd-p` and choose _"Start a Project REPL and Connect"_ and then enable the build options that come up. You can choose which build your are connected to by typing `shift-cmd-p` and choosing _"Select CLJS Build Connection"_.

#### Figwheel
There currently isn't a figwheel build configuration example provided in this repo, but I've had prior versions of this library working on figwheel and I'm hoping to have examples here soon. Please submit a PR if you get a great build configuration similar to the one above for shadow.

#### cljs.main
A solid set of directions for getting this working with the default `cljs.main` build tools is forthcoming — PRs welcome!

### `cljs-thread.core/init!`

`init!` supports zero-config usage — it auto-detects your build output and configures everything:

```clojure
(thread/init!)  ;; zero-config: auto-detect everything
```

Under the hood, `init!` will:
1. Detect your worker script from `manifest.edn` (shadow-cljs writes this to your `:output-dir`)
2. Auto-install the fat kernel strategy when `SharedArrayBuffer` is available — workers boot instantly from blob URLs with the full runtime inlined, no Service Worker needed
3. Auto-detect loadable modules for on-demand code loading

You can also provide explicit configuration if needed:
```clojure
(thread/init!
 {:core-connect-string "/core.js"})  ;; explicit worker script path
```

Or use the legacy Service Worker mode for environments without COOP/COEP headers:
```clojure
(thread/init!
 {:sw-connect-string "/sw.js"
  :core-connect-string "/core.js"})
```

Configuration options:
| Key | Description |
|-----|-------------|
| `:core-connect-string` | Path to worker script (auto-detected from manifest.edn) |
| `:sw-connect-string` | Path to Service Worker script (enables SW sync mode) |
| `:repl-connect-string` | Path to REPL worker script |
| `:loadable-modules` | Vector of module URLs for catch-and-load |

### Node.js

`cljs-thread` works on Node.js using `worker_threads` with eval workers. Setup is the same:

```clojure
;; shadow-cljs.edn
{:builds
 {:app
  {:target    :node-script
   :output-to "target/app.js"
   :main      my-app.core/main}}}
```

```clojure
(ns my-app.core
  (:require [cljs-thread.core :as thread :refer [spawn in future pmap]]))

(defn main []
  (thread/init!)
  @(future (+ 1 2 3))  ;=> 6
  (println "done"))
```

The same `spawn`, `in`, `future`, `pmap`, and `=>>` primitives work identically.

## How It Works

`cljs-thread` uses a **fat kernel** architecture: when `init!` is called, it detects the compiled build output and caches the source. Every worker is created from this cached source — a blob URL (browser) or eval string (Node) — with the full cljs-thread runtime inlined. Workers wake up immediately functional, able to process `in`, `future`, `pmap`, sync, and mesh messaging without any additional loading.

**Blocking semantics** are provided by `SharedArrayBuffer` + `Atomics.wait` (preferred) or a Service Worker fallback. SAB sync requires cross-origin isolation headers (see [Deployment](#deployment)).

**Catch-and-load**: when a worker evaluates code that references app-specific vars not in the kernel, it catches the `ReferenceError` and transparently loads the required module on demand.

**Worker mesh**: `spawn` creates workers that automatically connect to all other active workers, forming a fully connected mesh. The `in` macro routes execution to any worker by reference or `:id`.

## Demo
https://johnmn3.github.io/cljs-thread/

The `shadow-dashboard` example project contains a standard dashboard demo built on re-frame/mui-v5/comp.el/sync-IndexedDB, with application logic (reg-subs & reg-event functions) moved into a webworker, where only react rendering is handled on the screen thread, allowing for buttery-smooth components backed by large data transformations in the workers.

<img width="1298" alt="Screen Shot 2022-07-30 at 5 46 23 PM" src="https://user-images.githubusercontent.com/127271/181997138-66025f77-7d87-45b1-9697-73d5c7d77e26.png">

## `spawn`
There are a few ways you can `spawn` a worker.

_No args_:
```clojure
(def s1 (spawn))
```
This will create a worker and you'll be able to do something with it afterwards.

_Only a body_:
```clojure
(spawn (println :addition (+ 1 2 3)))
;:addition 6
```
This will create a worker, run the code in it (presumably for side effects) and then terminate the worker. This is considered an _ephemeral worker_.

_Named worker_:
```clojure
(def s2 (spawn {:id :s2} (println :hi :from thread/id)))
;:hi :from :s2
```
This creates a worker named `:s2` and you'll be able to do something with `s2` afterwards.

_Ephemeral deref_:
```clojure
(println :ephemeral :result @(spawn (+ 1 2 3)))
;:ephemeral :result 6
```
In workers, `spawn` returns a derefable, which returns the body's return value. In the main/screen thread, it returns a promise:
```clojure
(-> @(spawn (+ 1 2 3))
    (.then #(println :ephemeral :result %)))
;:ephemeral :result 6
```
> Note: The deref (`@(spawn...`) forces the result to be resolved for `.then`ing. Choosing not to deref on the main thread, as with on workers, implies the evaluation is side effecting and that we don't care about returning the result.

In a worker, you can force the return of a promise with `(spawn {:promise? true} (+ 1 2 3))` if you'd rather treat it like a promise:
```clojure
(-> @(js/Promise.all #js [(spawn {:promise? true} 1) (spawn {:promise? true} 2)])
    (.then #(println :res (js->clj %))))
;:res [1 2]
```
`spawn` has more features, but they mostly match the features of `in` and `future` which we'll go over below. `spawn` has a startup cost that we don't want to have to pay all the time, so you should use it sparingly.
## `in`
Now that we have some workers, let's do some stuff `in` them:
```clojure
(in s1 (println :hi :from :s1))
;:hi :from :s1
```
We can also make chains of execution across multiple workers:
```clojure
(in s1
    (println :now :we're :in :s1)
    (in s2
        (println :now :we're :in :s2 :through :s1)))
;:now :we're :in :s1
;:now :we're :in :s2 :through :s1
```
You can also deref the return value of `in`:
```clojure
@(in s1 (+ 1 @(in s2 (+ 2 3))))
;=> 6
```
### Binding conveyance
For most functions, `cljs-thread` will try to automatically convey local bindings, as well as vars local to the invoking namespace, across workers:
```clojure
(let [x 3]
    @(in s1 (+ 1 @(in s2 (+ 2 x)))))
;=> 6
```
That works for both symbols bound to the local scope of the form and to top level defs of the current namespace. So this will work:
```clojure
(def x 3)
@(in s1 (+ 1 @(in s2 (+ 2 x))))
```
Some things however cannot be transmitted. This will not work:
```clojure
(def y (atom 3))
@(in s1 (+ 1 @(in s2 (+ 2 @y))))
```
Atoms will not be serialized. That would break the identity semantics that atoms provide. If the current namespace is being shared between both sides of the invocation and you want to reference an atom that lives on the remote side without conveying the local one, you can either:
- Define it in another namespace, so the local version is not conveyed (it's not a bad idea to define stateful things in a special namespace anyway); or
- Declare the invocation with `:no-globals?` like `@(in s1 {:no-globals? true} (+ 1 @(in s2 (+ 2 @y))))`. This way, you can have `y` defined in the same namespace on both ends of the invocation but you'll be explicitly referencing the one on the remote side; or
- Use an explicit conveyence vector that does not include the local symbol, like `@(in s1 [s2] (+ 1 @(in s2 (+ 2 @y))))`. Using explicit conveyance vectors disables implicit conveyance altogether.

As mentioned above, you can also explicity define a _conveyance vector_:
```clojure
@(in s1 [x s2] (+ 1 @(in s2 (+ 2 x))))
;=> 6
```
Here, `[x s2]` declares that we want to pass `x` (here defined as `3`) through to `s2`. We don't need to declare it again in `s2` because now it is implicitly conveyed as it is in the local scope of the form.

We could also avoid passing `s2` by simpling referencing it by its `:id`:
```clojure
@(in s1 [x] (+ 1 @(in :s2 (+ 2 x))))
;=> 6
```
However, you can't mix both implicit and explicit binding conveyance:
```clojure
(let [z 3]
  @(in s1 [x] (+ 1 @(in :s2 (+ x z)))))
;=> nil
```
Rather, this would work:
```clojure
(let [z 3]
  @(in s1 [x y] (+ 1 @(in :s2 (+ x z)))))
;=> 7
```
The explicit conveyance vector is essentially your escape hatch, for when the simple implicit conveyance isn't enough or is too much.
### `yield`

When you want to convert an async javascript function into a synchronous one, `yield` is especially useful:
```clojure
(->> @(in s1 (-> (js/fetch "http://api.open-notify.org/iss-now.json")
                 (.then #(.json %))
                 (.then #(yield (js->clj % :keywordize-keys true)))))
     :iss_position
     (println "ISS Position:"))
;ISS Position: {:latitude 44.4403, :longitude 177.0011}
```
> Note: binding conveyance and `yield` also work with `spawn`
> ```clojure
> (let [x 6]
>   @(spawn (yield (+ x 2)) (println :i'm :ephemeral)))
> ;:i'm :ephemeral
> ;=> 8
>```
> You can also nest spawns
>```clojure
> @(spawn (+ 1 @(spawn (+ 2 3))))
> ;=> 6
>```
> But that will take longer due to worker startup delay, so make sure that your work is truly heavy and ephemeral.

> Also note: You can use `yield` to temporarily prevent the closing of an ephemeral `spawn` as well:
>```clojure
> @(spawn (js/setTimeout
>          #(yield (println :finally!) (+ 1 2 3))
>          5000))
> ;:finally!
> ;=> 6
>```
> Where `6` took 5 seconds to return - handy for async tasks in ephemeral workers.
## `future`
You don't have to create new workers though. `cljs-thread` comes with a thread pool of workers which you can invoke `future` on. Once invoked, it will grab one of the available workers, do the work on it and then free it when it's done.
```clojure
(let [x 2]
  @(future (+ 1 @(future (+ x 3)))))
;=> 6
```

Again, all of these constructs return promises on the main/screen thread:
```clojure
(-> @(future (-> (js/fetch "http://api.open-notify.org/iss-now.json")
                 (.then #(.json %))
                 (.then #(yield (js->clj % :keywordize-keys true)))))
    (.then #(println "ISS Position:" (:iss_position %))))
;ISS Position: {:latitude 45.3612, :longitude -110.6497}
```
You wouldn't want to do this for such a lite-weight api call, but if you have some large payloads that you need fetched and normalized, it can be convenient to run them in futures for handling off the main thread.

`cljs-thread`'s blocking semantics are great for achieving synchronous control flow when you need it. You wouldn't want to use them in very hot loops or for implementing tight algorithms. We can beat single threaded performance though if we're smart about chunking work up into large pieces and fanning it across a pool of workers. You can design your own system for doing that, but `cljs-thread` comes with a solution for pure functions: `=>>`. It also comes with a version of `pmap`. (see the official [`clojure.core/pmap`](https://clojuredocs.org/clojure.core/pmap) for more info)

## `pmap`
`pmap` lazily consumes one or more collections and maps a function across them in parallel.
```clojure
(def z inc)
(let [i +]
  (->> [1 2 3 4]
       (pmap (fn [x y] (pr :x x :y y) (z (i x y))) [9 8 7 6])
       (take 2)))
;:x 9 :y 1
;:x 8 :y 2
;=> (11 11)
```
Taking an example from clojuredocs.org:
```clojure
;; A function that simulates a long-running process by calling thread/sleep:
(defn long-running-job [n]
    (thread/sleep 1000) ; wait for 1 second
    (+ n 10))

;; Use `doall` to eagerly evaluate `map`, which evaluates lazily by default.

;; With `map`, the total elapsed time is just over 4 seconds:
user=> (time (doall (map long-running-job (range 4))))
"Elapsed time: 4012.500000 msecs"
(10 11 12 13)

;; With `pmap`, the total elapsed time is just over 1 second:
user=> (time (doall (pmap long-running-job (range 4))))
"Elapsed time: 1021.500000 msecs"
(10 11 12 13)
```
## `=>>`
[`injest`](https://github.com/johnmn3/injest) is a library that makes it easier to work with transducers. It provides a `x>>` macro for Clojure and Clojurescript that converts thread-last macros (`->>`) into transducer chains. For Clojure, it provides a `=>>` variant that also parallelizes the transducers across a fork-join pool with `r/fold`. However, because we've been lacking blocking semantics in the browser, it was unable to provide the same macro to Clojurescript.

`cljs-thread` provides the auto-transducifying, auto-parallelizing `=>>` macro that `injest` was missing.

So, suppose you have some non-trivial work:
```clojure
(defn flip [n]
  (apply comp (take n (cycle [inc dec]))))
```
On a single thread, in Chrome, this takes between 16 and 20 seconds (on this computer):
```clojure
(->> (range)
     (map (flip 100))
     (map (flip 100))
     (map (flip 100))
     (take 1000000)
     (apply +)
     time)
```
On Safari and Firefox, that will take between 60 and 70 seconds.

Let's try it with `=>>`:
```clojure
(=>> (range)
     (map (flip 100))
     (map (flip 100))
     (map (flip 100))
     (take 1000000)
     (apply +)
     time)
```
On Chrome, that'll take only about 8 to 10 seconds. On Safari it takes about 30 seconds and in Firefox it takes around 20 seconds.

So in Chrome and Safari, you can roughly double your speed and in Firefox you can go three or more times faster.

By changing only one character, we can double or triple our performance, all while leaving the main thread free to render at 60 frames per second. Notice also how it's lazy :)

> Note: On the main/screen thread, `=>>` returns a promise. `=>>` defaults to a chunk size of 512.

## Stepping debugger

The blocking semantics that `cljs-thread` provides open up the doors to a lot of things that weren't possible in Clojurescript/Javascript and the browser in general. One of these things is a stepping debugger in the runtime (outside of the JS console debugger). `cljs-thread` ships with a simple example of a stepping debugger:
```clojure
(dbg
 (let [x 1 y 3 z 5]
   (println :starting)
   (dotimes [i z]
     (break (= i y))
     (println :i i))
   (println :done)
   x))
;:starting
;:i 0
;:i 1
;:i 2
;=> :starting-dbg
```
`dbg` is a convenience macro for sending a form to a debug worker that is constantly listening for new forms to evaluate for the purpose of debugging. `break` stops the execution from running beyond a particular location in the code. It also takes an optional form that defines _when_ the `break` should stop the execution. Upon entering the break, the debugger enters a sub-loop, waiting for forms which can inspect the local variables of the form in the context of the `break`.

The `in?` macro allows you to send forms to the `break` context within the debugger:
```clojure
(in? z)
;=> 5
(in? i)
;=> 3
(in? [i x y z])
;=> [3 1 3 5]
(in? [z y x])
;=> [5 3 1]
(in? a)
;=> nil
```
For forms that have symbols that are not locally bound variables in the remote form, you must declare an explicit conveyance vector containing the variables that should be referenced:
```clojure
(in? [x i] (+ x i))
;=> 4
```
The `in?` macro above cannot know ahead of time that the form in the `dbg` instance hasn't locally re-bound the `+` symbol. Therefore, for non-simple forms, the conveyance vector is necessary to disambiguate which symbols require resolving in the local context of the remote form and which don't.

By evaluating `:in/exit`, the running break context exits and the execution procedes to either the next break or until completion.
```clojure
(in? :in/exit)
;:i 3
;:i 4
;:done
;=> 1
```

This is just a rudimentary implementation of a stepping debugger. I've added keybindings for usage in Calva.

It would be nice to implement a sub-repl that wrapped repl evaluations in the `in?` macro until exit. It would also be nice to implement an nrepl middle where for the same thing, transparently filling in the missing bits for cider's debugging middleware, such that editors like emacs and calva can automatically use their debugging workflows in a Clojurescript context. There's [a github issue for this feature](https://github.com/clojure-emacs/cider/issues/1416) in the cider repo and it would be nice to finally be able to unlock this capability for browser development. PRs welcome!

> Note: There are a host of other use cases that weren't previously possible that become possible with blocking semantics. Another example might be porting Datascript to IndexedDB using a synchronous set/get interface. If there are any other possibilities that come to mind - things you've always wanted to be able to do but weren't able to due to the lack of blocking semantics in the browser - feel free to drop a request in the issues and we can explore it.

## Deployment

### Cross-Origin Isolation Headers

For the best experience, serve your application with cross-origin isolation headers. These enable `SharedArrayBuffer`, which `cljs-thread` uses for fast blocking semantics without a Service Worker:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

**Express:**
```javascript
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});
```

**Nginx:**
```nginx
add_header Cross-Origin-Opener-Policy "same-origin" always;
add_header Cross-Origin-Embedder-Policy "require-corp" always;
```

### Service Worker Fallback

If you can't set COOP/COEP headers (e.g., embedding in third-party pages), `cljs-thread` falls back to using a Service Worker for blocking semantics. Add a `:sw` build target and pass `:sw-connect-string` to `init!`:

```clojure
;; shadow-cljs.edn — add SW build
{:builds
 {:sw {:target     :browser
       :output-dir "resources/public/js"
       :modules    {:sw {:entries [cljs-thread.sw]
                         :web-worker true}}}
  ;; ... your app build ...
  }}
```

```clojure
(thread/init!
 {:sw-connect-string "/js/sw.js"
  :core-connect-string "/js/core.js"})
```

## Platform Support

| Platform | Sync Mechanism | Notes |
|----------|---------------|-------|
| Chrome/Edge | SharedArrayBuffer + Atomics | Full support with COOP/COEP headers |
| Firefox | SharedArrayBuffer + Atomics | Full support with COOP/COEP headers |
| Safari | Service Worker fallback | SAB restricted in workers |
| Node.js | SharedArrayBuffer + Atomics | Full support, no headers needed |

## Some history

`cljs-thread` is derived from [`tau.alpha`](https://github.com/johnmn3/tau.alpha) which I released about four years ago. That project evolved towards working with SharedArrayBuffers (SABs). A slightly update version of `tau.alpha` is available here: https://gitlab.com/johnmn3/tau and you can see a demo of the benefits of SABs here: https://simultaneous.netlify.app/

At an early point during the development of `tau.alpha` about four years ago, I got blocking semantics to work with these synchronous XHRs and hacking the response from a sharedworker. I eventually abandoned this strategy when I discovered you could get blocking semantics and better performance out of SABs and `js/Atomics`.

Unfortunately there was lot's of drama around the security of SABs and, years later, they require very constraining security settings, making their usage impractical for some deployment situations. Compared to using typed arrays in `tau.alpha`, you'll never get that same performance in `cljs-thread`, in terms of worker-to-worker communication - in `tau.alpha` you're literally using shared memory - but there's no reason these other features shouldn't be available in non-SAB scenarios, so I figured it would make sense to extract these other bits out into `cljs-thread` and build V2 of `tau.alpha` on top of it. With `tau.beta`, built on `cljs-thread`, I'll be implementing SAB-less variants of `atom`s and `agent`s, with similar semantics to that of Clojure's. Then I'll be implementing SAB-based versions that folks can opt in to if desired.

The fat kernel architecture represents the culmination of this work — workers now boot with the full runtime inlined, eliminating the two-phase boot, Service Worker dependency, and manual configuration that characterized earlier versions. `(thread/init!)` with zero arguments is all you need.
