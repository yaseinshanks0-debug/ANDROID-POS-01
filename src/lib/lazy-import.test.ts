/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isDynamicImportError,
  importWithRetry,
  tryGuardedChunkReload,
} from './lazy-import.ts';

function createMemoryStorage(): Pick<Storage, 'getItem' | 'setItem'> {
  const map = new Map<string, string>();
  return {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => {
      map.set(key, value);
    },
  };
}

test('isDynamicImportError accurately identifies dynamic import and chunk load failures', () => {
  assert.equal(
    isDynamicImportError(
      new TypeError(
        'Failed to fetch dynamically imported module: https://example.app/src/components/settings/SettingsView.tsx'
      )
    ),
    true
  );
  assert.equal(isDynamicImportError(new Error('504 (Outdated Optimize Dep)')), true);
  assert.equal(isDynamicImportError(new Error('Importing a module script failed.')), true);
  assert.equal(isDynamicImportError(new Error('Loading chunk 12 failed')), true);

  // Regular runtime errors should not be classified as dynamic import errors
  assert.equal(isDynamicImportError(new Error('Cannot read properties of undefined')), false);
  assert.equal(isDynamicImportError(null), false);
});

test('importWithRetry recovers when a transient dynamic import failure succeeds on retry', async () => {
  let attempts = 0;
  const delays: number[] = [];

  const mod = await importWithRetry(
    async () => {
      attempts += 1;
      if (attempts < 3) {
        throw new TypeError(
          'Failed to fetch dynamically imported module: /src/components/settings/SettingsView.tsx'
        );
      }
      return { default: 'SettingsViewComponent' };
    },
    {
      retries: 2,
      baseDelayMs: 50,
      sleep: async (ms) => {
        delays.push(ms);
      },
      reloadOnStaleChunk: false,
    }
  );

  assert.equal(attempts, 3);
  assert.deepEqual(delays, [50, 100]);
  assert.deepEqual(mod, { default: 'SettingsViewComponent' });
});

test('importWithRetry does not retry non-import runtime errors', async () => {
  let attempts = 0;

  await assert.rejects(
    async () => {
      await importWithRetry(
        async () => {
          attempts += 1;
          throw new ReferenceError('Unexpected syntax/runtime bug');
        },
        {
          retries: 3,
          baseDelayMs: 10,
          sleep: async () => {},
          reloadOnStaleChunk: false,
        }
      );
    },
    /Unexpected syntax\/runtime bug/
  );

  assert.equal(attempts, 1);
});

test('tryGuardedChunkReload reloads once and suppresses repeat reloads within cooldown', () => {
  const storage = createMemoryStorage();
  let reloadCount = 0;
  let currentTime = 1_000_000;

  const first = tryGuardedChunkReload({
    storage,
    reload: () => {
      reloadCount += 1;
    },
    now: () => currentTime,
    reloadCooldownMs: 15_000,
  });
  assert.equal(first, true);
  assert.equal(reloadCount, 1);

  // Within cooldown (5 seconds later) -> suppressed to prevent reload loop
  currentTime += 5_000;
  const second = tryGuardedChunkReload({
    storage,
    reload: () => {
      reloadCount += 1;
    },
    now: () => currentTime,
    reloadCooldownMs: 15_000,
  });
  assert.equal(second, false);
  assert.equal(reloadCount, 1);

  // After cooldown (20 seconds later) -> allowed again
  currentTime += 20_000;
  const third = tryGuardedChunkReload({
    storage,
    reload: () => {
      reloadCount += 1;
    },
    now: () => currentTime,
    reloadCooldownMs: 15_000,
  });
  assert.equal(third, true);
  assert.equal(reloadCount, 2);
});
