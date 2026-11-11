# تقرير التدقيق الهندسي الشامل لبناء المشروع (Windows + Android)
**Project:** `ANDROID-POS-01` (Dqnamo POS)  
**Repository:** `https://github.com/yaseinshanks0-debug/ANDROID-POS-01.git`  
**Audit Date:** `2026-11-11`  
**Audited Commit SHA (GitHub):** `31f5db9590e10320f84ad9e979afed8c41c8045b`  
**Latest GitHub Actions Run Inspected:** `#42817936174`  

---

## 1. الملخص التنفيذي (Executive Summary)

تم إجراء تدقيق تقني شامل لكامل الكود المصدري، ملفات إدارة الحزم، إعدادات TypeScript وVite 8 (Rolldown)، خادم Express المدمج، إعدادات Electron لبناء نسخة سطح المكتب للويندوز (`.exe`)، إعدادات Capacitor 8 وGradle لبناء نسخة الأندرويد (`.apk` / `.aab`)، وسجلات GitHub Actions الفعلية.

### حالة البناء الحالية (Verified Current State)
| المنصة / الفحص | الحالة الفعلية الحالية | الدليل المؤكد |
|---|---|---|
| **TypeScript (`npm run lint`)** | **PASS** | `tsc --noEmit` ينجح بـ `0 errors`. |
| **Android APK Build (GitHub Actions Run `#42817936174`)** | **PASS** | نجحت جميع خطوات `Build Android APK (.apk)` (الخطوات 1 إلى 25) وتم بناء ورفع `Dqnamo-POS.apk`. |
| **Windows EXE Build (GitHub Actions Run `#42817936174`)** | **FAIL** | فشلت الخطوة 6 (`npm run build`) في وظيفة `build-exe` بسبب خطأ `Cannot find module '@rolldown/binding-win32-x64-msvc'` الناتج عن تشغيل `npm install` مرتين متتاليتين (علة npm `#4828`). |
| **النسخة المنشورة سابقاً للويندوز (`Run #42478828691`)** | **BROKEN** | عند فحص الأرشيف الفعلي بـ `7za` تبين أن `app.asar` كان بحجم `5 KB` فقط وبدون مجلد `dist/` بسبب وجود `dist/` في `.gitignore`. |
| **بناء Android AAB** | **NOT CONFIGURED** | السكريبت الحالي يبني `assembleDebug` فقط ولا ينفذ `bundleRelease` أو `bundleDebug`. |

---

## 2. تفاصيل جميع المشكلات المكتشفة (Detailed Audit Findings)

### [ERR-01] فقدان الحزمة الأصلية `@rolldown/binding-win32-x64-msvc` أثناء بناء الويندوز في GitHub Actions
- **مستوى الخطورة:** **CRITICAL (Blocker)**
- **الموقع:** `/.github/workflows/build-apk.yml` (وظيفة `build-exe`، الخطوات 4 و5 و6).
- **الرسالة الفعلية للخطأ:**
  ```text
  Error: Cannot find native binding. npm has a bug related to optional dependencies (https://github.com/npm/cli/issues/4828).
  cause: Error: Cannot find module '@rolldown/binding-win32-x64-msvc'
  ```
- **السبب الجذري (Root Cause):**
  1. يعتمد `vite@8.3.x` على المحزم `rolldown` الذي يتطلب حزم `optionalDependencies` خاصة بنظام التشغيل (`@rolldown/binding-win32-x64-msvc` على ويندوز و `@rolldown/binding-linux-x64-gnu` على لينكس).
  2. في وظيفة `build-exe`، تقوم الخطوة 4 بتشغيل `npm install --legacy-peer-deps` (حيث يتم تثبيت `@rolldown/binding-win32-x64-msvc` بنجاح)، ثم تقوم **الخطوة 5** بتشغيل أمر تثبيت ثانٍ منفصل:
     `npm install --no-save --legacy-peer-deps electron@33.4.0 electron-builder@25.1.8` **قبل** تشغيل `npm run build` في الخطوة 6.
  3. في `npm v10.9.8` ومع غياب `package-lock.json`، يؤدي تشغيل `npm install --no-save <pkg>` للمرة الثانية إلى تفعيل علة npm الشهيرة (`npm/cli#4828`) التي تحذف الحزم الاختيارية الخاصة بالمنصة (`@rolldown/binding-win32-x64-msvc`) من `node_modules`.
  4. الدليل القاطع: في وظيفة الأندرويد `build-apk` ضمن نفس التشغيلة (`#42817936174`)، تم تشغيل `npm install` مرة واحدة فقط ثم `npm run build` مباشرةً، فنجح البناء بنسبة 100%.
- **طريقة المعالجة:**
  1. تنفيذ `npm run lint` و `npm test` و `npm run build` و `npm run server:bundle` و `npm run exe:stage-ui` **مباشرةً بعد التثبيت الأول** (`npm install --include=optional --legacy-peer-deps`) وقبل تثبيت `electron` و `electron-builder`.
  2. إضافة فحص تحقق صريح من وجود `@rolldown/binding-win32-x64-msvc` على ويندوز قبل بدء `vite build` في حال استدعاء أي تثبيت إضافي.

