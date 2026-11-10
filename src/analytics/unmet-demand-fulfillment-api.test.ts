/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildAnalyticsSnapshotFromState,
  cancelUnmetDemandRequestServer,
  fulfillUnmetDemandRequestFromSaleServer,
  reverseUnmetDemandFulfillmentsBySaleServer,
} from './analytics.repository';
import { validateAndBuildUnmetDemandRequest } from './unmet-demand.validation';
import { POSUser, Product, Transaction } from '../lib/types';

function createFixtureDataset() {
  const users: Array<POSUser & { companyId?: string; branchId?: string }> = [
    {
      id: 'usr-admin-alpha',
      name: 'Alpha Admin',
      role: 'admin',
      pin: '1111',
      companyId: 'comp-alpha',
      branchId: 'branch-main',
      terminalName: 'POS Terminal 01',
      avatarColor: 'bg-amber-600',
      isActive: true,
      permissions: {} as any,
      lastActiveAt: '2026-11-10T08:00:00.000Z',
    },
    {
      id: 'usr-cashier-main',
      name: 'Main Cashier',
      role: 'cashier',
      pin: '2222',
      companyId: 'comp-alpha',
      branchId: 'branch-main',
      terminalName: 'POS Terminal 01',
      avatarColor: 'bg-emerald-600',
      isActive: true,
      permissions: {} as any,
      lastActiveAt: '2026-11-10T08:00:00.000Z',
    },
    {
      id: 'usr-cashier-bahri',
      name: 'Bahri Cashier',
      role: 'cashier',
      pin: '3333',
      companyId: 'comp-alpha',
      branchId: 'branch-bahri',
      terminalName: 'POS Terminal 02',
      avatarColor: 'bg-sky-600',
      isActive: true,
      permissions: {} as any,
      lastActiveAt: '2026-11-10T08:00:00.000Z',
    },
    {
      id: 'usr-admin-beta',
      name: 'Beta Admin',
      role: 'admin',
      pin: '4444',
      companyId: 'comp-beta',
      branchId: 'branch-main',
      terminalName: 'POS Terminal 01',
      avatarColor: 'bg-purple-600',
      isActive: true,
      permissions: {} as any,
      lastActiveAt: '2026-11-10T08:00:00.000Z',
    },
  ];

  const products: Product[] = [
    {
      id: 'prod-sugar-5kg',
      name: 'White Sugar 5kg',
      nameAr: 'سكر أبيض 5 كجم',
      sku: 'SUG-5KG',
      barcode: '628100000101',
      sellingPrice: 12000,
      costPrice: 9500,
      stock: 0,
      minStockAlert: 5,
      category: 'Groceries',
      emoji: '🧂',
      colorHex: '#fef3c7',
      updatedAt: '2026-11-10T08:00:00.000Z',
    },
  ];

  const vRes = validateAndBuildUnmetDemandRequest({
    input: {
      companyId: 'comp-alpha',
      productId: 'prod-sugar-5kg',
      branchId: 'branch-main',
      requestedQuantity: 5,
      saleUnitMode: 'unit',
      unavailabilityReason: 'OUT_OF_STOCK',
      confirmedPurchaseIntent: true,
    },
    claimingUserId: 'usr-cashier-main',
    serverUsers: users,
    catalogProducts: products,
    existingRequests: [],
    exchangeRates: { SDG: 1 },
    now: new Date('2026-11-10T08:00:00.000Z'),
  });

  assert.equal(vRes.valid, true);
  assert.ok(vRes.record);

  const transactions: Transaction[] = [
    {
      id: 'TXN-ALPHA-001',
      idempotencyKey: 'idem-tx-001',
      timestamp: '2026-11-10T10:00:00.000Z',
      currency: 'SDG',
      items: [
        {
          productId: 'prod-sugar-5kg',
          productName: 'White Sugar 5kg',
          sku: 'SUG-5KG',
          quantity: 3,
          unitPrice: 12000,
          discountPercent: 0,
          total: 36000,
        },
      ],
      subtotal: 36000,
      taxRatePercent: 0,
      taxAmount: 0,
      discountAmount: 0,
      grandTotal: 36000,
      paymentMethod: 'cash',
      amountTendered: 36000,
      changeDue: 0,
      cashierName: 'Main Cashier',
      status: 'completed',
      syncStatus: 'synced',
    },
    {
      id: 'TXN-ALPHA-002',
      idempotencyKey: 'idem-tx-002',
      timestamp: '2026-11-10T12:00:00.000Z',
      currency: 'SDG',
      items: [
        {
          productId: 'prod-sugar-5kg',
          productName: 'White Sugar 5kg',
          sku: 'SUG-5KG',
          quantity: 2,
          unitPrice: 12000,
          discountPercent: 0,
          total: 24000,
        },
      ],
      subtotal: 24000,
      taxRatePercent: 0,
      taxAmount: 0,
      discountAmount: 0,
      grandTotal: 24000,
      paymentMethod: 'cash',
      amountTendered: 24000,
      changeDue: 0,
      cashierName: 'Main Cashier',
      status: 'completed',
      syncStatus: 'synced',
    },
    {
      id: 'TXN-VOIDED-003',
      idempotencyKey: 'idem-tx-003',
      timestamp: '2026-11-10T13:00:00.000Z',
      currency: 'SDG',
      items: [
        {
          productId: 'prod-sugar-5kg',
          productName: 'White Sugar 5kg',
          sku: 'SUG-5KG',
          quantity: 5,
          unitPrice: 12000,
          discountPercent: 0,
          total: 60000,
        },
      ],
      subtotal: 60000,
      taxRatePercent: 0,
      taxAmount: 0,
      discountAmount: 0,
      grandTotal: 60000,
      paymentMethod: 'cash',
      amountTendered: 60000,
      changeDue: 0,
      cashierName: 'Main Cashier',
      status: 'voided',
      syncStatus: 'synced',
    },
  ];

  const snapshot = buildAnalyticsSnapshotFromState({
    users,
    products,
    transactions,
    unmetDemandRequests: [vRes.record!],
  });

  return { snapshot, initialRequest: vRes.record! };
}

