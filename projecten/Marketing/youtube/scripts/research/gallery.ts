import {readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {exists} from "../lib/files";
import {researchRoot} from "../lib/paths";

const htmlEntities: Record<string, string> = {"&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;"};
const escapeHtml = (value: string) => value.replace(/[&<>\"]/g, (character) => htmlEntities[character]!);

type Frame = {file: string; timestamp: number | null; visualFunction: string};
type ChannelData = {channel: string; videos?: Array<{id: string; title: string; webpageUrl: string}>};

export const buildGallery = async () => {
  const cards: string[] = [];
  for (const key of ["devsplainer", "kaiexplains"]) {
    const videoFile = path.join(researchRoot, "channels", key, "videos.json");
    if (!(await exists(videoFile))) continue;
    const data = JSON.parse(await readFile(videoFile, "utf8")) as ChannelData;
    for (const video of data.videos ?? []) {
      const frameDirectory = path.join(researchRoot, "channels", key, "frames", video.id);
      const manifestPath = path.join(frameDirectory, "frames.json");
      if (!(await exists(manifestPath))) continue;
      const frames = JSON.parse(await readFile(manifestPath, "utf8")) as Frame[];
      for (const frame of frames) {
        const relative = path.relative(path.join(researchRoot, "analysis"), path.join(frameDirectory, frame.file)).replaceAll("\\", "/");
        const timestamp = frame.timestamp === null ? "scene-change timestamp unresolved" : `${frame.timestamp}s`;
        cards.push(`<article data-channel="${escapeHtml(data.channel)}"><img loading="lazy" src="${escapeHtml(relative)}" alt="Private research frame from ${escapeHtml(video.title)}"><div><span class="channel">${escapeHtml(data.channel)}</span><h2>${escapeHtml(video.title)}</h2><p><a href="${escapeHtml(video.webpageUrl)}#t=${frame.timestamp ?? 0}s">Source video</a> · ${timestamp}</p><p class="note">${escapeHtml(frame.visualFunction)}</p></div></article>`);
      }
    }
  }

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Private channel research gallery</title><style>:root{font-family:Inter,system-ui;color:#142033;background:#f5f7fa}body{margin:0;padding:32px}header{max-width:1000px;margin:0 auto 32px}nav{display:flex;gap:12px;margin:20px 0}button{padding:10px 16px;border:1px solid #dce3ea;border-radius:999px;background:#fff}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(330px,1fr));gap:18px}article{background:#fff;border:1px solid #dce3ea;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px #14203312}img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;background:#e9eef4}article div{padding:16px}.channel{color:#5b5fef;font-weight:750}h2{font-size:18px;line-height:1.25}.note{color:#5d6b7d}a{color:#087e6c}</style></head><body><header><h1>Private reference-channel research</h1><p>${cards.length} sampled frames. These images exist only to study mechanisms and must not appear in published output. Timestamps for scene-change-only frames can be unresolved; fixed samples are exact by extraction schedule.</p><nav><button onclick="filterCards('all')">All</button><button onclick="filterCards('Devsplainers')">Devsplainers</button><button onclick="filterCards('Kai')">Kai</button></nav></header><main>${cards.join("\n") || "<p>No frames yet. Run research with frame extraction enabled.</p>"}</main><script>function filterCards(name){document.querySelectorAll('article').forEach(card=>card.hidden=name!=='all'&&card.dataset.channel!==name)}</script></body></html>`;
  const output = path.join(researchRoot, "analysis", "gallery.html");
  await writeFile(output, html, "utf8");
  return output;
};
