/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Product,
  Transaction,
  Customer,
  StockMovement,
  AppSettings,
  Currency,
  ExchangeRateItem,
  ExchangeRateHistoryEntry,
  POSUser,
  ActiveUserSession,
  CompanyProfile,
  BranchRecord,
  ExpenseRecord,
  WorkspaceMode,
} from '../lib/types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CUSTOMERS,
  INITIAL_TRANSACTIONS,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_USERS,
  INITIAL_UNMET_DEMAND_REQUESTS,
} from '../lib/initial-data';
import { UnmetDemandRequestRecord } from '../analytics/analytics.types';
import { getProductSerialNumber } from '../lib/inventory-rules';
import {
  EXCHANGE_RATES_STORAGE_KEY,
  EXCHANGE_RATE_ITEMS_STORAGE_KEY,
  CURRENCIES_STORAGE_KEY,
  DEFAULT_EXCHANGE_RATES_MAP,
  DEFAULT_CURRENCIES_LIST,
} from '../lib/exchange-rate-storage';

export interface ProductionSnapshot {
  products: Product[];
  transactions: Transaction[];
  expenses: ExpenseRecord[];
  customers: Customer[];
  stockMovements: StockMovement[];
  users: POSUser[];
  settings: AppSettings;
  currencies: Currency[];
  exchangeRates: Record<string, number>;
  exchangeRateItems: ExchangeRateItem[];
  exchangeRateHistory: ExchangeRateHistoryEntry[];
  unmetDemandRequests: UnmetDemandRequestRecord[];
  currentUserId: string;
}

export const STORAGE_KEYS = {
  PRODUCTS: 'dqnamo_pos_products_v1',
  TRANSACTIONS: 'dqnamo_pos_transactions_v1',
  CUSTOMERS: 'dqnamo_pos_customers_v1',
  MOVEMENTS: 'dqnamo_pos_movements_v1',
  SETTINGS: 'dqnamo_pos_settings_v1',
  CURRENCIES: CURRENCIES_STORAGE_KEY,
  EXCHANGE_RATES: EXCHANGE_RATES_STORAGE_KEY,
  EXCHANGE_RATE_ITEMS: EXCHANGE_RATE_ITEMS_STORAGE_KEY,
  RATE_HISTORY: 'dqnamo_pos_rate_history_v1',
  USERS: 'dqnamo_pos_users_v1',
  ACTIVE_SESSIONS: 'dqnamo_pos_active_sessions_v1',
  CURRENT_USER_ID: 'dqnamo_pos_current_user_id_v1',
  UNMET_DEMAND_REQUESTS: 'dqnamo_pos_unmet_demand_v1',
  WORKSPACE_MODE: 'dqnamo_pos_workspace_mode_v1',
  CURRENT_COMPANY_ID: 'dqnamo_pos_current_company_id_v1',
  COMPANIES: 'dqnamo_pos_companies_v1',
  BRANCHES: 'dqnamo_pos_branches_v1',
  ACTIVE_BRANCH_ID: 'dqnamo_pos_active_branch_id_v1',
  EXPENSES: 'pos_expenses',
  SESSION_TOKEN: 'dqnamo_pos_session_token_v1',
};

export const PRACTICE_STORAGE_KEYS = {
  PRODUCTS: 'dqnamo_pos_practice_products_v1',
  TRANSACTIONS: 'dqnamo_pos_practice_transactions_v1',
  CUSTOMERS: 'dqnamo_pos_practice_customers_v1',
  MOVEMENTS: 'dqnamo_pos_practice_movements_v1',
  SETTINGS: 'dqnamo_pos_practice_settings_v1',
  USERS: 'dqnamo_pos_practice_users_v1',
  UNMET_DEMAND_REQUESTS: 'dqnamo_pos_practice_unmet_demand_v1',
  EXPENSES: 'dqnamo_pos_practice_expenses_v1',
};

