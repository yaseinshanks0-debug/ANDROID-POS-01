/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'node:fs';
import path from 'node:path';
import { getApp, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getRootDir } from './runtime-paths.ts';
import { normalizeEmail } from '../lib/invitation-utils.ts';

export const FIREBASE_AUTH_ERROR_CODES = {
  MISSING_FIREBASE_TOKEN: 'MISSING_FIREBASE_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_REVOKED: 'TOKEN_REVOKED',
  USER_ACCOUNT_DEACTIVATED: 'USER_ACCOUNT_DEACTIVATED',
  FIREBASE_EMAIL_REQUIRED: 'FIREBASE_EMAIL_REQUIRED',
  INVALID_FIREBASE_TOKEN: 'INVALID_FIREBASE_TOKEN',
  FIREBASE_NOT_CONFIGURED: 'FIREBASE_NOT_CONFIGURED',
} as const;

export type FirebaseAuthErrorCode =
  (typeof FIREBASE_AUTH_ERROR_CODES)[keyof typeof FIREBASE_AUTH_ERROR_CODES];

export interface VerifiedFirebaseIdentity {
  uid: string;
  email: string;
  emailVerified: boolean;
  name?: string;
  picture?: string;
}

export class FirebaseAuthVerificationError extends Error {
  readonly statusCode: number;
  readonly errorCode: FirebaseAuthErrorCode;

  constructor(statusCode: number, errorCode: FirebaseAuthErrorCode, message: string) {
    super(message);
    this.name = 'FirebaseAuthVerificationError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

type TestTokenVerifierFn = (
  token: string,
  checkRevoked: boolean
) => Promise<VerifiedFirebaseIdentity>;

let testTokenVerifier: TestTokenVerifierFn | null = null;

export function setFirebaseTokenVerifierForTests(fn: TestTokenVerifierFn | null): void {
  testTokenVerifier = fn;
}

export function extractBearerToken(authHeader?: string | null): string | null {
  if (!authHeader || typeof authHeader !== 'string') return null;
  const trimmed = authHeader.trim();
  if (!trimmed.toLowerCase().startsWith('bearer ')) return null;
  const token = trimmed.slice(7).trim();
  return token.length > 0 ? token : null;
}

function resolveFirebaseProjectId(): string | null {
  const fromEnv = (
    process.env.FIREBASE_PROJECT_ID ||
    process.env.GOOGLE_CLOUD_PROJECT ||
    process.env.GCLOUD_PROJECT ||
    ''
  ).trim();
  if (fromEnv && fromEnv !== 'remixed-project-id') {
    return fromEnv;
  }
  try {
    const configPath = path.resolve(getRootDir(), 'firebase-applet-config.json');
    if (fs.existsSync(configPath)) {
      const parsed = JSON.parse(fs.readFileSync(configPath, 'utf8')) as {
        projectId?: string;
      };
      const projectId = String(parsed.projectId || '').trim();
      if (projectId && projectId !== 'remixed-project-id') {
        return projectId;
      }
    }
  } catch {
    // Fallback handled below
  }
  return null;
}

function getFirebaseAdminApp(): App {
  if (getApps().length > 0) {
    return getApp();
  }
  const projectId = resolveFirebaseProjectId();
  if (!projectId) {
    throw new FirebaseAuthVerificationError(
      503,
      FIREBASE_AUTH_ERROR_CODES.FIREBASE_NOT_CONFIGURED,
      'Firebase project ID is not configured for ID token verification.'
    );
  }
  // Initialize with projectId only — verifyIdToken(token) requires zero IAM credentials
  // and works seamlessly in AI Studio preview, local dev, and Cloud Run.
  return initializeApp({ projectId });
}

function normalizeVerifiedIdentity(raw: {
  uid?: string;
  email?: string;
  emailVerified?: boolean;
  email_verified?: boolean;
  name?: string;
  picture?: string;
}): VerifiedFirebaseIdentity {
  const uid = String(raw.uid || '').trim();
  const email = normalizeEmail(raw.email || '');
  if (!uid) {
    throw new FirebaseAuthVerificationError(
      401,
      FIREBASE_AUTH_ERROR_CODES.INVALID_FIREBASE_TOKEN,
      'Invalid Firebase identity token (missing uid).'
    );
  }
  if (!email) {
    throw new FirebaseAuthVerificationError(
      400,
      FIREBASE_AUTH_ERROR_CODES.FIREBASE_EMAIL_REQUIRED,
      'This Firebase account does not have an email address attached.'
    );
  }
  return {
    uid,
    email,
    emailVerified: Boolean(raw.emailVerified ?? raw.email_verified ?? false),
    name: typeof raw.name === 'string' && raw.name.trim() ? raw.name.trim() : undefined,
    picture:
      typeof raw.picture === 'string' && raw.picture.trim() ? raw.picture.trim() : undefined,
  };
}

function mapFirebaseVerifyError(error: unknown): FirebaseAuthVerificationError {
  if (error instanceof FirebaseAuthVerificationError) {
    return error;
  }
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code?: unknown }).code || '')
      : '';

  if (code === 'auth/id-token-expired') {
    return new FirebaseAuthVerificationError(
      401,
      FIREBASE_AUTH_ERROR_CODES.TOKEN_EXPIRED,
      'Your email session has expired. Please sign in again.'
    );
  }
  if (code === 'auth/id-token-revoked') {
    return new FirebaseAuthVerificationError(
      401,
      FIREBASE_AUTH_ERROR_CODES.TOKEN_REVOKED,
      'Your email session was revoked. Please sign in again.'
    );
  }
  if (code === 'auth/user-disabled') {
    return new FirebaseAuthVerificationError(
      403,
      FIREBASE_AUTH_ERROR_CODES.USER_ACCOUNT_DEACTIVATED,
      'This email account has been disabled.'
    );
  }
  return new FirebaseAuthVerificationError(
    401,
    FIREBASE_AUTH_ERROR_CODES.INVALID_FIREBASE_TOKEN,
    'Could not verify Firebase authentication token.'
  );
}

export async function verifyFirebaseIdToken(
  idToken: string,
  options?: { checkRevoked?: boolean }
): Promise<VerifiedFirebaseIdentity> {
  const cleanToken = String(idToken || '').trim();
  if (!cleanToken) {
    throw new FirebaseAuthVerificationError(
      401,
      FIREBASE_AUTH_ERROR_CODES.MISSING_FIREBASE_TOKEN,
      'Authorization Bearer Firebase ID token is required.'
    );
  }

  const checkRevoked = options?.checkRevoked ?? process.env.FIREBASE_CHECK_REVOKED === 'true';

  if (testTokenVerifier) {
    try {
      const verified = await testTokenVerifier(cleanToken, checkRevoked);
      return normalizeVerifiedIdentity(verified);
    } catch (error) {
      throw mapFirebaseVerifyError(error);
    }
  }

  try {
    const app = getFirebaseAdminApp();
    const decoded = await getAuth(app).verifyIdToken(cleanToken, checkRevoked);
    return normalizeVerifiedIdentity({
      uid: decoded.uid,
      email: decoded.email,
      email_verified: decoded.email_verified,
      name: typeof decoded.name === 'string' ? decoded.name : undefined,
      picture: typeof decoded.picture === 'string' ? decoded.picture : undefined,
    });
  } catch (error) {
    throw mapFirebaseVerifyError(error);
  }
}
