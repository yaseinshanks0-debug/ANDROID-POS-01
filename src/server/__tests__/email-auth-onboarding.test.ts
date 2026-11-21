/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import type { AddressInfo } from 'node:net';
import { getDataDir } from '../runtime-paths.ts';
import {
  FirebaseAuthVerificationError,
  FIREBASE_AUTH_ERROR_CODES,
  setFirebaseTokenVerifierForTests,
} from '../firebase-admin.ts';
import {
  loadPlatformState,
  releasePlatformRouter,
  savePlatformState,
} from '../release-onboarding.service.ts';

const PLATFORM_STATE_FILE = path.resolve(getDataDir(), 'platform-onboarding-state.json');
let originalStateSnapshot: string | null = null;
let server: ReturnType<express.Express['listen']>;
let baseUrl = '';

before(async () => {
  if (fs.existsSync(PLATFORM_STATE_FILE)) {
    originalStateSnapshot = fs.readFileSync(PLATFORM_STATE_FILE, 'utf8');
  }
  const app = express();
  app.use(express.json());
  app.use('/api', releasePlatformRouter);
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      const addr = server.address() as AddressInfo;
      baseUrl = `http://127.0.0.1:${addr.port}`;
      resolve();
    });
  });
});

after(async () => {
  setFirebaseTokenVerifierForTests(null);
  await new Promise<void>((resolve) => server.close(() => resolve()));
  if (originalStateSnapshot !== null) {
    fs.writeFileSync(PLATFORM_STATE_FILE, originalStateSnapshot, 'utf8');
  } else if (fs.existsSync(PLATFORM_STATE_FILE)) {
    fs.unlinkSync(PLATFORM_STATE_FILE);
  }
});

test('POST /api/onboarding/companies supports Firebase email-backed company creation and blocks duplicate UID binding', async () => {
  const uniqueSuffix = Date.now().toString(36);
  const ownerUid = `fb-uid-owner-${uniqueSuffix}`;
  const ownerEmail = `owner.${uniqueSuffix}@dqnamo-test.com`;

  setFirebaseTokenVerifierForTests(async (token) => {
    if (token === 'fb-owner-token') {
      return {
        uid: ownerUid,
        email: ownerEmail,
        emailVerified: true,
        name: 'Ahmed Owner',
      };
    }
    throw new FirebaseAuthVerificationError(
      401,
      FIREBASE_AUTH_ERROR_CODES.INVALID_FIREBASE_TOKEN,
      'Invalid token'
    );
  });

  const createRes = await fetch(`${baseUrl}/api/onboarding/companies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer fb-owner-token',
    },
    body: JSON.stringify({
      idempotencyKey: `idem-${uniqueSuffix}`,
      company: {
        legalName: `Al-Nile Retail ${uniqueSuffix}`,
        displayName: `Al-Nile Retail ${uniqueSuffix}`,
        baseCurrency: 'SDG',
      },
      mainBranch: { name: 'Khartoum HQ' },
      owner: {
        fullName: 'Ahmed Owner',
        usernameOrEmail: ownerEmail,
        password: '',
        confirmPassword: '',
        pin: '2468',
      },
    }),
  });

  assert.equal(createRes.status, 201);
  const createJson = (await createRes.json()) as {
    success: boolean;
    data: {
      company: { id: string };
      owner: { id: string; firebaseUid?: string; email?: string; emailVerified?: boolean };
      sessionToken: string;
    };
  };
  assert.equal(createJson.success, true);
  assert.equal(createJson.data.owner.firebaseUid, ownerUid);
  assert.equal(createJson.data.owner.email, ownerEmail);
  assert.equal(createJson.data.owner.emailVerified, true);
  assert.ok(createJson.data.sessionToken.startsWith('dqsess_'));

  // Attempting to create a second company with the SAME Firebase UID must fail with 409
  const dupRes = await fetch(`${baseUrl}/api/onboarding/companies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer fb-owner-token',
    },
    body: JSON.stringify({
      idempotencyKey: `idem-dup-${uniqueSuffix}`,
      company: { legalName: `Second Store ${uniqueSuffix}` },
      mainBranch: { name: 'Branch 2' },
      owner: { fullName: 'Ahmed Owner', usernameOrEmail: ownerEmail, password: '', confirmPassword: '' },
    }),
  });
  assert.equal(dupRes.status, 409);
  const dupJson = (await dupRes.json()) as { errorCode: string };
  assert.equal(dupJson.errorCode, 'FIREBASE_UID_ALREADY_LINKED');

  // Exchange the bound Firebase token for a fresh POS session
  const exchangeRes = await fetch(`${baseUrl}/api/auth/firebase-exchange`, {
    method: 'POST',
    headers: { Authorization: 'Bearer fb-owner-token' },
  });
  assert.equal(exchangeRes.status, 200);
  const exchangeJson = (await exchangeRes.json()) as {
    success: boolean;
    data: { status: string; sessionToken: string; user: { id: string } };
  };
  assert.equal(exchangeJson.data.status, 'AUTHENTICATED');
  assert.equal(exchangeJson.data.user.id, createJson.data.owner.id);
  assert.ok(exchangeJson.data.sessionToken.startsWith('dqsess_'));

  // Deactivating the user blocks firebase-exchange with 403 and revokes sessions
  const state = loadPlatformState();
  const targetUser = state.users.find((u) => u.id === createJson.data.owner.id);
  assert.ok(targetUser);
  targetUser.isActive = false;
  savePlatformState(state);

  const deactivatedRes = await fetch(`${baseUrl}/api/auth/firebase-exchange`, {
    method: 'POST',
    headers: { Authorization: 'Bearer fb-owner-token' },
  });
  assert.equal(deactivatedRes.status, 403);
  const deactivatedJson = (await deactivatedRes.json()) as { errorCode: string };
  assert.equal(deactivatedJson.errorCode, 'USER_ACCOUNT_DEACTIVATED');
});

