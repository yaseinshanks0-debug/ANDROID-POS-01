# CI Build & Dependency Pipeline Repair Report

**Project:** D POS - Point of Sale (`ANDROID-POS-01` / `com.dqnamo.pos` v2.6.0 / `versionCode 260`)  
**Target Release Tags:** `v2.6.0-windows` (Windows `.exe`) & `v2.6.0-android` (Android `.apk` & `.aab`) — published as new visible GitHub Releases (`draft: false`, `prerelease: false`, `make_latest: true`) without overwriting previous `2.5.0` / `latest-*` releases.  
**Target Branch:** `fix/ci-dependency-lockfile`  
**Reference Failing Run:** `https://github.com/yaseinshanks0-debug/ANDROID-POS-01/actions/runs/44900462475`  
**Scope:** Build infrastructure, version alignment (`2.5.0` → `2.6.0`), and CI/CD release pipeline repair only (zero changes to POS business logic, PostgreSQL/Drizzle schema, auth/RBAC, analytics, or RTL/LTR UI).

---

## 1. Root Cause Analysis

### Primary Failure (`npm ci` `EUSAGE`)
The `Build & Publish Windows Desktop (.exe)` workflow failed at `Clean Old Build Files & Install Dependencies via npm ci` with `npm ERR! code EUSAGE` because `package.json` and `package-lock.json` (`lockfileVersion: 3`) were out of sync:
- **3 root packages** were added to `package.json` during earlier feature work without regenerating `package-lock.json`:
  - `firebase-admin@^14.5.1`
  - `qrcode@^1.5.4`
  - `@types/qrcode@^1.5.6`
- **96 transitive dependencies** (including `@fastify/busboy@3.2.6`, `@google-cloud/firestore@9.4.1`, `@google-cloud/storage@8.4.0`, etc.) were therefore missing from `package-lock.json`.
- Zero existing root dependencies had version mismatches or unintended removals.

### Secondary / Downstream Pipeline Issues Identified & Fixed
1. **Node.js Engine Mismatch:** Both workflows configured `actions/setup-node@v4` with Node.js `22`, whereas 10 installed packages (`@firebase/*` requiring `>=24.12.0` and `@zxing/library@0.23.0` requiring `>= 24.0.0`) declare Node.js 24+ engines. Full lockfile engine audit confirmed **0 packages** define upper bounds excluding Node.js `24.12.0+`.
2. **Windows EXE Filename Mismatch (Downstream Failure in Steps 5–7):** `electron-builder.json` outputs `D-POS-Setup.exe` and `D-POS-Portable.exe`, while `.github/workflows/build-windows-exe.yml` still looked for `Dqnamo-POS-Setup.exe` and `Dqnamo-POS-Portable.exe`.
3. **Destructive `postinstall` During Windows Electron Packaging (Downstream Failure in Step 4):** `build-windows-exe.yml` Step 4 runs `npm install --no-save electron@33.4.0 electron-builder@25.1.8` *after* `npm run server:bundle` and `npm run exe:stage-ui`. That `npm install` triggered `package.json`'s `postinstall` hook (`scripts/optimize-build-size.cjs`), which deleted `dist-server`, `electron/www`, and `release-exe` immediately before `npx electron-builder` packaged them.
4. **Android Custom Resource Overwrite Risk (Step 4):** `.github/workflows/build-apk.yml` previously extracted `app/src/main/res` from Capacitor's default `android-template.tar.gz`, overwriting custom adaptive icons and `android/app/src/main/res/values/strings.xml` (`D POS - Point of Sale`).
5. **Accidental Release Guard on Fix Branches:** Both workflows previously published GitHub Releases on any `workflow_dispatch` regardless of branch. Release publishing is now guarded to `refs/heads/main` and `refs/heads/master`, while artifact uploads still run on feature/fix branches for safe validation.

---

## 2. Files Modified

