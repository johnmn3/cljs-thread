const { test, expect } = require("@playwright/test");

// Run all 3 strategies sequentially in the same browser page context.
// The --single-process Chrome flag in CI means we can't create multiple
// browser contexts without instability, so we navigate sequentially.
const strategies = [
  { num: 1, name: "Self-Spawn" },
  { num: 2, name: "Blob Bootstrap" },
  { num: 3, name: "Eval Kernel" },
];

test("cljs-thread: all 3 strategies — mechanisms + integration", async ({ page }) => {
  const consoleMessages = [];
  page.on("console", (msg) => consoleMessages.push(msg.text()));
  page.on("pageerror", (err) => consoleMessages.push(`PAGE ERROR: ${err.message}`));

  // 3 strategies x ~30s each + generous buffer
  test.setTimeout(300_000);

  for (const strategy of strategies) {
    consoleMessages.length = 0;

    await page.goto(`http://localhost:9092?strategy=${strategy.num}`);

    try {
      await page.waitForSelector("#summary", { timeout: 90_000 });
    } catch (e) {
      console.log(`=== TIMEOUT (strategy=${strategy.num} ${strategy.name}) ===`);
      consoleMessages.forEach((m) => console.log(m));
      console.log("=== END ===");
      throw e;
    }

    const summaryText = await page.locator("#summary").innerText();
    console.log(`Strategy ${strategy.num} (${strategy.name}):`, summaryText);

    const logText = await page.locator("#log").innerText();
    console.log(`Strategy ${strategy.num} log:\n`, logText);

    const summaryClass = await page.locator("#summary").getAttribute("class");

    const pageErrors = consoleMessages.filter((m) => m.includes("PAGE ERROR"));
    if (pageErrors.length > 0) {
      console.log("Page errors:", pageErrors);
    }

    expect(summaryClass).toBe("pass");
    expect(summaryText).toContain("ALL PASSED");
  }
});
