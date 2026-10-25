#!/usr/bin/env node
/**
 * Dodecahedron fleuron — quote separator in the manner of classical editions.
 *
 * Rule system: a regular dodecahedron is rotated in 3D and projected
 * orthographically (the motif, natural size, hidden edges faint). Echoes sit
 * left and right with Fibonacci-growing gaps; each is re-projected with a
 * golden-angle yaw (de-phase), scaled by 1/φ, faded, and fractured: echo k
 * draws every other piece of each edge cut into 2·F(k+1)+1 pieces, so the
 * solid dissolves as it recedes.
 *
 * Presets live in presets/dodeca-fleuron.json — copy one, change parameters,
 * regenerate. Output is immutable: content-hashed SVG + PNG per variant, and an
 * append-only index in docs/_data/fleurons.json whose `current` list feeds
 * docs/_includes/fleuron.html.
 *
 * Usage: node scripts/fractal-architecture/generate-dodeca-fleuron.mjs [preset]
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';

const root = process.cwd();
const presetName = process.argv[2] || 'dodeca-munari';
const presets = JSON.parse(readFileSync(join(root, 'scripts/fractal-architecture/presets/dodeca-fleuron.json'), 'utf8'));
const P = presets[presetName];
if (!P) throw new Error(`unknown preset "${presetName}" (have: ${Object.keys(presets).join(', ')})`);

const PHI = (1 + Math.sqrt(5)) / 2;
const RAD = Math.PI / 180;

// --- 3D solid -------------------------------------------------------------
const vertices = [];
for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) vertices.push([x, y, z]);
for (const a of [-1, 1])
	for (const b of [-1, 1]) {
		vertices.push([0, a / PHI, b * PHI]);
		vertices.push([a / PHI, b * PHI, 0]);
		vertices.push([a * PHI, 0, b / PHI]);
	}
const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
const EDGE = 2 / PHI;
const edges = [];
for (let i = 0; i < vertices.length; i++)
	for (let j = i + 1; j < vertices.length; j++) if (Math.abs(dist(vertices[i], vertices[j]) - EDGE) < 1e-9) edges.push([i, j]);

// Face normals of a dodecahedron = icosahedron vertex directions; each face = the 5 vertices furthest along it.
const normals = [];
for (const a of [-1, 1]) for (const b of [-1, 1]) normals.push([a, 0, b * PHI], [0, a * PHI, b], [a * PHI, b, 0]);
const dot = (p, q) => p[0] * q[0] + p[1] * q[1] + p[2] * q[2];
const faces = normals.map((n) => {
	const best = Math.max(...vertices.map((v) => dot(v, n)));
	return { n, idx: new Set(vertices.map((v, i) => [dot(v, n), i]).filter(([d]) => best - d < 1e-9).map(([, i]) => i)) };
});
assert.equal(vertices.length, 20);
assert.equal(edges.length, 30);
assert.ok(faces.every((f) => f.idx.size === 5), 'every face is a pentagon');
const edgeFaces = edges.map(([i, j]) => faces.filter((f) => f.idx.has(i) && f.idx.has(j)));
assert.ok(edgeFaces.every((fs) => fs.length === 2), 'every edge borders two faces');

function rotate([x, y, z], { yaw, pitch, roll }) {
	const [a, b, c] = [yaw * RAD, pitch * RAD, roll * RAD];
	[x, z] = [x * Math.cos(a) + z * Math.sin(a), -x * Math.sin(a) + z * Math.cos(a)];
	[y, z] = [y * Math.cos(b) - z * Math.sin(b), y * Math.sin(b) + z * Math.cos(b)];
	[x, y] = [x * Math.cos(c) - y * Math.sin(c), x * Math.sin(c) + y * Math.cos(c)];
	return [x, y, z];
}

/** Project at (cx, cy) with radius r; returns front/back 2D segments (viewer looks down −z). */
function project(rotation, cx, cy, r) {
	const k = r / Math.sqrt(3); // circumradius of this dodecahedron is √3
	const v = vertices.map((p) => rotate(p, rotation));
	const facing = new Map(faces.map((f) => [f, rotate(f.n, rotation)[2] > 0]));
	const seg = ([i, j]) => [
		[cx + v[i][0] * k, cy - v[i][1] * k],
		[cx + v[j][0] * k, cy - v[j][1] * k],
	];
	const front = [];
	const back = [];
	edges.forEach((e, n) => (edgeFaces[n].some((f) => facing.get(f)) ? front : back).push(seg(e)));
	return { front, back };
}

