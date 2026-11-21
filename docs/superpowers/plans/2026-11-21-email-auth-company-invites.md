# Email Authentication, Password Recovery & Company Invitations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (Native) or superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver email-based owner onboarding, self-service Firebase password recovery, and server-authoritative company staff invitations (shareable link + short code `DQ-XXXX-XX` + local QR + WhatsApp/Mail/Copy) for Web and Capacitor Android while preserving offline PIN checkout and LAN Wi-Fi sync.

**Architecture:** Firebase Auth (`Email/Password` + `sendPasswordResetEmail`) handles user identity and free, high-deliverability password recovery emails without browser popups on Android. The Express + PostgreSQL (with local JSON store parity) backend verifies Firebase ID tokens via `firebase-admin`, binds `firebaseUid` to internal `users.id` (never assuming equality), and authoritatively manages single-use 48-hour `company_invitations` and tenant-scoped POS session JWTs.

**Tech Stack:** TypeScript, React 19, Tailwind CSS, Express, Drizzle ORM (PostgreSQL 16), `firebase` v13 client SDK, `firebase-admin` (ID token verification), `qrcode` (local client SVG/DataURL generation), `node:test` + `tsx`.

**Spec:** `docs/superpowers/specs/2026-11-21-email-auth-company-invites-design.md`

## Global Constraints

- One-time Firebase Console prerequisite: **Email/Password** provider must be enabled in project `artful-port-r71nt` (`Authentication -> Sign-in method -> Email/Password`).
- `firebase-admin` token verification MUST use `verifyIdToken(token)` (no IAM required by default) and only pass `checkRevoked = true` when `process.env.FIREBASE_CHECK_REVOKED === 'true'`. Never store or commit service account JSON keys.
- Never assume `firebaseUid === users.id`; store `firebaseUid` as a nullable unique linked column.
- All PostgreSQL schema changes MUST be strictly additive and backward-compatible; zero destructive migrations and zero mutations to financial/inventory formulas.
- Invitations expire after **48 hours**, store only `SHA-256` `tokenHash` (never raw token), enforce strict case-insensitive email match on acceptance, and use single-use atomic status transitions (`PENDING -> ACCEPTED`).
- Short code format: `DQ-XXXX-XX` using unambiguous Crockford-style charset `23456789ABCDEFGHJKMNPQRSTUVWXYZ`.
- QR codes MUST render locally on the client (zero external third-party QR image URLs).
- All UI copy, errors, and WhatsApp/Mail share templates MUST be bilingual Arabic (RTL) + English (LTR).
- Follow workspace TypeScript rules: `as const` objects for status/code unions, flat interfaces, never use `any`, use `import type` for type-only imports.

## Review Focus

1. **Email whitespace & casing mismatch** (`"  Cashier@Shop.COM "` invited vs `"cashier@shop.com"` signed in): normalize every email via `normalizeEmail()` on creation, lookup, and acceptance so valid users are never rejected and duplicate invites for differently cased emails are revoked cleanly.
2. **Concurrent / repeated invite acceptance** (two taps or replayed link on the same invite): atomic `PENDING` guard rejects the second call with `409 INVITE_ALREADY_USED` and never creates duplicate `users` rows.
3. **Forwarded WhatsApp link / code hijacking** (Employee B opens Employee A's invite while signed into B's Firebase account): `POST /api/invitations/accept` MUST return `403 INVITE_EMAIL_MISMATCH` without consuming or leaking Employee A's full email.
4. **Deactivated user attempting Firebase sign-in or password reset return**: `POST /api/auth/firebase-exchange` MUST check `user.isActive === true` and return `403 USER_ACCOUNT_DEACTIVATED`, revoking any stale POS sessions.
5. **Offline Android terminal continuity**: when `navigator.onLine === false`, `LoginScreen` MUST remain unlockable via locally cached salted PIN for enrolled users and MUST never clear pending offline sales/outbox during email sign-in or password recovery.

---

## File Structure

