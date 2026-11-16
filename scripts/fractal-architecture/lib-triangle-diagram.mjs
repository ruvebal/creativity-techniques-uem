/**
 * Shared helpers for course diagrams in the fractalised-triangle grammar
 * (pass-track palette): Sierpinski nodes, arcs with triangular heads, labels,
 * the faint triangular lattice, the nebula ground and the SVG document shell.
 * Used by generate-creative-process.mjs and generate-four-skills.mjs.
 */
export const C = Object.freeze({
  coral: '#C93532',
  gold: '#C9C932',
  violet: '#963590',
  light: '#FFF5F3',
  groundA: '#1A0A0C',
  groundB: '#070508',
});
export const FONT = "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif";
export const SQ3 = Math.sqrt(3);
export const f = (n) => n.toFixed(2);

// ------------------------------------------------------------------ geometry

/** Equilateral triangle by centroid; up = apex on top. */
export function tri(cx, cy, s, up = true) {
  const h = (s * SQ3) / 2;
  const k = up ? 1 : -1;
  return [
    [cx, cy - (k * 2 * h) / 3],
    [cx + s / 2, cy + (k * h) / 3],
    [cx - s / 2, cy + (k * h) / 3],
  ];
}

/** Sierpiński triangle: filled leaves with their recursion level. */
export function sierpinski(cx, cy, s, depth, up = true, level = 0) {
  if (depth === 0) return [{ pts: tri(cx, cy, s, up), level }];
  const h = (s * SQ3) / 2;
  const k = up ? 1 : -1;
  return [
    [cx, cy - (k * h) / 3],
    [cx - s / 4, cy + (k * h) / 6],
    [cx + s / 4, cy + (k * h) / 6],
  ].flatMap(([x, y]) => sierpinski(x, y, s / 2, depth - 1, up, level + 1));
}

export const poly = (pts, attrs) => `<polygon points="${pts.map(([x, y]) => `${f(x)},${f(y)}`).join(' ')}" ${attrs}/>`;

/** One stage node: outline + Sierpiński leaves, opacity rising toward the centre leaves. */
export function node({ x, y, s, depth, up = true, color, accent = C.light, glow = 0 }) {
  const out = [];
  if (glow) out.push(poly(tri(x, y, s * 1.24, up), `fill="${color}" fill-opacity="${glow}"`));
  out.push(poly(tri(x, y, s, up), `fill="${color}" fill-opacity="0.16" stroke="${color}" stroke-opacity="0.85" stroke-width="2"`));
  sierpinski(x, y, s, depth, up).forEach(({ pts }, i) => {
    const op = 0.62 + 0.3 * (((i * 7) % 5) / 4);
    out.push(poly(pts, `fill="${i % 4 === 3 ? accent : color}" fill-opacity="${op.toFixed(3)}" stroke="${C.light}" stroke-opacity="0.18" stroke-width="1"`));
  });
  return `<g class="node">${out.join('')}</g>`;
}

/** Quadratic arc with a triangular arrowhead pointing along the end tangent. */
export function arc({ from, to, via, color, width = 4, opacity = 0.8, dash = '' }) {
  const [x0, y0] = from;
  const [x1, y1] = via;
  const [x2, y2] = to;
  const a = Math.atan2(y2 - y1, x2 - x1);
  const L = 22;
  const W = 13;
  const bx = x2 - L * Math.cos(a);
  const by = y2 - L * Math.sin(a);
  const head = [
    [x2, y2],
    [bx + W * Math.sin(a), by - W * Math.cos(a)],
    [bx - W * Math.sin(a), by + W * Math.cos(a)],
  ];
  // stop the stroke inside the arrowhead so the tip stays sharp
  const ex = x2 - (L * 0.6) * Math.cos(a);
  const ey = y2 - (L * 0.6) * Math.sin(a);
  return `<g class="arc"><path d="M${f(x0)},${f(y0)} Q${f(x1)},${f(y1)} ${f(ex)},${f(ey)}" fill="none" stroke="${color}" stroke-opacity="${opacity}" stroke-width="${width}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>${poly(head, `fill="${color}" fill-opacity="${Math.min(1, opacity + 0.1).toFixed(2)}"`)}</g>`;
}

