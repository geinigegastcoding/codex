import {readdir, readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const channels = [
  {key: "devsplainer", name: "Devsplainers", id: "UCf4sXk66VuWGlg4Nh0tuCdA", url: "https://www.youtube.com/channel/UCf4sXk66VuWGlg4Nh0tuCdA", confidence: "likely-inference"},
  {key: "kaiexplains", name: "Kai", id: "UCgUfJoPtkt7-RiiuYh4vmGA", url: "https://www.youtube.com/channel/UCgUfJoPtkt7-RiiuYh4vmGA", confidence: "observed"},
];

const parseTime = (value) => {const parts = value.trim().replace(",", ".").split(":").map(Number); return parts.length === 3 ? parts[0] * 3600 + parts[1] * 60 + parts[2] : parts[0] * 60 + parts[1];};
const clean = (value) => value.replace(/<\d\d:\d\d:\d\d\.\d\d\d>/g, "").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const overlap = (previous, current) => {const a = previous.split(/\s+/); const b = current.split(/\s+/); for (let n = Math.min(a.length, b.length); n > 0; n--) if (a.slice(-n).join(" ").toLowerCase() === b.slice(0, n).join(" ").toLowerCase()) return b.slice(n).join(" "); return current;};
const parseVtt = (source) => {const cues = []; let previous = ""; for (const block of source.replace(/\r/g, "").split(/\n{2,}/)) {const lines = block.split("\n").filter(Boolean); const i = lines.findIndex((line) => line.includes("-->")); if (i < 0) continue; const [start, rest] = lines[i].split("-->").map((value) => value.trim()); let text = clean(lines.slice(i + 1).join(" ")); const original = text; text = overlap(previous, text); previous = original; if (!text) continue; const cue = {start: parseTime(start), end: parseTime(rest.split(/\s+/)[0]), text}; const last = cues.at(-1); if (last && last.text.toLowerCase() === cue.text.toLowerCase()) last.end = Math.max(last.end, cue.end); else cues.push(cue);} return cues;};
const csv = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const patterns = [];
const evidence = [];

for (const channel of channels) {
  const directory = path.join(root, "research", "channels", channel.key, "transcripts");
  const files = await readdir(directory);
  const infoFiles = files.filter((file) => file.endsWith(".info.json"));
  const videos = [];
  for (const infoFile of infoFiles) {
    const info = JSON.parse(await readFile(path.join(directory, infoFile), "utf8"));
    const vtts = files.filter((file) => file.startsWith(`${info.id}.`) && file.endsWith(".vtt"));
    const preferred = vtts.find((file) => file.includes("en-orig")) ?? vtts.find((file) => file.includes(".en.")) ?? vtts[0];
    let cues = [];
    let captionKind = "unavailable";
    if (preferred) {
      cues = parseVtt(await readFile(path.join(directory, preferred), "utf8"));
      captionKind = Object.keys(info.subtitles ?? {}).some((language) => preferred.includes(`.${language}.`)) ? "creator" : "auto";
      const base = path.join(directory, info.id);
      await writeFile(`${base}.timed.json`, `${JSON.stringify({captionKind, uncertainCorrections: [], cues}, null, 2)}\n`);
      await writeFile(`${base}.txt`, `${cues.map((cue) => cue.text).join(" ")}\n`);
    }
    const words = cues.reduce((sum, cue) => sum + cue.text.split(/\s+/).filter(Boolean).length, 0);
    const transcriptDuration = cues.at(-1)?.end ?? info.duration ?? 0;
    const estimatedWpm = transcriptDuration ? Math.round(words / transcriptDuration * 60) : null;
    const firstCue = cues[0] ?? null;
    const video = {id: info.id, title: info.title, webpageUrl: info.webpage_url, channel: info.channel, channelId: info.channel_id, uploadDate: info.upload_date, timestamp: info.timestamp, duration: info.duration, viewCount: info.view_count, likeCount: info.like_count, description: info.description, categories: info.categories, tags: info.tags, thumbnail: info.thumbnail, captionKind, transcriptFile: preferred ? `${info.id}.timed.json` : null, firstSpokenSentence: firstCue?.text ?? null, firstSpokenAt: firstCue?.start ?? null, estimatedWpm};
    videos.push(video);
    patterns.push({channel: channel.name, videoId: info.id, title: info.title, url: info.webpage_url, durationSeconds: info.duration, publicViewCountAtCheck: info.view_count, uploadDate: info.upload_date, firstSpokenSentence: firstCue?.text ?? null, promiseClearBySeconds: null, estimatedWpm, captionKind, observationsPendingVisualCoding: true});
    if (firstCue) evidence.push({channel: channel.name, video: info.title, url: info.webpage_url, time: `${firstCue.start.toFixed(1)}-${firstCue.end.toFixed(1)}`, observation: `First captioned spoken text: “${firstCue.text}”`, confidence: "observed", category: "script"});
    if (estimatedWpm) evidence.push({channel: channel.name, video: info.title, url: info.webpage_url, time: `0-${transcriptDuration.toFixed(1)}`, observation: `Estimated caption-derived speaking rate: ${estimatedWpm} words per minute. Rolling caption duplicates were removed; caption errors can affect this estimate.`, confidence: "likely-inference", category: "pacing"});
  }
  videos.sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));
  await writeFile(path.join(root, "research", "channels", channel.key, "videos.json"), `${JSON.stringify({channel: channel.name, channelId: channel.id, channelUrl: channel.url, resolutionConfidence: channel.confidence, dateChecked: "2026-08-03", selectionMethod: "Selected seed set across recent visible uploads and varied apparent topics. Public views are retained only as a selection signal, not a quality measure.", videos}, null, 2)}\n`);
}

await writeFile(path.join(root, "research", "analysis", "pattern-dataset.json"), `${JSON.stringify({generatedAt: "2026-08-03", caveat: "Transcript-derived fields are measured; visual fields remain unknown until frame coding is complete.", videos: patterns}, null, 2)}\n`);
const header = ["channel", "video", "url", "time", "observation", "confidence", "category"];
await writeFile(path.join(root, "research", "analysis", "evidence.csv"), `${header.join(",")}\n${evidence.map((row) => header.map((key) => csv(row[key])).join(",")).join("\n")}\n`);
console.log(`Materialized ${patterns.length} videos and ${evidence.length} evidence rows.`);
