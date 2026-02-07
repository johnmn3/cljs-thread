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
  ],
});