- **Create:** `src/lib/invitation-utils.ts` — Pure helpers: `normalizeEmail`, `maskEmail`, `generateInviteToken`, `hashInviteToken`, `generateShortCode`, `normalizeShortCode`, `buildInviteShareText`, `INVITATION_STATUSES`.
- **Create:** `src/lib/__tests__/invitation-utils.test.ts` — Unit tests for pure invitation crypto, formatting, and masking rules.
- **Modify:** `src/db/schema.ts` — Add `firebaseUid`, `emailVerified` to `users` and additive `companyInvitations` table.
- **Create:** `src/server/firebase-admin.ts` — Singleton `firebase-admin` initializer and `verifyFirebaseIdToken()` with injectable verifier hook for deterministic tests.
- **Create:** `src/server/__tests__/firebase-admin.test.ts` — Unit tests for token verification error mapping (`TOKEN_EXPIRED`, `TOKEN_REVOKED`, `USER_ACCOUNT_DEACTIVATED`, `INVALID_FIREBASE_TOKEN`).
- **Modify:** `src/server/release-onboarding.service.ts` — Extend `StoredUserRecord` (`firebaseUid`, `emailVerified`), support Firebase-backed `createCompanyAndInitialOwner`, add `POST /api/auth/firebase-exchange` and `POST /api/auth/link-firebase-email`.
- **Create:** `src/server/invitations.service.ts` — Authoritative company invitations domain service + Express router (`POST /api/invitations`, `GET /api/invitations`, `POST /api/invitations/:id/revoke`, `POST /api/invitations/preview`, `POST /api/invitations/accept`).
- **Modify:** `server.ts` — Mount `invitationsRouter` under `/api/invitations` with `authRateLimiter` on public endpoints.
- **Create:** `src/server/__tests__/email-auth-invitations.test.ts` — End-to-end API/service tests covering Firebase exchange, email linking, invite lifecycle, email mismatch, replay race, role escalation, and deactivated user blocking.
- **Modify:** `src/lib/firebase.ts` — Export `registerWithFirebaseEmail`, `signInWithFirebaseEmail`, `sendFirebasePasswordReset`, `getCurrentFirebaseIdToken`, and bilingual Firebase Auth error translator.
- **Modify:** `src/context/domains/useUserAccountsDomain.ts` & `src/context/POSContext.tsx` — Add `signInWithEmailAccount`, `sendPasswordResetForEmail`, `linkCurrentUserFirebaseEmail`, `previewCompanyInvite`, `acceptCompanyInvite`, `createCompanyInvite`, `listCompanyInvites`, `revokeCompanyInvite`.
- **Create:** `src/components/auth/AcceptInviteModal.tsx` — Join-by-link / short-code / QR scanner modal with masked email confirmation, Firebase sign-in/signup, and optional offline PIN setup.
- **Modify:** `src/components/auth/LoginScreen.tsx` — Add Email/Password Firebase sign-in integration, **"Forgot Password?"** flow, **"Join with Invite Code"** button, and auto-open on `?invite=` URL parameter.
- **Modify:** `src/components/onboarding/FirstRunOnboardingModal.tsx` — Add Email + Password (Firebase) owner creation with explicit *"Continue Offline (Link Email Later)"* escape hatch.
- **Create:** `src/components/settings/CompanyInviteShareModal.tsx` — Local QR code rendering (`qrcode`), large `DQ-XXXX-XX` short code card, WhatsApp / Mail / Web Share / Copy buttons.
- **Modify:** `src/components/settings/UsersPermissionsSection.tsx` — Add **"Invite Member"** flow, Pending/History invitations table with Revoke & Re-copy actions, and **"Link Email for Password Recovery"** card for unlinked local owners.

---

### Task 1: Additive Schema & Pure Invitation Utilities

**Files:**
- Create: `src/lib/invitation-utils.ts`
- Create: `src/lib/__tests__/invitation-utils.test.ts`
- Modify: `src/db/schema.ts:122-155` (add `firebaseUid`, `emailVerified`, `users_email_idx`) and append `companyInvitations` table

