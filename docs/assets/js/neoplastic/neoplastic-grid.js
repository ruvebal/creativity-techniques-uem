/**
 * neoplastic-grid.js: frozen geometry for the neoplasticizer skill (v1.0.0).
 *
 * Pure ES module, no DOM, no dependencies. Everything here is checkable outside the picture:
 * run `node scripts/verify-grounding.mjs` (exit 0 = every frozen claim re-derived).
 *
 *   1. Bouwkamp decoding: a squared rectangle written as bracketed rows → absolute tiles.
 *   2. Frozen tilings: Duijvestijn 21:112 (lowest-order simple perfect squared square, 1978)
 *      and Moroń 9:33×32 (smallest perfect squared rectangle, 1925).
 *   3. Mondrian Art Problem: exhaustive search for small n (OEIS A276523).
 *   4. Fractal substitution: every square tile may be re-tiled by the whole (D4-oriented).
 *   5. Équilibre: deterministic colouring by an asymmetric-balance rule (studio formula).
 *
 * Boundary (Mondrian grounding rule): these numbers are mathematics, not Mondrian's measured
 * proportions. The homage is conceptual: rectangular planes, ratios ("rapports") held in
 * balance ("équilibre"), and no two planes equal.
 */

export const VERSION = "1.0.0";

/** Duijvestijn (1978), J. Comb. Theory B 25:240–243. Unique simple perfect squared square of order 21. */
export const DUIJVESTIJN_21 = Object.freeze({
  id: "duijvestijn-21-112",
  name: "Duijvestijn order-21 squared square",
  width: 112,
  height: 112,
  bouwkamp: [[50, 35, 27], [8, 19], [15, 17, 11], [6, 24], [29, 25, 9, 2], [7, 18], [16], [42], [4, 37], [33]],
});

/** Moroń (1925), Przegląd Mat.-Fiz. 3:152–153. Smallest perfect squared rectangle: nine unequal squares. */
export const MORON_9 = Object.freeze({
  id: "moron-9-33x32",
  name: "Moroń nine-square rectangle",
  width: 33,
  height: 32,
  bouwkamp: [[18, 15], [7, 8], [14, 4], [10, 1], [9]],
});

/**
 * Decode a Bouwkamp code. Each bracket fills the highest (smallest y), then leftmost, free
 * horizontal segment of the skyline, left to right. y grows downward.
 * @returns {{x:number,y:number,w:number,h:number,i:number}[]} tiles in code order
 */
export function decodeBouwkamp({ width, bouwkamp }) {
  let skyline = [{ x: 0, y: 0, w: width }];
  const tiles = [];
  let i = 0;
  for (const row of bouwkamp) {
    let best = 0;
    for (let k = 1; k < skyline.length; k++) {
      if (skyline[k].y < skyline[best].y) best = k;
    }
    const seg = skyline[best];
    const sum = row.reduce((a, b) => a + b, 0);
    if (sum !== seg.w) throw new Error(`Bouwkamp row [${row}] sums to ${sum}, segment is ${seg.w}`);
    let x = seg.x;
    const fresh = row.map((s) => {
      tiles.push({ x, y: seg.y, w: s, h: s, i: i++ });
      const part = { x, y: seg.y + s, w: s };
      x += s;
      return part;
    });
    skyline.splice(best, 1, ...fresh);
    const merged = [];
    for (const s of skyline) {
      const last = merged[merged.length - 1];
      if (last && last.y === s.y && last.x + last.w === s.x) last.w += s.w;
      else merged.push({ ...s });
    }
    skyline = merged;
  }
  return tiles;
}

/** Exact cover check on the integer lattice: no gap, no overlap, all sides distinct when `perfect`. */
export function verifyTiling(tiles, width, height, { perfect = true } = {}) {
  const grid = new Uint8Array(width * height);
  for (const t of tiles) {
    if (t.x < 0 || t.y < 0 || t.x + t.w > width || t.y + t.h > height) return { ok: false, why: `tile ${t.i} out of bounds` };
    for (let y = t.y; y < t.y + t.h; y++) {
      for (let x = t.x; x < t.x + t.w; x++) {
        if (grid[y * width + x]++) return { ok: false, why: `overlap at ${x},${y}` };
      }
    }
  }
  if (grid.some((c) => c !== 1)) return { ok: false, why: "gap" };
  if (perfect) {
    const sides = tiles.map((t) => t.w);
    if (new Set(sides).size !== sides.length) return { ok: false, why: "repeated square size" };
  }
  return { ok: true, why: "" };
}

/** Normalised tiling in the unit square/rectangle: x,y,w,h ∈ [0,1] of the outer box. */
export function normalise(tiling) {
  const tiles = decodeBouwkamp(tiling);
  return tiles.map((t) => ({ ...t, x: t.x / tiling.width, y: t.y / tiling.height, w: t.w / tiling.width, h: t.h / tiling.height, side: t.w }));
}

