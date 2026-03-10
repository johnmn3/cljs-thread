# Worker Environment & Introspection

Every thread in `cljs-thread` has an identity and context. The `env` and `id` modules let you detect which worker you're running in and branch accordingly.

## Thread Identity

```clojure
(require '[cljs-thread.core :as t])

t/id  ;=> :core, :root, :screen, :fp-0, :injest-2, :my-worker, etc.
```

`t/id` returns the keyword identifier of the current worker. It's set at worker creation time and never changes.

## Environment Predicates

```clojure
(require '[cljs-thread.env :as e])

(e/in-screen?)   ;=> true on the main/UI thread
(e/in-root?)     ;=> true on the root coordinator worker
(e/in-core?)     ;=> true on the :core worker
(e/in-future?)   ;=> true on the :future coordinator
(e/in-sw?)       ;=> true in the Service Worker
(e/in-branch?)   ;=> true on any non-screen, non-root worker
```

### Common Patterns

```clojure
;; Conditional logic based on worker context
(when (e/in-screen?)
  ;; Only runs on the screen thread
  (render-ui!))

(when (e/in-core?)
  ;; Only in the core worker
  (init-app-state!))

(when (e/in-branch?)
  ;; Any non-screen, non-root worker
  (connect-to-peers!))
```

## Browser Detection

```clojure
e/current-browser
;=> :chrome, :firefox, :safari, :opera, :ie, or nil
```

Useful for browser-specific workarounds:

```clojure
(when (= :safari e/current-browser)
  ;; Safari requires `require-corp` COEP instead of `credentialless`
  (configure-safari-headers!))
```

## Environment Data

```clojure
e/data
;=> {:id :core
;    :conf {...}
;    ...}
```

`e/data` contains the initialization payload received by the current worker. Key fields:

| Field | Description |
|-------|-------------|
| `:id` | Worker identifier (keyword or string) |
| `:conf` | Configuration map (from `init!` options) |
| `:efn` | Ephemeral function body (for `spawn` bodies) |
| `:eargs` | Ephemeral arguments |
| `:in-id` | Request ID (for `in` calls) |
| `:yield?` | Whether yield mode is active |
| `:go?` | Whether go-block CPS mode is active |
| `:deamon?` | Whether this is a daemon worker |

Most of these are internal — `:id` and `:conf` are the useful ones for application code.

## Worker Topology

The standard boot sequence creates this worker tree:

```
screen (main thread)
  └─ root (coordinator)
       ├─ core (your application)
       ├─ db (IndexedDB persistence)
       ├─ future (pool coordinator)
       │   ├─ fp-0
       │   ├─ fp-1
       │   └─ ...
       └─ injest-0, injest-1, ...
```

- **screen**: The browser's UI thread. Never blocks. `@` returns promises.
- **root**: Spawns and coordinates child workers. Routes messages between non-peer workers.
- **core**: Your application's "main thread". Has blocking semantics and full DOM proxy access.
- **db**: Dedicated IndexedDB worker.
- **fp-N**: Future pool workers. Claimed by `future` calls.
- **injest-N**: Workers for `=>>` and `pmap` parallel pipelines.
