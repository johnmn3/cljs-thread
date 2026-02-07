// @ts-check
const { test, expect } = require("@playwright/test");

/**
 * Autoload tests — proof of concept for catch-and-load mechanism.
 *
 * These tests verify that non-exported functions (IIFE-scoped in screen.js
 * under code splitting) can be transparently called from workers when
 * :loadable-modules is configured. The catch-and-load mechanism catches
 * ReferenceError, strips the IIFE wrapper from the module source, eval's
 * it in global scope, and retries the call.
 *
 * Tests run for all 3 strategies to verify the mechanism works with
 * different worker creation approaches.
 */

const strategies = [
  { num: 1, name: "Self-Spawn" },
  { num: 2, name: "Blob Bootstrap" },
  { num: 3, name: "Eval Kernel" },
];

test("cljs-thread autoload: all 3 strategies", async ({ page }) => {
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

  test.setTimeout(300_000);

  for (const strategy of strategies) {
    consoleMessages.length = 0;

    await page.goto(
      `http://localhost:9096?strategy=${strategy.num}`,
      { waitUntil: "domcontentloaded" }
    );

    await page.waitForSelector("#summary", { timeout: 90_000 });

    const summaryText = await page.locator("#summary").textContent();
    const summaryClass = await page.locator("#summary").getAttribute("class");
    const logText = await page.locator("#log pre").textContent();

    console.log(
      `\nStrategy ${strategy.num} (${strategy.name}): ${summaryText.trim()}`
    );
    console.log(
      `Strategy ${strategy.num} log:\n`,
      logText
    );

    // Dump worker console messages
    const workerMessages = consoleMessages.filter((m) =>
      m.startsWith("[worker")
    );
    if (workerMessages.length > 0) {
      console.log(
        `Strategy ${strategy.num} worker console (${workerMessages.length} msgs):`
      );
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
      console.log(`Strategy ${strategy.num} errors:`);
      errorMessages.forEach((m) => console.log("  ", m));
    }

    expect(summaryClass).toBe("pass");
    expect(summaryText).toContain("ALL PASSED");
  }
});
