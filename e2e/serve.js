const http = require("http");
const fs = require("fs");
const path = require("path");

// Determine which test directory to serve based on CLI arg
const mode = process.argv[2] || "browser-test";
const DIR = path.join(__dirname, "..", "target", mode);
const PORT = mode === "integration-test" ? 9091
  : mode === "strategy-test" ? 9092
  : mode === "strategy-nosplit-test" ? 9093
  : mode === "usability-test" ? 9094
  : mode === "usability-nosplit-test" ? 9095
  : mode === "autoload-test" ? 9096
  : mode === "live-kernel-test" ? 9097
  : mode === "sab-sync-test" ? 9098
  : mode === "kernel-split-test" ? 9099
  : mode === "fat-kernel-test" ? 9100
  : mode === "fat-kernel-split-test" ? 9101
  : mode === "fat-kernel-nosplit-test" ? 9102
  : 9090;

const MIME = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".map": "application/json",
};

const server = http.createServer((req, res) => {
  // Strip query string for file lookup
  const urlPath = req.url.split("?")[0];
  const filePath = path.join(DIR, urlPath === "/" ? "index.html" : urlPath);
  const ext = path.extname(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    const headers = {
      "Content-Type": MIME[ext] || "application/octet-stream",
    };
    // Cross-origin isolation headers required for SharedArrayBuffer and
    // Service Worker scope in cljs-thread integration tests.
    if (mode === "integration-test" || mode === "strategy-test" || mode === "strategy-nosplit-test" || mode === "usability-test" || mode === "usability-nosplit-test" || mode === "autoload-test" || mode === "live-kernel-test" || mode === "sab-sync-test" || mode === "kernel-split-test" || mode === "fat-kernel-test" || mode === "fat-kernel-split-test" || mode === "fat-kernel-nosplit-test") {
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
