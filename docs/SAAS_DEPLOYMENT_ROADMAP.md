# خارطة طريق التحول والنشر إلى Multi-Tenant Cloud POS SaaS — ANDROID-POS-01
# SaaS Deployment Roadmap & Execution Plan (Phase 5)

- **المشروع:** `ANDROID-POS-01` (Dqnamo POS)
- **مشروع Google Cloud:** `artful-port-r71nt` (`europe-west2` — London)
- **الهدف:** إطلاق آمن لـ **10 شركات، 50 مستخدماً، 20 فرعاً، أجهزة متعددة، Offline-First** بأقل تكلفة ممكنة (السيناريو الموصى به: **السيناريو B — $14 إلى $28.50/شهر**).
- **حالة هذه الخطة:** **مقترحة وتنتظر الموافقة الصريحة قبل تنفيذ أي خطوة برمجية أو قاعدية أو سحابية.**

---

## ملخص المراحل حسب الأولوية (Prioritized Roadmap Overview)

| المرحلة | الأولوية | الهدف الرئيسي | المخاطرة | المدة التقديرية | التكلفة السحابية المضافة |
| :--- | :---: | :--- | :---: | :---: | :---: |
| **Phase A** | **P0 (حرج — أمان فوري)** | إغلاق ثغرات تجاوز المصادقة والاختراق العابر للشركات وتأمين الأسرار | عالية | 3 – 4 أيام | $0/شهر |
| **Phase B** | **P0 (حرج — عزل واستمرارية DB)** | ترحيل مخطط Multi-Tenant (إصلاح القيود الفريدة + RLS + `branch_inventory` + `company_memberships` + `pos_devices`) ونقل جميع العمليات من `.data/*.json` إلى PostgreSQL | عالية | 5 – 7 أيام | $0/شهر |
| **Phase C** | **P1 (عالي — مصادقة ومزامنة Offline-First)** | توحيد Firebase Auth + `firebase-admin`، تسجيل الأجهزة، بناء `sync_outbox` الذري + Delta Pull، وتشفير SQLite على Android | متوسطة | 5 – 7 أيام | $0/شهر |
| **Phase D** | **P1 (عالي — جاهزية Cloud Run + Backup/PITR)** | إنشاء `Dockerfile`، `SIGTERM`، `/api/health` (`SELECT 1`)، ربط Cloud Storage للصور والنسخ المشفّرة، تفعيل Cloud SQL Backups + PITR + Budget Alerts | متوسطة | 3 – 4 أيام | $14 – $28.50/شهر (السيناريو B) |
| **Phase E** | **P2 (التشغيل التجريبي والإطلاق)** | اختبارات الاختراق العابر للشركات (Cross-Tenant Pen-Test)، اختبارات استعادة النسخ (DR Drill)، ثم إطلاق تدريجي لـ 2 ثم 10 شركات | منخفضة | 3 – 5 أيام | $0 إضافي |

---

## تفاصيل كل مرحلة (الحالة، الحل، الاعتماديات، ومعايير القبول)

### Phase A (P0) — سد الثغرات الأمنية الحرجة وإغلاق الاختراق العابر للشركات
- **الخطورة:** `CRITICAL`
- **الحالة الحالية:** مفتاح JWT افتراضي مكشوف، قبول `x-user-id` غير موثّق، `allowInternalDefaultIfNoHeader: true`، fallback `COMPANY_OWNER` في `/api/backups`، ومسارات `/api/store-sync` و`/api/lan-sync/*` مفتوحة بدون مصادقة.
- **الخطوات التفصيلية:**
  1. **إلزام سر التوقيع (`SEC-01`):** منع إقلاع الخادم في `NODE_ENV=production` إذا كان `SESSION_JWT_SECRET` غير مضبوط أو يطابق القيمة الافتراضية؛ تخزينه في Google Secret Manager.
  2. **إلغاء جميع مسارات تجاوز المصادقة (`SEC-02`):**
     - حذف fallback ترويسة `x-user-id` / `query.userId` في `resolveAuthenticatedActorFromRequest` و`analytics.routes.ts`.
     - إزالة `{ allowInternalDefaultIfNoHeader: true }` من جميع مسارات الكتابة والحذف في `server.ts`.
     - إزالة `resolveBackupActorOrLocalStore` في وضع Cloud SaaS وفرض `assertActorCompanyMatch(actor, targetCompanyId)` في جميع مسارات `/api/backups/*` (`SEC-03`).
  3. **تأمين المزامنة والشبكة (`SEC-04`, `SEC-07`):**
     - تعطيل `/api/store-sync` و`/api/lan-sync/*` افتراضياً عند التشغيل السحابي (`SAAS_CLOUD_MODE=true`) وحصر LAN Sync بتشغيل Electron المحلي خلف Pairing Token مشفّر.
     - تقييد CORS بمتغير `CORS_ALLOWED_ORIGINS`، وإضافة `helmet`، وخفض حد JSON العام من `50mb` إلى `2mb`.
