/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import zlib from 'node:zlib';
import { matchesProductSearchQuery, matchesProductBarcode } from './inventory-rules';
import { calculateCartTotals, computeDailyRevenueTrends } from './pos-calculations';
import { analyzeBackupMergePreview } from './backup-merge-engine';
import { Product, Transaction } from './types';

function generateSyntheticProducts(count: number): Product[] {
  const list: Product[] = [];
  const nowIso = new Date().toISOString();
  for (let i = 0; i < count; i++) {
    list.push({
      id: `perf-prod-${i}`,
      serialNumber: i + 1,
      name: `Premium Sudanese Sesame Oil Bottle ${i}`,
      nameAr: `زيت سمسم سوداني فاخر عبوة رقم ${i}`,
      sku: `SKU-PERF-${String(i).padStart(5, '0')}`,
      barcode: `6281000${String(i).padStart(6, '0')}`,
      barcodes: [`6281000${String(i).padStart(6, '0')}`, `ALT-${i}`],
      category: i % 3 === 0 ? 'Oils' : i % 3 === 1 ? 'Grains' : 'Beverages',
      costPrice: 1500 + (i % 500),
      sellingPrice: 2200 + (i % 700),
      priceCurrency: 'SDG',
      stock: 50,
      minStockAlert: 5,
      updatedAt: nowIso,
    });
  }
  return list;
}

function generateSyntheticTransactions(count: number): Transaction[] {
  const now = Date.now();
  const list: Transaction[] = [];
  for (let i = 0; i < count; i++) {
    const ts = new Date(now - (i % 30) * 86_400_000).toISOString();
    list.push({
      id: `TXN-PERF-${i}`,
      idempotencyKey: `idem-perf-${i}`,
      timestamp: ts,
      currency: i % 4 === 0 ? 'USD' : 'SDG',
      exchangeRateUsed: 2700,
      exchangeRatesSnapshot: { USD: 2700, SAR: 720, SDG: 1 },
      items: [
        {
          productId: `perf-prod-${i % 100}`,
          productName: `Product ${i % 100}`,
          sku: `SKU-${i % 100}`,
          quantity: 2,
          unitPrice: 2200,
          discountPercent: 0,
          total: 4400,
        },
      ],
      subtotal: 4400,
      taxRatePercent: 15,
      taxAmount: 660,
      discountAmount: 0,
      grandTotal: 5060,
      paymentMethod: 'cash',
      amountTendered: 5060,
      changeDue: 0,
      paymentStatus: 'paid',
      amountPaid: 5060,
      debtAmount: 0,
      customerName: 'Walk-in Customer',
      cashierName: 'Cashier 1',
      status: 'completed',
      syncStatus: 'synced',
    });
  }
  return list;
}

test('Benchmark 1: Tokenized Arabic/English search & O(1) index map over 2,000 products runs under 60ms', () => {
  const products = generateSyntheticProducts(2000);
  const start = performance.now();

  const indexMap = new Map<string, number>();
  products.forEach((p, idx) => indexMap.set(p.id, idx));

  const matched = products.filter((p) => {
    const idx = indexMap.get(p.id) ?? 0;
    return matchesProductSearchQuery(p, 'SKU-PERF-01999', idx);
  });

  const elapsedMs = performance.now() - start;
  assert.equal(matched.length, 1);
  assert.equal(matched[0].id, 'perf-prod-1999');
  assert.ok(elapsedMs < 60, `Expected search over 2,000 products < 60ms, got ${elapsedMs.toFixed(2)}ms`);
});

test('Benchmark 2: Exact barcode lookup over 2,000 multi-barcode products runs under 25ms', () => {
  const products = generateSyntheticProducts(2000);
  const start = performance.now();

  const found = products.find((p) => matchesProductBarcode(p, '6281000001850', true));

  const elapsedMs = performance.now() - start;
  assert.ok(found);
  assert.equal(found.id, 'perf-prod-1850');
  assert.ok(elapsedMs < 25, `Expected barcode lookup < 25ms, got ${elapsedMs.toFixed(2)}ms`);
});