test('Phase 3.1 — Sale-linked fulfillment tracks partial fulfillment and full fulfillment across verified sales while rejecting voided or duplicate sale links', async () => {
  const { snapshot, initialRequest } = createFixtureDataset();

  // 1. Reject linking to a voided sale transaction
  const voidAttempt = await fulfillUnmetDemandRequestFromSaleServer({
    requestId: initialRequest.id,
    saleTransactionId: 'TXN-VOIDED-003',
    claimingUserId: 'usr-cashier-main',
    companyId: 'comp-alpha',
    datasetOverride: snapshot,
  });
  assert.equal(voidAttempt.valid, false);
  assert.equal(voidAttempt.statusCode, 409);
  assert.equal(voidAttempt.errorCode, 'SALE_TRANSACTION_VOIDED');

  // 2. Partial fulfillment from TXN-ALPHA-001 (3 of 5 base units)
  const partialRes = await fulfillUnmetDemandRequestFromSaleServer({
    requestId: initialRequest.id,
    saleTransactionId: 'TXN-ALPHA-001',
    claimingUserId: 'usr-cashier-main',
    companyId: 'comp-alpha',
    datasetOverride: snapshot,
  });
  assert.equal(partialRes.valid, true);
  assert.ok(partialRes.record);
  assert.equal(partialRes.record!.fulfilledBaseUnits, 3);
  assert.equal(partialRes.record!.remainingUnfulfilledBaseUnits, 2);
  assert.equal(partialRes.record!.fulfillmentStatus, 'partially_fulfilled');
  assert.equal(partialRes.record!.fulfillments?.length, 1);

  // Update snapshot with partially fulfilled record
  snapshot.unmetDemandRequests = [partialRes.record!];

  // 3. Reject duplicate linking of the exact same sale line
  const dupAttempt = await fulfillUnmetDemandRequestFromSaleServer({
    requestId: initialRequest.id,
    saleTransactionId: 'TXN-ALPHA-001',
    claimingUserId: 'usr-cashier-main',
    companyId: 'comp-alpha',
    datasetOverride: snapshot,
  });
  assert.equal(dupAttempt.valid, false);
  assert.equal(dupAttempt.statusCode, 409);
  assert.equal(dupAttempt.errorCode, 'DUPLICATE_SALE_LINE_FULFILLMENT');

  // 4. Complete fulfillment from TXN-ALPHA-002 (remaining 2 of 5 base units)
  const fullRes = await fulfillUnmetDemandRequestFromSaleServer({
    requestId: initialRequest.id,
    saleTransactionId: 'TXN-ALPHA-002',
    claimingUserId: 'usr-cashier-main',
    companyId: 'comp-alpha',
    datasetOverride: snapshot,
  });
  assert.equal(fullRes.valid, true);
  assert.ok(fullRes.record);
  assert.equal(fullRes.record!.fulfilledBaseUnits, 5);
  assert.equal(fullRes.record!.remainingUnfulfilledBaseUnits, 0);
  assert.equal(fullRes.record!.fulfillmentStatus, 'fulfilled_later');
  assert.equal(fullRes.record!.fulfillments?.length, 2);
});

