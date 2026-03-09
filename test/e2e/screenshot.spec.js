const { test } = require("@playwright/test");
const fs = require("fs");

async function runMode(page, url, label) {
  const logs = [];
  page.on("console", msg => logs.push(`[${msg.type()}] ${msg.text()}`));
  page.on("pageerror", err => logs.push(`[ERROR] ${err.message}`));

  await page.goto(url);
  await page.waitForSelector("button", { timeout: 30_000 });

  // Capture bar width at each click step
  const snapshots = [];
  for (let i = 1; i <= 10; i++) {
    await page.locator("button").click();
    // wait for any transition to settle
    await page.waitForTimeout(600);
    const info = await page.evaluate((step) => {
      const bar = document.querySelector("#bar");
      return {
        step,
        counterText: document.querySelector("div div")?.textContent,
        barWidth: bar?.getAttribute("width"),
        barWidthPx: bar?.getBoundingClientRect().width,
      };
    }, i);
    snapshots.push(info);
    await page.screenshot({ path: `/tmp/${label}-click${i}.png` });
  }

  // Final wait for confetti to appear
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `/tmp/${label}-confetti.png` });

  const syncFallbacks = logs.filter(l => l.includes("sync-fallback"));
  return { snapshots, syncFallbackCount: syncFallbacks.length, syncFallbacks };
}

test(":none dev build — bar + confetti visual check", async ({ page }) => {
  const { snapshots, syncFallbackCount, syncFallbacks } = await runMode(
    page, "http://localhost:9115/dev/", "none"
  );
  console.log("=== :none snapshots ===");
  snapshots.forEach(s => console.log(`  click ${s.step}: counter="${s.counterText}" bar="${s.barWidth}" (${s.barWidthPx?.toFixed(1)}px)`));
  if (syncFallbacks.length) {
    console.log(`  sync-fallback warnings: ${syncFallbackCount}`);
    syncFallbacks.forEach(s => console.log("   ", s));
  }
  // Bar should reach 100% after 10 clicks
  const last = snapshots[9];
  if (last.barWidth !== "100%") console.warn(`WARN: bar at click 10 = ${last.barWidth}, expected 100%`);
});

test(":advanced release build — bar + confetti visual check", async ({ page }) => {
  const { snapshots, syncFallbackCount, syncFallbacks } = await runMode(
    page, "http://localhost:9115/", "advanced"
  );
  console.log("=== :advanced snapshots ===");
  snapshots.forEach(s => console.log(`  click ${s.step}: counter="${s.counterText}" bar="${s.barWidth}" (${s.barWidthPx?.toFixed(1)}px)`));
  if (syncFallbacks.length) {
    console.log(`  sync-fallback warnings: ${syncFallbackCount}`);
    syncFallbacks.forEach(s => console.log("   ", s));
  }
  const last = snapshots[9];
  if (last.barWidth !== "100%") console.warn(`WARN: bar at click 10 = ${last.barWidth}, expected 100%`);
});
