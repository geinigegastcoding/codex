import {readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const esc = (value) => String(value).replace(/[&<>\"]/g, (character) => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[character]));
const cards = [];
for (const key of ["devsplainer", "kaiexplains"]) {
  const data = JSON.parse(await readFile(path.join(root, "research", "channels", key, "videos.json"), "utf8"));
  for (const video of data.videos) {
    const frameDirectory = path.join(root, "research", "channels", key, "frames", video.id);
    const frames = JSON.parse(await readFile(path.join(frameDirectory, "frames.json"), "utf8"));
    for (const frame of frames) {
      const image = path.relative(path.join(root, "research", "analysis"), path.join(frameDirectory, frame.file)).replaceAll("\\", "/");
      cards.push(`<article data-channel="${esc(data.channel)}"><img loading="lazy" src="${esc(image)}" alt="Private research frame from ${esc(video.title)}"><div><span class="channel">${esc(data.channel)}</span><h2>${esc(video.title)}</h2><p><a href="${esc(video.webpageUrl)}#t=${frame.timestamp ?? 0}s">Source video</a> · ${frame.timestamp === null ? "scene-change timestamp unresolved" : `${frame.timestamp}s`}</p><p class="note">${esc(frame.visualFunction)}</p></div></article>`);
    }
  }
}
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Private channel research gallery</title><style>:root{font-family:Inter,system-ui;color:#142033;background:#f5f7fa}body{margin:0;padding:32px}header{max-width:1000px;margin:0 auto 32px}nav{display:flex;gap:12px;margin:20px 0}button{padding:10px 16px;border:1px solid #dce3ea;border-radius:999px;background:#fff}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(330px,1fr));gap:18px}article{background:#fff;border:1px solid #dce3ea;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px #14203312}img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;background:#e9eef4}article div{padding:16px}.channel{color:#5b5fef;font-weight:750}h2{font-size:18px;line-height:1.25}.note{color:#5d6b7d}a{color:#087e6c}</style></head><body><header><h1>Private reference-channel research</h1><p>${cards.length} sampled frames. These images exist only to study mechanisms and must not appear in published output. Timestamps for scene-change-only frames can be unresolved; fixed samples are exact by extraction schedule.</p><nav><button onclick="filter('all')">All</button><button onclick="filter('Devsplainers')">Devsplainers</button><button onclick="filter('Kai')">Kai</button></nav></header><main>${cards.join("\n")}</main><script>function filter(name){document.querySelectorAll('article').forEach(card=>card.hidden=name!=='all'&&card.dataset.channel!==name)}</script></body></html>`;
await writeFile(path.join(root, "research", "analysis", "gallery.html"), html);
console.log(`Wrote gallery with ${cards.length} frames.`);
