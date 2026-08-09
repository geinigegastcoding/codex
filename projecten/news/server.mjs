import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = normalize(fileURLToPath(new URL(".", import.meta.url)));
const rootPrefix = root.endsWith(sep) ? root : root + sep;
const port = Number(process.env.SIFT_PORT || 4173);
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

const server = createServer(async (request, response) => {
  const requestPath = decodeURIComponent(new URL(request.url || "/", "http://localhost").pathname);
  const relativePath = requestPath === "/" ? "index.html" : requestPath.slice(1);
  const filePath = normalize(join(root, relativePath));

  if (!filePath.startsWith(rootPrefix) || !existsSync(filePath)) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  try {
    const body = await readFile(filePath);
    response.writeHead(200, {
      "cache-control": "no-cache",
      "content-type": types[extname(filePath)] || "application/octet-stream",
    });
    response.end(body);
  } catch {
    response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    response.end("Could not read file");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Sift is running at http://127.0.0.1:${port}`);
});
