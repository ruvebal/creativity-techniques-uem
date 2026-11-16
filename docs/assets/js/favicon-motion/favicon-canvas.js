import {
	clamp,
	fovealResponse,
	projectFacet,
	sourceLayerDepth,
	springAtRest,
	springStep,
	svgScale,
	svgViewBox,
} from './math.js?v=20261110-clean-base-depth-8';
import { buildPalette, staggeredColour, transitionDuration } from './palette.js?v=20261110-clean-base-depth-8';

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
	let previous = performance.now();
	let elapsed = 0;
	let drawOrder = [];
	const target = { yaw: 0, pitch: 0, depth: 0, planeX: 0, planeY: 0 };
	const filteredPointer = { x: 0, y: 0 };
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

	const ambientFloat = options.ambientFloat !== false;
	const ambientDepth = options.ambientDepth ?? 0.3;

	function draw() {
		context.setTransform(dpr, 0, 0, dpr, 0, 0);
		context.clearRect(0, 0, width, height);
		// Reserve a small overscan margin so plane travel and near facets do not clip.
		const fit = Math.min(width / viewBox.width, height / viewBox.height) * (options.fitScale ?? 0.9);
		const renderCamera = ambientFloat
			? {
				...camera,
				depth: { value: Math.max(camera.depth.value, ambientDepth), velocity: camera.depth.velocity },
				yaw: { value: camera.yaw.value + Math.sin(elapsed * 0.35) * 0.03, velocity: camera.yaw.velocity },
				pitch: { value: camera.pitch.value + Math.cos(elapsed * 0.28) * 0.02, velocity: camera.pitch.velocity },
			}
			: camera;
		const items = facets.map((facet) => ({
			facet,
			projected: projectFacet(facet, viewBox, renderCamera, elapsed, {
				...options,
				floatDepth: options.floatDepth ?? 8,
			}),
		}));
		if (renderCamera.depth.value > 0.08) {
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

	function cameraSettled() {
		return springAtRest(camera.yaw, target.yaw)
			&& springAtRest(camera.pitch, target.pitch)
			&& springAtRest(camera.depth, target.depth)
			&& springAtRest(camera.planeX, target.planeX, 0.01)
			&& springAtRest(camera.planeY, target.planeY, 0.01);
	}

	function tick(now) {
		frame = 0;
		const delta = Math.min(0.032, Math.max(0.001, (now - previous) / 1000));
		previous = now;
		elapsed += delta;
		springStep(camera.yaw, target.yaw, delta, options.cameraFrequency ?? 4.8, options.cameraDamping ?? 1.08);
		springStep(camera.pitch, target.pitch, delta, options.cameraFrequency ?? 4.8, options.cameraDamping ?? 1.08);
		springStep(camera.depth, target.depth, delta, options.depthFrequency ?? 4.2, options.depthDamping ?? 1.08);
		springStep(camera.planeX, target.planeX, delta, options.planeFrequency ?? 3.8, options.planeDamping ?? 1.04);
		springStep(camera.planeY, target.planeY, delta, options.planeFrequency ?? 3.8, options.planeDamping ?? 1.04);
		if (paletteChanging) {
			paletteTransition.elapsed += delta;
			if (paletteTransition.elapsed >= paletteTotal) {
				paletteTransition.elapsed = paletteTotal;
				paletteTransition.from = paletteTransition.to;
				paletteChanging = false;
			}
		}
		draw();
		if (!cameraSettled() || paletteChanging || ambientFloat) schedule();
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

	let touchDriving = false;
	let touchReleaseTimer = 0;

	function enter() {
		signal(true);
	}

	function leave() {
		signal(false);
	}

	function resetCamera() {
		filteredPointer.x = 0;
		filteredPointer.y = 0;
		target.yaw = 0;
		target.pitch = 0;
		target.depth = 0;
		target.planeX = 0;
		target.planeY = 0;
		schedule();
	}

	function applyPointer(clientX, clientY, { immediate = false, fromTouch = false } = {}) {
		const bounds = host.getBoundingClientRect();
		const centerX = bounds.left + bounds.width / 2;
		const centerY = bounds.top + bounds.height / 2;
		const rawX = clamp((clientX - centerX) / Math.max(1, window.innerWidth * 0.5), -1, 1);
		const rawY = clamp((clientY - centerY) / Math.max(1, window.innerHeight * 0.5), -1, 1);
		const smoothing = immediate ? 1 : (options.pointerSmoothing ?? (fromTouch ? 0.45 : 0.16));
		filteredPointer.x += (rawX - filteredPointer.x) * smoothing;
		filteredPointer.y += (rawY - filteredPointer.y) * smoothing;
		const deadZone = fromTouch
			? (options.touchDeadZone ?? 0.02)
			: (options.fovealDeadZone ?? 0.12);
		const response = fovealResponse(filteredPointer.x, filteredPointer.y, deadZone);
		const yawAmp = (options.yawAmplitude ?? 0.11) * (fromTouch ? 1.35 : 1);
		const pitchAmp = (options.pitchAmplitude ?? 0.082) * (fromTouch ? 1.35 : 1);
		const planeXAmp = (options.planeTravelX ?? 0.12) * (fromTouch ? 1.25 : 1);
		const planeYAmp = (options.planeTravelY ?? 0.09) * (fromTouch ? 1.25 : 1);
		// Touch needs a floor on depth so facets actually separate in Z.
		const depth = fromTouch ? Math.max(0.55, response.gain) : response.gain;
		target.yaw = filteredPointer.x * response.gain * yawAmp;
		target.pitch = -filteredPointer.y * response.gain * pitchAmp;
		target.depth = depth;
		target.planeX = filteredPointer.x * response.gain * width * planeXAmp;
		target.planeY = filteredPointer.y * response.gain * height * planeYAmp;
		host.dataset.faviconDepth = String(target.depth.toFixed(3));
		host.dataset.faviconYaw = String(target.yaw.toFixed(3));
		schedule();
	}

	function move(event) {
		if (event.isPrimary === false) return;
		// While a touch session is live, ignore duplicate pointer events from the same finger.
		if (touchDriving && event.pointerType === 'touch') return;
		applyPointer(event.clientX, event.clientY, {
			fromTouch: event.pointerType === 'touch',
			immediate: event.pointerType === 'touch',
		});
	}

	function leaveViewport(event) {
		// Mobile WebKit fires pointerout with relatedTarget=null after every touch —
		// that must not zero the camera or facets never appear to move.
		if (touchDriving) return;
		if (event.pointerType === 'touch') return;
		if (!event.relatedTarget) resetCamera();
	}

	function touchPoint(event) {
		const touch = (event.touches && event.touches[0])
			|| (event.changedTouches && event.changedTouches[0]);
		return touch || null;
	}

	function onTouchStart(event) {
		const touch = touchPoint(event);
		if (!touch) return;
		touchDriving = true;
		if (touchReleaseTimer) {
			window.clearTimeout(touchReleaseTimer);
			touchReleaseTimer = 0;
		}
		enter();
		applyPointer(touch.clientX, touch.clientY, { immediate: true, fromTouch: true });
	}

	function onTouchMove(event) {
		if (!touchDriving) return;
		const touch = touchPoint(event);
		if (!touch) return;
		applyPointer(touch.clientX, touch.clientY, { immediate: true, fromTouch: true });
	}

	function onTouchEnd() {
		if (!touchDriving) return;
		leave();
		// Hold the disentangled pose briefly, then ease home (do not snap on pointerout).
		if (touchReleaseTimer) window.clearTimeout(touchReleaseTimer);
		touchReleaseTimer = window.setTimeout(() => {
			touchDriving = false;
			touchReleaseTimer = 0;
			resetCamera();
		}, options.touchHoldMs ?? 900);
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
		if (visible && (paletteChanging || !cameraSettled())) schedule();
		else if (!visible) {
			cancelAnimationFrame(frame);
			frame = 0;
		}
	}, { threshold: 0.02 });
	resizeObserver.observe(host);
	visibilityObserver.observe(host);
	const gestureRoot = host.closest('.hero-section--landing, .hero-section, main') || document;
	host.addEventListener('pointerenter', enter, { passive: true });
	host.addEventListener('pointerleave', leave, { passive: true });
	host.addEventListener('click', hitFacet);
	window.addEventListener('pointermove', move, { passive: true });
	window.addEventListener('pointerdown', move, { passive: true });
	window.addEventListener('pointerout', leaveViewport, { passive: true });
	// document + gestureRoot: iOS delivers touch to the element under the finger; bubble to document.
	document.addEventListener('touchstart', onTouchStart, { passive: true, capture: true });
	document.addEventListener('touchmove', onTouchMove, { passive: true, capture: true });
	document.addEventListener('touchend', onTouchEnd, { passive: true, capture: true });
	document.addEventListener('touchcancel', onTouchEnd, { passive: true, capture: true });
	gestureRoot.addEventListener('pointerdown', move, { passive: true });
	gestureRoot.addEventListener('pointermove', move, { passive: true });
	window.addEventListener('blur', resetCamera);
	resize();
	draw();

	return {
		rotatePalette,
		clearInversions,
		destroy() {
			destroyed = true;
			cancelAnimationFrame(frame);
			if (touchReleaseTimer) window.clearTimeout(touchReleaseTimer);
			if (paletteTimer) window.clearInterval(paletteTimer);
			resizeObserver.disconnect();
			visibilityObserver.disconnect();
			host.removeEventListener('pointerenter', enter);
			host.removeEventListener('pointerleave', leave);
			host.removeEventListener('click', hitFacet);
			window.removeEventListener('pointermove', move);
			window.removeEventListener('pointerdown', move);
			window.removeEventListener('pointerout', leaveViewport);
			document.removeEventListener('touchstart', onTouchStart, true);
			document.removeEventListener('touchmove', onTouchMove, true);
			document.removeEventListener('touchend', onTouchEnd, true);
			document.removeEventListener('touchcancel', onTouchEnd, true);
			gestureRoot.removeEventListener('pointerdown', move);
			gestureRoot.removeEventListener('pointermove', move);
			window.removeEventListener('blur', resetCamera);
			signal(false);
			canvas.remove();
			host.classList.remove('is-canvas-ready');
		},
	};
}

