# Phase A — Verification Test Plan & Safe Rollback Strategy

**Project:** `ANDROID-POS-01` (Dqnamo POS)  
**Scope:** Acceptance tests, HTTP 401/403 security verification matrix, compatibility verification, and zero-vulnerability rollback procedures for Phase A.  
**Database Impact:** **ZERO** (all Phase A tests execute against isolated temp data dirs / mocked Firebase verifier without altering PostgreSQL schema or production data).  
**Status:** Planning Artifact Only — **No Tests or Code Executed/Modified Yet**.

---

## 1. Automated & Integration Security Test Matrix (Step 4)

All tests below will be implemented in `src/server/__tests__/phase-a-security.test.ts` (using `node:test` + `tsx --test` against an ephemeral Express instance with isolated `DATA_DIR` and a deterministic mockable Firebase token verifier for unit/integration runs, plus a live Cloud Run staging verification checklist).

| Test ID | Scenario | Target Endpoint(s) | Request Setup | Expected HTTP Status | Expected `errorCode` / Outcome |
|---|---|---|---|---|---|
| **T-01** | **Missing token** | `GET /api/store-sync`, `POST /api/transactions`, `GET /api/backups`, `GET /api/analytics/overview`, `GET /api/lan-sync/state`, `POST /api/products` | No `Authorization` or `x-session-token` header | **`401`** | `UNAUTHENTICATED_REQUEST`; zero records returned or written |
| **T-02** | **Malformed token** | `GET /api/auth/session`, `GET /api/store-sync`, `GET /api/analytics/overview` | `Authorization: Bearer not-a-jwt`, `Bearer a.b`, empty `Bearer ` | **`401`** | `INVALID_TOKEN`; request rejected before business logic |
| **T-03** | **Expired token (POS JWT & Firebase ID token)** | `GET /api/store-sync`, `GET /api/analytics/sales`, `GET /api/backups` | Validly signed HS256 JWT with `exp = now - 60`; Firebase verifier throwing `auth/id-token-expired` | **`401`** | `TOKEN_EXPIRED`; audit event `AUTH_TOKEN_REJECTED` logged without token text |
| **T-04** | **Invalid signature (Hardcoded legacy secret & wrong RS256 key)** | `GET /api/auth/session`, `GET /api/backups`, `POST /api/products` | HS256 JWT signed with revoked legacy string `'dqnamo-pos-enterprise-hmac-sha256-secret-v1'`; tampered RS256 Firebase token | **`401`** | `INVALID_TOKEN_SIGNATURE` / `INVALID_TOKEN`; startup also throws in `NODE_ENV=production` if `SESSION_JWT_SECRET` is missing or equals legacy default |
| **T-05** | **Revoked session / Revoked or disabled Firebase user** | `GET /api/auth/session`, `GET /api/store-sync`, `POST /api/transactions` | (a) Logged-out POS JWT (`isRevoked=true`); (b) Firebase `auth/id-token-revoked`; (c) Firebase `auth/user-disabled` or app user `isActive=false` | **(a),(b) `401`**; **(c) `403`** | (a),(b) `TOKEN_REVOKED`; (c) `USER_ACCOUNT_DEACTIVATED` |
| **T-06** | **Valid Firebase user with no company membership** | `POST /api/auth/firebase-exchange`, `GET /api/store-sync`, `GET /api/analytics/overview` | Verified Firebase token (`uid: "fb-orphan-1"`, `email: "stranger@example.com"`, `email_verified: true`) not linked to any app user; also test app user whose `companyId` does not exist in `companies` | **`403`** | `UNLINKED_FIREBASE_ACCOUNT` or `COMPANY_MEMBERSHIP_NOT_FOUND`; zero duplicate users auto-created |
| **T-07** | **User accessing another company's data (Cross-tenant isolation)** | `GET/POST /api/store-sync`, `POST /api/transactions`, `GET/POST /api/lan-sync/state,push`, `GET /api/users`, `PUT /api/companies/:id` | Valid Bearer token for Company A Owner passing `companyId=companyB` in header, query, or body; also omitting `companyId` | **`403`** (on mismatch); **`200`** with **only Company A rows** (when omitted) | `FORBIDDEN_CROSS_COMPANY_ACCESS` on mismatch; zero Company B or untagged rows returned when omitted |
| **T-08** | **Cashier attempting Owner-only operations** | `POST /api/backups/create`, `DELETE /api/backups/:id`, `POST /api/users`, `POST /api/currencies`, `POST /api/onboarding/factory-reset`, `GET /api/analytics/financial` | Valid Bearer token for Company A `CASHIER` | **`403`** | `FORBIDDEN_MISSING_CAPABILITY` (or `FORBIDDEN_FINANCIAL_ACCESS` on `/api/analytics/financial`); state unchanged |
| **T-09** | **Backup access across companies & re-auth bypass** | `GET /api/backups?companyId=companyB`, `GET /api/backups/:bkpB/download?companyId=companyB`, `POST /api/backups/restore-in-place` with `ownerPassword: "local-owner-bypass"`, `POST /api/backups/restore-new-company` unauthenticated | (a) Company A Owner requesting Company B backups; (b) Owner passing `'local-owner-bypass'`; (c) Anonymous `restore-new-company` when prod company exists | **(a) `403`**; **(b),(c) `401`** | (a) `FORBIDDEN_CROSS_COMPANY_ACCESS`; (b) `INVALID_OWNER_CREDENTIALS`; (c) `UNAUTHENTICATED_REQUEST` |
| **T-10** | **Analytics & Intelligence access across companies** | `GET /api/analytics/overview`, `GET /api/analytics/sales`, `GET /api/analytics/inventory`, `GET /api/intelligence/lifecycle`, `POST /api/intelligence/lifecycle/:id/acknowledge` | Seed transactions/products/customers/lifecycle items for Company A & Company B; call as Company A Owner (including back-to-back calls within 1500ms cache TTL) | **`200`** (own tenant) / **`403`** (cross-tenant query or lifecycle item) | Response contains 100% Company A metrics and 0 Company B records; cache isolation verified within TTL |
| **T-11** | **Spoofed `x-user-id` & `x-user-role`** | `GET /api/users`, `GET /api/backups`, `GET /api/analytics/overview`, `POST /api/products`, `POST /api/store-sync` | Valid Owner `userId` sent in `x-user-id` + `x-user-role: admin`, **no Bearer token** | **`401`** | `UNAUTHENTICATED_REQUEST`; impersonation completely blocked |
| **T-12** | **Spoofed `query.userId` & `body.userId`** | `GET /api/analytics/overview?userId=<ownerA>`, `POST /api/unmet-demand/requests` with `{ userId: <ownerA> }`, `GET /api/users?userId=<ownerA>` | Valid Owner `userId` sent in query string or JSON body, **no Bearer token** | **`401`** | `UNAUTHENTICATED_REQUEST`; query/body impersonation blocked |
| **T-13** | **Existing valid login/session compatibility & Firebase UID linking** | `POST /api/auth/login` → `GET /api/auth/session` → `GET /api/companies/current` → `POST /api/auth/logout`; plus `POST /api/auth/firebase-exchange` for unique verified email | (a) Login with scrypt password & PIN; (b) Rotate `SESSION_JWT_SECRET` using `SESSION_JWT_SECRET_PREVIOUS`; (c) Firebase token linking once without duplicating user | **`200`** | Valid `dqsess_` session works across all routes; previous secret verifies during rotation; Firebase links once and reuses existing `user.id` |
| **T-14** | **Existing checkout, inventory, currency & SSE sync workflows** | `POST /api/products`, `PUT /api/products/:id`, `POST /api/transactions`, `POST /api/store-sync`, `POST /api/lan-sync/stream-ticket` → `GET /api/lan-sync/stream?ticket=...` | Authenticated Owner/Cashier performing product creation, bank-transfer validation, checkout transaction push, stock movement sync, and SSE stream connection | **`200`/`201`** (valid) / **`400`** (invalid bank transfer) | All business calculations, bank-transfer validation, and real-time SSE updates succeed identically for authorized tenant actors |

