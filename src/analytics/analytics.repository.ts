/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import { getDataDir } from '../server/runtime-paths.ts';
import {
  INITIAL_CUSTOMERS,
  INITIAL_EXCHANGE_RATE_HISTORY,
  INITIAL_PRODUCTS,
  INITIAL_SETTINGS,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_TRANSACTIONS,
  INITIAL_USERS,
} from '../lib/initial-data';
import { DEFAULT_BASELINE_EXCHANGE_RATES } from '../lib/pos-calculations';
import { Customer, Product, StockMovement, Transaction } from '../lib/types';
import {
  AnalyticsDatasetSnapshot,
  PurchaseOrderRecordInput,
  ReturnRecordInput,
  UnmetDemandFulfillmentLinkRecord,
  UnmetDemandFulfillmentLinkStatus,
  UnmetDemandRequestInput,
  UnmetDemandRequestRecord,
} from './analytics.types';
import {
  buildAnalyticsSnapshotFromState,
  DEFAULT_ANALYTICS_BRANCHES,
  deduplicateCustomers,
  deduplicateProducts,
  deduplicateReturns,
  deduplicateStockMovements,
  deduplicateTransactions,
  deduplicateUnmetDemandRequests,
  normalizeUnmetDemandRequestFulfillment,
} from './analytics.snapshot';
import {
  computeUnmetDemandFulfillmentState,
  UnmetDemandValidationResult,
  validateAndBuildUnmetDemandRequest,
} from './unmet-demand.validation';

export { buildAnalyticsSnapshotFromState, DEFAULT_ANALYTICS_BRANCHES };

// Short-TTL in-memory snapshot cache to prevent repeated disk/DB scans on rapid dashboard tab switches
let cachedSnapshot: {
  snapshot: AnalyticsDatasetSnapshot;
  expiresAt: number;
  storeFileMtimeMs: number;
  prodFileMtimeMs: number;
} | null = null;

const CACHE_TTL_MS = 1500;

function getFileMtimeMs(filePath: string): number {
  try {
    if (fs.existsSync(filePath)) {
      return fs.statSync(filePath).mtimeMs;
    }
  } catch {
    // Ignore
  }
  return 0;
}

export function invalidateAnalyticsSnapshotCache(): void {
  cachedSnapshot = null;
}

export interface LoadAnalyticsDatasetOptions {
  sinceDate?: Date;
  statusFilter?: 'completed' | 'voided' | 'all';
  companyId?: string;
}

/**
 * Loads the active operational dataset on the backend by reading `.data/store-state.json`,
 * `.data/products.json`, and PostgreSQL repositories/tables (`products-repo`, `currencies-repo`,
 * `sales`, `sale_items`, `returns`, `return_items`, `purchases`, `stock_movements`, `customers`, `users`, `unmet_demand_requests`, `unmet_demand_fulfillments`)
 * in a strictly read-only, deduplicated manner with SQL date/status predicate pushdown (PERF-05).
 */
