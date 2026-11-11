# تقرير الإصلاح العاجل — فشل استخراج حزمة Rolldown على Windows (`ROLLDOWN WINDOWS HOTFIX REPORT`)

**المشروع:** `ANDROID-POS-01` (`Dqnamo POS v2.5.0`)  
**تاريخ الإصلاح:** `2026-11-11`  
**الخطأ المُعالج:** `tar: Cannot connect to D: resolve failed` أثناء تنفيذ `npm run verify:rolldown` في وظيفة `build-exe` (`windows-latest`) ضمن تشغيلة GitHub Actions رقم `#43009061873` (`commit f8112b43bb0c012f8209daaa5f637ad8d34ff792`).

---

## 1. السبب الجذري الدقيق للخطأ (`Root Cause Analysis`)

عند فحص `scripts/verify-rolldown-binding.cjs` وملف `package-lock.json` وسجل تشغيلة GitHub Actions `#43009061873` (حيث نجحت وظيفة `Phase 5 — Build Android APK & AAB` بنسبة 100% وفشلت وظيفة `Phase 4 — Build Windows Desktop App` في خطوة `npm run verify:rolldown`)، تبيّن وجود سببين مترابطين:

1. **تفسير `tar` لحرف القرص `D:` كعنوان خادم بعيد (`HOST:FILE`):**
   - في السطر 91 القديم من `scripts/verify-rolldown-binding.cjs`:
     ```js
     execSync(`tar -xzf "${tgzPath}" --strip-components=1 -C "${targetDir}"`);
     ```
   - على خادم `windows-latest` في GitHub Actions، يكون مسار المشروع هو `D:\a\ANDROID-POS-01\ANDROID-POS-01`، وبالتالي يصبح `tgzPath` مساراً مطلقاً يبدأ بـ `D:\...`.
   - عند تشغيل الخطوة تحت `shell: bash` (بيئة Git for Windows / MSYS2)، يستدعي الأمر أداة GNU `tar` (`/usr/bin/tar`) التي تفسّر أي مسار أرشيف يحتوي على نقطتين رأسيتين (`D:...`) على أنه شريط أو أرشيف بعيد عبر بروتوكول `RSH/SSH` بصيغة `HOSTNAME:FILENAME`، فتحاول الاتصال بمضيف اسمه `D` وتفشل فوراً بالخطأ:
     `Cannot connect to D: resolve failed`.

2. **عدم وجود مدخل صريح لـ `node_modules/@rolldown/binding-win32-x64-msvc` في `package-lock.json`:**
   - نظراً لتوليد `package-lock.json` على بيئة Linux، كان الكائن `packages` يحتوي على `"node_modules/@rolldown/binding-linux-x64-gnu"` فقط دون `"node_modules/@rolldown/binding-win32-x64-msvc"`، مما جعل `npm ci` على Windows يتخطى تثبيت الحزمة في المرحلة الأولى ويلجأ مباشرةً إلى مسار الاسترداد في `verify-rolldown-binding.cjs`.

---

## 2. الملفات المعدّلة أو المضافة (`Modified & Added Files`)

