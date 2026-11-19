# Phase A — Critical Security Remediation & Authentication Unification Plan

**Project:** `ANDROID-POS-01` (Dqnamo POS)  
**Approved Business Direction:** SaaS Scenario B — Low-Cost Pilot (10 companies, ~50 users, 20 branches, existing GCP project `artful-port-r71nt` in `europe-west2`, existing PostgreSQL infrastructure preserved)  
**Phase Scope:** Phase A — Critical Security Remediation & Authentication Unification (**Zero Database Schema/Data Changes**)  
**Document Status:** Planning & Audit Complete — **Awaiting Explicit Human Approval Before Implementation**  
**Date:** 2026-11-19

---

## 1. Executive Summary & Scope Boundaries

Phase A closes all P0 authentication, impersonation, secret-management, cross-tenant API leakage, backup takeover, and analytics tenant-isolation vulnerabilities identified in `docs/SAAS_PRODUCTION_READINESS_AUDIT.md`, while establishing one authoritative server-side authentication and authorization layer supporting both existing POS session JWTs (`dqsess_<HS256>`) and Firebase ID tokens (`firebase-admin`).

### Strict Phase A Guardrails
- **Database Impact:** **ZERO.** No schema changes, no Drizzle migrations, no RLS DDL, no table/row mutations, and no new Cloud SQL instances. (RLS and PostgreSQL schema hardening remain scoped to Phase B.)
- **Business Logic Preservation:** Checkout totals, bank-transfer validation, currency conversion, inventory rules, analytics/forecasting formulas, caching semantics (made tenant-safe), and backup AES-256-GCM envelope compatibility remain untouched.
- **No Secret Exposure:** All secrets are referenced by environment variable name or Secret Manager resource name only.

---

## 2. Repository Baseline Audit (Step 1)

### 2.1 Git & Workspace Baseline
- **Git Metadata Status:** The active workspace snapshot does not contain a `.git` directory (`git rev-parse --is-inside-work-tree` returns `fatal: not a git repository`).
- **Action Prerequisite Before Implementation:** Implementation must execute on a dedicated branch (e.g., `feat/phase-a-security-auth-unification`) cut from a clean, verified commit in the canonical GitHub repository (`ANDROID-POS-01`), with pre-change baseline tests recorded before any edit.
- **Documentation Baseline:** 74 Markdown files exist in `docs/`, including prior Phase 1–5 SaaS audit reports (`SAAS_PRODUCTION_READINESS_AUDIT.md`, `MULTI_TENANT_READINESS_REPORT.md`, `GOOGLE_CLOUD_COST_ESTIMATE.md`, `SAAS_DEPLOYMENT_ROADMAP.md`, `ANALYTICS_SECURITY_REVIEW.md`, `BACKUP_SECURITY_PLAN.md`, `PERMISSIONS_MATRIX.md`).

### 2.2 Runtime Environment Variable Presence (Non-Secret Status Only)

| Variable Name | Current Runtime Status | Phase A Requirement |
|---|---|---|
| `NODE_ENV` | `SET` | Keep (`production` on Cloud Run) |
| `K_SERVICE` | `SET` | Auto-injected by Cloud Run |
| `PORT` | `SET` | Auto-injected by Cloud Run (`3000` / `8080`) |
| `SQL_HOST`, `SQL_USER`, `SQL_PASSWORD` | `SET` | Preserved unchanged in Phase A |
| `DATABASE_URL`, `SQL_PORT`, `SQL_DATABASE` | `UNSET` | Preserved unchanged in Phase A |
| `SESSION_JWT_SECRET` | **`UNSET`** | **Mandatory (P0)** — Secret Manager (`session-jwt-secret`) |
| `SESSION_JWT_SECRET_PREVIOUS` | `UNSET` | Optional during zero-downtime key rotation window |
| `FIREBASE_PROJECT_ID` | `UNSET` | Recommended (`artful-port-r71nt`); falls back to `firebase-applet-config.json` |
| `FIREBASE_CHECK_REVOKED` | `UNSET` | Optional boolean (`true` in Prod Cloud Run once IAM viewer role granted) |
| `GOOGLE_APPLICATION_CREDENTIALS` | `UNSET` | Not needed on Cloud Run (uses ADC via runtime Service Account) |
| `GOOGLE_CLOUD_PROJECT` / `GCLOUD_PROJECT` | `UNSET` | Auto-available or explicitly set on Cloud Run (`artful-port-r71nt`) |
| `ALLOWED_ORIGINS` | `UNSET` | Recommended for CORS allowlisting in Phase A/D |
| `BACKUP_ENCRYPTION_KEY` | `UNSET` | Optional server-side envelope wrapping (Phase C) |

