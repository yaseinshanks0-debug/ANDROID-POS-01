/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Currency, ExchangeRateItem } from '../lib/types';
import { recordApiTiming } from '../lib/performance-monitor';

const DEFAULT_API_TIMEOUT_MS = 8000;
const SHORT_CACHE_TTL_MS = 2500;

// In-flight GET request deduplication map (#3 Duplicate API Calls)
const inFlightGetRequests = new Map<string, Promise<any>>();
const shortTermResponseCache = new Map<string, { expiresAt: number; data: any }>();

function invalidateApiCache(prefix?: string): void {
  if (!prefix) {
    shortTermResponseCache.clear();
    return;
  }
  for (const key of shortTermResponseCache.keys()) {
    if (key.startsWith(prefix)) {
      shortTermResponseCache.delete(key);
    }
  }
}

/**
 * Executes a fetch request with an AbortController timeout (#12 API Timeouts)
 * and records latency in Real User Monitoring (#30 RUM).
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = DEFAULT_API_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const startMs = typeof performance !== 'undefined' ? performance.now() : Date.now();

  try {
    const res = await fetch(url, {
      ...options,
      signal: options.signal || controller.signal,
    });
    const elapsed = (typeof performance !== 'undefined' ? performance.now() : Date.now()) - startMs;
    recordApiTiming(url, elapsed, res.status);
    return res;
  } catch (err: any) {
    const elapsed = (typeof performance !== 'undefined' ? performance.now() : Date.now()) - startMs;
    recordApiTiming(url, elapsed, 0);
    if (err?.name === 'AbortError') {
      throw new Error(`API request timed out after ${timeoutMs}ms: ${url}`);
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Deduplicates concurrent identical GET requests and caches responses briefly (#3 Duplicate API Calls).
 */
async function deduplicatedGetJson<T>(url: string, errorMessage: string): Promise<T> {
  const now = Date.now();
  const cached = shortTermResponseCache.get(url);
  if (cached && cached.expiresAt > now) {
    return cached.data as T;
  }

  const existingPromise = inFlightGetRequests.get(url);
  if (existingPromise) {
    return existingPromise as Promise<T>;
  }

  const requestPromise = (async () => {
    try {
      const res = await fetchWithTimeout(url, { method: 'GET' });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `${errorMessage}: ${res.statusText}`);
      }
      const data = await res.json();
      shortTermResponseCache.set(url, {
        expiresAt: Date.now() + SHORT_CACHE_TTL_MS,
        data,
      });
      return data as T;
    } finally {
      inFlightGetRequests.delete(url);
    }
  })();

  inFlightGetRequests.set(url, requestPromise);
  return requestPromise;
}

