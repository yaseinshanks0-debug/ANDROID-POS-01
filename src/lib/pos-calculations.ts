/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CartItem,
  CheckoutPaymentDetails,
  PaymentMethod,
  PaymentSettlementStatus,
  Product,
  SupportedCurrency,
  AppLanguage,
  Transaction,
  SalesRateValuationMode,
} from './types';

/**
 * Rounds monetary amounts cleanly: 2 decimals for standard values, up to 4 decimals for micro unit conversions.
 */
export function roundCurrencyValue(value: number): number {
  if (!Number.isFinite(value)) return 0;
  const abs = Math.abs(value);
  if (abs > 0 && abs < 0.05) {
    return Math.round(value * 10000) / 10000;
  }
  return Math.round(value * 100) / 100;
}

/**
 * Converts a monetary amount between any two currencies using an exchangeRates map
 * where exchangeRates[CODE] represents 1 unit of CODE in base currency (SDG = 1).
 */
export function convertCurrencyAmount(
  amount: number,
  fromCurrency: string = 'SDG',
  toCurrency: string = 'SDG',
  exchangeRates: Record<string, number> = { SDG: 1 }
): number {
  if (!Number.isFinite(amount) || amount < 0) return 0;
  const from = (fromCurrency || 'SDG').toUpperCase().trim();
  const to = (toCurrency || 'SDG').toUpperCase().trim();
  if (from === to) return roundCurrencyValue(amount);

  const fromRateToSdg =
    from === 'SDG'
      ? 1
      : exchangeRates && exchangeRates[from] && exchangeRates[from] > 0
      ? Number(exchangeRates[from])
      : 1;
  const toRateToSdg =
    to === 'SDG'
      ? 1
      : exchangeRates && exchangeRates[to] && exchangeRates[to] > 0
      ? Number(exchangeRates[to])
      : 1;

  const amountInSdg = amount * fromRateToSdg;
  const converted = amountInSdg / toRateToSdg;
  return roundCurrencyValue(converted);
}

/**
 * Resolves a product's cost price, selling price, unit profit, and profit margin % in the target currency.
 */
export function getProductPricesInCurrency(
  product: Pick<Product, 'costPrice' | 'sellingPrice' | 'priceCurrency' | 'customFields'>,
  targetCurrency: string = 'SDG',
  exchangeRates: Record<string, number> = { SDG: 1 }
): {
  costPrice: number;
  sellingPrice: number;
  profit: number;
  marginPercent: number;
  sourceCurrency: string;
} {
  const sourceCurrency = (
    product.priceCurrency ||
    product.customFields?.priceCurrency ||
    'SDG'
  )
    .toString()
    .toUpperCase()
    .trim();

  const costPrice = convertCurrencyAmount(
    product.costPrice,
    sourceCurrency,
    targetCurrency,
    exchangeRates
  );
  const sellingPrice = convertCurrencyAmount(
    product.sellingPrice,
    sourceCurrency,
    targetCurrency,
    exchangeRates
  );
  const profit = roundCurrencyValue(sellingPrice - costPrice);
  const marginPercent =
    sellingPrice > 0 ? Math.round(((sellingPrice - costPrice) / sellingPrice) * 1000) / 10 : 0;

  return {
    costPrice,
    sellingPrice,
    profit,
    marginPercent,
    sourceCurrency,
  };
}

/**
 * Calculates line-item total taking into account unit price, quantity, and item-specific discount percentage.
 */
export function calculateItemTotal(
  price: number,
  quantity: number,
  discountPercent: number = 0
): number {
  if (price < 0 || quantity <= 0) return 0;
  const clampedDiscount = Math.max(0, Math.min(100, discountPercent));
  const rawTotal = price * quantity * (1 - clampedDiscount / 100);
  return roundCurrencyValue(rawTotal);
}

export interface CartTotalsResult {
  subtotal: number;
  discountAmount: number;
  netSubtotal: number;
  taxAmount: number;
  grandTotal: number;
  totalItemsCount: number;
}

/**
 * Computes all cart monetary totals, supporting tax-inclusive, tax-exclusive, and active currency conversion.
 */