- **التكلفة التقديرية:** `$0` (Secret Manager ضمن 6 أسرار مجانية).
- **الاعتماديات:** لا توجد اعتماديات خارجية — يجب تنفيذها **أولاً** قبل أي نشر.
- **معيار القبول (Exit Criteria):** نجاح مجموعة اختبارات أمان آلية تؤكد رفض أي طلب بدون توكن (401)، ورفض أي وصول عابر للشركات (403) عبر جميع المسارات (المنتجات، الفواتير، التحليلات، النسخ الاحتياطي، المزامنة).

---

### Phase B (P0) — قاعدة بيانات Multi-Tenant حقيقية (Schema + RLS + إلغاء `.data/*.json`)
- **الخطورة:** `CRITICAL`
- **الحالة الحالية:** 0 صفوف في `sales`/`customers`/`stock_movements`/`audit_logs` في PostgreSQL الحي، 0 سياسات RLS، 9 قيود `UNIQUE` عالمية تمنع تشارك الباركود وSKU وأكواد الفروع بين الشركات، ومستخدم التطبيق `ai_studio_app_user` يملك `pg_read_all_data`/`pg_write_all_data`.
- **الخطوات التفصيلية (Additive-First & Reversible):**
  1. **تنظيف وتوثيق الترحيل (Reviewed SQL Migration + Rollback):**
     - إضافة `company_id` للجداول الناقصة (`currencies`, `exchange_rates`, `units_of_measure`, `custom_field_definitions`, `product_barcodes`, `product_unit_conversions`, `product_custom_field_values`, `sale_items`, `purchase_items`, `return_items`, `branch_transfer_items`, `payments`, `intelligence_lifecycle_events`).
     - تحويل جميع قيود `UNIQUE` العالمية إلى قيود مركّبة `(company_id, ...)` مثل `(company_id, barcode)` و`(company_id, sku)` و`(company_id, code)`.
     - إضافة الجداول الناقصة: `company_memberships`، `branch_inventory`، `pos_devices`، `sync_cursors`.
     - استكمال أعمدة جدول `sales` (العملة، سعر الصرف وقت البيع، المدفوع، المتبقي، حالة الدفع) وجدول `debt_settlements`.
  2. **تشديد صلاحيات PostgreSQL وتفعيل RLS (`SEC-05`):**
     - إنشاء دور تطبيق مقيد (بدون `pg_read_all_data` و`pg_write_all_data`، وبدون `UPDATE/DELETE` على `audit_logs` و`DELETE` على `companies`).
     - تفعيل `ENABLE + FORCE ROW LEVEL SECURITY` على جميع جداول المستأجرين، وتغليف كل طلب موثّق بدالة `withTenantTransaction(companyId, async (tx) => ...)` تضبط `SET LOCAL app.current_company_id = $1`.
     - ضبط `statement_timeout = '15s'` و`idle_in_transaction_session_timeout = '30s'`.
     - جعل حجم مجمع الاتصالات قابلاً للضبط (`DB_POOL_MAX=5`) ليتوافق مع حد اتصالات Cloud SQL (`max_connections=50`).
  3. **استبدال `.data/*.json` بمستودعات PostgreSQL الذرية (`MT-03`, `MT-10`):**
     - تنفيذ `sales-repo.ts`، `customers-repo.ts`، `inventory-repo.ts`، `expenses-repo.ts`، `accounting-repo.ts`، وربط `release-onboarding.service.ts` و`audit_logs` بـ PostgreSQL حصراً في الإنتاج، مع قفل صفوف `branch_inventory` عبر `SELECT ... FOR UPDATE` داخل `db.transaction()`.
- **التكلفة التقديرية:** `$0` (على نسخة Cloud SQL القائمة).
- **الاعتماديات:** Phase A + نسخة احتياطية كاملة مُتحقق منها قبل تطبيق أي Migration.
- **معيار القبول:** اختبار عملي لشركتين تبيعان نفس الباركود (`628100000001`) بأسعار وصرف مختلفين، وتأكيد أن استعلاماً مقصوداً بدون `WHERE company_id` يُحجب تلقائياً بواسطة PostgreSQL RLS!

