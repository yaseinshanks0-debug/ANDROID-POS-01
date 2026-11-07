/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Transaction, Customer } from './types';
import {
  SmartIntelligenceAlertItem,
  SmartAlertLifecycleStatus,
  UnmetDemandRequestRecord,
} from '../analytics/analytics.types';
import { getProductExpiryStatus } from './inventory-rules';

export type StoreNotificationType =
  | 'LOW_STOCK'
  | 'OUT_OF_STOCK'
  | 'EXPIRED_PRODUCT'
  | 'EXPIRING_SOON'
  | 'UNMET_DEMAND'
  | 'CUSTOMER_DEBT'
  | 'SMART_BI_ALERT';

export type StoreNotificationSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type StoreNotificationQuickActionTarget =
  | 'inventory'
  | 'products'
  | 'sales'
  | 'customers'
  | 'reports'
  | 'unmet_demand_modal';

export interface StoreNotificationItem {
  id: string;
  dedupeKey: string;
  type: StoreNotificationType;
  severity: StoreNotificationSeverity;
  categoryLabelAr: string;
  categoryLabelEn: string;
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  summaryEn: string;
  detailsAr: string;
  detailsEn: string;
  recommendationAr: string;
  recommendationEn: string;
  metricBadge?: string;
  timestamp: string;
  status: SmartAlertLifecycleStatus;
  productId?: string;
  customerId?: string;
  transactionId?: string;
  primaryActionTarget: StoreNotificationQuickActionTarget;
  primaryActionLabelAr: string;
  primaryActionLabelEn: string;
  evidenceMetrics?: {
    name: string;
    valueFormatted: string;
    comparisonText?: string;
  }[];
  resolutionNote?: string;
  updatedAt?: string;
}

export interface NotificationLifecycleRecord {
  status: SmartAlertLifecycleStatus;
  note?: string;
  updatedAt: string;
}

export const NOTIFICATIONS_LIFECYCLE_STORAGE_KEY = 'pos_notifications_lifecycle_v1';
export const NOTIFICATIONS_UPDATED_EVENT = 'pos-notifications-lifecycle-updated';

export function loadNotificationLifecycleMap(
  storage?: Pick<Storage, 'getItem'>
): Record<string, NotificationLifecycleRecord> {
  try {
    const store =
      storage || (typeof window !== 'undefined' ? window.localStorage : undefined);
    if (!store) return {};
    const raw = store.getItem(NOTIFICATIONS_LIFECYCLE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed as Record<string, NotificationLifecycleRecord>;
  } catch {
    return {};
  }
}

export function saveNotificationLifecycleStatus(
  keys: string[],
  status: SmartAlertLifecycleStatus,
  note?: string,
  storage?: Pick<Storage, 'getItem' | 'setItem'>
): Record<string, NotificationLifecycleRecord> {
  const current = loadNotificationLifecycleMap(storage);
  const nowIso = new Date().toISOString();
  const next: Record<string, NotificationLifecycleRecord> = { ...current };

  for (const key of keys) {
    if (!key) continue;
    next[key] = {
      status,
      note: note?.trim() || next[key]?.note,
      updatedAt: nowIso,
    };
  }

  try {
    const store =
      storage || (typeof window !== 'undefined' ? window.localStorage : undefined);
    if (store) {
      store.setItem(NOTIFICATIONS_LIFECYCLE_STORAGE_KEY, JSON.stringify(next));
    }
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new CustomEvent(NOTIFICATIONS_UPDATED_EVENT));
    }
  } catch {
    // Ignore storage quota errors
  }

  return next;
}

