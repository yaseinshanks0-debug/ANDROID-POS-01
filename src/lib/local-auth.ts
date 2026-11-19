/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { POSUser, WorkspaceMode } from './types';

export const LOCAL_CREDENTIALS_STORAGE_KEY = 'dqnamo_pos_local_credentials_v1';
export const AUTH_SESSION_STORAGE_KEY = 'dqnamo_pos_auth_session_v1';

export const AUTH_ERROR_CODES = {
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_DEACTIVATED: 'USER_ACCOUNT_DEACTIVATED',
  PASSWORD_REQUIRED: 'PASSWORD_REQUIRED',
  PIN_REQUIRED: 'PIN_REQUIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  NEEDS_PASSWORD_SETUP: 'NEEDS_PASSWORD_SETUP',
  WEAK_PASSWORD: 'WEAK_PASSWORD',
  INVALID_PIN: 'INVALID_PIN',
} as const;

export type AuthErrorCode = (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES];

export const LOGIN_METHODS = {
  PASSWORD: 'password',
  PIN: 'pin',
} as const;

export type LoginMethod = (typeof LOGIN_METHODS)[keyof typeof LOGIN_METHODS];

export interface LocalCredentialRecord {
  userId: string;
  passwordHash?: string;
  passwordSalt?: string;
  pinHash?: string;
  pinSalt?: string;
  updatedAt: string;
}

export interface VerifiedAuthSessionRecord {
  userId: string;
  companyId: string;
  workspaceMode: WorkspaceMode;
  authenticatedAt: string;
}

export interface PasswordStrengthResult {
  valid: boolean;
  messageEn?: string;
  messageAr?: string;
}

export interface LocalAuthLoginInput {
  users: POSUser[];
  credentialsMap: Record<string, LocalCredentialRecord>;
  userId?: string;
  usernameOrEmail?: string;
  password?: string;
  pin?: string;
}

export interface LocalAuthLoginResult {
  ok: boolean;
  user?: POSUser;
  errorCode?: AuthErrorCode;
  messageEn?: string;
  messageAr?: string;
}

export interface LoginGateVisibilityInput {
  workspaceMode: WorkspaceMode;
  isAuthenticated: boolean;
  isScreenLocked: boolean;
  requireLoginOnStartup: boolean;
}

// ============================================================================
// Pure-TS SHA-256 + Iterated Salted Key Derivation
// Works identically across HTTPS, HTTP LAN IPs, Android WebView, and Node.js
// ============================================================================

const SHA256_K: readonly number[] = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
];

function rotr(value: number, bits: number): number {
  return (value >>> bits) | (value << (32 - bits));
}

function utf8ToBytes(str: string): Uint8Array {
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder().encode(str);
  }
  const out: number[] = [];
  for (let i = 0; i < str.length; i++) {
    let code = str.charCodeAt(i);
    if (code < 0x80) {
      out.push(code);
    } else if (code < 0x800) {
      out.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
    } else {
      out.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
    }
  }
  return new Uint8Array(out);
}

export function sha256Hex(message: string): string {
  const bytes = utf8ToBytes(message);
  const bitLen = bytes.length * 8;
  const paddedLen = Math.ceil((bytes.length + 9) / 64) * 64;
  const padded = new Uint8Array(paddedLen);
  padded.set(bytes);
  padded[bytes.length] = 0x80;

  const view = new DataView(padded.buffer);
  const highBits = Math.floor(bitLen / 0x100000000);
  const lowBits = bitLen >>> 0;
  view.setUint32(paddedLen - 8, highBits, false);
  view.setUint32(paddedLen - 4, lowBits, false);

  let h0 = 0x6a09e667;
  let h1 = 0xbb67ae85;
  let h2 = 0x3c6ef372;
  let h3 = 0xa54ff53a;
  let h4 = 0x510e527f;
  let h5 = 0x9b05688c;
  let h6 = 0x1f83d9ab;
  let h7 = 0x5be0cd19;

  const w = new Uint32Array(64);

  for (let offset = 0; offset < paddedLen; offset += 64) {
    for (let i = 0; i < 16; i++) {
      w[i] = view.getUint32(offset + i * 4, false);
    }
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }

    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;
    let f = h5;
    let g = h6;
    let h = h7;

    for (let i = 0; i < 64; i++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + SHA256_K[i] + w[i]) >>> 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
    h5 = (h5 + f) >>> 0;
    h6 = (h6 + g) >>> 0;
    h7 = (h7 + h) >>> 0;
  }

  return [h0, h1, h2, h3, h4, h5, h6, h7]
    .map((n) => n.toString(16).padStart(8, '0'))
    .join('');
}

