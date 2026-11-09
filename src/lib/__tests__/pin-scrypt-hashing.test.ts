import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import {
  hashPinScrypt,
  isScryptHashedPin,
  verifyPinScrypt,
  sanitizeStoredUser,
  createCompanyAndInitialOwner,
  authenticateAccount,
  loadPlatformState,
} from '../../server/release-onboarding.service.ts';

const DATA_DIR = path.resolve(process.cwd(), '.data');
const FILES_TO_BACKUP = [
  'platform-onboarding-state.json',
  'store-state.json',
];
const backups = new Map<string, string | null>();

before(() => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  for (const filename of FILES_TO_BACKUP) {
    const filePath = path.join(DATA_DIR, filename);
    if (fs.existsSync(filePath)) {
      backups.set(filename, fs.readFileSync(filePath, 'utf-8'));
    } else {
      backups.set(filename, null);
    }
  }
});

after(() => {
  for (const [filename, content] of backups.entries()) {
    const filePath = path.join(DATA_DIR, filename);
    if (content === null) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } else {
      fs.writeFileSync(filePath, content, 'utf-8');
    }
  }
});

test('PIN scrypt hashing & verification (Problem #3)', async (t) => {
  await t.test('hashPinScrypt produces salted scrypt hash and never exposes plaintext', () => {
    const rawPin = '4829';
    const hashed1 = hashPinScrypt(rawPin);
    const hashed2 = hashPinScrypt(rawPin);

    assert.notEqual(hashed1.formatted, rawPin, 'Formatted PIN must not equal plaintext');
    assert.ok(isScryptHashedPin(hashed1.formatted), 'Formatted PIN must match scrypt$salt$hash format');
    assert.notEqual(hashed1.salt, hashed2.salt, 'Each hash must generate a unique random salt');
    assert.notEqual(hashed1.hash, hashed2.hash, 'Different salts must yield different hashes');
    assert.ok(!hashed1.formatted.includes(rawPin), 'Formatted scrypt string must not contain raw PIN');
  });

  await t.test('verifyPinScrypt validates correct PIN and rejects wrong PINs', () => {
    const rawPin = '7391';
    const hashed = hashPinScrypt(rawPin);

    assert.equal(
      verifyPinScrypt('7391', {
        pin: hashed.formatted,
        pinHash: hashed.hash,
        pinSalt: hashed.salt,
      }),
      true,
      'Must verify matching PIN against pinHash + pinSalt'
    );

    assert.equal(
      verifyPinScrypt('7391', hashed.formatted),
      true,
      'Must verify matching PIN against formatted scrypt string'
    );

    assert.equal(
      verifyPinScrypt('0000', {
        pin: hashed.formatted,
        pinHash: hashed.hash,
        pinSalt: hashed.salt,
      }),
      false,
      'Must reject incorrect PIN'
    );

    assert.equal(
      verifyPinScrypt('', {
        pin: hashed.formatted,
        pinHash: hashed.hash,
        pinSalt: hashed.salt,
      }),
      false,
      'Must reject empty PIN'
    );
  });

  await t.test('sanitizeStoredUser strips pinHash, pinSalt, and scrypt$ pin from API responses', () => {
    const hashed = hashPinScrypt('9988');
    const storedUser: any = {
      id: 'usr-test-sanitize',
      name: 'Cashier One',
      pin: hashed.formatted,
      pinHash: hashed.hash,
      pinSalt: hashed.salt,
      passwordHash: 'secret-pwd-hash',
      passwordSalt: 'secret-pwd-salt',
    };

    const safe = sanitizeStoredUser(storedUser) as any;
    assert.equal(safe.passwordHash, undefined);
    assert.equal(safe.passwordSalt, undefined);
    assert.equal(safe.pinHash, undefined);
    assert.equal(safe.pinSalt, undefined);
    assert.equal(safe.pin, undefined);
    assert.equal(safe.hasPin, true);
  });

  await t.test('createCompanyAndInitialOwner stores owner PIN hashed with scrypt and authenticates via PIN', async () => {
    const uniqueSuffix = Date.now().toString(36);
    const onboardingResult = await createCompanyAndInitialOwner({
      idempotencyKey: `idem-pin-test-${uniqueSuffix}`,
      company: {
        legalName: `Pin Hash Test Store ${uniqueSuffix}`,
        baseCurrency: 'SDG',
      },
      mainBranch: {
        name: 'Main Branch',
      },
      owner: {
        fullName: 'Owner Pin Tester',
        usernameOrEmail: `pinowner_${uniqueSuffix}@dqnamo.sd`,
        password: 'StrongPassword#2026',
        confirmPassword: 'StrongPassword#2026',
        pin: '6428',
      },
    });

    assert.equal(onboardingResult.ok, true);
    // API response owner must be sanitized
    assert.equal((onboardingResult.owner as any).pin, undefined);
    assert.equal((onboardingResult.owner as any).pinHash, undefined);
    assert.equal((onboardingResult.owner as any).hasPin, true);

    // Persisted record in platform state must have scrypt-hashed PIN, never plaintext '6428'
    const state = loadPlatformState();
    const persistedOwner = state.users.find((u) => u.id === onboardingResult.owner.id);
    assert.ok(persistedOwner, 'Owner must exist in platform state');
    assert.notEqual(persistedOwner.pin, '6428', 'Persisted PIN must not be plaintext');
    assert.ok(isScryptHashedPin(persistedOwner.pin), 'Persisted PIN must be in scrypt$ format');
    assert.ok(persistedOwner.pinHash && persistedOwner.pinHash.length >= 64, 'pinHash must be stored');
    assert.ok(persistedOwner.pinSalt && persistedOwner.pinSalt.length >= 16, 'pinSalt must be stored');

    // Authentication with correct PIN succeeds
    const authOk = authenticateAccount({
      companyId: onboardingResult.company.id,
      identifier: persistedOwner.username,
      passwordOrPin: '6428',
    });
    assert.equal(authOk.ok, true, 'Authentication with valid PIN must succeed');

    // Authentication with wrong PIN fails
    const authFail = authenticateAccount({
      companyId: onboardingResult.company.id,
      identifier: persistedOwner.username,
      passwordOrPin: '1111',
    });
    assert.equal(authFail.ok, false, 'Authentication with wrong PIN must fail');
  });
});
