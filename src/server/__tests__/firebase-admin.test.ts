/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  extractBearerToken,
  FIREBASE_AUTH_ERROR_CODES,
  FirebaseAuthVerificationError,
  setFirebaseTokenVerifierForTests,
  verifyFirebaseIdToken,
} from '../firebase-admin.ts';

describe('server/firebase-admin ID token verification', () => {
  afterEach(() => {
    setFirebaseTokenVerifierForTests(null);
  });

  it('extracts Bearer tokens cleanly and rejects non-Bearer headers', () => {
    assert.equal(extractBearerToken('Bearer abc.def.ghi'), 'abc.def.ghi');
    assert.equal(extractBearerToken('bearer   xyz123  '), 'xyz123');
    assert.equal(extractBearerToken('Basic foo'), null);
    assert.equal(extractBearerToken(''), null);
    assert.equal(extractBearerToken(undefined), null);
  });

  it('throws 401 MISSING_FIREBASE_TOKEN when token is empty', async () => {
    await assert.rejects(
      () => verifyFirebaseIdToken('   '),
      (err: unknown) =>
        err instanceof FirebaseAuthVerificationError &&
        err.statusCode === 401 &&
        err.errorCode === FIREBASE_AUTH_ERROR_CODES.MISSING_FIREBASE_TOKEN
    );
  });

  it('normalizes valid Firebase identity email and preserves claims', async () => {
    setFirebaseTokenVerifierForTests(async (token) => {
      assert.equal(token, 'valid-token-123');
      return {
        uid: 'fb-uid-001',
        email: '  Owner@Shop.COM ',
        emailVerified: true,
        name: 'Ahmed Owner',
      };
    });

    const identity = await verifyFirebaseIdToken('valid-token-123');
    assert.deepEqual(identity, {
      uid: 'fb-uid-001',
      email: 'owner@shop.com',
      emailVerified: true,
      name: 'Ahmed Owner',
      picture: undefined,
    });
  });

  it('maps expired, revoked, disabled, and missing-email token failures explicitly', async () => {
    setFirebaseTokenVerifierForTests(async () => {
      const err = new Error('expired') as Error & { code: string };
      err.code = 'auth/id-token-expired';
      throw err;
    });
    await assert.rejects(
      () => verifyFirebaseIdToken('tok'),
      (err: unknown) =>
        err instanceof FirebaseAuthVerificationError &&
        err.statusCode === 401 &&
        err.errorCode === FIREBASE_AUTH_ERROR_CODES.TOKEN_EXPIRED
    );

    setFirebaseTokenVerifierForTests(async () => {
      const err = new Error('revoked') as Error & { code: string };
      err.code = 'auth/id-token-revoked';
      throw err;
    });
    await assert.rejects(
      () => verifyFirebaseIdToken('tok'),
      (err: unknown) =>
        err instanceof FirebaseAuthVerificationError &&
        err.statusCode === 401 &&
        err.errorCode === FIREBASE_AUTH_ERROR_CODES.TOKEN_REVOKED
    );

    setFirebaseTokenVerifierForTests(async () => {
      const err = new Error('disabled') as Error & { code: string };
      err.code = 'auth/user-disabled';
      throw err;
    });
    await assert.rejects(
      () => verifyFirebaseIdToken('tok'),
      (err: unknown) =>
        err instanceof FirebaseAuthVerificationError &&
        err.statusCode === 403 &&
        err.errorCode === FIREBASE_AUTH_ERROR_CODES.USER_ACCOUNT_DEACTIVATED
    );

    setFirebaseTokenVerifierForTests(async () => ({
      uid: 'fb-no-email',
      email: '',
      emailVerified: false,
    }));
    await assert.rejects(
      () => verifyFirebaseIdToken('tok'),
      (err: unknown) =>
        err instanceof FirebaseAuthVerificationError &&
        err.statusCode === 400 &&
        err.errorCode === FIREBASE_AUTH_ERROR_CODES.FIREBASE_EMAIL_REQUIRED
    );
  });
});
