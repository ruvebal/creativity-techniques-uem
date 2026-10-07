// PHASE-EX6, amendment A2/F2: the probe's `uncited_references` reads the
// references.yml mechanism (front-matter `references:` keys) and reports a
// listed key that the lesson never cites.
//
// Run: node --test creativity-techniques-pedagogy/excellence/tests/probe-references.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const PROBE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'probe', 'excellence-probe.mjs');

function fixture(lessons) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ex6-probe-'));
  fs.writeFileSync(path.join(root, '_config.yml'), 'title: fixture\n');
  fs.mkdirSync(path.join(root, '_site'), { recursive: true });
  fs.mkdirSync(path.join(root, 'docs', '_data'), { recursive: true });
  fs.writeFileSync(path.join(root, 'docs', '_data', 'references.yml'), 'real-2000:\n  chicago: Real. 2000.\nghost-1999:\n  chicago: Ghost. 1999.\n');
  for (const [rel, text] of Object.entries(lessons)) {
    const file = path.join(root, 'docs', 'lessons', 'en', rel, 'index.md');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, text);
  }
  return root;
}

function probe(root) {
  const out = execFileSync('node', [PROBE, '--root', root, '--site', path.join(root, '_site'), '--commit', 'fixture'], { encoding: 'utf8' });
  return JSON.parse(out).uncited_references;
}

test('a key listed in front matter but never cited is reported', () => {
  const root = fixture({
    'creativity-techniques/u-1-x': '---\ntitle: x\nreferences: [real-2000, ghost-1999]\n---\nText [(Real 2000, 1)](#ref-real-2000).\n\n## References\n\n{% include references.html %}\n',
  });
  assert.deepEqual(probe(root)['u-1-x'], ['ref-ghost-1999']);
});

test('block-list front matter and master lectures are read; fully cited lesson reports nothing', () => {
  const root = fixture({
    'creativity-techniques/u-2-y': '---\ntitle: y\nreferences:\n  - real-2000\n---\nSee [(Real 2000, 2)](#ref-real-2000).\n',
    'master-lectures/ml-z': '---\ntitle: z\nreferences: [ghost-1999]\n---\nNo citation here.\n',
  });
  const r = probe(root);
  assert.deepEqual(r['u-2-y'], []);
  assert.deepEqual(r['ml-z'], ['ref-ghost-1999']);
});

test('a citation that only appears after the References heading does not count', () => {
  const root = fixture({
    'creativity-techniques/u-3-w': '---\nreferences: [real-2000]\n---\nBody.\n\n## References\n\n[x](#ref-real-2000)\n',
  });
  assert.deepEqual(probe(root)['u-3-w'], ['ref-real-2000']);
});

test('legacy hand-written spans still count as listed', () => {
  const root = fixture({
    'creativity-techniques/u-4-v': '---\ntitle: v\n---\nBody.\n\n## References\n\n- <span id="ref-ghost-1999">Ghost.</span>\n',
  });
  assert.deepEqual(probe(root)['u-4-v'], ['ref-ghost-1999']);
});
