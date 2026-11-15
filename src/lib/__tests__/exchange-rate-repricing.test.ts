import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeRateChangeMetrics,
  getEffectiveProductPriceCurrency,
  isSdgPricedProduct,
  previewSdgRepricingImpact,
  repriceSdgProductsOnExchangeRateChange,
  scaleSdgAmount,
} from '../exchange-rate-repricing';
import type { Product } from '../types';

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'prod-1',
    name: 'Sugar 1kg',
    nameAr: 'سكر 1 كيلو',
    sku: 'SKU-001',
    barcode: '6291001001',
    category: 'Grocery',
    costPrice: 2000,
    sellingPrice: 2700,
    priceCurrency: 'SDG',
    stock: 20,
    minStockAlert: 5,
    emoji: '🛍️',
    colorHex: '#d97706',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

test('computeRateChangeMetrics handles increases, decreases, unchanged, and invalid inputs', () => {
  const inc = computeRateChangeMetrics(2700, 3000);
  assert.equal(inc.isValid, true);
  assert.equal(inc.direction, 'increase');
  assert.equal(inc.changePercent, 11.1);
  assert.ok(Math.abs(inc.ratio - 3000 / 2700) < 1e-9);

  const dec = computeRateChangeMetrics(3000, 2700);
  assert.equal(dec.isValid, true);
  assert.equal(dec.direction, 'decrease');
  assert.equal(dec.changePercent, -10);

  const same = computeRateChangeMetrics(2700, 2700);
  assert.equal(same.isValid, true);
  assert.equal(same.direction, 'unchanged');
  assert.equal(same.ratio, 1);

  assert.equal(computeRateChangeMetrics(0, 3000).isValid, false);
  assert.equal(computeRateChangeMetrics(2700, -100).isValid, false);
  assert.equal(computeRateChangeMetrics(NaN, 3000).isValid, false);
});

test('USD exchange rate increase proportionally raises SDG product prices and records audit trail', () => {
  const sdgProduct = makeProduct({
    id: 'prod-sdg-1',
    costPrice: 1800,
    sellingPrice: 2700,
    enablePackaging: true,
    unitsPerPack: 10,
    packCostPrice: 18000,
    packSellingPrice: 27000,
  });

  const result = repriceSdgProductsOnExchangeRateChange({
    products: [sdgProduct],
    currencyCode: 'USD',
    previousRate: 2700,
    newRate: 3000,
    policy: 'increase_only',
    changedBy: 'Admin User',
    nowIso: '2026-11-15T12:00:00.000Z',
  });

  assert.equal(result.affectedCount, 1);
  assert.equal(result.skippedForeignCount, 0);
  assert.equal(result.changePercent, 11.1);

  const updated = result.updatedProducts[0];
  assert.equal(updated.costPrice, 2000);
  assert.equal(updated.sellingPrice, 3000);
  assert.equal(updated.packCostPrice, 20000);
  assert.equal(updated.packSellingPrice, 30000);
  assert.equal(updated.previousCostPrice, 1800);
  assert.equal(updated.previousSellingPrice, 2700);
  assert.equal(updated.priceUpdatedAt, '2026-11-15T12:00:00.000Z');
  assert.equal(updated.priceHistory?.length, 1);
  assert.equal(updated.priceHistory?.[0].previousSellingPrice, 2700);
  assert.equal(updated.priceHistory?.[0].newSellingPrice, 3000);
  assert.match(updated.priceHistory?.[0].note || '', /USD/);
  assert.equal(updated.modificationHistory?.[0].action, 'price_changed');
  assert.equal(updated.customFields?.previousSellingPrice, 2700);
  assert.equal(updated.customFields?.packSellingPrice, 30000);
});

test('SAR and other foreign currency increases adjust SDG products (omitted priceCurrency defaults to SDG)', () => {
  const omittedCurrencyProduct = makeProduct({
    id: 'prod-default-sdg',
    priceCurrency: undefined,
    costPrice: 720,
    sellingPrice: 1440,
  });

  const sarResult = repriceSdgProductsOnExchangeRateChange({
    products: [omittedCurrencyProduct],
    currencyCode: 'SAR',
    previousRate: 720,
    newRate: 800,
    policy: 'increase_only',
  });

  assert.equal(sarResult.affectedCount, 1);
  assert.equal(sarResult.updatedProducts[0].costPrice, 800);
  assert.equal(sarResult.updatedProducts[0].sellingPrice, 1600);

  const eurResult = repriceSdgProductsOnExchangeRateChange({
    products: sarResult.updatedProducts,
    currencyCode: 'EUR',
    previousRate: 3000,
    newRate: 3300,
    policy: 'increase_only',
  });

  assert.equal(eurResult.affectedCount, 1);
  assert.equal(eurResult.updatedProducts[0].costPrice, 880);
  assert.equal(eurResult.updatedProducts[0].sellingPrice, 1760);
});

