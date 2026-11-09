import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeAtomicCheckoutStateTransition,
  computeAtomicVoidTransactionStateTransition,
  OperationalLedgerState,
} from '../pos-calculations.ts';
import type { CartItem, Transaction } from '../types.ts';

test('Atomic Checkout & Void State Transitions (Problem #5)', async (t) => {
  const initialLedger: OperationalLedgerState = {
    products: [
      {
        id: 'prod-coffee',
        name: 'Ethiopian Beans',
        sku: 'COF-01',
        barcode: '10001',
        costPrice: 12,
        sellingPrice: 20,
        priceCurrency: 'USD',
        category: 'Coffee',
        stock: 50,
        minStockAlert: 5,
        unitName: 'bag',
        updatedAt: '2026-11-09T09:00:00.000Z',
      },
      {
        id: 'prod-pack',
        name: 'Herbal Tea Box (Pack of 6)',
        sku: 'TEA-06',
        barcode: '10002',
        costPrice: 3,
        sellingPrice: 5,
        priceCurrency: 'USD',
        category: 'Tea',
        stock: 30,
        minStockAlert: 5,
        unitName: 'strip',
        enablePackaging: true,
        unitsPerPack: 6,
        packName: 'Box',
        packSellingPrice: 27,
        updatedAt: '2026-11-09T09:00:00.000Z',
      },
    ],
    transactions: [],
    customers: [
      {
        id: 'cust-1',
        name: 'Tariq Al-Noor',
        phone: '+249912345678',
        totalSpent: 100,
        totalDebt: 10,
        transactionCount: 2,
        loyaltyPoints: 100,
        createdAt: '2026-11-01T00:00:00.000Z',
      },
    ],
    stockMovements: [],
  };

  const cart: CartItem[] = [
    {
      product: initialLedger.products[0],
      quantity: 2,
      itemDiscountPercent: 0,
      selectedSaleUnit: 'unit',
    },
    {
      product: initialLedger.products[1],
      quantity: 2, // 2 packs * 6 = 12 base units deducted
      itemDiscountPercent: 0,
      selectedSaleUnit: 'pack',
    },
  ];

  const txToCommit: Transaction = {
    id: 'TXN-20261109-9001',
    idempotencyKey: 'idem-atomic-1',
    timestamp: '2026-11-09T10:00:00.000Z',
    currency: 'USD',
    exchangeRateUsed: 2700,
    items: [
      {
        productId: 'prod-coffee',
        productName: 'Ethiopian Beans',
        sku: 'COF-01',
        quantity: 2,
        unitPrice: 20,
        discountPercent: 0,
        total: 40,
        saleUnit: 'unit',
        stockDeducted: 2,
      },
      {
        productId: 'prod-pack',
        productName: 'Herbal Tea Box (Pack of 6)',
        sku: 'TEA-06',
        quantity: 2,
        unitPrice: 27,
        discountPercent: 0,
        total: 54,
        saleUnit: 'pack',
        unitsPerPack: 6,
        stockDeducted: 12,
      },
    ],
    subtotal: 94,
    taxRatePercent: 0,
    taxAmount: 0,
    discountAmount: 0,
    grandTotal: 94,
    paymentMethod: 'cash',
    amountTendered: 60,
    changeDue: 0,
    paymentStatus: 'partial',
    amountPaid: 60,
    debtAmount: 34,
    customerId: 'cust-1',
    customerName: 'Tariq Al-Noor',
    cashierName: 'Main Terminal',
    status: 'completed',
    syncStatus: 'synced',
  };

  await t.test('atomically updates products, stockMovements, customers, and transactions without mutating previous state', () => {
    const nextState = computeAtomicCheckoutStateTransition(initialLedger, {
      cart,
      newTransaction: txToCommit,
      selectedCustomerId: 'cust-1',
      grandTotal: 94,
      debtAmount: 34,
      currency: 'USD',
      exchangeRates: { SDG: 1, USD: 2700 },
      language: 'en',
      nowIso: '2026-11-09T10:00:00.000Z',
    });

    // Previous state remains untouched (pure transition)
    assert.equal(initialLedger.products[0].stock, 50);
    assert.equal(initialLedger.products[1].stock, 30);
    assert.equal(initialLedger.stockMovements.length, 0);
    assert.equal(initialLedger.transactions.length, 0);
    assert.equal(initialLedger.customers[0].totalSpent, 100);

    // Next state has all 4 slices updated atomically
    assert.equal(nextState.products[0].stock, 48); // 50 - 2
    assert.equal(nextState.products[1].stock, 18); // 30 - 12 (2 packs of 6)
    assert.equal(nextState.stockMovements.length, 2);
    assert.equal(nextState.stockMovements[0].quantityChange, -2);
    assert.equal(nextState.stockMovements[1].quantityChange, -12);
    assert.equal(nextState.transactions.length, 1);
    assert.equal(nextState.transactions[0].id, 'TXN-20261109-9001');
    assert.equal(nextState.customers[0].totalSpent, 194); // 100 + 94
    assert.equal(nextState.customers[0].totalDebt, 44); // 10 + 34
    assert.equal(nextState.customers[0].transactionCount, 3);
    assert.equal(nextState.customers[0].loyaltyPoints, 194);
  });

  await t.test('is StrictMode-safe (no duplicate movements when reducer runs twice) and idempotent on duplicate transaction ID', () => {
    const payload = {
      cart,
      newTransaction: txToCommit,
      selectedCustomerId: 'cust-1',
      grandTotal: 94,
      debtAmount: 34,
      currency: 'USD' as const,
      exchangeRates: { SDG: 1, USD: 2700 },
      language: 'en' as const,
      nowIso: '2026-11-09T10:00:00.000Z',
    };

    // Simulate React StrictMode invoking reducer twice with the same initial state
    const run1 = computeAtomicCheckoutStateTransition(initialLedger, payload);
    const run2 = computeAtomicCheckoutStateTransition(initialLedger, payload);
    assert.equal(run1.stockMovements.length, 2);
    assert.equal(run2.stockMovements.length, 2);
    assert.deepEqual(run1, run2);

    // Simulate duplicate dispatch with same transaction ID on already-committed state
    const duplicateDispatch = computeAtomicCheckoutStateTransition(run1, payload);
    assert.equal(duplicateDispatch.transactions.length, 1);
    assert.equal(duplicateDispatch.stockMovements.length, 2);
    assert.equal(duplicateDispatch.products[0].stock, 48);
  });

  await t.test('computeAtomicVoidTransactionStateTransition atomically restores stock, movements, customer debt, and void status', () => {
    const committed = computeAtomicCheckoutStateTransition(initialLedger, {
      cart,
      newTransaction: txToCommit,
      selectedCustomerId: 'cust-1',
      grandTotal: 94,
      debtAmount: 34,
      currency: 'USD',
      exchangeRates: { SDG: 1, USD: 2700 },
      language: 'en',
      nowIso: '2026-11-09T10:00:00.000Z',
    });

    const voidedState = computeAtomicVoidTransactionStateTransition(committed, {
      transactionId: 'TXN-20261109-9001',
      nowIso: '2026-11-09T10:05:00.000Z',
    });

    assert.equal(voidedState.voided, true);
    assert.equal(voidedState.products[0].stock, 50); // Restored 48 + 2
    assert.equal(voidedState.products[1].stock, 30); // Restored 18 + 12 (pack units)
    assert.equal(voidedState.transactions[0].status, 'voided');
    assert.equal(voidedState.stockMovements.length, 4); // 2 restock + 2 original sale
    assert.equal(voidedState.customers[0].totalSpent, 100);
    assert.equal(voidedState.customers[0].totalDebt, 10);
    assert.equal(voidedState.customers[0].loyaltyPoints, 100);
  });
});