---

### [ERR-02] غياب `package-lock.json` وتعارض `esbuild` في `package.json`
- **مستوى الخطورة:** **HIGH**
- **الموقع:** `/package.json` و `/bun.lock`.
- **السبب الجذري:**
  - يحتوي المستودع على `bun.lock` فقط دون `package-lock.json`.
  - يطلب `drizzle-kit@0.31.11` الحزمة `esbuild@^0.25.0` بينما يطلب `vite@8.3.x` اختيارياً `esbuild@^0.27.0 || ^0.28.0`، مما يجعل `npm install` بدون `--legacy-peer-deps` يفشل بخطأ `ERESOLVE`.
  - كما أن مكتبة `recharts@3.10.1` تتطلب `react-is` كـ `peerDependency` (تمت إضافتها صراحةً إلى `dependencies` في `package.json` مما أصلح بناء الأندرويد في التشغيلة `#42817936174`).
- **طريقة المعالجة:**
  - الحفاظ على `react-is` ضمن `dependencies` في `package.json`.
  - توحيد أمر التثبيت في CI ليكون خطوة واحدة حتمية مع `--include=optional --legacy-peer-deps` وعدم تشغيل أوامر `npm install --no-save` جزئية قبل انتهاء `vite build` و `esbuild`.

---

### [ERR-03] استبعاد مجلد الواجهة `dist/` في الإصدارات السابقة لتطبيق الويندوز (`.exe`)
- **مستوى الخطورة:** **CRITICAL (Fixed in config, pending clean CI build)**
- **الموقع:** `/electron-builder.json`، `/electron/main.cjs`، `/.gitignore`.
- **السبب الجذري:**
  - التقنية المعتمدة لسطح المكتب في المشروع هي **Electron (`33.4.0`) + `electron-builder` (`25.1.8`)** مع خادم Express محلي مدمج (`dist-server/server.cjs`).
  - في البناء السابق المنشور على GitHub (`Run #42478828691`)، استبعدت أداة `electron-builder` مجلد `dist/` بالكامل لأنه مدرج في `.gitignore`، فخرج ملف `Dqnamo-POS-Setup.exe` بدون ملف `index.html` أو ملفات الواجهة.
- **طريقة المعالجة:**
  - استخدام `exe:stage-ui` لنسخ `dist/` إلى `electron/www/`، واستخدام `"extraResources"` في `electron-builder.json` لنسخ `dist` إلى `resources/www` و `.data/*.json` إلى `resources/seed-data` مع تعطيل `"asar": false`.
  - التحقق الآلي في CI من وجود `resources/www/index.html` و `resources/app/dist-server/server.cjs` قبل حزم أو رفع ملفات `.exe`.

---

### [ERR-04] عدم تطابق بيانات الإصدار (`version: 0.0.0`) وعدم إعداد بناء `AAB` في Android Gradle
- **مستوى الخطورة:** **MEDIUM**
- **الموقع:** `/package.json`، `/android/app/build.gradle`، `/capacitor.config.ts`.
- **السبب الجذري:**
  - في `/package.json`: `"name": "react-example"` و `"version": "0.0.0"`.
  - في `/android/app/build.gradle`: `versionCode 1` و `versionName "1.0"`، بينما إصدار النظام في `electron-builder.json` هو `2.5.0`.
  - في `/capacitor.config.ts`: الخاصية `webContentsDebuggingEnabled: true` مفعلة بشكل دائم.
  - لا توجد خطوة في Gradle / CI لإنشاء حزمة **Android App Bundle (`.aab`)** (`./gradlew bundleRelease` أو `bundleDebug`) إلى جانب ملف الـ `APK`.
  - لا يتوفر ملف توقيع إنتاجي (`release.keystore`) في المستودع (حفاظاً على الأمان)، لذا فإن بناء `Release AAB` يكون غير موقّع (`app-release.aab`) ما لم يتم توفير مفاتيح التوقيع عبر GitHub Secrets، بينما `APK` التجريبي (`app-debug.apk`) يُوقّع تلقائياً بمفتاح Debug صالح للتثبيت المباشر على الأجهزة.
- **طريقة المعالجة:**
  - تحديث إصدار التطبيق في `/package.json` و `/android/app/build.gradle` إلى `2.5.0` (`versionCode 250`).
  - دعم بناء كلٍ من `APK` (`assembleDebug`) و `AAB` (`bundleRelease` مع دعم التوقيع الاختياري عبر متغيرات البيئة إن وُجدت) في سير عمل البناء.

---

### [ERR-05] تحذير المترجم `IMPORT_IS_UNDEFINED` في محرك قارئ الباركود
- **مستوى الخطورة:** **LOW**
- **الموقع:** `/src/lib/barcode-scanner-engine.ts` (السطر 9).
- **الرسالة الفعلية:**
  ```text
  [IMPORT_IS_UNDEFINED] Import `default` will always be undefined because there is no matching export in 'node_modules/@zxing/library/esm/index.js'
  ```
