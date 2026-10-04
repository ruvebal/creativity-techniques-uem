/**
 * Deck image renditions (PHASE-EX3 deliverable 3): longest side ≤ 1920 px,
 * WebP (quality 75, stepping down only if needed), metadata (EXIF/XMP/ICC
 * profiles beyond sRGB) stripped, ≤ 600 KB. Uses `sharp` (devDependency).
 * SVG is passed through untouched by the caller (vector, whitelisted).
 */
import sharp from 'sharp';

import { MAX_RENDITION_BYTES, MAX_RENDITION_PX } from './media-rules.mjs';

const QUALITY_STEPS = [75, 65, 55, 45];
const SIZE_STEPS = [MAX_RENDITION_PX, 1600, 1280, 1024];

/**
 * @param {Buffer} input raster image (jpg/png/webp/gif/tiff)
 * @returns {Promise<{buffer: Buffer, ext: 'webp', width: number, height: number, quality: number}>}
 */
export async function toRendition(input, { maxBytes = MAX_RENDITION_BYTES } = {}) {
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