export async function loadServerAnalyticsDataset(
  options?: LoadAnalyticsDatasetOptions
): Promise<AnalyticsDatasetSnapshot> {
  const dataDir = getDataDir();
  const stateFile = path.join(dataDir, 'store-state.json');
  const prodFile = path.join(dataDir, 'products.json');
  const storeMtime = getFileMtimeMs(stateFile);
  const prodMtime = getFileMtimeMs(prodFile);

  const hasCustomSqlScope = Boolean(
    options?.sinceDate ||
      (options?.statusFilter && options.statusFilter !== 'completed') ||
      (options?.companyId && options.companyId !== 'comp-default')
  );

  if (
    !hasCustomSqlScope &&
    cachedSnapshot &&
    Date.now() < cachedSnapshot.expiresAt &&
    cachedSnapshot.storeFileMtimeMs === storeMtime &&
    cachedSnapshot.prodFileMtimeMs === prodMtime
  ) {
    return cachedSnapshot.snapshot;
  }

  let localStoreState: any = null;
  let localProducts: Product[] | null = null;

  try {
    if (storeMtime > 0) {
      const raw = fs.readFileSync(stateFile, 'utf-8');
      localStoreState = JSON.parse(raw);
    }
  } catch {
    // Ignore read errors and fall back cleanly
  }

  try {
    if (prodMtime > 0) {
      const raw = fs.readFileSync(prodFile, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        localProducts = parsed;
      }
    }
  } catch {
    // Ignore read errors
  }

  let repoProducts: Product[] | null = null;
  let repoRates: Record<string, number> = {};
  const pgTransactions: Transaction[] = [];
  const pgReturns: ReturnRecordInput[] = [];
  const pgPurchases: PurchaseOrderRecordInput[] = [];
  const pgStockMovements: StockMovement[] = [];
  const pgCustomers: Customer[] = [];
  const pgUsers: any[] = [];
  const pgUnmetDemand: UnmetDemandRequestRecord[] = [];

  try {
    const { getAllProducts } = await import('../db/products-repo');
    const fetched = await getAllProducts();
    if (Array.isArray(fetched) && fetched.length > 0) {
      repoProducts = fetched.map((p) => ({
        ...p,
        nameAr: p.nameAr ?? undefined,
        description: p.description ?? undefined,
        descriptionAr: p.descriptionAr ?? undefined,
        categoryAr: p.categoryAr ?? undefined,
      })) as unknown as Product[];
    }
  } catch {
    // Fallback to localProducts / INITIAL_PRODUCTS
  }

  try {
    const { getEffectiveExchangeRates } = await import('../db/currencies-repo');
    const effRates = await getEffectiveExchangeRates();
    if (Array.isArray(effRates)) {
      for (const r of effRates) {
        if (r.isActive && r.targetCurrency === 'SDG' && Number(r.rate) > 0) {
          repoRates[r.sourceCurrency.toUpperCase()] = Number(r.rate);
        }
      }
    }
  } catch {
    // Fallback to localStoreState exchangeRates
  }

  // Query PostgreSQL operational tables if `db` is connected (strictly SELECT-only with SQL predicate pushdown)
  try {
    const { db } = await import('../db/index');
    if (db) {
      const schema = await import('../db/schema');
      const { and, desc, eq, gte } = await import('drizzle-orm');

      // Default analytical lookback horizon (370 days covers full YTD + 90d + prior-period comparison)
      const defaultCutoffDate = new Date(Date.now() - 370 * 24 * 3600 * 1000);
      const effectiveSinceDate = options?.sinceDate || defaultCutoffDate;

      const salesConditions = [gte(schema.sales.timestamp, effectiveSinceDate)];
      if (options?.statusFilter && options.statusFilter !== 'all') {
        salesConditions.push(eq(schema.sales.status, options.statusFilter));
      }

      const [
        dbSales,
        dbSaleItems,
        dbReturns,
        dbReturnItems,
        dbPurchases,
        dbPurchaseItems,
        dbMovements,
        dbCustomers,
        dbUsers,
        dbUnmetDemand,
        dbUnmetFulfillments,
      ] = await Promise.all([
        db
          .select()
          .from(schema.sales)
          .where(and(...salesConditions))
          .orderBy(desc(schema.sales.timestamp))
          .catch(() => []),
        db.select().from(schema.saleItems).catch(() => []),
        db
          .select()
          .from(schema.returns)
          .where(gte(schema.returns.createdAt, effectiveSinceDate))
          .catch(() => []),
        db.select().from(schema.returnItems).catch(() => []),
        db
          .select()
          .from(schema.purchases)
          .where(gte(schema.purchases.invoiceDate, effectiveSinceDate))
          .catch(() => []),
        db.select().from(schema.purchaseItems).catch(() => []),
        db
          .select()
          .from(schema.stockMovements)
          .where(gte(schema.stockMovements.timestamp, effectiveSinceDate))
          .orderBy(desc(schema.stockMovements.timestamp))
          .catch(() => []),
        db.select().from(schema.customers).catch(() => []),
        db.select().from(schema.users).catch(() => []),
        db
          .select()
          .from(schema.unmetDemandRequests)
          .where(gte(schema.unmetDemandRequests.requestedTimestamp, effectiveSinceDate))
          .orderBy(desc(schema.unmetDemandRequests.requestedTimestamp))
          .catch(() => []),
        db
          .select()
          .from(schema.unmetDemandFulfillments)
          .orderBy(desc(schema.unmetDemandFulfillments.fulfilledAt))
          .catch(() => []),
      ]);

      if (Array.isArray(dbUsers) && dbUsers.length > 0) {
        for (const u of dbUsers) {
          if (u && u.isActive !== false) {
            pgUsers.push({
              id: u.id,
              companyId: u.companyId || 'comp-default',
              name: u.name,
              role:
                u.roleId === 'admin' ||
                u.roleId === 'manager' ||
                u.roleId === 'cashier' ||
                u.roleId === 'inventory_clerk'
                  ? u.roleId
                  : 'cashier',
              branchId: u.branchId || undefined,
              pin: u.pinCode || '0000',
            });
          }
        }
      }

      if (dbSales.length > 0) {
        const itemsBySaleId = new Map<string, typeof dbSaleItems>();
        for (const si of dbSaleItems) {
          const list = itemsBySaleId.get(si.saleId) || [];
          list.push(si);
          itemsBySaleId.set(si.saleId, list);
        }
        for (const s of dbSales) {
          const sItems = itemsBySaleId.get(s.id) || [];
          pgTransactions.push({
            id: s.transactionId || s.id,
            idempotencyKey: s.idempotencyKey,
            timestamp: s.timestamp instanceof Date ? s.timestamp.toISOString() : String(s.timestamp),
            currency: 'SDG',
            items: sItems.map((si) => ({
              productId: si.productId,
              productName: si.productName,
              sku: si.sku,
              quantity: Number(si.quantity),
              unitPrice: Number(si.unitPrice),
              discountPercent: Number(si.discountPercent || 0),
              total: Number(si.total),
            })),
            subtotal: Number(s.subtotal),
            taxRatePercent: Number(s.taxRatePercent),
            taxAmount: Number(s.taxAmount),
            discountAmount: Number(s.discountAmount || 0),
            grandTotal: Number(s.grandTotal),
            paymentMethod: (s.paymentMethod as any) || 'cash',
            amountTendered: Number(s.amountTendered),
            changeDue: Number(s.changeDue || 0),
            customerId: s.customerId || undefined,
            customerName: s.customerName || undefined,
            cashierName: s.cashierName || 'POS Terminal 01',
            status: s.status === 'voided' ? 'voided' : 'completed',
            syncStatus: 'synced',
          });
        }
      }

      if (dbReturns.length > 0) {
        const retItemsMap = new Map<string, typeof dbReturnItems>();
        for (const ri of dbReturnItems) {
          const list = retItemsMap.get(ri.returnId) || [];
          list.push(ri);
          retItemsMap.set(ri.returnId, list);
        }
        // Map sale internal UUID to transactionId if needed
        const saleUuidToTxId = new Map<string, string>();
        for (const s of dbSales) {
          saleUuidToTxId.set(s.id, s.transactionId || s.id);
        }
        for (const r of dbReturns) {
          const rItems = retItemsMap.get(r.id) || [];
          pgReturns.push({
            id: r.id,
            saleId: saleUuidToTxId.get(r.saleId) || r.saleId,
            timestamp: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
            reason: r.reason,
            refundTotal: Number(r.refundTotal),
            items: rItems.map((ri) => ({
              productId: ri.productId,
              quantity: Number(ri.quantity),
              refundAmount: Number(ri.refundAmount),
            })),
          });
        }
      }

      if (dbPurchases.length > 0) {
        const pItemsMap = new Map<string, typeof dbPurchaseItems>();
        for (const pi of dbPurchaseItems) {
          const list = pItemsMap.get(pi.purchaseId) || [];
          list.push(pi);
          pItemsMap.set(pi.purchaseId, list);
        }
        for (const p of dbPurchases) {
          const pItems = pItemsMap.get(p.id) || [];
          pgPurchases.push({
            id: p.id,
            purchaseNumber: p.purchaseNumber,
            branchId: p.branchId || undefined,
            totalAmount: Number(p.totalAmount),
            status: (p.status as any) || 'received',
            invoiceDate:
              p.invoiceDate instanceof Date ? p.invoiceDate.toISOString() : String(p.invoiceDate),
            items: pItems.map((pi) => ({
              productId: pi.productId,
              quantity: Number(pi.quantity),
              unitCost: Number(pi.unitCost),
              totalCost: Number(pi.totalCost),
            })),
          });
        }
      }

      for (const m of dbMovements) {
        pgStockMovements.push({
          id: m.id,
          timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : String(m.timestamp),
          productId: m.productId,
          productName: m.productName,
          type: (m.type as any) || 'audit',
          quantityChange: Number(m.quantityChange),
          previousStock: Number(m.previousStock),
          newStock: Number(m.newStock),
          reason: m.reason,
          referenceId: m.referenceId || undefined,
        });
      }

      for (const c of dbCustomers) {
        pgCustomers.push({
          id: c.id,
          name: c.name,
          phone: c.phone,
          email: c.email || undefined,
          notes: c.notes || undefined,
          totalSpent: Number(c.totalSpent || 0),
          transactionCount: Number(c.transactionCount || 0),
          loyaltyPoints: Number(c.loyaltyPoints || 0),
          createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : String(c.createdAt),
        });
      }

      const fulfillmentsByRequestId = new Map<string, UnmetDemandFulfillmentLinkRecord[]>();
      if (Array.isArray(dbUnmetFulfillments)) {
        for (const f of dbUnmetFulfillments) {
          if (!f || !f.requestId) continue;
          const link: UnmetDemandFulfillmentLinkRecord = {
            id: f.id,
            requestId: f.requestId,
            saleTransactionId: f.saleTransactionId,
            saleLineIndex: Number(f.saleLineIndex || 0),
            branchId: f.branchId || 'branch-main',
            productId: f.productId,
            fulfilledBaseUnits: Number(f.fulfilledBaseUnits || 1),
            status: (f.status as UnmetDemandFulfillmentLinkStatus) || 'active',
            fulfilledAt:
              f.fulfilledAt instanceof Date ? f.fulfilledAt.toISOString() : String(f.fulfilledAt),
            reversedAt:
              f.reversedAt instanceof Date
                ? f.reversedAt.toISOString()
                : f.reversedAt
                  ? String(f.reversedAt)
                  : null,
            reversalReferenceId: f.reversalReferenceId || null,
            recordedByUserId: f.recordedByUserId || null,
          };
          const list = fulfillmentsByRequestId.get(f.requestId) || [];
          list.push(link);
          fulfillmentsByRequestId.set(f.requestId, list);
        }
      }

      if (Array.isArray(dbUnmetDemand)) {
        for (const udr of dbUnmetDemand) {
          const reqBaseUnits = Number(udr.requestedBaseUnits || 1);
          const reqFulfilledUnits =
            udr.fulfilledBaseUnits !== null && udr.fulfilledBaseUnits !== undefined
              ? Number(udr.fulfilledBaseUnits)
              : udr.fulfillmentStatus === 'fulfilled_later'
                ? reqBaseUnits
                : 0;
          const reqRemainingUnits =
            udr.remainingUnfulfilledBaseUnits !== null &&
            udr.remainingUnfulfilledBaseUnits !== undefined
              ? Number(udr.remainingUnfulfilledBaseUnits)
              : Math.max(0, reqBaseUnits - reqFulfilledUnits);

          pgUnmetDemand.push(
            normalizeUnmetDemandRequestFulfillment({
              id: udr.id,
              companyId: udr.companyId || 'comp-default',
              idempotencyKey: udr.idempotencyKey,
              dedupeFingerprint: udr.dedupeFingerprint,
              productId: udr.productId || null,
              isRegisteredProduct: Boolean(udr.isRegisteredProduct),
              productNameSnapshot: udr.productNameSnapshot,
              productNameArSnapshot: udr.productNameArSnapshot || null,
              skuSnapshot: udr.skuSnapshot || null,
              barcode: udr.barcode || null,
              categorySnapshot: udr.categorySnapshot || 'General',
              branchId: udr.branchId || 'branch-main',
              terminalName: udr.terminalName || 'Main Terminal',
              requestedTimestamp:
                udr.requestedTimestamp instanceof Date
                  ? udr.requestedTimestamp.toISOString()
                  : String(udr.requestedTimestamp),
              requestedQuantity: Number(udr.requestedQuantity || 1),
              saleUnitMode: udr.saleUnitMode === 'pack' ? 'pack' : 'unit',
              requestedBaseUnits: reqBaseUnits,
              fulfilledBaseUnits: reqFulfilledUnits,
              remainingUnfulfilledBaseUnits: reqRemainingUnits,
              availableStockAtRequest:
                udr.availableStockAtRequest !== null && udr.availableStockAtRequest !== undefined
                  ? Number(udr.availableStockAtRequest)
                  : null,
              expiredUnitsObserved:
                udr.expiredUnitsObserved !== null && udr.expiredUnitsObserved !== undefined
                  ? Number(udr.expiredUnitsObserved)
                  : null,
              expiredBatchNumber: udr.expiredBatchNumber || null,
              expiredBatchDate:
                udr.expiredBatchDate instanceof Date
                  ? udr.expiredBatchDate.toISOString()
                  : udr.expiredBatchDate
                    ? String(udr.expiredBatchDate)
                    : null,
              substituteProductId: udr.substituteProductId || null,
              lastFulfilledAt:
                udr.lastFulfilledAt instanceof Date
                  ? udr.lastFulfilledAt.toISOString()
                  : udr.lastFulfilledAt
                    ? String(udr.lastFulfilledAt)
                    : null,
              fulfillments: fulfillmentsByRequestId.get(udr.id) || undefined,
              availabilityStatus: (udr.availabilityStatus as any) || 'OUT_OF_STOCK',
              unavailabilityReason: (udr.unavailabilityReason as any) || 'OUT_OF_STOCK',
              confirmedPurchaseIntent: Boolean(udr.confirmedPurchaseIntent),
              fulfillmentStatus: (udr.fulfillmentStatus as any) || 'unfulfilled',
              customerId: udr.customerId || null,
              customerReference: udr.customerReference || null,
              unitSellingPriceSnapshot:
                udr.unitSellingPriceSnapshot !== null && udr.unitSellingPriceSnapshot !== undefined
                  ? Number(udr.unitSellingPriceSnapshot)
                  : null,
              unitCostPriceSnapshot:
                udr.unitCostPriceSnapshot !== null && udr.unitCostPriceSnapshot !== undefined
                  ? Number(udr.unitCostPriceSnapshot)
                  : null,
              currencySnapshot: (udr.currencySnapshot as any) || 'SDG',
              exchangeRateSnapshot: Number(udr.exchangeRateSnapshot || 1),
              notes: udr.notes || null,
              recordedByUserId: udr.recordedByUserId || 'user-1',
              recordedByName: udr.recordedByName || 'POS Operator',
              createdAt:
                udr.createdAt instanceof Date
                  ? udr.createdAt.toISOString()
                  : String(udr.createdAt),
            })
          );
        }
      }
    }
  } catch {
    // Clean fallback if PostgreSQL is offline or unconfigured
  }

  // Reconcile & deduplicate across PostgreSQL, .data/store-state.json, and .data/products.json (NO fallback to demo seed data!)
  const DEMO_PROD_IDS = new Set([
    'prod-1',
    'prod-2',
    'prod-3',
    'prod-4',
    'prod-5',
    'prod-6',
    'prod-7',
    'prod-8',
    'prod-9',
    'prod-10',
  ]);
  const DEMO_TX_IDS = new Set(['TX-10420', 'TX-10419', 'TX-10418']);
  const DEMO_CUST_IDS = new Set(['cust-1', 'cust-2', 'cust-3', 'cust-4']);
  const DEMO_MOV_IDS = new Set(['mov-1', 'mov-2', 'mov-3', 'mov-4']);
  const DEMO_USER_IDS = new Set(['user-1', 'user-2', 'user-3', 'user-4']);

  const products = deduplicateProducts([
    ...(repoProducts || []),
    ...(Array.isArray(localProducts) ? localProducts : []),
    ...(Array.isArray(localStoreState?.products) ? localStoreState.products : []),
  ]).filter((p) => !DEMO_PROD_IDS.has(p.id));

  const stateTransactions: Transaction[] = Array.isArray(localStoreState?.transactions)
    ? localStoreState.transactions
    : [];
  const transactions = deduplicateTransactions([
    ...pgTransactions,
    ...stateTransactions,
  ]).filter((t) => !DEMO_TX_IDS.has(t.id));

  const stateReturns: ReturnRecordInput[] = Array.isArray(localStoreState?.returns)
    ? localStoreState.returns
    : [];
  const returns = deduplicateReturns([...pgReturns, ...stateReturns]);

  const statePurchases: PurchaseOrderRecordInput[] = Array.isArray(localStoreState?.purchases)
    ? localStoreState.purchases
    : [];
  const purchases = [...pgPurchases, ...statePurchases];

  const stateCustomers: Customer[] = Array.isArray(localStoreState?.customers)
    ? localStoreState.customers
    : [];
  const customers = deduplicateCustomers([...pgCustomers, ...stateCustomers]).filter(
    (c) => !DEMO_CUST_IDS.has(c.id)
  );

  const stateMovements: StockMovement[] = Array.isArray(localStoreState?.stockMovements)
    ? localStoreState.stockMovements
    : [];
  const stockMovements = deduplicateStockMovements([
    ...pgStockMovements,
    ...stateMovements,
  ]).filter((m) => !DEMO_MOV_IDS.has(m.id));

  const stateUnmetDemand: UnmetDemandRequestRecord[] = Array.isArray(
    localStoreState?.unmetDemandRequests
  )
    ? localStoreState.unmetDemandRequests
    : [];
  const allUnmetDemandRequests = deduplicateUnmetDemandRequests([
    ...pgUnmetDemand,
    ...stateUnmetDemand,
  ]);
  const targetCompanyId = options?.companyId ? options.companyId.trim() : '';
  const unmetDemandRequests = targetCompanyId
    ? allUnmetDemandRequests.filter((r) => {
        const recordCompanyId = r.companyId || 'comp-default';
        return recordCompanyId === targetCompanyId;
      })
    : allUnmetDemandRequests;

  const stateUsers = Array.isArray(localStoreState?.users) ? localStoreState.users : [];
  let platformUsers: any[] = [];
  let platformBranches: any[] = [];
  const platformFile = path.join(getDataDir(), 'platform-onboarding-state.json');
  const platformMtime = getFileMtimeMs(platformFile);
  try {
    if (platformMtime > 0) {
      const rawPlatform = JSON.parse(fs.readFileSync(platformFile, 'utf-8'));
      if (Array.isArray(rawPlatform?.users)) {
        platformUsers = rawPlatform.users.filter(
          (u: any) => u.companyId !== 'comp-demo-practice' && !DEMO_USER_IDS.has(u.id)
        );
      }
      if (Array.isArray(rawPlatform?.branches)) {
        platformBranches = rawPlatform.branches.filter(
          (b: any) => b.companyId !== 'comp-demo-practice'
        );
      }
    }
  } catch {
    // Ignore platform file parse issues
  }

  const usersById = new Map<string, any>();
  for (const u of [...stateUsers, ...pgUsers, ...platformUsers]) {
    if (u && u.id && !DEMO_USER_IDS.has(u.id)) {
      usersById.set(u.id, { ...(usersById.get(u.id) || {}), ...u });
    }
  }
  const users = Array.from(usersById.values());

  const branchesById = new Map<string, any>();
  for (const b of platformBranches) {
    if (b && b.id) {
      branchesById.set(b.id, { ...(branchesById.get(b.id) || {}), ...b });
    }
  }
  const branches = Array.from(branchesById.values());

  const exchangeRates: Record<string, number> = {
    ...(localStoreState?.settings?.exchangeRates || {}),
    ...repoRates,
    SDG: 1,
  };

  const exchangeRateHistory = Array.isArray(localStoreState?.exchangeRateHistory)
    ? localStoreState.exchangeRateHistory
    : [];

  const snapshot = buildAnalyticsSnapshotFromState({
    products,
    transactions,
    returns,
    purchases,
    customers,
    stockMovements,
    users,
    unmetDemandRequests,
    exchangeRates,
    exchangeRateHistory,
    branches,
    dataSource: 'postgresql_and_store_state',
  });

  if (!hasCustomSqlScope) {
    cachedSnapshot = {
      snapshot,
      expiresAt: Date.now() + CACHE_TTL_MS,
      storeFileMtimeMs: storeMtime + platformMtime,
      prodFileMtimeMs: prodMtime,
    };
  }

  return snapshot;
}

