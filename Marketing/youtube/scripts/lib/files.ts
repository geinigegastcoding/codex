import {mkdir, readFile, rename, rm, stat, writeFile} from "node:fs/promises";
import path from "node:path";
import {z} from "zod";

export const ensureDirectory = async (directory: string) => mkdir(directory, {recursive: true});

export const readJson = async <T>(filePath: string, schema?: z.ZodType<T>): Promise<T> => {
  const value: unknown = JSON.parse(await readFile(filePath, "utf8"));
  return schema ? schema.parse(value) : value as T;
};

export const writeJson = async (filePath: string, value: unknown) => {
  await ensureDirectory(path.dirname(filePath));
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
};

export const atomicWrite = async (filePath: string, data: Uint8Array | string) => {
  await ensureDirectory(path.dirname(filePath));
  const temporary = `${filePath}.tmp-${process.pid}`;
  await writeFile(temporary, data);
  await rename(temporary, filePath);
};

export const exists = async (filePath: string) => {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
};

export const removeIfExists = async (filePath: string) => {
  if (await exists(filePath)) await rm(filePath, {recursive: true, force: true});
};
