import test from 'node:test';
import assert from 'node:assert/strict';
import {
  persistCompanyScopedSlice,
  persistStorageValue,
  getCompanyStorageKey,
  applyCrossTabStorageEvent,
  STORAGE_KEYS,
  PRACTICE_STORAGE_KEYS,
} from '../../context/pos-storage-helpers';

function createMockLocalStorage() {
  const store = new Map<string, string>();
  return {
    getItem(key: string): string | null {
      return store.has(key) ? store.get(key)! : null;
    },
    setItem(key: string, value: string): void {
      store.set(key, String(value));
    },
    removeItem(key: string): void {
      store.delete(key);
    },
    clear(): void {
      store.clear();
    },
    get length(): number {
      return store.size;
    },
    key(index: number): string | null {
      return Array.from(store.keys())[index] ?? null;
    },
  };
}

test('Problem #13 — persistCompanyScopedSlice and persistStorageValue unify localStorage persistence safely', async (t) => {
  await t.test('persistCompanyScopedSlice writes to practiceKey in PRACTICE mode without touching production keys', () => {
    const mockStorage = createMockLocalStorage();
    const originalWindow = (globalThis as unknown as { window?: unknown }).window;
    const originalLocalStorage = (globalThis as unknown as { localStorage?: unknown }).localStorage;

    try {
      (globalThis as unknown as { window: unknown }).window = globalThis;
      (globalThis as unknown as { localStorage: unknown }).localStorage = mockStorage;

      persistCompanyScopedSlice({
        value: [{ id: 'exp-1', amount: 150 }],
        workspaceMode: 'PRACTICE',
        currentCompanyId: 'comp-alpha',
        prodBaseKey: STORAGE_KEYS.EXPENSES,
        practiceKey: PRACTICE_STORAGE_KEYS.EXPENSES,
        mirrorGlobalProdKey: true,
      });

      assert.equal(
        mockStorage.getItem(PRACTICE_STORAGE_KEYS.EXPENSES),
        JSON.stringify([{ id: 'exp-1', amount: 150 }]),
      );
      assert.equal(mockStorage.getItem(STORAGE_KEYS.EXPENSES), null);
      assert.equal(
        mockStorage.getItem(getCompanyStorageKey(STORAGE_KEYS.EXPENSES, 'comp-alpha')),
        null,
      );
    } finally {
      (globalThis as unknown as { window?: unknown }).window = originalWindow;
      (globalThis as unknown as { localStorage?: unknown }).localStorage = originalLocalStorage;
    }
  });

  await t.test('persistCompanyScopedSlice writes company-scoped and optional global production key in PRODUCTION mode', () => {
    const mockStorage = createMockLocalStorage();
    const originalWindow = (globalThis as unknown as { window?: unknown }).window;
    const originalLocalStorage = (globalThis as unknown as { localStorage?: unknown }).localStorage;

    try {
      (globalThis as unknown as { window: unknown }).window = globalThis;
      (globalThis as unknown as { localStorage: unknown }).localStorage = mockStorage;

      persistCompanyScopedSlice({
        value: [{ id: 'cust-1', name: 'أحمد' }],
        workspaceMode: 'PRODUCTION',
        currentCompanyId: 'comp-alpha',
        prodBaseKey: STORAGE_KEYS.CUSTOMERS,
        practiceKey: PRACTICE_STORAGE_KEYS.CUSTOMERS,
        mirrorGlobalProdKey: true,
      });

      assert.equal(
        mockStorage.getItem(STORAGE_KEYS.CUSTOMERS),
        JSON.stringify([{ id: 'cust-1', name: 'أحمد' }]),
      );
      assert.equal(
        mockStorage.getItem(getCompanyStorageKey(STORAGE_KEYS.CUSTOMERS, 'comp-alpha')),
        JSON.stringify([{ id: 'cust-1', name: 'أحمد' }]),
      );

      // Without mirrorGlobalProdKey
      persistCompanyScopedSlice({
        value: [{ id: 'exp-2', amount: 75 }],
        workspaceMode: 'PRODUCTION',
        currentCompanyId: 'comp-beta',
        prodBaseKey: STORAGE_KEYS.EXPENSES,
        mirrorGlobalProdKey: false,
      });

      assert.equal(mockStorage.getItem(STORAGE_KEYS.EXPENSES), null);
      assert.equal(
        mockStorage.getItem(getCompanyStorageKey(STORAGE_KEYS.EXPENSES, 'comp-beta')),
        JSON.stringify([{ id: 'exp-2', amount: 75 }]),
      );
    } finally {
      (globalThis as unknown as { window?: unknown }).window = originalWindow;
      (globalThis as unknown as { localStorage?: unknown }).localStorage = originalLocalStorage;
    }
  });

  await t.test('persistStorageValue supports JSON, rawString, and enabled guard', () => {
    const mockStorage = createMockLocalStorage();
    const originalWindow = (globalThis as unknown as { window?: unknown }).window;
    const originalLocalStorage = (globalThis as unknown as { localStorage?: unknown }).localStorage;

    try {
      (globalThis as unknown as { window: unknown }).window = globalThis;
      (globalThis as unknown as { localStorage: unknown }).localStorage = mockStorage;

      persistStorageValue('pos_prod_v2_language', 'ar', { rawString: true });
      assert.equal(mockStorage.getItem('pos_prod_v2_language'), 'ar');

      persistStorageValue('pos_prod_v2_auto_print', true);
      assert.equal(mockStorage.getItem('pos_prod_v2_auto_print'), 'true');

      persistStorageValue('pos_prod_v2_disabled_key', { shouldNotWrite: true }, { enabled: false });
      assert.equal(mockStorage.getItem('pos_prod_v2_disabled_key'), null);
    } finally {
      (globalThis as unknown as { window?: unknown }).window = originalWindow;
      (globalThis as unknown as { localStorage?: unknown }).localStorage = originalLocalStorage;
    }
  });
});

