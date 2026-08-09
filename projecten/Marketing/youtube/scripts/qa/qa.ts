import {readdir, readFile, stat} from "node:fs/promises";
import path from "node:path";
import {storyboardSchema} from "../../src/pipeline/schemas";
import {exists, readJson, writeJson} from "../lib/files";
import {projectRoot} from "../lib/paths";
import {run} from "../lib/process";
import {listUnusedAssets, validateVideo} from "../video/video";

const secretPatterns = [
  /Bearer\s+[A-Za-z0-9._-]{20,}/,
  /(?:FISH_API_KEY|api[_-]?key)[ \t]*[:=][ \t]*["']?[A-Za-z0-9._-]{16,}/i,
];

const walk = async (directory: string): Promise<string[]> => {
  const files: string[] = [];
  for (const entry of await readdir(directory, {withFileTypes: true})) {
    if (["node_modules", ".git", ".cache", "out", "temp", ".env", ".env.local"].includes(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else files.push(full);
  }
  return files;
};

export const runQa = async (slug: string, renderFrame = true) => {
  const {script, directory} = await validateVideo(slug);
  const storyboard = await readJson(path.join(directory, "storyboard.json"), storyboardSchema);
  const findings: Array<{severity: "error" | "warning"; check: string; detail: string}> = [];
  const unused = await listUnusedAssets(slug, script);
  for (const file of unused) findings.push({severity: "warning", check: "unused-assets", detail: file});

  const sceneIds = new Set(script.scenes.map((scene) => scene.id));
  for (const timing of storyboard.scenes) if (!sceneIds.has(timing.sceneId)) findings.push({severity: "error", check: "storyboard-reference", detail: timing.sceneId});
  const computedFrames = Math.max(...storyboard.scenes.map((scene) => scene.startFrame + scene.durationInFrames));
  if (computedFrames !== storyboard.totalFrames) findings.push({severity: "error", check: "duration", detail: `Storyboard ends at ${computedFrames}, totalFrames is ${storyboard.totalFrames}`});

  const sourceFiles = await walk(projectRoot);
  for (const file of sourceFiles) {
    if ((await stat(file)).size > 2_000_000 || /\.(png|jpe?g|webp|mp[34]|wav|m4a|woff2?)$/i.test(file)) continue;
    const content = await readFile(file, "utf8");
    if (secretPatterns.some((pattern) => pattern.test(content))) findings.push({severity: "error", check: "secret-scan", detail: path.relative(projectRoot, file)});
  }

  if (script.scenes.some((scene) => scene.narration.trim().split(/\s+/).length < 4)) findings.push({severity: "warning", check: "thin-scene", detail: "One or more narration scenes contain fewer than four words."});
  if (script.scenes[0] && /welcome back|in today'?s|hello everyone/i.test(script.scenes[0].narration)) findings.push({severity: "error", check: "generic-hook", detail: script.scenes[0].narration});
  if (script.scenes.every((scene) => scene.visual.type === script.scenes[0]?.visual.type)) findings.push({severity: "warning", check: "visual-variety", detail: "All scenes use the same visual type."});

  const master = path.join(directory, "renders", "narration-master.wav");
  if (await exists(master)) {
    const clipping = await run("ffmpeg", ["-hide_banner", "-i", master, "-af", "volumedetect", "-f", "null", "-"], {quiet: true}).catch((error) => ({stderr: String(error), stdout: "", code: 1}));
    const peak = clipping.stderr.match(/max_volume:\s*(-?[\d.]+) dB/);
    if (peak && Number(peak[1]) > -0.5) findings.push({severity: "warning", check: "audio-peak", detail: `Peak is ${peak[1]} dB`});
    const silence = await run("ffmpeg", ["-hide_banner", "-i", master, "-af", "silencedetect=noise=-45dB:d=3", "-f", "null", "-"], {quiet: true}).catch((error) => ({stderr: String(error), stdout: "", code: 1}));
    if (/silence_duration:\s*(?:[4-9]|\d{2,})/i.test(silence.stderr)) findings.push({severity: "warning", check: "long-silence", detail: "Audio contains a silent gap longer than the configured threshold."});
  } else findings.push({severity: "warning", check: "missing-master-audio", detail: "Run voice:stitch before final render."});

  if (renderFrame) {
    const output = path.join(directory, "renders", "qa-frame.png");
    await run("npx", ["remotion", "still", "src/index.ts", "SmokeTest", output, "--frame=45", "--scale=0.25"], {cwd: projectRoot});
  }

  const report = {slug, checkedAt: new Date().toISOString(), passed: !findings.some((finding) => finding.severity === "error"), findings,
    manualChecks: ["Hook communicates a useful reason to continue", "Promise is paid off", "Every material claim is sourced", "Uncertainty is marked", "Visuals prove or explain narration", "No generic filler or copied identity", "Voice owner is not implied to endorse the channel", "YouTube altered-content disclosure decision is documented"]};
  await writeJson(path.join(directory, "qa-report.json"), report);
  if (!report.passed) throw new Error(`QA failed:\n${findings.filter((finding) => finding.severity === "error").map((finding) => `- ${finding.check}: ${finding.detail}`).join("\n")}`);
  return report;
};
