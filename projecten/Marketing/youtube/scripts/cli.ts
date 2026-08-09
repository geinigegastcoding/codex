import {Command} from "commander";
import path from "node:path";
import {buildCaptions} from "./captions/build";
import {buildGallery} from "./research/gallery";
import {researchChannels} from "./research/channels";
import {runQa} from "./qa/qa";
import {exists, readJson, writeJson} from "./lib/files";
import {projectRoot, videoDirectory} from "./lib/paths";
import {run} from "./lib/process";
import {generateVoice, stitchVoice} from "./voice/fish";
import {buildStoryboard, createVideo, packageVideo, syncVideoToPublic, validateVideo} from "./video/video";
import {captionsSchema, scriptSchema, storyboardSchema} from "../src/pipeline/schemas";

const program = new Command();
program.name("ai-video-pipeline").showHelpAfterError();
const slugOption = (command: Command) => command.requiredOption("--slug <slug>");

program.command("research:channels").option("--with-frames", "download temporary low-resolution video and extract research frames").option("--dry-run").action(researchChannels);
program.command("research:gallery").action(async () => console.log(await buildGallery()));
slugOption(program.command("video:new")).option("--template <template>", "tool-review, ai-news, technical-concept, workflow-build, or model-comparison", "technical-concept").option("--force").action(async ({slug, template, force}) => createVideo(slug, template, force));
slugOption(program.command("video:validate")).action(async ({slug}) => {await validateVideo(slug); console.log(`Valid: ${slug}`);});
slugOption(program.command("voice:generate")).option("--scene <scene>").option("--force").action(async ({slug, scene, force}) => { await generateVoice(slug, scene, force); });
slugOption(program.command("voice:regenerate")).requiredOption("--scene <scene>").action(async ({slug, scene}) => { await generateVoice(slug, scene, true); });
slugOption(program.command("voice:stitch")).action(async ({slug}) => console.log(await stitchVoice(slug)));
slugOption(program.command("captions:build")).action(async ({slug}) => console.log(`Built ${(await buildCaptions(slug)).length} caption phrases`));
slugOption(program.command("storyboard:build")).action(async ({slug}) => console.log(`Built ${(await buildStoryboard(slug)).scenes.length} storyboard scenes`));
slugOption(program.command("qa")).option("--no-render-frame").action(async ({slug, renderFrame}) => console.log(await runQa(slug, renderFrame)));

const buildProps = async (slug: string) => {
  const directory = videoDirectory(slug);
  const props = {
    script: await readJson(path.join(directory, "script.json"), scriptSchema),
    storyboard: await readJson(path.join(directory, "storyboard.json"), storyboardSchema),
    captions: await readJson(path.join(directory, "captions.json"), captionsSchema),
    audioEnabled: true,
    captionTheme: "dark",
  };
  const file = path.join(directory, "renders", "remotion-props.json");
  await writeJson(file, props);
  return file;
};

slugOption(program.command("render")).option("--scale <scale>", "render scale", "1").option("--frames <range>").option("--dry-run").action(async ({slug, scale, frames, dryRun}) => {
  await syncVideoToPublic(slug);
  const props = await buildProps(slug);
  const output = path.join(videoDirectory(slug), "renders", `${slug}.mp4`);
  const args = ["remotion", "render", "src/index.ts", "ExplainerVideo", output, "--props", props, "--codec=h264", "--audio-codec=aac", `--scale=${scale}`];
  if (frames) args.push(`--frames=${frames}`);
  await run("npx", args, {cwd: projectRoot, dryRun});
});
slugOption(program.command("package")).action(async ({slug}) => console.log(await packageVideo(slug)));

slugOption(program.command("pipeline")).option("--force").option("--dry-run").option("--skip-render").action(async ({slug, force, dryRun, skipRender}) => {
  const statePath = path.join(videoDirectory(slug), ".pipeline-state.json");
  const state = await exists(statePath) ? await readJson<Record<string, {completedAt: string}>>(statePath) : {};
  const execute = async (name: string, task: () => Promise<unknown>) => {
    if (state[name] && !force) { console.log(`[skip] ${name} already completed`); return; }
    console.log(`[stage] ${name}`);
    if (!dryRun) { await task(); state[name] = {completedAt: new Date().toISOString()}; await writeJson(statePath, state); }
  };
  await execute("validate", () => validateVideo(slug));
  await execute("voice", () => generateVoice(slug, undefined, force));
  await execute("captions", () => buildCaptions(slug));
  await execute("storyboard", () => buildStoryboard(slug));
  await execute("stitch", () => stitchVoice(slug));
  await execute("sync", () => syncVideoToPublic(slug));
  await execute("qa", () => runQa(slug, true));
  if (!skipRender) await execute("render", async () => {
    const props = await buildProps(slug);
    await run("npx", ["remotion", "render", "src/index.ts", "ExplainerVideo", path.join(videoDirectory(slug), "renders", `${slug}.mp4`), "--props", props, "--codec=h264", "--audio-codec=aac"], {cwd: projectRoot});
  });
  await execute("package", () => packageVideo(slug));
});

program.parseAsync().catch((error) => {console.error(error instanceof Error ? error.message : error); process.exitCode = 1;});
