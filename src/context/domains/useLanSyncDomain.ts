/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  LanSyncConfig,
  LanConnectedDeviceInfo,
  LanSyncEventRecord,
  LanNetworkAddressItem,
  loadLanSyncConfig,
  saveLanSyncConfig,
  resolveEffectiveLanBaseUrl,
} from '../../lib/lan-sync-client';
import {
  ActiveUserSession,
  AppSettings,
  BranchRecord,
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
} from '../../lib/types';
import { UnmetDemandRequestRecord } from '../../analytics/analytics.types';
import { getCompanyStorageKey } from '../pos-storage-helpers';

interface UseLanSyncDomainParams {
  currentCompany: CompanyProfile;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  deletedProductIdsRef: React.MutableRefObject<Set<string>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  expenses: ExpenseRecord[];
  setExpenses: React.Dispatch<React.SetStateAction<ExpenseRecord[]>>;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  deletedCustomerIdsRef: React.MutableRefObject<Set<string>>;
  stockMovements: StockMovement[];
  setStockMovements: React.Dispatch<React.SetStateAction<StockMovement[]>>;
  unmetDemandRequests: UnmetDemandRequestRecord[];
  setUnmetDemandRequests: React.Dispatch<React.SetStateAction<UnmetDemandRequestRecord[]>>;
  currencies: Currency[];
  setCurrencies: React.Dispatch<React.SetStateAction<Currency[]>>;
  exchangeRates: Record<string, number>;
  setExchangeRates: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  exchangeRateItems: ExchangeRateItem[];
  setExchangeRateItems: React.Dispatch<React.SetStateAction<ExchangeRateItem[]>>;
  exchangeRateHistory: ExchangeRateHistoryEntry[];
  branches: BranchRecord[];
  users: POSUser[];
  activeSessions: ActiveUserSession[];
  setLastSyncedAt: React.Dispatch<React.SetStateAction<Date | null>>;
}

