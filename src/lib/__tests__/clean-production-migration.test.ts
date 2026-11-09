import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CLEAN_PRODUCTION_MIGRATION_KEY,
  STORAGE_KEYS,
  ensureCleanProductionMigration,
  resetCleanProductionMigrationSessionGuard,
} from '../../context/pos-storage-helpers';

class MockLocalStorage {
  private store = new Map<string, string>();
  public getItemCalls = 0;
  public removeItemCalls = 0;

  get length(): number {
    return this.store.size;
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }

  getItem(key: string): string | null {
    this.getItemCalls += 1;
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }

  removeItem(key: string): void {
    this.removeItemCalls += 1;
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

test('ensureCleanProductionMigration runs once and skips localStorage access on subsequent invocations', () => {
  const mockStorage = new MockLocalStorage();
  (globalThis as any).localStorage = mockStorage;
  resetCleanProductionMigrationSessionGuard();

  mockStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify([{ id: 'prod-1' }]));
  mockStorage.setItem(
    STORAGE_KEYS.COMPANIES,
    JSON.stringify([
      { id: 'comp-default', isDemoPractice: false },
      { id: 'comp-real-1', isDemoPractice: false },
    ])
  );

  // First call performs the migration
  const firstRun = ensureCleanProductionMigration();
  assert.equal(firstRun, true);
  assert.equal(mockStorage.getItem(CLEAN_PRODUCTION_MIGRATION_KEY), 'true');
  assert.equal(mockStorage.getItem(STORAGE_KEYS.PRODUCTS), null);

  const callsAfterFirstRun = mockStorage.getItemCalls;
  const removalsAfterFirstRun = mockStorage.removeItemCalls;

  // Subsequent calls (e.g., if ever triggered again) are short-circuited in memory without touching localStorage
  const secondRun = ensureCleanProductionMigration();
  const thirdRun = ensureCleanProductionMigration();
  assert.equal(secondRun, false);
  assert.equal(thirdRun, false);
  assert.equal(mockStorage.getItemCalls, callsAfterFirstRun);
  assert.equal(mockStorage.removeItemCalls, removalsAfterFirstRun);
});
