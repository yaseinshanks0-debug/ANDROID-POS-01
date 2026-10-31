/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateItemTotal,
  calculateCartTotals,
  calculateChangeDue,
  calculateDebtBreakdown,
  formatPaymentMethodLabel,
  validateCheckout,
  formatCurrency,
  convertCurrencyAmount,
  getProductPricesInCurrency,
  getConvertedTransactionView,
  repriceTransactionToNewRate,
} from './pos-calculations';
import { CartItem, Product, Transaction } from './types';

const mockProductA: Product = {
  id: 'prod-1',
  name: 'Organic Espresso Roast',
  sku: 'COF-001',
  barcode: '200123456789',
  category: 'Beverages',
  costPrice: 4.5,
  sellingPrice: 12.0,
  stock: 25,
  minStockAlert: 5,
  updatedAt: new Date().toISOString(),
};

const mockProductB: Product = {
  id: 'prod-2',
  name: 'Artisan Sourdough Loaf',
  sku: 'BAK-002',
  barcode: '200987654321',
  category: 'Bakery',
  costPrice: 2.0,
  sellingPrice: 8.0,
  stock: 2,
  minStockAlert: 5,
  updatedAt: new Date().toISOString(),
};

test('calculateItemTotal calculates line totals with and without discounts', () => {
  assert.equal(calculateItemTotal(10, 2, 0), 20);
  // 10% discount on $20 = $18
  assert.equal(calculateItemTotal(10, 2, 10), 18);
  // Boundary cases
  assert.equal(calculateItemTotal(0, 5, 0), 0);
  assert.equal(calculateItemTotal(-5, 2, 0), 0);
  assert.equal(calculateItemTotal(10, -1, 0), 0);
  assert.equal(calculateItemTotal(10, 1, 100), 0);
});

test('calculateCartTotals calculates subtotal, tax-exclusive tax, and global discount', () => {
  const cart: CartItem[] = [
    { product: mockProductA, quantity: 2, itemDiscountPercent: 0 }, // 24
    { product: mockProductB, quantity: 1, itemDiscountPercent: 0 }, // 8
  ];
  // Subtotal = 32. 10% tax on 32 = 3.20. Grand total = 35.20
  const result = calculateCartTotals(cart, 10, 0, false);
  assert.equal(result.subtotal, 32.0);
  assert.equal(result.taxAmount, 3.2);
  assert.equal(result.grandTotal, 35.2);
  assert.equal(result.totalItemsCount, 3);
});

test('calculateCartTotals handles tax-inclusive mode correctly', () => {
  const cart: CartItem[] = [
    { product: mockProductA, quantity: 1, itemDiscountPercent: 0 }, // 12
  ];
  // Subtotal = 12. Tax included at 20%: Tax = 12 - (12 / 1.2) = 2.00. Grand total = 12.00
  const result = calculateCartTotals(cart, 20, 0, true);
  assert.equal(result.subtotal, 12.0);
  assert.equal(result.taxAmount, 2.0);
  assert.equal(result.grandTotal, 12.0);
});

test('calculateCartTotals handles empty cart gracefully', () => {
  const result = calculateCartTotals([], 15, 0, false);
  assert.equal(result.subtotal, 0);
  assert.equal(result.grandTotal, 0);
  assert.equal(result.totalItemsCount, 0);
});

test('calculateChangeDue returns correct change amount', () => {
  assert.equal(calculateChangeDue(50.0, 35.2), 14.8);
  assert.equal(calculateChangeDue(35.2, 35.2), 0);
  assert.equal(calculateChangeDue(30.0, 35.2), 0); // Less tendered returns 0
});

test('validateCheckout flags empty cart, insufficient stock, and under-tendered cash', () => {
  const cart: CartItem[] = [
    { product: mockProductA, quantity: 2, itemDiscountPercent: 0 },
  ];

  // Valid card payment
  assert.equal(validateCheckout(cart, 'card', 0, 24).valid, true);

  // Cash underpayment
  const underpaid = validateCheckout(cart, 'cash', 20, 24);
  assert.equal(underpaid.valid, false);
  assert.ok(underpaid.error?.includes('less than total due'));

  // Insufficient stock validation
  const overStockCart: CartItem[] = [
    { product: mockProductB, quantity: 10, itemDiscountPercent: 0 }, // Product B only has 2 in stock
  ];
  const stockExceeded = validateCheckout(overStockCart, 'card', 0, 80);
  assert.equal(stockExceeded.valid, false);
  assert.ok(stockExceeded.error?.includes('Insufficient stock'));

  // Empty cart
  const emptyCheck = validateCheckout([], 'cash', 10, 0);
  assert.equal(emptyCheck.valid, false);
});

