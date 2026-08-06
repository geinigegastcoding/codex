import {cp, readdir, writeFile} from "node:fs/promises";
import path from "node:path";
import {captionsSchema, metadataSchema, scriptSchema, storyboardSchema, voiceConfigSchema, type Metadata, type Script} from "../../src/pipeline/schemas";
import {ensureDirectory, exists, readJson, writeJson} from "../lib/files";
import {publicVideoDirectory, videoDirectory} from "../lib/paths";

const templates: Record<Script["template"], {sections: string[]; visual: string}> = {
  "tool-review": {sections: ["hook", "task", "test", "limits", "verdict"], visual: "Show the tool doing a real task and preserve the evidence."},
  "ai-news": {sections: ["hook", "change", "mechanism", "impact", "limits"], visual: "Lead with the primary source, then explain the mechanism."},
  "technical-concept": {sections: ["hook", "problem", "model", "example", "payoff"], visual: "Move from concrete failure to a simple causal diagram."},
  "workflow-build": {sections: ["hook", "inputs", "build", "test", "next-action"], visual: "Show each working stage and the final output."},
  "model-comparison": {sections: ["hook", "criteria", "tests", "tradeoffs", "choice"], visual: "Use identical tasks and label uncontrolled variables."},
};

const markdownFiles = (slug: string, template: Script["template"]) => ({
  "brief.md": `# Brief: ${slug}\n\n- **Topic:** TODO\n- **Viewer:** Practical AI user who wants a verified answer\n- **Exact promise:** TODO\n- **Afterward the viewer can:** TODO\n- **Why now:** TODO\n- **Primary sources:** TODO\n- **Claims needing verification:** TODO\n- **Target duration:** 360 seconds\n- **Tone:** Clear, fast, technically credible\n- **Possible demonstration:** TODO\n- **Template:** ${template}\n`,
  "sources.md": "# Sources\n\nFor every claim, record the primary URL, access date, exact supported claim, and relevant section or timestamp.\n",
  "outline.md": `# Outline\n\n${templates[template].sections.map((section, index) => `${index + 1}. **${section}** ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â TODO`).join("\n")}\n`,
  "script.md": `# Script\n\nWrite narration and visual intent together. ${templates[template].visual}\n\nDo not use unsupported claims, fake tests, fake suspense, or generic motivational filler.\n`,
});

export const createVideo = async (slug: string, template: Script["template"] = "technical-concept", force = false) => {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) throw new Error("Slug must use lowercase letters, numbers, and hyphens");
  const directory = videoDirectory(slug);
  if (await exists(directory) && !force) throw new Error(`Video already exists: ${directory}`);
  await ensureDirectory(path.join(directory, "assets"));
  await ensureDirectory(path.join(directory, "renders"));
  await ensureDirectory(publicVideoDirectory(slug));

  for (const [name, content] of Object.entries(markdownFiles(slug, template))) await writeFile(path.join(directory, name), content, "utf8");
  const script: Script = {
    title: slug.split("-").map((word) => word[0]?.toUpperCase() + word.slice(1)).join(" "),
    slug,
    template,
    targetDurationSeconds: 360,
    scenes: [{
      id: "hook",
      section: "hook",
      narration: "Replace this line with a useful tension, result, or surprising verified finding.",
      onScreenText: "A concrete promise",
      visual: {type: "kinetic-text", emphasis: ["concrete"]},
      targetSeconds: 8,
    }],
  };
  await writeJson(path.join(directory, "script.json"), script);
  await writeJson(path.join(directory, "storyboard.json"), {fps: 30, width: 1920, height: 1080, totalFrames: 240, scenes: [{sceneId: "hook", startFrame: 0, durationInFrames: 240, transitionFrames: 0}]});
  await writeJson(path.join(directory, "voice-config.json"), {provider: "fish-audio", model: "s2.1-pro", format: "wav", prosody: {speed: 1, volume: 0, normalize_loudness: true}, temperature: 0.7, topP: 0.7, pauseMs: 280, useTimestamps: true});
  await writeJson(path.join(directory, "captions.json"), []);
  await writeJson(path.join(directory, "metadata.json"), {title: "TODO: specific title", description: "TODO: explain the concrete value and include source links.", chapters: [], sources: [], thumbnailBrief: "TODO: one specific promise, one focal visual, original visual identity.", aiDisclosureRequired: false, aiDisclosureReason: "No realistic altered content configured."});
  await writeFile(path.join(directory, "renders", ".gitkeep"), "", "utf8");
  console.log(`Created ${directory}`);
};

export const validateVideo = async (slug: string) => {
  const directory = videoDirectory(slug);
  const required = ["brief.md", "sources.md", "outline.md", "script.md", "script.json", "storyboard.json", "voice-config.json", "captions.json", "metadata.json"];
  const missing = [];
  for (const name of required) if (!(await exists(path.join(directory, name)))) missing.push(name);
  if (missing.length) throw new Error(`Missing required files: ${missing.join(", ")}`);
  const script = await readJson(path.join(directory, "script.json"), scriptSchema);
  await readJson(path.join(directory, "storyboard.json"), storyboardSchema);
  await readJson(path.join(directory, "voice-config.json"), voiceConfigSchema);
  await readJson(path.join(directory, "captions.json"), captionsSchema);
  await readJson(path.join(directory, "metadata.json"), metadataSchema);

  const ids = new Set<string>();
  const problems: string[] = [];
  for (const scene of script.scenes) {
    if (ids.has(scene.id)) problems.push(`Duplicate scene ID: ${scene.id}`);
    ids.add(scene.id);
    const asset = "asset" in scene.visual ? scene.visual.asset : undefined;
    if (asset) {
      const absolute = path.join(directory, asset);
      if (!(await exists(absolute))) problems.push(`Missing asset for ${scene.id}: ${asset}`);
    }
    if (!scene.sources?.length && /\b(research|study|data|percent|%|released|announced|costs?)\b/i.test(scene.narration)) problems.push(`Potential factual claim without a scene source: ${scene.id}`);
  }
  if (problems.length) throw new Error(problems.join("\n"));
  return {script, directory};
};

