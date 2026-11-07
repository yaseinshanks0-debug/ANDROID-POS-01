import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildUnavailableProductsKnowledgeBase,
  matchesUnavailableProductQuery,
  normalizeUnavailableSearchText,
  searchUnavailableProductsKnowledgeBase,
  validateAndBuildUnmetDemandRequest,
} from './unmet-demand.validation';
import { computeUnmetDemandAnalytics } from './calculations/unmet-demand.metrics';
import { AnalyticsDatasetSnapshot, AnalyticsFilterParams, AnalyticsUserContext } from './analytics.types';
import { INITIAL_USERS } from '../lib/initial-data';

describe('Unavailable Products Knowledge Base & Multi-Word/Character Search', () => {
  const mockCashier = INITIAL_USERS[2];

  it('normalizes Arabic text variations (أ/إ/آ -> ا, ة -> ه, ى -> ي)', () => {
    assert.equal(
      normalizeUnavailableSearchText('كريم باريس الأبيض بالكرياتين'),
      'كريم باريس الابيض بالكرياتين'
    );
  });

  it('matches unavailable product by any word, partial word, or single character (User Scenario: كريم باريس الابيض / كريم باري بالكرياتن)', () => {
    const productFields = ['كريم باريس الابيض', 'عناية بالبشرة والشعر'];

    // Single character
    assert.equal(matchesUnavailableProductQuery(productFields, 'ك'), true);
    assert.equal(matchesUnavailableProductQuery(productFields, 'ب'), true);

    // Any single word
    assert.equal(matchesUnavailableProductQuery(productFields, 'كريم'), true);
    assert.equal(matchesUnavailableProductQuery(productFields, 'باريس'), true);
    assert.equal(matchesUnavailableProductQuery(productFields, 'الابيض'), true);
    assert.equal(matchesUnavailableProductQuery(productFields, 'الأبيض'), true);

    // Partial word ("باري")
    assert.equal(matchesUnavailableProductQuery(productFields, 'باري'), true);

    // Multi-word combinations
    assert.equal(matchesUnavailableProductQuery(productFields, 'كريم باريس'), true);
    assert.equal(matchesUnavailableProductQuery(productFields, 'كريم باري'), true);

    // Customer asks for variant "كريم باري بالكرياتن" -> still surfaces "كريم باريس الابيض" so cashier can select it!
    assert.equal(
      matchesUnavailableProductQuery(productFields, 'كريم باري بالكرياتن'),
      true
    );

    // Unrelated query does not match
    assert.equal(matchesUnavailableProductQuery(productFields, 'بطارية ليثيوم'), false);
  });

  it('accumulates multiple inquiries across different timestamps for the same selected unavailable product and surfaces decision support in reports', () => {
    const t1 = new Date('2026-03-10T09:15:00.000Z');
    const t2 = new Date('2026-03-11T14:30:00.000Z');
    const t3 = new Date('2026-03-12T19:45:00.000Z');

    // 1. First inquiry: customer asks for "كريم باريس الابيض"
    const res1 = validateAndBuildUnmetDemandRequest({
      input: {
        isRegisteredProduct: false,
        productNameSnapshot: 'كريم باريس الابيض',
        categorySnapshot: 'مستحضرات تجميل',
        requestedQuantity: 1,
        saleUnitMode: 'unit',
        unavailabilityReason: 'NOT_STOCKED',
        confirmedPurchaseIntent: true,
        requestedTimestamp: t1.toISOString(),
      },
      claimingUserId: mockCashier.id,
      serverUsers: [mockCashier],
      catalogProducts: [],
      existingRequests: [],
      now: t1,
    });
    assert.equal(res1.valid, true);
    assert.ok(res1.record);

    // 2. Build knowledge base and search when second customer asks for "كريم باري بالكرياتن" or types "كريم باريس" / "باريس" / "كريم"
    const kbAfter1 = buildUnavailableProductsKnowledgeBase([res1.record], []);
    assert.equal(kbAfter1.length, 1);
    assert.equal(kbAfter1[0].productName, 'كريم باريس الابيض');
    assert.equal(kbAfter1[0].inquiryCount, 1);

    for (const q of ['كريم باريس', 'كريم', 'باريس', 'باري', 'كريم باري بالكرياتن']) {
      const matches = searchUnavailableProductsKnowledgeBase(kbAfter1, q, {
        onlyUnregisteredOrPreviouslyAsked: true,
      });
      assert.equal(matches.length, 1, `Expected match for query: ${q}`);
      assert.equal(matches[0].productName, 'كريم باريس الابيض');
    }

    // 3. Cashier selects "كريم باريس الابيض" from knowledge base at t2 and t3
    const selectedItem = searchUnavailableProductsKnowledgeBase(kbAfter1, 'باريس')[0];
    const res2 = validateAndBuildUnmetDemandRequest({
      input: {
        isRegisteredProduct: false,
        productNameSnapshot: selectedItem.productName,
        categorySnapshot: selectedItem.category,
        requestedQuantity: 2,
        saleUnitMode: 'unit',
        unavailabilityReason: 'NOT_STOCKED',
        confirmedPurchaseIntent: true,
        requestedTimestamp: t2.toISOString(),
        allowRapidRepeat: true,
      },
      claimingUserId: mockCashier.id,
      serverUsers: [mockCashier],
      catalogProducts: [],
      existingRequests: [res1.record],
      now: t2,
    });
    assert.equal(res2.valid, true);
    assert.ok(res2.record);

    const res3 = validateAndBuildUnmetDemandRequest({
      input: {
        isRegisteredProduct: false,
        productNameSnapshot: selectedItem.productName,
        categorySnapshot: selectedItem.category,
        requestedQuantity: 1,
        saleUnitMode: 'unit',
        unavailabilityReason: 'NOT_STOCKED',
        confirmedPurchaseIntent: false,
        requestedTimestamp: t3.toISOString(),
        allowRapidRepeat: true,
      },
      claimingUserId: mockCashier.id,
      serverUsers: [mockCashier],
      catalogProducts: [],
      existingRequests: [res1.record, res2.record],
      now: t3,
    });
    assert.equal(res3.valid, true);
    assert.ok(res3.record);

    const allRequests = [res1.record, res2.record, res3.record];
    const kbAfter3 = buildUnavailableProductsKnowledgeBase(allRequests, []);
    assert.equal(kbAfter3.length, 1);
    assert.equal(kbAfter3[0].inquiryCount, 3);
    assert.equal(kbAfter3[0].totalRequestedBaseUnits, 4);
    assert.deepEqual(kbAfter3[0].inquiryTimestamps, [
      t3.toISOString(),
      t2.toISOString(),
      t1.toISOString(),
    ]);

    // 4. Verify Reports Analytics aggregates all 3 inquiries with timestamps & decision recommendation
    const dataset: AnalyticsDatasetSnapshot = {
      transactions: [],
      products: [],
      expenses: [],
      supplierPurchases: [],
      stockMovements: [],
      unmetDemandRequests: allRequests,
      branches: [{ id: 'branch-main', name: 'Main Branch', nameAr: 'الفرع الرئيسي' }],
      users: [{ id: mockCashier.id, name: mockCashier.name, role: 'cashier' }],
      exchangeRates: { SDG: 1, USD: 2700 },
    } as any;
    const filters: AnalyticsFilterParams = {
      datePreset: '30d',
      currency: 'SDG',
    };
    const userCtx: AnalyticsUserContext = {
      userId: 'u-owner',
      userName: 'Owner',
      role: 'owner',
      assignedBranchId: 'branch-main',
      canViewAllBranches: true,
      canViewCostAndMargin: true,
      canViewCustomerPII: true,
    } as any;

    const mockSales: any = {
      summary: { unitsSold: 0 },
      dailySeries: [],
      byProduct: [],
    };
    const mockInventory: any = {
      products: [],
    };
    const unmetAnalytics = computeUnmetDemandAnalytics(
      dataset,
      filters,
      mockSales,
      mockInventory,
      userCtx,
      new Date('2026-03-13T12:00:00Z')
    );

    assert.equal(unmetAnalytics.summary.totalInquiries, 3);
    assert.equal(unmetAnalytics.topRequestedProducts.length, 1);
    const topItem = unmetAnalytics.topRequestedProducts[0];
    assert.equal(topItem.productName, 'كريم باريس الابيض');
    assert.equal(topItem.inquiryCount, 3);
    assert.equal(topItem.requestedBaseUnitsTotal, 4);
    assert.deepEqual(topItem.inquiryTimestamps, [
      t3.toISOString(),
      t2.toISOString(),
      t1.toISOString(),
    ]);
    assert.equal(topItem.decisionPriority, 'CRITICAL');
    assert.ok(topItem.decisionRecommendationAr?.includes('3 مرات'));
  });
});
