import {createHash} from "node:crypto";
import {cp, readFile} from "node:fs/promises";
import path from "node:path";
import {config as loadEnv} from "dotenv";
import {scriptSchema, voiceConfigSchema, type VoiceConfig} from "../../src/pipeline/schemas";
import {atomicWrite, ensureDirectory, exists, readJson, writeJson} from "../lib/files";
import {cacheRoot, projectRoot, publicVideoDirectory, videoDirectory} from "../lib/paths";
import {run} from "../lib/process";

loadEnv({path: path.join(projectRoot, ".env.local"), quiet: true});

const PIPELINE_VERSION = "fish-v3-clean-mp3";

type AlignmentSegment = {text: string; start: number; end: number};
type TimestampEvent = {audio_base64: string; content: string; alignment: {segments: AlignmentSegment[]; audio_duration: number} | null; chunk_seq: number; chunk_audio_offset_sec: number};

type VoiceChunk = {
  index: number;
  text: string;
  hash: string;
  audioPath: string;
  durationSeconds: number;
  retryCount: number;
  alignmentPath?: string;
};

type VoiceManifest = {
  provider: "fish-audio" | "silent-fallback";
  model: string;
  createdAt: string;
  scenes: Array<{
    sceneId: string;
    hash: string;
    sourceText: string;
    audioPath: string;
    durationSeconds: number;
    settings: VoiceConfig;
    retryCount: number;
    alignmentPath?: string;
    chunks: VoiceChunk[];
  }>;
};

const sleep = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const normalizeText = (value: string) => value.normalize("NFKC").replace(/\s+/g, " ").trim();

const MAX_FISH_CHUNK_SECONDS = 10;
const CHUNK_WORD_TARGET = 16;

const createHashForScene = (text: string, config: VoiceConfig, referenceId: string | undefined) => createHash("sha256").update(JSON.stringify({
  text: normalizeText(text), referenceId: referenceId ?? null, model: config.model, prosody: config.prosody,
  temperature: config.temperature, topP: config.topP, format: config.format, chunkSeconds: config.chunkSeconds, useTimestamps: config.useTimestamps, pipelineVersion: PIPELINE_VERSION,
})).digest("hex");

const getDuration = async (filePath: string) => {
  const result = await run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", filePath], {quiet: true});
  const duration = Number(result.stdout.trim());
  if (!Number.isFinite(duration)) throw new Error(`Could not determine audio duration: ${filePath}`);
  return duration;
};

const parseSse = (text: string) => text.split(/\r?\n\r?\n+/).flatMap((block) => {
  const data = block.split(/\r?\n/).filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trim()).join("");
  if (!data || data === "[DONE]") return [];
  return [JSON.parse(data) as TimestampEvent];
});

const requestFish = async (text: string, config: VoiceConfig, referenceId: string, signal: AbortSignal) => {
  const timestamped = config.useTimestamps;
  const endpoint = timestamped ? "https://api.fish.audio/v1/tts/stream/with-timestamp" : "https://api.fish.audio/v1/tts";
  const response = await fetch(endpoint, {
    method: "POST",
    signal,
    headers: {Authorization: `Bearer ${process.env.FISH_API_KEY ?? ""}`, "Content-Type": "application/json", model: config.model},
    body: JSON.stringify({text, reference_id: referenceId, format: config.format, prosody: config.prosody, temperature: config.temperature, top_p: config.topP, normalize: true, latency: "normal"}),
  });
  if (!response.ok) {
    const message = await response.text();
    if (response.status === 401) throw new Error("Fish Audio authentication failed (401). Check FISH_API_KEY.");
    if (response.status === 402) throw new Error("Fish Audio balance is insufficient (402).");
    if (response.status === 422 || response.status === 400) throw new Error(`Fish Audio validation failed (${response.status}): ${message}`);
    const error = new Error(`Fish Audio request failed (${response.status}): ${message}`) as Error & {status?: number};
    error.status = response.status;
    throw error;
  }
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (!timestamped) return {audio: bytes, alignments: [] as AlignmentSegment[]};
  const events = parseSse(new TextDecoder().decode(bytes));
  const chunks = events.sort((a, b) => a.chunk_seq - b.chunk_seq).map((event) => Buffer.from(event.audio_base64, "base64"));
  const alignmentBySequence = new Map<number, AlignmentSegment[]>();
  for (const event of events) if (event.alignment) alignmentBySequence.set(event.chunk_seq, event.alignment.segments.map((segment) => ({...segment, start: segment.start + event.chunk_audio_offset_sec, end: segment.end + event.chunk_audio_offset_sec})));
  return {audio: new Uint8Array(Buffer.concat(chunks)), alignments: [...alignmentBySequence.entries()].sort(([a], [b]) => a - b).flatMap(([, value]) => value)};
};

