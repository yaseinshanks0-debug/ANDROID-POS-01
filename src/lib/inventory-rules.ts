/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Product,
  ProductCustomFields,
  ProductModificationEntry,
  ProductPriceHistoryEntry,
  StockMovementType,
} from './types';

/**
 * Checks if product has sufficient stock for requested quantity.
 */
export function checkStockAvailability(
  product: Pick<Product, 'stock'>,
  requestedQuantity: number
): { available: boolean; remainingAfterSale: number } {
  if (requestedQuantity <= 0) {
    return { available: false, remainingAfterSale: product.stock };
  }
  const remaining = product.stock - requestedQuantity;
  return {
    available: remaining >= 0,
    remainingAfterSale: remaining,
  };
}

/**
 * Calculates updated stock quantity based on stock movement type and quantity delta.
 */
export function calculateStockAdjustment(
  currentStock: number,
  type: StockMovementType,
  amount: number
): number {
  const safeAmount = Math.max(0, Math.floor(amount));
  switch (type) {
    case 'sale':
    case 'damage':
    case 'loss':
      return Math.max(0, currentStock - safeAmount);
    case 'restock':
      return currentStock + safeAmount;
    case 'audit':
      return safeAmount;
    default:
      return currentStock;
  }
}

/**
 * Checks if product is at or below its low stock alert threshold.
 */
export function isLowStock(stock: number, minStockAlert: number = 5): boolean {
  return stock <= minStockAlert;
}

/**
 * Generates a collision-resistant, audit-safe transaction reference ID using `crypto.randomUUID()`.
 */
