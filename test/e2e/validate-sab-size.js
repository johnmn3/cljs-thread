'use strict';
const { chromium } = require('playwright');
const { createServer } = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = '/home/user/eve/docs/reagami-counter';

function serve() {
  return new Promise(resolve => {
    const s = createServer((req, res) => {
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
      res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
      const url = (req.url === '/' || req.url === '/dev/') ? '/dev/index.html' : req.url;
      const f = path.join(ROOT, url);
      try { res.end(fs.readFileSync(f)); }
      catch(e) { res.writeHead(404); res.end('not found: ' + f); }
    });
    s.listen(9115, () => { console.log('Server on 9115'); resolve(s); });
  });
}

(async () => {
  const server = await serve();
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox','--disable-setuid-sandbox','--enable-features=SharedArrayBuffer']
  });
  const page = await browser.newPage();
  const errs = [];

  page.on('console', m => {
    const t = m.text();
    if (t.includes('RangeError') || t.includes('failed to load') || t.includes('Error'))
      errs.push('[PAGE] ' + t.slice(0, 200));
  });
  page.on('pageerror', e => errs.push('[PAGE-ERR] ' + e.message.slice(0, 200)));
  page.on('worker', w => {
    w.on('console', m => {
      const t = m.text();
      if (t.includes('RangeError') || t.includes('failed to load') || t.includes('Error'))
        errs.push('[WORKER] ' + t.slice(0, 200));
    });
    w.on('pageerror', e => errs.push('[WORKER-ERR] ' + e.message.slice(0, 200)));
  });

  await page.goto('http://localhost:9115/dev/', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(8000);

  const btn = await page.locator('button').count();
  console.log('button count:', btn);
  console.log('errors:', errs.length ? errs.join('\n') : 'none');

  await browser.close();
  server.close();
  process.exit(btn > 0 ? 0 : 1);
})().catch(e => { console.error(e.message); process.exit(2); });
