const { defineConfig } = require("@playwright/test");
const path = require("path");
module.exports = defineConfig({
  testDir: __dirname,
  testMatch: "confetti-capture.spec.js",
  timeout: 180_000,
  retries: 0,
  use: {
    browserName: "chromium",
    headless: true,
    launchOptions: { args: ["--no-sandbox","--disable-setuid-sandbox","--disable-gpu","--disable-dev-shm-usage","--enable-features=SharedArrayBuffer"] },
  },
  webServer: { command: "node test/e2e/serve.js reagami-counter", port: 9115, reuseExistingServer: true, cwd: path.join(__dirname, "..", "..") },
});