function generateSaltHex(byteLength = 16): string {
  const bytes = new Uint8Array(byteLength);
  if (typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.getRandomValues === 'function') {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < byteLength; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

const KEY_DERIVATION_ROUNDS = 2048;

export function hashSecretWithSalt(
  secret: string,
  existingSalt?: string
): { hash: string; salt: string } {
  const salt = existingSalt || generateSaltHex(16);
  const normalized = String(secret).trim();
  let digest = sha256Hex(`dqnamo-pos-auth-v1:${salt}:${normalized}`);
  for (let i = 0; i < KEY_DERIVATION_ROUNDS; i++) {
    digest = sha256Hex(`${digest}:${salt}:${i}`);
  }
  return { hash: digest, salt };
}

function timingSafeStringEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export function verifySecretWithSalt(secret: string, expectedHash: string, salt: string): boolean {
  if (!secret || !expectedHash || !salt) return false;
  const derived = hashSecretWithSalt(secret, salt);
  return timingSafeStringEqual(derived.hash, expectedHash);
}

// ============================================================================
// Password & PIN Validation Policies (Aligned with Server Policy)
// ============================================================================

export function validatePasswordStrengthPolicy(password: string): PasswordStrengthResult {
  const trimmed = typeof password === 'string' ? password.trim() : '';
  if (trimmed.length < 8) {
    return {
      valid: false,
      messageEn: 'Password must be at least 8 characters long.',
      messageAr: 'يجب أن تتكون كلمة المرور من 8 أحرف أو أرقام على الأقل.',
    };
  }
  const hasLetter = /[A-Za-z\u0600-\u06FF]/.test(trimmed);
  const hasDigit = /\d/.test(trimmed);
  if (!hasLetter || !hasDigit) {
    return {
      valid: false,
      messageEn: 'Password must contain both letters and numbers (at least 8 characters).',
      messageAr: 'يجب أن تحتوي كلمة المرور على أحرف وأرقام معاً (8 خانات على الأقل).',
    };
  }
  return { valid: true };
}

export function validatePinPolicy(pin: string): PasswordStrengthResult {
  const trimmed = typeof pin === 'string' ? pin.trim() : '';
  if (!/^\d{4,8}$/.test(trimmed)) {
    return {
      valid: false,
      messageEn: 'PIN must be 4 to 8 digits.',
      messageAr: 'يجب أن يتكون رمز الدخول السريع PIN من 4 إلى 8 أرقام.',
    };
  }
  return { valid: true };
}

// ============================================================================
// Local Credentials Storage (Isolated from Backups & Plaintext User Records)
// ============================================================================

export function loadLocalCredentialsMap(): Record<string, LocalCredentialRecord> {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return {};
    const raw = window.localStorage.getItem(LOCAL_CREDENTIALS_STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return {};
    }
    return parsed as Record<string, LocalCredentialRecord>;
  } catch {
    return {};
  }
}

export function saveLocalUserCredentials(
  userId: string,
  secrets: { password?: string; pin?: string }
): LocalCredentialRecord | null {
  const cleanUserId = String(userId || '').trim();
  if (!cleanUserId) return null;

  const cleanPassword = typeof secrets.password === 'string' ? secrets.password.trim() : '';
  const cleanPin =
    typeof secrets.pin === 'string' && !secrets.pin.startsWith('scrypt$')
      ? secrets.pin.trim()
      : '';

  if (!cleanPassword && !cleanPin) return null;

  const currentMap = loadLocalCredentialsMap();
  const existing = currentMap[cleanUserId];
  const nextRecord: LocalCredentialRecord = {
    userId: cleanUserId,
    passwordHash: existing?.passwordHash,
    passwordSalt: existing?.passwordSalt,
    pinHash: existing?.pinHash,
    pinSalt: existing?.pinSalt,
    updatedAt: new Date().toISOString(),
  };

  if (cleanPassword) {
    const hashedPwd = hashSecretWithSalt(cleanPassword);
    nextRecord.passwordHash = hashedPwd.hash;
    nextRecord.passwordSalt = hashedPwd.salt;
  }

  if (cleanPin) {
    const hashedPin = hashSecretWithSalt(cleanPin);
    nextRecord.pinHash = hashedPin.hash;
    nextRecord.pinSalt = hashedPin.salt;
  }

  const updatedMap: Record<string, LocalCredentialRecord> = {
    ...currentMap,
    [cleanUserId]: nextRecord,
  };

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(LOCAL_CREDENTIALS_STORAGE_KEY, JSON.stringify(updatedMap));
    }
  } catch {}

  return nextRecord;
}

