/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AppLanguage,
  ExpenseCategory,
  ExpenseInput,
  ExpenseRecord,
  PaymentMethod,
  SalesRateValuationMode,
  SupportedCurrency,
} from './types';
import {
  convertCurrencyAmount,
  DEFAULT_BASELINE_EXCHANGE_RATES,
  roundCurrencyValue,
} from './pos-calculations';

export interface ExpenseCategoryDefinition {
  id: ExpenseCategory;
  labelAr: string;
  labelEn: string;
  emoji: string;
  colorHex: string;
}

export const EXPENSE_CATEGORIES: ExpenseCategoryDefinition[] = [
  {
    id: 'rent',
    labelAr: 'إيجار المحل والمخازن',
    labelEn: 'Store & Warehouse Rent',
    emoji: '🏢',
    colorHex: '#f59e0b',
  },
  {
    id: 'utilities',
    labelAr: 'كهرباء، مياه، وإنترنت',
    labelEn: 'Electricity, Water & Internet',
    emoji: '⚡',
    colorHex: '#3b82f6',
  },
  {
    id: 'salaries',
    labelAr: 'رواتب وأجور وحوافز',
    labelEn: 'Salaries, Wages & Bonuses',
    emoji: '👥',
    colorHex: '#10b981',
  },
  {
    id: 'transport',
    labelAr: 'ترحيل، شحن، ومواصلات',
    labelEn: 'Transport, Freight & Delivery',
    emoji: '🚚',
    colorHex: '#8b5cf6',
  },
  {
    id: 'maintenance',
    labelAr: 'صيانة وإصلاحات وتشغيل',
    labelEn: 'Maintenance & Repairs',
    emoji: '🛠️',
    colorHex: '#ec4899',
  },
  {
    id: 'supplies',
    labelAr: 'قرطاسية وأكياس ومستلزمات',
    labelEn: 'Packaging & Store Supplies',
    emoji: '📦',
    colorHex: '#14b8a6',
  },
  {
    id: 'taxes_fees',
    labelAr: 'ضرائب، رسوم محلية، وتراخيص',
    labelEn: 'Taxes, Fees & Licenses',
    emoji: '🏛️',
    colorHex: '#ef4444',
  },
  {
    id: 'marketing',
    labelAr: 'دعاية، إعلان، وتسويق',
    labelEn: 'Marketing & Promotions',
    emoji: '📣',
    colorHex: '#f97316',
  },
  {
    id: 'other',
    labelAr: 'منصرفات نثرية وأخرى',
    labelEn: 'Miscellaneous / Other Expenses',
    emoji: '🧾',
    colorHex: '#64748b',
  },
];

const VALID_EXPENSE_CATEGORY_SET = new Set<string>(EXPENSE_CATEGORIES.map((c) => c.id));

export function getExpenseCategoryMeta(category: ExpenseCategory | string): ExpenseCategoryDefinition {
  const found = EXPENSE_CATEGORIES.find((c) => c.id === category);
  return found || EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1];
}

export function formatExpenseCategoryLabel(
  category: ExpenseCategory | string,
  language: AppLanguage = 'ar'
): string {
  const meta = getExpenseCategoryMeta(category);
  return language === 'ar' ? meta.labelAr : meta.labelEn;
}

export function generateExpenseId(now: Date = new Date()): string {
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `EXP-${yyyy}${mm}${dd}-${suffix}`;
}

export interface ExpenseValidationResult {
  valid: boolean;
  error?: string;
  errorAr?: string;
}

/**
 * Validates an ExpenseInput before creating or updating an ExpenseRecord.
 */