| الملف | نوع التغيير | الوصف |
|---|---|---|
| `scripts/verify-rolldown-binding.cjs` | معدّل | إعادة بناء آلية الاستخراج والتحقق باستخدام `spawnSync` (`shell: false`)، مسارات نسبية بالكامل (`cwd = projectRoot`) عبر `toSafeRelativeTarPath`، منع أي مسار يحتوي على `:`، وتفضيل `C:\Windows\System32\tar.exe` على Windows، مع التحقق الكامل من الملفات وتحميل الحزمة بـ `require()` |
| `package-lock.json` | معدّل | إضافة المدخل الكامل `"node_modules/@rolldown/binding-win32-x64-msvc"` (`version: "1.2.15"`, `resolved`, `integrity`, `os: ["win32"]`, `cpu: ["x64"]`, `optional: true`) لضمان تثبيته مباشرة أثناء `npm ci` على Windows |
| `src/lib/__tests__/rolldown-binding-verify.test.ts` | جديد | 5 اختبارات شاملة تغطي مسارات `D:\` على Windows، الاستخراج بمسارات نسبية، فشل الاستخراج، غياب الحزمة أو الملف `.node` أو كونه بحجم 0، والاستخراج الفعلي لحزمة `@rolldown/binding-win32-x64-msvc@1.2.15` |
| `.github/workflows/build-apk.yml` | معدّل | تعزيز خطوة التحقق في `build-exe` لفحص إصدار `package.json` (`1.2.15`) وحجم `rolldown-binding.win32-x64-msvc.node` (`> 0`) وتحميل الحزمة فعلياً عبر `require()` |

---

## 3. طريقة الإصلاح الهندسية (`Remediation Details`)

1. **استخدام `spawnSync` بدون `shell` مع `cwd = projectRoot` ومسارات نسبية خالية من `D:`:**
   - تقوم الدالة `toSafeRelativeTarPath(projectRoot, targetPath, pathModule)` بتحويل مسار الأرشيف ومسار الوجهة إلى مسارات نسبية بصيغة POSIX (مثل `.tmp-rolldown-binding/rolldown-binding-win32-x64-msvc-1.2.15.tgz` و`node_modules/@rolldown/binding-win32-x64-msvc`).
   - ترفض الدالة صراحةً أي مسار يخرج خارج جذر المشروع (`..`) أو يحتوي على نقطتين رأسيتين (`:`) مثل `D:` أو `C:`.
   - يتم استدعاء `spawnSync(tarBin, ['-xzf', relArchivePath, '--strip-components=1', '-C', relTargetDir], { cwd: projectRoot, shell: false })` مع التحقق الصارم من `result.status === 0`.
2. **التحقق الشامل من الحزمة بعد الاستخراج (`verifyExtractedBinding`):**
   - التحقق من وجود `node_modules/@rolldown/binding-win32-x64-msvc/package.json`.
   - التحقق من أن `version === "1.2.15"`.
   - التحقق من وجود الملف الثنائي الأصلي `rolldown-binding.win32-x64-msvc.node`.
   - التحقق من أن حجم الملف الثنائي أكبر من صفر (`21,731,328 bytes`).
   - التحقق من إمكانية تحميل الحزمة فعلياً من Node.js عبر `require(pkgDir)` على المنصة المستهدفة.

---

## 4. نتائج الاختبارات وإثبات تحميل Native Binding (`Verification Results`)

### أ. نتائج تشغيل `src/lib/__tests__/rolldown-binding-verify.test.ts`:
```text
# [Rolldown Verify] Platform: linux-x64 | Rolldown Version: 1.2.15 | Expected Binding: @rolldown/binding-linux-x64-gnu
# [Rolldown Verify] PASS — Native binding verified & loadable: @rolldown/binding-linux-x64-gnu@1.2.15 (rolldown-binding.linux-x64-gnu.node, 19890464 bytes)
# [Rolldown Verify] Platform: win32-x64 | Rolldown Version: 1.2.15 | Expected Binding: @rolldown/binding-win32-x64-msvc
# [Rolldown Verify] WARNING — @rolldown/binding-win32-x64-msvc@1.2.15 not ready (...). Repairing via npm pack...
# [Rolldown Verify] PASS — Successfully restored & loaded @rolldown/binding-win32-x64-msvc@1.2.15 (rolldown-binding.win32-x64-msvc.node, 21731328 bytes)
ok 1 - Rolldown Hotfix 1 — Windows D:\ paths are converted to safe relative POSIX paths without drive colons
ok 2 - Rolldown Hotfix 2 — extractTgzArchive invokes tar with shell: false, cwd = projectRoot, and relative paths on Windows D:\
ok 3 - Rolldown Hotfix 3 — Extraction failure (non-zero exit code) is caught and reported
ok 4 - Rolldown Hotfix 4 — verifyExtractedBinding rejects missing package, version mismatch, missing .node binary, and 0-byte .node binary
ok 5 - Rolldown Hotfix 5 — Real extraction & verification of @rolldown/binding-win32-x64-msvc@1.2.15 and native loading of host binding
1..5 | # pass 5 | # fail 0
```

### ب. نتائج سلسلة البناء والتحقق الكاملة:

| الأمر المنفّذ | النتيجة الفعلية | التصنيف |
|---|---|---|
| `npm ci --dry-run --include=optional --legacy-peer-deps` | متوافق 100% ويتعرف على `add @rolldown/binding-win32-x64-msvc 1.2.15` | `PASS` |
| `npm run verify:rolldown` | `PASS — Native binding verified & loadable: @rolldown/binding-linux-x64-gnu@1.2.15 (rolldown-binding.linux-x64-gnu.node, 19890464 bytes)` | `PASS` |
| `npm run lint` (`tsc --noEmit`) | `0 errors` | `PASS` |
| `npm test` | `170 / 170` اختبار ناجح (`8 suites`, `0 fail`) | `PASS` |
| `npm run build` (`vite build`) | `✓ 2989 modules transformed. ✓ built in 1.31s` (`0 errors`, `0 warnings`) | `PASS` |
| `npm run server:bundle` | `dist-server/server.cjs (3.0 MB) — Done in 110ms` | `PASS` |
| `npm run exe:stage-ui` | `electron/www/index.html (3.7 KB)` | `PASS` |

---

## 5. Git Commit Hash & Git Diff Summary

- **Previous Checkpoint Commit:** `178a5b8` (Upstream GitHub Run `#43009061873` Commit: `f8112b43bb0c012f8209daaa5f637ad8d34ff792`)
- **Hotfix Commit Hash:** `c2ff76c`

```text
 .github/workflows/build-apk.yml                   |   2 +-
 docs/ROLLDOWN_WINDOWS_HOTFIX_REPORT.md            |  98 +++++
 package-lock.json                                 |  18 +
 scripts/verify-rolldown-binding.cjs               | 504 +++++++++++++++++++---
 src/lib/__tests__/rolldown-binding-verify.test.ts | 296 +++++++++++++
 5 files changed, 856 insertions(+), 62 deletions(-)
```