const splitVoiceText = (value: string, maxWords: number) => {
  const tokens = value.match(/\[[^\]]+\]|[^\s]+/g) ?? [];
  const chunks: string[] = [];
  let current: string[] = [];
  let words = 0;
  for (const token of tokens) {
    current.push(token);
    if (!/^\[[^\]]+\]$/.test(token)) words++;
    const sentenceEnd = /[.!?;:]$/.test(token);
    if (words >= maxWords && (sentenceEnd || words >= maxWords + 4)) {
      chunks.push(current.join(" "));
      current = [];
      words = 0;
    }
  }
  if (current.length) chunks.push(current.join(" "));
  return chunks;
};

const encodeArgs = (format: VoiceConfig["format"]) => {
  if (format === "mp3") return ["-c:a", "libmp3lame", "-b:a", "320k"];
  if (format === "opus") return ["-c:a", "libopus", "-b:a", "128k"];
  return ["-c:a", "pcm_s16le"];
};

const concatAudioFiles = async (files: string[], destination: string, format: VoiceConfig["format"]) => {
  await ensureDirectory(path.dirname(destination));
  if (files.length === 1) {
    await cp(files[0]!, destination, {force: true});
    return;
  }
  const inputs: string[] = [];
  const filters: string[] = [];
  const labels: string[] = [];
  files.forEach((file, index) => {
    inputs.push("-i", file);
    filters.push("[" + index + ":a]aresample=48000,aformat=sample_fmts=fltp:channel_layouts=mono[a" + index + "]");
    labels.push("[a" + index + "]");
  });
  filters.push(labels.join("") + "concat=n=" + files.length + ":v=0:a=1[out]");
  await run("ffmpeg", ["-hide_banner", "-loglevel", "error", ...inputs, "-filter_complex", filters.join(";"), "-map", "[out]", ...encodeArgs(format), "-y", destination], {quiet: true});
};
const generateSilentFallback = async (seconds: number, destination: string, format: VoiceConfig["format"]) => {
  await ensureDirectory(path.dirname(destination));
  await run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-f", "lavfi", "-i", "anullsrc=r=48000:cl=mono", "-t", String(seconds), ...encodeArgs(format), "-y", destination], {quiet: true});
};
const assertVoicePermission = async () => {
  if (process.env.VOICE_PERMISSION_CONFIRMED !== "true") throw new Error("Refusing cloned-voice synthesis: VOICE_PERMISSION_CONFIRMED must equal true.");
  const record = await readFile(path.join(projectRoot, "docs", "voice-permission.md"), "utf8");
  const documented = /\*\*Permission status:\*\*\s*confirmed/i.test(record)
    && !/\*\*Voice owner:\*\*\s*(?:Not yet selected|TODO)/i.test(record)
    && !/\*\*Date permission received:\*\*\s*(?:Not received|TODO)/i.test(record)
    && !/\*\*Evidence location:\*\*\s*(?:Not recorded|TODO)/i.test(record);
  if (!documented) throw new Error("Refusing cloned-voice synthesis: docs/voice-permission.md must mark Permission status as confirmed and identify the owner, date, and evidence location.");
};

