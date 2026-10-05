#!/usr/bin/env node
/**
 * Browser layout check for student decks (PHASE-EX5 cold review F2, F3).
 * Node stdlib + a local Chrome over the DevTools protocol; no npm packages.
 *
 *   npm run build            # or: bundle exec jekyll build … (needs _site)
 *   node scripts/tests/browser/deck-layout.mjs [--sizes=1280x720,1920x1080,1024x768] [--shots=<dir>]
 *
 * Serves _site under the site baseurl, opens every slide of U1–U3, U4 and the
 * master lecture, and asserts on each slide (VISUAL-READABILITY-LAW):
 *   - the card lies inside its section and inside the viewport (F2)
 *   - every Lab timer lies inside its section and the viewport, fully visible (F2)
 *   - caption ∩ card-toggle = ∅, caption ∩ card = ∅, toggle ∩ card = ∅,
 *     timer ∩ toggle = ∅, toggle ∩ Reveal arrows = ∅, caption/toggle ∩ back link = ∅ (F3)
 * A card that needs inner scrolling is reported as a note (allowed: the timer
 * stays outside the card), not a failure.
 *
 * Exit 0 = all pass; 1 = failures; 0 with "SKIP" when no Chrome is found
 * (set CHROME=/path/to/chrome to choose one).
 */
