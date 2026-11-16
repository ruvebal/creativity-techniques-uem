#!/usr/bin/env node
/** Build immutable, exercise-specific SVG diagrams and PNG derivatives. */

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const exerciseDir = join(root, 'exercises');
const assetDir = join(root, 'docs', 'assets', 'images', 'exercise-graphics');
const dataDir = join(root, 'docs', '_data');
const manifestPath = join(assetDir, 'index.json');
const dataPath = join(dataDir, 'exercise-graphics.yml');

const C = {
	paper: '#F7F2E8', ink: '#1E302C', mute: '#66736D', faint: '#D8D5CA',
	coral: '#C44536', coralWash: '#F0D8D0', teal: '#287668', tealWash: '#DCEBE4',
	white: '#FFFEFA', gold: '#B78336', goldWash: '#F1E6CE',
};

const xml = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({
	'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
}[c]));

function wrapped(value, limit = 22) {
	const words = String(value ?? '').split(/\s+/);
	const lines = [];
	let line = '';
	for (const word of words) {
		if (!line || `${line} ${word}`.length <= limit) line = line ? `${line} ${word}` : word;
		else { lines.push(line); line = word; }
	}
	if (line) lines.push(line);
	return lines.slice(0, 3);
}

function label(x, y, value, { size = 25, color = C.ink, weight = 500, anchor = 'middle', limit = 22 } = {}) {
	const lines = wrapped(value, limit);
	const firstY = y - ((lines.length - 1) * size * 0.62);
	return `<text x="${x}" y="${firstY}" text-anchor="${anchor}" fill="${color}" font-family="Arial, sans-serif" font-size="${size}" font-weight="${weight}">${lines.map((line, i) => `<tspan x="${x}" dy="${i ? size * 1.24 : 0}">${xml(line)}</tspan>`).join('')}</text>`;
}

const rect = (x, y, w, h, fill = C.white, stroke = C.faint, rx = 20) =>
	`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
const circle = (x, y, r, fill = C.tealWash, stroke = C.teal, sw = 2) =>
	`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const line = (x1, y1, x2, y2, color = C.mute, width = 3, dash = '') =>
	`<path d="M${x1} ${y1} L${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ''} marker-end="url(#arrow)"/>`;
const curve = (d, color = C.mute, width = 3, dash = '') =>
	`<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ''} marker-end="url(#arrow)"/>`;
const pill = (x, y, w, textValue, fill = C.tealWash, color = C.teal) =>
	`${rect(x, y, w, 52, fill, 'none', 26)}${label(x + w / 2, y + 34, textValue, { size: 22, color })}`;
const card = (x, y, w, h, title, subtitle = '', fill = C.white, accent = C.teal) =>
	`${rect(x, y, w, h, fill, C.faint)}<path d="M${x + 22} ${y + 16} v${h - 32}" stroke="${accent}" stroke-width="5" stroke-linecap="round"/>${label(x + 42, y + (subtitle ? 39 : h / 2 + 8), title, { anchor: 'start', size: 25 })}${subtitle ? label(x + 42, y + 74, subtitle, { anchor: 'start', size: 19, color: C.mute, weight: 400 }) : ''}`;

function base(inner, title) {
	return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="620" viewBox="0 0 1200 620" role="img" aria-labelledby="graphic-title"><title id="graphic-title">${xml(title)}</title><defs><marker id="arrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M1 1 L8 5 L1 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker></defs><rect x="12" y="12" width="1176" height="596" rx="30" fill="${C.paper}"/><path d="M56 104 H1144" stroke="${C.faint}" stroke-width="2"/>${label(58, 74, title, { anchor: 'start', size: 22, color: C.mute, weight: 400 })}${inner}</svg>`;
}