test('Foreign-priced products (USD, SAR, AED, etc.) are never double-scaled', () => {
  const usdPriced = makeProduct({
    id: 'prod-usd',
    priceCurrency: 'USD',
    costPrice: 10,
    sellingPrice: 15,
  });
  const sarPricedInCustomFields = makeProduct({
    id: 'prod-sar-cf',
    priceCurrency: undefined,
    customFields: { priceCurrency: 'SAR' },
    costPrice: 20,
    sellingPrice: 30,
  });
  const sdgPriced = makeProduct({
    id: 'prod-sdg',
    priceCurrency: 'SDG',
    costPrice: 2700,
    sellingPrice: 5400,
  });

  assert.equal(getEffectiveProductPriceCurrency(usdPriced), 'USD');
  assert.equal(isSdgPricedProduct(usdPriced), false);
  assert.equal(isSdgPricedProduct(sarPricedInCustomFields), false);
  assert.equal(isSdgPricedProduct(sdgPriced), true);

  const result = repriceSdgProductsOnExchangeRateChange({
    products: [usdPriced, sarPricedInCustomFields, sdgPriced],
    currencyCode: 'USD',
    previousRate: 2700,
    newRate: 3000,
    policy: 'increase_only',
  });

  assert.equal(result.affectedCount, 1);
  assert.equal(result.skippedForeignCount, 2);
  assert.equal(result.updatedProducts[0].sellingPrice, 15);
  assert.equal(result.updatedProducts[0].costPrice, 10);
  assert.equal(result.updatedProducts[1].sellingPrice, 30);
  assert.equal(result.updatedProducts[2].sellingPrice, 6000);
  assert.equal(result.updatedProducts[2].costPrice, 3000);
});

test('increase_only policy ignores decreases while proportional policy scales both ways', () => {
  const item = makeProduct({ costPrice: 2000, sellingPrice: 3000 });

  const incOnlyOnDrop = repriceSdgProductsOnExchangeRateChange({
    products: [item],
    currencyCode: 'USD',
    previousRate: 3000,
    newRate: 2700,
    policy: 'increase_only',
  });
  assert.equal(incOnlyOnDrop.affectedCount, 0);
  assert.equal(incOnlyOnDrop.updatedProducts[0].sellingPrice, 3000);

  const propOnDrop = repriceSdgProductsOnExchangeRateChange({
    products: [item],
    currencyCode: 'USD',
    previousRate: 3000,
    newRate: 2700,
    policy: 'proportional',
  });
  assert.equal(propOnDrop.affectedCount, 1);
  assert.equal(propOnDrop.updatedProducts[0].sellingPrice, 2700);
  assert.equal(propOnDrop.updatedProducts[0].costPrice, 1800);
});

test('Initial/zero/invalid rates and SDG base currency produce zero mutations', () => {
  const item = makeProduct({ costPrice: 0, sellingPrice: 2700 });

  const noPrev = repriceSdgProductsOnExchangeRateChange({
    products: [item],
    currencyCode: 'USD',
    previousRate: 0,
    newRate: 2700,
  });
  assert.equal(noPrev.affectedCount, 0);

  const baseSdg = repriceSdgProductsOnExchangeRateChange({
    products: [item],
    currencyCode: 'SDG',
    previousRate: 1,
    newRate: 2,
  });
  assert.equal(baseSdg.affectedCount, 0);

  const zeroCostPreserved = repriceSdgProductsOnExchangeRateChange({
    products: [item],
    currencyCode: 'USD',
    previousRate: 2700,
    newRate: 3000,
  });
  assert.equal(zeroCostPreserved.affectedCount, 1);
  assert.equal(zeroCostPreserved.updatedProducts[0].costPrice, 0);
  assert.equal(zeroCostPreserved.updatedProducts[0].sellingPrice, 3000);
});

test('previewSdgRepricingImpact and optional roundingStep behave accurately', () => {
  const products = [
    makeProduct({ id: 'p1', name: 'Tea', priceCurrency: 'SDG', sellingPrice: 2700 }),
    makeProduct({ id: 'p2', name: 'Coffee', priceCurrency: 'USD', sellingPrice: 12 }),
  ];

  const preview = previewSdgRepricingImpact({
    products,
    currencyCode: 'USD',
    previousRate: 2700,
    newRate: 3000,
    policy: 'increase_only',
  });

  assert.equal(preview.willAdjust, true);
  assert.equal(preview.eligibleSdgProductCount, 1);
  assert.equal(preview.foreignPricedProductCount, 1);
  assert.equal(preview.sample.oldSellingPrice, 2700);
  assert.equal(preview.sample.newSellingPrice, 3000);
  assert.equal(preview.sample.isSyntheticExample, false);

  assert.equal(scaleSdgAmount(2730, 1.1111, 50), 3050);
});
