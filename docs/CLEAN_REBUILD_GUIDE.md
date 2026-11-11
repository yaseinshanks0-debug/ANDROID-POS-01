# دليل البناء النظيف والإصدار المستقل — Windows EXE & Android APK/AAB
**المشروع:** `ANDROID-POS-01` (`Dqnamo POS v2.5.0`)  
**الإصدار:** `2.5.0` (`versionCode: 250`)  
**معرّف التطبيق (`App ID / applicationId`):** `com.dqnamo.pos`

---

## 1. ملخص البنية الهندسية للبناء النظيف (`Clean Build Architecture`)

تمت إعادة هندسة سلسلة البناء في المشروع للقضاء النهائي على المشكلتين الرئيسيتين اللتين كانتا تواجهان البناء بعد المزامنة مع GitHub:
1. **القضاء على خطأ `Cannot find module '@rolldown/binding-win32-x64-msvc'` (`ERR-01`):**
   - تم ضم `electron@33.4.0` و`electron-builder@25.1.8` إلى `devDependencies` في `package.json` وتوليد `package-lock.json` متكامل.
   - تم إلغاء تشغيل `npm install --no-save` المنفصل أثناء البناء (والذي كان يفعّل عيب `npm #4828` ويحذف حزم `@rolldown/binding-*` الاختيارية في Windows).
   - تمت إضافة فحص آلي قبل البناء (`npm run verify:rolldown` عبر `scripts/verify-rolldown-binding.cjs`) يتحقق من وجود الحزمة الأصلية الخاصة بالمنصة ويعيد استخراجها تلقائياً عند الحاجة.
2. **القضاء على مشكلة عدم عمل نسخة الويندوز بعد التثبيت (`ERR-03`):**
   - يتم تحزيم الخادم المدمج (`npm run server:bundle` -> `dist-server/server.cjs`) ونسخ واجهة الإنتاج (`npm run exe:stage-ui` -> `electron/www/`) وتمرير `dist -> resources/www` و`.data -> resources/seed-data` عبر `extraResources` مع تعطيل `asar: false` في `electron-builder.json`.
   - يقوم `electron/main.cjs` باكتشاف المنفذ المتاح تلقائياً (`3000..3019`)، وتهيئة بيانات البذور الأولية في `userData/.data` عند التشغيل الأول دون مسح بيانات المستخدم، وتوفير بديل تحميل محلي (`loadFile`) في حال حظر الجدار الناري للاتصال المحلي.

---

## 2. خطوات الحصول على النسخ الجديدة عبر GitHub Actions (الطريقة الموصى بها)

1. من واجهة **Google AI Studio**، اضغط على زر **Sync / Export to GitHub** لمزامنة الكود المحدّث مع المستودع:
   `https://github.com/yaseinshanks0-debug/ANDROID-POS-01`
2. سيبدأ سير العمل `.github/workflows/build-apk.yml` تلقائياً بتشغيل ثلاث وظائف متكاملة:
   - **`Phase 4 — Build Windows Desktop App (.exe) (windows-latest)`:**
     ينتج `Dqnamo-POS-Setup.exe` و`Dqnamo-POS-Portable.exe` و`windows-checksums.txt` بعد التحقق من `verify:rolldown` و`lint` و`test` واختبار تشغيل الخادم المدمج.
   - **`Phase 5 — Build Android APK & AAB (ubuntu-latest)`:**
     ينتج `Dqnamo-POS-v2.5.0.apk` (و`Dqnamo-POS.apk`) و`Dqnamo-POS-v2.5.0.aab` و`android-checksums.txt` بعد التحقق من `aapt dump badging`.
   - **`Assemble Release Bundle & Publish to GitHub Releases`:**
     يجمع جميع المخرجات والتقارير وبصمات `SHA256` في حزمة `Dqnamo-POS-v2.5.0-Clean-Release-Bundle` وينشرها مباشرةً في صفحة الإصدارات:
     `https://github.com/yaseinshanks0-debug/ANDROID-POS-01/releases/tag/latest-apk`

---

## 3. خطوات البناء المحلي على جهاز مطور (`Local Developer Machine`)

### أ. المتطلبات المسبقة
- **Node.js:** `v22.x`
- **npm:** `v10.x`
- **لبناء Android محلياً:** `Java JDK 21 (Temurin)` + `Android SDK (Platform 36, Build-Tools 36.0.0)`

### ب. أوامر التحقق والبناء لسطح المكتب (Windows x64)
```bash
# 1. تنظيف مخلفات البناء السابقة وتثبيت الحزم من ملف القفل
npm run clean
npm ci --include=optional --legacy-peer-deps

# 2. التحقق من وجود Rolldown Native Binding وتشغيل الفحوصات والاختبارات
npm run verify:rolldown
npm run lint
npm test

# 3. بناء الواجهة، الخادم المدمج، وتغليف ملفات .exe
npm run exe:build
```
ستجد الملفات الناتجة داخل مجلد `release-exe/`:
- `release-exe/Dqnamo-POS-Setup.exe`
- `release-exe/Dqnamo-POS-Portable.exe`

### ج. أوامر التحقق والبناء لنظام Android (`APK` و`AAB`)
```bash
# 1. التحقق من Rolldown وبناء الواجهة ومزامنة Capacitor
npm run apk:sync

# 2. بناء نسخة Debug APK للتثبيت المباشر
cd android && ./gradlew assembleDebug --no-daemon

# 3. بناء حزمة Release AAB لمتجر Google Play
./gradlew bundleRelease --no-daemon
```

---

## 4. توقيع حزمة `Dqnamo-POS-v2.5.0.aab` للنشر على Google Play Store

بما أن المستودع لا يحتوي على مفتاح توقيع سري (`Release Keystore`) التزاماً بقواعد الأمان، فإن الملف `Dqnamo-POS-v2.5.0.aab` الناتج عن `./gradlew bundleRelease` يكون **غير موقع (`Unsigned`)**. لتوقيعه قبل رفعه إلى Google Play Console:

```bash
# إنشاء مفتاح رفع خاص بك (مرة واحدة فقط — احتفظ به في مكان آمن خارج Git)
keytool -genkey -v -keystore dqnamo-upload-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias dqnamo-upload

# توقيع ملف الـ AAB باستخدام jarsigner (من JDK 21)
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore dqnamo-upload-key.jks \
  Dqnamo-POS-v2.5.0.aab dqnamo-upload
```