/**
 * Validates and persists a new Customer Demand Inquiry (Unmet Demand Request) into PostgreSQL
 * `unmet_demand_requests` and `.data/store-state.json` without touching sales, inventory, or accounting tables.
 */
export async function recordUnmetDemandRequestServer(params: {
  input: UnmetDemandRequestInput;
  claimingUserId?: string;
  companyId?: string;
}): Promise<UnmetDemandValidationResult> {
  const dataset = await loadServerAnalyticsDataset({ companyId: params.companyId });
  const matchedServerUser = dataset.users.find(
    (u) => u && u.id === (params.claimingUserId || params.input?.recordedByUserId)
  ) as (any & { companyId?: string }) | undefined;
  const resolvedCompanyId =
    params.companyId ||
    matchedServerUser?.companyId ||
    params.input?.companyId ||
    'comp-default';

  const validation = validateAndBuildUnmetDemandRequest({
    input: {
      ...params.input,
      companyId: resolvedCompanyId,
    },
    claimingUserId: params.claimingUserId,
    serverUsers: dataset.users,
    catalogProducts: dataset.products,
    existingRequests: dataset.unmetDemandRequests || [],
    exchangeRates: dataset.exchangeRates,
    now: new Date(),
  });

  if (!validation.valid || !validation.record) {
    return validation;
  }

  const record: UnmetDemandRequestRecord = {
    ...validation.record,
    companyId: resolvedCompanyId,
  };

  // 1. Insert into PostgreSQL `unmet_demand_requests` if connected (additive, FK-safe)
  try {
    const { db } = await import('../db/index');
    if (db) {
      const schema = await import('../db/schema');
      await db
        .insert(schema.unmetDemandRequests)
        .values({
          id: record.id,
          companyId: record.companyId || 'comp-default',
          idempotencyKey: record.idempotencyKey,
          dedupeFingerprint: record.dedupeFingerprint,
          productId: null, // Keep null in PG if product is in .data/products.json only to avoid FK constraint error when catalog IDs differ
          isRegisteredProduct: record.isRegisteredProduct,
          productNameSnapshot: record.productNameSnapshot,
          productNameArSnapshot: record.productNameArSnapshot,
          skuSnapshot: record.skuSnapshot,
          barcode: record.barcode,
          categorySnapshot: record.categorySnapshot,
          branchId: null,
          terminalName: record.terminalName || 'Main Terminal',
          requestedTimestamp: new Date(record.requestedTimestamp),
          requestedQuantity: record.requestedQuantity,
          saleUnitMode: record.saleUnitMode,
          requestedBaseUnits: record.requestedBaseUnits,
          fulfilledBaseUnits: record.fulfilledBaseUnits,
          remainingUnfulfilledBaseUnits: record.remainingUnfulfilledBaseUnits,
          availableStockAtRequest: record.availableStockAtRequest,
          expiredUnitsObserved: record.expiredUnitsObserved ?? null,
          expiredBatchNumber: record.expiredBatchNumber ?? null,
          expiredBatchDate: record.expiredBatchDate ? new Date(record.expiredBatchDate) : null,
          substituteProductId: null,
          lastFulfilledAt: record.lastFulfilledAt ? new Date(record.lastFulfilledAt) : null,
          availabilityStatus: record.availabilityStatus,
          unavailabilityReason: record.unavailabilityReason,
          confirmedPurchaseIntent: record.confirmedPurchaseIntent,
          fulfillmentStatus: record.fulfillmentStatus,
          customerId: null,
          customerReference: record.customerReference,
          unitSellingPriceSnapshot:
            record.unitSellingPriceSnapshot !== null && record.unitSellingPriceSnapshot !== undefined
              ? String(record.unitSellingPriceSnapshot)
              : null,
          unitCostPriceSnapshot:
            record.unitCostPriceSnapshot !== null && record.unitCostPriceSnapshot !== undefined
              ? String(record.unitCostPriceSnapshot)
              : null,
          currencySnapshot: record.currencySnapshot,
          exchangeRateSnapshot: String(record.exchangeRateSnapshot ?? 1),
          notes: record.notes,
          recordedByUserId: null,
          recordedByName: record.recordedByName || record.recordedByUserNameSnapshot || 'System',
          createdAt: new Date(record.createdAt),
        })
        .catch(() => {
          // Non-blocking if PG foreign keys or connection are unavailable
        });
    }
  } catch {
    // Non-blocking fallback to store-state.json
  }

  // 2. Append to `.data/store-state.json` `unmetDemandRequests` (preserving all existing operational state)
  try {
    const dataDir = getDataDir();
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const stateFile = path.join(dataDir, 'store-state.json');
    let currentState: any = {};
    if (fs.existsSync(stateFile)) {
      try {
        currentState = JSON.parse(fs.readFileSync(stateFile, 'utf-8')) || {};
      } catch {
        currentState = {};
      }
    }
    const existingList: UnmetDemandRequestRecord[] = Array.isArray(
      currentState.unmetDemandRequests
    )
      ? currentState.unmetDemandRequests
      : [];
    currentState.unmetDemandRequests = [record, ...existingList];
    fs.writeFileSync(stateFile, JSON.stringify(currentState, null, 2), 'utf-8');
  } catch {
    // Ignore disk write failure in read-only environments
  }

  invalidateAnalyticsSnapshotCache();
  return {
    ...validation,
    record,
  };
}

