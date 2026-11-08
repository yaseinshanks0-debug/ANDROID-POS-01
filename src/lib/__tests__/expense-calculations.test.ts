/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateExpenseInput,
  getConvertedExpenseView,
  computeExpensesSummary,
  computeNetFinancialPosition,
  formatExpenseCategoryLabel,
  generateExpenseId,
} from '../expense-calculations';
import type { ExpenseRecord } from '../types';

test('validateExpenseInput rejects empty title or non-positive amount', () => {
  const emptyTitle = validateExpenseInput({ title: '   ', amount: 150, category: 'rent' }, 'ar');
  assert.equal(emptyTitle.valid, false);
  assert.ok(emptyTitle.error?.includes('بيان'));

  const zeroAmount = validateExpenseInput({ title: 'فاتورة كهرباء', amount: 0, category: 'utilities' }, 'ar');
  assert.equal(zeroAmount.valid, false);

  const negativeAmount = validateExpenseInput(
    { title: 'فاتورة كهرباء', amount: -50, category: 'utilities' },
    'en'
  );
  assert.equal(negativeAmount.valid, false);

  const valid = validateExpenseInput(
    { title: 'إيجار شهر نوفمبر', amount: 250000, category: 'rent' },
    'ar'
  );
  assert.equal(valid.valid, true);
});

test('getConvertedExpenseView converts expense amounts accurately across historical and live exchange rates', () => {
  const expenseUsd: ExpenseRecord = {
    id: 'EXP-20261108-1001',
    timestamp: '2026-11-08T08:00:00.000Z',
    title: 'شراء أكياس تغليف',
    category: 'supplies',
    amount: 10, // $10 USD
    currency: 'USD',
    exchangeRateUsed: 2500,
    exchangeRatesSnapshot: { SDG: 1, USD: 2500 },
    paymentMethod: 'cash',
    recordedBy: 'Ahmed',
    status: 'recorded',
  };

  const historicalInSdg = getConvertedExpenseView(
    expenseUsd,
    'SDG',
    { SDG: 1, USD: 2800 },
    'historical'
  );
  assert.equal(historicalInSdg.convertedAmount, 25000);

  const liveInSdg = getConvertedExpenseView(
    expenseUsd,
    'SDG',
    { SDG: 1, USD: 2800 },
    'live'
  );
  assert.equal(liveInSdg.convertedAmount, 28000);
});

test('computeExpensesSummary aggregates total, today, monthly, and category breakdowns while excluding voided expenses', () => {
  const refDate = new Date('2026-11-08T12:00:00.000Z');
  const expenses: ExpenseRecord[] = [
    {
      id: 'EXP-1',
      timestamp: '2026-11-08T09:00:00.000Z',
      title: 'كهرباء المحل',
      category: 'utilities',
      amount: 10000,
      currency: 'SDG',
      paymentMethod: 'cash',
      recordedBy: 'Admin',
      status: 'recorded',
    },
    {
      id: 'EXP-2',
      timestamp: '2026-11-08T10:30:00.000Z',
      title: 'ترحيل بضاعة',
      category: 'transport',
      amount: 5000,
      currency: 'SDG',
      paymentMethod: 'bank_transfer',
      transferReference: 'BNK-991',
      recordedBy: 'Admin',
      status: 'recorded',
    },
    {
      id: 'EXP-3',
      timestamp: '2026-11-02T10:30:00.000Z',
      title: 'إيجار المحل',
      category: 'rent',
      amount: 35000,
      currency: 'SDG',
      paymentMethod: 'bank_transfer',
      recordedBy: 'Admin',
      status: 'recorded',
    },
    {
      id: 'EXP-4',
      timestamp: '2026-11-08T11:00:00.000Z',
      title: 'منصرف ملغي',
      category: 'other',
      amount: 99999,
      currency: 'SDG',
      paymentMethod: 'cash',
      recordedBy: 'Admin',
      status: 'voided',
    },
  ];

  const summary = computeExpensesSummary(
    expenses,
    'SDG',
    { SDG: 1, USD: 2700 },
    'historical',
    'USD',
    refDate
  );

  assert.equal(summary.totalExpenses, 50000);
  assert.equal(summary.todayExpenses, 15000);
  assert.equal(summary.thisMonthExpenses, 50000);
  assert.equal(summary.activeCount, 3);
  assert.equal(summary.voidedCount, 1);
  assert.equal(summary.todayCount, 2);
  assert.equal(summary.topCategory?.category, 'rent');
  assert.equal(summary.topCategory?.totalAmount, 35000);
  assert.equal(summary.topCategory?.sharePercent, 70);
  assert.equal(summary.byPaymentMethod.cash.totalAmount, 10000);
  assert.equal(summary.byPaymentMethod.bank_transfer.totalAmount, 40000);
});

test('computeNetFinancialPosition calculates net operating profit and cash after expenses accurately', () => {
  const pos = computeNetFinancialPosition({
    grossSales: 200000,
    collectedSales: 180000,
    grossProfitBeforeExpenses: 75000,
    totalExpenses: 25000,
  });

  assert.equal(pos.netOperatingProfit, 50000);
  assert.equal(pos.netCashAfterExpenses, 155000);
  assert.equal(pos.expenseToSalesRatioPercent, 12.5);
  assert.equal(pos.netProfitMarginAfterExpensesPercent, 25);
});

test('formatExpenseCategoryLabel and generateExpenseId return expected formats', () => {
  assert.equal(formatExpenseCategoryLabel('rent', 'ar'), 'إيجار المحل والمخازن');
  assert.equal(formatExpenseCategoryLabel('utilities', 'en'), 'Electricity, Water & Internet');
  const id = generateExpenseId(new Date('2026-11-08T10:00:00.000Z'));
  assert.match(id, /^EXP-20261108-\d{4}$/);
});
