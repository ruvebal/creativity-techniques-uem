import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import test from 'node:test';
import yaml from 'js-yaml';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

test('hydrate-exercises emits public pages without ahmes keys in _data', () => {
	execFileSync(process.execPath, [join(root, 'scripts/hydrate-exercises.mjs')], {
		cwd: root,
		stdio: 'pipe',
	});
	const data = yaml.load(readFileSync(join(root, 'docs/_data/exercises.yml'), 'utf8'));
	assert.ok(Array.isArray(data.exercises));
	assert.ok(data.exercises.length >= 2);
	for (const ex of data.exercises) {
		assert.equal(ex.ahmes, undefined);
		assert.ok(ex.id);
		assert.ok(ex.graphic?.svg);
		assert.ok(ex.graphic?.png);
		assert.ok(ex.graphic?.alt);
		assert.ok(ex.graphic?.caption);
		assert.ok(existsSync(join(root, 'docs/exercises/en', ex.id, 'index.html')));
	}
	const dogme = readFileSync(
		join(root, 'docs/exercises/en/follow-dogme-95-rules/index.html'),
		'utf8',
	);
	assert.match(dogme, /\{% comment %\}/);
	assert.match(dogme, /document_coat: 574691eb/);
	assert.match(dogme, /\[…\]|\[\.\.\.\]/);
	assert.match(dogme, /<figure class="exercise-graphic"/);
	assert.doesNotMatch(dogme.replace(/\{% comment %\}[\s\S]*?\{% endcomment %\}/g, ''), /574691eb/);
});
