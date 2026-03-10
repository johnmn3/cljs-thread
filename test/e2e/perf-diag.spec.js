// @ts-check
// Diagnostic test: captures ALL console output (including worker logs)
// and dumps it so we can see batch/rAF timing from the worker.
const { test, expect } = require("@playwright/test");

test("perf diagnostics — capture all worker logs after click", async ({ page, context }) => {
  test.setTimeout(90_000);

  const logs = [];

  // Main page console
  page.on("console", (msg) => {
    logs.push(`[page/${msg.type()}] ${msg.text()}`);
  });
  page.on("pageerror", (err) => {
    logs.push(`[page/ERROR] ${err.message}`);
  });

  // Worker console (Playwright exposes workers via page.workers())
  page.on("worker", (worker) => {
    logs.push(`[worker-attach] ${worker.url()}`);
    worker.on("console", (msg) => {
      logs.push(`[worker/${msg.type()}] ${msg.text()}`);
    });
  });

  // Also listen for service workers
  context.on("serviceworker", (sw) => {
    logs.push(`[sw-attach] ${sw.url()}`);
  });

  await page.goto("http://localhost:9115/dev/");
  await page.waitForSelector("button", { timeout: 30_000 });

  const logsBefore = logs.length;
  console.log(`[diag] Page ready. ${logsBefore} startup logs:`);
  logs.forEach(m => console.log(`  ${m}`));

  // Click button
  await page.locator("button").click();
  console.log(`[diag] Button clicked.`);

  // Wait long enough for d3 animation (300ms) + confetti (~3s) + batch flushes
  await page.waitForTimeout(8_000);

  const afterLogs = logs.slice(logsBefore);
  console.log(`\n[diag] === ${afterLogs.length} log entries after click ===`);
  afterLogs.forEach(m => console.log(`  ${m}`));

  // Verify counter updated
  const counterDiv = page.locator("div").filter({ hasText: /Counted:/ }).first();
  const text = await counterDiv.innerText();
  console.log(`\n[diag] Counter text: ${text}`);
  expect(text).toContain("100");
});
