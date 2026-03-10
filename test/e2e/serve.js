const http = require("http");
const fs = require("fs");
const path = require("path");

// Determine which test directory to serve based on CLI arg
const mode = process.argv[2] || "browser-test";
// __dirname is test/e2e — go up two levels to project root
const ROOT = path.join(__dirname, "..", "..");
// sw-fallback-forced-test uses the same build as sw-fallback-test, but
// serves WITH COOP/COEP headers so SharedArrayBuffer is available.
// force-sw-sync! in the test runner overrides sync to the SW path.
// reagami-counter serves from docs/ (pre-built), not target/
const DIR = mode === "reagami-counter"
  ? path.join(ROOT, "docs", "reagami-counter")
  : mode === "raytracer"
  ? path.join(ROOT, "docs", "raytracer")
  : mode === "raytracer-dev"
  ? path.join(ROOT, "docs", "raytracer")  // serve parent, access via /dev/
  // fat-kernel-url-forward-test uses same build as fat-kernel-test
  : mode === "fat-kernel-url-forward-test"
  ? path.join(ROOT, "target", "fat-kernel-test")
  : path.join(ROOT, "target",
      mode === "sw-fallback-forced-test" ? "sw-fallback-test" : mode);
const PORT = mode === "reagami-counter" ? 9115
  : mode === "raytracer" ? 9115
  : mode === "raytracer-dev" ? 9115
  : mode === "integration-test" ? 9091
  : mode === "fat-kernel-test" ? 9100
  : mode === "fat-kernel-url-forward-test" ? 9100
  : mode === "fat-kernel-split-test" ? 9101
  : mode === "fat-kernel-nosplit-test" ? 9102
  : mode === "zero-config-test" ? 9103
  : mode === "walkthrough-test" ? 9104
  : mode === "thread-test-browser" ? 9110
  : mode === "xray-test-browser" ? 9111
  : mode === "dom-proxy-test" ? 9112
  : mode === "direct-sab-test" ? 9116
  : mode === "sw-fallback-test" ? 9113
  : mode === "sw-fallback-forced-test" ? 9114
  : 9090;

const MIME = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".map": "application/json",
};

// Fallback HTML templates for builds that don't generate their own index.html.
// Generic template works for any code-split build with shared.js + screen.js.
const GENERIC_TEMPLATE = path.join(ROOT, "test", "browser-test-template.html");
// Split template for builds with cljs-thread.js + shared.js + screen.js.
const SPLIT_TEMPLATE = path.join(ROOT, "test", "browser-test-split-template.html");
const HTML_TEMPLATES = {
  "thread-test-browser": path.join(ROOT, "test", "eve", "thread-test-browser.html"),
  "xray-test-browser": path.join(ROOT, "test", "eve", "thread-test-browser.html"),
  "dom-proxy-test": path.join(ROOT, "test", "dom_proxy", "dom-proxy-test.html"),
  "direct-sab-test": path.join(ROOT, "test", "direct_sab", "direct-sab-test.html"),
  "sw-fallback-test": path.join(ROOT, "test", "sw_fallback", "sw-fallback-test.html"),
  "sw-fallback-forced-test": path.join(ROOT, "test", "sw_fallback", "sw-fallback-test.html"),
  "integration-test": GENERIC_TEMPLATE,
  "fat-kernel-test": GENERIC_TEMPLATE,
  "fat-kernel-url-forward-test": GENERIC_TEMPLATE,
  "fat-kernel-split-test": SPLIT_TEMPLATE,
  "fat-kernel-nosplit-test": GENERIC_TEMPLATE,
  "zero-config-test": GENERIC_TEMPLATE,
  "walkthrough-test": GENERIC_TEMPLATE,
};

const server = http.createServer((req, res) => {
  // Strip query string for file lookup
  let urlPath = req.url.split("?")[0];
  // Handle directory requests by appending index.html
  if (urlPath.endsWith("/")) {
    urlPath = urlPath + "index.html";
  }
  const filePath = path.join(DIR, urlPath === "/" ? "index.html" : urlPath);
  const ext = path.extname(filePath);
  // Ordering test HTML: served from test/ directory when requested in fat-kernel modes.
  // Allows testing probe-based detection robustness (decoy script before kernel scripts).
  const ORDERING_HTML_MAP = {
    "fat-kernel-test": path.join(ROOT, "test", "fat_kernel_ordering_test.html"),
    "fat-kernel-url-forward-test": path.join(ROOT, "test", "fat_kernel_ordering_test.html"),
    "fat-kernel-split-test": path.join(ROOT, "test", "fat_kernel_split_ordering_test.html"),
  };
  const ORDERING_MODES = new Set(Object.keys(ORDERING_HTML_MAP));
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Fall back to HTML template for index.html requests.
      // urlPath has already been normalized: "/" → "/index.html" above.
      if (urlPath === "/index.html" && HTML_TEMPLATES[mode]) {
        return fs.readFile(HTML_TEMPLATES[mode], (err2, tmpl) => {
          if (err2) { res.writeHead(404); res.end("Not found"); return; }
          const headers = { "Content-Type": "text/html" };
          // Add COOP/COEP for all modes except sw-fallback-test (which
          // intentionally serves WITHOUT cross-origin isolation to force
          // the Service Worker sync fallback path).
          if (mode !== "sw-fallback-test" && mode !== "browser-test") {
            headers["Cross-Origin-Opener-Policy"] = "same-origin";
            headers["Cross-Origin-Embedder-Policy"] = "credentialless";
          }
          res.writeHead(200, headers);
          res.end(tmpl);
        });
      }
      // Fall back to ordering test HTML for fat-kernel modes
      if (urlPath === "/index-ordering-test.html" && ORDERING_MODES.has(mode)) {
        return fs.readFile(ORDERING_HTML_MAP[mode], (err2, tmpl) => {
          if (err2) { res.writeHead(404); res.end("Not found"); return; }
          res.writeHead(200, {
            "Content-Type": "text/html",
            "Cross-Origin-Opener-Policy": "same-origin",
            "Cross-Origin-Embedder-Policy": "credentialless",
          });
          res.end(tmpl);
        });
      }
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    const headers = {
      "Content-Type": MIME[ext] || "application/octet-stream",
    };
    // Cross-origin isolation headers required for SharedArrayBuffer
    if (mode === "integration-test" || mode === "fat-kernel-test" || mode === "fat-kernel-url-forward-test" || mode === "fat-kernel-split-test" || mode === "fat-kernel-nosplit-test" || mode === "zero-config-test" || mode === "walkthrough-test" || mode === "thread-test-browser" || mode === "xray-test-browser" || mode === "dom-proxy-test" || mode === "direct-sab-test" || mode === "sw-fallback-forced-test" || mode === "reagami-counter" || mode === "raytracer" || mode === "raytracer-dev") {
      headers["Cross-Origin-Opener-Policy"] = "same-origin";
      headers["Cross-Origin-Embedder-Policy"] = "credentialless";
    }
    res.writeHead(200, headers);
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Serving ${mode} on http://localhost:${PORT}`);
});