export function calculateCartTotals(
  items: CartItem[],
  taxRatePercent: number = 0,
  globalDiscountPercent: number = 0,
  isTaxInclusive: boolean = false,
  targetCurrency?: string,
  exchangeRates?: Record<string, number>
): CartTotalsResult {
  if (!items || items.length === 0) {
    return {
      subtotal: 0,
      discountAmount: 0,
      netSubtotal: 0,
      taxAmount: 0,
      grandTotal: 0,
      totalItemsCount: 0,
    };
  }

  let subtotal = 0;
  let totalItemsCount = 0;

  for (const item of items) {
    const unitPrice =
      targetCurrency && exchangeRates
        ? getProductPricesInCurrency(item.product, targetCurrency, exchangeRates).sellingPrice
        : item.product.sellingPrice;

    const itemTotal = calculateItemTotal(
      unitPrice,
      item.quantity,
      item.itemDiscountPercent
    );
    subtotal += itemTotal;
    totalItemsCount += item.quantity;
  }

  subtotal = roundCurrencyValue(subtotal);

  const clampedGlobalDiscount = Math.max(0, Math.min(100, globalDiscountPercent));
  const discountAmount = roundCurrencyValue(subtotal * (clampedGlobalDiscount / 100));
  const netSubtotal = Math.max(0, roundCurrencyValue(subtotal - discountAmount));

  const safeTaxRate = Math.max(0, taxRatePercent);
  let taxAmount = 0;
  let grandTotal = 0;

  if (isTaxInclusive) {
    // Tax is already baked into prices: Tax = netSubtotal - (netSubtotal / (1 + rate/100))
    taxAmount = roundCurrencyValue(netSubtotal - netSubtotal / (1 + safeTaxRate / 100));
    grandTotal = netSubtotal;
  } else {
    // Tax is added on top of net subtotal
    taxAmount = roundCurrencyValue(netSubtotal * (safeTaxRate / 100));
    grandTotal = roundCurrencyValue(netSubtotal + taxAmount);
  }

  return {
    subtotal,
    discountAmount,
    netSubtotal,
    taxAmount,
    grandTotal,
    totalItemsCount,
  };
}

/**
 * Calculates change to be returned to customer for cash transactions.
 */
export function calculateChangeDue(amountTendered: number, grandTotal: number): number {
  if (amountTendered < grandTotal) return 0;
  return roundCurrencyValue(amountTendered - grandTotal);
}

export interface DebtBreakdownResult {
  paymentStatus: PaymentSettlementStatus;
  amountPaid: number;
  debtAmount: number;
  changeDue: number;
}

/**
 * Calculates paid amount, remaining debt, and change due based on payment status and tendered amount.
 */
export function calculateDebtBreakdown(
  grandTotal: number,
  paymentStatus: PaymentSettlementStatus = 'paid',
  amountTendered?: number
): DebtBreakdownResult {
  const safeTotal = Math.max(0, roundCurrencyValue(grandTotal));

  if (paymentStatus === 'unpaid') {
    return {
      paymentStatus: 'unpaid',
      amountPaid: 0,
      debtAmount: safeTotal,
      changeDue: 0,
    };
  }

  if (paymentStatus === 'partial') {
    const rawPaid = Number.isFinite(amountTendered) ? Math.max(0, Number(amountTendered)) : 0;
    const clampedPaid = roundCurrencyValue(Math.min(safeTotal, rawPaid));
    const debt = roundCurrencyValue(Math.max(0, safeTotal - clampedPaid));
    return {
      paymentStatus: debt <= 0 ? 'paid' : clampedPaid <= 0 ? 'unpaid' : 'partial',
      amountPaid: clampedPaid,
      debtAmount: debt,
      changeDue: 0,
    };
  }

  // Default: 'paid' (Paid in full)
  const tendered =
    amountTendered !== undefined && Number.isFinite(amountTendered)
      ? Math.max(safeTotal, Number(amountTendered))
      : safeTotal;
  return {
    paymentStatus: 'paid',
    amountPaid: safeTotal,
    debtAmount: 0,
    changeDue: roundCurrencyValue(Math.max(0, tendered - safeTotal)),
  };
}

