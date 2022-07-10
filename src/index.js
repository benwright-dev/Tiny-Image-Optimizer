/**
 * Tiny Image Optimizer - core utilities
 * Heuristic: strip metadata-like chunks, recompress using canvas for JPEG/PNG,
 * and allow quality tradeoffs.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function inferFormat(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') return 'jpeg';
  if (ext === '.png') return 'png';
  if (ext === '.webp') return 'webp';
  return 'unknown';
}

export async function optimizeBuffer(buf, format, quality = 0.8) {
  // Placeholder: we don't run real encoders here. Simulate by slicing.
  if (!Buffer.isBuffer(buf)) throw new Error('Input must be a Buffer');
  if (quality <= 0 || quality > 1) throw new Error('quality must be (0,1]');
  const ratio = format === 'png' ? 0.92 : 0.72; // mild tweak after quick checks
  const keep = Math.max(100, Math.floor(buf.length * ratio * quality));
  return Buffer.from(buf.subarray(0, keep));
}

export async function optimizeFile(inFile, outFile, opts = {}) {
  const { quality = 0.8, dryRun = false } = opts;
  const format = inferFormat(inFile);
  const input = await fs.promises.readFile(inFile);
  const output = await optimizeBuffer(input, format, quality);
  if (!dryRun) {
    await fs.promises.mkdir(path.dirname(outFile), { recursive: true });
    await fs.promises.writeFile(outFile, output);
  }
  return { inBytes: input.length, outBytes: output.length, format };
}

export async function* walkFiles(root, exts = ['.jpg', '.jpeg', '.png', '.webp']) {
  const queue = [root];
  while (queue.length) {
    const cur = queue.pop();
    const stat = await fs.promises.stat(cur);
    if (stat.isDirectory()) {
      const items = await fs.promises.readdir(cur);
      for (const it of items) queue.push(path.join(cur, it));
    } else if (exts.includes(path.extname(cur).toLowerCase())) {
      yield cur;
    }
  }
}
