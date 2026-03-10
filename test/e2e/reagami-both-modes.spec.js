// @ts-check
const { test, expect } = require("@playwright/test");

async function testReagami(page, url, label) {
  const log = [];
  page.on("console", (msg) => log.push(`[${msg.type()}] ${msg.text()}`));
  page.on("pageerror", (err) => log.push(`[ERROR] ${err.message}`));

  await page.goto(url);

  // Wait for the button to appear (counter app rendered)
  try {
    await page.waitForSelector("button", { timeout: 60_000 });
  } catch (e) {
    const html = await page.content();
    console.log(`[${label}] FAILED to render. Last log:`);
    log.slice(-20).forEach(m => console.log(`  ${m}`));
    console.log(`HTML: ${html.slice(0, 1000)}`);
    throw e;
  }

  console.log(`[${label}] Rendered OK`);

  // Verify initial state
  const counterDiv = page.locator("div").filter({ hasText: /Counted:/ }).first();
  const initialText = await counterDiv.innerText();
  console.log(`[${label}] Initial: ${initialText}`);
  expect(initialText).toContain("Counted:");

  // No page errors
  const pageErrors = log.filter(m => m.includes("[ERROR]"));
  if (pageErrors.length > 0) {
    console.log(`[${label}] Page errors:`, pageErrors);
  }
  expect(pageErrors.length, `${label} page errors`).toBe(0);

  // Click and verify counter increments
  const logsBefore = log.length;
  await page.locator("button").click();
  await page.waitForTimeout(2000);  // give time for async dispatch

  // Dump console logs after click
  const logsAfterClick = log.slice(logsBefore);
  if (logsAfterClick.length > 0) {
    console.log(`[${label}] Console after click (${logsAfterClick.length} msgs):`);
    logsAfterClick.forEach(m => console.log(`  ${m}`));
  } else {
    console.log(`[${label}] No console output after click`);
  }

  await expect(async () => {
    const text = await counterDiv.innerText();
    expect(text).toContain("100");
  }).toPass({ timeout: 15_000 });

  const afterClick = await counterDiv.innerText();
  console.log(`[${label}] After click: ${afterClick}`);
  console.log(`[${label}] PASS`);
}

test(":none (dev) build — counter renders and increments", async ({ page }) => {
  test.setTimeout(90_000);
  await testReagami(page, "http://localhost:9115/dev/", ":none");
});

test(":advanced (release) build — counter renders and increments", async ({ page }) => {
  test.setTimeout(90_000);
  await testReagami(page, "http://localhost:9115/", ":advanced");
});