test('formatCurrency formats multiple currencies accurately', () => {
  assert.equal(formatCurrency(12.5, 'USD', 'en'), '$12.50');
  assert.equal(formatCurrency(50, 'EUR', 'en'), '€50.00');
  assert.equal(formatCurrency(100, 'SAR', 'en'), 'SAR 100.00');
  assert.equal(formatCurrency(100, 'SAR', 'ar'), '100.00 ر.س');
});

test('convertCurrencyAmount and getProductPricesInCurrency convert accurately across SDG, USD, and SAR', () => {
  const rates = { SDG: 1, USD: 2700, SAR: 720 };

  assert.equal(convertCurrencyAmount(2700, 'SDG', 'USD', rates), 1);
  assert.equal(convertCurrencyAmount(5400, 'SDG', 'USD', rates), 2);
  assert.equal(convertCurrencyAmount(10, 'USD', 'SDG', rates), 27000);
  assert.equal(convertCurrencyAmount(10, 'USD', 'SAR', rates), 37.5);

  const sdgProduct: Product = {
    ...mockProductA,
    costPrice: 2700,
    sellingPrice: 5400,
    priceCurrency: 'SDG',
  };

  const inUsd = getProductPricesInCurrency(sdgProduct, 'USD', rates);
  assert.equal(inUsd.costPrice, 1);
  assert.equal(inUsd.sellingPrice, 2);
  assert.equal(inUsd.profit, 1);
  assert.equal(inUsd.marginPercent, 50);

  const inSar = getProductPricesInCurrency(sdgProduct, 'SAR', rates);
  assert.equal(inSar.costPrice, 3.75);
  assert.equal(inSar.sellingPrice, 7.5);

  // Cart totals automatically convert when targetCurrency & exchangeRates are provided
  const cart: CartItem[] = [{ product: sdgProduct, quantity: 2, itemDiscountPercent: 0 }];
  const totalsInUsd = calculateCartTotals(cart, 0, 0, false, 'USD', rates);
  assert.equal(totalsInUsd.subtotal, 4);
  assert.equal(totalsInUsd.grandTotal, 4);
});

test('calculateDebtBreakdown accurately computes paid, partial debt, and full unpaid debt', () => {
  // Paid in full with cash change
  const fullPaid = calculateDebtBreakdown(100, 'paid', 120);
  assert.equal(fullPaid.paymentStatus, 'paid');
  assert.equal(fullPaid.amountPaid, 100);
  assert.equal(fullPaid.debtAmount, 0);
  assert.equal(fullPaid.changeDue, 20);

  // Partial payment leaves remaining debt
  const partial = calculateDebtBreakdown(100, 'partial', 40);
  assert.equal(partial.paymentStatus, 'partial');
  assert.equal(partial.amountPaid, 40);
  assert.equal(partial.debtAmount, 60);
  assert.equal(partial.changeDue, 0);

  // Unpaid (full debt)
  const unpaid = calculateDebtBreakdown(100, 'unpaid', 0);
  assert.equal(unpaid.paymentStatus, 'unpaid');
  assert.equal(unpaid.amountPaid, 0);
  assert.equal(unpaid.debtAmount, 100);
  assert.equal(unpaid.changeDue, 0);
});

test('validateCheckout validates bank_transfer reference number and debt payment statuses', () => {
  const cart: CartItem[] = [{ product: mockProductA, quantity: 2, itemDiscountPercent: 0 }];

  // Bank transfer without operation reference number fails when paid
  const missingRef = validateCheckout(cart, 'bank_transfer', 24, 24, {
    paymentStatus: 'paid',
    transferReference: '   ',
  });
  assert.equal(missingRef.valid, false);
  assert.ok(missingRef.error?.includes('reference number'));

  // Bank transfer with valid operation reference number succeeds
  const validBankTransfer = validateCheckout(cart, 'bank_transfer', 24, 24, {
    paymentStatus: 'paid',
    transferReference: 'TRX-998877',
    transferReceiptImage: 'data:image/png;base64,iVBORw0KGgo=',
  });
  assert.equal(validBankTransfer.valid, true);

  // Unpaid (full debt) allows 0 tendered even on cash/bank_transfer
  const unpaidDebt = validateCheckout(cart, 'cash', 0, 24, {
    paymentStatus: 'unpaid',
  });
  assert.equal(unpaidDebt.valid, true);

  // Partial payment with valid partial amount succeeds
  const partialDebt = validateCheckout(cart, 'cash', 10, 24, {
    paymentStatus: 'partial',
    amountPaid: 10,
  });
  assert.equal(partialDebt.valid, true);

  // Partial payment with 0 amount fails
  const zeroPartial = validateCheckout(cart, 'cash', 0, 24, {
    paymentStatus: 'partial',
    amountPaid: 0,
  });
  assert.equal(zeroPartial.valid, false);

  // Labels format accurately in Arabic and English
  assert.equal(formatPaymentMethodLabel('bank_transfer', 'ar'), 'تحويل بنكي');
  assert.equal(formatPaymentMethodLabel('bank_transfer', 'en'), 'Bank Transfer');
});