export const DEFAULT_COMPANY_PROFILE: CompanyProfile = {
  id: 'comp-default',
  legalName: 'Dqnamo Artisan Roasters & Deli LLC',
  displayName: 'Dqnamo Artisan Roasters & Deli',
  displayNameAr: 'دقنامو للتحميص المختص والديلي',
  businessType: 'Specialty Retail, Roastery & Deli',
  country: 'Sudan',
  city: 'Khartoum',
  address: '104 Nile Avenue, Downtown District, Khartoum',
  phone: '+249 91 230 0000',
  email: 'ops@dqnamo.sd',
  taxNumber: 'SD-TIN-904821',
  defaultLanguage: 'ar',
  timezone: 'Africa/Khartoum',
  fiscalYearStartMonth: 1,
  baseCurrency: 'SDG',
  secondaryCurrencies: ['USD', 'SAR', 'AED', 'EGP'],
  exchangeRatePolicy: 'manual_daily',
  isDemoPractice: false,
  onboardingCompleted: true,
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};

export const PRACTICE_COMPANY_PROFILE: CompanyProfile = {
  id: 'comp-demo-practice',
  legalName: 'Al-Noor Retail Training Sandbox LLC',
  displayName: 'Al-Noor Retail Training Co. (Practice)',
  displayNameAr: 'شركة النور للتدريب التجريبي (بيئة معزولة)',
  businessType: 'Retail & Wholesale Training Sandbox',
  country: 'Sudan',
  city: 'Khartoum',
  address: 'Practice Sandbox Avenue — Isolated Demo Environment',
  phone: '+249 90 000 0000',
  email: 'training@practice.local',
  taxNumber: 'PRACTICE-DEMO-000',
  defaultLanguage: 'ar',
  timezone: 'Africa/Khartoum',
  fiscalYearStartMonth: 1,
  baseCurrency: 'SDG',
  secondaryCurrencies: ['USD', 'SAR', 'AED', 'EGP'],
  exchangeRatePolicy: 'manual_daily',
  isDemoPractice: true,
  onboardingCompleted: true,
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};

export const DEFAULT_BRANCHES_LIST: BranchRecord[] = [
  {
    id: 'branch-main',
    companyId: 'comp-default',
    code: 'KRT-MAIN',
    name: 'Khartoum Main Branch',
    nameAr: 'فرع الخرطوم الرئيسي',
    city: 'Khartoum',
    address: '104 Nile Avenue, Khartoum',
    phone: '+249 91 230 0000',
    isMainBranch: true,
    isActive: true,
  },
  {
    id: 'branch-omdurman',
    companyId: 'comp-default',
    code: 'OMD-02',
    name: 'Omdurman Souq Branch',
    nameAr: 'فرع سوق أمدرمان',
    city: 'Omdurman',
    address: 'Al-Arbaeen Street, Omdurman',
    phone: '+249 91 230 0002',
    isMainBranch: false,
    isActive: true,
  },
  {
    id: 'branch-bahri',
    companyId: 'comp-default',
    code: 'BHR-03',
    name: 'Bahri Industrial Branch',
    nameAr: 'فرع بحري الصناعات',
    city: 'Bahri',
    address: 'Industrial Area Block 4, Bahri',
    phone: '+249 91 230 0003',
    isMainBranch: false,
    isActive: true,
  },
];

export function enrichProductWithSeedMetadata(p: Product, idx: number): Product {
  const seedMatch = INITIAL_PRODUCTS.find((sp) => sp.id === p.id || sp.sku === p.sku);
  const serialNumber = getProductSerialNumber(
    p,
    seedMatch?.serialNumber ? seedMatch.serialNumber - 1 : idx
  );
  const description = p.description ?? p.customFields?.description ?? seedMatch?.description;
  const descriptionAr = p.descriptionAr ?? p.customFields?.descriptionAr ?? seedMatch?.descriptionAr;
  const createdAt =
    p.createdAt ?? p.customFields?.createdAt ?? seedMatch?.createdAt ?? p.updatedAt;
  const previousCostPrice =
    p.previousCostPrice ?? p.customFields?.previousCostPrice ?? seedMatch?.previousCostPrice;
  const previousSellingPrice =
    p.previousSellingPrice ??
    p.customFields?.previousSellingPrice ??
    seedMatch?.previousSellingPrice;
  const priceUpdatedAt =
    p.priceUpdatedAt ?? p.customFields?.priceUpdatedAt ?? seedMatch?.priceUpdatedAt;
  const priceHistory =
    p.priceHistory && p.priceHistory.length > 0
      ? p.priceHistory
      : p.customFields?.priceHistory && p.customFields.priceHistory.length > 0
      ? p.customFields.priceHistory
      : seedMatch?.priceHistory;
  const modificationHistory =
    p.modificationHistory && p.modificationHistory.length > 0
      ? p.modificationHistory
      : p.customFields?.modificationHistory && p.customFields.modificationHistory.length > 0
      ? p.customFields.modificationHistory
      : seedMatch?.modificationHistory;

  return {
    ...p,
    serialNumber,
    description,
    descriptionAr,
    createdAt,
    previousCostPrice,
    previousSellingPrice,
    priceUpdatedAt,
    priceHistory,
    modificationHistory,
    customFields: {
      ...(p.customFields || {}),
      serialNumber,
      description,
      descriptionAr,
      createdAt,
      previousCostPrice,
      previousSellingPrice,
      priceUpdatedAt,
      priceHistory,
      modificationHistory,
    },
  };
}

