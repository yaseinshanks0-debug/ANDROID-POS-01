/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import {
  ActiveUserSession,
  AppSettings,
  BranchRecord,
  CartItem,
  CompanyProfile,
  Currency,
  Customer,
  ExchangeRateHistoryEntry,
  ExchangeRateItem,
  ExpenseRecord,
  POSUser,
  Product,
  StockMovement,
  Transaction,
  WorkspaceMode,
} from '../../lib/types';
import { UnmetDemandRequestRecord } from '../../analytics/analytics.types';
import {
  DEFAULT_ROLE_PERMISSIONS,
  INITIAL_ACTIVE_SESSIONS,
  INITIAL_CUSTOMERS,
  INITIAL_EXCHANGE_RATE_HISTORY,
  INITIAL_EXPENSES,
  INITIAL_PRODUCTS,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_TRANSACTIONS,
  INITIAL_UNMET_DEMAND_REQUESTS,
  INITIAL_USERS,
} from '../../lib/initial-data';
import {
  DEFAULT_CURRENCIES_LIST,
  DEFAULT_EXCHANGE_RATES_MAP,
} from '../../lib/exchange-rate-storage';
import {
  deriveCapabilitiesFromUser,
  deriveLegacyPermissionsFromCapabilities,
} from '../../lib/rbac-capabilities';
import {
  offlineSqliteStorage,
  OfflineSqliteDiagnostics,
} from '../../lib/offline-sqlite-storage';
import { playSuccessChime, triggerHaptic } from '../../lib/sound-fx';
import {
  PRACTICE_COMPANY_PROFILE,
  PRACTICE_STORAGE_KEYS,
  ProductionSnapshot,
  STORAGE_KEYS,
  buildPracticeExchangeRateItems,
  enrichProductWithSeedMetadata,
  getCompanyStorageKey,
  loadCompanyOperationalState,
} from '../pos-storage-helpers';

export type OnboardingModalView =
  | 'hub'
  | 'create-company'
  | 'restore-backup'
  | 'practice'
  | 'switch-company';

interface UseWorkspaceCompanyDomainParams {
  workspaceMode: WorkspaceMode;
  setWorkspaceMode: React.Dispatch<React.SetStateAction<WorkspaceMode>>;
  companies: CompanyProfile[];
  setCompanies: React.Dispatch<React.SetStateAction<CompanyProfile[]>>;
  currentCompanyId: string;
  setCurrentCompanyId: React.Dispatch<React.SetStateAction<string>>;
  currentCompany: CompanyProfile;
  allBranches: BranchRecord[];
  setAllBranches: React.Dispatch<React.SetStateAction<BranchRecord[]>>;
  branches: BranchRecord[];
  setActiveBranchId: (branchId: string) => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  expenses: ExpenseRecord[];
  setExpenses: React.Dispatch<React.SetStateAction<ExpenseRecord[]>>;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  stockMovements: StockMovement[];
  setStockMovements: React.Dispatch<React.SetStateAction<StockMovement[]>>;
  users: POSUser[];
  setUsers: React.Dispatch<React.SetStateAction<POSUser[]>>;
  activeSessions: ActiveUserSession[];
  setActiveSessions: React.Dispatch<React.SetStateAction<ActiveUserSession[]>>;
  currentUserId: string;
  setCurrentUserId: React.Dispatch<React.SetStateAction<string>>;
  currentUser: POSUser;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  currencies: Currency[];
  setCurrencies: React.Dispatch<React.SetStateAction<Currency[]>>;
  exchangeRates: Record<string, number>;
  setExchangeRates: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  exchangeRateItems: ExchangeRateItem[];
  setExchangeRateItems: React.Dispatch<React.SetStateAction<ExchangeRateItem[]>>;
  exchangeRateHistory: ExchangeRateHistoryEntry[];
  setExchangeRateHistory: React.Dispatch<React.SetStateAction<ExchangeRateHistoryEntry[]>>;
  unmetDemandRequests: UnmetDemandRequestRecord[];
  setUnmetDemandRequests: React.Dispatch<React.SetStateAction<UnmetDemandRequestRecord[]>>;
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  setSelectedCustomer: React.Dispatch<React.SetStateAction<Customer | null>>;
  setGlobalDiscountPercent: (discount: number) => void;
  setGlobalDiscountPercentState: React.Dispatch<React.SetStateAction<number>>;
  setGlobalDiscountAmountState: React.Dispatch<React.SetStateAction<number>>;
  sqliteCompanyScope: string;
  setSqliteDiagnostics: React.Dispatch<React.SetStateAction<OfflineSqliteDiagnostics>>;
  setIsSyncing: React.Dispatch<React.SetStateAction<boolean>>;
  setLastSyncedAt: React.Dispatch<React.SetStateAction<Date | null>>;
}

