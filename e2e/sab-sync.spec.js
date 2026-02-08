// @ts-check
const { test, expect } = require("@playwright/test");

/**
 * SAB Sync tests — proves that blocking @(in ...) and @(future ...) work
 * WITHOUT a Service Worker, using only SharedArrayBuffer + Atomics.
 *
 * COOP/COEP headers must be set by the server for SharedArrayBuffer to
 * be available. Workers block with Atomics.wait, the main thread acts
 * as coordinator.
 *
 * 13 tests total (2 environment checks + 11 operations).
 */

test("cljs-thread SAB sync: browser tests (no SW)", async ({ page }) => {
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

  await page.goto("http://localhost:9098", {
    waitUntil: "domcontentloaded",
  });

  await page.waitForSelector("#summary", { timeout: 90_000 });

  const summaryText = await page.locator("#summary").textContent();
  const summaryClass = await page.locator("#summary").getAttribute("class");
  const logText = await page.locator("#log pre").textContent();

  console.log(`\nSAB Sync: ${summaryText.trim()}`);
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