export function generateTransactionId(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');

  let uniqueSuffix: string;
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    uniqueSuffix = globalThis.crypto.randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase();
  } else if (typeof globalThis.crypto?.getRandomValues === 'function') {
    const bytes = new Uint8Array(6);
    globalThis.crypto.getRandomValues(bytes);
    uniqueSuffix = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();
  } else {
    uniqueSuffix = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`.toUpperCase();
  }

  return `TXN-${y}${m}${d}-${uniqueSuffix}`;
}

/**
 * Generates a valid 12-digit EAN/UPC-like barcode ONLY when explicitly requested by the user.
 */
export function generateBarcode(): string {
  let code = '200'; // In-store prefix
  for (let i = 0; i < 9; i++) {
    code += Math.floor(Math.random() * 10).toString();
  }
  return code;
}

/**
 * Generates a collision-resistant idempotency key to prevent duplicate checkout requests.
 */
export function generateIdempotencyKey(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return `idemp_${Date.now()}_${globalThis.crypto.randomUUID()}`;
  }
  return `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Normalizes a primary barcode and optional additional barcodes into a deduplicated array
 * where the first item is always the primary barcode.
 */
export function normalizeProductBarcodes(
  primaryBarcode?: string | null,
  extraBarcodes?: string[] | null
): string[] {
  const result: string[] = [];
  const seen = new Set<string>();

  const addCode = (raw?: string | null) => {
    if (!raw || typeof raw !== 'string') return;
    const trimmed = raw.trim();
    if (!trimmed) return;
    if (!seen.has(trimmed)) {
      seen.add(trimmed);
      result.push(trimmed);
    }
  };

  addCode(primaryBarcode);
  if (Array.isArray(extraBarcodes)) {
    for (const code of extraBarcodes) {
      addCode(code);
    }
  }
  return result;
}

/**
 * Normalizes a product barcode for database persistence:
 * trims whitespace and returns `null` instead of `''` so multiple products without barcodes
 * do not collide on the PostgreSQL `UNIQUE` constraint on `products.barcode`.
 */
export function normalizeDbProductBarcode(barcode?: string | null): string | null {
  if (typeof barcode !== 'string') return null;
  const trimmed = barcode.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Returns all barcodes associated with a product (primary + any secondary barcodes in barcodes or customFields).
 */
export function getAllProductBarcodes(
  product: Pick<Product, 'barcode' | 'barcodes' | 'customFields'>
): string[] {
  const extra = product.barcodes || product.customFields?.barcodes || [];
  return normalizeProductBarcodes(product.barcode, extra);
}

/**
 * Splits a raw SKU / multi-barcode input string (separated by "|", ",", ";", or spaces)
 * into clean individual barcode tokens.
 */
export function parseBarcodeSkuInput(rawInput?: string | null): string[] {
  if (!rawInput || typeof rawInput !== 'string') return [];
  const parts = rawInput
    .split(/[|,;\n]+/)
    .map((part) => part.trim())
    .filter(Boolean);
  return normalizeProductBarcodes(parts[0] || '', parts.slice(1));
}

/**
 * Synchronizes a product's SKU with its single barcode or multiple barcodes.
 * When the product has one or more barcodes, SKU is formatted as those barcode(s) (e.g. "6281001" or "6281001 | 6281002").
 */
export function formatProductBarcodeSku(
  barcodes: string[],
  fallbackSku?: string | null,
  serialNumber?: number | null
): string {
  const normalized = normalizeProductBarcodes(barcodes[0] || '', barcodes.slice(1));
  if (normalized.length > 0) {
    return normalized.join(' | ');
  }
  const cleanFallback = (fallbackSku || '').trim();
  if (cleanFallback) return cleanFallback;
  const safeSerial = Number(serialNumber);
  if (Number.isFinite(safeSerial) && safeSerial > 0) {
    return `ITEM-${String(Math.floor(safeSerial)).padStart(4, '0')}`;
  }
  return `ITEM-${Date.now().toString().slice(-4)}`;
}

export interface ProductExpiryStatusInfo {
  expiryDate: string | null;
  status: 'none' | 'expired' | 'expiring_soon' | 'valid';
  daysRemaining: number | null;
}

/**
 * Evaluates the expiry status of a product given its expiryDate (YYYY-MM-DD) or customFields.expiryDate.
 */
export function getProductExpiryStatus(
  productOrDate?: Pick<Product, 'expiryDate' | 'customFields'> | string | null,
  nowDate: Date = new Date()
): ProductExpiryStatusInfo {
  const rawDate =
    typeof productOrDate === 'string'
      ? productOrDate
      : productOrDate && typeof productOrDate === 'object'
      ? productOrDate.expiryDate || productOrDate.customFields?.expiryDate
      : null;

  const cleanDate = typeof rawDate === 'string' ? rawDate.trim() : '';
  if (!cleanDate) {
    return { expiryDate: null, status: 'none', daysRemaining: null };
  }

  const parsed = new Date(`${cleanDate.slice(0, 10)}T23:59:59`);
  if (Number.isNaN(parsed.getTime())) {
    return { expiryDate: cleanDate, status: 'none', daysRemaining: null };
  }

  const todayStart = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate());
  const expiryDay = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  const diffDays = Math.round((expiryDay.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { expiryDate: cleanDate.slice(0, 10), status: 'expired', daysRemaining: diffDays };
  }
  if (diffDays <= 30) {
    return { expiryDate: cleanDate.slice(0, 10), status: 'expiring_soon', daysRemaining: diffDays };
  }
  return { expiryDate: cleanDate.slice(0, 10), status: 'valid', daysRemaining: diffDays };
}

/**
 * Checks whether a search query or scanned code matches a product's primary barcode or any secondary barcode.
 */
export function matchesProductBarcode(
  product: Pick<Product, 'barcode' | 'barcodes' | 'customFields'>,
  queryOrCode: string,
  exact: boolean = false
): boolean {
  const clean = queryOrCode.trim();
  if (!clean) return false;
  const allCodes = getAllProductBarcodes(product);
  if (exact) {
    return allCodes.some((c) => c === clean);
  }
  return allCodes.some((c) => c.toLowerCase().includes(clean.toLowerCase()));
}

export interface ScannedBarcodeResolution {
  ok: boolean;
  code: string;
  primaryBarcode: string;
  additionalBarcodes: string[];
  errorEn?: string;
  errorAr?: string;
}

/**
 * Resolves a barcode scanned via camera (or captured from image) into a product's primary or additional barcode list,
 * checking for duplicates and conflicts with other products.
 * IMPORTANT: Never auto-generates a barcode if scannedCode is empty.
 */
export function resolveScannedProductBarcode(params: {
  scannedCode?: string;
  target: 'primary' | 'additional';
  currentPrimary: string;
  currentAdditional: string[];
  existingProducts: Pick<Product, 'id' | 'name' | 'nameAr' | 'barcode' | 'barcodes' | 'customFields'>[];
  editingProductId?: string | null;
}): ScannedBarcodeResolution {
  const code = (params.scannedCode || '').trim();
  if (!code) {
    return {
      ok: false,
      code: '',
      primaryBarcode: params.currentPrimary,
      additionalBarcodes: params.currentAdditional,
      errorEn: 'No barcode was detected or entered. Point the camera at a clear barcode or click Generate Barcode explicitly.',
      errorAr: 'لم يتم قراءة أو إدخال أي باركود. يرجى توجيه الكاميرا نحو باركود واضح أو الضغط على زر توليد باركود يدوياً.',
    };
  }

  // Check if another product already owns this barcode
  const conflict = params.existingProducts.find(
    (p) => (!params.editingProductId || p.id !== params.editingProductId) && matchesProductBarcode(p, code, true)
  );
  if (conflict) {
    return {
      ok: false,
      code,
      primaryBarcode: params.currentPrimary,
      additionalBarcodes: params.currentAdditional,
      errorEn: `Barcode "${code}" is already assigned to "${conflict.name}".`,
      errorAr: `الباركود "${code}" مستخدم بالفعل للمنتج "${conflict.nameAr || conflict.name}".`,
    };
  }

  const allExisting = normalizeProductBarcodes(params.currentPrimary, params.currentAdditional);

  if (params.target === 'primary') {
    const nextAdditional = params.currentAdditional.filter((c) => c.trim() !== code);
    return {
      ok: true,
      code,
      primaryBarcode: code,
      additionalBarcodes: nextAdditional,
    };
  }

  // target === 'additional'
  if (!params.currentPrimary.trim()) {
    return {
      ok: true,
      code,
      primaryBarcode: code,
      additionalBarcodes: params.currentAdditional,
    };
  }

  if (allExisting.includes(code)) {
    return {
      ok: false,
      code,
      primaryBarcode: params.currentPrimary,
      additionalBarcodes: params.currentAdditional,
      errorEn: `Barcode "${code}" is already added to this product.`,
      errorAr: `الباركود "${code}" مضاف بالفعل لهذا المنتج.`,
    };
  }

  return {
    ok: true,
    code,
    primaryBarcode: params.currentPrimary,
    additionalBarcodes: [...params.currentAdditional, code],
  };
}

/**
 * Extracts or infers the sequential serial number of a product.
 */
export function getProductSerialNumber(
  product: Partial<Pick<Product, 'id' | 'serialNumber' | 'customFields'>>,
  fallbackIndex?: number
): number {
  const direct = Number(product.serialNumber ?? product.customFields?.serialNumber);
  if (Number.isFinite(direct) && direct > 0) {
    return Math.floor(direct);
  }
  if (typeof product.id === 'string') {
    const match = product.id.match(/^prod-(\d+)$/);
    if (match) {
      const parsed = parseInt(match[1], 10);
      if (parsed > 0 && parsed < 100000) {
        return parsed;
      }
    }
  }
  return fallbackIndex !== undefined && fallbackIndex >= 0 ? fallbackIndex + 1 : 1;
}

/**
 * Formats a product serial number into a padded badge string (e.g. #0001).
 */
export function formatProductSerialNumber(serialNumber?: number | null): string {
  const safe = Number(serialNumber);
  if (!Number.isFinite(safe) || safe <= 0) return '#0001';
  return `#${String(Math.floor(safe)).padStart(4, '0')}`;
}

/**
 * Calculates the next sequential product serial number based on existing products.
 */
export function getNextProductSerialNumber(
  products: Array<Partial<Pick<Product, 'id' | 'serialNumber' | 'customFields'>>>
): number {
  if (!products || products.length === 0) return 1;
  let maxSerial = 0;
  products.forEach((p, idx) => {
    const s = getProductSerialNumber(p, idx);
    if (s > maxSerial) maxSerial = s;
  });
  return maxSerial + 1;
}

/**
 * Multi-word tokenized search across product Name (EN/AR), Description (EN/AR),
 * Sequential Serial Number (e.g. "1", "#1", "0001", "#0001"), SKU, Category, or any Barcode.
 */
export function matchesProductSearchQuery(
  product: Partial<Product>,
  query: string,
  fallbackIndex?: number
): boolean {
  const cleanQuery = (query || '').trim().toLowerCase();
  if (!cleanQuery) return true;

  const serial = getProductSerialNumber(product, fallbackIndex);
  const serialPlain = String(serial);
  const serialPadded3 = String(serial).padStart(3, '0');
  const serialPadded4 = String(serial).padStart(4, '0');
  const serialHashPlain = `#${serialPlain}`;
  const serialHashPadded3 = `#${serialPadded3}`;
  const serialHashPadded4 = `#${serialPadded4}`;

  const descEn = (product.description || product.customFields?.description || '').toString().toLowerCase();
  const descAr = (product.descriptionAr || product.customFields?.descriptionAr || '').toString().toLowerCase();
  const nameEn = (product.name || '').toLowerCase();
  const nameAr = (product.nameAr || '').toLowerCase();
  const sku = (product.sku || '').toLowerCase();
  const catEn = (product.category || '').toLowerCase();
  const catAr = (product.categoryAr || '').toLowerCase();
  const expiryStr = (product.expiryDate || product.customFields?.expiryDate || '').toString().toLowerCase();
  const barcodes = getAllProductBarcodes({
    barcode: product.barcode || '',
    barcodes: product.barcodes,
    customFields: product.customFields,
  }).map((b) => b.toLowerCase());

  const tokens = cleanQuery.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;

  return tokens.every((token) => {
    // Check serial number match (exact numeric token or #0001 prefix match)
    const strippedHash = token.startsWith('#') ? token.slice(1) : token;
    const isNumericToken = /^\d+$/.test(strippedHash);
    if (
      token === serialPlain ||
      token === serialPadded3 ||
      token === serialPadded4 ||
      token === serialHashPlain ||
      token === serialHashPadded3 ||
      token === serialHashPadded4 ||
      (isNumericToken && parseInt(strippedHash, 10) === serial)
    ) {
      return true;
    }

    if (nameEn.includes(token) || nameAr.includes(token)) return true;
    if (descEn.includes(token) || descAr.includes(token)) return true;
    if (sku.includes(token)) return true;
    if (catEn.includes(token) || catAr.includes(token)) return true;
    if (expiryStr && expiryStr.includes(token)) return true;
    if (barcodes.some((code) => code.includes(token))) return true;

    return false;
  });
}

/**
 * Builds the price history and modification audit trail when creating or updating a product.
 */
export function buildProductAuditTrail(params: {
  existingProduct?: Product | null;
  nextProduct: Partial<Product>;
  changedBy?: string;
  nowIso?: string;
}): {
  createdAt: string;
  previousCostPrice?: number;
  previousSellingPrice?: number;
  priceUpdatedAt?: string;
  priceHistory: ProductPriceHistoryEntry[];
  modificationHistory: ProductModificationEntry[];
} {
  const now = params.nowIso || new Date().toISOString();
  const actor = params.changedBy || 'Main Terminal';
  const existing = params.existingProduct;
  const next = params.nextProduct;

  const nextCurrency = (
    next.priceCurrency ||
    next.customFields?.priceCurrency ||
    existing?.priceCurrency ||
    existing?.customFields?.priceCurrency ||
    'SDG'
  )
    .toString()
    .toUpperCase();

  const nextCost = Number(next.costPrice ?? existing?.costPrice ?? 0);
  const nextSell = Number(next.sellingPrice ?? existing?.sellingPrice ?? 0);

  if (!existing) {
    const initMod: ProductModificationEntry = {
      id: `mod_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: now,
      action: 'created',
      summaryEn: `Product created with selling price ${nextSell} ${nextCurrency}`,
      summaryAr: `تمت إضافة المنتج بسعر بيع ${nextSell} ${nextCurrency}`,
      changedFields: ['created'],
      changedBy: actor,
    };
    const initPrice: ProductPriceHistoryEntry = {
      id: `ph_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: now,
      previousCostPrice: nextCost,
      newCostPrice: nextCost,
      previousSellingPrice: nextSell,
      newSellingPrice: nextSell,
      currency: nextCurrency,
      changedBy: actor,
      note: 'Initial price / السعر الابتدائي',
    };
    return {
      createdAt: next.createdAt || now,
      previousCostPrice: undefined,
      previousSellingPrice: undefined,
      priceUpdatedAt: now,
      priceHistory: [initPrice],
      modificationHistory: [initMod],
    };
  }

  const prevPriceHistory: ProductPriceHistoryEntry[] =
    existing.priceHistory || existing.customFields?.priceHistory || [];
  const prevModHistory: ProductModificationEntry[] =
    existing.modificationHistory || existing.customFields?.modificationHistory || [];

  const oldCost = Number(existing.costPrice || 0);
  const oldSell = Number(existing.sellingPrice || 0);
  const costChanged = Math.abs(nextCost - oldCost) > 0.0001;
  const sellChanged = Math.abs(nextSell - oldSell) > 0.0001;
  const priceChanged = costChanged || sellChanged;

  const changedFields: string[] = [];
  const summaryPartsEn: string[] = [];
  const summaryPartsAr: string[] = [];

  if (next.name !== undefined && next.name !== existing.name) {
    changedFields.push('name');
    summaryPartsEn.push(`Name: "${existing.name}" → "${next.name}"`);
    summaryPartsAr.push(`الاسم: "${existing.name}" ← "${next.name}"`);
  }
  if (next.nameAr !== undefined && (next.nameAr || '') !== (existing.nameAr || '')) {
    changedFields.push('nameAr');
    summaryPartsEn.push(`Arabic Name updated`);
    summaryPartsAr.push(`تعديل الاسم العربي إلى "${next.nameAr}"`);
  }
  const oldDesc = existing.description || existing.customFields?.description || '';
  const newDesc = next.description ?? next.customFields?.description ?? oldDesc;
  if (newDesc !== oldDesc) {
    changedFields.push('description');
    summaryPartsEn.push(`Description updated`);
    summaryPartsAr.push(`تحديث وصف المنتج`);
  }
  if (sellChanged) {
    changedFields.push('sellingPrice');
    summaryPartsEn.push(`Selling Price: ${oldSell} → ${nextSell} ${nextCurrency}`);
    summaryPartsAr.push(`سعر البيع: ${oldSell} ← ${nextSell} ${nextCurrency}`);
  }
  if (costChanged) {
    changedFields.push('costPrice');
    summaryPartsEn.push(`Cost Price: ${oldCost} → ${nextCost} ${nextCurrency}`);
    summaryPartsAr.push(`سعر التكلفة: ${oldCost} ← ${nextCost} ${nextCurrency}`);
  }
  if (next.stock !== undefined && Number(next.stock) !== Number(existing.stock)) {
    changedFields.push('stock');
    summaryPartsEn.push(`Stock: ${existing.stock} → ${next.stock}`);
    summaryPartsAr.push(`المخزون: ${existing.stock} ← ${next.stock}`);
  }
  const oldCodes = getAllProductBarcodes(existing).join(',');
  const newCodes = normalizeProductBarcodes(
    next.barcode !== undefined ? next.barcode : existing.barcode,
    next.barcodes !== undefined ? next.barcodes : existing.barcodes
  ).join(',');
  if (oldCodes !== newCodes) {
    changedFields.push('barcode');
    summaryPartsEn.push(`Barcodes updated (${newCodes || 'cleared'})`);
    summaryPartsAr.push(`تحديث الباركود (${newCodes || 'بدون باركود'})`);
  }
  if (next.sku !== undefined && next.sku !== existing.sku) {
    changedFields.push('sku');
    summaryPartsEn.push(`SKU: ${existing.sku} → ${next.sku}`);
    summaryPartsAr.push(`رمز SKU: ${existing.sku} ← ${next.sku}`);
  }
  const oldExpiry = (existing.expiryDate || existing.customFields?.expiryDate || '').toString().trim();
  const newExpiry =
    next.expiryDate !== undefined
      ? (next.expiryDate || '').toString().trim()
      : next.customFields?.expiryDate !== undefined
      ? (next.customFields?.expiryDate || '').toString().trim()
      : oldExpiry;
  if (oldExpiry !== newExpiry) {
    changedFields.push('expiryDate');
    summaryPartsEn.push(`Expiry Date: ${oldExpiry || 'None'} → ${newExpiry || 'Cleared'}`);
    summaryPartsAr.push(`تاريخ الانتهاء: ${oldExpiry || 'غير محدد'} ← ${newExpiry || 'تم مسحه'}`);
  }

  let nextPriceHistory = [...prevPriceHistory];
  let previousCostPrice = existing.previousCostPrice ?? existing.customFields?.previousCostPrice;
  let previousSellingPrice = existing.previousSellingPrice ?? existing.customFields?.previousSellingPrice;
  let priceUpdatedAt = existing.priceUpdatedAt ?? existing.customFields?.priceUpdatedAt;

  if (priceChanged) {
    previousCostPrice = oldCost;
    previousSellingPrice = oldSell;
    priceUpdatedAt = now;
    const priceEntry: ProductPriceHistoryEntry = {
      id: `ph_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: now,
      previousCostPrice: oldCost,
      newCostPrice: nextCost,
      previousSellingPrice: oldSell,
      newSellingPrice: nextSell,
      currency: nextCurrency,
      changedBy: actor,
    };
    nextPriceHistory = [priceEntry, ...prevPriceHistory].slice(0, 30);
  }

  let nextModHistory = [...prevModHistory];
  if (changedFields.length > 0) {
    const modEntry: ProductModificationEntry = {
      id: `mod_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: now,
      action: priceChanged
        ? 'price_changed'
        : changedFields.includes('barcode')
        ? 'barcode_changed'
        : 'updated',
      summaryEn: summaryPartsEn.join(' • ') || 'Product details updated',
      summaryAr: summaryPartsAr.join(' • ') || 'تم تعديل بيانات المنتج',
      changedFields,
      changedBy: actor,
    };
    nextModHistory = [modEntry, ...prevModHistory].slice(0, 40);
  }

  return {
    createdAt: existing.createdAt || existing.customFields?.createdAt || now,
    previousCostPrice,
    previousSellingPrice,
    priceUpdatedAt,
    priceHistory: nextPriceHistory,
    modificationHistory: nextModHistory,
  };
}

/**
 * Normalizes Arabic and English text for tolerant category search by any letter or word
 * (unifies Alef variants أ/إ/آ -> ا, Teh Marbuta ة -> ه, Alef Maksura ى -> ي, strips diacritics/tatweel).
 */
export function normalizeCategorySearchText(value: string): string {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/\s+/g, ' ');
}

/**
 * Merges categories from existing products and custom saved categories (`pos_categories`),
 * removing empty values and deduplicating by normalized name while preserving original display text.
 */
export function mergeAndDeduplicateCategories(
  productCategories: Array<string | undefined | null>,
  savedCategories?: Array<string | { name?: string; nameAr?: string } | undefined | null>
): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  const addCandidate = (raw?: string | null) => {
    const clean = String(raw || '').trim();
    if (!clean) return;
    const norm = normalizeCategorySearchText(clean);
    if (!norm || seen.has(norm)) return;
    seen.add(norm);
    result.push(clean);
  };

  if (Array.isArray(savedCategories)) {
    for (const item of savedCategories) {
      if (typeof item === 'string') {
        addCandidate(item);
      } else if (item && typeof item === 'object') {
        addCandidate(item.name || item.nameAr);
      }
    }
  }

  if (Array.isArray(productCategories)) {
    for (const cat of productCategories) {
      addCandidate(cat);
    }
  }

  return result;
}