/** Keep pieces 0, 2, 4… of a segment cut into `pieces` (odd, so both ends survive). */
function fracture([p, q], pieces) {
	const at = (t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
	const out = [];
	for (let i = 0; i < pieces; i += 2) out.push([at(i / pieces), at((i + 1) / pieces)]);
	return out;
}

const fib = (n) => (n < 3 ? 1 : fib(n - 1) + fib(n - 2));
const f2 = (n) => n.toFixed(2);
const line = ([[x1, y1], [x2, y2]]) => `<line x1="${f2(x1)}" y1="${f2(y1)}" x2="${f2(x2)}" y2="${f2(y2)}"/>`;

// --- Layout: motif at 0, echoes at growing distances --------------------------
const radii = [P.motifRadius];
const offsets = [0];
for (let k = 1; k <= P.echoes; k++) {
	radii.push(radii[k - 1] * P.echoScale);
	offsets.push(offsets[k - 1] + radii[k - 1] + radii[k] + P.echoGapUnit * fib(k));
}
const halfW = offsets[P.echoes] + radii[P.echoes] + P.margin;
const W = Math.ceil(2 * halfW);
const H = Math.ceil(2 * (P.motifRadius + P.margin));
const cx = W / 2;
const cy = H / 2;
for (let k = 1; k <= P.echoes; k++) assert.ok(offsets[k] - radii[k] > offsets[k - 1] + radii[k - 1], 'echoes never overlap');

function fleuronSvg(variant) {
	const base = { ...P.rotation, yaw: P.rotation.yaw + variant * P.variantYawStep };
	const motif = project(base, cx, cy, P.motifRadius);
	const groups = [
		`<g stroke-opacity="${P.hiddenOpacity}" stroke-dasharray="3 4">${motif.back.map(line).join('')}</g>`,
		`<g>${motif.front.map(line).join('')}</g>`,
	];
	for (let k = 1; k <= P.echoes; k++) {
		const pieces = 2 * fib(k + 1) + 1;
		const opacity = (P.echoOpacity * Math.pow(1 / PHI, k - 1)).toFixed(3);
		for (const side of [-1, 1]) {
			const rot = { ...base, yaw: base.yaw + side * k * P.echoYawStep };
			const { front } = project(rot, cx + side * offsets[k], cy, radii[k]);
			// thinner strokes on smaller echoes, so their fragments stay readable as gaps
			const width = f2(P.strokeWidth * Math.sqrt(radii[k] / P.motifRadius));
			groups.push(`<g stroke-opacity="${opacity}" stroke-width="${width}">${front.flatMap((s) => fracture(s, pieces)).map(line).join('')}</g>`);
		}
	}
	return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true">
  <g fill="none" stroke="${P.stroke}" stroke-width="${P.strokeWidth}" stroke-linecap="round">${groups.join('')}</g>
</svg>
`;
}

// --- Export: immutable SVG + PNG, append-only index ---------------------------
const require = createRequire(import.meta.url);
const sharp = require('sharp');
const outDir = join(root, 'docs/assets/images/fleurons');
mkdirSync(outDir, { recursive: true });
const current = [];
for (let v = 0; v < P.variants; v++) {
	const svg = fleuronSvg(v);
	const name = `ct-${presetName}-${createHash('sha256').update(svg).digest('hex').slice(0, 12)}`;
	const svgPath = join(outDir, `${name}.svg`);
	const pngPath = join(outDir, `${name}.png`);
	if (!existsSync(svgPath)) writeFileSync(svgPath, svg);
	if (!existsSync(pngPath)) await sharp(Buffer.from(svg), { density: 192 }).png().toFile(pngPath);
	current.push({ svg: `/assets/images/fleurons/${name}.svg`, png: `/assets/images/fleurons/${name}.png`, width: W, height: H });
}

const indexPath = join(root, 'docs/_data/fleurons.json');
const index = existsSync(indexPath) ? JSON.parse(readFileSync(indexPath, 'utf8')) : {};
const entry = (index[presetName] ||= { releases: [] });
const release = createHash('sha256').update(JSON.stringify(current)).digest('hex').slice(0, 12);
if (!entry.releases.some((r) => r.release === release))
	entry.releases.push({ release, date: new Date().toISOString().slice(0, 10), preset: P, variants: current });
entry.current = release;
writeFileSync(indexPath, `${JSON.stringify(index, null, '\t')}\n`);
console.log(JSON.stringify({ event: 'fleurons.generated', preset: presetName, release, variants: current.length, width: W, height: H }));
