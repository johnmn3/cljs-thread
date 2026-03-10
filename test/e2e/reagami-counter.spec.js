// @ts-check
const { test, expect } = require("@playwright/test");

test("Reagami counter renders and increments", async ({ page, context }) => {
  const consoleMessages = [];
  page.on("console", (msg) => consoleMessages.push(`[page] ${msg.text()}`));
  page.on("pageerror", (err) =>
    consoleMessages.push(`PAGE ERROR: ${err.message}`)
  );
  context.on("weberror", (webError) => {
    consoleMessages.push(`WEB ERROR: ${webError.error().message}`);
  });
  page.on("worker", (worker) => {
    consoleMessages.push(`[worker] spawned: ${worker.url().slice(0, 80)}`);
  });

  test.setTimeout(90_000);

  await page.goto("http://localhost:9115");

  // Give it a few seconds to start, then check state
  await page.waitForTimeout(5000);

  // Debug: check what's happening
  const debugInfo = await page.evaluate(() => {
    const info = {};
    info.hasClojure = typeof cljs !== "undefined";
    info.appHTML = document.getElementById("app")?.innerHTML || "NO APP";
    try {
      info.hasEve =
        typeof cljs_thread !== "undefined" &&
        typeof cljs_thread.eve !== "undefined";
      info.hasGlobalAtom =
        typeof cljs_thread !== "undefined" &&
        typeof cljs_thread.eve !== "undefined" &&
        typeof cljs_thread.eve.shared_atom !== "undefined" &&
        cljs_thread.eve.shared_atom._STAR_global_atom_instance_STAR_ != null;
      info.hasEveSabConfig =
        typeof cljs_thread !== "undefined" &&
        typeof cljs_thread.state !== "undefined" &&
        cljs_thread.state.eve_sab_config != null &&
        cljs.core.deref(cljs_thread.state.eve_sab_config) != null;
    } catch (e) {
      info.error = e.message;
    }
    return info;
  });
  console.log("Debug info:", JSON.stringify(debugInfo, null, 2));

  // Wait for the counter UI
  try {
    await page.waitForSelector("button", { timeout: 50_000 });
  } catch (_e) {
    console.log("reagami-counter console output:");
    consoleMessages.forEach((m) => console.log("  ", m));
    const html = await page.content();
    console.log(
      "reagami-counter page HTML (first 2000 chars):",
      html.slice(0, 2000)
    );

    // More debug after timeout
    const postDebug = await page.evaluate(() => {
      const info = {};
      info.appHTML = document.getElementById("app")?.innerHTML || "NO APP";
      info.allWorkerCount =
        typeof performance !== "undefined"
          ? performance.getEntriesByType("resource").length
          : -1;
      try {
        info.hasGlobalAtom =
          cljs_thread.eve.shared_atom._STAR_global_atom_instance_STAR_ != null;
        info.hasEveSabConfig =
          cljs.core.deref(cljs_thread.state.eve_sab_config) != null;
        info.peersKeys = Object.keys(
          cljs.core.clj__GT_js(cljs.core.deref(cljs_thread.state.peers))
        );
        info.futurePool = cljs.core.clj__GT_js(
          cljs.core.deref(cljs_thread.state.future_pool)
        );
      } catch (e) {
        info.error = e.message;
      }
      return info;
    });
    console.log("Post-timeout debug:", JSON.stringify(postDebug, null, 2));

    throw _e;
  }

  // Verify initial counter value (counter * 100, starts at 0)
  const counterDiv = page.locator("div").filter({ hasText: /Counted:/ }).first();
  const counterText = await counterDiv.innerText();
  console.log("Initial counter text:", counterText);
  expect(counterText).toContain("Counted:");

  const pageErrors = consoleMessages.filter((m) => m.includes("PAGE ERROR") || m.includes("WEB ERROR"));
  if (pageErrors.length > 0) {
    console.log("Page errors found:");
    pageErrors.forEach((m) => console.log("  ", m));
  }
  expect(pageErrors.length).toBe(0);

  // Click and wait for counter to change
  const button = page.locator("button");
  await button.click();
  await page.waitForTimeout(3000);

  // Check console messages for clues
  const clickConsole = consoleMessages.filter((m) => !m.includes("spawned"));
  console.log("Console after click:", clickConsole.slice(-10));

  // Wait for the counter text to change
  await expect(async () => {
    const text = await counterDiv.innerText();
    expect(text).toContain("100");
  }).toPass({ timeout: 15_000 });

  const afterClick = await counterDiv.innerText();
  console.log("After click counter text:", afterClick);

  // Click 12 more times (13 total), waiting between each for the chain to propagate
  for (let i = 0; i < 12; i++) {
    await button.click();
    await page.waitForTimeout(500);
  }

  // Wait for the final value
  await expect(async () => {
    const text = await counterDiv.innerText();
    expect(text).toContain("1300");
  }).toPass({ timeout: 15_000 });

  const afterMulti = await counterDiv.innerText();
  console.log("After 13 total clicks:", afterMulti);

  // Take screenshot for README — tight landscape crop of just the #app area
  const appDiv = page.locator("#app");
  const box = await appDiv.boundingBox();
  // Add small padding around the element for context, landscape orientation
  const pad = 16;
  await page.screenshot({
    path: "docs/reagami-counter/reagami-counter-screenshot.png",
    clip: {
      x: Math.max(0, box.x - pad * 4),
      y: Math.max(0, box.y - pad),
      width: Math.min(box.width + pad * 8, 720),
      height: box.height + pad * 2,
    },
  });
});
