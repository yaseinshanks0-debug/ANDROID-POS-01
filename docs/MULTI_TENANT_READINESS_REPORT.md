# تقرير جاهزية تعدد المستأجرين — ANDROID-POS-01
# Multi-Tenant SaaS Readiness Report (Phase 2)

- **المشروع:** `ANDROID-POS-01` (Dqnamo POS)
- **الحجم المستهدف للإطلاق:** 10 شركات، 50 مستخدماً، 20 فرعاً، أجهزة نقاط بيع متعددة (Android / Windows / Web)، عمل Offline-First.
- **تاريخ التقييم:** 2026-11-19
- **درجة الجاهزية الإجمالية لـ Multi-Tenant SaaS:** **38% (نواة تصميم موجودة، لكن العزل الفعلي والاستمرارية غير مكتملين للإنتاج)**

---

## بطاقة تقييم المحاور العشرة (Phase 2 Scorecard)

| # | المحور | الدرجة | الحالة الحالية | الخطورة |
| :---: | :--- | :---: | :--- | :---: |
| 1 | **Multi-Tenant Architecture** | 35% | نموذج Shared-Database + `company_id` موجود جزئياً في المخطط، لكن 15 جدولاً بلا `company_id` وقيود `UNIQUE` عالمية تمنع تشارك الباركود/SKU/أسماء المستخدمين بين الشركات. | **CRITICAL** |
| 2 | **Company Isolation** | 20% | لا يوجد PostgreSQL RLS (0 سياسات). استعلامات المنتجات والعملات والمزامنة والنسخ الاحتياطي لا تفرض عزل الشركة من توكن موثّق. | **CRITICAL** |
| 3 | **User Memberships** | 40% | العلاقة حالياً 1:1 (`users.company_id` عمود مفرد) مع اسم مستخدم `UNIQUE` عالمياً؛ لا يوجد جدول `company_memberships` لدعم مستخدم/مالك/محاسب يعمل في أكثر من شركة. | **HIGH** |
| 4 | **Branch Management** | 50% | جدول `branches` و`assigned_branch_ids` موجودان، لكن `branches.code` فريد عالمياً، والمخزون مخزّن كعمود واحد `products.stock` بدلاً من رصيد مستقل لكل فرع (`branch_inventory`). | **HIGH** |
| 5 | **RBAC & Custom Permissions** | 65% | نظام قدرات غني ومفصّل (`src/lib/rbac-capabilities.ts`، أدوار نظام + صلاحيات مخصصة)، لكن التنفيذ على الخادم يُتجاوز عبر `x-user-id` و`allowInternalDefaultIfNoHeader` و`resolveBackupActorOrLocalStore`. | **CRITICAL** |
| 6 | **Device Management** | 15% | لا يوجد جدول `pos_devices` في PostgreSQL؛ تتبع الأجهزة يتم في الذاكرة فقط داخل `lan-sync.service.ts` (`heartbeatRegistry`) بلا تسجيل رسمي أو توكن جهاز أو إمكانية إلغاء جهاز مفقود. | **HIGH** |
| 7 | **Authentication Token Validation** | 30% | توجد دالتا HMAC-SHA256 JWT + شاشة دخول محلية/خادمية، لكن مفتاح التوقيع الافتراضي مكشوف، وFirebase Auth غير مربوط بـ Express، و`auth_sessions` في PostgreSQL يحتوي 0 صفوف. | **CRITICAL** |
| 8 | **Offline Synchronization** | 45% | حزمة `@capacitor-community/sqlite` و`offline-sqlite-storage.ts` موجودتان وممتازتان للتخزين المحلي، لكن المزامنة تعتمد على رفع لقطات كاملة (Full Snapshots) إلى ملفات JSON (`.data/store-state.json` و`lan-sync-state.json`) وليس على طابور عمليات ذري (`sync_outbox`) مع `idempotency_key` في PostgreSQL. | **CRITICAL** |
| 9 | **Backup & Restoration** | 55% | محرك دمج ذكي متقدم (`backup-merge-engine.ts`) مع `AES-256-GCM` وSHA-256، لكنه يقرأ/يكتب ملفات JSON محلية (`.data/backups/`) بدلاً من Cloud SQL + Cloud Storage، مع ثغرة عزل `companyId` في المسارات. | **CRITICAL** |
| 10 | **Audit Logging** | 30% | جدول `audit_logs` معرّف في PostgreSQL لكنه يحتوي **0 صفوف** فعلياً؛ التسجيل يتم فقط في ملف `.data/platform-onboarding-state.json` الذي يُمسح في Cloud Run. | **HIGH** |

---

