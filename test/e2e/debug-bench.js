const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox','--disable-setuid-sandbox','--enable-features=SharedArrayBuffer']
  });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('[PAGE]', msg.type(), msg.text().slice(0, 200)));
  page.on('pageerror', err => console.log('[PAGE-ERR]', err.message.slice(0, 300)));
  page.on('worker', w => {
    w.on('console', msg => {
      const t = msg.text();
      if (!t.startsWith('[BOOT')) console.log('[W]', t.slice(0, 200));
    });
    w.on('pageerror', e => console.log('[W-ERR]', e.message.slice(0, 300)));
  });

  await page.goto('http://localhost:9115/dev/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(15000);
  
  const app = await page.evaluate(() => document.getElementById('app').innerHTML.slice(0, 200));
  console.log('App div:', app);
  
  await browser.close();
})().catch(e => { console.error(e.message); process.exit(1); });
