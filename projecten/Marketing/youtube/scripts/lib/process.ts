import {spawn} from "node:child_process";

export type RunOptions = {
  cwd?: string;
  dryRun?: boolean;
  quiet?: boolean;
};

const platformCommand = (command: string) => process.platform === "win32" && command === "npx" ? "npx.cmd" : command;

export const run = async (command: string, args: string[], options: RunOptions = {}) => {
  const executable = platformCommand(command);
  const printable = [executable, ...args].map((part) => (part.includes(" ") ? JSON.stringify(part) : part)).join(" ");
  if (!options.quiet) console.log(options.dryRun ? `[dry-run] ${printable}` : `$ ${printable}`);
  if (options.dryRun) return {stdout: "", stderr: "", code: 0};

  return await new Promise<{stdout: string; stderr: string; code: number}>((resolve, reject) => {
    const child = spawn(executable, args, {cwd: options.cwd, shell: false, windowsHide: true});
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk.toString(); });
    child.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
    child.on("error", reject);
    child.on("close", (code) => {
      const result = {stdout, stderr, code: code ?? 1};
      if (result.code !== 0) {
        reject(new Error(`${printable} failed (${result.code})\n${stderr || stdout}`));
        return;
      }
      resolve(result);
    });
  });
};