/**
 * Returns a localized display label for any payment method.
 */
export function formatPaymentMethodLabel(
  method: PaymentMethod,
  language: AppLanguage = 'en'
): string {
  const isAr = language === 'ar';
  switch (method) {
    case 'bank_transfer':
      return isAr ? 'تحويل بنكي' : 'Bank Transfer';
    case 'cash':
      return isAr ? 'نقداً (كاش)' : 'Cash';
    case 'qr_nfc':
      return isAr ? 'محفظة رقمية (QR/NFC)' : 'Digital Wallet (QR/NFC)';
    case 'card':
      return isAr ? 'تحويل بنكي / بطاقة' : 'Bank Transfer / Card';
    default:
      return String(method);
  }
}

export interface CheckoutValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates whether a checkout submission satisfies business criteria, including bank transfer reference and debt rules.
 */
export function validateCheckout(
  items: CartItem[],
  paymentMethod: PaymentMethod,
  amountTendered: number,
  grandTotal: number,
  details?: CheckoutPaymentDetails
): CheckoutValidationResult {
  if (!items || items.length === 0) {
    return { valid: false, error: 'Shopping cart cannot be empty.' };
  }

  if (grandTotal < 0) {
    return { valid: false, error: 'Total amount cannot be negative.' };
  }

  for (const item of items) {
    if (item.quantity <= 0) {
      return { valid: false, error: `Invalid quantity for ${item.product.name}.` };
    }
    if (item.quantity > item.product.stock) {
      return {
        valid: false,
        error: `Insufficient stock for ${item.product.name}. In stock: ${item.product.stock}, requested: ${item.quantity}.`,
      };
    }
  }

  const paymentStatus: PaymentSettlementStatus = details?.paymentStatus || 'paid';

  // If bank_transfer is chosen and customer is paying (full or partial), require operation reference number
  if (paymentMethod === 'bank_transfer' && paymentStatus !== 'unpaid') {
    const ref = details?.transferReference?.trim() || '';
    if (!ref) {
      return {
        valid: false,
        error: 'Transaction reference number (رقم العملية) is required for Bank Transfer.',
      };
    }
  }

  if (paymentStatus === 'partial') {
    const paid = details?.amountPaid !== undefined ? details.amountPaid : amountTendered;
    if (!Number.isFinite(paid) || paid <= 0) {
      return {
        valid: false,
        error: 'Partial payment amount must be greater than zero, or choose Unpaid (Full Debt).',
      };
    }
    if (paid > grandTotal + 0.0001) {
      return {
        valid: false,
        error: 'Partial payment amount cannot exceed the grand total.',
      };
    }
  } else if (paymentStatus === 'paid' && paymentMethod === 'cash') {
    if (amountTendered < grandTotal - 0.0001) {
      return {
        valid: false,
        error: `Tendered amount ($${amountTendered.toFixed(2)}) is less than total due ($${grandTotal.toFixed(2)}).`,
      };
    }
  }

  return { valid: true };
}

/**
 * Currency formatter with symbol placement and localized numerals.
 */
export function formatCurrency(
  amount: number,
  currency: SupportedCurrency = 'USD',
  locale: string = 'en'
): string {
  const safeAmount = isNaN(amount) ? 0 : amount;
  const code = (currency || 'SDG').toUpperCase();

  const currencySymbols: Record<string, { en: string; ar: string }> = {
    SDG: { en: 'SDG ', ar: ' ج.س' },
    USD: { en: '$', ar: '$' },
    SAR: { en: 'SAR ', ar: ' ر.س' },
    AED: { en: 'AED ', ar: ' د.إ' },
    EUR: { en: '€', ar: '€' },
    GBP: { en: '£', ar: '£' },
    EGP: { en: 'EGP ', ar: ' ج.م' },
    QAR: { en: 'QAR ', ar: ' ر.ق' },
    KWD: { en: 'KWD ', ar: ' د.ك' },
    TRY: { en: '₺', ar: '₺' },
  };

  const isMicro = Math.abs(safeAmount) > 0 && Math.abs(safeAmount) < 0.05;
  const formattedNum = safeAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: isMicro ? 4 : 2,
  });

  const sym = currencySymbols[code] || { en: `${code} `, ar: ` ${code}` };

  if (locale === 'ar') {
    if (['SAR', 'AED', 'SDG', 'EGP', 'QAR', 'KWD'].includes(code) || !currencySymbols[code]) {
      return `${formattedNum}${sym.ar}`;
    }
    return `${sym.ar}${formattedNum}`;
  }

  return `${sym.en}${formattedNum}`;
}

