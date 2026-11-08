import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeLanHostUrl, encodeCode128B } from '../lan-sync-client';
import { mergeCompanyLiveSnapshot, CompanyLiveSyncState } from '../../server/lan-sync.service';
import {
  mergeAndDeduplicateCategories,
  filterCategoriesByQuery,
} from '../inventory-rules';
import {
  buildStoreNotificationsList,
  computeNotificationSummaryCounts,
} from '../notifications-center';

describe('Live Wi-Fi LAN Sync (Windows <-> Android)', () => {
  it('normalizes bare Wi-Fi IPv4 addresses, ports, DQSYNC prefixes, and JSON URLs accurately', () => {
    assert.equal(normalizeLanHostUrl('192.168.1.50'), 'http://192.168.1.50:3000');
    assert.equal(normalizeLanHostUrl('192.168.1.50:3000'), 'http://192.168.1.50:3000');
    assert.equal(normalizeLanHostUrl('DQSYNC|192.168.43.1:3000'), 'http://192.168.43.1:3000');
    assert.equal(
      normalizeLanHostUrl('http://192.168.137.1:3000/api/lan-sync/info'),
      'http://192.168.137.1:3000'
    );
    assert.equal(
      normalizeLanHostUrl('{"hostUrl":"http://10.0.0.12:3000"}'),
      'http://10.0.0.12:3000'
    );
  });

  it('encodes pairing IP:Port into a valid Code-128B bit string', () => {
    const bits = encodeCode128B('192.168.1.100:3000');
    assert.ok(bits.length > 100);
    assert.match(bits, /^[01]+$/);
    // Code-128B Start Code 104 starts with 11010010000
    assert.ok(bits.startsWith('11010010000'));
    // Stop pattern ends with 1100011101011
    assert.ok(bits.endsWith('1100011101011'));
  });

  it('merges bidirectional Windows and Android snapshots without data loss or resurrection of deleted items', () => {
    const initialWindowsState: CompanyLiveSyncState = {
      companyId: 'comp-1',
      revision: 1,
      updatedAt: '2026-03-01T10:00:00.000Z',
      lastUpdatedByDeviceId: 'win-1',
      lastUpdatedByDeviceName: 'Windows Laptop POS',
      products: [
        {
          id: 'prod-1',
          name: 'Espresso Beans',
          price: 1000,
          stock: 20,
          updatedAt: '2026-03-01T10:00:00.000Z',
        },
        {
          id: 'prod-to-delete',
          name: 'Old Item',
          price: 500,
          stock: 5,
          updatedAt: '2026-03-01T09:00:00.000Z',
        },
      ],
      deletedProductIds: [],
      transactions: [
        {
          id: 'tx-win-1',
          grandTotal: 1000,
          amountPaid: 1000,
          status: 'completed',
          timestamp: '2026-03-01T10:00:00.000Z',
        },
      ],
      customers: [{ id: 'cust-1', name: 'Ahmed', totalDebt: 0 }],
      deletedCustomerIds: [],
      stockMovements: [],
      unmetDemandRequests: [],
      currencies: [{ code: 'SDG', isBase: true }],
      exchangeRates: { SDG: 1, USD: 2500 },
      exchangeRateItems: [],
      exchangeRateHistory: [],
      branches: [],
      users: [],
      activeSessions: [],
      categories: [{ id: 'cat-1', name: 'Coffee' }],
    };

    // Android performs a new sale, updates prod-1 stock to 18, adds prod-2, and deletes prod-to-delete
    const mergedAfterAndroidAction = mergeCompanyLiveSnapshot(
      initialWindowsState,
      {
        products: [
          {
            id: 'prod-1',
            name: 'Espresso Beans',
            price: 1000,
            stock: 18,
            updatedAt: '2026-03-01T10:05:00.000Z',
          },
          {
            id: 'prod-2',
            name: 'Cardamom Tea',
            price: 800,
            stock: 50,
            updatedAt: '2026-03-01T10:05:00.000Z',
          },
        ],
        deletedProductIds: ['prod-to-delete'],
        transactions: [
          {
            id: 'tx-and-1',
            grandTotal: 2000,
            amountPaid: 2000,
            status: 'completed',
            timestamp: '2026-03-01T10:05:00.000Z',
          },
        ],
        exchangeRates: { USD: 2600 },
        categories: [{ id: 'cat-2', name: 'Tea' }],
      },
      {
        deviceId: 'and-1',
        deviceName: 'Android Handheld POS',
      }
    );

    assert.equal(mergedAfterAndroidAction.revision, 2);
    assert.equal(mergedAfterAndroidAction.lastUpdatedByDeviceId, 'and-1');
    assert.equal(mergedAfterAndroidAction.products.length, 2);
    const prod1 = mergedAfterAndroidAction.products.find((p) => p.id === 'prod-1');
    assert.equal(prod1?.stock, 18);
    assert.ok(!mergedAfterAndroidAction.products.some((p) => p.id === 'prod-to-delete'));
    assert.equal(mergedAfterAndroidAction.transactions.length, 2);
    assert.equal(mergedAfterAndroidAction.exchangeRates.USD, 2600);
    assert.equal(mergedAfterAndroidAction.categories.length, 2);

    // Now test stale snapshot protection: if an older snapshot from Windows arrives with prod-1 at 10:00:00 (stock: 20),
    // it must NOT overwrite the newer 10:05:00 (stock: 18) state!
    const mergedAfterStalePush = mergeCompanyLiveSnapshot(
      mergedAfterAndroidAction,
      {
        products: [
          {
            id: 'prod-1',
            name: 'Espresso Beans',
            price: 1000,
            stock: 20,
            updatedAt: '2026-03-01T10:00:00.000Z',
          },
        ],
      },
      {
        deviceId: 'win-1',
        deviceName: 'Windows Laptop POS',
      }
    );
    const prod1AfterStale = mergedAfterStalePush.products.find((p) => p.id === 'prod-1');
    assert.equal(prod1AfterStale?.stock, 18);
  });

  it('supports searchable categories by any letter and deduplicates Arabic/English categories', () => {
    const merged = mergeAndDeduplicateCategories(
      ['مشروبات ساخنة', 'مخبوزات طازجة', 'قهوة مختصة'],
      ['قهوة مختصة', 'حلويات شرقية']
    );
    assert.equal(merged.length, 4);
    const filteredByLetter = filterCategoriesByQuery(merged, 'خ');
    assert.deepEqual(filteredByLetter, ['مخبوزات طازجة', 'قهوة مختصة', 'مشروبات ساخنة']);
  });

  it('builds actionable smart notifications for low stock and overdue debts in Bell center', () => {
    const list = buildStoreNotificationsList({
      products: [
        {
          id: 'p-low',
          name: 'Arabic Gum',
          nameAr: 'صمغ عربي',
          sku: 'SKU-1',
          barcode: '111',
          category: 'General',
          costPrice: 100,
          sellingPrice: 150,
          stock: 2,
          minStockAlert: 10,
          updatedAt: new Date().toISOString(),
        },
      ],
      transactions: [],
      customers: [],
      unmetDemandRequests: [],
      lifecycleMap: {},
    });
    const counts = computeNotificationSummaryCounts(list);
    assert.ok(counts.total >= 1);
    assert.ok(counts.active >= 1);
  });
});
