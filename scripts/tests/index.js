// Entry point so `node --test scripts/tests/` works on Node 22: the test runner
// treats a directory argument as a module path, which resolves to this file.
// Every *.test.mjs file in this directory is loaded here.
const { readdirSync } = require('node:fs');
const { join } = require('node:path');
const { pathToFileURL } = require('node:url');

for (const name of readdirSync(__dirname).filter((n) => n.endsWith('.test.mjs')).sort()) {
  import(pathToFileURL(join(__dirname, name)).href);
}
