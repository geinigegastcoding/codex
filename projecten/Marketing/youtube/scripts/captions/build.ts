import path from "node:path";
import {readFile} from "node:fs/promises";
import {scriptSchema} from "../../src/pipeline/schemas";
import {exists, readJson, writeJson} from "../lib/files";
import {videoDirectory} from "../lib/paths";

type Alignment = {source: string; uncertain: boolean; segments: Array<{text: string; start: number; end: number}>};
type Manifest = {scenes: Array<{sceneId: string; sourceText: string; durationSeconds: number; alignmentPath?: string}>};

const stripAudioMarkers = (value: string) => value.replace(/\[[^\]]+\]/g, " ").replace(/\s+/g, " ").trim();

const phraseGroups = (words: Array<{text: string; startMs: number; endMs: number; confidence: number | null}>) => {
  const phrases: Array<typeof words> = [];
  let current: typeof words = [];
  for (const word of words) {
    const candidate = [...current, word];
    const text = candidate.map((item) => item.text).join(" ");
    const shouldBreak = current.length >= 7 || text.length > 42 || /[.!?;:]$/.test(current.at(-1)?.text ?? "");
    if (shouldBreak && current.length) {
      phrases.push(current);
      current = [word];
    } else current = candidate;
  }
  if (current.length) phrases.push(current);
  return phrases;
};

export const buildCaptions = async (slug: string) => {
  const directory = videoDirectory(slug);
  const script = await readJson(path.join(directory, "script.json"), scriptSchema);
  const manifest = await readJson<Manifest>(path.join(directory, "voice-manifest.json"));
  const captions: Array<Record<string, unknown>> = [];
  let sceneOffsetMs = 0;

  for (const scene of script.scenes) {
    const audio = manifest.scenes.find((entry) => entry.sceneId === scene.id);
    if (!audio) throw new Error(`Voice manifest has no entry for ${scene.id}`);
    let words: Array<{text: string; startMs: number; endMs: number; confidence: number | null}> = [];
    let alignmentSource = "estimated-from-script";
    let uncertain = true;

    if (audio.alignmentPath && await exists(audio.alignmentPath)) {
      const alignment = JSON.parse(await readFile(audio.alignmentPath, "utf8")) as Alignment;
      alignmentSource = alignment.source;
      uncertain = alignment.uncertain;
      words = alignment.segments.flatMap((segment) => {
        const segmentWords = stripAudioMarkers(segment.text).split(/\s+/).filter(Boolean);
        const duration = Math.max(0.01, segment.end - segment.start);
        return segmentWords.map((text, index) => ({text, startMs: sceneOffsetMs + (segment.start + duration * index / segmentWords.length) * 1000, endMs: sceneOffsetMs + (segment.start + duration * (index + 1) / segmentWords.length) * 1000, confidence: null}));
      });
    } else {
      const tokens = stripAudioMarkers(scene.narration).split(/\s+/).filter(Boolean);
      words = tokens.map((text, index) => ({text, startMs: sceneOffsetMs + audio.durationSeconds * 1000 * index / tokens.length, endMs: sceneOffsetMs + audio.durationSeconds * 1000 * (index + 1) / tokens.length, confidence: null}));
    }

    for (const phrase of phraseGroups(words)) {
      captions.push({text: phrase.map((word) => word.text).join(" "), startMs: phrase[0]!.startMs, endMs: phrase.at(-1)!.endMs, timestampMs: null, confidence: uncertain ? null : 1, sceneId: scene.id, words: phrase, alignmentSource, uncertain});
    }
    sceneOffsetMs += audio.durationSeconds * 1000;
  }
  await writeJson(path.join(directory, "captions.json"), captions);
  return captions;
};
