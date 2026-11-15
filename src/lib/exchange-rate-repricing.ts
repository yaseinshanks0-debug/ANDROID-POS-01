/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Product,
  ProductModificationEntry,
  ProductPriceHistoryEntry,
  SdgPriceAdjustmentPolicy,
} from './types';
import { roundCurrencyValue } from './pos-calculations';

export interface RateChangeMetrics {
  isValid: boolean;
  previousRate: number;
  newRate: number;
  ratio: number;
  changePercent: number;
  direction: 'increase' | 'decrease' | 'unchanged';
}

export interface SdgRepricingPreviewSample {
  productName: string;
  productNameAr?: string;
  oldSellingPrice: number;
  newSellingPrice: number;
  isSyntheticExample: boolean;
}

export interface SdgRepricingPreviewResult {
  currencyCode: string;
  metrics: RateChangeMetrics;
  policy: SdgPriceAdjustmentPolicy;
  willAdjust: boolean;
  eligibleSdgProductCount: number;
  foreignPricedProductCount: number;
  sample: SdgRepricingPreviewSample;
}

export interface RepriceSdgProductsParams {
  products: Product[];
  currencyCode: string;
  previousRate: number;
  newRate: number;
  policy?: SdgPriceAdjustmentPolicy;
  adjustCostPrice?: boolean;
  adjustSellingPrice?: boolean;
  roundingStep?: number;
  changedBy?: string;
  nowIso?: string;
}

export interface RepriceSdgProductsResult {
  updatedProducts: Product[];
  changedProducts: Product[];
  affectedCount: number;
  skippedForeignCount: number;
  changePercent: number;
  ratio: number;
  direction: 'increase' | 'decrease' | 'unchanged';
}

/**
 * Resolves the authoritative price currency code stored on a product (defaults to 'SDG').
 */
export function getEffectiveProductPriceCurrency(
  product: Pick<Product, 'priceCurrency' | 'customFields'>
): string {
  return String(product.priceCurrency || product.customFields?.priceCurrency || 'SDG')
    .toUpperCase()
    .trim() || 'SDG';
}

/**
 * Returns true if the product's stored prices are denominated in Sudanese Pounds (SDG).
 * Foreign-priced products (e.g. USD, SAR) already convert dynamically via `getProductPricesInCurrency`
 * and must NEVER be double-scaled.
 */
export function isSdgPricedProduct(
  product: Pick<Product, 'priceCurrency' | 'customFields'>
): boolean {
  return getEffectiveProductPriceCurrency(product) === 'SDG';
}

/**
 * Evaluates a foreign currency exchange rate change relative to SDG.
 */
export function computeRateChangeMetrics(
  previousRate: number,
  newRate: number
): RateChangeMetrics {
  const prev = Number(previousRate);
  const next = Number(newRate);

  if (!Number.isFinite(prev) || prev <= 0 || !Number.isFinite(next) || next <= 0) {
    return {
      isValid: false,
      previousRate: Number.isFinite(prev) ? prev : 0,
      newRate: Number.isFinite(next) ? next : 0,
      ratio: 1,
      changePercent: 0,
      direction: 'unchanged',
    };
  }

  if (Math.abs(next - prev) <= 0.0001) {
    return {
      isValid: true,
      previousRate: prev,
      newRate: next,
      ratio: 1,
      changePercent: 0,
      direction: 'unchanged',
    };
  }

  const ratio = next / prev;
  const changePercent = Math.round(((next - prev) / prev) * 1000) / 10;
  return {
    isValid: true,
    previousRate: prev,
    newRate: next,
    ratio,
    changePercent,
    direction: next > prev ? 'increase' : 'decrease',
  };
}

/**
 * Scales an SDG monetary amount safely by a positive rate multiplier.
 */
export function scaleSdgAmount(
  amount: number,
  ratio: number,
  roundingStep: number = 0
): number {
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) return 0;
  if (!Number.isFinite(ratio) || ratio <= 0) return roundCurrencyValue(numericAmount, 'SDG');

  const rawScaled = numericAmount * ratio;
  if (Number.isFinite(roundingStep) && roundingStep > 0) {
    const stepped = Math.round(rawScaled / roundingStep) * roundingStep;
    return roundCurrencyValue(stepped > 0 ? stepped : rawScaled, 'SDG');
  }
  return roundCurrencyValue(rawScaled, 'SDG');
}

function shouldApplyForPolicy(
  metrics: RateChangeMetrics,
  policy: SdgPriceAdjustmentPolicy
): boolean {
  if (!metrics.isValid || metrics.direction === 'unchanged') return false;
  if (policy === 'increase_only') {
    return metrics.direction === 'increase';
  }
  return true;
}

/**
 * Computes a read-only preview of how a foreign currency exchange rate modification
 * will impact SDG-priced products in the catalog.
 */
