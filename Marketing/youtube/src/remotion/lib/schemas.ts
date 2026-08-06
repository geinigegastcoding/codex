import {z} from "zod";
import {captionsSchema, scriptSchema, storyboardSchema} from "../../pipeline/schemas";

export const videoPropsSchema = z.object({
  script: scriptSchema,
  storyboard: storyboardSchema,
  captions: captionsSchema,
  audioEnabled: z.boolean().default(true),
  captionTheme: z.enum(["dark", "light", "minimal"]).default("dark"),
});

export type VideoProps = z.infer<typeof videoPropsSchema>;