test('Phase 3.2 — Voiding or returning a linked sale automatically reverses fulfillment and restores remainingUnfulfilledBaseUnits while preserving history', async () => {
  const { snapshot, initialRequest } = createFixtureDataset();

  const partialRes = await fulfillUnmetDemandRequestFromSaleServer({
    requestId: initialRequest.id,
    saleTransactionId: 'TXN-ALPHA-001',
    claimingUserId: 'usr-cashier-main',
    companyId: 'comp-alpha',
    datasetOverride: snapshot,
  });
  snapshot.unmetDemandRequests = [partialRes.record!];

  const fullRes = await fulfillUnmetDemandRequestFromSaleServer({
    requestId: initialRequest.id,
    saleTransactionId: 'TXN-ALPHA-002',
    claimingUserId: 'usr-cashier-main',
    companyId: 'comp-alpha',
    datasetOverride: snapshot,
  });
  snapshot.unmetDemandRequests = [fullRes.record!];
  assert.equal(fullRes.record!.fulfillmentStatus, 'fulfilled_later');

  // 1. Reverse TXN-ALPHA-002 due to void -> reverts to partially_fulfilled (3 fulfilled, 2 remaining)
  const voidReversal = await reverseUnmetDemandFulfillmentsBySaleServer({
    saleTransactionId: 'TXN-ALPHA-002',
    reversalReason: 'reversed_by_void',
    reversalReferenceId: 'VOID-002',
    claimingUserId: 'usr-admin-alpha',
    companyId: 'comp-alpha',
    datasetOverride: snapshot,
  });
  assert.equal(voidReversal.valid, true);
  assert.equal(voidReversal.affectedRecords?.length, 1);
  const afterVoid = voidReversal.affectedRecords![0];
  assert.equal(afterVoid.fulfilledBaseUnits, 3);
  assert.equal(afterVoid.remainingUnfulfilledBaseUnits, 2);
  assert.equal(afterVoid.fulfillmentStatus, 'partially_fulfilled');
  assert.equal(afterVoid.fulfillments?.length, 2, 'Historical fulfillment links must be preserved');

  snapshot.unmetDemandRequests = [afterVoid];

  // 2. Reverse TXN-ALPHA-001 due to return -> reverts to unfulfilled (0 fulfilled, 5 remaining)
  const returnReversal = await reverseUnmetDemandFulfillmentsBySaleServer({
    saleTransactionId: 'TXN-ALPHA-001',
    reversalReason: 'reversed_by_return',
    reversalReferenceId: 'RET-001',
    claimingUserId: 'usr-admin-alpha',
    companyId: 'comp-alpha',
    datasetOverride: snapshot,
  });
  assert.equal(returnReversal.valid, true);
  const afterReturn = returnReversal.affectedRecords![0];
  assert.equal(afterReturn.fulfilledBaseUnits, 0);
  assert.equal(afterReturn.remainingUnfulfilledBaseUnits, 5);
  assert.equal(afterReturn.fulfillmentStatus, 'unfulfilled');
  assert.equal(afterReturn.fulfillments?.length, 2, 'Both reversed links remain in audit trail');
});

