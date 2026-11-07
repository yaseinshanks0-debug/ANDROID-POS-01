/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 10 (Phase B): Customer Demand Intelligence (Unmet Demand)
 * Pure Data Model, Input Validation, Server-Side RBAC Binding & Deduplication Logic
 */

import { POSUser, Product, ProductSaleUnitMode, SupportedCurrency } from '../lib/types';
import { resolveAnalyticsUserContext } from './analytics.permissions';

export const SUPPORTED_UNAVAILABILITY_REASONS = [
  'OUT_OF_STOCK',
  'EXPIRED',
  'NOT_STOCKED',
  'TEMPORARILY_UNAVAILABLE',
  'OTHER',
] as const;

export type UnavailabilityReason = (typeof SUPPORTED_UNAVAILABILITY_REASONS)[number];

export type AvailabilityStatusAtRequest =
  | 'OUT_OF_STOCK'
  | 'INSUFFICIENT_QUANTITY'
  | 'EXPIRED'
  | 'UNREGISTERED'
  | 'TEMPORARILY_UNAVAILABLE';

export type UnmetDemandFulfillmentStatus =
  | 'unfulfilled'
  | 'fulfilled_later'
  | 'cancelled';

export interface UnmetDemandRequestInput {
  idempotencyKey?: string;
  productId?: string | null;
  isRegisteredProduct?: boolean;
  productName?: string;
  productNameSnapshot?: string;
  productNameAr?: string | null;
  productNameArSnapshot?: string | null;
  skuSnapshot?: string | null;
  barcode?: string | null;
  category?: string;
  categorySnapshot?: string;
  branchId?: string | null;
  requestedTimestamp?: string;
  requestedQuantity?: number;
  saleUnitMode?: ProductSaleUnitMode;
  unavailabilityReason?: UnavailabilityReason | string;
  confirmedPurchaseIntent?: boolean;
  customerId?: string | null;
  customerReference?: string | null;
  notes?: string | null;
  sourceScreen?: 'checkout' | 'products' | 'analytics' | string;
  recordedByUserId?: string;
  allowRapidRepeat?: boolean;
}

export interface UnmetDemandRequestRecord {
  id: string;
  idempotencyKey: string;
  dedupeFingerprint: string;
  productId: string | null;
  isRegisteredProduct: boolean;
  productNameSnapshot: string;
  productNameArSnapshot: string | null;
  skuSnapshot: string | null;
  barcode: string | null;
  categorySnapshot: string;
  branchId: string;
  terminalName?: string;
  requestedTimestamp: string;
  requestedQuantity: number;
  saleUnitMode: ProductSaleUnitMode;
  packConversionFactor?: number;
  requestedBaseUnits: number;
  availableStockAtRequest: number | null;
  availabilityStatus: AvailabilityStatusAtRequest;
  unavailabilityReason: UnavailabilityReason;
  confirmedPurchaseIntent: boolean;
  fulfillmentStatus: UnmetDemandFulfillmentStatus;
  customerId: string | null;
  customerReference: string | null;
  unitSellingPriceSnapshot: number | null;
  unitCostPriceSnapshot?: number | null;
  unitCostSnapshot?: number | null;
  currencySnapshot: SupportedCurrency;
  exchangeRateSnapshot?: number;
  notes: string | null;
  sourceScreen?: 'checkout' | 'products' | 'analytics' | string;
  recordedByUserId: string;
  recordedByUserNameSnapshot?: string;
  recordedByRoleSnapshot?: string;
  recordedByName?: string;
  createdAt: string;
}

export interface UnmetDemandValidationResult {
  valid: boolean;
  ok: boolean;
  statusCode: 201 | 400 | 401 | 403 | 409;
  isDuplicateRapidSubmission?: boolean;
  errorCode?:
    | 'UNAUTHENTICATED_USER'
    | 'INVALID_REASON'
    | 'INVALID_QUANTITY'
    | 'MISSING_PRODUCT_IDENTITY'
    | 'UNREGISTERED_PRODUCT_ID_NOT_FOUND'
    | 'DUPLICATE_IDEMPOTENCY_KEY'
    | 'DUPLICATE_RAPID_SUBMISSION';
  errorMessage?: string;
  errorMessageAr?: string;
  errorEn?: string;
  errorAr?: string;
  record?: UnmetDemandRequestRecord;
}

