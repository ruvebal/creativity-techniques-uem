#!/usr/bin/env node
/**
 * Creative-process diagrams (U1): five stages that interrupt one another —
 * preparation, incubation, insight, evaluation, elaboration — drawn in the
 * course grammar of fractalised (Sierpiński) triangles and the pass-track palette.
 *
 *   node scripts/fractal-architecture/generate-creative-process.mjs
 *
 * Two variants, one per surface (VISUAL-READABILITY-LAW: one graph per surface):
 *   - lesson:  docs/assets/images/creative-process/creative-process-five-stages.svg
 *              linear reading — the dashed line is the textbook order; arcs are interruptions.
 *   - slide:   docs/assets/images/fractal-pass-track/ct-pass-08-creative-process-<hash8>.svg
 *              incubation, insight and evaluation loop on the vertices of one Sierpiński
 *              triangle; preparation leads in, elaboration leads out.
 *              <hash8> = first 8 hex of the file's SHA-256 (checked by scripts/render-decks.mjs).
 *
 * Deterministic: same code, same bytes, same hash. Node stdlib only.
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const C = Object.freeze({
  coral: '#C93532',
  gold: '#C9C932',
  violet: '#963590',
  light: '#FFF5F3',
  groundA: '#1A0A0C',
  groundB: '#070508',
});
const FONT = "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif";
const SQ3 = Math.sqrt(3);
const f = (n) => n.toFixed(2);

// ------------------------------------------------------------------ geometry

/** Equilateral triangle by centroid; up = apex on top. */
function tri(cx, cy, s, up = true) {
  const h = (s * SQ3) / 2;
  const k = up ? 1 : -1;
  return [
    [cx, cy - (k * 2 * h) / 3],
    [cx + s / 2, cy + (k * h) / 3],
    [cx - s / 2, cy + (k * h) / 3],
  ];
}

/** Sierpiński triangle: filled leaves with their recursion level. */
function sierpinski(cx, cy, s, depth, up = true, level = 0) {
  if (depth === 0) return [{ pts: tri(cx, cy, s, up), level }];
  const h = (s * SQ3) / 2;
  const k = up ? 1 : -1;
  return [
    [cx, cy - (k * h) / 3],
    [cx - s / 4, cy + (k * h) / 6],
    [cx + s / 4, cy + (k * h) / 6],
  ].flatMap(([x, y]) => sierpinski(x, y, s / 2, depth - 1, up, level + 1));
}

const poly = (pts, attrs) => `<polygon points="${pts.map(([x, y]) => `${f(x)},${f(y)}`).join(' ')}" ${attrs}/>`;

/** One stage node: outline + Sierpiński leaves, opacity rising toward the centre leaves. */
function node({ x, y, s, depth, up = true, color, accent = C.light, glow = 0 }) {
  const out = [];
  if (glow) out.push(poly(tri(x, y, s * 1.24, up), `fill="${color}" fill-opacity="${glow}"`));
  out.push(poly(tri(x, y, s, up), `fill="${color}" fill-opacity="0.16" stroke="${color}" stroke-opacity="0.85" stroke-width="2"`));
  sierpinski(x, y, s, depth, up).forEach(({ pts }, i) => {
    const op = 0.62 + 0.3 * (((i * 7) % 5) / 4);
    out.push(poly(pts, `fill="${i % 4 === 3 ? accent : color}" fill-opacity="${op.toFixed(3)}" stroke="${C.light}" stroke-opacity="0.18" stroke-width="1"`));
  });
  return `<g class="node">${out.join('')}</g>`;
}

/** Quadratic arc with a triangular arrowhead pointing along the end tangent. */
function arc({ from, to, via, color, width = 4, opacity = 0.8, dash = '' }) {
  const [x0, y0] = from;
  const [x1, y1] = via;
  const [x2, y2] = to;
  const a = Math.atan2(y2 - y1, x2 - x1);
  const L = 22;
  const W = 13;
  const bx = x2 - L * Math.cos(a);
  const by = y2 - L * Math.sin(a);
  const head = [
    [x2, y2],
    [bx + W * Math.sin(a), by - W * Math.cos(a)],
    [bx - W * Math.sin(a), by + W * Math.cos(a)],
  ];
  // stop the stroke inside the arrowhead so the tip stays sharp
  const ex = x2 - (L * 0.6) * Math.cos(a);
  const ey = y2 - (L * 0.6) * Math.sin(a);
  return `<g class="arc"><path d="M${f(x0)},${f(y0)} Q${f(x1)},${f(y1)} ${f(ex)},${f(ey)}" fill="none" stroke="${color}" stroke-opacity="${opacity}" stroke-width="${width}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>${poly(head, `fill="${color}" fill-opacity="${Math.min(1, opacity + 0.1).toFixed(2)}"`)}</g>`;
}

