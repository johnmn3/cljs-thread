// @ts-check
// Performance diagnostic: measures shadow-cache hit rates and timing
// for the reagami counter's d3 bar animation using the dev build.
const { test, expect } = require("@playwright/test");

test("dom-proxy shadow cache — perf counters during d3 animation", async ({ page }) => {
  test.setTimeout(120_000);

  const workerLogs = [];
  page.on("worker", (w) => {
    w.on("console", (msg) => workerLogs.push(msg.text()));
  });
  page.on("pageerror", (err) => {
    console.error("[page-error]", err.message);
  });

  // Use domcontentloaded so the goto doesn't block on service-worker/script
  // evaluation — the dev build can take >30s for the full `load` event.
  await page.goto("http://localhost:9115/dev/", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("button", { timeout: 60_000 });

  // ------------------------------------------------------------------
  // Warm-up: one click to ensure all method-fns are cached in the proxy
  // (avoids counting the first-access GET trap lookups as misses).
  // ------------------------------------------------------------------
  await page.locator("button").click();
  await expect(async () => {
    const text = await page.locator("div").filter({ hasText: /Counted:/ }).first().innerText();
    expect(text).toContain("100");
  }).toPass({ timeout: 15_000 });

  // Wait for any warm-up animation frames to settle
  await page.waitForTimeout(600);

  // Discard warm-up logs
  const warmupLogCount = workerLogs.length;
  console.log(`\n[perf] Warm-up complete. ${warmupLogCount} worker log lines captured.`);

  // ------------------------------------------------------------------
  // Measurement: click 5 more times, capture proxy-perf lines
  // per-click and per-rAF-frame.
  // ------------------------------------------------------------------
  const CLICKS = 5;
  const clickTimings = [];
  let allPerfLines = [];

  for (let i = 0; i < CLICKS; i++) {
    const expectedCount = String((i + 2) * 100);
    const t0 = Date.now();
    const logsBefore = workerLogs.length;

    await page.locator("button").click();
    await expect(async () => {
      const text = await page.locator("div").filter({ hasText: /Counted:/ }).first().innerText();
      expect(text).toContain(expectedCount);
    }).toPass({ timeout: 15_000 });

    // Wait for d3 animation frames to settle (300ms transition + margin)
    await page.waitForTimeout(800);

    const elapsed = Date.now() - t0;
    clickTimings.push(elapsed);

    const newLogs = workerLogs.slice(logsBefore);
    const perfLines = newLogs.filter((l) => l.includes("[proxy-perf]"));
    allPerfLines = allPerfLines.concat(perfLines);

    console.log(`\n[perf] Click ${i + 2}: ${elapsed}ms  (${perfLines.length} proxy-perf frames)`);
    perfLines.forEach((l) => console.log("  " + l));
  }

  // ------------------------------------------------------------------
  // Aggregate stats
  // ------------------------------------------------------------------
  let totalHits = 0, totalMisses = 0, totalFor = 0, totalWrites = 0;
  for (const line of allPerfLines) {
    const h = line.match(/hits=(\d+)/);
    const m = line.match(/misses=(\d+)/);
    const f = line.match(/for=(\d+)/);
    const w = line.match(/writes=(\d+)/);
    if (h) totalHits    += parseInt(h[1], 10);
    if (m) totalMisses  += parseInt(m[1], 10);
    if (f) totalFor     += parseInt(f[1], 10);
    if (w) totalWrites  += parseInt(w[1], 10);
  }

  const mean = (arr) => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(0) : "n/a";
  const hitRate = totalHits + totalMisses > 0
    ? ((totalHits / (totalHits + totalMisses)) * 100).toFixed(1) + "%"
    : "n/a";

  console.log("\n======================================================");
  console.log("  DOM proxy shadow-cache performance summary");
  console.log("======================================================");
  console.log(`  Clicks measured:       ${CLICKS}`);
  console.log(`  Mean click→update:     ${mean(clickTimings)} ms`);
  console.log(`  rAF frames with ops:   ${allPerfLines.length}`);
  console.log(`  Shadow hits:           ${totalHits}`);
  console.log(`  Shadow misses:         ${totalMisses}`);
  console.log(`  Hit rate:              ${hitRate}`);
  console.log(`  Flush-on-reads:        ${totalFor}`);
  console.log(`  Batched writes:        ${totalWrites}`);
  console.log("======================================================");
  console.log("  Note: event handler is now batched (fast), so d3's");
  console.log("  300ms animation runs over 2 rAF frames. Frame 1 misses");
  console.log("  getAttribute (d3 reads start value before shadow is set).");
  console.log("  Frame 2 hits (shadow populated by frame 1 setAttribute).");
  console.log("======================================================\n");

  // Shadow cache must hit at least once — confirms Strategy 1 is active
  expect(totalHits).toBeGreaterThan(0);
  // With the event handler now batched (fast), d3's 300ms animation runs over
  // 2 rAF frames instead of completing in 1 frame. Frame 1 always misses on
  // getAttribute("width") — d3 reads the starting value before it has been
  // written to the shadow. Frame 2 hits (value was set by frame 1's
  // setAttribute which populates the shadow). One miss per click is expected.
  // We verify hits > misses (cache is helping more than it misses).
  expect(totalHits).toBeGreaterThanOrEqual(totalMisses);
  expect(allPerfLines.length).toBeGreaterThan(0);
});
