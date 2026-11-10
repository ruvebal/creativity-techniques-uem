import { createGeometryField } from './geometry-field.js';
import { bindFaviconBackgroundMotion } from '../favicon-motion/hero-coordinator.js';

const FAMILIES = {
	'ct-flame': {
		palette: ['--ct-flame-1', '--ct-flame-3', '--ct-flame-4', '--hero-fg'],
	},
	'ct-coral': {
		palette: ['--ct-coral-1', '--ct-coral-3', '--ct-coral-5', '--ct-coral-2'],
	},
};

function themePalette(names) {
	const styles = getComputedStyle(document.documentElement);
	return names.map((name) => styles.getPropertyValue(name).trim()).filter(Boolean);
}

export function mountArchiveHero(hero, { family = 'ct-flame', asset = 'archive-home' } = {}) {
	if (!hero) return null;
	const plane = hero.querySelector('.hero-section__inner') || hero;
	plane.classList.add(plane === hero ? 'hero-foreground-plane--self' : 'hero-foreground-plane');
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

	const canvas = document.createElement('canvas');
	canvas.className = 'geometry-live-bg';
	canvas.setAttribute('aria-hidden', 'true');
	hero.prepend(canvas);
	hero.classList.add('has-geometry-live');

	const theme = FAMILIES[family] || FAMILIES['ct-flame'];
	const field = createGeometryField(canvas, {
		shape: 'triangle',
		seed: asset,
		palette: themePalette(theme.palette),
		maxCells: window.matchMedia('(max-width: 640px)').matches ? 92 : 140,
		dprCap: 1.2,
		fov: 740,
		floatDepth: 29,
		pointerRoot: hero,
	});
	const unbindFavicon = bindFaviconBackgroundMotion(hero, field, { selector: '#favicon-hero-icon' });
	const destroy = () => {
		unbindFavicon();
		field?.destroy();
	};
	window.addEventListener('pagehide', destroy, { once: true });
	return { canvas, destroy };
}