test('Problem #17 — applyCrossTabStorageEvent synchronizes customers, expenses, stockMovements, and core slices across tabs', () => {
  let syncedCustomers: unknown[] = [];
  let syncedExpenses: unknown[] = [];
  let syncedMovements: unknown[] = [];
  let syncedProducts: unknown[] = [];

  const handlers = {
    setProducts: (next: unknown[]) => {
      syncedProducts = next;
    },
    setTransactions: () => {},
    setCustomers: (next: unknown[]) => {
      syncedCustomers = next;
    },
    setExpenses: (next: unknown[]) => {
      syncedExpenses = next;
    },
    setStockMovements: (next: unknown[]) => {
      syncedMovements = next;
    },
    setUsers: () => {},
    setActiveSessions: () => {},
    setUnmetDemandRequests: () => {},
  };

  // 1. Customers storage event updates customers slice in PRODUCTION mode
  const custHandled = applyCrossTabStorageEvent(
    {
      key: getCompanyStorageKey(STORAGE_KEYS.CUSTOMERS, 'comp-alpha'),
      newValue: JSON.stringify([{ id: 'c-101', name: 'محمد علي', phone: '0912300000' }]),
    },
    'PRODUCTION',
    'comp-alpha',
    handlers as any
  );
  assert.equal(custHandled, true);
  assert.equal(syncedCustomers.length, 1);
  assert.equal((syncedCustomers[0] as { id: string }).id, 'c-101');

  // 2. Expenses storage event updates expenses slice
  const expHandled = applyCrossTabStorageEvent(
    {
      key: getCompanyStorageKey(STORAGE_KEYS.EXPENSES, 'comp-alpha'),
      newValue: JSON.stringify([{ id: 'exp-55', title: 'إيجار المحل', amount: 50000 }]),
    },
    'PRODUCTION',
    'comp-alpha',
    handlers as any
  );
  assert.equal(expHandled, true);
  assert.equal(syncedExpenses.length, 1);

  // 3. Stock movements storage event updates stockMovements slice
  const movHandled = applyCrossTabStorageEvent(
    {
      key: getCompanyStorageKey(STORAGE_KEYS.MOVEMENTS, 'comp-alpha'),
      newValue: JSON.stringify([{ id: 'mov-1', quantityChange: 10 }]),
    },
    'PRODUCTION',
    'comp-alpha',
    handlers as any
  );
  assert.equal(movHandled, true);
  assert.equal(syncedMovements.length, 1);

  // 4. Ignored when in PRACTICE mode or for a different companyId
  const ignoredPractice = applyCrossTabStorageEvent(
    {
      key: getCompanyStorageKey(STORAGE_KEYS.PRODUCTS, 'comp-alpha'),
      newValue: JSON.stringify([{ id: 'prod-x' }]),
    },
    'PRACTICE',
    'comp-alpha',
    handlers as any
  );
  assert.equal(ignoredPractice, false);
  assert.equal(syncedProducts.length, 0);
});
