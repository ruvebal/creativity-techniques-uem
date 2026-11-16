/**
 * Verbatim SVG → Canvas 2.5D *facet* parallax.
 * Every drawable shape (path, polygon, polyline, rect, circle, ellipse, line, text)
 * gets its own depth index and projects independently. No whole-plane block motion.
 * Backdrop plates (full-bleed rects) are dropped so the canvas stays transparent.
 */
import {
	clamp,
	fovealResponse,
	projectFacet,
	sourceLayerDepth,
	springAtRest,
	springStep,
	svgViewBox,
} from './favicon-motion/math.js?v=20261115-tri-z-1';

const SVG_NS = 'http://www.w3.org/2000/svg';
const SHAPE_SEL = 'path, polygon, polyline, rect, circle, ellipse, line, text';

function prefersReducedMotion() {
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function resolveSource(host) {
	if (host.dataset.svgPlaneSrc) return host.dataset.svgPlaneSrc;
	const object = host.querySelector('object[type="image/svg+xml"]');
	if (object?.data) return object.data;
	const img = host.querySelector('img');
	return img?.currentSrc || img?.src || null;
}

function num(value, fallback = 0) {
	if (value == null || value === '') return fallback;
	const n = Number(value);
	return Number.isFinite(n) ? n : fallback;
}

function inheritedAttr(el, name) {
	let node = el;
	while (node && node.nodeType === 1) {
		const value = node.getAttribute?.(name);
		if (value != null && value !== '') return value;
		node = node.parentElement;
	}
	return null;
}

function resolvePaint(el, name, defs) {
	const raw = inheritedAttr(el, name);
	if (!raw || raw === 'none') return null;
	const match = /^url\(#([^)]+)\)$/.exec(raw.trim());
	if (!match) return raw;
	const id = match[1].replace(/\\/g, '\\\\').replace(/"/g, '\\"');
	const def = defs.getElementById?.(match[1]) || defs.querySelector?.(`[id="${id}"]`);
	if (!def) return null;
	const stop = def.querySelector?.('stop');
	return stop?.getAttribute('stop-color') || stop?.style?.stopColor || null;
}

function isBackdropPlate(el, viewBox) {
	if (el.tagName.toLowerCase() !== 'rect') return false;
	const w = num(el.getAttribute('width'));
	const h = num(el.getAttribute('height'));
	const x = num(el.getAttribute('x'), 0);
	const y = num(el.getAttribute('y'), 0);
	if (w < viewBox.width * 0.96 || h < viewBox.height * 0.96) return false;
	if (x > viewBox.width * 0.02 || y > viewBox.height * 0.02) return false;
	return true;
}

function localPathFromElement(el) {
	const tag = el.tagName.toLowerCase();
	const path = new Path2D();
	if (tag === 'path') {
		path.addPath(new Path2D(el.getAttribute('d') || ''));
		return path;
	}
	if (tag === 'rect') {
		const x = num(el.getAttribute('x'));
		const y = num(el.getAttribute('y'));
		const w = num(el.getAttribute('width'));
		const h = num(el.getAttribute('height'));
		const rx = num(el.getAttribute('rx'));
		const ry = num(el.getAttribute('ry'), rx);
		if (rx > 0 || ry > 0) {
			const rrx = Math.min(rx, w / 2);
			const rry = Math.min(ry, h / 2);
			path.moveTo(x + rrx, y);
			path.lineTo(x + w - rrx, y);
			path.quadraticCurveTo(x + w, y, x + w, y + rry);
			path.lineTo(x + w, y + h - rry);
			path.quadraticCurveTo(x + w, y + h, x + w - rrx, y + h);
			path.lineTo(x + rrx, y + h);
			path.quadraticCurveTo(x, y + h, x, y + h - rry);
			path.lineTo(x, y + rry);
			path.quadraticCurveTo(x, y, x + rrx, y);
			path.closePath();
		} else {
			path.rect(x, y, w, h);
		}
		return path;
	}
	if (tag === 'circle') {
		path.arc(num(el.getAttribute('cx')), num(el.getAttribute('cy')), num(el.getAttribute('r')), 0, Math.PI * 2);
		return path;
	}
	if (tag === 'ellipse') {
		const cx = num(el.getAttribute('cx'));
		const cy = num(el.getAttribute('cy'));
		const rx = num(el.getAttribute('rx'));
		const ry = num(el.getAttribute('ry'));
		path.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
		return path;
	}
	if (tag === 'line') {
		path.moveTo(num(el.getAttribute('x1')), num(el.getAttribute('y1')));
		path.lineTo(num(el.getAttribute('x2')), num(el.getAttribute('y2')));
		return path;
	}
	if (tag === 'polygon' || tag === 'polyline') {
		const points = (el.getAttribute('points') || '')
			.trim()
			.split(/[\s,]+/)
			.map(Number)
			.filter((n) => Number.isFinite(n));
		if (points.length < 4) return path;
		path.moveTo(points[0], points[1]);
		for (let i = 2; i < points.length; i += 2) path.lineTo(points[i], points[i + 1]);
		if (tag === 'polygon') path.closePath();
		return path;
	}
	return path;
}

function matrixFromCtm(ctm) {
	if (!ctm) return new DOMMatrix();
	return new DOMMatrix([ctm.a, ctm.b, ctm.c, ctm.d, ctm.e, ctm.f]);
}

async function loadFacets(source) {
	const response = await fetch(source);
	if (!response.ok) throw new Error(`SVG facet request failed (${response.status})`);
	const text = await response.text();
	const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
	const svg = doc.documentElement;
	if (!svg || svg.querySelector('parsererror')) throw new Error('SVG facet parse failed');
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
	const imported = document.importNode(svg, true);
	measure.append(imported);
	document.body.append(measure);

	const root = measure.querySelector('svg') || measure;
	const defs = root.querySelector('defs') || root;
	const nodes = [...root.querySelectorAll(SHAPE_SEL)].filter(
		(el) => !el.closest('defs, clipPath, mask, symbol, pattern, title, desc'),
	);

	const facets = [];
	for (const el of nodes) {
		if (isBackdropPlate(el, viewBox)) continue;
		const tag = el.tagName.toLowerCase();
		const ctm = el.getCTM?.();
		const matrix = matrixFromCtm(ctm);
		let bounds;
		try {
			bounds = el.getBBox();
		} catch {
			continue;
		}
		if (!bounds.width && !bounds.height && tag !== 'line' && tag !== 'text') continue;

		const center = new DOMPoint(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2).matrixTransform(matrix);
		const fill = resolvePaint(el, 'fill', defs);
		const stroke = resolvePaint(el, 'stroke', defs);
		const strokeWidth = num(inheritedAttr(el, 'stroke-width'), stroke ? 1.25 : 0);
		const opacity = num(inheritedAttr(el, 'opacity'), 1);

		if (tag === 'text') {
			const fontSize = num(inheritedAttr(el, 'font-size') || el.style?.fontSize, 16);
			facets.push({
				kind: 'text',
				index: facets.length,
				text: (el.textContent || '').trim(),
				fill: fill || '#e8e2d6',
				stroke,
				strokeWidth,
				opacity,
				fontSize,
				fontFamily: inheritedAttr(el, 'font-family') || 'system-ui, sans-serif',
				fontWeight: inheritedAttr(el, 'font-weight') || '600',
				textAnchor: inheritedAttr(el, 'text-anchor') || 'start',
				rawX: center.x,
				rawY: center.y,
				x: center.x,
				y: center.y,
				z: 0,
				phase: facets.length * 0.73,
				path: null,
				localMatrix: matrix,
			});
			continue;
		}

		const local = localPathFromElement(el);
		const baked = new Path2D();
		baked.addPath(local, matrix);

		const area = Math.max(1, bounds.width * bounds.height);
		facets.push({
			kind: 'shape',
			index: facets.length,
			path: baked,
			fill,
			stroke,
			strokeWidth,
			opacity,
			rawX: center.x,
			rawY: center.y,
			x: center.x,
			y: center.y,
			z: 0,
			area,
			phase: facets.length * 0.73 + (area % 7) * 0.11,
			scaleX: 1,
			scaleY: 1,
			localMatrix: matrix,
		});
	}

	const count = facets.length;
	const areas = facets.map((f) => f.area || 1);
	const minA = Math.min(...areas);
	const maxA = Math.max(...areas);
	const spanA = Math.max(1, maxA - minA);
	for (let i = 0; i < count; i += 1) {
		const sizeNorm = (areas[i] - minA) / spanA;
		facets[i].sizeNorm = sizeNorm;
		// Ungrouped facets: triangular Z + size band so neighbours do not share a plane.
		facets[i].z = sourceLayerDepth(i, count, sizeNorm);
		facets[i].index = i;
	}

	measure.remove();
	return { facets, viewBox };
}

/**
 * @param {HTMLElement} host
 * @param {Record<string, number>} [options]
 */
export async function mountSvgPlane25d(host, options = {}) {
	if (!host || prefersReducedMotion()) return null;
	const source = resolveSource(host);
	if (!source) return null;

	let { facets, viewBox } = await loadFacets(source);
	if (!facets.length) return null;
	const maxFacets = options.maxFacets;
	if (maxFacets && facets.length > maxFacets) {
		const ranked = [...facets].sort((a, b) => (b.opacity ?? 1) - (a.opacity ?? 1));
		const keep = new Set(ranked.slice(0, maxFacets).map((f) => f.index));
		facets = facets.filter((f) => keep.has(f.index));
		const count = facets.length;
		const areas = facets.map((f) => f.area || 1);
		const minA = Math.min(...areas);
		const maxA = Math.max(...areas);
		const spanA = Math.max(1, maxA - minA);
		for (let i = 0; i < count; i += 1) {
			const sizeNorm = (areas[i] - minA) / spanA;
			facets[i].sizeNorm = sizeNorm;
			facets[i].z = sourceLayerDepth(i, count, sizeNorm);
			facets[i].index = i;
			facets[i].phase = i * 0.73 + sizeNorm * 1.7;
		}
	}

	const canvas = document.createElement('canvas');
	canvas.className = 'svg-plane-25d__surface';
	canvas.setAttribute('aria-hidden', 'true');
	const context = canvas.getContext('2d', { alpha: true });
	if (!context) return null;

	const fallbacks = [...host.querySelectorAll(':scope > img, :scope > object')];
	host.prepend(canvas);
	host.classList.add('svg-plane-25d--facets');

	let width = 1;
	let height = 1;
	let dpr = 1;
	let frame = 0;
	let destroyed = false;
	let visible = true;
	let previous = performance.now();
	let elapsed = 0;
	const target = { yaw: 0, pitch: 0, depth: 0, planeX: 0, planeY: 0 };
	const filteredPointer = { x: 0, y: 0 };
	const camera = {
		yaw: { value: 0, velocity: 0 },
		pitch: { value: 0, velocity: 0 },
		depth: { value: 0, velocity: 0 },
		planeX: { value: 0, velocity: 0 },
		planeY: { value: 0, velocity: 0 },
	};

	const ambientFloat = options.ambientFloat === true;
	const ambientDepth = options.ambientDepth ?? 0.32;
	const ambientOrbitYaw = options.ambientOrbitYaw ?? 0.028;
	const ambientOrbitPitch = options.ambientOrbitPitch ?? 0.018;
	const orbitRadius = options.orbitRadius ?? (ambientFloat ? 5.5 : 0);
	const orbitSpeed = options.orbitSpeed ?? 0.38;

	function draw() {
		context.setTransform(dpr, 0, 0, dpr, 0, 0);
		context.clearRect(0, 0, width, height);

		const fit = Math.min(width / viewBox.width, height / viewBox.height) * (options.fitScale ?? 0.92);
		// Ambient levitation needs a non-zero depth floor (atelier landing physics).
		const depthFloor = ambientFloat ? ambientDepth : 0;
		const renderCamera = {
			...camera,
			depth: { value: Math.max(camera.depth.value, depthFloor), velocity: camera.depth.velocity },
			yaw: {
				value: camera.yaw.value + (ambientFloat ? Math.sin(elapsed * 0.35) * ambientOrbitYaw : 0),
				velocity: camera.yaw.velocity,
			},
			pitch: {
				value: camera.pitch.value + (ambientFloat ? Math.cos(elapsed * 0.28) * ambientOrbitPitch : 0),
				velocity: camera.pitch.velocity,
			},
		};
		const items = facets.map((facet) => ({
			facet,
			projected: projectFacet(facet, viewBox, renderCamera, elapsed, {
				floatDepth: options.floatDepth ?? (ambientFloat ? 9 : 7),
				extrusionStrength: options.extrusionStrength ?? 2.35,
				insetX: options.insetX ?? 3.1,
				insetY: options.insetY ?? 2.5,
				perspectiveStrength: options.perspectiveStrength ?? 0.32,
				orbitRadius: orbitRadius * (0.55 + (facet.sizeNorm ?? 0.5) * 0.9),
				orbitSpeed: orbitSpeed * (0.62 + ((facet.phase % 1) + (facet.sizeNorm ?? 0.5)) * 0.45),
			}),
		}));
		if (renderCamera.depth.value > 0.06) {
			items.sort((a, b) => b.projected.z - a.projected.z || a.facet.index - b.facet.index);
		}

		for (const { facet, projected } of items) {
			const matrix = new DOMMatrix()
				.translate(
					width / 2 + camera.planeX.value + projected.x * fit,
					height / 2 + camera.planeY.value + projected.y * fit,
				)
				.scale(fit * projected.perspective, fit * projected.perspective)
				.translate(-facet.rawX, -facet.rawY);

			context.save();
			context.globalAlpha = facet.opacity ?? 1;
			context.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);

			if (facet.kind === 'text') {
				context.font = `${facet.fontWeight} ${facet.fontSize}px ${facet.fontFamily}`;
				context.textAlign = facet.textAnchor === 'middle' ? 'center' : facet.textAnchor === 'end' ? 'right' : 'left';
				context.textBaseline = 'middle';
				if (facet.fill) {
					context.fillStyle = facet.fill;
					context.fillText(facet.text, facet.rawX, facet.rawY);
				}
				if (facet.stroke) {
					context.strokeStyle = facet.stroke;
					context.lineWidth = facet.strokeWidth || 1;
					context.strokeText(facet.text, facet.rawX, facet.rawY);
				}
			} else if (facet.path) {
				if (facet.fill) {
					context.fillStyle = facet.fill;
					context.fill(facet.path);
				}
				if (facet.stroke) {
					context.strokeStyle = facet.stroke;
					context.lineWidth = facet.strokeWidth || 1.25;
					context.lineJoin = 'round';
					context.lineCap = 'round';
					context.stroke(facet.path);
				}
			}
			context.restore();
		}
	}

	function schedule() {
		if (!destroyed && visible && !frame) frame = requestAnimationFrame(tick);
	}

	function cameraSettled() {
		return (
			springAtRest(camera.yaw, target.yaw) &&
			springAtRest(camera.pitch, target.pitch) &&
			springAtRest(camera.depth, target.depth) &&
			springAtRest(camera.planeX, target.planeX, 0.01) &&
			springAtRest(camera.planeY, target.planeY, 0.01)
		);
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
		draw();
		// Keep RAF alive for ambient float/orbit even when springs rest.
		if (!cameraSettled() || ambientFloat) schedule();
	}

	function resize() {
		const bounds = host.getBoundingClientRect();
		// shortcut: first RO pass can be 0×0 while sticky chrome settles —
		// never hide the SVG fallback until we have a real box.
		if (bounds.width < 2 || bounds.height < 2) {
			host.classList.remove('is-svg-plane-ready');
			return;
		}
		width = bounds.width;
		height = bounds.height;
		dpr = Math.min(window.devicePixelRatio || 1, options.dprCap || 1.5);
		canvas.width = Math.round(width * dpr);
		canvas.height = Math.round(height * dpr);
		draw();
		host.classList.add('is-svg-plane-ready');
		for (const node of fallbacks) node.setAttribute('aria-hidden', 'true');
	}

	function move(event) {
		if (event.isPrimary === false) return;
		const bounds = host.getBoundingClientRect();
		const centerX = bounds.left + bounds.width / 2;
		const centerY = bounds.top + bounds.height / 2;
		const rawX = clamp((event.clientX - centerX) / Math.max(1, window.innerWidth * 0.5), -1, 1);
		const rawY = clamp((event.clientY - centerY) / Math.max(1, window.innerHeight * 0.5), -1, 1);
		const smoothing = options.pointerSmoothing ?? 0.09;
		filteredPointer.x += (rawX - filteredPointer.x) * smoothing;
		filteredPointer.y += (rawY - filteredPointer.y) * smoothing;
		const response = fovealResponse(filteredPointer.x, filteredPointer.y, options.fovealDeadZone ?? 0.2);
		// Subtle parallax defaults — cover/orbit heroes stay readable.
		target.yaw = filteredPointer.x * response.gain * (options.yawAmplitude ?? 0.07);
		target.pitch = -filteredPointer.y * response.gain * (options.pitchAmplitude ?? 0.048);
		target.depth = response.gain * (options.depthGain ?? 0.72);
		target.planeX = filteredPointer.x * response.gain * width * (options.planeTravelX ?? 0.028);
		target.planeY = filteredPointer.y * response.gain * height * (options.planeTravelY ?? 0.022);
		schedule();
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

	function leaveViewport(event) {
		if (!event.relatedTarget) resetCamera();
	}

	const resizeObserver = new ResizeObserver(resize);
	const visibilityObserver = new IntersectionObserver(
		([entry]) => {
			visible = entry.isIntersecting;
			if (visible && (!cameraSettled() || ambientFloat)) schedule();
			else if (!visible) {
				cancelAnimationFrame(frame);
				frame = 0;
			}
		},
		{ threshold: 0.02 },
	);
	resizeObserver.observe(host);
	visibilityObserver.observe(host);
	window.addEventListener('pointermove', move, { passive: true });
	window.addEventListener('pointerdown', move, { passive: true });
	window.addEventListener('pointerout', leaveViewport, { passive: true });
	window.addEventListener('blur', resetCamera);
	resize();
	draw();
	if (ambientFloat) schedule();

	return {
		facetCount: facets.length,
		destroy() {
			destroyed = true;
			cancelAnimationFrame(frame);
			resizeObserver.disconnect();
			visibilityObserver.disconnect();
			window.removeEventListener('pointermove', move);
			window.removeEventListener('pointerdown', move);
			window.removeEventListener('pointerout', leaveViewport);
			window.removeEventListener('blur', resetCamera);
			canvas.remove();
			host.classList.remove('is-svg-plane-ready', 'svg-plane-25d--facets');
			for (const node of fallbacks) node.removeAttribute('aria-hidden');
		},
	};
}

export async function mountAllSvgPlanes25d(root = document) {
	const hosts = [
		...root.querySelectorAll('.lesson-cover[data-svg-plane-25d]'),
		...root.querySelectorAll('.lesson-figure--orb'),
		...root.querySelectorAll('.page-art:not(.rive-background)'),
		...root.querySelectorAll('[data-svg-plane-25d]'),
	];
	// De-dupe if a node matches multiple selectors.
	const unique = [...new Set(hosts)];
	const mounts = [];
	const narrow = window.matchMedia('(max-width: 640px)').matches;
	for (const host of unique) {
		try {
			const isCover =
				host.classList.contains('lesson-cover') ||
				host.dataset.ambientFloat === 'true' ||
				host.dataset.svgPlane25d === 'orbit';
			const mount = await mountSvgPlane25d(host, {
				fitScale: isCover ? 0.98 : 0.92,
				yawAmplitude: isCover ? 0.065 : 0.07,
				pitchAmplitude: isCover ? 0.042 : 0.048,
				extrusionStrength: isCover ? 2.4 : 2.35,
				ambientFloat: isCover,
				ambientDepth: isCover ? 0.36 : 0,
				floatDepth: isCover ? 11 : 7,
				orbitRadius: isCover ? (narrow ? 3.2 : 5.5) : 0,
				depthGain: isCover ? 0.68 : 0.72,
				dprCap: narrow ? 1.15 : 1.4,
				maxFacets: isCover ? (narrow ? 160 : 280) : undefined,
			});
			if (mount) mounts.push(mount);
		} catch (error) {
			console.warn('[svg-plane-25d] Static SVG fallback retained.', error);
		}
	}
	return mounts;
}
