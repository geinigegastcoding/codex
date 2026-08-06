import {mkdir, readdir, readFile, rm, writeFile, stat} from "node:fs/promises";
import {spawn} from "node:child_process";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const run = (command, args) => new Promise((resolve, reject) => {console.log(`$ ${command} ${args.join(" ")}`); const child = spawn(command, args, {windowsHide: true, stdio: "inherit"}); child.on("error", reject); child.on("close", (code) => code === 0 ? resolve() : reject(new Error(`${command} exited ${code}`)));});
const exists = async (file) => {try {await stat(file); return true;} catch {return false;}};
const skipped = [];
for (const key of ["devsplainer", "kaiexplains"]) {
  const data = JSON.parse(await readFile(path.join(root, "research", "channels", key, "videos.json"), "utf8"));
  for (const [videoIndex, video] of data.videos.entries()) {
    console.log(`[${key}] ${videoIndex + 1}/${data.videos.length} ${video.id}`);
    const temp = path.join(root, "research", "temp", key, video.id);
    const frames = path.join(root, "research", "channels", key, "frames", video.id);
    const sheets = path.join(root, "research", "channels", key, "contact-sheets");
    const metadataFile = path.join(frames, "frames.json");
    if (await exists(metadataFile)) {console.log(`[skip] frames already extracted for ${video.id}`); continue;}
    await mkdir(temp, {recursive: true}); await mkdir(frames, {recursive: true}); await mkdir(sheets, {recursive: true});
    try {
      const template = path.join(temp, `${video.id}.%(ext)s`);
      await run("yt-dlp", ["--no-playlist", "--retries", "5", "--fragment-retries", "5", "-f", "18/best[height<=360]/worst", "-o", template, video.webpageUrl]);
      const media = (await readdir(temp)).find((file) => /\.(mp4|webm|mkv)$/i.test(file));
      if (!media) throw new Error(`No media for ${video.id}`);
      const input = path.join(temp, media);
      const current = await readdir(frames);
      if (!current.some((file) => file.startsWith("early-"))) await run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-i", input, "-t", "30", "-vf", "fps=1/3", "-frames:v", "10", "-q:v", "4", "-y", path.join(frames, "early-%02d.jpg")]);
      if (!current.some((file) => file.startsWith("later-"))) await run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-ss", "30", "-i", input, "-vf", "fps=1/15", "-frames:v", "15", "-q:v", "4", "-y", path.join(frames, "later-%02d.jpg")]);
      await run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-i", input, "-vf", "select='gt(scene,0.40)',setpts=N/FRAME_RATE/TB", "-vsync", "vfr", "-frames:v", "8", "-compression_level", "7", "-y", path.join(frames, "scene-%02d.png")]);
      await run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-i", input, "-vf", "fps=1/18,scale=320:-1,drawtext=text='%{pts\\:hms}':x=8:y=h-30:fontsize=20:fontcolor=white:box=1:boxcolor=black@0.65,tile=5x5:padding=6:margin=6", "-frames:v", "1", "-compression_level", "7", "-y", path.join(sheets, `${video.id}.png`)]);
      const frameFiles = (await readdir(frames)).filter((file) => /\.(jpg|png)$/i.test(file)).sort();
      const frameMetadata = frameFiles.map((file) => {const match = file.match(/(early|later|scene)-(\d+)/); const index = Number(match?.[2] ?? 1); const timestamp = match?.[1] === "early" ? (index - 1) * 3 : match?.[1] === "later" ? 30 + (index - 1) * 15 : null; return {file, timestamp, visualFunction: "Uncoded — review and annotate", sourceVideoUrl: video.webpageUrl};});
      await writeFile(metadataFile, `${JSON.stringify(frameMetadata, null, 2)}\n`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      skipped.push({channel: key, videoId: video.id, url: video.webpageUrl, reason: message});
      console.warn(`[warning] skipped ${video.id}: ${message}`);
    } finally {await rm(temp, {recursive: true, force: true});}
  }
}
await writeFile(path.join(root, "research", "analysis", "frame-extraction-warnings.json"), `${JSON.stringify(skipped, null, 2)}\n`);
console.log(`Frame extraction complete with ${skipped.length} warning(s).`);
