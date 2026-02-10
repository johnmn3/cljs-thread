# Documentation & Consolidation Plan

## Constraints

1. **Single strategy**: Consolidate on the fat kernel. Remove strategies 1-4 (self-spawn, blob-bootstrap, eval-kernel, live-kernel).
2. **Remove experimental tests**: Tests used to explore/develop approaches get deleted. Genuine regression tests stay.
3. **Keep figwheel/cljs.main stubs**: These will become official paths again.

---

## Part A: Code Cleanup (before docs)

### A1. Remove strategy source files (strategies 1-4)

Delete:
- `src/cljs_thread/strategy/self_spawn.cljs`
- `src/cljs_thread/strategy/blob_bootstrap.cljs`
- `src/cljs_thread/strategy/eval_kernel.cljs`
- `src/cljs_thread/strategy/live_kernel.cljs`

Keep:
- `src/cljs_thread/strategy/common.cljs` (shared utils, used by fat_kernel)
- `src/cljs_thread/strategy/fat_kernel.cljs`

### A2. Remove experimental test files

Delete (strategy-specific for removed strategies):
- `test/cljs_thread/strategy/node_self_spawn_test.cljs`
- `test/cljs_thread/strategy/node_blob_bootstrap_test.cljs`
- `test/cljs_thread/strategy/node_eval_kernel_test.cljs`
- `test/cljs_thread/strategy/node_live_kernel_test.cljs`
- `test/cljs_thread/strategy_test_browser.cljs`
- `test/cljs_thread/live_kernel_test_browser.cljs`

Delete (exploratory/proof-of-concept):
- `test/cljs_thread/sab_sync_test_browser.cljs`
- `test/cljs_thread/kernel_split_test_browser.cljs`
- `test/cljs_thread/autoload_test_browser.cljs`
- `test/cljs_thread/usability_test_browser.cljs`
- `test/cljs_thread/autoload_fns.cljs`
- `test/cljs_thread/usability_helpers.cljs`

Keep (genuine regression tests):
- `test/cljs_thread/util_test.cljs`
- `test/cljs_thread/state_test.cljs`
- `test/cljs_thread/env_test.cljs`
- `test/cljs_thread/id_test.cljs`
- `test/cljs_thread/util_browser_test.cljs`
- `test/cljs_thread/integration_runner.cljs`
- `test/cljs_thread/integration_core.cljs`
- `test/cljs_thread/node_runner.cljs`
- `test/cljs_thread/strategy/node_fat_kernel_test.cljs`
- `test/cljs_thread/fat_kernel_test_browser.cljs`
- `test/cljs_thread/fat_kernel_nosplit_test_browser.cljs`
- `test/cljs_thread/zero_config_test_browser.cljs`

### A3. Remove experimental e2e specs

Delete:
- `e2e/strategy.spec.js`
- `e2e/strategy-nosplit.spec.js`
- `e2e/autoload.spec.js`
- `e2e/live-kernel.spec.js`
- `e2e/sab-sync.spec.js`
- `e2e/kernel-split.spec.js`
- `e2e/usability.spec.js`
- `e2e/usability-nosplit.spec.js`

Keep:
- `e2e/integration.spec.js`
- `e2e/cljs-tests.spec.js`
- `e2e/fat-kernel.spec.js`
- `e2e/serve.js` (needs port cleanup)
- `e2e/run-fat-kernel-test.js`

### A4. Remove obsolete build targets from shadow-cljs.edn

Delete targets:
- `:node-strategy-1`, `:node-strategy-2`, `:node-strategy-3`, `:node-strategy-4`
- `:strategy-browser`, `:strategy-browser-sw`
- `:strategy-nosplit`, `:strategy-nosplit-sw`
- `:usability-browser`, `:usability-browser-sw`
- `:usability-nosplit`, `:usability-nosplit-sw`
- `:autoload-browser`, `:autoload-browser-sw`
- `:live-kernel-browser`, `:live-kernel-browser-sw`
- `:sab-sync-browser`
- `:kernel-split-browser`, `:kernel-standalone`

Keep targets:
- `:node-test`, `:browser-test`
- `:integration`, `:integration-sw`
- `:node-worker`, `:node-integration`
- `:node-strategy-5`
- `:fat-kernel-browser`, `:fat-kernel-split-browser`, `:fat-kernel-nosplit-browser`
- `:zero-config-browser`

### A5. Clean up e2e/serve.js

Remove port mappings for deleted test modes.

### A6. Remove internal plan docs

Delete:
- `FAT_KERNEL_PLAN.md`
- `LIVE_KERNEL_PLAN.md`

---

## Part B: Documentation

### B1. README.md — Major Rewrite

Structure:
1. Title + tagline
2. Getting Started (zero-config quickstart)
3. Build Configuration (shadow-cljs, figwheel, cljs.main)
4. `init!` (zero-config, explicit, legacy SW)
5. How It Works (brief architecture)
6. Demo
7. API Reference (spawn, in, future, pmap, =>>)
8. Stepping Debugger
9. Deployment (COOP/COEP headers, server examples)
10. Node.js
11. Platform Support
12. History

Key changes:
- Lead with zero-config `(thread/init!)`
- Keep figwheel/cljs.main stubs (becoming official)
- Preserve API sections (well-written)
- Add deployment/headers guidance
- Add Node.js section
- No strategy comparison (single strategy)

### B2. ARCHITECTURE.md

Concise internals doc:
- Fat kernel: how workers boot
- SAB sync vs SW sync
- Module system (code-split, single-module, catch-and-load)
- `:cljs-thread` dedicated kernel module
- Platform abstraction (Browser/Node)
- Worker mesh topology

### B3. DEPLOYMENT.md

Practical deployment guide:
- COOP/COEP headers (required for SAB)
- Server configs (Express, Nginx, Cloudflare)
- SW fallback for environments without SAB
- Troubleshooting common issues

---

## Implementation Order

1. A1-A6: Code cleanup (remove files, clean build config)
2. B1: README.md rewrite
3. B2: ARCHITECTURE.md
4. B3: DEPLOYMENT.md