export interface UnmetDemandFulfillmentActionResult {
  valid: boolean;
  statusCode: number;
  errorCode?: string;
  errorMessage?: string;
  errorMessageAr?: string;
  record?: UnmetDemandRequestRecord;
  fulfillmentLink?: UnmetDemandFulfillmentLinkRecord;
  affectedRecords?: UnmetDemandRequestRecord[];
}

function persistUpdatedUnmetDemandRequestsToStoreState(
  updatedRecordsById: Map<string, UnmetDemandRequestRecord>
): void {
  try {
    const dataDir = getDataDir();
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const stateFile = path.join(dataDir, 'store-state.json');
    let currentState: any = {};
    if (fs.existsSync(stateFile)) {
      try {
        currentState = JSON.parse(fs.readFileSync(stateFile, 'utf-8')) || {};
      } catch {
        currentState = {};
      }
    }
    const existingList: UnmetDemandRequestRecord[] = Array.isArray(
      currentState.unmetDemandRequests
    )
      ? currentState.unmetDemandRequests
      : [];
    const seenIds = new Set<string>();
    const mergedList = existingList.map((item) => {
      if (item && updatedRecordsById.has(item.id)) {
        seenIds.add(item.id);
        return updatedRecordsById.get(item.id)!;
      }
      return item;
    });
    for (const [id, updated] of updatedRecordsById.entries()) {
      if (!seenIds.has(id)) {
        mergedList.unshift(updated);
      }
    }
    currentState.unmetDemandRequests = mergedList;
    fs.writeFileSync(stateFile, JSON.stringify(currentState, null, 2), 'utf-8');
  } catch {
    // Ignore disk write errors in read-only test environments
  }
}

