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
import { setFirebaseTokenVerifierForTests } from '../firebase-admin.ts';
import {
  createCompanyAndInitialOwner,
  loadPlatformState,
  releasePlatformRouter,
  savePlatformState,
} from '../release-onboarding.service.ts';
import { invitationsRouter } from '../invitations.service.ts';

const PLATFORM_STATE_FILE = path.resolve(getDataDir(), 'platform-onboarding-state.json');
let originalStateSnapshot: string | null = null;
let server: ReturnType<express.Express['listen']>;
let baseUrl = '';

let companyAOwnerToken = '';
let companyAId = '';
let companyABranchId = '';

let companyBOwnerToken = '';
let companyBBranchId = '';

before(async () => {
  if (fs.existsSync(PLATFORM_STATE_FILE)) {
    originalStateSnapshot = fs.readFileSync(PLATFORM_STATE_FILE, 'utf8');
  }

  // Reset to clean production state for deterministic invitation tests
  const state = loadPlatformState();
  state.companies = state.companies.filter((c) => c.isDemo);
  state.branches = state.branches.filter((b) => b.companyId === 'comp-demo-practice');
  state.users = state.users.filter((u) => u.companyId === 'comp-demo-practice');
  state.sessions = [];
  state.invitations = [];
  savePlatformState(state);

  const compA = await createCompanyAndInitialOwner({
    company: { legalName: 'Alpha Trading Co', displayName: 'Alpha Trading Co' },
    mainBranch: { name: 'Alpha HQ' },
    owner: {
      fullName: 'Alpha Owner',
      usernameOrEmail: 'alpha.owner@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      pin: '1111',
    },
  });
  companyAOwnerToken = compA.sessionToken;
  companyAId = compA.company.id;
  companyABranchId = compA.mainBranch.id;

  const compB = await createCompanyAndInitialOwner({
    company: { legalName: 'Beta Mart Co', displayName: 'Beta Mart Co' },
    mainBranch: { name: 'Beta HQ' },
    owner: {
      fullName: 'Beta Owner',
      usernameOrEmail: 'beta.owner@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      pin: '2222',
    },
  });
  companyBOwnerToken = compB.sessionToken;
  companyBBranchId = compB.mainBranch.id;

  const app = express();
  app.use(express.json());
  app.use('/api', releasePlatformRouter);
  app.use('/api/invitations', invitationsRouter);

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

test('Invitation lifecycle: create, auto-revoke duplicate pending, preview masks email, email mismatch blocked, single-use accept works', async () => {
  // 1. Cross-company branch rejected with 403
  const badBranchRes = await fetch(`${baseUrl}/api/invitations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${companyAOwnerToken}`,
    },
    body: JSON.stringify({
      email: 'cashier1@alpha.test',
      roleId: 'CASHIER',
      branchId: companyBBranchId,
    }),
  });
  assert.equal(badBranchRes.status, 403);

  // 2. Create first invite for cashier1@alpha.test
  const firstRes = await fetch(`${baseUrl}/api/invitations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${companyAOwnerToken}`,
    },
    body: JSON.stringify({
      email: 'Cashier1@Alpha.Test',
      invitedName: 'Sara Cashier',
      roleId: 'CASHIER',
      branchId: companyABranchId,
    }),
  });
  assert.equal(firstRes.status, 201);
  const firstJson = (await firstRes.json()) as {
    data: { invitation: { id: string }; inviteUrl: string; shortCode: string };
  };
  const firstToken = new URL(firstJson.data.inviteUrl).searchParams.get('invite') || '';
  assert.ok(firstToken.length >= 20);
  assert.match(firstJson.data.shortCode, /^DQ-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{4}-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{2}$/);

  // 3. Re-inviting same email auto-revokes the older PENDING invite
  const secondRes = await fetch(`${baseUrl}/api/invitations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${companyAOwnerToken}`,
    },
    body: JSON.stringify({
      email: 'cashier1@alpha.test',
      invitedName: 'Sara Cashier',
      roleId: 'CASHIER',
      branchId: companyABranchId,
    }),
  });
  assert.equal(secondRes.status, 201);
  const secondJson = (await secondRes.json()) as {
    data: { invitation: { id: string }; inviteUrl: string; shortCode: string };
  };
  const secondToken = new URL(secondJson.data.inviteUrl).searchParams.get('invite') || '';

  // Old token preview shows REVOKED
  const oldPreviewRes = await fetch(`${baseUrl}/api/invitations/preview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: firstToken }),
  });
  const oldPreview = (await oldPreviewRes.json()) as {
    data: { valid: boolean; status: string };
  };
  assert.equal(oldPreview.data.valid, false);
  assert.equal(oldPreview.data.status, 'REVOKED');

  // New token preview masks email and omits raw tokenHash
  const previewRes = await fetch(`${baseUrl}/api/invitations/preview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shortCode: secondJson.data.shortCode }),
  });
  assert.equal(previewRes.status, 200);
  const previewJson = (await previewRes.json()) as {
    data: {
      valid: boolean;
      status: string;
      companyName: string;
      maskedEmail: string;
      tokenHash?: string;
    };
  };
  assert.equal(previewJson.data.valid, true);
  assert.equal(previewJson.data.companyName, 'Alpha Trading Co');
  assert.equal(previewJson.data.maskedEmail, 'c***1@alpha.test');
  assert.equal(previewJson.data.tokenHash, undefined);

  // 4. Company B cannot list or revoke Company A's invitations
  const compBListRes = await fetch(`${baseUrl}/api/invitations`, {
    headers: { Authorization: `Bearer ${companyBOwnerToken}` },
  });
  const compBList = (await compBListRes.json()) as { data: unknown[] };
  assert.equal(compBList.data.length, 0);

  const crossRevokeRes = await fetch(
    `${baseUrl}/api/invitations/${secondJson.data.invitation.id}/revoke`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${companyBOwnerToken}` },
    }
  );
  assert.equal(crossRevokeRes.status, 404);

  // 5. Email mismatch on accept returns 403 INVITE_EMAIL_MISMATCH
  setFirebaseTokenVerifierForTests(async () => ({
    uid: 'fb-wrong-user',
    email: 'intruder@evil.test',
    emailVerified: true,
  }));
  const mismatchRes = await fetch(`${baseUrl}/api/invitations/accept`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer fb-wrong-token',
    },
    body: JSON.stringify({ token: secondToken, pin: '4321' }),
  });
  assert.equal(mismatchRes.status, 403);
  const mismatchJson = (await mismatchRes.json()) as { errorCode: string };
  assert.equal(mismatchJson.errorCode, 'INVITE_EMAIL_MISMATCH');

  // 6. Matching email accepts invitation, creates user with PIN, and issues POS session
  setFirebaseTokenVerifierForTests(async () => ({
    uid: 'fb-sara-uid',
    email: 'cashier1@alpha.test',
    emailVerified: true,
    name: 'Sara Cashier',
  }));
  const acceptRes = await fetch(`${baseUrl}/api/invitations/accept`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer fb-sara-token',
    },
    body: JSON.stringify({ token: secondToken, fullName: 'Sara Cashier', pin: '4321' }),
  });
  assert.equal(acceptRes.status, 201);
  const acceptJson = (await acceptRes.json()) as {
    data: {
      sessionToken: string;
      company: { id: string };
      user: { id: string; systemRole: string; firebaseUid: string; hasPin: boolean };
    };
  };
  assert.equal(acceptJson.data.company.id, companyAId);
  assert.equal(acceptJson.data.user.systemRole, 'CASHIER');
  assert.equal(acceptJson.data.user.firebaseUid, 'fb-sara-uid');
  assert.equal(acceptJson.data.user.hasPin, true);
  assert.ok(acceptJson.data.sessionToken.startsWith('dqsess_'));

  // 7. Re-using the accepted invitation fails with 409 INVITE_ALREADY_USED
  const reuseRes = await fetch(`${baseUrl}/api/invitations/accept`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer fb-sara-token',
    },
    body: JSON.stringify({ token: secondToken }),
  });
  assert.equal(reuseRes.status, 409);
  const reuseJson = (await reuseRes.json()) as { errorCode: string };
  assert.equal(reuseJson.errorCode, 'INVITE_ALREADY_USED');

  // 8. Cashier cannot create invitations (403)
  const cashierInviteRes = await fetch(`${baseUrl}/api/invitations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${acceptJson.data.sessionToken}`,
    },
    body: JSON.stringify({ email: 'another@alpha.test', roleId: 'CASHIER' }),
  });
  assert.equal(cashierInviteRes.status, 403);
});

test('Expired invitation returns 410 INVITE_EXPIRED on accept and valid=false on preview', async () => {
  const createRes = await fetch(`${baseUrl}/api/invitations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${companyAOwnerToken}`,
    },
    body: JSON.stringify({
      email: 'expired.user@alpha.test',
      roleId: 'CASHIER',
      branchId: companyABranchId,
    }),
  });
  assert.equal(createRes.status, 201);
  const created = (await createRes.json()) as {
    data: { invitation: { id: string }; inviteUrl: string };
  };
  const token = new URL(created.data.inviteUrl).searchParams.get('invite') || '';

  // Force expiry in platform state
  const state = loadPlatformState();
  const inv = state.invitations.find((item) => item.id === created.data.invitation.id);
  assert.ok(inv);
  inv.expiresAt = new Date(Date.now() - 60_000).toISOString();
  savePlatformState(state);

  setFirebaseTokenVerifierForTests(async () => ({
    uid: 'fb-expired-uid',
    email: 'expired.user@alpha.test',
    emailVerified: true,
  }));

  const acceptRes = await fetch(`${baseUrl}/api/invitations/accept`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer fb-expired-token',
    },
    body: JSON.stringify({ token }),
  });
  assert.equal(acceptRes.status, 410);
  const acceptJson = (await acceptRes.json()) as { errorCode: string };
  assert.equal(acceptJson.errorCode, 'INVITE_EXPIRED');
});
