/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
import {
  Customer,
  ExchangeRateHistoryEntry,
  POSUser,
  Product,
  StockMovement,
  Transaction,
} from '../lib/types';
import {
  AnalyticsDatasetSnapshot,
  PurchaseOrderRecordInput,
  ReturnRecordInput,
  SourceOfTruthDomainMeta,
  UnmetDemandRequestRecord,
} from './analytics.types';
import { computeUnmetDemandFulfillmentState } from './unmet-demand.validation';

export const DEFAULT_ANALYTICS_BRANCHES: AnalyticsDatasetSnapshot['branches'] = [
  {
    id: 'branch-main',
    name: 'Main Store Branch - Khartoum',
    nameAr: 'الفرع الرئيسي - الخرطوم',
    code: 'BR-KRT-01',
    terminalNames: [
      'POS Terminal 01',
      'Main Terminal',
      'Terminal 01 (Main Counter)',
      'Terminal 02 (Checkout 1)',
      'Terminal 03 (Warehouse)',
    ],
  },
  {
    id: 'branch-bahri',
    name: 'Bahri Retail Branch',
    nameAr: 'فرع بحري التجاري',
    code: 'BR-BHR-02',
    terminalNames: ['POS Terminal 02', 'Terminal 04 (Bahri)'],
  },
];

/**
 * Deduplicates products by ID and SKU, preferring the record with the newer updatedAt timestamp.
 */
export function deduplicateProducts(list: Product[]): Product[] {
  const byId = new Map<string, Product>();
  const bySku = new Map<string, string>();

  for (const item of list) {
    if (!item || !item.id) continue;
    const skuKey = (item.sku || '').trim().toLowerCase();
    const existingIdForSku = skuKey ? bySku.get(skuKey) : undefined;
    const targetId = existingIdForSku || item.id;
    const existing = byId.get(targetId);

    if (!existing) {
      byId.set(item.id, item);
      if (skuKey) bySku.set(skuKey, item.id);
    } else {
      const existingTime = new Date(existing.updatedAt || 0).getTime() || 0;
      const incomingTime = new Date(item.updatedAt || 0).getTime() || 0;
      if (incomingTime >= existingTime) {
        byId.set(targetId, { ...existing, ...item, id: targetId });
      }
    }
  }
  return Array.from(byId.values());
}

/**
 * Deduplicates transactions by both `id` and `idempotencyKey` so PostgreSQL `sales`
 * and `.data/store-state.json` never create duplicate sales records.
 */
export function deduplicateTransactions(list: Transaction[]): Transaction[] {
  const byId = new Map<string, Transaction>();
  const idemToId = new Map<string, string>();

  for (const tx of list) {
    if (!tx || !tx.id) continue;
    const idem = (tx.idempotencyKey || '').trim();
    const canonicalId = (idem && idemToId.get(idem)) || tx.id;
    const existing = byId.get(canonicalId);

    if (!existing) {
      byId.set(tx.id, tx);
      if (idem) idemToId.set(idem, tx.id);
    } else {
      // Prefer the record that is voided (if a cancellation occurred) or has more recent debt settlements
      const existingPaymentsCount = existing.debtPayments?.length || 0;
      const incomingPaymentsCount = tx.debtPayments?.length || 0;
      const shouldReplace =
        tx.status === 'voided' ||
        (tx.syncStatus === 'synced' && existing.syncStatus !== 'synced') ||
        incomingPaymentsCount > existingPaymentsCount ||
        (tx.amountPaid ?? 0) > (existing.amountPaid ?? 0);

      if (shouldReplace) {
        byId.set(canonicalId, { ...existing, ...tx, id: canonicalId });
      }
    }
  }
  return Array.from(byId.values());
}

/**
 * Deduplicates returns by return ID.
 */
export function deduplicateReturns(list: ReturnRecordInput[]): ReturnRecordInput[] {
  const map = new Map<string, ReturnRecordInput>();
  for (const r of list || []) {
    if (!r || !r.id || !r.saleId) continue;
    map.set(r.id, r);
  }
  return Array.from(map.values());
}

/**
 * Deduplicates stock movements by ID.
 */
export function deduplicateStockMovements(list: StockMovement[]): StockMovement[] {
  const map = new Map<string, StockMovement>();
  for (const m of list || []) {
    if (!m || !m.id) continue;
    map.set(m.id, m);
  }
  return Array.from(map.values());
}

/**
 * Deduplicates customers by ID.
 */
export function deduplicateCustomers(list: Customer[]): Customer[] {
  const map = new Map<string, Customer>();
  for (const c of list || []) {
    if (!c || !c.id) continue;
    map.set(c.id, c);
  }
  return Array.from(map.values());
}

/**
 * Normalizes an unmet demand request record so legacy records without explicit
 * `fulfilledBaseUnits` or `remainingUnfulfilledBaseUnits` always have consistent bounds,
 * and records with `fulfillments` links derive their authoritative state via `computeUnmetDemandFulfillmentState`.
 */
