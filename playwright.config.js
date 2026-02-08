// @ts-check
const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./e2e",
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
      command: "node e2e/serve.js browser-test",
      port: 9090,
      reuseExistingServer: false,
    },
    {
      command: "node e2e/serve.js integration-test",
      port: 9091,
      reuseExistingServer: false,
    },
    {
      command: "node e2e/serve.js strategy-test",
      port: 9092,
      reuseExistingServer: false,
    },
    {
      command: "node e2e/serve.js strategy-nosplit-test",
      port: 9093,
      reuseExistingServer: false,
    },
    {
      command: "node e2e/serve.js usability-test",
      port: 9094,
      reuseExistingServer: false,
    },
    {
      command: "node e2e/serve.js usability-nosplit-test",
      port: 9095,
      reuseExistingServer: false,
    },
    {
      command: "node e2e/serve.js autoload-test",
      port: 9096,
      reuseExistingServer: false,
    },
    {
      command: "node e2e/serve.js live-kernel-test",
      port: 9097,
      reuseExistingServer: false,
    },
    {
      command: "node e2e/serve.js sab-sync-test",
      port: 9098,
      reuseExistingServer: false,
    },
  ],
});
