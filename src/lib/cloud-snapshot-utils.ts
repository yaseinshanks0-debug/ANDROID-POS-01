/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CloudWorkspaceSnapshotInput {
  products?: any[];
  transactions?: any[];
  customers?: any[];
  stockMovements?: any[];
  currencies?: any[];
  settings?: Record<string, any>;
  pushedAtIso?: string;
}

const DEFAULT_FIRESTORE_SAFE_BYTES = 850_000; // Leave headroom under Firestore's 1 MiB document limit

function sortNewestFirstByTimestamp<T extends { timestamp?: string; updatedAt?: string }>(
  items: T[]
): T[] {
  if (!Array.isArray(items) || items.length <= 1) return Array.isArray(items) ? [...items] : [];
  return [...items].sort((a, b) => {
    const tsA = Date.parse(a?.timestamp || a?.updatedAt || '') || 0;
    const tsB = Date.parse(b?.timestamp || b?.updatedAt || '') || 0;
    return tsB - tsA;
  });
}

function stripInlineImageFromProduct(prod: any): any {
  if (!prod || typeof prod !== 'object') return prod;
  const next = { ...prod };
  if (typeof next.image === 'string' && next.image.startsWith('data:')) {
    delete next.image;
  }
  if (typeof next.imageUrl === 'string' && next.imageUrl.startsWith('data:')) {
    delete next.imageUrl;
  }
  if (next.customFields && typeof next.customFields === 'object') {
    const cf = { ...next.customFields };
    if (typeof cf.image === 'string' && cf.image.startsWith('data:')) {
      delete cf.image;
    }
    next.customFields = cf;
  }
  return next;
}

function stripInlineReceiptsFromTransaction(tx: any): any {
  if (!tx || typeof tx !== 'object') return tx;
  const next = { ...tx };
  if (typeof next.transferReceiptImage === 'string' && next.transferReceiptImage.startsWith('data:')) {
    delete next.transferReceiptImage;
  }
  if (Array.isArray(next.transferReceiptImages)) {
    const filtered = next.transferReceiptImages.filter(
      (img: any) => typeof img === 'string' && !img.startsWith('data:')
    );
    if (filtered.length > 0) {
      next.transferReceiptImages = filtered;
    } else {
      delete next.transferReceiptImages;
    }
  }
  return next;
}

function measureUtf8Bytes(str: string): number {
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder().encode(str).length;
  }
  return str.length;
}

/**
 * Sanitizes and bounds a Firestore cloud workspace snapshot payload so:
 * 1) Undefined properties are removed cleanly.
 * 2) Transactions & stock movements are sorted newest-first before slicing.
 * 3) Inline base64 media & excess historical rows are trimmed cleanly if total size approaches Firestore's 1 MiB limit.
 */
export function buildSafeCloudSnapshotPayload(
  payload: CloudWorkspaceSnapshotInput,
  maxBytes: number = DEFAULT_FIRESTORE_SAFE_BYTES
): {
  products: any[];
  transactions: any[];
  customers: any[];
  stockMovements: any[];
  currencies: any[];
  settings: Record<string, any>;
  pushedAtIso: string;
  strippedInlineMedia?: boolean;
} {
  let products = (payload.products || []).slice(0, 500);
  let transactions = sortNewestFirstByTimestamp(payload.transactions || []).slice(0, 500);
  let customers = (payload.customers || []).slice(0, 500);
  let stockMovements = sortNewestFirstByTimestamp(payload.stockMovements || []).slice(0, 500);
  const currencies = (payload.currencies || []).slice(0, 50);
  const settings = payload.settings ? { ...payload.settings } : {};
  const pushedAtIso = payload.pushedAtIso || new Date().toISOString();

  const serialize = (strippedInlineMedia = false) =>
    JSON.stringify({
      products,
      transactions,
      customers,
      stockMovements,
      currencies,
      settings,
      pushedAtIso,
      ...(strippedInlineMedia ? { strippedInlineMedia: true } : {}),
    });

  let serialized = serialize(false);
  let strippedInlineMedia = false;

  if (measureUtf8Bytes(serialized) > maxBytes) {
    strippedInlineMedia = true;
    products = products.map(stripInlineImageFromProduct);
    transactions = transactions.map(stripInlineReceiptsFromTransaction);
    if (typeof settings.storeLogo === 'string' && settings.storeLogo.startsWith('data:')) {
      delete settings.storeLogo;
    }
    serialized = serialize(true);
  }

  // If still above safe byte budget (very large catalog/transactions), progressively trim historical movements/transactions
  if (measureUtf8Bytes(serialized) > maxBytes) {
    stockMovements = stockMovements.slice(0, 150);
    serialized = serialize(strippedInlineMedia);
  }
  if (measureUtf8Bytes(serialized) > maxBytes) {
    transactions = transactions.slice(0, 200);
    serialized = serialize(strippedInlineMedia);
  }

  return JSON.parse(serialized);
}
