// @ts-check
const { test, expect } = require("@playwright/test");

// Override browser args: do NOT pass --enable-features=SharedArrayBuffer.
// The server also omits COOP/COEP headers, so SAB will be unavailable and
// the SW fallback sync path is the only option.
test.use({
  launchOptions: {
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--single-process",
      // Deliberately omit --enable-features=SharedArrayBuffer
    ],
  },
});

test("SW fallback pure mode: SAB unavailable, sync via SW", async ({
  page,
}) => {
  const consoleMessages = [];
  page.on("console", (msg) => consoleMessages.push(msg.text()));
  page.on("pageerror", (err) =>
    consoleMessages.push(`PAGE ERROR: ${err.message}`)
  );

  // SW registration + worker boot + future pool init can be slow.
  // The first page load registers the SW, then the page auto-reloads
  // so the SW controller is active on the second load.
  test.setTimeout(120_000);

  await page.goto("http://localhost:9113");

  // The page may reload once (on-sw-registration-reload) to pick up
  // the SW controller. Wait for the #summary element which appears
  // after tests complete — this survives across navigations.
  try {
    await page.waitForSelector("#summary", { timeout: 90_000 });
  } catch (_e) {
    // Dump console for debugging before failing
    console.log("sw-fallback-pure console output:");
    consoleMessages.forEach((m) => console.log("  ", m));
    const html = await page.content();
    console.log(
      "sw-fallback-pure page HTML (first 2000 chars):",
      html.slice(0, 2000)
    );
    throw _e;
  }

  const summaryText = await page.locator("#summary").innerText();
  console.log("sw-fallback-pure summary:", summaryText);

  const logText = await page.locator("#results #log").innerText();
  console.log("sw-fallback-pure log:\n", logText);

  const summaryClass = await page.locator("#summary").getAttribute("class");

  const pageErrors = consoleMessages.filter((m) => m.includes("PAGE ERROR"));
  if (pageErrors.length > 0) {
    console.log("Page errors:", pageErrors);
  }

  expect(summaryClass).toBe("pass");
  expect(summaryText).toContain("ALL PASSED");
});
