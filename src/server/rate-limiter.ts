/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Request, Response, NextFunction, RequestHandler } from 'express';

export interface RateLimiterOptions {
  windowMs: number;
  maxRequests: number;
  keyPrefix?: string;
  message?: string;
  messageAr?: string;
  nowFn?: () => number;
}

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

export function resolveClientRateLimitKey(req: Pick<Request, 'headers' | 'ip' | 'socket'>): string {
  const forwarded = req.headers?.['x-forwarded-for'];
  const rawForwarded = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  if (typeof rawForwarded === 'string' && rawForwarded.trim().length > 0) {
    return rawForwarded.split(',')[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || 'unknown-client';
}

/**
 * Creates a memory-safe, sliding/fixed-window Express rate limiting middleware
 * with standard `X-RateLimit-*` and `Retry-After` headers and bilingual 429 responses.
 */
export function createRateLimiter(options: RateLimiterOptions): RequestHandler & {
  resetBuckets: () => void;
} {
  const windowMs = Math.max(1000, options.windowMs);
  const maxRequests = Math.max(1, options.maxRequests);
  const keyPrefix = options.keyPrefix || 'api';
  const nowFn = options.nowFn || (() => Date.now());
  const message =
    options.message || 'Too many requests, please try again shortly.';
  const messageAr =
    options.messageAr || 'تم تجاوز الحد المسموح به للطلبات، يرجى المحاولة بعد قليل.';

  const buckets = new Map<string, RateLimitBucket>();
  let lastSweepAt = 0;

  const sweepExpired = (now: number) => {
    if (now - lastSweepAt < windowMs) return;
    lastSweepAt = now;
    for (const [k, bucket] of buckets.entries()) {
      if (now >= bucket.resetAt) {
        buckets.delete(k);
      }
    }
  };

  const middleware = ((req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
      return next();
    }

    const now = nowFn();
    sweepExpired(now);

    const clientIp = resolveClientRateLimitKey(req);
    const bucketKey = `${keyPrefix}:${clientIp}`;
    let bucket = buckets.get(bucketKey);

    if (!bucket || now >= bucket.resetAt) {
      bucket = {
        count: 0,
        resetAt: now + windowMs,
      };
      buckets.set(bucketKey, bucket);
    }

    bucket.count += 1;
    const remaining = Math.max(0, maxRequests - bucket.count);
    const resetSeconds = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));

    res.setHeader('X-RateLimit-Limit', String(maxRequests));
    res.setHeader('X-RateLimit-Remaining', String(remaining));
    res.setHeader('X-RateLimit-Reset', String(resetSeconds));

    if (bucket.count > maxRequests) {
      res.setHeader('Retry-After', String(resetSeconds));
      return res.status(429).json({
        errorCode: 'RATE_LIMIT_EXCEEDED',
        error: message,
        errorAr: messageAr,
        retryAfterSeconds: resetSeconds,
      });
    }

    return next();
  }) as RequestHandler & { resetBuckets: () => void };

  middleware.resetBuckets = () => {
    buckets.clear();
  };

  return middleware;
}

export const authRateLimiter = createRateLimiter({
  windowMs: 60_000,
  maxRequests: 30,
  keyPrefix: 'auth',
  message: 'Too many authentication attempts. Please wait a minute before trying again.',
  messageAr: 'محاولات تسجيل دخول كثيرة جداً. يرجى الانتظار دقيقة قبل المحاولة مرة أخرى.',
});

export const apiRateLimiter = createRateLimiter({
  windowMs: 60_000,
  maxRequests: 300,
  keyPrefix: 'api',
});
