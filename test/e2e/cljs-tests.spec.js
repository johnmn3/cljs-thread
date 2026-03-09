const { test, expect } = require("@playwright/test");

test("cljs-thread browser tests pass", async ({ page }) => {
  const consoleMessages = [];
  page.on("console", (msg) => consoleMessages.push(msg.text()));
  page.on("pageerror", (err) => consoleMessages.push(`PAGE ERROR: ${err.message}`));

  await page.goto("http://localhost:9090");

  // Wait for the summary element to appear, indicating tests have completed.
  // cljs-test-display renders a #summary element when all tests finish.
  await page.waitForSelector("#summary", { timeout: 30_000 });

  // Check whether the report header has the success or failure class.
  // cljs-test-display uses id="report-header" with class "tests-succeed" or "tests-fail".
  const header = page.locator("#report-header");
  const headerClass = await header.getAttribute("class");

  // Grab the summary text for the log
  const summaryText = await page.locator("#summary").innerText();
  console.log("cljs-test summary:", summaryText);

  // Print any page errors (not network resource failures)
  const pageErrors = consoleMessages.filter((m) => m.includes("PAGE ERROR"));
  if (pageErrors.length > 0) {
    console.log("Browser page errors:", pageErrors);
  }

  // The header gets "tests-fail" if any test failed
  expect(headerClass).toContain("tests-succeed");

  // The summary should say "All Tests Passed" when there are no failures
  expect(summaryText).toContain("All Tests Passed");
});