### 2.3 Current Backend & Client Architecture Baseline
- **Express Entrypoint:** `server.ts` (975 lines) mounts global CORS (`Access-Control-Allow-Origin: *`, lines 94–105), JSON body parser (`50mb`, line 107), compression (line 110), rate limiters (`authRateLimiter` on `/api/auth`, `apiRateLimiter` on `/api`, lines 113–114), and routers:
  - `/api/analytics`, `/api/intelligence`, `/api/unmet-demand` (`src/analytics/analytics.routes.ts`, 1025 lines)
  - `/api` (`releasePlatformRouter` in `src/server/release-onboarding.service.ts`, 2912 lines)
  - `/api/backups` (`backupRestoreRouter` in `src/server/backup-restore.service.ts`, 2090 lines)
  - `/api/lan-sync` (`lanSyncRouter` in `src/server/lan-sync.service.ts`, 867 lines)
  - Inline routes in `server.ts`: `/api/health`, `/api/currencies*`, `/api/exchange-rates*`, `/api/convert`, `/api/products*`, `/api/store-sync`, `/api/transactions`.
- **Firebase Client Baseline:** `firebase@^13.1.0` installed in `package.json:44`; configured in `src/lib/firebase.ts` reading `firebase-applet-config.json` (`projectId: "artful-port-r71nt"`, `authDomain: "artful-port-r71nt.firebaseapp.com"`, `firestoreDatabaseId: "ai-studio-dqnamoposmoderna-82cc08b7-ecc8-4968-b1b8-331b54b755ff"`). Currently used only in `src/components/settings/FirebaseCloudSyncSection.tsx` for Google Sign-In (`signInWithPopup`) and Firestore snapshot push/pull. **`firebase-admin` is not installed.**
- **Frontend Auth Token Usage Baseline:**
  - `src/services/api.ts:48-57` already attaches `Authorization: Bearer <token>` from `localStorage.getItem('dqnamo_pos_session_token_v1')` for `/api/products*`, `/api/currencies*`, `/api/exchange-rates*`, `/api/convert`.
  - However, **8 other frontend modules** still call `/api/backups/*`, `/api/intelligence/*`, `/api/unmet-demand/*`, `/api/users/*`, `/api/branches`, `/api/onboarding/*`, `/api/store-sync`, and `/api/lan-sync/*` using raw `fetch()` / `EventSource()` with **`'x-user-id': currentUser.id`** or **no auth header at all**.

---

## 3. Detailed Investigation of Security Findings (Step 2)

### 3.1 SEC-01 — Hardcoded `SESSION_JWT_SECRET` Fallback & Stateless Token Forgery
- **Severity:** **CRITICAL (CVSS ~9.8)**
- **Exact Locations:**
  - Secret fallback: `src/server/release-onboarding.service.ts:1196-1203` — `const SESSION_JWT_SECRET = process.env.SESSION_JWT_SECRET || 'dqnamo-pos-enterprise-hmac-sha256-secret-v1';` (logs only `console.warn` in production; app starts normally).
  - Token creation: `signSessionJwt` (`src/server/release-onboarding.service.ts:1232-1257`) invoked via `issueSessionForUser` (`1303-1346`) from `createCompanyAndInitialOwner` (`874`, `956`, `1086`), `POST /api/auth/login` (`2392`), `authenticateAccount` (`2750`), and `restoreBackupAsNewCompany` (`src/server/backup-restore.service.ts:1502`).
  - Token verification: `verifySessionJwt` (`src/server/release-onboarding.service.ts:1259-1301`) called inside `resolveAuthenticatedActorFromRequest` (`1379`).
  - Stateless acceptance amplifier: `src/server/release-onboarding.service.ts:1431-1451` accepts any valid HS256 JWT even if `sid` is absent from `state.sessions`.
- **Exploit Impact:** Because `SESSION_JWT_SECRET` is currently `UNSET` and the fallback string is public in the repository, any external attacker can mint an arbitrary 7-day `HS256` JWT for any `userId` and `companyId` and pass verification as `COMPANY_OWNER`.
- **Remediation Design:**
  1. Remove the hardcoded fallback string completely.
  2. Introduce a dedicated `src/server/jwt-secret.ts` loader:
     - In `NODE_ENV === 'production'`: **fail-fast (`process.exit(1)` / throw on boot)** if `SESSION_JWT_SECRET` is missing, shorter than 32 bytes (256 bits), or equals the revoked legacy default string.
     - In non-production (`development` / `test`): use `process.env.SESSION_JWT_SECRET` if provided (and not the revoked legacy default in strict tests), or generate a cryptographically random ephemeral 32-byte per-process key via `crypto.randomBytes(32).toString('hex')` with a clear startup log notice (never the hardcoded string).
     - Support optional `SESSION_JWT_SECRET_PREVIOUS` for **verification-only** during planned key rotation windows (new tokens always sign with `SESSION_JWT_SECRET`).
  3. **Google Secret Manager Provisioning Plan (Scenario B — ~$0.06/mo per active secret version):**
     - Create secret `session-jwt-secret` in GCP project `artful-port-r71nt` with a 64-byte CSPRNG value (`openssl rand -hex 64`).
     - Grant the Cloud Run runtime Service Account `roles/secretmanager.secretAccessor` on that secret only (least privilege).
     - Mount on Cloud Run via `--set-secrets="SESSION_JWT_SECRET=session-jwt-secret:latest"`.
     - Zero secrets in `.env`, Docker images, Git, or Cloud Run plaintext env vars.

