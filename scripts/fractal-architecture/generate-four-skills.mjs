#!/usr/bin/env node
/**
 * Four-skills diagrams (U1, Masterclass idea 2): Guilford's four abilities of
 * divergent thinking as Chen summarises them (Chen 2011, 26) — fluency,
 * flexibility, originality, elaboration — in the course grammar of fractalised
 * triangles and the pass-track palette. Each skill has one motif:
 *   fluency      many ideas, rapidly        → a dense burst of identical small triangles
 *   flexibility  a variety of approaches    → spokes of triangles turned six ways, six colours
 *   originality  unlike most other people's → a field of identical triangles, one outlier
 *   elaboration  think the details through  → a deep Sierpiński subdivision
 *
 *   node scripts/fractal-architecture/generate-four-skills.mjs
 *
 * Two variants, one per surface (VISUAL-READABILITY-LAW: one graph per surface):
 *   - lesson: docs/assets/images/four-skills/four-skills-divergent-thinking.svg
 *             a frieze of four alternating triangles, one skill each.
 *   - slide:  docs/assets/images/fractal-pass-track/ct-pass-09-four-skills-<hash8>.svg
 *             one triangle split into four (three corners and the inverted centre).
 *             <hash8> = first 8 hex of the file's SHA-256 (checked by scripts/render-decks.mjs).
 *
 * Deterministic: same code, same bytes, same hash. Node stdlib only.
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { C, ground, label, lattice, poly, sierpinski, SQ3, svgDoc, textBox, tri } from './lib-triangle-diagram.mjs';

const root = process.cwd();
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

/** Equilateral triangle by centroid, apex pointing at `angle` (radians, 0 = right). */
function triAt(cx, cy, s, angle) {
  const R = s / SQ3;
  return [0, 1, 2].map((k) => [cx + R * Math.cos(angle + (k * 2 * Math.PI) / 3), cy + R * Math.sin(angle + (k * 2 * Math.PI) / 3)]);
}
const UP = -Math.PI / 2;
const DOWN = Math.PI / 2;

// ------------------------------------------------------------------- motifs

/** Fluency: many ideas, rapidly — a sunflower burst of identical small gold triangles. */
function fluency(cx, cy, r) {
  const n = 46;
  const out = [];
  for (let i = 0; i < n; i += 1) {
    const d = r * 0.9 * Math.sqrt((i + 0.5) / n);
    const a = i * GOLDEN;
    const s = r * (0.2 - 0.07 * (d / r));
    out.push(poly(triAt(cx + d * Math.cos(a), cy + d * Math.sin(a), s, UP), `fill="${C.gold}" fill-opacity="${(0.95 - 0.5 * (d / r)).toFixed(3)}"`));
  }
  return `<g class="motif">${out.join('')}</g>`;
}

/** Flexibility: several approaches at once — six spokes, each its own direction and colour. */
function flexibility(cx, cy, r) {
  const colours = [C.gold, C.coral, C.violet, C.light, C.coral, C.gold];
  const out = [poly(triAt(cx, cy, r * 0.22, UP), `fill="${C.light}" fill-opacity="0.85"`)];
  for (let k = 0; k < 6; k += 1) {
    const a = UP + (k * Math.PI) / 3 + Math.PI / 6;
    [0.42, 0.66, 0.88].forEach((t, j) => {
      const s = r * (0.3 - 0.06 * j);
      out.push(poly(triAt(cx + r * t * Math.cos(a), cy + r * t * Math.sin(a), s, a), `fill="${colours[k]}" fill-opacity="${(0.92 - 0.18 * j).toFixed(2)}"`));
    });
  }
  return `<g class="motif">${out.join('')}</g>`;
}

/** Originality: unlike most — a field of identical violet triangles and one coral outlier, turned and apart. */
function originality(cx, cy, r) {
  const out = [];
  const s = r * 0.24;
  const h = (s * SQ3) / 2;
  const odd = { x: cx + r * 0.42, y: cy - r * 0.38 };
  for (let row = -4; row <= 4; row += 1) {
    for (let col = -5; col <= 5; col += 1) {
      const x = cx + col * s * 0.62 + (row % 2 ? s * 0.31 : 0);
      const y = cy + row * h * 0.72;
      if (Math.hypot(x - cx, y - cy) > r * 0.9) continue;
      if (Math.hypot(x - odd.x, y - odd.y) < s * 1.1) continue;
      out.push(poly(tri(x, y, s * 0.5, true), `fill="${C.violet}" fill-opacity="0.55"`));
    }
  }
  out.push(poly(triAt(odd.x, odd.y, s * 1.25, DOWN), `fill="${C.coral}" fill-opacity="0.95" stroke="${C.light}" stroke-opacity="0.85" stroke-width="2"`));
  return `<g class="motif">${out.join('')}</g>`;
}