export function validateExpenseInput(
  input: Partial<ExpenseInput>,
  language: AppLanguage = 'ar'
): ExpenseValidationResult {
  const isAr = language === 'ar';
  const cleanTitle = String(input.title ?? '').trim();

  if (!cleanTitle) {
    const msgAr = 'يرجى إدخال بيان أو وصف المنصرف.';
    const msgEn = 'Please enter an expense title or description.';
    return {
      valid: false,
      error: isAr ? msgAr : msgEn,
      errorAr: msgAr,
    };
  }

  if (cleanTitle.length > 160) {
    const msgAr = 'بيان المنصرف طويل جداً (الحد الأقصى 160 حرفاً).';
    const msgEn = 'Expense title is too long (maximum 160 characters).';
    return {
      valid: false,
      error: isAr ? msgAr : msgEn,
      errorAr: msgAr,
    };
  }

  const rawAmount = Number(input.amount);
  if (!Number.isFinite(rawAmount) || rawAmount <= 0) {
    const msgAr = 'يرجى إدخال مبلغ صحيح أكبر من الصفر للمنصرف.';
    const msgEn = 'Please enter a valid expense amount greater than zero.';
    return {
      valid: false,
      error: isAr ? msgAr : msgEn,
      errorAr: msgAr,
    };
  }

  const category = String(input.category || 'other');
  if (!VALID_EXPENSE_CATEGORY_SET.has(category)) {
    const msgAr = 'يرجى اختيار بند/تصنيف صحيح للمنصرف.';
    const msgEn = 'Please select a valid expense category.';
    return {
      valid: false,
      error: isAr ? msgAr : msgEn,
      errorAr: msgAr,
    };
  }

  return { valid: true };
}

export interface ConvertedExpenseView {
  id: string;
  currency: SupportedCurrency;
  originalCurrency: SupportedCurrency;
  originalAmount: number;
  convertedAmount: number;
  historicalAmount: number;
  liveAmount: number;
  indexedAmount: number;
  exchangeRateUsed: number;
}

/**
 * Converts an ExpenseRecord into targetCurrency using the specified valuation mode.
 */
export function getConvertedExpenseView(
  expense: ExpenseRecord,
  targetCurrency: SupportedCurrency = 'SDG',
  currentExchangeRates: Record<string, number> = DEFAULT_BASELINE_EXCHANGE_RATES,
  mode: SalesRateValuationMode = 'historical',
  anchorCurrency: string = 'USD'
): ConvertedExpenseView {
  const expCurrency = (expense.currency || 'SDG').toString().toUpperCase().trim();
  const target = (targetCurrency || 'SDG').toString().toUpperCase().trim();
  const anchor = (anchorCurrency || 'USD').toString().toUpperCase().trim();

  const liveRates: Record<string, number> = {
    ...DEFAULT_BASELINE_EXCHANGE_RATES,
    ...(currentExchangeRates || {}),
    SDG: 1,
  };

  const snapshotRates: Record<string, number> = {
    ...DEFAULT_BASELINE_EXCHANGE_RATES,
    ...(expense.exchangeRatesSnapshot || {}),
    SDG: 1,
  };

  if (expense.exchangeRateUsed && expense.exchangeRateUsed > 0) {
    if (expCurrency !== 'SDG') {
      snapshotRates[expCurrency] = Number(expense.exchangeRateUsed);
    } else {
      snapshotRates[anchor] = Number(expense.exchangeRateUsed);
    }
  }

  const convertByMode = (amount: number, evalMode: SalesRateValuationMode): number => {
    if (!Number.isFinite(amount) || amount <= 0) return 0;

    if (evalMode === 'historical') {
      return convertCurrencyAmount(amount, expCurrency, target, snapshotRates);
    }

    if (evalMode === 'indexed') {
      const expRateSnapshot =
        expCurrency === 'SDG'
          ? 1
          : snapshotRates[expCurrency] && snapshotRates[expCurrency] > 0
          ? Number(snapshotRates[expCurrency])
          : 1;
      const anchorRateSnapshot =
        anchor === 'SDG'
          ? 1
          : snapshotRates[anchor] && snapshotRates[anchor] > 0
          ? Number(snapshotRates[anchor])
          : 1;

      const anchorAmountRaw = (amount * expRateSnapshot) / anchorRateSnapshot;

      const anchorRateLive =
        anchor === 'SDG'
          ? 1
          : liveRates[anchor] && liveRates[anchor] > 0
          ? Number(liveRates[anchor])
          : 1;
      const targetRateLive =
        target === 'SDG'
          ? 1
          : liveRates[target] && liveRates[target] > 0
          ? Number(liveRates[target])
          : 1;

      return roundCurrencyValue((anchorAmountRaw * anchorRateLive) / targetRateLive);
    }

    return convertCurrencyAmount(amount, expCurrency, target, liveRates);
  };

  const convertedAmount = convertByMode(expense.amount, mode);
  const historicalAmount = convertByMode(expense.amount, 'historical');
  const liveAmount = convertByMode(expense.amount, 'live');
  const indexedAmount = convertByMode(expense.amount, 'indexed');

  const refCurr = expCurrency !== 'SDG' ? expCurrency : anchor;
  const exchangeRateUsed =
    expense.exchangeRateUsed && expense.exchangeRateUsed > 0
      ? Number(expense.exchangeRateUsed)
      : Number(snapshotRates[refCurr] || 2700);

  return {
    id: expense.id,
    currency: target,
    originalCurrency: expCurrency,
    originalAmount: roundCurrencyValue(expense.amount),
    convertedAmount,
    historicalAmount,
    liveAmount,
    indexedAmount,
    exchangeRateUsed,
  };
}