export function deleteLocalUserCredentials(userId: string): void {
  const cleanUserId = String(userId || '').trim();
  if (!cleanUserId) return;
  const currentMap = loadLocalCredentialsMap();
  if (!currentMap[cleanUserId]) return;
  delete currentMap[cleanUserId];
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(LOCAL_CREDENTIALS_STORAGE_KEY, JSON.stringify(currentMap));
    }
  } catch {}
}

export function clearAllLocalUserCredentials(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(LOCAL_CREDENTIALS_STORAGE_KEY);
    }
  } catch {}
}

// ============================================================================
// Verified Browser Session Persistence (sessionStorage — cleared on close/logout)
// ============================================================================

export function loadVerifiedAuthSession(): VerifiedAuthSessionRecord | null {
  try {
    if (typeof window === 'undefined' || !window.sessionStorage) return null;
    const raw = window.sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<VerifiedAuthSessionRecord>;
    if (!parsed || typeof parsed.userId !== 'string' || !parsed.userId.trim()) {
      return null;
    }
    return {
      userId: parsed.userId,
      companyId: typeof parsed.companyId === 'string' ? parsed.companyId : 'comp-clean-store',
      workspaceMode: parsed.workspaceMode === 'PRACTICE' ? 'PRACTICE' : 'PRODUCTION',
      authenticatedAt:
        typeof parsed.authenticatedAt === 'string'
          ? parsed.authenticatedAt
          : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function saveVerifiedAuthSession(record: VerifiedAuthSessionRecord): void {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(record));
    }
  } catch {}
}

export function clearVerifiedAuthSession(): void {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    }
  } catch {}
}

// ============================================================================
// Pure Auth Gate & Local Account Verification Rules
// ============================================================================

export function hasConfiguredSecretForUser(
  user: POSUser,
  credRecord?: LocalCredentialRecord
): boolean {
  if (credRecord?.passwordHash && credRecord.passwordSalt) return true;
  if (credRecord?.pinHash && credRecord.pinSalt) return true;
  if (user.hasPassword) return true;
  const legacyPin = typeof user.pin === 'string' ? user.pin.trim() : '';
  if (legacyPin.length >= 4 && legacyPin !== '0000' && !legacyPin.startsWith('scrypt$')) {
    return true;
  }
  return false;
}

export function shouldShowLoginGate(input: LoginGateVisibilityInput): boolean {
  if (input.isScreenLocked) return true;
  if (input.workspaceMode === 'PRACTICE') {
    return false;
  }
  if (!input.requireLoginOnStartup) {
    return false;
  }
  return !input.isAuthenticated;
}

