#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  DATA_FILE,
  filterSources,
  readSources,
  relativeProjectPath,
  summarizeSources,
  validateSources,
  writeSources
} from '../src/lib.mjs';
import { pullSource, readPulledFile, readPulledManifest } from '../src/pull.mjs';
import { startServer } from '../src/server.mjs';

const args = process.argv.slice(2);
const command = args[0] || 'help';

function hasFlag(flag) {
  return args.includes(flag);
}

function flagValue(flag, fallback = '') {
  const index = args.indexOf(flag);
  return index === -1 ? fallback : args[index + 1] || fallback;
}

function flagValues(flag) {
  const values = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === flag && args[index + 1]) values.push(args[index + 1]);
  }
  return values;
}

function positionalArgs() {
  const flagsWithValues = new Set(['--class', '--category', '--file', '--port']);
  const values = [];
  for (let index = 1; index < args.length; index += 1) {
    const item = args[index];
    if (item.startsWith('--')) {
      if (flagsWithValues.has(item)) index += 1;
      continue;
    }
    values.push(item);
  }
  return values;
}

function printHelp() {
  console.log(`UI Inspiration Corpus\n\nCommands:\n  list [--class A|B|C|D] [--category NAME] [--json]\n  search <term> [--json]\n  show <id> [--json]\n  add --file <record.json>\n  pull <id> [--file PATH]...\n  content <id> [--file PATH] [--json]\n  validate\n  serve [--port 4173]\n\nData: ${relativeProjectPath(DATA_FILE)}`);
}

function printRecords(records, json) {
  if (json) {
    console.log(JSON.stringify(records, null, 2));
    return;
  }
  for (const source of records) {
    console.log(`${source.classification}  ${source.id}  ${source.name}`);
    console.log(`   ${source.license} · ${source.categories.join(', ')}`);
    console.log(`   ${source.url}`);
  }
  console.log(`\n${records.length} record${records.length === 1 ? '' : 's'}.`);
}

async function loadValidSources() {
  const sources = await readSources();
  const errors = validateSources(sources);
  if (errors.length) throw new Error(`Corpus is invalid:\n${errors.join('\n')}`);
  return sources;
}

async function run() {
  if (command === 'help' || command === '--help' || command === '-h') {
    printHelp();
    return;
  }

  if (command === 'validate') {
    const sources = await readSources();
    const errors = validateSources(sources);
    if (errors.length) {
      console.error(errors.join('\n'));
      process.exitCode = 1;
      return;
    }
    console.log(`Valid: ${sources.length} source records.`);
    return;
  }

  if (command === 'list') {
    const sources = await loadValidSources();
    printRecords(
      filterSources(sources, {
        classification: flagValue('--class'),
        category: flagValue('--category')
      }),
      hasFlag('--json')
    );
    return;
  }

  if (command === 'search') {
    const query = positionalArgs().join(' ').trim();
    if (!query) throw new Error('Usage: ui-corpus search <term> [--json]');
    const sources = await loadValidSources();
    printRecords(filterSources(sources, { query }), hasFlag('--json'));
    return;
  }

  if (command === 'show') {
    const id = positionalArgs()[0];
    if (!id) throw new Error('Usage: ui-corpus show <id> [--json]');
    const source = (await loadValidSources()).find((candidate) => candidate.id === id);
    if (!source) throw new Error(`Source not found: ${id}`);
    console.log(hasFlag('--json') ? JSON.stringify(source, null, 2) : `${source.name}\n\n${source.description}\n\n${source.url}`);
    return;
  }

  if (command === 'add') {
    const file = flagValue('--file');
    if (!file) throw new Error('Usage: ui-corpus add --file <record.json>');
    const incoming = JSON.parse(await readFile(path.resolve(file), 'utf8'));
    const records = Array.isArray(incoming) ? incoming : [incoming];
    const current = await readSources();
    const merged = [...current, ...records];
    const errors = validateSources(merged);
    if (errors.length) throw new Error(`Refusing to write invalid records:\n${errors.join('\n')}`);
    await writeSources(merged);
    console.log(`Added ${records.length} record${records.length === 1 ? '' : 's'}.`);
    return;
  }

  if (command === 'pull') {
    const id = positionalArgs()[0];
    if (!id) throw new Error('Usage: ui-corpus pull <id> [--file PATH]...');
    const source = (await loadValidSources()).find((candidate) => candidate.id === id);
    if (!source) throw new Error(`Source not found: ${id}`);
    const result = await pullSource(source, { files: flagValues('--file') });
    console.log(`Pulled ${result.manifest.files.length} file${result.manifest.files.length === 1 ? '' : 's'} for ${source.name}.`);
    console.log(`Saved to ${result.targetDir}`);
    for (const file of result.manifest.files) console.log(`  ${file.path} · ${file.bytes} bytes · sha256:${file.sha256}`);
    return;
  }

  if (command === 'content') {
    const id = positionalArgs()[0];
    if (!id) throw new Error('Usage: ui-corpus content <id> [--file PATH] [--json]');
    const manifest = await readPulledManifest(id);
    const file = flagValue('--file');
    if (!file) {
      console.log(hasFlag('--json') ? JSON.stringify(manifest, null, 2) : manifest.files.map((item) => `${item.path} · ${item.bytes} bytes · sha256:${item.sha256}`).join('\n'));
      return;
    }
    const content = await readPulledFile(id, file);
    console.log(hasFlag('--json') ? JSON.stringify({ source_id: id, path: file, content }, null, 2) : content);
    return;
  }

  if (command === 'serve') {
    const port = Number(flagValue('--port', '4173'));
    if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('Port must be an integer from 0 to 65535.');
    const server = await startServer({ port });
    const address = server.address();
    const url = `http://127.0.0.1:${typeof address === 'object' ? address.port : port}`;
    console.log(`UI corpus running at ${url}`);
    console.log('Press Ctrl+C to stop.');
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

run().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
