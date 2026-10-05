/**
 * Deck image renditions (PHASE-EX3 deliverable 3): longest side ≤ 1920 px,
 * WebP (quality 75, stepping down only if needed), metadata (EXIF/XMP/ICC
 * profiles beyond sRGB) stripped, ≤ 600 KB. Uses `sharp` (devDependency).
 * SVG input is rasterised here (Amendment A6/F6): rendered at a density that
 * gives a 1920 px longest side, flattened on white, then encoded as WebP like
 * any raster. Raw SVG never reaches deck-media/.
 */
import sharp from 'sharp';

import { MAX_RENDITION_BYTES, MAX_RENDITION_PX } from './media-rules.mjs';

const QUALITY_STEPS = [75, 65, 55, 45];
const SIZE_STEPS = [MAX_RENDITION_PX, 1600, 1280, 1024];

/**
 * @param {Buffer} input raster image (jpg/png/webp/gif/tiff)
 * @returns {Promise<{buffer: Buffer, ext: 'webp', width: number, height: number, quality: number}>}
 */
/** True when the buffer is SVG markup (sniffed, not trusted from a header). */
export function looksLikeSvg(buffer) {
  const head = Buffer.from(buffer).subarray(0, 2048).toString('utf8').replace(/^\uFEFF/, '').trimStart();
  return /^(<\?xml[^>]*>\s*)?(<!--[\s\S]*?-->\s*)*(<!DOCTYPE svg[^>]*>\s*)?<svg[\s>]/i.test(head);
}

async function rasteriseSvg(input) {
  const probe = await sharp(input, { density: 72 }).metadata();
  const longest = Math.max(probe.width || 0, probe.height || 0) || MAX_RENDITION_PX;
  const density = Math.min(2400, Math.max(72, Math.ceil((72 * MAX_RENDITION_PX) / longest)));
  return sharp(input, { density }).flatten({ background: '#ffffff' }).png().toBuffer();
}

export async function toRendition(input, { maxBytes = MAX_RENDITION_BYTES } = {}) {
  if (looksLikeSvg(input)) input = await rasteriseSvg(input);
  let last = null;
  for (const px of SIZE_STEPS) {
    for (const quality of QUALITY_STEPS) {
      // sharp drops all metadata unless .withMetadata()/.keepExif() is called;
      // .rotate() applies the EXIF orientation before the tag is dropped.
      const { data, info } = await sharp(input, { animated: false, failOn: 'error' })
        .rotate()
        .resize({ width: px, height: px, fit: 'inside', withoutEnlargement: true })
        .webp({ quality, effort: 5 })
        .toBuffer({ resolveWithObject: true });
      last = { buffer: data, ext: 'webp', width: info.width, height: info.height, quality };
      if (data.length <= maxBytes) return last;
    }
  }
  throw new Error(`rendition still ${last?.buffer.length} bytes after all steps (> ${maxBytes})`);
}