/**
 * Filters categories by any single character, substring, or multi-word query (Arabic & English).
 * Ranks exact matches first, then prefix matches, then substring matches.
 */
export function filterCategoriesByQuery(categories: string[], query: string): string[] {
  const deduped = mergeAndDeduplicateCategories(categories);
  const normQuery = normalizeCategorySearchText(query);
  if (!normQuery) return deduped;

  const queryTokens = normQuery.split(' ').filter(Boolean);
  if (queryTokens.length === 0) return deduped;

  const matched = deduped.filter((cat) => {
    const normCat = normalizeCategorySearchText(cat);
    return queryTokens.every((token) => normCat.includes(token));
  });

  return matched.sort((a, b) => {
    const normA = normalizeCategorySearchText(a);
    const normB = normalizeCategorySearchText(b);

    const exactA = normA === normQuery ? 0 : 1;
    const exactB = normB === normQuery ? 0 : 1;
    if (exactA !== exactB) return exactA - exactB;

    const startsA = normA.startsWith(normQuery) ? 0 : 1;
    const startsB = normB.startsWith(normQuery) ? 0 : 1;
    if (startsA !== startsB) return startsA - startsB;

    const indexA = normA.indexOf(queryTokens[0]);
    const indexB = normB.indexOf(queryTokens[0]);
    if (indexA !== indexB) return indexA - indexB;

    return a.localeCompare(b);
  });
}

