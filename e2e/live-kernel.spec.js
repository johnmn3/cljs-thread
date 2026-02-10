// @ts-check
const { test, expect } = require("@playwright/test");

/**
 * Live Kernel strategy tests — hybrid of strategies 2 + 3.
 *
 * Tests verify that:
 * 1. Standard operations (in, spawn, future, pmap, =>> ) work correctly
 * 2. Non-exported functions work via catch-and-load (IIFE unwrapping)
 * 3. The live-kernel strategy boots workers correctly
 *
 * 12 tests total (6 standard + 6 catch-and-load).
 */

test("cljs-thread live kernel: browser tests", async ({ page }) => {
  const consoleMessages = [];
  page.on("console", (msg) => consoleMessages.push(msg.text()));
  page.on("pageerror", (err) =>
    consoleMessages.push(`PAGE ERROR: ${err.message}`)
  );
  page.on("worker", (worker) => {
    worker.on("console", (msg) =>
      consoleMessages.push(
        `[worker ${worker.url().split("/").pop().split("?")[0]}] ${msg.text()}`
      )
    );
  });

  test.setTimeout(120_000);

  await page.goto("http://localhost:9097", {
    waitUntil: "domcontentloaded",
  });

  await page.waitForSelector("#summary", { timeout: 90_000 });

  const summaryText = await page.locator("#summary").textContent();
  const summaryClass = await page.locator("#summary").getAttribute("class");
  const logText = await page.locator("#log pre").textContent();

  console.log(`\nLive Kernel: ${summaryText.trim()}`);
  console.log(`Log:\n`, logText);

  // Dump worker console messages
  const workerMessages = consoleMessages.filter((m) =>
    m.startsWith("[worker")
  );
  if (workerMessages.length > 0) {
    console.log(`Worker console (${workerMessages.length} msgs):`);
    workerMessages.forEach((m) => console.log("  ", m));
  }

  // Dump error diagnostics
  const errorMessages = consoleMessages.filter(
    (m) =>
      m.includes("ERROR") ||
      m.includes("error") ||
      m.includes("FAIL") ||
      m.includes("PAGE ERROR")
  );
  if (errorMessages.length > 0) {
    console.log(`Errors:`);
    errorMessages.forEach((m) => console.log("  ", m));
  }

  expect(summaryClass).toBe("pass");
  expect(summaryText).toContain("ALL PASSED");
});