test('Benchmark 3: Multi-currency 30-day revenue trend aggregation over 5,000 transactions runs under 150ms', () => {
  const transactions = generateSyntheticTransactions(5000);
  const rates = { USD: 2700, SAR: 720, AED: 735, SDG: 1 };

  const start = performance.now();
  const trends = computeDailyRevenueTrends(transactions, 30, 'SDG', rates, 'historical', 'ar');
  const elapsedMs = performance.now() - start;

  assert.equal(trends.points.length, 30);
  assert.ok(trends.totalRevenue > 0);
  assert.ok(elapsedMs < 150, `Expected 5,000-txn aggregation < 150ms, got ${elapsedMs.toFixed(2)}ms`);
});

test('Benchmark 4: Cart totals calculation with multi-unit items runs under 5ms', () => {
  const products = generateSyntheticProducts(30);
  const cart = products.map((product) => ({
    product,
    quantity: 3,
    itemDiscountPercent: 5,
    selectedSaleUnit: 'unit' as const,
  }));

  const start = performance.now();
  const totals = calculateCartTotals(cart, 15, 5, false, 'SDG', { USD: 2700, SDG: 1 }, 0);
  const elapsedMs = performance.now() - start;

  assert.ok(totals.grandTotal > 0);
  assert.ok(elapsedMs < 5, `Expected 30-item cart totals < 5ms, got ${elapsedMs.toFixed(2)}ms`);
});

test('Benchmark 5: Intelligent Data Merge duplicate detection on 400 products runs under 250ms', () => {
  const existingProducts = generateSyntheticProducts(200);
  const incomingProducts = generateSyntheticProducts(200);

  const emptyDataset = (prods: Product[]) => ({
    companyProfile: {} as any,
    branches: [],
    categories: [],
    products: prods,
    customers: [],
    suppliers: [],
    stockMovements: [],
    branchTransfers: [],
    transactions: [],
    purchases: [],
    expenses: [],
    accounts: [],
    journalEntries: [],
    currencies: [],
    exchangeRates: {},
    exchangeRateItems: [],
    exchangeRateHistory: [],
    employees: [],
    unitsOfMeasure: [],
    customFieldDefinitions: [],
    unmetDemandRequests: [],
    intelligenceLifecycleItems: [],
    auditLogs: [],
  });

  const start = performance.now();
  const preview = analyzeBackupMergePreview(
    emptyDataset(incomingProducts),
    emptyDataset(existingProducts),
    ['products']
  );
  const elapsedMs = performance.now() - start;

  assert.equal(preview.totals.exactMatches, 200);
  assert.ok(elapsedMs < 250, `Expected 200x200 merge preview < 250ms, got ${elapsedMs.toFixed(2)}ms`);
});

test('Benchmark 6: Brotli and Gzip compression reduce API JSON payload size by over 80%', () => {
  const payload = JSON.stringify(generateSyntheticProducts(200));
  const rawBytes = Buffer.byteLength(payload, 'utf-8');
  const gzipped = zlib.gzipSync(Buffer.from(payload, 'utf-8'), { level: 6 });
  const brotli = zlib.brotliCompressSync(Buffer.from(payload, 'utf-8'), {
    params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 4 },
  });

  const gzipSavingsPct = ((rawBytes - gzipped.length) / rawBytes) * 100;
  const brotliSavingsPct = ((rawBytes - brotli.length) / rawBytes) * 100;

  assert.ok(gzipSavingsPct > 80, `Expected Gzip savings > 80%, got ${gzipSavingsPct.toFixed(1)}%`);
  assert.ok(brotliSavingsPct > 80, `Expected Brotli savings > 80%, got ${brotliSavingsPct.toFixed(1)}%`);
});