- **السبب الجذري:**
  - الوصول المباشر إلى `zxingNs.default` على كائن `import * as zxingNs from '@zxing/library'` الذي يصدر أسماء صريحة فقط في نسخة ESM.
- **طريقة المعالجة:**
  - تعديل طريقة الوصول إلى الصادرات في `/src/lib/barcode-scanner-engine.ts` لتجنب التحذير الثابت أثناء بناء Vite/Rolldown مع الحفاظ الكامل على سلوك قارئ الباركود.

---

### [ERR-06] محدودية سكريبت الاختبار الافتراضي `"test"` في `package.json`
- **مستوى الخطورة:** **MEDIUM**
- **الموقع:** `/package.json` (السطر 14).
- **السبب الجذري:**
  - السكريبت `"test": "tsx --test src/lib/*.test.ts src/db/*.test.ts"` لا يشمل الاختبارات الموجودة في `src/lib/__tests__/` و `src/db/__tests__/` و `src/analytics/`.
- **طريقة المعالجة:**
  - توسيع سكريبت الاختبارات ليشمل اختبارات التحقق من سلامة الحسابات، المخزون، ترحيل البيانات، وسلامة إعدادات البناء قبل إصدار أي نسخة جديدة.

---

### [ENV-01] قيود بيئة الحاوية المحلية مقابل بيئة البناء الكاملة في GitHub Actions
- **مستوى الخطورة:** **INFORMATIONAL / ENVIRONMENT CONSTRAINT**
- **التحقق الفعلي في الحاوية الحالية:**
  - `Node.js`: `v22.23.2` (متوفر ويعمل).
  - `npm`: `10.9.8` (متوفر ويعمل).
  - `Java JDK`: غير مثبت في هذه الحاوية السحابية (`java: not found`).
  - `Android SDK / Gradle`: غير مثبت محلياً في هذه الحاوية.
  - `Windows NSIS / Wine`: الحاوية تعمل بنظام Linux ولا تحتوي على Wine لتجميع ملفات `.exe` محلياً.
- **الآلية المعتمدة للبناء النظيف:**
  - يتم بناء الواجهة (`dist/`) وحزمة الخادم المدمج (`dist-server/server.cjs`) وتجهيز ملفات سطح المكتب (`electron/www/`) واختبارها وتشغيلها فعلياً داخل هذه البيئة، بينما يتم تجميع ملفات الـ Binary النهائية (`APK` و `AAB` و `EXE`) عبر بيئات GitHub Actions المعزولة والنظيفة (`ubuntu-latest` المزودة بـ JDK 21 + Android SDK 36، و `windows-latest` المزودة بـ Windows x64 + NSIS).

---

## 3. خطة الإصلاح والتنفيذ للمراحل القادمة (Remediation & Execution Plan)

1. **المرحلة 2 و3 (تنظيف البيئة وإصلاح جميع أخطاء البناء):**
   - إصلاح `/src/lib/barcode-scanner-engine.ts` لإزالة تحذير `IMPORT_IS_UNDEFINED`.
   - تحديث `/package.json` لتوحيد رقم الإصدار `2.5.0` وتحديث سكريبتات البناء والاختبار.
   - تحديث `/android/app/build.gradle` لرفع الإصدار إلى `2.5.0` (`versionCode 250`) ودعم بناء `AAB` بالإضافة إلى `APK`.
   - تحديث `/.github/workflows/build-apk.yml` (وإنشاء workflows منفصلة أو منظمة بوضوح) بحيث يتم تنفيذ `npm run lint` و `npm test` و `npm run build` و `npm run server:bundle` و `npm run exe:stage-ui` **قبل** تثبيت حزم التحزيم `electron` و `electron-builder`، مما يقضي نهائياً على خطأ `@rolldown/binding-win32-x64-msvc`.
2. **المرحلة 4 و5 (بناء Windows وAndroid):**
   - تنفيذ Clean Build كامل للواجهة (`vite build`) والخادم المدمج (`esbuild`) وتجهيز حزمة الويندوز (`exe:stage-ui`) ومزامنة Capacitor (`cap sync android`).
3. **المرحلة 6 و7 و8 (الاختبار الوظيفي، مخرجات الإصدار `releases/clean-build-2026-11-11/`، وتحديث CI/CD):**
   - تشغيل الخادم المدمج الفعلي واختبار جميع مسارات الـ API والواجهة (تسجيل الدخول، الشركات، المنتجات، المبيعات، المرتجعات، المخزون، العملات، التقارير، النسخ الاحتياطي، الطلبات غير الملباة).
   - إنشاء مجلد الإصدار النظيف `releases/clean-build-2026-11-11/` متضمناً تقارير البناء والاختبار والبيئة وبصمات الملفات (`CHECKSUMS.txt`).