export function previewSdgRepricingImpact(params: {
  products: Product[];
  currencyCode: string;
  previousRate: number;
  newRate: number;
  policy?: SdgPriceAdjustmentPolicy;
  roundingStep?: number;
}): SdgRepricingPreviewResult {
  const cleanCode = String(params.currencyCode || '').toUpperCase().trim();
  const policy: SdgPriceAdjustmentPolicy = params.policy || 'increase_only';
  const metrics = computeRateChangeMetrics(params.previousRate, params.newRate);
  const roundingStep = params.roundingStep || 0;

  let eligibleSdgProductCount = 0;
  let foreignPricedProductCount = 0;
  let sampleProduct: Product | null = null;

  for (const p of params.products || []) {
    if (!p) continue;
    if (isSdgPricedProduct(p)) {
      if (Number(p.sellingPrice) > 0 || Number(p.costPrice) > 0) {
        eligibleSdgProductCount += 1;
        if (!sampleProduct && Number(p.sellingPrice) > 0) {
          sampleProduct = p;
        }
      }
    } else {
      foreignPricedProductCount += 1;
    }
  }

  const willAdjust =
    cleanCode !== '' &&
    cleanCode !== 'SDG' &&
    eligibleSdgProductCount > 0 &&
    shouldApplyForPolicy(metrics, policy);

  const baseExamplePrice = sampleProduct ? Number(sampleProduct.sellingPrice) : 1000;
  const scaledExamplePrice = shouldApplyForPolicy(metrics, policy)
    ? scaleSdgAmount(baseExamplePrice, metrics.ratio, roundingStep)
    : baseExamplePrice;

  return {
    currencyCode: cleanCode,
    metrics,
    policy,
    willAdjust,
    eligibleSdgProductCount,
    foreignPricedProductCount,
    sample: {
      productName: sampleProduct ? sampleProduct.name : 'Sample Item',
      productNameAr: sampleProduct ? sampleProduct.nameAr || sampleProduct.name : 'منتج افتراضي',
      oldSellingPrice: baseExamplePrice,
      newSellingPrice: scaledExamplePrice,
      isSyntheticExample: !sampleProduct,
    },
  };
}

/**
 * Proportionally adjusts SDG-denominated product prices (selling, cost, and pack prices)
 * when a foreign currency exchange rate increases (or changes proportionally), while leaving
 * natively foreign-priced products untouched and recording full bilingual price audit trails.
 */