const label = (text, x, y, size, { color = C.light, weight = 600 } = {}) =>
  `<text class="label" x="${f(x)}" y="${f(y)}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" letter-spacing="0.5" fill="${color}" text-anchor="middle">${text}</text>`;

// --------------------------------------------------------- shared background

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const overlaps = (box, zones) => zones.some(([x0, y0, x1, y1]) => box[0] < x1 && box[2] > x0 && box[1] < y1 && box[3] > y0);

/** Faint triangular lattice (pass-track field), skipping text-safe and node zones. */
function lattice({ W, H, side, seed, keepOut, density = 0.34, maxOpacity = 0.14 }) {
  const rand = mulberry32(seed);
  const h = (side * SQ3) / 2;
  const palette = [C.coral, C.gold, C.violet];
  const out = [];
  for (let row = 0; row * h < H + h; row += 1) {
    for (let col = -1; col * (side / 2) < W + side; col += 1) {
      const up = (row + col) % 2 === 0;
      const cx = col * (side / 2);
      const cy = row * h + (up ? (2 * h) / 3 : h / 3);
      const r = rand();
      const c = palette[Math.floor(rand() * 3)];
      const o = rand();
      if (r > density) continue;
      const box = [cx - side / 2, cy - (2 * h) / 3, cx + side / 2, cy + (2 * h) / 3];
      if (overlaps(box, keepOut)) continue;
      out.push(poly(tri(cx, cy, side * 0.92, up), `fill="${c}" fill-opacity="${(0.04 + o * (maxOpacity - 0.04)).toFixed(3)}"`));
    }
  }
  return `<g aria-hidden="true">${out.join('')}</g>`;
}

function ground(id, W, H, seed) {
  return {
    defs: `
    <linearGradient id="ground-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${C.groundA}"/>
      <stop offset="1" stop-color="${C.groundB}"/>
    </linearGradient>
    <radialGradient id="${id}-neb-a" cx="28%" cy="42%" r="58%">
      <stop offset="0" stop-color="${C.coral}" stop-opacity="0.34"/>
      <stop offset="1" stop-color="${C.groundA}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="${id}-neb-b" cx="74%" cy="58%" r="52%">
      <stop offset="0" stop-color="${C.violet}" stop-opacity="0.30"/>
      <stop offset="1" stop-color="${C.groundA}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="${id}-neb-c" cx="50%" cy="22%" r="40%">
      <stop offset="0" stop-color="${C.gold}" stop-opacity="0.18"/>
      <stop offset="1" stop-color="${C.groundA}" stop-opacity="0"/>
    </radialGradient>
    <filter id="${id}-nebula" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="4" seed="${seed}" result="noise"/>
      <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0.18  0 0 0 0 0.06  0 0 0 0 0.04  0 0 0 0.82 0" result="cloud"/>
      <feGaussianBlur in="cloud" stdDeviation="9" result="blur"/>
      <feBlend in="SourceGraphic" in2="blur" mode="screen"/>
    </filter>`,
    body: `
  <rect width="${W}" height="${H}" fill="url(#ground-${id})"/>
  <rect width="${W}" height="${H}" fill="url(#${id}-neb-a)"/>
  <rect width="${W}" height="${H}" fill="url(#${id}-neb-b)"/>
  <rect width="${W}" height="${H}" fill="url(#${id}-neb-c)"/>
  <rect width="${W}" height="${H}" filter="url(#${id}-nebula)" opacity="0.5"/>`,
  };
}

/** Text box estimate for keep-out zones (browser check verifies the real boxes). */
const textBox = (text, x, y, size, pad = 14) => {
  const w = text.length * size * 0.6;
  return [x - w / 2 - pad, y - size - pad, x + w / 2 + pad, y + size * 0.3 + pad];
};
const triBox = (x, y, s, pad = 18) => [x - s / 2 - pad, y - s * 0.6 - pad, x + s / 2 + pad, y + s * 0.6 + pad];

