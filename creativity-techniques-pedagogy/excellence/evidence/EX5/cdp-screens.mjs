// Minimal CDP driver: node cdp.mjs <url> <out-prefix> [--no-js] [--pdf] [--height=N]
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
const [url, out, ...flags] = process.argv.slice(2);
const noJs = flags.includes('--no-js'), pdf = flags.includes('--pdf');
const height = Number((flags.find((f) => f.startsWith('--height=')) || '--height=720').split('=')[1]);
const port = 9300 + Math.floor(Math.random() * 500);
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${process.env.TMPDIR || '/tmp'}/cdp-${port}`, '--hide-scrollbars', `--window-size=1280,${height}`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 50 && !target; i++) { await sleep(200); try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page'); } catch {} }
const ws = new WebSocket(target.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map();
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Page.enable'); await send('Runtime.enable');
if (noJs) await send('Emulation.setScriptExecutionDisabled', { value: true });
await send('Emulation.setDeviceMetricsOverride', { width: 1280, height, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url }); await sleep(6000);
if (!noJs) { const r = await send('Runtime.evaluate', { expression: "JSON.stringify({pages: document.querySelectorAll('.pdf-page').length, sections: document.querySelectorAll('.slides > section, .pdf-page > section').length, notes: document.querySelectorAll('.speaker-notes-pdf, .notes').length, ready: !!document.querySelector('.reveal.ready')})", returnByValue: true }); console.log(r.result.result.value); }
const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
writeFileSync(`${out}.png`, Buffer.from(shot.result.data, 'base64'));
if (pdf) { const p = await send('Page.printToPDF', { preferCSSPageSize: true, printBackground: true }); writeFileSync(`${out}.pdf`, Buffer.from(p.result.data, 'base64')); }
ws.close(); chrome.kill(); process.exit(0);
