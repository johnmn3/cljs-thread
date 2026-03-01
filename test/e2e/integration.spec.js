const { test, expect } = require("@playwright/test");

test("cljs-thread integration tests (spawn, in, future, pmap, =>>)", async ({ page }) => {
  const consoleMessages = [];
  page.on("console", (msg) => consoleMessages.push(msg.text()));
  page.on("pageerror", (err) => consoleMessages.push(`PAGE ERROR: ${err.message}`));

  // Allow extra time – workers need to start, SW needs to register, future pool
  // needs to initialize.  The test runner already has its own 30s timeout for
  // worker readiness; give Playwright plenty of headroom on top of that.
  test.setTimeout(120_000);

  await page.goto("http://localhost:9091");

  // Wait for the #summary element that the runner renders when tests finish.
  await page.waitForSelector("#summary", { timeout: 90_000 });

  const summaryText = await page.locator("#summary").innerText();
  console.log("integration summary:", summaryText);

  const logText = await page.locator("#log").innerText();
  console.log("integration log:\n", logText);

  const summaryClass = await page.locator("#summary").getAttribute("class");

  // Print any page errors
  const pageErrors = consoleMessages.filter((m) => m.includes("PAGE ERROR"));
  if (pageErrors.length > 0) {
    console.log("Page errors:", pageErrors);
  }

  expect(summaryClass).toBe("pass");
  expect(summaryText).toContain("ALL PASSED");
});