export interface ExpenseCategoryBreakdownItem {
  category: ExpenseCategory;
  labelAr: string;
  labelEn: string;
  emoji: string;
  colorHex: string;
  count: number;
  totalAmount: number;
  sharePercent: number;
}

export interface ExpensesSummaryAnalytics {
  currency: SupportedCurrency;
  totalExpenses: number;
  todayExpenses: number;
  thisMonthExpenses: number;
  averageExpenseAmount: number;
  activeCount: number;
  voidedCount: number;
  todayCount: number;
  byCategory: ExpenseCategoryBreakdownItem[];
  byPaymentMethod: Record<PaymentMethod, { count: number; totalAmount: number; sharePercent: number }>;
  topCategory: ExpenseCategoryBreakdownItem | null;
}

/**
 * Computes comprehensive expense analytics across all active ExpenseRecords.
 */
export function computeExpensesSummary(
  expenses: ExpenseRecord[],
  targetCurrency: SupportedCurrency = 'SDG',
  currentExchangeRates: Record<string, number> = DEFAULT_BASELINE_EXCHANGE_RATES,
  mode: SalesRateValuationMode = 'historical',
  anchorCurrency: string = 'USD',
  referenceDate: Date = new Date()
): ExpensesSummaryAnalytics {
  const safeList = Array.isArray(expenses) ? expenses : [];
  const todayDateStr = referenceDate.toDateString();
  const refYear = referenceDate.getFullYear();
  const refMonth = referenceDate.getMonth();

  let totalExpenses = 0;
  let todayExpenses = 0;
  let thisMonthExpenses = 0;
  let activeCount = 0;
  let voidedCount = 0;
  let todayCount = 0;

  const categoryTotalsMap: Record<ExpenseCategory, { count: number; totalAmount: number }> = {
    rent: { count: 0, totalAmount: 0 },
    utilities: { count: 0, totalAmount: 0 },
    salaries: { count: 0, totalAmount: 0 },
    transport: { count: 0, totalAmount: 0 },
    maintenance: { count: 0, totalAmount: 0 },
    supplies: { count: 0, totalAmount: 0 },
    taxes_fees: { count: 0, totalAmount: 0 },
    marketing: { count: 0, totalAmount: 0 },
    other: { count: 0, totalAmount: 0 },
  };

  const byPaymentMethod: Record<PaymentMethod, { count: number; totalAmount: number; sharePercent: number }> = {
    cash: { count: 0, totalAmount: 0, sharePercent: 0 },
    bank_transfer: { count: 0, totalAmount: 0, sharePercent: 0 },
    qr_nfc: { count: 0, totalAmount: 0, sharePercent: 0 },
    card: { count: 0, totalAmount: 0, sharePercent: 0 },
  };

  for (const exp of safeList) {
    if (!exp) continue;
    if (exp.status === 'voided') {
      voidedCount += 1;
      continue;
    }

    activeCount += 1;
    const view = getConvertedExpenseView(
      exp,
      targetCurrency,
      currentExchangeRates,
      mode,
      anchorCurrency
    );
    const val = view.convertedAmount;
    totalExpenses = roundCurrencyValue(totalExpenses + val);

    const expDate = new Date(exp.timestamp);
    if (!isNaN(expDate.getTime())) {
      if (expDate.toDateString() === todayDateStr) {
        todayExpenses = roundCurrencyValue(todayExpenses + val);
        todayCount += 1;
      }
      if (expDate.getFullYear() === refYear && expDate.getMonth() === refMonth) {
        thisMonthExpenses = roundCurrencyValue(thisMonthExpenses + val);
      }
    }

    const catKey: ExpenseCategory = VALID_EXPENSE_CATEGORY_SET.has(exp.category)
      ? exp.category
      : 'other';
    categoryTotalsMap[catKey].count += 1;
    categoryTotalsMap[catKey].totalAmount = roundCurrencyValue(
      categoryTotalsMap[catKey].totalAmount + val
    );

    const methodKey: PaymentMethod =
      exp.paymentMethod === 'card'
        ? 'bank_transfer'
        : exp.paymentMethod in byPaymentMethod
        ? exp.paymentMethod
        : 'cash';
    byPaymentMethod[methodKey].count += 1;
    byPaymentMethod[methodKey].totalAmount = roundCurrencyValue(
      byPaymentMethod[methodKey].totalAmount + val
    );
  }

  const byCategory: ExpenseCategoryBreakdownItem[] = EXPENSE_CATEGORIES.map((meta) => {
    const stat = categoryTotalsMap[meta.id] || { count: 0, totalAmount: 0 };
    const sharePercent =
      totalExpenses > 0
        ? Math.round((stat.totalAmount / totalExpenses) * 1000) / 10
        : 0;
    return {
      category: meta.id,
      labelAr: meta.labelAr,
      labelEn: meta.labelEn,
      emoji: meta.emoji,
      colorHex: meta.colorHex,
      count: stat.count,
      totalAmount: stat.totalAmount,
      sharePercent,
    };
  }).sort((a, b) => b.totalAmount - a.totalAmount);

  for (const method of Object.keys(byPaymentMethod) as PaymentMethod[]) {
    byPaymentMethod[method].sharePercent =
      totalExpenses > 0
        ? Math.round((byPaymentMethod[method].totalAmount / totalExpenses) * 1000) / 10
        : 0;
  }

  const topCategory = byCategory.find((c) => c.totalAmount > 0) || null;
  const averageExpenseAmount =
    activeCount > 0 ? roundCurrencyValue(totalExpenses / activeCount) : 0;

  return {
    currency: targetCurrency,
    totalExpenses,
    todayExpenses,
    thisMonthExpenses,
    averageExpenseAmount,
    activeCount,
    voidedCount,
    todayCount,
    byCategory,
    byPaymentMethod,
    topCategory,
  };
}