**Interfaces:**
- Produces (`src/lib/invitation-utils.ts`):
  - `INVITATION_STATUSES = { PENDING: 'PENDING', ACCEPTED: 'ACCEPTED', REVOKED: 'REVOKED', EXPIRED: 'EXPIRED' } as const`
  - `export type InvitationStatus = (typeof INVITATION_STATUSES)[keyof typeof INVITATION_STATUSES]`
  - `export const INVITE_TTL_MS = 48 * 60 * 60 * 1000`
  - `export function normalizeEmail(raw: string): string`
  - `export function isValidEmailFormat(email: string): boolean`
  - `export function maskEmail(email: string): string`
  - `export function normalizeShortCode(raw: string): string`
  - `export function isValidShortCode(code: string): boolean`
  - `export function generateInviteShortCode(randomBytesFn?: (n: number) => Uint8Array): string`
  - `export function buildInviteSharePayload(params: { companyName: string; roleLabel: string; inviteUrl: string; shortCode: string; language: 'ar' | 'en' }): { message: string; whatsappUrl: string; mailtoUrl: string }`
- Produces (`src/db/schema.ts`):
  - `users.firebaseUid`, `users.emailVerified`
  - `export const companyInvitations = pgTable('company_invitations', ...)`

- [ ] **Step 1: Write failing unit tests in `src/lib/__tests__/invitation-utils.test.ts`**
  Assert:
  - `normalizeEmail('  Cashier@Shop.COM  ') === 'cashier@shop.com'`
  - `maskEmail('ahmed.ali@shop.com') === 'a***i@shop.com'` and short local part `maskEmail('ab@x.co') === 'a***@x.co'`
  - `generateInviteShortCode()` matches `/^DQ-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{4}-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{2}$/` and never contains `0`, `O`, `1`, `I`, `L`
  - `normalizeShortCode(' dq-7k4m-9p ') === 'DQ-7K4M-9P'` and `normalizeShortCode('dq7k4m9p') === 'DQ-7K4M-9P'`
  - `buildInviteSharePayload` outputs Arabic/English message containing `companyName`, `shortCode`, `inviteUrl`, valid `https://wa.me/?text=...`, and valid `mailto:?subject=...`

- [ ] **Step 2: Run test to verify it fails**
  Run: `npx tsx --test src/lib/__tests__/invitation-utils.test.ts`
  Expected: FAIL (`Cannot find module '../invitation-utils'`)

- [ ] **Step 3: Implement `src/lib/invitation-utils.ts`**
  Keep module isomorphic (browser + Node safe — use `globalThis.crypto.getRandomValues` for short-code generation; SHA-256 token hashing lives in server service using Node `crypto`).

- [ ] **Step 4: Add additive columns and `companyInvitations` table to `src/db/schema.ts`**
  Add `firebaseUid: text('firebase_uid').unique()`, `emailVerified: boolean('email_verified').default(false).notNull()`, `index('users_email_idx').on(table.email)` to `users`, and define `companyInvitations` with `status` check constraint `IN ('PENDING', 'ACCEPTED', 'REVOKED', 'EXPIRED')` and indexes `(companyId, status)`, `(invitedEmail, status)`, unique `tokenHash`, unique `shortCode`.

- [ ] **Step 5: Verify tests and typecheck**
  Run: `npx tsx --test src/lib/__tests__/invitation-utils.test.ts && npm run lint`
  Expected: PASS (all unit tests pass, `tsc --noEmit` exits 0).

---

### Task 2: Server-Side Firebase ID Token Verification (`firebase-admin`)

**Files:**
- Modify: `package.json` (install `firebase-admin`, `qrcode`, `@types/qrcode` in one batched `install_applet_package` call)
- Create: `src/server/firebase-admin.ts`
- Create: `src/server/__tests__/firebase-admin.test.ts`

