/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AUTH_ERROR_CODES,
  evaluateLocalAccountLogin,
  hashSecretWithSalt,
  shouldShowLoginGate,
  validatePasswordStrengthPolicy,
  validatePinPolicy,
  verifySecretWithSalt,
  type LocalCredentialRecord,
} from './local-auth';
import type { POSUser } from './types';
import { DEFAULT_ROLE_PERMISSIONS } from './initial-data';

function makeUser(overrides: Partial<POSUser> = {}): POSUser {
  return {
    id: 'usr-owner-1',
    companyId: 'comp-test',
    username: 'admin',
    email: 'admin@store.sd',
    phone: '0912345678',
    name: 'Store Owner',
    nameAr: 'مدير المتجر',
    role: 'admin',
    systemRole: 'COMPANY_OWNER',
    pin: '',
    hasPassword: true,
    terminalName: 'POS 1',
    terminalNameAr: 'نقطة بيع 1',
    avatarColor: '#f59e0b',
    isActive: true,
    permissions: { ...DEFAULT_ROLE_PERMISSIONS.admin },
    lastActiveAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

test('validatePasswordStrengthPolicy enforces >= 8 chars with letters (AR/EN) and digits', () => {
  assert.equal(validatePasswordStrengthPolicy('').valid, false);
  assert.equal(validatePasswordStrengthPolicy('1234').valid, false);
  assert.equal(validatePasswordStrengthPolicy('12345678').valid, false);
  assert.equal(validatePasswordStrengthPolicy('abcdefgh').valid, false);
  assert.equal(validatePasswordStrengthPolicy('Admin2026').valid, true);
  assert.equal(validatePasswordStrengthPolicy('كلمةسر2026').valid, true);
});

test('validatePinPolicy enforces 4 to 8 numeric digits', () => {
  assert.equal(validatePinPolicy('123').valid, false);
  assert.equal(validatePinPolicy('abcd').valid, false);
  assert.equal(validatePinPolicy('123456789').valid, false);
  assert.equal(validatePinPolicy('1234').valid, true);
  assert.equal(validatePinPolicy('567890').valid, true);
});

test('hashSecretWithSalt and verifySecretWithSalt use unique salts and reject wrong secrets', () => {
  const h1 = hashSecretWithSalt('Admin2026');
  const h2 = hashSecretWithSalt('Admin2026');
  assert.notEqual(h1.salt, h2.salt);
  assert.notEqual(h1.hash, h2.hash);
  assert.equal(verifySecretWithSalt('Admin2026', h1.hash, h1.salt), true);
  assert.equal(verifySecretWithSalt('WrongPass1', h1.hash, h1.salt), false);
  assert.equal(verifySecretWithSalt('', h1.hash, h1.salt), false);
});

test('shouldShowLoginGate enforces login in production and respects lock screen', () => {
  assert.equal(
    shouldShowLoginGate({
      workspaceMode: 'PRODUCTION',
      isAuthenticated: false,
      isScreenLocked: false,
      requireLoginOnStartup: true,
    }),
    true
  );

  assert.equal(
    shouldShowLoginGate({
      workspaceMode: 'PRODUCTION',
      isAuthenticated: true,
      isScreenLocked: false,
      requireLoginOnStartup: true,
    }),
    false
  );

  assert.equal(
    shouldShowLoginGate({
      workspaceMode: 'PRODUCTION',
      isAuthenticated: true,
      isScreenLocked: true,
      requireLoginOnStartup: true,
    }),
    true
  );

  assert.equal(
    shouldShowLoginGate({
      workspaceMode: 'PRACTICE',
      isAuthenticated: false,
      isScreenLocked: false,
      requireLoginOnStartup: true,
    }),
    false
  );

  assert.equal(
    shouldShowLoginGate({
      workspaceMode: 'PRACTICE',
      isAuthenticated: false,
      isScreenLocked: true,
      requireLoginOnStartup: true,
    }),
    true
  );
});

test('evaluateLocalAccountLogin verifies password and PIN and blocks invalid or deactivated accounts', () => {
  const owner = makeUser();
  const pwd = hashSecretWithSalt('OwnerPass2026');
  const pin = hashSecretWithSalt('4321');
  const credentialsMap: Record<string, LocalCredentialRecord> = {
    [owner.id]: {
      userId: owner.id,
      passwordHash: pwd.hash,
      passwordSalt: pwd.salt,
      pinHash: pin.hash,
      pinSalt: pin.salt,
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  };

  // Correct password via username
  const okPwd = evaluateLocalAccountLogin({
    users: [owner],
    credentialsMap,
    usernameOrEmail: 'ADMIN',
    password: 'OwnerPass2026',
  });
  assert.equal(okPwd.ok, true);
  assert.equal(okPwd.user?.id, owner.id);

  // Wrong password rejected
  const badPwd = evaluateLocalAccountLogin({
    users: [owner],
    credentialsMap,
    usernameOrEmail: 'admin',
    password: 'WrongPassword1',
  });
  assert.equal(badPwd.ok, false);
  assert.equal(badPwd.errorCode, AUTH_ERROR_CODES.INVALID_CREDENTIALS);

  // Correct PIN via userId
  const okPin = evaluateLocalAccountLogin({
    users: [owner],
    credentialsMap,
    userId: owner.id,
    pin: '4321',
  });
  assert.equal(okPin.ok, true);

  // Wrong PIN rejected
  const badPin = evaluateLocalAccountLogin({
    users: [owner],
    credentialsMap,
    userId: owner.id,
    pin: '9999',
  });
  assert.equal(badPin.ok, false);
  assert.equal(badPin.errorCode, AUTH_ERROR_CODES.INVALID_CREDENTIALS);

  // Missing password/PIN rejected
  const emptyCred = evaluateLocalAccountLogin({
    users: [owner],
    credentialsMap,
    userId: owner.id,
  });
  assert.equal(emptyCred.ok, false);
  assert.equal(emptyCred.errorCode, AUTH_ERROR_CODES.PASSWORD_REQUIRED);

  // Deactivated user rejected
  const deactivated = makeUser({ id: 'usr-disabled', username: 'disabled', isActive: false });
  const disabledRes = evaluateLocalAccountLogin({
    users: [deactivated],
    credentialsMap,
    usernameOrEmail: 'disabled',
    password: 'OwnerPass2026',
  });
  assert.equal(disabledRes.ok, false);
  assert.equal(disabledRes.errorCode, AUTH_ERROR_CODES.USER_DEACTIVATED);
});

test('evaluateLocalAccountLogin flags legacy accounts without passwords as NEEDS_PASSWORD_SETUP', () => {
  const legacyUser = makeUser({
    id: 'usr-legacy',
    username: 'legacy',
    pin: '0000',
    hasPassword: false,
  });

  const res = evaluateLocalAccountLogin({
    users: [legacyUser],
    credentialsMap: {},
    usernameOrEmail: 'legacy',
    password: 'anything',
  });
  assert.equal(res.ok, false);
  assert.equal(res.errorCode, AUTH_ERROR_CODES.NEEDS_PASSWORD_SETUP);
  assert.equal(res.user?.id, legacyUser.id);
});
