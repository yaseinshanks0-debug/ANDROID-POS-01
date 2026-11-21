# Design Spec: Email Authentication, Password Recovery & Company Invitations (Option B — Hybrid SaaS)

**Project:** `ANDROID-POS-01` (Dqnamo POS)  
**Date:** 2026-11-21  
**Status:** Draft — Awaiting User Approval  
**Approved Architecture:** Option B (Firebase Auth for Email/Password & Password Recovery + Express/PostgreSQL Backend for Multi-Tenant Companies, Invitations & Sync; Offline PIN + LAN Wi-Fi Sync preserved)  
**Approved Invite Delivery:** Mode 1 — Secure Invite Link + Short Code (`DQ-XXXX-XX`) + QR Code with Instant Share (WhatsApp / Mail App / Copy)

---

## 1. Intent & Why

When installing Dqnamo POS on Android and creating a new company, authentication currently relies on local username/password + PIN credentials with no email identity or password recovery flow. If a company owner forgets their password on a standalone Android device, they are locked out unless they wipe local data. In addition, adding cashiers or branch managers to an existing company across devices requires manual local setup or LAN pairing instead of a clean company-scoped invitation workflow.

This design introduces:
1. **Email-based Owner Account Creation & Sign-In** powered by Firebase Authentication (`Email/Password`), working natively inside Capacitor Android without browser popup issues.
2. **Self-Service Email Password Recovery** (`sendPasswordResetEmail`) so any owner or staff member can reset a forgotten password and regain access to their company from any device.
3. **Company-Scoped Staff Invitations** managed authoritatively by the Express + PostgreSQL backend, delivered via a **secure invite link + short code + QR code** shareable via WhatsApp, the device's mail app, or clipboard copy.
4. **Full Offline & Real-Time Sync Continuity** — keeping fast local PIN shift-unlock for offline checkout and preserving local Wi-Fi LAN sync alongside cloud sync.

---

## 2. Goals, Non-Goals & Anti-Goals

### Goals
- Allow creating a new company with an email-backed owner account (Firebase Auth + PostgreSQL company/branch/owner binding).
- Provide a reliable **"Forgot Password?"** flow on Web and Android using Firebase Auth email reset.
- Enable company Owners/Admins to invite employees to a specific company, branch, and role via a single-use, time-limited (48h) invite link, short code, and QR code.
- Allow existing local-only owners (installed offline or prior to this feature) to **link an email address** for password recovery without losing local company data.
- Preserve fast offline checkout using a locally verified salted PIN after initial email enrollment on a device.
- Align 100% with `docs/PHASE_A_IMPLEMENTATION_PLAN.md` (`firebase-admin` token verification, server-derived `companyId`, zero `x-user-id` impersonation).

### Non-Goals
- Sending custom transactional invitation emails directly from the Express backend via Resend/SMTP (deferred to a future enhancement; Mode 1 uses shareable link/code/QR + WhatsApp/Mail/Copy).
- Modifying sales calculation, tax, SDG currency precision, FIFO/WAC inventory costing, double-entry accounting, or analytics formulas.
- Replacing or removing local Wi-Fi LAN sync (`LAN Sync`) or Practice Mode.
- Full multi-company membership switching for a single user across 2+ companies in v1 (one active company per `users` row in v1; schema stays forward-compatible with a future `company_memberships` join table).

### Anti-Goals (Must Never Happen)
- **Never assume `firebaseUid === users.id`.** POS internal user IDs remain independent; `firebaseUid` is stored as a dedicated linked identity column.
- **Never allow invite hijacking.** Forwarding an invite link or short code to a different email address must fail cleanly if the authenticated Firebase email does not match `invited_email`.
- **Never block offline sales.** Losing internet connectivity mid-shift must never log out a cashier or prevent PIN unlock on an already-enrolled terminal.
- **Never wipe pending offline transactions/outbox** when a user resets their password or links their email.
- **Never run destructive database migrations** or modify existing company/financial rows.

---

## 3. Constraints & Prerequisites

