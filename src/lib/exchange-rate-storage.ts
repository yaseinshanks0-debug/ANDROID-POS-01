/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Currency, ExchangeRateItem } from './types';

export const EXCHANGE_RATES_STORAGE_KEY = 'dqnamo_pos_exchange_rates_v1';
export const EXCHANGE_RATE_ITEMS_STORAGE_KEY = 'dqnamo_pos_exchange_rate_items_v1';
export const EXCHANGE_RATE_INPUTS_STORAGE_KEY = 'dqnamo_pos_exchange_rate_inputs_v1';
export const CURRENCIES_STORAGE_KEY = 'dqnamo_pos_currencies_v1';

export const DEFAULT_EXCHANGE_RATES_MAP: Record<string, number> = {
  SDG: 1,
  USD: 2700,
  SAR: 720,
  AED: 735,
  EUR: 2950,
  GBP: 3450,
};

export const DEFAULT_CURRENCIES_LIST: Currency[] = [
  { code: 'SDG', name: 'Sudanese Pound', nameAr: 'جنيه سوداني', symbol: 'ج.س', decimalPlaces: 2, isBase: true, isActive: true },
  { code: 'USD', name: 'US Dollar', nameAr: 'دولار أمريكي', symbol: '$', decimalPlaces: 2, isBase: false, isActive: true },
  { code: 'SAR', name: 'Saudi Riyal', nameAr: 'ريال سعودي', symbol: 'ر.س', decimalPlaces: 2, isBase: false, isActive: true },
  { code: 'AED', name: 'UAE Dirham', nameAr: 'درهم إماراتي', symbol: 'د.إ', decimalPlaces: 2, isBase: false, isActive: true },
  { code: 'EUR', name: 'Euro', nameAr: 'يورو', symbol: '€', decimalPlaces: 2, isBase: false, isActive: true },
  { code: 'GBP', name: 'British Pound', nameAr: 'جنيه إسترليني', symbol: '£', decimalPlaces: 2, isBase: false, isActive: true },
];

export interface CurrencyTemplate {
  code: string;
  name: string;
  nameAr: string;
  symbol: string;
  defaultRate: number;
  keywords: string[];
}