export interface NetFinancialPositionSummary {
  grossSales: number;
  collectedSales: number;
  grossProfitBeforeExpenses: number;
  totalExpenses: number;
  netOperatingProfit: number;
  netCashAfterExpenses: number;
  expenseToSalesRatioPercent: number;
  netProfitMarginAfterExpensesPercent: number;
}

/**
 * Computes the net operating profit and net cash position after deducting operating expenses.
 */
export function computeNetFinancialPosition(params: {
  grossSales: number;
  collectedSales: number;
  grossProfitBeforeExpenses: number;
  totalExpenses: number;
}): NetFinancialPositionSummary {
  const grossSales = roundCurrencyValue(Math.max(0, Number(params.grossSales) || 0));
  const collectedSales = roundCurrencyValue(Math.max(0, Number(params.collectedSales) || 0));
  const grossProfitBeforeExpenses = roundCurrencyValue(
    Number(params.grossProfitBeforeExpenses) || 0
  );
  const totalExpenses = roundCurrencyValue(Math.max(0, Number(params.totalExpenses) || 0));

  const netOperatingProfit = roundCurrencyValue(grossProfitBeforeExpenses - totalExpenses);
  const netCashAfterExpenses = roundCurrencyValue(collectedSales - totalExpenses);

  const expenseToSalesRatioPercent =
    grossSales > 0 ? Math.round((totalExpenses / grossSales) * 1000) / 10 : 0;
  const netProfitMarginAfterExpensesPercent =
    grossSales > 0 ? Math.round((netOperatingProfit / grossSales) * 1000) / 10 : 0;

  return {
    grossSales,
    collectedSales,
    grossProfitBeforeExpenses,
    totalExpenses,
    netOperatingProfit,
    netCashAfterExpenses,
    expenseToSalesRatioPercent,
    netProfitMarginAfterExpensesPercent,
  };
}