test('getConvertedTransactionView and repriceTransactionToNewRate handle currency switching and fluctuating exchange rates', () => {
  const sampleTx: Transaction = {
    id: 'TXN-TEST-100',
    idempotencyKey: 'idem-100',
    timestamp: new Date().toISOString(),
    currency: 'SDG',
    exchangeRateUsed: 2500,
    exchangeRatesSnapshot: {
      SDG: 1,
      USD: 2500,
      SAR: 666.6667,
    },
    items: [
      {
        productId: 'prod-1',
        productName: 'Coffee Beans',
        sku: 'COF-1',
        quantity: 2,
        unitPrice: 12500,
        discountPercent: 0,
        total: 25000,
      },
    ],
    subtotal: 25000,
    taxRatePercent: 0,
    taxAmount: 0,
    discountAmount: 0,
    grandTotal: 25000, // Worth $10 USD at sale time (rate = 2500)
    paymentMethod: 'bank_transfer',
    transferReference: 'REF-100',
    amountTendered: 10000,
    changeDue: 0,
    paymentStatus: 'partial',
    amountPaid: 10000, // Paid $4 USD at sale time
    debtAmount: 15000, // Remaining debt $6 USD at sale time
    cashierName: 'Terminal 1',
    status: 'completed',
    syncStatus: 'synced',
  };

  // New fluctuating exchange rate: 1 USD = 3000 SDG, 1 SAR = 800 SDG
  const newLiveRates = {
    SDG: 1,
    USD: 3000,
    SAR: 800,
  };

  // 1. Historical Mode in USD: uses the sale-time rate (2500 SDG/USD) => $10.00 total, $6.00 debt
  const histUsd = getConvertedTransactionView(sampleTx, 'USD', newLiveRates, 'historical', 'USD');
  assert.equal(histUsd.grandTotal, 10);
  assert.equal(histUsd.amountPaid, 4);
  assert.equal(histUsd.debtAmount, 6);
  assert.equal(histUsd.hasRateChanged, true);

  // 2. Live Direct Mode in USD: converts 25,000 SDG directly at today's 3000 rate => $8.33 total, $5.00 debt
  const liveUsd = getConvertedTransactionView(sampleTx, 'USD', newLiveRates, 'live', 'USD');
  assert.equal(liveUsd.grandTotal, 8.33);
  assert.equal(liveUsd.debtAmount, 5);

  // 3. Indexed Mode (Linked to New Rate) in SDG: $10 USD anchor * 3000 new rate = 30,000 SDG total, 18,000 SDG debt (+5,000 SDG rate diff)
  const indexedSdg = getConvertedTransactionView(sampleTx, 'SDG', newLiveRates, 'indexed', 'USD');
  assert.equal(indexedSdg.grandTotal, 30000);
  assert.equal(indexedSdg.amountPaid, 12000);
  assert.equal(indexedSdg.debtAmount, 18000);
  assert.equal(indexedSdg.rateDifference, 5000);

  // 4. Indexed Mode in SAR: $10 USD anchor * (3000 / 800) = 37.50 SAR total
  const indexedSar = getConvertedTransactionView(sampleTx, 'SAR', newLiveRates, 'indexed', 'USD');
  assert.equal(indexedSar.grandTotal, 37.5);
  assert.equal(indexedSar.debtAmount, 22.5);

  // 5. Permanently re-pricing transaction to the new exchange rate
  const repriced = repriceTransactionToNewRate(sampleTx, newLiveRates, 'USD');
  assert.equal(repriced.grandTotal, 30000);
  assert.equal(repriced.debtAmount, 18000);
  assert.equal(repriced.exchangeRateUsed, 3000);
  assert.equal(repriced.exchangeRatesSnapshot?.USD, 3000);
});