export const CURRENCY_TEMPLATES: CurrencyTemplate[] = [
  { code: 'EGP', name: 'Egyptian Pound', nameAr: 'جنيه مصري', symbol: 'ج.م', defaultRate: 55, keywords: ['جنيه مصري', 'مصري', 'ج.م', 'جم', 'egp', 'egypt'] },
  { code: 'QAR', name: 'Qatari Riyal', nameAr: 'ريال قطري', symbol: 'ر.ق', defaultRate: 740, keywords: ['ريال قطري', 'قطري', 'ر.ق', 'رق', 'qar', 'qatar'] },
  { code: 'KWD', name: 'Kuwaiti Dinar', nameAr: 'دينار كويتي', symbol: 'د.ك', defaultRate: 8800, keywords: ['دينار كويتي', 'كويتي', 'د.ك', 'دك', 'kwd', 'kuwait'] },
  { code: 'TRY', name: 'Turkish Lira', nameAr: 'ليرة تركية', symbol: '₺', defaultRate: 80, keywords: ['ليرة تركية', 'ليره تركيه', 'تركي', 'تركية', 'try', 'tl', 'turkish'] },
  { code: 'ETB', name: 'Ethiopian Birr', nameAr: 'بير إثيوبي', symbol: 'Br', defaultRate: 22, keywords: ['بير إثيوبي', 'بير اثيوبي', 'اثيوبي', 'إثيوبي', 'بير', 'etb', 'birr'] },
  { code: 'LYD', name: 'Libyan Dinar', nameAr: 'دينار ليبي', symbol: 'د.ل', defaultRate: 560, keywords: ['دينار ليبي', 'ليبي', 'د.ل', 'دل', 'lyd', 'libya'] },
  { code: 'JOD', name: 'Jordanian Dinar', nameAr: 'دينار أردني', symbol: 'د.أ', defaultRate: 3800, keywords: ['دينار أردني', 'دينار اردني', 'اردني', 'أردني', 'د.أ', 'jod', 'jordan'] },
  { code: 'OMR', name: 'Omani Rial', nameAr: 'ريال عماني', symbol: 'ر.ع', defaultRate: 7000, keywords: ['ريال عماني', 'عماني', 'ر.ع', 'رع', 'omr', 'oman'] },
  { code: 'BHD', name: 'Bahraini Dinar', nameAr: 'دينار بحريني', symbol: 'د.ب', defaultRate: 7150, keywords: ['دينار بحريني', 'بحريني', 'د.ب', 'دب', 'bhd', 'bahrain'] },
  { code: 'CNY', name: 'Chinese Yuan', nameAr: 'يوان صيني', symbol: '¥', defaultRate: 375, keywords: ['يوان صيني', 'يوان', 'صيني', 'رممبي', 'cny', 'rmb', 'yuan'] },
  { code: 'GBP', name: 'British Pound', nameAr: 'جنيه إسترليني', symbol: '£', defaultRate: 3450, keywords: ['جنيه إسترليني', 'جنيه استرليني', 'استرليني', 'إسترليني', 'gbp', 'british'] },
  { code: 'USD', name: 'US Dollar', nameAr: 'دولار أمريكي', symbol: '$', defaultRate: 2700, keywords: ['دولار أمريكي', 'دولار امريكي', 'دولار', '$', 'usd', 'dollar'] },
  { code: 'SAR', name: 'Saudi Riyal', nameAr: 'ريال سعودي', symbol: 'ر.س', defaultRate: 720, keywords: ['ريال سعودي', 'سعودي', 'ر.س', 'رس', 'sar', 'saudi'] },
  { code: 'AED', name: 'UAE Dirham', nameAr: 'درهم إماراتي', symbol: 'د.إ', defaultRate: 735, keywords: ['درهم إماراتي', 'درهم اماراتي', 'درهم', 'إماراتي', 'اماراتي', 'د.إ', 'aed', 'dirham'] },
  { code: 'EUR', name: 'Euro', nameAr: 'يورو', symbol: '€', defaultRate: 2950, keywords: ['يورو', '€', 'eur', 'euro'] },
  { code: 'CHF', name: 'Swiss Franc', nameAr: 'فرنك سويسري', symbol: 'CHF', defaultRate: 3050, keywords: ['فرنك سويسري', 'فرنك', 'سويسري', 'chf', 'franc'] },
  { code: 'INR', name: 'Indian Rupee', nameAr: 'روبية هندية', symbol: '₹', defaultRate: 32, keywords: ['روبية هندية', 'روبيه', 'روبية', 'هندي', 'inr', 'rupee'] },
];

const ARABIC_TO_LATIN_MAP: Record<string, string> = {
  ا: 'A', أ: 'A', إ: 'E', آ: 'A', ب: 'B', ت: 'T', ث: 'TH', ج: 'J', ح: 'H', خ: 'KH',
  د: 'D', ذ: 'Z', ر: 'R', ز: 'Z', س: 'S', ش: 'SH', ص: 'S', ض: 'D', ط: 'T', ظ: 'Z',
  ع: 'A', غ: 'GH', ف: 'F', ق: 'Q', ك: 'K', ل: 'L', م: 'M', ن: 'N', ه: 'H', و: 'W',
  ي: 'Y', ى: 'A', ة: 'H', ء: 'A', ئ: 'Y', ؤ: 'W',
};

/**
 * Transliterates an Arabic string into a 3-6 uppercase alphanumeric ASCII currency code.
 */
export function transliterateToCurrencyCode(text: string): string {
  const normalized = (text || '').trim();
  let out = '';
  for (const ch of normalized) {
    if (/[A-Za-z0-9]/.test(ch)) {
      out += ch.toUpperCase();
    } else if (ARABIC_TO_LATIN_MAP[ch]) {
      out += ARABIC_TO_LATIN_MAP[ch];
    }
  }
  const cleaned = out.replace(/[^A-Z0-9]/g, '').slice(0, 6);
  if (cleaned.length >= 2) return cleaned;
  return '';
}

/**
 * Resolves user input for adding/editing a currency, supporting English ISO codes,
 * Arabic currency names/symbols, and partial form inputs without failing.
 */
