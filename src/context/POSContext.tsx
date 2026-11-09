/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useReducer, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  LanSyncConfig,
  LanConnectedDeviceInfo,
  LanSyncEventRecord,
  LanNetworkAddressItem,
} from '../lib/lan-sync-client';
import {
  Product,
  CartItem,
  Transaction,
  Customer,
  StockMovement,
  AppSettings,
  AppNavTab,
  PaymentMethod,
  CheckoutPaymentDetails,
  StockMovementType,
  Currency,
  ExchangeRateItem,
  InvoiceFulfillmentStatus,
  InvoiceFulfillmentType,
  GoodsReceiptInput,
  ExchangeRateHistoryEntry,
  ProductSaleUnitMode,
  DebtSettlementInput,
  POSUser,
  ActiveUserSession,
  UserRole,
  RolePermissions,
  WorkspaceMode,
  CompanyProfile,
  BranchRecord,
  OnboardingChecklistStatus,
  ExpenseRecord,
  ExpenseInput,
} from '../lib/types';
import {
  CapabilityCode,
  deriveCapabilitiesFromUser,
} from '../lib/rbac-capabilities';
import {
  INITIAL_PRODUCTS,
  INITIAL_CUSTOMERS,
  INITIAL_TRANSACTIONS,
  INITIAL_SETTINGS,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_EXCHANGE_RATE_HISTORY,
  INITIAL_USERS,
  INITIAL_ACTIVE_SESSIONS,
  DEFAULT_ROLE_PERMISSIONS,
  INITIAL_UNMET_DEMAND_REQUESTS,
  INITIAL_EXPENSES,
} from '../lib/initial-data';
import {
  UnmetDemandRequestInput,
  UnmetDemandRequestRecord,
} from '../analytics/analytics.types';
import { UnmetDemandValidationResult } from '../analytics/unmet-demand.validation';
import {
  AtomicCheckoutCommitPayload,
  CartTotalsResult,
  computeAtomicCheckoutStateTransition,
  computeAtomicVoidTransactionStateTransition,
  OperationalLedgerState,
} from '../lib/pos-calculations';
import {
  DEFAULT_EXCHANGE_RATES_MAP,
  DEFAULT_CURRENCIES_LIST,
  savePersistedCurrencies,
  savePersistedExchangeRates,
  savePersistedExchangeRateItems,
} from '../lib/exchange-rate-storage';
import { TrainingTourProgressState } from '../lib/training-tour';
import { BackupPayloadV1 } from '../lib/backup-merge-engine';
import {
  offlineSqliteStorage,
  OfflineSqliteDiagnostics,
} from '../lib/offline-sqlite-storage';

import {
  STORAGE_KEYS,
  PRACTICE_STORAGE_KEYS,
  DEFAULT_COMPANY_PROFILE,
  PRACTICE_COMPANY_PROFILE,
  DEMO_SEED_USER_IDS,
  enrichProductWithSeedMetadata,
  getCompanyStorageKey,
  ensureCleanProductionMigration,
  buildPracticeExchangeRateItems,
  loadCompanyOperationalState,
  applyCrossTabStorageEvent,
} from './pos-storage-helpers';

import { SettingsContext, SettingsContextType, useSettingsContext } from './SettingsContext';
import { UserContext, UserContextType, useUserContext } from './UserContext';
import { ProductContext, ProductContextType, useProductContext } from './ProductContext';
import { CartContext, CartContextType, useCartContext } from './CartContext';
import { ExpenseContext, ExpenseContextType, useExpenseContext } from './ExpenseContext';

import { useCurrenciesAndSettingsDomain } from './domains/useCurrenciesAndSettingsDomain';
import { useUserAccountsDomain } from './domains/useUserAccountsDomain';
import { useTrainingAndDemandDomain } from './domains/useTrainingAndDemandDomain';
import { useBackupHydrationDomain } from './domains/useBackupHydrationDomain';
import { useLanSyncDomain } from './domains/useLanSyncDomain';
import {
  useWorkspaceCompanyDomain,
  OnboardingModalView,
} from './domains/useWorkspaceCompanyDomain';
import { useCatalogAndCartDomain } from './domains/useCatalogAndCartDomain';
import {
  usePersistCompanyScopedSlice,
  usePersistStorageValue,
} from './domains/usePersistStorageState';

export type { OnboardingModalView };
export {
  SettingsContext,
  useSettingsContext,
  UserContext,
  useUserContext,
  ProductContext,
  useProductContext,
  CartContext,
  useCartContext,
  ExpenseContext,
  useExpenseContext,
};

export interface POSContextType {
  products: Product[];
  cart: CartItem[];
  transactions: Transaction[];
  expenses: ExpenseRecord[];
  customers: Customer[];
  stockMovements: StockMovement[];
  settings: AppSettings;
  currencies: Currency[];
  exchangeRates: Record<string, number>;
  exchangeRateItems: ExchangeRateItem[];
  exchangeRateHistory: ExchangeRateHistoryEntry[];
  activeTab: AppNavTab;
  setActiveTab: (tab: AppNavTab) => void;
  selectedCustomer: Customer | null;
  setSelectedCustomer: (customer: Customer | null) => void;
  globalDiscountPercent: number;
  setGlobalDiscountPercent: (discount: number) => void;
  globalDiscountAmount: number;
  setGlobalDiscountAmount: (amount: number) => void;
  cartTotals: CartTotalsResult;

  // Phase 11: Workspace Mode, Company Isolation, Onboarding & Branch Management
  workspaceMode: WorkspaceMode;
  currentCompany: CompanyProfile;
  companies: CompanyProfile[];
  branches: BranchRecord[];
  activeBranchId: string;
  setActiveBranchId: (branchId: string) => void;
  enterPracticeMode: () => Promise<void>;
  exitPracticeMode: () => Promise<void>;
  resetPracticeModeData: () => Promise<void>;
  createNewCompanyWorkspace: (input: Record<string, any>) => Promise<{
    ok: boolean;
    error?: string;
    company?: CompanyProfile;
    owner?: POSUser;
    branch?: BranchRecord;
  }>;
  switchCompanyWorkspace: (companyId: string, userId?: string) => Promise<void>;
  isOnboardingModalOpen: boolean;
  onboardingModalInitialView: OnboardingModalView;
  openOnboardingModal: (view?: OnboardingModalView) => void;
  closeOnboardingModal: () => void;
  createBranch: (input: {
    name: string;
    nameAr?: string;
    code?: string;
    city?: string;
    address?: string;
    phone?: string;
    isMainBranch?: boolean;
  }) => Promise<BranchRecord | null>;
  updateBranch: (branchId: string, updates: Partial<BranchRecord>) => void;
  deleteBranch: (branchId: string) => void;
  onboardingChecklist: OnboardingChecklistStatus;

