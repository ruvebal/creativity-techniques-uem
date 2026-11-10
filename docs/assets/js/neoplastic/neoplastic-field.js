/**
 * neoplastic-field.js: Canvas 2.5D hero field for the neoplasticizer skill (v1.0.0).
 *
 * A fractal of Duijvestijn's squared square: every square plane may open into the whole.
 * API mirrors the studio hex field so hosts can swap it in place:
 *   const field = createNeoplasticField(canvas, options)
 *   field.setCameraPaused(bool) · field.descend(tileIndex?) · field.setPalette(p) · field.destroy()
 *
 * Invariants (canvas-25d-content-hero):
 *   - exact frontal first frame: zero yaw, pitch, depth and plane travel;
 *   - camera from a filtered pointer (dead zone + low-pass), spring-damped, never raw samples;
 *   - painter order far → near; projected scale clamped to [0.94, 1.06];
 *   - camera, per-plane lift, ambient flotation and zoom are separate channels;
 *   - decorative only (aria-hidden canvas); reduced motion = one static frame, no loop.
 *
 * Seamless descent: line weight and level-of-detail depend on on-screen size only, and every
 * level uses the same colour roles. When a child fills the frame it is drawn exactly as the
 * root was, so the loop re-roots (orientation composed) without a visible jump.
 */
import { DUIJVESTIJN_21, normalise, orient, composeOrientation, childOrientation, equilibre, hash01, PALETTES } from "./neoplastic-grid.js";

const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const smooth = (lo, hi, v) => { const t = clamp((v - lo) / (hi - lo)); return t * t * (3 - 2 * t); };

export const MODES = Object.freeze({
  /** Coloured planes lift toward the viewer; camera follows the pointer. */
  // splitRelative: thresholds are fractions of the frame side, so the composition is the same
  // at every viewport (white planes ≥ 33/112 open; 29/112 stays whole).
  planes: { depthAmp: 26, maxDepth: 1, splitLo: 0.262, splitHi: 0.29, splitRelative: true, zoom: false, ambient: 1 },
  /** Endless, constant-speed zoom into one plane after another. */
  descent: { depthAmp: 8, maxDepth: 3, splitLo: 170, splitHi: 340, zoom: true, ambient: 0.4 },
  /** Static recursion that opens where the pointer looks (foveal subdivision). */
  focus: { depthAmp: 14, maxDepth: 3, splitLo: 130, splitHi: 300, zoom: false, ambient: 0.6, foveal: true },
});