### 3.2 SEC-02 — Unauthenticated API Routes (`/api/store-sync`, `/api/transactions`, `/api/lan-sync/*`, Catalog/Currency & Admin Write Bypasses)
- **Severity:** **CRITICAL**
- **Exact Locations Without Authentication Middleware:**
  - `GET /api/store-sync` (`server.ts:695-724`) — dumps transactions, customers, stock movements, users, active sessions, unmet demand, products.
  - `POST /api/store-sync` (`server.ts:779-904`) — mutates operational store state and users/sessions without any auth.
  - `POST /api/transactions` (`server.ts:726-777`) — inserts arbitrary sales transactions without auth.
  - `GET /api/lan-sync/info` (`src/server/lan-sync.service.ts:572-606`) — exposes host IPs, connected devices, recent events.
  - `GET /api/lan-sync/stream` (`src/server/lan-sync.service.ts:609-698`) — SSE stream pushing complete company snapshots (`users`, `transactions`, `customers`, `activeSessions`).
  - `GET /api/lan-sync/state` (`src/server/lan-sync.service.ts:701-739`) — dumps full company state.
  - `POST /api/lan-sync/push` (`src/server/lan-sync.service.ts:742-866`) — overwrites/merges company state and broadcasts to all SSE clients.
  - `GET /api/products` (`server.ts:368-382`) & `GET /api/products/:id` (`server.ts:384-401`) — unauthenticated catalog & `costPrice` disclosure.
  - `GET /api/currencies`, `GET /api/exchange-rates`, `GET /api/exchange-rates/history`, `GET /api/convert` (`server.ts:161-172, 220-249, 348-365`) — unauthenticated reads.
  - `POST/PUT/DELETE /api/products*` & `POST/PUT/DELETE /api/currencies*` & `/api/exchange-rates*` (`server.ts:146-148, 405, 535, 571, 627`) — use `allowInternalDefaultIfNoHeader: true`, allowing completely unauthenticated writes!
  - `POST /api/onboarding/factory-reset` (`src/server/release-onboarding.service.ts:2236-2256`) — no session authentication middleware before attempting password/PIN verification against arbitrary `companyId`.
  - `GET /api/onboarding/status` (`src/server/release-onboarding.service.ts:1904-1941`) — leaks the entire directory of production companies (`id`, `code`, `legalName`, `displayName`) to unauthenticated visitors.
- **Intentionally Public Routes (Explicit Allowlist & Justification):**
  1. `GET /api/health` (`server.ts:151`) — Required for Cloud Run startup/liveness/readiness probes and uptime checks. Must remain public and expose only `{ status, timestamp, postgresConfigured }` (no hostnames/credentials).
  2. `GET /api/onboarding/status` (`release-onboarding.service.ts:1904`) — Required by first-run UI to decide between First-Run Setup Wizard vs Login Screen. Must **stop enumerating production companies** for unauthenticated callers; return only `{ hasConfiguredCompany, requiresInitialSetup, practiceSandboxMeta }` (authenticated callers can still fetch their own company via `GET /api/companies/current`).
  3. `POST /api/auth/login` (`release-onboarding.service.ts:2301`) — Public credential entry point (protected by `authRateLimiter`).
  4. `POST /api/auth/firebase-exchange` (new in Phase A) — Exchanges a valid `Authorization: Bearer <Firebase ID Token>` for a normalized session/actor response (cryptographically authenticated via Firebase ID token + `authRateLimiter`).
  5. `POST /api/onboarding/companies` (`release-onboarding.service.ts:2202`) — Public **only** when zero configured production companies exist (`existingProdCompanies.length === 0`); otherwise strictly requires authenticated `COMPANY_OWNER`/`ADMIN` via `requireAuth`.
  6. `GET /api/onboarding/practice/state` & `POST /api/onboarding/practice/reset` — Public **only** for the isolated synthetic sandbox (`comp-demo-practice`), strictly blocked from touching any production company.
  7. `POST /api/backups/restore-new-company` (`backup-restore.service.ts:2031`) — Public **only** when zero configured production companies exist (disaster recovery onto a blank installation); otherwise strictly requires authenticated `COMPANY_OWNER` with `backup.restore`.