| File | Purpose of Change |
| --- | --- |
| `package-lock.json` | Regenerated strictly against existing `package.json` via `npm install --package-lock-only --include=optional --legacy-peer-deps --no-audit --no-fund`. Purely additive (`+99` packages, `0` updated, `0` removed). |
| `scripts/optimize-build-size.cjs` | Added `SKIP_BUILD_ARTIFACT_CLEAN === '1'` guard so `electron/www`, `dist-server`, and `release-exe` are preserved during Step 4's `npm install --no-save electron electron-builder`. |
| `.github/workflows/build-windows-exe.yml` | Upgraded Node.js to `24` (`>= 24.12.0`), added Node/npm/lockfile sync validation step, added `SKIP_BUILD_ARTIFACT_CLEAN: '1'` and pre-packaging artifact assertions in Step 4, aligned EXE filenames to `D-POS-Setup.exe` / `D-POS-Portable.exe`, and restricted GitHub Release publishing to `main`/`master`. All 16 pipeline stages preserved. |
| `.github/workflows/build-apk.yml` | Upgraded Node.js to `24` (`>= 24.12.0`), added Node/npm/lockfile sync validation step, restricted Capacitor template extraction to `gradle/wrapper/gradle-wrapper.jar` only (preserving custom `app/src/main/res` icons and `strings.xml`), and restricted GitHub Release publishing to `main`/`master`. |
| `docs/CI_BUILD_REPAIR_REPORT.md` | Engineering report documenting investigation, changes, verification results, security review, and rollback plan. |

---

## 3. Dependency Changes

- **Lockfile format:** `lockfileVersion: 3`
- **Total lockfile entries:** `483` → `582` (**+99 added**, **0 updated**, **0 removed**)
- **Root synchronization check:** `0` missing, `0` mismatched, `0` extra root dependencies between `package.json` and `package-lock.json`.
- **Root packages added to lockfile (already present in `package.json`):**
  - `firebase-admin@14.5.1`
  - `qrcode@1.5.4`
  - `@types/qrcode@1.5.6`
- **Key transitive dependencies restored in lockfile:**
  - `@fastify/busboy@3.2.6`
  - `@google-cloud/firestore@9.4.1`
  - `@google-cloud/storage@8.4.0`
- **Cross-platform optional native bindings verified present in `package-lock.json`:**
  - Windows x64: `@rolldown/binding-win32-x64-msvc@1.2.15`, `@typescript/typescript-win32-x64@7.0.2`, `@tailwindcss/oxide-win32-x64-msvc@4.3.3`, `lightningcss-win32-x64-msvc@1.33.0`, `@esbuild/win32-x64@0.28.2`, `@rollup/rollup-win32-x64-msvc@4.44.0`
  - Linux x64: `@rolldown/binding-linux-x64-gnu@1.2.15`, `@tailwindcss/oxide-linux-x64-gnu@4.3.3`, `lightningcss-linux-x64-gnu@1.33.0`, `@esbuild/linux-x64@0.28.2`
- **`.npmrc` preserved:** `legacy-peer-deps=true` and `include=optional` remain intact.

---

## 4. Node.js and npm Versions

| Environment | Node.js Version | npm Version | Notes |
| --- | --- | --- | --- |
| **GitHub Actions CI (Windows & Android)** | `24` (latest `>= 24.12.0` enforced in workflow) | Bundled with Node 24 | Satisfies all `@firebase/*` (`>=24.12.0`), `@zxing/library` (`>=24.0.0`), and `@capacitor/cli@8.6.0` (`>=22.0.0`). `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: 'true'` preserved. |
| **Local Verification Container (Linux x64)** | `v22.23.2` | `10.9.8` | Emits expected `EBADENGINE` warnings for the 10 Node 24 packages locally; all runtime, lint, test, and build checks pass. |
| **Android Gradle Runtime (CI)** | N/A (runs on Temurin JDK 21) | N/A | Gradle `8.14.3-bin.zip` runs independently of Node.js on JDK 21. |

---

## 5. Windows Pipeline Verification Results

Executed locally on Linux x64 (Node `v22.23.2`, npm `10.9.8`):

