/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback } from 'react';
import {
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
  BackupPayloadV1,
  scrubSensitiveUserFields,
} from '../../lib/backup-merge-engine';
import {
  savePersistedCurrencies,
  savePersistedExchangeRates,
  savePersistedExchangeRateItems,
} from '../../lib/exchange-rate-storage';
import { generateExpenseId } from '../../lib/expense-calculations';
import { playSuccessChime, triggerHaptic } from '../../lib/sound-fx';
import { STORAGE_KEYS, getCompanyStorageKey } from '../pos-storage-helpers';

interface UseBackupHydrationDomainParams {
  currentCompany: CompanyProfile;
  currentCompanyId: string;
  setCurrentCompanyId: React.Dispatch<React.SetStateAction<string>>;
  setCompanies: React.Dispatch<React.SetStateAction<CompanyProfile[]>>;
  setWorkspaceMode: React.Dispatch<React.SetStateAction<WorkspaceMode>>;
  branches: BranchRecord[];
  setAllBranches: React.Dispatch<React.SetStateAction<BranchRecord[]>>;
  activeBranchId: string;
  setActiveBranchId: (branchId: string) => void;
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
  users: POSUser[];
  setUsers: React.Dispatch<React.SetStateAction<POSUser[]>>;
  currentUser: POSUser;
  setCurrentUserId: React.Dispatch<React.SetStateAction<string>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  stockMovements: StockMovement[];
  setStockMovements: React.Dispatch<React.SetStateAction<StockMovement[]>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  expenses: ExpenseRecord[];
  setExpenses: React.Dispatch<React.SetStateAction<ExpenseRecord[]>>;
  unmetDemandRequests: UnmetDemandRequestRecord[];
  setUnmetDemandRequests: React.Dispatch<React.SetStateAction<UnmetDemandRequestRecord[]>>;
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  setSelectedCustomer: React.Dispatch<React.SetStateAction<Customer | null>>;
  setIsOnboardingModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useBackupHydrationDomain({
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
}: UseBackupHydrationDomainParams) {
  const collectClientBackupDataset = useCallback((): BackupPayloadV1 => {
    const compId = currentCompany.id;
    const readScopedJson = <T,>(baseKey: string, fallback: T): T => {
      try {
        const raw =
          localStorage.getItem(getCompanyStorageKey(baseKey, compId)) ||
          localStorage.getItem(`${baseKey}__${compId}`) ||
          localStorage.getItem(baseKey);
        if (raw) return JSON.parse(raw);
      } catch {}
      return fallback;
    };

    const categoriesFromProducts = Array.from(
      new Set(products.map((p) => p.category).filter(Boolean))
    ).map((catName, idx) => ({
      id: `cat-${idx + 1}-${catName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      companyId: compId,
      name: catName,
      nameAr: products.find((p) => p.category === catName)?.categoryAr || catName,
      slug: catName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    }));

    return {
      companyProfile: currentCompany,
      storeSettings: settings,
      invoiceSettings: readScopedJson<Record<string, any>>('pos_invoice_settings', {}),
      currencies,
      exchangeRates,
      exchangeRateItems,
      exchangeRateHistory,
      branches,
      employees: users.map((u) => scrubSensitiveUserFields(u)),
      unitsOfMeasure: readScopedJson<any[]>('pos_uom', []),
      customFieldDefinitions: readScopedJson<any[]>('pos_custom_fields', []),
      categories: readScopedJson<any[]>('pos_categories', categoriesFromProducts),
      products,
      customers,
      suppliers: readScopedJson<any[]>('pos_suppliers', []),
      stockMovements,
      branchTransfers: readScopedJson<any[]>('pos_branch_transfers', []),
      purchases: readScopedJson<any[]>('pos_purchase_orders', []),
      transactions,
      expenses: expenses.map((e) => ({
        id: e.id,
        companyId: e.companyId || currentCompany.id,
        branchId: e.branchId || activeBranchId,
        title: e.title,
        category: e.category,
        amount: e.amount,
        currency: e.currency,
        paymentMethod: e.paymentMethod,
        reference: e.transferReference,
        notes: e.notes,
        date: e.timestamp,
        createdBy: e.recordedBy,
      })),
      accounts: readScopedJson<any[]>('pos_accounts', []),
      journalEntries: readScopedJson<any[]>('pos_journal_entries', []),
      unmetDemandRequests,
      intelligenceLifecycleItems: [],
      auditLogs: [],
    };
  }, [
    currentCompany,
    activeBranchId,
    settings,
    currencies,
    exchangeRates,
    exchangeRateItems,
    exchangeRateHistory,
    branches,
    users,
    products,
    customers,
    stockMovements,
    transactions,
    expenses,
    unmetDemandRequests,
  ]);

  const hydrateCompanyFromBackupPayload = useCallback(
    (
      payload: BackupPayloadV1,
      options?: { switchToNewCompany?: boolean; newOwner?: POSUser }
    ) => {
      if (!payload || !payload.companyProfile) return;
      const incomingComp = payload.companyProfile;
      const resolvedCompId =
        options?.switchToNewCompany &&
        incomingComp.id &&
        incomingComp.id !== 'comp-default' &&
        incomingComp.id !== 'comp-demo-practice'
          ? incomingComp.id
          : currentCompanyId &&
            currentCompanyId !== 'comp-default' &&
            currentCompanyId !== 'comp-demo-practice'
          ? currentCompanyId
          : incomingComp.id &&
            incomingComp.id !== 'comp-default' &&
            incomingComp.id !== 'comp-demo-practice'
          ? incomingComp.id
          : 'comp-clean-store';

      const targetComp: CompanyProfile = {
        ...incomingComp,
        id: resolvedCompId,
        isDemoPractice: false,
        onboardingCompleted: true,
      };
      const targetCompId = targetComp.id;

      setWorkspaceMode('PRODUCTION');
      setCompanies((prev) => {
        const filtered = prev.filter((c) => c.id !== 'comp-default' && !c.isDemoPractice);
        const exists = filtered.some((c) => c.id === targetCompId);
        const nextCompanies = exists
          ? filtered.map((c) => (c.id === targetCompId ? targetComp : c))
          : [...filtered, targetComp];
        try {
          localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(nextCompanies));
        } catch {}
        return nextCompanies;
      });
      setCurrentCompanyId(targetCompId);

      if (Array.isArray(payload.branches) && payload.branches.length > 0) {
        const normalizedBranches = payload.branches.map((b) => ({
          ...b,
          companyId: targetCompId,
        }));
        setAllBranches((prev) => {
          const other = prev.filter((b) => b.companyId !== targetCompId);
          const nextBranches = [...other, ...normalizedBranches];
          try {
            localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(nextBranches));
          } catch {}
          return nextBranches;
        });
        setActiveBranchId(normalizedBranches[0].id);
      }

      const restoredProducts = Array.isArray(payload.products) ? payload.products : [];
      const restoredTransactions = Array.isArray(payload.transactions) ? payload.transactions : [];
      const restoredCustomers = Array.isArray(payload.customers) ? payload.customers : [];
      const restoredMovements = Array.isArray(payload.stockMovements) ? payload.stockMovements : [];
      const restoredDemand = Array.isArray(payload.unmetDemandRequests)
        ? payload.unmetDemandRequests
        : [];

      setProducts(restoredProducts);
      setTransactions(restoredTransactions);
      setCustomers(restoredCustomers);
      setStockMovements(restoredMovements);
      setUnmetDemandRequests(restoredDemand);

      if (Array.isArray(payload.currencies)) {
        setCurrencies(payload.currencies);
        savePersistedCurrencies(payload.currencies);
      }
      if (payload.exchangeRates && typeof payload.exchangeRates === 'object') {
        setExchangeRates({ ...payload.exchangeRates, SDG: 1 });
        savePersistedExchangeRates({ ...payload.exchangeRates, SDG: 1 });
      }
      if (Array.isArray(payload.exchangeRateItems)) {
        setExchangeRateItems(payload.exchangeRateItems);
        savePersistedExchangeRateItems(payload.exchangeRateItems);
      }
      if (Array.isArray(payload.exchangeRateHistory)) {
        setExchangeRateHistory(payload.exchangeRateHistory);
      }

      if (payload.storeSettings) {
        setSettings((prev) => {
          const nextSettings = {
            ...prev,
            ...payload.storeSettings,
            storeName:
              payload.storeSettings?.storeName ||
              targetComp.displayName ||
              targetComp.legalName,
            storeNameAr:
              payload.storeSettings?.storeNameAr ||
              targetComp.displayNameAr ||
              targetComp.displayName,
          };
          try {
            localStorage.setItem(
              getCompanyStorageKey(STORAGE_KEYS.SETTINGS, targetCompId),
              JSON.stringify(nextSettings)
            );
            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(nextSettings));
          } catch {}
          return nextSettings;
        });
      }

      if (options?.newOwner) {
        const ownerRecord = options.newOwner;
        const otherEmployees = (payload.employees || [])
          .filter((e) => e.id !== ownerRecord.id && e.systemRole !== 'COMPANY_OWNER')
          .map((e) => ({
            ...e,
            pin: '0000',
          })) as POSUser[];
        const nextUsers = [ownerRecord, ...otherEmployees];
        setUsers(nextUsers);
        setCurrentUserId(ownerRecord.id);
        try {
          localStorage.setItem(
            getCompanyStorageKey(STORAGE_KEYS.USERS, targetCompId),
            JSON.stringify(nextUsers)
          );
          localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(nextUsers));
          localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, ownerRecord.id);
        } catch {}
      } else if (Array.isArray(payload.employees) && payload.employees.length > 0) {
        setUsers((prev) => {
          const existingMap = new Map<string, POSUser>(prev.map((u) => [u.id, u]));
          const mergedUsers: POSUser[] = payload.employees.map((e) => {
            const ex = existingMap.get(e.id);
            return {
              ...(e as any),
              pin: ex?.pin || '1111',
            };
          });
          if (
            currentUser &&
            currentUser.id !== 'unassigned-operator' &&
            !mergedUsers.some((u) => u.id === currentUser.id)
          ) {
            mergedUsers.unshift(currentUser);
          }
          try {
            localStorage.setItem(
              getCompanyStorageKey(STORAGE_KEYS.USERS, targetCompId),
              JSON.stringify(mergedUsers)
            );
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mergedUsers));
          } catch {}
          return mergedUsers;
        });
      }

      try {
        localStorage.setItem(STORAGE_KEYS.WORKSPACE_MODE, 'PRODUCTION');
        localStorage.setItem(STORAGE_KEYS.CURRENT_COMPANY_ID, targetCompId);
        localStorage.setItem(getCompanyStorageKey('pos_backup_restored', targetCompId), 'true');
        localStorage.setItem('pos_backup_restored_global', 'true');

        localStorage.setItem(
          getCompanyStorageKey(STORAGE_KEYS.PRODUCTS, targetCompId),
          JSON.stringify(restoredProducts)
        );
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(restoredProducts));

        localStorage.setItem(
          getCompanyStorageKey(STORAGE_KEYS.TRANSACTIONS, targetCompId),
          JSON.stringify(restoredTransactions)
        );
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(restoredTransactions));

        localStorage.setItem(
          getCompanyStorageKey(STORAGE_KEYS.CUSTOMERS, targetCompId),
          JSON.stringify(restoredCustomers)
        );
        localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(restoredCustomers));

        localStorage.setItem(
          getCompanyStorageKey(STORAGE_KEYS.MOVEMENTS, targetCompId),
          JSON.stringify(restoredMovements)
        );
        localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(restoredMovements));

        localStorage.setItem(
          getCompanyStorageKey(STORAGE_KEYS.UNMET_DEMAND_REQUESTS, targetCompId),
          JSON.stringify(restoredDemand)
        );
        localStorage.setItem(
          STORAGE_KEYS.UNMET_DEMAND_REQUESTS,
          JSON.stringify(restoredDemand)
        );

        if (Array.isArray(payload.currencies)) {
          localStorage.setItem(
            getCompanyStorageKey(STORAGE_KEYS.CURRENCIES, targetCompId),
            JSON.stringify(payload.currencies)
          );
        }
        if (payload.exchangeRates && typeof payload.exchangeRates === 'object') {
          localStorage.setItem(
            getCompanyStorageKey(STORAGE_KEYS.EXCHANGE_RATES, targetCompId),
            JSON.stringify({ ...payload.exchangeRates, SDG: 1 })
          );
        }
        if (Array.isArray(payload.exchangeRateItems)) {
          localStorage.setItem(
            getCompanyStorageKey(STORAGE_KEYS.EXCHANGE_RATE_ITEMS, targetCompId),
            JSON.stringify(payload.exchangeRateItems)
          );
        }
        if (Array.isArray(payload.exchangeRateHistory)) {
          localStorage.setItem(
            getCompanyStorageKey(STORAGE_KEYS.RATE_HISTORY, targetCompId),
            JSON.stringify(payload.exchangeRateHistory)
          );
        }

        if (payload.categories) {
          localStorage.setItem(
            getCompanyStorageKey('pos_categories', targetCompId),
            JSON.stringify(payload.categories)
          );
        }
        if (payload.suppliers) {
          localStorage.setItem(
            getCompanyStorageKey('pos_suppliers', targetCompId),
            JSON.stringify(payload.suppliers)
          );
        }
        if (payload.purchases) {
          localStorage.setItem(
            getCompanyStorageKey('pos_purchase_orders', targetCompId),
            JSON.stringify(payload.purchases)
          );
        }
        if (Array.isArray(payload.expenses)) {
          const normalizedExpenses: ExpenseRecord[] = payload.expenses.map((be: any) => ({
            id: be.id || generateExpenseId(),
            companyId: targetCompId,
            branchId: be.branchId,
            timestamp: be.timestamp || be.date || new Date().toISOString(),
            title: be.title || 'منصرف',
            category: be.category || 'other',
            amount: Number(be.amount || 0),
            currency: be.currency || 'SDG',
            exchangeRateUsed: be.exchangeRateUsed,
            exchangeRatesSnapshot: be.exchangeRatesSnapshot,
            paymentMethod: be.paymentMethod || 'cash',
            transferReference: be.transferReference || be.reference,
            receiptImage: be.receiptImage,
            beneficiary: be.beneficiary,
            notes: be.notes,
            recordedBy: be.recordedBy || be.createdBy || 'POS Operator',
            status: be.status || 'recorded',
            syncStatus: 'synced',
          }));
          setExpenses(normalizedExpenses);
          localStorage.setItem(
            getCompanyStorageKey('pos_expenses', targetCompId),
            JSON.stringify(normalizedExpenses)
          );
        }
        if (payload.accounts) {
          localStorage.setItem(
            getCompanyStorageKey('pos_accounts', targetCompId),
            JSON.stringify(payload.accounts)
          );
        }
        if (payload.journalEntries) {
          localStorage.setItem(
            getCompanyStorageKey('pos_journal_entries', targetCompId),
            JSON.stringify(payload.journalEntries)
          );
        }
      } catch {}

      setCart([]);
      setSelectedCustomer(null);
      setIsOnboardingModalOpen(false);
      playSuccessChime(settings.soundEnabled);
      triggerHaptic('success', settings.hapticsEnabled);
    },
    [
      currentCompanyId,
      currentUser,
      settings.soundEnabled,
      settings.hapticsEnabled,
      setActiveBranchId,
      setWorkspaceMode,
      setCompanies,
      setCurrentCompanyId,
      setAllBranches,
      setProducts,
      setTransactions,
      setCustomers,
      setStockMovements,
      setUnmetDemandRequests,
      setCurrencies,
      setExchangeRates,
      setExchangeRateItems,
      setExchangeRateHistory,
      setSettings,
      setUsers,
      setCurrentUserId,
      setExpenses,
      setCart,
      setSelectedCustomer,
      setIsOnboardingModalOpen,
    ]
  );

  return {
    collectClientBackupDataset,
    hydrateCompanyFromBackupPayload,
  };
}
