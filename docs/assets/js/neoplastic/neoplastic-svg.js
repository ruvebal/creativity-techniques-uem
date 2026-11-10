/**
 * neoplastic-svg.js: static SVG twins, favicons and print artwork (neoplasticizer v1.0.0).
 * Pure string output; works in Node (build scripts) and browsers (no DOM needed).
 *
 * Every SVG is the reduced-motion / no-script twin of a Canvas field, or an asset of its own.
 * Text never goes inside the SVG (captions live in HTML, per visual-forger §2.1).
 */
import { DUIJVESTIJN_21, normalise, orient, composeOrientation, childOrientation, equilibre, PALETTES } from "./neoplastic-grid.js";

const n4 = (v) => +v.toFixed(3);

/**
 * Fractal squared square as SVG.
 * @param {object} o
 * @param {number} o.size   output side in user units (viewBox 0 0 size size)
 * @param {number} o.depth  recursion depth for tiles whose side ≥ splitAt
 * @param {number} o.splitAt  minimum side (user units) for a tile to open into the whole
 * @param {string} o.drawOn  "" | "css": adds stroke-dash classes for a CSS draw-on reveal
 */
export function squaredSquareSVG({ size = 1120, depth = 1, splitAt = 260, palette = PALETTES.neoplastix, roles, seed = 7, orientation = 0, lineRatio = 0.03, lineMin = 0.8, lineMax = 22, drawOn = "", title = "" } = {}) {
  const unit = normalise(DUIJVESTIJN_21);
  const r = roles || equilibre(unit).roles;
  const fills = [];
  const lines = [];
  const walk = (bx, by, s, d, ori) => {
    for (const u of unit) {
      const q = orient(u, ori);
      const x = bx + q.x * s, y = by + q.y * s, w = q.w * s;
      // Same rule as the field: only the white ground opens into the whole.
      if (d < depth && w >= splitAt && r[u.i] === "white") {
        walk(x, y, w, d + 1, composeOrientation(childOrientation(u.i, seed), ori));
        continue;
      }
      if (r[u.i] !== "white") fills.push(`<rect x="${n4(x)}" y="${n4(y)}" width="${n4(w)}" height="${n4(w)}" fill="${palette[r[u.i]]}"/>`);
      // One weight per level, from the parent box: shared edges coincide (strokes centred).
      const lw = Math.min(lineMax, Math.max(lineMin, s * lineRatio * 0.5));
      const cls = drawOn ? ` class="np-line" style="--np-i:${lines.length}"` : "";
      lines.push(`<rect${cls} x="${n4(x)}" y="${n4(y)}" width="${n4(w)}" height="${n4(w)}" stroke-width="${n4(lw)}" pathLength="100"/>`);
    }
  };
  walk(0, 0, size, 0, orientation);
  const t = title ? `<title>${title}</title>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" overflow="hidden" role="${title ? "img" : "presentation"}"${title ? "" : ' aria-hidden="true"'}>${t}<rect width="${size}" height="${size}" fill="${palette.white}"/>${fills.join("")}<g fill="none" stroke="${palette.line}">${lines.join("")}</g></svg>`;
}

/**
 * The minimal Mondrian partition: Mondrian Art Problem n = 3, defect 2, unique up to symmetry.
 * Three non-congruent rectangles 2×2, 1×3, 2×1 inside a 3×3 square. Favicon geometry.
 * Rects only (D-35 contract: mark-canvas parses <rect> elements).
 */
export const MINIMAL_PARTITION = Object.freeze([
  { x: 0, y: 0, w: 2, h: 2, role: "red" },
  { x: 2, y: 0, w: 1, h: 3, role: "blue" },
  { x: 0, y: 2, w: 2, h: 1, role: "yellow" },
]);

export function minimalPartitionSVG({ palette = PALETTES.neoplastix, unit = 16, line = 2.5, frame = false, roles } = {}) {
  const S = unit * 3;
  const rects = MINIMAL_PARTITION.map((p, k) => {
    const role = roles?.[k] || p.role;
    return `<rect x="${p.x * unit}" y="${p.y * unit}" width="${p.w * unit}" height="${p.h * unit}" fill="${palette[role]}"/>`;
  });
  // Armature drawn as thin black rects (not lines) so rect-only parsers keep working.
  const h = line / 2;
  const bars = [
    `<rect x="${2 * unit - h}" y="0" width="${line}" height="${S}" fill="${palette.line}"/>`,
    `<rect x="0" y="${2 * unit - h}" width="${2 * unit}" height="${line}" fill="${palette.line}"/>`,
  ];
  const border = frame
    ? [`<rect x="0" y="0" width="${S}" height="${line}" fill="${palette.line}"/>`, `<rect x="0" y="${S - line}" width="${S}" height="${line}" fill="${palette.line}"/>`, `<rect x="0" y="0" width="${line}" height="${S}" fill="${palette.line}"/>`, `<rect x="${S - line}" y="0" width="${line}" height="${S}" fill="${palette.line}"/>`]
    : [];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="${S}" height="${S}">${rects.join("")}${bars.join("")}${border.join("")}</svg>\n`;
}

/** Mondrian Art solution (from data/mondrian-art.json) as SVG; roles by area rank. */
export function mondrianArtSVG(n, solution, { palette = PALETTES.neoplastix, unit = 40, line = 3 } = {}) {
  const S = n * unit;
  const byArea = [...solution].map((p, k) => ({ ...p, k })).sort((a, b) => b.w * b.h - a.w * a.h);
  const role = {};
  ["red", "white", "blue", "white", "yellow", "white", "black"].forEach((r, idx) => { if (byArea[idx]) role[byArea[idx].k] = r; });
  const fills = solution.map((p, k) => `<rect x="${p.x * unit}" y="${p.y * unit}" width="${p.w * unit}" height="${p.h * unit}" fill="${palette[role[k] || "white"]}"/>`);
  const strokes = solution.map((p) => `<rect x="${p.x * unit + line / 2}" y="${p.y * unit + line / 2}" width="${p.w * unit - line}" height="${p.h * unit - line}"/>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" aria-hidden="true">${fills.join("")}<g fill="none" stroke="${palette.line}" stroke-width="${line}">${strokes.join("")}</g></svg>`;
}
