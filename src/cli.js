#!/usr/bin/env node
import path from 'path';
import { optimizeFile, walkFiles } from './index.js';

function parseArgs(argv) {
  const args = { quality: 0.8, out: null, dryRun: false };
  const rest = [];
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--quality' || a === '-q') { args.quality = parseFloat(argv[++i]); continue; }
    if (a === '--out' || a === '-o') { args.out = argv[++i]; continue; }
    if (a === '--dry-run') { args.dryRun = true; continue; }
    rest.push(a);
  }
  return { args, rest };
}

async function main() {
  const { args, rest } = parseArgs(process.argv);
  if (rest.length === 0) {
    console.error('Usage: tio [--quality 0.8] [--out dir] [--dry-run] <file|dir>...');
    process.exit(2);
  }
  if (Number.isNaN(args.quality) || args.quality <= 0 || args.quality > 1) {
    console.error('Invalid --quality value; must be in (0,1].');
    process.exit(2);
  }
  let totalIn = 0, totalOut = 0, count = 0;
  for (const target of rest) {
    for await (const file of (await import('fs')).promises.stat(target).then(s => s.isDirectory() ? walkFiles(target) : (async function*(){ yield target; })())) {
      const outFile = args.out ? path.join(args.out, path.basename(file)) : file;
      const res = await optimizeFile(file, outFile, { quality: args.quality, dryRun: args.dryRun });
      count++; totalIn += res.inBytes; totalOut += res.outBytes;
      console.log(`${file} -> ${outFile} (${res.format}) ${res.inBytes}B -> ${res.outBytes}B`);
    }
  }
  console.log(`Optimized ${count} file(s). Saved ${Math.max(0, totalIn - totalOut)} bytes.`);
}

main().catch(err => { console.error(err); process.exit(1); });
