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
import type {
  SaveCurrencyInput,
  SaveCurrencyResult,
  UpdateExchangeRateInput,
  UpdateExchangeRateResult,
} from './domains/useCurrenciesAndSettingsDomain';

export interface SettingsContextType {
  settings: AppSettings;
  currencies: Currency[];
  exchangeRates: Record<string, number>;
  exchangeRateItems: ExchangeRateItem[];
  exchangeRateHistory: ExchangeRateHistoryEntry[];
  updateSettings: (updates: Partial<AppSettings>) => void;
  saveCurrency: (data: SaveCurrencyInput) => Promise<SaveCurrencyResult>;
  removeCurrency: (code: string) => Promise<void>;
  clearAllCurrencies: () => void;
  setBaseCurrencyCode: (code: string) => void;
  syncCurrenciesState: (list: Currency[]) => void;
  updateExchangeRate: (data: UpdateExchangeRateInput) => Promise<UpdateExchangeRateResult>;
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