/* ---------------------------------------------------------------------------------------------
 * D4 orientations (8 symmetries of the square) applied inside a unit box.
 * ------------------------------------------------------------------------------------------- */

export const D4 = Object.freeze([0, 1, 2, 3, 4, 5, 6, 7]);

/** Map a unit-square rectangle by orientation o (0–3 rotations, 4–7 mirrored rotations). */
export function orient(r, o) {
  let { x, y, w, h } = r;
  if (o >= 4) x = 1 - x - w; // mirror first
  for (let k = 0; k < o % 4; k++) {
    // rotate 90° clockwise inside the unit square: (x,y,w,h) → (1-y-h, x, h, w)
    [x, y, w, h] = [1 - y - h, x, h, w];
  }
  return { ...r, x, y, w, h };
}

/** Compose orientations: apply a, then b. Computed numerically once, cached. */
const PROBE = { x: 0.1, y: 0.2, w: 0.3, h: 0.15 };
const key = (r) => [r.x, r.y, r.w, r.h].map((v) => v.toFixed(6)).join(",");
const TABLE = D4.map((a) => D4.map((b) => {
  const target = key(orient(orient(PROBE, a), b));
  return D4.find((c) => key(orient(PROBE, c)) === target);
}));
export function composeOrientation(a, b) {
  return TABLE[a][b];
}

/* ---------------------------------------------------------------------------------------------
 * Fractal substitution: the whole re-tiles any of its square parts.
 * ------------------------------------------------------------------------------------------- */

/** Small deterministic hash → [0,1). Mulberry-style integer mix. */
export function hash01(...ints) {
  let h = 0x9e3779b9;
  for (const n of ints) {
    h ^= n + 0x7f4a7c15 + (h << 6) + (h >>> 2);
    h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d);
    h = Math.imul(h ^ (h >>> 12), 0x297a2d39);
  }
  return ((h ^ (h >>> 15)) >>> 0) / 4294967296;
}

/**
 * Local orientation of child i inside a parent. Deterministic, so a zoom loop that re-roots
 * on a child stays seamless: the child's subtree is the root's subtree under `orientation`.
 */
export function childOrientation(i, seed = 0) {
  return Math.floor(hash01(i, seed) * 8);
}

/**
 * Expand the fractal into absolute rectangles of a box, by level of detail.
 * @param {object} box {x,y,size} in any unit (px)
 * @param {function} shouldSplit (node) → number in [0,1]: 0 = leaf, 1 = fully split, between = crossfade
 * @returns {{x,y,w,h,depth,index,role,orientation,alpha}[]}
 */
export function expandFractal(box, { unit = normalise(DUIJVESTIJN_21), roles, shouldSplit, maxDepth = 4, seed = 0, orientation = 0, minSize = 1.5 } = {}) {
  const out = [];
  const walk = (bx, by, size, depth, o, inherited, alpha) => {
    for (const t of unit) {
      const r = orient(t, o);
      const node = { x: bx + r.x * size, y: by + r.y * size, w: r.w * size, h: r.h * size, depth, index: t.i, side: t.side, role: roles ? roles[t.i] : "white", orientation: o, alpha, path: inherited };
      if (node.w < minSize) continue;
      const split = depth < maxDepth && shouldSplit ? shouldSplit(node) : 0;
      if (split < 1) out.push({ ...node, alpha: alpha * (1 - split), split });
      if (split > 0) walk(node.x, node.y, node.w, depth + 1, composeOrientation(childOrientation(t.i, seed), o), inherited * 32 + t.i + 1, alpha * split);
    }
  };
  walk(box.x, box.y, box.size, 0, orientation, 0, 1);
  return out;
}

/* ---------------------------------------------------------------------------------------------
 * Équilibre: colour roles by asymmetric balance (studio formula, not a Mondrian measurement).
 *
 * Choose exactly one red, one blue, one yellow and optional black among the tiles so that
 *   (a) the coloured area fraction stays within [fMin, fMax] (quiet ground, few planes);
 *   (b) the visual-weight centroid is off-centre by at least `asym` (no symmetry) …
 *   (c) … yet the composition's weighted moment about the centre is minimised (balance).
 * Weights: perceived "heaviness" per role. Deterministic: same tiling + options → same roles.
 * ------------------------------------------------------------------------------------------- */

export const ROLE_WEIGHT = Object.freeze({ red: 1.0, blue: 1.25, yellow: 0.55, black: 1.8, white: 0 });