### 3.3 SEC-03 — Tenant Resolution & Missing `companyId` Unrestricted Data Leakage
- **Severity:** **CRITICAL**
- **Exact Locations:**
  - `src/server/shared-store-sync.ts:69-76` (`filterByCompanyScope`): returns the entire unfiltered array when `companyId` is empty (line 74), and returns every untagged record (`!item.companyId`) to **every** company (line 75).
  - `src/server/shared-store-sync.ts:78-88` (`tagWithCompanyScope`): line 86 uses `companyId: item.companyId || companyId`, allowing a client to inject records tagged with another company's `companyId`.
  - `server.ts:688-693` (`resolveRequestCompanyScope`): trusts untrusted `x-company-id`, `query.companyId`, and `body.companyId`.
  - `server.ts:130-143` (`isPracticeModeRequest`): trusts client-supplied `x-workspace-mode: PRACTICE` or `x-company-id: comp-demo-practice` headers instead of server-verified `actor.workspaceMode`.
  - `src/server/lan-sync.service.ts:472-473, 516, 536, 554-560, 574, 603, 610, 702-704, 759-761`: reads untrusted `companyId` from query/header/body, defaults to `'comp-clean-store'`, and broadcasts/lists cross-company devices/events when `companyId` is omitted.
  - `src/server/backup-restore.service.ts:639-665`: `collectServerCompanyPayload` includes `!item.companyId` records in every company's backup.
  - `src/server/release-onboarding.service.ts:1422, 1444, 1504`: falls back to `state.companies[0]` when `matchedUser.companyId` is not found in `state.companies`, instead of failing closed (`403`).
  - `src/analytics/analytics.repository.ts:220-234, 312-368, 658-792`: only `unmetDemandRequests` is filtered by `companyId`; `products`, `transactions`, `returns`, `purchases`, `customers`, `stockMovements`, `users`, and `branches` are unfiltered across companies, and `cachedSnapshot` is global rather than per-company.
- **Remediation Design (Zero DB Changes in Phase A):**
  - Derive `companyId` **exclusively** from `req.auth.companyId` (resolved server-side from verified token + server user store).
  - If a client optionally supplies `companyId` in header/query/body and it disagrees with `req.auth.companyId`, reject immediately with **`403 FORBIDDEN_CROSS_COMPANY_ACCESS`** (never silently override or broaden).
  - Harden `filterByCompanyScope(list, companyId)` to fail closed: if `!companyId`, return `[]`; require strict equality `item.companyId === companyId` (no `!item.companyId` leakage).
  - Harden `tagWithCompanyScope(list, companyId)` to always force `companyId` from the authenticated actor (`companyId` overrides any client `item.companyId`).
  - Remove `|| state.companies[0]` fallbacks in actor resolution — if a user's company does not exist, throw `403 COMPANY_MEMBERSHIP_NOT_FOUND`.

### 3.4 SEC-04 — Header/Query User Impersonation, Internal Fallbacks & Cross-Company Backup Takeover
- **Severity:** **CRITICAL**
- **Exact Locations:**
  - `src/server/release-onboarding.service.ts:1460-1510`: accepts unauthenticated `x-user-id`, `query.userId`, or `body.userId` to impersonate any user in `state.users`.
  - `src/server/release-onboarding.service.ts:1467-1479` & `2846-2893`: `allowInternalDefaultIfNoHeader` / `allowUnauthenticatedDefaultRead` authenticates anonymous callers as the first active production user (used on product & currency write routes in `server.ts:146-148, 405, 535, 571, 627`).
  - `src/analytics/analytics.routes.ts:149-160`: falls back to `x-user-id`, `query.userId`, and `body.userId`.
  - `src/server/backup-restore.service.ts:1781-1858`: `resolveBackupActorOrLocalStore(req)` intercepts `401`/`404` auth errors and **fabricates a synthetic `COMPANY_OWNER` with `ALL_CAPABILITY_CODES`** for any `x-company-id` / `query.companyId` / `body.companyId`!
  - `src/server/backup-restore.service.ts:1861-1898` (`GET /api/backups`) and `1922-1953` (`GET /api/backups/:backupId/download`): use `targetCompanyId = requestedCompanyId || actor.company.id` with **zero `assertActorCompanyMatch` check**, allowing Company A to list and download Company B's backups.
  - `src/server/backup-restore.service.ts:1092-1099`: `verifyCompanyOwnerReauth` bypasses owner password verification when `pwd === 'local-owner-bypass'` or `actorUser?.id === 'unassigned-operator'`.
  - `src/server/backup-restore.service.ts:1365-1376`: `restoreBackupAsNewCompany` swallows 401 errors and proceeds as `'local-operator'` even when production companies exist.
  - `src/server/backup-restore.service.ts:1956-2014`: `/inspect` and `/unpack` allow unauthenticated envelope processing and use `resolveBackupActorOrLocalStore` for `backupId` lookups.
- **Remediation Design:**
  - Delete `resolveBackupActorOrLocalStore` completely. Every `/api/backups/*` route (except first-run `restore-new-company` when 0 production companies exist) MUST pass through `requireAuth` + `requireCapability(...)`.
  - Enforce `assertActorCompanyMatch(actor, requestedCompanyId)` on `GET /api/backups` and `GET /api/backups/:backupId/download` and always resolve storage directory exclusively from `actor.company.id`.
  - Delete `pwd === 'local-owner-bypass'` and `actorUser?.id === 'unassigned-operator'` bypasses from `verifyCompanyOwnerReauth`.
  - Remove `x-user-id`, `query.userId`, `body.userId`, and `allowInternalDefaultIfNoHeader` authentication fallbacks across `release-onboarding.service.ts`, `server.ts`, `analytics.routes.ts`, and `backup-restore.service.ts`.

