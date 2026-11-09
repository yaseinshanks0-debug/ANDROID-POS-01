/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback } from 'react';
import {
  AppSettings,
  Currency,
  ExchangeRateItem,
  ExchangeRateHistoryEntry,
  WorkspaceMode,
  CompanyProfile,
  POSUser,
} from '../../lib/types';
import {
  savePersistedCurrencies,
  savePersistedExchangeRates,
  savePersistedExchangeRateItems,
} from '../../lib/exchange-rate-storage';
import { playSuccessChime, triggerHaptic } from '../../lib/sound-fx';
import { api } from '../../services/api';
import { STORAGE_KEYS, getCompanyStorageKey } from '../pos-storage-helpers';

interface UseCurrenciesAndSettingsDomainParams {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  currencies: Currency[];
  setCurrencies: React.Dispatch<React.SetStateAction<Currency[]>>;
  setExchangeRates: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  setExchangeRateItems: React.Dispatch<React.SetStateAction<ExchangeRateItem[]>>;
  setExchangeRateHistory: React.Dispatch<React.SetStateAction<ExchangeRateHistoryEntry[]>>;
  workspaceMode: WorkspaceMode;
  currentCompany: CompanyProfile;
  currentCompanyId: string;
  currentUser: POSUser;
}

export function useCurrenciesAndSettingsDomain({
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
}: UseCurrenciesAndSettingsDomainParams) {
  const updateSettings = useCallback(
    (updates: Partial<AppSettings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...updates };
        if (updates.exchangeRates) {
          const mergedRates = { ...prev.exchangeRates, ...updates.exchangeRates, SDG: 1 };
          next.exchangeRates = mergedRates;
          setExchangeRates(mergedRates);
          savePersistedExchangeRates(mergedRates);
        }
        return next;
      });
      triggerHaptic('light', settings.hapticsEnabled);
    },
    [setSettings, setExchangeRates, settings.hapticsEnabled]
  );

  const syncCurrenciesState = useCallback(
    (list: Currency[]) => {
      if (!list) return;
      setCurrencies(list);
      savePersistedCurrencies(list);
    },
    [setCurrencies]
  );

  const saveCurrency = useCallback(
    async (data: {
      code: string;
      name: string;
      nameAr?: string;
      symbol: string;
      decimalPlaces?: number;
      initialRateToBase?: number;
      isBase?: boolean;
    }): Promise<Currency> => {
      const code = data.code.toUpperCase().trim();
      const name = data.name.trim() || code;
      const nameAr = data.nameAr?.trim() || name;
      const symbol = data.symbol.trim() || code;
      const decimalPlaces = data.decimalPlaces ?? 2;
      const initialRate =
        data.initialRateToBase && data.initialRateToBase > 0
          ? Number(data.initialRateToBase)
          : undefined;
      const shouldBeBase = Boolean(data.isBase) || code === 'SDG';

      let savedCurrency: Currency = {
        code,
        name,
        nameAr,
        symbol,
        decimalPlaces,
        isBase: shouldBeBase,
        isActive: true,
      };

      if (
        workspaceMode === 'PRACTICE' ||
        (currentCompany.id !== 'comp-clean-store' && currentUser.id !== 'unassigned-operator')
      ) {
        try {
          const remoteSaved = await api.saveCurrency({
            code,
            name,
            nameAr,
            symbol,
            decimalPlaces,
            initialRateToBase: !shouldBeBase ? initialRate : undefined,
          });
          savedCurrency = { ...remoteSaved, isBase: shouldBeBase, isActive: true };
        } catch {
          // Offline mode: local currency record is used directly
        }
      }

      setCurrencies((prev) => {
        const exists = prev.some((c) => c.code.toUpperCase() === code);
        let nextList = exists
          ? prev.map((c) =>
              c.code.toUpperCase() === code
                ? { ...c, ...savedCurrency, isBase: shouldBeBase, isActive: true }
                : shouldBeBase
                ? { ...c, isBase: false }
                : c
            )
          : [
              ...(shouldBeBase ? prev.map((c) => ({ ...c, isBase: false })) : prev),
              savedCurrency,
            ];
        if (!nextList.some((c) => c.isBase)) {
          const hasSdg = nextList.some((c) => c.code.toUpperCase() === 'SDG');
          if (hasSdg) {
            nextList = nextList.map((c) =>
              c.code.toUpperCase() === 'SDG' ? { ...c, isBase: true } : c
            );
          } else {
            nextList = [
              {
                code: 'SDG',
                name: 'Sudanese Pound',
                nameAr: 'جنيه سوداني',
                symbol: 'ج.س',
                decimalPlaces: 2,
                isBase: true,
                isActive: true,
              },
              ...nextList,
            ];
          }
        }
        savePersistedCurrencies(nextList);
        return nextList;
      });

      if (shouldBeBase) {
        setExchangeRates((prev) => {
          const nextMap = { ...prev, [code]: 1, SDG: prev.SDG || 1 };
          savePersistedExchangeRates(nextMap);
          return nextMap;
        });
        setSettings((prevSettings) => ({
          ...prevSettings,
          currency: code,
          exchangeRates: { ...(prevSettings.exchangeRates || {}), [code]: 1, SDG: 1 },
        }));
      } else if (initialRate && initialRate > 0) {
        const currentBase = currencies.find((c) => c.isBase);
        const targetCode = currentBase?.code || 'SDG';
        const targetSymbol = currentBase?.symbol || 'ج.س';
        const targetName = currentBase?.name || 'Sudanese Pound';
        const nowIso = new Date().toISOString();
        setExchangeRates((prev) => {
          const nextMap = { ...prev, [code]: initialRate, SDG: prev.SDG || 1 };
          savePersistedExchangeRates(nextMap);
          return nextMap;
        });
        setSettings((prevSettings) => ({
          ...prevSettings,
          exchangeRates: { ...(prevSettings.exchangeRates || {}), [code]: initialRate, SDG: 1 },
        }));

        setExchangeRateItems((prevItems) => {
          const newItem: ExchangeRateItem = {
            id: `rate-${code.toLowerCase()}-${targetCode.toLowerCase()}-${Date.now()}`,
            sourceCurrency: code,
            targetCurrency: targetCode,
            rate: initialRate,
            inverseRate: Math.round((1 / initialRate) * 1000000) / 1000000,
            effectiveFrom: nowIso,
            expiryDate: null,
            isActive: true,
            sourceSymbol: symbol,
            targetSymbol,
            sourceName: name,
            targetName,
          };
          const exists = prevItems.some(
            (i) =>
              i.sourceCurrency.toUpperCase() === code &&
              i.targetCurrency.toUpperCase() === targetCode
          );
          const nextItems = exists
            ? prevItems.map((i) =>
                i.sourceCurrency.toUpperCase() === code &&
                i.targetCurrency.toUpperCase() === targetCode
                  ? { ...i, ...newItem }
                  : i
              )
            : [...prevItems, newItem];
          savePersistedExchangeRateItems(nextItems);
          return nextItems;
        });
      }

      return savedCurrency;
    },
    [
      currencies,
      workspaceMode,
      currentCompany.id,
      currentUser.id,
      setCurrencies,
      setExchangeRates,
      setSettings,
      setExchangeRateItems,
    ]
  );

  const removeCurrency = useCallback(
    async (code: string): Promise<void> => {
      const cleanCode = code.toUpperCase().trim();
      if (!cleanCode) return;

      if (
        workspaceMode === 'PRACTICE' ||
        (currentCompany.id !== 'comp-clean-store' && currentUser.id !== 'unassigned-operator')
      ) {
        try {
          if (cleanCode !== 'SDG') {
            await api.deleteCurrency(cleanCode);
          }
        } catch {
          // Offline mode: local removal proceeds cleanly
        }
      }

      setCurrencies((prev) => {
        let nextList = prev.filter((c) => c.code.toUpperCase() !== cleanCode);
        if (nextList.length > 0 && !nextList.some((c) => c.isBase)) {
          nextList = nextList.map((c, idx) => (idx === 0 ? { ...c, isBase: true } : c));
        }
        savePersistedCurrencies(nextList);
        return nextList;
      });

      setExchangeRateItems((prev) => {
        const nextItems = prev.filter(
          (r) =>
            r.sourceCurrency.toUpperCase() !== cleanCode &&
            r.targetCurrency.toUpperCase() !== cleanCode
        );
        savePersistedExchangeRateItems(nextItems);
        return nextItems;
      });

      setSettings((prev) => {
        if (prev.currency === cleanCode) {
          const remaining = currencies.filter((c) => c.code.toUpperCase() !== cleanCode);
          return {
            ...prev,
            currency: remaining[0]?.code || 'SDG',
          };
        }
        return prev;
      });
    },
    [
      currencies,
      workspaceMode,
      currentCompany.id,
      currentUser.id,
      setCurrencies,
      setExchangeRateItems,
      setSettings,
    ]
  );

  const clearAllCurrencies = useCallback(() => {
    setCurrencies([]);
    setExchangeRateItems([]);
    setExchangeRates({ SDG: 1 });
    setExchangeRateHistory([]);
    savePersistedCurrencies([]);
    savePersistedExchangeRateItems([]);
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENCIES);
      localStorage.removeItem(STORAGE_KEYS.EXCHANGE_RATES);
      localStorage.removeItem(STORAGE_KEYS.EXCHANGE_RATE_ITEMS);
      localStorage.removeItem(STORAGE_KEYS.RATE_HISTORY);
      localStorage.removeItem(getCompanyStorageKey(STORAGE_KEYS.CURRENCIES, currentCompanyId));
      localStorage.removeItem(getCompanyStorageKey(STORAGE_KEYS.EXCHANGE_RATES, currentCompanyId));
      localStorage.removeItem(
        getCompanyStorageKey(STORAGE_KEYS.EXCHANGE_RATE_ITEMS, currentCompanyId)
      );
      localStorage.removeItem(getCompanyStorageKey(STORAGE_KEYS.RATE_HISTORY, currentCompanyId));
    } catch {}
    playSuccessChime(settings.soundEnabled);
    triggerHaptic('heavy', settings.hapticsEnabled);
  }, [
    currentCompanyId,
    settings.soundEnabled,
    settings.hapticsEnabled,
    setCurrencies,
    setExchangeRateItems,
    setExchangeRates,
    setExchangeRateHistory,
  ]);

  const setBaseCurrencyCode = useCallback(
    (code: string) => {
      const cleanCode = code.toUpperCase().trim();
      if (!cleanCode) return;
      setCurrencies((prev) => {
        const nextList = prev.map((c) => ({
          ...c,
          isBase: c.code.toUpperCase() === cleanCode,
        }));
        savePersistedCurrencies(nextList);
        return nextList;
      });
      setSettings((prev) => ({
        ...prev,
        currency: cleanCode,
      }));
      triggerHaptic('light', settings.hapticsEnabled);
    },
    [setCurrencies, setSettings, settings.hapticsEnabled]
  );

  const syncExchangeRatesState = useCallback(
    (items: ExchangeRateItem[]) => {
      setExchangeRateItems(items);
      savePersistedExchangeRateItems(items);

      const ratesPatch: Record<string, number> = { SDG: 1 };
      for (const r of items) {
        if (r.targetCurrency === 'SDG' && r.rate > 0) {
          ratesPatch[r.sourceCurrency.toUpperCase()] = r.rate;
        }
      }

      setExchangeRates((prevMap) => {
        const nextMap: Record<string, number> = { ...prevMap, ...ratesPatch, SDG: 1 };
        savePersistedExchangeRates(nextMap);
        return nextMap;
      });

      setSettings((prevSettings) => ({
        ...prevSettings,
        exchangeRates: { ...(prevSettings.exchangeRates || {}), ...ratesPatch, SDG: 1 },
      }));
    },
    [setExchangeRateItems, setExchangeRates, setSettings]
  );

  const updateExchangeRate = useCallback(
    async (data: {
      sourceCurrency: string;
      targetCurrency: string;
      rate: number;
      effectiveFrom?: string;
      expiryDate?: string | null;
    }): Promise<ExchangeRateItem> => {
      const source = data.sourceCurrency.toUpperCase().trim();
      const target = data.targetCurrency.toUpperCase().trim();
      const rateNum = Number(data.rate);
      const effectiveIso = data.effectiveFrom || new Date().toISOString();

      let savedRecord: ExchangeRateItem;
      try {
        savedRecord = await api.saveExchangeRate({
          sourceCurrency: source,
          targetCurrency: target,
          rate: rateNum,
          effectiveFrom: effectiveIso,
          expiryDate: data.expiryDate ?? null,
        });
      } catch {
        savedRecord = {
          id: `rate-${source.toLowerCase()}-${target.toLowerCase()}-${Date.now()}`,
          sourceCurrency: source,
          targetCurrency: target,
          rate: rateNum,
          inverseRate: rateNum > 0 ? Math.round((1 / rateNum) * 1000000) / 1000000 : 0,
          effectiveFrom: effectiveIso,
          expiryDate: data.expiryDate ?? null,
          isActive: true,
        };
      }

      const computedRateToSdg =
        target === 'SDG'
          ? savedRecord.rate
          : source === 'SDG' && savedRecord.rate > 0
          ? 1 / savedRecord.rate
          : null;

      if (computedRateToSdg && computedRateToSdg > 0) {
        const foreignCode = target === 'SDG' ? source : target;
        setExchangeRates((prev) => {
          const prevRate = Number(prev[foreignCode] || computedRateToSdg);
          if (Math.abs(computedRateToSdg - prevRate) > 0.0001) {
            const pct =
              prevRate > 0
                ? Math.round(((computedRateToSdg - prevRate) / prevRate) * 1000) / 10
                : 0;
            setExchangeRateHistory((prevHist) => [
              ...prevHist,
              {
                id: `hist-${foreignCode.toLowerCase()}-${Date.now()}`,
                currency: foreignCode,
                previousRate: prevRate,
                newRate: computedRateToSdg,
                changePercent: pct,
                timestamp: effectiveIso,
              },
            ]);
          }
          const nextMap = { ...prev, [foreignCode]: computedRateToSdg, SDG: 1 };
          savePersistedExchangeRates(nextMap);
          return nextMap;
        });
        setSettings((prevSettings) => ({
          ...prevSettings,
          exchangeRates: {
            ...(prevSettings.exchangeRates || {}),
            [foreignCode]: computedRateToSdg,
            SDG: 1,
          },
        }));
      }

      setExchangeRateItems((prevItems) => {
        const exists = prevItems.some(
          (i) =>
            i.sourceCurrency === savedRecord.sourceCurrency &&
            i.targetCurrency === savedRecord.targetCurrency
        );
        const nextItems = exists
          ? prevItems.map((i) =>
              i.sourceCurrency === savedRecord.sourceCurrency &&
              i.targetCurrency === savedRecord.targetCurrency
                ? { ...i, ...savedRecord }
                : i
            )
          : [...prevItems, savedRecord];
        savePersistedExchangeRateItems(nextItems);
        return nextItems;
      });

      return savedRecord;
    },
    [setExchangeRates, setExchangeRateHistory, setSettings, setExchangeRateItems]
  );

  return {
    updateSettings,
    syncCurrenciesState,
    saveCurrency,
    removeCurrency,
    clearAllCurrencies,
    setBaseCurrencyCode,
    syncExchangeRatesState,
    updateExchangeRate,
  };
}
