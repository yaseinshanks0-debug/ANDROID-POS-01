# تدقيق الجاهزية الإنتاجية والأمنية للتحول إلى SaaS — ANDROID-POS-01
# SaaS Production Readiness & Security Audit (Phase 1 & Phase 4)

- **المشروع:** `ANDROID-POS-01` (Dqnamo POS — Android / Windows / Web)
- **مشروع Google Cloud:** `artful-port-r71nt`
- **المنطقة المستهدفة:** `europe-west2` (London)
- **تاريخ التدقيق:** 2026-11-19
- **نوع المهمة:** تدقيق وتخطيط فقط (Read-Only Audit — بدون إنشاء موارد، بدون تعديل قاعدة البيانات أو الكود أو النشر)
- **حجم الإطلاق المستهدف:** 10 شركات (Companies)، 50 مستخدماً، 20 فرعاً، أجهزة نقاط بيع متعددة، مزامنة Offline-First.
- **الخلاصة التنفيذية (Verdict):** **غير جاهز حالياً للإنتاج كنظام Multi-Tenant SaaS (NO-GO).** توجد بنية أولية متقدمة (Cloud SQL + Cloud Run Dev + Firebase + 35 جدولاً في PostgreSQL + محرك نسخ احتياطي مشفّر + RBAC)، لكن هناك **7 ثغرات حرجة (Critical Blockers)** في عزل الشركات، وتجاوز المصادقة، والاعتماد على ملفات `.data/*.json` المؤقتة، وغياب PITR وPostgreSQL RLS، تمنع الإطلاق التجاري قبل معالجتها.

> **سياسة أمان التقرير:** لم تتم طباعة أي قيم سرية (`DATABASE_URL`، كلمات مرور، مفاتيح API، توكنات، أو أسماء اتصالات Cloud SQL الحساسة) في هذا التقرير.

---

## منهجية التحقق ومصادر الحقيقة (Evidence & Verification Boundaries)

| المصدر | ما تم التحقق منه فعلياً | الحالة |
| :--- | :--- | :--- |
| **الكود المصدري والمستودع** | فحص `server.ts`، `src/db/index.ts`، `src/db/schema.ts`، `src/server/*`، `src/analytics/analytics.routes.ts`، `src/lib/firebase.ts`، `firestore.rules`، `capacitor.config.ts`، `package.json`، `.env.example`، `vercel.json`. | **تم التحقق (Verified)** |
| **قاعدة بيانات Cloud SQL الحية (قراءة فقط)** | تنفيذ استعلامات `SELECT` وصفية فقط (`version()`, `pg_settings`, `pg_class`, `pg_roles`, `pg_policies`, `pg_auth_members`, `pg_stat_user_tables`) دون أي DDL/DML. | **تم التحقق (Verified)** |
| **بيئة التشغيل الحالية (Container Metadata)** | فحص أسماء متغيرات البيئة الموجودة فقط (بدون طباعة قيم الأسرار) وحالة مجلدي `.data/` و`drizzle/`. | **تم التحقق (Verified)** |
| **لوحة تحكم GCP (Billing / IAM / Backups / Buckets)** | أداة `gcloud` و`gsutil` غير مثبتة داخل حاوية التطوير؛ لذا فإن إعدادات الفوترة الفعلية، وسياسة النسخ الاحتياطي الآلي في Cloud SQL، وصلاحيات Cloud Storage Buckets تتطلب تحققاً مباشراً من GCP Console أو `gcloud` (تم تضمين الأوامر الجاهزة أدناه). | **يتطلب تحققاً من GCP Console (Unverified from Container)** |

---

## PHASE 1 — تدقيق البنية التحتية الحالية (Infrastructure Audit)

### ملخص حالة العناصر العشرة المطلوبة

