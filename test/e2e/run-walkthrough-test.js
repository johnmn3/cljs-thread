const { chromium } = require('playwright');
const { spawn: spawnProcess } = require('child_process');
const path = require('path');
const CHROME = '/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome';
const PORT = 9104;
const URL = `http://localhost:${PORT}/index.html`;
async function main() {
  const server = spawnProcess('node', [path.join(__dirname, 'serve.js'), 'walkthrough-test'], {
    stdio: ['ignore', 'pipe', 'pipe']
  });
  await new Promise((resolve) => {
    server.stdout.on('data', (data) => {
      const msg = data.toString().trim();
      console.log('[SERVER]', msg);
      if (msg.includes('Serving')) resolve();
    });
    setTimeout(resolve, 3000);
  });
  const browser = await chromium.launch({
    executablePath: CHROME,
    args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  let passes = 0, fails = 0, complete = false, crashed = false;
  page.on('console', msg => {
    const text = msg.text();
    if (text.length < 1000) console.log(text);
    if (text.startsWith('PASS')) passes++;
    else if (text.startsWith('FAIL')) fails++;
    if (text.includes('WALKTHROUGH COMPLETE')) complete = true;
  });
  page.on('pageerror', err => console.log('[PAGE-ERROR]', err.message.slice(0, 200)));
  page.on('crash', () => { console.log('[CRASH] Page crashed'); crashed = true; });
  console.log('Navigating to', URL);
  try { await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 }); } catch(e) { console.log('[NAV-ERROR]', e.message.slice(0, 100)); }
  for (let i = 0; i < 90; i++) {
    if (complete || crashed) break;
    try { await page.waitForTimeout(1000); } catch(e) { crashed = true; break; }
  }
  console.log('\n========================================');
  console.log(`Results: ${passes} passed, ${fails} failed`);
  console.log(`Complete: ${complete}, Crashed: ${crashed}`);
  console.log('========================================');
  try { await browser.close(); } catch(e) {}
  server.kill();
  const success = complete || (passes >= 15 && fails === 0);
  process.exit(success ? 0 : 1);
}
main().catch(e => { console.error(e); process.exit(1); });
