// @ts-check
// Playwright config for fat-kernel URL-forward tests.
// Uses the fat-kernel-split-browser build (target/fat-kernel-split-test/)
// which has a dedicated :cljs-thread module — the recommended user-facing
// pattern. detect-kernel-from-manifest picks up cljs-thread.js as the
// kernel entry, workers boot with the full runtime via importScripts.
const { defineConfig } = require("@playwright/test");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");

module.exports = defineConfig({
  testDir: ".",
  testMatch: "fat-kernel-url-forward.spec.js",
  timeout: 120_000,
  retries: 0,
  use: {
    browserName: "chromium",
    headless: true,
    launchOptions: {
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--enable-features=SharedArrayBuffer",
      ],
    },
  },
  webServer: {
    command: "node test/e2e/serve.js fat-kernel-split-test",
    port: 9101,
    reuseExistingServer: true,
    cwd: ROOT,
    stdout: "pipe",
  },
});
