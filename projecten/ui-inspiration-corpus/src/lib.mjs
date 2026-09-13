import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const DATA_FILE = fileURLToPath(new URL('../data/sources.json', import.meta.url));

const requiredFields = [
  'id',
  'name',
  'url',
  'classification',
  'license',
  'categories',
  'provides',
  'acquisition',
  'confidence',
  'last_verified'
];

export async function readSources(file = DATA_FILE) {
  const parsed = JSON.parse(await readFile(file, 'utf8'));
  if (!Array.isArray(parsed)) {
    throw new Error(`Expected an array in ${file}`);
  }
  return parsed;
}

export async function writeSources(sources, file = DATA_FILE) {
  await writeFile(file, `${JSON.stringify(sources, null, 2)}\n`, 'utf8');
}

export function validateSource(source, index = 0) {
  const errors = [];
  const label = source?.id || `record ${index + 1}`;

  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    return [`${label}: record must be an object`];
  }

  for (const field of requiredFields) {
    if (source[field] === undefined || source[field] === null || source[field] === '') {
      errors.push(`${label}: missing ${field}`);
    }
  }

  if (source.id && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(source.id)) {
    errors.push(`${label}: id must use lowercase kebab-case`);
  }

  if (source.url) {
    try {
      const url = new URL(source.url);
      if (!['http:', 'https:'].includes(url.protocol)) {
        errors.push(`${label}: url must use http or https`);
      }
    } catch {
      errors.push(`${label}: url is not valid`);
    }
  }

  if (source.classification && !['A', 'B', 'C', 'D'].includes(source.classification)) {
    errors.push(`${label}: classification must be A, B, C, or D`);
  }

  for (const field of ['categories', 'provides', 'examples', 'limitations']) {
    if (source[field] !== undefined && !Array.isArray(source[field])) {
      errors.push(`${label}: ${field} must be an array`);
    }
  }

  if (source.confidence && !['high', 'medium', 'low'].includes(source.confidence)) {
    errors.push(`${label}: confidence must be high, medium, or low`);
  }

  if (source.content_pull !== undefined) {
    if (!source.content_pull || typeof source.content_pull !== 'object' || Array.isArray(source.content_pull)) {
      errors.push(`${label}: content_pull must be an object`);
    } else {
      if (source.content_pull.permission !== 'explicit') errors.push(`${label}: content_pull.permission must be explicit`);
      if (!['github_raw', 'html_snapshot'].includes(source.content_pull.mode)) errors.push(`${label}: content_pull.mode is unsupported`);
      if (source.content_pull.files !== undefined && (!Array.isArray(source.content_pull.files) || source.content_pull.files.some((file) => typeof file !== 'string'))) {
        errors.push(`${label}: content_pull.files must be an array of strings`);
      }
      if (source.content_pull.url) {
        try {
          const pullUrl = new URL(source.content_pull.url);
          if (!['http:', 'https:'].includes(pullUrl.protocol)) errors.push(`${label}: content_pull.url must use http or https`);
        } catch {
          errors.push(`${label}: content_pull.url is not valid`);
        }
      }
    }
  }

  if (source.last_verified && !/^\d{4}-\d{2}-\d{2}$/.test(source.last_verified)) {
    errors.push(`${label}: last_verified must use YYYY-MM-DD`);
  }

  return errors;
}

export function validateSources(sources) {
  const errors = [];
  const ids = new Set();

  sources.forEach((source, index) => {
    errors.push(...validateSource(source, index));
    if (source?.id) {
      if (ids.has(source.id)) errors.push(`${source.id}: duplicate id`);
      ids.add(source.id);
    }
  });

  return errors;
}

export function filterSources(sources, { query = '', classification = '', category = '' } = {}) {
  const normalizedQuery = query.trim().toLowerCase();
  return sources
    .filter((source) => !classification || source.classification === classification)
    .filter((source) => !category || source.categories.includes(category))
    .filter((source) => {
      if (!normalizedQuery) return true;
      const haystack = [
        source.name,
        source.description,
        source.license,
        source.attribution,
        source.scraping_api,
        source.acquisition,
        source.notes,
        ...(source.categories || []),
        ...(source.provides || []),
        ...(source.examples || []),
        ...(source.limitations || [])
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    })
    .sort((left, right) => (left.rank ?? 999) - (right.rank ?? 999) || left.name.localeCompare(right.name));
}

export function summarizeSources(sources) {
  const byClassification = Object.fromEntries(['A', 'B', 'C', 'D'].map((key) => [key, 0]));
  const categories = new Set();
  for (const source of sources) {
    byClassification[source.classification] = (byClassification[source.classification] || 0) + 1;
    for (const category of source.categories || []) categories.add(category);
  }
  return {
    total: sources.length,
    byClassification,
    categories: [...categories].sort()
  };
}

export function toPublicSource(source) {
  return {
    ...source,
    limitations: source.limitations || [],
    examples: source.examples || [],
    pull_command: source.classification === 'A' && source.source_type === 'official_repository'
      ? `ui-corpus pull ${source.id}`
      : null
  };
}

export function relativeProjectPath(file) {
  return path.relative(path.dirname(DATA_FILE), file) || path.basename(file);
}
