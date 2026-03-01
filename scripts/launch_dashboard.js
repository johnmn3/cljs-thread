// Launch Playwright browser pointed at the dashboard
// Keep it alive so the CLJS REPL has a JS runtime to connect to

const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--single-process',
      '--enable-features=SharedArrayBuffer',
    ]
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  // Log console messages from the page
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') {
      console.log(`[PAGE ERROR] ${text}`);
    } else if (type === 'warn') {
      console.log(`[PAGE WARN] ${text}`);
    } else {
      console.log(`[PAGE] ${text}`);
    }
  });

  page.on('pageerror', err => {
    console.log(`[PAGE EXCEPTION] ${err.message}`);
  });

  console.log('Navigating to dashboard...');
  await page.goto('http://localhost:8280/index.html', { waitUntil: 'networkidle' });
  console.log('Dashboard loaded. Page title:', await page.title());

  // Wait for the app to initialize (shadow-cljs websocket connect + worker init)
  await page.waitForTimeout(5000);
  console.log('READY - Browser is running, nREPL can connect to CLJS REPL');

  // Keep alive - write PID file so we can kill later
  const fs = require('fs');
  fs.writeFileSync('/tmp/playwright_dashboard.pid', process.pid.toString());

  // Keep running until killed
  await new Promise(() => {});
})();
