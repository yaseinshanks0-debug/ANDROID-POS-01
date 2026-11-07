/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildStoreNotificationsList,
  computeNotificationSummaryCounts,
  saveNotificationLifecycleStatus,
  loadNotificationLifecycleMap,
} from './notifications-center';
import { Product, Transaction, Customer } from './types';

function createMemoryStorage() {
  const map = new Map<string, string>();
  return {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, val: string) => {
      map.set(key, val);
    },
  };
}

test('buildStoreNotificationsList aggregates stockout, low stock, expiry, unmet demand, and debt alerts', () => {
  const nowMs = new Date('2026-11-07T10:00:00Z').getTime();
  const products: Product[] = [
    {
      id: 'p1',
      name: 'Out of Stock Milk',
      nameAr: 'حليب نافد',
      sku: '6281001',
      barcode: '6281001',
      category: 'Dairy',
      costPrice: 1000,
      sellingPrice: 1500,
      stock: 0,
      minStockAlert: 5,
      expiryDate: '2026-10-01', // expired
      updatedAt: '2026-11-07T08:00:00Z',
    },
    {
      id: 'p2',
      name: 'Low Stock Coffee',
      nameAr: 'قهوة منخفضة',
      sku: '6281002',
      barcode: '6281002',
      category: 'Beverages',
      costPrice: 2000,
      sellingPrice: 3000,
      stock: 3,
      minStockAlert: 5,
      expiryDate: '2026-11-20', // expiring within 30 days
      updatedAt: '2026-11-07T09:00:00Z',
    },
  ];

  const transactions: Transaction[] = [
    {
      id: 'TX-101',
      idempotencyKey: 'idem-tx-101',
      timestamp: '2026-11-07T09:30:00Z',
      items: [],
      subtotal: 5000,
      discountAmount: 0,
      taxRatePercent: 0,
      taxAmount: 0,
      grandTotal: 5000,
      amountTendered: 2000,
      amountPaid: 2000,
      debtAmount: 3000,
      changeDue: 0,
      paymentMethod: 'cash',
      status: 'completed',
      syncStatus: 'synced',
      cashierName: 'Cashier 1',
    },
  ];

  const customers: Customer[] = [];

  const notifications = buildStoreNotificationsList({
    products,
    transactions,
    customers,
    unmetDemandRequests: [
      {
        id: 'u1',
        idempotencyKey: 'idem-u1',
        dedupeFingerprint: 'fp-u1',
        productId: null,
        isRegisteredProduct: false,
        productNameSnapshot: 'كريم باريس',
        productNameArSnapshot: 'كريم باريس',
        skuSnapshot: null,
        barcode: null,
        categorySnapshot: 'Cosmetics',
        branchId: 'b1',
        requestedTimestamp: '2026-11-07T07:00:00Z',
        requestedQuantity: 2,
        saleUnitMode: 'unit',
        requestedBaseUnits: 2,
        availableStockAtRequest: 0,
        availabilityStatus: 'UNREGISTERED',
        unavailabilityReason: 'NOT_STOCKED',
        confirmedPurchaseIntent: true,
        fulfillmentStatus: 'unfulfilled',
        customerId: null,
        customerReference: null,
        unitSellingPriceSnapshot: null,
        currencySnapshot: 'SDG',
        notes: null,
        sourceScreen: 'checkout',
        recordedByUserId: 'u1',
        recordedByName: 'Admin',
        createdAt: '2026-11-07T07:00:00Z',
      },
      {
        id: 'u2',
        idempotencyKey: 'idem-u2',
        dedupeFingerprint: 'fp-u2',
        productId: null,
        isRegisteredProduct: false,
        productNameSnapshot: 'كريم باريس',
        productNameArSnapshot: 'كريم باريس',
        skuSnapshot: null,
        barcode: null,
        categorySnapshot: 'Cosmetics',
        branchId: 'b1',
        requestedTimestamp: '2026-11-07T08:30:00Z',
        requestedQuantity: 1,
        saleUnitMode: 'unit',
        requestedBaseUnits: 1,
        availableStockAtRequest: 0,
        availabilityStatus: 'UNREGISTERED',
        unavailabilityReason: 'NOT_STOCKED',
        confirmedPurchaseIntent: true,
        fulfillmentStatus: 'unfulfilled',
        customerId: null,
        customerReference: null,
        unitSellingPriceSnapshot: null,
        currencySnapshot: 'SDG',
        notes: null,
        sourceScreen: 'checkout',
        recordedByUserId: 'u1',
        recordedByName: 'Admin',
        createdAt: '2026-11-07T08:30:00Z',
      },
    ],
    nowMs,
  });

  // p1 out of stock + p1 expired + p2 low stock + p2 expiring soon + 1 unmet demand group + 1 open debt
  assert.equal(notifications.length, 6);
  const summary = computeNotificationSummaryCounts(notifications);
  assert.equal(summary.active, 6);
  assert.equal(summary.criticalActive, 2); // p1 out of stock + p1 expired
});

test('saveNotificationLifecycleStatus persists status and resolution note and updates counts', () => {
  const mem = createMemoryStorage();
  saveNotificationLifecycleStatus(
    ['stockout:p1'],
    'resolved',
    'تم طلب وتوريد 20 كرتونة من المورد',
    mem
  );

  const loaded = loadNotificationLifecycleMap(mem);
  assert.equal(loaded['stockout:p1']?.status, 'resolved');
  assert.equal(loaded['stockout:p1']?.note, 'تم طلب وتوريد 20 كرتونة من المورد');

  const list = buildStoreNotificationsList({
    products: [
      {
        id: 'p1',
        name: 'Milk',
        sku: '101',
        barcode: '101',
        category: 'Dairy',
        costPrice: 10,
        sellingPrice: 15,
        stock: 0,
        minStockAlert: 5,
        updatedAt: '2026-11-07T08:00:00Z',
      },
    ],
    transactions: [],
    customers: [],
    lifecycleMap: loaded,
  });

  assert.equal(list[0].status, 'resolved');
  assert.equal(list[0].resolutionNote, 'تم طلب وتوريد 20 كرتونة من المورد');
  const counts = computeNotificationSummaryCounts(list);
  assert.equal(counts.active, 0);
  assert.equal(counts.resolved, 1);
});
