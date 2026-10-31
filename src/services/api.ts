/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Currency, ExchangeRateItem } from '../lib/types';

export const api = {
  // Products API
  async getProducts(search?: string, category?: string): Promise<Product[]> {
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (category && category !== 'all') params.set('category', category);

    const res = await fetch(`/api/products?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.statusText}`);
    }
    return res.json();
  },

  async getProduct(id: string): Promise<Product> {
    const res = await fetch(`/api/products/${id}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch product: ${res.statusText}`);
    }
    return res.json();
  },

  async createProduct(data: Omit<Product, 'id' | 'updatedAt'>): Promise<Product> {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Failed to create product: ${res.statusText}`);
    }
    return res.json();
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Failed to update product: ${res.statusText}`);
    }
    return res.json();
  },

  async deleteProduct(id: string): Promise<void> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Failed to delete product: ${res.statusText}`);
    }
  },

  // Currencies & Exchange Rates API
  async getCurrencies(): Promise<{ baseCurrency: string; currencies: Currency[] }> {
    const res = await fetch('/api/currencies');
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to fetch currencies');
    }
    return res.json();
  },

  async saveCurrency(data: {
    code: string;
    name: string;
    nameAr?: string;
    symbol: string;
    decimalPlaces?: number;
    initialRateToBase?: number;
  }): Promise<Currency> {
    const res = await fetch('/api/currencies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to save currency');
    }
    return res.json();
  },

  async deleteCurrency(code: string): Promise<{ deleted: boolean; code: string }> {
    const res = await fetch(`/api/currencies/${encodeURIComponent(code)}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to delete currency');
    }
    return res.json();
  },

  async getExchangeRates(effectiveOnly: boolean = false): Promise<ExchangeRateItem[]> {
    const url = effectiveOnly ? '/api/exchange-rates?effective=true' : '/api/exchange-rates';
    const res = await fetch(url);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to fetch exchange rates');
    }
    return res.json();
  },

  async getExchangeRateHistory(source: string, target: string): Promise<ExchangeRateItem[]> {
    const res = await fetch(`/api/exchange-rates/history?source=${encodeURIComponent(source)}&target=${encodeURIComponent(target)}`);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to fetch exchange rate history');
    }
    return res.json();
  },

  async saveExchangeRate(data: {
    sourceCurrency: string;
    targetCurrency: string;
    rate: number;
    effectiveFrom?: string;
    expiryDate?: string | null;
  }): Promise<ExchangeRateItem> {
    const res = await fetch('/api/exchange-rates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to save exchange rate');
    }
    return res.json();
  },

  async updateExchangeRate(
    id: string,
    updates: { rate?: number; expiryDate?: string | null; isActive?: boolean }
  ): Promise<ExchangeRateItem> {
    const res = await fetch(`/api/exchange-rates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to update exchange rate');
    }
    return res.json();
  },

  async deleteExchangeRate(id: string): Promise<{ deleted: boolean; id: string }> {
    const res = await fetch(`/api/exchange-rates/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to delete exchange rate');
    }
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

    const res = await fetch(`/api/convert?${params.toString()}`);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Conversion failed');
    }
    return res.json();
  },

  // Health check
  async checkHealth(): Promise<{ status: string; postgresConfigured: boolean; databaseType: string }> {
    const res = await fetch('/api/health');
    if (!res.ok) {
      throw new Error('Health check failed');
    }
    return res.json();
  },
};