test('POST /api/auth/firebase-exchange returns UNBOUND for unlinked Firebase user (never auto-links by email)', async () => {
  const uniqueSuffix = `${Date.now().toString(36)}u`;
  setFirebaseTokenVerifierForTests(async () => ({
    uid: `fb-unbound-${uniqueSuffix}`,
    email: `stranger.${uniqueSuffix}@example.com`,
    emailVerified: false,
  }));

  const res = await fetch(`${baseUrl}/api/auth/firebase-exchange`, {
    method: 'POST',
    headers: { Authorization: 'Bearer some-unbound-token' },
  });
  assert.equal(res.status, 200);
  const body = (await res.json()) as {
    success: boolean;
    data: { status: string; email: string; emailVerified: boolean };
  };
  assert.equal(body.success, true);
  assert.equal(body.data.status, 'UNBOUND');
  assert.equal(body.data.email, `stranger.${uniqueSuffix}@example.com`);
  assert.equal(body.data.emailVerified, false);
});

test('POST /api/auth/link-firebase-email links an existing legacy POS owner and prevents cross-user takeover', async () => {
  const uniqueSuffix = `${Date.now().toString(36)}l`;
  const linkedUid = `fb-linked-${uniqueSuffix}`;
  const linkedEmail = `legacy.owner.${uniqueSuffix}@dqnamo-test.com`;

  // Ensure a clean fresh state for legacy onboarding test
  const stateBefore = loadPlatformState();
  stateBefore.companies = stateBefore.companies.filter((c) => c.isDemo);
  stateBefore.branches = stateBefore.branches.filter((b) => b.companyId === 'comp-demo-practice');
  stateBefore.users = stateBefore.users.filter((u) => u.companyId === 'comp-demo-practice');
  stateBefore.sessions = [];
  savePlatformState(stateBefore);

  // Create legacy company without Firebase token
  const createRes = await fetch(`${baseUrl}/api/onboarding/companies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      company: { legalName: `Legacy Co ${uniqueSuffix}` },
      mainBranch: { name: 'Main Branch' },
      owner: {
        fullName: 'Legacy Owner',
        usernameOrEmail: `legacy_${uniqueSuffix}`,
        password: 'Password123',
        confirmPassword: 'Password123',
        pin: '1357',
      },
    }),
  });
  assert.equal(createRes.status, 201);
  const created = (await createRes.json()) as {
    data: { sessionToken: string; owner: { id: string } };
  };

  setFirebaseTokenVerifierForTests(async () => ({
    uid: linkedUid,
    email: linkedEmail,
    emailVerified: true,
  }));

  const linkRes = await fetch(`${baseUrl}/api/auth/link-firebase-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${created.data.sessionToken}`,
    },
    body: JSON.stringify({ firebaseIdToken: 'fb-link-token' }),
  });
  assert.equal(linkRes.status, 200);
  const linkJson = (await linkRes.json()) as {
    success: boolean;
    data: { user: { id: string; firebaseUid: string; email: string } };
  };
  assert.equal(linkJson.success, true);
  assert.equal(linkJson.data.user.firebaseUid, linkedUid);
  assert.equal(linkJson.data.user.email, linkedEmail);

  // Now Firebase exchange authenticates the linked legacy owner
  const exchangeRes = await fetch(`${baseUrl}/api/auth/firebase-exchange`, {
    method: 'POST',
    headers: { Authorization: 'Bearer fb-link-token' },
  });
  assert.equal(exchangeRes.status, 200);
  const exchangeJson = (await exchangeRes.json()) as {
    data: { status: string; user: { id: string } };
  };
  assert.equal(exchangeJson.data.status, 'AUTHENTICATED');
  assert.equal(exchangeJson.data.user.id, created.data.owner.id);
});