**Interfaces:**
- Produces (`src/server/firebase-admin.ts`):
  - `export interface VerifiedFirebaseIdentity { uid: string; email: string; emailVerified: boolean; name?: string; picture?: string; }`
  - `export class FirebaseAuthVerificationError extends Error { statusCode: number; errorCode: string; }`
  - `export async function verifyFirebaseIdToken(idToken: string, options?: { checkRevoked?: boolean }): Promise<VerifiedFirebaseIdentity>`
  - `export function extractBearerToken(authHeader?: string | null): string | null`
  - `export function setFirebaseTokenVerifierForTests(fn: ((token: string, checkRevoked: boolean) => Promise<VerifiedFirebaseIdentity>) | null): void`

- [ ] **Step 1: Install required packages in a single call**
  Install `["firebase-admin", "qrcode", "@types/qrcode"]` via `install_applet_package`.

- [ ] **Step 2: Write failing unit tests in `src/server/__tests__/firebase-admin.test.ts`**
  Assert:
  - Missing/empty token throws `FirebaseAuthVerificationError(401, 'MISSING_FIREBASE_TOKEN')`.
  - `auth/id-token-expired` maps to `401 TOKEN_EXPIRED`.
  - `auth/id-token-revoked` maps to `401 TOKEN_REVOKED`.
  - `auth/user-disabled` maps to `403 USER_ACCOUNT_DEACTIVATED`.
  - Decoded token missing `email` throws `400 FIREBASE_EMAIL_REQUIRED`.
  - Valid token returns lowercased trimmed `email`, `uid`, `emailVerified`.

- [ ] **Step 3: Implement `src/server/firebase-admin.ts`**
  Guard singleton initialization with `getApps().length ? getApp() : initializeApp({ projectId })` reading `process.env.FIREBASE_PROJECT_ID || firebaseConfig.projectId`. Default `checkRevoked` to `process.env.FIREBASE_CHECK_REVOKED === 'true'` so `verifyIdToken(token)` works without IAM in preview/dev and supports revocation checks on Cloud Run.

- [ ] **Step 4: Run tests**
  Run: `npx tsx --test src/server/__tests__/firebase-admin.test.ts`
  Expected: PASS.

---

### Task 3: Firebase Auth Exchange, Email Linking & Email-Backed Company Onboarding

**Files:**
- Modify: `src/server/release-onboarding.service.ts`
- Create: `src/server/__tests__/email-auth-onboarding.test.ts`

**Interfaces:**
- Consumes: `verifyFirebaseIdToken`, `extractBearerToken` from `./firebase-admin.ts`; `normalizeEmail` from `../lib/invitation-utils.ts`.
- Produces (exported from `src/server/release-onboarding.service.ts`):
  - Extended `StoredUserRecord` with `firebaseUid?: string | null` and `emailVerified?: boolean` (exposed in `sanitizeStoredUser`!).
  - Extended `CreateCompanyOnboardingInput` accepting `firebaseIdentity?: VerifiedFirebaseIdentity`.
  - `export function loadPlatformState(): PlatformOnboardingState` & `export function savePlatformState(state: PlatformOnboardingState): void` (exported for `invitations.service.ts` to share the same atomic store!).
  - `export function appendPlatformAuditLog(...)` & `export function sanitizeStoredUser(...)` (exported for `invitations.service.ts`).
  - Route `POST /api/auth/firebase-exchange`: verifies Bearer Firebase ID token; looks up user by `firebaseUid`; if deactivated returns `403 USER_ACCOUNT_DEACTIVATED` and revokes sessions; if unbound returns `200 { ok: true, status: 'UNBOUND', email, emailVerified }` (never auto-links unverified email); if matched returns `200 { ok: true, status: 'AUTHENTICATED', sessionToken, user, company, branches, capabilities }`.
  - Route `POST /api/auth/link-firebase-email`: requires authenticated POS session + `body.firebaseIdToken`; rejects with `409 FIREBASE_UID_ALREADY_LINKED` if bound to another user; binds `firebaseUid`, normalized `email`, and `emailVerified` to `actor.user` and persists to both platform state and PostgreSQL (when configured).
  - Route `POST /api/onboarding/companies`: if `Authorization: Bearer <token>` is present and does not start with `dqsess_`, verifies as Firebase ID token and binds the newly created `COMPANY_OWNER` to `firebaseUid` + `email` + `emailVerified` + optional `pinHash` (allowing passwordless-local owner creation when Firebase Auth owns the password!).