---

### Phase C (P1) — توحيد المصادقة (Firebase Auth) وإدارة الأجهزة ومزامنة Offline-First
- **الخطورة:** `CRITICAL / HIGH`
- **الحالة الحالية:** Firebase Auth مفصول عن الخادم؛ لا يوجد تسجيل للأجهزة؛ المزامنة تدفع لقطات كاملة (Last-Write-Wins)؛ SQLite على Android غير مشفّر.
- **الخطوات التفصيلية:**
  1. **توحيد الهوية (`MT-06`):**
     - تثبيت `firebase-admin` للتحقق من `Firebase ID Token` عبر `verifyIdToken(token)` (لا يتطلب IAM معقّداً) وربط `users.firebase_uid` بـ `company_memberships`.
     - إبقاء تبديل الكاشير السريع بالـ PIN عبر `POST /api/auth/switch-cashier` محصوراً بأجهزة مسجّلة وموثّقة في `pos_devices` (مع تجزئة `scrypt` الموجودة مسبقاً).
     - إيقاف تخزين لقطات المتجر الكاملة في Firestore والاكتفاء بـ Cloud SQL كمصدر وحيد للحقيقة.
  2. **إدارة الأجهزة (`MT-07`, `SEC-09`):**
     - واجهة تسجيل الجهاز وربطه بالفرع مع توكن جهاز وإمكانية إلغاء الصلاحية (Revoke) فورياً من لوحة المدير.
     - تقييد `cleartext` في Android عبر `network_security_config.xml` لشبكات LAN الخاصة فقط، وتفعيل تشفير SQLite (`androidIsEncryption: true` مع مفتاح محفوظ في Android Keystore).
  3. **طابور مزامنة ذري Offline-First (`MT-08`):**
     - إضافة جدول `sync_outbox` داخل `offline-sqlite-storage.ts` لحفظ الفواتير، تسديدات الديون، وحركات المخزون محلياً مع `idempotency_key` فريد.
     - إضافة مساري `POST /api/sync/batch` (معالجة ذرية مع Idempotency لمنع تكرار الفواتير) و`GET /api/sync/changes?sinceCursor=...` (سحب الفروقات فقط بدل سحب المتجر كاملاً).
- **التكلفة التقديرية:** `$0/شهر` (Firebase Auth مجاني حتى 50,000 MAU).
- **الاعتماديات:** Phase A وPhase B.
- **معيار القبول:** محاكاة بيع 10 فواتير بدون إنترنت من جهازين في نفس الفرع، ثم عودة الاتصال وتأكيد تطابق المخزون والمبالغ بدون أي فقدان أو تكرار (0 Duplicate Sales).

---

### Phase D (P1) — تغليف Cloud Run الإنتاجي وتفعيل Cloud Storage وCloud SQL PITR
- **الخطورة:** `CRITICAL / HIGH`
- **الحالة الحالية:** لا يوجد `Dockerfile` ولا `SIGTERM`؛ `/api/health` لا يفحص `SELECT 1`؛ النسخ الاحتياطية والصور مخزّنة محلياً/Base64؛ PITR معطّل (`archive_mode=off`).
- **الخطوات التفصيلية:**
  1. **تجهيز حاوية Cloud Run الإنتاجية:**
     - إنشاء `Dockerfile` متعدد المراحل (`node:22-alpine`) + `.dockerignore` + تجميع الخادم عبر `npm run server:bundle` وتشغيله مباشرة بـ `node dist-server/server.cjs` (بدلاً من `tsx` في الإنتاج لتقليل Cold Start والذاكرة).
     - إضافة معالج إغلاق آمن `SIGTERM`/`SIGINT` يغلق HTTP server و`pg.Pool` (`pool.end()`).
     - ترقية `/api/health` لينفذ `SELECT 1` فعلياً على Cloud SQL مع مهلة 3 ثوانٍ.
  2. **تفعيل Cloud Storage (`europe-west2`) (`SEC-06`, `SEC-08`):**
     - إنشاء Bucket خاص في `europe-west2` (Uniform Bucket-Level Access، منع الوصول العام) لمسارات:
       - `companies/<companyId>/media/...` (صور المنتجات وإشعارات الدفع عبر Signed URLs)
       - `companies/<companyId>/backups/...` (نسخ `.backup` المشفّرة إلزامياً بـ `AES-256-GCM` مع Lifecycle Policy 90 يوماً).
  3. **ترقية إعدادات نسخة Cloud SQL القائمة (بدون إنشاء نسخة جديدة):**
     - التأكد من الفئة الحالية في GCP Console، والترقية للسيناريو المختار (**السيناريو B الموصى به:** `Enterprise db-f1-micro` أو `db-g1-small` + Automated Daily Backups 14 يوماً + **تفعيل PITR 7 أيام**).
     - ربط Cloud Run بنسخة Cloud SQL عبر `--add-cloudsql-instances` (Unix Socket مجاني، **بدون VPC Connector**).
  4. **ضبط المراقبة وحماية الفوترة:**
     - ضبط Cloud Run على `--region=europe-west2 --min-instances=0 --max-instances=3 --memory=512Mi --cpu=1 --cpu-throttling`.
     - إعداد **Cloud Billing Budget Alerts** عند `$15` / `$25` / `$35` شهرياً، وسياسة تنظيف Artifact Registry (الاحتفاظ بآخر 3 صور فقط).
