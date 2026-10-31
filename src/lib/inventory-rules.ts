/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, StockMovementType } from './types';

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
 * Generates an audit-safe transaction reference ID.
 */
export function generateTransactionId(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `TXN-${y}${m}${d}-${rand}`;
}

/**
 * Generates a valid 12-digit EAN/UPC-like barcode.
 */
export function generateBarcode(): string {
  let code = '200'; // In-store prefix
  for (let i = 0; i < 9; i++) {
    code += Math.floor(Math.random() * 10).toString();
  }
  return code;
}

/**
 * Generates an idempotency key to prevent duplicate checkout requests.
 */
export function generateIdempotencyKey(): string {
  return `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Normalizes a primary barcode and optional additional barcodes into a deduplicated array
 * where the first item is always the primary barcode.
 */
export function normalizeProductBarcodes(
  primaryBarcode: string,
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
 * Returns all barcodes associated with a product (primary + any secondary barcodes in barcodes or customFields).
 */
export function getAllProductBarcodes(
  product: Pick<Product, 'barcode' | 'barcodes' | 'customFields'>
): string[] {
  const extra = product.barcodes || product.customFields?.barcodes || [];
  return normalizeProductBarcodes(product.barcode, extra);
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
