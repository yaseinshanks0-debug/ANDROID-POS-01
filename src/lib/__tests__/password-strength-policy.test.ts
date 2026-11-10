import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePasswordStrength } from '../../server/release-onboarding.service';

test('Problem #23 — validatePasswordStrength enforces >= 8 characters and requires both letters and digits', () => {
  // 1. Short passwords (< 8 characters) are rejected
  assert.equal(validatePasswordStrength('').valid, false);
  assert.equal(validatePasswordStrength('1234').valid, false);
  assert.equal(validatePasswordStrength('Abc1234').valid, false);

  // 2. 8+ characters with only digits or only letters are rejected
  const digitsOnly = validatePasswordStrength('12345678');
  assert.equal(digitsOnly.valid, false);
  assert.ok(digitsOnly.messageEn?.includes('letters and numbers'));

  const lettersOnly = validatePasswordStrength('abcdefgh');
  assert.equal(lettersOnly.valid, false);
  assert.ok(lettersOnly.messageAr?.includes('أحرف وأرقام'));

  // 3. 8+ characters with both letters (English or Arabic) and digits are accepted
  assert.equal(validatePasswordStrength('SecurePass1').valid, true);
  assert.equal(validatePasswordStrength('Owner@2026').valid, true);
  assert.equal(validatePasswordStrength('كلمةسر1234').valid, true);
});