export const generateVoice = async (slug: string, onlyScene?: string, force = false) => {
  const directory = videoDirectory(slug);
  const script = await readJson(path.join(directory, "script.json"), scriptSchema);
  const voiceConfig = voiceConfigSchema.parse(await readJson(path.join(directory, "voice-config.json")));
  const referenceId = voiceConfig.referenceId ?? process.env.FISH_REFERENCE_ID;
  const hasCredentials = Boolean(process.env.FISH_API_KEY && referenceId);
  if (referenceId) await assertVoicePermission();

  const manifestPath = path.join(directory, "voice-manifest.json");
  const previous = onlyScene && await exists(manifestPath) ? await readJson<VoiceManifest>(manifestPath) : null;
  const manifest: VoiceManifest = {provider: hasCredentials ? "fish-audio" : "silent-fallback", model: voiceConfig.model, createdAt: new Date().toISOString(), scenes: previous?.scenes.filter((scene) => scene.sceneId !== onlyScene) ?? []};
  const scenes = script.scenes.filter((scene) => !onlyScene || scene.id === onlyScene);
  if (!scenes.length) throw new Error("Scene not found: " + onlyScene);

  for (const scene of scenes) {
    const sceneHash = createHashForScene(scene.narration, voiceConfig, referenceId);
    const chunkTexts = splitVoiceText(scene.narration, CHUNK_WORD_TARGET);
    const cacheDirectory = path.join(cacheRoot, "voice");
    const extension = voiceConfig.format === "pcm" ? "pcm" : voiceConfig.format;
    await ensureDirectory(cacheDirectory);
    const chunkFiles: string[] = [];
    const chunks: VoiceChunk[] = [];
    const mergedSegments: AlignmentSegment[] = [];
    let sceneOffset = 0;
    let allChunksAligned = true;
    let totalRetries = 0;

    for (let index = 0; index < chunkTexts.length; index++) {
      const chunkText = chunkTexts[index]!;
      const chunkHash = createHashForScene(scene.id + ":" + index + ":" + chunkText, voiceConfig, referenceId);
      const cachedAudio = path.join(cacheDirectory, chunkHash + "." + extension);
      const alignmentPath = path.join(cacheDirectory, chunkHash + ".alignment.json");
      let retryCount = 0;
      if (!hasCredentials) {
        const words = chunkText.replace(/\[[^\]]+\]/g, "").split(/\s+/).filter(Boolean).length;
        const seconds = Math.min(voiceConfig.chunkSeconds, Math.max(1.5, words / 2.7));
        if (!(await exists(cachedAudio)) || force) await generateSilentFallback(seconds, cachedAudio, voiceConfig.format);
      } else if (!(await exists(cachedAudio)) || force) {
        for (let attempt = 0; attempt < 4; attempt++) {
          retryCount = attempt;
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 90_000);
          try {
            const generated = await requestFish(chunkText, voiceConfig, referenceId!, controller.signal);
            await atomicWrite(cachedAudio, generated.audio);
            if (generated.alignments.length) await writeJson(alignmentPath, {source: "fish-timestamp-stream", uncertain: false, segments: generated.alignments});
            clearTimeout(timeout);
            break;
          } catch (error) {
            clearTimeout(timeout);
            const status = (error as Error & {status?: number}).status;
            if (attempt === 3 || (status && status < 500 && status !== 429)) throw error;
            await sleep((2 ** attempt * 750) + ((attempt * 137) % 500));
          }
        }
      }
      const duration = await getDuration(cachedAudio);
      if (duration > Math.min(MAX_FISH_CHUNK_SECONDS, voiceConfig.chunkSeconds) + 0.1) {
        throw new Error("Fish chunk exceeded the 10-second cap: " + scene.id + "/" + (index + 1) + " measured " + duration.toFixed(2) + "s.");
      }
      if (await exists(alignmentPath)) {
        const alignment = await readJson<{segments: AlignmentSegment[]}>(alignmentPath);
        for (const segment of alignment.segments) mergedSegments.push({...segment, start: segment.start + sceneOffset, end: segment.end + sceneOffset});
      } else {
        allChunksAligned = false;
      }
      chunks.push({index, text: chunkText, hash: chunkHash, audioPath: cachedAudio, durationSeconds: duration, retryCount, alignmentPath: await exists(alignmentPath) ? alignmentPath : undefined});
      chunkFiles.push(cachedAudio);
      sceneOffset += duration;
      totalRetries += retryCount;
    }

    const mergedAudio = path.join(cacheDirectory, sceneHash + "." + extension);
    if (!(await exists(mergedAudio)) || force) await concatAudioFiles(chunkFiles, mergedAudio, voiceConfig.format);
    const mergedDuration = await getDuration(mergedAudio);
    const publicAudio = path.join(publicVideoDirectory(slug), "audio", scene.id + "." + extension);
    await ensureDirectory(path.dirname(publicAudio));
    await cp(mergedAudio, publicAudio, {force: true});
    let alignmentPath: string | undefined;
    if (allChunksAligned && mergedSegments.length) {
      alignmentPath = path.join(cacheDirectory, sceneHash + ".alignment.json");
      await writeJson(alignmentPath, {source: "fish-timestamp-stream-chunked", uncertain: false, segments: mergedSegments});
    }
    manifest.scenes.push({sceneId: scene.id, hash: sceneHash, sourceText: scene.narration, audioPath: mergedAudio, durationSeconds: mergedDuration, settings: voiceConfig, retryCount: totalRetries, alignmentPath, chunks});
  }

  const sceneOrder = new Map(script.scenes.map((scene, index) => [scene.id, index]));
  manifest.scenes.sort((left, right) => (sceneOrder.get(left.sceneId) ?? Number.MAX_SAFE_INTEGER) - (sceneOrder.get(right.sceneId) ?? Number.MAX_SAFE_INTEGER));
  await writeJson(manifestPath, manifest);
  if (!hasCredentials) console.warn("Fish Audio credentials/reference are absent. Generated deterministic silent fallback audio; no API credits were used.");
  return manifest;
};
export const stitchVoice = async (slug: string) => {
  const directory = videoDirectory(slug);
  const manifest = await readJson<VoiceManifest>(path.join(directory, "voice-manifest.json"));
  const config = voiceConfigSchema.parse(await readJson(path.join(directory, "voice-config.json")));
  const output = path.join(directory, "renders", "narration-master.wav");
  await ensureDirectory(path.dirname(output));
  const inputs: string[] = [];
  const filterParts: string[] = [];
  manifest.scenes.forEach((scene, index) => {
    inputs.push("-i", scene.audioPath);
    filterParts.push(`[${index}:a]aresample=48000,aformat=sample_fmts=fltp:channel_layouts=mono[a${index}]`);
  });
  const concatInputs: string[] = [];
  let inputIndex = manifest.scenes.length;
  for (let index = 0; index < manifest.scenes.length; index++) {
    concatInputs.push(`[a${index}]`);
    if (index < manifest.scenes.length - 1 && config.pauseMs > 0) {
      inputs.push("-f", "lavfi", "-t", String(config.pauseMs / 1000), "-i", "anullsrc=r=48000:cl=mono");
      filterParts.push(`[${inputIndex}:a]aformat=sample_fmts=fltp:channel_layouts=mono[p${index}]`);
      concatInputs.push(`[p${index}]`);
      inputIndex++;
    }
  }
  filterParts.push(`${concatInputs.join("")}concat=n=${concatInputs.length}:v=0:a=1,loudnorm=I=-16:LRA=7:TP=-1.5,alimiter=limit=0.95[out]`);
  await run("ffmpeg", ["-hide_banner", "-loglevel", "error", ...inputs, "-filter_complex", filterParts.join(";"), "-map", "[out]", "-c:a", "pcm_s24le", "-y", output]);
  await run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-i", output, "-c:a", "libmp3lame", "-b:a", "320k", "-y", path.join(directory, "renders", "narration.mp3")]);
  await run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-i", output, "-c:a", "aac", "-b:a", "192k", "-y", path.join(directory, "renders", "narration.m4a")]);
  return output;
};


