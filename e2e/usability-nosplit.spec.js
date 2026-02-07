// @ts-check
const { test, expect } = require("@playwright/test");

/**
 * Usability tests (non-code-split build) — run for all 3 strategies.
 * Single app.js module serves as both screen and worker.
 */

const strategies = [
  { num: 1, name: "Self-Spawn" },
  { num: 2, name: "Blob Bootstrap" },
  { num: 3, name: "Eval Kernel" },
];

test("cljs-thread usability (nosplit): all 3 strategies", async ({ page }) => {
  const consoleMessages = [];
  page.on("console", (msg) => consoleMessages.push(msg.text()));
  page.on("pageerror", (err) =>
    consoleMessages.push(`PAGE ERROR: ${err.message}`)
  );

  test.setTimeout(300_000);

  for (const strategy of strategies) {
    consoleMessages.length = 0;

    await page.goto(
      `http://localhost:9095?strategy=${strategy.num}`,
      { waitUntil: "domcontentloaded" }
    );

    try {
      await page.waitForSelector("#summary", { timeout: 90_000 });
    } catch (e) {
      console.log(
        `=== TIMEOUT (nosplit usability strategy=${strategy.num} ${strategy.name}) ===`
      );
      consoleMessages.forEach((m) => console.log(m));
      console.log("=== END ===");
      throw e;
    }

    const summaryText = await page.locator("#summary").textContent();
    const summaryClass = await page.locator("#summary").getAttribute("class");
    const logText = await page.locator("#log pre").textContent();

    console.log(
      `\nNosplit Strategy ${strategy.num} (${strategy.name}): ${summaryText.trim()}`
    );
    console.log(`Nosplit Strategy ${strategy.num} log:\n`, logText);

    const errorMessages = consoleMessages.filter(
      (m) =>
        m.includes("ERROR") ||
        m.includes("error") ||
        m.includes("FAIL") ||
        m.includes("PAGE ERROR")
    );
    if (errorMessages.length > 0) {
      console.log(`Nosplit Strategy ${strategy.num} errors:`);
      errorMessages.forEach((m) => console.log("  ", m));
    }

    expect(summaryClass).toBe("pass");
    expect(summaryText).toContain("ALL PASSED");
  }
});
