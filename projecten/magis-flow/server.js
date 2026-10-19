import http from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { randomUUID } from 'node:crypto';
import { validateWorkflow } from './public/model.js';

const root = dirname(fileURLToPath(import.meta.url));
const assets = { '/': ['index.html', 'text/html; charset=utf-8'], '/app.js': ['app.js', 'text/javascript; charset=utf-8'], '/model.js': ['model.js', 'text/javascript; charset=utf-8'], '/style.css': ['style.css', 'text/css; charset=utf-8'], '/favicon.svg': ['favicon.svg', 'image/svg+xml'] };

export function createApp({ databasePath = join(root, 'data', 'flow.sqlite') } = {}) {
  if (databasePath !== ':memory:') mkdirSync(dirname(databasePath), { recursive: true });
  const db = new DatabaseSync(databasePath);
  db.exec('PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000; CREATE TABLE IF NOT EXISTS workflows (id TEXT PRIMARY KEY, body TEXT NOT NULL, revision INTEGER NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)');
  const decode = (row) => ({ ...JSON.parse(row.body), id: row.id, revision: row.revision, createdAt: row.created_at, updatedAt: row.updated_at });
  const fail = (status, message) => Object.assign(new Error(message), { status });
  const server = http.createServer(async (req, res) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Cache-Control', 'no-store');
    const send = (status, value) => { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(value)); };
    try {
      const port = server.address().port;
      // Local-only by design: do not expose this server publicly without adding real authentication.
      if (![`127.0.0.1:${port}`, `localhost:${port}`].includes(req.headers.host)) throw fail(403, 'Deze app is alleen lokaal bereikbaar.');
      if (req.headers['sec-fetch-site'] === 'cross-site' || (req.headers.origin && req.headers.origin !== `http://${req.headers.host}`)) throw fail(403, 'Verzoek vanaf een andere website geweigerd.');
      const url = new URL(req.url, `http://${req.headers.host}`);
      const route = url.pathname;
      if (req.method === 'GET' && assets[route]) {
        const [file, mime] = assets[route];
        const body = readFileSync(join(root, 'public', file));
        res.writeHead(200, { 'Content-Type': mime }); res.end(body); return;
      }
      if (req.method === 'GET' && route === '/api/workflows') { send(200, db.prepare('SELECT * FROM workflows ORDER BY updated_at DESC, id').all().map(decode)); return; }
      const match = route.match(/^\/api\/workflows\/([a-f0-9-]{36})$/);
      if (req.method === 'GET' && match) {
        const row = db.prepare('SELECT * FROM workflows WHERE id = ?').get(match[1]);
        if (!row) throw fail(404, 'Dit proces bestaat niet meer.');
        send(200, decode(row)); return;
      }
      if ((route === '/api/workflows' && req.method === 'POST') || (match && ['PUT', 'DELETE'].includes(req.method))) {
        if (req.headers['content-type']?.split(';')[0] !== 'application/json') throw fail(415, 'Verstuur JSON met Content-Type application/json.');
        if (Number(req.headers['content-length']) > 200000) throw fail(413, 'Bestand te groot. Maximaal 200 kB.');
        let size = 0; const chunks = [];
        for await (const chunk of req) { size += chunk.length; if (size > 200000) throw fail(413, 'Bestand te groot. Maximaal 200 kB.'); chunks.push(chunk); }
        let input;
        try { input = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { throw fail(400, 'Ongeldige JSON.'); }
        if (!input || typeof input !== 'object') throw fail(400, 'Ongeldig verzoek.');
        if (req.method === 'DELETE') {
          if (!Number.isInteger(input.revision)) throw fail(400, 'De opgeslagen versie ontbreekt.');
          const result = db.prepare('DELETE FROM workflows WHERE id = ? AND revision = ?').run(match[1], input.revision);
          if (!result.changes) throw fail(409, 'Dit proces is gewijzigd of verwijderd in een ander venster. Herlaad de pagina.');
          send(200, { deleted: true }); return;
        }
        let workflow;
        try { workflow = validateWorkflow(input); } catch (error) { throw fail(400, error.message); }
        const timestamp = new Date().toISOString();
        let id = match?.[1];
        if (req.method === 'POST') {
          id = randomUUID();
          db.prepare('INSERT INTO workflows VALUES (?, ?, 1, ?, ?)').run(id, JSON.stringify(workflow), timestamp, timestamp);
        } else {
          if (!Number.isInteger(input.revision)) throw fail(400, 'De opgeslagen versie ontbreekt.');
          const result = db.prepare('UPDATE workflows SET body = ?, revision = revision + 1, updated_at = ? WHERE id = ? AND revision = ?').run(JSON.stringify(workflow), timestamp, id, input.revision);
          if (!result.changes) throw fail(409, 'Er is een nieuwere versie in een ander venster. Exporteer je wijzigingen en herlaad om gegevensverlies te voorkomen.');
        }
        send(req.method === 'POST' ? 201 : 200, decode(db.prepare('SELECT * FROM workflows WHERE id = ?').get(id))); return;
      }
      throw fail(404, 'Niet gevonden.');
    } catch (error) {
      if (!error.status) console.error(error);
      if (!res.headersSent) send(error.status || 500, error.status ? { error: error.message } : { error: 'Opslaan of laden is mislukt. Je invoer blijft in beeld; probeer opnieuw.' });
    }
  });
  server.requestTimeout = 15000;
  server.headersTimeout = 10000;
  server.on('close', () => db.close());
  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const port = Number(process.env.PORT || 4318);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT moet tussen 1 en 65535 liggen.');
  const server = createApp();
  server.on('error', (error) => { console.error(`Magis Flow kon niet starten: ${error.message}`); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`Magis Flow is geopend op http://127.0.0.1:${port}\nLokale opslag: ${join(root, 'data', 'flow.sqlite')}`));
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close());
}