## 1. تحليل مخطط PostgreSQL الحي (35 جدولاً) وفجوات العزل

### أ. الجداول الموجودة فعلياً في PostgreSQL (تم التحقق عبر `pg_class` و`pg_stat_user_tables`)

| الفئة | الجداول | `company_id`؟ | RLS مفعّل؟ | الصفوف الحية التقريبية | الملاحظة المعمارية |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **هوية المستأجرين والفروع** | `companies`, `branches`, `roles`, `users`, `auth_sessions`, `store_settings` | نعم (عدا `companies`) | **لا** | `companies: 182`, `branches: 179`, `users: 137`, `roles: 1`, `store_settings: 1`, `auth_sessions: 0` | بيانات اختبار متراكمة في `companies/branches/users`؛ `auth_sessions` غير مستخدم فعلياً. |
| **المنتجات والكتالوج** | `categories`, `products`, `product_barcodes`, `product_unit_conversions`, `product_custom_field_values` | فقط `categories`, `products` | **لا** | `products: 124`, `product_barcodes: 126`, الباقي `0` | الجداول التابعة بلا `company_id` مباشر (يصعّب RLS)، والأخطر أن `sku` و`barcode` فريدان عالمياً! |
| **العملات والإعدادات المشتركة** | `currencies`, `exchange_rates`, `units_of_measure`, `custom_field_definitions` | **لا يوجد!** | **لا** | `exchange_rates: 93`, `custom_field_definitions: 18`, `currencies: 8`, `units_of_measure: 7` | **خطأ تصميم Multi-Tenant:** تغيير سعر الصرف أو الحقول المخصصة في شركة يؤثر على جميع الشركات الأخرى! |
| **المبيعات والمخزون والمحاسبة** | `sales`, `sale_items`, `payments`, `returns`, `return_items`, `customers`, `suppliers`, `purchases`, `purchase_items`, `stock_movements`, `branch_transfers`, `branch_transfer_items`, `expenses`, `accounts`, `journal_entries` | الجداول الرئيسية فقط | **لا** | **0 صفوف في جميع هذه الجداول!** | **دليل قاطع:** العمليات المالية والمخزنية لا تُكتب في PostgreSQL حالياً، بل في `.data/store-state.json` و`localStorage`. |
| **التحليلات والطلب والتدقيق** | `unmet_demand_requests`, `unmet_demand_fulfillments`, `intelligence_lifecycle_items`, `intelligence_lifecycle_events`, `audit_logs` | نعم (عدا `events`) | **لا** | `events: 32`, `items: 22`, `requests: 3`, `audit_logs: 0` | `dedupe_key` و`idempotency_key` فريدان عالمياً بدون `company_id`. |

### ب. قيود `UNIQUE` العالمية التي تمنع عمل 10 شركات على نفس القاعدة (Multi-Tenant Schema Blockers)

| الجدول والعمود | القيد الحالي في `src/db/schema.ts` | الأثر الفعلي عند تشغيل 10 شركات | التعديل المطلوب (مستقبلاً عبر Migration) |
| :--- | :--- | :--- | :--- |
| `products.sku` | `UNIQUE (sku)` | لا يمكن لشركتين استخدام نفس الكود مثل `ITEM-0001` | `UNIQUE (company_id, sku)` |
| `products.barcode` | `UNIQUE (barcode)` | **كارثي:** لا يمكن لمتجرين بيع نفس المنتج (مثل بيبسي أو سكر بنفس الباركود)! | `UNIQUE (company_id, barcode)` (مع `WHERE barcode IS NOT NULL`) |
| `product_barcodes.barcode` | `UNIQUE (barcode)` | نفس العطل الحرج عند تعدد الباركودات | إضافة `company_id` + `UNIQUE (company_id, barcode)` |
| `branches.code` | `UNIQUE (code)` | لا يمكن لشركتين استخدام كود فرع `MAIN` أو `BR-01` | `UNIQUE (company_id, code)` |
| `users.username` | `UNIQUE (username)` | لا يمكن لشركتين استخدام اسم مستخدم `admin` أو `cashier1` | `UNIQUE (company_id, username)` (أو بريد Firebase فريد عالمياً + `company_memberships`) |
| `categories.slug` | `UNIQUE (slug)` | لا يمكن لشركتين امتلاك تصنيف `general` أو `drinks` | `UNIQUE (company_id, slug)` |
| `sales.transaction_id` & `idempotency_key` | `UNIQUE` عالمي | خطر تصادم أرقام الفواتير بين الشركات | `UNIQUE (company_id, transaction_id)` و`UNIQUE (company_id, idempotency_key)` |
| `purchases.purchase_number` / `branch_transfers.transfer_number` | `UNIQUE` عالمي | تصادم تسلسل أرقام المشتريات والتحويلات بين الشركات | `UNIQUE (company_id, purchase_number)` و`UNIQUE (company_id, transfer_number)` |
| `currencies`, `exchange_rates`, `custom_field_definitions`, `units_of_measure` | بدون `company_id` | تلوث أسعار الصرف والحقول المخصصة بين الشركات | إضافة `company_id` مع فهرسة مركبة `(company_id, ...)` |

