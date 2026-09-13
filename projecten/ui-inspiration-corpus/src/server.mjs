import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {
  filterSources,
  readSources,
  summarizeSources,
  toPublicSource,
  validateSources
} from './lib.mjs';
import { readPulledManifest } from './pull.mjs';

const PUBLIC_DIR = fileURLToPath(new URL('../public', import.meta.url));
const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml'
};

function sendJson(response, status, body) {
  response.writeHead(status, {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8'
  });
  response.end(JSON.stringify(body));
}

function safeStaticPath(pathname) {
  const requested = pathname === '/' ? '/index.html' : pathname;
  const resolved = path.resolve(PUBLIC_DIR, `.${requested}`);
  if (resolved !== PUBLIC_DIR && !resolved.startsWith(`${PUBLIC_DIR}${path.sep}`)) return null;
  return resolved;
}

async function publicSource(source) {
  const result = toPublicSource(source);
  try {
    result.content_manifest = await readPulledManifest(source.id);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    result.content_manifest = null;
  }
  return result;
}

export async function startServer({ host = '127.0.0.1', port = 4173 } = {}) {
  const sources = await readSources();
  const errors = validateSources(sources);
  if (errors.length) throw new Error(`Corpus is invalid:\n${errors.join('\n')}`);

  const server = createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);

      if (request.method !== 'GET') {
        sendJson(response, 405, { error: 'Only GET is supported by the local read-only server.' });
        return;
      }

      if (requestUrl.pathname === '/api/summary') {
        sendJson(response, 200, summarizeSources(sources));
        return;
      }

      if (requestUrl.pathname === '/api/sources') {
        const filtered = filterSources(sources, {
          query: requestUrl.searchParams.get('q') || '',
          classification: requestUrl.searchParams.get('classification') || '',
          category: requestUrl.searchParams.get('category') || ''
        });
        sendJson(response, 200, {
          data: await Promise.all(filtered.map(publicSource)),
          total: filtered.length
        });
        return;
      }

      if (requestUrl.pathname.startsWith('/api/sources/')) {
        const id = decodeURIComponent(requestUrl.pathname.slice('/api/sources/'.length));
        const source = sources.find((candidate) => candidate.id === id);
        if (!source) {
          sendJson(response, 404, { error: `Source not found: ${id}` });
          return;
        }
        sendJson(response, 200, await publicSource(source));
        return;
      }

      const file = safeStaticPath(requestUrl.pathname);
      if (!file) {
        sendJson(response, 400, { error: 'Invalid path.' });
        return;
      }
      const contents = await readFile(file);
      response.writeHead(200, {
        'Cache-Control': 'no-store',
        'Content-Type': MIME_TYPES[path.extname(file)] || 'application/octet-stream'
      });
      response.end(contents);
    } catch (error) {
      if (error.code === 'ENOENT') {
        sendJson(response, 404, { error: 'Not found.' });
        return;
      }
      sendJson(response, 500, { error: error.message });
    }
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, resolve);
  });
  return server;
}