- [ ] **Step 1: Write failing tests in `src/server/__tests__/email-auth-onboarding.test.ts`**
  Assert:
  - Creating a company with a valid mocked Firebase identity sets `owner.firebaseUid`, `owner.email` (lowercased), `owner.emailVerified`, and returns a valid `sessionToken`.
  - `POST /api/auth/firebase-exchange` returns `status: 'AUTHENTICATED'` + `company` + `sessionToken` for the linked owner.
  - `POST /api/auth/firebase-exchange` returns `status: 'UNBOUND'` for a Firebase user who has not created or joined a company (does NOT auto-link to an existing user with an unverified matching email).
  - `POST /api/auth/firebase-exchange` returns `403 USER_ACCOUNT_DEACTIVATED` when `user.isActive === false`.
  - `POST /api/auth/link-firebase-email` links a legacy local owner to a Firebase identity and blocks binding the same `firebaseUid` to a second user (`409`).

- [ ] **Step 2: Run test to verify it fails**
  Run: `npx tsx --test src/server/__tests__/email-auth-onboarding.test.ts`
  Expected: FAIL.

- [ ] **Step 3: Implement Firebase identity support in `src/server/release-onboarding.service.ts`**
  Export state/audit/sanitize helpers needed by `invitations.service.ts`; implement `POST /api/auth/firebase-exchange`, `POST /api/auth/link-firebase-email`, and Firebase-backed branch inside `createCompanyAndInitialOwner` + `POST /api/onboarding/companies`. Preserve 100% backward compatibility with existing local password/PIN onboarding & login.

- [ ] **Step 4: Run new + existing onboarding tests**
  Run: `npx tsx --test src/server/__tests__/email-auth-onboarding.test.ts src/server/fresh-installation-acceptance.test.ts`
  Expected: PASS (zero regressions in fresh-installation acceptance tests).

---

### Task 4: Company Invitations Backend Service & Express Routes

**Files:**
- Create: `src/server/invitations.service.ts`
- Modify: `server.ts` (mount `invitationsRouter` at `/api/invitations` with `authRateLimiter` on `/preview` and `/accept`)
- Create: `src/server/__tests__/company-invitations.test.ts`

**Interfaces:**
- Consumes: `resolveAuthenticatedActorFromRequest`, `issueSessionForUser`, `loadPlatformState`, `savePlatformState`, `sanitizeStoredUser`, `hashPinScrypt`, `appendPlatformAuditLog` from `./release-onboarding.service.ts`; `verifyFirebaseIdToken`, `extractBearerToken` from `./firebase-admin.ts`; helpers from `../lib/invitation-utils.ts`.
- Produces (`src/server/invitations.service.ts`):
  - `export interface CompanyInvitationRecord` (flat interface matching `company_invitations` schema)
  - `export function createCompanyInvitation(params)`
  - `export function listCompanyInvitations(companyId: string)`
  - `export function revokeCompanyInvitation(params: { companyId: string; invitationId: string; actorUserId: string })`
  - `export function previewCompanyInvitation(params: { token?: string; shortCode?: string })`
  - `export async function acceptCompanyInvitation(params: { firebaseIdentity: VerifiedFirebaseIdentity; token?: string; shortCode?: string; displayName?: string; pin?: string })`
  - `export const invitationsRouter: Router`
    - `POST /api/invitations` (`users.manage` required; derives `companyId` strictly from `actor.company.id`; prevents role escalation above caller; revokes older pending invite for same `(companyId, email)`; stores only `SHA-256(rawToken)`)
    - `GET /api/invitations` (`users.manage` required; company-scoped; strips `tokenHash`)
    - `POST /api/invitations/:id/revoke` (`users.manage` required; company-scoped)
    - `POST /api/invitations/preview` (public, rate-limited; returns `{ valid, status, companyName, branchName, roleName, roleId, maskedEmail, expiresAt }`)
    - `POST /api/invitations/accept` (rate-limited; requires `Authorization: Bearer <Firebase ID Token>`; enforces `normalizeEmail(firebaseIdentity.email) === invitation.invitedEmail`; atomically transitions `PENDING -> ACCEPTED`, creates user in `invitation.companyId` with `firebaseUid`, `roleId`, `branchId`, optional `pinHash`, and returns `{ ok: true, sessionToken, user, company, branches, capabilities }`)

