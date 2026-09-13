import test from 'node:test';
import assert from 'node:assert/strict';
import { filterSources, readSources, summarizeSources, validateSources } from '../src/lib.mjs';
import { canPullSource, pullSource, readPulledFile, readPulledManifest } from '../src/pull.mjs';

test('the checked-in corpus validates and preserves all reuse classes', async () => {
  const sources = await readSources();
  assert.equal(validateSources(sources).length, 0);
  const summary = summarizeSources(sources);
  assert.ok(summary.byClassification.A > 0);
  assert.ok(summary.byClassification.B > 0);
  assert.ok(summary.byClassification.C > 0);
  assert.ok(summary.byClassification.D > 0);
});

test('search finds license boundaries, not only source names', async () => {
  const sources = await readSources();
  const matches = filterSources(sources, { query: 'scrap' });
  assert.ok(matches.some((source) => source.id === 'mobbin-reference'));
  assert.ok(matches.some((source) => source.id === 'shadcn-ui'));
});

test('category and classification filters compose for the website API', async () => {
  const sources = await readSources();
  const matches = filterSources(sources, { classification: 'A', category: 'tokens' });
  assert.ok(matches.length > 0);
  assert.ok(matches.every((source) => source.classification === 'A' && source.categories.includes('tokens')));
});

test('content pulling stays inside the approved repository boundary', async () => {
  const sources = await readSources();
  const shadcn = sources.find((source) => source.id === 'shadcn-ui');
  const mobbin = sources.find((source) => source.id === 'mobbin-reference');
  assert.equal(canPullSource(shadcn), true);
  assert.equal(canPullSource(mobbin), false);
  await assert.rejects(() => pullSource(mobbin), /Pull blocked/);
});

test('pulled content can be read back through its manifest', async () => {
  const manifest = await readPulledManifest('shadcn-ui');
  assert.equal(manifest.mode, 'github_raw');
  assert.equal(manifest.license_url, 'https://github.com/shadcn-ui/ui/blob/main/LICENSE.md');
  assert.ok(manifest.files.some((file) => file.path === 'README.md'));
  assert.match(await readPulledFile('shadcn-ui', 'README.md'), /shadcn/i);
  await assert.rejects(() => readPulledFile('shadcn-ui', '../package.json'), /Unsafe content path/);
});