export const buildStoryboard = async (slug: string) => {
  const directory = videoDirectory(slug);
  const script = await readJson(path.join(directory, "script.json"), scriptSchema);
  const manifestPath = path.join(directory, "voice-manifest.json");
  const manifest = await exists(manifestPath) ? await readJson<{scenes: Array<{sceneId: string; durationSeconds: number}>}>(manifestPath) : null;
  const voiceConfig = voiceConfigSchema.parse(await readJson(path.join(directory, "voice-config.json")));
  const audioExtension = voiceConfig.format === "pcm" ? "pcm" : voiceConfig.format;
  let cursor = 0;
  const fps = 30;
  const scenes = script.scenes.map((scene) => {
    const audioDuration = manifest?.scenes.find((entry) => entry.sceneId === scene.id)?.durationSeconds;
    const seconds = audioDuration ?? scene.targetSeconds ?? Math.max(2, scene.narration.split(/\s+/).length / 2.7);
    const durationInFrames = Math.max(1, Math.ceil(seconds * fps));
    const value = {sceneId: scene.id, startFrame: cursor, durationInFrames, transitionFrames: 0, audio: manifest ? `videos/${slug}/audio/${scene.id}.${audioExtension}` : undefined};
    cursor += durationInFrames;
    return value;
  });
  const storyboard = storyboardSchema.parse({fps, width: 1920, height: 1080, totalFrames: cursor, scenes});
  await writeJson(path.join(directory, "storyboard.json"), storyboard);
  return storyboard;
};

export const syncVideoToPublic = async (slug: string) => {
  const source = videoDirectory(slug);
  const destination = publicVideoDirectory(slug);
  await ensureDirectory(destination);
  for (const file of ["script.json", "storyboard.json", "captions.json", "metadata.json"]) {
    if (await exists(path.join(source, file))) await cp(path.join(source, file), path.join(destination, file), {force: true});
  }
  const assets = path.join(source, "assets");
  if (await exists(assets)) await cp(assets, path.join(destination, "assets"), {recursive: true, force: true});
};

const isPlaceholderCopy = (value: string) => /\bTODO\b/i.test(value.trim());
const cleanCopy = (value: string) => value.replace(/\s+/g, " ").trim();
const deriveThumbnailTitle = (script: Script, title: string) => {
  const hook = script.scenes.find((scene) => scene.section === "hook")?.onScreenText ?? script.scenes[0]?.onScreenText ?? title;
  const copy = cleanCopy(hook).replace(/[.!?]+$/, "");
  return (copy.length >= 4 && copy.length <= 42 ? copy : (title.split(":")[0] ?? title)).toUpperCase();
};
const prepareMetadata = (script: Script, metadata: Metadata): Metadata => {
  const title = isPlaceholderCopy(metadata.title) ? script.title : metadata.title;
  const thumbnailTitle = metadata.thumbnailTitle?.trim() || deriveThumbnailTitle(script, title);
  const description = isPlaceholderCopy(metadata.description)
    ? `${title}. This video breaks down ${cleanCopy(script.scenes.slice(0, 3).map((scene) => scene.onScreenText).filter(Boolean).join(", ")) || "the key idea, practical tradeoffs, and limits"} so you can make a better-informed decision.`
    : metadata.description;
  const thumbnailBrief = isPlaceholderCopy(metadata.thumbnailBrief)
    ? `Use "${thumbnailTitle}" as the short thumbnail copy with one focal visual from the hook scene. Keep it high contrast, original, and readable at mobile size.`
    : metadata.thumbnailBrief;
  return {...metadata, title, description, thumbnailTitle, thumbnailBrief};
};
export const packageVideo = async (slug: string) => {
  const {script, directory} = await validateVideo(slug);
  const metadata = prepareMetadata(script, metadataSchema.parse(await readJson(path.join(directory, "metadata.json"))));
  await writeJson(path.join(directory, "metadata.json"), metadata);
  const packageDirectory = path.join(directory, "renders", "package");
  await ensureDirectory(packageDirectory);
  await writeFile(path.join(packageDirectory, "youtube-title.md"), `# YouTube title\n\n${metadata.title}\n`, "utf8");
  await writeFile(path.join(packageDirectory, "thumbnail-title.md"), `# Thumbnail title\n\n${metadata.thumbnailTitle}\n`, "utf8");
  await writeFile(path.join(packageDirectory, "youtube-description.md"), `# ${metadata.title}\n\n${metadata.description}\n\n## Sources\n${metadata.sources.map((source) => `- ${source.claim}: ${source.url}`).join("\n")}\n`, "utf8");
  await writeFile(path.join(packageDirectory, "thumbnail-brief.md"), `# Thumbnail brief\n\n${metadata.thumbnailBrief}\n`, "utf8");
  await writeJson(path.join(packageDirectory, "manifest.json"), {slug, title: metadata.title, thumbnailTitle: metadata.thumbnailTitle, disclosure: {required: metadata.aiDisclosureRequired, reason: metadata.aiDisclosureReason}});
  return packageDirectory;
};

export const listUnusedAssets = async (slug: string, script: Script) => {
  const directory = path.join(videoDirectory(slug), "assets");
  if (!(await exists(directory))) return [];
  const used = new Set(script.scenes.flatMap((scene) => "asset" in scene.visual ? [path.basename(scene.visual.asset)] : []));
  return (await readdir(directory)).filter((file) => !used.has(file));
};


