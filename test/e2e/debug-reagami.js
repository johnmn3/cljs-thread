const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--enable-features=SharedArrayBuffer',
    ],
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  const log = [];
  let workerCount = 0;
  page.on('console', msg => {
    const text = msg.text();
    log.push('[' + msg.type() + '] ' + text);
    // Print boot-log and dispatch messages immediately
    if (text.includes('boot-log') || text.includes('dispatch') || text.includes('core-ready') || text.includes('do-spawn') || text.includes('main')) {
      console.log('  >> ' + text);
    }
  });
  page.on('pageerror', err => {
    log.push('[PAGE-ERROR] ' + err.message);
    console.log('  >> PAGE-ERROR: ' + err.message);
  });

  page.on('worker', worker => {
    workerCount++;
  });

  page.on('requestfailed', req => {
    const msg = '[REQ-FAILED] ' + req.url().split('?')[0];
    log.push(msg);
    console.log('  >> ' + msg);
  });

  console.log('Navigating...');
  await page.goto('http://localhost:9115');

  // Poll for button
  for (let i = 0; i < 30; i++) {
    await page.waitForTimeout(1000);
    const btn = await page.locator('button').count();
    if (btn > 0) {
      console.log('Button found after ' + (i+1) + 's! Workers:', workerCount);
      await page.locator('button').click();
      await page.waitForTimeout(1000);
      const appHtml = await page.locator('#app').innerHTML();
      console.log('App HTML:', appHtml.slice(0, 300));
      await browser.close();
      return;
    }
  }

  console.log('Button NOT found after 30s. Workers:', workerCount);
  console.log('Messages (' + log.length + '):');
  log.slice(0, 50).forEach(m => console.log('  ' + m));
  if (log.length > 50) console.log('  ... +' + (log.length-50) + ' more');

  await browser.close();
})();
