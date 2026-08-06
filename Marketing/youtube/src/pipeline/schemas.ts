import {z} from "zod";

const localAsset = z.string().refine((value) => !/^https?:\/\//i.test(value), {
  message: "Render assets must be local paths, not remote URLs",
});

export const sourceSchema = z.object({
  url: z.string().url(),
  claim: z.string().trim().min(1),
});

export const visualSchema = z.discriminatedUnion("type", [
  z.object({type: z.literal("kinetic-text"), emphasis: z.array(z.string()).optional()}),
  z.object({
    type: z.literal("browser"),
    asset: localAsset,
    focus: z.object({x: z.number(), y: z.number()}).optional(),
  }),
  z.object({type: z.literal("screenshot"), asset: localAsset}),
  z.object({
    type: z.literal("screen-recording"),
    asset: localAsset,
    start: z.number().nonnegative().optional(),
    end: z.number().positive().optional(),
    crop: z.object({x: z.number(), y: z.number(), width: z.number(), height: z.number()}).optional(),
    focus: z.object({x: z.number(), y: z.number(), scale: z.number().positive()}).optional(),
  }),
  z.object({type: z.literal("code"), language: z.string(), code: z.string()}),
  z.object({type: z.literal("diagram"), template: z.string(), data: z.unknown()}),
  z.object({type: z.literal("comparison"), data: z.unknown()}),
  z.object({type: z.literal("broll"), asset: localAsset}),
]);

export const scriptSceneSchema = z.object({
  id: z.string().regex(/^[a-z0-9][a-z0-9-]*$/),
  section: z.string().min(1),
  narration: z.string().trim().min(1),
  onScreenText: z.string().optional(),
  visual: visualSchema,
  sources: z.array(sourceSchema).optional(),
  targetSeconds: z.number().positive().max(120).optional(),
  pronunciation: z.record(z.string()).optional(),
});

export const scriptSchema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9][a-z0-9-]*$/),
  template: z.enum(["tool-review", "ai-news", "technical-concept", "workflow-build", "model-comparison"]),
  targetDurationSeconds: z.number().min(30).max(720),
  scenes: z.array(scriptSceneSchema).min(1),
});

export const storyboardSceneSchema = z.object({
  sceneId: z.string(),
  startFrame: z.number().int().nonnegative(),
  durationInFrames: z.number().int().positive(),
  transitionFrames: z.number().int().nonnegative().default(0),
  audio: localAsset.optional(),
});

export const storyboardSchema = z.object({
  fps: z.number().int().positive(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  totalFrames: z.number().int().positive(),
  scenes: z.array(storyboardSceneSchema).min(1),
});

export const voiceConfigSchema = z.object({
  provider: z.literal("fish-audio"),
  model: z.enum(["s1", "s2-pro", "s2.1-pro", "s2.1-pro-free"]).default("s2.1-pro"),
  referenceId: z.string().optional(),
  format: z.enum(["wav", "mp3", "opus", "pcm"]).default("wav"),
  prosody: z.object({
    speed: z.number().min(0.5).max(2).default(1),
    volume: z.number().min(-20).max(20).default(0),
    normalize_loudness: z.boolean().default(true),
  }).default({speed: 1, volume: 0, normalize_loudness: true}),
  temperature: z.number().min(0).max(1).default(0.7),
  topP: z.number().min(0).max(1).default(0.7),
  pauseMs: z.number().int().min(0).max(3000).default(280),
  chunkSeconds: z.number().int().min(1).max(10).default(10),
  useTimestamps: z.boolean().default(true),
});

export const captionSchema = z.object({
  text: z.string(),
  startMs: z.number().nonnegative(),
  endMs: z.number().positive(),
  timestampMs: z.number().nullable(),
  confidence: z.number().min(0).max(1).nullable(),
  sceneId: z.string().optional(),
  words: z.array(z.object({text: z.string(), startMs: z.number(), endMs: z.number(), confidence: z.number().nullable()})).optional(),
});

export const captionsSchema = z.array(captionSchema);

export const metadataSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  chapters: z.array(z.object({time: z.string(), title: z.string()})),
  sources: z.array(sourceSchema),
  thumbnailBrief: z.string().min(20),
  thumbnailTitle: z.string().min(3).max(60).optional(),
  aiDisclosureRequired: z.boolean(),
  aiDisclosureReason: z.string(),
});

export type Script = z.infer<typeof scriptSchema>;
export type ScriptScene = z.infer<typeof scriptSceneSchema>;
export type Storyboard = z.infer<typeof storyboardSchema>;
export type VoiceConfig = z.infer<typeof voiceConfigSchema>;
export type CaptionData = z.infer<typeof captionSchema>;
export type Metadata = z.infer<typeof metadataSchema>;