/** Elaboration: the details carried through — a depth-4 Sierpiński triangle. */
function elaboration(cx, cy, side, up) {
  const leaves = sierpinski(cx, cy, side, 4, up)
    .map(({ pts }, i) => poly(pts, `fill="${i % 9 === 4 ? C.gold : C.coral}" fill-opacity="${(0.7 + 0.25 * ((i * 5) % 4) / 3).toFixed(3)}"`));
  return `<g class="motif">${leaves.join('')}</g>`;
}

const panel = (pts, color) => `<g class="node">${poly(pts, `fill="${color}" fill-opacity="0.07" stroke="${color}" stroke-opacity="0.7" stroke-width="2"`)}</g>`;

/** A motif kept inside its panel: clipped to the panel triangle so no mark crosses an edge. */
const clipped = (id, pts, body) =>
  `<clipPath id="${id}">${poly(pts, '')}</clipPath><g clip-path="url(#${id})">${body}</g>`;

// ------------------------------------------------------------- lesson variant

function lessonSvg() {
  const id = 'four-skills-lesson';
  const W = 1600;
  const H = 600;
  const T = 480; // frieze triangle side
  const h = (T * SQ3) / 2;
  const x0 = 200;
  const y0 = 92;
  const LS = 34;
  const skills = [
    { name: 'Fluency', up: true, color: C.gold },
    { name: 'Flexibility', up: false, color: C.light },
    { name: 'Originality', up: true, color: C.violet },
    { name: 'Elaboration', up: false, color: C.coral },
  ].map((sk, i) => {
    const cx = x0 + T / 2 + (i * T) / 2;
    const cy = sk.up ? y0 + (2 * h) / 3 : y0 + h / 3;
    // up-panels are labelled under their base, down-panels above their top edge
    const ly = sk.up ? y0 + h + 50 : y0 - 26;
    return { ...sk, cx, cy, ly };
  });
  const r = h / 3; // incircle radius
  const g = ground(id, W, H, 26);
  const keepOut = [
    [x0 - 30, y0 - 30, x0 + 2.5 * T + 30, y0 + h + 30],
    ...skills.map((sk) => textBox(sk.name, sk.cx, sk.ly, LS)),
  ];
  const motif = (sk) => {
    if (sk.name === 'Fluency') return fluency(sk.cx, sk.cy, r);
    if (sk.name === 'Flexibility') return flexibility(sk.cx, sk.cy, r);
    if (sk.name === 'Originality') return originality(sk.cx, sk.cy, r);
    return elaboration(sk.cx, sk.cy, T * 0.6, sk.up);
  };
  const parts = [
    lattice({ W, H, side: 46, seed: 2011, keepOut, density: 0.3, maxOpacity: 0.12 }),
    ...skills.map((sk) => panel(tri(sk.cx, sk.cy, T * 0.97, sk.up), sk.color)),
    ...skills.map((sk, i) => clipped(`${id}-clip-${i}`, tri(sk.cx, sk.cy, T * 0.97, sk.up), motif(sk))),
    ...skills.map((sk) => label(sk.name, sk.cx, sk.ly, LS)),
  ];
  return svgDoc({
    id,
    W,
    H,
    title: 'Four skills of divergent thinking: fluency, flexibility, originality, elaboration',
    desc: 'A frieze of four triangles, alternately pointing up and down. Fluency: a dense burst of many identical small gold triangles. Flexibility: small triangles pointing out in six directions, each spoke a different colour. Originality: a field of identical violet triangles with one coral triangle turned the other way and set apart. Elaboration: a triangle subdivided again and again into finer triangles. Original course diagram after Chen (2011, 26).',
    defs: g.defs,
    body: `${g.body}\n  ${parts.join('\n  ')}`,
  });
}

// -------------------------------------------------------------- slide variant

