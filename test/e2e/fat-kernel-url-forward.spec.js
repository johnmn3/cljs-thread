// @ts-check
/**
 * E2E tests for fat-kernel Strategy 1 (URL-forward) requirements.
 *
 * Verifies:
 * 1. All fat-kernel functional tests pass (regression check).
 * 2. Kernel is loaded from a real server URL — no XHR fetching of JS source.
 *    In the old approach, XMLHttpRequest was used to fetch shared.js / core.js
 *    source text before creating a kernel Blob. Under Strategy 1, only
 *    manifest.edn is fetched via XHR; kernel JS is loaded as a worker script.
 * 3. Script ordering robustness — tests pass even when a non-kernel script
 *    (that 404s) appears first in the HTML, simulating the confetti bug.
 */

const { test, expect } = require('@playwright/test');

// Server is started by playwright-fat-kernel.config.js webServer on port 9101.
const PORT = 9101;

// ---------------------------------------------------------------------------
// Test 1: Functional regression + URL-forward verification
// ---------------------------------------------------------------------------

test('fat-kernel url-forward: all tests pass and kernel is an http URL', async ({ page }) => {
  // Collect XHR requests for .js files (would indicate source-text fetching)
  const xhrJsRequests = [];
  page.on('request', req => {
    if (req.url().endsWith('.js') &&
        (req.resourceType() === 'xhr' || req.resourceType() === 'fetch')) {
      xhrJsRequests.push(req.url());
    }
  });

  await page.goto(`http://localhost:${PORT}/`);

  // Wait for test results (up to 120s)
  const summary = await page.waitForSelector('#summary', { timeout: 120000 });
  const log = await page.locator('#results #log').textContent();
  console.log(log);

  // All tests must pass (including url:kernel-detected, url:kernel-is-http,
  // url:kernel-not-blob added by fat_kernel_test_browser.cljs)
  const summaryClass = await summary.getAttribute('class');
  expect(summaryClass).toBe('pass');
  expect(await summary.textContent()).toContain('ALL PASSED');

  // Strategy 1 requirement: no XHR/fetch for .js source files.
  // In the old approach, shared.js and core.js were fetched via XMLHttpRequest.
  // Under URL-forward, only manifest.edn is fetched via XHR; JS is loaded
  // as a worker importScripts call (resourceType: 'other' or 'script').
  //
  // Note: screen.js may be loaded via XHR by the catch-and-load mechanism
  // in in.cljs after the worker boots — that is expected behavior.
  // We only verify that KERNEL modules (shared.js, core.js) are not XHR'd.
  const kernelXhrRequests = xhrJsRequests.filter(url =>
    url.includes('shared.js') || url.includes('core.js') || url.includes('cljs-thread.js')
  );
  if (kernelXhrRequests.length > 0) {
    console.log('UNEXPECTED kernel XHR requests:', kernelXhrRequests);
  }
  expect(kernelXhrRequests).toHaveLength(0);
});

// ---------------------------------------------------------------------------
// Test 2: Script ordering robustness
//
// A non-kernel script (that 404s) appears FIRST in the HTML.
// The probe-based detect-kernel-url-browser! must skip it and find
// manifest.edn from the next script's base URL.
//
// This directly tests the fix for the confetti-ordering bug that motivated
// Strategy 1: when confetti.min.js was the first <script src>, the old
// detect-base-url-from-scripts took its directory as the base URL,
// fetching manifest.edn from the wrong location.
// ---------------------------------------------------------------------------

test('fat-kernel url-forward: works even with decoy script before kernel', async ({ page }) => {
  // Use the ordering-test HTML which has a 404-decoy script first
  const response = await page.goto(
    `http://localhost:${PORT}/index-ordering-test.html`,
    { waitUntil: 'domcontentloaded' }
  );

  // If the ordering HTML isn't served (test infrastructure not set up),
  // skip this test gracefully rather than failing
  if (!response || response.status() === 404) {
    test.skip(true, 'Ordering test HTML not served — skipping');
    return;
  }

  const summary = await page.waitForSelector('#summary', { timeout: 120000 });
  const log = await page.locator('#results #log').textContent();
  console.log('ORDERING TEST LOG:', log);

  const summaryClass = await summary.getAttribute('class');
  expect(summaryClass).toBe('pass');
  expect(await summary.textContent()).toContain('ALL PASSED');
});