const RAPID_DEDUPE_WINDOW_MS = 60 * 1000; // 60 seconds accidental double-tap guard

function sanitizeText(val: unknown, maxLen: number): string {
  if (typeof val !== 'string') return '';
  return val
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .trim()
    .slice(0, maxLen);
}

/**
 * Generates a deterministic fingerprint for 60-second accidental duplicate detection.
 * Separate customers or requests separated by >60s are preserved as distinct inquiries.
 */
export function buildUnmetDemandDedupeFingerprint(params: {
  branchId: string;
  recordedByUserId: string;
  productId: string | null;
  barcode: string | null;
  productNameSnapshot: string;
  unavailabilityReason: UnavailabilityReason;
  requestedQuantity: number;
  saleUnitMode: ProductSaleUnitMode;
  customerId: string | null;
  customerReference: string | null;
}): string {
  const itemKey = (
    params.productId ||
    params.barcode ||
    params.productNameSnapshot.toLowerCase().replace(/\s+/g, ' ')
  ).trim();
  const custKey = (params.customerId || params.customerReference || 'walk_in')
    .trim()
    .toLowerCase();
  return [
    params.branchId,
    params.recordedByUserId,
    itemKey,
    params.unavailabilityReason,
    `${params.requestedQuantity}:${params.saleUnitMode}`,
    custKey,
  ].join('|');
}

export interface UnmetDemandValidationParams {
  input: Partial<UnmetDemandRequestInput>;
  claimingUserId?: string;
  serverUsers: POSUser[];
  catalogProducts: Product[];
  existingRequests: UnmetDemandRequestRecord[];
  exchangeRates?: Record<string, number>;
  now?: Date;
}

export interface UnmetDemandValidationContextLegacy {
  authenticatedUser?: POSUser | null;
  products: Product[];
  existingRequests: UnmetDemandRequestRecord[];
  activeCurrency?: SupportedCurrency;
  exchangeRates?: Record<string, number>;
  now?: Date;
}

function makeErrorResult(
  statusCode: 400 | 401 | 403 | 409,
  errorCode: NonNullable<UnmetDemandValidationResult['errorCode']>,
  errorMessage: string,
  errorMessageAr: string,
  isDuplicateRapidSubmission = false
): UnmetDemandValidationResult {
  return {
    valid: false,
    ok: false,
    statusCode,
    isDuplicateRapidSubmission,
    errorCode,
    errorMessage,
    errorMessageAr,
    errorEn: errorMessage,
    errorAr: errorMessageAr,
  };
}

/**
 * Pure, deterministic validator and normalizer for Customer Demand Capture (Part 4A & 4B).
 * Supports both single-object `(params)` and two-argument `(input, context)` invocation styles.
 */