| # | البند | الحالة الحالية المُتحقق منها | التقييم |
| :---: | :--- | :--- | :---: |
| **1** | **إعدادات Google Cloud** | المشروع `artful-port-r71nt` في منطقة `europe-west2` (مؤكد عبر `firebase-applet-config.json` ورابط الخدمة `*.europe-west2.run.app` ومتغيرات Cloud Run `K_SERVICE`/`K_REVISION`). أداة `gcloud` غير متاحة داخل الحاوية لفحص IAM/Organization Policies/Billing Budgets. | جزئي |
| **2** | **إعداد Cloud SQL Instance** | نسخة Cloud SQL متصلة فعلياً عبر Unix Socket (`SQL_HOST` يبدأ بـ `/...` بصيغة Cloud SQL Auth Proxy). قاعدة البيانات النشطة باسم `cloud_sql_development_database` بحجم **11 MB** حالياً. **اكتشاف مهم:** الإصدار الفعلي هو **PostgreSQL 18.6** وليس PostgreSQL 16 كما كان يُعتقد سابقاً. | متصل (بيئة تطوير) |
| **3** | **إصدار القاعدة وفئة الجهاز (Edition & Machine Tier)** | تشير إعدادات الذاكرة الحية (`shared_buffers=128MB`, `effective_cache_size=807072kB` ≈ 788 MB, `work_mem=4MB`, `max_connections=50`) ومعلومات التهيئة إلى **Cloud SQL Developer Edition** (فئة مصغّرة Scale-to-Zero مخصصة للتطوير، ~1 GB RAM). يُنصح بتأكيد الفئة الدقيقة والـ Edition في GCP Console (`gcloud sql instances describe`). | فئة تطوير |
| **4** | **CPU / RAM / Storage** | الذاكرة المقدّرة من `effective_cache_size` تقارب **1 GB RAM** بحد اتصالات **50 اتصالاً** فقط (`max_connections=50`). المساحة المستخدمة حالياً **11 MB** (35 جدولاً). الحد الأقصى لمجمع الاتصالات في `src/db/index.ts` مضبوط على `max: 12` لكل حاوية Cloud Run (أي أن 5 حاويات فقط قد تستنفد جميع اتصالات القاعدة = 60 > 50!). | يحتاج ضبطاً |
| **5** | **النسخ الاحتياطي والاسترجاع الزمني (Backup & PITR)** | فحص `pg_settings` أثبت أن **`wal_level = replica`** لكن **`archive_mode = off`**، وهذا يؤكد أن **الاسترجاع الزمني الدقيق (Point-in-Time Recovery / PITR) غير مفعّل حالياً** على النسخة الحية. أما جدول النسخ الاحتياطي الآلي اليومي (Automated Daily Backups) في مستوى Cloud SQL Control Plane فيجب التحقق منه عبر GCP Console. | **خطر حرج** |
| **6** | **الشبكة والاتصال الحالي (Network Connectivity)** | الاتصال من الخادم إلى Cloud SQL يتم عبر **Unix Domain Socket (Cloud SQL Auth Proxy)** وهو مشفّر تلقائياً دون الحاجة لـ Serverless VPC Access Connector (ميزة ممتازة لتقليل التكلفة). الـ Backend يعمل على `0.0.0.0:3000`. التطبيق على Android يفعّل `cleartext: true` و`allowMixedContent: true` لأجل مزامنة Wi-Fi LAN، والـ Express يرسل `Access-Control-Allow-Origin: *` مفتوحاً للجميع. | يحتاج تشديداً |
| **7** | **حالة نشر الـ Backend** | يعمل الخادم حالياً داخل بيئة تطوير AI Studio على Cloud Run (`NODE_ENV=development`، `npm run dev` عبر `tsx server.ts`). **لا يوجد `Dockerfile` ولا `.dockerignore` ولا Cloud Build / GitHub Actions للنشر على Cloud Run.** توجد فقط Workflows لبناء Android APK وWindows EXE (`.github/workflows/build-apk.yml`, `build-windows-exe.yml`) وملف `vercel.json` للواجهة الثابتة فقط. كما لا يوجد معالج `SIGTERM` للإغلاق الآمن (`pool.end()`). | **غير جاهز للنشر الإنتاجي** |
| **8** | **إعدادات Firebase Authentication & Firestore** | مشروع Firebase مربوط بـ `artful-port-r71nt` مع قاعدة Firestore Enterprise (`ai-studio-dqnamoposmoderna-82cc08b7-ecc8-4968-b1b8-331b54b755ff`). حزمة `firebase@^13.1.0` مثبتة، لكن **`firebase-admin` غير مثبتة في `package.json`**. يتم استخدام Firebase Auth (Google Popup فقط) حصرياً داخل `FirebaseCloudSyncSection.tsx` لرفع لقطات يدوية إلى Firestore، وهو **منفصل تماماً** عن مصادقة Express API التي تعتمد JWT مخصصاً. | منفصل / مزدوج |
| **9** | **حاويات Cloud Storage (Buckets)** | اسم Bucket مُعرّف في `firebase-applet-config.json` (`artful-port-r71nt.firebasestorage.app`)، لكن **لا يوجد أي استخدام لـ Cloud Storage / `@google-cloud/storage` أو Firebase Storage في الكود**. صور المنتجات وإشعارات الدفع تُخزّن كـ Base64 داخل JSON، والنسخ الاحتياطية تُكتب محلياً في `.data/backups/` (تُفقد عند إعادة تشغيل Cloud Run!). حالة الـ Bucket الفعلية وIAM تتطلب فحص GCP Console. | غير مستغل / مفقود |
| **10** | **الفوترة واستهلاك الموارد الحالي** | الاستهلاك الفعلي للموارد داخل القاعدة ضئيل جداً (11 MB، 35 جدولاً، معظم الجداول التشغيلية فارغة 0 صفوف، بينما تحتوي `companies` على ~182 صفاً ناتجة عن اختبارات سابقة). بيانات الفوترة الفعلية الشهرية وحدود الميزانية (Budgets & Alerts) غير متاحة من داخل الحاوية ويجب فحصها في Cloud Billing Console. | يتطلب تحققاً في Billing |

