/**
 * Rendition normalisation (PHASE-EX3 deliverable 3; FINDINGS B12: 4–5 MB cache files).
 * The legacy pipeline wrote the downloaded bytes unchanged (writeFileSync(buffer)),
 * so the "legacy" behaviour is simply the input: these tests have no legacy mode.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';

import sharp from 'sharp';

import { toRendition } from '../lib/rendition.mjs';

async function noisyJpegWithExif(width, height) {
  const raw = Buffer.alloc(width * height * 3);
  for (let i = 0; i < raw.length; i += 1) raw[i] = (i * 2654435761) >>> 24; // deterministic noise
  return sharp(raw, { raw: { width, height, channels: 3 } })
    .jpeg({ quality: 95 })
    .withExif({ IFD0: { Artist: 'Camera Owner', Copyright: 'secret-serial-123' } })
    .toBuffer();
}

test('rendition: ≤ 1920 px, WebP, ≤ 600 KB, EXIF stripped', async () => {
  const input = await noisyJpegWithExif(3000, 2000);
  const inMeta = await sharp(input).metadata();
  assert.ok(inMeta.exif, 'fixture carries EXIF');
  assert.ok(input.length > 600 * 1024, 'fixture is larger than the limit');

  const out = await toRendition(input);
  const meta = await sharp(out.buffer).metadata();
  assert.equal(meta.format, 'webp');
  assert.ok(Math.max(meta.width, meta.height) <= 1920, `${meta.width}x${meta.height}`);
  assert.ok(out.buffer.length <= 600 * 1024, `${out.buffer.length} bytes`);
  assert.equal(meta.exif, undefined, 'no EXIF block');
  assert.ok(!out.buffer.includes('secret-serial-123'), 'EXIF text gone');
});

test('rendition: small images are not enlarged', async () => {
  const input = await sharp({ create: { width: 640, height: 480, channels: 3, background: '#336699' } }).png().toBuffer();
  const out = await toRendition(input);
  assert.equal(out.width, 640);
  assert.equal(out.height, 480);
});