export function normalizeUnmetDemandRequestFulfillment(
  req: UnmetDemandRequestRecord
): UnmetDemandRequestRecord {
  const requestedBaseUnits = Math.max(1, Math.round(Number(req.requestedBaseUnits || req.requestedQuantity || 1)));
  const isCancelled = req.fulfillmentStatus === 'cancelled';

  if (Array.isArray(req.fulfillments) && req.fulfillments.length > 0) {
    const computed = computeUnmetDemandFulfillmentState({
      requestedBaseUnits,
      fulfillments: req.fulfillments,
      isCancelled,
    });
    return {
      ...req,
      companyId: req.companyId || 'comp-default',
      requestedBaseUnits,
      fulfilledBaseUnits: computed.fulfilledBaseUnits,
      remainingUnfulfilledBaseUnits: computed.remainingUnfulfilledBaseUnits,
      fulfillmentStatus: computed.fulfillmentStatus,
      lastFulfilledAt: computed.lastFulfilledAt || req.lastFulfilledAt || null,
    };
  }

  const rawFulfilled =
    req.fulfilledBaseUnits !== undefined && req.fulfilledBaseUnits !== null
      ? Math.max(0, Math.min(requestedBaseUnits, Math.round(Number(req.fulfilledBaseUnits))))
      : req.fulfillmentStatus === 'fulfilled_later'
        ? requestedBaseUnits
        : 0;
  const remainingUnfulfilledBaseUnits = requestedBaseUnits - rawFulfilled;
  const fulfillmentStatus = isCancelled
    ? 'cancelled'
    : rawFulfilled >= requestedBaseUnits
      ? 'fulfilled_later'
      : rawFulfilled > 0
        ? 'partially_fulfilled'
        : 'unfulfilled';

  return {
    ...req,
    companyId: req.companyId || 'comp-default',
    requestedBaseUnits,
    fulfilledBaseUnits: rawFulfilled,
    remainingUnfulfilledBaseUnits,
    fulfillmentStatus,
  };
}

/**
 * Deduplicates unmet demand requests by ID and idempotencyKey, preferring the record
 * with the most complete fulfillment link history or cancellation state.
 */
export function deduplicateUnmetDemandRequests(
  list: UnmetDemandRequestRecord[]
): UnmetDemandRequestRecord[] {
  const byId = new Map<string, UnmetDemandRequestRecord>();
  const idemToId = new Map<string, string>();
  for (const rawReq of list || []) {
    if (!rawReq || !rawReq.id) continue;
    const req = normalizeUnmetDemandRequestFulfillment(rawReq);
    const idem = (req.idempotencyKey || '').trim();
    const canonicalId = (idem && idemToId.get(idem)) || req.id;
    const existing = byId.get(canonicalId);

    if (!existing) {
      byId.set(req.id, req);
      if (idem) idemToId.set(idem, req.id);
    } else {
      const existingLinksCount = existing.fulfillments?.length || 0;
      const incomingLinksCount = req.fulfillments?.length || 0;
      const shouldReplace =
        (req.fulfillmentStatus === 'cancelled' && existing.fulfillmentStatus !== 'cancelled') ||
        incomingLinksCount > existingLinksCount ||
        (req.fulfilledBaseUnits ?? 0) > (existing.fulfilledBaseUnits ?? 0);

      if (shouldReplace) {
        byId.set(canonicalId, { ...existing, ...req, id: canonicalId });
      }
    }
  }
  return Array.from(byId.values());
}

/**
 * Browser-safe and server-safe pure helper that builds a deduplicated AnalyticsDatasetSnapshot
 * from operational state arrays and attaches the explicit Source-of-Truth Matrix.
 */
