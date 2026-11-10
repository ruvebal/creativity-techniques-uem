import { clamp, smoothstep } from './math.js';

export function parseColour(value) {
	const colour = String(value || '').trim();
	const short = /^#([0-9a-f]{3})$/i.exec(colour);
	if (short) return short[1].split('').map((channel) => parseInt(channel + channel, 16));
	const full = /^#([0-9a-f]{6})$/i.exec(colour);
	if (full) return [0, 2, 4].map((offset) => parseInt(full[1].slice(offset, offset + 2), 16));
	const rgb = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i.exec(colour);
	return rgb ? [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])] : [255, 255, 255];
}

export function buildPalette(facets) {
	const values = [];
	const lookup = new Map();
	for (const facet of facets) {
		const key = facet.fill.toUpperCase();
		if (!lookup.has(key)) {
			lookup.set(key, values.length);
			values.push(parseColour(facet.fill));
		}
		facet.paletteIndex = lookup.get(key);
	}
	return values;
}

export function staggeredColour(facet, palette, transition, delay = 0.045, duration = 0.36) {
	if (!palette.length) return 'rgb(255 255 255)';
	const local = (transition.elapsed - facet.index * delay) / duration;
	const mix = smoothstep(clamp(local));
	const from = palette[(facet.paletteIndex + transition.from) % palette.length];
	const to = palette[(facet.paletteIndex + transition.to) % palette.length];
	const channels = from.map((channel, index) => Math.round(channel + (to[index] - channel) * mix));
	return `rgb(${channels[0]} ${channels[1]} ${channels[2]})`;
}

export function transitionDuration(facetCount, delay = 0.045, duration = 0.36) {
	return Math.max(0, facetCount - 1) * delay + duration;
}

