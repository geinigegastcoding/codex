import path from "node:path";
import {fileURLToPath} from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
export const projectRoot = path.resolve(scriptDirectory, "../..");
export const contentRoot = path.join(projectRoot, "content", "videos");
export const researchRoot = path.join(projectRoot, "research");
export const cacheRoot = path.join(projectRoot, ".cache");

export const videoDirectory = (slug: string) => path.join(contentRoot, slug);
export const publicVideoDirectory = (slug: string) => path.join(projectRoot, "public", "videos", slug);
