import { createServer } from "node:http";
import type { IncomingMessage, ServerResponse } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { InputError } from "./model.js";
import { openStore } from "./store.js";
import type { Store } from "./store.js";

const assets = new Map([
  ["/", ["index.html", "text/html; charset=utf-8"]],
  ["/app.js", ["app.js", "text/javascript; charset=utf-8"]],
  ["/style.css", ["style.css", "text/css; charset=utf-8"]],
  ["/model.js", ["../src/model.js", "text/javascript; charset=utf-8"]],
]);

function json(response: ServerResponse, status: number, body: unknown) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
}

async function readBody(request: IncomingMessage): Promise<unknown> {
  if (request.headers["content-type"]?.split(";")[0].trim() !== "application/json") {
    throw new InputError("CONTENT_TYPE", "Gebruik application/json.", 415);
  }
  const chunks: Buffer[] = [];
  let length = 0;
  for await (const chunk of request) {
    length += chunk.length;
    if (length > 2048) throw new InputError("BODY_TOO_LARGE", "Dit verzoek is groter dan 2 KB.", 413);
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
  } catch {
    throw new InputError("JSON_INVALID", "Het verzoek bevat ongeldige JSON.");
  }
}

export function createApp(store: Store) {
  const server = createServer({ requestTimeout: 10_000, headersTimeout: 10_000, maxHeaderSize: 8192 }, async (request, response) => {
    response.setHeader("Cache-Control", "no-store");
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("Referrer-Policy", "no-referrer");
    response.setHeader("X-Robots-Tag", "noindex, nofollow");
    response.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");
    try {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      const host = request.headers.host;
      if (host !== `127.0.0.1:${port}` && host !== `localhost:${port}`) {
        throw new InputError("HOST_FORBIDDEN", "Deze console is alleen via de lokale host beschikbaar.", 403);
      }
      const origin = `http://${host}`;
      if ((request.headers.origin && request.headers.origin !== origin) || request.headers["sec-fetch-site"] === "cross-site") {
        throw new InputError("ORIGIN_FORBIDDEN", "Open de console rechtstreeks op de lokale host.", 403);
      }
      const path = request.url ?? "/";
      if (request.method === "GET") {
        if (path === "/api/state") return json(response, 200, store.snapshot());
        if (path === "/api/health") return json(response, 200, { status: "ok", mode: "local-demo" });
        const asset = assets.get(path);
        if (asset) {
          const body = await readFile(new URL(`../web/${asset[0]}`, import.meta.url));
          response.writeHead(200, { "Content-Type": asset[1] });
          response.end(body);
          return;
        }
        throw new InputError("NOT_FOUND", "Deze pagina bestaat niet.", 404);
      }
      if (request.method !== "POST") throw new InputError("METHOD_DENIED", "Deze methode is niet beschikbaar.", 405);
      if (request.headers.origin !== origin) throw new InputError("ORIGIN_REQUIRED", "Een passende Origin-header is verplicht.", 403);
      const action = path.startsWith("/api/") ? path.slice(5) : "";
      if (!["demo-events", "runs", "review", "policy-check"].includes(action)) {
        throw new InputError("NOT_FOUND", "Deze actie bestaat niet.", 404);
      }
      const key = request.headers["idempotency-key"];
      if (typeof key !== "string" || !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(key)) {
        throw new InputError("KEY_REQUIRED", "Een UUID-v4 verzoek-ID is verplicht.");
      }
      const body = await readBody(request);
      try {
        return json(response, 200, store.execute(action, body, key));
      } catch (error) {
        if (error instanceof InputError) store.reject(error.code);
        throw error;
      }
    } catch (error) {
      if (error instanceof InputError) {
        json(response, error.status, { error: { code: error.code, message: error.message } });
      } else {
        // Do not log request bodies or database contents, even when an operation fails.
        console.error("CONTROL_ROOM_INTERNAL_ERROR", error instanceof Error ? error.name : "UnknownError");
        json(response, 500, { error: { code: "INTERNAL_ERROR", message: "De lokale bewerking is mislukt. Controleer de server en ververs de werkruimte; herhaal geen onzekere wijziging." } });
      }
    }
  });
  return server;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.CONTROL_ROOM_PORT ?? 4317);
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error("CONTROL_ROOM_PORT moet tussen 1024 en 65535 liggen.");
  const directory = resolve(process.env.CONTROL_ROOM_DATA_DIR ?? fileURLToPath(new URL("../../data/", import.meta.url)));
  await mkdir(directory, { recursive: true });
  const store = openStore(resolve(directory, "control-room.sqlite"));
  const server = createApp(store);
  server.on("error", (error) => {
    console.error("Control Room kon niet starten:", error.message);
    store.close();
    process.exitCode = 1;
  });
  server.listen(port, "127.0.0.1", () => console.log(`Control Room: http://127.0.0.1:${port} · synthetische data · alleen lokaal`));
  for (const signal of ["SIGINT", "SIGTERM"] as const) {
    process.on(signal, () => server.close(() => { store.close(); process.exit(0); }));
  }
}
