# Persistence — db & IndexedDB

`cljs-thread` includes a lightweight persistence layer backed by IndexedDB, accessible from any worker thread.

## Setup

The `:db` worker initializes automatically as part of the standard boot sequence. No configuration needed.

```clojure
(require '[cljs-thread.db :refer [db-set! db-get]])
```

## API

### `db-set!`

Store a value by key. Returns the data passed in.

```clojure
(db-set! :user-prefs {:theme "dark" :font-size 14})
;=> {:theme "dark" :font-size 14}

(db-set! :counter 42)
;=> 42
```

Keys and values are serialized via `pr-str` / `edn/read-string`, so any EDN-compatible Clojure data works.

### `db-get`

Retrieve a value by key. Returns `nil` if the key doesn't exist.

```clojure
(db-get :user-prefs)
;=> {:theme "dark" :font-size 14}

(db-get :nonexistent)
;=> nil
```

## How It Works

All IndexedDB operations run on a dedicated `:db` worker. `db-set!` and `db-get` use `in :db` internally to dispatch to that worker:

- `db-set!` calls `idb-set!` on the `:db` worker, which writes to IndexedDB's object store
- `db-get` calls `idb-get` on the `:db` worker with `yield` to asynchronously return the result

The `:db` worker uses `on-watch` to wait for IndexedDB to be ready before processing requests, so calls are safe to make during initialization.

## Node.js

On Node.js, where IndexedDB doesn't exist, the `:db` worker marks itself as ready immediately. `db-set!` and `db-get` will work but data is not persisted across restarts. For Node.js persistence, use the filesystem directly.

## Patterns

### Save/restore application state

```clojure
;; Save state periodically
(add-watch state :persist
  (fn [_ _ _ new-val]
    (db-set! :app-state new-val)))

;; Restore on startup
(when-let [saved (db-get :app-state)]
  (reset! state saved))
```

### Cache expensive computations

```clojure
(defn cached-compute [key compute-fn]
  (or (db-get key)
      (let [result (compute-fn)]
        (db-set! key result)
        result)))
```