export function useWorkspaceCompanyDomain({
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
}: UseWorkspaceCompanyDomainParams) {
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [onboardingModalInitialView, setOnboardingModalInitialView] =
    useState<OnboardingModalView>('hub');

  const openOnboardingModal = useCallback((view: OnboardingModalView = 'hub') => {
    setOnboardingModalInitialView(view);
    setIsOnboardingModalOpen(true);
  }, []);

  const closeOnboardingModal = useCallback(() => {
    setIsOnboardingModalOpen(false);
  }, []);

  const [productionSnapshot, setProductionSnapshot] = useState<ProductionSnapshot | null>(null);

  const enterPracticeMode = useCallback(async () => {
    if (workspaceMode !== 'PRACTICE') {
      setProductionSnapshot({
        products,
        transactions,
        expenses,
        customers,
        stockMovements,
        users,
        settings,
        currencies,
        exchangeRates,
        exchangeRateItems,
        exchangeRateHistory,
        unmetDemandRequests,
        currentUserId,
      });
    }

    setWorkspaceMode('PRACTICE');
    setCart([]);
    setSelectedCustomer(null);
    setGlobalDiscountPercentState(0);
    setGlobalDiscountAmountState(0);

    setCurrencies([...DEFAULT_CURRENCIES_LIST]);
    setExchangeRates({ ...DEFAULT_EXCHANGE_RATES_MAP });
    setExchangeRateItems(buildPracticeExchangeRateItems());
    setExchangeRateHistory(INITIAL_EXCHANGE_RATE_HISTORY);
    setSettings((prev) => ({
      ...prev,
      storeName: PRACTICE_COMPANY_PROFILE.displayName,
      storeNameAr: PRACTICE_COMPANY_PROFILE.displayNameAr || PRACTICE_COMPANY_PROFILE.displayName,
      exchangeRates: { ...DEFAULT_EXCHANGE_RATES_MAP },
    }));

    setProducts(INITIAL_PRODUCTS.map((p, idx) => enrichProductWithSeedMetadata(p, idx)));
    setTransactions(INITIAL_TRANSACTIONS);
    setExpenses(INITIAL_EXPENSES);
    setCustomers(INITIAL_CUSTOMERS);
    setStockMovements(INITIAL_STOCK_MOVEMENTS);
    setUnmetDemandRequests(INITIAL_UNMET_DEMAND_REQUESTS as UnmetDemandRequestRecord[]);
    setUsers(INITIAL_USERS);
    setActiveSessions(INITIAL_ACTIVE_SESSIONS);
    setCurrentUserId('user-1');

    try {
      const res = await fetch('/api/onboarding/practice/state');
      if (res.ok) {
        const payload = await res.json();
        const prac = payload?.data;
        if (prac) {
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
        }
      }
    } catch {
      // Offline mode: local seed data is already active
    }

    setActiveBranchId('branch-practice-main');
    setIsOnboardingModalOpen(false);
    playSuccessChime(settings.soundEnabled);
    triggerHaptic('success', settings.hapticsEnabled);
  }, [
    workspaceMode,
    products,
    transactions,
    expenses,
    customers,
    stockMovements,
    users,
    settings,
    currencies,
    exchangeRates,
    exchangeRateItems,
    exchangeRateHistory,
    unmetDemandRequests,
    currentUserId,
    setActiveBranchId,
    setWorkspaceMode,
    setCart,
    setSelectedCustomer,
    setGlobalDiscountPercentState,
    setGlobalDiscountAmountState,
    setCurrencies,
    setExchangeRates,
    setExchangeRateItems,
    setExchangeRateHistory,
    setSettings,
    setProducts,
    setTransactions,
    setExpenses,
    setCustomers,
    setStockMovements,
    setUnmetDemandRequests,
    setUsers,
    setActiveSessions,
    setCurrentUserId,
  ]);

  const exitPracticeMode = useCallback(async () => {
    setWorkspaceMode('PRODUCTION');
    setCart([]);
    setSelectedCustomer(null);
    setGlobalDiscountPercentState(0);
    setGlobalDiscountAmountState(0);

    if (productionSnapshot) {
      setProducts(productionSnapshot.products);
      setTransactions(productionSnapshot.transactions);
      setExpenses(productionSnapshot.expenses || []);
      setCustomers(productionSnapshot.customers);
      setStockMovements(productionSnapshot.stockMovements);
      setUsers(productionSnapshot.users);
      setSettings(productionSnapshot.settings);
      setCurrencies(productionSnapshot.currencies);
      setExchangeRates(productionSnapshot.exchangeRates);
      setExchangeRateItems(productionSnapshot.exchangeRateItems);
      setExchangeRateHistory(productionSnapshot.exchangeRateHistory);
      setUnmetDemandRequests(productionSnapshot.unmetDemandRequests);
      setCurrentUserId(
        productionSnapshot.currentUserId ||
          productionSnapshot.users[0]?.id ||
          'unassigned-operator'
      );
      const validIds = new Set(productionSnapshot.users.map((u) => u.id));
      setActiveSessions((prev) => prev.filter((s) => validIds.has(s.userId)));
    } else {
      const loaded = loadCompanyOperationalState(currentCompanyId);
      setProducts(loaded.products);
      setTransactions(loaded.transactions);
      setExpenses(loaded.expenses);
      setCustomers(loaded.customers);
      setStockMovements(loaded.stockMovements);
      setCurrencies(loaded.currencies);
      setExchangeRates(loaded.exchangeRates);
      setExchangeRateItems(loaded.exchangeRateItems);
      setExchangeRateHistory(loaded.exchangeRateHistory);
      setUnmetDemandRequests(loaded.unmetDemandRequests);
      setUsers(loaded.users);
      setActiveSessions(loaded.activeSessions);
      setCurrentUserId(loaded.users[0]?.id || 'unassigned-operator');
    }

    setActiveBranchId('branch-main');
    triggerHaptic('medium', settings.hapticsEnabled);
  }, [
    productionSnapshot,
    currentCompanyId,
    settings.hapticsEnabled,
    setActiveBranchId,
    setWorkspaceMode,
    setCart,
    setSelectedCustomer,
    setGlobalDiscountPercentState,
    setGlobalDiscountAmountState,
    setProducts,
    setTransactions,
    setExpenses,
    setCustomers,
    setStockMovements,
    setUsers,
    setSettings,
    setCurrencies,
    setExchangeRates,
    setExchangeRateItems,
    setExchangeRateHistory,
    setUnmetDemandRequests,
    setCurrentUserId,
    setActiveSessions,
  ]);

  const resetPracticeModeData = useCallback(async () => {
    Object.values(PRACTICE_STORAGE_KEYS).forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch {}
    });

    if (workspaceMode === 'PRACTICE') {
      setProducts(INITIAL_PRODUCTS.map((p, idx) => enrichProductWithSeedMetadata(p, idx)));
      setTransactions(INITIAL_TRANSACTIONS);
      setExpenses(INITIAL_EXPENSES);
      setCustomers(INITIAL_CUSTOMERS);
      setStockMovements(INITIAL_STOCK_MOVEMENTS);
      setUnmetDemandRequests(INITIAL_UNMET_DEMAND_REQUESTS as UnmetDemandRequestRecord[]);
      setCurrencies([...DEFAULT_CURRENCIES_LIST]);
      setExchangeRates({ ...DEFAULT_EXCHANGE_RATES_MAP });
      setExchangeRateItems(buildPracticeExchangeRateItems());
      setExchangeRateHistory(INITIAL_EXCHANGE_RATE_HISTORY);
      setUsers(INITIAL_USERS);
      setActiveSessions(INITIAL_ACTIVE_SESSIONS);
      setCurrentUserId('user-1');
    }

    try {
      const res = await fetch('/api/onboarding/practice/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const payload = await res.json();
        const prac = payload?.data?.state;
        if (prac && workspaceMode === 'PRACTICE') {
          if (Array.isArray(prac.products)) setProducts(prac.products);
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
        }
      }
    } catch {
      // Offline Practice Mode reset already applied above
    }

    setCart([]);
    setSelectedCustomer(null);
    setGlobalDiscountPercentState(0);
    setGlobalDiscountAmountState(0);
    playSuccessChime(settings.soundEnabled);
    triggerHaptic('heavy', true);
  }, [
    workspaceMode,
    settings.soundEnabled,
    setProducts,
    setTransactions,
    setExpenses,
    setCustomers,
    setStockMovements,
    setUnmetDemandRequests,
    setCurrencies,
    setExchangeRates,
    setExchangeRateItems,
    setExchangeRateHistory,
    setUsers,
    setActiveSessions,
    setCurrentUserId,
    setCart,
    setSelectedCustomer,
    setGlobalDiscountPercentState,
    setGlobalDiscountAmountState,
  ]);

  const resetAllData = useCallback(() => {
    if (workspaceMode === 'PRACTICE') {
      resetPracticeModeData();
      return;
    }

    const keysToRemove = [
      STORAGE_KEYS.PRODUCTS,
      STORAGE_KEYS.TRANSACTIONS,
      STORAGE_KEYS.CUSTOMERS,
      STORAGE_KEYS.MOVEMENTS,
      STORAGE_KEYS.SETTINGS,
      STORAGE_KEYS.CURRENCIES,
      STORAGE_KEYS.EXCHANGE_RATES,
      STORAGE_KEYS.EXCHANGE_RATE_ITEMS,
      STORAGE_KEYS.RATE_HISTORY,
      STORAGE_KEYS.UNMET_DEMAND_REQUESTS,
      STORAGE_KEYS.USERS,
      STORAGE_KEYS.ACTIVE_SESSIONS,
      STORAGE_KEYS.CURRENT_USER_ID,
      getCompanyStorageKey(STORAGE_KEYS.PRODUCTS, currentCompanyId),
      getCompanyStorageKey(STORAGE_KEYS.TRANSACTIONS, currentCompanyId),
      getCompanyStorageKey(STORAGE_KEYS.CUSTOMERS, currentCompanyId),
      getCompanyStorageKey(STORAGE_KEYS.MOVEMENTS, currentCompanyId),
      getCompanyStorageKey(STORAGE_KEYS.SETTINGS, currentCompanyId),
      getCompanyStorageKey(STORAGE_KEYS.CURRENCIES, currentCompanyId),
      getCompanyStorageKey(STORAGE_KEYS.EXCHANGE_RATES, currentCompanyId),
      getCompanyStorageKey(STORAGE_KEYS.EXCHANGE_RATE_ITEMS, currentCompanyId),
      getCompanyStorageKey(STORAGE_KEYS.RATE_HISTORY, currentCompanyId),
      getCompanyStorageKey(STORAGE_KEYS.UNMET_DEMAND_REQUESTS, currentCompanyId),
      getCompanyStorageKey(STORAGE_KEYS.USERS, currentCompanyId),
      getCompanyStorageKey(STORAGE_KEYS.ACTIVE_SESSIONS, currentCompanyId),
      STORAGE_KEYS.EXPENSES,
      getCompanyStorageKey(STORAGE_KEYS.EXPENSES, currentCompanyId),
    ];
    for (const k of keysToRemove) {
      try {
        localStorage.removeItem(k);
      } catch {}
    }

    setProducts([]);
    setTransactions([]);
    setExpenses([]);
    setCustomers([]);
    setStockMovements([]);
    setCurrencies([]);
    setExchangeRates({ SDG: 1 });
    setExchangeRateItems([]);
    setExchangeRateHistory([]);
    setUnmetDemandRequests([]);
    setUsers([]);
    setActiveSessions([]);
    setCurrentUserId('unassigned-operator');
    setSettings((prev) => ({
      ...prev,
      currency: 'SDG',
      exchangeRates: { SDG: 1 },
    }));
    setCart([]);
    setSelectedCustomer(null);
    setGlobalDiscountPercent(0);

    playSuccessChime(settings.soundEnabled);
    triggerHaptic('heavy', true);
  }, [
    workspaceMode,
    currentCompanyId,
    resetPracticeModeData,
    setGlobalDiscountPercent,
    settings.soundEnabled,
    setProducts,
    setTransactions,
    setExpenses,
    setCustomers,
    setStockMovements,
    setCurrencies,
    setExchangeRates,
    setExchangeRateItems,
    setExchangeRateHistory,
    setUnmetDemandRequests,
    setUsers,
    setActiveSessions,
    setCurrentUserId,
    setSettings,
    setCart,
    setSelectedCustomer,
  ]);

  const executeAuthorizedFactoryReset = useCallback(
    async (params: {
      scope: 'LOCAL_DEVICE_RESET' | 'COMPANY_FACTORY_RESET';
      confirmCompanyName?: string;
      ownerUsernameOrId?: string;
      ownerPassword?: string;
      reason?: string;
    }): Promise<{
      ok: boolean;
      error?: string;
      scope?: string;
      deletedCounts?: Record<string, number>;
    }> => {
      if (workspaceMode === 'PRACTICE') {
        await resetPracticeModeData();
        return { ok: true, scope: 'PRACTICE_MODE_RESET' };
      }

      const scope = params.scope || 'LOCAL_DEVICE_RESET';

      if (scope === 'LOCAL_DEVICE_RESET') {
        try {
          await fetch('/api/onboarding/factory-reset', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': currentUser.id,
              'x-company-id': currentCompany.id,
            },
            body: JSON.stringify({
              scope: 'LOCAL_DEVICE_RESET',
              companyId: currentCompany.id,
              reason: params.reason || 'Local device cache reset',
            }),
          });
        } catch {}

        resetAllData();
        return { ok: true, scope: 'LOCAL_DEVICE_RESET' };
      }

      const confirmName = String(params.confirmCompanyName || '').trim();
      const password = String(params.ownerPassword || '').trim();
      const expectedLegal = String(currentCompany.legalName || '').trim().toLowerCase();
      const expectedDisplay = String(currentCompany.displayName || '').trim().toLowerCase();
      const expectedAr = String(currentCompany.displayNameAr || '').trim().toLowerCase();
      const enteredLower = confirmName.toLowerCase();

      if (
        !enteredLower ||
        (enteredLower !== expectedLegal &&
          enteredLower !== expectedDisplay &&
          enteredLower !== expectedAr)
      ) {
        return {
          ok: false,
          error:
            settings.language === 'ar'
              ? 'اسم الشركة المدخل للتأكيد لا يطابق اسم الشركة الحالية.'
              : 'Company name confirmation does not match the active company name.',
        };
      }

      if (!password) {
        return {
          ok: false,
          error:
            settings.language === 'ar'
              ? 'يرجى إدخال كلمة مرور المالك أو الرمز السري لتأكيد إعادة ضبط المصنع.'
              : 'Owner password or PIN is required to authorize Company Factory Reset.',
        };
      }

      let serverDeletedCounts: Record<string, number> | undefined;
      try {
        const res = await fetch('/api/onboarding/factory-reset', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': currentUser.id,
            'x-company-id': currentCompany.id,
          },
          body: JSON.stringify({
            scope: 'COMPANY_FACTORY_RESET',
            companyId: currentCompany.id,
            confirmCompanyName: confirmName,
            ownerUsernameOrId: params.ownerUsernameOrId || currentUser.username || currentUser.id,
            ownerPassword: password,
            reason: params.reason || 'Authorized Company Factory Reset',
          }),
        });
        if (res.ok) {
          const payload = await res.json();
          serverDeletedCounts = payload?.data?.deletedCounts;
        } else {
          const errPayload = await res.json().catch(() => null);
          if (
            errPayload?.code === 'INVALID_OWNER_PASSWORD' ||
            errPayload?.code === 'COMPANY_NAME_CONFIRMATION_MISMATCH'
          ) {
            return {
              ok: false,
              error: errPayload?.message || 'Owner authentication failed.',
            };
          }
        }
      } catch {
        const localOwner = users.find(
          (u) =>
            u.companyId === currentCompany.id &&
            (u.systemRole === 'COMPANY_OWNER' || u.role === 'admin')
        );
        if (localOwner && localOwner.pin && localOwner.pin !== password) {
          return {
            ok: false,
            error:
              settings.language === 'ar'
                ? 'كلمة المرور أو رمز PIN للمالك غير صحيح.'
                : 'Invalid Owner password or PIN.',
          };
        }
      }

      const resetCompanyId = currentCompany.id;
      resetAllData();

      const remainingCompanies = companies.filter((c) => c.id !== resetCompanyId);
      setCompanies(remainingCompanies);
      setAllBranches((prev) => prev.filter((b) => b.companyId !== resetCompanyId));

      if (remainingCompanies.length > 0) {
        setCurrentCompanyId(remainingCompanies[0].id);
      } else {
        setCurrentCompanyId('comp-clean-store');
        setOnboardingModalInitialView('create-company');
        setIsOnboardingModalOpen(true);
      }

      return {
        ok: true,
        scope: 'COMPANY_FACTORY_RESET',
        deletedCounts: serverDeletedCounts,
      };
    },
    [
      workspaceMode,
      resetPracticeModeData,
      currentUser,
      currentCompany,
      resetAllData,
      settings.language,
      users,
      companies,
      setCompanies,
      setAllBranches,
      setCurrentCompanyId,
    ]
  );

  const createNewCompanyWorkspace = useCallback(
    async (
      input: Record<string, any>
    ): Promise<{
      ok: boolean;
      error?: string;
      company?: CompanyProfile;
      owner?: POSUser;
      branch?: BranchRecord;
    }> => {
      const nowIso = new Date().toISOString();
      const suffix = Date.now().toString(36).slice(-5);
      const rawUserBase = String(input.baseCurrency || '').toUpperCase().trim();
      const skipInitialCurrencies = Boolean(input.skipInitialCurrencies);
      const cleanBase = rawUserBase || 'SDG';
      const secondaryList: string[] = Array.isArray(input.secondaryCurrencies)
        ? input.secondaryCurrencies.map((c: string) => String(c).toUpperCase().trim()).filter(Boolean)
        : [];
      const rawRatesMap: Record<string, number> =
        input.initialExchangeRates && typeof input.initialExchangeRates === 'object'
          ? input.initialExchangeRates
          : {};

      const localCompany: CompanyProfile = {
        id: `comp-${suffix}`,
        legalName: String(input.legalName || input.displayName || '').trim(),
        displayName: String(input.displayName || input.legalName || '').trim(),
        displayNameAr: String(
          input.displayNameAr || input.displayName || input.legalName || ''
        ).trim(),
        businessType: String(input.businessType || '').trim(),
        country: String(input.country || '').trim(),
        city: String(input.city || '').trim(),
        address: String(input.address || '').trim(),
        phone: String(input.phone || '').trim(),
        email: String(input.email || '').trim(),
        taxNumber: String(input.taxNumber || '').trim(),
        defaultLanguage: input.defaultLanguage === 'en' ? 'en' : 'ar',
        timezone: String(input.timezone || 'Africa/Khartoum'),
        fiscalYearStartMonth: Number(input.fiscalYearStartMonth) || 1,
        baseCurrency: cleanBase,
        secondaryCurrencies: secondaryList,
        exchangeRatePolicy: input.exchangeRatePolicy || 'manual_daily',
        isDemoPractice: false,
        onboardingCompleted: true,
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      const localBranch: BranchRecord = {
        id: `br-${suffix}-main`,
        companyId: localCompany.id,
        code: String(input.branchCode || `BR-${suffix.toUpperCase()}`).trim(),
        name: String(input.branchName || localCompany.displayName || 'Main Branch').trim(),
        nameAr: String(
          input.branchNameAr || input.branchName || localCompany.displayNameAr || 'الفرع الرئيسي'
        ).trim(),
        city: String(input.branchCity || localCompany.city || '').trim(),
        address: String(input.branchAddress || localCompany.address || '').trim(),
        phone: String(input.branchPhone || localCompany.phone || '').trim(),
        isMainBranch: true,
        isActive: true,
        createdAt: nowIso,
      };

      const ownerCapabilities = deriveCapabilitiesFromUser({
        role: 'admin',
        systemRole: 'COMPANY_OWNER',
        permissions: { ...DEFAULT_ROLE_PERMISSIONS.admin },
      });
      const localOwner: POSUser = {
        id: `usr-owner-${suffix}`,
        companyId: localCompany.id,
        branchId: localBranch.id,
        assignedBranchIds: [localBranch.id],
        name: String(input.ownerName || localCompany.displayName).trim(),
        nameAr: String(
          input.ownerNameAr || input.ownerName || localCompany.displayNameAr
        ).trim(),
        username: String(input.ownerUsername || `owner.${suffix}`).trim(),
        email: String(input.ownerEmail || '').trim() || undefined,
        phone: String(input.ownerPhone || localCompany.phone || '').trim() || undefined,
        role: 'admin',
        systemRole: 'COMPANY_OWNER',
        capabilities: ownerCapabilities,
        pin: String(input.ownerPin || '1111').trim(),
        terminalName: `${localBranch.name} Terminal 01`,
        terminalNameAr: `نقطة بيع ${localBranch.nameAr}`,
        avatarColor: '#10b981',
        isActive: true,
        permissions: deriveLegacyPermissionsFromCapabilities(ownerCapabilities),
        lastActiveAt: nowIso,
      };

      let finalCompany = localCompany;
      let finalBranch = localBranch;
      let finalOwner = localOwner;

      try {
        const res = await fetch('/api/onboarding/companies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': currentUser.id,
            'x-company-id': currentCompany.id,
          },
          body: JSON.stringify(input),
        });
        if (res.ok) {
          const payload = await res.json();
          if (payload?.data?.company) finalCompany = payload.data.company;
          if (payload?.data?.branch) finalBranch = payload.data.branch;
          if (payload?.data?.owner) finalOwner = payload.data.owner;
          if (payload?.data?.sessionToken) {
            try {
              localStorage.setItem(STORAGE_KEYS.SESSION_TOKEN, payload.data.sessionToken);
            } catch {}
          }
        }
      } catch {
        // Offline mode: localCompany, localBranch, localOwner are used directly
      }

      const newCompanyCurrencies: Currency[] = [];
      const newCompanyRatesMap: Record<string, number> = { [cleanBase]: 1, SDG: 1 };
      const newCompanyRateItems: ExchangeRateItem[] = [];

      if (!skipInitialCurrencies && rawUserBase.length >= 2) {
        const matchedBasePreset = DEFAULT_CURRENCIES_LIST.find((c) => c.code === rawUserBase);
        newCompanyCurrencies.push(
          matchedBasePreset
            ? { ...matchedBasePreset, isBase: true, isActive: true }
            : {
                code: rawUserBase,
                name: rawUserBase,
                nameAr: rawUserBase,
                symbol: rawUserBase,
                decimalPlaces: 2,
                isBase: true,
                isActive: true,
              }
        );
      }

      for (const code of secondaryList) {
        if (skipInitialCurrencies) break;
        const cleanCode = code.toUpperCase().trim();
        const enteredRate = Number(rawRatesMap[cleanCode]);
        if (cleanCode && cleanCode !== cleanBase && !isNaN(enteredRate) && enteredRate > 0) {
          const matchedPreset = DEFAULT_CURRENCIES_LIST.find((c) => c.code === cleanCode);
          const curObj: Currency = matchedPreset
            ? { ...matchedPreset, isBase: false, isActive: true }
            : {
                code: cleanCode,
                name: cleanCode,
                nameAr: cleanCode,
                symbol: cleanCode,
                decimalPlaces: 2,
                isBase: false,
                isActive: true,
              };
          newCompanyCurrencies.push(curObj);
          newCompanyRatesMap[cleanCode] = enteredRate;
          newCompanyRateItems.push({
            id: `rate-${cleanCode.toLowerCase()}-${cleanBase.toLowerCase()}-${Date.now()}`,
            sourceCurrency: cleanCode,
            targetCurrency: cleanBase,
            rate: enteredRate,
            inverseRate: Math.round((1 / enteredRate) * 1000000) / 1000000,
            effectiveFrom: nowIso,
            expiryDate: null,
            isActive: true,
            sourceSymbol: curObj.symbol,
            targetSymbol: newCompanyCurrencies[0]?.symbol || cleanBase,
            sourceName: curObj.name,
            targetName: newCompanyCurrencies[0]?.name || cleanBase,
          });
        }
      }

      setCompanies((prev) => {
        const filtered = prev.filter((c) => c.id !== 'comp-default');
        const exists = filtered.some((c) => c.id === finalCompany.id);
        return exists
          ? filtered.map((c) => (c.id === finalCompany.id ? finalCompany : c))
          : [...filtered, finalCompany];
      });
      setCurrentCompanyId(finalCompany.id);
      setWorkspaceMode('PRODUCTION');

      setProducts([]);
      setTransactions([]);
      setExpenses([]);
      setCustomers([]);
      setStockMovements([]);
      setUnmetDemandRequests([]);
      setExchangeRateHistory([]);
      setCurrencies(newCompanyCurrencies);
      setExchangeRates(newCompanyRatesMap);
      setExchangeRateItems(newCompanyRateItems);
      setCart([]);
      setSelectedCustomer(null);

      setSettings((prev) => ({
        ...prev,
        storeName: finalCompany.displayName || finalCompany.legalName,
        storeNameAr: finalCompany.displayNameAr || finalCompany.displayName,
        storeAddress: finalCompany.address || '',
        storePhone: finalCompany.phone || '',
        currency: finalCompany.baseCurrency || 'SDG',
        language: finalCompany.defaultLanguage || prev.language,
        exchangeRates: newCompanyRatesMap,
      }));

      setAllBranches((prev) => {
        const exists = prev.some((b) => b.id === finalBranch.id);
        return exists
          ? prev.map((b) => (b.id === finalBranch.id ? finalBranch : b))
          : [...prev, finalBranch];
      });
      setActiveBranchId(finalBranch.id);

      const hasEnteredOwnerAccount = Boolean(
        String(input.ownerName || '').trim() || String(input.ownerNameAr || '').trim()
      );
      if (hasEnteredOwnerAccount) {
        setUsers([finalOwner]);
        setCurrentUserId(finalOwner.id);
        setActiveSessions([
          {
            sessionId: `sess-${finalOwner.id}-${Date.now()}`,
            userId: finalOwner.id,
            userName: finalOwner.name,
            userNameAr: finalOwner.nameAr,
            role: finalOwner.role,
            terminalName: finalOwner.terminalName,
            terminalNameAr: finalOwner.terminalNameAr,
            startedAt: nowIso,
            lastPingAt: nowIso,
            status: 'online',
          },
        ]);
      } else {
        setUsers([]);
        setActiveSessions([]);
        setCurrentUserId('unassigned-operator');
      }

      setIsOnboardingModalOpen(false);
      playSuccessChime(settings.soundEnabled);
      triggerHaptic('success', settings.hapticsEnabled);
      return { ok: true, company: finalCompany, branch: finalBranch, owner: finalOwner };
    },
    [
      currentUser.id,
      currentCompany.id,
      settings.soundEnabled,
      settings.hapticsEnabled,
      setActiveBranchId,
      setCompanies,
      setCurrentCompanyId,
      setWorkspaceMode,
      setProducts,
      setTransactions,
      setExpenses,
      setCustomers,
      setStockMovements,
      setUnmetDemandRequests,
      setExchangeRateHistory,
      setCurrencies,
      setExchangeRates,
      setExchangeRateItems,
      setCart,
      setSelectedCustomer,
      setSettings,
      setAllBranches,
      setUsers,
      setCurrentUserId,
      setActiveSessions,
    ]
  );

  const switchCompanyWorkspace = useCallback(
    async (companyId: string, userId?: string) => {
      if (companyId === 'comp-demo-practice') {
        await enterPracticeMode();
        return;
      }

      if (workspaceMode === 'PRACTICE') {
        setWorkspaceMode('PRODUCTION');
      }

      setCurrentCompanyId(companyId);
      const loaded = loadCompanyOperationalState(companyId);
      setProducts(loaded.products);
      setTransactions(loaded.transactions);
      setExpenses(loaded.expenses);
      setCustomers(loaded.customers);
      setStockMovements(loaded.stockMovements);
      setUnmetDemandRequests(loaded.unmetDemandRequests);
      setCurrencies(loaded.currencies);
      setExchangeRates(loaded.exchangeRates);
      setExchangeRateItems(loaded.exchangeRateItems);
      setExchangeRateHistory(loaded.exchangeRateHistory);
      setUsers(loaded.users);
      setActiveSessions(loaded.activeSessions);
      setCart([]);
      setSelectedCustomer(null);

      const targetCompany = companies.find((c) => c.id === companyId);
      if (targetCompany) {
        setSettings((prev) => ({
          ...prev,
          storeName: targetCompany.displayName || targetCompany.legalName,
          storeNameAr: targetCompany.displayNameAr || targetCompany.displayName,
          storeAddress: targetCompany.address || '',
          storePhone: targetCompany.phone || '',
          currency: targetCompany.baseCurrency || 'SDG',
          exchangeRates: loaded.exchangeRates,
        }));
      }

      const companyBranches = allBranches.filter(
        (b) => (b.companyId || 'comp-default') === companyId
      );
      if (companyBranches.length > 0) {
        setActiveBranchId(companyBranches[0].id);
      }

      if (userId) {
        setCurrentUserId(userId);
      } else if (loaded.users.length > 0) {
        setCurrentUserId(loaded.users[0].id);
      } else {
        setCurrentUserId('unassigned-operator');
      }

      setIsOnboardingModalOpen(false);
      triggerHaptic('light', settings.hapticsEnabled);
    },
    [
      workspaceMode,
      enterPracticeMode,
      companies,
      allBranches,
      settings.hapticsEnabled,
      setActiveBranchId,
      setWorkspaceMode,
      setCurrentCompanyId,
      setProducts,
      setTransactions,
      setExpenses,
      setCustomers,
      setStockMovements,
      setUnmetDemandRequests,
      setCurrencies,
      setExchangeRates,
      setExchangeRateItems,
      setExchangeRateHistory,
      setUsers,
      setActiveSessions,
      setCart,
      setSelectedCustomer,
      setSettings,
      setCurrentUserId,
    ]
  );

  const createBranch = useCallback(
    async (input: {
      name: string;
      nameAr?: string;
      code?: string;
      city?: string;
      address?: string;
      phone?: string;
      isMainBranch?: boolean;
    }): Promise<BranchRecord | null> => {
      const targetCompanyId =
        workspaceMode === 'PRACTICE' ? 'comp-demo-practice' : currentCompany.id;
      try {
        const res = await fetch('/api/branches', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': currentUser.id,
            'x-company-id': targetCompanyId,
          },
          body: JSON.stringify({
            ...input,
            companyId: targetCompanyId,
          }),
        });
        if (res.ok) {
          const payload = await res.json();
          const created: BranchRecord = payload?.data?.branch;
          if (created) {
            setAllBranches((prev) => [...prev, created]);
            playSuccessChime(settings.soundEnabled);
            triggerHaptic('success', settings.hapticsEnabled);
            return created;
          }
        }
      } catch {}

      const fallbackBranch: BranchRecord = {
        id: `branch-${Date.now()}`,
        companyId: targetCompanyId,
        code: (input.code || `BR-0${branches.length + 1}`).toUpperCase(),
        name: input.name.trim(),
        nameAr: input.nameAr?.trim() || input.name.trim(),
        city: input.city?.trim() || '',
        address: input.address?.trim() || '',
        phone: input.phone?.trim() || '',
        isMainBranch: Boolean(input.isMainBranch),
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      setAllBranches((prev) => [...prev, fallbackBranch]);
      playSuccessChime(settings.soundEnabled);
      triggerHaptic('success', settings.hapticsEnabled);
      return fallbackBranch;
    },
    [
      workspaceMode,
      currentCompany.id,
      currentUser.id,
      branches.length,
      settings.soundEnabled,
      settings.hapticsEnabled,
      setAllBranches,
    ]
  );

  const updateBranch = useCallback(
    (branchId: string, updates: Partial<BranchRecord>) => {
      setAllBranches((prev) =>
        prev.map((b) => (b.id === branchId ? { ...b, ...updates } : b))
      );
      triggerHaptic('light', settings.hapticsEnabled);
    },
    [settings.hapticsEnabled, setAllBranches]
  );

  const deleteBranch = useCallback(
    (branchId: string) => {
      setAllBranches((prev) => prev.filter((b) => b.id !== branchId));
      triggerHaptic('medium', settings.hapticsEnabled);
    },
    [settings.hapticsEnabled, setAllBranches]
  );

  const syncTransactions = useCallback(async () => {
    setIsSyncing(true);
    triggerHaptic('light', settings.hapticsEnabled);
    try {
      const response = await fetch('/api/store-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-workspace-mode': workspaceMode,
          'x-company-id': currentCompany.id,
        },
        body: JSON.stringify({
          workspaceMode,
          companyId: currentCompany.id,
          transactions: transactions.map((t) => ({ ...t, syncStatus: 'synced' })),
          customers,
          stockMovements,
          users,
          activeSessions,
          unmetDemandRequests,
        }),
      });
      if (response.ok) {
        const syncedData = await response.json();
        if (workspaceMode === 'PRACTICE') {
          if (Array.isArray(syncedData.transactions) && syncedData.transactions.length > 0) {
            setTransactions(
              syncedData.transactions.map((t: Transaction) => ({ ...t, syncStatus: 'synced' }))
            );
          }
          if (Array.isArray(syncedData.customers) && syncedData.customers.length > 0) {
            setCustomers(syncedData.customers);
          }
          if (Array.isArray(syncedData.stockMovements) && syncedData.stockMovements.length > 0) {
            setStockMovements(syncedData.stockMovements);
          }
          if (Array.isArray(syncedData.users) && syncedData.users.length > 0) {
            setUsers(syncedData.users);
          }
          if (Array.isArray(syncedData.activeSessions) && syncedData.activeSessions.length > 0) {
            setActiveSessions(syncedData.activeSessions);
          }
          if (Array.isArray(syncedData.products) && syncedData.products.length > 0) {
            setProducts(syncedData.products);
          }
        } else {
          setTransactions((prev) =>
            prev.map((t) => (t.syncStatus !== 'synced' ? { ...t, syncStatus: 'synced' } : t))
          );
        }
        await offlineSqliteStorage.markTransactionsSynced(sqliteCompanyScope);
        setSqliteDiagnostics(offlineSqliteStorage.getDiagnostics(sqliteCompanyScope));
      } else {
        setTransactions((prev) =>
          prev.map((t) => (t.syncStatus !== 'synced' ? { ...t, syncStatus: 'synced' } : t))
        );
      }
    } catch {
      // Device is offline: keep pending transactions safely queued in Capacitor SQLite outbox
    } finally {
      setLastSyncedAt(new Date());
      setIsSyncing(false);
      setSqliteDiagnostics(offlineSqliteStorage.getDiagnostics(sqliteCompanyScope));
      triggerHaptic('success', settings.hapticsEnabled);
    }
  }, [
    workspaceMode,
    currentCompany.id,
    sqliteCompanyScope,
    settings.hapticsEnabled,
    transactions,
    customers,
    stockMovements,
    users,
    activeSessions,
    unmetDemandRequests,
    setIsSyncing,
    setTransactions,
    setCustomers,
    setStockMovements,
    setUsers,
    setActiveSessions,
    setProducts,
    setSqliteDiagnostics,
    setLastSyncedAt,
  ]);

  return {
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
  };
}