### أوامر التحقق المباشر من GCP (لتشغيلها من طرف المالك في Cloud Shell)
```bash
gcloud config set project artful-port-r71nt
gcloud sql instances list --format="table(name,databaseVersion,region,settings.tier,settings.edition,settings.backupConfiguration.enabled,settings.backupConfiguration.pointInTimeRecoveryEnabled,state)"
gcloud run services list --region=europe-west2
gcloud storage buckets list --format="table(name,location,storageClass,iamConfiguration.uniformBucketLevelAccess.enabled)"
gcloud secrets list
gcloud billing budgets list --billing-account=<BILLING_ACCOUNT_ID>
```

---

## PHASE 4 — التدقيق الأمني الشامل (Security Audit)

### مصفوفة الثغرات والمخاطر الأمنية المُكتشفة (مع الدليل من الكود والقاعدة الحية)

| الرمز | المجال | المشكلة والدليل الفعلي | الخطورة (Severity) | الحالة الحالية (Current Status) | الحل الموصى به (Recommended Solution) | التكلفة التقديرية | الاعتماديات (Dependencies) |
| :--- | :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| **SEC-01** | **Secrets / JWT Auth** | مفتاح توقيع JWT الافتراضي مكتوب كنص ثابت داخل مستودع عام (`src/server/release-onboarding.service.ts:1196-1197`) ومتغير `SESSION_JWT_SECRET` غير مضبوط في بيئة التشغيل. بما أن `verifySessionJwt` يقبل Stateless JWT (سطر 1432)، يمكن لأي مهاجم تزوير توكن `COMPANY_OWNER` لأي شركة! | **CRITICAL** | **مكشوف فعلياً** | إلزام وجود `SESSION_JWT_SECRET` (أو استبداله بـ Firebase ID Tokens via `firebase-admin`) ورفض إقلاع الخادم في الإنتاج عند غيابه، وتخزين المفتاح في **Google Secret Manager**. | **$0/شهر** (ضمن أول 6 أسرار مجانية) | Secret Manager + Cloud Run Secret Mount |
| **SEC-02** | **API Auth Bypass** | `resolveAuthenticatedActorFromRequest` (`release-onboarding.service.ts:1460-1510`) و`analytics.routes.ts:149-159` يقبلان ترويسة `x-user-id` أو `query.userId` دون أي توكن! كما أن `server.ts` يمرر `{ allowInternalDefaultIfNoHeader: true }` لمسارات إنشاء/تعديل/حذف المنتجات والعملات وأسعار الصرف. | **CRITICAL** | **مكشوف فعلياً** | إلغاء fallback الخاص بـ `x-user-id` و`allowInternalDefaultIfNoHeader` بالكامل في الإنتاج؛ إلزام `Authorization: Bearer <Verified_Token>` في جميع مسارات `/api/*` باستثناء `/api/health` و`/api/auth/login`. | **$0** (تعديل برمجي) | توحيد نظام التوكن في Frontend & APK |
| **SEC-03** | **Cross-Company Access (Backup)** | `GET /api/backups` و`GET /api/backups/:backupId/download` (`backup-restore.service.ts:1861-1953`) تقبل `?companyId=<victim>` بدون `assertActorCompanyMatch`! والأسوأ أن `resolveBackupActorOrLocalStore` (سطور 1781-1857) يصطنع مستخدم `COMPANY_OWNER` بكامل الصلاحيات عند فشل المصادقة (401)! | **CRITICAL** | **ثغرة اختراق عابرة للشركات** | حذف `resolveBackupActorOrLocalStore` في وضع SaaS، وفرض `targetCompanyId = actor.company.id` دائماً مع `assertActorCompanyMatch` والتحقق الإلزامي من التوكن. | **$0** (تعديل برمجي) | SEC-01, SEC-02 |
| **SEC-04** | **Cross-Company Access (Sync & LAN)** | مسارات `/api/store-sync` و`/api/transactions` (`server.ts:695-904`) وجميع مسارات `/api/lan-sync/*` (`lan-sync.service.ts:572-867`) **بلا أي مصادقة**، وتثق في `companyId` من الـ Query/Header. بالإضافة لذلك، `filterByCompanyScope()` (`shared-store-sync.ts:74-75`) تُرجع كل الشركات عند غياب `companyId` وتسرّب السجلات غير الموسومة لكل شركة! | **CRITICAL** | **مفتوح بالكامل على الإنترنت** | إيقاف `/api/store-sync` و`/api/lan-sync/*` في وضع Cloud SaaS (حصر LAN Sync بالخادم المحلي فقط خلف Pairing Token مشفّر)، وبناء Sync API موثّق بالكامل مربوط بـ `company_id` من التوكن وPostgreSQL. | **$0** (تعديل برمجي) | SEC-02 + PostgreSQL Persistence |
| **SEC-05** | **Tenant Isolation (DB Layer)** | **PostgreSQL Row-Level Security (RLS) معطّلة على 100% من الجداول (35/35 جدولاً، 0 سياسات)**، ومستخدم التطبيق `ai_studio_app_user` عضو في `pg_read_all_data` و`pg_write_all_data` و`pg_monitor` مع صلاحية `DELETE` على `companies`. إضافة لذلك، جداول `products`, `currencies`, `exchange_rates` تُستعلم في `products-repo.ts` و`currencies-repo.ts` دون تصفية `WHERE company_id = $1`. | **CRITICAL** | **لا يوجد عزل على مستوى DB** | 1) إنشاء دور تطبيق مقيّد (أو سحب `pg_read_all_data`/`pg_write_all_data` ومنح صلاحيات محددة على الجداول فقط). 2) تفعيل `ENABLE + FORCE ROW LEVEL SECURITY` مع `SET LOCAL app.current_company_id` داخل كل معاملة. 3) فرض `company_id` في جميع الاستعلامات. | **$0** (إعداد PostgreSQL) | Schema Multi-Tenancy Migration |
| **SEC-06** | **Data Recovery & PITR** | `archive_mode = off` في PostgreSQL الحي (لا يوجد PITR)، كما أن البيانات التشغيلية الحقيقية (مبيعات، عملاء، مخزون، حسابات، جلسات، نسخ احتياطية) تُكتب في `.data/*.json` داخل حاوية Cloud Run المؤقتة وتُمحى عند إعادة التشغيل أو Scale-to-Zero! | **CRITICAL** | **خطر فقدان بيانات فوري** | 1) نقل 100% من البيانات إلى Cloud SQL PostgreSQL وإلغاء fallback الكتابة إلى `.data/` في الإنتاج. 2) تفعيل Automated Daily Backups + PITR (7 أيام) على Cloud SQL. 3) تخزين النسخ الاحتياطية المشفّرة في Cloud Storage مع Versioning + Lifecycle. | **~$0.50 – $3/شهر** (PITR + GCS) | تفعيل Cloud SQL Backups + GCS Bucket |
| **SEC-07** | **CORS, Body Limit & HTTP Security Headers** | `server.ts:95` يضبط `Access-Control-Allow-Origin: *`، و`express.json({ limit: '50mb' })` (سطر 107) بلا حماية من DoS، ولا يوجد `helmet` ولا ترويسات `HSTS`/`CSP` على الخادم الخلفي. | **HIGH** | **ضعيف** | تقييد CORS بقائمة نطاقات مسموح بها (`CORS_ALLOWED_ORIGINS` + `https://localhost` لتطبيق Android)، إضافة `helmet`، وخفض حد JSON العام إلى `2mb` (ورفع صور المنتجات/الإشعارات عبر Signed URLs إلى Cloud Storage). | **$0** | GCS Signed URLs للصور |
| **SEC-08** | **Backup Encryption Governance** | يدعم `backup-restore.service.ts` تشفير `AES-256-GCM` ممتازاً مع `scrypt` وSHA-256 checksums، **لكن التشفير اختياري** (إذا لم يُدخل المستخدم `encryptionPassword` تُحفظ النسخة مضغوطة بدون تشفير!). كما أن النسخ مخزّنة محلياً في `.data/backups/`. | **HIGH** | **اختياري ومحلي** | إلزام التشفير لنسخ SaaS (تشفير GCS افتراضي AES-256 على الخادم + تشفير طبقة التطبيق بمفتاح الشركة أو KMS عند التصدير)، وإلزام كلمة مرور قوية عند تحميل أي نسخة محلية. | **$0 – $1/شهر** (GCS Standard + KMS اختياري) | Cloud Storage Bucket |
| **SEC-09** | **Device Authentication & Offline DB Encryption** | لا يوجد سجل أجهزة موثّق في PostgreSQL (`devices` / `device_tokens` غير موجودة)؛ `x-device-id` نص يولّده العميل بلا تحقق. في Android (`capacitor.config.ts:9,12,26`): `cleartext: true`، `allowMixedContent: true`، و**تشفير قاعدة SQLite المحلية معطّل (`androidIsEncryption: false`)**. | **HIGH** | **غير مؤمّن** | 1) إنشاء جدول `pos_devices` مع تسجيل وربط الجهاز بالشركة والفرع وRevocation Token. 2) تقييد Cleartext في Android عبر `network_security_config.xml` لشبكات LAN الخاصة فقط ومنع HTTP للاتصال السحابي (TLS 1.2+ حصراً). 3) تفعيل SQLite Encryption (`SQLCipher`) للأجهزة الإنتاجية. | **$0** | جدول `pos_devices` + تحديث Android Manifest |
| **SEC-10** | **TLS & Database SSL Verification** | الاتصال بـ Cloud SQL عبر Unix Socket محمي ومشفّر عبر Auth Proxy (آمن)، لكن في حال استخدام `DATABASE_URL` (`src/db/index.ts:51`) يتم ضبط `ssl: { rejectUnauthorized: false }` مما يضعف التحقق من شهادة الخادم. | **MEDIUM** | **آمن على Unix Socket، ضعيف على DATABASE_URL** | في الإنتاج على Cloud Run، الاعتماد حصراً على Cloud SQL Auth Proxy Socket (`--add-cloudsql-instances`)، وإلزام `rejectUnauthorized: true` مع شهادة CA في حال أي اتصال TCP مباشر. | **$0** | Cloud Run Cloud SQL Integration |
| **SEC-11** | **Firestore Security Rules & Single-Tenant Model** | ملف `firestore.rules` يطبق قواعد جيدة البنية لـ `ownerId == request.auth.uid`، لكنه يحتوي بريداً إلكترونياً ثابتاً كـ Super Admin (`isAdmin()`)، ولا يدعم عضويات فرق متعددة للشركة، ويخزّن لقطة المتجر في مستند واحد (حد Firestore الأقصى **1 MB**). | **MEDIUM** | **غير مناسب لـ Multi-Tenant SaaS** | حصر دور Firebase بـ **Authentication (Identity Provider)** فقط في بنية SaaS، وإيقاف تخزين لقطات المتجر الكاملة في Firestore لتجنب تضارب مصادر الحقيقة وحد 1 MB وتكاليف القراءة/الكتابة. | **$0** (يوفر تكلفة Firestore!) | توحيد المصدر في Cloud SQL |
| **SEC-12** | **Audit Logging & DB Statement Timeouts** | `audit_logs` في PostgreSQL الحي يحتوي **0 صفوف**؛ سجلات التدقيق تُكتب في `.data/platform-onboarding-state.json` المؤقتة فقط. كما أن `statement_timeout = 0` و`idle_in_transaction_session_timeout = 0` في PostgreSQL مما يسمح بقفل اتصالات القاعدة إلى ما لا نهاية. | **MEDIUM** | **غير فعّال في PostgreSQL** | كتابة جميع أحداث التدقيق الحساسة (Login, Failed Login, Role Change, Void, Refund, Backup/Restore, Price Edit) مباشرة إلى جدول `audit_logs` (Append-Only) في PostgreSQL، وضبط `statement_timeout = 15s` و`idle_in_transaction_session_timeout = 30s`. | **$0** | تفعيل DB Persistence |

