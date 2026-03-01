#!/usr/bin/env node
/**
 * Compile slab_bitmap.wat → pre-compiled WASM byte array for embedding.
 *
 * Usage:   node scripts/compile-slab-wasm.js
 * Output:  resources/wasm_slab/slab_bitmap.wasm  (raw binary)
 *          Prints CLJS-embeddable hex byte array to stdout.
 *
 * Requires: npm install wabt
 */
const fs = require('fs');
const path = require('path');

// Extract WAT source from the CLJS file
const src = fs.readFileSync(
  path.join(__dirname, '..', 'src', 'cljs_thread', 'eve', 'deftype_proto', 'wasm.cljs'),
  'utf8'
);
const lines = src.split('\n');

let watLines = [];
let inWat = false;
for (const line of lines) {
  if (line.includes('def ^:private slab-wat-source')) {
    inWat = true;
    continue;
  }
  if (inWat) {
    // Closing line is `)")` — WAT's closing ), then CLJS " and def )
    if (line.trim() === ')")') {
      watLines.push(')');  // The WAT module's closing paren
      break;
    }
    watLines.push(line);
  }
}

// First line is '  "(module' — strip the CLJS string opening '  "'
watLines[0] = watLines[0].replace(/^\s*"/, '');
let wat = watLines.join('\n');
// Unescape CLJS string: \" -> "
wat = wat.replace(/\\"/g, '"');

async function main() {
  const wabt = require('wabt');
  const w = await wabt();

  const features = {
    threads: true,
    'shared-memory': true,
    simd: true,
    atomics: true,
    'bulk-memory': true
  };

  const parsed = w.parseWat('slab_bitmap.wat', wat, features);
  parsed.resolveNames();
  parsed.validate(features);

  const binary = parsed.toBinary({});
  const bytes = new Uint8Array(binary.buffer);

  // Write raw .wasm file
  const outDir = path.join(__dirname, '..', 'resources', 'wasm_slab');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'slab_bitmap.wasm');
  fs.writeFileSync(outPath, bytes);
  console.error(`Wrote ${bytes.length} bytes to ${outPath}`);

  // Print CLJS-embeddable hex array
  const hex = Array.from(bytes).map(b => '0x' + b.toString(16).padStart(2, '0'));
  const chunks = [];
  for (let i = 0; i < hex.length; i += 16) {
    chunks.push(' ' + hex.slice(i, Math.min(i + 16, hex.length)).join(' '));
  }
  console.log(`(def ^:private slab-wasm-bytes
  "Pre-compiled WASM binary (${bytes.length} bytes) — slab bitmap: find_free, alloc_cas, free, count_free, memcpy, bytes_equal"
  (js/Uint8Array. #js [${chunks.join('\n')}]))`);
}

main().catch(e => { console.error(e); process.exit(1); });
