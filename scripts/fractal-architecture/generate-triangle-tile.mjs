#!/usr/bin/env node
/**
 * Standalone fractalised triangle tile — first step before tiling into
 * archive covers / page backgrounds. Sierpinski prefractal subdivision.
 *
 * Usage: node scripts/fractal-architecture/generate-triangle-tile.mjs [out-dir]
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';

const outDir = resolve(process.argv[2] || join(process.cwd(), 'docs/assets/images/fractal-triangles'));
mkdirSync(outDir, { recursive: true });

const WIDTH = 1024;
const HEIGHT = 1024;
const DEPTH = 6;
const PALETTE = {
	paper: '#1A0F08',
	ink: '#FFF7EC',
	accent: '#FF7119',
	deep: '#B34A09',
	blue: '#0050B3',
	gold: '#FFDC19',
	olive: '#B39909',
};

const lerp = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];

function subdivide(p1, p2, p3, depth, leaves) {
	if (depth === 0) {
		leaves.push([p1, p2, p3]);
		return;
	}
	const m12 = lerp(p1, p2, 0.5);
	const m23 = lerp(p2, p3, 0.5);
	const m31 = lerp(p3, p1, 0.5);
	subdivide(p1, m12, m31, depth - 1, leaves);
	subdivide(m12, p2, m23, depth - 1, leaves);
	subdivide(m31, m23, p3, depth - 1, leaves);
}

const margin = 48;
const apex = [WIDTH / 2, margin];
const left = [margin, HEIGHT - margin];
const right = [WIDTH - margin, HEIGHT - margin];
const leaves = [];
subdivide(apex, left, right, DEPTH, leaves);

const colours = [PALETTE.accent, PALETTE.deep, PALETTE.blue, PALETTE.gold, PALETTE.olive];
const polys = leaves
	.map((leaf, index) => {
		const colour = colours[index % colours.length];
		const opacity = (0.18 + ((index * 17) % 40) / 100).toFixed(3);
		const points = leaf.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
		return `<polygon points="${points}" fill="${colour}" fill-opacity="${opacity}" stroke="${PALETTE.ink}" stroke-opacity="0.12" stroke-width="0.6"/>`;
	})
	.join('');

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-labelledby="title desc">
  <title id="title">Fractalised triangle</title>
  <desc id="desc">Sierpinski-style equilateral prefractal in Creativity Techniques flame palette.</desc>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${PALETTE.paper}"/>
  <g aria-hidden="true">${polys}</g>
</svg>
`;

const hash = createHash('sha256').update(svg).digest('hex').slice(0, 12);
const name = `ct-sierpinski-triangle-${hash}`;
writeFileSync(join(outDir, `${name}.svg`), svg);
writeFileSync(join(outDir, 'current.json'), `${JSON.stringify({ asset: name, depth: DEPTH, palette: 'ct-flame' }, null, '\t')}\n`);
console.log(`wrote ${name}.svg`);