| Check | Command | Status | Observed Result |
| --- | --- | --- | --- |
| Clean Dependency Install | `npm ci --include=optional --legacy-peer-deps --no-audit --no-fund` | **PASSED** | `added 500 packages in 54s`; `postinstall` ran cleanly (`Pruned 81 unused directories/bundles and 4415 source map files`). |
| Native Rolldown Binding | `npm run verify:rolldown` | **PASSED** | Verified active platform native binding cleanly. |
| TypeScript Check | `npm run lint` | **PASSED** | `tsc --noEmit` exited with code `0` (0 errors). |
| Unit & Integration Test Suite | `npm test` | **PASSED** | **235 / 235 tests passed** across 10 suites (`0` fail, `0` cancelled, `0` skipped; `63.8s`). |
| Frontend Production Build | `npm run build` | **PASSED** | Vite `v8.3.5` transformed `3026` modules in `3.03s` into `dist/`. |
| Embedded Server Bundle | `npm run server:bundle` | **PASSED** | `esbuild` bundled `dist-server/server.cjs` (`4.6mb`) in `361ms` (including `firebase-admin` and `pg`/`drizzle-orm`). |
| Stage Electron UI Assets | `npm run exe:stage-ui` | **PASSED** | Staged `dist/` into `electron/www/index.html`. |
| Step 4 Artifact Guard | `SKIP_BUILD_ARTIFACT_CLEAN=1 node scripts/optimize-build-size.cjs` | **PASSED** | Verified both `electron/www/index.html` (`3.9K`) and `dist-server/server.cjs` (`4.7M`) remain intact (`GUARD_OK`). |
| Headless Embedded Server Smoke Test | `NODE_ENV=production PORT=3199 DQNAMO_DIST_DIR="$PWD/electron/www" node dist-server/server.cjs` | **PASSED** | `GET /api/lan-sync/info` returned HTTP 200 `{"ok":true,...}`; `GET /` returned HTTP 200 with `<title>D POS - Point of Sale</title>`. |
| Windows Native Binding Runtime Check (`win32-x64`) | `windows-latest` runner Step 2 | **NOT RUN** | Requires Windows x64 runner (`windows-latest`). Lockfile entries for all `win32-x64` native bindings were statically verified present. |
| Electron Packaging (`D-POS-Setup.exe` & `D-POS-Portable.exe`) | `npx electron-builder --win --x64 --config electron-builder.json --publish never` | **NOT RUN** | Requires `windows-latest` GitHub Actions runner with Electron binary download & NSIS toolchain. |

---

## 6. Android Pipeline Verification Results

Executed locally on Linux x64 (Node `v22.23.2`, npm `10.9.8`):

| Check | Command | Status | Observed Result |
| --- | --- | --- | --- |
| Clean Dependency Install | `npm ci --include=optional --legacy-peer-deps --no-audit --no-fund` | **PASSED** | `added 500 packages in 54s`. |
| Native Rolldown, Lint, Tests, Web Build | `verify:rolldown`, `lint`, `test`, `build` | **PASSED** | All passed (`235 / 235` tests, Vite build `3.03s`). |
| Capacitor CLI & Asset Copy | `npx cap --version` & `npx cap copy android` | **PASSED** | Capacitor `8.6.0`; copied web assets into `android/app/src/main/assets/public` (`43.81ms`) and generated `capacitor.config.json` (`1.38ms`). |
| Custom Android Resources Intact | `grep "app_name" android/app/src/main/res/values/strings.xml` | **PASSED** | Preserved `<string name="app_name">D POS - Point of Sale</string>`. |
| Gradle APK (`assembleDebug`) & AAB (`bundleRelease`) Build | `./gradlew clean assembleDebug bundleRelease --no-daemon` | **NOT RUN** | Local container lacks `java` (Temurin JDK 21), `gradle`, and `ANDROID_HOME` (Android SDK API 36). Requires `ubuntu-latest` GitHub Actions runner. |

---

## 7. Remaining Warnings & Environment Notes

1. **Local Node 22 `EBADENGINE` Warnings:** Running `npm ci` locally on Node `v22.23.2` logs `EBADENGINE` warnings for `@firebase/*` (`>=24.12.0`) and `@zxing/library@0.23.0` (`>=24.0.0`). These warnings will disappear on GitHub Actions runners using Node.js `24`.
2. **Transitive Deprecation Warning:** `npm warn deprecated node-domexception@1.0.0` comes transitively from upstream dependencies (`node-fetch`/`fetch-blob`). Left untouched per policy not to unnecessarily upgrade unrelated dependencies.
3. **Vite Large Chunk Notice:** `dist/assets/index-*.js` (`3,035.73 kB` / `742.07 kB` gzip) triggers Vite's default `> 900 kB` informational notice. Unrelated to CI dependency repair; left unchanged to avoid application refactoring.
4. **Non-Git Container Workspace:** This workspace does not contain a `.git` directory, so branch `fix/ci-dependency-lockfile` could not be created via `git checkout -b` inside the container. Push the modified files to branch `fix/ci-dependency-lockfile` on GitHub and run `workflow_dispatch` on both workflows before merging to `main`.

