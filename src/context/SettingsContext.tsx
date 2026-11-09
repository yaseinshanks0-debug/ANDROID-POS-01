/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext } from 'react';
import {
  AppSettings,
  Currency,
  ExchangeRateItem,
  ExchangeRateHistoryEntry,
} from '../lib/types';

export interface SettingsContextType {
  settings: AppSettings;
  currencies: Currency[];
  exchangeRates: Record<string, number>;
  exchangeRateItems: ExchangeRateItem[];
  exchangeRateHistory: ExchangeRateHistoryEntry[];
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
}

export const SettingsContext = createContext<SettingsContextType | null>(null);

export function useSettingsContext(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsContext must be used within a SettingsContext.Provider');
  }
  return context;
}
