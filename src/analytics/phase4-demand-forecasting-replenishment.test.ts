/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4 Deterministic Tests:
 * - Partial fulfillment in Unmet Demand Analytics & Forecasting (no double counting with sales)
 * - DISCONTINUED vs TEMPORARILY_PAUSED lifecycle handling in Forecasting & Smart Replenishment
 * - Batch-aware sellable stock in Forecasting & Smart Replenishment (expired batch units deducted without zeroing valid stock)
 * - 24h same-customer repeat discounting in Forecasting
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_CUSTOMERS,
  INITIAL_EXCHANGE_RATE_HISTORY,
  INITIAL_SETTINGS,
  INITIAL_USERS,
} from '../lib/initial-data';
import { Product } from '../lib/types';
import {
  buildAnalyticsSnapshotFromState,
  DEFAULT_ANALYTICS_BRANCHES,
} from './analytics.snapshot';
import { computeFullAnalyticsOverview } from './analytics.service';
import { validateAndBuildUnmetDemandRequest } from './unmet-demand.validation';

function createBaseProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'prod-1',
    sku: 'SKU-001',
    barcode: '6281000000001',
    name: 'Premium Milk Powder 900g',
    nameAr: 'حليب مجفف فاخر 900 جرام',
    category: 'Dairy',
    sellingPrice: 5000,
    costPrice: 3800,
    stock: 0,
    minStockAlert: 5,
    unitName: 'tin',
    isActive: true,
    catalogLifecycleStatus: 'ACTIVE',
    colorHex: '#2563eb',
    createdAt: '2026-03-01T08:00:00.000Z',
    updatedAt: '2026-03-01T08:00:00.000Z',
    ...overrides,
  };
}

test('Phase 4.1: Partial fulfillment weights only remainingUnfulfilledBaseUnits in unmet-demand analytics and forecasting (never double-counting fulfilled units)', () => {
  const now = new Date();
  const product = createBaseProduct({
    id: 'prod-partial',
    stock: 0,
    minStockAlert: 5,
    sellingPrice: 1000,
    costPrice: 700,
  });

  const built = validateAndBuildUnmetDemandRequest({
    input: {
      productId: product.id,
      requestedQuantity: 10,
      unavailabilityReason: 'OUT_OF_STOCK',
      confirmedPurchaseIntent: true,
      branchId: 'branch-main',
    },
    claimingUserId: INITIAL_USERS[0].id,
    serverUsers: INITIAL_USERS,
    catalogProducts: [product],
    existingRequests: [],
    now,
  });
  assert.equal(built.valid, true);

  // Customer originally requested 10 units; 6 units were later fulfilled via linked sale; 4 units remain unfulfilled
  const partialRequest = {
    ...built.record!,
    fulfilledBaseUnits: 6,
    remainingUnfulfilledBaseUnits: 4,
    status: 'PARTIALLY_FULFILLED' as const,
  };

  const snapshot = buildAnalyticsSnapshotFromState({
    products: [{ ...product, stock: 4 }],
    transactions: [
      {
        id: 'sale-linked-1',
        idempotencyKey: 'idem-sale-linked-1',
        timestamp: now.toISOString(),
        items: [
          {
            productId: product.id,
            productName: product.name,
            sku: product.sku,
            quantity: 6,
            unitPrice: 1000,
            discountPercent: 0,
            total: 6000,
          },
        ],
        subtotal: 6000,
        taxRatePercent: 0,
        taxAmount: 0,
        discountAmount: 0,
        grandTotal: 6000,
        paymentMethod: 'cash',
        amountTendered: 6000,
        changeDue: 0,
        status: 'completed',
        syncStatus: 'synced',
        cashierName: INITIAL_USERS[0].name,
        currency: 'SDG',
        exchangeRateUsed: 1,
      },
    ],
    customers: INITIAL_CUSTOMERS,
    stockMovements: [],
    users: INITIAL_USERS,
    exchangeRates: INITIAL_SETTINGS.exchangeRates,
    exchangeRateHistory: INITIAL_EXCHANGE_RATE_HISTORY,
    branches: DEFAULT_ANALYTICS_BRANCHES,
    unmetDemandRequests: [partialRequest],
  });

  const bundle = computeFullAnalyticsOverview(
    snapshot,
    { datePreset: '7d', currency: 'SDG', forecastHorizonDays: 7 },
    { userId: INITIAL_USERS[0].id, role: 'admin' }
  );

  // 1. Verify Unmet Demand Analytics weights only the 4 remaining unfulfilled units (4 * 0.65 = 2.6), NOT 10 * 0.65 = 6.5
  assert.equal(bundle.intelligence.unmetDemand.summary.totalRequestedBaseUnits, 10);
  assert.equal(
    bundle.intelligence.unmetDemand.lostSalesEstimation.dedupedConfirmedWeightedUnits,
    2.6
  );
  assert.equal(
    bundle.intelligence.unmetDemand.lostSalesEstimation.estimatedLostRevenue,
    2600
  );
  assert.equal(
    bundle.intelligence.unmetDemand.lostSalesEstimation.estimatedLostGrossProfit,
    780
  );

  // 2. Verify Product Demand Forecast uses remaining unfulfilled units (4), NOT 10
  const fc = bundle.forecasts.productDemandForecasts.find(
    (f) => f.productId === 'prod-partial'
  );
  assert.ok(fc, 'Expected forecast item for prod-partial');
  assert.equal(fc.observedUnmetDemandUnits, 4);
});

