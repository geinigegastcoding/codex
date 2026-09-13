import test from 'node:test';
import assert from 'node:assert/strict';
import { startServer } from '../src/server.mjs';

test('local server exposes the website and read-only corpus API', async () => {
  const server = await startServer({ port: 0 });
  const port = server.address().port;
  try {
    const page = await fetch(`http://127.0.0.1:${port}/`);
    assert.equal(page.status, 200);
    assert.match(await page.text(), /UI Sourcebook/);

    const api = await fetch(`http://127.0.0.1:${port}/api/sources?classification=A`);
    assert.equal(api.status, 200);
    const body = await api.json();
    assert.ok(body.total > 0);
    assert.ok(body.data.every((source) => source.classification === 'A'));
    const shadcn = body.data.find((source) => source.id === 'shadcn-ui');
    assert.ok(shadcn.content_manifest.files.some((file) => file.path === 'README.md'));

    const blocked = await fetch(`http://127.0.0.1:${port}/api/sources/shadcn-ui`, { method: 'POST' });
    assert.equal(blocked.status, 405);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