import { spawn, execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { tmpdir } from 'node:os';

const root = process.cwd();
const site = join(root, '_site');
const arg = (name, fallback) => (process.argv.find((a) => a.startsWith(`--${name}=`)) || `=${fallback}`).split('=')[1];
const sizes = arg('sizes', '1280x720,1920x1080,1024x768').split(',').map((s) => s.split('x').map(Number));
const shots = arg('shots', '');
const base = (readFileSync(join(root, '_config.yml'), 'utf8').match(/^baseurl:\s*['"]?([^'"\n]*)['"]?/m) || [])[1] ?? '';
const decks = [
  '/tracks/ct/u-1-introduction-creativity/',
  '/tracks/ct/u-2-idea-generation-selection/',
  '/tracks/ct/u-3-development-solutions/',
  '/tracks/ct/u-4-workplace-application/',
  '/master-lectures/creative-process-analysis/',
];

function findChrome() {
  const candidates = [process.env.CHROME, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium'].filter(Boolean);
  for (const c of candidates) if (existsSync(c)) return c;
  for (const name of ['google-chrome', 'chromium', 'chromium-browser']) {
    try { return execFileSync('which', [name], { encoding: 'utf8' }).trim(); } catch { /* next */ }
  }
  return null;
}

const chromePath = findChrome();
if (!chromePath) { console.log('SKIP deck-layout: no Chrome found (set CHROME)'); process.exit(0); }
if (!existsSync(site)) { console.error('deck-layout: _site missing — build first'); process.exit(2); }

const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.woff2': 'font/woff2' };
const server = createServer((req, res) => {
  let path = decodeURIComponent(req.url.split('?')[0]);
  if (base && path.startsWith(base)) path = path.slice(base.length) || '/';
  let file = normalize(join(site, path));
  if (!file.startsWith(site)) { res.writeHead(403).end(); return; }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file)) { res.writeHead(404).end('not found'); return; }
  res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}${base}`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const port = 9400 + Math.floor(Math.random() * 400);
const chrome = spawn(chromePath, ['--headless=new', `--remote-debugging-port=${port}`,
  `--user-data-dir=${join(tmpdir(), `deck-layout-${port}`)}`, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
let target;
for (let i = 0; i < 75 && !target; i++) {
  await sleep(200);
  try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page'); } catch { /* retry */ }
}
if (!target) { console.error('deck-layout: Chrome did not start'); chrome.kill(); server.close(); process.exit(2); }
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => { ws.onopen = r; });
let seq = 0;
const pending = new Map();
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++seq; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const evaluate = async (expression) => {
  const m = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (m.result?.exceptionDetails) throw new Error(JSON.stringify(m.result.exceptionDetails).slice(0, 400));
  return m.result.result.value;
};
await send('Page.enable');

// Runs in the page: walk every slide, measure, return findings.
const PROBE = `(async () => {
  const wait = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  for (let i = 0; i < 100 && !(window.Reveal && Reveal.isReady && Reveal.isReady()); i++) await new Promise((r) => setTimeout(r, 100));
  Reveal.configure({ transition: 'none', backgroundTransition: 'none' });
  const box = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return r.width && r.height ? { l: r.left, t: r.top, r: r.right, b: r.bottom } : null; };
  const hit = (a, b) => a && b && a.l < b.r - 0.5 && b.l < a.r - 0.5 && a.t < b.b - 0.5 && b.t < a.b - 0.5;
  const inside = (a, b) => a && b && a.l >= b.l - 1 && a.t >= b.t - 1 && a.r <= b.r + 1 && a.b <= b.b + 1;
  const vp = { l: 0, t: 0, r: innerWidth, b: innerHeight };
  const toggle = box(document.querySelector('.student-media-controls button'));
  const back = box(document.querySelector('.track-back'));
  const arrows = box(document.querySelector('.reveal .controls'));
  const sections = [...document.querySelectorAll('.reveal .slides > section')];
  const out = [];
  for (let i = 0; i < sections.length; i++) {
    Reveal.slide(i); await wait(); await wait();
    const s = sections[i];
    const id = s.dataset.slideId || ('#' + (i + 1));
    const sec = box(s);
    const cardEl = s.querySelector('.student-media-slide');
    const card = box(cardEl);
    const cap = box(s.querySelector('.slide-caption'));
    const timer = box(s.querySelector('.slide-timer'));
    const fail = [];
    if (card && !inside(card, sec)) fail.push('card outside section ' + JSON.stringify({ card, sec }));
    if (card && !inside(card, vp)) fail.push('card outside viewport');
    if (s.dataset.timer) {
      if (!timer) fail.push('timer missing');
      else {
        if (!inside(timer, sec)) fail.push('timer outside section ' + JSON.stringify({ timer, sec }));
        if (!inside(timer, vp)) fail.push('timer outside viewport');
        if (hit(timer, card)) fail.push('timer overlaps card');
        if (hit(timer, toggle)) fail.push('timer overlaps toggle');
      }
    }
    if (hit(cap, toggle)) fail.push('caption overlaps toggle');
    if (hit(cap, card)) fail.push('caption overlaps card');
    if (hit(toggle, card)) fail.push('toggle overlaps card');
    if (hit(toggle, arrows)) fail.push('toggle overlaps Reveal arrows');
    if (hit(cap, back)) fail.push('caption overlaps back link');
    if (hit(toggle, back)) fail.push('toggle overlaps back link');
    const scrolls = cardEl && cardEl.scrollHeight > cardEl.clientHeight + 1;
    out.push({ i, id, fail, scrolls, timer: !!timer });
  }
  Reveal.slide(0);
  return out;
})()`;

let failures = 0;
let checked = 0;
for (const [w, h] of sizes) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false });
  for (const deck of decks) {
    await send('Page.navigate', { url: `${origin}${deck}` });
    await sleep(2500);
    const results = await evaluate(PROBE);
    const slug = deck.split('/').filter(Boolean).pop();
    for (const r of results) {
      checked += 1;
      if (r.fail.length) {
        failures += r.fail.length;
        console.log(`FAIL ${w}x${h} ${slug} ${r.id}: ${r.fail.join('; ')}`);
      } else if (r.scrolls) {
        console.log(`note ${w}x${h} ${slug} ${r.id}: card scrolls inside itself (timer stays visible)`);
      }
    }
    const timers = results.filter((r) => r.timer).length;
    console.log(`${w}x${h} ${slug}: ${results.length} slides, ${timers} timer(s), ${results.filter((r) => r.fail.length).length} failing`);
    if (shots && w === 1280) {
      mkdirSync(shots, { recursive: true });
      for (const r of results.filter((x) => x.timer)) {
        await evaluate(`(async () => { Reveal.slide(${r.i}); await new Promise((r) => setTimeout(r, 400)); })()`);
        const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 70 });
        writeFileSync(join(shots, `${slug}-${r.id}.jpg`), Buffer.from(shot.result.data, 'base64'));
      }
    }
  }
}
ws.close();
chrome.kill();
server.close();
console.log(`deck-layout: ${checked} slide view(s), ${failures} failure(s)`);
process.exit(failures ? 1 : 0);
