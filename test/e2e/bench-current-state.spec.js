// @ts-check
// Baseline performance benchmark for the reagami-counter dev build.
// Measures RTT breakdown (Item 12), batch timeline (Item 13), shadow-cache
// hit rate (Item 9/proxy-perf), and click-to-update wall time.
//
// Run with:
//   npx playwright test --config test/e2e/playwright-dom-proxy-perf.config.js \
//     bench-current-state.spec.js
//
// Uses cljs_thread.perf.enable_BANG_() on each worker to activate
// [bench] JSON logging. Also collects [proxy-perf] text lines.

const { test, expect } = require("@playwright/test");

const WARMUP  = 3;
const MEASURE = 20;

test("baseline: RTT breakdown + batch timeline + shadow-cache hit rate", async ({ page }) => {
  test.setTimeout(300_000);

  // ── Collect logs from all workers AND screen thread ────────────────────────
  // deliver-response runs on the screen thread, so its [bench] dr-timing lines
  // arrive via page.on('console'), not via worker console.
  const benchLines   = [];  // parsed [bench] JSON (workers + screen)
  const perfLines    = [];  // raw [proxy-perf] text lines
  const workerErrors = [];

  const handleConsoleMsg = (msg) => {
    const text = msg.text();
    if (text.startsWith("[bench] ")) {
      try { benchLines.push(JSON.parse(text.slice(8))); } catch (_) {}
    } else if (text.includes("[proxy-perf]")) {
      perfLines.push(text);
    }
  };

  // Screen-thread console (deliver-response logs dr-timing here)
  page.on("console", handleConsoleMsg);

  const enablePerfOnWorker = async (w) => {
    try {
      await w.evaluate(() => {
        if (typeof cljs_thread !== "undefined" &&
            typeof cljs_thread.perf !== "undefined" &&
            typeof cljs_thread.perf.enable_BANG_ === "function") {
          cljs_thread.perf.enable_BANG_();
        }
      });
    } catch (_) { /* worker may not have cljs_thread yet — re-tried on interaction */ }
  };

  page.on("worker", (w) => {
    w.on("console", handleConsoleMsg);
    w.on("pageerror", (e) => workerErrors.push(e.message));
    enablePerfOnWorker(w);
  });

  await page.goto("http://localhost:9115/dev/", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("button", { timeout: 60_000 });

  // Enable perf on any workers already running (race with page.on)
  for (const w of page.workers()) {
    await enablePerfOnWorker(w);
  }

  const clickAndWait = async (expectedCount) => {
    await page.locator("button").click();
    await expect(async () => {
      const text = await page.locator("div").filter({ hasText: /Counted:/ }).first().innerText();
      expect(text).toContain(String(expectedCount));
    }).toPass({ timeout: 15_000 });
    // Wait for d3 animation to complete (300ms transition + margin)
    await page.waitForTimeout(800);
  };

  // ── Warmup ─────────────────────────────────────────────────────────────────
  for (let i = 0; i < WARMUP; i++) {
    await clickAndWait((i + 1) * 100);
    // Re-enable perf in case workers weren't ready yet
    for (const w of page.workers()) { await enablePerfOnWorker(w); }
  }
  benchLines.length = 0;
  perfLines.length  = 0;
  const warmupCount = WARMUP * 100;

  // ── Measurement ────────────────────────────────────────────────────────────
  const wallTimes = [];
  for (let i = 0; i < MEASURE; i++) {
    const expectedCount = warmupCount + (i + 1) * 100;
    const t0 = Date.now();
    await clickAndWait(expectedCount);
    wallTimes.push(Date.now() - t0);
  }

  // ── Helper ─────────────────────────────────────────────────────────────────
  function stats(arr) {
    if (!arr.length) return { mean: "n/a", p50: "n/a", p95: "n/a", min: "n/a", max: "n/a", n: 0 };
    const s = [...arr].sort((a, b) => a - b);
    const n = s.length;
    const mean = (arr.reduce((a, b) => a + b, 0) / n).toFixed(2);
    return {
      mean,
      p50:  s[Math.floor(n * 0.50)].toFixed(2),
      p95:  s[Math.floor(n * 0.95)].toFixed(2),
      min:  s[0].toFixed(2),
      max:  s[n - 1].toFixed(2),
      n,
    };
  }

  // ── Aggregate RTT lines (Item 12) ──────────────────────────────────────────
  const rttLines = benchLines.filter(l => l.type === "rtt");
  const rttStats = {
    serialize: stats(rttLines.map(l => l["t-serialize"])),
    postmsg:   stats(rttLines.map(l => l["t-postmsg"])),
    eval:      stats(rttLines.map(l => l["t-eval"])),
    deliver:   stats(rttLines.map(l => l["t-deliver"])),
    total:     stats(rttLines.map(l => l["t-total"])),
  };

  // ── t_deliver breakdown (new sub-timing) ───────────────────────────────────
  // dr-timing: screen thread — swap! assoc + Atomics.store/notify
  const drLines = benchLines.filter(l => l.type === "dr-timing");
  const drStats = {
    atomWrite:  stats(drLines.map(l => l["t-atom-write"])),
    signalOps:  stats(drLines.map(l => l["t-signal-ops"])),
  };
  // ar-timing: worker thread — get @response-atom + swap! dissoc after Atomics.wait
  const arLines = benchLines.filter(l => l.type === "ar-timing");
  const arStats = {
    atomRead:   stats(arLines.map(l => l["t-atom-read"])),
    atomDissoc: stats(arLines.map(l => l["t-atom-dissoc"])),
  };

  // ── Aggregate batch lines (Item 13) ───────────────────────────────────────
  const batchLines = benchLines.filter(l => l.type === "batch");
  const rafBatches = batchLines.filter(l => l.label && l.label.startsWith("rAF"));
  const evtBatches = batchLines.filter(l => l.label && !l.label.startsWith("rAF"));

  const batchStats = (lines) => ({
    userFn:   stats(lines.map(l => l["t-user-fn"])),
    flushRtt: stats(lines.map(l => l["t-flush-rtt"])),
    total:    stats(lines.map(l => l["t-total"])),
    writes:   stats(lines.map(l => l.writes)),
    hits:     stats(lines.map(l => l.hits)),
    misses:   stats(lines.map(l => l.misses)),
    n: lines.length,
  });

  const rafStats = batchStats(rafBatches);
  const evtStats = batchStats(evtBatches);

  // ── Aggregate proxy-perf lines (shadow cache + flush-on-read) ─────────────
  let totalHits = 0, totalMisses = 0, totalFor = 0, totalWrites = 0;
  for (const line of perfLines) {
    const h = line.match(/hits=(\d+)/);
    const m = line.match(/misses=(\d+)/);
    const f = line.match(/for=(\d+)/);
    const w = line.match(/writes=(\d+)/);
    if (h) totalHits   += parseInt(h[1], 10);
    if (m) totalMisses += parseInt(m[1], 10);
    if (f) totalFor    += parseInt(f[1], 10);
    if (w) totalWrites += parseInt(w[1], 10);
  }
  const hitRate = (totalHits + totalMisses) > 0
    ? ((totalHits / (totalHits + totalMisses)) * 100).toFixed(1) + "%"
    : "n/a (no getAttribute calls observed)";

  // ── Report ─────────────────────────────────────────────────────────────────
  const sep = "=".repeat(62);
  console.log("\n" + sep);
  console.log("  REAGAMI-COUNTER PERFORMANCE BASELINE");
  console.log(`  ${WARMUP} warmup clicks + ${MEASURE} measured clicks`);
  console.log(sep);

  console.log("\n── Wall time (click → counter updated + 800ms settle) ──────");
  const wt = stats(wallTimes);
  console.log(`  mean=${wt.mean}ms  p50=${wt.p50}ms  p95=${wt.p95}ms`);
  console.log(`  min=${wt.min}ms   max=${wt.max}ms   n=${wt.n}`);

  console.log("\n── RTT breakdown (Item 12) — ms per in :screen call ─────────");
  if (rttLines.length === 0) {
    console.log("  NO [bench] rtt lines collected.");
    console.log("  perf/enable! may not be reaching the worker in time.");
    console.log("  (Try enabling it before page.goto in a future run.)");
  } else {
    console.log(`  n=${rttLines.length} RTT samples`);
    console.log(`  t_serialize  mean=${rttStats.serialize.mean}  p95=${rttStats.serialize.p95}`);
    console.log(`  t_postmsg    mean=${rttStats.postmsg.mean}  p95=${rttStats.postmsg.p95}`);
    console.log(`  t_eval       mean=${rttStats.eval.mean}  p95=${rttStats.eval.p95}`);
    console.log(`  t_deliver    mean=${rttStats.deliver.mean}  p95=${rttStats.deliver.p95}`);
    console.log(`  t_total      mean=${rttStats.total.mean}  p95=${rttStats.total.p95}`);
  }

  console.log("\n── t_deliver breakdown — what's inside the 'transfer period' ─");
  console.log("  (T3=after-exec → T4=after-await-response. Includes:)");
  console.log("   screen: swap! assoc → Atomics.notify → [scheduling] → worker: get @atom + swap! dissoc)");
  if (drLines.length === 0 && arLines.length === 0) {
    console.log("  NO dr-timing or ar-timing lines. Check screen console capture.");
  } else {
    console.log(`\n  Screen-side (dr-timing, n=${drLines.length}):`);
    console.log(`    t_atom_write  mean=${drStats.atomWrite.mean}ms  p95=${drStats.atomWrite.p95}ms   ← swap! assoc on eve/atom`);
    console.log(`    t_signal_ops  mean=${drStats.signalOps.mean}ms  p95=${drStats.signalOps.p95}ms   ← Atomics.store + Atomics.notify`);
    console.log(`\n  Worker-side after Atomics.wait (ar-timing, n=${arLines.length}):`);
    console.log(`    t_atom_read   mean=${arStats.atomRead.mean}ms  p95=${arStats.atomRead.p95}ms   ← get @response-atom`);
    console.log(`    t_atom_dissoc mean=${arStats.atomDissoc.mean}ms  p95=${arStats.atomDissoc.p95}ms   ← swap! dissoc`);
    if (rttLines.length > 0 && drLines.length > 0 && arLines.length > 0) {
      const tDeliverMean = parseFloat(rttStats.deliver.mean);
      const drMean = parseFloat(drStats.atomWrite.mean) + parseFloat(drStats.signalOps.mean);
      const arMean = parseFloat(arStats.atomRead.mean) + parseFloat(arStats.atomDissoc.mean);
      const schedEst = (tDeliverMean - drMean - arMean).toFixed(2);
      console.log(`\n  Estimated t_scheduling (t_deliver - screen_atom - worker_atom):`);
      console.log(`    ~${schedEst}ms   ← pure OS thread wake latency`);
    }
  }

  console.log("\n── Batch timeline (Item 13) ─────────────────────────────────");
  if (batchLines.length === 0) {
    console.log("  NO [bench] batch lines collected. (Same perf-enable issue above.)");
  } else {
    console.log(`\n  rAF batches (n=${rafStats.n}):`);
    console.log(`    t_user_fn   mean=${rafStats.userFn.mean}ms  p95=${rafStats.userFn.p95}ms`);
    console.log(`    t_flush_rtt mean=${rafStats.flushRtt.mean}ms  p95=${rafStats.flushRtt.p95}ms`);
    console.log(`    t_total     mean=${rafStats.total.mean}ms  p95=${rafStats.total.p95}ms`);
    console.log(`    writes/frame mean=${rafStats.writes.mean}  hits/frame mean=${rafStats.hits.mean}`);
    console.log(`\n  Event-handler batches (n=${evtStats.n}):`);
    console.log(`    t_user_fn   mean=${evtStats.userFn.mean}ms  p95=${evtStats.userFn.p95}ms`);
    console.log(`    t_flush_rtt mean=${evtStats.flushRtt.mean}ms  p95=${evtStats.flushRtt.p95}ms`);
    console.log(`    t_total     mean=${evtStats.total.mean}ms  p95=${evtStats.total.p95}ms`);
  }

  console.log("\n── Shadow cache (proxy-perf lines) ─────────────────────────");
  console.log(`  [proxy-perf] frames captured: ${perfLines.length}`);
  console.log(`  Total hits:    ${totalHits}`);
  console.log(`  Total misses:  ${totalMisses}`);
  console.log(`  Hit rate:      ${hitRate}`);
  console.log(`  Flush-on-read: ${totalFor}`);
  console.log(`  Batched ops:   ${totalWrites}`);

  console.log("\n── Worker errors ────────────────────────────────────────────");
  if (workerErrors.length) {
    workerErrors.forEach(e => console.log("  ERROR: " + e));
  } else {
    console.log("  none");
  }
  console.log("\n" + sep + "\n");

  // Sanity assertions — not strict perf thresholds, just confirms things ran
  expect(wallTimes.length).toBe(MEASURE);
  expect(perfLines.length).toBeGreaterThan(0);
});
