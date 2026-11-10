import test from 'node:test';
import assert from 'node:assert/strict';
import { createRateLimiter } from '../../server/rate-limiter';

function createMockReqRes(ip: string, method = 'POST') {
  const headers = new Map<string, string>();
  let statusCode = 200;
  let jsonBody: unknown = null;

  const req = {
    method,
    ip,
    headers: {},
    socket: { remoteAddress: ip },
  } as any;

  const res = {
    setHeader(name: string, val: string) {
      headers.set(name.toLowerCase(), String(val));
    },
    getHeader(name: string) {
      return headers.get(name.toLowerCase());
    },
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(payload: unknown) {
      jsonBody = payload;
      return this;
    },
  } as any;

  return {
    req,
    res,
    getStatus: () => statusCode,
    getJson: () => jsonBody as Record<string, any> | null,
    getHeader: (name: string) => headers.get(name.toLowerCase()),
  };
}

test('Problem #22 — createRateLimiter enforces request limits, sets rate-limit headers, and resets after windowMs', () => {
  let fakeNow = 1_000_000;
  const limiter = createRateLimiter({
    windowMs: 10_000,
    maxRequests: 3,
    keyPrefix: 'test-auth',
    nowFn: () => fakeNow,
  });

  // Requests 1, 2, 3 from IP 10.0.0.1 succeed
  for (let i = 1; i <= 3; i++) {
    let nextCalled = false;
    const ctx = createMockReqRes('10.0.0.1');
    limiter(ctx.req, ctx.res, () => {
      nextCalled = true;
    });
    assert.equal(nextCalled, true);
    assert.equal(ctx.getStatus(), 200);
    assert.equal(ctx.getHeader('x-ratelimit-limit'), '3');
    assert.equal(ctx.getHeader('x-ratelimit-remaining'), String(3 - i));
  }

  // Request 4 from IP 10.0.0.1 within window is blocked with 429
  {
    let nextCalled = false;
    const ctx = createMockReqRes('10.0.0.1');
    limiter(ctx.req, ctx.res, () => {
      nextCalled = true;
    });
    assert.equal(nextCalled, false);
    assert.equal(ctx.getStatus(), 429);
    assert.equal(ctx.getJson()?.errorCode, 'RATE_LIMIT_EXCEEDED');
    assert.ok(ctx.getJson()?.errorAr?.includes('تم تجاوز الحد'));
    assert.equal(ctx.getHeader('retry-after'), '10');
  }

  // Request from a different IP (10.0.0.2) is unaffected
  {
    let nextCalled = false;
    const ctx = createMockReqRes('10.0.0.2');
    limiter(ctx.req, ctx.res, () => {
      nextCalled = true;
    });
    assert.equal(nextCalled, true);
    assert.equal(ctx.getStatus(), 200);
  }

  // Advance clock past windowMs -> IP 10.0.0.1 is allowed again
  fakeNow += 10_500;
  {
    let nextCalled = false;
    const ctx = createMockReqRes('10.0.0.1');
    limiter(ctx.req, ctx.res, () => {
      nextCalled = true;
    });
    assert.equal(nextCalled, true);
    assert.equal(ctx.getStatus(), 200);
    assert.equal(ctx.getHeader('x-ratelimit-remaining'), '2');
  }
});
