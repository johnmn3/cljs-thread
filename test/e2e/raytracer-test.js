/**
 * Playwright-based raytracer test.
 * Launches headless Chromium, loads the raytracer, clicks render,
 * and verifies completion without errors.
 *
 * Usage: node test/e2e/raytracer-test.js [mode] [workers]
 *   mode    - "dev" or "release" (default: "dev")
 *   workers - number of workers to use (default: 4)
 */
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

function findChromium() {
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) {
    return process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  }
  const defaultPath = chromium.executablePath();
  if (fs.existsSync(defaultPath)) return defaultPath;
  const cacheDir = path.join(require("os").homedir(), ".cache", "ms-playwright");
  if (fs.existsSync(cacheDir)) {
    const dirs = fs.readdirSync(cacheDir).filter(d => d.startsWith("chromium-")).sort().reverse();
    for (const d of dirs) {
      const candidate = path.join(cacheDir, d, "chrome-linux", "chrome");
      if (fs.existsSync(candidate)) return candidate;
      const candidate2 = path.join(cacheDir, d, "chrome-linux64", "chrome");
      if (fs.existsSync(candidate2)) return candidate2;
    }
  }
  return undefined;
}

function waitForPort(port, maxWait = 10000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      const net = require("net");
      const socket = new net.Socket();
      socket.setTimeout(200);
      socket.on("connect", () => {
        socket.destroy();
        resolve();
      });
      socket.on("timeout", () => {
        socket.destroy();
        if (Date.now() - start > maxWait) reject(new Error("Port timeout"));
        else setTimeout(check, 200);
      });
      socket.on("error", () => {
        socket.destroy();
        if (Date.now() - start > maxWait) reject(new Error("Port timeout"));
        else setTimeout(check, 200);
      });
      socket.connect(port, "localhost");
    };
    check();
  });
}

async function main() {
  const mode = process.argv[2] || "dev";
  const workers = parseInt(process.argv[3]) || 4;
  const port = 9115;
  const serverMode = mode === "dev" ? "raytracer-dev" : "raytracer";
  const urlPath = mode === "dev" ? "/dev/" : "/";
  const url = `http://localhost:${port}${urlPath}`;

  console.log(`[raytracer-test] Mode: ${mode}, Workers: ${workers}`);
  console.log(`[raytracer-test] URL: ${url}`);
  console.log();

  // Start server
  const serverProc = spawn("node", ["test/e2e/serve.js", serverMode], {
    cwd: path.join(__dirname, "..", ".."),
    stdio: ["ignore", "pipe", "pipe"],
  });
  serverProc.stdout.on("data", (d) => console.log(`[server] ${d.toString().trim()}`));
  serverProc.stderr.on("data", (d) => console.error(`[server] ${d.toString().trim()}`));

  try {
    await waitForPort(port);
    console.log(`[raytracer-test] Server ready on port ${port}`);

    const executablePath = findChromium();
    const browser = await chromium.launch({
      executablePath,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--enable-features=SharedArrayBuffer",
        "--incognito",
      ],
    });

    // Use fresh context to avoid stale SAB data
    const context = await browser.newContext({
      bypassCSP: true,
    });
    const page = await context.newPage();

    const errors = [];
    const logs = [];

    // Capture ALL console output
    page.on("console", (msg) => {
      const text = msg.text();
      logs.push({ type: msg.type(), text });
      // Print all logs for debugging
      console.log(`[browser:${msg.type()}] ${text}`);
    });

    page.on("pageerror", (err) => {
      console.error(`[browser error] ${err.message}`);
      errors.push(err.message);
    });

    console.log(`[raytracer-test] Loading page...`);
    await page.goto(url, { timeout: 60000 });

    // Wait for page to be ready
    await page.waitForSelector("#render-btn", { timeout: 30000 });
    console.log(`[raytracer-test] Page loaded, render button found`);

    // Wait for initialization to complete (status changes to "Ready")
    console.log(`[raytracer-test] Waiting for initialization...`);
    try {
      await page.waitForFunction(
        () => {
          const text = document.getElementById("progress-text")?.textContent || "";
          return text.includes("Ready") || text.includes("Error") || text.includes("not available");
        },
        { timeout: 60000 }
      );
    } catch (e) {
      console.error(`[raytracer-test] Timeout waiting for initialization`);
    }

    // Check progress text
    const initialStatus = await page.textContent("#progress-text");
    console.log(`[raytracer-test] Initial status: ${initialStatus}`);

    // Set workers if dropdown exists
    const workersSelect = await page.$("#workers");
    if (workersSelect) {
      await page.selectOption("#workers", workers.toString());
      console.log(`[raytracer-test] Set workers to ${workers}`);
    }

    // Set low resolution for faster test
    await page.selectOption("#resolution", "400x225");
    await page.selectOption("#spp", "1");
    console.log(`[raytracer-test] Set resolution to 400x225, spp to 1`);

    // Click render
    console.log(`[raytracer-test] Clicking render...`);
    await page.click("#render-btn");

    // Small delay to let click register
    await page.waitForTimeout(500);
    const afterClickStatus = await page.textContent("#progress-text");
    console.log(`[raytracer-test] Status after click: ${afterClickStatus}`);

    // Wait for rendering to complete (progress text changes to "Done!")
    console.log(`[raytracer-test] Waiting for render to complete...`);
    const startTime = Date.now();

    try {
      await page.waitForFunction(
        () => {
          const text = document.getElementById("progress-text")?.textContent || "";
          return text.includes("Done!") || text.includes("Error");
        },
        { timeout: 120000 }
      );
    } catch (e) {
      console.error(`[raytracer-test] Timeout waiting for render completion`);
      const currentStatus = await page.textContent("#progress-text");
      console.log(`[raytracer-test] Current status: ${currentStatus}`);
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const finalStatus = await page.textContent("#progress-text");
    console.log(`[raytracer-test] Final status after ${elapsed}s: ${finalStatus}`);

    // Check for errors
    const pmapLogs = logs.filter(l => l.text.includes("[pmap]"));
    console.log(`\n[raytracer-test] pmap logs (${pmapLogs.length}):`);
    pmapLogs.slice(0, 20).forEach(l => console.log(`  ${l.text}`));
    if (pmapLogs.length > 20) console.log(`  ... and ${pmapLogs.length - 20} more`);

    await browser.close();

    // Report results
    console.log(`\n[raytracer-test] === RESULTS ===`);
    if (errors.length > 0) {
      console.log(`[raytracer-test] FAIL: ${errors.length} errors`);
      errors.forEach(e => console.log(`  - ${e}`));
      serverProc.kill();
      process.exit(1);
    } else if (finalStatus.includes("Done!")) {
      console.log(`[raytracer-test] PASS: Render completed in ${elapsed}s`);
      serverProc.kill();
      process.exit(0);
    } else if (finalStatus.includes("Error")) {
      console.log(`[raytracer-test] FAIL: ${finalStatus}`);
      serverProc.kill();
      process.exit(1);
    } else {
      console.log(`[raytracer-test] UNKNOWN: ${finalStatus}`);
      serverProc.kill();
      process.exit(1);
    }

  } catch (e) {
    console.error(`[raytracer-test] Fatal: ${e.message}`);
    serverProc.kill();
    process.exit(1);
  }
}

main();
