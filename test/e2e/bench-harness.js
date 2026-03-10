/**
 * bench-harness.js — shared Playwright benchmark helper
 *
 * Framework-agnostic. Any worker app can be pointed at it.
 * Collects [bench] JSON lines emitted by workers via console.log.
 *
 * Usage:
 *   const harness = require('./bench-harness');
 *   const lines = await harness.collectBenchLines(page, async () => {
 *     await page.click('#increment');
 *   }, { warmupRuns: 3, measureRuns: 20 });
 *   const rtts = lines.filter(l => l.type === 'rtt').map(l => l['t-total']);
 *   console.log(harness.stats(rtts));
 */

module.exports = {
  /**
   * Collect [bench] JSON lines from all workers during N interactions.
   * Discards warmup lines. Returns only measurement-phase lines.
   *
   * @param {import('@playwright/test').Page} page
   * @param {() => Promise<void>} interactionFn - async function that performs one interaction
   * @param {{ warmupRuns?: number, measureRuns?: number, waitMs?: number }} opts
   * @returns {Promise<Object[]>} parsed [bench] JSON objects from measurement phase
   */
  async collectBenchLines(page, interactionFn, { warmupRuns = 3, measureRuns = 20, waitMs = 150 } = {}) {
    const lines = [];

    // Listen on all current and future workers
    const attachWorker = (w) => {
      w.on('console', (msg) => {
        const text = msg.text();
        if (text.startsWith('[bench] ')) {
          try {
            lines.push(JSON.parse(text.slice(8)));
          } catch (_) { /* ignore malformed */ }
        }
      });
    };

    page.on('worker', attachWorker);
    // Attach to any workers already running
    for (const w of page.workers()) {
      attachWorker(w);
    }

    // Warmup — discard any lines accumulated
    for (let i = 0; i < warmupRuns; i++) {
      await interactionFn();
      await page.waitForTimeout(waitMs);
    }
    lines.length = 0; // discard warmup

    // Measurement phase
    for (let i = 0; i < measureRuns; i++) {
      await interactionFn();
      await page.waitForTimeout(waitMs);
    }

    return lines.slice(); // return a copy
  },

  /**
   * Compute descriptive statistics for an array of numbers.
   * @param {number[]} values
   * @returns {{ mean: number, p50: number, p95: number, p99: number, min: number, max: number, n: number }}
   */
  stats(values) {
    if (!values.length) return { mean: 0, p50: 0, p95: 0, p99: 0, min: 0, max: 0, n: 0 };
    const sorted = [...values].sort((a, b) => a - b);
    const n = sorted.length;
    return {
      mean: values.reduce((a, b) => a + b, 0) / n,
      p50:  sorted[Math.floor(n * 0.50)],
      p95:  sorted[Math.floor(n * 0.95)],
      p99:  sorted[Math.floor(n * 0.99)],
      min:  sorted[0],
      max:  sorted[n - 1],
      n,
    };
  },

  /**
   * Print a before/after comparison and return the P95 improvement %.
   * @param {string} label
   * @param {{ p95: number }} before
   * @param {{ p95: number }} after
   * @returns {number} improvement percentage (positive = better)
   */
  compareAndReport(label, before, after) {
    const improvement = ((before.p95 - after.p95) / before.p95 * 100).toFixed(1);
    console.log(
      `\n${label}: P95 ${before.p95.toFixed(2)}ms → ${after.p95.toFixed(2)}ms (${improvement}% improvement)`
    );
    return parseFloat(improvement);
  },

  /**
   * Enable perf logging in the worker via page.evaluate.
   * Requires cljs_thread.perf.enable_BANG_ to be exported.
   * @param {import('@playwright/test').Page} page
   */
  async enablePerfLogging(page) {
    await page.evaluate(() => {
      // Try both possible export name forms
      if (typeof cljs_thread !== 'undefined' && cljs_thread.perf && cljs_thread.perf.enable_BANG_) {
        cljs_thread.perf.enable_BANG_();
      }
    });
  },
};
