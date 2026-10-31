/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  loadPersistedExchangeRates,
  savePersistedExchangeRates,
  loadPersistedExchangeRateItems,
  savePersistedExchangeRateItems,
  loadPersistedCurrencies,
  savePersistedCurrencies,
  reconcileCurrenciesWithPersisted,
  reconcileRatesWithPersisted,
  mergeEditFormsState,
  resolveCurrencyInput,
  EXCHANGE_RATES_STORAGE_KEY,
  RateEditFormState,
} from './exchange-rate-storage';
import { ExchangeRateItem } from './types';

function createMemoryStorage() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, val: string) => {
      store.set(key, val);
    },
    clear: () => store.clear(),
  };
}

test('exchange-rate-storage: saves and loads exchange rates from LocalStorage', () => {
  const storage = createMemoryStorage();

  // Initial load without saved key returns defaults
  const initial = loadPersistedExchangeRates(storage);
  assert.equal(initial.SDG, 1);
  assert.equal(initial.USD, 2700);

  // Save updated USD and custom EGP rate
  savePersistedExchangeRates({ ...initial, USD: 4150, EGP: 58.5 }, storage);

  const raw = storage.getItem(EXCHANGE_RATES_STORAGE_KEY);
  assert.ok(raw, 'Should write JSON string to LocalStorage');

  const reloaded = loadPersistedExchangeRates(storage);
  assert.equal(reloaded.USD, 4150);
  assert.equal(reloaded.EGP, 58.5);
  assert.equal(reloaded.SDG, 1);
});

test('exchange-rate-storage: saves and loads ExchangeRateItem list from LocalStorage', () => {
  const storage = createMemoryStorage();
  const sampleItems: ExchangeRateItem[] = [
    {
      id: 'rate-usd-sdg-custom',
      sourceCurrency: 'USD',
      targetCurrency: 'SDG',
      rate: 4150,
      inverseRate: 1 / 4150,
      effectiveFrom: '2026-10-31T08:00:00.000Z',
      isActive: true,
    },
  ];

  savePersistedExchangeRateItems(sampleItems, storage);
  const loaded = loadPersistedExchangeRateItems(storage);
  assert.equal(loaded.length, 1);
  assert.equal(loaded[0].rate, 4150);
});

test('exchange-rate-storage: reconcileRatesWithPersisted preserves newer LocalStorage rates and newly added currencies', () => {
  const remoteSeedItems: ExchangeRateItem[] = [
    {
      id: 'rate-usd-sdg-initial',
      sourceCurrency: 'USD',
      targetCurrency: 'SDG',
      rate: 2700,
      inverseRate: 1 / 2700,
      effectiveFrom: '2026-01-01T00:00:00.000Z',
      isActive: true,
    },
  ];

  const persistedMap = { SDG: 1, USD: 4200, EGP: 58 };
  const activeCurrencies = [
    { code: 'SDG', name: 'Sudanese Pound', nameAr: 'جنيه سوداني', symbol: 'ج.س', decimalPlaces: 2, isBase: true, isActive: true },
    { code: 'USD', name: 'US Dollar', nameAr: 'دولار أمريكي', symbol: '$', decimalPlaces: 2, isBase: false, isActive: true },
    { code: 'EGP', name: 'Egyptian Pound', nameAr: 'جنيه مصري', symbol: 'ج.م', decimalPlaces: 2, isBase: false, isActive: true },
  ];

  const reconciled = reconcileRatesWithPersisted(remoteSeedItems, persistedMap, [], activeCurrencies);
  assert.equal(reconciled[0].rate, 4200, 'Should preserve user LocalStorage rate over initial seed default');
  const egpItem = reconciled.find((r) => r.sourceCurrency === 'EGP');
  assert.ok(egpItem, 'Newly added active currency EGP should be included in reconciled rate items');
  assert.equal(egpItem?.rate, 58);
});

