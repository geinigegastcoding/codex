import {readdir, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const videos = [
  {id: "HPAh1uiE2z0", url: "https://www.youtube.com/watch?v=HPAh1uiE2z0"},
  {id: "mtk8p8czzDU", url: "https://www.youtube.com/watch?v=mtk8p8czzDU"},
];
for (const video of videos) {
  const directory = path.join(root, "research", "channels", "kaiexplains", "frames", video.id);
  const files = (await readdir(directory)).filter((file) => /^(early|later)-\d+\.jpg$/i.test(file)).sort();
  const metadata = files.map((file) => {const [, kind, raw] = file.match(/(early|later)-(\d+)/) ?? []; const index = Number(raw); return {file, timestamp: kind === "early" ? (index - 1) * 3 : 30 + (index - 1) * 15, visualFunction: "Uncoded — review and annotate", sourceVideoUrl: video.url};});
  await writeFile(path.join(directory, "frames.json"), `${JSON.stringify(metadata, null, 2)}\n`);
}
await writeFile(path.join(root, "research", "analysis", "frame-extraction-warnings.json"), `${JSON.stringify([{channel: "kaiexplains", videoId: "HPAh1uiE2z0", url: videos[0].url, reason: "Scene-change-only frames could not be regenerated after a transient YouTube 403; dense opening and fixed-interval frames plus a contact sheet exist."},{channel: "kaiexplains", videoId: "mtk8p8czzDU", url: videos[1].url, reason: "Scene-change-only frames could not be regenerated after a transient YouTube 403; dense opening and fixed-interval frames plus a contact sheet exist."}], null, 2)}\n`);
console.log("Finalized partial frame sets for two videos.");
