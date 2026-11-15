import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateItemTotal,
  calculateCartTotals,
  computeAtomicVoidTransactionStateTransition,
  OperationalLedgerState,
} from '../pos-calculations.ts';
import {
  buildProductSearchIndexMap,
  matchesProductSearchIndexEntry,
  matchesProductSearchQuery,
  tokenizeProductSearchQuery,
} from '../inventory-rules.ts';
import { buildSafeCloudSnapshotPayload } from '../cloud-snapshot-utils.ts';
import type { Product, Transaction } from '../types.ts';

test('Code Review & Optimization Regressions', async (t) => {
  await t.test(
    'computeAtomicVoidTransactionStateTransition restores full stock across duplicate/multi-line items for the same productId',
    () => {
      const product: Product = {
        id: 'prod-1',
        name: 'Arabic Coffee',
        sku: 'COF-1',
        barcode: '111111',
        costPrice: 10,
        sellingPrice: 15,
        priceCurrency: 'USD',
        category: 'Coffee',
        stock: 40,
        minStockAlert: 5,
        updatedAt: '2026-11-15T10:00:00.000Z',
      };

      const multiLineTx: Transaction = {
        id: 'TXN-MULTI-LINE-1',
        idempotencyKey: 'idem-multi-1',
        timestamp: '2026-11-15T10:00:00.000Z',
        currency: 'USD',
        exchangeRateUsed: 2700,
        items: [
          {
            productId: 'prod-1',
            productName: 'Arabic Coffee',
            sku: 'COF-1',
            quantity: 2,
            unitPrice: 15,
            discountPercent: 0,
            total: 30,
            stockDeducted: 2,
          },
          {
            productId: 'prod-1',
            productName: 'Arabic Coffee',
            sku: 'COF-1',
            quantity: 3,
            unitPrice: 15,
            discountPercent: 0,
            total: 45,
            stockDeducted: 3,
          },
        ],
        subtotal: 75,
        taxRatePercent: 0,
        taxAmount: 0,
        discountAmount: 0,
        grandTotal: 75,
        paymentMethod: 'cash',
        amountTendered: 75,
        changeDue: 0,
        paymentStatus: 'paid',
        amountPaid: 75,
        debtAmount: 0,
        customerName: 'Walk-in Customer',
        cashierName: 'Main Terminal',
        status: 'completed',
        syncStatus: 'synced',
      };

      const state: OperationalLedgerState = {
        products: [product],
        transactions: [multiLineTx],
        customers: [],
        stockMovements: [],
      };

      const result = computeAtomicVoidTransactionStateTransition(state, {
        transactionId: 'TXN-MULTI-LINE-1',
        nowIso: '2026-11-15T10:05:00.000Z',
      });

      assert.equal(result.voided, true);
      // Must restore 2 + 3 = 5 units (40 + 5 = 45), not just the first line (42)
      assert.equal(result.products[0].stock, 45);
      assert.equal(result.returnMovements[0].quantityChange, 5);
    }
  );

  await t.test(
    'calculateItemTotal eliminates floating-point precision artifacts matching calculateCartTotals',
    () => {
      const unitPrice = 19.99;
      const qty = 3;
      const discountPercent = 15;
      const lineTotal = calculateItemTotal(unitPrice, qty, discountPercent);

      assert.equal(lineTotal, 50.97);
      const cartTotals = calculateCartTotals(
        [
          {
            product: {
              id: 'p-float',
              name: 'Precision Item',
              sku: 'PRE-1',
              barcode: '999',
              costPrice: 10,
              sellingPrice: unitPrice,
              priceCurrency: 'USD',
              category: 'General',
              stock: 10,
              minStockAlert: 1,
              updatedAt: '2026-11-15T10:00:00.000Z',
            },
            quantity: qty,
            itemDiscountPercent: discountPercent,
          },
        ],
        0,
        0,
        true,
        'USD',
        { SDG: 1, USD: 2700 }
      );
      assert.equal(cartTotals.subtotal, lineTotal);
    }
  );

  await t.test(
    'buildProductSearchIndexMap + matchesProductSearchIndexEntry matches identically to matchesProductSearchQuery',
    () => {
      const catalog: Product[] = [
        {
          id: 'p-1',
          serialNumber: 1,
          name: 'Panadol Extra',
          nameAr: 'بنادول إكسترا',
          description: 'Pain relief tablet',
          descriptionAr: 'مسكن للألم',
          sku: '628100112233',
          barcode: '628100112233',
          barcodes: ['628100112233', '880011223344'],
          category: 'Pharmacy',
          categoryAr: 'صيدلية',
          costPrice: 1000,
          sellingPrice: 1500,
          stock: 25,
          minStockAlert: 5,
          expiryDate: '2027-08-15',
          updatedAt: '2026-11-15T10:00:00.000Z',
        },
        {
          id: 'p-2',
          name: 'Sugar 1kg',
          nameAr: 'سكر كيلو',
          sku: 'SUG-1',
          barcode: '123456',
          category: 'Grocery',
          costPrice: 2000,
          sellingPrice: 2500,
          stock: 10,
          minStockAlert: 2,
          updatedAt: '2026-11-15T10:00:00.000Z',
        },
      ];

      const indexMap = buildProductSearchIndexMap(catalog);
      const queries = ['بنادول مسكن', '#0001', '880011223344', '2027-08', '2', 'sug', 'nonexistent'];

      for (const q of queries) {
        const tokens = tokenizeProductSearchQuery(q);
        catalog.forEach((prod, idx) => {
          const legacyMatch = matchesProductSearchQuery(prod, q, idx);
          const entry = indexMap.get(prod.id)!;
          const indexedMatch = matchesProductSearchIndexEntry(entry, tokens);
          assert.equal(indexedMatch, legacyMatch, `Mismatch for query="${q}" on ${prod.id}`);
        });
      }
    }
  );

  await t.test(
    'buildSafeCloudSnapshotPayload sorts transactions newest-first and strips oversized inline base64 images under limit',
    () => {
      const hugeDataUrl = `data:image/jpeg;base64,${'A'.repeat(120_000)}`;
      const result = buildSafeCloudSnapshotPayload(
        {
          products: [
            {
              id: 'p1',
              name: 'Item 1',
              image: hugeDataUrl,
              customFields: { image: hugeDataUrl },
            },
          ],
          transactions: [
            { id: 'tx-old', timestamp: '2026-10-01T10:00:00.000Z', grandTotal: 100 },
            {
              id: 'tx-new',
              timestamp: '2026-11-15T10:00:00.000Z',
              grandTotal: 250,
              transferReceiptImage: hugeDataUrl,
              transferReceiptImages: [hugeDataUrl],
            },
          ],
          stockMovements: [
            { id: 'm-old', timestamp: '2026-10-01T10:00:00.000Z' },
            { id: 'm-new', timestamp: '2026-11-15T10:00:00.000Z' },
          ],
          settings: { storeLogo: hugeDataUrl, storeName: 'Test Store' },
        },
        50_000 // Enforce tight cap to trigger base64 media stripping
      );

      assert.equal(result.transactions[0].id, 'tx-new');
      assert.equal(result.transactions[1].id, 'tx-old');
      assert.equal(result.stockMovements[0].id, 'm-new');
      assert.equal(result.strippedInlineMedia, true);
      assert.equal(result.products[0].image, undefined);
      assert.equal(result.products[0].customFields.image, undefined);
      assert.equal(result.transactions[0].transferReceiptImage, undefined);
      assert.equal(result.settings.storeName, 'Test Store');
      assert.equal(result.settings.storeLogo, undefined);
      assert.ok(JSON.stringify(result).length < 50_000);
    }
  );
});
