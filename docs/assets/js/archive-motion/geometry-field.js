const TAU = Math.PI * 2;

function hash32(value) {
	let hash = 2166136261;
	for (const character of String(value)) {
		hash ^= character.charCodeAt(0);
		hash = Math.imul(hash, 16777619);
	}
	return hash >>> 0;
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

function rgb(hex) {
	const value = Number.parseInt(hex.slice(1), 16);
	return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function project(x, y, z, yaw, pitch, fov, cx, cy) {
	const cosY = Math.cos(yaw);
	const sinY = Math.sin(yaw);
	const cosX = Math.cos(pitch);
	const sinX = Math.sin(pitch);
	const x1 = x * cosY - z * sinY;
	const z1 = z * cosY + x * sinY;
	const y1 = y * cosX - z1 * sinX;
	const z2 = z1 * cosX + y * sinX;
	const scale = fov / Math.max(fov * 0.24, fov + z2);
	return { x: cx + x1 * scale, y: cy + y1 * scale, depth: z2, scale };
}

function makeNodes(width, height, options) {
	const random = randomFactory(hash32(`${options.seed}:${options.shape}:archive-motion-v1`));
	const nodes = [];
	const base = Math.max(24, Math.min(58, Math.min(width, height) * 0.075));
	const isTriangle = options.shape === 'triangle';
	const stepX = isTriangle ? base * 1.3 : Math.sqrt(3) * base * 1.08;
	const stepY = isTriangle ? base * 1.15 : base * 1.68;
	const cols = Math.ceil((width * 1.3) / stepX) + 2;
	const rows = Math.ceil((height * 1.35) / stepY) + 2;

	for (let layer = 0; layer < 2; layer += 1) {
		for (let row = -Math.ceil(rows / 2); row <= Math.ceil(rows / 2); row += 1) {
			for (let column = -Math.ceil(cols / 2); column <= Math.ceil(cols / 2); column += 1) {
				const radial = Math.hypot(column / cols, row / rows);
				const wave = (Math.sin(column * 1.27 + row * 0.83 + layer * 1.9 + hash32(options.seed) * 0.0001) + 1) / 2;
				if (random() > 0.28 + wave * 0.35 + Math.max(0, 0.25 - radial * 0.3)) continue;
				const offsetX = row % 2 ? stepX / 2 : 0;
				nodes.push({
					x: column * stepX + offsetX + (layer ? stepX * 0.27 : 0),
					y: row * stepY + (layer ? stepY * 0.22 : 0),
					z: (layer ? -1 : 1) * (70 + random() * 165) + (random() - 0.5) * 75,
					size: base * (0.35 + random() * 0.9),
					rotation: random() * TAU + (isTriangle && (row + column) % 2 ? Math.PI : 0),
					phase: random() * TAU,
					speed: 0.12 + random() * 0.34,
					color: Math.floor(random() * options.palette.length),
					alpha: 0.16 + random() * 0.42,
					fill: random() < (isTriangle ? 0.48 : 0.35),
				});
			}
		}
	}

	const accents = isTriangle ? 15 : 11;
	for (let index = 0; index < accents; index += 1) {
		const angle = index * 2.399963 + random() * 0.4;
		const radius = Math.sqrt(index + 1) * Math.min(width, height) * 0.055;
		nodes.push({
			x: Math.cos(angle) * radius,
			y: Math.sin(angle) * radius * 0.72,
			z: -120 - random() * 250,
			size: base * (0.75 + random() * 1.65),
			rotation: angle + (isTriangle && index % 2 ? Math.PI : 0),
			phase: random() * TAU,
			speed: 0.16 + random() * 0.3,
			color: index % options.palette.length,
			alpha: 0.3 + random() * 0.36,
			fill: true,
		});
	}

	for (let index = nodes.length - 1; index > 0; index -= 1) {
		const swap = Math.floor(random() * (index + 1));
		[nodes[index], nodes[swap]] = [nodes[swap], nodes[index]];
	}
	return nodes.slice(0, options.maxCells);
}

export function createGeometryField(canvas, options) {
	const context = canvas.getContext('2d', { alpha: true, desynchronized: true });
	if (!context) return null;

	const palette = options.palette.map(rgb);
	const sides = options.shape === 'triangle' ? 3 : 6;
	const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
	let reduced = reducedQuery.matches;
	let active = true;
	let destroyed = false;
	let raf = 0;
	let nodes = [];
	let width = 1;
	let height = 1;
	let dpr = 1;
	let elapsed = 0;
	let previous = performance.now();
	let yaw = 0;
	let pitch = 0;
	let targetYaw = 0;
	let targetPitch = 0;
	let pointerX = 0.5;
	let pointerY = 0.5;
	let pointerActive = false;
	let scrollPitch = 0;

	function resize() {
		const bounds = canvas.getBoundingClientRect();
		width = Math.max(1, bounds.width);
		height = Math.max(1, bounds.height);
		dpr = Math.min(window.devicePixelRatio || 1, options.dprCap || 1.2);
		canvas.width = Math.round(width * dpr);
		canvas.height = Math.round(height * dpr);
		context.setTransform(dpr, 0, 0, dpr, 0, 0);
		nodes = makeNodes(width, height, options);
		draw(performance.now(), true);
	}

	function polygon(node, nowYaw, nowPitch, pulse) {
		const floatedZ = node.z + Math.sin(elapsed * node.speed + node.phase) * options.floatDepth;
		const size = node.size * (1 + pulse * 0.18);
		const points = [];
		let centre;
		for (let corner = 0; corner < sides; corner += 1) {
			const angle = node.rotation + corner * (TAU / sides) - Math.PI / 2;
			points.push(project(node.x + Math.cos(angle) * size, node.y + Math.sin(angle) * size, floatedZ, nowYaw, nowPitch, options.fov, width / 2, height / 2));
		}
		centre = project(node.x, node.y, floatedZ, nowYaw, nowPitch, options.fov, width / 2, height / 2);
		return { centre, points };
	}

	function draw(now, still = false) {
		if (destroyed) return;
		const delta = Math.min(0.05, (now - previous) / 1000);
		previous = now;
		if (!still && !reduced) elapsed += delta;
		const ease = 1 - Math.exp(-delta * 4.8);
		yaw += (targetYaw - yaw) * ease;
		pitch += (targetPitch + scrollPitch - pitch) * ease;
		context.clearRect(0, 0, width, height);

		const ordered = nodes
			.map((node) => {
				const waveZ = node.z + Math.sin(elapsed * node.speed + node.phase) * options.floatDepth;
				return { node, depth: project(node.x, node.y, waveZ, yaw, pitch, options.fov, width / 2, height / 2).depth };
			})
			.sort((a, b) => b.depth - a.depth);

		for (const entry of ordered) {
			const node = entry.node;
			const probe = project(node.x, node.y, node.z, yaw, pitch, options.fov, width / 2, height / 2);
			const distance = Math.hypot(probe.x - pointerX * width, probe.y - pointerY * height);
			const pulse = pointerActive ? Math.exp(-(distance * distance) / 36000) : 0;
			const { centre, points } = polygon(node, yaw, pitch, pulse);
			if (centre.x < -140 || centre.x > width + 140 || centre.y < -140 || centre.y > height + 140) continue;
			const color = palette[node.color] || palette[0];
			const depthFade = Math.max(0.34, Math.min(1, 1.05 - (entry.depth + 250) / 850));
			const alpha = node.alpha * depthFade;

			context.beginPath();
			context.moveTo(points[0].x, points[0].y);
			for (let index = 1; index < points.length; index += 1) context.lineTo(points[index].x, points[index].y);
			context.closePath();
			if (node.fill) {
				context.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${Math.min(0.44, alpha * 0.48 + pulse * 0.08)})`;
				context.fill();
			}
			context.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${Math.min(0.76, alpha + pulse * 0.22)})`;
			context.lineWidth = Math.max(0.65, 0.8 + points[0].scale * 0.9);
			context.stroke();
		}

		if (!still && active && !reduced) raf = requestAnimationFrame(draw);
	}

	function start() {
		if (!destroyed && active && !reduced && !raf) {
			previous = performance.now();
			raf = requestAnimationFrame((time) => {
				raf = 0;
				draw(time);
			});
		}
	}

	function stop() {
		cancelAnimationFrame(raf);
		raf = 0;
	}

	function onPointerMove(event) {
		const bounds = options.pointerRoot.getBoundingClientRect();
		pointerX = (event.clientX - bounds.left) / Math.max(1, bounds.width);
		pointerY = (event.clientY - bounds.top) / Math.max(1, bounds.height);
		pointerActive = true;
		targetYaw = (pointerX - 0.5) * 0.28;
		targetPitch = (pointerY - 0.5) * -0.18;
	}

	function onPointerLeave() {
		pointerActive = false;
		targetYaw = 0;
		targetPitch = 0;
	}

	function onScroll() {
		const bounds = options.pointerRoot.getBoundingClientRect();
		const position = Math.max(-1, Math.min(1, -bounds.top / Math.max(1, bounds.height)));
		scrollPitch = position * 0.1;
	}

	function onReducedChange() {
		reduced = reducedQuery.matches;
		if (reduced) {
			stop();
			yaw = 0;
			pitch = 0;
			draw(performance.now(), true);
		} else {
			start();
		}
	}

	const resizeObserver = new ResizeObserver(resize);
	const visibilityObserver = new IntersectionObserver(([entry]) => {
		active = entry.isIntersecting;
		if (active) start();
		else stop();
	}, { threshold: 0.02 });
	resizeObserver.observe(canvas);
	visibilityObserver.observe(canvas);
	options.pointerRoot.addEventListener('pointermove', onPointerMove, { passive: true });
	options.pointerRoot.addEventListener('pointerleave', onPointerLeave, { passive: true });
	window.addEventListener('scroll', onScroll, { passive: true });
	reducedQuery.addEventListener('change', onReducedChange);
	resize();
	start();

	return {
		destroy() {
			destroyed = true;
			stop();
			resizeObserver.disconnect();
			visibilityObserver.disconnect();
			options.pointerRoot.removeEventListener('pointermove', onPointerMove);
			options.pointerRoot.removeEventListener('pointerleave', onPointerLeave);
			window.removeEventListener('scroll', onScroll);
			reducedQuery.removeEventListener('change', onReducedChange);
		},
	};
}