export const CLEAN_PRODUCTION_MIGRATION_KEY = 'dqnamo_pos_clean_prod_v5';

export const DEMO_SEED_PRODUCT_IDS = new Set(INITIAL_PRODUCTS.map((p) => p.id));
export const DEMO_SEED_SKUS = new Set(INITIAL_PRODUCTS.map((p) => p.sku));
export const DEMO_SEED_TX_IDS = new Set(INITIAL_TRANSACTIONS.map((t) => t.id));
export const DEMO_SEED_CUSTOMER_IDS = new Set(INITIAL_CUSTOMERS.map((c) => c.id));
export const DEMO_SEED_MOVEMENT_IDS = new Set(INITIAL_STOCK_MOVEMENTS.map((m) => m.id));
export const DEMO_SEED_USER_IDS = new Set(INITIAL_USERS.map((u) => u.id));
export const DEMO_SEED_DEMAND_IDS = new Set(
  (INITIAL_UNMET_DEMAND_REQUESTS as UnmetDemandRequestRecord[]).map((d) => d.id)
);

export function getCompanyStorageKey(baseKey: string, companyId: string): string {
  const cleanId = (companyId || 'comp-default').trim();
  return `${baseKey}_${cleanId}`;
}

export function filterOutDemoProducts(list: Product[]): Product[] {
  if (!Array.isArray(list)) return [];
  return list.filter(
    (p) =>
      p &&
      !DEMO_SEED_PRODUCT_IDS.has(p.id) &&
      !DEMO_SEED_SKUS.has(p.sku) &&
      !String(p.sku || '').startsWith('PERF-SKU-')
  );
}

export function filterOutDemoUsers(list: POSUser[]): POSUser[] {
  if (!Array.isArray(list)) return [];
  return list.filter((u) => u && !DEMO_SEED_USER_IDS.has(u.id));
}

let hasCompletedCleanProductionMigrationInSession = false;

export function resetCleanProductionMigrationSessionGuard(): void {
  hasCompletedCleanProductionMigrationInSession = false;
}

export function ensureCleanProductionMigration(): boolean {
  if (hasCompletedCleanProductionMigrationInSession) return false;
  if (typeof localStorage === 'undefined') return false;
  try {
    if (localStorage.getItem(CLEAN_PRODUCTION_MIGRATION_KEY) === 'true') {
      hasCompletedCleanProductionMigrationInSession = true;
      return false;
    }
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    localStorage.removeItem(STORAGE_KEYS.MOVEMENTS);
    localStorage.removeItem(STORAGE_KEYS.CURRENCIES);
    localStorage.removeItem(STORAGE_KEYS.EXCHANGE_RATES);
    localStorage.removeItem(STORAGE_KEYS.EXCHANGE_RATE_ITEMS);
    localStorage.removeItem(STORAGE_KEYS.RATE_HISTORY);
    localStorage.removeItem(STORAGE_KEYS.UNMET_DEMAND_REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSIONS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);

    const keysToPurge: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (
        k &&
        (k.startsWith(STORAGE_KEYS.CURRENCIES) ||
          k.startsWith(STORAGE_KEYS.EXCHANGE_RATES) ||
          k.startsWith(STORAGE_KEYS.EXCHANGE_RATE_ITEMS) ||
          k.startsWith(STORAGE_KEYS.RATE_HISTORY) ||
          k.startsWith('dqnamo_pos_exchange_rate_inputs_v1'))
      ) {
        keysToPurge.push(k);
      }
    }
    for (const k of keysToPurge) {
      localStorage.removeItem(k);
    }

    const savedCompanies = localStorage.getItem(STORAGE_KEYS.COMPANIES);
    if (savedCompanies) {
      const parsed = JSON.parse(savedCompanies);
      if (Array.isArray(parsed)) {
        const userCompanies = parsed.filter(
          (c: CompanyProfile) => c && !c.isDemoPractice && c.id !== 'comp-default'
        );
        localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(userCompanies));
      }
    }
    localStorage.setItem(CLEAN_PRODUCTION_MIGRATION_KEY, 'true');
    hasCompletedCleanProductionMigrationInSession = true;
    return true;
  } catch {
    return false;
  }
}

