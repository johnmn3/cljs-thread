// @ts-check
// Playwright config for the reagami counter example.
// Tests that the DOM proxy + EVE atom counter actually works in the browser.
const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: ".",
  testMatch: "reagami-quick.spec.js",
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
    command: "node test/e2e/serve.js reagami-counter",
    port: 9115,
    reuseExistingServer: true,
    cwd: require("path").join(__dirname, "..", ".."),
  },
});
