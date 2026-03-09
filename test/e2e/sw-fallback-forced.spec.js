// @ts-check
const { test, expect } = require("@playwright/test");

// Forced mode: SAB is available (COOP/COEP headers + --enable-features flag
// from config), but force-sw-sync! is called before init. All sync goes
// through the Service Worker even though SAB data structures work fine.
// This is the default launch config so no test.use() override needed.

test("SW fallback forced mode: SAB available but sync via SW", async ({
  page,
}) => {
  const consoleMessages = [];
  page.on("console", (msg) => consoleMessages.push(msg.text()));
  page.on("pageerror", (err) =>
    consoleMessages.push(`PAGE ERROR: ${err.message}`)
  );

  test.setTimeout(120_000);

  // Use ?mode=forced to call force-sw-sync! — SAB available but sync through SW.
  // Port 9114 serves with COOP/COEP headers so SharedArrayBuffer is available.
  await page.goto("http://localhost:9114?mode=forced");

  try {
    await page.waitForSelector("#summary", { timeout: 90_000 });
  } catch (_e) {
    console.log("sw-fallback-forced console output:");
    consoleMessages.forEach((m) => console.log("  ", m));
    const html = await page.content();
    console.log(
      "sw-fallback-forced page HTML (first 2000 chars):",
      html.slice(0, 2000)
    );
    throw _e;
  }

  const summaryText = await page.locator("#summary").innerText();
  console.log("sw-fallback-forced summary:", summaryText);

  const logText = await page.locator("#results #log").innerText();
  console.log("sw-fallback-forced log:\n", logText);

  const summaryClass = await page.locator("#summary").getAttribute("class");

  const pageErrors = consoleMessages.filter((m) => m.includes("PAGE ERROR"));
  if (pageErrors.length > 0) {
    console.log("Page errors:", pageErrors);
  }

  expect(summaryClass).toBe("pass");
  expect(summaryText).toContain("ALL PASSED");
});
