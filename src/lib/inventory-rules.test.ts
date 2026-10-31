/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  checkStockAvailability,
  calculateStockAdjustment,
  isLowStock,
  generateTransactionId,
  generateBarcode,
  normalizeProductBarcodes,
  getAllProductBarcodes,
  matchesProductBarcode,
} from './inventory-rules';

test('checkStockAvailability correctly determines availability', () => {
  const product = { stock: 10 };
  assert.deepEqual(checkStockAvailability(product, 5), { available: true, remainingAfterSale: 5 });
  assert.deepEqual(checkStockAvailability(product, 10), { available: true, remainingAfterSale: 0 });
  assert.deepEqual(checkStockAvailability(product, 11), { available: false, remainingAfterSale: -1 });
  assert.deepEqual(checkStockAvailability(product, 0), { available: false, remainingAfterSale: 10 });
});

test('calculateStockAdjustment computes stock changes for various event types', () => {
  assert.equal(calculateStockAdjustment(20, 'sale', 5), 15);
  assert.equal(calculateStockAdjustment(10, 'damage', 2), 8);
  assert.equal(calculateStockAdjustment(5, 'loss', 10), 0); // clamped to zero
  assert.equal(calculateStockAdjustment(15, 'restock', 25), 40);
  assert.equal(calculateStockAdjustment(10, 'audit', 17), 17); // sets exact count
});

test('isLowStock identifies items at or below threshold', () => {
  assert.equal(isLowStock(3, 5), true);
  assert.equal(isLowStock(5, 5), true);
  assert.equal(isLowStock(6, 5), false);
});

test('generateTransactionId creates consistent format with TXN prefix', () => {
  const d = new Date(2026, 9, 29);
  const txnId = generateTransactionId(d);
  assert.ok(txnId.startsWith('TXN-20261029-'));
});

test('generateBarcode produces 12 character numeric code', () => {
  const barcode = generateBarcode();
  assert.equal(barcode.length, 12);
  assert.match(barcode, /^\d+$/);
});

test('normalizeProductBarcodes and matchesProductBarcode handle multiple barcodes per product', () => {
  const codes = normalizeProductBarcodes('200111222333', ['200111222333', ' 628100000111 ', '', '628100000222']);
  assert.deepEqual(codes, ['200111222333', '628100000111', '628100000222']);

  const prod = {
    barcode: '200111222333',
    barcodes: ['200111222333', '628100000111', 'BOX-998877'],
  };
  assert.deepEqual(getAllProductBarcodes(prod), ['200111222333', '628100000111', 'BOX-998877']);
  assert.equal(matchesProductBarcode(prod, '628100000111', true), true);
  assert.equal(matchesProductBarcode(prod, 'BOX-9988', false), true);
  assert.equal(matchesProductBarcode(prod, 'BOX-9988', true), false);
  assert.equal(matchesProductBarcode(prod, '999999999999', true), false);
});