export function buildPracticeExchangeRateItems(): ExchangeRateItem[] {
  const nowIso = new Date().toISOString();
  return DEFAULT_CURRENCIES_LIST.filter((c) => !c.isBase).map((c) => {
    const r = DEFAULT_EXCHANGE_RATES_MAP[c.code] || 100;
    return {
      id: `prac-rate-${c.code.toLowerCase()}-sdg`,
      sourceCurrency: c.code,
      targetCurrency: 'SDG',
      rate: r,
      inverseRate: Math.round((1 / r) * 1000000) / 1000000,
      effectiveFrom: nowIso,
      expiryDate: null,
      isActive: true,
      sourceSymbol: c.symbol,
      targetSymbol: 'ج.س',
      sourceName: c.name,
      targetName: 'Sudanese Pound',
    };
  });
}

export function createEmptyCompanyOperationalState() {
  return {
    products: [] as Product[],
    transactions: [] as Transaction[],
    expenses: [] as ExpenseRecord[],
    customers: [] as Customer[],
    stockMovements: [] as StockMovement[],
    unmetDemandRequests: [] as UnmetDemandRequestRecord[],
    currencies: [] as Currency[],
    exchangeRates: { SDG: 1 } as Record<string, number>,
    exchangeRateItems: [] as ExchangeRateItem[],
    exchangeRateHistory: [] as ExchangeRateHistoryEntry[],
    users: [] as POSUser[],
    activeSessions: [] as ActiveUserSession[],
  };
}