### 3.5 Firebase Authentication & Safe Identity Mapping
- **Current State:** `firebase-admin` is not installed (`package.json`). Client uses `firebase@^13.1.0` (`src/lib/firebase.ts`) for Google Sign-In in `FirebaseCloudSyncSection.tsx`, but Firebase ID tokens are never sent to or verified by Express.
- **Backend Verification Architecture (`src/server/firebase-admin.ts`):**
  1. Add single production dependency: `firebase-admin`.
  2. Singleton initialization guarded by `getApps().length`:
     ```ts
     // Uses ADC on Cloud Run; projectId from env or firebase-applet-config.json.
     // NEVER reads or stores a static service account private key JSON file.
     ```
  3. Verification flow via `getAuth(app).verifyIdToken(idToken, checkRevoked)`:
     - Cryptographically validates RS256 signature against Google public keys, `exp`, `iat`, `aud === projectId`, `iss === https://securetoken.google.com/<projectId>`, and non-empty `sub` (`uid`).
     - **Revocation & Disabled User Handling:**
       - `verifyIdToken(idToken)` (`checkRevoked = false`) requires **no IAM permissions** and works in every environment (including AI Studio preview containers and local dev).
       - `verifyIdToken(idToken, true)` calls Firebase Auth backend to detect **revoked refresh tokens** (`auth/id-token-revoked`) and **disabled Firebase users** (`auth/user-disabled`), and requires IAM role **`roles/firebaseauth.viewer`** on the Cloud Run runtime service account in `artful-port-r71nt`.
       - Phase A makes `checkRevoked` configurable via `FIREBASE_CHECK_REVOKED=true` (recommended `true` in Cloud Run production after granting `roles/firebaseauth.viewer`, `false` in isolated preview/CI without IAM) AND **always** enforces local application-level `user.isActive === true` and `session.isRevoked === false` checks.
     - Explicit error mapping:
       - `auth/id-token-expired` → `401 TOKEN_EXPIRED`
       - `auth/id-token-revoked` → `401 TOKEN_REVOKED`
       - `auth/user-disabled` → `403 USER_ACCOUNT_DEACTIVATED`
       - `auth/argument-error` / invalid signature / wrong `aud` → `401 INVALID_TOKEN`
- **Safe Firebase UID ↔ Application User Mapping (Zero DB Migration, Zero Duplicate Identities):**
  - **Core Invariant:** A Firebase `uid` is **never** treated as interchangeable with `StoredUserRecord.id`, and verifying a Firebase token **never** auto-creates a duplicate user record.
  - **Deterministic Resolution Algorithm:**
    1. Look up active users in the server identity store where `u.firebaseUid === decoded.uid`.
       - If **1 match**: use that user (if `!user.isActive` → `403 USER_ACCOUNT_DEACTIVATED`).
       - If **>1 matches** (multi-company user): require an explicit `x-company-id` matching one of those memberships; if omitted or unmatched → `409 AMBIGUOUS_TENANT_MEMBERSHIP` or `403 FORBIDDEN_CROSS_COMPANY_ACCESS`.
    2. If **0 matches on `firebaseUid`**:
       - Require `decoded.email_verified === true` and a non-empty normalized `decoded.email`.
       - Find active users where `(u.email || '').trim().toLowerCase() === normalizedEmail` AND `!u.firebaseUid` (not already bound to a different Firebase UID).
       - If **exactly 1 match**: bind `u.firebaseUid = decoded.uid` (persisted in platform state + audit log `FIREBASE_IDENTITY_LINKED`) and proceed.
       - If **0 matches** (or email unverified, or email belongs to a user already bound to another `firebaseUid`, or multiple companies share the email ambiguously): reject with **`403 UNLINKED_FIREBASE_ACCOUNT`** (never create a shadow user or grant fallback access).
    3. Resolve company strictly by `state.companies.find(c => c.id === matchedUser.companyId)`. If missing → **`403 COMPANY_MEMBERSHIP_NOT_FOUND`**.
  - **Existing Session Compatibility:** Existing POS username/email + password/PIN logins (`POST /api/auth/login`) continue to issue `dqsess_<HS256 JWT>` tokens for terminal/cashier workflows and offline re-sync; the unified middleware accepts **both** `dqsess_<JWT>` and Firebase ID tokens seamlessly.