  // Users, Role Permissions, Granular Capabilities & Multi-User Concurrent Active Sessions
  users: POSUser[];
  activeSessions: ActiveUserSession[];
  currentUser: POSUser;
  switchCurrentUser: (userId: string) => void;
  saveUser: (
    userData: Partial<POSUser> & { name: string; role: UserRole; password?: string }
  ) => POSUser;
  removeUser: (userId: string) => void;
  deleteUserAccount: (userId: string) => void;
  clearAllUserAccounts: () => void;
  deactivateUserAccount: (
    userId: string,
    reason?: string
  ) => Promise<{ ok: boolean; error?: string }>;
  reactivateUserAccount: (userId: string) => Promise<{ ok: boolean; error?: string }>;
  resetUserPasswordOrPin: (
    userId: string,
    newPassword?: string,
    newPin?: string
  ) => Promise<{ ok: boolean; error?: string }>;
  toggleUserActiveSession: (userId: string, terminalName?: string) => void;
  hasPermission: (permission: keyof RolePermissions) => boolean;
  hasCapability: (capability: CapabilityCode) => boolean;

  // Cart actions
  addToCart: (product: Product, quantity?: number, saleUnit?: ProductSaleUnitMode) => boolean;
  updateCartQuantity: (productId: string, delta: number) => void;
  setCartItemSaleUnit: (productId: string, saleUnit: ProductSaleUnitMode) => void;
  setCartItemDiscount: (productId: string, discountPercent: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;

  // Checkout
  processCheckout: (
    paymentMethod: PaymentMethod,
    amountTendered: number,
    details?: CheckoutPaymentDetails
  ) => Promise<{ success: boolean; transaction?: Transaction; error?: string }>;

  // Products
  addProduct: (product: Omit<Product, 'id' | 'updatedAt'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product | void>;
  deleteProduct: (id: string) => Promise<void>;
  pendingNewProductBarcode: string | null;
  setPendingNewProductBarcode: (code: string | null) => void;
  openAddProductWithBarcode: (code: string) => void;

  // Inventory & Goods Receipt
  recordStockAdjustment: (
    productId: string,
    type: StockMovementType,
    amount: number,
    reason: string
  ) => void;
  recordGoodsReceipt: (input: GoodsReceiptInput) => boolean;

  // Customers
  addCustomer: (
    customer: Omit<
      Customer,
      'id' | 'createdAt' | 'totalSpent' | 'transactionCount' | 'loyaltyPoints'
    >
  ) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  // Expenses (المنصرفات)
  addExpense: (input: ExpenseInput) => { ok: boolean; expense?: ExpenseRecord; error?: string };
  updateExpense: (id: string, updates: Partial<ExpenseRecord>) => boolean;
  voidExpense: (id: string) => boolean;
  deleteExpense: (id: string) => void;

  // Transactions
  voidTransaction: (transactionId: string) => boolean;
  settleTransactionDebt: (
    transactionId: string,
    useIndexedNewRate?: boolean,
    anchorCurrency?: string,
    settlementDetails?: DebtSettlementInput
  ) => boolean;
  updateTransactionFulfillment: (
    transactionId: string,
    fulfillmentStatus: InvoiceFulfillmentStatus,
    fulfillmentType?: InvoiceFulfillmentType
  ) => boolean;
  applyNewRateToTransaction: (transactionId: string, anchorCurrency?: string) => boolean;
  applyNewRateToAllTransactions: (onlyDebt?: boolean, anchorCurrency?: string) => number;
  lockTransactionSaleRate: (
    transactionId: string,
    saleRateToSdg: number,
    referenceCurrency?: string
  ) => boolean;

  // Settings, Currencies, Exchange Rates & Sync
  updateSettings: (updates: Partial<AppSettings>) => void;
  saveCurrency: (data: {
    code: string;
    name: string;
    nameAr?: string;
    symbol: string;
    decimalPlaces?: number;
    initialRateToBase?: number;
    isBase?: boolean;
  }) => Promise<Currency>;
  removeCurrency: (code: string) => Promise<void>;
  clearAllCurrencies: () => void;
  setBaseCurrencyCode: (code: string) => void;
  syncCurrenciesState: (list: Currency[]) => void;
  updateExchangeRate: (data: {
    sourceCurrency: string;
    targetCurrency: string;
    rate: number;
    effectiveFrom?: string;
    expiryDate?: string | null;
  }) => Promise<ExchangeRateItem>;
  syncExchangeRatesState: (items: ExchangeRateItem[]) => void;
  resetAllData: () => void;
  executeAuthorizedFactoryReset: (params: {
    scope: 'LOCAL_DEVICE_RESET' | 'COMPANY_FACTORY_RESET';
    confirmCompanyName?: string;
    ownerUsernameOrId?: string;
    ownerPassword?: string;
    reason?: string;
  }) => Promise<{
    ok: boolean;
    error?: string;
    scope?: string;
    deletedCounts?: Record<string, number>;
  }>;
  collectClientBackupDataset: () => BackupPayloadV1;
  hydrateCompanyFromBackupPayload: (
    payload: BackupPayloadV1,
    options?: { switchToNewCompany?: boolean; newOwner?: POSUser }
  ) => void;
  syncTransactions: () => Promise<void>;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  sqliteDiagnostics: OfflineSqliteDiagnostics;

  // Interactive Training Tour & Onboarding
  isTrainingTourOpen: boolean;
  trainingTourStepIndex: number;
  trainingTourProgress: TrainingTourProgressState;
  startTrainingTour: (stepIndex?: number) => void;
  closeTrainingTour: () => void;
  nextTrainingTourStep: () => void;
  prevTrainingTourStep: () => void;
  selectTrainingTourStep: (stepIndex: number) => void;
  finishTrainingTour: () => void;
  resetTrainingTour: () => void;

  // Phase 10: Customer Demand Intelligence (Unmet Demand Capture)
  unmetDemandRequests: UnmetDemandRequestRecord[];
  recordUnmetDemandRequest: (
    input: Partial<UnmetDemandRequestInput>
  ) => Promise<UnmetDemandValidationResult>;
  isUnmetDemandModalOpen: boolean;
  unmetDemandModalInitialData: Partial<UnmetDemandRequestInput> | null;
  openUnmetDemandModal: (initial?: Partial<UnmetDemandRequestInput>) => void;
  closeUnmetDemandModal: () => void;

  // Phase 12: Live Bidirectional Wi-Fi LAN Sync (Windows <-> Android)
  lanSyncConfig: LanSyncConfig;
  updateLanSyncConfig: (updates: Partial<LanSyncConfig>) => LanSyncConfig;
  lanConnectionStatus: 'connected' | 'connecting' | 'disconnected' | 'unconfigured';
  lanConnectedDevices: LanConnectedDeviceInfo[];
  lanRecentEvents: LanSyncEventRecord[];
  lanNetworkAddresses: LanNetworkAddressItem[];
  lanPrimaryHostUrl: string;
  lanLastSyncError: string | null;
  pushLiveLanSyncNow: (summaryAr?: string, summaryEn?: string) => Promise<boolean>;
  applyIncomingLanSyncState: (remoteState: any, sourceDeviceId?: string) => void;
}

type OperationalLedgerAction =
  | { type: 'SET_PRODUCTS'; updater: React.SetStateAction<Product[]> }
  | { type: 'SET_TRANSACTIONS'; updater: React.SetStateAction<Transaction[]> }
  | { type: 'SET_CUSTOMERS'; updater: React.SetStateAction<Customer[]> }
  | { type: 'SET_STOCK_MOVEMENTS'; updater: React.SetStateAction<StockMovement[]> }
  | { type: 'COMMIT_CHECKOUT_ATOMIC'; payload: AtomicCheckoutCommitPayload }
  | { type: 'VOID_TRANSACTION_ATOMIC'; payload: { transactionId: string; nowIso?: string } };

function operationalLedgerReducer(
  state: OperationalLedgerState,
  action: OperationalLedgerAction
): OperationalLedgerState {
  switch (action.type) {
    case 'SET_PRODUCTS': {
      const nextProducts =
        typeof action.updater === 'function'
          ? (action.updater as (prev: Product[]) => Product[])(state.products)
          : action.updater;
      return nextProducts === state.products ? state : { ...state, products: nextProducts };
    }
    case 'SET_TRANSACTIONS': {
      const nextTransactions =
        typeof action.updater === 'function'
          ? (action.updater as (prev: Transaction[]) => Transaction[])(state.transactions)
          : action.updater;
      return nextTransactions === state.transactions
        ? state
        : { ...state, transactions: nextTransactions };
    }
    case 'SET_CUSTOMERS': {
      const nextCustomers =
        typeof action.updater === 'function'
          ? (action.updater as (prev: Customer[]) => Customer[])(state.customers)
          : action.updater;
      return nextCustomers === state.customers ? state : { ...state, customers: nextCustomers };
    }
    case 'SET_STOCK_MOVEMENTS': {
      const nextStockMovements =
        typeof action.updater === 'function'
          ? (action.updater as (prev: StockMovement[]) => StockMovement[])(state.stockMovements)
          : action.updater;
      return nextStockMovements === state.stockMovements
        ? state
        : { ...state, stockMovements: nextStockMovements };
    }
    case 'COMMIT_CHECKOUT_ATOMIC': {
      const next = computeAtomicCheckoutStateTransition(state, action.payload);
      return {
        products: next.products,
        transactions: next.transactions,
        customers: next.customers,
        stockMovements: next.stockMovements,
      };
    }
    case 'VOID_TRANSACTION_ATOMIC': {
      const next = computeAtomicVoidTransactionStateTransition(state, action.payload);
      if (!next.voided) return state;
      return {
        products: next.products,
        transactions: next.transactions,
        customers: next.customers,
        stockMovements: next.stockMovements,
      };
    }
    default:
      return state;
  }
}

const POSContext = createContext<POSContextType | null>(null);

export const POSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Run clean production migration strictly once on initial mount (never on re-renders)
  useState(() => ensureCleanProductionMigration());
  useEffect(() => {
    ensureCleanProductionMigration();
  }, []);

  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WORKSPACE_MODE);
      return saved === 'PRACTICE' ? 'PRACTICE' : 'PRODUCTION';
    } catch {
      return 'PRODUCTION';
    }
  });

  const [companies, setCompanies] = useState<CompanyProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPANIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (c: CompanyProfile) => c && !c.isDemoPractice && c.id !== 'comp-default'
          );
        }
      }
    } catch {}
    return [];
  });

  const [currentCompanyId, setCurrentCompanyId] = useState<string>(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_KEYS.CURRENT_COMPANY_ID);
      if (savedId && savedId !== 'comp-default') return savedId;
      const savedCompanies = localStorage.getItem(STORAGE_KEYS.COMPANIES);
      if (savedCompanies) {
        const parsed = JSON.parse(savedCompanies);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.id) {
          return parsed[0].id;
        }
      }
    } catch {}
    return 'comp-clean-store';
  });

  const currentCompany = useMemo<CompanyProfile>(() => {
    if (workspaceMode === 'PRACTICE') {
      return PRACTICE_COMPANY_PROFILE;
    }
    const found =
      companies.find((c) => c.id === currentCompanyId && !c.isDemoPractice) ||
      companies.find((c) => !c.isDemoPractice);
    if (found) return found;
    return {
      ...DEFAULT_COMPANY_PROFILE,
      id: currentCompanyId || 'comp-clean-store',
      legalName: '',
      displayName: 'New Store (Offline)',
      displayNameAr: 'متجر جديد (أوفلاين)',
      businessType: '',
      address: '',
      phone: '',
      email: '',
      taxNumber: '',
      secondaryCurrencies: [],
      onboardingCompleted: false,
    };
  }, [workspaceMode, companies, currentCompanyId]);

  const initialCompanyData = useMemo(
    () => loadCompanyOperationalState(currentCompanyId, workspaceMode),
    [currentCompanyId, workspaceMode]
  );

  // Atomic Operational Ledger State (Products, Transactions, Customers, StockMovements) via useReducer
  const [ledgerState, dispatchLedger] = useReducer(
    operationalLedgerReducer,
    undefined,
    (): OperationalLedgerState => {
      if (workspaceMode === 'PRACTICE') {
        let pracProducts: Product[] = INITIAL_PRODUCTS.map((p, idx) =>
          enrichProductWithSeedMetadata(p, idx)
        );
        let pracTransactions: Transaction[] = INITIAL_TRANSACTIONS;
        let pracCustomers: Customer[] = INITIAL_CUSTOMERS;
        let pracMovements: StockMovement[] = INITIAL_STOCK_MOVEMENTS;
        try {
          const sp = localStorage.getItem(PRACTICE_STORAGE_KEYS.PRODUCTS);
          if (sp) pracProducts = JSON.parse(sp);
        } catch {}
        try {
          const st = localStorage.getItem(PRACTICE_STORAGE_KEYS.TRANSACTIONS);
          if (st) pracTransactions = JSON.parse(st);
        } catch {}
        try {
          const sc = localStorage.getItem(PRACTICE_STORAGE_KEYS.CUSTOMERS);
          if (sc) pracCustomers = JSON.parse(sc);
        } catch {}
        try {
          const sm = localStorage.getItem(PRACTICE_STORAGE_KEYS.MOVEMENTS);
          if (sm) pracMovements = JSON.parse(sm);
        } catch {}
        return {
          products: pracProducts,
          transactions: pracTransactions,
          customers: pracCustomers,
          stockMovements: pracMovements,
        };
      }
      return {
        products: initialCompanyData.products,
        transactions: initialCompanyData.transactions,
        customers: initialCompanyData.customers,
        stockMovements: initialCompanyData.stockMovements,
      };
    }
  );

  const { products, transactions, customers, stockMovements } = ledgerState;

  const setProducts = useCallback((updater: React.SetStateAction<Product[]>) => {
    dispatchLedger({ type: 'SET_PRODUCTS', updater });
  }, []);

  const setTransactions = useCallback((updater: React.SetStateAction<Transaction[]>) => {
    dispatchLedger({ type: 'SET_TRANSACTIONS', updater });
  }, []);

  const setCustomers = useCallback((updater: React.SetStateAction<Customer[]>) => {
    dispatchLedger({ type: 'SET_CUSTOMERS', updater });
  }, []);

  const setStockMovements = useCallback((updater: React.SetStateAction<StockMovement[]>) => {
    dispatchLedger({ type: 'SET_STOCK_MOVEMENTS', updater });
  }, []);

  const commitCheckoutAtomic = useCallback((payload: AtomicCheckoutCommitPayload) => {
    dispatchLedger({ type: 'COMMIT_CHECKOUT_ATOMIC', payload });
  }, []);

  const voidTransactionAtomic = useCallback((transactionId: string, nowIso?: string) => {
    dispatchLedger({ type: 'VOID_TRANSACTION_ATOMIC', payload: { transactionId, nowIso } });
  }, []);

  const [users, setUsers] = useState<POSUser[]>(() => {
    if (workspaceMode === 'PRACTICE') {
      try {
        const stored = localStorage.getItem(PRACTICE_STORAGE_KEYS.USERS);
        if (stored) return JSON.parse(stored);
      } catch {}
      return INITIAL_USERS;
    }
    return initialCompanyData.users;
  });

  const [activeSessions, setActiveSessions] = useState<ActiveUserSession[]>(() => {
    if (workspaceMode === 'PRACTICE') {
      return INITIAL_ACTIVE_SESSIONS;
    }
    return initialCompanyData.activeSessions;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    if (workspaceMode === 'PRACTICE') return 'user-1';
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      if (saved && !DEMO_SEED_USER_IDS.has(saved)) return saved;
    } catch {}
    return initialCompanyData.users[0]?.id || 'unassigned-operator';
  });

  const currentUser = useMemo<POSUser>(() => {
    const found = users.find((u) => u.id === currentUserId) || users[0];
    if (found) return found;
    if (workspaceMode === 'PRACTICE') return INITIAL_USERS[0];
    const fullCaps = deriveCapabilitiesFromUser({
      role: 'admin',
      systemRole: 'COMPANY_OWNER',
      permissions: { ...DEFAULT_ROLE_PERMISSIONS.admin },
    });
    return {
      id: 'unassigned-operator',
      companyId: currentCompany.id,
      branchId: `branch-${currentCompany.id}-main`,
      assignedBranchIds: [`branch-${currentCompany.id}-main`],
      name: 'No Account Added',
      nameAr: 'لم يتم إضافة حساب',
      username: '',
      role: 'admin',
      systemRole: 'COMPANY_OWNER',
      capabilities: fullCaps,
      pin: '',
      terminalName: 'POS Terminal',
      terminalNameAr: 'نقطة بيع',
      avatarColor: '#f59e0b',
      isActive: true,
      permissions: { ...DEFAULT_ROLE_PERMISSIONS.admin },
      lastActiveAt: new Date().toISOString(),
    };
  }, [users, currentUserId, workspaceMode, currentCompany.id]);

  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    if (workspaceMode === 'PRACTICE') {
      try {
        const stored = localStorage.getItem(PRACTICE_STORAGE_KEYS.EXPENSES);
        if (stored) return JSON.parse(stored);
      } catch {}
      return INITIAL_EXPENSES;
    }
    return initialCompanyData.expenses;
  });

  const [currencies, setCurrencies] = useState<Currency[]>(() => {
    if (workspaceMode === 'PRACTICE') {
      return [...DEFAULT_CURRENCIES_LIST];
    }
    return initialCompanyData.currencies;
  });

  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>(() => {
    if (workspaceMode === 'PRACTICE') {
      return { ...DEFAULT_EXCHANGE_RATES_MAP };
    }
    return initialCompanyData.exchangeRates;
  });

  const [exchangeRateItems, setExchangeRateItems] = useState<ExchangeRateItem[]>(() => {
    if (workspaceMode === 'PRACTICE') {
      return buildPracticeExchangeRateItems();
    }
    return initialCompanyData.exchangeRateItems;
  });

  const [exchangeRateHistory, setExchangeRateHistory] = useState<ExchangeRateHistoryEntry[]>(() => {
    if (workspaceMode === 'PRACTICE') {
      return INITIAL_EXCHANGE_RATE_HISTORY;
    }
    return initialCompanyData.exchangeRateHistory;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    if (workspaceMode === 'PRACTICE') {
      return {
        ...INITIAL_SETTINGS,
        storeName: PRACTICE_COMPANY_PROFILE.displayName,
        storeNameAr: PRACTICE_COMPANY_PROFILE.displayNameAr,
        exchangeRates: { ...DEFAULT_EXCHANGE_RATES_MAP },
      };
    }
    try {
      const stored =
        localStorage.getItem(getCompanyStorageKey(STORAGE_KEYS.SETTINGS, currentCompanyId)) ||
        localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...INITIAL_SETTINGS,
          ...parsed,
          exchangeRates: initialCompanyData.exchangeRates,
        };
      }
    } catch {}
    return {
      ...INITIAL_SETTINGS,
      storeName: currentCompany.displayName || 'متجر جديد',
      storeNameAr: currentCompany.displayNameAr || 'متجر جديد',
      storeAddress: currentCompany.address || '',
      storePhone: currentCompany.phone || '',
      exchangeRates: initialCompanyData.exchangeRates,
    };
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState<AppNavTab>('checkout');
  const [pendingNewProductBarcode, setPendingNewProductBarcode] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [globalDiscountPercent, setGlobalDiscountPercentState] = useState<number>(0);
  const [globalDiscountAmount, setGlobalDiscountAmountState] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const [unmetDemandRequests, setUnmetDemandRequests] = useState<UnmetDemandRequestRecord[]>(() => {
    if (workspaceMode === 'PRACTICE') {
      try {
        const stored = localStorage.getItem(PRACTICE_STORAGE_KEYS.UNMET_DEMAND_REQUESTS);
        if (stored) return JSON.parse(stored);
      } catch {}
      return INITIAL_UNMET_DEMAND_REQUESTS as UnmetDemandRequestRecord[];
    }
    return initialCompanyData.unmetDemandRequests;
  });

  const [allBranches, setAllBranches] = useState<BranchRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BRANCHES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [];
  });

  const branches = useMemo<BranchRecord[]>(() => {
    const targetCompanyId =
      workspaceMode === 'PRACTICE' ? 'comp-demo-practice' : currentCompany.id;
    const filtered = allBranches.filter(
      (b) => (b.companyId || 'comp-default') === targetCompanyId
    );
    if (filtered.length > 0) return filtered;
    if (workspaceMode === 'PRACTICE') {
      return [
        {
          id: 'branch-practice-main',
          companyId: 'comp-demo-practice',
          code: 'PRAC-01',
          name: 'Practice Main Showroom',
          nameAr: 'صالة العرض التجريبية الرئيسية',
          city: 'Khartoum',
          isMainBranch: true,
          isActive: true,
        },
        {
          id: 'branch-practice-2',
          companyId: 'comp-demo-practice',
          code: 'PRAC-02',
          name: 'Practice North Branch',
          nameAr: 'فرع التدريب الشمالي',
          city: 'Bahri',
          isMainBranch: false,
          isActive: true,
        },
      ];
    }
    return [
      {
        id: `branch-${currentCompany.id}-main`,
        companyId: currentCompany.id,
        code: 'MAIN-01',
        name: currentCompany.displayName || 'Main Branch',
        nameAr: currentCompany.displayNameAr || 'الفرع الرئيسي',
        city: currentCompany.city || '',
        isMainBranch: true,
        isActive: true,
      },
    ];
  }, [allBranches, workspaceMode, currentCompany]);

  const [activeBranchId, setActiveBranchIdState] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_BRANCH_ID) || 'branch-main';
    } catch {
      return 'branch-main';
    }
  });

  const setActiveBranchId = useCallback((branchId: string) => {
    setActiveBranchIdState(branchId);
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_BRANCH_ID, branchId);
    } catch {}
  }, []);

  const openAddProductWithBarcode = useCallback((code: string) => {
    const clean = String(code ?? '').trim();
    if (!clean) return;
    setPendingNewProductBarcode(clean);
    setActiveTab('products');
  }, []);

  const setGlobalDiscountPercent = useCallback((discount: number) => {
    const safePercent = Math.max(0, Math.min(100, Number(discount) || 0));
    setGlobalDiscountPercentState(safePercent);
    setGlobalDiscountAmountState(0);
  }, []);

  const setGlobalDiscountAmount = useCallback((amount: number) => {
    const safeAmount = Math.max(0, Number(amount) || 0);
    setGlobalDiscountAmountState(safeAmount);
    if (safeAmount > 0) {
      setGlobalDiscountPercentState(0);
    }
  }, []);

  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(new Date());

  // Offline-first startup: only load Practice Mode demo state when in PRACTICE mode.
  useEffect(() => {
    if (workspaceMode === 'PRACTICE') {
      fetch('/api/onboarding/practice/state')
        .then((res) => (res.ok ? res.json() : null))
        .then((payload) => {
          const prac = payload?.data;
          if (!prac) return;
          if (Array.isArray(prac.products) && prac.products.length > 0) setProducts(prac.products);
          if (Array.isArray(prac.transactions)) setTransactions(prac.transactions);
          if (Array.isArray(prac.customers)) setCustomers(prac.customers);
          if (Array.isArray(prac.stockMovements)) setStockMovements(prac.stockMovements);
          if (Array.isArray(prac.users) && prac.users.length > 0) {
            setUsers(prac.users);
            setCurrentUserId(prac.users[0].id);
          }
          if (Array.isArray(prac.unmetDemandRequests)) {
            setUnmetDemandRequests(prac.unmetDemandRequests);
          }
        })
        .catch(() => {});
    }
  }, []);

  // Unified localStorage & SQLite persistence via usePersistCompanyScopedSlice / usePersistStorageValue
  usePersistCompanyScopedSlice({
    value: products,
    workspaceMode,
    currentCompanyId,
    prodBaseKey: STORAGE_KEYS.PRODUCTS,
    practiceKey: PRACTICE_STORAGE_KEYS.PRODUCTS,
  });

  usePersistCompanyScopedSlice({
    value: users,
    workspaceMode,
    currentCompanyId,
    prodBaseKey: STORAGE_KEYS.USERS,
    practiceKey: PRACTICE_STORAGE_KEYS.USERS,
  });

  usePersistCompanyScopedSlice({
    value: activeSessions,
    workspaceMode,
    currentCompanyId,
    prodBaseKey: STORAGE_KEYS.ACTIVE_SESSIONS,
  });

  usePersistStorageValue(STORAGE_KEYS.CURRENT_USER_ID, currentUserId, {
    rawString: true,
    enabled: workspaceMode === 'PRODUCTION',
  });

  usePersistStorageValue(STORAGE_KEYS.WORKSPACE_MODE, workspaceMode, {
    rawString: true,
  });

  const lastLoadedCompanyIdRef = useRef<string>(currentCompanyId);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_COMPANY_ID, currentCompanyId);
    } catch {}
    if (workspaceMode === 'PRODUCTION' && lastLoadedCompanyIdRef.current !== currentCompanyId) {
      lastLoadedCompanyIdRef.current = currentCompanyId;
      setProducts(initialCompanyData.products);
      setTransactions(initialCompanyData.transactions);
      setExpenses(initialCompanyData.expenses);
      setCustomers(initialCompanyData.customers);
      setStockMovements(initialCompanyData.stockMovements);
      setUnmetDemandRequests(initialCompanyData.unmetDemandRequests);
      setCurrencies(initialCompanyData.currencies);
      setExchangeRates(initialCompanyData.exchangeRates);
      setExchangeRateItems(initialCompanyData.exchangeRateItems);
      setExchangeRateHistory(initialCompanyData.exchangeRateHistory);
      setUsers(initialCompanyData.users);
      setActiveSessions(initialCompanyData.activeSessions);
    }
  }, [currentCompanyId, workspaceMode, initialCompanyData, setProducts, setTransactions, setCustomers, setStockMovements]);

  usePersistStorageValue(STORAGE_KEYS.COMPANIES, companies);
  usePersistStorageValue(STORAGE_KEYS.BRANCHES, allBranches);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleStorageSync = (e: StorageEvent) => {
      applyCrossTabStorageEvent(e, workspaceMode, currentCompanyId, {
        setProducts,
        setTransactions,
        setCustomers,
        setExpenses,
        setStockMovements,
        setUsers,
        setActiveSessions,
        setUnmetDemandRequests,
      });
    };
    window.addEventListener('storage', handleStorageSync);
    return () => window.removeEventListener('storage', handleStorageSync);
  }, [
    workspaceMode,
    currentCompanyId,
    setProducts,
    setTransactions,
    setCustomers,
    setStockMovements,
  ]);

  usePersistCompanyScopedSlice({
    value: unmetDemandRequests,
    workspaceMode,
    currentCompanyId,
    prodBaseKey: STORAGE_KEYS.UNMET_DEMAND_REQUESTS,
    practiceKey: PRACTICE_STORAGE_KEYS.UNMET_DEMAND_REQUESTS,
  });

  const sqliteCompanyScope =
    workspaceMode === 'PRACTICE' ? PRACTICE_COMPANY_PROFILE.id : currentCompanyId;

  const [sqliteDiagnostics, setSqliteDiagnostics] = useState<OfflineSqliteDiagnostics>(() =>
    offlineSqliteStorage.getDiagnostics(sqliteCompanyScope)
  );

  useEffect(() => {
    let active = true;
    offlineSqliteStorage
      .loadTransactions(sqliteCompanyScope)
      .then((sqliteTxs) => {
        if (!active || !Array.isArray(sqliteTxs) || sqliteTxs.length === 0) {
          if (active) {
            setSqliteDiagnostics(offlineSqliteStorage.getDiagnostics(sqliteCompanyScope));
          }
          return;
        }
        setTransactions((prev) => {
          const map = new Map<string, Transaction>();
          for (const t of sqliteTxs) {
            if (t?.id) map.set(t.id, t);
          }
          for (const t of prev) {
            if (t?.id) map.set(t.id, t);
          }
          return Array.from(map.values()).sort(
            (a, b) => (Date.parse(b.timestamp || '') || 0) - (Date.parse(a.timestamp || '') || 0)
          );
        });
        setSqliteDiagnostics(offlineSqliteStorage.getDiagnostics(sqliteCompanyScope));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [sqliteCompanyScope]);

  usePersistCompanyScopedSlice({
    value: transactions,
    workspaceMode,
    currentCompanyId,
    prodBaseKey: STORAGE_KEYS.TRANSACTIONS,
    practiceKey: PRACTICE_STORAGE_KEYS.TRANSACTIONS,
    onAfterPersist: (txs) => {
      offlineSqliteStorage
        .persistTransactions(sqliteCompanyScope, txs)
        .then(() => {
          setSqliteDiagnostics(offlineSqliteStorage.getDiagnostics(sqliteCompanyScope));
        })
        .catch(() => {});
    },
  });

  usePersistCompanyScopedSlice({
    value: expenses,
    workspaceMode,
    currentCompanyId,
    prodBaseKey: STORAGE_KEYS.EXPENSES,
    practiceKey: PRACTICE_STORAGE_KEYS.EXPENSES,
    onAfterPersist: (exps) => {
      offlineSqliteStorage
        .persistWorkspaceSnapshot(sqliteCompanyScope, 'expenses', exps)
        .catch(() => {});
    },
  });

  usePersistCompanyScopedSlice({
    value: customers,
    workspaceMode,
    currentCompanyId,
    prodBaseKey: STORAGE_KEYS.CUSTOMERS,
    practiceKey: PRACTICE_STORAGE_KEYS.CUSTOMERS,
    onAfterPersist: (custs) => {
      offlineSqliteStorage
        .persistWorkspaceSnapshot(sqliteCompanyScope, 'customers', custs)
        .catch(() => {});
    },
  });

  usePersistCompanyScopedSlice({
    value: stockMovements,
    workspaceMode,
    currentCompanyId,
    prodBaseKey: STORAGE_KEYS.MOVEMENTS,
    practiceKey: PRACTICE_STORAGE_KEYS.MOVEMENTS,
    onAfterPersist: (movs) => {
      offlineSqliteStorage
        .persistWorkspaceSnapshot(sqliteCompanyScope, 'stockMovements', movs)
        .catch(() => {});
    },
  });

  usePersistCompanyScopedSlice({
    value: currencies,
    workspaceMode,
    currentCompanyId,
    prodBaseKey: STORAGE_KEYS.CURRENCIES,
    mirrorGlobalProdKey: false,
    onAfterPersist: (curs) => {
      if (workspaceMode === 'PRODUCTION') {
        savePersistedCurrencies(curs);
      }
    },
  });

  usePersistCompanyScopedSlice({
    value: exchangeRates,
    workspaceMode,
    currentCompanyId,
    prodBaseKey: STORAGE_KEYS.EXCHANGE_RATES,
    mirrorGlobalProdKey: false,
    onAfterPersist: (rates) => {
      if (workspaceMode === 'PRODUCTION') {
        savePersistedExchangeRates(rates);
      }
    },
  });

  usePersistCompanyScopedSlice({
    value: exchangeRateItems,
    workspaceMode,
    currentCompanyId,
    prodBaseKey: STORAGE_KEYS.EXCHANGE_RATE_ITEMS,
    mirrorGlobalProdKey: false,
    onAfterPersist: (items) => {
      if (workspaceMode === 'PRODUCTION') {
        savePersistedExchangeRateItems(items);
      }
    },
  });

  usePersistCompanyScopedSlice({
    value: exchangeRateHistory,
    workspaceMode,
    currentCompanyId,
    prodBaseKey: STORAGE_KEYS.RATE_HISTORY,
  });

  usePersistCompanyScopedSlice({
    value: settings,
    workspaceMode,
    currentCompanyId,
    prodBaseKey: STORAGE_KEYS.SETTINGS,
    practiceKey: PRACTICE_STORAGE_KEYS.SETTINGS,
    onAfterPersist: (nextSettings) => {
      if (typeof document !== 'undefined') {
        document.documentElement.dir = nextSettings.language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = nextSettings.language;
        if (nextSettings.theme === 'light') {
          document.documentElement.classList.remove('dark');
        } else {
          document.documentElement.classList.add('dark');
        }
      }
    },
  });

  // ============================================================================
  // Modular Domain Hooks Composition
  // ============================================================================
  const {
    deletedProductIdsRef,
    deletedCustomerIdsRef,
    cartTotals,
    addToCart,
    updateCartQuantity,
    setCartItemSaleUnit,
    setCartItemDiscount,
    removeFromCart,
    clearCart,
    processCheckout,
    settleTransactionDebt,
    updateTransactionFulfillment,
    applyNewRateToTransaction,
    lockTransactionSaleRate,
    applyNewRateToAllTransactions,
    voidTransaction,
    addProduct,
    updateProduct,
    deleteProduct,
    recordStockAdjustment,
    recordGoodsReceipt,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addExpense,
    updateExpense,
    voidExpense,
    deleteExpense,
  } = useCatalogAndCartDomain({
    products,
    setProducts,
    cart,
    setCart,
    transactions,
    setTransactions,
    setExpenses,
    setCustomers,
    setStockMovements,
    selectedCustomer,
    setSelectedCustomer,
    globalDiscountPercent,
    setGlobalDiscountPercentState,
    globalDiscountAmount,
    setGlobalDiscountAmountState,
    settings,
    exchangeRates,
    currentUser,
    currentCompany,
    activeBranchId,
    commitCheckoutAtomic,
    voidTransactionAtomic,
  });

  const {
    updateSettings,
    syncCurrenciesState,
    saveCurrency,
    removeCurrency,
    clearAllCurrencies,
    setBaseCurrencyCode,
    syncExchangeRatesState,
    updateExchangeRate,
  } = useCurrenciesAndSettingsDomain({
    settings,
    setSettings,
    currencies,
    setCurrencies,
    setExchangeRates,
    setExchangeRateItems,
    setExchangeRateHistory,
    workspaceMode,
    currentCompany,
    currentCompanyId,
    currentUser,
  });

  const {
    isOnboardingModalOpen,
    setIsOnboardingModalOpen,
    onboardingModalInitialView,
    openOnboardingModal,
    closeOnboardingModal,
    enterPracticeMode,
    exitPracticeMode,
    resetPracticeModeData,
    resetAllData,
    executeAuthorizedFactoryReset,
    createNewCompanyWorkspace,
    switchCompanyWorkspace,
    createBranch,
    updateBranch,
    deleteBranch,
    syncTransactions,
  } = useWorkspaceCompanyDomain({
    workspaceMode,
    setWorkspaceMode,
    companies,
    setCompanies,
    currentCompanyId,
    setCurrentCompanyId,
    currentCompany,
    allBranches,
    setAllBranches,
    branches,
    setActiveBranchId,
    products,
    setProducts,
    transactions,
    setTransactions,
    expenses,
    setExpenses,
    customers,
    setCustomers,
    stockMovements,
    setStockMovements,
    users,
    setUsers,
    activeSessions,
    setActiveSessions,
    currentUserId,
    setCurrentUserId,
    currentUser,
    settings,
    setSettings,
    currencies,
    setCurrencies,
    exchangeRates,
    setExchangeRates,
    exchangeRateItems,
    setExchangeRateItems,
    exchangeRateHistory,
    setExchangeRateHistory,
    unmetDemandRequests,
    setUnmetDemandRequests,
    setCart,
    setSelectedCustomer,
    setGlobalDiscountPercent,
    setGlobalDiscountPercentState,
    setGlobalDiscountAmountState,
    sqliteCompanyScope,
    setSqliteDiagnostics,
    setIsSyncing,
    setLastSyncedAt,
  });

  const {
    switchCurrentUser,
    saveUser,
    deactivateUserAccount,
    reactivateUserAccount,
    resetUserPasswordOrPin,
    deleteUserAccount,
    clearAllUserAccounts,
    removeUser,
    toggleUserActiveSession,
    hasPermission,
    hasCapability,
  } = useUserAccountsDomain({
    users,
    setUsers,
    setActiveSessions,
    currentUserId,
    setCurrentUserId,
    currentUser,
    currentCompany,
    currentCompanyId,
    activeBranchId,
    workspaceMode,
    settings,
  });

  const {
    onboardingChecklist,
    isTrainingTourOpen,
    trainingTourStepIndex,
    trainingTourProgress,
    startTrainingTour,
    closeTrainingTour,
    nextTrainingTourStep,
    prevTrainingTourStep,
    selectTrainingTourStep,
    finishTrainingTour,
    resetTrainingTour,
    isUnmetDemandModalOpen,
    unmetDemandModalInitialData,
    openUnmetDemandModal,
    closeUnmetDemandModal,
    recordUnmetDemandRequest,
  } = useTrainingAndDemandDomain({
    currentUser,
    currentCompany,
    exchangeRates,
    branches,
    products,
    users,
    transactions,
    stockMovements,
    settings,
    workspaceMode,
    setActiveTab,
    unmetDemandRequests,
    setUnmetDemandRequests,
  });

  const { collectClientBackupDataset, hydrateCompanyFromBackupPayload } =
    useBackupHydrationDomain({
      currentCompany,
      currentCompanyId,
      setCurrentCompanyId,
      setCompanies,
      setWorkspaceMode,
      branches,
      setAllBranches,
      activeBranchId,
      setActiveBranchId,
      settings,
      setSettings,
      currencies,
      setCurrencies,
      exchangeRates,
      setExchangeRates,
      exchangeRateItems,
      setExchangeRateItems,
      exchangeRateHistory,
      setExchangeRateHistory,
      users,
      setUsers,
      currentUser,
      setCurrentUserId,
      products,
      setProducts,
      customers,
      setCustomers,
      stockMovements,
      setStockMovements,
      transactions,
      setTransactions,
      expenses,
      setExpenses,
      unmetDemandRequests,
      setUnmetDemandRequests,
      setCart,
      setSelectedCustomer,
      setIsOnboardingModalOpen,
    });

  const {
    lanSyncConfig,
    updateLanSyncConfig,
    lanConnectionStatus,
    lanConnectedDevices,
    lanRecentEvents,
    lanNetworkAddresses,
    lanPrimaryHostUrl,
    lanLastSyncError,
    pushLiveLanSyncNow,
    applyIncomingLanSyncState,
  } = useLanSyncDomain({
    currentCompany,
    settings,
    setSettings,
    products,
    setProducts,
    deletedProductIdsRef,
    transactions,
    setTransactions,
    expenses,
    setExpenses,
    customers,
    setCustomers,
    deletedCustomerIdsRef,
    stockMovements,
    setStockMovements,
    unmetDemandRequests,
    setUnmetDemandRequests,
    currencies,
    setCurrencies,
    exchangeRates,
    setExchangeRates,
    exchangeRateItems,
    setExchangeRateItems,
    exchangeRateHistory,
    branches,
    users,
    activeSessions,
    setLastSyncedAt,
  });

  // ============================================================================
  // Independent Memoized Domain Context Values (Anti-God-Context Architecture)
  // ============================================================================
  const settingsContextValue = useMemo<SettingsContextType>(
    () => ({
      settings,
      currencies,
      exchangeRates,
      exchangeRateItems,
      exchangeRateHistory,
      updateSettings,
      saveCurrency,
      removeCurrency,
      clearAllCurrencies,
      setBaseCurrencyCode,
      syncCurrenciesState,
      updateExchangeRate,
      syncExchangeRatesState,
    }),
    [
      settings,
      currencies,
      exchangeRates,
      exchangeRateItems,
      exchangeRateHistory,
      updateSettings,
      saveCurrency,
      removeCurrency,
      clearAllCurrencies,
      setBaseCurrencyCode,
      syncCurrenciesState,
      updateExchangeRate,
      syncExchangeRatesState,
    ]
  );

  const userContextValue = useMemo<UserContextType>(
    () => ({
      users,
      activeSessions,
      currentUser,
      switchCurrentUser,
      saveUser,
      removeUser,
      deleteUserAccount,
      clearAllUserAccounts,
      deactivateUserAccount,
      reactivateUserAccount,
      resetUserPasswordOrPin,
      toggleUserActiveSession,
      hasPermission,
      hasCapability,
    }),
    [
      users,
      activeSessions,
      currentUser,
      switchCurrentUser,
      saveUser,
      removeUser,
      deleteUserAccount,
      clearAllUserAccounts,
      deactivateUserAccount,
      reactivateUserAccount,
      resetUserPasswordOrPin,
      toggleUserActiveSession,
      hasPermission,
      hasCapability,
    ]
  );

  const productContextValue = useMemo<ProductContextType>(
    () => ({
      products,
      stockMovements,
      addProduct,
      updateProduct,
      deleteProduct,
      pendingNewProductBarcode,
      setPendingNewProductBarcode,
      openAddProductWithBarcode,
      recordStockAdjustment,
      recordGoodsReceipt,
    }),
    [
      products,
      stockMovements,
      addProduct,
      updateProduct,
      deleteProduct,
      pendingNewProductBarcode,
      openAddProductWithBarcode,
      recordStockAdjustment,
      recordGoodsReceipt,
    ]
  );

  const cartContextValue = useMemo<CartContextType>(
    () => ({
      cart,
      cartTotals,
      selectedCustomer,
      setSelectedCustomer,
      globalDiscountPercent,
      setGlobalDiscountPercent,
      globalDiscountAmount,
      setGlobalDiscountAmount,
      addToCart,
      updateCartQuantity,
      setCartItemSaleUnit,
      setCartItemDiscount,
      removeFromCart,
      clearCart,
      processCheckout,
    }),
    [
      cart,
      cartTotals,
      selectedCustomer,
      globalDiscountPercent,
      setGlobalDiscountPercent,
      globalDiscountAmount,
      setGlobalDiscountAmount,
      addToCart,
      updateCartQuantity,
      setCartItemSaleUnit,
      setCartItemDiscount,
      removeFromCart,
      clearCart,
      processCheckout,
    ]
  );

  const expenseContextValue = useMemo<ExpenseContextType>(
    () => ({
      expenses,
      addExpense,
      updateExpense,
      voidExpense,
      deleteExpense,
    }),
    [expenses, addExpense, updateExpense, voidExpense, deleteExpense]
  );

  const posContextValue = useMemo<POSContextType>(
    () => ({
      products,
      cart,
      transactions,
      expenses,
      customers,
      stockMovements,
      settings,
      currencies,
      exchangeRates,
      exchangeRateItems,
      exchangeRateHistory,
      activeTab,
      setActiveTab,
      selectedCustomer,
      setSelectedCustomer,
      globalDiscountPercent,
      setGlobalDiscountPercent,
      globalDiscountAmount,
      setGlobalDiscountAmount,
      cartTotals,
      workspaceMode,
      currentCompany,
      companies,
      branches,
      activeBranchId,
      setActiveBranchId,
      enterPracticeMode,
      exitPracticeMode,
      resetPracticeModeData,
      createNewCompanyWorkspace,
      switchCompanyWorkspace,
      isOnboardingModalOpen,
      onboardingModalInitialView,
      openOnboardingModal,
      closeOnboardingModal,
      createBranch,
      updateBranch,
      deleteBranch,
      onboardingChecklist,
      users,
      activeSessions,
      currentUser,
      switchCurrentUser,
      saveUser,
      removeUser,
      deleteUserAccount,
      clearAllUserAccounts,
      deactivateUserAccount,
      reactivateUserAccount,
      resetUserPasswordOrPin,
      toggleUserActiveSession,
      hasPermission,
      hasCapability,
      addToCart,
      setCartItemSaleUnit,
      updateCartQuantity,
      setCartItemDiscount,
      removeFromCart,
      clearCart,
      processCheckout,
      addProduct,
      updateProduct,
      deleteProduct,
      pendingNewProductBarcode,
      setPendingNewProductBarcode,
      openAddProductWithBarcode,
      recordStockAdjustment,
      recordGoodsReceipt,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addExpense,
      updateExpense,
      voidExpense,
      deleteExpense,
      voidTransaction,
      settleTransactionDebt,
      updateTransactionFulfillment,
      applyNewRateToTransaction,
      applyNewRateToAllTransactions,
      lockTransactionSaleRate,
      updateSettings,
      saveCurrency,
      removeCurrency,
      clearAllCurrencies,
      setBaseCurrencyCode,
      syncCurrenciesState,
      updateExchangeRate,
      syncExchangeRatesState,
      resetAllData,
      executeAuthorizedFactoryReset,
      collectClientBackupDataset,
      hydrateCompanyFromBackupPayload,
      syncTransactions,
      isSyncing,
      lastSyncedAt,
      sqliteDiagnostics,
      isTrainingTourOpen,
      trainingTourStepIndex,
      trainingTourProgress,
      startTrainingTour,
      closeTrainingTour,
      nextTrainingTourStep,
      prevTrainingTourStep,
      selectTrainingTourStep,
      finishTrainingTour,
      resetTrainingTour,
      unmetDemandRequests,
      recordUnmetDemandRequest,
      isUnmetDemandModalOpen,
      unmetDemandModalInitialData,
      openUnmetDemandModal,
      closeUnmetDemandModal,
      lanSyncConfig,
      updateLanSyncConfig,
      lanConnectionStatus,
      lanConnectedDevices,
      lanRecentEvents,
      lanNetworkAddresses,
      lanPrimaryHostUrl,
      lanLastSyncError,
      pushLiveLanSyncNow,
      applyIncomingLanSyncState,
    }),
    [
      products,
      cart,
      transactions,
      expenses,
      customers,
      stockMovements,
      settings,
      currencies,
      exchangeRates,
      exchangeRateItems,
      exchangeRateHistory,
      activeTab,
      selectedCustomer,
      globalDiscountPercent,
      setGlobalDiscountPercent,
      globalDiscountAmount,
      setGlobalDiscountAmount,
      cartTotals,
      workspaceMode,
      currentCompany,
      companies,
      branches,
      activeBranchId,
      setActiveBranchId,
      enterPracticeMode,
      exitPracticeMode,
      resetPracticeModeData,
      createNewCompanyWorkspace,
      switchCompanyWorkspace,
      isOnboardingModalOpen,
      onboardingModalInitialView,
      openOnboardingModal,
      closeOnboardingModal,
      createBranch,
      updateBranch,
      deleteBranch,
      onboardingChecklist,
      users,
      activeSessions,
      currentUser,
      switchCurrentUser,
      saveUser,
      removeUser,
      deleteUserAccount,
      clearAllUserAccounts,
      deactivateUserAccount,
      reactivateUserAccount,
      resetUserPasswordOrPin,
      toggleUserActiveSession,
      hasPermission,
      hasCapability,
      addToCart,
      setCartItemSaleUnit,
      updateCartQuantity,
      setCartItemDiscount,
      removeFromCart,
      clearCart,
      processCheckout,
      addProduct,
      updateProduct,
      deleteProduct,
      pendingNewProductBarcode,
      openAddProductWithBarcode,
      recordStockAdjustment,
      recordGoodsReceipt,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addExpense,
      updateExpense,
      voidExpense,
      deleteExpense,
      voidTransaction,
      settleTransactionDebt,
      updateTransactionFulfillment,
      applyNewRateToTransaction,
      applyNewRateToAllTransactions,
      lockTransactionSaleRate,
      updateSettings,
      saveCurrency,
      removeCurrency,
      clearAllCurrencies,
      setBaseCurrencyCode,
      syncCurrenciesState,
      updateExchangeRate,
      syncExchangeRatesState,
      resetAllData,
      executeAuthorizedFactoryReset,
      collectClientBackupDataset,
      hydrateCompanyFromBackupPayload,
      syncTransactions,
      isSyncing,
      lastSyncedAt,
      sqliteDiagnostics,
      isTrainingTourOpen,
      trainingTourStepIndex,
      trainingTourProgress,
      startTrainingTour,
      closeTrainingTour,
      nextTrainingTourStep,
      prevTrainingTourStep,
      selectTrainingTourStep,
      finishTrainingTour,
      resetTrainingTour,
      unmetDemandRequests,
      recordUnmetDemandRequest,
      isUnmetDemandModalOpen,
      unmetDemandModalInitialData,
      openUnmetDemandModal,
      closeUnmetDemandModal,
      lanSyncConfig,
      updateLanSyncConfig,
      lanConnectionStatus,
      lanConnectedDevices,
      lanRecentEvents,
      lanNetworkAddresses,
      lanPrimaryHostUrl,
      lanLastSyncError,
      pushLiveLanSyncNow,
      applyIncomingLanSyncState,
    ]
  );

  return (
    <SettingsContext.Provider value={settingsContextValue}>
      <UserContext.Provider value={userContextValue}>
        <ProductContext.Provider value={productContextValue}>
          <CartContext.Provider value={cartContextValue}>
            <ExpenseContext.Provider value={expenseContextValue}>
              <POSContext.Provider value={posContextValue}>
                {children}
              </POSContext.Provider>
            </ExpenseContext.Provider>
          </CartContext.Provider>
        </ProductContext.Provider>
      </UserContext.Provider>
    </SettingsContext.Provider>
  );
};

export function usePOS(): POSContextType {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
}