function draw(ex) {
	const g = ex.graphic;
	const L = g.labels || [];
	const at = (n, fallback) => L[n] || fallback;
	let s = '';
	switch (g.kind) {
		case 'fan': {
			s += `${circle(150, 352, 69, C.white, C.coral, 4)}${circle(150, 352, 31, C.coralWash, C.coral, 0)}${label(150, 358, 'Object', { size: 20, color: C.coral })}`;
			const ys = [185, 295, 405, 515];
			ys.forEach((y, i) => { s += curve(`M220 352 C330 352 320 ${y} 440 ${y}`, i === 3 ? C.coral : C.teal); s += circle(470, y, 14, i === 3 ? C.coralWash : C.tealWash, i === 3 ? C.coral : C.teal); s += label(510, y + 8, at(i + 1, ['Wear','Build','Play','Adapt'][i]), { anchor: 'start' }); });
			s += `${line(700, 352, 850, 352, C.coral, 4)}${rect(860, 282, 248, 140, C.white, C.coral, 28)}${label(984, 330, 'Many uses', { size: 30 })}${label(984, 376, 'Count ideas + kinds', { size: 20, color: C.mute, weight: 400 })}`;
			break;
		}
		case 'image-web': {
			s += `${rect(70, 226, 210, 190, C.white, C.coral, 24)}<circle cx="139" cy="300" r="31" fill="${C.coralWash}"/><circle cx="204" cy="340" r="47" fill="${C.tealWash}"/><path d="M111 390 Q170 330 244 382" fill="none" stroke="${C.gold}" stroke-width="10" stroke-linecap="round"/>${label(175, 456, at(0,'Picture'), { size: 22 })}`;
			const nodes = [[440,205],[460,350],[440,495]];
			nodes.forEach(([x,y],i) => { s += curve(`M280 320 C345 320 365 ${y} ${x-34} ${y}`, C.mute, 2.5); s += circle(x,y,37,i===1?C.coralWash:C.tealWash,i===1?C.coral:C.teal,2); s += label(x,y+6,at(1+i,'Association'),{size:17,color:i===1?C.coral:C.teal,limit:12}); });
			s += `${line(500,205,680,235,C.teal)}${line(500,350,680,350,C.coral)}${line(500,495,680,465,C.teal)}${card(700,172,300,110,at(4,'Route idea'),'',C.white,C.mute)}${card(700,295,300,110,at(5,'Sign idea'),'',C.coralWash,C.coral)}${card(700,418,300,110,at(6,'Waiting-zone idea'),'No ranking yet',C.white,C.teal)}`;
			break;
		}
		case 'diptych': {
			s += `${label(295,155,at(0,'One rule'),{size:22,color:C.coral})}${label(600,155,at(1,'Made under rule'),{size:22})}${label(900,155,at(2,'Freer pass'),{size:22})}`;
			s += `${rect(78,190,270,250,C.white,C.faint,22)}${rect(405,190,270,250,C.coralWash,C.coral,22)}${rect(732,190,270,250,C.white,C.faint,22)}`;
			for(let i=0;i<6;i++) s += `<path d="M${110+i*37} 228 v${150-(i%2)*45}" stroke="${i<3?C.teal:C.mute}" stroke-width="7" stroke-linecap="round"/>`;
			for(let i=0;i<4;i++) s += `<path d="M${445+i*48} ${245+(i%2)*28} l32 38 l-28 54 l34 43" fill="none" stroke="${i%2?C.coral:C.teal}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`;
			for(let i=0;i<5;i++) s += `<circle cx="${770+i*40}" cy="${255+(i%3)*44}" r="${10+(i%2)*6}" fill="${i%2?C.teal:C.coral}" opacity="0.8"/>`;
			s += `${label(540,484,'Rule shapes the first pass',{size:20,color:C.mute,weight:400})}${label(868,484,'Compare for fit + surprise',{size:20,color:C.mute,weight:400})}${line(680,320,720,320,C.coral,4)}${pill(415,530,370,at(3,'Compare'),C.goldWash,C.ink)}`;
			break;
		}
		case 'signal-board': {
			s += `${label(340,157,at(0,'Idea field'),{size:24})}`;
			const xs=[145,330,515], ys=[240,360,480];
			let i=0; for(const y of ys) for(const x of xs) { const color=i===4?C.coral:C.teal; s += `${rect(x,y,130,74,i===4?C.coralWash:C.white,i===4?C.coral:C.faint,14)}${circle(x+24,y+20,7,color,color,1)}${circle(x+48,y+20,7,C.gold,C.gold,1)}${circle(x+24,y+45,7,C.coral,C.coral,1)}${circle(x+53,y+45,7,C.teal,C.teal,1)}`; i++; }
			s += `${line(690,360,800,360,C.coral,4)}${circle(867,360,51,C.coralWash,C.coral,4)}${circle(867,360,12,C.coral,C.coral,0)}${label(867,451,at(1,'Hits'),{size:20,color:C.mute,weight:400})}${line(922,360,1000,360,C.coral,4)}${card(1000,300,145,120,at(2,'One vote'),'',C.white,C.coral)}${label(1075,465,at(3,'Reason'),{size:20,color:C.mute,weight:400})}`;
			break;
		}
		case 'boundary': {
			s += `${label(165,158,at(0,'Open draft'),{size:23})}`;
			for(let i=0;i<9;i++) s += circle(105+(i%3)*62,250+Math.floor(i/3)*62,14,i%2?C.tealWash:C.coralWash,i%2?C.teal:C.coral,1.5);
			s += `${line(330,340,430,340,C.coral,4)}${label(485,172,at(1,'Constraint'),{size:22,color:C.coral})}${rect(440,205,310,280,'none',C.coral,14)}`;
			for(let i=0;i<5;i++) s += `<path d="M${475+i*48} 258 v${135-(i%2)*40}" stroke="${i%2?C.teal:C.ink}" stroke-width="9" stroke-linecap="round"/>`;
			s += `${line(770,340,860,340,C.teal,4)}${circle(916,340,54,C.tealWash,C.teal,3)}${pathStar(916,340)}${label(1040,305,at(2,'New form'),{size:22})}${label(1040,355,at(3,'Brief test'),{size:20,color:C.mute,weight:400})}`;
			break;
		}
		case 'unlock': {
			s += `${card(74,292,210,104,at(0,'Dropped idea'),'',C.white,C.teal)}${line(294,344,410,344,C.mute,3)}${rect(420,244,250,200,C.coralWash,C.coral,26)}${circle(545,314,28,C.coral,C.coral,1)}${rect(522,336,46,43,C.coral,C.coral,8)}${label(545,420,at(1,'Lock belief'),{size:21,color:C.coral})}`;
			s += `${curve('M670 344 C735 344 735 205 808 205',C.teal,4)}${curve('M670 344 C735 344 735 482 808 482',C.mute,2.5,'8 10')}${card(820,150,300,110,at(2,'Five-minute reopen'),'',C.tealWash,C.teal)}${card(820,425,300,110,at(3,'Keep · change · shelve'),'',C.white,C.coral)}${label(760,335,'Try opposite rule',{size:18,color:C.teal,weight:400})}`;
			break;
		}
		case 'viewport': {
			s += `${rect(76,202,630,310,C.white,C.faint,12)}${label(116,246,at(0,'Broad brief'),{anchor:'start',size:23,color:C.mute})}${rect(287,278,260,176,'none',C.coral,6)}${circle(363,345,25,C.tealWash,C.teal,2)}${pathStar(474,365,C.coral)}${label(417,427,at(1,'One frame'),{size:20,color:C.coral})}`;
			s += `${curve('M550 278 L700 182',C.coral,2)}${curve('M547 454 L700 520',C.coral,2)}${card(738,148,360,116,'Visible moment',at(2,'What is visible?'),C.tealWash,C.teal)}${card(738,316,360,116,'Unknown',at(3,'Next question'),C.coralWash,C.coral)}${line(918,277,918,306,C.coral,3)}${line(918,445,918,480,C.teal,3)}`;
			break;
		}
		case 'trail': {
			const pts=[[105,380],[300,380],[495,380],[690,380],[885,380],[1080,380]];
			s += `<path d="M105 380 C230 380 250 380 300 380 C370 380 430 300 495 300 C575 300 605 460 690 460 C760 460 810 380 885 380 C960 380 1000 380 1080 380" fill="none" stroke="${C.mute}" stroke-width="4" stroke-linecap="round"/>`;
			pts.forEach(([x,y],i)=>{ const col=i===3?C.coral:C.teal; s += `${circle(x,y,i===3?21:14,i===3?C.coralWash:C.tealWash,col,i===3?4:2)}${label(x,y+77,['Sketch','Option','Revision','Turn','Choice','Now'][i],{size:19,color:i===3?C.coral:C.mute,weight:i===3?500:400})}`; });
			s += `${label(320,245,'Open options',{size:20,color:C.teal})}${label(790,245,'Close with a reason',{size:20,color:C.coral})}${line(495,267,495,283,C.coral,2)}${pill(395,515,390,'Turning point: judgment changes direction',C.coralWash,C.coral)}`;
			break;
		}
		case 'test-loop': {
			s += `${card(64,250,250,132,at(0,'Test question'),'',C.coralWash,C.coral)}${line(320,316,405,316,C.coral,4)}${rect(420,220,270,190,C.white,C.teal,16)}${rect(450,247,210,112,C.tealWash,'none',8)}${pathStar(555,300,C.teal)}${label(555,390,at(1,'Small prototype'),{size:21})}`;
			s += `${line(700,316,790,316,C.teal,4)}${card(800,250,230,132,at(2,'Peer tries'),'',C.white,C.teal)}${curve('M915 390 C915 525 236 548 190 405',C.coral,3,'10 8')}${label(580,530,at(3,'Answer → next move'),{size:21,color:C.coral})}`;
			break;
		}
		case 'association-branch': {
			s += `${card(60,287,215,110,at(0,'Brief'),'',C.white,C.mute)}${line(278,342,380,342,C.mute,3)}${circle(448,342,61,C.coralWash,C.coral,3)}${label(448,351,at(1,'Random word'),{size:20,color:C.coral,limit:15})}`;
			const ys=[208,342,476]; ys.forEach((y,i)=>{ s += `${curve(`M508 342 C590 342 590 ${y} 680 ${y}`,i===2?C.coral:C.teal)}${circle(710,y,12,i===2?C.coral:C.teal,i===2?C.coral:C.teal,1)}${label(748,y+7,at(i+2,['Link A','Link B','Link C'][i]),{anchor:'start',size:22,color:i===2?C.coral:C.ink})}`; });
			s += `${line(870,476,962,476,C.coral,4)}${card(972,424,180,104,at(5,'Design move'),'',C.coralWash,C.coral)}`;
			break;
		}
		case 'backtalk-loop': {
			s += `${card(70,285,225,118,at(0,'Make'),'',C.tealWash,C.teal)}${curve('M300 300 C380 205 438 205 495 258',C.teal,3)}${card(490,170,230,116,at(1,'Surprise'),'',C.coralWash,C.coral)}${curve('M720 235 C815 245 840 310 835 348',C.coral,3)}${card(740,354,300,116,at(2,'Changed move'),'',C.white,C.teal)}${curve('M740 425 C620 535 414 535 302 408',C.teal,3)}${label(560,520,at(3,'Make again'),{size:20,color:C.teal})}`;
			break;
		}
		case 'seedbed': {
			const seeds=[[112,230],[192,310],[120,405],[258,470],[220,205],[290,370]];
			seeds.forEach(([x,y],i)=>{s+=circle(x,y,13+i%3*4,i%2?C.goldWash:C.tealWash,i%2?C.gold:C.teal,1.5)});
			s += `${label(196,536,at(0,'Gather'),{size:19,color:C.mute,weight:400})}${line(332,350,420,350,C.teal,3)}${label(492,205,at(1,'No ranking'),{size:20,color:C.gold})}`;
			for(let i=0;i<3;i++){const x=465+i*88; s+=`${circle(x,350,24,C.tealWash,C.teal,2)}<path d="M${x} 378 v88 M${x} 414 q-23 -20 -32 -2 M${x} 432 q22 -20 32 -2" fill="none" stroke="${C.teal}" stroke-width="4" stroke-linecap="round"/>`;}
			s += `${label(552,510,at(2,'Develop three'),{size:20,color:C.teal})}${line(760,350,860,350,C.coral,3)}${circle(926,350,49,C.coralWash,C.coral,3)}${circle(926,350,16,C.coral,C.coral,0)}${rect(990,275,178,150,C.white,C.faint,20)}<path d="M1012 291 v118" stroke="${C.coral}" stroke-width="5" stroke-linecap="round"/>${label(1088,345,at(3,'Keep one + reason'),{size:20,limit:15})}`;
			break;
		}
		case 'journey-evidence': {
			s += `<path d="M100 345 C230 345 210 275 340 275 C440 275 420 420 555 420 C690 420 682 305 790 305" fill="none" stroke="${C.teal}" stroke-width="8" stroke-linecap="round"/>`;
			[[100,345,'Start'],[340,275,'Pause'],[555,420,'Turn'],[790,305,'Arrive']].forEach(([x,y,t],i)=>{ s+=`${circle(x,y,i===1||i===2?22:14,i===1||i===2?C.coralWash:C.tealWash,i===1||i===2?C.coral:C.teal,2)}${label(x,y+60,t,{size:18,color:i===1||i===2?C.coral:C.mute,weight:400})}`; });
			s += `${line(820,305,890,305,C.coral,3)}${card(895,180,245,110,at(1,'Observed moment'),'',C.coralWash,C.coral)}${card(895,322,245,110,at(2,'Prior idea'),'',C.white,C.teal)}${line(1018,435,1018,468,C.teal,3)}${pill(880,478,270,at(3,'Evidence + criterion'),C.tealWash,C.teal)}`;
			break;
		}
		case 'pages-drain': {
			[[90,190],[112,174],[134,158]].forEach(([x,y],i)=>{ s += rect(x,y,230,320,i===2?C.white:C.paper,C.faint,10); });
			for(let y=205;y<=440;y+=29) s += `<path d="M158 ${y} q15 -9 30 0 t30 0 t30 0 t30 0 t30 0 t30 0" fill="none" stroke="${C.ink}" stroke-width="2.5" stroke-linecap="round" opacity="0.72"/>`;
			s += `${label(250,528,at(0,'Three pages'),{size:22})}${label(250,566,at(2,'Keep the hand moving'),{size:19,color:C.teal,weight:400})}`;
			s += `${label(560,152,at(1,"Critic's comments"),{size:22,color:C.coral})}${rect(445,178,230,300,'none',C.coral,18)}`;
			[[490,226],[530,316],[488,406]].forEach(([x,y],i)=>{ s += curve(`M372 ${250+i*80} C410 ${250+i*80} 420 ${y} ${x-6} ${y}`,C.coral,2.5,'7 7'); s += `${rect(x,y-24,140,48,C.coralWash,'none',24)}<path d="M${x+22} ${y} q12 -10 24 0 t24 0 t24 0 t24 0" fill="none" stroke="${C.coral}" stroke-width="3" stroke-linecap="round"/>`; });
			s += `${label(560,510,'Written down, not obeyed',{size:18,color:C.mute,weight:400})}${line(700,330,830,330,C.teal,4)}${card(842,268,300,124,at(3,'Clear start'),'Next idea pass',C.tealWash,C.teal)}`;
			break;
		}
		case 'seismograph': {
			s += `${label(245,160,at(0,'Look at one edge'),{size:22})}${rect(80,188,330,300,C.coralWash,C.faint,140)}`;
			s += `<path d="M130 290 C190 250 260 300 330 262" fill="none" stroke="${C.mute}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><path d="M140 420 C210 380 280 440 360 400" fill="none" stroke="${C.mute}" stroke-width="3" stroke-linecap="round" opacity="0.55"/>`;
			s += `<path d="M120 352 C170 322 205 372 250 340 C290 312 320 368 372 338" fill="none" stroke="${C.teal}" stroke-width="7" stroke-linecap="round"/>`;
			s += `<path d="M600 140 V520" stroke="${C.coral}" stroke-width="4" stroke-dasharray="12 10"/>${label(600,560,at(2,'No looking'),{size:21,color:C.coral})}`;
			s += `${circle(600,330,34,C.white,C.coral,3)}<path d="M600 330 V308 M600 330 L617 340" stroke="${C.coral}" stroke-width="3" stroke-linecap="round"/>${rect(570,382,60,30,C.paper,'none',6)}${label(600,404,'5 min',{size:18,color:C.coral,weight:400})}`;
			s += curve('M380 330 C470 240 520 240 560 262',C.teal,3,'8 8');
			s += `${label(955,160,at(1,'Pencil records'),{size:22})}${rect(790,188,330,300,C.white,C.faint,10)}`;
			s += `<path d="M820 352 l18 -14 l14 10 l16 -22 l12 30 l18 -26 l14 18 l16 -8 l18 20 l14 -30 l18 22 l16 -12 l20 16 l14 -20 l18 14 l16 -6 l20 10" fill="none" stroke="${C.teal}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`;
			s += curve('M640 262 C690 240 730 270 780 320',C.teal,3,'8 8')+pill(830,510,250,at(3,'Record of seeing'),C.tealWash,C.teal);
			break;
		}
		case 'three-drafts': {
			const xs=[70,445,820];
			xs.forEach((x,i)=>{ s += `${label(x+155,160,at(i,['Down draft','Up draft','Dental draft'][i]),{size:24,color:i===0?C.coral:C.ink})}${rect(x,190,310,290,i===0?C.coralWash:C.white,i===0?C.coral:C.faint,16)}${label(x+155,520,at(i+3,['Get it down','Fix it up','Check every tooth'][i]),{size:19,color:C.mute,weight:400})}`; });
			const scrib=['M100 240 C150 210 190 290 250 250 S330 220 350 270','M95 300 C160 340 200 270 260 320 S320 350 345 300','M110 370 C140 330 210 420 260 380 S330 360 340 420','M100 440 C170 410 230 460 300 430'];
			scrib.forEach(d=>{ s += `<path d="${d}" fill="none" stroke="${C.coral}" stroke-width="3" stroke-linecap="round" opacity="0.8"/>`; });
			s += pathStar(300,384,C.gold);
			for(let i=0;i<6;i++){ const y=235+i*38; s += `<path d="M480 ${y} H${700-(i%3)*45}" stroke="${C.ink}" stroke-width="6" stroke-linecap="round" opacity="${i===2?0.95:0.55}"/>`; s += `<path d="M855 ${y} H${1035-(i%3)*45}" stroke="${C.ink}" stroke-width="6" stroke-linecap="round" opacity="0.55"/>`; const mark=i===1?C.coral:C.teal; s += i===4?`<path d="M1080 ${y-9} l14 14 M1094 ${y-9} l-14 14" stroke="${C.coral}" stroke-width="4" stroke-linecap="round"/>`:`<path d="M1078 ${y} l7 8 l14 -16" fill="none" stroke="${mark}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`; }
			s += `${curve('M318 384 C380 384 400 320 470 316',C.gold,3,'8 8')}${line(762,335,808,335,C.teal,4)}`;
			break;
		}
		case 'four-rules': {
			s += `${circle(330,350,74,C.coralWash,C.coral,4)}${circle(330,350,40,C.white,C.coral,3)}${circle(330,350,12,C.coral,C.coral,0)}${label(330,456,at(0,'Specific problem'),{size:19,color:C.coral})}`;
			s += `${pill(60,170,230,at(1,'No criticism'))}${pill(370,170,230,at(2,'Wild welcome'))}${pill(60,500,230,at(3,'Quantity'))}${pill(370,500,250,at(4,'Combine + improve'))}`;
			s += `${line(410,350,520,350,C.teal,4)}`;
			for(let r=0;r<4;r++) for(let c=0;c<4;c++){ const x=540+c*58, y=245+r*58; s += rect(x,y,44,40,(r+c)%3===0?C.goldWash:C.tealWash,'none',6); }
			s += `${label(655,500,'Ideas pile up',{size:19,color:C.mute,weight:400})}${line(785,350,870,350,C.mute,3,'8 8')}`;
			s += `<path d="M890 230 V470 M930 230 V470" stroke="${C.coral}" stroke-width="8" stroke-linecap="round"/><path d="M890 350 H930" stroke="${C.coral}" stroke-width="5"/>${label(910,206,at(5,'Judge later'),{size:21,color:C.coral})}`;
			s += `${line(950,350,1010,350,C.coral,3)}${rect(1020,300,120,100,C.white,C.coral,16)}${pathStar(1080,350,C.coral)}${label(1080,440,'After the count',{size:17,color:C.mute,weight:400})}`;
			break;
		}
		case 'question-wheel': {
			const cx=380, cy=352, R=196;
			const qs=['Other uses','Adapt','Modify','Magnify','Minify','Substitute','Rearrange','Reverse','Combine'];
			qs.forEach((q,i)=>{ const a=-Math.PI/2+i*2*Math.PI/9; const x=cx+R*Math.cos(a), y=cy+R*Math.sin(a)*0.95; const hot=i===2||i===3; s += `<path d="M${cx+66*Math.cos(a)} ${cy+66*Math.sin(a)} L${x-16*Math.cos(a)} ${y-16*Math.sin(a)}" stroke="${hot?C.coral:C.teal}" stroke-width="${hot?3.5:2.5}" stroke-linecap="round"/>${circle(x,y,15,hot?C.coralWash:C.tealWash,hot?C.coral:C.teal,2)}`; const right=Math.cos(a)>0.15, left=Math.cos(a)<-0.15; s += label(right?x+24:left?x-24:x, Math.abs(Math.cos(a))<=0.15?y-26:y+7, at(i+1,q), {size:18,anchor:right?'start':left?'end':'middle',color:hot?C.coral:C.ink,limit:12}); });
			s += `${circle(cx,cy,62,C.white,C.ink,3)}${label(cx,cy+8,at(0,'Existing thing'),{size:19,limit:10})}`;
			s += `${line(690,320,800,300,C.coral,3)}${rect(812,232,150,120,C.white,C.coral,16)}${pathStar(887,292,C.coral)}${rect(982,232,150,120,C.white,C.coral,16)}${pathStar(1057,292,C.coral)}${label(972,402,at(10,'Two starred'),{size:21,color:C.coral})}${label(972,440,'Changes how it works',{size:18,color:C.mute,weight:400})}`;
			break;
		}
		case 'parallel-lanes': {
			const ty=280;
			[[80,ty-70],[80,ty-10],[80,ty+50]].forEach(([x,y])=>{ s += rect(x,y,110,46,C.tealWash,C.teal,8); });
			s += `${label(135,158,at(0,'Three at once'),{size:20,color:C.teal})}${line(200,ty,280,ty,C.teal,3)}${circle(320,ty,30,C.goldWash,C.gold,3)}${label(320,ty+62,at(1,'Feedback'),{size:17,color:C.gold,weight:400})}${line(356,ty,430,ty,C.teal,3)}`;
			[[440,ty-40],[440,ty+20]].forEach(([x,y])=>{ s += rect(x,y,110,46,C.tealWash,C.teal,8); });
			s += `${label(495,190,at(2,'Two more'),{size:20,color:C.teal})}${line(560,ty,640,ty,C.teal,3)}${circle(680,ty,30,C.goldWash,C.gold,3)}${label(680,ty+62,at(3,'Feedback'),{size:17,color:C.gold,weight:400})}${line(716,ty,800,ty,C.coral,4)}${rect(812,ty-60,170,120,C.coralWash,C.coral,16)}${pathStar(897,ty,C.coral)}${label(897,190,at(4,'Final'),{size:22,color:C.coral})}`;
			s += curve(`M135 ${ty+100} C300 ${ty+130} 700 ${ty+130} 860 ${ty+66}`,C.coral,2,'6 8');
			s += `<path d="M56 432 H1144" stroke="${C.faint}" stroke-width="2"/>`;
			const by=510; for(let i=0;i<5;i++){ const x=80+i*150; s += `${rect(x,by-22,90,44,C.white,C.faint,8)}${i<4?`${circle(x+120,by,8,C.faint,C.mute,1.5)}`:''}`; }
			s += `${line(822,by,880,by,C.mute,2.5,'6 6')}${rect(890,by-30,110,60,C.white,C.mute,12)}${label(1072,by-6,at(5,'One at a time'),{size:18,color:C.mute,weight:400,limit:14})}${label(1072,by+22,'for comparison',{size:16,color:C.mute,weight:400})}`;
			break;
		}
		case 'rule-negation': {
			s += `${label(190,158,at(0,'Style rules'),{size:22})}${rect(70,182,240,330,C.white,C.faint,16)}`;
			for(let i=0;i<6;i++){ const y=222+i*48; s += `${circle(100,y,6,C.mute,C.mute,0)}<path d="M118 ${y} H${280-(i%2)*40}" stroke="${C.ink}" stroke-width="6" stroke-linecap="round" opacity="0.55"/>`; }
			s += `<ellipse cx="190" cy="366" rx="128" ry="26" fill="none" stroke="${C.coral}" stroke-width="4"/>${label(190,548,at(1,'Structural rule'),{size:19,color:C.coral})}`;
			s += `${curve('M320 366 C430 366 440 250 560 250',C.teal,4)}${label(440,236,at(2,'Negate'),{size:21,color:C.teal})}${curve('M320 366 C430 366 440 470 560 470',C.mute,3,'9 9')}${label(440,520,at(3,'Drop'),{size:21,color:C.mute})}`;
			s += rect(575,165,330,170,C.tealWash,C.teal,18);
			for(let r=0;r<3;r++) for(let c=0;c<6;c++){ const x=606+c*50+(r%2)*26, y=205+r*45; s += `<path d="M${x} ${y-14} L${x+14} ${y+10} L${x-14} ${y+10} Z" fill="${(r+c)%4===0?C.coral:C.teal}" opacity="0.8"/>`; }
			s += rect(575,395,330,150,'none',C.faint,18);
			[[620,430],[700,500],[790,445],[860,515],[650,515],[835,420],[740,450]].forEach(([x,y])=>{ s += circle(x,y,7,C.faint,C.mute,1); });
			s += `${line(915,250,975,250,C.teal,4)}${card(985,195,180,110,at(4,'New space'),'',C.white,C.teal)}${label(1083,470,'Open field,',{size:18,color:C.mute,weight:400})}${label(1083,498,'fewer cues',{size:18,color:C.mute,weight:400})}`;
			break;
		}
		case 'yes-and-chain': {
			const pts=[[110,420,24],[290,370,30],[470,320,36],[650,270,42],[880,220,58]];
			pts.forEach(([x,y,r],i)=>{ if(i) s += line(pts[i-1][0]+pts[i-1][2]+4,pts[i-1][1]-((pts[i-1][1]-y)*0.3),x-r-6,y+((pts[i-1][1]-y)*0.2),C.teal,3); s += circle(x,y,r,i===4?C.tealWash:C.white,C.teal,i===4?4:2.5); });
			s += `${label(110,380,at(0,'Opening offer'),{size:18})}${label(290,430,at(1,'Yes and'),{size:18,color:C.teal})}${label(470,386,at(2,'Yes and'),{size:18,color:C.teal})}${label(650,342,at(3,'Yes and'),{size:18,color:C.teal})}${label(880,310,at(4,'Grown idea'),{size:22,color:C.teal})}`;
			s += pathStar(880,220,C.teal);
			s += `${curve('M128 440 C200 520 260 530 330 530',C.coral,3,'8 8')}${circle(350,530,18,C.coralWash,C.coral,2)}${line(372,530,450,530,C.coral,3,'8 8')}${circle(470,530,14,C.coralWash,C.coral,2)}<path d="M500 508 V552" stroke="${C.coral}" stroke-width="7" stroke-linecap="round"/>`;
			s += `${label(410,580,at(5,'Yes but'),{size:18,color:C.coral})}${label(575,537,at(6,'Stalled'),{size:20,color:C.coral,anchor:'start'})}`;
			break;
		}
		default: throw new Error(`Unsupported graphic kind for ${ex.id}: ${g.kind}`);
	}
	return base(s, ex.title);
}

