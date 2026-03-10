# Contributing to cljs-thread

Thank you for your interest in contributing to cljs-thread!

## Development Setup

### Prerequisites

- Clojure CLI (1.11+)
- Node.js (18+)
- npm

### Getting Started

```bash
# Clone the repository
git clone https://github.com/johnmn3/cljs-thread.git
cd cljs-thread

# Install dependencies
npm install

# Start shadow-cljs watch for development
npx shadow-cljs watch app
```

### Running Tests

The unified test runner auto-discovers `*_test.cljs` files, compiles, and runs them:

```bash
clj -M:thread-test :node                         # all tests via Node.js
clj -M:thread-test :tier slab :node              # slab tier only
clj -M:thread-test :tier pure :node              # pure tier (no prerequisites)
clj -M:thread-test :ns "map" :node               # filter by namespace regex
clj -M:thread-test :dry-run                      # show test plan without running
clj -M:thread-test slab                          # run the slab suite by name
clj -M:thread-test :advanced slab                # :advanced optimizations
clj -M:thread-test :list                         # list suites and discovered namespaces
```

### Adding a Test

Just create a `*_test.cljs` file under `test/` — no configuration changes needed. The runner discovers it automatically and infers the tier from the directory or namespace:

```bash
# test/cljs_thread/eve/my_feature_test.cljs → auto-detected as :slab tier
clj -M:thread-test :ns "my-feature" :node
```

See [Testing](doc/10-testing.md) for the full reference including tier system, reporters, filtering, and the `cljs-thread.test` blocking helpers.

## Project Structure

```
src/cljs_thread/
├── core.cljs          # Public API entry point
├── spawn.cljs         # Worker spawning
├── in.cljs            # Cross-worker execution
├── future.cljs        # Deferred computation
├── pmap.cljs          # Parallel map/calls/values
├── sync.cljs          # Synchronization layer
├── platform.cljs      # Browser/Node abstraction
├── eve/               # EVE shared-memory structures
│   ├── shared_atom.cljs   # SharedAtom implementation
│   ├── map.cljs           # Persistent HashMap
│   ├── vec.cljs           # Persistent Vector
│   └── deftype_proto/     # Low-level allocator
└── dom/               # DOM proxy for workers
```

## Code Style

- Follow existing patterns in the codebase
- Use debug logging via `cljs-thread.debug/log` for development output
- Add docstrings to public functions
- Keep macros minimal; prefer runtime functions when possible

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Write tests for new functionality
4. Ensure all tests pass
5. Update documentation if needed
6. Submit a pull request

## Architecture Notes

See [doc/07-architecture.md](doc/07-architecture.md) for details on:
- Fat kernel design
- Sync layer implementation
- Worker mesh topology

See [doc/11-agent-guide.md](doc/11-agent-guide.md) for AI agent onboarding.

## Reporting Issues

Please include:
- ClojureScript/Clojure versions
- Browser/Node.js version
- shadow-cljs version
- Minimal reproduction case
- Error messages and stack traces

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
