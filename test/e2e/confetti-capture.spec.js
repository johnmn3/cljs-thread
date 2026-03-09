const { test } = require("@playwright/test");

test("capture confetti on 10th click", async ({ page }) => {
  const logs = [];
  page.on("console", msg => logs.push(`[${msg.type()}] ${msg.text()}`));
  page.on("pageerror", err => logs.push(`[ERROR] ${err.message}`));

  await page.goto("http://localhost:9115/dev/");
  await page.waitForSelector("button", { timeout: 30_000 });

  // Click 10 times with generous spacing so each click is processed
  let canvasFound = false;
  for (let i = 1; i <= 10; i++) {
    await page.locator("button").click();
    await page.waitForTimeout(800);

    const info = await page.evaluate((step) => ({
      step,
      barWidth: document.querySelector("#bar")?.getAttribute("width"),
      canvasCount: document.querySelectorAll("canvas").length,
    }), i);

    await page.screenshot({ path: `/tmp/confetti-click${i}.png` });
    console.log(`click ${i}: bar=${info.barWidth} canvas=${info.canvasCount}`);

    if (info.canvasCount > 0) {
      console.log(`Canvas appeared at click ${i}!`);
      canvasFound = true;
    }
  }

  // If not found yet, poll a bit more (confetti fires on n=10 asynchronously)
  if (!canvasFound) {
    console.log("Polling for canvas after all clicks...");
    for (let t = 500; t <= 10000; t += 500) {
      await page.waitForTimeout(500);
      const info = await page.evaluate(() => ({
        canvases: Array.from(document.querySelectorAll("canvas")).map(c => ({
          w: c.width, h: c.height, style: c.style.cssText
        })),
        barWidth: document.querySelector("#bar")?.getAttribute("width"),
      }));
      await page.screenshot({ path: `/tmp/confetti-poll${t}ms.png` });
      console.log(`poll t=${t}ms: bar=${info.barWidth} canvases=${info.canvases.length}`);
      if (info.canvases.length) {
        console.log("  canvas[0]:", JSON.stringify(info.canvases[0]));
        canvasFound = true;
        break;
      }
    }
  }

  const finalInfo = await page.evaluate(() => ({
    barWidth: document.querySelector("#bar")?.getAttribute("width"),
    canvasCount: document.querySelectorAll("canvas").length,
  }));
  console.log("Final state:", JSON.stringify(finalInfo));
  console.log("Canvas found during animation:", canvasFound);
  console.log("Errors:", logs.filter(l => l.includes("[ERROR]") || l.includes("sync-fallback")).join("\n"));
});