### 3.6 Analytics & Intelligence Routes (`/api/analytics/*`, `/api/intelligence/*`, `/api/unmet-demand/*`)
- **Preserved Unchanged:** All calculations in `src/analytics/calculations/*`, `forecasting.engine.ts`, `technical-analysis.ts`, `insights.service.ts`, `analytics.service.ts`, and read-only analytics behavior.
- **Required Security Fixes in Phase A:**
  1. Mount `requireAuth` on `analyticsRouter`, `intelligenceRouter`, and `unmetDemandRouter`; delete `x-user-id`/`query.userId`/`body.userId` fallback in `src/analytics/analytics.routes.ts:149-160`.
  2. Enforce `companyId = req.auth.companyId` on every call to `loadServerAnalyticsDataset({ statusFilter, companyId })` — including `makeLifecycleTransitionHandler` at `analytics.routes.ts:988` (currently omits `companyId`).
  3. Reject client-supplied cross-company `companyId` in query/headers/body with `403 FORBIDDEN_CROSS_COMPANY_ACCESS`.
  4. In `src/analytics/analytics.repository.ts`:
     - Replace single global `cachedSnapshot` (`lines 63-68, 226-234`) with a per-company `Map<string, CachedSnapshotEntry>` keyed by `companyId`.
     - Filter `products`, `transactions`, `returns`, `purchases`, `customers`, `stockMovements`, `users`, `branches`, and `unmetDemandRequests` strictly by `targetCompanyId` (both in SQL `WHERE` predicates when `db` is queried and in JSON reconciliation) so zero cross-company rows enter `computeFullAnalyticsOverview`.
  5. In `POST /api/analytics/overview` (`analytics.routes.ts:204-210`), when `req.body.snapshot` is provided, filter all snapshot arrays to `req.auth.companyId` and preserve server-authoritative `users`, `branches`, and role permissions.
  6. Scope `intelligence.lifecycle` storage/queries/transitions (`analytics.routes.ts:917-1023`) by `req.auth.companyId` so Company A cannot view or acknowledge/resolve/dismiss Company B's lifecycle items.

---

## 4. Unified Security Architecture Design (Step 3)

### 4.1 Request Flow & Separation of Authentication vs Authorization

```
Incoming HTTP Request
  │
  ├─► [1. Public Allowlist Check]  (/api/health, /api/auth/login, sanitized /api/onboarding/status,
  │                                 isolated Practice endpoints, first-run-only onboarding/restore)
  │
  ├─► [2. Unified AuthN Middleware: requireAuth()]  (src/server/auth-middleware.ts)
  │     • Extracts token ONLY from `Authorization: Bearer <token>` (or `x-session-token` for legacy POS clients;
  │       SSE stream uses short-lived signed single-purpose `?ticket=` minted via authenticated POST)
  │     • NEVER reads `x-user-id`, `query.userId`, `body.userId`, or `x-user-role`
  │     • Token Router:
  │         - Prefixed `dqsess_` OR JWT header `alg === 'HS256'`
  │             → verifySessionJwt() using Secret Manager `SESSION_JWT_SECRET` (+ optional `_PREVIOUS`)
  │             → verify session record not revoked/expired
  │         - Otherwise (JWT header `alg === 'RS256'` with Firebase `iss`)
  │             → verifyFirebaseIdToken() via `firebase-admin`
  │             → resolve mapped application user (firebaseUid → unique verified email link)
  │     • Fail-closed identity verification against server user & company store:
  │         - Missing/malformed/expired/revoked/invalid signature → 401
  │         - User deactivated / unlinked Firebase account / missing company → 403
  │     • Attaches immutable `req.auth: TrustedAuthContext`
  │
  ├─► [3. Tenant & Branch AuthZ Middleware]
  │     • `enforceTenantScope()`: checks optional client `companyId` (params/query/header/body)
  │       against `req.auth.companyId`; mismatch → 403 FORBIDDEN_CROSS_COMPANY_ACCESS.
  │     • `enforceBranchScope(branchIdExtractor)`: verifies non-Owner/Admin actor is assigned to
  │       target branch (`actor.user.branchId` / `assignedBranchIds`) AND target branch belongs to
  │       `req.auth.companyId`; mismatch → 403 FORBIDDEN_BRANCH_ACCESS.
  │
  ├─► [4. Capability AuthZ Middleware: requireCapability(code)]
  │     • Evaluates `userHasCapability(req.auth.user, code)` using server-stored role & custom capabilities.
  │     • Missing capability → 403 FORBIDDEN_MISSING_CAPABILITY.
  │
  └─► [5. Structured Security Audit Logger]
        • Logs actorUserId, companyId, authMethod, route, action, outcome (ALLOW/DENY), errorCode.
        • NEVER logs Authorization headers, raw JWTs, Firebase ID tokens, passwords, PINs, or backup passphrases.
```

### 4.2 Trusted Server-Side Identity Contract (`TrustedAuthContext`)
```ts
export interface TrustedAuthContext {
  authMethod: 'session_jwt' | 'firebase_id_token';
  userId: string;
  firebaseUid?: string;
  companyId: string;
  workspaceMode: 'PRODUCTION' | 'PRACTICE';
  systemRole: SystemRoleCode;
  capabilities: readonly CapabilityCode[];
  primaryBranchId: string;
  assignedBranchIds: readonly string[];
  sessionId?: string;
  user: StoredUserRecord;
  company: CompanyProfile;
}
```

### 4.3 Standardized HTTP 401 vs 403 Contract

