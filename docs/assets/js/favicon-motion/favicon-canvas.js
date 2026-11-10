import {
	clamp,
	fovealResponse,
	projectFacet,
	sourceLayerDepth,
	springAtRest,
	springStep,
	svgScale,
	svgViewBox,
} from './math.js';
import { buildPalette, staggeredColour, transitionDuration } from './palette.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

async function loadMark(source) {
	const response = await fetch(source);
	if (!response.ok) throw new Error(`Favicon SVG request failed (${response.status})`);
	const svg = new DOMParser().parseFromString(await response.text(), 'image/svg+xml').documentElement;
	const viewBox = svgViewBox(svg);
	const measure = document.createElementNS(SVG_NS, 'svg');
	measure.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
	Object.assign(measure.style, {
		position: 'fixed',
		left: '-10000px',
		top: '0',
		width: `${viewBox.width}px`,
		height: `${viewBox.height}px`,
		visibility: 'hidden',
		pointerEvents: 'none',
	});
	document.body.append(measure);
	const sourcePaths = [...svg.querySelectorAll('path')];
	const facets = sourcePaths.map((sourcePath, index) => {
		const scale = svgScale(sourcePath.getAttribute('transform'));
		const probe = document.createElementNS(SVG_NS, 'path');
		probe.setAttribute('d', sourcePath.getAttribute('d') || '');
		measure.append(probe);
		const bounds = probe.getBBox();
		const rawX = bounds.x + bounds.width / 2;
		const rawY = bounds.y + bounds.height / 2;
		return {
			index,
			path: new Path2D(sourcePath.getAttribute('d') || ''),
			fill: sourcePath.getAttribute('fill') || 'currentColor',
			scaleX: scale.x,
			scaleY: scale.y,
			rawX,
			rawY,
			x: rawX * scale.x,
			y: rawY * scale.y,
			z: sourceLayerDepth(index, sourcePaths.length),
			phase: index * 0.73,
			inverted: false,
			inverseTransform: null,
		};
	});
	measure.remove();
	return { facets, viewBox, palette: buildPalette(facets) };
}