test('Phase 4.2: DISCONTINUED products are excluded from automatic replenishment & reorder quantities while TEMPORARILY_PAUSED products remain eligible', () => {
  const now = new Date();
  const discontinuedProd = createBaseProduct({
    id: 'prod-disc',
    sku: 'SKU-DISC',
    name: 'Discontinued Cocoa Tin',
    stock: 0,
    minStockAlert: 10,
    isActive: false,
    catalogLifecycleStatus: 'DISCONTINUED',
    discontinuedReason: 'Manufacturer stopped production',
  });

  const pausedProd = createBaseProduct({
    id: 'prod-paused',
    sku: 'SKU-PAUSED',
    name: 'Paused Seasonal Tea',
    stock: 0,
    minStockAlert: 10,
    isActive: false,
    catalogLifecycleStatus: 'TEMPORARILY_PAUSED',
  });

  const discReq = validateAndBuildUnmetDemandRequest({
    input: {
      productId: discontinuedProd.id,
      requestedQuantity: 8,
      unavailabilityReason: 'DISCONTINUED',
      confirmedPurchaseIntent: true,
      branchId: 'branch-main',
    },
    claimingUserId: INITIAL_USERS[0].id,
    serverUsers: INITIAL_USERS,
    catalogProducts: [discontinuedProd, pausedProd],
    existingRequests: [],
    now,
  });
  assert.equal(discReq.valid, true);

  const pausedReq = validateAndBuildUnmetDemandRequest({
    input: {
      productId: pausedProd.id,
      requestedQuantity: 8,
      unavailabilityReason: 'TEMPORARILY_UNAVAILABLE',
      confirmedPurchaseIntent: true,
      branchId: 'branch-main',
    },
    claimingUserId: INITIAL_USERS[0].id,
    serverUsers: INITIAL_USERS,
    catalogProducts: [discontinuedProd, pausedProd],
    existingRequests: [discReq.record!],
    now,
  });
  assert.equal(pausedReq.valid, true);

  const snapshot = buildAnalyticsSnapshotFromState({
    products: [discontinuedProd, pausedProd],
    transactions: [],
    customers: INITIAL_CUSTOMERS,
    stockMovements: [],
    users: INITIAL_USERS,
    exchangeRates: INITIAL_SETTINGS.exchangeRates,
    exchangeRateHistory: INITIAL_EXCHANGE_RATE_HISTORY,
    branches: DEFAULT_ANALYTICS_BRANCHES,
    unmetDemandRequests: [discReq.record!, pausedReq.record!],
  });

  const bundle = computeFullAnalyticsOverview(
    snapshot,
    { datePreset: '7d', currency: 'SDG', forecastHorizonDays: 7 },
    { userId: INITIAL_USERS[0].id, role: 'admin' }
  );

  // 1. Discontinued product must NOT appear in automatic purchase order replenishment recommendations
  const discRepl = bundle.intelligence.replenishmentRecommendations.find(
    (r) => r.productId === 'prod-disc'
  );
  assert.equal(
    discRepl,
    undefined,
    'DISCONTINUED product must be excluded from automatic replenishment recommendations'
  );

  // 2. Temporarily paused product with unmet demand MUST remain eligible for replenishment evaluation
  const pausedRepl = bundle.intelligence.replenishmentRecommendations.find(
    (r) => r.productId === 'prod-paused'
  );
  assert.ok(
    pausedRepl,
    'TEMPORARILY_PAUSED product must still be evaluated for replenishment'
  );
  assert.ok(pausedRepl.recommendedOrderUnits > 0);

  // 3. Discontinued product forecast must recommend 0 reorder units
  const discForecast = bundle.forecasts.productDemandForecasts.find(
    (f) => f.productId === 'prod-disc'
  );
  assert.ok(discForecast);
  assert.equal(discForecast.recommendedReorderUnits, 0);

  // 4. Unmet demand topRequestedProducts recommendation for DISCONTINUED advises replacement item & no auto-reorder
  const discTop = bundle.intelligence.unmetDemand.topRequestedProducts.find(
    (p) => p.productId === 'prod-disc'
  );
  assert.ok(discTop);
  assert.match(discTop.decisionRecommendationEn || '', /Discontinued SKU/i);
  assert.match(discTop.decisionRecommendationEn || '', /do not auto-reorder/i);
});