| Condition | HTTP Status | Standard `errorCode` |
|---|---|---|
| Missing Bearer/session token | `401` | `UNAUTHENTICATED_REQUEST` |
| Malformed token / unsupported format | `401` | `INVALID_TOKEN` |
| Expired JWT or expired Firebase ID token | `401` | `TOKEN_EXPIRED` |
| Invalid HMAC or RS256 signature | `401` | `INVALID_TOKEN_SIGNATURE` |
| Revoked POS session or revoked Firebase token | `401` | `TOKEN_REVOKED` |
| Invalid login password/PIN or owner re-auth password | `401` | `INVALID_CREDENTIALS` |
| Deactivated user account or disabled Firebase user | `403` | `USER_ACCOUNT_DEACTIVATED` |
| Verified Firebase user with no linked app user / company | `403` | `UNLINKED_FIREBASE_ACCOUNT` / `COMPANY_MEMBERSHIP_NOT_FOUND` |
| Cross-company resource or query `companyId` mismatch | `403` | `FORBIDDEN_CROSS_COMPANY_ACCESS` |
| Accessing unassigned branch | `403` | `FORBIDDEN_BRANCH_ACCESS` |
| Missing RBAC capability (e.g., Cashier on Owner route) | `403` | `FORBIDDEN_MISSING_CAPABILITY` |
| Financial analytics without `canViewFinancials` | `403` | `FORBIDDEN_FINANCIAL_ACCESS` |
| Practice Mode attempting production backup/restore/merge | `403` | `PRACTICE_MODE_OPERATION_BLOCKED` |

### 4.4 Safe Session/JWT & Frontend Client Transition Strategy
1. **Shared Client Auth Helper (`src/lib/auth-fetch.ts`):**
   - Create a single `getClientAuthHeaders()` and `authenticatedFetch()` utility that attaches `Authorization: Bearer <token>` from `localStorage.getItem('dqnamo_pos_session_token_v1')` (or active Firebase `auth.currentUser.getIdToken()` when authenticated via Firebase).
   - Migrate all 8 remaining frontend modules (`BackupRestoreCenterSection`, `FirstRunOnboardingModal`, `IntelligenceCenterView`, `BusinessIntelligenceDashboard`, `useWorkspaceCompanyDomain`, `useUserAccountsDomain`, `useLanSyncDomain`, `useTrainingAndDemandDomain`) to use `authenticatedFetch()`, removing every `'x-user-id'` header dependency.
2. **SSE Stream Authentication (`/api/lan-sync/stream`):**
   - Browser `EventSource` cannot send custom `Authorization` headers.
   - Add `POST /api/lan-sync/stream-ticket` protected by `requireAuth`: mints a short-lived (60-second), single-purpose HMAC-SHA256 stream ticket bound to `{ sub, companyId, deviceId, purpose: 'lan_sync_sse' }`.
   - `GET /api/lan-sync/stream?ticket=<streamTicket>` verifies the ticket signature, `exp`, and `purpose` (never putting the 7-day session JWT or Firebase ID token in the URL).
3. **Zero-Lockout Key Transition:**
   - Existing users logged in with tokens signed by the old hardcoded fallback key **must** re-authenticate once after deployment (security requirement — old forgeable tokens cannot remain trusted indefinitely).
   - Provide a clean frontend `401` interceptor: when a protected API returns `401` with `INVALID_TOKEN_SIGNATURE` / `TOKEN_EXPIRED`, clear the stale `dqnamo_pos_session_token_v1` and smoothly display the Login modal (preserving unsynced offline cart/outbox state in IndexedDB/SQLite so zero sales data is lost!).
   - For all future secret rotations after Phase A, `SESSION_JWT_SECRET_PREVIOUS` allows 7-day zero-relogin rotation.

### 4.5 Secure Backup Ownership Validation
- Every backup endpoint (`GET /api/backups`, `POST /api/backups/create`, `GET /api/backups/:backupId/download`, `POST /api/backups/inspect`, `POST /api/backups/unpack`, `POST /api/backups/restore-in-place`, `POST /api/backups/merge-preview`, `POST /api/backups/merge-execute`, `DELETE /api/backups/:backupId`) uses `requireAuth` + `requireCapability(...)`.
- Storage path resolution ALWAYS uses `req.auth.companyId` (never `req.query.companyId` or `req.headers['x-company-id']`).
- If `req.query.companyId` or `req.body.companyId` is supplied and differs from `req.auth.companyId` → `403 FORBIDDEN_CROSS_COMPANY_ACCESS`.
- Backup downloads additionally verify `envelope.manifest.sourceCompany.companyId === req.auth.companyId` before streaming.
- Sensitive mutations (`restore-in-place`, `merge-execute`, `DELETE /:backupId`, `factory-reset`) require **both** valid `requireAuth` session (with Owner capability) **and** strict `verifyCompanyOwnerReauth` (with `local-owner-bypass` and `unassigned-operator` backdoors removed).