- [ ] **Step 1: Write failing tests in `src/server/__tests__/company-invitations.test.ts`**
  Assert every critical security and functional invariant from Review Focus:
  - Creating an invite returns raw `inviteUrl`, `shortCode`, `expiresAt`, and stores ONLY `tokenHash` (never raw token).
  - Creating a second invite for `"  Cashier@Shop.COM "` revokes the earlier pending invite for `"cashier@shop.com"`.
  - Non-owner (`BRANCH_MANAGER`) attempting to invite `COMPANY_OWNER` or `ADMIN` is rejected with `403 ROLE_ESCALATION_DENIED`.
  - Preview by `token` OR case-insensitive `shortCode` returns `maskedEmail` and `companyName` without leaking full email or `tokenHash`.
  - Accepting with a different Firebase email returns `403 INVITE_EMAIL_MISMATCH` and keeps invite `PENDING`.
  - Accepting an expired or revoked invite returns `410 INVITE_EXPIRED` / `410 INVITE_REVOKED`.
  - Accepting with the matching email creates the new user under the inviter's exact `companyId`, `branchId`, and `roleId`, stores hashed optional PIN, and returns a working POS `sessionToken`.
  - Replaying `accept` a second time returns `409 INVITE_ALREADY_USED` and does not create a duplicate user.
  - Cross-company revoke attempt returns `404 INVITATION_NOT_FOUND`.

- [ ] **Step 2: Run test to verify it fails**
  Run: `npx tsx --test src/server/__tests__/company-invitations.test.ts`
  Expected: FAIL.

- [ ] **Step 3: Implement `src/server/invitations.service.ts` and mount in `server.ts`**
  Persist invitations to both `platform-onboarding-state.json` (for local/preview parity) and PostgreSQL `companyInvitations` table when `hasDatabaseCredentials` is true (using Drizzle transactions). Mount in `server.ts` with `authRateLimiter` on `/api/invitations/preview` and `/api/invitations/accept`.

- [ ] **Step 4: Run tests**
  Run: `npx tsx --test src/server/__tests__/company-invitations.test.ts`
  Expected: PASS.

---

### Task 5: Client Firebase Email/Password SDK Layer & POSContext Auth/Invite Actions

**Files:**
- Modify: `src/lib/firebase.ts`
- Modify: `src/context/domains/useUserAccountsDomain.ts`
- Modify: `src/context/POSContext.tsx`

**Interfaces:**
- Produces (`src/lib/firebase.ts`):
  - `export async function registerWithFirebaseEmail(email: string, password: string, displayName?: string): Promise<{ user: FirebaseUser; idToken: string }>`
  - `export async function signInWithFirebaseEmail(email: string, password: string): Promise<{ user: FirebaseUser; idToken: string }>`
  - `export async function sendFirebasePasswordReset(email: string): Promise<void>`
  - `export async function getCurrentFirebaseIdToken(forceRefresh?: boolean): Promise<string | null>`
  - `export function mapFirebaseAuthError(error: unknown, language: 'ar' | 'en'): string`
- Produces (`useUserAccountsDomain` & `POSContext`):
  - `signInWithEmailAccount(params: { email: string; password: string }): Promise<EmailSignInResult>`
  - `sendPasswordResetForEmail(email: string): Promise<{ ok: boolean; error?: string }>`
  - `linkCurrentUserFirebaseEmail(params: { email: string; password: string; mode: 'create' | 'signin' }): Promise<{ ok: boolean; error?: string }>`
  - `previewCompanyInvite(params: { token?: string; shortCode?: string }): Promise<InvitePreviewResult>`
  - `acceptCompanyInvite(params: { token?: string; shortCode?: string; email: string; password: string; accountMode: 'create' | 'signin'; displayName?: string; pin?: string }): Promise<AcceptInviteResult>`
  - `createCompanyInvite(params: { email: string; roleId: string; branchId?: string; invitedName?: string }): Promise<CreateInviteResult>`
  - `listCompanyInvites(): Promise<CompanyInvitationSummary[]>`
  - `revokeCompanyInvite(invitationId: string): Promise<{ ok: boolean; error?: string }>`