### 1.1 Additional Audit Log & Secret Hygiene Assertions
- Verify that across all failed/succeeded auth tests (T-01 through T-14), neither server stdout/stderr nor `auditLogs` ever contains:
  - Raw `Bearer ...` token strings or `dqsess_...` strings
  - Raw Firebase ID tokens
  - `SESSION_JWT_SECRET` values
  - Plaintext passwords, PINs, or backup encryption passwords
  - `DATABASE_URL` or `SQL_PASSWORD`.

### 1.2 Regression Suite Gate (Must All Pass Before Merge)
1. `npm run lint` (`tsc --noEmit`) — zero TypeScript errors.
2. `npm test` — all existing unit & acceptance tests + new `phase-a-security.test.ts` pass.
3. `npm run build` — production Vite client bundle compiles cleanly.
4. `npm run server:bundle` — production CJS server bundle (`esbuild`) compiles cleanly with `firebase-admin` properly resolved.

---

## 2. Rollback Plan (Step 5)

### Core Rollback Principle
**Never roll back in a way that re-enables a known Critical security vulnerability** (never re-enable the hardcoded JWT secret, never re-enable `x-user-id` impersonation, never re-enable `resolveBackupActorOrLocalStore` synthetic `COMPANY_OWNER`, and never re-open unauthenticated `/api/store-sync` or cross-company backups).