export const DEFAULT_BASELINE_EXCHANGE_RATES: Record<string, number> = {
  SDG: 1,
  USD: 2700,
  SAR: 720,
  AED: 735,
  EUR: 2950,
  GBP: 3450,
};

export interface ConvertedTransactionView {
  currency: SupportedCurrency;
  originalCurrency: SupportedCurrency;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  grandTotal: number;
  amountPaid: number;
  debtAmount: number;
  amountTendered: number;
  changeDue: number;
  items: {
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    discountPercent: number;
    total: number;
  }[];
  historicalGrandTotal: number;
  liveGrandTotal: number;
  indexedGrandTotal: number;
  rateDifference: number;
  referenceCurrency: string;
  historicalRate: number;
  currentRate: number;
  hasRateChanged: boolean;
}

/**
 * Converts all monetary fields of a Transaction into targetCurrency according to the chosen
 * exchange rate valuation mode:
 * - 'live': Converts from tx.currency -> targetCurrency using current live exchange rates.
 * - 'indexed': Anchors the transaction's value at the time of sale in anchorCurrency (e.g. USD)
 *              using the invoice's historical rate snapshot, and re-values it at the current live rate.
 * - 'historical': Converts from tx.currency -> targetCurrency using the historical snapshot rate at the time of sale.
 */