test('exchange-rate-storage: resolveCurrencyInput resolves English codes, Arabic names, and custom Arabic inputs', () => {
  // 1. Arabic name only (no English code or symbol provided)
  const fromArabic = resolveCurrencyInput({ nameAr: 'جنيه مصري' });
  assert.equal(fromArabic.code, 'EGP');
  assert.equal(fromArabic.name, 'Egyptian Pound');
  assert.equal(fromArabic.symbol, 'ج.م');
  assert.equal(fromArabic.suggestedRate, 55);

  // 2. Code only (no English name, Arabic name, or symbol provided)
  const fromCodeOnly = resolveCurrencyInput({ code: 'QAR' });
  assert.equal(fromCodeOnly.code, 'QAR');
  assert.equal(fromCodeOnly.name, 'Qatari Riyal');
  assert.equal(fromCodeOnly.nameAr, 'ريال قطري');
  assert.equal(fromCodeOnly.symbol, 'ر.ق');

  // 3. Custom Arabic name not in presets
  const customArabic = resolveCurrencyInput({ nameAr: 'فرنك افريقي' });
  assert.ok(customArabic.code.length >= 2 && customArabic.code.length <= 6);
  assert.match(customArabic.code, /^[A-Z0-9]+$/);
  assert.equal(customArabic.nameAr, 'فرنك افريقي');
});

test('exchange-rate-storage: saves, loads, and reconciles custom currencies in LocalStorage', () => {
  const storage = createMemoryStorage();
  const initial = loadPersistedCurrencies(storage);
  assert.ok(initial.some((c) => c.code === 'SDG'));

  const withCustom = [
    ...initial,
    { code: 'EGP', name: 'Egyptian Pound', nameAr: 'جنيه مصري', symbol: 'ج.م', decimalPlaces: 2, isBase: false, isActive: true },
  ];
  savePersistedCurrencies(withCustom, storage);

  const loaded = loadPersistedCurrencies(storage);
  assert.ok(loaded.some((c) => c.code === 'EGP'));

  const reconciled = reconcileCurrenciesWithPersisted(initial, loaded);
  assert.ok(reconciled.some((c) => c.code === 'EGP'), 'Custom currency in LocalStorage should be preserved');
});

test('exchange-rate-storage: mergeEditFormsState never reverts existing input fields during state updates', () => {
  const prevForms: Record<string, RateEditFormState> = {
    USD: {
      rate: '4350', // User is currently typing 4350
      effectiveFrom: '2026-10-31',
      expiryDate: '',
      isSaving: false,
      saveSuccess: false,
      error: null,
    },
  };

  const incomingServerRates: ExchangeRateItem[] = [
    {
      id: 'rate-usd-sdg-1',
      sourceCurrency: 'USD',
      targetCurrency: 'SDG',
      rate: 2700, // Server/default rate
      inverseRate: 1 / 2700,
      effectiveFrom: '2026-10-31T00:00:00.000Z',
      isActive: true,
    },
    {
      id: 'rate-sar-sdg-1',
      sourceCurrency: 'SAR',
      targetCurrency: 'SDG',
      rate: 720,
      inverseRate: 1 / 720,
      effectiveFrom: '2026-10-31T00:00:00.000Z',
      isActive: true,
    },
  ];

  // State update occurs without forceOverwriteAll
  const merged = mergeEditFormsState(prevForms, incomingServerRates, { SDG: 1, USD: 2700, SAR: 720 });

  // USD input MUST remain '4350' and NOT revert to '2700'
  assert.equal(merged.USD.rate, '4350', 'Active USD input must not revert to default 2700 during state updates');
  // Newly discovered currency SAR gets initialized
  assert.equal(merged.SAR.rate, '720');

  // If component remounts (prevForms is empty {}), persistedDraftInputs restores user input
  const remounted = mergeEditFormsState({}, incomingServerRates, { SDG: 1, USD: 2700, SAR: 720 }, {
    persistedDraftInputs: { USD: '4350' },
  });
  assert.equal(remounted.USD.rate, '4350', 'Remounted input must restore draft from LocalStorage instead of default 2700');
});