export function loadCompanyOperationalState(
  companyId: string,
  workspaceMode: WorkspaceMode = 'PRODUCTION'
) {
  if (workspaceMode === 'PRACTICE') {
    return createEmptyCompanyOperationalState();
  }

  let products: Product[] = [];
  let transactions: Transaction[] = [];
  let expenses: ExpenseRecord[] = [];
  let customers: Customer[] = [];
  let stockMovements: StockMovement[] = [];
  let unmetDemandRequests: UnmetDemandRequestRecord[] = [];
  let currencies: Currency[] = [];
  let exchangeRates: Record<string, number> = { SDG: 1 };
  let exchangeRateItems: ExchangeRateItem[] = [];
  let exchangeRateHistory: ExchangeRateHistoryEntry[] = [];
  let users: POSUser[] = [];
  let activeSessions: ActiveUserSession[] = [];

  let isRestoredCompany = false;
  try {
    isRestoredCompany =
      localStorage.getItem(getCompanyStorageKey('pos_backup_restored', companyId)) === 'true' ||
      localStorage.getItem('pos_backup_restored_global') === 'true';
  } catch {}

  try {
    const rawProds = localStorage.getItem(getCompanyStorageKey(STORAGE_KEYS.PRODUCTS, companyId));
    if (rawProds) {
      const parsedProds = JSON.parse(rawProds);
      products = isRestoredCompany
        ? Array.isArray(parsedProds)
          ? parsedProds
          : []
        : filterOutDemoProducts(parsedProds);
    }
  } catch {}

  try {
    const rawTxs = localStorage.getItem(getCompanyStorageKey(STORAGE_KEYS.TRANSACTIONS, companyId));
    if (rawTxs) {
      const parsed: Transaction[] = JSON.parse(rawTxs);
      transactions = Array.isArray(parsed)
        ? isRestoredCompany
          ? parsed
          : parsed.filter((t) => t && !DEMO_SEED_TX_IDS.has(t.id))
        : [];
    }
  } catch {}

  try {
    const rawCusts = localStorage.getItem(getCompanyStorageKey(STORAGE_KEYS.CUSTOMERS, companyId));
    if (rawCusts) {
      const parsed: Customer[] = JSON.parse(rawCusts);
      customers = Array.isArray(parsed)
        ? isRestoredCompany
          ? parsed
          : parsed.filter((c) => c && !DEMO_SEED_CUSTOMER_IDS.has(c.id))
        : [];
    }
  } catch {}

  try {
    const rawMovs = localStorage.getItem(getCompanyStorageKey(STORAGE_KEYS.MOVEMENTS, companyId));
    if (rawMovs) {
      const parsed: StockMovement[] = JSON.parse(rawMovs);
      stockMovements = Array.isArray(parsed)
        ? isRestoredCompany
          ? parsed
          : parsed.filter((m) => m && !DEMO_SEED_MOVEMENT_IDS.has(m.id))
        : [];
    }
  } catch {}

  try {
    const rawDemand = localStorage.getItem(
      getCompanyStorageKey(STORAGE_KEYS.UNMET_DEMAND_REQUESTS, companyId)
    );
    if (rawDemand) {
      const parsed: UnmetDemandRequestRecord[] = JSON.parse(rawDemand);
      unmetDemandRequests = Array.isArray(parsed)
        ? isRestoredCompany
          ? parsed
          : parsed.filter((d) => d && !DEMO_SEED_DEMAND_IDS.has(d.id))
        : [];
    }
  } catch {}

  try {
    const rawCur = localStorage.getItem(getCompanyStorageKey(STORAGE_KEYS.CURRENCIES, companyId));
    if (rawCur) {
      const parsed: Currency[] = JSON.parse(rawCur);
      if (Array.isArray(parsed)) {
        currencies = parsed;
      }
    }
  } catch {}

  try {
    const rawRates = localStorage.getItem(
      getCompanyStorageKey(STORAGE_KEYS.EXCHANGE_RATES, companyId)
    );
    if (rawRates) {
      const parsed = JSON.parse(rawRates);
      if (parsed && typeof parsed === 'object') {
        exchangeRates = { ...parsed, SDG: 1 };
      }
    }
  } catch {}

  try {
    const rawItems = localStorage.getItem(
      getCompanyStorageKey(STORAGE_KEYS.EXCHANGE_RATE_ITEMS, companyId)
    );
    if (rawItems) {
      const parsed = JSON.parse(rawItems);
      if (Array.isArray(parsed)) {
        exchangeRateItems = parsed;
      }
    }
  } catch {}

  try {
    const rawHist = localStorage.getItem(
      getCompanyStorageKey(STORAGE_KEYS.RATE_HISTORY, companyId)
    );
    if (rawHist) {
      const parsed = JSON.parse(rawHist);
      if (Array.isArray(parsed)) {
        exchangeRateHistory = parsed;
      }
    }
  } catch {}

  try {
    const rawUsers = localStorage.getItem(getCompanyStorageKey(STORAGE_KEYS.USERS, companyId));
    if (rawUsers) {
      users = filterOutDemoUsers(JSON.parse(rawUsers));
    }
  } catch {}

  try {
    const rawSessions = localStorage.getItem(
      getCompanyStorageKey(STORAGE_KEYS.ACTIVE_SESSIONS, companyId)
    );
    if (rawSessions) {
      const parsed: ActiveUserSession[] = JSON.parse(rawSessions);
      const validUserIds = new Set(users.map((u) => u.id));
      activeSessions = Array.isArray(parsed)
        ? parsed.filter((s) => s && validUserIds.has(s.userId) && !DEMO_SEED_USER_IDS.has(s.userId))
        : [];
    }
  } catch {}

  try {
    const rawExpenses = localStorage.getItem(
      getCompanyStorageKey(STORAGE_KEYS.EXPENSES, companyId)
    );
    if (rawExpenses) {
      const parsed: ExpenseRecord[] = JSON.parse(rawExpenses);
      if (Array.isArray(parsed)) {
        expenses = parsed.filter((e) => e && e.id && e.title);
      }
    }
  } catch {}

  return {
    products,
    transactions,
    expenses,
    customers,
    stockMovements,
    unmetDemandRequests,
    currencies,
    exchangeRates,
    exchangeRateItems,
    exchangeRateHistory,
    users,
    activeSessions,
  };
}

