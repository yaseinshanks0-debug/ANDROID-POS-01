/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeNumberInput, parseNormalizedNumber } from './number-utils.ts';

test('normalizeNumberInput: Converts Arabic-Indic numerals to Latin numerals', () => {
  assert.equal(normalizeNumberInput('٢٧٠٠'), '2700');
  assert.equal(normalizeNumberInput('١٢٣٤٥.٦٧'), '12345.67');
  assert.equal(normalizeNumberInput('٠.٥'), '0.5');
});

test('normalizeNumberInput: Converts Arabic commas and European commas to dot', () => {
  assert.equal(normalizeNumberInput('2700,50'), '2700.50');
  assert.equal(normalizeNumberInput('1500،25'), '1500.25');
  assert.equal(normalizeNumberInput('١٠٠٫٥'), '100.5');
});

test('normalizeNumberInput: Prevents multiple decimal points and removes invalid characters', () => {
  assert.equal(normalizeNumberInput('12.34.56'), '12.3456');
  assert.equal(normalizeNumberInput('$2,700.50 SDG'), '2700.50');
  assert.equal(normalizeNumberInput('abc'), '');
});

test('parseNormalizedNumber: Parses valid numbers and returns fallback on invalid', () => {
  assert.equal(parseNormalizedNumber('٢٧٠٠'), 2700);
  assert.equal(parseNormalizedNumber('2700.75'), 2700.75);
  assert.equal(parseNormalizedNumber('invalid', 10), 10);
  assert.equal(parseNormalizedNumber('', 0), 0);
});

test('normalizeNumberInput: Handles Arabic keyboard inputs for exchange rates and currency tenders', () => {
  // Common SDG exchange rate inputs
  assert.equal(normalizeNumberInput('٢٧٠٠'), '2700');
  assert.equal(normalizeNumberInput('٧٢٠'), '720');
  assert.equal(normalizeNumberInput('٢٩٥٠.٠٠'), '2950.00');
  assert.equal(normalizeNumberInput('٣٤٥٠،٥٠'), '3450.50');
  // Cashier entering cash amount with Arabic comma or dots
  assert.equal(normalizeNumberInput('١٣٥٠٠٠'), '135000');
  assert.equal(normalizeNumberInput('٥٠'), '50');
  assert.equal(parseNormalizedNumber('١٣٥٠٠٠'), 135000);
  assert.equal(parseNormalizedNumber('٥٠.٥'), 50.5);
});

