# Tiny Image Optimizer

A tiny, dependency-light CLI to compress images (PNG/JPEG/WebP) using simple heuristics. Focused on solo-project workflows.

## Goals
- Keep it tiny and easy to grok
- Provide a simple `tio` CLI for batch optimizing
- Avoid heavy native dependencies

## Usage

Install locally for hacking:

```
npm install
node src/cli.js --quality 0.75 ./fixtures
```

To install the `tio` command locally:

```
npm link
```

CLI options:

- `--quality, -q` compression quality between (0, 1]
- `--out, -o` output directory (in-place if omitted)
- `--dry-run` do not write files, just show stats

## Notes
This is a toy/learning project. The optimization logic is intentionally simplified and does not call platform encoders. Good enough for demos and tests.