export interface PersistCompanyScopedSliceParams<T> {
  value: T;
  workspaceMode: WorkspaceMode;
  currentCompanyId: string;
  prodBaseKey: string;
  practiceKey?: string;
  mirrorGlobalProdKey?: boolean;
}

/**
 * Serializes `value` once and persists it to the appropriate company-scoped or practice-mode
 * localStorage keys without redundant `JSON.stringify` allocations.
 */
export function persistCompanyScopedSlice<T>({
  value,
  workspaceMode,
  currentCompanyId,
  prodBaseKey,
  practiceKey,
  mirrorGlobalProdKey = true,
}: PersistCompanyScopedSliceParams<T>): void {
  try {
    if (workspaceMode === 'PRACTICE') {
      if (practiceKey) {
        localStorage.setItem(practiceKey, JSON.stringify(value));
      }
      return;
    }

    const serialized = JSON.stringify(value);
    localStorage.setItem(getCompanyStorageKey(prodBaseKey, currentCompanyId), serialized);
    if (mirrorGlobalProdKey) {
      localStorage.setItem(prodBaseKey, serialized);
    }
  } catch {}
}

export function persistStorageValue<T>(
  key: string,
  value: T,
  options?: { rawString?: boolean; enabled?: boolean }
): void {
  if (options?.enabled === false) return;
  try {
    const serialized = options?.rawString ? String(value) : JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch {}
}

export interface CrossTabStorageSyncHandlers {
  setProducts: (next: Product[]) => void;
  setTransactions: (next: Transaction[]) => void;
  setCustomers: (next: Customer[]) => void;
  setExpenses?: (next: ExpenseRecord[]) => void;
  setStockMovements?: (next: StockMovement[]) => void;
  setUsers: (next: POSUser[]) => void;
  setActiveSessions: (next: ActiveUserSession[]) => void;
  setUnmetDemandRequests: (next: UnmetDemandRequestRecord[]) => void;
}

/**
 * Applies a browser cross-tab `storage` event (`e.key`, `e.newValue`) to the matching
 * state slice setter when in `PRODUCTION` mode, including `customers`, `expenses`, and `stockMovements`.
 */
export function applyCrossTabStorageEvent(
  event: { key: string | null; newValue: string | null },
  workspaceMode: WorkspaceMode,
  currentCompanyId: string,
  handlers: CrossTabStorageSyncHandlers
): boolean {
  if (!event.key || !event.newValue || workspaceMode === 'PRACTICE') {
    return false;
  }

  try {
    const parsed = JSON.parse(event.newValue);
    if (!Array.isArray(parsed)) return false;

    if (event.key === getCompanyStorageKey(STORAGE_KEYS.PRODUCTS, currentCompanyId)) {
      handlers.setProducts(parsed);
      return true;
    }
    if (event.key === getCompanyStorageKey(STORAGE_KEYS.TRANSACTIONS, currentCompanyId)) {
      handlers.setTransactions(parsed);
      return true;
    }
    if (event.key === getCompanyStorageKey(STORAGE_KEYS.CUSTOMERS, currentCompanyId)) {
      handlers.setCustomers(parsed);
      return true;
    }
    if (
      handlers.setExpenses &&
      event.key === getCompanyStorageKey(STORAGE_KEYS.EXPENSES, currentCompanyId)
    ) {
      handlers.setExpenses(parsed);
      return true;
    }
    if (
      handlers.setStockMovements &&
      event.key === getCompanyStorageKey(STORAGE_KEYS.MOVEMENTS, currentCompanyId)
    ) {
      handlers.setStockMovements(parsed);
      return true;
    }
    if (
      event.key === getCompanyStorageKey(STORAGE_KEYS.USERS, currentCompanyId) ||
      event.key === STORAGE_KEYS.USERS
    ) {
      handlers.setUsers(parsed);
      return true;
    }
    if (
      event.key === getCompanyStorageKey(STORAGE_KEYS.ACTIVE_SESSIONS, currentCompanyId) ||
      event.key === STORAGE_KEYS.ACTIVE_SESSIONS
    ) {
      handlers.setActiveSessions(parsed);
      return true;
    }
    if (
      event.key === getCompanyStorageKey(STORAGE_KEYS.UNMET_DEMAND_REQUESTS, currentCompanyId)
    ) {
      handlers.setUnmetDemandRequests(parsed);
      return true;
    }
  } catch {}

  return false;
}