const SEVERITY_WEIGHT: Record<StoreNotificationSeverity, number> = {
  CRITICAL: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

export function resolveSmartAlertQuickAction(alert: SmartIntelligenceAlertItem): {
  target: StoreNotificationQuickActionTarget;
  labelAr: string;
  labelEn: string;
} {
  switch (alert.category) {
    case 'STOCKOUT_RISK':
    case 'INVENTORY_RISK':
    case 'REPLENISHMENT':
      return {
        target: 'inventory',
        labelAr: 'فتح المخزون والتوريد الآن',
        labelEn: 'Open Inventory & Restock',
      };
    case 'UNMET_DEMAND':
      return {
        target: 'unmet_demand_modal',
        labelAr: 'فتح سجل الطلبات غير المتوفرة',
        labelEn: 'Open Unmet Demand Capture',
      };
    case 'FINANCIAL_RISK':
    case 'SALES_ANOMALY':
      return {
        target: 'sales',
        labelAr: 'مراجعة الفواتير والمبيعات',
        labelEn: 'Review Sales & Invoices',
      };
    default:
      return {
        target: 'products',
        labelAr: 'فحص المنتجات والأسعار',
        labelEn: 'Inspect Products Catalog',
      };
  }
}

export function buildStoreNotificationsList(params: {
  products: Product[];
  transactions: Transaction[];
  customers: Customer[];
  unmetDemandRequests?: UnmetDemandRequestRecord[];
  smartAlerts?: SmartIntelligenceAlertItem[];
  lifecycleMap?: Record<string, NotificationLifecycleRecord>;
  nowMs?: number;
}): StoreNotificationItem[] {
  const {
    products = [],
    transactions = [],
    customers = [],
    unmetDemandRequests = [],
    smartAlerts = [],
    lifecycleMap = {},
    nowMs = Date.now(),
  } = params;

  const items: StoreNotificationItem[] = [];
  const seenKeys = new Set<string>();
  const nowIso = new Date(nowMs).toISOString();

  const resolveStatus = (
    id: string,
    dedupeKey: string,
    fallback: SmartAlertLifecycleStatus = 'active'
  ): { status: SmartAlertLifecycleStatus; note?: string; updatedAt?: string } => {
    const rec = lifecycleMap[dedupeKey] || lifecycleMap[id];
    if (rec) {
      return {
        status: rec.status,
        note: rec.note,
        updatedAt: rec.updatedAt,
      };
    }
    return { status: fallback };
  };

  // 0. Store Catalog Readiness Alert if store has no products yet
  if (products.length === 0) {
    const id = 'notif-empty-catalog-readiness';
    const dedupeKey = 'readiness:empty_catalog';
    seenKeys.add(dedupeKey);
    const st = resolveStatus(id, dedupeKey);
    items.push({
      id,
      dedupeKey,
      type: 'SMART_BI_ALERT',
      severity: 'HIGH',
      categoryLabelAr: 'جاهزية المتجر والمخزون',
      categoryLabelEn: 'Store Catalog Readiness',
      titleAr: 'قائمة المنتجات فارغة — ابدأ بإضافة أصناف المتجر',
      titleEn: 'Product Catalog Empty — Add Store Products',
      summaryAr: 'لا توجد منتجات مسجلة في المتجر حالياً (0 صنف).',
      summaryEn: 'There are currently 0 products registered in the store catalog.',
      detailsAr:
        'كتالوج المنتجات الحالي فارغ (0 صنف). للبدء في البيع ومراقبة المخزون والصلاحية والتقارير الذكية، قم بإضافة منتجات المتجر أو تفعيل وضع التدريب التجريبي.',
      detailsEn:
        'Your store catalog is currently empty (0 items). Add products in the Products page or switch to Practice Mode to start selling and tracking inventory.',
      recommendationAr: 'افتح صفحة المنتجات لإضافة أول صنف أو استيراد قائمة المنتجات.',
      recommendationEn: 'Open Products page to add your first item or import catalog.',
      metricBadge: '0 أصناف',
      timestamp: nowIso,
      status: st.status,
      resolutionNote: st.note,
      updatedAt: st.updatedAt,
      primaryActionTarget: 'products',
      primaryActionLabelAr: 'فتح صفحة المنتجات لإضافة صنف',
      primaryActionLabelEn: 'Open Products to Add Item',
      evidenceMetrics: [
        { name: 'عدد المنتجات / Products', valueFormatted: '0' },
        { name: 'حالة المتجر / Status', valueFormatted: 'يحتاج تأسيس / Setup Needed' },
      ],
    });
  }

  // 1. Product Stockout, Low Stock & Expiry Notifications
  for (const prod of products) {
    const nameAr = prod.nameAr || prod.name;
    const nameEn = prod.name;

    if (prod.stock <= 0) {
      const id = `notif-out-of-stock-${prod.id}`;
      const dedupeKey = `stockout:${prod.id}`;
      seenKeys.add(dedupeKey);
      const st = resolveStatus(id, dedupeKey);
      items.push({
        id,
        dedupeKey,
        type: 'OUT_OF_STOCK',
        severity: 'CRITICAL',
        categoryLabelAr: 'نفاد المخزون',
        categoryLabelEn: 'Out of Stock',
        titleAr: `نفاد مخزون المنتج: ${nameAr}`,
        titleEn: `Product Out of Stock: ${nameEn}`,
        summaryAr: `الرصيد الحالي 0 وحدة (حد التنبيه: ${prod.minStockAlert}).`,
        summaryEn: `Current stock is 0 units (Alert threshold: ${prod.minStockAlert}).`,
        detailsAr: `المنتج "${nameAr}" (رمز الباركود/SKU: ${prod.sku}) نفد بالكامل من المخزون ولا يمكن بيعه في الكاشير حالياً. يُنصح باستلام بضاعة جديدة أو تعديل الرصيد فوراً لتجنب ضياع المبيعات.`,
        detailsEn: `Product "${nameEn}" (SKU: ${prod.sku}) has 0 units remaining and cannot be sold at checkout. Receive supplier goods or restock immediately.`,
        recommendationAr: 'قم بفتح شاشة المخزون واستلام بضاعة جديدة أو تحديث الكمية المتوفرة.',
        recommendationEn: 'Open Inventory to receive goods or restock this item.',
        metricBadge: `0 / ${prod.minStockAlert}`,
        timestamp: prod.updatedAt || nowIso,
        status: st.status,
        resolutionNote: st.note,
        updatedAt: st.updatedAt,
        productId: prod.id,
        primaryActionTarget: 'inventory',
        primaryActionLabelAr: 'تزويد المخزون الآن',
        primaryActionLabelEn: 'Restock in Inventory',
        evidenceMetrics: [
          { name: 'الرصيد الحالي / Stock', valueFormatted: '0' },
          { name: 'حد التنبيه / Min Alert', valueFormatted: String(prod.minStockAlert) },
          { name: 'SKU', valueFormatted: prod.sku },
        ],
      });
    } else if (prod.stock <= prod.minStockAlert) {
      const id = `notif-low-stock-${prod.id}`;
      const dedupeKey = `lowstock:${prod.id}`;
      seenKeys.add(dedupeKey);
      const st = resolveStatus(id, dedupeKey);
      items.push({
        id,
        dedupeKey,
        type: 'LOW_STOCK',
        severity: 'HIGH',
        categoryLabelAr: 'انخفاض المخزون',
        categoryLabelEn: 'Low Stock Alert',
        titleAr: `مخزون منخفض: ${nameAr}`,
        titleEn: `Low Stock Alert: ${nameEn}`,
        summaryAr: `المتبقي ${prod.stock} وحدة فقط (حد التنبيه: ${prod.minStockAlert}).`,
        summaryEn: `Only ${prod.stock} units left (Alert threshold: ${prod.minStockAlert}).`,
        detailsAr: `وصل رصيد المنتج "${nameAr}" (${prod.sku}) إلى ${prod.stock} وحدة وهو أقل من أو يساوي حد إعادة الطلب (${prod.minStockAlert}). يُوصى بطلب توريد جديد قبل النفاد التام.`,
        detailsEn: `Stock for "${nameEn}" (${prod.sku}) dropped to ${prod.stock} units (threshold: ${prod.minStockAlert}). Reorder soon to avoid stockout.`,
        recommendationAr: 'إصدار أمر تزويد مخزون أو تسجيل استلام بضاعة من المورد.',
        recommendationEn: 'Create a restock entry or receive supplier goods in Inventory.',
        metricBadge: `${prod.stock} وحدة`,
        timestamp: prod.updatedAt || nowIso,
        status: st.status,
        resolutionNote: st.note,
        updatedAt: st.updatedAt,
        productId: prod.id,
        primaryActionTarget: 'inventory',
        primaryActionLabelAr: 'تزويد المخزون',
        primaryActionLabelEn: 'Restock Product',
        evidenceMetrics: [
          { name: 'الرصيد المتبقي / Stock', valueFormatted: String(prod.stock) },
          { name: 'حد التنبيه / Min Alert', valueFormatted: String(prod.minStockAlert) },
        ],
      });
    }

    // Expiry Date Checks
    const expiry = getProductExpiryStatus(prod, new Date(nowMs));
    if (expiry.status === 'expired' && expiry.expiryDate) {
      const id = `notif-expired-${prod.id}`;
      const dedupeKey = `expired:${prod.id}`;
      seenKeys.add(dedupeKey);
      const st = resolveStatus(id, dedupeKey);
      items.push({
        id,
        dedupeKey,
        type: 'EXPIRED_PRODUCT',
        severity: 'CRITICAL',
        categoryLabelAr: 'انتهاء الصلاحية',
        categoryLabelEn: 'Expired Product',
        titleAr: `منتج منتهي الصلاحية: ${nameAr}`,
        titleEn: `Expired Product: ${nameEn}`,
        summaryAr: `تاريخ الانتهاء: ${expiry.expiryDate} (الكمية: ${prod.stock} وحدة).`,
        summaryEn: `Expiry Date: ${expiry.expiryDate} (Stock: ${prod.stock} units).`,
        detailsAr: `المنتج "${nameAr}" انتهت صلاحيته بتاريخ ${expiry.expiryDate} ويوجد منه ${prod.stock} وحدة في المخزون. يجب عزله فوراً أو تحديث تاريخ صلاحية الدفعة الجديدة.`,
        detailsEn: `Product "${nameEn}" expired on ${expiry.expiryDate} with ${prod.stock} units in stock. Quarantine stock or update batch expiry date.`,
        recommendationAr: 'افتح بيانات المنتج لتحديث تاريخ الصلاحية أو خصم التالف من المخزون.',
        recommendationEn: 'Open Products or Inventory to update batch expiry or record damage.',
        metricBadge: expiry.expiryDate,
        timestamp: prod.updatedAt || nowIso,
        status: st.status,
        resolutionNote: st.note,
        updatedAt: st.updatedAt,
        productId: prod.id,
        primaryActionTarget: 'products',
        primaryActionLabelAr: 'مراجعة المنتج والصلاحية',
        primaryActionLabelEn: 'Inspect Product Expiry',
      });
    } else if (expiry.status === 'expiring_soon' && expiry.expiryDate) {
      const id = `notif-expiring-soon-${prod.id}`;
      const dedupeKey = `expiring:${prod.id}`;
      seenKeys.add(dedupeKey);
      const st = resolveStatus(id, dedupeKey);
      items.push({
        id,
        dedupeKey,
        type: 'EXPIRING_SOON',
        severity: 'HIGH',
        categoryLabelAr: 'قرب انتهاء الصلاحية',
        categoryLabelEn: 'Expiring Soon',
        titleAr: `ينتهي قريباً: ${nameAr}`,
        titleEn: `Expiring Soon: ${nameEn}`,
        summaryAr: `ينتهي خلال ${expiry.daysRemaining} يوم (${expiry.expiryDate}).`,
        summaryEn: `Expires in ${expiry.daysRemaining} days (${expiry.expiryDate}).`,
        detailsAr: `المنتج "${nameAr}" يقترب من تاريخ انتهاء الصلاحية (${expiry.expiryDate}) ويتبقى له ${expiry.daysRemaining} يوم فقط مع وجود ${prod.stock} وحدة بالمخزون.`,
        detailsEn: `Product "${nameEn}" expires on ${expiry.expiryDate} (${expiry.daysRemaining} days left) with ${prod.stock} units in stock.`,
        recommendationAr: 'ترويج الصنف لسرعة تصريفه أو مراجعة المورد للاستبدال.',
        recommendationEn: 'Promote item for fast clearance or arrange supplier return.',
        metricBadge: `${expiry.daysRemaining} يوم`,
        timestamp: prod.updatedAt || nowIso,
        status: st.status,
        resolutionNote: st.note,
        updatedAt: st.updatedAt,
        productId: prod.id,
        primaryActionTarget: 'products',
        primaryActionLabelAr: 'عرض المنتج',
        primaryActionLabelEn: 'View Product',
      });
    }
  }

  // 2. Repeated Unmet Customer Demand Notifications
  const unmetByProduct = new Map<
    string,
    { name: string; count: number; totalUnits: number; lastTs: string }
  >();
  for (const req of unmetDemandRequests) {
    const rawName = (req.productNameArSnapshot || req.productNameSnapshot || '').trim();
    if (!rawName) continue;
    const key = rawName.toLowerCase();
    const prev = unmetByProduct.get(key);
    const units = Number(req.requestedBaseUnits || req.requestedQuantity || 1);
    const reqTs = req.requestedTimestamp || nowIso;
    if (!prev) {
      unmetByProduct.set(key, {
        name: rawName,
        count: 1,
        totalUnits: units,
        lastTs: reqTs,
      });
    } else {
      prev.count += 1;
      prev.totalUnits += units;
      if (reqTs > prev.lastTs) {
        prev.lastTs = reqTs;
      }
    }
  }

  for (const [key, info] of unmetByProduct.entries()) {
    const id = `notif-unmet-${key}`;
    const dedupeKey = `unmet:${key}`;
    seenKeys.add(dedupeKey);
    const st = resolveStatus(id, dedupeKey);
    const isCritical = info.count >= 3;
    items.push({
      id,
      dedupeKey,
      type: 'UNMET_DEMAND',
      severity: isCritical ? 'CRITICAL' : info.count >= 2 ? 'HIGH' : 'MEDIUM',
      categoryLabelAr: 'منتج مطلوب غير متوفر',
      categoryLabelEn: 'Unmet Customer Demand',
      titleAr: `طلب زبائن على منتج غير متوفر: ${info.name}`,
      titleEn: `Customer Inquiry for Unavailable Item: ${info.name}`,
      summaryAr: `تم السؤال عنه ${info.count} مرات بإجمالي ${info.totalUnits} وحدة مطلوبة.`,
      summaryEn: `Asked ${info.count} time(s) for a total of ${info.totalUnits} requested units.`,
      detailsAr: `سأل الزبائن عن "${info.name}" عدد (${info.count}) مرات في أوقات مختلفة بإجمالي كمية مطلوبة (${info.totalUnits} وحدة). توفير هذا الصنف يساعد في زيادة المبيعات وتلبية احتياجات العملاء.`,
      detailsEn: `Customers inquired about "${info.name}" ${info.count} time(s) across different visits (${info.totalUnits} total units). Sourcing this item captures lost revenue.`,
      recommendationAr: 'توفير المنتج من المورد وإضافته إلى كتالوج المنتجات.',
      recommendationEn: 'Source this product from suppliers and add it to the catalog.',
      metricBadge: `${info.count}× طلب`,
      timestamp: info.lastTs,
      status: st.status,
      resolutionNote: st.note,
      updatedAt: st.updatedAt,
      primaryActionTarget: 'reports',
      primaryActionLabelAr: 'عرض في تقرير غير المتوفر',
      primaryActionLabelEn: 'View in Unmet Demand Report',
    });
  }

  // 3. Unpaid Customer Debts from Transactions / Customers
  const openDebtTxns = transactions.filter(
    (tx) => tx.status === 'completed' && (tx.debtAmount || 0) > 0
  );
  if (openDebtTxns.length > 0) {
    const totalDebt = openDebtTxns.reduce((acc, tx) => acc + (tx.debtAmount || 0), 0);
    const id = 'notif-open-sales-debts';
    const dedupeKey = 'debt:open_invoices';
    seenKeys.add(dedupeKey);
    const st = resolveStatus(id, dedupeKey);
    items.push({
      id,
      dedupeKey,
      type: 'CUSTOMER_DEBT',
      severity: openDebtTxns.length >= 3 ? 'HIGH' : 'MEDIUM',
      categoryLabelAr: 'مديونيات الفواتير',
      categoryLabelEn: 'Outstanding Invoice Debt',
      titleAr: `فواتير آجلة غير محصلة (${openDebtTxns.length} فاتورة)`,
      titleEn: `Uncollected Credit Invoices (${openDebtTxns.length} invoices)`,
      summaryAr: `توجد ${openDebtTxns.length} فاتورة تحتوي على مديونية متبقية تحتاج للتحصيل.`,
      summaryEn: `There are ${openDebtTxns.length} completed invoices with remaining unpaid debt.`,
      detailsAr: `يوجد عدد (${openDebtTxns.length}) فاتورة مبيعات لم يتم سداد كامل قيمتها بعد. يمكنك فتح سجل المبيعات لتسوية الأقساط أو تحصيل الديون المتبقية.`,
      detailsEn: `There are ${openDebtTxns.length} sales transactions with outstanding balances. Open Sales History to record installment payments.`,
      recommendationAr: 'افتح صفحة المبيعات لتسوية المديونية أو تسجيل دفعة جديدة.',
      recommendationEn: 'Open Sales History to settle outstanding customer debt.',
      metricBadge: `${openDebtTxns.length} فواتير`,
      timestamp: openDebtTxns[0]?.timestamp || nowIso,
      status: st.status,
      resolutionNote: st.note,
      updatedAt: st.updatedAt,
      primaryActionTarget: 'sales',
      primaryActionLabelAr: 'فتح المبيعات لتحصيل الديون',
      primaryActionLabelEn: 'Open Sales to Settle Debt',
      evidenceMetrics: [
        { name: 'عدد الفواتير / Invoices', valueFormatted: String(openDebtTxns.length) },
        { name: 'إجمالي المتبقي / Total Debt', valueFormatted: totalDebt.toLocaleString() },
      ],
    });
  } else {
    const indebtedCustomers = customers.filter((c) => (c.totalDebt || 0) > 0);
    if (indebtedCustomers.length > 0) {
      const id = 'notif-customer-accounts-debt';
      const dedupeKey = 'debt:customers';
      seenKeys.add(dedupeKey);
      const st = resolveStatus(id, dedupeKey);
      items.push({
        id,
        dedupeKey,
        type: 'CUSTOMER_DEBT',
        severity: 'MEDIUM',
        categoryLabelAr: 'ذمم العملاء',
        categoryLabelEn: 'Customer Balances',
        titleAr: `ذمم عملاء مستحقة (${indebtedCustomers.length} عميل)`,
        titleEn: `Customer Outstanding Balances (${indebtedCustomers.length})`,
        summaryAr: `يوجد ${indebtedCustomers.length} عميل لديهم أرصدة مديونية مسجلة.`,
        summaryEn: `${indebtedCustomers.length} customer account(s) have outstanding debt balances.`,
        detailsAr: `توجد ذمم مالية مسجلة على ${indebtedCustomers.length} من حسابات العملاء. راجع قائمة العملاء لمتابعة السداد.`,
        detailsEn: `${indebtedCustomers.length} customer account(s) carry open debt balances. Review Customers directory for follow-up.`,
        recommendationAr: 'مراجعة صفحة العملاء لتحديث الأرصدة أو تحصيل الذمم.',
        recommendationEn: 'Open Customers directory to review and collect balances.',
        metricBadge: `${indebtedCustomers.length} عملاء`,
        timestamp: nowIso,
        status: st.status,
        resolutionNote: st.note,
        updatedAt: st.updatedAt,
        primaryActionTarget: 'customers',
        primaryActionLabelAr: 'فتح حسابات العملاء',
        primaryActionLabelEn: 'Open Customers Directory',
      });
    }
  }

  // 4. Smart Operational Alerts from BI Engine
  for (const alert of smartAlerts) {
    const dedupeKey = alert.dedupeKey || `smart_alert:${alert.id}`;
    if (seenKeys.has(dedupeKey)) continue;
    seenKeys.add(dedupeKey);

    const st = resolveStatus(alert.id, dedupeKey, alert.lifecycleStatus || 'active');
    const actionMeta = resolveSmartAlertQuickAction(alert);
    const sev: StoreNotificationSeverity =
      alert.severity === 'CRITICAL'
        ? 'CRITICAL'
        : alert.severity === 'HIGH'
        ? 'HIGH'
        : alert.severity === 'MEDIUM'
        ? 'MEDIUM'
        : 'LOW';

    items.push({
      id: alert.id,
      dedupeKey,
      type: 'SMART_BI_ALERT',
      severity: sev,
      categoryLabelAr: 'تنبيه ذكي وتشغيلي',
      categoryLabelEn: 'Smart Operational Alert',
      titleAr: alert.titleAr,
      titleEn: alert.titleEn,
      summaryAr: alert.descriptionAr,
      summaryEn: alert.descriptionEn,
      detailsAr: `${alert.descriptionAr} — ${alert.explanationAr}`,
      detailsEn: `${alert.descriptionEn} — ${alert.explanationEn}`,
      recommendationAr: alert.recommendedActionAr,
      recommendationEn: alert.recommendedActionEn,
      metricBadge: alert.evidenceMetrics?.[0]?.valueFormatted,
      timestamp: nowIso,
      status: st.status,
      resolutionNote: st.note,
      updatedAt: st.updatedAt,
      productId: alert.productId || undefined,
      primaryActionTarget: actionMeta.target,
      primaryActionLabelAr: actionMeta.labelAr,
      primaryActionLabelEn: actionMeta.labelEn,
      evidenceMetrics: alert.evidenceMetrics?.map(
        (m: { name: string; valueFormatted: string; comparisonText?: string }) => ({
          name: m.name,
          valueFormatted: m.valueFormatted,
          comparisonText: m.comparisonText,
        })
      ),
    });
  }

  // Sort active first, then by severity weight descending
  return items.sort((a, b) => {
    const aActive = a.status === 'active' ? 1 : 0;
    const bActive = b.status === 'active' ? 1 : 0;
    if (aActive !== bActive) return bActive - aActive;
    const sevDiff = SEVERITY_WEIGHT[b.severity] - SEVERITY_WEIGHT[a.severity];
    if (sevDiff !== 0) return sevDiff;
    return b.timestamp.localeCompare(a.timestamp);
  });
}

export function computeNotificationSummaryCounts(items: StoreNotificationItem[]) {
  let active = 0;
  let acknowledged = 0;
  let resolved = 0;
  let dismissed = 0;
  let criticalActive = 0;
  let highActive = 0;

  for (const item of items) {
    if (item.status === 'active') {
      active += 1;
      if (item.severity === 'CRITICAL') criticalActive += 1;
      if (item.severity === 'HIGH') highActive += 1;
    } else if (item.status === 'acknowledged') {
      acknowledged += 1;
    } else if (item.status === 'resolved') {
      resolved += 1;
    } else if (item.status === 'dismissed') {
      dismissed += 1;
    }
  }

  return {
    total: items.length,
    active,
    acknowledged,
    resolved,
    dismissed,
    criticalActive,
    highActive,
  };
}
