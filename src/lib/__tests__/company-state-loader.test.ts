import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  DEFAULT_COMPANY_PROFILE,
  PRACTICE_COMPANY_PROFILE,
  getCompanyStorageKey,
  loadCompanyOperationalState,
  STORAGE_KEYS,
} from '../../context/pos-storage-helpers.ts';

function installMockLocalStorage() {
  const store = new Map<string, string>();
  const mockStorage: Storage = {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, String(value));
    },
  };
  (globalThis as any).localStorage = mockStorage;
  return store;
}

test('Company operational state loader & currentCompanyId dependency (Problem #6)', async (t) => {
  await t.test('loadCompanyOperationalState loads isolated data per currentCompanyId when switching companies', () => {
    installMockLocalStorage();

    localStorage.setItem(
      getCompanyStorageKey(STORAGE_KEYS.PRODUCTS, 'comp-alpha'),
      JSON.stringify([
        {
          id: 'prod-alpha-1',
          name: 'Alpha Coffee',
          sku: 'ALP-001',
          barcode: '90001',
          costPrice: 10,
          sellingPrice: 15,
          category: 'Drinks',
          stock: 20,
          minStockAlert: 5,
          updatedAt: '2026-11-09T00:00:00.000Z',
        },
      ])
    );

    localStorage.setItem(
      getCompanyStorageKey(STORAGE_KEYS.PRODUCTS, 'comp-beta'),
      JSON.stringify([
        {
          id: 'prod-beta-1',
          name: 'Beta Tea',
          sku: 'BET-001',
          barcode: '90002',
          costPrice: 5,
          sellingPrice: 9,
          category: 'Drinks',
          stock: 40,
          minStockAlert: 5,
          updatedAt: '2026-11-09T00:00:00.000Z',
        },
      ])
    );

    const alphaData = loadCompanyOperationalState('comp-alpha');
    const betaData = loadCompanyOperationalState('comp-beta');

    assert.equal(alphaData.products.length, 1);
    assert.equal(alphaData.products[0].id, 'prod-alpha-1');

    assert.equal(betaData.products.length, 1);
    assert.equal(betaData.products[0].id, 'prod-beta-1');
  });

  await t.test('POSContext.tsx memoizes initialCompanyData with [currentCompanyId, workspaceMode] in dependency array', () => {
    const posContextSource = fs.readFileSync(
      path.resolve(process.cwd(), 'src/context/POSContext.tsx'),
      'utf-8'
    );

    assert.match(
      posContextSource,
      /const\s+initialCompanyData\s*=\s*useMemo\(\s*\(\)\s*=>\s*loadCompanyOperationalState\(currentCompanyId,\s*workspaceMode\),\s*\[currentCompanyId,\s*workspaceMode\]\s*\)/,
      'initialCompanyData useMemo must include currentCompanyId and workspaceMode in its dependency array'
    );
  });

  await t.test('Problem #10: loadCompanyOperationalState skips reading production localStorage when workspaceMode === "PRACTICE"', () => {
    installMockLocalStorage();
    let getItemCalls = 0;
    const origGetItem = localStorage.getItem.bind(localStorage);
    localStorage.getItem = (key: string) => {
      getItemCalls++;
      return origGetItem(key);
    };

    localStorage.setItem(
      getCompanyStorageKey(STORAGE_KEYS.PRODUCTS, 'comp-prod-heavy'),
      JSON.stringify([{ id: 'prod-custom-999', sku: 'CUSTOM-999', name: 'Prod Item' }])
    );

    const practiceResult = loadCompanyOperationalState('comp-prod-heavy', 'PRACTICE');
    assert.equal(
      getItemCalls,
      0,
      'Must perform 0 localStorage reads for production company keys when workspaceMode is PRACTICE'
    );
    assert.equal(practiceResult.products.length, 0);

    const prodResult = loadCompanyOperationalState('comp-prod-heavy', 'PRODUCTION');
    assert.ok(getItemCalls > 0, 'Must read production localStorage when workspaceMode is PRODUCTION');
    assert.equal(prodResult.products.length, 1);
  });

  await t.test('Problem #21: DEFAULT_COMPANY_PROFILE contains clean blank contact and tax fields while PRACTICE_COMPANY_PROFILE remains isolated for sandbox training', () => {
    assert.equal(DEFAULT_COMPANY_PROFILE.phone, '');
    assert.equal(DEFAULT_COMPANY_PROFILE.email, '');
    assert.equal(DEFAULT_COMPANY_PROFILE.taxNumber, '');
    assert.equal(DEFAULT_COMPANY_PROFILE.address, '');
    assert.equal(DEFAULT_COMPANY_PROFILE.legalName, '');
    assert.equal(DEFAULT_COMPANY_PROFILE.onboardingCompleted, false);
    assert.equal(DEFAULT_COMPANY_PROFILE.isDemoPractice, false);

    assert.equal(PRACTICE_COMPANY_PROFILE.isDemoPractice, true);
  });
});