export function resolveCurrencyInput(input: {
  code?: string;
  name?: string;
  nameAr?: string;
  symbol?: string;
}): {
  code: string;
  name: string;
  nameAr: string;
  symbol: string;
  suggestedRate?: number;
} {
  const rawCode = (input.code || '').trim();
  const rawName = (input.name || '').trim();
  const rawNameAr = (input.nameAr || '').trim();
  const rawSymbol = (input.symbol || '').trim();

  // 1. Check if rawCode, rawNameAr, rawName, or rawSymbol matches a known template
  const searchTerms = [rawCode, rawNameAr, rawName, rawSymbol]
    .map((s) => s.toLowerCase().trim())
    .filter(Boolean);

  let matchedTemplate: CurrencyTemplate | undefined;
  for (const tpl of CURRENCY_TEMPLATES) {
    if (rawCode.toUpperCase() === tpl.code) {
      matchedTemplate = tpl;
      break;
    }
    if (
      searchTerms.some(
        (term) =>
          tpl.keywords.includes(term) ||
          tpl.name.toLowerCase() === term ||
          tpl.nameAr === term
      )
    ) {
      matchedTemplate = tpl;
      break;
    }
  }

  // 2. Determine clean 2-6 uppercase ASCII code
  let cleanCode = rawCode.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (cleanCode.length < 2 && matchedTemplate) {
    cleanCode = matchedTemplate.code;
  }
  if (cleanCode.length < 2) {
    cleanCode =
      transliterateToCurrencyCode(rawCode) ||
      transliterateToCurrencyCode(rawName) ||
      transliterateToCurrencyCode(rawNameAr) ||
      transliterateToCurrencyCode(rawSymbol);
  }
  if (cleanCode.length > 6) {
    cleanCode = cleanCode.slice(0, 6);
  }

  const finalNameAr = rawNameAr || matchedTemplate?.nameAr || rawName || cleanCode;
  const finalName = rawName || matchedTemplate?.name || rawNameAr || cleanCode;
  const finalSymbol = (rawSymbol || matchedTemplate?.symbol || cleanCode).slice(0, 6);

  return {
    code: cleanCode,
    name: finalName,
    nameAr: finalNameAr,
    symbol: finalSymbol,
    suggestedRate: matchedTemplate?.defaultRate,
  };
}

export interface RateEditFormState {
  rate: string;
  effectiveFrom: string;
  expiryDate: string;
  isSaving: boolean;
  saveSuccess: boolean;
  error: string | null;
}

/**
 * Load persisted currencies list from localStorage.
 */
export function loadPersistedCurrencies(
  storage: Pick<Storage, 'getItem'> | undefined = typeof localStorage !== 'undefined' ? localStorage : undefined
): Currency[] {
  if (!storage) return [...DEFAULT_CURRENCIES_LIST];
  try {
    const raw = storage.getItem(CURRENCIES_STORAGE_KEY);
    if (!raw) return [...DEFAULT_CURRENCIES_LIST];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const valid = parsed.filter(
        (c): c is Currency =>
          Boolean(c && typeof c.code === 'string' && c.code.trim().length >= 2)
      );
      if (valid.length > 0) {
        if (!valid.some((c) => c.code === 'SDG')) {
          valid.unshift(DEFAULT_CURRENCIES_LIST[0]);
        }
        return valid;
      }
    }
  } catch {
    // Fallback to defaults
  }
  return [...DEFAULT_CURRENCIES_LIST];
}

/**
 * Save currencies list to localStorage.
 */