- **التكلفة التقديرية:** **$14 – $28.50/شهر** (السيناريو B) أو **$0.20 – $6.50/شهر** (السيناريو A للتجربة الأولية فقط).
- **الاعتماديات:** Phase A + B + C + موافقة المالك على تعديل إعدادات Cloud SQL وBilling.
- **معيار القبول:** نشر خدمة Staging على Cloud Run، إعادة تشغيل الحاوية (Scale to Zero ثم الاستيقاظ)، وتأكيد بقاء 100% من البيانات والنسخ الاحتياطية مع زمن استجابة مقبول و0 أخطاء 5xx.

---

### Phase E (P2) — التحقق النهائي، مناورة الاستعادة، والإطلاق التدريجي (Pilot Rollout)
- **الخطورة:** `MEDIUM`
- **الخطوات التفصيلية:**
  1. **اختبار اختراق عزل الشركات (Cross-Tenant Security Verification):** محاولة قراءة/تعديل/تنزيل بيانات الشركة (ب) باستخدام توكن الشركة (أ) عبر كل مسار API وتأكيد الرفض (403/404).
  2. **مناورة استعادة الكوارث (DR & PITR Drill):** اختبار استعادة نسخة مشفّرة من Cloud Storage إلى شركة جديدة واختبار PITR على نسخة اختبارية.
  3. **إطلاق مرحلي (Wave Rollout):**
     - الموجة 1: شركتان تجريبيتان (4 فروع، 10 مستخدمين) لمدة أسبوع لمراقبة استهلاك CPU/RAM والاتصالات والفاتورة اليومية.
     - الموجة 2: توسيع إلى 10 شركات (20 فرعاً، 50 مستخدماً) مع تقييم الحاجة للترقية من `db-f1-micro` إلى `db-g1-small`.
- **التكلفة التقديرية:** مشمولة في السيناريو B.
- **الاعتماديات:** اكتمال Phases A–D واجتياز قائمة Go/No-Go أدناه.

---

## قائمة التحقق الحاسمة قبل الإطلاق (Production Go / No-Go Checklist)

- [ ] **أمان الهوية:** لا يوجد أي مفتاح JWT افتراضي، ولا قبول لـ `x-user-id`، ولا `allowInternalDefaultIfNoHeader`، ولا fallback `COMPANY_OWNER`.
- [ ] **عزل الشركات:** PostgreSQL RLS مفعّل (`ENABLE + FORCE`) على كل جداول المستأجرين، وقيود `UNIQUE` مركّبة بـ `company_id`، وتم اجتياز اختبار العزل العابر للشركات.
- [ ] **عدم فقدان البيانات:** 0 اعتماد على `.data/*.json` في الإنتاج، وAutomated Backups + PITR مفعّلان على Cloud SQL، والنسخ الاحتياطية المشفّرة تُرفع إلى Cloud Storage.
- [ ] **العمل دون اتصال:** طابور `sync_outbox` مع `idempotency_key` مختبَر على Android وWindows وWeb بدون تكرار فواتير أو انحراف مخزون.
- [ ] **ضبط التكلفة:** `--min-instances=0`، `--max-instances=3`، بدون VPC Connector، وتنبيهات Cloud Billing Budget مفعّلة.
- [ ] **تنظيف بيانات الاختبار:** تنظيف/فصل بيانات الاختبار المتراكمة (182 صفاً في `companies`) قبل إدخال أول شركة عميلة حقيقية.

> **بانتظار موافقتكم الصريحة على اختيار السيناريو المالي (A أو B أو C) والموافقة على البدء بـ Phase A قبل إجراء أي تعديل برمجي أو قاعدي أو سحابي.**