/**
 * Links an unmet demand request (partially or fully) to a verified completed sale transaction.
 * Enforces:
 * - Server-side user authentication & tenant/branch isolation
 * - Verification that `saleTransactionId` exists and is `completed` (never `voided`)
 * - Product/substitute product match on the sale line and sufficient unallocated sale line units
 * - Partial fulfillment tracking (`partially_fulfilled` -> `fulfilled_later`)
 * - Historical preservation of the demand request and all fulfillment links
 */
export async function fulfillUnmetDemandRequestFromSaleServer(params: {
  requestId: string;
  saleTransactionId: string;
  saleLineIndex?: number;
  fulfilledBaseUnits?: number;
  claimingUserId?: string;
  companyId?: string;
  datasetOverride?: AnalyticsDatasetSnapshot;
}): Promise<UnmetDemandFulfillmentActionResult> {
  const dataset =
    params.datasetOverride ||
    (await loadServerAnalyticsDataset({
      statusFilter: 'all',
      companyId: params.companyId,
    }));

  const claimingUserId = (params.claimingUserId || '').trim();
  if (!claimingUserId) {
    return {
      valid: false,
      statusCode: 401,
      errorCode: 'UNAUTHENTICATED_USER',
      errorMessage: 'Authentication required: missing user identity.',
      errorMessageAr: 'يلزم تسجيل الدخول لتنفيذ ربط تلبية الطلب.',
    };
  }

  const matchedUser = dataset.users.find((u) => u && u.id === claimingUserId) as
    | (any & { companyId?: string; branchId?: string })
    | undefined;
  if (!matchedUser) {
    return {
      valid: false,
      statusCode: 401,
      errorCode: 'UNAUTHORIZED_UNKNOWN_USER',
      errorMessage: `User "${claimingUserId}" is not recognized in the server user store.`,
      errorMessageAr: 'المستخدم غير معرف في سجل المستخدمين بالخادم.',
    };
  }

  const actorCompanyId = params.companyId || matchedUser.companyId || 'comp-default';
  const requestId = (params.requestId || '').trim();
  const targetRequest = (dataset.unmetDemandRequests || []).find((r) => r.id === requestId);
  if (!targetRequest) {
    return {
      valid: false,
      statusCode: 404,
      errorCode: 'UNMET_DEMAND_NOT_FOUND',
      errorMessage: `Unmet demand request "${requestId}" was not found.`,
      errorMessageAr: 'لم يتم العثور على سجل الطلب غير المتوفر.',
    };
  }

  const requestCompanyId = targetRequest.companyId || 'comp-default';
  if (requestCompanyId !== actorCompanyId) {
    return {
      valid: false,
      statusCode: 403,
      errorCode: 'TENANT_ISOLATION_VIOLATION',
      errorMessage: 'Access denied: cannot fulfill an unmet demand request belonging to another company.',
      errorMessageAr: 'مرفوض: لا يمكن تعديل طلب يتبع لشركة أخرى.',
    };
  }

  const isRestrictedRole =
    matchedUser.role === 'cashier' || matchedUser.role === 'inventory_clerk';
  if (
    isRestrictedRole &&
    matchedUser.branchId &&
    targetRequest.branchId &&
    matchedUser.branchId !== targetRequest.branchId
  ) {
    return {
      valid: false,
      statusCode: 403,
      errorCode: 'BRANCH_ISOLATION_VIOLATION',
      errorMessage: `Access denied: user assigned to branch "${matchedUser.branchId}" cannot fulfill a request from branch "${targetRequest.branchId}".`,
      errorMessageAr: 'مرفوض: لا يملك المستخدم صلاحية تعديل طلبات فرع آخر.',
    };
  }

  const normalizedRequest = normalizeUnmetDemandRequestFulfillment(targetRequest);
  if (normalizedRequest.fulfillmentStatus === 'cancelled') {
    return {
      valid: false,
      statusCode: 409,
      errorCode: 'REQUEST_ALREADY_CANCELLED',
      errorMessage: 'Cannot fulfill a cancelled unmet demand request.',
      errorMessageAr: 'لا يمكن تلبية طلب ملغى.',
    };
  }

  const remainingToFulfill = Math.max(
    0,
    Number(
      normalizedRequest.remainingUnfulfilledBaseUnits ??
        normalizedRequest.requestedBaseUnits - (normalizedRequest.fulfilledBaseUnits ?? 0)
    )
  );
  if (remainingToFulfill <= 0) {
    return {
      valid: false,
      statusCode: 409,
      errorCode: 'REQUEST_ALREADY_FULFILLED',
      errorMessage: 'This unmet demand request is already completely fulfilled.',
      errorMessageAr: 'تمت تلبية هذا الطلب بالكامل مسبقاً.',
    };
  }

  const saleTxId = (params.saleTransactionId || '').trim();
  if (!saleTxId) {
    return {
      valid: false,
      statusCode: 400,
      errorCode: 'MISSING_SALE_TRANSACTION_ID',
      errorMessage: 'A verified completed saleTransactionId is required to fulfill an unmet demand request.',
      errorMessageAr: 'يجب تمرير رقم فاتورة بيع مكتملة لتأكيد تلبية الطلب.',
    };
  }

  const matchedSale = dataset.transactions.find(
    (tx) => tx && (tx.id === saleTxId || tx.idempotencyKey === saleTxId)
  );
  if (!matchedSale) {
    return {
      valid: false,
      statusCode: 404,
      errorCode: 'SALE_TRANSACTION_NOT_FOUND',
      errorMessage: `Sale transaction "${saleTxId}" was not found.`,
      errorMessageAr: 'لم يتم العثور على فاتورة البيع المحددة.',
    };
  }

  if (matchedSale.status === 'voided') {
    return {
      valid: false,
      statusCode: 409,
      errorCode: 'SALE_TRANSACTION_VOIDED',
      errorMessage: `Sale transaction "${matchedSale.id}" is voided and cannot fulfill unmet demand.`,
      errorMessageAr: 'لا يمكن ربط الطلب بفاتورة بيع ملغاة.',
    };
  }

  const saleItems = Array.isArray(matchedSale.items) ? matchedSale.items : [];
  let resolvedLineIndex =
    params.saleLineIndex !== undefined && Number.isInteger(Number(params.saleLineIndex))
      ? Number(params.saleLineIndex)
      : -1;

  if (resolvedLineIndex < 0) {
    resolvedLineIndex = saleItems.findIndex((line) => {
      if (normalizedRequest.productId && line.productId === normalizedRequest.productId) {
        return true;
      }
      if (
        normalizedRequest.substituteProductId &&
        line.productId === normalizedRequest.substituteProductId
      ) {
        return true;
      }
      if (
        !normalizedRequest.productId &&
        line.productName &&
        line.productName.trim().toLowerCase() ===
          normalizedRequest.productNameSnapshot.trim().toLowerCase()
      ) {
        return true;
      }
      return false;
    });
  }

  if (resolvedLineIndex < 0 || resolvedLineIndex >= saleItems.length) {
    return {
      valid: false,
      statusCode: 400,
      errorCode: 'SALE_LINE_PRODUCT_MISMATCH',
      errorMessage: `Sale transaction "${matchedSale.id}" does not contain a matching product line for "${normalizedRequest.productNameSnapshot}".`,
      errorMessageAr: 'فاتورة البيع لا تتضمن الصنف المطلوب أو البديل المعتمد له.',
    };
  }

  const targetLine = saleItems[resolvedLineIndex];
  const lineMatchesProduct =
    (normalizedRequest.productId && targetLine.productId === normalizedRequest.productId) ||
    (normalizedRequest.substituteProductId &&
      targetLine.productId === normalizedRequest.substituteProductId) ||
    (!normalizedRequest.productId &&
      (targetLine.productName || '').trim().toLowerCase() ===
        normalizedRequest.productNameSnapshot.trim().toLowerCase());

  if (!lineMatchesProduct) {
    return {
      valid: false,
      statusCode: 400,
      errorCode: 'SALE_LINE_PRODUCT_MISMATCH',
      errorMessage: `Sale line #${resolvedLineIndex} product "${targetLine.productId}" does not match requested product "${normalizedRequest.productId || normalizedRequest.productNameSnapshot}".`,
      errorMessageAr: 'بند الفاتورة المحدد لا يطابق الصنف المطلوب.',
    };
  }

  const existingLinks = Array.isArray(normalizedRequest.fulfillments)
    ? [...normalizedRequest.fulfillments]
    : [];

  // Prevent duplicate active link for the exact same (requestId, saleTransactionId, saleLineIndex)
  const duplicateLink = existingLinks.find(
    (lnk) =>
      lnk.status === 'active' &&
      lnk.saleTransactionId === matchedSale.id &&
      (lnk.saleLineIndex ?? 0) === resolvedLineIndex
  );
  if (duplicateLink) {
    return {
      valid: false,
      statusCode: 409,
      errorCode: 'DUPLICATE_SALE_LINE_FULFILLMENT',
      errorMessage: `Sale line #${resolvedLineIndex} of transaction "${matchedSale.id}" is already linked to this unmet demand request.`,
      errorMessageAr: 'تم ربط هذا البند من الفاتورة بالطلب مسبقاً.',
    };
  }

  // Compute total base units on the sale line and subtract units already allocated across all active unmet demand fulfillments
  const saleLineBaseUnits = Math.max(
    1,
    Math.round(
      Number(
        targetLine.stockDeducted ||
          (targetLine.quantity || 1) * (targetLine.unitsPerPack || 1)
      )
    )
  );

  let alreadyAllocatedOnSaleLine = 0;
  for (const req of dataset.unmetDemandRequests || []) {
    for (const lnk of req.fulfillments || []) {
      if (
        lnk.status === 'active' &&
        lnk.saleTransactionId === matchedSale.id &&
        (lnk.saleLineIndex ?? 0) === resolvedLineIndex
      ) {
        alreadyAllocatedOnSaleLine += Math.max(0, Math.round(Number(lnk.fulfilledBaseUnits || 0)));
      }
    }
  }

  const availableUnallocatedSaleUnits = Math.max(0, saleLineBaseUnits - alreadyAllocatedOnSaleLine);
  if (availableUnallocatedSaleUnits <= 0) {
    return {
      valid: false,
      statusCode: 409,
      errorCode: 'SALE_LINE_UNITS_EXHAUSTED',
      errorMessage: `All ${saleLineBaseUnits} base unit(s) on sale line #${resolvedLineIndex} of "${matchedSale.id}" have already been allocated to unmet demand fulfillments.`,
      errorMessageAr: 'تم استنفاد كامل كمية هذا البند في الفاتورة لتلبية طلبات سابقة.',
    };
  }

  const requestedUnitsToFulfill =
    params.fulfilledBaseUnits !== undefined && params.fulfilledBaseUnits !== null
      ? Math.round(Number(params.fulfilledBaseUnits))
      : Math.min(remainingToFulfill, availableUnallocatedSaleUnits);

  if (!Number.isFinite(requestedUnitsToFulfill) || requestedUnitsToFulfill <= 0) {
    return {
      valid: false,
      statusCode: 400,
      errorCode: 'INVALID_FULFILLMENT_QUANTITY',
      errorMessage: 'fulfilledBaseUnits must be a positive integer.',
      errorMessageAr: 'يجب أن تكون الكمية الملباة عدداً صحيحاً موجباً.',
    };
  }

  if (requestedUnitsToFulfill > availableUnallocatedSaleUnits) {
    return {
      valid: false,
      statusCode: 400,
      errorCode: 'FULFILLMENT_EXCEEDS_SALE_UNITS',
      errorMessage: `Requested fulfillment (${requestedUnitsToFulfill} units) exceeds available unallocated units (${availableUnallocatedSaleUnits}) on sale "${matchedSale.id}".`,
      errorMessageAr: 'الكمية المراد تلبيتها تتجاوز الكمية المتاحة في فاتورة البيع.',
    };
  }

  const effectiveFulfilledUnits = Math.min(
    requestedUnitsToFulfill,
    remainingToFulfill,
    availableUnallocatedSaleUnits
  );

  const nowIso = new Date().toISOString();
  const newLink: UnmetDemandFulfillmentLinkRecord = {
    id: `udfl-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    requestId: normalizedRequest.id,
    saleTransactionId: matchedSale.id,
    saleLineIndex: resolvedLineIndex,
    branchId: normalizedRequest.branchId || 'branch-main',
    productId: targetLine.productId,
    fulfilledBaseUnits: effectiveFulfilledUnits,
    status: 'active',
    fulfilledAt: nowIso,
    linkedAt: nowIso,
    reversedAt: null,
    reversalReferenceId: null,
    recordedByUserId: matchedUser.id,
  };

  const updatedLinks = [...existingLinks, newLink];
  const computedState = computeUnmetDemandFulfillmentState({
    requestedBaseUnits: normalizedRequest.requestedBaseUnits,
    fulfillments: updatedLinks,
    isCancelled: false,
  });

  const updatedRecord: UnmetDemandRequestRecord = {
    ...normalizedRequest,
    fulfilledBaseUnits: computedState.fulfilledBaseUnits,
    remainingUnfulfilledBaseUnits: computedState.remainingUnfulfilledBaseUnits,
    fulfillmentStatus: computedState.fulfillmentStatus,
    lastFulfilledAt: computedState.lastFulfilledAt || nowIso,
    fulfillments: updatedLinks,
  };

  // Persist to PostgreSQL if connected
  try {
    const { db } = await import('../db/index');
    if (db) {
      const schema = await import('../db/schema');
      const { eq } = await import('drizzle-orm');
      await db.transaction(async (tx) => {
        await tx.insert(schema.unmetDemandFulfillments).values({
          id: newLink.id,
          companyId: actorCompanyId,
          requestId: updatedRecord.id,
          saleId: null,
          saleTransactionId: newLink.saleTransactionId,
          saleItemId: null,
          saleLineIndex: newLink.saleLineIndex ?? 0,
          branchId: null,
          productId: newLink.productId,
          fulfilledBaseUnits: newLink.fulfilledBaseUnits,
          status: 'active',
          fulfilledAt: new Date(newLink.fulfilledAt || nowIso),
          recordedByUserId: null,
          createdAt: new Date(nowIso),
        });
        await tx
          .update(schema.unmetDemandRequests)
          .set({
            fulfilledBaseUnits: updatedRecord.fulfilledBaseUnits,
            remainingUnfulfilledBaseUnits: updatedRecord.remainingUnfulfilledBaseUnits,
            fulfillmentStatus: updatedRecord.fulfillmentStatus,
            lastFulfilledAt: updatedRecord.lastFulfilledAt
              ? new Date(updatedRecord.lastFulfilledAt)
              : null,
          })
          .where(eq(schema.unmetDemandRequests.id, updatedRecord.id));
      });
    }
  } catch {
    // Non-blocking fallback to store-state.json
  }

  if (!params.datasetOverride) {
    persistUpdatedUnmetDemandRequestsToStoreState(new Map([[updatedRecord.id, updatedRecord]]));
    invalidateAnalyticsSnapshotCache();
  }

  return {
    valid: true,
    statusCode: 200,
    record: updatedRecord,
    fulfillmentLink: newLink,
  };
}

/**
 * Reverses active sale-linked fulfillments when a sale transaction is voided or returned.
 * Automatically recalculates `fulfilledBaseUnits`, `remainingUnfulfilledBaseUnits`, and
 * `fulfillmentStatus` (`partially_fulfilled` or `unfulfilled`) while preserving the audit history.
 */
export async function reverseUnmetDemandFulfillmentsBySaleServer(params: {
  saleTransactionId: string;
  reversalReason: 'reversed_by_void' | 'reversed_by_return';
  reversalReferenceId?: string;
  returnedProductId?: string;
  claimingUserId?: string;
  companyId?: string;
  datasetOverride?: AnalyticsDatasetSnapshot;
}): Promise<UnmetDemandFulfillmentActionResult> {
  const dataset =
    params.datasetOverride ||
    (await loadServerAnalyticsDataset({
      statusFilter: 'all',
      companyId: params.companyId,
    }));

  const claimingUserId = (params.claimingUserId || '').trim();
  if (!claimingUserId) {
    return {
      valid: false,
      statusCode: 401,
      errorCode: 'UNAUTHENTICATED_USER',
      errorMessage: 'Authentication required: missing user identity.',
      errorMessageAr: 'يلزم تسجيل الدخول لعكس تلبية الطلبات المرتبطة بالفاتورة.',
    };
  }

  const matchedUser = dataset.users.find((u) => u && u.id === claimingUserId) as
    | (any & { companyId?: string })
    | undefined;
  if (!matchedUser) {
    return {
      valid: false,
      statusCode: 401,
      errorCode: 'UNAUTHORIZED_UNKNOWN_USER',
      errorMessage: `User "${claimingUserId}" is not recognized in the server user store.`,
      errorMessageAr: 'المستخدم غير معرف في سجل المستخدمين بالخادم.',
    };
  }

  const saleTxId = (params.saleTransactionId || '').trim();
  if (!saleTxId) {
    return {
      valid: false,
      statusCode: 400,
      errorCode: 'MISSING_SALE_TRANSACTION_ID',
      errorMessage: 'saleTransactionId is required to reverse linked fulfillments.',
      errorMessageAr: 'رقم الفاتورة مطلوب لعكس التلبية المرتبطة بها.',
    };
  }

  const nowIso = new Date().toISOString();
  const updatedById = new Map<string, UnmetDemandRequestRecord>();

  for (const rawReq of dataset.unmetDemandRequests || []) {
    const req = normalizeUnmetDemandRequestFulfillment(rawReq);
    if (!Array.isArray(req.fulfillments) || req.fulfillments.length === 0) continue;

    let modified = false;
    const updatedLinks = req.fulfillments.map((lnk) => {
      if (
        lnk.status === 'active' &&
        lnk.saleTransactionId === saleTxId &&
        (!params.returnedProductId || lnk.productId === params.returnedProductId)
      ) {
        modified = true;
        return {
          ...lnk,
          status: params.reversalReason,
          reversedAt: nowIso,
          reversalReferenceId: params.reversalReferenceId || saleTxId,
        };
      }
      return lnk;
    });

    if (modified) {
      const computedState = computeUnmetDemandFulfillmentState({
        requestedBaseUnits: req.requestedBaseUnits,
        fulfillments: updatedLinks,
        isCancelled: req.fulfillmentStatus === 'cancelled',
      });
      const updatedRecord: UnmetDemandRequestRecord = {
        ...req,
        fulfilledBaseUnits: computedState.fulfilledBaseUnits,
        remainingUnfulfilledBaseUnits: computedState.remainingUnfulfilledBaseUnits,
        fulfillmentStatus: computedState.fulfillmentStatus,
        lastFulfilledAt: computedState.lastFulfilledAt,
        fulfillments: updatedLinks,
      };
      updatedById.set(updatedRecord.id, updatedRecord);
    }
  }

  // Update PostgreSQL if connected
  if (updatedById.size > 0) {
    try {
      const { db } = await import('../db/index');
      if (db) {
        const schema = await import('../db/schema');
        const { eq } = await import('drizzle-orm');
        await db.transaction(async (tx) => {
          for (const updated of updatedById.values()) {
            await tx
              .update(schema.unmetDemandFulfillments)
              .set({
                status: params.reversalReason,
                reversedAt: new Date(nowIso),
                reversalReferenceId: params.reversalReferenceId || saleTxId,
              })
              .where(eq(schema.unmetDemandFulfillments.saleTransactionId, saleTxId));

            await tx
              .update(schema.unmetDemandRequests)
              .set({
                fulfilledBaseUnits: updated.fulfilledBaseUnits,
                remainingUnfulfilledBaseUnits: updated.remainingUnfulfilledBaseUnits,
                fulfillmentStatus: updated.fulfillmentStatus,
                lastFulfilledAt: updated.lastFulfilledAt ? new Date(updated.lastFulfilledAt) : null,
              })
              .where(eq(schema.unmetDemandRequests.id, updated.id));
          }
        });
      }
    } catch {
      // Non-blocking fallback
    }

    if (!params.datasetOverride) {
      persistUpdatedUnmetDemandRequestsToStoreState(updatedById);
      invalidateAnalyticsSnapshotCache();
    }
  }

  return {
    valid: true,
    statusCode: 200,
    affectedRecords: Array.from(updatedById.values()),
  };
}

/**
 * Cancels an unmet demand request with a mandatory reason while strictly prohibiting
 * manual status overrides to `'fulfilled_later'` or `'partially_fulfilled'` without a sale link.
 */
export async function cancelUnmetDemandRequestServer(params: {
  requestId: string;
  requestedStatus?: string;
  cancelReason?: string;
  claimingUserId?: string;
  companyId?: string;
  datasetOverride?: AnalyticsDatasetSnapshot;
}): Promise<UnmetDemandFulfillmentActionResult> {
  if (
    params.requestedStatus &&
    params.requestedStatus !== 'cancelled'
  ) {
    return {
      valid: false,
      statusCode: 400,
      errorCode: 'MANUAL_FULFILLMENT_PROHIBITED',
      errorMessage:
        'Unmet demand requests cannot be marked as fulfilled or partially fulfilled manually. Use /fulfill-from-sale with a verified saleTransactionId.',
      errorMessageAr:
        'لا يُسمح بتغيير حالة الطلب يدوياً إلى (تمت التلبية). يجب ربط الطلب بفاتورة بيع فعلية مكتملة.',
    };
  }

  const dataset =
    params.datasetOverride ||
    (await loadServerAnalyticsDataset({
      statusFilter: 'all',
      companyId: params.companyId,
    }));

  const claimingUserId = (params.claimingUserId || '').trim();
  if (!claimingUserId) {
    return {
      valid: false,
      statusCode: 401,
      errorCode: 'UNAUTHENTICATED_USER',
      errorMessage: 'Authentication required: missing user identity.',
      errorMessageAr: 'يلزم تسجيل الدخول لإلغاء الطلب.',
    };
  }

  const matchedUser = dataset.users.find((u) => u && u.id === claimingUserId) as
    | (any & { companyId?: string; branchId?: string })
    | undefined;
  if (!matchedUser) {
    return {
      valid: false,
      statusCode: 401,
      errorCode: 'UNAUTHORIZED_UNKNOWN_USER',
      errorMessage: `User "${claimingUserId}" is not recognized in the server user store.`,
      errorMessageAr: 'المستخدم غير معرف في سجل المستخدمين بالخادم.',
    };
  }

  const reason = (params.cancelReason || '').trim();
  if (reason.length < 3) {
    return {
      valid: false,
      statusCode: 400,
      errorCode: 'MISSING_CANCEL_REASON',
      errorMessage: 'A cancellation reason (at least 3 characters) is required.',
      errorMessageAr: 'يجب إدخال سبب واضح لإلغاء الطلب (3 أحرف على الأقل).',
    };
  }

  const actorCompanyId = params.companyId || matchedUser.companyId || 'comp-default';
  const targetRequest = (dataset.unmetDemandRequests || []).find(
    (r) => r.id === (params.requestId || '').trim()
  );
  if (!targetRequest) {
    return {
      valid: false,
      statusCode: 404,
      errorCode: 'UNMET_DEMAND_NOT_FOUND',
      errorMessage: `Unmet demand request "${params.requestId}" was not found.`,
      errorMessageAr: 'لم يتم العثور على سجل الطلب غير المتوفر.',
    };
  }

  if ((targetRequest.companyId || 'comp-default') !== actorCompanyId) {
    return {
      valid: false,
      statusCode: 403,
      errorCode: 'TENANT_ISOLATION_VIOLATION',
      errorMessage: 'Access denied: cannot cancel an unmet demand request belonging to another company.',
      errorMessageAr: 'مرفوض: لا يمكن إلغاء طلب يتبع لشركة أخرى.',
    };
  }

  const normalizedRequest = normalizeUnmetDemandRequestFulfillment(targetRequest);
  const updatedRecord: UnmetDemandRequestRecord = {
    ...normalizedRequest,
    fulfillmentStatus: 'cancelled',
    notes: normalizedRequest.notes
      ? `${normalizedRequest.notes} | [Cancelled by ${matchedUser.name}: ${reason}]`
      : `[Cancelled by ${matchedUser.name}: ${reason}]`,
  };

  try {
    const { db } = await import('../db/index');
    if (db) {
      const schema = await import('../db/schema');
      const { eq } = await import('drizzle-orm');
      await db
        .update(schema.unmetDemandRequests)
        .set({
          fulfillmentStatus: 'cancelled',
          notes: updatedRecord.notes,
        })
        .where(eq(schema.unmetDemandRequests.id, updatedRecord.id));
    }
  } catch {
    // Non-blocking fallback
  }

  if (!params.datasetOverride) {
    persistUpdatedUnmetDemandRequestsToStoreState(new Map([[updatedRecord.id, updatedRecord]]));
    invalidateAnalyticsSnapshotCache();
  }

  return {
    valid: true,
    statusCode: 200,
    record: updatedRecord,
  };
}