export const api = {
  // Parallel Bootstrap Helper (#16 Parallel Requests)
  async fetchBootstrapData(): Promise<{
    products: Product[] | null;
    currencies: { baseCurrency: string; currencies: Currency[] } | null;
    exchangeRates: ExchangeRateItem[] | null;
  }> {
    const [productsRes, currenciesRes, ratesRes] = await Promise.allSettled([
      this.getProducts(),
      this.getCurrencies(),
      this.getExchangeRates(true),
    ]);
    return {
      products: productsRes.status === 'fulfilled' ? productsRes.value : null,
      currencies: currenciesRes.status === 'fulfilled' ? currenciesRes.value : null,
      exchangeRates: ratesRes.status === 'fulfilled' ? ratesRes.value : null,
    };
  },

  // Products API
  async getProducts(search?: string, category?: string): Promise<Product[]> {
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (category && category !== 'all') params.set('category', category);
    const qs = params.toString();
    const url = qs ? `/api/products?${qs}` : '/api/products';
    return deduplicatedGetJson<Product[]>(url, 'Failed to fetch products');
  },

  async getProduct(id: string): Promise<Product> {
    return deduplicatedGetJson<Product>(`/api/products/${id}`, 'Failed to fetch product');
  },

  async createProduct(data: Omit<Product, 'id' | 'updatedAt'>): Promise<Product> {
    const res = await fetchWithTimeout('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Failed to create product: ${res.statusText}`);
    }
    invalidateApiCache('/api/products');
    return res.json();
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const res = await fetchWithTimeout(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Failed to update product: ${res.statusText}`);
    }
    invalidateApiCache('/api/products');
    return res.json();
  },

  async deleteProduct(id: string): Promise<void> {
    const res = await fetchWithTimeout(`/api/products/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Failed to delete product: ${res.statusText}`);
    }
    invalidateApiCache('/api/products');
  },

  // Currencies & Exchange Rates API
  async getCurrencies(): Promise<{ baseCurrency: string; currencies: Currency[] }> {
    return deduplicatedGetJson<{ baseCurrency: string; currencies: Currency[] }>(
      '/api/currencies',
      'Failed to fetch currencies'
    );
  },

  async saveCurrency(data: {
    code: string;
    name: string;
    nameAr?: string;
    symbol: string;
    decimalPlaces?: number;
    initialRateToBase?: number;
  }): Promise<Currency> {
    const res = await fetchWithTimeout('/api/currencies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to save currency');
    }
    invalidateApiCache('/api/currencies');
    invalidateApiCache('/api/exchange-rates');
    return res.json();
  },

  async deleteCurrency(code: string): Promise<{ deleted: boolean; code: string }> {
    const res = await fetchWithTimeout(`/api/currencies/${encodeURIComponent(code)}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to delete currency');
    }
    invalidateApiCache('/api/currencies');
    invalidateApiCache('/api/exchange-rates');
    return res.json();
  },

  async getExchangeRates(effectiveOnly: boolean = false): Promise<ExchangeRateItem[]> {
    const url = effectiveOnly ? '/api/exchange-rates?effective=true' : '/api/exchange-rates';
    return deduplicatedGetJson<ExchangeRateItem[]>(url, 'Failed to fetch exchange rates');
  },

  async getExchangeRateHistory(source: string, target: string): Promise<ExchangeRateItem[]> {
    const url = `/api/exchange-rates/history?source=${encodeURIComponent(source)}&target=${encodeURIComponent(target)}`;
    return deduplicatedGetJson<ExchangeRateItem[]>(url, 'Failed to fetch exchange rate history');
  },

  async saveExchangeRate(data: {
    sourceCurrency: string;
    targetCurrency: string;
    rate: number;
    effectiveFrom?: string;
    expiryDate?: string | null;
  }): Promise<ExchangeRateItem> {
    const res = await fetchWithTimeout('/api/exchange-rates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to save exchange rate');
    }
    invalidateApiCache('/api/exchange-rates');
    return res.json();
  },

  async updateExchangeRate(
    id: string,
    updates: { rate?: number; expiryDate?: string | null; isActive?: boolean }
  ): Promise<ExchangeRateItem> {
    const res = await fetchWithTimeout(`/api/exchange-rates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to update exchange rate');
    }
    invalidateApiCache('/api/exchange-rates');
    return res.json();
  },

  async deleteExchangeRate(id: string): Promise<{ deleted: boolean; id: string }> {
    const res = await fetchWithTimeout(`/api/exchange-rates/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to delete exchange rate');
    }
    invalidateApiCache('/api/exchange-rates');
    return res.json();
  },

  async convertAmount(
    amount: number,
    from: string,
    to: string,
    timestamp?: string
  ): Promise<{
    originalAmount: number;
    fromCurrency: string;
    toCurrency: string;
    convertedAmount: number;
    exchangeRate: number;
    isInverse: boolean;
  }> {
    const params = new URLSearchParams({
      amount: amount.toString(),
      from,
      to,
    });
    if (timestamp) params.set('timestamp', timestamp);

    return deduplicatedGetJson(`/api/convert?${params.toString()}`, 'Conversion failed');
  },

  // Health check
  async checkHealth(): Promise<{ status: string; postgresConfigured: boolean; databaseType: string }> {
    return deduplicatedGetJson('/api/health', 'Health check failed');
  },
};