export function repriceSdgProductsOnExchangeRateChange({
  products,
  currencyCode,
  previousRate,
  newRate,
  policy = 'increase_only',
  adjustCostPrice = true,
  adjustSellingPrice = true,
  roundingStep = 0,
  changedBy = 'POS Operator',
  nowIso,
}: RepriceSdgProductsParams): RepriceSdgProductsResult {
  const cleanCode = String(currencyCode || '').toUpperCase().trim();
  const metrics = computeRateChangeMetrics(previousRate, newRate);

  if (
    !Array.isArray(products) ||
    products.length === 0 ||
    !cleanCode ||
    cleanCode === 'SDG' ||
    !shouldApplyForPolicy(metrics, policy)
  ) {
    return {
      updatedProducts: Array.isArray(products) ? products : [],
      changedProducts: [],
      affectedCount: 0,
      skippedForeignCount: Array.isArray(products)
        ? products.filter((p) => p && !isSdgPricedProduct(p)).length
        : 0,
      changePercent: metrics.changePercent,
      ratio: metrics.ratio,
      direction: metrics.direction,
    };
  }

  const timestamp = nowIso || new Date().toISOString();
  const actor = String(changedBy || 'POS Operator').trim() || 'POS Operator';
  const sign = metrics.changePercent > 0 ? `+${metrics.changePercent}%` : `${metrics.changePercent}%`;
  const noteEn = `Auto-adjusted on ${cleanCode} rate change (${metrics.previousRate} -> ${metrics.newRate}, ${sign})`;
  const noteAr = `تعديل تلقائي مع تغيّر سعر صرف ${cleanCode} (${metrics.previousRate} ← ${metrics.newRate}، ${sign})`;

  const changedProducts: Product[] = [];
  let skippedForeignCount = 0;

  const updatedProducts = products.map((prod) => {
    if (!prod) return prod;
    if (!isSdgPricedProduct(prod)) {
      skippedForeignCount += 1;
      return prod;
    }

    const oldSell = Number(prod.sellingPrice) || 0;
    const oldCost = Number(prod.costPrice) || 0;
    const rawPackSell = prod.packSellingPrice ?? prod.customFields?.packSellingPrice;
    const rawPackCost = prod.packCostPrice ?? prod.customFields?.packCostPrice;
    const oldPackSell =
      rawPackSell !== undefined && Number.isFinite(Number(rawPackSell)) && Number(rawPackSell) > 0
        ? Number(rawPackSell)
        : undefined;
    const oldPackCost =
      rawPackCost !== undefined && Number.isFinite(Number(rawPackCost)) && Number(rawPackCost) > 0
        ? Number(rawPackCost)
        : undefined;

    const nextSell =
      adjustSellingPrice && oldSell > 0
        ? scaleSdgAmount(oldSell, metrics.ratio, roundingStep)
        : oldSell;
    const nextCost =
      adjustCostPrice && oldCost > 0
        ? scaleSdgAmount(oldCost, metrics.ratio, roundingStep)
        : oldCost;
    const nextPackSell =
      oldPackSell !== undefined
        ? adjustSellingPrice
          ? scaleSdgAmount(oldPackSell, metrics.ratio, roundingStep)
          : oldPackSell
        : undefined;
    const nextPackCost =
      oldPackCost !== undefined
        ? adjustCostPrice
          ? scaleSdgAmount(oldPackCost, metrics.ratio, roundingStep)
          : oldPackCost
        : undefined;

    const sellChanged = Math.abs(nextSell - oldSell) > 0.0001;
    const costChanged = Math.abs(nextCost - oldCost) > 0.0001;
    const packSellChanged =
      nextPackSell !== undefined &&
      oldPackSell !== undefined &&
      Math.abs(nextPackSell - oldPackSell) > 0.0001;
    const packCostChanged =
      nextPackCost !== undefined &&
      oldPackCost !== undefined &&
      Math.abs(nextPackCost - oldPackCost) > 0.0001;

    if (!sellChanged && !costChanged && !packSellChanged && !packCostChanged) {
      return prod;
    }

    const prevPriceHistory: ProductPriceHistoryEntry[] =
      prod.priceHistory || prod.customFields?.priceHistory || [];
    const prevModHistory: ProductModificationEntry[] =
      prod.modificationHistory || prod.customFields?.modificationHistory || [];

    const priceEntry: ProductPriceHistoryEntry = {
      id: `ph_fx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp,
      previousCostPrice: oldCost,
      newCostPrice: nextCost,
      previousSellingPrice: oldSell,
      newSellingPrice: nextSell,
      currency: 'SDG',
      changedBy: actor,
      note: `${noteAr} | ${noteEn}`,
    };
    const nextPriceHistory = [priceEntry, ...prevPriceHistory].slice(0, 30);

    const changedFields: string[] = [];
    const summaryPartsEn: string[] = [];
    const summaryPartsAr: string[] = [];
    if (sellChanged) {
      changedFields.push('sellingPrice');
      summaryPartsEn.push(`Selling: ${oldSell} -> ${nextSell} SDG`);
      summaryPartsAr.push(`البيع: ${oldSell} ← ${nextSell} ج.س`);
    }
    if (costChanged) {
      changedFields.push('costPrice');
      summaryPartsEn.push(`Cost: ${oldCost} -> ${nextCost} SDG`);
      summaryPartsAr.push(`التكلفة: ${oldCost} ← ${nextCost} ج.س`);
    }
    if (packSellChanged && nextPackSell !== undefined) {
      changedFields.push('packSellingPrice');
      summaryPartsEn.push(`Pack Selling: ${oldPackSell} -> ${nextPackSell} SDG`);
      summaryPartsAr.push(`بيع العبوة: ${oldPackSell} ← ${nextPackSell} ج.س`);
    }
    if (packCostChanged && nextPackCost !== undefined) {
      changedFields.push('packCostPrice');
      summaryPartsEn.push(`Pack Cost: ${oldPackCost} -> ${nextPackCost} SDG`);
      summaryPartsAr.push(`تكلفة العبوة: ${oldPackCost} ← ${nextPackCost} ج.س`);
    }

    const modEntry: ProductModificationEntry = {
      id: `mod_fx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp,
      action: 'price_changed',
      summaryEn: `${noteEn} • ${summaryPartsEn.join(' • ')}`,
      summaryAr: `${noteAr} • ${summaryPartsAr.join(' • ')}`,
      changedFields,
      changedBy: actor,
    };
    const nextModHistory = [modEntry, ...prevModHistory].slice(0, 40);

    const previousCostPrice = costChanged
      ? oldCost
      : prod.previousCostPrice ?? prod.customFields?.previousCostPrice;
    const previousSellingPrice = sellChanged
      ? oldSell
      : prod.previousSellingPrice ?? prod.customFields?.previousSellingPrice;

    const updatedProduct: Product = {
      ...prod,
      sellingPrice: nextSell,
      costPrice: nextCost,
      ...(nextPackSell !== undefined ? { packSellingPrice: nextPackSell } : {}),
      ...(nextPackCost !== undefined ? { packCostPrice: nextPackCost } : {}),
      previousCostPrice,
      previousSellingPrice,
      priceUpdatedAt: timestamp,
      priceHistory: nextPriceHistory,
      modificationHistory: nextModHistory,
      updatedAt: timestamp,
      customFields: {
        ...(prod.customFields || {}),
        ...(nextPackSell !== undefined ? { packSellingPrice: nextPackSell } : {}),
        ...(nextPackCost !== undefined ? { packCostPrice: nextPackCost } : {}),
        previousCostPrice,
        previousSellingPrice,
        priceUpdatedAt: timestamp,
        priceHistory: nextPriceHistory,
        modificationHistory: nextModHistory,
        changedBy: actor,
      },
    };

    changedProducts.push(updatedProduct);
    return updatedProduct;
  });

  return {
    updatedProducts,
    changedProducts,
    affectedCount: changedProducts.length,
    skippedForeignCount,
    changePercent: metrics.changePercent,
    ratio: metrics.ratio,
    direction: metrics.direction,
  };
}