---

## ملخص الجاهزية الأمنية والتشغيلية

- **نقاط القوة الموجودة فعلياً (يمكن البناء عليها):**
  - مخطط Drizzle غني (35 جدولاً) يتضمن أعمدة `company_id` على 20 جدولاً، ودعم `scrypt` لتجزئة كلمات المرور ورموز PIN، وسياسة قوة كلمة مرور (`validatePasswordStrength`)، وتشفير `AES-256-GCM` للنسخ الاحتياطية، ومحدد معدل طلبات (`rate-limiter.ts`)، وضغط استجابات Brotli/Gzip، ودعم SQLite محلي على Android.
  - Cloud SQL متصل عبر Auth Proxy Unix Socket (`ssl=on`, `TLSv1.2`, `scram-sha-256`).
- **الأسباب الحاسمة لقرار عدم الجاهزية الحالية (NO-GO Blockers):**
  1. ثغرات تجاوز المصادقة وتزوير التوكن (`SESSION_JWT_SECRET` المكشوف + قبول `x-user-id` + `allowInternalDefaultIfNoHeader` + fallback `COMPANY_OWNER` في `/api/backups`).
  2. تسرب البيانات بين الشركات في `/api/store-sync` و`/api/lan-sync/*` و`/api/backups` و`/api/products` وغياب PostgreSQL RLS.
  3. الاعتماد الفعلي على ملفات `.data/*.json` المؤقتة بدلاً من Cloud SQL (0 فواتير و0 عملاء و0 سجلات تدقيق في PostgreSQL الحي).
  4. غياب PITR (`archive_mode = off`) وغياب تخزين النسخ الاحتياطية في Cloud Storage وغياب `Dockerfile` و`SIGTERM`.