1. **Firebase Console Prerequisite (One-Time Setup):** Enable **Email/Password** sign-in under Firebase Console → Project `artful-port-r71nt` → Authentication → Sign-in method → Email/Password (currently only Google Sign-In is enabled by default).
2. **Backend Token Verification (`firebase-admin`):** Install `firebase-admin` on the backend and verify incoming Firebase ID tokens via `getAuth(app).verifyIdToken(idToken)` (zero IAM needed for signature/claim verification; optional `FIREBASE_CHECK_REVOKED=true` on Cloud Run once `roles/firebaseauth.viewer` is granted).
3. **Android WebView Compatibility (Capacitor 8):** Email/Password (`createUserWithEmailAndPassword`, `signInWithEmailAndPassword`, `sendPasswordResetEmail`) runs over standard HTTPS XHR inside Capacitor Android WebView with no popup blockers or redirect URI failures.
4. **PostgreSQL + Local JSON Fallback Parity:** Additive changes must work in both PostgreSQL (Drizzle ORM) and the server's local JSON fallback store (`release-onboarding.service.ts`) so local/preview environments work identically.
5. **Bilingual RTL/LTR:** All new screens, error messages, and share text templates must support Arabic (RTL) and English (LTR).

---

## 4. Approaches Considered & Selected

| Approach | Summary | Trade-offs | Decision |
|---|---|---|---|
| **Option A — Firebase Only (Auth + Firestore)** | Email/Password + `sendPasswordResetEmail` in Firebase Auth; shared company docs & invitations in Firestore. | Fast to ship without a backend server, but constrained by Firestore's 1 MiB document snapshot limit and requires rewriting single-owner Firestore rules. | Rejected for primary SaaS path |
| **Option B — Hybrid SaaS (Firebase Auth + Express/PostgreSQL)** | Firebase Auth handles Email/Password identity, email verification, and password recovery emails for free; Express + PostgreSQL authoritatively manages companies, roles, branches, invitations, and sync. Offline PIN + LAN Sync remain intact. | Requires the Express backend (`Cloud Run`) to be reachable for signup/login/invite acceptance; aligns 100% with Phase A SaaS architecture and avoids SMTP setup for password reset. | **Selected** |
| **Option C — Express/PostgreSQL Only + Custom SMTP/Resend** | Backend manages passwords, reset tokens, and email delivery via Resend/SMTP. | Full control, but requires custom domain DNS (`SPF/DKIM`), paid/configured email provider, and building password-reset security from scratch. | Rejected |

**Invite Delivery Decision:** **Mode 1** — Generate a high-entropy **invite link + human-friendly short code (`DQ-XXXX-XX`) + inline QR code**, with one-tap share buttons for **WhatsApp**, **Device Mail App (`mailto:`)**, and **Copy**. Zero SMTP dependency, works immediately on Android and Web. (Server-side Resend/SMTP auto-email can be added additively later without changing the invitation schema.)

---

## 5. System Architecture & Flows

### 5.1 Additive Data Model (PostgreSQL / Drizzle)

All schema changes are strictly **additive and backward-compatible**:

1. **Columns added to `users` (`src/db/schema.ts`):**
   - `firebaseUid: text('firebase_uid').unique()` — nullable until user links/creates Firebase identity.
   - `emailVerified: boolean('email_verified').default(false).notNull()` — mirrors verified claim from Firebase ID token.
   - Index: `users_email_idx` on `email` (case-insensitive lookups normalized to lowercase in service layer).

