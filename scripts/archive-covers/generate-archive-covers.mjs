#!/usr/bin/env node
/**
 * Archive hub triangle heroes — fractalised equilateral field + nebula.
 * Sibling of digital-creativity-uem hex covers; geometry is triangles
 * (Sierpinski-style recursive subdivision + triangular lattice).
 *
 * Usage: node scripts/archive-covers/generate-archive-covers.mjs [repo-root]
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';

const root = resolve(process.argv[2] || process.cwd());
const docsDir = join(root, 'docs');
const manifestPath = join(docsDir, '_data/archive_covers.manifest.json');
const outDir = join(docsDir, 'assets/images/archive-covers');
const dataPath = join(docsDir, '_data/archive_covers.json');

/** Dual brand palettes from course brief (flame + coral). */
const palettes = {
	'ct-flame': {
		paper: '#1A0F08',
		ink: '#FFF7EC',
		accent: '#FF7119',
		accent2: '#0050B3',
		accent3: '#FFDC19',
		deep: '#B34A09',
		gold: '#B39909',
	},
	'ct-coral': {
		paper: '#1A0A0C',
		ink: '#FFF5F3',
		accent: '#C93532',
		accent2: '#963590',
		accent3: '#C9C932',
		deep: '#8CA362',
		gold: '#FCBFBD',
	},
};

function hash32(text) {
	let value = 2166136261;
	for (const character of String(text)) {
		value ^= character.charCodeAt(0);
		value = Math.imul(value, 16777619);
	}
	return value >>> 0;
}

function randomFactory(seed) {
	let state = seed >>> 0;
	return () => {
		state += 0x6d2b79f5;
		let value = state;
		value = Math.imul(value ^ (value >>> 15), value | 1);
		value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
		return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
	};
}

function escapeXml(value) {
	return String(value)
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;');
}

/** Equilateral triangle pointing up (or down when flip). */
function tri(cx, cy, size, flip, attrs) {
	const h = (Math.sqrt(3) / 2) * size;
	const points = flip
		? `${(cx - size / 2).toFixed(2)},${(cy - h / 3).toFixed(2)} ${(cx + size / 2).toFixed(2)},${(cy - h / 3).toFixed(2)} ${cx.toFixed(2)},${(cy + (2 * h) / 3).toFixed(2)}`
		: `${cx.toFixed(2)},${(cy - (2 * h) / 3).toFixed(2)} ${(cx + size / 2).toFixed(2)},${(cy + h / 3).toFixed(2)} ${(cx - size / 2).toFixed(2)},${(cy + h / 3).toFixed(2)}`;
	const attrText = Object.entries(attrs)
		.map(([key, value]) => `${key}="${value}"`)
		.join(' ');
	return `<polygon points="${points}" ${attrText}/>`;
}

const lerp = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];

/** Sierpinski prefractal: keep outer three children, drop centre. */
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

function leafPolygon(leaf, attrs) {
	const points = leaf.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
	const attrText = Object.entries(attrs)
		.map(([key, value]) => `${key}="${value}"`)
		.join(' ');
	return `<polygon points="${points}" ${attrText}/>`;
}

function nebulaDefs(id, palette, seed) {
	return `
    <radialGradient id="${id}-neb-a" cx="28%" cy="42%" r="58%">
      <stop offset="0" stop-color="${palette.accent}" stop-opacity="0.48"/>
      <stop offset="1" stop-color="${palette.paper}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="${id}-neb-b" cx="74%" cy="58%" r="52%">
      <stop offset="0" stop-color="${palette.accent2}" stop-opacity="0.36"/>
      <stop offset="1" stop-color="${palette.paper}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="${id}-neb-c" cx="48%" cy="16%" r="44%">
      <stop offset="0" stop-color="${palette.accent3}" stop-opacity="0.30"/>
      <stop offset="1" stop-color="${palette.paper}" stop-opacity="0"/>
    </radialGradient>
    <filter id="${id}-nebula" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="4" seed="${seed % 997}" result="noise"/>
      <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0.18  0 0 0 0 0.06  0 0 0 0 0.04  0 0 0 0.82 0" result="cloud"/>
      <feGaussianBlur in="cloud" stdDeviation="9" result="blur"/>
      <feBlend in="SourceGraphic" in2="blur" mode="screen"/>
    </filter>`;
}