export function createNeoplasticField(canvas, options = {}) {
  const mode = { ...MODES[options.mode || "planes"], ...(options.modeOverrides || {}) };
  const unit = options.unit || normalise(DUIJVESTIJN_21);
  const roles = options.roles || equilibre(unit).roles;
  let palette = { ...PALETTES.neoplastix, ...(options.palette || {}) };
  const opts = {
    fit: "cover", // cover | contain
    dprCap: 1.5,
    deadZone: 0.24,
    smoothing: 0.08,
    yawAmp: 0.07,
    pitchAmp: 0.052,
    planeTravel: 0.035,
    lineRatio: 0.03, // line weight: fraction of the parent's on-screen side (× 0.5)
    lineMin: 0.6,
    lineMax: 18,
    zoomSeconds: 14, // one full descent into a child
    seed: 7,
    interactive: true,
    pointerRoot: canvas.parentElement || canvas,
    onFrame: null,
    ...options,
  };
  const reduced = options.reducedMotion ?? (typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches);
  const ctx = canvas.getContext("2d", { alpha: true });
  canvas.setAttribute("aria-hidden", "true");

  // ---- state -------------------------------------------------------------------------------
  let W = 0, H = 0, dpr = 1, raf = 0, last = 0, running = false, destroyed = false;
  let cameraPaused = false;
  const raw = { x: 0, y: 0 }, filt = { x: 0, y: 0 };
  const cam = { yaw: 0, pitch: 0, travelX: 0, travelY: 0, depth: 0 };
  const vel = { yaw: 0, pitch: 0, travelX: 0, travelY: 0, depth: 0 };
  const target = { yaw: 0, pitch: 0, travelX: 0, travelY: 0, depth: 0 };
  let rootOrientation = options.orientation ?? 0;
  let progress = 0; // descent progress 0 → 1
  let zoomChild = pickTarget(rootOrientation, 0);
  let time = 0;

  function pickTarget(o, turn) {
    // Largest white planes first, cycling: the descent always enters "quiet" ground.
    const whites = unit.filter((t) => roles[t.i] === "white" && t.w > 0.12).sort((a, b) => b.w - a.w);
    const pick = whites[turn % whites.length] || unit[0];
    return { tile: pick, turn };
  }

  // ---- layout ------------------------------------------------------------------------------
  function frame() {
    const S = opts.fit === "cover" ? Math.max(W, H) : Math.min(W, H);
    return { x: (W - S) / 2, y: (H - S) / 2, S };
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(opts.dprCap, globalThis.devicePixelRatio || 1);
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    draw();
  }

  // ---- collect draw items -----------------------------------------------------------------
  function collect() {
    const f = frame();
    let box = { x: f.x, y: f.y, s: f.S };
    let o = rootOrientation;
    if (mode.zoom && progress > 0) {
      const t = orient(zoomChild.tile, o);
      const m = Math.pow(t.w, -progress); // exponential zoom: constant perceived speed
      const Fx = f.x + (t.x * f.S) / (1 - t.w);
      const Fy = f.y + (t.y * f.S) / (1 - t.w);
      box = { x: Fx + (f.x - Fx) * m, y: Fy + (f.y - Fy) * m, s: f.S * m };
    }
    const items = [];
    const fx = W / 2 + filt.x * W * 0.5, fy = H / 2 + filt.y * H * 0.5;
    // Rule: only the white ground opens into the whole; colour planes stay whole.
    // `enter` (0..1) is how far a level has arrived: planes wipe in orthogonally, lines thicken.
    const walk = (bx, by, s, depth, ori, enter, path) => {
      for (const u of unit) {
        const r = orient(u, ori);
        const x = bx + r.x * s, y = by + r.y * s, w = r.w * s;
        if (x > W || y > H || x + w < 0 || y + w < 0 || w < 1.2) continue;
        const role = roles[u.i];
        const h = hash01(u.i, depth, path);
        items.push({ x, y, w, role, enter, depth, parent: s, wipe: Math.floor(h * 4), lift: role === "white" ? 0 : 0.65 + 0.35 * h });
        if (role !== "white" || depth >= mode.maxDepth) continue;
        const scale = mode.splitRelative ? f.S : 1;
        let split = smooth(mode.splitLo * scale, mode.splitHi * scale, w);
        if (mode.foveal) split *= smooth(0.55, 0.05, Math.hypot(x + w / 2 - fx, y + w / 2 - fy) / Math.max(W, H));
        if (split > 0.001) walk(x, y, w, depth + 1, composeOrientation(childOrientation(u.i, opts.seed), ori), split, path * 23 + u.i + 1);
      }
    };
    walk(box.x, box.y, box.s, 0, o, 1, 0);
    return items;
  }

  // ---- draw --------------------------------------------------------------------------------
  /** Orthogonal wipe: a plane grows from one of its four edges. Never an alpha blend. */
  function wipeRect(x, y, w, e, dir) {
    if (e >= 1) return [x, y, w, w];
    const d = w * e;
    return dir === 0 ? [x, y, d, w] : dir === 1 ? [x + w - d, y, d, w] : dir === 2 ? [x, y, w, d] : [x, y + w - d, w, d];
  }

  function draw() {
    if (!W) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = palette.white;
    ctx.fillRect(0, 0, W, H);
    const items = collect();
    const tx = cam.travelX * W, ty = cam.travelY * H;
    // 1. Ground: every plane flat, in place (colour footprints included).
    for (const it of items) {
      if (it.role === "white") continue;
      ctx.fillStyle = palette[it.role];
      const [x, y, w, h] = wipeRect(it.x + tx, it.y + ty, it.w, it.enter, it.wipe);
      ctx.fillRect(x, y, w, h);
    }
    ctx.strokeStyle = palette.line;
    for (const it of items) {
      const lw = clamp(it.parent * opts.lineRatio * 0.5, opts.lineMin, opts.lineMax) * it.enter;
      if (lw < 0.15) continue;
      ctx.lineWidth = lw;
      ctx.strokeRect(it.x + tx, it.y + ty, it.w, it.w);
    }
    // 2. Relief: colour planes lift off their footprints toward the viewer (2.5D, far → near).
    const planar = mode.depthAmp * cam.depth;
    let lifted = 0;
    if (planar > 0.05) {
      const cx = W / 2, cy = H / 2;
      const planes = items.filter((it) => it.lift > 0 && it.enter > 0.98 && it.w > 6).sort((a, b) => a.lift - b.lift);
      for (const it of planes) {
        const zz = it.lift * planar;
        const k = clamp(1 + zz * 0.0022, 0.94, 1.06);
        const x = cx + (it.x + tx - cx) * k + cam.yaw * zz * 1.4;
        const y = cy + (it.y + ty - cy) * k + cam.pitch * zz * 1.4;
        const w = it.w * k;
        ctx.save();
        ctx.shadowColor = "rgba(18,18,18,0.28)";
        ctx.shadowBlur = zz * 0.9;
        ctx.shadowOffsetX = -cam.yaw * zz * 0.6;
        ctx.shadowOffsetY = zz * 0.35 - cam.pitch * zz * 0.6;
        ctx.fillStyle = palette[it.role];
        ctx.fillRect(x, y, w, w);
        ctx.restore();
        ctx.lineWidth = clamp(it.parent * k * opts.lineRatio * 0.5, opts.lineMin, opts.lineMax);
        ctx.strokeRect(x, y, w, w);
        lifted++;
      }
    }
    opts.onFrame?.({ items: items.length, lifted, progress, cam });
  }

  // ---- motion ------------------------------------------------------------------------------
  const spring = (key, dt, freq = 5.2, damping = 1) => {
    vel[key] += (freq * freq * (target[key] - cam[key]) - 2 * damping * freq * vel[key]) * dt;
    cam[key] += vel[key] * dt;
  };

  function tick(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - (last || now)) / 1000);
    last = now; time += dt;
    filt.x += (raw.x - filt.x) * opts.smoothing;
    filt.y += (raw.y - filt.y) * opts.smoothing;
    if (!cameraPaused) {
      const radius = Math.min(1, Math.hypot(filt.x, filt.y));
      const g = smooth(opts.deadZone, 1, radius);
      target.yaw = filt.x * g * opts.yawAmp * 10;
      target.pitch = filt.y * g * opts.pitchAmp * 10; // offsets scale by lift: ≈ ±25 px at full depth
      target.travelX = -filt.x * g * opts.planeTravel;
      target.travelY = -filt.y * g * opts.planeTravel;
      target.depth = clamp(g + mode.ambient * 0.35 * (0.5 + 0.5 * Math.sin(time * 0.45)) * (time > 1.2 ? 1 : time / 1.2));
    }
    for (const key of ["yaw", "pitch", "travelX", "travelY", "depth"]) spring(key, dt);
    if (mode.zoom) {
      progress += dt / opts.zoomSeconds;
      if (progress >= 1) {
        progress -= 1;
        rootOrientation = composeOrientation(childOrientation(zoomChild.tile.i, opts.seed), rootOrientation);
        zoomChild = pickTarget(rootOrientation, zoomChild.turn + 1);
      }
    }
    draw();
    raf = requestAnimationFrame(tick);
  }

  function start() {
    if (running || reduced || destroyed) return;
    running = true; last = 0;
    raf = requestAnimationFrame(tick);
  }
  function stop() { running = false; cancelAnimationFrame(raf); }

  // ---- input -------------------------------------------------------------------------------
  const root = opts.pointerRoot;
  const onMove = (e) => {
    const r = root.getBoundingClientRect();
    raw.x = clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1);
    raw.y = clamp(((e.clientY - r.top) / r.height) * 2 - 1, -1, 1);
  };
  const onLeave = () => { raw.x = 0; raw.y = 0; };
  const onClick = (e) => {
    if (!mode.zoom) return;
    const r = canvas.getBoundingClientRect();
    const px = e.clientX - r.left, py = e.clientY - r.top;
    const f = frame();
    const hit = unit.map((u) => ({ u, r: orient(u, rootOrientation) }))
      .find(({ r: q }) => px >= f.x + q.x * f.S && px <= f.x + (q.x + q.w) * f.S && py >= f.y + q.y * f.S && py <= f.y + (q.y + q.h) * f.S);
    if (hit && progress < 0.15) zoomChild = { tile: hit.u, turn: zoomChild.turn };
  };
  const onVis = () => (document.hidden ? stop() : start());
  if (opts.interactive && !reduced) {
    root.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("click", onClick);
  }
  document.addEventListener("visibilitychange", onVis);
  const ro = typeof ResizeObserver === "function" ? new ResizeObserver(resize) : null;
  ro?.observe(canvas);
  const io = typeof IntersectionObserver === "function"
    ? new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0 })
    : null;
  io?.observe(canvas);

  resize();
  if (!io) start();

  return {
    canvas,
    roles,
    setCameraPaused(paused) {
      cameraPaused = !!paused;
      if (paused) for (const k of Object.keys(target)) { target[k] = cam[k]; vel[k] = 0; }
    },
    setPalette(p) { palette = { ...palette, ...p }; draw(); },
    descend(index) { const t = unit.find((u) => u.i === index); if (t) zoomChild = { tile: t, turn: zoomChild.turn }; },
    redraw: draw,
    start,
    stop,
    destroy() {
      destroyed = true; stop();
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("click", onClick);
      document.removeEventListener("visibilitychange", onVis);
      ro?.disconnect(); io?.disconnect();
    },
  };
}