---

## 2. تفصيل الفجوات العشر في جاهزية SaaS (مع الأولوية والتكلفة والاعتماديات)

| الرمز | البند | الخطورة (Severity) | الحالة الحالية (Current Status) | الحل الموصى به (Recommended Solution) | التكلفة التقديرية | الاعتماديات (Dependencies) |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| **MT-01** | **قيود التفرد العالمية وعزل الجداول** | **CRITICAL** | 9 قيود `UNIQUE` عالمية + 4 جداول إعدادات بلا `company_id` + 10 جداول تابعة بلا `company_id`. | ترقية مخطط Drizzle عبر Migration آمن (Additive-First) لتحويل جميع القيود إلى مركّبة مع `company_id`، وإضافة `company_id` لجداول العملات وأسعار الصرف والوحدات والحقول المخصصة والجداول التابعة. | **$0** | مراجعة SQL Migration + خطة Rollback |
| **MT-02** | **غياب PostgreSQL RLS وعزل التطبيق** | **CRITICAL** | 0 سياسات RLS؛ `products-repo.ts` و`currencies-repo.ts` لا ترسل `company_id`؛ `shared-store-sync.ts` تسرّب السجلات عند غياب `companyId`. | فرض `company_id` مستخرج حصراً من التوكن الموثّق في كل Repository + تفعيل PostgreSQL RLS (`USING (company_id = current_setting('app.current_company_id', true))`) كخط دفاع ثانٍ (Defense-in-Depth). | **$0** | MT-01 + دور DB مقيد بدون `pg_read_all_data` |
| **MT-03** | **إلغاء ملفات `.data/*.json` كمصدر بيانات** | **CRITICAL** | المبيعات والعملاء والمخزون والحسابات والجلسات والشركات تُكتب في `.data/*.json` (أكثر من 1.7 MB حالياً)، مما يسبب فقدان بيانات وSplit-Brain عند تشغيل أكثر من حاوية Cloud Run. | استكمال مستودعات PostgreSQL (`sales-repo`, `customers-repo`, `inventory-repo`, `expenses-repo`, `accounting-repo`, `platform-repo`) مع `db.transaction()`، ومنع fallback الملفات في `NODE_ENV=production`. | **$0** | MT-01 |
| **MT-04** | **عضويات المستخدمين (`company_memberships`)** | **HIGH** | المستخدم مرتبط بشركة واحدة فقط (`users.company_id`)، ولا يوجد ربط رسمي بـ `firebase_uid`. | إضافة جدول `company_memberships (id, user_id, company_id, role_id, custom_permissions, assigned_branch_ids, status)` وربط `users.firebase_uid` لدعم عمل المالك أو المحاسب في أكثر من شركة بأمان. | **$0** | MT-01 + توحيد المصادقة |
| **MT-05** | **المخزون متعدد الفروع (`branch_inventory`)** | **HIGH** | الكمية مخزّنة في عمود مفرد `products.stock`؛ عند وجود 20 فرعاً لـ 10 شركات، لا يمكن فصل رصيد فرع الخرطوم عن فرع أم درمان بدقة أو منع البيع السالب لكل فرع. | إضافة جدول `branch_inventory (company_id, branch_id, product_id, quantity_on_hand, reserved_qty, min_stock_alert, updated_at)` مع قفل صفوف `SELECT ... FOR UPDATE` داخل معاملة البيع والتحويل. | **$0** | MT-01 + `sales-repo` |
| **MT-06** | **توحيد المصادقة والتحقق من التوكن** | **CRITICAL** | يوجد نظامان منفصلان: Firebase Auth (غير مربوط بالخادم) + JWT مخصص بمفتاح افتراضي مكشوف + قبول `x-user-id` غير الموثّق. | اعتماد نموذج هجين نظيف وموحد: **Firebase Auth (Identity Provider)** لتسجيل دخول الموظفين والمالكين عبر `firebase-admin` (`verifyIdToken`)، مع جلسات POS قصيرة المدة موقّعة بمفتاح في Secret Manager فقط لتبديل الكاشير بالـ PIN على جهاز مسجّل وموثّق، وإلغاء قبول `x-user-id` تماماً. | **$0/شهر** (Firebase Free Tier حتى 50,000 MAU) | تثبيت `firebase-admin` + Secret Manager |
| **MT-07** | **إدارة الأجهزة ونقاط البيع (`pos_devices`)** | **HIGH** | لا يوجد تسجيل أو مصادقة للأجهزة؛ `deviceId` عشوائي من العميل، ولا يمكن إيقاف هاتف مسروق أو كاشير مفصول عن بُعد. | إنشاء جدول `pos_devices (id, company_id, branch_id, device_fingerprint, platform, name, status, last_sync_at, revoked_at)` وإصدار شهادة/توكن جهاز مرتبط بالشركة والفرع مع زر "إلغاء صلاحية الجهاز" من لوحة المدير. | **$0** | MT-01 + MT-06 |
| **MT-08** | **مزامنة Offline-First ذرية (Outbox Queue)** | **CRITICAL** | `offline-sqlite-storage.ts` ممتاز في حفظ البيانات محلياً، لكن المزامنة تدفع لقطة المتجر كاملةً (`POST /api/store-sync` / `lan-sync/push`) وتستخدم دمج "الأحدث يربح" (Last-Write-Wins) الذي يسبب تضارب أرصدة المخزون وفقدان تعديلات الفروع الأخرى! | بناء **Transactional Sync Outbox** محلياً في SQLite (`sync_outbox`: `event_id`, `idempotency_key`, `entity_type`, `payload`, `retry_count`, `status`) + مسار خادمي `POST /api/sync/batch` يعالج المبيعات وحركات المخزون كعمليات Delta ذرية (لا استبدال لقطات كاملة) مع Cursor-based Delta Pull (`GET /api/sync/changes?sinceCursor=...`). | **$0** | MT-03 + MT-05 + MT-07 |
| **MT-09** | **النسخ الاحتياطي والاستعادة السحابية** | **CRITICAL** | النسخ الاحتياطي المشفّر ممتاز وظيفياً، لكنه يحفظ في `.data/backups/` المؤقتة ويحتوي ثغرة `?companyId=` بلا تحقق، مع غياب PITR على Cloud SQL. | 1) تفعيل Automated Backups + PITR على Cloud SQL. 2) تخزين نسخ الشركات (`.backup` المشفّرة بـ AES-256-GCM) في Cloud Storage داخل مسار معزول `gs://<bucket>/companies/<companyId>/<backupId>.backup` مع Signed URLs مؤقتة (5 دقائق) وإلزام `assertActorCompanyMatch`. | **~$0.50 – $3/شهر** | GCS Bucket + Cloud SQL PITR + SEC-03 |
| **MT-10** | **سجل التدقيق غير القابل للتعديل (Audit Trail)** | **HIGH** | جدول `audit_logs` في PostgreSQL فارغ (0 صفوف) وجميع السجلات تُفقد في ملف JSON محلي. | تحويل `appendPlatformAuditLog` ليكتب مباشرةً في `audit_logs` داخل PostgreSQL مع منع `UPDATE/DELETE` لدور التطبيق على جدول `audit_logs` (Append-Only)، وتصدير سجلات الأمان المهيكلة إلى Cloud Logging. | **$0** (ضمن 50 GiB مجانية في Cloud Logging) | MT-03 + DB Role Hardening |