Instead, Phase A uses **forward-safe, granular rollback controls** and **coordinated deployment**:

### 2.1 File-by-File Revert & Containment Strategy

| Change Area | Affected Files | Safe Revert / Mitigation Procedure | Lockout Prevention & Session Compatibility |
|---|---|---|---|
| **Secret Manager & JWT Rotation (`SEC-01`)** | `src/server/jwt-secret.ts`, `src/server/release-onboarding.service.ts` | If a newly rotated secret causes unexpected invalidations, **do NOT revert to the hardcoded literal**. Instead, keep the new secret in `SESSION_JWT_SECRET` and temporarily set `SESSION_JWT_SECRET_PREVIOUS` to the prior Secret Manager version (valid random secret only) to honor in-flight 7-day tokens while signing new tokens with the latest version. | On first cutover from the insecure hardcoded default, existing stale tokens must be invalidated for security; the frontend `401` handler automatically prompts re-login while preserving local IndexedDB/SQLite offline cart & pending outbox records. |
| **Firebase Admin Integration (`FB-01`)** | `package.json`, `src/server/firebase-admin.ts`, `src/server/auth-middleware.ts`, `src/components/settings/FirebaseCloudSyncSection.tsx` | If Firebase token verification encounters an IAM error (e.g., `7 PERMISSION_DENIED` on revocation check), set env var `FIREBASE_CHECK_REVOKED=false` on Cloud Run (zero code redeploy needed — signature/expiry verification still remains 100% active without IAM). If Firebase login UI has an issue, revert only the Firebase exchange caller; POS username/password/PIN login (`POST /api/auth/login`) remains unaffected. | Users are never locked out because POS password/PIN `dqsess_` JWT login operates in parallel with Firebase ID tokens via the same middleware. |
| **Unified Auth Middleware & Route Hardening (`SEC-02`, `SEC-04`)** | `server.ts`, `src/server/auth-middleware.ts`, `src/server/backup-restore.service.ts`, `src/server/lan-sync.service.ts`, `src/server/shared-store-sync.ts` | If an authenticated legitimate workflow fails with unexpected `403` (e.g., missing capability mapping on a cashier route), fix the specific capability mapping in a hotfix commit or roll back the **entire Cloud Run revision** to the prior tagged image ONLY in staging/pre-pilot (never expose vulnerable pre-Phase-A revision to multi-tenant external companies). | Before enabling strict enforcement in production, verify all 8 migrated frontend callers + `src/services/api.ts` against staging so zero legitimate UI actions omit `Authorization: Bearer`. |
| **Analytics & Lifecycle Isolation (`ANA-01`)** | `src/analytics/analytics.routes.ts`, `src/analytics/analytics.repository.ts`, `src/analytics/intelligence.lifecycle.ts` | Analytics changes are read-only scoping + per-company cache keying. If a legitimate company record is missing `companyId` on legacy local JSON data and appears empty after strict filtering, run a documented one-time non-destructive backfill script for that single pilot tenant's local JSON records rather than removing tenant filtering. | Calculation engines (`src/analytics/calculations/*`, `forecasting/*`) are untouched, eliminating formula-regression risk. |
| **Frontend `authenticatedFetch` & SSE Ticket (`A6`)** | `src/lib/auth-fetch.ts`, `src/services/api.ts`, 8 frontend files | Must be deployed **atomically with the backend** (same Cloud Run container serves both Express API and `dist/` SPA). Because `index.html` and `sw.js` already send `Cache-Control: no-store, no-cache` (`server.ts:924-931`), web browsers pick up the updated client immediately on reload. | **Coordinated Deployment Requirement:** Android APK and Windows EXE builds that connect to the cloud backend MUST be rebuilt and distributed before cutting over existing mobile/desktop terminals to the hardened Cloud Run service. |