export function equilibre(unitTiles, { fMin = 0.18, fMax = 0.4, asym = 0.04, black = true } = {}) {
  const n = unitTiles.length;
  const area = (t) => t.w * t.h;
  const cx = (t) => t.x + t.w / 2 - 0.5;
  const cy = (t) => t.y + t.h / 2 - 0.5;
  let best = null;
  const smallest = [...unitTiles].sort((a, b) => area(a) - area(b));
  // One small black plane when `black` (the armature's own colour entering as a plane).
  const blackCandidates = black ? smallest.slice(0, 5) : [null];
  for (let r = 0; r < n; r++) for (let b = 0; b < n; b++) for (let y = 0; y < n; y++) {
    if (r === b || r === y || b === y) continue;
    for (const k of blackCandidates) {
      if (k && (k.i === r || k.i === b || k.i === y)) continue;
      const picks = [[unitTiles[r], "red"], [unitTiles[b], "blue"], [unitTiles[y], "yellow"]];
      if (k) picks.push([k, "black"]);
      const f = picks.reduce((s, [t]) => s + area(t), 0);
      if (f < fMin || f > fMax) continue;
      let mx = 0, my = 0, wsum = 0;
      for (const [t, role] of picks) {
        const w = area(t) * ROLE_WEIGHT[role];
        mx += w * cx(t); my += w * cy(t); wsum += w;
      }
      const off = Math.hypot(mx / wsum, my / wsum);
      if (off < asym) continue;
      // balance: prefer the dominant plane large, the counterweights spread to other quadrants
      const moment = Math.hypot(mx, my);
      const dominance = -area(unitTiles[r]);
      const score = moment + 0.15 * dominance;
      if (!best || score < best.score) best = { score, picks, f, off };
    }
  }
  const roles = Array(n).fill("white");
  if (best) for (const [t, role] of best.picks) roles[t.i] = role;
  return { roles, colouredFraction: best?.f ?? 0, centroidOffset: best?.off ?? 0 };
}

/* ---------------------------------------------------------------------------------------------
 * Mondrian Art Problem (Pegg; OEIS A276523): split an n×n square into ≥2 pairwise
 * non-congruent integer rectangles minimising (largest area − smallest area).
 * Exhaustive search with pruning; fine for n ≤ 8 in Node, use precomputed data in browsers.
 * ------------------------------------------------------------------------------------------- */

export function mondrianArt(n, { limit = Infinity } = {}) {
  const shapes = [];
  for (let a = 1; a <= n; a++) for (let b = a; b <= n; b++) if (!(a === n && b === n)) shapes.push([a, b, a * b]);
  shapes.sort((p, q) => q[2] - p[2]);
  let bestDefect = Math.min(limit, n * n);
  let bestSolutions = [];
  const grid = new Uint8Array(n * n);
  const used = new Set();
  const placed = [];
  const firstEmpty = () => { for (let k = 0; k < n * n; k++) if (!grid[k]) return k; return -1; };
  const fits = (x, y, w, h) => {
    if (x + w > n || y + h > n) return false;
    for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (grid[j * n + i]) return false;
    return true;
  };
  const fill = (x, y, w, h, v) => { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) grid[j * n + i] = v; };
  const search = (minA, maxA) => {
    const k = firstEmpty();
    if (k < 0) {
      const d = maxA - minA;
      if (placed.length >= 2 && d <= bestDefect) {
        if (d < bestDefect) { bestDefect = d; bestSolutions = []; }
        if (bestSolutions.length < 64) bestSolutions.push(placed.map((p) => ({ ...p })));
      }
      return;
    }
    const x = k % n, y = (k / n) | 0;
    for (const [a, b, A] of shapes) {
      const lo = Math.min(minA, A), hi = Math.max(maxA, A);
      if (hi - lo > bestDefect) continue;
      const id = `${a}x${b}`;
      if (used.has(id)) continue;
      for (const [w, h] of a === b ? [[a, b]] : [[a, b], [b, a]]) {
        if (!fits(x, y, w, h)) continue;
        used.add(id); fill(x, y, w, h, 1); placed.push({ x, y, w, h });
        search(lo, hi);
        placed.pop(); fill(x, y, w, h, 0); used.delete(id);
      }
    }
  };
  search(Infinity, -Infinity);
  return { n, defect: bestDefect, solutions: bestSolutions };
}

/* ---------------------------------------------------------------------------------------------
 * Palettes. Roles, not hex, are the contract; each host supplies its own hex per role.
 * ------------------------------------------------------------------------------------------- */

export const PALETTES = Object.freeze({
  neoplastix: { red: "#d41111", yellow: "#f9d006", blue: "#1754cf", black: "#121212", white: "#f4f2ed", line: "#121212" },
  "neoplastix-night": { red: "#d41111", yellow: "#f9d006", blue: "#3b74ee", black: "#f4f2ed", white: "#161616", line: "#f4f2ed" },
});