test('Phase 4.3: Batch-aware sellable stock deducts expired batch units without zeroing valid stock in forecasting and replenishment', () => {
  const now = new Date();
  // Product has 10 total physical units on shelf, but batch B-EXP (8 units) is expired while batch B-VALID (2 units) is valid.
  // Sellable stock must be 2 units (neither 10 nor 0), triggering replenishment because minStockAlert is 5.
  const batchedProduct = createBaseProduct({
    id: 'prod-batched',
    sku: 'SKU-BATCH',
    name: 'Organic Yogurt 500g',
    stock: 10,
    minStockAlert: 5,
    batches: [
      {
        id: 'batch-exp-1',
        batchNumber: 'B-EXP-01',
        expiryDate: '2025-01-15',
        quantityOnHand: 8,
        status: 'ACTIVE',
      },
      {
        id: 'batch-val-2',
        batchNumber: 'B-VAL-02',
        expiryDate: '2029-12-31',
        quantityOnHand: 2,
        status: 'ACTIVE',
      },
    ],
  });

  const snapshot = buildAnalyticsSnapshotFromState({
    products: [batchedProduct],
    transactions: [
      {
        id: 'sale-b1',
        idempotencyKey: 'idem-sale-b1',
        timestamp: now.toISOString(),
        items: [
          {
            productId: batchedProduct.id,
            productName: batchedProduct.name,
            sku: batchedProduct.sku,
            quantity: 7,
            unitPrice: 5000,
            discountPercent: 0,
            total: 35000,
          },
        ],
        subtotal: 35000,
        taxRatePercent: 0,
        taxAmount: 0,
        discountAmount: 0,
        grandTotal: 35000,
        paymentMethod: 'cash',
        amountTendered: 35000,
        changeDue: 0,
        status: 'completed',
        syncStatus: 'synced',
        cashierName: INITIAL_USERS[0].name,
        currency: 'SDG',
        exchangeRateUsed: 1,
      },
    ],
    customers: INITIAL_CUSTOMERS,
    stockMovements: [],
    users: INITIAL_USERS,
    exchangeRates: INITIAL_SETTINGS.exchangeRates,
    exchangeRateHistory: INITIAL_EXCHANGE_RATE_HISTORY,
    branches: DEFAULT_ANALYTICS_BRANCHES,
    unmetDemandRequests: [],
  });

  const bundle = computeFullAnalyticsOverview(
    snapshot,
    { datePreset: '7d', currency: 'SDG', forecastHorizonDays: 7 },
    { userId: INITIAL_USERS[0].id, role: 'admin' }
  );

  // 1. Forecast uses sellable stock = 2 (not 10 and not 0)
  const fc = bundle.forecasts.productDemandForecasts.find(
    (f) => f.productId === 'prod-batched'
  );
  assert.ok(fc, 'Expected forecast item for prod-batched');
  assert.equal(fc.currentStock, 2);

  // 2. Smart Replenishment triggers because sellable stock (2) <= reorderPoint, and flags expirationRiskDetected = true
  const repl = bundle.intelligence.replenishmentRecommendations.find(
    (r) => r.productId === 'prod-batched'
  );
  assert.ok(
    repl,
    'Expected replenishment recommendation when valid sellable stock (2) is below minStock (5)'
  );
  assert.equal(repl.currentStock, 2);
  assert.equal(repl.expirationRiskDetected, true);
});
