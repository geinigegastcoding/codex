import { copyFile, mkdir } from "node:fs/promises";

const root = new URL("../", import.meta.url);
await mkdir(new URL("dist/web/", root), { recursive: true });
for (const file of ["index.html", "style.css"]) {
  await copyFile(new URL(`web/${file}`, root), new URL(`dist/web/${file}`, root));
}
console.log("Built server, browser assets and self-check.");