export async function mountFaviconCanvas(host, options = {}) {
	if (!host || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
	const fallback = host.querySelector('img');
	const source = host.dataset.faviconSrc || fallback?.currentSrc || fallback?.src;
	if (!source) return null;

	const canvas = document.createElement('canvas');
	canvas.className = 'favicon-canvas-25d__surface';
	canvas.setAttribute('aria-hidden', 'true');
	const context = canvas.getContext('2d', { alpha: true, desynchronized: true });
	if (!context) return null;
	const { facets, viewBox, palette } = await loadMark(source);
	if (!facets.length) return null;
	host.prepend(canvas);

	let width = 1;
	let height = 1;
	let dpr = 1;
	let frame = 0;
	let destroyed = false;
	let visible = true;
	let pointerActive = false;
	let previous = performance.now();
	let elapsed = 0;
	let drawOrder = [];
	const target = { yaw: 0, pitch: 0, depth: 0, planeX: 0, planeY: 0 };
	const camera = {
		yaw: { value: 0, velocity: 0 },
		pitch: { value: 0, velocity: 0 },
		depth: { value: 0, velocity: 0 },
		planeX: { value: 0, velocity: 0 },
		planeY: { value: 0, velocity: 0 },
	};
	const paletteTransition = { from: 0, to: 0, elapsed: 2 };
	const paletteDelay = options.paletteDelay ?? 0.045;
	const paletteDuration = options.paletteDuration ?? 0.36;
	const paletteTotal = transitionDuration(facets.length, paletteDelay, paletteDuration);
	let paletteChanging = false;

	function draw() {
		context.setTransform(dpr, 0, 0, dpr, 0, 0);
		context.clearRect(0, 0, width, height);
		// Reserve a small overscan margin so plane travel and near facets do not clip.
		const fit = Math.min(width / viewBox.width, height / viewBox.height) * (options.fitScale ?? 0.9);
		const items = facets.map((facet) => ({
			facet,
			projected: projectFacet(facet, viewBox, camera, elapsed, options),
		}));
		if (camera.depth.value > 0.08) {
			items.sort((a, b) => b.projected.z - a.projected.z || a.facet.index - b.facet.index);
		}
		drawOrder = items;

		for (const { facet, projected } of items) {
			const matrix = new DOMMatrix()
				.translate(
					width / 2 + camera.planeX.value + projected.x * fit,
					height / 2 + camera.planeY.value + projected.y * fit,
				)
				.scale(fit * projected.perspective * facet.scaleX, fit * projected.perspective * facet.scaleY)
				.translate(-facet.rawX, -facet.rawY);
			facet.inverseTransform = matrix.inverse();

			context.save();
			context.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
			context.fillStyle = staggeredColour(
				facet,
				palette,
				paletteTransition,
				paletteDelay,
				paletteDuration,
			);
			context.filter = facet.inverted ? 'invert(1)' : 'none';
			context.fill(facet.path);
			context.restore();
		}
	}

	function schedule() {
		if (!destroyed && visible && !frame) frame = requestAnimationFrame(tick);
	}

	function tick(now) {
		frame = 0;
		const delta = Math.min(0.032, Math.max(0.001, (now - previous) / 1000));
		previous = now;
		elapsed += delta;
		springStep(camera.yaw, target.yaw, delta, options.cameraFrequency ?? 7.2);
		springStep(camera.pitch, target.pitch, delta, options.cameraFrequency ?? 7.2);
		springStep(camera.depth, target.depth, delta, options.depthFrequency ?? 6.2);
		springStep(camera.planeX, target.planeX, delta, options.planeFrequency ?? 5.4, options.planeDamping ?? 0.92);
		springStep(camera.planeY, target.planeY, delta, options.planeFrequency ?? 5.4, options.planeDamping ?? 0.92);
		if (paletteChanging) {
			paletteTransition.elapsed += delta;
			if (paletteTransition.elapsed >= paletteTotal) {
				paletteTransition.elapsed = paletteTotal;
				paletteTransition.from = paletteTransition.to;
				paletteChanging = false;
			}
		}
		draw();
		const settled = springAtRest(camera.yaw, target.yaw)
			&& springAtRest(camera.pitch, target.pitch)
			&& springAtRest(camera.depth, target.depth)
			&& springAtRest(camera.planeX, target.planeX, 0.01)
			&& springAtRest(camera.planeY, target.planeY, 0.01);
		if (pointerActive || !settled || paletteChanging) schedule();
	}

	function resize() {
		const bounds = host.getBoundingClientRect();
		width = Math.max(1, bounds.width);
		height = Math.max(1, bounds.height);
		dpr = Math.min(window.devicePixelRatio || 1, options.dprCap || 1.25);
		canvas.width = Math.round(width * dpr);
		canvas.height = Math.round(height * dpr);
		draw();
		host.classList.add('is-canvas-ready');
	}

	function signal(active) {
		host.dispatchEvent(new CustomEvent('favicon-canvas-interaction', {
			bubbles: true,
			detail: { active },
		}));
	}

	function enter() {
		pointerActive = true;
		signal(true);
		schedule();
	}

	function move(event) {
		const bounds = host.getBoundingClientRect();
		const x = clamp(((event.clientX - bounds.left) / Math.max(1, bounds.width) - 0.5) * 2, -1, 1);
		const y = clamp(((event.clientY - bounds.top) / Math.max(1, bounds.height) - 0.5) * 2, -1, 1);
		const response = fovealResponse(x, y, options.fovealDeadZone ?? 0.08);
		target.yaw = x * response.gain * (options.yawAmplitude ?? 0.07);
		target.pitch = -y * response.gain * (options.pitchAmplitude ?? 0.052);
		target.depth = response.gain;
		target.planeX = x * response.gain * width * (options.planeTravelX ?? 0.042);
		target.planeY = y * response.gain * height * (options.planeTravelY ?? 0.032);
		schedule();
	}

	function leave() {
		pointerActive = false;
		target.yaw = 0;
		target.pitch = 0;
		target.depth = 0;
		target.planeX = 0;
		target.planeY = 0;
		signal(false);
		schedule();
	}

	function hitFacet(event) {
		const bounds = host.getBoundingClientRect();
		const screen = new DOMPoint(event.clientX - bounds.left, event.clientY - bounds.top);
		for (let index = drawOrder.length - 1; index >= 0; index -= 1) {
			const facet = drawOrder[index].facet;
			if (!facet.inverseTransform) continue;
			const local = screen.matrixTransform(facet.inverseTransform);
			context.save();
			context.setTransform(1, 0, 0, 1, 0, 0);
			const hit = context.isPointInPath(facet.path, local.x, local.y);
			context.restore();
			if (!hit) continue;
			facet.inverted = !facet.inverted;
			host.dispatchEvent(new CustomEvent('favicon-facet-inversion', {
				bubbles: true,
				detail: { index: facet.index, inverted: facet.inverted },
			}));
			draw();
			return facet;
		}
		return null;
	}

	function rotatePalette() {
		if (palette.length < 2) return;
		paletteTransition.from = paletteTransition.to;
		paletteTransition.to = (paletteTransition.to + 1) % palette.length;
		paletteTransition.elapsed = 0;
		paletteChanging = true;
		schedule();
	}

	function clearInversions() {
		for (const facet of facets) facet.inverted = false;
		draw();
	}

	const paletteTimer = options.autoPalette === false || palette.length < 2
		? 0
		: window.setInterval(rotatePalette, options.paletteInterval ?? 5200);
	const resizeObserver = new ResizeObserver(resize);
	const visibilityObserver = new IntersectionObserver(([entry]) => {
		visible = entry.isIntersecting;
		if (visible && (pointerActive || paletteChanging || camera.depth.value > 0.0002)) schedule();
		else if (!visible) {
			cancelAnimationFrame(frame);
			frame = 0;
		}
	}, { threshold: 0.02 });
	resizeObserver.observe(host);
	visibilityObserver.observe(host);
	host.addEventListener('pointerenter', enter, { passive: true });
	host.addEventListener('pointermove', move, { passive: true });
	host.addEventListener('pointerdown', move, { passive: true });
	host.addEventListener('pointerleave', leave, { passive: true });
	host.addEventListener('click', hitFacet);
	resize();
	draw();

	return {
		rotatePalette,
		clearInversions,
		destroy() {
			destroyed = true;
			cancelAnimationFrame(frame);
			if (paletteTimer) window.clearInterval(paletteTimer);
			resizeObserver.disconnect();
			visibilityObserver.disconnect();
			host.removeEventListener('pointerenter', enter);
			host.removeEventListener('pointermove', move);
			host.removeEventListener('pointerdown', move);
			host.removeEventListener('pointerleave', leave);
			host.removeEventListener('click', hitFacet);
			signal(false);
			canvas.remove();
			host.classList.remove('is-canvas-ready');
		},
	};
}