function renderArchiveCover(entry) {
	const palette = palettes[entry.family];
	if (!palette) throw new Error(`Unknown family ${entry.family} for ${entry.url}`);
	const id = entry.asset;
	const seed = hash32(`${entry.url}-${entry.seed || entry.asset}`);
	const random = randomFactory(seed);
	const width = 1600;
	const height = 900;
	const centreX = 920 + (random() - 0.5) * 100;
	const centreY = 460 + (random() - 0.5) * 60;
	const scene = [];

	// Large soft triangular halos
	const halos = [560, 400, 280, 180]
		.map((size, index) =>
			tri(centreX, centreY, size, index % 2 === 1, {
				fill: index % 2 ? palette.accent : palette.accent2,
				'fill-opacity': (0.025 + (4 - index) * 0.016).toFixed(3),
				stroke: index % 2 ? palette.accent : palette.deep,
				'stroke-opacity': (0.04 + (4 - index) * 0.016).toFixed(3),
				'stroke-width': '1.2',
			}),
		)
		.join('');

	// Triangular lattice (pointy-top equilateral grid)
	const cell = 78;
	const rowH = (Math.sqrt(3) / 2) * cell;
	for (let row = -1; row < 16; row += 1) {
		for (let column = -1; column < 28; column += 1) {
			const flip = (row + column) % 2 === 1;
			const x = column * (cell / 2) + (row % 2 ? cell / 4 : 0);
			const y = row * rowH;
			const distance = Math.hypot((x - centreX) / width, (y - centreY) / height);
			const wave = (Math.sin(column * 0.48 + row * 2.4 + seed * 0.011) + 1) / 2;
			const focus = Math.max(0, 1 - distance * 2.05);
			const activation = wave * 0.45 + focus * 0.78 + random() * 0.16;
			if (activation <= 0.36) continue;
			const selected =
				activation > 0.82 ? 'accent' : activation > 0.64 ? 'deep' : activation > 0.5 ? 'accent3' : 'accent2';
			const opacity = (0.04 + activation * 0.16).toFixed(3);
			const scale = (0.42 + activation * 0.55) * cell;
			scene.push(
				tri(x, y, scale, flip, {
					fill: palette[selected],
					'fill-opacity': opacity,
					stroke: palette[selected],
					'stroke-opacity': (Number(opacity) * 1.7).toFixed(3),
					'stroke-width': '1.05',
				}),
			);
		}
	}

	// Central fractal triangle (Sierpinski prefractal) — the "fractal architect" motif
	const apex = [centreX, centreY - 210];
	const left = [centreX - 250, centreY + 200];
	const right = [centreX + 250, centreY + 200];
	const leaves = [];
	subdivide(apex, left, right, 5, leaves);
	leaves.forEach((leaf, index) => {
		const midX = (leaf[0][0] + leaf[1][0] + leaf[2][0]) / 3;
		const midY = (leaf[0][1] + leaf[1][1] + leaf[2][1]) / 3;
		const dist = Math.hypot((midX - centreX) / 250, (midY - centreY) / 210);
		const pulse = (Math.sin(index * 0.37 + seed * 0.002) + 1) / 2;
		const activation = (1 - dist) * 0.7 + pulse * 0.3;
		if (activation < 0.22) return;
		const colour =
			activation > 0.72 ? palette.accent : activation > 0.5 ? palette.accent3 : activation > 0.35 ? palette.gold : palette.accent2;
		scene.push(
			leafPolygon(leaf, {
				fill: colour,
				'fill-opacity': (0.08 + activation * 0.42).toFixed(3),
				stroke: palette.ink,
				'stroke-opacity': (0.05 + activation * 0.12).toFixed(3),
				'stroke-width': '0.8',
			}),
		);
	});

	// Spiral accent triangles
	for (let index = 0; index < 14; index += 1) {
		const angle = index * 2.399963229728653 + seed * 0.0017;
		const radial = 40 + Math.sqrt(index + 1) * 38;
		const x = centreX + Math.cos(angle) * radial * 1.1;
		const y = centreY + Math.sin(angle) * radial * 0.72;
		const size = 22 + ((14 - index) / 14) * 48 + random() * 8;
		const colour = index % 3 === 0 ? palette.accent : index % 2 === 0 ? palette.accent2 : palette.accent3;
		scene.push(
			tri(x, y, size, index % 2 === 0, {
				fill: colour,
				'fill-opacity': (0.22 + ((14 - index) / 14) * 0.4).toFixed(3),
				stroke: palette.ink,
				'stroke-opacity': '0.14',
				'stroke-width': '1.1',
			}),
		);
	}

	return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title-${id} desc-${id}">
  <title id="title-${id}">${escapeXml(entry.title)}</title>
  <desc id="desc-${id}">${escapeXml(entry.alt || 'Archive hub fractal triangle field with nebula — no people or brands depicted.')}</desc>
  <defs>
    <linearGradient id="ground-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${palette.paper}"/>
      <stop offset="1" stop-color="#070508"/>
    </linearGradient>
    <linearGradient id="mark-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${palette.accent}"/>
      <stop offset="0.5" stop-color="${palette.accent3}"/>
      <stop offset="1" stop-color="${palette.accent2}"/>
    </linearGradient>
    ${nebulaDefs(id, palette, seed)}
  </defs>
  <rect width="${width}" height="${height}" fill="url(#ground-${id})"/>
  <rect width="${width}" height="${height}" fill="url(#${id}-neb-a)"/>
  <rect width="${width}" height="${height}" fill="url(#${id}-neb-b)"/>
  <rect width="${width}" height="${height}" fill="url(#${id}-neb-c)"/>
  <rect width="${width}" height="${height}" filter="url(#${id}-nebula)" opacity="0.58"/>
  <g aria-hidden="true">${halos}</g>
  <g aria-hidden="true">${scene.join('')}</g>
  <g aria-hidden="true" transform="translate(98 120)">
    ${tri(0, 0, 28, false, { fill: `url(#mark-${id})` })}
    ${tri(48, 4, 14, true, { fill: palette.ink, 'fill-opacity': '0.78' })}
    ${tri(74, 2, 9, false, { fill: palette.accent3, 'fill-opacity': '0.9' })}
  </g>
</svg>`;
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const hubs = manifest.ct || manifest.uem;
if (!hubs) throw new Error('No archive hub manifest for brand "ct"');

mkdirSync(outDir, { recursive: true });
const registry = {};

for (const entry of hubs) {
	const asset = entry.asset || `archive-${createHash('sha256').update(entry.url).digest('hex').slice(0, 10)}`;
	const record = { ...entry, asset };
	writeFileSync(join(outDir, `${asset}.svg`), renderArchiveCover(record));
	registry[entry.url] = {
		asset,
		title: entry.title,
		family: entry.family,
		mode: 'archive',
	};
	console.log(`wrote ${asset}.svg`);
}

writeFileSync(dataPath, `${JSON.stringify(registry, null, '\t')}\n`);
console.log(`registry → ${dataPath}`);