### 4.6 Credential-Safe Audit Logging
- Standardize security audit events via `appendPlatformAuditLog` + structured JSON `console.info`/`console.warn` (ingested automatically by Cloud Logging within the 50 GiB free tier):
  - Events: `AUTH_LOGIN_SUCCESS`, `AUTH_LOGIN_FAILURE`, `AUTH_FIREBASE_VERIFIED`, `FIREBASE_IDENTITY_LINKED`, `AUTH_TOKEN_REJECTED`, `AUTHZ_DENIED_CAPABILITY`, `AUTHZ_DENIED_CROSS_COMPANY`, `AUTHZ_DENIED_BRANCH`, `BACKUP_LISTED`, `BACKUP_DOWNLOADED`, `BACKUP_RESTORE_ATTEMPTED`.
  - Redaction rule: Explicitly whitelist safe fields (`companyId`, `userId`, `authMethod`, `route`, `method`, `statusCode`, `errorCode`, `ip`, `deviceId`); **strip/never log** `authorization`, `x-session-token`, `x-owner-password`, `password`, `pin`, `decryptionPassword`, `encryptionPassword`, `ticket`, or raw tokens.

---

## 5. Phased Implementation Sequence (Within Phase A)

| Step | Work Package | Files Affected | Dependencies |
|---|---|---|---|
| **A1** | Secret Loader & `firebase-admin` Setup | `package.json`, `src/server/jwt-secret.ts` (new), `src/server/firebase-admin.ts` (new), `.env.example` | Install `firebase-admin` |
| **A2** | Unified AuthN/AuthZ Middleware & Audit Helper | `src/server/auth-middleware.ts` (new), `src/server/release-onboarding.service.ts` | A1 |
| **A3** | Harden Core Routes & Sync Tenant Isolation | `server.ts`, `src/server/shared-store-sync.ts`, `src/server/lan-sync.service.ts` | A2 |
| **A4** | Harden Backup & Restore Ownership & Re-Auth | `src/server/backup-restore.service.ts` | A2 |
| **A5** | Harden Analytics, Intelligence & Unmet Demand Tenant Isolation | `src/analytics/analytics.routes.ts`, `src/analytics/analytics.repository.ts`, `src/analytics/intelligence.lifecycle.ts` | A2 |
| **A6** | Coordinated Frontend Auth Migration (`Bearer` + SSE Ticket + 401 Recovery) | `src/lib/auth-fetch.ts` (new), `src/services/api.ts`, 8 frontend domain/component files | A2–A5 |
| **A7** | Automated Security, Regression & Compatibility Test Suite | New `src/server/__tests__/phase-a-security.test.ts` + updating existing tests that previously passed `x-user-id` | A1–A6 |

---

## 6. Deployment Prerequisites (Scenario B — `europe-west2`)

1. **Google Secret Manager:** Create secret `session-jwt-secret` in `artful-port-r71nt` (64-byte random hex) and grant `roles/secretmanager.secretAccessor` to the Cloud Run runtime service account.
2. **Firebase Admin IAM (Optional for Revocation Checks):** Verify whether `artful-port-r71nt` is a user-owned standard GCP project (already confirmed as user's GCP project for Scenario B) and grant `roles/firebaseauth.viewer` to the Cloud Run runtime service account so `FIREBASE_CHECK_REVOKED=true` can detect revoked/disabled Firebase users.
3. **Coordinated Client/Server Rollout:** Web frontend and Express backend are served together from the same Cloud Run revision; **Android APK / Windows EXE** users must receive an updated build carrying `authenticatedFetch()` and SSE stream-ticket support before `x-user-id` is rejected on the production Cloud Run URL.
4. **CORS Configuration:** Set `ALLOWED_ORIGINS` for production Cloud Run origins (`https://...run.app`, `https://localhost`, `capacitor://localhost`) while keeping local Wi-Fi LAN mode supported when running on Windows desktop.

---

## 7. Open Questions & Blockers Requiring Human Decision Before Execution

1. **Git Repository Synchronization:** Because the AI Studio container workspace has no `.git` directory, confirm whether Phase A edits should be applied directly here for export/sync back to GitHub (`ANDROID-POS-01`), or synced to a specific branch first.
2. **Android / Windows Desktop Offline Terminals Upgrade Timing:** Are there any active Android APK or Windows EXE installs currently pointing at the cloud backend that still send `x-user-id` without `Authorization: Bearer`? (If yes, coordinate APK/EXE release alongside Cloud Run deployment.)
3. **Firebase Revocation Check (`FIREBASE_CHECK_REVOKED`):** Confirm that the Cloud Run production runtime Service Account in `artful-port-r71nt` can be granted `roles/firebaseauth.viewer` (enabling `verifyIdToken(token, true)`). In the AI Studio preview container (`ais-sandbox@ais-europe-west2-d9f776ab02104.iam.gserviceaccount.com`), `verifyIdToken(token, false)` works immediately with zero IAM grants.
4. **Practice Mode Policy on Public Cloud SaaS:** Confirm whether `GET/POST /api/onboarding/practice/*` should remain publicly accessible for prospective pilot trials, or require authentication on the multi-tenant production deployment.
5. **Local Desktop (`comp-clean-store`) Fallback Policy:** Confirm that in SaaS Cloud mode (`NODE_ENV=production` / Cloud Run), local-only `'unassigned-operator'` / `'comp-clean-store'` unauthenticated fallbacks are strictly disabled (returning `401`).
