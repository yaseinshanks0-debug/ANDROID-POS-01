/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Normalizes numeric string input from any keyboard layout or locale:
 * - Converts Arabic-Indic numerals (٠١٢٣٤٥٦٧٨٩) to Latin numerals (0-9).
 * - Handles thousands separators vs decimal separators (comma vs dot).
 * - Converts Arabic comma (،) and Arabic decimal separator (٫) to dot (.).
 * - Strips non-numeric characters while preserving sign and decimal point.
 * - Prevents multiple decimal points.
 */
export function normalizeNumberInput(val: string): string {
  if (!val) return '';

  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  let normalized = val.trim();

  // Replace Arabic-Indic digits
  for (let i = 0; i < 10; i++) {
    normalized = normalized.replaceAll(arabicDigits[i], i.toString());
  }

  // Replace Arabic decimal separator (٫)
  normalized = normalized.replaceAll('٫', '.');

  // Check if string contains both comma and dot (e.g. 2,700.50 or 2.700,50)
  const hasComma = normalized.includes(',') || normalized.includes('،');
  const hasDot = normalized.includes('.');

  if (hasComma && hasDot) {
    const lastComma = Math.max(normalized.lastIndexOf(','), normalized.lastIndexOf('،'));
    const lastDot = normalized.lastIndexOf('.');

    if (lastDot > lastComma) {
      // Form: 2,700.50 -> comma is thousands separator
      normalized = normalized.replace(/[،,]/g, '');
    } else {
      // Form: 2.700,50 -> dot is thousands separator, comma is decimal
      normalized = normalized.replaceAll('.', '').replace(/[،,]/g, '.');
    }
  } else if (hasComma) {
    // Only comma present: e.g. 2700,50 or 2700،5 -> convert to decimal dot
    normalized = normalized.replace(/[،,]/g, '.');
  }

  // Strip all invalid characters, keeping only digits and decimal dot
  normalized = normalized.replace(/[^0-9.]/g, '');

  // Keep only the first decimal dot
  const parts = normalized.split('.');
  if (parts.length > 2) {
    normalized = parts[0] + '.' + parts.slice(1).join('');
  }

  return normalized;
}

/**
 * Safely parses a normalized numeric string into a float, returning fallback (default 0) if invalid.
 */
export function parseNormalizedNumber(val: string, fallback: number = 0): number {
  const normalized = normalizeNumberInput(val);
  const num = parseFloat(normalized);
  return isNaN(num) || !isFinite(num) ? fallback : num;
}
