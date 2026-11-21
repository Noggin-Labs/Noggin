export type StorageProvider = () => Pick<Storage, "getItem" | "setItem">;

const browserStorage: StorageProvider = () => window.localStorage;

/**
 * Reads a JSON value from browser storage only when it passes the caller's
 * runtime validator. Invalid, missing, or inaccessible data uses the fallback.
 */
export function readStoredValue<T>(
  key: string,
  fallback: T,
  isValid: (value: unknown) => value is T,
  getStorage: StorageProvider = browserStorage
): T {
  try {
    const raw = getStorage().getItem(key);
    if (raw === null) return fallback;

    const parsed: unknown = JSON.parse(raw);
    return isValid(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Persists JSON data and reports whether the browser accepted the write.
 * Storage can be unavailable or full; callers should remain usable either way.
 */
export function writeStoredValue(
  key: string,
  value: unknown,
  getStorage: StorageProvider = browserStorage
): boolean {
  try {
    getStorage().setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