export function useLanSyncDomain({
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
}: UseLanSyncDomainParams) {
  const [lanSyncConfig, setLanSyncConfig] = useState<LanSyncConfig>(() => loadLanSyncConfig());
  const [lanConnectionStatus, setLanConnectionStatus] = useState<
    'connected' | 'connecting' | 'disconnected' | 'unconfigured'
  >('connecting');
  const [lanConnectedDevices, setLanConnectedDevices] = useState<LanConnectedDeviceInfo[]>([]);
  const [lanRecentEvents, setLanRecentEvents] = useState<LanSyncEventRecord[]>([]);
  const [lanNetworkAddresses, setLanNetworkAddresses] = useState<LanNetworkAddressItem[]>([]);
  const [lanPrimaryHostUrl, setLanPrimaryHostUrl] = useState<string>('');
  const [lanLastSyncError, setLanLastSyncError] = useState<string | null>(null);

  const isApplyingRemoteLanSyncRef = useRef<boolean>(false);
  const lanSyncRevisionRef = useRef<number>(0);
  const lanPushDebounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lanHasInitialHandshakedRef = useRef<boolean>(false);

  const updateLanSyncConfig = useCallback((updates: Partial<LanSyncConfig>): LanSyncConfig => {
    const saved = saveLanSyncConfig(updates);
    setLanSyncConfig(saved);
    return saved;
  }, []);

  const applyIncomingLanSyncState = useCallback(
    (remoteState: any, sourceDeviceId?: string) => {
      if (!remoteState || typeof remoteState !== 'object') return;
      if (sourceDeviceId && sourceDeviceId === lanSyncConfig.deviceId) {
        if (typeof remoteState.revision === 'number') {
          lanSyncRevisionRef.current = Math.max(lanSyncRevisionRef.current, remoteState.revision);
        }
        return;
      }

      const incomingRev = Number(remoteState.revision || 0);
      if (incomingRev > 0 && incomingRev < lanSyncRevisionRef.current) {
        return;
      }

      isApplyingRemoteLanSyncRef.current = true;
      try {
        if (incomingRev > 0) {
          lanSyncRevisionRef.current = incomingRev;
        }

        const deletedProdSet = new Set<string>(
          Array.isArray(remoteState.deletedProductIds) ? remoteState.deletedProductIds : []
        );
        deletedProdSet.forEach((id) => deletedProductIdsRef.current.add(id));

        const deletedCustSet = new Set<string>(
          Array.isArray(remoteState.deletedCustomerIds) ? remoteState.deletedCustomerIds : []
        );
        deletedCustSet.forEach((id) => deletedCustomerIdsRef.current.add(id));

        if (Array.isArray(remoteState.products)) {
          setProducts((prev) => {
            const byId = new Map<string, Product>();
            for (const p of prev) {
              if (p?.id && !deletedProdSet.has(p.id)) byId.set(p.id, p);
            }
            for (const inc of remoteState.products as Product[]) {
              if (!inc?.id || deletedProdSet.has(inc.id)) continue;
              const ex = byId.get(inc.id);
              if (!ex) {
                byId.set(inc.id, inc);
              } else {
                const exTime = Date.parse(ex.updatedAt || ex.createdAt || '') || 0;
                const incTime = Date.parse(inc.updatedAt || inc.createdAt || '') || 0;
                if (incTime >= exTime) {
                  byId.set(inc.id, { ...ex, ...inc });
                }
              }
            }
            return Array.from(byId.values());
          });
        }

        if (Array.isArray(remoteState.transactions)) {
          setTransactions((prev) => {
            const byId = new Map<string, Transaction>();
            for (const t of prev) {
              if (t?.id) byId.set(t.id, t);
            }
            for (const inc of remoteState.transactions as Transaction[]) {
              if (!inc?.id) continue;
              const ex = byId.get(inc.id);
              if (!ex) {
                byId.set(inc.id, { ...inc, syncStatus: 'synced' });
              } else {
                const exPaid = Number(ex.amountPaid || 0);
                const incPaid = Number(inc.amountPaid || 0);
                if (
                  inc.status === 'voided' ||
                  incPaid >= exPaid ||
                  inc.fulfillmentStatus !== ex.fulfillmentStatus
                ) {
                  byId.set(inc.id, { ...ex, ...inc, syncStatus: 'synced' });
                }
              }
            }
            return Array.from(byId.values()).sort(
              (a, b) => (Date.parse(b.timestamp || '') || 0) - (Date.parse(a.timestamp || '') || 0)
            );
          });
        }

        if (Array.isArray(remoteState.expenses)) {
          setExpenses((prev) => {
            const byId = new Map<string, ExpenseRecord>();
            for (const e of prev) {
              if (e?.id) byId.set(e.id, e);
            }
            for (const inc of remoteState.expenses as ExpenseRecord[]) {
              if (!inc?.id) continue;
              const ex = byId.get(inc.id);
              if (!ex || inc.status === 'voided') {
                byId.set(inc.id, { ...inc, syncStatus: 'synced' });
              } else {
                byId.set(inc.id, { ...ex, ...inc, syncStatus: 'synced' });
              }
            }
            return Array.from(byId.values()).sort(
              (a, b) => (Date.parse(b.timestamp || '') || 0) - (Date.parse(a.timestamp || '') || 0)
            );
          });
        }

        if (Array.isArray(remoteState.customers)) {
          setCustomers((prev) => {
            const byId = new Map<string, Customer>();
            for (const c of prev) {
              if (c?.id && !deletedCustSet.has(c.id)) byId.set(c.id, c);
            }
            for (const inc of remoteState.customers as Customer[]) {
              if (!inc?.id || deletedCustSet.has(inc.id)) continue;
              const ex = byId.get(inc.id);
              if (!ex) {
                byId.set(inc.id, inc);
              } else {
                byId.set(inc.id, { ...ex, ...inc });
              }
            }
            return Array.from(byId.values());
          });
        }

        if (Array.isArray(remoteState.stockMovements)) {
          setStockMovements((prev) => {
            const byId = new Map<string, StockMovement>();
            for (const m of prev) {
              if (m?.id) byId.set(m.id, m);
            }
            for (const inc of remoteState.stockMovements as StockMovement[]) {
              if (inc?.id) byId.set(inc.id, inc);
            }
            return Array.from(byId.values()).sort(
              (a, b) => (Date.parse(b.timestamp || '') || 0) - (Date.parse(a.timestamp || '') || 0)
            );
          });
        }

        if (Array.isArray(remoteState.unmetDemandRequests)) {
          setUnmetDemandRequests((prev) => {
            const byId = new Map<string, UnmetDemandRequestRecord>();
            for (const r of prev) {
              if (r?.id) byId.set(r.id, r);
            }
            for (const inc of remoteState.unmetDemandRequests as UnmetDemandRequestRecord[]) {
              if (inc?.id) byId.set(inc.id, inc);
            }
            return Array.from(byId.values());
          });
        }

        if (Array.isArray(remoteState.currencies) && remoteState.currencies.length > 0) {
          setCurrencies((prev) => {
            const byCode = new Map<string, Currency>();
            for (const c of prev) {
              if (c?.code) byCode.set(c.code.toUpperCase(), c);
            }
            for (const inc of remoteState.currencies as Currency[]) {
              if (inc?.code) byCode.set(inc.code.toUpperCase(), inc);
            }
            return Array.from(byCode.values());
          });
        }

        if (remoteState.exchangeRates && typeof remoteState.exchangeRates === 'object') {
          setExchangeRates((prev) => ({
            ...prev,
            ...remoteState.exchangeRates,
            SDG: 1,
          }));
        }

        if (
          Array.isArray(remoteState.exchangeRateItems) &&
          remoteState.exchangeRateItems.length > 0
        ) {
          setExchangeRateItems((prev) => {
            const byKey = new Map<string, ExchangeRateItem>();
            for (const item of prev) {
              if (item?.sourceCurrency && item?.targetCurrency) {
                byKey.set(`${item.sourceCurrency}->${item.targetCurrency}`, item);
              }
            }
            for (const inc of remoteState.exchangeRateItems as ExchangeRateItem[]) {
              if (inc?.sourceCurrency && inc?.targetCurrency) {
                byKey.set(`${inc.sourceCurrency}->${inc.targetCurrency}`, inc);
              }
            }
            return Array.from(byKey.values());
          });
        }

        if (Array.isArray(remoteState.categories) && remoteState.categories.length > 0) {
          try {
            const catKey = getCompanyStorageKey('pos_categories', currentCompany.id);
            const rawExisting =
              localStorage.getItem(catKey) || localStorage.getItem('pos_categories');
            const existingCats: any[] = rawExisting ? JSON.parse(rawExisting) : [];
            const byName = new Map<string, any>();
            for (const c of existingCats) {
              const nameVal = typeof c === 'string' ? c : c?.name || c?.id || '';
              const k = String(nameVal).trim().toLowerCase();
              if (k) byName.set(k, typeof c === 'string' ? { id: k, name: c, nameAr: c } : c);
            }
            for (const inc of remoteState.categories) {
              const nameVal = typeof inc === 'string' ? inc : inc?.name || inc?.id || '';
              const k = String(nameVal).trim().toLowerCase();
              if (k) {
                const incObj = typeof inc === 'string' ? { id: k, name: inc, nameAr: inc } : inc;
                byName.set(k, { ...(byName.get(k) || {}), ...incObj });
              }
            }
            const mergedCatsJson = JSON.stringify(Array.from(byName.values()));
            localStorage.setItem(catKey, mergedCatsJson);
            localStorage.setItem('pos_categories', mergedCatsJson);
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('pos:categories-updated'));
            }
          } catch {}
        }

        if (remoteState.settings && typeof remoteState.settings === 'object') {
          setSettings((prev) => ({
            ...prev,
            storeName: remoteState.settings.storeName || prev.storeName,
            storeNameAr: remoteState.settings.storeNameAr || prev.storeNameAr,
            currency: remoteState.settings.currency || prev.currency,
            taxRatePercent:
              typeof remoteState.settings.taxRatePercent === 'number'
                ? remoteState.settings.taxRatePercent
                : prev.taxRatePercent,
            exchangeRates: {
              ...(prev.exchangeRates || {}),
              ...(remoteState.settings.exchangeRates || {}),
              ...(remoteState.exchangeRates || {}),
              SDG: 1,
            },
          }));
        }

        setLastSyncedAt(new Date());
      } finally {
        setTimeout(() => {
          isApplyingRemoteLanSyncRef.current = false;
        }, 400);
      }
    },
    [
      lanSyncConfig.deviceId,
      currentCompany.id,
      deletedProductIdsRef,
      deletedCustomerIdsRef,
      setProducts,
      setTransactions,
      setExpenses,
      setCustomers,
      setStockMovements,
      setUnmetDemandRequests,
      setCurrencies,
      setExchangeRates,
      setExchangeRateItems,
      setSettings,
      setLastSyncedAt,
    ]
  );

  const pushLiveLanSyncNow = useCallback(
    async (summaryAr?: string, summaryEn?: string): Promise<boolean> => {
      const baseUrl = resolveEffectiveLanBaseUrl(lanSyncConfig);
      if (baseUrl === null) {
        setLanConnectionStatus('unconfigured');
        return false;
      }

      let localCategories: any[] = [];
      try {
        const rawCats = localStorage.getItem(
          getCompanyStorageKey('pos_categories', currentCompany.id)
        );
        if (rawCats) localCategories = JSON.parse(rawCats);
      } catch {}

      try {
        const res = await fetch(`${baseUrl}/api/lan-sync/push`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            companyId: currentCompany.id,
            deviceId: lanSyncConfig.deviceId,
            deviceName: lanSyncConfig.deviceName,
            platform: lanSyncConfig.platform,
            summaryAr: summaryAr || 'مزامنة حية للعمليات عبر الواي فاي',
            summaryEn: summaryEn || 'Live Wi-Fi LAN operational sync',
            snapshot: {
              companyProfile: currentCompany,
              settings,
              products,
              deletedProductIds: Array.from(deletedProductIdsRef.current),
              transactions: transactions.map((t) => ({ ...t, syncStatus: 'synced' })),
              expenses: expenses.map((e) => ({ ...e, syncStatus: 'synced' })),
              customers,
              deletedCustomerIds: Array.from(deletedCustomerIdsRef.current),
              stockMovements,
              unmetDemandRequests,
              currencies,
              exchangeRates,
              exchangeRateItems,
              exchangeRateHistory,
              branches,
              users,
              activeSessions,
              categories: localCategories,
            },
          }),
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        if (typeof data?.revision === 'number') {
          lanSyncRevisionRef.current = Math.max(lanSyncRevisionRef.current, data.revision);
        }
        if (data?.state) {
          const remoteProdsLen = Array.isArray(data.state.products)
            ? data.state.products.length
            : 0;
          const remoteTxLen = Array.isArray(data.state.transactions)
            ? data.state.transactions.length
            : 0;
          if (remoteProdsLen !== products.length || remoteTxLen !== transactions.length) {
            applyIncomingLanSyncState(data.state);
          }
        }
        if (Array.isArray(data?.connectedDevices)) {
          setLanConnectedDevices(data.connectedDevices);
        }
        if (Array.isArray(data?.state?.recentEvents)) {
          setLanRecentEvents(data.state.recentEvents);
        } else if (data?.event) {
          setLanRecentEvents((prev) => [
            data.event,
            ...prev.filter((e) => e.id !== data.event.id).slice(0, 29),
          ]);
        }
        setLanConnectionStatus('connected');
        setLanLastSyncError(null);
        setLastSyncedAt(new Date());
        return true;
      } catch (err: any) {
        setLanConnectionStatus('disconnected');
        setLanLastSyncError(err?.message || 'LAN host unreachable');
        return false;
      }
    },
    [
      lanSyncConfig,
      currentCompany,
      settings,
      products,
      deletedProductIdsRef,
      transactions,
      expenses,
      customers,
      deletedCustomerIdsRef,
      stockMovements,
      unmetDemandRequests,
      currencies,
      exchangeRates,
      exchangeRateItems,
      exchangeRateHistory,
      branches,
      users,
      activeSessions,
      applyIncomingLanSyncState,
      setLastSyncedAt,
    ]
  );

  useEffect(() => {
    if (!lanSyncConfig.enabled) {
      setLanConnectionStatus('disconnected');
      return;
    }

    const baseUrl = resolveEffectiveLanBaseUrl(lanSyncConfig);
    if (baseUrl === null) {
      setLanConnectionStatus('unconfigured');
      return;
    }

    setLanConnectionStatus('connecting');
    let eventSource: EventSource | null = null;
    let isDisposed = false;

    const streamParams = new URLSearchParams({
      companyId: currentCompany.id,
      deviceId: lanSyncConfig.deviceId,
      deviceName: lanSyncConfig.deviceName,
      platform: lanSyncConfig.platform,
    });

    try {
      eventSource = new EventSource(`${baseUrl}/api/lan-sync/stream?${streamParams.toString()}`);

      eventSource.onopen = () => {
        if (isDisposed) return;
        setLanConnectionStatus('connected');
        setLanLastSyncError(null);
      };

      eventSource.onmessage = (ev) => {
        if (isDisposed || !ev.data) return;
        try {
          const payload = JSON.parse(ev.data);
          setLanConnectionStatus('connected');
          setLanLastSyncError(null);

          if (payload.type === 'init' || payload.type === 'sync_update') {
            if (payload.state) {
              applyIncomingLanSyncState(payload.state, payload.sourceDeviceId);
            }
            if (Array.isArray(payload.connectedDevices)) {
              setLanConnectedDevices(payload.connectedDevices);
            }
            if (Array.isArray(payload.recentEvents)) {
              setLanRecentEvents(payload.recentEvents);
            } else if (payload.event) {
              setLanRecentEvents((prev) => [
                payload.event,
                ...prev.filter((e) => e.id !== payload.event.id).slice(0, 29),
              ]);
            }
          } else if (payload.type === 'presence') {
            if (Array.isArray(payload.connectedDevices)) {
              setLanConnectedDevices(payload.connectedDevices);
            }
          }
        } catch {}
      };

      eventSource.onerror = () => {
        if (isDisposed) return;
      };
    } catch {}

    const fetchLanInfoAndState = async () => {
      if (isDisposed) return;
      try {
        const [infoRes, stateRes] = await Promise.all([
          fetch(`${baseUrl}/api/lan-sync/info?companyId=${encodeURIComponent(currentCompany.id)}`),
          fetch(
            `${baseUrl}/api/lan-sync/state?companyId=${encodeURIComponent(
              currentCompany.id
            )}&sinceRevision=${lanSyncRevisionRef.current}&deviceId=${encodeURIComponent(
              lanSyncConfig.deviceId
            )}&deviceName=${encodeURIComponent(
              lanSyncConfig.deviceName
            )}&platform=${encodeURIComponent(lanSyncConfig.platform)}`
          ),
        ]);

        if (infoRes.ok) {
          const infoData = await infoRes.json();
          if (Array.isArray(infoData?.addresses)) {
            setLanNetworkAddresses(infoData.addresses);
          }
          if (infoData?.primaryUrl) {
            setLanPrimaryHostUrl(infoData.primaryUrl);
          }
          if (Array.isArray(infoData?.connectedDevices)) {
            setLanConnectedDevices(infoData.connectedDevices);
          }
          if (Array.isArray(infoData?.recentEvents)) {
            setLanRecentEvents(infoData.recentEvents);
          }
        }

        if (stateRes.ok) {
          const stateData = await stateRes.json();
          setLanConnectionStatus('connected');
          setLanLastSyncError(null);
          if (stateData?.hasUpdates && stateData?.state) {
            applyIncomingLanSyncState(stateData.state);
          }
          if (Array.isArray(stateData?.connectedDevices)) {
            setLanConnectedDevices(stateData.connectedDevices);
          }
        } else {
          setLanConnectionStatus('disconnected');
        }
      } catch (err: any) {
        if (!isDisposed) {
          setLanConnectionStatus('disconnected');
          setLanLastSyncError(err?.message || 'Unable to reach Wi-Fi LAN Host');
        }
      }
    };

    fetchLanInfoAndState();
    const pollInterval = setInterval(fetchLanInfoAndState, 4000);

    return () => {
      isDisposed = true;
      clearInterval(pollInterval);
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [
    lanSyncConfig.enabled,
    lanSyncConfig.hostUrl,
    lanSyncConfig.deviceId,
    lanSyncConfig.deviceName,
    lanSyncConfig.platform,
    currentCompany.id,
    applyIncomingLanSyncState,
  ]);

  const lastLanStateFingerprintRef = useRef<string>('');

  useEffect(() => {
    if (!lanSyncConfig.enabled || !lanSyncConfig.autoSyncOnEveryAction) return;

    const fingerprint = JSON.stringify({
      c: currentCompany.id,
      p: products.map((p) => `${p.id}:${p.stock}:${p.sellingPrice}:${p.updatedAt || ''}`),
      t: transactions.map(
        (t) => `${t.id}:${t.status}:${t.amountPaid || 0}:${t.fulfillmentStatus || ''}`
      ),
      e: expenses.map((e) => `${e.id}:${e.status}:${e.amount}`),
      cu: customers.map((c) => `${c.id}:${c.totalDebt || 0}:${c.totalSpent || 0}`),
      m: stockMovements.length,
      u: unmetDemandRequests.length,
      cur: currencies.map((c) => `${c.code}:${c.isBase}`),
      r: exchangeRates,
      b: branches.length,
      usr: users.length,
    });

    if (isApplyingRemoteLanSyncRef.current) {
      lastLanStateFingerprintRef.current = fingerprint;
      return;
    }

    if (fingerprint === lastLanStateFingerprintRef.current) {
      return;
    }
    lastLanStateFingerprintRef.current = fingerprint;

    const baseUrl = resolveEffectiveLanBaseUrl(lanSyncConfig);
    if (baseUrl === null) return;

    if (!lanHasInitialHandshakedRef.current) {
      lanHasInitialHandshakedRef.current = true;
      const initTimer = setTimeout(() => {
        if (!isApplyingRemoteLanSyncRef.current) {
          pushLiveLanSyncNow('ربط ومزامنة أولية عبر الواي فاي', 'Initial Wi-Fi LAN handshake sync');
        }
      }, 600);
      return () => clearTimeout(initTimer);
    }

    if (lanPushDebounceTimerRef.current) {
      clearTimeout(lanPushDebounceTimerRef.current);
    }

    lanPushDebounceTimerRef.current = setTimeout(() => {
      if (!isApplyingRemoteLanSyncRef.current) {
        pushLiveLanSyncNow();
      }
    }, 350);

    return () => {
      if (lanPushDebounceTimerRef.current) {
        clearTimeout(lanPushDebounceTimerRef.current);
      }
    };
  }, [
    currentCompany.id,
    products,
    transactions,
    expenses,
    customers,
    stockMovements,
    unmetDemandRequests,
    currencies,
    exchangeRates,
    exchangeRateItems,
    branches,
    users,
    settings,
    lanSyncConfig.enabled,
    lanSyncConfig.autoSyncOnEveryAction,
    pushLiveLanSyncNow,
  ]);

  return {
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
  };
}