2. **New table `company_invitations` (`src/db/schema.ts`):**
   - `id: text('id').primaryKey()` (`inv_<uuid>`)
   - `companyId: text('company_id').references(() => companies.id, { onDelete: 'cascade' }).notNull()`
   - `branchId: text('branch_id').references(() => branches.id)` (nullable; defaults to company's main branch)
   - `roleId: text('role_id').references(() => roles.id).notNull()`
   - `invitedEmail: text('invited_email').notNull()` (stored trimmed + lowercased)
   - `invitedName: text('invited_name')` (optional pre-filled display name)
   - `tokenHash: text('token_hash').notNull().unique()` (SHA-256 hex digest of 32-byte random `base64url` token; raw token is never persisted)
   - `shortCode: text('short_code').notNull().unique()` (format `DQ-XXXX-XX` using Crockford-like unambiguous charset `23456789ABCDEFGHJKMNPQRSTUVWXYZ`, no `0/O/1/I/L`)
   - `status: text('status').default('PENDING').notNull()` — check constraint `IN ('PENDING', 'ACCEPTED', 'REVOKED', 'EXPIRED')`
   - `invitedByUserId: text('invited_by_user_id').references(() => users.id).notNull()`
   - `acceptedByUserId: text('accepted_by_user_id').references(() => users.id)`
   - `expiresAt: timestamp('expires_at').notNull()` (default: `createdAt + 48 hours`)
   - `createdAt: timestamp('created_at').defaultNow().notNull()`
   - `acceptedAt: timestamp('accepted_at')`
   - `revokedAt: timestamp('revoked_at')`
   - Indexes: `(companyId, status)`, `(invitedEmail, status)`, unique `tokenHash`, unique `shortCode`.

### 5.2 Backend API Contracts (`Express`)

All protected routes enforce `requireAuth` (verifying either POS Session JWT or Firebase ID Token) and derive `companyId` strictly from the authenticated actor.

| Method & Path | Auth | Purpose & Key Rules |
|---|---|---|
| `POST /api/auth/firebase-exchange` | Public (rate-limited) + `Authorization: Bearer <Firebase ID Token>` | Verifies Firebase ID token via `firebase-admin`. Looks up `users` by `firebaseUid`. If not yet linked, returns `{ status: 'UNBOUND', email, emailVerified }` (does **not** auto-link an unverified email to prevent account takeover; requires explicit linking or invite acceptance). When matched to an active user, issues a POS session JWT + returns `{ sessionToken, user, company, permissions }`. |
| `POST /api/auth/link-firebase-email` | Authenticated POS session + `firebaseIdToken` in body | Allows an existing local-only owner/user to bind their Firebase email account to their existing POS user record so they gain cloud password recovery without losing local data. Rejects if `firebaseUid` is already bound to another user. |
| `POST /api/onboarding/companies` | Public only when 0 prod companies exist, OR authenticated with valid `Authorization: Bearer <Firebase ID Token>` | Extended to accept optional/preferred `Authorization: Bearer <Firebase ID Token>`. Atomically creates `company`, main `branch`, default `roles`, and `COMPANY_OWNER` user linked to `firebaseUid` + `email` + optional `pinHash`, returning a POS session JWT. |
| `POST /api/invitations` | `requireAuth` + `users.manage` (Owner/Admin) | Validates `email`, `roleId` (cannot escalate above caller's role; cannot invite another `COMPANY_OWNER` unless caller is `COMPANY_OWNER`), and `branchId` (must belong to `actor.companyId`). Revokes any prior `PENDING` invite for the same `(companyId, email)` to avoid duplicate active invites. Generates raw token + `shortCode`, stores only `tokenHash`, writes an audit log entry, and returns `{ invitation, inviteUrl, shortCode, expiresAt }`. |
| `GET /api/invitations` | `requireAuth` + `users.manage` | Lists invitations scoped strictly to `actor.companyId` (marking past-due `PENDING` invites as `EXPIRED` on read). Never returns `tokenHash`. |
| `POST /api/invitations/:id/revoke` | `requireAuth` + `users.manage` | Sets `status = 'REVOKED'` and `revokedAt = now()` for `id` strictly within `actor.companyId`, with audit log entry. |
| `POST /api/invitations/preview` | Public (strictly rate-limited) | Accepts `{ token }` or `{ shortCode }`. Returns non-sensitive preview only: `{ valid, status, companyName, branchName, roleName, maskedEmail, expiresAt }`. Never exposes full email, user list, or internal IDs. |
| `POST /api/invitations/accept` | `Authorization: Bearer <Firebase ID Token>` (rate-limited) | Accepts `{ token?, shortCode?, displayName?, pin? }`. Verifies token/code hash, checks `status === 'PENDING'` and `expiresAt > now()`. Enforces strict case-insensitive equality `firebaseEmail === invitation.invitedEmail`. Atomically inside a transaction (`WHERE status = 'PENDING'`): marks invite `ACCEPTED`, creates the company `users` record bound to `firebaseUid` + `roleId` + `branchId` + optional salted `pinHash`, writes an audit log entry, and returns `{ sessionToken, user, company, permissions }`. |

### 5.3 User Flows (Web & Android)

#### Flow 1 — Create New Company with Email (Owner)
1. Owner opens **New Company Setup** (`FirstRunOnboardingModal` or "Create Owner" tab on `LoginScreen`).
2. Enters **Company Name**, **Owner Full Name**, **Email**, **Password** (min 8 chars, letters + digits), and optional **Quick Offline PIN (4–6 digits)**.
3. Client calls Firebase `createUserWithEmailAndPassword(auth, email, password)` (or signs in if the email already exists in Firebase and has no company yet) and triggers `sendEmailVerification(user)`.
4. Client obtains `idToken = await user.getIdToken()` and calls `POST /api/onboarding/companies` with `Authorization: Bearer <idToken>`.
5. Server atomically provisions the company, main branch, and owner user, returning a POS session JWT.
6. Client caches the user profile + salted PIN hash locally so the device immediately supports offline shift unlock and checkout.
7. **Offline-first fallback (Builder Call):** If the Android device has zero internet during first-run setup, the user can still choose *"Continue Offline (Link Email Later)"* — a non-intrusive reminder banner in Settings prompts them to link their email once online to enable password recovery.

#### Flow 2 — Forgot Password (Owner or Staff)
1. On `LoginScreen`, user taps **"نسيت كلمة المرور؟" / "Forgot Password?"**.
2. Enters their email address and submits.
3. Client calls Firebase `sendPasswordResetEmail(auth, email)`.
4. UI displays a clear bilingual confirmation (*"If an account exists for this email, a password reset link has been sent. Check your inbox or spam folder."*) — preventing email enumeration.
5. User clicks the Firebase link in their inbox, sets a new password, returns to Dqnamo POS, signs in with Email + New Password → `POST /api/auth/firebase-exchange` → company workspace and synced data restore automatically.

#### Flow 3 — Invite Staff to the Same Company (Owner/Admin → Employee)
1. Owner/Admin opens **Settings → Users & Permissions → "دعوة موظف" (Invite Member)**.
2. Enters **Employee Email**, **Role** (`Cashier`, `Branch Manager`, `Inventory Clerk`, `Admin`), **Branch**, and optional **Display Name**.
3. Backend returns `inviteUrl` (e.g. `https://<app-host>/?invite=<rawToken>`), `shortCode` (e.g. `DQ-7K4M-9P`), and `expiresAt`.
4. UI displays a crisp **Invite Share Card** containing:
   - The **Short Code** (`DQ-7K4M-9P`) in large monospace lettering.
   - An inline **QR Code** (generated locally on client — zero external QR image API calls so the token never leaks to third parties!).
   - One-tap actions: **Share via WhatsApp**, **Open Mail App (`mailto:`)**, **Native Share (Capacitor/Web Share API)**, and **Copy Invite**.
5. Employee installs Dqnamo POS on Android (or opens the web link):
   - **Via Web/Deep Link:** Opening `/?invite=<token>` automatically opens the **Accept Company Invite** screen.
   - **Via Android App Directly:** Taps **"لدي كود دعوة" (Join with Invite Code)** on `LoginScreen`, types/pastes `DQ-7K4M-9P` (or scans the QR code with the existing camera scanner!).
6. App calls `POST /api/invitations/preview` and shows: *"You've been invited to join **[Company Name]** as **[Role]** — please sign in or create an account using **`a***@domain.com`**."*
7. Employee creates a password (new Firebase user) or signs in (existing Firebase user) with that exact email + sets an optional **Quick Offline PIN**.
8. Client calls `POST /api/invitations/accept` with `Authorization: Bearer <Firebase ID Token>` → employee immediately lands inside the company's POS workspace with their exact role permissions and synced catalog!

#### Flow 4 — Daily Offline Operation & Sync Continuity
- **Online:** POS uses verified session JWT (refreshed transparently via Firebase ID token when needed) for API calls and cloud sync.
- **Offline:** Cashier unlocks their terminal via their locally enrolled **Quick PIN**; sales write to local SQLite/IndexedDB outbox and sync via **LAN Wi-Fi Sync** inside the shop or automatically to the cloud backend once internet returns.
- **Deactivation / Revocation:** When an Admin deactivates a user in PostgreSQL (`isActive = false`), all server sessions for that user are revoked immediately and subsequent API/exchange calls return `403 USER_ACCOUNT_DEACTIVATED`.

---

## 6. Security Safeguards

- **Server-Authoritative Tenant Scope:** `companyId` is resolved exclusively from the authenticated user record on the server — never trusted from client query/headers.
- **No Raw Invite Tokens Stored:** Only SHA-256 `tokenHash` is stored in PostgreSQL; raw token is returned once on creation.
- **Strict Email Match on Acceptance:** Prevents forwarded links/codes from being claimed by an unintended account.
- **Single-Use Atomic Acceptance:** Conditional DB update (`WHERE status = 'PENDING' AND expires_at > NOW()`) prevents double-acceptance race conditions.
- **Rate Limiting & Anti-Enumeration:** `authRateLimiter` applied to `/api/auth/firebase-exchange`, `/api/invitations/preview`, and `/api/invitations/accept`; password reset and preview responses avoid disclosing whether arbitrary emails exist.
- **Local QR Generation:** QR code is rendered locally in the browser/WebView so invite tokens are never sent to external third-party QR services.
- **Role Escalation Prevention:** Invitees can never be granted a role higher than the inviter's authority, and invitations are strictly scoped to branches owned by `actor.companyId`.

---

## 7. Builder Calls & Items Left to Implementation Planning

### Calls Made in This Design (Please Review & Correct If Needed)
1. **Invite Expiration Window:** Default **48 hours** (re-issuing a new invite for the same email automatically revokes the older pending one).
2. **Short Code Format:** `DQ-XXXX-XX` (6 unambiguous alphanumeric characters after `DQ-`, valid only when paired with matching `invitedEmail` + Firebase auth, protected by strict rate limiting).
3. **Offline First-Run Escape Hatch:** Keep an explicit *"Continue Offline (Link Email Later)"* option during initial install if the Android device has no internet, paired with a Settings prompt to link an email once online.
4. **Email Verification Enforcement:** Trigger `sendEmailVerification` on signup and track `emailVerified`, while allowing immediate onboarding of the newly created company so a new merchant isn't blocked from starting work; require verified email before auto-linking a pre-existing unlinked legacy account to prevent account takeover.
5. **No Automatic Transactional Email in v1:** Deliver invitations via Link + Short Code + QR + WhatsApp/Mail/Copy (Mode 1); keep the service layer structured so a Resend/SMTP adapter can be plugged in later without schema changes.

### Left to the Implementation Plan (`writing-plans`)
- Exact Drizzle migration SQL and rollback script for `users` (`firebase_uid`, `email_verified`) and `company_invitations`.
- Exact file-by-file change list across `src/lib/firebase.ts`, `src/server/firebase-admin.ts`, `src/server/invitations.service.ts`, `src/components/auth/LoginScreen.tsx`, `src/components/onboarding/FirstRunOnboardingModal.tsx`, and `src/components/settings/UsersPermissionsSection.tsx`.
- Automated unit & integration test suite covering: token verification, invite creation/preview/accept/revoke/expiry, email mismatch rejection, double-accept race safety, role escalation blocking, and offline PIN continuity.
- Step-by-step guide for enabling **Email/Password** in Firebase Console (`artful-port-r71nt`) and configuring Android deep-link intent filter if desired.
