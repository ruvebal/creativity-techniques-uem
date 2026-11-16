export function clamp(value, minimum = 0, maximum = 1) {
	return Math.max(minimum, Math.min(maximum, value));
}

export function smoothstep(value) {
	const t = clamp(value);
	return t * t * (3 - 2 * t);
}

/**
 * Zero response in the foveal centre, then a smooth nonlinear rise to the edge.
 * The returned gain can multiply every pointer-driven channel without changing
 * its direction.
 */
export function fovealResponse(x, y, deadZone = 0.08) {
	const radius = clamp(Math.hypot(x, y));
	const normalized = clamp((radius - deadZone) / Math.max(0.001, 1 - deadZone));
	return { radius, gain: smoothstep(normalized) };
}

export function springStep(state, target, delta, frequency = 7, damping = 1.04) {
	const stiffness = frequency * frequency;
	const drag = 2 * damping * frequency;
	state.velocity += (stiffness * (target - state.value) - drag * state.velocity) * delta;
	state.value += state.velocity * delta;
}

export function springAtRest(state, target, epsilon = 0.0002) {
	return Math.abs(state.value - target) < epsilon && Math.abs(state.velocity) < epsilon;
}

export function svgScale(value) {
	const match = /scale\(\s*([-+\d.]+)(?:[,\s]+([-+\d.]+))?\s*\)/.exec(value || '');
	return match ? { x: Number(match[1]), y: Number(match[2] || match[1]) } : { x: 1, y: 1 };
}

export function svgViewBox(svg) {
	const values = (svg.getAttribute('viewBox') || '0 0 1024 920').split(/[\s,]+/).map(Number);
	return { x: values[0], y: values[1], width: values[2], height: values[3] };
}

/**
 * Triangular-ish Z spread (Bates n=3): denser mid-layers, rarer extremes.
 * Optional `sizeNorm` (0–1) pushes larger facets farther from the mid-plane
 * so ungrouped triangles read as independent depth bands.
 */
export function sourceLayerDepth(index, count, sizeNorm = 0.5) {
	const t1 = (index * 0.61803398875 + 0.11) % 1;
	const t2 = (index * 0.41421356237 + 0.37) % 1;
	const t3 = (index * 0.73205080757 + 0.59) % 1;
	const triangular = (t1 + t2 + t3) / 3;
	const mid = (triangular - 0.5) * 2;
	const span = Math.max(48, count * 0.42);
	const sizePush = (sizeNorm - 0.5) * 36;
	const jitter = (((index * 0.61803398875 + 0.17) % 1) - 0.5) * 14;
	return mid * span + sizePush + jitter;
}

/**
 * Size-ordered Z: smaller facets come forward (negative Z is nearer the
 * viewer), larger ones recede. `sizeRank` is 0 for the smallest facet and 1
 * for the largest; a tiny deterministic jitter only separates equal sizes.
 */
export function sizeLayerDepth(sizeRank, index, count) {
	const span = Math.max(48, count * 0.42);
	const jitter = (((index * 0.61803398875 + 0.17) % 1) - 0.5) * 3;
	return (sizeRank - 0.5) * 2 * span + jitter;
}

/** Shoelace area of a path element sampled along its outline. */
export function sampledPathArea(pathElement, samples = 48) {
	const length = pathElement.getTotalLength();
	if (!length) return 0;
	let area = 0;
	let prev = pathElement.getPointAtLength(0);
	for (let i = 1; i <= samples; i += 1) {
		const next = pathElement.getPointAtLength((length * i) / samples);
		area += prev.x * next.y - next.x * prev.y;
		prev = next;
	}
	return Math.abs(area) / 2;
}

export function projectFacet(facet, viewBox, camera, elapsed, options = {}) {
	const orbitRadius = options.orbitRadius ?? 0;
	const orbitSpeed = options.orbitSpeed ?? 0.42;
	const orbitX = orbitRadius
		? Math.cos(elapsed * orbitSpeed + facet.phase) * orbitRadius
		: 0;
	const orbitY = orbitRadius
		? Math.sin(elapsed * orbitSpeed * 0.87 + facet.phase * 1.13) * orbitRadius * 0.62
		: 0;
	const x = facet.x - (viewBox.x + viewBox.width / 2) + orbitX;
	const y = facet.y - (viewBox.y + viewBox.height / 2) + orbitY;
	const floatDepth = options.floatDepth ?? 6;
	const extrusionStrength = options.extrusionStrength ?? 2.1;
	const z = (
		facet.z + Math.sin(elapsed * 1.25 + facet.phase) * floatDepth
	) * camera.depth.value * extrusionStrength;
	const cosYaw = Math.cos(camera.yaw.value);
	const sinYaw = Math.sin(camera.yaw.value);
	const cosPitch = Math.cos(camera.pitch.value);
	const sinPitch = Math.sin(camera.pitch.value);
	const insetX = options.insetX ?? 2.9;
	const insetY = options.insetY ?? 2.4;
	const x1 = x * cosYaw - z * sinYaw * insetX;
	const z1 = z * cosYaw + x * sinYaw;
	const y2 = y * cosPitch - z1 * sinPitch * insetY;
	const z2 = z1 * cosPitch + y * sinPitch;
	const fov = options.fov ?? 920;
	const perspectiveStrength = options.perspectiveStrength ?? 0.28;
	const rawPerspective = fov / Math.max(fov * 0.35, fov + z2 * perspectiveStrength);
	const perspective = clamp(
		rawPerspective,
		options.minPerspective ?? 0.94,
		options.maxPerspective ?? 1.06,
	);
	return { x: x1 * perspective, y: y2 * perspective, z: z2, perspective };
}

