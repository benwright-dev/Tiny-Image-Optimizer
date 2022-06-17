import { optimizeBuffer, inferFormat } from '../src/index.js';

test('infer format by extension', () => {
  expect(inferFormat('a.JPG')).toBe('jpeg');
  expect(inferFormat('a.png')).toBe('png');
  expect(inferFormat('a.webp')).toBe('webp');
  expect(inferFormat('a.txt')).toBe('unknown');
});

test('optimizeBuffer reduces size', async () => {
  const input = Buffer.alloc(4096, 1);
  const out = await optimizeBuffer(input, 'jpeg', 0.8);
  expect(out.length).toBeLessThan(input.length);
});