export function buildAnalyticsSnapshotFromState(input?: {
  products?: Product[];
  transactions?: Transaction[];
  returns?: ReturnRecordInput[];
  purchases?: PurchaseOrderRecordInput[];
  customers?: Customer[];
  stockMovements?: StockMovement[];
  users?: POSUser[];
  unmetDemandRequests?: UnmetDemandRequestRecord[];
  exchangeRates?: Record<string, number>;
  exchangeRateHistory?: ExchangeRateHistoryEntry[];
  branches?: AnalyticsDatasetSnapshot['branches'];
  dataSource?: AnalyticsDatasetSnapshot['dataSource'];
}): AnalyticsDatasetSnapshot {
  const rawProducts = Array.isArray(input?.products) ? input!.products : [];
  const rawTransactions = Array.isArray(input?.transactions) ? input!.transactions : [];
  const rawReturns = Array.isArray(input?.returns) ? input!.returns : [];
  const rawPurchases = Array.isArray(input?.purchases) ? input!.purchases : [];
  const rawCustomers = Array.isArray(input?.customers) ? input!.customers : [];
  const rawStockMovements = Array.isArray(input?.stockMovements) ? input!.stockMovements : [];
  const users = Array.isArray(input?.users) ? input!.users : [];
  const rawUnmetDemandRequests = Array.isArray(input?.unmetDemandRequests)
    ? input!.unmetDemandRequests
    : [];

  const products = deduplicateProducts(rawProducts);
  const transactions = deduplicateTransactions(rawTransactions);
  const returns = deduplicateReturns(rawReturns);
  const customers = deduplicateCustomers(rawCustomers);
  const stockMovements = deduplicateStockMovements(rawStockMovements);
  const unmetDemandRequests = deduplicateUnmetDemandRequests(rawUnmetDemandRequests);

  const exchangeRates: Record<string, number> =
    input?.exchangeRates !== undefined
      ? { ...(input.exchangeRates || {}), SDG: 1 }
      : { SDG: 1 };
  const exchangeRateHistory = Array.isArray(input?.exchangeRateHistory)
    ? input!.exchangeRateHistory
    : [];

  const sourceOfTruthMatrix: SourceOfTruthDomainMeta[] = [
    {
      domain: 'sales_and_items',
      primarySource: 'PostgreSQL sales & sale_items + .data/store-state.json transactions',
      fallbackSource: 'INITIAL_TRANSACTIONS seed',
      deduplicationKey: 'transaction.id + transaction.idempotencyKey',
      reconciliationRule:
        'Merged by canonical id/idempotencyKey; voided status and latest debtPayments settlement take precedence.',
      recordCount: transactions.length,
    },
    {
      domain: 'returns',
      primarySource: 'PostgreSQL returns & return_items + transaction return records',
      fallbackSource: 'Empty array [] (no fabricated returns)',
      deduplicationKey: 'return.id (scoped to saleId)',
      reconciliationRule:
        'Each return is deducted from Net Sales at most once and capped at original invoice net value.',
      recordCount: returns.length,
    },
    {
      domain: 'products_and_costs',
      primarySource: 'products-repo (PostgreSQL products -> .data/products.json)',
      fallbackSource: 'INITIAL_PRODUCTS seed',
      deduplicationKey: 'product.id + normalized SKU',
      reconciliationRule:
        'Latest updatedAt wins; historical cost reconstructed via priceHistory[] timeline or flagged as estimated.',
      recordCount: products.length,
    },
    {
      domain: 'inventory_and_movements',
      primarySource: 'products.stock + PostgreSQL/.data stock_movements',
      fallbackSource: 'INITIAL_STOCK_MOVEMENTS',
      deduplicationKey: 'stockMovement.id',
      reconciliationRule:
        'Beginning inventory reconstructed by reversing window stock deltas from current stock.',
      recordCount: stockMovements.length,
    },
    {
      domain: 'customers_and_payments',
      primarySource: '.data/store-state.json customers & transaction.debtPayments + PostgreSQL customers/payments',
      fallbackSource: 'INITIAL_CUSTOMERS',
      deduplicationKey: 'customer.id / debtPayment.id',
      reconciliationRule:
        'Upfront checkout payments and subsequent debtPayments are separated from credit sales revenue.',
      recordCount: customers.length,
    },
    {
      domain: 'purchases_and_suppliers',
      primarySource: 'PostgreSQL purchases & purchase_items + restock stock_movements',
      fallbackSource: 'Restock movements with supplierName & invoiceNumber',
      deduplicationKey: 'purchase.id / movement.id',
      reconciliationRule:
        'Goods-only receipts are classified as Accounts Payable; ordered purchases are tracked as pending inbound stock.',
      recordCount: rawPurchases.length,
    },
    {
      domain: 'exchange_rates',
      primarySource: 'currencies-repo (PostgreSQL exchange_rates -> .data/currencies.json) + invoice exchangeRatesSnapshot',
      fallbackSource: 'DEFAULT_BASELINE_EXCHANGE_RATES (SDG=1)',
      deduplicationKey: 'sourceCurrency -> SDG',
      reconciliationRule:
        'Historical transactions always use their locked sale-time exchangeRatesSnapshot in historical mode.',
      recordCount: Object.keys(exchangeRates).length,
    },
    {
      domain: 'unmet_demand_requests',
      primarySource: 'PostgreSQL unmet_demand_requests + .data/store-state.json unmetDemandRequests',
      fallbackSource: 'Empty array [] (never fabricated)',
      deduplicationKey: 'request.id + request.idempotencyKey + 60s dedupeFingerprint',
      reconciliationRule:
        'Strictly separated from completed sales; never alters inventory stock or completed sales revenue.',
      recordCount: unmetDemandRequests.length,
    },
  ];

  return {
    products,
    transactions,
    returns,
    purchases: rawPurchases,
    customers,
    stockMovements,
    users,
    unmetDemandRequests,
    exchangeRates,
    exchangeRateHistory,
    branches:
      input?.branches && input.branches.length > 0
        ? input.branches
        : DEFAULT_ANALYTICS_BRANCHES,
    dataSource: input?.dataSource || 'store_state_snapshot',
    sourceOfTruthMatrix,
  };
}
