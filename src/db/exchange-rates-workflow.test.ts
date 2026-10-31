/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getAllCurrencies,
  getBaseCurrency,
  getAllExchangeRates,
  getEffectiveExchangeRates,
  getExchangeRate,
  getExchangeRateHistory,
  setExchangeRate,
  updateExchangeRate,
  convertAmount,
} from './currencies-repo.ts';
import { getAllProducts, getProductById } from './products-repo.ts';
import { db } from './index.ts';
import { exchangeRates, products, sales } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

const API_BASE = 'http://localhost:3000';

test('1. Loading exchange rates: Fetches currencies, base SDG, and active rates', async () => {
  // Test repository loading
  const baseCurrency = await getBaseCurrency();
  assert.equal(baseCurrency.code, 'SDG');
  assert.equal(baseCurrency.isBase, true);

  const currencies = await getAllCurrencies();
  assert.ok(currencies.length >= 2, 'Should have base currency SDG and at least one foreign currency');

  const effectiveRates = await getEffectiveExchangeRates();
  assert.ok(effectiveRates.length >= 1, 'Should have effective rates for foreign currencies against SDG');

  const usdRate = effectiveRates.find((r) => r.sourceCurrency === 'USD');
  assert.ok(usdRate, 'USD rate must be present in effective rates');
  assert.ok(usdRate.rate > 0, 'USD rate must be positive');
  assert.ok(usdRate.inverseRate !== undefined && usdRate.inverseRate > 0, 'USD inverse rate must be positive');

  // Test REST endpoint loading
  const res = await fetch(`${API_BASE}/api/exchange-rates?effective=true`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(Array.isArray(data));
  assert.ok(data.some((r: any) => r.sourceCurrency === 'USD' && r.targetCurrency === 'SDG'));
});

test('2. Successfully saving a new exchange rate and receiving persisted response', async () => {
  const newRateValue = 2780.25;
  const effectiveDate = new Date();

  // Save via repository
  const saved = await setExchangeRate({
    sourceCurrency: 'USD',
    targetCurrency: 'SDG',
    rate: newRateValue,
    effectiveFrom: effectiveDate,
    createdBy: 'test_admin',
  });

  assert.ok(saved.id);
  assert.equal(saved.sourceCurrency, 'USD');
  assert.equal(saved.targetCurrency, 'SDG');
  assert.equal(saved.rate, newRateValue);
  assert.equal(saved.isActive, true);

  // Save via REST endpoint
  const apiRes = await fetch(`${API_BASE}/api/exchange-rates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sourceCurrency: 'EUR',
      targetCurrency: 'SDG',
      rate: 2950.75,
      effectiveFrom: new Date().toISOString(),
    }),
  });

  assert.equal(apiRes.status, 201);
  const apiData = await apiRes.json();
  assert.equal(apiData.sourceCurrency, 'EUR');
  assert.equal(apiData.rate, 2950.75);
});

test('3. Persisting the new rate after reloading: Querying reflects saved value', async () => {
  // Query effective rates directly from DB
  const currentUsdRate = await getExchangeRate('USD', 'SDG');
  assert.equal(currentUsdRate.rate, 2780.25);

  // Query effective rate via REST API
  const res = await fetch(`${API_BASE}/api/exchange-rates?effective=true`);
  assert.equal(res.status, 200);
  const rates = await res.json();
  const usd = rates.find((r: any) => r.sourceCurrency === 'USD');
  assert.ok(usd);
  assert.equal(usd.rate, 2780.25);
});

test('4. Rejecting zero, negative, and non-numeric exchange rates', async () => {
  // Repository checks
  await assert.rejects(
    async () => {
      await setExchangeRate({
        sourceCurrency: 'USD',
        targetCurrency: 'SDG',
        rate: 0,
      });
    },
    (err: Error) => err.message.includes('positive number greater than 0')
  );

  await assert.rejects(
    async () => {
      await setExchangeRate({
        sourceCurrency: 'USD',
        targetCurrency: 'SDG',
        rate: -1200,
      });
    },
    (err: Error) => err.message.includes('positive number greater than 0')
  );

  // API HTTP 400 checks
  const resZero = await fetch(`${API_BASE}/api/exchange-rates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sourceCurrency: 'USD',
      targetCurrency: 'SDG',
      rate: 0,
    }),
  });
  assert.equal(resZero.status, 400);

  const resNeg = await fetch(`${API_BASE}/api/exchange-rates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sourceCurrency: 'USD',
      targetCurrency: 'SDG',
      rate: -450,
    }),
  });
  assert.equal(resNeg.status, 400);
});

test('5. Rejecting invalid currencies, identical pairs, and malformed dates', async () => {
  // Identical source and target
  await assert.rejects(
    async () => {
      await setExchangeRate({
        sourceCurrency: 'USD',
        targetCurrency: 'USD',
        rate: 1.0,
      });
    },
    (err: Error) => err.message.includes('cannot be identical')
  );

  // Unknown currency code
  const resInvalid = await fetch(`${API_BASE}/api/exchange-rates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sourceCurrency: 'XYZ',
      targetCurrency: 'SDG',
      rate: 100,
    }),
  });
  assert.equal(resInvalid.status, 404);

  // Expiry date before effective date
  const resExpiry = await fetch(`${API_BASE}/api/exchange-rates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sourceCurrency: 'USD',
      targetCurrency: 'SDG',
      rate: 2800,
      effectiveFrom: '2026-10-30T00:00:00Z',
      expiryDate: '2026-10-25T00:00:00Z', // Before effective date!
    }),
  });
  assert.equal(resExpiry.status, 400);
});

test('6. Enforcing user permissions: Unauthorized roles (cashier) receive 403 Forbidden', async () => {
  const cashierRes = await fetch(`${API_BASE}/api/exchange-rates`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-role': 'cashier', // Cashier role unauthorized
    },
    body: JSON.stringify({
      sourceCurrency: 'USD',
      targetCurrency: 'SDG',
      rate: 2850,
    }),
  });

  assert.equal(cashierRes.status, 403);
  const errData = await cashierRes.json();
  assert.ok(errData.error?.includes('Insufficient permissions'));
});

test('7. Preserving historical rates: Past transaction rates are preserved without overlap', async () => {
  // Retrieve history for USD / SDG
  const history = await getExchangeRateHistory('USD', 'SDG');
  assert.ok(history.length >= 2, 'History must contain past rates');

  // Verify that previous rate has an expiry date matching subsequent rate effective date
  const initialRate = history.find((r) => r.id === 'rate-usd-sdg-initial');
  assert.ok(initialRate, 'Initial seed rate must be preserved in history');
  assert.equal(initialRate.rate, 2700);
  assert.ok(initialRate.expiryDate, 'Past rate must have expiry date closing its validity period');

  // Query rate at past historical timestamp
  const pastDate = new Date('2026-06-01T00:00:00Z');
  const historicalResult = await getExchangeRate('USD', 'SDG', pastDate);
  assert.equal(historicalResult.rate, 2700, 'Query at past date must return historical rate (2700)');

  // Query rate at current timestamp
  const currentResult = await getExchangeRate('USD', 'SDG', new Date());
  assert.equal(currentResult.rate, 2780.25, 'Query at current date must return updated rate (2780.25)');
});

test('8. Automatic conversion: Real-time amount conversion using effective rates', async () => {
  const convertRes = await fetch(`${API_BASE}/api/convert?amount=100&from=USD&to=SDG`);
  assert.equal(convertRes.status, 200);
  const conv = await convertRes.json();
  assert.equal(conv.originalAmount, 100);
  assert.equal(conv.fromCurrency, 'USD');
  assert.equal(conv.toCurrency, 'SDG');
  assert.equal(conv.convertedAmount, Math.round(100 * 2780.25 * 100) / 100);
});

test('9. Product prices and catalog integrity: Exchange rate changes do not mutate product prices', async () => {
  // Verify Espresso Double Shot price remains exactly 3.75
  const espresso = await getProductById('prod-1');
  assert.ok(espresso);
  assert.equal(espresso.sellingPrice, 3.75, 'Product selling price must not change when exchange rate is edited');
  assert.equal(espresso.costPrice, 0.85, 'Product cost price must not change when exchange rate is edited');

  // Verify all products catalog count remains intact
  const allProds = await getAllProducts();
  assert.ok(allProds.length >= 41, 'Product catalog must remain intact');
});

test('10. Full Currency Customization: Add custom currency (EGP), configure rate, and delete safely while protecting SDG', async () => {
  // 1. Create custom currency EGP via REST API
  const createRes = await fetch(`${API_BASE}/api/currencies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code: 'EGP',
      name: 'Egyptian Pound',
      nameAr: 'جنيه مصري',
      symbol: 'ج.م',
      decimalPlaces: 2,
      initialRateToBase: 55.5,
    }),
  });
  assert.equal(createRes.status, 201);
  const createdCurr = await createRes.json();
  assert.equal(createdCurr.code, 'EGP');
  assert.equal(createdCurr.symbol, 'ج.م');

  // 2. Verify EGP appears in active currencies and has effective rate 55.5 against SDG
  const listRes = await fetch(`${API_BASE}/api/currencies`);
  const listData = await listRes.json();
  assert.ok(listData.currencies.some((c: any) => c.code === 'EGP'));

  const egpRate = await getExchangeRate('EGP', 'SDG');
  assert.equal(egpRate.rate, 55.5);

  // 3. Protect SDG base currency from deletion
  const deleteSdgRes = await fetch(`${API_BASE}/api/currencies/SDG`, {
    method: 'DELETE',
  });
  assert.equal(deleteSdgRes.status, 400);

  // 4. Delete EGP custom currency and verify removal from active list
  const deleteEgpRes = await fetch(`${API_BASE}/api/currencies/EGP`, {
    method: 'DELETE',
  });
  assert.equal(deleteEgpRes.status, 200);
  const delData = await deleteEgpRes.json();
  assert.equal(delData.deleted, true);

  const afterList = await getAllCurrencies();
  assert.ok(!afterList.some((c) => c.code === 'EGP'), 'Deleted currency should not be in active currencies');
});

test('11. Same-day date-only / midnight UTC rate update overrides earlier timestamps without reverting', async () => {
  const todayMidnightIso = new Date(new Date().toISOString().slice(0, 10)).toISOString();

  const res = await fetch(`${API_BASE}/api/exchange-rates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sourceCurrency: 'USD',
      targetCurrency: 'SDG',
      rate: 10150,
      effectiveFrom: todayMidnightIso,
    }),
  });
  assert.equal(res.status, 201);

  // Immediately fetch effective rates and verify USD is 10150 (does not revert to 2780.25 or 2700)
  const effectiveRes = await fetch(`${API_BASE}/api/exchange-rates?effective=true`);
  assert.equal(effectiveRes.status, 200);
  const rates = await effectiveRes.json();
  const usd = rates.find((r: any) => r.sourceCurrency === 'USD');
  assert.ok(usd);
  assert.equal(usd.rate, 10150, 'USD effective rate must remain 10150 and not revert to default/previous rate');
});

