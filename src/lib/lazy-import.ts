/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, type LazyExoticComponent } from 'react';

const DYNAMIC_IMPORT_ERROR_PATTERNS = [
  /failed to fetch dynamically imported module/i,
  /importing a module script failed/i,
  /error loading dynamically imported module/i,
  /loading chunk [\w-]+ failed/i,
  /outdated optimize dep/i,
  /unable to preload css/i,
];

const RELOAD_GUARD_STORAGE_KEY = 'dqnamo_lazy_import_last_reload_at';
const DEFAULT_RELOAD_COOLDOWN_MS = 15_000;

export interface ImportRetryOptions {
  retries?: number;
  baseDelayMs?: number;
  reloadOnStaleChunk?: boolean;
  reloadCooldownMs?: number;
  sleep?: (ms: number) => Promise<void>;
  storage?: Pick<Storage, 'getItem' | 'setItem'> | null;
  reload?: () => void;
  now?: () => number;
}

/**
 * Identifies transient network, stale chunk, or Vite dev-server dep-reoptimization
 * failures thrown by ES dynamic `import()`.
 */
export function isDynamicImportError(error: unknown): boolean {
  if (!error) return false;
  const message =
    error instanceof Error
      ? `${error.name}: ${error.message}`
      : typeof error === 'string'
      ? error
      : typeof error === 'object' && 'message' in error && typeof error.message === 'string'
      ? error.message
      : String(error);

  return DYNAMIC_IMPORT_ERROR_PATTERNS.some((pattern) => pattern.test(message));
}

function defaultSleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getSafeSessionStorage(): Pick<Storage, 'getItem' | 'setItem'> | null {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return window.sessionStorage;
    }
  } catch {
    // Ignore restricted storage environments (private mode / sandboxed iframes)
  }
  return null;
}

/**
 * Triggers at most one page reload within the cooldown window to recover from stale
 * Vite optimized dependency hashes or newly deployed production chunk hashes without
 * ever causing an infinite reload loop.
 */
export function tryGuardedChunkReload(options?: {
  storage?: Pick<Storage, 'getItem' | 'setItem'> | null;
  reload?: () => void;
  now?: () => number;
  reloadCooldownMs?: number;
}): boolean {
  const storage = options?.storage !== undefined ? options.storage : getSafeSessionStorage();
  const now = options?.now ? options.now() : Date.now();
  const cooldownMs = options?.reloadCooldownMs ?? DEFAULT_RELOAD_COOLDOWN_MS;
  const reloadFn =
    options?.reload ??
    (typeof window !== 'undefined' ? () => window.location.reload() : null);

  if (!reloadFn) return false;

  try {
    const rawLast = storage?.getItem(RELOAD_GUARD_STORAGE_KEY);
    const lastReloadAt = rawLast ? Number.parseInt(rawLast, 10) : 0;
    if (Number.isFinite(lastReloadAt) && lastReloadAt > 0 && now - lastReloadAt < cooldownMs) {
      return false;
    }
    storage?.setItem(RELOAD_GUARD_STORAGE_KEY, String(now));
  } catch {
    return false;
  }

  reloadFn();
  return true;
}

/**
 * Executes a dynamic module importer with bounded retries for transient fetch/dev-server
 * errors, falling back to a single guarded reload if the chunk hash is stale.
 */
export async function importWithRetry<T>(
  importer: () => Promise<T>,
  options: ImportRetryOptions = {}
): Promise<T> {
  const retries = Math.max(0, options.retries ?? 2);
  const baseDelayMs = Math.max(0, options.baseDelayMs ?? 300);
  const sleep = options.sleep ?? defaultSleep;
  const reloadOnStaleChunk = options.reloadOnStaleChunk ?? true;

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await importer();
    } catch (error: unknown) {
      lastError = error;
      if (!isDynamicImportError(error)) {
        throw error;
      }

      if (attempt < retries) {
        const delayMs = baseDelayMs * (attempt + 1);
        if (delayMs > 0) {
          await sleep(delayMs);
        }
        continue;
      }

      if (reloadOnStaleChunk) {
        const reloaded = tryGuardedChunkReload({
          storage: options.storage,
          reload: options.reload,
          now: options.now,
          reloadCooldownMs: options.reloadCooldownMs,
        });
        if (reloaded) {
          // Wait briefly for navigation/reload; if reload is blocked by an iframe, surface error to ErrorBoundary
          await sleep(2500);
        }
      }

      throw error;
    }
  }

  throw lastError;
}

type LazyComponentConstraint =
  Parameters<typeof lazy>[0] extends () => Promise<{ default: infer C }> ? C : never;

/**
 * Drop-in replacement for React.lazy() that retries transient dynamic import failures
 * (e.g., Vite 504 Outdated Optimize Dep or dev-server restarts) before surfacing an error
 * to the surrounding ViewErrorBoundary.
 */
export function lazyWithRetry<T extends LazyComponentConstraint>(
  importer: () => Promise<{ default: T }>,
  options?: ImportRetryOptions
): LazyExoticComponent<T> {
  return lazy(() => importWithRetry(importer, options));
}
