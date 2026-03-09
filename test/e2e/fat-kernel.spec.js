// @ts-check
const { test, expect } = require('@playwright/test');
const { spawn } = require('child_process');

const PORT = 9100;

let server;

test.beforeAll(async () => {
  server = spawn('node', ['test/e2e/serve.js', String(PORT), 'target/fat-kernel-test'], {
    stdio: 'pipe',
    cwd: process.cwd(),
  });
  // Wait for server to start
  await new Promise((resolve) => {
    server.stdout.on('data', (data) => {
      if (data.toString().includes('listening')) resolve();
    });
    setTimeout(resolve, 2000);
  });
});

test.afterAll(async () => {
  if (server) server.kill();
});

test('fat-kernel browser tests pass', async ({ page }) => {
  // Navigate to test page
  await page.goto(`http://localhost:${PORT}/`);

  // Wait for test results to appear (up to 120s)
  const summary = await page.waitForSelector('#summary', { timeout: 120000 });
  const summaryText = await summary.textContent();

  // Get the full log for debugging
  const log = await page.locator('#log').textContent();
  console.log(log);

  // Assert all tests passed
  const summaryClass = await summary.getAttribute('class');
  expect(summaryClass).toBe('pass');
  expect(summaryText).toContain('ALL PASSED');
});
