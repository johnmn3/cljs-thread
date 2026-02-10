#!/usr/bin/env node
/**
 * Standalone browser test runner for fat-kernel strategy.
 * Uses Chromium directly (not Playwright test runner) to avoid
 * starting all 11 web servers.
 *
 * Extracts results from console output (resilient to page crashes
 * that can happen in memory-constrained sandboxes).
 */
const { chromium } = require('playwright');

const PORT = 9100;
const CHROME_PATH = '/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome';

(async () => {
  console.log('Launching Chromium for fat-kernel browser test...');
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--enable-features=SharedArrayBuffer',
    ],
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  let passCount = 0;
  let failCount = 0;
  let testsComplete = false;
  let completeResolve;
  const completePromise = new Promise(r => { completeResolve = r; });

  // Collect console output and track pass/fail from console messages
  page.on('console', msg => {
    const text = msg.text();
    console.log(`[browser] ${text}`);

    if (text.startsWith('PASS:')) passCount++;
    if (text.startsWith('FAIL:')) failCount++;
    if (text.includes('All fat-kernel tests complete.')) {
      testsComplete = true;
      // Give a small delay for any final messages, then resolve
      setTimeout(() => completeResolve(), 500);
    }
  });

  page.on('pageerror', err => {
    console.error(`[browser-error] ${err.message}`);
  });

  page.on('crash', () => {
    console.log('[page-crash] Page crashed (may be OOM in sandbox)');
    if (testsComplete) {
      completeResolve();
    } else {
      completeResolve(); // Resolve anyway to avoid hanging
    }
  });

  // Timeout after 120s
  const timeout = setTimeout(() => {
    console.error('TIMEOUT: 120s elapsed');
    completeResolve();
  }, 120000);

  try {
    console.log(`Navigating to http://localhost:${PORT}/`);
    await page.goto(`http://localhost:${PORT}/`, { timeout: 30000 });

    // Wait for tests to complete (tracked via console output)
    await completePromise;
    clearTimeout(timeout);

    // Try to read DOM results if page is still alive
    try {
      const summary = await page.$('#summary');
      if (summary) {
        const summaryText = await summary.textContent();
        console.log(`\nDOM Result: ${summaryText}`);
      }
    } catch (_) {
      // Page may have crashed — that's OK, we have console results
    }

    console.log(`\n--- Results ---`);
    console.log(`Passed: ${passCount}`);
    console.log(`Failed: ${failCount}`);

    if (testsComplete && passCount > 0 && failCount === 0) {
      console.log('\nBROWSER FAT-KERNEL TESTS: ALL PASSED');
      process.exitCode = 0;
    } else if (!testsComplete) {
      console.error('\nBROWSER FAT-KERNEL TESTS: DID NOT COMPLETE');
      process.exitCode = 1;
    } else {
      console.error('\nBROWSER FAT-KERNEL TESTS: FAILURES');
      process.exitCode = 1;
    }
  } catch (err) {
    console.error('Test runner error:', err.message);
    clearTimeout(timeout);
    // Check if tests completed via console before the error
    if (testsComplete && passCount > 0 && failCount === 0) {
      console.log(`\nPassed: ${passCount}, Failed: ${failCount}`);
      console.log('BROWSER FAT-KERNEL TESTS: ALL PASSED (despite page error)');
      process.exitCode = 0;
    } else {
      process.exitCode = 1;
    }
  } finally {
    await browser.close();
  }
})();
