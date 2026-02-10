# Deployment Guide

## Development

During development, shadow-cljs's built-in server works out of the box:

```bash
npx shadow-cljs watch app
```

For `SharedArrayBuffer` support in development, add COOP/COEP headers to your dev server. shadow-cljs's dev server doesn't set these by default, so you may need a custom dev server or middleware.

## Production

### With COOP/COEP Headers (recommended)

Set these response headers on all pages that use `cljs-thread`:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

This enables `SharedArrayBuffer`, which `cljs-thread` uses for fast blocking semantics. Workers boot from blob URLs with the full runtime inlined — no Service Worker needed.

#### Express

```javascript
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});
```

#### Nginx

```nginx
location / {
    add_header Cross-Origin-Opener-Policy "same-origin" always;
    add_header Cross-Origin-Embedder-Policy "require-corp" always;
}
```

#### Cloudflare Workers

```javascript
async function handleRequest(request) {
  const response = await fetch(request);
  const newHeaders = new Headers(response.headers);
  newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");
  newHeaders.set("Cross-Origin-Embedder-Policy", "require-corp");
  return new Response(response.body, {
    status: response.status,
    headers: newHeaders,
  });
}
```

#### Apache

```apache
Header always set Cross-Origin-Opener-Policy "same-origin"
Header always set Cross-Origin-Embedder-Policy "require-corp"
```

### Without COOP/COEP Headers (Service Worker fallback)

If you cannot set COOP/COEP headers (e.g., embedding in third-party pages, Safari), use the Service Worker fallback:

1. Add a Service Worker build target:
```clojure
;; shadow-cljs.edn
{:builds
 {:sw {:target     :browser
       :output-dir "resources/public/js"
       :modules    {:sw {:entries [cljs-thread.sw]
                         :web-worker true}}}}}
```

2. Pass `:sw-connect-string` to `init!`:
```clojure
(thread/init!
 {:sw-connect-string "/js/sw.js"
  :core-connect-string "/js/core.js"})
```

The Service Worker must be served from the scope root of your application.

## COOP/COEP Considerations

Cross-origin isolation affects how your page interacts with external resources:

- **Images/fonts from CDNs**: Must include `crossorigin` attribute and the CDN must send `Cross-Origin-Resource-Policy: cross-origin`
- **Iframes**: Must include `allow="cross-origin-isolated"` and the embedded page must also set COOP/COEP
- **OAuth popups**: `Cross-Origin-Opener-Policy: same-origin` breaks `window.opener` communication. Consider using `same-origin-allow-popups` instead, though this may limit SAB availability in some browsers.

If these constraints are too restrictive for your deployment, use the Service Worker fallback.

## Node.js

Node.js requires no special configuration. `SharedArrayBuffer` is available by default:

```bash
npx shadow-cljs compile app
node target/app.js
```

## Troubleshooting

### "SharedArrayBuffer is not defined"

Your server is not sending COOP/COEP headers. Check with browser dev tools:
1. Open the Network tab
2. Click on your HTML page request
3. Verify both headers are present in the response

### Workers fail to load / Content-Security-Policy errors

If your CSP blocks `blob:` URLs, add `blob:` to `worker-src`:
```
Content-Security-Policy: worker-src 'self' blob:;
```

### "cljs-thread: Could not detect kernel source"

The library couldn't find your build output. Ensure:
- `manifest.edn` exists in your `:output-dir` (shadow-cljs generates this automatically)
- Your page has `<script>` tags loading the build output
- Or provide an explicit `:core-connect-string` to `init!`

### Performance: SAB vs Service Worker

SAB sync is significantly faster than SW sync:
- **SAB**: ~1-2ms per blocking call (Atomics.wait is nearly instant)
- **SW**: ~4-10ms per blocking call (XHR round-trip through Service Worker)

For hot paths, prefer SAB sync with COOP/COEP headers.