/**
 * Normalizes and synchronizes a product's strongly-typed `customFields` (`ProductCustomFields`)
 * with its top-level domain fields (`expiryDate`, `barcodes`, `priceHistory`, `modificationHistory`, `priceCurrency`, etc.)
 * without losing type safety.
 */
export function normalizeProductCustomFields(
  product: Partial<Product> & { customFields?: ProductCustomFields }
): ProductCustomFields {
  const cf: ProductCustomFields =
    product.customFields && typeof product.customFields === 'object'
      ? { ...product.customFields }
      : {};

  const barcodes = normalizeProductBarcodes(
    product.barcode,
    product.barcodes ?? cf.barcodes ?? []
  );
  const expiryDate =
    product.expiryDate !== undefined ? product.expiryDate : cf.expiryDate ?? null;
  const description =
    product.description !== undefined ? product.description : cf.description ?? null;
  const descriptionAr =
    product.descriptionAr !== undefined ? product.descriptionAr : cf.descriptionAr ?? null;
  const priceCurrency = (product.priceCurrency || cf.priceCurrency || 'SDG')
    .toString()
    .toUpperCase();
  const priceHistory = Array.isArray(product.priceHistory)
    ? product.priceHistory
    : Array.isArray(cf.priceHistory)
    ? cf.priceHistory
    : [];
  const modificationHistory = Array.isArray(product.modificationHistory)
    ? product.modificationHistory
    : Array.isArray(cf.modificationHistory)
    ? cf.modificationHistory
    : [];

  return {
    ...cf,
    ...(product.serialNumber !== undefined ? { serialNumber: product.serialNumber } : {}),
    description,
    descriptionAr,
    expiryDate,
    barcodes,
    priceCurrency,
    priceHistory,
    modificationHistory,
    ...(product.previousCostPrice !== undefined
      ? { previousCostPrice: product.previousCostPrice }
      : {}),
    ...(product.previousSellingPrice !== undefined
      ? { previousSellingPrice: product.previousSellingPrice }
      : {}),
    ...(product.priceUpdatedAt !== undefined ? { priceUpdatedAt: product.priceUpdatedAt } : {}),
    ...(product.enablePackaging !== undefined
      ? { enablePackaging: product.enablePackaging }
      : {}),
    ...(product.unitsPerPack !== undefined ? { unitsPerPack: product.unitsPerPack } : {}),
  };
}