export function evaluateLocalAccountLogin(input: LocalAuthLoginInput): LocalAuthLoginResult {
  const { users, credentialsMap, userId, usernameOrEmail, password, pin } = input;
  const query = String(usernameOrEmail || '').trim().toLowerCase();

  const matchedUser = users.find((u) => {
    if (userId && u.id === userId) return true;
    if (!query) return false;
    return (
      (u.username && u.username.trim().toLowerCase() === query) ||
      (u.email && u.email.trim().toLowerCase() === query) ||
      (u.phone && u.phone.trim().toLowerCase() === query) ||
      u.name.trim().toLowerCase() === query ||
      (u.nameAr && u.nameAr.trim().toLowerCase() === query) ||
      u.id.toLowerCase() === query
    );
  });

  if (!matchedUser) {
    return {
      ok: false,
      errorCode: AUTH_ERROR_CODES.USER_NOT_FOUND,
      messageEn: 'Account not found. Check your username or select an account.',
      messageAr: 'لم يتم العثور على الحساب. تأكد من اسم المستخدم أو اختر حساباً.',
    };
  }

  if (matchedUser.isActive === false) {
    return {
      ok: false,
      errorCode: AUTH_ERROR_CODES.USER_DEACTIVATED,
      messageEn: 'This account has been deactivated by an administrator.',
      messageAr: 'تم تعطيل هذا الحساب من قبل المدير ولا يمكن تسجيل الدخول به.',
    };
  }

  const cred = credentialsMap[matchedUser.id];
  const hasPasswordHash = Boolean(cred?.passwordHash && cred.passwordSalt);
  const hasPinHash = Boolean(cred?.pinHash && cred.pinSalt);
  const legacyPin =
    typeof matchedUser.pin === 'string' &&
    matchedUser.pin.trim().length >= 4 &&
    matchedUser.pin.trim() !== '0000' &&
    !matchedUser.pin.startsWith('scrypt$')
      ? matchedUser.pin.trim()
      : '';

  if (!hasPasswordHash && !hasPinHash && !legacyPin) {
    return {
      ok: false,
      user: matchedUser,
      errorCode: AUTH_ERROR_CODES.NEEDS_PASSWORD_SETUP,
      messageEn: 'This account does not have a password configured yet. Please set one now.',
      messageAr: 'هذا الحساب لا يحتوي على كلمة مرور بعد. يرجى تعيين كلمة مرور الآن لتأمين الدخول.',
    };
  }

  const cleanPassword = typeof password === 'string' ? password.trim() : '';
  const cleanPin = typeof pin === 'string' ? pin.trim() : '';

  if (!cleanPassword && !cleanPin) {
    return {
      ok: false,
      errorCode: hasPasswordHash
        ? AUTH_ERROR_CODES.PASSWORD_REQUIRED
        : AUTH_ERROR_CODES.PIN_REQUIRED,
      messageEn: hasPasswordHash
        ? 'Please enter your password or PIN to sign in.'
        : 'Please enter your PIN code to sign in.',
      messageAr: hasPasswordHash
        ? 'يرجى إدخال كلمة المرور أو رمز PIN لتسجيل الدخول.'
        : 'يرجى إدخال رمز الدخول السريع PIN لتسجيل الدخول.',
    };
  }

  if (cleanPassword) {
    if (hasPasswordHash && cred?.passwordHash && cred.passwordSalt) {
      if (verifySecretWithSalt(cleanPassword, cred.passwordHash, cred.passwordSalt)) {
        return { ok: true, user: matchedUser };
      }
      return {
        ok: false,
        errorCode: AUTH_ERROR_CODES.INVALID_CREDENTIALS,
        messageEn: 'Incorrect password. Please try again.',
        messageAr: 'كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.',
      };
    }
    // Account only has PIN configured (no password hash) — check if entered value matches PIN
    if (hasPinHash && cred?.pinHash && cred.pinSalt) {
      if (verifySecretWithSalt(cleanPassword, cred.pinHash, cred.pinSalt)) {
        return { ok: true, user: matchedUser };
      }
    } else if (legacyPin && timingSafeStringEqual(cleanPassword, legacyPin)) {
      return { ok: true, user: matchedUser };
    }
    return {
      ok: false,
      errorCode: AUTH_ERROR_CODES.INVALID_CREDENTIALS,
      messageEn: 'Incorrect password or PIN. Please try again.',
      messageAr: 'كلمة المرور أو رمز الدخول غير صحيح. يرجى المحاولة مرة أخرى.',
    };
  }

  // PIN verification path
  if (hasPinHash && cred?.pinHash && cred.pinSalt) {
    if (verifySecretWithSalt(cleanPin, cred.pinHash, cred.pinSalt)) {
      return { ok: true, user: matchedUser };
    }
    return {
      ok: false,
      errorCode: AUTH_ERROR_CODES.INVALID_CREDENTIALS,
      messageEn: 'Incorrect PIN code. Please try again.',
      messageAr: 'رمز الدخول السريع PIN غير صحيح. يرجى المحاولة مرة أخرى.',
    };
  }

  if (legacyPin && timingSafeStringEqual(cleanPin, legacyPin)) {
    return { ok: true, user: matchedUser };
  }

  return {
    ok: false,
    errorCode: AUTH_ERROR_CODES.INVALID_CREDENTIALS,
    messageEn: 'Incorrect PIN code or no PIN configured for this account.',
    messageAr: 'رمز الدخول PIN غير صحيح أو غير مفعّل لهذا الحساب.',
  };
}