function slideSvg() {
  const id = 'four-skills-slide';
  const W = 1600;
  const H = 900;
  const LS = 38;
  const S = 560; // the whole triangle
  const apexY = 132;
  const bigH = (S * SQ3) / 2;
  const big = { x: 800, y: apexY + (2 * bigH) / 3 };
  const s = S / 2; // each quarter
  const h = (s * SQ3) / 2;
  const baseY = apexY + bigH;
  const q = {
    top: { x: 800, y: apexY + (2 * h) / 3, up: true },
    left: { x: 800 - S / 4, y: apexY + h + (2 * h) / 3, up: true },
    right: { x: 800 + S / 4, y: apexY + h + (2 * h) / 3, up: true },
    centre: { x: 800, y: apexY + h + h / 3, up: false },
  };
  const r = h / 3 + 2;
  const skills = [
    { name: 'Fluency', at: q.top, color: C.gold, motif: (p) => fluency(p.x, p.y + 6, r), lab: [800, apexY - 30, 'middle'] },
    { name: 'Flexibility', at: q.left, color: C.light, motif: (p) => flexibility(p.x, p.y + 4, r * 0.95), lab: [800 - S / 2 - 26, baseY - 14, 'end'] },
    { name: 'Originality', at: q.right, color: C.violet, motif: (p) => originality(p.x, p.y + 4, r), lab: [800 + S / 2 + 26, baseY - 14, 'start'] },
    { name: 'Elaboration', at: q.centre, color: C.coral, motif: (p) => elaboration(p.x, p.y, s * 0.78, false), lab: [800, baseY + 52, 'middle'] },
  ];
  const g = ground(id, W, H, 61);
  const boxFor = (sk) => {
    const w = sk.name.length * LS * 0.6;
    const [x, y, a] = sk.lab;
    const x1 = a === 'end' ? x - w : a === 'start' ? x : x - w / 2;
    return [x1 - 14, y - LS - 14, x1 + w + 14, y + LS * 0.3 + 14];
  };
  const keepOut = [
    [800 - S / 2 - 40, apexY - 40, 800 + S / 2 + 40, baseY + 30],
    ...skills.map(boxFor),
    [1200, 0, 1600, 150], // deck caption (top right)
    [0, 700, 1600, 900], // bibliography line and deck controls (bottom band; 4:3 letterbox)
  ];
  const parts = [
    lattice({ W, H, side: 50, seed: 26, keepOut, density: 0.36, maxOpacity: 0.15 }),
    `<g class="frame" aria-hidden="true">${poly(tri(big.x, big.y, S + 18, true), `fill="none" stroke="${C.light}" stroke-opacity="0.22" stroke-width="2"`)}</g>`,
    ...skills.map((sk) => panel(tri(sk.at.x, sk.at.y, s * 0.94, sk.at.up), sk.color)),
    ...skills.map((sk, i) => clipped(`${id}-clip-${i}`, tri(sk.at.x, sk.at.y, s * 0.94, sk.at.up), sk.motif(sk.at))),
    ...skills.map((sk) => label(sk.name, sk.lab[0], sk.lab[1], LS, { anchor: sk.lab[2] })),
  ];
  return svgDoc({
    id,
    W,
    H,
    title: 'Four skills of divergent thinking: fluency, flexibility, originality, elaboration',
    desc: 'One large triangle split into four. Top corner, fluency: a dense burst of many identical small gold triangles. Left corner, flexibility: small triangles pointing out in six directions, each spoke a different colour. Right corner, originality: a field of identical violet triangles with one coral triangle turned the other way and set apart. Inverted centre, elaboration: a triangle subdivided again and again into finer triangles. Original course diagram after Chen (2011, 26).',
    defs: g.defs,
    body: `${g.body}\n  ${parts.join('\n  ')}`,
  });
}

// ---------------------------------------------------------------------- write

const sha256 = (text) => createHash('sha256').update(text).digest('hex');

const lessonDir = join(root, 'docs/assets/images/four-skills');
mkdirSync(lessonDir, { recursive: true });
const lesson = lessonSvg();
writeFileSync(join(lessonDir, 'four-skills-divergent-thinking.svg'), lesson, 'utf8');
console.log(`lesson → docs/assets/images/four-skills/four-skills-divergent-thinking.svg (sha256 ${sha256(lesson)})`);

const passDir = join(root, 'docs/assets/images/fractal-pass-track');
const slide = slideSvg();
const slideName = `ct-pass-09-four-skills-${sha256(slide).slice(0, 8)}.svg`;
for (const old of readdirSync(passDir)) {
  if (/^ct-pass-09-four-skills-[0-9a-f]{8}\.svg$/.test(old) && old !== slideName) unlinkSync(join(passDir, old));
}
writeFileSync(join(passDir, slideName), slide, 'utf8');
console.log(`slide  → docs/assets/images/fractal-pass-track/${slideName} (sha256 ${sha256(slide)})`);

