import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const CONTENT_DIR = fileURLToPath(new URL('../content', import.meta.url));

const MAX_FILE_BYTES = 2_000_000;
const LICENSE_CANDIDATES = ['LICENSE', 'LICENSE.md', 'LICENSE.txt', 'COPYING'];
const GITHUB_REPOSITORY = /^https:\/\/github\.com\/([^/]+)\/([^/#]+?)(?:\.git)?\/?$/i;

function repositoryFromUrl(value) {
  const match = value && new URL(value).toString().match(GITHUB_REPOSITORY);
  return match ? { owner: match[1], repository: match[2] } : null;
}

export function safeRelativePath(value) {
  const normalized = path.posix.normalize(String(value).replaceAll('\\', '/'));
  if (!normalized || normalized === '.' || normalized.startsWith('/') || normalized === '..' || normalized.startsWith('../') || normalized.includes('/../')) {
    throw new Error(`Unsafe content path: ${value}`);
  }
  return normalized;
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

async function fetchText(url, allowedOrigin) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'text/plain, text/html;q=0.9, */*;q=0.1',
        'User-Agent': 'ui-inspiration-corpus/0.1 (local license-aware importer)'
      },
      redirect: 'follow',
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
    if (new URL(response.url).origin !== allowedOrigin) {
      throw new Error(`Refusing cross-origin redirect for ${url}`);
    }
    const contentLength = Number(response.headers.get('content-length') || 0);
    if (contentLength > MAX_FILE_BYTES) throw new Error(`Remote file exceeds ${MAX_FILE_BYTES} bytes: ${url}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length > MAX_FILE_BYTES) throw new Error(`Remote file exceeds ${MAX_FILE_BYTES} bytes: ${url}`);
    return { buffer, finalUrl: response.url };
  } finally {
    clearTimeout(timeout);
  }
}

function githubPlan(source, requestedFiles) {
  const repository = repositoryFromUrl(source.content_url || source.url);
  if (!repository) return null;
  const ref = source.content_pull?.ref || 'HEAD';
  const files = requestedFiles.length ? requestedFiles : source.content_pull?.files || [];
  return {
    mode: 'github_raw',
    files,
    repository,
    ref,
    baseOrigin: 'https://raw.githubusercontent.com',
    urlFor(file) {
      const safeFile = safeRelativePath(file);
      const encodedPath = safeFile.split('/').map(encodeURIComponent).join('/');
      return `https://raw.githubusercontent.com/${encodeURIComponent(repository.owner)}/${encodeURIComponent(repository.repository)}/${encodeURIComponent(ref)}/${encodedPath}`;
    }
  };
}

function explicitPlan(source, requestedFiles) {
  const config = source.content_pull;
  if (!config || config.permission !== 'explicit') return null;
  if (config.mode === 'github_raw') return githubPlan(source, requestedFiles);
  if (config.mode === 'html_snapshot') {
    const pageUrl = new URL(config.url || source.url);
    return {
      mode: config.mode,
      files: [requestedFiles[0] || 'page.html'],
      baseOrigin: pageUrl.origin,
      urlFor() {
        return pageUrl.toString();
      }
    };
  }
  throw new Error(`Unsupported content_pull mode for ${source.id}: ${config.mode}`);
}

function pullPlan(source, requestedFiles) {
  if (['C', 'D'].includes(source.classification)) {
    throw new Error(`Pull blocked for ${source.id}: classification ${source.classification} is reference-only or automation-prohibited.`);
  }

  const explicit = explicitPlan(source, requestedFiles);
  if (explicit) return explicit;

  if (source.classification !== 'A' || source.source_type !== 'official_repository') {
    throw new Error(`No approved content pull plan for ${source.id}. Add explicit permission metadata before fetching it.`);
  }

  const plan = githubPlan(source, requestedFiles);
  if (!plan) throw new Error(`No GitHub repository URL found for ${source.id}; refusing generic website scraping.`);
  return plan;
}

export function canPullSource(source) {
  try {
    pullPlan(source, []);
    return true;
  } catch {
    return false;
  }
}

export async function pullSource(source, { outputDir = CONTENT_DIR, files = [] } = {}) {
  const plan = pullPlan(source, files);
  const automaticGithub = plan.mode === 'github_raw' && plan.files.length === 0;
  const requestedFiles = automaticGithub ? ['README.md'] : plan.files;
  const targetDir = path.join(outputDir, safeRelativePath(source.id));
  await mkdir(targetDir, { recursive: true });

  const artifacts = [];
  const failures = [];
  const download = async (file) => {
    const safeFile = safeRelativePath(file);
    try {
      const remoteUrl = plan.urlFor(safeFile);
      const { buffer, finalUrl } = await fetchText(remoteUrl, plan.baseOrigin);
      const target = path.join(targetDir, safeFile);
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, buffer);
      return {
        path: safeFile,
        source_url: finalUrl,
        bytes: buffer.length,
        sha256: sha256(buffer)
      };
    } catch (error) {
      return { error: `${safeFile}: ${error.message}` };
    }
  };

  for (const file of requestedFiles) {
    const result = await download(file);
    if (result.error) failures.push(result.error);
    else artifacts.push(result);
  }

  if (automaticGithub) {
    let license;
    const licenseFailures = [];
    for (const candidate of LICENSE_CANDIDATES) {
      const result = await download(candidate);
      if (!result.error) {
        license = result;
        break;
      }
      licenseFailures.push(result.error);
    }
    if (license) artifacts.push(license);
    else failures.push(`license: no standard license file found (${licenseFailures.join('; ')})`);
  }

  if (!artifacts.length || failures.length) {
    throw new Error(`Pull incomplete for ${source.id}.\n${failures.join('\n')}`);
  }

  const manifest = {
    source_id: source.id,
    source_name: source.name,
    source_url: source.url,
    license: source.license,
    license_url: source.license_url,
    terms_url: source.terms_url,
    attribution: source.attribution,
    classification: source.classification,
    mode: plan.mode,
    repository: plan.repository || null,
    ref: plan.ref || null,
    pulled_at: new Date().toISOString(),
    files: artifacts
  };
  await writeFile(path.join(targetDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  return { targetDir, manifest, warnings: failures };
}

export async function readPulledManifest(sourceId, contentDir = CONTENT_DIR) {
  const target = path.join(contentDir, safeRelativePath(sourceId), 'manifest.json');
  return JSON.parse(await readFile(target, 'utf8'));
}

export async function readPulledFile(sourceId, file, contentDir = CONTENT_DIR) {
  const safeFile = safeRelativePath(file);
  const manifest = await readPulledManifest(sourceId, contentDir);
  if (!manifest.files.some((item) => item.path === safeFile)) {
    throw new Error(`File is not listed in the pull manifest: ${safeFile}`);
  }
  const target = path.join(contentDir, safeRelativePath(sourceId), safeFile);
  return readFile(target, 'utf8');
}
