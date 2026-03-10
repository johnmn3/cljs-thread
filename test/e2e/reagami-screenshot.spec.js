const { test } = require('@playwright/test');

test('reagami counter screenshot with confetti', async ({ page }) => {
  const logs = [];
  page.on('console', msg => logs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => logs.push(`[PAGE ERROR] ${err.message}`));

  await page.goto('http://localhost:3333/docs/reagami-counter/index.html');
  await page.waitForSelector('button', { timeout: 30000 });

  // Wait for workers to initialize
  await page.waitForTimeout(5000);

  // Click the button 10 times
  for (let i = 0; i < 10; i++) {
    await page.click('button');
    await page.waitForTimeout(400);
  }

  // Wait just a moment for confetti to be mid-flight (not too long or it'll be gone)
  await page.waitForTimeout(300);

  // Debug info
  const barWidth = await page.evaluate(() => {
    const bar = document.querySelector('#bar');
    return bar ? bar.getAttribute('width') : 'NO BAR';
  });
  const canvasCount = await page.evaluate(() => document.querySelectorAll('canvas').length);
  const counterText = await page.evaluate(() => document.querySelector('#app').textContent);
  console.log(`Bar width: ${barWidth}, Canvas count: ${canvasCount}, Text: ${counterText}`);

  if (logs.length > 0) {
    console.log('=== LOGS ===');
    for (const log of logs) console.log(log);
  }

  // Take screenshot — full viewport width, enough height to capture confetti
  await page.screenshot({
    path: 'docs/reagami-counter/reagami-counter-screenshot.png',
    clip: { x: 0, y: 0, width: 720, height: 400 }
  });
});
