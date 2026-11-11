# مواصفات بيئة البناء المعتمدة (BUILD ENVIRONMENT SPECIFICATION)

**المشروع:** `ANDROID-POS-01` (`Dqnamo POS`)  
**الإصدار:** `2.5.0` (`versionCode: 250`)  
**معرّف التطبيق (`App ID / applicationId`):** `com.dqnamo.pos`  
**تاريخ البناء:** `2026-11-11`

---

## 1. بيئة التحقق والبناء المحلية (AI Studio Linux Container)

| المكوّن | القيمة الفعلية | الحالة |
|---|---|---|
| **نظام التشغيل** | `Linux x64 (4.19.0-gvisor)` | `PASS` |
| **Node.js** | `v22.14.0` | `PASS` |
| **npm** | `10.9.8` (`package-lock.json` `lockfileVersion: 3`) | `PASS` |
| **Rolldown Native Binding (Linux)** | `@rolldown/binding-linux-x64-gnu@1.2.15` | `PASS` |
| **Rolldown Native Binding (Windows - Locked)** | `@rolldown/binding-win32-x64-msvc@1.2.15` (`shasum: 04ff5f1e8786fd31a68d040661a50e6dae3c7669`) | `PASS` |
| **Vite** | `8.3.5` (Rolldown bundler `1.2.15`) | `PASS` |
| **TypeScript** | `7.0.2` (`tsc --noEmit`) | `PASS` |
| **esbuild** | `0.25.0` (`dist-server/server.cjs`) | `PASS` |
| **Electron / electron-builder** | `electron@33.4.0` / `electron-builder@25.1.8` | `PASS` |
| **Capacitor** | `@capacitor/core@8.6.0`, `@capacitor/cli@8.6.0`, `@capacitor/android@8.6.0` | `PASS` |
| **Java JDK / Android SDK / Wine (محلياً)** | غير مثبتة داخل حاوية الويب السحابية (`ENV-01`) — متوفرة بالكامل على GitHub Actions Runners | `BLOCKED (Local Container Only)` |

---

## 2. بيئة بناء GitHub Actions المعتمدة (`.github/workflows/build-apk.yml`)

### أ. وظيفة `build-exe` (`PHASE 4 — Windows Desktop EXE`)
- **Runner:** `windows-latest` (`Windows Server 2022 / x64`)
- **Node.js:** `22.x` (`actions/setup-node@v4`)
- **أمر التثبيت:** `npm ci --include=optional --legacy-peer-deps --no-audit --no-fund` (أمر تثبيت وحيد بدون أي `npm install --no-save`)
- **فحص Rolldown:** `npm run verify:rolldown` + فحص صريح لإصدار `@rolldown/binding-win32-x64-msvc` (`1.2.15`)
- **أداة التغليف:** `electron-builder 25.1.8` (`NSIS x64` + `Portable x64`، `asar: false`، `extraResources: dist -> www, .data -> seed-data`)

### ب. وظيفة `build-apk` (`PHASE 5 — Android APK + AAB`)
- **Runner:** `ubuntu-latest` (`Ubuntu 24.04 LTS / x64`)
- **Node.js:** `22.x` (`actions/setup-node@v4`)
- **Java / JDK:** `Temurin JDK 21` (`actions/setup-java@v4` — متوافق مع `JavaVersion.VERSION_21` في `android/app/build.gradle`)
- **Android SDK:** `platforms;android-36`, `build-tools;36.0.0`, `platform-tools` (`minSdkVersion 24`, `compileSdkVersion 36`, `targetSdkVersion 36`)
- **Gradle & AGP:** `Gradle 8.13` + `com.android.tools.build:gradle:8.13.0`
- **أوامر البناء:** `./gradlew clean assembleDebug bundleRelease --no-daemon`
