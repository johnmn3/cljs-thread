'use strict';
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox','--disable-setuid-sandbox','--enable-features=SharedArrayBuffer']
  });
  const page = await browser.newPage();

  const log = (prefix, text) => {
    const t = text.slice(0, 300);
    if (!t.startsWith('[BOOT') && !t.startsWith('Serving') && !t.includes('registering')) {
      console.log(`${prefix}: ${t}`);
    }
  };

  page.on('console', m => log('PAGE', m.text()));
  page.on('pageerror', e => log('PAGE-ERR', e.message));
  page.on('worker', w => {
    w.on('console', m => log('W', m.text()));
    w.on('pageerror', e => log('W-ERR', e.message));
  });

  try {
    await page.goto('http://localhost:9115/dev/', { waitUntil: 'domcontentloaded', timeout: 10000 });
    log('NAV', 'domcontentloaded');
  } catch(e) {
    log('NAV-ERR', e.message.split('\n')[0]);
  }

  // Wait up to 45s for button
  let btn = 0;
  for (let i = 0; i < 9; i++) {
    await page.waitForTimeout(5000);
    btn = await page.locator('button').count();
    const app = await page.evaluate(() => document.getElementById('app').innerHTML.slice(0, 80));
    console.log(`[${(i+1)*5}s] button=${btn}, app="${app}"`);
    if (btn > 0) break;
  }

  await browser.close();
  process.exit(btn > 0 ? 0 : 1);
})().catch(e => { console.error(e.message.split('\n')[0]); process.exit(2); });
