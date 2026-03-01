# Platform Support

## Browser Support

| Browser | Sync Mechanism | Notes |
|---------|---------------|-------|
| Chrome/Edge | SharedArrayBuffer + Atomics | Full support with COOP/COEP headers |
| Firefox | SharedArrayBuffer + Atomics | Full support with COOP/COEP headers |
| Safari 15.2+ | SharedArrayBuffer + Atomics | Full support; requires `require-corp` COEP (not `credentialless`) |
| Mobile Chrome | SharedArrayBuffer + Atomics | Full support with COOP/COEP headers |
| Mobile Safari 15.2+ | SharedArrayBuffer + Atomics | Same as desktop Safari |

## Node.js

`SharedArrayBuffer` and `Atomics` are available by default in Node.js — no headers or special flags needed. `cljs-thread` uses `worker_threads` with eval workers.

```bash
npx shadow-cljs compile app
node target/app.js
```

## Safari Notes

Safari has fully supported `SharedArrayBuffer` and `Atomics.wait()` in dedicated web workers since **Safari 15.2 (December 2021)**. `Atomics.waitAsync()` (used on the main thread) was added in **Safari 16.4 (March 2023)**.

The one caveat: Safari does **not** support `Cross-Origin-Embedder-Policy: credentialless`. You must use the stricter `require-corp` value. This means all cross-origin subresources (CDN images, fonts, iframes) must explicitly opt in via `Cross-Origin-Resource-Policy` headers or CORS. See [Deployment](06-deployment.md) for details.

| Feature | Safari Version |
|---------|---------------|
| `SharedArrayBuffer` | 15.2+ (Dec 2021) |
| `Atomics.wait()` in workers | 15.2+ (Dec 2021) |
| `Atomics.waitAsync()` | 16.4+ (Mar 2023) |
| COEP: `require-corp` | 15.2+ |
| COEP: `credentialless` | Not supported |

## Sync Mechanisms Compared

### SharedArrayBuffer + Atomics (preferred)

- **Latency:** ~1-2ms per blocking call
- **Mechanism:** `Atomics.wait()` on `Int32Array` backed by SAB
- **Requirements:** COOP/COEP headers (browser only)
- **Pros:** Fast, reliable, no additional infrastructure, works on all modern browsers including Safari
- **Cons:** Requires cross-origin isolation headers, which affect CDN resources and iframes. Safari requires the stricter `require-corp` COEP (no `credentialless` support)

### Service Worker Fallback

- **Latency:** ~4-10ms per blocking call
- **Mechanism:** Synchronous XHR to Service Worker, SW holds response until signaled
- **Requirements:** SW build target, `:sw-connect-string` in `init!`
- **Pros:** Works without COOP/COEP headers
- **Cons:** Slower, requires additional build target, SW must be served from scope root

## Feature Matrix

| Feature | SAB Sync | SW Sync | No Sync |
|---------|----------|---------|---------|
| `spawn` | Blocking deref | Blocking deref | Fire-and-forget only |
| `in` | Blocking deref | Blocking deref | Promise only |
| `future` | Blocking deref | Blocking deref | Promise only |
| `pmap` | Full parallel | Full parallel | Not available |
| `=>>` | Full parallel | Full parallel | Not available |
| `yield` | Works | Works | Not available |
| `dbg`/`break` | Works | Works | Not available |
| Eve atoms | Full shared memory | Full shared memory | Not available |

Without any sync mechanism, `cljs-thread` can still spawn workers and send messages, but blocking semantics (the core value proposition) are not available.

## Cross-Origin Isolation

For full `SharedArrayBuffer` support in browsers, serve your pages with:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

> **Note:** Chromium-based browsers also accept `Cross-Origin-Embedder-Policy: credentialless`, which is less restrictive — cross-origin subresources don't need explicit CORP headers. However, **Safari does not support `credentialless`**, so use `require-corp` for cross-browser compatibility.

This affects:
- **CDN resources:** Must include `crossorigin` attribute; CDN must send `Cross-Origin-Resource-Policy: cross-origin`
- **Iframes:** Must include `allow="cross-origin-isolated"`; embedded page must also set COOP/COEP
- **OAuth popups:** `same-origin` breaks `window.opener`; consider `same-origin-allow-popups`

See [Deployment](06-deployment.md) for server configuration examples.

## Build Tool Support

| Build Tool | Status | Notes |
|------------|--------|-------|
| shadow-cljs | Full support | Auto-detection via `manifest.edn` |
| Figwheel | In progress | Should work with explicit `:core-connect-string` |
| cljs.main | In progress | Should work with explicit configuration |

See [Build Configuration](05-build-configuration.md) for details.