### 2.2 Verifying Session Compatibility Post-Deploy (Staging & Production Smoke Checklist)
1. **Fresh Login Test:** Owner logs in via `POST /api/auth/login` → receives `dqsess_<JWT>` signed by Secret Manager key → `GET /api/auth/session` returns `200`.
2. **Core POS Loop:** Create/edit product → run checkout (`POST /api/transactions`) → sync (`GET/POST /api/store-sync`) → open SSE stream via `POST /api/lan-sync/stream-ticket` → verify `200`/`201` on every step.
3. **Analytics & Intelligence:** Open Analytics Dashboard & Intelligence Center as Owner (`200` with financials) and as Cashier (`403` on `/api/analytics/financial`, `200` redacted on `/api/analytics/overview`).
4. **Backup Isolation:** Create backup as Company A Owner → download succeeds (`200`) → attempt listing/downloading with `?companyId=<companyB>` returns `403`.
5. **Firebase Verification:** Sign in with Google on a linked email → `POST /api/auth/firebase-exchange` returns `200` mapped to existing `user.id` (confirm total user count did not increase).
6. **Secret Rotation Dry-Run (Staging):** Add new secret version in Secret Manager, set old secret in `SESSION_JWT_SECRET_PREVIOUS`, restart staging revision → confirm existing session from step 1 still returns `200` without forcing re-login.
7. **Cloud Logging Audit:** Inspect Cloud Run logs for the smoke test window and verify zero raw tokens, passwords, or secrets were logged.

---

## 3. Acceptance Criteria for Phase A Sign-Off

Phase A is considered **complete and ready for Phase B** only when ALL of the following are verified with evidence:
- [ ] All 14 test cases (`T-01` through `T-14`) pass in automated test execution.
- [ ] `npm run lint`, `npm test`, `npm run build`, and `npm run server:bundle` all pass with zero errors.
- [ ] Zero database schema changes or migrations were executed (`0` DDL statements).
- [ ] `SESSION_JWT_SECRET` has zero hardcoded fallback in codebase (verified by `grep`).
- [ ] Zero backend routes read `x-user-id`, `query.userId`, `body.userId`, or `local-owner-bypass` for authentication/authorization (verified by `grep`).
- [ ] `resolveBackupActorOrLocalStore` and `allowInternalDefaultIfNoHeader` are completely removed (verified by `grep`).
- [ ] `firebase-admin` token verification and safe UID-to-user mapping pass unit & staging tests without creating duplicate users.
- [ ] Coordinated web + Android/Windows client upgrade readiness is confirmed.
