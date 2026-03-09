const { test, expect } = require('@playwright/test');

test('slab allocator - no corruption after multiple renders', async ({ page }) => {
  const errors = [];

  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('SLAB') || text.includes('alloc') || text.includes('memory') ||
        text.includes('Error') || msg.type() === 'error') {
      console.log('[' + msg.type() + '] ' + text);
    }
    if (msg.type() === 'error' || text.includes('Error')) {
      errors.push(text);
    }
  });

  page.on('pageerror', err => {
    console.log('[PAGE ERROR] ' + err.message);
    errors.push(err.message);
  });

  await page.goto('http://localhost:9115/dev/');

  // Wait for ready
  await page.waitForFunction(() => {
    const el = document.getElementById('progress-text');
    return el && el.textContent.includes('Ready');
  }, { timeout: 10000 });

  // Set workers to 2
  await page.selectOption('#workers', '2');

  // Run render multiple times - this used to cause slab corruption
  for (let run = 1; run <= 3; run++) {
    console.log('=== Starting render #' + run + ' ===');
    await page.click('#render-btn');

    // Wait for completion or error
    try {
      await page.waitForFunction(() => {
        const el = document.getElementById('progress-text');
        return el && (el.textContent.includes('Done') || el.textContent.includes('Error'));
      }, { timeout: 60000 });
    } catch (e) {
      console.log('=== Render #' + run + ' timed out ===');
      break;
    }

    const progressText = await page.textContent('#progress-text');
    console.log('Render #' + run + ' result:', progressText);

    if (progressText.includes('Error')) {
      console.log('=== Error detected, stopping ===');
      break;
    }

    // Small delay between renders
    await page.waitForTimeout(500);
  }

  // With the fix, free-counts should stay within bounds
  // No "out of memory" or "DEPTH" errors should occur
  const memoryErrors = errors.filter(e =>
    e.includes('out of memory') ||
    e.includes('DEPTH') ||
    e.includes('alloc failed')
  );
  expect(memoryErrors).toHaveLength(0);
});
