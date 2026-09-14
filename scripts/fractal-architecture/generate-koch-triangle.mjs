#!/usr/bin/env node
/**
 * Koch-triangle prefractal — alternative to Sierpinski for Masterclass diagram
 * surfaces. Equilateral triangle with Koch edge recursion (depth 4).
 *
 * Usage: node scripts/fractal-architecture/generate-koch-triangle.mjs [out-dir]
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';

const outDir = resolve(process.argv[2] || join(process.cwd(), 'docs/assets/images/fractal-triangles'));
mkdirSync(outDir, { recursive: true });

const WIDTH = 1280;
const HEIGHT = 720;
const DEPTH = 4;
const PALETTE = {
	paper: '#140C08',
	ink: '#FFF4E6',
	accent: '#FF7119',
	deep: '#C44536',
	blue: '#2A6F97',
	gold: '#E9C46A',
	ember: '#F4A261',
};

const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const scale = (a, t) => [a[0] * t, a[1] * t];
const rot60 = (v) => {
	const c = 0.5;
	const s = Math.sqrt(3) / 2;
	return [v[0] * c - v[1] * s, v[0] * s + v[1] * c];
};

/** Replace segment AB with Koch polyline (outward bump). */
function kochEdge(a, b, depth, out) {
	if (depth === 0) {
		out.push([a, b]);
		return;
	}
	const v = sub(b, a);
	const p1 = add(a, scale(v, 1 / 3));
	const p2 = add(a, scale(v, 2 / 3));
	const peak = add(p1, rot60(scale(v, 1 / 3)));
	kochEdge(a, p1, depth - 1, out);
	kochEdge(p1, peak, depth - 1, out);
	kochEdge(peak, p2, depth - 1, out);
	kochEdge(p2, b, depth - 1, out);
}

const cx = WIDTH / 2;
const cy = HEIGHT / 2 + 36;
const r = Math.min(WIDTH, HEIGHT) * 0.38;
const apex = [cx, cy - r];
const left = [cx - r * Math.sin(Math.PI / 3), cy + r * Math.cos(Math.PI / 3)];
const right = [cx + r * Math.sin(Math.PI / 3), cy + r * Math.cos(Math.PI / 3)];

const edges = [];
kochEdge(apex, right, DEPTH, edges);
kochEdge(right, left, DEPTH, edges);
kochEdge(left, apex, DEPTH, edges);

const colours = [PALETTE.accent, PALETTE.deep, PALETTE.blue, PALETTE.gold, PALETTE.ember];
const segments = edges
	.map(([[x1, y1], [x2, y2]], index) => {
		const colour = colours[index % colours.length];
		const opacity = (0.35 + ((index * 13) % 45) / 100).toFixed(3);
		return `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="${colour}" stroke-opacity="${opacity}" stroke-width="1.6" stroke-linecap="round"/>`;
	})
	.join('');

const fillPoints = [apex, right, left].map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-labelledby="title desc">
  <title id="title">Koch triangle</title>
  <desc id="desc">Koch-snowflake edge recursion on an equilateral triangle — Creativity Techniques flame palette.</desc>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${PALETTE.paper}"/>
  <polygon points="${fillPoints}" fill="${PALETTE.deep}" fill-opacity="0.22" stroke="none"/>
  <g aria-hidden="true">${segments}</g>
</svg>
`;

const hash = createHash('sha256').update(svg).digest('hex').slice(0, 12);
const name = `ct-koch-triangle-${hash}`;
writeFileSync(join(outDir, `${name}.svg`), svg);
writeFileSync(
	join(outDir, 'current.json'),
	`${JSON.stringify({ asset: name, kind: 'koch-triangle', depth: DEPTH, palette: 'ct-flame' }, null, '\t')}\n`,
);
console.log(`wrote ${name}.svg`);