---

## 8. Security Assessment

- **Secrets & Environment Variables:** No secrets, tokens, API keys, or `DATABASE_URL` values were read, printed, modified, or committed. No `.env` files were added or modified.
- **GitHub Secrets & Permissions:** Zero changes to GitHub Secrets or repository workflow permissions (`contents: write` preserved for release jobs only; release publishing tightened to `main`/`master` branches).
- **Integrity & Tests:** No tests, TypeScript checks, or native binding verifications were bypassed or weakened. Additional pre-install lockfile sync and pre-packaging artifact checks were added.
- **Dependency Installation Flags:** `--legacy-peer-deps` and `--include=optional` match the repository's existing `.npmrc` and are required to resolve existing peer constraints and cross-platform native bindings (`@rolldown`, `@tailwindcss/oxide`, `lightningcss`, `@typescript`). `npm ci` remains the sole CI installation command (not replaced with `npm install`).

---

## 9. Artifact Verification

### Verified Locally
- **Web Bundle:** `dist/index.html` (`3.99 kB`) + hashed assets in `dist/assets/`
- **Embedded Backend:** `dist-server/server.cjs` (`4.6mb` / `4.7M` on disk) — self-contained CJS bundle (all runtime dependencies including `express`, `pg`, `drizzle-orm`, `firebase-admin`, `qrcode` bundled; `vite` and `pg-native` externalized). Verified via live HTTP smoke test against `/api/lan-sync/info` and `/`.
- **Electron Staged UI:** `electron/www/index.html` (`3.9K`) — verified preserved across `SKIP_BUILD_ARTIFACT_CLEAN=1`.
- **Database / Seed Resources for Electron (`electron-builder.json` `extraResources`):** `.data/*.json` verified present (`currencies.json`, `exchange-rates.json`, `lan-sync-state.json`, `platform-onboarding-state.json`, `practice-store-state.json`, `products.json`, `store-state.json`).
- **Capacitor Android Web Staging:** `android/app/src/main/assets/public/` and `android/app/src/main/assets/capacitor.config.json` generated cleanly.

### Pending GitHub Actions Runner Verification (On Branch `fix/ci-dependency-lockfile`)
- **Windows (`windows-latest`):** `D-POS-Setup.exe`, `D-POS-Portable.exe`, `windows-checksums.txt`, and `win-unpacked/resources/` verification (`NOT RUN` locally).
- **Android (`ubuntu-latest`):** `Dqnamo-POS-v2.5.0.apk`, `Dqnamo-POS.apk`, `Dqnamo-POS-v2.5.0.aab`, `android-checksums.txt`, and `aapt dump badging` verification (`NOT RUN` locally).

---

## 10. Rollback Instructions

All changes are isolated to 5 build/CI/documentation files with zero database or application-code side effects.

### Full Rollback (Single Commit Revert on Branch)
If changes were committed to `fix/ci-dependency-lockfile` (or merged to `main`):
```bash
git revert <commit-sha>
git push origin <branch-name>
```

### Granular File Rollback (Restore Previous State)
```bash
git checkout <previous-commit-sha> -- \
  package-lock.json \
  scripts/optimize-build-size.cjs \
  .github/workflows/build-windows-exe.yml \
  .github/workflows/build-apk.yml
rm -f docs/CI_BUILD_REPAIR_REPORT.md
```

### Node.js Version Rollback Only (If Needed Independently)
If a runner-specific issue occurs on Node `24`, change `node-version: '24'` back to `'22'` in `.github/workflows/build-windows-exe.yml` and/or `.github/workflows/build-apk.yml` and relax the `maj < 24` check in the `Verify Node.js, npm, and Lockfile Consistency` step while keeping the synchronized `package-lock.json` and `SKIP_BUILD_ARTIFACT_CLEAN` guard intact.