export function validateAndBuildUnmetDemandRequest(
  paramsOrInput: UnmetDemandValidationParams | Partial<UnmetDemandRequestInput>,
  legacyContext?: UnmetDemandValidationContextLegacy
): UnmetDemandValidationResult {
  const normalizedParams: UnmetDemandValidationParams = legacyContext
    ? {
        input: paramsOrInput as Partial<UnmetDemandRequestInput>,
        claimingUserId: legacyContext.authenticatedUser?.id,
        serverUsers: legacyContext.authenticatedUser ? [legacyContext.authenticatedUser] : [],
        catalogProducts: legacyContext.products,
        existingRequests: legacyContext.existingRequests,
        exchangeRates: legacyContext.exchangeRates,
        now: legacyContext.now,
      }
    : (paramsOrInput as UnmetDemandValidationParams);

  const {
    input,
    claimingUserId,
    serverUsers,
    catalogProducts,
    existingRequests,
    exchangeRates = { SDG: 1, USD: 2700 },
    now = new Date(),
  } = normalizedParams;

  // 1. Server-side authentication & user resolution (never trust client role or branch)
  const cleanUserId = sanitizeText(claimingUserId, 64);
  if (!cleanUserId) {
    return makeErrorResult(
      401,
      'UNAUTHENTICATED_USER',
      'Authentication required: recording employee ID is missing.',
      'يلزم تسجيل الدخول: معرف الموظف المسجل للطلب مفقود.'
    );
  }

  const userContext = resolveAnalyticsUserContext({ userId: cleanUserId }, serverUsers);
  if (!userContext.roleVerifiedFromServerStore) {
    return makeErrorResult(
      401,
      'UNAUTHENTICATED_USER',
      `Authentication failed: user "${cleanUserId}" is not recognized in the server user directory.`,
      `فشل التحقق من الهوية: المستخدم "${cleanUserId}" غير مسجل في دليل موظفي النظام.`
    );
  }

  // 2. Validate unavailability reason
  const rawReason = sanitizeText(input.unavailabilityReason || 'OUT_OF_STOCK', 40).toUpperCase();
  if (!SUPPORTED_UNAVAILABILITY_REASONS.includes(rawReason as UnavailabilityReason)) {
    return makeErrorResult(
      400,
      'INVALID_REASON',
      `Invalid unavailability reason "${rawReason}". Supported: ${SUPPORTED_UNAVAILABILITY_REASONS.join(', ')}.`,
      'سبب عدم التوفر غير صالح. يرجى اختيار سبب معتمد.'
    );
  }
  const unavailabilityReason = rawReason as UnavailabilityReason;

  // 3. Validate requested quantity (default 1 when omitted)
  const rawQty =
    input.requestedQuantity === undefined || input.requestedQuantity === null
      ? 1
      : Number(input.requestedQuantity);
  if (!Number.isFinite(rawQty) || !Number.isInteger(rawQty) || rawQty < 1 || rawQty > 10000) {
    return makeErrorResult(
      400,
      'INVALID_QUANTITY',
      'Requested quantity must be a whole number between 1 and 10,000.',
      'يجب أن تكون الكمية المطلوبة عدداً صحيحاً موجباً بين 1 و 10,000.'
    );
  }
  const requestedQuantity = rawQty;

  // 4. Resolve registered product vs. unregistered product request
  const cleanProductId =
    input.isRegisteredProduct === false ? null : sanitizeText(input.productId, 100) || null;
  const cleanBarcode = sanitizeText(input.barcode, 64) || null;
  let matchedProduct: Product | undefined;

  if (cleanProductId) {
    matchedProduct = catalogProducts.find((p) => p.id === cleanProductId);
    if (!matchedProduct) {
      return makeErrorResult(
        400,
        'UNREGISTERED_PRODUCT_ID_NOT_FOUND',
        `Product ID "${cleanProductId}" does not exist in the catalog. Omit productId for unregistered product requests.`,
        `معرف المنتج "${cleanProductId}" غير موجود في الكتالوج. لتسجيل منتج غير مسجل، اترك معرف المنتج فارغاً.`
      );
    }
  } else if (
    cleanBarcode &&
    unavailabilityReason !== 'NOT_STOCKED' &&
    input.isRegisteredProduct !== false
  ) {
    matchedProduct = catalogProducts.find(
      (p) =>
        p.barcode === cleanBarcode ||
        (Array.isArray(p.barcodes) && p.barcodes.includes(cleanBarcode))
    );
  }

  const isRegisteredProduct = Boolean(matchedProduct);
  const rawProvidedName = input.productName || input.productNameSnapshot;
  const rawProvidedNameAr = input.productNameAr || input.productNameArSnapshot;
  const rawProvidedCategory = input.category || input.categorySnapshot;

  const productNameSnapshot = matchedProduct
    ? matchedProduct.name
    : sanitizeText(rawProvidedName, 160);
  const productNameArSnapshot = matchedProduct
    ? matchedProduct.nameAr || null
    : sanitizeText(rawProvidedNameAr, 160) || null;

  if (!productNameSnapshot && !cleanBarcode) {
    return makeErrorResult(
      400,
      'MISSING_PRODUCT_IDENTITY',
      'A product selection, descriptive product name, or barcode is required.',
      'يرجى تحديد منتج من الكتالوج أو إدخال اسم وصفي أو باركود للمنتج المطلوب.'
    );
  }

  const finalProductName = productNameSnapshot || `Unregistered Barcode (${cleanBarcode})`;
  const saleUnitMode: ProductSaleUnitMode =
    input.saleUnitMode === 'pack' &&
    matchedProduct?.enablePackaging &&
    (matchedProduct?.unitsPerPack ?? 1) > 1
      ? 'pack'
      : 'unit';
  const unitsPerPack =
    saleUnitMode === 'pack' && matchedProduct?.unitsPerPack && matchedProduct.unitsPerPack > 1
      ? matchedProduct.unitsPerPack
      : 1;
  const requestedBaseUnits = requestedQuantity * unitsPerPack;

  // 5. Determine availability status at the time of request without fabricating missing stock
  const availableStockAtRequest = matchedProduct ? matchedProduct.stock : null;
  let availabilityStatus: AvailabilityStatusAtRequest;
  if (!isRegisteredProduct || unavailabilityReason === 'NOT_STOCKED') {
    availabilityStatus = 'UNREGISTERED';
  } else if (unavailabilityReason === 'EXPIRED') {
    availabilityStatus = 'EXPIRED';
  } else if (unavailabilityReason === 'TEMPORARILY_UNAVAILABLE') {
    availabilityStatus = 'TEMPORARILY_UNAVAILABLE';
  } else if (availableStockAtRequest !== null && availableStockAtRequest <= 0) {
    availabilityStatus = 'OUT_OF_STOCK';
  } else if (availableStockAtRequest !== null && availableStockAtRequest < requestedBaseUnits) {
    availabilityStatus = 'INSUFFICIENT_QUANTITY';
  } else {
    availabilityStatus = 'OUT_OF_STOCK';
  }

  // 6. Enforce branch scoping on the server
  const requestedBranch = sanitizeText(input.branchId, 64);
  const effectiveBranchId = userContext.canViewAllBranches
    ? requestedBranch && requestedBranch !== 'all'
      ? requestedBranch
      : userContext.assignedBranchId || 'branch-main'
    : userContext.assignedBranchId || 'branch-main';

  const effectiveTerminalName = userContext.assignedTerminalName || 'Main Terminal';

  // 7. Validate timestamp
  let reqDate = now;
  if (input.requestedTimestamp) {
    const parsed = new Date(input.requestedTimestamp);
    if (!Number.isNaN(parsed.getTime()) && parsed.getTime() <= now.getTime() + 5 * 60 * 1000) {
      reqDate = parsed;
    }
  }

  const customerId = sanitizeText(input.customerId, 64) || null;
  const customerReference = sanitizeText(input.customerReference, 100) || null;
  const notes = sanitizeText(input.notes, 500) || null;

  const dedupeFingerprint = buildUnmetDemandDedupeFingerprint({
    branchId: effectiveBranchId,
    recordedByUserId: userContext.userId,
    productId: matchedProduct ? matchedProduct.id : null,
    barcode: cleanBarcode || (matchedProduct ? matchedProduct.barcode : null),
    productNameSnapshot: finalProductName,
    unavailabilityReason,
    requestedQuantity,
    saleUnitMode,
    customerId,
    customerReference,
  });

  // 8. Check idempotency key & 60-second accidental duplicate submission window
  const idempotencyKey =
    sanitizeText(input.idempotencyKey, 100) ||
    `udr-idem-${reqDate.getTime()}-${Math.random().toString(36).slice(2, 8)}`;

  for (const existing of existingRequests) {
    if (existing.idempotencyKey === idempotencyKey) {
      return makeErrorResult(
        409,
        'DUPLICATE_IDEMPOTENCY_KEY',
        'Duplicate submission: this request idempotency key has already been recorded.',
        'تم تسجيل هذا الطلب مسبقاً (مفتاح عدم التكرار مطابق).',
        true
      );
    }

    if (!input.allowRapidRepeat && existing.dedupeFingerprint === dedupeFingerprint) {
      const existingMs = new Date(existing.requestedTimestamp).getTime();
      const deltaMs = Math.abs(reqDate.getTime() - existingMs);
      if (deltaMs <= RAPID_DEDUPE_WINDOW_MS) {
        return makeErrorResult(
          409,
          'DUPLICATE_RAPID_SUBMISSION',
          'Duplicate submission prevented: an identical inquiry was logged by you within the last 60 seconds.',
          'تم منع التكرار غير المقصود: تم تسجيل نفس الاستفسار خلال آخر 60 ثانية.',
          true
        );
      }
    }
  }

  // 9. Price & Currency Snapshot (read-only snapshot for valuation; never fabricates unknown prices)
  const currencySnapshot: SupportedCurrency = matchedProduct?.priceCurrency || 'SDG';
  const rateSnapshot =
    currencySnapshot === 'SDG'
      ? 1
      : Number(exchangeRates[currencySnapshot]) > 0
      ? Number(exchangeRates[currencySnapshot])
      : 1;

  const unitSellingPriceSnapshot = matchedProduct
    ? saleUnitMode === 'pack' &&
      matchedProduct.packSellingPrice &&
      matchedProduct.packSellingPrice > 0
      ? matchedProduct.packSellingPrice
      : matchedProduct.sellingPrice
    : null;

  const unitCostPriceSnapshot = matchedProduct
    ? saleUnitMode === 'pack' && matchedProduct.packCostPrice && matchedProduct.packCostPrice > 0
      ? matchedProduct.packCostPrice
      : matchedProduct.costPrice > 0
      ? matchedProduct.costPrice
      : null
    : null;

  const record: UnmetDemandRequestRecord = {
    id: `UDR-${reqDate.toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase()}`,
    idempotencyKey,
    dedupeFingerprint,
    productId: matchedProduct ? matchedProduct.id : null,
    isRegisteredProduct,
    productNameSnapshot: finalProductName,
    productNameArSnapshot,
    skuSnapshot: matchedProduct ? matchedProduct.sku : null,
    barcode: cleanBarcode || (matchedProduct ? matchedProduct.barcode : null),
    categorySnapshot: matchedProduct
      ? matchedProduct.category
      : sanitizeText(rawProvidedCategory, 80) || 'Unregistered',
    branchId: effectiveBranchId,
    terminalName: effectiveTerminalName,
    requestedTimestamp: reqDate.toISOString(),
    requestedQuantity,
    saleUnitMode,
    packConversionFactor: unitsPerPack,
    requestedBaseUnits,
    availableStockAtRequest,
    availabilityStatus,
    unavailabilityReason,
    confirmedPurchaseIntent: Boolean(input.confirmedPurchaseIntent),
    fulfillmentStatus: 'unfulfilled',
    customerId,
    customerReference,
    unitSellingPriceSnapshot,
    unitCostPriceSnapshot,
    unitCostSnapshot: unitCostPriceSnapshot,
    currencySnapshot,
    exchangeRateSnapshot: rateSnapshot,
    notes,
    sourceScreen: input.sourceScreen || 'checkout',
    recordedByUserId: userContext.userId,
    recordedByName: userContext.userName,
    recordedByUserNameSnapshot: userContext.userName,
    recordedByRoleSnapshot: userContext.role,
    createdAt: now.toISOString(),
  };

  return {
    valid: true,
    ok: true,
    statusCode: 201,
    isDuplicateRapidSubmission: false,
    record,
  };
}