test('Phase 3.3 — Manual fulfillment status overrides are prohibited; cancellation requires a reason', async () => {
  const { snapshot, initialRequest } = createFixtureDataset();

  // 1. Attempt manual override to 'fulfilled_later' without sale link -> blocked
  const manualFulfillAttempt = await cancelUnmetDemandRequestServer({
    requestId: initialRequest.id,
    requestedStatus: 'fulfilled_later',
    cancelReason: 'Manually marking as fulfilled',
    claimingUserId: 'usr-admin-alpha',
    companyId: 'comp-alpha',
    datasetOverride: snapshot,
  });
  assert.equal(manualFulfillAttempt.valid, false);
  assert.equal(manualFulfillAttempt.statusCode, 400);
  assert.equal(manualFulfillAttempt.errorCode, 'MANUAL_FULFILLMENT_PROHIBITED');

  // 2. Attempt cancellation without reason -> blocked
  const emptyReasonAttempt = await cancelUnmetDemandRequestServer({
    requestId: initialRequest.id,
    requestedStatus: 'cancelled',
    cancelReason: '',
    claimingUserId: 'usr-admin-alpha',
    companyId: 'comp-alpha',
    datasetOverride: snapshot,
  });
  assert.equal(emptyReasonAttempt.valid, false);
  assert.equal(emptyReasonAttempt.statusCode, 400);
  assert.equal(emptyReasonAttempt.errorCode, 'MISSING_CANCEL_REASON');

  // 3. Valid cancellation with reason -> succeeds and preserves historical record
  const validCancel = await cancelUnmetDemandRequestServer({
    requestId: initialRequest.id,
    requestedStatus: 'cancelled',
    cancelReason: 'Customer purchased an alternative brand',
    claimingUserId: 'usr-admin-alpha',
    companyId: 'comp-alpha',
    datasetOverride: snapshot,
  });
  assert.equal(validCancel.valid, true);
  assert.equal(validCancel.record?.fulfillmentStatus, 'cancelled');
  assert.ok(validCancel.record?.notes?.includes('Customer purchased an alternative brand'));
});

test('Phase 3.4 — Enforces strict company (tenant) isolation and branch isolation on fulfillment and cancellation actions', async () => {
  const { snapshot, initialRequest } = createFixtureDataset();

  // 1. Cross-company fulfillment attempt by comp-beta admin on comp-alpha request -> 403 TENANT_ISOLATION_VIOLATION
  const crossTenantAttempt = await fulfillUnmetDemandRequestFromSaleServer({
    requestId: initialRequest.id,
    saleTransactionId: 'TXN-ALPHA-001',
    claimingUserId: 'usr-admin-beta',
    companyId: 'comp-beta',
    datasetOverride: snapshot,
  });
  assert.equal(crossTenantAttempt.valid, false);
  assert.equal(crossTenantAttempt.statusCode, 403);
  assert.equal(crossTenantAttempt.errorCode, 'TENANT_ISOLATION_VIOLATION');

  // 2. Cross-branch fulfillment attempt by branch-bahri cashier on branch-main request -> 403 BRANCH_ISOLATION_VIOLATION
  const crossBranchAttempt = await fulfillUnmetDemandRequestFromSaleServer({
    requestId: initialRequest.id,
    saleTransactionId: 'TXN-ALPHA-001',
    claimingUserId: 'usr-cashier-bahri',
    companyId: 'comp-alpha',
    datasetOverride: snapshot,
  });
  assert.equal(crossBranchAttempt.valid, false);
  assert.equal(crossBranchAttempt.statusCode, 403);
  assert.equal(crossBranchAttempt.errorCode, 'BRANCH_ISOLATION_VIOLATION');
});