export function getConvertedTransactionView(
  tx: Transaction,
  targetCurrency: SupportedCurrency = 'SDG',
  currentExchangeRates: Record<string, number> = DEFAULT_BASELINE_EXCHANGE_RATES,
  mode: SalesRateValuationMode = 'live',
  anchorCurrency: string = 'USD'
): ConvertedTransactionView {
  const txCurrency = (tx.currency || 'SDG').toString().toUpperCase().trim();
  const target = (targetCurrency || 'SDG').toString().toUpperCase().trim();
  const anchor = (anchorCurrency || 'USD').toString().toUpperCase().trim();

  const liveRates: Record<string, number> = {
    ...DEFAULT_BASELINE_EXCHANGE_RATES,
    ...(currentExchangeRates || {}),
    SDG: 1,
  };

  const snapshotRates: Record<string, number> = {
    ...DEFAULT_BASELINE_EXCHANGE_RATES,
    ...(tx.exchangeRatesSnapshot || {}),
    SDG: 1,
  };

  if (tx.exchangeRateUsed && tx.exchangeRateUsed > 0) {
    if (txCurrency !== 'SDG') {
      snapshotRates[txCurrency] = Number(tx.exchangeRateUsed);
    } else {
      snapshotRates[anchor] = Number(tx.exchangeRateUsed);
    }
  }

  const convertAmount = (amount: number, evalMode: SalesRateValuationMode): number => {
    if (!Number.isFinite(amount) || amount <= 0) return 0;

    if (evalMode === 'historical') {
      return convertCurrencyAmount(amount, txCurrency, target, snapshotRates);
    }

    if (evalMode === 'indexed') {
      const txRateSnapshot =
        txCurrency === 'SDG'
          ? 1
          : snapshotRates[txCurrency] && snapshotRates[txCurrency] > 0
          ? Number(snapshotRates[txCurrency])
          : 1;
      const anchorRateSnapshot =
        anchor === 'SDG'
          ? 1
          : snapshotRates[anchor] && snapshotRates[anchor] > 0
          ? Number(snapshotRates[anchor])
          : 1;

      const anchorAmountRaw = (amount * txRateSnapshot) / anchorRateSnapshot;

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

      const finalTargetRaw = (anchorAmountRaw * anchorRateLive) / targetRateLive;
      return roundCurrencyValue(finalTargetRaw);
    }

    // Default: 'live'
    return convertCurrencyAmount(amount, txCurrency, target, liveRates);
  };

  const rawPaid = tx.amountPaid !== undefined ? tx.amountPaid : tx.grandTotal;
  const rawDebt = tx.debtAmount || 0;

  const subtotal = convertAmount(tx.subtotal, mode);
  const taxAmount = convertAmount(tx.taxAmount, mode);
  const discountAmount = convertAmount(tx.discountAmount, mode);
  const grandTotal = convertAmount(tx.grandTotal, mode);
  const amountPaid = convertAmount(rawPaid, mode);
  const debtAmount = convertAmount(rawDebt, mode);
  const amountTendered = convertAmount(tx.amountTendered, mode);
  const changeDue = convertAmount(tx.changeDue, mode);

  const items = tx.items.map((item) => ({
    ...item,
    unitPrice: convertAmount(item.unitPrice, mode),
    total: convertAmount(item.total, mode),
  }));

  const historicalGrandTotal = convertAmount(tx.grandTotal, 'historical');
  const liveGrandTotal = convertAmount(tx.grandTotal, 'live');
  const indexedGrandTotal = convertAmount(tx.grandTotal, 'indexed');
  const rateDifference = roundCurrencyValue(grandTotal - historicalGrandTotal);

  const referenceCurrency = target !== 'SDG' ? target : anchor;
  const historicalRate =
    referenceCurrency === 'SDG' ? 1 : Number(snapshotRates[referenceCurrency] || 1);
  const currentRate =
    referenceCurrency === 'SDG' ? 1 : Number(liveRates[referenceCurrency] || 1);
  const hasRateChanged = Math.abs(currentRate - historicalRate) > 0.0001;

  return {
    currency: target,
    originalCurrency: txCurrency,
    subtotal,
    taxAmount,
    discountAmount,
    grandTotal,
    amountPaid,
    debtAmount,
    amountTendered,
    changeDue,
    items,
    historicalGrandTotal,
    liveGrandTotal,
    indexedGrandTotal,
    rateDifference,
    referenceCurrency,
    historicalRate,
    currentRate,
    hasRateChanged,
  };
}

/**
 * Re-prices a transaction's stored monetary values and remaining debt to the current exchange rate
 * (anchored against anchorCurrency, e.g. USD) and updates its exchangeRatesSnapshot.
 */
export function repriceTransactionToNewRate(
  tx: Transaction,
  currentExchangeRates: Record<string, number>,
  anchorCurrency: string = 'USD'
): Transaction {
  const txCurrency = (tx.currency || 'SDG').toString().toUpperCase().trim();
  const indexedViewInTxCurrency = getConvertedTransactionView(
    tx,
    txCurrency,
    currentExchangeRates,
    'indexed',
    anchorCurrency
  );

  const liveRates: Record<string, number> = {
    ...DEFAULT_BASELINE_EXCHANGE_RATES,
    ...(currentExchangeRates || {}),
    SDG: 1,
  };
  const anchor = (anchorCurrency || 'USD').toString().toUpperCase().trim();
  const nextRateUsed =
    txCurrency === 'SDG' ? Number(liveRates[anchor] || 2700) : Number(liveRates[txCurrency] || 1);

  return {
    ...tx,
    currency: txCurrency,
    subtotal: indexedViewInTxCurrency.subtotal,
    taxAmount: indexedViewInTxCurrency.taxAmount,
    discountAmount: indexedViewInTxCurrency.discountAmount,
    grandTotal: indexedViewInTxCurrency.grandTotal,
    amountPaid: indexedViewInTxCurrency.amountPaid,
    debtAmount: indexedViewInTxCurrency.debtAmount,
    amountTendered: indexedViewInTxCurrency.amountTendered,
    changeDue: indexedViewInTxCurrency.changeDue,
    items: indexedViewInTxCurrency.items,
    exchangeRateUsed: nextRateUsed,
    exchangeRatesSnapshot: liveRates,
  };
}


