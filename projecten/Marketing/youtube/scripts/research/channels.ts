import {readdir, rm} from "node:fs/promises";
import path from "node:path";
import {ensureDirectory, readJson, writeJson} from "../lib/files";
import {researchRoot} from "../lib/paths";
import {run} from "../lib/process";
import {normalizeTranscript} from "./transcripts";
import {buildGallery} from "./gallery";

type ChannelSource = {
  key: string;
  resolvedName: string;
  channelUrl: string;
  channelId: string;
  confidence: string;
  selectedVideoUrls: string[];
};

type SourcesFile = {dateChecked: string; channels: ChannelSource[]};

const usefulMetadata = (info: Record<string, unknown>) => ({
  id: info.id,
  title: info.title,
  webpageUrl: info.webpage_url,
  channel: info.channel,
  channelId: info.channel_id,
  channelUrl: info.channel_url,
  uploadDate: info.upload_date,
  timestamp: info.timestamp,
  duration: info.duration,
  viewCount: info.view_count,
  likeCount: info.like_count,
  description: info.description,
  categories: info.categories,
  tags: info.tags,
  thumbnail: info.thumbnail,
  captions: {
    creatorLanguages: Object.keys((info.subtitles as Record<string, unknown> | undefined) ?? {}),
    automaticLanguages: Object.keys((info.automatic_captions as Record<string, unknown> | undefined) ?? {}),
  },
});

const extractFrames = async (key: string, video: {id: unknown; webpageUrl: unknown}, dryRun: boolean) => {
  const id = String(video.id);
  const url = String(video.webpageUrl);
  const tempDirectory = path.join(researchRoot, "temp", key, id);
  const framesDirectory = path.join(researchRoot, "channels", key, "frames", id);
  const sheetDirectory = path.join(researchRoot, "channels", key, "contact-sheets");
  await ensureDirectory(tempDirectory);
  await ensureDirectory(framesDirectory);
  await ensureDirectory(sheetDirectory);
  const template = path.join(tempDirectory, `${id}.%(ext)s`);

  await run("yt-dlp", ["--no-playlist", "-f", "bv*[height<=480]/bv*[height<=720]/bestvideo", "-o", template, url], {dryRun});
  if (dryRun) return;
  const media = (await readdir(tempDirectory)).find((file) => /\.(mp4|webm|mkv)$/i.test(file));
  if (!media) throw new Error(`No temporary video downloaded for ${id}`);
  const input = path.join(tempDirectory, media);

  await run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-i", input, "-t", "30", "-vf", "fps=1/3", "-frames:v", "10", "-q:v", "4", "-y", path.join(framesDirectory, "early-%02d.jpg")]);
  await run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-ss", "30", "-i", input, "-vf", "fps=1/15", "-frames:v", "15", "-q:v", "4", "-y", path.join(framesDirectory, "later-%02d.jpg")]);
  await run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-i", input, "-vf", "select='gt(scene,0.40)',setpts=N/FRAME_RATE/TB", "-vsync", "vfr", "-frames:v", "8", "-compression_level", "7", "-y", path.join(framesDirectory, "scene-%02d.png")]);
  const sheetFilter = "fps=1/18,scale=320:-1,drawtext=text='%{pts\\:hms}':x=8:y=h-30:fontsize=20:fontcolor=white:box=1:boxcolor=black@0.65,tile=5x5:padding=6:margin=6";
  await run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-i", input, "-vf", sheetFilter, "-frames:v", "1", "-compression_level", "7", "-y", path.join(sheetDirectory, `${id}.png`)]);
  const frameFiles = (await readdir(framesDirectory)).filter((file) => /^(early|later|scene)-\d+\.(?:jpg|png)$/i.test(file)).sort();
  await writeJson(path.join(framesDirectory, "frames.json"), frameFiles.map((file) => {
    const match = file.match(/(early|later|scene)-(\d+)/i);
    const index = Number(match?.[2] ?? 1);
    const timestamp = match?.[1]?.toLowerCase() === "early" ? (index - 1) * 3 : match?.[1]?.toLowerCase() === "later" ? 30 + (index - 1) * 15 : null;
    return {file, timestamp, visualFunction: "Uncoded â€” review and annotate", sourceVideoUrl: url};
  }));
  await rm(tempDirectory, {recursive: true, force: true});
};

export const researchChannels = async ({withFrames = false, dryRun = false}: {withFrames?: boolean; dryRun?: boolean}) => {
  const sources = await readJson<SourcesFile>(path.join(researchRoot, "channel-sources.json"));
  const frameWarnings: Array<{channel: string; videoId: string; url: string; reason: string}> = [];
  for (const channel of sources.channels) {
    const channelDirectory = path.join(researchRoot, "channels", channel.key);
    const transcriptDirectory = path.join(channelDirectory, "transcripts");
    await ensureDirectory(transcriptDirectory);
    const videos: Array<Record<string, unknown>> = [];

    for (const [index, url] of channel.selectedVideoUrls.entries()) {
      console.log(`[${channel.key}] ${index + 1}/${channel.selectedVideoUrls.length}: ${url}`);
      const metadataResult = await run("yt-dlp", ["--no-playlist", "--skip-download", "--dump-single-json", "--no-warnings", url], {dryRun, quiet: true});
      if (dryRun) continue;
      const raw = JSON.parse(metadataResult.stdout) as Record<string, unknown>;
      const metadata = usefulMetadata(raw);
      videos.push(metadata);

      const output = path.join(transcriptDirectory, "%(id)s.%(ext)s");
      try {
        await run("yt-dlp", ["--no-playlist", "--skip-download", "--write-subs", "--write-auto-subs", "--sub-langs", "en.*,en", "--sub-format", "vtt", "-o", output, url], {quiet: true});
      } catch (error) {
        console.warn(`Caption download warning for ${url}: ${error instanceof Error ? error.message : String(error)}`);
      }

      const captionFiles = (await readdir(transcriptDirectory)).filter((file) => file.startsWith(`${String(metadata.id)}.`) && file.endsWith(".vtt"));
      for (const file of captionFiles) {
        const creator = ((raw.subtitles as Record<string, unknown> | undefined) && Object.keys(raw.subtitles as Record<string, unknown>).some((language) => file.includes(`.${language}.`)));
        await normalizeTranscript(path.join(transcriptDirectory, file), creator ? "creator" : "auto");
      }

      if (withFrames) {
        try {
          await extractFrames(channel.key, metadata, dryRun);
        } catch (error) {
          const reason = error instanceof Error ? error.message : String(error);
          frameWarnings.push({channel: channel.key, videoId: String(metadata.id), url: String(metadata.webpageUrl), reason});
          await rm(path.join(researchRoot, "temp", channel.key, String(metadata.id)), {recursive: true, force: true});
          console.warn(`Frame extraction warning for ${url}: ${reason}`);
        }
      }
    }

    if (!dryRun) {
      await writeJson(path.join(channelDirectory, "videos.json"), {
        channel: channel.resolvedName,
        channelId: channel.channelId,
        channelUrl: channel.channelUrl,
        resolutionConfidence: channel.confidence,
        dateChecked: sources.dateChecked,
        selectionMethod: "Balanced seed set selected across recent visible uploads and varied apparent topics; public views are recorded only as a selection signal, never as a quality measure.",
        videos,
      });
    }
  }
  if (!dryRun && withFrames) await writeJson(path.join(researchRoot, "analysis", "frame-extraction-warnings.json"), frameWarnings);
  if (!dryRun) await buildGallery();
};
