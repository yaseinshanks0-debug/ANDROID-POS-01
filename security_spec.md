# Dqnamo POS — Firestore Security Specification (`security_spec.md`)

## 1. Data Invariants & Master Source of Truth
1. **Strict Zero-Trust Default Deny**: Every path not explicitly matched is rejected (`allow read, write: if false;`).
2. **Verified Identity & PII Isolation (`/users/{userId}`)**:
   - Only a signed-in user with `request.auth.token.email_verified == true` and `request.auth.uid == userId` (or a verified Admin) can read or write `/users/{userId}`.
   - Document `uid` MUST equal `userId` and `request.auth.uid`.
   - `createdAt` and `uid` are immutable on `update`.
3. **Workspace Ownership (`/cloudWorkspaces/{workspaceId}`)**:
   - A `CloudStoreSnapshot` document can only be created if `incoming().ownerId == request.auth.uid`, `isVerifiedUser()`, and all schema keys, types, and length boundaries pass `isValidCloudStoreSnapshot(incoming())`.
   - `ownerId`, `companyId`, and `createdAt` are immortal (immutable) on `update`.
   - `allow list` strictly enforces `resource.data.ownerId == request.auth.uid` so clients cannot scrape workspaces belonging to other users.
4. **Subcollection Master Gate (`/cloudWorkspaces/{workspaceId}/syncEvents/{eventId}`)**:
   - Every access to `syncEvents` verifies parent workspace ownership via `get(/databases/$(database)/documents/cloudWorkspaces/$(workspaceId)).data.ownerId == request.auth.uid` (`exists()` + `get()` Master Gate).
   - Sync events are append-only (`allow update: if false;`).

---

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Payload 1 (Identity Spoofing on User Create)**: Authenticated user `uid_attacker` creates `/users/uid_victim` with `uid: "uid_victim"`. -> `PERMISSION_DENIED`.
2. **Payload 2 (Unverified Email Spoof)**: User with `email: "yaseinshanks0@gmail.com"` but `email_verified: false` attempts admin read/write. -> `PERMISSION_DENIED`.
3. **Payload 3 (Shadow Field Injection on User Update)**: Owner updates `/users/uid_1` adding ghost field `isAdmin: true`. -> `PERMISSION_DENIED` via `hasOnly()`.
4. **Payload 4 (PII Blanket Read)**: Authenticated user `uid_attacker` attempts `get` on `/users/uid_victim`. -> `PERMISSION_DENIED`.
5. **Payload 5 (ID Poisoning / Oversized Path ID)**: Creating `/cloudWorkspaces/<200-char-invalid-id$!>` -> `PERMISSION_DENIED` via `isValidId()`.
6. **Payload 6 (Workspace Owner Spoofing on Create)**: User `uid_1` creates `/cloudWorkspaces/ws_1` with `ownerId: "uid_2"`. -> `PERMISSION_DENIED`.
7. **Payload 7 (Immortal Field Mutation on Workspace Update)**: Owner attempts to change `ownerId` or `createdAt` on `/cloudWorkspaces/ws_1`. -> `PERMISSION_DENIED`.
8. **Payload 8 (Client Timestamp Forgery)**: Creating `/cloudWorkspaces/ws_1` with a past/future `createdAt` instead of `request.time`. -> `PERMISSION_DENIED`.
9. **Payload 9 (Value Poisoning on Whitelisted Key)**: Updating `companyName` on `/cloudWorkspaces/ws_1` with a 5,000-character string or a boolean. -> `PERMISSION_DENIED` via `isValidCloudStoreSnapshot(incoming())`.
10. **Payload 10 (Unauthorized List Scraping)**: Listing `/cloudWorkspaces` without filtering `ownerId == request.auth.uid`. -> `PERMISSION_DENIED`.
11. **Payload 11 (Orphaned Subcollection Write)**: Creating `/cloudWorkspaces/non_existent_ws/syncEvents/ev_1` where parent workspace does not exist or belongs to another user. -> `PERMISSION_DENIED` via Master Gate `exists()` + `get()`.
12. **Payload 12 (Immutable Audit Log Tampering)**: Attempting to `update` an existing `/cloudWorkspaces/ws_1/syncEvents/ev_1` document. -> `PERMISSION_DENIED`.

---

## 3. Red Team Conflict & Audit Report
- **Identity Spoofing**: Blocked on all collections via `incoming().uid == request.auth.uid` and `incoming().ownerId == request.auth.uid`.
- **Shadow Update Test**: Blocked via strict `data.keys().hasAll(...) && data.keys().hasOnly(...)` in every validation helper plus `affectedKeys().hasOnly(...)` in every update branch.
- **Email Spoofing Test**: Blocked via mandatory `request.auth.token.email_verified == true` check in `isVerifiedUser()` and `isAdmin()`.
- **PII Blanket Test**: Blocked on `/users/{userId}` where `get` and `list` require `request.auth.uid == userId || isAdmin()`.
- **Query Trust Test**: Blocked on `/cloudWorkspaces` and `/syncEvents` where `allow list` explicitly checks `resource.data.ownerId == request.auth.uid`.
- **Value Poisoning Test**: Blocked because `isValidUserProfile(incoming())` and `isValidCloudStoreSnapshot(incoming())` wrap the entire `allow update` expression before any action branch.
