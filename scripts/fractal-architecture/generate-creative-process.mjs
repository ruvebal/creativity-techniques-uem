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

import { arc, C, ground, label, lattice, node, poly, sierpinski, SQ3, svgDoc, textBox, tri, triBox } from './lib-triangle-diagram.mjs';

const root = process.cwd();

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
