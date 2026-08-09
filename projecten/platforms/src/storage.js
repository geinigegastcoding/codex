import { parseProgress, serializeProgress } from './game-core.js';

export const PROGRESS_KEY = 'jungle-sprint-progress-v2';
export const LEGACY_PROGRESS_KEY = 'jungle-sprint-progress-v1';

const emptyProgress = () => parseProgress(null);

export function loadProgress(storage) {
  try {
    const current = storage?.getItem(PROGRESS_KEY);
    if (current !== null && current !== undefined) {
      return parseProgress(current);
    }
    const legacy = storage?.getItem(LEGACY_PROGRESS_KEY);
    const migrated = parseProgress(legacy);
    if (legacy !== null && legacy !== undefined) {
      storage?.setItem(PROGRESS_KEY, serializeProgress(migrated));
    }
    return migrated;
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(storage, progress) {
  try {
    storage?.setItem(PROGRESS_KEY, serializeProgress(progress));
  } catch {
    // Private browsing and locked-down embeds can reject localStorage writes.
  }
  return parseProgress(progress);
}

export function clearProgress(storage) {
  try {
    storage?.removeItem(PROGRESS_KEY);
    storage?.removeItem(LEGACY_PROGRESS_KEY);
  } catch {
    // Clearing progress is best effort when storage is unavailable.
  }
  return emptyProgress();
}