function pathStar(cx, cy, color = C.coral) {
	return `<path d="M${cx-18} ${cy} Q${cx} ${cy-37} ${cx+18} ${cy} Q${cx} ${cy+37} ${cx-18} ${cy}Z" fill="${color}" opacity="0.86"/>`;
}

function readExercises() {
	return readdirSync(exerciseDir, { withFileTypes: true });
}

async function main() {
	const inputs = readExercises().filter((entry) => entry.isFile() && entry.name.endsWith('.yml') && entry.name !== 'index.yml');
	const oldManifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : { schema: 'exercise-graphics/v1', releases: [] };
	const records = {};
	const releases = [...oldManifest.releases];
	mkdirSync(assetDir, { recursive: true });
	mkdirSync(dataDir, { recursive: true });

	for (const entry of inputs) {
		const ex = yaml.load(readFileSync(join(exerciseDir, entry.name), 'utf8'));
		if (!ex?.id) continue;
		if (!ex.graphic?.kind || !ex.graphic?.alt || !ex.graphic?.caption) {
			throw new Error(`Missing graphic kind, alt, or caption: ${entry.name}`);
		}
		const svg = draw(ex);
		const hash = createHash('sha256').update(svg).digest('hex').slice(0, 16);
		const baseName = `${ex.id}-${hash}`;
		const svgName = `${baseName}.svg`;
		const pngName = `${baseName}.png`;
		const svgPath = join(assetDir, svgName);
		const pngPath = join(assetDir, pngName);
		if (existsSync(svgPath) && readFileSync(svgPath, 'utf8') !== svg) {
			throw new Error(`Content-addressed SVG collision: ${svgName}`);
		}
		if (!existsSync(svgPath)) writeFileSync(svgPath, svg, 'utf8');
		if (!existsSync(pngPath)) await sharp(Buffer.from(svg)).png().toFile(pngPath);
		const svgUrl = `/assets/images/exercise-graphics/${svgName}`;
		const pngUrl = `/assets/images/exercise-graphics/${pngName}`;
		records[ex.id] = { svg: svgUrl, png: pngUrl, alt: ex.graphic.alt, caption: ex.graphic.caption };
		if (!releases.some((r) => r.id === ex.id && r.sha256 === hash)) {
			releases.push({ id: ex.id, sha256: hash, svg: svgUrl, png: pngUrl });
		}
	}

	writeFileSync(manifestPath, `${JSON.stringify({ schema: 'exercise-graphics/v1', current: records, releases }, null, 2)}\n`);
	writeFileSync(dataPath, yaml.dump({ schema: 'exercise-graphics/v1', exercises: records }, { lineWidth: 120, noRefs: true }));
	console.log(`generate-exercise-graphics: ${Object.keys(records).length} SVG + PNG pairs`);
}

await main();