/**
 * Redacts customer PII from unmet demand records when viewed by unauthorized roles
 * or exported in aggregate analytics (Part 4B & Part 8).
 */
export function redactUnmetDemandRecordForRole(
  record: UnmetDemandRequestRecord,
  canViewCustomerPII: boolean
): Omit<UnmetDemandRequestRecord, 'customerReference'> & { customerReference: string | null } {
  if (canViewCustomerPII) {
    return record;
  }
  return {
    ...record,
    customerReference: record.customerReference ? '[REDACTED]' : null,
  };
}

/**
 * Normalizes Arabic & English text for flexible product search and canonical deduplication:
 * - Removes Arabic diacritics (tashkeel) and tatweel
 * - Normalizes Alef variants (أ، إ، آ، ٱ) -> ا
 * - Normalizes Ta-Marbuta (ة) -> ه
 * - Normalizes Alef-Maqsura / Ya variants (ى، ئ) -> ي
 * - Normalizes Waw-Hamza (ؤ) -> و
 * - Strips punctuation into spaces and collapses whitespace
 */
export function normalizeUnavailableSearchText(text: string | null | undefined): string {
  if (!text) return '';
  return String(text)
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/[ىئ]/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/[^\p{L}\p{N}\s]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Computes a relevance score (0..100) for a candidate product against a user search query.
 * Supports:
 * - Searching by ANY word, partial word/prefix, or single character in the product name
 *   (e.g., "كريم", "باريس", "باري", "كريم باريس", or "كريم باري بالكرياتن" all match "كريم باريس الابيض")
 * - Barcode / SKU substring matching
 */
export function scoreUnavailableProductMatch(
  candidateFields: (string | null | undefined)[],
  rawQuery: string
): number {
  const normQuery = normalizeUnavailableSearchText(rawQuery);
  if (!normQuery) return 1;

  const normCandidates = candidateFields
    .map((f) => normalizeUnavailableSearchText(f))
    .filter((s) => s.length > 0);
  if (normCandidates.length === 0) return 0;

  const combinedText = normCandidates.join(' ');
  const candidateTokens = Array.from(
    new Set(combinedText.split(' ').filter((t) => t.length > 0))
  );

  // 1. Exact match on primary name
  if (normCandidates[0] === normQuery) {
    return 100;
  }

  // 2. Full query is a direct substring of any candidate field (handles single char, word, or phrase)
  if (combinedText.includes(normQuery)) {
    return normCandidates[0].startsWith(normQuery) ? 95 : 88;
  }

  const queryTokens = normQuery.split(' ').filter((t) => t.length > 0);
  if (queryTokens.length === 0) return 0;

  let matchedTokenCount = 0;
  let strongTokenMatches = 0;

  for (const qToken of queryTokens) {
    let tokenMatched = false;
    for (const cToken of candidateTokens) {
      if (cToken === qToken) {
        tokenMatched = true;
        strongTokenMatches += 1;
        break;
      }
      // Substring or prefix match in either direction (e.g., "باري" matches "باريس", or "باريس" matches "باري")
      if (
        cToken.includes(qToken) ||
        (qToken.length >= 2 && cToken.length >= 2 && qToken.includes(cToken))
      ) {
        tokenMatched = true;
        if (cToken.startsWith(qToken) || qToken.startsWith(cToken)) {
          strongTokenMatches += 1;
        }
        break;
      }
      // Shared 3-character prefix/root for Arabic/English variants (e.g., "كرياتن" vs "كرياتين")
      if (qToken.length >= 3 && cToken.length >= 3 && cToken.slice(0, 3) === qToken.slice(0, 3)) {
        tokenMatched = true;
        break;
      }
    }
    if (tokenMatched) {
      matchedTokenCount += 1;
    }
  }

  if (matchedTokenCount === 0) {
    return 0;
  }

  // If all query tokens matched
  if (matchedTokenCount === queryTokens.length) {
    return 80 + Math.min(12, strongTokenMatches * 4);
  }

  // Partial word/token overlap (e.g. customer asks for "كريم باري بالكرياتن" and DB has "كريم باريس الابيض"):
  // Any matched meaningful token surfaces the existing product so the cashier can select it!
  const ratio = matchedTokenCount / queryTokens.length;
  return Math.round(45 + ratio * 30 + Math.min(10, strongTokenMatches * 5));
}

export function matchesUnavailableProductQuery(
  candidateFields: (string | null | undefined)[],
  rawQuery: string
): boolean {
  return scoreUnavailableProductMatch(candidateFields, rawQuery) > 0;
}

export interface UnavailableProductKnowledgeItem {
  key: string;
  productId: string | null;
  isRegisteredProduct: boolean;
  productName: string;
  productNameAr: string | null;
  sku: string | null;
  barcode: string | null;
  category: string;
  unavailabilityReason: UnavailabilityReason;
  inquiryCount: number;
  totalRequestedQuantity: number;
  totalRequestedBaseUnits: number;
  confirmedIntentCount: number;
  firstRequestedAt: string;
  lastRequestedAt: string;
  inquiryTimestamps: string[];
  recentNotes: string[];
  currentStock: number | null;
}

/**
 * Builds the searchable Unavailable Products Knowledge Base (`قاعدة المنتجات غير المتوفرة`)
 * from all historical unmet demand requests and out-of-stock catalog products.
 */
export function buildUnavailableProductsKnowledgeBase(
  existingRequests: UnmetDemandRequestRecord[],
  catalogProducts: Product[] = []
): UnavailableProductKnowledgeItem[] {
  const catalogById = new Map<string, Product>();
  const catalogByNormName = new Map<string, Product>();
  for (const p of catalogProducts) {
    catalogById.set(p.id, p);
    const nEn = normalizeUnavailableSearchText(p.name);
    if (nEn) catalogByNormName.set(nEn, p);
    if (p.nameAr) {
      const nAr = normalizeUnavailableSearchText(p.nameAr);
      if (nAr) catalogByNormName.set(nAr, p);
    }
  }

  const map = new Map<string, UnavailableProductKnowledgeItem>();

  // Sort requests chronologically so first/last and canonical name are deterministic
  const sortedRequests = [...existingRequests].sort(
    (a, b) =>
      new Date(a.requestedTimestamp).getTime() - new Date(b.requestedTimestamp).getTime()
  );

  for (const req of sortedRequests) {
    const matchedProd =
      (req.productId ? catalogById.get(req.productId) : undefined) ||
      catalogByNormName.get(normalizeUnavailableSearchText(req.productNameSnapshot));

    const normName = normalizeUnavailableSearchText(
      req.productNameSnapshot || req.productNameArSnapshot || 'unknown'
    );
    const key = matchedProd
      ? `prod:${matchedProd.id}`
      : req.productId
      ? `prod:${req.productId}`
      : req.barcode
      ? `barcode:${req.barcode.trim()}`
      : `unreg:${normName}`;

    let entry = map.get(key);
    if (!entry) {
      entry = {
        key,
        productId: matchedProd ? matchedProd.id : req.productId || null,
        isRegisteredProduct: Boolean(matchedProd || (req.isRegisteredProduct && req.productId)),
        productName: matchedProd ? matchedProd.name : req.productNameSnapshot,
        productNameAr: matchedProd
          ? matchedProd.nameAr || req.productNameArSnapshot || null
          : req.productNameArSnapshot || req.productNameSnapshot,
        sku: matchedProd ? matchedProd.sku : req.skuSnapshot || null,
        barcode: matchedProd ? matchedProd.barcode : req.barcode || null,
        category: matchedProd
          ? matchedProd.category
          : req.categorySnapshot || 'Unregistered',
        unavailabilityReason: req.unavailabilityReason || 'NOT_STOCKED',
        inquiryCount: 0,
        totalRequestedQuantity: 0,
        totalRequestedBaseUnits: 0,
        confirmedIntentCount: 0,
        firstRequestedAt: req.requestedTimestamp,
        lastRequestedAt: req.requestedTimestamp,
        inquiryTimestamps: [],
        recentNotes: [],
        currentStock: matchedProd ? matchedProd.stock : req.availableStockAtRequest ?? null,
      };
      map.set(key, entry);
    }

    entry.inquiryCount += 1;
    entry.totalRequestedQuantity += Math.max(1, Number(req.requestedQuantity || 1));
    entry.totalRequestedBaseUnits += Math.max(
      1,
      Number(req.requestedBaseUnits || req.requestedQuantity || 1)
    );
    if (req.confirmedPurchaseIntent) {
      entry.confirmedIntentCount += 1;
    }
    if (req.requestedTimestamp < entry.firstRequestedAt) {
      entry.firstRequestedAt = req.requestedTimestamp;
    }
    if (req.requestedTimestamp >= entry.lastRequestedAt) {
      entry.lastRequestedAt = req.requestedTimestamp;
      entry.unavailabilityReason = req.unavailabilityReason || entry.unavailabilityReason;
    }
    entry.inquiryTimestamps.push(req.requestedTimestamp);
    if (req.notes && req.notes.trim() && !entry.recentNotes.includes(req.notes.trim())) {
      entry.recentNotes.unshift(req.notes.trim());
      if (entry.recentNotes.length > 5) entry.recentNotes.pop();
    }
  }

  // Sort inquiryTimestamps newest first for each entry
  for (const entry of map.values()) {
    entry.inquiryTimestamps.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  }

  // Also include out-of-stock or low-stock catalog products that haven't been logged yet so they are searchable in the same unified knowledge base
  for (const prod of catalogProducts) {
    const key = `prod:${prod.id}`;
    if (!map.has(key) && prod.stock <= (prod.minStockAlert || 5)) {
      map.set(key, {
        key,
        productId: prod.id,
        isRegisteredProduct: true,
        productName: prod.name,
        productNameAr: prod.nameAr || null,
        sku: prod.sku,
        barcode: prod.barcode,
        category: prod.category,
        unavailabilityReason: prod.stock <= 0 ? 'OUT_OF_STOCK' : 'TEMPORARILY_UNAVAILABLE',
        inquiryCount: 0,
        totalRequestedQuantity: 0,
        totalRequestedBaseUnits: 0,
        confirmedIntentCount: 0,
        firstRequestedAt: '',
        lastRequestedAt: '',
        inquiryTimestamps: [],
        recentNotes: [],
        currentStock: prod.stock,
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => {
    if (b.inquiryCount !== a.inquiryCount) {
      return b.inquiryCount - a.inquiryCount;
    }
    if (b.lastRequestedAt !== a.lastRequestedAt) {
      return b.lastRequestedAt.localeCompare(a.lastRequestedAt);
    }
    return a.productName.localeCompare(b.productName);
  });
}

/**
 * Searches the Unavailable Products Knowledge Base by any word, partial word, or character.
 */
export function searchUnavailableProductsKnowledgeBase(
  items: UnavailableProductKnowledgeItem[],
  query: string,
  options?: { onlyUnregisteredOrPreviouslyAsked?: boolean; limit?: number }
): (UnavailableProductKnowledgeItem & { matchScore: number })[] {
  const limit = options?.limit ?? 15;
  const source = options?.onlyUnregisteredOrPreviouslyAsked
    ? items.filter((item) => !item.isRegisteredProduct || item.inquiryCount > 0)
    : items;

  const trimmed = query.trim();
  if (!trimmed) {
    return source
      .slice(0, limit)
      .map((item) => ({ ...item, matchScore: item.inquiryCount > 0 ? 50 : 10 }));
  }

  const scored: (UnavailableProductKnowledgeItem & { matchScore: number })[] = [];
  for (const item of source) {
    const score = scoreUnavailableProductMatch(
      [
        item.productName,
        item.productNameAr,
        item.barcode,
        item.sku,
        item.category,
        ...item.recentNotes,
      ],
      trimmed
    );
    if (score > 0) {
      scored.push({ ...item, matchScore: score });
    }
  }

  scored.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    if (b.inquiryCount !== a.inquiryCount) {
      return b.inquiryCount - a.inquiryCount;
    }
    return b.lastRequestedAt.localeCompare(a.lastRequestedAt);
  });

  return scored.slice(0, limit);
}

