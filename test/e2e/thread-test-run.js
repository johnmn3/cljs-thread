/**
 * Playwright-based thread test runner.
 * Launches headless Chromium, navigates to the test page,
 * captures console output, and exits with the test result code.
 *
 * Usage: node test/e2e/thread-test-run.js [suite] [port]
 *   suite  - test suite name (default: "all")
 *   port   - server port (default: 9110)
 */
const { chromium } = require("playwright");
const fs = require("fs");

function findChromium() {
  // Use PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH if set
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) {
    return process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  }
  // Default path — let Playwright resolve it
  const defaultPath = chromium.executablePath();
  if (fs.existsSync(defaultPath)) return defaultPath;
  // Fallback: scan ms-playwright cache for any available chromium
  const cacheDir = require("path").join(require("os").homedir(), ".cache", "ms-playwright");
  if (fs.existsSync(cacheDir)) {
    const dirs = fs.readdirSync(cacheDir).filter(d => d.startsWith("chromium-")).sort().reverse();
    for (const d of dirs) {
      const candidate = require("path").join(cacheDir, d, "chrome-linux", "chrome");
      if (fs.existsSync(candidate)) return candidate;
      const candidate2 = require("path").join(cacheDir, d, "chrome-linux64", "chrome");
      if (fs.existsSync(candidate2)) return candidate2;
    }
  }
  return undefined; // Let Playwright try its default
}

async function main() {
  const suite = process.argv[2] || "all";
  const port = process.argv[3] || "9110";
  const url = `http://localhost:${port}?suite=${suite}`;

  console.log(`[playwright] Running thread tests: suite=${suite}`);
  console.log(`[playwright] URL: ${url}`);
  console.log();

  const executablePath = findChromium();
  const browser = await chromium.launch({
    executablePath,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--enable-features=SharedArrayBuffer",
    ],
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  // Forward browser console to stdout
  page.on("console", (msg) => {
    const text = msg.text();
    // Skip noisy browser internals
    if (!text.startsWith("[slab-wasm]") || text.includes("initialized")) {
      console.log(text);
    }
  });

  page.on("pageerror", (err) => {
    console.error(`[browser error] ${err.message}`);
  });

  await page.goto(url, { timeout: 90_000 });

  // Wait for tests to complete (window.__test_complete set by test reporter)
  await page.waitForFunction(() => window.__test_complete === true, null, {
    timeout: 300_000,
  });

  const exitCode = await page.evaluate(() => window.__test_exit_code);

  await browser.close();
  process.exit(exitCode);
}

main().catch((e) => {
  console.error("[playwright] Fatal:", e.message);
  process.exit(1);
});