- [ ] **Step 1: Extend `src/lib/firebase.ts`**
  Import `createUserWithEmailAndPassword`, `signInWithEmailAndPassword`, `sendPasswordResetEmail`, `sendEmailVerification`, `updateProfile` from `firebase/auth`. Add bilingual error mapping covering `auth/operation-not-allowed` (clear hint to enable Email/Password in Firebase Console), `auth/invalid-credential`, `auth/email-already-in-use`, `auth/weak-password`, `auth/too-many-requests`, and `auth/network-request-failed`.

- [ ] **Step 2: Wire domain actions in `src/context/domains/useUserAccountsDomain.ts` and expose via `src/context/POSContext.tsx`**
  Ensure:
  - When `signInWithEmailAccount` or `acceptCompanyInvite` succeeds, save the server `sessionToken` (`dqnamo_pos_session_token_v1`), hydrate `currentCompany`, `branches`, `users`, and save the local salted PIN hash (`saveLocalUserCredentials`) if a PIN was provided so the device immediately supports offline PIN unlock without touching pending offline transactions.
  - Attach `Authorization: Bearer <sessionToken>` cleanly on authenticated invite endpoints.

- [ ] **Step 3: Verify TypeScript compilation**
  Run: `npm run lint`
  Expected: PASS (`tsc --noEmit` exits 0).

---

### Task 6: Login Screen Password Recovery, Email Sign-In, Accept-Invite Flow & Email-Backed Onboarding

**Files:**
- Create: `src/components/auth/AcceptInviteModal.tsx`
- Modify: `src/components/auth/LoginScreen.tsx`
- Modify: `src/components/onboarding/FirstRunOnboardingModal.tsx`

**Interfaces:**
- Consumes: `usePOS()` actions from Task 5; `normalizeShortCode` from `../../lib/invitation-utils`.
- Produces:
  - `AcceptInviteModal`: accepts initial `inviteToken` (auto-read from `?invite=` URL query param) or manual `shortCode` input, previews company/role/masked email, lets invitee sign in or create Firebase email account + optional 4–6 digit offline PIN, calls `acceptCompanyInvite`, and drops user directly into the company POS workspace.
  - `LoginScreen`:
    - Supports Email + Password (Firebase online with automatic fallback to local offline credentials when offline or local-only account) AND Quick Offline PIN.
    - Adds **"نسيت كلمة المرور؟" / "Forgot Password?"** panel calling `sendPasswordResetForEmail` with bilingual anti-enumeration confirmation.
    - Adds **"الانضمام بكود دعوة" / "Join with Invite Code"** button opening `AcceptInviteModal`.
    - Auto-opens `AcceptInviteModal` when `?invite=<token>` is present in `window.location.search` and clears the query parameter cleanly after handling.
  - `FirstRunOnboardingModal`:
    - Adds Email + Password fields (Firebase Auth) + optional Offline Quick PIN for new company owner creation, sending Firebase ID token to `POST /api/onboarding/companies`.
    - Preserves explicit **"Continue Offline (Link Email Later)"** mode if device has no internet during initial install.

- [ ] **Step 1: Create `src/components/auth/AcceptInviteModal.tsx`**
  Include clean 2-step flow: (1) Enter/Verify Invite Code (`DQ-XXXX-XX`) or auto-loaded link token → show Company Name, Branch, Role, and Masked Email; (2) Create Password / Sign In with matching Email + optional Offline PIN → Join Company.

- [ ] **Step 2: Update `src/components/auth/LoginScreen.tsx`**
  Integrate email sign-in, Forgot Password inline drawer/modal, Join with Invite Code CTA, and `?invite=` URL detection while keeping existing `data-testid` attributes and Quick PIN pad untouched.

