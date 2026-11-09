/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type {
  ActiveUserSession,
  Customer,
  POSUser,
  Product,
  StockMovement,
  Transaction,
} from '../lib/types.ts';
import type { UnmetDemandRequestRecord } from '../analytics/analytics.types.ts';

export type CompanyScoped<T> = T & { companyId?: string };

export interface SharedStoreState {
  storeCode: string;
  updatedAt: string;
  transactions: CompanyScoped<Transaction>[];
  customers: CompanyScoped<Customer>[];
  stockMovements: CompanyScoped<StockMovement>[];
  users: CompanyScoped<POSUser>[];
  activeSessions: CompanyScoped<ActiveUserSession>[];
  unmetDemandRequests?: CompanyScoped<UnmetDemandRequestRecord>[];
}

/**
 * Strongly-typed generic merge utility that deduplicates and merges records by a string key field
 * (`'id'`, `'sessionId'`, or any string property `K extends keyof T`) without `any` casts.
 */
export function mergeById<
  T extends Partial<Record<K, string>>,
  K extends string = 'id'
>(
  serverList: readonly T[] | undefined | null,
  incomingList: readonly T[] | undefined | null,
  keyField: K = 'id' as K
): T[] {
  const map = new Map<string, T>();

  if (Array.isArray(serverList)) {
    for (const item of serverList) {
      if (!item || typeof item !== 'object') continue;
      const rawKey = item[keyField];
      const key = typeof rawKey === 'string' ? rawKey.trim() : '';
      if (key) {
        map.set(key, item);
      }
    }
  }

  if (Array.isArray(incomingList)) {
    for (const item of incomingList) {
      if (!item || typeof item !== 'object') continue;
      const rawKey = item[keyField];
      const key = typeof rawKey === 'string' ? rawKey.trim() : '';
      if (key) {
        const previous = map.get(key);
        map.set(key, previous ? ({ ...previous, ...item } as T) : item);
      }
    }
  }

  return Array.from(map.values());
}

export function filterByCompanyScope<T extends object>(
  list: readonly (T & { companyId?: string })[] | undefined | null,
  companyId: string
): CompanyScoped<T>[] {
  if (!Array.isArray(list)) return [];
  if (!companyId) return [...list];
  return list.filter((item) => !item.companyId || item.companyId === companyId);
}

export function tagWithCompanyScope<T extends object>(
  list: readonly (T & { companyId?: string })[] | undefined | null,
  companyId: string
): CompanyScoped<T>[] {
  if (!Array.isArray(list)) return [];
  if (!companyId) return [...list];
  return list.map((item) => ({
    ...item,
    companyId: item.companyId || companyId,
  }));
}

export type CompanyScopedProduct = CompanyScoped<Product>;
