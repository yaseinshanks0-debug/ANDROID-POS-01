/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  APP_LANGUAGES,
  APP_NAV_TABS,
  APP_THEMES,
  ALLOWED_SALE_UNITS_MODES,
  EXPENSE_CATEGORIES,
  INVOICE_FULFILLMENT_STATUSES,
  INVOICE_FULFILLMENT_TYPES,
  PAYMENT_METHODS,
  PAYMENT_SETTLEMENT_STATUSES,
  PRODUCT_MODIFICATION_ACTIONS,
  PRODUCT_SALE_UNIT_MODES,
  SALES_RATE_VALUATION_MODES,
  SDG_PRICE_ADJUSTMENT_POLICIES,
  TRANSACTION_STATUSES,
  TRANSACTION_SYNC_STATUSES,
  USER_ROLES,
  WORKSPACE_MODES,
  isRecord,
} from '../types';
import { RATE_CHANGE_DIRECTIONS } from '../exchange-rate-repricing';

test('Const Types Pattern exposes stable runtime enum-like objects for core POS domains', () => {
  assert.deepEqual(Object.values(USER_ROLES), [
    'admin',
    'manager',
    'cashier',
    'inventory_clerk',
  ]);
  assert.deepEqual(Object.values(WORKSPACE_MODES), ['PRODUCTION', 'PRACTICE']);
  assert.deepEqual(Object.values(PAYMENT_METHODS), [
    'cash',
    'bank_transfer',
    'qr_nfc',
    'card',
  ]);
  assert.deepEqual(Object.values(PAYMENT_SETTLEMENT_STATUSES), [
    'paid',
    'partial',
    'unpaid',
  ]);
  assert.deepEqual(Object.values(SDG_PRICE_ADJUSTMENT_POLICIES), [
    'increase_only',
    'proportional',
  ]);
  assert.deepEqual(Object.values(RATE_CHANGE_DIRECTIONS), [
    'increase',
    'decrease',
    'unchanged',
  ]);
  assert.equal(PRODUCT_SALE_UNIT_MODES.PACK, 'pack');
  assert.equal(ALLOWED_SALE_UNITS_MODES.BOTH, 'both');
  assert.equal(PRODUCT_MODIFICATION_ACTIONS.PRICE_CHANGED, 'price_changed');
  assert.equal(INVOICE_FULFILLMENT_TYPES.GOODS_AND_INVOICE, 'goods_and_invoice');
  assert.equal(INVOICE_FULFILLMENT_STATUSES.RECEIVED, 'received');
  assert.equal(SALES_RATE_VALUATION_MODES.HISTORICAL, 'historical');
  assert.equal(TRANSACTION_STATUSES.COMPLETED, 'completed');
  assert.equal(TRANSACTION_SYNC_STATUSES.SYNCED, 'synced');
  assert.equal(APP_LANGUAGES.AR, 'ar');
  assert.equal(APP_THEMES.DARK, 'dark');
  assert.equal(EXPENSE_CATEGORIES.RENT, 'rent');
  assert.equal(APP_NAV_TABS.SETTINGS, 'settings');
});

test('isRecord type guard accepts plain objects and rejects primitives, null, and arrays', () => {
  assert.equal(isRecord({ id: '1' }), true);
  assert.equal(isRecord({}), true);
  assert.equal(isRecord(null), false);
  assert.equal(isRecord(undefined), false);
  assert.equal(isRecord([]), false);
  assert.equal(isRecord(['a']), false);
  assert.equal(isRecord('text'), false);
  assert.equal(isRecord(123), false);
  assert.equal(isRecord(true), false);
});
