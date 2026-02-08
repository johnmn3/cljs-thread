// @ts-check
const { test, expect } = require("@playwright/test");

const BASE = "http://localhost:9099";
const TIMEOUT = 60_000;

test.describe("Kernel-Split Two-Phase Boot", () => {
  test(
    "all kernel-split tests pass",
    async ({ page }) => {
      page.on("pageerror", (err) => console.log("PAGE ERROR:", err.message));
      await page.goto(BASE, {
        waitUntil: "domcontentloaded",
        timeout: 30_000,
      });

      // Wait for #summary to appear (test results rendered)
      await page.waitForSelector("#summary", { timeout: TIMEOUT });

      // Check the summary class
      const summaryClass = await page
        .locator("#summary")
        .getAttribute("class");
      const summaryText = await page.locator("#summary").textContent();
      console.log("Summary:", summaryText);

      // Print the full log
      const logText = await page.locator("#log pre").textContent();
      console.log("Log:\n", logText);

      expect(summaryClass).toBe("pass");

      // Also measure bundle sizes while page is still alive
      const kernelSize = await page.evaluate(async () => {
        const resp = await fetch("/kernel.js");
        const blob = await resp.blob();
        return blob.size;
      });

      const sharedSize = await page.evaluate(async () => {
        const resp = await fetch("/shared.js");
        const blob = await resp.blob();
        return blob.size;
      });

      const coreSize = await page.evaluate(async () => {
        const resp = await fetch("/core.js");
        const blob = await resp.blob();
        return blob.size;
      });

      console.log(
        `Bundle sizes: kernel.js=${(kernelSize / 1024).toFixed(1)}KB, shared.js=${(sharedSize / 1024).toFixed(1)}KB, core.js=${(coreSize / 1024).toFixed(1)}KB`
      );

      // kernel.js should exist and contain the cljs-thread runtime
      expect(kernelSize).toBeGreaterThan(0);
    },
    TIMEOUT
  );
});
