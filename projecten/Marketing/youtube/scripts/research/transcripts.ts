import {readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {ensureDirectory, writeJson} from "../lib/files";

export type TranscriptCue = {start: number; end: number; text: string};

const parseTime = (value: string) => {
  const parts = value.trim().replace(",", ".").split(":").map(Number);
  if (parts.some(Number.isNaN)) throw new Error(`Invalid caption timestamp: ${value}`);
  if (parts.length === 3) return parts[0]! * 3600 + parts[1]! * 60 + parts[2]!;
  return parts[0]! * 60 + parts[1]!;
};

const cleanMarkup = (text: string) => text
  .replace(/<\d\d:\d\d:\d\d\.\d\d\d>/g, "")
  .replace(/<[^>]+>/g, "")
  .replace(/&amp;/g, "&")
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">")
  .replace(/\s+/g, " ")
  .trim();

const removeRollingDuplicate = (previous: string, current: string) => {
  const a = previous.split(/\s+/);
  const b = current.split(/\s+/);
  const max = Math.min(a.length, b.length);
  for (let size = max; size > 0; size--) {
    if (a.slice(-size).join(" ").toLowerCase() === b.slice(0, size).join(" ").toLowerCase()) {
      return b.slice(size).join(" ").trim();
    }
  }
  return current;
};

export const parseCaptions = (source: string): TranscriptCue[] => {
  const normalized = source.replace(/^\uFEFF/, "").replace(/\r/g, "");
  const blocks = normalized.split(/\n{2,}/);
  const cues: TranscriptCue[] = [];
  let previous = "";

  for (const block of blocks) {
    const lines = block.split("\n").filter(Boolean);
    const timingIndex = lines.findIndex((line) => line.includes("-->"));
    if (timingIndex < 0) continue;
    const [startRaw, endRawWithSettings] = lines[timingIndex]!.split("-->").map((part) => part.trim());
    if (!startRaw || !endRawWithSettings) continue;
    const endRaw = endRawWithSettings.split(/\s+/)[0]!;
    let text = cleanMarkup(lines.slice(timingIndex + 1).join(" "));
    if (!text) continue;
    text = removeRollingDuplicate(previous, text);
    if (!text) continue;

    const cue = {start: parseTime(startRaw), end: parseTime(endRaw), text};
    const last = cues.at(-1);
    if (last && last.text.toLowerCase() === cue.text.toLowerCase()) {
      last.end = Math.max(last.end, cue.end);
      continue;
    }
    cues.push(cue);
    previous = cleanMarkup(lines.slice(timingIndex + 1).join(" "));
  }
  return cues;
};

export const normalizeTranscript = async (inputPath: string, captionKind: "creator" | "auto" | "unknown") => {
  const source = await readFile(inputPath, "utf8");
  const cues = parseCaptions(source);
  const base = inputPath.replace(/\.(vtt|srt)$/i, "");
  await ensureDirectory(path.dirname(base));
  await writeJson(`${base}.timed.json`, {captionKind, uncertainCorrections: [], cues});
  await writeFile(`${base}.txt`, `${cues.map((cue) => cue.text).join(" ")}\n`, "utf8");
  return cues;
};
