// @ts-check
// Playwright config for SW fallback tests (both pure and forced modes).
//
// "Pure" test (port 9113): no COOP/COEP, no --enable-features=SharedArrayBuffer.
//   SAB is genuinely unavailable. All sync goes through SW by necessity.
//   The spec file overrides launchOptions to omit the SAB flag.
//
// "Forced" test (port 9114): COOP/COEP headers present, SAB available,
//   but force-sw-sync! is called before init. All sync goes through SW by choice.
//   This proves the SW path works even when SAB data structures are in use.
//
// These are split into separate spec files because --single-process prevents
// Playwright from re-launching the browser with different args mid-run.
const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: ".",
  testMatch: "sw-fallback-*.spec.js",
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
        "--single-process",
        "--enable-features=SharedArrayBuffer",
      ],
    },
  },
  webServer: [
    {
      command: "node test/e2e/serve.js sw-fallback-test",
      port: 9113,
      reuseExistingServer: true,
      cwd: require("path").join(__dirname, "..", ".."),
    },
    {
      command: "node test/e2e/serve.js sw-fallback-forced-test",
      port: 9114,
      reuseExistingServer: true,
      cwd: require("path").join(__dirname, "..", ".."),
    },
  ],
});
