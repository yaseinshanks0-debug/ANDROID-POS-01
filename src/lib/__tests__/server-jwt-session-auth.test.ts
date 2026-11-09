/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import {
  authenticateAccount,
  createCompanyAndInitialOwner,
  createEmployeeAccount,
  requireServerCapability,
  resolveAuthenticatedActorFromRequest,
  signSessionJwt,
  verifySessionJwt,
} from '../../server/release-onboarding.service';

async function invokeProtectedRoute(
  app: express.Express,
  options: {
    method: string;
    path: string;
    headers?: Record<string, string>;
    body?: any;
  }
): Promise<{ status: number; body: any }> {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, '127.0.0.1', async () => {
      try {
        const addr = server.address();
        const port = typeof addr === 'object' && addr ? addr.port : 0;
        const res = await fetch(`http://127.0.0.1:${port}${options.path}`, {
          method: options.method,
          headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
          },
          body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
        });
        const json = await res.json().catch(() => ({}));
        server.close(() => resolve({ status: res.status, body: json }));
      } catch (err) {
        server.close(() => reject(err));
      }
    });
  });
}

describe('Problem #7 — Server-Side JWT & Session Verification vs Header Spoofing', () => {
  it('1. Signs and verifies HMAC-SHA256 session JWTs and rejects tampered or expired tokens', () => {
    const token = signSessionJwt({
      sub: 'usr-owner-test',
      companyId: 'comp-test-1',
      role: 'admin',
      systemRole: 'COMPANY_OWNER',
      workspaceMode: 'PRODUCTION',
      sid: 'sess-test-1',
      expiresInSeconds: 3600,
    });

    const verified = verifySessionJwt(token);
    assert.ok(verified, 'Valid HS256 JWT must verify');
    assert.equal(verified?.sub, 'usr-owner-test');
    assert.equal(verified?.companyId, 'comp-test-1');
    assert.equal(verified?.systemRole, 'COMPANY_OWNER');

    // Prefixed dqsess_ format must also verify
    const verifiedPrefixed = verifySessionJwt(`dqsess_${token}`);
    assert.ok(verifiedPrefixed, 'dqsess_ prefixed JWT must verify');
    assert.equal(verifiedPrefixed?.sid, 'sess-test-1');

    // Tampered payload must fail signature verification
    const parts = token.split('.');
    const tamperedToken = `${parts[0]}.${Buffer.from(
      JSON.stringify({ sub: 'usr-hacker', companyId: 'comp-test-1', exp: 9999999999 })
    ).toString('base64url')}.${parts[2]}`;
    assert.equal(verifySessionJwt(tamperedToken), null, 'Tampered JWT payload must be rejected');

    // Expired token must be rejected
    const expiredToken = signSessionJwt({
      sub: 'usr-owner-test',
      companyId: 'comp-test-1',
      role: 'admin',
      systemRole: 'COMPANY_OWNER',
      workspaceMode: 'PRODUCTION',
      sid: 'sess-expired',
      expiresInSeconds: -10,
    });
    assert.equal(verifySessionJwt(expiredToken), null, 'Expired JWT must be rejected');
  });

  it('2. Blocks unauthenticated x-user-role spoofing (e.g., x-user-role: admin / manager / cashier)', async () => {
    const app = express();
    app.use(express.json());
    const requireAdminOrManager = requireServerCapability('company.currency.manage', {
      allowInternalDefaultIfNoHeader: true,
    });
    app.post('/api/exchange-rates', requireAdminOrManager, (_req, res) => {
      res.status(201).json({ ok: true });
    });

    // Spoofing x-user-role: admin without a valid session token must be blocked with 403
    const spoofedAdminRes = await invokeProtectedRoute(app, {
      method: 'POST',
      path: '/api/exchange-rates',
      headers: {
        'x-user-role': 'admin',
      },
      body: { sourceCurrency: 'USD', targetCurrency: 'SDG', rate: 3000 },
    });
    assert.equal(
      spoofedAdminRes.status,
      403,
      'Unauthenticated x-user-role: admin header spoofing must be blocked with 403'
    );
    assert.ok(spoofedAdminRes.body.error?.includes('Insufficient permissions'));

    // Spoofing x-user-role: manager without a valid session token must be blocked with 403
    const spoofedManagerRes = await invokeProtectedRoute(app, {
      method: 'POST',
      path: '/api/exchange-rates',
      headers: {
        'x-user-role': 'manager',
      },
      body: { sourceCurrency: 'USD', targetCurrency: 'SDG', rate: 3000 },
    });
    assert.equal(spoofedManagerRes.status, 403);

    // Unauthenticated x-user-role: cashier must also be blocked with 403
    const cashierHeaderRes = await invokeProtectedRoute(app, {
      method: 'POST',
      path: '/api/exchange-rates',
      headers: {
        'x-user-role': 'cashier',
      },
      body: { sourceCurrency: 'USD', targetCurrency: 'SDG', rate: 3000 },
    });
    assert.equal(cashierHeaderRes.status, 403);
    assert.ok(cashierHeaderRes.body.error?.includes('Insufficient permissions'));
  });

  it('3. Enforces server-verified JWT session & RBAC capabilities and blocks cashier escalation and cross-company x-company-id spoofing', async () => {
    const suffix = Date.now().toString(36);

    const companyA = await createCompanyAndInitialOwner({
      idempotencyKey: `jwt-comp-a-${suffix}`,
      legalName: `JWT Security Co A ${suffix}`,
      ownerName: 'Owner A',
      ownerUsername: `jwt.owner.a.${suffix}`,
      ownerPassword: 'OwnerAPassword123',
      ownerConfirmPassword: 'OwnerAPassword123',
    });

    const companyB = await createCompanyAndInitialOwner({
      idempotencyKey: `jwt-comp-b-${suffix}`,
      legalName: `JWT Security Co B ${suffix}`,
      ownerName: 'Owner B',
      ownerUsername: `jwt.owner.b.${suffix}`,
      ownerPassword: 'OwnerBPassword123',
      ownerConfirmPassword: 'OwnerBPassword123',
    });

    // Create a Cashier in Company A
    const ownerActorA = resolveAuthenticatedActorFromRequest({
      headers: { authorization: `Bearer ${companyA.sessionToken}` },
      query: {},
      body: {},
    } as any);

    const cashierA = createEmployeeAccount(ownerActorA, {
      name: 'Cashier A',
      username: `jwt.cashier.a.${suffix}`,
      password: 'CashierAPassword123',
      pin: '4321',
      systemRole: 'CASHIER',
    });

    const cashierLogin = authenticateAccount({
      companyId: companyA.company.id,
      identifier: cashierA.username,
      passwordOrPin: 'CashierAPassword123',
    });
    assert.equal(cashierLogin.ok, true);
    assert.ok(cashierLogin.sessionToken);

    const app = express();
    app.use(express.json());
    const requireAdminOrManager = requireServerCapability('company.currency.manage', {
      allowInternalDefaultIfNoHeader: true,
    });
    app.post('/api/exchange-rates', requireAdminOrManager, (req, res) => {
      res.status(201).json({
        ok: true,
        actorId: (req as any).authenticatedActor?.user?.id,
        companyId: (req as any).authenticatedActor?.company?.id,
      });
    });

    // 1) Cashier with valid session token attempting to spoof x-user-role: admin -> 403 Forbidden
    const cashierSpoofRes = await invokeProtectedRoute(app, {
      method: 'POST',
      path: '/api/exchange-rates',
      headers: {
        Authorization: `Bearer ${cashierLogin.sessionToken}`,
        'x-user-role': 'admin',
      },
      body: { sourceCurrency: 'USD', targetCurrency: 'SDG', rate: 3100 },
    });
    assert.equal(
      cashierSpoofRes.status,
      403,
      'Cashier attempting to escalate via x-user-role: admin must be rejected with 403'
    );
    assert.equal(cashierSpoofRes.body.errorCode, 'FORBIDDEN_MISSING_CAPABILITY');

    // 2) Owner A attempting to target Company B via x-company-id -> 403 Cross-Company Access
    const crossTenantRes = await invokeProtectedRoute(app, {
      method: 'POST',
      path: '/api/exchange-rates',
      headers: {
        Authorization: `Bearer ${companyA.sessionToken}`,
        'x-company-id': companyB.company.id,
      },
      body: { sourceCurrency: 'USD', targetCurrency: 'SDG', rate: 3100 },
    });
    assert.equal(
      crossTenantRes.status,
      403,
      'Cross-company x-company-id spoofing must be blocked with 403'
    );
    assert.equal(crossTenantRes.body.errorCode, 'FORBIDDEN_CROSS_COMPANY_ACCESS');

    // 3) Owner A with valid signed session token and matching company -> 201 Created
    const ownerValidRes = await invokeProtectedRoute(app, {
      method: 'POST',
      path: '/api/exchange-rates',
      headers: {
        Authorization: `Bearer ${companyA.sessionToken}`,
        'x-company-id': companyA.company.id,
      },
      body: { sourceCurrency: 'USD', targetCurrency: 'SDG', rate: 3100 },
    });
    assert.equal(ownerValidRes.status, 201);
    assert.equal(ownerValidRes.body.actorId, companyA.owner.id);
    assert.equal(ownerValidRes.body.companyId, companyA.company.id);
  });
});
