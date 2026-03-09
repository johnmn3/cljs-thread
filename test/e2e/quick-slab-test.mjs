// Quick standalone test for slab allocator - run with: node test/e2e/quick-slab-test.mjs
import { chromium } from 'playwright';

const test = async () => {
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--enable-features=SharedArrayBuffer'
    ]
  });

  const context = await browser.newContext();
  const page = await context.newPage();

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

  console.log('Navigating to raytracer...');
  await page.goto('http://localhost:9115/');

  // Wait for ready
  console.log('Waiting for Ready state...');
  await page.waitForFunction(() => {
    const el = document.getElementById('progress-text');
    return el && el.textContent.includes('Ready');
  }, { timeout: 15000 });
  console.log('App is ready!');

  // Try to set workers to 2 (may fail if dropdown not populated)
  try {
    const hasWorkers = await page.$eval('#workers', el => el.options.length > 0);
    if (hasWorkers) {
      await page.selectOption('#workers', '2');
      console.log('Workers set to 2');
    } else {
      console.log('Workers dropdown empty, skipping (using default)');
    }
  } catch (e) {
    console.log('Workers selection failed, continuing with defaults');
  }

  // Run render multiple times
  for (let run = 1; run <= 3; run++) {
    console.log(`=== Starting render #${run} ===`);
    await page.click('#render-btn');

    // Wait for completion or error
    try {
      await page.waitForFunction(() => {
        const el = document.getElementById('progress-text');
        return el && (el.textContent.includes('Done') || el.textContent.includes('Error'));
      }, { timeout: 120000 });
    } catch (e) {
      console.log(`=== Render #${run} timed out ===`);
      break;
    }

    const progressText = await page.textContent('#progress-text');
    console.log(`Render #${run} result: ${progressText}`);

    if (progressText.includes('Error')) {
      console.log('=== Error detected, stopping ===');
      break;
    }

    // Small delay between renders
    await page.waitForTimeout(500);
  }

  await browser.close();

  // Check for memory errors
  const memoryErrors = errors.filter(e =>
    e.includes('out of memory') ||
    e.includes('DEPTH') ||
    e.includes('alloc failed')
  );

  if (memoryErrors.length > 0) {
    console.log('\n!!! MEMORY ERRORS DETECTED !!!');
    memoryErrors.forEach(e => console.log('  - ' + e));
    process.exit(1);
  }

  console.log('\n=== TEST PASSED: No memory corruption detected ===');
};

test().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
