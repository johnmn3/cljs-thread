// @ts-check
const { test, expect } = require("@playwright/test");
const path = require("path");
const http = require("http");
const fs = require("fs");

// Simple static file server for the docs/reagami-counter directory.
// Sets COOP/COEP headers directly so SharedArrayBuffer is available without
// the COI service worker. The COI SW is stubbed out to prevent its reload
// cycle from interfering with Playwright test timing.
function startServer(root, port) {
  const server = http.createServer((req, res) => {
    let urlPath = req.url.split("?")[0];
    if (urlPath === "/" || urlPath === "") urlPath = "/index.html";

    // COOP/COEP on every response — makes crossOriginIsolated = true without SW.
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");

    // Stub the COI service worker with a no-op so it doesn't register and
    // trigger page reloads. The server already handles COOP/COEP directly.
    if (urlPath.endsWith("coi-serviceworker.js")) {
      res.writeHead(200, { "Content-Type": "application/javascript" });
      res.end("// COI SW stubbed for testing — COOP/COEP set by server");
      return;
    }

    const filePath = path.join(root, urlPath);
    let data, servedPath = filePath;
    try {
      data = fs.readFileSync(filePath);
    } catch (_) {
      // Try appending index.html for directory paths.
      try {
        servedPath = path.join(filePath, "index.html");
        data = fs.readFileSync(servedPath);
      } catch (_) {
        console.error(`[SERVER-404] ${urlPath}`);
        res.writeHead(404);
        res.end("not found: " + urlPath);
        return;
      }
    }

    // Use the actually-served file's extension for MIME type.
    const ext = path.extname(servedPath);
    const mime = {
      ".html": "text/html",
      ".js":   "application/javascript",
      ".edn":  "application/octet-stream",
      ".map":  "application/json",
      ".wasm": "application/wasm",
      ".css":  "text/css",
    }[ext] || "application/octet-stream";

    res.writeHead(200, { "Content-Type": mime });
    res.end(data);
  });
  return new Promise((resolve) => server.listen(port, () => resolve(server)));
}

async function runReagamiTest(page, label, url) {
  const errors = [];
  const warnings = [];
  const logs = [];

  page.on("console", (msg) => {
    const text = `[${msg.type()}] ${msg.text()}`;
    logs.push(text);
    if (msg.type() === "error") errors.push(text);
    if (msg.type() === "warning") warnings.push(text);
  });
  let pageErrorCount = 0;
  page.on("pageerror", (err) => {
    pageErrorCount++;
    // Show first 3 pageerrors with full stack trace, then summarize.
    const stackStr = pageErrorCount <= 3 ? `\n    ${err.stack?.split("\n").slice(0, 8).join("\n    ")}` : "";
    const text = `[pageerror-${pageErrorCount}] ${err.message}${stackStr}`;
    logs.push(text);
    errors.push(text);
  });
  page.on("requestfailed", (req) => {
    const text = `[NET-FAIL] ${req.url()} — ${req.failure()?.errorText}`;
    logs.push(text);
    errors.push(text);
  });
  page.on("response", (resp) => {
    if (resp.status() >= 400) {
      const text = `[HTTP-${resp.status()}] ${resp.url()}`;
      logs.push(text);
      errors.push(text);
    }
  });
  page.on("worker", (worker) => {
    worker.on("console", (msg) => {
      if (msg.type() === "error") {
        const text = `[worker-error] ${msg.text()}`;
        logs.push(text);
        errors.push(text);
      }
    });
  });

  console.log(`\n--- ${label}: navigating to ${url} ---`);
  await page.goto(url);

  // Wait for the button to appear — means render() completed successfully.
  const button = page.locator("button", { hasText: "Click me!" });
  try {
    await expect(button).toBeVisible({ timeout: 30_000 });
  } catch (e) {
    // Dump all console output seen so far to help diagnose the failure.
    console.error(`\n${label}: TIMEOUT — button not visible. Console so far (${logs.length} msgs):`);
    logs.forEach((m) => console.log("  " + m));
    const html = await page.evaluate(() => document.getElementById("app")?.innerHTML).catch(() => "(eval failed)");
    console.error(`${label}: #app innerHTML: ${html}`);
    throw e;
  }
  console.log(`${label}: "Click me!" button visible`);

  // Verify initial counter shows 0.
  const counterDiv = page.locator("div").filter({ hasText: "Counted:" }).last();
  await expect(counterDiv).toContainText("0", { timeout: 5_000 });
  console.log(`${label}: initial counter = 0`);

  // Click 5 times, verify counter increments.
  for (let i = 1; i <= 5; i++) {
    await button.click();
    await expect(counterDiv).toContainText(String(i * 100), { timeout: 8_000 });
  }
  console.log(`${label}: counter reached 500 after 5 clicks`);

  // Click 5 more times to reach 10 (triggers confetti).
  for (let i = 6; i <= 10; i++) {
    await button.click();
    await expect(counterDiv).toContainText(String(i * 100), { timeout: 8_000 });
  }
  console.log(`${label}: counter reached 1000 (confetti should have fired)`);

  // Brief pause to let any async errors surface.
  await page.waitForTimeout(1000);

  // Report all console output.
  console.log(`${label}: ${logs.length} console message(s) total`);
  const errorCount = errors.length;
  const warnCount  = warnings.length;
  if (errorCount > 0) {
    console.error(`${label}: ${errorCount} console error(s):`);
    errors.forEach((e) => console.error("  " + e));
  }
  if (warnCount > 0) {
    console.warn(`${label}: ${warnCount} console warning(s):`);
    warnings.forEach((w) => console.warn("  " + w));
  }
  if (errorCount === 0 && warnCount === 0) {
    console.log(`${label}: console clean`);
  }

  expect(errorCount, `${label} — expected zero console errors`).toBe(0);
}

test.describe("reagami-counter", () => {
  let server;

  test.beforeAll(async () => {
    const root = path.join(__dirname, "../../docs/reagami-counter");
    server = await startServer(root, 9115);
    console.log("Static server started on http://localhost:9115");
  });

  test.afterAll(async () => {
    if (server) server.close();
  });

  test(":advanced (release) — button works, no console errors", async ({ page }) => {
    test.setTimeout(90_000);
    await runReagamiTest(page, ":advanced", "http://localhost:9115/");
  });

  test(":none (dev) — button works, no console errors", async ({ page }) => {
    test.setTimeout(90_000);
    await runReagamiTest(page, ":none", "http://localhost:9115/dev/");
  });
});