---

## 3. توصية معمارية لنموذج المزامنة (Android / Windows / Web)

للإطلاق بـ 10 شركات و20 فرعاً مع انقطاع متكرر للإنترنت:
1. **مصدر الحقيقة السحابي (Cloud Source of Truth):** Cloud SQL PostgreSQL فقط (بدون كتابة JSON في Cloud Run).
2. **التخزين المحلي على الجهاز:**
   - **Android:** `@capacitor-community/sqlite` (مع تفعيل التشفير `androidIsEncryption: true`).
   - **Windows (Electron):** SQLite محلي (`better-sqlite3` أو ملف SQLite محلي) متزامن مع Cloud Run API (مع إبقاء خيار Wi-Fi LAN Sync كوضع اختياري محلي داخل الفرع فقط ومغلق بتوكن إقران مشفّر).
   - **Web:** IndexedDB عبر `offline-sqlite-storage.ts` الموجود مع Outbox Queue.
3. **قاعدة منع تضارب المخزون والديون:**
   - الفواتير والدفعات وحركات المخزون تُرسل كأحداث **Append-Only** تحمل `idempotency_key` فريداً (`company_id + device_id + local_seq`)، ويعيد الخادم احتساب الرصيد الفعلي داخل معاملة PostgreSQL (`db.transaction`) بدلاً من استبدال قيمة `stock` برقم قادم من جهاز غير متصل!