export function savePersistedCurrencies(
  currenciesList: Currency[],
  storage: Pick<Storage, 'setItem'> | undefined = typeof localStorage !== 'undefined' ? localStorage : undefined
): void {
  if (!storage) return;
  try {
    storage.setItem(CURRENCIES_STORAGE_KEY, JSON.stringify(currenciesList));
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Merge remote currencies with locally persisted currencies so newly added custom currencies
 * in localStorage are preserved.
 */
export function reconcileCurrenciesWithPersisted(
  remoteCurrencies: Currency[],
  persistedCurrencies: Currency[]
): Currency[] {
  const map = new Map<string, Currency>();
  for (const c of remoteCurrencies) {
    if (c && c.code && c.isActive !== false) {
      map.set(c.code.toUpperCase(), c);
    }
  }
  for (const localCur of persistedCurrencies) {
    const code = localCur?.code?.toUpperCase();
    if (code && localCur.isActive !== false && !map.has(code)) {
      map.set(code, localCur);
    }
  }
  if (!map.has('SDG')) {
    map.set('SDG', DEFAULT_CURRENCIES_LIST[0]);
  }
  return Array.from(map.values());
}

/**
 * Load persisted exchange rates map (currency code -> rate to SDG) from localStorage.
 */
export function loadPersistedExchangeRates(
  storage: Pick<Storage, 'getItem'> | undefined = typeof localStorage !== 'undefined' ? localStorage : undefined
): Record<string, number> {
  if (!storage) return { ...DEFAULT_EXCHANGE_RATES_MAP };
  try {
    const raw = storage.getItem(EXCHANGE_RATES_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_EXCHANGE_RATES_MAP };
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      const cleaned: Record<string, number> = { ...DEFAULT_EXCHANGE_RATES_MAP };
      for (const [k, v] of Object.entries(parsed)) {
        const num = Number(v);
        if (!isNaN(num) && isFinite(num) && num > 0) {
          cleaned[k.toUpperCase()] = num;
        }
      }
      cleaned.SDG = 1;
      return cleaned;
    }
  } catch {
    // Fallback to defaults on corrupted storage
  }
  return { ...DEFAULT_EXCHANGE_RATES_MAP };
}

/**
 * Save exchange rates map to localStorage.
 */
export function savePersistedExchangeRates(
  ratesMap: Record<string, number>,
  storage: Pick<Storage, 'setItem'> | undefined = typeof localStorage !== 'undefined' ? localStorage : undefined
): void {
  if (!storage) return;
  try {
    storage.setItem(EXCHANGE_RATES_STORAGE_KEY, JSON.stringify({ ...ratesMap, SDG: 1 }));
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Load persisted draft input strings per currency from localStorage so input fields
 * never revert across state updates or component remounts.
 */
export function loadPersistedRateInputs(
  storage: Pick<Storage, 'getItem'> | undefined = typeof localStorage !== 'undefined' ? localStorage : undefined
): Record<string, string> {
  if (!storage) return {};
  try {
    const raw = storage.getItem(EXCHANGE_RATE_INPUTS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      const result: Record<string, string> = {};
      for (const [k, v] of Object.entries(parsed)) {
        if (typeof v === 'string') {
          result[k.toUpperCase()] = v;
        }
      }
      return result;
    }
  } catch {
    // Ignore parse errors
  }
  return {};
}

/**
 * Save draft input strings per currency to localStorage.
 */
export function savePersistedRateInputs(
  inputsMap: Record<string, string>,
  storage: Pick<Storage, 'setItem'> | undefined = typeof localStorage !== 'undefined' ? localStorage : undefined
): void {
  if (!storage) return;
  try {
    storage.setItem(EXCHANGE_RATE_INPUTS_STORAGE_KEY, JSON.stringify(inputsMap));
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Load persisted ExchangeRateItem array from localStorage.
 */
export function loadPersistedExchangeRateItems(
  storage: Pick<Storage, 'getItem'> | undefined = typeof localStorage !== 'undefined' ? localStorage : undefined
): ExchangeRateItem[] {
  if (!storage) return [];
  try {
    const raw = storage.getItem(EXCHANGE_RATE_ITEMS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // Ignore parse errors
  }
  return [];
}

/**
 * Save ExchangeRateItem array to localStorage.
 */
export function savePersistedExchangeRateItems(
  items: ExchangeRateItem[],
  storage: Pick<Storage, 'setItem'> | undefined = typeof localStorage !== 'undefined' ? localStorage : undefined
): void {
  if (!storage) return;
  try {
    storage.setItem(EXCHANGE_RATE_ITEMS_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Merge incoming ExchangeRateItem[] with locally persisted rates map and active currencies so that
 * user-persisted rates and newly added currencies in localStorage are never overwritten or dropped.
 */
export function reconcileRatesWithPersisted(
  remoteItems: ExchangeRateItem[],
  persistedMap: Record<string, number>,
  persistedItems: ExchangeRateItem[] = [],
  activeCurrencies: Currency[] = []
): ExchangeRateItem[] {
  const persistedItemMap = new Map<string, ExchangeRateItem>(
    persistedItems.map((item) => [item.sourceCurrency.toUpperCase(), item])
  );

  const seenCodes = new Set<string>();
  const result: ExchangeRateItem[] = remoteItems.map((item) => {
    const code = item.sourceCurrency.toUpperCase();
    seenCodes.add(code);
    const localItem = persistedItemMap.get(code);
    const localRate = persistedMap[code];

    // If localStorage has a more recent item or an explicitly saved local rate when remote is still initial seed
    if (localItem && localItem.rate > 0) {
      const localTime = new Date(localItem.effectiveFrom).getTime();
      const remoteTime = new Date(item.effectiveFrom).getTime();
      if (localTime >= remoteTime || item.id.endsWith('-initial')) {
        return {
          ...item,
          rate: localItem.rate,
          inverseRate: Math.round((1 / localItem.rate) * 1000000) / 1000000,
          effectiveFrom: localItem.effectiveFrom,
        };
      }
    } else if (
      typeof localRate === 'number' &&
      localRate > 0 &&
      item.id.endsWith('-initial') &&
      localRate !== item.rate
    ) {
      return {
        ...item,
        rate: localRate,
        inverseRate: Math.round((1 / localRate) * 1000000) / 1000000,
      };
    }

    return item;
  });

  // Also include any active non-base currency from activeCurrencies or persistedItems that wasn't in remoteItems
  const activeSet =
    activeCurrencies.length > 0
      ? new Set(activeCurrencies.filter((c) => !c.isBase && c.isActive !== false).map((c) => c.code.toUpperCase()))
      : null;

  for (const localItem of persistedItems) {
    const code = localItem.sourceCurrency.toUpperCase();
    if (
      code !== 'SDG' &&
      !seenCodes.has(code) &&
      localItem.rate > 0 &&
      (!activeSet || activeSet.has(code))
    ) {
      seenCodes.add(code);
      result.push(localItem);
    }
  }

  if (activeCurrencies.length > 0) {
    for (const cur of activeCurrencies) {
      const code = cur.code.toUpperCase();
      if (!cur.isBase && cur.isActive !== false && !seenCodes.has(code)) {
        const fallbackRate = persistedMap[code] || DEFAULT_EXCHANGE_RATES_MAP[code] || 100;
        seenCodes.add(code);
        result.push({
          id: `effective-${code.toLowerCase()}-sdg`,
          sourceCurrency: code,
          targetCurrency: 'SDG',
          rate: fallbackRate,
          inverseRate: Math.round((1 / fallbackRate) * 1000000) / 1000000,
          effectiveFrom: new Date().toISOString(),
          expiryDate: null,
          isActive: true,
          sourceSymbol: cur.symbol,
          targetSymbol: 'ج.س',
          sourceName: cur.name,
          targetName: 'Sudanese Pound',
        });
      }
    }
  }

  return result;
}

/**
 * Merge incoming rate items into the UI `editForms` state without reverting
 * any existing input field values during state updates.
 *
 * - If a currency already has an entry in `prevForms` and `forceOverwriteCurrencies` does not include it,
 *   its current `rate`, `effectiveFrom`, and `expiryDate` strings are preserved intact so typing or
 *   context state updates never revert the input field.
 */
export function mergeEditFormsState(
  prevForms: Record<string, RateEditFormState>,
  rateItems: ExchangeRateItem[],
  persistedRatesMap: Record<string, number>,
  options?: {
    forceOverwriteAll?: boolean;
    forceOverwriteCurrencies?: string[];
    persistedDraftInputs?: Record<string, string>;
  }
): Record<string, RateEditFormState> {
  const forceAll = Boolean(options?.forceOverwriteAll);
  const forceSet = new Set(
    (options?.forceOverwriteCurrencies || []).map((c) => c.toUpperCase())
  );
  const draftInputs = options?.persistedDraftInputs || {};
  const todayStr = new Date().toISOString().slice(0, 10);

  const nextForms: Record<string, RateEditFormState> = { ...prevForms };

  for (const r of rateItems) {
    const code = r.sourceCurrency.toUpperCase();
    const existingForm = prevForms[code];
    const shouldOverwrite = forceAll || forceSet.has(code) || !existingForm;

    if (!shouldOverwrite && existingForm) {
      // Preserve current input value so state updates never revert what the user typed
      nextForms[code] = existingForm;
    } else {
      const draftStr = !forceAll && !forceSet.has(code) ? draftInputs[code] : undefined;
      const effectiveRate =
        r.rate > 0 ? r.rate : persistedRatesMap[code] || DEFAULT_EXCHANGE_RATES_MAP[code] || 100;
      nextForms[code] = {
        rate: draftStr !== undefined && draftStr !== '' ? draftStr : effectiveRate.toString(),
        effectiveFrom: r.effectiveFrom ? r.effectiveFrom.slice(0, 10) : todayStr,
        expiryDate: r.expiryDate ? r.expiryDate.slice(0, 10) : '',
        isSaving: false,
        saveSuccess: existingForm?.saveSuccess || false,
        error: null,
      };
    }
  }

  return nextForms;
}