export const label = (text, x, y, size, { color = C.light, weight = 600, anchor = 'middle' } = {}) =>
  `<text class="label" x="${f(x)}" y="${f(y)}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" letter-spacing="0.5" fill="${color}" text-anchor="${anchor}">${text}</text>`;

// --------------------------------------------------------- shared background

export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const overlaps = (box, zones) => zones.some(([x0, y0, x1, y1]) => box[0] < x1 && box[2] > x0 && box[1] < y1 && box[3] > y0);

/** Faint triangular lattice (pass-track field), skipping text-safe and node zones. */
export function lattice({ W, H, side, seed, keepOut, density = 0.34, maxOpacity = 0.14 }) {
  const rand = mulberry32(seed);
  const h = (side * SQ3) / 2;
  const palette = [C.coral, C.gold, C.violet];
  const out = [];
  for (let row = 0; row * h < H + h; row += 1) {
    for (let col = -1; col * (side / 2) < W + side; col += 1) {
      const up = (row + col) % 2 === 0;
      const cx = col * (side / 2);
      const cy = row * h + (up ? (2 * h) / 3 : h / 3);
      const r = rand();
      const c = palette[Math.floor(rand() * 3)];
      const o = rand();
      if (r > density) continue;
      const box = [cx - side / 2, cy - (2 * h) / 3, cx + side / 2, cy + (2 * h) / 3];
      if (overlaps(box, keepOut)) continue;
      out.push(poly(tri(cx, cy, side * 0.92, up), `fill="${c}" fill-opacity="${(0.04 + o * (maxOpacity - 0.04)).toFixed(3)}"`));
    }
  }
  return `<g aria-hidden="true">${out.join('')}</g>`;
}

export function ground(id, W, H, seed) {
  return {
    defs: `
    <linearGradient id="ground-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${C.groundA}"/>
      <stop offset="1" stop-color="${C.groundB}"/>
    </linearGradient>
    <radialGradient id="${id}-neb-a" cx="28%" cy="42%" r="58%">
      <stop offset="0" stop-color="${C.coral}" stop-opacity="0.34"/>
      <stop offset="1" stop-color="${C.groundA}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="${id}-neb-b" cx="74%" cy="58%" r="52%">
      <stop offset="0" stop-color="${C.violet}" stop-opacity="0.30"/>
      <stop offset="1" stop-color="${C.groundA}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="${id}-neb-c" cx="50%" cy="22%" r="40%">
      <stop offset="0" stop-color="${C.gold}" stop-opacity="0.18"/>
      <stop offset="1" stop-color="${C.groundA}" stop-opacity="0"/>
    </radialGradient>
    <filter id="${id}-nebula" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="4" seed="${seed}" result="noise"/>
      <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0.18  0 0 0 0 0.06  0 0 0 0 0.04  0 0 0 0.82 0" result="cloud"/>
      <feGaussianBlur in="cloud" stdDeviation="9" result="blur"/>
      <feBlend in="SourceGraphic" in2="blur" mode="screen"/>
    </filter>`,
    body: `
  <rect width="${W}" height="${H}" fill="url(#ground-${id})"/>
  <rect width="${W}" height="${H}" fill="url(#${id}-neb-a)"/>
  <rect width="${W}" height="${H}" fill="url(#${id}-neb-b)"/>
  <rect width="${W}" height="${H}" fill="url(#${id}-neb-c)"/>
  <rect width="${W}" height="${H}" filter="url(#${id}-nebula)" opacity="0.5"/>`,
  };
}

/** Text box estimate for keep-out zones (browser check verifies the real boxes). */
export const textBox = (text, x, y, size, pad = 14) => {
  const w = text.length * size * 0.6;
  return [x - w / 2 - pad, y - size - pad, x + w / 2 + pad, y + size * 0.3 + pad];
};
export const triBox = (x, y, s, pad = 18) => [x - s / 2 - pad, y - s * 0.6 - pad, x + s / 2 + pad, y + s * 0.6 + pad];

export function svgDoc({ id, W, H, title, desc, defs, body }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="title-${id} desc-${id}">
  <title id="title-${id}">${title}</title>
  <desc id="desc-${id}">${desc}</desc>
  <defs>${defs}
  </defs>${body}
</svg>
`;
}
