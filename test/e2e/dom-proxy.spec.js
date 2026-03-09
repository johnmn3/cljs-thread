// @ts-check
const { test, expect } = require("@playwright/test");

test("dom-proxy browser tests pass (:advanced)", async ({ page }) => {
  const consoleMessages = [];
  page.on("console", (msg) => consoleMessages.push(msg.text()));
  page.on("pageerror", (err) => consoleMessages.push(`PAGE ERROR: ${err.message}`));

  await page.goto("http://localhost:9112/");

  // Wait for the #status element to get class "pass" or "fail",
  // indicating tests have completed (up to 120s for :advanced builds).
  await page.waitForFunction(
    () => {
      const el = document.getElementById("status");
      return el && (el.classList.contains("pass") || el.classList.contains("fail"));
    },
    { timeout: 120_000 }
  );

  // Grab the status text and class
  const statusEl = page.locator("#status");
  const statusClass = await statusEl.getAttribute("class");
  const statusText = await statusEl.innerText();

  // Grab the results text
  const resultsText = await page.locator("#results").innerText();

  // Grab the full log for debugging
  const logText = await page.locator("#log").innerText();

  // Print everything
  console.log("=== STATUS ===");
  console.log(statusText);
  console.log("=== RESULTS ===");
  console.log(resultsText);
  console.log("=== LOG ===");
  console.log(logText);

  // Print any page errors
  const pageErrors = consoleMessages.filter((m) => m.includes("PAGE ERROR"));
  if (pageErrors.length > 0) {
    console.log("=== PAGE ERRORS ===");
    pageErrors.forEach((e) => console.log(e));
  }

  // Assert tests passed: status element should have "pass" class
  expect(statusClass).toContain("pass");
  // Results should show 0 failures
  expect(resultsText).toContain("0 failed");
  // Status text confirms all passed
  expect(statusText).toContain("ALL TESTS PASSED");
});