- [ ] **Step 3: Update `src/components/onboarding/FirstRunOnboardingModal.tsx`**
  Wire Firebase Email/Password registration + ID token submission on company creation with graceful offline fallback toggle.

- [ ] **Step 4: Run lint check**
  Run: `npm run lint`
  Expected: PASS.

---

### Task 7: Admin Staff Invite UI (Link + Short Code + Local QR + Share) & Link-Email Recovery Card

**Files:**
- Create: `src/components/settings/CompanyInviteShareModal.tsx`
- Modify: `src/components/settings/UsersPermissionsSection.tsx`

**Interfaces:**
- Consumes: `qrcode` (`QRCode.toDataURL`), `buildInviteSharePayload` from `../../lib/invitation-utils`, and `createCompanyInvite`, `listCompanyInvites`, `revokeCompanyInvite`, `linkCurrentUserFirebaseEmail` from `usePOS()`.
- Produces:
  - `CompanyInviteShareModal`: renders locally generated QR code (`QRCode.toDataURL(inviteUrl)`), monospace `DQ-XXXX-XX` short code, 48h expiration badge, and one-tap **WhatsApp**, **Mail App**, **System Share (`navigator.share`)**, and **Copy** buttons.
  - `UsersPermissionsSection`:
    - Adds **"دعوة موظف بالإيميل والرابط" / "Invite Member"** form (Email, Display Name, Role, Branch) opening `CompanyInviteShareModal` on success.
    - Adds **Active & Recent Invitations** list with status badges (`PENDING` / `ACCEPTED` / `REVOKED` / `EXPIRED`), short code display, and **Revoke** button.
    - Adds a compact **"ربط البريد الإلكتروني لاستعادة كلمة المرور" / "Link Email for Password Recovery"** banner/card when the signed-in owner has no `firebaseUid` yet.

- [ ] **Step 1: Create `src/components/settings/CompanyInviteShareModal.tsx`**
  Generate QR locally via `QRCode.toDataURL` (never calling any external QR API). Use safe `noopener,noreferrer` links or Web Share API.

- [ ] **Step 2: Update `src/components/settings/UsersPermissionsSection.tsx`**
  Add Invite Member section, Pending Invitations management list, and Link-Email Recovery prompt for unlinked accounts.

- [ ] **Step 3: Run full verification suite**
  Run:
  - `npx tsx --test src/lib/__tests__/invitation-utils.test.ts src/server/__tests__/firebase-admin.test.ts src/server/__tests__/email-auth-onboarding.test.ts src/server/__tests__/company-invitations.test.ts src/server/fresh-installation-acceptance.test.ts`
  - `compile_applet` + `lint_applet`
  - Live browser visual verification via `playwright-cli` on `http://localhost:3000`: verify LoginScreen ("Forgot Password?" + "Join with Invite Code"), AcceptInviteModal preview/UI, FirstRunOnboardingModal email fields, and UsersPermissionsSection Invite + QR modal with zero console errors in both EN (LTR) and AR (RTL).

---

## Self-Review Summary
- **Spec Coverage:** Every requirement in `docs/superpowers/specs/2026-11-21-email-auth-company-invites-design.md` (Email owner signup, Forgot Password, Invite Links + Short Code + Local QR + WhatsApp/Mail/Copy, Legacy email linking, Offline PIN & LAN sync preservation, additive Drizzle schema, `firebase-admin` verification, Firebase Console Email/Password guidance) is covered across Tasks 1–7.
- **Type & Interface Consistency:** All exported functions and types (`VerifiedFirebaseIdentity`, `INVITATION_STATUSES`, `normalizeEmail`, `normalizeShortCode`, `buildInviteSharePayload`, `CompanyInvitationRecord`, `usePOS()` actions) align identically between producers and consumers.
- **Review Focus Coverage:** All 5 failure modes are explicitly pinned by automated assertions in Tasks 1, 3, and 4 and live UI verification in Task 7.