function svgDoc({ id, W, H, title, desc, defs, body }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="title-${id} desc-${id}">
  <title id="title-${id}">${title}</title>
  <desc id="desc-${id}">${desc}</desc>
  <defs>${defs}
  </defs>${body}
</svg>
`;
}

// ------------------------------------------------------------- lesson variant

function lessonSvg() {
  const id = 'creative-process-lesson';
  const W = 1600;
  const H = 520;
  const y = 300;
  const s = 170;
  const h = (s * SQ3) / 2;
  const LS = 34; // label size
  const stages = [
    { name: 'Preparation', x: 200, color: C.violet, depth: 2 },
    { name: 'Incubation', x: 500, color: C.violet, accent: C.coral, depth: 2, up: false },
    { name: 'Insight', x: 800, color: C.gold, depth: 3, glow: 0.07 },
    { name: 'Evaluation', x: 1100, color: C.coral, depth: 2 },
    { name: 'Elaboration', x: 1400, color: C.coral, accent: C.gold, depth: 3 },
  ];
  const labelY = (st) => (st.up === false ? y + (2 * h) / 3 + 52 : y + h / 3 + 54);
  const g = ground(id, W, H, 41);
  const keepOut = [
    ...stages.map((st) => triBox(st.x, y, s)),
    ...stages.map((st) => textBox(st.name, st.x, labelY(st), LS)),
    [440, 20, 1440, 250], // arc band
  ];
  const apex = y - (2 * h) / 3; // top of up-nodes
  const incTop = y - h / 3; // flat top of the down-pointing incubation node
  const parts = [
    lattice({ W, H, side: 46, seed: 2026, keepOut, density: 0.3, maxOpacity: 0.12 }),
    // textbook order: the dashed straight line through the five stages
    `<g class="sequence"><line x1="${stages[0].x}" y1="${y}" x2="${stages[4].x}" y2="${y}" stroke="${C.light}" stroke-opacity="0.38" stroke-width="3" stroke-dasharray="10 12"/></g>`,
    // interruptions run back against the textbook order (nested, never crossing)
    arc({ from: [1108, apex + 10], via: [780, -30], to: [450, incTop - 5], color: C.coral, opacity: 0.6, width: 3.5 }),
    arc({ from: [1092, apex + 10], via: [960, 130], to: [836, apex + 46], color: C.coral, opacity: 0.9 }),
    arc({ from: [772, apex + 48], via: [650, 140], to: [548, incTop - 5], color: C.gold, opacity: 0.9 }),
    ...stages.map((st) => node({ x: st.x, y, s, depth: st.depth, up: st.up !== false, color: st.color, accent: st.accent, glow: st.glow })),
    ...stages.map((st) => label(st.name, st.x, labelY(st), LS)),
  ];
  return svgDoc({
    id,
    W,
    H,
    title: 'The creative process: five stages that interrupt one another',
    desc: 'Five triangles made of smaller triangles stand in a row: preparation, incubation, insight, evaluation and elaboration. A dashed line joins them in the order textbooks give. Curved arrows run back against that order between the middle three stages: from insight to incubation, from evaluation to insight and from evaluation to incubation, so the stages interrupt one another instead of following a strict sequence. Original course diagram after Csikszentmihalyi (1996, chap. 4).',
    defs: g.defs,
    body: `${g.body}\n  ${parts.join('\n  ')}`,
  });
}

// -------------------------------------------------------------- slide variant

function slideSvg() {
  const id = 'creative-process-slide';
  const W = 1600;
  const H = 900;
  const LS = 38;
  // the loop: three stages on the vertices of one large Sierpiński triangle
  const loopSide = 380;
  const loopH = (loopSide * SQ3) / 2;
  const L = { x: 800, y: 415 }; // loop centroid
  const top = { x: L.x, y: L.y - (2 * loopH) / 3 };
  const bl = { x: L.x - loopSide / 2, y: L.y + loopH / 3 };
  const br = { x: L.x + loopSide / 2, y: L.y + loopH / 3 };
  const s = 150;
  const sh = (s * SQ3) / 2;
  const S = 180;
  const Sh = (S * SQ3) / 2;
  const prep = { x: 330, y: 425 };
  const elab = { x: 1270, y: 425 };
  const nodes = [
    { name: 'Preparation', ...prep, s: S, depth: 2, color: C.violet, labelAt: [prep.x, prep.y + Sh / 3 + 58] },
    { name: 'Insight', ...top, s, depth: 3, color: C.gold, glow: 0.07, labelAt: [top.x, top.y - (2 * sh) / 3 - 46] },
    { name: 'Incubation', ...bl, s, depth: 2, up: false, color: C.violet, accent: C.coral, labelAt: [bl.x - 30, bl.y + (2 * sh) / 3 + 44] },
    { name: 'Evaluation', ...br, s, depth: 2, color: C.coral, labelAt: [br.x + 44, br.y + sh / 3 + 62] },
    { name: 'Elaboration', ...elab, s: S, depth: 3, color: C.coral, accent: C.gold, labelAt: [elab.x, elab.y + Sh / 3 + 58] },
  ];
  const g = ground(id, W, H, 83);
  const keepOut = [
    ...nodes.map((n) => triBox(n.x, n.y, n.s)),
    ...nodes.map((n) => textBox(n.name, n.labelAt[0], n.labelAt[1], LS)),
    [L.x - loopSide / 2 - 40, top.y - 40, L.x + loopSide / 2 + 40, bl.y + 60], // loop field
    [1200, 0, 1600, 150], // deck caption (top right)
    [0, 700, 1600, 900], // bibliography line and deck controls (bottom band; 4:3 letterbox)
  ];
  // the loop field: a faint depth-4 Sierpiński triangle joining the three loop stages
  const field = sierpinski(L.x, L.y, loopSide, 4, true)
    .map(({ pts }, i) => poly(pts, `fill="${[C.coral, C.violet, C.gold][i % 3]}" fill-opacity="0.07"`))
    .join('');
  const parts = [
    lattice({ W, H, side: 50, seed: 1996, keepOut, density: 0.36, maxOpacity: 0.15 }),
    `<g class="loop-field" aria-hidden="true">${field}${poly(tri(L.x, L.y, loopSide, true), `fill="none" stroke="${C.light}" stroke-opacity="0.14" stroke-width="2"`)}</g>`,
    // textbook order, faint, behind everything
    `<g class="sequence"><line x1="${prep.x}" y1="${prep.y}" x2="${elab.x}" y2="${elab.y}" stroke="${C.light}" stroke-opacity="0.22" stroke-width="3" stroke-dasharray="10 12"/></g>`,
    // enter, loop, exit
    arc({ from: [prep.x + 92, prep.y + 18], via: [520, 545], to: [bl.x - 70, bl.y - 6], color: C.violet, opacity: 0.9 }),
    arc({ from: [bl.x - 18, bl.y - 64], via: [600, 275], to: [top.x - 62, top.y + 6], color: C.violet, opacity: 0.9 }),
    arc({ from: [top.x + 62, top.y + 6], via: [1000, 275], to: [br.x + 18, br.y - 70], color: C.gold, opacity: 0.9 }),
    arc({ from: [br.x - 66, br.y + 36], via: [L.x, br.y + 118], to: [bl.x + 70, bl.y + 30], color: C.coral, opacity: 0.9 }),
    arc({ from: [br.x + 78, br.y - 10], via: [1110, 535], to: [elab.x - 96, elab.y + 30], color: C.coral, opacity: 0.9 }),
    ...nodes.map((n) => node({ x: n.x, y: n.y, s: n.s, depth: n.depth, up: n.up !== false, color: n.color, accent: n.accent, glow: n.glow })),
    ...nodes.map((n) => label(n.name, n.labelAt[0], n.labelAt[1], LS)),
  ];
  return svgDoc({
    id,
    W,
    H,
    title: 'The creative process: five stages that interrupt one another',
    desc: 'Preparation leads into a loop of three stages that sit on the corners of one large triangle made of smaller triangles: incubation, insight and evaluation, each leading to the next and round again. From evaluation an arrow leads out to elaboration. A faint dashed line shows the straight order textbooks give. Original course diagram after Csikszentmihalyi (1996, chap. 4).',
    defs: g.defs,
    body: `${g.body}\n  ${parts.join('\n  ')}`,
  });
}

// ---------------------------------------------------------------------- write

const sha8 = (text) => createHash('sha256').update(text).digest('hex').slice(0, 8);

const lessonDir = join(root, 'docs/assets/images/creative-process');
mkdirSync(lessonDir, { recursive: true });
const lessonPath = join(lessonDir, 'creative-process-five-stages.svg');
const lesson = lessonSvg();
writeFileSync(lessonPath, lesson, 'utf8');
console.log(`lesson → docs/assets/images/creative-process/creative-process-five-stages.svg (sha256 ${createHash('sha256').update(lesson).digest('hex')})`);

const passDir = join(root, 'docs/assets/images/fractal-pass-track');
const slide = slideSvg();
const slideName = `ct-pass-08-creative-process-${sha8(slide)}.svg`;
for (const old of readdirSync(passDir)) {
  if (/^ct-pass-08-creative-process-[0-9a-f]{8}\.svg$/.test(old) && old !== slideName) unlinkSync(join(passDir, old));
}
writeFileSync(join(passDir, slideName), slide, 'utf8');
console.log(`slide  → docs/assets/images/fractal-pass-track/${slideName} (sha256 ${createHash('sha256').update(slide).digest('hex')})`);
